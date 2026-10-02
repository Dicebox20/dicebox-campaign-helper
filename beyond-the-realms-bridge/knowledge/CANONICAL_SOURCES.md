# Canonical Sources and Availability

## Present in this bridge

| Source | Location | Authority/use |
| --- | --- | --- |
| BTR repository instructions | `../AGENTS.md` | durable bootstrap and status rules |
| NPC reconciliation handoff | `../reference/Beyond_the_Realms_NPC_Injector_Reconciliation_Handoff_2026-09-19.md` | NPC Injector 1.0/2.0 provenance and runtime claims |
| Prototype 5 handoff | `../reference/BTR_Prototype5_Scene_Injector_Handoff_2026-09-21.md` | Scene Injector workflow, exception, and next boundary |
| Approved Prototype 5 map | `../assets/BTR_Prototype5_Elemental_Confluence_Player_Map.png` | approved player-facing artifact; not geometry authority |

## Referenced by the handoffs but not included

The following are required before specialized BTR implementation and remain
unavailable in this local package:

- Beyond the Realms campaign database reconciliation workbook
- Foundry VTT technical knowledge base dated 2026-08-26
- `Injectors/README.md`
- latest `Injectors/MAPSPEC_SCHEMA_*.md`
- existing production and prototype injector source files
- the runtime evidence/log bundle referenced by the handoffs

Do not invent those sources from memory. Obtain approved copies from the BTR
project or its shared repository, record their hashes, and update this file and
`BRIDGE_MANIFEST.json` before implementation.

## Parent-project boundary

The parent DiceBox Campaign Helper knowledge base was queried before this
bridge was created. Its bridge decisions govern the parent project, but they do
not replace missing BTR sources or certify BTR runtime claims.
