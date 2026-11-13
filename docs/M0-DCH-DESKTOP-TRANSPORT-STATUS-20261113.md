# M0 DCH-only desktop-to-module transport diagnostic

Date: 2026-11-13. Branch source: GitHub main 848b259c1e62de5f8a13d44a9829f9fe251a2d74. Regionwright is a separate project and remains out of scope.

## Problem and decision

Worker A returned read-only Bridge receipt msg-73894264-acfc-4910-a96f-d939074e0631 (seq 140444): the tracked local bridge trusts the in-world WebSocket client's isGM claim in its host hello. Browser-side elected-GM and world checks exist, but this is not independent host authentication or proof of actual GM identity. No authorization to alter that guard or to reset unknown same-class attempts has been established.

Worker B returned read-only Bridge receipt msg-cd2eb54a-48eb-40f1-850c-9537c9336860 (seq 140445): the native desktop lacks a bounded authenticated world/current elected-GM module status or loaded-artifact readback. Existing project and technical-job controls do not provide one.

Rather than make an unsafe authority assertion, this isolated DCH Desktop change adds an explicitly TRANSPORT-ONLY read. It is not a replacement for the missing authenticated module status. It does not read secrets, perform MCP tool calls, log in, change world configuration, or write to Foundry.

## Product changes

- Native Tauri command probe_dch_local_bridge_transport opens a bounded 350-ms TCP connection to fixed loopback 127.0.0.1:8797, reports either DEFAULT_PORT_REACHABLE_UNVERIFIED or DEFAULT_PORT_NOT_REACHABLE and always reports BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN.
- The native response always has authenticatedGmVerified=false, worldVerified=false, moduleRuntimeVerified=false and noFoundryWrite=true, and accepts no user-supplied target address or port.
- The desktop sidebar now shows an explicit button to check the default DCH local MCP port. This is manually triggered with no polling or background heartbeat. In the browser preview the control is disabled and does not forge native results.
- A separate pure presentation-model parser rejects unknown or forged GM/world/module-verified replies and displays no authority claim. A reachable port is labeled only as TCP availability, not a signed GM/user observation.

## Verification receipts

- npm ci --no-audit --no-fund PASS: dch-foreman-2202-desktop-bridge-native-npm-ci-v001.
- Five new Vitest assertions PASS, including forged-GM and wrong endpoint denial: dch-foreman-2204-desktop-native-transport-retest-build-v001.
- DCH frontend production build PASS: dch-foreman-2204-desktop-native-transport-retest-build-v001.
- cargo check --offline PASS for Tauri: dch-foreman-2205-desktop-native-probe-cargo-check-offline-v001.
- Two native Rust unit tests PASS: dch-foreman-2207-desktop-native-bridge-rust-unit-tests-v001.
- The repository-wide cargo fmt --check remains nonzero due to unrelated existing Rust formatting; only this new DCH command's formatting was aligned, and no broad reformat was performed.

## Remaining M0 gate

This diagnostic is a first desktop product control, not an authenticated desktop-to-Foundry status or loaded-artifact readback. The exact active elected GM, User collection, authenticated host caller binding, runtime module execution, and full ChatGPT-driven DCH edit/build/install/readback remain NOT VERIFIED. Source-gated host trust correction requires complete attempt history. M0 remains NOT_ACCEPTED, 0/8 independent acceptance criteria.
