import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from goduploader.model import Base

db_url = os.environ.get("DB_URL", "sqlite:///god.db")
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)
session = scoped_session(Session)

Base.query = session.query_property()
