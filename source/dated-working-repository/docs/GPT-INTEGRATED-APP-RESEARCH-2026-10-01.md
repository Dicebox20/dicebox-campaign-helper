# GPT-Integrated Campaign Helper Research Pass 1

Date: 2026-10-01
Scope: shortcut-oriented research for redesigning the standalone Campaign Helper so ChatGPT is the primary in-app controller and Codex is escalation-only.
Status: research only; no dependency, runtime, provider, Foundry, or campaign mutation was performed.

## Research conclusion

The shortest credible path is to add a ChatGPT agent loop inside the existing Tauri desktop app and expose the Campaign Helper's operations as typed application tools. The app should own tool implementation, target checks, approvals, execution, authoritative rereads, receipts, and recovery. ChatGPT should own conversation, intent interpretation, tool selection, and continuation. Codex should remain a bounded escalation tool for work the integrated agent cannot complete.

The project does not need a new general-purpose desktop-control dependency for the first slice. Star*Tup and Desktop Commander are useful design references for transport, process sessions, progress, and auditability; their broad command surfaces should not become Campaign Helper authority.

## Reusable templates and tools

| Candidate | What it shortcuts | Fit for DiceBox | Decision |
| --- | --- | --- | --- |
| OpenAI Agents SDK for TypeScript | Agent loop, tools, sessions, guardrails, human review, tracing | Strong fit for an app-owned Node/TypeScript runtime; keep tool implementations in the Campaign Helper | Candidate primary runtime |
| OpenAI Responses API function calling | Smallest direct tool-call loop; app receives calls, executes tools, returns outputs, and continues | Strong fit for the first vertical slice if we do not need SDK orchestration yet | Candidate minimal prototype |
| OpenAI ChatKit starter/advanced samples | Reusable chat UI, widgets, tool-invocation display, file attachments | Useful only if rebuilding the current React chat panel is more work than adapting the component; not required for the authority layer | Optional UI shortcut |
| OpenAI MCP server/UI quickstart and MCP Inspector | Standard tool boundary and local inspection workflow | Useful for exposing a portable Campaign Helper tool server to ChatGPT, Codex, or other hosts; direct in-app tools remain simpler for the first slice | Optional adapter boundary |
| OpenAI Agent Skills | Reusable instruction bundles and scripts | Useful for campaign-authoring routines and development procedures; does not replace typed authority checks | Candidate later |
| Star*Tup PowerShell Relay | Exact ChatGPT target binding, bounded markers, monitored tasks, progress, durable state, duplicate suppression, outcome-unknown handling | Strong inspiration for a local executor/receipt layer; current relay is a command relay, not MCP, and is not intrinsically safe | Reuse patterns, do not make it the authority layer |
| Desktop Commander MCP | Tool grouping for files, terminal, process sessions, search/edit, and local audit history | Strong ergonomics reference; broad terminal/file access and user-permission execution are too open for direct Campaign Helper authority | Inspiration or isolated maintenance aid |
| Windows Commander MCP | Prebuilt Windows desktop/process/UIA/PowerShell capabilities with confirmations and audit cues | Potential calibration/recovery aid, but too broad for the product's core tool surface | Optional external diagnostic aid |

## Official findings

OpenAI function calling already defines the desired control loop: the model requests a typed tool, the application executes it, returns structured output, and the model continues. The application remains the place where actions actually happen.

The Agents SDK is intended for code-first applications where the application owns deployment, tool implementations, state storage, and approval decisions. That maps well to the existing Tauri plus Node architecture and avoids treating a generic shell as the product API.

ChatKit supplies an embeddable chat surface and starter repositories, but it is a presentation shortcut rather than a replacement for the Campaign Helper's command, proposal, approval, and receipt model. The current React panel may be cheaper to extend than to replace.

MCP is valuable when the same capabilities must be available from several hosts. The MCP Apps quickstart and Inspector provide a ready-made server/UI/testing pattern. For the Campaign Helper, MCP should wrap the typed capability registry rather than bypass it.

OpenAI's local-shell and self-hosted-environment paths show how a model can request local work, but they also reinforce the need for host-side sandboxing, allowlists, logging, and explicit environment ownership. Arbitrary PowerShell should therefore remain an implementation detail behind fixed, typed capability tools.

The ChatGPT-plan/Codex app-server route has a different capability contract from a normal API Responses/Agents integration. It should not be assumed that every Responses tool or Agents feature is available through the existing subscription transport. The runtime choice must be made explicitly during redesign.

## Local baseline

The repository currently contains the Codex App Server transport and a narrow no-write Campaign Director proposal flow. Its root package manifest includes `@openai/codex` and `zod`, but not `@openai/agents`, `openai`, ChatKit, or the MCP SDK. The current managed Campaign Director route is therefore not yet a general ChatGPT-controlled application runtime.

The Star*Tup adapter is outside the repository at `C:\Users\rujie\Documents\Codex\2026-09-25\build-a-personal-windows-only-adapter\outputs\ChatGPT-PowerShellAdapter.ps1`. The repository's local directions explicitly classify it as a command relay rather than an MCP server and require exact-target, read-only, bounded scans. Its durable-state and verification patterns are valuable, but the adapter should not receive unrestricted Campaign Helper authority.

Desktop Commander was not found in the Campaign Helper package manifests or source tree. The upstream project demonstrates a useful capability taxonomy—terminal sessions, process management, filesystem operations, search/edit, and audit history—and offers MCP-compatible local and remote modes. Its own configuration model makes clear that broad terminal execution is separate from filesystem directory limits, so it should remain inspiration rather than a dependency.

## Shortcut-oriented design recommendation

1. Keep the existing Tauri/React shell and current conversation persistence.
2. Add one typed `CampaignHelperTool` registry in the application/Node boundary.
3. Start with read-only tools: `kb.query`, `project.inspect`, `runtime.status`, and `calibration.observe`.
4. Add a single Responses or Agents SDK continuation loop that can call those tools and consume receipts.
5. Add preview/approval-gated mutation tools only after the read-only loop has authoritative reread behavior.
6. Wrap fixed Node and PowerShell routines behind named tools; never expose raw shell text as the product contract.
7. Make Codex an explicit `escalate_to_codex` capability with a bounded objective, isolated workspace, and reviewable receipt.
8. Add an MCP adapter only when cross-host use is needed; it should call the same registry used by the desktop agent.

## Evidence limits

This is a research and static-inspection pass. No package was installed, no provider call was made, no relay command was executed, no browser or Foundry runtime was controlled, and no claim is made about live compatibility or certification.

## Sources

- [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents/sdk)
- [OpenAI guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
- [OpenAI ChatKit](https://developers.openai.com/api/docs/guides/chatkit)
- [OpenAI MCP server and UI quickstart](https://developers.openai.com/plugins/build/app-quickstart)
- [OpenAI local shell](https://developers.openai.com/api/docs/guides/tools-shell)
- [OpenAI self-hosted environments](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
- [OpenAI ChatKit starter app](https://github.com/openai/openai-chatkit-starter-app)
- [OpenAI Agents SDK for TypeScript](https://github.com/openai/openai-agents-js)
- [OpenAI ChatKit advanced samples](https://github.com/openai/openai-chatkit-advanced-samples)
- [Desktop Commander MCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)
- [Windows Commander MCP](https://github.com/exalsch/windows-commander-mcp)
- Local relay directions: `docs/CHATGPT-POWERSHELL-BRIDGE-SCAN-DIRECTIONS.md`
