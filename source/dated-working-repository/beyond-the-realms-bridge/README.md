# Beyond the Realms — Codex Bridge

This directory is the local, file-backed bridge between the ChatGPT project
**Beyond the Realms** and a Codex workspace.

It is deliberately separate from the parent DiceBox Campaign Helper product
implementation. It carries durable instructions, compact knowledge, source
handoffs, and evidence labels so a Codex session can resume BTR work without
depending on ChatGPT conversation memory.

## Scope

This bridge is local and manual-file-backed. It does not connect to ChatGPT's
private project memory, grant Foundry authority, execute macros, publish to a
remote repository, or replace the parent repository's governing contract.

Open this directory as its own Codex project when working on Beyond the Realms.
Codex should load `AGENTS.md`, then follow the progressive-disclosure links in
`knowledge/` and `reference/`.

## Current package contents

- `AGENTS.md` — imported BTR repository guidance supplied by the user.
- `BRIDGE_MANIFEST.json` — identity, provenance, scope, and artifact inventory.
- `knowledge/` — compact current state, workflow, status model, runtime claims,
  failures, and canonical-source availability.
- `reference/` — the supplied NPC and Prototype 5 handoffs.
- `assets/` — the approved Prototype 5 player map from the supplied bundle.
- `scripts/verify_bridge.py` — deterministic, read-only integrity check.

## Verification

From this directory, run:

```text
python scripts/verify_bridge.py
```

The verifier checks the manifest, required bridge files, reference hashes, and
the approved PNG signature/dimensions/hash. It does not contact ChatGPT,
Foundry, GitHub, or any other external service.

## Evidence boundary

The runtime results in this package are claims preserved from the supplied BTR
handoffs. They are not a fresh runtime observation by this Codex workspace.
They retain the source handoff's labels and are explicitly marked with their
provenance in `knowledge/RUNTIME_RESULTS.md`.

The source handoffs identify additional canonical BTR files that were not
included in the supplied package. They are listed as unavailable in
`knowledge/CANONICAL_SOURCES.md`; this bridge does not invent replacements.
