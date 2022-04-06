#!/bin/sh
set -eux

MYSQL_HOST=db
echo 'CREATE DATABASE IF NOT EXISTS goduploader' | mysql -h $MYSQL_HOST
echo 'CREATE DATABASE IF NOT EXISTS goduploader_test' | mysql -h $MYSQL_HOST
poetry run alembic upgrade head

poetry run python $(dirname $0)/prepare_unknown_user.py
poetry run python $(dirname $0)/freeze_edit_for_nsfw_tags.py
poetry run python $(dirname $0)/freeze_edit_for_tegaki_du.py
