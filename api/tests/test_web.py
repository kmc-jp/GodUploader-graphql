import os
from graphene.relay.node import Node
from tests.util import create_artwork
import json
import pytest
from urllib.parse import quote
from goduploader.web import app


def test_graphql_get_not_allowed_no_content_type():
    client = app.test_client()
    query = quote(
        """
    {
        viewer {
            id
        }
    }
    """
    )
    resp = client.get(f"/api/graphql?query={query}")
    assert resp.status_code == 405, "Can't query with GET request"
    assert resp.json is None


def test_graphql_get_not_allowed_content_type():
    client = app.test_client()
    query = quote(
        """
    {
        viewer {
            id
        }
    }
    """
    )
    resp = client.get(
        f"/api/graphql?query={query}", headers={"Content-Type": "application/json"}
    )
    assert (
        resp.status_code == 405
    ), "Can't query with GET request (even if Content-Type header is present)"
    assert resp.json is None


def test_graphql_can_post():
    client = app.test_client()
    query = """
    {
        viewer {
            id
        }
    }
    """
    resp = client.post(
        f"/api/graphql",
        data=json.dumps({"query": query}),
        headers={"Content-Type": "application/json"},
    )
    assert resp.status_code == 200


@pytest.mark.parametrize(
    "referer",
    [
        "http://localhost:3000/test/",
        "http://localhost:3000/test/artwork/new",
        "http://localhost:3000/test/artwork/abcdefgh",
    ],
)
def test_mutation_referer_check_ok(referer):
    artwork = create_artwork()
    client = app.test_client()
    query = """
    mutation LikeArtworkMutation($artworkId: ID!) {
        likeArtwork(input: { artworkId: $artworkId }) {
            like {
                id
            }
        }
    }
    """
    headers = {"Content-Type": "application/json", "Referer": referer}

    resp = client.post(
        f"/api/graphql",
        data=json.dumps(
            {
                "query": query,
                "variables": {"artworkId": Node.to_global_id("Artwork", artwork.id)},
            }
        ),
        headers=headers,
    )
    result = resp.json
    assert "errors" not in result


@pytest.mark.parametrize(
    "referer",
    [
        None,
        "http://example.com/",
        "http://localhost:3000",
        "http://localhost:3000/",
        "http://localhost:3000/test2/",
        "http://localhost:3000/evil/",
    ],
)
def test_mutation_referer_check_ng(referer):
    artwork = create_artwork()
    client = app.test_client()
    query = """
    mutation LikeArtworkMutation($artworkId: ID!) {
        likeArtwork(input: { artworkId: $artworkId }) {
            like {
                id
            }
        }
    }
    """
    headers = {"Content-Type": "application/json"}
    if referer:
        headers["Referer"] = referer

    resp = client.post(
        f"/api/graphql",
        data=json.dumps(
            {
                "query": query,
                "variables": {"artworkId": Node.to_global_id("Artwork", artwork.id)},
            }
        ),
        headers=headers,
    )
    result = resp.json
    assert "errors" in result
    assert result["errors"][0]["message"].startswith("Referer check failed")
