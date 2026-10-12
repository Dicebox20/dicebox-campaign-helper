from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
doc=r/'docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md'
if doc.exists():raise SystemExit('STOP N3 candidate already exists')
text="""# N3-to-T3 Hidden Spur: evidence-grounded candidate
**Status: PROPOSED — NOT AUTHOR-APPROVED / NOT INSTALLED (2026-10-08).**

## Evidence and exact active source
- N3 Foundry Scene `pHQvDUDlyWZFuNrX`; Branch Railway Region `RP1jYOH738xl9hks` (rectangle x2310 y2380 width620 height500), **zero** RegionBehaviors.
- The Departure Board Region `eNrbnN68TYvMaBcT` contains existing Station Route Plate socket `XItPpdHkojcs2C3v` writing `puzzles.n3.departureBoardResolved`.
- The Railway Switch Region `7el4eN3Uwzxy7Wmi` contains Wheel socket `6C5fkKasc9DWK1Sa` writing `puzzles.n3.switchWheelInstalled`.
- The Cartography Table Region `VE8p4CvgzqvhihuF` has three separate route-clue socket behaviors, then existing gate behavior `CAGlvXbm6uLupoRw` setting `puzzles.n3.routeOverlay.resolved` only if three individual layer flags are true: `oldEstateSurvey`, `cultPassageDiagram`, and `recentRouteFragment`. Existing gate can evaluate before last concurrent socket commit on same `tokenEnter`; a return visit may be needed.
- N3 Branch Region is **not** N3 West Region `foYsFHsLXtCbfiyR` in the author-approved R4 T2↔N3 main line. T3 N3 Branch Mouth Region `YElrtisbXN3DJ2Sw` has existing **T3→N3 return**, independently source verified, not permission to perform N3→T3 teleport.
- Current ledger revision 2 has `departureBoardResolved=false`, `switchWheelInstalled=false`, `routeOverlay.resolved=false`, `t3BranchUnlocked=false`. No non-GM players were active in read-only inventory. Current 21 Scenes / 202 Regions / 118 RegionBehaviors (one intentionally disabled M2 duplicate Notice) / 33 Items; user final gameplay test deferred.
- Reconciled KB open item `O-2026-10-07-CL91-N3-T3-UNLOCK-ORPHAN` explicitly blocks invention of unlock conditions until author approval. Referenced N3/T3 original PREPARE paths could not be opened at their recorded local locations and prior Library search did not provide an authoritative PREPARE. The conditions below are an evidence-informed **proposal**, not recovered canon.

## Proposed three-proof rule (requires explicit user approval)
1. **Route destination identified:** `puzzles.n3.departureBoardResolved === true` (Station Route Plate inserted).
2. **Track physically operable:** `puzzles.n3.switchWheelInstalled === true` (Railway Switch Wheel installed).
3. **Hidden spur mapped:** `puzzles.n3.routeOverlay.resolved === true` (all three route clue layers reconciled).

**Only when ALL THREE are true**, an inspection/entry at the N3 Branch Railway can set `puzzles.n3.t3BranchUnlocked=true`. It must not grant Items, force a scene transfer, consume the plate/wheel/clues, or set other story flags. It is idempotent and persistent in the canonical ledger. An incomplete state offers a vague in-fiction message appropriate to missing elements; it does not disclose the missing item locations or final destination. The T3 end is hinted as an older private rail spur, but **does not mention the Fiend Machine** prematurely.

## Mechanical boundary
- State unlock **is distinct from** installing a safe N3→T3 Scene transfer. After the gate is source-verified, CL50 still requires fixed committed token footprint, GM-confirmed player intent, no bounce/reentry, 1×1 constraints or manual fallback, scoped executor authorization, no active players during developer writes, and real player acceptance later.
- Recommended gate writer is one new `executeScript` RegionBehavior on the exact previously empty N3 Branch Region, using the canonical shared kernel `gate` with `statePath: puzzles.n3.t3BranchUnlocked`, three `type:state` requirements, `TOKEN_ENTER` and a no-softlock re-entry path. No teleport call and no dependency on unapproved N3 East or F1 return.
- At N3 Cartography Table, existing socket and gate event-order races can leave `routeOverlay.resolved=false` after all three layers become true. If a player returns to the table, the existing gate can complete; document this as part of eventual playtest. Do not secretly alter existing four table behaviors in this N3 branch work unit.
- Do not gate the spur additionally on `baggageLockerObserved`, `walkableRailwayNoticeResolved`, `recentUseObserved`, token proximity on some other Scene, or possession of every clue after successful socketing. Those are useful environmental narrative flags, but adding them would create unapproved dependencies and possible softlocks.

## Acceptance matrix for candidate
- 3 true → permit exactly one guarded unlock on Branch Region inspect/entry; flag becomes true.
- Each of three false separately → no unlock; no other ledger mutations.
- Overlay only 2/3 sublayers or `routeOverlay.resolved=false` → no unlock, even when Plate and Wheel ready.
- Wrong scene/Region, inactive/unauthorized Actor or wrong GM → no write.
- Repeated entry after unlock → no duplicate progress; branch status stable.
- Unrelated Item/Actor/M1/M2/U2/Route flags, Region IDs, travel behaviors, token position and lighting unchanged.
- Offline pure-condition unit tests **do not certify** live source installation, Region trigger delivery, or end-game player flow.

**Approval decision requested:** Should N3→T3 require exactly the three proofs `departureBoardResolved && switchWheelInstalled && routeOverlay.resolved`, or do you want a different story prerequisite? The current branch remains untouched until accepted.
"""
doc.write_text(text,encoding='utf-8')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
a=road.read_text(encoding='utf-8')
anchor='## CL-93 FINAL — Scene lighting and visual effects'
insert="""## CL91 N3-to-T3 hidden branch rule — candidate awaiting author approval (2026-10-08)
**Proposed, not installed:** Unlock N3 Branch Railway only after Departure Board resolved AND Railway Switch Wheel installed AND complete Cartography Overlay. N3-to-T3 transport remains separately quarantined under CL50. Exact evidence and negative-test matrix in `docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md`. Explicit campaign author approval of this new logical prerequisite is still required. Live N3 flag `t3BranchUnlocked=false`, branch Region empty, ledger revision2.

"""
if a.count(anchor)!=1:raise SystemExit('STOP roadmap insertion anchor unexpected')
road.write_text(a.replace(anchor,insert+anchor,1),encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
a=check.read_text(encoding='utf-8')
anchor='## CL-93 Scene lighting and visual effects — final stage'
insert="""## CL91 N3→T3 branch authoring (not an approved installer)
- [x] Re-read canonical N3/T3 decisions, live ledger and N3 components, exact empty Branch Region, and existing T3→N3 return.
- [x] Stage an evidence-based, proposed **Departure Board AND Switch Wheel AND complete Cartography Overlay** unlock rule without setting any flag or installing travel.
- [ ] Obtain explicit campaign author approval or revised prerequisite logic.
- [ ] After approval: reconcile KB and rebuild; offline validation, guarded no-write PREVIEW, one authorized N3 RegionBehavior APPLY, independent source/ledger reread, checkpoint.
- [ ] Independently resolve CL50 safe reverse travel: token footprint, destination pinning, player confirmation, bounce suppression, reconnect and final real-player canary; do not replay quarantined CL50 installers.

"""
if a.count(anchor)!=1:raise SystemExit('STOP checklist insertion anchor unexpected')
check.write_text(a.replace(anchor,insert+anchor,1),encoding='utf-8')
print('N3_CANDIDATE_STAGED',doc.name)
