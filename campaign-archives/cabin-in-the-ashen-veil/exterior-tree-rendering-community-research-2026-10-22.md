# Cabin in the Ashen Veil — External Research: True-Overhead Forest Trees for AI Battlemaps

**Date:** 2026-10-22  
**Status:** RESEARCH / PROPOSED SCENE-SPECIFIC REFINEMENT, NOT AN ADOPTED GLOBAL RULE OR RENDER RECEIPT.  
**Trigger:** Owner approved the atmospheric direction of a bleak late-fall/early-winter Carriage Yard candidate, but observed that **strict top-down representation of the trees failed**. Owner requested research on how community members create tabletop battlemaps with ChatGPT.

## 1. Observation and problem

The latest exterior concept improves seasonal horror atmosphere but much of the woodland border reads as dense lateral bare-branch tangles, rather than distinct plan-view trees with understandable ground position and canopy overhead. Simply repeating “top down” for every object is not sufficient to guarantee tree-specific geometry. Treat **architecture projection** and **vegetation projection** as separate inspector checks. Preserve the owner's accepted seasonal palette and layout while addressing the tree silhouette failure.

The most important discovery: **a tree's navigable trunk and its overhead canopy are distinct visual and mechanical surfaces**, just as roof tiles and buildings have different representations in Foundry. This is useful for AI input designs as well as Foundry implementation.

## 2. Relevant external evidence

- **AI battlemap community, April 2026**: [Does anyone use AI for their topdown maps?](https://www.reddit.com/r/dndai/comments/1sgtqgv/does_anyone_use_ai_for_their_topdown_maps/). Creators report perspective/elevation drift; some improve layout fidelity by providing a simple composition sketch alongside detailed positive guidance. Others prefer AI scenery backgrounds plus manually controlled assets rather than demanding exact geometry and art from one unconstrained generation. These are individual anecdotes, not reproducible benchmarks.
- **Midjourney workflow with ChatGPT prompts, January 2024**: [Style tuner battlemaps](https://www.reddit.com/r/dndai/comments/1achukj). Artist uses an established top-down battlemap style selection and reuses it across new images. For Dicebox, the equivalent input is the owner-approved **original positive** shrine style reference, not a rejected sample/prompt.
- **Top-down tree visuals, September 2026**: [Which VTT Tree do you prefer?](https://www.reddit.com/r/battlemaps/comments/1wou8rz/which_vtt_tree_do_you_prefer/). Discussion favors some combination of visible trunk and translucent canopy or canopy shadow for tactical usability. Subjective votes and comments do not establish a universal standard.
- **Tree placement in Foundry, August 2024**: [What are the easiest ways to do overhead trees?](https://www.reddit.com/r/FoundryVTT/comments/1ehvhfe). Community describes a ground trunk footprint and individually controlled overhead tree tiles, with fading/occlusion while characters are beneath them.
- **2026 Foundry tile discussion**: [Using tile occlusion for trees causes hidden tokens](https://www.reddit.com/r/FoundryVTT/comments/1rntt02/using_tile_occlusion_for_trees_causes_hidden/) and [How do you deal with trees?](https://www.reddit.com/r/FoundryVTT/comments/1w9olwm/how_do_you_deal_with_trees/). Practical issues include hard-to-read cover/vision, unwanted opacity hiding tokens, and the cost of per-tree placeables.
- **Official Foundry documentation, updated 2026-09-22 v14.368**: [Tiles](https://foundryvtt.com/article/tiles/) confirms Overhead Tiles and occlusion modes `Fade`, `Surface`, `Radial`, `Vision`. [Canvas Layers](https://foundryvtt.com/article/canvas-layers/) explicitly identifies overhead tree crowns as appropriate overhead art. This is **capability documentation**, not a tested Dicebox injector receipt or claim that any specific runtime behavior was successfully automated.
- **Visual reference examples (style illustrations only, not authorized new campaign art inputs)**: [Tom Cartos winter path](https://www.tomcartos.com/into-the-wilds-winter) makes tree crown/ground distinctions with overhead footprints; [DUNGEONFOG dark forest](https://www.dungeonfog.com/hub/u/0f29f4fbdd172eeb1a87f0a451983509/m/b3ab84760828ec417231ae383561e780) uses gnarled bare-branch radial ground coverage; [The MAD Cartographer frozen forest](https://themad.network/tmcgallery/frozen2) mixes naked broadleaf crowns and evergreens.

## 3. Proposed Dicebox forest-tree treatment (not yet global)

1. **Deterministic tree registry** in the scene's feature manifest: each playable obstacle tree has stable ID, center coordinate, approximate trunk collision footprint, canopy footprint, and placement category. Broad background clusters can be decor-only. Do not infer collision from generated forest pixels.
2. **Background base** contains cabin, path/yard/pond edge geometry, ground scatter, exposed roots, accurate trunk bases or small stump-like trunk footprints, shallow ambient grounding shadow, leaf litter and low shrubs. Render in true 90° plan-view.
3. **Above-token crown layer** as optional transparent overhead tree sprites (owner-approved original style), especially where player tokens are expected to enter beneath a forest edge. For a small tree count, per-tree overhead tile may fade with token presence; for dense perimeter trees, grouped static canopy on image is cheaper if no tokens can access it. Use actual Foundry occlusion and dedicated Wall/LOS semantics only after module/workflow verification.
4. **Tree type treatment** for late autumn / early winter: a controlled mixture of sparse deciduous crowns drawn as circular/radially branching crowns around a visible trunk center and a smaller population of volumetric evergreens. Include copper-brown residual leaf clusters, damp ground, leaf litter, light frost patches where seasonal staging warrants; paint diffuse neutral even illumination so live Foundry lighting controls mood.
5. **Scene first, trees second**: produce the deterministic site control; generate the painterly ground using only **affirmative visible ingredients**; bring in approved crown assets/controlled vegetation as a separate illustrated layer. This can prevent the generative provider from independently redesigning tree trunk geometry and fully enclosed woodland boundaries.

**Positive-only image prompt example (standalone, never incrementally edited from a failed prompt):**

> Directly overhead hand-painted fantasy tactical battlemap of a cold late-autumn woodland courtyard, northern stone-and-timber house roof with south-facing entrance porch, broad muddy circular carriage turning ground, southwest wooden carriage, southern wagon road, clear woodland trails, eastern narrow pond bank and pier. Along the forest boundary, distinct mature deciduous trees with centrally visible round trunk roots and radial skeletal branching crowns, scattered clusters of muted rust-colored remaining leaves, individual dark evergreen crowns with recognizable circular plan-view silhouettes, mossy stones, damp fallen leaves and ground ferns. Fine illustrative brushwork, readable walkable spaces, even cool diffuse natural illumination, carefully registered architectural and vegetation positions.

**Proposed preflight/FINAL_INSPECT tree-specific checks:**
- At least 5 representative trees around the border must have an identifiable **top-down crown center** and independent base footprint.
- Trunks/crown silhouettes must line up with accepted structural tree semantic IDs within tolerances that affect traversal and cover.
- Forest edge/branchwork must not swallow key navigation portals, carriage, porch, pond landing or player-token space.
- A winter tree visually reads as an overhead tree, **not only** a side-reaching branch silhouette or ground-hugging roots.
- Site art stays 90° overhead and retains the owner-approved late-fall gloom **through palette and materials**, with dynamic gloom effects managed by Foundry.
- Overhead sprite assets, alpha masks, lighting and collision/vision tests remain `UNVERIFIED` pending the established BUILD and live tester gates.

## 4. Project policy and provenance boundary

This research proposes an **additional explicit vegetation perspective inspection**, but it does **not** modify or override the 2026-10-22 global standard without owner adoption. The global rules already require strict 90° overhead, positive-only prompts, independent new wording per attempt, neutral painted illumination and no rejected image used as a reference. Failed source images/prompts are only evidence of a past failure. A new attempt should reference canonical **positive shrine image** if provided/usable through supported creative workflow, and deterministic control source, never the rejected map. The full exterior art remains not production-approved until a new independently inspected output passes.

**No new images, code, Foundry scene, module installation, or product database changes were performed by this research note.**
