# H-U07 Dahlia Art Studio — V013 single new render, same-turn FINAL INSPECT FAIL

**Date:** 2026-10-24, Pacific. **Campaign:** Cabin in the Ashen Veil.  
**Status:** `ASSISTANT_FINAL_ART_FAIL / NOT_APPROVED / NOT_INSTALLED`. This work unit generated **exactly one** newly prompted image, and completed inspection in the **same turn**. No Foundry VTT scene/asset/document was mutated.

## PREPARE and scene story-continuity authority
- Before this render, re-read [H-U07 current PREPARE](../prepares/h-u07-dahlia-art-studio-current-owner-pre-render-v1-2026-10-23.md), current [geometry guide](../render-guides/h-u07-upper-studio-geometry-anchor-v001.json) and [approved fifty-year-aged H-G06 visual style](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md).
- **Canonical topology:** H-U07 upstairs; ordinary **WEST** entry from H-U02 Upper Landing; **SOUTH** wall continuous; **EAST** wall conceals physically separate H-U08 Candle Workshop pending Prayer of Protection; no initial open east route.
- **Puzzle fixture contracts:** NW vanity with VACANT Ornate Mirror mount awaiting item from Pond, NE legible framed painting of small chest marked **027** (H-G06 lockbox clue), independent east-wall Sune rose shrine with Prayer of Protection and Prayer of Devotion as separate interactions, artist's work furnishings. No state-dependent rewards prematurely visible.
- **Hard art standards:** True 50 years uninhabited, visibly pervasive long-settled grime, rot, faded/frayed material, dead plants and accumulated debris, and even neutral ambient lighting comparable to owner-approved H-G06 Great Room. Basement visual exception unchanged.

## Independent prompt, one generated image and exact art provenance
- Newly authored affirmative-only prompt saved at [V013 PREPARE-reviewed prompt](../render-prompts/h-u07-fresh-prepare-reviewed-v013-2026-10-24.md), commit `eca0a7a0e7f91f402e4136ad1c1997721058cd3f`.
- Original ImageGen generation ID: `5fb07486-4db1-453b-bac5-da8f75ac6738`; tool reported `edit_op:null`, `parent_gen_id:null`. This was a new generation rather than a masked pixel-exact modification of prior art.
- Local source: `/mnt/data/isometric_top_down_interior_scene_of_an_old_aband.png`. **1536×1024** pixels, RGB PNG; **2,941,896 bytes**; SHA-256 `08b2dd755de5857e36ef609b5c21e4f1849c4c36dae98ee5e4bf0f22373cdaa3` verified by local disk/Pillow/Python hash readback.
- **Unapproved exact PNG in owner's connected private Drive:** [H-U07 V013 FINAL FAIL](https://drive.google.com/file/d/1mi2p1ptmL-4R2FbkHeuEE1pnTea8Ugzo/view?usp=drivesdk), parent folder `1ganNpKYPh53_OgEV9jOU-iMfjgovXpo8`. Independent Drive metadata readback matched 2,941,896 bytes, `image/png`, exact parent folder.
- Only **one ImageGen call** was made; no same-turn retry.

## Same-turn actual visual INSPECT — owner's delegated FINAL art decision

| Binding visual gate | Result | Visible evidence |
|---|---|---|
| WEST ordinary doorway | **PASS** | Open wood door and left-exterior flagstone approach in mid-left wall |
| EAST wall conceals workshop | **PASS** | Full eastern perimeter behind shelving and small right-side furniture |
| SOUTH wall continuous | **FAIL** | Large unintended opening at bottom-center edge, with exterior white stone threshold |
| NW vanity VACANT mirror mount | **FAIL** | An intact dark reflective oval mirror remains in gilt surround |
| NE framed small chest portrait with `027` clue | **FAIL** | Multiple framed landscapes and floral art, but no readable miniature chest with 027 |
| East distinct Sune rose shrine | **FAIL** | Right-side art, shelves, drawing desk and sculpture; no recognizable separate devotional rose altar |
| 50 years abandoned, match approved H-G06 age | **FAIL** | Dust, some webs and accumulated leaf clusters exist, but pristine/unfrayed main furniture and wall materials dilute the required half-century deterioration |
| Even neutral baked ambient lighting | **FAIL** | Stronger bright localized window streaks across top floor than owner H-G06 style; some warm highlight bias |
| Single flat overhead functional battlemap | **PASS** | Complete single-room map with walkable central floor and visible artist's easel; not a certifiable gameplay Scene |

**FINAL AUTHORITATIVE VISUAL VERDICT: FAIL**, because a mandatory portal, all three critical puzzle fixtures and lighting/age quality gates were missed. No map art is approved, no Foundry installation authorized, and H-U07 remains one of the 26 missing target art maps; campaign total unchanged at 19/45 base target images accepted plus separately accepted EXT-TRAIL.

## Exact next bounded continuation (after new independent Codex/user turn)
1. Read the newest room PREPARE and geometry guide again. Treat this render as rejected artwork, not an editable authoritative image or reusable old prompt.
2. Form one completely **new**, self-contained **positive-only** image-provider prompt. The exact owner-approved aged H-G06 image is mandatory reference for aged textures and neutral lighting, while the current near-pass may offer ONLY furniture layout/left-entry aesthetic cues, and is never architecture authority.
3. Emphasize the visual fact that the lower edge is a **single solid wall with full-width capped masonry and continuous cabinetry**, and independently large recognizable east Sune shrine and north-eastern `027` chest portrait, plus an obviously VACANT velvet-backed mirror fixture. Keep west entry as an actual gap in the left wall.
4. Run **ONE image generation maximum in that next distinct turn**, INSPECT that exact image **in the same turn**, and save PASS/FAIL with exact source and owner-canon gate. Never run a second visual generation in the same turn. Do not install FAIL art.
5. Alternative future workflow refinement: prebuild immutable physical geometry or controlled structural mask and author an appropriate texture-only render to reduce the repeated south-opening error; this must still respect fresh prompt, one render, and same-turn inspection.

**Player gameplay side note:** H-G06 fireplace test script native GM handler passed three item/lighting branches previously with rollback, but non-GM player click/socket canary remains outstanding; no impact this art-only turn.
