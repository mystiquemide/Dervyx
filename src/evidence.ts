import { getAddress, type Address, type Hex } from "viem";

import {
  BASE_POOL_MANAGER,
  CanonicalReadError,
  createBaseRpcClient,
  readBaseUniswapV4Swaps,
} from "./chain.js";
import { readCanonicalErc20Funding, readNativeFundingTransfers } from "./funding.js";
import { buildFundingGraph, StaticRootTaxonomy } from "./graph.js";
import { redactProviderUrl } from "./security.js";
import type {
  EvidenceError,
  EvidenceSnapshot,
  ScopeRecord,
} from "./scope.js";

interface FixtureDefinition {
  fixtureId: string;
  poolId: Hex;
  fundingTokens: Address[];
}

const fixtureByToken = new Map<string, FixtureDefinition>([
  [
    "0xb2000000000000000000000ff4a547c891ab1b01",
    {
      fixtureId: "baseunc-v4-launch-window",
      poolId: "0x1ee8db5e1df2386aa078cf866b83d90ca559757b4c98276694f5d7698c3570d8",
      fundingTokens: ["0xB2000000000000000000000Ff4a547c891AB1b01"],
    },
  ],
  [
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    {
      fixtureId: "usdt-usdc-v4-control-window",
      poolId: "0xf13203ddbf2c9816a79b656a1a952521702715d92fea465b84ae2ed6e94a7f22",
      fundingTokens: [
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      ],
    },
  ],
  [
    "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
    {
      fixtureId: "usdt-usdc-v4-control-window",
      poolId: "0xf13203ddbf2c9816a79b656a1a952521702715d92fea465b84ae2ed6e94a7f22",
      fundingTokens: [
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      ],
    },
  ],
]);

export type EvidenceRunResult =
  | { kind: "ready"; evidence: EvidenceSnapshot }
  | { kind: "failed"; error: EvidenceError };

export interface EvidenceRunner {
  run(record: ScopeRecord): Promise<EvidenceRunResult>;
}

function failure(code: string, message: string, retryable: boolean): EvidenceRunResult {
  return { kind: "failed", error: { code, message, retryable } };
}

function resolveFixture(token: string): FixtureDefinition | undefined {
  try {
    return fixtureByToken.get(getAddress(token).toLowerCase());
  } catch {
    return undefined;
  }
}

function buildOriginQueries(events: readonly { origin: Address; blockNumber: number }[]) {
  const byOrigin = new Map<string, { address: Address; beforeBlock: number; observedSwapCount: number }>();
  for (const event of events) {
    const key = event.origin.toLowerCase();
    const existing = byOrigin.get(key);
    if (existing) {
      existing.beforeBlock = Math.min(existing.beforeBlock, event.blockNumber);
      existing.observedSwapCount += 1;
    } else {
      byOrigin.set(key, {
        address: event.origin,
        beforeBlock: event.blockNumber,
        observedSwapCount: 1,
      });
    }
  }
  return [...byOrigin.values()].sort(
    (left, right) => right.observedSwapCount - left.observedSwapCount || left.address.toLowerCase().localeCompare(right.address.toLowerCase()),
  );
}

export function createDefaultEvidenceRunner(): EvidenceRunner {
  return {
    async run(record): Promise<EvidenceRunResult> {
      if (record.mode !== "live") {
        return failure(
          "MODE_NOT_READY",
          "Only live evidence is connected in this slice; cached and recorded modes are not available yet.",
          false,
        );
      }

      const fixture = resolveFixture(record.token);
      if (!fixture) {
        return failure(
          "UNSUPPORTED_FIXTURE",
          "This token is not mapped to a verified Phase 0 fixture yet.",
          false,
        );
      }

      try {
        const result = await readBaseUniswapV4Swaps({
          poolId: fixture.poolId,
          startBlock: record.startBlock,
          endBlock: record.endBlock,
          maxBlockSpan: 10_000,
          chunkSize: 500,
          maxEvents: 5_000,
        });
        if (result.eventCount === 0) {
          return failure(
            "NO_SUPPORTED_EVENTS",
            "No supported swap events were found in the requested scope.",
            false,
          );
        }

        const origins = buildOriginQueries(result.events);
        const rpcClient = createBaseRpcClient(result.rpcUrl);
        const safeRpcUrl = redactProviderUrl(result.rpcUrl, result.providerMode);

        // Canonical eth_getLogs is the reliable, source-linked ERC-20 funding source.
        const canonical = await readCanonicalErc20Funding({
          client: rpcClient,
          rpcUrl: result.rpcUrl,
          origins,
          tokenAddresses: fixture.fundingTokens,
          endBlock: record.endBlock,
          lookbackBlocks: 10_000,
          maxOrigins: 30,
          chunkSize: 500,
        });

        // Blockscout internal transfers remain a best-effort native-ETH enrichment; its
        // failure records errors but never zeroes the canonical ERC-20 coverage above.
        const native = await readNativeFundingTransfers({
          client: rpcClient,
          origins,
          maxOrigins: 30,
          maxPagesPerOrigin: 3,
          maxEdgesPerOrigin: 50,
        });

        const sampledOrigins = Math.max(native.originsRequested, canonical.originsRequested);
        const mergedEdges = [...native.edges, ...canonical.edges];
        const originsWithEdges = new Set(mergedEdges.map((edge) => edge.to.toLowerCase())).size;
        const fundingErrors = [...native.errors, ...canonical.errors];
        const graph = buildFundingGraph({
          chainId: 8453,
          traders: origins.slice(0, sampledOrigins).map((origin) => origin.address),
          fundingEdges: mergedEdges,
          taxonomy: new StaticRootTaxonomy("phase0-source-by-source-v1", [
            {
              address: BASE_POOL_MANAGER,
              class: "router",
              label: "Uniswap v4 PoolManager",
              source: "https://developers.uniswap.org/docs/protocols/v4/deployments",
            },
          ]),
        });

        return {
          kind: "ready",
          evidence: {
            fixtureId: fixture.fixtureId,
            poolId: result.poolId,
            providerMode: result.providerMode,
            rpcUrl: safeRpcUrl,
            range: result.range,
            rawEventCount: result.rawEventCount,
            eventCount: result.eventCount,
            events: result.events,
            funding: {
              status: fundingErrors.length === 0 && sampledOrigins === origins.length ? "complete" : "partial",
              sourceMode: "blockscout_internal_and_canonical_erc20",
              apiBase: native.apiBase,
              rpcUrl: safeRpcUrl,
              originsTotal: origins.length,
              originsRequested: sampledOrigins,
              erc20OriginsRequested: canonical.originsRequested,
              originsWithEdges,
              nativeEdgeCount: native.edges.length,
              erc20EdgeCount: canonical.edges.length,
              pagesRead: native.pagesRead,
              chunksRead: canonical.chunksRead,
              edges: mergedEdges,
              graph,
              errors: fundingErrors,
              sourceErrors: { native: native.errors.length, erc20: canonical.errors.length },
            },
          },
        };
      } catch (error) {
        if (error instanceof CanonicalReadError) {
          return failure(
            error.code,
            error.message,
            error.code === "RPC_UNAVAILABLE",
          );
        }
        return failure(
          "RPC_UNAVAILABLE",
          "Canonical evidence could not be read from the configured provider.",
          true,
        );
      }
    },
  };
}
