"""
作品のタグ (Artwork.tags) を年齢制限 (Artwork.rating) に反映するスクリプト
"""
from typing import List
from goduploader.db import session
from goduploader.model.artwork import Artwork, ArtworkRatingEnum
from goduploader.model.tag import Tag

def sync_tag_to_rating():
    with session.begin():
        all_artworks = session.query(Artwork).all()

        for artwork in all_artworks:
            artwork: Artwork

            # rating != safe なら https://github.com/kmc-jp/GodUploader-graphql/pull/141 のリリース以降に投稿され、
            # ratingカラムの値が有効なのでスキップする
            if artwork.rating != ArtworkRatingEnum.safe:
                continue

            # rating == safe なら、ratingカラムの値がタグと同期されていないので同期する
            tags: List[Tag] = artwork.tags
            canonical_tag_names: List[str] = [t.canonical_name for t in tags]

            if 'r-18g' in canonical_tag_names:
                rating = ArtworkRatingEnum.r_18g
            elif 'r-18' in canonical_tag_names:
                rating = ArtworkRatingEnum.r_18
            else:
                rating = ArtworkRatingEnum.safe

            artwork.rating = rating

if __name__ == "__main__":
    sync_tag_to_rating()
