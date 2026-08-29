import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildEvidenceReceipt } from "../dist/src/receipt.js";
import { canonicalize, hashCanonicalJson, verifyReport } from "../dist/src/report.js";

const fixtures = ["anomaly", "control"];
const results = [];

for (const name of fixtures) {
  const certificatePath = resolve("examples", `${name}-certificate.json`);
  const receiptPath = resolve("examples", `${name}-receipt.json`);
  const certificate = JSON.parse(readFileSync(certificatePath, "utf8"));
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));

  const canonicalJson = canonicalize(certificate.report);
  if (canonicalJson !== certificate.canonicalJson) {
    throw new Error(`${name}: canonical JSON does not match the certificate`);
  }
  if (hashCanonicalJson(canonicalJson) !== certificate.reportHash) {
    throw new Error(`${name}: certificate hash does not match canonical JSON`);
  }

  const replay = verifyReport(certificate.report, certificate.reportHash);
  if (!replay.ok) {
    throw new Error(`${name}: report replay failed (${replay.mismatchReason ?? "unknown"})`);
  }

  const expectedReceipt = buildEvidenceReceipt(certificate);
  if (JSON.stringify(expectedReceipt) !== JSON.stringify(receipt)) {
    throw new Error(`${name}: receipt does not match the certificate`);
  }
  if (receipt.receiptId !== certificate.reportHash) {
    throw new Error(`${name}: receipt ID does not match the report hash`);
  }

  results.push({
    name,
    fixtureId: certificate.report.identity.fixtureId,
    verdict: certificate.report.verdict.label,
    reportHash: certificate.reportHash,
    receiptId: receipt.receiptId,
    replayVerified: true,
  });
}

console.log(JSON.stringify({ schema: "dervyx-fixture-verification-v1", fixtures: results }, null, 2));
