FROM node:16 AS builder

WORKDIR /front
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./tsconfig.json ./tsconfig.json
COPY ./public ./public
COPY ./src ./src
ARG revision
ENV REACT_APP_REVISION=${revision}
RUN yarn build

FROM nginx:1.21.6 AS runner
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /front/build /var/www/front/
