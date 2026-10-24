# H-U07 Dahlia's Art Studio — deterministic compositing, RENDER + INSPECT receipt

**Date:** 2026-10-24 (America/Los_Angeles)
**Execution authority:** Owner-delegated assistant final image PASS/FAIL, within the campaign's single-turn RENDER+INSPECT and 20-minute bounded work unit.
**Final verdict for this turn:** **FAIL**. The art remains UNAPPROVED, and **NO Foundry Scene, Level, Wall, Region, Light, Item, Journal or other world document was changed** by this compositing task.

## Baseline / canonical requirements

This continuation used the approved [H-G06 50-year-abandoned interior visual precedent](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md), [current owner-canon H-U07 PREPARE](../prepares/h-u07-dahlia-art-studio-current-owner-pre-render-v1-2026-10-23.md), [H-U07 vector/JSON geometry anchor](../render-guides/h-u07-upper-studio-geometry-anchor-v001.json), and previous [failures 1–5](./h-u07-assistant-final-gate-candidates4-5-2026-10-24.md).

Hard gates: H-U07 upstairs Studio's only ordinary doorway is on the **west wall** to H-U02 Landing; **south and east boundary walls continue uninterrupted**. H-U08 Candle Workshop remains hidden beyond the east boundary until Prayer of Protection. The Studio has **no interior stairs**. Distinct NW vanity with empty Ornate Mirror fitting; northeast framed portrait of a chest with **027** clue; separate private Sune devotional altar; central art supplies/easel. Weathered house material, fifty years uninhabited, neutral baked lighting. No premature reveal of Mirror keys, prayer rewards, Wick or other pickups.

## Controlled source and rendering technique

- Reused as visual texture input a versioned prior *failed* painterly Studio candidate `a_detailed_high_resolution_isometric_top_down_i.png` (generation `756f1df9-fb0c-4f41-b8c1-b24758a416e3`), because it already contained a **left/west opening** even while also containing an illicit SOUTH doorway and southeastern stairs.
- Additional age/material donor: exact owner-approved H-G06 PNG `h-g06-great-room-aged-50-years-owner-approved-2026-10-23.png`.
- Three deterministic Python/Pillow/OpenCV compositions under `/mnt/data/h_u07_compose_v001.py`, `v002.py`, and `v003.py` in this execution environment. Main edits: replaced staircase/banisters with aged herringbone wood flooring, reconstructed the south-wall facade from an uninterrupted donor masonry segment, repainted the original vanity mirror interior as an empty fitting, created explicit chest-portrait 027 detail and rose rosette on an east-wall furnishings/shrine location, muted overly warm lighting.
- These were true code-layer composites of identified source pixels, **not** completed ImageGen edits, native Foundry macro actions or pixel-exact unchanged room re-renders.

## Exact candidate artifact provenance / same-turn final INSPECT

| Candidate | SHA-256 | File dimensions / size | Archived exact PNG | Visual result |
|---|---|---|---|---|
| v001 | `b9715a1456c479f3847ed8812f0ec228a61f1685c2f971cbb17bef7c2b6b76e7` | 1536×1024 / 2,580,310 bytes | [private Drive v001](https://drive.google.com/file/d/1rWHAbacwkI-8npYkQN-YQ0ZMYGEVL6_D/view?usp=drivesdk) | **FAIL**: glaring pasted vector fixture panels, visible floor seams |
| v002 | `0584583522581ba6a2ae5ee890131e052db092c17662e5a223edff0ffddf4ef6` | 1536×1024 / 2,637,203 bytes | [private Drive v002](https://drive.google.com/file/d/1NC5ZL_toE1amE8zrjogCA-YrfCu7laeU/view?usp=drivesdk) | **FAIL**: portrait/shrine better but major masonry/floor seams and mirror/clock mistake |
| v003 | `5c016aec36f6a5ece0322777b1d1825c72679c1e954a039063f1ae61c6c662e5` | 1536×1024 / 2,569,206 bytes | [private Drive v003](https://drive.google.com/file/d/10dzDZoSPXVVfU-IMDq9YiKCN6TORdZd-/view?usp=drivesdk) | **FAIL**: west entry and sealed south wall broadly retained; unnatural facade ghosting, floor replacement edges, chest-clue frame and Sune altar visual mismatch, empty-mirror plaster mismatch and warm baked lighting |

Each file is stored in the owner-connected private [unapproved map render folder](https://drive.google.com/drive/folders/1ganNpKYPh53_OgEV9jOU-iMfjgovXpo8), with provider metadata readback confirming exact byte count and parent. The same-turn human-vision inspection checked v001, v002 and v003. A machine-readable JSON receipt was saved locally as `cav_h_u07_composite_final_inspect_fail_20261024.json`.

## Functional/canon findings

- **Improved architectural direction:** With deterministic compositing the west doorway can remain, and the south opening/staircase can be replaced without generating new architecture. This is a meaningful improvement over repeated painterly free-form prompt failures.
- **Not sufficient for acceptance:** The final artwork's south facade still shows donor-wall seams/ghost supports. Southeast replacement floor visibly differs in grain/lighting and reveals blending artifacts. The vanity's empty mirror still looks like an unnatural dark aperture. The hand-added 027 portrait and Sune emblem are too collage-like to meet the accepted H-G06 material standard; warm baked window/candle glows remain stronger than desired.
- **Source of truth remains the approved geometry guide**, not any generated/modified image. The assistant's final explicit FAIL carries the owner's delegated authorization status and **forbids installation** of any v001–v003 composite.

## Next bounded unit (roadmap pointer)

**Do not repeat another free-form full-room generation or admit a marginal composite to Foundry.** Construct a true multi-layer scene from the geometry guide, where boundary walls and the west opening are immutable masks, flooring has one continuous high-resolution texture field, and quest fixtures are extracted/painted as separate properly blended alpha-layer objects. Reserve time in that same ≤20-minute work turn for immediate actual-pixel INSPECT and write a PASS/FAIL evidence receipt. If a genuine *same-source masked inpaint* edit operation becomes available, apply it only inside material/fixture masks rather than re-generating topology. A PASS may advance to source checksum + native Foundry asset installation with existing walls/regions preserved; FAIL requires further refinement.

Other work: the prior H-G06 fireplace GM-handler Tinderbox/light 3-case canary passed with restoration; **genuine non-GM player-click/socket canary still outstanding**. Campaign map count remains **19 approved target base maps of 45 plus one extra trail Scene**, and H-U07 is **unapproved/uninstalled**.

**Bridge relay note:** This bounded work unit was initiated by the correlated Codex return leg that explicitly says *“This is the return leg. Do not call bridge tools or relay this response again.”* Therefore, no further bridge send is authorized within this exact correlated return turn; preserve the work checkpoint for the next lawful continuation.
