# Cabin in the Ashen Veil — Sune's Memorial Clearing / Grove Interaction Design v1

> **SUPERSEDED FOR FINAL CHAIN (2026-10-21):** The owner has moved the **Scrying Bowl out of Allen's Vault** to a separate acquisition branch and changed the Vault reward to a **Keystone**. The Bowl + pellet now open an **explorable Undercroft** containing a **sealed final door**; the Keystone opens that door to the ritual chamber. **[Read controlling revision v2](./sune-memorial-clearing-puzzle-design-v2-2026-10-21.md).** The early bust puzzle and late NW chase portions of v1 remain applicable where not superseded.


**Prepared:** 2026-10-21.
**Authority/status:** **DESIGN PROPOSAL FOR OWNER REVIEW**, not automatically canon; no map render, implementation, Foundry state change, Regionwright build, or runtime verification. Existing user-approved fixtures, items and progression are distinguished below from proposed puzzle clue/microinteraction specifics.
**Source hierarchy:** Latest owner messages > [owner decision catalogue](./campaign-decision-catalogue-2026-10-20.md) > [October 20 puzzle audit](./artifacts/library-files/Cabin_in_the_Ashen_Veil_Puzzle_Chain_Audit_2026-10-20.md) > [original 1,321-message transcript](./campaign-chat-transcript.md) > older handoffs. The historical 29-map roster is discarded entirely. The separate 2026-10-19 Regionwright Sune sliding-portrait handoff is historical where its *separate standalone panel/3×3 mandate* conflicts with later accepted statue-base relief placement and the owner's decision to let Regionwright determine grid format.

## 0. Objective and concept

Treat this woodland sanctuary as **one reusable candidate scene with three independent player-facing systems** acting at different campaign phases:

1. **EARLY** (deliberate object/item interactions) — four windable busts SW→NE→NW→SE retract, revealing an embossed *stone* sliding relief at the **base of the central Sune statue**. Solving the relief reveals a small family savings compartment with a cloth bag of **1,000 gp**, accidentally concealing the **Brass Key** that unlocks Allen's Study.
2. **LATE NIGHTFALL** (spatial arrival/encounter Region) — after Aqueduct Waterworks progression and Allen's memorial-night warning, a return to the **northwest bust** triggers the **second Crooked Man chase**; **Silver Tiny Key** drops and remains recoverable afterward. This must never fire during the early bust sequence.
3. **FINAL** (deliberate inventory/fixture interaction) — the statue's **empty outstretched hands** receive **Sune's Scrying Bowl**, and the **water-filled Dust of Dryness pellet** is placed in the bowl's watertight slow-release chamber. Water runs through the original ornamental/engineered channels and reveals a physical route into the **Undercroft**. This is not triggered by merely approaching the statue.

The three systems have distinct interaction zones, persistent state, and state transitions. Neither the late chase nor the final water mechanism is allowed to automatically resolve the early sliding relief, and vice versa.

**Map-count caution:** User-approved exterior example labels the western Memorial Clearing and Sune Shrine; “Sune's Grove” is also used in continuity for the four-bust woodland sanctuary. This document **provisionally** treats shrine/clearing/Grove as one playable map for fixture planning, **not** a finalized name/scene boundary. No duplication or independent new shrine is authorized.

## 1. Owner-established physical appearance — must remain visible

- A carefully crafted woodland shrine built by Allen as a Sune sanctuary for Dahlia, not an inherited cemetery. Fitted stone architecture in harmony with woodland roots, vines, branches and ~50 years of overgrowth.
- Central Sune statue in a modest circular worked-stone space, with **empty outstretched hands subtly cupped to receive a bowl**. Hands are reserved solely for the final Scrying Bowl.
- **Four outer stone resting pads with winding, retractable Sune busts**, placed exactly **southwest, northeast, northwest, southeast** around the center. Each has a clockwork winding socket in its pedestal. Dirt trails and linked stone paths allow player access.
- **Concealed embossed sliding relief is on the statue's rear/base stone**, separate from its hands and hidden before correct bust activation. It must never look like a framed portrait or wall-hung painting.
- **Dry, shallow stone drainage/aqueduct channels**, precisely fitted movable-looking masonry, substantial foundations and subtle visual engineering without spoilers.
- **Exactly one child's grave** for the unborn son, integrated discreetly in the memorial surroundings (not a field of graves or a generic graveyard).
- Accessible path near northwest bust should be physically suitable for the second chase, with an identifiable safe return path. Route/traversability dimensions must be measured at map PREPARE/structural inspection rather than guessed.
- Tactile raised paving/stone detail appropriate to Sophia's blindness is supported by earlier continuity, but its precise pattern and location are a **visual proposal** pending owner acceptance.

### Feature / layer manifest proposal

| Stable design anchor | Visible initially? | Suggested render ownership | Runtime interaction |
|---|---|---|---|
| `grove:center-statue` | Yes | Static architectural art | Contains independent base and hands anchors |
| `grove:statue-hands` | Yes, empty | Hands static; inserted bowl as separate stateful visual | Explicit use Bowl |
| `grove:water-channels` | Yes, dry | Dry masonry static; running water separate overlay/state variant | Controlled only by completed bowl/pellet action |
| `grove:pedestal-sw/ne/nw/se` | Yes | Stone footings static; retracting busts independently switchable assets | Use Winder |
| `grove:relief-panel` | Initially concealed by stonework | Concealing panel as switchable tile/texture/door state | Regionwright puzzle UI only once exposed |
| `grove:savings-niche` | Hidden | State-controlled compartment cover and contents visuals | Search/open/take coins then key |
| `grove:nw-chase-approach` | Walkable path | Normal ground, not a visible game UI marking | Proximity Region conditionally starts late chase |
| `grove:child-grave` | Yes (subtle) | Static masonry/earth | Optional non-gated environmental narrative |
| `grove:undercroft-threshold` | Initially hidden | Hidden structural opening + native wall/door visual state | Enabled after final water mechanism |

Separate the **physical statue-base sliding puzzle**, **northwest footpath encounter**, and **statue hands** into different clickable/spatial anchors. Do not project two incompatible Region behaviors onto a single overlapping interaction zone. A native Foundry Region does **not** automatically establish click-to-interact; choose a verified tile/hotspot/Regionwright adapter at BUILD time.

## 2. Puzzle A — four wind-down busts (early)

### Canonical dependencies and outcome

- Input: Clockwork Winder from attic, available before Brass Key/Study and before draining pond.
- Sequence: **SW → NE → NW → SE**, with each bust descending into its pedestal after correct operation.
- Completion: reveal hidden stone relief in the **center statue base**.
- This sequence is distinct from the later northwest-bust chase.

### Proposed map cue and clue — NEW PROPOSAL, owner approval needed

Use the rose's life-cycle as a discoverable puzzle language, carved into Allen's decorative masonry rather than arbitrary compass labels:
- **SW** plinth: a **rose seed**.
- **NE** plinth: a **rising sprout**.
- **NW** plinth: a **closed rosebud**.
- **SE** plinth: a **fully opened rose**.

A central or nearby modest stone inscription could read:

> “From seed to stem, from bud to bloom; all beauty comes in its own time.”

This allows players to infer **SW→NE→NW→SE**, while still finding the appropriate tool and recognizing the four matching winder sockets. Because symbols are carved rather than paint-only, players can examine or feel them; they belong in visible render features. Nothing depends on reading Allen's Study, drained pond, or undercroft lore.

**Alternative if the owner finds this clue too obvious:** retain the symbol order but locate the sequencing text on a separate reachable stone bench/planter plaque within the same clearing. Do not hide the order clue in the Study (would cause a dependency cycle).

### Proposed player actions and transitions

| Start state / action | Proposed validation | Visible/audio response | Saved outcome |
|---|---|---|---|
| Player examines a pedestal | No prerequisite | Raised rose-symbol motif, winding socket and seam | No quest flag |
| Player uses Winder on SW | Owns Winder and stage=0 | Bust winds down into pedestal, soft stone/gear scrape | `bustStage=1` |
| Uses Winder on NE | Owns Winder and stage=1 | NE bust lowers | `bustStage=2` |
| Uses Winder on NW | Owns Winder and stage=2 | NW bust lowers **without triggering chase** | `bustStage=3` |
| Uses Winder on SE | Owns Winder and stage=3 | SE bust lowers; statue-base cover opens | `bustStage=4; reliefExposed=true` |
| Uses wrong bust | Winder present; sequence not complete | **PROPOSED:** mechanism rejects/reset with an audible dull clunk; all busts return raised, reusable Winder retained | `bustStage=0` |

The wrong-order response is an **unapproved proposed design choice**, not a user-established penalty. Any reset must be non-destructive and repeatable; a correct sequence cannot consume the reusable Winder. All four bust states should persist across reloads according to accepted challenge policy (including a clean reset on wrong sequence if adopted). If a GM resets the puzzle, it must reset visual and logical stage together.

## 3. Puzzle B — embossed sliding relief and family savings

**CANON:** Bust completion exposes the sliding relief *on the statue base*. Solving it yields 1,000 gp in a cloth bag; Brass Key is accidentally underneath cloth, revealed when the bag is lifted.

**Design proposal:** A recessed worked-stone Sune likeness split into interlocking movable carved plates. Interface opens by explicit click on the **exposed** base relief. Regionwright owns selection of grid/tile puzzle specifics: do **not** hardcode a 3×3 count simply because the historical handoff used that format, nor claim the Point Board is a functioning sliding-puzzle engine. Regionwright emits one validated `solved` event; a scoped Foundry adapter reveals the family niche. The reward and world state must never be embedded as unrestricted browser UI code.

| Action | Condition | State and presentation |
|---|---|---|
| Attempt base before busts solved | `reliefExposed=false` | Closed, fitted stone panel; mundane description of seams only |
| Open relief after all busts | `reliefExposed=true` | Sliding picture puzzle UI over embossed stone relief |
| Regionwright puzzle solved | Validated `solved` callback, not duplicate | Base stone recess opens; `reliefSolved=true`, `savingsNicheOpen=true` |
| Inspect open niche | Open | Small cloth bag of 1,000 gp shown; no key label or spoiler |
| Lift/take bag | Bag present | Gold available by accepted loot method; a small Brass Key appears **beneath the fabric** |
| Take key | Key present | Acquire player-visible **Brass Key**; `brassKeyTaken=true` |

Reward acquisition remains distinct from puzzle-solving (no auto-award merely by UI completion), and no repeated gold/key farming on revisit. Gold/key ownership/inventory handoff and event IDs need verification against Foundry runtime.

## 4. Encounter C — late return and second Crooked Man chase

**CANON:** The second Crooked Man chase **starts when players reach the NW bust on a *later* return**, late-game checkpoint after Waterworks and Allen's journal warning, before Crimson Veil. The Crooked Man drops **Silver Tiny Key #2** during pursuit; recoverable afterward for parents' Hope Chest/Music Box.

**Proposed two-stage gating contract:** The *in-world clue* and the *runtime chase permission* are separate.
- The journal warning is accessible inside the Waterworks Utility Room after the water-pressure puzzle; it directs Sophia to **avoid the Memorial Clearing at night**. Written/read by the party is the intended organic reason to revisit.
- A late-phase milestone, reached after Waterworks restoration and relevant exploration, **arms** the NW-bust encounter. Do not arm merely because the group visited Grove early, clicked the NW bust, or completed the four-bust puzzle.
- On qualifying player-token entry into a **localized NW approach Region**, when the late phase is armed and Crimson Veil is **not** active, the encounter runs **once** for the party/world. The trigger must not require the player to wind the NW bust again.

**Important safeguard:** Exact rule for `lateChaseArmed` remains **PROPOSED**: e.g. `waterworksRestored && lateCheckpointSet` with journal as discoverable clue. Avoid making "read a journal page" the only hard mechanical permission if it creates a softlock; allow a visible alternate clue or GM-authorized progression. The original Waterworks puzzle completion alone is not automatically synonymous with late nightfall.

### Proposed cinematic staging

1. Initial NW path appears familiar; bust remains in its solved early state if retracted.
2. As party enters near the NW resting area **after** late gating, a subtle unnatural scrape/elongated silhouette draws attention before the Crooked Man enters the visible path.
3. Chase begins. The region does **not** itself teleport players, solve a puzzle, or give the key. GM/approved encounter system handles threat.
4. During the chase the Crooked Man drops **one** Silver Tiny Key at a specific, findable point near his path; players can retrieve it when safe. Do not label it Hope Chest Key. A small visible metallic glint in gravel/roots can mark the drop.
5. Encounter remains resolved on revisit and the dropped key persists if not collected. Neither scene reloads nor another PC walking into the Region should produce a second chase/key.

**OPEN:** Full pursuit choreography, route width, how/can players be captured in this late encounter, exact drop site, return route to yard, what happens if the group remains at shrine, audio/light details. Preserve already-established Crooked Man pre-Crimson capture constraints and transition to fighting demons **after** Crimson Veil.

## 5. Final mechanism D — Scrying Bowl and water-filled pellet

**CANON:** The Sune statue hands are **only for Sune's Scrying Bowl** recovered from Allen's four-condition secured vault. The **already-filled teardrop Dust of Dryness pellet** comes from Great Room lockbox `027` (clue in Art Studio painting). Bowl contains a small **watertight chamber with a narrow hole** to dispense water **slowly** to carved channels. This opens access to Undercroft; no extra fifth collection gate.

| Player action | Condition | Visible/audible effect |
|---|---|---|
| Inspect empty hands | None | Curved hands subtly support a missing vessel, not an obvious labeled item slot |
| Use Scrying Bowl on hands | Party possesses Bowl; not already installed | Bowl visual appears aligned, `bowlPlaced=true`; small chamber/recess becomes accessible |
| Use water-filled pellet on bowl chamber | Bowl installed and pellet in party inventory | Pellet transfers into watertight chamber; slow water release activates channels |
| Mechanism finishes | Event validates Bowl + pellet exactly once | Carved dry channels become wet; concealed stone access to Undercroft physically opens; `undercroftOpen=true` |
| Party enters revealed access | Door/portal now open | Scene transition to Undercroft via an ordinary reachable threshold |

The **specific location and dimensions of the hidden stair/hatch/entrance remain OPEN**. Proposed: a discreet masonry seam in the circular walk beyond the statue base that becomes a real travel opening after the water cycle. Do not render an exposed staircase in early state, auto-teleport the party from anywhere in Grove, or combine this hotspot with the sliding-relief click area.

**Recovery policy:** The pellet should not be consumed until a successful validated insertion; GM recovery for failed cross-scene transport or duplicate items is required. Once entrance is open, it stays open for normal backtracking unless the owner deliberately adds a close/reset rule (not currently canon). Do not make a time-limited one-shot portal without owner approval.

## 6. Proposed durable puzzle-state model (semantic, NOT a verified schema)

The following identifiers are *design pseudonyms*, not existing Foundry flag keys or runtime contracts:

| State | Initial | Owner / event that changes it | Used by |
|---|---|---|---|
| `grove.bustStage` | 0 | Bust winding/optional wrong-order reset | Bust visuals; relief exposure |
| `grove.reliefExposed` | false | Fourth correct bust | Relief tile/puzzle availability |
| `grove.reliefSolved` | false | Validated Regionwright solve event | Family niche open |
| `grove.bagTaken` | false | Explicit collect | Bag visual and key visibility |
| `grove.brassKeyTaken` | false | Explicit take key | No repeat loot |
| `world.waterworksRestored` | false | Waterworks puzzle result (other scene) | Late-phase milestone candidate |
| `world.lateCheckpointSet` | false | Approved late progress/GM checkpoint | Arms late NW chase |
| `grove.secondChaseTriggered` | false | Qualified NW approach | No repeated encounter |
| `grove.silverKeyAvailable` | false | Crooked Man drop during pursuit | Recoverable on scene |
| `grove.silverKeyTaken` | false | Explicit take key | No repeat loot |
| `world.crimsonVeilActive` | false | Charging Rufus's source in Aqueduct | Disables player-directed chase; changes mood |
| `grove.bowlPlaced` | false | Valid use Bowl | Bowl appearance and chamber |
| `grove.pelletInserted` | false | Valid use filled pellet | Water animation |
| `grove.undercroftOpen` | false | Completed water mechanism | Secret door and transition |

**Runtime authority boundary:** Persist world-relevant progress through a verified native Foundry/Regionwright authority adapter with active GM/context checks and receipts, *not* client-only UI memory. Solve callbacks must be narrowly allowlisted, idempotent and read-back verified. Source asset or click access does not grant permission to change world state. No unconstrained page code or new general-purpose game engine is required by this design.

## 7. Acceptance checks before and after rendering

### Before render (PREPARE)
- [ ] Confirm Shrine/Clearing/Grove map boundary and connections to Carriage Yard western trail.
- [ ] Confirm actual scale/dimensions/clearances for SW/NE/NW/SE pads and northwest chase.
- [ ] Approve the **rose lifecycle clue symbols and wording** (or select another accessible clue) without moving it behind Study.
- [ ] Decide wrong-bust response (reset versus non-destructive refusal).
- [ ] Confirm visual objects/layers: separate statue-base relief and statue-hands sockets, four bust states, water-channel overlay, single grave, hidden undercroft access.
- [ ] Decide final hatch position and visually coherent entrance/transition once revealed; verify no collisions with relief niche.
- [ ] Confirm that all map cues appear as physically visible objects from strict overhead view, not floating labels or metagame markers.

### After structural/final render (established Dicebox workflow)
- [ ] Structural and painterly maps respect positions, travel widths, wall geometry, statuary and safe chase route.
- [ ] No openly painted Brass Key, hidden relief puzzle, Bowl, Silver Tiny Key, or undercroft entrance in the starting map.
- [ ] Fixed architecture is baked only when permanently static; changeable busts, reveal/hide panels, Bowl, water, key drop remain separate stateful visuals or validated scene variants.
- [ ] Feature Manifest IDs and Spatial Blueprint align exact interactable anchors to art, following `PREPARE → STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST/BLUEPRINT → PAINT_RENDER → FINAL_INSPECT → BUILD → STAGE → INJECT → VERIFY → RECEIPT`.
- [ ] No new skill checks/DCs assigned until artwork and scene contents are approved. The established Discovery Region standard is followed if a truly concealed environmental discovery is separately configured; ordinary direct puzzle clicks don't require a random detection roll.

### Foundry/Regionwright functional tests (future, not performed)
- [ ] Busts cannot be wound without Winder; correct four positions persist; wrong move matches approved behavior.
- [ ] **Early NW bust visit never starts late chase**, even when bust puzzle enters step 3.
- [ ] Regionwright puzzle cannot be opened before bust completion; solve callback cannot award duplicate bag/key; Brass Key actually unlocks Study.
- [ ] Waterworks clue accessible after water pressure result; late NW approach triggers exactly one chase, drops exactly one recoverable Silver Tiny Key, even with multiple player tokens.
- [ ] Crimson Veil state suppresses new player-directed Crooked Man chases and changes scene mood correctly.
- [ ] Bowl use cannot trigger statue-base relief; pellet use without Bowl fails harmlessly.
- [ ] Final water event opens correct Foundry secret door and paired Undercroft transition; water appears on map.
- [ ] Reload, reconnect, return to Grove, GM corrections, and unexpected transport failure preserve coherent progress and never duplicate quest items.

## 8. Decisions still for owner approval, NOT automatically adopted

1. Rose life-cycle **sequence clue** (SW seed, NE sprout, NW bud, SE open rose), proposed inscription.
2. Wrong-order bust behavior (proposal resets them safely).
3. Chase gating detail: what constitutes “late phase armed” beyond already-known Waterworks/clue/nightfall intent.
4. NW route, key-drop coordinate and chase/capture choreography.
5. Physical location/geometry of the Undercroft entrance in the shrine masonry.
6. Art visibility plan and object state/overlays, to refine at PREPARE/Feature Manifest.
7. Regionwright sliding interface grid, completion/reset and its server callback contract; do not infer the old Point Board already supports it.

**Design complete for conceptual review; implementation and verification not started.**
