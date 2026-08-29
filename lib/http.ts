import { NextResponse } from "next/server";

export function jsonError(status: number, code: string, message: string, issues?: unknown) {
  return NextResponse.json(
    { error: { code, message, ...(issues === undefined ? {} : { issues }) } },
    { status },
  );
}

export function rateLimitError(message: string, retryAfterSeconds: number) {
  const response = jsonError(429, "RATE_LIMITED", message);
  response.headers.set("retry-after", String(retryAfterSeconds));
  response.headers.set("cache-control", "no-store");
  return response;
}
