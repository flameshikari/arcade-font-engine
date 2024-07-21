FROM node:20-slim AS build
WORKDIR /app
COPY --chown=node package.json .
RUN npm install -d --no-package-lock
COPY . .
RUN npm run build

FROM erseco/alpine-php-webserver:latest AS release
RUN rm -rf /var/www/html/* && \
    echo 'short_open_tag = On' >> /etc/php83/conf.d/custom.ini && \
    sed -i 's|$uri/|$uri/ $uri.html|; s|fastcgi_index.*|expires 7d;|; s/ico|xml/ico|xml|txt/' /etc/nginx/nginx.conf

COPY --chown=nobody:nobody --from=build /app/public/. /var/www/html
