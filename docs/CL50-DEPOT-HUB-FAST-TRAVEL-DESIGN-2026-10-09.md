# Central Lodge: depot-driven fast travel (approved design simplification)

**Design direction from user:** N3 Underground Depot is the fast-travel hub.
Players interact with one depot control, see a list of destinations that are
currently unlocked, and select one. Locked entries are *not listed at all*.
Do not make players click disabled/locked routes.

## Implementation contract

- One N3 hub Region/control, one selector dialog, one route catalog and one
  shared teleport handler. Avoid creating two-way point-to-point scripts for
  every station combination.
- Display labels are friendly Scene/station names. The menu is generated from
  verified Scene/Region IDs; no guessed mouth orientation or runtime name lookup.
- The eligible list is computed **fresh** from the authoritative Central Lodge
  Journal ledger on each opening and rechecked immediately before transfer.
  Never trust the menu selection alone. Only include destinations whose actual
  documented puzzle/route prerequisites are satisfied.
- Where a route has no established unlock rule, keep it out of the live menu
  until the intended availability rule has been verified. Do not infer that
  mere Scene existence implies travel authorization.
- The depot remains accessible as a real location. Walkable T1/T2 tunnel mouths
  are a separate exploration/Scene-transition feature, not a prerequisite for
  the depot travel menu. Their original UNBOUND_DO_NOT_GUESS flags remain intact,
  but no longer block hub fast-travel development.
- Each selectable destination needs **one** independently verified safe landing
  Region and authorization/ownership checks. Preserve existing puzzle scripts.
  Shared transfer behavior must remain fail-closed on interruption or duplicate
  destination intent.
- Return travel is a distinct UX question: N3 is the departure hub in this
  design. Do not silently install return travel from every destination unless
  the campaign specification supports it.
- Keep the imported Kernel transition action quarantined until this handler is
  validated. Original live Region behaviors must not be replaced blindly.

## What changed from the old plan

Prior `clscale-railway-master-route-manifest-v002.json` remains an **archive of
physical tunnel topology**. Its eight theoretical mouth-to-mouth directional
transitions are **not** mandatory implementation work for depot fast travel.

Next engineering unit: build a small hub destination catalog from existing
Scene/Region references and proven ledger flags; make the menu filter testable
with synthetic locked/unlocked states; only then install the minimal hub
behavior in the disposable fixture and perform targeted Foundry runtime tests.

The deferred Regionwright template system stays deferred until campaign
completion and playtesting.

## 2026-10-09 development update: safe depot menu staged and installed

**Status:** One NEW, DISABLED menu-only Region Behavior is installed at
`N3 Estate Rail Car State` in the disposable `dbx-test-world`.
The existing 119 Region behaviors remain intact, including the original four
teleport behaviors, and the Runtime Kernel's shared transition case remains
quarantined. Nothing in this preview can perform a Token move.

The verified hub anchor is Scene `pHQvDUDlyWZFuNrX`, Region
`tsRjZiiXw0qmktQS`, stable ID
`dbx:central-lodge:n3:region:n3-estate-rail-car-state`.

The menu catalog uses *three verified arrival Region references*:

| Destination | Display name | Appears only when |
| --- | --- | --- |
| N1 | Lodge Railway Station | `puzzles.n1.railwayPowered === true` |
| N2 | Grotto Station | N1 railway powered AND `puzzles.n2.fastTravelEnabled === true` |
| T3 | Abandoned Spur | N1 railway powered, N3 Departure Board resolved, switch wheel installed, route overlay resolved, AND `puzzles.n3.t3BranchUnlocked === true` |

The catalog never includes F1 or F2, preserving their story progression. T1 and
T2's walkable tunnel mouths remain a separate physical-navigation feature and
are not required for this depot hub. When no destinations are unlocked, the
menu offers none. No locked destination is shown in the dialog.

**Implementation:**
- Pure source-backed catalog and replay guards:
  `tools/clscale-depot-fast-travel-catalog.mjs`.
- Staged, Foundry v14 `DialogV2.wait` menu Region Behavior:
  `work/clscale-central-lodge-migration-v001/clscale-depot-menu-preview-v002.json`.
- Installed disabled Region Behavior ID: `934c9f79dece3715`.
- Exact backup before installation:
  `work/clscale-central-lodge-migration-v001/pre-depot-preview-scenes-db-v001/`.
- Installer/readback receipt:
  `work/clscale-central-lodge-migration-v001/clscale-depot-preview-install-receipt-v001.json`.
- Offline tests: `clscale-depot-fast-travel.test.mjs` (15) and
  `clscale-depot-menu-runtime-mock.test.mjs` (12), under the migration work folder.

The proposed Region script verifies it is running in the disposable world,
that the executing user is the primary GM, and that a Token has entered the
specific N3 rail-car Region. It looks up the exact Central Lodge ledger, shows
only destinations with *literal boolean true* on all prerequisites, captures
the ledger revision before presenting the dialog, and checks both revision
and unlock status again after selection. It rejects duplicate menu opens and
source or destination Region identity drift. The script **never calls**
`teleportToken` or any other persistent Foundry document mutator.

**Verification:** Combined six-suite offline regression: **102 passed, 0
failed**. Post-install offline fixture preflight: **16/16 passed** (21 Scenes,
202 Regions, 120 total Region behaviors, 118 enabled, exactly one NEW disabled
depot menu preview, original four cross-Scene teleport scripts). The
15-minute Windows offline checker is enabled again, and Foundry TCP30005
is stopped.

**Remaining work:** Enable the preview only during a guarded loopback fixture
session and visually test the dialog and GM/Token event behavior. Then implement
the separately gated shared destination transfer handler, certifying safe
arrival positions, owner permissions, and interrupted-transfer recovery. A
staged menu, even if all tests pass, is not a finished playable fast-travel
system. GM password protection is still a runtime safety task.

Foundry v14 API design reference:
https://foundryvtt.com/api/classes/foundry.applications.api.DialogV2.html

## 2026-10-09 next-turn runtime validation and native registration

**Outcome:** Foundry v14's real `DialogV2.wait` UI works with the source-backed
N3 Depot menu. The one disabled Region behavior is now also registered through
Foundry's native embedded-document API instead of a raw LevelDB insertion.

**Runtime scope:** Loopback-guarded disposable `dbx-test-world` on
`127.0.0.1:30005`. The supervisor verified exact Foundry PID/command,
world data path, and listener interface before any browser access.
A local GM browser session loaded 21 Scenes, the exact N3 hub Region, and
the single restored Central Lodge ledger at revision 0.

The test used temporary in-memory ledger copies and a synthetic event Token.
The fixture's saved ledger, real Token documents and puzzle progression were
never altered. The installed behavior remained **disabled throughout**; the
browser called its *menu-only source* directly for UI verification, with no
`teleportToken` dispatch or committed transfer.

Actual `DialogV2` verified:
- Fresh locked ledger: **zero destinations**; no dialog opens.
- N1 unlocked: dialog displays **Lodge Railway Station** only; Cancel works.
- All gates unlocked: dialog displays **N1 Lodge Railway Station,
  N2 Grotto Station, T3 Abandoned Spur** and nothing for T1/T2/F1/F2.
- Selecting T3 rereads the copied ledger, resolves the destination's real
  Scene/Region IDs and returns `PREVIEW_SELECTED_NOT_TRANSFERRED` with
  `canDispatch:false`, `tokenMoved:false`; ledger unchanged.
- Zero browser initialization errors were captured in the passing run.
- The test waits for the previous dialog to close before checking another
  state; the initial attempt had reused a closing DOM element.

Passing real-browser evidence:
`work/clscale-central-lodge-migration-v001/clscale-depot-live-browser-receipt-v003.json`
with PNG screenshots
`clscale-depot-menu-live-partial-v003.png`,
`clscale-depot-menu-live-all-v003.png` in the same folder.

**Native embedded-document registration issue found and resolved:**
The earlier raw inserted disabled RegionBehavior (ID
`934c9f79dece3715`) existed in LevelDB but did **not** appear under
`game.scenes.get(N3).regions.get(hub).behaviors`. Read-only runtime
inspection proved the hub's collection was empty and that native
`region.createEmbeddedDocuments("RegionBehavior", ...)` exists.

A single native GM fixture call created a disabled, stable-ID-bound preview.
A strict comparison in the same create script reported an ambiguous
postcondition, so **no second create** was attempted. A separate fresh
GM-session reread observed **exactly one** native behavior with ID
`Xa6xz88CyQ38gCU9` attached to the N3 rail-car Region, type
`executeScript`, disabled `true`, source length 4439, stable
`dbx:central-lodge:n3:behavior:depot-menu-preview`. Foundry had
normalized the 4440-character source by dropping one final newline.
Independent offline comparison confirmed byte-for-byte equality after
that exact whitespace-only normalization.

After the supervisor stopped the owned loopback fixture (port closed),
the Scene DB was backed up again to
`pre-depot-orphan-cleanup-v001` and the obsolete
`934c9f79dece3715` record was deleted. The initial cleanup program
misinterpreted a missing LevelDB key's `undefined` return as a failure;
**independent new read-only checks** proved the deletion had succeeded,
no second deletion was attempted, 120 RegionBehavior records remained,
and exactly one native disabled depot menu was present. A full
reconciliation receipt is
`clscale-depot-native-reconciliation-v001.json`.

The recurring `tools/clscale-fixture-readonly-preflight.mjs`
now checks the native ID and exact script after Foundry newline
normalization, as well as all original Scene, Actor, ledger, Item,
module, and artwork gates. **16/16 OFFLINE_PREFLIGHT_PASS** after
reconciliation; six regression suites **102/102 PASS**. The recurring
15-minute task is `Ready`, last result 0; Foundry remains STOPPED.
No production-world data or Windows Firewall rules were changed.

**Important next steps:** The menu has not been enabled for actual Region
Token-enter triggers. Its visual UI is verified with in-memory synthetic
events, not live movement. Implement the *single* shared transfer handler
next, with fresh server-side unlock verification, GM authority, Token owner
consent, vetted arrival geometry, and durable interrupted-transfer evidence.
Never dispatch based solely on a menu choice. Then enable the one N3
behavior in a guarded disposable test and perform end-to-end playtesting.
The railway's T1/T2 physical tunnel mouths remain independent from this
depot fast-travel feature. Regionwright template extraction remains
deferred until campaign completion and player acceptance.

## 2026-10-09 continuation: single shared teleport plan and real ephemeral placement

### One handler for N1, N2, T3

Added `tools/clscale-depot-transfer-plan.mjs` with a single shared
`assessDepotTransferPlan` gate and
`proposeNativeDepotTeleport` descriptor. It reuses the existing
ledger-backed destination menu catalog; all three destinations use the same
code path and native Foundry v14 `RegionDocument.teleportToken` API.

The shared gate requires, before even proposing a transfer:
- Exactly matching disposable world, N3 Estate Rail Car Region, source Token,
  Actor, active primary GM and owner authorization.
- Latest authoritative ledger state and destination identity, with prior
  menu revision revalidated and all real puzzle flags literally true.
- Exact owner confirmation bound to source Token and destination, and explicit
  create/delete permissions on the cross-Scene transfer.
- No prior prepared/dispatching/uncertain/completed/aborted transfer record
  (any of these means stop and reconcile).
- Current target footprint, wall, elevation/Levels and Token occupancy
  attestation, durable intent acknowledgement and a single-use approval.
  These data must come from actual runtime, not synthetic tests.

The native call proposal is simply
`RegionDocument.teleportToken(token, { placement: "center",
snap: false, avoidOccupied: true, pan: true })`. This is **only a
source-only proposal**: the shared policy ALWAYS returns
`neverDispatch: true` and `canDispatch: false`. No code from this
unit calls `teleportToken`, no menu behavior was enabled, and no live
cross-Scene Token transfer occurred. Do not mistake a synthetic policy
pass for committed game authority. The final implementation must also
include the destination receipt marker in `updateData` before arming
the transfer; the options above are not a complete production call.

### Arrival footprint survey and real Foundry v14 placement engine

A one-shot read-only survey of the stopped fixture's Scene/wall/Token
LevelDB records was performed only while the 15-minute offline scanner
was paused and reenabled in `finally`. It checked a one-grid-square
Token at each destination and found no static wall or Token overlap
near the center. The result was recorded in
`clscale-depot-arrival-offline-survey-v001.json` (in the CLScale
migration work folder).

Then the exact loopback-only Foundry v14.367 fixture was launched,
with independently verified `127.0.0.1:30005` listener and owned PID.
A read-only GM browser used the documented Foundry
`RegionDocument.spawnTokens([ephemeralToken], {create:false,
placement:"center",snap:false,avoidOccupied:true})` method on each
target Region. It did **not** persist a Token and did **not** call
`teleportToken`. The original Token serialization and all Scene Token
collection identities/counts were verified unchanged.

| Target | Scene grid | Static center (pixels) | Foundry returned Token top-left | Returned elevation |
| --- | ---: | --- | --- | ---: |
| N1 Lodge Railway Station | 150 | (2375,1470) | (2300,1395) | 0 |
| N2 Grotto Station | 160 | (2160,1480) | (2080,1400) | 0 |
| T3 Abandoned Spur | 120 | (165,1300) | (105,1240) | 0 |

For all three, Foundry returned exactly one ephemeral 1×1 Token in
the correct Scene. T3's destination Region has one Level association,
which must be validated against an actual moving character's
elevation/level at commit time. This is meaningful Foundry-native
placement evidence **only for the sampled 1×1 test Token**, not
general permission to teleport differently sized Tokens or guarantee
no concurrent destination occupancy.

Passing runtime receipt:
`work/clscale-central-lodge-migration-v001/clscale-depot-ephemeral-arrival-runtime-receipt-v001.json`

Foundry v14 API reference:
https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html

### Remaining single shared transfer work

1. Add the verified runtime GM/player consent pathway and durable
   per-transfer intent receipt, with no automatic retries on interruption.
2. Bind the selected menu entry to the native one-call transfer,
   using a fresh ledger read and actual moving Token's dimensions.
3. In the disposable fixture only, enable and exercise the real
   N3 menu behavior with a test Token and guarded rollback; verify
   cross-Scene creation/deletion and the return to N3. Only then
   assess the campaign as playable. Production remains unchanged.

Offline preflight after runtime shutdown remained **16/16 PASS**.
All original puzzle behavior scripts and the one **disabled native N3
depot menu** remain preserved. The periodic offline preflight scanner
was reenabled after the runtime placement test; Foundry is stopped.

## 2026-10-09 Foreman recovery: one real disposable transfer and exact rollback

A previous one-shot native N3→N1 **test-only** teleport created a
disposable hidden Token (ID `EpC8S8wxsBfolsPe`) and invoked
`RegionDocument.teleportToken` **once**. Foundry returned that Token in N1
at top-left (2300,1395) with the intended correlation marker, with its
source instance removed and original existing character intact. The test
script flagged an uncertain result because it incorrectly required the
*entire* campaign State Ledger to remain byte-identical after a Scene
arrival. No retry was attempted.

Read-only comparison against the verified 180-file pre-test cold snapshot
found **exactly six intentional, test-induced ledger differences**:
- Observations/notices `notices.n3.walkable-railway` and
  `notices.n1.walkable-railway`;
- `notices.observation:n1.estate-railway`;
- `puzzles.n1.estateRailwayInterpreted`: false→true;
- revision: 0→2 and `updatedAt` timestamp.
These entries came from ordinary enabled N3/N1 Region puzzle scripts reacting
to the test Token. They are *not* a failed teleport and not evidence Codex
modified the game. They are legitimate travel-triggered effects that future
tests should explicitly allow, while continuing to block unrelated changes
or puzzle unlock bypasses.

**Reconciliation:** before any cleanup, preserved the changed fixture in a
second verified cold snapshot:
`work/clscale-central-lodge-migration-v001/post-depot-native-teleport-test-before-cleanup-v001`
(185 files, 2,384,103 bytes). With fixture stopped and scheduled offline
reader paused, deleted only the uniquely marked disposable test Token,
restored the State Ledger from the verified pre-test backup, and reread
the results. A first 15-gate run then revealed an extra orphaned
`scenes.tokens.delta` child row and its test ID still referenced in the
N1 Scene `tokens` array. Separate exact-source inspection proved those
were the *only* remaining Scene record changes. Restored the exact
pre-test N1 Scene document and deleted the orphaned delta, preserving
all original Token records. Reread scene count and token delta, then ran
the full 16-gate offline preflight: **16/16 PASS** with precisely 928
Scene records, 22 original Scene Tokens, 1 original delta, 202 Regions
and 120 Region behaviors. Scheduler reenabled; fixture remains STOPPED.
No production-world data was read or written for repair.

Evidence:
- `clscale-pause-reconciliation-readonly-v001.json`
- `clscale-fixture-transfer-cleanup-receipt-v001.json`
- `clscale-orphan-delta-inspection-v003.json`
- `clscale-orphan-scene-refs-cleanup-v001.json`

### Persistent transfer intent groundwork

Added `tools/clscale-depot-persistent-intents.mjs`. It uses a new
`world.diceboxDepotTransferIntents` Journal flag separate from
`world.dicebox.state`, with one immutable attempt ID per Token,
prepared/attempting/observed/uncertain/reconciled phases, mandatory
readback of the prepared receipt, destination/source binding,
correlated arrival evidence and human-only reconciliation on
uncertain outcomes. Its helpers never call `teleportToken` and always
return `canDispatch:false` until a future separately verified handler
performs the actual transfer.

Foundry runtime smoke test proved:
1. GM writes one fixture-scoped prepared-intent record through
   `JournalEntry.setFlag`;
2. A **fresh page reload** independently retrieves the exact record;
3. `JournalEntry.unsetFlag` removes the temporary record;
4. The campaign puzzle ledger stays revision 0 and original Tokens remain
   unchanged.

Runtime receipt:
`clscale-live-intent-flag-smoke-receipt-v001.json`.
A fresh pre-test world backup was created under
`pre-depot-intent-flag-test-v001`. After the smoke, Foundry was stopped,
the scanner reenabled, and the full offline fixture integrity gate was
**16/16 PASS**.

New regression suite `clscale-depot-native-transfer-observations.test.mjs`
requires only the approved six Region-triggered ledger changes and proves
unexpected progression is still blocked. New suite
`clscale-depot-persistent-intents.test.mjs` verifies preparation, durable
readback, double-submit prevention, exact state transitions and refusal to
retry any uncertain transfer. All **nine** combined regression suites
pass **141/141**.

**Next focus:** wire the live Region menu to the single shared transfer
handler, in the disposable world first. Prompt the right controlling player
(or require explicit authorization) rather than silently allowing GM-only
movement of somebody else's Token. Revalidate the latest puzzle flags
before dispatch, durably persist one prepared attempt, use a stable
`updateData` arrival marker, and record/inspect outcome without automatic
retry. Keep the original N3 preview behavior disabled until that new
integration and supervised multiplayer playtest are proven. The
reusable Regionwright template library remains deferred.
