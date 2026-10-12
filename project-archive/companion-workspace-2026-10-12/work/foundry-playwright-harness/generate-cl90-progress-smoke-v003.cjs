const fs=require("node:fs"),AF=Object.getPrototypeOf(async function(){}).constructor,src=fs.readFileSync("cl90-progress-safety-smoke-v002.page.js","utf8");
let t=src.replace("cl90.progress-safety-smoke-v002","cl90.progress-safety-smoke-v003").replace("ledger.revision!==0||Object.keys(ledger.notices??{}).length","ledger.revision!==1||Object.keys(ledger.notices??{}).length!==2||ledger.puzzles?.e1?.recentUseObserved!==true").replace("game.macros.size!==133","game.macros.size!==134");
const idx=t.lastIndexOf("return{operation:");
if(idx<0)throw Error("Smoke final return absent");
t=t.slice(0,idx)+`
const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");
if(!piano||piano.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:cl52:macro:m2-haunted-piano-one-shot"||piano.type!=="script"||await sha(piano.command)!=="c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b")failures.push("M2 haunted piano Macro source/ID drift");
if(m2?.getFlag("world","dicebox")?.cl52!==undefined)failures.push("M2 one-shot flag consumed unexpectedly");
if(Object.keys(ledger.notices??{}).sort().join("|")!=="e1|observation:e1")failures.push("E1 notice keys drift");
`+t.slice(idx);
new AF("event",t);fs.writeFileSync("cl90-progress-safety-smoke-v003.page.js",t,{flag:"wx"});
console.log("CL90_PROGRESS_SMOKE_V003_CREATED_SYNTAX_PASS");
