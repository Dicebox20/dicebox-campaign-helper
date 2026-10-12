# Remote Foundry connector hardening

This local slice upgrades the original Desktop Commander prototype into a more maintainable module-development connector while preserving the fixed DiceBox bridge authority boundary.

## What is implemented

- The remote gateway uses the official MCP SDK Streamable HTTP transport with stateful MCP sessions.
- Unauthenticated requests return `401` plus OAuth protected-resource metadata discovery information.
- Static bearer tokens remain available for loopback development and tests only.
- Non-loopback hosting fails closed unless an HTTPS public URL, declared TLS termination, OAuth mode, and an injected bearer-token verifier are supplied.
- The tool list is generated from one versioned reviewed recipe registry. Each recipe carries input/output schemas, MCP risk annotations, authority class, read/write class, and preview/approval requirements.
- The Foundry client exposes one additional fixed `connector.profile` operation. It returns a redacted no-write runtime profile only after the existing exact-world/elected-active-GM boundary passes.
- The gateway adds `connector.profile` and `connector.attestation`, which join the package manifest/ES-module source hashes to the current runtime profile. Loaded-byte identity is deliberately not claimed by this local slice.
- `npm run foundry:connector-smoke` copies the module manifest/entry to an isolated temporary staging directory, compares source/staged hashes, exercises a fake exact runtime profile, verifies the attestation, and writes a local receipt.

## Local verification

```powershell
npm test -- --run tests/dicebox-foundry-connector-contract.test.ts tests/dicebox-foundry-remote-gateway.test.ts tests/foundry-live-bridge.test.ts
npm run foundry:connector-smoke
```

The smoke receipt is local evidence only. It does not prove a live Foundry connection, browser authentication, Desktop Commander account binding, public OAuth/TLS deployment, loaded module bytes, native document mutation, or Ready-to-Play.

Closure evidence: the focused connector/control-plane regression set passed 113/113 tests after updating the registry and KB-summary expectations; package build, tooling verification, syntax checks, workflow check, and KB rebuild/verification also passed. The full-suite audit still contains unrelated pre-existing dirty-tree snapshot mismatches in the M1259 artifact spec, served-worker receipt, and Regionwright staged fixture; those files were preserved and are not part of this slice.

## Local gateway

```powershell
$env:DICEBOX_REMOTE_BRIDGE_TOKEN = "use-a-long-random-local-token"
$env:DICEBOX_REMOTE_BRIDGE_HOST = "127.0.0.1"
$env:DICEBOX_REMOTE_BRIDGE_PORT = "8798"
npm run foundry:remote-gateway
```

For a real internet-facing deployment, put the gateway behind a TLS/authentication proxy and inject a verifier through the host application. The command-line launcher intentionally refuses direct non-loopback static-token hosting.

The connector still excludes arbitrary macro text, scripts, shell commands, raw sockets, generic document RPC, and public execute-as-GM operations. Write recipes remain preview → approval → exact active-GM execution → authoritative reread operations.
