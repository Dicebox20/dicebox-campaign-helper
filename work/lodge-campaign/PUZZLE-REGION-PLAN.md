# Central Lodge Puzzle, Region, and State Plan

**Status:** active campaign planning artifact  
**Campaign:** `central-lodge`  
**Canonical geography count:** 21 Scenes  
**Time-of-day duplicate maps:** 0

## Core rule

The Lodge uses one Scene per unique piece of geography. Day/night, haunted escalation, recent-use evidence, lighting changes, apparitions, and most puzzle-state changes occur inside that Scene.

This deliberately replaces any older idea of making separate day and night copies of the same location.

A removed time-state map does not lose its gameplay purpose. Its purpose is reassigned to Regions, stateful objects, lights, sounds, or other runtime state on the surviving map.

## Region ownership classes

Use separate ownership even when Regions overlap physically.

- `puzzle` — mechanisms, item sockets, puzzle state, physical blockers.
- `notice` — hidden observation and clue discovery.
- `story` — narrative evidence, current-use evidence, mystery ladder progression.
- `horror` — one-shot/stateful manifestations and scares.
- `light` — groups visible fixture anchors and their AmbientLights.
- `transition` — scene-to-scene travel anchors.
- `system` — railway, flooding, ritual, or other non-day/night infrastructure.

Stable ID pattern:

`dbx:central-lodge:<scene>:region:<class>:<name>`

Lighting Regions never own the campaign sunset trigger. They react to the persistent campaign state.

## Removed-map purpose absorption

Any former day/night counterpart purpose is reassigned as follows:

| Former purpose | Surviving implementation |
| --- | --- |
| Night appearance | Exact aligned night plate + darkness |
| Lit windows / sconces | Light Regions + torch-style AmbientLights |
| Night-only ghost event | Horror Region gated by `timeOfDay=night` |
| New clue visible only at night | Notice/Story Region gated by night |
| Door/path becomes usable | Stateful door/Tile/Region logic |
| Cult seems newly active | Night-state light/sound/prop/notice evidence |
| Different ambience | Sound/weather state |
| Escalation | Campaign-state gate |
| Same room, changed puzzle state | Stateful Background Object/Tile, not new Scene |

Only genuinely different navigable geometry justifies another Scene.

---

# Surviving map responsibilities

## E1 — Arrival Clearing & Front Grounds

**Existing purpose:** arrival, first Lodge read, Hound/Black Garnet Eye socket, hidden estate-plan fragment, recent-use seed.

**Absorbed night-map purpose:**
- same grounds become visibly more threatening without changing topology;
- porch threshold sconces ignite first;
- a very small number of facade/window lights may respond later;
- night-only Horror Region may support a distant childlike manifestation or movement behind a window;
- recent-use evidence may gain a night-state sensory layer, but no new required clue is hidden behind sunset.

**Lighting Regions**
- `dbx:central-lodge:e1:region:light:porch-threshold`
- `dbx:central-lodge:e1:region:light:facade-response`

**Do not:** let Hound Notice own day/night; illuminate the whole Lodge; create a second E1 night Scene.

## E2 — Rear Service Yard & Outbuildings

**Existing purpose:** Iron Hand Crank → Well; Well Carving Pattern → E3; Servant Bell Pull → M3.

**Absorbed night-map purpose:**
- rear service entrance and one work fixture may ignite;
- night-only sounds/current-use evidence can imply recent labor;
- woodshed/well puzzles remain the same physical mechanisms.

**Lighting Regions**
- `dbx:central-lodge:e2:region:light:service-door`
- `dbx:central-lodge:e2:region:light:woodshed`

## E3 — Formal Garden & Greenhouse

**Existing purpose:** Brass Gnomon/sundial; Garden Proof; Fountain Valve Cap; Well Carving sequence; Water Control Wheel; Rose Crest.

**Absorbed night-map purpose:**
- greenhouse entry light and sparse path fixtures create isolated visibility;
- reflections/shadows may support horror beats;
- no lighting may spotlight sundial/fountain solutions.

**Lighting Regions**
- `dbx:central-lodge:e3:region:light:greenhouse-entry`
- `dbx:central-lodge:e3:region:light:garden-path`

## E4 — Family Graveyard & Crypt

**Existing purpose:** four-crest mausoleum; Founder’s Signet; Black Garnet Eye; Child Bracelet; Covenant Seal; Cicada Wing II; false burial clue.

**Absorbed night-map purpose:**
- crypt threshold fixtures ignite;
- one sparse grave-path light may exist if the approved renderer supports it;
- night-only apparition/horror Regions may carry victim-history escalation;
- crest recesses remain puzzle-readable without being highlighted by light.

**Lighting Regions**
- `dbx:central-lodge:e4:region:light:crypt-threshold`
- optional `dbx:central-lodge:e4:region:light:grave-path`

## M1 — Entrance Hall & Great Room

**Existing purpose:** Silver Family Emblem/clock; genealogy setting; Family Reliquary Key; Brass Baggage Token.

**Absorbed night-map purpose:**
- foyer sconces react first when the campaign becomes night;
- great hall gains sparse interior light;
- clock niche may receive weak peripheral light without becoming a solution beacon;
- night-only story/horror Regions can imply occupation in an otherwise abandoned house.

**Lighting Regions**
- `dbx:central-lodge:m1:region:light:foyer-threshold`
- `dbx:central-lodge:m1:region:light:great-hall`
- `dbx:central-lodge:m1:region:light:clock-niche`

## M2 — Study, Parlor & Formal Rooms

**Existing purpose:** Glass Eye portrait; Piano Roll; Silver Emblem; Founder portrait; Old Estate Survey; Stag Crest; reliquary; Ceremonial Censer.

**Absorbed night-map purpose:**
- selective study/parlor sconces and rare warm window response;
- night horror/story Regions may make the rooms feel recently occupied;
- portrait/piano/reliquary/survey remain puzzle-owned, not light-owned.

**Lighting Regions**
- `dbx:central-lodge:m2:region:light:study`
- `dbx:central-lodge:m2:region:light:parlor`
- `dbx:central-lodge:m2:region:light:formal-periphery`

## M3 — Kitchen & Service Wing

**Existing purpose:** Bell Board + Bell Pull; Bell Crest; route to B2.

**Absorbed night-map purpose:**
- practical kitchen/service lights create sparse working illumination;
- active-use evidence can become more explicit after nightfall;
- hidden service passage lighting is puzzle-state-owned and turns on only if justified after opening.

**Lighting Regions**
- `dbx:central-lodge:m3:region:light:kitchen-main`
- `dbx:central-lodge:m3:region:light:service-corridor`

## U1 — Family & Guest Rooms

**Existing purpose:** House Proof; Crown Crest; family records.

**Absorbed night-map purpose:**
- upper corridor and selected family-wing sconces;
- guest rooms stay uneven and dark;
- state-gated story Regions can make absence/recent-use clues change in emotional meaning after dark.

**Lighting Regions**
- `dbx:central-lodge:u1:region:light:upper-corridor`
- `dbx:central-lodge:u1:region:light:family-wing`

## U2 — Servants’ Quarters, Nursery & Attic

**Existing purpose:** Glass Eye; Brass Gnomon; Piano Roll.

**Absorbed night-map purpose:**
- servant corridor reacts to night;
- nursery and attic remain story/horror controlled rather than automatically illuminated;
- childlike apparition beats belong here as night/story-gated Horror Regions.

**Lighting Regions**
- `dbx:central-lodge:u2:region:light:servant-corridor`
- `dbx:central-lodge:u2:region:light:nursery` — story/horror-owned
- `dbx:central-lodge:u2:region:light:attic-stair` — story/horror-owned

## B1 — Cellar & Utility Basement

**Existing purpose:** Water Control Wheel; Rail Proof; flood clearing.

**Map-consolidation implication:** no day/night duplicate needed. Daylight is irrelevant.

**State Regions**
- `dbx:central-lodge:b1:region:system:utility-light`
- `dbx:central-lodge:b1:region:system:underworks-access`

Lighting reacts to utility/flood state, not sunset.

## B2 — Hidden Annex & Sacrificial Preparation Area

**Existing purpose:** M3 route; Cicada Wing I; sacrifice evidence.

**Map-consolidation implication:** no day/night duplicate needed.

**State Regions**
- `dbx:central-lodge:b2:region:story:prep-area-light`
- `dbx:central-lodge:b2:region:story:hidden-route-light`

Lighting implies recent maintenance/current use.

## C1 — Hidden Chapel / Shrine of Asmodeus

**Existing purpose:** Covenant Seal + Censer → C2.

**Map-consolidation implication:** ritual state owns illumination.

**State Regions**
- `dbx:central-lodge:c1:region:system:shrine-light`
- `dbx:central-lodge:c1:region:system:ritual-periphery`

## C2 — Cult Records & Ritual Undercroft

**Existing purpose:** Child Bracelet pedestal; Cult Passage Diagram; Infernal Cicada Body; Measure/Rhythm clues.

**Map-consolidation implication:** puzzle/story state owns illumination.

**State Regions**
- `dbx:central-lodge:c2:region:story:records-light`
- `dbx:central-lodge:c2:region:puzzle:firstborn-pedestal-light`
- `dbx:central-lodge:c2:region:puzzle:cicada-altar-light`

## N1 — Underworks Hub / Lodge Railway Station

**Existing purpose:** House + Garden + Rail Proofs power/authorize railway.

**Map-consolidation implication:** railway power state replaces any need for time-state duplicate.

**State Regions**
- `dbx:central-lodge:n1:region:system:platform-light`
- `dbx:central-lodge:n1:region:system:controls-light`

## N2 — Underground Grotto / Garden Station

**Existing purpose:** flooded until B1; teaches walkable tunnels.

**Map-consolidation implication:** flood/railway state owns lighting.

**State Regions**
- `dbx:central-lodge:n2:region:system:platform-light`
- `dbx:central-lodge:n2:region:system:grotto-route-light`

## N3 — Collection Vaults / Underground Depot

**Existing purpose:** baggage locker/Route Plate; Departure Board; missing switch handwheel; Cicada Wing IV; Cartography Table route overlay.

**Map-consolidation implication:** railway/cult activity state owns lighting.

**State Regions**
- `dbx:central-lodge:n3:region:system:depot-light`
- `dbx:central-lodge:n3:region:puzzle:departure-board-light`
- `dbx:central-lodge:n3:region:puzzle:cartography-table-light`

Do not let lighting directly reveal the correct route overlay.

## T1 — Lodge ↔ Grotto Walkable Railway Tunnel

**Existing purpose:** Cicada Wing III; teaches physical tunnel travel.

**State Regions**
- `dbx:central-lodge:t1:region:system:tunnel-light`
- horror/story Regions for dates, graffiti, sealed doors, cargo evidence as authored.

## T2 — Grotto ↔ Depot Walkable Railway Tunnel

**Existing purpose:** Railway Switch Wheel; black-triangle clue; recent passage evidence.

**State Regions**
- `dbx:central-lodge:t2:region:system:tunnel-light`
- story Region for black-glass/black-triangle comparison.
- story Region for recent passage evidence.

## T3 — Abandoned Spur / Cult Railway Extension

**Existing purpose:** Recent Route Fragment; invocation fragments; Measure/lyrics reveal; official railway ends but tunnel continues.

**State Regions**
- `dbx:central-lodge:t3:region:system:abandoned-spur-light`
- story Region for route-map mismatch.
- story Region for invocation/Measure reinterpretation.
- Horror Regions may intensify because this is late-stage active-cult territory.

## F1 — Ancient Infernal Threshold

**Existing purpose:** completed Infernal Cicada; Measure/ward logic → F2.

**Map-consolidation implication:** encounter state owns all light.

**State Regions**
- `dbx:central-lodge:f1:region:puzzle:cicada-recess`
- `dbx:central-lodge:f1:region:puzzle:inner-ward`
- `dbx:central-lodge:f1:region:system:infernal-light`

## F2 — Final Summoning Chamber

**Existing purpose:** living cult and incoming Fiend Machine; no conventional puzzle lock.

**Map-consolidation implication:** final encounter/ritual state owns all light.

**State Regions**
- `dbx:central-lodge:f2:region:system:ritual-light`
- `dbx:central-lodge:f2:region:story:summoning-state`

---

## Build requirement

Each PREPARE now includes a **Region Ownership Table** with:

- stable Region ID;
- class;
- physical anchor;
- trigger/state gate;
- player-facing effect;
- whether it is day/night-controlled;
- whether it owns one or more AmbientLights;
- reset/cooldown behavior;
- puzzle/story dependency;
- VERIFY observation.

This is the mechanism that ensures removed duplicate-map purposes are not lost.
