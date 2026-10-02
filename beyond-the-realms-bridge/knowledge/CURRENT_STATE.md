# Beyond the Realms — Current State

**Bridge state:** local-ready-not-published  
**Target runtime:** Foundry VTT 14.367 Stable, D&D5e 5.3.3  
**Project:** Beyond the Realms

## Preserved status

| Capability | BTR status | Bridge provenance |
| --- | --- | --- |
| NPC Injector Engine 1.0 | `RUNTIME_CONFIRMED` | `CARRIED_HANDOFF`; three fresh Actor injections are reported in the 2026-09-19 handoff |
| NPC Injector Engine 2.0 / Tharvek Alpha 1 | `PENDING_RUNTIME_TEST` | `CARRIED_HANDOFF`; macro had not been run at handoff time |
| Prototype 3 Scene Injector architecture | `RUNTIME_CONFIRMED` | `CARRIED_HANDOFF`; preserved from the 2026-09-21 Prototype 5 handoff |
| Prototype 4.6B installation path | `RUNTIME_CONFIRMED` | `CARRIED_HANDOFF` |
| Prototype 4.6C non-reentrant puzzle fix | `RUNTIME_CONFIRMED` | `CARRIED_HANDOFF` |
| Prototype 5 approved Elemental Confluence map | `PACKAGE_READY` / approved exception | supplied asset and handoff; final reconciliation and live test remain open |
| Prototype 5 persistent Scene reconciliation | `EXPERIMENTAL` | v0.2 draft; live Foundry promotion is explicitly not established |

## Immediate bounded frontier

Continue Prototype 5 only after retrieving the missing canonical BTR sources
listed in `CANONICAL_SOURCES.md`. The intended next boundary is final MapSpec
alignment to the approved map, followed by a dry-run and runtime-tested
CREATE / UPDATE / PRESERVE / WARN reconciliation sequence.

For the NPC track, treat Engine 1.0 as frozen and validated by the source
handoff. Treat Tharvek / Injector 2.0 Alpha 1 as needing runtime testing. Do
not promote display-name Item cleanup to production identity semantics.
