# Regionwright: Studio / DiceBox Campaign Helper — Narrated Journal Interaction

**Date:** 2026-10-19  
**Class:** Accepted user-facing workflow requirement; technical architecture proposed, **not runtime certified**  
**Origin:** *Cabin in the Ashen Veil* journal-narration design session  
**Repository authority reviewed:** `Dicebox20/dicebox-campaign-helper` main `AGENTS.md`, `docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md`, `docs/ADR-0003-runtime-probe-and-diagnostics.md`.  
**Synchronization status:** Continuity/implementation handoff; repository roadmap, active card and reproducible KB reconciliation still pending. Do not treat as a promoted runtime contract.

## 1. User-approved desired experience

A player interacts with a journal page or prop depicted on a Foundry Scene. A click target over the journal triggers **both** (a) Foundry-style scrolling text displayed over/near the interacting token and (b) the GM's prerecorded narration of the same journal entry. A replay interaction should be available. In the Ashen Veil campaign, **all journals are authored from the father's perspective and voiced by the GM**. Intended use includes other short written discoveries and narrated clues.

The journal is an on-map visual prop, not a new map or independent screen by default. Keep the solution reusable for Regionwright: Studio rather than campaign-specific hardcoding.

## 2. Interaction sequence (target contract, pending capability test)

1. Player clicks an explicit interactable region/hotspot aligned with the journal depiction.
2. A verified event adapter resolves the interacting user and their valid token/scene context.
3. A single invocation starts narration and floating/scrolling text from the same accepted journal-entry asset specification.
4. Text visibility and duration are selected to make the excerpt readable; recording playback and text need only be approximately synchronized, not word-timed.
5. Players may deliberately replay; guard against inadvertent duplicate or overlapping playback.
6. Replay and completion do not change other puzzle/scene state unless separately specified and approved.

**Important technical caveat:** Native Foundry Region behaviors do not by themselves establish arbitrary mouse-click-to-Region interaction. A Tile or verified Regionwright click adapter may need to dispatch the event. Do not claim the click path works until the exact installed Foundry + modules stack has been tested.

## 3. Audio choice and factual boundaries

Foundry **Ambient Sound** is a Scene sound source with configured proximity/volume behavior; it is not necessarily a click-to-play clip. Clicking a journal and playing recorded audio may require a narrow scripted playback adapter. A Region can contain multiple behaviors, but a 'Display Scrolling Text' Region behavior is token-associated floating text, not a full journal-page scroller. Its native duration options and supported events must be checked in the target runtime; if durations are insufficient, use the supported scrolling-text API through a bounded adapter, not undocumented behavior payloads.

Do not assert that two independent Region behaviors will have exact audio/text sync, that sound is visible/audible to every connected player, or that a player click is a native Region trigger until reproducible tests prove it. Audio audience (single user vs all users), permissions, token ownership, replay handling and audio clip stop/failure policy remain explicit design choices.

## 4. Proposed reusable asset model (not adopted implementation schema)

- semantic interaction ID; scene/hotspot binding; journal/page reference
- player-visible text excerpt; audio asset location (approved, non-secret)
- duration hint or media-derived runtime duration
- audience and visibility scope; replay policy; overlapping-playback policy
- optional player-facing title and accessibility fallback transcript
- no arbitrary user supplied code or paths in Region behavior configuration

This is a requirements sketch, not an authorized new Studio data schema.

## 5. Minimal verification plan

1. Query accepted reproducible KB for RegionBehavior, Tile click and sound/audio adapters before writing code.
2. Read live Foundry fingerprint: exact world, Foundry version, system, module versions, active GM, permissions and current scene.
3. Read-only probe the native RegionBehavior event registry, scrolling-text configuration and relevant audio API.
4. Build a fixture using **one** journal prop and a short audio clip; verify player click dispatch and token association with two clients.
5. Verify narration/text start together within a documented tolerance; check readable text timing, replay, cancellation, overlap, disconnect and scene change behavior.
6. Verify that non-GM interactions have no privileged world mutations and foreign Region/Tile/Sound state is preserved.
7. Preview/review, then stage and execute only through accepted authorization and authoritative reread with receipts.

## 6. Acceptance checks

- Clickable journal interaction can be discovered and activated by an authorized player.
- One action causes audible narration and visible floating text for the correct token/user audience.
- Recorded narration remains GM-voiced, transcript is accessible, and replay operates without duplicate accidental activation.
- No unexpected loops, background sound leakage, scene writes, permissions bypasses or interference with unrelated puzzle Regions.
- Feature works as a reusable Regionwright/Studio template on one test scene before campaign-wide deployment.

## 7. Scope and authority

**Accepted:** Player-facing click-to-read-and-hear journal experience and reusable Regionwright workflow; journals from the father's point of view.  
**Proposed/not verified:** Click dispatch via Region vs Tile, whether ambient sound is appropriate, exact RegionBehavior script hooks, audio API, media-length text timing and audience defaults.  
**Blocked for implementation until:** Accepted roadmap/active-stage and reproducible-KB reconciliation, target runtime capability evidence, applicable preview/approval, and authoritative runtime receipt.  
**No live Foundry modification or implementation claimed.**
