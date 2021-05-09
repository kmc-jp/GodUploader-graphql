import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from sqlalchemy.sql.elements import or_, not_
from model import (
    Account as AccountModel,
    ArtworkTagRelation as ArtworkTagRelationModel,
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

class ArtworkTagRelation(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkTagRelationModel
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
    artworks = SQLAlchemyConnectionField(Artwork.connection)

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

schema = graphene.Schema(query=Query)
