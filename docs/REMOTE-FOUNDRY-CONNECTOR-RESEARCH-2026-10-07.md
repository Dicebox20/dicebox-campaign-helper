# Remote Foundry connector research and recommendation

Status: research-only recommendation, 2026-10-07. This document does not accept a new implementation card, promote Stage 12, authorize a live Foundry connection, or change `readyClaim:false`.

## Question

How should the DiceBox connector improve so Codex/Desktop Commander can help develop Foundry modules efficiently, while keeping the build small and preserving the existing exact-world, active-GM, fixed-operation boundary?

## Findings

### 1. The connector should follow Foundry's public package surface

Foundry's official module-development guidance starts with a valid `module.json`, recommends a conventional package layout, and identifies ES modules plus lifecycle hooks as the normal module entry path. The v14 API documentation distinguishes public APIs from private internals; new connector diagnostics should report and use public APIs wherever possible. The `init` → `setup` → `ready` lifecycle and document hooks should be explicit in any runtime profile rather than inferred from a successful socket connection.

### 2. The remote MCP edge needs a real protocol/auth implementation before public use

The prototype's static bearer token is adequate only for local/private development. Current MCP guidance expects Streamable HTTP behavior, HTTP-boundary `401` responses, OAuth discovery metadata, `WWW-Authenticate`, and a resource-server validation model. The current MCP TypeScript SDK can generate tool schemas, validate inputs/outputs, and serve Streamable HTTP; the hand-written gateway should eventually become a thin adapter around that SDK. TLS/WSS belongs at the deployment edge, not inside the Foundry module.

### 3. The most valuable developer feature is a verified build-to-runtime loop

Current community templates converge on TypeScript, Vite/watch builds, a symlink or link command into `Data/modules`, Vitest, and optional Playwright end-to-end tests. They also warn that Foundry is not HMR-friendly: a full reload is the reliable boundary and ESM remains cached per page load. The connector should therefore make the loop observable: build hash → staged module manifest/hash → target world/core/system/module identity → reload/manual boundary → read-only runtime probe → receipt.

### 4. Version drift is a first-class connector problem

Foundry publishes migration guides, while community developers report substantial breaking and deprecated API work across major versions. The League of Foundry Developers' type declarations are useful but unofficial and versioned; they should be pinned to the exact supported Foundry generation rather than treated as an evergreen API contract. The connector should expose a version/profile mismatch as a blocker before offering development recipes.

### 5. Community libraries are useful selectively, not as the first dependency layer

`libWrapper` is valuable when a module must wrap core methods because it standardizes conflict detection and troubleshooting, but its own guidance favors a soft dependency or shim when possible. `socketlib` simplifies registered client-to-client calls and elected-GM execution, but it broadens the authority and dependency surface. The DiceBox connector already has a narrower exact active-GM bridge, so neither library is necessary for the next connector slice.

### 6. Tool metadata should make safety visible to the host

MCP tool annotations provide a useful risk vocabulary: read-only, destructive, idempotent, and open-world hints. They are only hints and cannot replace deterministic guards, but adding them makes Desktop Commander/Codex approval UX more accurate. The connector should also publish structured output schemas instead of relying on text-only JSON blobs.

## Brainstorm, ranked by value versus build cost

| Idea | Value | Cost | Decision |
| --- | --- | --- | --- |
| Replace hand-written remote MCP HTTP with the official Streamable HTTP SDK and OAuth resource-server edge | Very high for "from anywhere" reliability and security | Medium | Necessary next slice |
| Add exact target profile: Foundry/core, system, module version, manifest hash, loaded entry hash, active GM, lifecycle phase | Very high for module development and cache/version debugging | Low-medium | Necessary next slice |
| Add build/stage/attest/probe recipe with redacted receipt | Very high; turns development into a repeatable loop | Medium | Necessary next slice |
| Add typed reviewed recipe registry for diagnostics and fixed injection operations | Very high; supports the user's macro goal without arbitrary code | Medium | Necessary next slice |
| Add MCP tool annotations and structured output schemas | High and low-cost | Low | Include in next slice |
| Add one isolated Foundry fixture Playwright smoke test | High confidence, moderate cost | Medium | Include immediately after the connector slice |
| Add a small ApplicationV2 connector panel inside Foundry | Useful for visibility, not required for Codex/Desktop Commander | Medium-high | Defer |
| Add `socketlib` | Useful only for multi-client in-world routing | Medium and expands authority | Defer; optional adapter later |
| Add `libWrapper` | Useful only when wrapping core methods | Low now; dependency/compatibility cost | Defer; soft dependency only if needed |
| Add arbitrary macro text, script evaluation, shell passthrough, or generic document RPC | High power but unsafe and hard to verify | High | Reject |
| Add MCP Apps UI/dashboard | Attractive, but not required to develop modules | High | Defer |

## Recommendation

The next implementation should be one narrow vertical slice with five pieces:

1. Keep the Foundry WebSocket protocol and exact-world/elected-GM gate, but move the remote HTTP MCP surface to the official Streamable HTTP SDK.
2. Add production-shaped OAuth discovery/token validation and require TLS/WSS for non-loopback deployment; retain the static token only as a clearly labeled local-dev mode.
3. Add `module.dev.profile` and `module.dev.attestation` read-only tools that report the exact manifest, versions, loaded entry, bundle hash, lifecycle phase, active GM, and connector protocol.
4. Add a versioned recipe registry. Each recipe has an ID, version, input schema, preconditions, authority class, read/write classification, expected receipt, and timeout/unknown behavior. Diagnostic recipes can run automatically; any injection recipe requires preview, explicit approval, exact target/active-GM recheck, and authoritative reread.
5. Add one isolated fixture smoke path for build → stage/link → load → profile → diagnostic recipe, with no campaign mutation.

This is the smallest change set that makes the connector genuinely useful for module development and safely extensible to reviewed injection operations. Everything else should wait until this slice proves a reliable target/profile/receipt loop.

## Explicit non-goals

- No arbitrary macro body transport, `eval`, `new Function`, raw socket commands, shell passthrough, or generic Foundry document API.
- No automatic browser login, password generation, or bypass of the manual Gamemaster boundary.
- No public relay deployment in this research pass.
- No claim that the current prototype is compliant with the latest remote MCP authorization requirements.

## Sources

- [Foundry Introduction to Module Development](https://foundryvtt.com/article/module-development/)
- [Foundry v14 API documentation](https://foundryvtt.com/api/)
- [Foundry v14 hook events](https://foundryvtt.com/api/v14/modules/hookEvents.html)
- [Foundry v14 ApplicationV2](https://foundryvtt.com/api/modules/foundry.applications.html)
- [Foundry v14 ClientSettings](https://foundryvtt.com/api/classes/foundry.helpers.ClientSettings.html)
- [Foundry API migration guides](https://foundryvtt.com/article/migration/)
- [League of Foundry Developers type declarations](https://github.com/League-of-Foundry-Developers/foundry-vtt-types)
- [League module template](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template)
- [Community TypeScript/Vite v14 template](https://github.com/asmazovec/fvtt-module-ts-template)
- [Community Playwright Foundry test library](https://github.com/TheFehr/foundry-playwright)
- [libWrapper guidance](https://github.com/ruipin/fvtt-lib-wrapper)
- [socketlib](https://github.com/farling42/foundryvtt-socketlib)
- [Remote Desktop Commander](https://github.com/desktop-commander/remote-desktop-commander)
- [MCP authorization guidance](https://apps.extensions.modelcontextprotocol.io/api/documents/authorization.html)
- [MCP Streamable HTTP SDK](https://ts.sdk.modelcontextprotocol.io/v2/api/%40modelcontextprotocol/node/streamableHttp.html)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/v2/)
- [MCP tool annotations](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
- [Community discussion of Foundry API churn](https://www.reddit.com/r/FoundryVTT/comments/1wk6be3/foundrys_api_changes_are_strangling_its_own/)
