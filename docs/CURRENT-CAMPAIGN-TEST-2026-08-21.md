# Current Campaign Test: Ballad of Chauser Bill

This fixture is the campaign-specific basis for the first puzzle test. It is derived from the original campaign-design portion of the supplied chat, after the Prime Arachnid defeat. It is not a general DiceBox rule set and it does not authorize live Foundry mutation. Earlier alternatives and placeholder mechanics are not counted; each stage below is represented by the explicitly settled chat specification.

## Confirmed test shape

| Team | Room | Stage 1 | Cooperative stage 2 | Stage 3 |
| --- | --- | --- | --- | --- |
| Aleister + Sprocket | Signal / Frequency Chamber | Frequency Calibration | Frequency-to-Circuit Matching | Wire Grid |
| Dalton + Andrew | Ascendancy Tram Depot | Tram Repair (Regionwright) | Troubleshooting / Percussive Maintenance (in-scene) | Tram Routing Controller (in-scene) |
| Lawson + Tactal | Rune Mechanism Chamber | Rune Memory | Rune Order Deduction | Heavy Slotting |

The fourth room is the Central Core Control Chamber. It contains six separated activation stations and the locked Core Security Room. Once the three team chains are complete, all six players activate their stations simultaneously; the fixture does not add a deduction step at the finale.

The settled mechanics are specific: four waveform generators that output unique signatures; physical station-to-circuit matching with dangerous wrong connections; a graph-validated approximately 5×5 circuit board; six named disabled trams and a separate Regionwright diagnostic repair stage; an in-scene troubleshooting handoff whose exact event sequence is still runtime-gated; a 6×6 Rush Hour board with a verified six-move solution projected into the Scene; a 20-card, five-pair/ten-decoy rune memory board; physical rune-order deduction; and a five-rune force/timing slotting stage. The fixture does not turn the cooperative or Scene stages into popup minigames.

The ownership split for the tram team is explicit: Regionwright owns Dalton’s repair minigame; DiceBox owns the non-Java Scene routing engine, logical board validation, Tile/Region projection plan, and map-dimension/anchor contract.

### Tram source reconciliation

The chat records `B up 1 → C left 3 → O down 3 → R left 1 → Q down 2 → X right 3`. On the declared 6×6 board, `R left 1` leaves R occupying the square Q needs during `Q down 2`; the move is therefore rejected by the engine. The deterministic BFS finds a legal six-move completion with `R left 2`. The authored sequence remains retained as provenance, while the engine and future Scene projection are fail-closed on illegal geometry until the campaign source is corrected.

## Runtime boundary

Personal stages remain represented as a Regionwright integration boundary. Cooperative and finale interactions are represented as Foundry Region intent. The test fixture names the Foundry observation surfaces but does not invoke them:

- `Hooks.once("ready")`, `game.version`, `game.system`, and `game.users.activeGM` for exact runtime and authority context.
- `fromUuid`, `game.scenes.get`, and `scene.getEmbeddedCollection("Region")` for Scene/Region binding reads.
- `RegionDocument.shapes`, `RegionDocument.behaviors`, and RegionBehavior registry/event surfaces for interaction observation.
- Authoritative reread through `fromUuid` or embedded-document getters before any retry or future mutation.

Map images are renderers only. Spatial Blueprint owns walls, Regions, anchors, and other geometry. The scenario deliberately remains `read-only-test-fixture` with mutation `disabled-until-exact-runtime-gate`.

## Source filtering

The chat remains the provenance source for this test. Later Regionwright setup notes, intermediate alternatives, placeholder puzzle drafts, and the cinematic/video image material are explicitly excluded from the fixture so they cannot silently redefine the four rooms or puzzle chain.

Machine-readable definition: `createCurrentCampaignTest()` in `packages/dicebox-core/src/campaign-test.ts`.

The compiled campaign package is produced by `npm run compile:campaign` through `createCurrentCampaignPackage()` in `packages/dicebox-compiler/src/campaign-package.ts`. It currently binds only the Signal and Rune room renderers; the Tram and Central Core assets exist and were visually reviewed but remain `final-map-required` with no bound path pending the reconciled Tram-east/Core-west topology and renderer review. The package still carries four deterministic Spatial Blueprints, the Regionwright handoff, four orthogonal Region plans, and the 36-anchor tram projection. Exact Foundry/world runtime evidence remains a separate blocker after the renderer gate is cleared.

The tram Region plan also includes the dedicated Dalton repair popup Region at `(1120,120)` with size `300×220` and the physical Dalton/Andrew troubleshooting Region at `(1120,640)` with size `300×220`, while Andrew remains Scene-owned through the 36 logical tram anchors. This separation is required for the Regionwright handoff.
