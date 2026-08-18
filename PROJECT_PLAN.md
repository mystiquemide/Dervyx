# Dervyx Project Plan

## Document Control

- Status: Planned; no implementation has started.
- Version: 0.1
- Created date: 2026-08-18
- Last updated date: 2026-08-18
- Planning mode: Deep
- Research depth: Standard
- Planning confidence: 75/100 (Medium)
- Intended audience: Future implementers and the hackathon submission reviewer.
- Source request summary: Create an implementation-ready plan for the approved Dervyx/WashGuard build using functional vertical slices while preserving the existing Win Plan.
- Existing constraint document: WIN-PLAN.md in this directory; it remains the product-positioning authority.

## Executive Summary

Dervyx is a Base-focused investigation agent for launchpad and exchange listing analysts. An analyst enters a token address and a fixed Base block range. Dervyx reads canonical transfer and supported DEX swap events, traces wallet funding up to two hops, classifies known exchange/bridge/market-maker roots, calculates observed cluster-linked volume, and returns a reproducible evidence report.

The product must report a funding and volume anomaly, not prove criminal wash trading. Every material number must be derived by deterministic code from a fixed input scope. The language-model component may choose which investigation branch to deepen and may explain evidence, but it may not create cluster membership, percentages, root classifications, or verdicts.

The smallest complete product is one web investigation flow with:

1. A real Base RPC read path.
2. One supported DEX/event adapter.
3. One real anomaly fixture and one clean control.
4. A versioned root taxonomy with an explicit unknown state.
5. A canonical JSON report, SHA-256 replay hash, and raw transaction/block links.
6. A visible positive result, a clean/negative result, and an intentional incomplete-data result.

The implementation must wait for verification of the actual Orion registration, submission, and agent interface. The current public Orion domain is a Portuguese placeholder and does not expose the supplied hackathon brief. No private API, listing capability, or sponsor primitive may be invented.

## Project Definition

### Classification

- Primary category: Hackathon, AI agent, Web application, blockchain data product.
- Secondary categories: Security analysis, developer-facing evidence tool, open-source project.
- Intended outcome: A judge-verifiable Base investigation flow that saves a listing analyst from manually joining funding and trading evidence.
- Main deliverable: A public read-only web investigation surface plus reproducible report artifacts and a short demo.
- Delivery surface: Web application first; deterministic JSON replay endpoint or CLI as a supporting surface. A wallet connection is not part of the primary workflow.
- Complexity: Medium-high because the flow crosses RPC ingestion, graph analysis, AI orchestration, evidence storage, and adversarial testing.
- Risk: High epistemic and integration risk; moderate runtime and smart-contract risk because custody and automatic enforcement are excluded.
- Software architecture applies: Yes.
- Business planning applies: Limited. The hackathon judges usefulness and execution; monetization is not required.
- UX planning applies: Yes. The listing analyst must complete the investigation without navigating a generic dashboard.
- Security and privacy apply: Yes.
- Compliance research applies: Limited. The product must avoid defamatory or definitive fraud claims.
- External research is required: Yes, for Base RPC behavior and Orion submission/integration facts.

### Normalized brief

| Field | Planning value | Evidence status |
|---|---|---|
| Working title | Dervyx | Confirmed by project context; final brand validation remains open |
| One-sentence concept | A Base launchpad and exchange-vetting agent that publishes reproducible funding-and-volume anomaly certificates | Confirmed by WIN-PLAN.md |
| Problem | Listing analysts cannot quickly tell whether apparent token volume is structurally independent or shares funding roots | Inferred from approved idea and prior validation |
| Current workaround | Manual explorer, graph, and market-data investigation with weak reproducibility | Inferred; exact analyst workflow is not interviewed |
| Proposed mechanism | Two-hop funding graph, known-root filtering, observed-volume attribution, deterministic report/replay | Confirmed |
| Primary actor | Launchpad or exchange listing/risk analyst | Inferred and locked for planning |
| Primary outcome | Anomaly, clean, unknown, or insufficient-data report for one fixed scope | Confirmed |
| Required deliverable | Working app, public evidence, repository, demo, and submission links | Confirmed from supplied brief and Win Plan |
| Mandatory capabilities | Base read path, graph, root taxonomy, deterministic report, positive and negative proof | Confirmed |
| Optional capabilities | Immutable Base report-hash attestation, durable public report history, second DEX adapter | Deferred |
| Deadline | 2026-09-02 23:59 UTC | Supplied brief; live platform verification unresolved |
| Budget | No budget supplied; assume a low-cost hackathon build | Assumed |
| Required ecosystem | Orion submission/listing context and Base chain evidence | Orion unresolved; Base docs verified |
| Preferred technologies | TypeScript modular monolith, Base JSON-RPC, small web UI, deterministic engine | Assumed recommendation |
| Data sensitivity | Public chain and public page/repository data only; no wallet secrets | Confirmed boundary |
| Success criteria | A judge can run or watch the real flow, inspect evidence, replay the report, and see a meaningful negative case | Confirmed |

## Problem Statement

Launchpads and exchanges must decide whether token activity is credible enough to list or continue reviewing. A token can show large volume while many apparent trading wallets share a recent funding root. Existing investigation often requires manually opening transfers, swaps, bridge transactions, and explorer pages. That work is slow, difficult to reproduce, and prone to false positives from exchange hot wallets, bridges, market makers, and distributors.

Dervyx addresses the evidence gap, not the entire market-integrity problem. It answers:

> For this Base token and this exact block window, what funding relationships and supported swap activity are observable, which known infrastructure roots are excluded, and can another reviewer reproduce the report?

It does not answer who intended to manipulate a market, who owns an anonymous wallet, or whether a legal violation occurred.

## Target Users or Audience

### Primary actor: listing or risk analyst

The analyst performs the central job. They need a fast, read-only, evidence-first review of a token before a listing or continued monitoring decision.

- Entry condition: A token address and investigation window are available.
- Job to be done: Determine whether reported activity deserves deeper review and obtain evidence that can be handed to another reviewer.
- Natural interface: One investigation page with a token/range form, trace, graph, evidence drawer, and downloadable report.
- Time-to-value target: A fixed fixture produces a first meaningful evidence row within 20 seconds and a complete report within 120 seconds in cached mode.

### Secondary actors

- Independent judge or auditor: Opens raw transaction links, report JSON, formulas, and replay output.
- Token team or launchpad operator: Receives a limitation-aware report and can dispute a root classification with sources.
- Orion operator or reviewer: Evaluates whether the agent is useful and honestly described.
- Future API consumer: Replays a report or uses the deterministic schema without the web UI.

## Scope

### Core scope

- Base Mainnet read-only analysis, with Base Sepolia allowed for test fixtures or optional attestation.
- Input validation for a checksummed token address, explicit start/end block, and configuration version.
- Transfer event ingestion and one supported Base DEX swap-event adapter selected during Phase 0.
- Two-hop funding traversal from observed trading wallets.
- Deterministic connected-component or overlap clustering with documented thresholds.
- Versioned known-root classes: exchange, bridge, router, market maker, distributor, and unknown.
- Observed cluster-linked volume with visible numerator, denominator, coverage, and exclusions.
- Verdicts: ANOMALY, CLEAN, UNKNOWN_ROOTS, INSUFFICIENT_DATA.
- Agent branch selection and evidence explanation with schema validation.
- Canonical JSON, content hash, replay verification, and raw transaction/block links.
- A web flow that runs one anomaly fixture and one clean control through the same engine.
- Intentional failure states for unsupported tokens, RPC failure, stale/inconsistent blocks, and bounded-range violations.

### Supporting scope

- Cached fixture mode clearly labeled as cached or recorded.
- Public report download and deterministic report identifier.
- Optional content-addressed report URL if a durable store is selected.
- Optional immutable Base hash registry only after the core proof and contract review pass.
- README, fixture manifest, threat model, and a 180-second proof video.
- Minimal health/readiness and request trace metadata.

### Future scope

- Additional DEX protocols and token standards.
- Multi-chain analysis.
- Historical indexer or warehouse.
- Browser extension, automatic listing decisions, blacklisting, or slashing.
- Formal wallet ownership attribution.
- Continuous monitoring and alerting.
- Paid API, token, reputation market, or user wallet actions.

### Explicit exclusions

- No claim of proven wash trading, fraud, criminal intent, or legal liability.
- No automatic listing rejection, slashing, fund movement, or custody.
- No user wallet connection for the investigation path.
- No opaque composite risk score.
- No LLM-owned numerical calculations.
- No fake live data, simulated explorer receipts, or hardcoded successful state.
- No undocumented Orion API or private integration claim.
- No second chain or second DEX until the first path has fixtures and tests.

## Success Criteria

### P0 outcome criteria

1. A primary analyst can submit a Base token and fixed block range through the web interface.
2. The application performs real Base RPC reads and shows source/progress state.
3. The same request produces a deterministic graph, root classifications, metrics, and verdict.
4. Every highlighted evidence edge links to a transaction or block and includes an event identity.
5. Rerunning the same fixture produces byte-identical canonical JSON and the same hash.
6. The anomaly fixture yields a limitation-aware ANOMALY report.
7. The clean control yields CLEAN or UNKNOWN_ROOTS for the documented reason and does not inflate the anomaly metric.
8. An RPC or coverage failure yields INSUFFICIENT_DATA or a retryable failure, never an invented clean result.
9. The agent trace shows one branch decision whose inputs are visible and whose output cannot alter deterministic numeric fields.
10. A fresh checkout can run the fixtures and replay command using documented configuration.
11. The 180-second demo shows the real workflow, positive evidence, negative evidence, and replay proof.
12. Orion registration/submission requirements and any native integration are verified before the submission claims them.

### Measurable quality targets

- Fixed-fixture complete report: <= 120 seconds in cached mode and <= 180 seconds with the selected live RPC provider under normal limits.
- Report replay: same canonical hash in two consecutive runs.
- Evidence coverage: 100% of highlighted edges have transaction hash, block number, log index where applicable, and source URL.
- Numeric provenance: 100% of displayed numeric fields map to deterministic report fields.
- Accessibility: keyboard-complete primary flow, visible focus, text verdict labels, and no color-only meaning.
- Bounded workload: requests outside configured block span or event/wallet caps are rejected or explicitly truncated.

## Feasibility and Scope Gate

Scores use 1 (weak) to 5 (strong). Each score records what must be proven before scope expands.

| Dimension | Score | Evidence | Uncertainty | Proof required | Consequence if wrong |
|---|---:|---|---|---|---|
| Problem clarity | 5 | Win Plan names a concrete listing-vetting workflow | Exact analyst frequency and savings are unmeasured | One end-to-end review that replaces manual joins | Reframe UI around a narrower reviewer job |
| User clarity | 4 | Launchpad/exchange analyst is coherent | No direct user interview | A reviewer completes flow without explanation | Remove secondary audiences from demo |
| Technical feasibility | 4 | Base exposes JSON-RPC logs, blocks, receipts, and transaction lookups | Provider limits and DEX ABI variation | One real adapter and golden fixture | Narrow to one event type or cached fixtures |
| Operational feasibility | 3 | Read-only modular monolith is manageable | Hosting, RPC quotas, and model availability | Fresh-start deployment/replay | Ship recorded mode with honest labeling |
| Schedule feasibility | 3 | Deadline is about two weeks away; scope is narrow | No implementation or fixtures exist | Phase 0 and thin slice pass immediately | Remove attestation, second DEX, and history |
| Budget feasibility | 4 | Read-only RPC and one model call can be low cost | Provider/model pricing unknown | Cost cap and request limits | Use local/cached fixtures and fallback policy |
| Security feasibility | 4 | No custody or writes in core flow | Prompt injection and false attribution remain | Threat tests and deterministic ownership | Disable model branch and show fixed policy |
| Regulatory feasibility | 3 | Language can be limited to observed anomalies | Public accusations may create risk | Claim/wording review and limitation labels | Remove accusatory address language |
| Dependency feasibility | 2 | Base docs are available | Orion runtime/submission path is not public | Live Orion verification and fallback choice | Self-contained submission with explicit status |
| Adoption feasibility | 3 | Partner panel includes launchpad/exchange interests per brief | No user validation | One analyst-oriented report artifact | Treat as judged proof, not market claim |

**Verdict: Proceed with prerequisite validation and hard scope reduction.** The core can be built, but implementation must not claim Orion-native behavior until DEC-001 is resolved. Optional contract, durable history, extra protocols, and multi-chain work are deferred.

## Locked Winning Core

**Problem:** Listing and exchange analysts need reproducible evidence about whether apparent Base token activity is structurally independent.

**Primary actor:** A launchpad or exchange listing/risk analyst.

**Secondary actors:** Independent reviewers, token teams, Orion reviewers, and future API consumers.

**Job to be done:** Enter a token and fixed block window, inspect funding and swap relationships, and produce a report another reviewer can verify.

**Natural interaction surface:** A single evidence-first web investigation page, with JSON replay as the supporting interface.

**Winning mechanism:** A two-hop funding graph joined to supported swap events, filtered by a versioned known-root taxonomy, and summarized as an evidence certificate instead of an opaque score.

**Sponsor dependency:** Base canonical RPC and explorer evidence are load-bearing to the product mechanism. Orion is a load-bearing submission/distribution surface only if the verified platform exposes an agent contract or listing protocol; this is a blocking prerequisite, not an assumption.

**Winning invariant:** No displayed numeric verdict may exist without a fixed Base scope, canonical event identity, deterministic calculation, and visible source path; known infrastructure roots must be excluded or separately classified rather than counted as independent coordinated traders.

**Positive proof:** A paired anomaly report with raw Base event links, root classifications, numerator/denominator, coverage, canonical JSON, replay hash, and optional Base attestation.

**Negative proof:** The same pipeline produces a clean/unknown result for a known-infrastructure control, rejects unsupported or oversized requests, and returns insufficient-data rather than guessing when evidence is incomplete.

## Hackathon Calibration

### Judging criteria

The supplied brief describes usefulness, execution, and originality on a 0-10 scale, informed by AI vetting and community upvotes. These rules are treated as confirmed from the supplied brief but unverified against a live submission page because the public Orion site currently shows a placeholder.

| Criterion | Product evidence | Priority |
|---|---|---|
| Usefulness | A listing analyst obtains a report and raw proof faster than manual investigation | P0 |
| Execution | Real Base RPC reads, graph, report, negative path, and deployed/recorded flow | P0 |
| Originality | Root-aware funding/volume certificate with honest uncertainty | P0 |
| AI vetting | Observable branch selection and structured explanation with deterministic numeric ownership | P0 |
| Community proof | Shareable report, replay command, and artifact-driven posts | P1 |

### Submission requirements from the supplied brief

- Website or live app URL.
- X profile.
- Public GitHub repository.
- Discord or Telegram link.
- Wallet registration and an ignition fee, amount/network to be verified live.
- Final submission before 2026-09-02 23:59 UTC.
- Any Orion listing or API link only after verification.

### Core demo loop

The judge sees the same workflow the analyst uses: enter a fixed fixture, observe the real Base read path and agent branch, inspect the graph and exclusions, open a raw transaction, compare the clean control, and replay the report hash.

### Features to cut first

Attestation contract, second DEX, durable report history, live monitoring, multi-chain support, wallet actions, social sentiment, automatic listing decisions, and any feature that cannot appear in the 180-second demo.

## Core Workflow or Delivery Model

~~~text
Listing analyst
-> enters Base token + start/end block + fixture mode
-> application validates chain, scope, and supported event coverage
-> Base RPC adapter fetches blocks, Transfer logs, and supported DEX swap logs
-> deterministic engine builds two-hop funding edges and classifies roots
-> agent policy chooses a deeper branch from the deterministic summary
-> engine calculates observed cluster-linked volume and coverage
-> report canonicalizer creates verdict, evidence rows, and SHA-256 identity
-> analyst sees anomaly/clean/unknown/insufficient-data result
-> analyst opens transaction/block links and downloads JSON
-> replay verifier reproduces the same hash; optional Base registry anchors it
~~~

The Orion step is a prerequisite gate around this loop. If the platform exposes a documented agent endpoint or manifest, the web/API surface must implement it in the same flow. If it only accepts a submission URL, the app remains self-contained and the submission must state that Orion is a distribution surface rather than a runtime data source.

## Primary Actor Journey

1. The analyst opens the investigation page. The page explains that the result is an observed anomaly report, not proof of intent.
2. The analyst enters a checksummed Base token address, start block, end block, and optional fixture selector. The UI shows chain ID and maximum range before submission.
3. Validation rejects wrong-chain addresses, malformed ranges, unsupported token/event scope, and oversized requests without starting a job.
4. The analyst starts the investigation. The interface shows request ID, live/cached/recorded mode, RPC method, block range, event counts, and retry state.
5. The engine returns a deterministic funding/swap summary. The agent policy chooses a branch such as deeper funding traversal, pair-history inspection, or early stop due to insufficient coverage.
6. The analyst sees the graph and evidence ledger. A selected edge opens its transaction, block, log index, amount normalization, and root-classification source.
7. The report view shows verdict, coverage, numerator, denominator, exclusions, limitations, config version, and canonical hash.
8. The analyst runs the clean control through the same interface and compares the result without changing hidden thresholds.
9. The analyst downloads the report and runs replay. The result is either the same hash or an explicit mismatch.
10. The analyst shares the report JSON/hash and explorer links. No wallet permission is requested for the core workflow.

### Interface contract

| Surface | Purpose | Primary action | Required states | Next step |
|---|---|---|---|---|
| Investigation form | Establish scope | Investigate token | Empty, invalid, ready, disabled | Trace |
| Trace panel | Show real work and branch choice | Expand source row | Loading, retrying, partial, failed, complete | Graph/report |
| Evidence graph | Relate funding and swap events | Select edge/node | Empty, populated, truncated, unknown root | Evidence drawer |
| Evidence drawer | Make proof inspectable | Open explorer/report link | Source found, missing, unknown | Certificate |
| Certificate | Communicate outcome and limits | Download/replay | Anomaly, clean, unknown roots, insufficient data | Share/compare |
| Replay view | Verify reproducibility | Replay report | Match, mismatch, source unavailable | Close/inspect |

## Functional Vertical Slices

Each slice is an actor outcome, not a software layer. A slice is incomplete until the actor can see its state and proof through the natural surface.

### Slice 0 - Lock the real evidence and sponsor path

- Actor outcome: One admissible anomaly fixture, one clean control, one supported DEX/event adapter, and one documented Orion decision.
- Components: Base explorer/RPC, fixture manifest, root-source notes, Orion submission/docs surface, planning state.
- Tasks: Inspect candidate ranges; record token, pair, blocks, chain ID, and source links; replay a small log set; verify Orion registration/submission/agent interface; record DEC-001 through DEC-003.
- State transitions: NOT READY -> PREREQUISITES VERIFIED or BLOCKED.
- Success condition: Both fixtures are real and bounded, the adapter identifies required events, and Orion capabilities are documented.
- Failure condition: No stable fixture, unsupported ABI, or inaccessible Orion path.
- Acceptance criteria:
  - Manifests contain fixed token/range/chain fields and no secrets.
  - At least one transfer and swap event can be opened in a Base explorer.
  - Selected root labels have a source or are explicitly unknown.
  - Orion claims are marked verified, unresolved, or unavailable.
- Verification: Read-only explorer/RPC checks and a checkpoint in PROJECT_STATE.md.

### Slice 1 - Scope a real investigation

- Actor outcome: The analyst submits a valid Base token and block window and receives a stable request identity.
- Components: Web form, validation schema, API boundary, request state, chain-ID RPC call.
- Tasks: Validate checksum/address, chain ID, block ordering, maximum range, mode, and idempotency key; expose clear errors.
- State transitions: READY -> VALIDATING -> SCOPED or REJECTED.
- Success condition: A valid request is accepted and scope/config hash is visible.
- Failure condition: Invalid or oversized input is refused before a report is created.
- Acceptance criteria:
  - Wrong chain and malformed addresses are rejected.
  - Start block is not greater than end block and maximum range is enforced.
  - Base chain and live/cached/recorded mode are visible.
  - Repeated idempotency key does not create conflicting state.
- Verification: Browser end-to-end and API contract checks.

### Slice 2 - Ingest canonical Base evidence

- Actor outcome: The analyst sees actual blocks, transfers, swaps, and source counts for the chosen scope.
- Components: Base RPC adapter, provider fallback, event decoder, block consistency checker, trace panel.
- Tasks: Read chain ID, block headers, logs, receipts/transactions as needed; split ranges; normalize event identity; capture block hashes and provider metadata.
- State transitions: SCOPED -> INGESTING -> EVIDENCE_READY, or RETRYABLE, INSUFFICIENT_DATA, or FAILED.
- Success condition: The event set is complete for the supported scope and every retained row has source identity.
- Failure condition: Timeout, rate limit, inconsistent block hash, unsupported event shape, or incomplete pagination.
- Acceptance criteria:
  - Fixture event counts match the manifest.
  - Each event includes chain ID, block number/hash, transaction hash, log index, contract, and decoded fields.
  - Provider errors are visible and never become a clean verdict.
  - A stale or mismatched block hash invalidates the report.
- Verification: RPC integration tests, forced provider failures, pagination tests, and explorer comparison.

### Slice 3 - Trace funding and classify roots

- Actor outcome: The analyst sees which observed traders share funding roots and why a root is known, unknown, or infrastructure.
- Components: Funding traversal, graph representation, root taxonomy, deterministic cluster engine, graph/evidence UI.
- Tasks: Traverse exactly two funding hops; deduplicate by event identity; form connected components or documented overlap clusters; apply versioned root allowlist; cap graph growth.
- State transitions: EVIDENCE_READY -> TRACING -> CLASSIFYING -> GRAPH_READY, or TRUNCATED/INSUFFICIENT_DATA.
- Success condition: A selected edge can be followed from trader to transfer to root classification and source link.
- Failure condition: Graph expansion exceeds limits or root provenance cannot be established.
- Acceptance criteria:
  - Duplicate events do not double-count.
  - Known exchange/bridge/market-maker roots are segregated from unknown roots.
  - Cluster membership is deterministic for the same input/config.
  - Truncation and unknown roots are visible.
- Verification: Golden graph fixtures, known-root false-positive fixtures, duplicate-log tests, and manual edge inspection.

### Slice 4 - Calculate and certify the observed anomaly

- Actor outcome: The analyst receives a verdict that explains observed volume with a visible formula and limitations.
- Components: Deterministic metrics, threshold config, verdict engine, report schema, canonicalizer, hash verifier.
- Tasks: Calculate numerator/denominator, coverage, cluster size, exclusions, confidence/uncertainty fields, verdict enum, canonical JSON, and SHA-256 identity.
- State transitions: GRAPH_READY -> CALCULATING -> CERTIFYING -> COMPLETE.
- Success condition: The report is byte-stable and all visible numbers trace to deterministic fields.
- Failure condition: Missing evidence, invalid config, nondeterministic ordering, or hash mismatch.
- Acceptance criteria:
  - Report includes token, range, chain ID, config version, taxonomy version, formulas, evidence, limitations, and verdict.
  - Model cannot write numeric verdict fields.
  - Two replays produce identical canonical bytes and hash.
  - UI labels observed volume and never proven wash trading.
- Verification: Golden report snapshots, canonicalization tests, tamper tests, schema validation, and replay command.

### Slice 5 - Demonstrate negative and recovery paths

- Actor outcome: The analyst distinguishes a clean control, unknown-root case, incomplete data, and invalid request from a successful anomaly.
- Components: Clean fixture, unknown-root fixture, failure injection, UI state model, report verifier.
- Tasks: Run the same pipeline on the clean control; add provider failure, unsupported ABI, stale block, and oversized range cases; define recovery or smaller-range action.
- State transitions: SCOPED -> REJECTED; INGESTING -> RETRYABLE; EVIDENCE_READY -> INSUFFICIENT_DATA; COMPLETE -> REPLAY_MISMATCH when tampered.
- Success condition: Failure looks intentional and leaves safe, inspectable state.
- Failure condition: Blank screen, guessed clean result, or hidden missing evidence.
- Acceptance criteria:
  - Clean control documents why infrastructure roots do not inflate the result.
  - Incomplete evidence produces INSUFFICIENT_DATA.
  - Tampered JSON produces visible hash mismatch.
  - Retry or narrower-range action is available where safe.
- Verification: Failure/recovery tests, manual state walkthrough, and demo review.

### Slice 6 - Make agent behavior real and bounded

- Actor outcome: The analyst sees the agent choose a useful next branch without trusting it for arithmetic.
- Components: Deterministic summary, policy prompt, model adapter, structured-output validator, trace store, fallback policy.
- Tasks: Define branch schema; pass sanitized summaries; validate branch against an allowlist; fall back on timeout/invalid output; render branch and reason.
- State transitions: GRAPH_READY -> BRANCH_SELECTING -> DEEP_CHECK or EARLY_STOP, then CALCULATING; invalid output -> FALLBACK_POLICY.
- Success condition: At least one branch changes which deterministic check runs and is visible in trace.
- Failure condition: Model invents addresses/metrics, requests unapproved tools, or times out without fallback.
- Acceptance criteria:
  - Model receives no private keys or unsanitized external instructions.
  - Branch output is closed-schema and cannot alter verdict fields.
  - Fixed policy produces a complete report when model is unavailable.
  - Trace records mode, input summary hash, branch, and source counts.
- Verification: Malicious-output, timeout, prompt-injection, fallback, and trace tests.

### Slice 7 - Deliver the judge-visible product

- Actor outcome: A first-time reviewer completes the investigation, inspects proof, and understands limitations without a separate architecture lecture.
- Components: Web UI, API/orchestration, graph, evidence drawer, report export, explorer links, responsive/accessibility behavior.
- Tasks: Implement one-page flow, loading/partial/error states, source drawer, anomaly/clean comparison, static fallback report, and mobile/keyboard behavior.
- State transitions: All core states rendered through the natural interface.
- Success condition: The 180-second storyboard is a compressed run of the actual workflow.
- Failure condition: Dead controls, fake counters, hidden source links, or generic dashboard navigation.
- Acceptance criteria:
  - One primary action is obvious and every displayed action works.
  - Token, range, mode, verdict, and report hash remain visible.
  - Every highlighted edge has an explorer link.
  - Download/replay is reachable from the same surface.
  - Clean browser runs both fixtures without unexplained local state.
- Verification: Manual usability/accessibility/responsive pass and frame-by-frame demo review.

### Slice 8 - Submit a reproducible artifact

- Actor outcome: A judge clones the repository, opens the public URL or recorded fallback, inspects the report, and verifies submission links.
- Components: Repository, README, fixture manifest, CI checks, deployment, optional attestation, submission form.
- Tasks: Document setup, pin dependencies, publish proof artifacts, verify links, record video/thumbnail, and complete the actual Orion submission flow.
- State transitions: COMPLETE -> SUBMISSION_READY -> SUBMITTED, with recorded/static fallback if deployment fails.
- Success condition: Submission is accepted early and every form claim is supported.
- Failure condition: Private/broken link, misunderstood fee/network, or demo dependent on unavailable live state.
- Acceptance criteria:
  - Fresh clone and replay succeed from documented configuration.
  - Public app, repository, X, and Discord/Telegram links work in incognito mode.
  - Video is <= 180 seconds and contains positive and negative proof.
  - Orion status is described accurately.
- Verification: Submission preflight checklist, clean-browser run, link audit, and saved receipt.

## State Model

### Investigation lifecycle

~~~text
READY
  -> VALIDATING
      -> REJECTED
      -> SCOPED
          -> INGESTING
              -> RETRYABLE
              -> INSUFFICIENT_DATA
              -> EVIDENCE_READY
                  -> TRACING
                      -> CLASSIFYING
                          -> GRAPH_READY
                              -> BRANCH_SELECTING
                                  -> DEEP_CHECK
                                  -> EARLY_STOP
                              -> CALCULATING
                                  -> CERTIFYING
                                      -> COMPLETE
                                      -> REPLAY_MISMATCH
~~~

| State | Source of truth | Transition trigger | Actor feedback | Allowed next actions |
|---|---|---|---|---|
| READY | Form state | Page load/reset | Empty example and scope rules | Enter input |
| VALIDATING | Validation result | Submit | Field-level progress | Wait or correct |
| REJECTED | Validation error | Invalid chain/range/format | Specific reason | Correct/resubmit |
| SCOPED | Request record | Valid request accepted | Request ID/config hash | Start/cancel before reads |
| INGESTING | RPC trace | Read job started | Method, range, counts, provider | Wait/retry |
| RETRYABLE | Error record | Timeout/rate limit | Retry status and cause | Retry/cached fixture |
| INSUFFICIENT_DATA | Coverage report | Missing/inconsistent evidence | Missing fields and safe limitation | Narrow range/stop |
| EVIDENCE_READY | Normalized event set | Required logs complete | Event count/source status | Trace |
| TRACING | Graph builder | Funding traversal started | Hop progress/cap | Wait/stop at cap |
| CLASSIFYING | Taxonomy version | Root lookup complete | Known/unknown classes | Inspect sources |
| GRAPH_READY | Graph snapshot | Clusters formed | Cluster summary | Choose branch |
| BRANCH_SELECTING | Agent trace or fallback | Summary supplied | Branch and mode | Run branch |
| DEEP_CHECK/EARLY_STOP | Deterministic branch result | Branch completes | Extra evidence or reason to stop | Calculate |
| CALCULATING | Metrics engine | Inputs complete | Formula inputs | Wait |
| CERTIFYING | Canonical report | JSON/hash created | Verdict and hash | Download/replay |
| COMPLETE | Report artifact | Proof fields present | Evidence certificate | Inspect/share/replay |
| REPLAY_MISMATCH | Verifier | Bytes/hash differ | Tamper/nondeterminism warning | Inspect source/config |

### Report verdict state

ANOMALY means configured funding/volume anomaly thresholds were met for observed evidence. CLEAN means no configured anomaly was observed with sufficient coverage and exclusions. UNKNOWN_ROOTS means attribution coverage prevents a confident clean interpretation. INSUFFICIENT_DATA means the evidence set is incomplete or invalid. None proves intent, fraud, or ownership.

## Real Data / State Sources

| Product state/entity | Source classification | Owner | Required fields | Lifecycle |
|---|---|---|---|---|
| Investigation request | Actor input + derived | Application | token, blocks, chain, config, idempotency key | Created at submission; retained with report metadata |
| Current block/head | ONCHAIN via Base RPC | Base provider | number, hash, timestamp | Captured per request; never hidden moving scope |
| Transfer event | ONCHAIN via eth_getLogs | Base chain | contract, from, to, amount, tx, block, log index | Immutable evidence row |
| Swap event | ONCHAIN via selected DEX adapter | Base/DEX | pool, trader, amounts, side, tx, block, log index | Immutable evidence row |
| Funding edge | DERIVED | Dervyx engine | source, destination, amount, hop, event identity | Recomputed from raw rows |
| Root classification | Versioned external/static taxonomy | Dervyx configuration | address, class, source, version, confidence | Versioned with report; unknown valid |
| Cluster | DERIVED | Dervyx engine | members, root paths, overlap rule | Recomputed; no manual edits |
| Volume metric | DERIVED | Deterministic engine | numerator, denominator, units, window, exclusions | Recomputed; model cannot edit |
| Agent branch | DERIVED from model/fallback | Agent policy | summary hash, branch, reason, mode | Stored in trace; not numeric authority |
| Evidence report | DERIVED canonical artifact | Report service | schema, config, verdict, evidence, limitations, hash | Content-addressed; immutable |
| Replay result | DERIVED | Verifier | expected/actual hash, mismatch reason | Ephemeral, linked to report |
| Optional attestation | ONCHAIN write | Base contract | report hash, fixture ID, blocks, URI | Immutable receipt; no custody |

No personal data, private wallet keys, or user wallet permissions are required. Public address labels are observations, not identity claims.

## Requirements

### Functional requirements

| ID | Requirement | Priority | Acceptance evidence |
|---|---|---|---|
| FR-001 | Accept checksummed Base token, explicit start block, and end block through the primary interface | P0 | Valid request reaches SCOPED; invalid input rejected |
| FR-002 | Verify and display Base chain ID before interpreting events | P0 | Wrong-chain request refused |
| FR-003 | Fetch and normalize supported transfer and swap events from canonical Base RPC | P0 | Fixture counts/event IDs match manifest |
| FR-004 | Traverse wallet funding to a maximum of two hops and record provenance | P0 | Golden graph has expected paths |
| FR-005 | Apply versioned root taxonomy and retain unknown roots | P0 | Known/unknown fixtures classify correctly |
| FR-006 | Calculate observed cluster-linked volume with numerator, denominator, coverage, exclusions | P0 | Golden metrics reproduce |
| FR-007 | Produce documented verdict without claiming intent or fraud | P0 | Verdict/language tests |
| FR-008 | Expose an agent branch or explicit fixed-policy fallback | P0 | Trace contains validated branch/mode |
| FR-009 | Generate canonical JSON and stable SHA-256 report hash | P0 | Replay gives identical bytes/hash |
| FR-010 | Link highlighted evidence to Base transaction/block sources | P0 | All highlighted edges pass provenance check |
| FR-011 | Return intentional incomplete, unsupported, stale, rate-limit, and retryable states | P0 | Failure matrix visible |
| FR-012 | Provide JSON export and documented replay operation | P0 | Clean checkout reproduces fixture hash |
| FR-013 | Run the same engine on anomaly and clean controls | P0 | Pair visible in demo/report set |
| FR-014 | Expose agent-compatible Orion manifest/endpoint only if verified contract requires it | P0 conditional | Live Orion decision/evidence |
| FR-015 | Make scope, mode, verdict, evidence, and limitations visible on one primary page | P1 | Manual judge walkthrough |
| FR-016 | Optionally publish report hash to an immutable Base registry after core review | P1 optional | Verified receipt and contract review |

### Non-functional requirements

| ID | Requirement | Priority | Acceptance evidence |
|---|---|---|---|
| NFR-001 | No secret, private key, or model credential is required in browser or repository | P0 | Secret scan/clean-browser review |
| NFR-002 | Enforce maximum block span, event count, traversal cap, and rate limit | P0 | Boundary/abuse tests |
| NFR-003 | Displayed numeric fields originate from deterministic report fields | P0 | Field provenance audit |
| NFR-004 | Same fixture/config produces same canonical hash | P0 | Two-run replay |
| NFR-005 | Primary flow is keyboard usable with visible focus and text verdicts | P1 | Accessibility check |
| NFR-006 | Identify live, cached, and recorded evidence modes | P0 | Mode label in every report |
| NFR-007 | Provider/model failures are observable and never silently become CLEAN | P0 | Failure injection |
| NFR-008 | Dependencies are pinned and one verification command works from fresh checkout | P1 | Lockfile/reproducibility review |
| NFR-009 | Fixed-fixture path targets <=120 seconds cached and <=180 seconds live | P1 | Timed run |

### Business rules

| ID | Rule |
|---|---|
| BR-001 | Shared funding is evidence of a relationship, not proof of intent, ownership, or crime |
| BR-002 | Known infrastructure roots are excluded or separately classified |
| BR-003 | Incomplete evidence cannot produce CLEAN |
| BR-004 | Token, range, config version, taxonomy version, and hash identify a report |
| BR-005 | Model may choose an allowed branch, but deterministic code owns arithmetic, clusters, roots, and verdict |
| BR-006 | Every percentage/volume displays denominator, units, window, and exclusions |
| BR-007 | Unknown addresses remain unknown without sourced taxonomy evidence |
| BR-008 | Canonicalized reports are immutable; changed source/config creates a new identity |
| BR-009 | Optional attestation records a report hash, not truth or legal authority |

## Architecture and Technology

### Architecture recommendation

Use a modular monolith with one web/API deployment and pure deterministic packages. This is the smallest architecture that supports the actor workflow, proof, and failure states without premature queues or microservices.

### Planned components

| Component | Responsibility | Inputs/outputs | Owned data | Dependencies | Trust boundary | Failure behavior | Scaling concern | Justification |
|---|---|---|---|---|---|---|---|---|
| Investigation web surface | Natural analyst interaction/evidence display | Form/events/reports -> HTML/JSON/download | UI state | API | Browser untrusted | Explicit states | Graph size | Required actor surface |
| Orchestration/API | Validate, run bounded job, expose state | Request -> job/report | Request metadata | Engine/RPC/storage | Server boundary | Idempotency/rate limits | Concurrent jobs | Coherent workflow |
| Base RPC adapter | Read canonical chain evidence | RPC -> normalized blocks/logs/tx | Raw metadata | Provider(s) | Provider external | Retry/split/fail closed | Quota | Load-bearing proof |
| Event adapters | Decode supported transfer/swap shapes | Logs -> typed events | ABI/version metadata | RPC adapter | Contract data untrusted | Unsupported state | Protocol count | Tested scope |
| Funding/graph engine | Traverse and cluster addresses | Events -> graph | Derived graph | Pure code | No external trust | Cap/truncate explicitly | Nodes/edges | Winning mechanism |
| Root taxonomy | Classify known roots with provenance | Address -> class/source | Versioned config | Curated sources | Labels not identity proof | Unknown state | Allowlist size | False-positive control |
| Deterministic report engine | Metrics, verdicts, canonical JSON/hash | Graph/config -> report | Report artifact | Pure code | Numeric authority boundary | Invalid/incomplete report | Report size | Replayability |
| Agent policy adapter | Branch selection/explanation | Sanitized summary -> branch | Trace metadata | Model/fallback | Model untrusted | Fixed fallback | Cost/latency | Genuine bounded AI |
| Evidence storage | Fixture/report persistence | Report -> content-addressed JSON | Reports/fixtures | Local/durable store | Storage external | Download/static fallback | Artifact volume | Proof survives UI failure |
| Optional attestation contract | Register report hash | Operator tx -> receipt | Onchain hash records | Base wallet/deployer | Public contract | Omit if not ready | Minimal | Only after core proof |

### Architecture diagram

~~~mermaid
flowchart LR
  A[Listing analyst] --> W[Investigation web surface]
  W --> O[Orchestration API]
  O --> V[Scope and validation]
  O --> R[Base RPC adapter]
  R --> E[Event adapters]
  E --> G[Funding and cluster engine]
  G --> T[Root taxonomy]
  G --> P[Agent branch policy]
  T --> M[Deterministic metrics and verdict]
  P --> M
  M --> C[Canonical report and hash]
  C --> S[Report storage and replay]
  C --> X[Explorer links]
  C -. optional .-> H[Base hash registry]
~~~

### Technology choices

| Decision ID | Recommendation | Role | Trade-off | Alternative | Reconsideration trigger |
|---|---|---|---|---|---|
| ADR-001 | TypeScript modular monolith | Shared types, web/API, engine | One deployable unit couples concerns | Separate worker/API | Independent scaling need |
| ADR-002 | Next.js or equivalent server-rendered web surface | Analyst UI/API boundary | Framework/runtime coupling | Vite plus Node API | Hosting/streaming constraint |
| ADR-003 | viem or equivalent typed JSON-RPC client | Base reads/explorer URLs | Provider behavior varies | Raw JSON-RPC fetch | Client incompatibility |
| ADR-004 | Zod or equivalent runtime schemas | Requests/reports/model output | Schema maintenance | JSON Schema validator | Cross-language consumer |
| ADR-005 | Pure TypeScript graph/metrics packages | Deterministic calculations | Memory-bound on large ranges | SQL/graph indexer | Fixture exceeds caps |
| ADR-006 | Vitest-equivalent plus Playwright-equivalent checks | Verification | Browser setup cost | Manual-only | Never remove core replay/failure checks |
| ADR-007 | Sorted-key canonical JSON plus SHA-256 | Report identity | Formatting rules must stay stable | CBOR/multihash | External consumer requires other format |
| ADR-008 | Local fixtures plus small durable storage adapter if needed | Reproducible proof | Public history needs provider | Object storage/SQLite | Public URL requirement |
| ADR-009 | No contract in P0; immutable hash registry only in P1 | Avoid custody/admin risk | No optional receipt if omitted | Base Sepolia first | Core stable and time remains |

Exact dependency versions are not locked before Phase 0. The executor must pin supported versions and runtime, and an architecture-changing version conflict requires an amendment.

## API and Integration Contracts

### Investigation API

| Operation | Caller | Auth | Input | Output | Errors | Idempotency/retry |
|---|---|---|---|---|---|---|
| POST /api/investigations | Web UI/documented client | Public, rate-limited | token, blocks, mode, config, idempotency key | request ID, scope hash, initial state | 400, 413, 429, 503 | Same key returns same request |
| GET /api/investigations/{id} | Web UI/judge | Public opaque ID | request ID | state, progress, trace, report ref | 404, 410 | Poll with backoff |
| GET /api/reports/{hash} | Analyst/judge | Public content address | report hash | canonical JSON/metadata | 404, 409 | Immutable/no overwrite |
| POST /api/replay | Analyst/CI | Public bounded call | JSON or fixture ID | expected/actual hash | 400, 422, 503 | Side-effect free |
| GET /health | Host/monitor | Public | None | readiness/version/provider mode | 503 | No chain mutation |

### Base RPC integration

- Required methods: eth_chainId, eth_blockNumber, eth_getBlockByNumber or hash, eth_getLogs, eth_getTransactionByHash, and eth_getTransactionReceipt where context requires it.
- Caller: Server-side adapter only; no browser-injected provider.
- Authentication: Provider credential held server-side when required.
- Input: Fixed block tags and bounded filters for the selected token/protocol.
- Output: Raw response metadata plus normalized event rows.
- Timeout/retry: Bounded retry for transient errors; split ranges on limits; after budget return RETRYABLE or INSUFFICIENT_DATA.
- Pagination: Explicit range splitting and event-count checks; no silent truncation.
- Consistency: Capture block hashes at both ends and detect mismatched responses; use sufficiently confirmed fixture windows.
- Verification: Explorer comparison and replay against the same block range.

### Orion integration gate

DEC-001 must establish one verified contract before any Orion claim appears in code or submission copy:

1. Native runtime branch: Orion provides documented agent endpoint/manifest/SDK; Dervyx implements it and demonstrates the call in the same flow.
2. Submission/listing branch: Orion accepts a public URL/repository and provides registration/vetting/listing only; Dervyx remains self-contained and says so.
3. Unavailable branch: The live platform cannot be verified; Dervyx still implements Base evidence, but eligibility and sponsor fit remain a blocking risk and no invented links are submitted.

No branch may use a mock Orion response as proof.

### Optional attestation contract

- Method: permissionless publish(reportHash, fixtureId, startBlock, endBlock, uri) or similarly minimal immutable record.
- No funds, upgrades, withdrawal path, oracle authority, or truth claim.
- Duplicate publication is harmless and grouped by report identity.
- Operator signs only this optional transaction; core analysis never needs a wallet.
- Verification: deployed bytecode, source verification, receipt, emitted event, and hash comparison.

## AI Responsibilities and Controls

### Model responsibilities

- Choose one allowed investigation branch from a deterministic summary.
- Explain why the branch is relevant using only supplied fields.
- Produce a concise evidence narrative with explicit uncertainty.

### Deterministic responsibilities

- Decode and normalize events.
- Traverse funding and build clusters.
- Classify roots from versioned data.
- Calculate all metrics and verdicts.
- Create canonical JSON and hash.
- Decide whether required evidence is complete.

### Model boundary

- Input is a sanitized, schema-limited summary; arbitrary HTML, log strings, and addresses are untrusted data.
- Output is a closed enum plus bounded parameters; unknown branches are rejected.
- Structured output is validated before execution.
- Invalid output, timeout, quota error, or missing credentials invokes a fixed-policy fallback.
- Model text cannot populate numeric fields, source URLs, root classes, or verdicts.
- Prompt-injection text in token metadata or repository content is never an instruction.

### AI quality checks

- Branch selection matches policy for a deterministic summary fixture.
- A malicious output attempting to alter a percentage is rejected.
- Timeout still yields a complete deterministic report with fallback metadata.
- Report distinguishes model explanation from engine evidence.
- Cost and latency are bounded per investigation; no open-ended tool loop.

## Security, Privacy, and Threat Model

### Protected assets and trust boundaries

- Protected assets: report integrity, source provenance, provider credentials, model credentials, optional attestation key, service availability, and reputation of analyzed addresses.
- Entry points: public web/API, report/replay endpoint, model output, RPC responses, taxonomy updates, optional contract call.
- Untrusted parties: analyst input, token logs, RPC provider, model output, public URLs, and user-supplied labels.
- Privileged actor: deployment/operator wallet only for optional attestation; no privileged actor alters a published report.

| ID | Threat | Likelihood/impact | Prevention | Detection | Recovery | Residual risk | Verification |
|---|---|---|---|---|---|---|---|
| RISK-001 | Oversized range exhausts RPC/memory | High/High | Range/event/traversal caps, rate limit | Metrics/rejection logs | Bounded error | Provider-specific limits | Boundary/load test |
| RISK-002 | Stale/inconsistent blocks | Medium/High | Pin hashes/tags, confirmations | Hash mismatch/head metadata | Invalidate/rerun | Reorg window | Forced mismatch test |
| RISK-003 | Duplicate/paginated logs inflate volume | Medium/High | Event identity dedupe/count checks | Duplicate counter | Recompute raw rows | Malformed provider | Duplicate fixture |
| RISK-004 | Infrastructure root creates false accusation | High/High | Taxonomy, unknown state, neutral copy, clean control | Root coverage report | Correct taxonomy/regenerate | New unlabeled root | Root fixture/manual review |
| RISK-005 | Prompt injection changes branch/claim | Medium/High | Sanitization, closed schema, allowlist, fallback | Invalid output/trace | Discard model/use policy | Novel payload | Injection corpus |
| RISK-006 | Model invents numeric evidence | Medium/High | Engine-owned fields/schema separation | Provenance audit | Reject report | UI bug | Malicious-output test |
| RISK-007 | Report JSON tampered | Medium/High | Content hash/immutable storage | Replay mismatch | Mark invalid/retain original | Storage compromise | Tamper test |
| RISK-008 | Public API abuse/SSRF | Medium/High | No arbitrary URL fetch P0, allowlisted providers, limits | Access/error logs | Disable endpoint | Misconfiguration | Abuse test |
| RISK-009 | Secret/private key exposure | Low/High | Server-only env, no browser wallet, secret scan | CI/host scan | Rotate/invalidate | Deployment mistake | Clean checkout |
| RISK-010 | Unsupported ABI misdecoded | Medium/High | Adapter allowlist/version checks | ABI check | Refuse report | New proxy shape | Unsupported fixture |
| RISK-011 | Report implies legal guilt | Medium/High | Copy rules, labels, limitation panel | Content review | Rewrite/reissue | Screenshot misuse | Copy audit |
| RISK-012 | Attestation key misuse | Low/High | P1 only, no funds/admin methods | Onchain monitoring | Omit/rotate signer | Contract bug | Contract review |
| RISK-013 | Taxonomy source stale/poisoned | Medium/High | Version/provenance/review/unknown default | Taxonomy diff | Pin prior version | New address missed | Source review |
| RISK-014 | Model/RPC outage breaks demo | Medium/Medium | Cached fixtures, fallback policy, recorded video | Health state | Labeled fallback | Live proof unavailable | Outage rehearsal |

### Privacy and data handling

- Collect only public chain and public project evidence needed for the report.
- Do not collect wallet seeds, private keys, email addresses, or identity assertions.
- Prefer hashes/URLs and bounded excerpts over storing large third-party pages.
- Redact provider credentials from logs.
- Retain fixture/report artifacts for reproducibility; delete transient traces after the hackathon unless a public report needs them.
- Use observational, source-linked language for addresses.

## Performance, Reliability, and Operations

### Targets

- Fixed cached fixture report: <= 120 seconds.
- Live fixture report: <= 180 seconds under normal provider limits.
- First progress update: <= 3 seconds after accepted request.
- One active investigation per public client bucket, with a bounded queue.
- Report size bounded by event/evidence caps; truncation is explicit.
- Transient RPC errors retry within a bounded budget; no silent fallback to CLEAN.

### Observability

- Request ID and scope hash on every investigation.
- Structured events for validation, RPC method/range, splits, retries, event count, branch, report hash, and failure reason.
- Health check reports app version, provider reachability, and fixture mode without secrets.
- Metrics: request count, duration, state transitions, provider errors, event counts, model fallback rate, replay match rate.
- No metric is presented as adoption or accuracy unless measured and documented.

### Deployment and rollback

- Prefer one service with server-side RPC/model credentials.
- Provide static fixture/report fallback if live service is unavailable.
- Pin reviewed build before deployment.
- Rollback serves last verified build or recorded proof; published reports are never mutated.
- Optional contract deployment is separately optional and can be omitted from submission.

## Testing and Traceability

### Test layers

- Unit: validation, event normalization, dedupe, graph traversal, roots, metrics, canonicalization, verdict rules.
- Integration: Base RPC, provider errors, DEX adapter, report storage, model structured output.
- Contract: API/report schemas and optional attestation interface.
- End-to-end: browser submission through report/download/replay for anomaly and clean fixtures.
- Security: prompt injection, malicious model output, oversized range, SSRF absence, secret exposure, tamper, duplicates, unknown roots.
- Failure/recovery: timeout, 429, stale block, pagination omission, unsupported ABI, model outage, storage miss.
- Accessibility: keyboard path, focus, labels, text verdicts, reduced motion, contrast.
- Performance: fixture duration, event cap, bounded concurrent requests.
- Manual: explorer links, claim-language review, frame-by-frame demo, clean-browser run.

### Traceability matrix

| Requirement | Phase | Acceptance criterion | Verification |
|---|---|---|---|
| FR-001/FR-002 | 1 | Valid Base scope accepted; wrong scope rejected | API/browser boundary tests |
| FR-003 | 2 | Fixture events match raw source | RPC integration/explorer review |
| FR-004/FR-005 | 3 | Paths/roots deterministic and sourced | Golden graph/taxonomy tests |
| FR-006/FR-007/BR-001..BR-008 | 4 | Formula, language, verdict correct | Golden reports/copy audit |
| FR-008 | 6 | Branch validated and fallback works | Model-output/timeout tests |
| FR-009/FR-012 | 4/5 | Replay matches and tamper fails | Canonicalization/replay tests |
| FR-010 | 3/4 | Highlighted evidence has links | Provenance audit |
| FR-011 | 5 | Negative/failure states intentional | Failure matrix |
| FR-013 | 5 | Controls use same engine | Paired fixture e2e |
| FR-014 | 0/8 | Orion claim matches platform contract | Live platform/submission review |
| NFR-001/002/007 | 1/2/5 | Secrets, limits, failures controlled | Security/failure checks |
| NFR-003/004/006 | 4/5/7 | Numeric provenance, replay, mode labels hold | Field audit/manual review |
| NFR-005/009 | 7 | Accessible and time-bounded flow | Browser/accessibility/timing |

No implementation tests have been run at planning time. This matrix defines future verification and is not completion evidence.

## Critical Dependencies

| Dependency | Purpose | Criticality | Data shared | Quota/licence concern | Failure behavior | Fallback | Replacement difficulty |
|---|---|---|---|---|---|---|---|
| Base JSON-RPC provider | Canonical blocks/logs/transactions | P0 | Public token/range filters | Provider limits/terms | Retry/split/fail closed | Second provider/cached fixture | Medium |
| Base explorer | Human verification | P0 | Public hashes/blocks | Availability/URL format | Mark unavailable | Raw hash/block fields | Low |
| Supported DEX ABI/event contract | Swap decoding | P0 | Public logs | Protocol/version changes | Unsupported state | Narrow adapter | Medium |
| Root taxonomy sources | False-positive control | P0 | Public addresses/labels | Freshness/licence | Unknown class | Pin prior version | Medium |
| Model provider | Branch/explanation | P0 conditional | Sanitized summaries | Cost/latency/quota/retention | Fixed fallback | Local/smaller model | Medium |
| Orion platform | Registration/listing/runtime contract | P0 eligibility; runtime unresolved | Submission metadata/public URL | Rules/API/fee unknown | Mark unresolved | Self-contained if allowed | High |
| Hosting/runtime | Public judge URL | P1 | Public reports/server creds | Cost/availability | Recorded/static fallback | Alternate host | Low-medium |
| Optional attestation wallet | Hash receipt | P1 optional | Report hash only | Key custody/gas | Omit contract | Hash-only proof | Low |

## Risks

| ID | Risk | Probability | Impact | Mitigation | Trigger | Contingency |
|---|---|---:|---:|---|---|---|
| RISK-101 | Orion differs from supplied brief | High | High | Verify before implementation; explicit branches | Live docs unavailable | Self-contained app and honest disclosure |
| RISK-102 | No defensible anomaly fixture | Medium | High | Freeze real ranges before UI | Candidate fails replay/root checks | Narrow claim to funding anomaly or labeled testnet |
| RISK-103 | DEX event shape too variable | Medium | High | One adapter/version | Decode mismatch | Reduce to one protocol/pool |
| RISK-104 | Infrastructure false positives | High | High | Taxonomy, unknown state, paired controls | Control flags | Mark unknown/block verdict |
| RISK-105 | RPC quotas break live demo | High | Medium | Bounds, split calls, cache/record modes | 429/timeouts | Second provider/recorded proof |
| RISK-106 | Agent appears decorative | Medium | High | Branch changes deterministic work | Branch has no effect | Fixed policy with explicit label |
| RISK-107 | UI becomes generic dashboard | Medium | Medium | One page/evidence drawer | Dead navigation | Remove routes/features |
| RISK-108 | Contract consumes deadline | Medium | Medium | P1 gate/no funds | Not verified by Aug 28 | Hash-only proof |
| RISK-109 | Copy implies accusation | Medium | High | Language policy/review | “Proven wash trading” appears | Rewrite/re-record |
| RISK-110 | No durable report URL | Medium | Medium | JSON/hash first; storage decision | Host cannot persist | Committed fixtures/download |
| RISK-111 | Model cost/privacy conflict | Medium | Medium | Sanitized summary/one call/fallback | Quota/retention conflict | Fixed policy/disclosure |

## Assumptions

| ID | Assumption | Status | Consequence if wrong |
|---|---|---|---|
| ASM-001 | Supplied hackathon brief is authoritative for deadline/judging/links | Assumed | Revise submission plan from live rules |
| ASM-002 | Base is intended chain context for WashGuard | Confirmed by Win Plan; not tied to live rule | Re-select chain/fixtures |
| ASM-003 | Listing/risk analyst is primary actor | Inferred | Change interface/demo |
| ASM-004 | Read-only public analysis is acceptable | Assumed | Wallet/auth/privacy scope expands |
| ASM-005 | One DEX and two-hop funding demonstrate invariant | Approved default | Narrow claim if coverage weak |
| ASM-006 | Model or fallback can make one bounded branch decision | Assumed | Show fixed policy |
| ASM-007 | Explorer links remain available for selected fixtures | Assumed | Raw RPC fields become primary proof |
| ASM-008 | No personal incident story is required | Confirmed by absent evidence | Do not invent one |

## Open Decisions

| ID | Decision | Status | Decision deadline | Impact |
|---|---|---|---|---|
| DEC-001 | Does Orion expose a runtime agent contract, or only submission/listing? | Blocking, unresolved | Before Phase 1 | Sponsor integration and submission wording |
| DEC-002 | Which Base DEX/protocol and event version support first fixture? | Blocking, unresolved | Phase 0 | Adapter, ABI, graph evidence |
| DEC-003 | Which real token/range pair forms anomaly and clean controls? | Blocking, unresolved | Phase 0 | Golden reports and demo proof |
| DEC-004 | What durable report storage/deployment target is available? | Unresolved | Before Phase 7 | Public URL versus download-only |
| DEC-005 | Is optional Base hash registry worth schedule? | Unresolved | 2026-08-28 | Contract scope/deployment |
| DEC-006 | Which model provider/model and retention policy are acceptable? | Unresolved | Before Slice 6 | Cost, latency, privacy |
| DEC-007 | Which sourced root lists can be redistributed/versioned? | Unresolved | Phase 0 | Exclusions/false-positive risk |
| DEC-008 | Is Dervyx the final public name and is validation complete? | Unresolved, non-blocking | Before branding lock | URLs/copy |

No decision may be silently resolved in code. Record evidence, choice, and impact in PROJECT_STATE.md.

## Ordered Phases

Phases are ordered by verifiable actor outcomes, not technical layers.

## Phase 0: Evidence and sponsor prerequisites are locked

### Objective

Resolve DEC-001 through DEC-003 and prove selected evidence can be read and replayed.

### Requirements covered

FR-003, FR-013, FR-014, BR-002, NFR-006.

### Scope

One anomaly candidate, one clean control, one DEX/event adapter, Base source checks, Orion path verification, and root-source notes.

### Planned work

Inspect candidate ranges, record fixed block hashes, verify explorer links, test event decoding, document root sources, and inspect live Orion registration/submission/interface.

### Dependencies

Base RPC/explorer access, supplied brief, candidate public token activity.

### Acceptance criteria

- Fixture manifest is fixed and contains no secrets.
- Raw transfer/swap evidence is independently inspectable.
- Clean control uses same protocol/path or a documented comparable control.
- Orion branch is marked native, submission-only, or unavailable with evidence.

### Verification

Read-only RPC/explorer checks and planning-state checkpoint.

### Risks

No suitable fixture, provider limits, or platform mismatch.

### Exit gate

All three blocking decisions have recorded outcomes. If any fails, reduce scope before Phase 1.

## Phase 1: An analyst can scope a real Base investigation

### Objective

Complete form-to-request flow with real chain-ID validation and bounded scope.

### Requirements covered

FR-001, FR-002, NFR-002.

### Scope

Form, validation, request identity, idempotency, mode label, and initial state.

### Planned work

Implement natural entry surface and API boundary; no graph/model expansion until valid request is accepted and invalid requests fail intentionally.

### Dependencies

Phase 0 fixture and selected runtime.

### Acceptance criteria

- Valid fixture submission reaches SCOPED.
- Wrong chain, malformed address, reversed/oversized range, and duplicate behavior are visible.
- Chain ID, mode, config version, and request ID display.

### Verification

Browser/API boundary tests and clean-browser walkthrough.

### Risks

UI scope creep or hidden provider assumptions.

### Exit gate

Actor can start a bounded investigation from the primary page.

## Phase 2: The analyst sees canonical Base evidence

### Objective

Run selected fixture through real RPC reads and return normalized, source-linked events.

### Requirements covered

FR-003, FR-010, FR-011, NFR-007.

### Scope

RPC adapter, range splitting, event decoder, block consistency, progress, provider errors.

### Planned work

Read fixed block/log ranges, normalize event identity, preserve raw metadata, fail closed on incomplete/inconsistent evidence.

### Dependencies

Phase 1 and provider credentials/quotas.

### Acceptance criteria

- Fixture event counts match manifest.
- Every retained event has source identity.
- Rate limit, timeout, stale block, and unsupported ABI states are intentional.

### Verification

RPC integration tests, forced failures, pagination/range tests, explorer comparison.

### Risks

Provider limits or event-shape mismatch.

### Exit gate

Actor can open an evidence row and verify it independently.

## Phase 3: The analyst can trace funding and roots

### Objective

Show the two-hop funding graph and root taxonomy without counting infrastructure as independent coordination.

### Requirements covered

FR-004, FR-005, BR-002, BR-007.

### Scope

Graph traversal, dedupe, cluster rule, root taxonomy, unknown state, evidence drawer.

### Planned work

Build deterministic graph snapshots, apply versioned root classes, cap expansion, expose edge provenance.

### Dependencies

Phase 2 normalized events and root-source decision.

### Acceptance criteria

- Expected fixture paths reproduce exactly.
- Known roots segregate and unknown roots remain visible.
- Duplicate events do not inflate graph/volume.
- Selected edge opens transaction/block/log evidence.

### Verification

Golden graph and false-positive fixtures, duplicate tests, manual graph review.

### Risks

False attribution or graph explosion.

### Exit gate

Core invariant is visible in a source-linked graph.

## Phase 4: The analyst receives a reproducible certificate

### Objective

Turn graph evidence into a deterministic, limitation-aware report.

### Requirements covered

FR-006, FR-007, FR-009, FR-012, BR-001, BR-003 through BR-009, NFR-003, NFR-004.

### Scope

Metrics, verdicts, canonical JSON, hash, report download, replay.

### Planned work

Implement formula fields, config/version identity, stable ordering, schema validation, verifier output.

### Dependencies

Phase 3 graph and thresholds.

### Acceptance criteria

- Anomaly fixture produces expected ANOMALY report.
- Report has numerator/denominator, exclusions, coverage, limitations, and links.
- Replay matches; tampered JSON fails.
- No copy or field says result proves wash trading.

### Verification

Golden reports, schema/canonicalization/tamper tests, manual report audit.

### Risks

Threshold tuning, nondeterministic ordering, or overclaiming.

### Exit gate

Positive proof exists independently of the UI.

## Phase 5: Negative enforcement and recovery are visible

### Objective

Demonstrate that the system refuses unsafe certainty and handles incomplete evidence intentionally.

### Requirements covered

FR-011, FR-013, NFR-007, BR-003.

### Scope

Clean control, unknown-root case, RPC failure, stale data, unsupported adapter, oversized range, replay mismatch.

### Planned work

Run paired fixtures, inject failures, expose recovery actions, freeze demo states.

### Dependencies

Phase 4 report engine.

### Acceptance criteria

- Clean control does not inflate because known roots are separated.
- Incomplete data is not labeled clean.
- Tamper/replay mismatch is visible.
- Retry/narrow-range guidance is actionable.

### Verification

Failure/recovery matrix and manual state walkthrough.

### Risks

Only red case works or failure looks like crash.

### Exit gate

Negative proof can be shown in under 30 seconds with inspectable evidence.

## Phase 6: The agent chooses a bounded investigation branch

### Objective

Make AI participation genuine while keeping evidence and verdict deterministic.

### Requirements covered

FR-008, NFR-003, NFR-007, AI controls.

### Scope

Branch schema, model/fallback adapter, sanitized summary, trace, timeout, malicious-output handling.

### Planned work

Allow deeper funding, pair history, or early stop; validate it; execute only allowlisted deterministic checks.

### Dependencies

Phase 3 summary and model-provider decision.

### Acceptance criteria

- Branch selection changes deterministic work path.
- Trace displays input summary hash, branch, mode, and result.
- Invalid/slow model output falls back safely.
- Numbers and verdict remain engine-owned.

### Verification

Structured-output, injection, timeout, fallback, and trace tests.

### Risks

Decorative AI, model cost, or prompt injection.

### Exit gate

Agent behavior is observable and useful in the real actor flow.

## Phase 7: The complete workflow is credible and judge-ready

### Objective

Deliver the one-page investigation experience, report access, and optional public/attested proof.

### Requirements covered

FR-015, FR-016, NFR-005, NFR-006, NFR-009.

### Scope

Evidence-first UI, responsive/accessibility states, report path, optional attestation gate, health status, demo assets.

### Planned work

Implement storyboard through the app; add only storage/contract capability that improves inspectability without risking core.

### Dependencies

Phases 1-6, deployment target, optional contract decision.

### Acceptance criteria

- Clean browser completes anomaly and clean control.
- All visible actions work.
- Live/cached/recorded mode is clear.
- Download/replay reachable from same surface.
- Optional attestation omitted if not verified/useful.

### Verification

Manual usability/accessibility/responsive pass, timed demo, frame review.

### Risks

Polish hides incomplete behavior or storage fails.

### Exit gate

Real product workflow fits the 180-second demo.

## Phase 8: Fresh-start submission is reproducible

### Objective

Verify repository, deployment, demo, and submission evidence from a clean start.

### Requirements covered

All P0/P1 requirements and eligibility requirements.

### Scope

README, lockfile, fixture/replay command, public links, video, thumbnail, form, wallet/fee verification, saved receipt.

### Planned work

Run clean checkout, audit links/claims, submit early, preserve confirmation evidence.

### Dependencies

Phase 7 and verified Orion rules.

### Acceptance criteria

- Fresh checkout reproduces both fixture hashes.
- Public app, repository, X, and Discord/Telegram links work in incognito.
- Video is <= 180 seconds and contains positive/negative proof.
- Orion status is described accurately.

### Verification

Preflight checklist, clean-browser/mobile run, link audit, saved submission receipt.

### Risks

Platform outage, broken link, deadline misunderstanding.

### Exit gate

Submission accepted and reviewed build tagged.

## Definition of Ready

A phase may start only when:

- Prerequisites and open decisions are resolved or explicitly accepted as non-blocking.
- Actor outcome and source of truth are stated.
- Fixtures, contracts, or provider access are available.
- Acceptance and failure criteria are written.
- No hidden feature is needed to appear complete.
- A verification command or manual check can produce evidence.

## Definition of Done

A slice or phase is done only when:

- Primary actor performs the stated outcome through the natural interface.
- Real application logic and required Base/Orion integration participate.
- Winning invariant is enforced in runtime behavior.
- Positive proof and strongest relevant negative proof exist.
- Failure state is intentional and recoverable or clearly terminal.
- Dynamic state has an identified source.
- Acceptance criteria are verified and recorded in PROJECT_STATE.md.
- No mock or hardcoded state is presented as central proof.
- Next phase can start from a clean, documented state.

## Functional Core Gate

The executor must not begin P1/P2 work until every P0 item passes:

- [ ] Listing/risk analyst can start from investigation page.
- [ ] Token, chain, block range, config, and mode are validated and visible.
- [ ] Real Base RPC reads populate evidence.
- [ ] Selected sponsor/Orion path is verified or fallback branch is explicitly accepted.
- [ ] Two-hop funding and root classification run in application flow.
- [ ] Winning invariant is enforced by deterministic runtime behavior.
- [ ] Anomaly report is generated from a real fixture.
- [ ] Clean/unknown control and incomplete-data path work.
- [ ] Numeric verdict fields cannot be changed by model or client.
- [ ] Canonical report/replay hash matches twice.
- [ ] Raw source links and formulas are inspectable.
- [ ] Failure behavior is intentional and never guesses clean.
- [ ] Clean checkout reproduces core flow.

### Integrity gate

- [ ] No critical action is decorative.
- [ ] No dynamic state is falsely represented with hardcoded data.
- [ ] No mock sponsor response is presented as real execution.
- [ ] No central claim exists only in a script or test.
- [ ] No dead primary navigation or unsupported button remains.
- [ ] Every displayed state has an identifiable real source.

## MUST WORK

- Token/range entry and validation.
- Base chain ID and bounded-range check.
- Real Base RPC event ingestion for selected fixture.
- Supported transfer/swap normalization.
- Two-hop funding traversal and dedupe.
- Root taxonomy and visible unknown state.
- Deterministic clustering, volume attribution, and verdict.
- Agent branch or fixed-policy fallback with trace.
- Report JSON, canonical hash, download, and replay.
- Raw transaction/block links.
- Anomaly, clean/unknown, insufficient-data, retryable, and invalid states.
- Clean-browser operation without wallet permissions.
- Fresh-checkout fixture run.
- Orion registration/submission flow to the extent the live platform supports it.

## MUST PROVE

- Anomaly fixture has shared funding root and observed cluster-linked volume.
- Clean control does not falsely flag known infrastructure.
- Every highlighted edge is source-linked.
- Formula denominator, numerator, scope, exclusions, and config are visible.
- Report hash reproduces byte-for-byte.
- Tampering produces a mismatch.
- Model selects or declines a branch but does not own numeric truth.
- Incomplete data is not converted to clean.
- Base chain and block scope are fixed and inspectable.
- Orion claims, if any, match verified platform contract.

## MUST NOT FAKE

- Orion API calls, agent listing/vetting status, or sponsor endorsement.
- Base RPC responses, event counts, block hashes, receipts, or explorer states.
- Token volume, funding edges, root labels, clusters, percentages, confidence, or verdicts.
- Model branch traces or model availability.
- Report hashes, replay matches, or attestation receipts.
- Deployment health, timestamps, or user metrics.
- Clean-control results or failure states.
- Wallet signatures, contract execution, or payment/fee confirmation.

## Product Credibility Requirements

These are P1 when absence would make the product appear static, fake, or unusable:

- Clear empty state with a real example fixture.
- Progress showing actual method/range/count, not invented AI animation.
- Explicit live/cached/recorded mode.
- Retry and narrower-range guidance after provider failure.
- Evidence drawer with source links and classification reason.
- Report download and replay from the same page.
- Persistent request/report identity during refresh/re-entry.
- Mobile and keyboard-readable verdict/evidence states.
- Short README for reproducing both fixtures.
- Static fallback report/video that remains truthful if live RPC is down.

## Milestone Plan

| Milestone | Outcome | Class | Exit evidence |
|---|---|---|---|
| M0 | Sponsor path and paired fixtures are real/documented | P0 prerequisite | Decisions 001-003 recorded |
| M1 | Analyst scopes bounded Base investigation | P0 | Valid/invalid browser/API run |
| M2 | Real evidence ingested/source-linked | P0 | Fixture event manifest match |
| M3 | Funding graph and roots inspectable | P0 | Golden graph/root-control proof |
| M4 | Reproducible anomaly certificate exists | P0 | Canonical JSON/hash/replay |
| M5 | Clean, unknown, and failure paths intentional | P0 | Negative matrix/demo clip |
| M6 | Agent branch real but bounded | P0 | Trace/fallback test |
| M7 | Product credible through natural interface | P1 | Clean-browser 180-second run |
| M8 | Submission reproducible and accepted | P0 eligibility | Receipt/links/tagged build |

## Build If Time Remains

Only after Functional Core Gate passes:

- Durable public report history with content-addressed URLs.
- One additional DEX adapter with its own fixture and false-positive tests.
- Minimal immutable Base report-hash registry.
- Side-by-side comparison of two reports.
- Sourced root-taxonomy maintenance view.
- Additional replay formats for API consumers.

## Optional Polish

- Sub-250ms evidence-row transitions.
- Improved graph layout and edge pinning.
- Thumbnail/diagram refinement.
- Reduced-motion and high-contrast themes.
- Copy editing after evidence and limitations are stable.

Polish must never precede a failing P0 gate.

## Implementation Handoff Protocol

### Before execution

1. Read this entire plan and PROJECT_STATE.md.
2. Inspect the actual Dervyx directory and preserve WIN-PLAN.md.
3. Verify current phase/checkpoint and all blocking decisions.
4. Re-check Orion rules and Base provider assumptions before selecting dependencies.
5. Start only with the next exact action in the state file.

### During execution

1. Work in vertical slices and preserve the locked invariant.
2. Keep model output and deterministic evidence separate.
3. Update PROJECT_STATE.md after every slice, decision, failure, test run, and work session.
4. Record commands, results, changed files, deviations, and risks factually.
5. Stop when a blocking acceptance criterion fails; do not hide it with mock state.
6. Amend this plan only through the amendment protocol in the state file.

### After each checkpoint

1. Add a numbered checkpoint entry.
2. Record acceptance criteria verified and exact evidence.
3. Record any decision/deviation and plan impact.
4. State one next exact action.

## Planning Audit

### Control-flow classification

- Stage 1 classification: complete.
- Stage 2 brief normalization: complete from supplied brief, Win Plan, and validation artifact.
- Stage 3 completeness assessment: complete; unknowns are labeled below.
- Stage 4 targeted questions: not required; remaining unknowns are externally verifiable prerequisite decisions.
- Stage 5 mode selection: Deep because Web3 evidence, AI controls, sponsor uncertainty, and public claims are high risk.
- Stage 6 research depth: Standard; official Base docs and live Orion page were checked, but Orion rules remain supplied-brief evidence.
- Stage 7 modules: product, UX, architecture, blockchain, AI, security, testing, reliability, hackathon, and documentation required; monetization/business-model modules not applicable.
- Stage 8 feasibility gate: Proceed with prerequisite validation and scope reduction.

### Actor test

Conditional pass. The actor, job, and web surface are specific. Final submission workflow waits on Orion path and fixture verification.

### Functionality test

Planned pass. Slices connect input, real RPC evidence, graph logic, report, UI feedback, and replay. No implementation evidence exists yet.

### Sponsor test

Conditional fail pending DEC-001. Base RPC/explorer is load-bearing to evidence. Orion is observed only as a public placeholder plus supplied-brief context, so no native runtime claim is authorized.

### Invariant test

Planned pass. Fixed scope, canonical event identity, deterministic metrics, root separation, and fail-closed incomplete-data behavior enforce the rule.

### Proof test

Planned pass. Report/hash/raw-link design gives an inspectable proof path, but no fixture/report exists yet.

### Negative test

Planned pass. Clean-control, unknown-root, incomplete-data, tamper, and invalid-scope cases are explicit.

### Credibility test

Conditional pass. One evidence-first page, source drawer, status states, replay, and fallback are sufficient if implemented; the current folder has no app.

### Demo test

Planned pass. The 180-second storyboard is a compressed real workflow; mode labels must remain truthful.

### Quality-gate result

- Problem gate: Pass.
- Evidence gate: Conditional; Orion and fixtures unresolved.
- Scope gate: Pass with hard exclusions.
- Design gate: Pass at planning level.
- Requirement gate: Pass; requirements are testable.
- Delivery gate: Pass; phases have dependencies and exit gates.
- Verification gate: Pass at planning level; no implementation tests run.
- State gate: Satisfied by companion PROJECT_STATE.md.

## Research Sources

| Research question | Finding | Source/publisher | Link | Date checked | Confidence | Planning impact |
|---|---|---|---|---|---|---|
| What Base networks and chain IDs should adapter target? | Base Mainnet is 8453 and Base Sepolia is 84532; use explicit server-side chain configuration | Base Documentation | https://docs.base.org/base-chain/quickstart/connecting-to-base | 2026-08-18 | High | Locks chain validation/testnet labeling |
| Which canonical read methods are available? | Base documents eth_chainId, block/transaction methods, and eth_getLogs; bound logs and handle provider limits | Base Documentation | https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getLogs | 2026-08-18 | High | Defines RPC adapter/pagination/failure behavior |
| How should finality/reorg uncertainty be handled? | Base documents increasing finality stages; pin block hashes and use confirmed fixture window | Base Documentation | https://docs.base.org/base-chain/network-information/transaction-finality | 2026-08-18 | High | Adds consistency/reorg fields |
| Does Base MCP provide needed read primitive? | Current docs emphasize wallet reads/writes, contract calls, and x402; it is not selected as arbitrary historical-log source | Base Documentation | https://docs.base.org/agents/ | 2026-08-18 | Medium-high | Avoids decorative wallet integration |
| What does public Orion site expose today? | Live domain returns Portuguese coming-soon placeholder and no visible hackathon/API/listing contract | Orion Agents | https://orionagents.ai/ | 2026-08-18 | High for observed page; low for hidden rules | Makes DEC-001 blocking and forbids invented claims |
| What supplied rules and validation constrain build? | Supplied brief describes deadline, judge surfaces, links, and WashGuard evidence mechanism; validation warns Orion runtime APIs are undocumented | Local validation artifact | /root/projects/orion-idea-tournament-validation.md | 2026-08-18 | Medium | Preserves Win Plan scope and labels unverified facts |
| What approved boundaries must be preserved? | Base-only, two-hop graph, root filtering, clean control, deterministic report/replay, no definitive fraud claim | Local approved Win Plan | /root/projects/Dervyx/WIN-PLAN.md | 2026-08-18 | High | Locks mechanism and exclusions |

Research limitations: no public Orion hackathon API or live submission form was available during planning. Provider quotas, selected DEX adapter, fixture addresses, and redistributable root sources remain unresolved and must be verified in Phase 0.
