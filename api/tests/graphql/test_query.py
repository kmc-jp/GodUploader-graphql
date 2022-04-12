import re
from pathlib import Path

import httpretty
from goduploader.model.artwork import ArtworkRatingEnum
from tests.util import create_artwork


def test_safe_artworks(client):
    safe_artwork = create_artwork(
        rating=ArtworkRatingEnum.safe
    )
    create_artwork(
        rating=ArtworkRatingEnum.r_18
    )
    create_artwork(
        rating=ArtworkRatingEnum.r_18g
    )
    query = """
    {
        safeArtworks: artworks(first: 8, safeOnly: true) {
            edges {
                node {
                    title
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "safeArtworks": {
                "edges": [{"node": {"title": safe_artwork.title}}],
            },
        },
    }, "only fetch safe artworks"


def test_tagged_artworks(client):
    artworks = [
        create_artwork(),
        create_artwork(tags=["foo"]),
        create_artwork(tags=["bar", "foo"]),
        create_artwork(tags=["bar"]),
    ]
    query = """
    {
        taggedArtworks(tag: "foo", sort: ID_ASC) {
            edges {
                node {
                    title
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "taggedArtworks": {
                "edges": [
                    {"node": {"title": artworks[1].title}},
                    {"node": {"title": artworks[2].title}},
                ],
            },
        },
    }


def _mock_slack_conversations_list():
    # https://api.slack.com/methods/conversations.list
    body = (
        Path(__file__).parent.parent / "data/httpmock/slack_conversations_list.json"
    ).read_text()
    httpretty.register_uri(
        httpretty.POST,
        re.compile(r"^https://(www[.])?slack[.]com/api/conversations[.]list$"),
        body=body,
    )


def test_all_slack_channels(client):
    _mock_slack_conversations_list()

    query = """
    {
        allSlackChannels {
            id
            name
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "allSlackChannels": [
                {
                    "id": "C012AB3CD",
                    "name": "general",
                },
                {"id": "C061EG9T2", "name": "random"},
            ]
        }
    }
