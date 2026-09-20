export class QrInputError extends Error {}

const normalizedHost = (hostname: string) => hostname.replace(/\.$/, "").replace(/^www\./, "");

export function siteOrigin() {
  const url = new URL(process.env.SITE_ORIGIN || "https://ahmadfatayerji.com");
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("Invalid SITE_ORIGIN");
  return url.origin;
}

export function validateSlug(value: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 80) {
    throw new QrInputError(
      "Use up to 80 lowercase letters, numbers, and single hyphens.",
    );
  }
  return value;
}

export function validateDestination(value: string) {
  const input = value.trim();
  if (
    !input ||
    input.length > 4096 ||
    /[\s\\\u0000-\u001f\u007f]/.test(input) ||
    input.startsWith("//")
  )
    throw new QrInputError(
      "Enter a valid HTTP/HTTPS URL or a site-relative path.",
    );
  if (!input.startsWith("/") && !/^https?:\/\//i.test(input))
    throw new QrInputError(
      "Enter a valid HTTP/HTTPS URL or a site-relative path.",
    );
  let url: URL;
  try {
    url = new URL(input, siteOrigin());
  } catch {
    throw new QrInputError("Enter a valid destination URL.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new QrInputError(
      "Use HTTP/HTTPS links without embedded credentials.",
    );
  let path: string;
  try {
    path = decodeURIComponent(url.pathname).toLowerCase();
  } catch {
    throw new QrInputError("Enter a valid destination URL.");
  }
  const ownHosts = new Set([
    normalizedHost(new URL(siteOrigin()).hostname),
    "ahmadfatayerji.com",
  ]);
  if (
    ownHosts.has(normalizedHost(url.hostname)) &&
    /^\/qr(?:\/|$)/.test(path)
  )
    throw new QrInputError(
      "Choose a destination outside /qr to avoid redirect loops.",
    );
  return input.startsWith("/")
    ? `${url.pathname}${url.search}${url.hash}`
    : url.href;
}

export function routeUrl(slug: string) {
  return `${siteOrigin()}/qr/${validateSlug(slug)}/`;
}

export function assertOrigin(origin: string | null, host: string | null) {
  if (!origin) throw new QrInputError("Invalid request origin.");
  let allowed = false;
  if (process.env.NODE_ENV === "production") {
    const canonical = new URL(siteOrigin());
    const trustedOrigins = new Set([canonical.origin]);
    // Both public HTTPS hostnames serve this site. Keep protocol and port exact;
    // do not trust arbitrary subdomains or derive trust from proxy headers.
    if (canonical.protocol === "https:") {
      canonical.hostname = canonical.hostname.startsWith("www.")
        ? canonical.hostname.slice(4)
        : `www.${canonical.hostname}`;
      trustedOrigins.add(canonical.origin);
    }
    allowed = trustedOrigins.has(origin);
  } else {
    try {
      allowed = new URL(origin).host === host;
    } catch {
      // Malformed or opaque origins fail with the same safe validation message.
    }
  }
  if (!allowed) throw new QrInputError("Invalid request origin.");
}
