from goduploader.tag import find_or_create_tags
from goduploader.db import session


def test_find_or_create_tags():
    tag_names = ["Aa", "日本語"]
    created_tags = find_or_create_tags(tag_names)
    session.commit()

    assert created_tags[0].name == "Aa"
    assert created_tags[0].canonical_name == "aa"

    assert created_tags[1].name == "日本語"
    assert created_tags[1].canonical_name == "日本語"

    tag_names = ["aA", "BBB"]
    created_tags = find_or_create_tags(tag_names)
    session.commit()

    assert created_tags[0].name == "Aa"
    assert created_tags[0].canonical_name == "aa"

    assert created_tags[1].name == "BBB"
    assert created_tags[1].canonical_name == "bbb"
