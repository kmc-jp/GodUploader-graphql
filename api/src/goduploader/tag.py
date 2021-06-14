from typing import List

from goduploader.model import Tag
from goduploader.db import session

def has_nsfw_tag(tag_names: List[str]) -> bool:
    return 'R-18' in tag_names or 'R-18G' in tag_names

def find_or_create_tags(tag_names: List[str]) -> List[Tag]:
    if not tag_names:
        return []

    found_tags = session.query(Tag).filter(Tag.name.in_(tag_names))

    found_tag_by_name = {t.name: t for t in found_tags}
    not_found_tag_names = [tn for tn in tag_names if tn not in found_tag_by_name]

    # create not-found tags
    created_tags = []
    for new_tag_name in not_found_tag_names:
        new_tag = Tag(
            name=new_tag_name,
            artworks_count=0,
        )
        session.add(new_tag)
        created_tags.append(new_tag)

    # merge (preserve order)
    merged_tags = list(found_tags) + created_tags
    tag_by_name = {tag.name: tag for tag in merged_tags}
    return [tag_by_name[name] for name in tag_names]

def update_tag_relation(artwork, new_tag_names):
    old_tags = artwork.tags

    for old_tag in old_tags:
        artwork.tags.remove(old_tag)
        old_tag.artworks_count -= 1

    new_tags = find_or_create_tags(new_tag_names)
    for new_tag in new_tags:
        artwork.tags.append(new_tag)
        new_tag.artworks_count += 1
