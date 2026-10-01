# CAMPAIGN KNOWLEDGE TRANSFER

**Migration date:** 2026-10-01  
**Canonical successor:** **Dicebox Injector**

This document preserves the actual campaign-related state that Dicebox Campaign Helper can establish from its files and knowledge base. It separates established source-backed material from experimental or unresolved work. Newer Dicebox Injector campaign continuity takes precedence where it has fresher narrative state.

## Canon status model

- **ESTABLISHED / SOURCE-BACKED:** represented by active/canonical KB facts, source documents, or carried runtime handoffs.
- **HISTORICAL / SUPERSEDED:** preserved for provenance but not current implementation authority.
- **PROPOSED / EXPERIMENTAL:** design/package exists without complete live certification.
- **UNRESOLVED:** open or blocked and must not be assumed true.
- **CARRIED HANDOFF:** runtime status was reported by a preserved source handoff but was not re-executed during this migration.

## Current party location and situation

Campaign Helper does **not** contain one reliable current-session record establishing the player party's present physical location, current selected story branch, complete active quest ledger, faction-state ledger, or GM-secret ledger.

The strongest established campaign/runtime target is **The Ballad of Chauser Bill**, with the principal preserved Campaign Helper encounter route being the **Ascendancy** package. Do not infer that the party is physically inside an Ascendancy scene merely because those scenes were the technical validation target.

Dicebox Injector should merge the material below with its own newer campaign database for live party continuity.

## The Ballad of Chauser Bill

**ESTABLISHED / SOURCE-BACKED**

Historical authorized compatibility target:
- Foundry world ID: the-ballad-of-chauser-bill
- Foundry VTT: 14.367
- D&D5e: 5.3.3
- DiceBox module/bridge work was explicitly bound to this target for campaign compatibility and live validation.
- dbx-test-world remained the separate disposable exact-fixture lane.

The project contains Ballad target identity, Regionwright handoffs, Scene/Region/Wall/renderer evidence, active-GM rules, settings evidence, and recovery/open-item history. Those files are preserved under source/dated-working-repository and indexed in the SQLite KB.

## Ascendancy campaign package

**ESTABLISHED / SOURCE-BACKED**

Named scene/map material preserved in the repository includes:
- Ascendancy Tram Depot / routing yard
- Signal Frequency Chamber
- Rune Mechanism Chamber
- Central Core Control Chamber / Core Chamber
- Final Ejection Airlock
- Industrial Transit Bay
- Calibration and Map Lab fixtures used to validate geometry and projection rules

Important established topology/mechanical rules:
- The Tram east rail must enter the Core west wall.
- Tram background art contains fixed topology only.
- Movable tram cars are separate native Tile projections rather than baked movable objects.
- Spatial Blueprint geometry and stable DiceBox IDs are authoritative over pixels.
- Manual Ballad Region bindings were established for Signal, Rune, and most Core Regions, but some Regionwright runtime/confirmation work remained unresolved.
- Ascendancy ownership boundaries and Macro invariants are encoded in the KB.
- Player requests do not themselves grant mutation authority.
- Partial Ascendancy reset is unsafe because it can leave derived cooperative/final progression inconsistent.
- A complete reset must clear the selected puzzle plus its owned pair/cooperative/final/runtime state while preserving unrelated and foreign state.

## Ascendancy map and asset continuity

The archive preserves the actual map images and Tile/overlay assets, including:
- manual and generated Central Core variants
- manual and generated Rune Mechanism variants
- manual and generated Signal Frequency variants
- multiple Tram Depot / routing-yard / Rush Hour variants
- calibration graybox/marker assets
- core, rune, signal, gate, rail, and tram-car SVG assets
- Campaign Helper Map Lab asset and typed geometry fixtures
- Universal Battlemap / UVTT candidate bundles and overlays in outputs/

The map README and package/receipt files should be consulted before selecting a visual as canonical. Newer neutral/manual-final assets often supersede earlier candidates while older versions remain useful provenance.

## Tram and Map Lab relationship

**HISTORICAL / SUPERSEDED ACTIVE TEST PATH, CONTENT PRESERVED**

Tram/Rush Hour was heavily used for campaign and coordinate/projection work. Later Stage 12 work explicitly replaced Tram as the *active Campaign Helper testing path* with the package-owned Campaign Helper Map Lab.

That replacement did **not** delete or invalidate Tram as campaign content. Tram maps, cars, rails, gates, logic, receipts, calibration data, and open delivery work remain preserved.

Map Lab's purpose was a deterministic helper-owned test:
- exact 1536 x 1024 generated asset
- stable helper-only IDs
- typed Spatial Blueprint geometry
- renderer-only visual layer
- six Walls
- five Regions
- six anchors
- no raw Foundry state
- no runtime certification from local validation alone

## Regionwright continuity

**ESTABLISHED + UNRESOLVED RUNTIME WORK**

Regionwright is the companion system for Regions, puzzles, traps, teleport behavior, and scenario setup.

Preserved rules:
- consume the current helper plan / Spatial Blueprint before modifying Region geometry
- preserve stable IDs
- geometry is not derived from screenshots
- player-facing teleport/confirmation behavior must be explicitly modeled
- source/test success is not live promotion
- target-bound runtime reread is required
- shared/foreign Region state must be preserved
- partial reset behavior is unsafe for Ascendancy
- exact runtime confirmation/result behavior was still an active defect/open area

Notable unresolved Regionwright themes are fully enumerated in metadata/OPEN_ITEMS.csv.

## Beyond the Realms NPC Injector

### NPC Injector Engine 1.0

**CARRIED HANDOFF — RUNTIME_CONFIRMED IN SOURCE HANDOFF**

The preserved 2026-09-19 reconciliation handoff reports three successful fresh Actor injections:
- **Skriv Nettleshard**
- **Kethra Glowcap**
- **Vaelith Duskspark**

Reported checks included:
- embedded WebP validation
- upload-first behavior
- Actor creation
- portrait/token assignment
- D&D5e field population
- folder assignment
- disposition
- migrated D&D5e 5.3 darkvision path
- final PASS diagnostics

Historical D&D5e 5.3 darkvision path:
system.attributes.senses.ranges.darkvision

Engine 1.0 should be treated as a frozen validated baseline from its source handoff, not redesigned from memory.

### NPC Injector Engine 2.0 / Tharvek Alpha 1

**PROPOSED / PENDING RUNTIME TEST**

Tharvek / Injector 2.0 Alpha 1 had not been runtime-tested at the preserved handoff boundary. Do not upgrade it to validated status.

The intended 2.0 direction was a fully game-ready Actor pipeline using constrained manifests, compendium resolution, cloned Items, supported custom mechanics, native D&D5e Activities/effects, and stronger managed-item identity.

Display-name-only managed Item cleanup was explicitly considered unsafe as final production identity semantics.

## Beyond the Realms Scene Injector

### Prototype 3

**CARRIED HANDOFF — RUNTIME_CONFIRMED**

Prototype 3 is preserved as the original runtime-confirmed single-macro Scene Injector architecture.

### Prototype 4.6B

**CARRIED HANDOFF — RUNTIME_CONFIRMED**

The preserved handoff reports the full Scene installation path working.

### Prototype 4.6C

**CARRIED HANDOFF — RUNTIME_CONFIRMED**

This fixed a Region-puzzle re-entrancy defect. A prior design let one TOKEN_ENTER handler enable another TOKEN_ENTER behavior on the same Region during the same event, causing repeated alternating success / SEQUENCE BROKEN feedback.

Preserved correction:
- solved Regions become inert where required
- same-Region enter-event re-entry is prevented
- native Toggle Behavior and Teleport Token were part of the carried runtime evidence
- ExecuteScript was used for critical feedback where needed
- default Level reuse, Level-bound Walls/Regions, dry-run, persist, validate, READY were part of the reported runtime-confirmed path

### Prototype 5 / Elemental Confluence

**PACKAGE-READY / APPROVED ART EXCEPTION / UNRESOLVED LIVE PROMOTION**

Approved map:
source/dated-working-repository/beyond-the-realms-bridge/assets/BTR_Prototype5_Elemental_Confluence_Player_Map.png

Declared source-handoff properties:
- dimensions: 1448 x 1086
- SHA-256: e6966308e02fc8b1dfccee609c155f4a27da24c48ca1950772d696354bc7bf44

This map is a documented one-time **art-first alignment exception**. It is not precedent for abandoning the normal MapSpec-first workflow.

Open Prototype 5 work included:
- final MapSpec alignment
- fresh install
- drift simulation
- persistent CREATE / UPDATE / PRESERVE / WARN reconciliation
- reconciliation rerun
- promotion decision

## NPC relationships, factions, quests, secrets, and story branches

Campaign Helper is much stronger on encounter/runtime mechanics than on a consolidated narrative database. No single authoritative current ledger was recovered here for:
- complete party roster
- NPC relationship graph
- complete active quest list
- faction activity/status
- GM secret/revelation state
- selected narrative branch

Do not reconstruct those from technical fixtures or conversation memory. Use Dicebox Injector's newer campaign continuity and other campaign-specific projects as the authority.

The concrete named NPCs above, Ascendancy scene structure, Regionwright mechanics, and BTR injector state are the campaign continuity this project can safely contribute.

## Encounter and puzzle mechanics worth preserving

- Geometry/topology is designed before art.
- Fixed environment is separated from runtime-movable/stateful objects.
- Puzzle state machines define trigger, success, failure, reset, and recovery behavior before installation.
- Same-event same-Region TOKEN_ENTER re-entrancy is prohibited where it would recursively enable enter behavior.
- Solved Regions become inert when the puzzle design requires it.
- Complete reset cascades must clear all dependent owned state.
- Foreign/unrelated state must survive reset and reconciliation.
- Teleport/confirmation behavior needs exact target-bound runtime proof.
- READY is post-install evidence, never inferred from static validation.

## Injector mechanical assumptions

- Use configured Foundry Documents and supported public APIs.
- Resolve required compendium content before Actor mutation.
- Abort cleanly if required content is missing.
- Use native D&D5e Activities for ordinary attacks, saves, damage, healing, targeting, consumption, uses, and effects when available.
- Do not invent deep D&D5e schema from memory.
- Avoid arbitrary/unregistered custom flag namespaces in standalone injector content.
- Verify image bytes, dimensions/hash/path/retrievability before binding them.
- Art prompts should not receive hidden macro, stat-block, schema, or puzzle logic.

## Important failed approaches with campaign impact

- JSON import was not a successful primary NPC Injector workflow.
- Older image paths returned 404s.
- Approximately 800 KB Base64 art payloads caused a BTR macro to fail to start visibly while roughly 97–100 KB payloads worked.
- Arbitrary custom flag scopes were rejected.
- Display-name-only managed Item identity is not production-safe.
- Browser/tab identity did not always prove usable runtime context.
- Static or fixture evidence must not be silently upgraded to live campaign certification.

## Open campaign-facing work

The exact open-item ledger is metadata/OPEN_ITEMS.csv. Campaign-facing themes include:
- prove player-side Ascendancy triggers
- repair/validate Ballad Regionwright confirmation and result flow
- obtain current Ballad Assistant runtime receipts
- exact-UUID Scene settings correction/reread
- manual Scene and Regionwright UUID handoff gates
- renderer/Background Object/Tile promotion and reread
- candidate UVTT import/reconciliation
- deliver playable Ascendancy Tram Depot Scene
- prove native fixture Tram access adapter
- retrieve missing canonical BTR knowledge sources
- runtime-test Tharvek / Injector 2.0 Alpha 1
- finish Prototype 5 reconciliation and promotion decision

## Source files to read first

1. metadata/CAMPAIGN_FACTS.csv
2. metadata/CAMPAIGN_DECISIONS.csv
3. metadata/OPEN_ITEMS.csv
4. source/dated-working-repository/database/dicebox_campaign_helper_knowledge.sqlite
5. source/dated-working-repository/docs/CURRENT-CAMPAIGN-TEST-2026-08-21.md
6. source/dated-working-repository/assets/maps/README.md
7. source/dated-working-repository/beyond-the-realms-bridge/knowledge/CURRENT_STATE.md
8. source/dated-working-repository/beyond-the-realms-bridge/knowledge/RUNTIME_RESULTS.md
9. source/dated-working-repository/beyond-the-realms-bridge/knowledge/FAILURES_AND_LESSONS.md
10. source/dated-working-repository/beyond-the-realms-bridge/reference/Beyond_the_Realms_NPC_Injector_Reconciliation_Handoff_2026-09-19.md
11. source/dated-working-repository/beyond-the-realms-bridge/reference/BTR_Prototype5_Scene_Injector_Handoff_2026-09-21.md

## Continuity uncertainty that must remain explicit

Campaign Helper alone cannot truthfully establish:
- current party location
- current complete active quests
- current faction activity
- current GM secrets/revelations
- current selected story branch

Those are not to be guessed. Dicebox Injector should merge this package's technical/campaign mechanics with its newer live narrative database rather than allowing older Campaign Helper validation state to overwrite current story continuity.
