# Dark Arch M01 — Live module-version preflight blocker

**Date:** 2026-10-16. **Nature:** Diagnosis/read-only evidence, not permission to mutate the live world.
**Current review branch:** `feature/dicebox-scene-injector-v2-1-beta-2026-10-16`.
**Macro candidate:** `DiceBox-Dark-Arch-M01-Painterly-Injector-V2.1-Beta.md` (approved painterly map embedded; offline candidate only).

## User-observed failure

Foundry console reported:

```text
Error: Expected enabled module dicebox-campaign-helper@0.1.15
    at checkStack (...)
DiceBox Dark Arch stopped: Expected enabled module dicebox-campaign-helper@0.1.15.
```

The macro's read-only `checkStack()` requires:
- `game.modules.get("dicebox-campaign-helper")` exists,
- `mod.active === true`,
- `mod.version === "0.1.15"`.

This check runs before asset deployment, Scene creation, Walls, or Regions. User trace indicates a **fail-closed preflight**; no partial installation is inferred. The message itself does not reveal which condition failed.

## Direct independent read-only evidence

- Installed local Foundry Data manifest: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\dicebox-campaign-helper\module.json`.
- Installed manifest declares `id: dicebox-campaign-helper`, **version `0.1.2`**, core compatibility verified `14.367`.
- Repository implementation on current review branch declares **version `0.1.15`** in `packages/dicebox-foundry/module.json`.
- Neither manifest advertises an `manifest`, `download`, or `url` value. Do **not** assume Foundry can update it through the normal module-manager automatic update action.
- The module's **enabled** state for the currently open world and runtime-loaded `game.modules.get(...)` value remain unverified. The disk manifest mismatch alone is sufficient to explain the preflight if the world is loading this installation.

## Recovery / validation plan

1. From the open Foundry GM developer console, **read only**:
   ```js
   (() => {
     const m = game.modules.get("dicebox-campaign-helper");
     console.log("DiceBox module preflight", {
       world: game.world?.id,
       core: game.version,
       system: game.system?.id,
       systemVersion: game.system?.version,
       moduleFound: Boolean(m),
       moduleActive: m?.active ?? null,
       loadedModuleVersion: m?.version ?? null
     });
   })();
   ```
2. Confirm the exact-world active-GM authorization and world backup. If the loaded module matches local `0.1.2`, deploy a **reviewed `0.1.15` module build** into the exact installed module folder with Foundry stopped and preserve a versioned rollback copy. This requires a separate authorized deployment/maintenance gate, not a silent macro check change.
3. Restart Foundry and enable the module in the target world, then rerun the *read-only* probe.
4. Once the loaded module is active at exactly `0.1.15` and the core/D&D5e/GM/world checks match, use the accepted build's normal preview/approval flow.
5. If `0.1.15` cannot be installed or verified, **do not replace the expected version with `0.1.2` or disable `checkStack()`** merely to proceed. Record a deliberate compatibility exception or postpone installation.

## Evidence boundary

There is no exact-world runtime inspection, user-supplied probe, module upgrade, or successful injection receipt yet. This is a recoverable preflight blocker, not an art/geometry defect. No live Foundry or installed module files were changed during diagnosis.
