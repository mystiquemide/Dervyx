# Dervyx Project State

## Project

- Plan file: PROJECT_PLAN.md
- Status: Planned
- Current phase: Not started; Phase 0 prerequisite validation is next
- Current checkpoint: CP-000
- Last updated: 2026-08-18
- Last agent: Planner
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

## Current Objective

- Phase: Phase 0 - Evidence and sponsor prerequisites are locked
- Checkpoint: CP-000
- Goal: Verify the real Orion submission/runtime path and freeze one real Base anomaly fixture, one clean control, one supported DEX/event adapter, and the root-taxonomy source.
- Expected files or assets: Evidence gathered from live documentation/explorer/RPC checks; decisions recorded in this state file. Do not create implementation files before the prerequisite gate passes.
- Acceptance criteria:
  - DEC-001, DEC-002, and DEC-003 have evidence-backed outcomes.
  - Fixture manifests contain fixed token/range/chain fields and no secrets.
  - At least one transfer and swap event for each selected fixture is independently inspectable.
  - Orion is accurately classified as native runtime, submission/listing only, or unavailable.
- Required verification: Read-only Orion/page checks, Base RPC/explorer checks, and a written checkpoint update.

## Current Status

### Completed

- Approved concept is WashGuard, renamed provisionally to Dervyx.
- Existing WIN-PLAN.md reviewed and preserved as a constraint.
- Product claim narrowed to a funding/volume anomaly certificate, not proof of criminal wash trading.
- Functional-vertical-slice plan created with P0/P1 scope, state model, requirements, risks, and verification gates.
- Official Base documentation and the current public Orion page were checked on 2026-08-18.
- Current Dervyx directory was inspected; before this planning pass it contained only WIN-PLAN.md.

### In Progress

- None. Planning is complete; execution has not started.

### Blocked

- Orion's actual registration/submission/agent contract is not exposed by the current public site.
- No real anomaly/clean fixture pair or first supported DEX adapter has been frozen.
- No implementation evidence exists yet.

### Not Started

- Base RPC adapter and event normalization.
- Funding graph and root taxonomy.
- Deterministic metrics/report/replay.
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

## Decisions Made During Execution

| ID | Date | Decision | Reason | Plan impact |
|---|---|---|---|---|
| DEC-PLAN-001 | 2026-08-18 | Use a funding/volume anomaly certificate rather than a wash-trading accusation | Shared funding is not proof of intent and infrastructure roots create false positives | Controls product language, verdicts, UI, and demo |
| DEC-PLAN-002 | 2026-08-18 | Build functional vertical slices around the analyst workflow | Layer-first sequencing would delay proof and hide incomplete integration | Defines Phase 0 through Phase 8 |
| DEC-PLAN-003 | 2026-08-18 | No wallet custody or user transaction action in the core | The analyst job is read-only and custody adds unrelated risk | Keeps primary workflow public/read-only |
| DEC-PLAN-004 | 2026-08-18 | No Orion capability may be claimed without a live contract/source | Current public site does not expose the supplied brief or API | Makes DEC-001 a prerequisite |

## Plan Deviations

| ID | Date | Original plan | Change | Reason | Approval status |
|---|---|---|---|---|---|
| None | 2026-08-18 | No execution deviation recorded | No change | Planning completed before implementation | Not applicable |

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

## Known Issues

| ID | Severity | Description | Workaround | Required fix |
|---|---|---|---|---|
| ISSUE-001 | High | Public Orion domain does not expose the supplied hackathon material or runtime contract | Treat supplied brief as provisional and do not claim native behavior | Resolve DEC-001 from live organizer/platform evidence |
| ISSUE-002 | High | No real anomaly/clean fixture pair is frozen | Keep implementation at Phase 0 | Resolve DEC-003 with explorer/RPC evidence |
| ISSUE-003 | High | First supported DEX/event adapter is unknown | Do not scaffold a parser yet | Resolve DEC-002 and record ABI/event version |
| ISSUE-004 | Medium | Durable public report storage is not selected | Plan hash/download first | Resolve DEC-004 before Phase 7 |
| ISSUE-005 | Medium | Model provider and retention policy are not selected | Use fixed-policy fallback in planning | Resolve DEC-006 before Slice 6 |
| ISSUE-006 | Low | Dervyx name validation is provisional | Use Dervyx internally | Resolve DEC-008 before branding/submission |

## Blockers

| ID | Description | Impact | Required resolution |
|---|---|---|---|
| BLK-001 | Orion integration/submission path is unverified | Cannot responsibly claim sponsor-native behavior or finalize eligibility flow | Verify live platform/organizer documentation and record DEC-001 |
| BLK-002 | Real anomaly and clean control are not frozen | No deterministic report, graph, or demo proof can be trusted | Inspect Base candidates and record DEC-003 |
| BLK-003 | Supported DEX/event adapter and redistributable root sources are unresolved | Event parser and false-positive controls cannot be scoped | Select adapter and taxonomy source in Phase 0; record DEC-002 and DEC-007 |

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

Verify the actual Orion registration/submission/agent endpoint from the live platform or supplied organizer documentation, capture the source and date, and record the outcome as DEC-001 before selecting implementation dependencies.
