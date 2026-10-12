# DiceBox: Desktop Commander Foreman workflow (local fallback)

**Status:** On-demand + scheduled offline preflight installed and tested. Task `DiceBox-Offline-Preflight-15m` runs every 15 minutes when the Windows user is logged in. This is NOT automatic ChatGPT continuation.

## Purpose and scope

Continue safe DiceBox Campaign Helper fixture work if Dicebox Bridge is down. The connected
Remote Desktop Commander device may read files, edit approved project tools, and run bounded
Node or PowerShell checks. It is NOT an autonomous assistant scheduler, and a local script
cannot by itself send a new ChatGPT turn or attest a Codex Bridge delivery.

Do not start live Foundry `dbx-test-world` unless its blank-password Gamemaster login and
wildcard port-30005 listener have been addressed by a separately proven isolation plan.
Do not touch production Foundry, F1/T3/F2, puzzle ledger, Ret/Meow/CL50, Windows Firewall,
or committed teleports without separate gates.

## Automated, repeatable OFFLINE check (available now)

From the connected computer:

```powershell
Set-Location 'C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper'
node .\tools\clscale-fixture-readonly-preflight.mjs --save
```

It exits 0 only when all checks pass; failures exit 1 with a JSON report.
It verifies the target world/core/system versions, confirms port 30005 has no TCP listener,
checks 39 enabled module manifests and 19 declared required package links, 21 Scene IDs, embedded record counts, 119 Region script
parse checks (WITHOUT execution), actor references, and SHA-256 of 40 referenced image files.
It never starts the world, executes a Region behavior, or authorizes a teleport.

Latest report (not stored in the Foundry dataPath):
`work\clscale-central-lodge-migration-v001\fixture-readonly-preflight-latest.json`

Append-only run history: `work\clscale-central-lodge-migration-v001\fixture-readonly-preflight-history.jsonl`

**Never schedule the script to execute on a live fixture.** Its deliberate port-stopped gate
would fail, which is useful evidence that offline validation must halt.

## Automating runs

1. **Interactive ChatGPT/Remote Desktop Commander:** instruct the assistant to run the
   exact command, inspect the report, and update a Foreman checkpoint. Its agent must be
   online and the AI conversation must actively call the tool.
2. **Deterministic unattended checks via Windows Task Scheduler:** optionally create a
   scheduled task running `node.exe` with argument
   `"<full-repo-path>\tools\clscale-fixture-readonly-preflight.mjs" --save`.
   Use the current unprivileged account, one instance only, a finite timeout, and a
   periodic trigger only after user approval. Windows then runs the check independently
   of ChatGPT, but it does NOT autonomously send messages into ChatGPT.
3. **True autonomous coding:** requires a separate local agent/orchestrator (for example,
   an authorized Codex CLI workflow) that consumes bounded work units, has durable
   checkpoint/lease state, runs tests, observes denylisted targets, and sends verified
   continuation messages through a working communication transport. Desktop Commander
   provides filesystem/process access, not these scheduling and message-delivery guarantees.

**Installed:** Mode 2 now runs the exact preflight every 15 minutes, using the logged-on account
`rujie`, limited permissions, a single-instance fence, and a two-minute execution limit.
The first Task Scheduler run returned result `0`, and the saved JSON report was `OFFLINE_PREFLIGHT_PASS`.
No autonomous coding runner (mode 3) has been installed. A failure leaves a report; it does not
restart Foundry or notify ChatGPT.

To inspect or stop the scheduled checks:

```powershell
Get-ScheduledTask -TaskName 'DiceBox-Offline-Preflight-15m'
Get-ScheduledTaskInfo -TaskName 'DiceBox-Offline-Preflight-15m'
Disable-ScheduledTask -TaskName 'DiceBox-Offline-Preflight-15m'
```

The task uses a once-trigger with 15-minute repetition and a long finite duration.
It runs only in an interactive login session, not as SYSTEM and not with a stored password.
Do not schedule actual Foundry gameplay, teleports, or production edits.

## Useful official references

- Remote Desktop Commander setup and foreground-agent lifecycle:
  https://github.com/desktop-commander/remote-desktop-commander/blob/main/docs/SETUP.md
- Remote MCP supported process and file tools:
  https://github.com/desktop-commander/remote-desktop-commander/blob/main/README.md
- Desktop Commander prompt library (reusable workflows):
  https://desktopcommander.app/library/
- Microsoft Task Scheduler registered tasks:
  https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/new-scheduledtask
- Remote Desktop Commander security guidance:
  https://github.com/desktop-commander/remote-desktop-commander/blob/main/SECURITY.md
