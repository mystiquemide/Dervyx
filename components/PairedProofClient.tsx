"use client";

import { useState } from "react";
import { CertificatePanel } from "@/components/CertificatePanel";
import type { ScopeRecord } from "@/lib/types";

type ExampleId = "anomaly" | "control";

type CaseDefinition = {
  id: ExampleId;
  step: string;
  title: string;
  description: string;
  chip: string;
};

const CASES: CaseDefinition[] = [
  {
    id: "anomaly",
    step: "01",
    title: "Unknown shared root",
    description: "Three trading wallets converge on an unsourced root, so their observed share remains in the anomaly bucket.",
    chip: "Anomaly example",
  },
  {
    id: "control",
    step: "02",
    title: "Known router root",
    description: "Two wallets share a sourced router root. The relationship stays visible, but the policy excludes it from the anomaly share.",
    chip: "Clean control",
  },
];

const SCOPE = {
  token: "0xB2000000000000000000000Ff4a547c891AB1b01",
  startBlock: 50121395,
  endBlock: 50123000,
  chainId: 8453,
  mode: "cached" as const,
  configVersion: "phase1-scope-v1",
};

async function runExample(exampleId: ExampleId): Promise<ScopeRecord> {
  const nonce = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const created = await fetch("/api/investigations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...SCOPE, exampleId, idempotencyKey: `paired-proof-${exampleId}-${nonce}` }),
  });
  const createdPayload = (await created.json()) as ScopeRecord & { error?: { message: string } };
  if (!created.ok) throw new Error(createdPayload.error?.message ?? "Could not create the proof case.");

  const evidence = await fetch(`/api/investigations/${encodeURIComponent(createdPayload.requestId)}/evidence`, { method: "POST" });
  const evidencePayload = (await evidence.json()) as ScopeRecord & { error?: { message: string } };
  if (!evidence.ok) throw new Error(evidencePayload.error?.message ?? "Could not run the proof case.");
  return evidencePayload;
}

function ReplayButton({ requestId }: { requestId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function replay() {
    setBusy(true);
    setMessage("Checking canonical hash...");
    try {
      const reportResponse = await fetch(`/api/investigations/${encodeURIComponent(requestId)}/report`, { cache: "no-store" });
      const certificate = await reportResponse.json();
      const verifyResponse = await fetch(`/api/investigations/${encodeURIComponent(requestId)}/report/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ report: certificate.report, reportHash: certificate.reportHash }),
      });
      const result = await verifyResponse.json();
      setMessage(result.ok ? "Replay verified: hash matches." : `Replay failed: ${result.mismatchReason ?? "hash mismatch"}.`);
    } catch {
      setMessage("Replay could not reach the verifier.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => void replay()}
        disabled={busy}
        className="rounded-md border border-teal/30 bg-teal/10 px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal/20 disabled:opacity-60"
      >
        {busy ? "Checking..." : "Replay certificate"}
      </button>
      {message ? <span className={`text-sm ${message.startsWith("Replay verified") ? "text-teal" : "text-caution"}`} role="status">{message}</span> : null}
    </div>
  );
}

export function PairedProofClient() {
  const [results, setResults] = useState<Partial<Record<ExampleId, ScopeRecord>>>({});
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState<ExampleId | null>(null);
  const [error, setError] = useState("");

  async function runPair() {
    setResults({});
    setError("");
    setRunning(true);
    try {
      setActive("anomaly");
      const anomaly = await runExample("anomaly");
      setResults({ anomaly });
      setActive("control");
      const control = await runExample("control");
      setResults({ anomaly, control });
      setActive(null);
    } catch (cause) {
      setActive(null);
      setError(cause instanceof Error ? cause.message : "The paired proof could not be completed.");
    } finally {
      setRunning(false);
    }
  }

  const complete = results.anomaly?.report && results.control?.report;

  return (
    <div>
      <div className="rounded-lg border border-edge bg-surface p-4 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest2 text-teal">Counterfactual funding ledger</p>
            <h1 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight tracking-tight text-cream">
              Same scope. Different root policy.
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              Run the same deterministic engine twice. The anomaly case keeps an unknown shared root in the
              counted share. The control case shows that a known router can connect wallets without being
              mistaken for coordination.
            </p>
            <p className="mt-4 rounded border border-caution/30 bg-caution/5 px-3 py-2 text-xs leading-relaxed text-caution">
              This proof uses labeled offline fixtures so it is instant and replayable. It is not live-chain evidence.
            </p>
          </div>
          <div className="rounded-md border border-edge px-4 py-3 text-right font-mono text-xs text-faint">
            <p>chain_id 8453</p>
            <p className="mt-1">same block window</p>
            <p className="mt-1">same thresholds</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void runPair()}
          disabled={running}
          className="mt-8 w-full rounded-md bg-teal px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-teal-deep disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {running ? `Running ${active === "anomaly" ? "anomaly" : "control"} case...` : "Run the paired proof"}
        </button>
        {error ? <p className="mt-4 text-sm leading-relaxed text-danger" role="alert">{error}</p> : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {CASES.map((definition) => {
          const result = results[definition.id];
          return (
            <article key={definition.id} className="rounded-lg border border-edge/70 bg-ink p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="font-mono text-sm text-teal">{definition.step}</span>
                <div>
                  <h2 className="text-lg font-semibold text-cream">{definition.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{definition.description}</p>
                </div>
              </div>
              {result?.report ? (
                <div className="mt-6">
                  <CertificatePanel
                    report={result.report.report}
                    reportHash={result.report.reportHash}
                    branch={result.branch}
                    chip={definition.chip}
                    actions={
                      <>
                        <a
                          href={`/api/investigations/${encodeURIComponent(result.requestId)}/receipt`}
                          className="rounded-md border border-edge px-4 py-2 text-sm text-cream transition-colors hover:border-muted"
                        >
                          Download receipt
                        </a>
                        <ReplayButton requestId={result.requestId} />
                      </>
                    }
                  />
                </div>
              ) : (
                <div className="mt-6 rounded-md border border-dashed border-edge/70 p-6 text-sm text-faint">
                  {running && active === definition.id ? "Running the deterministic example..." : "Run the pair to populate this certificate."}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {complete ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-teal/30 bg-teal/5 p-6">
            <p className="text-xs uppercase tracking-widest2 text-teal">What changed</p>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-cream">
              Both cases use the same chain, range, thresholds, and deterministic report engine. Only the funding
              topology changes. Dervyx keeps the known router visible, excludes it from the anomaly share, and
              leaves the unknown root in the residual evidence for human review.
            </p>
          </div>
          <div className="rounded-lg border border-edge bg-surface p-6">
            <p className="text-xs uppercase tracking-widest2 text-faint">Agent branch trace</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The branch is allowlisted and recorded before the report is certified. Cached examples use the safe
              deterministic fallback; live runs may use a configured model, but the engine still owns every number.
            </p>
            <div className="mt-4 space-y-2 font-mono text-xs">
              {CASES.map((definition) => {
                const branch = results[definition.id]?.branch;
                return (
                  <div key={definition.id} className="flex flex-wrap justify-between gap-3 border-t border-edge/60 pt-2">
                    <span className="text-faint">{definition.id}</span>
                    <span className="text-cream">
                      {branch ? `${branch.branch} · ${branch.mode} · maxHops ${branch.plan.maxHopsConsidered}` : "not recorded"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
