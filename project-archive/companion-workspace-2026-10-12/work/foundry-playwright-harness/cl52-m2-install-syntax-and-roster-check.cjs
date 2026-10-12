const fs=require("fs"),A=Object.getPrototypeOf(async function(){}).constructor;
for(const x of ["cl52-m2-macro-model-preview-v001.page.js","cl52-m2-macro-guarded-apply-v001.page.js","cl52-m2-macro-final-verify-v001.page.js"]){
const txt=fs.readFileSync(x,"utf8");new A("event",txt);
if(!txt.includes("JZkxX6lUQe8Nc8xJ"))throw Error("M2 scene missing");
if(x.includes("guarded-apply")||x.includes("final-verify")){
const m=txt.match(/"DLcheEi6e5OHOYmU","([^"]+)","([^"]+)"/);if(!m||m[1]!=="U8S5ZrTjaPIkTUIL"||m[2]!=="JZkxX6lUQe8Nc8xJ")throw Error("Canonical scene roster not fixed: "+x);
}console.log(x,"SOURCE_SYNTAX_AND_ROSTER_PASS")}
