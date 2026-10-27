# Cabin in the Ashen Veil — Chat A Read-Only Original Crank Award and Fitting Reconciliation Handoff

**Date:** 2026-10-26 Pacific, 16:56–17:09. **Owner instruction:** “resume.” **Status:** Complete bounded Chat A feature, **110/110 source regression tests pass**, installed in Regionwright, live elected-GM API verified. **No world writes, actual Item transfers, quest changes or non-GM gameplay tests**.

## Who owns what
Chat A continues early/midgame, original Study 587/Crank/Sluice/Pond/Bath, shared Regionwright API and all live Foundry module installation/commissioning. Chat B separately owns late-game source branch/worktree and does not edit shared registration, Sluice/water scripts or the live Foundry world. No new Chat B handshake or merge is claimed.

## Exact source change and Git checkpoint
**Regionwright repo:** `Dicebox20/regionwright` on branch `codex/cav-sune-integration-20261026`.
**New pushed/verified HEAD:** **`b64771e203cbcf9b41607ebe63b12cb8fc0bb673`**. Base before turn `fb8ef607d4cf892557db402e5041c93294b3a79d`.
**Scoped changes, no Chat B changes:**
- NEW `modules/regionwright/scripts/studio-cav-crank-reconciliation.js` — elected GM-only `describeCavCrankReconciliationGM()` plus pure `assessCavCrankReconciliation()`. Static source has no flag/Item/Scene/ChatMessage mutations. Final installed/source SHA256 **`7AB389895C05B766CD889E17C3DE4428A5B786AE4BE4601424595EE1D628E620`**.
- UPDATED **Chat A owned** `modules/regionwright/scripts/studio-campaign.js` — registered the read-only GM API, final source/installed SHA256 **`BCF4855989A63E33C703D40D52FD8652E74104C59D75C7B282BC310F12F3774C`**.
- NEW `tests/cav-original-crank-readonly-reconciliation.test.mjs` with **9 pure tests**, total relevant Cabin regression **110 PASS / 0 FAIL** (prior 101).
- Dated source checkpoint `docs/cabin-ashen-veil/chat-a-original-crank-readonly-reconciliation-2026-10-26.md`, machine JSON, and appended `regionwright-puzzle-update-log-2026-10-26.md`. Exactly six files staged, `git diff --check` passed; unrelated untracked files preserved.

## Original Crank transaction truth
The original Study 587 elected-GM handler `studio-cav-587.js` reserves `cavDonovan587LockboxClaim`, creates original provenance-tagged player Item, then marks DONE with `embeddedItemId`. The authentic Crank is original `Item.g3VYdgc1qkgkHGvn` at Donovan's 587 lockbox `Scene.CAVEXT03Scene001.Region.CAVEXT03BOXREG01`, note `Scene.CAVHG05Scene0001.Region.CAVB3E32BD6B01BD`. The Sluice GM handler reserves fit, consumes that Item, marks DONE with `consumedActorItemId`, then records initial closed/full Pond/Bath state. The previous Chat A `evaluateSluiceRecordedPrestate` blocks water operations if any original receipt is missing or inconsistent. **No automatic retry of reserved Item creation/deletion is safe.**

## New operator-visible live read-only diagnostic
Only on ready elected-GM world:
`game.modules.get("regionwright").api.campaign.cabin.crankReconciliation.describe()`

Returns structured status, `requiresGM`, source/Box/Note UUID, recorded claim/fitting/water/transaction statuses, count and IDs of original provenance-tagged player Items, and a nonmutating recovery classification. Non-GM/wrong-world/unready access returns `denied`.

The pure reconciler explicitly distinguishes:
- `not-claimed`: genuine untouched chain, no Actor Item or ledger.
- `reserved-award-item-not-found` / `reserved-award-item-visible`: the original lockbox grant was interrupted before/after Item creation; either requires manual GM reconciliation. **Do not retry on absence**.
- `claimed-crank-held`: completed grant with exactly one correctly sourced Item in the exact claimant Actor/Item ID. Normal progression.
- `reserved-fit-item-visible` / `reserved-fit-item-not-found`: reserved fitting before/after original Item deletion; each requires manual GM inspection.
- `fitted-water-receipt-unverified`: fitting DONE, Item absent, but initial water or previous DONE transaction contradicts original source.
- `fitted-initial-stage-consistent` / `fitted-committed-stage-consistent`: consumed original Item and water-stage proofs consistent.
- `duplicate-tagged-cranks`, `item-provenance-conflict`, `claimed-crank-item-not-found`, wrong Actor/Item identity, orphan flags/item: manual GM reconciliation. Diagnostic never produces an automatic repair plan.

## LIVE evidence (not merely source)
Authenticated elected **Gamemaster 1**, Foundry VTT **14.367**, world `cabin-in-the-ashen-veil`; original 587/Crank/Water listeners all active. Before change baseline: original source Item, original Box and Note Regions exist; **all 587 award, Study note/door, Crank fit, synchronized water and transaction flags NULL**, **zero tagged Crank Items across 6 world Actors**, chat count 54. Read-only baseline on owner's PC:
`C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts\cav-chat-a-study587-crank-claim-readonly-baseline-20261026.json`

After installing the module, performed **one** guarded Dev Chrome Foundry `/game` browser reload (not server restart), navigation committed. A separate elected-GM read-only CDP inspection confirmed the NEW registered API is live: `{status:"not-claimed",requiresGM:false,taggedItemCount:0}`. A pure synthetic reserved award input returns `{status:"reserved-award-item-not-found",requiresGM:true}` without creating any world record. Original water/Crank flags still NULL, native Sluice Behavior enabled, Rosewater native Behavior disabled, 54 messages. Positive receipt on owner's PC:
`...\utility-harness\artifacts\cav-chat-a-crank-readonly-reconciliation-postreload-gm-20261026.json`

A final UTF-8/source newline normalization changed the new source file's byte hash; synchronized the final installed copy and corrected recorded checksum before exact git staging. **No behavioral source change after the positive GM runtime evaluation**, no second reload, installed final file hashes match Git checkout.

## Boundaries / next Chat A source task
The campaign's Crank and Pond/Bath remain at the genuine initial progression state. Owner-approved Rosewater four symbols are `rose/sun/moth/thorn`, ring solution outer 90/middle 270/inner 180 ([1,3,2]), native ring `CAVROSEWATERSCR1` still disabled until actual original Crank plus committed synchronized drain. The unique original Sune Bowl `Item.1n5LONw3nYIy61O9` pickup fixture still needs final placement. Crooked Man actor/first chase and ordinary-player full QA remain owner-deferred.

**Next safe Chat A task:** inspect original player-side `cav587Request` provenance and interactive Study note/lockbox Regions, their per-player visibility and one-time claim resistance, preparing real Player 1 QA but **not running gameplay tests or fabricating a reserved claim**. The GM diagnostic can evaluate future real world state without manually mutating it. If any reserved/crashed Item receipt appears, preserve native evidence and seek owner instruction before any manual recovery. Keep parallel Chat B work isolated.

**Continuity classification:** new diagnostic SOURCE BUILT/DEPLOYED and LIVE GM-VERIFIED, 110/110 nonbrowser PASS, player flow not PLAYTESTED. Handoff and transcript are available-message reconstructions, not lossless platform exports.
