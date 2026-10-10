# M02 Attempt #005 — Partial Runtime Success & Alignment Defect Receipt

**Event date:** 2026-10-10 (reported during user-led Foundry test; exact Foundry receipt timestamp not provided)  
**Captured:** 2026-10-10  
**Event ID:** R-2026-10-10-M02-PARTIAL-INJECTION-ALIGNMENT-001  
**Status:** PARTIAL_SUCCESS / GEOMETRY_ALIGNMENT_FAILED / MANUAL_REPAIR_IN_PROGRESS  
**Evidence layer:** user-provided Foundry console and screenshot, **not** independent authoritative runtime reread.

## Provenance

- Repo: `Dicebox20/dicebox-campaign-helper`; work branch `maps/btr-m02-tallcap-forest-prepare-20261009`.
- Scene semantic ID `btr-expedition-m02-tallcap-forest`; scene name `M02 — Tallcap Forest`.
- Approved original grayscale PNG SHA-256 `878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`.
- Approved dark painterly PNG SHA-256 `c9ed3fd61af2db629beef5e2d771eb2c7abce86324283a02614dfec7e1bc72aa`.
- Derived embedded WebP SHA-256 `09cea16c5b14c9d83e062ee6783d4dd08f45154cd1a5aff67ee3fdb70f76ae87` (lossy derivative; not equal to PNG source hash).
- Embedded-art macro BUILD v003, followed by Foundry paste fix v004 and M02 Attempt #005 Repair Macro v001. The latter was reported by user successful for background binding. Historical scripts must be retained unchanged.
- Foundry version previously reported `14.367`, dnd5e `5.3.3`; actual runtime version at this specific screenshot **not independently re-read**.
- Source v003 candidate geometry: 203 Walls, six Regions, six anchor metadata entries, one intended default-floor Level. Scene target 4320×2880 pixels, 36×24 five-foot cells, 120px per five feet, gridless.
- Uploaded console evidence (prior user message) confirmed asset saved at `worlds/the-forgotten-realms/assets/m02-tallcap-forest-attempt005-09cea16c5b14.webp`; subsequent screenshot supplied by user shows background rendered and many yellow Foundry Wall traces/vertices displaced from artwork.

## Observed successes

1. Embedded WebP decoded/transmitted and saved without prompting for a separate file; asset path logged successfully.
2. Foundry progressed past Scene, Wall and Region document creation and into readback (creation receipt listed three stages). **Actual counts not independently reread in this turn**; 203/6 are expected source counts, not asserted runtime totals.
3. User stated the repair macro was successful and screenshot shows the dark painterly map visible in Foundry.
4. One self-contained Markdown macro artifact used for main injection; repair required afterward because v004 readback checked deprecated `Scene.background` path.

## Observed defect and uncertainty

**Confirmed visual defect:** The rendered image and the yellow Wall contours are dramatically misaligned in the user screenshot. Numerous cliff and mushroom/stalagmite Wall shapes lie above or left of the drawn map. The image occupies a displaced region of the view while some Wall coordinates appear referenced to a larger/different origin. This is a **real usability failure**, regardless of the successful asset upload and appearance of the background.

**Unproven explanation:** Level-background offsets or texture transforms, scene padding, scene/canvas origin, alternate coordinate frame, or mistaken source→scene mapping may be involved. Do **not** assign a root cause or automatically rescale/translate 203 Walls based on screenshot alone. The user notes that similar misalignment occurred historically, potentially independently of the repair macro. Do not claim the repair caused this.

A screenshot is sufficient to flag a defect, but not to certify scene dimensions, Wall count, Region count, official Level configuration, actual token movement/vision, or exact background translation/scale. `fish.svg` 404 and deprecated FilePicker warning are separate noncausal observations. The previous runtime error `Post-injection background src mismatch` originated in legacy scene readback and motivated the successful repair.

## Disposition / acceptance boundary

- **Scene:** `PARTIAL_SUCCESS`; image present, geometry not correctly aligned. **NOT VERIFIED, NOT COMPLETE.**
- **Immediate owner:** GM/user will repair alignment manually in Foundry. Do not run more repair/injection macros or override manual work unless newly authorized. User will work off the record after this checkpoint.
- **Safety:** No live Foundry mutations were performed by this cataloguing operation. Existing Scene and history must be preserved; do not silently re-inject, delete walls or change backgrounds.
- **Outstanding evidence:** Authoritative after-manual-fix readback of Scene/Level background transform, pixels and orientation, 203 managed Wall IDs and coordinates, six Region shapes and their alignment, token clearance/LOS, target asset hash/URL, and scene runtime version. Future historical-comparison research: successful original Injector macros vs current compression, reconstruction, asset binding, scene origin, Level handling, Wall/Region projection and verification.
- **Next action:** Wait for user-directed off-record investigation/manual adjustment. Any later claim of completion requires fresh runtime verification and a new dated receipt; this historical partial-success record remains immutable.
