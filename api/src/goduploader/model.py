from datetime import datetime
from sqlalchemy import Column
from sqlalchemy.sql.schema import Index, PrimaryKeyConstraint
from sqlalchemy.sql.sqltypes import DateTime, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

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

class Artwork(Base):
    __tablename__ = 'artwork'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    caption = Column(Text, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Comment(Base):
    __tablename__ = 'comment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text, nullable=False)
    account_id = Column(Integer, nullable=False)
    artwork_id = Column(Integer, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Illust(Base):
    __tablename__ = 'illust'

    id = Column(Integer, primary_key=True, autoincrement=True)
    artwork_id = Column(Integer, nullable=False)
    filename = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Like(Base):
    __tablename__ = 'like'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, nullable=False)
    artwork_id = Column(Integer, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

# Relations

class ArtworkTagRelation(Base):
    __tablename__ = 'artwork_tag_relation'

    artwork_id = Column(Integer, nullable=False)
    tag_id = Column(Integer, nullable=False)
    primary_key = PrimaryKeyConstraint(artwork_id, tag_id)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class ArtworkIllustRelation(Base):
    __tablename__ = 'artwork_illust_relation'

    artwork_id = Column(Integer, nullable=False)
    illust_id = Column(Integer, nullable=False)
    primary_key = PrimaryKeyConstraint(artwork_id, illust_id)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
