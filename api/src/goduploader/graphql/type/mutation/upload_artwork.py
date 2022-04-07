import imghdr
import uuid
from typing import List

import graphene
from goduploader.db import session
from goduploader.external_service.slack import ShareOption as ShareOptionEnum
from goduploader.external_service.slack import share_to_slack
from goduploader.graphql.type.artwork import Artwork
from goduploader.image.thumbnail import generate_thumbnail
from goduploader.image.webp import generate_webp
from goduploader.model import Artwork as ArtworkModel
from goduploader.model import Illust as IllustModel
from goduploader.tag import has_nsfw_tag, update_tag_relation
from graphene_file_upload.scalars import Upload
from werkzeug.datastructures import FileStorage

UploadArtworkShareOption = graphene.Enum.from_enum(
    ShareOptionEnum, description="画像をアップロードする際にSlackに共有するかどうかを表すenum"
)


class UploadArtwork(graphene.ClientIDMutation):
    class Input:
        title = graphene.String(description="作品のタイトル", required=True)
        caption = graphene.String(description="作品の説明文", required=True)
        tags = graphene.List(
            graphene.NonNull(graphene.String), description="作品に付けるタグ", required=True
        )
        share_option = UploadArtworkShareOption(description="作品をSlackにシェアするかどうか")
        channel_id = graphene.String(description="投稿したことを共有するSlackチャンネルのID")
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
            nsfw=has_nsfw_tag(input["tags"]),
        )
        artwork.account = current_user
        session.add(artwork)

        share_option = UploadArtworkShareOption.get(input.get("share_option", 0))

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

        update_tag_relation(artwork, input["tags"])

        current_user.artworks_count += 1

        top_illust = artwork.illusts[0]

        session.commit()

        share_to_slack(
            artwork,
            top_illust.image_path("thumbnail"),
            share_option,
            input.get("channel_id"),
        )

        return UploadArtwork(artwork=artwork)
