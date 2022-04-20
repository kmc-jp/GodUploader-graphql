from os import PathLike
from goduploader.config import app_config
import tweepy


def _build_client():
    auth = tweepy.OAuth1UserHandler(
        app_config.twitter_consumer_key,
        app_config.twitter_consumer_secret,
        app_config.twitter_access_token,
        app_config.twitter_access_token_secret,
    )
    api = tweepy.API(auth)
    return api


def post_tweet(text: str, filepath: PathLike):
    api = _build_client()

    media = api.media_upload(filepath)

    api.update_status(status=text, media_ids=[media.media_id])
