#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  ./scripts/deploy.sh            # Standard: benutzt docker-compose.yml und .env
#  COMPOSE_FILE=docker-compose.yml ./scripts/deploy.sh
#  ENV_FILE=.env.production ./scripts/deploy.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
ENV_FILE="${ENV_FILE:-.env}"
MIGRATE_SERVICE="${MIGRATE_SERVICE:-backend}"
MIGRATE="${MIGRATE:-1}"
PRUNE="${PRUNE:-1}"
NO_CACHE="${NO_CACHE:-0}"

show_help(){
  cat <<EOF
Usage: $0 [--no-cache]
Environment variables (optional):
  COMPOSE_FILE   path to compose file (default: docker-compose.yml)
  ENV_FILE       path to env file to source (default: .env)
  MIGRATE_SERVICE service name used to run migrations (default: backend)
  MIGRATE        1/0 run migrations (default: 1)
  PRUNE          1/0 prune images after deploy (default: 1)
  NO_CACHE       1/0 pass --no-cache to build (default: 0)
EOF
}

if [[ "${1:-}" =~ ^(-h|--help)$ ]]; then
  show_help
  exit 0
fi

if [[ "$NO_CACHE" == "1" ]] || [[ "${1:-}" == "--no-cache" ]]; then
  BUILD_NO_CACHE_FLAG="--no-cache"
else
  BUILD_NO_CACHE_FLAG=""
fi

echo "[deploy] Root: $ROOT_DIR"
echo "[deploy] Compose: $COMPOSE_FILE  Env: $ENV_FILE  Migrate: $MIGRATE  Service: $MIGRATE_SERVICE"

if [[ -f "$ENV_FILE" ]]; then
  echo "[deploy] Sourcing $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

echo "[deploy] Pulling images..."
docker compose -f "$COMPOSE_FILE" pull

echo "[deploy] Building images..."
docker compose -f "$COMPOSE_FILE" build $BUILD_NO_CACHE_FLAG --pull

if [[ "$MIGRATE" == "1" ]]; then
  echo "[deploy] Running migrations on service '$MIGRATE_SERVICE' (if present)"
  if docker compose -f "$COMPOSE_FILE" ps --services | grep -q "^$MIGRATE_SERVICE$"; then
    docker compose -f "$COMPOSE_FILE" run --rm "$MIGRATE_SERVICE" python manage.py migrate || {
      echo "[deploy] WARNING: migrations command failed" >&2
    }
  else
    echo "[deploy] Service '$MIGRATE_SERVICE' not found in compose, skipping migrations"
  fi
fi

echo "[deploy] Starting services (detached)..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

if [[ "$PRUNE" == "1" ]]; then
  echo "[deploy] Pruning unused images..."
  docker image prune -f || true
fi

echo "[deploy] Done. Active containers:"
docker compose -f "$COMPOSE_FILE" ps

exit 0
