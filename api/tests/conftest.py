import pytest
from tests.util import create_account
from graphene.test import Client
from goduploader.db import engine
from goduploader.model import Base
from goduploader.graphql.schema import schema

@pytest.fixture(scope='function', autouse=True)
def client():
    Base.metadata.create_all(engine)

    # prepare unknown_user
    create_account(kmcid='unknown_user', name='unknown_user')

    client = Client(schema)
    print('start')
    yield client
    print('finish')

    Base.metadata.drop_all(engine)
