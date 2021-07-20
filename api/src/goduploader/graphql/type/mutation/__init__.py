import imghdr
import uuid
from typing import List

import graphene
import sqlalchemy
from goduploader.db import session
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.comment import Comment
from goduploader.graphql.type.like import Like
from goduploader.graphql.type.tag import Tag
from goduploader.model import Artwork as ArtworkModel
from goduploader.model import Comment as CommentModel
from goduploader.model import Illust as IllustModel
from goduploader.model import Like as LikeModel
from goduploader.model import Tag as TagModel
from goduploader.slack import ShareOption as ShareOptionEnum
from goduploader.slack import share_to_slack
from goduploader.tag import has_nsfw_tag, update_tag_relation
from goduploader.thumbnail import generate_thumbnail
from graphene import relay
from graphene_file_upload.scalars import Upload
from werkzeug.datastructures import FileStorage


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
