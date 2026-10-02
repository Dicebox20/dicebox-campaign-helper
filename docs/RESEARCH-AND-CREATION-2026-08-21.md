# Research and Creation Pass — 2026-08-21

## Scope

This pass reviewed the DiceBox project charter, the authoritative implementation contracts, the SQLite knowledge base, the existing M0 checkout, and the official Foundry VTT v14 and D&D5e sources needed to begin the program/module combination safely.

The creation boundary remains narrow: a runtime profile, capability registry, and read-only Foundry diagnostics surface. The installed diagnostics namespace now exposes named `runtime-evidence`, `managed-journal-snapshot`, and `journal-api-evidence` queries containing the profile, deterministic fingerprint, no-write probe receipt, redacted active-GM observation, owned JournalEntry semantic/plan IDs plus hashed bindings/page counts, and API/page-constant presence. No world Document mutation, protected player write, generated executable code, raw patch API, socket, or execute-as-GM surface is introduced.

All future runtime implementation plans are reconciled against [FOUNDRY-API-BINDING-MATRIX-2026-08-21.md](FOUNDRY-API-BINDING-MATRIX-2026-08-21.md), which maps DiceBox stages to official Foundry v14 APIs and records the exact-target evidence required before capability promotion.

## Verified creation sequence

1. Preserve the contract and provenance spine. The local KB remains reproducible from `database/schema.sql` and `database/seed.sql`; external facts retain source locations and capture dates.
2. Define the Foundry package boundary. A module is a directory containing a root `module.json`; its `id` must match the directory name. The manifest declares version, compatibility, relationships, and ES module entrypoints.
3. Keep release metadata distinct from a local development package. A published/updateable package needs a manifest URL and a downloadable archive whose version matches the manifest. The current package is intentionally a local pre-release and does not claim install/update evidence.
4. Load only a self-contained ES module. Foundry's documented lifecycle is `init`, `setup`, then `ready`; the first runtime observation is scheduled at `ready`, after world data is available.
5. Record a serializable runtime profile. Read only the Foundry version, system identity/version, active module IDs, document registry/collections, and capability surfaces. Unknown and foreign state is preserved rather than normalized away.
6. Use capability states conservatively. API existence can support `available` for a read-only surface, but it does not prove behavior. Active-GM election, D&D5e Activity hook behavior, and any optional module behavior stay `unknown` until an exact-stack fixture exercises them.
7. Expose a read-only semantic bridge. `describe`, `supports`, `query`, and `health` are safe; `execute` and binding resolution remain unavailable until the M0/M1/M2 gates and exact runtime evidence permit a later slice.
8. Only after the runtime gate, design document transactions. Foundry `modifyBatch` is appropriate for independent operations where all-or-nothing semantics fit; dependent IDs require staged, journaled, idempotent operations with reread/recovery. This pass does not implement either write path.
9. Only after the runtime and authority gates, add the first managed document operation. It must preview, recheck authority/current state, validate identity/ownership, execute through an exact adapter, read back, verify postconditions, and emit a receipt. This is M3 work.

## Source-backed decisions

| Area | Decision | Evidence boundary |
|---|---|---|
| Package | Keep `dicebox-campaign-helper` as the package ID and root directory ID. | Official module-development guidance; static manifest test. |
| Lifecycle | Schedule the first profile at `ready`; do not read world collections during module import. | Official v14 hook lifecycle documentation; module test with a fake hook surface. |
| Runtime | Treat `game.version`, `game.system`, module collections, document collections, and user election APIs as observations, not authority. | Official v14 API references; exact 14.367 live probe still open. |
| D&D5e | Keep Activities first in the future compiler, but leave Activity hooks `unknown` until exercised on D&D5e 5.3.3. | Official D&D5e Activities and Hooks pages; no live fixture yet. |
| Writes | Keep `foundry.document.write` unavailable in the runtime-probe slice. | Contract and transaction research; no world mutation evidence. |

## Reconciliations

- The earlier M0 description called the Foundry bootstrap “no-op.” That remains true for world state, but the package now performs a read-only runtime probe and publishes a diagnostics API at `ready`. The M0 contract remains intact because mutation is still disabled and no Document/settings/socket APIs are called.
- Official API pages are v14 documentation crawled from 14.365 while the project target is 14.367. This is source guidance, not target-build certification; the exact 14.367 runtime probe remains an open item.
- D&D5e documentation is current to the 5.3.x line, while the project target is 5.3.3. Activity capability is therefore recorded as observed/unknown according to the runtime registry, never inferred solely from documentation.

## Evidence produced by this pass

- Static TypeScript check and Vitest: 11 tests passed.
- Runtime-probe fixture: foundry/system identity, module IDs, document types, Activity registry, and unknown Activity-hook status are captured without writes.
- SQLite integrity and FTS verification: passed; 40 research subjects remain present.
- No live Foundry, clean-world install, two-client authority, document mutation, or Ready-to-Play claim.

## Next continuation point

Run the exact Foundry 14.367 / D&D5e 5.3.3 disposable-world probe and capture a runtime fingerprint plus probe receipt. Then resolve the active-GM sender semantics and Activity hook behavior before promoting any write or automation capability.

## Primary references

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/api/v14/modules/foundry.documents.html
- https://foundryvtt.com/api/v14/functions/foundry.documents.modifyBatch.html
- https://foundryvtt.com/api/v14/modules/hookEvents.html
- https://foundryvtt.com/api/classes/foundry.documents.User.html
- https://github.com/foundryvtt/dnd5e/wiki/Activities
- https://github.com/foundryvtt/dnd5e/wiki/Hooks
