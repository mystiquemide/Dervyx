import assert from "node:assert/strict";
import test from "node:test";

import { redactProviderUrl } from "../src/security.js";

test("configured provider URLs are fully redacted", () => {
  assert.equal(
    redactProviderUrl("https://rpc.example.invalid/v1/secret-path?api_key=not-a-real-secret", "configured"),
    "[REDACTED_CONFIGURED_RPC]",
  );
});

test("public fallback URLs redact query values without exposing them", () => {
  assert.equal(
    redactProviderUrl("https://mainnet.base.org/?key=not-a-real-secret", "public_fallback"),
    "https://mainnet.base.org/?key=%5BREDACTED%5D",
  );
});

test("ordinary public fallback URL remains useful", () => {
  assert.equal(
    redactProviderUrl("https://mainnet.base.org", "public_fallback"),
    "https://mainnet.base.org",
  );
});
