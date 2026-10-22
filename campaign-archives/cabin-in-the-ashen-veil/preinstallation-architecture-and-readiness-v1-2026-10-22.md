# Cabin in the Ashen Veil — Pre-Installation Architecture & Readiness v1

**Date:** 2026-10-22  
**Owner instruction:** “lets finish what we need to figure out in order to install everything, installation and gameplay testing should not be on that list.”  
**Scope:** Finish global **decisions and specifications needed to author map/scene packages**, **not installation or gameplay testing**; those downstream activities receive separate eventual execution receipts and are not prerequisites in this readiness score. Use established Dicebox state machine and side-campaign FAST / Good Enough exceptions. **No Foundry writes, module alteration, Bridge/Relay operation, or product-stage change** occurred in this preparation pass.

## Executive disposition

**Global pre-installation planning contract: DEFINED.** The puzzle/feature choices were already locked under [the owner-delegated puzzle spec v1](./authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md). This pass adds exact logical scene IDs, routing graph, physical image-scale strategy, source-house coordinate transforms, an object/interaction data contract, stage policy, fallback world-state store and a plan for reusable BUILD deliverables.

**Global census:** 43 planned logical locations; **46 tentative physical Scene stage records** if Pond full/drained, Bath full/drained, and Memorial dormant/activated are separate physical Scene Documents, as the existing stage-swap design contemplates; 49 logical paired location routes. All 43 are part of a connected undirected planning graph. All 18 existing house locations are projected from House Master V1, with 16 source-dimensioned room outlines and **two explicit designer-PREPARE attic/roof composition frames**. Count and route connectivity are planning checks, not live path tests. Detailed final Ritual Chamber encounter retains its explicit owner-directed last-stage deferral.

## A. Identity, scenes, variants and data ownership — DECIDED

**Canonical IDs:** use `H-G01..H-G08`, `H-U01..H-U06`, `H-A01` attic, `H-R01` roof, `H-B01..H-B02`, `SG-01..SG-09`, `EXT-01..EXT-07`, `BATH-01..BATH-04`, `AQ-01..AQ-02`, `UD-01..UD-03`. Legacy aliases `H-AT`→`H-A01`; `H-RF`→`H-R01` are import-only. Never create duplicate Scenes for old aliases. Names are human-facing metadata, **IDs control references**.

**Stage keys:** `SG-05@dormant|activated`, `EXT-02@full|drained`, `BATH-01@full|drained`; other maps `@base`. Full-hot Bathhouse is **full art + separate controlled effects**, not a third logical/physical bathing hall scene. All portal pairs resolve logical location → **currently active variant** from shared state, never a stored stale Foundry UUID. Old stage entrance Behaviors cannot remain active as independent routes once stage switches.

**Location source:** [43-node, 49-route machine route contract](./foundry-route-contract-v1-2026-10-22.json). The ground-floor and upper-floor rooms/doors/vertical portals derive from approved House Master JSON; outside edges derive from current nine-Grove/estate decisions. Each paired route has source/destination, conditional gate and travel mechanism. For an iron gate or Reliquary service door the direction may matter; inner-side use can open a door which is impassable from the outer side.

**One world-state authority:** a **GM-only `JournalEntry`** provisionally named `Ashen Veil — Controller (GM Only)`, holding versioned `flags.world.ashenVeilV1`, is the native Foundry v14 fallback selected for this independent side campaign **without introducing a new one-item module**. The journal has no readable player pages and no player ownership. A preferred pre-existing registered Dicebox world setting may be used only if a read-only capability check proves suitable; both options project the **same versioned data schema**, and two authoritative copies must **never** coexist. This is a **design selection to implement through the validated injector**, not proof that a Journal was created. Official Foundry v14 `Document.setFlag("world",...)` supports world-scope namespaces. Every write runs under the designated/active GM; a single serialized, revision-checked dispatcher prevents two player requests from awarding the same unique item. On GM change, re-read revision and item disposition before resuming; a Journal flag alone has no independent transaction/CAS guarantee.

**Item state and physics:** Unique Item IDs are semantic, persisted as exactly one of source/world fixture, player inventory, installed, consumed/claimed. Actor-owned Item UUIDs bound only at runtime. Each interact operation re-reads the actor, capability, shared flags and target, validates expected revision, then commits once with idempotency key and authoritative read-back. Where document updates cannot be atomic, compensating/reconciling restore paths remain explicit; do not silently claim database-level atomicity.

**Controller action allowlist** (future implementation target, never a generic script API): `inspect`, `takeItem`, `useItemOnFixture`, `setDial`, `slideReliefTile`, `enterPortal`, `operateDoor`, `readClue`, `submitCode`, `attemptSkill`, `triggerHaunt`, `changeWater`, `changeStage`, `restoreAtGMRequest`. Actions carry typed semantic feature IDs, actor/token identities, expected revision and exactly defined payload fields. No eval, caller-provided JS, unrestricted Document update, raw DB, or arbitrary message dispatch. **Regionwright handles visual puzzle interfaces only through its verified installed adapter**; core Foundry Regions provide local travel and discovery events, not assumed clickable item UIs.

## B. Coordinate frame and art scale — DECIDED

**Core profile:** Gridless; logical 120px per 5ft = **24px/ft**; no baked grid, no Token Scale Ratio workaround; Scene padding 0 unless a particular PREPARE explicitly authorizes it. Every image and physical rectangle must share aspect ratio. Source art and the resulting resampled build asset carry different immutable SHA-256 identifiers.

**House:** [projection frames](./house-room-projection-frames-v1-2026-10-22.json) compute each room's canvas using approved owner BP-1 `(x east,y north)`. Five feet of margin at minimum coordinate, target at least five beyond the maximum, then round canvas to full 5-ft units. Local pixel formula `pxX = (bpX - canvasLeftFt) * 24`, `pxY = (canvasTopFt - bpY) * 24`. Interiors use the approved physical polygons and exact doorway anchor coordinates; the margin is *rendering frame*, not additional walkable bedroom floor. For H-A01 and H-R01, BP-1 has **empty parts**, so additive explicitly proposed attic/roof composition rectangles are documented separately rather than pretending they were in the approved blueprint. Actual Wall segments still follow polygon and accepted art after PREPARE.

**EXT-01 approved art:** Raster **1536×1024** (3:2, SHA-256 `5284a039c2e990f65bb116e1167e0d9bc918a9a1eb895e9c2be95a33ed6cf4f8`). Earlier **160×115ft** conceptual size would distort it; supersede that *for EXT-01* with **300×200ft**, `60×40` logical 5-ft spaces, `7200×4800px` at 120px/5ft. This is consistent with the approximate **100ft** approved exterior house overall width in the artwork and leaves room for 5–15ft woodland paths. Derived WebP q87 Lanczos `7200×4800` exists in active chat sandbox, SHA-256 `27c2581665ded20fa552bcbd800a1f03566af7bb604b41c1a53d81674840a00a`; source PNG remains preserved. Binary is **not** committed to GitHub with the text-only connected API. Before durable STAGE, source/build asset bytes must be separately made available to the authorized installer by established artifact transport.

[EXT-01 calibration manifest](./ext01-canonical-calibration-plan-v1-2026-10-22.json) includes 10 **estimated visual anchors** for south cabin door, porch safe landing, northwest iron gate spanning its cleared trail, Shack, west shrine path, Privy, pond dock, locked carriage and southern arrival road. Example BP-1-to-exterior alignment: map-local BP-1 core `(0,0)` ≈ `(116.2969,130.4688)` ft when Foyer front-door center `(38,0)` is visually aligned at original source pixel `(790,356)`. **These are candidates**, not certified geometries: no real Wall/door/Region points should be emitted from estimates until the source art's physical features and token landing clearance are traced.

**Per-map rendering:** Other exteriors and rooms use their planned logical footprints in PREPARE, accept good-enough art, then select exact scene frame/crop-or-letterbox and wall/portal pixel traces. Do not finalize nonexistent image-specific Region coordinates prematurely. Use `ImageWidth/Height` and `Scene.width/height` correspondence; Foundry native Scene config states changing grid size after placing Walls/Lights can move anchors.

## C. Logical route, traversal and safe landing — DECIDED

The 49 undirected logical adjacencies are [machine registered](./foundry-route-contract-v1-2026-10-22.json). Each becomes **two labeled directional endpoints** with specific entry geometry and named gate predicate, except where a route legitimately opens only from inside. Canonical route preflight requires:
1. A **visibly traversable on-image threshold** (door opening, hatch, gate spanning path, stairs, shoreline embarkation), Region polygon local to that feature, physically plausible token clearance and an independently safe destination landing (normally outside the destination Region, to avoid bounce).
2. A reverse route with correct door/window/boat/stair semantics, including whether an item can return, whether stage changed, and whether a one-way inside latch changes world state. No portal fake-link simply because two scene IDs are adjacent in a schematic.
3. Controlled on-movement Regions do not automatically award items or solve puzzles. Core `TOKEN_ENTER` can occur on token creation, Behavior activation, or boundary changes. Use explicit movement guards and idempotency for traversal; the Region Document's cross-Scene teleport operation may delete/recreate Token Documents and needs authority and ownership conditions.
4. At least a Medium token's actual approved footprint and safe region clearance; Large/Huge routes only where declared, in accordance with geometry tolerance standard. Forest overhead crown geometry is not the trunk collision boundary.
5. **Grove:** SG-05 is center of nine-map maze. Yard→SG-06 western path open early; Yard→SG-03 iron gate locked from outside until opened inside; SG-06→BATH-01 west-trail fork, rather than inventing another exit on accepted Yard art. SG-07 well → Aqueduct after gate progress even with Pond full. SG-08→Gazebo; SG-09→Greenhouse. Pond/full boat→Boathouse after magical vegetation cleared; early rowing for Mirror is not blocked by this later far-dock gate.
6. Pond and Bath share **one sluice state**, and Memorial swap is governed by Bowl+pellet; the adapter relocates party Tokens only after preflighting every relevant Token. Never delete/duplicate a token or leave a mixed-stage party in an unsafe old background. Reliquary inside-to-Boiler egress always opens without Boiler or Waterworks.

## D. Reusable object and puzzle spec — DECIDED

The [per-scene object inventory](./foundry-scene-object-register-2026-10-22.md) and [31-puzzle audit](./foundry-puzzle-requirements-audit-2026-10-22.md) enumerate what every map must depict and which Foundry object classes own its behavior. The [puzzle design v1](./authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md) governs all solution tuples, code/clock order, rewards, DCs, storybooks, water, chase gating, and final Keystone mechanics.

**Standard package template:** [Example EXT-01 manifest and field contract](./scene-build-manifest-template-v1-2026-10-22.json) establishes: stable logical ID, visual stage, source art/hash, exact canvas/coordinate transform, scenic features, grounded Wall intent, traversable Regions, gated doors, stateful Tiles, explicit interaction actions, Journal/Note content, Item disposition, optional Ambient Lights/Sounds, instance mapping, renderer/owner approval and later runtime receipt. This template is a **pre-build semantic data proposal**, NOT a claim current Map Lab compiler accepts this exact schema. The BUILD adapter must be aligned with the actual compiler or formally validated.

**Lights and sound:** For every scene, **zero lights is valid** where no authentic fixture needs light. Put lights near visually present sconces/lanterns/torches and shadows where story calls for them; never add fill lamps to satisfy a fabricated count. Neutral diffuse permanent map illumination stays readable, while gloomy time/weather, haunted eye, Crimson Veil sky and horror audio belong to Foundry Stage/Ambient/FX effects. Canopy Tile occlusion may be optional for traversable trees; solid Walls trace ground trunks/stone/fences, not tree branches.

**Object classification:** Every required fixture is exactly one of static painted background, independently interactive fixture, state overlay, conditional portal, Item/Actor or inspection content. Items with changing presence MUST NOT be baked in permanently. Visible-code clues use readable player Journal/Note/close-up art; their miniature environmental hint alone is insufficient.

**Puzzle actions:** Reusable narrow UI controls handle code locks, ordered busts, 3×3 tile slider, 3 quarter-turn rings, coupled gauges, Boiler two-wheel control, book ordering, simple narrative prayer actions, and item install/pickup. No heavy new module for one puzzle or one Item. Prefer established Regionwright interaction workflow when exact installed version supports it; otherwise stop that **specific adapter** for authorized bounded development rather than quietly substituting arbitrary page code.

**Packaging:** Existing Dicebox injector hardening governs BUILD: one `.md` file with exactly one self-contained JavaScript macro, canonical v2 scale metadata, embedded/provenanced art, and deterministic `tools/validate-dicebox-build.mjs` acceptance. STAGE/INJECT/VERIFY/RECEIPT are separate future stages; a correct JSON manifest isn't an injector artifact. No bulk world mutation or module product-stage promotion is authorized by readiness planning.

## E. External references used to settle technical choices

- Foundry v14 Regions (updated 2026-10-18 for v14.369): https://foundryvtt.com/article/scene-regions/ — scene shapes, Behaviors, paired teleport, cross-scene policy, movement/event distinctions.
- Region events API: https://foundryvtt.com/api/variables/CONST.REGION_EVENTS.html — `TOKEN_ENTER` triggers on creation, boundary change, enabled Behavior; cannot be treated as player click.
- Region Document: https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html — token ownership and cross-scene `TOKEN_CREATE`/`TOKEN_DELETE`; cross-scene teleport creates a new Token Document.
- Scene properties: https://foundryvtt.com/article/scenes/ — gridless logical scale and correct aspect-dependent Scene image pixel dimensions; set grid before Walls/Lights.
- Document flags: https://foundryvtt.com/api/classes/foundry.abstract.Document.html — world scope `setFlag("world", key, value)` supported and namespaced.
- JournalEntry permissions: https://foundryvtt.com/api/v14/classes/foundry.documents.JournalEntry.html — native GM-only world persistence via Journal flags, subject to runtime ownership.
- Overhead Tile and occlusion: https://foundryvtt.com/article/tiles/.
- Project workflow: `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`, `docs/DICEBOX-INJECTOR-WORKFLOW-HARDENING-2026-10-05.md`, `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md`.
- Historical latest source-module manifest on the **recovery branch** advertises Foundry 14.367 and dnd5e 5.3.3: `packages/dicebox-foundry/module.json`. The v14.369 documentation verifies public capability, **not** the installed version or a green light to upgrade.

## F. Exact pre-installation handoff and remaining artifact-specific work

| Planning item | Disposition |
|---|---|
| Puzzle choices, clue/reward/solution/state design | **DONE** — authoritative puzzle v1 and machine index |
| Canonical map IDs and scene census | **DONE** — 43, with aliases documented |
| Cross-scene logical graph and conditional routes | **DONE** — 49 paired adjacencies; geometry to follow per map |
| Stage architecture and shared world-state design | **DONE** — 46 tentative stage Scene instances; one authoritative campaign state record |
| Default Foundry object/action types and privacy | **DONE** — all 43 object register + manifest template |
| House blueprint projection | **DONE as source geometry plan** — 16 dimensioned source rooms; 2 additive attic/roof composition targets |
| First owner-approved Carriage Yard image-scale mismatch | **DECIDED** — 300×200ft/7200×4800px, no aspect distortion; spatial anchors remain estimated |
| Native-vs-Regionwright responsibilities | **DECIDED** — native structural docs + narrow verified puzzle adapter, not module proliferation |
| Installer packaging and authority | **DEFINED by established workflow** — one validated Markdown macro per build, active GM, receipt |
| Per-scene image-specific Wall/Region polygons, object pixels | **TO AUTHOR AS EACH MAP IS PRODUCED**; cannot be precisely derived before its approved art exists |
| Exact currently active world/module compatibility | **READ-ONLY HANDOFF CHECK** at execution, not an unmade campaign canon choice, and not scored as installed/tested |
| Binary artwork durability/transport | **ARTIFACT HANDOFF** — derived asset currently local/sandbox; stage/embed via authorized pipeline |
| Final Ritual Chamber's encounter specifics | **INTENTIONALLY DEFERRED** by owner to last |

**Pre-installation architecture is defined.** That means scene authors have an input contract now, not that 43 map images already exist. As each map receives good-enough art approval, populate its local feature/geometry manifest, package via established BUILD, and leave actual mutation/verification to the separately authorized stages.

## G. Preserved authority and revision discipline

No rewrite of the first two original transcripts, approved House Master V1, locked Puzzle v1 or prior decision records. This document is an **additive pre-install technical decision**. The owning campaign side-workflow may evolve under the owner's direction; global Dicebox product workflows are not implicitly replaced. All new document IDs, raw item UUID bindings, module capability results, and runtime receipts must be obtained from the actual verified target, not fabricated into this archive.
