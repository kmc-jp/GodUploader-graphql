from goduploader.db import engine
from goduploader.model import Base
from sqlalchemy.schema import CreateTable

for t in Base.metadata.sorted_tables:
    print(str(CreateTable(t).compile(engine, dialect=engine.dialect)).strip(), end=';\n')
