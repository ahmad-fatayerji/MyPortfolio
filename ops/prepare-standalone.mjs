import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  throw new Error(
    "Standalone output was not generated. Ensure next.config.ts uses output: \"standalone\".",
  );
}

const assets = [
  [join(root, "public"), join(standalone, "public")],
  [join(root, ".next", "static"), join(standalone, ".next", "static")],
];

for (const [source, destination] of assets) {
  if (!existsSync(source)) {
    continue;
  }

  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
}
