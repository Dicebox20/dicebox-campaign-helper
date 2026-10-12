# Dicebox Bridge connection information — verified status and safe procedure

**Latest diagnostic checked:** 2026-10-09T20:27:26Z, `bridge_doctor({})` from the actual chat.

## Local service
- Connected plugin namespace: `mcp__Dicebox_Bridge__` (Bridge MCP tool catalog present).
- Bridge plugin build: `0.1.12`; protocol: `2.0.0`; server tool catalog: 37 present, no missing expected tools.
- Local transport: `local-first`, `loopback-only`; message protocol `receipt-first-v2` with durable claim/replay safety.
- Journal: ready/integrity OK, no integrity error reported.
- Runtime: compatible, 1 active current process; persistent PowerShell runspace was reported **ready/running**, PID 32592 (may change).
- Local Bridge data directory: `C:\Users\rujie\AppData\Local\Codex\dicebox-bridge`.
- Authentication token is stored locally under that data directory. **Do not read, copy, print, log, or include the token in a handoff.**
- Bridge status is **not** independent proof of remote tunnel health or of native cross-chat delivery.

## CRITICAL: Current Foreman binding is NOT proven
`bridge_doctor` returned:
- `currentChat.status = "missing"`.
- `currentChat.projectBinding = "unknown"`.
- `currentChat.identitySource = "unavailable"`.
- `foremanConnections.status = "identity_unverified"`.
- `activeLiveCodexSessionCount = 0` for the exact current chat.
- `tunnelRuntime.status = "not_observable_from_mcp_process"`.

Earlier `bridge_foreman_connect_current` returned `current_chat_identity_unavailable` with **no binding changed**. Old Bridge session counts, historical message IDs, previous project IDs, or Codex screenshots are NOT proof of an exact binding. Do not force a binding by copying a historical conversation ID.

## Connect/recover in the next chat
1. Make sure the **new target chat is idle**, and no other worker is modifying the same Foundry world or repository files.
2. Run `mcp__Dicebox_Bridge__bridge_doctor({})` as the **first Bridge action** in the new chat. Check `currentChat`, live session identity, tool catalog, and runtime.
3. If and only if host-supplied chat identity is verified and exactly one matching active live Codex session exists (or an independently identity-verified exact worker endpoint is provided), call `bridge_foreman_connect_current` for that chat. No fake IDs.
4. Read `bridge_foreman_status` to verify the actual bound identity and protocol state. Use message receipt/reconcile before considering a relay delivered; sending a message alone is not proof the remote Foreman received/acted on it.
5. If host identity is still missing, **stop remote binding**, document `current_chat_identity_unavailable`, and continue read-only/local Foreman work via Remote Desktop Commander only. Ask Codex to fix the host chat-identity forwarding and live-session registration separately.
6. Work coordination: one authoritative Foreman and at most one Foundry writer. Codex can work on the Bridge itself without issuing overlapping browser commands into a busy ChatGPT turn. Reserve and reconcile message delivery when idle.

## Verified local alternate connector
- `mcp__Remote_Desktop_Commander__` on `DESKTOP-OI30P4Q`.
- Current online device ID observed: `fefa032a-6c81-42c8-86d8-287028c8850e`.
- Duplicate older ID was offline. Always refresh `list_devices` before using any cached device ID.
- Remote Desktop Commander is a separate local device channel; **its availability does not establish Bridge messaging**.

## Version and security notes
Bridge message journal may contain older stale sessions or delivery failures. Avoid asserting that a remote conversation was delivered unless the protocol returned exact correlated receipt and native-turn reconciliation. Never put Bridge secrets or message payloads in handoff inventory. The data directory is deliberately not hashed or copied by this handoff.

No Bridge configuration, session binding, or token was altered in this handoff.
