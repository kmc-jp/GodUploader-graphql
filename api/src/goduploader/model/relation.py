from goduploader.model.base import Base
from sqlalchemy import Column
from sqlalchemy.sql.schema import ForeignKey, Table
from sqlalchemy.sql.sqltypes import Integer

artwork_tag_relation = Table(
    "artwork_tag_relation",
    Base.metadata,
    Column("artwork_id", Integer, ForeignKey("artwork.id")),
    Column("tag_id", Integer, ForeignKey("tag.id")),
)
