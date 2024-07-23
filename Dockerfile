FROM node:20-slim AS build
WORKDIR /app
COPY --chown=node package.json .
RUN npm install -d --no-package-lock
COPY . .
RUN npm run build

FROM erseco/alpine-php-webserver:3.20.4 AS release
USER root
COPY setup.sh /setup.sh
RUN sh /setup.sh
COPY --chown=nobody:nobody --from=build /app/public/. /var/www/html
USER nobody