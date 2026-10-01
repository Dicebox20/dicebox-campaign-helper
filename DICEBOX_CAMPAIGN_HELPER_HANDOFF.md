# DICEBOX CAMPAIGN HELPER HANDOFF

**Migration date:** 2026-10-01  
**Canonical successor:** **Dicebox Injector**  
**Archive repository:** Dicebox20/dicebox-campaign-helper  
**Archive branches:** main = migration snapshot; historical-working-main = original committed Campaign Helper history.

> Dicebox Injector is the canonical successor. Campaign Helper material is preserved as source and provenance. It must not overwrite newer Dicebox Injector policy, schemas, architecture, safety rules, or implementation decisions. Conflicts are reconciliation items, and successor standards take precedence unless Dicebox Injector explicitly adopts an older rule.

## 1. Project overview

DiceBox Campaign Helper was a local-first campaign-authoring and Foundry VTT integration program. It accumulated a semantic campaign compiler, local SQLite knowledge/state control plane, typed scene and geometry models, a Foundry bridge/module, a desktop authoring shell, Regionwright integration, asset and map pipelines, certification fixtures, Codex/ChatGPT orchestration rules, campaign content, and runtime evidence.

Two source trees are preserved because they have different historical authority:
- source/foundation-authority: copied from C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper. Its AGENTS.md identifies this foundation as the historical governing contract.
- source/dated-working-repository: copied from C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper. It contains materially newer implementation state, including October 1, 2026 control files and a much newer knowledge base.

Do not silently choose one over the other. Dicebox Injector should reconcile foundation authority against working-tree freshness.

## 2. Complete file inventory

The machine-readable inventory is metadata/MIGRATION_FILE_INVENTORY.csv. It records 12,587 transferred source files totaling 1,125,443,290 bytes, with source group, relative path, size, modified time, classification, archive path, SHA-256, and relationship/note.

Integrity and structured indexes:
- metadata/MIGRATION_SHA256SUMS.txt
- metadata/PACKAGE_SUMMARY.json
- metadata/WORKING_TREE_STATUS.txt
- metadata/RECENT_GIT_LOG.txt
- metadata/KB_SOURCES.csv: 2,092 knowledge-base sources
- metadata/CAMPAIGN_FACTS.csv: 67 campaign-scoped facts
- metadata/CAMPAIGN_DECISIONS.csv: 52 campaign-scoped decisions
- metadata/OPEN_ITEMS.csv: 108 non-closed KB items

The current ChatGPT Project surface exposed no ordinary attached-upload objects as separate exportable files during this migration. The repository/foundation trees and indexed project knowledge were therefore treated as the recoverable project source.

## 3. Classification and transferred-file meanings

**SOURCE FILE — TRANSFER REQUIRED:** original source code, databases, schemas, structured data, docs, campaign assets, maps, scripts, macros, tests, evidence receipts, or other unique material. These are preserved in source/.

**IMPORTANT KNOWLEDGE — INCLUDE IN HANDOFF:** knowledge that must survive even when no single file is authoritative. It is captured in this manifest, CAMPAIGN_KNOWLEDGE_TRANSFER.md, CAMPAIGN_HELPER_WORKFLOWS.md, and the structured KB exports.

**OBSOLETE / SUPERSEDED:** historical versions or rebuildable/generated material. Historical source is retained where useful; nested dependency/build caches were not treated as canonical source.

**DUPLICATE:** byte/role duplicates and zero-byte database placeholders. In particular dicebox.db, dicebox_campaign_helper.db, dicebox_campaign_helper.sqlite, dicebox_kb.sqlite, and knowledge.db are zero-byte placeholders and are not usable databases.

**UNRESOLVED / NEEDS PRESERVATION:** workspaces, receipts, fixtures, or open-state material whose future value is unresolved. Preserve until Dicebox Injector explicitly reconciles or retires it.

## 4. Canonical and superseded relationships

- Dicebox Injector supersedes the entire Campaign Helper project.
- source/foundation-authority/AGENTS.md is the historical foundation contract.
- source/dated-working-repository/docs/ACTIVE-PROGRAM-SLICE.json is the freshest preserved active control card, updated 2026-10-01. It keeps Stage 12 active and readyClaim:false.
- The current working database is source/dated-working-repository/database/dicebox_campaign_helper_knowledge.sqlite. It is materially newer than the smaller foundation database. Preserve both.
- Reproducibility sources are database/schema.sql, database/seed.sql, queries.sql, build_database.py, and verify_database.py.
- Historical database snapshots named pre-20260826 and pre-20260828 are retained as provenance.
- Campaign Helper Map Lab replaced the Tram Rush Hour fixture as the later active helper testing path, but Tram source/assets/receipts remain preserved historical campaign material.
- BTR NPC Injector Engine 1.0 is a carried runtime-confirmed baseline; Injector 2.0 / Tharvek Alpha 1 remained pending runtime test.
- BTR Scene Injector Prototype 3 and 4.6B/4.6C are carried runtime-confirmed history; Prototype 5 remained package-ready/experimental and not fully promoted.
- The Iggwilv Final Chamber comparison is a legacy fixture with known verifier-hash drift, not current product architecture or geometry authority.

## 5. High-value source material

Important source paths include:
- source/foundation-authority/AGENTS.md, STATUS.md, PRODUCT_RESEARCH.md, BUYER_VALIDATION.md, docs/STARTUP-TECHNICAL-ROADMAP.md
- source/dated-working-repository/AGENTS.md, PROJECT_CHARTER.md, STATUS.md
- source/dated-working-repository/docs/ACTIVE-PROGRAM-SLICE.json
- source/dated-working-repository/docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md
- source/dated-working-repository/docs/CAMPAIGN-HELPER-ARCHITECTURE-DECISION-REPORT-2026-08-23.md
- source/dated-working-repository/docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md
- source/dated-working-repository/docs/PROJECT-MISSION-AND-ORCHESTRATION.md
- source/dated-working-repository/docs/CODEX-WORKFLOW-RULES-2026-08-22.md
- source/dated-working-repository/docs/UNIVERSAL-BATTLEMAP-IMPORT-INSTRUCTIONS.md
- source/dated-working-repository/docs/CURRENT-CAMPAIGN-TEST-2026-08-21.md
- source/dated-working-repository/assets/maps and assets/tiles
- source/dated-working-repository/outputs for non-recoverable evidence and conversion artifacts
- source/dated-working-repository/beyond-the-realms-bridge for NPC/Scene Injector source handoffs
- source/dated-working-repository/apps, packages, tools, tests, and work for product source and fixture evidence

## 6. Campaign knowledge not contained safely in filenames

See CAMPAIGN_KNOWLEDGE_TRANSFER.md and the exact database-derived CSVs. The strongest continuity contributed by this project concerns The Ballad of Chauser Bill, the Ascendancy package, Tram/Core topology, Signal/Rune/Core Region and puzzle mechanics, reset/recovery rules, Regionwright bindings, Beyond the Realms Injector history, and evidence status.

Campaign Helper does not provide one trustworthy consolidated current-session ledger for party location, full active quest list, faction state, GM secret state, or story-branch selection. Newer Dicebox Injector campaign data must take precedence for those narrative fields.

## 7. Important technical knowledge

- Stable DiceBox IDs are canonical; Foundry IDs, UUIDs, names, and paths are runtime bindings.
- Spatial Blueprint / semantic scene geometry is authoritative; screenshots, pixels, rendered canvases, and AI images are not geometry authority.
- Background Objects mean fixed visible environmental/puzzle apparatus after the renderer. A native Foundry Tile/TileDocument is reserved for an object needing independent runtime position, visibility, movement, or state.
- Historical core loop: understand -> consult -> reconcile -> plan -> validate -> preview -> approve -> execute -> reread -> recover -> record.
- Model/player/tool output is intent, not authority.
- Foundry writes require exact target/runtime identity, current active-GM authority, preview/approval, owned-only scope, authoritative reread, and a receipt.
- UNKNOWN is not success and must not be blindly retried.
- Preserve unrelated, foreign, and runtime-owned state. Do not use raw LevelDB as the normal mutation path.
- Player-role passwords remain blank.
- Historical desktop decision: Tauri 2 + React/TypeScript + PixiJS v8, renderer-neutral SceneDocument, typed SceneCommand, Rust authoritative committed geometry, provider-neutral image boundary, deterministic application executor.

## 8. Foundry / Injector integration knowledge

Historical exact stack: Foundry VTT 14.367 + D&D5e 5.3.3.

Historical authorized campaign target: world the-ballad-of-chauser-bill. Disposable exact-fixture lane: dbx-test-world.

Scene/Map Injector order preserved by the BTR bridge:
encounter purpose -> topology -> normalized MapSpec geometry -> structural validation -> artwork from same geometry -> injector-owned asset deployment/verification -> create/reconcile Scene -> reuse/configure default Level -> bind Walls and Regions -> dry-run writes -> persist -> validate -> READY.

NPC Injector order:
NPC concept -> constrained NPC Manifest -> art-only token phase -> balance review -> runtime preflight -> compendium resolution -> image resolution -> Actor core -> cloned Items -> supported custom mechanics -> native Activities/effects -> reread -> diagnostics.

Dicebox Injector must reconcile these as historical source procedures. Campaign Helper's Injector architecture does not supersede the successor.

## 9. GitHub / Regionwright / Codex information

Archive repository: Dicebox20/dicebox-campaign-helper.
- main contains this migration snapshot, including dirty working-tree state.
- historical-working-main preserves the original committed local Campaign Helper Git history.

Related repositories referenced by the project include Dicebox20/regionwright and Dicebox20/chatgpt-codex-project-bridge. Warhammer conversion/reskin work is maintained in separate repositories including Dicebox20/warhammer-dnd-reskin, warhammer-actor-catalogue, warhammer-dnd-reskin-dist, and warhammer-dnd-character-guide. Those separate repositories were not duplicated into this archive.

Regionwright is the specialized Region/puzzle/teleport companion. Preserve helper-plan/Spatial Blueprint authority, stable IDs, confirmation-aware teleport boundaries, reset safety, and target-bound reread requirements.

Codex historically used one integrating Foreman with bounded disjoint Workers. Workers do not create independent authority or auto-promote changes. Isolated worktrees are collision-control tools only. The private chatgpt-codex-project-bridge is a communication/evidence mirror, not project or Foundry authority.

## 10. Important workflows and procedures

See CAMPAIGN_HELPER_WORKFLOWS.md for reusable procedures covering campaign planning, KB maintenance, Foundry preparation, scene/map planning, encounters, puzzles, image/token generation, Scene/NPC Injector work, Regionwright, Universal Battlemap/UVTT, Codex, GitHub, cross-project handoff, and recovery.

The database-first control rule is especially important historically: consult the KB before specialized work; record accepted decisions/provenance in seed.sql; rebuild and verify the KB; then implement only the bounded accepted slice.

## 11. Unresolved work

metadata/OPEN_ITEMS.csv preserves all 108 non-closed KB items with problem, next action, evidence needed, priority, owner, and source. Important themes include:
- Stage 12/runtime closure and the October 1 ChatGPT-workspace sequencing revision
- exact fixture/browser/runtime validation
- Regionwright confirmation/result-path repair and player-side validation
- dependency-aware full-reset/runtime evidence
- manual Scene/Region/Background Object/Tile handoff gates
- UVTT candidate import/reconciliation
- playable Ascendancy Tram Depot Scene delivery
- native fixture Tram access adapter
- BTR missing canonical-source retrieval
- BTR Prototype 5 runtime reconciliation
- BTR Injector 2.0 / Tharvek runtime testing

These are preserved obligations/questions, not automatically inherited priorities. Dicebox Injector should reconcile them against its current roadmap.

## 12. Known problems and failed approaches worth remembering

- Static tests, successful imports, API existence, browser/tab discovery, and transport success do not prove committed Foundry state or gameplay certification.
- Browser/tab identity did not always prove readable runtime/canvas state.
- Large Base64 artwork made an approximately 800 KB BTR macro fail to start visibly while roughly 97–100 KB worked.
- JSON import was a failed primary NPC Injector detour.
- Arbitrary custom flag scopes were rejected in standalone injector content.
- Old image paths returned 404; image bytes/path/retrievability must be verified before Actor/Scene mutation.
- Same-Region TOKEN_ENTER re-entrancy caused alternating success / SEQUENCE BROKEN behavior; Prototype 4.6C fixed this by making solved Regions inert and preventing same-event re-entry.
- Display-name-only managed Item identity is experimental and unsafe for production identity.
- Partial Ascendancy reset leaves derived progression inconsistent.
- Prototype 5 art-first alignment is a one-time approved exception, not precedent for replacing MapSpec-first planning.

## 13. Recommended integration points with Dicebox Injector

1. Import the full KB and CSV exports as historical/provenance data, not as newer policy.
2. Reconcile Ballad/Ascendancy campaign content, Regionwright contracts, maps, tiles, UVTT candidates, and BTR Injector handoffs into successor schemas.
3. Reuse stable-ID, owned-only mutation, exact-runtime, preview/approval, authoritative-reread, UNKNOWN/no-retry, and receipt concepts where compatible.
4. Map Campaign Helper SceneDocument / Spatial Blueprint / Background Object / Tile concepts into current Dicebox Injector models instead of copying old schema authority wholesale.
5. Preserve historical fixtures and receipts as regression evidence, but require fresh successor-version certification before claiming current compatibility.
6. Treat October 1 ChatGPT-workspace research as historical UX/architecture input only.
7. Keep foundation-authority and dated-working-repository as separate provenance planes until reconciliation is complete.

## 14. Terminology / glossary

- **Ballad:** The Ballad of Chauser Bill; historical authorized campaign/live compatibility target.
- **Ascendancy:** Principal campaign package and scene/puzzle route used in Campaign Helper integration work.
- **Spatial Blueprint:** Typed spatial/semantic geometry authority.
- **SceneDocument:** Renderer-neutral persisted semantic scene model in the historical desktop architecture.
- **SceneCommand:** Typed edit boundary shared by human and AI producers.
- **Background Object:** Fixed visible environment/puzzle apparatus after the renderer.
- **Foundry Tile:** Native stateful/movable/independently positioned TileDocument.
- **Regionwright:** Companion project for Foundry Regions, puzzles, traps, teleports, and scenario setup.
- **MapSpec:** Normalized geometry contract used by the BTR Scene Injector workflow.
- **READY / Ready-to-Play:** Post-install evidence state; never implied by static tests.
- **Foreman:** Single integrating project authority.
- **Worker:** Bounded contributor with no independent promotion authority.
- **UNKNOWN:** Outcome requiring reread/recovery rather than success assumption or blind retry.
- **dbx-test-world:** Disposable exact-stack Foundry fixture world.
- **Map Lab:** Later Campaign Helper-owned deterministic map/Blueprint test path that replaced Tram as the active helper testing lane.

## 15. Anything that could be lost if Campaign Helper were archived

- October 1 dirty working-tree state and current active card.
- Full SQLite KB, seed, source provenance, decisions, trials, relationships, tools, and open work.
- Historical pre-rebuild database snapshots.
- Hundreds of runtime/evidence receipts, overlays, UVTT bundles, calibration artifacts, and campaign-package outputs.
- Ascendancy maps, tile SVGs, calibration assets, and package bindings.
- Exact Foundry fixture worlds and runtime copies used for historical evidence.
- BTR NPC/Scene Injector reconciliation handoffs and approved Prototype 5 map.
- Original committed Git history, now preserved on historical-working-main.
- The important distinction between historical foundation authority and newer working-tree freshness.

Rebuildable dependency/build/cache trees such as node_modules, Rust target outputs, Playwright reports/test-results, Python caches, and trace-target/trusted-read caches are not canonical source. The archive prioritizes source, structured state, runtime evidence, campaign assets, and fixtures. The migration inventory describes the transferred source snapshot; filtered rebuildable trees are category-level exclusions rather than per-file inventory rows.

## 16. Transfer checklist

- [x] Private GitHub archive repository created.
- [x] Original committed Campaign Helper history preserved on historical-working-main.
- [x] Foundation authority tree transferred.
- [x] Newer dated working repository transferred, including dirty files.
- [x] Full current SQLite KB, seed, schema, queries, and DB tooling transferred.
- [x] Campaign maps, tiles, images, Map Lab assets, and BTR approved map transferred.
- [x] BTR NPC and Scene Injector handoffs/runtime lessons transferred.
- [x] Source, packages, desktop app, tools, tests, outputs, and Foundry fixture evidence transferred.
- [x] SHA-256 list and machine-readable inventory generated.
- [x] Campaign facts, campaign decisions, KB sources, and all non-closed items exported to CSV.
- [x] Campaign continuity and reusable workflow documents created.
- [ ] Dicebox Injector must reconcile historical rules against its newer canonical policy.
- [ ] BTR sources explicitly listed as missing in the bridge remain manual retrieval items unless already present elsewhere in Dicebox Injector.
- [ ] No claim is made that historical Foundry evidence remains valid for newer successor versions without fresh verification.
- [ ] Current party location, current quest ledger, faction-state ledger, GM-secret ledger, and selected narrative branch were not recoverable here as one authoritative current record and must come from newer campaign data.

After this handoff is imported/reconciled by Dicebox Injector, Dicebox Campaign Helper can be archived without intentionally losing unique useful material found in the recovered project trees.
