from goduploader.model import Tag


def test_artwork_url():
    tag = Tag(id=1, name="tag")
    assert tag.artworks_url == f"http://localhost:3000/test/tagged_artworks/tag"
