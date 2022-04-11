from faker import Faker
from goduploader.db import session
from goduploader.model import Account, Artwork, Illust, Tag
from goduploader.tag import update_tag_relation

fake = Faker()


class MockContext:
    def __init__(self, user):
        self.user = user


def mock_context(kmcid=None):
    user = Account.find_or_create_by_kmcid(kmcid)
    return MockContext(user)


def create_account(**args):
    if "kmcid" not in args:
        args["kmcid"] = fake.user_name()

    if "name" not in args:
        args["name"] = fake.name()

    account = Account(**args)
    session.add(account)
    session.commit()

    return account


def create_artwork(**args):
    if "title" not in args:
        args["title"] = fake.text(max_nb_chars=32)

    if "caption" not in args:
        args["caption"] = fake.text(max_nb_chars=200)

    if "account" not in args:
        args["account"] = create_account()

    if "nsfw" not in args:
        args["nsfw"] = False

    tags = args.pop("tags", [])
    for idx, tag in enumerate(tags):
        if isinstance(tag, Tag):
            tags[idx] = tag.name

    artwork = Artwork(**args)

    illusts = args.pop("illusts", None)
    if not illusts:
        illusts = [create_illust(artwork=artwork)]

    for illust in illusts:
        artwork.illusts.append(illust)
    update_tag_relation(artwork, tags)

    session.add(artwork)
    session.commit()

    args["account"].artworks_count += 1
    session.commit()

    return artwork


def create_illust(artwork, filename=None):
    if not filename:
        filename = fake.file_name(category="image")

    illust = Illust(
        artwork=artwork,
        filename=fake.file_name(category="image"),
    )
    session.add(illust)
    session.commit()

    return illust


def create_tag(name=None):
    if not name:
        name = fake.name()

    canonical_name = Tag.canonicalize(name)
    tag = Tag(canonical_name=canonical_name, name=name)

    session.add(tag)
    session.commit()

    return tag
