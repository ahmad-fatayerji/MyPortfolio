import { randomBytes, scryptSync } from "node:crypto";

// Read via stdin instead of arguments or environment variables so passwords do
// not appear in shell history or process listings. Interactive input is hidden.
let password = "";
if (process.stdin.isTTY) {
  process.stderr.write("Admin password (at least 12 characters): ");
  process.stdin.setRawMode(true);
  process.stdin.setEncoding("utf8");
  password = await new Promise((resolve) => {
    process.stdin.on("data", (chunk) => {
      for (const character of chunk) {
        if (character === "\u0003") process.exit(130);
        if (character === "\r" || character === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stderr.write("\n");
          resolve(password);
          return;
        }
        if (character === "\u007f" || character === "\b")
          password = password.slice(0, -1);
        else password += character;
      }
    });
  });
} else {
  for await (const chunk of process.stdin) password += chunk.toString();
  password = password.replace(/\r?\n$/, "");
}
if (password.length < 12 || password.length > 1024) {
  process.stderr.write("Use a password between 12 and 1024 characters.\n");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
process.stdout.write(
  `ADMIN_PASSWORD_HASH=scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}\n`,
);
