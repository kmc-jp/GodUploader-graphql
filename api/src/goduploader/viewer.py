from flask import Request
from goduploader.model import Account
from goduploader.db import session
from typing import Optional


def viewer(kmcid: Optional[str]) -> Optional[Account]:
    if not kmcid:
        return unknown_user()

    account = session.query(Account).filter_by(kmcid=kmcid).first()
    if account:
        return account

    account = Account(kmcid=kmcid, name=kmcid)
    session.add(account)
    session.commit()

    return account


def unknown_user():
    return session.query(Account).filter_by(kmcid="unknown_user").first()
