# Page metadata and crawl discovery

Public metadata uses the established production origin `https://ahmadfatayerji.com`.
Set `SITE_ORIGIN` to an HTTP/HTTPS origin when building for a different host, for
example `SITE_ORIGIN=http://localhost:3000` in `.env.local`. The same existing
variable controls QR URLs and request-origin validation. Paths and credentials
are not included in generated metadata URLs.

Set this variable **before `npm run build`**: public pages, robots, and sitemap
are generated at build time. Changing only the standalone server's environment
will not rewrite these static outputs. The current deployment build uses the
production default; its runtime `SITE_ORIGIN` also serves QR administration.
Local checks may leave the variable unset to verify production canonical URLs.

`src/lib/metadata.ts` defines the four public pages, their titles/descriptions,
and canonical URLs. Canonicals retain the configured trailing slash. Server
route layouts supply metadata around existing animated client pages; the home
page uses a server wrapper. Social image fields are reserved for Next.js
`opengraph-image` / `twitter-image` file conventions.

`/sitemap.xml` lists only `/`, `/about/`, `/projects/`, and `/contact/`. It does not
claim fabricated modification dates. `/admin/` and `/testing/` provide
`noindex, nofollow` metadata and explicitly clear inherited social images.
Robots permits these pages to be crawled so search engines can read their
noindex tags; robots disallow alone would not guarantee removal from an index.
`/qr/` and `/api/` are excluded from crawling. QR responses already include
`X-Robots-Tag: noindex`. These directives do not replace administrator
authentication.

To verify a build, fetch each public route and check its `title`, description,
canonical, Open Graph title/description/URL, and Twitter card. Fetch both private
pages and check `noindex, nofollow`, then check the two discovery endpoints.
