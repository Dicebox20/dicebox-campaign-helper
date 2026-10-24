# H-G06 Great Room — side-staircase / no-text render inspection

**Campaign:** Cabin in the Ashen Veil (independent side campaign)  
**Date:** 2026-10-23 Pacific  
**Workflow:** PREPARE → RENDER → INSPECT (**REDO**)  
**Scope:** historical artwork/QA receipt; no accepted spatial blueprint, Foundry runtime or product stage update.

## Owner direction and source

Owner explicitly directed the next REDO to contain **no text anywhere on the image**, and to use the uncomplicated phrase **"side staircase leading up"** instead of overly specific descriptions. The new render is a fresh generation, not an edit or variation of rejected map images. The user then requested **"Looks a lot better, Inspect"**: positive quality feedback and authorization to inspect, **not an explicit override of hard passability gates**.

Sources rechecked: `h-g06-great-room-geometry-prepare-candidates-2026-10-23.md` (GitHub blob `1049f4e407a4dc8a7c555ae927f14b63205d905a`); `all-scene-preparation-register-v2-2026-10-22.json` (blob `534e66c7088c365e29130b3debf404a79ca20b1e`), H-G06; `DICEBOX-UNIVERSAL-REPRESENTATIVE-WALL-BATTLEMAP-STANDARD-2026-10-22.md` (blob `f1f215528157949dcbee667c4c60d8c1f1f56495`); Map Token Scale Standard; inherited House Layout v2/accepted BWE-027 survey. Proposed Candidate B remains **35 ft E/W × 40 ft N/S** for trial comparison only and has not yet replaced owner-approved **14×16 ft** survey geometry.

## Image identity (verified local source image)

- Generation ID: `9af2b7d2-c480-4e50-82d7-235d00c8cced`.
- Session filename: `top_down_cozy_manor_great_room.png`.
- Dimensions: **1173 × 1341** PNG, correct 35:40 aspect ratio to within rounding.
- SHA-256: `ecd8c401f6dc13cfc8306bfaa5b29d29d904b846691214a377ffd85811cb8a88`.
- The PNG source is retained in this conversation's artifact environment; this markdown receipt does not claim the PNG was uploaded to GitHub.

## Art and functional inspection

| Gate | Observation | Result |
|---|---|---|
| Single-room strict overhead | One rectangular enclosed room with readable overhead wooden floor | PASS |
| Four cardinal openings | North, south, west and east openings all visually indicated; no room names | PASS for count |
| Text exclusion | No image labels or narrative exit text; architectural plan drawing remains a visual prop | PASS |
| Side staircase | Staircase runs up the eastern interior boundary, separate in principle from the east opening | PASS for location; lower landing clearance still REVIEW |
| Northern hearth | Large unlit masonry hearth along north wall, offset from central north exit | PASS |
| Grandfather clock | Recognizable large clock near northwest corner | PASS |
| Blueprint table | Recognizable architectural drawing table left of center | PASS |
| Independent `027` fixture | Standalone secure-looking chest in southwest; can serve physical lockbox housing; interactive code/state is Foundry-owned | CONDITIONAL PASS housing only |
| Family seating and navigation | Distinct central sofa/chairs and large expanse of open floor | PASS for visual floor |
| Representative walls/neutral lighting | Overhead wall-cap/band treatment, even diffuse indoor light, unlit hearth | PASS/acceptable painterly variation |
| Critical portal width | Source image approximates entrance openings at **115–125 px** along each wall; at this candidate's `1173px ÷ 35ft ≈ 33.51 px/ft`, opening width is only **~3.4–3.7 ft** vs physically required **≥5ft Medium footprint** and prepared north/east/west nominal 6ft portals | **REDO structural hard gate** |
| East landing | East doorway adjacent to stair foot and side rail; needs a separately proven 5ft clear approach | **NOT VERIFIED / REVIEW** |
| House-wide and Foundry | Revised physical footprint/doors not owner-approved or paired to immutable H-G02 foyer; no runtime collision, Wall, Region or teleport inspection | NOT VERIFIED |

**Calculation caveat:** door aperture pixel bounds are approximate from visual review, not precise scene-wall endpoints; enough to identify credible Medium-token bottleneck under the *proposed* Candidate B footprint. This inspection does not assert that a final 5ft-wide functional portal exists.

## Verdict and recovery

**INSPECT REDO**. This rendering substantially improves on prior compositions and should remain reference evidence of *what passed aesthetically*, but DiceBox's clean-restart workflow requires the next generation to be independently authored from authoritative inputs, **never from this failed image/prompt**. Preserve the owner's no-text, direction-only openings and "side staircase leading up" language in the semantic PREPARE while holding a minimum 5-ft mechanical doorway clearance and adequate east-side landing. The approved image count remains **18/45**. No new player-visible art approval, no Foyer image changes, no Foundry BUILD, no modified accepted house dimensions or product stage transition.
