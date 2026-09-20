import { getRoute } from "@/lib/qr/store";
import { siteOrigin } from "@/lib/qr/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function unavailable(status: number) {
  const message =
    status === 404
      ? "This QR link is unavailable."
      : "This QR link is temporarily unavailable. Please try again shortly.";
  return new Response(
    `<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>QR link unavailable</title><body style="font-family:system-ui;max-width:36rem;margin:15vh auto;padding:24px"><h1>${message}</h1><p><a href="/">Visit Ahmad’s portfolio</a></p></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const route = getRoute(slug);
    if (!route?.enabled) return unavailable(404);
    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(route.destination, siteOrigin()).href,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("QR lookup failed", error);
    return unavailable(503);
  }
}
