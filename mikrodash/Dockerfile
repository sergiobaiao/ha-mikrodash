FROM ghcr.io/secops-7/mikrodash:0.8.82
RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY ingress.js /etc/nginx/ingress.js
COPY run.sh /run.sh
RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]
