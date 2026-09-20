import Database from "better-sqlite3";
import path from "node:path";

const destination = process.argv[2];
if (!destination)
  throw new Error(
    "Usage: node ops/qr-backup.mjs /absolute/path/to/backup.sqlite",
  );
const source = path.join(
  process.env.QR_DATA_DIR || path.join(process.cwd(), "data"),
  "qr.sqlite",
);
if (path.resolve(source) === path.resolve(destination))
  throw new Error("Backup destination must differ from the database.");
const db = new Database(source, { readonly: true, fileMustExist: true });
try {
  await db.backup(destination);
  console.log("QR database backup complete.");
} finally {
  db.close();
}
