"""Dark Arch V2.1 Beta: pure, exact-footprint rectangular-ground geometry authoring."""
from __future__ import annotations
import hashlib,json,collections,math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE=Path(__file__).parent
spec=json.loads((HERE/"spec.json").read_text(encoding="utf-8"))
assert spec["sceneKey"]=="dark-arch-m01"
assert spec["scale"]["logicalColumns"]==40 and spec["scale"]["logicalRows"]==24
assert spec["scale"]["sceneWidthPx"]==4800 and spec["scale"]["sceneHeightPx"]==2880

# Every rectangle below is independently authored in exact logical 5-ft cell
# coordinates, never traced from an unapproved image.
regions=[
 ("G01","city-bank","ground", [0,7,9,17], 18),
 ("G02","bridge-deck","stone-bridge", [8,10,32.5,14], 18),
 ("G03","passing-bay","stone-bridge", [17,8.5,22,15.5], 18),
 ("G04","crane-landing","stone-bridge", [24,7.5,28,12], 18),
 ("G05","island-inner-approach","ground", [32,10.5,40,17.5], 18),
 ("G06","m02-departure","ground", [38,13,40,16], 18),
 ("G07","city-lower-stair","stair", [3,15.5,8,20.5], [18,-8]),
 ("G08","city-quay","dock", [2,19,9,22], -8),
 ("G09","island-dock","dock", [33,19,38,22], -8),
 ("G10","island-lower-stair","stair", [33.5,16,38.5,20.5], [-8,18]),
 ("G11","island-upper-terrace","terrace", [33,5,39,9.2], 31),
 ("G12","postgate-upper-walkway","walkway", [36,8,38,12], [31,18]),
 ("G13","city-north-hoist-yard","platform", [25,6.5,27,10.5], [18,45]),
]
ground=[{"id":rid,"name":name,"kind":kind,"bounds":rect,
         "polygon":[[rect[0],rect[1]],[rect[2],rect[1]],[rect[2],rect[3]],[rect[0],rect[3]]],
         "elevationFt":elev,"groundWalkable":True}
        for rid,name,kind,rect,elev in regions]
rects=[g["bounds"] for g in ground]
# The vertical gate plane splits the island from the exterior, with a central gap.
wall=[
 {"id":"W01","kind":"stone-parapet","segment":[[8,10],[17,10]],"topFt":24},
 {"id":"W02","kind":"stone-parapet","segment":[[22,10],[24,10]],"topFt":24},
 {"id":"W03","kind":"stone-parapet","segment":[[28,10],[32,10]],"topFt":24},
 {"id":"W04","kind":"stone-parapet","segment":[[8,14],[17,14]],"topFt":24},
 {"id":"W05","kind":"stone-parapet","segment":[[22,14],[32,14]],"topFt":24},
 {"id":"W06","kind":"guarded-gate-wall","segment":[[32,0],[32,10.5]],"topFt":30},
 {"id":"W07","kind":"guarded-gate-wall","segment":[[32,13.5],[32,19]],"topFt":30},
 {"id":"W08","kind":"controllable-gate","segment":[[32,10.5],[32,13.5]],"topFt":30,"clearWidthFt":15,"state":"GM-controlled"},
 {"id":"W09","kind":"upper-island-parapet","segment":[[33,5],[39,5]],"topFt":36},
 {"id":"W10","kind":"island-dock-edge","segment":[[33,22],[38,22]],"topFt":-8},
 {"id":"W11","kind":"south-seawall","segment":[[32,22],[32,24]],"topFt":18},
]
# Author stair landings and elevations explicitly. These are traversable GM-
# adjudicated switchbacks, not a claim that a flat rectangle alone proves stairs.
vertical_transitions=[
 {"id":"V01","kind":"city-switchback-stairs","surface":"G07",
  "start":[5.5,16],"end":[5.5,20],"fromElevationFt":18,
  "toElevationFt":-8,"runIntentFeet":50,"clearWalkwayFt":5,
  "plan":"two/three switchback flights with accessible 5ft tread"},
 {"id":"V02","kind":"island-switchback-stairs","surface":"G10",
  "start":[35.5,20],"end":[36.5,16.5],"fromElevationFt":-8,
  "toElevationFt":18,"runIntentFeet":50,"clearWalkwayFt":5,
  "plan":"switchback flights from dock to inner approach behind gate"},
 {"id":"V03","kind":"upper-terrace-steps","surface":"G12",
  "start":[37,8.5],"end":[37,11.5],"fromElevationFt":31,
  "toElevationFt":18,"runIntentFeet":20,"clearWalkwayFt":5,
  "plan":"stone stairs inward from rope landing to postgate court"},
 {"id":"V04","kind":"hoist-crane-access","surface":"G13",
  "start":[26,10.5],"end":[26,9],"fromElevationFt":18,
  "toElevationFt":45,"runIntentFeet":0,"clearWalkwayFt":0,
  "plan":"climbable crane/ladder; climbing and fall risks GM adjudicated"},
]
assert all(t["toElevationFt"]!=t["fromElevationFt"] for t in vertical_transitions)

# Optional travel links have explicit non-walking traversal methods.
links=[
 {"id":"T01","kind":"water-vessel","from":[6.3,20.5],"to":[35.5,20.5],
  "fromSurface":"G08","toSurface":"G09","transport":"skiff separate movable Tile",
  "lengthFt":146,"preflight":"GM adjudicates boarding/movement; no walking on water"},
 {"id":"T02","kind":"hoist-assisted-swing","from":[26,9],"to":[35,7],
  "fromSurface":"G13","toSurface":"G11","transport":"rope over fortified wall",
  "originElevationFt":45,"destinationElevationFt":31,"wallTopFt":30,
  "crossingAtX":32,"requires":"Reach elevated crane, use rope and land on terrace; GM adjudicates"},
]
# Crucial: rope crosses fortified wall from west to east above its top.
rope_cross_t=(32-links[1]["from"][0])/(links[1]["to"][0]-links[1]["from"][0])
rope_cross_height=links[1]["originElevationFt"]+rope_cross_t*(links[1]["destinationElevationFt"]-links[1]["originElevationFt"])
links[1]["wallCrossingElevationFt"]=round(rope_cross_height,3)
links[1]["wallClearanceFt"]=round(rope_cross_height-links[1]["wallTopFt"],3)

anchors=[
 {"id":"A01","key":"south-bank-arrival","point":[3,12],"kind":"arrivalRegionCandidate"},
 {"id":"A02","key":"main-bridge-approach","point":[18.5,12],"kind":"cover/patrol"},
 {"id":"A03","key":"alarm-bell","point":[7.8,9],"kind":"static-baked"},
 {"id":"A04","key":"inspection-desk","point":[5,10],"kind":"static-baked"},
 {"id":"A05","key":"cargo-woooden-wagon","point":[3.3,14.6],"kind":"static-baked"},
 {"id":"A06","key":"rope-departure","point":[26,9],"kind":"swing-hoist"},
 {"id":"A07","key":"upper-postgate-rope-landing","point":[35,7],"kind":"swing-landing"},
 {"id":"A08","key":"city-boat-berth","point":[6.3,20.5],"kind":"empty-berth"},
 {"id":"A09","key":"island-boat-berth","point":[35.5,20.5],"kind":"empty-berth"},
 {"id":"A10","key":"island-inner-approach","point":[36,13.5],"kind":"post-gate"},
 {"id":"A11","key":"m02-exit","point":[39,14.2],"kind":"transitionRegionCandidate"},
]
# Geometry-only samples of decorative/potentially interactive fixed props.
objects=[
 {"id":"O01","kind":"checkpoint-booth","center":[4.5,9],"footprint":[3.3,7.6,5.3,9.7],"ownership":"background"},
 {"id":"O02","kind":"freight-crane","center":[26,8],"footprint":[25,7,27,9],"ownership":"background","rigging":"T02"},
 {"id":"O03","kind":"signal-bell","center":[7.8,9],"ownership":"background"},
 {"id":"O04","kind":"cargo-crates","center":[18.5,9.2],"footprint":[17.5,8.8,19,9.7],"ownership":"background"},
 {"id":"O05","kind":"empty-skiff-berth","center":[6.3,20.5],"ownership":"background-empty"},
 {"id":"O06","kind":"skiff","ownership":"separate Foundry Tile candidate","notBakedIntoArt":True},
]
# Conservative 0.25-unit lattice, exact area-coverage at every sampled token center.
# Square footprint can cross rect boundaries only when the rect-union covers it.
STEP=0.25
def square_on_union(x,y,footprint):
 half=footprint/2
 x0,x1=x-half,x+half; y0,y1=y-half,y+half
 if x0<0 or y0<0 or x1>40 or y1>24: return False
 cuts={x0,x1}
 for ax,ay,bx,by in rects:
  if x0<ax<x1:cuts.add(ax)
  if x0<bx<x1:cuts.add(bx)
 xs=sorted(cuts)
 for xa,xb in zip(xs,xs[1:]):
  mid=(xa+xb)/2
  intervals=sorted((ay,by) for ax,ay,bx,by in rects if ax<=mid<=bx and by>y0 and ay<y1)
  end=y0
  for a,b in intervals:
   if a>end+1e-9: return False
   end=max(end,b)
   if end>=y1-1e-9:break
  if end<y1-1e-9:return False
 return True

def lattice_valid(footprint):
 return {(i,j) for i in range(1,160) for j in range(1,96)
         if square_on_union(i*STEP,j*STEP,footprint)}
def point(p):
 return (round(p[0]/STEP),round(p[1]/STEP))
# The west-to-east gate portal has its own door condition.
def across_gate(a,b,gate_open):
 x0=a[0]*STEP;x1=b[0]*STEP
 if (x0<32<=x1) or (x1<32<=x0):
  if not gate_open:return False
  ymid=(a[1]+b[1])*STEP/2
  if not (10.5<=ymid<=13.5):return False
 return True
def route(start,end,valid,gate_open):
 from collections import deque
 s=point(start);e=point(end)
 if s not in valid or e not in valid:return None
 queue=deque([s]);pred={s:None}
 while queue:
  here=queue.popleft()
  if here==e:
   out=[]
   while here is not None:
    out.append([here[0]*STEP,here[1]*STEP]);here=pred[here]
   return out[::-1]
  for dx,dy in [(1,0),(0,1),(-1,0),(0,-1)]:
   nxt=(here[0]+dx,here[1]+dy)
   if nxt in pred or nxt not in valid or not across_gate(here,nxt,gate_open):continue
   pred[nxt]=here
   queue.append(nxt)
 return None

med=lattice_valid(1);large=lattice_valid(2)
tests={}
def check(name,a,b,footprint,gate_open,expected=True):
 val=med if footprint==1 else large
 path=route(a,b,val,gate_open)
 observed=path is not None
 tests[name]={"passed":observed==expected,"found":observed,"expected":expected,
              "footprintFeet":footprint*5,"gateOpen":gate_open,
              "sampleStepFeet":STEP*5,"pathLengthFt":None if path is None else round((len(path)-1)*STEP*5,2)}
 if not tests[name]["passed"]:raise AssertionError((name,tests[name]))
 return path

main_med=check("bridge_medium_open",[3,12],[39,14],1,True)
main_large=check("bridge_large_open",[3,12],[39,14],2,True)
check("gate_blocks_normal_medium",[3,12],[39,14],1,False,False)
check("gate_blocks_normal_large",[3,12],[39,14],2,False,False)
city_quay=check("city_quay_access_medium",[3,12],[6.3,20.5],1,False)
island_dock=check("island_dock_postgate_medium",[35.5,20.5],[39,14],1,False)
swing_start=check("rope_departure_access_medium",[3,12],[26,9],1,False)
swing_landing=check("rope_postgate_medium",[35,7],[39,14],1,False)
check("gate_limits_nonportal_crossing",[28,12],[34,7],1,False,False)
assert links[1]["wallClearanceFt"]>=5,(links[1]["wallClearanceFt"],"Must clear wall vertically")
assert 5.5<=links[1]["wallClearanceFt"]<=20
assert len(wall)==11 and wall[7]["clearWidthFt"]==15
assert next(w for w in wall if w["id"]=="W07")["segment"][1]==[32,19]
assert next(w for w in wall if w["id"]=="W11")["segment"][0]==[32,22]
assert ((22-19)*5)==15
assert (10 <= (22-19)*5)  # proposed 10-ft small skiff fits 15-ft water gap
assert all(len(g["polygon"])==4 for g in ground)

assert objects[-1]["notBakedIntoArt"] is True
# Inspect the 20-foot bridge's center travel band for solid cargo intrusion.
for obj in objects:
 if "footprint" not in obj:continue
 left,top,right,bottom=obj["footprint"]
 if left<32 and right>8 and top<14 and bottom>10:
  raise AssertionError(("solid prop obstructs 20ft bridge lane",obj["id"]))

assert next(g for g in ground if g["id"]=="G01")["elevationFt"]==18
assert next(g for g in ground if g["id"]=="G02")["elevationFt"]==18
assert next(g for g in ground if g["id"]=="G05")["elevationFt"]==18
assert len(vertical_transitions)==4
assert vertical_transitions[0]["fromElevationFt"]==18 and vertical_transitions[0]["toElevationFt"]==-8
assert vertical_transitions[1]["fromElevationFt"]==-8 and vertical_transitions[1]["toElevationFt"]==18
assert vertical_transitions[2]["fromElevationFt"]==31 and vertical_transitions[2]["toElevationFt"]==18

# Negative-control regressions: deleting either crucial connector must FAIL.
# This prevents an appealing image or disconnected walkway from being promoted.
dock_stair=next(g for g in ground if g["id"]=="G10")["bounds"]
upper_walk=next(g for g in ground if g["id"]=="G12")["bounds"]
rects.remove(dock_stair)
assert route([35.5,20.5],[39,14],lattice_valid(1),False) is None
rects.append(dock_stair)
tests["missing_island_stair_blocks_boat_bypass"]={"passed":True,"negativeControl":True}
rects.remove(upper_walk)
assert route([35,7],[39,14],lattice_valid(1),False) is None
rects.append(upper_walk)
tests["missing_upper_walkway_blocks_rope_bypass"]={"passed":True,"negativeControl":True}
# Sea-level 10-ft hull must fit through the authored 15-ft tidal gap.
hullHalfCells=10/5/2
waterY=20.5
assert waterY-hullHalfCells>=19 and waterY+hullHalfCells<=22
assert not any(w["segment"][0][0]==32 and w["segment"][1][0]==32
  and not (w["segment"][1][1]<=waterY-hullHalfCells or
           w["segment"][0][1]>=waterY+hullHalfCells) for w in wall
  if w["kind"]!="controllable-gate")
tests["boat_hull_fits_tidal_gap"]={"passed":True,"hullWidthFeet":10,"gapWidthFeet":15}
assert spec["content"]["discoveryCount"]==0

blueprint={
 "schemaVersion":"dicebox-geometry-blueprint/v2.1-beta-preview",
 "sceneKey":spec["sceneKey"],"source":"PREPARE.md+spec.json only; no prior generated art",
 "units":"logical-5ft-cells","canvas":{"logical":[40,24],"physicalFeet":[200,120],"pixels":[4800,2880],"pxPerCell":120},
 "axes":{"origin":"upper-left","x":"east/right","y":"south/down","elevations":"feet relative to bridge reference"},
 "geometry":{"surfaces":ground,"walls":wall,"verticalTransitions":vertical_transitions,"transfers":links,"anchors":anchors,"objects":objects},
 "gate":{"planeX":32,"gapY":[10.5,13.5],"widthFeet":15,
         "barrier":"blocks main passage when closed; bypass landings on x>32",
         "boatChannelY":[19,22],"boatChannelClearFeet":15,
         "maxSkiffHullWidthFeet":10,
         "boatChannelType":"open tidal inlet at waterline (not walkable)"},
 "traversalChecks":{
    "normal":{"requiredFootprintFeet":[5,10],"doorCondition":"open","postgateArrival":[39,14]},
    "water":{"boarding":[6.3,20.5],"landing":[35.5,20.5],
             "postgateReachableWithGateClosed":True,"noWalkableWaterClaim":True},
    "rope":{"departure":[26,9],"arrival":[35,7],
            "clearanceOverWallFt":links[1]["wallClearanceFt"],"gateClosedIndependent":True}
 },
 "projection":{"background":"all static surfaces/cargo parapets; empty berth only",
               "nativeWalls":"wall segments marked as candidates, no runtime installation",
               "nativeTile":"skiff separately positioned at GM discretion",
               "regions":"South Bank arrival and postgate M02 transition, exact polygons pending implementation"},
 "runtime":{"foundryVerified":False,"readyToPlay":False}
}
out=HERE/"spatial-blueprint.json"
out.write_text(json.dumps(blueprint,indent=2)+"\n",encoding="utf-8")
hash_=hashlib.sha256(out.read_bytes()).hexdigest()
# Diagram is an annotated geometry REVIEW artifact only, never the grayscale render.
W,H=1600,960;scale=W/40
im=Image.new("RGB",(W,H),(218,227,234));draw=ImageDraw.Draw(im)
def b(rect):
 return tuple(round(v*scale) for v in rect)
for g in ground:
 fill={"ground":(214,201,172),"stone-bridge":(183,178,167),"platform":(186,175,156),
       "dock":(144,110,76),"stair":(238,196,119),
       "terrace":(167,168,177),"walkway":(238,205,129)}.get(g["kind"],(191,191,191))
 draw.rectangle(b(g["bounds"]),fill=fill,outline=(74,72,63),width=2)
for w in wall:
 a,c=w["segment"]
 col=(150,48,42) if w["kind"]=="guarded-gate-wall" else (52,54,58)
 if w["kind"]=="controllable-gate":col=(40,140,68)
 draw.line((a[0]*scale,a[1]*scale,c[0]*scale,c[1]*scale),fill=col,width=13 if "gate-wall" in w["kind"] else 7)
draw.line((32*scale,10.5*scale,32*scale,13.5*scale),fill=(35,156,65),width=7)
# Annotated route overlays must not appear in artistic render.
def route_line(points,color,width=5):
 if points:draw.line([(x*scale,y*scale) for x,y in points],fill=color,width=width,joint="curve")
route_line(main_large[::max(1,len(main_large)//60)]+[main_large[-1]],(37,118,52),6)
route_line(city_quay[::max(1,len(city_quay)//30)]+[city_quay[-1]],(24,99,174),5)
route_line(island_dock[::max(1,len(island_dock)//30)]+[island_dock[-1]],(24,99,174),5)
route_line(swing_start[::max(1,len(swing_start)//30)]+[swing_start[-1]],(122,53,146),5)
route_line(swing_landing[::max(1,len(swing_landing)//30)]+[swing_landing[-1]],(122,53,146),5)
for link,col in [(links[0],(21,112,182)),(links[1],(126,51,165))]:
 draw.line([tuple(round(v*scale) for v in xy) for xy in (link["from"],link["to"])],fill=col,width=5)
# Major labels including geometry facts; these do not belong in image generation.
try:font=ImageFont.truetype("arial.ttf",22);tiny=ImageFont.truetype("arial.ttf",17)
except OSError:font=ImageFont.load_default();tiny=font
def label(x,y,words,color=(22,29,35),font=font):
 draw.text((x*scale,y*scale),words,fill=color,font=font,stroke_width=1,stroke_fill=(240,241,236))
label(.8,7.3,"CITY BANK")
label(10,12.3,"BRIDGE 20 ft")
label(17.3,8.9,"PASSING BAY",font=tiny)
label(32.25,10.7,"GATE 15 ft",font=tiny)
label(34,13.9,"INNER COURT",font=tiny)
label(33.1,5.2,"UPPER TERRACE",font=tiny)
label(3,19.1,"CITY QUAY",font=tiny)
label(33.1,19.2,"ISLAND DOCK",font=tiny)
label(20,20,"Blue: SKIFF / water travel",font=tiny)
label(20,22,"Purple: ROPE / aerial crossing",font=tiny)
label(2,.8,"DARK ARCH — GEOMETRY INSPECT PREVIEW (not rendered map)",font=font)
draw.rectangle([0,0,W-1,H-1],outline=(25,28,32),width=4)
im.save(HERE/"geometry-preview.png")
inspection={
 "operation":"DiceBox Scene Injector V2.1 Beta GEOMETRY INSPECT",
 "sceneKey":spec["sceneKey"],"verdict":"PASS_PURE_GEOMETRY_WITH_RUNTIME_GATES",
 "sourceMainCommit":spec["source"]["governingCommit"],
 "sourcePrepareSha256":hashlib.sha256((HERE/"PREPARE.md").read_bytes()).hexdigest(),
 "sourceSpecSha256":hashlib.sha256((HERE/"spec.json").read_bytes()).hexdigest(),
 "blueprintSha256":hash_,"previewSha256":hashlib.sha256((HERE/"geometry-preview.png").read_bytes()).hexdigest(),
 "tests":tests,"countWalkablePolygons":len(ground),"countCandidateWallSegments":len(wall),
 "geometryAssertions":{
  "bridgeWidthFeet":20,"mainGateOpeningFeet":15,
  "ropeCrossingAboveFortifiedWallFt":links[1]["wallClearanceFt"],
  "elevationTransitions":[t["id"] for t in vertical_transitions],
  "stairsAreExplicitGMAdjudicatedFeatures":True,
  "boatPassesOnlyWaterlineOpening":True,
  "boatChannelClearFeet":15,
  "skiffNotBakedInArt":True,"boatAndRopeArrivePostGate":True,
  "gateClosedBypassesIndependentlyValid":True,
  "boatTransferRequiresGMApproval":True,"ropeTransferRequiresGMApproval":True
 },
 "limits":[
  "This is an exact union-of-rectangles axis-aligned square token footprint sweep on a 1.25ft lattice, not a Foundry collision canary.",
  "Water transfer uses planned separate skiff, not traversable land; vessel control and actual Foundry movement are untested.",
  "Rope transfer clears authored wall top by vertical geometry but real climb/swing skill/DC and collision are GM-adjudicated.",
  "Parapet/wall semantics are intent-only until reconciled with render, Feature Manifest and exact Foundry runtime.",
  "No live Foundry Scene, Region, Wall, skiff Tile, Token, or macro was created."
 ],
 "next":"EMBOSSED GRAYSCALE RENDER from this Geometry Blueprint after creative authority reconciliation",
 "readyToPlay":False}
(HERE/"geometry-inspection.json").write_text(json.dumps(inspection,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"verdict":inspection["verdict"],"blueprintSha256":hash_,
                  "checks":tests,"ropeVerticalClearanceFt":links[1]["wallClearanceFt"],
                  "pngBytes":(HERE/"geometry-preview.png").stat().st_size},indent=2))
