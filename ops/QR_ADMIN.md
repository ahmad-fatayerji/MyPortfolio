# QR admin operations

Open `/admin/` to create, edit, disable, or re-enable QR routes. A blank route name
allocates the next free number. Names stay fixed; destinations can change anytime.
PNG and SVG downloads encode the permanent `/qr/<name>/` URL.

## Local development

Run `npm run admin:password` and enter a unique password (input is hidden). Copy
the resulting `ADMIN_PASSWORD_HASH=...` line into `.env.local`, then add:

```dotenv
SITE_ORIGIN=http://localhost:3000
QR_DATA_DIR=./data
```

Run `npm run dev` and visit `http://localhost:3000/admin/`. Use the production
origin when printing real handouts. Missing or invalid password configuration
leaves admin disabled. Runtime data is excluded from Git and container builds.

## Production setup (before deploying)

Production Quadlet configuration is managed by GitHub Actions. Under repository
**Settings → Secrets and variables → Actions**, configure:

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `SSH_HOST` | VPS hostname or IP (existing) |
| Secret | `SSH_USER` | User running the rootless Quadlet service (existing) |
| Secret | `SSH_KEY` | That user's authorized SSH private key (existing) |
| Secret | `ADMIN_PASSWORD_HASH` | Generated scrypt hash, without the `ADMIN_PASSWORD_HASH=` prefix |
| Variable, optional | `SITE_ORIGIN` | Defaults to `https://ahmadfatayerji.com`; HTTPS origin without a trailing slash |

Generate the hash locally with `npm run admin:password`. Store the part beginning
with `scrypt:` as the secret value, not the plaintext password. Push to `production`
or manually run the deployment workflow after the changes are on that branch.

CI validates the configuration before SSH, forwards it as environment variables,
and writes a mode-600 `admin.env` beside the deployed Quadlet, normally at
`~/.config/containers/systemd/admin.env`. Quadlet loads it as runtime environment
variables. The file is updated atomically after the image builds and before the
service restarts; it remains available for subsequent restarts and reboots.
No manual VPS environment file or additional sudo access is required.

The previous `/etc/ahmadfatayerji/admin.env` path is no longer used by Quadlet.
Never commit the password, hash, environment file, or database. Manual deployments
must export `ADMIN_PASSWORD_HASH` and `SITE_ORIGIN` before running the deploy script.
Docker Compose, if used separately, still takes an environment file via
`ADMIN_ENV_FILE` (default `/etc/ahmadfatayerji/admin.env`).

The container mounts persistent storage at `/app/data`. Podman uses the named
volume `ahmadfatayerji-qr-data`, with `:U` assigning ownership to container UID
1001. Compose initializes its `qr-data` volume from the image's owned directory.
Do not delete volumes or use `compose down -v` during deployment.

Keep `/admin/` and `/qr/` uncached at the reverse proxy and forward the original
Host and Origin headers. Login accepts the configured HTTPS origin and its
`www`/non-`www` counterpart, with the same port. Other origins remain blocked.
QR images continue using the configured canonical origin. Slashless
links may first receive Next.js trailing-slash normalization; the final `/qr/1/`
lookup always uses an uncached temporary redirect.

## Password rotation and sessions

Generate a new hash, replace the GitHub Actions `ADMIN_PASSWORD_HASH` secret,
and rerun the deployment workflow.
Existing sessions become invalid when the hash changes. Sessions expire after
eight hours, and logout revokes the current session. No registration or recovery
endpoint is provided.

Login allows ten attempts per 15-minute window globally for this single-admin
site. The limit persists across restarts and does not trust client IP headers.
When it is reached, wait for the window to expire.

## Backup and restore

Use the online backup API; copying just the live SQLite file can miss WAL data:

```sh
podman exec ahmadfatayerji-web node ops/qr-backup.mjs /app/data/qr-backup.sqlite
podman cp ahmadfatayerji-web:/app/data/qr-backup.sqlite ./qr-backup.sqlite
```

Substitute `docker` for `podman` with Compose. Keep backups outside the volume,
with restricted access: they contain destinations and session records. Schedule
the command through your backup system and run it before storage changes.

To restore with Podman, stop the service and replace the database in a helper:

```sh
systemctl --user stop ahmadfatayerji-web.service
podman run --rm --user 0 --entrypoint sh \
  -v ahmadfatayerji-qr-data:/app/data:U \
  -v "$PWD/qr-backup.sqlite:/restore/qr.sqlite:ro" \
  localhost/ahmadfatayerji-web:latest \
  -c 'rm -f /app/data/qr.sqlite-wal /app/data/qr.sqlite-shm && cp /restore/qr.sqlite /app/data/qr.sqlite && chown 1001:1001 /app/data/qr.sqlite'
```

Rotate the admin password before starting the service to invalidate restored
sessions. With Compose, stop `web` and restore into its project-prefixed `qr-data`
volume using an equivalent helper; identify the volume using `docker volume ls`.
Never restore over a running database.

## Verification

- `npm run test:qr`: routing, validation, sessions, rate limits, QR decoding,
  cross-process persistence, and online backup.
- `npm run test:qr:browser`: isolated browser tests; requires installed Chrome.
- `npm run build`: production build and standalone packaging.
- After deployment, create a route, edit, disable, and re-enable it. Recreate the
  container and confirm that the mapping still resolves.

Storage assumes one application instance and a local persistent volume. Add a
shared storage architecture before deploying multiple replicas.
