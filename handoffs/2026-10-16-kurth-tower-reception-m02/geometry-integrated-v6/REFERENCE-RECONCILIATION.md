# DiceBox M02 — One integrated M01-to-tower scene, geometry v6

**Status:** LOCAL GEOMETRY PASS / USER VISUAL REVIEW PENDING. **No structural render or Foundry changes.**

## Why v5 is superseded

The user observed that v5 kept M01 and M02 as separate blocks and omitted the part of the **same building already visible at the east side of the bridge map**. The latest detail image, `user-building-corner-source.png`, shows dark shingled roofing, the lit masonry corner, and the roof-to-courtyard relationship **at the existing bridge map edge**. These are continuity features, not a freestanding building to invent farther east.

## Locked geometry intent in this candidate

- ONE 40×24 logical-cell map coordinate system (battlemap-120, 4800×2880 px, Gridless).
- Inherited M01 bridge, gated courtyard and upper/lower dock art at the left, as contextual reference, with the artwork visually aligned to the M02 coordinate system. The inherited wall/door geometry is **not** copied from image pixels.
- **One joined structural building footprint:** existing roof wing `B01` (x15.2–18.45) → roof continuation `B02` (x18.45–28.65) → cropped reception building `B03` (x28.65–40, full height). This structural building footprint is geometrically one connected polygon.
- The image provenance boundary x18.45 is **not** a wall, separate map, or second scene. Players can pass continuously across it on the external courtyard path.
- Upper east roof extension is not player-walkable at first-floor ground level. Exterior path runs below it: upper lateral walk and lower return beside rocks/water, finishing at the ONE visible outdoor entrance at x28.65, y20–23 (nominal 15-ft opening).
- The first floor is clipped at the north, south and east map edges. These are crop edges, NOT authored outer building perimeter walls. An M03 transition is a future interior continuation at the right crop edge, **not a rear outside entrance**.
- Three interior screening routes from the same exterior entry: public Large (10ft) / inspector Medium (5ft) / staff Medium (5ft). A set of three inside checkpoint door spans D02/D03/D04 preserves the social infiltration choice without adding rear exterior entrances.

## Validated offline checks

`INDEPENDENT-INSPECTION.json` passed on blueprint SHA256 `f822725e697e39a07241f6ff8219a6a4321cab7a84b32766774fce0a83e66fd6`.

- Public swept Large route 10ft: zero collision; joins M01 visual interval to M02 authored exterior path and enters only exterior tower door D01 and internal screening D03.
- North inspector Medium 5ft: zero collision; uses D01 + northern internal checkpoint D02.
- South staff Medium 5ft: zero collision; uses D01 + southern internal checkpoint D04.
- Closed all three interior security passages: public and secured first-floor sides disconnected. Opening any one: connected.
- Closing external tower entrance D01 isolates exterior path from reception.
- Connected roof/first-floor building polygon; no physical wall at the M01/M02 image join; one and only one exterior door.

## Boundaries — do not overclaim

- User supplied a **visual composite and crop, not a calibrated pixel-to-Foundry transform**. The original M01 art at the left of the preview is for recognizability only and includes cropped screenshot UI marks. Do not install that preview as final Scene art.
- Existing M01 **Foundry Walls/Regions/doors** inside the inherited viewport have NOT been reprojected or reread and are not contained as newly authored wall segments. A new Foundry Scene using this composite requires authoritatively validated M01 walls/door planes and registration, so these pixels cannot be treated as ready-to-inject collision geometry.
- Upper/lower original M01 stair elevations, dock walkability, and water ingress are unresolved; no landing height was invented. Incoming arrival connection and departure Region UUIDs remain unverified.
- The small entry facade and path measurements are hand-authored proposals from accepted intent; neither the screenshot nor paint has been made a geometry authority. Review those anchors before structural generation.
- The internal screening arrangement is a **new geometric concept** to preserve the required three infiltration approaches in the cropped tower footprint; actual NPC positions, credential mechanics and security behaviors remain GM-owned/proposed.
- Product machine stage remains blocked by existing O-112 historical stage; this fixture is not stage promotion. No live world mutation, installed module changes or Ready-to-Play assertion.

## Workflow continuation

User reviews the integrated v6 preview. On acceptance, reconcile the source M01 scale and original wall/elevation ownership before declaring geometry fully locked. Then: EMBOSSED GRAYSCALE STRUCTURAL RENDER → STRUCTURAL INSPECT → FEATURE MANIFEST → OFFLINE STRUCTURAL BUILD → PAINTERLY RENDER → FINAL INSPECT → FINAL INJECTION ASSEMBLY → STAGE → INJECT → VERIFY → RECEIPT.

The render prompt must be a clean fresh prompt derived from the now accepted requirements, not a revision of previously rejected grayscale/color render prompts.

## Source hashes

- User composite: SHA256 `a755a79ec2a282422390548d115bc7f64f8b72c56ebfaff22fdd05783c70a243`.
- User bridge-side building close-up: SHA256 `9a8c41d9a6d95e9f23fc8938c3cb1987e32340f2de07e8ff517f196213caf5b0`.
- Integrated Spatial Blueprint canonical serialized identity: SHA256 `f822725e697e39a07241f6ff8219a6a4321cab7a84b32766774fce0a83e66fd6`.

Files: `build_integrated_geometry.py`, `spatial-blueprint.json`, `inspect_independent.py`, `INDEPENDENT-INSPECTION.json`, `M02-unified-geometry-v6-preview.png`, `AUTHOR-RECEIPT.json`, two user visual source images (reference only).