import {
  createPublicClient,
  decodeEventLog,
  getAddress,
  http,
  type Address,
  type Hex,
} from "viem";
import { base } from "viem/chains";
import { redactProviderUrl } from "./security.js";

import { BASE_CHAIN_ID } from "./scope.js";

export const BASE_POOL_MANAGER = "0x498581ff718922c3f8e6a244956af099b2652b2b" as Address;
export const DEFAULT_BASE_RPC_URL = "https://mainnet.base.org";
export const DEFAULT_LOG_CHUNK_SIZE = 500;
export const DEFAULT_MAX_EVENTS = 5_000;

export const UNISWAP_V4_SWAP_EVENT = {
  type: "event",
  name: "Swap",
  inputs: [
    { indexed: true, name: "id", type: "bytes32" },
    { indexed: true, name: "sender", type: "address" },
    { indexed: false, name: "amount0", type: "int128" },
    { indexed: false, name: "amount1", type: "int128" },
    { indexed: false, name: "sqrtPriceX96", type: "uint160" },
    { indexed: false, name: "liquidity", type: "uint128" },
    { indexed: false, name: "tick", type: "int24" },
    { indexed: false, name: "fee", type: "uint24" },
  ],
} as const;

export const UNISWAP_V4_SWAP_TOPIC =
  "0x40e9cecb9f5f1f1c5b9c97dec2917b7ee92e57ba5563708daca94dd84ad7112f" as Hex;

export const ERC20_TRANSFER_EVENT = {
  type: "event",
  name: "Transfer",
  inputs: [
    { indexed: true, name: "from", type: "address" },
    { indexed: true, name: "to", type: "address" },
    { indexed: false, name: "value", type: "uint256" },
  ],
} as const;

export const ERC20_TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" as Hex;

export interface RawCanonicalLog {
  address: Address;
  blockNumber: bigint | null;
  blockHash: Hex | null;
  transactionHash: Hex | null;
  logIndex: number | null;
  data: Hex;
  topics: readonly Hex[];
}

export interface RawTransferLog {
  tokenAddress: Address;
  blockNumber: bigint | null;
  blockHash: Hex | null;
  transactionHash: Hex | null;
  logIndex: number | null;
  from: Address;
  to: Address;
  value: bigint;
}

export interface CanonicalBlockHeader {
  number: bigint;
  hash: Hex;
  timestamp: bigint;
}

export interface CanonicalRpcClient {
  getChainId(): Promise<number>;
  getBlock(args: { blockNumber: bigint }): Promise<CanonicalBlockHeader>;
  getTransaction(args: { transactionHash: Hex }): Promise<{ from: Address }>;
  getLogs(args: {
    address: Address;
    fromBlock: bigint;
    toBlock: bigint;
    topics: readonly [Hex, Hex];
  }): Promise<readonly RawCanonicalLog[]>;
  getTransferLogs(args: {
    token: Address;
    fromBlock: bigint;
    toBlock: bigint;
    toAddresses: readonly Address[];
  }): Promise<readonly RawTransferLog[]>;
}

export type CanonicalReadErrorCode =
  | "INVALID_SCOPE"
  | "WRONG_CHAIN"
  | "RPC_UNAVAILABLE"
  | "BLOCK_HASH_MISMATCH"
  | "INVALID_LOG"
  | "EVENT_LIMIT";

export class CanonicalReadError extends Error {
  constructor(
    public readonly code: CanonicalReadErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "CanonicalReadError";
  }
}

export interface NormalizedSwapEvent {
  chainId: typeof BASE_CHAIN_ID;
  poolId: Hex;
  contractAddress: Address;
  blockNumber: number;
  blockHash: Hex;
  transactionHash: Hex;
  logIndex: number;
  sender: Address;
  origin: Address;
  amount0: string;
  amount1: string;
  sqrtPriceX96: string;
  liquidity: string;
  tick: number;
  fee: number;
  source: {
    providerMode: "public_fallback" | "configured";
    rpcUrl: string;
    method: "eth_getLogs";
    originMethod: "eth_getTransactionByHash";
  };
}

export interface CanonicalReadResult {
  chainId: typeof BASE_CHAIN_ID;
  poolId: Hex;
  range: {
    startBlock: number;
    endBlock: number;
    startHash: Hex;
    endHash: Hex;
  };
  providerMode: "public_fallback" | "configured";
  rpcUrl: string;
  rawEventCount: number;
  eventCount: number;
  events: NormalizedSwapEvent[];
}

function asCanonicalError(error: unknown, fallbackMessage: string): CanonicalReadError {
  if (error instanceof CanonicalReadError) return error;
  return new CanonicalReadError("RPC_UNAVAILABLE", fallbackMessage);
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function validateScope(startBlock: number, endBlock: number, maxBlockSpan: number): void {
  if (!Number.isSafeInteger(startBlock) || !Number.isSafeInteger(endBlock)) {
    throw new CanonicalReadError("INVALID_SCOPE", "Block scope must use safe integers.");
  }
  if (startBlock < 0 || endBlock < 0 || startBlock > endBlock) {
    throw new CanonicalReadError("INVALID_SCOPE", "Block scope is invalid.");
  }
  if (endBlock - startBlock + 1 > maxBlockSpan) {
    throw new CanonicalReadError("INVALID_SCOPE", "Block scope exceeds the configured limit.");
  }
}

function validatePoolId(poolId: Hex): Hex {
  if (!/^0x[0-9a-fA-F]{64}$/.test(poolId)) {
    throw new CanonicalReadError("INVALID_SCOPE", "Pool ID must be a 32-byte hex value.");
  }
  return poolId.toLowerCase() as Hex;
}

async function readHeader(
  client: CanonicalRpcClient,
  blockNumber: number,
): Promise<CanonicalBlockHeader> {
  const retryDelays = [0, 250, 750];
  for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
    const delay = retryDelays[attempt] ?? 0;
    if (delay > 0) await wait(delay);
    try {
      const header = await client.getBlock({ blockNumber: BigInt(blockNumber) });
      if (header.number !== BigInt(blockNumber) || !header.hash) {
        throw new CanonicalReadError("BLOCK_HASH_MISMATCH", "Provider returned an inconsistent block header.");
      }
      return header;
    } catch (error) {
      if (error instanceof CanonicalReadError || attempt === retryDelays.length - 1) {
        throw asCanonicalError(error, "Canonical block header could not be read.");
      }
    }
  }
  throw new CanonicalReadError("RPC_UNAVAILABLE", "Canonical block header could not be read.");
}

function normalizeLog(
  rawLog: RawCanonicalLog,
  poolId: Hex,
  providerMode: "public_fallback" | "configured",
  rpcUrl: string,
): NormalizedSwapEvent {
  if (
    rawLog.blockNumber === null ||
    rawLog.blockHash === null ||
    rawLog.transactionHash === null ||
    rawLog.logIndex === null
  ) {
    throw new CanonicalReadError("INVALID_LOG", "Provider returned an event without canonical identity.");
  }

  try {
    const decoded = decodeEventLog({
      abi: [UNISWAP_V4_SWAP_EVENT],
      data: rawLog.data,
      topics: rawLog.topics as [Hex, ...Hex[]],
    });
    if (decoded.eventName !== "Swap") {
      throw new CanonicalReadError("INVALID_LOG", "Provider returned an unsupported event.");
    }

    const args = decoded.args as {
      id: Hex;
      sender: Address;
      amount0: bigint;
      amount1: bigint;
      sqrtPriceX96: bigint;
      liquidity: bigint;
      tick: number;
      fee: number;
    };
    if (args.id.toLowerCase() !== poolId) {
      throw new CanonicalReadError("INVALID_LOG", "Event pool ID does not match the requested pool.");
    }

    return {
      chainId: BASE_CHAIN_ID,
      poolId,
      contractAddress: getAddress(rawLog.address),
      blockNumber: Number(rawLog.blockNumber),
      blockHash: rawLog.blockHash,
      transactionHash: rawLog.transactionHash,
      logIndex: rawLog.logIndex,
      sender: getAddress(args.sender),
      origin: getAddress(args.sender),
      amount0: args.amount0.toString(),
      amount1: args.amount1.toString(),
      sqrtPriceX96: args.sqrtPriceX96.toString(),
      liquidity: args.liquidity.toString(),
      tick: args.tick,
      fee: args.fee,
      source: {
        providerMode,
        rpcUrl: redactProviderUrl(rpcUrl, providerMode),
        method: "eth_getLogs",
        originMethod: "eth_getTransactionByHash",
      },
    };
  } catch (error) {
    if (error instanceof CanonicalReadError) throw error;
    throw new CanonicalReadError("INVALID_LOG", "Provider event could not be decoded.");
  }
}

async function verifyLogBlockHashes(
  client: CanonicalRpcClient,
  events: readonly NormalizedSwapEvent[],
  headers: Map<number, CanonicalBlockHeader>,
): Promise<void> {
  const blockNumbers = [...new Set(events.map((event) => event.blockNumber))].filter(
    (blockNumber) => !headers.has(blockNumber),
  );

  for (let offset = 0; offset < blockNumbers.length; offset += 2) {
    const batch = blockNumbers.slice(offset, offset + 2);
    const batchHeaders = await Promise.all(batch.map((blockNumber) => readHeader(client, blockNumber)));
    for (const header of batchHeaders) {
      headers.set(Number(header.number), header);
    }
  }

  for (const event of events) {
    const header = headers.get(event.blockNumber);
    if (!header || header.hash.toLowerCase() !== event.blockHash.toLowerCase()) {
      throw new CanonicalReadError("BLOCK_HASH_MISMATCH", "Event block hash does not match canonical block data.");
    }
  }
}

async function readTransactionOrigin(
  client: CanonicalRpcClient,
  transactionHash: Hex,
): Promise<Address> {
  const retryDelays = [0, 250, 750];
  for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
    const delay = retryDelays[attempt] ?? 0;
    if (delay > 0) await wait(delay);
    try {
      const transaction = await client.getTransaction({ transactionHash });
      return getAddress(transaction.from);
    } catch (error) {
      if (attempt === retryDelays.length - 1) {
        throw asCanonicalError(error, "Transaction origin could not be read.");
      }
    }
  }
  throw new CanonicalReadError("RPC_UNAVAILABLE", "Transaction origin could not be read.");
}

async function attachTransactionOrigins(
  client: CanonicalRpcClient,
  events: readonly NormalizedSwapEvent[],
): Promise<NormalizedSwapEvent[]> {
  const hashes = [...new Set(events.map((event) => event.transactionHash.toLowerCase()))] as Hex[];
  const origins = new Map<string, Address>();
  for (let offset = 0; offset < hashes.length; offset += 2) {
    const batch = hashes.slice(offset, offset + 2);
    const values = await Promise.all(batch.map((hash) => readTransactionOrigin(client, hash)));
    batch.forEach((hash, index) => origins.set(hash, values[index] as Address));
  }
  return events.map((event) => {
    const origin = origins.get(event.transactionHash.toLowerCase());
    if (!origin) throw new CanonicalReadError("RPC_UNAVAILABLE", "Transaction origin could not be resolved.");
    return {
      ...event,
      origin,
      source: { ...event.source, originMethod: "eth_getTransactionByHash" as const },
    };
  });
}

export async function readUniswapV4Swaps(
  client: CanonicalRpcClient,
  options: {
    poolId: Hex;
    startBlock: number;
    endBlock: number;
    rpcUrl: string;
    providerMode: "public_fallback" | "configured";
    maxBlockSpan?: number;
    chunkSize?: number;
    maxEvents?: number;
  },
): Promise<CanonicalReadResult> {
  const maxBlockSpan = options.maxBlockSpan ?? 10_000;
  const chunkSize = options.chunkSize ?? DEFAULT_LOG_CHUNK_SIZE;
  const maxEvents = options.maxEvents ?? DEFAULT_MAX_EVENTS;
  const poolId = validatePoolId(options.poolId);
  validateScope(options.startBlock, options.endBlock, maxBlockSpan);
  if (!Number.isSafeInteger(chunkSize) || chunkSize < 1) {
    throw new CanonicalReadError("INVALID_SCOPE", "Log chunk size is invalid.");
  }

  let chainId: number;
  try {
    chainId = await client.getChainId();
  } catch (error) {
    throw asCanonicalError(error, "Base chain ID could not be read.");
  }
  if (chainId !== BASE_CHAIN_ID) {
    throw new CanonicalReadError("WRONG_CHAIN", "RPC provider is not connected to Base Mainnet.");
  }

  const startHeader = await readHeader(client, options.startBlock);
  const endHeader = await readHeader(client, options.endBlock);
  const headers = new Map<number, CanonicalBlockHeader>([
    [options.startBlock, startHeader],
    [options.endBlock, endHeader],
  ]);

  const rawLogs: RawCanonicalLog[] = [];
  for (let from = options.startBlock; from <= options.endBlock; from += chunkSize) {
    const to = Math.min(options.endBlock, from + chunkSize - 1);
    try {
      const logs = await client.getLogs({
        address: BASE_POOL_MANAGER,
        fromBlock: BigInt(from),
        toBlock: BigInt(to),
        topics: [UNISWAP_V4_SWAP_TOPIC, poolId],
      });
      rawLogs.push(...logs);
    } catch (error) {
      throw asCanonicalError(error, "Canonical event range could not be read.");
    }
    if (rawLogs.length > maxEvents) {
      throw new CanonicalReadError("EVENT_LIMIT", "Canonical event count exceeds the configured limit.");
    }
  }

  const normalized = rawLogs.map((rawLog) =>
    normalizeLog(rawLog, poolId, options.providerMode, options.rpcUrl),
  );
  const deduplicated = new Map<string, NormalizedSwapEvent>();
  for (const event of normalized) {
    const identity = `${event.chainId}:${event.transactionHash.toLowerCase()}:${event.logIndex}`;
    const previous = deduplicated.get(identity);
    if (previous && previous.blockHash.toLowerCase() !== event.blockHash.toLowerCase()) {
      throw new CanonicalReadError("BLOCK_HASH_MISMATCH", "Duplicate event identity has conflicting block hashes.");
    }
    deduplicated.set(identity, event);
  }

  const sortedEvents = [...deduplicated.values()].sort(
    (left, right) => left.blockNumber - right.blockNumber || left.logIndex - right.logIndex,
  );
  const events = await attachTransactionOrigins(client, sortedEvents);
  await verifyLogBlockHashes(client, events, headers);

  return {
    chainId: BASE_CHAIN_ID,
    poolId,
    range: {
      startBlock: options.startBlock,
      endBlock: options.endBlock,
      startHash: startHeader.hash,
      endHash: endHeader.hash,
    },
    providerMode: options.providerMode,
    rpcUrl: options.rpcUrl,
    rawEventCount: rawLogs.length,
    eventCount: events.length,
    events,
  };
}

export function createBaseRpcClient(rpcUrl = process.env.BASE_RPC_URL ?? DEFAULT_BASE_RPC_URL): CanonicalRpcClient {
  const client = createPublicClient({ chain: base, transport: http(rpcUrl) });
  return {
    getChainId: () => client.getChainId(),
    async getBlock({ blockNumber }) {
      const block = await client.getBlock({ blockNumber });
      if (!block.hash) throw new CanonicalReadError("RPC_UNAVAILABLE", "Provider returned a block without a hash.");
      return { number: block.number, hash: block.hash, timestamp: block.timestamp };
    },
    async getTransaction({ transactionHash }) {
      const transaction = await client.getTransaction({ hash: transactionHash });
      return { from: getAddress(transaction.from) };
    },
    async getLogs({ address, fromBlock, toBlock, topics }) {
      return (await client.getLogs({
        address,
        fromBlock,
        toBlock,
        event: UNISWAP_V4_SWAP_EVENT,
        args: { id: topics[1] },
      })) as unknown as readonly RawCanonicalLog[];
    },
    async getTransferLogs({ token, fromBlock, toBlock, toAddresses }) {
      const logs = await client.getLogs({
        address: token,
        fromBlock,
        toBlock,
        event: ERC20_TRANSFER_EVENT,
        args: { to: [...toAddresses] },
      });
      return logs.map((log) => ({
        tokenAddress: getAddress(log.address),
        blockNumber: log.blockNumber,
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        from: getAddress(log.args.from as Address),
        to: getAddress(log.args.to as Address),
        value: (log.args.value as bigint | undefined) ?? 0n,
      }));
    },
  };
}

export async function readBaseUniswapV4Swaps(options: {
  poolId: Hex;
  startBlock: number;
  endBlock: number;
  maxBlockSpan?: number;
  chunkSize?: number;
  maxEvents?: number;
}): Promise<CanonicalReadResult> {
  const rpcUrl = process.env.BASE_RPC_URL ?? DEFAULT_BASE_RPC_URL;
  return readUniswapV4Swaps(createBaseRpcClient(rpcUrl), {
    ...options,
    rpcUrl,
    providerMode: rpcUrl === DEFAULT_BASE_RPC_URL ? "public_fallback" : "configured",
  });
}
