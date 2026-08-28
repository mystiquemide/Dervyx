# Dervyx

Dervyx is a read-only Base investigation agent for launchpad and exchange listing analysts. Give it one token and one fixed block window. It traces funding relationships behind observed swap activity, separates known infrastructure roots, and produces a certificate that another reviewer can verify by hash.

[Open Dervyx](https://dervyx.159.69.241.122.sslip.io/) · [Run an investigation](https://dervyx.159.69.241.122.sslip.io/investigate) · [Check status](https://dervyx.159.69.241.122.sslip.io/status)

![Dervyx landing page](./public/screenshots/landing.png)

## The problem

A token can show large volume while many trading wallets share a recent funding root. Reviewing that relationship usually means joining explorer transfers, DEX swaps, bridge activity, and wallet history by hand. Dervyx makes the scope explicit and returns the underlying evidence instead of an opaque risk score.

## How it works

1. **Scope** one Base token and a fixed block range.
2. **Read** canonical Uniswap v4 swap events and ERC-20 funding transfers.
3. **Trace** funding relationships up to two hops.
4. **Separate** known exchange, bridge, router, and market-maker roots from unknown roots.
5. **Certify** the observed share, coverage, exclusions, evidence links, and canonical JSON hash.
6. **Replay** the report in the browser or from the command line.

The optional model component may choose an allowlisted investigation branch from a sanitized summary. The deterministic engine owns every number, root classification, and verdict.

## Product flow

![Dervyx investigation page](./public/screenshots/investigate.png)

The live tool supports:

- Live Base RPC reads with provider mode shown explicitly
- An instant offline example using the same deterministic engine
- Source-linked evidence and BaseScan transaction links
- Downloadable JSON certificates
- Browser replay and hash verification
- Retry and narrower-range guidance for incomplete evidence
- Explicit `ANOMALY`, `CLEAN`, `UNKNOWN_ROOTS`, and `INSUFFICIENT_DATA` states

## Evidence contract

| Result | Meaning |
|---|---|
| `ANOMALY` | A material observed share traces to a shared unknown funding root within the requested scope |
| `CLEAN` | The observed scope has complete attribution and no qualifying unknown-root coordination |
| `UNKNOWN_ROOTS` | Coverage is incomplete, so the evidence is inconclusive |
| `INSUFFICIENT_DATA` | The scope does not contain enough supported evidence to issue a result |

Shared funding is evidence of a relationship, not proof of intent, ownership, coordination, or wrongdoing. Dervyx does not claim to prove criminal wash trading.

## Quick start

Requirements: Node.js 22.23.x and npm.

```bash
npm ci
cp .env.example .env
npm run typecheck
npm run typecheck:web
npm test
npm run build
npm start -- --hostname 127.0.0.1 --port 4760
```

Then open `http://127.0.0.1:4760/investigate`.

The production app runs as a Node.js Next.js server behind a Caddy reverse proxy. See [deployment notes](./docs/DEPLOYMENT.md).

## Environment

Copy `.env.example` to `.env`. The public Base RPC fallback and deterministic branch work without a model key. Keep `.env` local and untracked.

| Variable | Required | Purpose |
|---|---:|---|
| `BASE_RPC_URL` | No | Optional Base RPC endpoint. Defaults to the public Base mainnet RPC. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL used for social metadata. |
| `DERVYX_MODEL_BASE_URL` | No | OpenAI-compatible chat-completions base URL for optional branch selection. |
| `DERVYX_MODEL_API_KEY` | No | Local-only key for the optional model adapter. |
| `DERVYX_MODEL_NAME` | No | Model name for the optional branch selector. |
| `DERVYX_MODEL_TIMEOUT_MS` | No | Bounded model timeout. Defaults to 8000 ms. |

## Verification

The current release has been verified with:

- `npm run typecheck`
- `npm run typecheck:web`
- `npm test`, 55 tests passing
- `npm run build`
- `npm audit --omit=dev --audit-level=high`
- Live `/api/health`, `/status`, and `/investigate` checks
- Browser completion of the instant example flow
- Browser replay verification of the generated certificate

## Honest limitations

- Base mainnet is the first supported chain.
- The default provider is a public RPC fallback and is labeled as such.
- The primary workflow is read-only. Dervyx does not connect a wallet, sign, send transactions, or move funds.
- The example mode is synthetic but clearly labeled and runs through the same engine. It is not live-chain evidence.
- Funding coverage can be partial. Partial evidence never becomes a clean result.
- A running process keeps request state in memory. Restarting the server clears active investigation records.
- The product reports observable relationships. Human reviewers decide what those relationships mean.

## Orion Builder Hackathon

Dervyx is prepared for the [Orion Builder Hackathon](https://orionagents.org/hackathon). The application is self-contained and makes no unsupported claim about a private Orion runtime API or native platform integration.

## Repository layout

```text
app/                 Next.js pages and API route handlers
components/          Product UI and certificate components
lib/                 Next.js orchestration and labeled examples
src/                 Deterministic scope, evidence, graph, report, and engine code
test/                Engine and HTTP tests
fixtures/            Phase 0 input manifest
scripts/              Replay and report-audit utilities
public/screenshots/  Verified product screenshots
```

## License

MIT
