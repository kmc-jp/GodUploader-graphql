from goduploader.config import SLACK_WEBHOOK_URL
from goduploader.gyazo import upload_image
from enum import Enum
import requests

from goduploader.model import Artwork

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
