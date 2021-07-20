from goduploader.graphql.type.mutation.create_comment import CreateComment
from goduploader.graphql.type.mutation.delete_artwork import DeleteArtwork
from goduploader.graphql.type.mutation.like_artwork import LikeArtwork
from goduploader.graphql.type.mutation.update_account import UpdateAccount
from goduploader.graphql.type.mutation.update_artwork import UpdateArtwork
from goduploader.graphql.type.mutation.update_tag import UpdateTag
from goduploader.graphql.type.mutation.upload_artwork import UploadArtwork
from graphene import ObjectType


class Mutation(ObjectType):
    create_comment = CreateComment.Field(description="作品にコメントする")
    like_artwork = LikeArtwork.Field(description="作品に「いいね」をする")
    upload_artwork = UploadArtwork.Field(description="作品をアップロードする")
    update_artwork = UpdateArtwork.Field(description="作品の情報を更新する")
    delete_artwork = DeleteArtwork.Field(description="作品を削除する")
    update_account = UpdateAccount.Field(description="ユーザー情報を更新する")
    update_tag = UpdateTag.Field(description="タグの情報を更新する")
