# DCH M0 - private GM client observation format gate

Date: 2026-11-13. Source main: 48868610c3d5f9fd19fe3b974d754b5dbc348033, including merged PR #44.

Scope: DiceBox Campaign Helper (DCH) Desktop and its own Foundry module only. Regionwright is a separate project.

## Purpose and proof boundary

PR #44 introduced a read-only browser-console observation for an already legitimately authenticated Foundry v14 game in exact disposable world dbx-test-world. It reports current User identity, elected GM, bounded User collection and the enabled DCH module, but can never prove independent host/ChatGPT caller authentication or browser-loaded module byte identity.

This new check takes a **locally saved JSON copy** of that browser report and validates only its SHAPE. It rejects unexpected sensitive fields, mismatched world/current GM/module, unknown versions or elevated security claims. It intentionally emits **only non-identifying boolean/status flags**, never User IDs/names, private game data, or the input path. A synthetic/forged report can pass format validation; this tool **does not authenticate its origin**. A pass must NOT be entered as an M0 accepted criterion.

Run from the clean DCH repository:
node tools/check-m0-dch-client-observation-format.mjs "C:\private\path\owner-observation.json"

No argument returns BLOCKED_CLIENT_FORMAT/OWNER_CLIENT_REPORT_NOT_PROVIDED with exit code 2. An invalid, oversized (>16 KiB), unreadable, or blocked report also exits 2. A valid client-format-only report exits 0 but explicitly reports status VALID_CLIENT_FORMAT_NOT_AUTHENTICATED, evidenceClass UNTRUSTED_BROWSER_CLIENT_DATA, authenticatedFoundryGmByHost:false, authenticatedChatGptCaller:false, moduleLoadedByteHashVerified:false, m0Acceptance NOT_ACCEPTED, and verifiedM0Criteria 0.

The validator never modifies the saved input, world, Foundry account, module, DCH Desktop application, or credential store. It never makes a network request, authenticates a user, starts Foundry, or sends a Bridge message. It does not copy the raw private observation into Git history or public evidence.

## How to use when an actual authenticated session exists

1. The owner signs into the exact disposable world dbx-test-world using Foundry's supported login UI. If there is no legitimate active-GM session, stop; the result is UNKNOWN/BLOCKED, not a fabricated account.
2. The owner reviews and evaluates tools/observe-m0-dch-gm-client.js inside that existing game browser tab. It emits an object prefixed DCH M0 browser observation. Inspect it locally; do not share credentials, cookies or the raw report in a public repository.
3. Optionally save the JSON object, privately on the local computer. Run this format checker against that local file. It prints only redacted format flags.
4. Record separately the owner-authorized session provenance and proof of module-executed script bytes, then bind an independently authenticated desktop/ChatGPT caller. This local formatting step alone establishes none of those things.

## Tests and stop gates

node --test tools/check-m0-dch-client-observation-format-self-test.mjs

22 tests consume the actual PR #44 browser expression in a synthetic Node VM, including a positive format match, blocked observation, absent input, CLI output without User IDs/names, unexpected credentials, mismatched GM/world/module versions, excessive or duplicate User records, and improper claims of authenticated host or M0 acceptance.

DCH host currently trusts a client-supplied isGM flag; stable issue ID and full lifetime same-class attempt/fix history remain UNKNOWN. Independent CODEX-GUARD-001 remains UNKNOWN/3. This work is NOT a host-authentication change or a way around either stop gate.

M0 remains NOT_ACCEPTED, 0/8 independently verified.
