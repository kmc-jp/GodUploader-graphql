import os
from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS
from goduploader.db import session
from goduploader.schema import schema
app = Flask(__name__, static_folder=os.environ.get('PUBLIC_FOLDER', '../public'))
app.debug = bool(os.environ.get('DEBUG'))
CORS(app)

app.add_url_rule(
    '/api/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
    ),
)

@app.teardown_appcontext
def shutdown_sessions(exception=None):
    session.remove()
