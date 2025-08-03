import os
import unicodedata
from datetime import datetime
from typing import List
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.base import Base
from goduploader.model.relation import artwork_tag_relation
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.schema import Index
from sqlalchemy.sql.sqltypes import Boolean, DateTime, Integer, String


class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # タグの編集が許可されているかどうか
    edit_freezed = Column(
        Boolean, default=False, nullable=False
    )

    # 正規化した (小文字に統一した) タグ名
    canonical_name = Column(
        String(255, collation=None if os.environ.get('USE_SQLITE') == 'true' else 'utf8mb4_general_ci'),
        nullable=False,
        unique=True,
    )
    # 表示されるタグ名
    name = Column(String(255, collation=None if os.environ.get('USE_SQLITE') == 'true' else 'utf8mb4_general_ci'), nullable=False)
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
    def find_or_create(cls, tag_names: List[str]):
        # avoid circulary import
        from goduploader.db import session

        if not tag_names:
            return []

        for name in tag_names:
            Tag.validate_name(name)

        canonicalized_tag_names = [Tag.canonicalize(tn) for tn in tag_names]
        found_tags = session.query(Tag).filter(
            Tag.canonical_name.in_(canonicalized_tag_names)
        )

        found_tag_by_name = {t.canonical_name: t for t in found_tags}
        not_found_tag_names = [
            tn for tn in tag_names if Tag.canonicalize(tn) not in found_tag_by_name
        ]

        # create not-found tags
        created_tags = []
        for new_tag_name in not_found_tag_names:
            new_tag = Tag(
                canonical_name=Tag.canonicalize(new_tag_name),
                name=new_tag_name,
                artworks_count=0,
            )
            session.add(new_tag)
            created_tags.append(new_tag)

        # merge (preserve order)
        merged_tags = list(found_tags) + created_tags
        tag_by_name = {tag.canonical_name: tag for tag in merged_tags}
        return [tag_by_name[name] for name in canonicalized_tag_names]

    @classmethod
    def canonicalize(cls, name: str) -> str:
        """
        タグ名の正規化を行う
        1. 与えられたタグ名 name をNFKC正規化する
        2. 前後の空白文字を取り除く
        3. 小文字化する
        """
        return unicodedata.normalize("NFKC", name).strip().lower()

    @classmethod
    def validate_name(cls, name: str):
        restricted_chars = ['#']
        for ch in restricted_chars:
            if ch in name:
                raise TagNameValidationError(f"タグに利用できない文字 `{ch}` が含まれています ({name})")


class TagNameValidationError(Exception):
    pass

def has_nsfw_tag(tag_names: List[str]) -> bool:
    tag_names_casei = [Tag.canonicalize(t) for t in tag_names]
    return "r-18" in tag_names_casei or "r-18g" in tag_names_casei
