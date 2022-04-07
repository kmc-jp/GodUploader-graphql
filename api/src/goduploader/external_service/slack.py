from enum import Enum

from cacheout import Cache
from goduploader.config import app_config
from goduploader.external_service.gyazo import upload_image
from goduploader.model import Artwork
from slack_sdk.web.client import WebClient


class ShareOption(Enum):
    NONE = 0
    SHARE_TO_SLACK = 1
    SHARE_TO_SLACK_WITH_IMAGE = 2


def share_to_slack(
    artwork: Artwork, image_path: str, share_option=ShareOption.NONE, channel_id=None
):
    if app_config.testing:
        return

    if share_option == ShareOption.NONE:
        return

    image_url = None
    if share_option == ShareOption.SHARE_TO_SLACK_WITH_IMAGE:
        uploaded_image = upload_image(artwork, image_path)
        image_url = uploaded_image.url

    text = f"<{artwork.artwork_url}|*{artwork.title}*>"
    if artwork.caption:
        text += f"\n{artwork.caption}"
    if len(artwork.tags) > 0:
        tag_links = " ".join([f"<{t.artworks_url}|#{t.name}>" for t in artwork.tags])
        text += f"\n{tag_links}"

    blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": text,
            },
        },
    ]
    if image_url:
        blocks.append(
            {
                "type": "image",
                "image_url": image_url,
                "alt_text": artwork.title,
            },
        )

    data = {
        "username": "GodIllustUploader",
        "icon_emoji": ":godicon:",
        "text": f"{artwork.account.name}が新たな絵をアップロードなさいました！",
        "attachments": [
            {
                "blocks": blocks,
                "fallback": artwork.artwork_url,
            },
        ],
    }

    api = WebClient(token=app_config.slack_token)
    api.chat_postMessage(channel=channel_id, **data)


_cache = Cache(ttl=3600)

CACHE_KEY = "get_all_public_channels"


def get_all_public_channels():
    if _cache.has(CACHE_KEY):
        return _cache.get(CACHE_KEY)

    next_cursor = None
    all_channels = []

    api = WebClient(token=app_config.slack_token)

    for i in range(10):
        resp = api.conversations_list(
            cursor=next_cursor,
            exclude_archived=True,
            limit=1000,
            types="public_channel",
        )
        if not resp.data["ok"]:
            break

        channels = resp.data["channels"]
        if not channels:
            break

        all_channels += channels
        next_cursor = resp.data["response_metadata"]["next_cursor"]
        if not next_cursor:
            break

    _cache.set(CACHE_KEY, all_channels)

    return all_channels
