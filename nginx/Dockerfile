FROM nginx:1.20.2

RUN rm -f /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
