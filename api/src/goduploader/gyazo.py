import os
from goduploader.model import Artwork
from gyazo import Api

client = Api(access_token=os.environ.get("GYAZO_ACCESS_TOKEN"))


def upload_image(artwork: Artwork, filepath: str):
    if os.environ.get("TESTING"):
        return

    with open(filepath, "rb") as f:
        image = client.upload_image(
            f,
            referer_url=artwork.account.user_page_url,
            title=f"GodIllustUploader {artwork.account.name}",
        )

    return image
