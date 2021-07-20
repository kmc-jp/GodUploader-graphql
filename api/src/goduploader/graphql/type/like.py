import graphene
from goduploader.graphql.dataloader import AccountLoader, IllustLoader
from goduploader.graphql.type.account import Account
from goduploader.model import Like as LikeModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

account_loader = AccountLoader()


class Like(SQLAlchemyObjectType):
    class Meta:
        model = LikeModel
        interfaces = (relay.Node,)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)
