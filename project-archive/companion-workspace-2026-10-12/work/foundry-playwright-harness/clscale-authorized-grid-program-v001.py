from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
dossier=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
s=dossier.read_text(encoding='utf-8')
approval='''

## User authorization: per-Scene grid calibration, 2026-10-08
The campaign author explicitly approved the grid-size method for interiors and delegated selection of the remaining Scene grid sizes to the Foreman, without separate approvals for each one. This supersedes the pending method-choice requirement; it does NOT waive exact technical preflight/coordinate checks or justify changes to scenes without defensible scale evidence. Gridless mode, original 4320×2880 pixel art, walls, Region shapes, scenery, lights, Items and token/Actor ownership stay unchanged. 
**First accepted pilot:** M2 Scene JZkxX6lUQe8Nc8xJ, grid.size 120 → 320, distance 5 ft, type gridless (0), no placed tokens. Exact pre-write Scene source SHA c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5, geometry SHA e6790e102c446d20f277723855465145d588190efb16f8f5bd56bb3ca9f302e0; ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 observed with new m1 Notice. The ledger remains sovereign; do not change or revert it.
**Subsequent interiors:** allow sequential bounded Scene-only corrections after each independent readback and checkpoint using measured candidate clearances; no bulk mutation. N3 conservatively stays 120 due narrow 160px door and route safety; F2 remains uncalibrated until visual measurements are credible. Other users' live tokens require their own center/clearance safeguard.
**Transport safety:** Existing CL50 route landing receipts are stale for any regridded Scene; CL50 live route installations remain quarantined until a new complete footprint/pathing review.
'''
if '## User authorization: per-Scene grid calibration' in s:raise SystemExit('STOP already recorded')
dossier.write_text(s+approval,encoding='utf-8')
s=road.read_text(encoding='utf-8-sig')
needle='**User-requested correction; accepted problem, method still undecided.**'
replacement='**Author approved per-Scene grid-size calibration and delegated remaining interior choices to Foreman.** M2 gridless 120→320 is first bounded live pilot, subject to source/geometry preflight, dedicated Assistant Gamemaster authority, one update, independent readback, and checkpoint. No map image resizing or token texture scaling. Leave N3 at120 and F2 uncalibrated until evidence; all CL50 route installer/landing receipts remain quarantined pending revalidation.'
if s.count(needle)!=1:raise SystemExit('STOP roadmap anchor drift')
road.write_text(s.replace(needle,replacement,1),encoding='utf-8')
s=check.read_text(encoding='utf-8-sig')
needle='- [ ] Author chooses grid-only per-Scene scale exception versus strict 120px full image+geometry resizing; visually accept exact first M2 pilot (candidate grid 320px/5ft).'
replacement='- [x] Author approved grid-only per-Scene calibration and delegated other interior grid values to Foreman; M2 first accepted pilot grid.size=320px per 5ft. No separate approval required for each Scene if exact safety preflights pass.'
if s.count(needle)!=1:raise SystemExit('STOP checklist approval drift')
s=s.replace(needle,replacement,1)
needle='- [ ] After author choice and KB reconciliation, first reconcile observed live ledger revision3 with added M1 notice (do not revert), then verify fresh Scene source hashes and ledger, build no-write PREVIEW, one guarded M2 scale APPLY if approved, independent readback, restore-snapshot plan and regression.'
replacement='- [ ] Reconcile observed live ledger revision3 and M1 notice (do not revert), verify M2 and other Scene source/geometry snapshots, build exact no-write PREVIEW, one guarded 320px M2 grid APPLY, independent readback with rollback evidence and regression. Checkpoint before changing another Scene.'
if s.count(needle)!=1:raise SystemExit('STOP checklist next drift')
check.write_text(s.replace(needle,replacement,1),encoding='utf-8')
print('CALIBRATION_PROGRAM_ACCEPTED_M2_320_AND_SEQUENTIAL_AUTHORIZATION_RECORDED')
