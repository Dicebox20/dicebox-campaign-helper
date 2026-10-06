# DiceBox Automated Scene Workflow — Desktop Commander + PowerShell Relay

**Status:** Accepted hardening overlay for DiceBox Scene Injector work  
**Date:** 2026-10-05  
**Extends:** `PREPARE → RENDER → INSPECT → BUILD`

`INSPECT: PASS` is itself approval. There is no separate approval wait-state after a successful inspection. The durable pipeline is:

`PREPARE → RENDER → INSPECT(PASS = APPROVED | REDO) → BUILD → STAGE → INJECT → VERIFY → RECEIPT`

The legacy `APPROVE` command remains accepted as a redundant explicit acknowledgment of an already-passed render, but it is never required before BUILD.

The purpose is resumability, idempotent retries, and consistent handoff between ChatGPT, Desktop Commander, the PowerShell Relay, Regionwright, and Foundry VTT.

## Authority boundaries

- **ChatGPT / Foreman** owns interpretation of user intent, PREPARE, RENDER orchestration, INSPECT, automatic approval on PASS, BUILD generation, and decision logic.
- **Desktop Commander** owns durable local workspace operations: folders, files, hashes, state reads/writes, validator invocation, and local artifact staging. It is not Foundry authority.
- **PowerShell Relay** owns browser-free, idempotent command execution on the authorized machine and durable execution receipts. Its `requestId` is the retry/idempotency key.
- **Regionwright / Foundry runtime** is the only authority for live Scene, Wall, Region, RegionBehavior, Macro, Actor, Item, and other Foundry document mutation.
- **GitHub repository** owns versioned workflow contracts, schemas, validator source, and reusable implementation rules.
- **Campaign Design Bible** owns campaign-specific scene canon and continuity.

No tool success outside Foundry proves a live Scene is installed. A Foundry-side authoritative reread or Regionwright receipt is required.

## Durable workspace contract

Desktop Commander should maintain a configurable root called `DICEBOX_AUTOMATION_ROOT`. Do not hardcode a machine-specific path into the canonical workflow.

Recommended layout:

```text
<DICEBOX_AUTOMATION_ROOT>/
  scenes/
    <scene-key>/
      state.json
      spec.json
      prompt.current.txt
      renders/
      inspection.json
      build.md
      validator.json
      stage-manifest.json
      receipt.json
      history/
  queue/
    pending/
    processing/
    complete/
    failed/
  receipts/
```

### Scene files

- `state.json`: authoritative automation state for one Scene.
- `spec.json`: normalized PREPARE package and locked continuity IDs.
- `prompt.current.txt`: current render prompt only. Failed prompts are moved to `history/`; REDO never edits them in place.
- `renders/`: immutable render attempts named by attempt number/hash/generation ID.
- `inspection.json`: PASS/REDO result tied to the exact render hash.
- `build.md`: canonical single-Markdown/single-JavaScript BUILD artifact.
- `validator.json`: deterministic BUILD-validator result.
- `stage-manifest.json`: immutable job envelope prepared for live import.
- `receipt.json`: latest Foundry/Regionwright authoritative receipt.
- `history/`: archived prior prompts, inspections, builds, and receipts.

## State machine

Canonical automation states:

```text
PREPARED
RENDERED
INSPECTED_REDO
APPROVED
BUILT
STAGED
INJECTED
VERIFIED
COMPLETE
BLOCKED
FAILED
```

Allowed forward transitions:

- `PREPARED → RENDERED`
- `RENDERED → APPROVED | INSPECTED_REDO`
- `INSPECT: PASS` performs the `RENDERED → APPROVED` transition atomically and records both inspection evidence and approval evidence for the exact render.
- `INSPECTED_REDO → RENDERED` using a completely fresh prompt
- `APPROVED → BUILT`
- `BUILT → STAGED`
- `STAGED → INJECTED`
- `INJECTED → VERIFIED`
- `VERIFIED → COMPLETE`

`BLOCKED` and `FAILED` may be entered from any operational state with a recorded reason. Recovery returns to the last proven state, never to a guessed state.

## Gate invariants

### PREPARE
Must lock:
- Scene key and stable Foundry Scene ID;
- stable arrival Region ID when applicable;
- route topology and destinations;
- reset destination;
- scene scale;
- discoveries and Notice rules;
- art brief;
- acceptance checklist.

### RENDER
Requires `PREPARED` or `INSPECTED_REDO`.

Each attempt gets:
- monotonically increasing render attempt number;
- generation ID when available;
- file hash when local art exists;
- immutable prompt snapshot.

### REDO
Hard rule:
- archive the failed prompt;
- create a fresh prompt from the canonical PREPARE spec;
- never edit, append, negate, or patch the failed prompt;
- do not ask the image model to preserve the failed composition.

### INSPECT
Must bind the verdict to the exact render attempt/hash/generation ID.

`PASS` means acceptance criteria are satisfied or explicitly waived by the user, and **automatically approves that exact render in the same operation**. The durable current state becomes `APPROVED`; do not stop at an `INSPECTED_PASS` wait-state.  
`REDO` invalidates any approval/build derived from that render.

### APPROVE
There is no separate required approval gate after `INSPECT: PASS`. PASS must automatically record:
- exact approved render generation ID and/or SHA-256;
- any explicit user exception already accepted during inspection;
- approval source `INSPECT_PASS`;
- approval timestamp/state transition.

The user may still say `APPROVE` as a redundant explicit acknowledgment, but it must not be required to continue to BUILD. No BUILD is valid without exact approved-art identity.

### BUILD
Must preserve the existing DiceBox contract:
- exactly one Markdown file;
- exactly one self-contained JavaScript injection macro;
- BUILD v2 markers;
- approved art/spec only;
- no `eval`, `new Function`, or raw WebSocket execution;
- canonical validator PASS before STAGE.

### STAGE
Requires:
- state `BUILT`;
- BUILD validator PASS;
- exact BUILD SHA-256;
- approved art SHA-256;
- stable Scene/Region IDs;
- target Foundry world/runtime profile.

The stage job is immutable. If any input changes, create a new job ID.

### INJECT
PowerShell Relay stages or signals the job using a stable idempotency request ID:

`dicebox:<scene-key>:<build-sha-prefix>:inject`

Retries of the same logical request MUST reuse the same `requestId`.

Regionwright/Foundry must:
- require active authorized GM;
- validate exact target IDs/runtime;
- use Foundry document APIs, never raw world-database edits;
- preserve foreign/unknown state;
- write a receipt.

### VERIFY
Verification is authoritative reread, not assumption.

At minimum verify:
- Scene ID/name/background;
- scale profile;
- managed Wall count/IDs;
- Region count/IDs;
- route destinations;
- wrong-route behavior ownership/state;
- discovery count/policy;
- required reset target;
- unresolved forward destination warnings.

### RECEIPT
Receipt must contain:
- job ID;
- build SHA-256;
- Scene ID/UUID;
- runtime version;
- status: `READY`, `READY_WITH_WARNINGS`, `BLOCKED`, or `FAILED`;
- created/updated counts;
- warnings/blockers;
- authoritative reread evidence;
- timestamp.

A transport timeout is **outcome unknown**. Poll/read the receipt before retrying.

## Queue protocol

Jobs move by atomic file rename where possible:

`pending → processing → complete | failed`

Job filenames use immutable IDs:

`<scene-key>-<build-sha-prefix>.json`

If a matching successful receipt already exists for the exact build SHA, do not inject again.

## Chat resumability rule

At the beginning of a resumed Scene task, the Foreman resolves state in this order:

1. current conversation context;
2. durable `state.json` if Desktop Commander is online;
3. latest Regionwright/Foundry receipt;
4. campaign bible continuity;
5. repository workflow contract.

If these disagree, stop and reconcile rather than guessing.

A short command such as `RENDER`, `INSPECT`, or `BUILD` acts on the single current Scene only. Do not silently advance multiple gates.

## Offline behavior

If Desktop Commander or PowerShell Relay is unavailable:
- PREPARE, RENDER, INSPECT (including automatic approval on PASS), and BUILD may continue if their required inputs are present;
- STAGE/INJECT/VERIFY must remain pending;
- do not claim live installation;
- once tools reconnect, reread durable state and receipts before continuing.

## Current Scene recovery rule

For this conversation, the active Scene after this hardening pass is **L2-03 — Leaning Waystone Hollow**.

The last proven creative state before this workflow was introduced:
- PREPARE complete;
- first render failed INSPECT;
- REDO render generated with generation ID `c0f1c0d3-9084-4e59-bac4-bb29f7eaf95d`;
- that REDO render was subsequently INSPECTED and received PASS.
- under the automatic-approval rule, that PASS is the approval event for generation ID `c0f1c0d3-9084-4e59-bac4-bb29f7eaf95d`.

Therefore the current creative state is **APPROVED** and the next valid operation is **BUILD**.
