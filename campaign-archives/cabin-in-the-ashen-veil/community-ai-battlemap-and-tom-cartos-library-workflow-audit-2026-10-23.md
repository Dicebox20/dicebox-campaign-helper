# Community AI Battlemap Methods + Tom Cartos Library: Dicebox Workflow Audit

**Date:** 2026-10-23
**Owner objective:** “that's another failure. We need to research how the community members use AI to create maps, and review tom cartos library again.”
**Scope:** Research and **proposed workflow refinement** for the independent Cabin in the Ashen Veil map program, not a new render, not product-stage advancement, not a Foundry Scene/Wall modification, and **not** adoption of changed original cabin house dimensions without owner authority.
**Immediate status:** H-G06 Great Room render 1 `a7c8bbde-a17c-4329-9997-bf7eea9c4069` and render 2 `f4150872-49e3-4a7a-ac4a-d5d2ceb01ff3` both **REDO**. No other approved artwork modified. 18/45 approved, 27 outstanding.

## 1. Sources reviewed (primary testimony vs inference)

**Community-specific evidence**
- Reddit March 2023: `https://www.reddit.com/r/StableDiffusion/comments/11kpesp/dnd_map_generator_controlnet_donjon/` — documented reproducible example: generated dungeon structure from **Donjon**; used **img2img + ControlNet Canny** with the existing layout as guide; did upscale and localized inpainting. Detailed historical settings there are specific to the contributor's old checkpoint and **not** authoritative Dicebox defaults. A commenter reports furniture requires additional painted hints/inpainting.
- Reddit March 2023: `https://www.reddit.com/r/dndai/comments/11ykgy0/` — mapmaker describes drawing a rough Dungeondraft map before model-based conversion and investigating ControlNet segmentation. Proof-of-concept/personal report, not proof of robust production tolerances.
- Reddit January 2024: `https://www.reddit.com/r/StableDiffusion/comments/1abhwpu/stablediffusion_to_generate_dd_maps_and_top_view/` — intensive img2img/top-down trials; some improvements from selected higher-capability model, but line/segmentation control has notable failures. An author specifically says segmentation often drifted to globes/labels and couldn't reliably follow categories. **Conclusion: layout-conditioned inference helps but is not guaranteed geometry preservation.**
- Reddit April 2026: `https://www.reddit.com/r/dndai/comments/1sgtqgv/does_anyone_use_ai_for_their_topdown_maps/` — users still report difficult camera perspective, multi-iteration results with Midjourney/Gemini. Anecdotes only; no validation tests.
- Reddit July 2024: `https://www.reddit.com/r/StableDiffusion/comments/1dwi9kx` — community flags visually attractive RPG-style maps that have nonsensical floorplans; others advocate hand design / photoshop edits over assuming pretty maps are navigable.
- Official ComfyUI Jan 2026 post: `https://blog.comfy.org/p/preprocessor-and-frame-interpolation` — modular lineart/depth/conditioning preprocessors exist and can be reused in workflows. Means these are plausible **experimental alternate providers** if installed, not evidence that the user's currently connected image renderer exposes exact ControlNet or geometry locking.

**Tom Cartos primary library**
- `https://www.tomcartos.com/manor-house` — coherent Manor House Grand Hall plus upper/basement/roof, separately published day/night, clean (unfurnished) and tile variations, named grid sizes (e.g. Grand Hall map set 44×34 grid spaces, whole multiroom battlemap; not a specific Great Room size).
- `https://www.tomcartos.com/essenheim-manor` — full connected manor levels with clear central court/hall, real stairs, contiguous corridors and consistent furniture relative to walkable footprint; furnished vs clean, alternate light and separate roof. Visual study of layout hierarchy, never copy his pixels.
- `https://www.tomcartos.com/gothic-mansion` — stacked 22×17-grid-space floors, furnished/simple/clean variants and Foundry release tiers.
- `https://www.tomcartos.com/bastion-gothic-manor` — deliberately modular rooms and separately hosted **Gothic Parlour Vast 9×7** and other sizes; empty/haunted variants. Invaluable one-room-per-map workflow precedent.
- `https://www.tomcartos.com/faq` — **Tom says maps/assets are hand drawn and coloured in Photoshop**; clean assets are unfurnished bases; 140dpi VTT output; dimensions encoded in names; he offers mapping tutorials. Extract transferable spatial and layer principles only.
- `https://www.tomcartos.com/toms-open-map-license` and `https://www.tomcartos.com/commercial-licensing` — **critical licensing discovery (October 2026)**: current terms restrict inclusion of Tom Cartos actual artwork in work/products involving AI-generated content and bar AI training; open license also disallows editing/cropping its battlemaps except narrow cases. Commercial rules amended June 5, 2026. As Dicebox uses AI-generated image content and may become product/software, **do not embed, feed, alter, train on, bundle or distribute Tom Cartos PNG/asset files** under an assumed general free/asset license. Review independently with rights holder before any asset reuse. Generic cartographic ideas (room footprint, layered empty/dressed variant, walkway readability) are not reproducing his art.

## 2. Proven underlying failure: text-to-image is performing unapproved geometry generation

Four independent architectural variables are being inferred at once: physical size/token density, room/portal perimeter, interior fixture placements, and desired rendered style. Compositional text and broad genre prompts encourage the renderer to invent exterior corners/adjacent rooms, misplace north/west/east boundaries, add visual prop/light content and tilt/cutaway walls. Inclusion-only prompt hygiene is necessary but **not sufficient** to hold invariant geometry.

**Scale hard fact:** Approved current BWE-027 labels Great Room `14×16 ft`, Foyer `6×6 ft`, Family Area `14×8 ft`. Great Room contains only `(14/5)*(16/5)=8.96` nominal 5×5-foot token cells before a full main staircase, hearth, grandfather clock, sofas, table, blueprint table, 027 lockbox and four horizontal exits. That footprint cannot be the desired grand navigable room in an ordinary battlemap at actual 5ft creature footprints. Changing pixel resolution, grid size alone or token-art scale ratio cannot create physical movement room in Foundry. Current approved survey therefore **needs an owner-reviewed coherent physical scale revision** or another explicit gameplay abstraction. **Do not silently stretch just the Great Room while leaving adjoining rooms at original physical sizes.**

**Potential rescale study, not canon:** A Great Room 30×35ft has 42 nominal 5ft spaces; a 35×40ft Great Room has 56. Both are substantial improvements over ~9. A global proportional house rescale would also impact the Foyer and rear family/door anchors; approved Foyer **art** can remain byte-identical while its actual grid units/door width require a separate Foundry calibration proof. A proportional scale factor 2–2.5 applied to BWE-027 is a candidate to examine, **not a completed blueprint decision**. Derive actual recommended dimensions from furniture footprints, token clearance and neighbor-level layout graph first.

## 3. Recommended technical refinements — separate evidence grade

### A — Adopt for campaign PREPARE as a proposed requirement
1. `SEMANTIC ROOM RECORD`: immutable ID, accepted visual identity, room polygon in **real ft**, N/S/E/W portals to exact neighbors, internal vertical stairs, interaction target list, blocked/conditional gates, required free paths for Medium tokens. Geometry can be owner-updated coherently; source provenance retained.
2. `DETERMINISTIC GRAYBOX`: generate flat orthographic structural vector/raster from room polygon and door/wall line segments (e.g. SVG, Python drawing, Dungeondraft/export); physically show stairs and fixture footprints in their future pixel positions. Use exact 5ft creature token silhouettes for clearance. **Structural veto BEFORE generative art**.
3. `PAINTING/ASSET LAYERS`: hold walls, floors, stairs, door openings and critical fixtures as immutable geometry (vector/raster); use AI *only* to generate material textures, overhead furniture/decoration stamps and atmosphere on isolated layers. If the chosen image model has robust direct reference/control, benchmark it against the graybox; otherwise combine assets deterministically over the locked background. Do not expect a freeform image model to recreate topology. This is the core improvement beyond prompt wording.
4. `INCLUSION-ONLY GENERATION`: keep complete audit with forbidden elements separate from renderer-facing *positive-only* image text. Each noun must be wanted visibly. Never reference a previously REDO prompt/image on retries. A tool that internally infers the prompt from entire conversation may not guarantee strict prompt isolation: record uncertainty, and prefer geometry locking/deterministic composition.
5. `VERIFY WITH TWO GATES`: automated structural diff on source geometry/door anchors/collision plus human painterly/pass-story inspection. Only then official visual approval. Actual Foundry Build/RegionWall verification remains separate.

### B — Optional experiments requiring owner-directed exploration
- **Local ComfyUI/Stable Diffusion ControlNet Canny or Lineart** using accepted structural raster, image-to-image style conversion, followed by per-furniture localized repairs; compare true wall/door drift to code-based layering. Independent tool setup/rights are unresolved; do not assert installed access.
- **Dungeondraft/Inkarnate base + top-down generated individual assets**, stacked externally using real coordinates, as source-quality path. Check technical export/tool/API availability separately before a development commitment.
- **No-AI structural/environment map variant** using custom drawn original tiles and hand-picked permitted texture packs when maximum geometry stability is more valuable than style novelty. Separate what is canonical vs illustration.

## 4. Proposed pilot and metrics

**One Great Room pilot**, with the first deliverable a readable graybox not another freeform picture:
- Owner confirms/adjusts a *coherent physically larger house blueprint* or authorizes a quantified scaling exception for scene-level Foundry display.
- Compose at least two structural study candidate sizes `30×35` and `35×40 ft` solely to show token circulation with five independent exits/portals (S Foyer, W Dining, E locked Study, N Family Room, upper east staircase) and accessible Hearth/Clock/Blueprint/027 anchors.
- Acceptance metric: **5 of 5 transitions valid; 4 of 4 required story fixture anchors separately visible and reachable; at least 5ft footpath continuity around major furnishing**; extra allowance where stair/large tokens require. True orthographic, thin representative wall caps. No extra map surroundings as a painted destination. Test at canonical 120px per logical 5ft, gridless output.
- Human confirms *geometry first* before any AI styling. Pilot image renderer must be compared against structural source; structural mismatch is REDO regardless of beauty.
- Preserve approved Foyer exact art and every existing outside/estate scene until reinterpreted scale proved safe. The failed Great Room attempt cannot enter approved ZIP.
- Chronology: planning research today, design/prototype only upon subsequent user instruction; no production product workflow changes claimed.

## 5. Workflow decision record

Research supports moving from *text-only image generation* to **measured blueprint → structured layout → immutable geometric layers → optional constrained illustration → gameplay validation**. It **does not** prove a particular ControlNet checkpoint or image provider will solve Dicebox geometry reliably. Adopt refinements at the owner's direction; existing global workflow remains authoritative. No further Great Room RENDER authorized by this research-only request.
