import sys
sys.path.insert(0, '.')

from model import Account, Artwork, ArtworkIllustRelation, ArtworkTagRelation, Comment, Illust, Like, Tag
from db import session

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
            folders_count=old_row['folders_count'],
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

def migrate_folders():
    old_folders = from_db.cursor().execute('SELECT * FROM folders')
    for old_row in old_folders:
        new_artwork = Artwork(
            id=old_row['id'],
            title=old_row['title'],
            account_id=old_row['account_id'],
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

        new_relation = ArtworkIllustRelation(
            artwork_id=old_row['folder_id'],
            illust_id=old_row['id'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_relation)

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

def migrate_tags():
    old_tags = from_db.cursor().execute('SELECT * FROM tags')
    for old_row in old_tags:
        new_tag = Tag(
            id=old_row['id'],
            name=old_row['name'],
            created_at=old_row['created_at'],
            updated_at=old_row['updated_at'],
        )
        session.add(new_tag)

if __name__ == '__main__':
    main()
