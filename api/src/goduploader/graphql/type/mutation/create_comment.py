import graphene
from goduploader.db import session
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.comment import Comment
from goduploader.model import Comment as CommentModel
from graphene import relay


class CreateComment(relay.ClientIDMutation):
    class Input:
        artwork_id = graphene.ID(description="コメントをする対象の作品ID", required=True)
        text = graphene.String(description="コメントの本文", required=True)

    comment = graphene.Field(Comment)

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

        text = input["text"].strip()
        if not text:
            raise Exception("Comment text is required")

        comment = CommentModel(
            account_id=current_user.id,
            artwork_id=artwork.id,
            text=text,
        )
        session.add(comment)
        session.commit()

        return CreateComment(comment=comment)
