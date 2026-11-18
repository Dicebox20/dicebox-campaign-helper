# DCH — Disposable Foundry 14.367 AI-first encounter acceptance matrix

**Execution status: PROPOSED TEST PLAN / NOT RUN.** This is a local fixture acceptance plan for the owner-approved conversation-first DCH application, not a new product roadmap and not a substitute for the existing M0 criteria. The governing roadmap is `docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md`. M0 remains **NOT_ACCEPTED 0/8**.

## Exact isolated test environment

- **Target:** Foundry VTT **14.367**, game system **dnd5e 5.3.3**; helper-owned world **dbx-test-world**, provisioned in a separate new data directory. Do not use the owner's active worlds or update the installed modules.
- Pin immutable artifacts: source commit SHA, Foundry version/build, module manifest and served-byte hash, game-system version, authored blueprint revision/SHA, approved image assets' SHA, and approved project/scene identifier.
- Confirm the actual elected GM is connected with the same exact world and one active writer; absence of a current elected GM must block. Non-GM and foreign-world tests must not write. Synthetic authorization callbacks or owner metadata alone are insufficient.
- Record the actual current saved campaign ID/revision from DCH's canonical store and the selected ChatGPT account/tool catalog. A test-only fixture assertion is not model-origin authentication.

## Candidate source coverage vs actual acceptance

| Domain | Current source-only candidate | Acceptance action |
|---|---|---|
| Typed blueprint | Source-only v14 converter; no image-to-geometry inference | Host verifies canonical saved source, digest, revision, permission and creator provenance |
| Scene | Creates a fixture Scene if external gates return true | Real Foundry 14.367 creates and authoritatively rereads one owned Scene |
| Level and artwork | **Missing** in candidate | Add approved Scene Level with explicit elevation and hash-attested background; verify pixel alignment to semantic coordinate model |
| Walls and door | Pure geometry with overlap guard; closed door state | Compare real wall coordinates, collision, sight, light, door interactions on player token |
| AmbientLight | One or more typed light documents | Validate v14.367 model, compare light radius/color, wall restrictions and player visibility |
| Region | Polygon without behaviors | Verify region geometry in the correct Level, add actual reviewed RegionBehavior to key/door puzzle |
| Actor and Item | **Missing** | Instantiate game-system-valid Actor, Token and Old Iron Key Item through authorized tools; reread ownership and links |
| ChatGPT command loop | Outside B candidate; previous Foreman's native A patch reported local | Test selected ChatGPT account → typed plan → authenticated receipt → approval/authorization → exact revision guard |
| Gameplay and player view | **No live proof** | Capture real GM and player-client observation, not a local illustration/desktop preview |

## Ordered go/no-go tests

1. **Preflight / no writes:** verify separate fixture data path and static hashes; proof of elected GM, selected world, system and current native tool catalog; guard must reject foreign world, GM race, unsigned/changed blueprint, revoked approval, unknown tools.
2. **Plan and validate:** one ordinary-language user request generates a typed plan for a haunted study with a keyed door. Validate authored Scene/Level/Wall/Light/Region/Actor/Item candidates via exact-version DataModels and save the reviewable no-write result before applying.
3. **Approved, isolated install:** one explicit authorized mutation with a stable idempotency key. Record every returned Foundry document ID and an authoritative reread. Compare authored Wall geometry and door semantics, light config, Region polygon/behaviors, Actor/Item links and asset bytes.
4. **GM/player split:** actual player client with owned token sees expected artwork and light; cannot move through a closed wall/door; GM can inspect and interact. Test the door's no-key rejection and key-present unlock (two branches) from the same saved world.
5. **Failure injection:** stale revision after planning, GM rotation after approval, duplicate/foreign semantic ID, incorrect light/Region normalization, missing item/asset, callback timeout after a committed write. Report unknown write outcomes with recovery required; never fabricate success or delete foreign documents.
6. **Reversal and continuity:** save a recovery snapshot/inverse plan, prove owner-only undo of DCH-created fixture documents, verify foreign documents unchanged, and test a second conversational edit to the same saved project with revision increment and persistent history.
7. **Evidence package:** source and binary hashes, model identity and tool receipts, exact selected project/world/build versions, Foundry Document IDs, before/after snapshots, player-view screenshot and two puzzle branch results. All claims must refer to dated reproducible evidence.

## Explicit version delta

Official Foundry releases: [14.367](https://foundryvtt.com/releases/14.367), [14.368](https://foundryvtt.com/releases/14.368), [14.369](https://foundryvtt.com/releases/14.369), [14.370](https://foundryvtt.com/releases/14.370). Later fixes involve Level elevation defaults, Region resizing, wall-bearing Scene import/rendering and light-rendering behavior; 14.370 also carries recommended security updates. Consequently a 14.370 docs screenshot or synthetic 14.367 fixture cannot establish what real 14.367 players see. Coordinate a separate backed-up upgrade lane after the exact 14.367 test.

## Blockers and boundaries

- Foreman's canonical Windows writer is currently inaccessible through Bridge PowerShell because another relay writer owns the data directory. Do not bypass or overwrite the owner process; reconcile exact checkout before merging or installing the source-only branch.
- Direct ChatGPT-origin native send rejected with `native_caller_context_unverified`, `nativeSendAttempted:false`; staged Switchboard handoffs are not live transcript delivery.
- Existing Worker A/B follow-on review tasks remain staged, not independently verified as delivered. No duplicate assignments.
- The source-only semantic candidate is not registered in the installed module, and the standalone callbacks are not trusted identity/provenance mechanisms. No release, real-world install, selected-model call or player-view evidence was produced during this Turn06.

**Next implementation slice:** one authorized writer reconciles current Windows source and the separate feature branch, validates full source hashes, then implements approved Level/artwork and a real bounded disposable runtime test. A and B can review nonoverlapping native tool and Foundry contracts in parallel once Switchboard transcript deliveries are actually proven.
