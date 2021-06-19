from goduploader.model import Account, Artwork
from tests.util import create_account, create_artwork, mock_context
from goduploader.db import session
from graphene.relay import Node


def test_update_artwork_can_owner_only(client):
    account_1 = create_account()
    account_2 = create_account()

    artwork = create_artwork(account=account_1)

    mutation = """
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
    result = client.execute(
        mutation,
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


def test_delete_artwork_can_owner_only(client):
    account_1 = create_account()
    account_2 = create_account()

    artwork = create_artwork(account=account_1)

    mutation = """
    mutation DeleteArtworkTestMutation ($id: ID!) {
        deleteArtwork(input: {id: $id}) {
            deletedArtworkId
        }
    }
    """
    result = client.execute(
        mutation,
        variable_values={"id": Node.to_global_id("Artwork", artwork.id)},
        context_value=mock_context(kmcid=account_2.kmcid),
    )
    assert result["errors"][0]["message"] == "You cannot delete this artwork"

    after_artwork = session.query(Artwork).filter_by(id=artwork.id).first()
    assert after_artwork is not None


def test_update_account(client):
    account_1 = create_account()
    account_2 = create_account()

    mutation = """
    mutation UpdateAccountTestMutation($name: String!) {
        updateAccount(input: {name: $name}) {
            account {
                id
            }
        }
    }
    """
    result = client.execute(
        mutation,
        variable_values={
            "name": "new name",
        },
        context_value=mock_context(kmcid=account_1.kmcid),
    )
    assert "errors" not in result

    after_account_1 = session.query(Account).filter_by(id=account_1.id).first()
    after_account_2 = session.query(Account).filter_by(id=account_2.id).first()

    assert after_account_1.name == "new name"
    assert after_account_2.name == account_2.name
