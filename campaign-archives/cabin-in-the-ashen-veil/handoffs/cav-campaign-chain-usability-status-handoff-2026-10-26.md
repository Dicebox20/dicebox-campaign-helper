# Cabin in the Ashen Veil — Chain Usability Status Handoff

**Owner request, 2026-10-26:** “Can you give me an upate on how much of the chain is usable?”

**Finding:** Approximately **40% of major progression has substantial source/native interaction installation**, concentrated in early and midgame. This is an informal implementation/wave estimate, **not** 40% verified player-playable and **not** an audited fraction of discrete puzzle nodes. **No full non-GM end-to-end game acceptance test** has been performed; none can be certified entirely playable based only on structural/Node tests.

## Authority
Old `docs/cabin-ashen-veil/region-puzzle-chain-audit-2026-10-25.md` captured **46 scenes / 203 Regions / 68 valid teleport destination IDs**, but is obsolete for several Oct26 features. Chronological source `docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md` records **47 Scenes** following approved drained Bathhouse clone, and later actual installs. Latest live elected Gamemaster 1 on Foundry 14.367 was verified in a read-only state audit Oct26; CFT Dev disconnected afterward. Source tests **83/83 PASS**. No native world change occurred in this reporting turn.

## Installed and candidate for real player testing
Original travel/carriage/Studio/attic/rowboat interactions have Region scripts/valid IDs, but actual non-GM traversal remains untested. Oct26 subsequently installed and structurally verified: Regionwright Sune four-bust order → 3×3 sliding memorial → one-time 1000 gp bag & Brass Study Key; genuine Study door/587 note/Donovan lockbox GM service; roof clock Gear GM listener; original Crank fit + sluice open/close client Region + elected-GM synchronous Pond/Bath water Stage; approved drained map, Pond Weathered Key and Bath Screwdriver; Foyer Basement key portal, Parents drawer repair + once-only Handle, Pond two-part Aqueduct mechanical gate. Original Boiler 2/1 control Behaviors enabled on both filled/drained Bathhouse maps; UI rendered and 80+ tests, not player-playtested.

## Not currently usable end-to-end
- The real original Crank has **not** been obtained/fitted in Foundry, shared water state and completed Sluice transaction are NULL. GM `rosewaterRings.describe().sluiceProof` LIVE reports missing original Crank, committed drained state and completed water transaction.
- Native Pond↔Aqueduct travel portals, Aqueduct first chase and Forest Well route remain **DISABLED/STAGED**. Their later commissioning requires legitimate Gear+Handle, dry Pond/Bath, elected GM and original Crooked Man Actor/token (explicitly deferred until owner final testing).
- Rosewater Ring solver/UI and four approved `rose/sun/moth/thorn` symbols exist and are structurally verified, but native `CAVROSEWATERSCR1` remains **DISABLED**. No ring session/legitimate solve. The original unique Sune Bowl `Item.1n5LONw3nYIy61O9` still lacks final on-map pickup feature.
- Late SG01 chase/silver key/music box/Workshop/Gazebo/Rufus/Waterworks source charging/Crimson Veil, Greenhouse lye-only, book-spine mosaic, Privy fishing, Vault Keystone and Undercroft ending have substantial unresolved/older audit installation gaps. Not safe to call playable.
- SG05 slider GM completion previously acknowledged client-supplied board order under strict eligibility but without move-by-move adversarial validation, a player test/security item to revisit before claiming acceptance.

## Next
First establish **targeted real player vertical-slice tests** for start→Sune→Study587→authentic Crank→Sluice/Pond/Bath (when owner lifts deferred-playtest rule). Read-only audit pending geometry/portal return paths can be done without attempting a player solve. Then activate staged AQ/chase and Rosewater only with matching actual GM receipts, and continue installing late game in dependency order. Keep status terms STRUCTURAL, READY FOR PLAYER TEST, PLAYER-PASSED, and BLOCKED distinct.

## Durability
Regionwright source branch `codex/cav-sune-integration-20261026`, commit `508406a87f4d58df480da5461bd053a64924d820`, pushed and exact remote verified. Report `docs/cabin-ashen-veil/chain-usability-baseline-2026-10-26.md`, machine JSON counterpart and dated chronological update log. This turn performed **documentation only** in source repo, no GM world edits, and no new runtime tests.

**Owner expectation:** We are past pure architecture, early chain installation is extensive, but certified playable percentage is not yet known. Treat the early third-to-half as candidate for QA, NOT completed gameplay.
