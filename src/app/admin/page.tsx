import type { Metadata } from "next";
import { authenticated } from "@/lib/qr/auth";
import { passwordConfigured } from "@/lib/qr/security";
import { listRoutes, nextSlug } from "@/lib/qr/store";
import { siteOrigin } from "@/lib/qr/validation";
import { AdminDashboard, LoginForm } from "./panel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "QR admin | Ahmad FATAYERJI",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!passwordConfigured())
    return (
      <section className="mx-auto max-w-md rounded-2xl border bg-card p-8">
        <h1 className="text-2xl font-semibold">
          Admin access is not configured
        </h1>
        <p className="mt-3 text-muted-foreground">
          Set up the administrator password on the server to enable this panel.
        </p>
      </section>
    );
  let dashboard:
    | {
        routes: ReturnType<typeof listRoutes>;
        suggestedSlug: string;
        origin: string;
      }
    | undefined;
  try {
    if (await authenticated())
      dashboard = {
        routes: listRoutes(),
        suggestedSlug: nextSlug(),
        origin: siteOrigin(),
      };
  } catch (error) {
    console.error("Admin storage unavailable", error);
    return (
      <section role="alert" className="rounded-2xl border bg-card p-8">
        <h1 className="text-2xl font-semibold">
          Admin temporarily unavailable
        </h1>
        <p className="mt-3 text-muted-foreground">Please try again shortly.</p>
      </section>
    );
  }
  return dashboard ? <AdminDashboard {...dashboard} /> : <LoginForm />;
}
