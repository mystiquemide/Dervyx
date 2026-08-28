import { NextResponse } from "next/server";
import { runEvidence, store } from "@/lib/investigations";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const start = store.startEvidence(id);
  if (start.kind === "not_found") {
    return jsonError(404, "NOT_FOUND", "Investigation request was not found.");
  }
  if (start.kind === "not_retryable") {
    return jsonError(409, "INVALID_STATE", "Evidence cannot be started from the current request state.");
  }
  if (start.kind === "complete") {
    return NextResponse.json(start.record, { status: 200 });
  }
  if (start.kind === "started") {
    // Cached mode is instant and offline, so resolve it inline and return the settled
    // record. Live reads run in the background and are polled by the client.
    if (start.record.mode === "cached") {
      await runEvidence(id);
      return NextResponse.json(store.get(id) ?? start.record, { status: 200 });
    }
    void runEvidence(id);
  }
  return NextResponse.json(start.record, { status: 202 });
}
