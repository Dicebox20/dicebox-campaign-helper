#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const STATE_PATH = path.join(ROOT, "work", "lodge-campaign", "AUTOMATION-STATE.json");
const PHASES = ["PREPARE","RENDER","INSPECT","BUILD","IMPLEMENT","VERIFY","COMPLETE"];
const PASS_NEXT = {
  PREPARE:"RENDER",
  RENDER:"INSPECT",
  INSPECT:"BUILD",
  BUILD:"IMPLEMENT",
  IMPLEMENT:"VERIFY",
  VERIFY:"COMPLETE"
};

function load() {
  const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  validate(state);
  return state;
}

function save(state) {
  validate(state);
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

function validate(state) {
  if (state.campaignId !== "central-lodge") throw new Error("Wrong campaignId.");
  if (!Array.isArray(state.maps) || state.maps.length !== 21) throw new Error("Expected the 21-map Lodge roster.");
  const ids = new Set();
  for (const m of state.maps) {
    if (ids.has(m.sceneId)) throw new Error(`Duplicate sceneId ${m.sceneId}`);
    ids.add(m.sceneId);
    if (!PHASES.includes(m.phase)) throw new Error(`Invalid phase for ${m.sceneId}: ${m.phase}`);
  }
  const active = state.maps.filter(m => m.status === "ACTIVE");
  if (active.length > 1) throw new Error("Only one map may be ACTIVE.");
  if (state.currentSceneId && active.length === 1 && active[0].sceneId !== state.currentSceneId) {
    throw new Error("currentSceneId does not match ACTIVE map.");
  }
}

function current(state) {
  return state.maps.find(m => m.sceneId === state.currentSceneId) ?? null;
}

function activateNext(state) {
  const next = state.maps.find(m => m.status === "QUEUED");
  if (!next) {
    state.currentSceneId = null;
    state.campaignStatus = state.maps.every(m => m.phase === "COMPLETE") ? "COMPLETE" : "IDLE";
    return null;
  }
  next.status = "ACTIVE";
  state.currentSceneId = next.sceneId;
  return next;
}

function record(state, scene, result, note="") {
  state.audit.push({
    at: new Date().toISOString(),
    sceneId: scene.sceneId,
    phase: scene.phase,
    result,
    note
  });
}

function status(state) {
  const scene = current(state);
  return {
    campaignId: state.campaignId,
    campaignStatus: state.campaignStatus,
    current: scene ? {
      sceneId: scene.sceneId,
      name: scene.name,
      phase: scene.phase,
      status: scene.status,
      attempts: scene.attempts,
      latestResult: scene.latestResult
    } : null,
    completed: state.maps.filter(m => m.phase === "COMPLETE").length,
    total: state.maps.length,
    queued: state.maps.filter(m => m.status === "QUEUED").map(m => m.sceneId)
  };
}

function advance(state, result, note="") {
  const scene = current(state);
  if (!scene) throw new Error("No active scene.");
  const normalized = String(result).toUpperCase();

  if (normalized === "PASS") {
    if (scene.phase === "COMPLETE") throw new Error("Scene is already complete.");
    record(state, scene, "PASS", note);
    scene.latestResult = `${scene.phase}_PASS`;
    scene.phase = PASS_NEXT[scene.phase];
    if (scene.phase === "COMPLETE") {
      scene.status = "COMPLETE";
      activateNext(state);
    }
    return;
  }

  if (normalized === "REDO") {
    if (scene.phase !== "INSPECT") throw new Error("REDO is valid only from INSPECT.");
    record(state, scene, "REDO", note);
    scene.latestResult = "INSPECT_REDO";
    scene.phase = "RENDER";
    scene.attempts.render += 1;
    return;
  }

  if (normalized === "BLOCKED") {
    record(state, scene, "BLOCKED", note);
    scene.latestResult = `${scene.phase}_BLOCKED`;
    scene.status = "BLOCKED";
    state.campaignStatus = "BLOCKED";
    return;
  }

  if (normalized === "UNKNOWN") {
    if (scene.phase !== "IMPLEMENT") throw new Error("UNKNOWN is reserved for live IMPLEMENT outcome ambiguity.");
    record(state, scene, "UNKNOWN", note);
    scene.latestResult = "IMPLEMENT_UNKNOWN";
    scene.status = "UNKNOWN";
    state.campaignStatus = "BLOCKED";
    return;
  }

  throw new Error("Result must be PASS, REDO, BLOCKED, or UNKNOWN.");
}

function resume(state, sceneId) {
  const scene = state.maps.find(m => m.sceneId === sceneId);
  if (!scene) throw new Error(`Unknown sceneId ${sceneId}`);
  if (!["BLOCKED","UNKNOWN","QUEUED"].includes(scene.status)) throw new Error("Scene is not resumable from its current status.");
  for (const m of state.maps) if (m.status === "ACTIVE") m.status = "QUEUED";
  scene.status = "ACTIVE";
  state.currentSceneId = scene.sceneId;
  state.campaignStatus = "ACTIVE";
  record(state, scene, "RESUME", "Explicit controller resume.");
}

const [command="status", arg1, ...rest] = process.argv.slice(2);
const state = load();

switch (command) {
  case "status":
  case "next":
    console.log(JSON.stringify(status(state), null, 2));
    break;
  case "advance":
    if (!arg1) throw new Error("Usage: lodge-campaign-controller.mjs advance <PASS|REDO|BLOCKED|UNKNOWN> [note]");
    advance(state, arg1, rest.join(" "));
    save(state);
    console.log(JSON.stringify(status(state), null, 2));
    break;
  case "resume":
    if (!arg1) throw new Error("Usage: lodge-campaign-controller.mjs resume <sceneId>");
    resume(state, arg1);
    save(state);
    console.log(JSON.stringify(status(state), null, 2));
    break;
  case "validate":
    console.log(JSON.stringify({status:"PASS", maps:state.maps.length, currentSceneId:state.currentSceneId}, null, 2));
    break;
  default:
    throw new Error(`Unknown command: ${command}`);
}
