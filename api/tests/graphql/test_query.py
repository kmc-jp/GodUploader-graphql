from graphene.relay.node import Node
from tests.util import create_artwork


def test_safe_artworks(client):
    safe_artwork = create_artwork(
        nsfw=False,
    )
    unsafe_artwork = create_artwork(
        nsfw=True,
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
