import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from model import (
    Account as AccountModel,
    Artwork as ArtworkModel,
    Comment as CommentModel,
    Illust as IllustModel,
    Like as LikeModel,
    Tag as TagModel,
)

class Account(SQLAlchemyObjectType):
    class Meta:
        model = AccountModel
        interfaces = (relay.Node,)

class Artwork(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkModel
        interfaces = (relay.Node,)

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

schema = graphene.Schema(query=Query)
