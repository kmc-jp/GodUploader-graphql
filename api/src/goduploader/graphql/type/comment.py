import graphene
from goduploader.db import session
from goduploader.graphql.dataloader import AccountLoader, IllustLoader
from goduploader.graphql.type.account import Account
from goduploader.model import Comment as CommentModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

account_loader = AccountLoader()


class Comment(SQLAlchemyObjectType):
    class Meta:
        model = CommentModel
        interfaces = (relay.Node,)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)
