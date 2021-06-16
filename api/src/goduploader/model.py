import os.path
from datetime import datetime
from goduploader.config import BASE_URL, PUBLIC_FOLDER
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey, Index, Table
from sqlalchemy.sql.sqltypes import Boolean, DateTime, Integer, String, Text
from goduploader.db import Base

class Account(Base):
    __tablename__ = 'account'

    id = Column(Integer, primary_key=True, autoincrement=True)
    kmcid = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    artworks_count = Column(Integer, nullable=False, default=0)
    last_logged_in = Column(DateTime, nullable=False, default=datetime.now)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    @property
    def user_page_url(self):
        return os.path.join(BASE_URL, 'user', self.kmcid)

    index_artworks_count = Index('account_artworks_count', artworks_count)

    artworks = relationship('Artwork', backref='account')
    comments = relationship('Comment', backref='account')
    likes = relationship('Like', backref='account')

artwork_tag_relation = Table(
    'artwork_tag_relation',
    Base.metadata,
    Column('artwork_id', Integer, ForeignKey('artwork.id')),
    Column('tag_id', Integer, ForeignKey('tag.id')),
)

class Artwork(Base):
    __tablename__ = 'artwork'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    title = Column(String(255), nullable=False)
    caption = Column(Text, nullable=False)

    nsfw = Column(Boolean, nullable=False)
    top_illust_id = Column(Integer, ForeignKey('artwork.id'))

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    illusts = relationship('Illust', backref='artwork', cascade="all, delete")
    comments = relationship('Comment', backref='artwork', cascade="all, delete")
    likes = relationship('Like', backref='artwork', cascade="all, delete")
    tags = relationship('Tag', secondary=artwork_tag_relation, back_populates='artworks', cascade="all, delete")

class Comment(Base):
    __tablename__ = 'comment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text, nullable=False)
    account_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    artwork_id = Column(Integer, ForeignKey('artwork.id'), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

class Illust(Base):
    __tablename__ = 'illust'

    id = Column(Integer, primary_key=True, autoincrement=True)
    artwork_id = Column(Integer, ForeignKey('artwork.id'), nullable=False)
    filename = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    def image_path(self, size='full') -> str:
        if size == 'full':
            return os.path.join(PUBLIC_FOLDER, 'illusts', self.filename)
        elif size == 'thumbnail':
            return os.path.join(PUBLIC_FOLDER, 'thumbnail', self.filename)
        else:
            raise ValueError(f'Unknown size: {size}')

class Like(Base):
    __tablename__ = 'like'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    artwork_id = Column(Integer, ForeignKey('artwork.id'), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    artworks_count = Column(Integer, nullable=False, default=0)

    index_artworks_count = Index('tag_artworks_count', artworks_count)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    artworks = relationship('Artwork', secondary=artwork_tag_relation, back_populates='tags')
