# Cabin in the Ashen Veil — Oars Shack relocation owner-approved stepwise QA turn

**Date:** October 27, 2026 Pacific. **Transcript fidelity:** Exact currently visible user texts (including the previously logged approval) and a source/receipt-grounded assistant implementation summary. Not a lossless platform transcript export.

## Owner (verbatim, from immediately prior playtest turn)

> We're going to follow it one step at a time. I will tell you if the region activated, if it's missing, or if it's a failure. So far the inspection of the family carriage worked, and the teleport to donavans shack worked, but unfortunately the is no oar region, and I have no idea what region you set them to

## Assistant (previous plan summary)

The original Oars pickup was attached to original Yard `CAV01R0000000006`, not Shack. Proposed copying original Behavior to owner's chosen Shack Region, changing its hardcoded location and Rowboat exact Item proof, deleting only original Yard Behavior and preserving Skaal Tel's claimed Oars.

## Owner (verbatim)

> Shack Interior Oars: Scene.CAVEXT03Scene001.Region.TWKOyz83JjJu94E7 just copy the behavior and delete the original. We're going to be working step by step, ask me before you begin any repairs.

## Assistant approved repair confirmation (previous assistant)

Asked approval for original Behavior copy into exact specified Shack Region, updating original Rowboat prerequisite, deleting old Yard Behavior (leaving the Region), keeping valid one-time Oars state, no fake duplication.

## Owner (verbatim)

> Yes

## This turn: tool-backed execution and verification

1. Dicebox Bridge native PowerShell persistent host healthy. Regionwright source HEAD `83401ee6cacb45e2ab81ab9f83853c62f9ff4a56`, clean tracked branch; live exact original elected GM Foundry v14.367, world `cabin-in-the-ashen-veil`, player Dyscid viewed Shack.
2. Read exact original Yard Oars Behavior source SHA, target empty Shack Interior Region object, original Rowboat source/provenance, Skaal Tel's single Oars Item and `DONE` Yard claim. The originally active Shack had no Oars Behavior; exact problem reproduced.
3. Prepared an exact, source-SHA-guarded new Oars script with the canonical Shack constants and a world source-Item duplicate guard. Prepared updated Rowboat proof requiring new Shack DONE claim while preserving the real historic Yard item only if Actor, Item ID and original claim all match. Authored versioned source payload, no re-edits to original historical 2026-10-26 patcher.
4. Authored six focused static tests verifying canonical location, authentic historic claim acceptance, fresh Shack claims, fraudulent Item/tag rejection, source SHA/native compilation and unchanged mirror reward. Source suite **284/284 PASS**, 0 failures.
5. Live elected-GM guarded step 1: copied original true `DONE` Oars claim into target Shack Region with precise migrated-from provenance; original Yard historical flag unchanged. PASS.
6. Step 2: cloned existing original enabled tokenMoveIn `CAVOARSBEHAV0001` into the specific Shack Interior Oars Region with exact new source; original Yard Behavior temporarily present. PASS.
7. Step 3: updated existing original Pond Rowboat `CAVMIRRORBEH0001` source in place with exact new Shack claim and authenticated historic provenance, flags/events/disabled state unchanged. PASS.
8. Step 4: **deleted only the original Yard Oars Behavior**, preserving the original Yard Region and historical DONE claim. PASS.
9. Independent second elected-GM read-only verification: new Shack Behavior/source/event correct; old Yard Behavior absent; Skaal Tel's exact original one-time Oars Item source/flags unchanged; migrated Shack/old Yard claim both valid, Rowboat enabled and source updated. **PASS**. No actual player movement or event simulation occurred.
10. Committed source manifest, six tests, full report and chronological log on Regionwright `74ee7cba7791e52dc3b691600f984a694271bdb0`; remote SHA independently verified. Archived handoff and transcript in DCH.
11. **Stop here:** owner will test just the specified Shack Region next and report pass/missing/fail. Because the true claim is already DONE on Skaal Tel, player Dyscid's entry need not emit a new reward message. An item transfer or reset requires new explicit owner permission.

[Current detailed handoff](../handoffs/cav-oars-shack-interior-owner-approved-migration-playtest-checkpoint-2026-10-27.md) · [Regionwright report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-owner-approved-original-oars-behavior-to-shack-migration-2026-10-27.md).
