import os
from pathlib import Path
import tempfile
import pytest
from tests.util import create_account
from graphene.test import Client
from goduploader.db import engine
from goduploader.model import Base
from goduploader.graphql.schema import schema

def prepare_temporary_public_dir():
    public = Path(tempfile.mkdtemp())
    illusts_dir = public / 'illusts'
    illusts_dir.mkdir()
    thumbnail_dir = public / 'thumbnail'
    thumbnail_dir.mkdir()
    os.environ['PUBLIC_FOLDER'] = str(public)

prepare_temporary_public_dir()

@pytest.fixture(scope='function', autouse=True)
def client():
    Base.metadata.create_all(engine)

    # prepare unknown_user
    create_account(kmcid='unknown_user', name='unknown_user')

    client = Client(schema)
    yield client

    Base.metadata.drop_all(engine)
