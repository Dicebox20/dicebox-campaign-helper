# DiceBox Central Lodge: isolated Foundry v14 runtime safety receipt

**Scope:** Disposable `dbx-test-world` fixture only. No production-world or Windows Firewall changes.

## Network isolation gate: PASSED for controlled launches

Foundry v14 `hostname` and `localHostname` affect invite URLs rather than binding interfaces.
A Node preloader guard in `tools/clscale-fixture-loopback-preload.cjs` intercepts
TCP `listen(30005)` only for exact executable, dataPath and world identity,
and substitutes `127.0.0.1`. All other port binds fail closed in the guarded
fixture process. The separate network probe deliberately called `listen(30005,
'0.0.0.0')`; Windows reported only `127.0.0.1:30005` and local HTTP 200.

The real Foundry process was started with the exact preloader environment using
`work/clscale-start-loopback-fixture-v001.ps1` and
`work/clscale-restart-loopback-fixture-v002.ps1`.
Supervisor-created PIDs 26344 and 3612 each passed process-ownership and exact
loopback interface verification. The PC's LAN address 10.0.0.26 could **not**
connect to TCP30005 while the test world was running.

Both launch scripts were hardened to stop the exact supervisor-owned fixture if
a future startup isolation check fails; unrelated processes are not adopted or
terminated. Both scripts passed PowerShell syntax parsing.

**Boundary:** The preload applies **only when these guarded launch scripts
supply NODE_OPTIONS**. It is not a system-wide firewall or product-supported
network policy. Starting Foundry via another launcher can bypass it. Any launch
must re-check listener PID and address immediately; no live access until that
independent observation passes.

## Rollback and service lifecycle

Before starting, the complete fixture world and Config folder were backed up to
`work/clscale-central-lodge-migration-v001/fixture-pre-loopback-runtime-v001/`
and file counts/total bytes verified (world: 100 files, 2,219,590 bytes;
Config: 3 files, 1,697 bytes).

The world was stopped using the existing owned-process Foundry supervisor, and
TCP30005 has **no listener** at the end of this work window. The Windows task
`DiceBox-Offline-Preflight-15m` is enabled, and the current offline preflight
returned **14/14 checks passing** after the runtime tests.

The prior 13-check baseline now has a fourteenth check verifying the documented
Simple Calendar compatibility exception.

## In-world GM runtime evidence

The localhost-only browser joined the disposable fixture as the existing
Gamemaster, without scene activation, Token movement, or Region triggers.
Foundry v14.367 / D&D5e 5.3.3 reported:

- 21 Scenes, all source Scene IDs present
- 202 Regions and 119 Region behaviors with preserved identifiers
- Six Actors
- 39 initially enabled modules

The initial browser runtime generated two errors originating from
`foundryvtt-simple-calendar` v2.4.18: its `getSceneControlButtons`
callback calls `.find` on Foundry v14 controls data, and its journal
directory initialization failed. Static module code inspection confirmed both
legacy handlers belong to Simple Calendar.

The test-world module-enable setting was backed up and only this module set
to disabled; no active package requires it, and the source package remains
installed. A reversible receipt is stored at
`work/clscale-central-lodge-migration-v001/simple-calendar-fixture-compat-receipt-v001.json`.

The subsequent guarded runtime browser test recorded **zero initialization
errors**, with all 21 Scenes, 202 Regions, 119 behaviors, six Actors and the
other 38 active modules intact. Production module configurations were untouched.

## Actual TokenDocument in-memory flag behavior

A read-only GM browser smoke test called `clone()` on an existing Token
Document in the F1 scene, then **only on that ephemeral clone** called
`updateSource` with a synthetic `dicebox-campaign-helper.transferIntent`
marker. The clone retained existing Monks TokenBar, Tagger, Bloodsplats and
Patrol flag namespaces, and the new marker survived the clone's `toObject()`
round trip. The original Token's serialized object was verified unchanged.

Receipt:
`work/clscale-central-lodge-migration-v001/fixture-token-ephemeral-clone-smoke-v001.json`.

This validates basic Foundry v14 in-memory TokenDocument semantics; it does
**not** prove that cross-Scene `RegionDocument.teleportToken` persists a
marker, uses a safe deterministic landing position, or recovers from an
interrupted transfer. No teleport, world Token update, or persistent game
document write was performed.

## Remaining access and transfer gates

**GM account security:** The fixture's Gamemaster account remains passwordless.
An attempted automated account-protection workflow was blocked by a safety
control and was not pursued. Although the verified loopback-only instance
cannot be reached from the LAN, an authenticated GM password should be
configured through Foundry's built-in User Management UI before broader
or unattended use. The instance has been stopped meanwhile.

**Teleport behavior:** All four imported Region routes still use random
placement, and the runtime wall/Token collision and level checks are not yet
certified. The durable intent journal and marker validation are offline/mock
prototypes. No committed teleports were made. A future disposable-only commit
requires independent destination/collision/ownership evidence and a recorded
single-use approval under the user's delegated authority. Production changes
remain separately scoped and unapproved.

**Sources:**
- https://foundryvtt.com/article/configuration/
- https://foundryvtt.com/article/users/
- https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html
