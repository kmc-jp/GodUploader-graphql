from graphene.relay.node import Node
from goduploader.model.artwork import ArtworkRatingEnum
from tests.util import create_account, create_artwork, create_illust, mock_context

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


EDTIABLE_QUERY = """
    query EditableQuery($id: ID!) {
        node(id: $id) {
            ... on Artwork {
                editable
            }
        }
    }
"""


def test_editable_not_logged_in(client):
    artwork = create_artwork()
    result = client.execute(
        EDTIABLE_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
    )
    assert "data" in result
    assert "node" in result["data"]
    assert not result["data"]["node"]["editable"]


def test_editable_unknown_user(client):
    artwork = create_artwork()
    result = client.execute(
        EDTIABLE_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
        context_value=mock_context(),
    )
    assert "data" in result
    assert "node" in result["data"]
    assert not result["data"]["node"]["editable"]


def test_editable_mine(client):
    account = create_account()
    artwork = create_artwork(account=account)
    result = client.execute(
        EDTIABLE_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
        context_value=mock_context(account.kmcid),
    )
    assert "data" in result
    assert "node" in result["data"]
    assert result["data"]["node"]["editable"]


def test_editable_others(client):
    account = create_account()
    other_account = create_account()
    artwork = create_artwork(account=other_account)
    result = client.execute(
        EDTIABLE_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
        context_value=mock_context(account.kmcid),
    )
    assert "data" in result
    assert "node" in result["data"]
    assert not result["data"]["node"]["editable"]


TOP_ILLUST_QUERY = """
    query TopIllustQuery($id: ID!) {
        node(id: $id) {
            ... on Artwork {
                topIllust {
                    id
                }
            }
        }
    }
"""


def test_top_illust(client):
    artwork = create_artwork()
    create_illust(artwork)
    create_illust(artwork)
    result = client.execute(
        TOP_ILLUST_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
    )
    assert "data" in result
    assert "node" in result["data"]
    assert "topIllust" in result["data"]["node"]
    assert Node.from_global_id(result["data"]["node"]["topIllust"]["id"]) == (
        "Illust",
        str(artwork.illusts[0].id),
    )


NSFW_QUERY = """
    query RatingQuery($id: ID!) {
        node(id: $id) {
            ... on Artwork {
                nsfw
            }
        }
    }
"""


def test_nsfw_field_safe(client):
    safe_artwork = create_artwork(rating=ArtworkRatingEnum.safe)

    result = client.execute(
        NSFW_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", safe_artwork.id)},
    )

    assert not result["data"]["node"]["nsfw"]


def test_nsfw_field_r_18(client):
    safe_artwork = create_artwork(rating=ArtworkRatingEnum.r_18)

    result = client.execute(
        NSFW_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", safe_artwork.id)},
    )

    assert result["data"]["node"]["nsfw"]


def test_nsfw_field_r_18g(client):
    safe_artwork = create_artwork(rating=ArtworkRatingEnum.r_18g)

    result = client.execute(
        NSFW_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", safe_artwork.id)},
    )

    assert result["data"]["node"]["nsfw"]
