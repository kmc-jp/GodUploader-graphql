import os
import tempfile
from pathlib import Path

import httpretty
import pytest
from goduploader.config import app_config

if os.environ.get("DB_URL_TEST"):
    app_config.db_url = os.environ["DB_URL_TEST"]

from goduploader.db import engine, session
from goduploader.graphql.schema import schema
from goduploader.model import Base
from graphene.test import Client
from tests.httpmock import mock_requests
from tests.util import create_account

app_config.base_url = "http://localhost:3000/test/"
app_config.testing = True


@pytest.fixture(scope="function", autouse=True)
def prepare_temporary_public_dir():
    with tempfile.TemporaryDirectory(prefix="goduploader-test-") as tmpdir:
        public = Path(tmpdir)
        illusts_dir = public / "illusts"
        illusts_dir.mkdir()
        thumbnail_dir = public / "thumbnail"
        thumbnail_dir.mkdir()
        wep_dir = public / "webp"
        wep_dir.mkdir()
        app_config.public_folder = str(public)

        yield


@pytest.fixture(scope="function", autouse=True)
def mock_http_request():
    with httpretty.enabled(allow_net_connect=False):
        mock_requests()
        yield


@pytest.fixture(scope="function")
def client():
    client = Client(schema)
    yield client


@pytest.fixture(scope="function", autouse=True)
def init_db():
    try:
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        # prepare unknown_user
        create_account(kmcid="unknown_user", name="unknown_user")

        yield
    finally:
        session.rollback()
        session.remove()
