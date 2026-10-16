# DiceBox Scene Injector V2.1 Beta — Post-BUILD Paint and Install Order

**Status:** USER-ACCEPTED WORKFLOW OVERRIDE — 2026-10-16.
**Scope:** Scene Injector creative assembly and injection order; does not modify the established `dicebox-scene-injector-build/v2` single-Markdown/single-macro transport or any exact-GM/runtime safety gate.
**Evidence:** User correction: "After Build should come the painterly render, then we install." Follow-up user accepted the painterly Dark Arch image and directed use of that image for injection instead of the grayscale.

## Current order

```
PREPARE -> GEOMETRY AUTHOR -> GEOMETRY INSPECT -> EMBOSSED GRAYSCALE RENDER
-> STRUCTURAL INSPECT -> FEATURE MANIFEST / SPATIAL BLUEPRINT RECONCILIATION
-> STRUCTURAL BUILD (Walls/Doors/Regions using grayscale structure)
-> PAINTERLY RENDER -> FINAL INSPECT (PASS automatically approves final art)
-> FINAL INJECTION ASSEMBLY (bind final painterly art to structural geometry)
-> STAGE -> INJECT -> VERIFY -> RECEIPT
```

This explicitly **supersedes** the earlier V2.1 Beta ordering, which incorrectly placed final painterly rendering before all BUILD work. The structural BUILD is an *intermediate, offline geometry draft*, not a ready/staged installer. Installation must bind the exact final-inspected colored image; never inject the grayscale as final art unless separately user-authorized.

**Dark Arch M01 observed current state:**
- Final painted image from 2026-10-16, native 1619x971, SHA256 `02cdd354371721961ce277f00b8bfe2a322d2678000f7c44d8596800194cab61`.
- Explicit user visual approval and matched feature alignment against the accepted grayscale; 191 RANSAC inlier features, ~0.95px median position drift in native raster. This is local art/geometry QA, **not** Foundry runtime movement certification.
- Original structural source SHA256 `036823143bce9d2c92a818ccc9e7cc9496a08a0f99608a3cc3564115b06880f8`.
- Local final single-Markdown/single-JavaScript injection candidate artifact SHA256 `efdad8978ee82ad6a9720282a1cb3f7bd81da2aa3db5d78b1e5386cb4985b35a`. Embedded WebP source SHA256 `f31d9bf2850ed853ac9af35d672a44cb2ed18a1fa1dadde8735e16d6fbfee2b2` (156,770 bytes). The full artifact lives in the current conversation container; its bytes are **not** silently claimed checked in or synced to the Windows repository.
- The earlier 13-wall placeholder-background macro is historical/rejected as final injection: it used superseded gate geometry, placeholder background path, and unsafe overwrite semantics.
- New offline candidate builds on manually reviewed gate/bridge/dock alignment, 14 initial Wall segments, one operable gate, two hidden GM-only intent Regions, no NPC/boat Tile/teleport behavior. Off-map Foundry exact-stack verification, installer asset upload and authoritative reread remain pending.
- Local static contract parity / Node syntax and 3 fail-closed tests passed. **Canonical repo validator has not been run against the exact artifact bytes**, and no live Foundry installation is claimed.

## Exact-world identification usability revision (accepted 2026-10-16)

New Injector macros read the currently loaded game.world.id automatically and compare it to the explicitly authorized scene target. Do not require a GM to type the loaded world ID into a second modal. The reviewed changes and automatically detected world are shown in a single DialogV2.confirm preview; cancellation/close means no upload/writes, and active-GM/target checks are revalidated after confirmation. Detailed evidence: handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/AUTO-WORLD-DETECTION-2026-10-16.md.

## Next gate / recovery

Before using the macro on an actual world: (1) reconcile the exact artifact using the repository's `tools/validate-dicebox-build.mjs` (artifact bytes must be available in runtime), (2) verify exact world, core, DND5e and module version, and active-GM authority, (3) preview and approve the exact document diff and asset upload, (4) install once, reread Scene/Level/background/Walls/Regions, then test 5/10-ft token movement, open/closed gate, boat/swing bypass, and player Region ownership. Remain `NOT_READY_TO_PLAY` until verified.

The project active-stage checker has pre-existing violations. No product stage was promoted and main was not merged by this note.
