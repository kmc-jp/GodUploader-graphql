import graphene
from dotenv import find_dotenv, load_dotenv
from flask.wrappers import Request, Response
from goduploader.config import app_config

load_dotenv(find_dotenv())

import time

from flask import Flask, request
from goduploader.db import session
from goduploader.graphql.schema import schema
from goduploader.viewer import viewer
from graphene_file_upload.flask import FileUploadGraphQLView

app = Flask(
    __name__,
    static_folder=app_config.public_folder,
)
app.debug = app_config.debug

RELOADED_AT = int(time.time())


@app.before_request
def load_user():
    kmcid = request.headers.get("X-Forwarded-User")
    request.user = viewer(kmcid)


@app.route("/api/ping")
def ping():
    return {"ok": "true"}


@app.after_request
def add_x_revision_header(response: Response):
    response.headers.add("X-Revision", RELOADED_AT)
    return response


def check_referer_for_mutation_middleware(
    next, root, info: graphene.ResolveInfo, **args
):
    # skip check for normal query
    if info.operation.operation == "query":
        return next(root, info, **args)

    req: Request = info.context
    referer = req.headers.get("Referer", "")
    if not referer.startswith(app_config.base_url):
        raise Exception(f"Referer check failed ({referer})")

    return next(root, info, **args)


app.add_url_rule(
    "/api/graphql",
    view_func=FileUploadGraphQLView.as_view(
        "graphql",
        schema=schema,
        graphiql=app.debug,
        middleware=[check_referer_for_mutation_middleware],
    ),
    methods=["GET", "POST"] if app.debug else ["POST"],
)


@app.teardown_appcontext
def shutdown_sessions(exception=None):
    session.remove()
