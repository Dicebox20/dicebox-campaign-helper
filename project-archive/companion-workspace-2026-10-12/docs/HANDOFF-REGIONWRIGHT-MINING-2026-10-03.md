# Regionwright Mining — Development Handoff

**Project:** Dicebox Campaign Helper  
**Module:** `regionwright-mining`  
**Runtime:** Foundry VTT 14.367 / D&D5e 5.3.3  
**Captured:** 2026-10-03

## Critical starting rule

Do **not** replace the installed module with the older project output copy.

Installed/live:
`C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\regionwright-mining`

- version `0.1.4`
- `socket: true`
- contains successful live socket/interaction/privacy fixes

Older project output:
`C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\outputs\regionwright-mining`

- version `0.1.0`
- stale relative to installed runtime
- reconcile before any future deploy/reinstall
- tracked as KB `O-458`

Read first:
- `AGENTS.md`
- `docs/BLINGDENSTONE-GATHERING-RUNTIME-2026-10-03.json`
- `docs/BLINGDENSTONE-GATHERING-RUNTIME-2026-10-03.md`
- Dicebox KB mining facts/decisions/open items

## Public API

```js
const api = game.modules.get("regionwright-mining")?.api;
```

Current 0.1.4 API:

```js
api.version
api.catalog.ores
api.catalog.order
api.catalog.get
api.catalog.value
api.catalog.createItemSource
api.yieldForAthletics
api.configureRegion
api.configureSelected
api.resetRegion
api.resetScene
api.clearRegion
api.readRegion
api.isRegion
api.open
api.findPickaxe
api.installItems
api.openSetup
api.refreshInteractions
```

Do not silently rename/remove these methods; Dicebox macros depend on them.

## Data contract

From `mining-engine.js`:

```js
MODULE_ID = "regionwright-mining"
MINING_REGION_FLAG = "miningDeposit"
MINING_ORE_FLAG = "ore"
MINING_PICKAXE_FLAG = "pickaxe"
MINING_SOCKET = "module.regionwright-mining"
DEFAULT_MAX_ATTEMPTS = 5
```

Real Region flag:

```js
region.flags["regionwright-mining"].miningDeposit
```

Earlier code sometimes searched for `miningVein`; that is wrong.

Normalized deposit:

```js
{
  version: 1,
  oreId,
  maxAttempts: 5,
  attemptsUsed,
  depleted
}
```

## Gameplay contract

1. Player uses a player-owned token on Token Controls.
2. Player clicks the mining node/ore artwork.
3. Actor must have a Miner's Pick / pickaxe.
4. Roll Strength (Athletics).
5. Athletics directly determines ore yield.
6. Active GM performs authoritative ore/shared-state mutation.
7. One extraction attempt is consumed.
8. Five attempts deplete the vein.
9. GM reset restores it for a later gathering cycle.

Yield:

| Athletics | Ore |
|---:|---:|
| 1-9 | 0 |
| 10-14 | 1 |
| 15-19 | 2 |
| 20-24 | 3 |
| 25-29 | 4 |
| 30+ | 5 |

Do not add a second hidden rarity/DC roll unless intentionally redesigning the game.

## Ore catalog

- `iron-ore` — common — 1 sp/lb
- `copper-ore` — common — 5 sp/lb
- `silver-ore` — uncommon — 2 gp/lb
- `gold-ore` — rare — 10 gp/lb
- `mithral-ore` — very rare — 25 gp/lb
- `adamantine-ore` — very rare — 50 gp/lb

Blingdenstone currently has no routine mithral/adamantine deposits.

## Live deployment

Current exact-world mining count: **24 deposits**.

- iron 9
- silver 8
- copper 4
- gold 3
- mithral 0
- adamantine 0

Five later manually drawn Regions are authoritative geometry and must not be moved/resized:

- `Scene.S8xxiJ8bp7IvnCsD.Region.7Bx0X2VRr4J9dn5u` -> Steamstone Copper
- `Scene.S8xxiJ8bp7IvnCsD.Region.uXC3QIVJSAwJufFu` -> Steamstone Silver
- `Scene.zKoROMo2fXugrZAq.Region.QTa9aePxyoDuRsEU` -> Waystation Gold
- `Scene.bIsvqkZ34I6TPesQ.Region.cfKOGcJg5JSohOAB` -> Shellwater Iron
- `Scene.bIsvqkZ34I6TPesQ.Region.8Y4q8DU4HwGYrPNV` -> Shellwater Copper

At the reconciliation snapshot, five deposits were fully depleted, so the five-swing state has executed in live play.

## Invisible but clickable contract

Correct mining Region state:

```text
hidden = false
visibility = GAMEMASTER
locked = false
default ownership = OBSERVER
```

Never make mining nodes invisible with `hidden=true`.

Foundry hidden Regions deactivate behaviors. Regionwright Mining needs the Region active, unlocked, and Observer-permitted; its Region subclass provides a near-transparent player hit target.

All 24 mining Regions were reread in this corrected document state. KB defect `O-452` is closed; player-view certification remains `O-461`.

## Socket / GM authority

A major failure was:

> The active GM did not respond to the mining request.

Cause: the custom socket existed while the manifest lacked `socket: true`.

Installed 0.1.4 has socket support enabled. Preserve active-GM authority; do not make arbitrary player clients authoritative for shared depletion or reward mutation.

## Pickaxe failure

`api.findPickaxe(actor)` is public.

Missing-pick failure must:
- award nothing
- consume no attempt
- leave deposit state unchanged

## Private mining output

User requirement: each swing/result should be private to the player performing it.

Installed 0.1.4 was patched so Athletics uses:

```js
actor.rollSkill(
  { skill: "ath" },
  {},
  { rollMode: "selfroll" }
);
```

The extraction summary is whispered to the triggering user.

Static source/syntax checks passed, but the patch was made while Foundry was already running. A full Foundry restart + non-GM player test is still required. Tracked as `O-460`.

## Reset behavior

Use:

```js
api.resetRegion(region)
api.resetScene()
```

Reset restores attempt/depletion state but preserves already awarded ore and Region geometry.

A prior live long-rest receipt reported:

```text
24 mining nodes reset
24 fishing spots ready
exploration reset
```

## Informational mining notices

Dicebox notice behavior ID:
`exploration-entry-notice-mining`

The notice is informational only. It does not configure mining mechanics.

Use `api.isRegion(region)` / `api.readRegion(region)` to identify actual deposits.

## Asset status

Installed mining currently bundles **zero** art files.

Older project output has seven ore SVGs:

- iron
- copper
- silver
- gold
- mithral
- adamantite
- tin

Naming mismatch to fix:
- runtime ID: `adamantine-ore`
- old asset filename: `adamantite-ore.svg`

Installed `catalog.js` currently references Foundry/core `icons/commodities/stone/ore-chunk-*.webp` paths. Treat those as taxonomy/reference, not automatically redistributable module assets.

Recommended licensed asset library:
- ore/material: generic ore, iron, copper, silver, gold, mithral, adamantine, tin, coal, crystal, geode, raw gems, stone
- tools: pickaxe, hammer, sledge, chisel, shovel, lantern, helmet, ore cart, rope, survey tools
- world/deposit art: exposed vein, metallic seam, crystal cluster, ore pile, worked mine face, depleted vein, rubble, mining props
- UI/state: mine, swing, success, failure, depleted, reset, configure, locked, available, progress, private/GM-only

Prefer SVG for icons/UI and WebP for painted world/deposit art.

## Highest-priority source reconciliation

Installed 0.1.4 is the successful runtime; project output 0.1.0 is stale.

Before future packaged deployment:
1. diff installed vs project output
2. isolate intended live changes
3. promote socket/interaction/privacy/API changes into durable source
4. do not copy LevelDB runtime state
5. preserve backups
6. run syntax/tests
7. compare hashes/content
8. only then deploy from project source

Tracked as `O-458`.

## Final certification fixture

`O-451` remains in progress. After reconciliation + restart, verify:

1. invisible node clickable from Token Controls
2. missing pickaxe refusal with no mutation
3. valid pickaxe mining
4. Athletics -> correct yield
5. ore awarded/stacked once
6. exactly one shared attempt consumed
7. five swings deplete
8. depleted node refuses more
9. simultaneous two-client final swing cannot double-spend
10. reset restores attemptsUsed=0/depleted=false
11. reconnect/timeout does not duplicate awards
12. other players do not receive private roll/result
13. fishing still works with mining hooks active

## Do not break

- no `hidden=true` on mining Regions
- no removal of Observer permission
- no locked mining Regions
- no `miningDeposit` -> `miningVein` rename
- no player-authoritative shared depletion
- no overwrite of manual Region geometry
- no removal of already awarded ore during reset
- no deploy of project 0.1.0 over installed 0.1.4
- no treating entry notices as mining configuration
- no routine mithral/adamantine veins without explicit balance decision
- no redistribution of Foundry/WotC art merely because runtime can reference it

## Recommended next work order

1. Reconcile installed 0.1.4 into durable project source.
2. Restart Foundry.
3. Smoke-test private output + clickability.
4. Run full certification fixture.
5. Build redistributable mining art library.
6. Point catalog at bundled licensed assets.
7. Polish UI only after authority/state behavior remains certified.
8. Package/version cleanly.

## New-chat kickoff

> We are continuing development of the Dicebox/Regionwright Foundry module `regionwright-mining`. Read `AGENTS.md`, query the Dicebox KB, and read `docs/HANDOFF-REGIONWRIGHT-MINING-2026-10-03.md` plus `docs/BLINGDENSTONE-GATHERING-RUNTIME-2026-10-03.json` before changing anything. The installed module at `C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\regionwright-mining` is v0.1.4 and contains successful fixes that are NOT yet fully reconciled into `outputs/regionwright-mining` v0.1.0. Do not overwrite the installed module with the older project copy. First reconcile source drift, then restart Foundry and certify mining clickability, GM-authoritative five-swing depletion, reset, missing-pick failure, private self-roll/private result chat, and fishing coexistence. Preserve manually placed Region geometry and the canonical `flags.regionwright-mining.miningDeposit` contract.

## Current state

**Regionwright Mining is already a functioning reusable Foundry subsystem; the next job is to preserve successful live 0.1.4 as durable source, certify multiplayer/privacy edge cases, and replace core icon references with a redistributable bundled art set.**