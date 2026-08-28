import { NextResponse } from "next/server";
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
  return NextResponse.json(record);
}
