import pytest
from graphene.test import Client
from goduploader.db import engine
from goduploader.model import Base
from goduploader.graphql.schema import schema
from .util import prepare_fixtures

@pytest.fixture(scope='session')
def client():
    Base.metadata.create_all(engine)
    prepare_fixtures()

    client = Client(schema)
    yield client
