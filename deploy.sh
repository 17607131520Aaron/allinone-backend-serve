#!/usr/bin/env bash

set -euo pipefail

# ==============================
# Docker deploy script
# ==============================
# Usage examples:
#   ./deploy.sh up                    # build (if needed) and start
#   ./deploy.sh build                 # build image only
#   ./deploy.sh down                  # stop and remove
#   ./deploy.sh test                  # clean, build test image, then start services
#   ./deploy.sh restart               # restart services
#   ./deploy.sh logs                  # tail logs
#   ./deploy.sh ps                    # list containers
#   ./deploy.sh cleanup               # prune dangling images/volumes
#
# Options (env or flags):
#   NODE_ENV=production               # --env/-e
#   SERVICE_PORT=9000                 # --port/-p
#   IMAGE_NAME=allinone-backend-serve # --image/-i (tag will be appended)
#   TAG=<auto>                        # --tag/-t  (default uses date+shortsha)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Defaults
NODE_ENV_DEFAULT="production"
SERVICE_PORT_DEFAULT="9000"
IMAGE_BASE_DEFAULT="allinone-backend-serve"

command="up"

# Parse flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    up|build|down|test|restart|logs|ps|cleanup)
      command="$1"; shift ;;
    --env|-e)
      NODE_ENV="${2:-}"; NODE_ENV_SET_EXPLICITLY=1; shift 2 ;;
    --port|-p)
      SERVICE_PORT="${2:-}"; shift 2 ;;
    --image|-i)
      IMAGE_BASE="${2:-}"; shift 2 ;;
    --tag|-t)
      TAG="${2:-}"; shift 2 ;;
    --help|-h)
      cat <<'EOF'
Usage: ./deploy.sh [command] [options]

Commands:
  up         Build (if needed) and start services in background
  build      Build docker image only
  down       Stop and remove services
  test       Clean containers/networks, build with NODE_ENV=test, then start
  restart    Restart services
  logs       Tail app and rabbitmq logs
  ps         Show compose services
  cleanup    Remove dangling images and volumes

Options (env or flags):
  -e, --env <env>         NODE_ENV (default: production)
  -p, --port <port>       SERVICE_PORT (default: 9000)
  -i, --image <name>      Base image name (default: allinone-backend-serve)
  -t, --tag <tag>         Image tag (default: date+git short sha if available)
Notes:
  If .env.<env> exists (e.g., .env.test), it will be auto-loaded and passed to compose.
EOF
      exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# Resolve tools
need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "Error: '$1' not found" >&2; exit 1; }; }
need_cmd docker

# Prefer 'docker compose' if available, fallback to docker-compose
if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
else
  need_cmd docker-compose
  COMPOSE=(docker-compose)
fi

# Pre-set defaults for special commands BEFORE resolving variables/printing
if [[ "$command" == "test" ]]; then
  if [[ -z "${NODE_ENV_SET_EXPLICITLY:-}" ]]; then
    NODE_ENV="test"
  fi
  if [[ -z "${TAG:-}" ]]; then
    TAG="test"
  fi
fi

# Resolve variables
NODE_ENV="${NODE_ENV:-${NODE_ENV_DEFAULT}}"
SERVICE_PORT="${SERVICE_PORT:-${SERVICE_PORT_DEFAULT}}"
IMAGE_BASE="${IMAGE_BASE:-${IMAGE_BASE_DEFAULT}}"

# Tag: prefer provided, else date+short sha if in git, else date
SHORT_SHA=""
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  SHORT_SHA="$(git rev-parse --short HEAD 2>/dev/null || true)"
fi
DATE_TAG="$(date +%Y%m%d-%H%M%S)"
if [[ -n "${TAG:-}" ]]; then
  IMAGE_TAG="$TAG"
else
  if [[ -n "$SHORT_SHA" ]]; then
    IMAGE_TAG="${DATE_TAG}-${SHORT_SHA}"
  else
    IMAGE_TAG="${DATE_TAG}"
  fi
fi

IMAGE_NAME="${IMAGE_BASE}:${IMAGE_TAG}"

export NODE_ENV SERVICE_PORT IMAGE_NAME

echo "Using settings:"
echo "  NODE_ENV     = $NODE_ENV"
echo "  SERVICE_PORT = $SERVICE_PORT"
echo "  IMAGE_NAME   = $IMAGE_NAME"

build_image() {
  echo "\n[1/1] Building image $IMAGE_NAME..."
  docker build \
    --build-arg NODE_ENV="$NODE_ENV" \
    --build-arg SERVICE_PORT="$SERVICE_PORT" \
    -t "$IMAGE_NAME" \
    .
}

remove_containers_if_exist() {
  # Remove containers that would conflict by name or old app image
  echo "Checking for existing containers to remove..."
  local names=(rabbitmq mysql redis)
  for n in "${names[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -E "^${n}$" >/dev/null 2>&1; then
      echo "Removing existing container: $n"
      docker rm -f "$n" || true
    fi
  done
  # Remove any containers created from older images of this app (base match)
  if docker ps -a --filter "ancestor=${IMAGE_BASE}" -q | grep . >/dev/null 2>&1; then
    echo "Removing containers using image ancestor ${IMAGE_BASE}"
    docker rm -f $(docker ps -a --filter "ancestor=${IMAGE_BASE}" -q) || true
  fi
}

print_endpoints() {
  echo "\nEndpoints:"
  local host="localhost"
  local app_port="$SERVICE_PORT"
  local rmq_mgmt_port=15672
  local rmq_amqp_port=5672
  local redis_port="${REDIS_HOST_PORT:-6379}"
  local mysql_port="${MYSQL_HOST_PORT:-3306}"

  # Attempt to read overrides from env file for printing only
  local env_file=".env.${NODE_ENV}"
  if [[ -f "$env_file" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$env_file"; set +a
    app_port="${SERVICE_PORT:-$app_port}"
    redis_port="${REDIS_HOST_PORT:-${REDIS_PORT:-$redis_port}}"
    mysql_port="${MYSQL_HOST_PORT:-${MYSQL_PORT:-$mysql_port}}"
  fi

  echo "  App:       http://${host}:${app_port}"
  echo "  RabbitMQ:  http://${host}:${rmq_mgmt_port} (mgmt), amqp://${host}:${rmq_amqp_port} (AMQP)"
  echo "  Redis:     redis://${host}:${redis_port}"
  echo "  MySQL:     ${host}:${mysql_port}"
}

compose_up() {
  echo "Starting services with docker compose..."
  # If an env file exists for current NODE_ENV, pass it to compose so SERVICE_PORT stays consistent
  ENV_FILE=".env.${NODE_ENV}"
  if [[ -f "$ENV_FILE" ]]; then
    echo "Using env file: $ENV_FILE"
    "${COMPOSE[@]}" --env-file "$ENV_FILE" up -d
  else
    "${COMPOSE[@]}" up -d
  fi
}

compose_down() {
  echo "Stopping and removing services..."
  ENV_FILE=".env.${NODE_ENV}"
  if [[ -f "$ENV_FILE" ]]; then
    "${COMPOSE[@]}" --env-file "$ENV_FILE" down
  else
    "${COMPOSE[@]}" down
  fi
}

compose_logs() {
  "${COMPOSE[@]}" logs -f --tail=200
}

compose_ps() {
  "${COMPOSE[@]}" ps
}

cleanup() {
  echo "Pruning dangling images and volumes..."
  docker image prune -f
  docker volume prune -f
}

case "$command" in
  build)
    remove_containers_if_exist
    build_image
    ;;
  up)
    remove_containers_if_exist
    build_image
    compose_up
    compose_ps
    print_endpoints
    ;;
  down)
    compose_down
    ;;
  test)
    compose_down
    remove_containers_if_exist
    build_image
    compose_up
    compose_ps
    print_endpoints
    ;;
  restart)
    compose_down
    remove_containers_if_exist
    build_image
    compose_up
    compose_ps
    print_endpoints
    ;;
  logs)
    compose_logs
    ;;
  ps)
    compose_ps
    ;;
  cleanup)
    cleanup
    ;;
  *)
    echo "Unknown command: $command" >&2; exit 1 ;;
esac

echo "Done."


