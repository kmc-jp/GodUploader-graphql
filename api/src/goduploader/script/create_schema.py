import sys
sys.path.insert(0, '.')

from model import Base
from db import engine
Base.metadata.create_all(engine)
