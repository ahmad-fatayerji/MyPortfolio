import { after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { spawnSync } from "node:child_process";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import {
  assertOrigin,
  routeUrl,
  validateDestination,
  validateSlug,
} from "../src/lib/qr/validation";
import {
  createRoute,
  db,
  getRoute,
  nextSlug,
  setEnabled,
  updateRoute,
} from "../src/lib/qr/store";
import {
  consumeLoginAttempt,
  newSession,
  passwordConfigured,
  revokeSession,
  validSession,
  verifyPassword,
} from "../src/lib/qr/security";
import { GET } from "../src/app/qr/[slug]/route";

const directory = mkdtempSync(path.join(os.tmpdir(), "portfolio-qr-"));
process.env.QR_DATA_DIR = directory;
process.env.SITE_ORIGIN = "https://ahmadfatayerji.com";
const password = randomBytes(24).toString("hex");
const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
process.env.ADMIN_PASSWORD_HASH = hash;
after(() => {
  db().close();
  rmSync(directory, { recursive: true, force: true });
});

test("validates route names and destinations, including loop and protocol bypasses", () => {
  for (const slug of ["1", "cv-fr"]) assert.equal(validateSlug(slug), slug);
  for (const slug of ["../admin", "CV", "a/b", "-name", "a--b"])
    assert.throws(() => validateSlug(slug));
  for (const url of [
    "/Ahmad_FATAYERJI_CV.pdf",
    "https://example.com/cv?lang=fr#cv",
  ])
    assert.equal(validateDestination(url), url);
  for (const url of [
    "javascript:alert(1)",
    "ftp://example.com",
    "//example.com",
    "/\\example.com",
    "https://user:pass@example.com",
    "/qr/1",
    "/%71r/1",
    "/x/../qr/1",
    "https://www.ahmadfatayerji.com/qr/cv",
    "http://ahmadfatayerji.com/qr/1",
    "/qr%2f1",
    "/bad%",
  ])
    assert.throws(() => validateDestination(url), url);
});

test("creates, updates, disables and re-enables stable routes with uncached redirects", async () => {
  assert.equal(createRoute("", "English", "/english.pdf"), "1");
  assert.equal(createRoute("", "", "https://example.com"), "2");
  createRoute("cv-fr", "French", "/french.pdf");
  assert.equal(nextSlug(), "3");
  assert.throws(() => createRoute("cv-fr", "", "/other.pdf"), /already exists/);
  const request = () =>
    GET(new Request(routeUrl("1")), { params: Promise.resolve({ slug: "1" }) });
  let response = await request();
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(
    response.headers.get("location"),
    "https://ahmadfatayerji.com/english.pdf",
  );
  updateRoute("1", "French now", "/french.pdf");
  response = await request();
  assert.equal(
    response.headers.get("location"),
    "https://ahmadfatayerji.com/french.pdf",
  );
  setEnabled("1", false);
  assert.equal((await request()).status, 404);
  setEnabled("1", true);
  assert.equal((await request()).status, 302);
  assert.equal(
    (
      await GET(new Request(routeUrl("missing")), {
        params: Promise.resolve({ slug: "missing" }),
      })
    ).status,
    404,
  );
  assert.equal(getRoute("1")?.slug, "1");
});

test("passwords, missing configuration, session expiry, logout and rotation", () => {
  assert.ok(passwordConfigured());
  assert.ok(verifyPassword(password));
  assert.ok(!verifyPassword("incorrect"));
  assert.ok(!validSession(undefined));
  assert.ok(!validSession("forged"));
  const token = newSession();
  assert.ok(validSession(token));
  revokeSession(token);
  assert.ok(!validSession(token));
  const expired = newSession();
  db().prepare("UPDATE admin_sessions SET expires_at=0").run();
  assert.ok(!validSession(expired));
  const rotated = newSession();
  process.env.ADMIN_PASSWORD_HASH = hash.replace(
    salt,
    randomBytes(16).toString("hex"),
  );
  assert.ok(!validSession(rotated));
  delete process.env.ADMIN_PASSWORD_HASH;
  assert.ok(!passwordConfigured());
  assert.ok(!validSession(rotated));
  assert.ok(!verifyPassword(password));
  process.env.ADMIN_PASSWORD_HASH = hash;
});

test("login limit is persistent and expires after 15 minutes", () => {
  const now = Date.now();
  for (let i = 0; i < 10; i++) assert.ok(consumeLoginAttempt(now));
  assert.ok(!consumeLoginAttempt(now));
  assert.ok(consumeLoginAttempt(now + 15 * 60 * 1000));
});

test("origin validation rejects foreign and missing origins", () => {
  assert.doesNotThrow(() =>
    assertOrigin("https://ahmadfatayerji.com", "ahmadfatayerji.com"),
  );
  assert.throws(() =>
    assertOrigin("https://evil.example", "ahmadfatayerji.com"),
  );
  assert.throws(() => assertOrigin(null, "ahmadfatayerji.com"));
});

test("production accepts HTTPS www and apex origins while rejecting other origins", () => {
  const previousMode = process.env.NODE_ENV;
  const previousOrigin = process.env.SITE_ORIGIN;
  Object.assign(process.env, { NODE_ENV: "production" });
  try {
    for (const configured of ["https://ahmadfatayerji.com", "https://www.ahmadfatayerji.com"]) {
      process.env.SITE_ORIGIN = configured;
      for (const origin of ["https://ahmadfatayerji.com", "https://www.ahmadfatayerji.com"]) {
        assert.doesNotThrow(() => assertOrigin(origin, "127.0.0.1:3000"));
      }
      for (const origin of [null, "null", "invalid", "http://ahmadfatayerji.com", "http://www.ahmadfatayerji.com", "https://ahmadfatayerji.com:444", "https://evil.example", "https://admin.ahmadfatayerji.com", "https://ahmadfatayerji.com.evil.example", "https://www.www.ahmadfatayerji.com"]) {
        assert.throws(() => assertOrigin(origin, "ahmadfatayerji.com"), /Invalid request origin/);
      }
    }
  } finally {
    if (previousMode === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
    else Object.assign(process.env, { NODE_ENV: previousMode });
    process.env.SITE_ORIGIN = previousOrigin;
  }
});

test("PNG decodes to the permanent route URL and SVG has a quiet zone", async () => {
  const url = routeUrl("cv-fr");
  const png = PNG.sync.read(
    await QRCode.toBuffer(url, {
      width: 1024,
      margin: 4,
      errorCorrectionLevel: "M",
    }),
  );
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.equal(decoded?.data, "https://ahmadfatayerji.com/qr/cv-fr/");
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 4,
    errorCorrectionLevel: "M",
  });
  assert.match(svg, /<svg/);
  assert.match(svg, /stroke="#000000"/);
});

test("new process reads persistent mappings and backup restores correctly", async () => {
  const probe = spawnSync(
    process.execPath,
    [
      "-e",
      'const D=require("better-sqlite3"); const d=new D(process.argv[1]); process.stdout.write(d.prepare("SELECT destination FROM qr_routes WHERE slug=?").get("1").destination); d.close();',
      path.join(directory, "qr.sqlite"),
    ],
    { encoding: "utf8" },
  );
  assert.equal(probe.status, 0, probe.stderr);
  assert.equal(probe.stdout, "/french.pdf");
  const backup = path.join(directory, "backup.sqlite");
  const result = spawnSync(process.execPath, ["ops/qr-backup.mjs", backup], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const restored = spawnSync(
    process.execPath,
    [
      "-e",
      'const D=require("better-sqlite3"); const d=new D(process.argv[1]); process.stdout.write(d.prepare("PRAGMA integrity_check").get().integrity_check); d.close();',
      backup,
    ],
    { encoding: "utf8" },
  );
  assert.equal(restored.stdout, "ok");
});

test("storage failures return a safe uncached 503", async () => {
  db().close();
  const response = await GET(new Request(routeUrl("1")), {
    params: Promise.resolve({ slug: "1" }),
  });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.text();
  assert.match(body, /temporarily unavailable/);
  assert.ok(!body.includes(directory));
  assert.ok(!body.includes("database"));
});
