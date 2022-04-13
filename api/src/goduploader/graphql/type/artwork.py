from typing import Optional

import graphene
from goduploader.db import session
from goduploader.graphql.dataloader import AccountLoader, IllustLoader
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.illust import Illust
from goduploader.model.artwork import Account as AccountModel, ArtworkRatingEnum as ArtworkRatingEnumType
from goduploader.model import Artwork as ArtworkModel
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType
from sqlalchemy.sql.expression import and_, desc

from goduploader.graphql.type.artwork_rating_enum import ArtworkRatingEnum

account_loader = AccountLoader()
illust_loader = IllustLoader()


class Artwork(SQLAlchemyObjectType):
    class Meta:
        model = ArtworkModel
        interfaces = (relay.Node,)
        exclude_fields = ('rating',)

    nsfw = graphene.Boolean(required=True)

    def resolve_nsfw(root: ArtworkModel, info):
        return root.rating != ArtworkRatingEnumType.safe

    rating = ArtworkRatingEnum(required=True)

    def resolve_rating(root: ArtworkModel, info):
        return root.rating

    account = graphene.Field(Account)

    def resolve_account(root: ArtworkModel, info):
        return account_loader.load(root.account_id)

    top_illust = graphene.Field(Illust)

    def resolve_top_illust(root: ArtworkModel, info):
        return root.top_illust

    next_artwork = graphene.Field(
        lambda: Artwork, description="この作品より1つ新しい、同じユーザーの作品を返す"
    )

    def resolve_next_artwork(root: ArtworkModel, info):
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

    def resolve_previous_artwork(root: ArtworkModel, info):
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

    editable = graphene.Field(
        graphene.Boolean, required=True, description="作品の情報を編集できるかどうかを返す"
    )

    def resolve_editable(root: ArtworkModel, info):
        if not info.context:
            # Requestオブジェクトが入っているのでここは通らないはず
            return False

        user: Optional[AccountModel] = info.context.user
        if not user:
            return False

        return root.user_can_edit(user)
