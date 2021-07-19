import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.account import Account
from goduploader.model.base import Base
from goduploader.model.relation import artwork_tag_relation
from graphene.relay import Node
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.schema import ForeignKey, Index
from sqlalchemy.sql.sqltypes import Boolean, DateTime, Integer, String, Text

__all__ = ["Account", "Base"]


class Artwork(Base):
    __tablename__ = "artwork"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    title = Column(String(255), nullable=False)
    caption = Column(Text, nullable=False)

    @property
    def artwork_url(self):
        return urljoin(
            app_config.base_url, f"artwork/{Node.to_global_id('Artwork', self.id)}"
        )

    nsfw = Column(Boolean, nullable=False)
    top_illust_id = Column(Integer, ForeignKey("artwork.id"))

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    top_illust = relationship(
        "Illust",
        primaryjoin="Artwork.top_illust_id == Illust.id",
        foreign_keys=top_illust_id,
        post_update=True,
    )
    illusts = relationship("Illust", backref="artwork", cascade="all, delete")
    comments = relationship("Comment", backref="artwork", cascade="all, delete")
    likes = relationship("Like", backref="artwork", cascade="all, delete")
    tags = relationship(
        "Tag",
        secondary=artwork_tag_relation,
        back_populates="artworks",
    )


class Comment(Base):
    __tablename__ = "comment"

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text, nullable=False)
    account_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    artwork_id = Column(Integer, ForeignKey("artwork.id"), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )


class Illust(Base):
    __tablename__ = "illust"

    id = Column(Integer, primary_key=True, autoincrement=True)
    artwork_id = Column(Integer, ForeignKey("artwork.id"), nullable=False)
    filename = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    @property
    def image_url(self):
        return urljoin(app_config.base_url, f"public/illusts/{self.filename}")

    @property
    def thumbnail_url(self):
        return urljoin(app_config.base_url, f"public/thumbnail/{self.filename}")

    def image_path(self, size="full") -> str:
        if size == "full":
            return str(Path(app_config.public_folder) / "illusts" / self.filename)
        elif size == "thumbnail":
            return str(Path(app_config.public_folder) / "thumbnail" / self.filename)
        else:
            raise ValueError(f"Unknown size: {size}")


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
