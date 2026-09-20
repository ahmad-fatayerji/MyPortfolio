import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3107",
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/serve-qr.mjs",
    url: "http://localhost:3107/admin/",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
