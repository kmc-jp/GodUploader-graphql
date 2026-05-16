from dataclasses import dataclass
from enum import Enum
from typing import List

from cacheout import Cache
from goduploader.config import app_config
from goduploader.external_service.gyazo import upload_image
from slack_sdk.web.client import WebClient


class ShareOption(Enum):
    """Slackに共有しない"""
    NONE = 0
    """Slackにサムネイル無しで共有する"""
    SHARE_TO_SLACK = 1
    """Slackにサムネイル付きで共有する"""
    SHARE_TO_SLACK_WITH_IMAGE = 2


@dataclass
class TagSlackInfo:
    name: str
    artworks_url: str


@dataclass
class ArtworkSlackInfo:
    title: str
    caption: str
    artwork_url: str
    account_name: str
    account_user_page_url: str
    tags: List[TagSlackInfo]


def _build_web_client():
    return WebClient(token=app_config.slack_token)

def share_to_slack(
    artwork_info: ArtworkSlackInfo, image_path: str, share_option=ShareOption.NONE, channel_id=None
):
    if share_option == ShareOption.NONE:
        return

    image_url = None
    if share_option == ShareOption.SHARE_TO_SLACK_WITH_IMAGE:
        uploaded_image = upload_image(artwork_info.account_name, artwork_info.account_user_page_url, image_path)
        image_url = uploaded_image.url

    text = f"<{artwork_info.artwork_url}|*{artwork_info.title}*>"
    if artwork_info.caption:
        text += f"\n{artwork_info.caption}"
    if len(artwork_info.tags) > 0:
        tag_links = " ".join([f"<{t.artworks_url}|#{t.name}>" for t in artwork_info.tags])
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
                "alt_text": artwork_info.title,
            },
        )

    data = {
        "username": "GodIllustUploader",
        "icon_emoji": ":godicon:",
        "text": f"{artwork_info.account_name}が新たな絵をアップロードなさいました！",
        "attachments": [
            {
                "blocks": blocks,
                "fallback": artwork_info.artwork_url,
            },
        ],
    }

    api = _build_web_client()
    api.chat_postMessage(channel=channel_id, **data)


_cache = Cache(ttl=3600)

CACHE_KEY = "get_all_public_channels"


def get_all_public_channels():
    if _cache.has(CACHE_KEY):
        return _cache.get(CACHE_KEY)

    next_cursor = None
    all_channels = []

    api = _build_web_client()

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
