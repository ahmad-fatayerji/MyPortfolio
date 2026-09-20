"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkOrigin, cookieName, requireAdmin } from "@/lib/qr/auth";
import {
  consumeLoginAttempt,
  newSession,
  passwordConfigured,
  revokeSession,
  SESSION_SECONDS,
  verifyPassword,
} from "@/lib/qr/security";
import { createRoute, setEnabled, updateRoute } from "@/lib/qr/store";
import { QrInputError } from "@/lib/qr/validation";

export type ActionState = { error?: string; success?: string; saved?: number };
const field = (form: FormData, key: string) => String(form.get(key) || "");
function message(error: unknown) {
  if (error instanceof QrInputError) return error.message;
  console.error("Admin operation failed", error);
  return "Unable to save right now. Please try again.";
}
export async function login(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    await checkOrigin();
    if (!passwordConfigured())
      return { error: "Admin access has not been configured." };
    if (!consumeLoginAttempt())
      return { error: "Too many attempts. Please try again in 15 minutes." };
    if (!verifyPassword(field(form, "password")))
      return { error: "Incorrect password." };
    (await cookies()).set(cookieName, newSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
  } catch (error) {
    return { error: message(error) };
  }
  redirect("/admin/");
}
export async function logout(): Promise<void> {
  await checkOrigin();
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) revokeSession(token);
  jar.delete(cookieName);
  redirect("/admin/");
}
export async function saveRoute(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const slug = field(form, "slug");
    if (field(form, "operation") === "update")
      updateRoute(slug, field(form, "label"), field(form, "destination"));
    else createRoute(slug, field(form, "label"), field(form, "destination"));
    revalidatePath("/admin");
    return {
      success:
        field(form, "operation") === "update"
          ? "Changes saved. Your QR link now uses this destination."
          : "QR route created.",
      saved: Date.now(),
    };
  } catch (error) {
    return { error: message(error) };
  }
}
export async function toggleRoute(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const enabled = field(form, "enabled") === "true";
    setEnabled(field(form, "slug"), enabled);
    revalidatePath("/admin");
    return {
      success: enabled
        ? "Route enabled."
        : "Route disabled. You can enable it again anytime.",
    };
  } catch (error) {
    return { error: message(error) };
  }
}
