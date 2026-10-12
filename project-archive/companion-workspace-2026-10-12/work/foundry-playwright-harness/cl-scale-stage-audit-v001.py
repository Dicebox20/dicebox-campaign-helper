from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
d=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
if d.exists():print('RECONCILE_PARTIAL_REPORT_ALREADY_STAGED')
# Exact read-only Foundry v14.367 summaries, no inferred image-footprint measurement.
scenes=[
 ('B1','Cellar & Utility Basement',181,330,150,0),
 ('B2','Hidden Annex',300,540,240,0),
 ('C1','Hidden Chapel',300,360,240,0),
 ('C2','Cult Undercroft',200,450,160,0),
 ('M1','Entrance Hall & Great Room',720,520,360,1),
 ('M2','Study, Parlor & Formal Rooms',530,430,320,0),
 ('M3','Kitchen & Service Wing',320,430,240,0),
 ('N1','Underworks Railway Station',180,300,150,0),
 ('N2','Grotto Garden Station',200,430,160,0),
 ('N3','Collection Vaults / Depot',160,470,120,0),
 ('U1','Family & Guest Rooms',240,340,180,0),
 ('U2','Servants, Nursery & Attic',210,420,160,0),
 ('F1','Infernal Threshold',480,430,320,0),
 ('F2','Final Summoning Chamber',None,500,None,0)
]
rows=[]
for key,name,door,region,proposed,tokens in scenes:
 if proposed is not None:
  assert proposed >=120 and 4320*120%proposed==0 and 2880*120%proposed==0,(key,'non-integer resize')
  if door:assert door/proposed>=1.15,(key,'door clearance')
  assert region/proposed>=1.15,(key,'Region footprint clearance')
  img=f'{4320*120//proposed}×{2880*120//proposed}'
  ratio=f'{proposed/120:.2f}×'
 else:
  img='art review required'
  ratio='unknown'
 rows.append(f'| {key} | {name} | {door if door is not None else "not measured"} | {region} | {str(proposed) if proposed else "TBD"} | {ratio} | {img} | {tokens} |')
table='\n'.join(rows)
report=f"""# Central Lodge Interior Map Scale Calibration — PREVIEW only
**2026-10-08 | CL-SCALE work unit | No live Scene changes | Author method/visual acceptance pending**

## Current exact Foundry baseline
- All 21 Central Lodge Scenes: gridless (`grid.type=0`), original `grid.size=120`, distance `5 ft`, canvas image and Scene size `4320×2880`, no padding. The current 21 Scenes/202 Regions/119 RegionBehaviors/33 Items, ledger revision 2 must be preserved.
- Canonical authoring contract from `DiceBox_Central_Lodge_Workstream_Handoff.md`: `battlemap-120` means 120 pixels per 5-foot logical square and `Scene pixels = logical columns × 120, logical rows × 120`. The default 36×24 footprint belongs to the forest map family; lodge interiors may use different logical footprints if PREPARE authorizes them. Token actor/system size is authoritative; token visual scale is **not** a legitimate map-scale repair.
- Present problem: all interiors inherited 36×24 (180×120 ft) regardless of visual architectural size. With Medium tokens 1×1, their 120px footprint may be tiny against doors/furniture, especially M1/M2/F1.
- Measurements are **wall-door line spans and smallest Region shape dimensions**, not calibrated distances of artwork features. A long portal may be a double door or arch; exact final values require art inspection and user visual acceptance.

## Candidate alternatives
**A. Per-Scene grid overrides, preferred safe technical pilot:** retain original high-resolution `4320×2880` artwork and every absolute-pixel Wall, Region, Tile, AmbientLight, sound, token, and route footprint. Change only `Scene.grid.size` from 120px to the approved grid size (while retaining `type=0` gridless, `distance=5`, `units=ft`). This is a deliberate, documented exception to the `battlemap-120` source profile; the 5-foot actor token becomes larger relative to architecture. Pre-existing token top-left positions do not automatically preserve visual center; handle M1 Ret separately with exact authorized token reprojection, not silently.
**B. Strict `battlemap-120` preservation:** retain `Scene.grid.size=120`, but resize each Scene image to the derived width/height shown below. Every absolute-pixel Wall endpoint, Region shape, Tile, light, sound, annotation, token, scene edge/crop and travel anchor must be scaled **with the exact same factor**. Preserve an original Scene/image snapshot and use a deterministic geometry transform; do not merely change image width or resolution alone. Source artwork detail decreases. This requires more exhaustive testing and a separate user-approved migration.

## Proposed conservative starting points — NOT approved or installed
| Scene | Interior | Narrowest wall door (px) | Smallest Region span (px) | Candidate grid px/5ft | Visual token-size gain | Option B resized image (px) | Placed tokens |
|---|---|---:|---:|---:|---:|---:|---:|
{table}

The proposed values preserve at least **15% clearance** (smallest door and smallest Region span relative to a 1-square token) in a simple size check; this does not prove geometric/path collision free. The smallest Region may be a nontraversal narrative trigger; actual corridors and 2×2/3×3 large actors need separate collision tests. N3 is left at 120px because of its narrow doors. F2 has no measured door and needs map-art visual inspection before selecting a grid.
Outdoor E1–E4 and long tunnel T1–T3 are excluded from the interior pilot; their current 120px grid is unchanged.

## Pilot recommendation
**M2 first**: `JZkxX6lUQe8Nc8xJ`, 0 placed tokens, door spans 530px and 900px, smallest Region 430px; candidate grid `320px per 5 ft` (gridless). M2 has a new serialized Founder Portrait behavior and many narrative Regions, so acceptance must include exact no-write source/flags and a recheck of available Region footprints. Preview at 320 only; no live change until user chooses grid exception vs canonical 120px art+geometry resizing.
**M1 next, not part of pilot**: candidate 360px grid, but contains Ret at token x2256/y1655 with 120px square. Preserve its center explicitly in any later accepted Scene change and independently verify against nearby walls, puzzle Regions, and route anchors.

## Strict safety gates
1. User selects approach A or B and approves exact first-pilot scale. No silent, mass 21-Scene updates.
2. Record accepted per-Scene scale plan in roadmap/checklist and canonical KB, with old/new source fingerprints and versioned rollback.
3. For grid-only option, exact Foundry read-only PREVIEW and one guarded single-Scene `grid.size` mutation, independent readback; preserve `grid.type=0`, distance5ft, scene size and all original geometry/IDs/Items, Actor ownership and current puzzle ledger.
4. For resized-art option, stage transformed image/scene geometry entirely offline, verify wall/Region alignment and scene origin; **do not** overwrite original assets or reuse old Scene build installers.
5. Re-evaluate CL50 route token footprints and destination clearances after **any** grid change in a route Scene. Freeze the existing CL50 installers and prior landing PASS receipts until recalibrated.
6. Never change token texture ratios as a substitute for fixing map scale. No player canaries until the final campaign playtest; visual calibration approval may use a no-write visual comparison only.

**Status: BLOCKED ON METHOD / PILOT APPROVAL**. The audit and table are informative candidates, not recovered per-room PREPARE decisions or gameplay certification.
"""
if d.exists() and d.read_text(encoding='utf-8')!=report:raise SystemExit('STOP existing report not exact expected draft')
d.write_text(report,encoding='utf-8')
s=road.read_text(encoding='utf-8-sig')
anchor=next((line for line in s.splitlines() if line.startswith('## CL-93 FINAL')),None)
if s.count(anchor)!=1:raise SystemExit('STOP roadmap anchor mismatch')
section="""## CL-SCALE — Central Lodge interior token/room calibration (2026-10-08)
**User-requested correction; accepted problem, method still undecided.** All 21 Scenes currently gridless 4320×2880 and 120px/5ft, but visually large interior art makes 1×1 Actor-sized tokens too small. Explicit earlier `battlemap-120` contract requires logical room footprint determination first; no token art-scale workaround. Read-only door/Region clearance audit and a conservative 14-interior candidate list are in `docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md`. **No live Foundry changes.** First choose grid-only Scene-specific exception (recommended M2 pilot 320px/5ft, keeps all pixel geometry) versus strict 120px art+geometry resize. Existing CL50 route landing receipts/installer promotion are frozen pending scale acceptance and recalculated clearance.
 
"""
road.write_text(s.replace(anchor,section+anchor,1),encoding='utf-8')
s=check.read_text(encoding='utf-8-sig')
anchor=next((line for line in s.splitlines() if line.startswith('## CL-93 Scene lighting')),None)
if s.count(anchor)!=1:raise SystemExit('STOP checklist anchor mismatch')
section="""## CL-SCALE — interior Scene calibration; before CL50 route installs
- [x] User reported visually undersized Actor tokens relative to interior rooms; confirmed 21 Scenes are gridless at 4320×2880 and 120px per 5ft, with actor/system-size-owned token footprints.
- [x] Reconcile earlier author `battlemap-120` profile and logical-footprint exception for lodge interiors; do not use token art-scale workaround.
- [x] Read-only audit all 21 Scene dimensions, 14 interior door spans, Region sizes, placed Tokens and route dependencies; stage per-interior candidate values and a conservative clearance check.
- [ ] Author chooses grid-only per-Scene scale exception versus strict 120px full image+geometry resizing; visually accept exact first M2 pilot (candidate grid 320px/5ft).
- [ ] After author choice and KB reconciliation, verify Scene source hashes, build no-write PREVIEW, one guarded M2 scale APPLY if approved, independent readback, restore-snapshot plan and regression.
- [ ] Recalculate all affected CL50 Scene-to-Scene arrival footprints, rerun route overlap tests, preserve one disabled M2 Notice and all 119 RegionBehaviors/33 Items/ledger revision2. Do not reuse stale R1–R4 landing PASS receipts.
- [ ] Keep user gameplay testing for final campaign acceptance.

"""
check.write_text(s.replace(anchor,section+anchor,1),encoding='utf-8')
print('REPORT_CREATED',d.name,'CANDIDATE_ROWS',len(scenes))
print('GRID_CLEARANCE_OFFLINE_CHECKS_PASS',13,'no live scene mutation')
