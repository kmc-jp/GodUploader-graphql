from goduploader.config import app_config
from goduploader.model import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine(app_config.db_url)
Session = sessionmaker(bind=engine)
session = scoped_session(Session)

Base.query = session.query_property()
