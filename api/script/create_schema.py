from goduploader.model import Base
from goduploader.db import engine
Base.metadata.create_all(engine)
