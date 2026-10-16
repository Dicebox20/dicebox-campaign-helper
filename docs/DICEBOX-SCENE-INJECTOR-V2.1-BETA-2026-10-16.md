# DiceBox Scene Injector V2.1 Beta — Geometry-First Scene Creation

**Status:** USER-ACCEPTED BETA WORKFLOW, 2026-10-16. Not a released module version, native Foundry implementation version, or Ready-to-Play certification.
**Scope:** DiceBox Scene Injector map/Scene creative workflow, scene state, preview, geometry validation, provenance and handoff. Applies prospectively to new or deliberately restarted maps, including the Dark Arch M01.
**Authority:** user instruction 2026-10-16; repository `AGENTS.md`; existing October 7 semantic rendering, October 9 geometry tolerance and clean-restart rules, automation/BUILD contracts, KB/active program gate.
**Compatibility:** Retains the existing single-Markdown, single-self-contained-JavaScript `dicebox-scene-injector-build/v2` artifact. Does not rename the 0.1.15 Foundry module or alter the 16-stage product roadmap. The v2.1 Beta label is a **creative workflow version**, not a release number.

## Accepted goal

Do not ask the image generator to invent topology and architectural aesthetics at the same time. Prove required geometric connectivity first; then render structural embossed grayscale; then render painterly colors/materials without changing the geometry. Explicit user acceptance of this approach on 2026-10-16 supersedes the older two-art-pass workflow **only for the creative-stage orchestration**. All existing integrity, authority, safety, and inspection requirements remain.

## Canonical creative sequence

```
PREPARE
  -> GEOMETRY AUTHOR
  -> GEOMETRY INSPECT (PASS / NEEDS_RECONCILIATION / REDO)
  -> EMBOSSED GRAYSCALE RENDER
  -> STRUCTURAL INSPECT (PASS / NEEDS_RECONCILIATION / REDO)
  -> FEATURE MANIFEST + SPATIAL BLUEPRINT RECONCILIATION
  -> PAINTERLY RENDER
  -> FINAL INSPECT (PASS = automatically APPROVED | REDO)
  -> BUILD -> STAGE -> INJECT -> VERIFY -> RECEIPT
```

The legacy user-facing commands `PREPARE`, `RENDER`, `INSPECT`, `REDO`, `BUILD` remain accepted aliases to the appropriate phase. `RENDER` cannot skip an unapproved geometry gate. The extra geometry substage is **not** a new Foundry runtime state, module release or 17th active program slice stage. A scene can remain in durable outer `PREPARED` while geometry and structural grayscale passes complete; `RENDERED` requires the full painterly candidate and required evidence. No new state enum is invented until a reconciled validator supports it.

### 0. PREPARE — locked intent

Lock scene purpose, visual orientation, dimensions, world/continuity, encounters, actors/object ownership, gate/access semantics, planned map exits, entrances, route requirements, elevation layers, and required interactions. Name each mandatory and optional traversal path, including actual beyond-checkpoint destination and return connection, with explicit start/finish anchors. Fix forbidden features and acceptance checks. Record existing Spatial Blueprint authority. PREPARE output is a versioned `spec.json` plus human-readable PREPARE and immutable prior-attempt archive/recovery reference. A failed history does not become a new image source.

### 1. GEOMETRY AUTHOR + GEOMETRY INSPECT — authoritative shape before pixels

Author a deterministic typed Spatial Blueprint / semantic ground-plane geometry and a neutral **preview**, separately tracking traversable surfaces, elevations, obstacles, exact opening widths, door/gate planes, stairs, ladders, swing anchors and landing targets, raised/recessed structures, route transitions, water/drop hazards, and any intended stateful Tile. This stage may use code, SVG or graybox drawing for **geometry validation** but must not substitute that output for the user's requested artistic grayscale render.

Gate acceptance requires:
- the graph of route connections reaches the required destination for **every** authored route; bypasses must have actual post-gate arrivals without relying on imagined passages;
- usable ground widths and swept creature footprints match PREPARE, including Large access where required, with documented vertical traversal and climb/transport assumptions;
- critical doors, parapets, railings, elevation changes and Wall anchors are geometrically distinguishable; camera orientation/scale and 120px per logical 5ft dimensions remain exact;
- each gate/bypass, movement restriction and semantic class has stable feature IDs and coordinate space;
- programmatic path and connectivity checks pass **before** artistic image generation.

A true missing route or failed hard clearance is `REDO` / geometry correction, not a prompt-writing exercise. Uncertain geometry is `NEEDS_RECONCILIATION`, not automatically a full map REDO. An accepted Blueprint outranks pixels. Use the accepted 2026-10-09 tolerance rules and do not infer walls from unreviewed art.

### 2. EMBOSSED GRAYSCALE RENDER + STRUCTURAL INSPECT — form only

Supply the accepted, checked geometry and stage-specific image input. A grayscale prompt must describe **only structural geometry and architectural relief**: strict 90-degree overhead orthographic, gray 3D/Blender-like masses, discernible embossed wall tops, bevels, contact shadows, open passages, stairs, waterline boundaries and recognizable required static props. No references to a future color stage or second image panel. No baked grid, text, tokens, preplaced user-controlled guards, decorative boat/Tile or tilted camera.

Inspect structural art against both PREPARE and the approved geometry: preserved route endpoints, gate position, openings, stairs, swing/landing anchors, physical layers and readable object count. Structural PASS may add inspected details to the Feature Manifest after reconciliation with the existing Blueprint; **never** infer authoritative geometry from pixels alone. Structural PASS authorizes painterly art, **not** final approval.

### 3. PAINTERLY RENDER + FINAL INSPECT — surface treatment only

Use the approved structural candidate **and** authoritative reconciled Feature Manifest/Blueprint to apply accepted scene style and readable material/lighting treatment. No artistic additions may silently alter topology, passable routes, walls, fixture count, gate mechanism, clearance, scene scale or State/Tile ownership. Compare against all prior approved artifacts. Only the **FINAL_INSPECT PASS** automatically approves the exact painterly render. A paint-only failure resets only paint; a newly found geometry defect invalidates paint and returns to geometry reconciliation.

### 4. BUILD / Foundry runtime unchanged

Keep one `.md` with exactly one self-contained JavaScript macro and validator `node tools/validate-dicebox-build.mjs <artifact.md>`. Stable semantic IDs, separation of background art from separately stateful/positionable Foundry Tile objects, no hardcoded external UUIDs, exact active-GM and ownership guards, preview/approval, idempotency and authoritative reread remain mandatory. No user instruction here authorizes a live Foundry mutation, release or ready-state claim.

## Global prompt clean-restart

For any rejected image-generation attempt, archive immutable prompt, provider/model ID, output hash, geometry/source IDs, inspection verdict, and unique approach identifier. On a new attempt, compose a **new independent prompt only from the accepted PREPARE plus currently approved geometry/Feature Manifest** (and for paint-only retries from the approved structural render). Never reuse, tweak, rephrase, edit, seed from, or reference rejected prompts or images. Merely renaming the same composition is a failure. Run the provider-neutral clean-restart preflight where available; if it cannot verify independent source lineage, block generation.

## Provider boundaries

The older provider ADR and accepted database evidence include different GPT Image defaults/benchmark language. A user described ChatGPT Image 2.5 as a standing preference, but exact model exposure/selection is not independently confirmed in this workflow change. Record requested versus actual `provider`, `model`, and generation ID; do not falsely claim use of a specific unavailable model. This beta does not silently supersede the provider-selection ADR.

## Beta status, validation and regressions

- Initial beta adoption is a versioned process contract. Geometry authoring, three-phase rendering and stage automation need independent end-to-end tests before a production-ready designation.
- Regression fixture: Dark Arch repeated near-duplicate rejected renders, grid/boat baked into grayscale, misleading island-side rope/dock connection. The beta must detect incorrect routes **before** grayscale generation.
- Existing confirmed v2 final-inspection and one-macro contracts remain regression gates.
- `GEOMETRY_INSPECT PASS` is not `STRUCTURAL_INSPECT PASS`, `FINAL_INSPECT PASS`, BUILD validator PASS, or verified live Foundry gameplay.

## Dark Arch beta reboot 2026-10-16

Reopen M01 at **PREPARE** under this version. Preserve original user-approved freeform bridge objective, 40×24 `battlemap-120` footprint, coast-to-island topology, GM-owned guards, rope + skiff/boating alternatives, no compulsory puzzle, and Jim as a narrative tagalong. Archive and exclude all prior image prompts and rejected map imagery (#001–#010); geometry scaffold #011 is dated historical evidence only, never automatically authoritative. Next stage after PREPARE is a **new geometry specification and connectivity proof**, **not** another image render. Consult `handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/`.

## Authority and integration blocker

The accepted process change is recorded for review in source, roadmap/active card, and KB chronology. The existing main-branch workflow checker has six unrelated baseline violations on 2026-10-16. Do not claim main-branch integration, new product stage, installed functionality or runtime approval until the review branch is reconciled and promoted under governance.
