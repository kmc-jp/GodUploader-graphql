#!/bin/sh
set -eu

sleep 5
/app/script/init_db.sh
poetry run flask run --host 0.0.0.0 --port 5000
