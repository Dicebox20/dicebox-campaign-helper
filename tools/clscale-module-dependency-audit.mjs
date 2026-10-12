// Offline package-dependency audit. This tool never downloads or enables modules.
import {readFile,writeFile} from "node:fs/promises";
import {join,resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {ClassicLevel}=require("C:/Program Files/Foundry Virtual Tabletop/resources/app/node_modules/classic-level");
const repo=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const base=join(repo,"work","foundry-fixture-data-permanent");
const target=join(base,"Data","worlds","dbx-test-world");
const modBase=join(base,"Data","modules");
const out=join(repo,"work","clscale-central-lodge-migration-v001","module-dependency-audit-v001.json");
const errors=[],warnings=[],observed=[];
const load=async path=>JSON.parse(await readFile(path,"utf8"));
let config=null;
const db=new ClassicLevel(join(target,"data","settings"),{keyEncoding:"utf8",valueEncoding:"utf8"});
await db.open();
try{for await(const [k,v] of db.iterator()){
 if (!/^!settings![^!]+$/.test(String(k))) continue;
 const j=JSON.parse(v);if(j.key==="core.moduleConfiguration")config=typeof j.value==="string"?JSON.parse(j.value):j.value;
}}finally{await db.close();}
if(!config)throw Error("NO_MODULE_CONFIG");
const active=Object.keys(config).filter(id=>config[id]===true).sort();
if(active.length!==39)errors.push("EXPECTED_39_MODULES_GOT_"+active.length);
const coreGeneration=14,system="dnd5e";
const gen=x=>Number(String(x??"").match(/^(?:v)?(\d+)/)?.[1]??NaN);
const versions=new Map();
for(const id of active){
 try{const data=await load(join(modBase,id,"module.json"));versions.set(id,data);}
 catch(e){errors.push("MODULE_MANIFEST_MISSING "+id+" "+e.message);}
}
for(const [id,j] of versions){
 const r=j.relationships??{},required=[...(r.requires??[])];
 const systems=[...(r.systems??[])];
 const deps=[];
 for(const d of [...required,...systems]){
  const kind=d.type??(systems.includes(d)?"system":"module");
  const dep={id:d.id,kind,versionMinimum:d.compatibility?.minimum??null,versionMaximum:d.compatibility?.maximum??null};
  if(!d.id){errors.push("EMPTY_DEP_ID "+id);continue;}
  const valid=kind==="system" ? d.id===system : versions.has(d.id);
  if(!valid)errors.push("REQUIRED_DEP_MISSING_OR_DISABLED "+id+" requires "+kind+":"+d.id);
  deps.push({...dep,activeAndAvailable:valid});
 }
 const compatibility=j.compatibility??{};
 if(Number.isFinite(gen(compatibility.minimum))&&gen(compatibility.minimum)>coreGeneration)errors.push("INCOMPATIBLE_CORE_MINIMUM "+id+" "+compatibility.minimum);
 if(Number.isFinite(gen(compatibility.maximum))&&gen(compatibility.maximum)<coreGeneration)errors.push("INCOMPATIBLE_CORE_MAXIMUM "+id+" "+compatibility.maximum);
 if(Number.isFinite(gen(compatibility.verified))&&gen(compatibility.verified)<coreGeneration)warnings.push("UNVERIFIED_CORE_14 "+id+" "+compatibility.verified);
 const legacyRequires=Array.isArray(j.dependencies)?j.dependencies.filter(d=>d?.type!=="system"&&d?.name):[];
 for(const d of legacyRequires)if(!versions.has(d.name))warnings.push("LEGACY_DEPENDENCY_UNRESOLVED "+id+" -> "+d.name);
 observed.push({id,version:j.version,compatibleMinimum:compatibility.minimum??null,
   compatibleMaximum:compatibility.maximum??null,verified:compatibility.verified??null,
   required:deps,recommendedCount:(r.recommends??[]).length});
}
const report={status:errors.length?"REQUIRED_DEPENDENCY_ISSUES":"REQUIRED_DEPENDENCIES_PASS",
 auditedAt:new Date().toISOString(),world:"dbx-test-world",activeCount:active.length,
 blockingErrors:errors,warnings,modules:observed,
 note:"Only module.json declared relationships are checked. Live system and module code may have undocumented dependencies."};
if(process.argv.includes("--save"))await writeFile(out,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({status:report.status,activeCount:report.activeCount,
 blockingErrors:errors,warningsCount:warnings.length,unverifiedExamples:warnings.slice(0,18),
 declaredRequiredCount:observed.reduce((n,m)=>n+m.required.length,0)},null,2));
if(errors.length)process.exitCode=1;