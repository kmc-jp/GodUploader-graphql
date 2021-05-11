from flask import Flask
from graphene_file_upload.flask import FileUploadGraphQLView
from flask_cors import CORS
from db import session
from schema import schema
app = Flask(__name__, static_folder='public')
app.debug = True
CORS(app)

app.add_url_rule(
    '/',
    view_func=FileUploadGraphQLView.as_view(
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
