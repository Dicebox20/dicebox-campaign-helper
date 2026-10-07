# Historical Foundry VTT Evidence Catalog â€” 2026-10-07

**Status:** imported historical evidence; does not supersede current exact-runtime authority

This pass accumulates Foundry evidence from older Codex workspaces into the reproducible DiceBox Campaign Helper KB. Historical scripts are evidence of what was tried or observed, not permission to reuse obsolete mutation techniques.

## Corpus imported

- SHA-256 fingerprinted **166 selected files** (45,047,439 bytes) across five older Codex project roots.
- Indexed **8** read-only live-world snapshots from 2026-07-17.
- Parsed the final historical snapshot into **56 Scenes**, **61 Macros**, **6 Playlists**, and **8 automation/module signal groups**.
- Fingerprinted **12** Castle Scene-database backup bundles without copying raw databases into the canonical repository.
- Added explicit 2026-07-19 live Foundry verification for 8/8 Monk's Active Tiles damage triggers and the later 8/8 Midi-QOL runmacro lightning configuration.
- Added Castle wall/teleport/RegionBehavior implementation evidence, UUID corpus evidence, and Dungeon Master's Forge tested DND5e patterns.

## Snapshot chronology

| Snapshot | Journals | Scenes | Macros | Playlists | Tables |
|---|---:|---:|---:|---:|---:|
| snapshot-20260717-121321 | 11 | 54 | 57 | 6 | 0 |
| snapshot-20260717-133433 | 11 | 56 | 57 | 6 | 0 |
| snapshot-20260717-134635 | 11 | 56 | 57 | 6 | 0 |
| snapshot-20260717-141546 | 11 | 56 | 57 | 6 | 0 |
| snapshot-20260717-143751 | 11 | 56 | 57 | 6 | 0 |
| snapshot-20260717-145350 | 11 | 56 | 58 | 6 | 0 |
| snapshot-20260717-150626 | 11 | 56 | 59 | 6 | 0 |
| snapshot-20260717-150722 | 11 | 56 | 61 | 6 | 0 |

First-to-final added Scenes: **Index Compound - Basement Aftermath, Index Compound - Simon Maze**. Added Macros: **Set Selected Tiles to Shield Loop Blue, Simon Maze Puzzle Install or Repair, Simon Maze Puzzle Reset, Simon Maze Puzzle Step**. No names were removed in the same comparison.

## High-value lessons

- Real campaign Scenes used Walls, Tokens, Tiles, Lights, Drawings, Notes, and occasional Regions at widely varying densities; per-Scene facts preserve historical counts and dimensions.
- Historical automation signals include Monk's Active Tiles, Tagger, Sequencer, Midi-QOL, DAE, Levels, FXMaster, and Regions.
- Castle work preserves MATT Tile teleports and later RegionBehavior teleportToken wiring.
- Castle padding evidence shows coordinate frames must explicitly account for Scene padding.
- DMF provides tested historical evidence for native DND5e enchant/summon/attack activities, 16-character activity IDs, Item.create folder behavior, and direct TokenDocument lighting after an ATL-based failure.
- The UUID corpus is useful at scale but explicitly distinguishes binary extraction from guaranteed runtime completeness.

## Authority and safety

- Do not reuse 2026-07-14 direct LevelDB mutation scripts as current DiceBox implementation; current rules prohibit raw database/world-file mutation.
- Historical Foundry v14.364 evidence does not certify v14.367 behavior. Current mutation still needs current exact-target authority, versioned public adapters, authoritative reread, and receipts.
- Campaign-specific names/IDs are historical bindings, not global semantics.
- The manifest stores hashes and bundle fingerprints rather than copying whole legacy worlds into GitHub.

## Canonical artifacts

- outputs/foundry-historical-evidence-manifest-2026-10-07.json
- database/seed.d/2026-10-07-zzzz-foundry-historical-evidence.sql
- This catalog
