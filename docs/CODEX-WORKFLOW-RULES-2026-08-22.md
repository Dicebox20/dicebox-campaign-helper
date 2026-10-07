# DiceBox Codex Workflow Rules — 2026-08-22

**Status:** current operational workflow

**Purpose:** turn the project contract, M165 postmortem, and official Codex guidance into short, repeatable execution rules.

## Rule precedence and reconciliation

For workflow behavior, a newer accepted rule replaces an older conflicting workflow convention. It does **not** weaken a safety invariant, user instruction, source-precedence rule, exact-target gate, foreign-state preservation rule, or requirement for authoritative reread.

Use this order when workflow rules conflict:

1. current user instruction and applicable system/developer constraints;
2. non-relaxable DiceBox safety and authority invariants;
3. the accepted development workflow version `2026-08-26.3`, the 2026-10-07 project-data/semantic-render reconciliations, KB decisions `D-252`, `D-263`, `D-2026-10-07-RULE-CONFLICT-PRECEDENCE-V2`, and this consolidated rule set (`D-208` remains historical provenance);
4. current project plans and scoped task instructions;
5. older workflow documents, archived handoffs, and examples.

Record a reconciliation when an older procedure is superseded. Preserve the historical record; do not rewrite it to appear current.

## Core rules

1. **One outcome.** The Foreman owns one user-visible outcome at a time. Park other work explicitly.
2. **One compact change card.** Before implementation, state: outcome, acceptance observation, owner, exact target/authority, allowed scope, deterministic check, live check if needed, and one stop/recovery path.
3. **One live executor.** Only the Foreman-approved executor operates a live Foundry lane. Workers do not simultaneously inspect, reload, stage, or mutate the same runtime.
4. **Use the lightest valid lane.** Use local code and focused tests for source changes; use a fixture only for schema/data recovery or credible destructive risk; use a Ballad client only for the final scoped campaign proof.
5. **Label evidence honestly.** Every receipt is exactly one of: `research`, `local`, `staged`, `fixture`, `Ballad`, or `player-accepted`. It never implies a later label.
6. **Research after recurrence or a sustained blocker, not before every action.** On the second failure of the same runtime class—or when a named blocker has materially stalled the selected outcome—stop retries and repair-macro proliferation. Capture the exact failure or blocker history, query the KB, then conduct focused technical and community research before selecting the next fix. Reduce it to a minimal reproduction and validate the narrow fix locally. Research remains evidence, not live authority.
7. **Use direct acceptance tests.** For a UI/puzzle problem, first prove the smallest visible behavior (for example, a GM can open one puzzle dialog). Do not build installers, relays, or full campaign packages before that smoke test passes.
8. **Keep workers disjoint.** Delegate only independent research or non-overlapping file scopes. Each Worker returns once with changed paths, evidence label, validation, blockers, and next action. The Foreman integrates it.
9. **Use isolation deliberately.** The Foreman may choose a separate Codex worktree or project-local disposable workspace for bounded Worker work, a risky build, or verification when it reduces edit, build-artifact, runtime-state, or evidence conflicts. It is optional, begins from an identified source state, preserves user and foreign files, excludes shared live-runtime control unless separately authorized, and returns one compact receipt for clean-boundary Foreman review. It cannot create a second authority plane, bypass synchronization, grant Foundry authority, auto-promote results, conceal or overwrite conflicts, or create a competing goal.
10. **Make monitoring event-driven.** Monitor only for an awaited result, material regression, or explicit user request. Do not emit a KB record for a routine unchanged check.
11. **Keep context linked, not copied.** State each instruction once, link to the current KB record/plan, and use a short clean-boundary handoff: outcome, target, last evidence label, blocker, next action.
12. **Use tools by comparative advantage.** Prefer CLI and deterministic tests for repeatable source checks; browser/computer control for visual or interactive acceptance only; fixed package-owned macros for allowed GM operations. For new Scene Creation, image generation begins only after PREPARE locks topology/scale/visual criteria; when the Blueprint is incomplete, the grayscale structural pass may propose visible semantics, but mandatory structural inspection must reconcile them into the Feature Manifest/Spatial Blueprint before painterly rendering or Foundry planning.
13. **Use a native-size client for coordinate acceptance.** When Foundry reports that usable window dimensions are below its minimum, maximize the actual browser window and clear any temporary viewport emulation before visual, collision, drag, or coordinate evidence. Reread the native `window.innerWidth` and `window.innerHeight`; an undersized-window observation is not coordinate-validation evidence.
14. **Stop at the acceptance boundary.** Do not broaden from a completed slice into nearby fixes. Record the result and wait for the next selected outcome.

## Accepted-change synchronization gate

Every accepted project change is recorded immediately in the canonical repository roadmap/current active card and reproducible KB chronology. Compatible accepted changes may form one explicit implementation bundle; that bundle follows:

`accepted change → repository roadmap/active card → KB reconciliation/rebuild/verification → implementation → authoritative reread/receipt → scheduled communication mirror`

The exact shared ChatGPT-side document is [Dice Box Campaign Helper — Ideas & Architecture](https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit), document ID `14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o`, Tab 1. It is a scheduled communication mirror, not the immediate acceptance authority. Routine writes are at most one acceptance or closure/handoff update per work session and no more than one routine update in 24 hours; combine compatible updates where possible. The schedule cannot block repository planning, cataloguing, KB reconciliation, implementation, validation, reread, recovery, or closure. Explicit user sync, a material coordination blocker, or a release/handoff boundary may override timing. Read-only inspection, bounded research, and emergency containment are allowed before the gate but cannot silently become implementation. The database-first rule still requires a current KB query before planning, and post-implementation authoritative reread, recovery, and provenance recording remain required.

## Machine-enforced active slice

For implementation work, the prose change card must also have one small machine-readable active-slice card. Run `npm run workflow:check` before selecting work and again after changing the active stage. A passing result proves workflow order only; it never proves product behavior.

The checker enforces these execution constraints:

- one ordered acceptance stage is `in_progress`; all earlier stages have direct evidence and all later stages remain pending;
- each build, live, or research lane contains at most one item and may reference only the current stage;
- a passed stage has the exact required evidence label, a direct observation, and at least one reviewable artifact;
- the second same-class failure stops further live retries until a bounded reproduction and locally validated fix are recorded;
- output contains one score, one current stage, and one next action. It does not produce a status-only KB record.
- the active card's change-synchronization metadata must preserve the repository-first ordered gate and the exact shared-document identity as a non-authoritative communication mirror.
- the active card's `sharedFileSynchronizationSchedule` must preserve the batch cadence, explicit exceptions, local-control-plane priority, and private-bridge non-authority boundary.

The active program card is [ACTIVE-PROGRAM-SLICE.json](ACTIVE-PROGRAM-SLICE.json). It preserves seven passed stages, keeps `real-project-workspaces` as the sole active product stage, and places `foundry-execution-evidence-foundation` at Stage 9 before conversation, approval generalization, authoring breadth, desktop Foundry control, campaign compilation, image-provider promotion, and release. The former standalone `utility-harness` stage is removed; its diagnostic work belongs in Stage 9 and release hardening. The former Tram card remains preserved as parked campaign evidence in [ACTIVE-TRAM-SLICE.json](ACTIVE-TRAM-SLICE.json); it is not an active execution queue and cannot resume without explicit reprioritization.

## Governing development workflow and communication bridge

[CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md](CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md), version `2026-08-26.3` as reconciled by the 2026-10-07 project-data and Scene semantic-render rules, is the current development workflow. It defines the six authority planes, Definition of Ready, delivery loop, evidence lanes, Definition of Done, Foreman/Worker ownership, failure recovery, CI tiers, and the exact ordered product stages.

Stage 9 must enforce asset upload/fetch/hash attestation before dependent Foundry document creation; derive installer and verifier expectations from one canonical specification; persist exact package, installer, worker, adapter, and runtime hashes; block promotion on any installed-versus-expected drift; and require GM/player behavior evidence for behavior claims. Typed IR, dependency ordering, stable bindings, RuntimeProfile/profile-diff gates, timeout-as-unknown recovery, foreign-state preservation, and authoritative reread remain mandatory. Monolithic one-click macros are legacy fixtures or bounded compatibility transports, not product architecture or geometry authority.

The Iggwilv Final Chamber comparison is the first retained legacy fixture for this rule. Its map bytes and Scene shape are corroborated on Foundry 14.367 / D&D5e 5.3.3, but installed worker SHA-256 `60BE1AA71386C3457BD313E319E7133724E752E1077F396050A056E69E4425A2` differs from verifier expectation `460F79B11EA457EC9EFC3DCBE2C8D2C534516054D8247944F26096245DF5CF35`. It is installation evidence with a promotion blocker, not a verifier pass or gameplay certification.

The private `https://github.com/Dicebox20/chatgpt-codex-project-bridge` repository is a reusable communication/evidence mirror. It may hold versioned schemas, templates, project registries, bounded change cards, handoffs, receipts, and point-in-time KB manifests. Routine updates are weekly Monday at 09:00 America/Los_Angeles and otherwise only for an explicit user-requested handoff, release, or materially changed external coordination boundary; they are compact approved artifacts, never a raw local change stream. It never accepts a project change, replaces the roadmap or reproducible KB, grants implementation/Foundry authority, broadens sharing, or auto-applies inbound artifacts. Never publish hidden reasoning, credentials, secrets, unrestricted raw output, mutable KB authorities, or complete chat exports by default. A receiving agent must reread and reconcile the source project before acting.

## Operating presets

| Work type | Default path | Done means |
| --- | --- | --- |
| Research/design | KB query → authoritative research → bounded recommendation | A decision-ready artifact, not code or runtime work. |
| Local code defect | Reproduction → narrow patch → focused test → diff review | Local behavior is reproducible and tested. |
| Live UI/puzzle defect | Read-only fingerprint → one minimal smoke test → approval → one execution → reread | The operator sees the intended behavior or one exact failure is captured. |
| Campaign data change | Read current target → preview exact owned delta → approve → execute once → authoritative reread | The named Ballad documents changed exactly as approved and foreign state is preserved. |

## KB and backlog hygiene

- Add a KB record only for a decision-changing source, reproducible defect, accepted artifact, active blocker, or final receipt.
- Batch routine status checks into one clean-boundary trial or omit them.
- Treat the pre-M166 active ledger as a historical backlog. Triage an item only when it becomes the selected outcome: current slice, parked backlog, superseded history, or closed.
- Keep no more than one build, one live, and one research/recovery item active.

## Reusable workflow threshold

When a bounded workflow succeeds three times with the same inputs, output, and validation shape, convert it into a small documented CLI or Codex skill candidate. Until then, keep it as a change card rather than adding another global rule or automation.

## Minimum receipt

Every completed slice reports only:

- outcome and evidence label;
- exact target and authority, if live;
- changed paths or named runtime documents;
- focused validation and direct acceptance observation;
- blocker/unknown and one next action.

The detailed rationale is in [CODEX-OPERATING-MODEL-POSTMORTEM-2026-08-22.md](CODEX-OPERATING-MODEL-POSTMORTEM-2026-08-22.md). This revision implements the newer operational guidance without changing the project’s safety boundaries.
