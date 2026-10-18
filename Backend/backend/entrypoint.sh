#!/usr/bin/env bash
set -euo pipefail

# Entrypoint: wait for DB (by retrying migrations), run migrations and optional collectstatic,
# then exec the main process (passed as CMD in Dockerfile / compose).

MAX_RETRIES=${DB_MIGRATE_RETRIES:-30}
RETRY_DELAY=${DB_MIGRATE_DELAY:-2}
i=0

echo "[entrypoint] Running migrations (will retry up to ${MAX_RETRIES} times)..."
until python manage.py migrate --noinput; do
  i=$((i+1))
  if [ "$i" -ge "$MAX_RETRIES" ]; then
    echo "[entrypoint] ERROR: migrations failed after $i attempts" >&2
    exit 1
  fi
  echo "[entrypoint] Waiting for DB to be ready... attempt $i/$MAX_RETRIES"
  sleep "$RETRY_DELAY"
done

if [ "${COLLECT_STATIC:-0}" = "1" ]; then
  echo "[entrypoint] Collecting static files..."
  python manage.py collectstatic --noinput
fi

echo "[entrypoint] Starting main process: $@"
exec "$@"
