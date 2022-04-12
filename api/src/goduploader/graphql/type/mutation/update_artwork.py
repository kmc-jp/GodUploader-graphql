from typing import Optional

import graphene
from goduploader.db import session
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.artwork_rating_enum import ArtworkRatingEnum
from goduploader.model.artwork import Artwork as ArtworkModel
from graphene import relay

from goduploader.model.tag import has_nsfw_tag


class UpdateArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="更新対象の作品のID", required=True)
        title = graphene.String(description="更新後のタイトル", required=True)
        caption = graphene.String(description="更新後の説明文", required=True)
        tags = graphene.List(
            graphene.NonNull(graphene.String), description="更新後のタグ", required=True
        )
        rating = ArtworkRatingEnum(description="更新後の年齢制限 (2022/4/12時点では指定しても何も起こらない)")

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["id"]
        artwork: Optional[ArtworkModel] = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        if not artwork.user_can_edit(current_user):
            raise Exception("You cannot update this artwork")

        artwork.title = input["title"]
        artwork.caption = input["caption"]
        artwork.nsfw = has_nsfw_tag(input["tags"])
        if input.get("rating") is not None:
            artwork.rating = ArtworkRatingEnum.get(input["rating"])

        artwork.update_tag_relation(input["tags"])

        session.commit()

        return UpdateArtwork(artwork=artwork)
