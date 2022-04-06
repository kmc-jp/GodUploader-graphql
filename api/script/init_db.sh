#!/bin/sh
set -eux

MYSQL_HOST=db
echo 'CREATE DATABASE IF NOT EXISTS goduploader' | mysql -h $MYSQL_HOST
poetry run alembic upgrade head
