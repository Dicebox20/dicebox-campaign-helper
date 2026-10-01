# ADR-0004: Desktop Editor Foundation

Status: accepted with prototype conditions.

## Context

DiceBox needs a local-first, form-heavy editor with a large semantic map canvas, an upper-right preview, local project files, provider credentials, and controlled Foundry/Codex adapters. Prior references proposed Tauri/React/Konva but did not benchmark the canvas choice.

## Decision

Use Tauri 2 as the desktop shell, React/TypeScript for the DOM application shell, PixiJS v8 for the main canvas and preview, and Rust for privileged local services. The canvas is a projection of a renderer-neutral Scene document. All semantic actions remain available through accessible DOM controls.

Konva is not the production renderer. Electron is the explicit fallback if the target system-WebView matrix cannot meet the editor's rendering and accessibility criteria. Godot is not the primary authoring shell.

## Evidence

The M184 benchmark rendered the same large dual-view workload in Konva and Pixi. Pixi's steady pan/zoom and transform timings were materially lower. See `outputs/m184-editor-renderer-benchmark.json`. Tauri's official capability model supports a narrow frontend-to-core permission boundary, while its system-WebView architecture requires cross-platform prototype evidence.

## Consequences

- Create a Tauri/React/Pixi desktop skeleton next.
- Add Windows, macOS, and Linux WebView acceptance tests before release.
- Keep Electron as a documented shell escape without changing the renderer-neutral model.
- Do not expose secrets or broad filesystem/process commands to the WebView.

