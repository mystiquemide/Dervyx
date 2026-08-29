"use client";

import { useCallback, useEffect, useState } from "react";
import { CertificatePanel } from "@/components/CertificatePanel";
import type { ScopeRecord } from "@/lib/types";

type ExampleId = "anomaly" | "control";

type Status = { message: string; kind: "idle" | "working" | "success" | "error" };
type Replay = { state: "idle" | "checking" | "ok" | "mismatch" | "error"; text: string };
type RunMode = "live" | "cached";

const DEFAULTS = {
  token: "",
  startBlock: "",
  endBlock: "",
  mode: "live" as RunMode,
  configVersion: "phase1-scope-v1",
  idempotencyKey: "",
};

function createIdempotencyKey(): string {
  const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `ui-${randomId}`;
}

const EXAMPLE_SCOPE = {
  token: "0xB2000000000000000000000Ff4a547c891AB1b01",
  startBlock: 50121395,
  endBlock: 50123000,
};

// The stages of a live review. The elapsed timer is the real progress signal.
const LIVE_STEPS = [
  "Collecting activity in the selected window",
  "Following the trail behind each wallet",
  "Separating known infrastructure",
  "Measuring linked activity",
  "Sealing the certificate",
];

function txUrl(hash: string): string {
  return `https://basescan.org/tx/${hash}`;
}

function mmss(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function InvestigateClient() {
  const [form, setForm] = useState(() => ({ ...DEFAULTS, idempotencyKey: createIdempotencyKey() }));
  const [record, setRecord] = useState<ScopeRecord | null>(null);
  const [status, setStatus] = useState<Status>({ message: "", kind: "idle" });
  const [busy, setBusy] = useState(false);
  const [runMode, setRunMode] = useState<RunMode>("live");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [replay, setReplay] = useState<Replay>({ state: "idle", text: "" });

  useEffect(() => {
    if (!busy) return;
    const started = Date.now();
    const id = window.setInterval(() => setElapsedMs(Date.now() - started), 500);
    return () => window.clearInterval(id);
  }, [busy]);

  const update = (key: keyof typeof DEFAULTS) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const pollUntilSettled = useCallback(async (requestId: string): Promise<ScopeRecord> => {
    for (let attempt = 0; attempt < 180; attempt += 1) {
      const response = await fetch(`/api/investigations/${encodeURIComponent(requestId)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("STATUS_FAILED");
      const next = (await response.json()) as ScopeRecord;
      setRecord(next);
      if (next.state !== "INGESTING") return next;
      setStatus({ message: "Reading evidence and certifying\u2026", kind: "working" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    throw new Error("TIMEOUT");
  }, []);

  const runEvidenceFlow = useCallback(
    async (requestId: string) => {
      setReplay({ state: "idle", text: "" });
      setStatus({ message: "Starting the evidence review\u2026", kind: "working" });
      const started = await fetch(`/api/investigations/${encodeURIComponent(requestId)}/evidence`, { method: "POST" });
      const startedRecord = (await started.json()) as ScopeRecord & { error?: { message: string } };
      if (!started.ok) {
        setStatus({ message: startedRecord.error?.message ?? "Evidence could not be started.", kind: "error" });
        return;
      }
      setRecord(startedRecord);
      const settled = startedRecord.state === "INGESTING" ? await pollUntilSettled(requestId) : startedRecord;
      if (settled.state === "EVIDENCE_READY") {
        const verdict = settled.report ? ` Verdict: ${settled.report.report.verdict.label}.` : "";
        const lead =
          settled.mode === "cached"
            ? `${settled.exampleId === "control" ? "Control" : "Anomaly example"} certificate ready`
            : `Evidence ready: ${settled.evidence?.eventCount ?? 0} source-linked events`;
        setStatus({ message: `${lead}.${verdict}`, kind: "success" });
      } else if (settled.state === "RETRYABLE") {
        setStatus({ message: settled.evidenceError?.message ?? "The evidence read is retryable.", kind: "error" });
      } else {
        setStatus({ message: settled.evidenceError?.message ?? "Evidence was not complete for this scope.", kind: "error" });
      }
    },
    [pollUntilSettled],
  );

  const submit = useCallback(
    async (modeOverride?: RunMode, exampleIdOverride?: ExampleId) => {
      const mode = modeOverride ?? form.mode;
      setBusy(true);
      setElapsedMs(0);
      setRunMode(mode);
      setRecord(null);
      setReplay({ state: "idle", text: "" });
      setStatus({ message: mode === "cached" ? "Loading instant example\u2026" : "Validating scope\u2026", kind: "working" });
      if (mode === "live" && (!form.token.trim() || !form.startBlock.trim() || !form.endBlock.trim())) {
        setBusy(false);
        setStatus({ message: "Enter a token address and block window to begin.", kind: "error" });
        return;
      }
      try {
        const scope = mode === "cached"
          ? EXAMPLE_SCOPE
          : { token: form.token.trim(), startBlock: Number(form.startBlock), endBlock: Number(form.endBlock) };
        const response = await fetch("/api/investigations", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            token: scope.token,
            startBlock: scope.startBlock,
            endBlock: scope.endBlock,
            chainId: 8453,
            mode,
            ...(mode === "cached" ? { exampleId: exampleIdOverride ?? "anomaly" } : {}),
            configVersion: form.configVersion,
            idempotencyKey: mode === "cached" ? `${form.idempotencyKey}-${exampleIdOverride ?? "anomaly"}` : form.idempotencyKey,
          }),
        });
        const payload = (await response.json()) as ScopeRecord & { error?: { message: string } };
        if (!response.ok) {
          setStatus({ message: payload.error?.message ?? "Investigation scope was rejected.", kind: "error" });
          return;
        }
        setRecord(payload);
        await runEvidenceFlow(payload.requestId);
      } catch {
        setStatus({ message: "The request could not reach the Dervyx API. Retry without changing the scope.", kind: "error" });
      } finally {
        setBusy(false);
      }
    },
    [form, runEvidenceFlow],
  );

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void submit();
    },
    [submit],
  );

  const onRetry = useCallback(async () => {
    if (!record) return;
    setBusy(true);
    setElapsedMs(0);
    setRunMode(record.mode === "cached" ? "cached" : "live");
    try {
      await runEvidenceFlow(record.requestId);
    } finally {
      setBusy(false);
    }
  }, [record, runEvidenceFlow]);

  const onReplay = useCallback(async () => {
    if (!record) return;
    setReplay({ state: "checking", text: "Replaying\u2026" });
    try {
      const reportResponse = await fetch(`/api/investigations/${encodeURIComponent(record.requestId)}/report`, { cache: "no-store" });
      if (!reportResponse.ok) {
        setReplay({ state: "error", text: "No report is available to replay." });
        return;
      }
      const cert = await reportResponse.json();
      const verifyResponse = await fetch(`/api/investigations/${encodeURIComponent(record.requestId)}/report/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ report: cert.report, reportHash: cert.reportHash }),
      });
      const outcome = await verifyResponse.json();
      if (outcome.ok) {
        setReplay({ state: "ok", text: `Replay verified: canonical hash matches (${String(outcome.recomputedHash).slice(0, 16)}\u2026).` });
      } else {
        setReplay({ state: "mismatch", text: `Replay mismatch: ${outcome.mismatchReason ?? "hash differs"}.` });
      }
    } catch {
      setReplay({ state: "error", text: "Replay could not reach the Dervyx API." });
    }
  }, [record]);

  const evidence = record?.evidence;
  const funding = evidence?.funding;
  const firstTx = evidence?.events?.[0]?.transactionHash;
  const verdictLabel = record?.report?.report.verdict.label;
  const showRetry = record?.state === "RETRYABLE";
  const showNarrower =
    record?.state === "INSUFFICIENT_DATA" || verdictLabel === "UNKNOWN_ROOTS" || verdictLabel === "INSUFFICIENT_DATA";
  const showProgress = busy && status.kind === "working" && !record?.report;

  const statusColor =
    status.kind === "success" ? "text-teal" : status.kind === "error" ? "text-danger" : "text-caution";

  return (
    <div className="grid gap-6 sm:gap-10 lg:grid-cols-[380px_1fr]">
      {/* Scope form */}
      <form onSubmit={onSubmit} className="rounded-lg border border-edge bg-surface p-4 sm:p-6">
        <h2 className="text-xs uppercase tracking-widest2 text-faint">Scope</h2>
        <div className="mt-5 space-y-4">
          <Field label="Token address" hint="The contract you want to review.">
            <input value={form.token} onChange={update("token")} placeholder="Paste a token address" required spellCheck={false} autoComplete="off"
              className="w-full rounded-md border border-edge bg-ink px-3 py-2.5 font-mono text-sm text-cream outline-none focus:border-teal/50" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start block"><input value={form.startBlock} onChange={update("startBlock")} placeholder="From" required inputMode="numeric"
              className="w-full rounded-md border border-edge bg-ink px-3 py-2.5 font-mono text-sm text-cream outline-none focus:border-teal/50" /></Field>
            <Field label="End block"><input value={form.endBlock} onChange={update("endBlock")} placeholder="To" required inputMode="numeric"
              className="w-full rounded-md border border-edge bg-ink px-3 py-2.5 font-mono text-sm text-cream outline-none focus:border-teal/50" /></Field>
          </div>
          <Field label="Review mode" hint="Saved examples are immediate. Live reviews can take a few minutes.">
            <select value={form.mode} onChange={update("mode")}
              className="w-full rounded-md border border-edge bg-ink px-3 py-2.5 text-sm text-cream outline-none focus:border-teal/50">
              <option value="live">Live review</option>
              <option value="cached">Saved example</option>
            </select>
          </Field>
          <div className="rounded-md border border-edge/70 bg-ink/60 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-widest2 text-faint">Saved examples</span>

            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
              <span className="rounded border border-edge/60 px-2 py-1.5">Shared-root anomaly</span>
              <span className="rounded border border-edge/60 px-2 py-1.5">Known-router control</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-faint">Saved scopes illustrate the flow without filling your review fields.</p>
          </div>
        </div>
        <button type="submit" disabled={busy}
          className="mt-6 w-full rounded-md bg-teal px-4 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-teal-deep disabled:cursor-wait disabled:opacity-60">
          {busy ? "Reviewing\u2026" : "Start review"}
        </button>
        <button type="button" onClick={() => void submit("cached", "anomaly")} disabled={busy}
          className="mt-3 w-full rounded-md border border-edge px-4 py-2.5 text-sm text-cream transition-colors hover:border-muted disabled:opacity-60">
          Open anomaly example
        </button>
        <button type="button" onClick={() => void submit("cached", "control")} disabled={busy}
          className="mt-3 w-full rounded-md border border-teal/30 bg-teal/5 px-4 py-2.5 text-sm text-teal transition-colors hover:bg-teal/10 disabled:opacity-60">
          Open clean control
        </button>
        <p className={`mt-4 min-h-[40px] text-sm leading-relaxed ${statusColor}`} role="status" aria-live="polite">{status.message}</p>
      </form>

      {/* Result column */}
      <div className="space-y-6">
        {showProgress ? (
          <div className="rounded-lg border border-edge bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest2 text-faint">
                {runMode === "cached" ? "Loading example" : "Working through the evidence"}
              </h2>
              <span className="font-mono text-sm text-caution" aria-hidden="true">{mmss(elapsedMs)}</span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-edge/60">
              <div className="dvx-sweep h-full w-1/3 rounded-full bg-teal/70" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream">{status.message}</p>
            {runMode === "live" ? (
              <>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {LIVE_STEPS.map((step) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/70" aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-faint">
                  A live review can take a few minutes. You can keep this tab open.
                </p>
              </>
            ) : null}
          </div>
        ) : null}

        {!record ? (
          !busy ? (
            <div className="rounded-lg border border-dashed border-edge/70 p-10 text-sm text-faint">
              Enter a scope to begin, or open a saved example.
            </div>
          ) : null
        ) : (
          <>
            <div className="rounded-lg border border-edge bg-surface p-6">
              <h2 className="text-xs uppercase tracking-widest2 text-faint">Request scope</h2>
              <dl className="mt-4 text-sm">
                <ScopeRow label="State" value={record.state} mono />
                <ScopeRow label="Mode" value={record.mode === "cached" ? "saved example" : "live review"} />
                {record.exampleId ? <ScopeRow label="Example" value={record.exampleId === "control" ? "known-router control" : "shared-root anomaly"} /> : null}
                <ScopeRow label="Request ID" value={record.requestId} mono />
                <ScopeRow label="Scope hash" value={record.scopeHash} mono />
                <ScopeRow label="Events" value={evidence ? String(evidence.eventCount) : "not ready"} mono />
                <ScopeRow
                  label="Funding"
                  value={
                    funding
                      ? `${funding.originsWithEdges}/${funding.originsRequested} sampled origins, ${funding.edges.length} edges (${funding.status})`
                      : "not ready"
                  }
                />
                {firstTx ? (
                  <div className="grid grid-cols-[130px_1fr] gap-4 border-t border-edge/60 py-2.5">
                    <dt className="text-faint">First evidence</dt>
                    <dd className="[overflow-wrap:anywhere]">
                      <a href={txUrl(firstTx)} target="_blank" rel="noreferrer" className="font-mono text-teal hover:underline">
                        {firstTx.slice(0, 22)}&#8230;
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {record.report ? (
              <CertificatePanel
                report={record.report.report}
                reportHash={record.report.reportHash}
                branch={record.branch}
                chip={record.mode === "cached" ? "Saved example" : undefined}
                actions={
                  <>
                    <a
                      href={`/api/investigations/${encodeURIComponent(record.requestId)}/report`}
                      className="rounded-md border border-edge px-4 py-2 text-sm text-cream transition-colors hover:border-muted"
                    >
                      Download report JSON
                    </a>
                    <a
                      href={`/api/investigations/${encodeURIComponent(record.requestId)}/receipt`}
                      className="rounded-md border border-edge px-4 py-2 text-sm text-cream transition-colors hover:border-muted"
                    >
                      Download evidence receipt
                    </a>
                    <button
                      type="button"
                      onClick={onReplay}
                      className="rounded-md border border-teal/30 bg-teal/10 px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal/20"
                    >
                      Replay &amp; verify
                    </button>
                    {replay.state !== "idle" ? (
                      <span
                        className={`text-sm ${replay.state === "ok" ? "text-teal" : replay.state === "checking" ? "text-caution" : "text-danger"}`}
                        role="status"
                        aria-live="polite"
                      >
                        {replay.text}
                      </span>
                    ) : null}
                  </>
                }
              />
            ) : null}

            {showRetry || showNarrower ? (
              <div className="rounded-lg border border-caution/30 bg-caution/5 p-5">
                <p className="text-sm leading-relaxed text-caution">
                  {showRetry
                    ? "The review was interrupted. Retry, or narrow the selected block window and resubmit."
                    : "Attribution coverage is bounded to the top sampled origins, so this result is inconclusive rather than clean. Try a narrower block range to raise coverage."}
                </p>
                {showRetry ? (
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={busy}
                    className="mt-4 rounded-md border border-edge px-4 py-2 text-sm text-cream transition-colors hover:border-muted disabled:opacity-60"
                  >
                    Retry evidence read
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-cream">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-faint">{hint}</span> : null}
    </label>
  );
}

function ScopeRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-x-4 gap-y-1 border-t border-edge/60 py-2.5 first:border-t-0 first:pt-0 sm:grid-cols-[130px_1fr]">
      <dt className="text-faint">{label}</dt>
      <dd className={`text-cream [overflow-wrap:anywhere] ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
