/**
 * DCH-B-20261117-FOUNDRY-SEMANTIC-SLICE-V001
 * Source-only, dry-run semantic Scene candidate for Foundry VTT v14.
 *
 * Geometry comes ONLY from an explicitly approved Spatial Blueprint.
 * Image pixels, painting, background art and illustration are NEVER
 * inspected or treated as geometry authority. No Foundry writes exist here.
 *
 * Native v14 reference data: WallData.c/door/ds and restriction numbers,
 * AmbientLightData.x/y/config, RegionData.shapes with polygon points.
 * The actual v14 server DataModel and a real Player3 view are not run.
 */

export const SEMANTIC_SLICE_VERSION = 'dch-semantic-scene-v14/1';
export const MODULE_ID = 'dicebox-campaign-helper';
const ID = /^dbx:(wall|door|light|region):[a-z0-9][a-z0-9-]{0,79}$/;
const SHA = /^[0-9a-f]{64}$/;
const SUPPORTED = new Set(['wall', 'door', 'light', 'region']);
const KIND_SORT = ['wall', 'door', 'light', 'region'];
const own = (o, k) => Object.hasOwn(o, k);

function reject(code) { throw new Error(`SEMANTIC_V14_${code}`); }
function record(value, code) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)
      || Object.getPrototypeOf(value) !== Object.prototype) reject(code);
  return value;
}
function exact(obj, names, code) {
  record(obj, code);
  if (Object.keys(obj).some(k => !names.includes(k))) reject(code);
}
function finite(v, code, min = 0, max = 16384) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) reject(code);
  return v;
}
function int(v, code, min, max) {
  if (!Number.isInteger(v)) reject(code);
  return finite(v, code, min, max);
}
function position(p, width, height) {
  exact(p, ['x', 'y'], 'POINT');
  return [finite(p.x, 'POINT_X', 0, width), finite(p.y, 'POINT_Y', 0, height)];
}
function area(flat) {
  let sum = 0;
  const n = flat.length / 2;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    sum += flat[i*2]*flat[j*2+1] - flat[j*2]*flat[i*2+1];
  }
  return sum / 2;
}
function orient(a,b,c) { return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]); }
function on(a,b,c) {
  return Math.min(a[0],b[0]) <= c[0] && c[0] <= Math.max(a[0],b[0])
    && Math.min(a[1],b[1]) <= c[1] && c[1] <= Math.max(a[1],b[1]);
}
function intersects(a,b,c,d) {
  const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);
  if (o1===0 && on(a,b,c) || o2===0 && on(a,b,d)
    || o3===0 && on(c,d,a) || o4===0 && on(c,d,b)) return true;
  return (o1>0)!==(o2>0) && (o3>0)!==(o4>0);
}
// Reject positive-length collinear overlap even when two segments have
// different endpoints. Adjacent segments that meet at a single endpoint
// remain valid as separate geometry features.
function overlapsOnLine(first, second) {
  const a=[first[0],first[1]], b=[first[2],first[3]];
  const c=[second[0],second[1]], d=[second[2],second[3]];
  if (orient(a,b,c)!==0 || orient(a,b,d)!==0) return false;
  const axis=Math.abs(a[0]-b[0])>=Math.abs(a[1]-b[1]) ? 0 : 1;
  return Math.min(Math.max(a[axis],b[axis]),Math.max(c[axis],d[axis]))
    > Math.max(Math.min(a[axis],b[axis]),Math.min(c[axis],d[axis]));
}
function conflictingDoorPortals(one, two) {
  const a=[one[0],one[1]], b=[one[2],one[3]];
  const c=[two[0],two[1]], d=[two[2],two[3]];
  if (!intersects(a,b,c,d)) return false;
  if (overlapsOnLine(one,two)) return true;
  // A common endpoint is a junction, not an overlapping portal. Any
  // interior intersection (including endpoint-to-interior) is rejected.
  return ![a,b].some(u=>[c,d].some(v=>u[0]===v[0]&&u[1]===v[1]));
}
function conflictsWithDoor(door, wall) {
  const a=[door[0],door[1]],b=[door[2],door[3]];
  const c=[wall[0],wall[1]],d=[wall[2],wall[3]];
  if (!intersects(a,b,c,d)) return false;
  // A door must replace the wall segment covering its portal, not be
  // painted or overlaid on an impassable solid Wall. Endpoint joins are OK.
  const collinear=orient(a,b,c)===0 && orient(a,b,d)===0;
  if (collinear) {
    const axis=Math.abs(a[0]-b[0])>=Math.abs(a[1]-b[1])?0:1;
    const overlap=Math.min(Math.max(a[axis],b[axis]),Math.max(c[axis],d[axis]))
      - Math.max(Math.min(a[axis],b[axis]),Math.min(c[axis],d[axis]));
    if (overlap>0) return true;
  }
  const endpointJoin=[a,b].some(u=>[c,d].some(v=>u[0]===v[0]&&u[1]===v[1]));
  return !endpointJoin;
}
function polygon(points, width, height) {
  if (!Array.isArray(points) || points.length < 3 || points.length > 32) reject('POLYGON_LENGTH');
  const xy = points.map(p => position(p,width,height));
  if (xy.some((p,i) => {const q=xy[(i+1)%xy.length]; return p[0]===q[0]&&p[1]===q[1];})) reject('POLYGON_EDGE_ZERO');
  if (xy.some((p,i) => xy.some((q,j) => i!==j && p[0]===q[0]&&p[1]===q[1]))) reject('POLYGON_REPEAT');
  if (Math.abs(area(xy.flat())) < 0.01) reject('POLYGON_AREA');
  for (let i=0;i<xy.length;i++) for (let j=i+1;j<xy.length;j++) {
    if (j===i+1 || i===0&&j===xy.length-1) continue;
    if (intersects(xy[i],xy[(i+1)%xy.length],xy[j],xy[(j+1)%xy.length])) reject('POLYGON_SELF_INTERSECTION');
  }
  return [...xy.flat(),...xy[0]];
}
function segment(f,w,h) {
  const a = position(f.a,w,h), b = position(f.b,w,h);
  if (a[0]===b[0] && a[1]===b[1]) reject('ZERO_WALL');
  return [...a,...b];
}
function provenance(blueprint, stableId) {
  return { [MODULE_ID]: {
    stableId,
    source: 'approved-spatial-blueprint',
    blueprintId: blueprint.blueprintId,
    blueprintSha256: blueprint.sha256,
    blueprintRevision: blueprint.revision,
    semanticSliceVersion: SEMANTIC_SLICE_VERSION
  }};
}
function oneFeature(f, dims, src) {
  record(f,'FEATURE');
  if (!SUPPORTED.has(f.kind)) reject('FEATURE_KIND');
  if (typeof f.stableId !== 'string' || !ID.test(f.stableId)
      || !f.stableId.startsWith(`dbx:${f.kind}:`)) reject('STABLE_ID');
  const flags = provenance(src,f.stableId);
  if (f.kind === 'wall') {
    exact(f,['kind','stableId','a','b'],'FEATURE_FIELDS');
    return { type:'Wall', stableId:f.stableId,
      data:{ c:segment(f,dims.width,dims.height), door:0,
        move:20,sight:20,light:20,sound:20,flags } };
  }
  if (f.kind === 'door') {
    exact(f,['kind','stableId','a','b','state'],'FEATURE_FIELDS');
    if (f.state !== 'closed') reject('DOOR_STATE');
    return { type:'Wall', stableId:f.stableId,
      data:{ c:segment(f,dims.width,dims.height), door:1,ds:0,
        move:20,sight:20,light:20,sound:20,flags } };
  }
  if (f.kind === 'light') {
    exact(f,['kind','stableId','at','brightDistance','dimDistance','color'],'FEATURE_FIELDS');
    const [x,y]=position(f.at,dims.width,dims.height);
    const bright=finite(f.brightDistance,'LIGHT_BRIGHT',0,1000);
    const dim=finite(f.dimDistance,'LIGHT_DIM',0,1000);
    if (dim<=0 || bright>dim) reject('LIGHT_RADIUS');
    if (typeof f.color!=='string' || !/^#[0-9a-fA-F]{6}$/.test(f.color)) reject('LIGHT_COLOR');
    return { type:'AmbientLight',stableId:f.stableId,
      data:{x,y,config:{bright,dim,color:f.color},walls:true,vision:false,flags} };
  }
  exact(f,['kind','stableId','name','polygon'],'FEATURE_FIELDS');
  if (typeof f.name!=='string' || !f.name.trim() || f.name.length>80) reject('REGION_NAME');
  const points=polygon(f.polygon,dims.width,dims.height);
  return {type:'Region',stableId:f.stableId,
    data:{name:f.name.trim(),shapes:[{type:'polygon',points,hole:false}],behaviors:[],flags}};
}
/** Pure data transformation, NEVER a world-write or scene-create authority. */
export function convertSemanticSceneV14(blueprint) {
  exact(blueprint,['schemaVersion','source','scene','features'],'ROOT_FIELDS');
  if (blueprint.schemaVersion !== SEMANTIC_SLICE_VERSION) reject('VERSION');
  const src=blueprint.source;
  exact(src,['kind','blueprintId','sha256','revision','approvalId'],'SOURCE_FIELDS');
  if (src.kind!=='approved-spatial-blueprint' || typeof src.blueprintId!=='string'
      || !/^dbx:blueprint:[a-z0-9-]{1,80}$/.test(src.blueprintId)
      || typeof src.sha256!=='string' || !SHA.test(src.sha256)
      || typeof src.approvalId!=='string' || !/^approval:[a-z0-9-]{1,80}$/.test(src.approvalId)) reject('SOURCE_AUTHORITY');
  int(src.revision,'SOURCE_REVISION',1,2147483647);
  const scene=blueprint.scene;
  exact(scene,['name','width','height','grid'],'SCENE_FIELDS');
  if (typeof scene.name!=='string' || !scene.name.trim() || scene.name.length>100) reject('SCENE_NAME');
  int(scene.width,'SCENE_WIDTH',128,16384);
  int(scene.height,'SCENE_HEIGHT',128,16384);
  exact(scene.grid,['type','size','distance','units'],'GRID_FIELDS');
  if (scene.grid.type!==1) reject('GRID_TYPE');
  int(scene.grid.size,'GRID_SIZE',25,512);
  finite(scene.grid.distance,'GRID_DISTANCE',0.01,1000);
  if (typeof scene.grid.units!=='string' || !['ft','m'].includes(scene.grid.units)) reject('GRID_UNITS');
  if (!Array.isArray(blueprint.features) || blueprint.features.length < 4 || blueprint.features.length>64) reject('FEATURE_COUNT');
  const seen=new Set();const types=new Set();const children={Wall:[],AmbientLight:[],Region:[]};const wallSegments=[];
  for (const f of blueprint.features) {
    const candidate=oneFeature(f,scene,src);
    if (seen.has(candidate.stableId)) reject('DUPLICATE_ID');
    seen.add(candidate.stableId);types.add(f.kind);
    if (candidate.type==='Wall') {
      const c=candidate.data.c;
      if (wallSegments.some(s => s.c.join(',')===c.join(',') || s.c[0]===c[2]&&s.c[1]===c[3]&&s.c[2]===c[0]&&s.c[3]===c[1])) reject('OVERLAPPING_SEGMENT');
      wallSegments.push({c,kind:f.kind});
    }
    children[candidate.type].push(candidate);
  }
  for (const door of wallSegments.filter(s=>s.kind==='door')) {
    for (const wall of wallSegments.filter(s=>s.kind==='wall')) {
      if (conflictsWithDoor(door.c,wall.c)) reject('DOOR_OBSTRUCTED');
    }
  }
  for (let i=0;i<wallSegments.length;i++) {
    for (let j=i+1;j<wallSegments.length;j++) {
      const a=wallSegments[i], b=wallSegments[j];
      if (a.kind==='wall' && b.kind==='wall' && overlapsOnLine(a.c,b.c)) reject('OVERLAPPING_SEGMENT');
      if (a.kind==='door' && b.kind==='door' && conflictingDoorPortals(a.c,b.c)) reject('DOOR_PORTAL_OVERLAP');
    }
  }
  if (KIND_SORT.some(k => !types.has(k))) reject('MISSING_SEMANTIC_KIND');
  // Sort independently from caller input. Stable IDs are source-authority keys,
  // not server-created document IDs. Never create/update/delete Foundry docs here.
  for (const values of Object.values(children)) values.sort((a,b)=>a.stableId.localeCompare(b.stableId,'en'));
  const foundryScene = {
    name:scene.name.trim(),width:scene.width,height:scene.height,
    grid:{type:scene.grid.type,size:scene.grid.size,distance:scene.grid.distance,units:scene.grid.units},
    walls:children.Wall.map(x=>x.data),lights:children.AmbientLight.map(x=>x.data),
    regions:children.Region.map(x=>x.data)
  };
  return { version:SEMANTIC_SLICE_VERSION, status:'fixture-only-candidate',
    evidenceClass:'fixture',writesAllowed:false,approvedForInstallation:false,
    sourceBlueprint:{id:src.blueprintId,sha256:src.sha256,revision:src.revision,approvalId:src.approvalId},
    foundryScene,documents:children,
    blockers:['Not validated by Foundry 14 actual DataModels/server',
      'Current GM authorization, elected writer and user world not independently proven',
      'Real player token vision, light, doors and Region behavior unverified',
      'Artwork is not a scene geometry source; rendered image/level alignment unverified']
  };
}

/** Guarded preview only; no mutation API, never convert a player request to an action. */
export function previewSemanticSceneForActiveGm(blueprint,runtime,authorization) {
  if (!record(runtime,'RUNTIME') || !record(authorization,'AUTHORIZATION')) reject('RUNTIME');
  const game=runtime.game;
  if (!game || !game.user?.isGM || !game.user?.id || game.users?.activeGM?.id!==game.user.id) reject('ACTIVE_GM');
  if (typeof game.version!=='string' || !/^14\.\d+$/.test(game.version)) reject('FOUNDRY_VERSION');
  if (typeof game.world?.id!=='string' || game.world.id !== authorization.worldId) reject('WORLD_SCOPE');
  if (authorization.currentSingleWriterId!==game.user.id || authorization.activeGmId!==game.user.id) reject('SINGLE_WRITER');
  if (authorization.approvedBlueprintSha256!==blueprint?.source?.sha256 ||
      authorization.approvedBlueprintId!==blueprint?.source?.blueprintId) reject('APPROVAL_SCOPE');
  // Authorization is still a supplied fixture assertion, not independent
  // cryptographic GM/source proof. It NEVER grants world mutation.
  return convertSemanticSceneV14(blueprint);
}
