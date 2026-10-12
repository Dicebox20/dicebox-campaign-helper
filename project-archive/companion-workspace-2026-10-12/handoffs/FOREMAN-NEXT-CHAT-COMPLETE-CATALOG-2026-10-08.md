# DiceBox Campaign Helper — Next Foreman Complete Catalog and Continuity Handoff
**Cutoff:** 2026-10-08, after the independently verified C1 Hidden Chapel grid-size update.  
**Disposition:** HANDOFF ONLY. No campaign Scene, Actor, Item, Region, RegionBehavior, Macro, token, or play-ledger writes are authorized or performed by this cataloging work unit.  
**Authoritative order:** AGENTS.md → current roadmap/checklist/KB → sovereign live Foundry runtime → latest independently verified checkpoint → historical handoffs. **This document does not grant any additional authority.**

## A. Successor instruction — START HERE

Recover **`central-lodge-clscale-c1-grid240-verified-v001`** from `outputs/LATEST-FOREMAN-CHECKPOINT.json`. Do **not** resume the earlier C1 PREVIEW: C1 was actually applied after that preview, source-verification succeeded, and its result was independently reconfirmed during this handoff.

Working root: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`. Read `AGENTS.md`, `docs/FOREMAN-WORKFLOW-CURRENT.md`, `docs/CENTRAL-LODGE-ROADMAP.md`, `docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md`, `docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md`, this handoff, and the canonical SQLite KB. Run `scripts/Show-CampaignHelperRecoveryState.ps1`. Read-only Foundry regression is `work/foundry-playwright-harness/cl90-progress-safety-smoke-v013.page.js` via `node exec-page.mjs read ...` from the harness directory.

**Exact NEXT bounded work unit:** C2 Cult Records & Ritual Undercroft, Scene `UNySMm7YkyYfh41x`, **gridless 120→160 pixels per 5-foot square** as a *candidate* contingent on fresh source and doorway/Region clearance checks. At the handoff boundary, C2 is still **120 px**, **0 placed Tokens**, and no `clscale-c2*` scripts or backup were present. Capture a new exact `Scene.toObject()` snapshot, check current sovereign ledger rather than enforcing any stale revision, run a no-write source/roster/precondition preview, then if safe execute **exactly one** `Scene.update({'grid.size':160},{autoReposition:false})`. Independently verify normalized **entire** Scene source (only approved grid size and Scene audit metadata differ), Wall endpoints, Region shapes, Tile and light locations, actor/token state, ledger/Items/scripts, 21/202/119/33 roster, updated CL90 regression, KB receipt, and checkpoint **before another Scene**. Stop on mismatched runtime or outcome-unknown write. No permission prompt is required for ordinary per-Scene calibration, but all technical gates remain mandatory.

## B. Actual project locations and source-of-truth distinctions

- Small Foreman/KB workspace: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper` (this working directory). **It is NOT a Git checkout:** `.git` is absent and `git status` returns “not a git repository.” The checkpoint's `repository.head:null` and `dirtyCount:0` are **not evidence of a clean Git tree**.
- Original larger authoring/source tree: `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper`; its `work\lodge-campaign` folder exists with `scenes`, `diagnostics`, and `manifests`. Do not copy/rebuild its huge third-party assets blindly. Its original Scene `prepare/PREPARE` specifications should be consulted for art/room decisions; indexes pointing to missing copies under the small Foreman workspace are not proof those source files do not exist in the original tree.
- Foundry authoritative target: **v14.367**, **dnd5e v5.3.3**, world `the-lost-mine-of-phandalin`. Foundry data originally indexed under `C:\Users\rujie\AppData\Local\FoundryVTT\Data\worlds\the-lost-mine-of-phandalin`. The designated developer executor is **Assistant Gamemaster** (user ID `pnTxw7VYpYR4IKWE`); never grant that authority to an arbitrary connected account. Actual primary human Gamemaster ID previously `JESWV6CcU7m07VW6`. No credentials should be copied into handoffs.
- Authorized Windows host at last successful check: `DESKTOP-OI30P4Q` / Remote Desktop Commander device ID `fefa032a-6c81-42c8-86d8-287028c8850e`. Rediscover live device status, do not assume connectivity.
- Browser harness `work/foundry-playwright-harness` and `node exec-page.mjs read <approved script>` for read-only checks. A prior Chrome CDP connectOverCDP timeout on `127.0.0.1:9223` was resolved when the user restored Chrome and Foundry became ready. Never force a restart of unknown active player sessions; two same-class failures require stopping and reconciling.
- Missing orchestration card: `docs/ACTIVE-PROGRAM-SLICE.json` **does not exist in this workspace** at cutoff. This is a workflow/metadata warning, not permission to invent an active stage. `docs/STARTUP-TECHNICAL-ROADMAP.md` and old `AGENTS.md` contain unrelated program-wide Stage12/M1284 details; the **current accepted Central Lodge calibration work** is in its dedicated roadmap, checklist, KB locked decision, and latest checkpoint.

## C. Machine-readable complete catalogs — use these over this prose

All outputs are under **`handoffs/catalog-2026-10-08/`**:
1. `all-kb-data-and-metadata.json`: full 10 first-class SQLite KB tables and all rows, exact column and CREATE TABLE schema metadata, row counts, view definitions/counts, source DB integrity and snapshot timestamp. FTS virtual/shadow indexes are deliberately not copied as redundant authoritative rows. The SQLite file remains the source of truth.
2. `project-file-metadata-sha256.json`: per-file relative path, byte count, UTC last modified and SHA-256 for the local working directory, plus a scoped original-authored Central Lodge source set in the external authoring root. Explicitly excluded secret-like paths and self-referential catalog outputs, with exclusions enumerated. This is an **inventory**, not a copy of executable scripts, image bytes, credentials, or the whole 43GB external repository.
3. `live-central-lodge-scene-inventory.json`: exact read-only Foundry scene IDs, names, grid type/size/distance/dimensions, token/Wall/Region/behavior/light counts for all 21 canonical Scenes, and live stack identity.
4. `catalog-integrity.json`: digest and row-count checks for export, manifest, live inventory, and this written handoff, with consistency assertions. Only trust the handoff as catalog-complete if this receipt says PASS. Inspect any error/skipped-file list; do not claim excluded data was exported.

Historical baseline and previous full export remain at `handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-07.md` and `handoffs/catalog-2026-10-07/`. These are **outdated**, especially behavior/ledger counts and Scene grids. Prefer the latest dated catalogs after actual DB/source readback.

## D. Latest live runtime independently checked

This handoff independently ran `clscale-c1-final-readonly-v001.page.js` and `cl90-progress-safety-smoke-v013.page.js` (read-only) after noticing a newer latest checkpoint than the preceding chat-visible preview.

- Both returned **PASS** (CL90 `PASS_WITH_KNOWN_BLOCKERS`, **0 unexpected failures**); exact game identity Foundry 14.367/dnd5e5.3.3/`the-lost-mine-of-phandalin`, Assistant Gamemaster authenticated.
- **21 canonical Scenes / 202 Regions / 119 behaviors / 119 unique stable IDs / 1 intentionally disabled M2 duplicate Notice / 33 Items**. Current kernel macro `FHQiFYx6OntZVo9d` SHA-256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- Sovereign campaign ledger Journal `xhlXv6CCH34HVga3` at **revision 3**, SHA-256 `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9`. A legitimate new `m1` Notice entry caused revision 2→3 earlier. Do **not revert to revision 2** to satisfy old regression; if revision advances again, examine actual changes rather than assuming corruption.
- No final player/GM client canary was performed for new CL91 puzzle handlers, token travel, Region triggers, or grid visual fit. Source-and-geometry PASS must **never** be renamed “gameplay accepted.”

### All canonical Scene IDs and verified grid values

| Scene ID | Area | Grid px per 5 ft | Placed tokens | Handoff disposition |
|---|---|---:|---:|---|
| `0CSBwzcszPKyaB8u` | B1 Cellar & Utility Basement | **150** | 0 | Verified complete |
| `5K1uASAARnX8aZhP` | B2 Hidden Annex | **240** | 0 | Verified complete |
| `EDdktL7VUihbpKe9` | C1 Hidden Chapel | **240** | 0 | Verified complete |
| `UNySMm7YkyYfh41x` | C2 Cult Undercroft | 120 | 0 | **Next: candidate 160**, not begun |
| `Zq8iXByDVhHRbA7w` | E1 Front Grounds | 120 | 4 | Outdoors; leave |
| `sI4YVZZChgey1qNi` | E2 Service Yard | 120 | 2 | Outdoors; leave |
| `iqfCcDpEer4pwrJj` | E3 Garden | 120 | 0 | Outdoors; leave |
| `DLcheEi6e5OHOYmU` | E4 Graveyard | 120 | 0 | Outdoors; leave |
| `U8S5ZrTjaPIkTUIL` | M1 Entrance Hall | 120 | **1** | Ret token; separate footprint/center safeguard; candidate 360 |
| `JZkxX6lUQe8Nc8xJ` | M2 Study & Parlor | **320** | 0 | Verified complete |
| `LXTA8mx1rJ2L6e2J` | M3 Kitchen | **240** | 0 | Verified complete |
| `MAbLfBqG7qIVVuLN` | N1 Station | 120 | 0 | Candidate 150; CL50 route footprint sensitive |
| `4pc5akMBieHU7GvV` | N2 Grotto Station | 120 | 0 | Candidate 160; CL50 route footprint sensitive |
| `pHQvDUDlyWZFuNrX` | N3 Collection Depot | 120 | 0 | **Keep 120** (narrow 160px doorway), protect N3 gate |
| `if9iWDRjSwI87EeX` | U1 Guest Rooms | 120 | 0 | Candidate 180 |
| `PVf6Gbrv9HbB88uZ` | U2 Servants & Attic | 120 | 0 | Candidate 160; preserve interpretation Region |
| `La9krMOMBhAhDLi6` | F1 Infernal Threshold | 120 | 0 | Candidate 320, verify travel landing |
| `ImeIdHbYb6kZKAdt` | T1 Tunnel | 120 | 0 | Tunnel; leave |
| `ez9MSQ8QIO4cW6zo` | T2 Tunnel | 120 | 0 | Tunnel; leave |
| `aIKQmFiuXWipEdyb` | T3 Abandoned Spur | 120 | 0 | Tunnel; leave |
| `HWitOe1wSid7MZ1y` | F2 Final Summoning | 120 | 0 | **Uncalibrated** until reliable visual/door evidence |

**All 21 Scene images remain 4320×2880**, gridless `grid.type=0`, `grid.distance=5 ft`. Current token counts come from a read-only Foundry Scene inventory, not an Actor ownership inference.

### Verified grid-migration source receipts (C1 is already APPLIED)

| Lane | Original → new px | Full original snapshot | Original Scene SHA-256 | Latest verified Scene SHA-256 |
|---|---|---|---|---|
| M2 | 120→320 | `outputs/foreman-checkpoints/clscale-m2-before-grid320-v001.json` | `c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5` | `e9663751ca317c5922b4ce9ae97d2c4cda1b84f79fa23599b7a56d6140f3d305` |
| M3 | 120→240 | `outputs/foreman-checkpoints/clscale-m3-before-grid240-v001.json` | `ffdbd64f0df881239e407c1d45fef68a655698546837a50f30b7fd6255efec8f` | `6604bdf528f9e6609f3fa2b53c94c1c49e5ba679f0dd90c0f2e9c32cf86eacc6` |
| B2 | 120→240 | `outputs/foreman-checkpoints/clscale-b2-before-grid240-v001.json` | `9302b0144902eff5223c0904451b72790c7a6864c81b7066e604155f22435db3` | `53e20aceaa543608212bf5e33034a47ea47ddfd34f49d8cef8e0c456f203d581` |
| B1 | 120→150 | `outputs/foreman-checkpoints/clscale-b1-before-grid150-v001.json` | `c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c` | `ec8637a25258c1e3d207b0f4f4d31aa7d40da316599e0184618bcebb67c95c20` |
| C1 | 120→240 | `outputs/foreman-checkpoints/clscale-c1-before-grid240-v001.json` | `664816c5ff2c42521682f9bcdc5ec5ac7b1e52cc5760a75174f84d5c538d3fc1` | `80ce2a899ad5304103c6e14b8b84ad4b3fc6d9e8962534990890489df82d3c7a` |

In each of these 5 grid-only migrations, Foundry `Scene.update({'grid.size':n},{autoReposition:false})` was one authorized bounded write. Independent readback normalized only grid size and Scene audit metadata to reproduce the **entire** original Scene source hash: Wall endpoints, Region geometries, lights, tiles, scripts and other stored fields remained unchanged. C1 specifically retains **21 walls / 10 Regions / 3 lights**, 0 tokens. This is not a player visual/lighting or token collision canary.

## E. The campaign and preservation gates

- **CL13/CL91 M1 Seventh Winter clock**: source-installed with accepted fixed solution **4:35** (IV fourth/youngest heir and VII seven-year interval); clue dates 1431/1438 DR; still requires eventual GM/player test. M1 Ret token must not be shifted without deliberate center clearance review.
- **CL91 M2 Founder Portrait**: serialized single ordered Notice→observation→Signet-gated existing Old Estate Survey pickup. Composite enabled outer behavior `IdriZEGhxUY9whcV` source SHA `4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6`. Redundant inner Notice `NxUruGwqnow13Krv` is intentionally disabled while retaining original code and ID. No player test.
- **CL91 U2 Servant History**: separate observed versus interpreted states installed/source-verified; historical evidence and fail-roll handling must survive U2 regrid. Player canary deferred.
- **CL91 N3→T3 hidden branch unlock**: user approved three-proof AND condition: `puzzles.n3.departureBoardResolved && puzzles.n3.switchWheelInstalled && puzzles.n3.routeOverlay.resolved`. Gate RegionBehavior `yikneH7tFfD5zsr6` source SHA `3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd`, installed. **This sets logical branch state only; no outgoing N3→T3 scene teleport has been installed.** Preserve T3→N3 return already in game.
- **CL50 R1–R4 railway routes**: author-approved topology, but current route installers **quarantined**. Older 1×1 destination placement receipts are stale if grid sizes change. The R1 installer previously hit a tool-safety stop, and placement/GM election/cooldown/no-bounce/consent/recovery are not certified; do not bypass or replay it. Preserve existing E1→M1, T3→N3, T3→F1 and F1→F2 independently installed travel handlers, with no player acceptance claimed.
- **CL52 M1 footsteps/M2 haunted piano**: original GM-triggered one-shot audio macros/source installed; **do not play or auto-trigger** during regression. Preserve one-shot flags if any are set; require real player/GM delivery canaries at final campaign acceptance.
- **CL93 lighting and visual effects**: final-only campaign phase after CL92; 86 hidden AmbientLights previously audited, no mass effects or day/night trigger authorized. Never invent a story-night activation event. Preserve light geometry during grid changes.
- **Player gameplay acceptance is intentionally postponed** until the whole campaign is built; source-level, offline, and preview PASS are not equivalent.

## F. Canonical SQLite KB and reconciliation outcome

DB: `database/dicebox_campaign_helper_knowledge.sqlite`; **reproducible sources** `database/schema.sql`, `database/seed.sql`, sorted `database/seed.d/*.sql`. Validate read-only `database/verify_database.py` after any rebuild. The 10 first-class tables are: `kb_decisions`, `kb_facts`, `kb_metadata`, `kb_milestones`, `kb_open_items`, `kb_relationships`, `kb_research_subjects`, `kb_sources`, `kb_tools`, `kb_trials`. Use the machine export for final exact row/column counts; do not infer incomplete tasks from raw `kb_open_items` total (many statuses are closed). The current calibration decision `D-2026-10-08-CL-SCALE-INTERIOR-GRID-PROGRAM` is **locked**; the corresponding item `O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION` is **in_progress**. C1 receipt `F-2026-10-08-CL-SCALE-C1-GRID240-INSTALLED` is active. The accepted design and live observations are consistent.

This handoff catalogs and reconciles authoritative records. It must **not** flatten mixed evidence layers, retrospectively promote planned routes, or overwrite present play state. Historical roadmap/checklist text referring to 116/117/118 behaviors, ledger revisions 1/2, "unapproved" N3 gate or "preview-only" grid calibration is a dated intermediate note, not the current baseline. The latest source, checkpoint and KB supersede it.

## G. Bridge / relay and safe communication

Bridge/Codex Foreman can supplement work but is **not the source of truth** and must not be activated by this static handoff. Previous Bridge continuity had unresolved `host_accepted`/staged receipts and historical conversation binding. Never replay, treat host acceptance as delivered, or send a native trigger to an old conversation. Successor must use read-only `bridge_status`/exact `bridge_foreman_status` and reconcile any pending correlation **before** any explicitly authorized new live session or message. Current conversation/project identity is not interchangeable with an old binding. No Bridge send is being requested by this handoff.

The project's shared communication document is `https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit` (Tab 1). Mirror the *compact* handoff and exact local paths at an explicit handoff boundary through the authorized Google Drive connector if available; mirror does not become authority. Never paste credentials or raw player/private data.

## H. Successor exact recovery commands and stop conditions

```powershell
$root = 'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper'
Set-Location $root
.\scripts\Show-CampaignHelperRecoveryState.ps1
Get-Content .\outputs\LATEST-FOREMAN-CHECKPOINT.json -Raw
python .\database\verify_database.py
Get-Content .\handoffs\FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-08.md -Raw
Set-Location "$root\work\foundry-playwright-harness"
node .\exec-page.mjs read .\cl90-progress-safety-smoke-v013.page.js
node .\exec-page.mjs read .\clscale-c1-final-readonly-v001.page.js
```

For the C2 next slice: first verify Chrome and Foundry `game.ready`, correct world/stack, authorized Assistant Gamemaster, no non-GM players, exact target ID, original grid 120/5ft and source image 4320×2880, zero Tokens, current ledger hash, canonical roster and original Wall/Region geometry. **Only then** create an exact backup and a new preview; do not rerun C1 or any existing `apply` scripts. If the KB or live world has advanced since this handoff, record the delta and use the **newer current authority**.

**Do not** attempt to make the handoff itself continue executing future work. It is a durable recovery package for a new Foreman conversation. This Foreman turn must end after catalog integrity, KB reconciliation, and a final **handoff/STOP** checkpoint. 
