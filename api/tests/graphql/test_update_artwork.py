from goduploader.db import session
from goduploader.model import Artwork, Tag
from graphene.relay import Node
from goduploader.model.artwork import ArtworkRatingEnum
from tests.util import create_account, create_artwork, mock_context

UPDATE_ARTWORK_QUERY = """
mutation UpdateArtworkTestMutation (
    $id: ID!,
    $title: String!,
    $caption: String!,
    $tags: [String!]!,
    $rating: ArtworkRatingEnum,
) {
    updateArtwork(input: {
        id: $id,
        title: $title,
        caption: $caption,
        tags: $tags,
        rating: $rating,
    }) {
        artwork {
            id
        }
    }
}
"""


def test_update_artwork_can_owner_only(client):
    account_1 = create_account()
    account_2 = create_account()

    artwork = create_artwork(account=account_1)

    result = client.execute(
        UPDATE_ARTWORK_QUERY,
        variable_values={
            "id": Node.to_global_id("Artwork", artwork.id),
            "title": "new title",
            "caption": "new caption",
            "tags": ["tag"],
        },
        context_value=mock_context(kmcid=account_2.kmcid),
    )
    assert result["errors"][0]["message"] == "You cannot update this artwork"

    after_artwork = session.query(Artwork).filter_by(id=artwork.id).first()
    assert after_artwork.title == artwork.title
    assert after_artwork.caption == artwork.caption


def test_update_artwork_rating(client):
    account = create_account()

    artwork = create_artwork(account=account)

    client.execute(
        UPDATE_ARTWORK_QUERY,
        variable_values={
            "id": Node.to_global_id("Artwork", artwork.id),
            "title": "new title",
            "caption": "new caption",
            "tags": [],
            "rating": "r_18",
        },
        context_value=mock_context(kmcid=account.kmcid),
    )

    after_artwork = session.query(Artwork).filter_by(id=artwork.id).first()
    assert after_artwork.rating == ArtworkRatingEnum.r_18


def test_update_artwork_tag(client):
    account = create_account()

    artwork = create_artwork(account=account, tags=["tag_1"])

    tag_1 = session.query(Tag).filter_by(name="tag_1").first()
    assert tag_1.artworks_count == 1

    client.execute(
        UPDATE_ARTWORK_QUERY,
        variable_values={
            "id": Node.to_global_id("Artwork", artwork.id),
            "title": "new title",
            "caption": "new caption",
            "tags": ["tag_2"],
        },
        context_value=mock_context(kmcid=account.kmcid),
    )

    tag_1 = session.query(Tag).filter_by(name="tag_1").first()
    assert tag_1.artworks_count == 0

    tag_2 = session.query(Tag).filter_by(name="tag_2").first()
    assert tag_2.artworks_count == 1
