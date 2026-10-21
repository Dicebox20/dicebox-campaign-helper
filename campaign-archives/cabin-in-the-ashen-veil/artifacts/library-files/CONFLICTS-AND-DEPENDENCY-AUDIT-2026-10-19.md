# Cabin in the Ashen Veil — Conflict Register and Puzzle Dependency Audit
**Date:** 2026-10-19. **Sources:** newer explicit campaign chat over older Library `START-HERE.md` / `E06-CHAUNTEA-OFFERING-CANON-2026-10-18.md`; DiceBox repo `main` AGENTS.md blob ec6cd9ec46df104c73d8d38654eb39b717699ef9 checked. Design-level audit, NOT executed against Foundry, KB database, source code or runtime.

## Explicit supersessions / reconciled contradictions
| ID | Old claim or temporary idea | Current controlling decision | Resolution |
|---|---|---|---|
| C01 | Chauntea kneeling statue and offering bowl in E06 | Statue is **Sune**, mother a Sune cleric, Bowl is **Sune's Scrying Bowl** | Superseded; old Library Chauntea record historical only |
| C02 | Memorial Clearing as crypt/graves / ancestor cemetery | Father **built estate**, Sune's Grove intentionally crafted in harmony with woods, **no graves** | No grave scene, avoid generic tomb markers |
| C03 | Fixed 29-map IDs, E06 mandatory scene | Map registry allowed to change; optional concept of 5 grove maps; only original grove reference accepted | No ID and no five-map geometry locked |
| C04 | Sune stone relief as framed portrait or separate plinth/monument | **Embossed stone relief concealed in rear/side of center statue base** | Use masonry, not hanging painting; front hands separate |
| C05 | Drain pond to uncover sliding relief | Impossible cycle: Brass Key in relief → Study/587 → crank → drain pond | **Rejected.** Must reveal via four busts and winder independent of study |
| C06 | Brass Key in parents' coat / early Study | **Old Iron Key** is in coat, **Brass Key** under 1,000 gp bag in relief vault | Keys placed unambiguously |
| C07 | Code 987 or Great Room 029 | Study note **587**, Great Room lockbox **027** | Respect distinct numbers |
| C08 | Sune powers source charging in statue hands | **Removed** due Region complexity; Sune hands for bowl alone | Gondian charger located in aqueduct, simple item drop/charge |
| C09 | Source precharged / immediately useful | Source **uncharged** inside Rufus; return to aqueduct charging station, no added minigame | Second eye gates late discovery |
| C10 | Rufus missing one eye | **Both eyes missing**; eye 1 from bear, eye 2 late unplaced; both needed to open mouth/button/body | One-eye actuation superseded |
| C11 | Gond power source inside gazebo / Mosaic hidden room | **Inside Rufus**, accessed by both-eye mechanism | Prior proposed placements rejected implicitly |
| C12 | Two final key halves counted as two requirements AND an extra activation part counted third | Four branches: basement access, charged power, first emblem half, second emblem half. Joined halves operate final vault. | **No fifth independent activation lock presumed.** Physical mechanism remains to specify |
| C13 | Original gear removed intentionally | Aqueduct gear **shattered**; replacement discovered via chimney clock | Keep repair logic |
| C14 | Old unfinished 'Null Child mouth truth' | Null Child is incomplete miscarried consciousness projection, mouth only cosmic horror effect | Do not revert interpretation |
| C15 | Multiple illustrated renders of Sune grove accepted | First generated grove map accepted only as visual concept; later five explicitly rejected | Do not reuse rejected images |
| C16 | Study Gond/Sune books finalized canon | Assistant wrote three sample Journal entries; user requested lore, did not approve exact text | Mark drafts pending acceptance; paired-deity theme established via emblem |

## Current directed prerequisite graph (dependency DAG at conceptual level)
`WINDER_LOCATION [OPEN] + BUST_ORDER_CLUE [OPEN] → FOUR BUSTS (ordered) → CONCEALED RELIEF → FAMILY VAULT 1000 GP + BRASS KEY → STUDY → (587 → DONOVAN LOCKBOX → SLUICE CRANK → DRAIN POND → WEATHERED KEY → BASEMENT → WORKSHOP HANDLE)`

`STUDY → TINY KEY → FOYER HOUR HAND` and `ATTIC → MINUTE HAND`; `BOTH HANDS → CHIMNEY CLOCK 12:00 + CENTER BUTTON → REPLACEMENT GEAR`.

`DRAINED POND + WORKSHOP HANDLE + REPLACEMENT GEAR → AQUEDUCT OPEN → (GONDIAN CHARGER; FOREST WELL → MAZE → GAZEBO → LAST STORYBOOK)`.

`PARENTS ROOM OLD IRON KEY → SOPHIA ROOM → FIRST RUFUS EYE, MOSAIC`.

`SECOND RUFUS EYE [OPEN, LATE] + FIRST EYE + STUDY → RUFUS MOUTH/BUTTON/BODY → UNCHARGED POWER SOURCE`; `POWER SOURCE + ACCESSIBLE AQUEDUCT CHARGER → CHARGED POWER SOURCE`.

`SIX STORYBOOKS (including gazebo book) → SPINE MOSAIC → HIDDEN ROOM [REWARD OPEN]`.

`CRESCENT HALF A [OPEN] + CRESCENT HALF B [OPEN] → INTERLOCKED ROUND EMBLEM WITH GOND AND SUNE ARM IN ARM`.

`BASEMENT ACCESS + CHARGED POWER SOURCE + EMBLEM HALVES → FATHER'S SECURED VAULT [EXACT PHYSICAL MECHANISM OPEN] → SUNE BOWL → STATUE HANDS + WATER PELLET (GREAT ROOM 027) → UNDERCROFT ACCESS`.

## Missing-edges / pacing warnings
1. **Hard blocker:** Mechanical clockwork winder has no approved location, and bust activation order has no approved clue. The Brass Key and all downstream waterworks may be inaccessible until fixed. Do not place either behind Study, pond or aqueduct.
2. **Hard blocker:** Rufus eye 2 not placed. Cannot obtain power source until placed. Place late; not inside secured final vault or behind charging requirement.
3. **Hard blocker:** Two emblem halves unplaced. Candidate Gazebo and Mosaic are **proposals only**. Finish main Gazebo puzzle and bookshelf reward before allocating.
4. **Pacing:** Basin/basement access is earlier than late power/key halves by design; all *last components* should arrive near end without forcing simultaneous completion or hidden timers.
5. **Logical nuance:** The Weathered Key opens **basement access**, not mechanically 'lock one on the bowl vault'; final vault machine's exact location is not yet a verified accepted map placement.
6. **Ordering:** Gazebo book is required for Mosaic; anything from Mosaic cannot be required to enter aqueduct or maze.
7. **Potential circularity:** If the second eye is placed inside Mosaic, then it arrives after Gazebo book, which may make power source late, but is still acyclic if neither half/charged power needed for Gazebo/Mosaic. Test after choice.
8. **Discovery:** Clock rooftop access via upstairs windows; chimney-flue book independent of hands puzzle. Don't demand final key half / vault power to reach roof.
9. **Gondian charger:** User explicitly forbids an extra charging minigame. Distinct accessible aqueduct station needed; verify backtracking from late eye retrieval through Studio/Study → aqueduct and final vault.
10. **Technical risk:** Two separate interactions on statue base and hands are concept only, not proof of multiple-stage Region support. Keep statue hands exclusive to bowl; relief region separate; no code/testing yet.
11. **Spatial conflict:** Old B06 Thayan lab versus E06 final undercroft remains historically contradictory. New design favors undercroft below Grove and family's secured vault accessible from basement; **precise relative positions and boundaries unresolved**. Do not invent topologies.
12. **Metaphysics:** Vharzagul is a yugoloth, separate demon/Abyssal intrusion unresolved; do not call Vharzagul a demon.
13. **Game resource balance:** 1000 gp is accepted amount but economy/timing/gameplay consequences not yet balanced. Coin stash and key discovery when *lifting bag*, not merely vault opening.
14. **Storybook exact sequence:** Six titles accepted, chronology and which two preplaced unknown; must settle before implementing book puzzle. Book title *Felix Fox* assigned to hollow log.
15. **Map prompt hygiene:** User forbids directions, campaign lore, invisible geometry or other scene references in image render prompts. Map painting is deferred; recent five-image generation rejected.
16. **No skill DC assignments** until location objects and puzzle links complete.

## Suggested deterministic validation before implementation
- Model each required reward and gate as directed nodes with prerequisites; identify strongly connected components. No required-item cycles.
- Starting inventory empty, initial map access parents bedroom/Studio/Great Room/Sune's Grove, repeatedly unlock reachable actions; verify final Sune Bowl and Undercroft become reachable **without guessing codes** and all mandatory items collectable.
- Explicitly assert: `BrassKey → Study → 587 → Crank → DrainedPond` (never reverse); `AqueductOpen → GazeboBook → Mosaic`; `RufusEye2 → Power → Charger` with charger accessible from pond/clock actions; `Bowl → Statue` never `Statue → Bowl` required for bowl acquisition.
- Check neutral player labels, one- or two-eye Rufus state persistence, correct 027/587, both clock hands required, all four bust order state, Region interaction separation.

## Provenance and pending sync
- **Verified consulted:** Repo `AGENTS.md` in main with blob SHA above; older Library `START-HERE.md` and `E06-CHAUNTEA-OFFERING-CANON-2026-10-18.md` as historical baseline; available in-chat decisions including explicit supersessions.
- **NOT performed:** SQLite KB full query/rebuild, active-slice state check, GitHub roadmap/KB commit, Foundry runtime, artwork FINAL_INSPECT, live regions. Thus this is a **continuity checkpoint awaiting canonical synchronization**, not acceptance receipt.
