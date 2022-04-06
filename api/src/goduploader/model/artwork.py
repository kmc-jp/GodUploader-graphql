from datetime import datetime
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.account import Account
from goduploader.model.base import Base
from goduploader.model.relation import artwork_tag_relation
from graphene.relay import Node
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import Boolean, DateTime, Integer, String, Text


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
    top_illust_id = Column(Integer, ForeignKey("illust.id"))

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

    def user_can_edit(self, user: Account):
        return self.account_id == user.id
