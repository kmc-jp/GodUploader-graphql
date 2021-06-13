from collections import defaultdict
from promise import Promise
from promise.dataloader import DataLoader
from db import session
from model import Account, Illust

class AccountLoader(DataLoader):
    def batch_load_fn(self, keys):
        accounts = {account.id: account for account in session.query(Account).filter(Account.id.in_([k for k in keys]))}
        return Promise.resolve([accounts.get(account_id) for account_id in keys])


class ArtworkIllustsLoader(DataLoader):
    def batch_load_fn(self, keys):
        illusts = session.query(Illust).filter(Illust.artwork_id.in_([k for k in keys]))

        illusts_by_artwork_id = defaultdict(list)
        for illust in illusts:
            illusts_by_artwork_id[illust.artwork_id].append(illust)

        return Promise.resolve([illusts_by_artwork_id[artwork_id] for artwork_id in keys])
