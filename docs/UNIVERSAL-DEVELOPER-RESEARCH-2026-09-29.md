# Universal developer-technique research

## Pass 1: standalone runtime and coordinate calibration

Date: 2026-09-29

Evidence class: research plus local static inspection. This pass does not certify runtime behavior, approve a dependency, or authorize a renderer change.

### Scope

This pass compares the standalone Campaign Helper desktop surface with primary guidance for Tauri, browser coordinate APIs, PixiJS, and Playwright. The local target is the current desktop package: `@tauri-apps/api` 2.11.1, Tauri CLI 2.11.4, PixiJS 8.20.0, React 19.2.8, Vite 8.2.2, and TypeScript 5.9.2.

### External findings

1. Tauri distinguishes physical monitor pixels from logical window pixels. Monitor position, size, and work area are physical; window creation options expect logical pixels and require conversion with the monitor scale factor. Source: https://v2.tauri.app/reference/javascript/api/namespacewindow/ and https://v2.tauri.app/reference/javascript/api/namespacedpi/.
2. The browser has several coordinate spaces. `clientX` and `getBoundingClientRect()` are viewport-relative CSS-pixel measurements; `pageX` is document-relative; `screenX` is screen-relative. `devicePixelRatio` relates physical pixels to CSS pixels and changes with display scaling and page zoom. Sources: https://developer.mozilla.org/en-US/docs/Web/API/CSSOM_view_API/Coordinate_systems, https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect, and https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio.
3. PixiJS separates local, global, and screen coordinates. Its guidance warns that CSS stretching can make the canvas element's screen size differ from the renderer's underlying size. PixiJS v8 also distinguishes local bounds from global bounds. Sources: https://pixijs.com/7.x/guides/basics/scene-graph and https://pixijs.com/8.x/guides/components/scene-objects.
4. Playwright traces provide a durable debugging artifact containing action timing, DOM snapshots, screenshots, console output, network information, and metadata. Its visual-comparison guidance warns that screenshots vary with the host OS, browser, hardware, and rendering mode, so baselines must be generated and compared in a controlled environment. Sources: https://playwright.dev/docs/trace-viewer and https://playwright.dev/docs/next/test-snapshots.

### Local comparison

The current `SceneViewport.tsx` initializes Pixi with `resizeTo: host` and `autoDensity: true`, then applies a manual scene-root scale based on `host.clientWidth` and `host.clientHeight`. The CSS stretches the canvas to fill its host. The Map Lab preview uses an `<img>` and an SVG with the same 1536x1024 viewBox, plus percentage-positioned HTML anchors. The current 3:2 fixture ratio matches the 1536x1024 canvas, but the implementation has no single recorded transform object shared by every layer.

The existing Foundry calibration adapter is a separate boundary: it uses Foundry's native `canvas.clientCoordinatesFromCanvas` for a no-write overlay and must not become coordinate authority for the standalone app. The standalone app's authority remains its DiceBox scene/blueprint model.

### Candidate technique

Introduce a typed, inspectable coordinate-frame record at the application boundary, without changing behavior yet. It should name the source and destination spaces, dimensions, scale, offset, device-pixel ratio, viewport rectangle, and transform revision. Candidate spaces are:

`scene-pixels → renderer-local → Pixi-global → canvas/CSS → viewport-client → screen/logical → screen/physical`

All visual layers and pointer conversions should consume the same derived transform rather than independently recomputing percentages, CSS object-fit behavior, or renderer scale. A calibration receipt should expose the record and compare known stable anchors at several viewport sizes, display scale factors, zoom/pan states, and window positions.

### Failure boundaries

- Tauri monitor/window conversions do not prove WebView or canvas alignment.
- `devicePixelRatio` is not a substitute for the full canvas bounding rectangle and renderer dimensions.
- A matching aspect ratio hides, but does not eliminate, transform drift.
- A Pixi global coordinate is not automatically a viewport or screen coordinate.
- A passing screenshot comparison is environment-specific and does not prove geometric authority.
- The current local and Foundry receipts are different evidence classes; one cannot promote the other.

### Next narrow pass

Inspect the standalone app's state and interaction architecture, then compare it with official React guidance, state-machine modeling, undo/redo patterns, and visual-editor workflows. The next calibration-specific check should be a read-only transform inventory showing the actual host rectangle, canvas backing dimensions, CSS dimensions, Pixi root transform, and pointer-event coordinates in one receipt.

## Pass 2: state, proposals, and interaction modes

Evidence class: research plus local static inspection. This pass does not recommend adding XState or another state library as a dependency.

### External findings

1. React recommends one owner for each meaningful piece of state, lifting shared state to the closest common owner, avoiding duplicate or contradictory state, and using reducers when state-update logic becomes complex. Sources: https://react.dev/learn/sharing-state-between-components, https://react.dev/learn/managing-state, and https://react.dev/learn/choosing-the-state-structure.
2. State-machine modeling makes states, events, transitions, guards, and terminal states explicit. XState and Stately provide a visual editor and simulator, which is useful as a design and review technique even when the runtime library is not adopted. Sources: https://stately.ai/docs and https://stately.ai/docs/studio.
3. Stately documents guards as pure synchronous predicates and treats parallel states as independently active regions. Those concepts fit proposal workflows where approval state, persistence state, and runtime-reread state must not be collapsed into one boolean. Sources: https://stately.ai/docs/guards and https://stately.ai/docs/parallel-states.

### Local comparison

The standalone app already has a strong command-oriented semantic core. `packages/dicebox-scene/src/commands.ts` validates revisions, stable IDs, bounds, locked entities, command origin, and produces receipts. It also maintains explicit past/present/future history for undo and redo. `apps/campaign-helper-desktop/src/proposal-session.ts` validates exact project and Scene identity, stores proposal history, distinguishes preview, approval, commit, rejection, cancellation, stale, unknown-outcome, and recovery paths, and refuses foreign or credential-bearing sessions.

The React shell uses `useReducer` for the central desktop state but also has many independent `useState` values and self-test refs for project, proposal, recovery, director, and diagnostic surfaces. This is not automatically wrong; it does mean that the application has multiple interaction submachines which need explicit boundaries and should not be inferred from loosely related booleans.

### Candidate technique

Keep the existing command and proposal-session cores. Use state-machine terminology and diagrams as a review aid for each risky workflow: `idle → previewed → approved → applying → committed`, with explicit `stale`, `cancelled`, `unknown-outcome`, and `recovery` branches. Treat approval, persistence, and runtime reread as separate dimensions; use pure guards for identity, revision, authority, and current-state checks. This can be implemented with existing TypeScript functions and tests rather than adding a state-machine dependency.

### Calibration relevance

Calibration should be modeled as a read-only evidence workflow, not as a single `calibrated` flag. Candidate states are `uninspected`, `inventory-ready`, `transform-observed`, `drifted`, `blocked`, and `human-accepted`; resizing, display-scale changes, pan/zoom, and renderer remounts are events that invalidate or recompute the transform receipt. This makes it possible to distinguish “the geometry matches” from “the current view has been inspected” and “a human accepted the visual result.”

### Failure boundaries

- A reducer or command history does not prove persistence or runtime behavior.
- A state-machine diagram is a model, not an authority grant.
- Many UI booleans can describe impossible combinations unless their relationships are made explicit.
- Undoing a local scene command is not the same as undoing a committed external write.
- A terminal proposal status must not be used to infer that the renderer or Foundry projection is current.

### Next narrow pass

Inspect the current test and evidence surfaces, then compare official Playwright, Vitest, accessibility, and visual-regression guidance. Focus on a deterministic calibration receipt that can be replayed and visually reviewed without turning a screenshot into geometric authority.

## Pass 3: testing, observability, and accessibility evidence

Evidence class: research plus local static inspection. This pass does not certify the desktop runtime, approve a new dependency, or turn screenshots into geometry authority.

### External findings

1. Playwright Trace Viewer is a reconstruction tool, not merely a failure screenshot. A trace can retain action timing, before/action/after DOM snapshots, screenshots, source locations, console and network information, metadata, and attachments. Playwright specifically supports `retain-on-failure` when retries are disabled, which is useful for preserving the first failed observation without blindly rerunning an outcome-unknown operation. Sources: https://playwright.dev/docs/trace-viewer and https://playwright.dev/docs/trace-viewer-intro.
2. Playwright visual comparisons are useful for detecting visual drift, but their baselines depend on browser, operating system, hardware, fonts, and rendering conditions. A screenshot can therefore be a review artifact or regression signal, but not the sole source of coordinate truth. Source: https://playwright.dev/docs/test-snapshots.
3. Vitest supports machine-readable JSON and JUnit reports, HTML reports, custom reporters, and blob reports that can be merged across environments. Snapshot guidance says the reference artifact should be reviewed as part of code review rather than updated automatically as proof of correctness. Sources: https://vitest.dev/guide/reporters and https://vitest.dev/guide/snapshot.html.
4. The WAI-ARIA Authoring Practices Guide treats keyboard operation, focus movement, visible focus, and the distinction between focus and selection as behavioral design requirements. An automated accessibility scan is useful, but it cannot replace interaction checks for dialogs, grids, tabs, menus, or custom canvas-adjacent controls. Sources: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ and https://www.w3.org/WAI/ARIA/apg/patterns/grid/.
5. The official `@axe-core/playwright` package injects axe into Playwright pages and frames, providing a repeatable automated accessibility check. Its output still represents the rules that were scanned, not proof that keyboard behavior, pointer mapping, or visual geometry is correct. Source: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright.

### Local comparison

The repository already has two useful evidence lanes. Vitest runs deterministically with one fork and no file parallelism, while Playwright has separate utility-harness and accessibility projects. The Playwright configuration uses one worker, zero retries, `retain-on-failure` traces, failure screenshots, and failure video. The repository also has typed receipts and an evidence ladder that distinguishes static, deterministic, harness/browser, fixture, and exact-runtime evidence. This is a good foundation for calibration work; it does not yet amount to a calibration receipt because the current test configuration records test artifacts without a shared transform inventory.

### Candidate technique

Use a three-layer calibration evidence bundle:

1. A pure deterministic transform test records the expected mapping for known scene points, viewport sizes, scale factors, pan/zoom states, and inverse conversions. The receipt should include the transform revision and tolerances, not only pass/fail.
2. A browser/harness observation records the actual host `DOMRect`, CSS canvas size, renderer backing dimensions, device-pixel ratio, Pixi root transform, pointer `clientX/clientY`, and the resulting scene point. Attach a screenshot and trace for review, but keep the numeric receipt authoritative for the tested observation.
3. A human acceptance step compares stable visible anchors and interaction behavior at a small matrix of view sizes. It should be labeled accepted observation, not silently promoted to exact runtime or Foundry evidence.

For the broader app, use structured receipts as the observability seam: one stable operation id, evidence class, environment fingerprint, state/transform revision, inputs, outputs, warnings, and explicit unknown/blocked status. Use Vitest JSON or JUnit for deterministic machine consumption, Playwright traces for browser reconstruction, and accessibility checks plus keyboard interaction tests for the UI surface. Keep visual snapshots narrow and intentional; do not accept a baseline update without a reason and a reviewable numeric or semantic change.

### Failure boundaries

- A Playwright trace shows what the harness observed; it does not prove that an external write committed or that a transform is authoritative outside that browser context.
- A screenshot or visual diff can reveal drift but cannot distinguish CSS scaling, renderer scaling, DPR, or wrong scene origin without numeric transform data.
- A Vitest snapshot can detect an unexpected serialized change, but updating it can merely bless a regression.
- An axe result does not prove keyboard traversal, focus restoration, pointer hit testing, or canvas alignment.
- A passing browser harness run is not exact desktop-window or multi-monitor evidence unless those conditions are explicitly represented.
- `retries: 0` prevents a false sense of recovery, but a failed test still needs classification: deterministic failure, observed drift, or outcome-unknown.

### Calibration relevance

The highest-value next artifact is a read-only transform inventory test in the existing utility harness, paired with a deterministic pure-math test. It should be able to say exactly which layer disagreed and preserve the evidence needed to reproduce that disagreement. The existing Playwright failure artifacts can support this without changing dependencies or using the Foundry adapter as a substitute for standalone coordinates.

### Next narrow pass

Compare visual/editor/game-tool workflows: scene graph inspectors, coordinate rulers, overlays, design-tool constraints, and game-engine calibration/debug patterns. Focus on techniques that can be borrowed as local tools rather than imported as runtime dependencies.

## Pass 4: visual-editor and game-tool calibration workflows

Evidence class: research plus local static inspection. This pass compares editor-tool patterns for inspiration; it does not authorize importing a module, adopting a runtime dependency, or changing geometry authority.

### External findings

1. Unity separates passive gizmos from interactive handles. Its editor presents selection outlines, wireframes, icons, move/scale/rotate controls, and custom gizmos as visual aids or direct-manipulation tools. This gives a useful distinction between “show me what the system believes” and “let me propose a change.” Sources: https://docs.unity.com/en-us/engine/6000.6/manual/unity-editor/editor-windows-views-reference/gizmos-and-handles and https://docs.unity.com/en-us/engine/6000.6/manual/unity-editor/editor-windows-views-reference/gizmos-and-handles/gizmos-introduction.
2. Three.js TransformControls makes coordinate space explicit (`world` versus `local`), exposes a viewport rectangle for sub-canvas mapping, and supports translation/rotation/scale snapping. Its helper is a separate visual object attached to a scene object. Source: https://threejs.org/docs/pages/TransformControls.html.
3. PixiJS Devtools provides a scene-graph panel, search, and live inspection/editing of properties such as position, scale, and rotation. The setup can be enabled through an optional devtools package or a development-only global hook, and the documentation supports PixiJS v7/v8. Sources: https://pixijs.io/devtools/docs/guide/features/scene/ and https://pixijs.io/devtools/docs/guide/installation/.
4. Godot's editor gizmo API passes a screen position and local transform separately to custom gizmo handlers, which reinforces the need to convert input into the object's local space before storing or applying a result. Source: https://docs.godotengine.org/en/4.5/classes/class_editornode3dgizmoplugin.html.

### Local comparison

The project already has the architectural split needed to borrow these ideas safely. The Spatial Blueprint and renderer-neutral Scene document own semantic geometry; Pixi renders and can show transient direct manipulation; React DOM owns accessible inspectors, forms, approvals, and keyboard commands; the Rust geometry service is intended to own committed transforms. The Map Lab currently has a fixed 1536x1024 logical canvas, grid metadata, SVG overlays, and percentage-positioned anchors, but it is primarily a preview and does not expose an editor-style calibration overlay with named frames, rulers, or selectable anchor diagnostics.

### Candidate technique

Build a development-only calibration overlay with four explicit modes:

- `observe`: passive gizmos show scene bounds, renderer bounds, CSS/client bounds, grid axes, origin, stable anchors, and pointer crosshairs. No writes.
- `compare`: two or more named anchors show expected scene coordinates, observed client coordinates, inverse-mapped scene coordinates, and error vectors. No writes.
- `propose`: optional handles create a typed preview command or proposal, never an implicit geometry mutation. Snapping and constraints are visible and named.
- `inspect`: an inspector lists the scene graph path, stable DiceBox id, local/global/frame transforms, revision, evidence class, and current blocker/unknown status.

Borrow the editor vocabulary without importing its authority model: passive gizmos are safe diagnostics; handles are proposal inputs; snapping is a declared constraint; local/world or scene/viewport space is always visible; and the overlay itself is disposable. A small optional Pixi Devtools installation may help inspect the render tree during development, but the project should not depend on it for calibration receipts or runtime behavior.

### Calibration relevance

The first overlay should be deliberately boring: origin, canvas rectangle, renderer backing rectangle, one grid, four stable anchors, pointer crosshair, and a side-panel table of numeric values. If a visual and numeric value disagree, the numeric receipt remains the evidence boundary and the overlay identifies which conversion step diverged. This gives the team a repeatable diagnostic language instead of asking a player or developer to guess which technical choice to make.

### Failure boundaries

- Editor gizmos can be drawn from the wrong transform and make a bad mapping look trustworthy; every overlay mark must state its coordinate frame.
- A live inspector may mutate properties; the initial calibration overlay must be read-only and development-gated.
- Snapping can conceal a systematic offset if it is applied before the raw measurement is recorded.
- A scene-graph inspector sees renderer objects, not necessarily the authoritative Scene document or committed Rust state.
- Local/world terminology from a 3D engine does not automatically map to this app's scene/renderer/CSS/client/screen chain.
- An optional devtools extension can disappear, lag, or observe a different build; receipts must remain self-contained.

### Prioritized recommendation after four passes

1. Add no new runtime dependency and do not begin with Foundry modules.
2. Define the read-only transform inventory and pure transform test as the first calibration slice.
3. Add the passive `observe` and `compare` overlay to make the receipt understandable to a human.
4. Only after drift is understood, consider a proposal-only handle mode with explicit snapping and approval.
5. Treat Pixi Devtools, trace viewer, and visual snapshots as optional development aids and review artifacts, never as geometry authority.

### Research sufficiency judgment

The four narrow passes now cover runtime coordinate spaces, state/interaction architecture, testing/observability/accessibility evidence, and visual/editor/game-tool workflows. Each area has official or maintainer evidence, a local comparison, a candidate technique, and failure boundaries. The research is sufficient to stop broad tool hunting and move to the narrow calibration evidence slice; implementation remains a separate accepted change.

