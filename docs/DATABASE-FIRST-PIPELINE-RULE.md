# Database-first pipeline rule

The DiceBox Campaign Helper knowledge base is the governing control plane for every task the project specializes in, as well as for its pipelines and work routines.

Before planning, creating, importing, compiling, adapting, or materially changing a JournalEntry or page, Actor, Item, Scene or map, Spatial Blueprint, Tile, Wall, door anchor, Region, RegionBehavior, Macro, teleport, puzzle, campaign package, module asset, Foundry adapter, harness routine, installation workflow, or recurring development procedure:

1. Query the approved read-only database surface.
2. Inspect applicable sources, facts, decisions, trials, open items, and schemas.
3. Reuse an existing routine when it already covers the need.
4. Reuse an existing schema, routine, pipeline, or contract when it covers the task.
5. If a new routine or contract is justified, record its purpose, authority boundary, owner, provenance, evidence receipt, failure/recovery behavior, and open risks in `database/seed.sql`.
6. Rebuild and verify the database from `database/schema.sql` and `database/seed.sql` before implementation proceeds.
7. Record any conflict as an explicit reconciliation. A historical conversation, generated artifact, or community example cannot silently override the active database rule.

This rule governs planning and implementation; it does not authorize live Foundry mutation. Exact runtime, active-GM authority, native operation, read-back, recovery, and Ready-to-Play gates remain separate blockers.
