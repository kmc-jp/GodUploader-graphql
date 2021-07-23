import graphene
from goduploader.db import session
from goduploader.graphql.type.artwork import Artwork
from goduploader.tag import has_nsfw_tag, update_tag_relation
from graphene import relay


class UpdateArtwork(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="更新対象の作品のID", required=True)
        title = graphene.String(description="更新後のタイトル", required=True)
        caption = graphene.String(description="更新後の説明文", required=True)
        tags = graphene.List(
            graphene.NonNull(graphene.String), description="更新後のタグ", required=True
        )

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        artwork_id = input["id"]
        artwork = relay.Node.get_node_from_global_id(
            info, artwork_id, only_type=Artwork
        )
        if artwork is None:
            raise Exception("Artwork not found")

        if artwork.account_id != current_user.id:
            raise Exception("You cannot update this artwork")

        artwork.title = input["title"]
        artwork.caption = input["caption"]
        artwork.nsfw = has_nsfw_tag(input["tags"])

        update_tag_relation(artwork, input["tags"])

        session.commit()

        return UpdateArtwork(artwork=artwork)