#!/bin/sh
set -eu

USE_DEVELOPMENT_SERVER=${USE_DEVELOPMENT_SERVER:-0}

/app/script/init_db.sh
if [ "$USE_DEVELOPMENT_SERVER" = "1" ]; then
  poetry run flask run --host 0.0.0.0 --port 5000
else
  poetry run uwsgi --http 0.0.0.0:5000 --master -p 4 --wsgi-file='src/goduploader/web.py' --callable='app'
fi
