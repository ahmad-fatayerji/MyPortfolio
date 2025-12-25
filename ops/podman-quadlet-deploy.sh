#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/MyPortfolio}"
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

UNIT="ahmadfatayerji-web.service"
if systemctl --user is-active --quiet "$UNIT"; then
  systemctl --user restart "$UNIT"
else
  systemctl --user enable --now "$UNIT"
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
