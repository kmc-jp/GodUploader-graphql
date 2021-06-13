from typing import List
from model import Tag
from db import session

def has_nsfw_tag(tag_names: List[str]) -> bool:
    return 'R-18' in tag_names or 'R-18G' in tag_names

def find_or_create_tags(tag_names: List[str]) -> List[Tag]:
    if not tag_names:
        return []

    found_tags = session.query(Tag).filter(Tag.name.in_(tag_names))

    found_tag_by_name = {t.name: t for t in found_tags}
    print(found_tag_by_name)
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

    # merge
    return list(found_tags) + created_tags
