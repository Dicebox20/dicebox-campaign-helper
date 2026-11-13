# M0 DCH: client-side GM observation without bypassing authentication

Date: 2026-11-13. Source: Dicebox20/dicebox-campaign-helper GitHub main cf2efb716ee8cf9f18a27acc8b9ced621fb4feeb.
Scope: the DCH Desktop app and dicebox-campaign-helper Foundry module only; Regionwright is a separate project and is excluded.

## Why this step exists

The disposable Foundry v14.367/D&D5e 5.3.3 world is dbx-test-world, served on local port 30002. DCH module dicebox-campaign-helper version 0.1.15 is installed as static files. Previous receipts proved module files exist and HTTP served bytes match source, but did not prove any authenticated user was logged in or that the module is active in the running world. The DCH host hello currently accepts a client-supplied isGM boolean; complete lifetime same-class fix attempts remain UNKNOWN, so this browser-only observer does not modify that guard or claim its authority.

Foundry v14 public API documents game.user, game.users.activeGM, game.user.isGM, game.user.isActiveGM, game.user.isSelf, game.world, game.modules and their active status:
- https://foundryvtt.com/api/v14/classes/foundry.Game.html
- https://foundryvtt.com/api/v14/classes/foundry.documents.User.html
- https://foundryvtt.com/api/v14/classes/foundry.documents.collections.Users.html

## Owner-controlled read-only workflow

1. Visit the disposable fixture only in a browser at http://127.0.0.1:30002. If the world is not running, stop: do not select a production world as a substitute.
2. Join dbx-test-world through Foundry's normal login UI using an owner-authorized GM account. No password, setup secret or session cookie belongs in an assistant chat or in an evidence receipt. If no account/session exists, report BLOCKED, not a fabricated GM or an instruction to modify the User database.
3. Once the actual Foundry game is fully loaded, open the browser's developer Console in that same logged-in game tab. Copy and paste the entire plain-JavaScript expression from tools/observe-m0-dch-gm-client.js and run it once. This is not an external network call or an install; the expression reads Foundry's existing game object.
4. A DCH M0 browser observation: log entry returns JSON. BLOCKED requires stopping before claiming a GM/session; it includes no User collection. OBSERVED_CLIENT_ONLY means this browser client reported a ready exact world, current active elected GM, valid bounded User collection id/name/role, and DCH module version 0.1.15 active. It does NOT prove independent host caller authentication, module JS loaded-byte SHA, or ChatGPT-end-to-end development.
5. The observation is local to the owner-controlled browser; if saving it, handle the bounded User id/name/role data as private. Future evidence review must bind it to the exact browser session and corroborate independently. Do not insert this result directly into the M0 register as an accepted criterion.

The existing DCH module also provides the GM-only Show DiceBox Runtime Evidence Diagnostics and DiceBox RuntimeProfile Diagnostic tools inside Foundry. Those are separate, read-only, package-owned diagnostic surfaces, and are available only when the module actually runs in the authenticated world. Their results can provide additional module-specific evidence but cannot cure host-side trust of client isGM by themselves.

## Guard conditions

The observer returns BLOCKED for missing/unready game, setup view, wrong world, wrong Foundry major/system/version, non-GM or assistant role, inactive/current non-self user, current/elected GM mismatch, inactive/wrong-version module, malformed or missing User collection, or unexpected runtime exceptions. It reads only the allowed User keys id, name, and role, caps the collection at 50, and does not access credentials, write to Foundry, call the DCH MCP bridge, send network requests, authenticate a user or provision accounts.

OBSERVED_CLIENT_ONLY always carries independentlyAuthenticatedHostCaller:false, authenticatedChatGptCaller:false, loadedModuleByteHashVerified:false and m0Acceptance:NOT_ACCEPTED. These are deliberately not inferred from a browser's own reports.

## Verification and next gate

Run: node --test tools/observe-m0-dch-gm-client-self-test.mjs. The fixture and all negative cases are synthetic, not an authenticated actual Foundry session. Live owner GM observation remains PENDING/UNKNOWN and must be collected separately.

The next authoritative gate is independently verified current/elected GM identity, the exact active DCH module, and trusted identity binding from the native desktop and ChatGPT caller to the module host. A listening port or source/HTTP-byte parity is insufficient. CODEX-GUARD-001 attempts remain UNKNOWN/3, and the DCH host isGM same-class lifetime history is UNKNOWN; no guard changes until provenance is established.

## Independently collected developer evidence

- Source manifest and the currently staged disposable module both report dicebox-campaign-helper version 0.1.15; the disposable world manifest reports dbx-test-world, dnd5e, coreVersion 14.367. PowerShell receipt dch-foreman-20261113-1556-exact-DCH-package-and-disposable-world-manifest-v001.
- Anonymous, cookie-free HTTP GET to local http://127.0.0.1:30002/ and /game each returned 302 to /join. That only shows that an anonymous HTTP client is directed to login; it does NOT prove no GM account exists. Receipt dch-foreman-20261113-1600-disposable-world-anonymous-client-HTTP-observation-v001.
- The GM console script syntax-checks and 25/25 synthetic positive/negative tests PASS. Receipt dch-foreman-20261113-1601-GM-observer-25-and-11-DCH-focused-tests-v001.
- Clean-source npm ci and production frontend build PASS. Receipt dch-foreman-20261113-1600-DCH-GM-observer-scope-npmci-build-v001.
- Eleven existing DCH host, module and desktop transport-focused tests PASS (2 + 4 + 5). M0 evidence integrity PASS with 0/8 independently verified, 10 M0 integrity self-tests PASS. Receipt dch-foreman-20261113-1601-GM-observer-25-and-11-DCH-focused-tests-v001.
- No real authenticated browser client GM observation was collected. Consequently no M0 accepted criterion is promoted.
M0 remains NOT_ACCEPTED, 0 of 8 independently verified.
