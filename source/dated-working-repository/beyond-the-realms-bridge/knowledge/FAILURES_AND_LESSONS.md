# Failures and Lessons

These are preserved from the supplied handoffs. They are not silently erased
or treated as local reproductions.

## Scene / puzzle lessons

- A prior Region puzzle allowed a `TOKEN_ENTER` handler to enable another
  `TOKEN_ENTER` behavior on the same Region during the event. This caused
  repeated alternating success / `SEQUENCE BROKEN` feedback. Prototype 4.6C
  fixed the structure: solved Regions become inert and same-Region re-entry is
  prevented.
- Large Base64 artwork made a roughly 800 KB macro fail to start visibly,
  while a roughly 97–100 KB macro worked. Keep embedded artwork compact and
  use a JavaScript-only fenced block or exact text fallback for copy/paste.
- The Prototype 5 approved map does not originate from the finalized initial
  MapSpec. It is a deliberate one-time approved-art exception, not a precedent
  for reversing the normal MapSpec-first workflow.

## NPC injector lessons

- A compact macro syntax using classic declarations, classic functions, and
  top-level `await` passed where a more modern form produced a parser error.
- A JSON import detour failed and is not the primary workflow.
- An arbitrary custom flag scope was rejected by Foundry; do not use unregistered
  custom flag namespaces in standalone injector content.
- Older image paths returned 404s. Upload and verify embedded WebP bytes before
  Actor mutation.
- The D&D5e 5.3 darkvision path is
  `system.attributes.senses.ranges.darkvision`.
- Art generation must not receive hidden macro, stat-block, schema, or puzzle
  logic. Art and macro creation are separate phases.
- Display-name-only managed-Item cleanup is acceptable for an experiment but
  is not safe production identity semantics.
