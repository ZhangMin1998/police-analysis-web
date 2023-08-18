FROM nginx:latest
LABEL maintainer="sundazhong.com sundazhong@suntang.com"

COPY /nginx/ /etc/nginx/
#VOLUME ./config/nginx:/etc/nginx/conf.d

COPY  /dist/ /usr/share/nginx/html/

EXPOSE 80