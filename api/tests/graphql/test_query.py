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


def test_artwork_with_bidirectional(client):
    artworks = [
        create_artwork(),
        create_artwork(),
        create_artwork(),
    ]

    query = """
    query ArtworkWithBidirectionalTestQuery($id: ID!) {
        artworkWithBidirectional(id: $id) {
            previous { id }
            current { id }
            next { id }
        }
    }
    """
    result = client.execute(
        query, variable_values={"id": Node.to_global_id("Artwork", artworks[1].id)}
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "previous": {"id": Node.to_global_id("Artwork", artworks[0].id)},
        "current": {"id": Node.to_global_id("Artwork", artworks[1].id)},
        "next": {"id": Node.to_global_id("Artwork", artworks[2].id)},
    }


def test_artwork_with_bidirectional_previous_not_found(client):
    artworks = [
        create_artwork(),
        create_artwork(),
        create_artwork(),
    ]

    query = """
    query ArtworkWithBidirectionalTestQuery($id: ID!) {
        artworkWithBidirectional(id: $id) {
            previous { id }
            current { id }
            next { id }
        }
    }
    """
    result = client.execute(
        query, variable_values={"id": Node.to_global_id("Artwork", artworks[0].id)}
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "previous": None,
        "current": {"id": Node.to_global_id("Artwork", artworks[0].id)},
        "next": {"id": Node.to_global_id("Artwork", artworks[1].id)},
    }


def test_artwork_with_bidirectional_next_not_found(client):
    artworks = [
        create_artwork(),
        create_artwork(),
        create_artwork(),
    ]

    query = """
    query ArtworkWithBidirectionalTestQuery($id: ID!) {
        artworkWithBidirectional(id: $id) {
            previous { id }
            current { id }
            next { id }
        }
    }
    """
    result = client.execute(
        query, variable_values={"id": Node.to_global_id("Artwork", artworks[2].id)}
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "previous": {"id": Node.to_global_id("Artwork", artworks[1].id)},
        "current": {"id": Node.to_global_id("Artwork", artworks[2].id)},
        "next": None,
    }


def test_artwork_with_bidirectional_not_found(client):
    query = """
    query ArtworkWithBidirectionalTestQuery($id: ID!) {
        artworkWithBidirectional(id: $id) {
            previous { id }
            current { id }
            next { id }
        }
    }
    """
    result = client.execute(
        query, variable_values={"id": Node.to_global_id("Artwork", 0)}
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "previous": None,
        "current": None,
        "next": None,
    }
