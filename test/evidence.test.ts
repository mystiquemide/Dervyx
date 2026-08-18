import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import type { AddressInfo } from "node:net";
import type { Address, Hex } from "viem";
import { createScopeServer } from "../src/server.js";
import type { EvidenceRunner } from "../src/evidence.js";
import { BASE_CHAIN_ID, ScopeStore, type EvidenceSnapshot } from "../src/scope.js";

const token = "0xB2000000000000000000000Ff4a547c891AB1b01";
const poolId = "0x1ee8db5e1df2386aa078cf866b83d90ca559757b4c98276694f5d7698c3570d8";

function requestBody(key: string): Record<string, unknown> {
  return {
    token,
    startBlock: 50121395,
    endBlock: 50123000,
    chainId: BASE_CHAIN_ID,
    mode: "live",
    configVersion: "phase1-scope-v1",
    idempotencyKey: key,
  };
}

const readyEvidence: EvidenceSnapshot = {
  fixtureId: "baseunc-v4-launch-window",
  poolId,
  providerMode: "public_fallback",
  rpcUrl: "https://mainnet.base.org",
  range: {
    startBlock: 50121395,
    endBlock: 50123000,
    startHash: `0x${"11".repeat(32)}`,
    endHash: `0x${"22".repeat(32)}`,
  },
  rawEventCount: 1,
  eventCount: 1,
  events: [
    {
      chainId: BASE_CHAIN_ID,
      poolId: poolId as Hex,
      contractAddress: "0x498581fF718922c3f8e6A244956aF099B2652b2b",
      blockNumber: 50121422,
      blockHash: `0x${"33".repeat(32)}` as Hex,
      transactionHash: `0x${"44".repeat(32)}` as Hex,
      logIndex: 1,
      sender: "0x01104DF70F98EB61b8391f28DC7BA252698e4340" as Address,
      origin: "0x01104DF70F98EB61b8391f28DC7BA252698e4340" as Address,
      amount0: "-1",
      amount1: "2",
      sqrtPriceX96: "3",
      liquidity: "4",
      tick: 5,
      fee: 0,
      source: {
        providerMode: "public_fallback",
        rpcUrl: "https://mainnet.base.org",
        method: "eth_getLogs",
        originMethod: "eth_getTransactionByHash",
      },
    },
  ],
};

async function startServer(runner: EvidenceRunner) {
  const server = createScopeServer(new ScopeStore(), runner);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function waitForFinal(baseUrl: string, requestId: string): Promise<any> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`${baseUrl}/api/investigations/${requestId}`);
    const record = await response.json();
    if (record.state !== "INGESTING") return record;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error("evidence test timed out");
}

test("evidence endpoint transitions an investigation to EVIDENCE_READY", async (t) => {
  const runner: EvidenceRunner = { run: async () => ({ kind: "ready", evidence: readyEvidence }) };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const createdResponse = await fetch(`${baseUrl}/api/investigations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestBody("evidence-ready-001")),
  });
  const created = await createdResponse.json();
  assert.equal(created.state, "SCOPED");

  const startedResponse = await fetch(`${baseUrl}/api/investigations/${created.requestId}/evidence`, {
    method: "POST",
  });
  assert.equal(startedResponse.status, 202);
  assert.equal((await startedResponse.json()).state, "INGESTING");

  const finalRecord = await waitForFinal(baseUrl, created.requestId);
  assert.equal(finalRecord.state, "EVIDENCE_READY");
  assert.equal(finalRecord.evidence.eventCount, 1);
  assert.equal(finalRecord.evidence.events[0].transactionHash, `0x${"44".repeat(32)}`);
  assert.equal(finalRecord.providerMode, "not_connected");
});

test("evidence endpoint exposes retryable provider failure", async (t) => {
  const runner: EvidenceRunner = {
    run: async () => ({
      kind: "failed",
      error: { code: "RPC_UNAVAILABLE", message: "Provider unavailable.", retryable: true },
    }),
  };
  const { server, baseUrl } = await startServer(runner);
  t.after(() => server.close());

  const createdResponse = await fetch(`${baseUrl}/api/investigations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestBody("evidence-retryable-001")),
  });
  const created = await createdResponse.json();
  await fetch(`${baseUrl}/api/investigations/${created.requestId}/evidence`, { method: "POST" });

  const finalRecord = await waitForFinal(baseUrl, created.requestId);
  assert.equal(finalRecord.state, "RETRYABLE");
  assert.equal(finalRecord.evidenceError.code, "RPC_UNAVAILABLE");
  assert.equal(finalRecord.evidenceError.retryable, true);
});
