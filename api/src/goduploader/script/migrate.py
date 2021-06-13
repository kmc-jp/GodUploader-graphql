import sys
sys.path.insert(0, '.')

from model import Account, Artwork, ArtworkTagRelation, Comment, Illust, Like, Tag
from db import session

from collections import defaultdict
import sqlite3
from_db = sqlite3.connect('./from.db', detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
from_db.row_factory = sqlite3.Row

sqlite3.dbapi2.converters['DATETIME'] = sqlite3.dbapi2.converters['TIMESTAMP']

def main():
    with session.begin():
        migrate_accounts()
        migrate_comments()
        migrate_folders()
        migrate_folderstags()
        migrate_illusts()
        migrate_likes()
        migrate_tags()

def migrate_accounts():
    old_accounts = from_db.cursor().execute('SELECT * FROM accounts')
    for old_row in old_accounts:
        new_account = Account(
            id=old_row['id'],
            kmcid=old_row['kmcid'],
            name=old_row['name'],
            artworks_count=old_row['folders_count'],
            last_logged_in=old_row['lastlogin'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_account)

def migrate_comments():
    old_comments = from_db.cursor().execute('SELECT * FROM comments')
    for old_row in old_comments:
        new_comment = Comment(
            id=old_row['id'],
            text='' if old_row['text'] is None else old_row['text'],
            account_id=old_row['account_id'],
            artwork_id=old_row['folder_id'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_comment)

def collect_nsfw_folder_ids():
    folder_ids = from_db.cursor().execute('''
        select f.id
        from folders f
        left join folderstags ft
        on f.id = ft.folder_id
        left join tags t on ft.tag_id = t.id
        where t.name in ('R-18', 'R-18G')
    ''')
    return set(row['id'] for row in folder_ids)

def migrate_folders():
    old_folders = from_db.cursor().execute('SELECT * FROM folders')
    nsfw_folder_ids = collect_nsfw_folder_ids()
    for old_row in old_folders:
        new_artwork = Artwork(
            id=old_row['id'],
            title=old_row['title'],
            account_id=old_row['account_id'],
            nsfw=old_row['id'] in nsfw_folder_ids,
            caption=old_row['caption'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_artwork)

def migrate_folderstags():
    old_folderstags = from_db.cursor().execute('SELECT * FROM folderstags')
    for old_row in old_folderstags:
        new_relation = ArtworkTagRelation(
            artwork_id=old_row['folder_id'],
            tag_id=old_row['tag_id'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_relation)

def migrate_illusts():
    old_illusts = from_db.cursor().execute('SELECT * FROM illusts')
    for old_row in old_illusts:
        new_illust = Illust(
            id=old_row['id'],
            filename=old_row['filename'],
            artwork_id=old_row['folder_id'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_illust)

def migrate_likes():
    old_likes = from_db.cursor().execute('SELECT * FROM likes')
    for old_row in old_likes:
        new_like = Like(
            id=old_row['id'],
            account_id=old_row['account_id'],
            artwork_id=old_row['folder_id'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_like)

def build_tag_id_to_count():
    rows = from_db.cursor().execute('''
        SELECT
            t.id,
            COUNT(f.id) AS cnt
        FROM tags AS t
        LEFT JOIN folderstags AS ft
        ON ft.tag_id = t.id
        LEFT JOIN folders AS f
        ON ft.folder_id = f.id
        GROUP BY t.id
    ''')

    tag_id_to_count = defaultdict(int)
    for row in rows:
        tag_id_to_count[row['id']] = row['cnt']

    return tag_id_to_count

def migrate_tags():
    old_tags = from_db.cursor().execute('SELECT * FROM tags')
    tag_id_to_count = build_tag_id_to_count()
    for old_row in old_tags:
        new_tag = Tag(
            id=old_row['id'],
            name=old_row['name'],
            artworks_count=tag_id_to_count[old_row['id']],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_tag)

if __name__ == '__main__':
    main()
