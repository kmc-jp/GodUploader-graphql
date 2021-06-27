from goduploader.model import Artwork
from tests.util import create_account, create_artwork, mock_context
from goduploader.db import session
from graphene.relay import Node


DELETE_ARTWORK_QUERY = """
mutation DeleteArtworkTestMutation ($id: ID!) {
    deleteArtwork(input: {id: $id}) {
        deletedArtworkId
    }
}
"""


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
