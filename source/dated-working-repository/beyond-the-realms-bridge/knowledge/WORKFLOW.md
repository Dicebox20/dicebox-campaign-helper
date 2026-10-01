# Canonical BTR Workflow

## Scene / map injector

Use this order:

`encounter purpose -> topology -> normalized MapSpec geometry -> structural validation -> artwork from the same geometry -> injector-owned asset deployment and verification -> create/reconcile Scene -> reuse/configure default Level -> bind Walls and Regions -> dry-run writes -> persist -> validate -> READY`

Locked constraints from the supplied handoff:

- MapSpec normally owns geometry; the Prototype 5 artwork-first alignment is a
  documented one-time approved-art exception.
- Reuse Foundry's automatically created default Level.
- Explicitly Level-bind Walls and Regions.
- Preallocate stable IDs/objectKeys and validate uniqueness before mutation.
- Verify asset bytes, hash, dimensions, upload path, and retrievability before
  Scene mutation.
- Dry-run Walls and Regions/behaviors before persistence.
- Preserve managed-object orphans and deliberate GM edits; do not blindly
  delete them.
- A `TOKEN_ENTER` behavior must not enable another `TOKEN_ENTER` behavior on
  the same Region during that event. Solved Regions become inert where the
  puzzle design requires it.
- `READY` is post-install evidence, not a static-test claim.

## NPC injector

Use this order:

`NPC concept -> constrained NPC Manifest -> art-only token phase -> balance review -> runtime preflight -> compendium resolution -> image resolution -> Actor core -> cloned Items -> supported custom mechanics -> native Activities/effects -> reread -> diagnostics`

Use configured Documents and public APIs. Native D&D5e Activities own ordinary
attacks, saves, damage, healing, targeting, consumption, uses, and effects when
available. Do not invent deep system schema from memory. Resolve all required
compendium content before Actor mutation and abort cleanly when required content
is missing.
