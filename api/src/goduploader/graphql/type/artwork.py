import graphene
from goduploader.db import session
from goduploader.graphql.dataloader import AccountLoader, IllustLoader
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.illust import Illust
from goduploader.model import Artwork as ArtworkModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType
from sqlalchemy.sql.expression import and_, desc

account_loader = AccountLoader()
illust_loader = IllustLoader()


class Artwork(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkModel
        interfaces = (relay.Node,)
        exclude_fields = ("top_illust_id",)

    account = graphene.Field(Account)

    def resolve_account(root, info):
        return account_loader.load(root.account_id)

    top_illust = graphene.Field(Illust)

    def resolve_top_illust(root, info):
        return illust_loader.load(root.top_illust_id)

    next_artwork = graphene.Field(
        lambda: Artwork, description="この作品より1つ新しい、同じユーザーの作品を返す"
    )

    def resolve_next_artwork(root, info):
        return (
            session.query(ArtworkModel)
            .filter(
                and_(
                    ArtworkModel.account_id == root.account_id,
                    ArtworkModel.id > root.id,
                )
            )
            .order_by(ArtworkModel.id)
            .first()
        )

    previous_artwork = graphene.Field(
        lambda: Artwork, description="この作品より1つ古い、同じユーザーの作品を返す"
    )

    def resolve_previous_artwork(root, info):
        return (
            session.query(ArtworkModel)
            .filter(
                and_(
                    ArtworkModel.account_id == root.account_id,
                    ArtworkModel.id < root.id,
                )
            )
            .order_by(desc(ArtworkModel.id))
            .first()
        )
