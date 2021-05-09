from flask import request
from model import Account
from db import session
from typing import Optional

def viewer() -> Optional[Account]:
    return session.query(Account).filter(Account.kmcid == request.headers.get('X-Forwarded-User')).first()
