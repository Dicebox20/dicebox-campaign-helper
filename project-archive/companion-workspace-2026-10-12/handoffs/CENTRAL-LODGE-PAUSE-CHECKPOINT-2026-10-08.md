# Central Lodge Pause Checkpoint — 2026-10-08

**Project:** DiceBox Campaign Helper
**Workspace:** `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`
**Reason:** User-requested pause to preserve progress before any possible freeze.

## Current certified live state

- Foundry VTT: **14.367**
- D&D5e: **5.3.3**
- World: `the-lost-mine-of-phandalin`
- Canonical Lodge baseline: **21 Scenes / 202 Regions / 51 RegionBehaviors / 33 canonical Items**
- Runtime kernel: `Macro.FHQiFYx6OntZVo9d`
- Kernel SHA-256: `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`
- Ledger: `JournalEntry.xhlXv6CCH34HVga3`
- Ledger state at latest verify: revision `0`, notices `{}`
- Message arbitration v1.0.0 certified: 250ms gather / 1250ms visible-card cooldown / 5000ms semantic duplicate suppression / per-actor overlap coalescing / recipient isolation.

## Phase state

- CL-10 E2: complete.
- CL-10C runtime canary: complete.
- CL-11 U2: complete, 6 behaviors.
- CL-12 M2: complete, 7 behaviors.
- CL-13 M1: safe partial; exact clock-setting literal remains deferred.
- CL-14 B1: safe partial; B1→E3 Water Control Wheel direction certified; water/flood/underworks state semantics remain deferred.
- CL-15 E3: **complete and independently verified**.
- Current next gate: **CL-16 — M3 Kitchen & Service Wing — read-only preflight**.

## CL-15 E3 certified result

- E3 Scene: `iqfCcDpEer4pwrJj`
- E3 Regions / Behaviors after APPLY: **12 / 8**
- E3 stable-sorted geometry SHA-256: `d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d`
- CL-15 APPLY: PASS; 8 behaviors created.
- CL-15 FINAL VERIFY: PASS; 0 failures / 0 warnings.
- Lights remain untouched until CL-51.
- Transitions remain untouched until CL-50.

### E3 behavior bindings

| Key | Behavior ID | Stable ID | Action | Source SHA-256 |
| --- | --- | --- | --- | --- |
| sundial-notice | `FBzHQxR3CLUiDWx5` | `dbx:central-lodge:e3:behavior:sundial-notice` | notice | `679062540f00c7a0e29e1b8efd0d414d5dc124f1530ceef5b16011013f1c59f4` |
| sundial-gnomon | `E1Xh6t7ZUEB4rqaI` | `dbx:central-lodge:e3:behavior:sundial-gnomon` | socket | `7e396521e0b5b50b21c3af288d17010ca75b7eaec545c2ef4e73e877d49c0ec6` |
| fountain-notice | `BRwpDVuSpr1LekEL` | `dbx:central-lodge:e3:behavior:fountain-notice` | notice | `7c28cf9cd0eb7f1320ec41eff2bc7b3d4ef5a5eb7f8a8b87320257199c8182c5` |
| garden-proof-recovery | `yPucm9WDd9EA3mFx` | `dbx:central-lodge:e3:behavior:garden-proof-recovery` | pickup | `7edad00a3c17aa2364b34aee5f09587713e07d1cbfc77ef70a58b35f54e01982` |
| water-control-wheel-install | `cqFg7RMGWByntlIe` | `dbx:central-lodge:e3:behavior:water-control-wheel-install` | socket | `e674307737b04ee6c79c49264223dd961b9aa6f80ca4113fb4990dfc2c785ca7` |
| fountain-valve-cap-recovery | `1ol2RczHPmDX5BO8` | `dbx:central-lodge:e3:behavior:fountain-valve-cap-recovery` | pickup | `52f1042eb39240180cd7ce2bff84b77ba7f1179d7661adc1634606a5d86c80e7` |
| rose-crest-recovery | `IqkOqZLUe1jk7OUp` | `dbx:central-lodge:e3:behavior:rose-crest-recovery` | pickup | `4ac647ec4e653f5e2ca06c42f68fe9e5f2a67b01186464849964c61485b3e24f` |
| fountain-sequence | `g1u6ZzW0sCOaqRFD` | `dbx:central-lodge:e3:behavior:fountain-sequence` | gate | `16e580bc9d2aea880745a62d31242085187d23ae520d82e1264b3bcd9dc2e8ef` |

## B1 Waterwheel state

- B1 Scene: `0CSBwzcszPKyaB8u`
- B1 live count: **11 Regions / 4 behaviors**
- Waterwheel Region: `xIFjdjHmF2qn5Nij`
- Waterwheel Region stable ID: `dbx:central-lodge:b1:region:b1-water-control-wheel`
- Water Control Wheel recovery behavior: `jL7OU30qz2hVwLI2`
- Behavior source SHA-256: `4d34b6759347ff6a181df563faa6eaba44b714dca502a3c421f7647d21f95287`
- Metadata cleanup completed: behavior `regionStableId` corrected from Rail Proof to Waterwheel Region stable ID; gameplay source/kernel unchanged.

## Persistent project operating-rule reconciliation

- `AGENTS.md` updated with blanket project-scoped standing authorization.
- Dedicated **Assistant Gamemaster** developer/automation session is an explicitly authorized DiceBox project executor in addition to normal Gamemaster.
- Old project-local primary-active-GM-only convention is superseded for that designated developer session.
- Exact target/version/hash/PREVIEW/rollback/reread gates remain mandatory.
- Repeated blockers should trigger alternate-method research using current official docs and relevant technical community sources instead of repeated retries.
- Worker routing should use the currently recommended model for each separable task class when available.
- Developer-only Playwright page evaluation is permitted as governed instrumentation; it must not become a public/player arbitrary-evaluation or generic execute-as-GM surface.

## Playwright developer harness

- Harness directory: `work\foundry-playwright-harness`
- Dedicated isolated Chrome profile is the Assistant Gamemaster developer session.
- `exec-page.mjs` now recognizes Assistant Gamemaster as the explicitly authorized developer executor.
- Relevant CL-15 scripts:
  - `e3-preview-v002.page.js`
  - `e3-apply-v001.page.js`
  - `e3-final-verify-v001.page.js`
  - `b1-waterwheel-metadata-cleanup.page.js`
- Normal Chrome/Gamemaster session was left untouched.

## KB state

- Database rebuild/verify passed after CL-15 completion.
- Verified KB metadata: **21 / 202 / 51 / 33**.
- Verified KB current gate: `CL-16 M3 Read-Only Preflight`.
- New/updated seed deltas include:
  - `database\seed.d\2026-10-08-central-lodge-live-state.sql`
  - `database\seed.d\2026-10-08-z-central-lodge-cl15-complete.sql`
- `database\verify_database.py` now checks the current 202/51 baseline and CL-16 gate.

## Exact resume point

Do **not** repeat CL-15 or modify E3 unless a fresh read-only drift check fails.

Resume with **CL-16 M3 read-only preflight**:
1. Query the KB for M3/Bell Board/Servant Bell Pull/Bell Crest/B2-route authority using a local Python helper (the last attempted inline PowerShell SQLite command failed only because PowerShell parsed SQLite `||`; no project/runtime state changed).
2. Inspect live M3 Scene `LXTA8mx1rJ2L6e2J` Region manifest, existing behaviors, metadata, and geometry fingerprint through the Playwright Assistant Gamemaster developer session.
3. Reconcile exact M3 dependencies before authoring any behavior.
4. Build read-only CL-16 PREVIEW.
5. Only after PREVIEW PASS, use the governed Assistant Gamemaster harness for APPLY and independent FINAL VERIFY.

## Pause safety statement

At this checkpoint there is **no pending/outcome-unknown Foundry write**. The last live write (B1 Waterwheel metadata cleanup) returned PASS. The last CL-15 operation was a read-only FINAL VERIFY PASS. M3 has not been modified.
