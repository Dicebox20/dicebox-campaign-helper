const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");
if (!k) { console.error("[Central Lodge M2] Runtime Kernel missing."); return; }
const t = event?.data?.token ?? event?.token ?? null;
const a = t?.actor ?? null;
if (!a) return;
const hasRequired = Array.from(a.items ?? []).some(i => i.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:item:founders-signet");
if (!hasRequired) return;
return await k.execute({actor:a,token:t,event,speaker:{dicebox:{"contract":"dicebox-region-behavior/v1","action":"pickup","trigger":"TOKEN_ENTER","itemKey":"old-estate-survey","statePath":"puzzles.m2.founderPortraitOpened","value":true,"message":"<p>The Founder’s Signet engages a concealed fitting in the Founder Portrait. A hidden compartment releases, revealing the <strong>Old Estate Survey</strong>.</p>","persistentPickup":true}}});