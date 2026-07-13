#!/bin/sh
# Bring this dashboard up pointed at one backend API domain. The backend's
# domain is asked for once per deployment (i.e. once per clone of this repo
# / per server) and then remembered in .deploy.state, which is gitignored —
# delete that file, or pass --reconfigure, to be asked again (e.g. if the
# backend moves domains).
set -e
cd "$(dirname "$0")/.."

STATE_FILE=".deploy.state"

if [ "$1" = "--reconfigure" ]; then
    rm -f "$STATE_FILE"
fi

if [ -f "$STATE_FILE" ]; then
    # shellcheck disable=SC1090
    . "./$STATE_FILE"
fi

if [ -z "$API_URL" ]; then
    printf 'Backend API domain this dashboard should call (e.g. https://api.example.com): '
    read -r API_URL
    while [ -z "$API_URL" ]; do
        printf 'A backend API domain is required: '
        read -r API_URL
    done
    echo "API_URL=$API_URL" > "$STATE_FILE"
    echo "Saved to $STATE_FILE — future runs of this script won't ask again."
fi

export API_URL
docker compose -f docker-compose.prod.yml up -d --build

echo
echo "Dashboard is up on port 3000, calling API: $API_URL"
echo "(to change it later: $0 --reconfigure)"
echo
echo "Remember: that backend must also trust this dashboard's own domain"
echo "for CORS — set it via that repo's scripts/up.sh."
