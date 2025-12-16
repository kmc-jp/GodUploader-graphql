#!/bin/sh
set -eux

cd $(dirname $0)

sqlite3 ../db/god.db < ../schema.sql

cd $(dirname $0)

poetry run python ./prepare_unknown_user.py
poetry run python ./freeze_edit_for_tegaki_du.py

cd -
