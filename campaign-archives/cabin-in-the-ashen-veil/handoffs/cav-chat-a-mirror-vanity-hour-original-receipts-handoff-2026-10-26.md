# Cabin in the Ashen Veil — Chat A Rowboat Mirror → Vanity Keys → Grandfather Clock Hour Hand

**2026-10-26 Pacific, ~21:29–21:39.** Owner instruction: "Lets continue." This is a source + exact original native world integration handoff, not a native lossless transcript.

## Current verified checkpoint

- **Workstream:** Chat A early/midgame only. Do not merge or touch Chat B late-game branch/Scenes before owner-directed integration.
- **Regionwright repo/branch:** `Dicebox20/regionwright` / `codex/cav-sune-integration-20261026`.
- **New exact remotely verified HEAD:** `830d48788bcfae13a760c73ad2cbc129be68c63c`. Parent `df73f0d303983e48d67d621181672ef64f368e40`.
- **Regression:** 198/198 Cabin source tests **PASS**, 13 added, 0 failed, 41 test files.
- **World:** Foundry VTT 14.367, `cabin-in-the-ashen-veil`, elected `Gamemaster 1`, 47 Scenes, 232 Regions, 120 RegionBehaviors (45 native scripts, 75 teleports), 54 ChatMessages at independent readback.
- **Native source installs:** two original already-existing RegionBehavior `system.source` fields changed once each, original IDs, events and enabled status retained; both combined GM write receipt and independent second elected-GM process **PASS**.
- **Player acceptance:** not executed. Five checked original reward ledgers (Mirror, Vanity, Hour, Minute, Roof) all remain NULL; zero actor copies of these rewards found. No Item, Scene, Region, token, world-water, story or chase changes.

## Exactly what was fixed

1. **Original Dahlia Vanity:** `Scene.CAVHU07Scene0001.Region.CAVVANITYREG0001`, original Behavior `CAVVANITYBEH0001`. Previously merely holding an Ornate Mirror with expected pickup tags was enough to expose both Vanity Key rewards, even if the original Pond Rowboat pickup transaction was RESERVED or incomplete. Now only the original Rowboat `cavPondMirrorPickup` **DONE** claim, same Actor, unique exact embedded Mirror Item ID, source and physical Region can qualify.
   - Old SHA `8be78e1904677af764b63989db85749833895fa32aa0610a7863974e2d26c182`.
   - Installed SHA `744a523cc0e90b01a6ea91dc7145e7e8cfce4a9ed094b292edd4f4e845d2dfbd`.

2. **Original Grandfather Clock:** `Scene.CAVHG06GreatRoom.Region.MrWgTyGg0d0DI53Q`, original Behavior `SAshGMH5A3AsJC0Y`. Previously mere tags on Brass Tiny Key #1 could grant Hour Hand even if the two-key Vanity transaction was incomplete. Now require original Vanity `cavVanityKeysClaim` **DONE**, same Actor, original Mirror source, both expected ordered Key source IDs and two unique original embedded Item IDs, and actual matching Brass Key Item. The original Carriage Key can legitimately be consumed after award; no artificial inventory retention requirement.
   - Old SHA `7acc56464e73dbf26527d6883154e05f928400c7b983bd646e92fe97dacd3786`.
   - Installed SHA `7964c9604084220eb7d9d83958e0351da2b2d8afcb347afec95450ea8daa96ef`.

3. **Inspected but not changed:** original Rowboat Ornate Mirror claim `cavPondMirrorPickup` + source `55205e21926418bf764081c4f2e21d372d103fec08f834a08cb44bdfdfce71a8`; original Attic Minute Hand with authentic ladder-status and dual enabled travel proof `79492474d457fc69ea9edf63c205a2e4cdb0fbebca6a01688fc34445244d7150`; previous Roof Clock player script `212584fe6c6eb0780a711b5e9ee23a34cf854c4518cd91d53175af15158a840d`. All five independently re-read with exact expected source hashes.

## Evidence

[Detailed Regionwright implementation report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-mirror-vanity-hour-native-done-award-batch-2026-10-26.md), adjacent JSON metadata, Node-only fail-closed two-source generator `modules/regionwright/scripts/studio-cav-first-act-receipt-parity.js`, 13-tests `tests/cav-first-act-mirror-vanity-hour-done-receipt.test.mjs`, exact two original native source snapshots, and append-only chronological Regionwright log entry.

Machine receipts, read-only source artifacts:
- `utility-harness/artifacts/cav-chat-a-rowboat-vanity-hour-original-native-readonly-20261026.json`
- `utility-harness/artifacts/cav-chat-a-vanity-hour-two-original-done-boundaries-install-20261026.json`
- `utility-harness/artifacts/cav-chat-a-firstact-mirror-vanity-hour-independent-gm-postread-20261026.json`

All intended native source changes were fully SHA-pinned and completed, no uncertain write/retry was needed.

## Next Chat A instructions

Proceed with a larger 2–3 adjacent-inspection/install batch only where another genuine gap is found. Good next inspection boundary: early Oars → original Rowboat and Carriage Ladder Hook → original Attic Hatch, then assess safe entry/return landing and original player-facing flow. Avoid repeating the now-healthy Vanity/Hour/Minute/Roof audits.

Continue PREPARE → INSPECT → BUILD → VERIFY → CATALOGUE. Owner wants playable complete campaign before **Tuesday October 27 evening**, but do not assert completion before real non-GM tests. Prior owner explicitly deferred NPC Crooked Man and first chase commissioning and real player acceptance until final testing. No fake Sluice Crank, water states, Roof Gear, or Sune Bowl placement. Rosewater stays disabled until authentic completed drain. The six book order, original 47 Scene layout, single unified Bathhouse artwork and Chat B late-game independence stand.

**STATUS:** 198 source tests PASS; two native original Behavior changes installed and independently GM verified; **real-player playtest remains outstanding**.