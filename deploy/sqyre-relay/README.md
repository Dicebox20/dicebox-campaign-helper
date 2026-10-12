# Sqyre remote relay deployment

Sqyre hosts the Foundry world and stores the module. The relay runs separately. The active GM browser in Sqyre opens an outbound WebSocket to the relay, while ChatGPT uses the relay's HTTPS `/mcp` endpoint as a custom MCP plugin. The future DiceBox Campaign Helper App can reuse the same endpoint.

This profile deliberately does not require, or assume, a custom Node process inside Sqyre.

## Configuration

1. Copy `.env.example` to `.env` and keep `.env` private.
2. Set `RELAY_DOMAIN` and point DNS at the relay host.
3. Configure an OIDC provider for the MCP client. Set its issuer, audience, and JWKS URL. The provider must issue a bearer token whose issuer and audience match these values.
4. Replace `DICEBOX_FOUNDRY_CLIENT_TOKEN` with a separate random pairing token. This is entered only in the Foundry client setting.
5. Set `DICEBOX_FOUNDRY_ORIGIN_HOSTS` to the exact hostname shown while the Sqyre Foundry game is open. Do not use a broad suffix unless the hosting provider documents a stable origin.

## Run

```powershell
Copy-Item .env.example .env
docker compose up -d --build
Invoke-WebRequest https://relay.example.com/healthz
```

Caddy terminates HTTPS and forwards both `/mcp` and `/dicebox-foundry`; its reverse proxy supports the WebSocket upgrade used by the Foundry module.

## Sqyre module settings

After uploading the built DiceBox module to Sqyre and enabling it for the target world, configure the active GM client with:

- Remote relay WebSocket URL: `wss://relay.example.com/dicebox-foundry`
- Foundry relay pairing token: the exact value of `DICEBOX_FOUNDRY_CLIENT_TOKEN`

The module still requires the existing verification-harness, private-bridge, exact-world, elected-active-GM, and native preview/approval gates. A successful socket connection is not execution authority.

## ChatGPT custom MCP plugin

In ChatGPT on the web, choose **Plugins -> Add custom MCP server**, enter `https://relay.example.com/mcp`, configure OAuth for the OIDC provider, accept the risk prompt, and create/install the plugin. Start with `dbx_foundry_connector_profile` or `dbx_foundry_helper_readiness`; the relay exposes only the reviewed DiceBox recipe registry. See [ChatGPT Foundry plugin](../../docs/CHATGPT-FOUNDRY-PLUGIN.md).

The same `/mcp` endpoint is intentionally client-neutral, so a future DiceBox Campaign Helper App can use it without a second relay protocol.

## Optional Playwright browser path

For visible Sqyre/Foundry UI evidence, run the upstream Playwright MCP server on the Desktop Commander computer and attach it to the manually selected logged-in browser tab through the Playwright extension. This is a separate ChatGPT MCP plugin path:

`ChatGPT -> authenticated Playwright MCP endpoint -> Desktop Commander browser -> Sqyre Foundry UI`

Use [playwright-mcp.config.example.json](./playwright-mcp.config.example.json) and run `npm run playwright:path:check` from the repository. Keep the server on `127.0.0.1:8931`, replace the placeholder with the exact Sqyre origin, and use a named HTTPS tunnel or reverse proxy with authentication if ChatGPT must reach it remotely. The raw Playwright port must not be published. Do not automate login, export cookies/storage state, enable arbitrary Playwright code evaluation, or use this browser path as module-operation authority; the typed DiceBox `/mcp` relay remains the path for diagnostics, previews, approvals, and bounded operations.

## Local-computer tunnel variant

Instead of Docker/Caddy on a VPS, run the gateway on the Desktop Commander computer bound to `127.0.0.1:8798` and publish that port through a named HTTPS tunnel. Keep the same OIDC settings, Foundry pairing token, exact Sqyre origin allowlist, and public `DICEBOX_REMOTE_PUBLIC_BASE_URL`. Do not use an unauthenticated quick tunnel for a live world.

No Sqyre login, module upload, public deployment, or live-world connection is performed by the repository smoke tests.
