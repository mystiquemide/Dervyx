import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import type { AddressInfo } from "node:net";
import type { Address, Hex } from "viem";

import { createScopeServer } from "../src/server.js";
import type { EvidenceRunner } from "../src/evidence.js";
import { BASE_CHAIN_ID, ScopeStore, type EvidenceSnapshot } from "../src/scope.js";
import { buildFundingGraph, StaticRootTaxonomy, type FundingEdge } from "../src/graph.js";
import { verifyReport } from "../src/report.js";
import type { NormalizedSwapEvent } from "../src/chain.js";

const token = "0xB2000000000000000000000Ff4a547c891AB1b01";
const poolId = "0x1ee8db5e1df2386aa078cf866b83d90ca559757b4c98276694f5d7698c3570d8" as Hex;
const t1 = "0x1111111111111111111111111111111111111111" as Address;
const t2 = "0x2222222222222222222222222222222222222222" as Address;
const unknownRoot = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as Address;

function hash(tag: string): Hex {
  return `0x${tag.repeat(64).slice(0, 64)}` as Hex;
}

function fundingEdge(from: Address, to: Address, index: number, blockNumber: number, tag: string): FundingEdge {
  const tx = hash(tag);
  return {
    chainId: BASE_CHAIN_ID,
    from,
    to,
    token: token as Address,
    amount: "1000000",
    blockNumber,
    blockHash: `0x${blockNumber.toString(16).padStart(64, "0")}` as Hex,
    transactionHash: tx,
    logIndex: index,
    sourceType: "erc20_transfer",
    sourceUrl: `https://basescan.org/tx/${tx}`,
  };
}

function swapEvent(origin: Address, blockNumber: number, tag: string): NormalizedSwapEvent {
  return {
    chainId: BASE_CHAIN_ID,
    poolId,
    contractAddress: "0x498581fF718922c3f8e6A244956aF099B2652b2b" as Address,
    blockNumber,
    blockHash: `0x${blockNumber.toString(16).padStart(64, "0")}` as Hex,
    transactionHash: hash(tag),
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

const anomalyGraph = buildFundingGraph({
  chainId: BASE_CHAIN_ID,
  traders: [t1, t2],
  fundingEdges: [fundingEdge(unknownRoot, t1, 0, 100, "c1"), fundingEdge(unknownRoot, t2, 1, 101, "c2")],
  taxonomy: new StaticRootTaxonomy("phase0-source-by-source-v1", []),
});

const fundedEvidence: EvidenceSnapshot = {
  fixtureId: "baseunc-v4-launch-window",
  poolId,
  providerMode: "public_fallback",
  rpcUrl: "https://mainnet.base.org",
  range: {
    startBlock: 50121395,
    endBlock: 50123000,
    startHash: `0x${"11".repeat(32)}`,
    endHash: `0x${"22".repeat(32)}`,
  },
  rawEventCount: 4,
  eventCount: 4,
  events: [swapEvent(t1, 101, "aa"), swapEvent(t1, 102, "ab"), swapEvent(t2, 103, "ac"), swapEvent(t2, 104, "ad")],
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
    edges: anomalyGraph.edges,
    graph: anomalyGraph,
    errors: [],
    sourceErrors: { native: 0, erc20: 0 },
  },
};

const noFundingEvidence: EvidenceSnapshot = {
  fixtureId: "baseunc-v4-launch-window",
  poolId,
  providerMode: "public_fallback",
  rpcUrl: "https://mainnet.base.org",
  range: {
    startBlock: 50121395,
    endBlock: 50123000,
    startHash: `0x${"11".repeat(32)}`,
    endHash: `0x${"22".repeat(32)}`,
  },
  rawEventCount: 1,
  eventCount: 1,
  events: [swapEvent(t1, 101, "ba")],
};

const routerRoot = "0xcccccccccccccccccccccccccccccccccccccccc" as Address;

const controlGraph = buildFundingGraph({
  chainId: BASE_CHAIN_ID,
  traders: [t1, t2],
  fundingEdges: [fundingEdge(routerRoot, t1, 0, 100, "e1"), fundingEdge(routerRoot, t2, 1, 101, "e2")],
  taxonomy: new StaticRootTaxonomy("phase0-source-by-source-v1", [
    { address: routerRoot, class: "router", label: "Test router", source: "https://example.invalid/router" },
  ]),
});

const controlEvidence: EvidenceSnapshot = {
  ...fundedEvidence,
  funding: {
    ...fundedEvidence.funding!,
    edges: controlGraph.edges,
    graph: controlGraph,
  },
};

const incompleteGraph = buildFundingGraph({
  chainId: BASE_CHAIN_ID,
  traders: [t1, t2],
  fundingEdges: [fundingEdge(unknownRoot, t1, 0, 100, "f1")],
  taxonomy: new StaticRootTaxonomy("phase0-source-by-source-v1", []),
});

const incompleteEvidence: EvidenceSnapshot = {
  ...fundedEvidence,
  funding: {
    ...fundedEvidence.funding!,
    status: "partial",
    originsTotal: 8,
    originsRequested: 8,
    erc20OriginsRequested: 8,
    originsWithEdges: 1,
    erc20EdgeCount: 1,
    edges: incompleteGraph.edges,
    graph: incompleteGraph,
    sourceErrors: { native: 0, erc20: 0 },
  },
};

function requestBody(key: string): Record<string, unknown> {
  return {
    token,
    startBlock: 50121395,
    endBlock: 50123000,
    chainId: BASE_CHAIN_ID,
    mode: "live",
    configVersion: "phase1-scope-v1",
    idempotencyKey: key,
  };
}

async function startServer(runner: EvidenceRunner) {
  const server = createScopeServer(new ScopeStore(), runner);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function drive(baseUrl: string, key: string): Promise<any> {
  const createdResponse = await fetch(`${baseUrl}/api/investigations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestBody(key)),
  });
  const created = await createdResponse.json();
  await fetch(`${baseUrl}/api/investigations/${created.requestId}/evidence`, { method: "POST" });
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`${baseUrl}/api/investigations/${created.requestId}`);
    const record = await response.json();
    if (record.state !== "INGESTING") return record;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error("lifecycle timed out");
}

test("lifecycle certifies a funded snapshot and serves a verifiable report", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: fundedEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const record = await drive(baseUrl, "cert-ready-001");
  assert.equal(record.state, "EVIDENCE_READY");
  assert.ok(record.report, "record should carry a certificate");
  assert.equal(record.report.report.verdict.label, "ANOMALY");
  assert.equal(record.report.report.metric.numerator, 4);
  assert.equal(record.report.report.metric.denominator, 4);
  assert.match(record.report.reportHash, /^[0-9a-f]{64}$/);

  const reportResponse = await fetch(`${baseUrl}/api/investigations/${record.requestId}/report`);
  assert.equal(reportResponse.status, 200);
  assert.match(reportResponse.headers.get("content-type") ?? "", /application\/json/);
  assert.match(reportResponse.headers.get("content-disposition") ?? "", /attachment/);
  const downloaded = await reportResponse.json();
  assert.equal(downloaded.reportHash, record.report.reportHash);
  assert.equal(verifyReport(downloaded.report, downloaded.reportHash).ok, true);
});

test("report endpoint returns REPORT_NOT_READY when evidence carries no funding", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: noFundingEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const record = await drive(baseUrl, "cert-nofunding-001");
  assert.equal(record.state, "INSUFFICIENT_DATA");
  assert.equal(record.report, undefined);

  const reportResponse = await fetch(`${baseUrl}/api/investigations/${record.requestId}/report`);
  assert.equal(reportResponse.status, 404);
  assert.equal((await reportResponse.json()).error.code, "REPORT_NOT_READY");
});

test("report endpoint 404s for an unknown investigation", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: fundedEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const reportResponse = await fetch(`${baseUrl}/api/investigations/inv_missing/report`);
  assert.equal(reportResponse.status, 404);
  assert.equal((await reportResponse.json()).error.code, "NOT_FOUND");
});

test("verify endpoint confirms a genuine report and flags tampering", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: fundedEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const record = await drive(baseUrl, "cert-verify-001");
  const cert = await (await fetch(`${baseUrl}/api/investigations/${record.requestId}/report`)).json();

  const genuine = await fetch(`${baseUrl}/api/investigations/${record.requestId}/report/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ report: cert.report, reportHash: cert.reportHash }),
  });
  assert.equal(genuine.status, 200);
  const genuineResult = await genuine.json();
  assert.equal(genuineResult.ok, true);
  assert.equal(genuineResult.selfConsistent, true);
  assert.equal(genuineResult.matchesStored, true);

  const tampered = structuredClone(cert);
  tampered.report.metric.numerator += 1;
  const tamperedResponse = await fetch(`${baseUrl}/api/investigations/${record.requestId}/report/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ report: tampered.report, reportHash: cert.reportHash }),
  });
  const tamperedResult = await tamperedResponse.json();
  assert.equal(tamperedResult.ok, false);
  assert.equal(tamperedResult.selfConsistent, false);

  const swapped = await fetch(`${baseUrl}/api/investigations/${record.requestId}/report/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ report: cert.report, reportHash: `0x${"0".repeat(64)}` }),
  });
  const swappedResult = await swapped.json();
  assert.equal(swappedResult.ok, false);
  assert.equal(swappedResult.selfConsistent, false);
});

test("verify endpoint rejects bad body, unknown id, and missing report", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: fundedEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());
  const record = await drive(baseUrl, "cert-verify-badbody");

  const badBody = await fetch(`${baseUrl}/api/investigations/${record.requestId}/report/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(badBody.status, 400);

  const unknown = await fetch(`${baseUrl}/api/investigations/inv_missing/report/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ report: {}, reportHash: "x" }),
  });
  assert.equal(unknown.status, 404);
  assert.equal((await unknown.json()).error.code, "NOT_FOUND");

  const nfRunner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: noFundingEvidence }) };
  const nf = await startServer(nfRunner);
  t.after(() => nf.server.close());
  const nfRecord = await drive(nf.baseUrl, "cert-verify-nofunding");
  const nfResponse = await fetch(`${nf.baseUrl}/api/investigations/${nfRecord.requestId}/report/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ report: {}, reportHash: "x" }),
  });
  assert.equal(nfResponse.status, 404);
  assert.equal((await nfResponse.json()).error.code, "REPORT_NOT_READY");
});

test("lifecycle control with a known router root does not inflate (CLEAN)", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: controlEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const record = await drive(baseUrl, "cert-control-001");
  assert.equal(record.state, "EVIDENCE_READY");
  assert.equal(record.report.report.verdict.label, "CLEAN");
  assert.equal(record.report.report.metric.numerator, 0);
  assert.equal(record.report.report.coordinationClusters.length, 0);
  assert.equal(record.report.report.knownRootExclusions.length, 1);
  assert.equal(record.report.report.knownRootExclusions[0].class, "router");
});

test("lifecycle partial coverage is never labeled CLEAN (UNKNOWN_ROOTS)", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: incompleteEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const record = await drive(baseUrl, "cert-incomplete-001");
  assert.equal(record.state, "EVIDENCE_READY");
  assert.notEqual(record.report.report.verdict.label, "CLEAN");
  assert.equal(record.report.report.verdict.label, "UNKNOWN_ROOTS");
  assert.equal(record.report.report.coverage.fundingStatus, "partial");
});

test("lifecycle attaches a branch decision trace applied to the report", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: fundedEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const record = await drive(baseUrl, "cert-branch-001");
  assert.equal(record.state, "EVIDENCE_READY");
  assert.ok(record.branch, "record should carry a branch decision");
  assert.ok(["standard", "deeper_funding", "pair_history", "early_stop"].includes(record.branch.branch));
  assert.equal(record.branch.mode, "fallback"); // no model env configured under test
  assert.match(record.branch.summaryHash, /^[0-9a-f]{64}$/);
  assert.ok(record.branch.plan);
  assert.equal(record.report.report.identity.branch, record.branch.branch);
  assert.equal(record.report.report.identity.maxHopsConsidered, record.branch.plan.maxHopsConsidered);
});
