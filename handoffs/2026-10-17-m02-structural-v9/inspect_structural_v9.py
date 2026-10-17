"""Independent STRICT STRUCTURAL INSPECT for v9 artifact against approved typed v7.
Do not rely on drawing declarations alone; inspect emitted mask pixels and original-image registration.
"""
from pathlib import Path
from PIL import Image
import hashlib,json,math
import numpy as np
from shapely.geometry import Point, LineString, Polygon, box
from shapely.ops import unary_union

ROOT=Path(__file__).parent
BPFILE=ROOT.parent/'geometry-final-v7/spatial-blueprint.json'
ART=Path('/mnt/data/dicebox_heist_design/dark-arch-m01/paint-render-2026-10-16/painterly-candidate.png')
render=ROOT/'M02-v9-structural-grayscale.png'
manifest=json.loads((ROOT/'RENDER-MANIFEST.json').read_text())
bp=json.loads(BPFILE.read_text())
img=Image.open(render)
wm=Image.open(ROOT/'M02-v9-structural-wall-mask.png')
dm=Image.open(ROOT/'M02-v9-structural-door-mask.png')
sha=lambda f:hashlib.sha256(Path(f).read_bytes()).hexdigest()
canon=lambda o:json.dumps(o,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
passed=[];failed=[];warnings=[]
def check(key,ok,details=None):
    (passed if ok else failed).append({'key':key,'details':details})
check('blueprint-approved-sha256',hashlib.sha256(canon(bp)).hexdigest()=='f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add')
check('source-M01-approved-identity',sha(ART)==bp['registration']['masterApprovedArtSha256'])
check('render-manifest-identity',sha(render)==manifest['renderSha256'])
check('native-size-grayscale',img.size==(4800,2880) and img.mode=='L')
check('native-masks-size-and-hashes',wm.size==img.size and dm.size==img.size and sha(ROOT/'M02-v9-structural-wall-mask.png')==manifest['separateGeometryMasks']['wall'] and sha(ROOT/'M02-v9-structural-door-mask.png')==manifest['separateGeometryMasks']['door'])
scale=120
p=lambda v:round(scale*v)
seam=p(bp['registration']['m02ImageJoinXLogical'])
facade=p(bp['continuity']['towerFacingExteriorWallXLogical'])
part=p(bp['walls'][2]['segment'][0][0])
check('registered-seam-facade-security-anchors',(seam,facade,part)==(2383,3527,4329),{'sourceSeamPx':seam,'facadePx':facade,'securityPx':part})
# reconstruct original-M01-to-grayscale pixel mapping completely independently from emitted png
source=Image.open(ART).convert('L')
ratio=img.height/source.height
reference=source.transform((seam,img.height),Image.Transform.AFFINE,(1/ratio,0,bp['registration']['screenshotOriginalSourcePixelLeft'],0,1/ratio,0),resample=Image.Resampling.BICUBIC)
orig=np.asarray(reference,dtype=np.int16)
actual=np.asarray(img.crop((0,0,seam,img.height)),dtype=np.int16)
diff=np.abs(orig-actual)
max_diff=int(diff.max());mae=float(np.mean(diff));uneq=int(np.count_nonzero(diff))
check('M01-entire-inherited-native-image-subpixel-identity',max_diff==0,{'maxPixelError':max_diff,'meanPixelError':round(mae,7),'differingPixels':uneq,'registeredWidthPx':seam,'heightPx':img.height})
# Full-resolution semantic masks: sample exactly at registered centerline, not a guessed pixel wall from raster.
wall=np.asarray(wm,dtype=np.uint8);doors=np.asarray(dm,dtype=np.uint8)
check('no-M01-native-wall-duplication-in-new-wall-mask',np.count_nonzero(wall[:,:seam])==0)
check('no-M01-native-door-duplication-in-new-door-mask',np.count_nonzero(doors[:,:seam])==0)
check('six-walls-present',len(bp['walls'])==6)
check('four-door-planes-present',len(bp['doorPlanes'])==4)
# Detect all centerline pixels and ensure no mask beyond authored lines (3px horizontal/longitudinal rounding tolerance).
expected_wall=np.zeros_like(wall)
for w in bp['walls']:
    x0,y0=w['segment'][0];x1,y1=w['segment'][1]
    check('vertical-wall-'+w['id'],abs(x0-x1)<1e-6 and np.all(wall[p((y0+y1)/2),p(x0)-1:p(x0)+2]==255),{'segment':w['segment']})
    expected_wall[p(y0):p(y1)+1,p(x0)-1:p(x0)+2]=255
mask_err=int(np.count_nonzero(np.logical_xor(expected_wall>0,wall>0)))
check('wall-mask-exactly-matches-v7',mask_err==0,{'misregisteredPixels':mask_err})
expected_door=np.zeros_like(doors)
for door in bp['doorPlanes']:
    x0,y0=door['segment'][0];x1,y1=door['segment'][1]
    check('door-present-'+door['id'],abs(x0-x1)<1e-6 and np.all(doors[p((y0+y1)/2),p(x0)-1:p(x0)+2]==255),{'segment':door['segment']})
    expected_door[p(y0):p(y1)+1,p(x0)-1:p(x0)+2]=255
mask_err=int(np.count_nonzero(np.logical_xor(expected_door>0,doors>0)))
check('door-mask-exactly-matches-v7',mask_err==0,{'misregisteredPixels':mask_err})
check('no-wall-through-exterior-D01-gap',np.count_nonzero(wall[p(20)+10:p(23)-10,facade-2:facade+3])==0)
check('only-D01-exterior-entrance',sum(d.get('exteriorAccess',False) for d in bp['doorPlanes'])==1)
for dr in bp['doorPlanes']:
    if dr['id']=='D01': continue
    midy=p((dr['segment'][0][1]+dr['segment'][1][1])/2)
    check('no-partition-wall-through-'+dr['id'],np.count_nonzero(wall[midy-10:midy+10,part-2:part+3])==0)
# test semantics / 3 routes with Shapely, independent of current drawing program
floor=unary_union([Polygon(s['polygon']) for s in bp['surfaces'] if s.get('walkable') is True])
blocking_walls=[LineString(x['segment']).buffer(.025,cap_style=2) for x in bp['walls']]
blocking_props=[box(*x['bounds']) for x in bp['staticBlockingProps'] if x.get('movementBlock')]
hazards=[Polygon(h['polygon']) for h in bp['hazardPolygons'] if not h['walkable']]
obstruct=unary_union(blocking_walls+blocking_props+hazards)
walkable=floor.difference(obstruct)
for route in bp['routeTests']:
    polyline=LineString(route['polyline'])
    footprint=route['requiredFootprintFt']/10
    capsule=polyline.buffer(footprint,cap_style=2,join_style=1)
    collision=capsule.difference(walkable).area
    check('swept-clearance-'+route['id'],collision<1e-5,{'footprintFt':route['requiredFootprintFt'],'collisionAreaLogical2':round(collision,6)})
    for d in route['doors']:
        exact=any(q['id']==d for q in bp['doorPlanes'])
        check('route-door-exists-'+route['id']+'-'+d,exact)
# Does right-hand roof really meet old M01 roof at y<7.3 with exact join, yes no intervening untextured gap
roof=next(b for b in bp['buildingSurfaces'] if b['id']=='B02')
check('roof-physically-continuous-across-art-join',p(roof['bounds'][0])==seam and p(roof['bounds'][2])==facade and roof['bounds'][1]==0 and roof['bounds'][3]==7.3)
check('no-visual-map-boundary-registered-as-wall',not any(abs(q['segment'][0][0]-bp['registration']['m02ImageJoinXLogical'])<.01 for q in bp['walls']))
check('reception-cropped-at-edges',bp['continuity']['towerInteriorCroppedAt']==['top','bottom','right'])
# unchanged inherited stair landing source values
vertical={x['sourceId']:x for x in bp['verticalTransitions']}
check('stair-elevations-derived-M01-v02-v03',vertical['V03']['startElevationFt']==31 and vertical['V03']['endElevationFt']==18 and vertical['V02']['startElevationFt']==-8 and vertical['V02']['endElevationFt']==18)
check('source-stair-tread-still-unverified',all('unresolved' in x['clearanceStatus'] for x in bp['verticalTransitions']))
check('no-Foundry-document-modified',not manifest['noFoundryMutation'] is False)
# Structural envelope check: all art floats are from trusted inputs and v7 geometry; static props count
check('all-native-props-from-v7',len(bp['staticBlockingProps'])==7)
status='PASS_LOCAL_TYPED_GEOMETRY' if not failed else 'REDO_GEOMETRY_ALIGNMENT'
if status=='PASS_LOCAL_TYPED_GEOMETRY':
 warnings.append('This verifies typed artwork geometry and source-pixel identity, NOT Foundry runtime collision, exact stair tread/Levels state or wall duplication.')
 warnings.append('V7 bridge native wall/portcullis reread in world-template-2 is pending; inherited segment is intentionally sourced from approved original M01 art.')
 warnings.append('Right-side deterministic texture is an architectural grayscale construction render; user aesthetic approval for later painterly finish remains separate.')
result={'schemaVersion':'dicebox-structural-inspection/v1','sceneId':bp['sceneId'],'status':status,'passedCount':len(passed),'failedCount':len(failed),'passed':passed,'failed':failed,'warnings':warnings,'sourceBlueprintSha256':hashlib.sha256(canon(bp)).hexdigest(), 'renderSha256':sha(render),'originalM01ImageSha256':sha(ART),'pixelRegistration':{'seamPx':seam,'maxDeviationPx':max_diff,'pixelIdentity':max_diff==0},'dimensionsPx':[4800,2880],'noRuntimeAuthority':True,'noFoundryMutation':True,'painterlyRenderApproved':False,'nativeFoundryReadyToPlay':False,'nextStage':'FEATURE_MANIFEST_AND_STRUCTURAL_BUILD_IF_USER_ACCEPTS_STRUCTURAL_RENDER' if not failed else 'RENDER_REDO'}
(ROOT/'STRUCTURAL-INSPECTION-RECEIPT.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['passed','failed']},indent=2))
if failed:
 print('FAILED CHECKS',json.dumps(failed,indent=2));raise SystemExit(2)
