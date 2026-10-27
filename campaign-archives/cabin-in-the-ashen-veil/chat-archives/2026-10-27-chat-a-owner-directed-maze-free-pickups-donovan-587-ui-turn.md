# Cabin in the Ashen Veil — owner-directed clickable items, locked maze and Donovan combination turn archive

**Date:** October 27, 2026 Pacific. This is a selected chronology of explicit user messages and verified native tool work; not a lossless platform transcript.

## User (verbatim, prior interaction rule)

> sorry, let me rephrase. when I point out a problem just fix that, don't do anything additional without asking.

## User (verbatim, prior report)

> Was it fixed?

The assistant verified the earlier proposed maze gate fix had not been made, then installed the original Yard-to-Maze disabled teleport and first genuine inside-maze unlock script. It did not change unrelated puzzles.

## User (verbatim, current request)

> When they enter the locked region have it tell them the gate is locked, and then make sure all of the regions that have items that aren't puzzle gated they can pick up can be clicked to retrieve the items.

## User (verbatim, interruption/addition)

> after you're done doing that, remove the image and just have the combination pop up when they click donovan's lockbox. It has the combination on the front of it. I covered it on the map, so just get rid of the image and put the lock puzzle from the other lockbox on it.

The user attached a screenshot of the visible combination on Donovan's lockbox artwork.

## Chronological execution

1. Inspect real GM live original Yard gate, maze unlock and pickup Region scripts. Six original direct Item rewards identified as originally automatic on token movement; others were puzzle-gated/staged/GM-controlled and not appropriate for making freely accessible. Some already had clicked close-up inspection only.
2. Install player-facing locked gate notice `CAVMAZELOCKMSG01` into original disabled Yard-to-Maze Region. Original too-long Behavior ID was rejected without creating a new doc; corrected 16-character ID, installed once and independently GM-verified.
3. Inspect original Donovan 587 box RegionBehavior and First Chest (024) world Macro. Existing Donovan UI already had correct authentic GM-verified 587 response but included revealing image; replaced only the original closeup HTML and select markup with three interactive stacked digit/arrow wheels, borrowed visual/function pattern from First Chest. Source compiled and exact native write verified; original code/Crank award unchanged.
4. Prepare fixed six-item GM request helper, protecting legitimate one-time source/Region/provenance flags, exact original actor ownership, scene and proximity, plus story access gates for attic and Sophia. Added persistent bootstrap registration in two lines and deployed byte-for-byte to installed module without module reload.
5. Source suite **290/290 PASS** across 54 files, six focused tests added, prior 284 baseline. Hot-registered ONLY the new GM helper in the current elected GM via dynamic module import, hook ID **659**, with zero ChatMessages or item grants. Did not disturb Chat B runtime imports.
6. Prepared immutable full original/revised script manifest and updated six original Foundry RegionBehavior sources IN PLACE. All six native writes and immediate readback PASS; original Item/progress ledger, Actor Items and messages unchanged. Oars Behavior gained click lifecycle events, original movement event retained; original other five Behavior events retained.
7. Independent second elected-GM read-only source/state pass: six of six updated scripts SHA/event/flags confirmed, GM hook active, Yard gate remains originally locked with correct new message, Donovan original 587 Behavior now image-free and exact revised SHA. **PASS**. No non-GM UI clicks or reward transactions were simulated.
8. Full source report, chronological log and tests committed to Regionwright `fb3b3f3770628044d243ec4c8d34282fb998f893`, pushed and independently remote-verified on branch `codex/cav-sune-integration-20261026`. DCH handoff, structured metadata and this selected archive preserve continuation.

## Next owner checkpoint

In Donovan's Shack, select one player-owned character near the Lamp Oil worktable and click Region `CAVEXT03OILREG01`. The UI should offer Collect, which submits to the elected GM and grants the original Lamp Oil at most once. Current player view may require local scene revisit to rearm the updated RegionBehavior handler. Owner reports pass/missing/fail. Any further unrelated repair requires explicit approval.
