# EXT-07 Overgrown Boathouse — first render inspection

**Date:** 2026-10-23
**Source controlling PREPARE:** [boathouse doll feature](./boathouse-doll-feature-2026-10-23.md), [master scene register](./all-scene-preparation-register-v2-2026-10-22.json), [pond far-bank portal requirements](./pond-full-drained-and-far-bank-transition-prepare-v2-2026-10-23.md), LOCK-12.
**Image:** `a_detailed_high_resolution_isometric_top_down_fan.png`, 1536×1024 RGB, SHA-256 `174364690aa4b448ecbd01c51d3fe9345b3da9bd3cf54fea37ad5c09c9153d23`. Generation ID `291fe390-fedb-49e9-adec-120bd3b6d64b`. Local image created; not transferred into GitHub repository.
**Verdict:** `RENDERED_INSPECT_REDO`, **NOT OWNER APPROVED**. No Foundry runtime build or item creation.

## Observations

**Positive:**
- Atmospheric neglected autumn waterside Boathouse, rotten timber pier, tangible old boat, fishing/repair supplies, old wooden structure.
- Small circular disturbed soil patch at right side, near spade, supports separate explicit Dig action; actual doll stays hidden.
- Distinct environment from the main Pond map, and broad right-hand walkable shore for potential puzzle assets.

**Hard concerns:**
- The **Pond** again occupies most of the map's **left half** rather than depicting a clearly bounded **arrival shore / safe western teleport landing from EXT-02**. Incoming players need an obvious, dry, dockside spawn and paired return zone.
- The Boathouse has **no clearly enforced growth blockade on the approach**. Roof/corner vines are decorative; the path and pier are broadly accessible. The actual required Plant-Killer obstacle must be a recognizable and non-bypassable bottleneck, with a removable thorn Tile or aligned stage.
- Large oblique roof and wall projections make this **more isometric** than desired orthographic battlemaps; outdoor roof relief is allowed, but walkable ground geometry has to remain strict overhead.
- The Prayer of Devotion could be staged as a separate Item beyond the door, but a **reachable clear interior/door interaction zone** is not sufficiently distinguished for accurate early-gating without additional markup.
- The doll soil patch should remain beyond the mandatory plant gate, on the Boathouse-side path, while still discoverable by investigation/digging; current bypass makes the progression condition unreliable.

**Next pass:** Fresh PREPARE recheck. Prioritize a clearly walkable land/dock teleport pad at west/southwest map edge, a single narrow path to timber Boathouse on eastern side, and a distinct removable magical thorn blockade in that path before Boathouse doorway. Keep small disturbed earth patch beside birch/stone on post-gate side and no doll painted above soil. Preserve separate one-time Prayer and +1 doll Item; neutral late autumn, overhead play geometry. Exactly one new render only on owner REDO instruction.

**Doll spec:** Owner: +1 to all saving throws and all attack rolls when worn as accessory, distinct from Sophia stuffed bear. Proposed `rare` attunement and optional search DC are designer suggestions, not specifically owner approved. No physical magic Item created yet.
