import tempfile
from pathlib import Path

import httpretty
import pytest
from goduploader.config import app_config
from goduploader.db import engine, session
from goduploader.graphql.schema import schema
from goduploader.model import Base
from graphene.test import Client
from tests.util import create_account

app_config.testing = True


def prepare_temporary_public_dir():
    public = Path(tempfile.mkdtemp())
    illusts_dir = public / "illusts"
    illusts_dir.mkdir()
    thumbnail_dir = public / "thumbnail"
    thumbnail_dir.mkdir()
    wep_dir = public / "webp"
    wep_dir.mkdir()
    app_config.public_folder = str(public)


prepare_temporary_public_dir()
httpretty.enable(allow_net_connect=False)


@pytest.fixture(scope="function", autouse=True)
def client():
    Base.metadata.create_all(engine)

    # prepare unknown_user
    create_account(kmcid="unknown_user", name="unknown_user")

    client = Client(schema)
    yield client

    Base.metadata.drop_all(engine)
    session.remove()
