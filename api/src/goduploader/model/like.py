from datetime import datetime

from goduploader.model.account import Account
from goduploader.model.artwork import Artwork
from goduploader.model.base import Base
from goduploader.model.comment import Comment
from goduploader.model.illust import Illust
from sqlalchemy import Column
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime, Integer

__all__ = ["Account", "Artwork", "Base", "Comment", "Illust"]


class Like(Base):
    __tablename__ = "like"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    artwork_id = Column(Integer, ForeignKey("artwork.id"), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )
