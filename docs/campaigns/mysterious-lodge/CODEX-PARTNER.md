# Persistent Codex Partner: The Mysterious Lodge

**Role:** separate Codex CLI collaborator started via PowerShell. Not a new ChatGPT UI chat, and not a replacement for the campaign Foreman or owner decisions.

## Verified identity

- Session ID: `01a128f9-b5f8-7340-a5b6-c2038edb1341`
- Working root: `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper`
- First session: read-only sourced answers to twelve cold-start questions; examiner gave 11/11 critical and 1/1 optional PASS. This was a Codex CLI recovery test, not a fifth ChatGPT UI conversation.
- Same-session resume verified: a later `codex exec resume` returned the same UUID and correctly identified the E4 hound eye, U2 portrait eye, and undecided ritual aftermath.
- Permission: READ-ONLY collaboration until a separately authorized and safely gated development assignment. No automatic runner, background task, or Foreman delegation is enabled.

## Resume the exact partner via PowerShell

```powershell
& "$env:APPDATA\npm\codex.cmd" exec resume "01a128f9-b5f8-7340-a5b6-c2038edb1341" -c 'sandbox_mode="read-only"' "Review the next bounded Mysterious Lodge question from current repository evidence. Remain read-only."
```

Replace only the last prompt for the next task. Always use the exact ID, not `--last` (which might resume an unrelated session). A new `codex exec` without `resume` creates another conversation.

## Evidence receipts

Stored under `work/clscale-central-lodge-migration-v001/cold-start-recovery-20261010/`:
- `persistent-codex-partner-launch.json` records session UUID.
- `persistent-codex-partner-first-response.md` contains C01-C12 source-grounded answers.
- `persistent-codex-partner-resume-receipt.json` proves exact-session continuation.
- `persistent-codex-partner-resume-answer.md` contains the successful continuation.
- `persistent-codex-coldstart-evaluation.json` contains independent grading result.

If resumption fails, inspect prior receipts and uncertain state, rather than starting another partner without review. This chat never replaces the canonical creative source `CREATIVE-CANON.md`.
