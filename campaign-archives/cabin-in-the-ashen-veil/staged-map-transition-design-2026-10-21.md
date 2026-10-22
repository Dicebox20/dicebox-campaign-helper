# Cabin in the Ashen Veil — Staged Map Transitions / Scene Variants (2026-10-21)

**Status:** OWNER-PROPOSED CAMPAIGN-SPECIFIC DESIGN, architecture pending validation; not a product-wide workflow change and not a runtime-tested Foundry/Regionwright feature.

## Owner proposal

"For transitions between puzzle stages, such as the map of Sune's statue with the undercroft closed," use either multiple maps or tiles whose visibility can change. For complicated environments such as Sune Memorial Clearing, use multiple stages. When Bowl and then Dust are inserted, move the characters to a replacement map, and retarget incoming teleport Regions to the active map.

**Interpretation awaiting implementation evidence:** Hybrid small-scale stateful Tiles/door/Regions plus major whole-Scene stage replacement. The specific Sune proposal uses an intermediate Bowl-installed overlay on Scene A, and one full-map transition upon *successful pellet* insertion (rather than requiring three entire full Scene copies). This is a RECOMMENDATION and the owner can request separate Bowl-installed stage too.

## Stage state definition for Sune

- **Stage A — Dormant:** statue hands empty, dry water channels, Undercroft entrance closed. Busts, statue-base relief, and early family rewards can change independently using stateful Tiles/door states. Player can place Bowl; a stateful Bowl representation appears without changing the entire map.
- **Stage A with Bowl installed:** Bowl remains visibly placed. Players may still interact with its chamber to use the already-filled Dust of Dryness pellet from Great Room 027.
- **Trigger:** Validated successful filled-pellet insertion *after* Bowl placement. Single authoritative world state transition occurs, optionally with visual/audio sequence.
- **Stage B — Activated:** Bowl in place, water channels operating/filled, moving masonry in activated position, Undercroft approach opened, spatial composition coordinated with Stage A. The four busts and any encounter/item progression are retained from canonical state, not reset by scene replacement.
- Both versions use registered counterpart anchor points and consistent physical scale. No new copy of the shrine's lore/alternate history.

## Logical scene routing rather than hardcoded swaps

A **logical location ID** `ashen:sune-clearing` maps to immutable stage-specific Foundry Scene IDs (A/B) and entrance anchors. Incoming source-side travel triggers (e.g. Carriage Yard path) ask the **current world state** which physical scene/anchor to use. This is *proposed runtime adapter design*, not a verified Regionwright capability. It accomplishes the owner's desired behavior ("teleport regions swapped to new map") without mutating every neighboring Region on activation, if the exact installed Regionwright/Foundry transition implementation supports it. If the installed adapter requires static destination UUIDs, a narrow authorized rewrite of explicitly managed link destinations after the stage switch is the fallback **only after verification and tests**. Never change foreign Regions or touch arbitrary Foundry documents.

The old Stage A scene remains retained, but should no longer be normally entered after activation. It can be archived/GM-visible for audit; ensure stray Scene navigation/teleports cannot bypass the active stage.

## Atomic activation and party transfer

An implementable safe transition must:
1. Confirm Bowl installed, filled pellet used, exact world/Scene/active GM and allowed operation; reject duplicates.
2. Persist transition intent with idempotency key/versioned state; identify only relevant current Scene player tokens and positions.
3. Resolve positions against stage B anchors and safe collision/no-overlap placement, retain PC actor/token identity, orientation, ownership, effects and encounter state.
4. Move active party tokens *exactly once* using approved adapter; account for users viewing other Scenes, disconnected players and tokens not participating.
5. Make stage B the canonical logical destination and update route resolver/relevant managed teleport behaviors atomically or by recoverable two-phase migration.
6. Reread authoritative source/target Scene state, token counts, destination IDs and travel back-links; finalize receipt only after verified success.
7. On partial transfer, mark stage transition **outcome unknown/blocked**, reread before retry, and complete/recover without duplicates. Provide bounded GM repair procedure. No irreversible deletion of old stage token data without authoritative confirmation.

**Important:** The phrase "atomic" is a design objective; Foundry document operations across multiple Scenes are not automatically a single atomic transaction. This is a recoverable orchestrated migration with explicit checkpoints, not a guarantee of database transactions.

## Visual/interaction ownership

- **Painted background**: permanent geometry/decoration of each stage.
- **Switchable Tiles/door states**: four bust retractions, statue relief reveal, family stash, Bowl appearing in hands, local source effects and clues.
- **Replacement Stage B background**: major wet drainage channels, moved masonry, revealed playable Undercroft entrance and broad environmental changes.
- **Persistent world puzzle flags**: bust sequence, relief solved, collected Brass/Silver keys, late Crooked Man encounter, Bowl inserted, pellet inserted and Grove stage.
- **Transition Regions**: outgoing/incoming locations resolved from world stage; separate **NW chase Region** remains conditional on late-game permission and does not accidentally retrigger when players arrive in Scene B.

## Tests before wider use

1. Single player transfers exactly once on successful pellet use; no transition upon Bowl alone unless explicitly revised.
2. Multiple online PCs at scattered Grove positions retain corresponding relative spatial positions; none end up in walls.
3. PC already outside Grove, disconnected player, and spectator retain correct state/destinations when later arriving.
4. Any entry from Carriage Yard after activation lands in Stage B; outgoing travel from Stage B back to Yard works; Stage A links cannot be used by players.
5. Already-completed early busts/rewards and late chase remain completed (including when transition occurs during alternative campaign pacing).
6. Reload/reconnect, duplicated solve callback, and interrupted destination rewrite cause no duplicate tokens/items/awards; reread before retry.
7. Undercroft access is **visible and traversable only in Stage B**. An ornate Keystone door deeper inside remains closed until Keystone used. No premature glimpse at remains or ritual site.
8. No live runtime mutation without approved KB read, exact Foundry/world version and active-GM gating. Test staging and recovery first, follow existing `PREPARE → RENDER → INSPECT → BUILD → STAGE → INJECT → VERIFY → RECEIPT` and nested structural/feature-manifest/painterly workflow.

## Scope, count, open choices

- This creates **two physical Foundry Scene variants for one logical shrine**; it adds one **stage variant**, not a separate new geography/location to the questline topology. Track **logical areas** and **physical scene assets** as different counts (the earlier estimated 31 quest-serving distinct spaces does not include alternate stage assets).
- Need determine if Foundry/Regionwright's installed native region teleport adapter supports logical destination resolution, and whether in-world authoritative runtime can read/update all user-visible Scene and Token states reliably. No direct implementation claimed.
- Potential future multi-stage candidates: drained/refilled Pond, drained/heated Bathhouse, extreme Crimson Veil environmental scenes. Each needs independent cost/benefit; not all environmental changes justify full duplicate maps.
- The user's choice is architectural intent; separate Bowl-only full stage, animation pacing, exact transitions and visual states remain design choices.
