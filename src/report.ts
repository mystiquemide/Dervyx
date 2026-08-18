import { createHash } from "node:crypto";
import { getAddress, type Address } from "viem";

import type { EvidenceSnapshot, InvestigationMode } from "./scope.js";
import type { FundingEdge, FundingGraphSnapshot, RootClass } from "./graph.js";

export const REPORT_SCHEMA_VERSION = "dervyx-report-v1";
export const DEFAULT_REPORT_CONFIG_VERSION = "phase4-report-v1";

/**
 * Deterministic thresholds. The config version and every threshold value are part of
 * the hashed report identity, so changing any threshold produces a new report identity
 * (BR-008). Numerics are integers or basis points to keep canonical bytes stable (NFR-004).
 */
export interface ReportConfig {
  version: string;
  /** Cluster-linked swap share (basis points) at or above which the verdict is ANOMALY. */
  anomalyRatioBps: number;
  /** Minimum funding attribution coverage (basis points) required before CLEAN is allowed. */
  minCoverageForCleanBps: number;
  /** Below this coverage (basis points) with no coordination, evidence is INSUFFICIENT_DATA. */
  minCoverageForVerdictBps: number;
  /** Distinct traders that must share one unknown root before it counts as coordination. */
  clusterMinTraders: number;
  /** Upper bound on source-linked evidence edges included in the report sample. */
  maxSampleEdges: number;
  /** Upper bound on traders listed per coordination cluster. */
  maxSampleTraders: number;
}

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  version: DEFAULT_REPORT_CONFIG_VERSION,
  anomalyRatioBps: 3000,
  minCoverageForCleanBps: 5000,
  minCoverageForVerdictBps: 500,
  clusterMinTraders: 2,
  maxSampleEdges: 25,
  maxSampleTraders: 50,
};

export type ReportVerdictLabel = "ANOMALY" | "CLEAN" | "UNKNOWN_ROOTS" | "INSUFFICIENT_DATA";

export type ReportErrorCode =
  | "CHAIN_MISMATCH"
  | "INCONSISTENT_COUNTS"
  | "INVALID_INPUT"
  | "MISSING_FUNDING"
  | "NON_CANONICAL_NUMBER"
  | "NON_CANONICAL_VALUE";

export class ReportError extends Error {
  constructor(
    public readonly code: ReportErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ReportError";
  }
}

export interface ReportInput {
  token: string;
  chainId: number;
  startBlock: number;
  endBlock: number;
  mode: InvestigationMode;
  scopeConfigVersion: string;
  fixtureId: string;
  providerMode: "public_fallback" | "configured";
  graph: FundingGraphSnapshot;
  /** Swap-event count keyed by lowercased trading-origin address; the denominator basis. */
  swapEventsByOrigin: Record<string, number>;
  /** Total observed swap events in scope (denominator). */
  swapEventCount: number;
  originsTotal: number;
  originsSampled: number;
  fundingStatus: "complete" | "partial";
  fundingSourceMode: string;
  rpcUrl: string;
  apiBase: string;
  sourceErrors: { native: number; erc20: number };
  /** Optional agent branch label recorded into the report identity. */
  branch?: string;
  /** Deterministic funding-hop depth to consider; paths beyond it are excluded. */
  maxHopsConsidered?: number;
  config?: ReportConfig;
}

export interface ReportIdentity {
  chainId: number;
  endBlock: number;
  fixtureId: string;
  graphVersion: string;
  mode: InvestigationMode;
  providerMode: "public_fallback" | "configured";
  reportConfigVersion: string;
  scopeConfigVersion: string;
  startBlock: number;
  taxonomyVersion: string;
  token: Address;
  branch?: string;
  maxHopsConsidered?: number;
}

export interface ReportMetric {
  name: string;
  units: string;
  numerator: number;
  denominator: number;
  ratioBps: number;
  ratioPercent: string;
  window: { startBlock: number; endBlock: number };
  thresholds: {
    anomalyRatioBps: number;
    clusterMinTraders: number;
    minCoverageForCleanBps: number;
    minCoverageForVerdictBps: number;
  };
}

export interface ReportCoverage {
  attributionCoverageBps: number;
  fundingStatus: "complete" | "partial";
  originsSampled: number;
  originsTotal: number;
  sourceErrors: { erc20: number; native: number };
  tradersAnalyzed: number;
  tradersAttributed: number;
}

export interface CoordinationCluster {
  id: string;
  linkedSwapEvents: number;
  rootAddress: Address;
  rootClass: "unknown";
  sampleSourceUrls: string[];
  traderCount: number;
  traders: Address[];
}

export interface KnownRootExclusion {
  address: Address;
  class: Exclude<RootClass, "unknown">;
  label?: string;
  linkedTraderCount: number;
  source?: string;
}

export interface ReportEvidenceEdge {
  amount: string;
  blockNumber: number;
  from: Address;
  logIndex: number;
  sourceType: "native_internal" | "erc20_transfer";
  sourceUrl: string;
  to: Address;
  token: Address;
  transactionHash: string;
}

export interface DervyxReport {
  schema: string;
  identity: ReportIdentity;
  verdict: { label: ReportVerdictLabel; rationaleCode: string; statement: string };
  metric: ReportMetric;
  coverage: ReportCoverage;
  coordinationClusters: CoordinationCluster[];
  knownRootExclusions: KnownRootExclusion[];
  evidenceSample: { totalFundingEdges: number; totalSwapEvents: number; edges: ReportEvidenceEdge[] };
  limitations: string[];
  sources: { apiBase: string; fundingSourceMode: string; rpcUrl: string; swapProviderMode: "public_fallback" | "configured" };
}

export interface ReportCertificate {
  report: DervyxReport;
  canonicalJson: string;
  reportHash: string;
}

export interface ReplayResult {
  actualHash: string;
  expectedHash: string;
  ok: boolean;
  mismatchReason?: string;
}

const WASH_DISCLAIMER =
  "Shared funding is evidence of a relationship, not proof of intent, ownership, coordination, or wrongdoing. This report is not proof of wash trading.";

/**
 * Sorted-key canonical JSON (ADR-007). Object keys are sorted; arrays preserve their
 * already-deterministic order; numbers must be integers so the byte stream is stable
 * across platforms. Any float or unsupported value is rejected rather than silently
 * serialized, which would break replay.
 */
export function canonicalize(value: unknown): string {
  if (value === null) return "null";
  const type = typeof value;
  if (type === "number") {
    const n = value as number;
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      throw new ReportError("NON_CANONICAL_NUMBER", "Canonical reports use integer or string numerics only.");
    }
    return JSON.stringify(n);
  }
  if (type === "string" || type === "boolean") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  if (type === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(",")}}`;
  }
  throw new ReportError("NON_CANONICAL_VALUE", "Canonical reports cannot contain this value type.");
}

export function hashCanonicalJson(canonicalJson: string): string {
  return createHash("sha256").update(canonicalJson, "utf8").digest("hex");
}

function bpsToPercent(bps: number): string {
  const whole = Math.floor(bps / 100);
  const frac = (bps % 100).toString().padStart(2, "0");
  return `${whole}.${frac}%`;
}

function requireCount(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new ReportError("INVALID_INPUT", `Report input field ${field} must be a non-negative integer.`);
  }
  return value;
}

function addressSort(left: Address, right: Address): number {
  return left.toLowerCase().localeCompare(right.toLowerCase());
}

function clusterId(rootAddress: Address): string {
  return `coord_${createHash("sha256").update(rootAddress.toLowerCase(), "utf8").digest("hex").slice(0, 16)}`;
}

interface UnknownRootBucket {
  address: Address;
  traders: Set<string>;
}

interface KnownRootBucket {
  address: Address;
  class: Exclude<RootClass, "unknown">;
  label?: string;
  source?: string;
  traders: Set<string>;
}

export function buildReport(input: ReportInput): ReportCertificate {
  const config = input.config ?? DEFAULT_REPORT_CONFIG;
  const token = getAddress(input.token);
  const graph = input.graph;

  if (graph.chainId !== input.chainId) {
    throw new ReportError("CHAIN_MISMATCH", "Report chain ID does not match the funding graph chain ID.");
  }

  const denominator = requireCount(input.swapEventCount, "swapEventCount");
  const originsTotal = requireCount(input.originsTotal, "originsTotal");
  requireCount(input.originsSampled, "originsSampled");
  requireCount(input.sourceErrors.native, "sourceErrors.native");
  requireCount(input.sourceErrors.erc20, "sourceErrors.erc20");

  const swapByOrigin = new Map<string, number>();
  for (const [address, count] of Object.entries(input.swapEventsByOrigin)) {
    swapByOrigin.set(address.toLowerCase(), requireCount(count, `swapEventsByOrigin.${address}`));
  }
  const swapsFor = (lowerAddress: string): number => swapByOrigin.get(lowerAddress) ?? 0;

  const maxHops = input.maxHopsConsidered ?? Number.POSITIVE_INFINITY;

  const attributedTraders = new Set<string>();
  const unknownRoots = new Map<string, UnknownRootBucket>();
  const knownRoots = new Map<string, KnownRootBucket>();

  for (const path of graph.paths) {
    if (path.hopCount < 1) continue;
    if (path.hopCount > maxHops) continue;
    const traderKey = path.trader.toLowerCase();
    attributedTraders.add(traderKey);
    const rootKey = path.root.address.toLowerCase();
    if (path.root.class === "unknown") {
      const bucket = unknownRoots.get(rootKey) ?? { address: path.root.address, traders: new Set<string>() };
      bucket.traders.add(traderKey);
      unknownRoots.set(rootKey, bucket);
    } else {
      const rootClass = path.root.class;
      const bucket =
        knownRoots.get(rootKey) ??
        ({
          address: path.root.address,
          class: rootClass,
          traders: new Set<string>(),
          ...(path.root.label !== undefined ? { label: path.root.label } : {}),
          ...(path.root.source !== undefined ? { source: path.root.source } : {}),
        } satisfies KnownRootBucket);
      bucket.traders.add(traderKey);
      knownRoots.set(rootKey, bucket);
    }
  }

  const edgesByRecipient = new Map<string, FundingEdge[]>();
  for (const edge of graph.edges) {
    const key = edge.to.toLowerCase();
    const list = edgesByRecipient.get(key) ?? [];
    list.push(edge);
    edgesByRecipient.set(key, list);
  }

  const coordinatedTraders = new Set<string>();
  const clusters: CoordinationCluster[] = [];
  for (const bucket of unknownRoots.values()) {
    if (bucket.traders.size < config.clusterMinTraders) continue;
    const traderKeys = [...bucket.traders];
    for (const key of traderKeys) coordinatedTraders.add(key);
    const linkedSwapEvents = traderKeys.reduce((sum, key) => sum + swapsFor(key), 0);
    const sourceUrls = new Set<string>();
    for (const key of traderKeys) {
      for (const edge of edgesByRecipient.get(key) ?? []) sourceUrls.add(edge.sourceUrl);
    }
    clusters.push({
      id: clusterId(bucket.address),
      linkedSwapEvents,
      rootAddress: bucket.address,
      rootClass: "unknown",
      sampleSourceUrls: [...sourceUrls].sort((a, b) => a.localeCompare(b)).slice(0, config.maxSampleEdges),
      traderCount: bucket.traders.size,
      traders: traderKeys
        .map((key) => getAddress(key))
        .sort(addressSort)
        .slice(0, config.maxSampleTraders),
    });
  }
  clusters.sort((left, right) => addressSort(left.rootAddress, right.rootAddress));

  const knownRootExclusions: KnownRootExclusion[] = [...knownRoots.values()]
    .map((bucket) => ({
      address: bucket.address,
      class: bucket.class,
      linkedTraderCount: bucket.traders.size,
      ...(bucket.label !== undefined ? { label: bucket.label } : {}),
      ...(bucket.source !== undefined ? { source: bucket.source } : {}),
    }))
    .sort((left, right) => addressSort(left.address, right.address));

  let numerator = 0;
  for (const key of coordinatedTraders) numerator += swapsFor(key);
  if (numerator > denominator) {
    throw new ReportError(
      "INCONSISTENT_COUNTS",
      "Coordinated swap events exceed the total swap-event denominator.",
    );
  }

  const ratioBps = denominator > 0 ? Math.round((numerator * 10_000) / denominator) : 0;
  const tradersAttributed = attributedTraders.size;
  const attributionCoverageBps = originsTotal > 0 ? Math.round((tradersAttributed * 10_000) / originsTotal) : 0;
  const hasCoordination = clusters.length > 0;

  let label: ReportVerdictLabel;
  let rationaleCode: string;
  if (denominator <= 0) {
    label = "INSUFFICIENT_DATA";
    rationaleCode = "NO_SWAP_EVENTS";
  } else if (hasCoordination && ratioBps >= config.anomalyRatioBps) {
    label = "ANOMALY";
    rationaleCode = "CLUSTER_LINKED_SHARE_ABOVE_THRESHOLD";
  } else if (!hasCoordination && attributionCoverageBps < config.minCoverageForVerdictBps) {
    label = "INSUFFICIENT_DATA";
    rationaleCode = "ATTRIBUTION_COVERAGE_TOO_LOW";
  } else if (
    !hasCoordination &&
    input.fundingStatus === "complete" &&
    attributionCoverageBps >= config.minCoverageForCleanBps
  ) {
    label = "CLEAN";
    rationaleCode = "NO_COORDINATION_WITH_SUFFICIENT_COVERAGE";
  } else {
    label = "UNKNOWN_ROOTS";
    rationaleCode = hasCoordination ? "COORDINATION_BELOW_ANOMALY_THRESHOLD" : "INSUFFICIENT_COVERAGE_FOR_CLEAN";
  }

  const statement = verdictStatement(label);

  const limitations = [WASH_DISCLAIMER, ...STANDING_LIMITATIONS];
  if (input.fundingStatus === "partial") {
    limitations.push(
      "Funding coverage is partial for this scope; a CLEAN verdict is not permitted on incomplete evidence.",
    );
  }
  const totalSourceErrors = input.sourceErrors.native + input.sourceErrors.erc20;
  if (totalSourceErrors > 0) {
    limitations.push(
      `Funding sources reported ${totalSourceErrors} read error(s); missing edges are not treated as zero.`,
    );
  }

  const evidenceEdges: ReportEvidenceEdge[] = graph.edges.slice(0, config.maxSampleEdges).map((edge) => ({
    amount: edge.amount,
    blockNumber: edge.blockNumber,
    from: edge.from,
    logIndex: edge.logIndex,
    sourceType: edge.sourceType,
    sourceUrl: edge.sourceUrl,
    to: edge.to,
    token: edge.token,
    transactionHash: edge.transactionHash,
  }));

  const report: DervyxReport = {
    schema: REPORT_SCHEMA_VERSION,
    identity: {
      chainId: input.chainId,
      endBlock: input.endBlock,
      fixtureId: input.fixtureId,
      graphVersion: graph.version,
      mode: input.mode,
      providerMode: input.providerMode,
      reportConfigVersion: config.version,
      scopeConfigVersion: input.scopeConfigVersion,
      startBlock: input.startBlock,
      taxonomyVersion: graph.taxonomyVersion,
      token,
      ...(input.branch !== undefined ? { branch: input.branch } : {}),
      ...(input.maxHopsConsidered !== undefined ? { maxHopsConsidered: input.maxHopsConsidered } : {}),
    },
    verdict: { label, rationaleCode, statement },
    metric: {
      name: "observed_cluster_linked_swap_share",
      units: "swap_events",
      numerator,
      denominator,
      ratioBps,
      ratioPercent: bpsToPercent(ratioBps),
      window: { startBlock: input.startBlock, endBlock: input.endBlock },
      thresholds: {
        anomalyRatioBps: config.anomalyRatioBps,
        clusterMinTraders: config.clusterMinTraders,
        minCoverageForCleanBps: config.minCoverageForCleanBps,
        minCoverageForVerdictBps: config.minCoverageForVerdictBps,
      },
    },
    coverage: {
      attributionCoverageBps,
      fundingStatus: input.fundingStatus,
      originsSampled: input.originsSampled,
      originsTotal,
      sourceErrors: { erc20: input.sourceErrors.erc20, native: input.sourceErrors.native },
      tradersAnalyzed: graph.traders.length,
      tradersAttributed,
    },
    coordinationClusters: clusters,
    knownRootExclusions,
    evidenceSample: {
      totalFundingEdges: graph.edges.length,
      totalSwapEvents: denominator,
      edges: evidenceEdges,
    },
    limitations,
    sources: {
      apiBase: input.apiBase,
      fundingSourceMode: input.fundingSourceMode,
      rpcUrl: input.rpcUrl,
      swapProviderMode: input.providerMode,
    },
  };

  const canonicalJson = canonicalize(report);
  return { report, canonicalJson, reportHash: hashCanonicalJson(canonicalJson) };
}

const STANDING_LIMITATIONS = [
  "Funding attribution is bounded to two hops and a sampled subset of trading origins; unsampled or unattributed origins are excluded from the numerator.",
  "Native-ETH funding coverage is best-effort and provider-limited; canonical ERC-20 transfers are the reliable funding layer for this scope.",
  "Root classification uses a versioned, source-by-source taxonomy; addresses without sourced evidence remain unknown by default.",
] as const;

function verdictStatement(label: ReportVerdictLabel): string {
  switch (label) {
    case "ANOMALY":
      return "Observed anomaly: a material share of swap activity originates from wallets that share an unknown funding source within two hops. This is an evidence signal for further review, not proof of wash trading or coordination intent.";
    case "CLEAN":
      return "No configured funding-linkage anomaly was observed with sufficient attribution coverage for this fixed scope. This is not a guarantee of legitimacy.";
    case "UNKNOWN_ROOTS":
      return "Attribution coverage is insufficient to confirm or rule out a funding-linkage anomaly for this scope. The result is inconclusive, not clean.";
    case "INSUFFICIENT_DATA":
      return "The observed evidence set is incomplete or empty for this scope, so no verdict can be computed. This is not a clean result.";
  }
}

/**
 * Recompute the canonical hash of a report and compare it to the expected hash. Any
 * tampering (changed field, reordered non-canonical numeric, structural edit) yields a
 * mismatch instead of a false pass.
 */
export function verifyReport(report: DervyxReport, expectedHash: string): ReplayResult {
  let actualHash: string;
  try {
    actualHash = hashCanonicalJson(canonicalize(report));
  } catch (error) {
    return {
      actualHash: "",
      expectedHash,
      ok: false,
      mismatchReason: error instanceof ReportError ? error.code : "CANONICALIZATION_FAILED",
    };
  }
  if (actualHash === expectedHash) {
    return { actualHash, expectedHash, ok: true };
  }
  return { actualHash, expectedHash, ok: false, mismatchReason: "HASH_MISMATCH" };
}

export interface ReportIdentityInput {
  token: string;
  chainId: number;
  startBlock: number;
  endBlock: number;
  mode: InvestigationMode;
  scopeConfigVersion: string;
}

export interface BranchPlanInput {
  branch: string;
  maxHopsConsidered: number;
}

/** Map a live evidence snapshot to a deterministic report input. */
export function reportInputFromEvidence(
  identity: ReportIdentityInput,
  evidence: EvidenceSnapshot,
  config?: ReportConfig,
  branchPlan?: BranchPlanInput,
): ReportInput {
  const funding = evidence.funding;
  if (!funding) {
    throw new ReportError("MISSING_FUNDING", "Evidence snapshot has no funding graph to certify.");
  }
  const swapEventsByOrigin: Record<string, number> = {};
  for (const event of evidence.events) {
    const key = event.origin.toLowerCase();
    swapEventsByOrigin[key] = (swapEventsByOrigin[key] ?? 0) + 1;
  }
  return {
    token: identity.token,
    chainId: identity.chainId,
    startBlock: identity.startBlock,
    endBlock: identity.endBlock,
    mode: identity.mode,
    scopeConfigVersion: identity.scopeConfigVersion,
    fixtureId: evidence.fixtureId,
    providerMode: evidence.providerMode,
    graph: funding.graph,
    swapEventsByOrigin,
    swapEventCount: evidence.eventCount,
    originsTotal: funding.originsTotal,
    originsSampled: funding.originsRequested,
    fundingStatus: funding.status,
    fundingSourceMode: funding.sourceMode,
    rpcUrl: funding.rpcUrl,
    apiBase: funding.apiBase,
    sourceErrors: { native: funding.sourceErrors.native, erc20: funding.sourceErrors.erc20 },
    ...(branchPlan ? { branch: branchPlan.branch, maxHopsConsidered: branchPlan.maxHopsConsidered } : {}),
    ...(config ? { config } : {}),
  };
}

/** Convenience: build a certificate directly from a live evidence snapshot. */
export function certifyEvidence(
  identity: ReportIdentityInput,
  evidence: EvidenceSnapshot,
  config?: ReportConfig,
  branchPlan?: BranchPlanInput,
): ReportCertificate {
  return buildReport(reportInputFromEvidence(identity, evidence, config, branchPlan));
}
