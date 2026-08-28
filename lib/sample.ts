import { buildFundingGraph, StaticRootTaxonomy, type FundingEdge, type RootTaxonomy } from "../src/graph.js";
import { certifyEvidence, type ReportCertificate } from "../src/report.js";
import { BASE_CHAIN_ID, type EvidenceSnapshot, type InvestigationMode } from "../src/scope.js";
import type { NormalizedSwapEvent } from "../src/chain.js";
import type { Address, Hex } from "viem";

/**
 * Real certificates over small, clearly labeled example inputs. Every number and hash here
 * is produced by the same deterministic engine the live tool uses and will replay-verify.
 * These drive the landing visuals so nothing on the page is mocked or hand-drawn.
 */

const token = "0xB2000000000000000000000Ff4a547c891AB1b01" as Address;
const unknownRoot = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as Address;
const funder = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as Address;
const router = "0xcccccccccccccccccccccccccccccccccccccccc" as Address;

function addr(tag: string): Address {
  return `0x${tag.repeat(40).slice(0, 40)}` as Address;
}
function hash(tag: string): Hex {
  return `0x${tag.repeat(64).slice(0, 64)}` as Hex;
}

const routerTaxonomy: RootTaxonomy = new StaticRootTaxonomy("phase0-source-by-source-v1", [
  { address: router, class: "router", label: "Uniswap v4 PoolManager", source: "https://example.invalid/router" },
]);

function edge(from: Address, to: Address, index: number, blockNumber: number, tag: string): FundingEdge {
  const tx = hash(tag);
  return {
    chainId: BASE_CHAIN_ID,
    from,
    to,
    token,
    amount: "1000000",
    blockNumber,
    blockHash: `0x${blockNumber.toString(16).padStart(64, "0")}` as Hex,
    transactionHash: tx,
    logIndex: index,
    sourceType: "erc20_transfer",
    sourceUrl: `https://basescan.org/tx/${tx}`,
  };
}

function swap(origin: Address, blockNumber: number, tag: string): NormalizedSwapEvent {
  return {
    chainId: BASE_CHAIN_ID,
    poolId: hash("1"),
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

function snapshot(input: {
  fixtureId: string;
  traders: Address[];
  fundingEdges: FundingEdge[];
  events: NormalizedSwapEvent[];
  status: "complete" | "partial";
  originsTotal: number;
  taxonomy: RootTaxonomy;
}): EvidenceSnapshot {
  const graph = buildFundingGraph({
    chainId: BASE_CHAIN_ID,
    traders: input.traders,
    fundingEdges: input.fundingEdges,
    taxonomy: input.taxonomy,
  });
  return {
    fixtureId: input.fixtureId,
    poolId: hash("1"),
    providerMode: "public_fallback",
    rpcUrl: "https://mainnet.base.org",
    range: { startBlock: 50121395, endBlock: 50123000, startHash: hash("2"), endHash: hash("3") },
    rawEventCount: input.events.length,
    eventCount: input.events.length,
    events: input.events,
    funding: {
      status: input.status,
      sourceMode: "canonical_erc20",
      apiBase: "https://base.blockscout.com/api/v2",
      rpcUrl: "https://mainnet.base.org",
      originsTotal: input.originsTotal,
      originsRequested: input.traders.length,
      erc20OriginsRequested: input.traders.length,
      originsWithEdges: new Set(input.fundingEdges.map((e) => e.to.toLowerCase())).size,
      nativeEdgeCount: 0,
      erc20EdgeCount: input.fundingEdges.length,
      pagesRead: 0,
      chunksRead: 1,
      edges: graph.edges,
      graph,
      errors: [],
      sourceErrors: { native: 0, erc20: 0 },
    },
  };
}

const identity = {
  token,
  chainId: BASE_CHAIN_ID,
  startBlock: 50121395,
  endBlock: 50123000,
  mode: "recorded" as InvestigationMode,
  scopeConfigVersion: "phase1-scope-v1",
};

const t1 = addr("1");
const t2 = addr("2");
const t3 = addr("3");
const t4 = addr("4");

// ANOMALY: three wallets share one unknown root two hops back; a fourth is funded by a
// known router and is correctly excluded, so it never inflates the share.
export const anomalyEvidence = snapshot({
  fixtureId: "baseunc-anomaly-example",
  traders: [t1, t2, t3, t4],
  fundingEdges: [
    edge(unknownRoot, funder, 0, 100, "a0"),
    edge(funder, t1, 1, 101, "a1"),
    edge(funder, t2, 2, 102, "a2"),
    edge(funder, t3, 3, 103, "a3"),
    edge(router, t4, 4, 104, "a4"),
  ],
  events: [
    swap(t1, 101, "e1"), swap(t1, 105, "e2"), swap(t1, 109, "e3"), swap(t1, 113, "e4"),
    swap(t2, 102, "e5"), swap(t2, 106, "e6"), swap(t2, 110, "e7"),
    swap(t3, 103, "e8"), swap(t3, 107, "e9"), swap(t3, 111, "ea"),
    swap(t4, 104, "eb"), swap(t4, 108, "ec"), swap(t4, 112, "ed"), swap(t4, 114, "ee"), swap(t4, 116, "ef"), swap(t4, 118, "f0"),
  ],
  status: "complete",
  originsTotal: 4,
  taxonomy: routerTaxonomy,
});

const c1 = addr("5");
const c2 = addr("6");
// CLEAN: both wallets funded only by a known router root; separated, never counted.
export const cleanEvidence = snapshot({
  fixtureId: "baseunc-clean-control-example",
  traders: [c1, c2],
  fundingEdges: [edge(router, c1, 0, 120, "b1"), edge(router, c2, 1, 121, "b2")],
  events: [swap(c1, 120, "c1"), swap(c1, 122, "c2"), swap(c2, 121, "c3"), swap(c2, 123, "c4")],
  status: "complete",
  originsTotal: 2,
  taxonomy: routerTaxonomy,
});

const u1 = addr("7");
const u2 = addr("8");
const u3 = addr("9");
// UNKNOWN_ROOTS: partial coverage, one wallet attributed, no cluster; never labeled CLEAN.
export const unknownEvidence = snapshot({
  fixtureId: "baseunc-unknown-example",
  traders: [u1, u2, u3],
  fundingEdges: [edge(unknownRoot, u1, 0, 130, "d1")],
  events: [swap(u1, 130, "d2"), swap(u1, 132, "d3"), swap(u2, 131, "d4"), swap(u3, 133, "d5")],
  status: "partial",
  originsTotal: 9,
  taxonomy: routerTaxonomy,
});

export const sampleAnomaly: ReportCertificate = certifyEvidence(identity, anomalyEvidence, undefined, {
  branch: "deeper_funding",
  maxHopsConsidered: 2,
});
export const sampleClean: ReportCertificate = certifyEvidence(identity, cleanEvidence, undefined, {
  branch: "standard",
  maxHopsConsidered: 2,
});
export const sampleUnknown: ReportCertificate = certifyEvidence(identity, unknownEvidence, undefined, {
  branch: "deeper_funding",
  maxHopsConsidered: 2,
});
