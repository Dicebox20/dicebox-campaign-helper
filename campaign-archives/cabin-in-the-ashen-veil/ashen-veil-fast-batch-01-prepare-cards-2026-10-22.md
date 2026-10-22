# Cabin in the Ashen Veil — Fast Map Batch 01 / Four PREPARE Cards

**Date:** 2026-10-22. **Status:** COMPACT PREPARE INPUT, not accepted painted render, runtime `PREPARED` state, installed Scene or receipt.
**Owner approval:** [House Master v1](./blueprints/house-master-v1-2026-10-22.md), [coordinate source](./blueprints/house-master-v1-2026-10-22.json), [campaign-specific fast map process](./ashen-veil-fast-map-creation-profile-v1-2026-10-22.md). Explicitly reuse BP-1 room geometry, not the old undimensioned nine-box house diagram. Only new artistic choices need authoring. Story elements are required to be noticeable from a true overhead tabletop view.

**Batch style default:** strict overhead, owner-approved main house masonry/timber, lived-in domestic belongings, painterly with *legible* floor edges, no baked grid, no tokens, no revealed secret-side room; baseline `battlemap-120`, Stage A/dormant where appropriate. Items players can take or otherwise move are *not baked* into art as permanently present reward states. Roof and Upper Landing aren't in this batch.

## Card H-G02 — Foyer

| Field | Values |
|---|---|
| ID / location | `H-G02` — Foyer (ground), **FAST** |
| Geometry/links | BP1 rectangle x24..52, y0..16; yard front door at (38,0); Great Room at (38,16); Dining at (24,8); Kitchen at (52,8); Foyer stair up to Upper Gallery and **Weathered-Key** basement stair down are distinct validated *planned* vertical transitions |
| Must see | **Grandfather clock** with removable oversized Hour Hand behind Brass Tiny Key face; carved family craftsmanship; front hall entry rug/coat bench; visibly distinct up/down stair/locked basement door; route to Great Room |
| State/spoilers | Clock-glass closed/open and Hour-Hand recovered are movable/overlay states; basement passage inaccessible before Weathered Key; none of the early room art shows deeper basement or hidden house wing |
| Style | Inherit house style preset and actual blueprint/door geometry; 90° orthographic, no grid |
| Inspection hard gates | Clock large enough to read; both stairs distinguishable; Great Room return correct; no pre-open basement or false extra exits |

## Card H-G06 — Great Room

| Field | Values |
|---|---|
| ID / location | `H-G06` — Great Room (ground), **FAST** |
| Geometry/links | BP1 x24..52, y16..52 + north hearth bay x28..48,y52..57; south door to Foyer (38,16), west locked Study (24,34), east early Studio (52,34); double-height ceiling/overlook gallery above, no navigable second floor baked into ground map |
| Must see | **Prominent inspectable house-blueprint display** on drafting/family table approx (38,25.5); **distinct locked `027` box** approx (27,26); functioning household hearth/chimney centered north; real family furnishings/portraits; doors to Study and Studio |
| State/spoilers | The **player-facing blueprint handout**, with altered Studio side wall/faint erased architectural lines, is a separate inspection asset derived from BP1; painting the word “SECRET ROOM” or showing GM hidden walls in the Great Room art is forbidden. `027` lockbox must remain closed until its code is used. Dust of Dryness water-filled pellet is a separate claimable item |
| Style | Warm domestic architecture with ash/dust; dark enough for dread, bright enough to inspect the blueprint table and `027` |
| Inspection hard gates | Central hub intuitive; Study and Studio physically distinct; blueprint table and `027` distinct objects; important clue readable via inspect interaction, not only miniature painted text; no hint reveals hidden room directly |

## Card H-G07 — Dahlia's Art Studio

| Field | Values |
|---|---|
| ID / location | `H-G07` — Dahlia's Art Studio (ground), **FAST** |
| Geometry/links | BP1 x52..76, y16..52; Great Room door x52,y34; **concealed** Candle Workshop door on east wall x76,y41, NOT a visible general-purpose passage |
| Must see | Vanity with physically sized Ornate Mirror placement; Dahlia paintings including unmistakable `027` lockbox portrait visual anchor; **private Sune devotional shrine** on east wall; easels and paint palette; family paintings that suggest care and half-elf artist/cleric; east wall feels slightly thick/subtly revised without revealing actual chamber |
| State/spoilers | Mirror missing/reinstalled (reward Carriage Key + Brass Tiny Key); Prayer of Protection later reveals Candle Workshop entry; Prayer of Devotion gives Sune emblem half after Boathouse. These are independent interactions, not baked permanent open secret or already visible key rewards |
| Style | Artist's warm color touches, aged furnishings, carved rose/goddess motif; studio must feel domestic rather than an occult torture room |
| Inspection hard gates | Studio accessible without Study Key; east concealed doorway has no prematurely visible open passage; vanity, `027` visual clue and shrine are **separate clear anchors**; generous reachability near wall |

## Card H-G05 — Allen's Study

| Field | Values |
|---|---|
| ID / location | `H-G05` — Allen's Study (ground), **FAST** |
| Geometry/links | BP1 x0..24, y16..52 plus west bay x-10..0,y26..46; door to Great Room at x24,y34, **Brass Study Key locked** |
| Must see | Workbench/drawings of Allen's Gondian inventions; personal journals and paper bearing `587` context; **taxidermied Rufus lacking BOTH eyes** as distinct head/eye interactive fixture; believable study bookcases and tools; family mementos |
| State/spoilers | Rufus first/second eyes recoverable elsewhere then installed; jaw button and Gondian power-source compartment are **closed until both eyes inserted**; no source displayed prematurely. Original reason for animal restoration is recognizable from father's notes; avoid gratuitous gore |
| Style | Skilled mason/tinkerer's domestic room with clean mechanical work; distinct enough from boiler/workshop |
| Inspection hard gates | Locked entrance location correct; both Rufus eye sockets visible; `587` clue inspectable; source compartment remains hidden and unlockable independent of background art |

## Batch acceptance and follow-up

Each card inherits approved house blueprint portal coordinates and current puzzle decision catalogue. **One normal painted render per card** after lightweight deterministic structural blueprint-export and fast semantic check; one FINAL_INSPECT on all four. Use automatic `PASS` when all critical anchors work, recording cosmetic notes without REDO. If one scene fails a hard gate, isolate/restart just that scene with a *fresh prompt from canonical accepted sources*; continue unaffected maps. **No runtime mutation, building permission or Scene verification claimed.**

**Next production task (when authorized/connected):** materialize the four individual card specifications in durable scene workspace, validate the technical structural evidence/validator adapter, render 4 maps, inspect, approve via PASS, then BUILD/STAGE/INJECT under live authority. The player-facing Blueprint BP-3 handout is a separate art/inspection asset derived from the approved master, not a prerequisite to generating the other three room backgrounds.
