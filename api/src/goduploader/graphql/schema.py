import graphene
from goduploader.graphql.type.account import Account
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.comment import Comment
from goduploader.graphql.type.illust import Illust
from goduploader.graphql.type.like import Like
from goduploader.graphql.type.mutation import Mutation
from goduploader.graphql.type.query import Query
from goduploader.graphql.type.tag import Tag

__all__ = ["Account", "Artwork", "Comment", "Illust", "Like", "Tag"]


schema = graphene.Schema(query=Query, mutation=Mutation)
