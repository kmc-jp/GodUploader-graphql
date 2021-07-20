from collections import defaultdict

from goduploader.db import session
from goduploader.model import Account, Illust
from promise import Promise
from promise.dataloader import DataLoader


class AccountLoader(DataLoader):
    def batch_load_fn(self, keys):
        accounts = {
            account.id: account
            for account in session.query(Account).filter(
                Account.id.in_([k for k in keys])
            )
        }
        return Promise.resolve([accounts.get(account_id) for account_id in keys])


class IllustLoader(DataLoader):
    def batch_load_fn(self, keys):
        illust_by_id = {
            illust.id: illust
            for illust in session.query(Illust).filter(Illust.id.in_([k for k in keys]))
        }
        return Promise.resolve([illust_by_id.get(illust_id) for illust_id in keys])
