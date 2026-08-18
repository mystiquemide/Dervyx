import { createHash } from "node:crypto";
import { getAddress, type Address, type Hex } from "viem";

export const FUNDING_GRAPH_VERSION = "funding-graph-v1";
export const DEFAULT_MAX_FUNDING_HOPS = 2;
export const DEFAULT_MAX_FUNDING_EDGES = 10_000;

export type RootClass = "exchange" | "bridge" | "router" | "market_maker" | "distributor" | "unknown";

export interface FundingEdge {
  chainId: number;
  from: Address;
  to: Address;
  token: Address;
  amount: string;
  blockNumber: number;
  blockHash: Hex;
  transactionHash: Hex;
  logIndex: number;
  sourceType: "native_internal" | "erc20_transfer";
  sourceUrl: string;
}

export interface RootEvidence {
  address: Address;
  class: RootClass;
  label?: string;
  source?: string;
}

export interface RootTaxonomy {
  version: string;
  classify(address: Address): RootEvidence;
}

export interface RootTaxonomyEntry {
  address: Address;
  class: Exclude<RootClass, "unknown">;
  label: string;
  source: string;
}

export class StaticRootTaxonomy implements RootTaxonomy {
  private readonly entries: Map<string, RootTaxonomyEntry>;

  constructor(
    public readonly version: string,
    entries: readonly RootTaxonomyEntry[],
  ) {
    this.entries = new Map();
    for (const entry of entries) {
      const address = normalizeAddress(entry.address);
      if (!entry.label.trim() || !entry.source.trim()) {
        throw new GraphError("INVALID_TAXONOMY", "Root taxonomy entries require a label and source.");
      }
      this.entries.set(address.toLowerCase(), { ...entry, address });
    }
  }

  classify(address: Address): RootEvidence {
    const normalized = normalizeAddress(address);
    const entry = this.entries.get(normalized.toLowerCase());
    if (!entry) return { address: normalized, class: "unknown" };
    return {
      address: normalized,
      class: entry.class,
      label: entry.label,
      source: entry.source,
    };
  }
}

export interface FundingPath {
  trader: Address;
  root: RootEvidence;
  hops: FundingEdge[];
  hopCount: number;
  cycleDetected: boolean;
}

export interface GraphComponent {
  id: string;
  members: Address[];
}

export interface FundingGraphSnapshot {
  version: string;
  chainId: number;
  maxHops: number;
  taxonomyVersion: string;
  traders: Address[];
  edges: FundingEdge[];
  paths: FundingPath[];
  components: GraphComponent[];
  truncated: boolean;
  truncationReason?: string;
}

export type GraphErrorCode =
  | "INVALID_EDGE"
  | "CONFLICTING_EDGE"
  | "EDGE_LIMIT"
  | "INVALID_TAXONOMY";

export class GraphError extends Error {
  constructor(
    public readonly code: GraphErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "GraphError";
  }
}

function normalizeAddress(value: string): Address {
  try {
    return getAddress(value);
  } catch {
    throw new GraphError("INVALID_EDGE", "Funding graph contains an invalid address.");
  }
}

function normalizeHash(value: string): Hex {
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new GraphError("INVALID_EDGE", "Funding graph contains an invalid hash.");
  }
  return value.toLowerCase() as Hex;
}

function normalizeEdge(edge: FundingEdge): FundingEdge {
  if (!Number.isSafeInteger(edge.chainId) || edge.chainId < 1) {
    throw new GraphError("INVALID_EDGE", "Funding edge chain ID is invalid.");
  }
  if (!Number.isSafeInteger(edge.blockNumber) || edge.blockNumber < 0) {
    throw new GraphError("INVALID_EDGE", "Funding edge block number is invalid.");
  }
  if (!Number.isSafeInteger(edge.logIndex) || edge.logIndex < 0) {
    throw new GraphError("INVALID_EDGE", "Funding edge log index is invalid.");
  }
  if (!edge.amount.trim()) {
    throw new GraphError("INVALID_EDGE", "Funding edge amount is missing.");
  }
  if (edge.sourceType !== "native_internal" && edge.sourceType !== "erc20_transfer") {
    throw new GraphError("INVALID_EDGE", "Funding edge source type is invalid.");
  }
  if (!/^https?:\/\//.test(edge.sourceUrl)) {
    throw new GraphError("INVALID_EDGE", "Funding edge source URL is invalid.");
  }
  return {
    chainId: edge.chainId,
    from: normalizeAddress(edge.from),
    to: normalizeAddress(edge.to),
    token: normalizeAddress(edge.token),
    amount: edge.amount,
    blockNumber: edge.blockNumber,
    blockHash: normalizeHash(edge.blockHash),
    transactionHash: normalizeHash(edge.transactionHash),
    logIndex: edge.logIndex,
    sourceType: edge.sourceType,
    sourceUrl: edge.sourceUrl,
  };
}

function edgeIdentity(edge: FundingEdge): string {
  return `${edge.chainId}:${edge.transactionHash.toLowerCase()}:${edge.logIndex}:${edge.sourceType}`;
}

function edgeSortKey(edge: FundingEdge): string {
  return [
    edge.blockNumber.toString().padStart(20, "0"),
    edge.transactionHash.toLowerCase(),
    edge.logIndex.toString().padStart(10, "0"),
    edge.from.toLowerCase(),
    edge.to.toLowerCase(),
  ].join(":");
}

function addressSortKey(address: Address): string {
  return address.toLowerCase();
}

function componentId(members: readonly Address[]): string {
  const payload = members.map(addressSortKey).join("|");
  return `cluster_${createHash("sha256").update(payload, "utf8").digest("hex").slice(0, 16)}`;
}

class DisjointSet {
  private readonly parent = new Map<string, string>();

  add(address: Address): void {
    const key = address.toLowerCase();
    if (!this.parent.has(key)) this.parent.set(key, key);
  }

  find(address: Address): string {
    const key = address.toLowerCase();
    const parent = this.parent.get(key);
    if (!parent) throw new GraphError("INVALID_EDGE", "Graph node was not initialized.");
    if (parent === key) return key;
    const root = this.find(parent as Address);
    this.parent.set(key, root);
    return root;
  }

  union(left: Address, right: Address): void {
    this.add(left);
    this.add(right);
    const leftRoot = this.find(left);
    const rightRoot = this.find(right);
    if (leftRoot !== rightRoot) this.parent.set(rightRoot, leftRoot);
  }
}

function buildComponents(traders: readonly Address[], edges: readonly FundingEdge[]): GraphComponent[] {
  const dsu = new DisjointSet();
  for (const trader of traders) dsu.add(trader);
  for (const edge of edges) dsu.union(edge.from, edge.to);

  const grouped = new Map<string, Address[]>();
  for (const address of [...traders, ...edges.flatMap((edge) => [edge.from, edge.to])]) {
    const root = dsu.find(address);
    const members = grouped.get(root) ?? [];
    if (!members.some((member) => member.toLowerCase() === address.toLowerCase())) members.push(address);
    grouped.set(root, members);
  }

  return [...grouped.values()]
    .map((members) => {
      const sorted = members.sort((left, right) => addressSortKey(left).localeCompare(addressSortKey(right)));
      return { id: componentId(sorted), members: sorted };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function buildFundingGraph(input: {
  chainId: number;
  traders: readonly Address[];
  fundingEdges: readonly FundingEdge[];
  taxonomy: RootTaxonomy;
  maxHops?: number;
  maxEdges?: number;
}): FundingGraphSnapshot {
  const maxHops = input.maxHops ?? DEFAULT_MAX_FUNDING_HOPS;
  const maxEdges = input.maxEdges ?? DEFAULT_MAX_FUNDING_EDGES;
  if (maxHops !== DEFAULT_MAX_FUNDING_HOPS) {
    throw new GraphError("INVALID_EDGE", "Dervyx funding traversal is fixed at two hops.");
  }
  if (!Number.isSafeInteger(maxEdges) || maxEdges < 1) {
    throw new GraphError("INVALID_EDGE", "Funding edge limit is invalid.");
  }
  if (!input.taxonomy.version.trim()) {
    throw new GraphError("INVALID_TAXONOMY", "Root taxonomy version is required.");
  }

  const traders = [...new Set(input.traders.map(normalizeAddress))].sort((left, right) =>
    addressSortKey(left).localeCompare(addressSortKey(right)),
  );
  const byIdentity = new Map<string, FundingEdge>();
  for (const rawEdge of input.fundingEdges) {
    const edge = normalizeEdge(rawEdge);
    if (edge.chainId !== input.chainId) {
      throw new GraphError("INVALID_EDGE", "Funding edge chain ID does not match graph chain ID.");
    }
    const identity = edgeIdentity(edge);
    const previous = byIdentity.get(identity);
    if (previous) {
      if (JSON.stringify(previous) !== JSON.stringify(edge)) {
        throw new GraphError("CONFLICTING_EDGE", "Duplicate funding identity has conflicting fields.");
      }
      continue;
    }
    byIdentity.set(identity, edge);
  }

  const sortedEdges = [...byIdentity.values()].sort((left, right) =>
    edgeSortKey(left).localeCompare(edgeSortKey(right)),
  );
  const truncated = sortedEdges.length > maxEdges;
  const edges = truncated ? sortedEdges.slice(0, maxEdges) : sortedEdges;
  const inbound = new Map<string, FundingEdge[]>();
  for (const edge of edges) {
    const list = inbound.get(edge.to.toLowerCase()) ?? [];
    list.push(edge);
    inbound.set(edge.to.toLowerCase(), list);
  }
  for (const list of inbound.values()) list.sort((left, right) => edgeSortKey(left).localeCompare(edgeSortKey(right)));

  const paths: FundingPath[] = [];
  function addTerminalPath(trader: Address, current: Address, hops: FundingEdge[], cycleDetected: boolean): void {
    paths.push({
      trader,
      root: input.taxonomy.classify(current),
      hops: [...hops],
      hopCount: hops.length,
      cycleDetected,
    });
  }

  function walk(trader: Address, current: Address, hops: FundingEdge[], visited: Set<string>): void {
    if (hops.length >= maxHops) {
      addTerminalPath(trader, current, hops, false);
      return;
    }
    const incoming = inbound.get(current.toLowerCase()) ?? [];
    if (incoming.length === 0) {
      addTerminalPath(trader, current, hops, false);
      return;
    }

    let expanded = false;
    for (const edge of incoming) {
      const next = edge.from.toLowerCase();
      if (visited.has(next)) {
        addTerminalPath(trader, current, hops, true);
        continue;
      }
      expanded = true;
      const nextVisited = new Set(visited);
      nextVisited.add(next);
      walk(trader, edge.from, [...hops, edge], nextVisited);
    }
    if (!expanded) addTerminalPath(trader, current, hops, true);
  }

  for (const trader of traders) walk(trader, trader, [], new Set([trader.toLowerCase()]));
  paths.sort((left, right) => {
    const leftKey = `${left.trader.toLowerCase()}:${left.root.address.toLowerCase()}:${left.hops.map(edgeIdentity).join(",")}`;
    const rightKey = `${right.trader.toLowerCase()}:${right.root.address.toLowerCase()}:${right.hops.map(edgeIdentity).join(",")}`;
    return leftKey.localeCompare(rightKey);
  });

  return {
    version: FUNDING_GRAPH_VERSION,
    chainId: input.chainId,
    maxHops,
    taxonomyVersion: input.taxonomy.version,
    traders,
    edges,
    paths,
    components: buildComponents(traders, edges),
    truncated,
    ...(truncated ? { truncationReason: `funding-edge-cap:${maxEdges}` } : {}),
  };
}
