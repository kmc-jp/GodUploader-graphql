import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.account import Account
from goduploader.model.artwork import Artwork
from goduploader.model.base import Base
from goduploader.model.comment import Comment
from goduploader.model.illust import Illust
from goduploader.model.relation import artwork_tag_relation
from graphene.relay import Node
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.schema import ForeignKey, Index
from sqlalchemy.sql.sqltypes import Boolean, DateTime, Integer, String, Text

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


class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # タグの編集が許可されているかどうか
    edit_freezed = Column(
        Boolean, default=False, server_default=text("FALSE"), nullable=False
    )

    # 正規化した (小文字に統一した) タグ名
    canonical_name = Column(
        String(255, collation="nocase"),
        nullable=False,
        unique=True,
    )
    # 表示されるタグ名
    name = Column(String(255), nullable=False)
    artworks_count = Column(Integer, nullable=False, default=0)

    index_artworks_count = Index("tag_artworks_count", artworks_count)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    artworks = relationship(
        "Artwork", secondary=artwork_tag_relation, back_populates="tags"
    )

    @property
    def artworks_url(self):
        return urljoin(app_config.base_url, f"tagged_artworks/{self.name}")

    @classmethod
    def canonicalize(cls, name: str) -> str:
        """
        タグ名の正規化を行う
        1. 与えられたタグ名 name をNFKC正規化する
        2. 前後の空白文字を取り除く
        3. 小文字化する
        """
        return unicodedata.normalize("NFKC", name).strip().lower()
