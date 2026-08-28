import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status \u00b7 Dervyx",
  description:
    "Operational status for Dervyx: a read-only Base scope engine. No wallet, no transactions, no signing.",
};

const CHECKS: { label: string; value: string; ok: boolean }[] = [
  { label: "Service", value: "Ready", ok: true },
  { label: "Chain", value: "Base mainnet (8453)", ok: true },
  { label: "Mode", value: "Read-only scope", ok: true },
  { label: "Wallet / signing", value: "Not requested, ever", ok: true },
  { label: "RPC provider", value: "Public Base fallback, labeled as such", ok: true },
];

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-xs uppercase tracking-widest2 text-teal">Status</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-teal/60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-teal" />
        </span>
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] font-semibold tracking-tight text-cream">
          All systems operational
        </h1>
      </div>
      <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
        Dervyx is a read-only tool. It reads public Base data for one token and one block window and
        issues a certificate you can re-verify by hash. It never connects a wallet, sends a transaction,
        or asks you to sign anything.
      </p>

      <dl className="mt-10 overflow-hidden rounded-lg border border-edge bg-surface">
        {CHECKS.map((check, i) => (
          <div
            key={check.label}
            className={`flex items-center justify-between gap-4 px-5 py-4 ${i === 0 ? "" : "border-t border-edge/60"}`}
          >
            <dt className="text-sm text-muted">{check.label}</dt>
            <dd className="flex items-center gap-2.5 text-sm text-cream">
              <span className={`h-2 w-2 rounded-full ${check.ok ? "bg-teal" : "bg-danger"}`} aria-hidden="true" />
              {check.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm leading-relaxed text-faint">
        Machine-readable health is available at{" "}
        <a href="/api/health" className="font-mono text-teal hover:underline">
          /api/health
        </a>
        . The numbers and verdict in every certificate are produced by a deterministic engine, not this
        page.
      </p>
    </div>
  );
}
