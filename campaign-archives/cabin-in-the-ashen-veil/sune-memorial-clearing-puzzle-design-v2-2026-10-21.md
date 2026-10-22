# Cabin in the Ashen Veil — Sune Shrine, Independent Bowl, Undercroft and Keystone — Revision v2

> **LATER BOWL SOURCE LOCKED (2026-10-21):** The subsequent owner-delegated decision places the independent Bowl in **the Rosewater Reliquary beneath the drained Bathhouse**, reached through the three-ring mosaic puzzle. The v2 “source OPEN” references are historical only. [Controlling Bowl placement](./rosewater-reliquary-bowl-decision-2026-10-21.md); [final audit](./final-pre-map-audit-2026-10-21.md).


> **UPDATED BY OWNER REVISION v3 (2026-10-21):** The Keystone door is explicitly the thick ornate barrier Donovan tried to dig through. Behind it is the trapped Undercroft where **Donovan and Sophia's skeletal remains** are found; the hall beyond leads to the final ritual. The owner wants an **independent mid-game Bowl map** and suggested a **drain-revealed Bathhouse area** (precise architecture proposed/open). Healing requires sluice **shut** and Bathhouse **filled**, in addition to Waterworks/Boiler operation. [Read current v3 design](./undercroft-keystone-bathhouse-bowl-healing-design-v3-2026-10-21.md).


**Date:** 2026-10-21. **Scope:** Side-campaign design chronology, NOT an implementation/Foundry/Regionwright/KB acceptance receipt.
**Authority:** Owner explicitly superseded the earlier final chain: “the scrying bowl is actually not the final puzzle piece”; “implement the undercroft into the puzzle chain, and let people see the final door before they can unlock it”; “simply make the Scrying bowl a standalone piece of progression, and replace the item inside the vault to a keystone.” The owner-directed topology and reward substitution here are **OWNER APPROVED**; invented details remain **PROPOSED/OPEN**.
**Previous design:** [v1 Grove contract](./sune-memorial-clearing-puzzle-design-v1-2026-10-21.md), superseded only where it incorrectly places Bowl in Vault and lets Bowl mechanism lead straight to final encounter. Other accepted early and late Grove interactions continue unchanged. The retired 29-map roster is NOT a baseline.

## 1. Latest owner-approved progression

1. **Independent Scrying Bowl acquisition — location and gating OPEN.** The Scrying Bowl is its own progression piece, not the final prize in Allen's secured vault. To let players reach the Undercroft before recovering the Keystone, Bowl access must NOT require first obtaining the Keystone, opening the final door, or completing the vault. Do not silently move the Bowl into an existing scene without owner approval.
2. The existing **water-filled Dust of Dryness pellet** remains in the Great Room `027` lockbox, with the clue visible in Dahlia's Art Studio painting.
3. The existing **Sune's statue mechanism** remains: place Bowl in her outstretched hands, insert the filled pellet into its watertight slow-release chamber, then flow activates engineered dry water channels.
4. **Change in outcome of statue mechanism:** opens a navigable **Undercroft entrance**. Players may enter and **see/examine a sealed final door** before obtaining its unlocking piece. This is a deliberate intermediate exploration stage, not an automatic finale and not a cutscene-only reveal.
5. **Allen's secured Vault retains its existing four prerequisites:** Weathered-Key basement access, charged Gondian power source, Gond emblem half, Sune emblem half; the Gond/Sune interlocking emblem remains the actuator. **Change in Vault contents:** reward is now a **Keystone** (not the Scrying Bowl).
6. Players bring/install the **Keystone** at the **final door inside the Undercroft**. That door unlocks to permit the final ritual encounter with Maldrath Voss/Vharzagul, whose combat/ritual mechanics are still unfinalized. The Keystone is the Vault reward, **not a fifth Vault prerequisite**.

### Dependency graph (logical, not implementation code)

```text
Independent Scrying Bowl [source TBD] ----+
                                           +--> Sune statue hands + pellet
Great Room 027 -> filled pellet -----------+         |
                                                     v
                                      Undercroft entrance opens
                                                     |
                                                     v
                                         Accessible Undercroft
                                         SEALED FINAL DOOR
                                                     ^
                                                     | use Keystone
Basement access --------------------------+           |
Charged Gondian source ------------------+           |
Gond half from Spine Mosaic -------------+---> Vault -> Keystone
Sune half from Boathouse prayer ---------+
                                                     |
                                                     v
                                           Final ritual chamber
```

All original Grove early puzzles and second NW-bust Crooked Man chase remain in place. The Crimson Veil still begins **only when the Gondian power source is charged in the Aqueduct**, not upon entering the Undercroft.

## 2. Spatial / visual requirements

| Scene | Initially visible/required artwork | Stateful fixtures or later visual changes |
|---|---|---|
| **Sune shrine / Grove** | Central Sune statue with EMPTY cupped hands; four bust plinths; statue-base sliding relief cover; dry worked-stone channels; hidden entrance geometry that can open | Bowl added to hands; slow water in channels; real access threshold exposed/door opened |
| **Independent Bowl pickup** | **TBD** — exact container/scene not chosen; require plausible visual anchor once chosen | Acquired Bowl separate visual and inventory state |
| **Great Room** | `027` lockbox | Pellet may be separately recovered, not auto-awarded |
| **Allen's Vault** | Four-condition actuator and a distinct Keystone resting fixture | Vault opens; players explicitly take Keystone; no Bowl depiction as Vault prize |
| **Undercroft approach** | Navigable underground space with visibly deliberate, imposing **sealed final door** and keystone-compatible mechanical recess | Door accepts Keystone and changes from sealed to open; must remain viewable long before players can use it |
| **Final ritual chamber** | Actual ritual environment beyond final door, isolated by legitimate Foundry door/portal geometry | Access becomes possible only after Keystone unlock; scene/room boundary to be confirmed |

**Scene-count caution:** Prior working scene #28 was simultaneously “Undercroft Ritual Chamber.” Under this revision, the **visitable Undercroft with sealed door** is conceptually distinct from the **final ritual chamber beyond it**. If these are separate physical rooms, the reaffirmed one-room-per-Foundry-scene rule requires two separate maps. The total may increase from the earlier **28 working estimate**; recount based on accepted physical geometry, never because of the discarded historical 29-map total. If the Bowl source is a new physical area, that could add another map; if it is in an existing area, no extra map is necessary.

## 3. Puzzle/Region trigger separation

| Anchor ID (PROPOSED, not live flags) | Interaction type | Required state | Effect |
|---|---|---|---|
| `grove:statue-hands` | Explicit use Bowl on statue | Player has Bowl | Place Bowl; expose small bowl chamber |
| `grove:bowl-chamber` | Explicit use filled pellet | Bowl placed + player has pellet | Start slow-flow water mechanism; open Undercroft entrance; persist access |
| `grove:undercroft-access` | Ordinary unlocked threshold / transition | Water puzzle complete | Enter Undercroft approach, **not** final ritual room |
| `undercroft:final-door-inspect` | Explicit examine/interact | Any party member who can physically reach it | Reveal non-spoilery visible Keystone-shaped seating geometry; while locked do NOT teleport or open |
| `undercroft:final-door-install` | Explicit use Keystone | Keystone obtained from Vault and not already installed | Unlock final door once; record persistent unlocked/open state |
| `undercroft:final-door-traverse` | Region/door transition | Final door unlocked | Enter final ritual room through actual door |
| `vault:keystone-pickup` | Explicit loot pickup | All four Vault prerequisites satisfied, Vault opened | Deliver Keystone once; prevent duplicates |

A “clickable Region” is **not assumed a native Foundry capability**. BUILD must use an installed/verified interaction adapter, Regionwright click interface, Note/Tile or other accepted approach. No world mutation from arbitrary browser UI code. Native Foundry door/Region states, authorized GM gate, idempotency and authoritative reread are future BUILD/VERIFY concerns.

## 4. Softlock and player-experience requirements

- Bowl acquisition **must be independent of Vault**, so players can discover the door while Keystone is still unavailable.
- Both Bowl and pellet must be obtainable without completing the vault or the final-door interaction.
- Door appears physically **locked** rather than revealing the ritual encounter beyond it. Do not expose Voss's lair early through vision leaks/overhead tile errors.
- Undercroft should remain returnable: reaching the locked door cannot strand players; Bowl water mechanism cannot unintentionally close the only route back.
- If the party obtains Keystone before first visiting Undercroft, the system must still work; the story encourages earlier discovery but does not silently require a hard time gate unless owner explicitly chooses one.
- Keystone insert/door unlock must be idempotent and persistent; installing it cannot consume the only Keystone before a verified unlock.
- Original early four-bust sliding relief/Study key and late NW chase/Silver Tiny Key do not change; likewise Waterworks + boiler healing and Crimson Veil progression are unaffected.

## 5. Owner decisions still OPEN

1. **Where/how is the independently acquired Scrying Bowl obtained?** It should tie into an existing scene or deliberately approved new area, without circular vault dependency.
2. **Where precisely does the Bowl reveal the Undercroft entrance on Grove geometry?** Existing dry water channels and statue remain intact.
3. **What does the Undercroft exploration area contain before the final sealed door?** Clues, visible structure, any side passages or narrative/haunt interactions await design.
4. **What does the Keystone and door socket look like?** A distinctive Allen-designed mechanism is plausible, but no shape, size or inscriptions are yet accepted.
5. **Does the door separate two individually mapped rooms or an approach and chamber inside one coherent map footprint?** Follow room-per-scene policy and validate line of sight either way.
6. **Does the party obtain a meaningful hint leading from the final door back to Allen's Vault?** Optional design work; do not add a fifth prerequisite puzzle.
7. Exact Regionwright click adapter, trigger persistence keys, Foundry document bindings and tested implementation all **unverified**.

## 6. What is NOT changed

- Sune's statue still needs the **Bowl + water-filled pellet**, and the pellet still uses a watertight chamber with slow release through engineered channels.
- Early bust order SW→NE→NW→SE, embossed sliding relief on statue base, 1,000 gp and Brass Study Key, later northwest bust encounter and Silver Tiny Key all remain.
- Existing four **Vault** prerequisites unchanged; final reward **only** changes from Bowl to Keystone.
- The Vault has no newly approved placement/extra activation minigame.
- The Grove geography, Carriage Yard Bathhouse spur, separate house room maps, and environmental states all remain.
- No Foundry map, Region, macro, puzzle UI or game-engine modification has been performed; this is a catalogued campaign-specific design revision awaiting scene PREPARE and implementation gates.
