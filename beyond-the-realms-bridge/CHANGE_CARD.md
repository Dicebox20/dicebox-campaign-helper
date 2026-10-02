# BTR Bridge Change Card

**Outcome:** create a local file-backed handoff bridge for the Beyond the
Realms ChatGPT project.

**Owner:** Codex Foreman  
**Target:** `beyond-the-realms-bridge/` only  
**Authority:** supplied BTR handoff files plus the parent repository contract  
**Allowed scope:** bridge instructions, compact knowledge, provenance manifest,
supplied handoffs, approved map asset, and read-only integrity verification  
**Excluded scope:** product implementation, Foundry launch/control, world or
Scene mutation, ChatGPT project mutation, remote publication, credentials,
player passwords, and silent source invention

## Acceptance criteria

- The BTR instruction file is available as root `AGENTS.md` in the bridge.
- The bridge identifies the Beyond the Realms ChatGPT project and local target.
- Current state, workflow, evidence labels, failures, and source availability
  are recorded without collapsing runtime and static evidence.
- Supplied handoffs and the approved map are preserved with integrity metadata.
- `python scripts/verify_bridge.py` passes without network or runtime access.

## Recovery / stop condition

If a source hash, expected artifact, or evidence classification does not match,
stop and repair the bridge metadata or obtain the authoritative source before
using it for implementation. Do not retry by weakening the verifier.
