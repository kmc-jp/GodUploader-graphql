import os

from goduploader.model import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

db_url = os.environ.get("DB_URL", "sqlite:///god.db")
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)
session = scoped_session(Session)

Base.query = session.query_property()
