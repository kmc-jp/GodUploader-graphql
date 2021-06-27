from goduploader.model import Artwork
from graphene.relay.node import Node


def test_artwork_url():
    artwork = Artwork(id=1)
    assert artwork.artwork_url == f"http://localhost:3000/artwork/{Node.to_global_id('Artwork', 1)}"
