import assert from "node:assert/strict";
import test from "node:test";

import { LiveRunGate } from "../src/limits.js";

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
