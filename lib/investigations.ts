import { normalizeScopeRequest, ScopeStore, type EvidenceSnapshot } from "../src/scope.js";
import { createDefaultEvidenceRunner, type EvidenceRunner } from "../src/evidence.js";
import { certifyEvidence, verifyReport, type DervyxReport } from "../src/report.js";
import { branchAdapterFromEnv, chooseBranch, type BranchModelAdapter, type BranchSummary } from "../src/branch.js";
import { anomalyEvidence as exampleEvidence } from "./sample";

// Module-level singletons persist across route invocations within one running server
// process (and survive dev HMR via globalThis). Same in-memory model as the engine server.
type EngineGlobals = { __dvxStore?: ScopeStore; __dvxRunner?: EvidenceRunner };
const globals = globalThis as unknown as EngineGlobals;
export const store: ScopeStore = globals.__dvxStore ?? (globals.__dvxStore = new ScopeStore());
const runner: EvidenceRunner = globals.__dvxRunner ?? (globals.__dvxRunner = createDefaultEvidenceRunner());

export { normalizeScopeRequest, verifyReport };
export type { DervyxReport };

function branchTimeoutMs(): number {
  const raw = process.env.DERVYX_MODEL_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8000;
}

/**
 * Read evidence, certify it, and let an optional model pick a bounded branch.
 *
 * Live mode reads canonical Base evidence over the public fallback. Cached mode serves an
 * instant, offline example: a real certificate over a labeled example dataset, produced by
 * the same deterministic engine and a deterministic branch (no network, no model call).
 *
 * Either way, the state flips to EVIDENCE_READY only once the branch and report are attached,
 * so a poller never sees a ready state without a certificate.
 */
export async function runEvidence(requestId: string): Promise<void> {
  const record = store.get(requestId);
  if (!record) return;
  try {
    let evidence: EvidenceSnapshot;
    let adapter: BranchModelAdapter | undefined = branchAdapterFromEnv();

    if (record.mode === "cached") {
      evidence = exampleEvidence;
      adapter = undefined;
    } else {
      const result = await runner.run(record);
      if (result.kind !== "ready") {
        store.failEvidence(requestId, result.error);
        return;
      }
      evidence = result.evidence;
    }

    try {
      const identity = {
        token: record.token,
        chainId: record.chainId,
        startBlock: record.startBlock,
        endBlock: record.endBlock,
        mode: record.mode,
        scopeConfigVersion: record.configVersion,
      };
      const baseline = certifyEvidence(identity, evidence);
      const summary: BranchSummary = {
        token: baseline.report.identity.token,
        chainId: baseline.report.identity.chainId,
        startBlock: baseline.report.identity.startBlock,
        endBlock: baseline.report.identity.endBlock,
        swapEventCount: baseline.report.metric.denominator,
        originsTotal: baseline.report.coverage.originsTotal,
        originsSampled: baseline.report.coverage.originsSampled,
        fundingStatus: baseline.report.coverage.fundingStatus,
        coordinationClusterCount: baseline.report.coordinationClusters.length,
        knownRootExclusionCount: baseline.report.knownRootExclusions.length,
        attributionCoverageBps: baseline.report.coverage.attributionCoverageBps,
      };
      const decision = await chooseBranch(summary, adapter, { timeoutMs: branchTimeoutMs() });
      const certificate = certifyEvidence(identity, evidence, undefined, {
        branch: decision.branch,
        maxHopsConsidered: decision.plan.maxHopsConsidered,
      });
      store.completeEvidence(requestId, evidence);
      store.attachBranch(requestId, decision);
      store.attachReport(requestId, certificate);
    } catch {
      store.completeEvidence(requestId, evidence);
    }
  } catch {
    store.failEvidence(requestId, {
      code: "RPC_UNAVAILABLE",
      message: "Canonical evidence could not be read from the configured provider.",
      retryable: true,
    });
  }
}
