"""
作品からNSFW判定用のタグ (R-18, R-18G) を外すスクリプト
"""
from goduploader.db import session
from goduploader.model.artwork import Artwork
from goduploader.model.tag import Tag

def remove_nsfw_tag_from_artwork():
    with session.begin():
        # 全ての作品からR-18, R-18Gタグを消す
        all_artworks = session.query(Artwork).all()

        for artwork in all_artworks:
            artwork: Artwork

            filtered_tags = [t for t in artwork.tags if t.name not in ['R-18', 'R-18G']]

            artwork.tags = filtered_tags

        # 作品数をリセットする
        tags = Tag.find_or_create(['R-18', 'R-18G'])
        for tag in tags:
            tag.artworks_count = 0

if __name__ == "__main__":
    remove_nsfw_tag_from_artwork()
