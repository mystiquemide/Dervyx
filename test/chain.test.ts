import assert from "node:assert/strict";
import test from "node:test";
import { encodeAbiParameters, type Address, type Hex } from "viem";
import {
  BASE_POOL_MANAGER,
  CanonicalReadError,
  type CanonicalBlockHeader,
  type CanonicalRpcClient,
  type RawCanonicalLog,
  type RawTransferLog,
  UNISWAP_V4_SWAP_TOPIC,
  readUniswapV4Swaps,
} from "../src/chain.js";
import { BASE_CHAIN_ID } from "../src/scope.js";

const poolId = "0x1ee8db5e1df2386aa078cf866b83d90ca559757b4c98276694f5d7698c3570d8" as Hex;
const sender = "0x01104DF70F98EB61b8391f28DC7BA252698e4340" as Address;
const dataTypes = [
  { type: "int128" },
  { type: "int128" },
  { type: "uint160" },
  { type: "uint128" },
  { type: "int24" },
  { type: "uint24" },
] as const;

function hashFor(block: number): Hex {
  return `0x${block.toString(16).padStart(64, "0")}` as Hex;
}

function transactionHashFor(index: number): Hex {
  return `0x${index.toString(16).padStart(64, "0")}` as Hex;
}

function makeLog(blockNumber: number, index: number, duplicate = false): RawCanonicalLog {
  const senderTopic = `0x${sender.slice(2).toLowerCase().padStart(64, "0")}` as Hex;
  return {
    address: BASE_POOL_MANAGER,
    blockNumber: BigInt(blockNumber),
    blockHash: hashFor(blockNumber),
    transactionHash: transactionHashFor(index),
    logIndex: index,
    data: encodeAbiParameters(dataTypes, [-10n, 8n, 1n, 2n, -1, 3000]),
    topics: [UNISWAP_V4_SWAP_TOPIC, poolId, senderTopic],
  };
}

class FakeRpcClient implements CanonicalRpcClient {
  public readonly logCalls: Array<{ fromBlock: bigint; toBlock: bigint }> = [];
  public chainId: number = BASE_CHAIN_ID;
  public mismatchBlock: number | undefined;
  public failLogs = false;
  public transactionFailuresRemaining = 0;
  public transactionCalls = 0;

  constructor(private readonly logs: readonly RawCanonicalLog[]) {}

  async getChainId(): Promise<number> {
    return this.chainId;
  }

  async getTransaction(): Promise<{ from: Address }> {
    this.transactionCalls += 1;
    if (this.transactionFailuresRemaining > 0) {
      this.transactionFailuresRemaining -= 1;
      throw new Error("simulated transient transaction lookup failure");
    }
    return { from: sender };
  }

  async getBlock({ blockNumber }: { blockNumber: bigint }): Promise<CanonicalBlockHeader> {
    const number = Number(blockNumber);
    return {
      number: blockNumber,
      hash: this.mismatchBlock === number ? hashFor(number + 1) : hashFor(number),
      timestamp: 1_787_032_000n + BigInt(number),
    };
  }

  async getLogs(args: {
    address: Address;
    fromBlock: bigint;
    toBlock: bigint;
    topics: readonly [Hex, Hex];
  }): Promise<readonly RawCanonicalLog[]> {
    this.logCalls.push({ fromBlock: args.fromBlock, toBlock: args.toBlock });
    if (this.failLogs) throw new Error("simulated provider failure");
    return this.logs.filter(
      (log) =>
        log.blockNumber !== null &&
        log.blockNumber >= args.fromBlock &&
        log.blockNumber <= args.toBlock,
    );
  }

  async getTransferLogs(): Promise<readonly RawTransferLog[]> {
    return [];
  }
}

function readOptions(overrides: Partial<Parameters<typeof readUniswapV4Swaps>[1]> = {}) {
  return {
    poolId,
    startBlock: 100,
    endBlock: 104,
    rpcUrl: "https://mainnet.base.org",
    providerMode: "public_fallback" as const,
    chunkSize: 2,
    ...overrides,
  };
}

test("splits ranges, deduplicates event identity, and preserves source fields", async () => {
  const client = new FakeRpcClient([makeLog(100, 1), makeLog(102, 2), makeLog(102, 2, true)]);
  const result = await readUniswapV4Swaps(client, readOptions());

  assert.equal(client.logCalls.length, 3);
  assert.deepEqual(client.logCalls.map((call) => [Number(call.fromBlock), Number(call.toBlock)]), [
    [100, 101],
    [102, 103],
    [104, 104],
  ]);
  assert.equal(result.rawEventCount, 3);
  assert.equal(result.eventCount, 2);
  assert.equal(result.providerMode, "public_fallback");
  assert.equal(result.events[0]?.chainId, BASE_CHAIN_ID);
  assert.equal(result.events[0]?.origin, sender);
  assert.equal(result.events[0]?.source.method, "eth_getLogs");
  assert.equal(result.events[0]?.source.rpcUrl, "https://mainnet.base.org");
  assert.equal(result.events[0]?.amount0, "-10");
});

test("retries transient transaction-origin reads before failing", async () => {
  const client = new FakeRpcClient([makeLog(100, 1)]);
  client.transactionFailuresRemaining = 1;
  const result = await readUniswapV4Swaps(client, readOptions());

  assert.equal(result.events[0]?.origin, sender);
  assert.equal(client.transactionCalls, 2);
});

test("fails closed on a non-Base chain", async () => {
  const client = new FakeRpcClient([]);
  client.chainId = 1;
  await assert.rejects(
    readUniswapV4Swaps(client, readOptions()),
    (error: unknown) => error instanceof CanonicalReadError && error.code === "WRONG_CHAIN",
  );
});

test("fails closed when an event block hash disagrees with canonical block data", async () => {
  const client = new FakeRpcClient([makeLog(102, 2)]);
  client.mismatchBlock = 102;
  await assert.rejects(
    readUniswapV4Swaps(client, readOptions()),
    (error: unknown) => error instanceof CanonicalReadError && error.code === "BLOCK_HASH_MISMATCH",
  );
});

test("turns provider failures into a typed retryable boundary error", async () => {
  const client = new FakeRpcClient([makeLog(100, 1)]);
  client.failLogs = true;
  await assert.rejects(
    readUniswapV4Swaps(client, readOptions()),
    (error: unknown) => error instanceof CanonicalReadError && error.code === "RPC_UNAVAILABLE",
  );
});

test("fails closed on an unsupported event payload", async () => {
  const invalidLog = { ...makeLog(100, 1), data: "0x" as Hex };
  const client = new FakeRpcClient([invalidLog]);
  await assert.rejects(
    readUniswapV4Swaps(client, readOptions()),
    (error: unknown) => error instanceof CanonicalReadError && error.code === "INVALID_LOG",
  );
});

test("fails closed when the event cap is exceeded", async () => {
  const client = new FakeRpcClient([makeLog(100, 1), makeLog(102, 2)]);
  await assert.rejects(
    readUniswapV4Swaps(client, readOptions({ maxEvents: 1 })),
    (error: unknown) => error instanceof CanonicalReadError && error.code === "EVENT_LIMIT",
  );
});
