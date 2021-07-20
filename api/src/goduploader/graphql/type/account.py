from goduploader.model import Account as AccountModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType


class Account(SQLAlchemyObjectType):
    class Meta:
        model = AccountModel
        interfaces = (relay.Node,)
