# DiceBox Campaign Helper Development Workflow — 2026-08-26

**Version:** 2026-08-26.3  
**Status:** accepted under D-252/M218 and revised by D-263/M229 and D-264/M230  
**Owner:** DiceBox Campaign Helper Foreman

## Outcome

Build the Campaign Helper through one ordered product stage at a time while keeping project decisions, communication, implementation, exact-stack evidence, and live Foundry state consistent without turning any mirror or successful transport into authority.

## Authority planes

1. **Normative contracts and ADRs** define invariants, source precedence, safety, and architecture.
2. **Roadmap and active card** select the accepted outcome and ordered product stage.
3. **Reproducible development KB** records provenance, reconciliation, evidence, decisions, trials, and blockers from `database/schema.sql`, `database/seed.sql`, and lexical `database/seed.d/*.sql`; `database/build_database.py` and `database/verify_database.py` are the canonical rebuild/verification path.
4. **Canonical project files and content-addressed assets** hold program-owned campaign truth.
5. **Sovereign live Foundry state** owns current play state and foreign/runtime-owned fields.
6. **Communication and evidence mirrors**—the exact idea document, shared Sheet/Drive snapshots, and `Dicebox20/chatgpt-codex-project-bridge`—carry bounded handoffs only.

No plane silently substitutes for another. In particular, a communication repository, Google document, chat response, CI run, macro response, or database snapshot never accepts a project change or grants Foundry authority.

## Governing loop

Every bounded task uses:

`understand → consult → reconcile → plan → validate → preview → approve → execute → reread → recover → record`

Before planning a specialized DiceBox routine, load the instruction chain, run the machine active-slice check, and query the approved read-only KB. Reuse an existing routine when it fits. A conflict blocks invention until it is preserved and reconciled.

## Accepted-change synchronization gate

Every user-accepted or autonomous project change is recorded immediately in the canonical repository roadmap/current active card and the reproducible KB chronology. Compatible changes may form one explicit implementation bundle; that bundle uses this order:

`accepted change → repository roadmap/active card → KB reconciliation/rebuild/verification → implementation → authoritative reread/receipt → scheduled communication mirror`

The communication-mirror document is exactly:

`https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit`

Document ID is `14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o`; active tab is Tab 1 (`t.0`). Use a fresh trusted read or the established connector-native full-structure fallback, required-revision writes, and connector readback when a scheduled or explicit mirror boundary is due. Routine document writes are batch-bound: at most one acceptance or closure/handoff update per work session and no more than one routine update in 24 hours; combine compatible updates where possible. The schedule controls only external mirror publication and never blocks repository planning, accepted-bundle selection, KB reconciliation, implementation, validation, reread, recovery, or closure. An explicit user request, material coordination blocker, or release/handoff boundary may override routine timing. A member change outside an accepted bundle waits for its repository roadmap/card and KB gate, not for a routine mirror write. Read-only investigation, bounded research, and emergency containment may precede the gate, but cannot become implementation.

## Compact change card

One user-visible active outcome carries:

- acceptance observation;
- owner;
- exact target and authority;
- allowed and excluded scope;
- deterministic check;
- live check where behavior requires it;
- stop and recovery condition;
- required evidence label;
- synchronization status and direct evidence references.

Keep at most one build, one live, and one research/recovery item active. Park every other ledger item.

## Definition of Ready

Implementation is ready only when:

- the current contract and ADR chain is loaded;
- the workflow checker passes;
- the relevant KB facts, decisions, trials, open items, and schemas were queried;
- conflicts and superseded guidance are recorded;
- the roadmap and active card contain the accepted change;
- communication-mirror synchronization status is recorded; connector write/readback is required only when the current scheduled or explicit mirror boundary is due and never blocks local implementation by cadence alone;
- a unique reproducible KB packet (baseline seed plus ordered seed.d deltas as applicable) rebuilds and verifies;
- allowed scope, deterministic checks, live checks, and stop conditions are explicit;
- required credentials, licensed exact-stack resources, and authority are available without widening scope.

## Delivery loop

1. Select the smallest complete vertical slice in the active stage.
2. Build or update the deterministic local contract and tests.
3. Run focused static/type/unit checks.
4. Build the relevant package or application boundary.
5. Use the lightest evidence lane that can prove the acceptance observation.
6. Preview every mutation and obtain the required approval.
7. Execute once with exact target and current authority checks.
8. Reread authoritative state before declaring commit or retrying an unknown outcome.
9. Recover narrowly; preserve unknown, foreign, and runtime-owned state.
10. Record one blocker-based receipt, update the roadmap/card, then close through shared-document and KB synchronization.

## Evidence lanes

Evidence labels are exact and non-promotional:

- `research`: source or conversation analysis;
- `local`: deterministic source/build evidence;
- `staged`: installed bytes or package staging without runtime proof;
- `fixture`: isolated exact-stack behavior;
- `Ballad`: exact campaign-target evidence;
- `player-accepted`: final human/player acceptance.

No label implies a later lane. Source tests, API existence, successful transport, visible UI, or installed bytes do not prove committed runtime behavior.

## Foundry execution and evidence foundation

Stage 9 is `foundry-execution-evidence-foundation`, before conversational and broad authoring stages. It must provide:

- typed Foundry intermediate representation with stable DiceBox IDs, explicit ownership, target/profile identity, dependency ordering, and deterministic hashes;
- a staged executor with persisted stable bindings, stale-plan rejection, idempotency/recovery keys, timeout-as-unknown handling, authoritative reread, and blocker-based receipts;
- asset upload, fetch, served-byte hash attestation **before** any dependent document creation;
- installer and verifier artifacts generated from one canonical specification;
- exact package, installer, worker, adapter, and runtime hashes in receipts;
- a promotion blocker whenever installed and expected hashes drift;
- RuntimeProfile scanning and profile-diff gates for Foundry, system, modules, package, adapter, active GM, and capabilities;
- a resettable event-driven exact-stack harness with GM/player authority observations, traces, screenshots/logs on failure, redaction, and support bundles;
- diagnostics previously described as Utility Harness work, shared with later release diagnostics rather than a disconnected product stage.

Never depend on same-batch references to documents created earlier in that batch. Never use raw rendered pixels directly as geometry authority; inspected grayscale observations may become deterministic only after Feature Manifest/Spatial Blueprint reconciliation under the current semantic-render workflow. A macro is a bounded transport or legacy compatibility fixture, not a generic runtime architecture.

## Additive Scene Injector workflow hardening — 2026-10-05

This additive hardening does not change the six authority planes, the 16-stage product order, or the meaning of runtime certification. It hardens one recurring deliverable boundary that previously depended too heavily on conversational memory.

For DiceBox Foundry Scene Injector work, the named outer sequence `PREPARE -> RENDER -> INSPECT(PASS = APPROVED | REDO) -> BUILD` is a workflow API. `APPROVE` is optional and redundant after the final INSPECT PASS. RENDER/INSPECT follow the current two-pass semantic rendition in `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`: grayscale structural render + structural inspection/Feature Manifest, then painterly render + final inspection. `BUILD` is not generic packaging. The canonical BUILD artifact is exactly one Markdown file containing exactly one self-contained executable JavaScript injection macro. Embedded art may be compressed and split into internal string chunks, but it must be reassembled and decoded inside that same macro; multiple user-run macro parts are forbidden.

Agents must load `.codex/skills/dicebox-injector-workflow/SKILL.md` for these operations. Before delivery, a BUILD artifact must pass `node tools/validate-dicebox-build.mjs <artifact.md>`. Failure blocks delivery. The validator rejects wrong primary formats such as ZIP, multiple code blocks/macros, missing contract markers, instructions for a second macro/part, and forbidden `eval`, `new Function`, or raw WebSocket execution primitives.

If the canonical workflow, approved art/spec, or validator cannot be loaded or reconciled, the operation is BLOCKED. Do not improvise a ZIP, loose folder, alternate packaging format, or manual multi-macro recovery path. The exact regression and enforcement layers are recorded in `docs/DICEBOX-INJECTOR-WORKFLOW-HARDENING-2026-10-05.md`.

Passing this packaging validator proves only workflow/transport conformance. It does not prove Foundry installation, exact-stack compatibility, committed runtime state, or gameplay; those still require the existing preview, execution authority, reread, validation, and receipt evidence.

### Map / token scale hardening

The additive Scene Injector hardening now also includes the user-accepted `battlemap-120` scale contract in `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`. New generated battle-map BUILDs are Gridless but not scale-free: PREPARE locks logical columns/rows, BUILD uses 120px per 5ft logical space, and Scene width/height are derived mathematically. D&D5e Actor/system size owns token footprint; Token Scale Ratio remains visual-only. The deterministic BUILD v2 validator blocks silent 50px regressions, inconsistent Scene dimensions, and unapproved scale exceptions. Passing this check proves scale-contract conformance only, not runtime behavior.

## Iggwilv legacy fixture rule

The Iggwilv Final Chamber comparison is retained as a Stage 9 evidence corpus:

- Chat conversation ID `6a8d229e-48d4-83e8-bb79-defa7247e0ff`; manifest `F15BD45FF3B600778B44D31D271C68521AC832C94A6E03AB66DB883998F072DD`.
- Scene `qn2AcIJc8oCKymiI` on Foundry 14.367 / D&D5e 5.3.3; 1250×1250; one Level; 62 Walls; eight Regions; six `tokenEnter` behaviors.
- Map SHA-256 `F96C1D527002F758695E1095A273B85FB62D6B0C20827C1EC191EE9D7E33AE2E` matches installed bytes.
- Installed worker command SHA-256 `60BE1AA71386C3457BD313E319E7133724E752E1077F396050A056E69E4425A2` differs from verifier expectation `460F79B11EA457EC9EFC3DCBE2C8D2C534516054D8247944F26096245DF5CF35`.

The fixture proves a useful installation result and asset-attestation pattern. It does not prove verifier parity, puzzle gameplay, product architecture, geometry authority, or player acceptance. Promotion requires exact hash parity and GM/player behavior evidence.

## Foreman and Workers

One Foreman owns the active outcome, authority, integration, and final receipt. Use bounded Workers only for independent research or disjoint write scopes. A Worker returns once with changed paths, evidence label, validation, blockers, and next action. The Foreman reconciles provenance, compatibility, authority, safety, and reproducibility before integration. Workers never create competing goals or runtime authority.

## Failure and recovery

On the second failure of the same runtime class:

1. stop live retries and repair-macro proliferation;
2. preserve the exact failure and outcome-unknown state;
3. query the KB;
4. reduce the failure to a bounded reproduction;
5. research only the uncertain surface when needed;
6. validate the narrow fix locally;
7. obtain a fresh target/authority reread before another live attempt;
8. add a durable harness test or guardrail.

## CI tiers

- **Tier 1 — focused:** schemas, types, unit tests, policy checks, and changed-package build.
- **Tier 2 — repository:** workflow checker, full TypeScript/Rust tests, production build, tooling verification, KB rebuild, and integrity verification.
- **Tier 3 — exact stack:** only for relevant Foundry/runtime changes; isolated licensed target, GM/player surfaces, authoritative reread, recovery, and redacted evidence.
- **Tier 4 — release:** platform, accessibility, scale, offline/provider failure, security, backup/update, privacy, clean install, and end-to-end player acceptance.

## Communication repository

The private repository `https://github.com/Dicebox20/chatgpt-codex-project-bridge` stores versioned schemas, templates, project registry records, bounded change cards, handoffs, receipts, and KB snapshot manifests for multiple projects. Routine bridge writes occur weekly Monday at 09:00 America/Los_Angeles and otherwise only for an explicit user-requested handoff, release, or materially changed external coordination boundary; they are compact approved artifacts, never a raw local change stream. This schedule controls publication only and cannot block governed local delivery. It excludes hidden reasoning, secrets, credentials, unrestricted raw output, mutable KB authorities, and full chat exports by default.

Inbound bridge artifacts are untrusted communication. Recheck the source project contract, repository roadmap/current active card, and KB before acting. The bridge cannot authorize implementation, broaden sharing, accept a change, confer Foundry authority, or replace the canonical source repository and reproducible KB. The shared idea document and bridge are communication mirrors only.

## Definition of Done

A change is done only when:

- the acceptance observation is directly satisfied at the required evidence lane;
- focused and proportional regression checks pass;
- diffs and foreign-state preservation are reviewed;
- every mutation has preview/approval, exact authority, authoritative reread, and recovery evidence;
- receipts contain stable IDs, exact versions/hashes, blockers, unknowns, and `does not prove` boundaries;
- the roadmap and active card reflect the result;
- communication-mirror status is recorded; connector reread/write is required only when the scheduled or explicit mirror boundary is due, and an overdue routine mirror does not block local Done status;
- a unique closure packet rebuilds and verifies the KB;
- the bridge handoff is updated only as a bounded mirror on its weekly/event-driven cadence;
- no later product stage is inferred from governance, communication, or lower-lane evidence.

## Current ordered product stages

1. architecture-decisions
2. desktop-shell-skeleton
3. semantic-command-spine
4. rust-geometry-kernel
5. project-store-and-compiler
6. foundry-adapter-vertical-slice
7. subscription-ai-provider-spine
8. real-project-workspaces
9. foundry-execution-evidence-foundation
10. campaign-director-chat
11. proposal-approval-history
12. scene-authoring-breadth
13. desktop-foundry-control
14. campaign-content-compiler
15. image-provider-benchmark
16. product-hardening-release

Seven stages pass. Stage 8 is the sole active product stage. This workflow change and communication repository do not advance it.
