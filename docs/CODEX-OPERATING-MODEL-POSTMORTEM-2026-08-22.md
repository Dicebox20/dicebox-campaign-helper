# Codex Operating-Model Postmortem — 2026-08-22

## Purpose and scope

This is a process correction for DiceBox Campaign Helper, not a judgment on the campaign or its contributors. It synthesizes the current reproducible knowledge base, the active Foreman and Worker task histories, and archived DiceBox/Regionwright governance, monitoring, and M0 review tasks. The source index keeps the raw task history available without duplicating large conversational transcripts.

Primary task corpus:

- Foreman: `codex://threads/01a0231c-57b9-76c3-ba81-12dbac16fddc`
- Regionwright implementation: `codex://threads/01a0266a-39aa-7a63-8e40-a1286fc73efc`
- Provenance Worker: `codex://threads/01a02a43-2488-7ca0-80ae-0af1a4aed0c2`
- Geometry Worker: `codex://threads/01a02a42-c9ef-7fb3-8683-64a43fd48943`
- Migration Worker: `codex://threads/01a02a42-39a8-7940-901e-608ff5136930`
- Archived Monitor: `codex://threads/01a027b5-5f8f-7c80-81fc-acf698763076`
- Archived workflow and governance tasks: `codex://threads/01a027c7-f253-7421-adec-efe09b2943e6`, `codex://threads/01a02a69-070a-7f70-b618-634c3427a58a`, and `codex://threads/01a02319-8af9-7721-a72b-94112fe07a04`

The 2026-08-22 KB snapshot contains 219 sources, 255 facts, 211 decisions, 217 trials, and 100 active work items. Those counts demonstrate useful diligence, but also that the ledger became too large to act as a compact execution control plane.

## What went wrong

1. **The active outcome changed faster than the execution plan.** Work alternated among four playable Scenes, map art, coordinate topology, isolated fixture recovery, Ballad behavior wiring, puzzle dialogs, HUD experiments, and manual campaign work. Each change was individually reasonable, but the team did not consistently stop, replace the active acceptance target, and quarantine the old lane.

2. **Too many writers operated on shared state.** The Foreman, workers, and monitor all updated overlapping source, stage, database, or provenance surfaces. This caused duplicate records, DB rebuild/race reconciliation, stale hashes, contradictory runtime observations, and repeated cache/staging work.

3. **Evidence layers were reported together.** Source tests, built files, staged files, fixture receipts, visual observations, and Ballad runtime behavior were often all called “PASS.” A source or fixture pass is useful, but it did not establish that a Ballad behavior could open a puzzle for a player.

4. **Runtime bugs were repaired before a minimal reproduction was stabilized.** Foundry v14 ApplicationV2/DialogV2 and RegionBehavior behavior failures were discovered only after many broader installer, macro, cache, and adapter changes. The missing direct smoke test was: “open one known puzzle in the current client; report visible success or the exact exception.”

5. **The fixture became a second product.** It is appropriate for risky migration and recovery work, but it was used as a prerequisite for broad campaign changes, so launch, licensing, Chrome profile, login, data-root, cache, and control-registration issues consumed the critical path.

6. **The monitor became continuous production work.** Repeated status probes and granular KB entries increased context and token use without reducing the immediate user-facing blocker. Monitoring should have surfaced a material regression or a clean receipt, then stopped.

7. **Map production did not remain outcome-first.** Renderer candidates and detailed geometry contracts evolved before a stable manual Scene-delivery path was agreed. The user ultimately had to create Regions manually, which was a valid and faster delivery lane that should have been selected earlier.

## What worked and should be retained

- Stable DiceBox IDs, source hashes, explicit target-world boundaries, and foreign-state preservation prevented unsafe broad campaign cleanup.
- The source/stage parity checks caught real cache, import-identity, and deployment problems.
- Exact error reports from the live client identified real Foundry v14 compatibility defects.
- Manual Region creation and UUID handoff were a practical division of labor.
- Narrow fixed macros were more controllable than arbitrary console payloads when they had an explicit target, owner, preview, and reread.

## Replacement operating model

### 1. One outcome, one owner, one vertical slice

The Foreman maintains exactly one active deliverable with one visible acceptance statement. Example: “The GM can open Lawson’s puzzle for the selected client and the dialog remains usable.” Work unrelated to that statement is parked in a named backlog, not pursued in parallel.

Each slice has a one-page change card:

- outcome and acceptance observation;
- owner and allowed write scope;
- exact target and authority boundary;
- one deterministic check;
- one live check, if needed;
- stop condition and one recovery path.

No code, staging, macro, or KB expansion begins until the change card is accepted by the Foreman. A user may always replace the active outcome.

### 2. Separate evidence labels

Every receipt must use one of these labels and may not imply a later label:

| Label | Meaning |
| --- | --- |
| research | A source informs a proposed approach. |
| local | Code or an artifact passed deterministic local checks. |
| staged | Exact files were copied to a runtime location. |
| fixture | A disposable target behaved as expected. |
| Ballad | The named Ballad client/world passed a current reread. |
| player-accepted | A player and GM observed the intended play behavior. |

Only `Ballad` proves a campaign mutation. Only `player-accepted` supports a playable claim.

### 3. Two execution lanes, not an always-on pipeline

**Build lane** is local source work: implement the smallest adapter or UI surface, run a focused test, and provide the exact artifact/hash. It does not stage or operate Foundry unless that is the slice’s explicit scope.

**Live lane** is a single approved Foundry action: reread target/authority, preview, approve, execute once, reread, and report. It has one executor and no parallel worker. The user remains the preferred operator until a stable, proven adapter exists.

A disposable fixture is required only when the work changes data schema, performs multi-document recovery, or has a credible path to corrupt/replace campaign state. It is not a blanket gate for UI fixes, visual assets, or a one-dialog smoke test.

### 4. Research and failure rule

On the second failure of the same runtime class, stop creating repair macros and stop retrying the same operation. Instead:

1. capture the exact error and current runtime fingerprint;
2. query the KB for an existing recovery;
3. consult one authoritative technical source and one relevant community implementation only if the KB is incomplete;
4. reduce the issue to a standalone reproduction or smoke test;
5. implement and validate the narrow fix locally before returning to the live lane.

This makes research a recovery tool rather than a repeated preface to unchanged work.

### 5. Worker and monitoring discipline

- Workers receive disjoint files or evidence scopes and return once with a compact receipt. They do not continuously monitor, restage, or update shared governance records.
- The Foreman alone changes the active plan, integrates worker results, and authorizes the next live action.
- Monitoring is event-driven: a material regression, an awaited receipt, or an explicit user request. Status heartbeats do not create KB records.
- The KB stores only decision-changing research, reproducible defects, accepted artifacts, current blockers, and final receipts. Routine “no change” checks are summarized in a single trial at a clean boundary.

### 6. Context and tool budget

- Keep the operating contract concise and link to the KB or plan instead of pasting it across chats.
- Start a new task only at a clean boundary, with a short state packet: active outcome, exact target, last verified evidence label, blocker, and next action.
- Prefer repeatable CLI tests, direct file inspection, and purpose-built adapters for status. Use browser/computer control only when the result is inherently visual or interactive.
- Use browser control once per live step, capture the result, and never poll/reload blindly.
- Use image generation for candidate art only after the Blueprint and visual acceptance criteria are frozen; do not regenerate art to compensate for unmeasured coordinates.
- Use parallel workers only for independent, read-heavy questions or disjoint file scopes. Parallel work must reduce wall-clock time without introducing shared writes.

## Initial backlog reset and pilot

The existing active-item list is a historical ledger, not the next sprint. Keep it intact, but do not treat all 100 active entries as simultaneous work. The next Foreman pass must classify each item as one of: active current slice, parked backlog, superseded history, or closed. No more than three items may be active at once: one build, one live, and one research/recovery item.

The first pilot should be a **Foundry interaction smoke kit**, not another campaign installer:

1. one read-only diagnostic that reports world, Foundry/module version, active user, and required API availability;
2. one GM-only command that opens a single known puzzle dialog for the current GM without mutating Scenes, Regions, or player state;
3. one visual acceptance check by the operator; and
4. only after that passes, one deliberately scoped player/client broadcast experiment.

The pilot succeeds only when the operator sees the dialog behave correctly. Its failure produces one reproducible error report and returns to the research rule.

## Official Codex guidance incorporated

Current OpenAI guidance supports lean instruction/tool context, explicit autonomy and acceptance boundaries, clean task division for multi-agent work, workflows as skills, scored/evaluated iteration, and using direct tools for semantic decisions rather than orchestration overhead. The practical DiceBox application is the model above: less repeated context, fewer concurrent writers, fewer status loops, and a direct user-visible acceptance test for every slice.

## Immediate operating constraints

- No automated Foundry repair, staging, cache work, or Ballad mutation is authorized by this postmortem.
- Do not resume old campaign blockers merely because they remain open in the ledger.
- The next implementation starts only after the user selects one current outcome and accepts its one-page change card.
