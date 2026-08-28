# Dervyx proof walkthrough

Dervyx is easiest to understand through one controlled comparison.

## Paired proof

Open `/compare` and select **Run the paired proof**.

The page runs the same deterministic report engine twice over the same Base token scope:

1. **Unknown shared root**: three trading wallets converge on an unsourced funding root. Their observed share remains in the anomaly bucket.
2. **Known router root**: two wallets share a sourced router root. The relationship is visible, but the root policy excludes it from the anomaly share.

Read the certificate from top to bottom:

- **Observed share**: the residual share that qualifies as shared unknown-root coordination.
- **Attribution ledger**: every observed event is assigned once to unknown coordination, known infrastructure, attributed but unclustered activity, or unattributed residuals.
- **Coverage**: how much of the sampled origin set has an accepted funding path.
- **Report hash**: the canonical report identity.

The example pair is intentionally labeled and offline so it can be replayed instantly. It is a reproducible fixture, not live-chain evidence.

## Verify the artifact

Each certificate has two portable outputs:

- **Report JSON**: the complete canonical report and its SHA-256 hash.
- **Evidence receipt**: the compact counterfactual ledger and the verifier path.

Use the page's **Replay certificate** action, or verify a downloaded report from a fresh checkout:

```bash
npm ci
npm run verify:report -- report.json
```

A changed report fails hash verification. `EVIDENCE_READY` is reserved for records that carry a certified report.

## Live investigation

Open `/investigate`, keep **Live RPC (public fallback)** selected, and use a verified scope. Live reads can take up to about three minutes because Dervyx reads canonical Base swap logs, traces funding, checks block identity, and performs best-effort native-ETH enrichment.

The live path is read-only. It does not connect a wallet, sign, send a transaction, or execute a trade. Provider mode is shown in the resulting evidence.

## Machine access

`GET /api/agent` exposes the read-only HTTP/JSON contract, including supported modes, states, verdicts, tools, guarantees, and limitations. Other agents can discover the report, receipt, and verifier paths without relying on page text.

## Demo capture

A companion narrated screen recording follows the paired-proof path rather than a generic dashboard tour. It shows the landing question, the anomaly/control certificates, the ledger, receipt download, and replay verification. The video is distributed separately from the repository; no video binary is committed here.
