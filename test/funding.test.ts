import assert from "node:assert/strict";
import test from "node:test";
import type { Address, Hex } from "viem";
import type { CanonicalRpcClient } from "../src/chain.js";
import { readCanonicalErc20Funding, readNativeFundingTransfers } from "../src/funding.js";

const origin = "0x1111111111111111111111111111111111111111" as Address;
const root = "0x2222222222222222222222222222222222222222" as Address;
const blockHash = `0x${"aa".repeat(32)}` as Hex;
const transactionHash = `0x${"bb".repeat(32)}` as Hex;

const client = {
  async getChainId() {
    return 8453;
  },
  async getBlock() {
    return { number: 90n, hash: blockHash, timestamp: 1_787_032_000n };
  },
  async getTransaction() {
    return { from: origin };
  },
  async getLogs() {
    return [];
  },
  async getTransferLogs() {
    return [];
  },
} as CanonicalRpcClient;

async function withFetch(
  handler: (url: string) => Response,
  fn: () => Promise<void>,
): Promise<void> {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => handler(String(input));
  try {
    await fn();
  } finally {
    globalThis.fetch = original;
  }
}

test("reads bounded native funding transfers with source provenance", async () => {
  await withFetch(
    () =>
      new Response(
        JSON.stringify({
          items: [
            {
              block_number: 90,
              transaction_hash: transactionHash,
              index: 4,
              from: { hash: root },
              to: { hash: origin },
              value: "12345",
              error: null,
              success: true,
            },
            {
              block_number: 120,
              transaction_hash: `0x${"cc".repeat(32)}`,
              index: 5,
              from: { hash: root },
              to: { hash: origin },
              value: "999",
              error: null,
              success: true,
            },
          ],
          next_page_params: null,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    async () => {
      const result = await readNativeFundingTransfers({
        client,
        origins: [{ address: origin, beforeBlock: 100, observedSwapCount: 3 }],
        apiBase: "https://base.blockscout.com/api/v2",
      });
      assert.equal(result.errors.length, 0);
      assert.equal(result.originsWithEdges, 1);
      assert.equal(result.edges.length, 1);
      assert.equal(result.edges[0]?.from, root);
      assert.equal(result.edges[0]?.sourceType, "native_internal");
      assert.equal(result.edges[0]?.sourceUrl, "https://base.blockscout.com/api/v2/addresses/0x1111111111111111111111111111111111111111/internal-transactions?filter=to");
      assert.equal(result.edges[0]?.logIndex, 4);
    },
  );
});

test("reports Blockscout failure per origin without fabricating edges", async () => {
  await withFetch(
    () => new Response("unavailable", { status: 503 }),
    async () => {
      const result = await readNativeFundingTransfers({
        client,
        origins: [{ address: origin, beforeBlock: 100, observedSwapCount: 1 }],
        maxPagesPerOrigin: 1,
      });
      assert.equal(result.edges.length, 0);
      assert.equal(result.errors.length, 1);
      assert.equal(result.errors[0]?.code, "FUNDING_PROVIDER_UNAVAILABLE");
    },
  );
});

test("reads allowed ERC-20 funding transfers with canonical block provenance", async () => {
  const allowedToken = "0x5555555555555555555555555555555555555555" as Address;
  await withFetch(
    (url) => {
      if (url.includes("/token-transfers")) {
        return new Response(
          JSON.stringify({
            items: [{
              block_hash: blockHash,
              block_number: 90,
              from: { hash: root },
              to: { hash: origin },
              token: { address_hash: allowedToken },
              total: { value: "777" },
              transaction_hash: transactionHash,
              log_index: 9,
            }],
            next_page_params: null,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ items: [], next_page_params: null }), { status: 200 });
    },
    async () => {
      const result = await readNativeFundingTransfers({
        client,
        origins: [{ address: origin, beforeBlock: 100, observedSwapCount: 1 }],
        erc20TokenAddresses: [allowedToken],
      });
      assert.equal(result.sourceMode, "blockscout_internal_and_erc20");
      assert.equal(result.errors.length, 0);
      assert.equal(result.edges.length, 1);
      assert.equal(result.edges[0]?.sourceType, "erc20_transfer");
      assert.equal(result.edges[0]?.token, allowedToken);
      assert.equal(result.edges[0]?.logIndex, 9);
    },
  );
});

test("reads canonical ERC-20 funding via RPC with source-linked, block-verified edges", async () => {
  const token = "0x5555555555555555555555555555555555555555" as Address;
  const rpcClient = {
    async getChainId() {
      return 8453;
    },
    async getBlock() {
      return { number: 90n, hash: blockHash, timestamp: 1_787_032_000n };
    },
    async getTransaction() {
      return { from: origin };
    },
    async getLogs() {
      return [];
    },
    async getTransferLogs() {
      return [
        // Valid pre-swap funding transfer into the origin.
        { tokenAddress: token, blockNumber: 90n, blockHash, transactionHash, logIndex: 7, from: root, to: origin, value: 4200n },
        // After the origin's first swap block -> excluded.
        { tokenAddress: token, blockNumber: 130n, blockHash, transactionHash: `0x${"cc".repeat(32)}` as Hex, logIndex: 8, from: root, to: origin, value: 10n },
        // Self-transfer -> excluded.
        { tokenAddress: token, blockNumber: 88n, blockHash, transactionHash: `0x${"dd".repeat(32)}` as Hex, logIndex: 9, from: origin, to: origin, value: 5n },
      ];
    },
  } as CanonicalRpcClient;

  const result = await readCanonicalErc20Funding({
    client: rpcClient,
    rpcUrl: "https://mainnet.base.org",
    origins: [{ address: origin, beforeBlock: 100, observedSwapCount: 3 }],
    tokenAddresses: [token],
    endBlock: 100,
    lookbackBlocks: 50,
    chunkSize: 500,
  });

  assert.equal(result.sourceMode, "canonical_erc20");
  assert.equal(result.errors.length, 0);
  assert.equal(result.edges.length, 1);
  assert.equal(result.originsWithEdges, 1);
  assert.equal(result.edges[0]?.sourceType, "erc20_transfer");
  assert.equal(result.edges[0]?.from, root);
  assert.equal(result.edges[0]?.token, token);
  assert.equal(result.edges[0]?.amount, "4200");
  assert.equal(result.edges[0]?.blockHash, blockHash);
  assert.equal(result.edges[0]?.sourceUrl, `https://basescan.org/tx/${transactionHash}`);
});

test("records a canonical ERC-20 provider error without fabricating edges", async () => {
  const token = "0x5555555555555555555555555555555555555555" as Address;
  const rpcClient = {
    async getChainId() {
      return 8453;
    },
    async getBlock() {
      return { number: 90n, hash: blockHash, timestamp: 1_787_032_000n };
    },
    async getTransaction() {
      return { from: origin };
    },
    async getLogs() {
      return [];
    },
    async getTransferLogs() {
      throw new Error("simulated canonical rpc failure");
    },
  } as CanonicalRpcClient;

  const result = await readCanonicalErc20Funding({
    client: rpcClient,
    rpcUrl: "https://mainnet.base.org",
    origins: [{ address: origin, beforeBlock: 100, observedSwapCount: 1 }],
    tokenAddresses: [token],
    endBlock: 100,
    lookbackBlocks: 50,
    chunkSize: 500,
  });

  assert.equal(result.edges.length, 0);
  assert.equal(result.originsWithEdges, 0);
  assert.ok(result.errors.length >= 1);
  assert.equal(result.errors[0]?.code, "FUNDING_PROVIDER_UNAVAILABLE");
});
