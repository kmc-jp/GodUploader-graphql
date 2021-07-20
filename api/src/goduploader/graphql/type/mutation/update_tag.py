import graphene
import sqlalchemy
from goduploader.db import session
from goduploader.graphql.type.tag import Tag
from goduploader.model import Tag as TagModel
from graphene import relay


class UpdateTag(graphene.ClientIDMutation):
    class Input:
        id = graphene.ID(description="更新対象のタグのID", required=True)
        name = graphene.String(description="更新後のタグの表記", required=True)

    tag = graphene.Field(Tag)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        tag: TagModel = relay.Node.get_node_from_global_id(
            info, input["id"], only_type=Tag
        )
        if not tag:
            raise Exception("タグがありません")

        if tag.edit_freezed:
            raise Exception(f"タグ {tag.name} は編集できません")

        new_name = input["name"]

        tag.name = new_name
        tag.canonical_name = TagModel.canonicalize(new_name)

        try:
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            # UNIQUE constraint failed
            session.rollback()
            raise Exception(f"タグ {new_name} が既にあります")

        return UpdateTag(tag=tag)
