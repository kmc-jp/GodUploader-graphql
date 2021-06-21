all: sync front api

sync:
	git pull

front: front/install front/build

front/install:
	cd front && yarn install --frozen-lockfile --cache-folder /tmp/yarn-cache

front/build:
	cd front && yarn build

api: api/install api/restart

api/install:
	cd api && poetry install

api/restart:
	touch api/tmp/restart.txt

.PHONY: all sync front front/install front/build api api/install
