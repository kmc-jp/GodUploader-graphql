import pytest
from tests.prepare import client

@pytest.mark.usefixtures('client')
def test_safe_artworks(client):
    query = '''
    {
        safeArtworks(first: 8) {
            edges {
                node {
                    title
                }
            }
        }
    }
    '''
    result = client.execute(query)
    assert result == {
        'data': {
            'safeArtworks': {
                'edges': [
                    {
                        'node': {
                            'title': 'artwork 1'
                        }
                    }
                ],
            },
        },
    }, 'only fetch safe artworks'
