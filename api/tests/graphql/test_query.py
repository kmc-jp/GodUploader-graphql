from tests.util import create_artwork

def test_safe_artworks(client):
    safe_artwork = create_artwork(
        nsfw=False,
    )
    unsafe_artwork = create_artwork(
        nsfw=True,
    )
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
                            'title': safe_artwork.title
                        }
                    }
                ],
            },
        },
    }, 'only fetch safe artworks'
