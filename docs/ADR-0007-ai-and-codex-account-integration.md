# ADR-0007: AI Roles and Codex Account Integration

Status: accepted; reconciled 2026-08-24 with subscription-primary and API-key-backup provider order.

## Context

DiceBox needs semantic assistance and technical automation without turning agent messages into runtime authority. The earlier design routed ordinary Campaign Director requests only through a separately billed Responses API key while using managed ChatGPT authentication only for technical Codex jobs. That left the product blocked when the API account had no credits even though the user had ChatGPT/Codex subscription access.

Official OpenAI documentation identifies Codex App Server as the deep product-integration interface for authentication, conversation history, approvals, and streamed events. Its account surface supports both managed ChatGPT and API-key authentication, reports the active auth mode and plan, and exposes ChatGPT rate-limit and usage reads. OpenAI authentication guidance distinguishes ChatGPT sign-in for subscription access from API-key sign-in for usage-based access at standard API rates.

## Decision

Use one supervised Codex App Server connection as the primary AI transport for both:

- **Campaign Director:** bounded project explanation, inspection, retrieval, and strict typed command proposals.
- **Codex Technical Builder:** conditional repository, adapter, migration, build, and test jobs in isolated declared scopes.

The two roles share authentication and transport, but never authority or tools. Campaign Director runs with no repository/runtime mutation capability and emits only validated proposal envelopes. Technical Builder receives a versioned technical job, explicit sandbox/approval policy, and returns a reviewable patch/receipt. The deterministic application owns project state, validation, preview, approval, execution, reread, and recovery.

Retain the existing OpenAI API-key/Responses adapter and OS credential store as an explicit **backup provider**. The user must select it deliberately; the application must show that it uses separate usage-based billing. It may not activate automatically when subscription limits are reached. A live API-key call is not required for the primary provider gate.

Image-provider credentials remain separate because image services have independent APIs, capabilities, limits, and billing.

Use App Server managed browser or device-code ChatGPT authentication. Read account, plan, rate-limit, and usage metadata through supported App Server methods. Do not scrape cookies, copy authentication caches as the normal product flow, control browser profiles for authentication, inject external tokens, proxy undocumented endpoints, or automate the Codex UI.

## Consequences

- Add a provider orchestrator with three explicit states: ChatGPT subscription, API-key backup, and AI offline.
- Add one versioned App Server lifecycle/client boundary with streamed events, cancellation, account metadata, rate-limit/usage display, approvals, and redacted diagnostics.
- Route both AI roles through typed application-owned schemas and separate policy/tool profiles.
- Preserve the existing native API-key credential commands and strict Responses proposal adapter as fallback implementation.
- Never expose credentials, silently change billing modes, or serialize account secrets into projects/receipts.
- Preserve full deterministic editor functionality without any AI connection.
- Pin the App Server compatibility adapter and test exact installed protocol behavior before promotion.

## Validation boundary

This ADR is satisfied only when the managed ChatGPT route produces one streamed, typed, no-write Campaign Director proposal with cancellation/refusal/stale-state/redaction coverage and current account/limit metadata. The API-key path must pass deterministic envelope-equivalence and secret-boundary checks, but live API billing remains optional and user-initiated.

## Primary references

- [Codex App Server](https://learn.chatgpt.com/docs/app-server)
- [OpenAI authentication](https://learn.chatgpt.com/docs/auth)
