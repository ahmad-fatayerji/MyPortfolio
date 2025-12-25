#!/usr/bin/env bash
set -euo pipefail

SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${APP_DIR:-$SCRIPT_ROOT}"
QUADLET_DIR="${QUADLET_DIR:-$HOME/.config/containers/systemd}"
TEMPLATE_FILE="$APP_DIR/ops/quadlet/ahmadfatayerji-web.container"
GIT_REF="${GIT_REF:-production}"
APP_PORT=3000

if [[ -z "${XDG_RUNTIME_DIR:-}" ]]; then
  export XDG_RUNTIME_DIR="/run/user/$(id -u)"
fi
if [[ -z "${DBUS_SESSION_BUS_ADDRESS:-}" ]]; then
  export DBUS_SESSION_BUS_ADDRESS="unix:path=$XDG_RUNTIME_DIR/bus"
fi

cd "$APP_DIR"

if [[ "${GIT_PULL:-0}" == "1" ]]; then
  echo "==> Updating repo (git pull)"
  git fetch --all --prune
  git checkout "$GIT_REF"
  git pull --ff-only origin "$GIT_REF"
fi

mkdir -p "$QUADLET_DIR"
cp -f "$TEMPLATE_FILE" "$QUADLET_DIR/ahmadfatayerji-web.container"

echo "==> Building image"
podman build -t localhost/ahmadfatayerji-web:latest .

echo "==> Reloading systemd user units"
systemctl --user daemon-reload
sleep 2

UNIT_CONTAINER_PATH="$QUADLET_DIR/ahmadfatayerji-web.container"
UNIT_SERVICE="ahmadfatayerji-web.service"

# Enable via absolute path to avoid .container -> .service suffix confusion.
if systemctl --user enable --now "$UNIT_CONTAINER_PATH" 2>/dev/null; then
  systemctl --user restart "$UNIT_SERVICE"
else
  systemctl --user restart "$UNIT_SERVICE"
fi

echo "==> Health check"
for i in $(seq 1 60); do
  if curl -sfI "http://127.0.0.1:${APP_PORT}" >/dev/null 2>&1; then
    echo "App is responding on :${APP_PORT}"
    exit 0
  fi
  sleep 1
done

echo "App did not become healthy on :${APP_PORT}" >&2
podman logs --tail=200 ahmadfatayerji-web || true
exit 1
