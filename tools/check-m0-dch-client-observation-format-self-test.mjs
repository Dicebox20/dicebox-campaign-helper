#!/usr/bin/env node
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import { classifyClientObservation } from "./check-m0-dch-client-observation-format.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const observer = readFileSync(join(root, "observe-m0-dch-gm-client.js"), "utf8");
const validator = join(root, "check-m0-dch-client-observation-format.mjs");
const clone = (v) => JSON.parse(JSON.stringify(v));

function syntheticObservation() {
  const user = { id: "private-user-id", name: "Owner confidential display name",
    role: 4, isGM: true, isSelf: true, isActiveGM: true, active: true };
  const game = {
    ready: true, view: "game", version: "14.367",
    world: { id: "dbx-test-world" },
    system: { id: "dnd5e", version: "5.3.3" },
    user, users: { activeGM: { ...user }, contents: [
      { ...user, password: "should-not-appear-in-observation" },
      { id: "private-player", name: "Other private name", role: 1, credential: "secret" },
    ] },
    modules: new Map([["dicebox-campaign-helper", {
      id: "dicebox-campaign-helper", version: "0.1.15", active: true,
    }]]),
  };
  const logs = [];
  const value = vm.runInNewContext(observer, { game,
    console: { info(...args) { logs.push(args); } },
    fetch() { throw Error("Not allowed"); },
  }, { timeout: 800 });
  assert.equal(logs.length, 1);
  return clone(value);
}

test("PR44 observer output format passes but never promotes GM authority or M0", () => {
  const result = classifyClientObservation(syntheticObservation());
  assert.equal(result.status, "VALID_CLIENT_FORMAT_NOT_AUTHENTICATED");
  assert.equal(result.authenticatedFoundryGmByHost, false);
  assert.equal(result.authenticatedChatGptCaller, false);
  assert.equal(result.moduleLoadedByteHashVerified, false);
  assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
  assert.equal(result.verifiedM0Criteria, 0);
  assert.equal(result.identitiesRedacted, true);
  for (const secret of ["Owner confidential", "private-user-id", "private-player", "secret"]) {
    assert.equal(JSON.stringify(result).includes(secret), false);
  }
});
const mutations = [
  ["source claims independently authenticated host", v => { v.independentlyAuthenticatedHostCaller = true; }, "UNRECOGNIZED_OR_PROMOTED_CLIENT_REPORT"],
  ["source claims authenticated ChatGPT", v => { v.authenticatedChatGptCaller = true; }, "UNRECOGNIZED_OR_PROMOTED_CLIENT_REPORT"],
  ["source claims loaded module SHA", v => { v.loadedModuleByteHashVerified = true; }, "UNRECOGNIZED_OR_PROMOTED_CLIENT_REPORT"],
  ["source claims M0 accepted", v => { v.m0Acceptance = "ACCEPTED"; }, "UNRECOGNIZED_OR_PROMOTED_CLIENT_REPORT"],
  ["extra top-level unlisted credentials", v => { v.credentials = "private"; }, "UNRECOGNIZED_OR_PROMOTED_CLIENT_REPORT"],
  ["wrong world", v => { v.target.exactWorldId = "production-world"; }, "WRONG_WORLD_OR_VERSION"],
  ["wrong system", v => { v.target.systemId = "pf2e"; }, "WRONG_WORLD_OR_VERSION"],
  ["wrong Foundry major", v => { v.target.foundryVersion = "13.0"; }, "WRONG_WORLD_OR_VERSION"],
  ["invalid timestamp", v => { v.observedAtUtc = "no-date"; }, "MALFORMED_OBSERVATION_TIMESTAMP"],
  ["role not GM", v => { v.currentUser.role = 3; }, "CURRENT_USER_NOT_VALID_ELECTED_GM"],
  ["active-GM user mismatch", v => { v.electedActiveGm.id = "other-gm"; }, "ELECTED_GM_MISMATCH"],
  ["DCH inactive", v => { v.dchModule.active = false; }, "DCH_MODULE_NOT_OBSERVED_ACTIVE"],
  ["wrong DCH module", v => { v.dchModule.version = "0.1.14"; }, "DCH_MODULE_NOT_OBSERVED_ACTIVE"],
  ["secret extra User property", v => { v.existingUsers[0].password = "private"; }, "PRIVATE_USER_LIST_INVALID"],
  ["missing own User in collection", v => { v.existingUsers[0].id = "other-user"; }, "PRIVATE_USER_LIST_INVALID"],
  ["duplicate User IDs", v => { v.existingUsers[1].id = v.existingUsers[0].id; }, "PRIVATE_USER_LIST_INVALID"],
  ["unbounded Users", v => { v.existingUsers = Array.from({length:51},(_,i)=>({id:"user-"+i,name:"User "+i,role:1})); }, "PRIVATE_USER_LIST_INVALID"],
  ["missing limitations", v => { v.remainingBlockers = []; }, "MISSING_CLIENT_ONLY_LIMITATIONS"],
];
for(const [name,mutate,reason] of mutations){
  test("reject " + name,()=>{
    const obs=syntheticObservation();mutate(obs);
    const result=classifyClientObservation(obs);
    assert.equal(result.status,"BLOCKED_CLIENT_FORMAT");
    assert.equal(result.reason,reason);
    assert.equal(result.verifiedM0Criteria,0);
    assert.equal(result.m0Acceptance,"NOT_ACCEPTED");
    assert.equal(JSON.stringify(result).includes("private-user-id"),false);
  });
}
test("blocked browser client observation remains blocked format without underlying reason",()=>{
  const obs=syntheticObservation();
  const blocked={
    schemaVersion:"1.0.0",
    operation:obs.operation,
    status:"BLOCKED",
    evidenceClass:"browser-client-self-observation",
    expectedWorldId:"dbx-test-world",
    reason:"CURRENT_CLIENT_IS_NOT_ACTIVE_ELECTED_GM",
    noFoundryWrite:true, networkRequests:0,
    independentlyAuthenticatedHostCaller:false,
    authenticatedChatGptCaller:false,
    loadedModuleByteHashVerified:false,
    m0Acceptance:"NOT_ACCEPTED",
  };
  const result=classifyClientObservation(blocked);
  assert.equal(result.status,"CLIENT_OBSERVER_BLOCKED");
  assert.equal(result.verifiedM0Criteria,0);
});
test("missing receipt in CLI is blocked and nonzero",()=>{
  const p=spawnSync(process.execPath,[validator],{encoding:"utf8",timeout:3500});
  assert.equal(p.status,2);
  const r=JSON.parse(p.stdout);
  assert.equal(r.reason,"OWNER_CLIENT_REPORT_NOT_PROVIDED");
  assert.equal(r.m0Acceptance,"NOT_ACCEPTED");
});
test("CLI accepts observer output but emits no private names or ids",()=>{
  const dir=mkdtempSync(join(tmpdir(),"dch-gm-format-"));
  try{
    const path=join(dir,"observation.json");
    writeFileSync(path,JSON.stringify(syntheticObservation()));
    const p=spawnSync(process.execPath,[validator,path],{encoding:"utf8",timeout:3500});
    assert.equal(p.status,0);
    const report=JSON.parse(p.stdout);
    assert.equal(report.status,"VALID_CLIENT_FORMAT_NOT_AUTHENTICATED");
    assert.equal(report.authenticatedFoundryGmByHost,false);
    assert.equal(p.stdout.includes("Owner confidential"),false);
    assert.equal(p.stdout.includes("private-user-id"),false);
  }finally{rmSync(dir,{recursive:true,force:true})}
});
