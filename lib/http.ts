import { NextResponse } from "next/server";

export function jsonError(status: number, code: string, message: string, issues?: unknown) {
  return NextResponse.json(
    { error: { code, message, ...(issues === undefined ? {} : { issues }) } },
    { status },
  );
}
