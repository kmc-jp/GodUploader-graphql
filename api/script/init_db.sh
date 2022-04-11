#!/bin/sh
set -eux

cd $(dirname $0)

MYSQL_HOST=${MYSQL_HOST:-db}
MYSQL_PORT=${MYSQL_PORTL-3306}
./wait-for-it.sh -h $MYSQL_HOST -p $MYSQL_PORT

echo 'CREATE DATABASE IF NOT EXISTS goduploader' | mysql -h $MYSQL_HOST -P $MYSQL_PORT
echo 'CREATE DATABASE IF NOT EXISTS goduploader_test' | mysql -h $MYSQL_HOST -P $MYSQL_PORT

cd -

poetry run alembic upgrade head

cd $(dirname $0)

poetry run python ./prepare_unknown_user.py
poetry run python ./freeze_edit_for_nsfw_tags.py
poetry run python ./freeze_edit_for_tegaki_du.py

cd -
