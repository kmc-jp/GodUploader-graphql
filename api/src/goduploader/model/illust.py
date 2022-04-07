from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

from goduploader.config import app_config
from goduploader.model.base import Base
from sqlalchemy import Column
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime, Integer, String


class Illust(Base):
    __tablename__ = "illust"

    id = Column(Integer, primary_key=True, autoincrement=True)
    artwork_id = Column(Integer, ForeignKey("artwork.id"), nullable=False)
    filename = Column(String(2048), nullable=False)

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

    @property
    def webp_url(self):
        base = Path(self.filename).stem
        return urljoin(app_config.base_url, f"public/webp/{base}.webp")

    def image_path(self, size="full") -> str:
        if size == "full":
            return str(Path(app_config.public_folder) / "illusts" / self.filename)
        elif size == "thumbnail":
            return str(Path(app_config.public_folder) / "thumbnail" / self.filename)
        elif size == "webp":
            base = Path(self.filename).stem
            return str(Path(app_config.public_folder) / "webp" / f'{base}.webp')
        else:
            raise ValueError(f"Unknown size: {size}")
