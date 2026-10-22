# Cabin in the Ashen Veil — Spine Mosaic Is a Compartment, Not a Room

**2026-10-22 | OWNER APPROVED / CONTROLLING CORRECTION**

The owner reviewed the first upper-floor Gondian blueprint (upper-floor sheet featuring Parents north, Nursery northeast, Sophia southwest, Studio east, Guest northwest, central Landing, adjoining concealed Candle Workshop) and explicitly accepted it as a satisfactory architectural **visual reference**: **“This ons is fine, the spine mosiac was never supposed to lead to a room, just a compartment to retrieve the puzzle piece.”**

## Binding canonical behavior

- The **Spine Mosaic** is a special bookshelf/puzzle fixture **inside Sophia's Bedroom** (`H-U05`). Arrange the six Miss Lulubug storybooks in their established publication order; the mechanism opens **a small concealed bookcase/wall compartment**.
- This compartment holds exactly one **Gond emblem half** (the quest “puzzle piece”) as a separate, explicitly claimed item.
- The reveal is **in the same scene** and may use a stateful Tile/bookcase overlay, an inspect/interaction affordance, sound/FX, and a single item pickup. It needs **no new Scene, Region teleport, room polygon, new doorway, walkable floor, or scene-to-scene transition**.
- A wrong book order is resettable/reversible as already documented; solving and item recovery remain persistent and idempotent. Gond half is still one of the four basement Vault conditions. The 1442–1447 DR book order/locations and Veil-only sixth book are unchanged.
- **Retire `H-U06 — Spine Hidden Room`** as a logical/Foundry Scene identifier and **remove `sophia-spine`** from future routing manifests. Do not give the compartment a house-room identity or separate presence in the player map.
- The earlier accepted-style image **contains a visually labeled “Spine Mosaic Hidden Room” projecting from the south central landing**. Owner acceptance of the upper sheet is **visual/conceptual, with an explicit semantic override**: that footprint/label is NOT a real room and does not authorize geometry, collision or teleport. When producing the final measured and player-facing house blueprint, omit that extension, keeping the mechanism concealed within Sophia's bookshelf.
- The real upstairs **Candle Workshop remains a separate secret room** accessed from Dahlia's Studio after Prayer of Protection; do not confuse it with the Spine Mosaic compartment.

## Downstream implications

**Counts:** Remove exactly one obsolete location and one obsolete route from the prior pre-v2 `43 logical / 46 stage Scenes / 49 paired adjacencies` snapshot. At otherwise unchanged assumptions this yields **42 / 45 / 48**, but **do not certify these as the final House v2 census**: the revised ground-floor family area, physical basement stairwell, changed upstairs floor assignments and any other flavor rooms require their own final architectural census. Do not remove a separate basement scene or any nine Grove scenes.

**Project provenance:** House Master v1 and pre-v2 route contracts retain their historic state; they are superseded in conflicting portions by House Layout v2, this owner correction, and the eventual measured House Master v2. Any reference in Puzzle Design v1 to opening `H-U06` or flag `spineRoomOpen` is overridden by `spineCompartmentOpen`, with Gond half still recovered from `H-U05`. The accepted Gondian upper-floor reference is the *first* upper-floor version supplied again by the owner in this turn, not the later assistant redraw with a different open-to-below arrangement. Do not re-render the sheet merely to cosmetically remove that discrepancy unless asked.

**Runtime boundary:** No Foundry scene, state service, puzzle UI, item or module was modified. This is design/canon correction only.
