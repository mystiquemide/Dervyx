import assert from "node:assert/strict";
import test from "node:test";
import type { Address, Hex } from "viem";

import {
  buildFundingGraph,
  StaticRootTaxonomy,
  type FundingEdge,
  type RootTaxonomy,
} from "../src/graph.js";
import {
  buildReport,
  canonicalize,
  certifyEvidence,
  hashCanonicalJson,
  reportInputFromEvidence,
  ReportError,
  verifyReport,
  type ReportInput,
} from "../src/report.js";
import type { EvidenceSnapshot } from "../src/scope.js";
import type { NormalizedSwapEvent } from "../src/chain.js";

const chainId = 8453;
const token = "0x5555555555555555555555555555555555555555" as Address;
const t1 = "0x1111111111111111111111111111111111111111" as Address;
const t2 = "0x2222222222222222222222222222222222222222" as Address;
const t3 = "0x3333333333333333333333333333333333333333" as Address;
const t4 = "0x4444444444444444444444444444444444444444" as Address;
const t5 = "0x5566778899aabbccddeeff00112233445566aabb" as Address;
const funder = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as Address;
const unknownRoot = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as Address;
const routerRoot = "0xcccccccccccccccccccccccccccccccccccccccc" as Address;

function edge(from: Address, to: Address, index: number, blockNumber: number, tag: string): FundingEdge {
  const txHash = `0x${tag.repeat(64).slice(0, 64)}` as Hex;
  return {
    chainId,
    from,
    to,
    token,
    amount: "1000000",
    blockNumber,
    blockHash: `0x${blockNumber.toString(16).padStart(64, "0")}` as Hex,
    transactionHash: txHash,
    logIndex: index,
    sourceType: "erc20_transfer",
    sourceUrl: `https://basescan.org/tx/${txHash}`,
  };
}

const taxonomy: RootTaxonomy = new StaticRootTaxonomy("phase0-source-by-source-v1", [
  {
    address: routerRoot,
    class: "router",
    label: "Test router root",
    source: "https://example.invalid/router-source",
  },
]);

function baseInput(overrides: Partial<ReportInput> & Pick<ReportInput, "graph">): ReportInput {
  return {
    token,
    chainId,
    startBlock: 50_121_395,
    endBlock: 50_123_000,
    mode: "live",
    scopeConfigVersion: "phase1-scope-v1",
    fixtureId: "unit-fixture",
    providerMode: "public_fallback",
    swapEventsByOrigin: {},
    swapEventCount: 0,
    originsTotal: 0,
    originsSampled: 0,
    fundingStatus: "complete",
    fundingSourceMode: "canonical_erc20",
    rpcUrl: "https://mainnet.base.org",
    apiBase: "https://base.blockscout.com/api/v2",
    sourceErrors: { native: 0, erc20: 0 },
    ...overrides,
  };
}

test("anomaly fixture: shared unknown root above threshold yields ANOMALY", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2, t3],
    fundingEdges: [
      edge(unknownRoot, funder, 0, 100, "a0"),
      edge(funder, t1, 1, 101, "a1"),
      edge(funder, t2, 2, 102, "a2"),
      edge(funder, t3, 3, 103, "a3"),
    ],
    taxonomy,
  });

  const cert = buildReport(
    baseInput({
      graph,
      swapEventsByOrigin: { [t1.toLowerCase()]: 10, [t2.toLowerCase()]: 8, [t3.toLowerCase()]: 6 },
      swapEventCount: 30,
      originsTotal: 3,
      originsSampled: 3,
    }),
  );

  assert.equal(cert.report.verdict.label, "ANOMALY");
  assert.equal(cert.report.verdict.rationaleCode, "CLUSTER_LINKED_SHARE_ABOVE_THRESHOLD");
  assert.equal(cert.report.metric.numerator, 24);
  assert.equal(cert.report.metric.denominator, 30);
  assert.equal(cert.report.metric.ratioBps, 8000);
  assert.equal(cert.report.metric.ratioPercent, "80.00%");
  assert.equal(cert.report.coordinationClusters.length, 1);
  const cluster = cert.report.coordinationClusters[0];
  assert.equal(cluster?.traderCount, 3);
  assert.equal(cluster?.rootClass, "unknown");
  assert.equal(cluster?.rootAddress.toLowerCase(), unknownRoot.toLowerCase());
  assert.equal(cluster?.linkedSwapEvents, 24);
  assert.ok((cluster?.sampleSourceUrls.length ?? 0) >= 1);
  assert.equal(cert.report.knownRootExclusions.length, 0);
});

test("control fixture: known router root does not inflate; yields CLEAN", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2],
    fundingEdges: [edge(routerRoot, t1, 0, 100, "c1"), edge(routerRoot, t2, 1, 101, "c2")],
    taxonomy,
  });

  const cert = buildReport(
    baseInput({
      graph,
      swapEventsByOrigin: { [t1.toLowerCase()]: 10, [t2.toLowerCase()]: 10 },
      swapEventCount: 20,
      originsTotal: 2,
      originsSampled: 2,
    }),
  );

  assert.equal(cert.report.verdict.label, "CLEAN");
  assert.equal(cert.report.verdict.rationaleCode, "NO_COORDINATION_WITH_SUFFICIENT_COVERAGE");
  assert.equal(cert.report.metric.numerator, 0);
  assert.equal(cert.report.metric.ratioBps, 0);
  assert.equal(cert.report.coordinationClusters.length, 0);
  assert.equal(cert.report.knownRootExclusions.length, 1);
  const exclusion = cert.report.knownRootExclusions[0];
  assert.equal(exclusion?.class, "router");
  assert.equal(exclusion?.linkedTraderCount, 2);
  assert.equal(exclusion?.address.toLowerCase(), routerRoot.toLowerCase());
});

test("partial coverage with no coordination yields UNKNOWN_ROOTS, never CLEAN", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2, t3, t4, t5],
    fundingEdges: [edge(unknownRoot, t1, 0, 100, "d1")],
    taxonomy,
  });

  const cert = buildReport(
    baseInput({
      graph,
      swapEventsByOrigin: { [t1.toLowerCase()]: 4 },
      swapEventCount: 20,
      originsTotal: 5,
      originsSampled: 5,
      fundingStatus: "partial",
    }),
  );

  assert.equal(cert.report.verdict.label, "UNKNOWN_ROOTS");
  assert.equal(cert.report.verdict.rationaleCode, "INSUFFICIENT_COVERAGE_FOR_CLEAN");
  assert.equal(cert.report.coordinationClusters.length, 0);
  assert.ok(
    cert.report.limitations.some((line) => line.includes("CLEAN verdict is not permitted on incomplete evidence")),
  );
});

test("no swap events yields INSUFFICIENT_DATA", () => {
  const graph = buildFundingGraph({ chainId, traders: [], fundingEdges: [], taxonomy });
  const cert = buildReport(baseInput({ graph }));
  assert.equal(cert.report.verdict.label, "INSUFFICIENT_DATA");
  assert.equal(cert.report.verdict.rationaleCode, "NO_SWAP_EVENTS");
  assert.equal(cert.report.metric.denominator, 0);
  assert.equal(cert.report.metric.ratioBps, 0);
});

test("swaps without funding attribution yield INSUFFICIENT_DATA", () => {
  const graph = buildFundingGraph({ chainId, traders: [t1, t2, t3, t4], fundingEdges: [], taxonomy });
  const cert = buildReport(
    baseInput({
      graph,
      swapEventsByOrigin: { [t1.toLowerCase()]: 3, [t2.toLowerCase()]: 3, [t3.toLowerCase()]: 3, [t4.toLowerCase()]: 3 },
      swapEventCount: 12,
      originsTotal: 4,
      originsSampled: 4,
    }),
  );
  assert.equal(cert.report.verdict.label, "INSUFFICIENT_DATA");
  assert.equal(cert.report.verdict.rationaleCode, "ATTRIBUTION_COVERAGE_TOO_LOW");
  assert.equal(cert.report.coverage.attributionCoverageBps, 0);
});

test("replay reproduces identical canonical bytes and hash", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2, t3],
    fundingEdges: [
      edge(unknownRoot, funder, 0, 100, "a0"),
      edge(funder, t1, 1, 101, "a1"),
      edge(funder, t2, 2, 102, "a2"),
      edge(funder, t3, 3, 103, "a3"),
    ],
    taxonomy,
  });
  const input = baseInput({
    graph,
    swapEventsByOrigin: { [t1.toLowerCase()]: 10, [t2.toLowerCase()]: 8, [t3.toLowerCase()]: 6 },
    swapEventCount: 30,
    originsTotal: 3,
    originsSampled: 3,
  });

  const first = buildReport(input);
  const second = buildReport(input);
  assert.equal(first.canonicalJson, second.canonicalJson);
  assert.equal(first.reportHash, second.reportHash);
  assert.equal(first.reportHash, hashCanonicalJson(first.canonicalJson));
  assert.equal(verifyReport(first.report, first.reportHash).ok, true);
});

test("tampered report fails hash verification", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2],
    fundingEdges: [edge(unknownRoot, t1, 0, 100, "e1"), edge(unknownRoot, t2, 1, 101, "e2")],
    taxonomy,
  });
  const cert = buildReport(
    baseInput({
      graph,
      swapEventsByOrigin: { [t1.toLowerCase()]: 5, [t2.toLowerCase()]: 5 },
      swapEventCount: 10,
      originsTotal: 2,
      originsSampled: 2,
    }),
  );

  const tampered = structuredClone(cert.report);
  tampered.metric.numerator += 1;
  const result = verifyReport(tampered, cert.reportHash);
  assert.equal(result.ok, false);
  assert.equal(result.mismatchReason, "HASH_MISMATCH");
  assert.notEqual(result.actualHash, cert.reportHash);

  const floatTampered = structuredClone(cert.report);
  (floatTampered.metric as { ratioBps: number }).ratioBps = 12.5;
  const floatResult = verifyReport(floatTampered, cert.reportHash);
  assert.equal(floatResult.ok, false);
  assert.equal(floatResult.mismatchReason, "NON_CANONICAL_NUMBER");
});

test("canonicalize sorts object keys, preserves arrays, drops undefined, rejects floats", () => {
  assert.equal(canonicalize({ b: 1, a: 2 }), '{"a":2,"b":1}');
  assert.equal(canonicalize({ a: 2, b: 1 }), '{"a":2,"b":1}');
  assert.equal(canonicalize(["z", "a"]), '["z","a"]');
  assert.equal(canonicalize({ a: undefined, b: 1 }), '{"b":1}');
  assert.throws(
    () => canonicalize({ x: 1.5 }),
    (error: unknown) => error instanceof ReportError && error.code === "NON_CANONICAL_NUMBER",
  );
});

test("report copy never claims proof of wash trading or fraud", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2],
    fundingEdges: [edge(unknownRoot, t1, 0, 100, "f1"), edge(unknownRoot, t2, 1, 101, "f2")],
    taxonomy,
  });
  const cert = buildReport(
    baseInput({
      graph,
      swapEventsByOrigin: { [t1.toLowerCase()]: 5, [t2.toLowerCase()]: 5 },
      swapEventCount: 10,
      originsTotal: 2,
      originsSampled: 2,
    }),
  );
  const lower = cert.canonicalJson.toLowerCase();
  assert.ok(lower.includes("not proof of wash trading"));
  assert.ok(!lower.includes("fraud"));
  for (const forbidden of [
    "proves wash trading",
    "proven wash trading",
    "confirmed wash trading",
    "wash trading detected",
    "is wash trading",
  ]) {
    assert.ok(!lower.includes(forbidden), `report copy must not assert "${forbidden}"`);
  }
});

test("reportInputFromEvidence maps a live snapshot and requires funding", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2],
    fundingEdges: [edge(unknownRoot, t1, 0, 100, "b1"), edge(unknownRoot, t2, 1, 101, "b2")],
    taxonomy,
  });
  const evidence: EvidenceSnapshot = {
    fixtureId: "baseunc-v4-launch-window",
    poolId: `0x${"1".repeat(64)}`,
    providerMode: "public_fallback",
    rpcUrl: "https://mainnet.base.org",
    range: {
      startBlock: 50_121_395,
      endBlock: 50_123_000,
      startHash: `0x${"2".repeat(64)}`,
      endHash: `0x${"3".repeat(64)}`,
    },
    rawEventCount: 2,
    eventCount: 2,
    events: [swapEvent(t1, 101, "aa"), swapEvent(t2, 102, "bb")],
    funding: {
      status: "complete",
      sourceMode: "canonical_erc20",
      apiBase: "https://base.blockscout.com/api/v2",
      rpcUrl: "https://mainnet.base.org",
      originsTotal: 2,
      originsRequested: 2,
      erc20OriginsRequested: 2,
      originsWithEdges: 2,
      nativeEdgeCount: 0,
      erc20EdgeCount: 2,
      pagesRead: 0,
      chunksRead: 1,
      edges: graph.edges,
      graph,
      errors: [],
      sourceErrors: { native: 0, erc20: 0 },
    },
  };

  const identity = {
    token,
    chainId,
    startBlock: 50_121_395,
    endBlock: 50_123_000,
    mode: "live" as const,
    scopeConfigVersion: "phase1-scope-v1",
  };
  const cert = certifyEvidence(identity, evidence);
  assert.equal(cert.report.metric.denominator, 2);
  assert.equal(cert.report.identity.fixtureId, "baseunc-v4-launch-window");
  assert.equal(cert.report.identity.token, token);
  assert.equal(cert.report.sources.fundingSourceMode, "canonical_erc20");
  assert.equal(cert.report.verdict.label, "ANOMALY");

  const withoutFunding: EvidenceSnapshot = { ...evidence };
  delete withoutFunding.funding;
  assert.throws(
    () => reportInputFromEvidence(identity, withoutFunding),
    (error: unknown) => error instanceof ReportError && error.code === "MISSING_FUNDING",
  );
});

test("branch maxHopsConsidered filter changes the deterministic work path and identity", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [t1, t2, t3],
    fundingEdges: [
      edge(unknownRoot, funder, 0, 100, "a0"),
      edge(funder, t1, 1, 101, "a1"),
      edge(funder, t2, 2, 102, "a2"),
      edge(funder, t3, 3, 103, "a3"),
    ],
    taxonomy,
  });
  const base = baseInput({
    graph,
    swapEventsByOrigin: { [t1.toLowerCase()]: 10, [t2.toLowerCase()]: 8, [t3.toLowerCase()]: 6 },
    swapEventCount: 30,
    originsTotal: 3,
    originsSampled: 3,
  });

  const full = buildReport({ ...base, branch: "standard", maxHopsConsidered: 2 });
  const shallow = buildReport({ ...base, branch: "early_stop", maxHopsConsidered: 1 });

  assert.equal(full.report.verdict.label, "ANOMALY");
  assert.equal(full.report.coordinationClusters.length, 1);
  assert.equal(full.report.identity.branch, "standard");
  assert.equal(full.report.identity.maxHopsConsidered, 2);

  // early_stop drops the two-hop shared root, so the coordination cluster disappears.
  assert.equal(shallow.report.coordinationClusters.length, 0);
  assert.equal(shallow.report.metric.numerator, 0);
  assert.notEqual(shallow.report.verdict.label, "ANOMALY");
  assert.equal(shallow.report.identity.branch, "early_stop");
  assert.equal(shallow.report.identity.maxHopsConsidered, 1);

  assert.notEqual(full.reportHash, shallow.reportHash);
});

function swapEvent(origin: Address, blockNumber: number, tag: string): NormalizedSwapEvent {
  const txHash = `0x${tag.repeat(64).slice(0, 64)}` as Hex;
  return {
    chainId,
    poolId: `0x${"1".repeat(64)}` as Hex,
    contractAddress: "0x498581fF718922c3f8e6A244956aF099B2652b2b" as Address,
    blockNumber,
    blockHash: `0x${blockNumber.toString(16).padStart(64, "0")}` as Hex,
    transactionHash: txHash,
    logIndex: 0,
    sender: origin,
    origin,
    amount0: "-1000",
    amount1: "1000",
    sqrtPriceX96: "0",
    liquidity: "0",
    tick: 0,
    fee: 3000,
    source: {
      providerMode: "public_fallback",
      rpcUrl: "https://mainnet.base.org",
      method: "eth_getLogs",
      originMethod: "eth_getTransactionByHash",
    },
  };
}
