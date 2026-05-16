from goduploader.config import app_config
from gyazo import Api

client = Api(access_token=app_config.gyazo_access_token)


def upload_image(account_name: str, user_page_url: str, filepath: str):
    with open(filepath, "rb") as f:
        image = client.upload_image(
            f,
            referer_url=user_page_url,
            title=f"GodIllustUploader {account_name}",
        )

    return image
