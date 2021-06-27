from goduploader.model import Artwork
from tests.util import create_account, create_artwork, mock_context
from goduploader.db import session
from graphene.relay import Node

UPDATE_ARTWORK_QUERY = """
mutation UpdateArtworkTestMutation (
    $id: ID!,
    $title: String!,
    $caption: String!,
    $tags: [String!]!
) {
    updateArtwork(input: {
        id: $id,
        title: $title,
        caption: $caption,
        tags: $tags,
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


def test_update_artwork_nsfw(client):
    account = create_account()

    artwork = create_artwork(account=account)
    assert not artwork.nsfw

    client.execute(
        UPDATE_ARTWORK_QUERY,
        variable_values={
            "id": Node.to_global_id("Artwork", artwork.id),
            "title": "new title",
            "caption": "new caption",
            "tags": ["R-18"],
        },
        context_value=mock_context(kmcid=account.kmcid),
    )

    after_artwork = session.query(Artwork).filter_by(id=artwork.id).first()
    assert after_artwork.nsfw
