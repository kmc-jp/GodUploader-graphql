all: front api

front: front/install front/build front/deploy

front/install:
	cd front && yarn install --frozen-lockfile --cache-folder /tmp/yarn-cache

front/build:
	cd front && env DISABLE_ESLINT_PLUGIN=true yarn build

front/deploy:
	rsync -auv --delete-after front/build/ front/_app/

api: api/install api/restart

api/install:
	cd api && poetry install

api/restart:
	passenger-config restart-app .

.PHONY: all front front/install front/build api api/install
