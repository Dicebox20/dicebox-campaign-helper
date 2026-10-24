# H-U07 V017 approved asset — native Foundry STAGE/BUILD preflight and exact blocker

**Date:** 2026-10-24, America/Los_Angeles.  
**Project:** Cabin in the Ashen Veil only, `codex/cabin-ashen-veil-recovery`.  
**Work unit:** bounded next-step after H-U07 V017 owner-delegated art PASS, no new image generation.  
**Current status:** **APPROVED_ART_STAGED_VERIFIED / GM_BUILD_SOURCE_READY / SCENE_NOT_INSTALLED / GM_LOGIN_REQUIRED**. No Foundry world document write happened in this work unit.

## Approved exact source and Foundry Data STAGE

- Source: the previously final-INSPECT-PASSED H-U07 V017 original PNG, [authoritative art receipt](../render-attempts/h-u07-single-render-v017-final-art-pass-2026-10-24.md). Original [private Drive file](https://drive.google.com/file/d/1fk1B0uLessRYczAj9XV7y9v7z77HpksY/view?usp=drivesdk), sha256 `67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704`, 2,888,738 bytes, 1536×1024 RGB PNG.
- Exact owner-authorized Foundry Data host: `%LOCALAPPDATA%\FoundryVTT\Data\Maps\cabin-in-the-ashen-veil\`.
- Staged immutable new asset: `Maps/cabin-in-the-ashen-veil/h-u07-dahlia-art-studio-approved-v017-2026-10-24.png`.
- Private Drive bytes were streamed to the established native Dicebox Bridge PowerShell host in verified 60,000-byte base64 text chunks with monotonic stage-file offsets. The 3,851,652-character encoded source transferred exactly, in a non-image temp file, never directly into a live Scene.
- Initial decode operation `cav-hu07-v017-decode-verify-atomically-stage-approved-art-20261024-v1` halted after creating a private `.transfer-partial` file because the constrained PowerShell runspace does not implement `Get-FileHash`. No Scene assets were replaced. Independent .NET SHA256 readback of the temporary file `cav-hu07-v017-partial-asset-reconcile-readonly-20261024-v1` gave **2,888,738 bytes and exact approved source SHA**. The subsequent reconciled operation `cav-hu07-v017-promote-verified-partial-asset-dotnet-hash-20261024-v2` promoted the verified partial to the previously absent versioned target with `[IO.File]::Move`, re-read the final file and returned **PROMOTED_AFTER_HASH_RECONCILIATION**.
- Host staged-file verification: `2888738` bytes, SHA256 `67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704`; PNG header dimensions 1536×1024; no existing wrong art was overwritten.
- Served HTTP **HEAD 200 image/png** and subsequent exact authenticated-local-host **GET 200**, received **2,888,738 bytes**, independently hashed to the exact expected SHA256. GET temp file was deleted after check. Evidence request `cav-hu07-v017-native-served-get-byte-hash-cert-20261024-v1` returned `servedCorrect:true`.

**Conclusion: the art source is fully transferred, hash-verified on Windows and served by the current Foundry host.** Future GM native installer may use this path unchanged. Original and previous unapproved images preserved.

## GM-only native Scene BUILD — compiled as source, not executed

- [Versioned GM-only image-only Scene injector source](./H-U07-dahlia-art-studio-v017-background-only-build-v001.md), commit `daf39756dd6bbedceeceb15eacafa2f9c12e294d`.
- Exactly one intended Scene: `CAVHU07ArtStudio`, one Upper Floor Level `defaultLevel0000`, gridless profile with *provisional* 120px/5ft tactical scale, artwork at its intrinsic 1536×1024 without aspect distortion.
- Creation explicitly guarded by exact local origin `http://127.0.0.1:30000/game`, world `cabin-in-the-ashen-veil`, runtime Foundry 14.367/dnd5e 5.3.3, **active elected GM**, duplicate Scene name/id/owner-key precheck, served PNG byte count, dimension and **WebCrypto SHA256**, unsaved native Scene schema validation. Rereads all created properties before marking verified, blocks unknown write outcome from blind retry.
- Creates **zero** Walls, Regions, RegionBehaviors, Items, Actors, Journal documents, Lights, macros, puzzles, teleports or rewards. Owner manual Wall/door pass and puzzle continuity compilation are deliberately later gates. Uses a GM installer script; player-facing interactions later use RegionBehavior scripts rather than player Macro permission.
- Static Node.js `--check` through established utility harness returned **syntaxPass:true, nodeExit:0, scriptChars:7853, sceneCreateCalls:1, actorMutations:0, regionsCreation:0**. Static syntax proof is **not** native Foundry `CONFIG.Scene` schema acceptance or world gameplay proof.

## Exact runtime blocker and read-only evidence

- Host Windows native port 30000 was actively listening and serving the approved asset. Initial `127.0.0.1:9224` Chrome for Testing Dev debug endpoint was closed.
- Reviewed established harness README and existing `Start-Harness.cmd`. No Chrome for Testing Dev process was using debug port. Launched the owner-installed Chrome for Testing Dev utility harness through its standard launcher once; startup returned a live listener at `127.0.0.1:9224` (launcher process confirmed alive). This is the existing isolated Dev browser, not a new Foundry module or alternate UI framework.
- Read-only Playwright/CDP readback now sees the local Foundry `/join` page in the restored Dev browser, **not `/game`**. Document title `Cabin in the Ashen Veil`. Username/password/adminPassword input elements were **empty**; no active authenticated GM session existed in that browser. No credentials were obtained, inferred, typed, or bypassed.
- **The precise world and active elected GM cannot be verified from the Join screen**, and `game.scenes` is unavailable. Therefore the installer was **not executed** and there was **no native H-U07 Scene creation**. Current live Scene count, any owner-created same-named Scene and any GM permissions remain **unverified** for this work unit; do not trust historical counts as a current native snapshot.
- Recovery is owner GM authentication in this isolated browser (or a verified preexisting authenticated GM `/game` page). The exact target must be reread after that; never automatically join an unverified user or guess a password.

## Smallest safe next roadmap unit

1. Once the owner is authenticated in Foundry's Dev browser, verify exact `http://127.0.0.1:30000/game`, world, system, Foundry version, elected GM, scene uniqueness, served art hash and allowed scene dimensions. If any mismatch or duplicate exists, stop before writing.
2. Run [H-U07 image-only native installer](./H-U07-dahlia-art-studio-v017-background-only-build-v001.md) **once** in authorized GM environment, read back one Scene/Level with approved image and empty Walls/Regions, and save full native receipt. If uncertain outcome, re-read first, never replay.
3. The owner draws Walls/doors and reviews scene scale. Then add verified Region/Item/Journal interactions only through established Dicebox workflows and accurate LOCK-03, LOCK-10 and LOCK-12 dependencies. Preserve two independent prayers, hidden separate H-U08 Candle Workshop, `027` clue, Ornate Mirror and independent Carriage Key/Brass Tiny Key #1 claims. Verify from a non-GM canary when available.
4. Continue with next art PREPARE (H-G05 Allen Study) as an alternative while the GM login prerequisite is unresolved. Every above-ground lodge render uses owner-approved aged H-G06 as example and adheres to one new image per turn and immediate final PASS/FAIL.

## Evidence classes

`OWNER_DELEGATED_ART_APPROVED` — V017 only.  
`VERIFIED_NATIVE_ASSET_STAGED` — exact original PNG served on Foundry host.  
`BUILD_SOURCE_STAGED_STATIC_SYNTAX_PASS` — native install command versioned, **not executed**.  
`NATIVE_SCENE_CREATE_BLOCKED` — login screen, no elected GM evidence.  
`FOUNDRY_WORLD_UNCHANGED_BY_THIS_TURN` — no Scene writes, no puzzle scripts or player state modifications.  
