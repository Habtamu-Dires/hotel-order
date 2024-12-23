#!/bin/bash

sed -i "s#__API_URL_PLACEHOLDER__#${API_URL}#g" /usr/share/nginx/html/index.html

# start nginx
nginx -g "daemon off;"
