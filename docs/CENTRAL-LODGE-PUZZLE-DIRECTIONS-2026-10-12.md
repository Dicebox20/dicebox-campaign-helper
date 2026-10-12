# Central Lodge Puzzle Directions

**Updated:** 2026-10-12  
**Campaign:** The Mysterious Lodge / Central Lodge  
**Audience:** GM reference with ready-to-use player-facing direction text  
**Status:** Source-grounded draft. This document has not been installed as Foundry Journal or Region text, and it does not certify player gameplay.

## How to use this guide

1. Read the **Player-facing direction** text aloud or place it in the relevant Journal/Region message. Reveal hints in order rather than exposing the GM key.
2. Use the **GM solution and dependency key** to confirm what each action should do.
3. Do not invent a pattern where the canonical project record does not specify one. Four puzzle details remain incomplete: the exact garden configuration, the Bell Board sequence, the ritual rhythm, and the visible result of the Glass Eye. The Family Reliquary's exact contents also need confirmation.
4. Do not make essential clues depend on a successful one-time Notice roll where the existing contract says the attempt is enough. In U2, failed Notice rolls do not block the household interpretation.
5. Items are not consumed unless a reviewed puzzle contract explicitly says otherwise. The clock must allow retries without consuming items or locking progress.
6. A logical unlock is not the same as working travel. The N3 branch's three-proof unlock is source-installed, but N3-to-T3 travel and the broader railway canary remain unverified/blocked.

## Player-facing directions

### 1. U2: Servants' quarters, nursery, and household history

**Direction text:**

> Treat these rooms as parts of one investigation. Examine the physical traces in the Servant History area, inspect the emptied servant rooms, and compare them with the nursery. Keep track of what is missing and what appears to have been arranged later. After checking both locations, return to the Servant History area and reconsider the evidence together.

**Progress hint:**

> A failed Notice check does not erase what you can physically inspect. Record the attempt and keep investigating.

### 2. M2: Glass Eye and portrait mechanism

**Direction text:**

> The Glass Eye is a physical puzzle item, not just evidence to read. Carry it to the matching portrait/eye mechanism in M2, fit it into its socket, and inspect the mechanism again.

**GM caution:** The current project record confirms U2 as the Glass Eye's source and M2 as its destination, and it tracks `puzzles.m2.glassEyeInstalled`. It does not clearly document the visible result that should follow. Do not promise a particular reveal until that result is verified.

### 3. M2: Player piano and Piano Roll

**Direction text:**

> The Piano Roll belongs in the player piano. Fit the roll into the instrument, then operate the piano. When the mechanism accepts it, collect the Silver Family Emblem and carry that emblem to the grandfather clock in M1.

### 4. M2: Founder Portrait and Old Estate Survey

**Direction text:**

> Inspecting the Founder Portrait and opening its hidden compartment are separate steps. Once you have the Founder's Signet, return to the portrait and interact with it again. When the compartment opens, recover the Old Estate Survey and keep it for the railway cartography table in N3.

**GM caution:** Keep `founderPortraitObserved` distinct from `founderPortraitOpened`. A Notice roll is not a prerequisite for physically observing the portrait, and the Signet-gated survey pickup must remain intact.

### 5. M1: The Seventh Winter grandfather clock

**Direction text:**

> First fit the Silver Family Emblem into the clock. The two parts of the answer are recorded in different places: the family records in U1 identify the relevant heir, while the family graves in E4 provide the date interval. Read both clues before setting the hands. A wrong setting should let you try again. Once the compartment opens, collect the Family Reliquary Key and Brass Baggage Token separately.

**Hint 1:** Look for a family record that identifies the youngest or fourth heir.  
**Hint 2:** Compare the patriarch's and matriarch's grave dates in E4. The interval supplies the minute clue.  
**Hint 3 (near-solution):** The fourth heir points to IV. The seven-year interval points to VII on the clock's minute scale.

### 6. E2 and E3: Well, water control, fountain, and sundial

**Direction text:**

> These clues belong to one garden mechanism. In E2, examine and recover the Well Carving Pattern. In B1, recover the Water Control Wheel. In E3, fit the wheel to its matching water-control mechanism, fit the Fountain Valve Cap to the fountain, and place the Brass Gnomon on the sundial. Use the well pattern to interpret the garden mechanisms rather than treating each object as an unrelated puzzle.

**GM caution:** The item relationships and intended Garden Proof/Rose Crest outcomes are recorded, but the exact correct arrangement or operating sequence is not. Do not tell players a guessed configuration is canonical. The garden puzzle needs an authored/verified solution before its directions can be considered complete.

### 7. M3: Bell Board

**Direction text:**

> Recover the Servant Bell Pull from E2 and fit it to the Bell Board in M3. Examine the board's markings and the clue text around it before operating the mechanism. When the board accepts the correct operation, the Bell Crest becomes available.

**GM caution:** The current authority confirms the Servant Bell Pull fitting and the Bell Crest's dependency on `bellBoardResolved`, but it does not define the literal bell order or operation. This is not yet a fair, fully specified puzzle. Author and install a clue plus a unique solution before asking players to guess.

### 8. E4: Four-crest mausoleum

**Direction text:**

> The mausoleum has four crest recesses. Find the Stag Crest, Rose Crest, Bell Crest, and Crown Crest, then place each in its matching recess. All four are required; a key, seal, bracelet, or cicada part is not a substitute for a crest. Once the mausoleum opens, search the newly accessible crypt areas for their separate rewards.

**Hint:** The four crests are scattered across the lodge. If one recess remains empty, continue exploring rather than repeatedly trying the same three.

### 9. E1: Stone hound and hidden estate plan

**Direction text:**

> The hound's empty eye socket is a mechanism. After recovering the Black Garnet Eye from the crypt, return to the hound and fit the eye into the socket. The eye is not consumed by this action. Inspect the restored hound and the area it reveals for the hidden estate-plan fragment.

### 10. C1: Shrine of Asmodeus

**Direction text:**

> The shrine requires two separate offerings: the Asmodean Covenant Seal and the Ceremonial Censer. Place the seal in its matching socket and the censer in its own socket. The threshold to C2 opens only after both are accepted.

### 11. C2: Firstborn pedestal, cult records, and ritual preparation

**Direction text:**

> The Child Bracelet belongs on the Firstborn Pedestal. Separately, search the cult records for evidence about when records were made and which category of record was concealed. Recover the Cult Passage Diagram and Infernal Cicada Body, then compare the records before attempting the Measure/Ritual Rhythm mechanism.

**GM caution:** The Child Bracelet pedestal, records, diagram, and cicada body are documented. The exact Measure/Ritual Rhythm sequence is not documented in the current authoritative source. Do not improvise a hidden rhythm and then treat it as the established answer.

### 12. N1: Railway power

**Direction text:**

> The station needs three proofs, each from a different part of the estate: House Proof, Garden Proof, and Rail Proof. Place all three in their matching station sockets. The railway power gate requires all three; carrying only one or two proofs is not enough.

**GM caution:** This is the power requirement, not proof that every railway transition is currently enabled or safe. The accepted route topology still has unverified travel behavior and player canaries.

### 13. N3: Depot, departure board, switch, and cartography table

**Direction text:**

> Complete three separate jobs in the depot:
>
> 1. Use the Brass Baggage Token at the baggage locker to obtain the Station Route Plate. Fit the plate into the Departure Board.
> 2. Fit the Railway Switch Wheel into the switch mechanism.
> 3. Place the Old Estate Survey, Cult Passage Diagram, and Recent Route Fragment into the three Cartography Table sockets.
>
> Once all three map clues are in place, inspect the table again. If its overlay has not updated, leave the table area and return so the gate can re-check the completed clues. Then inspect the Branch Railway.

**GM caution:** The branch's logical unlock requires all three states: Departure Board resolved, Switch Wheel installed, and Cartography Overlay resolved. That unlock does **not** install or prove a safe N3-to-T3 scene transfer.

### 14. F1: Infernal Cicada assembly and ritual rhythm

**Direction text:**

> The Infernal Cicada is a five-part assembly: one body and four numbered wings. Recover all five parts and bring them to F1. Match the parts to the assembly, then complete the Measure/Ritual Rhythm challenge before proceeding to the final summoning chamber in F2.

**GM caution:** The part locations are: Wing I in B2, Wing II in E4, Wing III in T1, Wing IV in N3, and the body in C2. The exact ritual rhythm is not documented, and the F1/F2 end-to-end player path has not been accepted through a real-player canary. Do not claim the finale is ready-to-play until those gates pass.

## GM-only solution and dependency key

| Puzzle | Known solution / dependency | Result or next step | Status |
|---|---|---|---|
| U2 household interpretation | Observe Servant History traces and attempt both Servant Room Absence and Nursery Contradiction notices. Notice success is not required; attempts count. | Conclusion: rooms were deliberately cleared, but some nursery objects were arranged later. The sequence conflicts with simple uninterrupted abandonment. Culprit, purpose, and exact timing remain unknown. | Source-installed; real-player acceptance pending. |
| M2 Glass Eye | Recover in U2 and install at the matching M2 eye/portrait mechanism. | `puzzles.m2.glassEyeInstalled` is tracked. | Visible result/next state needs confirmation. |
| M2 Piano Roll | Install in the M2 player piano and operate it. | Silver Family Emblem; take it to M1. | Puzzle chain documented; gameplay acceptance pending. |
| M2 Founder Portrait | Possess Founder's Signet from E4; interact with portrait again. | Opens the Signet-gated compartment and recovers Old Estate Survey for N3. | Source-installed; gameplay acceptance pending. |
| M1 Seventh Winter | Insert Silver Family Emblem. U1 fourth/youngest heir = IV hour. E4 dates 1431 DR and 1438 DR give a seven-year interval; VII on the clock gives 35 minutes. | **4:35**. Then separately recover Family Reliquary Key and Brass Baggage Token. | Source-installed; player canary pending. Wrong entries must be retry-safe. |
| E2/B1/E3 garden chain | Well Carving Pattern from E2, Water Control Wheel from B1, Fountain Valve Cap and Garden Proof/Rose Crest in E3, Brass Gnomon from U2 for the sundial. | Garden Proof powers N1; Rose Crest goes to E4. | Exact configuration/operating order missing. |
| M3 Bell Board | Servant Bell Pull from E2 fits the board; Bell Crest is gated by `bellBoardResolved`. | Bell Crest goes to E4; service route depends on the board state. | Literal correct-operation sequence missing. |
| E4 mausoleum | Stag Crest (M2), Rose Crest (E3), Bell Crest (M3), Crown Crest (U1). All four required. | Unlocks Founder’s Signet, Black Garnet Eye, Asmodean Covenant Seal, and Infernal Cicada Wing II in the crypt/deeper crypt. Child Bracelet/Token is separate and not mausoleum-gated. | Dependency documented; Bell Board gap can block completion. |
| E1 hound | Insert Black Garnet Eye from E4. | Resolves hound and reveals hidden estate-plan fragment; eye is not consumed. | Source contract documented; gameplay acceptance pending. |
| C1 shrine | Asmodean Covenant Seal (E4) + Ceremonial Censer (M2), both installed in separate sockets. | Sets shrine resolved/C2 unlocked and opens the exact C2 threshold wall. | Logic documented; gameplay acceptance pending. |
| C2 Firstborn/cult records | Child Bracelet on Firstborn Pedestal. Recover Cult Passage Diagram and Infernal Cicada Body. Interpret record recency/category evidence. | Supports later N3 cartography and F1 assembly. | Record interpretation details are bounded; ritual rhythm still missing. |
| N1 railway power | House Proof (U1) + Garden Proof (E3) + Rail Proof (B1). | `puzzles.n1.railwayPowered`; N2 availability gate depends on this. | Logic documented; actual rail travel is not fully player-tested. |
| N3 hidden branch | Station Route Plate at Departure Board, Railway Switch Wheel installed, and all three map clues placed to resolve Cartography Overlay. | Branch unlock requires board + wheel + overlay. After all map sockets are filled, a return visit to the table may be needed due event ordering. | Logical gate installed/source-verified; N3-to-T3 travel not installed. |
| F1/F2 cicada finale | Body (C2) + Wings I (B2), II (E4), III (T1), IV (N3); then Measure/Ritual Rhythm. | Intended finale is F2. | Exact rhythm and end-to-end player acceptance remain unresolved. |
| M2 Family Reliquary | Family Reliquary Key from M1 is used in M2; `reliquaryUnlocked` is tracked. | Expected next step is the reliquary contents. | Exact contents/reward mapping is not explicit in current authority; confirm before promising rewards. |

## Authoring gaps to close before calling every puzzle clear

1. **E3 garden:** write one unique, clue-supported configuration for the water control, fountain, well pattern, and sundial; then update the player direction and test it.
2. **M3 Bell Board:** define the exact bell sequence and place a clue that points to it. Verify that solving the board unlocks the Bell Crest and intended service route.
3. **C2 Measure/Ritual Rhythm:** define the rhythm/measure solution and the clues players can use to derive it.
4. **M2 Glass Eye:** verify its visible response and downstream state after installation.
5. **M2 Family Reliquary:** confirm exact contents and how the Family Reliquary Key changes the mechanism.
6. **Travel/finale:** do not label N1/N2/N3 rail travel or the F1/F2 finale ready-to-play until guarded travel, current-state readback, and real-player canaries pass.

## Source boundary

This guide is a documentation-only clarification draft based on the Central Lodge roadmap, active checklist, and canonical project knowledge base as of 2026-10-12. It does not alter RegionBehavior code, item permissions, the live Foundry world, or puzzle state. It deliberately preserves unresolved details rather than guessing them.