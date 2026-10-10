# DiceBox Image Prompt Clean-Restart Rule — 2026-10-09

**Status:** USER-ACCEPTED / LOCKED PROJECT RULE.  
**Applies to:** every DiceBox Campaign Helper image-generation attempt, all project chats, Codex workstreams, the desktop app's image-generation workflow, map rendering, tokens, portraits, illustrations, UI art, scenery, background assets, and future image providers.  
**Authorization:** explicit user direction on 2026-10-09: *Never use a variation of the same image prompt twice. Abandon the original and rewrite it from scratch.*  
**Source-of-truth chain:** repo `AGENTS.md` → this normative rule → rendering/injector skills and workflow sources → chronological KB decision → generation code/tests and immutable attempt receipts. Chat history alone is not the project source of truth.

## Nonnegotiable rule

**NEVER reuse, slightly rephrase, incrementally edit, append corrections to, negate portions of, or create a variation of an earlier image-generation prompt for another attempt.**

If an image attempt fails, is rejected, produces unwanted elements, or needs a new candidate, **abandon that prompt completely**. Compose an **entirely new independent prompt from the current accepted task specification and authoritative inputs**, using a newly planned composition/description. The previous image and prompt are **not input context for generation**. A prompt of the form *“same map, but wider paths,” “keep everything except X,” “remove the object that appeared last time,”* or an edited previous prompt is forbidden. Switching a few adjectives is still a variation and is forbidden.

The accepted requirements themselves remain authoritative and may repeat: characters, anatomy, map routes, exact geometries, architectural placements, visual themes, camera standard, output format, scale, and campaign canon. **Preserve requirements, never inherit failed prompt wording, artistic composition, seed, or image as generation instructions.**

### Clean-restart protocol for every subsequent image attempt

1. **ARCHIVE** immutable prior prompt, provider/model, attempt/stage, input/output image identities, acceptance verdict, and failure reasons. Previous prompt/image are *evidence only* and cannot be sent to the provider as generation inputs for the restarted attempt.
2. **RETURN TO CANONICAL INPUTS:** current user request, accepted PREPARE / Spatial Blueprint / Feature Manifest / character or asset specifications / accepted stage reference. Build an independent new scene/asset description from those sources only. A paint-stage retry may legitimately reuse the **approved grayscale structural artifact** as canonical input, but **never** the rejected painterly result or its prompt.
3. **FRESH PLAN:** choose a new composition strategy and write a new prompt from an empty draft. Do not read/copy the previous prompt while composing. Do not use paraphrasing or an edit request to the rejected image.
4. **GATE:** record the new prompt/plan/approved-source provenance; reject exact/near-copy prompts, repeated composition IDs, references to the failed image, `variation`/`edit existing` mode, and missing clean-restart attestations. Semantic novelty of a prompt cannot be proven by lexical heuristics alone: a responsible reviewer must verify independent composition and canonical-input provenance. If uncertain, block and re-author from accepted inputs.
5. **GENERATE:** use the new prompt **as a fresh image generation**, not an edit of the rejected image. Record a new attempt ID, prompt hash, provider/model and image output ID.
6. **INSPECT:** compare the new image **to approved requirements**, not to the failed image as a composition to preserve. A REDO starts another full clean restart; no iterative correction loop.

This rule applies to **all image attempts**, not only map grayscale REDOs. Explicit **user-requested transformations of an accepted existing image** are separate authorized editing tasks; they must not be smuggled in as REDO of a failed generation prompt, and an image-generation retry still cannot reuse a variant of an unsuccessful prompt.

## Project-chat inheritance

- All Codex and ChatGPT agents working in this repository must read the root `AGENTS.md` and this rule before drafting DiceBox image prompts. Project chat handoffs must carry its link and current version.
- The rule is persisted in canonical GitHub documents and the reproducible knowledge base, **not** just one chat's memory.
- A ChatGPT Project's own instructions are a separate platform setting; GitHub changes cannot remotely alter that setting or guarantee every future chat automatically loads GitHub. A short copyable project-instruction clause is below for installation in Project settings when authorized.
- When the project-chat context does not include this rule, retrieve it before initiating image-generation work. If it cannot be retrieved, stop rather than improvise a reused prompt.

### Suggested ChatGPT Project Instructions clause

> **DiceBox image rule (permanent):** Never generate a second image from a variation, rephrasing, partial correction, or edit of an earlier failed image prompt. Archive the old attempt, abandon its prompt and image, and independently author a wholly new image prompt from the accepted DiceBox specification only. No "same but" instructions, reused seed or prior-image reference on REDO. Preserve canonical design requirements, not rejected compositions. Apply this to all DiceBox images, not just maps. Cite `docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md` as the authority.

## App/runtime enforcement and limitations

- The provider-neutral guard `packages/dicebox-compiler/src/image-prompt-clean-restart.ts` checks prompt-attempt metadata, source authorization, independent-composition identity, immutable prior-attempt history, and exact/near-duplicate similarities before an image-provider call.
- It is a **necessary preflight**, not proof of semantic novelty. A candidate passing its lexical checks may still be a conceptual rewrite of the same prompt; the workflow must require an explicit independent-authoring review.
- The desktop app must invoke this guard in every eventual image-provider adapter. Until an actual provider invocation path is connected and tested, this code and its Map Lab integration must be labeled **prototype enforcement**, not certified prevention for every future provider.
- The guard never edits or deletes historical prompts or images. It returns deterministic BLOCKED/PASS receipts and leaves archived evidence intact.
- Structural and painterly Map workflow retains its established PREPARE → structural grayscale → structural inspect → Feature Manifest/Blueprint → paint → final inspect → BUILD gates; this rule strengthens, not replaces, the stage-specific REDO contract.

## Deterministic minimum tests

- First attempt can PASS with accepted independent source.
- A retry without prior-attempt archive or canonical source identity must BLOCK.
- Same prompt after normalization must BLOCK.
- Near-copy containing appended `but ...` corrective text must BLOCK.
- Same composition/approach ID must BLOCK.
- References to rejected prompt, seed or rendered image in provider inputs must BLOCK.
- Missing independently-authored certification must BLOCK.
- A genuinely independent prompt with accepted-source lineage and fresh composition must PASS.
- Repeated attempt ID must BLOCK.
- Approved grayscale structural image may remain authoritative input to a paint-stage prompt **when it is accepted**, not when it is a rejected output.
- Immutability: the guard does not mutate request or prior attempts.
- No provider call or Foundry mutation is triggered by validation.

## M02 case study

M02 Tallcap Forest's grayscale attempts 001 and 002 were rejected for milestone obstruction and under-width corridors. The next grayscale candidate must be generated **from the authoritative M02 PREPARE alone**, never from the previous two prompts/images or a description of how to fix them. The rejected attempts remain archival evidence and are not approved palette/geometry references.

## Adoption/validation receipt

Only claim full project adoption after repository normative rules, KB SQL, app/compiler gate and automated tests pass and are merged to `main`. External ChatGPT Project Instructions cannot be modified using the current repository tools; manual Project setting synchronization remains explicitly tracked if needed.
