# DCH M0: native Desktop and tracked local MCP host, no GM

Date: 2026-11-13. Source main 2e6412d8dd66744c9f68635c8b216663b8b02aa6.
Scope: DiceBox Campaign Helper Desktop and its own module ONLY. Regionwright is a separate project.

## Purpose

The opt-in Windows script tools/run-m0-dch-native-transport-no-gm-smoke.mjs starts the tracked DCH MCP host on local port 8797 and the exact owner-supplied reviewed Desktop executable. The operator must supply --exe with an absolute Windows path and --sha256 with its 64-character hash; mismatch or occupied ports block the run.

The script verifies real MCP initialize, the eight-tool tools/list, and a denied tools/call without an eligible active GM. It then opens its own native Tauri review application, waits for the rendered DCH Foundry connection panel, clicks Check local DCH MCP port inside the real WebView, and verifies the displayed TCP-reachable-but-unverified message. Only the test-owned desktop and host processes are stopped afterward. It verifies port 8797 and diagnostic WebView port 9249 are unbound before and after.

Follow-up process-identity strengthening (2026-11-14): The script also reads Windows netstat.exe -ano -p tcp and requires the exact 127.0.0.1:8797 LISTENING PID to equal the tracked Node MCP host child PID, both before and after clicking the native Desktop button. A listener on another PID, another port, the wrong network interface, or multiple competing PIDs fails closed. This guards against accidentally attributing an unrelated local TCP service to DCH. It is not authentication of a Foundry GM or ChatGPT caller.

No authenticated Foundry session, user database, password, module activation or world write is used. The installed October preview and the existing disposable dbx-test-world runtime are unchanged.

## Real result

- Reviewed executable SHA256: AB0F91F4834C4EC6C9DD04755CA4028C51951C1E7CD7A63C1EA5B706B627F97F
- Native WebView page: http://tauri.localhost/
- MCP initialize: PASS; reviewed tools: 8; no-GM tool call: DENIED.
- Exact Windows TCP listener PID matches spawned DCH MCP host PID: PASS (both before and after native Desktop button click; test receipt dch-foreman-20261114-real-native-M0-PR48-listener-exact-PID-integration-v001).
- Actual clicked native button: Check local DCH MCP port.
- Native output: Default local MCP port responds to TCP. Elected GM, exact world and loaded DCH module are NOT VERIFIED; no Foundry write.
- Both owned test listeners (8797 and 9249) closed after completion.
- Durable receipt: dch-foreman-20261113-native-DCH-real-UI-plus-MCP-protocol-denied-nogm-v001.

## Operator invocation

From DCH repo root on the authorized Windows host, run:

    node tools/run-m0-dch-native-transport-no-gm-smoke.mjs --exe "ABSOLUTE_REVIEW_EXECUTABLE_PATH" --sha256 "EXPECTED_SHA256"

This is a **transport-only** integration test. It does not prove an authenticated GM, active world, loaded DCH module byte hash, independently bound ChatGPT caller, or full self-development. DCH host still trusts a self-asserted isGM handshake and the lifetime fix attempt history is UNKNOWN; separate CODEX-GUARD-001 budget UNKNOWN/3. The host authentication boundary was not modified.

DCH M0 remains NOT_ACCEPTED (0/8 independently verified).
