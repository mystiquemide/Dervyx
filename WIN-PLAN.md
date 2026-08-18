# Dervyx — Win Plan

## 1. Executive Verdict

Dervyx can be competitive, but the current project has no implementation, repository material, deployed URL, contract, screenshots, demo, or verified token fixtures. On the evidence available today, it is an idea, not a submission.

The concept should not be presented as an autonomous "wash-trading slasher." Shared funding is evidence of coordination risk, not proof that every associated trade is wash trading. That wording creates an avoidable technical and reputational attack. The winning version is:

> Dervyx is a Base launchpad and exchange-vetting agent that traces wallet funding, filters known exchange and bridge roots, and publishes a reproducible funding-and-volume anomaly certificate.

The product must make one claim and prove it:

> Given a Base token and a fixed block range, Dervyx can show exactly which wallets share funding roots, how much swap volume passes through those clusters, which known roots were excluded, and how another person can reproduce the result.

The build must deliberately exclude:

- definitive accusations of fraud or market manipulation;
- automatic slashing, blacklisting, or listing decisions;
- multi-chain support;
- every DEX and every token standard;
- a general-purpose chatbot;
- a speculative token, points system, or reputation economy;
- an unauditable LLM score;
- claims about private Orion APIs until those APIs are verified.

The strongest path is a narrow, real Base implementation with two fixed fixtures: one suspicious anomaly case and one clean control. Each result must expose raw transaction links, block range, formulas, exclusions, confidence, and a content hash anchored on Base if the minimal attestation contract is stable by the deadline.

The current public `orionagents.ai` domain does not expose the hackathon material supplied in the brief. Treat the embedded brief as authoritative, but verify the actual registration, submission, and agent API flow before building an Orion-specific integration. Base should be the load-bearing technical ecosystem. Orion should be represented through a real agent submission and listing flow, never through invented platform capabilities.

Verdict: BUILD, with a hard scope freeze today. The project wins or loses on evidence quality and demo reliability, not on adding more analytics.

## 2. Estimated Judge Score

The official brief says partner judges score usefulness, execution, and originality from 0 to 10, informed by AI vetting and community upvotes. The table below also tracks practical surfaces that determine those scores.

Current state means the folder is empty and no implementation evidence was supplied. Target state assumes the minimum build described in this document is complete and deployed.

| Surface | Current | Target | Weight | Reason |
|---|---:|---:|---:|---|
| Usefulness to launchpads and exchanges | 5 | 9 | 20% | Clear vetting workflow, but no users or live report yet |
| Working execution | 0 | 9 | 25% | No code or deployment currently exists |
| Originality | 7 | 8 | 15% | Funding-graph evidence is differentiated from generic token chat |
| Base ecosystem fit | 5 | 9 | 10% | Base RPC and Base transaction proof are load-bearing |
| Orion agent fit | 3 | 8 | 10% | Agent packaging and submission flow are not yet verified |
| Proof quality | 0 | 9 | 10% | Must show raw logs, formulas, clean control, and reproducibility |
| Demo clarity | 2 | 9 | 5% | Story is clear only after the evidence UI exists |
| AI contribution | 2 | 7 | 3% | The model must choose investigative branches and explain evidence, not invent scores |
| Submission readiness | 0 | 9 | 2% | No repository, links, video, or form completed |
| **Estimated weighted score** | **3.0/10** | **8.7/10** | **100%** | Current score is an unbuilt project score |

The target score is conditional. A polished graph without reproducible evidence is a 5, not an 8. A real certificate with a false-positive clean control is worse than an honest anomaly report with a limitation label.

## 3. Scoring Surface Map

| Judging Surface | Evidence Currently Present | Missing Evidence | Risk | Fix |
|---|---|---|---|---|
| Usefulness | A plausible launchpad/CEX vetting problem and named partner judges | A real report that saves an analyst time | HIGH | Demonstrate one token review from input to evidence packet in under two minutes |
| Execution | None | Running agent, parser, graph, report, deployed URL | HIGH | Ship the vertical slice before adding any secondary feature |
| Originality | Funding-root graph rather than generic token commentary | Clear distinction from BaseScout, Rigel, and existing graph tools | MEDIUM | Make known-root filtering, volume attribution, and reproducibility the product, not a generic risk score |
| Base fit | Base is the target chain and RPC source | Verified Base transaction/event links and chain ID checks | HIGH | Use Base RPC in the live trace and link every edge to a block/transaction |
| Orion fit | Brief allows any AI agent and lists Agent Store/vetting | Actual Orion agent packaging, registration, submission, and listing | HIGH | Verify the API/protocol; otherwise submit a self-contained agent and state exactly what is Orion-native |
| Use of AI | Proposal says an LLM formats evidence | Observable autonomous branch selection | MEDIUM | Let the agent decide whether to deepen a funding branch, inspect pair history, or stop; keep all numerical calculations deterministic |
| Technical credibility | DSU/Jaccard idea | Formal schema, thresholds, exclusions, tests, and threat model | HIGH | Publish the formula, fixtures, and limitations in README and UI |
| Proof | Proposed graph and dossier | Independent replay, clean control, report hash, explorer links | HIGH | Fix block range, expose raw inputs, and provide a one-command replay |
| Demo | Suspect and organic paths described | Reliable recorded run and live fallback | HIGH | Record a full run, cache read-only fixtures, and show live RPC status honestly |
| UX | No UI | One-screen evidence narrative with clear confidence labels | HIGH | Build a forensic chain-of-custody interface, not a generic dashboard |
| Community voting | None | Shareable result page and short proof clip | MEDIUM | Publish one real finding per post; never farm votes with generic progress updates |
| Submission compliance | None | Wallet, fee, links, video, GitHub, website, X, Discord/Telegram | HIGH | Run the preflight checklist 24 hours before the deadline |

The highest-risk surfaces are execution, proof, and Orion fit. Do not spend time on branding, animations, or extra chains while any of those remain below 7/10.

## 4. Positioning Rewrite

### Judge-facing one-liner

> Dervyx investigates Base token volume by tracing wallet funding, excluding known exchange and bridge roots, and publishing a reproducible anomaly certificate instead of an uncheckable risk score.

### 20-second explanation

> A token can look decentralized while dozens of trading wallets share one funding root. Dervyx reads Base transfer and swap events, builds the funding graph, measures how much volume travels through related clusters, filters legitimate shared roots, and shows every conclusion as evidence a listing analyst can replay.

### Opening narration

> “A listing desk does not need another token summary. It needs to know whether the wallets creating the volume are actually independent. Dervyx starts with a Base token, follows the money two hops, separates known exchange and bridge infrastructure, and gives the reviewer the transactions behind the conclusion.”

Do not open with “AI-powered,” “autonomous slasher,” “fraud detector,” or a market-size claim. Those phrases invite objections before the judge sees the proof.

### Founder story constraint

No personal incident is present in the current material. Do not invent a date, token, transaction amount, chain loss, or personal victim story. A fabricated founder story is an immediate credibility failure.

Use a verified public incident only if you can cite the token, chain, transaction, amount, date, and source. Otherwise use the concrete analyst workflow above. The product can be compelling without pretending that the builder personally lost funds.

### What Dervyx intentionally does not do

| Exclusion | Why it improves the submission |
|---|---|
| Does not declare criminal wash trading | Avoids claiming more than graph evidence can establish |
| Does not auto-blacklist or slash | Keeps the system advisory, reversible, and demonstrable |
| Does not cover every chain | Makes Base RPC behavior and proof precise |
| Does not use an LLM for numbers | Makes results reproducible and defensible |
| Does not infer anonymous ownership as fact | Separates observed funding from attribution claims |
| Does not ingest social sentiment in the core demo | Avoids drifting into the existing BaseScout/Drift-d category |

### Product promise

> Dervyx does not tell you who is guilty. It shows whether claimed market activity is structurally independent, and gives you the evidence to decide.

## 5. README Blueprint

The README must be a judge-readable proof document, not a startup pitch. Keep it under 1,200 words. Put the first proof screenshot and the deployed link above the fold.

### Exact section order

1. **Dervyx in one sentence**
   - Purpose: immediate category and outcome.
   - Maximum: 35 words.
   - Assets: one screenshot of the evidence certificate.
   - Links: live app, recorded run, GitHub.

2. **The 90-second proof**
   - Purpose: show the exact suspect and clean-control flow.
   - Maximum: 120 words plus a numbered list.
   - Assets: two screenshots, one explorer link, one report JSON link.
   - Links: both fixture reports and transaction/block references.

3. **Problem**
   - Purpose: explain the listing analyst's decision problem.
   - Maximum: 100 words.
   - Assets: one diagram showing many wallets and a shared root.
   - Links: one reputable market-integrity source, not a pile of citations.

4. **How it works**
   - Purpose: make the deterministic pipeline understandable.
   - Maximum: 180 words.
   - Assets: five-box architecture diagram.
   - Links: Base RPC documentation and event ABI references.

5. **Evidence contract**
   - Purpose: define what each result means and does not mean.
   - Maximum: 180 words.
   - Assets: sample JSON and annotated certificate.
   - Links: replay command and report hash/explorer transaction.

6. **Live examples**
   - Purpose: show suspect and clean outcomes, including limitations.
   - Maximum: 140 words.
   - Assets: side-by-side result images.
   - Links: fixed block ranges, token addresses, raw logs.

7. **Agent behavior**
   - Purpose: prove why this is an agent and not a static script.
   - Maximum: 120 words.
   - Assets: trace screenshot showing a branch decision.
   - Links: trace JSON.

8. **Run locally**
   - Purpose: make judging reproducible.
   - Maximum: 120 words plus commands.
   - Assets: `.env.example`, fixture manifest.
   - Links: setup, RPC requirements, expected output hash.

9. **Limitations and threat model**
   - Purpose: remove easy auditor objections.
   - Maximum: 180 words.
   - Assets: none beyond a small assumptions table.
   - Links: test cases for false positives and stale data.

10. **Orion and Base integration**
    - Purpose: state exactly what is native and what is not.
    - Maximum: 100 words.
    - Assets: listing/submission screenshot if available.
    - Links: actual Orion entry and Base explorer.

11. **License**
    - Purpose: establish open-source terms.
    - Maximum: 20 words.
    - Assets: `LICENSE`.
    - Links: none.

### Must Include

- A live URL that opens directly to the token investigation flow.
- One suspect fixture and one clean control with fixed block ranges.
- Raw transaction hashes and block numbers behind every highlighted edge.
- Known exchange, bridge, and market-maker exclusion policy.
- Exact definition of funding depth, cluster membership, circular-volume estimate, and confidence.
- A visible `ANOMALY`, `CLEAN`, `INSUFFICIENT DATA`, or `UNKNOWN` state.
- A replay command that produces the same report hash.
- A trace showing at least one autonomous branch decision.
- A clear statement that anomaly is not proof of intent or fraud.
- Base chain ID and RPC source label.
- Orion submission/listing evidence only after it is real.
- A short video and a static fallback report.

### Remove Immediately

- “AI-powered” as a standalone benefit.
- “Deterministically detects wash trading” unless the result is narrowed to anomaly evidence.
- Market-size, tokenomics, fundraising, and roadmap sections.
- Claims about “10+ hours saved” without a measured benchmark.
- Any invented Orion API, reputation score, slash, or escrow integration.
- Generic architecture prose that never appears in the demo.
- Social sentiment, multi-chain, NFT, and wallet-health features.
- A single composite risk score with no decomposition.
- Fake live counters, fake transaction hashes, or simulated explorer states.
- Screenshots that hide the token address, block range, or data source.

### Repository hygiene

- Use a `main` branch that always runs from a clean checkout.
- Use short commits named `feat:`, `test:`, `fix:`, `docs:`, or `chore:` followed by the measurable change.
- Tag `v0.1-demo`, `v0.2-proof`, and `v1.0-submission` only when each tag is reproducible.
- Keep `apps/web`, `packages/engine`, `packages/chain`, `packages/report`, `contracts/attestation`, `fixtures`, `tests`, and `docs` separate.
- Commit the fixture manifest and expected report hashes, never private RPC credentials.
- Add `LICENSE`, `.env.example`, `CONTRIBUTING.md` only if it is short and accurate, and `SECURITY.md` with the non-custodial threat model.
- Pin dependency versions and record the Node/runtime version.
- Include one CI command that runs unit tests, type checks, lint, and fixture replay.
- Do not commit generated browser profiles, screenshots with secrets, or massive RPC dumps.

## 6. Architecture Locks

Freeze these decisions before building the UI. Changing them late invalidates screenshots, fixtures, and the demo narrative.

| Decision | Locked choice | Why judges care | Consequence if changed later |
|---|---|---|---|
| Chain | Base only | Makes sponsor and proof concrete | Every fixture, explorer link, and parser changes if expanded |
| Input | Token address plus explicit start/end block | Prevents moving-target results | UI and report schema become incompatible if time semantics change |
| Data source | Base RPC for canonical logs; optional indexed acceleration clearly labeled | Keeps raw evidence directly verifiable | A hidden indexer undermines reproducibility |
| Event scope | ERC-20 `Transfer` plus supported DEX `Swap` events for one or two Base protocols | Makes the graph buildable in the deadline | Every added DEX needs ABI, fixtures, and false-positive tests |
| Funding depth | Exactly two hops in the winning demo | Keeps the claim understandable and bounded | Thresholds and graph size change if depth changes |
| Graph edge types | Funding transfer, swap participation, and root classification | Lets judges inspect why an edge exists | A generic graph loses auditability |
| Known-root policy | Versioned allowlist for exchanges, bridges, routers, and market makers; unknown roots remain unknown | Prevents the obvious CEX-wallet false positive | Reclassifying roots changes historical results |
| Cluster rule | Deterministic connected components plus documented minimum overlap | Reproducible and easy to test | A model-based cluster cannot be replayed reliably |
| Volume attribution | Report observed swap volume linked to a cluster; do not call it “wash volume” | Avoids overclaiming intent | Any wording change requires new proof and UI labels |
| Thresholds | Configuration committed with each report, not hidden constants | Judges can reproduce the result | Tuning after the demo looks like cherry-picking |
| Verdicts | `ANOMALY`, `CLEAN`, `INSUFFICIENT_DATA`, `UNKNOWN_ROOTS` | Honest uncertainty is a feature | A binary verdict creates false certainty |
| Agent role | LLM selects investigative branch and writes evidence explanation; deterministic engine owns all numbers and verdicts | Demonstrates real agent behavior without hallucinated math | Moving scoring into the model destroys trust |
| Report identity | Canonical JSON, normalized key order, SHA-256 hash | Gives every result a stable identity | Non-canonical output prevents replay comparison |
| Onchain anchor | Minimal immutable Base attestation contract storing report hash, fixture ID, block range, and URI; no funds, no upgradeability | Creates a sponsor-visible proof artifact | Adding a mutable contract late creates audit and deployment risk |
| Contract authority | Anyone may publish a report hash; contract never claims the result is true | Avoids false authority | Access control would add a trust dependency |
| Replay protection | Report ID includes token, range, config version, and content hash | Prevents duplicate or ambiguous receipts | A weak ID allows conflicting certificates |
| Storage | Public JSON report plus content hash; database only caches jobs | Keeps evidence portable | A private database makes the proof disappear |
| Wallet flow | Read-only by default; deployment wallet signs only attestation transactions | Removes user custody risk | Adding user wallets expands attack surface |
| Upgradeability | No upgradeable contracts in submission | Judges can inspect final bytecode | Proxy administration becomes an avoidable red flag |
| API behavior | Rate limits, bounded block ranges, explicit retry state | Prevents abuse and stale partial reports | Unbounded queries can break the live run |
| Failure semantics | Partial RPC failure yields `INSUFFICIENT_DATA`, never a guessed clean result | Makes negative proof credible | Silent fallback makes every report suspect |

The attestation contract is optional only if it threatens the deadline. A real Base explorer-linked report hash is worth more than a rushed contract with unclear semantics.

## 7. Attack & Escape Review

The following attacks are the tests a skeptical judge can invent in seconds. Every one needs a code test, README statement, and visible demo or report evidence.

| Attack | Expected result | Mitigation | Automated test | README proof | Demo proof |
|---|---|---|---|---|---|
| Replay the same report | Same canonical hash, no duplicate meaning | Report ID binds token, range, config, and hash | Replay fixture twice and compare bytes/hash | Report identity formula | Show identical hash on rerun |
| Submit same wallet edge twice | Volume is counted once | Deduplicate by transaction/log index | Duplicate-log fixture | Event identity fields | Open raw edge list |
| Fake token address on another chain | Request rejected | Enforce Base chain ID and checksum | Wrong-chain input test | Input contract | Enter Ethereum address and show refusal |
| Spoof a known exchange root | It remains `UNKNOWN` unless allowlist evidence exists | Versioned allowlist with provenance | Unknown-root fixture | Allowlist source/version | Show amber unknown root, not green clean |
| CEX hot wallet funds many users | Not labeled wash trading | Exclude or separately classify known roots | Known-hot-wallet fixture | Exclusion policy | Clean control demonstrates filter |
| Bridge contract funds many users | Not labeled coordinated trading by default | Bridge root class and separate metric | Bridge fixture | Root taxonomy | Toggle “include infrastructure roots” |
| Market maker uses shared treasury | Flag as shared funding, not fraud | Confidence language and root class | Market-maker fixture | Limitations | Show “anomaly, intent unproven” |
| Circular trades use multiple roots | Report only observed supported edges | State coverage and unknown-root count | Multi-root fixture | Coverage metric | Show missing-edge warning |
| Transfers use fee-on-transfer token | Amount mismatch is explicit | Decode actual log amounts and decimals | Fee-token fixture | Amount semantics | Show raw amount versus normalized amount |
| Token emits malicious fake `Transfer` logs | Do not treat logs as complete truth | Verify contract and supported event shape | Malformed ABI fixture | Contract validation | Reject unsupported token |
| DEX proxy or router changes event shape | Mark unsupported, do not guess | Protocol/version adapter | Unsupported-pair test | Supported protocol list | Show unsupported state |
| RPC returns stale block data | Range and latest block are visible | Pin block tags and compare provider head | Stale-provider fixture | Freshness rule | Show block timestamp/head |
| RPC rate limit midway | No false clean result | Retry, bounded query, `INSUFFICIENT_DATA` | Forced 429 test | Failure semantics | Disconnect provider and show honest state |
| Reorg or inconsistent provider response | Report is invalidated or rerun | Confirmations and block hash capture | Mismatched-block test | Reorg policy | Display block hash in report |
| Pagination omission | Full query count is visible | Explicit pagination and event count checks | Multi-page fixture | Query coverage | Show fetched page/count |
| LLM invents a root or percentage | UI refuses unsupported values | Numbers only from engine schema | Malicious model-output test | Agent boundary | Display source field for every number |
| UI colors hide uncertainty | Judge sees exact state | Text labels and accessible legend | Screenshot/accessibility test | Verdict legend | Pause on `UNKNOWN` case |
| User changes threshold after result | Old report remains immutable | Config hash in report | Config mutation test | Versioned config | Compare two config runs |
| Attestation hash points to changed JSON | Verification fails | Content-addressed report and checksum | Tampered-file test | Verification command | Modify JSON and show mismatch |
| Unauthorized attestation publish | No funds or privileged state can be changed | Permissionless hash registry, no custody | Fuzz publish function | Contract scope | Show contract has no withdrawal path |
| Duplicate report transactions | Harmless, same report identity | Idempotent UI grouping | Duplicate tx fixture | Replay behavior | Show grouped receipt |
| API abuse with huge block range | Request is rejected or queued | Max range and per-wallet rate limit | Boundary test | Limits | Enter oversized range |
| Wallet attribution inferred as fact | Report labels observed addresses only | Separate observed and attributed fields | Attribution absence test | Language policy | Show “unknown owner” |
| Competitor claims a cleaner result | Raw evidence can be independently compared | Export JSON and block links | Cross-run comparison test | Reproduction steps | Judge opens explorer link |

The most dangerous escape is not a smart-contract bug. It is a false accusation caused by infrastructure wallets. The clean control and root taxonomy are mandatory, not polish.

## 8. Demo Storyboard

Maximum length: 180 seconds. Record a clean version with local cached fixtures and a live-read version. Label cached evidence as cached; never imply a network call occurred when it did not.

| Time | Screen | Narration | Action | Proof created | Sponsor technology | Judging objective |
|---:|---|---|---|---|---|---|
| 0-8s | Opening evidence view | “A token reports organic volume. Dervyx checks whether the trading wallets are actually independent.” | Show token, Base badge, and fixed block range | Input identity | Base chain context | Immediate usefulness |
| 8-20s | Investigation form | “Every number below is tied to this address and these blocks.” | Submit preselected fixture | Request hash/config | Base RPC target | Technical clarity |
| 20-38s | Live trace | “The agent chooses a funding-depth check, then asks for swap history only where the graph is dense.” | Stream RPC calls and branch decision | Request/event counts | Base RPC | Real AI-agent behavior |
| 38-62s | Funding graph | “These wallets share a root. These roots are known exchange or bridge infrastructure and are not treated as evidence of coordination.” | Animate edges by type; open one edge | Tx hash/block/log index | Base explorer links | Execution and nuance |
| 62-82s | Deterministic metrics | “Dervyx reports observed cluster-linked volume, not a crime score.” | Reveal cluster size, coverage, unknown roots, and formula | Calculation inputs/output | Base event data | Proof and originality |
| 82-102s | Anomaly certificate | “The result is an anomaly certificate with a confidence label and a limitation statement.” | Show `ANOMALY` plus evidence list | Canonical report JSON/hash | Optional Base attestation | Usefulness |
| 102-120s | Explorer/report split | “A judge can verify the raw transactions without trusting this interface.” | Open one Base explorer tx and report JSON | Independent raw proof | Base explorer | Sponsor-native proof |
| 120-142s | Clean control | “Now the same pipeline examines a clean control. Shared exchange infrastructure is filtered, and the result does not inflate.” | Run clean fixture | `CLEAN`/coverage report | Base RPC | Negative proof |
| 142-158s | Tamper/replay check | “Change the report or rerun the same range. The hash either matches or verification fails.” | Rerun and show hash; edit copy if recorded | Replay/tamper result | Base anchor if deployed | Auditability |
| 158-172s | Agent trace summary | “The model explains the evidence, but the deterministic engine owns every number.” | Show trace summary and source fields | Model/engine boundary | Orion agent role | AI credibility |
| 172-180s | Closing frame | “Dervyx does not accuse a token. It shows whether the volume is structurally independent.” | Show URL, GitHub, explorer, and one-line invariant | Submission links | Orion/Base | Memorability and CTA |

### Judge Double-Click Review

Any paused frame must answer these questions without narration:

- What token and chain are being investigated?
- What exact block range is used?
- Is this live, cached, or recorded evidence?
- Which edges are funding and which are swaps?
- Why is a root classified as exchange, bridge, market maker, or unknown?
- Where is the raw transaction link?
- Is the percentage observed volume or an inferred accusation?
- What happens when data is incomplete?
- What did the model decide, and what did deterministic code calculate?
- Can the report be replayed?

Frames that currently create doubt and their fixes:

| Doubtful frame | Why it fails | Fix |
|---|---|---|
| Giant red “WASH TRADING” label | Claims intent without proof | Use “FUNDING/VOLUME ANOMALY” and show confidence |
| Graph with unlabeled dots | Looks decorative | Put address fragments, edge type, tx count, and root class on hover/open |
| Spinner with no request data | Could be a mock | Show RPC method, block range, count, and status |
| Percentage without denominator | Impossible to audit | Show numerator, denominator, pair, window, and excluded roots |
| “AI detected” badge | Model authority is not evidence | Label model as explanation/branch selector only |
| Explorer link hidden in a menu | Judge cannot verify | Put one-click links beside every highlighted edge |
| Clean result omitted | No false-positive test | Run it visibly and show why infrastructure roots were excluded |
| Empty error state | Looks broken | Explain `INSUFFICIENT_DATA` and offer a smaller range |
| Fake live timestamp | Misleading | Use provider block timestamp and label recording mode |
| Dense dashboard overview | Judge loses the narrative | Use one investigation page and a collapsible evidence drawer |

## 9. Frontend Identity

The default implementation would look like another dark crypto dashboard. That is a liability. Dervyx should look like a forensic chain-of-custody tool.

### Visual metaphor

An evidence board: a central funding graph connected to a chronological evidence ledger. The graph is not the hero by itself. Every highlighted edge opens its source transaction and classification reason.

### Interaction style

- One primary action: `Investigate token`.
- Step indicator: `Scope`, `Trace`, `Classify`, `Certify`.
- Clicking a graph edge opens a right-side evidence drawer, not a modal maze.
- Use progressive disclosure: summary first, raw logs one click away.
- Let the judge pin up to three evidence edges for comparison.

### Typography and spacing

- Use a neutral grotesk for UI and a restrained monospace for addresses, block numbers, hashes, and formulas.
- Use a compact 8px spacing grid and stable graph dimensions.
- Keep headings small and factual. No hero-scale marketing text inside the tool.
- Make the token address, block range, and verdict visible at all times.

### Color logic

- Charcoal/white base for an evidence-room feel.
- Teal for verified source data.
- Amber for unknown or incomplete attribution.
- Red only for an observed anomaly, never for an accusation.
- Violet is reserved for model-selected investigation branches, not proof.
- Do not use gradients, glowing orbs, or decorative blockchain imagery.

### Motion

- Animate the actual event sequence in timestamp order.
- Do not animate an invented “AI thinking” state.
- Keep transitions under 250ms.
- When a result arrives, reveal the evidence rows before the headline verdict.

### States

- Empty: one token input and a concrete example fixture.
- Loading: live RPC method, block range, progress count, and retry status.
- Partial: amber banner with exactly which evidence is missing.
- Success: certificate with report hash and explorer links.
- Anomaly: red accent, neutral language, and evidence list.
- Clean: teal accent and the root exclusions that prevented a false flag.
- Failure: actionable RPC/provider message, never a blank error screen.

The memorable screenshot is a split view: a red shared funding root on the left, a neutral evidence ledger on the right, and a visible statement that known infrastructure roots were excluded.

## 10. Social Strategy

Post only when there is a concrete artifact. Do not post generic “building in public” updates. The schedule runs from August 18 through September 2, 2026. The August 17 scope-freeze row in the execution table is retained as a completed prerequisite from the prior planning session.

| Date | Hook | Proof | Asset | Lesson | CTA |
|---|---|---|---|---|---|
| Aug 18 | “A graph can accuse the wrong wallet. Here is how Dervyx avoids that.” | Known exchange root classified separately | 20s screen capture | Shared funding is not proof of intent | Ask listing analysts which roots they whitelist |
| Aug 20 | “One Base token, one fixed block range, one reproducible funding graph.” | Raw event count and first edge | Annotated graph screenshot | Scope makes forensic claims testable | Invite a reviewer to replay the range |
| Aug 22 | “The first result was wrong because the denominator was wrong.” | Before/after volume calculation | Short diff video | Evidence quality beats a dramatic score | Ask for edge-case tokens |
| Aug 24 | “Dervyx labels unknown roots instead of guessing owners.” | Unknown-root report row | Certificate screenshot | Honest uncertainty prevents false accusations | Link the public report |
| Aug 26 | “Same pipeline, clean control.” | Clean fixture with excluded infrastructure roots | Side-by-side video | A negative case is part of the product | Ask judges to inspect the explorer links |
| Aug 28 | “The model chooses where to look. It does not choose the number.” | Branch trace plus deterministic output | Trace clip | AI contribution must be inspectable | Link the replay command |
| Aug 30 | “Can you tamper with a Dervyx certificate?” | Hash mismatch after editing JSON | Terminal/video proof | Content-addressed evidence is harder to fake | Invite independent verification |
| Sep 1 | “Submission candidate: 90 seconds from token to certificate.” | Full recorded run | Final demo clip | Compression reveals product quality | Share GitHub and live URL |
| Sep 2 | “Dervyx is live for Base listing evidence.” | Final report, explorer, and repository | Thumbnail plus links | A concrete artifact beats a launch claim | Point to the entry and replay |

Every post must use the same terminology: anomaly, observed volume, known root, unknown root, evidence, replay. Never use “proven wash trading” in social copy.

## 11. Day-by-Day Execution Plan

| Day | Objective | Deliverable | Exit Criterion | Risk | Backup Plan |
|---|---|---|---|---|---|
| Aug 17 (completed) | Freeze scope and verify Orion submission path | Repo skeleton, decision log, verified deadline/eligibility notes | No feature remains outside the one-page scope | Orion API unavailable | Build a self-contained agent endpoint and document the uncertainty |
| Aug 18 | Define evidence schema and fixtures | JSON schema, token/range manifest, verdict enum | Fixture schema validates and contains no secrets | No suitable real fixture | Use a controlled Base Sepolia fixture, labeled testnet |
| Aug 19 | Implement Base RPC adapter | Block, receipt, log, and chain-ID reader | Reads one known transaction and matches explorer data | RPC rate limits | Add a second provider, label fallback |
| Aug 20 | Parse transfers and supported swap events | Normalized event tables | Unit tests pass for every supported event type | ABI/proxy variation | Narrow to one DEX and one event version |
| Aug 21 | Build two-hop funding graph | Nodes, edges, root traversal | Fixture graph reproduces expected root paths | Graph explosion | Cap depth and show truncation honestly |
| Aug 22 | Implement root taxonomy | Versioned known-root allowlist and unknown state | CEX/bridge/market-maker fixtures classify correctly | Bad labels | Mark ambiguous roots unknown and expose source |
| Aug 23 | Implement deterministic metrics | Cluster overlap, observed volume, coverage, thresholds | Golden fixtures produce committed expected numbers | False positives | Reduce claim to funding anomaly and publish limitations |
| Aug 24 | Implement report and hash | Canonical JSON, SHA-256, verification command | Rerun produces byte-identical report/hash | Non-deterministic ordering | Normalize keys, timestamps, and IDs |
| Aug 25 | Add agent branch selection | Tool trace and branch policy | Agent selects at least one deeper check based on graph evidence | Model hallucination | Fixed policy fallback with explicit label |
| Aug 26 | Build investigation UI | Input, trace, graph, evidence drawer | Suspect fixture works end to end locally | UI scope creep | Use a single page and static graph fallback |
| Aug 27 | Add clean control and partial state | Clean result, unknown-root result, RPC failure state | Three states visible without code changes | Only red demo works | Block demo until clean control passes |
| Aug 28 | Add optional attestation contract | Minimal immutable report-hash registry | Contract tests and one Base receipt verified | Deployment/audit delay | Ship report hash and explorer links without contract |
| Aug 29 | Adversarial test day | Replay, duplicate, stale, rate-limit, spoof, tamper tests | All critical tests pass in CI | Hidden edge failure | Cut unsupported DEX/token paths |
| Aug 30 | Deploy and observe | Public URL, API logs, health check, fixture cache | Fresh checkout and public URL reproduce both fixtures | Hosting limits | Record a truthful run and serve read-only fixture mode |
| Aug 31 | README and video lock | README, 180-second video, thumbnail, diagrams | A reviewer can run the proof without questions | Copy overrun | Delete every section not used in demo |
| Sep 1 | Submission rehearsal | Dry-run form, links, wallet, backup video/assets | All links work from a private browser and mobile viewport | Last-minute broken link | Submit a backup static report and recorded proof |
| Sep 2 | Submit early | Final entry and receipt | Submission accepted before 18:00 UTC, not at 23:59 | Platform outage | Keep screenshots, hashes, and confirmation receipt |

No day is complete because code was written. It is complete only when the exit criterion is observable.

## 12. Submission Preflight Checklist

### Eligibility and registration

- [ ] Registration completed with the correct wallet.
- [ ] Registration signature and email confirmation saved.
- [ ] Submission wallet is the wallet that should receive prizes.
- [ ] Deadline confirmed as September 2, 2026 at 23:59 UTC from the actual submission page.
- [ ] Ignition fee amount and network confirmed from the live platform, not an old screenshot.
- [ ] Team name, builder name, and contact details are consistent everywhere.

### Repository

- [ ] GitHub repository is public and opens without authentication.
- [ ] `main` branch is the submission build.
- [ ] `v1.0-submission` tag points to the reviewed commit.
- [ ] README follows the exact proof-first structure.
- [ ] `.env.example` contains names only, never secrets.
- [ ] Fixture manifest and expected hashes are committed.
- [ ] One clean checkout command works.
- [ ] Unit, integration, type, lint, and fixture-replay tests pass.
- [ ] License is present.
- [ ] No private keys, API keys, cookies, browser profiles, or secret report data are committed.
- [ ] No generated files obscure the source or inflate the repository.

### Product and deployment

- [ ] Public investigation URL loads on desktop and mobile.
- [ ] Base chain ID is visible.
- [ ] Live/cached/recorded evidence mode is visible.
- [ ] Token address and block range remain visible during the run.
- [ ] Suspect fixture completes successfully.
- [ ] Clean control completes successfully.
- [ ] Partial/RPC failure state is understandable.
- [ ] Every highlighted edge has an explorer link.
- [ ] Report JSON downloads successfully.
- [ ] Replay command reproduces the report hash.
- [ ] Optional attestation contract address is verified and linked, or explicitly omitted with no fake claim.
- [ ] No user funds or private wallet permissions are required for read-only analysis.

### Evidence and technical disclosure

- [ ] README defines anomaly, clean, unknown, and insufficient-data states.
- [ ] README states that shared funding does not prove intent or fraud.
- [ ] Known-root allowlist version and sources are visible.
- [ ] Formula, denominator, block window, and exclusions are visible.
- [ ] Raw RPC/event evidence is retained or replayable.
- [ ] Model-generated text cannot alter numeric verdict fields.
- [ ] Unsupported DEXs and token behaviors are disclosed.
- [ ] Reorg, stale provider, rate limit, and pagination behavior is documented.
- [ ] Testnet use is labeled as testnet; no simulated transaction is called live.

### Demo and media

- [ ] 180-second video has a problem, trigger, Base trace, anomaly proof, clean control, and replay proof.
- [ ] Video opens with the product, not a title animation.
- [ ] Token address, block range, and explorer links are readable in the recording.
- [ ] Narration never says “proven wash trading.”
- [ ] A live fallback and a recorded fallback exist.
- [ ] Thumbnail shows the evidence graph and certificate, not a generic logo.
- [ ] Captions/transcript are checked for incorrect technical claims.
- [ ] Audio is clear on phone speakers.
- [ ] Video URL is public and tested in an incognito window.

### Hackathon submission

- [ ] Website URL entered.
- [ ] X profile entered.
- [ ] GitHub URL entered.
- [ ] Discord or Telegram link entered.
- [ ] Orion agent listing URL entered if available.
- [ ] Base explorer links entered.
- [ ] Sponsor names are accurate and do not imply endorsement.
- [ ] AI agent behavior is described truthfully.
- [ ] Required disclosures and team information are complete.
- [ ] Submission form preview checked for truncation.
- [ ] Final submit confirmation and transaction/receipt saved.
- [ ] Community post links to a real artifact, not a promise.

## 13. Immediate Kill List (things to remove)

1. Remove “wash-trading slasher” from the product name, headline, and UI.
2. Remove any red verdict that implies intent, fraud, or guilt.
3. Remove multi-chain plans from the submission build.
4. Remove social sentiment and AI-generated market commentary.
5. Remove automatic listing rejection, slashing, and reputation penalties.
6. Remove a single opaque risk score.
7. Remove undocumented Orion API claims.
8. Remove fake live activity, simulated explorer receipts, and fabricated metrics.
9. Remove any wallet-custody or token-transfer feature.
10. Remove a second DEX integration if the first is not fully tested.
11. Remove a smart contract if it is not deployed, verified, and needed for a report hash.
12. Remove every feature that does not appear in the 180-second demo.
13. Remove startup language, market-size claims, and future roadmap promises.
14. Remove an LLM from any path that computes cluster membership or percentages.
15. Remove owner attribution unless the evidence is explicit and sourced.

## 14. Immediate Build List (highest ROI additions)

1. Build the Base RPC vertical slice from token input to normalized logs.
2. Lock one suspect fixture and one clean control before UI work.
3. Implement the two-hop funding graph with visible edge provenance.
4. Create the versioned known-root taxonomy and unknown state.
5. Make observed cluster-linked volume reproducible from a fixed block range.
6. Add `ANOMALY`, `CLEAN`, `UNKNOWN_ROOTS`, and `INSUFFICIENT_DATA` verdicts.
7. Expose a deterministic report JSON and replay hash.
8. Add one genuine agent branch decision and show it in the trace.
9. Build the evidence drawer with transaction/block links.
10. Add the clean control before polishing the anomaly visualization.
11. Add adversarial tests for duplicates, stale data, rate limits, spoofed roots, and tampered reports.
12. Deploy a read-only public URL and test it from a clean browser.
13. Record the 180-second proof and inspect it frame by frame.
14. Verify the real Orion submission flow and remove assumptions it does not support.
15. Submit at least six hours before the deadline.

## 15. The Card No One Else Holds

The strongest defensible proof is a paired, explorer-verifiable report for the same Base investigation pipeline:

1. A fixed token and block range produce a funding graph where several trading wallets share a root.
2. Dervyx shows the exact transfer and swap transaction links, the root classification, the numerator and denominator of observed cluster-linked volume, and the unknown-root coverage.
3. A clean control using known exchange/bridge infrastructure is run through the same code and does not inflate the anomaly result.
4. The canonical report JSON reproduces byte-for-byte and its hash is independently verifiable, optionally anchored in a minimal immutable Base registry.

Competitors can copy a red graph or write “wash trading detected.” They will struggle to fake a paired result whose raw edges, exclusions, formulas, clean control, replay hash, and Base explorer artifacts all agree.

That is Dervyx's winning card:

> It does not ask a judge to trust its accusation. It gives the judge enough evidence to audit the accusation themselves.
