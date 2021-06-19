from goduploader.config import GYAZO_ACCESS_TOKEN
from goduploader.model import Artwork
from gyazo import Api

client = Api(access_token=GYAZO_ACCESS_TOKEN)


def upload_image(artwork: Artwork, filepath: str):
    with open(filepath, "rb") as f:
        image = client.upload_image(
            f,
            referer_url=artwork.account.user_page_url,
            title=f"GodIllustUploader {artwork.account.name}",
        )

    return image
