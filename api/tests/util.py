from goduploader.model import Account, Artwork, Illust
from goduploader.viewer import viewer
from goduploader.db import session
from faker import Faker

fake = Faker()

class MockContext:
    def __init__(self, user):
        self.user = user

def mock_context(kmcid=None):
    user = viewer(kmcid)
    return MockContext(user)

def create_account(**args):
    if 'kmcid' not in args:
        args['kmcid'] = fake.user_name()

    if 'name' not in args:
        args['name'] = fake.name()

    account = Account(**args)
    session.add(account)
    session.commit()

    return account

def create_artwork(**args):
    if 'title' not in args:
        args['title'] = fake.text(max_nb_chars=32)

    if 'caption' not in args:
        args['caption'] = fake.text(max_nb_chars=200)

    if 'account' not in args:
        args['account'] = create_account()

    artwork = Artwork(**args)
    illust = Illust(filename=fake.file_name(category='image'))
    artwork.illusts.append(illust)
    session.add(artwork)
    session.add(illust)
    session.commit()

    args['account'].artworks_count += 1
    artwork.top_illust_id = illust.id
    session.commit()

    return artwork
