# DCH Turn 07 — Main Launcher Update Gate

**Status: SOURCE-ONLY PREPARATION — THE WINDOWS MAIN LAUNCHER HAS NOT BEEN UPDATED.**

## Correct launcher and source

The dated 2026-11-14 primary-source inventory `DCH_Source_Navigation_2026-11-14.md` identifies:

- `FOUNDATION`: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper` (continuity authority, **not** assumed Git checkout).
- `WORKSTATION`: `FOUNDATION\work\dch-workstation-layout-v001` (source of the actual running desktop application). Historical branch `dch/chatgpt-bootstrap-20261026`, HEAD `1baad152776bd137cd2138b62a2a1078eea4de1e`, three tracked changes at evidence cut. **Current revision and dirty state not checked**.
- `LIVE_EXE`: `WORKSTATION\apps\campaign-helper-desktop\src-tauri\target\release\dicebox-campaign-helper-desktop.exe` (actual prior running executable). Historical SHA-256 `363439c044b31b79bc212dde85580551e2f7c262269326a5182ca55c7977f9c5`, last modified Oct 27. **Not a current live hash.**
- `PR50`: `C:\Users\rujie\Documents\Codex\2026-08-20\dch-m0-pr50-fresh-main-verify-20261114`, disconnected history; rebuilding it does **not** update `LIVE_EXE`. No common Git merge base was found between `WORKSTATION` and `PR50` in the inventory.
- This review branch `foreman/dch-ai-first-integration-20261117` holds standalone source-only v14 Foundry candidates. These are **not installed** or incorporated into `WORKSTATION`.

## Repeatable release checklist (single canonical writer)

1. **Audit:** From the existing authorized Windows writer, run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools\dch-main-launcher-audit.ps1` with the script copied/reviewed into the canonical work path. The script is read-only; collect its JSON, exact executable hash, running process path, Git HEAD, dirty/tracked counts, and timestamp. A hash match alone never proves build provenance.
2. **Reconcile source:** Resolve the canonical writer/lease and actual `WORKSTATION` dirty source before editing. Preserve all working-tree changes and unknowns. In particular, compare the previous Foreman's uncommitted native Rust/desktop ChatGPT integrations with the currently running workstation source. Do not `reset`, `stash`, or blindly merge `PR50` or this feature branch into workstation.
3. **Build candidate:** In an isolated copy derived from the *verified* workstation source snapshot including reviewed edits, run the known-good TypeScript, Rust and desktop release commands established by the workstation source (do not assume PR50 commands are identical). Record exact commands, exit codes, commit, dirty-source digest, full candidate binary SHA-256 and compile dependencies. Preserve existing release EXE while tests run.
4. **Security and functionality:** Check selected ChatGPT account sign-in, versioned typed tool catalog, provenance and approval gating, no unknown tools, current project/scene/revision, normal chat routing, no fake success, all tested with a disposable campaign. The app's older no-tools prompt must not be mistaken for the new functionality. Do not make claims of live model execution without receipt.
5. **Authorized release cut:** Only after the canonical writer confirms an exclusive release window, backup the previous EXE **and its required runtime sidecars**; exit the application cleanly, stage and hash-check the candidate; replace the release artifact using the reviewed workstation install process; reopen the actual main launcher; independently reread process path, binary SHA, desktop interface, login and native tool readiness. Restore the original verified backup if post-launch verification fails.
6. **Evidence and continuation:** Record the source identity, build log, original/replacement hashes, exact running executable path, launch/readiness and approval receipt, rollback result, and any verified Foundry integration separately. Update the governing release ledger, not a competing roadmap. A successful browser-only UI test or source-only Foundry test does not prove launcher installation or real player view.

## Turn 07 action and limits

- A read-only Windows PowerShell launcher-audit script and three static Node contract checks were added to the isolated feature branch; these tests **do not execute PowerShell or inspect Windows**.
- Attempted Bridge PowerShell inspection returned `A canonical relay writer already owns this data directory; MCP host refused.` No Windows source, launcher, process, installed module or owner world was mutated.
- Previously staged Worker A/B reviews and Switchboard continuation messages remain unverified as live Codex transcript turns. Avoid resending them without reconciliation.
- M0 remains **NOT_ACCEPTED (0/8)**. Launcher state remains **UNKNOWN** until the release-path executable is inspected and tested directly.

## Next slice

Reconcile the one canonical writer with the exact active Codex session. Use the read-only audit to prove which binary is actually running, independently review the dirty workstation code, safely build and stage a new candidate from that source, and only then upgrade the real main launcher with a reversible release receipt. The AI-first Foundry compiler branch should be integrated deliberately after that source-tree mapping.