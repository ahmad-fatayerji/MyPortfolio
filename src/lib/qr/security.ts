import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { db } from "./store";

export const SESSION_SECONDS = 8 * 60 * 60;
export function passwordConfigured() {
  return /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(
    process.env.ADMIN_PASSWORD_HASH || "",
  );
}
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const credentialHash = () => digest(process.env.ADMIN_PASSWORD_HASH || "");
export function verifyPassword(password: string) {
  if (!passwordConfigured() || password.length > 1024) return false;
  const [, salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(hash, "hex"),
  );
}
export function consumeLoginAttempt(now = Date.now()) {
  return db()
    .transaction(() => {
      const row = db()
        .prepare("SELECT attempts, reset_at FROM login_limits WHERE id=1")
        .get() as { attempts: number; reset_at: number } | undefined;
      if (!row || row.reset_at <= now) {
        db()
          .prepare("INSERT OR REPLACE INTO login_limits VALUES (1, 1, ?)")
          .run(now + 15 * 60 * 1000);
        return true;
      }
      if (row.attempts >= 10) return false;
      db()
        .prepare("UPDATE login_limits SET attempts=attempts+1 WHERE id=1")
        .run();
      return true;
    })
    .immediate();
}
export function newSession() {
  const token = randomBytes(32).toString("hex");
  db()
    .prepare(
      "DELETE FROM admin_sessions WHERE expires_at <= ? OR credential_hash != ?",
    )
    .run(Date.now(), credentialHash());
  db()
    .prepare("INSERT INTO admin_sessions VALUES (?, ?, ?)")
    .run(digest(token), credentialHash(), Date.now() + SESSION_SECONDS * 1000);
  return token;
}
export function validSession(token: string | undefined) {
  if (!passwordConfigured() || !token || !/^[a-f0-9]{64}$/.test(token))
    return false;
  return !!db()
    .prepare(
      "SELECT 1 FROM admin_sessions WHERE token_hash=? AND credential_hash=? AND expires_at>?",
    )
    .get(digest(token), credentialHash(), Date.now());
}
export function revokeSession(token: string) {
  db()
    .prepare("DELETE FROM admin_sessions WHERE token_hash=?")
    .run(digest(token));
}
