# Tram Fixture Access Adapter Plan

Status: `planned` — source-only plan. It does not authorize a fixture or
Ballad write.

## Purpose

Provide one fixed, native Foundry v14 entry path for the two playable Tram
puzzles without reusing `executeScript`, arbitrary Macro source, or the failed
Regionwright behavior transport.

## Ownership

| Access | Region / surface | Owner | Allowed controller |
| --- | --- | --- | --- |
| Dalton repair | `dbx:region:tram-dalton-repair` | Regionwright repair dialog, invoked by DiceBox's fixed behavior adapter | Dalton or Andrew McConaughey |
| Andrew routing | new `dbx:region:tram-andrew-routing`, the 6x6 board rectangle `420,210,660,570` | DiceBox Rush Hour dialog and Scene projection | Andrew McConaughey only |
| Physical troubleshooting | `dbx:region:tram-cooperative` | Scene-owned physical interaction | Dalton and Andrew; no popup is added |

The routing Region is an explicit access surface over the board. It does not
replace the 36 static controller Regions or any dynamic car footprint Region.

## Fixed native behavior

- Declare `dicebox-campaign-helper.tramAccess` as a module `RegionBehavior`
  subtype in `module.json` and register its data model during `init`.
- Subscribe only to `CONST.REGION_EVENTS.TOKEN_ENTER`.
- Verify exact fixture world/version, the helper-owned fixture Scene and
  stable Region ID, moving user, token actor's DiceBox semantic ID, and an
  allowlisted action before opening a dialog.
- Dalton action calls only the named Regionwright Ascendancy `open` API for
  `dbx:puzzle:dalton-tram-repair`; Andrew action calls only the DiceBox Rush
  Hour dialog. The handler catches and reports a rejected dialog instead of
  retrying or altering documents.
- The behavior owns no Regionwright state, progression state, teleports,
  Macros, Walls, Tiles, or foreign flags.

## Fixture delivery order

1. Deterministically test the subtype registration, action/Region/actor
   allowlist, rejected dependency handling, and no-write read-only audit.
2. Stage source-to-fixture parity and reload one maximized fixture client.
3. Run a no-write runtime probe: manifest subtype exists, registry contains
   the subtype, both dialog APIs exist, and the owned Scene/Region bindings
   resolve.
4. Preview the exact owned delta: one new routing Region and two native
   `tramAccess` RegionBehavior documents. Review actor bindings and foreign
   behavior preservation.
5. Apply once, reread the Region and both behavior UUIDs, then test Dalton
   and Andrew from their controlling clients. A rejected dialog or timeout is
   outcome-unknown; reread before any recovery.

This plan does not promote the fixture result to Ballad. Ballad requires its
own current Scene/Region UUID bindings, active-GM preview/approval, reread,
and player-compatible observation.
