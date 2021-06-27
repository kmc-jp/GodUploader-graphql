from goduploader.model import Illust
from graphene.relay.node import Node


def test_image_url():
    illust = Illust(id=1, filename="foo.png")
    assert illust.image_url == "http://localhost:3000/public/illusts/foo.png"


def test_thumbnail_url():
    illust = Illust(id=1, filename="foo.png")
    assert illust.thumbnail_url == "http://localhost:3000/public/thumbnail/foo.png"
