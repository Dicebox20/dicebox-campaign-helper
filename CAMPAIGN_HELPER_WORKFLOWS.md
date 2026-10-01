# CAMPAIGN HELPER WORKFLOWS

**Migration date:** 2026-10-01  
**Canonical successor:** **Dicebox Injector**

These are reusable historical procedures developed in Dicebox Campaign Helper. They are preserved as migration input. Newer Dicebox Injector policy and architecture take precedence whenever they conflict.

## 1. Universal bounded work loop

Historical governing loop:

understand -> consult -> reconcile -> plan -> validate -> preview -> approve -> execute -> reread -> recover -> record

Rules:
- Query the knowledge base before specialized work.
- Treat AI output and player requests as untrusted intent.
- Never infer mutation authority from a successful response, import, test, or transport.
- Unknown stays unknown.
- Preserve unrelated and foreign state.
- Keep provenance and evidence labels.
- Prefer narrow reversible operations.

## 2. Campaign planning

1. Query current sources, facts, decisions, trials, open items, schemas, and active control card.
2. Identify exact campaign/world/scene targets.
3. Reconcile conflicts before inventing new behavior.
4. Define the player-facing outcome.
5. Define stop/recovery conditions.
6. Prefer established stable IDs and existing routines.
7. Separate established canon from proposed mechanics/content.
8. Record accepted changes before implementation.
9. Keep one active outcome instead of mixing unrelated work.

## 3. Knowledge/database maintenance

Historical database-first sequence:

1. Read database/schema.sql.
2. Query the approved SQLite KB read-only.
3. Inspect applicable sources, facts, decisions, trials, open items, relationships, tools, and milestones.
4. Reuse an existing routine when possible.
5. Record new accepted decisions/provenance in database/seed.sql.
6. Rebuild the database from schema + seed.
7. Run verify_database.py and relevant query checks.
8. Implement only after the control plane reflects the accepted change.
9. Record resulting receipts and update open-item state.

Conversation memory and examples do not silently override the reproducible KB.

## 4. Foundry preparation

Before any mutation:

1. Resolve exact world ID and runtime fingerprint.
2. Confirm Foundry and game-system versions.
3. Confirm current active GM.
4. Confirm owned target identity and completeness.
5. Discover supported APIs/capabilities.
6. Create an exact no-write preview.
7. Require explicit approval for a write.
8. Execute only the allowlisted owned delta.
9. Authoritatively reread affected Foundry Documents.
10. Record success, blocker, or UNKNOWN.
11. If UNKNOWN, reread/recover before any retry.

Do not use raw LevelDB editing as the normal path.

## 5. Scene and map planning

Canonical structure:

encounter purpose -> topology -> normalized geometry / Spatial Blueprint -> structural validation -> renderer from the same geometry -> asset attestation -> Background Objects / Regions / Tiles -> runtime preview -> persist -> authoritative reread

Important distinctions:
- Typed geometry is authoritative, not screenshots or generated pixels.
- Renderer pixels are visual output only.
- Background Objects are fixed visible environmental/puzzle apparatus.
- Native Foundry Tiles are used when an object needs independent position, movement, visibility, or runtime state.
- Preallocate stable IDs before mutation.
- Verify asset bytes, dimensions, SHA-256, upload path, and retrievability before Scene mutation.
- Keep geometry, renderer, and runtime binding provenance connected.

## 6. Encounter construction

1. Define encounter purpose and player-facing problem.
2. Define traversable topology.
3. Allocate stable semantic IDs.
4. Separate fixed environment from runtime-movable/stateful objects.
5. Define success, failure, and recovery conditions.
6. Define Actor/NPC/item dependencies.
7. Prefer native D&D5e and Foundry mechanics where supported.
8. Produce visual assets from the structural plan.
9. Validate deterministic structure before live installation.
10. Require target-bound reread before calling the encounter ready.

## 7. Puzzle construction

For Region/state-machine puzzles:
- Define trigger, state, sequence, success, failure, reset, and recovery explicitly.
- Do not enable another TOKEN_ENTER behavior on the same Region during the current enter event.
- Make solved Regions inert where required.
- Reset all derived owned state together.
- Preserve unrelated and foreign state.
- Do not treat a partial reset as complete.
- Teleport/confirmation behavior requires target-bound validation.
- Keep player-visible feedback separate from hidden implementation details.

## 8. Image and token generation

1. Keep hidden mechanics, schema, stat blocks, and puzzle logic out of art prompts.
2. Supply only the approved visual brief and structural masks/references.
3. Generate candidate pixels through a provider-neutral boundary.
4. Validate format, dimensions, and hash.
5. Review topology and style separately.
6. Upload/deploy exact bytes.
7. Verify retrievability before binding to Foundry Documents.
8. Preserve provider/model/version/prompt/input/output provenance when available.

For VTT tokens, preserve the established project convention when applicable: top-down isolated token art with a transparent background.

Pixels never become geometry authority.

## 9. BTR Scene / Map Injector workflow

Canonical preserved order:

encounter purpose -> topology -> normalized MapSpec geometry -> structural validation -> artwork from the same geometry -> injector-owned asset deployment and verification -> create/reconcile Scene -> reuse/configure Foundry default Level -> bind Walls and Regions -> dry-run writes -> persist -> validate -> READY

Constraints:
- Prototype 5 art-first alignment is a documented one-time exception.
- Reuse Foundry's automatically created default Level where the workflow expects it.
- Explicitly Level-bind Walls and Regions.
- Preallocate stable IDs/object keys and validate uniqueness.
- Verify asset bytes/hash/dimensions/path/retrievability before Scene mutation.
- Dry-run Walls and Region behaviors before persistence.
- Preserve managed-object orphans and deliberate GM edits; do not blindly delete.
- READY is post-install evidence, not a static-test claim.

## 10. BTR NPC Injector workflow

Canonical preserved order:

NPC concept -> constrained NPC Manifest -> art-only token phase -> balance review -> runtime preflight -> compendium resolution -> image resolution -> Actor core -> cloned Items -> supported custom mechanics -> native Activities/effects -> reread -> diagnostics

Rules:
- Resolve required compendium content before Actor mutation.
- Abort cleanly when required content is missing.
- Use configured Documents and supported public APIs.
- Use native D&D5e Activities for ordinary attacks, saves, damage, healing, targeting, consumption, uses, and effects.
- Do not invent deep system schema from memory.
- Avoid arbitrary custom flag scopes.
- Do not use display-name-only cleanup as final production identity semantics.
- Upload and verify image bytes before Actor mutation.

## 11. Regionwright workflow

1. Read the current helper plan / Spatial Blueprint first.
2. Preserve stable IDs and geometry authority.
3. Keep teleport and confirmation semantics explicit.
4. Validate source and tests before staging.
5. Stage only into an exact disposable fixture first.
6. Reread target-bound runtime behavior.
7. Promote only when evidence matches the intended contract.
8. Preserve shared-source and foreign Region state.
9. If an adapter result is not observable, record a blocker rather than assuming success.

## 12. Universal Battlemap / UVTT workflow

Universal Battlemap is a candidate conversion/export lane, not geometry authority.

1. Export from authoritative geometry.
2. Import into a disposable target.
3. Compare converted walls, doors, objects, and coordinates against the source plan.
4. Preview any correction.
5. Reread after import/correction.
6. Promote only when conversion evidence matches.

The preserved candidate bundles and overlays in outputs/ are evidence and reusable artifacts, not automatic canonical geometry.

## 13. Codex workflow

- One Foreman owns the active goal and integration.
- Workers receive bounded disjoint scopes.
- Workers return compact receipts with source state, changed paths, validation, blockers, and recovery disposition.
- Workers do not create competing goals or authority.
- Use isolated worktrees/workspaces when collision risk justifies isolation.
- Preserve unrelated edits.
- Foreman reviews provenance, compatibility, safety, tests, authority, and reproducibility before promotion.
- On the second same-class runtime failure, stop retries, query the KB, reduce the failure to a bounded reproduction, validate a narrow fix, then attempt live work only through a new governed slice.

## 14. GitHub workflow

- Repository state is source control, not runtime authority.
- Preserve dirty changes before migration or handoff.
- Use branches/commits to separate historical state and migration state.
- Record source commit/hash in handoffs.
- Keep external bridge repositories as communication/evidence mirrors only.
- Do not publish secrets, credentials, unrestricted raw logs, hidden reasoning, or private chat exports by default.
- A receiving project must reconcile imported material before acting on it.

For this migration:
- main = complete migration snapshot
- historical-working-main = original Campaign Helper committed history

## 15. Handoff between ChatGPT/Codex conversations and projects

1. Name source project and canonical successor.
2. Transfer actual files and structured data, not only prose summaries.
3. Include roadmap/control card, KB/database, hashes, unresolved items, and receipts.
4. Preserve evidence labels: local, staged, fixture, live, carried-handoff, blocked, provisional.
5. Record source precedence and conflicts.
6. State what is missing or uncertain.
7. Receiving project rereads and reconciles against its own policy before implementation.
8. Handoff never grants Foundry mutation authority by itself.

## 16. Troubleshooting and recovery

- Start with the simplest low-risk explanation.
- Use bounded targeted diagnostics.
- Do not blindly replay unresolved commands.
- Reread current state before retrying an outcome-unknown operation.
- Prefer idempotent/recoverable operations.
- Preserve foreign state.
- Record recovery disposition.
- Static success is not live evidence.
- Browser/tab discovery is not necessarily runtime/canvas readiness.
- A successful transport response is not a committed state receipt.

## 17. Asset-generation / Map Lab lesson

The later Campaign Helper Map Lab is useful as a deterministic regression pattern:
- package-owned generated map asset
- stable IDs
- typed Spatial Blueprint geometry
- renderer-only visual layer
- exact asset hash and byte length
- no raw Foundry state
- no runtime claim from local validation
- accessible overlay/preview in the desktop editor

This pattern may be useful for Dicebox Injector regression fixtures even if the successor has newer schemas, rendering, and UI.

## 18. Procedure precedence in Dicebox Injector

These workflows are historical migration material. The successor should:
1. preserve them,
2. map useful invariants into its own current architecture,
3. explicitly reconcile conflicts,
4. avoid importing old authority boundaries as if they were automatically current,
5. require fresh runtime certification on successor versions.
