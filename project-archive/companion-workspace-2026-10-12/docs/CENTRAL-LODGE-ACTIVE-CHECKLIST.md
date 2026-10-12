# Central Lodge active change checklist

**Bundle:** `central-lodge-2026-10-07-route-approval-final-vfx`
**Owner:** DiceBox Campaign Helper Foreman
**Status:** ACCEPTED CHANGE RECORDED; implementation gated by current Foundry/KB preflight.

## Accepted-change synchronization

- [x] User explicitly approved four exact west-to-east railway pairings as bidirectional topology.
- [x] Add **CL-93 — Scene lighting and visual effects** as final campaign roadmap phase, after CL-92.
- [x] Route and final-phase details recorded in `docs/CENTRAL-LODGE-ROADMAP.md` and this active checklist.
- [x] Foreman Mode turn-continuation rule reaffirmed: after every active turn checkpoint, send the verified connected Codex partner a next-turn trigger request, even on early bounded completion. Reconcile prior obligations; never duplicate unknown sends, and preserve blocked/disabled stop conditions. Governing documents: `AGENTS.md` and `docs/FOREMAN-WORKFLOW-CURRENT.md`.
- [x] Reconcile new source/decisions/open items with canonical SQLite KB, rebuild and verify before route implementation. (Rebuild completed; independent verification follows below.)
- [x] Obtain current live read-only Foundry integrity and baseline preflight (21 Scenes / 202 Regions / 116 behaviors / 33 Items, 134 Macros at prior CL-92 audit; ledger revision 1; CL90 live smoke PASS_WITH_KNOWN_BLOCKERS). This does not validate specific destination landing footprints.

## CL-50 route implementation

- [x] Exact approved route pairs R1–R4, with Scene and Region IDs, recorded as **author-approved topology**.
- [x] R1 N1 East ↔ T1 Mouth A: exact stable IDs, 1-square ephemeral token placement, source/target wall corridor and occupancy validated in no-write PREVIEW (other routes remain pending). See `docs/CL50-R1-BIDIRECTIONAL-GUARDED-PREVIEW-2026-10-07.md`.
- [x] R2 T1 Mouth B ↔ N2 Tunnel A: exact endpoint IDs and non-persistent 1×1 arrival footprint preflight PASS, with N2 railway notice overlap preserved and 2×2 fail-closed; no install. See `docs/CL50-R2-N2-T1-ARRIVAL-PREFLIGHT-2026-10-07.md`.
- [x] R3 N2 Tunnel B ↔ T2 Mouth A: exact Region stable IDs and read-only ephemeral footprint preflight PASS for 1×1 landings, while 2×2 at N2 overlaps the return mouth/story observation, so larger tokens remain manual-GM only. No install. See `docs/CL50-R3-N2-T2-ARRIVAL-PREFLIGHT-2026-10-07.md`.
- [x] R4 T2 Mouth B ↔ N3 West: exact Region stable IDs and no-write ephemeral 1×1/2×2 full token footprints PASS both directions, with existing N3 railway notice and passive lighting preserved, no installer. See `docs/CL50-R4-T2-N3-ARRIVAL-PREFLIGHT-2026-10-07.md`.
- [x] Consolidate R1–R4 landing geometry and Region notice/gate overlaps into `docs/CL50-RAILWAY-FOUR-ROUTE-INTEGRATION-REVIEW-2026-10-07.md` (source-only design; no installed handlers).
- [x] CL-50 offline route contract fixtures **24/24 PASS**, including full 1×1 body clearance at all eight mouths, 2×2 N2 collision regression, frozen R1 hash invariance, wrong-GM executor and unpinned commit rejection. Read-only live rechecked all eight Regions still unbound. See `docs/CL50-ROUTE-ACCEPTANCE-CONTRACT-FIXTURES-2026-10-07.md`. **This does not certify any installed handler.**
- [ ] Verify final arrival semantics and consent/cooldown under actual player event delivery; preserve N1 rail-power gate, N2 story observation and N3 notices at runtime.
- [x] CL-50 exact v14.367 ephemeral offset/placement semantics investigated: `center` ignores tested ±120px offset, `relative` needs an offset but repeated same-argument tests produced different positions. Neither offset nor staged `spawnTokens(create:false)` proves later committed teleport position. See `docs/CL50-V14-PLACEMENT-OFFSET-SEMANTICS-READONLY-2026-10-07.md`.
- [ ] Design bidirectional consent, bounce suppression, cooldown, pinned destination commitment and explicit fallbacks; protect already-installed travel.
- [x] R1 guarded no-write PREVIEW **PASS_STAGED_FOR_GUARDED_APPLY**, 38/38 offline source checks, two frozen scripts and receipt; no live installation.
- [ ] **BLOCKED:** frozen R1 source is not approved for live promotion: staged GM-election rule excludes the authorized Assistant Gamemaster client, and the sampled arrival is recalculated at teleport. Record a reviewed, versioned contract and independent acceptance tests through an allowed implementation path; do not bypass the earlier installer tool-safety stop.
- [ ] After resolving source and tooling safety blocks, complete narrowly reviewed R1 guarded APPLY and independent verification; R2–R4 remain separate slices.
- [ ] Independent FINAL VERIFY of each behavior/source hash, counts, ledger, item and foreign-state preservation.
- [ ] Primary-GM and actual player walking/return canary; no "gameplay certified" claim before observed player delivery.
- [ ] Defer N3→T3 prerequisites, N1 West/N3 East and other unapproved route destinations.

## CL-13 / CL-91 — The Seventh Winter (accepted 2026-10-08)
- [x] Explicit user acceptance of M1 fixed-time clock design: 4:35; IV fourth/youngest heir from U1 genealogy, VII seven-year grave interval from 1431 DR and 1438 DR E4 epitaphs.
- [x] Pre-install verification: M1 Clock Setting Region `3tIrR12uv8ppFkOb` was empty; both reward handlers and U1/E4 Regions existed. Now one source-verified clock behavior is installed.
- [x] Reconcile approved 4:35 design and new authored U1/E4 dates into the canonical KB, rebuild and verify integrity; new author details do not claim recovered original chronology.
- [x] No-write previews for U1, E4, M1 inscription and M1 clock; exact-scoped source/hash preconditions verified.
- [x] Separate guarded U1/E4/M1 clue changes and one M1 clock behavior installation independently source-verified. Foundry strips final script LF: normalized exact equality independently proven; 21/202/117/33, unchanged ledger revision 1.
- [ ] Player-facing final acceptance is deliberately deferred until the user completes whole-campaign testing; no automatic gameplay-certified claim.

## CL-91 M2/U2 distinct story stages
- [x] Approved additive distinction: M2 Founder Portrait observed is **not** the same as physical Signet opening and Survey pickup; U2 servant traces observed are **not** the same as interpreting their history.
- [x] Current M2/U2 installed RegionBehavior sources and canonical ledger flags independently reread; shared kernel supports dynamic nested state-path writes without altering installed scripts.
- [x] Add exactly **false** `puzzles.m2.founderPortraitOpened` and `puzzles.u2.servantHistoryObserved` to the existing ledger with exact snapshot/hash-gated PREVIEW, single authorized Assistant GM APPLY and independent final readback PASS. Ledger revision 2; all existing Items and states preserved.
- [ ] Later author separate observation/interpretation milestones if needed by campaign narrative, with no automatic claim that the player completed either.
- [ ] Defer user hands-on GM/player acceptance until final campaign testing.

## CL-91 follow-on M2/U2 narrative interaction
- [x] Review current M2 and U2 Region source and the kernel Notice contract, preserving false-roll fallback.
- [x] Approve U2 distinct interpretation only after servant-history traces and recorded visits/attempts to both servant quarters and nursery; neither successful Notice roll nor same-Actor possession required.
- [x] U2 source offline fixture tests 19/19 PASS, exact guarded no-write PREVIEW PASS, one authorized RegionBehavior install PASS, independent source/hash final readback PASS (118 behaviors, 33 Items, ledger revision 2 unchanged); no actual player canary.
- [ ] M2 portrait observation source and serialized input trigger design to avoid racing the existing Signet-pickup behavior.
- [ ] Actual player operation and narrative acceptance deferred until the final campaign test.

## CL91 M2 Founder Portrait single-event safe integration
- [x] Foundry read-only geometry/source audit: inner Portrait Notice and outer Founder Portrait Regions largely overlap; original Notice and Signet source hashes frozen.
- [x] Accept one serialized, outer RegionHandler that preserves both original Notice and Signet pickup bodies and adds a distinct portrait observation step; disable only redundant inner Notice event, preserving source/IDs.
- [x] Reconciled KB provenance and exact migration scope; built offline source preservation, failed-roll, Signet absent/present and concurrent-entry tests (15/15 PASS).
- [x] Exact-hash/no-write Foundry PREVIEW PASS, guarded disable-inner then update outer APPLY PASS, independent fresh readback PASS. Original Notice source unchanged, original Signet pickup verbatim embedded, actor/Items/ledger/geometry unchanged; one intentional disabled Notice and 118 total behaviors.
- [ ] Final user-directed game playtest, including Signet absence/presence and portrait inspection, deferred until full campaign.

## CL91 N3→T3 branch authoring (not an approved installer)
- [x] Re-read canonical N3/T3 decisions, live ledger and N3 components, exact empty Branch Region, and existing T3→N3 return.
- [x] Stage an evidence-based, proposed **Departure Board AND Switch Wheel AND complete Cartography Overlay** unlock rule without setting any flag or installing travel.
- [x] Explicit user approval received for exactly the three-proof AND gate; railway teleport remains separate and unapproved.
- [x] User-approved three-proof rule reconciled in canonical KB and rebuilt; actual RegionBehavior 19/19 offline tests PASS, exact no-write Foundry PREVIEW PASS, one guarded N3 APPLY PASS, independent source/ledger reread PASS (one new enabled behavior, total 119, unchanged ledger revision 2). Durable checkpoint in progress.
- [ ] Independently resolve CL50 safe reverse travel: token footprint, destination pinning, player confirmation, bounce suppression, reconnect and final real-player canary; do not replay quarantined CL50 installers.

## CL-SCALE — interior Scene calibration; before CL50 route installs
- [x] User reported visually undersized Actor tokens relative to interior rooms; confirmed 21 Scenes are gridless at 4320×2880 and 120px per 5ft, with actor/system-size-owned token footprints.
- [x] Reconcile earlier author `battlemap-120` profile and logical-footprint exception for lodge interiors; do not use token art-scale workaround.
- [x] Read-only audit all 21 Scene dimensions, 14 interior door spans, Region sizes, placed Tokens and route dependencies; stage per-interior candidate values and a conservative clearance check.
- [x] Author approved grid-only per-Scene calibration and delegated other interior grid values to Foreman; M2 first accepted pilot grid.size=320px per 5ft. No separate approval required for each Scene if exact safety preflights pass.
- [x] Reconciled live ledger revision3 and M1 notice (no revert). Backed up exact M2 Scene source; no-write PREVIEW PASS, one guarded M2 grid-size 120→320 APPLY PASS (`autoReposition:false`), independent full Scene source, all geometry and runtime ledger final readback PASS. Checkpoint before next Scene.
- [x] Chrome restored: CDP/browser read-only source access recovered and Foundry ready. Reconciled source and current ledger revision3. M3 Kitchen grid 120→240 single guarded write PASS, exact full Scene source and geometry independent readback PASS (14 Walls/10 Regions/4 Lights pixel-identical); per-Scene rollback backup saved. No extra player canary.
- [x] B2 Hidden Annex grid 120→240 bounded Scene update PASS; full source backup, independent pixel-geometry readback verified 22 Walls/10 Regions/3 Lights, ledger unchanged; checkpoint required before next Scene.
- [x] B1 Cellar 120→150px grid-size Scene update PASS; original source backup, independent 24-wall/11-Region/3-light source readback and unchanged ledger verified. Checkpoint before next live Scene update.
- [x] C1 Hidden Chapel grid 120→240px/5ft one guarded Scene update; exact backup, independent 21-wall/10-Region/3-light source readback PASS, ledger revision3 unchanged; checkpoint before next room.
- [x] Context-capacity handoff: reconciled later C1 applied checkpoint against independent live C1 full-Scene readback and CL90 v013 (zero failures), recorded canonical next-Foreman handoff and complete KB/file/Scene inventory plan. No C2 or CL50 live write in the cataloging turn.
- [x] **Successor C2 Cult Undercroft** 120→160px grid-only change in one isolated work unit: current Foundry/authorized executor/no active players verified; door lengths 200/260/260/600px, minimum Region width 450px; exact full source snapshot backup saved; guarded no-write PREVIEW PASS; one Scene.update with `autoReposition:false` PASS; independent entire Scene SHA normalization PASS, 30 Walls/11 Regions/3 Lights, zero tokens preserved; revision3 ledger unchanged; CL90 v013 no unexpected failures. Backup `outputs/foreman-checkpoints/clscale-c2-before-grid160-v001.json`, final source SHA `9d37ba2fa86191a3405ccec2aae6642d3abf278da968fd4d7d79783434ad775a`. No gameplay visual-fit acceptance claimed.
- [x] U1 Family & Guest Rooms gridless 120→180px verified through authorized Assistant Gamemaster: five actual door spans 240/260/260/240/250px, narrowest Region dimension340px; exact source/ledger no-write PREVIEW PASS, full original Scene backup `outputs/foreman-checkpoints/clscale-u1-before-grid180-v001.json`, one guarded update with `autoReposition:false`, independent entire-source normalized SHA match. All 22 Walls, 10 Regions, 5 Lights, no tokens, ledger revision3 preserved; CL90 v013 zero unexpected failures. No gameplay canary.
- [x] U2 Servants, Nursery & Attic gridless 120→160px: fresh sovereign ledger/executor preflight, 8 real doors minimum 210px and smallest Region span420px, U2 Servant History/Interpretation behavior IDs present and flags false, no Tokens. Full original `Scene.toObject()` snapshot saved in `outputs/foreman-checkpoints/clscale-u2-before-grid160-v001.json`, guarded no-write preview PASS, one authorized `Scene.update` with `autoReposition:false` PASS, independent entire Scene normalized SHA and geometry PASS. 28 Walls/11 Regions/3 Lights, all scripts, 4320×2880 art and puzzle ledger revision3 SHA preserved, CL90 v013 zero unexpected failures. CL50 installers remain quarantined; no game canary.
- [x] **2026-10-09 Meow reference-token cleanup:** author-approved targeted cleanup from rev12 after exact backup; removed 13 measuring-actor notices, reversed six caused observations, restored the Water Control Wheel to unrecovered, and deleted only the generated actor copy. Independent complete ledger/Actor/21 Scenes comparison PASS; revision13 SHA `ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4`, CL90 v014 zero unexpected failures. Earlier E1/M1 player records retained.
- [x] **N1 Railway Station grid120→150:** full exact backup `outputs/foreman-checkpoints/clscale-ref-n1-grid150-v001-before.json`, guarded PREVIEW, one Scene grid-only write, independently normalized full-source SHA PASS, 14 Walls/11 Regions/5 Lights, ST8 token coordinates unchanged, ledger revision13 preserved.
- [x] **N2 Garden Station grid120→160:** full exact backup `outputs/foreman-checkpoints/clscale-ref-n2-grid160-v001-before.json`, guarded PREVIEW, one Scene grid-only write, independently normalized full-source SHA PASS, 36 Walls/9 Regions/4 Lights, ST8 token coordinates unchanged, ledger revision13 preserved.
- [x] **F2 Final Summoning Chamber grid120→240:** owner visually approved candidate and delegated technical choice; exact source+ledger PREVIEW PASS, one grid-only Scene.update, independent after-state normalized original source SHA PASS *after identifying derived token._regions membership of behavior-free arrival Region*. Full corrected Unicode source backup `outputs/foreman-checkpoints/clscale-ref-f2-grid240-v001-original-source-recovered.json`, original browser SHA `f2b20ebe6b1ccd788fd77f16f8a6887459a978a968259d838c2902aa4fd04680`, final stable SHA `5ad191d492195bf227bb099d9b356992aca44fe6d884ac940e085db8c2342639`. All 43 Walls, 8 Regions, 8 Lights, token coordinates preserved, ledger rev13 unchanged; CL90 v014 zero failures. No player/teleport test.
- [x] **F1 240px guarded-design offline milestone (2026-10-09):** Exact live T3, F1 and F2 full source SHA and sovereign ledger rev13 rechecked PASS_NO_WORLD_DRIFT; new proposed F1 inbound Region (2390,1860,280×280) supports v14 `center` 1×1 ephemeral top-left (2410,1880) without any live write. Stage token-size 1×1 only, post-confirmation drift guards and GM fallback; **19/19 offline source fixtures PASS**, including 2×2 rejection and token/GM/actor change while modal open. Plan and gaps: `docs/CL-SCALE-F1-240-GUARDED-ARRIVAL-DESIGN-2026-10-09.md`. Proposed handler file is **NOT installed**, real committed teleport unverified.
- [ ] **F1 live install remains blocked:** 320px candidate definitively fails 1×1 inbound due solid y2640 Wall. Before considering 240px, independently prove safe migration ordering (disable original T3→F1 handler first), committed center placement, existing F1→F2 route integrity, 1×1 and 2×2 fail-closed handling, full source backup and ledger preservation. Keep F1 grid120, N3 grid120, M1 grid320 with Ret, and CL50 R1–R4 quarantine.
- [x] **2026-10-09 scratch system and F1 source drift evidence:** Official dnd5e 5.3.3 ZIP exact SHA d998061b7cc67d12a07dc93c7fb627c195974b59fd2e9b15fae19899c3f2f1be, complete 1,410-file independent installation in isolated workspace, package audit verified. Partial 269-file locked-live-package copy separately quarantined. F1 current full SHA eff632c06bb6e3281c2116e3959af3171ac95dc16ddab3a2ddd7fc23e316cd03 differs only System Infernal Light Region x 141→-3, y -7→-4, independently normalized exact original Scene SHA; no write/rollback, prior contract not automatically promotable. Current ledger revision13, CL90 v014 zero failures. Evidence `docs/CL-SCALE-F1-SCRATCH-ISOLATION-VERIFIED-BLOCKED-2026-10-09.md`.
- [x] **Disposable test harness fail-closed offline tests 28/28:** unique world ID, production identity rejection, port30010, module/Scene/Actor emptiness, single-use committed-attempt claim, official package version. Both guard and Node --preflight block deliberately; **no committed teleport attempted**.
- [ ] **Scratch firewall/admin gate requires owner input:** Windows Firewall disabled on Domain/Private/Public; local Desktop Commander not elevated. Explicit inbound TCP30010 block, enabled firewall profiles, private admin credentials and isolated listener absent. Do not enable host-wide firewall without owner decision, do not start scratch Foundry with port exposed. No Bridge or CL50 changes.
- [ ] Recalculate all affected CL50 Scene-to-Scene arrival footprints, rerun route overlap tests, preserve one disabled M2 Notice and all 119 RegionBehaviors/33 Items/current sovereign ledger. Do not reuse stale R1–R4 landing PASS receipts.
- [ ] Keep user gameplay testing for final campaign acceptance.

## CL-93 Scene lighting and visual effects — final stage

- [x] Final-stage title, order, dependency and scope accepted and captured in the campaign roadmap.
- [ ] After CL-92, inspect all 21 Scenes and 86 existing hidden AmbientLights; reconcile named versus inferred ownership.
- [ ] Obtain explicit user/GM story trigger for one-way day→night before enabling stateful night effects.
- [ ] Implement scoped light, darkness, fog/particle, ambient and ritual/railway visual behavior, preserving existing art/geometry.
- [ ] Verify non-strobing/photosensitivity-safe pacing, wall containment, player readability, frame performance and reload restoration.
- [ ] Independent scene-by-scene GM/player visual acceptance and final delivery receipts.

**Stop/recovery:** No installers or effects fire merely from roadmap acceptance; unresolved night trigger and N3 branch semantics stay unresolved. Preserve approved previous Regions, M1/M2 one-shot audio flags and ledger revision 1. Codex/Bridge setup is independent of these edits.


## Cross-cutting Region-triggered Macro permission rule — 2026-10-12
- [x] User explicitly approved a permanent rule for every current and future ChatGPT/Codex workflow: players intended to activate a Region must be able to execute every Macro that Region invokes.
- [x] Recorded the rule in the current campaign roadmap without changing campaign phase order or authorizing any live-world write.
- [x] Rule distinguishes execution from ownership: minimum effective player execution permission (normally default LIMITED=1 for a broadly player-facing Macro), never OWNER/edit solely to make execution work.
- [x] GM-only and privileged operations stay behind the existing GM-authorized adapter or GM-only trigger; do not expose them by increasing player permissions.
- [x] Added the canonical KB source, global fact, locked decision, and trial T-209 referencing existing exact-world trial T-190; rebuilt from schema/seed/seed.d and verified database integrity.
- [x] Added the permanent rule to foundation AGENTS.md and docs/FOREMAN-WORKFLOW-CURRENT.md so every recovered/new ChatGPT and Codex Foreman applies it.
- [x] Defined exact RegionBehavior/Macro ID, event/binding, enabled-state, intended-player execution, and fresh-reload permission readback as mandatory preflight, install postcondition, and regression gate.
- [ ] **BLOCKED: shared ChatGPT-side mirror pending.** The configured Google Drive/Docs connector is disabled by admin and cannot be installed in this session; do not claim the shared document was updated. Revisit when an authorized Google Docs editing path is available.
- **Scope note:** This is a mandatory preflight/postcondition/regression gate. It does not certify that a Macro's code is player-safe, prove gameplay success, or authorize changes to a live world.
