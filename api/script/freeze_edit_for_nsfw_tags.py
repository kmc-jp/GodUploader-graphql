from goduploader.db import engine, session
from goduploader.model.tag import Tag

engine.echo = True

with session.begin():
    tags = Tag.find_or_create(["R-18", "R-18G"])
    for tag in tags:
        tag.edit_freezed = True
