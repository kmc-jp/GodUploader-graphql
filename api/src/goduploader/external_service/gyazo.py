from goduploader.config import app_config
from goduploader.model import Artwork
from gyazo import Api

client = Api(access_token=app_config.gyazo_access_token)


def upload_image(artwork: Artwork, filepath: str):
    if app_config.testing:
        return

    with open(filepath, "rb") as f:
        image = client.upload_image(
            f,
            referer_url=artwork.account.user_page_url,
            title=f"GodIllustUploader {artwork.account.name}",
        )

    return image
