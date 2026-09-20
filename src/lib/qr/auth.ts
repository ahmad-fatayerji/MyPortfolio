import "server-only";
import { cookies, headers } from "next/headers";
import { validSession } from "./security";
import { assertOrigin, QrInputError } from "./validation";

export const cookieName =
  process.env.NODE_ENV === "production" ? "__Host-qr-admin" : "qr-admin";
export async function authenticated() {
  return validSession((await cookies()).get(cookieName)?.value);
}
export async function checkOrigin() {
  const requestHeaders = await headers();
  assertOrigin(requestHeaders.get("origin"), requestHeaders.get("host"));
}
export async function requireAdmin() {
  await checkOrigin();
  if (!(await authenticated()))
    throw new QrInputError(
      "Your session expired. Refresh the page and sign in again.",
    );
}
