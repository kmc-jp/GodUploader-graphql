import graphene
from goduploader.db import session
from goduploader.graphql.dataloader import AccountLoader, ArtworkLoader, IllustLoader
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.artwork import Artwork
from goduploader.model import Comment as CommentModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

account_loader = AccountLoader()
artwork_loader = ArtworkLoader()


class Comment(SQLAlchemyObjectType):
    class Meta:
        model = CommentModel
        interfaces = (relay.Node,)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)

    artwork = graphene.Field(Artwork)

    def resolve_artwork(root, info):
        return artwork_loader.load(root.artwork_id)
