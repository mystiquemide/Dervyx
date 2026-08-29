"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SERVICES = [
  {
    id: "application",
    name: "Application",
    detail: "The Dervyx interface is available and responding normally.",
  },
  {
    id: "investigations",
    name: "Investigations",
    detail: "New investigation scopes and saved examples are available.",
  },
  {
    id: "evidence",
    name: "Evidence processing",
    detail: "Evidence reviews are accepting work. Live reviews can take a few minutes.",
  },
  {
    id: "certificates",
    name: "Certificates",
    detail: "Certificates, receipts, and hash verification are available.",
  },
] as const;

type HealthState = "checking" | "operational" | "attention";

export function StatusPageClient() {
  const [health, setHealth] = useState<HealthState>("checking");
  const [openId, setOpenId] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/health", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ status?: string }>)
      .then((payload) => {
        if (active) setHealth(payload.status === "ready" ? "operational" : "attention");
      })
      .catch(() => {
        if (active) setHealth("attention");
      })
      .finally(() => {
        if (active) setLastChecked(Date.now());
      });

    return () => {
      active = false;
    };
  }, []);

  const operational = health === "operational";
  const attention = health === "attention";
  const summary = operational
    ? "All systems operational"
    : attention
      ? "Some services need attention"
      : "Checking current availability";
  const description = operational
    ? "No known issues are affecting the service."
    : attention
      ? "We are reviewing the service state. Please try again shortly."
      : "We are checking the service state now.";
  const checkedLabel = lastChecked
    ? new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(lastChecked)
    : "checking now";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-6 border-b border-edge/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-3 text-[clamp(2rem,6vw,3.2rem)] font-semibold tracking-tight text-cream">System status</h1>
        </div>
        <Link
          href="/investigate"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-teal px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-teal-deep sm:w-auto"
        >
          Run an investigation
        </Link>
      </header>

      <section
        className={`mt-8 overflow-hidden rounded-xl border ${attention ? "border-caution/60" : "border-teal/60"}`}
        aria-live="polite"
      >
        <div className={`flex items-center gap-3 px-5 py-6 sm:px-8 sm:py-7 ${attention ? "bg-caution/10" : "bg-teal/10"}`}>
          <StatusDot attention={attention} />
          <h2 className="text-xl font-semibold tracking-tight text-cream sm:text-2xl">{summary}</h2>
        </div>
        <p className="px-5 py-6 text-[15px] leading-relaxed text-muted sm:px-8 sm:py-7">{description}</p>
        <p className="border-t border-edge/50 px-5 py-3 text-xs text-faint sm:px-8">Last checked: {checkedLabel}</p>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-edge bg-surface">
        <div className="border-b border-edge/70 px-5 py-5 sm:px-8 sm:py-6">
          <h2 className="text-xl font-semibold tracking-tight text-cream sm:text-2xl">Service availability</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Current availability across the Dervyx service.</p>
        </div>
        <div>
          {SERVICES.map((service, index) => {
            const expanded = openId === service.id;
            return (
              <div key={service.id} className={index === 0 ? "" : "border-t border-edge/60"}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${service.id}-detail`}
                  onClick={() => setOpenId(expanded ? null : service.id)}
                  className="flex min-h-20 w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-ink/40 sm:px-8"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <StatusDot attention={attention && service.id === "application"} small />
                    <span className="truncate text-[15px] font-medium text-cream sm:text-base">{service.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm text-muted">
                    <span>{attention && service.id === "application" ? "Reviewing" : "Operational"}</span>
                    <ChevronDown expanded={expanded} />
                  </span>
                </button>
                {expanded ? (
                  <p id={`${service.id}-detail`} className="border-t border-edge/50 px-5 pb-5 pt-4 text-sm leading-relaxed text-muted sm:px-8">
                    {service.detail}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-6 text-xs leading-relaxed text-faint">Availability reflects the latest application check. Individual reviews may vary by scope.</p>
    </div>
  );
}

function StatusDot({ attention, small = false }: { attention: boolean; small?: boolean }) {
  return (
    <span className={`relative inline-flex shrink-0 ${small ? "h-3 w-3" : "h-8 w-8"}`} aria-hidden="true">
      <span className={`absolute inline-flex h-full w-full rounded-full ${attention ? "bg-caution/20" : "bg-teal/20"}`} />
      <span className={`relative m-auto inline-flex rounded-full ${small ? "h-2 w-2" : "h-5 w-5"} ${attention ? "bg-caution" : "bg-teal"}`} />
    </span>
  );
}

function ChevronDown({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
