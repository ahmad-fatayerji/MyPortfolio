import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { scryptSync, randomBytes } from "node:crypto";

const salt = randomBytes(16).toString("hex");
process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt}:${scryptSync("qr-admin-browser-test-only", salt, 64).toString("hex")}`;
process.env.QR_DATA_DIR = mkdtempSync(path.join(tmpdir(), "qr-browser-"));
process.env.SITE_ORIGIN = "http://localhost:3107";
process.env.PORT = "3107";
process.env.HOSTNAME = "localhost";
await import("../.next/standalone/server.js");
