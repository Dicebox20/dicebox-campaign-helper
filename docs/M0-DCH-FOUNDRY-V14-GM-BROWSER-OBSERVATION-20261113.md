# DCH M0 - bounded current-client GM observation for disposable v3

Date: 2026-11-13. Source: Dicebox20/dicebox-campaign-helper main cf2efb716ee8cf9f18a27acc8b9ced621fb4feeb.
Scope: **DCH Desktop and its dicebox-campaign-helper Foundry module only. Regionwright is entirely separate.**

## Observation boundary

The owner-controlled source file tools/observe-m0-dch-gm-client.js is a read-only browser-console expression, to be evaluated ONLY inside an already-authenticated Foundry v14 game for the exact disposable dbx-test-world. It does not log in, create a user, extract credentials, write LevelDB, edit worlds, install modules, invoke the local MCP host, or communicate with ChatGPT.

It reads the documented public Foundry v14 API:
- game.ready, game.view, game.world.id, game.system.id/version and game.version
- game.user.id/name/role/isGM/isSelf/isActiveGM/active
- game.users.activeGM.id/name/role and game.users.contents (allowlist id/name/role only)
- game.modules.get("dicebox-campaign-helper").id/version/active

Official v14 API reference:
https://foundryvtt.com/api/v14/classes/foundry.Game.html
https://foundryvtt.com/api/v14/classes/foundry.documents.User.html
https://foundryvtt.com/api/v14/classes/foundry.documents.collections.Users.html

It blocks if not in the ready game view, world differs from dbx-test-world, version does not match Foundry 14/D&D5e 5.3.3, current user is not elected active role-4 GM, elected GM ID mismatches, module is inactive/not pinned 0.1.15, or User collection cannot be read. At most 50 User records may be emitted, with only id/name/role. No User credential fields.

Even a positive OBSERVED_CLIENT_ONLY result is a browser client report. It does NOT independently authenticate the local MCP host, ChatGPT caller, loaded Javascript SHA-256, or DCH self-development acceptance. The receipt is always M0 NOT_ACCEPTED.

## Owner-controlled future procedure

1. Only after legitimate owner sign-in to the exact disposable world, use the supported Foundry interface at http://127.0.0.1:30002/ to reach the game view. Do not guess/create a GM account, edit the user database, or bypass normal login.
2. Inspect the console object globalThis.game within that SAME authenticated browser tab. No new external process or credential disclosure is necessary.
3. Review and, if accepted, evaluate the exact local source of tools/observe-m0-dch-gm-client.js as a browser console expression. It accepts no input and makes no network request.
4. If BLOCKED, record the reason and preserve all unknowns. A blocked report does NOT prove no GM account exists.
5. If OBSERVED_CLIENT_ONLY, save the date, target, elected GM identity, allowlisted User records, and module status as CLIENT-ONLY evidence. Consider redacting player names/IDs before sending outside the owner's private workspace.
6. Separately establish independent host caller authentication and browser-executed module byte identity before any M0 criteria are promoted. A client-only report cannot satisfy those gates.

No real Foundry login, User observation, module activation or host-auth attempt was performed when developing this observer. The live GM session remains UNKNOWN.

## Verification and security gates

Run: node --test tools/observe-m0-dch-gm-client-self-test.mjs

The 23 synthetic checks include positive CLIENT-ONLY output, wrong world/system/version, non-GM and assistant users, elected-GM mismatch, missing or corrupt User collection, inactive/wrong DCH module, bound on User list, no mutation and thrown getters. These do not establish Foundry runtime operation.

DCH host currently accepts a client-supplied isGM hello. Stable host issue identity and lifetime same-class fix attempts remain UNKNOWN; independent Bridge CODEX-GUARD-001 attempts are separately UNKNOWN/3. This tool does not alter any host guard or grant authority.

DCH M0: NOT_ACCEPTED, 0/8 independently verified.
