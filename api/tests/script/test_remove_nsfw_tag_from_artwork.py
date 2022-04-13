from goduploader.db import session
from goduploader.model.artwork import Artwork
from goduploader.model.tag import Tag
from script.remove_nsfw_tag_from_artwork import remove_nsfw_tag_from_artwork
from tests.util import create_artwork


def test_remove_nsfw_tag_from_artwork():
    create_artwork(
        tags=["R-18G", "aaa"],
    )
    create_artwork(
        tags=["R-18", "bbb"],
    )
    create_artwork(
        tags=["aaa", "bbb", "ccc"],
    )

    remove_nsfw_tag_from_artwork()

    after_artworks = session.query(Artwork).order_by(Artwork.id.asc()).all()

    assert after_artworks[0].tags[0].name == "aaa"

    assert after_artworks[1].tags[0].name == "bbb"

    assert after_artworks[2].tags[0].name == "aaa"
    assert after_artworks[2].tags[1].name == "bbb"
    assert after_artworks[2].tags[2].name == "ccc"

    after_removed_tags = (
        session.query(Tag)
        .filter(Tag.name.in_(["R-18", "R-18G"]))
        .order_by(Tag.name.asc())
        .all()
    )
    assert len(after_removed_tags) == 2
    assert after_removed_tags[0].artworks_count == 0
    assert after_removed_tags[1].artworks_count == 0
