# Cascade Hollows BUILD

Status: STAGED, NOT LIVE-VERIFIED

Files:
- inject-cascade-hollows.js: idempotent Foundry script Macro payload.
- manifest.json: stable IDs, dependencies, renderer hash, and route contract.
- BUILD_RECEIPT.json: static validation receipt after checks complete.
- Cascade_Hollows_BUILD.zip: packaged build.

Approved renderer:
- 1536 x 1024
- WebP SHA-256: 6b8107a2e40d193db50bcd2fe1d595ccdecbfdeb7c189b99318c832816b09369
- Target Foundry path: worlds/<world-id>/dicebox/maps/underdark/cascade-hollows.webp

The renderer was generated in the ChatGPT conversation and is not silently claimed to exist in the local Foundry data root. Copy the approved WebP to the target path before running the injector.

The injector exact-gates Foundry 14.367 / D&D5e 5.3.3 and the elected active GM, refuses to overwrite a foreign/manual Cascade Hollows scene, upserts 19 Dicebox-managed Regions, preserves unrelated scene state, uses the installed fishing and mining APIs, leaves unsupported gathering interactions as managed placeholders, and links route endpoints only when both sides resolve unambiguously.

No live-success claim is made by this BUILD package. Runtime verification is a separate phase.