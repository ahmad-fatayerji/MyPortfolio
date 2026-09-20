#!/usr/bin/env bash
# CI forwards these environment variables over SSH; never print their values.
set +x
set -euo pipefail

if [[ ! "${ADMIN_PASSWORD_HASH:-}" =~ ^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$ ]]; then
  echo "ERROR: ADMIN_PASSWORD_HASH is missing or invalid. Configure the GitHub Actions secret." >&2
  exit 1
fi
if [[ ! "${SITE_ORIGIN:-}" =~ ^https://[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?(:[0-9]{1,5})?$ ]]; then
  echo "ERROR: SITE_ORIGIN must be an HTTPS origin without a path or trailing slash." >&2
  exit 1
fi
if [[ "${1:-}" == "--check" ]]; then
  exit 0
fi

ADMIN_CONFIG_DIR="${QUADLET_DIR:-$HOME/.config/containers/systemd}"
umask 077
mkdir -p "$ADMIN_CONFIG_DIR"
ADMIN_ENV_TEMP="$(mktemp "$ADMIN_CONFIG_DIR/.admin.env.XXXXXX")"
trap 'rm -f -- "$ADMIN_ENV_TEMP"' EXIT
printf 'ADMIN_PASSWORD_HASH=%s\nSITE_ORIGIN=%s\n' "$ADMIN_PASSWORD_HASH" "$SITE_ORIGIN" > "$ADMIN_ENV_TEMP"
chmod 600 "$ADMIN_ENV_TEMP"
mv -f -- "$ADMIN_ENV_TEMP" "$ADMIN_CONFIG_DIR/admin.env"
