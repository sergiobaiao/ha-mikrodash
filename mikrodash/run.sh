#!/bin/sh
# nginx (ingress, :18099) em frente ao MikroDash (:3081)
export MIKRODASH_TRUSTED_PROXIES=127.0.0.1
nginx
exec /usr/local/bin/mikrodash -listen :3081 -data /data \
  -web /app/web/dist -static /app/web/public \
  -history -backup-scheduler -retention -alert-dispatch
