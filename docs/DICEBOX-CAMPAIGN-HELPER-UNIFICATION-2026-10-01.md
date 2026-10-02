# Dicebox Campaign Helper Unification — 2026-10-01

## Canonical identity

The canonical project name is **Dicebox Campaign Helper**.

Former names and scopes are preserved as historical lineage or subsystems:

- **Dicebox Injector** — Foundry compilation, deployment, injection, reconciliation, transfer, and verification subsystem inside Dicebox Campaign Helper.
- **BTR Injector** — older legacy name for Injector work.
- **Beyond the Realms (BTR)** — campaign content, not the project.
- **Regionwright** — companion tooling/integration used by the project; not a competing project authority.

## Repository authority

`Dicebox20/dicebox-campaign-helper` is the canonical source repository for the full project.

GitHub is the permanent source of truth for project code, documentation, schemas, tests, migrations, roadmap/control files, and reproducible knowledge sources. Local checkouts, cloud workspaces, build machines, and runtime servers are replaceable execution environments.

The migration snapshot that previously occupied `main` is preserved on branch `archive/migration-2026-10-01`. It is provenance and recovery evidence, not current project authority.

## Unified scope

Dicebox Campaign Helper owns the complete product:

- campaign planning, lore, continuity, NPCs, factions, quests, encounters, puzzles, locations, sessions, and GM knowledge;
- the TTRPG-specialized ChatGPT/Campaign Director experience;
- desktop workspace and UI;
- campaign knowledge/database systems;
- map, scene, token, handout, audio, image, and asset workflows;
- Foundry Scene, Actor, Item, Journal, RollTable, Playlist, Token, Wall, Light, Region, Note, Macro, Compendium, and related document workflows;
- Dicebox Injector compiler/deployment/reconciliation machinery;
- Regionwright integration;
- Foundry runtime inspection, preview, approval, apply, reread, verification, backup, rollback, and receipts;
- remote/shared-server deployment;
- Codex development, handoff, review, and escalation workflows;
- GitHub, cloud-development, CI, release, and bootstrap/self-development infrastructure.

## Product direction

Dicebox Campaign Helper is an AI-native TTRPG workspace and Foundry control plane. The LLM provides campaign/TTRPG reasoning and orchestrates typed Dicebox capabilities; deterministic services perform filesystem, deployment, Foundry, asset, validation, and runtime operations.

The target user experience is deliberately simple even when the backend is sophisticated. The baseline workspace shell is:

**Conversation | Workspace | Preview | Needs Attention**

with **LIVE / CHAT / FEED** as the primary conversation/activity modes.

## Current infrastructure principle

The project must not depend on Rujiel's local PC for continuity. GitHub is canonical; development and test work may run in remote/cloud workspaces; the shared Foundry server is a deployment/runtime target. A failed or replaced local computer must not endanger the project.

## Working rule

**One project, one roadmap, one knowledge authority, one current implementation.**

Historical evidence remains valuable, but historical project naming or migration policy cannot silently override current accepted decisions.
