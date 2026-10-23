# EXT-02 — Pond & Sluice Gate | Replacement PREPARE v2
**Date:** 2026-10-23
**Owner override:** “I believe this is also the map that needs to have the Sluice Gate on it, I would like it to only have the pond and the sluice gate, this is one we'll need to make an empty version of to reveal the door. The opposite side can hold a teleport to the next map with the plant overgrowth.”
**Status:** **OWNER-DIRECTED LAYOUT PREPARED / NO RENDER OR FOUNDRY BUILD**. This supersedes the [earlier EXT-02 PREPARE](./pond-both-shorelines-pre-render-recheck-2026-10-23.md), specifically its permanent landmark/detail requirements and over-broad scene composition. The first render (gen `aba356af-f8df-440d-91dd-b73450879933`) is **REDO**, not approved.

## 1. Map division and topology — owner selected
**EXT-02 is solely the POND + working SLUICE GATE and minimal safe shoreline.** One Foundry Pond location uses two exactly registered versions of the *same physical geometry*:

- `EXT-02-FULL` / `sluiceState=CLOSED`: principal default art with water-filled basin; near bank approach from Carriage Yard; recognizably constructed sluice control on accessible shore, empty crank socket; far bank contains one traversable **transition landing**, not a second playable estate destination on this artwork.
- `EXT-02-DRAINED` / `sluiceState=OPEN`: matching background with the **same image dimensions and exactly matching permanent stone/shoreline positions**, dry or lowered water exposing sculpted pond-bottom terrain, **submerged stair and carved/engineered Aqueduct entrance**. Weathered Key is a separately revealed pickup state on the newly accessible bottom, not permanently baked into the raster. Reversible refill swaps back to FULL; collected rewards do not respawn and opened Aqueduct gate remains persistent.
- **Far-bank transition → existing `EXT-07`**: An intentional **Foundry Region teleport** at the opposite shore lands characters in a separate **Boathouse Approach / Overgrown Landing** scene. This next map holds the magical plant overgrowth and the Boathouse access puzzle. It is **not drawn into the pond raster**. Late Plant-Killer Flask removes the growth there; `EXT-07` retains the Boathouse and Prayer of Devotion. The region is a travel transition, never an automatic reward, plant removal or early prayer grant.
- **WEST / estate bank**: route from `EXT-01` Carriage Yard reaches safe dry shore; this side also holds the Sluice Gate's accessible control. **EAST / opposite bank**: limited unambiguous dry landing, transitioning to `EXT-07`. The exact north/south coordinates of sluice spillway on the pond perimeter remain a map composition choice so long as they are reachable from near bank and do not block travel.
- **Pond-floor transition to Aqueduct `AQ-01`** is a *different conditional Region*, revealed only in DRAINED art and entered after Roof Replacement Gear + Gate Handle have lawfully opened the gate. Stage art shows exposed entry architecture; actual puzzle items and unlocks are separate state.

**No extra logical scenes introduced**; `EXT-02`, `EXT-07`, and `AQ-01` remain the stable IDs.

## 2. Graphic contract: restrained static pond map

Only **two dominant designed subjects** belong on the background: **the broad pond and its stone/metal Sluice Gate station**. Minimal surrounding earth, reeds/trees, one simple near-bank mooring spot and far-bank Region landing make gameplay physically legible. The approved Carriage Yard and the overgrown Boathouse map stay separate visual locations.

**Static FULL version:** A large, dark still woodland pond in a chilly, abandoned late-autumn forest, with soft even neutral daylight, weathered masonry at the sluice, lightly leaf-strewn natural banks, old waterlogged edges, and discreet mooring/landing cues. The sluice has a recognizable valve/wheel receiving socket, with its **Sluice Crank Item installed by gameplay later**.

**Static DRAINED version:** the exact same scene boundaries, camera, shore/stone positions and sluice structure, with the water level dropped to uncover a traversable rocky/silty basin and a formerly submerged stair and Aqueduct doorway. Pond-bottom surfaces must accommodate tokens, rewards and a clear approach to the engineered door. No major redressing or relocation of permanently fixed features between versions.

**Dynamic/fine-scale items** (remain gameplay, not major baked landmarks):
- Early boat transport/oars and the original wreck/Ornate Mirror retrieval: small independently controllable Boat/Tile, inspection and one-time Item pickup; geometrically compatible with pond footprint.
- `Felix Fox and the Forgotten Kingdom` from the hollow log: small separate inspectable near-shore prop/Tile and once-only Item/Journal, without giving the log a competing prominent scene centerpiece.
- Old Fishing Rod, bank tackle, separate interactive claim.
- `Sluice Crank` from Donovan's Shack `587`, installed once into gate, reusable OPEN/CLOSE action. In FULL art initial **empty** crank socket, actual lever/handle animation via Tile/Item/Region behavior.
- `Weathered Key` on drained floor, separate staged pickup; if picked, no respawn on later draining.
- `Replacement Gear` (roof clock) and `Gate Handle` (repaired nightstand) are separately fitted to exposed Aqueduct door, no permanently solved depiction.
- Magical plant growth and Plant-Killer target remain exclusively on **EXT-07** overgrown approach image/Region, not Pond background.

## 3. World-state, transitions, safety (binding canonical LOCK-04 / LOCK-12)
1. Default is `sluiceState=CLOSED` → Pond FULL and Bathhouse FULL, coordinated by **single shared resolver**, not individual inconsistent map truth.
2. Sluice install does not drain water. Player explicitly OPENs gate to drain Pond and Bathhouse; pending-action/animation swaps the visual variant only after safety checks.
3. Sluice CLOSE requests that would flood a token on the pond bed, gate stairs, boat in an unsafe place, or Bathhouse pool floor are **held pending** until those characters transfer to safe landings. Refill cannot softlock or erase a party member.
4. Players must cross full pond with the lawful rowing mechanic to reach the far bank; the **far-side Region** (not pond center) transports into `EXT-07` overgrowth landing. Provide a paired safe return Region to `EXT-02` near that same shoreline. Validate full/drained stage and vessel availability on both ends.
5. The planted wall in `EXT-07` is a late obstacle, not a barrier to reaching the EXT-07 arrival pad. The party can reach/inspect it earlier and depart; late Greenhouse Plant-Killer clears the barrier idempotently and allows interior Boathouse/Prayer.
6. Drained-state Aqueduct door appears independently of possession of Gear/Handle; it remains inaccessible until those two earned puzzle objects are installed. Return Well transition persists after pond refills.
7. Mirror, Felix book, Weathered Key and later Boathouse prayer each retain one unique source independent of map stage swaps or Region entry.

## 4. Mandatory next render workflow
- BEFORE any FULL render, freshly recheck this v2 PREPARE, current `EXT-02/EXT-07` register, LOCK-04, LOCK-12 and both active exterior route anchors. Create a brand-new **inclusion-only** image prompt grounded in pond/sluice static FULL content only. All rejected imagery and unwanted objects belong in the *inspection document*, never in the generation prompt, including negated requests.
- **Generate the FULL version first**: exactly one image, immediately inspect; stop for owner PASS/REDO. Once owner approves its specific geometry, derive the second DRAINED image **using the accepted FULL artwork as reference**, preserving exact pixel positioning for Foundry overlay switches. Do not generate independently inconsistent full/drained landscapes.
- Later BUILD must verify scale/token circulation, paired shoreline portals, safe transitions/refill, variant swap, Aqueduct door, and Boathouse plant blockade with actual Foundry interactions. This document creates no live objects.

## 5. Inspection acceptance
**PASS FULL:** recognizable significant pond and accessible Sluice Gate as principal features, clear near-side approach and opposite shoreline transition pad, cold quiet neutral natural light and neglected autumn mood, supported navigation/boat scale. Separated earlier/later quest interactions can be attached without erasing art.

**PASS DRAINED (later):** same shoreline and sluice positions and room dimensions, physically visible former pond floor, believable exposed Aqueduct door/stair and safe token floor. Dynamic Weathered Key left to stateful Foundry pickup.

**REDO:** extra estate destinations compete with pond focus; major landscape geography differs from source/other stage; sluice unrecognizable or unreachable; overgrown Boathouse section painted on Pond; premature drained-state reward access; unplayable shoreline portal.

**Approval boundary:** this is user-authorized scope refinement, **not** owner acceptance of any rendered image, and does not authorize a Foundry world write.
