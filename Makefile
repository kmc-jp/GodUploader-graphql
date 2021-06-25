all: front api

front: front/install front/build front/deploy

front/install:
	cd front && yarn install --frozen-lockfile --cache-folder /tmp/yarn-cache

front/build:
	cd front && yarn build

front/deploy:
	rsync -auv --delete front/build/ front/_app/

api: api/install api/restart

api/install:
	cd api && poetry install

api/restart:
	touch api/tmp/restart.txt

.PHONY: all front front/install front/build api api/install
