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

# Detect available docker compose command (docker compose plugin or docker-compose binary)
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "[deploy] ERROR: neither 'docker compose' nor 'docker-compose' available" >&2
  exit 1
fi

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

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

echo "[deploy] Root: $ROOT_DIR"
echo "[deploy] Compose: $COMPOSE_FILE  Env: $ENV_FILE  Migrate: $MIGRATE  Service: $MIGRATE_SERVICE"

echo "[deploy] Pulling images..."
$COMPOSE_CMD -f "$COMPOSE_FILE" pull --ignore-pull-failures || true

echo "[deploy] Building images..."
$COMPOSE_CMD -f "$COMPOSE_FILE" build $BUILD_NO_CACHE_FLAG --pull || true

echo "[deploy] Starting infrastructure services..."
$COMPOSE_CMD -f "$COMPOSE_FILE" up -d --remove-orphans db redis || true

echo "[deploy] Waiting for PostgreSQL..."
for i in $(seq 1 60); do
  if $COMPOSE_CMD -f "$COMPOSE_FILE" exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! $COMPOSE_CMD -f "$COMPOSE_FILE" exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; then
  echo "[deploy] ERROR: PostgreSQL did not become ready in time" >&2
  exit 1
fi

echo "[deploy] Waiting for Redis..."
for i in $(seq 1 60); do
  if $COMPOSE_CMD -f "$COMPOSE_FILE" exec -T redis redis-cli ping >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! $COMPOSE_CMD -f "$COMPOSE_FILE" exec -T redis redis-cli ping >/dev/null 2>&1; then
  echo "[deploy] ERROR: Redis did not become ready in time" >&2
  exit 1
fi

if [[ "$MIGRATE" == "1" ]]; then
  echo "[deploy] Running database migrations..."
  if $COMPOSE_CMD -f "$COMPOSE_FILE" ps --services | grep -q "^$MIGRATE_SERVICE$"; then
    $COMPOSE_CMD -f "$COMPOSE_FILE" run --rm --no-deps "$MIGRATE_SERVICE" python manage.py migrate || {
      echo "[deploy] WARNING: migrations command failed" >&2
    }
  else
    echo "[deploy] Service '$MIGRATE_SERVICE' not found in compose, skipping migrations"
  fi
fi

echo "[deploy] Updating backend..."
$COMPOSE_CMD -f "$COMPOSE_FILE" up -d --no-deps --build backend

echo "[deploy] Updating frontend..."
$COMPOSE_CMD -f "$COMPOSE_FILE" up -d --no-deps --build frontend

if [[ "$PRUNE" == "1" ]]; then
  echo "[deploy] Pruning unused images..."
  docker image prune -f || true
fi

echo "[deploy] Deployment finished."
$COMPOSE_CMD -f "$COMPOSE_FILE" ps

exit 0
