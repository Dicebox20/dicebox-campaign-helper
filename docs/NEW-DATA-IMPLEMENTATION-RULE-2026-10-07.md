# Dicebox Campaign Helper New Data Implementation Rule — 2026-10-07

**Status:** Hard project rule

## Core rule

**Catalogue before implementation; validate after implementation; preserve chronology always.**

Every consequential new datum follows:

`CAPTURE → CLASSIFY → RECONCILE → CATALOGUE → VALIDATE INPUT → IMPLEMENT → REREAD/TEST → RECEIPT → CLOSE OR CARRY FORWARD`

### CAPTURE
Record exactly what was learned, requested, accepted, generated, observed, or changed; provenance; original event time; capture time if later; and source/artifact identity. Do not silently generalize the source.

### CLASSIFY
Assign subsystem/domain, primary data class, scope (global/project/campaign/historical), evidence class, lifecycle status, and stable ID. Ambiguity is recorded as ambiguity.

### RECONCILE
Query existing authority. Determine whether the datum confirms, extends, conflicts with, supersedes, or is merely evidence for existing records. Campaign-specific results must not silently become global rules. A conflict blocks implementation until resolved.

### CATALOGUE
Accepted implementation-relevant data is written durably before implementation when practical. Use the reproducible KB for sources, facts, decisions, open items, trials, tools, milestones, and relationships. Prefer a dated `database/seed.d/YYYY-MM-DD-<subject>.sql` delta for narrow additions. Update a canonical human-readable document when a workflow, architecture, campaign state, or operating rule changes.

### VALIDATE INPUT
Rebuild/verify the KB after KB changes. Validate referenced IDs, hashes, versions, paths, schemas, target bindings, authority/evidence layer, and recovery plan. Failure means BLOCKED/FAILED, not silent continuation.

### IMPLEMENT
Make the narrowest change authorized by the catalogue record. Do not bundle unrelated accepted changes merely for convenience.

### REREAD / TEST
Observe through the authoritative surface: tests, validators, app reread, Foundry reread, exact runtime inspection, hash comparison, visual semantic inspection, or campaign-state audit. Transport success, generated files, and model responses are not sufficient proof alone.

### RECEIPT
Record exact changes, files/artifacts/IDs, validation, evidence layer, warnings/unknowns, recovery state, implementation time, and authorizing catalogue record.

### CLOSE OR CARRY FORWARD
Close only when acceptance evidence is satisfied. Otherwise preserve blocker, exact next action, missing evidence, owner, and relationship to prior records.

## Naming and chronology

Prefer stable IDs `S-`, `F-`, `D-`, `O-`, `TR-`, `T-`, and `R-` followed by `YYYY-MM-DD-<SUBJECT>`. Same-day duplicates receive a sequence or semantic suffix rather than overwrite.

Use the event date for historical facts and a separate import/capture timestamp. Failed attempts that explain corrections remain in history. A resumed session queries current state/open items instead of inferring state from filename order.

## Scope firewall

Campaign facts do not automatically become product rules. A successful runtime experiment is evidence until a decision promotes it. Foundry runtime IDs are bindings, not semantic identity.

## Scene/map-specific chain

Scene creation records:

`intent/spec → grayscale 3D structural render → grayscale semantic inspection → feature manifest → correction → painterly live render → painted semantic inspection → approved art identity → Foundry build plan → apply/inject → authoritative verify receipt`

The feature manifest classifies walls, terrain/vision walls, doors/gates, windows/grates/railings, movement blockers, vision blockers, water/terrain, elevation/stairs/pits/bridges, lights, sounds, hazards, interactables, transitions, overhead structures, regions/triggers, and uncertain features. Until the dedicated schema exists, each consequential entry also records a stable provisional feature ID, source structural-render identity, semantic class, geometry primitive/coordinates, separate movement/vision/sound/light intent when relevant, baked-versus-stateful ownership, candidate Foundry projection type, relationships, and confidence/uncertainty.

Coloring may enrich materials but may not erase semantics established by the approved structural pass.

## Hard stops

Stop rather than implement when authority conflicts remain unresolved, consequential provenance is missing, identity/runtime bindings cannot be verified, campaign behavior would be silently promoted globally, an output is being mistaken for authority, a prior operation is outcome-unknown, or the reproducible KB fails rebuild/verification.

A consequential change is not complete until future work can recover: **when + what + source + scope + status + why + related IDs/artifacts + validation + result + next action**. Record `unknown` explicitly where needed.
