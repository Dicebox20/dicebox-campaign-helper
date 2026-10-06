# Forest Maze + Automation Handoff — 2026-10-06

## Resume point

Active Scene: **L2-03 — Leaning Waystone Hollow**

Current creative state: **APPROVED**

Current accepted render generation ID:

`c0f1c0d3-9084-4e59-bac4-bb29f7eaf95d`

That REDO render received **INSPECT: PASS**. Under the current workflow, PASS is the approval event; there is no separate approval wait-state.

**Next valid operation: BUILD**

Do not re-PREPARE or re-RENDER L2-03 unless a new contradiction is found.

## Workflow

Creative:

`PREPARE → RENDER → INSPECT(PASS = APPROVED | REDO) → BUILD`

Automation tail:

`BUILD → STAGE → INJECT → VERIFY → RECEIPT`

- REDO always abandons the failed prompt and writes a fresh one from PREPARE.
- Desktop Commander owns durable workspace/state/file orchestration only.
- PowerShell Relay owns idempotent browser-free execution/transport only.
- Regionwright/Foundry is the only live Foundry document mutation authority.
- BUILD remains one Markdown file with one self-contained JavaScript macro and must pass the canonical validator before STAGE.
- A transport timeout is outcome-unknown; reread/poll the receipt before retry.
- COMPLETE requires a Foundry/Regionwright receipt bound to the exact BUILD SHA-256.

Canonical automation contract:
`docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`

## L2-03 continuity

- Scene ID: `50107cb31c9eb0b7`
- Arrival-SOUTH Region: `d5e065e17ab1209b`
- Future L2-04 Scene: `625ec9923b87285b`
- Future L2-04 arrival-EAST Region: `0618551b67d0082e`

Routes:
- SOUTH: arrival only
- WEST: correct → L2-04
- NORTHWEST / NORTH / NORTHEAST / EAST: wrong → L2-START
- NORTH is the strongest visual decoy
- WEST is traversable but less inviting

Landmark:
- leaning weathered rectangular fieldstone waymarker
- old practical human construction, not overt ritual architecture

Discovery:
- hidden reverse-face mark beneath moss
- incomplete ring around three short parallel cuts
- tiny hardened wax residues
- flat 1d20 Notice DC 8
- suggested Stage 2 skill: History
- may suggest secret society / cult-like group, but must not identify devils, Fiend Machine, religion, or music

Wrong-turn whispers:
- NORTHWEST: “Something taps once against stone behind you. When you look back, nothing has moved.”
- NORTH: “The straight path should be reassuring, but the farther you walk, the less certain you are that you chose it.”
- NORTHEAST: “For a few breaths the mist smells faintly of old candle smoke, then only wet earth.”
- EAST: “The trees seem to open for you. The welcome feels wrong.”

## Stage II shared mechanics

Wrong routes:
- +1 Dread
- anti-cheese return delays 5 / 10 / 20 / 30 seconds for rapid wrong turns inside 60 seconds
- return to L2-START
- private route-specific whisper
- at 3 Dread draw `RollTable.DBoxDisorient001`
- reset Dread after successful result
- partial Dread carries forward

Discoveries:
`NOTICE → INTERPRET/SEARCH → RECOVER`
- Notice is flat 1d20, no character modifiers
- Uncommon typical DC 8
- one Notice attempt per character until reset
- silent failure

Scale:
- Gridless `battlemap-120`
- 36×24 logical spaces
- 4320×2880 pixels
- 5 ft

## Stage II completed/build status

L2-START — Silent Cairn Crossing
- Scene `XsivqwwGTdkAilKx`
- arrival/reset `tFrNWX4QW6nlemfs`

L2-01 — Split Oak Hollow
- Scene `0cf4479ef966b733`
- arrival-WEST `c57c31832b9c2e61`

L2-02 — Ashring Glade
- Scene `b75a303bd57c91d4`
- arrival-SOUTHWEST `98e1c68bbb91ef85`

All three were installed in Foundry; each initially reported READY_WITH_WARNINGS while its forward preallocated target did not yet exist.

## Project database update

Supplemental reproducible KB delta:
`database/seed.d/2026-10-06-dicebox-scene-workflow.sql`

It records:
- automatic approval on INSPECT PASS
- automation authority split
- current L2-03 state/IDs/next gate
- Stage II Disorientation/discovery rules
- L2-03 BUILD as the next open item
- Desktop Commander, PowerShell Relay, and state-validator tool metadata

`database/build_database.py` now applies the monolithic `seed.sql` and then sorted `database/seed.d/*.sql` deltas.

At handoff time Desktop Commander had no connected device and the PowerShell Relay tunnel was offline, so the local authoritative KB rebuild and live staging/receipt path could not be verified. Reread durable state/receipts when those transports reconnect.
