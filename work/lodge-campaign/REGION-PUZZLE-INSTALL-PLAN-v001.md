# Central Lodge Region + Puzzle Installation Plan v001

**Campaign:** central-lodge  
**Runtime:** Foundry VTT 14.367 / D&D5e 5.3.3  
**Purpose:** install the missing RegionBehavior logic and puzzle progression cleanly, in bounded sequence, without recreating Region geometry or overwriting already-verified late-game behavior.

## Current live baseline

The current Lodge has:
- 21 canonical Scenes;
- 201 Regions;
- 16 RegionBehavior documents;
- working/verified behavior concentrated in T1, T2, T3, F1, and F2;
- most older E/M/U/B/C/N Regions physically present but behavior-empty;
- Region geometry is now treated as authoritative and must not be recreated during behavior installation.

The previous all-Region behavior diagnostic over-classified F1/F2 interaction behaviors as Notices. Those are not discovery Notices and must not be "fixed" to roll 1d20. Preserve the already-verified F1/F2 behaviors unless a narrower diagnostic proves an actual defect.

## Puzzle/progression chains

### A. Rear-service / garden utility chain
1. E2 Iron Hand Crank.
2. E2 well examination yields Well Carving Pattern.
3. U2 Brass Gnomon supports E3 sundial.
4. B1 Water Control Wheel supports E3 water system.
5. E3 Fountain Valve Cap + Well Carving Pattern + Water Control Wheel resolve the fountain/water sequence.
6. E3 yields Garden Proof and Rose Crest.

### B. Servant bell / annex chain
1. E2 Servant Bell Pull.
2. M3 Bell Board accepts/restores the Bell Pull.
3. M3 resolves Bell Crest and hidden/service route state.
4. B2 becomes reachable through the service/hidden route.
5. B2 yields Infernal Cicada Wing I and sacrificial/recent-use evidence.

### C. Upper rooms / formal rooms chain
1. U2 yields Glass Eye, Brass Gnomon, and Piano Roll.
2. M2 uses Glass Eye / Piano Roll presentation and contains the Silver Family Emblem, Old Estate Survey, Stag Crest, Family Reliquary, and Ceremonial Censer.
3. M1 uses the Silver Family Emblem / clock sequence.
4. M1 yields Family Reliquary Key and Brass Baggage Token.
5. Family Reliquary Key resolves the M2 reliquary.

### D. Funeral Crest chain
Required crests:
- Rose Crest — E3
- Bell Crest — M3
- Stag Crest — M2
- Crown Crest — U1

All four feed E4's four-crest mausoleum. E4 then owns the downstream rewards/evidence:
- Founder's Signet
- Black Garnet Eye
- Child Bracelet
- Asmodean Covenant Seal
- Infernal Cicada Wing II
- false-burial / child-burial evidence

Black Garnet Eye backtracks to the E1 Hound mechanism.

### E. Estate Proof / railway authorization chain
Required proofs:
- House Proof — U1
- Garden Proof — E3
- Rail Proof — B1

All three feed N1. N1 then authorizes/powers the estate railway. N2 and N3 railway behavior must read this persistent state rather than invent independent power state.

### F. Shrine / cult-undercroft chain
1. Asmodean Covenant Seal — E4.
2. Ceremonial Censer — M2.
3. Both feed C1 shrine completion.
4. C1 opens/accesses C2.
5. C2 owns:
   - Child Bracelet / Firstborn Pedestal interaction;
   - Cult Passage Diagram;
   - Infernal Cicada Body;
   - Measure / Ritual Rhythm clues;
   - record-recency and concealed-record discovery.

### G. Railway depot / abandoned spur chain
1. Brass Baggage Token — M1.
2. N3 baggage locker yields Station Route Plate.
3. N3 departure-board/route logic exposes the abandoned-spur concept.
4. T2 yields Railway Switch Wheel.
5. Railway Switch Wheel + N3 route state enable the T3 branch.
6. T3 yields Recent Route Fragment.
7. N3 Cartography Table combines:
   - Old Estate Survey — M2
   - Cult Passage Diagram — C2
   - Recent Route Fragment — T3
8. Completed overlay exposes the route toward F1.

The lower N3 branch is canonically T3. Exact T1/T2 mouth A/B orientation remains unresolved and must not be guessed.

### H. Infernal Cicada chain
Required components:
- Body — C2
- Wing I — B2
- Wing II — E4
- Wing III — T1
- Wing IV — N3

All five feed F1 Cicada Assembly.

### I. Measure / Ritual Rhythm chain
- C2 introduces Measure / ritual-rhythm material.
- T3 invocation fragments and rhythmic material deepen/recontextualize it.
- F1's inner ward consumes the completed understanding/state.
- F1 then permits transition to F2.

### J. Finale
F2 is not a conventional key-item puzzle.
It begins in ACTIVE_RITUAL_BASELINE and uses encounter-state Regions for east/west/north disruption, summoning revelation, ritual light, and arrival manifestation.

---

# Installation architecture

## Foundation contract

New behavior work should use a small declarative runtime rather than embedding large bespoke scripts in every old Region.

Create:
1. **Central Lodge Runtime State Ledger** — one GM-only world JournalEntry with stable ID `dbx:central-lodge:state`.
2. **Central Lodge Runtime Kernel** — one world Script Macro with stable ID `dbx:central-lodge:macro:runtime`.
3. **Canonical Required Item Registry** — the 33 world Items created by the required-items installer, each resolved by `flags.world.dicebox.stableId`.
4. **Declarative Region specs** under `flags.world.dicebox.behaviorSpec`.
5. Tiny ExecuteScript RegionBehaviors which dispatch to the runtime kernel by Scene ID, Region ID, token ID, and event name.

The kernel owns common implementations:
- `notice`
- `observation`
- `pickup`
- `socket`
- `multiSocket`
- `puzzleGate`
- `storyGate`
- `transition`
- `lightState`
- `railwayState`
- `encounterState`

## Notice standard

Only true Notice/Discovery Regions use the DiceBox discovery rule:
- TOKEN_ENTER;
- exactly 1d20;
- no Perception/Wisdom/proficiency/expertise modifier;
- one automatic attempt per character until explicit reset;
- failure silent;
- success gives an environmental hint and a suggested non-Perception follow-up;
- Notice never automatically awards an item.

Puzzle, story, transition, socket, encounter, and F1/F2 behaviors are not Notices merely because they produce observations.

## Item acquisition standard

Do not award progression Items on Notice success.

For physical item Regions:
1. discovery/observation, if needed;
2. interpretation/search, if needed;
3. recovery/claim action;
4. clone the canonical world Item into the recovering Actor;
5. record acquisition in the campaign state ledger;
6. block duplicate global recovery unless the puzzle intentionally supports duplicates.

All dependencies resolve Items by stable ID, never by mutable world Item ID or visible name.

## State standard

Cross-Scene progression lives in the state ledger, using stable keys such as:
- `items.<key>.recovered`
- `puzzles.<key>.resolved`
- `railway.powered`
- `n2.floodCleared`
- `n3.routePlateRecovered`
- `n3.switchWheelInstalled`
- `n3.routeOverlayResolved`
- `f1.cicadaComplete`
- `f1.innerWardResolved`

Per-character Notice history also lives in the ledger.

Already-verified F1/F2 Scene flags remain authoritative for their existing local encounter/puzzle state; the kernel must interoperate with them rather than migrating them blindly.

---

# Macro series

Every APPLY macro uses:
**PREVIEW -> explicit confirmation -> bounded APPLY -> authoritative reread -> PASS/UNKNOWN**.

Every successful APPLY is followed immediately by a separate read-only VERIFY macro before advancing.

## Phase 0 — Baseline and infrastructure

### CL-00 — Preflight Snapshot
Read-only.
- verify exact 21 Scene IDs;
- verify 201 Region baseline;
- inventory all Region IDs/names/shapes;
- snapshot existing 16 behaviors and hashes/source;
- snapshot Region visibility/locked/hidden;
- verify required Item registry;
- verify no duplicate stable IDs.

### CL-01 — Required Item Registry
Use the already-authored required-items installer.
Then run a read-only 33-item verification.
Do not continue if any required stable item is absent or duplicated.

### CL-02 — State Ledger Installer
Create-only.
- create the GM-only campaign state JournalEntry;
- initialize schema/version;
- do not infer current puzzle completion from empty behavior Regions;
- optionally import only states proven by existing verified F1/F2/T1/T2/T3 documents.

### CL-03 — Runtime Kernel Installer
Create/update only the managed runtime Macro.
Before mass use, execute a no-write self-test for:
- item lookup;
- actor lookup;
- ledger read/write test against a disposable test key then remove it;
- whisper targeting;
- TOKEN_ENTER argument contract;
- UUID resolution.

### CL-04 — Region Metadata Normalizer
Bounded to the existing 201 Region IDs.
- add stable IDs to older Regions;
- assign ownership class;
- add scene key/campaign ID;
- preserve name, shape, hidden state, behavior documents, and geometry exactly;
- do not add behavior yet.

This phase produces a canonical Region manifest used by every later installer.

---

## Phase 1 — Early acquisition and local mechanisms

### CL-10 — E2 Rear Service Yard
Install:
- Well Carving Notice;
- Well Carving Pattern interaction;
- Iron Hand Crank recovery;
- Servant Bell Pull recovery;
- Recent Use observation;
- transition metadata for the two existing service-path Regions.

Do not recreate the two light Regions.

### CL-11 — U2 Servants / Nursery / Attic
Install:
- Servant Room Absence Notice;
- Nursery Contradiction Notice;
- Servant History observation;
- Glass Eye recovery;
- Brass Gnomon recovery;
- Piano Roll recovery;
- story/horror state metadata for nursery/attic.
Keep light Regions passive until the global lighting phase.

### CL-12 — M2 Study / Parlor / Formal Rooms
Install:
- Portrait Notice -> Glass Eye interaction;
- Player Piano Notice -> Piano Roll interaction;
- Silver Family Emblem recovery/state;
- Founder Portrait observation;
- Old Estate Survey recovery;
- Stag Crest recovery;
- Family Reliquary gate;
- Ceremonial Censer recovery.
Transition Regions remain metadata-only until route binding phase.

### CL-13 — M1 Entrance Hall / Great Room
Install:
- Grandfather Clock Notice;
- Silver Family Emblem recess/socket;
- clock/genealogy puzzle state;
- clock compartment resolution;
- Family Reliquary Key recovery;
- Brass Baggage Token recovery;
- Recent Disturbance observation.

### CL-14 — B1 Cellar / Utility Basement
Install:
- Utility System Notice;
- Rail Proof Notice;
- Water Control Spindle interaction;
- Water Control Wheel recovery if B1 is the canonical recovery point;
- Rail Proof recovery;
- Flood State / flood-clearing logic;
- Underworks Access State;
- waterworks observation/sound-state metadata.

B1 resolution writes the cross-Scene N2 flood-clear dependency.

### CL-15 — E3 Garden / Greenhouse
Install:
- Sundial Notice;
- Brass Gnomon / sundial mechanism;
- Fountain Notice;
- Well Carving sequence interpretation;
- Fountain Valve Cap interaction/recovery;
- Water Control Wheel socket/gate;
- fountain sequence state;
- Garden Proof recovery;
- Rose Crest recovery.

### CL-16 — M3 Kitchen / Service Wing
Install:
- Bell Board Notice;
- Servant Bell Pull fitting;
- Bell Board mechanism;
- Bell Crest recovery;
- Service Route State to B2;
- Recent Use observation.

### CL-17 — U1 Family / Guest Rooms
Install:
- Family Records Notice;
- Guest Room Absence Notice;
- Family Records interpretation;
- House Proof recovery;
- Crown Crest recovery.

---

## Phase 2 — Crest, shrine, and cult progression

### CL-20 — E4 Graveyard / Crypt
Install:
- False Burial Notice;
- Child Burial Notice;
- Four-Crest Mausoleum Door;
- exact four-crest validation using Rose + Bell + Stag + Crown;
- downstream rewards/interactions:
  - Founder's Signet;
  - Black Garnet Eye;
  - Child Bracelet;
  - Asmodean Covenant Seal;
  - Infernal Cicada Wing II;
- False Burial Evidence story behavior.

Do not allow partial crest insertion to duplicate/consume items incorrectly. Socket state must persist.

### CL-21 — E1 Arrival Grounds Backtrack
Install:
- Hound Notice;
- Hound / Black Garnet Eye socket;
- estate-plan fragment/recent-use story behavior if the live Region manifest contains an appropriate Region;
- Lodge Entrance / edge transition metadata.

This is intentionally installed after E4 because the Black Garnet Eye is the backtracking dependency, even though E1 is encountered first.

### CL-22 — B2 Hidden Annex
Install:
- Victim History Notice;
- Preparation Use Notice;
- Sacrifice Evidence;
- Recent Use Evidence;
- Infernal Cicada Wing I recovery;
- entry/inner-threshold route metadata.

### CL-23 — C1 Shrine
Install:
- Shrine Incompleteness Notice;
- Historical Use Notice;
- Covenant Seal socket;
- Ceremonial Censer socket;
- Shrine Completion multi-socket gate;
- Devil Worship interpretation;
- C2 threshold state.

### CL-24 — C2 Cult Records / Undercroft
Install:
- Record Recency Notice;
- Concealed Record Category Notice;
- Cult Records interpretation;
- Child Bracelet / Firstborn Pedestal interaction;
- Cult Passage Diagram recovery;
- Infernal Cicada Body recovery;
- Measure / Ritual Rhythm observation/state;
- C1/underworks transition metadata.

---

## Phase 3 — Railway progression

### CL-30 — N1 Railway Authorization
Install:
- Walkable Railway Notice;
- Station Power Notice;
- House Proof socket;
- Garden Proof socket;
- Rail Proof socket;
- Three-Proof Station Power multi-socket gate;
- Estate Railway interpretation;
- Estate Rail Car state;
- Lodge access / tunnel metadata.

Railway power is one persistent shared state consumed by N2/N3.

### CL-31 — N2 Grotto Station
Install:
- Walkable Railway Margin Notice;
- Flood and Drainage Evidence Notice;
- Grotto Flood State reading B1;
- Grotto Station interpretation;
- Estate Rail Car state reading N1 power;
- Station Platform Fast Travel;
- tunnel metadata.

### CL-32 — N3 Depot
Install:
- Baggage Locker Anomaly;
- Brass Baggage Token gate;
- Station Route Plate recovery/state;
- Departure Board mechanism;
- Railway Switch Mechanism;
- Infernal Cicada Wing IV recovery;
- Recent Use Contradiction;
- Walkable Railway Notice;
- Cartography Table;
- three-document overlay gate: Old Estate Survey + Cult Passage Diagram + Recent Route Fragment;
- Estate Rail Car state;
- branch/main-line metadata.

Do not guess T1/T2 portal orientation.

### CL-33 — Existing Tunnel Behavior Reconciliation
Primarily read-only first.
- preserve T1's verified Cicada Wing III Notice and Walkable Railway behavior;
- preserve T2's verified Switch Wheel, Black Triangle, and Recent Passage behaviors;
- preserve T3's verified Route Fragment, Invocation Scrap, and Terminus behaviors;
- inspect whether their recovered items match the new canonical Item registry;
- patch only the item-recovery portions that are proven incompatible with the canonical Items;
- bind known N3 -> T3 and T3 -> F1 routes;
- keep T1/T2 mouth A/B orientation deferred until explicitly resolved.

This macro must not delete/recreate the verified behaviors wholesale.

---

## Phase 4 — Final puzzle and finale preservation

### CL-40 — F1 Compatibility / Cicada Gate
Read-only first.
Preserve the four currently verified F1 behaviors:
- Measure / Ritual Rhythm;
- Cicada Assembly;
- Resonant Architecture Observation;
- F1 -> F2 transition.

Verify the Cicada Assembly accepts the five canonical components or their proven equivalent state.
If a compatibility patch is required, patch only item/state lookup.

Do not convert these behaviors into Notice rolls.

### CL-41 — F2 Compatibility
Read-only.
Preserve the four verified F2 encounter behaviors and current F1/F2 binding.
No item puzzle is added.

---

## Phase 5 — Global systems

### CL-50 — Known Transition Binder
Bind only transitions whose destinations are already canonically proven.
- use stable Region UUIDs;
- use teleportToken + player follow;
- no geometry changes;
- no T1/T2 orientation guess.

A separate read-only route table must PASS before APPLY.

### CL-51 — Day/Night + Lighting Binder
Install light-state behavior only after the campaign's global night-trigger event is explicitly chosen.
Until then:
- Region/light metadata may be normalized;
- light behavior remains deferred;
- underground/ritual state lights may be bound to their local puzzle state separately.

### CL-52 — Horror/Story Pacing Pass
Install only story/horror beats explicitly supported by the plan:
- sparse apparition/absence beats;
- recent-use contradictions;
- no new required clue hidden behind night;
- no extra puzzle/scare merely to fill a Region.

---

# Verification sequence

Each installer receives a paired read-only verifier:
- `CL-10-VERIFY`, `CL-11-VERIFY`, etc.

A verifier checks:
- exact Scene and Region IDs;
- geometry unchanged;
- expected managed behavior count;
- behavior enabled state;
- TOKEN_ENTER/event wiring;
- dispatcher target;
- declarative behaviorSpec;
- canonical item stable IDs;
- Notice flat-1d20 rule where applicable;
- no automatic item award from Notice;
- state dependency keys;
- referenced UUID existence;
- invalid flag scope;
- duplicate stable IDs;
- expected unresolved dependencies only.

After CL-52, run:

### CL-90 — Full Campaign Behavior Audit v002
This replaces the broad heuristic v001 diagnostic.
It classifies by canonical behaviorSpec instead of guessing from Region names, avoiding false Notice failures on F1/F2.

### CL-91 — Puzzle Dependency Simulation
Read-only state-machine simulation.
It does not trigger live behaviors. It evaluates every chain from initial state through expected prerequisites and proves that:
- no required Item has no source;
- no socket requires an impossible Item;
- no puzzle requires its own output;
- no progression route is circular without an alternate;
- no critical clue can be permanently lost by failed Notice;
- all multipart chains can reach their resolved state.

### CL-92 — Live Canary Test
Use one designated test Actor/token and explicitly resettable test state.
Test one instance each of:
- Notice;
- recovery;
- socket;
- multi-socket gate;
- story observation;
- cross-Scene transition;
- railway state;
- F1/F2 transition.

Only after canary PASS is the campaign marked behavior-complete.

---

# Intentionally unresolved before final completion

1. **Global day -> night trigger event** has not been canonically chosen.
2. **T1/T2 mouth A/B orientation** remains unresolved and must not be guessed.
3. Any older Scene transition whose destination is not already proven by current map geography stays metadata-only until route audit resolves it.

These do not block installing and verifying the rest of the puzzle system.

# Safety rules

- Never recreate Region shapes.
- Never delete unknown/foreign behaviors.
- Never overwrite verified T1/T2/T3/F1/F2 behaviors without a narrow diagnostic proving a defect.
- Never use Region name alone as runtime identity after metadata normalization.
- Never use mutable Item ID as puzzle identity.
- Never auto-award an Item on Notice success.
- Never make a progression-critical clue permanently inaccessible because of a failed Notice.
- Never guess an unresolved transition.
- Unknown write outcome means stop and inspect; no blind retry.
