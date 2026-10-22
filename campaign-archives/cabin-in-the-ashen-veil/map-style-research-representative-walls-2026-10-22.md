# Cabin in the Ashen Veil — Map Style Research: Representative Walls

**2026-10-22. Scope:** Owner-requested read-only community/art-style investigation and campaign-specific render correction. **NOT** a rendered/approved map, a promotion into global Dicebox SOP, or a claim of Foundry wall tests.

## Feedback and artifact state

Owner rejected Foyer/Studio examples as incorrect tabletop painterly style, supplied **Overgrown Forest Shrine Clearing.png** as the visual reference, and recalled established rule **“walls are representative.”** Treat previously generated Foyer/Studio image attempts as **rejected style candidates**, not style references or accepted map art; preserve history/provenance and apply the original locked Dicebox prompt **clean restart** for any later attempt. Do **not** pass a rejected image/prompt as reference to generate its own redo.

## Established internal evidence checked

1. `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`: fixed 90-degree overhead, architectural openings traceable, walls physical/recognizable with top planes/bevel/ambient occlusion rather than perspective, semantic wall geometry reconciled with blueprint, painterly live art separate from mechanical Foundry wall segments.
2. `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`: gridless art and authoritative scale; image and token/Foundry Walls occupy distinct concerns.
3. Google Docs: **Map Injector Workflow** (Drive document `11VZKVk3_mGvXkxKRU0C9VP5dor6e2KRVPblMuKNkywU`) reiterates grayscale structural, inspect, manifest and painted presentation, and warns against inventing wall geometry from finished artwork.
4. Google Docs: **Dice Box Campaign Helper — Ideas & Architecture** (Drive document `14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o`) specifies *semantic scene → geometry/relationships → validated structural render → constrained art*, explicit room polygon/Wall coordinates, "representative benchmark" battlemaps as clearly legible top-down tactical art with consistent wall thickness and openings rather than pretty uncontrolled image output.
5. **Owner visual reference**: Overgrown Forest Shrine Clearing.png, top-down richly detailed painterly floor/ground textures, recognizable stone rings/paths with no dollhouse cutaway. The external shrine example is a **style and illustration clarity reference, not the room geometry source**. Scale and interior architectural wall visualization need a distinct controlled proof.

## External Reddit/community material (illustrative, not binding policy)

- [Battlemap creation GPT discussion (r/ChatGPTPro, 2023)](https://www.reddit.com/r/ChatGPTPro/comments/17s96cv): users reported AI map perspective drift to isometric/non-overhead and exchanged more explicit strict flat-top-down generation instructions.
- [Foundry auto-Wall proposal (r/FoundryVTT, 2023)](https://www.reddit.com/r/FoundryVTT/comments/11ympsj): designers distinguish base map art and separate Wall placement, with mask/floor-color discussions for generating consistent wall data.
- [AI autowaller discussion (r/FoundryVTT, 2024)](https://www.reddit.com/r/FoundryVTT/comments/1dahgze): interest in automating logical wall/door recognition and auditing them for tabletop play.
- [Stage-wall copy discussion (r/FoundryVTT, 2021)](https://www.reddit.com/r/FoundryVTT/comments/o58k7e): users manage physical walls separately across alternate art states.
These support *architecture first / mechanics separate / overhead view*, but **do not explicitly establish the phrase “walls are representative” as a sourced community standard**. Treat that wording as the owner's recollection/design intent requiring specification, not as a Reddit quotation.

## Proposed enforceable interpretation — awaits next map proof

**Representative walls = illustrated symbolic footprint of architecture, not literal vertical elevations or dollhouse cutaways.** The artwork should show **short, consistent-width top-facing wall/cap bands** (timber/stone, shallow beveled edge and minimal neutral shadow) enclosing the room polygon. They represent the presence/material/thickness/door openings of a real tall building wall from a plan-view perspective, but **do not paint the whole vertical wall height as a facade**, do not tilt camera, do not put three-quarter interior elevations blocking floor or portable items. Mechanical movement/vision remains owned by Foundry Walls drawn from semantic BP-1 geometry, not from the representative pixel strip.

**Owner's reference image style transferred to interiors:** painterly, tactically clear, restrained ornamental density, legible story objects, neutral diffuse base light for Foundry's ambient/point lights, tiny neutral grounding shadows only, organic material detail and seamless top-down ground-plane perspective.

**Technical map-first hard gates:**
- All door openings match master BP-1 portal anchors, no surprise exit or phantom arch.
- Representative wall cap remains narrow and visually consistent, not 3D full-height timber-and-plaster cutaway.
- Architecturally meaningful thick/secret wall section suggested by cap footprint only, not by revealed secret rooms.
- Each map includes adequate *walkable negative space* so tokens can reach main fixtures. Object scale legible at tabletop zoom.
- Portables and stage-dependent components remain separate visible placeables, not painted permanent loot.
- Neutral diffuse lighting only, with all glow/shadow atmosphere and Crimson Veil controlled through Foundry.
- Final image need not reproduce materials/decoration precisely if routes/story/physics consistent; true perspective misclassification or door mismatch is hard REDO.

## Recommended next step

**Do not rerender the entire batch immediately.** Run exactly one new **layout-first wall grammar test** for the Foyer using original accepted BP-1/semantic graybox + supplied positive owner shrine style reference; exclude failed Foyer/Studio result and prompts. Evaluate against representative-wall cap, four opening anchors, upstairs vs down stairs, large grandfather clock, positive floor space and neutral illumination. No claimed approval until owner or inspector confirms it matches style. Only then use as accepted **positive** house look reference for the remaining maps.

**Prompt clean-restart constraint:** A genuinely new independently composed prompt from blueprint, positive original owner visual, and present style contract—not a "correct the old map" inpaint/edit. Failed image and failed prompt are preserved as historical evidence only.
