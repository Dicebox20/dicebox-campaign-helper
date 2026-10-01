# Stage 8 next-bundle candidate — integrated real-project workspace acceptance

Status: read-only preparation only; not accepted and not authorized for implementation.

## Current evidence

The active Stage 8 acceptance observation requires a user to create, rename, save, close, and reopen a real multi-Scene project with registered assets and identical hashes/state. Its live check requires a project with two Scenes and one asset to survive desktop restart and reopen.

Existing packaged self-test modes prove parts of that path independently:

- `multiscene` / `multiscene-reread`: two ordered Scenes, active navigation, save and restart reread;
- `asset` / `asset-reread`: one registered PNG background bound only to Scene 2, save and restart reread;
- `workspace` / `workspace-reread`: display-name changes, deterministic recent ordering, save-as, and restart reread;
- `detach-setup`: a two-Scene project plus one exact registered background binding, but it prepares recovery evidence rather than the complete ordinary-user acceptance sequence.

No single packaged scenario currently creates one test-owned project, renames that same project, adds or retains two Scenes, binds one registered asset, restarts, reopens, and proves all of its project content, workspace metadata, asset binding, and no-Foundry-write invariants together.

## Candidate bundle boundary

Add one test-owned, fixed-root packaged self-test flow and deterministic coverage for this exact ordinary workspace acceptance path:

1. Start from an absent test-owned project ID.
2. Create it, retain two ordered Scenes, and select Scene 2.
3. Bind one explicit PNG background only to Scene 2 through the existing stable asset registration path.
4. Rename the same project through the existing workspace-index path.
5. Reread before restart, then start a fresh package process and reopen the same project.
6. Assert the same project ID, project generation/content hash, two Scene IDs/order/hashes, active Scene, one stable registered asset and binding, display name/recent metadata, backup disposition, and no Foundry write.
7. Run an ordinary non-self-test startup check that makes no project/workspace write.

## Excluded scope

No new project schema, asset roles, directory-entry durability, recovery behavior, deletion/garbage collection, migration execution, live Foundry mutation, Stage 8 completion, alpha claim, or vision-assisted Spatial Blueprint implementation.

## Governing evidence

- Active card: `docs/ACTIVE-PROGRAM-SLICE.json`, `real-project-workspaces` acceptance observation and live check.
- Existing component evidence: `outputs/m211-background-asset-scene-binding-receipt.json`, `outputs/m207-workspace-metadata-receipt.json`, M226/M228 KB closure records.
- Current reusable implementation surfaces: `apps/campaign-helper-desktop/src/App.tsx` project self-test modes and `apps/campaign-helper-desktop/src-tauri/crates/dicebox-project-store/src/lib.rs` validated fixed-root store APIs.

## Required next gate

At the next eligible shared-document batch boundary, combine the M229 governance closure with acceptance of this exact candidate only if the current card, contracts, and KB still agree. Then record a new KB authorization packet and rebuild/verify before implementation.
