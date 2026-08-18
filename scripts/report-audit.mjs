// Read-only live report audit: runs the evidence lifecycle over both frozen Phase 0
// fixtures, certifies each result with the deterministic engine, prints the certificate
// summary, and writes each certificate JSON to /tmp for replay with verify-report.mjs.
// Public fallback only; no wallet, no writes. Run: npm run build && node scripts/report-audit.mjs
import { writeFileSync } from "node:fs";

import { createDefaultEvidenceRunner } from "../dist/src/evidence.js";
import { certifyEvidence } from "../dist/src/report.js";

const runner = createDefaultEvidenceRunner();

const fixtures = [
  { label: "BaseUnc (anomaly candidate)", token: "0xB2000000000000000000000Ff4a547c891AB1b01", key: "audit-baseunc" },
  { label: "USDC/USDT (control candidate)", token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", key: "audit-control" },
];

for (const fx of fixtures) {
  const record = {
    token: fx.token,
    startBlock: 50121395,
    endBlock: 50123000,
    chainId: 8453,
    mode: "live",
    configVersion: "phase1-scope-v1",
    idempotencyKey: fx.key,
    requestId: "audit",
    scopeHash: "audit",
    state: "INGESTING",
    providerMode: "not_connected",
    createdAt: new Date().toISOString(),
  };

  const started = Date.now();
  let res;
  try {
    res = await runner.run(record);
  } catch (error) {
    console.log(`\n${fx.label}: THREW ${error?.message ?? error}`);
    continue;
  }
  const ms = Date.now() - started;

  if (res.kind === "failed") {
    console.log(`\n${fx.label}: FAILED code=${res.error.code} retryable=${res.error.retryable} (${ms}ms)`);
    continue;
  }

  const cert = certifyEvidence(
    {
      token: record.token,
      chainId: record.chainId,
      startBlock: record.startBlock,
      endBlock: record.endBlock,
      mode: record.mode,
      scopeConfigVersion: record.configVersion,
    },
    res.evidence,
  );
  const r = cert.report;
  const outPath = `/tmp/dervyx-audit-${fx.key}.json`;
  writeFileSync(outPath, JSON.stringify(cert, null, 2));

  console.log(`\n${fx.label} (${ms}ms)`);
  console.log(`  verdict:   ${r.verdict.label} (${r.verdict.rationaleCode})`);
  console.log(`  share:     ${r.metric.numerator}/${r.metric.denominator} swap events = ${r.metric.ratioPercent}`);
  console.log(`  coverage:  ${(r.coverage.attributionCoverageBps / 100).toFixed(2)}% (${r.coverage.tradersAttributed}/${r.coverage.originsTotal} origins), funding=${r.coverage.fundingStatus}`);
  console.log(`  clusters:  ${r.coordinationClusters.length} coordination, ${r.knownRootExclusions.length} known-root exclusions`);
  console.log(`  sourceErr: native=${r.coverage.sourceErrors.native} erc20=${r.coverage.sourceErrors.erc20}`);
  console.log(`  hash:      ${cert.reportHash}`);
  console.log(`  written:   ${outPath}`);
}
