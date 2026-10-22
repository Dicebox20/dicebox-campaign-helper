# Cabin in the Ashen Veil — Clean-room Battlemap Rendering Handoff

**Date:** 2026-10-22. **Result:** Previous image generation thread RETIRED FROM ACTIVE MAP ART, not retired from continuity/planning. The owner identified repeated Foyer/Studio full-house and dollhouse/cutaway art after many attempts. Rejected samples are **not** approved scene images and must never be used as input/references in another render. No scene was installed, no Foundry live verification, no image generation cache clear/reset occurred.

## Authoritative positive inputs for a fresh chat

- [Globally required representative-wall painterly style and neutral lighting](../../docs/DICEBOX-UNIVERSAL-REPRESENTATIVE-WALL-BATTLEMAP-STANDARD-2026-10-22.md) (in canonical repo at `docs/DICEBOX-UNIVERSAL-REPRESENTATIVE-WALL-BATTLEMAP-STANDARD-2026-10-22.md`). **Only mention intended visible items in image-provider prompts. Every consecutive prompt must use materially distinct original phrasing.**
- [Approved House Master v1 — room plan](./blueprints/house-master-v1-2026-10-22.md) and [coordinate geometry](./blueprints/house-master-v1-2026-10-22.json). BP-1, not rendered model output, is source of doors and real room footprint.
- [Fast map creative workflow](./ashen-veil-fast-map-creation-profile-v1-2026-10-22.md) and [Batch 1 Foyer/Great/Studio/Study cards](./ashen-veil-fast-batch-01-prepare-cards-2026-10-22.md).
- **Owner-provided positive image ONLY:** original *Overgrown Forest Shrine Clearing.png* supplied in project chat; obtain that original from owner/available project assets if accessible. If absent, avoid pretending a failed image is an adequate positive style reference. This reference guides painterly material/legibility only, not scene architecture.
- [Original prompt clean restart global rule](../../docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md) (repository path `docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md`).

## First constrained recovery test

**Foyer only**: `H-G02` ground level, BP-1 physical rectangle **x24..52 ft, y0..16 ft** = **28×16 ft**, north up. Distinct centered South/Yard entrance `(38,0)`, North/Great Room entrance `(38,16)`, West/Dining entrance `(24,8)`, East/Kitchen entrance `(52,8)`. Upstairs transition at `(43,8)`; separate locked basement transition `(31,8)`. Visible fixture is **Grandfather Clock**, reserved removal/activation of Hour Hand stays **separate stateful gameplay art**. Include household entry details only from accepted PREPARE card. **Single-room** painterly, true 90° overhead and narrow top-facing representative wall caps, neutral diffuse light. Rendered camera/portal/state evidence must preserve the exact relative positions; decorative deviation may pass, structural mismatch does not.

**Test order:** use original BP-1 coordinates to construct deterministic structural map/control image first; inspect four entrances, both stair paths and clock. Create wholly fresh positive-only paint description; apply original positive shrine aesthetic and no rejected image or prompt. Produce **one Foyer candidate**, inspect against geometry/style checklist before rendering another room. Refuse to auto-approve a pretty picture with missing door anchor, theatrical lighting, dollhouse cutaway or multiple combined rooms. The next Studio and Great Room render follow only after successful style canary.

**If still failing:** Stop repeating raw image prompts. Use a constraint-preserving rendering workflow (e.g. a controllable map editor, control-image/reference-based painting, or a dedicated artist/model provider) to retain approved walls and fixtures; assess evidence before scaling to 36 locations. The problem is a **generation reliability issue**, not a reason to rewrite the campaign blueprint. 

**Model-cache statement:** OpenAI documentation describes multi-turn image context but does not provide a user-facing internal image cache purge tool. Prompt caching is not evidence that identical wording causes image-memory contamination. Starting a new chat reduces exposure to local prior images/text; it cannot guarantee a particular render. Do not claim a cache was cleared.

## Later work status

- No approved usable re-render produced in this chat after user rejection.
- All image attempts from the problematic conversation remain **REJECTED / historically archived**, including multi-panel full-house outputs misdirected from one-room brief.
- The owner-approved real house architecture and central Great Room player blueprint remain intact.
- New chat should report `art candidate/inspection state` separately from `Foundry-ready/verified`.
