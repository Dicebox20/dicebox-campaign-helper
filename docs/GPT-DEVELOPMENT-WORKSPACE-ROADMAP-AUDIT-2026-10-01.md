<!-- DCH_OWNER_ROADMAP_V2_20261112 -->
> **Roadmap precedence (owner decision 2026-11-12):** This is a specialist or historical DCH workstream, subordinate to the ChatGPT Library **DiceBox Campaign Helper Roadmap v2** (canonical local mirror docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md). The controlling program priority is M0 ChatGPT Bootstrap, then M1 UI, M2 diagnostics, M3 templates, M4 campaign compiler, M5 knowledge. Preserve this document's original scoped goals, receipts and evidence without promoting them over v2. DCH Foreman turns are 20 minutes; workers use live-only Switchboard messages.
<!-- /DCH_OWNER_ROADMAP_V2_20261112 -->

# ChatGPT Development Workspace and Roadmap Audit

Date: 2026-10-01  
Scope: prioritize an in-app ChatGPT development workspace, then compare the Campaign Helper roadmap with successful local Codex project roadmaps before revision.  
Status: research and reconciliation only; no runtime, provider, package, Foundry, campaign, or external-document mutation was performed.

## Decision-changing conclusion

The next product priority should be a persistent, app-owned ChatGPT development workspace. It should give ChatGPT first-hand, typed diagnostic access to the Campaign Helper while keeping execution, target validation, approvals, authoritative rereads, receipts, recovery, and state ownership inside the app. Codex should be exposed as an explicit escalation capability for work the integrated ChatGPT workspace cannot complete.

This is a change in direction from the older split in which Campaign Director was the primary managed route and Codex Technical Builder was a separate planned lane. That older decision remains historical provenance until a revised change card is accepted; it must not be silently overwritten.

## Workspace shape to benchmark

The first workspace slice should contain:

1. A stable `workspaceId` and `sessionId` bound to the exact Campaign Helper project root, tool-manifest version, and environment fingerprint.
2. A read-only diagnostic mode with typed tools such as `kb.query`, `project.inspect`, `runtime.status`, `calibration.observe`, and `receipt.read`.
3. A plan/preview mode that can assemble a proposed change without writing files or invoking a runtime.
4. An execute/recover mode in which every side effect is an individually named, approval-gated capability with a post-action reread and blocker-based receipt.
5. A narrow `escalate_to_codex` tool that accepts a bounded objective and returns a reviewable receipt; it does not transfer authority or auto-promote worker output.

The first vertical slice should be `calibration.observe`: ChatGPT requests a numeric transform and environment inventory, the app executes a deterministic read-only routine, and ChatGPT explains the result and next safe action. This directly addresses the current bottleneck while proving the whole workspace loop.

## Official architecture findings

OpenAI's Agents architecture distinguishes the model harness, an environment, and the application server. Function tools can be used even without a built-in shell environment: the application receives the call, runs the function, and returns the result. This supports keeping Campaign Helper authority in an app-owned typed registry rather than exposing a generic shell first.

Self-hosted environments can run a Codex execution server with local shell, files, and MCP access, but the application still owns session/environment association, keys, isolation, and lifecycle. The environment is therefore a later implementation option for bounded escalation, not the definition of the product workspace.

The lifecycle guidance is especially relevant: a session may outlive an environment, the application should persist the association, and outcome-unknown connection or shutdown results require inspection before retry. Those rules match the Star*Tup relay's durable task and recovery patterns.

Agent-evals guidance also gives the correct development order: capture traces of model/tool/guardrail behavior first, then move representative cases into repeatable datasets and graders. The workspace should therefore ship with a trace/receipt surface before broad capability expansion.

## Community roadmap benchmark

I used “proven” narrowly: a community project needed public implementation history plus a release, completed milestone, reproducible checks, or an explicit evidence boundary. A roadmap by itself is not proof of success.

### Evidence-backed community patterns

**Codex How To — Phelan164.** This is the strongest direct match. The project publishes an engineering loop of `scope → reproduce → implement → test → review → evidence`, a dependency-free playground, a review-first knowledge wiki, controlled no-skill/full-skill/lean-skill comparisons, and a bounded orchestration benchmark. Its v0.6.0 release came from a merged fully green benchmark commit; both single-agent and bounded-orchestration candidates passed 6/6 evaluator groups. Crucially, it does not claim a speed or token advantage because the runs were not timing-comparable and aggregate token totals were unavailable. The reusable lesson is evidence discipline and a narrow delegation rule, not “use more agents.”

**Obsidian LLM Wiki CLI — green-dalii.** Its public roadmap records completed phases with exact goals, explicit out-of-scope items, commit lists, test-count changes, and read-only review-agent confirmation. Phase 1.8 documents eight independent commits, a green gate, and growth from 108 to 127 tests while keeping illegal inputs fail-closed before any LLM traffic. The reusable lesson is to make each phase a small contract with a concrete exit record and a preserved deferred list.

**CodexLooper — DatenpflegeNordHL.** Its completed offline benchmark phase adds 25 focused tests to a 212-test main suite, while the project explicitly separates implementation authority from Git/release authority and keeps implemented behavior, verified evidence, and planned work in separate status/roadmap documents. The reusable lesson is to keep the agent able to propose or implement without allowing it to become the release authority.

**GSD-Codex — undeemed.** Its release history shows why roadmap state must be machine-checkable: later releases fixed stale roadmap/requirements updates, added cross-source milestone audits, made progress counts deterministic from disk, and required human verification for debugging resolution. The reusable lesson is to make “done” a cross-checked state, not a model-edited checkbox.

### Useful but not yet success-proof benchmarks

**skill-codex — Arystos** has a good stability shape: ship the user-facing commands first, then freeze the tool API, add a real-Codex smoke test, add a CLI-drift guard, and complete the documentation. Its roadmap itself says priorities can change, so it is a planning pattern rather than proof that the later stability milestone is complete.

**xCodex — danhively** uses versioned release milestones with shipped items marked separately from future observer-agent, infinite-mode, workflow, and stability work. Its repository explicitly warns that it is fast-moving and experimental. It is useful for separating shipped scope from ambition, but it should not be treated as a quality certification.

**Codex SDLC Wizard — BaseInfinity** makes the release boundary explicit: packaging, npm, release, roadmap, benchmark, setup/update, and opt-in E2E tests are separate validation surfaces. That is a valuable release-gate pattern; the public page describes it as a plan/certified adapter, so I am not counting it as a completed success case.

Across these community examples, the consistent roadmap pattern is:

- start with one small, reproducible vertical slice;
- define the acceptance check before implementation;
- keep shipped, in-progress, deferred, and experimental work visibly separate;
- preserve an evidence record for every completed phase;
- make failure, missing telemetry, and unverified claims explicit;
- delegate only across independent write surfaces with a controller-owned integration bar;
- treat durable project memory, tests, review, and release proof as part of the product, not optional documentation.

The Campaign Helper already has several of these strengths: typed commands, proposal/approval states, receipts, exact-target gates, evidence labels, stop conditions, and a database-first control plane. Its main roadmap weakness is sequencing and reconciliation, not lack of safeguards. The current records contain competing stage views and workflow versions: the active program card has later M1284/Stage 12 activity while the roadmap and older workflow documents still describe Stage 11 as the current gate; the accepted workflow is `.3` in the project contract while an older consolidated document still names `.2`. This must be resolved before a new workspace phase is promoted.

## Proposed revised order, pending acceptance

1. **Control-plane reconciliation.** Establish one current stage, one workflow version, one active change card, and one authoritative next action. Preserve older entries as historical evidence.
2. **ChatGPT development workspace foundation.** Add workspace/session identity, app-owned tool registry, read-only diagnostics, trace/receipt storage, and lifecycle/recovery state. Do not add broad shell authority.
3. **Calibration vertical slice.** Implement only the read-only transform inventory and `calibration.observe` receipt path, with deterministic transform expectations and explicit coordinate-frame labels.
4. **Guarded project tools.** Add preview/approval-gated KB, build, test, Node, and fixed PowerShell routines behind named capabilities. Each mutation gets a reread and recovery branch.
5. **Codex escalation.** Bind a bounded isolated worker route only after the integrated workspace can describe the missing capability, preserve the request, and review the returned receipt.
6. **Campaign-authoring and runtime breadth.** Resume Scene/Foundry and broader authoring lanes only after the workspace foundation and calibration slice have direct evidence.

This order deliberately puts the user's desired ChatGPT integration and the calibration bottleneck ahead of additional Foundry-module breadth.

## Evidence limits

The official findings are documentation-based. The community benchmark is based on public roadmap pages, release notes, commit/test evidence, and explicit claims/limits from maintainers. No provider call, local relay command, runtime session, browser action, package installation, or live ChatGPT workspace was exercised in this pass. The proposed order is therefore a design recommendation, not an implementation acceptance or readiness claim.

## Sources

- [OpenAI Agents architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture)
- [OpenAI self-hosted environments](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
- [OpenAI environment lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle)
- [OpenAI agent evals](https://developers.openai.com/api/docs/guides/agent-evals)
- [OpenAI Agents overview](https://developers.openai.com/api/docs/guides/agents)
- [Community Codex How To repository](https://github.com/Phelan164/codex-howto)
- [Codex How To community benchmark and v0.6.0 evidence](https://github.com/openai/codex/discussions/36262)
- [Community Codex How To measurement protocol](https://github.com/Phelan164/codex-howto/blob/main/resources/engineering-loop-measurement.md)
- [Obsidian LLM Wiki CLI completed roadmap phases](https://github.com/green-dalii/obsidian-llm-wiki-cli/blob/main/ROADMAP.md)
- [CodexLooper benchmark, authority boundary, and roadmap status](https://github.com/DatenpflegeNordHL/Codex-Looper)
- [GSD-Codex roadmap/verification changelog](https://github.com/undeemed/get-shit-done-codex/blob/main/CHANGELOG.md)
- [skill-codex stability roadmap](https://github.com/Arystos/skill-codex/blob/master/ROADMAP.md)
- [xCodex shipped and planned milestones](https://github.com/danhively/xcodex)
- [Codex SDLC Wizard release-validation surfaces](https://github.com/BaseInfinity/codex-sdlc-wizard)
- Current control plane: `docs/ACTIVE-PROGRAM-SLICE.json`, `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md`, and `docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md`

## Speed-optimization pass

The shortest credible implementation is smaller than a general-purpose agent workspace:

1. Reuse the existing React/Tauri chat surface and current `packages/dicebox-director` Responses route.
2. Reuse the existing Zod dependency to define one `WorkspaceRequest`, `ToolCall`, `ToolResult`, and `Receipt` contract.
3. Extend the existing forced `propose_scene_command` path into one continuation loop with three read-only tools: `project.inspect`, `runtime.status`, and `calibration.observe`.
4. Keep execution in the existing Node/Rust boundary; do not add MCP, a general shell, an Agents API environment, or ChatKit to the first slice.
5. Add a local JSONL record/replay harness for tool calls so UI, approval, and calibration work can run without repeated model calls or network access.
6. Make `calibration.observe` a passive numeric inventory: scene size, canvas CSS/backing size, device pixel ratio, viewport, camera/zoom/pan, local/global bounds, pointer coordinates, and the named transform between each coordinate space.

OpenAI's Agents SDK is a good fit when the application owns tools, state, and approvals, but adding the SDK is not required for the first slice because the repository already has a typed Responses integration. ChatKit can shortcut chat UI, but the app already has a React chat surface and ChatKit would still require a custom server and authority integration. The Agents API's `environment: none` plus application function tools is the right conceptual model for the first diagnostic loop; a self-hosted environment is unnecessary until ChatGPT must run arbitrary project commands.

Tauri's official sidecar support can later package the Node worker and communicate over stdin/stdout or a local socket. During development, the existing Node launch path is faster and avoids packaging work. The sidecar boundary should remain allowlisted and named rather than becoming a raw command surface.

For calibration, PixiJS already exposes scene-graph transforms, local bounds, and global bounds. Three.js TransformControls provides a useful design reference for explicit local/world spaces, viewport mapping, and snapping, but neither library needs to become a Campaign Helper dependency. The first diagnostic overlay should label coordinate frames and show numbers, not become a full editor.

## Revised time estimate with the safe shortcuts

- **First demonstrable workspace:** 2–3 focused development days. This includes the existing chat panel, one persistent workspace/session record, three read-only tools, streamed tool status, and a replayable calibration receipt.
- **Reliable read-only v0.1:** 5–8 focused development days. This adds interruption/outcome-unknown handling, receipt persistence, deterministic contract tests, calibration overlay review, and failure recovery.
- **Guarded development workspace:** approximately 2–3 weeks. This adds preview/approval-gated writes, fixed Node/PowerShell routines, authoritative rereads, and the bounded Codex escalation tool.

Slow hardware and internet mainly affect dependency installation, provider calls, and packaging. The first two milestones can be developed mostly offline with recorded tool responses. The estimate does not include broad campaign authoring, Foundry control, or unrestricted project execution.

## Sources added by the optimization pass

- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents/sdk)
- [OpenAI Agents architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture)
- [OpenAI tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)
- [OpenAI ChatKit](https://developers.openai.com/api/docs/guides/chatkit)
- [Tauri Node.js sidecar](https://v2.tauri.app/learn/sidecar-nodejs/)
- [Tauri shell and sidecar permissions](https://v2.tauri.app/reference/javascript/shell/)
- [PixiJS scene objects and bounds](https://pixijs.download/dev/docs/scene.html)
- [Three.js TransformControls](https://threejs.org/docs/pages/TransformControls.html)
- [Reelier deterministic receipts and replay](https://github.com/seldonframe/reelier)
- [AgentReplay trace and replay harness](https://github.com/anzal1/agentreplay)
- [Zosma Cowork Tauri/daemon workspace architecture](https://github.com/zosmaai/zosma-cowork)
