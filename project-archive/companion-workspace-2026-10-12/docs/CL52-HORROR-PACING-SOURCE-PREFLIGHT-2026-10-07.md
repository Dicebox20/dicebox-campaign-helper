# CL-52 — Horror Pacing Source Contract & Live Preview v001
*Captured 2026-10-07 PDT — read-only/source-only, not an implemented encounter feature.*

## Scope and evidence

This is a controlled CL-52 research/design slice following the user's cancellation of Region deletion. The full 202-Region backup remains on disk, but no Regions were deleted or modified.

- Authoritative campaign source: `work/lodge-campaign/AUTOMATION-RULES.md` and PREPARE documents for E2, E3, E4, M1, M2, M3, and U1. The first source defines event-driven night, a 21-geography-Scene roster, photosensitivity safety and horror/lighting-density progression. PREPARE documents own scene-specific approved horror tone.
- Frozen structured candidate contract: `work/foundry-playwright-harness/cl52-horror-pacing-contract-v001.json` — SHA-256 `510bfdb9e19ab9db09cc3ecd9607bfbcb6430fd78b4b83f0989c346c6e7e1985`.
- Deterministic local contract harness `cl52-horror-pacing-contract-test-v001.cjs`: **PASS 101 checks**, 21 unique Scene categories, 12 candidate effects. This is an offline mock/contract test, not a Foundry runtime effect test.
- Read-only Foundry preflight `cl52-horror-live-preview-v001.page.js`: **PASS_SOURCE_PREVIEW**, 21 Scenes / 202 Regions / 115 RegionBehaviors / 33 canonical Items, ledger revision 0, no errors, **7 exact Region anchors checked**. No lights, Regions, Actors, ledger flags or behaviors changed.

## Canonical atmosphere taxonomy

| Area | Canon tone / control |
| --- | --- |
| E1–E2 | Abandoned. Subtle recent-use traces and rare implied motion; E2 forbids major ghost manifestation until an explicit later reassignment. |
| E3–E4 | Haunted. E3 transient reflection/movement; E4 childlike manifestation one-shot may occur only after the child-burial clue is actually understood. |
| M1–M2 | Haunted interior. M1 one-shot floorboard/footsteps; clock audio only if mechanism/story state allows. M2 subtle piano/portrait and object changes. |
| M3 | Haunted-to-Sacrificial approach. One-shot anomalous bell and optional metallic response after bell-line restoration. |
| U1–U2 | Haunted / victim history. Brief corridor silhouette, empty-room sound, restrained lighting; never substitute a ghost for a clue. |
| B1–B2 | Sacrificial. Utility/physical audio and practical isolated lighting rather than domesticated horror lighting. |
| C1–C2 | Active cult. Ritual-owned lights and sound, not necessarily tied to the global night event. |
| N1–N3, T1–T3 | Railway. Cult/rail infrastructure owns lighting, with intermittent passing-car or drainage effects; never domestic sunset sconces. |
| F1–F2 | Infernal encounter. Ritual/encounter state owns lights and manifestations, not ordinary night-state. |

## Candidate effects (not installed)

1. E2 recent-use implication — source allows subtle evidence/sound only; no major apparition.
2. E3 uncanny garden reflection — runtime visual only, never baked into permanent background.
3. E4 childlike apparition — **one-shot, child-burial clue understood** prerequisite, anchor `BjAgwMeaS9UUi7er`.
4. M1 distant footsteps/floorboard — one-shot, story-state-approved.
5. M1 clock chime — **blocked** while actual clock setting and authored audio stage remain unresolved; anchor `3tIrR12uv8ppFkOb`.
6. M2 brief piano sound — one-shot Haunted cue.
7. M3 phantom bell / metallic response — staged under restored bell-line and GM authority; anchor `we3V3jbMDvVDaO4U`.
8. U1 far-corridor childlike silhouette — brief visual cue, never an automatic combatant.
9. T1 optional passing-car scare — reserved anchor `DO8VWcuqRKGJGCs8`, no automatic approach escalation.
10. T1 drainage/sound ambience — reserved anchor `5mn1ZJx2DWCFTDoa`.
11. T2 optional passing-car scare — reserved anchor `dCgvAayMrKnIetOh`.
12. T3 ancient extension tension — reserved anchor `mAkGjkyDrt7ulw7K`.

The 7 exact anchors above were independently found in the correct live Scenes. The remaining five effects are source-concept candidates and have **no exact additional Region binding** yet; choose an existing suitable anchor and establish replay safety before installation. The inclusive initial inventory `cl52-horror-pacing-inventory-v001.page.js` found 20 loosely cue-related Regions, 7 empty; its name/source heuristic also matches non-horror bell pickups, so do NOT treat that count as 20 installed scares.

## Required before a guarded APPLY

- User/GM has not chosen the global one-way night trigger; do not set campaign time flags or turn on the 86 hidden lights.
- Give every one-shot cue a persistent **ledger-owned/approved** consumed state. The global ledger is currently revision 0; no new one-shot flag schema approved. Do not use per-client-only suppression as the sole state.
- Only the authoritative primary GM dispatches actual audiovisual effects; cross-client routing, consent, reentry, scene reload and actor ownership need contract testing.
- Source-verify each sound/visual asset and its license before installing; no assets were selected here.
- Safety: no strobing, rapid intensity cycling, forced movement, forced jumps, hidden puzzle answer exposure, or unapproved major E2 ghost.
- Separate READONLY PREVIEW → guarded APPLY with frozen IDs/sha/rollback → independent FINAL VERIFY → separately controlled player/GM canary. Current PASS is **source-only**.

## Next governed work

CL-50 remaining route topology and pending M1/N3 authored puzzle gates remain current critical path. CL-52 contract is prepared but parked until trigger and asset authorization. CL-51 fixture-owned night implementation also awaits the user's approved story event. Region cleanup was canceled, and its optional archive open item should be closed, not implemented. Foreman relay settings remain untouched.
