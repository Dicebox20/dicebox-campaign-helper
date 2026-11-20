# DiceBox Scene Injector — Workflow Reconciliation Proposal (2026-10-09)

**Status:** PROPOSED — review branch only; does not supersede any accepted contract until reconciled, validated, and merged.  
**Scope:** Scene Creation/Injector workflows for DiceBox Campaign Helper, including the Beyond the Realms M01 experiment.  
**Authority:** The current repository `AGENTS.md`, accepted decisions/KB, Scene Injector skill/contract, semantic rendering specification, scale standard, and exact-stack runtime receipts.  
**Intent:** Keep the proven single-macro contract while closing the workflow gaps exposed by M01. This is not a replacement for the existing creative pipeline.

## 1. Evidence reconciled

- `AGENTS.md`: GitHub/reproducible KB authority, catalogue-first, active GM and exact runtime gates, preservation of foreign state, authoritative reread and receipt; semantic IDs are canonical, Foundry IDs/UUIDs/names/paths are bindings.
- `.codex/skills/dicebox-injector-workflow/SKILL.md`: one `.md`, one JavaScript block, one self-contained user-run macro; fresh stage prompt after failed inspection; default battlemap-120.
- `.codex/skills/dicebox-injector-workflow/references/scene-injector-contract.md`: Prototype 3/4/4.6C runtime lineage—single macro, owned art, default Level reuse, Level-bound geometry, dry runs, batch persistence, behavior and state verification; no same-Region `TOKEN_ENTER` reentrancy.
- `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`: structural render + semantic inspection + Feature Manifest/Blueprint reconciliation + painterly render + FINAL_INSPECT; raw pixels are not geometry authority.
- `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`: Gridless/120 px/5 ft default; PREPARE-scoped approved exceptions only.
- `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`: BUILD → STAGE → INJECT → VERIFY → RECEIPT; resumable state and uncertain-outcome discipline.
- `beyond-the-realms-bridge/reference/BTR_Prototype5_Scene_Injector_Handoff_2026-09-21.md`: successful Prototype 4.6C and candidate CREATE/UPDATE/PRESERVE/WARN reconciliation. The v0.2 reconciliation engine is not automatically production-certified.
- Read-only M01 Foundry observation on 2026-10-09: one existing scene, approved background on `defaultLevel0000`, zero walls, zero lights, zero Regions; relevant mining/hunting/fishing modules active. A previously staged split installer was **not** executed.
- Knowledge DB trial `T-008`: hardcoded, unverified UUID macros are an anti-pattern; do not infer from this that all runtime Foundry UUIDs or stable internal bindings are forbidden.

## 2. Preserve the official workflow interface

Outer creative API (unchanged):

`PREPARE → RENDER → INSPECT(PASS = APPROVED | REDO) → BUILD`

Inner creative sequence (unchanged):

`PREPARE → STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST / SPATIAL_BLUEPRINT RECONCILIATION → PAINT_RENDER → FINAL_INSPECT(PASS = APPROVED | REDO) → BUILD`

Automated tail (unchanged):

`BUILD → STAGE → INJECT → VERIFY → RECEIPT`

After grayscale failure, discard the failed grayscale prompt completely and author a fresh one from PREPARE. After paint-only failure, discard the failed paint prompt and author a fresh one from the accepted grayscale/manifest. Never instruct the image model to preserve or patch a failed result.

`BUILD` produces **one Markdown file with exactly one fenced executable JavaScript macro**. This rule is nonnegotiable. Do not return a ZIP, several user-run macros, or a manually pasted multi-part installer. Existing embedded WebP/chunk transport and the `verified-path` art mode remain supported. Standalone Markdown is the user deliverable; internal prepared assets are implementation inputs, not extra user-execution steps.

## 3. Define what the ONE macro must do internally

The macro performs the following **ordered phases inside a single execution**. These are internal phases, never separate GM macros:

| Phase | Required operation | Mandatory evidence |
|---|---|---|
| 0. RESUME/PREFLIGHT | Reread target world, elected active GM, exact runtime, durable receipts, scene candidate/ownership, approved art identity, MapSpec, feature manifest, locked scale, expected component inventory and capabilities | No-write preflight receipt; conflicts halt before mutation |
| 1. ART | Decode/upload/hash/serve approved embedded art, **or** verify a previously staged approved file through FilePicker, byte/hash and dimensions before scene mutation | Verified served Foundry data path; source hash; no foreign overwrite |
| 2. SCENE | Uniquely find scene by canonical semantic key plus expected folder and name; create only if absent or explicitly reconcile an existing owned scene | One correct managed scene; unambiguous ownership |
| 3. LEVEL | Reuse Foundry v14 `defaultLevel0000`; bind background to this Level using the exact-stack Level API; never create a duplicate Level | Exactly one expected Level; correct background on Level |
| 4. GEOMETRY | Compile/reproject Blueprint-based Wall/door data, movement/vision/light/sound restrictions; preview/dry-run; batch-create/reconcile level-bound documents | Boundary/opening validation, expected wall roster; no decorative half-wall misclassification |
| 5. ENVIRONMENT | Compile and install authored ambient lights, sounds, hazards, terrain, elevations, and stateful fixtures appropriate to PREPARE | Object counts/ownership, darkness/lighting config readback |
| 6. REGIONS | Compile *all* authored Regions with geometry, visibility, permissions, and level binding; validate supported Foundry shape adapters before persistence | Named/semantic Region inventory; positive-area valid shapes; no accidental hidden/disabled behavior |
| 7. BEHAVIORS | Install all required native RegionBehaviors and system integrations **in the same macro**; register/resolve references only after target documents exist | Behavior types/events/enabled state/readback; real mechanics, not labels |
| 8. ROUTES | Resolve local and existing external destinations from unique authoritative semantic keys/names; convert the resolved documents to runtime ID/UUID references; install only verified teleports | UUIDs actually resolve; arrival safe zone; no bounce; unresolved routes explicitly pending |
| 9. VERIFY/RECEIPT | Authoritative reread of scene/Level/assets/walls/lights/Regions/RegionBehaviors, system configs, route targets, counts, flags, and unchanged foreign state | `READY`, `READY_WITH_WARNINGS`, `BLOCKED` or `FAILED`, with exact next actions |

A static install verifies configuration; actual player movement, vision, resource interaction, and cross-client event behavior remain separately labeled **playtest canaries**. Never call static installation player-accepted.

## 4. Scene/Region lookup and identity

- Use **stable semantic IDs** from the authored spec as primary ownership keys. Use exact scene/Region names and expected parent folder as the human-readable lookup and unambiguous fallback during legacy adoption.
- Reject duplicate names, duplicate semantic keys, foreign documents, conflicting folders, and ambiguous candidate matches. Do not pick the first result.
- Foundry-created IDs and UUIDs are *runtime bindings*. Capture them from the documents created/found in the current run and build dependent behavior/teleport fields from those references. Never require manual entry of a previously observed random Foundry UUID to deploy a new map.
- Prior prototype preallocated IDs are legitimate archival bindings when intentionally authored. They do not justify copying stale UUIDs across worlds or installing against guessed references.
- Where a legacy Scene exists without new ownership flags, use a **read-only adoption preview** and explicit, narrow approval; never silently claim it or create a duplicate.

## 5. All declared Region mechanics must be real

An item in the MapSpec region manifest needs a `mechanicsContract` with: authored intent, native/module owner, capability requirements, user interaction, persistent state, RegionBehavior/API configuration, expected test/evidence, and fallback if unavailable.

- A mining Region declared **ACTIVE** must be configured by the currently active Regionwright Mining API, have player-accessible geometry and correct permission/visibility, and preserve depletion/swing state on reruns.
- Hunting habitat is not an automatic hunt trigger when PREPARE specifies a manual GM hunt start. The installer installs the habitat/encounter metadata and explicitly reports `manual-GM-start` as intentional—not as a broken behavior.
- Fishing Regions require a fishing API and verified body of water. Never invent fishing nodes on dry maps.
- Discovery Regions must obey the existing Notice → Interpret/Search → Recover contract and anti-farming state.
- Travel/arrival anchors can exist without a destination. However an unresolved *required* teleport cannot masquerade as a completed behavior or a complete connected map; mark its status as an explicit deferred dependency/blocker.
- Do not mark a Region as completed merely because it has a name, shape or metadata. If a required behavior/API cannot be installed, installation is **not READY**.
- Only production-certified Region shapes/adapters can be used without an explicit fixture test. Prototype 5 documents circle production support; a polygon mining/hunting adapter needs fixture/runtime validation before promotion.

## 6. Reconciliation and interruption safety

Default is **non-destructive** and **idempotent**. Each authored managed object has a semantic object key; never match only by coordinates or array position.

- Desired object missing → CREATE.
- Desired object unchanged and installed unchanged → PRESERVE.
- Desired spec changed and installed managed fields unchanged from recorded baseline → UPDATE only after applicable production-certified reconciliation gate.
- Installed managed fields changed by GM → WARN/PRESERVE.
- Desired object removed from spec → WARN/PRESERVE as orphan, not DELETE.
- Unknown/foreign document → PRESERVE; warn/stop on collision.
- Preserve resource depletion, player discoveries, reward consumption, one-shot audio/puzzle state, manual edits and authored token footprints. No reset on rerun.
- Unknown or interrupted write → reread actual current documents before retry. The single macro can reconcile partial owned installations; no blind second invocation and no compensating repair-macro chain.
- A second same-class failure blocks live retries until an isolated reproducible diagnosis and corrected test.
- Multi-document Foundry writes are not automatically atomic; report which phases committed and which remain unknown, plus recovery instructions. Do not claim rollback without verifying it.

## 7. Scale, alignment and lighting

- **Default stays Gridless `battlemap-120`**: 120 pixels per five-foot logical cell. PREPARE must lock *physical footprint, logical cells, scene-pixel dimensions, art dimensions, and any affine mapping*.
- Stage any resampling/reprojection *before* Wall/Region creation; apply the same approved transform to every position and width. Check intended token-to-door clearance and path widths.
- An approved image's resolution (for example M01 1536×1024) does **not** by itself approve a gameplay scale exception. A preexisting nonstandard Scene should not be silently rescaled.
- Treat emissive pixels as light **anchors**, not certified Foundry intensity/range. Author or calibrate lights once, preserve dark environment, check token-vision and avoid double-brightening baked glows.
- Roadside low parapets need explicit movement/vision classification, not automatic tall/full LOS-blocking Walls. Excavations require authored access routes and are not completed if mining cannot be reached.

## 8. Readiness statuses (strict definitions)

- `READY`: all **required** components installed, behavior bindings resolved, deterministic checks passed, no blocking dependencies; runtime player canary status is separately tracked.
- `READY_WITH_WARNINGS`: all installed/verified **required** mechanics work; only approved nonblocking/deferred content or optional external routes remain, explicitly named.
- `BLOCKED`: a required input/target/permission/scale/shape/API/dependency is unresolved **before mutation**.
- `FAILED`: actual required installation or readback did not succeed; include committed-partial state and recovery.
- `OUTCOME_UNKNOWN`: timeout/interruption or uncertain write; do not retry until authoritative reread. This is a transient receipt/recovery state, **not** a synonym for FAILED or READY.
- Installed without a player canary must never be labeled `player-tested` or `player-accepted`.

## 9. Validation additions proposed

Keep `tools/validate-dicebox-build.mjs` as the canonical **packaging/scale/discovery marker validator**. Do not mistake its PASS for a playable scene. Add a separate, deterministic **semantic scene-injection linter and fixture suite**, without invalidating legacy v2 outputs:

1. BUILD has exactly one user-run JavaScript macro; no ZIP or secondary user macro.
2. Embedded or verified-path art identity and deployment proof; never silently replace approved artwork.
3. Scene/Region identity lookup rejects duplicate names/semantic IDs and stale runtime UUIDs.
4. Exact v14 default-Level reuse; Wall, Region, AmbientLight binding and shape adapter dry-run.
5. Require a manifest entry and test contract for each required Region behavior; no placeholder-only READY.
6. Verify complete scene object counts, permissions, enabled behavior events and module API postconditions.
7. Preserve GM-edited Wall, mined-out ore, per-player Notice state, and foreign documents on rerun.
8. Injected write interruption recovers by reread rather than duplicate/restart.
9. Pending teleport destinations are reported without invented UUIDs or false READY.
10. Reject same-Region `TOKEN_ENTER` reentrancy and potential teleport loops.
11. Guard ratio/physical footprint mismatches and invalid unapproved scale exceptions.
12. Verify receipt source build SHA, world/runtime identity, stage status, and observed counts.

Minimum evidence set: static validator PASS → isolated preview/fixture PASS → exact-stack Foundry apply → independent authoritative readback → player/GM canary where applicable.

## 10. M01 migration / repair boundary

The experimental M01 background was installed into an existing Scene; last read-only inspection found one default Level with the approved image and **zero walls/lights/Regions**. The separate 156-wall and 10-light scripts and the staged v003 unified script are **not accepted official BUILD artifacts** and must not be executed as the final deployment.

Open decisions to resolve before M01 production BUILD:
- **Scale**: the installed 1536×1024 scene with grid size 64 conflicts with default `battlemap-120`; recover PREPARE's intended logical footprint or obtain explicit approval for an exception. Do not guess 36×24 versus 24×16.
- **Geometry**: the current 156 wall segments are provisional; review barrier class/clearances and the excavation entrance, then reproject to the approved scale.
- **Region adapters**: proposed mining/hunting polygon shapes need a certified Foundry v14 adapter or an approved geometry equivalent.
- **Mechanics**: mining must use live Regionwright API; hunting start is GM-manual; no fishing node; travel endpoints require confirmed real destinations.
- **Lighting**: painted torches and fungal glows are anchors. Calibrate dynamic Foundry torchlight conservatively.

No M01 scene mutation, macro execution, or scale change is authorized by this proposal.

## 11. Activation and promotion sequence

This review document is an additive proposal only. To make it official:

1. Reconcile its changes with current project governance, KB and active roadmap.
2. Record accepted additions chronologically in `database/seed.d/YYYY-MM-DD-*.sql`; rebuild and verify the reproducible KB.
3. Add normative pointers/accepted text to the injector skill, contract, and automation tail while preserving prior historical sources.
4. Expand the linter/fixture tests and verify the canonical BUILD validator and its self-test still pass.
5. Generate one M01 `.md` + one macro using the accepted scale/geometry, then validate before STAGE.
6. Promote changes only after review of diff, test receipts, no-write M01 preflight, and a safe exact-world verification plan. Never treat this document or a staging success as a live installation receipt.
