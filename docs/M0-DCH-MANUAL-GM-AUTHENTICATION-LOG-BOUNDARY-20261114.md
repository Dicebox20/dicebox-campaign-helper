# DCH M0 — historical vs current disposable-v3 Gamemaster authentication evidence

Date: 2026-11-14 UTC. Scope: **DiceBox Campaign Helper and its own Foundry disposable v3 fixture only**. Regionwright is a different project, not included.

## What was observed

Exact local disposable fixture: work/foundry-fixture-data-v3, world dbx-test-world, Foundry 14.367 / D&D5e 5.3.3, HTTP port 30002. DCH module 0.1.15 is staged in the fixture. Static byte identity and a listening HTTP port do NOT establish currently enabled or browser-executed DCH module code.

Bounded read-only review of the local JSONL debug logs established:

| Log (server-local timestamp) | Redacted observation |
| --- | --- |
| Logs/debug.2026-08-27.log, since 2026-08-01 00:00:00 | One successful Gamemaster authentication log event, 2026-08-27 09:50:43 |
| Logs/debug.2026-11-13.log, since 2026-11-13 00:00:00 | No matching Gamemaster authentication-success event in that selected log |

The August event is HISTORICAL authenticated account contact only. It does not prove the account is still available, an active session in November, elected active GM, enabled DCH module, or loaded bytes. No November event is also NOT proof that no GM account or other authenticated session exists.

The historical DCH knowledge database records different-fixture owner-assisted logins: trial T-160 records v2 authenticated Gamemaster contact; T-M1223-EXACT-V4-USER-ASSISTED-MANUAL-GM-AUTHORIZATION requires MANUAL owner authentication, not agent credential entry. Those v2/v4 records do not prove a currently authenticated v3 GM.

## Reproducible read-only check

New source: tools/check-m0-dch-manual-gm-auth-log.mjs.

The owner supplies an explicit absolute local Foundry JSONL debug.YYYY-MM-DD.log path and a server-local cutoff YYYY-MM-DD HH:mm:ss:

    node tools/check-m0-dch-manual-gm-auth-log.mjs --log "ABSOLUTE_DEBUG_LOG_PATH" --since-local "2026-11-13 00:00:00"

The tool reads up to 12 MiB / 120,000 rows, counts exact User authentication successful for user Gamemaster log messages, and emits count and last server-local timestamp only. It NEVER prints input path, user identity, IP address, session ID, cookie or credentials. It rejects malformed logs, invalid file paths and ambiguous cutoff values. It never logs in, starts/stops Foundry, edits game settings, accesses the User database, or sends bridge requests.

Even a positive result is evidenceClass UNTRUSTED_HISTORICAL_LOG_EVENT_ONLY, authenticatedGmSessionNowVerified false, electedActiveGmVerified false, loadedDchModuleVerified false, chatGptCallerAuthenticated false, noFoundryWrite true and M0 NOT_ACCEPTED, 0/8. It parses log text, not independent origin authenticity.

## Next authorized runtime step

The owner manually signs in using Foundry's normal /join UI for exact disposable dbx-test-world. No agent automation of login, User selection or credentials. Once legitimately joined, the owner uses tracked tools/observe-m0-dch-gm-client.js (PR44/47) inside the same game tab to report exact pinned world and current/elected active GM and DCH module status. The optional PR46 offline checker tools/check-m0-dch-client-observation-format.mjs can validate and redact that private browser report. It is CLIENT_ONLY, not independent host authentication.

Only after current elected GM and DCH module active state are observed should independent authenticated host caller and loaded DCH byte attestation proceed. Local MCP host still trusts a client-supplied isGM flag. Stable issue identity and complete lifetime same-class fix-attempt ledger are UNKNOWN. Separate CODEX-GUARD-001 remains UNKNOWN/3. This log-only tool authorizes NO host auth code change.

Run: node --test tools/check-m0-dch-manual-gm-auth-log-self-test.mjs

12 synthetic tests cover historic success, current no-event, wrong user, failed login, simulated message, cutoff, malformed log, and CLI redaction.

**DCH M0 remains NOT_ACCEPTED, 0/8 independently verified.**
