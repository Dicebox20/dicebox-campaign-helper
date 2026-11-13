# DCH M0: authenticated local connector bootstrap preflight

Date: 2026-11-13. Base source: GitHub main 0eaa5980ae0ed64ae39f1fd94da09c5a68880cd7, isolated owner/dch-m0-connector-readiness-20261113 worktree.

## Product boundary

The objective is ChatGPT-directed self-development of DCH Desktop and the accompanying DiceBox Foundry module: change, build, isolated install, authenticated active-GM observation, independent readback, and auditable correction. Regionwright is a separate project and explicitly OUT OF SCOPE for DCH development.

- Tracked desktop: apps/campaign-helper-desktop/.
- Tracked Foundry module: packages/dicebox-foundry/module.json (module dicebox-campaign-helper, version 0.1.15) and its unique src/entry-20260823-program-scene-v2.js entry importing ./module.js.
- Tracked local MCP host: tools/dicebox-foundry-live-bridge.mjs; tracked in-world WebSocket client: packages/dicebox-foundry/src/foundry-live-bridge.js.
- The local MCP host defaults to 127.0.0.1:8797 and world the-ballad-of-chauser-bill, not the disposable fixture v3 world dbx-test-world. Configure the exact target world explicitly for disposable tests; do not globally rewrite defaults.
- In-world bridge opt-in requires enableMcpTestBridge and enableVerificationHarness settings, identified elected active GM, current GM matching that active GM, and exact world match. Source presence does not prove these gates are met.
- The distinct optional HTTP remote gateway, recipe contract, auth helper, and simulated remote connector smoke exist as UNTRACKED files in the old dirty checkout but not clean GitHub main. They are not needed by the tracked local bridge; they are not an authenticated ChatGPT endpoint merely because local files exist.

## New repeatable preflight

Run: node tools/check-m0-dch-runtime-boundary.mjs

It reads only the DCH package manifest, entry, local MCP host and module client, then attempts one TCP handshake to local loopback port 8797. It does not issue a WebSocket operation, read credentials, authenticate a User, change a world, or infer active-GM status from an open TCP port. Exit code 2 intentionally means authenticated runtime is NOT proven, even if TCP is listening.

The preflight distinguishes OFFLINE from PORT_REACHABLE_NO_GM_PROOF, always reports BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN with authenticatedFoundryUsers NOT_OBSERVED and M0 NOT_ACCEPTED, and reports the SHA256 hashes of inspected DCH source files.

Actual local outcome: bridge OFFLINE, expected world the-ballad-of-chauser-bill, valid module entry, authenticated active GM NOT_OBSERVED, M0 NOT_ACCEPTED. Disposable Foundry fixture v3 remains stopped from the previous supervised run.

## Exact proof receipts

- Five local preflight self-tests PASS and real local preflight exit 2 OFFLINE: dch-foreman-20261113-dch-local-runtime-boundary-tests-and-real-v001.
- Six tracked DCH MCP host/client tests PASS across tests/dicebox-foundry-live-bridge-host.test.ts and tests/foundry-live-bridge.test.ts: dch-foreman-20261113-dch-connector-livebridge-focused-tests-v001.
- Production DCH desktop build PASS: dch-foreman-20261113-dch-connector-readiness-desktop-build-v001.
- An EPHEMERAL test of the UNTRACKED HTTP remote gateway returned public health HTTP 200, anonymous MCP HTTP 401 and connector.profile BLOCKED without a GM: dch-foreman-20261113-ephemeral-dch-connector-no-gm-gateway-proof-v002. This does not certify a remote gateway on GitHub main, any Foundry login, or a live runtime. No service was left running.

## Next M0 development proof

1. Establish a supported authenticated way for ChatGPT to invoke the tracked DCH local MCP host; if remote ChatGPT access is required, separately review and version the untracked optional remote gateway under source and authentication gates.
2. In an owner-approved DISPOSABLE DCH world, obtain authoritative current User/elected active-GM observation using supported Foundry authentication. No LevelDB modifications or assumed stored User IDs.
3. Set exact disposable world identity on both host and in-world bridge, and verify live bridge.status, harness.status, helper.readiness with authenticated active-GM response.
4. Continue through preview/approval, bounded DCH change/build/install, and exact runtime reread. Advance only independently verified Roadmap v2 M0 criteria.

No authenticated current GM handshake, Foundry User listing, ChatGPT-bound DCH MCP endpoint, active world/module confirmation, actual DCH runtime write/reread, or complete M0 acceptance was established. M0 remains NOT_ACCEPTED, 0 of 8 independently verified. Worker A map-lab fix-attempt lineage and Worker B caller-auth lineage remain UNKNOWN and are unaffected by this DCH-only work.