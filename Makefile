all: front api

front: front/install front/build

front/install:
	cd front && yarn install --frozen-lockfile --cache-folder /tmp/yarn-cache

front/build:
	cd front && yarn build

api: api/install

api/install:
	cd api && poetry install

.PHONY: all front front/install front/build api/install
