import json
from urllib.parse import quote
from goduploader.web import app

def test_graphql_get_not_allowed_no_content_type(client):
    client = app.test_client()
    query = quote('''
    {
        viewer {
            id
        }
    }
    ''')
    resp = client.get(f'/api/graphql?query={query}')
    assert resp.status_code == 405, "Can't query with GET request"
    assert resp.json is None

def test_graphql_get_not_allowed_content_type(client):
    client = app.test_client()
    query = quote('''
    {
        viewer {
            id
        }
    }
    ''')
    resp = client.get(f'/api/graphql?query={query}', headers={'Content-Type': 'application/json'})
    assert resp.status_code == 405, "Can't query with GET request (even if Content-Type header is present)"
    assert resp.json is None

def test_graphql_can_post(client):
    client = app.test_client()
    query = '''
    {
        viewer {
            id
        }
    }
    '''
    resp = client.post(
        f'/api/graphql',
        data=json.dumps({'query': query}),
        headers={'Content-Type': 'application/json'},
    )
    assert resp.status_code == 200
