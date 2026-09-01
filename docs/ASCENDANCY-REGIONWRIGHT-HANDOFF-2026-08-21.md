# Ascendancy / Regionwright handoff

This is the campaign-side contract for the Ballad of Chauser Bill Prime Arachnid aftermath test. The machine-readable source is `packages/dicebox-core/src/ascendancy-handoff.ts`; it is validated by `tests/ascendancy-handoff.test.ts`.

## Consumer

The Region Editor task at `C:\Users\rujie\Documents\Region Editor` should consume `createAscendancyRegionwrightHandoff()` and use the following Regionwright source files as the observed integration boundary:

- `premium/scripts/ascendancy-engine.js` — personal/progression engine and external puzzle IDs.
- `premium/scripts/ascendancy.js` — Foundry flags, active-GM authority, Region handling, sockets, and API.
- `premium/scripts/premium-module.js` — registration at `game.modules.get("regionwright").api.premium.ascendancy`.
- `premium/styles/ascendancy.css` — personal minigame presentation.
- `tests/ascendancy.test.mjs` — source-level engine/integration evidence.

The source reports Regionwright `0.1.4` and Ascendancy engine version `1`. This is source-observed evidence, not live Foundry certification.

## Stable IDs and ownership

The six personal IDs are:

`dbx:puzzle:aleister-frequency`, `dbx:puzzle:sprocket-circuit`, `dbx:puzzle:dalton-tram-repair`, `dbx:puzzle:andrew-tram-routing`, `dbx:puzzle:lawson-rune-memory`, and `dbx:puzzle:tactal-rune-slotting`.

Regionwright owns popup/browser presentation for Aleister, Sprocket, Dalton, Lawson, and Tactal. Andrew’s `andrew-tram-routing` is explicitly DiceBox-owned: it is the logical 6×6 Rush Hour engine plus Foundry Scene Tile/Region projection. Do not expose Andrew’s routing controller as a Regionwright popup, even though the Regionwright source contains a reference Rush Hour engine.

For the current weekend only, Dalton remains the narrative character and final-station identity, but `dbx:actor:andrew-mcconaughey` is an additional authorized controller for `dbx:puzzle:dalton-tram-repair`. Regionwright must treat `authorizedControllerCharacterIds` as an allowlist for that popup; it must not replace Dalton's actor, pair, or final-station ID.

The three cooperative stages are physical Scene interactions owned by Foundry Regions. They are not popup minigames. The final activation is six physical stations, active-GM mediated, and completes only when all six intended actor roles have activated in the same explicit `activationRound`. A new round resets the prior station set before recording the new station activation; it cannot accumulate activations across rounds.

## Runtime contract

- Regionwright API root: `game.modules.get("regionwright")?.api?.premium?.ascendancy`
- Scene state flag: `flags.regionwright.ascendancy`
- Cooperative Region flag: `flags.regionwright.ascendancy.region`
- Tram anchor flag: `flags.regionwright.ascendancy.anchors`
- Cooperative handoff: `...ascendancy.advanceCooperativeStage`
- Final station handoff: `...ascendancy.activateStation`
- `regionwright.ascendancyCooperativeStage` is an entry notification emitted when a cooperative Region is entered. It is not the completion receipt. Cooperative completion is the authoritative `pairs[pairId].cooperativeComplete` state after `advanceCooperativeStage`.
- Other relevant hooks are `regionwright.ascendancyPuzzleComplete` and `regionwright.ascendancyCoreUnlocked`.
- Final station calls must carry an explicit `activationRound` from the Scene station event; the active GM rejects or resets stale-round state before persisting.

Semantic DiceBox IDs remain canonical. Regionwright external IDs, Foundry document IDs, UUIDs, and player user IDs are runtime bindings and remain unresolved until the exact installed Foundry runtime is observed. The active GM must recheck authority and reread authoritative Scene/Region state before any retry or mutation.

## Tram Scene geometry

The generated renderer is `assets/maps/ascendancy-tram-depot-v3.png`, 1536×1024. Spatial Blueprint owns geometry. The logical board is 6×6 with origin `(420,210)`, cell size `110×95`, and 36 stable anchors. The tram Scene also contains the dedicated Dalton repair Region at `{x:1120,y:120,width:300,height:220}`, bound to `dbx:puzzle:dalton-tram-repair`, and the physical Dalton/Andrew troubleshooting Region at `{x:1120,y:640,width:300,height:220}`, bound to `dbx:cooperative:dalton-andrew-tram-troubleshooting`. Both are separate from Andrew’s routing anchors; only Dalton’s Region is a Regionwright popup entry. Tiles are projections of logical state; pixel dragging is not authoritative. The handoff is read-only and remains `disabled-until-exact-runtime-gate`.

The compiled campaign package also carries four deterministic Spatial Blueprints in `packages/dicebox-compiler/src/ascendancy-map-blueprints.ts`. Each blueprint declares eight orthogonal perimeter Wall segments with four door gaps and four door anchors. The tram blueprint additionally declares 36 interaction anchors derived from the same logical 6×6 board plus the Dalton and cooperative station anchors. Region Editor must consume these blueprints for `Scene.create → scene.createEmbeddedDocuments("Wall", ...) → scene.createEmbeddedDocuments("Region", ...)`; the generated PNG remains a renderer and must not be used to infer walls, doors, tracks, scale, or puzzle state.

The campaign chat’s `R left 1` sequence is retained as provenance but is illegal on the declared board before `Q down 2`. The DiceBox engine accepts only the legal BFS route, which uses `R left 2` and six moves.

Do not duplicate puzzle rules in the Regionwright adapter. Consume the IDs, flags, hooks, and ownership above; preserve unknown or foreign state; and report completion through the declared handoff/receipt boundary.

## Macro permission invariant

This campaign currently declares no player-facing Macro documents: Regionwright popup Regions and the DiceBox Scene controller bind directly through the approved Region/API contract. Each planned Region therefore carries `macroBinding: null`, and the package records `mode: none-in-current-campaign` as no-macro evidence. If a macro is introduced later, it must grant explicit Player ownership through the native Foundry Macro document ownership field (`ownership.default`); inherited permissions are not accepted. The Region Editor task must verify the intended Player can use it and include the macro ID, explicit ownership value, and authoritative read-back in its target-bound receipt. Macro source may only bind an approved stable DiceBox ID or Regionwright entry point; it must not duplicate puzzle rules or become an arbitrary execution surface.
