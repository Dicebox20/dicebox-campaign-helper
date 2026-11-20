# DiceBox Campaign Helper — Project Continuity Charter

**Status:** PROPOSED / REVIEW REQUIRED (2026-10-12). This charter must not be mistaken for an accepted rule until the current governance/KB/roadmap promotion gate succeeds.  
**Companion reconciliation:** [Canonical Workflow Reconciliation](CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md)

## Mission: One Product

Every work unit, conversation, helper script, campaign testcase, map, Actor, puzzle, infrastructure prototype and research task must improve, validate, document or unblock the **DiceBox Campaign Helper desktop application and accompanying Foundry VTT module**. Do not create a second independent authority, roadmap or knowledge base. The DiceBox Injector and Actor Injector are product subsystems; the Puzzle Matrix is a developing feature; campaign content is test/use-case material.

## Four primary subsystems

### Scene and Map Injector
- Consult accepted KB, current map/scene spec and accepted geometry; PREPARE locks campaign identity, topology, entrances, exits, token clearance, scale, interactive features, discoveries, hazards and user acceptance tests.
- **Candidate pending promotion:** include a top-down monospaced textual layout, legend, and location table as a reviewed PREPARE artifact (approved locally Oct 9, not yet merged on main). The schematic does not replace Spatial Blueprint coordinates.
- Mandatory grayscale structural map, strict 90-degree overhead orthographic camera, geometry and features clearly distinguishable; structural INSPECT produces a reconciled Feature Manifest/Spatial Blueprint.
- Preserve locked structure through painterly color rendering. FINAL_INSPECT compares full semantics, and **only final PASS** approves rendering.
- On REDO archive rejected attempt and author a wholly independent prompt from accepted requirements. Never modify a rejected prompt/image. October 9 geometry tolerance governs actual traversability and authored creature clearance.
- BUILD: one `.md` artifact containing one self-contained JS macro, default `battlemap-120` unless explicitly approved exception, validated by current tool. Stage/install only through authorized exact Foundry runtime, then reread geometry, Region behavior, state and build identity and return a receipt.
- No stage magically advances from a successful image, packaging check or upload response.

### Actor / NPC Injector
- Start with constrained NPC manifest and exact installed Foundry/D&D5e data-model/schema inspection, resolve compendium entries before mutation, create art and verify bytes/paths.
- Review combat balance and actor ownership, safe token footprints, item/Activities/Effects and mechanics. Prefer native D&D5e Activities, core Active Effects and public Foundry APIs; there must be exactly one owner for attacks, saves, damage, consumption, resource usage and effect application.
- Use bounded preview, exact target active-GM authorization where required, narrow idempotent create/update, authoritative reread, and repairs/receipts.
- Treat BTR NPC Engine 1.0's three created Actors as carried September 19 runtime evidence. Engine 2.0 Tharvek and general desktop-integrated Actor workflow are **not certified** without current exact-runtime tests.

### Puzzle Matrix (design and testing)
- **Do not represent the system as complete**. Preserve existing reusable state/interaction primitives and campaign-scoped examples as separate evidence.
- Proposed future matrix should specify stable puzzle ID, components/anchors, clues, preconditions, event types, solution validation, state transitions, persistence, retries/failure/reset, consequences, player/GM visibility, permissions, Region/Actor/Item links, and deterministic test or gameplay evidence.
- Avoid made-up puzzle answers, irreversible consumptions, missing prerequisites, uncontrolled automatic triggers or cross-scene softlocks. Distinguish logical unlock from verified usable transfer, and preserve foreign/runtime-owned state.
- Approve a reusable global Puzzle Matrix contract only after design, schema, code, local tests, module mapping, fresh reload and player-canary reviews; unfinished campaign puzzles stay flagged.

### Desktop Campaign Helper and Foundry module
- Architecture follows accepted Tauri 2 + React/TypeScript + PixiJS 8 + Rust ADR, a renderer-neutral semantic project, deterministic state/transactions and Foundry native adapters.
- All Scene, Actor, Item, Region, Journal, puzzle and asset operations should ultimately be available through safe typed application-owned capabilities; a conversational model produces suggestions or validated proposals, never runtime authority.
- App/provider rules follow accepted ADR-0007; subscription-primary Codex App Server, optional explicit paid API backup and AI-offline mode. Protect credentials and secret boundaries.
- Module/bridge operations require exact world/runtime, elected active GM, preview/approval, owned-only scopes, readback and persisted receipts. Fixture smoke tests do not certify production.
- Treat local Map Lab and other fixtures as bounded development evidence, not a published product release.

## Operating and continuity rules

1. On a new work unit recover repository `main:AGENTS.md`, accepted roadmap/active card, the latest accepted KB decisions and current versioned code/tests; consult campaign-specific start page if appropriate. Never reconstruct the next action solely from chat memory.
2. Follow `understand → consult → reconcile → plan → validate → preview → approve → execute → reread → recover → record`, plus the accepted chronological intake rule.
3. Keep one active outcome and canonical writer. Delegate bounded, disjoint work; require stable IDs, source hashes, scope, checks, evidence classification, blockers, and next action for every handoff.
4. Do not exceed the global accepted 20-minute elapsed work-turn cap. Leave a durable versioned checkpoint, distinguish PASS, PARTIAL, BLOCKED, FAILED and OUTCOME_UNKNOWN; never blindly repeat a write whose outcome is unknown.
5. Canonical authority: accepted GitHub `main` rules and ADRs + reproducible KB → active plan and typed source → exact runtime for current play state → scoped campaign canon → archived evidence → chats and mirrors. A newer path date is not acceptance.
6. Record accepted change in roadmap/active card and KB chronology before implementation according to current project gate; use dated SQL deltas with build/verify and retained source provenance.
7. Preserve old attempts/recipients/archives and all foreign documents. Do not bulk move immutable companion archive or rewrite its hashes.
8. Every response/handoff labels evidence as research, local, staged, fixture, Ballad, or player-accepted and states next review requirements. No deployment or Ready-to-Play claim without its own evidence.
9. **Candidate pending promotion:** for player-triggered Region Macros, verify exact RegionBehavior/Macro binding, player `canUserExecute`, least privilege and fresh-reload executable state; never escalate OWNER merely to make a trigger work, and keep privileged operations GM-authorized.
10. Older Bridge Foreman automatic-next-turn relay rules apply only to a currently verified, explicitly authorized partner session; do not promote historical endpoint IDs into universal workflow or assume background continuation.
11. Scope firewall: a campaign-owned trap, puzzle, map, travel or Scene calibration is not automatically a global product-default rule. Experimental proposals (#7), snapshot migrations (#16), and incomplete Puzzle Matrix plans remain provisional until reviewed and adopted.

## Current known limitations

- This proposal does not assert the real active development stage; full large roadmap/active-slice files must be verified through a capable checkout.
- The historical Actor/NPC Injector's carried runtime evidence has not been repeated against the current installed module; the Puzzle Matrix is unfinished.
- The current Scene Feature Manifest dedicated machine schema/provider integration and exact live Scene certification need independent review.
- Draft PR #16 reports failed tests and is not ready for merging.
- ChatGPT Project Instructions are platform settings, not modified by GitHub commits; any approved charter will still need explicit incorporation there.

## End-state acceptance

After acceptance, a new worker/chat must be able to locate the **latest approved** system-specific workflow and exact active gate from durable GitHub KB records, and produce a bounded safe artifact or blocker receipt without relying on remembered conversations. The app/module must eventually enforce the same requirements with reproducible tests and runtime readback.
