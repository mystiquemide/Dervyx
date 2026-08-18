import { getAddress, type Address, type Hex } from "viem";

import type { CanonicalRpcClient, RawTransferLog } from "./chain.js";
import type { FundingEdge } from "./graph.js";

export const DEFAULT_BLOCKSCOUT_API = "https://base.blockscout.com/api/v2";
export const DEFAULT_FUNDING_LOOKBACK_BLOCKS = 10_000;
const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000" as Address;

export interface FundingOriginQuery {
  address: Address;
  beforeBlock: number;
  observedSwapCount: number;
}

export interface FundingSourceError {
  address: Address;
  code: "FUNDING_PROVIDER_UNAVAILABLE" | "INVALID_FUNDING_RECORD";
  message: string;
}

export interface FundingReadResult {
  sourceMode: "blockscout_internal" | "blockscout_internal_and_erc20";
  apiBase: string;
  originsRequested: number;
  erc20OriginsRequested: number;
  originsWithEdges: number;
  edges: FundingEdge[];
  errors: FundingSourceError[];
  pagesRead: number;
}

interface BlockscoutInternalTransaction {
  block_number?: number;
  transaction_hash?: string;
  index?: number;
  from?: { hash?: string };
  to?: { hash?: string };
  value?: string;
  error?: string | null;
  success?: boolean;
}

interface BlockscoutPage {
  items?: BlockscoutInternalTransaction[];
  next_page_params?: Record<string, string | number> | null;
}

interface BlockscoutTokenTransfer {
  block_hash?: string;
  block_number?: number;
  from?: { hash?: string };
  to?: { hash?: string };
  token?: { address_hash?: string };
  total?: { value?: string };
  transaction_hash?: string;
  log_index?: number;
}

interface BlockscoutTokenTransferPage {
  items?: BlockscoutTokenTransfer[];
  next_page_params?: Record<string, string | number> | null;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function normalizeHash(value: string): Hex {
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) throw new Error("invalid transaction hash");
  return value.toLowerCase() as Hex;
}

async function canonicalBlock(
  client: CanonicalRpcClient,
  blockNumber: number,
  expectedHash: string | undefined,
  cache: Map<number, Hex>,
): Promise<Hex> {
  const cached = cache.get(blockNumber);
  if (cached) {
    if (expectedHash && cached.toLowerCase() !== expectedHash.toLowerCase()) throw new Error("funding block hash mismatch");
    return cached;
  }
  const block = await client.getBlock({ blockNumber: BigInt(blockNumber) });
  if (!block.hash) throw new Error("funding block has no hash");
  if (expectedHash && block.hash.toLowerCase() !== expectedHash.toLowerCase()) throw new Error("funding block hash mismatch");
  cache.set(blockNumber, block.hash);
  return block.hash;
}

function pageUrl(apiBase: string, address: Address, params?: Record<string, string | number>): string {
  const url = new URL(`${apiBase}/addresses/${address}/internal-transactions`);
  url.searchParams.set("filter", "to");
  for (const [key, value] of Object.entries(params ?? {})) url.searchParams.set(key, String(value));
  return url.toString();
}

function tokenTransferPageUrl(apiBase: string, address: Address, params?: Record<string, string | number>, tokenAddress?: Address): string {
  const url = new URL(`${apiBase}/addresses/${address}/token-transfers`);
  url.searchParams.set("filter", "to");
  if (tokenAddress) url.searchParams.set("token", tokenAddress);
  for (const [key, value] of Object.entries(params ?? {})) url.searchParams.set(key, String(value));
  return url.toString();
}

async function fetchPage(url: string): Promise<BlockscoutPage> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "Dervyx-P3-readonly/1.0",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") throw new Error("invalid JSON object");
    return payload as BlockscoutPage;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchTokenTransferPage(url: string): Promise<BlockscoutTokenTransferPage> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "Dervyx-P3-readonly/1.0",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") throw new Error("invalid JSON object");
    return payload as BlockscoutTokenTransferPage;
  } finally {
    clearTimeout(timeout);
  }
}

async function readOriginEdges(
  client: CanonicalRpcClient,
  origin: FundingOriginQuery,
  apiBase: string,
  maxPages: number,
  maxEdges: number,
  blockCache: Map<number, Hex>,
): Promise<{ edges: FundingEdge[]; pagesRead: number }> {
  const edges: FundingEdge[] = [];
  let params: Record<string, string | number> | undefined;
  let pagesRead = 0;
  const sourceUrl = pageUrl(apiBase, origin.address);

  for (let page = 0; page < maxPages && edges.length < maxEdges; page += 1) {
    const payload = await fetchPage(pageUrl(apiBase, origin.address, params));
    pagesRead += 1;
    for (const item of payload.items ?? []) {
      if (edges.length >= maxEdges) break;
      const fromHash = item.from?.hash;
      const toHash = item.to?.hash;
      const transactionHash = item.transaction_hash;
      const blockNumber = item.block_number;
      const index = item.index;
      const value = item.value;
      if (!fromHash || !toHash || !transactionHash || blockNumber === undefined || index === undefined || !value) {
        continue;
      }
      if (toHash.toLowerCase() !== origin.address.toLowerCase()) continue;
      if (fromHash.toLowerCase() === origin.address.toLowerCase()) continue;
      if (blockNumber > origin.beforeBlock || value === "0" || item.error || item.success === false) continue;

      const blockHash = await canonicalBlock(client, blockNumber, undefined, blockCache);
      edges.push({
        chainId: 8453,
        from: getAddress(fromHash),
        to: getAddress(toHash),
        token: NATIVE_TOKEN,
        amount: value,
        blockNumber,
        blockHash,
        transactionHash: normalizeHash(transactionHash),
        logIndex: index,
        sourceType: "native_internal",
        sourceUrl,
      });
    }
    if (!payload.next_page_params) break;
    params = payload.next_page_params;
  }
  return { edges, pagesRead };
}

async function readOriginTokenEdges(
  client: CanonicalRpcClient,
  origin: FundingOriginQuery,
  tokenAddresses: readonly Address[],
  apiBase: string,
  maxPages: number,
  maxEdges: number,
  blockCache: Map<number, Hex>,
): Promise<{ edges: FundingEdge[]; pagesRead: number }> {
  const allowedTokens = new Set(tokenAddresses.map((address) => address.toLowerCase()));
  const edges: FundingEdge[] = [];
  let params: Record<string, string | number> | undefined;
  let pagesRead = 0;

  for (const tokenAddress of tokenAddresses) {
    params = undefined;
    for (let page = 0; page < maxPages && edges.length < maxEdges; page += 1) {
      const payload = await fetchTokenTransferPage(tokenTransferPageUrl(apiBase, origin.address, params, tokenAddress));
      pagesRead += 1;
      for (const item of payload.items ?? []) {
        if (edges.length >= maxEdges) break;
        const fromHash = item.from?.hash;
        const toHash = item.to?.hash;
        const tokenHash = item.token?.address_hash;
        const amount = item.total?.value;
        const transactionHash = item.transaction_hash;
        const blockHash = item.block_hash;
        const blockNumber = item.block_number;
        const logIndex = item.log_index;
        if (!fromHash || !toHash || !tokenHash || !amount || !transactionHash || !blockHash || blockNumber === undefined || logIndex === undefined) {
          continue;
        }
        if (toHash.toLowerCase() !== origin.address.toLowerCase()) continue;
        if (fromHash.toLowerCase() === origin.address.toLowerCase()) continue;
        if (!allowedTokens.has(tokenHash.toLowerCase()) || blockNumber > origin.beforeBlock || amount === "0") continue;

        const canonicalHash = await canonicalBlock(client, blockNumber, blockHash, blockCache);
        edges.push({
          chainId: 8453,
          from: getAddress(fromHash),
          to: getAddress(toHash),
          token: getAddress(tokenHash),
          amount,
          blockNumber,
          blockHash: canonicalHash,
          transactionHash: normalizeHash(transactionHash),
          logIndex,
          sourceType: "erc20_transfer",
          sourceUrl: tokenTransferPageUrl(apiBase, origin.address, undefined, tokenAddress),
        });
      }
      if (!payload.next_page_params) break;
      params = payload.next_page_params;
    }
  }
  return { edges, pagesRead };
}

export async function readNativeFundingTransfers(options: {
  client: CanonicalRpcClient;
  origins: readonly FundingOriginQuery[];
  apiBase?: string;
  maxOrigins?: number;
  maxPagesPerOrigin?: number;
  maxEdgesPerOrigin?: number;
  erc20TokenAddresses?: readonly Address[];
  erc20MaxOrigins?: number;
  erc20MaxPagesPerOrigin?: number;
}): Promise<FundingReadResult> {
  const apiBase = options.apiBase ?? DEFAULT_BLOCKSCOUT_API;
  const maxOrigins = options.maxOrigins ?? 30;
  const maxPagesPerOrigin = options.maxPagesPerOrigin ?? 3;
  const maxEdgesPerOrigin = options.maxEdgesPerOrigin ?? 50;
  const erc20MaxOrigins = options.erc20MaxOrigins ?? 10;
  const erc20MaxPagesPerOrigin = options.erc20MaxPagesPerOrigin ?? 2;
  const origins = [...options.origins]
    .sort((left, right) => right.observedSwapCount - left.observedSwapCount || left.address.toLowerCase().localeCompare(right.address.toLowerCase()))
    .slice(0, maxOrigins);
  const edges: FundingEdge[] = [];
  const errors: FundingSourceError[] = [];
  const blockCache = new Map<number, Hex>();
  const erc20OriginSet = new Set(origins.slice(0, erc20MaxOrigins).map((origin) => origin.address.toLowerCase()));
  let pagesRead = 0;
  let originsWithEdges = 0;

  for (let offset = 0; offset < origins.length; offset += 4) {
    const batch = origins.slice(offset, offset + 4);
    const results = await Promise.all(batch.map(async (origin) => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const native = await readOriginEdges(options.client, origin, apiBase, maxPagesPerOrigin, maxEdgesPerOrigin, blockCache);
          let token = { edges: [] as FundingEdge[], pagesRead: 0 };
          let tokenError: FundingSourceError | undefined;
          if (options.erc20TokenAddresses?.length && erc20OriginSet.has(origin.address.toLowerCase())) {
            try {
              token = await readOriginTokenEdges(options.client, origin, options.erc20TokenAddresses, apiBase, erc20MaxPagesPerOrigin, maxEdgesPerOrigin, blockCache);
            } catch {
              tokenError = {
                address: origin.address,
                code: "FUNDING_PROVIDER_UNAVAILABLE",
                message: "ERC-20 funding source could not be read from Blockscout; native funding was retained.",
              };
            }
          }
          return {
            origin,
            result: {
              edges: [...native.edges, ...token.edges],
              pagesRead: native.pagesRead + token.pagesRead,
            },
            sourceErrors: tokenError ? [tokenError] : [],
          };
        } catch (error) {
          if (attempt === 1) {
            return {
              origin,
              error: {
                address: origin.address,
                code: "FUNDING_PROVIDER_UNAVAILABLE" as const,
                message: "Funding source could not be read from Blockscout.",
              },
            };
          }
          await wait(250);
        }
      }
      return { origin, error: { address: origin.address, code: "FUNDING_PROVIDER_UNAVAILABLE" as const, message: "Funding source could not be read from Blockscout." } };
    }));
    for (const item of results) {
      if ("error" in item) {
        errors.push(item.error);
        continue;
      }
      pagesRead += item.result.pagesRead;
      if (item.result.edges.length > 0) originsWithEdges += 1;
      edges.push(...item.result.edges);
      errors.push(...item.sourceErrors);
    }
  }

  return {
    sourceMode: options.erc20TokenAddresses?.length ? "blockscout_internal_and_erc20" : "blockscout_internal",
    apiBase,
    originsRequested: origins.length,
    erc20OriginsRequested: erc20OriginSet.size,
    originsWithEdges,
    edges,
    errors,
    pagesRead,
  };
}

export interface CanonicalFundingResult {
  sourceMode: "canonical_erc20";
  rpcUrl: string;
  tokensQueried: number;
  originsRequested: number;
  originsWithEdges: number;
  chunksRead: number;
  edges: FundingEdge[];
  errors: FundingSourceError[];
}

/**
 * Reads ERC-20 funding transfers straight from canonical `eth_getLogs`, independent of Blockscout.
 * The lookback window is bounded and each surviving edge is verified against canonical block data,
 * so a provider outage yields recorded errors rather than fabricated or zeroed coverage.
 */
export async function readCanonicalErc20Funding(options: {
  client: CanonicalRpcClient;
  rpcUrl: string;
  origins: readonly FundingOriginQuery[];
  tokenAddresses: readonly Address[];
  endBlock: number;
  lookbackBlocks?: number;
  maxOrigins?: number;
  chunkSize?: number;
  maxEdges?: number;
}): Promise<CanonicalFundingResult> {
  const maxOrigins = options.maxOrigins ?? 30;
  const lookbackBlocks = options.lookbackBlocks ?? DEFAULT_FUNDING_LOOKBACK_BLOCKS;
  const chunkSize = options.chunkSize ?? 500;
  const maxEdges = options.maxEdges ?? 5_000;
  const rpcUrl = options.rpcUrl;

  const origins = [...options.origins]
    .sort((left, right) => right.observedSwapCount - left.observedSwapCount || left.address.toLowerCase().localeCompare(right.address.toLowerCase()))
    .slice(0, maxOrigins);
  const edges: FundingEdge[] = [];
  const errors: FundingSourceError[] = [];
  const seen = new Set<string>();
  const originsWithEdges = new Set<string>();
  const blockCache = new Map<number, Hex>();
  let chunksRead = 0;

  if (origins.length === 0 || options.tokenAddresses.length === 0) {
    return { sourceMode: "canonical_erc20", rpcUrl, tokensQueried: options.tokenAddresses.length, originsRequested: origins.length, originsWithEdges: 0, chunksRead, edges, errors };
  }

  const beforeByOrigin = new Map<string, number>();
  const originSet = new Set<string>();
  const toAddresses: Address[] = [];
  for (const origin of origins) {
    const key = origin.address.toLowerCase();
    beforeByOrigin.set(key, origin.beforeBlock);
    originSet.add(key);
    toAddresses.push(origin.address);
  }

  const toBlock = options.endBlock;
  const fromBlock = Math.max(0, options.endBlock - lookbackBlocks + 1);
  if (!Number.isSafeInteger(toBlock) || toBlock < 0 || fromBlock > toBlock) {
    errors.push({ address: origins[0]!.address, code: "INVALID_FUNDING_RECORD", message: "Canonical funding window is invalid." });
    return { sourceMode: "canonical_erc20", rpcUrl, tokensQueried: options.tokenAddresses.length, originsRequested: origins.length, originsWithEdges: 0, chunksRead, edges, errors };
  }

  for (const tokenAddress of options.tokenAddresses) {
    const token = getAddress(tokenAddress);
    for (let from = fromBlock; from <= toBlock && edges.length < maxEdges; from += chunkSize) {
      const to = Math.min(toBlock, from + chunkSize - 1);
      let logs: readonly RawTransferLog[] | undefined;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          logs = await options.client.getTransferLogs({ token, fromBlock: BigInt(from), toBlock: BigInt(to), toAddresses });
          break;
        } catch {
          if (attempt === 1) {
            errors.push({
              address: token,
              code: "FUNDING_PROVIDER_UNAVAILABLE",
              message: `Canonical ERC-20 transfer logs could not be read for ${token} in blocks ${from}-${to}.`,
            });
          } else {
            await wait(250);
          }
        }
      }
      chunksRead += 1;
      if (!logs) continue;

      for (const log of logs) {
        if (edges.length >= maxEdges) break;
        if (log.blockNumber === null || log.blockHash === null || log.transactionHash === null || log.logIndex === null) continue;
        const toKey = log.to.toLowerCase();
        if (!originSet.has(toKey)) continue;
        if (log.from.toLowerCase() === toKey) continue;
        const beforeBlock = beforeByOrigin.get(toKey);
        const blockNumber = Number(log.blockNumber);
        if (beforeBlock === undefined || blockNumber > beforeBlock || log.value <= 0n) continue;

        const transactionHash = normalizeHash(log.transactionHash);
        const identity = `8453:${transactionHash}:${log.logIndex}:erc20_transfer`;
        if (seen.has(identity)) continue;

        let canonicalHash: Hex;
        try {
          canonicalHash = await canonicalBlock(options.client, blockNumber, log.blockHash, blockCache);
        } catch {
          errors.push({
            address: log.to,
            code: "INVALID_FUNDING_RECORD",
            message: `Canonical block-hash verification failed for a funding transfer in block ${blockNumber}.`,
          });
          continue;
        }

        seen.add(identity);
        edges.push({
          chainId: 8453,
          from: getAddress(log.from),
          to: getAddress(log.to),
          token,
          amount: log.value.toString(),
          blockNumber,
          blockHash: canonicalHash,
          transactionHash,
          logIndex: log.logIndex,
          sourceType: "erc20_transfer",
          sourceUrl: `https://basescan.org/tx/${transactionHash}`,
        });
        originsWithEdges.add(toKey);
      }
    }
  }

  return {
    sourceMode: "canonical_erc20",
    rpcUrl,
    tokensQueried: options.tokenAddresses.length,
    originsRequested: origins.length,
    originsWithEdges: originsWithEdges.size,
    chunksRead,
    edges,
    errors,
  };
}
