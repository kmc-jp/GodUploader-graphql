import os
from goduploader.config import PUBLIC_FOLDER
from flask import Flask, request
from goduploader.db import session
from goduploader.graphql.schema import schema
from goduploader.viewer import viewer
from graphene_file_upload.flask import FileUploadGraphQLView

app = Flask(__name__, static_folder=PUBLIC_FOLDER)
app.debug = bool(os.environ.get('DEBUG'))

@app.before_request
def load_user():
    kmcid = request.headers.get('X-Forwarded-User')
    request.user = viewer(kmcid)

app.add_url_rule(
    '/api/graphql',
    view_func=FileUploadGraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=app.debug,
    ),
    methods=['GET', 'POST'] if app.debug else ['POST'],
)

@app.teardown_appcontext
def shutdown_sessions(exception=None):
    session.remove()
