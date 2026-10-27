# Cabin in the Ashen Veil — Chat A Sune Bowl pending native activation / Bridge reconnect recovery

**Session date:** October 26, 2026 Pacific (UTC run crosses into Oct 27). **Workstream:** Chat A early/midgame; owner explicitly requested installation before integrated compatibility and player acceptance. **Capture:** Coordinating chat visible progress and Bridge tool receipts; not a complete platform-native transcript.

## Owner continuation
> Continue

This continuation follows the owner's previous instruction:
> Use the dicebox bridge

**Tool restriction:** Owner requires Dicebox Bridge for local machine PowerShell/Foundry access. Do not silently switch to Desktop Commander or another local executor.

## Last verified source and deployment state
- Regionwright source branch at turn start: `codex/cav-sune-integration-20261026`, last known remote HEAD `b1f926418facb5d1e483fadf7bb7fd7c166743d1`, 217 Cabin tests then passed.
- New source in local, **not committed** at time of disconnect:
  - `C:\Users\rujie\Documents\Region Editor\modules\regionwright\scripts\studio-cav-rosewater-bowl.js`
  - modifications to `C:\Users\rujie\Documents\Region Editor\modules\regionwright\scripts\studio-campaign.js` to import/offer `rosewaterBowl` API and install the GM Bowl service at normal module startup.
  - new `tests/cav-rosewater-original-bowl-guarded-gm-pickup.test.mjs` (17 focused tests).
- Focused new test: **17/17 PASS** and full **234/234 Cabin source regression PASS, 0 FAIL, 43 test files**, immediately before a proposed source hardening. These results apply to the version at that checkpoint, **not** to any later unknown local modification.
- Existing original world unique Item `Item.1n5LONw3nYIy61O9` (Sune’s Scrying Bowl), type loot, quantity 1, marked `GM_LIBRARY_ONLY`. Original pickup approval `NULL`, original Rosewater ring session `NULL`, original Bowl claim `NULL`, zero actor Bowl copies.
- Original ring `Scene.8yLMRDvxyw58dydh.Region.CAVBROSEWATER001`, native `CAVROSEWATERSCR1` still disabled. Glyph IDs approved rose/sun/moth/thorn but **exact fixture geometry still owner-review-required**, with overlap against the drained Screwdriver Region.
- Original Sluice Crank and committed Pond/Bath water proof absent; NEVER invent success or bypass. The Bowl service requires approved fixture, completed ring, original drain, real player auth/token and one-time reserved → DONE grant. **Do not create or enable Bowl native pickup Behavior before owner's exact on-map placement approval**.
- The source module and its modified studio-campaign registration were copied once to installed Foundry module disk, exact SHA confirmed:
  - `C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\regionwright\scripts\studio-cav-rosewater-bowl.js`, disk SHA256 **`CE9E9E08D61396FACA1366E5D16C2DF18DCCEF7E78830D761BD458CE4BC3BCB3`**
  - `...\scripts\studio-campaign.js`, SHA256 **`B239D9FFBAE8814AD3A573437C5B4A4280A08A1867A82008C70F2FB46F11A548`**
  - Pre-deploy studio-campaign exact backup: `utility-harness/artifacts/cav-chat-a-bowl-studio-campaign-before-deploy-20261026.js.txt`.
- This was **disk-only deployment**: Foundry game page not reloaded, active module runtime registration not independently verified and Bowl native pickup trigger not installed. The most recent inspected login page was `/join`, not elected GM's `/game`.

## Interrupted work — unknown, do not assume applied
After the 234-test checkpoint, assistant decided the Bowl's award gate should require **fully commissioned original Rosewater native Region and complete `cavRosewaterRingSession` DONE receipt ([1,3,2], revision/message provenance)**, not merely a `status:'done'` flag. Its first command for this failed in the orchestration layer; second subsequent Bridge tool attempt returned **internal error**, durable receipt query then failed. Exact local state **UNKNOWN**. Do not commit, push, copy or re-run the edit without first inspecting working source, checksum and Git status.

The Bridge connection ended: `mcp__Dicebox_Bridge__powershell_status`, `bridge_setup_current`, `bridge_doctor` all returned **`Session terminated`** even in a subsequent owner-requested continuation. No confirmed restart from chat. Do not pretend Foundry installation or GM readback passed. User's mandated Dicebox Bridge path must be restored before local work.

## Safest recovery actions once Dicebox Bridge becomes available
1. `bridge_doctor` then `powershell_status` with exact current chat identity. Confirm original source branch, current tracked/untracked local changes, and installed/source hashes. **Inspect** `studio-cav-rosewater-bowl.js` for the interrupted hardening edit and distinguish its local vs deployed copies.
2. Audit original ring data contract in `studio-cav-rosewater-rings.js` before changing the Bowl read. Do not assume the reserved/DONE record has fields without verifying original source.
3. Check the Bowl service's `assessOriginalCavBowlReward` only releases for original GM-approved fixture and true commissioned ring + consumed original transaction. Strengthen source with tests, preserve original 17 tests and 234 baseline, re-run source suite after any fix.
4. Reconcile on-disk installed module files before any copy. On a permitted guarded module reload (prefer coordinated with Chat B), independent elected-GM read-only import confirms Bowl GM API, original world and no claim/copy; only then classify installed module runtime.
5. The Bowl pickup's **native on-map fixture remains uninstalled** until exact owner-approved position/shape on approved drained Bathhouse artwork and no Screwdriver overlap. Do not choose for owner.
6. Use PREPARE → INSPECT → BUILD → VERIFY → CATALOGUE in bounded 2–3 installation batches; no full compatibility test until entire campaign installed. Preserve Chat B's shared-world late-game edits and all original puzzle gates.
7. Continue chronological conversation transcript and evidence report per owner direction.

**Checkpoint classification:** 234/234 source tests passed before uncertain hardening edit; original Bowl GM code copied to installed module disk but not runtime-verified; Bowl placement/activation still blocked; Dicebox Bridge unreachable; no world edits confirmed in the interrupted turn.
