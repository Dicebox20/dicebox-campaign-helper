# rune-mechanism-chamber — DiceBox Region Placement

Create one rectangular Foundry Region for each row. Set its **name** to the exact
Region name below, then position it using these Scene-pixel coordinates. Record the
new Foundry Region UUID next to its stable DiceBox ID for the Regionwright handoff.

This file is a sidecar instruction sheet: Universal VTT imports walls and doors, not
DiceBox Regions, RegionBehaviors, puzzle state, or UUID bindings. Do not use this
candidate export as proof of a live Foundry Scene.

| Foundry Region name | Stable DiceBox ID | x | y | width | height | Purpose |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Lawson rune memory station | `dbx:region:rune-lawson-memory` | 120 | 120 | 360 | 240 | popup-personal |
| Tactal heavy rune station | `dbx:region:rune-tactal-slotting` | 1056 | 120 | 360 | 240 | popup-personal |
| Physical rune order left | `dbx:region:rune-order-left` | 180 | 500 | 360 | 220 | physical-cooperative |
| Physical rune order right | `dbx:region:rune-order-right` | 996 | 500 | 360 | 220 | physical-cooperative |
| Rune chamber entry | `dbx:region:rune-entry` | 680 | 24 | 176 | 72 | teleport-entry |
| Rune chamber exit | `dbx:region:rune-exit` | 680 | 928 | 176 | 72 | teleport-exit |
