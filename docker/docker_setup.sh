#!/bin/bash

set -e

echo 'short_open_tag = On' >> /etc/php83/conf.d/custom.ini

cat << 'EOF' > /etc/nginx/nginx.conf
worker_processes 1;
error_log stderr warn;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;

    log_format main_timed '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for" '
                          '$request_time $upstream_response_time $pipe $upstream_cache_status';

    access_log /dev/stdout main_timed;
    error_log /dev/stderr notice;

    keepalive_timeout 65;

    client_body_temp_path /tmp/client_temp;
    proxy_temp_path /tmp/proxy_temp_path;
    fastcgi_temp_path /tmp/fastcgi_temp;
    uwsgi_temp_path /tmp/uwsgi_temp;
    scgi_temp_path /tmp/scgi_temp;

    server {
        listen 8080 default_server;
        server_name _;

        sendfile off;

        set $forwarded_scheme "http";
        if ($http_x_forwarded_proto = "https") {
            set $forwarded_scheme "https";
        }

        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;

        client_max_body_size ${client_max_body_size};
        client_body_buffer_size 128k;

        root ${nginx_root_directory};
        index index.php index.html;

        location / {
            try_files $uri $uri/ $uri.html;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /var/lib/nginx/html;
        }

        location /api/ {
            try_files $uri $uri/ /api.php?$args;
        }

        location ~ [^/]\.php(/|$) {
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_pass unix:/run/php-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param SCRIPT_NAME $fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_path_info;
            expires 7d;
            include fastcgi_params;

            fastcgi_param HTTP_X_FORWARDED_PROTO $forwarded_scheme;
            fastcgi_param HTTPS $https if_not_empty;
            
        }

        location ~* \.(jpg|jpeg|gif|png|css|js|ico|xml)$ {
            expires 5d;
        }

        location ~ /\. {
            log_not_found off;
            deny all;
        }

        location ~ ^/(fpm-status|fpm-ping)$ {
            access_log off;
            allow 127.0.0.1;
            deny all;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            fastcgi_pass unix:/run/php-fpm.sock;
        }
    }

    include /etc/nginx/conf.d/*.conf;

    gzip on;
    gzip_proxied any;
    gzip_types text/richtext text/plain text/css text/x-script text/x-component text/x-java-source text/x-markdown application/javascript application/x-javascript text/javascript text/js image/x-icon image/vnd.microsoft.icon application/x-perl application/x-httpd-cgi text/xml application/xml application/rss+xml application/vnd.api+json application/x-protobuf application/json multipart/bag multipart/mixed application/xhtml+xml font/ttf font/otf font/x-woff image/svg+xml application/vnd.ms-fontobject application/ttf application/x-ttf application/otf application/x-otf application/truetype application/opentype application/x-opentype application/font-woff application/eot application/font application/font-sfnt application/wasm application/javascript-binast application/manifest+json application/ld+json application/graphql+json application/geo+json;
    gzip_vary on;
    gzip_disable "msie6";

}
EOF

rm -- "$0"
