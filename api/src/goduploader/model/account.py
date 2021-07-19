from datetime import datetime
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.base import Base
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import Index
from sqlalchemy.sql.sqltypes import DateTime, Integer, String


class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, autoincrement=True)
    kmcid = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    artworks_count = Column(Integer, nullable=False, default=0)
    last_logged_in = Column(DateTime, nullable=False, default=datetime.now)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    @property
    def user_page_url(self):
        return urljoin(app_config.base_url, f"users/{self.kmcid}")

    index_artworks_count = Index("account_artworks_count", artworks_count)

    artworks = relationship("Artwork", backref="account")
    comments = relationship("Comment", backref="account")
    likes = relationship("Like", backref="account")
