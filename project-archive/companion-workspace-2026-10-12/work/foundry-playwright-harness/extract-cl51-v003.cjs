const fs=require("node:fs"),path=require("node:path");
const bytes=fs.readFileSync("cl51-fixture-audit-raw-v003.json");const raw=bytes[0]===255&&bytes[1]===254?bytes.subarray(2).toString("utf16le"):bytes.toString("utf8");
let v;try{v=JSON.parse(raw)}catch(e){console.error("JSON_PARSE_FAIL",String(e),raw.slice(0,300));process.exitCode=1;return;}
const x=v.result??{};if(String(x.status).startsWith("FAIL")||!Array.isArray(x.lights)){console.log("BAD_AUDIT",x.status,x.errors);process.exitCode=1;return;}
fs.mkdirSync("receipts",{recursive:true});fs.writeFileSync("receipts/cl51-fixture-register-v003.json",JSON.stringify({operation:x.operation,status:x.status,summary:x.summary,lights:x.lights},null,2));
console.log("CL51_REGISTER_SAVED",x.status,JSON.stringify(x.summary));
