from goduploader.db import session
from goduploader.model import Tag
from graphene.relay.node import Node
from tests.util import create_tag, mock_context


UPDATE_TAG_QUERY = """
    mutation UpdateTagTestMutation (
        $id: ID!,
        $name: String!
    ) {
        updateTag(input: {
            id: $id,
            name: $name
        }) {
            tag {
                id
                canonicalName
                name
            }
        }
    }
"""


def test_update_tag(client):
    tag = create_tag(name="Vtuber")
    assert tag.canonical_name == "vtuber"

    result = client.execute(
        UPDATE_TAG_QUERY,
        variable_values={
            "id": Node.to_global_id("Tag", tag.id),
            "name": "VTuber",
        },
        context_value=mock_context(),
    )
    assert "data" in result
    assert "errors" not in result

    updated_tag = session.query(Tag).filter_by(id=tag.id).first()
    assert updated_tag.name == "VTuber"
    assert updated_tag.canonical_name == "vtuber"


def test_update_tag_change_canonical_name(client):
    tag = create_tag(name="Vtuber")
    assert tag.canonical_name == "vtuber"

    result = client.execute(
        UPDATE_TAG_QUERY,
        variable_values={
            "id": Node.to_global_id("Tag", tag.id),
            "name": "バーチャルYouTuber",
        },
        context_value=mock_context(),
    )
    assert "data" in result
    assert "errors" not in result

    updated_tag = session.query(Tag).filter_by(id=tag.id).first()
    assert updated_tag.name == "バーチャルYouTuber"
    assert updated_tag.canonical_name == "バーチャルyoutuber"
