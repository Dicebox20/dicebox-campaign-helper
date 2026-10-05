# DiceBox Injector Workflow Hardening — 2026-10-05

**Status:** user-accepted additive workflow hardening  
**Scope:** Foundry Scene Injector workflow transport and packaging  
**Regression trigger:** an approved scene BUILD was incorrectly packaged as a ZIP rather than the established Markdown single-injection-macro artifact.

## Acceptance observation

A DiceBox Scene Injector BUILD cannot be considered successful unless it produces exactly one Markdown file containing exactly one self-contained executable JavaScript injection macro and passes the deterministic BUILD contract validator.

## Locked named-operation contract

`PREPARE -> RENDER -> INSPECT -> APPROVE -> BUILD`

These words are workflow API operations. Agents must load the canonical workflow instead of interpreting BUILD as generic packaging.

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
- required DiceBox contract markers;
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
