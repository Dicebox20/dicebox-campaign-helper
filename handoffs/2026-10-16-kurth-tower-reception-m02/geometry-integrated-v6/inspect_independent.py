"""Independent local review of exact authored v6 integrated blueprint.
No importing author script; checks only source artifact. No Foundry runtime assertions.
"""
import json, hashlib, math
from pathlib import Path
from shapely.geometry import LineString, Point, box, Polygon
from shapely.ops import unary_union
ROOT=Path(__file__).parent
b=json.loads((ROOT/'spatial-blueprint.json').read_text(encoding='utf-8'))
assert b['sceneId']=='dbx.heist.kurth.m02.reception'
assert b['scale']['logicalColumns']==40 and b['scale']['logicalRows']==24
assert b['scale']['gridSizePx']==120 and b['scale']['pixels']==[4800,2880]
assert b['continuity']['isPhysicalWallAtReferenceJoin'] is False
assert b['continuity']['oneExternalTowerDoor']=='D01'
seam=b['continuity']['visualReferenceJoinXLogical']
roofs=[box(*x['bounds']) for x in b['buildingSurfaces']]
roof=unary_union(roofs)
assert roof.geom_type=='Polygon' and roof.is_valid
assert b['buildingSurfaces'][0]['bounds'][2]==seam
assert b['buildingSurfaces'][1]['bounds'][0]==seam
assert b['buildingSurfaces'][1]['bounds'][2]==b['buildingSurfaces'][2]['bounds'][0]
assert b['continuity']['towerInteriorCroppedAt']==['top','bottom','right']
assert b['continuity']['rearEntranceVisible'] is False
assert b['continuity']['m03OutOfFrameNotNewExteriorDoor'] is True
physicalWalls=[LineString(x['segment']) for x in b['walls']]
assert all(not (abs(w.coords[0][0]-seam)<1e-8 and abs(w.coords[-1][0]-seam)<1e-8) for w in physicalWalls)
exdoors=[d for d in b['doorPlanes'] if d['exteriorAccess']]
assert len(exdoors)==1 and exdoors[0]['id']=='D01'
assert exdoors[0]['segment']==[[28.65,20],[28.65,23]]
assert math.isclose(LineString(exdoors[0]['segment']).length*5,15)
assert len(b['routeTests'])==3
S=unary_union([box(*x['bounds']) for x in b['surfaces']])
W=unary_union([x.buffer(0.035,cap_style=2) for x in physicalWalls])
O=unary_union([box(*x['bounds']) for x in b['staticBlockingProps']])
free=S.difference(W.union(O))
assert free.is_valid
hazards=[Polygon(x['polygon']) for x in b['hazardPolygons']]
assert all(S.intersection(h).area<1e-9 for h in hazards), 'Water/rock overlaps accessible floor'
routeResults=[]
for r in b['routeTests']:
 trace=LineString(r['polyline'])
 swept=trace.buffer(r['requiredFootprintFt']/10,cap_style=2,join_style=1)
 collision=round(swept.difference(free).area,8)
 crossesJoin=any((a[0]-seam)*(c[0]-seam)<0 for a,c in zip(r['polyline'],r['polyline'][1:]))
 touched={x:trace.intersects(LineString(next(d['segment'] for d in b['doorPlanes'] if d['id']==x))) for x in r['doors']}
 assert r['polyline'][0][0]<seam and r['polyline'][-1][0]>35.8
 routeResults.append({'id':r['id'],'footprintFt':r['requiredFootprintFt'],'lengthFt':round(trace.length*5,1),'collisionAreaLogical':collision,'crossesImageJoinWithoutWall':crossesJoin,'doorsCrossed':touched,'pass':collision<1e-6 and crossesJoin and all(touched.values())})
# functional checkpoint isolation and single portal; topology independent of plotted route paths
D={x['id']:LineString(x['segment']) for x in b['doorPlanes']}
baseWest=Point(31.3,13.4)
baseEast=Point(38,13.4)
sec=['D02','D03','D04']
secResults={}
for opened in ([],['D02'],['D03'],['D04'],sec):
 shut=unary_union([D[k].buffer(.035,cap_style=2) for k in sec if k not in opened])
 allowed=free.difference(shut)
 polys=list(allowed.geoms) if hasattr(allowed,'geoms') else [allowed]
 isConnected=any(p.covers(baseWest) and p.covers(baseEast) for p in polys)
 expect=len(opened)>0
 key='+'.join(opened) or 'ALL_SECURITY_CLOSED'
 secResults[key]={'connected':isConnected,'expected':expect,'pass':isConnected==expect}
# Door D01 is a new front door not an open security bypass.
# Probe an exterior adjacent to the door and interior after closing it.
shut=free.difference(D['D01'].buffer(.035,cap_style=2))
polys=list(shut.geoms) if hasattr(shut,'geoms') else [shut]
extPoint=Point(26.7,21.5);inPoint=Point(31.0,21.5)
frontClosed=not any(p.covers(extPoint) and p.covers(inPoint) for p in polys)
# visual cross-section is one building, and all new elevations remain unclaimed
res={'operation':'dicebox.geometry.independent-inspect/v6','status':'LOCAL_PASS' if all(r['pass'] for r in routeResults) and all(x['pass'] for x in secResults.values()) and frontClosed else 'NEEDS_RECONCILIATION',
 'geometrySha256':hashlib.sha256(json.dumps(b,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest(),
 'sourceImageSha256':b['sources']['userAnnotatedCompositeSha256'],
 'closeupSha256':b['sources']['userCloseupSha256'],
 'scenePixels':b['scale']['pixels'],'sceneLogical':[40,24],
 'oneIntegratedViewport':True,'connectedSharedBuildingFootprint':True,'imageJoinX':seam,'imageJoinPhysicalWall':False,
 'roofExistingAndExtensionTouch':True,'towerFirstFloorCropsTopBottomRight':True,'visibleExteriorDoors':len(exdoors),
 'surfaceCount':len(b['surfaces']),'wallCountNewOnly':len(b['walls']),'doorPlaneCount':len(b['doorPlanes']),
 'routeTests':routeResults,'securityTests':secResults,'closedFrontDoorSeparatesOutdoorFromReception':frontClosed,
 'stairElevationsVerified':False,'M01OriginalPixelScaleCalibrated':False,'bridgeM01NativeWallsVerified':False,
 'foundryWorldModified':False,'foundryRuntimeCertified':False,'noArtRenderYet':True,
 'userV6Approval':'PENDING','nextGate':'GEOMETRY_VISUAL_REVIEW_THEN_SOURCE_SCALE_AND_STAIRS_RECONCILIATION'}
(ROOT/'INDEPENDENT-INSPECTION.json').write_text(json.dumps(res,indent=2)+'\n')
print(json.dumps(res,indent=2))
if res['status']!='LOCAL_PASS':raise SystemExit(2)
