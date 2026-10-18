"""DiceBox M02 v6: user-composite-reconciled, SINGLE integrated world-space Spatial Blueprint.
Preview composites a reference crop for identification only; NO wall or physical measurements
are inferred from the source pixels. Geometry authored from PREPARE and explicit user annotations.
"""
from pathlib import Path
import json,hashlib,math
from PIL import Image,ImageDraw,ImageFont,ImageEnhance
from shapely.geometry import box,Point,Polygon,LineString
from shapely.ops import unary_union
ROOT=Path(__file__).parent

def sha(path):
 return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def poly(bounds):
 x1,y1,x2,y2=bounds
 return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]]

SCALE={'profile':'battlemap-120','gridType':'gridless','logicalColumns':40,'logicalRows':24,'gridSizePx':120,'distanceFeet':5,'pixels':[4800,2880],'padding':0,'coordinateUnits':'logical 5ft cells'}
SEAM=18.45; FACADE=28.65; CHECKPOINT=35.8
S=[
 ('S01','Inherited bridge deck','inherited-m01',[0,10,11.4,14]),
 ('S02','Inherited bridge-end courtyard','inherited-m01',[10.3,7.1,SEAM,18]),
 ('S03','Inherited upper terrace and steps','inherited-m01',[11.5,2,SEAM,7.6]),
 ('S04','Inherited lower dock','inherited-m01',[11.5,17.4,SEAM,21.9]),
 ('S05','New exterior eastbound courtyard path','m02-outdoor',[SEAM,7.3,FACADE,12.4]),
 ('S06','New exterior lower path to one tower door','m02-outdoor',[24.15,10.8,FACADE,24]),
 ('S07','First-floor tower reception, visitor/records/staff side','m02-interior',[FACADE,0,CHECKPOINT,24]),
 ('S08','Secured first-floor interior cropped to scene edge','m02-interior',[CHECKPOINT,0,40,24])
]
surfaces=[{'id':i,'name':n,'ownership':k,'polygon':poly(b),'bounds':b,'elevationFt':0 if k.startswith('m02-') else 'inherited-M01-elevation-verify','walkable':True} for i,n,k,b in S]
# Semantic roof is ONE connected building footprint crossing the inherited/new image provenance join.
BUILDING=[
 ('B01','Existing building wing visible on bridge map','existing-visible-roof',[15.2,0,SEAM,7.3]),
 ('B02','Same roofline continuing beyond bridge map','new-contiguous-roof',[SEAM,0,FACADE,7.3]),
 ('B03','Tower reception first floor cropped north/south/east','interior-building',[FACADE,0,40,24]),
]
roof=[{'id':i,'name':n,'kind':k,'polygon':poly(b),'bounds':b,'walkableAtReceptionLevel':False if k!='interior-building' else True} for i,n,k,b in BUILDING]
# Physical wall geometry only on NEW authored portion, never synthesize old M01 walls from screenshot.
W=[
 ('W01','West exterior facade above entrance',[[FACADE,7.3],[FACADE,20]],'stone-exterior'),
 ('W02','West exterior facade below entrance',[[FACADE,23],[FACADE,24]],'stone-exterior'),
 ('W03','Secure screening line northmost',[[CHECKPOINT,0],[CHECKPOINT,4.3]],'interior-security'),
 ('W04','Secure screening line north-middle',[[CHECKPOINT,6.8],[CHECKPOINT,12]],'interior-security'),
 ('W05','Secure screening line south-middle',[[CHECKPOINT,15],[CHECKPOINT,20]],'interior-security'),
 ('W06','Secure screening line southmost',[[CHECKPOINT,22.5],[CHECKPOINT,24]],'interior-security')
]
walls=[{'id':i,'name':n,'segment':v,'semantic':k,'movement':True,'sight':True,'owner':'new-m02'} for i,n,v,k in W]
D=[
 ('D01','Single outdoor tower entrance',[[FACADE,20],[FACADE,23]],'exterior-door','closed',15),
 ('D02','North inspector records access',[[CHECKPOINT,4.3],[CHECKPOINT,6.8]],'interior-door','closed',12.5),
 ('D03','Main reception credential checkpoint',[[CHECKPOINT,12],[CHECKPOINT,15]],'guarded-checkpoint','closed',15),
 ('D04','South service security bypass',[[CHECKPOINT,20],[CHECKPOINT,22.5]],'interior-door','closed',12.5)
]
doors=[{'id':i,'name':n,'segment':v,'kind':k,'intendedInitialState':st,'clearWidthFt':ft,'exteriorAccess':k=='exterior-door','manualGMAdjudication':True,'owner':'new-m02'} for i,n,v,k,st,ft in D]
obstacles=[
 ('P01','Reception desk',[32.1,9.3,34.7,10.5],'interior'),
 ('P02','Registry shelves',[32.4,1.5,34.4,2.5],'interior'),
 ('P03','Registry clerk desk',[32.1,7.5,34.5,8.4],'interior'),
 ('P04','Receiving desk / supplies',[32.1,18.5,34.4,19.4],'interior'),
 ('P05','Column one',[34,10.7,34.6,11.3],'interior'),
 ('P06','Column two',[38.0,9.1,38.6,9.7],'interior'),
 ('P07','Column three',[38.0,17.1,38.6,17.7],'interior'),
]
props=[{'id':i,'name':n,'bounds':b,'kind':k,'artOwnership':'static-background','movementBlock':True} for i,n,b,k in obstacles]
# All path centerlines traverse from M01 inherited courtyard, across a NON-STRUCTURAL image seam
# into new exterior route, then through the ONE exterior tower entrance. Only INSIDE do they branch.
EXT=[(16.6,10.0),(21.0,10.0),(26.4,10.0),(26.4,21.5),(29.9,21.5)]
ROUTES=[
 ('R-PUBLIC','Public credential screening',10,['D01','D03'], EXT+[(31.1,19.1),(31.1,13.3),(34.5,13.3),(37.0,13.3),(39.1,13.3)]),
 ('R-INSPECTOR','North records/inspector bypass',5,['D01','D02'],EXT+[(30.4,19.4),(30.4,5.55),(34.6,5.55),(37.0,5.55),(37.0,13.3),(39.1,13.3)]),
 ('R-STAFF','South staff/logistics bypass',5,['D01','D04'],EXT+[(32.4,21.5),(34.7,21.5),(37.0,21.5),(37.0,13.3),(39.1,13.3)])
]
routes=[{'id':i,'name':n,'requiredFootprintFt':ft,'doors':ds,'polyline':[[x,y] for x,y in path],'start':'existing-M01-courtyard','finish':'M03-internal-continuation-beyond-right-crop','doorBindingsAreProposed':True} for i,n,ft,ds,path in ROUTES]
# Incoming higher/lower landings are not guessed or duplicated in M02. Their exact height
# must be independently read from existing M01 source/Foundry runtime prior to live install.
transitions=[
 {'id':'V01','name':'Existing M01 upper terrace landing','bounds':[14.0,6.3,17.5,8.6],'status':'source M01 elevation/stair reread pending','wallAuthority':'inherited-M01-not-recreated'},
 {'id':'V02','name':'Existing M01 lower dock landing','bounds':[14.0,17.2,17.7,20.8],'status':'source M01 elevation/stair reread pending','wallAuthority':'inherited-M01-not-recreated'}
]
regions=[
 {'id':'dbx.heist.m02.arrival.reception','bounds':[15.4,9.0,17.7,11.2],'kind':'GM-hidden-proposed','noRuntimeBindings':True},
 {'id':'dbx.heist.m02.check.credentials','bounds':[33.0,12.0,35.3,14.8],'kind':'GM-hidden-proposed','noRuntimeBindings':True},
 {'id':'dbx.heist.m02.access.staff','bounds':[32.0,20.2,34.5,22.3],'kind':'GM-hidden-proposed','noRuntimeBindings':True},
 {'id':'dbx.heist.m02.transition.security-machinery','bounds':[38.3,12.3,39.8,14.7],'kind':'GM-hidden-proposed','noRuntimeBindings':True}
]
# World-space semantic instance: there is NO blank separate-M01 block, and both the bridge
# building roof + reception footprint join into one contiguous building mass.
footprint=unary_union([box(*x[3]) for x in BUILDING]); assert footprint.geom_type=='Polygon' and footprint.is_valid
walkable=unary_union([box(*x[3]) for x in S]);assert walkable.is_valid
wallShape=unary_union([LineString(s).buffer(.035,cap_style=2) for _,_,s,_ in W])
propsShape=unary_union([box(*p[2]) for p in obstacles]);free=walkable.difference(wallShape.union(propsShape))
assert free.is_valid
water=Polygon([(18.45,20.6),(20,20.7),(21.2,21.8),(23.7,22.3),(23.7,24),(18.45,24)])
rocks=Polygon([(18.45,12.5),(23.9,12.5),(23.7,15.0),(22.1,18.0),(23.8,22),(21.4,21),(18.45,20.4)])
assert free.intersection(water).area<1e-9 and free.intersection(rocks).area<1e-9

# Segment/door crossing and swept sizes to be INDEPENDENTLY retested by inspect_v6.py.
blueprint={
 'schemaVersion':'dicebox-geometry-blueprint/v2.1-beta-integrated-v6',
 'sceneId':'dbx.heist.kurth.m02.reception',
 'sceneKey':'kurth-tower-reception-m02',
 'stage':'GEOMETRY_AUTHOR_LOCAL_CANDIDATE_NEEDS_USER_APPROVAL',
 'coordinateUnits':'logical-5ft-cells-not-unreviewed-pixels','scale':SCALE,
 'sources':{'prepareRef':'feature/dicebox-scene-injector-v2-1-beta-2026-10-16:handoffs/2026-10-16-kurth-tower-reception-m02/PREPARE.md',
  'userAnnotatedCompositeSha256':sha(ROOT/'user-composite-source.png'),
  'userCloseupSha256':sha(ROOT/'user-building-corner-source.png'),
  'referenceAlignment':'visual-provenance-only; exact prior M01 wall/elevation/Scene UUID still pending source reread'},
 'continuity':{
  'layout':'ONE continuous M02 scene viewport (M01 inherited context + new exterior path + tower building first floor)',
  'visualReferenceJoinXLogical':SEAM,'isPhysicalWallAtReferenceJoin':False,
  'buildingIsSingleConnectedFootprint':True,
  'visibleBuildingStartsInM01':True,
  'existingBuildingRoofB01DirectlyJoinsNewRoofB02':True,
  'newRoofB02AdjoinsFirstFloorB03':True,
  'courtyardOutdoors':True,'oneExternalTowerDoor':'D01','rearEntranceVisible':False,
  'towerInteriorCroppedAt':['top','bottom','right'],'m03OutOfFrameNotNewExteriorDoor':True,
  'towerFacingExteriorWallXLogical':FACADE,'doorAtLowerWestFacade':True},
 'sourceRefRegions':{'M01InheritedArtViewport':[0,0,SEAM,24],'sketchScaleIsNotNativeM01Geometry':True},
 'buildingSurfaces':roof,
 'surfaces':surfaces,'walls':walls,'doorPlanes':doors,'staticBlockingProps':props,
 'routeTests':routes,'plannedRegions':regions,'verticalTransitions':transitions,
 'hazardPolygons':[{'id':'H01','kind':'water','polygon':list(map(list,water.exterior.coords)),'walkable':False},{'id':'H02','kind':'rock','polygon':list(map(list,rocks.exterior.coords)),'walkable':False}],
 'runtimeBindingsAuthored':False,'createdNativeFoundryDocuments':False,'authoritativeFoundryGeometryFromUnreviewedPixels':False,
 'geometryStageOnly':True
}
raw=json.dumps(blueprint,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf-8')
(ROOT/'spatial-blueprint.json').write_text(json.dumps(blueprint,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print('Blueprint canonical SHA256',hashlib.sha256(raw).hexdigest())

# One integrated preview, with the actual user M01 bridge/courtyard image on the SAME
# logical 40x24 coordinate system as all new geometry; not a two-map schematic.
scale=31
ox,oy=74,83
artW,artH=40*scale,24*scale
Wim,Him=artW+365,artH+165
im=Image.new('RGB',(Wim,Him),'#ebedef')
d=ImageDraw.Draw(im)
P=lambda x,y:(round(ox+x*scale),round(oy+y*scale))
# Base background for unified viewport
D=(ox,oy,ox+artW,oy+artH)
d.rectangle(D,fill='#cdd6db')
# ref screenshot is visually aligned only and intentionally stays ONE merged viewport
ref=Image.open(ROOT/'user-composite-source.png').convert('RGB').crop((0,0,590,729))
ref=ImageEnhance.Brightness(ref).enhance(0.85)
ref=ref.resize((round(SEAM*scale),artH),Image.Resampling.LANCZOS)
im.paste(ref,(ox,oy));d=ImageDraw.Draw(im)
# New continuation roof: dark shingles attach to the roof emerging from the M01 screenshot.
roofrect=(P(SEAM,0),P(FACADE,7.3))
d.polygon([P(SEAM,0),P(FACADE,0),P(FACADE,7.3),P(SEAM,7.3)],fill='#30363e')
# shingles to explain architectural material continuity without claiming a paint render
for y in [i/2 for i in range(1,15)]:
 d.line([P(SEAM,y),P(FACADE,y)],fill='#4b5360',width=1)
for xi in range(19,29):
 d.line([P(xi,0),P(xi+1,7.3)],fill='#3c4552',width=1)
# water, rock and ground on the NEW side (no pixel-based wall positions)
d.rectangle([P(SEAM,7.3),P(FACADE,24)],fill='#c3ccd2')
waterShape=[P(*x) for x in list(water.exterior.coords)]; d.polygon(waterShape,fill='#286b80')
rockShape=[P(*x) for x in list(rocks.exterior.coords)]; d.polygon(rockShape,fill='#77716b')
# uniform path fill, both components share geometry including courtyard join
for s in surfaces:
 if s['ownership']=='m02-outdoor':
  d.rectangle([P(*s['bounds'][:2]),P(*s['bounds'][2:])],fill='#c5b49b')
# floor extends top/right/bottom beyond viewport; no external perimeter is drawn there
for s in surfaces:
 if s['ownership']=='m02-interior':
  d.rectangle([P(*s['bounds'][:2]),P(*s['bounds'][2:])],fill=('#e8d8bb' if s['id']=='S07' else '#d9e3d2'))
# Interior floor texture only, not a rendered gridded battlemap
for x in [FACADE+i/2 for i in range(1,23)]:
 if x>40:break
 d.line([P(x,0),P(x,24)],fill='#d2c4ad',width=1)
for y in [i/2 for i in range(1,48)]:d.line([P(FACADE,y),P(40,y)],fill='#d2c4ad',width=1)
# precise semantic building frontage and interior checkpoint walls
for w in walls:
 color='#2b3034' if w['semantic']=='stone-exterior' else '#414047'
 d.line([P(*xy) for xy in w['segment']],fill=color,width=7)
for door in doors:
 col='#53995c' if door['exteriorAccess'] else '#966d43'
 d.line([P(*xy) for xy in door['segment']],fill=col,width=7)
# Building part actually spans BOTH prior artwork and new drawing.
# Draw shared roof outline y=7.3 beginning just east of the inherited pictured roof.
d.line([P(SEAM,7.3),P(FACADE,7.3)],fill='#59616c',width=4)
# furnishings and columns
for prop in props:
 b=prop['bounds']; p1=P(*b[:2]);p2=P(*b[2:]);d.rounded_rectangle([p1,p2],radius=3,fill='#8a8377',outline='#5e5149',width=2)
# Visual continuity callout: a seamless BRIDGE-END courtyard-to-path line across x=18.45
# The join is a provenance seam ONLY. No wall/portal is drawn there.
for route in routes:
 color={'R-PUBLIC':'#1b73ca','R-INSPECTOR':'#be8b1f','R-STAFF':'#239352'}[route['id']]
 points=[P(*a) for a in route['polyline']]
 d.line(points,fill=color,width=5,joint='curve')
 for xy in points[1:-1]:d.ellipse([xy[0]-3,xy[1]-3,xy[0]+3,xy[1]+3],fill=color)
# overlay only a subtle graphic hint in the true path open corridor, no fake rock/water islands
try:
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
 fontb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
 tiny=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
except OSError:
 font=fontb=tiny=ImageFont.load_default()
labels=[('Existing bridge',3.8,10.4),('M01 courtyard',13.0,13.3),('Same roof extends here',23.4,3.0),('Open path',21.9,9.1),('Rock',21.7,17.0),('Water',21.4,22.8),('Tower entrance',30.0,22.8),('Reception',32.0,13.8),('Restricted',37.4,15.8)]
for label,x,y in labels:
 pt=P(x,y)
 d.text(pt,label,anchor='mm',font=tiny,fill='#171b20',stroke_fill='#eff0ea',stroke_width=2)
# Title & legend
header='M02 — INTEGRATED GEOMETRY v6  ·  ONE SCENE / SHARED BUILDING FOOTPRINT'
d.text((ox,23),header,fill='#20242a',font=fontb)
d.text((ox,artH+oy+18),'The M01 image join is NOT a wall or a separate map. New wall planes come ONLY from authored geometry.',fill='#33434c',font=tiny)
x=artW+ox+15
legend=[('Actual M01 bridge/courtyard ref','#7d8290'),('Roof continuing M01 building','#30363e'),('New exterior path','#c5b49b'),('Cliff / rock','#77716b'),('Water','#286b80'),('Tower first floor','#e8d8bb'),('Reception security wall','#414047'),('Only OUTDOOR door','#53995c'),('Public / Large route','#1b73ca'),('Records / Medium route','#be8b1f'),('Staff / Medium route','#239352')]
for i,(txt,col) in enumerate(legend):
 y=oy+25+i*53
 d.rounded_rectangle((x,y,x+20,y+20),radius=3,fill=col)
 d.text((x+28,y-1),txt,fill='#26303b',font=tiny)
d.multiline_text((x,oy+632),'BUILDING LINK:\nvisible roof in existing M01\n  → roof continues across join\n  → first-floor tower reception\n\nNO rear exterior door\nInterior clipped at 3 map edges\nNo painterly render / no Foundry write',fill='#2c3640',font=tiny,spacing=7)
preview=ROOT/'M02-unified-geometry-v6-preview.png';im.save(preview)
receipt={'status':'GEOMETRY_AUTHOR_COMPLETE_PENDING_INDEPENDENT_INSPECT','blueprintSha256':hashlib.sha256(raw).hexdigest(), 'integratedViewport':True,'oneContinuousBuildingFootprint':footprint.geom_type=='Polygon','imageJoinNotWall':True,'newPhysicalWalls':len(walls),'towerExteriorDoorCount':sum(d['exteriorAccess'] for d in doors),'firstFloorCroppedAt':['top','bottom','right'],'output':str(preview),'sourceHashes':{'userComposite':sha(ROOT/'user-composite-source.png'),'userBuildingCloseup':sha(ROOT/'user-building-corner-source.png')},'liveFoundryMutation':False}
(ROOT/'AUTHOR-RECEIPT.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt,indent=2))
