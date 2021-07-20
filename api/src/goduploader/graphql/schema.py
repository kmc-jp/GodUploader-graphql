import imghdr
import uuid
from typing import List

import graphene
import sqlalchemy
from goduploader.db import session
from goduploader.graphql.dataloader import AccountLoader, IllustLoader
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.comment import Comment
from goduploader.graphql.type.illust import Illust
from goduploader.model import Account as AccountModel
from goduploader.model import Artwork as ArtworkModel
from goduploader.model import Comment as CommentModel
from goduploader.model import Illust as IllustModel
from goduploader.model import Like as LikeModel
from goduploader.model import Tag as TagModel
from goduploader.slack import ShareOption as ShareOptionEnum
from goduploader.slack import get_all_public_channels, share_to_slack
from goduploader.tag import has_nsfw_tag, update_tag_relation
from goduploader.thumbnail import generate_thumbnail
from graphene import relay
from graphene.types.objecttype import ObjectType
from graphene_file_upload.scalars import Upload
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from sqlalchemy.sql.expression import and_, desc
from werkzeug.datastructures import FileStorage

account_loader = AccountLoader()
illust_loader = IllustLoader()


class Like(SQLAlchemyObjectType):
    class Meta:
        model = LikeModel
        interfaces = (relay.Node,)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)


class Tag(SQLAlchemyObjectType):
    class Meta:
        model = TagModel
        interfaces = (relay.Node,)


class SlackChannel(ObjectType):
    id = graphene.NonNull(graphene.String)
    name = graphene.NonNull(graphene.String)


class ArtworkWithBidirectionalPayload(ObjectType):
    previous = graphene.Field(Artwork)
    current = graphene.Field(Artwork)
    next = graphene.Field(Artwork)


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    accounts = SQLAlchemyConnectionField(Account.connection)

    artworks = SQLAlchemyConnectionField(
        Artwork.connection, safe_only=graphene.Boolean()
    )

    def resolve_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query
        if args.get("safe_only"):
            artworks = artworks.filter(ArtworkModel.nsfw == False)

        return artworks

    artwork_by_folder_id = graphene.Field(
        Artwork, description="for compatibility", folder_id=graphene.Int(required=True)
    )

    def resolve_artwork_by_folder_id(root, info, **args):
        return Artwork.get_query(info).filter_by(id=args["folder_id"]).first()

    artwork_with_bidirectional = graphene.Field(
        ArtworkWithBidirectionalPayload, id=graphene.ID(required=True)
    )

    def resolve_artwork_with_bidirectional(root, info, id):
        current: ArtworkModel = relay.Node.get_node_from_global_id(
            info, id, only_type=Artwork
        )
        if not current:
            return ArtworkWithBidirectionalPayload(
                previous=None, current=None, next=None
            )

        previous = (
            session.query(ArtworkModel)
            .filter(
                and_(
                    ArtworkModel.account_id == current.account_id,
                    ArtworkModel.id < current.id,
                )
            )
            .order_by(desc(ArtworkModel.id))
            .first()
        )
        next = (
            session.query(ArtworkModel)
            .filter(
                and_(
                    ArtworkModel.account_id == current.account_id,
                    ArtworkModel.id > current.id,
                )
            )
            .order_by(ArtworkModel.id)
            .first()
        )

        return ArtworkWithBidirectionalPayload(
            previous=previous, current=current, next=next
        )

    viewer = graphene.Field(Account)

    def resolve_viewer(root, info):
        return info.context.user

    account_by_kmcid = graphene.Field(Account, kmcid=graphene.String(required=True))

    def resolve_account_by_kmcid(root, info, **args):
        return Account.get_query(info).filter_by(kmcid=args["kmcid"]).first()

    active_accounts = SQLAlchemyConnectionField(Account.connection)

    def resolve_active_accounts(root, info, **args):
        account_query = SQLAlchemyConnectionField.get_query(AccountModel, info, **args)
        accounts = account_query.filter(AccountModel.artworks_count > 0)
        return accounts

    tag_by_name = graphene.Field(Tag, name=graphene.String(required=True))

    def resolve_tag_by_name(root, info, **args):
        return (
            Tag.get_query(info)
            .filter_by(canonical_name=TagModel.canonicalize(args["name"]))
            .first()
        )

    tagged_artworks = SQLAlchemyConnectionField(
        Artwork.connection, tag=graphene.String(required=True)
    )

    def resolve_tagged_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query.join(ArtworkModel.tags, isouter=True).filter(
            TagModel.name.in_([args.get("tag")])
        )

        return artworks

    all_tags = SQLAlchemyConnectionField(Tag.connection)

    def resolve_all_tags(root, info, **args):
        tag_query = SQLAlchemyConnectionField.get_query(TagModel, info, **args)
        tags = tag_query.filter(TagModel.artworks_count > 0)

        return tags

    all_slack_channels = graphene.NonNull(graphene.List(SlackChannel))

    def resolve_all_slack_channels(root, info):
        return get_all_public_channels()


class CreateComment(relay.ClientIDMutation):
    class Input:
        artwork_id = graphene.ID(description="コメントをする対象の作品ID", required=True)
        text = graphene.String(description="コメントの本文", required=True)

    comment = graphene.Field(Comment)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["artwork_id"]
        artwork = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        text = input["text"].strip()
        if not text:
            raise Exception("Comment text is required")

        comment = CommentModel(
            account_id=current_user.id,
            artwork_id=artwork.id,
            text=text,
        )
        session.add(comment)
        session.commit()

        return CreateComment(comment=comment)


class LikeArtwork(relay.ClientIDMutation):
    class Input:
        artwork_id = graphene.ID(description="「いいね」をする対象の作品ID", required=True)

    like = graphene.Field(Like)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["artwork_id"]
        artwork = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        like = LikeModel(
            account_id=current_user.id,
            artwork_id=artwork.id,
        )
        session.add(like)

        session.commit()

        return LikeArtwork(like=like)


UploadArtworkShareOption = graphene.Enum.from_enum(ShareOptionEnum)


class UploadArtwork(graphene.ClientIDMutation):
    class Input:
        title = graphene.String(description="作品のタイトル", required=True)
        caption = graphene.String(description="作品の説明文", required=True)
        tags = graphene.List(
            graphene.NonNull(graphene.String), description="作品に付けるタグ", required=True
        )
        share_option = UploadArtworkShareOption(description="作品をSlackにシェアするかどうか")
        channel_id = graphene.String(description="投稿したことを共有するSlackチャンネルのID")
        files = graphene.List(
            graphene.NonNull(Upload),
            description="アップロードする画像 (GIF/PNG/JPEG形式)",
            required=True,
        )

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, files: List[FileStorage], **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        if not files:
            raise Exception("illusts required")

        artwork = ArtworkModel(
            title=input["title"],
            caption=input["caption"],
            nsfw=has_nsfw_tag(input["tags"]),
        )
        artwork.account = current_user
        session.add(artwork)

        share_option = UploadArtworkShareOption.get(input.get("share_option", 0))

        for buf in files:
            content = buf.stream.read()
            ext = imghdr.what(buf.filename, content)
            if ext not in {"gif", "png", "jpeg"}:
                raise Exception(
                    f"アップロードできるのはGIF, PNG, JPEG形式の画像のみです。{ext or '対応していない'}形式のファイルはアップロードできません"
                )

            filename = f"{uuid.uuid4()}.{ext}"
            illust = IllustModel(
                filename=filename,
            )

            illust_path = illust.image_path("full")
            thumbnail_path = illust.image_path("thumbnail")
            with open(illust_path, "wb") as dst:
                dst.write(content)

            generate_thumbnail(illust_path, thumbnail_path)

            session.add(illust)
            artwork.illusts.append(illust)

        update_tag_relation(artwork, input["tags"])

        current_user.artworks_count += 1

        top_illust = artwork.illusts[0]
        artwork.top_illust = top_illust

        session.commit()

        share_to_slack(
            artwork,
            top_illust.image_path("thumbnail"),
            share_option,
            input.get("channel_id"),
        )

        return UploadArtwork(artwork=artwork)


class UpdateArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="更新対象の作品のID", required=True)
        title = graphene.String(description="更新後のタイトル", required=True)
        caption = graphene.String(description="更新後の説明文", required=True)
        tags = graphene.List(
            graphene.NonNull(graphene.String), description="更新後のタグ", required=True
        )

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["id"]
        artwork = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        if artwork.account_id != current_user.id:
            raise Exception("You cannot update this artwork")

        artwork.title = input["title"]
        artwork.caption = input["caption"]
        artwork.nsfw = has_nsfw_tag(input["tags"])

        update_tag_relation(artwork, input["tags"])

        session.commit()

        return UpdateArtwork(artwork=artwork)


class DeleteArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="削除対象の作品のID", required=True)

    deleted_artwork_id = graphene.Field(graphene.ID)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["id"]
        artwork = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        if artwork.account_id != current_user.id:
            raise Exception("You cannot delete this artwork")

        for tag in artwork.tags:
            tag.artworks_count -= 1

        current_user.artworks_count -= 1

        session.delete(artwork)

        session.commit()

        return DeleteArtwork(deleted_artwork_id=artwork_id)


class UpdateAccount(graphene.ClientIDMutation):
    class Input:
        name = graphene.String(desciption="更新後の表示名", required=True)

    account = graphene.Field(Account)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        current_user.name = input["name"]

        session.commit()

        return UpdateAccount(account=current_user)


class UpdateTag(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="更新対象のタグのID", required=True)
        name = graphene.String(description="更新後のタグの表記", required=True)

    tag = graphene.Field(Tag)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        tag: TagModel = relay.Node.get_node_from_global_id(
            info, input["id"], only_type=Tag
        )
        if not tag:
            raise Exception("タグがありません")

        if tag.edit_freezed:
            raise Exception(f"タグ {tag.name} は編集できません")

        new_name = input["name"]

        tag.name = new_name
        tag.canonical_name = TagModel.canonicalize(new_name)

        try:
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            # UNIQUE constraint failed
            session.rollback()
            raise Exception(f"タグ {new_name} が既にあります")

        return UpdateTag(tag=tag)


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field(description="作品にコメントする")
    like_artwork = LikeArtwork.Field(description="作品に「いいね」をする")
    upload_artwork = UploadArtwork.Field(description="作品をアップロードする")
    update_artwork = UpdateArtwork.Field(description="作品の情報を更新する")
    delete_artwork = DeleteArtwork.Field(description="作品を削除する")
    update_account = UpdateAccount.Field(description="ユーザー情報を更新する")
    update_tag = UpdateTag.Field(description="タグの情報を更新する")


schema = graphene.Schema(query=Query, mutation=Mutation)
