# Cabin in the Ashen Veil — Cabin Exterior / Carriage Yard Map PREPARE v1

**Date:** 2026-10-22  
**Scene Key:** `EXT-01` / Carriage Yard (cabin's immediate southern exterior and arrival space).  
**Status:** `DESIGNER_PREPARE_CANDIDATE`; **no accepted painterly render, final inspect PASS, Foundry build, or runtime receipt claimed**.  
**Authorization:** Owner: “lets start with the cabin exterior.” This is a narrow owner-directed **production-order exception** to the previously approved first indoor batch (`Foyer → Great Room → Studio → Study`); it does not remove that indoor order after this outdoor canary.
**Project workflow:** Cabin FAST scene profile + global structural/semantic battlemap and representative-wall standards + immutable clean image prompt restart.

## Six-field compact PREPARE

| Field | Exterior proposal |
|---|---|
| **ID/location** | `EXT-01 — Cabin South Exterior / Carriage Yard`; the central estate arrival hub, not the complete pond/shrine/maze/boathouse. |
| **Geometry/links** | Approved house BP-1 is controlling for building proportions: main house west-east width 90 ft on southern wall, Foyer front entrance at master `(38,0)`, south porch `20×7 ft` centered at master x28..48. Candidate outdoor scene physical envelope **160 ft E–W × 115 ft S–N**, local feet, north up. Project main house southern wall at local `y=81`, BP-1 master `x0` offset to local `x44`; door at local `(82,81)`; porch at x72..92,y74..81. The northern roof/building mass continues beyond the outdoor map edge; it is not an indoor walkthrough map. |
| **Must see** | South-facing, family-built cabin frontage with sound porch/steps and one clear Foyer door; worn open circular carriage yard; old **locked family carriage** offset southwest; northwestern paths to maze gate and Donovan's Shack; westward Sune shrine trail with further southwest Bathhouse fork located beyond this sheet; northeastern privy route; visible **thin pond bank and small dock at east edge**; main southern arrival road; old masonry and overgrown Neverwinter woodland. The house must read as Allen's lovingly built home, not a faceless fortress. |
| **State/spoilers** | Carriage locked initially; Dahlia remains inside and Ladder Hook are **separate post-unlock inspect/pickup states**, not exposed in permanent yard background. Pond FULL/DRAINED and sluice operating state belong to distinct Pond scene / managed overlays; water shown only as non-authoritative partial shoreline at the east boundary. No secret house wings/rooms, Undercroft, far Boathouse, complete Memorial Clearing or full Grove in this base map. |
| **Style** | Original owner shrine reference `Overgrown Forest Shrine Clearing.png` identified in GitHub artwork archive; source pixel inspection pending in this turn. Owner-supplied estate aerial is **rough geography** and not a mandatory final camera/style template. Follow locked project painterly overhead TTRPG map standard: 90° orthographic plan view, readable worn ground/materials and dense perimeter vegetation, narrow top-facing representative physical wall caps and roof planes, neutral diffuse permanent lighting. The target is gridless `battlemap-120` at 120 image pixels per 5-foot mechanical square. |
| **Inspection hard gates** | **One scene**—Carriage Yard with cabin roof/frontage occupying its northern edge, not the full estate. Door alignment with BP-1, porch/traversal clearances, carriage interaction reachable, wide open token maneuvering, all six directional route families distinguishable, pond edge only, natural material readability, correct 90° overhead camera and non-emissive base lighting, no painted captions/grid/characters, no premature carriage interior/spoilers. False side-facing house facades or total-house interior cutaways are hard REDO. |

## Candidate paired anchors (scene-local, feet; geometry unapproved)

| Semantic anchor | Scene-local (x,y) | Intended logical destination |
|---|---|---|
| `HOUSE_ENTRY` | (82,81) | `H-G02 Foyer` south door, from BP-1 |
| `CARRIAGE_LOCKED` | (52,37) | Same-scene inspect/interact with post-unlock state |
| `WEST_SHRINE_TRAIL` | (0,51) | West trail / `SG-06` approach |
| `NORTH_MAZE_GATE_ROUTE` | (13,115) | `SG-03` Iron Gate Thicket approach |
| `NW_DONOVAN_SHACK_ROUTE` | (0,91) | Donovan's Shack |
| `NE_PRIVY_ROUTE` | (160,91) | Privy |
| `EAST_POND_ROUTE` | (160,55) | Pond + near dock |
| `EAST_SLUICE_PATH` | (160,66) | Pond / sluice access |
| `SOUTH_ROAD_ENTRY` | (82,0) | Southern approach / arrival |

**Spatial preflight:** All other landmark positions and path widths are *design choices* pending real BP-2 source projection and paired transition validation. The separately accepted indoor BP-1 is not silently amended.

## Artifact and inspection boundary

- A labeled deterministic **structural control** and machine-readable scene manifest are produced as local chat artifacts; they are not automatically GitHub assets or official Foundry geometry.
- Any painterly candidate subsequently generated must receive independently observed `FINAL_INSPECT PASS|REDO` and identity/provenance receipt; actual pixels and dimensions must be checked before assigning art approval.
- Never supply prior rejected full-house interior renders or prompts to the painterly provider. Draft each prompt afresh from approved positive sources, only featuring visual elements authorized for the target art layer.
- Deliberately separate the permanent image from live Foundry lights, door/Region behavior, environmental stages, carriage interiors, items and stateful overlays.
