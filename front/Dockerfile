FROM node:16 AS builder

WORKDIR /front
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./src ./src
RUN yarn build

FROM nginx:1.21.6
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /front/build /var/www/front/
