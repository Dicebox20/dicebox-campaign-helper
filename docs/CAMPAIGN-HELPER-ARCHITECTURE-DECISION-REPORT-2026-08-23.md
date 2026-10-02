# DiceBox Campaign Helper Architecture Decision Report

**Date:** 2026-08-23  
**Status:** adopted program architecture; AI provider order reconciled 2026-08-24; implementation remains staged by the active slice  
**Scope:** the Campaign Helper desktop program and its Foundry module. Campaign content and the parked Tram work are not product architecture authority.

## Executive decision

DiceBox Campaign Helper will be a local-first desktop authoring program built with **Tauri 2, React, TypeScript, and PixiJS v8**. React DOM owns the accessible application shell, forms, inspector, command history, and approvals. Pixi owns the main semantic canvas and the required upper-right map preview as two views over one renderer-neutral Scene document. A **Rust geometry service** owns committed transforms, polygon operations, validation, spatial indexing, and deterministic serialization; the browser layer may render transient drag feedback but cannot become geometry authority.

The program stores a semantic `SceneDocument`, not a canvas scene graph. Human gestures and AI suggestions both become typed `SceneCommand` proposals. Relationships preserve authored intent; resolved absolute geometry is cached and serialized so preview, validation, and Foundry compilation remain deterministic. The application compiles approved documents into versioned Foundry plans and uses the existing bounded Foundry adapter for preview, approval, execution, and authoritative reread.

Raster generation uses a provider-neutral `ImageProvider` boundary and a **Structural Render Package**. No image provider is selected by reputation alone. GPT Image 2 and Gemini 3.1 Flash/Pro Image are the first benchmark candidates; FLUX Kontext and Ideogram are challengers. A provider is promoted only after the same map-specific corpus is scored for topology, entrances, empty puzzle space, style, edit fidelity, latency, and cost.

The Campaign Director and conditional Codex Technical Builder use one supervised Codex App Server connection with managed ChatGPT authentication by default, but receive different application-owned tool and authority profiles. The existing OpenAI Responses/API-key adapter remains an explicitly selected, separately billed backup for Campaign Director requests. Image-provider calls keep separate provider credentials and billing. The deterministic application remains the sole state, validation, approval, execution, reread, and recovery authority.

## Decision 1 — desktop/editor foundation

**Decision:** Tauri 2 + React/TypeScript + PixiJS v8; React DOM shell; Rust backend.  
**Status:** **CONFIRMED WITH CONDITIONS**.  
**Confidence:** high for the architectural direction; medium for cross-platform performance until native WebView prototypes pass.

### Evidence

- Tauri provides a Rust core, system WebViews, message-passing, and capability-scoped frontend permissions. Its platform WebViews reduce bundle duplication but introduce an explicit Windows/macOS/Linux compatibility matrix.
- Electron provides a more uniform bundled Chromium runtime, but carries a larger distribution and security-update surface. It remains the escape hatch if system-WebView variance prevents a reliable editor.
- A repository benchmark rendered a 4096×4096 background, 4,000 semantic entities in the main view, another 4,000 in the preview, and 250 selected transforms. Under Windows headless Chrome/SwiftShader, Pixi averaged 47.36 ms for pan/zoom and 44.43 ms for transforms; Konva averaged 102.31 ms and 69.76 ms. Receipt: `outputs/m184-editor-renderer-benchmark.json`.
- Canvas accessibility requires a DOM-equivalent interaction path. React DOM therefore owns all semantic editing controls, focus, labels, inspector fields, and keyboard commands. The Pixi canvas is a visualization and direct-manipulation surface, not the only way to operate the editor.

### Alternatives

- **Electron + React + Pixi:** viable fallback for runtime consistency; rejected as the first choice because Tauri better fits local capability isolation and distribution goals.
- **Konva:** useful for small prototypes, overlays, or test utilities; rejected as the production renderer after the representative benchmark.
- **Godot:** capable 2D engine and possible future simulation surface; rejected for the primary form-heavy authoring shell because it would split the existing TypeScript architecture and increase integration/accessibility cost.
- **Browser-only application:** rejected because local project files, provider secrets, Foundry staging, and deterministic tool orchestration require a privileged local core.

### Risks and escape criteria

- Prototype Windows WebView2, macOS WKWebView, and Linux WebKitGTK before release. Switch the shell to Electron if two target platforms cannot meet interaction, accessibility, and rendering baselines without platform-specific editor forks.
- Pixi remains main-thread-bound. Move heavy indexing and committed geometry off the UI thread; virtualize or cull large layers. Reconsider the renderer only if native-GPU prototypes still miss the agreed interaction budget.
- Rust is not installed in the current workspace. Toolchain installation and a pinned Tauri/Rust build are the next implementation gate, not assumed evidence.

### Repository impact

- Add `apps/campaign-helper-desktop/` for Tauri/React/Pixi.
- Add `packages/dicebox-scene-model/` for renderer-neutral TypeScript schemas and commands.
- Add `crates/dicebox-geometry/` for committed geometry and validation.
- Keep `packages/dicebox-foundry` an adapter, not the application model.

## Decision 2 — semantic editor and geometry architecture

**Decision:** renderer-neutral document + shared typed commands + relationship intent + cached absolute geometry + Rust committed-geometry service.  
**Status:** **CONFIRMED WITH CONDITIONS**.  
**Confidence:** high for the model; medium for the Rust geometry library stack until robustness fixtures pass.

### Evidence

- Existing project invariants already make stable DiceBox IDs canonical and Spatial Blueprint geometry authoritative.
- The local command spike applied 500 typed human/AI commands to 10,000 entities and 4,000 relationships without validation errors. Indexing took 5.36 ms, validation 11.70 ms, serialization 25.81 ms, and parsing 24.40 ms. The 566.19 ms cascading commit proves the model is viable but also proves committed dependency resolution must not run synchronously on every pointer event. Receipt: `outputs/m184-scene-command-pipeline-benchmark.json`.
- Rust `geo` provides affine, Boolean, buffer/offset, validation, and serialization building blocks; `rstar` provides an R*-tree for spatial querying.

### Adopted model

1. `SceneDocument` stores entities, stable IDs, geometry, semantic roles, relationships, provenance, and compilation metadata.
2. `SceneCommand` is the only edit boundary. Human and AI producers use the same discriminated command schema.
3. Relationships such as align, attach, contain, mirror, connect, and correspond own intent.
4. The committed document stores resolved absolute geometry plus the relationship graph and dependency fingerprints. This hybrid avoids both pixel ownership and expensive implicit recomputation.
5. Pixi renders a projection. It never writes the document directly.
6. During drag, the frontend displays an ephemeral transform. On pointer release it submits one command; Rust validates, resolves dependents, and returns one committed patch and receipt.
7. The upper-right preview subscribes to the same committed projection and can show candidate/validation overlays without creating a second source of truth.

### Alternatives

- **Canvas scene graph as source:** rejected because it couples persistence and compilation to one renderer.
- **Relationships only, no absolute cache:** rejected because export and preview would depend on repeated hidden resolution.
- **Absolute coordinates only:** rejected because intent and safe downstream adjustment would be lost.
- **All geometry in JavaScript:** acceptable for the first skeleton, rejected for committed production geometry because robust polygon operations and large dependency cascades need an isolated deterministic service.

### Risks and escape criteria

- Begin with `geo` + `rstar`. Add a geometry corpus for self-intersections, holes, touching boundaries, door cuts, buffers, and large coordinates. Evaluate `i_overlay`, Clipper, or GEOS only if the corpus exposes reproducible robustness failures.
- IPC overhead is unknown. Batch commands and patches; if Rust calls dominate normal interactions, keep simple affine validation in a Web Worker while retaining Rust for authoritative commits and compilation.

### Repository impact

- Version `SceneDocument`, `SceneCommand`, `ScenePatch`, and `GeometryReceipt` schemas.
- Add golden serialization and migration fixtures.
- Extend the compiler from semantic plans, never from Pixi objects.

## Decision 3 — image-provider architecture

**Decision:** provider abstraction plus Structural Render Package; provider winner selected by a map-specific benchmark.  
**Status:** **REQUIRES PROTOTYPE**.  
**Confidence:** high for the abstraction; low for any single provider before the benchmark.

### Evidence

- GPT Image 2 supports generation, editing, flexible sizes, and high-fidelity image inputs.
- Gemini's current image family offers fast, general, and premium variants with multi-reference editing and high-resolution outputs.
- Ideogram emphasizes prompt/text fidelity; FLUX Kontext provides asynchronous generation/editing; both are credible challengers.
- The project’s failed map iterations demonstrate that visual appeal does not prove coordinate fit, empty puzzle space, or door topology.

### Structural Render Package

Every provider receives the same versioned package:

- a geometry-neutral base brief;
- locked room silhouette, entrances, exclusions, and negative-space masks;
- style references and palette;
- explicit list of Background Objects allowed in the raster;
- explicit list of native Foundry Tiles that must remain separate;
- coordinate/grid overlay and evaluation rubric;
- seed, provider/model/version, prompt, inputs, output hash, dimensions, latency, and cost.

The provider returns candidate pixels only. Deterministic software validates dimensions and overlays; a human reviews topology and style; no image becomes geometry authority.

### Benchmark and promotion rule

Run one corpus containing: a neutral industrial room, an entrance-constrained room, an empty 6×6 Rush Hour board, and a targeted edit preserving topology. Score topology/door correctness, forbidden-object leakage, edit fidelity, style match, usable resolution, latency, and cost. GPT Image 2 and Gemini 3.1 Flash/Pro Image run first; FLUX Kontext and Ideogram enter if neither clears the threshold.

### Risks and escape criteria

- Provider/model names, pricing, and limits change. Store capabilities and version fingerprints rather than hard-coded assumptions.
- If no provider meets topology thresholds, generate only textures/decoration and compose them deterministically over program-owned structural layers.
- Provider secrets live in the desktop secret store or environment, never project files.

### Repository impact

- Add `packages/dicebox-image-provider/` and a provider conformance suite.
- Store render packages and benchmark receipts in project artifacts.
- Defer a default provider until credentials and the corpus are available.

## Decision 4 — AI architecture

**Decision:** one Campaign Director, conditional Codex Technical Builder, deterministic application executor.  
**Status:** **CONFIRMED WITH CONDITIONS**.  
**Confidence:** high.

### Evidence

- Codex App Server is the supported deep product-integration surface for authentication, conversation history, approvals, and streamed events, and its account surface supports managed ChatGPT and API-key modes.
- OpenAI Responses supports typed function tools and remains a viable explicit API-key fallback for semantic command proposals.
- App Server does not grant application authority: Campaign Director and Technical Builder still require separate typed schemas, tools, sandboxes, and approval policies.
- The project postmortem shows that concurrent free-form agents, copied context, and transport success were repeatedly mistaken for integrated product behavior.

### Adopted responsibilities

- **Campaign Director:** uses the managed App Server provider by default to convert user intent into project queries, explanations, and typed command proposals. It receives only task-specific read-only KB slices and current document summaries and has no repository/runtime mutation tools.
- **Codex Technical Builder:** uses the same managed account transport but a separate technical policy; it is invoked only for repository changes, adapters, migrations, tests, build failures, or developer-authored extensions. It receives a versioned handoff envelope and returns a patch/receipt from an isolated scope.
- **API-key backup:** uses the existing strict Responses adapter only after explicit user selection, retains separate billing disclosure, and emits the same validated proposal envelope.
- **Deterministic executor:** validates schemas, authority, ownership, dependencies, and current fingerprints; previews exact deltas; executes only after approval; rereads and records.

There is no always-on two-agent conversation. Agent output is never a world write. The application owns project state, approvals, retries, and recovery.

### Risks and escape criteria

- Tool loops can become expensive. Enforce budgets, typed outputs, bounded KB retrieval, and one active outcome.
- If Campaign Director planning is unreliable for a class of work, replace it with a deterministic wizard before adding another agent.
- Codex jobs must operate in an isolated branch/worktree or a declared file scope and return a clean-boundary handoff.

### Repository impact

- Add typed `IntentEnvelope`, `CommandProposal`, `TechnicalJob`, and `TechnicalJobReceipt` schemas.
- Add deterministic evals for tool selection, command validity, authority refusal, and stale-state recovery.

## Decision 5 — OpenAI/Codex account integration

**Decision:** Codex App Server managed ChatGPT authentication is the primary AI provider for Campaign Director and Technical Builder; the OS-secured API-key adapter is an explicit Campaign Director backup; image-provider credentials remain separate.  
**Status:** **CONFIRMED WITH CONDITIONS; RECONCILED 2026-08-24**.  
**Confidence:** high for the supported auth boundary; medium for packaging UX until the desktop prototype runs it.

### Evidence

- Codex App Server provides account read/login operations, managed browser/device-code authentication, conversation history, approvals, and streamed events.
- Its account API reports auth mode and plan details and exposes ChatGPT rate-limit and usage reads.
- Official authentication guidance identifies ChatGPT sign-in as subscription access and API-key sign-in as usage-based access at standard API rates.
- Working App Server clients provide implementation corroboration for loopback supervision, streaming, cancellation, and tool handling, but official documentation remains authoritative.

### Adopted flow

1. The user chooses **Connect ChatGPT/Codex Account**.
2. The local Tauri core starts/supervises Codex App Server over its supported local protocol.
3. App Server initiates managed browser login or device-code flow and owns refreshable credentials.
4. The app stores only non-secret account metadata and connection status and displays current plan/rate-limit/usage metadata.
5. Campaign Director requests and Technical Builder jobs use separate application-owned policies over that connection.
6. The user may explicitly select **API key backup**; the existing OS credential store supplies the key without returning it to the webview, and the UI identifies separate usage-based billing.
7. Image calls use separately supplied provider credentials.
8. No automatic paid fallback, cookie scraping, Chrome-profile control, shared-browser extraction, undocumented proxy, or external-token injection is allowed.

### Alternatives

- **Codex SDK only:** useful for headless technical jobs later; insufficient as the sole integration because the product needs first-class login, approvals, and account state.
- **API key as the primary path:** rejected because it blocks subscription-backed use and can create billing confusion; retained as a deliberate fallback.
- **Automating the Codex desktop/Chrome UI:** rejected as brittle and unsupported.

### Risks and escape criteria

- App Server protocol/version changes require a pinned compatibility adapter and runtime probe.
- Enterprise policies may disable a login mode; expose device-code and API-key alternatives without weakening token custody.
- Reaching a subscription limit must not silently switch to API billing; show the blocker and let the user choose.
- Never log tokens, authorization URLs containing secrets, or provider credentials.

### Repository impact

- Add `packages/dicebox-codex-adapter/` with a versioned App Server client.
- Add one provider orchestrator, connection/account/usage UI, and redacted diagnostics.
- Preserve the current strict Responses adapter and native OS credential store as the API-key backup.
- Keep the integration optional; the deterministic editor remains usable without Codex.

## Architecture acceptance boundary

These decisions authorize the desktop-shell skeleton and semantic-command vertical slice. They do **not** certify a production desktop, select an image provider, install into Foundry, resume the Tram task, or authorize a live campaign write. Those outcomes remain behind the roadmap and active-slice gates.

## Primary references

- [Tauri security](https://v2.tauri.app/security/) and [capabilities](https://v2.tauri.app/security/capabilities/)
- [Tauri WebView versions](https://v2.tauri.app/reference/webview-versions/)
- [Electron security](https://github.com/electron/electron/blob/main/docs/tutorial/security.md)
- [PixiJS architecture](https://pixijs.com/8.x/guides/concepts/architecture) and [accessibility](https://pixijs.download/dev/docs/accessibility.html)
- [Konva overview](https://konvajs.org/docs/overview.html) and [performance guidance](https://new.konvajs.org/docs/performance/All_Performance_Tips.html)
- [Godot applications guidance](https://github.com/godotengine/godot-docs/blob/master/tutorials/ui/creating_applications.rst)
- [Rust geo](https://docs.rs/geo/latest/geo/) and [rstar](https://docs.rs/rstar/latest/rstar/struct.RTree.html)
- [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)
- [Gemini image generation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Ideogram API](https://developer.ideogram.ai/) and [Black Forest Labs image API](https://docs.eu.bfl.ai/quick_start/generating_images)
- [Codex App Server](https://learn.chatgpt.com/docs/app-server), [Codex SDK](https://developers.openai.com/codex/sdk), and [Codex authentication](https://developers.openai.com/codex/auth)
- [OpenAI Responses API](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)
