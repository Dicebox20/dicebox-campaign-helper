# DiceBox Scene Injector — M03 Security Machinery — PREPARE DRAFT v2 — M02 Exit Topology Correction

**Scene:** M03 of six, `dbx.heist.kurth.m03.security-machinery`  
**Stage:** `PREPARE_DRAFT_REVIEW` — user-confirmed exit topology only; M03 geometry, artwork, macro, and Foundry operations not authorized.  
**Source:** `Dicebox20/dicebox-campaign-helper`, feature branch `feature/dicebox-scene-injector-v2-1-beta-2026-10-16`, review head observed `353a0a24481c581d661d52a0e30c0201cfa4ab39`. Accepted `main` retains governance authority. Revises Library M03 PREPARE draft v1, which remains historical.

## Canonical continuity — user-confirmed M02 exit correction, 2026-10-17

M01 **The Dark Arch** → M02 **Kurth Tower Reception** (Sarmenti) → M03 **Security Machinery** (Grimgor) → M04 **Luminary Cipher** (5×5 Lights Out; Sir Toppleton) → M05 **Oathbound Chamber** (Lurfaenelynn) → M06 **Inner Vault** (Glow). The vault objective remains unspecified. Six PCs and Jim Darkmagic as a nonmechanical narrative guide.

**M02 player-facing art reference:** user-supplied color M02 Reception PNG, 1619×971, SHA256 `80f4196a7a2f76c6b327c4b19193752720497c16a7ee3586dd8bde2281133155`. This is a visual and narrative continuity reference only. Its pixels are not authoritative native Walls, Region/teleport UUIDs, or stair geometry. Preserve historical selected grayscale SHA256 `a342988f238b42162af2052ed37fc4513c9dff1553e6c64a83273aeb5c4371f4` without replacing it.

**Exactly two distinct M02 exit intents (not two M03 arrivals):**

1. **M02-NORTH-FOREST-EXIT — separate exterior transition, destination unresolved.** From the reception building, a northern exit leads **outdoors into a forest-like environment**. No route, map identity, Region UUID, return landing, or onward connection from this forest to M03 is approved. Do not show the forest as the M03 northern control gallery or declare it an alternative M03 infiltration route.
2. **M02-NE-DESCENDING-STAIR — proposed M03 access.** The northeast stairwell **starts on the existing M02 Reception floor**, then **descends** to a different, lower level. It is incorrect to describe that stairwell itself as already being "on" the lower level. The bottom-of-stair landing on that lower level is the **working candidate** for an M03 arrival, not yet verified or bound. Exact stair count, rise, relative elevation, landing footprint, M02→M03 Region UUID and Foundry runtime transition remain UNKNOWN.

**PREPARE authority boundary:** User explicitly accepted the exit classification and asked to keep the northern forest destination separately unresolved. The user has **not** yet approved M03's 40×24 footprint, room polygon geometry, M03 lower landing or M03 internal route layout. Never fill unknown coordinates/elevations from the raster or older M02 macro. M02 is user-closed for design; that is not itself a Foundry VERIFY receipt.

**M04:** The 5×5 Lights Out challenge belongs solely to M04 and is neither recreated nor solved in M03.

## Narrative and challenge intent (proposal, not locked lore)

A richly engineered security deck within Kurth Tower: humming gears, movable shutters, counterweights, warning lamps, pressure conduits, and a main interlock controlling the deeper tower. This is **Grimgor's** opportunity to use practical ingenuity and teamwork to manipulate security. Security machinery should create a tense heist challenge without forcing a second Lights Out puzzle, one predetermined skill roll, or combat.

The team may disable or divert a security subsystem, pass as authorized technicians, reroute via operator controls, or physically navigate maintenance passages. Some actions cost time, create noise or escalate attention. None should permanently dead-end the six-player game.

## Spatial plan — proposed only

**Profile:** propose 40×24 five-foot logical spaces; Gridless, 120px/5ft, 4800×2880 pixels, zero padding. This is a planning target pending user approval, not a generated or approved image. **Camera:** strict 90-degree overhead orthographic battlemap, camera perpendicular to the ground plane, no perspective tilt, no horizon.

| Relative sector | Functional space | Gameplay job |
|---|---|---|
| WEST | Secured arrival landing | Provisional six-PC staging at the bottom landing of the M02 northeast descending stair (M03 link still unbound) |
| CENTER | Main machinery gallery | Large-token-capable primary access past heavy gears and security shutters |
| NORTH | Control/surveillance gallery | Operator panel, authorization observation and a controlled alternative route |
| SOUTH | Pressure/maintenance works | Service valves, isolated steam equipment and a physically navigable alternate route |
| EAST | Inner interlock vestibule | A controlled, safe post-interlock landing to M04, entirely within tower |

**Conceptual topology only (not a Spatial Blueprint).** M02 north forest is explicitly OUTSIDE this M03 graph:

```text
                      NORTH / OPERATOR CONTROL
             +----------------------------------+
             |     Control gallery / north lane |
[NE stair ↓] +---> Central machinery gallery --+--> [M04 puzzle vestibule]
bottom land. |     Service / south bypass       |      east-secured landing
             +----------------------------------+
                      SOUTH / MAINTENANCE
```

No relative line in this sketch is a committed Wall, door, teleport or gameplay clearance. The east landing and all three paths must connect on actual floor surfaces after GEOMETRY AUTHOR.

## Three meaningful routes (independent GEOMETRY INSPECT required)

1. **CENTRAL — Large 10ft hard sweep** (15–20ft preferred open circulation): proposed M03 bottom-of-stair landing → central machinery → security interlock → M04 staging. Physical locks/shutters can challenge access, but obstacles cannot erase the minimum footprint.
2. **CONTROL — Medium 5ft hard sweep** (10ft preferred): same proposed lower landing → M03 internal northern operator gallery → secured-side return to east interlock → M04 staging. Working controls, impersonation, surveillance diversion, or borrowing an authorization may allow access.
3. **MAINTENANCE — Medium 5ft hard sweep** (10ft preferred): same proposed lower landing → south pressure service → physical service bypass → east safe landing → M04 staging. The GM may adjudicate repairs, isolating pressure or noisy manual cranking.

The two alternate routes must be real connected passages to the secured eastern destination, not dead ends or decorative catwalks. Test the main interlock closed and each alternate accessible separately; test the all-closed condition for security leaks. A fail-safe GM recovery path and fair chance to retreat are required. Any vertical catwalk requires authored safe stairs/ladder/lift, real elevation, and landing clearance; do not assume an elevation or climb height now.

## Proposed security encounter (no required script/rolling rules)

**Step 1 — Read the system:** indicate which shutters/interlocks, monitoring and pressure components are active. Players can observe and understand their options. M02's proposed Quiet / Suspicious / Alarm posture may inform the scene as GM adjudication only; no automatic persistence or new state owner is authorized.

**Step 2 — Choose an intervention:** manipulate a manual counterweight lock, isolate a steam pressure circuit, divert or spoof an operator command, or navigate the maintenance route. Offer meaningful help to multiple PCs. Grimgor's spotlight is thematic, not a declaration of his class, proficiencies, or guaranteed success.

**Step 3 — Resolve consequences and cross:** noisy handling may raise scrutiny or restrict a route; quiet success may avoid alarms or make passage easier. Failure must never silently spawn NPCs or overwrite Foundry state. M03's controls cannot reveal, complete, reset or bypass M04's 5×5 Lights Out board.

**No numeric DCs, initiative, mandatory combat, fixed code, timer, or trap damage are approved in this draft.** Those require authored mechanics and separate review.

## Objects, Regions and ownership

Permanently static engine frames, ducts and gears belong to **Background Objects** in the artwork when their shapes are approved. Anything actually moving, lockable, selectable, repairable or visibility-changing must be represented through an explicitly approved native Foundry Wall/door/Tile/Region or validated adapter; avoid painting a moving barrier into immutable background art. No automatic guards, construct tokens, Jim token, labels or grid. The number of hidden discoveries is **0**.

**Proposed GM-hidden Region intents, not implementation:** `dbx.heist.m03.arrival.secured`, `dbx.heist.m03.control.console`, `dbx.heist.m03.access.maintenance`, `dbx.heist.m03.transition.luminary`. These have no planned RegionBehavior or automatic teleport until reviewed, schema-bound and authorized.

## GEOMETRY AUTHOR and INSPECT acceptance gates

- Treat the M02 northern forest exit as out-of-scope for M03 connectivity; no forest-to-M03 transition is defined. Independently resolve the exact top of M02 northeast descending stairs, its **different, lower-level** bottom landing, rise, clearance, return transition, and actual M03 entrance through approved source/runtime evidence before any bound geometry.
- Center route passes a true swept **Large 10ft** footprint across ground floor, barriers and static solids; side routes pass **Medium 5ft**. Preferred aesthetic bands are not hard maxima.
- All three routes have actual safely accessible east destinations. Main locked state and north/south independent route conditions are tested.
- Prove no Wall/door leakage, painted-fake opening, accidental external access, blocked props, unsupported catwalk or uncontrolled pit/water/steam crossing.
- Each security interlock has a stable semantic feature ID and explicit ownership; controls may not reach into M04 puzzle state.
- Six PCs have usable staging area at the proposed bottom-of-stairs landing without treating the stairs as already on the lower level; no token scale changes, autogenerated NPCs, exterior back entrance, outdoor shortcut, or duplicate M02 geometry.
- Final M04 transition arrival and return routing remain fail-closed until validated.
- Record geometry uncertainty as NEEDS_RECONCILIATION; do not automatically create another render.

## Workflow and explicit stop point

`PREPARE [this draft] → GEOMETRY AUTHOR → GEOMETRY INSPECT → EMBOSSED GRAYSCALE RENDER → STRUCTURAL INSPECT → FEATURE MANIFEST / SPATIAL BLUEPRINT RECONCILIATION → OFFLINE STRUCTURAL BUILD → PAINTERLY RENDER → FINAL INSPECT (PASS auto-approves exact art) → FINAL INJECTION ASSEMBLY → STAGE → INJECT → VERIFY → RECEIPT`.

Exactly one `.md` containing one executable JavaScript macro is the final BUILD transport. **No BUILD exists for M03**, and neither this Markdown design nor any future generated image is installation authority.

## Governance/KB checkpoint and required review

Read `AGENTS.md`, current injector skill, post-structural-BUILD painterly override and October 17 M02 handoff on the review branch. GitHub seed.sql and relevant dated KB seed.d records were inspected; they provide M02/Security Machinery sequence context but no standalone accepted M03 geometry/mechanics rule. The compiled SQLite KB was **not** directly queried in this environment, the active-slice machine checker was **not** run, and no new KB seed was rebuilt/verified. Consequently **this remains a PREPARE proposal**, not a promoted accepted Scene record. Before GEOMETRY AUTHOR or any accepted-change promotion: query approved read-only SQLite, reconcile any conflicting newer decisions, record a dated seed delta, rebuild and verify with canonical scripts, and reread the active stage. The selected M02 player-facing image is a new paint candidate requiring its own review; no inference of exact M02 installed Walls/Regions is made.

**Confirmed:** north exit leads outdoors into forest; destination beyond the exit separately unresolved. Northeast staircase begins on M02 and descends to a different lower level; the M03 arrival at its bottom landing is a working proposal only. **Still for later review:** M03 40×24 footprint, M03 galleries/internal routes and encounter, landing/elevation/teleport binding, and M04 transition. No request to regenerate M02, author geometry, render M03 or modify Foundry.