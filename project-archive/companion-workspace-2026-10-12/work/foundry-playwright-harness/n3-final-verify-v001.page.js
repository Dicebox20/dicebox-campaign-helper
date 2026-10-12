const SCENE_ID="pHQvDUDlyWZFuNrX",LEDGER_ID="xhlXv6CCH34HVga3",KERNEL_ID="FHQiFYx6OntZVo9d";
const KERNEL_SHA="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814",GEOM_SHA="43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3";
const scenes=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const expected=[
["8rdHFpvwspQ2gSCy","q7FrxNpzkTChRUSd","baggage-locker-observation","1a51cf2128f536f6daad8606594c0ff9eec16dbfa211bd6a730e26d998346187","observe"],
["8rdHFpvwspQ2gSCy","ppAZkMv2nw8vZ9BL","baggage-token-route-plate","7ad9e19ea12bff9d47e8ad94ce06ed0a1b905f2c3566e73daf68843d13d25602","socket"],
["eNrbnN68TYvMaBcT","XItPpdHkojcs2C3v","departure-board-route-plate","063b00971b8576c5c4d6dda2ae56171e2126b2ae527c0637cae0f1bcd466234c","socket"],
["7el4eN3Uwzxy7Wmi","6C5fkKasc9DWK1Sa","railway-switch-wheel-install","5210cb20045f8d93724dc14eebeb006f41a533298661d158cccabbff173d1c3b","socket"],
["NnF6XmWlZDayKfeJ","KXxOPWbOx4zdjSlH","cicada-wing-iv-recovery","4abf9900e4446282a106237df8cae52b64b5794abda63c81cc59bbc771b98aff","pickup"],
["U5Fs1VhLjW5EXWYv","boUIIQCQSm1Jy70u","recent-use-observation","1b5586bd4a00e840373208abe21cddf2d107272410ff61fd0ae50cf1c2973669","observe"],
["kuJ5pPqDjTJur5l4","8bWw5K81DTz5wyv6","walkable-railway-notice","76cb323b5eab8336ff6cd433a07303c072f5394c82430ad991a570bbf67add99","notice"],
["VE8p4CvgzqvhihuF","Hot1YlJfFQfANlqL","cartography-old-estate-survey","0451d6433608f009f771b3ca3bb4994947da1a221deb991a1a3dce87889a71a0","socket"],
["VE8p4CvgzqvhihuF","FJTjZnicKvXVBV77","cartography-cult-passage-diagram","79cd7480d47cc143338ab251a5dbb59e05aa207b4e9dc7f51f04fb9930205db2","socket"],
["VE8p4CvgzqvhihuF","LG7plLJFa5Sj8si8","cartography-recent-route-fragment","f10e97b02fbe387ed95de2e230c5190e7a8c1af5d396aff024980218fd66b44f","socket"],
["VE8p4CvgzqvhihuF","CAGlvXbm6uLupoRw","cartography-route-overlay","e55af15f2d7ac960e283519f4fae3ed97748d7fcd3f7e0f598843b7be05753c0","gate"]];
const copy=v=>foundry.utils.deepClone(v),dbx=v=>v?.getFlag?.("world","dicebox")??{},canonical=v=>JSON.stringify((function sort(o){return Array.isArray(o)?o.map(sort):o&&typeof o==="object"?Object.fromEntries(Object.keys(o).sort().map(k=>[k,sort(o[k])])):o})(v));
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(x??""))),b=>b.toString(16).padStart(2,"0")).join("");
const s=game.scenes.get(SCENE_ID),kernel=game.macros.get(KERNEL_ID),l=game.journal.get(LEDGER_ID),fail=[];
let regions=0,behaviors=0;
for(const id of scenes){const x=game.scenes.get(id);if(!x){fail.push("Scene missing: "+id);continue;}const rs=Array.from(x.regions);regions+=rs.length;behaviors+=rs.reduce((a,r)=>a+r.behaviors.size,0);}
if(regions!==202||behaviors!==112||s?.regions.size!==12||Array.from(s.regions).reduce((a,r)=>a+r.behaviors.size,0)!==11)fail.push("Count drift");
const raw=Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const gh=await sha(canonical(raw)),kh=await sha(kernel?.command??"");
if(gh!==GEOM_SHA||kh!==KERNEL_SHA)fail.push("Hash drift");
const actual=new Set(),rows=[];
for(const [rid,bid,key,hash,action] of expected){const region=s?.regions.get(rid),b=region?.behaviors.get(bid);if(!b){fail.push("Missing behavior "+key);continue;}const f=dbx(b),h=await sha(b.system?.source??"");const stable="dbx:central-lodge:n3:behavior:"+key;if(f.stableId!==stable||h!==hash||f.sourceHash!==hash||f.regionStableId!==dbx(region).stableId||f.behaviorSpec?.action!==action||b.disabled!==false||b.type!=="executeScript")fail.push("Behavior drift "+key);actual.add(bid);rows.push({key,regionId:rid,behaviorId:bid,sourceHash:h,status:"PASS"});}
for(const region of s.regions)for(const b of region.behaviors)if(!actual.has(b.id))fail.push("Unexpected behavior "+b.id);
for(const id of ["pqLFzMbGtFhKbCNK","tsRjZiiXw0qmktQS","foYsFHsLXtCbfiyR","RP1jYOH738xl9hks","DfZRIL6d6onjWFAc"])if(!s.regions.get(id)||s.regions.get(id).behaviors.size)fail.push("Deferred Region drift "+id);
const st=copy(l?.getFlag("world","dicebox")?.state??{}),n3=foundry.utils.getProperty(st,"puzzles.n3")??{};
if(st.revision!==0||Object.keys(st.notices??{}).length)fail.push("Ledger drift");
for(const x of ["baggageLockerObserved","baggageTokenAccepted","stationRoutePlateResolved","departureBoardResolved","switchWheelInstalled","recentUseObserved","walkableRailwayNoticeResolved","t3BranchUnlocked"])if(n3[x]!==false)fail.push("State drift "+x);
for(const x of ["oldEstateSurvey","cultPassageDiagram","recentRouteFragment","resolved"])if(n3.routeOverlay?.[x]!==false)fail.push("Overlay drift "+x);
if("railCarAvailable" in n3)fail.push("Legacy state added");
return{operation:"central-lodge.cl32.n3.final-verify",status:fail.length?"FAIL":"PASS",noWrite:true,failures:fail,scene:{id:SCENE_ID,regions:s?.regions.size,n3Behaviors:actual.size},baseline:{scenes:scenes.length,regions,behaviors},kernelHash:kh,geometryHash:gh,verified:rows,ledger:{revision:st.revision,notices:st.notices,n3},nextGate:fail.length?"STOP":"CL-33 T1/T2/T3 Read-Only Preflight"};