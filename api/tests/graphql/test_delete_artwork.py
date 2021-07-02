from goduploader.db import session
from goduploader.model import Account, Artwork, Tag
from graphene.relay import Node
from tests.util import create_account, create_artwork, mock_context

DELETE_ARTWORK_QUERY = """
mutation DeleteArtworkTestMutation ($id: ID!) {
    deleteArtwork(input: {id: $id}) {
        deletedArtworkId
    }
}
"""


def test_delete_artwork(client):
    account = create_account()

    artwork = create_artwork(account=account, tags=["test"])
    artwork_2 = create_artwork(tags=["test"])

    after_account = session.query(Account).filter_by(id=account.id).first()
    assert after_account.artworks_count == 1

    tag = session.query(Tag).filter_by(name="test").first()
    assert tag.artworks_count == 2

    result = client.execute(
        DELETE_ARTWORK_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "errors" not in result

    after_artwork = session.query(Artwork).filter_by(id=artwork.id).first()
    assert after_artwork is None

    after_account = session.query(Account).filter_by(id=account.id).first()
    assert after_account.artworks_count == 0

    after_tag = session.query(Tag).filter_by(name="test").first()
    assert after_tag.artworks_count == 1


def test_delete_artwork_can_owner_only(client):
    account_1 = create_account()
    account_2 = create_account()

    artwork = create_artwork(account=account_1)

    result = client.execute(
        DELETE_ARTWORK_QUERY,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
        context_value=mock_context(kmcid=account_2.kmcid),
    )
    assert result["errors"][0]["message"] == "You cannot delete this artwork"

    after_artwork = session.query(Artwork).filter_by(id=artwork.id).first()
    assert after_artwork is not None
