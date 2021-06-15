from flask import request
import graphene
from graphene import relay
from graphene_file_upload.scalars import Upload
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
import os.path
from sqlalchemy.sql.elements import not_
import uuid
from goduploader.db import session
from goduploader.model import (
    Account as AccountModel,
    Artwork as ArtworkModel,
    Comment as CommentModel,
    Illust as IllustModel,
    Like as LikeModel,
    Tag as TagModel,
)
from goduploader.tag import has_nsfw_tag, update_tag_relation
from goduploader.viewer import viewer
from goduploader.graphql.dataloader import AccountLoader, IllustLoader
from goduploader.thumbnail import generate_thumbnail

account_loader = AccountLoader()
illust_loader = IllustLoader()

class Account(SQLAlchemyObjectType):
    class Meta:
        model = AccountModel
        interfaces = (relay.Node,)

class Illust(SQLAlchemyObjectType):
    class Meta:
        model = IllustModel
        interfaces = (relay.Node,)

class Artwork(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkModel
        interfaces = (relay.Node,)
        exclude_fields = ("top_illust_id",)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)

    top_illust = graphene.Field(Illust)

    def resolve_top_illust(root, info):
        return illust_loader.load(root.top_illust_id)

class Comment(SQLAlchemyObjectType):
    class Meta:
        model = CommentModel
        interfaces = (relay.Node,)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)

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

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    accounts = SQLAlchemyConnectionField(Account.connection)
    artworks = SQLAlchemyConnectionField(Artwork.connection)

    viewer = graphene.Field(Account)

    def resolve_viewer(root, info):
        return viewer(info.context)

    account_by_kmcid = graphene.Field(Account, kmcid=graphene.String(required=True))

    def resolve_account_by_kmcid(root, info, **args):
        return Account.get_query(info).filter_by(kmcid=args['kmcid']).first()

    active_accounts = SQLAlchemyConnectionField(Account.connection)

    def resolve_active_accounts(root, info, **args):
        account_query = SQLAlchemyConnectionField.get_query(AccountModel, info, **args)
        accounts = account_query \
            .filter(AccountModel.artworks_count > 0)
        return accounts

    safe_artworks = SQLAlchemyConnectionField(Artwork.connection)

    def resolve_safe_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query \
            .filter(not_(ArtworkModel.nsfw))

        return artworks

    tagged_artworks = SQLAlchemyConnectionField(Artwork.connection, tag=graphene.String(required=True))

    def resolve_tagged_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query \
            .join(ArtworkModel.tags, isouter=True) \
            .filter(TagModel.name.in_([args.get('tag')]))

        return artworks

    all_tags = SQLAlchemyConnectionField(Tag.connection)

    def resolve_all_tags(root, info, **args):
        tag_query = SQLAlchemyConnectionField.get_query(TagModel, info, **args)
        tags = tag_query \
            .filter(TagModel.artworks_count > 0)

        return tags

    tags_by_prefix = SQLAlchemyConnectionField(Tag.connection, prefix=graphene.String(required=True))

    def resolve_tags_by_prefix(root, info, **args):
        prefix = args.get('prefix').replace('\\', '\\\\').replace('%', r'\%').replace('_', r'\_')
        tag_query = SQLAlchemyConnectionField.get_query(TagModel, info, **args)

        tags = tag_query \
            .filter(TagModel.name.ilike(prefix + '%', escape='\\'))

        return tags


class CreateComment(relay.ClientIDMutation):
    class Input:
        artwork_id = graphene.ID(required=True)
        text = graphene.String(required=True)

    comment = graphene.Field(Comment)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = viewer(info.context)
        if current_user is None:
            raise Exception('Please login')

        artwork_id = input['artwork_id']
        artwork = relay.Node.get_node_from_global_id(info, artwork_id, only_type=Artwork)
        if artwork is None:
            raise Exception('Artwork not found')

        text = input['text'].strip()
        if not text:
            raise Exception('Comment text is required')

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
        artwork_id = graphene.ID(required=True)

    like = graphene.Field(Like)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = viewer(info.context)
        if current_user is None:
            raise Exception('Please login')

        artwork_id = input['artwork_id']
        artwork = relay.Node.get_node_from_global_id(info, artwork_id, only_type=Artwork)
        if artwork is None:
            raise Exception('Artwork not found')

        like = LikeModel(
            account_id=current_user.id,
            artwork_id=artwork.id,
        )
        session.add(like)

        session.commit()

        return LikeArtwork(like=like)

class UploadArtwork(graphene.ClientIDMutation):
    class Input:
        title = graphene.String(required=True)
        caption = graphene.String(required=True)
        tags = graphene.List(graphene.NonNull(graphene.String), required=True)
        files = Upload(required=True)

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, files, **input):
        current_user = viewer(info.context)
        if current_user is None:
            raise Exception('Please login')

        if not files:
            raise Exception('illusts required')

        artwork = ArtworkModel(
            title=input['title'],
            caption=input['caption'],
            nsfw=has_nsfw_tag(input['tags']),
        )
        artwork.account = current_user
        session.add(artwork)

        for buf in request.files.values():
            _, ext = os.path.splitext(buf.filename)
            filename = f'{uuid.uuid4()}{ext}'
            illust_path = f'../public/illusts/{filename}'
            thumbnail_path = f'../public/thumbnail/{filename}'
            buf.save(illust_path)

            generate_thumbnail(illust_path, thumbnail_path)

            illust = IllustModel(
                filename=filename,
            )
            session.add(illust)
            artwork.illusts.append(illust)

        update_tag_relation(artwork, input['tags'])

        current_user.artworks_count += 1

        session.commit()

        artwork.top_illust_id = artwork.illusts[0].id

        session.commit()

        return UploadArtwork(artwork=artwork)


class UpdateArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(required=True)
        title = graphene.String(required=True)
        caption = graphene.String(required=True)
        tags = graphene.List(graphene.NonNull(graphene.String), required=True)

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = viewer(info.context)
        if current_user is None:
            raise Exception('Please login')

        artwork_id = input['id']
        artwork = relay.Node.get_node_from_global_id(info, artwork_id, only_type=Artwork)
        if artwork is None:
            raise Exception('Artwork not found')

        if artwork.account_id != current_user.id:
            raise Exception('You cannot delete this artwork')

        artwork.title = input['title']
        artwork.caption = input['caption']
        update_tag_relation(artwork, input['tags'])

        session.commit()

        return UpdateArtwork(artwork=artwork)

class DeleteArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(required=True)

    deleted_artwork_id = graphene.Field(graphene.ID)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = viewer(info.context)
        if current_user is None:
            raise Exception('Please login')

        artwork_id = input['id']
        artwork = relay.Node.get_node_from_global_id(info, artwork_id, only_type=Artwork)
        if artwork is None:
            raise Exception('Artwork not found')

        if artwork.account_id != current_user.id:
            raise Exception('You cannot delete this artwork')

        for tag in artwork.tags:
            tag.artworks_count -= 1

        current_user.artworks_count -= 1

        session.delete(artwork)

        session.commit()

        return DeleteArtwork(deleted_artwork_id=artwork_id)


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    like_artwork = LikeArtwork.Field()
    upload_artwork = UploadArtwork.Field()
    update_artwork = UpdateArtwork.Field()
    delete_artwork = DeleteArtwork.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
