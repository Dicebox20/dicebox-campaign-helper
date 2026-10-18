"""Explicit human-reviewed semantic reauthoring for accepted structural render variance.

New coordinates were reauthored as design intent after the user approved the
northward bridge / westward gate composition. NOT an automatic pixel trace.
Prior approved geometry retained in spatial-blueprint.json.
"""
from collections import deque
from hashlib import sha256
from pathlib import Path
import json, math
ROOT=Path(__file__).parent
PREV=json.loads((ROOT/"spatial-blueprint.json").read_text(encoding="utf-8"))
assert PREV["sceneKey"]=="dark-arch-m01"
assert PREV["canvas"]["pixels"]==[4800,2880]
# Logical spaces = 5 ft each; all bands have reviewed and intentional widths.
R=[
 ("G01","South Bank Approach","ground",(0,5.3,9,13),18),
 ("G02","Dark Arch Main Deck","bridge",(8,7.1,30,11.1),18),
 ("G03","Central Passing Bay","bridge",(15.5,6.5,21.2,12),18),
 ("G04","Hoist Yard","bridge",(21.5,5.3,26.8,8.2),18),
 ("G05","Inner Island Court","ground",(29.5,6.7,40,14.2),18),
 ("G06","Map 2 Exit","ground",(38,8.5,40,11.5),18),
 ("G07","City Quay Stair","stair",(4.7,11.2,8.5,17),[18,-8]),
 ("G08","City Boat Berth","dock",(4.2,15.8,11.5,21.5),-8),
 ("G09","Island Dock","dock",(30.3,16.5,38.5,21.5),-8),
 ("G10","Island Dock Stair","stair",(35.5,12.7,38.7,18.2),[-8,18]),
 ("G11","Upper Island Terrace","terrace",(30,0.8,36.6,4.7),31),
 ("G12","Upper Terrace Stair","stair",(34.5,3.5,38,8.4),[31,18]),
 ("G13","Hoist Rig Access","platform",(21.5,5.3,24,7.9),[18,45])
]
S=[]
for k,name,kind,(x0,y0,x1,y1),z in R:
 S.append(dict(id=k,name=name,kind=kind,bounds=[x0,y0,x1,y1],
               polygon=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],
               elevationFt=z,walkable=True))
W=[
 dict(id="W01",kind="bridge-parapet",segment=[[8,7.1],[15.5,7.1]],topFt=24),
 dict(id="W02",kind="bridge-parapet",segment=[[21.2,7.1],[29.4,7.1]],topFt=24),
 dict(id="W03",kind="bridge-parapet",segment=[[8,11.1],[15.5,11.1]],topFt=24),
 dict(id="W04",kind="bridge-parapet",segment=[[21.2,11.1],[29.4,11.1]],topFt=24),
 dict(id="W05",kind="fortress-wall",segment=[[29.4,0],[29.4,7.2]],topFt=30),
 dict(id="W06",kind="gate-portal",segment=[[29.4,7.2],[29.4,10.2]],widthFt=15,topFt=30),
 dict(id="W07",kind="fortress-wall",segment=[[29.4,10.2],[29.4,16]],topFt=30),
 dict(id="W08",kind="tidal-opening",segment=[[29.4,16],[29.4,20]],clearWidthFt=20,walkable=False),
 dict(id="W09",kind="fortress-seawall",segment=[[29.4,20],[29.4,24]],topFt=18),
 dict(id="W10",kind="terrace-parapet",segment=[[30,0.8],[36.6,0.8]],topFt=36)
]
# Bridges are traversable without an additional mechanical puzzle.
VERT=[
 dict(id="V01",surface="G07",startElevationFt=18,endElevationFt=-8,kind="city-quay-switchback",review="tread details not yet final"),
 dict(id="V02",surface="G10",startElevationFt=-8,endElevationFt=18,kind="island-dock-switchback",review="tread details not yet final"),
 dict(id="V03",surface="G12",startElevationFt=31,endElevationFt=18,kind="upper-terrace-steps",review="tread details not yet final"),
 dict(id="V04",surface="G13",startElevationFt=18,endElevationFt=45,kind="rig-climb",review="rope rig climb GM-adjudicated")
]
LINK=[
 dict(id="T01",kind="water-vessel",start=[7.4,18.4],end=[34.5,18.4],
      through=[29.4,18.4],startSurface="G08",endSurface="G09",
      hullWidthFt=10,waterOpeningFt=20,notWalkable=True,gmAdjudicated=True),
 dict(id="T02",kind="rope-swing",start=[23,6.5],end=[34,2.3],startSurface="G13",
      endSurface="G11",startElevationFt=45,endElevationFt=31,
      wallAtX=29.4,wallTopFt=30,gmAdjudicated=True)
]
for t in LINK[1:]:
 f=(t["wallAtX"]-t["start"][0])/(t["end"][0]-t["start"][0])
 t["wallCrossingElevationFt"]=round(t["startElevationFt"]+f*(t["endElevationFt"]-t["startElevationFt"]),3)
 t["wallVerticalClearFt"]=round(t["wallCrossingElevationFt"]-t["wallTopFt"],3)
assert LINK[1]["wallVerticalClearFt"] >= 5
assert LINK[0]["waterOpeningFt"]>=LINK[0]["hullWidthFt"]
# A complete square must fit in the union of traversable rectangular surfaces.
rects=[r["bounds"] for r in S]
def valid_center(x,y,side):
 h=side/2
 x0,x1=x-h,x+h;y0,y1=y-h,y+h
 if x0<0 or x1>40 or y0<0 or y1>24:return False
 cuts=sorted({x0,x1}|{v for a,b,c,d in rects for v in (a,c) if x0<v<x1})
 for a,b in zip(cuts,cuts[1:]):
  xm=(a+b)/2
  segments=sorted((yy,dd) for xx,yy,cc,dd in rects if xx<=xm<=cc and dd>y0 and yy<y1)
  cover=y0
  for lo,hi in segments:
   if lo>cover+1e-8:return False
   cover=max(cover,hi)
   if cover>=y1-1e-8:break
  if cover<y1-1e-8:return False
 return True
step=0.25
def nodes(side):
 return {(i,j) for i in range(1,160) for j in range(1,96) if valid_center(i*step,j*step,side)}
def path(a,b,v,open_gate,footprint=1):
 st=tuple(round(z/step) for z in a);goal=tuple(round(z/step) for z in b)
 if st not in v or goal not in v:return None
 pred={st:None};q=deque([st])
 while q:
  cur=q.popleft()
  if cur==goal:
   route=[]
   while cur is not None:route.append([cur[0]*step,cur[1]*step]);cur=pred[cur]
   return route[::-1]
  for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
   nex=(cur[0]+dx,cur[1]+dy)
   if nex in pred or nex not in v:continue
   crosses=(cur[0]*step<29.4<=nex[0]*step or nex[0]*step<29.4<=cur[0]*step)
   if crosses and (not open_gate or not (7.2 <= cur[1]*step-footprint/2 and cur[1]*step+footprint/2 <= 10.2)):continue
   pred[nex]=cur;q.append(nex)
 return None
n5=nodes(1);n10=nodes(2)
checks={}
def validate(name,a,b,side=1,opened=False,expected=True,ground=None):
 r=path(a,b,ground if ground is not None else (n5 if side==1 else n10),opened,side)
 passed=(r is not None)==expected
 checks[name]=dict(pass_=passed,found=bool(r),expected=expected,tokenFootprintFt=side*5,gateOpen=opened,
                   landTravelDistanceFt=None if r is None else round((len(r)-1)*1.25,1))
 if not passed:raise AssertionError((name,checks[name]))
 return r
validate("bridge_open_medium",[3,9],[39,9],opened=True)
validate("bridge_open_large",[3,9],[39,9],side=2,opened=True)
validate("bridge_closed_medium",[3,9],[39,9],expected=False)
validate("bridge_closed_large",[3,9],[39,9],side=2,expected=False)
validate("city_quay_access",[3,9],[7.5,18.5])
validate("island_postgate_from_dock",[34.5,18.5],[39,9])
validate("hoist_access",[3,9],[23,6.5])
validate("rope_terrace_to_inner",[34,2.3],[39,9])
# Negative controls: no bridge crossing without gate, no access without bypass connectors.
for rectId,src,target,code in [
 ("G10",[34.5,18.5],[39,9],"missing_island_dock_stair"),
 ("G12",[34,2.3],[39,9],"missing_upper_terrace_stair")]:
 orig=next(g["bounds"] for g in S if g["id"]==rectId)
 rects.remove(orig)
 validate(code,src,target,expected=False,ground=nodes(1))
 rects.append(orig)
assert all(q["pass_"] for q in checks.values())
feat=[
 dict(id="F-GATE",class_="securable_gate",at=[29.4,8.7],mandatory=False),
 dict(id="F-ROPE",class_="hoist_and_rope",start=[23,6.5],end=[34,2.3],movement="GM"),
 dict(id="F-BOAT",class_="empty_quay_and_separate_skiff",fromPt=[7.4,18.4],toPt=[34.5,18.4],movement="GM"),
 dict(id="F-ALARMBELL",class_="static_interactable",at=[6,7.0]),
 dict(id="F-M02",class_="map_transition",at=[39,9.0])
]
blueprint=dict(
  schemaVersion="dicebox-geometry-blueprint/v2.1-beta-reconciled-review",
  sceneKey="dark-arch-m01",basedOn="reviewed source PREPARE; accepted visual bridge-north/gate-west composition",
  pixelTraceAuthoritative=False,artisticallyAcceptedByUser=True,
  priorApprovedBlueprintSha256=sha256((ROOT/"spatial-blueprint.json").read_bytes()).hexdigest(),
  scale=PREV["canvas"],coordinateUnits="logical 5-foot spaces",
  surfaces=S,walls=W,verticalTransitions=VERT,transfers=LINK,semanticFeatures=feat,
  inspection=dict(geometryTests=checks,gateClosedAlternativesConnected=True,boatMovementNotCertified=True,
                  ropeDynamicsNotCertified=True,foundryNotVerified=True),
  workflow=dict(stage="STRUCTURAL_INSPECT_RECONCILED_GEOMETRY",
                artworkRetained=True,artReview="PASS_WITH_DOCUMENTED_VARIANCE",
                finalArtworkApproved=False)
)
bp=ROOT/"spatial-blueprint-render-reconciled.json"
bp.write_text(json.dumps(blueprint,indent=2)+"\n",encoding="utf-8")
rec=dict(sourceImageSha256="036823143bce9d2c92a818ccc9e7cc9496a08a0f99608a3cc3564115b06880f8",
         structuralImageNative=[1619,971],acceptedVisualDeviation="northward bridge and westward gate emphasize river",
         geometryBlueprintSha256=sha256(bp.read_bytes()).hexdigest(),
         label="PASS_WITH_DOCUMENTED_VARIANCE_LOCAL_REVIEW",
         tests=checks,stopConditions="paint before visual/feature reconciliation or runtime auto-wall derivation prohibited",
         caveats=["No automatic tracing of walls from pixels","Footprint/tidal/rope movements checked in pure author model only",
                  "Structural visual source not archived in this GitHub branch","Later Feature Manifest / artwork image identity binding required"],
         nextGate="FEATURE_MANIFEST_RECONCILIATION_THEN_PAINTERLY")
(ROOT/"render-reconciliation-receipt.json").write_text(json.dumps(rec,indent=2)+"\n",encoding="utf-8")
print(json.dumps(dict(blueprintHash=rec["geometryBlueprintSha256"],tests=len(checks),
                      ropeClearanceFt=LINK[1]["wallVerticalClearFt"],status=rec["label"]),indent=2))
