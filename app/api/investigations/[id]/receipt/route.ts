import { buildEvidenceReceipt } from "../../../../../src/receipt.js";
import { store } from "@/lib/investigations";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const record = store.get(id);
  if (!record) {
    return jsonError(404, "NOT_FOUND", "Investigation request was not found.");
  }
  if (!record.report) {
    return jsonError(404, "RECEIPT_NOT_READY", "No evidence receipt is available for this investigation yet.");
  }
  const receipt = buildEvidenceReceipt(record.report);
  const filename = `dervyx-receipt-${record.report.reportHash.slice(0, 16)}.json`;
  return new Response(JSON.stringify(receipt, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
    },
  });
}
