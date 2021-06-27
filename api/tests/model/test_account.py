from goduploader.model import Account


def test_user_page_url():
    account = Account(kmcid="foo")
    assert account.user_page_url == "http://localhost:3000/users/foo"
