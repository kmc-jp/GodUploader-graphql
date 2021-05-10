from promise import Promise
from promise.dataloader import DataLoader
from db import session
from model import Account

class AccountLoader(DataLoader):
    def batch_load_fn(self, keys):
        accounts = {account.id: account for account in session.query(Account).filter(Account.id.in_([k for k in keys]))}
        return Promise.resolve([accounts.get(account_id) for account_id in keys])
