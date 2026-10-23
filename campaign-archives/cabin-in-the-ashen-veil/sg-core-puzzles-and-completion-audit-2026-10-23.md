# Sune's Grove — Core Puzzle Completeness and Remaining Gates

**Date:** 2026-10-23  
**Owner question:** “I agree, approved. Is that all the Sune's Grove puzzles?”
**Scope:** Sune's Grove **SG-01..SG-09**, with **SG-05 Memorial Clearing** at center; excludes the *independent northwest Forest Maze* and its optional **Gazebo Rose/Cog/Star table puzzle**, which is separately prepared.

## Core puzzle design — COMPLETE (not installed)

1. **Four perimeter-corner Winder busts:** Clockwork Winder from attic. Ordered **SG-07 SW Rose → SG-03 NE Star → SG-01 NW Moon → SG-09 SE Sun**. The SG-05 Sune **dedication stone** provides the pre-Study clue. Exact motif/Winder progression 0..4, mistake reset without consuming, repeated actions safe. On four successes set `grove.bustsSolved` permanently.
2. **SG-05 rear sliding mosaic:** Bust completion visibly reveals a **separate 3×3 mosaic Tile** behind Sune's clean, plain statue pedestal and gates a **player-facing Foundry Region** there. A player entering gets a one-time discovery line; manually inspecting the Tile is always possible. Deterministic 3×3 starting layout `4,5,1 / 2,EMPTY,8 / 7,6,3`, solved `1,2,3 / 4,5,6 / 7,8,EMPTY`; legal orthogonal moves only. Success opens **1,000 gp cloth bag and Brass Study Key beneath lining**, each independently claimed once. This is the early Study-access chain.
3. **SG-05 Sune statue offering / Undercroft unlock:** Once Scrying Bowl is recovered from **below-Bathhouse Rosewater Reliquary**, bring it to the standing statue's initially **empty cupped hands** and explicitly insert the filled Great Room `027` Dust of Dryness pellet. Persistent staged dry-water mechanism then exposes **outer UND-01 approach**. It **does not** open the separate ornate inner Keystone door or grant final-encounter access. Preserve a return-safe Region.
4. **Scripted late NW-bust Crooked Man encounter, not a new puzzle:** After Waterworks pressure restored, Allen's warning read and earlier chase complete, entering/examining the **NW bust** starts second chase (3 successes before 2 failures, DC13), rewards a **Silver Tiny Key** once, allowing Hope Chest/Music Box/Prayer of Protection. The NW bust is now physically **SG-01**, not the legacy SG-05 coordinates. **Route/trigger/key-drop migration must be explicitly reconciled before Foundry BUILD**. Early bust puzzle and late chase are distinct triggers. See LOCK-09 current rules plus owner location override.

## Deliberately not additional core Sune's Grove puzzles

- Four garden passages and cross-scene transitions are navigation/Regions, not collectible puzzles.
- The one unborn son's grave and Sune's devotion stone are story/early clue anchors, not extra sequence puzzles.
- **Gazebo** has a separate optional Rose/Cog/Star rotary-table puzzle with Folding Surveyor's Rule in the **independent NW Forest Maze**.
- Rosewater three-ring puzzle is under the Bathhouse; the Scrying Bowl **comes from there**, not from SG-05 or Vault.
- Keystone is recovered from house Vault, used at **Undercroft inner door**, not placed into Grove statue.
- An optional inscription on SG-02 duplicates the shrine clue; doesn't create a fourth main puzzle.

## Completion vs implementation status

| Lane | State |
|---|---|
| Main Grove puzzle **decisions and reward dependencies** | **DESIGN COMPLETE** |
| SG-05 latest dormant garden base art | **OWNER VISUAL APPROVED**, generation `01a34994-167f-43e8-808e-aa5de49e24b5` |
| Scene art for all nine maps | **NOT COMPLETE**: SG-01 NW corner latest image is **REDO**; SG-09 SE had a visual PASS candidate but lacks a clearly recorded explicit archive approval. Remaining 7 Grove map images are owner-approved including SG-05 and SG-02 |
| NW Crooked Man encounter anchor | **CONFLICT TO RESOLVE**: old SG-05 trigger vs owner-relocated actual SG-01 NW bust; migrate/validate later rather than building wrong actor Region |
| SG-06 four-way eastern branch | **ROUTE PAIRING TO RECONCILE**: owner approved the fourth leg, but destination/Region not committed as another Grove map |
| Foundry Tile, Region, shared puzzle state, reward one-time claim | **SPECIFIED, NOT INSTALLED OR TESTED** |
| Measured coordinate/portal pair safety, stage return and gameplay tests | **NOT YET PERFORMED** |

The owner earlier explicitly excluded installation and gameplay testing from the list of *design* decisions needed to start installing; the above later implementation checks should not be misreported as unresolved puzzle-design choices.

## Sources and precedence

[SG-05 v6 base art](./sg-05-memorial-clearing-prepare-v6-clean-pedestal-base-art-2026-10-23.md), [SG-05 v5 Tile/Region](./sg-05-revealed-mosaic-region-prepare-v5-2026-10-23.md), [authoritative puzzle spec LOCK-01/02/09/13](./authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md), [current scene registry](./all-scene-preparation-register-v2-2026-10-22.json). Later owner overrides for distributed corner busts and statue art win over historical lines in older documents.
