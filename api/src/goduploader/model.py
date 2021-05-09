from datetime import datetime
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey, Index, PrimaryKeyConstraint
from sqlalchemy.sql.sqltypes import DateTime, Integer, String, Text
from db import Base

class Account(Base):
    __tablename__ = 'account'

    id = Column(Integer, primary_key=True, autoincrement=True)
    kmcid = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    folders_count = Column(Integer, nullable=False, default=0)
    last_logged_in = Column(DateTime, nullable=False, default=datetime.utcnow)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    index_folders_count = Index('folders_count', folders_count)

    artworks = relationship('Artwork')

class ArtworkTagRelation(Base):
    __tablename__ = 'artwork_tag_relation'

    artwork_id = Column(Integer, ForeignKey('artwork.id'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('tag.id'), primary_key=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    artwork = relationship('Artwork', back_populates='tags')
    tag = relationship('Tag', back_populates='artworks')

class Artwork(Base):
    __tablename__ = 'artwork'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    title = Column(String(255), nullable=False)
    caption = Column(Text, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    illusts = relationship('Illust', backref='artwork')
    comments = relationship('Comment', backref='artwork')
    likes = relationship('Like', backref='artwork')
    tags = relationship('ArtworkTagRelation', back_populates='artwork')

class Comment(Base):
    __tablename__ = 'comment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text, nullable=False)
    account_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    artwork_id = Column(Integer, ForeignKey('artwork.id'), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Illust(Base):
    __tablename__ = 'illust'

    id = Column(Integer, primary_key=True, autoincrement=True)
    artwork_id = Column(Integer, ForeignKey('artwork.id'), nullable=False)
    filename = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Like(Base):
    __tablename__ = 'like'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    artwork_id = Column(Integer, ForeignKey('artwork.id'), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    artworks = relationship('ArtworkTagRelation', back_populates='tag')

# Relations

class ArtworkTagRelation(Base):
    __tablename__ = 'artwork_tag_relation'

    artwork_id = Column(Integer, ForeignKey('artwork.id'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('tag.id'), primary_key=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    artwork = relationship('Artwork', back_populates='tags')
    tag = relationship('Tag', back_populates='artworks')

class ArtworkIllustRelation(Base):
    __tablename__ = 'artwork_illust_relation'

    artwork_id = Column(Integer, nullable=False)
    illust_id = Column(Integer, nullable=False)
    primary_key = PrimaryKeyConstraint(artwork_id, illust_id)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
