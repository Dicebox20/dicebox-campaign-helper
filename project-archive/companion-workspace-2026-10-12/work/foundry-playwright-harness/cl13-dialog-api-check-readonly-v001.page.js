// CL13 v002 read-only compatibility check of actual installed Foundry v14.367 APIs.
const Dialog=foundry?.applications?.api?.DialogV2;
const regionEvents=CONST?.REGION_EVENTS??{};
const event=regionEvents.TOKEN_MOVE_IN;
const s=game.scenes.get('U8S5ZrTjaPIkTUIL'),r=s?.regions.get('3tIrR12uv8ppFkOb');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state??null;
const k=game.macros.get('FHQiFYx6OntZVo9d');
const gm=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
return {operation:'cl13-dialog-api-check-readonly-v001',noWrite:true,foundryVersion:game.version,
 dialogStaticInput:typeof Dialog?.input,dialogStaticPrompt:typeof Dialog?.prompt,
 dialogStaticQuery:typeof Dialog?.query,queryArity:Dialog?.query?.length??null,
 tokenMoveInConstant:event,regionId:r?.id,regionBehaviors:r?.behaviors.size??null,
 currentGM:game.user.id,primaryGM:gm?.id,kernelExists:!!k,
 ledgerRevision:ledger?.revision,clockSolved:ledger?.puzzles?.m1?.clockSettingResolved,
 result:(typeof Dialog?.query==='function'&&event==='tokenMoveIn'&&r?.behaviors.size===0&&!!k&&ledger?.puzzles?.m1?.clockSettingResolved===false)?'PASS_WITH_UNTESTED_PLAYER_DELIVERY':'BLOCKED'};
