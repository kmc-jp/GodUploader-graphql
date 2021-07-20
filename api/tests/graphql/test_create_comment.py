from goduploader.db import session
from goduploader.model import Comment
from graphene.relay import Node
from tests.util import create_account, create_artwork, mock_context

CREATE_COMMENT_QUERY = """
mutation CreateCommentTestMutation($artworkId: ID!, $text: String!) {
    createComment(input: {artworkId: $artworkId, text: $text}) {
        comment {
            id
        }
    }
}
"""


def test_create_comment(client):
    account = create_account()
    artwork = create_artwork()

    result = client.execute(
        CREATE_COMMENT_QUERY,
        variable_values={
            "artworkId": Node.to_global_id("Artwork", artwork.id),
            "text": "こんにちは",
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "errors" not in result

    comment = session.query(Comment).filter_by(artwork_id=artwork.id).first()
    assert comment is not None
    assert comment.text == "こんにちは"


def test_create_comment_strip(client):
    account = create_account()
    artwork = create_artwork()

    result = client.execute(
        CREATE_COMMENT_QUERY,
        variable_values={
            "artworkId": Node.to_global_id("Artwork", artwork.id),
            "text": "      \nこんにちは  \r\n",
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "errors" not in result

    comment = session.query(Comment).filter_by(artwork_id=artwork.id).first()
    assert comment is not None
    assert comment.text == "こんにちは"
