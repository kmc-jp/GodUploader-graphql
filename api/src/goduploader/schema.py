from flask import request
import graphene
from graphene import relay
from graphene_file_upload.scalars import Upload
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
import os.path
from sqlalchemy.sql.elements import or_, not_
import uuid
from db import session
from model import (
    Account as AccountModel,
    ArtworkTagRelation as ArtworkTagRelationModel,
    Artwork as ArtworkModel,
    Comment as CommentModel,
    Illust as IllustModel,
    Like as LikeModel,
    Tag as TagModel,
)
from viewer import viewer
from dataloader import AccountLoader

account_loader = AccountLoader()

class Account(SQLAlchemyObjectType):
    class Meta:
        model = AccountModel
        interfaces = (relay.Node,)

class ArtworkTagRelation(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkTagRelationModel
        interfaces = (relay.Node,)

class Artwork(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkModel
        interfaces = (relay.Node,)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)

class Comment(SQLAlchemyObjectType):
    class Meta:
        model = CommentModel
        interfaces = (relay.Node,)

class Illust(SQLAlchemyObjectType):
    class Meta:
        model = IllustModel
        interfaces = (relay.Node,)

class Like(SQLAlchemyObjectType):
    class Meta:
        model = LikeModel
        interfaces = (relay.Node,)

class Tag(SQLAlchemyObjectType):
    class Meta:
        model = TagModel
        interfaces = (relay.Node,)

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    accounts = SQLAlchemyConnectionField(Account.connection)
    artworks = SQLAlchemyConnectionField(Artwork.connection)

    viewer = graphene.Field(Account)

    def resolve_viewer(self, info):
        return viewer()

    account_by_kmcid = graphene.Field(Account, kmcid=graphene.NonNull(graphene.String))

    def resolve_account_by_kmcid(self, info, **args):
        return Account.get_query(info).filter(AccountModel.kmcid == args['kmcid']).first()

    active_accounts = SQLAlchemyConnectionField(Account.connection)

    def resolve_active_accounts(self, info, **args):
        account_query = SQLAlchemyConnectionField.get_query(AccountModel, info, **args)
        accounts = account_query \
            .filter(AccountModel.artworks_count > 0)
        return accounts

    safe_artworks = SQLAlchemyConnectionField(Artwork.connection)

    def resolve_safe_artworks(self, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query \
            .join(ArtworkModel.tags, isouter=True) \
            .join(ArtworkTagRelationModel.tag, isouter=True) \
            .filter(or_(
                TagModel.name == None,
                not_(TagModel.name.in_(['R-18', 'R-18G'])))
            )

        return artworks

    tagged_artworks = SQLAlchemyConnectionField(Artwork.connection, tag=graphene.NonNull(graphene.String))

    def resolve_tagged_artworks(self, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query \
            .join(ArtworkModel.tags, isouter=True) \
            .join(ArtworkTagRelationModel.tag, isouter=True) \
            .filter(TagModel.name == args.get('tag'))

        return artworks

class LikeArtwork(relay.ClientIDMutation):
    class Input:
        artwork_id = graphene.ID(required=True)

    like = graphene.Field(Like)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = viewer()
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
        tags = graphene.String()
        files = Upload(required=True)

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, files, **input):
        current_user = viewer()
        if current_user is None:
            raise Exception('Please login')

        if not files:
            raise Exception('illusts required')

        artwork = ArtworkModel(
            title=input['title'],
            caption=input['caption'],
        )
        artwork.account = current_user
        session.add(artwork)

        for buf in request.files.values():
            _, ext = os.path.splitext(buf.filename)
            filename = f'{uuid.uuid4()}{ext}'
            buf.save(f'./public/illusts/{filename}')
            illust = IllustModel(
                filename=filename,
            )
            session.add(illust)
            artwork.illusts.append(illust)

        session.commit()

        return UploadArtwork(artwork=artwork)

class Mutation(graphene.ObjectType):
    like_artwork = LikeArtwork.Field()
    upload_artwork = UploadArtwork.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
