# Scene Injector — mandatory grayscale + painterly workflow (reconciled audit)

**Audit updated:** 2026-10-12  
**Classification:** explanatory index of **already-accepted** process, **not** a new or alternative workflow. The accepted sources on `main` always govern any disagreement.

## Authority and precedence

- `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md` — **current canonical rendering rendition v2026-10-07.2**.
- `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md` — accepted durable state machine, staging and execution overlay.
- `docs/DICEBOX-INJECTOR-WORKFLOW-HARDENING-2026-10-05.md` and `.codex/skills/dicebox-injector-workflow/SKILL.md` — named creative workflow and single-MD/single-macro BUILD contract.
- `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md` — later accepted geometry/clearance rule.
- `docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md` — later locked rule for every image attempt.
- `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md` — default battlemap-120 gridless scene scale, separate from Actor-owned token footprints.
- The accepted repository `AGENTS.md`, current ADRs and approved KB decisions outrank this audit index.

## Named outer API

`PREPARE → RENDER → INSPECT(PASS = APPROVED | REDO) → BUILD → STAGE → INJECT → VERIFY → RECEIPT`

The **creative** `RENDER/INSPECT` phase is an obligatory two-pass structure/color sequence:

`PREPARE → STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST / SPATIAL_BLUEPRINT RECONCILIATION → PAINT_RENDER → FINAL_INSPECT(PASS = APPROVED | REDO) → BUILD`

A structural PASS **does not approve final artwork**. Only FINAL_INSPECT PASS records approval, with optional redundant `APPROVE` acknowledgment. State `RENDERED` is not achieved until paint exists along with required structural evidence.

## Newly recovered accepted-local overlays (pending GitHub promotion)

**Text schematic in PREPARE, user-approved 2026-10-09.** The companion KB decision `D-2026-10-09-PREPARE-TEXT-LAYOUT` requires a monospaced top-down textual diagram before any map rendering, with cardinal directions, entrances/exits, routes, branches, landmarks, obstacles, legend and location table. Inspect the diagram against approved topology; the Spatial Blueprint still owns exact geometry. This rule was recorded in the companion workspace docs and `database/seed.d/2026-10-09-prepare-text-layout.sql` but is **not yet promoted into main**. The source explicitly does **not** approve the experimental v3.1 workflow. Treat diagram requirement as accepted local governance pending formal reconciliation, not as authority to replace the accepted October 7 structural workflow.

**Region→Macro permissions, user-accepted local foundation record 2026-10-12.** The archived Foreman workflow and PARTIAL/STOP local DB checkpoint require exact RegionBehavior/Macro binding and permissions checks before changing a player-triggered Region, post-install and after fresh reload. `everyone=true` is not a substitute for Macro permission, `LIMITED` is a possible player-execute level, and privileged Macro behavior still requires GM-only/approved adapter control. This rule is **not on main** and does not retroactively certify the Lodge player canary.

The proposed combined authoring order becomes **text diagram (locally accepted overlay) → PREPARE/Blueprint lock → grayscale structure → structural inspect → manifest/blueprint reconciliation → painterly color → final inspect → single-macro BUILD → authorized STAGE/INJECT → readback + player-execution permission verification where applicable → RECEIPT**. Only the October 7/9/5 parts already merged into main are presently canonical at the GitHub-wide level.

## Stages, checked artifacts, and stop conditions

| Stage | Mandatory result | Conditions |
| --- | --- | --- |
| PREPARE | Locked scene ID, campaign continuity, logical footprint, scale, topology, entrances/exits, routes, landmarks, interactables, forbidden features, hazards, art direction and inspection criteria | Existing Spatial Blueprint controls explicitly authored geometry |
| STRUCTURAL_RENDER | **Grayscale 3D/Blender-like graybox**, strict 90° overhead orthographic/no perspective tilt, physical wall thickness, room boundaries, openings with clear endpoints, recognizable furnishings, terrain, elevation and object footprints | No baked grid/labels/tokens/UI. Preserve source prompt, attempt identity and image hash |
| STRUCTURAL_INSPECT | Explicit comparison of grayscale geometry to PREPARE, route/walkable-ground and creature clearance, semantic object recognition, ambiguities | Failing/contradictory geometry blocks paint. Measurement uncertainty is `NEEDS_RECONCILIATION`, not automatically a REDO |
| FEATURE_MANIFEST / BLUEPRINT LOCK | Stable feature IDs, structural image provenance, semantic classes, geometry primitives/coordinates, movement/vision/sound/light intent, opening/terrain types, stateful-vs-baked ownership, projection hints, relationships and confidence | Reconcile against existing Blueprint. **Pixels and preliminary hints alone are not authoritative Foundry geometry** |
| PAINT_RENDER | Color/painterly art **from approved grayscale + reconciled manifest**; preserve topology, objects, openings, clearances, hazard/discovery/transition anchors and orthographic camera | No stealth insertion/deletion, moving, merging or reclassifying semantic features |
| FINAL_INSPECT | Compare painted result against PREPARE, approved grayscale and manifest/Blueprint, checking structural alignment, object visibility, walls, openings, emitters and any false/unapproved features | Only PASS creates APPROVED status; paint-only REDO retains approved grayscale/manifest |
| BUILD | Approved painted art and reconciled semantic geometry; exactly **one Markdown file with one self-contained JavaScript macro**, validated by `tools/validate-dicebox-build.mjs` | Never default to ZIP/split macros. Deterministic BUILD validation alone does not certify runtime install |
| STAGE / INJECT / VERIFY / RECEIPT | Art, walls/doors, lights/sounds, Regions/behaviors, Tiles, hazards, puzzles, teleports and other scoped native documents from approved semantic records | Exact target and active-GM gates, authorized runtime adapter, authoritative reread and build-hash-matching receipt. No live claims without verified evidence |

## Grayscale purpose and inspectable features

Graybox is both (a) a visual structural candidate and (b) an input to disciplined extraction/reconciliation, rather than a decorative desaturated copy of the final map. Inspect wall solidity, door/secret door/window endpoints, movement-only and sight-only barriers, stairs/bridges/ledges/water, difficult terrain, canopy and roof classes, candidate Regions and behaviors, light/sound sources, hazards, discoveries, puzzle mechanisms and routes.

Wall/Region coordinates must be authored and reconciled as deterministic geometry primitives against locked logical/render coordinates. Preview pixels never authorize native Foundry write operations.

Apply October 9 geometric tolerance: distinguish actual traversable ground from bright road paint; preferred road/trail bands are not universal hard minimums. Maintain required creature clearance for designated Large/Huge routes. Record uncertain measurements; do not force expensive image rerenders without a proved structural reason.

## Mandatory clean restart after rejection

- Structural REDO: archive failed prompt/image; compose a *new independent* structural prompt solely from locked PREPARE/accepted structural inputs. Do not vary, patch or edit the rejected prompt/image.
- Paint-only REDO: preserve the **approved** grayscale render + manifest as valid inputs; independently compose a fresh paint prompt; never reuse the rejected painterly result/prompt.
- Final-inspection discovery of structural error: return to structural correction and invalidate downstream paint approval.
- Preserve immutable attempt hashes/receipts. A reviewer must attest independent authoring; lexical no-duplicate checks alone cannot prove creative independence.

## Open audit questions (not changed by this index)

- Verify implementation of Feature Manifest schema and geometrical extraction/projection; the canonical document calls the detailed entry schema *provisional* until the machine schema is implemented.
- Verify desktop Map Lab/provider adapter behavior against mandatory graybox inspection, accepted image prompt restart and final visual approval; prototype UI is not automatically certified.
- Verify historical renders and runtime receipts for exact stage and build hashes.
- Keep PR #7 proposal distinct; do not turn unmerged process suggestions into accepted policy.

This document captures an already-current workflow accurately. It does **not** promote PR #16 to `main`, approve a map, or authorize any live Foundry modification.
