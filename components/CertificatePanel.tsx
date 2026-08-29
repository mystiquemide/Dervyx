import type { ReactNode } from "react";
import type { BranchDecision, DervyxReport } from "@/lib/types";
import { CopyHashButton } from "./CopyHashButton";
import { pct, shortHash } from "@/lib/format";

const VERDICT: Record<string, { label: string; dot: string; text: string }> = {
  ANOMALY: { label: "Anomaly", dot: "bg-anomaly", text: "text-anomaly" },
  CLEAN: { label: "Clean", dot: "bg-teal", text: "text-teal" },
  UNKNOWN_ROOTS: { label: "Unknown roots", dot: "bg-muted", text: "text-cream" },
  INSUFFICIENT_DATA: { label: "Insufficient data", dot: "bg-muted", text: "text-cream" },
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-1 border-t border-edge/60 py-2.5 text-sm sm:grid-cols-[150px_1fr]">
      <dt className="text-faint">{label}</dt>
      <dd className="text-cream [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

export function CertificatePanel({
  report,
  reportHash,
  branch,
  actions,
  chip,
}: {
  report: DervyxReport;
  reportHash: string;
  branch?: BranchDecision | null;
  actions?: ReactNode;
  chip?: string;
}) {
  const verdict = VERDICT[report.verdict.label] ?? VERDICT.UNKNOWN_ROOTS;
  const m = report.metric;
  const c = report.coverage;
  const exclusion = report.knownRootExclusions[0];
  const modeLabel =
    report.identity.mode === "live"
      ? "Live RPC"
      : report.identity.mode === "cached"
        ? "Cached example"
        : "Recorded fixture";
  const modeClass = report.identity.mode === "live" ? "border-teal/30 text-teal" : "border-caution/30 text-caution";
  const sourceLabel = report.identity.mode === "live"
    ? report.sources.swapProviderMode === "configured" ? "configured provider" : "public fallback"
    : "offline evidence";

  return (
    <div className="rounded-lg border border-edge bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-faint">Anomaly certificate</p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-full ${verdict.dot}`} aria-hidden="true" />
            <span className={`text-lg font-semibold ${verdict.text}`}>{verdict.label}</span>
            <span className={`rounded border px-2 py-1 text-[10px] uppercase tracking-widest2 ${modeClass}`}>
              {modeLabel}
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-faint">{report.verdict.rationaleCode}</p>
          <p className="mt-1 text-xs text-faint">Source: {sourceLabel}</p>
        </div>
        {chip ? (
          <span className="shrink-0 rounded border border-edge px-2 py-1 text-[11px] uppercase tracking-widest2 text-faint">
            {chip}
          </span>
        ) : null}
      </div>

      <dl className="mt-5">
        {branch ? (
          <Row label="Branch">
            <span className="text-cream">{branch.branch}</span>{" "}
            <span className="text-faint">
              ({branch.mode}
              {branch.fallbackReason ? `, ${branch.fallbackReason}` : ""}, maxHops {branch.plan.maxHopsConsidered})
            </span>
          </Row>
        ) : null}
        <Row label="Observed share">
          <span className="font-mono text-cream">
            {m.numerator}/{m.denominator}
          </span>{" "}
          swap events{" "}
          <span className={verdict.text}>({m.ratioPercent})</span> via shared unknown roots
        </Row>
        <Row label="Attribution ledger">
          <div className="space-y-2.5">
            {report.attributionLedger
              .filter((entry) => entry.swapEvents > 0)
              .map((entry) => (
                <div key={entry.bucket} className="grid grid-cols-[1fr_auto] gap-3 text-xs">
                  <div>
                    <p className="text-cream">{entry.label}</p>
                    <p className="mt-0.5 leading-relaxed text-faint">{entry.description}</p>
                  </div>
                  <span className={`whitespace-nowrap font-mono ${entry.countsTowardAnomalyShare ? "text-anomaly" : "text-muted"}`}>
                    {entry.swapEvents}/{m.denominator} · {entry.ratioPercent}
                  </span>
                </div>
              ))}
            <p className="border-t border-edge/60 pt-2 text-xs leading-relaxed text-faint">
              Counterfactual: {m.attributedSwapEvents}/{m.denominator} events had any accepted funding path before root policy; {m.numerator}/{m.denominator} remain in the anomaly share after exclusions and cluster rules.
            </p>
          </div>
        </Row>
        <Row label="Coverage">
          <span className="font-mono">{pct(c.attributionCoverageBps)}</span> attributed ({c.tradersAttributed}/
          {c.originsTotal} origins), funding <span className="text-cream">{c.fundingStatus}</span>
        </Row>
        <Row label="Clusters">
          {report.coordinationClusters.length} coordination, {report.knownRootExclusions.length} known-root exclusion
          {report.knownRootExclusions.length === 1 ? "" : "s"}
          {exclusion ? <span className="text-faint"> ({exclusion.class} separated)</span> : null}
        </Row>
        <Row label="Report hash">
          <div className="min-w-0">
            <p className="break-all font-mono text-teal" title={reportHash}>{shortHash(reportHash, 40)}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-muted hover:text-cream">Show full hash</summary>
              <code className="mt-2 block break-all font-mono text-[11px] leading-relaxed text-faint">{reportHash}</code>
            </details>
            <div className="mt-2">
              <CopyHashButton value={reportHash} />
            </div>
          </div>
        </Row>
      </dl>

      <p className="mt-4 border-t border-edge/60 pt-4 text-xs leading-relaxed text-faint">
        {report.limitations[0]}
      </p>

      {actions ? <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
