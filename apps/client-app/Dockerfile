FROM nginx

ENV CONF_DIR=/etc/nginx
ENV STATIC_DIR=/usr/share/nginx/html

# @TODO: Don't run it as super user.
EXPOSE 8080
COPY ./config/nginx/default.conf $CONF_DIR/nginx.conf
COPY ./dist/ $STATIC_DIR
