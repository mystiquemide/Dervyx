import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createScopeServer } from "../src/server.js";
import {
  BASE_CHAIN_ID,
  DEFAULT_MAX_BLOCK_SPAN,
  ScopeStore,
  normalizeScopeRequest,
} from "../src/scope.js";

const token = "0xB2000000000000000000000Ff4a547c891AB1b01";

function validRequest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    token,
    startBlock: 50121395,
    endBlock: 50123000,
    chainId: BASE_CHAIN_ID,
    mode: "cached",
    configVersion: "phase1-scope-v1",
    idempotencyKey: "fixture-baseunc-001",
    ...overrides,
  };
}

test("accepts a checksummed Base scope and normalizes numeric strings", () => {
  const result = normalizeScopeRequest(
    validRequest({ startBlock: "50121395", endBlock: "50123000" }),
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.token, token);
  assert.equal(result.value.startBlock, 50121395);
  assert.equal(result.value.endBlock, 50123000);
  assert.equal(result.scopeHash.length, 64);
});

test("rejects malformed and non-checksummed token addresses", () => {
  const malformed = normalizeScopeRequest(validRequest({ token: "0x123" }));
  assert.equal(malformed.ok, false);

  const lowercase = normalizeScopeRequest(validRequest({ token: token.toLowerCase() }));
  assert.equal(lowercase.ok, false);
  if (lowercase.ok) return;
  assert.equal(lowercase.issues[0]?.code, "INVALID_CHECKSUM");
});

test("rejects the wrong chain, reversed ranges, and oversized ranges", () => {
  const wrongChain = normalizeScopeRequest(validRequest({ chainId: 1 }));
  assert.equal(wrongChain.ok, false);
  if (!wrongChain.ok) assert.ok(wrongChain.issues.some((entry) => entry.code === "WRONG_CHAIN"));

  const reversed = normalizeScopeRequest(validRequest({ startBlock: 20, endBlock: 10 }));
  assert.equal(reversed.ok, false);
  if (!reversed.ok) assert.ok(reversed.issues.some((entry) => entry.code === "INVALID_RANGE"));

  const oversized = normalizeScopeRequest(
    validRequest({ endBlock: 50121395 + DEFAULT_MAX_BLOCK_SPAN }),
  );
  assert.equal(oversized.ok, false);
  if (!oversized.ok) assert.ok(oversized.issues.some((entry) => entry.code === "RANGE_TOO_LARGE"));
});

test("example IDs are explicit cached-only scope variants", () => {
  const control = normalizeScopeRequest(validRequest({ mode: "cached", exampleId: "control" }));
  assert.equal(control.ok, true);
  if (!control.ok) return;
  assert.equal(control.value.exampleId, "control");

  const live = normalizeScopeRequest(validRequest({ mode: "live", exampleId: "control" }));
  assert.equal(live.ok, false);
  if (!live.ok) assert.ok(live.issues.some((entry) => entry.code === "INVALID_EXAMPLE"));

  const anomaly = normalizeScopeRequest(validRequest({ mode: "cached", exampleId: "anomaly" }));
  assert.equal(anomaly.ok, true);
  if (anomaly.ok) assert.notEqual(anomaly.scopeHash, control.scopeHash);
});

test("rejects unknown fields and does not silently widen the contract", () => {
  const result = normalizeScopeRequest(validRequest({ rpcUrl: "https://example.invalid" }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.issues[0]?.code, "UNKNOWN_FIELD");
});

test("returns the existing record for a duplicate idempotency key", () => {
  const store = new ScopeStore();
  const first = normalizeScopeRequest(validRequest());
  assert.equal(first.ok, true);
  if (!first.ok) return;

  const created = store.create(first.value, first.scopeHash, new Date("2026-08-18T00:00:00.000Z"));
  const duplicate = store.create(first.value, first.scopeHash, new Date("2026-08-18T00:01:00.000Z"));
  assert.equal(created.kind, "created");
  assert.equal(duplicate.kind, "duplicate");
  if (created.kind === "created" && duplicate.kind === "duplicate") {
    assert.equal(duplicate.record.requestId, created.record.requestId);
    assert.equal(duplicate.record.createdAt, created.record.createdAt);
  }
});

test("rejects a conflicting payload that reuses an idempotency key", () => {
  const store = new ScopeStore();
  const first = normalizeScopeRequest(validRequest());
  const second = normalizeScopeRequest(validRequest({ endBlock: 50123001 }));
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;

  assert.equal(store.create(first.value, first.scopeHash).kind, "created");
  const conflict = store.create(second.value, second.scopeHash);
  assert.equal(conflict.kind, "conflict");
  if (conflict.kind === "conflict") assert.equal(conflict.issue.code, "IDEMPOTENCY_CONFLICT");
});

test("request IDs are random and old records are bounded out of the store", () => {
  const store = new ScopeStore();
  const first = normalizeScopeRequest(validRequest({ idempotencyKey: "retention-first" }));
  const second = normalizeScopeRequest(validRequest({ idempotencyKey: "retention-second" }));
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;

  const firstRecord = store.create(first.value, first.scopeHash, new Date("2026-08-18T00:00:00.000Z"));
  const secondRecord = store.create(second.value, second.scopeHash, new Date("2026-08-18T00:31:00.000Z"));
  assert.equal(firstRecord.kind, "created");
  assert.equal(secondRecord.kind, "created");
  if (firstRecord.kind === "created" && secondRecord.kind === "created") {
    assert.notEqual(firstRecord.record.requestId, secondRecord.record.requestId);
    assert.equal(store.get(firstRecord.record.requestId), undefined);
  }

  const bounded = new ScopeStore();
  const ids: string[] = [];
  const boundedNow = new Date();
  for (let index = 0; index < ScopeStore.MAX_RECORDS + 1; index += 1) {
    const input = normalizeScopeRequest(validRequest({ idempotencyKey: `bounded-${index}` }));
    assert.equal(input.ok, true);
    if (!input.ok) continue;
    const created = bounded.create(input.value, input.scopeHash, boundedNow);
    if (created.kind === "created") ids.push(created.record.requestId);
  }
  assert.equal(ids.length, ScopeStore.MAX_RECORDS + 1);
  assert.equal(bounded.get(ids[0]!), undefined);
  assert.ok(bounded.get(ids[ids.length - 1]!));
});

test("HTTP boundary exposes health, SCOPED creation, duplicate replay, and lookup", async (t) => {
  const server = createScopeServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    status: "ready",
    chainId: BASE_CHAIN_ID,
    mode: "scoped_analysis",
  });

  const create = await fetch(`${baseUrl}/api/investigations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validRequest()),
  });
  assert.equal(create.status, 201);
  const record = (await create.json()) as { requestId: string; state: string; chainId: number };
  assert.match(record.requestId, /^inv_[0-9a-f]{32}$/);
  assert.equal(record.state, "SCOPED");
  assert.equal(record.chainId, BASE_CHAIN_ID);

  const duplicate = await fetch(`${baseUrl}/api/investigations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validRequest()),
  });
  assert.equal(duplicate.status, 200);
  const duplicateRecord = (await duplicate.json()) as { requestId: string };
  assert.equal(duplicateRecord.requestId, record.requestId);

  const lookup = await fetch(`${baseUrl}/api/investigations/${record.requestId}`);
  assert.equal(lookup.status, 200);
  assert.equal((await lookup.json()).requestId, record.requestId);
});

test("serves the primary accessible form without wallet integration", async (t) => {
  const server = createScopeServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address() as AddressInfo;
  const response = await fetch(`http://127.0.0.1:${address.port}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(response.headers.get("content-security-policy") ?? "", /default-src 'none'/);
  const html = await response.text();

  assert.match(html, /<form id="investigation-form"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Token address/);
  assert.match(html, /name="startBlock"/);
  assert.match(html, /name="endBlock"/);
  assert.match(html, /name="mode"/);
  assert.match(html, /name="idempotencyKey"/);
  assert.match(html, /\/api\/investigations/);
  assert.match(html, /result-funding-coverage/);
  assert.match(html, /result-root-paths/);
  assert.match(html, /placeholder="Paste a token address"/);
  assert.doesNotMatch(html, /value="0xB2000000000000000000000Ff4a547c891AB1b01"/);
  assert.doesNotMatch(html, /window\.ethereum|eth_requestAccounts|Connect Wallet/);
});
