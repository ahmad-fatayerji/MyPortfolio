import { test, expect } from "@playwright/test";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { readFile } from "node:fs/promises";

test("admin manages permanent QR routes on desktop and mobile", async ({
  page,
  request,
}) => {
  await page.goto("/admin/");
  await expect(
    page.getByRole("heading", { name: "QR link admin" }),
  ).toBeVisible();
  await page.getByLabel("Admin password").fill("wrong");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByText("Incorrect password.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Admin password").fill("qr-admin-browser-test-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your QR links" }),
  ).toBeVisible();
  const cookies = await page.context().cookies();
  const session = cookies.find((cookie) => cookie.name === "__Host-qr-admin");
  expect(session?.httpOnly).toBe(true);
  expect(session?.secure).toBe(true);
  expect(session?.sameSite).toBe("Strict");
  await page.getByLabel("Label (optional)", { exact: true }).fill("English CV");
  await page
    .getByLabel("Destination link", { exact: true })
    .fill("/english.pdf");
  await page.getByRole("button", { name: "Create QR route" }).click();
  const card = page
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", { name: "English CV", exact: true }),
    });
  await expect(card).toBeVisible();
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await card.getByRole("button", { name: "Copy link" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "http://localhost:3107/qr/1/",
  );
  const first = await request.get("/qr/1/", { maxRedirects: 0 });
  expect(first.status()).toBe(302);
  expect(first.headers()["cache-control"]).toBe("no-store");
  expect(first.headers().location).toBe("http://localhost:3107/english.pdf");

  await card.getByRole("button", { name: "Edit", exact: true }).click();
  await card.getByLabel("Destination link").fill("/french.pdf");
  const saveRequest = page.waitForRequest(
    (req) => req.method() === "POST" && req.url().includes("/admin"),
  );
  await card.getByRole("button", { name: "Save destination" }).click();
  const captured = await saveRequest;
  await expect(
    card.getByText("Changes saved.", { exact: false }),
  ).toBeVisible();
  expect(
    (await request.get("/qr/1/", { maxRedirects: 0 })).headers().location,
  ).toBe("http://localhost:3107/french.pdf");
  await card.getByRole("button", { name: "Close editor" }).click();

  await card.getByRole("button", { name: "Disable", exact: true }).click();
  await expect(card.getByText("Disabled", { exact: true })).toBeVisible();
  expect((await request.get("/qr/1/")).status()).toBe(404);
  await card.getByRole("button", { name: "Enable", exact: true }).click();
  await expect(card.getByText("Active", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "QR image" }).click();
  await expect(card.getByRole("img")).toBeVisible();
  const pngDownload = page.waitForEvent("download");
  await card.getByRole("link", { name: "PNG", exact: true }).click();
  const png = PNG.sync.read(
    await readFile((await (await pngDownload).path())!),
  );
  expect(
    jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data,
  ).toBe("http://localhost:3107/qr/1/");
  const svgDownload = page.waitForEvent("download");
  await card.getByRole("link", { name: "SVG", exact: true }).click();
  const svg = await readFile((await (await svgDownload).path())!);
  const svgPage = await page.context().newPage();
  await svgPage.setContent(`<img alt="Downloaded QR" width="400" height="400" src="data:image/svg+xml;base64,${svg.toString("base64")}">`);
  const rasterized = PNG.sync.read(await svgPage.getByRole("img").screenshot());
  expect(jsQR(new Uint8ClampedArray(rasterized.data), rasterized.width, rasterized.height)?.data).toBe("http://localhost:3107/qr/1/");
  await svgPage.close();

  await page.getByLabel("Route name (optional)").fill("cv-fr");
  await page
    .getByLabel("Destination link", { exact: true })
    .fill("https://example.com/french");
  await page.getByRole("button", { name: "Create QR route" }).click();
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.getByLabel("Route name (optional)").fill("cv-fr");
  await page
    .getByLabel("Destination link", { exact: true })
    .fill("https://example.com/duplicate");
  await page.getByRole("button", { name: "Create QR route" }).click();
  await expect(
    page.getByText("That route name already exists. Choose another name.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Route name (optional)")).toHaveValue("cv-fr");
  await expect(
    page.getByLabel("Destination link", { exact: true }),
  ).toHaveValue("https://example.com/duplicate");
  await page.getByLabel("Route name (optional)").fill("loop");
  await page.getByLabel("Destination link", { exact: true }).fill("/qr/1");
  await page.getByRole("button", { name: "Create QR route" }).click();
  await expect(
    page.getByText(
      "Choose a destination outside /qr to avoid redirect loops.",
      { exact: true },
    ),
  ).toBeVisible();

  // Replay an actual mutation with a foreign origin and a different destination.
  const body = captured.postData()!.replace("/french.pdf", "/blocked.pdf");
  const mutationHeaders = {
    "content-type": captured.headers()["content-type"],
    "next-action": captured.headers()["next-action"],
  };
  await page.request.post("/admin/", {
    headers: { ...mutationHeaders, origin: "https://evil.example" },
    data: body,
  });
  expect(
    (await request.get("/qr/1/", { maxRedirects: 0 })).headers().location,
  ).toBe("http://localhost:3107/french.pdf");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Create QR route" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "test-results/qr-admin-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "test-results/qr-admin-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "QR link admin" }),
  ).toBeVisible();
  const rejected = await request.post("/admin/", {
    headers: { ...mutationHeaders, origin: "http://localhost:3107" },
    data: body,
  });
  expect(await rejected.text()).toContain("session expired");
  const revoked = await request.post("/admin/", {
    headers: {
      ...mutationHeaders,
      origin: "http://localhost:3107",
      cookie: `__Host-qr-admin=${session!.value}`,
    },
    data: body,
  });
  expect(await revoked.text()).toContain("session expired");
  expect(
    (await request.get("/qr/1/", { maxRedirects: 0 })).headers().location,
  ).toBe("http://localhost:3107/french.pdf");
  await page.getByLabel("Admin password").focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: "test-results/qr-admin-login.png",
    fullPage: true,
  });
});
