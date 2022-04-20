import json
import re
from pathlib import Path

import httpretty


def _mock_gyazo_upload_request():
    # https://gyazo.com/api/docs/image#upload
    body = (Path(__file__).parent / "data/httpmock/gyazo_upload.json").read_text()
    httpretty.register_uri(
        httpretty.POST, "https://upload.gyazo.com/api/upload", body=body
    )


def _mock_slack_chat_postMessage():
    # https://api.slack.com/methods/chat.postMessage
    body = (
        Path(__file__).parent / "data/httpmock/slack_chat_postMessage.json"
    ).read_text()
    httpretty.register_uri(
        httpretty.POST,
        re.compile(r"^https://(www[.])?slack[.]com/api/chat[.]postMessage$"),
        body=body,
    )


def mock_requests():
    # モックしたいAPIが増えたらここに追記してください
    _mock_gyazo_upload_request()
    _mock_slack_chat_postMessage()


class TwitterAPIMock:
    def __init__(self):
        httpretty.register_uri(
            httpretty.POST,
            "https://upload.twitter.com/1.1/media/upload.json",
            body=self._wrap_handler(self._handle_media_upload),
        )
        httpretty.register_uri(
            httpretty.POST,
            "https://api.twitter.com/1.1/statuses/update.json",
            body=self._wrap_handler(self._handle_statuses_update),
        )

    def _wrap_handler(self, handler):
        return lambda *args: handler(*args)

    def _handle_media_upload(self, request, uri, response_headers):
        # https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-upload
        resp = {
            "media_id": 710511363345354753,
            "media_id_string": "710511363345354753",
            "media_key": "3_710511363345354753",
            "size": 11065,
            "expires_after_secs": 86400,
            "image": {"image_type": "image/jpeg", "w": 800, "h": 320},
        }
        return [200, response_headers, json.dumps(resp)]

    def _handle_statuses_update(self, request, uri, response_headers):
        # https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update
        resp = {
            "created_at": "Wed Oct 10 20:19:24 +0000 2018",
            "id": 1050118621198921700,
            "id_str": "1050118621198921728",
            "text": "To make room for more expression, we will now count all emojis as equal—including those with gender‍‍‍ ‍‍and skin t… https://t.co/MkGjXf9aXm",
            "source": '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
            "truncated": True,
            "in_reply_to_status_id": None,
            "in_reply_to_status_id_str": None,
            "in_reply_to_user_id": None,
            "in_reply_to_user_id_str": None,
            "in_reply_to_screen_name": None,
            "user": {
                "id": 6253282,
                "id_str": "6253282",
                "name": "Twitter API",
                "screen_name": "TwitterAPI",
                "location": "San Francisco, CA",
                "url": "https://developer.twitter.com",
                "description": "The Real Twitter API. Tweets about API changes, service issues and our Developer Platform. Don't get an answer? It's on my website.",
                "translator_type": "None",
                "derived": {
                    "locations": [
                        {
                            "country": "United States",
                            "country_code": "US",
                            "locality": "San Francisco",
                            "region": "California",
                            "sub_region": "San Francisco County",
                            "full_name": "San Francisco, California, United States",
                            "geo": {
                                "coordinates": [-122.41942, 37.77493],
                                "type": "point",
                            },
                        }
                    ]
                },
                "protected": False,
                "verified": True,
                "followers_count": 6172196,
                "friends_count": 12,
                "listed_count": 13003,
                "favourites_count": 31,
                "statuses_count": 3650,
                "created_at": "Wed May 23 06:01:13 +0000 2007",
                "utc_offset": None,
                "time_zone": None,
                "geo_enabled": False,
                "lang": "en",
                "contributors_enabled": False,
                "is_translator": None,
                "profile_background_color": "None",
                "profile_background_image_url": "None",
                "profile_background_image_url_https": "None",
                "profile_background_tile": None,
                "profile_link_color": "None",
                "profile_sidebar_border_color": "None",
                "profile_sidebar_fill_color": "None",
                "profile_text_color": "None",
                "profile_use_background_image": None,
                "profile_image_url": "None",
                "profile_image_url_https": "https://pbs.twimg.com/profile_images/942858479592554497/BbazLO9L_normal.jpg",
                "profile_banner_url": "https://pbs.twimg.com/profile_banners/6253282/1497491515",
                "default_profile": False,
                "default_profile_image": False,
                "following": None,
                "follow_request_sent": None,
                "notifications": None,
            },
            "geo": None,
            "coordinates": None,
            "place": None,
            "contributors": None,
            "is_quote_status": False,
            "extended_tweet": {
                "full_text": "To make room for more expression, we will now count all emojis as equal—including those with gender‍‍‍ ‍‍and skin tone modifiers 👍🏻👍🏽👍🏿. This is now reflected in Twitter-Text, our Open Source library. nnUsing Twitter-Text? See the forum post for detail: https://t.co/Nx1XZmRCXA",
                "display_text_range": [0, 277],
                "entities": {
                    "hashtags": [],
                    "urls": [
                        {
                            "url": "https://t.co/Nx1XZmRCXA",
                            "expanded_url": "https://twittercommunity.com/t/new-update-to-the-twitter-text-library-emoji-character-count/114607",
                            "display_url": "twittercommunity.com/t/new-update-t…",
                            "unwound": {
                                "url": "https://twittercommunity.com/t/new-update-to-the-twitter-text-library-emoji-character-count/114607",
                                "status": 200,
                                "title": "New update to the Twitter-Text library: Emoji character count",
                                "description": "Over the years, we have made several updates to the way that people can communicate on Twitter. One of the more notable changes made last year was to increase the number of characters per Tweet from 140 to 280 characters. Today, we continue to expand people’s ability to express themselves by announcing a change to the way that we count emojis. Due to the differences in the way written text and emojis are encoded, many emojis (including emojis where you can apply gender and skin tone) have count...",
                            },
                            "indices": [254, 277],
                        }
                    ],
                    "user_mentions": [],
                    "symbols": [],
                },
            },
            "quote_count": 0,
            "reply_count": 0,
            "retweet_count": 0,
            "favorite_count": 0,
            "entities": {
                "hashtags": [],
                "urls": [
                    {
                        "url": "https://t.co/MkGjXf9aXm",
                        "expanded_url": "https://twitter.com/i/web/status/1050118621198921728",
                        "display_url": "twitter.com/i/web/status/1…",
                        "indices": [117, 140],
                    }
                ],
                "user_mentions": [],
                "symbols": [],
            },
            "favorited": False,
            "retweeted": False,
            "possibly_sensitive": False,
            "filter_level": "low",
            "lang": "en",
        }
        return [200, response_headers, json.dumps(resp)]
