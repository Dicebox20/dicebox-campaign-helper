# DiceBox Campaign Helper Project Charter

## Purpose

DiceBox Campaign Helper is the central program for turning campaign intent and authored content into reliable, reviewable, playable Foundry VTT projects. It combines a semantic campaign compiler, a local knowledge/state layer, a safe runtime bridge, an asset/spatial pipeline, and an associated Foundry module.

The program is not a chat macro generator. Its job is to understand intent, choose the narrowest verified implementation, preserve human/runtime state, and provide receipts when it changes a world.

The adopted desktop architecture and program-first sequence are defined in [CAMPAIGN-HELPER-ARCHITECTURE-DECISION-REPORT-2026-08-23.md](docs/CAMPAIGN-HELPER-ARCHITECTURE-DECISION-REPORT-2026-08-23.md) and [DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md](docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md). Real campaign Scenes are authored by the application; campaign content generated directly by Codex remains fixture/test material until imported through the same semantic and compilation boundaries.

The project-wide mission and Foreman/Worker operating covenant are defined in [PROJECT-MISSION-AND-ORCHESTRATION.md](docs/PROJECT-MISSION-AND-ORCHESTRATION.md). That covenant applies to primary work and isolated contribution projects alike.

## Data continuity mission

DiceBox Campaign Helper must remain resumable from durable project records without depending on a particular chat, workstation, model memory, or developer recollection. The canonical data taxonomy, chronology rules, authority resolution, and promotion model are defined in [PROJECT-DATA-ARCHITECTURE-2026-10-07.md](docs/PROJECT-DATA-ARCHITECTURE-2026-10-07.md). New consequential data follows the hard intake and implementation sequence in [NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md](docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md).

## Product surfaces

1. **DiceBox core** — semantic IDs, schemas, knowledge/state queries, compiler planning, safety kernel, evidence, transactions, and release bundles.
2. **DiceBox Foundry module** — lifecycle bootstrap, runtime capability discovery, semantic bridge API, document adapters, authority routing, and in-world UI/diagnostics.
3. **Content compiler** — Items/Activities/Effects, Actors, Scenes/Levels, Regions, links, media, and campaign packs.
4. **Certification harness** — exact-stack fixtures, GM/player tests, failure injection, recovery, and Ready-to-Play certificates.

## First supported scenario

The first vertical slice should be intentionally small and Foundry-API-bound:

`read semantic plan → inspect exact runtime → preview one native operation → GM approval → call the versioned Foundry JournalEntry API → read back through Foundry binding APIs → query it → reset/repair it → record receipt`.

All Foundry-facing plan rows must identify the official API and exact-version evidence in [FOUNDRY-API-BINDING-MATRIX-2026-08-21.md](docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md). DiceBox abstractions do not replace Foundry API calls.

The preferred first mechanic is a native, no-code Region path using the exact `RegionDocument`/Region behavior APIs, or a D&D5e Activity path using the registered Activity classes and `dnd5e.preUseActivity`/`dnd5e.postUseActivity` hooks; it is followed by one player-triggered action that routes through the active GM. Broad campaign generation, AI image generation, arbitrary automation, and full live sync wait for the spine.

## Out of scope for the first slice

- Arbitrary JavaScript or macro generation.
- Raw database or LevelDB editing.
- Automatic cleanup of omitted or foreign content.
- Unverified teleport, cross-scene mutation, or optional-module behavior.
- Campaign-specific Iggwilv Tower or Prime Arachnid logic as global product rules.
- Treating static tests or successful imports as live certification.

## Success definition

DiceBox is ready to expand beyond the first slice when it can load in a clean Foundry 14.367 / D&D5e 5.3.3 world, expose only the semantic API, discover capabilities, preview without writes, execute one authorized operation idempotently, preserve unrelated state, read back the result, reset/repair owned state, and produce an evidence receipt in both GM and player-role tests.

## Authorized campaign target binding

The active campaign compatibility and live-validation target is the Foundry world `the-ballad-of-chauser-bill`, with Foundry 14.367 and D&D5e 5.3.3. This binding covers the reviewed Ascendancy campaign package, its four map renderer assets, and DiceBox-owned Scene background and boundary-Wall repair evidence.

The disposable exact-fixture lane remains `dbx-test-world` and must not be redirected by this campaign binding. Foundry world IDs are runtime bindings; stable DiceBox IDs remain canonical. Any live mutation requires the exact runtime fingerprint, elected active-GM recheck, preview/approval gate, owned-only scope, authoritative reread, and a persisted receipt. This target binding does not itself constitute Ready-to-Play evidence.
