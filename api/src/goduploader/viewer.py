from typing import Optional

from goduploader.db import session
from goduploader.model import Account


def viewer(kmcid: Optional[str]) -> Optional[Account]:
    if not kmcid:
        return Account.unknown_user

    account = session.query(Account).filter_by(kmcid=kmcid).first()
    if account:
        return account

    account = Account(kmcid=kmcid, name=kmcid)
    session.add(account)
    session.commit()

    return account
