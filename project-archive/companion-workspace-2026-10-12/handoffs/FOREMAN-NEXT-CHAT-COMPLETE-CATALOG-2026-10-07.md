# DiceBox Campaign Helper — Complete Next-Chat Foreman Handoff and Catalog
**Authority:** This is a read-only verified continuity document, not a license to overwrite the live Foundry world or replay previously completed APPLY steps.
**Cutoff:** 2026-10-07 21:05–21:10 PDT (2026-10-08 UTC).
**Next chat's first instruction:** *Recover this handoff, run the approved Foreman recovery and live read-only verification, consult the entire local KB, then continue the next governed DiceBox Campaign Helper roadmap work unit. Do not assume the older ChatGPT/Codex bridge session belongs to the new conversation.*

## 1. Exact authority, drives and startup

1. Project root: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`. Read `AGENTS.md` **first**, then `docs\FOREMAN-WORKFLOW-CURRENT.md`, `docs\PROJECT-MISSION-AND-ORCHESTRATION.md`, `docs\CL50-ROUTE-AUTHORITY-2026-10-07.md`, and the last specific handoff `handoffs\FOREMAN-CL52-M2-HAUNTED-PIANO-INSTALLED-2026-10-07.md`.
2. The authoritative live-game target is Foundry VTT **14.367**, system **dnd5e 5.3.3**, world `the-lost-mine-of-phandalin`, world data under `C:\Users\rujie\AppData\Local\FoundryVTT\Data\worlds\the-lost-mine-of-phandalin`. Do not switch worlds.
3. Foundry browser harness: `work\foundry-playwright-harness`; launch a read-only check using `node exec-page.mjs read cl90-progress-safety-smoke-v003.page.js` from that working directory. The dedicated **Assistant Gamemaster**, user ID `pnTxw7VYpYR4IKWE`, is the authorized automation executor for guarded installation under current AGENTS; the human primary **Gamemaster**, ID `JESWV6CcU7m07VW6`, controls actual GM-only story cue playback.
4. Windows Remote Desktop Commander: device `DESKTOP-OI30P4Q`, ID `fefa032a-6c81-42c8-86d8-287028c8850e`, was online at handoff; always rediscover online device. `start_process` with `shell:"powershell"` works. `write_file`, `read_file`, `edit_block` for project artifacts. No need for a new Windows credential.
5. Independent source repository / original scene-authoring files: `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper`; original Central Lodge planning under `work\lodge-campaign` in that repo, notably `AUTOMATION-RULES.md`, `PUZZLE-REGION-PLAN.md`, each Scene's `prepare\PREPARE-v001.md` (E2 v002), injector specs, state and build docs. **This large external repository is not identical to the small live Foreman database workspace.** Its latest local inventory indicated ~69,186 files/43GB with vendored/cache/fixture trees; use it in place rather than duplicating its binaries.
6. Startup: `scripts\Show-CampaignHelperRecoveryState.ps1` from Foreman root; inspect `outputs\LATEST-FOREMAN-CHECKPOINT.json`, relevant `handoffs\*`, `docs\ACTIVE-PROGRAM-SLICE.json` **when present** (it was not found in this root during earlier inspection), `docs\STARTUP-TECHNICAL-ROADMAP.md`; run `database\build_database.py` only after source/seed changes and always `database\verify_database.py`. Governed writes follow **accepted change → roadmap/checklist → KB seed/rebuild/verify → no-write preview → guarded APPLY once → independent read-only final verify → checkpoint**. Do not assume a successful shell command means a gameplay effect worked.
7. Finish user preference: play `%WINDIR%\Media\Windows Shutdown.wav` using PowerShell `System.Media.SoundPlayer.Load(); PlaySync()` at end of a meaningful work window. **Play the sound; NEVER shut down Windows.**

## 2. Full machine-readable catalogs / reproducibility

The local knowledge DB is the **governing index**, not this prose:
- SQLite: `database\dicebox_campaign_helper_knowledge.sqlite`; schema `database\schema.sql`, seed `database\seed.sql` + `database\seed.d\` (including late Oct-07 governed work). `build_database.py`, `verify_database.py`. Database built and integrity verified immediately before handoff.
- Full first-class table-data and column metadata export: `handoffs\catalog-2026-10-07\all-kb-data-and-metadata.json` (all canonical KB records; FTS storage duplicates omitted; schema/rows/counts preserved).
- Per-file metadata inventory: `handoffs\catalog-2026-10-07\project-file-metadata-sha256.json` (relative path, byte length, UTC modification, SHA-256 for owned files in Foreman root and original Central Lodge scene-source tree; documented excludes for secrets, third-party deps/oversized binary fixtures).
- Integrity receipt `handoffs\catalog-2026-10-07\catalog-integrity.json` verifies export/manifest counts and hashes. Never treat a pathname without disk reread as a verified artifact.
- Snapshot covers other core project layers by indexed files in the Foreman root: docs, handoffs, outputs, database, source scripts, asset manifests, harness receipts, installer plans, and historical trials. External 43GB source repo is referenced as an on-disk authority and cataloged selectively (original authored Central Lodge source), not copied or archived wholesale.

**Knowledge counts after documentary seed** (2026-10-07): SQLite `integrity ok`; **395 sources, 1,170 facts, 468 decisions, 540 open items, 201 trials, 40 research subjects, 19 milestones, 7 tools, 46 seed.d files**; additional relationships and metadata exported. Current declared gate `CL-50 Remaining Authoritative Route Reconciliation`. `v_active_blockers` has ~493 open/active rows; do not confuse the raw 540 open-item records with 540 uncompleted tasks (some marked closed).

## 3. Latest independently VERIFIED Foundry state — protect it

On 2026-10-07 around 21:02 PDT, a fresh `cl90-progress-safety-smoke-v003.page.js` read-only returned `PASS_WITH_KNOWN_BLOCKERS`, zero failures:
- **21 canonical Scenes, 202 Regions, 116 RegionBehaviors** (all enabled with 116 unique stable IDs), **33 canonical world Items, 134 world Macros**.
- Shared DiceBox kernel Macro `FHQiFYx6OntZVo9d` SHA-256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814` unchanged.
- Campaign state ledger Journal `xhlXv6CCH34HVga3` **revision 1**, `puzzles.e1.recentUseObserved=true`, updated `2026-10-08T03:40:53.252Z`; notices namespaces `observation:e1` and `e1`; no recovered/installed canonical Items. **Revision 1 is newer real play state** than old rev0 handoffs and must NOT be reset to 0 to satisfy stale scripts.
- All 202 Regions preserved. User **canceled Region deletion**. Full rollback-style pre-cleanup Region toObject backup retained at `work\foundry-playwright-harness\receipts\region-cleanup-2026-10-07\all-21-scenes-all-202-regions-full-backup-v001.json`; SHA `761b64d5aaf67c8893ca6526e9997a18830bbb7c8c469e83eaf2ba6245549fa6`; **backup verified, live restoration not tested**, nothing deleted.
- The 86 CL-51 AmbientLights were all hidden in last audited fixture registry; **68 explicit fixture owners + 18 owner-inferred inactive tunnel placeholders**, groupings 28 day/night, 26 local/power, 14 F1/F2 encounter, 18 tunnel. Two metadata namespaces `dicebox-campaign-helper` (54) and `world.dicebox` (32). No blanket light changes authorized. Global night transition must be a GM-authored **story event**, not wall-clock sunset.

### Completed scene and feature installations

| Lane | Evidence-backed implementation | Source or IDs | Evidence limit |
|---|---|---|---|
| CL-33 | Canonical T1/T2/T3 Item pickup scripts migrated | Behaviors `uslyOAlRE9Zzf87O`, `6s7f7pxMVLNNRBZR`, `sY1XXM7Xz6Jj9gmR` | Source/hash verified, no party gameplay canary |
| CL-40 | F1 Cicada Assembly item behavior hardening | F1 behavior `VPsFO5t8IhCzf5wn` | PASS source and independent read-only final |
| CL-41 | F2 ritual RegionBehavior compatibility | F2 Scene `HWitOe1wSid7MZ1y`, 4 existing observation behaviors | Compatibility verified ONLY; living cult / Fiend Machine encounter escalation not authored/completed |
| CL-50 | Existing F1→F2 | F1 `La9krMOMBhAhDLi6` Region `iuoEHBXWtXgzYmMh`, behavior `FElgIMZFVX5GleSy` | Preserve |
| CL-50 | T3 Ancient Passage→F1 | T3 `aIKQmFiuXWipEdyb` Region `Tkg7XpsF7X1P3ZVJ`, behavior `tSqhDN5CtAHzccmf` → F1 `zKNU1R3JGIMMt017` | Guarded APPLY+independent FINAL VERIFY, no live player canary |
| CL-50 | T3 N3 Branch→N3 Railway | T3 Region `YElrtisbXN3DJ2Sw`, behavior `pZpcYXFn517t6L5U` → N3 Scene `pHQvDUDlyWZFuNrX` Region `RP1jYOH738xl9hks` | Guarded APPLY+independent FINAL VERIFY, no live player canary |
| CL-50 | E1 front door→M1 entrance | E1 Scene `Zq8iXByDVhHRbA7w` Region `QS7OpvIilyyDpmLc`, new behavior `HBtxj5OwVSOJdqnC`; destination M1 Scene `U8S5ZrTjaPIkTUIL` Region `4b8vfvKAKXBS6kfW`; behavior SHA `f144c80ca7789ea0ca246a43529bea56b53776d965b1c6471670a89abf236b0f` | SOURCE-INSTALLED and independently FINAL VERIFIED; no actual teleport/player canary; no reciprocal M1→E1 yet |
| CL-91 | Six canonical ledger field alias corrections in M1/M2 | Behavior IDs `5vB7Rsqi5XxfjKjQ`, `OcRjOu5UK9Jq1XfI`, `8vtIgrjGwYaxjL07`, `re48ahV2D14sF4Ln`, `aGn2ZJSSH0WNzxzz`, `dgr5x5y5Df8GuX1d` | Source-verified / no player canary; grandfather clock writer still missing |
| CL-52 | M1 distant footsteps GM one-shot | Script Macro **`P7mgEkmAUiJXYdUD`**, SHA `4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6`; original WAV SHA `3e29666ae6a5a5819fcb7d2f58f5060c43cd18d23af0123918c758bb340ee3b5` | Guarded installed+independent verified, one-shot flag **absent/unplayed**, no audio/client canary |
| CL-52 | M2 haunted piano GM one-shot | Script Macro **`VHVC7yVlrNS7mWGJ`**, SHA `c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b`; original WAV SHA `d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9` | Guarded installed+independent verified, one-shot flag **absent/unplayed**, no audio/client canary |

**CL-52 audio details:** Original 5.5s M1 and 6.0s M2 stereo PCM16 at 48kHz, no third-party sampled audio, served from `worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/`. Macro Directory titles `DiceBox CL-52 — M1 Distant Footsteps (GM One-Shot)` and `DiceBox CL-52 — M2 Haunted Piano (GM One-Shot)`. Both must be **manually confirmed by primary Gamemaster while at least one non-GM player views the matching Scene**; GM targeted audio, no Region trigger or automatic night. Persistent one-shot Scene flags `flags.world.dicebox.cl52.m1DistantFootstepsPlayed` and `flags.world.dicebox.cl52.m2HauntedPianoPlayed`. **Never run either during automated testing**; first real player delivery should be a controlled canary. Do not reset one-shot flag after unknown audio broadcast without GM/player confirmation. The user's approval to create original Foundry assets is recorded; it is **not** an instruction to publish this campaign on a marketplace.

CL-52 plan/source: `docs\CL52-HORROR-PACING-SOURCE-PREFLIGHT-2026-10-07.md`; 12 cue candidates across all 21 Scenes; 101 local scenario checks PASS and 7 live anchor source checks, but **only M1 and M2 cues installed**. E4 childlike apparition must await understood burial clue; M1 clock chime blocked on unresolved grandfather clock setting; avoid strobing, repetitive loud scares and unapproved automatic triggers.

## 4. Blocking authority gates and next roadmap work

**Current gate is CL-50.** Prioritize a geographically/canonically authorized transit pair; safe route candidates must be exact Scene+Region+stableId matches with no-bounce path, fallback and player canary. Do not confuse spatial left/right with authenticated connected geometry:
- T1 Scene `ImeIdHbYb6kZKAdt`: Tunnel Mouth A `ewIAYppRLvgIV1b7`, Mouth B `91XmuJ9LGbsJY52W`; N1/N2 orientation still unbound.
- T2 Scene `ez9MSQ8QIO4cW6zo`: Mouth A `3OGR0atcJokXJo6b`, Mouth B `OOmnx3XAmw95E410`; N2/N3 orientation still unbound.
- N3 `puzzles.n3.t3BranchUnlocked=false`, no source writer among 116 RegionBehaviors/shared kernel/old macro inventory. Its prerequisite formula joining Departure Board, Switch Wheel and Cartography Table is deliberately **not authored**; do not invent it or enable the N3→T3 entrance. T3→N3 return exists already.
- M1 grandfather clock `puzzles.m1.clockSettingResolved=false` has **no approved numerical clock-hand solution/writer**. The Silver Family Emblem, genealogy/grave clues, Family Reliquary Key and Brass Baggage Token are known, but specific combination remains an authored choice. Do not auto-solve.
- M2 Founder Portrait RegionBehavior has `founderPortraitOpened` vs canonical `founderPortraitObserved`; U2 servant history behavior `servantHistoryObserved` vs `servantHistoryInterpreted`. They may be distinct story stages; don't silently rename without policy.
- CL-51 **one-way night story trigger remains unresolved**. User's broad approval of original horror assets and GM-chosen CL-52 cues did not select a nightfall event. 86 lights still hidden; no blanket toggling.
- CL-90/CL-91/CL-92 full dependency simulations and cross-client player/GM canaries pending; verify first existing routes and M1/M2 one-shots with actual actors/clients. A read-only self-test or mock test is not a player canary.
- User expressly **canceled all planned Region deletion**; leave all 202 intact. The backup is recovery evidence only.

## 5. Codex Wide Bridge Tunnel — exact tested transport/recovery instructions

This is an **instructional handoff; no outgoing Bridge send/control operation has been made while writing this document**.

**Plugin:** `Codex Wide Bridge Tunnel` via callable tools `mcp__Codex_Wide_Bridge_Tunnel__*`. Verify tool availability and actual schemas at the start of the new chat. Local-first, **loopback-only**, no cloud relay and no automatic apply. Never transmit access tokens, credentials or the local bridge token path contents.

**Verified identities from prior live task:**
- ChatGPT **project** `g-p-6aad7787f0f08191b111b384b2a9c6ef-dicebox-campaign-helper`; this **old chat** conversation `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`. ***DO NOT assume the next chat has that conversation ID.*** A new chat must obtain/verify its **own** exact current ID using the host or supported bridge registration; do not fabricate it.
- Target Codex **project** `892a0d8a-b2de-404a-894e-b6bae4def9e0`; task conversation `01a0e88f-c6de-7b41-853f-1de0bb464886`. Read-only verify that task is still the intended active recipient before sending.
- Previously active live session `ses-c076a0d2-5a98-4156-a86c-40a344b423e3` (Codex→old ChatGPT endpoint), protocol 2.0.0. **Bound to old conversation**, NOT a universally reusable next-chat session.
- Prior correlation `foreman-cl50-t3-exits-20261007-1838` had host acceptance, and return message was received. That does not prove other messages sent or current state.

**READ-ONLY bridge status at 2026-10-07 ~21:04 PDT:** `bridge_status` foreman defaultStatus **off**, automaticContinuation true, configuredScopes **4**, 330 active messages, mode local-first/loopback-only. Exact **old ChatGPT Foreman scope** query `bridge_foreman_status({foreman:{platform:"chatgpt",projectId:"g-p-...dicebox...",conversationId:"6ac5de56-fd64-83e8-9053-8df1a6ec4d8d"}})` returned **status BLOCKED**, **enabled=false**, `reconciliationRequired=true`, unresolved `receipt-staged` item and `safeToEndTurn=false`. Its previous metadata says acceptance message was authored by assistant, **not user**, and an exact text policy blocks dispatch until a user-supplied acceptance. **Do not invent `FOREMAN_ACCEPTANCE_OK`, resume, or replay the old pending correlation automatically.** Codex Foreman scope query returned **off**. New chat should surface this blocker to the user if Foreman automation is requested and proceed with normal authorized local work separately.

**Safe transport sequence if user requests a NEW live relay after the new chat starts:**
1. Call **read-only** `bridge_status`, `bridge_foreman_status`, `bridge_live_session_status` and bounded redacted `bridge_audit` for relevant exact identities; settle any unresolved receipt first without guessing or overwriting. Old scoped Foreman status **BLOCKED** is not a transport failure to bypass.
2. Confirm the **new ChatGPT conversationId** and intended Codex task. If bridge session registration is needed, use `bridge_register_session` for exact endpoints and `bridge_live_session_start({source:{platform:"chatgpt",projectId:<current>,conversationId:<current>},target:{platform:"codex",projectId:<Codex>,conversationId:<Codex>},mode:"live"})`, then check `bridge_live_session_status`. Input is tool-schema-checked, not guessed.
3. Only after **explicit present-turn user intent** send one bounded `bridge_communicate` with exact source/target, live sessionId, a **new unique correlationId** and body referencing the exact handoff filename, KB gate and desired action. `bridge_communicate` requests native recipient execution/return through correlated response. Plain `bridge_send` / `bridge_send_current` only STAGE messages in the local inbox; an inbox record alone is NOT native delivery, not a reply, and not applied work.
4. Require `deliveryState` and independent recipient return/ack / native audit before saying “delivered.” `host_accepted` with `delivered:false` or timeout remains **unconfirmed** until a matching native response is received. Maintain a correlation ID; never resend non-idempotent requests after outcome-unknown without fresh read-only inspection.
5. If a bridge message arrives as a certified exact **return leg**, honor it as user-authorized for that correlated exchange but **do not automatically relay it again**; follow explicit no-repeat return-leg directions. Bridge Foreman receipt-first controls (`bridge_foreman_control/status/boundary/receipt/dispatch/reconcile`) must obey exact current scoped user authority and unresolved staged receipt; never use these to fabricate approval.

**No bridge message was sent for this successor handoff.** Future continuation should be carried from the on-disk checkpoint and KB first, then optional authorized Bridge coordination.

## 6. Successor first work unit — exact commands and stop conditions

From PowerShell on the authorized device:

```powershell
$root = 'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper'
Set-Location $root
.\scripts\Show-CampaignHelperRecoveryState.ps1
Get-Content .\outputs\LATEST-FOREMAN-CHECKPOINT.json -Raw
Set-Location .\database
python .\verify_database.py
Set-Location "$root\work\foundry-playwright-harness"
node .\exec-page.mjs read .\cl90-progress-safety-smoke-v003.page.js
```

Expected at handoff: DB integrity `ok`, **21 / 202 / 116 / 33**, **134 Macros**, ledger revision **1**, source kernel SHA unchanged. If live revision advances again, **inspect specific player state deltas** before proceeding; do not treat all revisions other than 1 as damage. On mismatched item/behavior/scene IDs, foreign changes, partial installation or outcome-unknown write, STOP and reconcile before installing anything. Never rerun passed APPLY installers CL-33, CL-40, CL-50, CL-52 M1/M2.

Next sensible independent work: read-only CL-50 topology authority reconciliation for one unbound route, or a third CL-52 original manual GM cue after source/KB accepted-change gate. Avoid staging multiple independent live writes in one bounded work unit. For player tests, wait until target user/GM and party are physically present in the matching Foundry Scene.

**Other older handoffs (audit trail):** `FOREMAN-RELAY-CHECKPOINT-CL41-COMPLETE-CL50-TWO-EXITS-CL90-CL51-2026-10-07.md`, `FOREMAN-RELAY-CHECKPOINT-CL91-ALIAS-REPAIR-CL51-FIXTURES-2026-10-07.md`, `FOREMAN-RELAY-CHECKPOINT-CL90-KERNEL-CONTRACT-CL91-BLOCKERS-2026-10-07.md`, `FOREMAN-CL50-E1M1-CL52-M1-ORIGINAL-AUDIO-VERIFIED-2026-10-07.md`, `FOREMAN-CL52-M2-HAUNTED-PIANO-INSTALLED-2026-10-07.md`. The newest exact evidence wins over older counts/assumptions.

---
**End-of-chat disposition:** This handoff only catalogs and mirrors accepted evidence. No Foundry mutations, player effects, audio cues, Region deletion or bridge sends were performed during this handoff creation. The next chat must verify any state changes since this cutoff.
