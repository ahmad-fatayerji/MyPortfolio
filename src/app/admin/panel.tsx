"use client";

import { useActionState, useEffect, useId, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  LockKeyhole,
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

const input =
  "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
const primary = `${button} border-primary bg-primary text-primary-foreground hover:bg-primary/90`;
function Feedback({ state }: { state: ActionState }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-primary">{state.success}</p>
      )}
    </div>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <section className="mx-auto mt-8 max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LockKeyhole aria-hidden size={24} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Private workspace
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        QR link admin
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sign in to manage where your printed QR codes take people.
      </p>
      <form action={action} className="mt-7">
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
    <form action={action}>
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
          <div className="mt-2 flex items-center rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring">
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
              aria-describedby="slug-help"
            />
          </div>
          <p id="slug-help" className="mt-2 text-xs text-muted-foreground">
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
          autoCapitalize="none"
          spellCheck={false}
        />
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
    <div className="mt-5 rounded-xl border bg-background p-4">
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
            className="mx-auto my-4 h-auto max-w-full rounded-lg"
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
    <article className="min-w-0 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="break-all text-lg font-semibold">
          {route.label || `/qr/${route.slug}`}
        </h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${route.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
        >
          {route.enabled ? "Active" : "Disabled"}
        </span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block break-all text-sm text-primary underline-offset-4 hover:underline"
      >
        {url}
        <ArrowUpRight size={14} className="ml-1 inline" aria-hidden />
      </a>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Opens
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
          onClick={() => setPreview(!preview)}
        >
          <QrCode size={16} aria-hidden />
          {preview ? "Hide QR" : "QR image"}
        </button>
        <button
          className={button}
          aria-expanded={editing}
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
      <div aria-live="polite">
        {copyError && (
          <p className="mt-3 text-sm text-destructive">{copyError}</p>
        )}
      </div>
      <Feedback state={state} />
      {editing && (
        <div className="mt-5 border-t pt-5">
          <RouteForm route={route} />
        </div>
      )}
      {preview && <QrPreview url={url} slug={route.slug} />}
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
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Private workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your QR links
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Print once. Change the destination whenever you need.
          </p>
        </div>
        <form action={logout}>
          <button className={button}>Sign out</button>
        </form>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Plus size={20} className="text-primary" aria-hidden />
            <h2 className="text-lg font-semibold">New QR route</h2>
          </div>
          <RouteForm suggestedSlug={suggestedSlug} />
        </section>
        <section className="min-w-0" aria-label="Saved QR routes">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Saved routes</h2>
            <span className="text-sm text-muted-foreground">
              {routes.length} total
            </span>
          </div>
          <div className="space-y-4">
            {routes.length ? (
              routes.map((route) => (
                <RouteCard key={route.slug} route={route} origin={origin} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <QrCode
                  size={36}
                  className="mx-auto text-primary"
                  aria-hidden
                />
                <h3 className="mt-4 font-semibold">
                  Your first QR link starts here
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Paste a destination to create a link you can print and keep.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
