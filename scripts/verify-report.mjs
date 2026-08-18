// Replay/verify a Dervyx report certificate: recompute the canonical sorted-key JSON hash
// and compare it to the certificate's stored reportHash. Read-only; no network, no writes.
// Usage: npm run build && node scripts/verify-report.mjs <path-to-certificate.json>
// Exit code 0 on match, 1 on mismatch, 2 on usage/parse error.
import { readFileSync } from "node:fs";

import { verifyReport } from "../dist/src/report.js";

const path = process.argv[2];
if (!path) {
  console.error("usage: node scripts/verify-report.mjs <certificate.json>");
  process.exit(2);
}

let certificate;
try {
  certificate = JSON.parse(readFileSync(path, "utf8"));
} catch (error) {
  console.error(`could not read or parse ${path}: ${error?.message ?? error}`);
  process.exit(2);
}

if (!certificate || typeof certificate !== "object" || !certificate.report || typeof certificate.reportHash !== "string") {
  console.error("certificate must contain a { report, reportHash } shape");
  process.exit(2);
}

const result = verifyReport(certificate.report, certificate.reportHash);
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
