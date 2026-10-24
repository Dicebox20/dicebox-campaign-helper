# DiceBox Bridge → Foundry module / Playwright utility harness discovery
**Captured:** 2026-10-23, America/Los_Angeles  
**Campaign scope:** Cabin in the Ashen Veil / upcoming Scene BUILD discovery only  
**Host:** user-authorized local Windows device through the existing Dicebox Bridge PowerShell engine  
**Evidence class:** read-only local installation/source inspection and loopback/CDP status probe. **Not** a macro execution, Scene build, Foundry runtime certification, DB rebuild, or product-stage change.

## Local artifact inventory and attestation

- Installed module: `%LOCALAPPDATA%\FoundryVTT\Data\modules\dicebox-campaign-helper`
- Installed manifest: `module.json`; module ID `dicebox-campaign-helper`; displayed version `0.1.15`; Foundry minimum/verified `14 / 14.367`; D&D5e `5.3.3`.
- Manifest active esmodule entry: `src/entry-20260823-program-scene-v2.js` (71 bytes, sha256 `992e4f456b3da2e7c3fd8e76180d8cd9b56c2f69e74ab6d3914578c4df7a9299`).
- Full entry file imports **both** `./module.js?dbx=0.1.22` and `./standalone-scene-setup.js`. The initial filtered source excerpt showed only the latter, but full-file reread corrected that.
- `src/module.js` 114835 bytes; SHA-256 `f2de140711b8fd47948bf7d39cd0209fded2a60c6f4744116e03a41c98d6785b`, matching `src/module-byte-attestation.json`'s pinned module hash.
- `src/standalone-scene-setup.js` 12723 bytes; sha256 `b3c9e9c5691e9ab2b7fa0e2edfea7eb216306fd3765d84b30fdbf1492d554691`.
- Additional source files exist for `program-scene-vertical-slice.js`, `foundry-live-bridge.js`, tram fixtures and Scene calibration. The installed `macros/` contains tram fixture preview/apply macros and settings normalization; they are fixture-specific, not evidence of universal map-compilation APIs.
- Chrome/Playwright harness: `%LOCALAPPDATA%\Programs\Chrome for Testing Dev\utility-harness`. `harness.mjs` SHA-256 `75ee834587cc823ec8e8df81b58bf155c23a6d072695c93677bf98f011b225cb` and `README.md` present. `playwright-core` `1.63.0`, isolated Chrome for Testing Dev profile, named-pipe Browser.bind transport, JSON-lines command interface. The harness documents local loopback CDP `127.0.0.1:9224`.

## Capabilities confirmed from source

- Harness `foundry` operation is read-only and returns browser runtime readiness, worldId, user GM boolean, Foundry/system version.
- Harness `macro` operation executes an *existing Foundry Macro UUID*, requires `game.ready`, `game.user.isGM` and `game.world.id === supplied worldId`. **It does not itself enforce elected active-GM equality**; use the more restrictive established exact-target/active-GM gates and reviewed macro before any write.
- Harness also exposes raw `evaluate` and `runScript`, which are generic browser execution and **must not be treated as unrestricted authorization to modify Foundry**.
- The main `game.diceboxCampaignHelper` API in `src/module.js` deliberately exposes frozen **read-only** `describe / diagnostics / supports / query` and explicitly non-executing `execute`/`resolve` paths. It is not a generic write or scene build API.
- Independent `game.diceboxSceneSetup` offers `preview`, `create`, `reread` for create-only single Scenes, with exact `http://127.0.0.1:30000` origin, exact `regionwright-puzzle-test` world, current elected active-GM, Foundry `14.367`, dnd5e `5.3.3`, enabled helper module, strict Scene schema validation, served image attestation, freshness/approval, foreign scene preservation and post-create reread. It does **not** project a full DiceBox macro-built room's Walls, Regions, interactivity or puzzle items.
- Other package-specific installers can author fixture Scenes with managed children, but are not verified as a general-purpose campaign Scene BUILD pipeline.

## Live read-only environment observation

- Dicebox Bridge `powershell_execute` and durable receipt previously verified PASS by smoke test and direct output.
- Foundry desktop process and Node/Chrome processes exist.
- Loopback `127.0.0.1:9224` accepts TCP/CDP connections, and Playwright Core CDP read-only probe connects. Two tabs were observed: `chrome-error:` and `devtools:` schemes; **neither is a live Foundry join page**.
- Loopback `127.0.0.1:30000` was **not listening** during the final probe. Thus the actual Foundry world ID, GM authority, module active status in-world, and macro execution are **not runtime-verified**. Do not infer working scene-building from source presence alone.
- The read-only CDP probe's first invocation had a PowerShell-to-Node quoting error before any browser execution; the corrected stdin-fed invocation succeeded. No helper source edits or Foundry state mutations occurred.
- An initial read-only PowerShell inventory command reported `Get-FileHash` unavailable in this persistent runspace. A later .NET SHA-256 computation succeeded and verified the installed module hash. Do not treat shell exit code 0 as proof that every sub-command succeeded; inspect stderr.

## Safe next BUILD preflight

1. Start or recover the intended Foundry server and read back exact local origin, world ID, elected active GM, module activation and Foundry/dnd5e versions via the harness's read-only status/Foundry probe.
2. Obtain the current source of truth from `AGENTS.md`, reproducible KB, specific map PREPARE/approved image and `.codex/skills/dicebox-injector-workflow/SKILL.md` before constructing a new map Scene.
3. Under the locked BUILD contract, produce exactly one validated self-contained JavaScript injection macro inside one `.md` artifact; run `node tools/validate-dicebox-build.mjs <artifact.md>` from a verified project checkout.
4. Use explicit preview/approval and *fixed-target*, elected-active-GM-checked macro transport rather than arbitrary page eval. Existing harness `macro` can execute an existing UUID, but an approved import/installation path for a newly generated macro must be proved before use.
5. Reread actual resulting Scene and Wall/Region state; record a bounded receipt. Do not infer Foundry certification from an image INSPECT PASS.

**Disposition:** Files FOUND; command path VERIFIED; harness macro capability VERIFIED FROM SOURCE; live Foundry connection / generic Scene BUILD BLOCKED UNTIL SERVER/WORLD/GM VALIDATED.
