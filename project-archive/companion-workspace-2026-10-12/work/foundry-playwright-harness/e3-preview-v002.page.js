const SCENE_ID = "iqfCcDpEer4pwrJj";
const LEDGER_ID = "xhlXv6CCH34HVga3";
const KERNEL_ID = "FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH = "6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH = "d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d";

const LODGE_SCENES = [
  "0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x",
  "Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU",
  "U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN",
  "4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ",
  "La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"
];

const REGIONS = {
  sundial:"W1Ev9M2xDxY5Idvf",
  sundialNotice:"KXDqeyk8aXKyvqiD",
  fountainNotice:"cDHDjjUPZqJi1MEf",
  gardenProof:"YNFHW4XmJk0zmM31",
  waterWheel:"r4OCHwd6BjmUPcSU",
  valveCap:"S05hcoVOMueJCqFr",
  roseCrest:"DZZzWnpZnyR6ICMP",
  fountainSequence:"oZjzgI1wG3pfqDp9",
  lightGreenhouse:"3ZtYYE3yUtM7cxQy",
  lightGarden:"ndaaChpgZ1eWiskE",
  transitionWest:"4RdJf3gS51WKvmsE",
  transitionSouth:"xe0ivUALRC8NjPOQ"
};

const clone = v => foundry.utils.deepClone(v);
const dbx = doc => { try { return clone(doc?.getFlag?.("world","dicebox") ?? {}); } catch { return {}; } };
const stableIdOf = doc => dbx(doc)?.stableId ?? null;
const normalize = value => Array.isArray(value)
  ? value.map(normalize)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map(k => [k, normalize(value[k])]))
    : value;
const canonical = value => JSON.stringify(normalize(value));
const sha256 = async value => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(value ?? "")));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,"0")).join("");
};
const geometrySnapshot = scene => Array.from(scene.regions ?? [])
  .map(region => {
    const s = region.toObject();
    return {id:region.id,shapes:s.shapes ?? null,elevation:s.elevation ?? null,visibility:s.visibility ?? null,locked:s.locked ?? null};
  })
  .sort((a,b)=>a.id.localeCompare(b.id));

const dispatcher = request => [
  'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
  'if (!k) { console.error("[Central Lodge E3] Runtime Kernel missing."); return; }',
  'const t = event?.data?.token ?? event?.token ?? null;',
  'const a = t?.actor ?? null;',
  'return await k.execute({actor:a,token:t,event,speaker:{dicebox:' + JSON.stringify(request) + '}});'
].join("\n");

const specs = [
  {
    key:"sundial-notice", regionId:REGIONS.sundialNotice, name:"DiceBox E3 Sundial Notice",
    stableId:"dbx:central-lodge:e3:behavior:sundial-notice",
    expectedHash:"679062540f00c7a0e29e1b8efd0d414d5dc124f1530ceef5b16011013f1c59f4",
    request:{
      contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"e3.sundial",dc:6,stage2Skill:"Investigation",
      successMessage:"<p>The sundial is incomplete. Its center has a fitted socket where a removable metal gnomon should stand.</p>",
      followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,
      criticalClueFallback:"Deliberate inspection reveals that the sundial is missing a fitted metal gnomon."
    }
  },
  {
    key:"sundial-gnomon", regionId:REGIONS.sundial, name:"DiceBox E3 Brass Gnomon",
    stableId:"dbx:central-lodge:e3:behavior:sundial-gnomon",
    expectedHash:"7e396521e0b5b50b21c3af288d17010ca75b7eaec545c2ef4e73e877d49c0ec6",
    request:{
      contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"brass-gnomon",
      statePath:"puzzles.e3.sundialResolved",consume:false,
      missingMessage:"<p>The sundial's empty center is shaped for a narrow fitted metal piece.</p>",
      successMessage:"<p>The <strong>Brass Gnomon</strong> seats cleanly into the sundial. The mechanism settles into place and a concealed catch beneath the dial releases.</p>"
    }
  },
  {
    key:"fountain-notice", regionId:REGIONS.fountainNotice, name:"DiceBox E3 Fountain Notice",
    stableId:"dbx:central-lodge:e3:behavior:fountain-notice",
    expectedHash:"7c28cf9cd0eb7f1320ec41eff2bc7b3d4ef5a5eb7f8a8b87320257199c8182c5",
    request:{
      contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"e3.fountain",dc:6,stage2Skill:"Investigation",
      successMessage:"<p>The fountain is more mechanism than ornament. Its fittings and channels suggest an ordered control sequence rather than a simple valve.</p>",
      followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,
      criticalClueFallback:"Deliberate inspection reveals that the fountain's controls must be operated in a deliberate sequence."
    }
  },
  {
    key:"garden-proof-recovery", regionId:REGIONS.gardenProof, name:"DiceBox E3 Garden Proof Recovery",
    stableId:"dbx:central-lodge:e3:behavior:garden-proof-recovery",
    expectedHash:"7edad00a3c17aa2364b34aee5f09587713e07d1cbfc77ef70a58b35f54e01982",
    request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"garden-proof",
      statePath:"items.garden-proof.recovered",value:true,
      message:"<p>You recover the <strong>Garden Proof</strong> from the neglected garden marker.</p>",persistentPickup:true}
  },
  {
    key:"water-control-wheel-install", regionId:REGIONS.waterWheel, name:"DiceBox E3 Water Control Wheel Installation",
    stableId:"dbx:central-lodge:e3:behavior:water-control-wheel-install",
    expectedHash:"e674307737b04ee6c79c49264223dd961b9aa6f80ca4113fb4990dfc2c785ca7",
    request:{contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"water-control-wheel",
      statePath:"puzzles.e3.waterControlWheelInstalled",consume:false,
      missingMessage:"<p>The fountain assembly has an exposed control spindle, but its wheel is missing.</p>",
      successMessage:"<p>The <strong>Water Control Wheel</strong> from the basement fits the garden mechanism. The control spindle can now be operated.</p>"}
  },
  {
    key:"fountain-valve-cap-recovery", regionId:REGIONS.valveCap, name:"DiceBox E3 Fountain Valve Cap Recovery",
    stableId:"dbx:central-lodge:e3:behavior:fountain-valve-cap-recovery",
    expectedHash:"52f1042eb39240180cd7ce2bff84b77ba7f1179d7661adc1634606a5d86c80e7",
    request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"fountain-valve-cap",
      statePath:"items.fountain-valve-cap.recovered",value:true,
      message:"<p>Among the greenhouse fittings you recover the <strong>Fountain Valve Cap</strong>.</p>",persistentPickup:true}
  },
  {
    key:"rose-crest-recovery", regionId:REGIONS.roseCrest, name:"DiceBox E3 Rose Crest Recovery",
    stableId:"dbx:central-lodge:e3:behavior:rose-crest-recovery",
    expectedHash:"4ac647ec4e653f5e2ca06c42f68fe9e5f2a67b01186464849964c61485b3e24f",
    request:{contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"rose-crest",
      statePath:"items.rose-crest.recovered",value:true,
      message:"<p>You recover the weathered <strong>Rose Crest</strong> from the garden memorial.</p>",persistentPickup:true}
  },
  {
    key:"fountain-sequence", regionId:REGIONS.fountainSequence, name:"DiceBox E3 Fountain Sequence",
    stableId:"dbx:central-lodge:e3:behavior:fountain-sequence",
    expectedHash:"16e580bc9d2aea880745a62d31242085187d23ae520d82e1264b3bcd9dc2e8ef",
    request:{contract:"dicebox-region-behavior/v1",action:"gate",trigger:"TOKEN_ENTER",statePath:"puzzles.e3.fountainResolved",
      requirements:[
        {type:"state",path:"puzzles.e3.waterControlWheelInstalled",value:true},
        {type:"actorHasItem",itemKey:"fountain-valve-cap"},
        {type:"actorHasItem",itemKey:"well-carving-pattern"}
      ],
      set:[
        {path:"puzzles.e3.fountainValveInstalled",value:true},
        {path:"puzzles.e3.wellPatternApplied",value:true}
      ],
      incompleteMessage:"<p>The fountain mechanism is still incomplete. Its spindle needs its control wheel, one fitting is uncapped, and the correct operating order is not obvious from the mechanism alone.</p>",
      successMessage:"<p>Using the <strong>Well Carving Pattern</strong> as the operating sequence, you seat the <strong>Fountain Valve Cap</strong> and work the restored control wheel. Water shifts through hidden channels beneath the garden as the fountain mechanism settles into its resolved state.</p>"}
  }
];

const failures = [];
const warnings = [];
const scene = game.scenes.get(SCENE_ID);
const ledger = game.journal.get(LEDGER_ID);
const kernel = game.macros.get(KERNEL_ID);
if (!scene) failures.push("E3 Scene missing.");
if (!ledger) failures.push("Ledger missing.");
if (!kernel) failures.push("Kernel missing.");

const kernelHash = kernel ? await sha256(kernel.command ?? "") : null;
if (kernelHash !== EXPECTED_KERNEL_HASH) failures.push(`Kernel hash ${kernelHash}; expected ${EXPECTED_KERNEL_HASH}.`);

let regionCount=0, behaviorCount=0;
for (const id of LODGE_SCENES) {
  const s = game.scenes.get(id);
  if (!s) { failures.push(`Canonical Lodge Scene missing: ${id}.`); continue; }
  const regions=Array.from(s.regions ?? []);
  regionCount += regions.length;
  behaviorCount += regions.reduce((sum,r)=>sum+Array.from(r.behaviors ?? []).length,0);
}
if (regionCount !== 202) failures.push(`Lodge Regions ${regionCount}; expected 202.`);
if (behaviorCount !== 43) failures.push(`Lodge behaviors ${behaviorCount}; expected 43.`);

const e3Behaviors = scene ? Array.from(scene.regions ?? []).reduce((sum,r)=>sum+Array.from(r.behaviors ?? []).length,0) : null;
if (scene?.regions?.size !== 12) failures.push(`E3 Regions ${scene?.regions?.size}; expected 12.`);
if (e3Behaviors !== 0) failures.push(`E3 behaviors ${e3Behaviors}; expected 0.`);

const geometryHash = scene ? await sha256(canonical(geometrySnapshot(scene))) : null;
if (geometryHash !== EXPECTED_GEOMETRY_HASH) failures.push(`E3 stable geometry hash ${geometryHash}; expected ${EXPECTED_GEOMETRY_HASH}.`);

for (const spec of specs) {
  const region=scene?.regions.get(spec.regionId);
  if (!region) failures.push(`${spec.key}: Region missing.`);
  else if (region.behaviors.size !== 0) failures.push(`${spec.key}: target Region already has behavior(s).`);
}

for (const id of [REGIONS.lightGreenhouse,REGIONS.lightGarden,REGIONS.transitionWest,REGIONS.transitionSouth]) {
  const r=scene?.regions.get(id);
  if (!r) failures.push(`Deferred E3 Region missing: ${id}.`);
  else if (r.behaviors.size !== 0) failures.push(`${r.name} unexpectedly has behavior(s).`);
}

const allBehaviors=LODGE_SCENES.map(id=>game.scenes.get(id)).filter(Boolean)
  .flatMap(s=>Array.from(s.regions ?? [])).flatMap(r=>Array.from(r.behaviors ?? []));
for (const spec of specs) {
  const collisions=allBehaviors.filter(b=>stableIdOf(b)===spec.stableId);
  if (collisions.length) failures.push(`${spec.key}: stable-ID collision x${collisions.length}.`);
}

for (const itemKey of ["brass-gnomon","well-carving-pattern","fountain-valve-cap","water-control-wheel","garden-proof","rose-crest"]) {
  const matches=game.items.filter(i=>stableIdOf(i)===`dbx:central-lodge:item:${itemKey}`);
  if (matches.length !== 1) failures.push(`${itemKey}: canonical Item count ${matches.length}; expected 1.`);
}

const state=clone(ledger?.getFlag("world","dicebox")?.state ?? {});
if (Number(state?.revision)!==0) failures.push(`Ledger revision ${state?.revision}; expected 0.`);
if (Object.keys(state?.notices ?? {}).length!==0) failures.push("Ledger notices are not empty.");
for (const key of ["sundialNoticeResolved","sundialResolved","fountainNoticeResolved","fountainValveInstalled","waterControlWheelInstalled","wellPatternApplied","fountainResolved"]) {
  const v=foundry.utils.getProperty(state,`puzzles.e3.${key}`);
  if (v!==false) failures.push(`puzzles.e3.${key} is ${v}; expected false.`);
}

const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const behaviorRows=[];
for (const spec of specs) {
  const source=dispatcher(spec.request);
  let syntax="PASS";
  try { new AsyncFunction("event",source); } catch(e) { syntax="FAIL"; failures.push(`${spec.key}: syntax ${e.message}`); }
  const sourceHash=await sha256(source);
  if (sourceHash!==spec.expectedHash) failures.push(`${spec.key}: source hash ${sourceHash}; expected ${spec.expectedHash}.`);
  behaviorRows.push({key:spec.key,regionId:spec.regionId,stableId:spec.stableId,action:spec.request.action,sourceHash,syntax});
}

return {
  operation:"central-lodge.cl15.e3.behavior-preview-v002",
  status:failures.length ? "BLOCKED" : "PASS",
  noWrite:true,
  failures,warnings,
  baseline:{scenes:LODGE_SCENES.length,regions:regionCount,behaviors:behaviorCount,e3Regions:scene?.regions?.size ?? null,e3Behaviors,kernelHash,geometryHash,ledgerRevision:state?.revision ?? null},
  plannedBehaviors:behaviorRows,
  expectedAfterApply:{regions:202,behaviors:51,e3Regions:12,e3Behaviors:8,lightBehaviors:0,transitionBehaviors:0},
  nextGate:failures.length ? "STOP" : "CL-15 E3 APPLY (primary-active-GM write gate)"
};