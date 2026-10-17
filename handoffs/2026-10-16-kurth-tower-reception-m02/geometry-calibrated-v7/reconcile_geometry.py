"""M02 v7 accepted M01 source registration & dual-provenance, Foundry read-only.
Source M01 geometry: Dicebox20/dicebox-campaign-helper feature/.../spatial-blueprint-render-reconciled.json
Source v6 approved geometry: f822725e697e39a07241f6ff8219a6a4321cab7a84b32766774fce0a83e66fd6
Image is reference evidence; native collision authority from typed model only.
"""
from pathlib import Path
import json,copy,hashlib,math,re,ast
import cv2
import numpy as np
from shapely.geometry import box,Polygon,LineString,Point
from shapely.ops import unary_union
from PIL import Image,ImageDraw,ImageFont
BASE=Path('/mnt/data/dicebox_heist_design/kurth-tower-m02')
OUT=BASE/'geometry-final-v7'
V6=BASE/'geometry-integrated-v6'
ART=Path('/mnt/data/dicebox_heist_design/dark-arch-m01/paint-render-2026-10-16/painterly-candidate.png')
SCREEN=V6/'user-composite-source.png'
MACRO=BASE.parent/'dark-arch-m01'/'final-injection'/'DiceBox-Dark-Arch-M01-Painterly-Injector-V2.1-Beta-PREVIEW-FIX.md'

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def canon(o):return json.dumps(o,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
v6=json.loads((V6/'spatial-blueprint.json').read_text())
assert hashlib.sha256(canon(v6)).hexdigest()=='f822725e697e39a07241f6ff8219a6a4321cab7a84b32766774fce0a83e66fd6'

# Deterministic SIFT feature-matched screenshot-to-M01 accepted native artwork alignment.
master=cv2.imread(str(ART)); screen=cv2.imread(str(SCREEN))
assert master.shape[:2]==(971,1619) and screen.shape[:2]==(729,1283)
S=cv2.SIFT_create(nfeatures=4500,contrastThreshold=.025)
K1,D1=S.detectAndCompute(cv2.cvtColor(master,cv2.COLOR_BGR2GRAY),None)
K2,D2=S.detectAndCompute(cv2.cvtColor(screen[:725,:588],cv2.COLOR_BGR2GRAY),None)
matches=cv2.BFMatcher(cv2.NORM_L2).knnMatch(D2,D1,k=2)
good=[a for a,b in matches if a.distance<.72*b.distance]
a=np.float32([K2[x.queryIdx].pt for x in good]).reshape(-1,1,2)
b=np.float32([K1[x.trainIdx].pt for x in good]).reshape(-1,1,2)
A,inliers=cv2.estimateAffinePartial2D(a,b,method=cv2.RANSAC,ransacReprojThreshold=2,maxIters=10000)
assert A is not None
pred=cv2.transform(a,A).reshape(-1,2)
err=np.linalg.norm(pred-b.reshape(-1,2),axis=1)
mask=inliers.ravel().astype(bool)
median=float(np.median(err[mask])); n=int(mask.sum())
scaleMasterPerScreenshot=math.hypot(A[0,0],A[0,1])
assert n>400 and median<1.0 and .8<A[0,0]<1.8 and abs(A[0,1])<.01
# Crop screenshot starting source x ~815.2 where M01 master page ends at x1619
crop_source_x=float(A[0,2])
source_left_logical=crop_source_x*40/1619
SEAM=40-source_left_logical
assert 19.7<SEAM<20.05,(SEAM,source_left_logical)
oldSeam=18.45
newScale=(40-SEAM)/(40-oldSeam)
# Map old v6 x into native same-scale M01 segment followed by fitted new geometry.
def mapx(x):return x*SEAM/oldSeam if x<=oldSeam else SEAM+(x-oldSeam)*newScale
def point(pt):return [round(mapx(pt[0]),5),pt[1]]
def bounds(b):return [round(mapx(b[0]),5),b[1],round(mapx(b[2]),5),b[3]]
def polygon(pts):return [point(q) for q in pts]

# Authoritative M01 source excerpt from accepted repo reviewed model (not inferred from art)
# Source metadata Github blob SHA 64162fde8842fee029a5a2183d0679c9c5453f15
m01={'reference':'handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/spatial-blueprint-render-reconciled.json',
     'githubBlobSha':'64162fde8842fee029a5a2183d0679c9c5453f15',
     'blueprintCanonicalSha256':'6386442ea0e241d0f58581d66146e9177d54ebe86497b83636fffa7d12f117ab',
     'scale':{'logical':[40,24],'pixels':[4800,2880],'feetPerCell':5,'nativeArtPx':[1619,971]},
     'surfaces':[
      ['G02','bridge',[8,7.1,30,11.1],18],['G03','bridge',[15.5,6.5,21.2,12],18],
      ['G04','hoist-yard',[21.5,5.3,26.8,8.2],18],['G05','court',[29.5,6.7,40,14.2],18],
      ['G06','map2-exit',[38,8.5,40,11.5],18],['G09','island-dock',[30.3,16.5,38.5,21.5],-8],
      ['G10','island-dock-stair',[35.5,12.7,38.7,18.2],[-8,18]],
      ['G11','upper-terrace',[30,.8,36.6,4.7],31],
      ['G12','upper-terrace-stair',[34.5,3.5,38,8.4],[31,18]],
      ['G13','rig-access',[21.5,5.3,24,7.9],[18,45]]],
     'walls':[
       ['W01','bridge-parapet',[[8,7.1],[15.5,7.1]],24],
       ['W02','bridge-parapet',[[21.2,7.1],[29.4,7.1]],24],
       ['W03','bridge-parapet',[[8,11.1],[15.5,11.1]],24],
       ['W04','bridge-parapet',[[21.2,11.1],[29.4,11.1]],24],
       ['W05','fortress-wall',[[29.4,0],[29.4,7.2]],30],
       ['W06','gate-portal',[[29.4,7.2],[29.4,10.2]],30],
       ['W07','fortress-wall',[[29.4,10.2],[29.4,16]],30],
       ['W08','tidal-opening',[[29.4,16],[29.4,20]],None],
       ['W09','fortress-seawall',[[29.4,20],[29.4,24]],18],
       ['W10','terrace-parapet',[[30,.8],[36.6,.8]],36]],
     'verticalTransitions':[
       {'sourceId':'V02','sourceSurface':'G10','name':'island-dock-switchback','startElevationFt':-8,'endElevationFt':18,'treadsVerified':False},
       {'sourceId':'V03','sourceSurface':'G12','name':'upper-terrace-steps','startElevationFt':31,'endElevationFt':18,'treadsVerified':False},
       {'sourceId':'V04','sourceSurface':'G13','name':'hoist-rig-climb','startElevationFt':18,'endElevationFt':45,'treadsVerified':False}],
     'transfers':[{'sourceId':'T01','kind':'water-vessel','notWalkable':True,'m01OpeningFt':20},
                  {'sourceId':'T02','kind':'rope-swing','GMAdjudicated':True,'startElevationFt':45,'endElevationFt':31}],
     'runtimeVerified':False}
(OUT/'M01-SOURCE-EXTRACT.json').write_text(json.dumps(m01,indent=2)+'\n')

new=copy.deepcopy(v6)
new['schemaVersion']='dicebox-geometry-blueprint/v2.1-beta-m01-calibrated-v7'
new['stage']='FINAL_GEOMETRY_INSPECT_LOCAL_PENDING_USER_REVIEW'
new['registration']={
  'status':'LOCAL_SOURCE_ART_TO_SCREEN_VERIFIED_RUNTIME_NOT_VERIFIED',
  'method':'SIFT plus affine RANSAC; original approved M01 painterly source to user screenshot crop',
  'masterApprovedArtSha256':digest(ART),'userCompositeSha256':digest(SCREEN),
  'screenshotToArtAffine':A.tolist(),'inlierCount':n,'candidateMatchCount':len(good),
  'medianInlierResidualPx':round(median,5),'p95InlierResidualPx':round(float(np.quantile(err[mask],.95)),5),
  'originalMasterDimensionsPx':[1619,971],
  'screenshotOriginalSourcePixelLeft':round(crop_source_x,4),
  'm01OriginalLeftLogicalCell':round(source_left_logical,5),
  'm01ToM02Logical':{'x':'newX = oldM01X - '+str(round(source_left_logical,5)),'y':'unchanged; full master native art height 971px mapped to scene height 24 cells'},
  'm02ImageJoinXLogical':round(SEAM,5),
  'sceneLogicalSize':[40,24],
  'pixelToFoundryLocal':'M01 native source crop placed at source-native scale = (2880 / 971) output px per source px; no horizontal stretching',
  'originalM01ImageActuallyInstalledInLiveFoundry':'NOT_VERIFIED',
  'paintingPixelsNotNativeWallAuthority':True}
new['continuity']['visualReferenceJoinXLogical']=round(SEAM,5)
new['continuity']['towerFacingExteriorWallXLogical']=round(mapx(28.65),5)
new['continuity']['geometryFromAcceptedM01OriginalBlueprint']=True
new['continuity']['imageJoinPhysicalWall']=False
new['sourceRefRegions']['M01InheritedArtViewport']=[0,0,round(SEAM,5),24]
new['sourceRefRegions']['sketchScaleIsNotNativeM01Geometry']=False
new['sourceRefRegions']['originalM01InstalledAssetUnverified']=True
# Transform approved new M02 shapes only, NEVER rescale inherited M01 native source shapes. 
for o in new['buildingSurfaces']:
 o['polygon']=polygon(o['polygon']);o['bounds']=bounds(o['bounds'])
 if o['id']=='B01':
  # B01 is painterly roof reference (not M01 typed wall); x inferred as proposed boundary from user-approved screenshot
  # preserve original conceptual corner but mark visual uncertainty explicitly.
  o['visualBoundaryIsProposal']=True
for o in new['surfaces']:
 if o.get('ownership')=='inherited-m01':
  continue
 o['polygon']=polygon(o['polygon']);o['bounds']=bounds(o['bounds'])
 # The new courtyard path and tower first floor must remain on the M01 inner-court deck datum.
 # v6 provisional elevation 0 would invent an 18ft drop across a seamless outdoor join.
 if o.get('ownership') in ('m02-outdoor','m02-interior'):
  o['elevationFt']=18
  o['elevationProvenance']='M01 accepted G05 inner island court +18ft; no unapproved stair across artwork seam'
for o in new['walls']:
 o['segment']=[point(p) for p in o['segment']]
for o in new['doorPlanes']:
 o['segment']=[point(p) for p in o['segment']]
 # Widths change because the v6 piecewise transform scales X (vertical doors retain original width)
for o in new['staticBlockingProps']:
 o['bounds']=bounds(o['bounds'])
for o in new['routeTests']:
 o['polyline']=[point(p) for p in o['polyline']]
 if o['id']=='R-PUBLIC':
  # Minimal authored waypoint adjustment to preserve 10ft Large sweep past P04.
  # Replaces previously approved 31.1 center line with 31.0 (half-foot shift).
  o['polyline']=[[round(mapx(31.0),5),y] if abs(x-mapx(31.1))<1e-4 else [x,y] for x,y in o['polyline']]
  o['waypointRefinement']='half-foot westward waypoint adjustment near receiving desk P04 to preserve Large-token swept clearance'
for o in new['plannedRegions']:
 o['bounds']=bounds(o['bounds'])
for o in new['hazardPolygons']:
 o['polygon']=polygon(o['polygon'])
# Replace screenshot-authored M01 walkables with exact typed-source M01 surfaces translated into current local coords and clipped.
sourceSurface=[]
for sid,kind,bb,elev in m01['surfaces']:
 orig=box(*bb).intersection(box(source_left_logical,0,40,24))
 if orig.is_empty:continue
 geom=Polygon([(x-source_left_logical,y) for x,y in orig.exterior.coords[:-1]])
 xmin,ymin,xmax,ymax=geom.bounds
 sourceSurface.append({'id':'M01-'+sid,'sourceId':sid,'name':kind,'ownership':'inherited-M01-proposed-geometry-only',
   'polygon':[[round(x,5),round(y,5)] for x,y in list(geom.exterior.coords)[:-1]],'bounds':[round(xmin,5),ymin,round(xmax,5),ymax],
   'elevationFt':elev,'walkable':True,'sourceAuthority':'M01 accepted spatial blueprint; installed live document not reread'})
new['surfaces']=[o for o in new['surfaces'] if o.get('ownership')!='inherited-m01']+sourceSurface
# Installed-candidate macro is more recent implementation evidence than M01 design-only wall blueprint.
# The user reports M01 usable, but live Foundry Wall document list is not reread in this turn.
text=MACRO.read_text(encoding='utf-8')
match=re.search(r'const WALL_SPEC\s*=\s*\[(.*?)\];',text,re.S)
assert match is not None
macroWalls=ast.literal_eval('['+match.group(1)+']')
assert len(macroWalls)==14
macro_ids={w[0] for w in macroWalls}
assert len(macro_ids)==14 and sum(len(w)>5 and w[5]=='gate' for w in macroWalls)==1
inherited=[];opening=[]
for rec in macroWalls:
 sid,x1,y1,x2,y2,*rest=rec
 kind='gate-portal' if rest==['gate'] else 'macro-solid-wall'
 line=LineString([(x1,y1),(x2,y2)]).intersection(box(source_left_logical,0,40,24))
 if line.is_empty or line.geom_type!='LineString' or line.length<1e-5:continue
 coords=[[round(x-source_left_logical,5),round(y,5)] for x,y in line.coords]
 entry={'id':'M01-DEPLOY-'+sid,'sourceId':sid,'segment':coords,'semantic':kind,
   'owner':'M01-deployed-macro-intent','installedDocumentReread':False,
   'referenceMacroSha256':digest(MACRO),'notNewRuntimeOwnedGeometry':True}
 if kind=='gate-portal':
  entry['authoredAsSolidWall']=False
  entry['requiresRuntimeDoorInterpretation']=True
  opening.append(entry)
 else:
  entry['authoredAsSolidWall']=True
  inherited.append(entry)
# The original M01 semantic source includes a seawall beneath the tidal opening.
# The later deployment macro excludes that seawall to preserve the boat route.
# Do not reintroduce this known superseded design wall into new proposed runtime geometry.
assert all(w['id']!='M01-DEPLOY-W09-SEAWALL' for w in inherited)
new['inheritedWalls']=inherited
new['inheritedSpecialPlanes']=opening
new['sourceReconciliation']={
 'M01Source':m01['reference'],'M01GitHubBlobSha':m01['githubBlobSha'],
 'M01SemanticModelSha256':m01['blueprintCanonicalSha256'],
 'M01LaterDeploymentMacroReference':str(MACRO.relative_to(BASE.parent)),
 'M01LaterDeploymentMacroSha256':digest(MACRO),
 'M01LaterMacroWallSpecCount':len(macroWalls),
 'sourceDisagreement':'accepted original M01 model gate x29.4 vs later macro gate x29.88; original model seawall exists but later macro omits it; use later macro-intent wall geometry for overlap; runtime document reread still pending',
 'inheritedNativeWallsStatuses':'later deployment macro candidate, actual live Wall/Region documents NOT verified',
 'inheritedSolidWallCount':len(inherited),'inheritedSpecialOpeningCount':len(opening),
 'inheritedSourceSurfacesCount':len(sourceSurface),
 'M01WaterOpeningIsNotWalkable':True,
 'M01SeawallExcludedFromProposedGeometry':True,
 'M01TidalOpening':{'sourceId':'W08','xLogical':round(29.4-source_left_logical,5),'yInterval':[16,20],'nonWalkableWater':True,'skiffAdjudicated':True,'notNativeWall':True},
 'M01LowerWaterAccess':{'sourceId':'T01','fromDockElevationFt':-8,'toDockElevationFt':-8,'crossingWaterNonWalkable':True},
 'semanticRoofContinuation':'user visual-approved architectural boundary, NOT inferred runtime wall ownership'}
# Preserve distinct landings; do not invent stair treads or tokens from a screenshot.
new['verticalTransitions']=[
 {'id':'M01-V03','sourceId':'V03','name':'Upper terrace stair to inner court','surface':'M01-G12',
  'startElevationFt':31,'endElevationFt':18,'elevationDeltaFt':-13,'clearanceStatus':'tread/landing measurement unresolved',
  'bounds':[round(34.5-source_left_logical,5),3.5,round(38-source_left_logical,5),8.4],
  'source':'M01 accepted reconciled spatial blueprint, not pixel height inference','liveFoundryVerified':False},
 {'id':'M01-V02','sourceId':'V02','name':'Lower dock switchback stair to inner court','surface':'M01-G10',
  'startElevationFt':-8,'endElevationFt':18,'elevationDeltaFt':26,'clearanceStatus':'tread/landing measurement unresolved',
  'bounds':[round(35.5-source_left_logical,5),12.7,round(38.7-source_left_logical,5),18.2],
  'source':'M01 accepted reconciled spatial blueprint, not pixel height inference','liveFoundryVerified':False}]
new['geometryStageOnly']=True
new['createdNativeFoundryDocuments']=False
new['authoritativeFoundryGeometryFromUnreviewedPixels']=False
new['finalGeometrySourceM01ArtRegisteredButNotLiveVerified']=True
# unchanged stage; PASS or BLOCK decided only by independent inspector
new['independentInspectionStatus']='PENDING'
(OUT/'spatial-blueprint.json').write_text(json.dumps(new,indent=2)+'\n')

# registered inherited art preview using unscaled pixel identity; screenshot not used as final map.
img=Image.open(ART).convert('RGB')
SX0=int(round(crop_source_x))
crop=img.crop((SX0,0,1619,971))
# Geometry preview at 30px per logical cell; native scale for x and y 1:1 in logical units.
C=30;X,Y=40*C,24*C;ox,oy=48,80
from PIL import Image as I
im=I.new('RGB',(X+370,Y+150),'#e9ecef');d=ImageDraw.Draw(im)
# source crop is 19.86 cells wide; render at exactly 30 pixels per logical cell; no stretch outside source dimensions
cropWidth=int(round((1619-crop_source_x)/1619*40*C))
crop= crop.resize((cropWidth,Y),I.Resampling.LANCZOS)
im.paste(crop,(ox,oy))
P=lambda q:(round(ox+q[0]*C),round(oy+q[1]*C))
# new m02 surface fills only x>=seam, 20% alpha-like flat solid (not paint)
color={'m02-outdoor':'#c6ad8b','m02-interior':'#f3dec0'}
for o in new['surfaces']:
 if o.get('ownership') not in color:continue
 d.polygon([P(q) for q in o['polygon']],fill=color[o['ownership']])
for o in new['buildingSurfaces']:
 if o['id'] in ('B01','B02'):
  # rooftop continuation, never treat roof line as ground-level collision wall
  d.polygon([P(q) for q in o['polygon']],fill='#333943')
for o in new['hazardPolygons']:
 d.polygon([P(q) for q in o['polygon']],fill='#3e7687' if o['kind']=='water' else '#827973')
for w in inherited:
 d.line([P(q) for q in w['segment']],fill='#e95643',width=3)
for w in opening:
 d.line([P(q) for q in w['segment']],fill='#f2ca42' if w['semantic']=='gate-portal' else '#53d0e6',width=5)
for w in new['walls']:
 d.line([P(q) for q in w['segment']],fill='#27313f',width=5)
for w in new['doorPlanes']:
 d.line([P(q) for q in w['segment']],fill='#79ab57' if w['id']=='D01' else '#b87741',width=6)
for o in new['staticBlockingProps']:
 bb=o['bounds'];d.rectangle([P(bb[:2]),P(bb[2:])],fill='#8d8d88',outline='#333333',width=1)
routecolors={'R-PUBLIC':'#175fd4','R-INSPECTOR':'#d4a033','R-STAFF':'#38a154'}
for r in new['routeTests']:
 d.line([P(q) for q in r['polyline']],fill=routecolors[r['id']],width=4)
try:
 f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
 fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',21)
except OSError:f=fb=ImageFont.load_default()
d.text((48,25),'M02 V7  |  M01 CALIBRATED WALLS + STAIRS  |  ONE SCENE',fill='#27313d',font=fb)
d.line([P((SEAM,0)),P((SEAM,24))],fill='#c46bd9',width=2)
d.text((P((SEAM,0))[0]+6,oy+10),'ART JOIN (NO WALL)',font=f,fill='#e279fb',stroke_fill='#1b1e20',stroke_width=2)
notes=['RED  original M01 solid walls','YELLOW  original gate opening','CYAN  tidal water opening','DARK  authored M02 walls','GREEN  only new exterior door','BLUE/AMBER/GREEN  routes','MAGENTA  calibrated art join','','No live Foundry reread','Stair heights = M01 geometry intent','Tread details = unresolved']
for i,txt in enumerate(notes):d.text((X+70,110+i*34),txt,font=f,fill='#252c37')
d.text((48,Y+97),f'M01 art source crop x={crop_source_x:.2f}px -> local x=0..{SEAM:.3f}; image is a local preview, not installer background',font=f,fill='#27313d')
im.save(OUT/'M02-calibrated-geometry-preview.png')
(OUT/'REGISTRATION-RECEIPT.json').write_text(json.dumps({'status':'LOCAL_VISUAL_ART_REGISTRATION_PASS','siftRansacInliers':n,'goodMatches':len(good),'medianResidualPx':median,'p95ResidualPx':float(np.quantile(err[mask],.95)),'screenToSourceAffine':A.tolist(),'M01ApprovedArtSHA256':digest(ART),'sourceExcerptSha256':digest(OUT/'M01-SOURCE-EXTRACT.json'),'deploymentMacroSha256':digest(MACRO),'screenshotSHA256':digest(SCREEN),'M01LocalCropXSourcePx':crop_source_x,'M01OriginalOffsetLogical':source_left_logical,'newSeamXLogical':SEAM,'nativeArtScalePreserved':True,'installedArtReread':False},indent=2)+'\n')
print(json.dumps({'status':'SOURCE_REGISTERED_FOR_OFFLINE_INSPECT','inliers':n,'medianResidualPx':median,'seam':SEAM,'sourceLeftLogical':source_left_logical,'M01SourceWalls':len(inherited),'M01Openings':len(opening),'M01Surfaces':len(sourceSurface),'newTowerX':new['continuity']['towerFacingExteriorWallXLogical']},indent=2))
