from typing import List
import graphene
from goduploader.db import session
from goduploader.external_service.slack import get_all_public_channels
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.artwork import Artwork, ArtworkRatingEnum
from goduploader.graphql.type.tag import Tag
from goduploader.model import Account as AccountModel
from goduploader.model import Artwork as ArtworkModel
from goduploader.model import Tag as TagModel
from graphene import relay
from graphene.types.objecttype import ObjectType
from graphene_sqlalchemy import SQLAlchemyConnectionField
from sqlalchemy.sql.expression import and_, desc

from goduploader.graphql.type.artwork_rating_enum import ArtworkRatingEnum as ArtworkRatingEnumType


class SlackChannel(ObjectType):
    id = graphene.NonNull(graphene.String)
    name = graphene.NonNull(graphene.String)


class Query(ObjectType):
    node = relay.Node.Field()
    accounts = SQLAlchemyConnectionField(Account.connection)

    artworks = SQLAlchemyConnectionField(
        Artwork.connection,
        safe_only=graphene.Boolean(description="deprecated: ratingパラメータで絞り込んでください"),
        rating=graphene.List(graphene.NonNull(ArtworkRatingEnumType), description="取得する作品の年齢制限。複数指定できる。空リストは指定できない"),
    )

    def resolve_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query
        if args.get("safe_only"):
            artworks = artworks.filter(ArtworkModel.rating == ArtworkRatingEnum.safe)

        if args.get("rating"):
            rating: List[ArtworkRatingEnum] = args["rating"]
            if not rating:
                raise ValueError("ratingに空リストを指定できません")

            artworks = artworks.filter(ArtworkModel.rating.in_(rating))

        return artworks

    artwork_by_folder_id = graphene.Field(
        Artwork, description="for compatibility", folder_id=graphene.Int(required=True)
    )

    def resolve_artwork_by_folder_id(root, info, **args):
        return Artwork.get_query(info).filter_by(id=args["folder_id"]).first()

    viewer = graphene.Field(Account)

    def resolve_viewer(root, info):
        return info.context.user

    account_by_kmcid = graphene.Field(Account, kmcid=graphene.String(required=True))

    def resolve_account_by_kmcid(root, info, **args):
        return Account.get_query(info).filter_by(kmcid=args["kmcid"]).first()

    active_accounts = SQLAlchemyConnectionField(Account.connection)

    def resolve_active_accounts(root, info, **args):
        account_query = SQLAlchemyConnectionField.get_query(AccountModel, info, **args)
        accounts = account_query.filter(AccountModel.artworks_count > 0)
        return accounts

    tag_by_name = graphene.Field(Tag, name=graphene.String(required=True))

    def resolve_tag_by_name(root, info, **args):
        return (
            Tag.get_query(info)
            .filter_by(canonical_name=TagModel.canonicalize(args["name"]))
            .first()
        )

    tagged_artworks = SQLAlchemyConnectionField(
        Artwork.connection, tag=graphene.String(required=True)
    )

    def resolve_tagged_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query.join(ArtworkModel.tags, isouter=True).filter(
            TagModel.name.in_([args.get("tag")])
        )

        return artworks

    all_tags = SQLAlchemyConnectionField(Tag.connection)

    def resolve_all_tags(root, info, **args):
        tag_query = SQLAlchemyConnectionField.get_query(TagModel, info, **args)
        tags = tag_query.filter(TagModel.artworks_count > 0)

        return tags

    all_slack_channels = graphene.NonNull(graphene.List(SlackChannel))

    def resolve_all_slack_channels(root, info):
        return get_all_public_channels()
