from goduploader.db import session
from goduploader.model.artwork import Artwork, ArtworkRatingEnum
from script.sync_tag_to_rating import sync_tag_to_rating
from tests.util import create_artwork


def test_sync_tag_to_rating():
    create_artwork(
        tags=["R-18G"],
        rating=ArtworkRatingEnum.safe,
        title="ratingカラムが同期されていない作品 (R-18G)",
    )
    create_artwork(
        tags=["R-18"],
        rating=ArtworkRatingEnum.safe,
        title="ratingカラムが同期されていない作品 (R-18)",
    )

    create_artwork(
        tags=["R-18G"],
        rating=ArtworkRatingEnum.r_18g,
        title="ratingカラムが同期されて、タグも付いている作品 (R-18G)",
    )
    create_artwork(
        tags=["R-18"],
        rating=ArtworkRatingEnum.r_18,
        title="ratingカラムが同期されて、タグも付いている作品 (R-18)",
    )

    create_artwork(
        rating=ArtworkRatingEnum.r_18g, title="ratingカラムが同期されて、タグが付いていない作品 (R-18G)"
    )
    create_artwork(
        rating=ArtworkRatingEnum.r_18, title="ratingカラムが同期されて、タグが付いていない作品 (R-18)"
    )
    create_artwork(
        rating=ArtworkRatingEnum.safe, title="ratingカラムが同期されて、タグが付いていない作品 (全年齢)"
    )

    sync_tag_to_rating()

    after_artworks = session.query(Artwork).order_by(Artwork.id.asc()).all()

    assert after_artworks[0].rating == ArtworkRatingEnum.r_18g, after_artworks[0].title
    assert after_artworks[1].rating == ArtworkRatingEnum.r_18, after_artworks[1].title
    assert after_artworks[2].rating == ArtworkRatingEnum.r_18g, after_artworks[2].title
    assert after_artworks[3].rating == ArtworkRatingEnum.r_18, after_artworks[3].title
    assert after_artworks[4].rating == ArtworkRatingEnum.r_18g, after_artworks[4].title
    assert after_artworks[5].rating == ArtworkRatingEnum.r_18, after_artworks[5].title
    assert after_artworks[6].rating == ArtworkRatingEnum.safe, after_artworks[6].title
