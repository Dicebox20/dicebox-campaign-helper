import { describe, expect, it } from "vitest";
import {
  canonicalizeFoundryIr,
  classifyStagedInverseRetryState,
  createStagedInverseExecutionAuthorization,
  createStagedInverseExecutionManifest,
  selectNextStagedInverseOperation,
  sha256FoundryIr,
  stagedInverseTerminalReceiptSchema,
  validateExactStagedInverseExecutionManifest,
  validateStagedInverseOperationReadback,
} from "@dicebox/compiler";

const plan = {
  schemaVersion:"0.1.0", inversePlanId:"dbx:inverse-plan:dispatch", originalPlanId:"dbx:plan:dispatch", originalPlanSha256:"a".repeat(64), approvedByUserId:"gm", requiredActiveGm:true,
  reverseDependencyOrder:["dbx:tile:dispatch","dbx:scene:dispatch"],
  operations:[
    {kind:"restore-update-preimage",stableId:"dbx:tile:dispatch",binding:{semantic:{id:"dbx:tile:dispatch",kind:"asset"},runtime:"foundry",documentType:"Tile",documentId:"t",uuid:"Scene.s.Tile.t",generation:1},expectedOwnership:{moduleId:"dicebox-campaign-helper",stableId:"dbx:tile:dispatch",mode:"managed"},preimage:{documentType:"Tile",fields:{x:0,y:0,width:1,height:1,textureSrc:null}},preimageSha256:"b".repeat(64)},
    {kind:"delete-owned-create",stableId:"dbx:scene:dispatch",binding:{semantic:{id:"dbx:scene:dispatch",kind:"scene"},runtime:"foundry",documentType:"Scene",documentId:"s",uuid:"Scene.s",generation:1},expectedOwnership:{moduleId:"dicebox-campaign-helper",stableId:"dbx:scene:dispatch",mode:"managed"}},
  ],
  createdAt:"2026-08-31T01:00:00.000Z", execution:"not-implemented", readyClaim:false,
} as const;

async function request() {
  const authorization = await createStagedInverseExecutionAuthorization({authorizationId:"dbx:inverse-authorization:dispatch",inversePlan:plan,authorizedByActiveGmUserId:"gm",authorizedAt:"2026-08-31T01:01:00.000Z"});
  return {inversePlan:plan,authorization,approvedInversePlanId:plan.inversePlanId,approvedByUserId:"gm",activeGmUserId:"gm",idempotencyKey:"dbx:inverse-idempotency:dispatch-request"};
}

async function manifest() {
  return createStagedInverseExecutionManifest(await request(),"dbx:inverse-manifest:dispatch","fixture-adapter","2026-08-31T01:02:00.000Z");
}

function deleteReadback(inversePlanSha256:string, operation: {manifestId:string;sequence:number;stableId:string;idempotencyKey:string;operationSha256:string}) {
  return {schemaVersion:"0.1.0",operationKind:"delete-owned-create" as const,inversePlanId:plan.inversePlanId,inversePlanSha256,manifestId:operation.manifestId,sequence:operation.sequence,stableId:operation.stableId,idempotencyKey:operation.idempotencyKey,operationSha256:operation.operationSha256,status:"owned-absent" as const,binding:null,observedAt:"2026-08-31T01:03:00.000Z",authoritativeReread:true as const,foreignStatePreserved:true as const};
}

function restoreReadback(inversePlanSha256:string, operation: {manifestId:string;sequence:number;stableId:string;idempotencyKey:string;operationSha256:string}) {
  return {schemaVersion:"0.1.0",operationKind:"restore-update-preimage" as const,inversePlanId:plan.inversePlanId,inversePlanSha256,manifestId:operation.manifestId,sequence:operation.sequence,stableId:operation.stableId,idempotencyKey:operation.idempotencyKey,operationSha256:operation.operationSha256,status:"preimage-matched" as const,binding:{semantic:{id:"dbx:tile:dispatch",kind:"asset"},runtime:"foundry",documentType:"Tile",documentId:"t",uuid:"Scene.s.Tile.t",generation:1},expectedPreimageSha256:"b".repeat(64),observedPayloadSha256:"b".repeat(64),observedAt:"2026-08-31T01:03:00.000Z",authoritativeReread:true as const,foreignStatePreserved:true as const};
}

function terminalReceipt(selection: {manifestId:string;sequence:number;stableId:string;kind:"delete-owned-create"|"restore-update-preimage";idempotencyKey:string;operationSha256:string}, readback: ReturnType<typeof deleteReadback>|ReturnType<typeof restoreReadback>, inversePlanSha256:string, status:"committed"|"recovered" = "committed") {
  return {schemaVersion:"0.1.0",receiptId:`dbx:inverse-receipt:${selection.stableId.split(":").at(-1)}`,manifestId:"dbx:inverse-manifest:dispatch",inversePlanId:plan.inversePlanId,inversePlanSha256,permitId:"dbx:inverse-permit:dispatch",claimId:"dbx:inverse-claim:dispatch",sequence:selection.sequence,stableId:selection.stableId,operationKind:selection.kind,idempotencyKey:selection.idempotencyKey,dispatchStatus:status === "recovered" ? "unknown" as const : "accepted" as const,status,recoveredFromUnknown:status === "recovered",recoveredFromReceiptId:status === "recovered" ? "dbx:inverse-receipt:unknown" : null,recoveredFromReceiptSha256:status === "recovered" ? "a".repeat(64) : null,readback,retryState:classifyStagedInverseRetryState(readback),blockers:[],receiptPersistence:"terminal" as const,authoritativeReread:true as const,foreignStatePreserved:true as const,execution:"not-implemented" as const,readyClaim:false as const,observedAt:"2026-08-31T01:04:00.000Z"};
}

describe("staged inverse dispatch state", () => {
  it("requires an exact self-hashed manifest projection and selects reverse dependency order", async () => {
    const req = await request();
    const current = await manifest();
    await expect(validateExactStagedInverseExecutionManifest(req,current)).resolves.toMatchObject({manifest:{manifestId:current.manifestId}});
    const {manifestSha256:_hash,...unsigned} = current;
    const altered = {...unsigned,operations:current.operations.map((operation,index)=>index === 0 ? {...operation,kind:"restore-update-preimage" as const} : operation)};
    const tampered = {...altered,manifestSha256:await sha256FoundryIr(canonicalizeFoundryIr(altered))};
    await expect(validateExactStagedInverseExecutionManifest(req,tampered)).rejects.toThrow("exactly match");
    const selected = await selectNextStagedInverseOperation(req,current,[]);
    expect(selected).toMatchObject({status:"selected",selection:{stableId:"dbx:tile:dispatch",sequence:1},precedingStableIds:[]});
  });

  it("requires terminal predecessor receipts before selecting the next operation and completes only after all receipts", async () => {
    const req = await request();
    const current = await manifest();
    const first = await selectNextStagedInverseOperation(req,current,[]);
    if (first.status !== "selected") throw new Error("expected first inverse selection");
     const tileReceipt = terminalReceipt(first.selection,restoreReadback(req.authorization.inversePlanSha256,first.selection),req.authorization.inversePlanSha256);
    expect(stagedInverseTerminalReceiptSchema.parse(tileReceipt).status).toBe("committed");
    const second = await selectNextStagedInverseOperation(req,current,[tileReceipt]);
    expect(second).toMatchObject({status:"selected",selection:{stableId:"dbx:scene:dispatch",sequence:0},precedingStableIds:["dbx:tile:dispatch"]});
    if (second.status !== "selected") throw new Error("expected second inverse selection");
     const sceneReceipt = terminalReceipt(second.selection,deleteReadback(req.authorization.inversePlanSha256,second.selection),req.authorization.inversePlanSha256);
    await expect(selectNextStagedInverseOperation(req,current,[tileReceipt,sceneReceipt])).resolves.toMatchObject({status:"complete"});
     await expect(selectNextStagedInverseOperation(req,current,[{...tileReceipt,status:"unknown" as const,dispatchStatus:"unknown" as const,recoveredFromUnknown:false,readback:{...tileReceipt.readback,status:"unknown" as const,binding:null,observedPayloadSha256:null},retryState:{...tileReceipt.retryState,state:"reread-required" as const,reason:"unknown-outcome" as const,retryAfter:"authoritative-reread" as const}}])).resolves.toMatchObject({status:"blocked"});
  });

  it("classifies delete absence, restore preimage, conflicts, and unknown outcomes without retrying automatically", async () => {
    const req = await request();
     const current = await manifest();
     const deleteOperation = plan.operations[1];
     const restoreOperation = plan.operations[0];
     const deleteManifestOperation = current.operations.find((operation) => operation.stableId === deleteOperation.stableId)!;
     const restoreManifestOperation = current.operations.find((operation) => operation.stableId === restoreOperation.stableId)!;
     const deleteIdentity = {...deleteManifestOperation,manifestId:current.manifestId};
     const restoreIdentity = {...restoreManifestOperation,manifestId:current.manifestId};
     expect(validateStagedInverseOperationReadback(deleteReadback(req.authorization.inversePlanSha256,deleteIdentity),deleteOperation,plan.inversePlanId,req.authorization.inversePlanSha256,deleteIdentity).status).toBe("owned-absent");
     expect(validateStagedInverseOperationReadback(restoreReadback(req.authorization.inversePlanSha256,restoreIdentity),restoreOperation,plan.inversePlanId,req.authorization.inversePlanSha256,restoreIdentity).status).toBe("preimage-matched");
     expect(()=>validateStagedInverseOperationReadback({...restoreReadback(req.authorization.inversePlanSha256,restoreIdentity),expectedPreimageSha256:"c".repeat(64)},restoreOperation,plan.inversePlanId,req.authorization.inversePlanSha256,restoreIdentity)).toThrow("preimage digest");
     expect(classifyStagedInverseRetryState({...deleteReadback(req.authorization.inversePlanSha256,deleteIdentity),status:"unknown" as const,binding:null})).toMatchObject({state:"reread-required",retryAfter:"authoritative-reread",reason:"unknown-outcome"});
  });
});
