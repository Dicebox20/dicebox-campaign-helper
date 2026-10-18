"""Read-only independent geometry audit for M02 v7; no imports from author, no Foundry calls."""
import json,hashlib,math
from pathlib import Path
from shapely.geometry import box,LineString,Point,Polygon
from shapely.ops import unary_union
p=Path(__file__).parent
b=json.loads((p/'spatial-blueprint.json').read_text())
r=json.loads((p/'REGISTRATION-RECEIPT.json').read_text())
macro=(p.parent.parent/'dark-arch-m01'/'final-injection'/'DiceBox-Dark-Arch-M01-Painterly-Injector-V2.1-Beta-PREVIEW-FIX.md')
canon=lambda x:json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf8')
sha=hashlib.sha256(canon(b)).hexdigest()
report={'operation':'dicebox.geometry-final-independent-inspect/v7','sourceBlueprintCanonicalSHA256':sha,'status':'PENDING', 'passed':[],'failed':[], 'caveats':[]}
def test(name,truth,detail=None):
 item={'check':name,'pass':bool(truth)}
 if detail is not None:item['detail']=detail
 report['passed' if truth else 'failed'].append(item)
 return truth
scale=b['scale'];test('scale-40x24-gridless-120',scale['logicalColumns']==40 and scale['logicalRows']==24 and scale['gridSizePx']==120 and scale['pixels']==[4800,2880] and scale['gridType']=='gridless')
reg=b['registration'];seam=reg['m02ImageJoinXLogical'];test('source-image-registration',r['siftRansacInliers']>=500 and r['medianResidualPx']<1 and abs(seam-r['newSeamXLogical'])<1e-4,{'RANSACinliers':r['siftRansacInliers'],'medianResidualPx':r['medianResidualPx'],'M01AtM02Join':seam})
test('native-M01-horizontal-proportion-preserved',abs(seam-(40-reg['m01OriginalLeftLogicalCell']))<1e-4 and 19.7<seam<20.1)
test('one-and-only-one-exterior-door',len([d for d in b['doorPlanes'] if d['exteriorAccess']])==1 and next(d for d in b['doorPlanes'] if d['exteriorAccess'])['id']=='D01')
test('first-floor-crop-boundaries-only',b['continuity']['towerInteriorCroppedAt']==['top','bottom','right'] and not b['continuity']['rearEntranceVisible'])
test('image-seam-not-a-wall',not any(all(abs(x-seam)<.001 for x,y in wall['segment']) for wall in b['walls']+b['inheritedWalls']))
test('roof-wing-connectivity', all(abs(x['bounds'][2]-y['bounds'][0])<1e-4 for x,y in zip(b['buildingSurfaces'][:2],b['buildingSurfaces'][1:])))
test('no-runtime-state-modification', b['createdNativeFoundryDocuments'] is False and b['geometryStageOnly'] and not b['authoritativeFoundryGeometryFromUnreviewedPixels'])
test('native-wall-authority-typed-source',len(b['inheritedWalls'])==9 and len(b['inheritedSpecialPlanes'])==1 and b['sourceReconciliation']['M01SeawallExcludedFromProposedGeometry'])
test('latest-M01-macro-hash-reconciled',hashlib.sha256(macro.read_bytes()).hexdigest()==b['sourceReconciliation']['M01LaterDeploymentMacroSha256'])
# Macro later than the semantic source must supersede its mismatched gate and open boat lane.
macroGate=b['inheritedSpecialPlanes'][0]
test('later-M01-gate-plane-preserved',macroGate['sourceId']=='W12' and abs(macroGate['segment'][0][0]-(29.88-reg['m01OriginalLeftLogicalCell']))<1e-4 and abs(macroGate['segment'][0][1]-7.30)<1e-4 and abs(macroGate['segment'][1][1]-10.35)<1e-4)
test('M01-skiff-opening-not-accidentally-blocked',not any(all(abs(x-(29.88-reg['m01OriginalLeftLogicalCell']))<.1 for x,y in w['segment']) and max(y for x,y in w['segment'])>16.1 for w in b['inheritedWalls']))
# Preserve source datum and stair transitions as authored, without inventing tread or runtime heights.
newfloors=[s for s in b['surfaces'] if s['ownership'] in ['m02-outdoor','m02-interior']]
test('M01-to-M02-ground-elevations-continuous',len(newfloors)==4 and all(s['elevationFt']==18 for s in newfloors))
v={x['sourceId']:x for x in b['verticalTransitions']}
test('upper-terrace-downstairs-elevations',v['V03']['startElevationFt']==31 and v['V03']['endElevationFt']==18 and v['V03']['elevationDeltaFt']==-13)
test('lower-dock-upstairs-elevations',v['V02']['startElevationFt']==-8 and v['V02']['endElevationFt']==18 and v['V02']['elevationDeltaFt']==26)
test('treads-and-live-elevations-not-claimed',all(x['liveFoundryVerified'] is False and 'unresolved' in x['clearanceStatus'] for x in v.values()))
# Walkable physical spaces and blocking geometry; do not treat rope/water or disjoint elevations as ordinary ground.
# G09 and G11 are separate levels. Only courtyard/bridge deck + new ground floor for 10-ft intake reachability.
floorAreas=[Polygon(s['polygon']) for s in b['surfaces'] if s['ownership']=='m02-outdoor' or s['ownership']=='m02-interior' or s['id'] in ['M01-G02','M01-G03','M01-G04','M01-G05','M01-G06']]
floor=unary_union(floorAreas)
solid=unary_union([LineString(w['segment']).buffer(.025,cap_style=2) for w in b['walls']+b['inheritedWalls']])
objects=unary_union([box(*p['bounds']) for p in b['staticBlockingProps']])
hazards=unary_union([Polygon(x['polygon']) for x in b['hazardPolygons']])
free=floor.difference(solid.union(objects).union(hazards))
# Independent zero area swept token clearance tests; image seam is no obstacle.
door={d['id']:d for d in b['doorPlanes']}
routeDetails=[]
for route in b['routeTests']:
 trace=LineString(route['polyline'])
 sweep=trace.buffer(route['requiredFootprintFt']/10,cap_style=2,join_style=1)
 collision=sweep.difference(free).area
 crossed={did:trace.distance(LineString(door[did]['segment']))<1e-5 for did in route['doors']}
 # Image seam crossing must be real and new tower door crossed in a legal opening.
 detail={'id':route['id'],'footprintFt':route['requiredFootprintFt'],'lengthFt':round(trace.length*5,1),'collisionAreaLogical':round(collision,7),'doorCrossings':crossed,'crossesSeam':trace.crosses(LineString([(seam,0),(seam,24)])),'passes':collision<1e-5 and all(crossed.values()) and trace.crosses(LineString([(seam,0),(seam,24)]))}
 routeDetails.append(detail);test('route-'+route['id'],detail['passes'],detail)
# Check design source M01 approach to M02 M01-court arrival (not a GM token-path certification).
# Correct native-geometry bridge gate center y8.83; entrance route thereafter leads to M02 court start.
start=routeDetails[0]
prefix=LineString([(6.0,8.83),(8.75,8.83),(10.9,8.83),(13.3,9.2),tuple(b['routeTests'][0]['polyline'][0])])
footprint=prefix.buffer(1,cap_style=2,join_style=1)
intake=footprint.difference(free).area
# Intentionally do not block the gate with closed Wall for the OPEN canary. The gate itself is recorded as a special door.
test('M01-bridge-gate-to-M02-courtyard-large-footprint-open',intake<1e-5,{'sweptCollisionAreaLogical':round(intake,8),'passageWidthFt':15.25})
# Closure tests separated by topology: clip free with closed gate, separate tower front and internal security planes.
security=['D02','D03','D04'];originalDoor=door['D01'];bridgeGate=b['inheritedSpecialPlanes'][0]
def connected(a,z,extra):
 blocked=unary_union([LineString(x).buffer(.026,cap_style=2) for x in extra]) if extra else None
 openfree=free.difference(blocked) if blocked else free
 components=list(openfree.geoms) if hasattr(openfree,'geoms') else [openfree]
 return any(piece.covers(Point(a)) and piece.covers(Point(z)) for piece in components)
frontClosed=connected((24,10),(31,20),[originalDoor['segment']]);test('single-tower-front-door-closure',not frontClosed)
for opened in [[],['D02'],['D03'],['D04'],security]:
 closure=[door[d]['segment'] for d in security if d not in opened]
 t=connected((32,13),(38,13),closure)
 test('security-'+('+'.join(opened) or 'ALL_CLOSED'),t==(len(opened)>0),{'connected':t,'expected':len(opened)>0})
# Exact M01 gate crossing in theory closed should separate bridge/court but water bypass remains possible with GM movement.
# Do not claim whole map disconnected by gate since water and rope bypasses are intentional.
test('M01-gate-model-not-autoblock-boating',b['sourceReconciliation']['M01TidalOpening']['nonWalkableWater'] and b['sourceReconciliation']['M01LowerWaterAccess']['toDockElevationFt']==-8)
regions=b['plannedRegions'];test('planned-regions-have-no-active-behaviors',all(x['noRuntimeBindings'] for x in regions))
report['routeTests']=routeDetails
report['semanticElevationsFt']={'groundCourtAndTower':18,'upperTerrace':31,'lowerDock':-8,'upperStairDelta':-13,'lowerStairDelta':26}
report['status']='LOCAL_PASS_WITH_RUNTIME_BLOCKERS' if not report['failed'] else 'GEOMETRY_INSPECT_REDO'
report['caveats']=['M01 runtime Wall/Region/door state has not been authoritatively reread; inherited walls reflect the later tested macro source, not installed Scene certification.', 'M01 native artwork file identity in the installed live Scene has not been reread; pixel registration is between the approved image file and user screenshot.', 'Stair landing elevations come from accepted M01 typed geometry; exact treads and native Foundry elevation/Levels require runtime canaries.', 'The M02 new exterior path/first-floor height uses the +18ft M01 courtyard datum to avoid an invented stair at image join; user should review this elevation inference.', 'The M01 designer semantic wall source disagrees with the later macro (gate x29.4 vs x29.88; seawall removed); the later macro is used only as intended-source geometry.']
report['foundryWorldModified']=False
report['readyForGrayscaleWithoutFurtherEvidence']=not report['failed'] and False
report['nextGate']='REVIEW_REGISTERED_SOURCE_AND_STAIR_LEVELS_THEN_GRAYSCALE; LIVE REREAD REQUIRED BEFORE INJECTION'
(p/'FINAL-GEOMETRY-INSPECTION.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':report['status'],'checksPassed':len(report['passed']),'checksFailed':len(report['failed']),'failures':report['failed'],'routeTests':routeDetails},indent=2))
if report['failed']:raise SystemExit(2)
