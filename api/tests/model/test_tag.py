from goduploader.model.tag import TagNameValidationError
import pytest
from goduploader.model import Tag
from goduploader.db import engine, session


def test_artwork_url():
    tag = Tag(id=1, name="tag")
    assert tag.artworks_url == f"http://localhost:3000/test/tagged_artworks/tag"


def test_find_or_create():
    tag_names = ["Aa", "日本語"]
    created_tags = Tag.find_or_create(tag_names)
    session.commit()

    assert created_tags[0].name == "Aa"
    assert created_tags[0].canonical_name == "aa"

    assert created_tags[1].name == "日本語"
    assert created_tags[1].canonical_name == "日本語"

    tag_names = ["aA", "BBB"]
    created_tags = Tag.find_or_create(tag_names)
    session.commit()

    assert created_tags[0].name == "Aa"
    assert created_tags[0].canonical_name == "aa"

    assert created_tags[1].name == "BBB"
    assert created_tags[1].canonical_name == "bbb"

def test_find_or_create_collation():
    print(engine.driver) # TODO
    if engine.driver == 'mysql':
        pytest.skip('model側のcollationを弄ったのでMySQLだとテストが通らない')

    # COLLATE=utf8mb4_0900_ai_ci でひらがなカタカナを区別せず、タグが作れていなかったことに対するリグレッションテスト
    created_tags = Tag.find_or_create(["ロリ"])
    session.commit()

    assert created_tags[0].name == "ロリ"
    assert created_tags[0].canonical_name == "ロリ"

    created_tags = Tag.find_or_create(["ろり"])
    session.commit()

    assert created_tags[0].name == "ろり"
    assert created_tags[0].canonical_name == "ろり"


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

@pytest.mark.parametrize(
    "tag_name",
    [
        ("#本田とじゃんけん"),
        ("#本田とじゃんけん#"),
    ],
)
def test_validate_name_ng(tag_name):
    with pytest.raises(TagNameValidationError):
        Tag.validate_name(tag_name)
