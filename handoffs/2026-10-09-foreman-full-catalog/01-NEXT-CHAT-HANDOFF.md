# Authoritative next-chat operational handoff

**Scope:** Consolidated handoff for the user's DiceBox Campaign Helper product and Central Lodge railway/region puzzle campaign, including exactly observed Bridge constraints. **Objective:** Finish the already authorized project while protecting unrelated project work, avoiding fabricated validation, and preserving the final player acceptance test.

## Canonical locations
- Active source repository: `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper`
- Companion Foreman workspace: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper`
- Companion live checkpoint: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\outputs\LATEST-FOREMAN-CHECKPOINT.json`
- Campaign migration/fixture receipts: `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\work\clscale-central-lodge-migration-v001`
- Test world data (do not modify without cold backup): `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\work\foundry-fixture-data-permanent\Data\worlds\dbx-test-world`
- Source/production Foundry world previously identified as `the-lost-mine-of-phandalin`; separate product-charter live-validation target `the-ballad-of-chauser-bill`. These are NOT interchangeable with `dbx-test-world`. **No production deployment was approved or performed as part of this handoff.**
- Device: Remote Desktop Commander online `DESKTOP-OI30P4Q`, ID `fefa032a-6c81-42c8-86d8-287028c8850e`; a duplicate older device ID is offline. Always refresh the device list before actions.

## Project-wide scope
Read `PROJECT_CHARTER.md` and `docs/PROJECT-MISSION-AND-ORCHESTRATION.md` for decision authority, then `docs/ACTIVE-PROGRAM-SLICE.json` and `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md` for active program gates. Main lanes include:
- Desktop authoring app (`apps/campaign-helper-desktop`), scene model and user workflows.
- Semantic compiler and Foundry adapter/installer (`packages/dicebox-compiler`, `packages/dicebox-foundry`, `packages/dicebox-scene`, `packages/dicebox-core`).
- SQLite knowledge base (`database/`), migrations/seeds and tests.
- Assets, Foundry fixture/connector tools, current active product planning (`assets`, `tools`, `tests`, `docs`, `outputs`).
- Existing Bridge source `packages/dicebox-bridge`; Codex has worked on this separately. Avoid overlapping edits or runtime restarts.

The working tree is extensively modified and contains untracked evidence/files. See the accompanying Git-status snapshot; **do not overwrite, reset, or claim clean**.

## Central Lodge progress, last proven milestone
- User simplified railway fast travel to a **single N3 Underground Depot menu**. Locked destinations are hidden. Source-backed destination choices: N1 Lodge Railway Station, N2 Grotto Station, T3 Abandoned Spur. F1/F2 and T1/T2 physical tunnel mouths are deliberately excluded from depot fast travel.
- Pure source-backed catalog: `tools/clscale-depot-fast-travel-catalog.mjs`; shared non-dispatching transfer safety contract: `tools/clscale-depot-transfer-plan.mjs`.
- Real Foundry 14.367/dnd5e 5.3.3 `DialogV2.wait` UI was exercised with ephemeral synthetic events for locked, N1-only and fully unlocked destination states. Single **DISABLED** native N3 RegionBehavior ID `Xa6xz88CyQ38gCU9`, inside hub Region `tsRjZiiXw0qmktQS` on Scene `pHQvDUDlyWZFuNrX`. Original 119 Region behaviors preserved.
- Real disposable `RegionDocument.spawnTokens({create:false})` placement succeeded for 1x1 test Token in N1, N2, and T3 (not a durable multi-size/collision proof).
- A one-shot N3-to-N1 `RegionDocument.teleportToken` on a specifically created **disposable test Token** succeeded mechanically and left arrival marker `10ea6dfd271bbba3`. Unexpected ledger change was explained by normal N3/N1 railway notice scripts. Detailed diff and before/after receipts in work folder.
- The disposable arrival Token, puzzle notices, Scene parent token reference, and orphan delta were reconciled against two separately verified cold backups. Fixture then achieved 16/16 integrity checks with original 22 Scene Tokens and ledger revision0.
- `tools/clscale-depot-persistent-intents.mjs` added for durable, per-source-Token intent in a separate Journal flag. Real isolated GM `setFlag -> reload -> getFlag -> unsetFlag` smoke succeeded without mutating puzzle ledger. Latest checkpoint states **9 suites / 141 tests passed**. This is **not** player-ready or production-ready.
- The menu remains disabled; no live owner-consent and GM-authorization flow is wired to a committed production transfer. No final multiplayer playtest has been accepted.

## Reconciliation and current cautions
- Last documented checkpoint at 2026-10-09T19:54:02Z is **partial, continue**, not final ready. It is the best current milestone for the fixture; later user edits require fresh check.
- Current Windows Task Scheduler observation reported `DiceBox-Offline-Preflight-15m` **Disabled**, with previous successful run, despite older checkpoint saying Ready. Determine whether another active worker paused it before touching it.
- Current source Git state contains many modified and untracked project files. This handoff does not attempt to cherry-pick or close any broad program stage.
- The earlier request for a second GM account is pending **verification**. Do not state that it was created or share passwords. Ensure unique user and exact disposable world before action.
- Original Foundry test port `127.0.0.1:30005`, local URL `http://127.0.0.1:30005/`. This is not a public address; verify server started and listener on 127.0.0.1 before sharing as live.

## Next safe sequence for new chat
1. Read this handoff, latest companion checkpoint, and catalog. Refresh Remote Desktop Commander device; check possible concurrent Codex activity and git status.
2. Run a **read-only** fixture preflight only if the world is stopped and no writer has the Scene/Journals LevelDB open. Reconcile scheduler disablement without assuming it is accidental.
3. Check whether a second Gamemaster already exists in disposable fixture, then create one via native Foundry UI if still requested and safe. Avoid account-password collection in chat.
4. Continue the single shared N3 transfer with owner consent, active primary-GM exact identity, full puzzle-unlock recheck, destination footprint/Level/collision evidence and durable per-transfer intents. Stop on uncertain outcomes; no blind retries.
5. Test only disposable world with cold backup, precise receipts and fresh independent rereads; keep source production untouched. Do not enable N3 menu until safety gates and owner routing pass.
6. Complete cross-Scene live acceptance and later actual player testing only after all prerequisites; document a clear release/promotion decision. Product-wide roadmap remains separate.
7. Recheck Bridge connection per `02-BRIDGE-CONNECTION.md`. If current-chat identity is missing, use verified local tools, not historical IDs.

## User working preferences/authority
Act autonomously on routine implementation and tests, preserve original unrelated changes, use source as truth and simple designs, maintain proof receipts. User asked that when a decision **genuinely requires them**, signal via Windows shutdown-themed sound with PowerShell if available; do not play it for normal progress or assume it succeeded without process evidence. They intend a fully completed, tested project, not a superficial finished claim.

**Handoff itself does not authorize new production writes, user-account mutations, arbitrary replay, or remote message delivery.** Continue only with verified active authorization and target identity.
