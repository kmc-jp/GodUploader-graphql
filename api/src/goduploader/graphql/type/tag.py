from goduploader.model import Tag as TagModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType


class Tag(SQLAlchemyObjectType):
    class Meta:
        model = TagModel
        interfaces = (relay.Node,)
