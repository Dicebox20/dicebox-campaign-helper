"""Exact-coordinate M02 grayscale STRUCTURAL_RENDER from user-approved v7 blueprint.
Only source-registered M01 painterly artwork pixels are used as background source, converted to L;
all newly-authored architecture is drawn deterministically from canonical v7 geometry.
No Foundry mutations or inferred colliders from generated pixels.
"""
from pathlib import Path
import json,hashlib,math,random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

ROOT=Path(__file__).parent
OUT=ROOT.parent/'structural-v9'
OUT.mkdir(exist_ok=True,parents=True)
BP=json.loads((ROOT/'spatial-blueprint.json').read_text(encoding='utf-8'))
ART=Path('/mnt/data/dicebox_heist_design/dark-arch-m01/paint-render-2026-10-16/painterly-candidate.png')
assert BP['sceneId']=='dbx.heist.kurth.m02.reception'
expected='f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add'
canonical=lambda o:json.dumps(o,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
assert hashlib.sha256(canonical(BP)).hexdigest()==expected
assert hashlib.sha256(ART.read_bytes()).hexdigest()==BP['registration']['masterApprovedArtSha256']
assert BP['scale']['pixels']==[4800,2880]
W,H=4800,2880
pix=lambda n:int(round(n*120))
P=lambda pt:(pix(pt[0]),pix(pt[1]))
S=BP['registration']['m02ImageJoinXLogical']; sx=pix(S)
facade=next(w for w in BP['walls'] if w['id']=='W01')['segment'][0][0]; fx=pix(facade)
partition=next(w for w in BP['walls'] if w['id']=='W03')['segment'][0][0]; px=pix(partition)
assert (sx,fx,px)==(2383,3527,4329)
rng=random.Random(20261017)
# Base deep, detailed monochrome sea and cliff material for new map region
im=Image.new('L',(W,H),43)
d=ImageDraw.Draw(im)
for k in range(13500):
    x=rng.randrange(sx,W); y=rng.randrange(H)
    gray=rng.choice([46,49,56,59,64,70,77,34,41]);
    length=rng.randrange(6,53)
    d.arc((x,y,x+length,y+rng.randrange(5,15)), 183,320,fill=gray,width=rng.choice([1,2]))

reference_gray=Image.open(ART).convert('L')
# Selected *floor-only* grayscale texture from the original M01 image, not a rejected render.
# These color-neutral samples contain no props, walls, doors or characters.
floor_patches=[reference_gray.crop(q) for q in [(1320,340,1390,410),(790,330,860,400),(840,340,910,410),(1360,290,1428,358)]]
roof_patches=[reference_gray.crop(q) for q in [(1517,54,1584,121),(1542,85,1609,152)]]

def textured_rectangle(bounds,shade=146,roof=False,seed=0):
    x0,y0,x1,y1=map(pix,bounds)
    tw,th=x1-x0,y1-y0
    if tw<=0 or th<=0:return
    color=shade
    canvas=Image.new('L',(tw,th),shade)
    local_rng=random.Random(seed if seed is not None else x0+y0)
    patches=roof_patches if roof else floor_patches
    STEP=192 if not roof else 160
    T=STEP+46
    fade=19
    # Alpha-blended small textured stones, intentionally sampled from already approved M01 art.
    # Painting remains at fixed blueprint bounds, not source-pixel geometry authority.
    m=Image.new('L',(T,T),255)
    md=ImageDraw.Draw(m)
    # 2-direction feather avoids abrupt repetition lines
    for a in range(fade):
        alpha=round(a*255/fade)
        md.line((a,0,a,T),fill=alpha)
        md.line((0,a,T,a),fill=alpha)
    for yy in range(-4,th+STEP,STEP):
        for xx in range(-4,tw+STEP,STEP):
            piece=local_rng.choice(patches)
            if local_rng.random()<0.5:piece=ImageOps.mirror(piece)
            if local_rng.random()<0.5:piece=ImageOps.flip(piece)
            piece=piece.resize((T,T),Image.Resampling.LANCZOS)
            piece=ImageEnhance.Contrast(piece).enhance(.94)
            avg=round(sum(piece.resize((1,1)).getdata())/1)
            adjustment=shade-avg+local_rng.randint(-6,6)
            piece=piece.point(lambda c:max(0,min(255,c+adjustment)))
            canvas.paste(piece,(xx,yy),m)
    im.paste(canvas,(x0,y0))

def stone_rect(bounds,shade=146,tilew=55,tileh=48,seed=None):
    textured_rectangle(bounds,shade=shade,roof=False,seed=seed)

# Exterior floor surfaces before rock layers; no additional blocked routes from decorative pixels
for s in BP['surfaces']:
    if s['ownership']=='m02-outdoor':
        stone_rect(s['bounds'], 137, tilew=56,tileh=45,seed=int(s['bounds'][0]*110))
    if s['ownership']=='m02-interior':
        shade=164 if s['id']=='S07' else 154
        stone_rect(s['bounds'], shade,tilew=84,tileh=69,seed=int(s['bounds'][0]*321))
# Climate-worn coastal cliff: exact hazard polygon only, no invented native walls
def textured_hazard_polygon(h,kind):
    poly=[P(pt) for pt in h['polygon']]
    mask=Image.new('L',(W,H),0)
    ImageDraw.Draw(mask).polygon(poly,fill=255)
    minx,miny,maxx,maxy=mask.getbbox()
    r=Image.new('L',(maxx-minx,maxy-miny), 50)
    tiles = ([reference_gray.crop((1030,470,1150,590)),reference_gray.crop((1060,510,1190,640))]
             if kind=='rock' else [reference_gray.crop((590,670,730,810)),reference_gray.crop((600,80,740,220))])
    size=225 if kind=='rock' else 285
    rr=random.Random(100 if kind=='rock' else 200)
    for dy in range(0,maxy-miny,size):
        for dx in range(0,maxx-minx,size):
            tile=rr.choice(tiles)
            if rr.random()<.5:tile=ImageOps.mirror(tile)
            if rr.random()<.5:tile=ImageOps.flip(tile)
            tile=tile.resize((size+3,size+3),Image.Resampling.BICUBIC)
            avg=int(tile.resize((1,1)).getpixel((0,0)))
            target=(58 if kind=='rock' else 52)+rr.randint(-8,8)
            tile=tile.point(lambda v:max(0,min(255,v+target-avg)))
            r.paste(tile,(dx,dy))
    im.paste(r,(minx,miny),mask.crop((minx,miny,maxx,maxy)))
for h in BP['hazardPolygons']:
    textured_hazard_polygon(h,h['kind'])
# Embossed slate roof continuing visible original M01 roof right across seam to facade, no new walkway through roof
roof=next(v for v in BP['buildingSurfaces'] if v['id']=='B02')
x0,y0,x1,y1=map(pix,roof['bounds'])
textured_rectangle(roof['bounds'],shade=64,roof=True,seed=2107)
# Dark roof cut edges match existing shingle slope without creating native new walls
for yy in [34,823]:
    d.line((x0,yy,x1,yy),fill=39,width=16)
    d.line((x0,yy-7,x1,yy-7),fill=134,width=4)
# Deck / ramp texture emphasized and outdoors shaped walkway, no stair added beyond v7 surfaces
# Decorative stone threshold belt along facade only on external side, not blocking
belt_x=fx-77
for y in range(pix(12.6),pix(19.5),126):
    d.line((belt_x,y,belt_x+38,y-20),fill=155,width=4)
# Interior floor inlays: 2D flush relief, no token obstructions
# A route-safe border frame, plus understated queue/floor geometry
interior=(fx,0,W,H)
for off,shade in [(72,124),(87,197),(99,116)]:
    # trim only on inside, not a blocking wall
    d.line((fx+off,0,fx+off,pix(19.5)),fill=shade,width=4)
# decorative mosaic around reception middle, fully flat
midx=(fx+px)//2
for rr,gray in [(295,115),(283,202),(268,140),(252,191),(238,128)]:
    d.ellipse((midx-rr,1440-rr,midx+rr,1440+rr),outline=gray,width=5)
for an in range(0,360,30):
    rad=math.radians(an)
    x,y=midx+203*math.cos(rad),1440+203*math.sin(rad)
    x2,y2=midx+223*math.cos(rad),1440+223*math.sin(rad)
    d.line((round(x),round(y),round(x2),round(y2)),fill=207,width=5)
# understated north and south flush stone ornamental runner motifs
for yy in [280,2220]:
    d.rounded_rectangle((fx+160,yy,px-140,yy+205),radius=35,outline=124,width=7)
    d.rounded_rectangle((fx+173,yy+13,px-153,yy+192),radius=28,outline=189,width=3)
    for i in range(7):
        cx=fx+190+i*70
        d.ellipse((cx,yy+75,cx+18,yy+93),fill=119)
# Glance details behind security wall, flat heraldic floor motif
for yy in [480,1460,2350]:
    d.ellipse((px+110,yy-75,px+290,yy+105),outline=112,width=5)
    d.ellipse((px+138,yy-47,px+262,yy+77),outline=187,width=4)

# Fixtures render in exact provided PXX blocking rectangles. Do not invent collision furniture.
def relief_rect(x0,y0,x1,y1,kind):
    shadow=22
    d.rounded_rectangle((x0+13,y0+19,x1+13,y1+19),radius=8,fill=71)
    d.rounded_rectangle((x0,y0,x1,y1),radius=8,fill=95,outline=36,width=7)
    d.line((x0+10,y0+11,x1-8,y0+11),fill=204,width=5)
    d.line((x0+11,y0+14,x0+11,y1-13),fill=177,width=4)
    d.line((x0+13,y1-11,x1-9,y1-11),fill=50,width=5)
    if 'shelves' in kind:
        for xx in range(x0+25,x1-22,24):
            d.rectangle((xx,y0+30,xx+11,y1-22),fill=rng.choice([58,69,79,83]))
            d.line((xx,y0+30,xx+11,y0+30),fill=165,width=2)
    if 'desk' in kind.lower() or 'supplies' in kind:
        d.rectangle((x0+34,y0+34,x0+88,min(y1-16,y0+90)),fill=149,outline=57,width=2)
        for k in range(5):
            a=x1-50-k*16
            d.line((a,y0+30,a+6,y0+90),fill=164,width=3)
    if 'reception' in kind.lower():
        for xx in range(x0+20,x1-20,60):
            d.ellipse((xx,y1-30,xx+24,y1-13),fill=61,outline=147,width=2)
for prop in BP['staticBlockingProps']:
    x0,y0,x1,y1=map(pix,prop['bounds'])
    if prop['name'].lower().startswith('column'):
        radius=max(1,(x1-x0)//2)
        cx,cy=(x0+x1)//2,(y0+y1)//2
        d.ellipse((x0+12,y0+17,x1+13,y1+17),fill=70)
        d.rectangle((x0-8,y0-8,x1+8,y1+8),fill=96,outline=35,width=5)
        d.rectangle((x0-2,y0-2,x1+2,y1+2),outline=188,width=3)
        d.ellipse((x0,y0,x1,y1),fill=127,outline=35,width=5)
        d.arc((x0+7,y0+7,x1-7,y1-7),205,340,fill=216,width=8)
        d.arc((x0+7,y0+7,x1-7,y1-7),0,170,fill=73,width=7)
        d.ellipse((cx-6,cy-6,cx+6,cy+6),fill=77)
    else:
        relief_rect(x0,y0,x1,y1,prop['name'])

# Roof-tower join: structural boundary is shown as a cutaway line but is not a native blocking Wall
# Upper roof abuts first-floor interior at facade x, no additional door or movement wall.
# Wall drawing precise center aligned with registered v7 Wall specs; one pair of shade lines around it.
wall_mask=Image.new('L',(W,H),0); wm=ImageDraw.Draw(wall_mask)
door_mask=Image.new('L',(W,H),0);dm=ImageDraw.Draw(door_mask)

def carve_wall(seg,semantic='stone-exterior'):
    p0,p1=P(seg[0]),P(seg[1]);assert p0[0]==p1[0] # six v7 vertical walls only
    x=p0[0];y0,y1=sorted([p0[1],p1[1]])
    # thickness 27px radius; gate visual plane will be exactly missing
    d.rectangle((x-20,y0+13,x+32,y1+30),fill=61)
    d.rectangle((x-22,y0,x+20,y1),fill=91,outline=31,width=4)
    d.rectangle((x-19,y0,x-10,y1),fill=211)
    d.rectangle((x-8,y0,x+5,y1),fill=155)
    d.rectangle((x+12,y0,x+20,y1),fill=55)
    # individual dressed blocks, without changing the actual wall centerline
    for y in range(y0,y1,105):
        d.line((x-22,y,x+20,y),fill=52,width=4)
        d.line((x-19,y+5,x+18,y+5),fill=206,width=3)
        if y+52<y1:
            d.line((x-5,y,x-5,min(y+50,y1)),fill=73,width=2)
    # high-fidelity semantic line exactly at authored blueprint center
    wm.line([(x,y0),(x,y1)],fill=255,width=3)

for w in BP['walls']:
    carve_wall(w['segment'],w['semantic'])

def carve_door(obj):
    seg=obj['segment'];p0,p1=P(seg[0]),P(seg[1]);assert p0[0]==p1[0]
    x=p0[0];y0,y1=sorted([p0[1],p1[1]])
    # no wall geometry inside gap; 2 leaves look like horizontal panels in overhead projection
    d.rectangle((x-35,y0,x+35,y1),fill=116)
    d.line((x-35,y0,x+35,y0),fill=58,width=9)
    d.line((x-35,y1,x+35,y1),fill=46,width=9)
    d.line((x-27,y0+9,x-27,y1-9),fill=193,width=5)
    d.line((x+26,y0+9,x+26,y1-9),fill=53,width=5)
    for y in range(y0+30,y1-35,56):
        d.rounded_rectangle((x-17,y,x+17,y+30),radius=3,fill=87,outline=44,width=3)
        d.line((x-12,y+4,x+12,y+4),fill=166,width=2)
    ym=(y0+y1)//2
    d.ellipse((x-28,ym-10,x-14,ym+4),fill=45,outline=211,width=3)
    dm.line([(x,y0),(x,y1)],fill=255,width=3)

for obj in BP['doorPlanes']:
    carve_door(obj)

# Facade has exactly one door D01; do not print a second exterior entrance.
# Roof is occluding only explicitly exterior roof area, not room interior nor courtyard.
# Original accepted M01 reference slice copied as grayscale at exact registered affine scale
master=Image.open(ART).convert('L')
source_left=BP['registration']['screenshotOriginalSourcePixelLeft']
# Source crop native x = source_left + output x/(2880/971) ; y=output y/(2880/971).
# Use resample BICUBIC in exactly the source-native aspect to output onto 4800x2880 scene
sxy=H/master.height
# PIL affine x/y mapping avoids integer crop offsets and preserves pixel-registration subpixel correctness
left=master.transform((sx,H),Image.Transform.AFFINE,(1/sxy,0,source_left,0,1/sxy,0),resample=Image.Resampling.BICUBIC)
im.paste(left,(0,0))
# Mask source regions for semantic masks: native M01 wall geometry is not authored anew; not included in new masks.

out=OUT/'M02-v9-structural-grayscale.png'
im.save(out,optimize=True)
wall_mask.save(OUT/'M02-v9-structural-wall-mask.png',optimize=True)
door_mask.save(OUT/'M02-v9-structural-door-mask.png',optimize=True)
# smaller same-aspect quick preview; not authoritative scale
preview=im.resize((1600,960),Image.Resampling.LANCZOS)
preview.save(OUT/'M02-v9-preview.png')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
manifest={'schemaVersion':'dicebox-structural-render/v1','sceneId':BP['sceneId'],
 'stage':'STRUCTURAL_RENDER_CANDIDATE_PENDING_INSPECT','sourceBlueprintCanonicalSha256':expected,
 'sourceM01ArtSha256':sha(ART),'renderSha256':sha(out),
 'renderPath':out.name,'resolutionPx':[W,H],'seamCellX':S,'seamPixelX':sx,
 'towerFacadeX':facade,'towerFacadePixelX':fx,'securityPartitionX':partition,'securityPartitionPixelX':px,
 'newSolidWallIds':[w['id'] for w in BP['walls']],
 'doorCoordinates':{q['id']:q['segment'] for q in BP['doorPlanes']},
 'fullSceneContainsNativeM01SourceCrop':True,'originalM01NativeMasterDimensions':master.size,
 'registrationMethod':'PIL affine from original M01 source with subpixel registration, then deterministic typed-v7 architectural relief',
 'coordinateAuthors':'typed-v7 only','separateGeometryMasks':{'wall':sha(OUT/'M02-v9-structural-wall-mask.png'),'door':sha(OUT/'M02-v9-structural-door-mask.png')},
 'noPlayerTokens':True,'noOverlaidMeasurementGrid':True,'noTextLabels':True,'noFoundryMutation':True,
 'painterlyRenderGenerated':False,'readyToPlay':False}
(OUT/'RENDER-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
