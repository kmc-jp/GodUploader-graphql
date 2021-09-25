from graphene.relay.node import Node
from tests.util import create_account, create_artwork

ARTWORK_WITH_BIDIRECTIONAL_QUERY = """
    query ArtworkWithBidirectionalTestQuery($id: ID!) {
        artworkWithBidirectional: node(id: $id) {
            id
            ... on Artwork {
                nextArtwork {
                    id
                }
                previousArtwork {
                    id
                }
            }
        }
    }
"""


def test_artwork_with_bidirectional(client):
    account = create_account()
    artworks = [
        create_artwork(account=account),
        create_artwork(account=account),
        create_artwork(account=account),
    ]

    result = client.execute(
        ARTWORK_WITH_BIDIRECTIONAL_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artworks[1].id)},
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "id": Node.to_global_id("Artwork", artworks[1].id),
        "nextArtwork": {"id": Node.to_global_id("Artwork", artworks[2].id)},
        "previousArtwork": {"id": Node.to_global_id("Artwork", artworks[0].id)},
    }


def test_artwork_with_bidirectional_previous_not_found(client):
    account = create_account()
    artworks = [
        create_artwork(account=account),
        create_artwork(account=account),
        create_artwork(account=account),
    ]

    result = client.execute(
        ARTWORK_WITH_BIDIRECTIONAL_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artworks[0].id)},
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "id": Node.to_global_id("Artwork", artworks[0].id),
        "nextArtwork": {"id": Node.to_global_id("Artwork", artworks[1].id)},
        "previousArtwork": None,
    }


def test_artwork_with_bidirectional_mine_only(client):
    account_1 = create_account()
    account_2 = create_account()
    artworks = [
        create_artwork(account=account_1),
        create_artwork(account=account_2),
        create_artwork(account=account_1),
        create_artwork(account=account_2),
        create_artwork(account=account_1),
    ]

    result = client.execute(
        ARTWORK_WITH_BIDIRECTIONAL_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artworks[2].id)},
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "id": Node.to_global_id("Artwork", artworks[2].id),
        "nextArtwork": {"id": Node.to_global_id("Artwork", artworks[4].id)},
        "previousArtwork": {"id": Node.to_global_id("Artwork", artworks[0].id)},
    }


def test_artwork_with_bidirectional_next_not_found(client):
    account = create_account()
    artworks = [
        create_artwork(account=account),
        create_artwork(account=account),
        create_artwork(account=account),
    ]

    result = client.execute(
        ARTWORK_WITH_BIDIRECTIONAL_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artworks[2].id)},
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] == {
        "id": Node.to_global_id("Artwork", artworks[2].id),
        "nextArtwork": None,
        "previousArtwork": {"id": Node.to_global_id("Artwork", artworks[1].id)},
    }


def test_artwork_with_bidirectional_not_found(client):
    result = client.execute(
        ARTWORK_WITH_BIDIRECTIONAL_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", 0)},
    )
    assert "data" in result
    assert "artworkWithBidirectional" in result["data"]
    assert result["data"]["artworkWithBidirectional"] is None
