from goduploader.graphql.dataloader import AccountLoader, ArtworkLoader, IllustLoader
from tests.util import create_account, create_artwork, create_illust


def test_account_loader():
    loader = AccountLoader()
    account = create_account()

    res = loader.load(account.id)
    assert res.get().id == account.id


def test_artwork_loader():
    loader = ArtworkLoader()
    artwork = create_artwork()

    res = loader.load(artwork.id)
    assert res.get().id == artwork.id


def test_illust_loader():
    loader = IllustLoader()
    illust = create_illust(create_artwork())

    res = loader.load(illust.id)
    assert res.get().id == illust.id
