import os
import tempfile
from pathlib import Path

import pytest
from goduploader.db import engine, session
from goduploader.graphql.schema import schema
from goduploader.model import Base
from graphene.test import Client
from tests.util import create_account

os.environ["TESTING"] = "1"


def prepare_temporary_public_dir():
    public = Path(tempfile.mkdtemp())
    illusts_dir = public / "illusts"
    illusts_dir.mkdir()
    thumbnail_dir = public / "thumbnail"
    thumbnail_dir.mkdir()
    os.environ["PUBLIC_FOLDER"] = str(public)


prepare_temporary_public_dir()


@pytest.fixture(scope="function", autouse=True)
def client():
    Base.metadata.create_all(engine)

    # prepare unknown_user
    create_account(kmcid="unknown_user", name="unknown_user")

    client = Client(schema)
    yield client

    Base.metadata.drop_all(engine)
    session.remove()
