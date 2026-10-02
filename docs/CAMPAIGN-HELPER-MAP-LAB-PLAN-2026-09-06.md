# Campaign Helper Map Lab

Status: `closed-m1193-local-pass` — M1193

The Tram Rush Hour puzzle is retired from the active Campaign Helper test path.
Its source, implementation, assets, and receipts remain preserved as historical
provenance, but they are not a release gate or an active execution queue.

## Purpose

The Map Lab is a small Campaign Helper-owned test asset that exercises the map
generation path without depending on campaign art, Tram/Core topology, player
behavior, or a live Foundry write surface. It is intentionally neutral and
reproducible.

## Generated asset

- Background: `assets/testing/campaign-helper-map-lab-v1.svg`
- Canvas: 1536×1024 pixels
- Grid: 64-pixel logical cells; the SVG is gridless visual output
- Blueprint authority: four perimeter walls, one entry door, one exit gate,
  four sequence-input interaction anchors, and one gate interaction anchor
- Visual layer: a neutral control-room background only; it does not own walls,
  regions, puzzle state, or Foundry document identity
- Package manifest: `packages/dicebox-compiler/campaign-helper-map-lab-package.json`

## Test contract

The local test contract uses a fixed four-input sequence gate. It checks the
same narrow Campaign Helper concerns that the retired Tram path was meant to
exercise: stable IDs, deterministic state boundaries, preview-shaped output,
asset hashing, foreign-state preservation semantics, and fail-closed mutation
boundaries. It is not a campaign puzzle and it does not make a Foundry Scene
playable.

## External pattern provenance

Foundry's official Scene guidance supports fixing image dimensions and grid
alignment before placing walls or other placeables. The MIT-licensed Lock & Key
module is a community reference for a small lock/unlock state boundary. M1193
uses those ideas as research guidance only; it does not copy external runtime
code or introduce a module dependency.

- https://foundryvtt.com/article/scenes/
- https://foundryvtt.com/article/content-creation-guide/
- https://github.com/Saibot393/LocknKey

## Promotion boundary

Local generated-asset and contract tests may pass independently. They do not
prove upload, served bytes, loaded module identity, native Foundry creation,
persistent-world commit, active-GM execution authority, player behavior, or
Ready-to-Play. Those remain separately gated.

## Closure receipt

The generated background is 2240 bytes with SHA-256
`36112ad4894d01fbe04a1a9bfaa7ea09f69f978c6730695cec8d2637cbfd1a82`. The
package attestation gate is `ready` for the local supplied bytes and has zero
dependent native documents. Focused Map Lab coverage passed 4/4 and package
typecheck passed. This is reusable local evidence for future map-generation
adjustments, not a runtime or Ready-to-Play claim.
