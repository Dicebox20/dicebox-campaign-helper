# central-core-control-chamber — DiceBox Region Placement

Create one rectangular Foundry Region for each row. Set its **name** to the exact
Region name below, then position it using these Scene-pixel coordinates. Record the
new Foundry Region UUID next to its stable DiceBox ID for the Regionwright handoff.

This file is a sidecar instruction sheet: Universal VTT imports walls and doors, not
DiceBox Regions, RegionBehaviors, puzzle state, or UUID bindings. Do not use this
candidate export as proof of a live Foundry Scene.

| Foundry Region name | Stable DiceBox ID | x | y | width | height | Purpose |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Aleister final activation | `dbx:region:core-aleister-station` | 234 | 275 | 300 | 180 | final-station |
| Sprocket final activation | `dbx:region:core-sprocket-station` | 618 | 275 | 300 | 180 | final-station |
| Dalton final activation | `dbx:region:core-dalton-station` | 1002 | 275 | 300 | 180 | final-station |
| Andrew final activation | `dbx:region:core-andrew-station` | 234 | 580 | 300 | 180 | final-station |
| Lawson final activation | `dbx:region:core-lawson-station` | 618 | 580 | 300 | 180 | final-station |
| Tactal final activation | `dbx:region:core-tactal-station` | 1002 | 580 | 300 | 180 | final-station |
| Core Security Room | `dbx:region:core-security-room` | 500 | 410 | 536 | 200 | physical-cooperative |
| Core chamber north entry | `dbx:region:core-entry` | 680 | 24 | 176 | 72 | teleport-entry |
| Core chamber west rail entry | `dbx:region:core-entry-west` | 24 | 400 | 176 | 95 | teleport-entry |
| Core chamber exit | `dbx:region:core-exit` | 680 | 928 | 176 | 72 | teleport-exit |
