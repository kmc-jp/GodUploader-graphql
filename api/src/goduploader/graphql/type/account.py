from typing import Optional
import graphene
from goduploader.model import Account as AccountModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType


class Account(SQLAlchemyObjectType):
    class Meta:
        model = AccountModel
        interfaces = (relay.Node,)

    is_you = graphene.Boolean(required=True, description="ログインユーザーかどうか")

    def resolve_is_you(root: AccountModel, info):
        viewer: Optional[AccountModel] = info.context.user
        if viewer is None:
            return False

        return root.id == viewer.id
