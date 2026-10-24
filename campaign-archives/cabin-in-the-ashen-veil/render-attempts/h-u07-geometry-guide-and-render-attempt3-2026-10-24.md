# H-U07 Art Studio — geometry-first work unit and failed painted candidate 3

**Date:** 2026-10-24, America/Los_Angeles  
**Scope:** Cabin in the Ashen Veil, H-U07 Dahlia's **upper-floor** Art Studio only  
**Work-turn policy:** 20-minute maximum; finish with an authoritative saved recovery pointer  
**Status:** **STRUCTURAL GUIDE CREATED; PAINTED CANDIDATE REJECTED BY ASSISTANT PRE-INSPECTION; OWNER ART APPROVAL PENDING**  
**Foundry effect:** **NONE**. No Scene, Wall, Light, Region, Item, Token or Journal changes in this bounded unit.

## Canon-reconciled render guide (new durable output)

- Machine-readable guide: [H-U07 geometry anchor JSON](../render-guides/h-u07-upper-studio-geometry-anchor-v001.json).
- Editable vector guide: [H-U07 geometry anchor SVG](../render-guides/h-u07-upper-studio-geometry-anchor-v001.svg).
- Visually reviewed PNG guide: [H-U07 geometry anchor PNG, private connected Drive](https://drive.google.com/file/d/1eVcLw6pVPvMlOU18VLmkr_PwAdaBq6Fg/view?usp=drivesdk). SHA-256 `7a3d5d150f203e0ab84fd3fab1128e0640b2cc3e0650e391731916257905dd11`, **62,894 bytes**, `1536 × 1024`. Drive metadata readback verified exact stored size/mime and destination parent.
- Guide built in image coordinates only (no measured House V2 global feet or Foundry pixel/Wall geometry). The guide enforces **one WEST/left-wall middle doorway** to `H-U02` and **continuous NORTH, SOUTH, and EAST walls**. Upper east Studio's eastern wall adjoins the concealed separate `H-U08` Candle Workshop, initially disguised as ordinary room architecture.
- Separate fixtures have named semantic anchors: **NW vanity with an EMPTY Ornate Mirror fitting**, **NE framed `027` chest clue**, **east-wall private Sune shrine**, central painting worktable, SW easel. Door clearances and player approach lanes are intentionally visible.
- Canon: latest [H-U07 PREPARE](../prepares/h-u07-dahlia-art-studio-current-owner-pre-render-v1-2026-10-23.md) and [owner visual reference](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md). Basement art exemption unchanged. Fixture states, rewards and workshop are never permanently pre-revealed.

## Image generation attempt 3, immediately inspected as candidate only

- Source image generation ID: `044cd057-b611-4b39-a967-f68af16ef20b`.
- Exact PNG: `1536 × 1024`, **2,696,718 bytes**, SHA-256 `7b401a361caec4efbcc32406033fa1d87833bef69236b8532bbf8ef3738d8915`.
- Private archival copy: [H-U07 rejected candidate 3](https://drive.google.com/file/d/1SnbE63Yj9-hNM0HJZ_bxCqYH1SXi7wCx/view?usp=drivesdk). Separate authenticated Drive metadata readback confirmed its size/mime/parent.
- **Structural FAIL**, not owner-approved: image again contains an unintended **SOUTH doorway** and **southeast internal staircase** resembling previous studio drafts, while the necessary WEST doorway is missing. Three quest anchors are not visually distinct as required. Its fifty-year-abandoned texture is usable as style precedent, **not** as a candidate Scene background or basis for approved geometry.
- This is now the **third unsuccessful free-form render** after [earlier two drafts](./h-u07-art-studio-unapproved-geometry-failure-and-timebox-checkpoint-2026-10-23.md). **No further blind re-prompts in this turn**. The source in the GitHub geometry guide is deterministic; generated painterly raster has not proven geometry fidelity.

## Evidence classes / workflow gates

| Gate | State |
|---|---|
| Room ID/topology, entrance and puzzle fixtures | **OWNER-DIRECTED and DOCUMENTED** |
| Provisional image-space geometry reference | **CREATED / VECTOR-SOURCE ARCHIVED** |
| Painterly candidate 3 | **RENDERED → ASSISTANT STRUCTURAL FAIL** |
| Owner visual INSPECT | **NOT PERFORMED** |
| Background BUILD/STAGE/INJECT | **NOT AUTHORIZED BY OWNER ART PASS / NOT DONE** |
| Native player interactions for Studio | **NOT IMPLEMENTED** |
| Foundry gameplay test | **NOT APPLICABLE TO UNINSTALLED H-U07** |

## Next smallest safe bounded continuation

1. **Investigate visual conditioning/strict image editing from the PNG geometry guide as the actual image input**, not free-form reprompting against the previous incorrect painted output. The next picture must retain exactly one west doorway and the unbroken east and south perimeter, plus distinguishable fixtures.
2. If image-conditioned painting cannot preserve those positive architectural anchors, keep structural guide as immutable first layer and research a controlled geometry/texture compositing procedure under the owner's established scene-render workflow. Document technique change before adoption; never promote bad art.
3. Present a candidate **for owner INSPECT** only after passing the structural hard gates; do not install H-U07 until approval.
4. In parallel, when a real non-GM player session becomes available, perform the outstanding H-G06 fireplace Tinderbox+Light click canary; its GM-only 3-branch canary already passed and baseline was restored.
5. Continue respecting the maximum 20-minute work-unit rule, a durable receipt after every meaningful operation, and one safe exact-thread Codex continuation signal at end of work. For this correlated inbound relay, **reply once via its exact `bridge_message` correlated return route** rather than starting another native roundtrip.

**Continuity protection:** H-U07 upstairs Studio remains early accessible from upper Landing; prayer-gated H-U08 remains separate and hidden; `027` references the lockbox physically in H-G06; Sune Prayer of Protection and Prayer of Devotion are distinct and have separate item rewards. No external Foundry edits were performed.

## Deterministic SVG geometry source verification

A local read-only `xml.etree.ElementTree` parsing test of the archived SVG geometry source returned **PASS 11/11** for the source wall segments, west gap, and five separate semantic fixture anchors. Source SHA-256 `4bb736d6718cd430146905e532f1888395d8b8cf64667ccaa428fabb26e38fca`. Tests checked intact north/south/east bounding wall rectangles, two west wall segments divided by the sole 175px west door, and distinct vanity, `027` painting, Sune shrine, paint table and easel guide rectangles. **These checks validate vector source geometry only; they do not certify the incorrectly generated painted image.** The machine-readable source-check receipt is created at `/mnt/data/cav_hu07_geometry_source_verify_v001.json` in this execution, and the authoritative constraints are permanently in the committed guide JSON.
