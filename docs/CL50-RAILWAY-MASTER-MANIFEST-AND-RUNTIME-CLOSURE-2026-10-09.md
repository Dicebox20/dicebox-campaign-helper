# Central Lodge Railway — Master manifest and campaign runtime closure

**Scope:** `dbx-test-world` only, Foundry v14.367 / D&D5e 5.3.3.
**Status:** Manifest validated; required shared campaign data installed; bulk teleport installation NOT yet performed.
**Source of truth:** persisted source Scene/Region IDs and local Foundry fixture documents.

## 1. Survey and generated batch manifest

Read-only audit:
`work/clscale-central-lodge-migration-v001/clscale-railway-region-inventory-v001.json`
records 21 Scenes, 202 Regions, 119 behaviors, 87 possible travel/control Regions,
and four installed cross-Scene teleport behaviors.

The versioned master source-backed graph is
`work/clscale-central-lodge-migration-v001/clscale-railway-master-route-manifest-v002.json`.
Its companion dry run is
`work/clscale-central-lodge-migration-v001/clscale-railway-batch-preview-v001.json`.

- **Existing, preserve until replaced and tested:** E1→M1, T3→N3, T3→F1,
  and F1→F2. All four are real enabled Region scripts; placement is random
  and durable interrupted-transfer recovery is not proven.
- **Walkable physical rail path:** N1 ↔ T1 ↔ N2 ↔ T2 ↔ N3. The map geometry,
  station names and Scene route flags establish this topology, but the
  original T1 and T2 metadata explicitly says
  `UNBOUND_DO_NOT_GUESS`. The eight directional crossing behaviors across
  the four unbound links must **not** be generated with guessed destinations.
  Both ends' exact Region IDs have been cataloged as candidate sets.
- **Depot branch:** N3→T3 is the one missing *forward* route with exact
  endpoint Regions already known. Its state gate is
  `puzzles.n3.t3BranchUnlocked === true`. Existing T3→N3 return remains
  intact. This route is only source-ready; its arrival and recovery controls
  are not certified.
- **Final passages:** T3→F1 and F1→F2 already exist in the fixture.
- **Rail-car stations:** the N1/N2/N3 control Regions are present, but
  the selectable station-to-station fast-travel destinations/UI have not
  been authored or bound. Do not confuse activation of railway power
  with installation of the travel service.

The batch preview validates **38 explicit endpoint references** against
source Region IDs, stable IDs and exact names. It preserves four existing
scripts; eight orientation-dependent directions remain blocked; one
exact N3→T3 forward behavior is pending. Seven batch readiness tests pass.
This is a **preview**, not a Foundry installer.

## 2. Puzzle state contracts verified from Region script source

- N1 station power = House Proof, Garden Proof and Rail Proof all true
  at `puzzles.n1.proofs.house/garden/rail`.
- N2 fast-travel readiness = `puzzles.n1.railwayPowered === true`;
  kernel writes `puzzles.n2.fastTravelEnabled`.
- N3 hidden spur unlock = `puzzles.n3.departureBoardResolved`,
  `puzzles.n3.switchWheelInstalled` and
  `puzzles.n3.routeOverlay.resolved` all true.
  The route overlay itself requires the old estate survey, cult passage
  diagram and recent route fragment.
- Existing F1→F2 checks F1's inner-ward resolution flag.
- These are **logical conditions**, not evidence that a Token transfer
  presently works.

Actual source scripts:
`work/clscale-central-lodge-migration-v001/clscale-railway-progression-scripts-v001.json`.
They were statically inspected, not executed.

## 3. Critical missing runtime dependency found and installed

The initial Scene-only migration had omitted three related world data
collections. Static audit found:

| World collection | Prior fixture | Source snapshot | Now imported |
| --- | ---: | ---: | ---: |
| Central Lodge puzzle Items | 0 | 33 | 33 |
| Runtime State Ledger | 0 | 1 | 1 |
| Runtime Kernel Macro | 0 | 1 | 1 |

The source Kernel is 40,059 bytes and passes AsyncFunction syntax parsing.
It uses a `world.dicebox` Journal ledger, game-world Items and Actor
embedded Items. It has no hardcoded production data path or URL, but it
**does** include a Token teleport dispatcher. Importing it unchanged would
be premature.

The fixture-only copied Kernel has a guard that refuses its
`transition` action. Its notice, observe, pickup, socket, gate and
self-test cases are preserved. This does not disable the four existing
*separate* CL-50 Region teleports; those remain untested.

The copied ledger retained its data schema and route structure, but
revision was reset to zero, personal notice history was cleared, all
puzzle-progress booleans were reset, and all 33 item recovery records
were reset. The source snapshot was unchanged. All imported documents
preserve original stable IDs and document IDs; ownership now belongs
to the fixture's GM. The 33 item icons use Foundry's standard `icons/`
paths. Two unrelated optional CL-52 one-shot ambient Macros remain
outside this minimal dependency import.

Before import, the fixture's `items`, `journal`, and `macros` LevelDB
directories were backed up to
`work/clscale-central-lodge-migration-v001/pre-runtime-closure-db-v001/`
with file-count/byte verification. The 15-minute offline scanner was
paused during the import and re-enabled in a `finally` block.

The installer
`work/clscale-central-lodge-migration-v001/clscale-apply-runtime-closure-v001.mjs`
verified no destination collisions before any database writes, batch
wrote each collection, reread every document, and saved a
`DISPOSABLE_RUNTIME_CLOSURE_IMPORTED_AND_REREAD` receipt at
`work/clscale-central-lodge-migration-v001/clscale-runtime-closure-install-receipt-v001.json`.
**Do not blindly replay this once-only operation.**

Updated `tools/clscale-fixture-readonly-preflight.mjs` now checks exact
kernel, ledger, 33 items and quarantined transfer action along with
the previous Scene/Region/Actor/module/artwork gates.

**Latest offline preflight: 15/15 PASS, fixture TCP30005 stopped.**

## 4. Exact remaining gates before bulk installation

1. Determine and independently verify both ends of T1/T2 mouth
   connections from actual art/geometry and design evidence. Preserve the
   explicit `UNBOUND_DO_NOT_GUESS` until supported.
2. Author the N1/N2/N3 rail-car destination selector, using the existing
   locked puzzle states and each station's existing Regions.
3. Generate route behaviors from the validated manifest and one shared
   runtime implementation, while keeping existing unrelated Region behaviors.
4. Resolve destination Token collision/elevation, confirmation/ownership
   checks, and persistent interrupted-transfer receipts in the disposable
   fixture. Only then enable the newly generated transfer code.
5. Secure the passwordless fixture GM via Foundry's own user-management
   facilities before another extended runtime test. The verified loopback
   launch safeguard must be present every time. Never change production
   Windows Firewall or production-world settings.

The current fixture remains intentionally stopped. Production Central Lodge
and its source snapshot were not modified.

The reusable Regionwright Studio template library remains **deferred until
the campaign is complete and playtested**, per user direction.
