all: front api

front: front/install front/build front/deploy

front-k8s: front/install front-k8s/build front-k8s/deploy

front/install:
	cd front && yarn install --frozen-lockfile

front/build:
	cd front && env DISABLE_ESLINT_PLUGIN=true yarn build

front/deploy:
	rsync -auv --delete-after front/build/ front/_app/

front-k8s/build:
	cd front && env DISABLE_ESLINT_PLUGIN=true DISABLE_ESLINT_PLUGIN=true PUBLIC_URL=/ REACT_APP_BASENAME=/ yarn build

front-k8s/deploy:
	rsync -auv --delete-after front/build/ front/_app_k8s/

api: api/install api/restart

api/install:
	cd api && poetry install

api/restart:
	passenger-config restart-app .

.PHONY: all front front/install front/build front-k8s/build front-k8s/deploy api api/install
