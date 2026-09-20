import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { QrInputError, validateDestination, validateSlug } from "./validation";

export type QrRoute = {
  slug: string;
  label: string;
  destination: string;
  enabled: number;
  created_at: string;
  updated_at: string;
};
let connection: Database.Database | undefined;
export function db() {
  if (connection) return connection;
  const directory = process.env.QR_DATA_DIR || path.join(process.cwd(), "data");
  mkdirSync(directory, { recursive: true });
  const database = new Database(path.join(directory, "qr.sqlite"));
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS qr_routes (
      slug TEXT PRIMARY KEY, label TEXT NOT NULL, destination TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, credential_hash TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_limits (id INTEGER PRIMARY KEY CHECK(id=1), attempts INTEGER NOT NULL, reset_at INTEGER NOT NULL);
  `);
  connection = database;
  return database;
}

export function listRoutes() {
  return db()
    .prepare("SELECT * FROM qr_routes ORDER BY created_at DESC, rowid DESC")
    .all() as QrRoute[];
}
export function getRoute(slug: string) {
  return db().prepare("SELECT * FROM qr_routes WHERE slug = ?").get(slug) as
    | QrRoute
    | undefined;
}
export function nextSlug() {
  const used = new Set(
    (
      db().prepare("SELECT slug FROM qr_routes").all() as { slug: string }[]
    ).map((r) => r.slug),
  );
  let number = 1;
  while (used.has(String(number))) number++;
  return String(number);
}
function labelValue(label: string) {
  if (label.trim().length > 120)
    throw new QrInputError("Keep the label under 120 characters.");
  return label.trim();
}
export function createRoute(slug: string, label: string, destination: string) {
  const target = validateDestination(destination);
  const name = labelValue(label);
  return db()
    .transaction(() => {
      const selected = slug.trim() ? validateSlug(slug.trim()) : nextSlug();
      if (getRoute(selected))
        throw new QrInputError(
          "That route name already exists. Choose another name.",
        );
      db()
        .prepare(
          "INSERT INTO qr_routes (slug, label, destination) VALUES (?, ?, ?)",
        )
        .run(selected, name, target);
      return selected;
    })
    .immediate();
}
export function updateRoute(slug: string, label: string, destination: string) {
  const result = db()
    .prepare(
      "UPDATE qr_routes SET label=?, destination=?, updated_at=CURRENT_TIMESTAMP WHERE slug=?",
    )
    .run(
      labelValue(label),
      validateDestination(destination),
      validateSlug(slug),
    );
  if (!result.changes) throw new QrInputError("This route no longer exists.");
}
export function setEnabled(slug: string, enabled: boolean) {
  const result = db()
    .prepare(
      "UPDATE qr_routes SET enabled=?, updated_at=CURRENT_TIMESTAMP WHERE slug=?",
    )
    .run(Number(enabled), validateSlug(slug));
  if (!result.changes) throw new QrInputError("This route no longer exists.");
}
