# Remote Foundry / Desktop Commander prototype

This prototype connects a typed Desktop Commander/Codex MCP caller to the existing DiceBox Foundry bridge when the caller and Foundry client are on different machines. It is intentionally limited to the current eight fixed tools.

## Local proof

Run the focused test suite:

```powershell
npm test -- --run tests/dicebox-foundry-remote-gateway.test.ts tests/foundry-live-bridge.test.ts
```

The test uses a fake Foundry connection. It proves authentication, exact hello-boundary validation, fixed-tool forwarding, and loopback compatibility; it does not connect to a live world.

## Prototype configuration

Start the gateway on the machine that can reach the Foundry client:

```powershell
$env:DICEBOX_REMOTE_BRIDGE_TOKEN = "use-a-long-random-prototype-token"
$env:DICEBOX_REMOTE_BRIDGE_HOST = "127.0.0.1"
$env:DICEBOX_REMOTE_BRIDGE_PORT = "8798"
npm run foundry:remote-gateway
```

Configure the Foundry module’s client-local settings with the gateway’s WebSocket URL and the same token. The default local bridge remains unchanged. The remote URL should be a `wss://` endpoint behind TLS when it crosses an untrusted network; the prototype gateway itself is plain HTTP/WebSocket and is not a production relay.

Desktop Commander should be pointed at the gateway’s `POST /mcp` endpoint with `Authorization: Bearer <token>`. The gateway forwards only the existing typed tool names. It does not accept macro bodies, scripts, arbitrary Foundry documents, raw world identifiers, or execute-as-GM requests.

Live use still requires the exact configured world, the elected active GM, the Foundry-side bridge settings, a trusted deployment, and an explicit runtime evidence gate. This document is not live certification.
