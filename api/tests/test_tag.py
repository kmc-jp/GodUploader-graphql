import pytest
from goduploader.db import session
from goduploader.model import Tag
from goduploader.tag import find_or_create_tags


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


@pytest.mark.parametrize(
    "tag_name, expected",
    [
        ("ABC", "abc"),
        ("  Abc      ", "abc"),
        ("日本語を含む ", "日本語を含む"),
        ("🍣🍺", "🍣🍺"),
        ("　　　全角　スペース　　", "全角 スペース"),
        ("㍿ボーダー商事", "株式会社ボーダー商事"),
        ("ＡＢＣＤＥＦＧ", "abcdefg"),
    ],
)
def test_canonicalize(tag_name, expected):
    assert Tag.canonicalize(tag_name) == expected
