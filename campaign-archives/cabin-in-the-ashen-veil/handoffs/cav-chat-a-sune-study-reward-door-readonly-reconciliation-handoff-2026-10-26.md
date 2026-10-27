# Cabin in the Ashen Veil — Chat A Sune Rewards and Study Door Read-Only Reconciliation Handoff

**Date:** 2026-10-26 Pacific, approximately 19:45–19:53. **Owner:** "resume". **Status:** Chat A source integration COMMITTED, DEPLOYED, 137/137 source regression PASS, elected GM runtime verified; no original reward/portal/quest state changes or ordinary-player acceptance tests.

## Exact integrated repository checkpoint

Regionwright repository Dicebox20/regionwright, branch codex/cav-sune-integration-20261026. **New pushed and verified HEAD: 7f7b9b1efabe5ce4943214b9e4c539875f6be1f0**. Prior Chat A source HEAD 55d4c233b2267e7f960ea902cab7bd25ca999e7f. Six exact scoped source/test/docs paths:
- NEW modules/regionwright/scripts/studio-cav-sune-study-reconciliation.js
- Updated Chat A-owned shared registry modules/regionwright/scripts/studio-campaign.js
- NEW tests/cav-sune-study-readonly-reconciliation.test.mjs
- NEW docs/cabin-ashen-veil/chat-a-sune-study-readonly-reconciliation-2026-10-26.md
- NEW same basename .json metadata
- APPENDED docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md

All unrelated local untracked assets, Chat B late-game source/worktree, Foundry actors, original Item templates, and original native RegionBehaviors preserved.

## Established progression and original evidence

Original Sune Relief (SG05) follows bust sequence and 3x3 portrait mosaic, then the original 1,000 gp cloth bag, then the original Brass Study Key. Sune elected GM original source modules/regionwright/scripts/studio-cav-sune-relief.js records each claim RESERVED, creates the authentic provenance-tagged embedded Actor Item, and marks DONE with embeddedItemId. An interrupted reserve/Item creation must never be automatically replayed. A completed original Gold claim precedes the Key claim. Original Brass Key Item.CAVSTUDYBRASS001 unlocks the Great Room Study Door only after completed and exact matching Sune Gold/Key reward evidence. The original Great Room native gate proof was already hardened in prior Chat A SHA 55d4c23; no change to that gate this turn.

Authenticated live Foundry 14.367 on world cabin-in-the-ashen-veil with elected Gamemaster 1:
- Sune Region Scene.CAVSG05Scene0001.Region.L15BdSqcbCOLPnIN exists; original Gold source Item.CAVSUNEGPBAG0001 container with 1000 gp and original Brass Key source Item.CAVSTUDYBRASS001 loot qty1 exist.
- Sune Mosaic persistent status locked. cavSuneGoldClaim=NULL and cavSuneBrassKeyClaim=NULL; zero Sune-provenance tagged Actor Items.
- Great Room Study Door Scene.CAVHG06GreatRoom.Region.CAV06R0000000003: unlock ledger cavStudyDoorUnlocked=NULL; original teleportToken Behavior CAVHG06STUDYT001 DISABLED with one existing approved landing Scene.CAVHG05Scene0001.Region.CAVB9AA3D7BE9560.
- Original Sune and Study587 elected GM services registered. No Study Note/Crank/water story state progress; world ChatMessages 54.

## New diagnostic API and safety

New public **read-only elected GM** call:
game.modules.get("regionwright").api.campaign.cabin.suneStudyReconciliation.describe()

Pure assessment helper assessCavSuneStudyReconciliation() classifies current topology and original ledger/Item receipts. The GM adapter rejects wrong world/non-GM/unready and otherwise reads only original Region flags, original world source Items, original approved portal, real landing, and player-owned provenance-tagged embedded Items. Returns aggregate status, requiresGM, **separate Gold, Key and Door classifications**, tagged Item count and GM-only embedded actor/item references. It NEVER supplies a mutation/repair instruction.

Normal original statuses: not-started; sune-rewards-in-progress; key-awarded-door-locked; study-door-unlocked. Cases requiring manual GM evidence preservation: Gold or Brass Key RESERVED with original Item visible vs not found; duplicate or orphan source-tagged Item; missing DONE embedded Item ID; wrong owner, name, type, source, origin, item quantity or reward flags; Key claim predating Gold DONE; Door ledger predating Key DONE; Door RESERVED with portal locked vs enabled; portal enabled without Door ledger; DONE Door but portal disabled; DONE actor/source mismatch; missing original landing or extra/foreign teleport destinations. A Gold Item that was legitimately spent or transferred may be reported as missing and will require human context—do not interpret diagnostic suspicion as automatic permission to recreate it.

**No source mutation functions:** no setFlag/unsetFlag, actor Item create/delete, Scene/portal update, token move, or ChatMessage creation. Do not use the diagnostic to force puzzle progress or repair without owner approval.

## VERIFY: tests / module installation / actual live GM

Twelve new pure and source-contract tests PASS; **137/137 total nonbrowser Cabin source regressions PASS** (125 prior). Source/installed hash equality and JS syntax verified:
- studio-campaign.js: SHA256 35F151217CAC0FBB24EC34BA4C55F36377B4A9C44D8CEADDF50BBBD4D342C744.
- studio-cav-sune-study-reconciliation.js: SHA256 5967F35F8C3A4FAAB3838FDC3A23CFC5BECB0512AE288780F239DC7FDCD414ED.

One guarded live elected-GM /game page reload completed with correct prestate. A separate read-only after-reload CDP inspection positively confirmed the new API is registered and returns:
status not-started, requiresGM false, Gold gold-unclaimed, Key key-unclaimed, Door study-door-locked, taggedItemCount zero. Synthetic pure RESERVED Gold returns gold-reserved-item-not-found/GM review; synthetic enabled portal with no ledger returns study-portal-enabled-without-ledger/GM review. Real Gold/Key/Door, Study Note, Crank and water flags remain NULL; portal remains disabled; Sune+587 GM listeners present; same original 54 ChatMessages.

Original read-only baseline: owner PC utility-harness/artifacts/cav-chat-a-sune-gold-key-door-reconcile-baseline-20261026.json.
Positive after-reload GM receipt: utility-harness/artifacts/cav-chat-a-sune-study-reconciliation-after-reload-gm-20261026.json.
The first authored baseline helper had a JS syntax error, caught by node --check before running; it was corrected before the successful read-only inspection. No uncertain native writes.

## Next Chat A boundary; keep Chat B separate

Further source-side early/midgame audit and final player acceptance preparations may proceed; *actual Player 1 testing remains deferred by owner*. The original unclaimed Sune/Study/587/Crank/sluice chain must not be forcibly completed for downstream checks. In particular, original Pond/Bath synchronized draining has NOT happened, original Rosewater native Behavior remains staged disabled, owner-approved Rose/Sun/Moth/Thorn solution [1,3,2] is reserved for legitimate gameplay; unique original Sune Bowl Item.1n5LONw3nYIy61O9 pickup fixture remains undecided. Crooked Man Actor/first chase also owner-deferred.

Chat B independently owns late-game source only. It must not update shared Chat A registry, original Sune/Study Door files, native Foundry world or water/first-chase authority. Latest upstream Chat A integration HEAD for a reviewed future merge: 7f7b9b1efabe5ce4943214b9e4c539875f6be1f0. No partner message/acknowledgment claimed.

**Classification:** SOURCE BUILT / INSTALLED / LIVE GM VERIFIED, 137 source tests PASS. Ordinary-player progression NOT PLAYTESTED. This handoff and archived transcript are evidence-based available-message reconstructions, not a lossless platform export.
