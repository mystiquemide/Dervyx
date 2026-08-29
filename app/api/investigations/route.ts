import { NextResponse } from "next/server";
import { normalizeScopeRequest, requestRateLimitKey, scopeRateLimiter, store } from "@/lib/investigations";
import { jsonError, rateLimitError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

  const validation = normalizeScopeRequest(rawBody);
  if (!validation.ok) {
    return jsonError(400, "INVALID_REQUEST", "Investigation scope was rejected.", validation.issues);
  }

  const rate = scopeRateLimiter.tryConsume(requestRateLimitKey(request));
  if (!rate.allowed) {
    return rateLimitError("Too many investigation scopes from this client. Retry shortly.", rate.retryAfterSeconds);
  }

  const result = store.create(validation.value, validation.scopeHash);
  if (result.kind === "conflict") {
    return jsonError(409, result.issue.code, result.issue.message, [result.issue]);
  }
  return NextResponse.json(result.record, { status: result.kind === "created" ? 201 : 200 });
}
