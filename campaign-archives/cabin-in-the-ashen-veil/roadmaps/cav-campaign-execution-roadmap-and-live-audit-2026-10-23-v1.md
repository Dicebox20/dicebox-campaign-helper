# Cabin in the Ashen Veil — Read-Only Audit & Bounded Execution Roadmap v1

**Audit date:** 2026-10-23 America/Los_Angeles (native Foundry snapshot 2026-10-24T06:32:50Z)  
**Campaign scope:** `cabin-in-the-ashen-veil` ONLY. This is a side campaign in Dicebox Campaign Helper; it does not modify the main Mysterious Lodge/Central Lodge or product development stages.  
**Status:** `AUDIT_RECORDED / ROADMAP_PROPOSED_FOR_EXECUTION`. No Foundry changes in this audit. No owner visual/art approval is inferred by a tool check.  
**Branch:** `codex/cabin-ashen-veil-recovery` in `Dicebox20/dicebox-campaign-helper`.

## 1. Baseline with separate evidence classes

### Production coverage
- Current grouped **base-art target** census: **45**; **19 owner-approved**; **26 base arts remain**. The 2026-10-22 JSON PREPARE register's embedded `18_OF_45` / 27 remaining statement is *historical by one image* because it predates the owner-approved, live-installed aged Great Room. The prior v2 register also holds stale per-card `FOUNDRY_NOT_INSTALLED` or Great Room `REDO` statuses. Use this dated audit and native readback for **current status**, not those stale card strings.
- The **separately accepted Grove↔Bathhouse trail-fork map** is outside the grouped 45 targets. Hence **20** live Foundry Scenes = **19** approved targeted backgrounds + **1** extra trail-fork background. `20/45` is **incorrect**; 45 tracks base targets only.
- All **9/9 Sune Grove**, the **single combined Forest Maze**, the **unified Bathhouse**, the **unified Aqueduct**, estate **EXT-01/02/05/06/07**, and **H-G02 Foyer** + **H-G06 Great Room** are installed with backgrounds. EXT-02 has the Full Pond image as active background and its Drained Pond alternate staged as a separate art file, not a runtime auto-transition.
- Owner-approved **aged H-G06 Great Room** is now the locked reference for future **above-ground cabin rooms only**; **H-B01/02/03 basement rooms are exempt**. Use [visual reference authority](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md), exact installed source art and owner inspection. Preserve per-room topology; do not copy its furniture into other rooms. Owner earlier raised re-aging H-G02; existing Foyer is a valid installed artwork but **revisit its visual consistency** before declaring a final room-art package. A Foyer replacement is *not* counted among the 26 never-rendered targets.
- Owner handling of **visual INSPECT and manual Wall/door placement** is binding. Do not auto-place or rewrite Walls, doors, or owner Regions. Existing scene dimensions remain provisional until owner inspects/tacit structural signoff.

### Exact native Foundry snapshot (read-only)
Inspected exact local origin `http://127.0.0.1:30000/game`, exact world `cabin-in-the-ashen-veil`, elected active **Gamemaster 2**, Foundry **14.367**, dnd5e **5.3.3**.

| Native class / coverage | Actual Foundry state |
|---|---|
| SceneDocuments | **20**, each with one Ground Level and an approved map background |
| H-G06 Great Room | **25 Walls**, **4 door Walls**, **7 Regions**, **1 Execute Script RegionBehavior**, **1 AmbientLight**, **1 placed Token**. Fireplace `G0HM92QQtEfyZcFi` has script `CAV06FIRECLICK01` targeting AmbientLight `fuWonmPqjJX2SIVG`, light currently `hidden=true`. Grandfather Clock owner Region preserved. |
| EXT-01 Carriage Yard | **7 Walls**, **1 door Wall**, **8 Regions**, **0 RegionBehaviors** |
| Other 18 installed Scenes | **0 Walls**, **0 Regions**, **0 RegionBehaviors** per Scene (right now; owner can modify these between audits) |
| Game content | **1 Actor**, **1 placed Token**, **0 world Items**, **0 Journals**, **0 Macros**. No active non-GM player connections at snapshot. Embedded Actor items and packs were not audited by this count. |
| Runtime scope | No native evidence of any implemented cross-Scene teleport pair, complete puzzle state machine, stage switch, reward claim, or end-to-end player gameplay proof. Do **not** equate approved art, unexecuted design documents or intentionally inert Regions with functionality. |

**Change sensitivity:** Previous archived build receipts had H-G06 12 Walls / 6 Regions and/or zero Actors. This live 25-Wall, 7-Region and 1-Actor snapshot is newer. Owner can independently make further manual edits; take a new read-only baseline before any future authorized mutation.

### Exact 26 remaining base-art targets (not stage overlays)
| Area | Count | Names |
|---|---:|---|
| Cabin ground | **5** | `H-G01` Dining, `H-G03` Kitchen, `H-G04` Pantry, `H-G05` Allen's Study, `H-G09` Rear Family |
| Cabin upper | **7** | `H-U01` Nursery, `H-U02` Landing, `H-U03` Guest, `H-U04` Parents, `H-U05` Sophia, `H-U07` Studio, `H-U08` Candle Workshop |
| Cabin attic | **4** | `H-A01` Central Attic, `H-A02` West, `H-A03` North, `H-A04` East Storage |
| Cabin roof | **1** | `H-R01` Roof / Chimney Clock |
| Cabin basement | **3** | `H-B01` Workshop, `H-B02` Keystone Vault, `H-B03` Supply Closet — **distinct visual rules, no aged-Great-Room styling lock** |
| Estate | **3** | `EXT-03` Donovan's Shack, `EXT-04` Privy, `EXT-08` Rear Deck and Family Grounds |
| Undercroft | **3** | `UND-01` Approach, `UND-02` Donovan/Sophia Refuge, `UND-03` Voss Ritual Chamber (**design this one last** per owner direction) |
| **Total** | **26** | |
All above-ground cabin rooms are individually rendered and housed in individual Foundry Scenes. Preserve nine independent SG Scenes, single FM Scene, single AQ Scene, single BATH Scene; EXT-02 Pond and EXT-07 Boathouse are **separate** owner-approved Scenes.

### Functional work remaining beyond the 26 raster backgrounds
1. Owner structural Wall/door pass for 18 currently empty geometry Scenes, plus verify existing H-G06 and EXT-01 collision/door alignment. Scale and portal coordinates are **not** automatically certified by source art.
2. Construct paired, destination-safe transitions (including distinct Foyer↔Basement Workshop Weathered-Key door, Great Room↔Studio upper stair route via landing, Great Room↔Study Brass Study Key, Study north exit↔Rear Deck, Pond↔Boathouse far shore, Grove 9-square loop, Bathhouse↔Aqueduct, multiple Undercroft thresholds). The **SG-06 eastern fourth exit** remains a specific pairing audit item.
3. **Stage-state assets** not counted as base maps: Pond full/drained, Bathhouse full/drained and revealed Reliquary, Grove statue's rear mosaic reveal, movable clock components, doors, keys, loot, Veil visual state, secret compartments, and other staged overlays/Tiles/lighting.
4. Create and verify **Foundry Items, Journals, Actors and clue delivery** from established Dicebox workflows. Distinguish puzzle design (documented for most of the game) from live document creation (almost entirely absent at snapshot).
5. Translate **canonical puzzle/state rules into native Foundry RegionBehavior scripts and server-authoritative state**, with reversible actions, separate once-only claims, proper inventory gates and guarded user actions. Owner explicitly requires **no player-run Macro documents** for these Region interactions; keep GM-only build tooling distinct from gameplay scripts.
6. Add haunt/NPC encounters and chase/capture reset/fallback logic. Preserve **Sune Corner bust order SG-07 Rose → SG-03 Star → SG-01 Moon → SG-09 Sun**, visible SG-05 pedestal mosaic discovery, **late Crooked Man SG-01 NW-bust anchor** (not obsolete SG-05), Rosewater Reliquary Bowl separate from Vault Keystone, and in-place Sophia `H-U05` bookshelf compartment (no H-U06 scene).
7. Run **non-GM** canary, puzzle gating, cross-Scene travel, stage swaps and softlock/rescue simulations. Produce Foundry VERIFY/RECEIPT per stage; item permission rules, player-facing dialogs, shared state persistence and resets cannot be proven by just inspecting GM source.

## 2. Roadmap (use order of gates, not calendar estimates)

### PHASE 0 — Protect, reconcile, and run one tiny game-mechanic canary (NEXT)
**Assistant:** Keep this inventory as a dated baseline, reconcile the stale register with newer receipts, and review H-G06 art/geometry notes without changing manual Walls. Reinspect live documents before any next modification.  
**Owner:** When a non-GM player client and character are available, test the **Fireplace click/Tinderbox** Region: hidden Region outline, description, no Tinderbox rejection, Tinderbox activation, light on, extinguish, late click/refresh/rejoin. Existing Actor/Token is not evidence of this playtest.  
**Gate:** A player-facing and elected-GM document receipt demonstrating item check and exact Light toggle. If broken, fix *that one behavior* before expanding the pattern. No new Macro document.

### PHASE 1 — Produce missing individual cabin room art, in small bounded render batches
**Assistant:** Per room, use the established PREPARE and room/portal/canon source, versioned image RENDER and owner INSPECT. Respect current **aged H-G06** above-ground look, neutral baked lighting and unique room topology. Preserve original images/hashes; owner explicitly approves the exact new PNG. Build accepted backgrounds individually or in a separately authorized verified batch; never touch manual existing Scene geometry.  
**Suggested queue:** Finish original batch's **`H-U07` Art Studio → `H-G05` Study**; then the remaining ground rooms and **`H-U02` Upper Landing** (to establish correct stair circulation), remaining bedrooms and secret Candle Workshop; attic storage and roof. **H-G02 Foyer** receives an age/style review and optional owner-directed replacement, not an automatic deletion. Schedule basement **H-B01/03/02** as a separately styled interior set, not under aged-Great-Room prompt rules.  
**Gate:** Per-map owner visual PASS + exact art hash + consistent exits/scale record; update base-map census only on actual acceptance.

### PHASE 2 — Complete estate and Undercroft map art with proper story-stage exclusions
**Assistant:** Render **EXT-03 Shack**, **EXT-04 Privy**, **EXT-08 Rear Deck**; draw **UND-01 Approach**, **UND-02 Refuge** when entry/reward/sightline canon ready. **UND-03 Ritual Chamber last**, after final encounter direction is owner approved. Precompute/prepare derived stage backgrounds and overlays independently of base-map count.  
**Gate:** All 45 scoped base-map target arts owner PASSED; staged variants/assets separately inventoried. No invented extra unified maps or merged house rooms.

### PHASE 3 — Owner Walls/doors and mechanically safe travel
**Owner:** Wall and door geometry in each installed Scene, preserving current manual work.  
**Assistant:** Read-only compare Scene geom/door placements against source portals and owner's inspection, propose corrections rather than applying them. After approval, make bounded native level/transition and lock Region behavior installations, never changing owner Walls. Prioritize **front Yard → Foyer → Great Room → Study/Studio** and safe return; next Grove 9-square loop; Pond↔Boathouse; Aqueduct↔Bathhouse; basement/attic; Undercroft.  
**Gate:** Each link bidirectionally traversable by a real player token with reachable arrival/return, no door bypass, no trapped token. Lock decisions preserve exact Key semantics. Mark links as PLAYTESTED only after interaction.

### PHASE 4 — Build Items, Journals, puzzle states and scripted interactions
**Assistant:** Create a canonical Item/Journal/Actor unique-ID ledger first (avoid duplicate keys or state flags). Use existing native RegionBehavior/Item/Journal workflows and GM authority, not a new module or player-run macro for each puzzle. Implement in dependency slices, with a VERIFY and receipt for each:
- **Early:** Clock/keys/Art Studio vanity and `027` lockbox; Grove four corner busts → SG-05 mosaic → 1,000 gp/Brass Study Key; Parents coat/room/bear, Shack `587` → sluice crank.
- **Waterworks:** Pond full/drained and Bathhouse drain; screwdriver, Rosewater three-ring puzzle and **Scrying Bowl** below bath (Boiler safe egress); Aqueduct assembly/first chase; pressure/boiler heating and gated healing; Waterworks clue/late Crooked Man chase on SG-01.
- **Veil and finale dependency:** Rufus eyes, source charging flips Crimson Veil; books chronologically placed (sixth only in Veil), Sophia shelf compartment Gond half; Prayer paths and Sune half; four-requirement Vault grants **Keystone**; Sune Bowl+`027` pellet opens **outer** Undercroft; Keystone opens **inner** door; only then final encounter.
**Gate:** Shared persistent state, correct inventory and prerequisites, separate once-only pickup flags, player-visible dialog and cues, GM-safe recovery, no hidden spoilers/softlocks. The detailed canonical puzzle spec governs actual solutions, not this summary.

### PHASE 5 — End-to-end rehearsal, archival receipts and freeze
**Assistant + owner:** Make non-GM playtest passes for an early route, Grove, water-state puzzle, Crimson Veil state shift, and Undercroft return path. Test multiple players, disconnect/rejoin, GM restart, already-claimed items, stage-change interlocks, erroneous item order, rescue/recovery, no manual Macro permission issue.  
**Gate:** Each previously designed step is labeled **DOCUMENTED / OWNER-APPROVED / IMPLEMENTED / VERIFIED / PLAYER-PLAYTESTED** based on evidence. Identify outstanding final chamber combat design as a separate owner-directed closeout task. Catalogue versioned receipts and decisions without rewriting historical snapshots or modifying global Dicebox product stage.

## 3. Operating rules for the assistant on every future action
1. Read the **latest owner directive** plus this roadmap and the exact Scene-specific PREPARE/continuity record. Earlier `53`, `48`, `18/45`, separate `FM-01..04`, SG-05 four-bust coordinates and `H-U06` maps may be superseded and are not automatically binding.
2. Keep read-only PREPARE/audit and live Foundry mutation separate; require explicit owner authorization for each intentional write. Always preflight exact world/Scene/document IDs, active GM, image hash, desired diff, and owner manual documents.
3. Per render: PREPARE → (structural evidence for COMPLEX maps) → RENDER → **owner INSPECT PASS** → BUILD → STAGE → authorized INJECT → VERIFY → RECEIPT. Native test harness may accelerate narrow checks, but does not replace author approval or gameplay canaries.
4. Preserve player-visible interaction scripts inside **Region Execute Script behaviors** wherever native behavior is an approved solution. Never make player permissions for individual macros a requirement. Before generalizing H-G06's handler, complete its **non-GM** canary.
5. For every bounded batch, record: source provenance/hashes, logical map IDs vs grouped backgrounds, exact Foundry Scene/Region/Light/Item IDs, owner decisions, who placed Walls, before/after evidence, untested features, next smallest safe action.
6. One exception does not change other campaigns. Do not silently promote incomplete or provisional live geometry to canonical architecture.

## 4. Recommended immediate small work unit

**First choice:** Perform the **H-G06 Fireplace non-GM canary** now that one Actor/Token exists if an owner-authorized player session is available. No player is currently online. This is a fast, isolated check of the Region-script pattern before dozens more behaviors depend on it.

**Then:** PREPARE and RENDER **H-U07 Dahlia's Art Studio** against the locked 50-year visual reference; get explicit owner art PASS. The next map is **H-G05 Allen's Study**. Record both as distinct rooms and leave Wall/door painting to the owner.

## 5. Evidence sources / conflict precedence
- [Grouped scene-design ledger — older per-card statuses, authoritative ID inventory](../all-scene-preparation-register-v2-2026-10-22.json); apply actual later owner approvals and this live readback.
- [18 background-only live installs](../batch-background-scenes-owner-walls-install-2026-10-23.md), [native per-Scene build index](../builds/background-only-batch-v001/batch-index.json), [H-G06 replacement](../h-g06-great-room-aged-art-live-background-swap-2026-10-23.md).
- [Locked aged Great Room reference](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md), [H-G06 Fireplace live install and limits](../h-g06-fireplace-click-tinderbox-live-install-2026-10-23.md).
- [Map group/room-owner rule](../map-granularity-owner-rule-and-consolidation-audit-2026-10-23.md) with newer FM consolidated / EXT-02 vs EXT-07 exceptions, and [owner art locks](../ashen-veil-map-production-locks-v1-2026-10-22.md).
- [Owner-authorized full puzzle design with later owner overrides](../authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md), [Grove current puzzle rules](../sg-core-puzzles-and-completion-audit-2026-10-23.md) (older Grove visual-completion lines superseded by later 9/9 approval and native installs).
- Foundry native **read-only** exact world audit: `cav-roadmap-native-foundry-20-scenes-readonly-inventory-20261024-v1`, 2026-10-24T06:32:50.967Z, with no write.
