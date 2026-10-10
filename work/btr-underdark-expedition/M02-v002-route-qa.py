import json,math,collections
from pathlib import Path
root=Path(__file__).parent
bp=json.loads((root/'M02-SPATIAL-BLUEPRINT-CANDIDATE-v002.json').read_text('utf8'))
fm=json.loads((root/'M02-FEATURE-MANIFEST-CANDIDATE-v002.json').read_text('utf8'))
S=2.8125
def p(a):return (a['x']/S,a['y']/S)
def dptseg(q,a,b):
 dx=b[0]-a[0];dy=b[1]-a[1]
 t=max(0,min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/(dx*dx+dy*dy))) if dx*dx+dy*dy else 0
 return math.hypot(q[0]-(a[0]+t*dx),q[1]-(a[1]+t*dy))
def orient(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def cross(a,b,c,d):
 x=[orient(a,b,c),orient(a,b,d),orient(c,d,a),orient(c,d,b)]
 if x[0]*x[1] < 0 and x[2]*x[3] < 0:return True
 return any(abs(z)<1e-8 and min(u[0],v[0])-1e-8<=w[0]<=max(u[0],v[0])+1e-8 and min(u[1],v[1])-1e-8<=w[1]<=max(u[1],v[1])+1e-8 for z,u,v,w in [(x[0],a,b,c),(x[1],a,b,d),(x[2],c,d,a),(x[3],c,d,b)])
def dsegseg(a,b,c,d):
 if cross(a,b,c,d):return 0
 return min(dptseg(a,c,d),dptseg(b,c,d),dptseg(c,a,b),dptseg(d,a,b))
def pinpoly(q,poly):
 c=False
 for i in range(len(poly)):
  a=poly[i];b=poly[(i+1)%len(poly)]
  if dptseg(q,a,b)<1e-7:return True
  if (a[1]>q[1])!=(b[1]>q[1]) and q[0] < (b[0]-a[0])*(q[1]-a[1])/(b[1]-a[1])+a[0]:c=not c
 return c
def mindist(polyline,poly):
 if any(pinpoly(t,poly) for t in polyline):return 0
 a=list(zip(polyline,polyline[1:]));b=list(zip(poly,poly[1:]+poly[:1]))
 return min(dsegseg(c,d,e,f) for c,d in a for e,f in b)
def poly_overlap(a,b):
 if any(pinpoly(t,b) for t in a) or any(pinpoly(t,a) for t in b):return True
 return any(cross(c,d,e,f) for c,d in zip(a,a[1:]+a[:1]) for e,f in zip(b,b[1:]+b[:1]))
groups=collections.defaultdict(list)
for w in bp['walls']:
 name=w['wallId'].rsplit('-',1)[0]
 groups[name].append((p(w['a']),p(w['b'])))
solid={key:[seg[0] for seg in segs] for key,segs in groups.items() if 'edge-' not in key}
perim={key:[seg[0] for seg in segs]+[segs[-1][-1]] for key,segs in groups.items() if 'edge-' in key}
routes=[]
for rt in fm['routeProposals']:
 path=[tuple(x) for x in rt['centerline']]
 clearance=rt['requiredClearanceFt']/5* (1536/36) / 2
 distances=sorted((mindist(path,poly),key) for key,poly in solid.items())
 pe=sorted((min(dsegseg(a,b,c,d) for a,b in zip(path,path[1:]) for c,d in zip(bound,bound[1:])),key) for key,bound in perim.items())
 routes.append({'id':rt['id'],'minSolidDistancePx':round(distances[0][0],2),'nearestSolid':distances[0][1],'halfClearanceRequiredPx':round(clearance,2),'proxyPass':distances[0][0]+1e-3>=clearance,'perimeterMinDistancePx':round(pe[0][0],2),'perimeterProxyPass':pe[0][0]+1e-3>=clearance})
def regionpoly(shape):
 if shape['kind']=='polygon':return [p(v) for v in shape['points']]
 if shape['kind']=='ellipse':
  x=shape['x']/S;y=shape['y']/S;rx=shape['width']/S/2;ry=shape['height']/S/2
  return [(x+rx+rx*math.cos(i*math.pi*2/80),y+ry+ry*math.sin(i*math.pi*2/80)) for i in range(80)]
 raise ValueError('unsupported shape')
rby={r['regionId']:r for r in bp['regions']}
regions=[]
for r in bp['regions']:
 poly=regionpoly(r['shapes'][0]);hits=[k for k,v in solid.items() if poly_overlap(poly,v)]
 regions.append({'regionId':r['regionId'],'intersectsSolidProxies':hits})
anchors=[]
for a in bp['anchors']:
 target=rby.get(a.get('targetRegionId'))
 if not target:raise ValueError('target Region missing')
 poly=regionpoly(target['shapes'][0]);q=p(a['position']);clearance=a['clearance']/S
 inside=pinpoly(q,poly)
 inset=min(dptseg(q,s,t) for s,t in zip(poly,poly[1:]+poly[:1]))
 anchors.append({'key':a['anchorId'],'insideRegion':inside,'insetPx':round(inset,2),'clearanceRequiredPx':round(clearance,2),'safeFootprint':inside and inset+1e-3>=clearance,'solidPointOverlaps':[key for key,pg in solid.items() if pinpoly(q,pg)]})
def normal_region(v):return v['regionId'].split('m02-')[-1]
sensitive={'arrival-west','exit-east','forage-north','habitat-south'}
access=[v for v in regions if normal_region(v) in sensitive]
status='PASS_PROXY_GEOMETRY_ONLY' if all(r['proxyPass'] and r['perimeterProxyPass'] for r in routes) and all(a['safeFootprint'] and not a['solidPointOverlaps'] for a in anchors) and all(not r['intersectsSolidProxies'] for r in access) else 'FAIL_PROXY_GEOMETRY'
out={'operation':'m02.spatial.v002.route-region.proxy-qa','status':status,'scaleFactor':S,'wallCount':len(bp['walls']),'solidObstacleGroups':len(solid),'routes':routes,'regions':regions,'anchors':anchors,'criticalAccessRegionsClear':all(not r['intersectsSolidProxies'] for r in access),'visualTerrainCertification':'NOT_PERFORMED','authoritativeFoundryReadback':False,'liveWrites':0}
print(json.dumps(out,indent=2))
