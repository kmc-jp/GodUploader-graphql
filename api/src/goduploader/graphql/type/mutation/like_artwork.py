import graphene
from goduploader.db import session
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.like import Like
from goduploader.model import Like as LikeModel
from graphene import relay


class LikeArtwork(relay.ClientIDMutation):
    class Input:
        artwork_id = graphene.ID(description="「いいね」をする対象の作品ID", required=True)

    like = graphene.Field(Like)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["artwork_id"]
        artwork = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        like = LikeModel(
            account_id=current_user.id,
            artwork_id=artwork.id,
        )
        session.add(like)

        session.commit()

        return LikeArtwork(like=like)
