# DiceBox Injector Workflow Hardening — 2026-10-05

**Status:** user-accepted additive workflow hardening  
**Scope:** Foundry Scene Injector workflow transport and packaging  
**Regression trigger:** an approved scene BUILD was incorrectly packaged as a ZIP rather than the established Markdown single-injection-macro artifact.

## Acceptance observation

A DiceBox Scene Injector BUILD cannot be considered successful unless it produces exactly one Markdown file containing exactly one self-contained executable JavaScript injection macro and passes the deterministic BUILD contract validator.

## Locked named-operation contract

`PREPARE -> RENDER -> INSPECT(PASS = APPROVED | REDO) -> BUILD`

`APPROVE` remains an optional redundant acknowledgment after a final INSPECT PASS; it is not a required gate. These words are workflow API operations. Agents must load the canonical workflow instead of interpreting BUILD as generic packaging.

The current RENDER/INSPECT rendition is defined in `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`: grayscale structural render → structural inspection/Feature Manifest → painterly render → final inspection. Only the final INSPECT PASS approves art.

## Fail-closed rule

If the workflow, approved scene inputs, or validator cannot be loaded/reconciled, stop as BLOCKED. Never substitute ZIPs, loose folders, multiple macros, manual image-part macros, or another ad-hoc artifact.

## Enforcement layers

1. Root `AGENTS.md` carries the short invariant and routes to the workflow skill.
2. `.codex/skills/dicebox-injector-workflow/SKILL.md` contains the task-specific procedure.
3. `tools/validate-dicebox-build.mjs` deterministically validates the artifact contract.
4. `tools/validate-dicebox-build-self-test.mjs` preserves regression cases.
5. `package.json` wires the regression suite into workflow and full repository checks.
6. `docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md` records the additive hardening without changing the existing 16-stage product order.

## Validator contract

Required:

- `.md` extension;
- exactly one fenced JavaScript block;
- required DiceBox contract markers, including v2 scale/token policy markers;
- one single macro;
- embedded art decodes/reassembles inside the macro when used.

Rejected:

- ZIP/wrong primary extension;
- multiple code blocks/macros;
- missing contract markers;
- instructions to execute a second macro/part;
- `eval`, `new Function`, or raw WebSocket execution primitives.

## Evidence boundary

Passing packaging validation proves only that the handoff follows the canonical single-MD/single-macro transport. It does not prove installation, exact-stack compatibility, successful runtime mutation, or gameplay. Those remain governed by the existing DiceBox preview/execute/reread/receipt rules.


## Scale-hardening extension

A second workflow failure class was identified during the forest-maze build sequence: a Scene can be technically valid yet use an undersized 50px logical grid / low-density Scene canvas, causing inconsistent map/token scale and less useful player pan/zoom space.

The accepted correction is documented in `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`.

All new generated battle-map BUILDs use `dicebox-scene-injector-build/v2` and default to the `battlemap-120` scale profile:

- Gridless;
- 120px logical grid size;
- 5 ft per logical space;
- PREPARE-owned logical columns/rows;
- Scene pixels derived as columns/rows × 120;
- token footprint remains Actor/system-size-owned;
- Token Scale Ratio is visual-only.

The validator now requires the scale markers, one `DICEBOX_SCENE_SCALE` source-of-truth constant, consistent scale arithmetic, and direct use of that constant for Scene width/height/grid fields. Explicit nonstandard scales fail closed unless PREPARE records user approval and BUILD includes both the exception approval marker and a reason.

L1-01 through L1-03 remain legacy v1 BUILDs. Their runtime success is retained as evidence, but their old scale is not a template for new scenes.
