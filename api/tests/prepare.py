import pytest
from graphene.test import Client
from goduploader.db import engine
from goduploader.model import Base
from goduploader.schema import schema
from tests.util import prepare_fixtures

@pytest.fixture(scope='session')
def client():
    Base.metadata.create_all(engine)
    prepare_fixtures()

    client = Client(schema)
    yield client
