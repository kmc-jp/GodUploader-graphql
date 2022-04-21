import imghdr
import logging
import uuid
from typing import List

import graphene
from goduploader.db import session
from goduploader.external_service.slack import ShareOption as ShareOptionEnum
from goduploader.external_service.slack import share_to_slack
from goduploader.external_service.twitter import post_tweet
from goduploader.graphql.type.artwork import Artwork
from goduploader.graphql.type.artwork_rating_enum import ArtworkRatingEnum
from goduploader.image.thumbnail import generate_thumbnail
from goduploader.image.webp import generate_webp
from goduploader.model import Artwork as ArtworkModel
from goduploader.model import Illust as IllustModel
from goduploader.model.artwork import ArtworkRatingEnum as ArtworkRatingEnumType
from graphene_file_upload.scalars import Upload
from werkzeug.datastructures import FileStorage

from goduploader.model.tag import has_nsfw_tag


class SlackShareOptionEnum(graphene.Enum):
    class Meta:
        enum = ShareOptionEnum
        name = "SlackShareOptionEnum"
        description = "画像をアップロードする際にSlackに共有するかどうかを表すenum"


class TwitterShareOption(graphene.InputObjectType):
    share = graphene.Boolean(
        description="作品をTwitterに共有するかどうか。falseのときは共有されず、他のフィールドも無視される。", required=True
    )
    username = graphene.String(
        description="Twitterに共有する際の投稿者の表示名。空文字やnullのときはKMCIDが使われる"
    )


class UploadArtwork(graphene.ClientIDMutation):
    class Input:
        title = graphene.String(description="作品のタイトル", required=True)
        caption = graphene.String(description="作品の説明文", required=True)
        tags = graphene.List(
            graphene.NonNull(graphene.String), description="作品に付けるタグ", required=True
        )
        rating = ArtworkRatingEnum(description="更新後の年齢制限", required=True)
        share_option = SlackShareOptionEnum(description="作品をSlackにシェアするかどうか")
        channel_id = graphene.String(description="投稿したことを共有するSlackチャンネルのID")
        twitter_share_option = TwitterShareOption(
            description="Twitterへの共有設定。nullのときは共有しない"
        )
        files = graphene.List(
            graphene.NonNull(Upload),
            description="アップロードする画像 (GIF/PNG/JPEG形式)",
            required=True,
        )

    artwork = graphene.Field(Artwork)

    @classmethod
    def mutate_and_get_payload(cls, root, info, files: List[FileStorage], **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        if not files:
            raise Exception("illusts required")

        artwork = ArtworkModel(
            title=input["title"],
            caption=input["caption"],
            rating=ArtworkRatingEnum.get(input["rating"]),
        )
        artwork.account = current_user
        session.add(artwork)

        share_option = SlackShareOptionEnum.get(input.get("share_option", 0))

        for buf in files:
            content = buf.stream.read()
            ext = imghdr.what(buf.filename, content)
            if ext not in {"gif", "png", "jpeg"}:
                raise Exception(
                    f"アップロードできるのはGIF, PNG, JPEG形式の画像のみです。{ext or '対応していない'}形式のファイルはアップロードできません"
                )

            filename = f"{uuid.uuid4()}.{ext}"
            illust = IllustModel(
                filename=filename,
            )

            illust_path = illust.image_path("full")
            thumbnail_path = illust.image_path("thumbnail")
            webp_path = illust.image_path("webp")
            with open(illust_path, "wb") as dst:
                dst.write(content)

            generate_thumbnail(illust_path, thumbnail_path)
            generate_webp(illust_path, webp_path)

            session.add(illust)
            artwork.illusts.append(illust)

        artwork.update_tag_relation(input["tags"])

        current_user.artworks_count += 1

        top_illust = artwork.illusts[0]

        share_to_slack(
            artwork,
            top_illust.image_path("thumbnail"),
            share_option,
            input.get("channel_id"),
        )

        session.commit()

        _share_to_twitter(input, current_user, artwork)

        return UploadArtwork(artwork=artwork)


def _share_to_twitter(input, current_user, artwork):
    if not (
        input.get("twitter_share_option") and input["twitter_share_option"]["share"]
    ):
        return

    if artwork.rating != ArtworkRatingEnumType.safe:
        raise Exception("年齢制限のある作品をTwitterに共有することはできません")

    username: str = (
        input["twitter_share_option"].get("username", "").strip() or current_user.kmcid
    )
    message = _build_twitter_share_message(
        username,
        artwork.title,
    )
    try:
        post_tweet(message, artwork.top_illust.image_path("full"))
    except Exception as e:
        logging.error(e)


def _build_twitter_share_message(username: str, title: str) -> str:
    build_message_impl = (
        lambda username, title: f"{username}さんがイラストをアップロードしました！\nタイトル: {title}\n#KMC_Graphics"
    )
    base_message = build_message_impl(username, "")

    # すごく雑な近似で残り文字数を計算しています
    # https://developer.twitter.com/en/docs/counting-characters
    rest_length = 160 - len(base_message) - 23

    # オーバーしてたら省略
    if rest_length <= len(title):
        over_length = len(title) - rest_length
        title = title[:-over_length] + "…"

    return build_message_impl(username, title)
