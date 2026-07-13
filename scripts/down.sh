#!/bin/sh
# Stop the production dashboard container.
set -e
cd "$(dirname "$0")/.."

[ -f ./.deploy.state ] && . ./.deploy.state

docker compose -f docker-compose.prod.yml down "$@"
