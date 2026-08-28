import { NextResponse } from "next/server";
import { store, verifyReport, type DervyxReport } from "@/lib/investigations";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const record = store.get(id);
  if (!record) {
    return jsonError(404, "NOT_FOUND", "Investigation request was not found.");
  }
  if (!record.report) {
    return jsonError(404, "REPORT_NOT_READY", "No certified report is available for this investigation yet.");
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return jsonError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
  }
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
  if (
    typeof rawBody !== "object" ||
    rawBody === null ||
    typeof (rawBody as { reportHash?: unknown }).reportHash !== "string" ||
    typeof (rawBody as { report?: unknown }).report !== "object" ||
    (rawBody as { report?: unknown }).report === null
  ) {
    return jsonError(400, "INVALID_REQUEST", "Verification body must include a report object and a reportHash string.");
  }
  const suppliedReport = (rawBody as { report: DervyxReport }).report;
  const suppliedHash = (rawBody as { reportHash: string }).reportHash;
  const storedHash = record.report.reportHash;
  const selfCheck = verifyReport(suppliedReport, suppliedHash);
  const matchesStored = suppliedHash === storedHash;
  const mismatchReason = !selfCheck.ok
    ? (selfCheck.mismatchReason ?? "SELF_HASH_MISMATCH")
    : matchesStored
      ? undefined
      : "STORED_HASH_MISMATCH";
  return NextResponse.json({
    ok: selfCheck.ok && matchesStored,
    recomputedHash: selfCheck.actualHash,
    suppliedHash,
    storedHash,
    selfConsistent: selfCheck.ok,
    matchesStored,
    ...(mismatchReason === undefined ? {} : { mismatchReason }),
  });
}
