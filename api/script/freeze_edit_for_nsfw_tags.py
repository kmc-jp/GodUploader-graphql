from goduploader.db import engine, session
from goduploader.tag import find_or_create_tags

engine.echo = True

canonicalized_nsfw_tags = ["r-18", "r-18g"]

with session.begin():
    tags = find_or_create_tags(["R-18", "R-18G"])
    for tag in tags:
        tag.edit_freezed = True
