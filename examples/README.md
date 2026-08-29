# Replayable proof fixtures

These certificates and receipts are labeled offline engine fixtures. They are
not live-chain evidence. Both are produced by the same deterministic engine
used by the application and can be replayed without network access.

| Fixture | Verdict | Report SHA-256 |
|---|---|---|
| `anomaly-certificate.json` | `ANOMALY` | `dd9d85ea22d607e877a084ae25041ded4df7c39732b235e3bbfcb669fb26adf1` |
| `control-certificate.json` | `CLEAN` | `11b9baca0aa39bc3fc8260faac038b3c02aca25b8e24f055d679ea0bed6953a7` |

Verify from a fresh checkout:

```bash
npm ci
npm run verify:fixtures
```

The verifier checks canonical sorted-key JSON, the report hash, the receipt
contents, and the receipt-to-report identity.
