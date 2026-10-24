# Cabin in the Ashen Veil — interior Scene BUILD Phase 1: named Regions only

**Owner direction:** 2026-10-23, after choosing H-G02 Foyer for first Foundry scene, the owner explicitly limited interior-map construction: **"the interior maps only need the necessary regions, we probably shouldn't put the puzzles together until they end. we just need the named regions and we can work from there."**

**Decision class:** accepted owner-scoped adjustment to the execution *scope*, not a replacement of canonical PREPARE → RENDER → INSPECT PASS → BUILD → STAGE → INJECT → VERIFY → RECEIPT transport, target/safety checks, or the single-markdown/single-macro contract.

## Two-pass implementation boundary

**Phase 1 — structural map shell / indexed placeholders (current):**
- Use **only exact owner-approved** scene background art, verified by its filename, SHA-256, dimensions and served Foundry path; do not regenerate or substitute art.
- Create a separate Scene for each interior room. Observe DiceBox `battlemap-120` logical gridless scale; reuse the Scene's default Level; add required structural Walls and physical door apertures when reconciled geometry exists and keep them Level-bound. This is not a request for decorative standalone scenery Regions.
- Create only essential, named, stable-key **Region** documents as semantic anchors. Region geometries must be reconciled to an actual approved scene coordinate space; no hand-guessed coordinate endpoints. Regions have **zero RegionBehavior children**, no on-enter triggers, no rolls, no scripts, no pop-ups, no auto-teleports, no item grants, no puzzle-state flags. A named Region is not by itself a working transition.
- Record planned narrative/transition/puzzle role in the **GM-side** semantic manifest and preserve the relationships without activating behavior.
- Prefer sparse Regions: route/arrival and future interaction anchors only, not every piece of furniture. Existing art may contain interactive-looking visual objects; do not instantiate their game mechanics in this pass.
- Verified content does not automatically imply authorization to insert content into an unverified world. Apply the exact target, elected active-GM, ownership, preview and native dry-run guards in the canonical injector workflow.
- Treat `BUILT` only as validated build-package state, and `VERIFIED` only as Foundry reread confirmation. Do not conflate visual PASS with live scene completion.

**Phase 2 — interactivity and puzzles (deferred until the owner elects to begin, ideally after shell completion):**
- Attach RegionBehaviors and validated destinations to already named Region anchors.
- Wire navigation teleports, locks/keys, discoveries, dialogue, rewards, conditional Tile/light states and progression.
- Independently test each behavior and cross-Scene route; preserve Phase 1 IDs and existing GM state.

## H-G02 Foyer — initial minimal Region roster

These are conceptual stable **names**, NOT installed Regions or authoritative polygons. Coordinate/ID allocation occurs only from the reconciled Foyer blueprint with approved raster.

| Stable semantic key (proposed) | Region document name | Role in eventual route graph | Phase 1 behavior |
| --- | --- | --- | --- |
| `cav:h-g02:front-entrance` | `H-G02 — Front Entrance` | South arrival/exit to front porch / EXT-01 | **None** |
| `cav:h-g02:great-room-doorway` | `H-G02 — Great Room Doorway` | North door to Great Room H-G06 | **None** |
| `cav:h-g02:basement-door` | `H-G02 — Basement Door` | East door with Weathered-Key lock, distinct from stairs | **None** |
| `cav:h-g02:basement-stairwell` | `H-G02 — Enclosed Basement Stairwell` | East enclosed descending stair behind the locked door, eventual H-B01 route | **None** |

**Do not add** a Coatrack Region without a defined future mechanical or discoverable role; the coatrack is visual flavor. The **Weathered-Key** mechanic is explicitly deferred even though the locked physical door remains part of the scene's semantic blueprint. Entrance/exit Regions remain inert until Phase 2; no use of half-configured teleport RegionBehaviors.

## Current blockers and evidence status

- The exact approved Foyer art is `rustic_foyer_and_hidden_stairwell_map.png`, gen `f6fb7e04-0835-4481-906f-35c83bb8502d`, 1448×1086 px, **SHA-256 `34c5e7dab1193893ef6e557745e85821362f76741464567a73120a689cb6b1e8`**. Prior approved ZIP archive `ashen_veil_approved_maps_2026-10-23_v10_foyer_approved.zip` has SHA-256 `25d0775787a77c12c8f77fcc6250ee0671476538da5a08348580335efa53a2cc`. Neither exact filename was found at the ordinary remote Windows Downloads root or world maps root during the Bridge preflight; the image was not found in the active ChatGPT workspace. Broader remote disk search / user asset import may recover this. **No substitute art is authorized**.
- Foundry `cabin-in-the-ashen-veil` is open under `Gamemaster 2`. Runtime `Foundry 14.367`, `dnd5e 5.3.3`, helper `0.1.15`, Playwright CDP working. However Gamemaster 2 **was not the elected active GM** at the last exact readback. Therefore live world writes remain **blocked**, even if the generic harness macro transport would accept ordinary isGM. The module `game.diceboxSceneSetup` is also hard-locked to `regionwright-puzzle-test` and must not be used as a general CAV Scene installer.
- Old BWE-027 survey Foyer dimensions are nominal 6×6 ft. Approved visual includes east enclosed stairwell extension; a reconciled actual coordinate-space and 5-ft traversal/arrival clearance plan is needed before fitting Levels, Walls, Regions or committing gameplay scale. No arbitrary measured polygon is approved by this scope decision.
- All current **Foundry Scenes remain uninstalled** at the last readback (0 in this world). Nothing in this document implies a live build, Scene asset upload, Macro creation, Region writes or active-GM authority.

## Recovery sequence

1. Recover exact approved Foyer art **by checksum**, stage served Foundry asset without altering old approvals.
2. Resolve elected active-GM authority using normal Foundry ownership/session behavior, not programmatic bypass.
3. Reconcile source polygon map, Scene scale and Region footprints for the four named anchors; record precision/uncertainty, exact asset identity and explicit preview.
4. Build one canonical self-contained Markdown macro; run `node tools/validate-dicebox-build.mjs <artifact.md>`. Only on PASS and approved runtime gates proceed to STAGE/INJECT/VERIFY.
5. Reread Scene, Level, image, Walls, and **four named inert Regions with zero RegionBehaviors**; record stable managed IDs and receipts. Repeat the same minimal model for later interior rooms.
6. Defer the entire puzzle/interaction pass until the owner requests it. Never silently install gameplay mechanics in Phase 1.

## Authority and exclusions

Sources: `AGENTS.md`, `.codex/skills/dicebox-injector-workflow/SKILL.md`, `references/scene-injector-contract.md`, `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`, `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`, `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`, owner-approved H-G02 art receipt and House Layout v2. Owner's explicit scoped exception governs **puzzle timing / RegionBehavior exclusion**, not authorization to skip injector validation or world targeting.

**Status:** PHASE-1 BUILD SCOPE LOCKED; AUTHORITATIVE ART/GEOMETRY/ACTIVE-GM BLOCKERS; NO FOUND RY WRITE.
