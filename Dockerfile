FROM oven/bun:latest AS build
WORKDIR /app
COPY --chown=node package.json .
RUN bun install
COPY . .
RUN bun run build:prod

FROM erseco/alpine-php-webserver:3.22.2 AS release
USER root
RUN apk add bash && echo 'short_open_tag = On' >> /etc/php84/php.ini
COPY --chmod=0755 rootfs/ /
WORKDIR /app
COPY --chown=nobody --from=build /app/public/. .
USER nobody