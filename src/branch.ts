import { canonicalize, hashCanonicalJson } from "./report.js";

/**
 * Phase 6 agent controls. The model may only CHOOSE an allowlisted investigation branch;
 * deterministic code owns the branch->plan mapping and every number and verdict. Invalid,
 * slow, or malicious model output falls back to a deterministic branch. No secrets are
 * logged and the model never sees anything beyond the sanitized summary below.
 */

export const INVESTIGATION_BRANCHES = ["standard", "deeper_funding", "pair_history", "early_stop"] as const;
export type InvestigationBranch = (typeof INVESTIGATION_BRANCHES)[number];

export interface BranchPlan {
  branch: InvestigationBranch;
  /** Deterministic funding-hop depth the report engine will consider for this branch. */
  maxHopsConsidered: number;
  /** Bounded origin-gather cap this branch would request (applied by the evidence layer). */
  maxOrigins: number;
  focus: "balanced" | "roots" | "pairs" | "fast";
}

export const BRANCH_PLANS: Record<InvestigationBranch, BranchPlan> = {
  standard: { branch: "standard", maxHopsConsidered: 2, maxOrigins: 30, focus: "balanced" },
  deeper_funding: { branch: "deeper_funding", maxHopsConsidered: 2, maxOrigins: 30, focus: "roots" },
  pair_history: { branch: "pair_history", maxHopsConsidered: 2, maxOrigins: 30, focus: "pairs" },
  early_stop: { branch: "early_stop", maxHopsConsidered: 1, maxOrigins: 10, focus: "fast" },
};

/** Sanitized, model-visible summary. No raw counterparty addresses beyond the public token. */
export interface BranchSummary {
  token: string;
  chainId: number;
  startBlock: number;
  endBlock: number;
  swapEventCount: number;
  originsTotal: number;
  originsSampled: number;
  fundingStatus: "complete" | "partial";
  coordinationClusterCount: number;
  knownRootExclusionCount: number;
  attributionCoverageBps: number;
}

export type BranchMode = "model" | "fallback";
export type BranchFallbackReason = "no_provider" | "timeout" | "error" | "invalid_output";

export interface BranchDecision {
  branch: InvestigationBranch;
  mode: BranchMode;
  rationale: string;
  summaryHash: string;
  plan: BranchPlan;
  fallbackReason?: BranchFallbackReason;
}

export interface BranchModelAdapter {
  readonly name: string;
  /** Returns untrusted raw model output; the caller validates it against the allowlist. */
  selectBranch(summary: BranchSummary, signal: AbortSignal): Promise<unknown>;
}

export interface ChooseBranchOptions {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_RATIONALE_LENGTH = 280;

export function summaryHashOf(summary: BranchSummary): string {
  return hashCanonicalJson(canonicalize(summary));
}

function sanitizeRationale(text: string): string {
  return text.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_RATIONALE_LENGTH);
}

function isBranch(value: unknown): value is InvestigationBranch {
  return typeof value === "string" && (INVESTIGATION_BRANCHES as readonly string[]).includes(value);
}

/** Validate untrusted model output down to an allowlisted branch and a sanitized rationale. */
export function validateBranchOutput(raw: unknown): { branch: InvestigationBranch; rationale: string } | null {
  if (typeof raw !== "object" || raw === null) return null;
  const branch = (raw as { branch?: unknown }).branch;
  if (!isBranch(branch)) return null;
  const rawRationale = (raw as { rationale?: unknown }).rationale;
  const rationale = typeof rawRationale === "string" ? sanitizeRationale(rawRationale) : "";
  return { branch, rationale };
}

/** Deterministic branch selection used for fallback and as the safe default. */
export function deterministicBranch(summary: BranchSummary): InvestigationBranch {
  if (summary.swapEventCount === 0 || summary.originsTotal === 0) return "early_stop";
  if (summary.fundingStatus === "partial" || summary.attributionCoverageBps < 5000) return "deeper_funding";
  if (summary.coordinationClusterCount >= 1) return "pair_history";
  return "standard";
}

function fallbackDecision(
  summary: BranchSummary,
  summaryHash: string,
  reason: BranchFallbackReason,
  rationale: string,
): BranchDecision {
  const branch = deterministicBranch(summary);
  return {
    branch,
    mode: "fallback",
    rationale,
    summaryHash,
    plan: BRANCH_PLANS[branch],
    fallbackReason: reason,
  };
}

/**
 * Choose an investigation branch. With no adapter (or on any timeout, error, or non-allowlisted
 * output) it returns a deterministic fallback. The chosen branch only selects a deterministic
 * work-path plan; it never sets a number or the verdict.
 */
export async function chooseBranch(
  summary: BranchSummary,
  adapter?: BranchModelAdapter,
  options: ChooseBranchOptions = {},
): Promise<BranchDecision> {
  const summaryHash = summaryHashOf(summary);
  if (!adapter) {
    return fallbackDecision(
      summary,
      summaryHash,
      "no_provider",
      "No model provider configured; deterministic branch selected.",
    );
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let raw: unknown;
  try {
    raw = await adapter.selectBranch(summary, controller.signal);
  } catch {
    const reason: BranchFallbackReason = controller.signal.aborted ? "timeout" : "error";
    return fallbackDecision(
      summary,
      summaryHash,
      reason,
      reason === "timeout"
        ? "Model timed out; deterministic branch selected."
        : "Model was unavailable; deterministic branch selected.",
    );
  } finally {
    clearTimeout(timer);
  }

  const validated = validateBranchOutput(raw);
  if (!validated) {
    return fallbackDecision(
      summary,
      summaryHash,
      "invalid_output",
      "Model output was not an allowlisted branch; deterministic branch selected.",
    );
  }

  return {
    branch: validated.branch,
    mode: "model",
    rationale: validated.rationale,
    summaryHash,
    plan: BRANCH_PLANS[validated.branch],
  };
}

export interface OpenAiCompatibleConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const BRANCH_SYSTEM_PROMPT =
  "You select exactly one deterministic investigation branch for a Base funding/volume anomaly tool. " +
  'Reply ONLY with JSON of the form {"branch": one of standard|deeper_funding|pair_history|early_stop, "rationale": short string}. ' +
  "You never decide the verdict or any number; you only choose which deterministic analysis path to run.";

/**
 * Extract a JSON object from model content. Reasoning models (e.g. Qwen3, DeepSeek-R1)
 * prepend a <think>...</think> block and may add prose, so strip reasoning and scan for
 * the first balanced object. Returns the raw string when no object is found, which the
 * allowlist validator then rejects into a deterministic fallback.
 */
export function parseModelContent(content: string): unknown {
  const withoutThink = content.replace(/<think>[\s\S]*?<\/think>/gi, " ");
  const start = withoutThink.indexOf("{");
  if (start === -1) return content;
  let depth = 0;
  for (let i = start; i < withoutThink.length; i += 1) {
    const ch = withoutThink[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = withoutThink.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          return content;
        }
      }
    }
  }
  return content;
}

/** Genuine OpenAI-compatible chat-completions adapter. Stateless; the key stays in env. */
export class OpenAiCompatibleBranchAdapter implements BranchModelAdapter {
  readonly name = "openai_compatible";

  constructor(private readonly config: OpenAiCompatibleConfig) {}

  async selectBranch(summary: BranchSummary, signal: AbortSignal): Promise<unknown> {
    const url = `${this.config.baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const requestBody = {
      model: this.config.model,
      messages: [
        { role: "system", content: BRANCH_SYSTEM_PROMPT },
        { role: "user", content: `Investigation summary (sanitized): ${canonicalize(summary)}` },
      ],
      temperature: 0,
      max_tokens: 2048,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal,
    });
    if (!response.ok) {
      throw new Error(`MODEL_HTTP_${response.status}`);
    }
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new Error("MODEL_EMPTY_RESPONSE");
    }
    return parseModelContent(content);
  }
}

/** Build a genuine model adapter from env, or undefined when unconfigured (deterministic fallback). */
export function branchAdapterFromEnv(
  env: Record<string, string | undefined> = process.env,
): BranchModelAdapter | undefined {
  const baseUrl = env.DERVYX_MODEL_BASE_URL;
  const apiKey = env.DERVYX_MODEL_API_KEY;
  const model = env.DERVYX_MODEL_NAME;
  if (!baseUrl || !apiKey || !model) return undefined;
  return new OpenAiCompatibleBranchAdapter({ baseUrl, apiKey, model });
}
