import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { branchAdapterFromEnv, chooseBranch, type BranchSummary } from "./branch.js";
import { createDefaultEvidenceRunner, type EvidenceRunner } from "./evidence.js";
import { investigationPageHtml } from "./page.js";
import { certifyEvidence, verifyReport, type DervyxReport } from "./report.js";
import { normalizeScopeRequest, ScopeStore } from "./scope.js";

const MAX_BODY_BYTES = 64 * 1024;

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("referrer-policy", "no-referrer");
  response.end(payload);
}

function sendHtml(response: ServerResponse, statusCode: number, body: string): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "text/html; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("referrer-policy", "no-referrer");
  response.setHeader(
    "content-security-policy",
    "default-src 'none'; connect-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  );
  response.end(body);
}

function sendError(
  response: ServerResponse,
  statusCode: number,
  code: string,
  message: string,
  issues?: unknown,
): void {
  sendJson(response, statusCode, {
    error: {
      code,
      message,
      ...(issues === undefined ? {} : { issues }),
    },
  });
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error("BODY_TOO_LARGE");
    }
    chunks.push(buffer);
  }

  const text = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function routeRequestId(url: string): string | undefined {
  const match = /^\/api\/investigations\/([^/]+)$/.exec(url);
  return match?.[1];
}

function routeEvidenceRequestId(url: string): string | undefined {
  const match = /^\/api\/investigations\/([^/]+)\/evidence$/.exec(url);
  return match?.[1];
}

function routeReportRequestId(url: string): string | undefined {
  const match = /^\/api\/investigations\/([^/]+)\/report$/.exec(url);
  return match?.[1];
}

function routeReportVerifyRequestId(url: string): string | undefined {
  const match = /^\/api\/investigations\/([^/]+)\/report\/verify$/.exec(url);
  return match?.[1];
}

function branchTimeoutMs(): number {
  const raw = process.env.DERVYX_MODEL_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8000;
}

async function runEvidence(store: ScopeStore, runner: EvidenceRunner, requestId: string): Promise<void> {
  try {
    const record = store.get(requestId);
    if (!record) return;
    const result = await runner.run(record);
    if (result.kind === "ready") {
      try {
        const identity = {
          token: record.token,
          chainId: record.chainId,
          startBlock: record.startBlock,
          endBlock: record.endBlock,
          mode: record.mode,
          scopeConfigVersion: record.configVersion,
        };
        const baseline = certifyEvidence(identity, result.evidence);
        const summary: BranchSummary = {
          token: baseline.report.identity.token,
          chainId: baseline.report.identity.chainId,
          startBlock: baseline.report.identity.startBlock,
          endBlock: baseline.report.identity.endBlock,
          swapEventCount: baseline.report.metric.denominator,
          originsTotal: baseline.report.coverage.originsTotal,
          originsSampled: baseline.report.coverage.originsSampled,
          fundingStatus: baseline.report.coverage.fundingStatus,
          coordinationClusterCount: baseline.report.coordinationClusters.length,
          knownRootExclusionCount: baseline.report.knownRootExclusions.length,
          attributionCoverageBps: baseline.report.coverage.attributionCoverageBps,
        };
        // The model call may take seconds; keep the state INGESTING until the branch and
        // report are ready so EVIDENCE_READY always carries a certified report.
        const decision = await chooseBranch(summary, branchAdapterFromEnv(), { timeoutMs: branchTimeoutMs() });
        const certificate = certifyEvidence(identity, result.evidence, undefined, {
          branch: decision.branch,
          maxHopsConsidered: decision.plan.maxHopsConsidered,
        });
        store.completeEvidence(requestId, result.evidence);
        store.attachBranch(requestId, decision);
        store.attachReport(requestId, certificate);
      } catch {
        // EVIDENCE_READY is a certificate contract, not merely a successful provider read.
        // Fail closed if certification or branch attachment cannot complete.
        store.failEvidence(requestId, {
          code: "CERTIFICATION_FAILED",
          message: "Evidence was read but could not be certified for this scope.",
          retryable: false,
        });
      }
    } else {
      store.failEvidence(requestId, result.error);
    }
  } catch {
    store.failEvidence(requestId, {
      code: "RPC_UNAVAILABLE",
      message: "Canonical evidence could not be read from the configured provider.",
      retryable: true,
    });
  }
}

export function createScopeServer(
  store = new ScopeStore(),
  evidenceRunner = createDefaultEvidenceRunner(),
): Server {
  return createHttpServer(async (request, response) => {
    const method = request.method ?? "GET";
    const url = request.url ?? "/";

    try {
      if (method === "GET" && url === "/") {
        sendHtml(response, 200, investigationPageHtml);
        return;
      }

      if (method === "GET" && url === "/health") {
        sendJson(response, 200, {
          status: "ready",
          chainId: 8453,
          mode: "read_only_scope",
          providerMode: "not_connected",
        });
        return;
      }

      if (method === "POST" && url === "/api/investigations") {
        const contentType = request.headers["content-type"] ?? "";
        if (!contentType.toLowerCase().startsWith("application/json")) {
          sendError(response, 415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
          return;
        }

        let rawBody: unknown;
        try {
          rawBody = await readJsonBody(request);
        } catch (error) {
          const reason = error instanceof Error ? error.message : "INVALID_JSON";
          if (reason === "BODY_TOO_LARGE") {
            sendError(response, 413, "BODY_TOO_LARGE", "Request body exceeds the 64 KiB limit.");
          } else {
            sendError(response, 400, "INVALID_JSON", "Request body must be valid JSON.");
          }
          return;
        }

        const validation = normalizeScopeRequest(rawBody);
        if (!validation.ok) {
          sendError(response, 400, "INVALID_REQUEST", "Investigation scope was rejected.", validation.issues);
          return;
        }

        const result = store.create(validation.value, validation.scopeHash);
        if (result.kind === "conflict") {
          sendError(response, 409, result.issue.code, result.issue.message, [result.issue]);
          return;
        }
        sendJson(response, result.kind === "created" ? 201 : 200, result.record);
        return;
      }

      if (method === "POST") {
        const encodedVerifyId = routeReportVerifyRequestId(url);
        if (encodedVerifyId) {
          const requestId = decodeURIComponent(encodedVerifyId);
          const record = store.get(requestId);
          if (!record) {
            sendError(response, 404, "NOT_FOUND", "Investigation request was not found.");
            return;
          }
          if (!record.report) {
            sendError(
              response,
              404,
              "REPORT_NOT_READY",
              "No certified report is available for this investigation yet.",
            );
            return;
          }
          const contentType = request.headers["content-type"] ?? "";
          if (!contentType.toLowerCase().startsWith("application/json")) {
            sendError(response, 415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
            return;
          }
          let rawBody: unknown;
          try {
            rawBody = await readJsonBody(request);
          } catch (error) {
            const reason = error instanceof Error ? error.message : "INVALID_JSON";
            if (reason === "BODY_TOO_LARGE") {
              sendError(response, 413, "BODY_TOO_LARGE", "Request body exceeds the 64 KiB limit.");
            } else {
              sendError(response, 400, "INVALID_JSON", "Request body must be valid JSON.");
            }
            return;
          }
          if (
            typeof rawBody !== "object" ||
            rawBody === null ||
            typeof (rawBody as { reportHash?: unknown }).reportHash !== "string" ||
            typeof (rawBody as { report?: unknown }).report !== "object" ||
            (rawBody as { report?: unknown }).report === null
          ) {
            sendError(
              response,
              400,
              "INVALID_REQUEST",
              "Verification body must include a report object and a reportHash string.",
            );
            return;
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
          sendJson(response, 200, {
            ok: selfCheck.ok && matchesStored,
            recomputedHash: selfCheck.actualHash,
            suppliedHash,
            storedHash,
            selfConsistent: selfCheck.ok,
            matchesStored,
            ...(mismatchReason === undefined ? {} : { mismatchReason }),
          });
          return;
        }

        const encodedRequestId = routeEvidenceRequestId(url);
        if (encodedRequestId) {
          const requestId = decodeURIComponent(encodedRequestId);
          const start = store.startEvidence(requestId);
          if (start.kind === "not_found") {
            sendError(response, 404, "NOT_FOUND", "Investigation request was not found.");
            return;
          }
          if (start.kind === "not_retryable") {
            sendError(response, 409, "INVALID_STATE", "Evidence cannot be started from the current request state.");
            return;
          }
          if (start.kind === "complete") {
            sendJson(response, 200, start.record);
            return;
          }
          if (start.kind === "started") {
            void runEvidence(store, evidenceRunner, requestId);
          }
          sendJson(response, 202, start.record);
          return;
        }
      }

      if (method === "GET") {
        const encodedReportId = routeReportRequestId(url);
        if (encodedReportId) {
          const requestId = decodeURIComponent(encodedReportId);
          const record = store.get(requestId);
          if (!record) {
            sendError(response, 404, "NOT_FOUND", "Investigation request was not found.");
            return;
          }
          if (!record.report) {
            sendError(
              response,
              404,
              "REPORT_NOT_READY",
              "No certified report is available for this investigation yet.",
            );
            return;
          }
          const filename = `dervyx-report-${record.report.reportHash.slice(0, 16)}.json`;
          response.statusCode = 200;
          response.setHeader("content-type", "application/json; charset=utf-8");
          response.setHeader("cache-control", "no-store");
          response.setHeader("x-content-type-options", "nosniff");
          response.setHeader("referrer-policy", "no-referrer");
          response.setHeader("content-disposition", `attachment; filename="${filename}"`);
          response.end(JSON.stringify(record.report, null, 2));
          return;
        }

        const encodedRequestId = routeRequestId(url);
        if (encodedRequestId) {
          const requestId = decodeURIComponent(encodedRequestId);
          const record = store.get(requestId);
          if (!record) {
            sendError(response, 404, "NOT_FOUND", "Investigation request was not found.");
            return;
          }
          sendJson(response, 200, record);
          return;
        }
      }

      sendError(response, 404, "NOT_FOUND", "Route was not found.");
    } catch {
      if (!response.headersSent) {
        sendError(response, 500, "INTERNAL_ERROR", "The request could not be completed.");
      } else {
        response.destroy();
      }
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? "3000");
  const server = createScopeServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`Dervyx scope API listening on http://127.0.0.1:${port}`);
  });
}
