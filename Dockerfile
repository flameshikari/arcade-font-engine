FROM erseco/alpine-php-webserver:latest
RUN rm -rf /var/www/html/* && \
    echo 'short_open_tag = On' >> /etc/php81/conf.d/custom.ini && \
    sed -i 's|$uri/|$uri/ $uri.html|; s|fastcgi_index.*|expires 7d;|; s/ico|xml/ico|xml|txt/' /etc/nginx/nginx.conf

COPY --chown=nobody:nobody ./public/. /var/www/html
