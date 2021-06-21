all: sync front api

sync:
	git pull

front: front/install front/build

front/install:
	cd front && yarn install --frozen-lockfile --cache-folder /tmp/yarn-cache

front/build:
	cd front && yarn build

api: api/install

api/install:
	cd api && poetry install

.PHONY: all sync front front/install front/build api api/install
