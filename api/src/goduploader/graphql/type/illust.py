import graphene
from goduploader.model import Illust as IllustModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType


class Illust(SQLAlchemyObjectType):
    class Meta:
        model = IllustModel
        interfaces = (relay.Node,)

    image_url = graphene.Field(graphene.String, required=True)

    def resolve_image_url(root: IllustModel, info):
        return root.image_url

    thumbnail_url = graphene.Field(graphene.String, required=True)

    def resolve_thumbnail_url(root: IllustModel, info):
        return root.thumbnail_url

    webp_url = graphene.Field(graphene.String, required=True)

    def resolve_webp_url(root: IllustModel, info):
        return root.webp_url
