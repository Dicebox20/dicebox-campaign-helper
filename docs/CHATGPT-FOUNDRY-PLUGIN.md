# ChatGPT Foundry plugin

The DiceBox relay is a custom MCP server that ChatGPT can add as a plugin. ChatGPT connects to the relay; the relay connects to the Foundry module in the active GM browser. The future DiceBox Campaign Helper App can reuse the same `/mcp` endpoint.

This repository does not contain a separate legacy plugin manifest. The supported setup is ChatGPT's **Add custom MCP server** flow:

1. Deploy the relay at a public HTTPS host, or use a supported Secure MCP Tunnel. The MCP URL is `https://<relay-host>/mcp`.
2. Configure the relay's OIDC issuer, audience, JWKS URL, and separate Foundry pairing token locally. Never paste secrets into ChatGPT or commit `.env`.
3. In ChatGPT on the web, open Plugins, choose **Add custom MCP server**, enter the relay `/mcp` URL, configure OAuth, accept the risk prompt, and create the plugin.
4. Install the resulting plugin and run a read-only first probe such as `dbx_foundry_connector_profile` or `dbx_foundry_helper_readiness`.
5. Use the plugin only for the fixed DiceBox tool registry. Preview and approval are required before writes; a successful tool response is not proof that Foundry committed a change.

The MCP initialize response includes the server's safety and sequencing instructions, and tools expose read-only, preview, or write annotations for ChatGPT's confirmation UI. The module still requires the exact-world, elected-active-GM, native preview/approval, and authoritative reread gates.

## Optional Playwright browser path

Playwright is a companion browser client, not a replacement for the typed DiceBox relay:

`ChatGPT -> Playwright MCP on the Desktop Commander computer -> selected browser tab -> Sqyre/Foundry UI`

Use this path for visible page inspection, accessibility snapshots, console/network evidence, screenshots, and browser-side diagnostics. Keep module diagnostics, previews, approvals, and bounded operations on the DiceBox `/mcp` plugin path.

The checked-in template is [playwright-mcp.config.example.json](../deploy/sqyre-relay/playwright-mcp.config.example.json). It uses the upstream `@playwright/mcp` server in extension mode, binds its HTTP endpoint to `127.0.0.1:8931`, allows one exact browser origin placeholder, enables only the core capability, and disables unrestricted file access and shared browser context. Run the local policy check with `npm run playwright:path:check`.

When you later configure it on the Desktop Commander computer:

1. Install the upstream Playwright MCP server and browser extension locally, then log into Sqyre manually in the browser tab you intend to use.
2. Replace the example origin with the exact Sqyre origin. Do not commit browser credentials, cookies, storage state, or a persistent profile path.
3. Start the Playwright MCP server on loopback with the template. For remote ChatGPT access, publish it only through a separately authenticated named HTTPS tunnel or reverse proxy; never expose the raw Playwright port.
4. Add the authenticated Playwright MCP HTTPS endpoint as a second ChatGPT custom MCP plugin. Use it for browser observation only; do not enable arbitrary Playwright code evaluation or treat a browser response as Foundry commit evidence.

The upstream project explicitly warns that Playwright MCP is not a security boundary. Its browser session may be logged in, so the outer tunnel/client authorization and the exact origin policy are mandatory. No Playwright server, extension, browser session, tunnel, or live Foundry page is installed or contacted by this repository slice.

## Current boundary

The local plugin-compatibility slice proves the MCP initialization metadata and documentation only. It does not install the plugin in a ChatGPT account, provision an OAuth provider, publish a relay, upload the module to Sqyre, authenticate a browser, or connect to a live Foundry world.
