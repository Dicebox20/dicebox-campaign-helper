# F2 — Final Summoning Chamber — PREPARE v001

**Campaign:** Central Lodge  
**Scene ID:** F2  
**Stable Scene ID:** `dbx:central-lodge:f2`  
**Workflow:** PREPARE → RENDER → INSPECT → BUILD → IMPLEMENT → VERIFY  
**Phase:** PREPARE  
**Status:** PASS  
**Logical scale:** gridless battlemap-120, 36 × 24 logical spaces, 4320 × 2880 px, 5 ft per 120 px

## Purpose

F2 is the final summoning chamber beyond F1's inner threshold. It is the first place where the campaign's late mystery fully resolves into an active infernal ritual. The deepest cultists are still alive, impossibly sustained, and are actively summoning Fiend Machine. Fiend Machine is incoming rather than already resident in the chamber.

This Scene is not a conventional puzzle lock. It is an encounter / ritual-disruption space with strong positional gameplay, readable ritual architecture, and multiple tactical lanes.

## Canon locks

- The cult created and used the ancient passage into the Hells. Fiend Machine did not create the passage.
- The cultists in this chamber are alive and actively performing the summoning.
- Fiend Machine is incoming, not physically present on the base map.
- No new conventional key-item puzzle gates F2.
- Ritual text, lyrics, moving manifestations, cultists, summoned figures, infernal light, animated effects, and encounter-state changes are runtime Foundry content, not baked into the background.
- Horror progression reaches **Summoning** here.
- The chamber architecture is older than the estate and should feel like an ancient infernal ritual site later occupied and maintained by the cult.
- The background must remain playable if all runtime effects are disabled.

## Topology

The map is a broad subterranean ritual chamber entered from the lower/southern side through one ancient threshold passage.

Permanent geometry:
- one southern entry passage from F1;
- a broad central ritual floor with a large circular or concentric architectural dais;
- an elevated northern ritual focus / apse area with stairs or shallow stepped approach;
- two side circulation lanes, east and west, wide enough for flanking and movement;
- broken ancient columns / piers or masonry buttresses that create partial cover without choking movement;
- shallow recessed trenches, channels, or carved radial grooves in the stone that visually organize the chamber;
- two to four secondary raised platforms or side alcoves suitable for cultist positions;
- no second map exit required beyond the F1 entrance unless future epilogue design explicitly adds one.

Tactical goals:
- clear line-of-sight choices;
- at least three meaningful approach lanes toward the ritual center;
- partial cover around the perimeter;
- a central area large enough for a boss-scale manifestation / portal effect at runtime;
- no narrow chokepoint that forces the whole party into one line.

## Background-only visual content

Permanent visible content:
- ancient blackened stone, cracked and worn;
- concentric ritual architecture carved into the floor, but no readable text;
- old iron or bronze fittings embedded into walls/floor;
- ruined stone benches, plinths, or sacrificial furniture remnants;
- maintenance traces showing the chamber is actively used: swept paths, repaired steps, recent timber braces, replaced hardware, stacked practical supplies;
- restrained infernal architectural motifs that read as old cult construction, not modern music imagery;
- a large central void / socket / circular focus that can receive Foundry portal and summoning effects;
- visible but unlit braziers / sconces / lamp fixtures where plausible.

Do not render:
- Fiend Machine;
- cultists or creatures;
- active portal;
- glowing runes;
- readable lyrics or writing;
- blood-written text;
- active flames;
- spell effects;
- apparitions;
- tokens;
- UI;
- grid;
- Region markers.

## Runtime state ownership

FOUNDRY EFFECT owns:
- ritual glow;
- infernal portal / summoning manifestation;
- cultists and encounter actors;
- summoned creatures;
- Fiend Machine arrival manifestation if/when triggered;
- active braziers and ritual lights;
- soundscape;
- environmental pulses / smoke / embers;
- ritual disruption stages;
- final encounter state changes.

STATEFUL / TILE content may own:
- breakable or disruptable ritual anchors;
- sealed containers / ritual props if later needed;
- staged portal overlays;
- destroyed / disabled ritual focus states.

## Encounter structure

The Scene begins in an **ACTIVE RITUAL** state.

Recommended encounter beats:
1. Entry: players see living cultists already working the ritual.
2. Escalation: ritual anchors / positions are identifiable through action, not a locked puzzle.
3. Disruption: player choices can reduce or distort the summoning.
4. Threshold event: Fiend Machine begins to arrive or project into the chamber through Foundry runtime effects.
5. Resolution: encounter outcome determines whether arrival is interrupted, partial, or completed.

Do not encode a single mandatory skill sequence. Combat, targeted disruption, environmental interaction, and ritual-counterplay should all be viable.

## Region Ownership Table

| Stable Region ID | Class | Physical anchor | Trigger / state gate | Player-facing effect | Day/night | Owns AmbientLights | Reset / cooldown | Dependency | VERIFY |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `dbx:central-lodge:f2:region:transition:f1-arrival` | transition | southern entry passage | Scene entry | arrival / return anchor | no | no | none | F1 transition | shape and anchor align with entrance |
| `dbx:central-lodge:f2:region:system:ritual-core` | system | central circular ritual floor | ritualActive | owns encounter ritual state and portal manifestation | no | yes | encounter-state | final ritual | Region and lights align with core |
| `dbx:central-lodge:f2:region:system:ritual-light` | system | central + northern ritual fixtures | ritual stage | staged infernal lighting | no | yes | state-driven | ritual state | all enabled lights have plausible fixture anchors |
| `dbx:central-lodge:f2:region:story:summoning-state` | story | northern focus / ritual dais | first approach / GM state | confirms active living cult and summoning context | no | no | once per character or GM-gated | final reveal | behavior fires once without chat spam |
| `dbx:central-lodge:f2:region:encounter:west-anchor` | system | west ritual station | encounter state | western disruption / positional interaction anchor | no | optional | encounter-state | ritual disruption | physical anchor readable and reachable |
| `dbx:central-lodge:f2:region:encounter:east-anchor` | system | east ritual station | encounter state | eastern disruption / positional interaction anchor | no | optional | encounter-state | ritual disruption | physical anchor readable and reachable |
| `dbx:central-lodge:f2:region:encounter:north-focus` | system | elevated northern ritual focus | encounter state | high-value ritual focus / escalation anchor | no | optional | encounter-state | ritual disruption | elevation and access readable |
| `dbx:central-lodge:f2:region:system:arrival-manifestation` | system | central void / summoning socket | arrivalStage > 0 | Fiend Machine arrival effect staging | no | yes | state-driven | final encounter escalation | no permanent creature baked into art |

## Lighting

All F2 lighting is encounter / ritual-state owned.

Base renderer:
- neutral dim subterranean exposure;
- unlit fixtures visible;
- no active infernal glow.

Foundry lighting groups:
- `ritual-core`
- `ritual-periphery`
- `arrival-manifestation`

Lighting should progress from restrained ritual illumination to stronger infernal response as the summoning advances. No strobe or rapid cycling.

## Walls / movement

BUILD should wall:
- outer chamber perimeter;
- column / buttress solids as needed;
- raised platform edges only where they physically block movement;
- southern entry threshold;
- any genuine alcove separations.

Do not over-wall decorative floor grooves, shallow steps, or open ritual rings.

## Discovery policy

F2 has **0 ordinary discovery Regions**.

All important information is encounter-visible or story/interaction-owned. This avoids turning the finale into another hidden-object sequence.

## Render capsule

Strict 90-degree overhead orthographic fantasy battlemap, 3:2 landscape composition. A vast ancient subterranean ritual chamber of blackened stone entered through one passage centered on the lower edge. Broad central circular ritual floor with concentric carved stone architecture and a large empty circular focus at its center. Elevated northern stone ritual dais reached by shallow broad steps. Wide east and west circulation lanes, broken old columns and masonry piers creating partial cover, several small raised side platforms, worn stone benches and plinths, old iron and bronze fittings, repaired stonework and practical maintenance traces. Cracked, damp, soot-darkened ancient masonry with restrained infernal ornamental geometry. Visible unlit braziers and wall fixtures. Neutral dim diffuse illumination, tactically readable architecture, clear movement lanes, realistic worn materials. No active glow, no flames, no portal, no creatures, no people, no readable text, no labels, no grid, no tokens, no UI.

## INSPECT acceptance

PASS requires:
- strict overhead orthographic view;
- one clear southern entrance;
- central ritual area large enough for runtime manifestation;
- readable north / east / west tactical lanes;
- no baked cultists, Fiend Machine, portal, flames, or readable text;
- no accidental modern/music imagery;
- no grid/UI/tokens;
- no perspective/horizon;
- permanent architecture remains useful if all runtime effects are disabled.

## BUILD target

Expected BUILD ownership:
- Scene 4320 × 2880, gridless;
- perimeter and structure Walls;
- 8 Regions as above;
- 0 ordinary discoveries;
- initial ritual lights disabled or staged to the chosen initial encounter state;
- F1 transition anchor bound to `Scene.La9krMOMBhAhDLi6` after F2 creation;
- runtime state flags under `flags.world.dicebox`;
- Region visibility `LAYER`, `locked:false`;
- no deprecated `Scene#background` access;
- exact `dicebox-scene-injector-build/v2` contract.
