from goduploader.db import session
from goduploader.model import Account
from tests.util import create_account, mock_context


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
