# Dicebox Campaign Helper - Project Unification

Date: 2026-10-01
Status: CANONICAL

## Authority

The canonical project identity is **Dicebox Campaign Helper**.

The former **Dicebox Injector / BTR Injector** work is not a separate peer project. It is a technical subsystem and historical lineage inside Dicebox Campaign Helper.

Where older Injector-era material conflicts with newer Campaign Helper or current Injector-successor material, preserve the older material as evidence/history and reconcile against the newest verified implementation before changing behavior.

## Canonical Scope

Dicebox Campaign Helper now owns:

- campaign planning, lore, continuity, NPCs, factions, quests, encounters, puzzles, locations, and GM knowledge;
- Foundry VTT scene compilation and injection;
- the Dicebox Injector architecture and transport/compression/reassembly techniques;
- Regionwright integration and scene-region workflows;
- map and scene authoring;
- asset, token, handout, audio, and image workflows;
- desktop Campaign Helper application development;
- knowledge database and campaign database maintenance;
- Codex development, handoff, review, and escalation workflows;
- GitHub/repository workflows and documentation;
- Beyond the Realms campaign bridge material;
- reusable Dicebox compiler/core/scene/Foundry packages.

## Current Sources of Truth

1. docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md
2. docs/GPT-DEVELOPMENT-WORKSPACE-ROADMAP-AUDIT-2026-10-01.md
3. PROJECT_CHARTER.md
4. AGENTS.md
5. database/
6. beyond-the-realms-bridge/
7. current source under apps/, packages/, tools/, and tests/
8. verified runtime/closure receipts under outputs/ when a claim depends on them

## Migration Classification

### Canonical knowledge
- campaign database and BTR bridge;
- current roadmap and current audit;
- project charter and workflow rules;
- current compiler/Foundry/desktop source;
- current Regionwright handoffs and verified integration state.

### Historical evidence
- milestone receipts;
- old fixture-only proofs;
- superseded Injector implementations;
- obsolete roadmap steps that remain useful for provenance.

### Non-knowledge / reproducibility material
- node_modules/;
- large temporary Foundry fixture directories;
- Playwright reports;
- transient caches and trace targets;
- generated dependency/build material.

These are not to be treated as campaign knowledge merely because they exist in the workspace.

## Injector Subsystem

The term **Dicebox Injector** may still be used for the subsystem that converts structured campaign/scene specifications into Foundry-ready artifacts and guarded runtime operations.

It includes, as applicable:

- scene/background creation;
- walls and doors;
- regions and RegionBehavior;
- tiles;
- tokens;
- lights;
- sounds;
- drawings and notes;
- journals/handouts;
- stable IDs and ownership markers;
- preview/approval/apply/reread;
- foreign-state preservation;
- outcome-unknown handling;
- compact transfer/chunking/reassembly mechanisms;
- deterministic compilation and validation.

The subsystem is governed by Dicebox Campaign Helper project authority.

## Beyond the Realms

beyond-the-realms-bridge/ is a first-class campaign migration source, not a disposable compatibility folder.

Its campaign continuity and Injector reconciliation documents should be incorporated into the canonical knowledge model while preserving established-canon versus proposed-content distinctions.

## Working Rule

One project, one roadmap, one knowledge authority, one current implementation.

Do not fork campaign truth, Injector truth, or Foundry truth into separate competing project identities.

## Immediate Integration Work

1. ingest and reconcile the Campaign Helper knowledge databases;
2. ingest the Beyond the Realms bridge;
3. catalog current roadmap state and unresolved gates;
4. reconcile Injector-era methods against current compiler/Foundry architecture;
5. identify the active Codex conversation(s) associated with this workspace;
6. reconcile repository copies/remotes before publishing migration changes;
7. preserve historical receipts without treating all receipts as current authority;
8. establish a single searchable catalogue for campaign knowledge, technical architecture, assets, and workflows.
