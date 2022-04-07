import re
from pathlib import Path

import httpretty


def _mock_gyazo_upload_request():
    # https://gyazo.com/api/docs/image#upload
    body = (Path(__file__).parent / "data/httpmock/gyazo_upload.json").read_text()
    httpretty.register_uri(
        httpretty.POST, "https://upload.gyazo.com/api/upload", body=body
    )


def _mock_slack_api():
    # https://api.slack.com/methods/chat.postMessage
    body = (
        Path(__file__).parent / "data/httpmock/slack_chat_postMessage.json"
    ).read_text()
    httpretty.register_uri(
        httpretty.POST, re.compile(r"^https://(www[.])?slack[.]com/api/chat[.]postMessage$"), body=body
    )


def mock_requests():
    httpretty.enable(allow_net_connect=False)
    # モックしたいAPIが増えたらここに追記してください
    _mock_gyazo_upload_request()
    _mock_slack_api()
