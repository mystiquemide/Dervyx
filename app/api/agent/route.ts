import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";

const MANIFEST = {
  schema: "dervyx-agent-manifest-v1",
  name: "Dervyx",
  tagline: "Counterfactual funding evidence for Base token review.",
  description:
    "A read-only Base investigation agent that traces funding relationships behind observed swap activity and returns deterministic, replayable evidence.",
  chain: { name: "Base Mainnet", chainId: 8453 },
  readOnly: true,
  modelBoundary: "A model may choose an allowlisted branch; deterministic code owns evidence, numbers, root policy, and verdict.",
  supportedModes: ["live", "cached"],
  states: ["SCOPED", "INGESTING", "EVIDENCE_READY", "RETRYABLE", "INSUFFICIENT_DATA"],
  verdicts: ["ANOMALY", "CLEAN", "UNKNOWN_ROOTS", "INSUFFICIENT_DATA"],
  tools: [
    {
      name: "scope_token",
      method: "POST",
      path: "/api/investigations",
      description: "Create a fixed token and block-range investigation scope.",
    },
    {
      name: "read_investigation",
      method: "GET",
      path: "/api/investigations/{requestId}",
      description: "Read investigation state and certified evidence when ready.",
    },
    {
      name: "get_report",
      method: "GET",
      path: "/api/investigations/{requestId}/report",
      description: "Download the canonical report certificate JSON.",
    },
    {
      name: "get_evidence_receipt",
      method: "GET",
      path: "/api/investigations/{requestId}/receipt",
      description: "Download the compact counterfactual attribution receipt.",
    },
    {
      name: "verify_report",
      method: "POST",
      path: "/api/investigations/{requestId}/report/verify",
      description: "Recompute the canonical report hash and detect tampering.",
    },
  ],
  guarantees: [
    "Known exchange, bridge, router, and market-maker roots remain visible and are excluded only by sourced taxonomy.",
    "Incomplete attribution never becomes CLEAN.",
    "EVIDENCE_READY always carries a certified report.",
    "No wallet connection, signing, transaction, or trading action is required.",
  ],
  limitations: [
    "The current adapter is Base-only and supports verified fixture scopes.",
    "Funding coverage is bounded to sampled origins and two hops.",
    "The public deployment keeps short-lived request state in process memory.",
  ],
};

export async function GET() {
  return NextResponse.json(MANIFEST, {
    status: 200,
    headers: {
      "cache-control": "public, max-age=300",
      "x-content-type-options": "nosniff",
    },
  });
}
