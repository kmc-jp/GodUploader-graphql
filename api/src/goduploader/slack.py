from goduploader.config import SLACK_TOKEN, SLACK_WEBHOOK_URL
from goduploader.gyazo import upload_image
from enum import Enum
import requests
from slack_sdk.web.client import WebClient
from cacheout import Cache

from goduploader.model import Artwork

api = WebClient(token=SLACK_TOKEN)

class ShareOption(Enum):
    NONE = 0
    SHARE_TO_SLACK = 1
    SHARE_TO_SLACK_WITH_IMAGE = 2

def share_to_slack(artwork: Artwork, image_path: str, share_option=ShareOption.NONE, channel_id=None):
    if share_option == ShareOption.NONE:
        return

    image_url = None
    if share_option == ShareOption.SHARE_TO_SLACK_WITH_IMAGE:
        uploaded_image = upload_image(artwork.account, image_path)
        image_url = uploaded_image.url

    tag_names = ','.join([t.name for t in artwork.tags])

    text = f'{artwork.caption}\nタグ:{tag_names}\nURI:{artwork.artwork_url}'

    data = {
        'username': 'GodIllustUploader (graphql)',
        'icon_emoji': ':godicon:',
        'channel': channel_id,
        'text': f'{artwork.account.name}が新たな絵をアップロードなさいました！',
        'attachments': [
            {
                'title': artwork.title,
                'text': text,
                'image_url': image_url,
            },
        ],
    }
    resp = requests.post(SLACK_WEBHOOK_URL, data=data)
    resp.raise_for_status()

_cache = Cache(ttl=3600)

CACHE_KEY = 'get_all_public_channels'

def get_all_public_channels():
    if _cache.has(CACHE_KEY):
        return _cache.get(CACHE_KEY)

    next_cursor = None
    all_channels = []

    for i in range(10):
        resp = api.conversations_list(cursor=next_cursor, exclude_archived=True, limit=1000, types='public_channel')
        if not resp.data['ok']:
            break

        channels = resp.data['channels']
        if not channels:
            break

        all_channels += channels
        next_cursor = resp.data['response_metadata']['next_cursor']
        if not next_cursor:
            break

    _cache.set(CACHE_KEY, all_channels)

    return all_channels
