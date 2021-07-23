import graphene
from goduploader.db import session
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.tag import Tag
from goduploader.model import Account as AccountModel
from goduploader.model import Artwork as ArtworkModel
from goduploader.model import Tag as TagModel
from goduploader.slack import get_all_public_channels
from graphene import relay
from graphene.types.objecttype import ObjectType
from graphene_sqlalchemy import SQLAlchemyConnectionField
from sqlalchemy.sql.expression import and_, desc


class SlackChannel(ObjectType):
    id = graphene.NonNull(graphene.String)
    name = graphene.NonNull(graphene.String)


class ArtworkWithBidirectionalPayload(ObjectType):
    previous = graphene.Field(Artwork)
    current = graphene.Field(Artwork)
    next = graphene.Field(Artwork)


class Query(ObjectType):
    node = relay.Node.Field()
    accounts = SQLAlchemyConnectionField(Account.connection)

    artworks = SQLAlchemyConnectionField(
        Artwork.connection, safe_only=graphene.Boolean()
    )

    def resolve_artworks(root, info, **args):
        artwork_query = SQLAlchemyConnectionField.get_query(ArtworkModel, info, **args)
        artworks = artwork_query
        if args.get("safe_only"):
            artworks = artworks.filter(ArtworkModel.nsfw == False)

        return artworks

    artwork_by_folder_id = graphene.Field(
        Artwork, description="for compatibility", folder_id=graphene.Int(required=True)
    )

    def resolve_artwork_by_folder_id(root, info, **args):
        return Artwork.get_query(info).filter_by(id=args["folder_id"]).first()

    artwork_with_bidirectional = graphene.Field(
        ArtworkWithBidirectionalPayload, id=graphene.ID(required=True)
    )

    def resolve_artwork_with_bidirectional(root, info, id):
        current: ArtworkModel = relay.Node.get_node_from_global_id(
            info, id, only_type=Artwork
        )
        if not current:
            return ArtworkWithBidirectionalPayload(
                previous=None, current=None, next=None
            )

        previous = (
            session.query(ArtworkModel)
            .filter(
                and_(
                    ArtworkModel.account_id == current.account_id,
                    ArtworkModel.id < current.id,
                )
            )
            .order_by(desc(ArtworkModel.id))
            .first()
        )
        next = (
            session.query(ArtworkModel)
            .filter(
                and_(
                    ArtworkModel.account_id == current.account_id,
                    ArtworkModel.id > current.id,
                )
            )
            .order_by(ArtworkModel.id)
            .first()
        )

        return ArtworkWithBidirectionalPayload(
            previous=previous, current=current, next=next
        )

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