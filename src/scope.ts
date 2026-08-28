import { createHash, randomBytes } from "node:crypto";
import { getAddress } from "viem";
import { z } from "zod";

import type { NormalizedSwapEvent } from "./chain.js";
import type { FundingSourceError } from "./funding.js";
import type { FundingEdge, FundingGraphSnapshot } from "./graph.js";
import type { ReportCertificate } from "./report.js";
import type { BranchDecision } from "./branch.js";

export const BASE_CHAIN_ID = 8453 as const;
export const DEFAULT_MAX_BLOCK_SPAN = 10_000;
export const DEFAULT_SCOPE_CONFIG_VERSION = "phase1-scope-v1";
export const MAX_IDEMPOTENCY_KEY_LENGTH = 128;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const investigationModes = ["live", "cached", "recorded"] as const;

export type InvestigationMode = (typeof investigationModes)[number];
export type ExampleId = "anomaly" | "control";
export type InvestigationState =
  | "SCOPED"
  | "INGESTING"
  | "EVIDENCE_READY"
  | "RETRYABLE"
  | "INSUFFICIENT_DATA";

export interface ScopeInput {
  token: string;
  startBlock: number;
  endBlock: number;
  chainId: number;
  mode: InvestigationMode;
  exampleId?: ExampleId;
  configVersion: string;
  idempotencyKey: string;
}

export interface EvidenceSnapshot {
  fixtureId: string;
  poolId: string;
  providerMode: "public_fallback" | "configured";
  rpcUrl: string;
  range: {
    startBlock: number;
    endBlock: number;
    startHash: string;
    endHash: string;
  };
  rawEventCount: number;
  eventCount: number;
  events: NormalizedSwapEvent[];
  funding?: FundingSnapshot;
}

export interface EvidenceError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface FundingSnapshot {
  status: "complete" | "partial";
  sourceMode:
    | "blockscout_internal"
    | "blockscout_internal_and_erc20"
    | "blockscout_internal_and_canonical_erc20"
    | "canonical_erc20";
  apiBase: string;
  rpcUrl: string;
  originsTotal: number;
  originsRequested: number;
  erc20OriginsRequested: number;
  originsWithEdges: number;
  nativeEdgeCount: number;
  erc20EdgeCount: number;
  pagesRead: number;
  chunksRead: number;
  edges: FundingEdge[];
  graph: FundingGraphSnapshot;
  errors: FundingSourceError[];
  sourceErrors: { native: number; erc20: number };
}

export interface ScopeRecord extends ScopeInput {
  requestId: string;
  scopeHash: string;
  state: InvestigationState;
  providerMode: "not_connected";
  createdAt: string;
  evidence?: EvidenceSnapshot;
  evidenceError?: EvidenceError;
  report?: ReportCertificate;
  branch?: BranchDecision;
}

export interface ValidationIssue {
  code: string;
  field: string;
  message: string;
}

export type ScopeValidationResult =
  | { ok: true; value: ScopeInput; scopeHash: string }
  | { ok: false; issues: ValidationIssue[] };

const decimalInteger = z.preprocess(
  (value) => {
    if (typeof value === "number" && Number.isSafeInteger(value)) {
      return value;
    }
    if (typeof value === "string" && /^\d+$/.test(value)) {
      const parsed = Number(value);
      return Number.isSafeInteger(parsed) ? parsed : value;
    }
    return value;
  },
  z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
);

const inputSchema = z
  .object({
    token: z.string().trim().min(1).max(42),
    startBlock: decimalInteger,
    endBlock: decimalInteger,
    chainId: decimalInteger,
    mode: z.enum(investigationModes),
    exampleId: z.enum(["anomaly", "control"]).optional(),
    configVersion: z
      .string()
      .trim()
      .min(1)
      .max(64)
      .regex(/^[A-Za-z0-9._-]+$/),
    idempotencyKey: z
      .string()
      .trim()
      .min(1)
      .max(MAX_IDEMPOTENCY_KEY_LENGTH)
      .regex(/^[\x21-\x7e]+$/),
  })
  .strict();

function issue(code: string, field: string, message: string): ValidationIssue {
  return { code, field, message };
}

function schemaIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map((entry) => {
    const field = entry.path.length > 0 ? entry.path.join(".") : "request";
    if (entry.code === "unrecognized_keys") {
      return issue("UNKNOWN_FIELD", field, "Unknown request fields are not accepted.");
    }
    return issue("INVALID_REQUEST", field, "The request value is invalid.");
  });
}

function canonicalScope(input: ScopeInput): string {
  return JSON.stringify({
    token: input.token,
    startBlock: input.startBlock,
    endBlock: input.endBlock,
    chainId: input.chainId,
    mode: input.mode,
    ...(input.exampleId !== undefined ? { exampleId: input.exampleId } : {}),
    configVersion: input.configVersion,
  });
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function normalizeScopeRequest(
  raw: unknown,
  maxBlockSpan = DEFAULT_MAX_BLOCK_SPAN,
): ScopeValidationResult {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, issues: schemaIssues(parsed.error) };
  }

  const { exampleId, ...requiredFields } = parsed.data;
  const value: ScopeInput = exampleId === undefined ? requiredFields : { ...requiredFields, exampleId };
  let checksumToken: string;
  try {
    checksumToken = getAddress(value.token);
  } catch {
    return {
      ok: false,
      issues: [issue("INVALID_TOKEN", "token", "Token must be a valid EVM address.")],
    };
  }

  if (checksumToken === ZERO_ADDRESS) {
    return {
      ok: false,
      issues: [issue("INVALID_TOKEN", "token", "The zero address is not a token scope.")],
    };
  }

  if (checksumToken !== value.token) {
    return {
      ok: false,
      issues: [
        issue(
          "INVALID_CHECKSUM",
          "token",
          "Token address must use EIP-55 checksum casing.",
        ),
      ],
    };
  }

  const issues: ValidationIssue[] = [];
  if (value.exampleId !== undefined && value.mode !== "cached") {
    issues.push(issue("INVALID_EXAMPLE", "exampleId", "Example IDs are only valid for cached example runs."));
  }
  if (value.chainId !== BASE_CHAIN_ID) {
    issues.push(issue("WRONG_CHAIN", "chainId", "Only Base Mainnet (chain ID 8453) is supported."));
  }
  if (value.startBlock > value.endBlock) {
    issues.push(issue("INVALID_RANGE", "startBlock", "Start block must not exceed end block."));
  }
  if (value.endBlock - value.startBlock + 1 > maxBlockSpan) {
    issues.push(
      issue(
        "RANGE_TOO_LARGE",
        "endBlock",
        `Block range must not exceed ${maxBlockSpan.toLocaleString("en-US")} blocks.`,
      ),
    );
  }
  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const scopeHash = sha256(canonicalScope(value));
  return { ok: true, value, scopeHash };
}

export type ScopeCreateResult =
  | { kind: "created"; record: ScopeRecord }
  | { kind: "duplicate"; record: ScopeRecord }
  | { kind: "conflict"; issue: ValidationIssue };

export type EvidenceStartResult =
  | { kind: "started"; record: ScopeRecord }
  | { kind: "already_running"; record: ScopeRecord }
  | { kind: "complete"; record: ScopeRecord }
  | { kind: "not_retryable"; record: ScopeRecord }
  | { kind: "not_found" };

export class ScopeStore {
  static readonly MAX_RECORDS = 64;
  static readonly RETENTION_MS = 30 * 60 * 1000;

  private readonly byIdempotencyKey = new Map<
    string,
    { scopeHash: string; record: ScopeRecord }
  >();

  private readonly byRequestId = new Map<string, ScopeRecord>();

  private remove(requestId: string): void {
    const record = this.byRequestId.get(requestId);
    if (!record) return;
    this.byRequestId.delete(requestId);
    this.byIdempotencyKey.delete(record.idempotencyKey);
  }

  private prune(now: Date): void {
    const nowMs = now.getTime();
    for (const [requestId, record] of this.byRequestId) {
      const createdMs = Date.parse(record.createdAt);
      if (!Number.isFinite(createdMs) || nowMs - createdMs > ScopeStore.RETENTION_MS) {
        this.remove(requestId);
      }
    }
    while (this.byRequestId.size >= ScopeStore.MAX_RECORDS) {
      const oldest = [...this.byRequestId.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt))[0];
      if (!oldest) break;
      this.remove(oldest.requestId);
    }
  }

  create(input: ScopeInput, scopeHash: string, now = new Date()): ScopeCreateResult {
    this.prune(now);
    const existing = this.byIdempotencyKey.get(input.idempotencyKey);
    if (existing) {
      if (existing.scopeHash === scopeHash) {
        return { kind: "duplicate", record: existing.record };
      }
      return {
        kind: "conflict",
        issue: issue(
          "IDEMPOTENCY_CONFLICT",
          "idempotencyKey",
          "That idempotency key is already bound to a different scope.",
        ),
      };
    }

    const requestId = `inv_${randomBytes(16).toString("hex")}`;
    const record: ScopeRecord = {
      ...input,
      requestId,
      scopeHash,
      state: "SCOPED",
      providerMode: "not_connected",
      createdAt: now.toISOString(),
    };
    this.byIdempotencyKey.set(input.idempotencyKey, { scopeHash, record });
    this.byRequestId.set(requestId, record);
    return { kind: "created", record };
  }

  get(requestId: string, now = new Date()): ScopeRecord | undefined {
    this.prune(now);
    return this.byRequestId.get(requestId);
  }

  startEvidence(requestId: string, now = new Date()): EvidenceStartResult {
    this.prune(now);
    const record = this.byRequestId.get(requestId);
    if (!record) return { kind: "not_found" };
    if (record.state === "EVIDENCE_READY") return { kind: "complete", record };
    if (record.state === "INGESTING") return { kind: "already_running", record };
    if (record.state !== "SCOPED" && record.state !== "RETRYABLE") {
      return { kind: "not_retryable", record };
    }

    record.state = "INGESTING";
    delete record.evidenceError;
    return { kind: "started", record };
  }

  completeEvidence(requestId: string, evidence: EvidenceSnapshot): ScopeRecord | undefined {
    const record = this.byRequestId.get(requestId);
    if (!record) return undefined;
    record.state = "EVIDENCE_READY";
    record.evidence = evidence;
    delete record.evidenceError;
    return record;
  }

  attachReport(requestId: string, report: ReportCertificate): ScopeRecord | undefined {
    const record = this.byRequestId.get(requestId);
    if (!record) return undefined;
    record.report = report;
    return record;
  }

  attachBranch(requestId: string, branch: BranchDecision): ScopeRecord | undefined {
    const record = this.byRequestId.get(requestId);
    if (!record) return undefined;
    record.branch = branch;
    return record;
  }

  failEvidence(requestId: string, error: EvidenceError): ScopeRecord | undefined {
    const record = this.byRequestId.get(requestId);
    if (!record) return undefined;
    record.state = error.retryable ? "RETRYABLE" : "INSUFFICIENT_DATA";
    record.evidenceError = error;
    delete record.evidence;
    delete record.report;
    delete record.branch;
    return record;
  }
}
