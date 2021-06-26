from goduploader.db import engine, session
from goduploader.tag import find_or_create_tags

engine.echo = True

with session.begin():
    tags = find_or_create_tags(["tegaki_du"])
    for tag in tags:
        tag.edit_freezed = True
