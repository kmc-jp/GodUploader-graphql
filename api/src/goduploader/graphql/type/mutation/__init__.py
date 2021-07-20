import graphene
import sqlalchemy
from goduploader.db import session
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.mutation.create_comment import CreateComment
from goduploader.graphql.type.mutation.delete_artwork import DeleteArtwork
from goduploader.graphql.type.mutation.like_artwork import LikeArtwork
from goduploader.graphql.type.mutation.update_artwork import UpdateArtwork
from goduploader.graphql.type.mutation.upload_artwork import UploadArtwork
from goduploader.graphql.type.tag import Tag
from goduploader.model import Tag as TagModel
from graphene import relay


class UpdateAccount(graphene.ClientIDMutation):
    class Input:
        name = graphene.String(desciption="更新後の表示名", required=True)

    account = graphene.Field(Account)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        current_user.name = input["name"]

        session.commit()

        return UpdateAccount(account=current_user)


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


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field(description="作品にコメントする")
    like_artwork = LikeArtwork.Field(description="作品に「いいね」をする")
    upload_artwork = UploadArtwork.Field(description="作品をアップロードする")
    update_artwork = UpdateArtwork.Field(description="作品の情報を更新する")
    delete_artwork = DeleteArtwork.Field(description="作品を削除する")
    update_account = UpdateAccount.Field(description="ユーザー情報を更新する")
    update_tag = UpdateTag.Field(description="タグの情報を更新する")
