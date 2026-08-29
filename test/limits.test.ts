import assert from "node:assert/strict";
import test from "node:test";

import { FixedWindowRateLimiter, LiveRunGate, publicClientKey } from "../src/limits.js";

test("live run gate caps concurrent work and never underflows", () => {
  const gate = new LiveRunGate(2);
  assert.equal(gate.activeRuns, 0);
  assert.equal(gate.tryAcquire(), true);
  assert.equal(gate.tryAcquire(), true);
  assert.equal(gate.tryAcquire(), false);
  assert.equal(gate.activeRuns, 2);
  gate.release();
  assert.equal(gate.activeRuns, 1);
  assert.equal(gate.tryAcquire(), true);
  gate.release();
  gate.release();
  gate.release();
  assert.equal(gate.activeRuns, 0);
});

test("fixed-window limiter returns a retry window and resets deterministically", () => {
  let now = 1_000;
  const limiter = new FixedWindowRateLimiter(2, 1_000, () => now);

  assert.deepEqual(limiter.tryConsume("client-a"), {
    allowed: true,
    limit: 2,
    remaining: 1,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(limiter.tryConsume("client-a"), {
    allowed: true,
    limit: 2,
    remaining: 0,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(limiter.tryConsume("client-a"), {
    allowed: false,
    limit: 2,
    remaining: 0,
    retryAfterSeconds: 1,
  });
  assert.equal(limiter.tryConsume("client-b").allowed, true);

  now = 2_000;
  assert.equal(limiter.tryConsume("client-a").allowed, true);
});

test("public client keys hash edge identity without retaining the raw value", () => {
  const raw = "203.0.113.42";
  const key = publicClientKey({
    get(name) {
      return name === "x-forwarded-for" ? `${raw}, 10.0.0.1` : null;
    },
  });

  assert.equal(key.length, 32);
  assert.equal(key.includes(raw), false);
  assert.notEqual(key, publicClientKey({ get: () => "198.51.100.9" }));
});

test("fixed-window limiter bounds rotated client keys", () => {
  let now = 5_000;
  const limiter = new FixedWindowRateLimiter(1, 10_000, () => now, 2);

  limiter.tryConsume("client-a");
  limiter.tryConsume("client-b");
  limiter.tryConsume("client-c");
  assert.equal(limiter.trackedKeys, 2);

  now = 15_000;
  limiter.tryConsume("client-d");
  assert.equal(limiter.trackedKeys, 1);
});
