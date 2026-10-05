"use client";

import { useActionState, useEffect, useId, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Plus,
  QrCode,
  X,
} from "lucide-react";
import type { QrRoute } from "@/lib/qr/store";
import {
  login,
  logout,
  saveRoute,
  toggleRoute,
  type ActionState,
} from "./actions";
import styles from "./admin.module.css";

const input =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-50";
const primary = `${button} border-foreground bg-foreground text-background hover:bg-foreground/90`;
function Feedback({ state }: { state: ActionState }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className={`mt-3 text-sm ${styles.success}`}>{state.success}</p>
      )}
    </div>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <section className={`${styles.workspace} mx-auto mt-8 max-w-md rounded-md border bg-card p-6 sm:p-8`}>
      <p className="text-xs font-medium text-muted-foreground">
        Administration / QR routes
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        QR link admin
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sign in to manage where your printed QR codes take people.
      </p>
      <form action={action} className="mt-6 border-t pt-6" aria-busy={pending}>
        <label className="text-sm font-medium" htmlFor="password">
          Admin password
        </label>
        <input
          className={input}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={1024}
        />
        <button className={`${primary} mt-5 w-full`} disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <Feedback state={state} />
      </form>
    </section>
  );
}

function RouteForm({
  route,
  suggestedSlug,
}: {
  route?: QrRoute;
  suggestedSlug?: string;
}) {
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState(route?.label || "");
  const [destination, setDestination] = useState(route?.destination || "");
  const [state, action, pending] = useActionState(
    async (previous: ActionState, form: FormData) => {
      const result = await saveRoute(previous, form);
      if (result.saved && !route) {
        setSlug("");
        setLabel("");
        setDestination("");
      }
      return result;
    },
    {},
  );
  const suffix = useId();
  return (
    <form action={action} aria-busy={pending}>
      <input
        type="hidden"
        name="operation"
        value={route ? "update" : "create"}
      />
      {route ? (
        <input type="hidden" name="slug" value={route.slug} />
      ) : (
        <div className="mb-4">
          <label htmlFor={`slug-${suffix}`} className="text-sm font-medium">
            Route name{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <div className="mt-2 flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
            <span className="pl-3 text-sm text-muted-foreground">/qr/</span>
            <input
              id={`slug-${suffix}`}
              name="slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder={suggestedSlug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxLength={80}
              className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
              aria-describedby={`slug-help-${suffix}`}
            />
          </div>
          <p id={`slug-help-${suffix}`} className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Leave blank for an automatic number, or use a name like cv-fr. Fixed
            after creation.
          </p>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor={`label-${suffix}`} className="text-sm font-medium">
          Label{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id={`label-${suffix}`}
          className={input}
          name="label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          maxLength={120}
          placeholder="French CV · career fair"
        />
      </div>
      <div>
        <label
          htmlFor={`destination-${suffix}`}
          className="text-sm font-medium"
        >
          Destination link
        </label>
        <input
          id={`destination-${suffix}`}
          className={input}
          name="destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          required
          maxLength={4096}
          placeholder="https://… or /Ahmad_FATAYERJI_CV.pdf"
          aria-describedby={`destination-help-${suffix}`}
          autoCapitalize="none"
          spellCheck={false}
        />
        <p id={`destination-help-${suffix}`} className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Use an https:// address or a file path on this site. Updating the destination keeps the printed QR code working.
        </p>
      </div>
      <button className={`${primary} mt-5`} disabled={pending}>
        {!route && <Plus size={16} aria-hidden />}
        {pending ? "Saving…" : route ? "Save destination" : "Create QR route"}
      </button>
      <Feedback state={state} />
    </form>
  );
}

function QrPreview({ url, slug }: { url: string; slug: string }) {
  const [png, setPng] = useState("");
  const [svgUrl, setSvgUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let disposed = false;
    let objectUrl = "";
    import("qrcode")
      .then(async (QRCode) => {
        const options = {
          margin: 4,
          errorCorrectionLevel: "M" as const,
          width: 1024,
        };
        const [data, svg] = await Promise.all([
          QRCode.toDataURL(url, options),
          QRCode.toString(url, { ...options, type: "svg" }),
        ]);
        if (disposed) return;
        objectUrl = URL.createObjectURL(
          new Blob([svg], { type: "image/svg+xml" }),
        );
        setPng(data);
        setSvgUrl(objectUrl);
      })
      .catch(() => {
        if (!disposed)
          setError(
            "Could not generate the QR image. Close and reopen to try again.",
          );
      });
    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);
  return (
    <div className="mt-5 rounded-md border bg-background p-4">
      <p className="text-sm font-medium">Ready to print</p>
      <p className="mt-1 text-xs text-muted-foreground">
        The image always points to your permanent QR link.
      </p>
      {png ? (
        <>
          {/* A data URL generated locally; no remote image request. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={png}
            alt={`QR code for ${url}`}
            width={224}
            height={224}
            className="mx-auto my-4 h-auto max-w-full"
          />
          <div className="flex flex-wrap justify-center gap-2">
            <a href={png} download={`qr-${slug}.png`} className={button}>
              <Download size={16} aria-hidden />
              PNG
            </a>
            <a href={svgUrl} download={`qr-${slug}.svg`} className={button}>
              <Download size={16} aria-hidden />
              SVG
            </a>
          </div>
        </>
      ) : (
        <p role="status" className="mt-4 text-sm">
          {error || "Generating QR image…"}
        </p>
      )}
    </div>
  );
}

function RouteCard({ route, origin }: { route: QrRoute; origin: string }) {
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [state, action, pending] = useActionState(toggleRoute, {});
  const suffix = useId();
  const url = `${origin}/qr/${route.slug}/`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyError("");
    } catch {
      setCopyError("Copy unavailable. Select and copy the link above.");
    }
  }
  return (
    <article className="min-w-0 bg-card p-5 sm:p-6" aria-label={route.label || `/qr/${route.slug}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="break-all text-base font-semibold">
          {route.label || `/qr/${route.slug}`}
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium ${route.enabled ? styles.active : "bg-muted text-muted-foreground"}`}
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
          {route.enabled ? "Active" : "Disabled"}
        </span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block break-all font-mono text-xs underline underline-offset-4 decoration-border hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {url}
        <ArrowUpRight size={14} className="ml-1 inline" aria-hidden />
      </a>
      <p className="mt-4 text-xs font-medium text-muted-foreground">
        Destination
      </p>
      <p className="mt-1 break-all text-sm">{route.destination}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button className={button} onClick={copy}>
          {copied ? (
            <Check size={16} aria-hidden />
          ) : (
            <Copy size={16} aria-hidden />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          className={button}
          aria-expanded={preview}
          aria-controls={`preview-${suffix}`}
          onClick={() => setPreview(!preview)}
        >
          <QrCode size={16} aria-hidden />
          {preview ? "Hide QR" : "QR image"}
        </button>
        <button
          className={button}
          aria-expanded={editing}
          aria-controls={`editor-${suffix}`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? (
            <>
              <X size={16} aria-hidden />
              Close editor
            </>
          ) : (
            "Edit"
          )}
        </button>
        <form action={action}>
          <input type="hidden" name="slug" value={route.slug} />
          <input type="hidden" name="enabled" value={String(!route.enabled)} />
          <button className={button} disabled={pending}>
            {pending ? "Updating…" : route.enabled ? "Disable" : "Enable"}
          </button>
        </form>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {copied && <p className="sr-only">QR link copied to clipboard.</p>}
        {copyError && (
          <p className="mt-3 text-sm text-destructive">{copyError}</p>
        )}
      </div>
      <Feedback state={state} />
      {editing && (
        <div id={`editor-${suffix}`} className="mt-5 border-t pt-5">
          <h4 className="mb-4 text-sm font-semibold">Edit route /qr/{route.slug}</h4>
          <RouteForm route={route} />
        </div>
      )}
      {preview && <div id={`preview-${suffix}`}><QrPreview url={url} slug={route.slug} /></div>}
    </article>
  );
}

export function AdminDashboard({
  routes,
  suggestedSlug,
  origin,
}: {
  routes: QrRoute[];
  suggestedSlug: string;
  origin: string;
}) {
  return (
    <div className={`${styles.workspace} rounded-md border bg-card`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Administration / QR routes
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Your QR links
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Manage permanent links and their destinations.
          </p>
        </div>
        <form action={logout}>
          <button className={button}>Sign out</button>
        </form>
      </div>
      <div className="grid items-start lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="border-b bg-background/50 p-5 sm:p-6 lg:border-b-0" aria-labelledby="new-route-heading">
          <div className="mb-5">
            <h2 id="new-route-heading" className="text-sm font-semibold">New QR route</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Create a permanent link, then download its QR code.</p>
          </div>
          <RouteForm suggestedSlug={suggestedSlug} />
        </section>
        <section className="min-w-0 lg:border-l" aria-label="Saved QR routes">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold">Saved routes</h2>
            <span className="text-xs text-muted-foreground">
              {routes.length} total · {routes.filter((route) => route.enabled).length} active
            </span>
          </div>
          <div className="divide-y">
            {routes.length ? (
              routes.map((route) => (
                <RouteCard key={route.slug} route={route} origin={origin} />
              ))
            ) : (
              <div className="px-5 py-10 sm:px-6">
                <h3 className="text-sm font-semibold">
                  No routes yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a destination in New QR route to create your first permanent link.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
