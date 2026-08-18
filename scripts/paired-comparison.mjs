// Read-only dev runner: executes the live evidence lifecycle against the two frozen
// Phase 0 fixtures and prints a funding-source comparison. Public fallback only; no
// wallet, no writes. Run: npm run build && node scripts/paired-comparison.mjs
import { createDefaultEvidenceRunner } from "../dist/src/evidence.js";

const runner = createDefaultEvidenceRunner();

const fixtures = [
  { label: "BaseUnc (anomaly candidate)", token: "0xB2000000000000000000000Ff4a547c891AB1b01", key: "paired-baseunc" },
  { label: "USDC/USDT (control candidate)", token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", key: "paired-control" },
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
    requestId: "runner",
    scopeHash: "runner",
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
    console.log(`  ${res.error.message}`);
    continue;
  }

  const f = res.evidence.funding;
  const known = f.graph.paths.filter((p) => p.root.class !== "unknown").length;
  const unknown = f.graph.paths.filter((p) => p.root.class === "unknown").length;
  console.log(`\n${fx.label}: EVIDENCE_READY (${ms}ms) status=${f.status}`);
  console.log(`  swaps=${res.evidence.eventCount} originsTotal=${f.originsTotal} sampled=${f.originsRequested} originsWithEdges=${f.originsWithEdges}`);
  console.log(`  edges=${f.edges.length} (native_internal=${f.nativeEdgeCount}, canonical_erc20=${f.erc20EdgeCount})`);
  console.log(`  graphPaths=${f.graph.paths.length} known-root=${known} unknown-root=${unknown}`);
  console.log(`  chunksRead=${f.chunksRead} pagesRead=${f.pagesRead} sourceErrors: native=${f.sourceErrors.native} erc20=${f.sourceErrors.erc20}`);
}
