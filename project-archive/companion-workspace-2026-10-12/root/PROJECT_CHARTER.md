# DiceBox Campaign Helper Project Charter

## Purpose

DiceBox Campaign Helper is the central program for turning campaign intent and authored content into reliable, reviewable, playable Foundry VTT projects. It combines a semantic campaign compiler, a local knowledge/state layer, a safe runtime bridge, an asset/spatial pipeline, and an associated Foundry module.

The program is not a chat macro generator. Its job is to understand intent, choose the narrowest verified implementation, preserve human/runtime state, and provide receipts when it changes a world.

## Product surfaces

1. **DiceBox core** — semantic IDs, schemas, knowledge/state queries, compiler planning, safety kernel, evidence, transactions, and release bundles.
2. **DiceBox Foundry module** — lifecycle bootstrap, runtime capability discovery, semantic bridge API, document adapters, authority routing, and in-world UI/diagnostics.
3. **Content compiler** — Items/Activities/Effects, Actors, Scenes/Levels, Regions, links, media, and campaign packs.
4. **Certification harness** — exact-stack fixtures, GM/player tests, failure injection, recovery, and Ready-to-Play certificates.

## First supported scenario

The first vertical slice should be intentionally small:

`read semantic plan → inspect exact runtime → preview one native operation → GM approval → create/read-back one managed document → query it → reset/repair it → record receipt`.

The preferred first mechanic is a native, no-code Region or D&D5e Activity path, followed by one player-triggered action that routes through the active GM. Broad campaign generation, AI image generation, arbitrary automation, and full live sync wait for the spine.

## Out of scope for the first slice

- Arbitrary JavaScript or macro generation.
- Raw database or LevelDB editing.
- Automatic cleanup of omitted or foreign content.
- Unverified teleport, cross-scene mutation, or optional-module behavior.
- Campaign-specific Iggwilv Tower or Prime Arachnid logic as global product rules.
- Treating static tests or successful imports as live certification.

## Success definition

DiceBox is ready to expand beyond the first slice when it can load in a clean Foundry 14.367 / D&D5e 5.3.3 world, expose only the semantic API, discover capabilities, preview without writes, execute one authorized operation idempotently, preserve unrelated state, read back the result, reset/repair owned state, and produce an evidence receipt in both GM and player-role tests.
