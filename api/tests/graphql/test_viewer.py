from tests.util import create_account, mock_context

def test_viewer_unknown_user(client):
    query = '''
    {
        viewer {
            kmcid
        }
    }
    '''
    result = client.execute(query, context_value=mock_context())
    assert result == {
        'data': {
            'viewer': {
                'kmcid': 'unknown_user',
            }
        },
    }

def test_viewer_login_user(client):
    login_user = create_account()
    query = '''
    {
        viewer {
            kmcid
        }
    }
    '''
    result = client.execute(query, context_value=mock_context(kmcid=login_user.kmcid))
    assert result == {
        'data': {
            'viewer': {
                'kmcid': login_user.kmcid,
            }
        },
    }
