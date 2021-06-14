import os.path
from goduploader.model import Account, Artwork, Illust
import yaml
from goduploader.db import session

def prepare_fixtures():
    with open(os.path.join(os.path.dirname(__file__), 'fixtures.yml')) as f:
        fixture_data = yaml.load(f, Loader=yaml.FullLoader)

    _prepare_accounts(fixture_data['accounts'])
    _prepare_artworks(fixture_data['artworks'])
    _prepare_illusts(fixture_data['illusts'])

    session.commit()

def _prepare_accounts(accounts):
    for account_data in accounts:
        account = Account(
            id=account_data['id'],
            kmcid=account_data['kmcid'],
            name=account_data['name'],
            artworks_count=account_data['artworks_count'],
        )
        session.add(account)

def _prepare_artworks(artworks):
    for artwork_data in artworks:
        artwork = Artwork(
            id=artwork_data['id'],
            account_id=artwork_data['account_id'],
            title=artwork_data['title'],
            caption=artwork_data['caption'],
            top_illust_id=artwork_data['top_illust_id'],
            nsfw=artwork_data['nsfw'],
        )
        session.add(artwork)

def _prepare_illusts(illusts):
    for illust_data in illusts:
        illust = Illust(
            id=illust_data['id'],
            artwork_id=illust_data['artwork_id'],
            filename=illust_data['filename'],
        )
        session.add(illust)
