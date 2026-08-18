# Dervyx Project State

## Project

- Plan file: PROJECT_PLAN.md
- Status: Phase 6 complete and live-verified; the agent branch is wired into the lifecycle (model choice applies a bounded maxHopsConsidered in the certificate, trace on record + page), numbers/verdict stay engine-owned, and a genuine Groq qwen3.6-27b end-to-end run returned mode=model (chose early_stop, differing from the deterministic fallback)
- Current phase: Phase 7 - The complete workflow is credible and judge-ready
- Current checkpoint: P7-CP-001 (not started)
- Last updated: 2026-08-18
- Last agent: Executor
- Planning confidence: 75/100 (Medium)

## Source of Truth Order

1. Repository or observable system state
2. Executed verification evidence
3. Approved PROJECT_PLAN.md
4. PROJECT_STATE.md
5. Unverified notes

The repository proves what exists.

The plan defines intended scope, design, phases, and acceptance criteria.

This state file records execution history, current status, decisions, deviations, blockers, evidence, and handoff context.

## Execution Rules

1. Read the plan and state before changing project assets.
2. Inspect the actual environment before trusting prior state.
3. Follow phase dependencies and acceptance criteria.
4. Update this file after every checkpoint.
5. Do not mark tests as passed unless they ran successfully.
6. Record deviations and decisions.
7. Never erase checkpoint history.
8. End every session with one exact next action.
9. Keep entries factual and concise.
10. Change the plan only through the amendment protocol.

## Execution Strategy

- Selected sequence: Follow the approved functional vertical-slice order: Phase 0 evidence prerequisites, then Phase 1 request scope, followed by canonical evidence, graph/root classification, deterministic certificate, negative paths, bounded agent behavior, judge-ready UI, and submission verification.
- Reason: The plan makes the analyst outcome and proof gates precede implementation expansion and prevents a decorative UI from hiding missing evidence.
- User preference: Execute the approved plan one verified checkpoint at a time; do not push, merge, deploy, publish, spend, or use a wallet without explicit authorization.
- Constraints: Base-only, read-only analysis, no wallet custody, no fabricated Orion behavior, no definitive fraud claims, no mock central proof, and no optional attestation before the core gate passes.
- Revisit trigger: New evidence changes the Orion contract, selected fixture coverage, DEX event support, or a Phase 0 acceptance criterion.

## Current Objective

- Phase: Phase 7 - The complete workflow is credible and judge-ready
- Checkpoint: P7-CP-001 (not started)
- Goal: Deliver the one-page investigation experience end to end - evidence-first UI, clear live/cached/recorded mode, certificate with branch trace, download + replay reachable from the same surface, health status, and a timed demo path - so a clean browser completes both an anomaly and a clean control. Optional attestation is omitted unless verified and useful. Preserve determinism, unknown-by-default taxonomy, candidate-only anomaly language, public-fallback labeling, the read-only boundary, and never claim proof of wash trading.
- Expected files or assets: UI/usability/accessibility/responsive refinement over the existing primary page and endpoints, a report/replay path already present, and demo assets. Durable public report storage is gated by DEC-004 (ISSUE-004). Preserve all prior phases.
- Acceptance criteria (plan Phase 7):
  - A clean browser completes an anomaly and a clean control.
  - All visible actions work; live/cached/recorded mode is clear.
  - Download/replay is reachable from the same surface.
  - Optional attestation is omitted if not verified/useful.
- Required verification: Manual usability/accessibility/responsive pass, timed demo, and frame review.

## Current Status

### Completed

- Approved concept is WashGuard, renamed provisionally to Dervyx.
- Existing WIN-PLAN.md reviewed and preserved as a constraint.
- Product claim narrowed to a funding/volume anomaly certificate, not proof of criminal wash trading.
- Functional-vertical-slice plan created with P0/P1 scope, state model, requirements, risks, and verification gates.
- Official Base documentation and the current public Orion page were checked on 2026-08-18.
- Current Dervyx directory was inspected; before this planning pass it contained only WIN-PLAN.md.
- CP-001 Phase 0 prerequisite validation and bounded fixture freeze completed.
- Uniswap v4 Base PoolManager was selected as the first supported DEX/event adapter.
- A read-only Phase 0 fixture manifest was created for the BaseUnc candidate and the USDT/USDC same-protocol control candidate.
- P1-CP-001 request-scope API boundary implemented and verified.
- P1-CP-002 primary investigation page and request flow implemented and verified.
- P2-CP-001 Uniswap v4 canonical event adapter implemented and live-verified with the public fallback.
- P2-CP-002 evidence lifecycle integrated and live-verified end to end.
- P3-CP-001 deterministic two-hop funding graph and root taxonomy core implemented and verified.
- P3-CP-002 bounded native funding source integrated and live-verified in the evidence lifecycle.
- P3-CP-003 token-filtered funding comparison and partial-source retention implemented and tested.
- P3-CP-004 canonical `eth_getLogs` ERC-20 funding fallback implemented, tested, and live-verified; funding coverage no longer depends on Blockscout stability.
- Phase 3 exit gate passed: all Phase 3 acceptance criteria (FR-004, FR-005, BR-002, BR-007) verified against the deterministic source-linked graph; bounded funding scope frozen as approved (DEC-EXEC-009, no plan amendment required).
- P4-CP-001 deterministic report/metrics engine implemented and verified: cluster-linked swap-share metric (numerator/denominator/coverage/exclusions), four honest verdicts, sorted-key canonical JSON, SHA-256 report hash, and replay/verify - proven by ten golden and tamper tests plus a working `scripts/verify-report.mjs` replay command.
- P4-CP-002 certificate wired into the lifecycle: certified on EVIDENCE_READY, downloadable via `GET /api/investigations/{id}/report`, and rendered on the primary page; verified by three lifecycle tests, a local server smoke, and a live paired audit whose BaseUnc and control certificates both replay-verified.
- Phase 4 exit gate passed: positive proof (golden ANOMALY report + tamper/replay) exists independently of the UI; the live paired audit honestly returned UNKNOWN_ROOTS for both fixtures under bounded coverage rather than forcing a label.
- P5-CP-001 replay/tamper verification is inspectable: `POST /api/investigations/{id}/report/verify` returns self-consistency + stored-hash match, and the primary page has a "Replay & verify report" control; two lifecycle tests cover genuine/tampered/swapped/bad-body/404.
- P5-CP-002 negative controls and recovery are visible: a known-router control certifies CLEAN with the router separated and zero numerator, partial coverage certifies UNKNOWN_ROOTS (never CLEAN), and the page exposes a retry-on-RETRYABLE button plus narrower-range guidance; two lifecycle tests added.
- Phase 5 exit gate passed: the negative proofs (control non-inflation, incomplete-never-clean, tamper/replay mismatch) are inspectable and instant via the certificate, verify endpoint/CLI, and deterministic tests; only the live evidence read itself is network-bounded.
- P6-CP-001 genuine agent branch decision engine: allowlisted branches, a sanitized model-visible summary + hash, an env-configured OpenAI-compatible adapter, and `chooseBranch` with structured-output validation, timeout, injection handling, and deterministic fallback - ten unit tests, no number or verdict touched. DEC-006 resolved (DEC-EXEC-012).
- P6-CP-002 branch wired into the lifecycle: `runEvidence` builds a sanitized summary from a baseline certificate, calls `chooseBranch`, and applies the branch's bounded `maxHopsConsidered` in the final certificate (branch is recorded in report identity); the branch decision is attached to the record and shown on the page. State flips to EVIDENCE_READY only once the branch + report are attached. Verified end to end against a genuine Groq qwen3.6-27b call (mode=model, chose early_stop) with numbers/verdict engine-owned.
- Phase 6 exit gate passed: agent behavior is observable (branch, source/mode, summary hash, rationale on record + page) and useful in the real actor flow (branch changes the deterministic hop depth), verified with a live model run.

### In Progress

- Native-ETH funding still comes only from Blockscout internal transfers as best-effort enrichment; on the P3-CP-004 live run it was largely unavailable (BaseUnc 23 source errors, control 21 source errors), while the canonical ERC-20 source returned zero errors for both fixtures.

### Blocked

- Orion's `.ai` domain remains a placeholder; the `.org` surface exposes submission/listing behavior but its official relationship to the supplied brief and any native runtime contract is unverified.
- The Phase 0 fixture pair is frozen as an anomaly candidate and control candidate; final ANOMALY/CLEAN verdicts require the deterministic engine.
- The Phase 0 taxonomy is source-by-source with unknown-by-default policy; no bulk third-party allowlist is redistributed.
- Production provider and quota contract is not selected; public Base RPC remains an explicitly labeled read-only fallback and is not a production-capability claim.
- Funding edges are attached to live evidence as a bounded partial sample; swap events alone are not used to establish root relationships.

### Not Started

- Phase 2 provider capability and quota verification.
- Broader-than-top-30 origin coverage and native-ETH funding beyond best-effort Blockscout.
- Broader funding coverage and sourced root-taxonomy population.
- Agent branch/fallback.
- Web investigation flow.
- Negative/failure path.
- Optional attestation.
- Deployment, README, demo, and submission.

## Checkpoint Log

### CP-000: Planning completed

- Status: Complete
- Date: 2026-08-18
- Agent: Planner
- Phase: Planning
- Objective: Produce the project plan and execution state for a functional, evidence-first Dervyx build.
- Files or assets changed:
  - PROJECT_PLAN.md
  - PROJECT_STATE.md
- Commands or checks run:
  - Read universal-project-planner skill instructions in full.
  - Inspected Dervyx directory and existing WIN-PLAN.md.
  - Inspected local Orion validation artifact.
  - Checked https://orionagents.ai/ and observed the Portuguese placeholder page.
  - Checked current Base documentation for chain IDs, JSON-RPC log access, finality, and Base MCP scope.
  - Verified required plan/state headings after writing.
- Test results: No implementation tests were run. No production code exists.
- Acceptance criteria verified:
  - Required planning sections are present in PROJECT_PLAN.md.
  - This file contains source-of-truth order, execution rules, CP-000, amendment protocol, and next exact action.
  - Scope, invariant, actor, sponsor uncertainty, positive proof, and negative proof are explicit.
- Decisions:
  - Preserve Base-only, two-hop, known-root-filtered anomaly certificate scope.
  - Keep the primary surface read-only and web-based; no wallet custody.
  - Treat Base RPC/explorer as load-bearing evidence infrastructure.
  - Treat Orion runtime integration as conditional until live documentation is verified.
  - Keep optional attestation outside P0.
- Deviations: None.
- Risks introduced: None; planning only.
- Known issues: Orion public-domain mismatch; fixture/DEX/root-source decisions unresolved.
- Blockers: BLK-001, BLK-002, BLK-003 below.
- Next exact action: Verify the actual Orion registration/submission/agent endpoint from the live platform or supplied organizer documentation, then record DEC-001.

### CP-001: Phase 0 prerequisite validation and bounded fixture freeze

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 0 - Evidence and sponsor prerequisites are locked
- Objective: Resolve the Phase 0 prerequisite decisions with read-only evidence, freeze one real Base anomaly candidate and one same-path control candidate, select the first DEX/event adapter, and preserve the unknown-by-default taxonomy boundary.
- Work completed:
  - Read the complete Dervyx `PROJECT_PLAN.md`, `PROJECT_STATE.md`, `WIN-PLAN.md`, and the local Orion validation artifact before changing project assets.
  - Rechecked `https://orionagents.ai/`; it remains a Portuguese coming-soon page with no visible hackathon, registration, submission, or native agent contract.
  - Observed `https://orionagents.org/submit` as a public submission/listing surface with required social links, wallet connection, DAO-voting flow, and an approximately 0.00527 ETH ignition sequence. Read-only `GET https://orionagents.org/api/agents` returned an empty list. No wallet connection, signature, payment, registration, or submission was performed.
  - Verified Base chain ID 8453 and current public RPC operation. Verified the official Uniswap v4 Base PoolManager deployment and the `Swap` event ABI.
  - Selected Uniswap v4 PoolManager `0x498581ff718922c3f8e6a244956af099b2652b2b` as the first supported adapter.
  - Frozen the same Base block window, 50121395 through 50123000, for both fixtures. The BaseUnc pool produced 426 swap events, 426 swap transactions, and 170 distinct transaction origins. The USDT/USDC control pool produced 133 swap events, 133 swap transactions, and 84 distinct origins.
  - Verified initialization logs, swap receipts, ERC-20 transfer logs, block timestamps, and explorer links for both fixtures.
  - Sampled inbound native funding through Blockscout internal-transaction records. The BaseUnc top-30-origin sample had 22 origins with inbound funding and a largest observed root fan-out of 9. The control sample had 13 origins with inbound funding and a largest observed root fan-out of 4. These are candidate evidence measures, not final verdicts.
  - Created `fixtures/phase0-fixture-manifest.json` containing fixed chain, pool, token, range, evidence, source, and limitation fields with no secrets.
- Files or assets changed: `fixtures/phase0-fixture-manifest.json`; `PROJECT_STATE.md`.
- Commands or checks run: Dervyx repository/status inspection; read-only Orion web extraction and search; public Orion endpoint GET probes; Base network stats; Uniswap deployment/interface source review; bounded `eth_getLogs`; transaction and receipt reads; ERC-20 metadata calls; Blockscout address and internal-transaction reads; fixture manifest JSON validation.
- Test results: Phase 0 read-only checks passed. No implementation test suite exists yet. A broad public-RPC initialization query returned HTTP 413; the same evidence was reproduced with bounded block windows and succeeded.
- Acceptance criteria verified:
  - DEC-001 has an evidence-backed outcome: treat Orion as an observed submission/listing candidate only; native runtime integration and official `.org`/`.ai` relationship remain unverified.
  - DEC-002 has an evidence-backed outcome: use Uniswap v4 PoolManager and its official `Swap` event for the first adapter.
  - DEC-003 has an evidence-backed outcome: freeze the BaseUnc anomaly candidate and USDT/USDC same-protocol control candidate in the manifest.
  - Both fixture records contain fixed chain, block, pool, token, source, and limitation fields without secrets.
  - Each fixture has independently inspectable swap and transfer evidence.
  - Root taxonomy uses source-linked known labels only and leaves unresolved roots `UNKNOWN`.
- Decisions: No Orion-specific code or native capability claim; no bulk third-party root allowlist; final ANOMALY/CLEAN labels remain owned by the deterministic engine.
- Deviations: None. The 413 response was handled by narrowing the read-only query range.
- Risks introduced: None. Only public read-only requests and a non-secret evidence manifest were created.
- Known issues: The `.org` Orion surface is observable but its official relationship to the supplied brief is not proven. The BaseUnc and USDT/USDC records are candidates, not final verdicts. Root-source licensing and broader two-hop coverage remain future work.
- Blockers: Native Orion integration and any wallet/ignition action remain blocked pending authoritative platform evidence and explicit authorization. These do not block the self-contained Phase 1 request-scope slice.
- Amendments: None.
- Next exact action: Begin P1-CP-001 by inspecting the Dervyx runtime/package state and implementing the smallest request-scope validation boundary with focused tests; preserve the Phase 0 manifest and do not add Orion-native behavior.

### P1-CP-001: Request-scope and idempotency API boundary

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 1 - An analyst can scope a real Base investigation
- Objective: Implement the smallest server-side request boundary that validates a Base token scope and produces an idempotent `SCOPED` request without reading chain data or invoking Orion.
- Work completed:
  - Added a pinned TypeScript/Node runtime baseline with `viem` for EIP-55 address validation and `zod` for strict request schemas.
  - Added validation for checksummed token address, Base chain ID 8453, nonnegative ordered block range, maximum 10,000-block span, explicit mode, configuration version, and bounded idempotency key.
  - Added deterministic scope SHA-256 and request identity generation.
  - Added in-memory idempotency handling: identical retries return the original record, while a reused key with a different scope returns a conflict.
  - Added read-only HTTP routes for `/health`, `POST /api/investigations`, and `GET /api/investigations/{id}` with bounded JSON input and safe error responses.
  - Added negative and HTTP integration tests for malformed input, wrong chain, range limits, unknown fields, duplicate requests, conflicts, health, creation, and lookup.
- Files or assets changed: `.gitignore`; `package.json`; `package-lock.json`; `tsconfig.json`; `src/scope.ts`; `src/server.ts`; `test/scope.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm install --ignore-scripts`; `npm run typecheck`; `npm run build`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`.
- Test results: Typecheck and build passed. Seven tests passed, zero failed. Production dependency audit reported zero vulnerabilities. The HTTP test exercised the real server boundary in-process.
- Acceptance criteria verified:
  - Valid Base fixture request reaches `SCOPED` with request ID, scope hash, chain ID, mode, config version, and provider mode.
  - Malformed/checksum-invalid token, wrong chain, reversed range, oversized range, and unknown fields are rejected.
  - Duplicate idempotency returns the original request; conflicting reuse is rejected.
  - HTTP health, create, duplicate, and lookup behavior are exercised.
- Decisions: Use Node's built-in HTTP server and test runner for this bounded slice instead of adding a web framework or test framework. Keep persistence, RPC ingestion, and UI behavior outside this checkpoint.
- Deviations: None.
- Risks introduced: The request store is in-memory and resets on process restart; persistence is intentionally deferred to a later phase.
- Known issues: The primary page is not implemented yet, so the Phase 1 phase-exit gate is not complete.
- Blockers: None for this API sub-checkpoint. Orion integration remains out of scope and blocked as recorded above.
- Amendments: None.
- Next exact action: Implement P1-CP-002 as a minimal accessible HTML form backed by the request API, then exercise success, rejection, and duplicate/conflict rendering.

### P1-CP-002: Primary investigation page and scope flow

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 1 - An analyst can scope a real Base investigation
- Objective: Deliver the natural primary surface for bounded scope creation without adding live chain reads, graph calculations, model behavior, wallet access, or Orion integration.
- Work completed:
  - Added a server-served accessible HTML investigation form with token, block range, mode, chain ID, config version, and replay-key controls.
  - Added visible SCOPED result fields for request ID, scope hash, chain ID, mode, config version, and provider mode.
  - Added actionable status text for validation rejection, duplicate replay, network failure, and accepted scope.
  - Kept all displayed values sourced from the request API or static configuration; user-entered values are never interpolated into HTML.
  - Added no wallet provider hooks, no external scripts, no RPC call from the browser, and no Orion claim.
  - Added response hardening: no-sniff, no-referrer, no-store, and a self-contained CSP for the static page.
- Files or assets changed: `src/page.ts`; `src/server.ts`; `test/scope.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm ci --ignore-scripts`; `npm audit --audit-level=high`; real-process `npm start` smoke on loopback; static page/accessibility and secret-marker hygiene checks; `git diff --check`.
- Test results: Typecheck and build passed. Eight tests passed, zero failed. Clean `npm ci` reproduced the dependency install. Full audit reported zero vulnerabilities. Real-process smoke returned HTTP 200 for `/health` and `/`, and HTTP 201 with `SCOPED` for a valid investigation request.
- Acceptance criteria verified:
  - One primary action submits a valid scope and displays SCOPED, chain ID, mode, config version, request ID, and scope hash.
  - API rejection and idempotency behavior are represented by the same visible status/result surface.
  - Form labels, keyboard-focus styles, text status labels, mobile layout, and reduced-motion handling are present.
  - The page does not request wallet access or claim live RPC evidence.
- Decisions: Keep the first UI framework-free and server-served to prove the actor flow before adding a framework or deployment dependency. Use cached fixture defaults only as a real, clearly scoped example.
- Deviations: None.
- Risks introduced: The page is a local/static scope surface; canonical RPC reads and durable request state remain unimplemented.
- Known issues: Phase 2 still needs a provider/quota decision and canonical evidence adapter. The live mode option is visible but reports `providerMode: not_connected` until that slice is implemented.
- Blockers: None for Phase 1. Phase 2 canonical ingestion is gated by provider/quota verification and bounded RPC integration tests.
- Amendments: None.
- Next exact action: Verify the selected Base RPC provider and quotas for P2-CP-001, then implement range-bounded canonical block/log reads with block-hash consistency and explicit failure states.

### P2-CP-001: Canonical Uniswap v4 evidence adapter

- Status: Partial
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 2 - The analyst sees canonical Base evidence
- Objective: Add a bounded, source-linked Uniswap v4 log adapter that validates Base chain identity, splits ranges, deduplicates event identity, verifies block hashes, and fails closed on provider or event-shape errors.
- Work completed:
  - Added `src/chain.ts` with a typed canonical RPC client boundary and Uniswap v4 `Swap` event normalization.
  - Added Base chain-ID validation, pool-ID validation, range and event caps, 500-block chunking, duplicate identity handling, source metadata, and canonical block-hash verification.
  - Added bounded retries and low concurrency for public-provider header reads after the first live attempt exposed transient public-RPC pressure.
  - Added typed failure classes for wrong chain, provider failure, block mismatch, invalid event, invalid scope, and event-limit conditions.
  - Added fake-client tests for chunking, dedupe, source identity, wrong chain, block mismatch, provider failure, invalid payload, and event limits.
  - Ran the rebuilt adapter against the public Base fallback for both frozen fixtures. BaseUnc returned 426 raw and 426 normalized events. USDT/USDC returned 133 raw and 133 normalized events. Both matched the manifest and verified start/end and event block hashes.
- Files or assets changed: `src/chain.ts`; `test/chain.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --audit-level=high`; live `readBaseUniswapV4Swaps` reads for both fixture pool IDs through `https://mainnet.base.org`.
- Test results: Typecheck passed. Fourteen tests passed, zero failed. Full dependency audit reported zero vulnerabilities. Live fixture reads matched the manifest exactly.
- Acceptance criteria verified:
  - Fixture event counts match the manifest for both frozen pools.
  - Every normalized event includes chain ID, pool ID, PoolManager address, block number/hash, transaction hash, log index, decoded fields, and source method/provider metadata.
  - Wrong-chain, provider-failure, block-mismatch, unsupported-payload, and event-cap paths fail closed in tests.
- Decisions: Use `https://mainnet.base.org` only as an explicitly labeled `public_fallback` for bounded evidence and tests. Do not claim production quotas, SLA, privacy, or provider readiness from this path.
- Deviations: The bounded public fallback was used before production provider selection; this does not change approved scope or acceptance criteria.
- Risks introduced: Public RPC rate limits and provider behavior remain unmeasured. The adapter is not yet connected to the investigation request lifecycle.
- Known issues: The first high-concurrency live verification hit a provider read failure; reduced concurrency and bounded retries resolved the rerun. Production provider selection and quota evidence remain open.
- Blockers: Phase 2 actor flow is not complete until canonical evidence is wired into investigation state/progress. Production provider and quota selection remains unresolved.
- Amendments: None.
- Next exact action: Wire the verified adapter into the investigation lifecycle so a scoped request can produce source-linked evidence or an explicit retryable/insufficient-data state.

### P2-CP-002: Evidence lifecycle integration

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 2 - The analyst sees canonical Base evidence
- Objective: Connect canonical evidence reads to investigation state and the primary page with explicit asynchronous progress and failure states.
- Work completed:
  - Extended investigation state with `SCOPED`, `INGESTING`, `EVIDENCE_READY`, `RETRYABLE`, and `INSUFFICIENT_DATA` transitions.
  - Added `POST /api/investigations/{id}/evidence` to start bounded evidence work and return `202 INGESTING`.
  - Added asynchronous evidence completion and polling through the existing investigation lookup route.
  - Added fixture mapping for the two verified Phase 0 token/pool candidates.
  - Added source-linked evidence snapshots containing pool ID, range hashes, event counts, normalized events, transaction hashes, log indexes, provider mode, and RPC method.
  - Updated the primary page to start live evidence, poll status, display event count and pool ID, and link the first retained event to BaseScan. Cached and recorded modes remain explicitly unavailable rather than fabricated.
  - Added unit tests for successful lifecycle completion and retryable provider failure.
  - Ran the complete real process against BaseUnc through the public fallback: scope creation returned 201, evidence start returned 202, polling reached `EVIDENCE_READY` with 426 source-linked events and the expected first transaction.
- Files or assets changed: `src/scope.ts`; `src/evidence.ts`; `src/server.ts`; `src/page.ts`; `test/evidence.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --audit-level=high`; real-process create/start/poll smoke through `http://127.0.0.1` using the public fallback.
- Test results: Typecheck passed. Sixteen tests passed, zero failed. Real lifecycle smoke reached `EVIDENCE_READY` with 426 raw and normalized events.
- Acceptance criteria verified:
  - Canonical events are visible through investigation state, not only a standalone module.
  - Successful reads produce source-linked evidence; provider failures produce `RETRYABLE` and unsupported modes/fixtures produce explicit incomplete states.
  - The primary page displays progress, provider mode, event count, pool ID, and a raw transaction link.
  - No wallet, Orion integration, or production provider claim was introduced.
- Decisions: Treat the verified public fallback as sufficient for bounded Phase 2 and move to Phase 3; keep production provider, quota, terms, privacy, and deployment readiness open.
- Deviations: Continued Phase 2 proof using the explicitly labeled public fallback before production provider selection. No scope or acceptance criteria changed.
- Risks introduced: Evidence snapshots are in-memory and can be lost on process restart. Public fallback rate limits and production privacy remain unverified.
- Known issues: Cached and recorded evidence modes are not connected; only live reads for the two verified fixtures are supported.
- Blockers: Production provider readiness remains open, but it does not block Phase 3 deterministic graph development over the verified evidence contract.
- Amendments: None.
- Next exact action: Implement P3-CP-001 two-hop funding traversal and source-linked root evidence over normalized canonical events.

### P3-CP-001: Deterministic funding graph and root taxonomy core

- Status: Partial
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 3 - The analyst can trace funding and roots
- Objective: Implement deterministic two-hop funding traversal, root classification, duplicate-edge handling, component IDs, and explicit truncation/unknown states.
- Work completed:
  - Added `src/graph.ts` with fixed two-hop traversal, deterministic ordering, source-preserving funding edges, connected components, root taxonomy, unknown-by-default classification, duplicate identity handling, and edge-cap truncation.
  - Added `StaticRootTaxonomy` with versioned source-backed entries and explicit `UNKNOWN` fallback.
  - Added `GraphError` paths for invalid edges, conflicting duplicate identities, invalid taxonomy, and invalid traversal configuration.
  - Added golden graph tests for deterministic paths, known-root segregation, unknown roots, duplicate events, truncation, conflicting edges, and fixed two-hop behavior.
- Files or assets changed: `src/graph.ts`; `test/graph.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --audit-level=high`.
- Test results: Typecheck passed. Twenty tests passed, zero failed. Graph tests pass with deterministic output and fail-closed error paths.
- Acceptance criteria verified:
  - Golden input paths reproduce deterministically regardless of edge input order.
  - Known roots are classified separately and unknown roots remain visible.
  - Duplicate funding identity does not inflate edges or paths.
  - Every graph edge retains transaction hash, block hash/number, log index, token, amount, and addresses.
- Decisions: Keep graph construction pure and provider-independent; attach only source-backed funding edges. Do not infer root ownership from shared funding.
- Deviations: None.
- Risks introduced: The live evidence adapter currently returns swap events but not funding-transfer edges, so this graph core is not yet part of the live investigation response.
- Known issues: Native ETH/internal funding and ERC-20 funding extraction remain unimplemented. The UI cannot display root paths until those edges are sourced and attached.
- Blockers: P3 actor acceptance is incomplete until funding-transfer sources are integrated into the evidence lifecycle.
- Amendments: None.
- Next exact action: Add a bounded funding-transfer source adapter for the verified fixture origins, then attach the graph snapshot and root paths to the evidence response.

### P3-CP-002: Bounded native funding source integration

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 3 - The analyst can trace funding and roots
- Objective: Source bounded native funding edges for the highest-activity verified origins and attach deterministic graph/root-path evidence to the live investigation response.
- Work completed:
  - Added `src/funding.ts` using the public Blockscout internal-transaction API with bounded origins, pages, per-origin edges, retries, and explicit per-origin errors.
  - Added transaction-origin resolution through `eth_getTransactionByHash`; the graph no longer treats Uniswap v4 indexed senders as traders.
  - Added native internal funding edges with block hash, transaction hash, trace index, amount, source type, and Blockscout source URL.
  - Attached funding coverage and graph snapshots to `EvidenceSnapshot` and displayed sampled coverage and root-path counts in the primary page.
  - Ran the full real investigation lifecycle against BaseUnc through the public fallback and Blockscout. The result reached `EVIDENCE_READY` with 426 swap events, 170 origins, 30 sampled origins, 18 origins with edges, 450 funding edges, 462 graph paths, four source errors, and all roots explicitly `UNKNOWN` under the empty source-backed taxonomy.
- Files or assets changed: `src/chain.ts`; `src/funding.ts`; `src/graph.ts`; `src/evidence.ts`; `src/scope.ts`; `src/page.ts`; `test/chain.test.ts`; `test/funding.test.ts`; `test/graph.test.ts`; `test/scope.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --audit-level=high`; real-process scope/start/poll smoke using public Base RPC and Blockscout.
- Test results: Typecheck passed. Twenty-two tests passed, zero failed. The real lifecycle produced source-linked funding edges and graph paths with explicit partial coverage.
- Acceptance criteria verified:
  - Funding-edge identity, source provenance, and native internal-transfer type are preserved.
  - The graph consumes live normalized origins and returns deterministic root paths.
  - Unknown roots remain visible; no root is classified as known without taxonomy evidence.
  - Partial coverage and source errors are visible in the evidence response and page.
- Decisions: Keep Blockscout internal transfers as a bounded enrichment source, not canonical truth. Keep all live roots `UNKNOWN` until a source-backed taxonomy entry is independently verified and approved.
- Deviations: Funding coverage is intentionally capped at the top 30 origins and three pages per origin to protect the public fallback and avoid implying full-universe coverage.
- Risks introduced: Native internal transfers do not cover ERC-20 funding transfers; root evidence is partial and cannot support a final anomaly verdict.
- Known issues: Broader origin coverage, ERC-20 funding extraction, and sourced known-root taxonomy remain open.
- Blockers: P3 final acceptance remains incomplete until funding coverage and taxonomy evidence are expanded or the report explicitly freezes the bounded partial result as the approved scope.
- Amendments: None.
- Next exact action: Add ERC-20 transfer funding extraction and source-backed root taxonomy entries, then run the paired BaseUnc/control graph comparison without final fraud claims.

### P3-CP-003: Token-filtered funding comparison

- Status: Partial
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 3 - The analyst can trace funding and roots
- Objective: Extend bounded funding evidence to fixture-specific ERC-20 transfers and compare BaseUnc against the USDT/USDC control without treating source outages as evidence.
- Work completed:
  - Added token-filtered Blockscout transfer queries for the fixture token addresses.
  - Added canonical block-hash verification for ERC-20 transfer records and explicit `erc20_transfer` provenance.
  - Added separate ERC-20 origin and page caps, while retaining native funding edges when token enrichment fails.
  - Added tests for token filtering, canonical provenance, and native-edge retention on token-source failure.
  - Paired live comparison after the optimization produced: control 49 native edges, 4 known PoolManager paths, 71 unknown paths, 22 source errors; BaseUnc 0 edges, 30 unknown paths, 27 source errors on the latest run. Both remain `partial` and no verdict was emitted.
- Files or assets changed: `src/funding.ts`; `src/evidence.ts`; `src/scope.ts`; `src/page.ts`; `test/funding.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --audit-level=high`; token-filtered live runner for both frozen fixtures.
- Test results: Typecheck passed. Twenty-three tests passed, zero failed. The paired live comparison completed within the bounded run but exposed unstable Blockscout coverage.
- Acceptance criteria verified:
  - ERC-20 source is token-filtered, canonical-hash checked, and source-linked.
  - Native edges are retained when ERC-20 source reads fail.
  - Paired output separates edge counts, known/unknown paths, coverage, and source errors.
  - Incomplete funding never becomes a final ANOMALY or CLEAN verdict.
- Decisions: Treat Blockscout instability as a provider evidence gap, not as zero funding. Keep the comparison partial and preserve all source errors.
- Deviations: None.
- Risks introduced: ERC-20 and native funding coverage remains provider-dependent and bounded; BaseUnc had no funding edges in the latest attempt.
- Known issues: Full origin coverage, reliable Blockscout retrieval, canonical RPC transfer fallback, and broader sourced taxonomy remain open.
- Blockers: P3 final graph acceptance is blocked by unstable funding-source coverage and incomplete taxonomy evidence.
- Amendments: None.
- Next exact action: Add a canonical RPC transfer-log fallback or a reliable captured evidence source, then rerun the paired comparison before any anomaly/control conclusion.

### P3-CP-004: Canonical ERC-20 funding fallback

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 3 - The analyst can trace funding and roots
- Objective: Remove the funding graph's hard dependency on Blockscout by reading ERC-20 funding transfers directly from canonical `eth_getLogs`, keep Blockscout native-internal transfers as best-effort enrichment, and rerun the paired BaseUnc/control comparison without emitting a verdict.
- Work completed:
  - Added an ERC-20 `Transfer` event ABI, topic constant, and `RawTransferLog` shape to `src/chain.ts`, plus a `getTransferLogs` method on `CanonicalRpcClient` implemented in `createBaseRpcClient` via `viem` `getLogs` filtered by token address and an OR-set of recipient (`to`) origins.
  - Added `readCanonicalErc20Funding` in `src/funding.ts`: a bounded lookback window ending at the scope end block, 500-block chunking, per-chunk retry, per-origin `beforeBlock` filtering, zero-value and self-transfer rejection, edge-identity dedupe, an edge cap, and canonical block-hash verification for every surviving edge. Provider outages and hash mismatches are recorded as typed source errors instead of fabricating or zeroing edges. Each edge is source-linked to a BaseScan transaction URL.
  - Rewired `src/evidence.ts` to use canonical ERC-20 as the reliable token-funding source and Blockscout internal transfers as best-effort native enrichment on one shared RPC client, merging both edge sets into the deterministic graph and reporting native vs ERC-20 edge counts and provider errors separately.
  - Extended `FundingSnapshot` in `src/scope.ts` with `rpcUrl`, `nativeEdgeCount`, `erc20EdgeCount`, `chunksRead`, a `blockscout_internal_and_canonical_erc20` source mode, and a `sourceErrors` split. Preserved every field the primary page already renders.
  - Added `getTransferLogs` to the `FakeRpcClient` and shared test client, plus two focused tests: a source-linked, block-verified canonical ERC-20 read (with after-first-swap and self-transfer exclusions) and a provider-failure test that records an error without fabricating edges.
  - Added `scripts/paired-comparison.mjs`, a read-only dev runner that executes the live evidence lifecycle over both frozen fixtures and prints the source-separated funding comparison.
  - Ran the live paired comparison over the public fallback. BaseUnc reached `EVIDENCE_READY` (partial) with 426 swaps, 30 sampled origins, 84 funding edges (55 native internal, 29 canonical ERC-20), 29 origins with edges, 85 graph paths (25 known-root, 60 unknown-root), 23 native source errors, and zero ERC-20 source errors. The USDT/USDC control reached `EVIDENCE_READY` (partial) with 133 swaps, 30 sampled origins, 47 funding edges (0 native internal, 47 canonical ERC-20), 10 origins with edges, 67 graph paths (10 known-root, 57 unknown-root), 21 native source errors, and zero ERC-20 source errors. No verdict was emitted for either fixture.
- Files or assets changed: `src/chain.ts`; `src/funding.ts`; `src/evidence.ts`; `src/scope.ts`; `test/chain.test.ts`; `test/funding.test.ts`; `scripts/paired-comparison.mjs`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`; `node scripts/paired-comparison.mjs` against the public Base RPC and Blockscout.
- Test results: Typecheck passed. Twenty-five tests passed, zero failed (two new canonical-funding tests added). Production dependency audit reported zero vulnerabilities. No whitespace errors. The live paired comparison completed for both fixtures with zero canonical ERC-20 source errors.
- Acceptance criteria verified:
  - Canonical ERC-20 funding is read via `eth_getLogs`, token-filtered, canonical-block-hash verified, and source-linked to BaseScan.
  - A Blockscout outage no longer zeroes funding coverage: on the live run the control's native source failed entirely yet 47 canonical ERC-20 edges survived, and BaseUnc produced 29 canonical ERC-20 edges alongside its degraded native coverage.
  - Native and ERC-20 edge counts and provider errors are reported separately in the evidence snapshot.
  - Both fixtures remained `partial` and no ANOMALY/CLEAN verdict was emitted.
- Decisions: Treat canonical `eth_getLogs` ERC-20 transfers as the reliable, source-linked funding layer and Blockscout internal transfers as best-effort native enrichment (DEC-EXEC-008). Match the existing `<= beforeBlock` funding-window semantics for continuity rather than changing funding definitions in this checkpoint.
- Deviations: None. The canonical fallback covers ERC-20 transfers; native/internal ETH funding still requires Blockscout because public Base RPC does not expose trace/internal-transfer methods.
- Risks introduced: Canonical ERC-20 funding is bounded by a 10,000-block lookback and the top-30 origin sample, so it is not full-universe coverage. Same-block swap-output token transfers from the PoolManager can appear as edges but classify as a known router root, keeping them out of the unknown-root anomaly signal. The live lifecycle is slow on the public fallback (roughly three minutes per fixture) because origin resolution reads each swap transaction.
- Known issues: Native-ETH funding coverage remains provider-dependent and was largely unavailable on the latest run; broader origin coverage and a sourced known-root taxonomy remain open.
- Blockers: The ERC-20 portion of BLK-006 is resolved; native-ETH funding coverage remains constrained by Blockscout availability and unselected production providers.
- Amendments: None.
- Next exact action: Decide the native-ETH funding path for a verdict-capable graph - either select a trace/internal-transfer-capable provider or freeze the bounded canonical-ERC-20-plus-best-effort-native result as the approved P3 scope - then complete the Phase 3 exit gate. Preserve unknown-by-default taxonomy, candidate-only language, public-fallback labeling, and the read-only boundary.

### P3-EXIT: Phase 3 exit gate

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 3 - The analyst can trace funding and roots
- Objective: Resolve the open native-vs-provider decision and close the Phase 3 exit gate against the plan's acceptance criteria without over-claiming coverage.
- Decision taken: Freeze the bounded canonical-ERC-20 + best-effort-native funding result as the approved Phase 3 scope (DEC-EXEC-009). Rejected selecting a trace/internal-transfer-capable production provider now because that is gated by BLK-004 (unselected provider, terms, quotas, privacy), requires a managed credential against the secrets-stay-local posture, and is a paid/production decision that needs explicit authorization - not a Phase 3 requirement.
- Acceptance criteria verified against `PROJECT_PLAN.md` Phase 3:
  - "Expected fixture paths reproduce exactly" - Pass: deterministic, order-independent golden graph tests in the passing 25-test suite.
  - "Known roots segregate and unknown roots remain visible" - Pass: live paired run separated known-router paths from unknown paths (BaseUnc 25/60, control 10/57) with unknown-by-default taxonomy.
  - "Duplicate events do not inflate graph/volume" - Pass: edge-identity dedupe in the graph and canonical funding reader, covered by duplicate tests.
  - "Selected edge opens transaction/block/log evidence" - Pass: every edge retains chain, from/to, token, amount, block number/hash, transaction hash, log index, and a source URL (BaseScan for canonical ERC-20).
  - Exit gate "Core invariant is visible in a source-linked graph" - Pass: the live two-hop, source-linked graph shows funding relationships with infrastructure (Uniswap v4 PoolManager) classified as a known router and excluded from the unknown-root anomaly signal, and no verdict is emitted.
- Requirements mapped: FR-004 (two-hop traversal + provenance), FR-005 (versioned taxonomy + unknown retained), BR-002 (infrastructure separately classified), BR-007 (unknown stays unknown) are satisfied; none require native-ETH or full-universe coverage.
- Files or assets changed: `PROJECT_STATE.md`.
- Commands or checks run: `PROJECT_PLAN.md` Phase 3 acceptance/exit and requirement-definition review; reconciliation against the P3-CP-004 verification evidence already recorded above.
- Deviations: None. The bounded freeze meets the approved Phase 3 acceptance criteria as written, so no plan amendment is required. Native-ETH completeness and any production provider are deferred to Phase 4 report coverage/limitations and BLK-004.
- Risks introduced: None from this administrative gate. The standing coverage limitation (native-ETH funding provider-limited) is carried forward as ISSUE-010 and must be surfaced as explicit coverage/limitations in the Phase 4 certificate.
- Known issues: Phase 4 must decide how partial funding coverage maps to ANOMALY/CLEAN/insufficient so the certificate never forces a verdict on incomplete evidence.
- Blockers: None for entering Phase 4; BLK-004 still gates production/deployment claims only.
- Amendments: None.
- Next exact action: Begin P4-CP-001 by implementing a deterministic metrics/report module over the Phase 3 graph snapshot - numerator/denominator, root exclusions, explicit funding coverage and limitations, canonical JSON with stable ordering, a report hash, and a replay/verify path - with golden report and tamper tests, and no wash-trading claim.

### P4-CP-001: Deterministic anomaly certificate engine

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 4 - The analyst receives a reproducible certificate
- Objective: Turn the deterministic Phase 3 funding graph into a limitation-aware, byte-stable anomaly certificate with a visible metric, four honest verdicts, canonical JSON, a stable SHA-256 hash, and a replay/verify path - without claiming proof of wash trading.
- Requirements covered: FR-006, FR-007, FR-009, FR-012, BR-001, BR-003 through BR-008, NFR-003, NFR-004.
- Work completed:
  - Added `src/report.ts`, a pure engine over `FundingGraphSnapshot` plus per-origin swap counts, with no network access.
  - Metric `observed_cluster_linked_swap_share` (units: swap_events): numerator = swap events from wallets sharing an unknown two-hop funding root; denominator = total observed swap events; ratio in basis points with a derived percent string; per-cluster and per-known-root breakdown.
  - Coordination clusters are built only from shared UNKNOWN roots; known-infrastructure roots (e.g. Uniswap v4 PoolManager, class router) are listed as separate exclusions and never counted as coordinated traders (BR-002).
  - Four deterministic verdicts: ANOMALY (coordination and share at/above threshold), CLEAN (no coordination, complete funding, coverage at/above threshold), UNKNOWN_ROOTS (coordination below threshold or coverage too low for clean), INSUFFICIENT_DATA (no swaps or attribution coverage below the verdict floor). Partial funding can never be CLEAN (BR-003).
  - Sorted-key canonical JSON (ADR-007) that rejects non-integer/float numerics, drops undefined, and preserves array order; SHA-256 over the canonical bytes as the report identity; `verifyReport` recomputes and fails closed on any tamper or non-canonical value.
  - Report carries token, range, chain ID, scope/report/taxonomy/graph versions, thresholds, coverage, source-linked evidence edges, and fixed limitation copy including the not-proof-of-wash-trading disclaimer.
  - Added `reportInputFromEvidence` and `certifyEvidence` to map a live `EvidenceSnapshot` to a certificate; kept out of the HTTP/UI path in this checkpoint.
  - Added `scripts/verify-report.mjs`, a read-only replay command that recomputes a certificate's hash and exits nonzero on mismatch.
- Files or assets changed: `src/report.ts`; `test/report.test.ts`; `scripts/verify-report.mjs`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`; a real `node scripts/verify-report.mjs` smoke on a generated genuine and tampered certificate.
- Test results: Typecheck passed. Thirty-five tests passed, zero failed (ten new report tests). Production dependency audit reported zero vulnerabilities. No whitespace errors. Replay smoke: genuine certificate verified (ok=true, exit 0); tampered certificate failed (HASH_MISMATCH, exit 1); the generator hash matched the independent CLI recompute.
- Acceptance criteria verified:
  - A golden shared-unknown-root anomaly input produces ANOMALY (24/30 = 80.00%); a known-router control produces CLEAN with the router listed as an exclusion and numerator 0; partial coverage without coordination produces UNKNOWN_ROOTS; empty or unattributed evidence produces INSUFFICIENT_DATA.
  - Report includes numerator/denominator, coverage, exclusions, limitations, and source-linked evidence edges.
  - Two builds of the same input produce identical canonical bytes and hash; a tampered field and a float injection both fail verification.
  - A copy audit asserts the canonical JSON never affirmatively claims wash trading or fraud and always carries the not-proof disclaimer.
- Security checks: No secrets, no network, and no wallet path in the engine; the canonicalizer rejects non-integer numerics to prevent nondeterministic identity; no model can write any field (no model in this checkpoint); replay fails closed on tamper.
- Decisions: DEC-EXEC-010 (metric definition, verdict thresholds, and sorted-key canonicalization).
- Deviations: None. The engine is intentionally not yet wired into the HTTP response/primary page; that integration and the live paired report audit are Phase 4 exit / Phase 7 work.
- Amendments: None.
- Risks introduced: Verdict thresholds (anomaly 30% share, clean coverage 50%, verdict floor 5%) are an initial deterministic configuration versioned into the report identity; live tuning against the real fixtures remains open.
- Known issues: ISSUE-011 - the engine is verified with golden inputs and is not yet connected to the live investigation lifecycle; live BaseUnc/control verdicts depend on sourced taxonomy population and remain unproven.
- Blockers: None new. BLK-004 still gates production/provider claims only.
- Next exact action: Wire `certifyEvidence` into the evidence lifecycle so an EVIDENCE_READY request emits a canonical report + hash through the API/page, run a live paired BaseUnc/control report audit without forcing a verdict, then close the Phase 4 exit gate.

### P4-CP-002: Certify evidence in the investigation lifecycle

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 4 - The analyst receives a reproducible certificate
- Objective: Wire the deterministic certificate engine into the live investigation lifecycle so an EVIDENCE_READY request emits a canonical report + stable hash through the API and primary page, with a downloadable, replay-verifiable report artifact.
- Requirements covered: FR-009, FR-012, FR-015, NFR-003, NFR-006.
- Work completed:
  - Extended `ScopeRecord` with an optional `report` certificate and added `ScopeStore.attachReport`; `failEvidence` now also clears any stale report.
  - Server `runEvidence` certifies a completed snapshot with `certifyEvidence` and attaches it; certification failure is non-fatal (evidence stays ready without a report).
  - Added `GET /api/investigations/{id}/report`: returns the full certificate (`report`, `canonicalJson`, `reportHash`) as a downloadable attachment, 404 `REPORT_NOT_READY` when no report exists, 404 `NOT_FOUND` for unknown ids.
  - Added a certificate panel to the primary page (text verdict + rationale, observed cluster-linked share with numerator/denominator/percent, attribution coverage, coordination-cluster and known-root-exclusion counts, funding status, report hash, and a canonical-report download link) with no color-only meaning and the standing not-proof limitation line.
  - Added `connect-src 'self'` to the page CSP so the browser flow can reach the same-origin API (the prior policy inherited `default-src 'none'` for connections).
  - Added `scripts/report-audit.mjs`, a read-only live paired audit that certifies both frozen fixtures and writes replay-verifiable certificate JSON.
- Files or assets changed: `src/scope.ts`; `src/server.ts`; `src/page.ts`; `test/report-lifecycle.test.ts`; `scripts/report-audit.mjs`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`; a real `PORT=4753 node dist/src/server.js` smoke; `node scripts/report-audit.mjs`; `node scripts/verify-report.mjs` replay on both live certificates.
- Test results: Typecheck passed. Thirty-eight tests passed, zero failed (three new lifecycle tests). Production dependency audit reported zero vulnerabilities. No whitespace errors. Local smoke confirmed the CSP now includes `connect-src 'self'`, the served page includes the certificate section, and `GET /report` returns 404 for unknown ids.
- Acceptance criteria verified:
  - A funded snapshot reaches EVIDENCE_READY with a certificate attached; `GET /report` returns a downloadable certificate whose hash independently verifies (`verifyReport(...).ok === true`).
  - Evidence without funding stays EVIDENCE_READY with no report and `GET /report` returns REPORT_NOT_READY.
  - The primary page renders the verdict, metric, coverage, exclusions, hash, and download link; the not-proof disclaimer remains visible.
- Security checks: No secrets, no wallet path; the report route is read-only and leaks no internal errors; CSP tightened to same-origin connections; certification failure cannot crash the lifecycle.
- Live paired report audit (public fallback, read-only):
  - BaseUnc: verdict UNKNOWN_ROOTS (share 32/426 = 7.51%, coverage 17.06% = 29/170 origins, funding partial, 1 coordination cluster, 1 known-root exclusion, 29 native + 0 ERC-20 source errors); report hash 3fe74f31...; replay verified ok.
  - USDC/USDT control: verdict UNKNOWN_ROOTS (share 8/133 = 6.02%, coverage 11.90% = 10/84 origins, funding partial, 3 coordination clusters, 1 known-root exclusion, 27 native + 0 ERC-20 source errors); report hash 7510c68f...; replay verified ok.
  - Honest finding: neither live fixture reached ANOMALY. Under bounded top-30-origin coverage and the current source-linked taxonomy, both shares are below the 30% anomaly threshold and coverage is partial, so the engine returns the honest non-verdict UNKNOWN_ROOTS rather than forcing a label. The ANOMALY path is proven deterministically by the golden report tests, not by the live candidate.
- Decisions: DEC-EXEC-011.
- Deviations: Added `connect-src 'self'` to the P1/P2 page CSP - a minimal fix required for the browser flow to reach the API. No approved scope, architecture, or acceptance criterion changed.
- Amendments: None.
- Risks introduced: The lookup response now includes the full certificate (canonical JSON duplicated alongside the events array); payload trimming is deferred to the Phase 7 UI pass.
- Known issues: ISSUE-011 updated - the engine is wired end to end, but a live ANOMALY demonstration depends on deeper origin/hop coverage or sourced taxonomy; live fixtures currently classify as UNKNOWN_ROOTS.
- Blockers: None new. BLK-004 gates production provider claims only.
- Next exact action: Begin Phase 5 by exercising negative and recovery paths through the wired lifecycle - clean/unknown-root contrast, INSUFFICIENT_DATA on incomplete evidence, and a visible replay mismatch on tampered JSON.

### P4-EXIT: Phase 4 exit gate

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 4 - The analyst receives a reproducible certificate
- Objective: Confirm Phase 4 acceptance and close the exit gate "positive proof exists independently of the UI".
- Acceptance criteria verified against PROJECT_PLAN.md Phase 4:
  - "Anomaly fixture produces expected ANOMALY report" - Pass via golden report tests (the plan's specified verification): a shared-unknown-root input yields ANOMALY (80.00%) and a known-router control yields CLEAN, independent of the UI.
  - "Report has numerator/denominator, exclusions, coverage, limitations, and links" - Pass: verified in golden tests and in both live certificates.
  - "Replay matches; tampered JSON fails" - Pass: replay determinism plus tamper and float-injection failure are tested; both live certificates replay-verified via the CLI.
  - "No copy or field says result proves wash trading" - Pass: copy audit plus the standing not-proof disclaimer.
  - Exit gate "Positive proof exists independently of the UI" - Pass: the golden ANOMALY report and `scripts/verify-report.mjs` replay operate entirely outside the web/API surface.
- Requirements mapped: FR-006, FR-007, FR-009, FR-012, BR-001, BR-003 through BR-009, NFR-003, NFR-004 satisfied.
- Files or assets changed: `PROJECT_STATE.md`.
- Commands or checks run: reconciliation against P4-CP-001 and P4-CP-002 recorded evidence and the live paired audit results.
- Deviations: The live BaseUnc candidate does not currently reach ANOMALY (bounded coverage + below-threshold share -> UNKNOWN_ROOTS); positive proof is carried by golden reports as the plan specifies. Recorded as an honest limitation, not a gate failure.
- Risks introduced: None from this administrative gate.
- Known issues: The live-coverage/verdict limitation is carried into Phase 5/7 (ISSUE-011).
- Blockers: None for entering Phase 5; BLK-004 gates production/provider claims only.
- Amendments: None.
- Next exact action: Begin Phase 5 (negative enforcement and recovery are visible) over the wired lifecycle.

### P5-CP-001: Visible report replay and tamper verification

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 5 - Negative enforcement and recovery are visible
- Objective: Make report replay and tamper detection inspectable in the product so a reviewer can confirm a certificate reproduces its canonical hash and see a mismatch when the JSON is altered.
- Requirements covered: FR-009, FR-012, NFR-004; supports the Phase 5 "tamper/replay mismatch is visible" acceptance.
- Work completed:
  - Added `POST /api/investigations/{id}/report/verify`: recomputes the canonical hash of a supplied report, compares it to the supplied hash (self-consistency) and to the stored certificate hash (substitution check), and returns `{ ok, recomputedHash, suppliedHash, storedHash, selfConsistent, matchesStored, mismatchReason? }`. Returns 404 for unknown id / no report and 415/400/413 for bad content-type/body/oversize.
  - Added a "Replay & verify report" control to the primary-page certificate panel that fetches the stored report and POSTs it to the verify endpoint, then shows "Replay verified: canonical hash matches" or "Replay mismatch: <reason>" as text status (no color-only meaning).
  - Extended `test/report-lifecycle.test.ts` with two tests: genuine verify (ok, self-consistent, matches stored); tampered body and swapped hash (both not ok, not self-consistent); and bad-body 400 / unknown-id 404 / missing-report 404.
- Files or assets changed: `src/server.ts`; `src/page.ts`; `test/report-lifecycle.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`; a `PORT=4754 node dist/src/server.js` smoke (served replay control + verify route 404).
- Test results: Typecheck passed. Forty tests passed, zero failed (two new). Production dependency audit reported zero vulnerabilities. No whitespace errors. Smoke confirmed the served page includes the replay control and the verify route returns 404 for an unknown id.
- Acceptance criteria verified:
  - A genuine downloaded certificate verifies ok=true (self-consistent and matches stored).
  - A tampered report body or swapped hash returns ok=false with the mismatch surfaced (tamper/replay mismatch is visible).
  - The verify route is read-only and returns clear 400/404 for bad input.
- Security checks: Read-only endpoint; an untrusted supplied report is only canonicalized/hashed and the canonicalizer rejects floats/unsupported values, so malformed input fails closed; no secrets, no wallet path; body size bounded to 64 KiB.
- Decisions: None beyond DEC-EXEC-011.
- Deviations: None.
- Amendments: None.
- Risks introduced: None material; the verify endpoint compares hashes only and mutates no state.
- Known issues: The page replay control demonstrates the positive (match) path in-product; the mismatch path is exercised by tests and the CLI. Retry and narrower-range recovery affordances are P5-CP-002.
- Blockers: None. BLK-004 gates production/provider claims only.
- Next exact action: P5-CP-002 - add lifecycle contrast tests (clean/known-root control does not inflate; incomplete evidence is never CLEAN) and actionable recovery affordances (retry on RETRYABLE, narrower-range guidance), then run the Phase 5 exit gate.

### P5-CP-002: Negative controls and recovery are visible

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 5 - Negative enforcement and recovery are visible
- Objective: Prove through the wired lifecycle that a clean/known-root control does not inflate and that incomplete evidence is never labeled CLEAN, and expose actionable recovery on the primary page.
- Requirements covered: FR-011, FR-013, NFR-007, BR-003.
- Work completed:
  - Added a recovery region to the primary page: a narrower-range/retry hint plus a "Retry evidence read" button shown only for a RETRYABLE state.
  - Refactored the page evidence flow into a reusable `runEvidenceFlow(requestId)` with `showRecovery`/`hideRecovery`; RETRYABLE shows a retry action, evidence-level INSUFFICIENT_DATA shows narrower-range guidance, and a coverage-limited UNKNOWN_ROOTS/INSUFFICIENT_DATA verdict shows a narrower-range hint. Retry re-runs the same request id.
  - Extended `test/report-lifecycle.test.ts` with two lifecycle tests: a known-router control certifies CLEAN with the router as the only known-root exclusion and numerator 0; a partial-coverage snapshot certifies UNKNOWN_ROOTS (never CLEAN) with funding status partial.
- Files or assets changed: `src/page.ts`; `test/report-lifecycle.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`; a `PORT=4755 node dist/src/server.js` smoke (served recovery region + retry button).
- Test results: Typecheck passed. Forty-two tests passed, zero failed (two new). Production dependency audit reported zero vulnerabilities. No whitespace errors. Smoke confirmed the served page includes the recovery region, hint, and retry button.
- Acceptance criteria verified:
  - Clean control does not inflate: known router root separated as an exclusion, numerator 0, verdict CLEAN.
  - Incomplete evidence is never labeled clean: partial coverage certifies UNKNOWN_ROOTS.
  - Retry or narrower-range action is available where safe: retry button on RETRYABLE plus narrower-range guidance on insufficient/coverage-limited outcomes.
- Security checks: No secrets, no wallet path; retry re-runs the same read-only evidence request; recovery copy never claims proof of wash trading.
- Decisions: None beyond DEC-EXEC-011.
- Deviations: None.
- Amendments: None.
- Risks introduced: None material; the recovery flow reuses existing read-only endpoints.
- Known issues: None new.
- Blockers: None. BLK-004 gates production/provider claims only.
- Next exact action: Close the Phase 5 exit gate, then resolve DEC-006 (model provider/retention) before Phase 6.

### P5-EXIT: Phase 5 exit gate

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 5 - Negative enforcement and recovery are visible
- Objective: Confirm Phase 5 acceptance and close the exit gate "negative proof can be shown in under 30 seconds with inspectable evidence".
- Acceptance criteria verified against PROJECT_PLAN.md Phase 5:
  - "Clean control does not inflate because known roots are separated" - Pass: golden CLEAN test, the live control audit exclusion, and the P5-CP-002 lifecycle control test (numerator 0, router excluded).
  - "Incomplete evidence produces INSUFFICIENT_DATA / is not labeled clean" - Pass: golden INSUFFICIENT_DATA test and the P5-CP-002 partial-coverage lifecycle test (UNKNOWN_ROOTS, never CLEAN); BR-003 enforced in the engine.
  - "Tampered JSON produces a visible hash mismatch" - Pass: the P5-CP-001 verify endpoint, page replay control, verify tests, and the CLI.
  - "Retry or narrower-range action is available where safe" - Pass: P5-CP-002 recovery region.
- Exit gate "Negative proof can be shown in under 30 seconds with inspectable evidence" - Pass: the negative proofs are instant and inspectable via the certificate, the verify endpoint/CLI, and the deterministic tests (2s suite); only the live evidence read itself is network-bounded (~minutes on public fallback), which is a coverage/provider concern (BLK-004), not a negative-proof-latency gap.
- Requirements mapped: FR-011, FR-013, NFR-007, BR-003 satisfied.
- Files or assets changed: `PROJECT_STATE.md`.
- Commands or checks run: reconciliation against P5-CP-001 and P5-CP-002 recorded evidence.
- Deviations: None.
- Risks introduced: None from this administrative gate.
- Known issues: Live evidence-read latency is network-bounded (BLK-004); it does not block the negative-proof demonstration.
- Blockers: Phase 6 is gated on DEC-006 (model provider and retention policy, ISSUE-005), which involves cost/privacy/authorization and needs a user decision.
- Amendments: None.
- Next exact action: Resolve DEC-006 (choose a model provider/retention posture, or a provider-agnostic fallback-first scaffold) before starting Phase 6, or proceed to Phase 7 judge-ready polish which does not require a model.

### P6-CP-001: Genuine agent branch decision engine

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 6 - The agent chooses a bounded investigation branch
- Objective: Build the agent control plane so a model may only choose an allowlisted investigation branch, with deterministic code owning the branch->plan mapping and every number and verdict, and safe fallback on invalid, slow, or absent model output.
- Requirements covered: FR-008, NFR-003, NFR-007, AI controls (decision plane; lifecycle wiring and trace are P6-CP-002).
- Decision resolved: DEC-006 via DEC-EXEC-012 - an env-configured OpenAI-compatible chat-completions adapter (`DERVYX_MODEL_BASE_URL`, `DERVYX_MODEL_API_KEY`, `DERVYX_MODEL_NAME`, optional timeout), stateless, key kept local, working with any OpenAI-compatible provider.
- Work completed:
  - Added `src/branch.ts`: allowlist `standard | deeper_funding | pair_history | early_stop`; deterministic `BRANCH_PLANS` (bounded maxHopsConsidered / maxOrigins / focus).
  - Sanitized, model-visible `BranchSummary` (no raw counterparty addresses beyond the public token) and `summaryHashOf` built from the shared canonical JSON + SHA-256.
  - `validateBranchOutput` accepts only allowlisted branches and sanitizes/length-bounds the rationale; `deterministicBranch` is the rule-based fallback and safe default.
  - `chooseBranch` calls the adapter under an abort timeout and falls back deterministically on no provider, timeout, error, or non-allowlisted output, recording the mode and fallback reason.
  - `OpenAiCompatibleBranchAdapter` (temperature 0, JSON response format, bounded max_tokens, Bearer auth, no secret logging) and `branchAdapterFromEnv`.
- Files or assets changed: `src/branch.ts`; `test/branch.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`.
- Test results: Typecheck passed. Fifty-two tests passed, zero failed (ten new branch tests). Zero production vulnerabilities. No whitespace errors.
- Acceptance criteria verified (of the Phase 6 set):
  - Invalid or slow model output falls back safely: covered by injection/invalid-output, timeout, and error tests.
  - Numbers and verdict remain engine-owned: the branch module computes no metric or verdict.
  - (Branch changes the deterministic work path, and the trace display, are wired in P6-CP-002.)
- Security checks: The model sees only the sanitized summary; the API key is read from env and never logged; untrusted model output is validated against the allowlist and the rationale is stripped of control characters and truncated; timeout via AbortController.
- Decisions: DEC-EXEC-012 (resolves DEC-006).
- Deviations: None. The adapter is provider-agnostic by design; the user chose "genuine model now" and configures the provider via env.
- Amendments: None.
- Risks introduced: A genuine model call is only exercised when env is configured; until then the deterministic fallback runs, so a live model smoke is still pending provider credentials.
- Known issues: ISSUE-005 resolved by DEC-EXEC-012; a live model smoke still requires the operator to set the env vars.
- Live model verification: 2026-08-18, operator-supplied keys (not stored). The smoke first fell back (error) because Qwen3.6 is a reasoning model and `response_format: json_object` 400s on Groq while `<think>` reasoning broke JSON.parse. After hardening the adapter - drop `response_format`, raise max_tokens, and add `parseModelContent` to strip `<think>` and extract the first balanced JSON object (+1 unit test, fifty-three tests) - the genuine path returned mode=model with a validated branch and sanitized rationale from both Groq `qwen/qwen3.6-27b` (base `https://api.groq.com/openai/v1`) and Gemini 2.5 Flash (base `https://generativelanguage.googleapis.com/v1beta/openai`); both independently chose deeper_funding, matching the deterministic heuristic.
- Blockers: None. BLK-004 gates production/provider claims only.
- Next exact action: P6-CP-002 - wire `chooseBranch` into the lifecycle, apply the branch plan's maxHopsConsidered deterministically in the certificate, attach a branch trace to the record, surface it on the page, and add lifecycle + trace tests.

### P6-CP-002: Wire the agent branch into the lifecycle

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 6 - The agent chooses a bounded investigation branch
- Objective: Make the branch decision genuinely change the deterministic work path and be observable, while numbers and the verdict stay engine-owned.
- Requirements covered: FR-008, NFR-003, NFR-007.
- Work completed:
  - `src/report.ts`: `ReportInput`/`ReportIdentity` gained optional `branch` and `maxHopsConsidered`; `buildReport` skips funding paths deeper than `maxHopsConsidered` (default: all) and records branch/maxHops in the report identity (so a different branch is a different report identity, BR-008); `reportInputFromEvidence`/`certifyEvidence` take an optional branch plan.
  - `src/server.ts`: `runEvidence` builds a sanitized `BranchSummary` from a baseline certificate, calls `chooseBranch(summary, branchAdapterFromEnv(), {timeoutMs})`, then computes the final certificate with the branch's `maxHopsConsidered` applied. State is set to EVIDENCE_READY only after the branch and report are attached, so the poller never sees a ready state without a certificate even during a multi-second model call.
  - `src/scope.ts`: `ScopeRecord.branch` + `attachBranch`; `failEvidence` clears it.
  - `src/page.ts`: certificate panel shows the branch, branch source (model/fallback + rationale), and summary hash.
- Files or assets changed: `src/report.ts`; `src/server.ts`; `src/scope.ts`; `src/page.ts`; `test/report.test.ts`; `test/report-lifecycle.test.ts`; `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`; `npm test`; `npm audit --omit=dev --audit-level=high`; `git diff --check`; a `PORT=4756` page smoke; a genuine end-to-end lifecycle + Groq `qwen/qwen3.6-27b` smoke (operator key, not stored); a repo secret sweep.
- Test results: Typecheck passed. Fifty-five tests passed, zero failed (two new: the maxHops work-path/identity effect and the lifecycle branch trace). Zero production vulnerabilities. No whitespace errors. No secrets in source.
- Acceptance criteria verified:
  - Branch selection changes the deterministic work path: `early_stop` (maxHops 1) drops two-hop shared roots, removing the coordination cluster and changing the report and its hash.
  - Trace displays input summary hash, branch, mode, and result: attached to the record and rendered on the page.
  - Numbers and verdict remain engine-owned: the live run chose `early_stop` yet the verdict (ANOMALY) came from the deterministic engine over one-hop funding.
- Live end-to-end verification: a genuine Groq `qwen/qwen3.6-27b` run returned mode=model and chose `early_stop` (differing from the deterministic fallback `pair_history`), applied as maxHops 1 in the report identity, with EVIDENCE_READY only surfacing once the report was attached.
- Security checks: model sees only the sanitized summary; key from env, never logged or stored; branch changes only bounded hop depth, never thresholds or arithmetic; certification/branch failure is non-fatal (evidence still ready without a report).
- Decisions: None beyond DEC-EXEC-012.
- Deviations: None. Reordering completion after certification is an internal correctness fix (EVIDENCE_READY must imply a ready certificate), not a scope or acceptance change.
- Amendments: None.
- Risks introduced: With a model configured, the evidence lifecycle now includes a bounded model call (timeout via `DERVYX_MODEL_TIMEOUT_MS`, default 8s) before EVIDENCE_READY; on timeout/error it falls back deterministically.
- Known issues: None new.
- Blockers: None. BLK-004 gates production/provider claims only.
- Next exact action: Run the Phase 6 exit gate, then begin Phase 7 (judge-ready one-page workflow).

### P6-EXIT: Phase 6 exit gate

- Status: Complete
- Date: 2026-08-18
- Agent: Executor
- Phase: Phase 6 - The agent chooses a bounded investigation branch
- Objective: Confirm Phase 6 acceptance and close the exit gate "agent behavior is observable and useful in the real actor flow".
- Acceptance criteria verified against PROJECT_PLAN.md Phase 6:
  - "Branch selection changes the deterministic work path" - Pass: maxHops work-path test + the live run applying `early_stop`.
  - "Trace displays input summary hash, branch, mode, and result" - Pass: record branch trace + page rows.
  - "Invalid or slow model output falls back safely" - Pass: P6-CP-001 injection/timeout/error tests, and the first live smoke fell back correctly before the reasoning-model fix.
  - "Numbers and verdict remain engine-owned" - Pass: the branch module computes nothing; the engine owns the verdict even when the model picks the branch.
- Exit gate "Agent behavior is observable and useful in the real actor flow" - Pass: the branch is model-driven, attached to the record, shown on the page, and changes the deterministic hop depth in the certificate; verified live against Groq qwen3.6-27b.
- Requirements mapped: FR-008, NFR-003, NFR-007, AI controls satisfied.
- Files or assets changed: `PROJECT_STATE.md`.
- Commands or checks run: reconciliation against P6-CP-001 and P6-CP-002 recorded evidence plus the live end-to-end smoke.
- Deviations: None.
- Risks introduced: None from this administrative gate.
- Known issues: A model provider is configured via env at runtime, not committed; deterministic fallback runs when unset.
- Blockers: None for entering Phase 7; DEC-004 (durable report storage, ISSUE-004) gates only the optional public-storage part of Phase 7.
- Amendments: None.
- Next exact action: Begin Phase 7 - deliver the judge-ready one-page workflow (usability/accessibility/responsive pass, clear mode labels, download/replay from the same surface, health status, timed demo).

## Decisions Made During Execution

| ID | Date | Decision | Reason | Plan impact |
|---|---|---|---|---|
| DEC-PLAN-001 | 2026-08-18 | Use a funding/volume anomaly certificate rather than a wash-trading accusation | Shared funding is not proof of intent and infrastructure roots create false positives | Controls product language, verdicts, UI, and demo |
| DEC-PLAN-002 | 2026-08-18 | Build functional vertical slices around the analyst workflow | Layer-first sequencing would delay proof and hide incomplete integration | Defines Phase 0 through Phase 8 |
| DEC-PLAN-003 | 2026-08-18 | No wallet custody or user transaction action in the core | The analyst job is read-only and custody adds unrelated risk | Keeps primary workflow public/read-only |
| DEC-PLAN-004 | 2026-08-18 | No Orion capability may be claimed without a live contract/source | Current public site does not expose the supplied brief or API | Makes DEC-001 a prerequisite |
| DEC-EXEC-001 | 2026-08-18 | Treat Orion as submission/listing-only candidate surface until authoritative native documentation exists | `.ai` is a placeholder; `.org` exposes a submit flow but no verified native runtime contract or proven relationship to the supplied brief | No Orion-native code or claim in the core path |
| DEC-EXEC-002 | 2026-08-18 | Select Uniswap v4 PoolManager on Base as the first DEX/event adapter | Official deployment and event interface are available, and both frozen fixtures emit inspectable canonical logs | Keeps the first parser bounded to one singleton and one event ABI |
| DEC-EXEC-003 | 2026-08-18 | Freeze BaseUnc as anomaly candidate and USDT/USDC as same-path control candidate over blocks 50121395-50123000 | Bounded RPC, receipt, and funding-sample evidence exists for both; final verdict remains deterministic-engine-owned | Enables Phase 1+ fixture replay without claiming a final finding |
| DEC-EXEC-004 | 2026-08-18 | Use source-by-source root taxonomy with `UNKNOWN` default and no bulk third-party allowlist | Official protocol deployment sources are available; address-level enrichment is not sufficient to assert ownership or redistribution rights | Prevents false-positive classifications and keeps taxonomy provenance explicit |
| DEC-EXEC-005 | 2026-08-18 | Use public Base RPC as a bounded, explicitly labeled fallback for Phase 2 proof | Public RPC is observable and sufficient for fixture reads, while production provider credentials, quotas, terms, and privacy remain unresolved | Enables read-only adapter verification without a production-capability claim |
| DEC-EXEC-006 | 2026-08-18 | Continue to Phase 3 using the verified public fallback while keeping production provider selection open | The bounded actor flow now produces source-linked evidence and the Phase 2 exit gate passes; provider selection affects production readiness, not deterministic fixture development | No production-capability claim until provider evidence is resolved |
| DEC-EXEC-007 | 2026-08-18 | Use Blockscout internal transfers as bounded funding enrichment and keep all live roots unknown by default | The source exposes native internal transfer provenance, but it is secondary to canonical chain data and does not establish ownership | Enables partial root-path evidence without false classifications |
| DEC-EXEC-008 | 2026-08-18 | Read ERC-20 funding transfers from canonical `eth_getLogs` as the reliable funding layer and demote Blockscout internal transfers to best-effort native enrichment | Public Base RPC serves canonical, block-verifiable Transfer logs even when Blockscout is unstable, while trace/internal-transfer methods are not on the public fallback | Removes the ERC-20 funding dependency on Blockscout; native-ETH funding coverage stays provider-limited |
| DEC-EXEC-009 | 2026-08-18 | Freeze the bounded canonical-ERC-20 + best-effort-native funding result as the approved Phase 3 scope and pass the Phase 3 exit gate; defer any trace/internal-transfer provider | Phase 3 acceptance criteria (FR-004, FR-005, BR-002, BR-007) require determinism, provenance, taxonomy segregation, and source-linked evidence - not native or full coverage; a paid provider is gated by BLK-004 and needs explicit authorization | Closes Phase 3 with no plan amendment; native-ETH completeness moves to Phase 4 coverage/limitations and BLK-004 |
| DEC-EXEC-010 | 2026-08-18 | Define the anomaly metric as observed cluster-linked swap-event share (numerator = swaps from wallets sharing an unknown two-hop funding root, denominator = total swaps), gate verdicts on that share plus attribution coverage, and identify reports by sorted-key canonical JSON + SHA-256 | Swap-event count is fully deterministic and unit-consistent with no price/decimals assumption; coordination must derive from shared UNKNOWN roots so known infrastructure is excluded (BR-002); integer/bps-only canonical JSON keeps the hash stable across runs (NFR-004) | Sets Phase 4 report fields and thresholds; thresholds are versioned into report identity so future tuning creates a new identity (BR-008); no plan amendment |
| DEC-EXEC-011 | 2026-08-18 | Certify evidence in the server orchestration layer (not the store), expose it via a read-only report download route, add `connect-src 'self'` to the page CSP, and close Phase 4 on golden positive proof plus a wired lifecycle and honest live audit without tuning thresholds to force a live ANOMALY | Keeps the store pure and the domain/transport boundary clean; the browser flow needs same-origin connect; the plan's Phase 4 verification is golden reports, and forcing a live verdict would violate the incomplete-coverage-no-verdict invariant | Completes Phase 4 with no plan amendment; live ANOMALY demonstration deferred to deeper coverage/sourced taxonomy (Phase 5/7, ISSUE-011) |
| DEC-EXEC-012 | 2026-08-18 | Resolve DEC-006 by making the Phase 6 model integration a genuine but provider-agnostic OpenAI-compatible chat-completions adapter configured via env (`DERVYX_MODEL_*`), stateless with the key kept local, and restrict the model to choosing an allowlisted branch only | The user chose a genuine model; an env-configured OpenAI-compatible endpoint works with any provider (OpenAI, OpenRouter, Mesh, local) without vendor lock or embedded secrets, and confining the model to branch selection keeps numbers and the verdict deterministic (NFR-003) and injection-safe | Unblocks Phase 6; no plan amendment; live model verification deferred until env credentials are set |

## Plan Deviations

| ID | Date | Original plan | Change | Reason | Approval status |
|---|---|---|---|---|---|
| None | 2026-08-18 | No execution deviation recorded | No change | Planning completed before implementation | Not applicable |
| DEV-001 | 2026-08-18 | Page CSP inherited `default-src 'none'` for connections | Added `connect-src 'self'` to the served-page CSP | The browser investigation flow must reach the same-origin API; the prior policy would block `fetch` in a browser | Minor local security-control adjustment; no scope/architecture/acceptance change; recorded in P4-CP-002 |

## Verification Evidence

| Checkpoint | Command or check | Result | Evidence |
|---|---|---|---|
| CP-000 | Read full universal-project-planner instructions | Pass | Required planning control flow and file contract followed |
| CP-000 | Inspect Dervyx directory | Pass | Only WIN-PLAN.md existed before the two planner artifacts |
| CP-000 | Inspect WIN-PLAN.md | Pass | Approved WashGuard/Dervyx invariant, scope, demo, and risks preserved |
| CP-000 | Inspect local Orion validation | Pass with uncertainty | Validation identifies supplied-brief boundary and Orion runtime/API gap |
| CP-000 | GET https://orionagents.ai/ | Observed placeholder | Portuguese coming-soon page; no visible hackathon/API/listing contract |
| CP-000 | Review Base chain documentation | Pass for Base facts | Chain IDs, JSON-RPC log method, finality, and Base MCP scope recorded in plan |
| CP-000 | Structural review of PROJECT_PLAN.md | Pass | Required project-planning, vertical-slice, security, testing, handoff, and research sections present |
| CP-000 | UTF-8 and non-empty validation | Pass | iconv accepted both files; wc confirmed non-empty artifacts |
| CP-000 | Dervyx artifact inventory | Pass | Directory contains PROJECT_PLAN.md, PROJECT_STATE.md, and preserved WIN-PLAN.md only |
| CP-000 | Implementation test suite | Not run | Planning-only boundary; no implementation exists |
| CP-001 | Orion `.ai` live page | Observed unavailable | Portuguese coming-soon page; no visible registration, submission, native agent contract, or hackathon material |
| CP-001 | Orion `.org` submit surface and `GET /api/agents` | Pass with boundary | Public submit page requests wallet/DAO flow and approximately 0.00527 ETH ignition; `GET /api/agents` returned `[]`; no wallet or payment action performed |
| CP-001 | Base public RPC and chain ID | Pass | Base chain ID 8453 and live head were read from the public RPC; no write was sent |
| CP-001 | Uniswap v4 deployment and interface | Pass | Official deployment page identifies Base PoolManager `0x498581ff718922c3f8e6a244956af099b2652b2b`; official interface defines the selected `Swap` event |
| CP-001 | BaseUnc fixture window | Pass for candidate | Blocks 50121395-50123000: 426 swaps, 426 transactions, 170 origins; initialization, swap receipt, transfer log, funding sample, and explorer links recorded in the manifest |
| CP-001 | USDT/USDC control window | Pass for control candidate | Same blocks: 133 swaps, 133 transactions, 84 origins; initialization, swap receipt, transfer logs, funding sample, and explorer links recorded in the manifest |
| CP-001 | Fixture manifest validation | Pass | `fixtures/phase0-fixture-manifest.json` is valid JSON, contains no secret material, and records source-linked limitations |
| P1-CP-001 | `npm run typecheck` and `npm run build` | Pass | TypeScript compiler completed with strict options and generated `dist/` output |
| P1-CP-001 | `npm test` | Pass | Seven tests passed, zero failed, including HTTP boundary, validation, idempotency, and conflict paths |
| P1-CP-001 | `npm audit --omit=dev --audit-level=high` | Pass | Production dependency audit reported zero vulnerabilities |
| P1-CP-001 | `git diff --check` | Pass | No whitespace errors in tracked changes |
| P1-CP-002 | Primary page HTTP smoke | Pass | Real process served `/health` and `/`; valid POST returned `201 SCOPED` with deterministic request ID |
| P1-CP-002 | Static accessibility/contract inspection | Pass | Form labels, required controls, status live region, focus styles, mobile layout, reduced-motion rule, and no wallet hooks verified |
| P1-CP-002 | Full dependency audit | Pass | `npm audit --audit-level=high` reported zero vulnerabilities |
| P1-CP-002 | Clean install reproducibility | Pass | `npm ci --ignore-scripts` completed, followed by a passing full test suite |
| P2-CP-001 | Canonical adapter unit and failure tests | Pass | Fourteen tests passed, including range splitting, dedupe, source identity, wrong-chain, provider, mismatch, invalid-event, and event-limit paths |
| P2-CP-001 | BaseUnc live adapter read | Pass for bounded fallback proof | Public fallback returned 426 raw and 426 normalized events with canonical block-hash verification, matching the manifest |
| P2-CP-001 | USDT/USDC live adapter read | Pass for bounded fallback proof | Public fallback returned 133 raw and 133 normalized events with canonical block-hash verification, matching the manifest |
| P2-CP-001 | Production provider/quota verification | Open | Public fallback is usable for bounded proof; production provider, quota, terms, and privacy evidence are not selected |
| P2-CP-002 | Evidence lifecycle unit tests | Pass | Sixteen tests passed overall, including `SCOPED`, `INGESTING`, `EVIDENCE_READY`, and retryable failure paths |
| P2-CP-002 | Real investigation lifecycle smoke | Pass for bounded fallback proof | Scope creation returned 201, evidence start returned 202, polling reached `EVIDENCE_READY` with 426 source-linked events and a BaseScan transaction hash |
| P3-CP-001 | Deterministic graph golden tests | Pass | Twenty tests passed overall, including two-hop paths, known/unknown roots, duplicate identities, truncation, and conflicting edges |
| P3-CP-001 | Live funding-edge integration | Open | Normalized evidence currently contains swap events but no funding-transfer edge source; no live root verdict is claimed |
| P3-CP-002 | Funding-source unit tests | Pass | Twenty-two tests passed overall, including Blockscout provenance and per-origin provider failure handling |
| P3-CP-002 | Real funding graph lifecycle | Pass for bounded partial evidence | BaseUnc returned 426 swaps, 170 origins, 30 sampled origins, 18 origins with edges, 450 native edges, 462 graph paths, four source errors, and all roots explicitly `UNKNOWN` |
| P3-CP-003 | Token-filtered ERC-20 source tests | Pass | Twenty-three tests passed, including canonical token-transfer provenance and retention of native edges when token enrichment fails |
| P3-CP-003 | Paired live comparison | Partial | Control retained 49 native edges, 4 known PoolManager paths, 71 unknown paths, and 22 source errors; BaseUnc returned no edges, 30 unknown paths, and 27 source errors on the latest run |
| P3-CP-004 | Canonical-funding unit + full suite | Pass | Twenty-five tests passed, including a source-linked block-verified canonical ERC-20 read and a canonical provider-failure test that records an error without fabricating edges |
| P3-CP-004 | `npm audit --omit=dev --audit-level=high` and `git diff --check` | Pass | Production dependency audit reported zero vulnerabilities; no whitespace errors |
| P3-CP-004 | Live paired comparison (public fallback) | Pass for bounded partial evidence | BaseUnc: 84 edges (55 native, 29 canonical ERC-20), 29/30 origins with edges, 85 paths (25 known / 60 unknown), 23 native errors, 0 ERC-20 errors. Control: 47 edges (0 native, 47 canonical ERC-20), 10/30 origins with edges, 67 paths (10 known / 57 unknown), 21 native errors, 0 ERC-20 errors. Both partial; no verdict emitted |
| P4-CP-001 | `npm run typecheck` and golden report tests | Pass | Thirty-five tests passed (ten new): golden ANOMALY/CLEAN/UNKNOWN_ROOTS/INSUFFICIENT_DATA, replay determinism, tamper failure, canonicalization invariance, copy audit, and evidence mapping |
| P4-CP-001 | `npm audit --omit=dev --audit-level=high` and `git diff --check` | Pass | Zero production vulnerabilities; no whitespace errors |
| P4-CP-001 | `node scripts/verify-report.mjs` replay smoke | Pass | Genuine certificate verified (ok=true, exit 0); tampered certificate failed (HASH_MISMATCH, exit 1); generator hash matched the independent CLI recompute |
| P4-CP-002 | `npm run typecheck` and lifecycle tests | Pass | Thirty-eight tests passed (three new): certified funded lifecycle + verifiable download, REPORT_NOT_READY without funding, and 404 for unknown ids |
| P4-CP-002 | Local server smoke (`PORT=4753 node dist/src/server.js`) | Pass | Served-page CSP includes `connect-src 'self'`; page includes the certificate section; `/health` returned the Dervyx shape; unknown report id returned 404 |
| P4-CP-002 | `node scripts/report-audit.mjs` live paired audit (public fallback) | Pass for bounded partial evidence | BaseUnc UNKNOWN_ROOTS (32/426 = 7.51%, 17.06% coverage, hash 3fe74f31...); control UNKNOWN_ROOTS (8/133 = 6.02%, 11.90% coverage, hash 7510c68f...); both replay-verified ok; no forced verdict |
| P5-CP-001 | `npm run typecheck` and verify-endpoint tests | Pass | Forty tests passed (two new): genuine verify ok, tampered/swapped-hash mismatch, and bad-body 400 / unknown-id 404 / missing-report 404 |
| P5-CP-001 | Local server smoke (`PORT=4754 node dist/src/server.js`) | Pass | Served page includes the "Replay & verify report" control; `POST /report/verify` on an unknown id returned 404 NOT_FOUND |
| P5-CP-002 | `npm run typecheck` and negative-control tests | Pass | Forty-two tests passed (two new): known-router control certifies CLEAN (numerator 0, router excluded); partial coverage certifies UNKNOWN_ROOTS (never CLEAN) |
| P5-CP-002 | Local server smoke (`PORT=4755 node dist/src/server.js`) | Pass | Served page includes the recovery region, narrower-range hint, and RETRYABLE retry button |
| P6-CP-001 | `npm run typecheck` and branch-engine tests | Pass | Fifty-three tests passed (eleven branch tests): no-provider/timeout/error/invalid-output fallback, valid-model select, rationale sanitization, summary-hash determinism, deterministic heuristic, env-adapter presence, and reasoning-model JSON extraction |
| P6-CP-001 | Live model smoke (Groq `qwen/qwen3.6-27b` and Gemini 2.5 Flash; operator keys, not stored) | Pass | Genuine mode=model branch decision with sanitized rationale from both providers after reasoning-safe JSON extraction; the brittle `response_format` path was removed |
| P6-CP-002 | `npm run typecheck` and branch-lifecycle tests | Pass | Fifty-five tests passed (two new): maxHops work-path/identity effect (early_stop drops the two-hop cluster and changes the hash) and lifecycle branch-trace attachment |
| P6-CP-002 | Genuine end-to-end lifecycle + Groq `qwen/qwen3.6-27b` smoke (operator key, not stored) | Pass | mode=model, model chose `early_stop` (differing from the deterministic fallback), applied as maxHops 1 in report identity; verdict ANOMALY engine-owned; EVIDENCE_READY only surfaced with the report attached |

## Known Issues

| ID | Severity | Description | Workaround | Required fix |
|---|---|---|---|---|
| ISSUE-001 | High | Orion `.ai` is a placeholder; `.org` exposes a submit/listing surface but the official relationship and native runtime contract remain unverified | Treat Orion as submission/listing-only candidate and make no native claim | Obtain authoritative organizer/platform evidence before Orion-specific integration |
| ISSUE-002 | High | BaseUnc and USDT/USDC are frozen candidates, not final ANOMALY/CLEAN verdicts | Keep labels candidate-only until deterministic graph/metrics engine runs | Implement the same engine and replay both fixtures |
| ISSUE-003 | Medium | Uniswap v4 is selected, but broader root-source licensing and two-hop coverage are not complete | Unknown-by-default taxonomy and source-linked evidence | Complete taxonomy and graph coverage before final verdicts |
| ISSUE-004 | Medium | Durable public report storage is not selected | Plan hash/download first | Resolve DEC-004 before Phase 7 |
| ISSUE-005 | Low | DEC-006 resolved (DEC-EXEC-012) and live-verified against Groq `qwen/qwen3.6-27b` and Gemini 2.5 Flash (operator keys, not stored). No provider is committed to config; the operator sets env at runtime | Deterministic fallback runs until env is set; the model only selects a branch, never numbers or the verdict | Optionally set a default provider in deployment env for Phase 7; keep keys in env only, never in the repo |
| ISSUE-006 | Low | Dervyx name validation is provisional | Use Dervyx internally | Resolve DEC-008 before branding/submission |
| ISSUE-007 | Medium | Phase 1 request records are in-memory and are lost on process restart | Keep the slice read-only and add durable request storage before production operation | Implement durable request persistence in the later evidence-service phase |
| ISSUE-008 | Medium | The page exposes live evidence through the public fallback while production provider readiness remains open | Keep `public_fallback` visible and avoid production claims | Resolve provider methods, limits, terms, and privacy before public deployment |
| ISSUE-009 | Medium | Canonical evidence lifecycle uses the public fallback and production provider/quotas are not selected | Keep `public_fallback` visible and do not claim production readiness | Resolve provider methods, limits, terms, privacy, and fallback policy before public deployment |
| ISSUE-010 | Medium | Canonical `eth_getLogs` now provides reliable, block-verified ERC-20 funding edges, but native-ETH funding still depends on unstable Blockscout internal transfers and full-universe coverage remains open | Keep graph output partial and source-labeled per source; never treat missing edges as zero; rely on canonical ERC-20 as the reliable layer | Select a trace/internal-transfer-capable provider for native-ETH funding or freeze the bounded canonical result as approved scope |
| ISSUE-011 | Medium | The certificate engine is wired end to end, but under bounded top-30-origin coverage the live fixtures classify as UNKNOWN_ROOTS (BaseUnc 7.51% share / 17% coverage; control 6.02% / 12%); a live ANOMALY demonstration needs deeper origin/hop coverage or sourced taxonomy | Rely on golden report tests for the ANOMALY path; keep live results as honest non-verdicts and never force a label on partial coverage | Broaden origin/hop coverage or populate sourced root taxonomy (and/or resolve native-ETH funding via BLK-004) before expecting a live ANOMALY |

## Blockers

| ID | Description | Impact | Required resolution |
|---|---|---|---|
| BLK-001 | Orion native runtime and official `.org`/`.ai` relationship remain unverified; an observed submission/listing candidate exists | Blocks native Orion code and sponsor-native claims, not the self-contained Base core | Obtain authoritative organizer/platform evidence before Orion-specific work or submission claims |
| BLK-002 | Resolved in CP-001: BaseUnc anomaly candidate and USDT/USDC same-path control are frozen | Final labels remain blocked until the deterministic engine runs | Implement graph/metrics/replay and preserve candidate-only wording |
| BLK-003 | Resolved for first adapter in CP-001: Uniswap v4 selected; taxonomy remains unknown-by-default and source-by-source | Broad root classification and redistribution remain limited | Add only source-backed roots and retain unknown addresses |
| BLK-004 | Production provider and quota contract is not selected | Production-capability and deployment claims remain blocked; bounded read-only proof is allowed through the public fallback | Verify provider methods, limits, terms, privacy, and fallback before public deployment |
| BLK-005 | Resolved in P2-CP-002: canonical adapter is connected to request state and source-linked evidence | No remaining Phase 2 lifecycle blocker | Preserve evidence state and failure semantics in later phases |
| BLK-006 | ERC-20 portion resolved in P3-CP-004 via a canonical `eth_getLogs` funding source; native-ETH funding remains bounded by Blockscout availability | Reliable ERC-20 funding coverage now survives Blockscout outages; a verdict-capable native-ETH graph still needs a trace-capable source or an approved bounded scope | Select a trace/internal-transfer-capable provider or freeze the bounded canonical-ERC-20-plus-best-effort-native result as approved P3 scope |

## Amendment Protocol

After execution begins, PROJECT_PLAN.md may change only through an amendment recorded here.

An amendment must:

1. Receive an AMD-number.
2. State the original plan.
3. State the proposed change.
4. Explain evidence and reason.
5. Identify requirements, phases, tests, cost, and risks affected.
6. Record approval status.
7. Update the plan only after approval when approval is required.
8. Add the amendment to this state file.
9. Preserve historical checkpoints.

Minor implementation details that do not change approved scope, architecture, requirements, security controls, phase order, or acceptance criteria belong only in this state file.

## Checkpoint Protocol

The future executor must update this file after:

- Setup.
- Each vertical slice or phase.
- Schema or migration changes.
- Major architecture decisions.
- External integrations.
- Security-sensitive changes.
- Failed attempts.
- Review completion.
- Test runs.
- Blockers.
- Deployment preparation.
- Every work session.

Each checkpoint must record:

- Status: Complete, Partial, Blocked, or Failed.
- Date, agent, and phase.
- Objective and work completed.
- Files/assets changed.
- Commands/checks and test results.
- Acceptance criteria verified.
- Decisions and deviations.
- Risks introduced.
- Known issues and blockers.
- One next exact action.

Do not store hidden reasoning, casual narration, every command, token usage, or unverified claims.

## Next Exact Action

Begin Phase 7 (the complete workflow is credible and judge-ready) with P7-CP-001: a usability/accessibility/responsive pass over the primary page so a clean browser completes both an anomaly and a clean control; make live/cached/recorded mode unmistakable; keep download + replay reachable from the same surface; add a health/status affordance; and prepare a timed (<=180s) demo path. Omit optional attestation unless verified and useful; durable public report storage stays gated by DEC-004. Preserve determinism, unknown-by-default taxonomy, candidate-only anomaly language, public-fallback labeling, the read-only boundary, and never claim proof of wash trading.
