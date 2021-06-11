from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS
from db import session
from schema import schema
app = Flask(__name__, static_folder='public')
app.debug = True
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

if __name__ == "__main__":
    app.run()
