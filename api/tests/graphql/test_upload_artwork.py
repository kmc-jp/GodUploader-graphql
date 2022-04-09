from pathlib import Path
from typing import List

import httpretty
import pytest
from goduploader.db import session
from goduploader.model import Account, Artwork, Illust, Tag
from graphene.relay.node import Node
from tests.util import create_account, mock_context
from werkzeug.datastructures import FileStorage

UPLOAD_ARTWORK_QUERY = """
    mutation UploadArtworkTestMutation (
        $files: [Upload!]!
        $title: String!,
        $caption: String!,
        $tags: [String!]!
        $shareOption: SlackShareOptionEnum = NONE,
        $channelId: String
    ) {
        uploadArtwork(input: {
            files: $files,
            title: $title,
            caption: $caption,
            tags: $tags,
            shareOption: $shareOption,
            channelId: $channelId
        }) {
            artwork {
                id
            }
        }
    }
"""


def test_upload_artwork(client):
    account = create_account()
    assert account.artworks_count == 0

    upload_src = Path(__file__).parent.parent / "data" / "me.png"

    result = client.execute(
        UPLOAD_ARTWORK_QUERY,
        variable_values={
            "files": [
                FileStorage(
                    stream=open(upload_src, "rb"),
                    filename="me.png",
                    content_type="image/png",
                )
            ],
            "title": "title",
            "caption": "caption",
            "tags": ["tag"],
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "data" in result
    assert "errors" not in result

    after_account = session.query(Account).filter_by(id=account.id).first()
    assert after_account.artworks_count == 1

    tag = session.query(Tag).filter_by(name="tag").first()
    assert tag.artworks_count == 1

    _, uploaded_artwork_id = Node.from_global_id(
        result["data"]["uploadArtwork"]["artwork"]["id"]
    )
    uploaded_artwork = session.query(Artwork).filter_by(id=uploaded_artwork_id).first()
    assert uploaded_artwork
    assert uploaded_artwork.top_illust

    uploaded_dst = Path(uploaded_artwork.top_illust.image_path("full"))
    assert (
        uploaded_dst.read_bytes() == upload_src.read_bytes()
    ), "file uploaded correctly"


@pytest.mark.parametrize(
    "source_file, can_upload",
    [
        ("me.png", True),
        ("me.jpg", True),
        ("me.gif", True),
        ("hello.txt", False),
    ],
)
def test_upload_artwork_filetype(client, source_file: str, can_upload: bool):
    account = create_account()
    assert account.artworks_count == 0

    upload_src = Path(__file__).parent.parent / "data" / source_file

    result = client.execute(
        UPLOAD_ARTWORK_QUERY,
        variable_values={
            "files": [
                FileStorage(
                    stream=open(upload_src, "rb"),
                    filename=source_file,
                )
            ],
            "title": "title",
            "caption": "caption",
            "tags": ["tag"],
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert ("errors" not in result) == can_upload


def test_upload_artwork_share_option_shate_to_slack_none(client):
    account = create_account()
    upload_src = Path(__file__).parent.parent / "data" / "me.png"

    result = client.execute(
        UPLOAD_ARTWORK_QUERY,
        variable_values={
            "files": [
                FileStorage(
                    stream=open(upload_src, "rb"),
                    filename="me.png",
                    content_type="image/png",
                )
            ],
            "title": "title",
            "caption": "caption",
            "tags": ["tag"],
            "shareOption": "NONE",
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "errors" not in result

    last_request = httpretty.last_request()
    assert isinstance(last_request, httpretty.HTTPrettyRequestEmpty)


def test_upload_artwork_share_option_shate_to_slack(client):
    account = create_account()
    upload_src = Path(__file__).parent.parent / "data" / "me.png"

    result = client.execute(
        UPLOAD_ARTWORK_QUERY,
        variable_values={
            "files": [
                FileStorage(
                    stream=open(upload_src, "rb"),
                    filename="me.png",
                    content_type="image/png",
                )
            ],
            "title": "title",
            "caption": "caption",
            "tags": ["tag"],
            "shareOption": "SHARE_TO_SLACK",
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "errors" not in result

    last_request = httpretty.last_request()
    assert last_request.host == "www.slack.com"
    assert last_request.path == "/api/chat.postMessage"


def test_upload_artwork_share_option_shate_to_slack_with_image(client):
    account = create_account()
    upload_src = Path(__file__).parent.parent / "data" / "me.png"

    result = client.execute(
        UPLOAD_ARTWORK_QUERY,
        variable_values={
            "files": [
                FileStorage(
                    stream=open(upload_src, "rb"),
                    filename="me.png",
                    content_type="image/png",
                )
            ],
            "title": "title",
            "caption": "caption",
            "tags": ["tag"],
            "shareOption": "SHARE_TO_SLACK_WITH_IMAGE",
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "errors" not in result

    # XXX: なぜか2回ずつリクエストが送信されているように見える
    latest_requests: List[httpretty.core.HTTPrettyRequest] = httpretty.latest_requests()
    assert latest_requests[0].host == "upload.gyazo.com"
    assert latest_requests[0].path == "/api/upload"
    assert latest_requests[2].host == "www.slack.com"
    assert latest_requests[2].path == "/api/chat.postMessage"
