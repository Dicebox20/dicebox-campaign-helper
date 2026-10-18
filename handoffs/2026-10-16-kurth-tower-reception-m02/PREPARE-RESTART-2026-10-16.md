# M02 — Kurth Tower Grand Entrance — PREPARE RESTART (2026-10-16)

**State:** `PREPARE_RESTART_DRAFT_REVIEW`, NOT geometry-approved. **Stable Scene ID:** `dbx.heist.kurth.m02.reception`. **Stage:** PREPARE only; no Foundry mutation, structural render or painterly art.

## Explicit restart and authority
The user asked why M02 looked like a small tollhouse with an apparent rear exterior entrance and explicitly requested a restart at PREPARE. That invalidates the previous 40×24 M02 design, refined geometry and rejected 2026-10-16 grayscale as **design authority**. They remain historical evidence, including the old counter/column intersection and visually sealed southern service thresholds, not a source for the new render/geometry. Re-author independently from this PREPARE and accepted mission; do not trace or edit rejected art, prior prompts or the old Spatial Blueprint.

## Mission continuity (retained)
Acquisitions Incorporated-style Luskan Closeguard Island / Ship Kurth heist. Sequence M01 The Dark Arch → **M02 Kurth Tower Grand Entrance** (Sarmenti deception/credentials) → M03 Security Machinery → M04 Luminary Cipher (5×5 Lights Out) → M05 Oathbound Chamber → M06 Inner Vault. Six PCs plus Jim Darkmagic (witty non-mechanical guide; never baked into the art); all guards/NPCs GM-controlled and not preplaced. Vault treasure identity remains UNSET. M01 is *user-reported usable*, not Foundry-VERIFIED.

## New proposed scale
**54×36** logical five-foot spaces = **270×180 ft**, Gridless, **6480×4320** Scene pixels at 120 px per 5 ft, zero padding; strict 90° overhead orthographic without horizon/tilt. This expands playable area to ~2× the discarded 40×24 version and is pending user PREPARE review.

This map is a **cropped, grand interior floor of a much larger fortified tower**, not a free-standing checkpoint drawn with exterior paving around it. The tower extends beyond the visible north/south map edges. Show exterior architecture only at **one clearly marked west entrance from M01**; the east side is a secure **internal** entrance deeper into Kurth Tower and M03, **not a back door into outdoors**.

## New architectural programme
- **West:** monumental internal entrance/portico with deep doors and safe 6-PC staging, leading from M01.
- **Center:** enormous, uncramped ceremonial hall with imposing stone columns or clustered piers, sweeping flights to actual accessible internal galleries, large open floor, visible vertical scale through overhead architectural relief, and no queue maze dominating the room.
- **North:** discreet clerk/reception station offset from the central ceremonial axis; private permit registry, sponsor records and inspector **internal** passage to the core.
- **South:** servants' lobby, store/receiving room and **internal** staffed service hallway/steps; no side entrance from an exterior street.
- **East:** formidable inner guard barrier (15-ft or larger usable opening), inner lift/stair vestibule **inside** the same tower leading toward M03. All routes finish behind this guarded threshold.
- **Optional gallery:** only if independently authored accessible stair/landing and native collision/elevation logic; no false walkable balcony edges.

Static counters and decorative fixtures may be rendered in the background; operable doors, Walls, Regions/RegionBehaviors, changing lights and actors remain native Foundry responsibilities if later approved.

## Three mandatory independent paths
1. **PUBLIC:** M01 exterior portal → wide ceremonial hall → social credential contact/guard audience → inner guarded gate → secured core → M03. **10-ft Large continuous passage, preferred 15–20 ft; inner gate at least 15 ft.**
2. **RECORDS:** Same west entrance → hall → north clerk/records rooms → inspector internal passage → **post-guard** secured core → M03. **5-ft Medium continuous passage** (prefer 10 ft).
3. **STAFF:** Same west entrance → hall → south receiving/servants' wing → staffed internal service hallway/stair → **post-guard** secured core → M03. **5-ft Medium continuous passage** (prefer 10 ft).

Proof required at GEOMETRY INSPECT: each reaches the **actual internal M03 exit** independently and on the correct side of security; closing every controlled access prevents unauthorized transit; stair transitions and both bypass doors are genuine walkable openings. Assess actual swept token footprint between physical obstacles and reject counter–pillar overlap. No hidden magic teleport fixes.

## Heist encounter/Region intent
Sarmenti has multiple legitimate social approaches (persuasion, bluff, forged paperwork, impersonation, sponsored visit) and the rest of the group may distract or infiltrate via side routes. Purpose/sponsor/clearance remains **a proposal, not a required solved puzzle**. Consequences can raise scrutiny; no one failed roll deadlocks the group. Optional Quiet → Suspicious → Alarm is GM narrative state, not accepted automatic behavior.

Proposed GM-hidden Region intents: arrival from M01, credential audience cue, optional inspector/staff cues, post-guard M03 transition. No authoritative Region coordinates or destination UUIDs yet; **zero hidden discoveries**. No baked NPCs, Jim, grid, readable room labels or surprise combat automation.

## Geometry acceptance gate and strict stop
This is **PREPARE, not a reconstructed Spatial Blueprint**. Author new typed walkable ground polygons, actual internal/exterior topology, independent Wall/door planes, pillar footprints, counter no-overlap, and optional elevated gallery/stair connections. Create a neutral technical preview and verify door and prop collisions plus Large/Medium swept-footprint paths. Then perform GEOMETRY INSPECT. Do **not** render grayscale, painterly art, or build/inject Foundry macros until the relevant prior gates pass.

Accepted downstream order: PREPARE → GEOMETRY AUTHOR → GEOMETRY INSPECT → EMBOSSED GRAYSCALE → STRUCTURAL INSPECT → FEATURE MANIFEST/BLUEPRINT RECONCILIATION → OFFLINE STRUCTURAL BUILD → PAINTERLY RENDER → FINAL INSPECT → FINAL INJECTION ASSEMBLY → STAGE → INJECT → VERIFY → RECEIPT.

**Exact world:** `world-template-2` was previously observed for M01, but any M02 runtime injection requires fresh world/module/active GM reread and native preview; never require retyping an automatically detected `game.world.id`. No live mutation is authorized by this PREPARE.

**Evidence:** Extended user-readable Markdown and spec saved in ChatGPT Library folder `DiceBox Campaign Helper/Heist M02 PREPARE Restart` (PREPARE SHA256 `e2dc437e36d5b832945609c935d10c73787c241042712bd99ba22d211452ddcb`, spec SHA256 `fb2fcaa9f7c86055358947c4aefa9f1010f064bfb7cb89c36d026c117c7fd8d3`). Library is a preview/mirror, not a replacement for this GitHub governance checkpoint.
