import os
from goduploader.config import PUBLIC_FOLDER
from flask import Flask, request
from flask_graphql import GraphQLView
from flask_cors import CORS
from goduploader.db import session
from goduploader.graphql.schema import schema
from goduploader.viewer import viewer

app = Flask(__name__, static_folder=PUBLIC_FOLDER)
app.debug = bool(os.environ.get('DEBUG'))
CORS(app)

@app.before_request
def load_user():
    kmcid = request.headers.get('X-Forwarded-User')
    request.user = viewer(kmcid)

app.add_url_rule(
    '/api/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
        methods=['POST'],
    ),
)

@app.teardown_appcontext
def shutdown_sessions(exception=None):
    session.remove()
