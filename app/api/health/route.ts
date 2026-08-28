import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ready",
    chainId: 8453,
    mode: "read_only_scope",
    providerMode: "not_connected",
  });
}
