from flask import request
from goduploader.model import Account
from goduploader.db import session
from typing import Optional

def viewer() -> Optional[Account]:
    kmcid = request.headers.get('X-Forwarded-User')
    if not kmcid:
        return unknown_user()

    account = session.query(Account).filter(Account.kmcid == kmcid).first()
    if account:
        return account

    with session.begin():
        account = Account(kmcid=kmcid, name=kmcid)
        session.new(account)

    return account

def unknown_user():
    return session.query(Account).filter(Account.kmcid == 'unknown_user').first()
