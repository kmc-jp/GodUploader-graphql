from datetime import datetime
from enum import Enum as PyEnum, auto
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.account import Account
from goduploader.model.base import Base
from goduploader.model.relation import artwork_tag_relation
from graphene.relay import Node
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey, Index
from sqlalchemy.sql.sqltypes import Boolean, DateTime, Enum, Integer, String, Text


class ArtworkRatingEnum(str, PyEnum):
    safe = auto()
    r_18 = auto()
    r_18g = auto()


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

    rating = Column("rating", Enum(ArtworkRatingEnum), nullable=False, server_default=ArtworkRatingEnum.safe.name)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    index_rating_created_at = Index("rating_created_at", rating, created_at)

    @property
    def top_illust(self):
        return self.illusts[0]

    illusts = relationship("Illust", backref="artwork", cascade="all, delete")
    comments = relationship("Comment", backref="artwork", cascade="all, delete")
    likes = relationship("Like", backref="artwork", cascade="all, delete")
    tags = relationship(
        "Tag",
        secondary=artwork_tag_relation,
        back_populates="artworks",
    )

    def user_can_edit(self, user: Account):
        return self.account_id == user.id

    def update_tag_relation(self, new_tag_names):
        # avoid circular import
        from goduploader.model.tag import Tag

        old_tags = self.tags

        for old_tag in old_tags:
            self.tags.remove(old_tag)
            old_tag.artworks_count -= 1

        new_tags = Tag.find_or_create(new_tag_names)
        for new_tag in new_tags:
            self.tags.append(new_tag)
            new_tag.artworks_count += 1
