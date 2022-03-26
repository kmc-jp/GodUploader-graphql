from graphene.relay.node import Node
from tests.util import create_account, mock_context

IS_YOU_NODE_QUERY = """
    query IsYouNodeQuery($id: ID!) {
        node(id: $id) {
            ... on Account {
                isYou
            }
        }
    }
"""

IS_YOU_VIEWER_QUERY = """
    query IsYouViewerQuery {
        viewer {
            isYou
        }
    }
"""


def test_is_you(client):
    account = create_account()
    result = client.execute(
        IS_YOU_NODE_QUERY,
        variable_values={"id": Node.to_global_id("Account", account.id)},
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "data" in result
    assert "node" in result["data"]
    assert "isYou" in result["data"]["node"]
    assert result["data"]["node"]["isYou"]


def test_is_you_not_you(client):
    account = create_account()
    other_account = create_account()
    result = client.execute(
        IS_YOU_NODE_QUERY,
        variable_values={"id": Node.to_global_id("Account", other_account.id)},
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "data" in result
    assert "node" in result["data"]
    assert "isYou" in result["data"]["node"]
    assert not result["data"]["node"]["isYou"]


def test_is_you_viewer(client):
    account = create_account()
    result = client.execute(
        IS_YOU_VIEWER_QUERY,
        context_value=mock_context(kmcid=account.kmcid),
    )
    assert "data" in result
    assert "viewer" in result["data"]
    assert "isYou" in result["data"]["viewer"]
    assert result["data"]["viewer"]["isYou"]
