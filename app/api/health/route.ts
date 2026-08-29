import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ready",
    chainId: 8453,
    mode: "scoped_analysis",
  });
}
