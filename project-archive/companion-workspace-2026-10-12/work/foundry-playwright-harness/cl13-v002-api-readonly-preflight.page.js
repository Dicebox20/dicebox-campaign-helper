// Read-only preflight for the CL13 revised RegionBehavior v002.
// No Region triggers, Tokens, or Dialogs are invoked.
const D=foundry.applications?.api?.DialogV2;
const region=game.scenes.get('U8S5ZrTjaPIkTUIL')?.regions.get('3tIrR12uv8ppFkOb');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
return {operation:'cl13-v002-api-readonly-preflight',noWrite:true,
 exact:{world:game.world.id,foundry:game.version,system:game.system.id,systemVersion:game.system.version},
 events:{tokenMoveIn:CONST.REGION_EVENTS.TOKEN_MOVE_IN},
 dialog:{input:typeof D?.input,prompt:typeof D?.prompt,query:typeof D?.query},
 userQuery:{typeofMethod:typeof game.user.query,queryRegistryDialogType:typeof CONFIG?.queries?.dialog},
 execution:{authorizedSessionIsGM:game.user.isGM,authoritativePrimaryId:primary?.id,activeGMs:game.users.filter(u=>u.active&&u.isGM).length,activeNonGMUsers:game.users.filter(u=>u.active&&!u.isGM).length},
 region:{id:region?.id,stableId:region?.getFlag('world','dicebox')?.stableId,behaviorCount:region?.behaviors.size},
 ledger:{revision:ledger?.revision,emblemInstalled:ledger?.puzzles?.m1?.silverFamilyEmblemInstalled,clockSolved:ledger?.puzzles?.m1?.clockSettingResolved,compartmentOpened:ledger?.puzzles?.m1?.clockCompartmentOpened}};
