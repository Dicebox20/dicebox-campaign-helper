// Read-only exact installed clock source diagnostics, no mutation.
const region=game.scenes.get("U8S5ZrTjaPIkTUIL")?.regions.get("3tIrR12uv8ppFkOb");
const b=region?.behaviors.get("OUMWc1YjJ5DTSFzM");
const source=String(b?.system?.source??"");
const beginning=source.slice(0,500),ending=source.slice(-600);
return {operation:"cl13-stored-clock-readonly-v001",noWrite:true,behaviorId:b?.id,disabled:b?.disabled,
 type:b?.type,sourceLength:source.length,breakdowns:{CRLF:(source.match(/\r\n/g)||[]).length,LF:(source.match(/\n/g)||[]).length,
 CR:(source.match(/\r/g)||[]).length,trimDiff:source.length-source.trim().length},
 beginning,ending,
 containsV2Markers:{finished:source.includes("movement.finished"),query:source.includes('requestingUser.query("dialog"'),
 guard:source.includes('clockSettingResolved'),solution:source.includes('h!==4||m!==35')},
 sourceSha:Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(source))),x=>x.toString(16).padStart(2,'0')).join("")};
