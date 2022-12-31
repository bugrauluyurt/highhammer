FROM nginx

ENV CONF_DIR=/etc/nginx
ENV STATIC_DIR=/usr/share/nginx/html

# @TODO: Don't run it as super user.
EXPOSE 4200
COPY ./config/nginx/default.conf $CONF_DIR/nginx.conf
COPY ./dist/apps/client-app/ $STATIC_DIR
