import assert from "node:assert/strict";
import test from "node:test";
import type { Address, Hex } from "viem";
import {
  buildFundingGraph,
  GraphError,
  StaticRootTaxonomy,
  type FundingEdge,
} from "../src/graph.js";

const trader = "0x1111111111111111111111111111111111111111" as Address;
const funder = "0x2222222222222222222222222222222222222222" as Address;
const exchangeRoot = "0x3333333333333333333333333333333333333333" as Address;
const unknownRoot = "0x4444444444444444444444444444444444444444" as Address;
const token = "0x5555555555555555555555555555555555555555" as Address;
const chainId = 8453;

function edge(
  from: Address,
  to: Address,
  index: number,
  blockNumber: number,
  transactionHash: Hex,
): FundingEdge {
  return {
    chainId,
    from,
    to,
    token,
    amount: "1000000",
    blockNumber,
    blockHash: `0x${blockNumber.toString(16).padStart(64, "0")}` as Hex,
    transactionHash,
    logIndex: index,
    sourceType: "native_internal",
    sourceUrl: `https://base.blockscout.com/tx/${transactionHash}`,
  };
}

const taxonomy = new StaticRootTaxonomy("roots-v1", [
  {
    address: exchangeRoot,
    class: "exchange",
    label: "Example exchange root",
    source: "https://example.invalid/root-source",
  },
]);

test("reproduces a deterministic two-hop path and segregates a known root", () => {
  const edges = [
    edge(exchangeRoot, funder, 0, 100, `0x${"aa".repeat(32)}`),
    edge(funder, trader, 1, 101, `0x${"bb".repeat(32)}`),
  ];
  const first = buildFundingGraph({ chainId, traders: [trader], fundingEdges: edges, taxonomy });
  const second = buildFundingGraph({ chainId, traders: [trader], fundingEdges: [...edges].reverse(), taxonomy });

  assert.deepEqual(first, second);
  assert.equal(first.maxHops, 2);
  assert.equal(first.edges.length, 2);
  assert.equal(first.paths.length, 1);
  assert.equal(first.paths[0]?.root.class, "exchange");
  assert.equal(first.paths[0]?.root.label, "Example exchange root");
  assert.equal(first.paths[0]?.hopCount, 2);
  assert.equal(first.paths[0]?.hops[0]?.to.toLowerCase(), trader.toLowerCase());
  assert.equal(first.paths[0]?.hops[1]?.from.toLowerCase(), exchangeRoot.toLowerCase());
  assert.equal(first.truncated, false);
  assert.equal(first.components.length, 1);
});

test("deduplicates identical event identity without inflating edges or paths", () => {
  const funding = edge(funder, trader, 1, 101, `0x${"bb".repeat(32)}`);
  const graph = buildFundingGraph({
    chainId,
    traders: [trader],
    fundingEdges: [funding, { ...funding }, edge(unknownRoot, funder, 0, 100, `0x${"cc".repeat(32)}`)],
    taxonomy,
  });

  assert.equal(graph.edges.length, 2);
  assert.equal(graph.paths.length, 1);
  assert.equal(graph.paths[0]?.root.address.toLowerCase(), unknownRoot.toLowerCase());
  assert.equal(graph.paths[0]?.root.class, "unknown");
  assert.equal(graph.paths[0]?.cycleDetected, false);
});

test("keeps unknown roots visible and marks truncated edge sets", () => {
  const graph = buildFundingGraph({
    chainId,
    traders: [trader],
    fundingEdges: [edge(unknownRoot, trader, 0, 100, `0x${"dd".repeat(32)}`)],
    taxonomy,
    maxEdges: 1,
  });

  assert.equal(graph.paths[0]?.root.class, "unknown");
  assert.equal(graph.paths[0]?.root.address.toLowerCase(), unknownRoot.toLowerCase());
  assert.equal(graph.truncated, false);

  const truncated = buildFundingGraph({
    chainId,
    traders: [trader],
    fundingEdges: [
      edge(funder, trader, 1, 101, `0x${"bb".repeat(32)}`),
      edge(unknownRoot, funder, 0, 100, `0x${"cc".repeat(32)}`),
    ],
    taxonomy,
    maxEdges: 1,
  });
  assert.equal(truncated.truncated, true);
  assert.equal(truncated.truncationReason, "funding-edge-cap:1");
});

test("rejects conflicting duplicate identity and non-two-hop configuration", () => {
  const original = edge(funder, trader, 1, 101, `0x${"bb".repeat(32)}`);
  const conflict = { ...original, amount: "2000000" };
  assert.throws(
    () => buildFundingGraph({ chainId, traders: [trader], fundingEdges: [original, conflict], taxonomy }),
    (error: unknown) => error instanceof GraphError && error.code === "CONFLICTING_EDGE",
  );
  assert.throws(
    () => buildFundingGraph({ chainId, traders: [trader], fundingEdges: [], taxonomy, maxHops: 3 }),
    (error: unknown) => error instanceof GraphError && error.code === "INVALID_EDGE",
  );
});
