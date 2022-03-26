from typing import Optional

import graphene
from goduploader.db import session
from goduploader.graphql.type.artwork import Artwork
from goduploader.model.artwork import Artwork as ArtworkModel
from graphene import relay


class DeleteArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="削除対象の作品のID", required=True)

    deleted_artwork_id = graphene.Field(graphene.ID)

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

        if not artwork.can_edit(current_user):
            raise Exception("You cannot delete this artwork")

        for tag in artwork.tags:
            tag.artworks_count -= 1

        current_user.artworks_count -= 1

        session.delete(artwork)

        session.commit()

        return DeleteArtwork(deleted_artwork_id=artwork_id)
