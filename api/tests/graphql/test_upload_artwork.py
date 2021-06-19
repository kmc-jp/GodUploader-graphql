from goduploader.db import session
from goduploader.model import Account, Tag
from pathlib import Path
from tests.util import create_account, mock_context
from werkzeug.datastructures import FileStorage


UPLOAD_ARTWORK_QUERY = """
    mutation UploadArtworkTestMutation (
        $files: [Upload!]!
        $title: String!,
        $caption: String!,
        $tags: [String!]!
        $channelId: String
    ) {
        uploadArtwork(input: {
            files: $files,
            title: $title,
            caption: $caption,
            tags: $tags,
            channelId: $channelId
        }) {
            artwork {
                id
            }
        }
    }
"""


def test_upload_artwork(client):
    account = create_account()
    assert account.artworks_count == 0

    result = client.execute(
        UPLOAD_ARTWORK_QUERY,
        variable_values={
            "files": [
                FileStorage(
                    stream=open(Path(__file__).parent.parent / "data" / "me.png", "rb"),
                    filename="me.png",
                    content_type="image/png",
                )
            ],
            "title": "title",
            "caption": "caption",
            "tags": ["tag"],
        },
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "data" in result
    assert "errors" not in result

    after_account = session.query(Account).filter_by(id=account.id).first()
    assert after_account.artworks_count == 1

    tag = session.query(Tag).filter_by(name="tag").first()
    assert tag.artworks_count == 1
