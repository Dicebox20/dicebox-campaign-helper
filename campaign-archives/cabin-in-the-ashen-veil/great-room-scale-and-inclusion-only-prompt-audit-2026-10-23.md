# H-G06 Great Room — scale failure and map-process recheck

**Date:** 2026-10-23
**Owner:** "that's too small for the greatroom" and "we also need to revie the map c reation process again. You're naming things that shouldn't be on the map, like the outside ground."
**Scope:** Owner-authorized map-workflow refinement for *Cabin in the Ashen Veil*, with no new render, scene/world writes, approval, or authorized change to global product workflow.
**Disposition:** First Great Room candidate `gothic_manor_great_hall_map.png`, generation `a7c8bbde-a17c-4329-9997-bf7eea9c4069`, is **RENDERED_INSPECT_REDO / owner rejected scale**. Do not reuse candidate image or original prompt; no increase to accepted 18/45 base map count.

## Existing authority restored (not replaced)

1. Canonical `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`: PREPARE → structural evidence/inspect → feature manifest/geometry → painterly render → inspect → BUILD. The campaign owner previously authorized the **FAST deterministic graybox-from-approved-blueprint** exception for stable home rooms, NOT skipping dimensional/door evidence.
2. `docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md`: abandon failed prompt and image entirely; independently author next candidate from valid approved source only.
3. `mandatory-pre-render-prepare-recheck-rule-2026-10-22.md`: scene-specific fresh PREPARE read, exact portal anchors, immutable receipt, inclusion-only render brief, one map then honest INSPECT; no automatic retries.
4. `map-style-research-representative-walls-2026-10-22.md` and `ashen-veil-map-production-locks-v1-2026-10-22.md`: flat 90-degree interior camera, thin overhead representative wall caps, moderate painterly old/creepy material detail, **even neutral diffuse illumination**; dynamic lighting, doors and prizes remain Foundry-managed.
5. `DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`: physical scene dimensions, pixel image size, logical grid size and token footprint must be computed/validated separately; Foundry gridless 120px per logical 5-ft space convention; do not confuse aesthetic zoom with physical room enlargement.
6. Owner-selected Gondian floorplan **BWE-027**, superseding pre-House-v2 room/route placements: Great Room center **14′ east-west × 16′ north-south**, Foyer **6′ × 6′**, independent Family Area **14′ × 8′** to the north. Great Room communicates south→H-G02, west→H-G01, east→H-G05 locked Study, north→H-G09 Rear Family Room, upstairs→H-U02 via eastern main stair. Hearth, large Grandfather Clock, separate inspectable player blueprint display table and `027` lockbox must all fit with believable 5ft-token circulation.
7. Current `H-G06` scene card remains authority for item and puzzle locations. The clock belongs to Great Room, not Foyer. Upstairs Studio belongs on upper floor, not Great Room's east wall.

## What failed in current Great Room render

- The displayed Great Room **feels too small/cramped** for double-height primary household hub, required separate puzzle props, furniture, and an imposing main staircase. Owner explicitly rejected its size.
- Northern doorway visually **competes with hearth placement**. A genuine north Family Room passage needs a clear safe walkable landing and path, not a seam that appears to cross a physical fireplace.
- The blueprint display and `027` lockbox need visually separate physical anchors and token-reachable interaction regions, with the box not just indistinguishable clutter.
- The rendered room includes warm static fire/candle glow which conflicts with the fixed neutral diffuse base-light direction. Live light state belongs to Foundry.
- **Prompt leak:** Naming unwanted surroundings in an image-render direction, even as a negation or negative instruction, violates the owner's pre-existing **inclusion-only** rule. Unwanted scene elements must be discussed only in inspection/QA records, **never in the candidate-generation description**. A negative/exclusion list adjacent to the generation brief is not equivalent to isolating the renderer's payload. Assistant image-generation tools may infer direction from conversational context, so send a short positive-only visual capsule and minimize surrounding descriptions of unwanted items when calling. Do NOT claim a hidden prompt's contents have been verified if provider doesn't expose them.

## Strengthened PREPARE → RENDER local check (effective now)

### PREPARE (architectural)
- Re-read latest specific `H-G06` card, accepted BWE-027 image, current house room-per-map rule, locks, style preset, most recent failure reason and any owner changes.
- **Scale authority gate:** record **physical** room dimensions and separate room boundaries first. Owner rejected perceived size, but a physical increase beyond approved 14×16 requires a **reconciled revised house layout** because neighboring Study/Dining/Family and staircase anchors depend on it. Do not silently enlarge only the raster's scale, shrink 5-ft tokens, or treat a crop/zoom as revised canonical physical dimensions. Choose a large dominant image occupancy AND actual token-circulation feasibility before next render; if 14×16 cannot physically accommodate all must-see furnishings, stage a measured house-layout revision as PREPARE, not a hidden improvisation.
- **Structural overlay:** make/update a simple measured footprint plan including the east staircase and all four horizontal door connections (south, west, east locked, north) plus upper landing exit. Validate that the north transit does not collide with hearth and eastern Study door remains separate from stairs. This can be deterministic FAST structural evidence.
- **Interaction space:** reserve distinct reachable anchors for blueprint table and `027` lockbox; Grandfather Clock must be big enough to read but its Hour Hand is dynamic Item, not a permanent glowing object.

### RENDER (prompt sanitation)
- Build *two independent data artifacts*: **(a)** the full PREPARE/inspection constraints (may include disallowed elements for internal audit), **(b)** a **renderer-facing positive-only visual capsule** with only desired objects/geometry/materials/illumination. The model-facing capsule receives **only affirmative visible elements**. No negative prompt, no "without", "exclude", "remove", "instead of", or naming any undesired object, place or state.
- Create the positive capsule FROM SCRATCH from current accepted geometry/authoritative facts. Rejected image and rejected words have **zero** compositional authority. Never feed rejected raster for paint REDO.
- A final independent lexical/semantic audit checks *every noun phrase* in the capsule has an approved PREPARE feature or harmless consistent detail. If not, rewrite the capsule rather than listing the noun as an exclusion. This lexical check supports—not substitutes—human review.
- Submit one candidate only; if the rendering interface infers source prompts automatically, do not assert hard isolation or verification that the provider received only the authored capsule.

### INSPECT (functional)
- Compare measured room footprint and actual circulation separately from artistic impression; count four horizontal portals plus upstairs stair; verify pair H-G02/H-G01/H-G05/H-G09/H-U02.
- Evaluate neutral base lighting, strict orthographic overhead, representative narrow wall-cap outlines, distinct plot fixtures and safe token clearances. FAIL if actual route or important fixture conflicts, while tolerating harmless decorative drift.
- Only owner-approved exact art joins archive; live Foundry Wall, Region, key, clock, blueprint and lockbox behavior require later authorized BUILD/VERIFY and cannot be claimed proven by art acceptance.

## Positive-only draft scene brief for *future* rendering (not generated this turn)

> A grand double-height late-autumn family Great Room, depicted as a generous 90-degree orthographic interior battlemap with a clearly dominant expanse of old timber flooring. A broad central gathering space with comfortable worn family furniture and a substantial family architectural drawing table, beside a separate small secure iron lockbox cabinet. A broad, dignified old masonry hearth occupies an architecturally suitable solid portion of the northern wall, with the passage to the family sitting room clearly accessible. A generously proportioned eastern staircase rises to the upper floor, with a separate eastern locked Study door. A large carved grandfather clock stands in its own reachable niche. The southern Foyer door and western Dining entrance are clear, with thin consistently beveled stone-and-timber representative wall caps at all permanent boundaries. Faded rugs, aging oak, tarnished brass, even cool neutral ambient light and modest natural material shadows. Playable wide walking clearances around every furnishing and portal.

**NOTE:** This draft is only a positive art direction. It is **NOT READY FOR RENDER** until measured source and desired owner scale are reconciled in current scene-specific PREPARE. Do not reuse this draft as a retry of the rejected generation prompt: derive new fully independent composition when actual REDO is authorized.

## Change scope and follow-up
This audit corrects **workflow execution**, not all old authoritative documents. Preserve approved Foyer/gen `f6fb7e04` and all other accepted maps unchanged. Proposed additional template checks should be adopted within campaign workflow immediately on owner's direct process-review authorization. Do not claim App implementation, GitHub script enforcement, repository-wide rule change, Foundry verification, or revised owner-approved blueprint geometry.
