# signal-frequency-chamber — DiceBox Region Placement

Create one rectangular Foundry Region for each row. Set its **name** to the exact
Region name below, then position it using these Scene-pixel coordinates. Record the
new Foundry Region UUID next to its stable DiceBox ID for the Regionwright handoff.

This file is a sidecar instruction sheet: Universal VTT imports walls and doors, not
DiceBox Regions, RegionBehaviors, puzzle state, or UUID bindings. Do not use this
candidate export as proof of a live Foundry Scene.

| Foundry Region name | Stable DiceBox ID | x | y | width | height | Purpose |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Aleister frequency station | `dbx:region:signal-aleister-frequency` | 120 | 120 | 300 | 230 | popup-personal |
| Sprocket circuit station | `dbx:region:signal-sprocket-circuit` | 1116 | 120 | 300 | 230 | popup-personal |
| Physical frequency circuit left | `dbx:region:signal-cooperative-left` | 180 | 500 | 360 | 220 | physical-cooperative |
| Physical frequency circuit right | `dbx:region:signal-cooperative-right` | 996 | 500 | 360 | 220 | physical-cooperative |
| Signal chamber entry | `dbx:region:signal-entry` | 680 | 24 | 176 | 72 | teleport-entry |
| Signal chamber exit | `dbx:region:signal-exit` | 680 | 928 | 176 | 72 | teleport-exit |
