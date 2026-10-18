"""Offline reproducible M02 final inspection. No Foundry access.

The supplied grayscale/color relationship is checked pixelwise. The geometry overlay
illustrates authored blueprint coordinates; it is NOT pixel-derived wall authority.
"""
from pathlib import Path
import hashlib, json
from PIL import Image,ImageDraw,ImageFont
import numpy as np
import cv2
ROOT=Path(__file__).resolve().parent
SRC=Path('/mnt/data/grayscale_fortress_harbor_battlemap.png')
CAND=Path('/mnt/data/dicebox_heist_design/kurth-tower-m02/paint-render-repaired/M02-painterly-geometry-locked.png')
LIB=Path('/mnt/data/dicebox_heist_design/kurth-tower-m02/paint-render-repaired/library-check/M02-painterly-geometry-locked.png')
BLUE=Path('/mnt/data/dicebox_heist_design/kurth-tower-m02/geometry-final-v7/spatial-blueprint.json')
SCRIPT=Path('/mnt/data/dicebox_heist_design/kurth-tower-m02/paint-render-repaired/colorize_structural.py')
M01=Path('/mnt/data/dicebox_heist_design/dark-arch-m01/paint-render-2026-10-16/painterly-candidate.png')
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
b=json.loads(BLUE.read_text())
src=Image.open(SRC).convert('RGB');cand=Image.open(CAND).convert('RGB')
orig=np.array(src.convert('L'))
color=np.array(cand.convert('L'))
assert orig.shape==(971,1619) and color.shape==(971,1619)
sourceEdges=(cv2.Canny(orig,75,155)>0)
outputEdges=(cv2.Canny(color,75,155)>0)
retained=float(np.count_nonzero(sourceEdges&outputEdges)/np.count_nonzero(sourceEdges))
lumCorrelation=float(np.corrcoef(orig.flat,color.flat)[0,1])
assert sha(CAND)==sha(LIB), 'LIBRARY_ASSET_DIFFERS_FROM_INSPECTED_IMAGE'
assert b['registration']['masterApprovedArtSha256']==sha(M01)
canonhash=hashlib.sha256(json.dumps(b,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert canonhash=='f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add'
# Pixel-coordinate overlay: 40 x 24 logical unit blueprint, source native image.
sx,sy=1619/40,971/24
pt=lambda p: (round(p[0]*sx),round(p[1]*sy))
annot=cand.copy();draw=ImageDraw.Draw(annot)
try:
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
 small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
except OSError:
 font=small=ImageFont.load_default()
join=round(b['registration']['m02ImageJoinXLogical']*sx)
draw.line([(join,0),(join,971)],fill=(238,0,237),width=4)
for w in b['walls']:
 draw.line([pt(x) for x in w['segment']],fill=(255,54,55),width=6)
for p in b['doorPlanes']:
 draw.line([pt(x) for x in p['segment']],fill=(11,240,247),width=8)
 x,y=pt([(p['segment'][0][0]+p['segment'][1][0])/2,(p['segment'][0][1]+p['segment'][1][1])/2])
 draw.text((x-65,y-24),p['id'],fill='white',stroke_width=3,stroke_fill='black',font=font)
for inherited in b['inheritedSpecialPlanes']:
 if inherited['semantic']=='gate-portal':
  draw.line([pt(x) for x in inherited['segment']],fill=(255,228,0),width=7)
  x,y=pt(inherited['segment'][0]);draw.text((x-150,y-28),'M01 gate',fill='yellow',stroke_width=3,stroke_fill='black',font=font)
annot.save(ROOT/'BLUEPRINT-OVERLAY-REJECTED-CANDIDATE.png')
expectedDoors={door['id']:{'name':door['name'],'segmentLogical':door['segment'],'segmentNativeImagePx':[list(pt(v)) for v in door['segment']]} for door in b['doorPlanes']}
checks={
 'libraryAssetMatchesLocalCandidate':True,
 'sourceResolutionMatchesCandidate':src.size==cand.size== (1619,971),
 'colorizerProvenanceNoSpatialRemap':True,
 'geometryStructuralEdgesRetainedRatio':round(retained,6),
 'sourceColorLuminanceCorrelation':round(lumCorrelation,6),
 'sourceArchitectureMovedDuringColorization':False,
 'v7ArtworkCoordinateAlignment':False,
 'v7M01OriginalBridgeSourceExactlyPreserved':False,
 'v7ExteriorEntranceDoorLocationMatchesArtwork':False,
 'v7SecurityWallAndThreeOpeningsAppearAtExpectedPositions':False,
 'noGridLabelsNPCTokens':True,
 'grayscalePriorStructuralPassSufficient':False,
 'foundryReadOrMutation':False
}
assert retained>.97 and lumCorrelation>.995
report={
 'documentType':'dicebox-scene-final-inspect/v1',
 'sceneId':b['sceneId'],
 'date':'2026-10-17',
 'verdict':'REDO',
 'stage':'FINAL_INSPECT_REJECTED_REQUIRES_STRUCTURAL_RENDER_RESTART',
 'cause':'Color preserves rejected grayscale pixels but grayscale does not reproduce approved calibrated v7 geometry/artwork.',
 'authoritativeSources':{
   'approvedV7SpatialBlueprintCanonicalSha256':canonhash,
   'approvedM01ArtSha256':sha(M01),
   'approvedGrayscaleCandidateSha256':sha(SRC),
   'colorCandidateSha256':sha(CAND),
   'colorizerScriptSha256':sha(SCRIPT),
   'libraryCandidateMatchedBySha256':True
 },
 'imageSizeNativePx':[1619,971],
 'checks':checks,
 'spatialEvidence':{
   'v7RegisteredM01JoinAtImageXpx':join,
   'v7M01GateExpectedPx':[list(pt(x)) for x in b['inheritedSpecialPlanes'][0]['segment']],
   'v7TowerWestWallExpectedImageXpx':round(b['walls'][0]['segment'][0][0]*sx),
   'v7SecurityCheckpointExpectedImageXpx':round(b['walls'][2]['segment'][0][0]*sx),
   'doors':expectedDoors,
   'visualFinding':'At the tower exterior west wall x≈1190, the red blueprint wall overlay lies in visible reception-floor space, not over its actual facade. Cyan door D01 at x≈1190, y≈809–931 lies in the wrong place; an arched door is depicted much farther left/up. The checkpoint wall planes at x≈1460 lie across an open furnished reception floor rather than distinct blocked planes and passages. Inherited M01 portcullis/gate x≈394 diverges from rendered gate farther right. These features were redesigned by the structural generation relative to v7.',
   'pixelGeometryClaimScope':'Only grayscale versus candidate, not grayscale versus approved v7. Quantities are image native; user-approved typed blueprint remains authoritative.'
 },
 'previousStructuralInspectionVerdict':'Earlier assistant asserted PASS, but did not reconcile the structural render to the exact v7 wall/door/scene registration; superseded by this source-based evidence.',
 'actions':{
   'renderApproval':False,'injectorBuildBlocked':True,'stageInjectBlocked':True,
   'nextStep':'New structural render from accepted v7 PREPARE and blueprint (fresh image prompt; no rejected prompt or rejected image as design authority), then compare geometry before painterly color; do not patch geometry to fit unapproved pixels.',
   'runtimeFoundryValidationRequiredLater':True,'foundryWorldChanged':False
 },
 'limitations':['No live Foundry reread.','Exact original M01 art should be aligned and composited/registered from master asset; grayscale generative recreation is not equivalent.','Any art regenerated with perspective or re-located doors must be rejected.']
}
(ROOT/'FINAL-INSPECT-RECEIPT.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'verdict':report['verdict'],'v7Sha':canonhash,'libraryAssetMatched':True,'imageDimensions':src.size,'edgeRatio':round(retained,6),'luminanceCorrelation':round(lumCorrelation,6),'doors':expectedDoors},indent=2))