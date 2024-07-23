FROM node:20-slim AS build
WORKDIR /app
COPY --chown=node package.json .
RUN npm install -d --no-package-lock
COPY . .
RUN npm run build

FROM erseco/alpine-php-webserver:3.20.4 AS release
USER root
RUN apk add --no-cache bash && \
    rm -rf /var/www/html/*
COPY ./docker/docker_setup.sh /setup.sh
COPY ./docker/populate_cache.sh /usr/bin/populate
RUN bash /setup.sh && \
    chmod +x /usr/bin/populate
COPY --chown=nobody:nobody --from=build /app/public/. /var/www/html
USER nobody