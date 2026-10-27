# Cabin in the Ashen Veil — Sophia's Bookcase: erroneous Gond Emblem Half overlay removed

**2026-10-27 Pacific.** User provided an in-game screenshot showing a circular blue pendant superimposed over Sophia's painted bookcase, then explicitly confirmed that the pendant is the future Spine Mosaic reward and was placed over the map by mistake. Owner request authorizes correction of the erroneous live visual overlay, not changes to the puzzle's reward logic.

## INSPECT

Original elected GM Foundry V14.367, world `cabin-in-the-ashen-veil`, original Scene `CAVHU05Scene0001` (H-U05 Sophia's Bedroom). Approved unchanged background `Maps/cabin-in-the-ashen-veil/H-U05_Sophias_Bedroom_V004_OWNER_APPROVED_SOUTH_DOOR_REMOVED_2026-10-24.png`. Found exactly **one** original Scene Tile:
- `Scene.CAVHU05Scene0001.Tile.CAVHU05GONDTILE1`, x=1000, y=177, size 66×66.
- Image `icons/equipment/neck/pendant-bronze-gem-blue.webp`; original `alpha=1`, `hidden=true`, `locked=true`. Being hidden did not prevent the GM from seeing its image superimposed on the bookshelf.
- Tile project flag `cavSophiaGondCompartmentVisual` identifies source Item `Item.o9G3UJjEe2QX1ZH0`, original Gond Emblem Half.
- Original bookshelf Region `Scene.CAVHU05Scene0001.Region.CAVB994894A7432F`, enabled close-up Behavior `LRYrBIQNN92SCJai`, and **disabled** original Gond reward Behavior `CAVGONDREWARD001`.
- The disabled reward Behavior **explicitly references and checks the same Tile**, including the original Tile ID, `tile.hidden===false` and original compartment flag `originalGondTileId`. **Deleting the Tile would break this staged reward dependency** and was deliberately avoided.
- Real Spine Mosaic/Veil provenance, item-only-once award and six original storybook ledger requirements remain uncommissioned, guarded, and disabled. No item awarded.

## BUILD — original visual only

Using a single elected-GM native document write with strict exact background/scene/tile/source/flags preflight, set only the original Tile's `alpha` from `1` to `0`, keeping its original identity, image reference, position, `hidden=true`, lock, flags, the original Region scripts, source Gond Item and disabled reward Behavior intact. Result: no longer renders the mistaken blue pendant image over the bookshelf, including in GM view.

Exact original native write and same-call readback: **PASS**. A SECOND independently connected, read-only elected GM inspected the actual Tile, complete Tile object diff, original staged reward source script/hash and disabled status, the enabled bookshelf close-up and original world Item: **PASS**.

Host receipts:
- `utility-harness/artifacts/cav-sophia-gond-mosaic-tile-preservation-source-audit-20261027.json` (original source snapshot)
- `utility-harness/artifacts/cav-sophia-gond-spine-reward-superimposed-tile-alpha-zero-20261027.json` (actual guarded write)
- `utility-harness/artifacts/cav-sophia-gond-hidden-tile-alpha-zero-independent-GM-postread-20261027.json` (independent PASS)

## IMPORTANT REMAINING DESIGN / QA

This is a **visual overlay correction**, not completion of the six-book Spine Mosaic. When the actual puzzle and in-room compartment reveal are commissioned, the current Tile will remain **transparent even if its `hidden` flag becomes `false`**. Plan a deliberate owner-approved authentic reveal visual (or revise the reward's visual dependency) and test the original provenance checks at that later stage; **do not simply assume the reward is visible or enabled now**. Do not delete the Tile or bypass original six-book/Veil/reward checks to shortcut the pending content.

No background image, artwork asset, character, Item, token, Scene, Region, puzzle flags, other live workstream, or source repo changed. No gameplay progression or player acceptance simulated.
