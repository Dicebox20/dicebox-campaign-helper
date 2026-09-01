# ADR-0006: Image Providers and Structural Render Packages

Status: provider architecture accepted; provider selection requires prototype.

## Context

Map-generation attempts produced attractive images that did not reliably preserve entrances, puzzle space, or coordinate topology. Selecting one provider without a controlled map benchmark would repeat that failure.

## Decision

Introduce a provider-neutral `ImageProvider` contract and a versioned Structural Render Package containing locked masks, entrances, exclusions, style references, Background Object rules, native Foundry Tile exclusions, and evaluation metadata. Providers return candidate pixels only. GPT Image 2 and Gemini 3.1 Flash/Pro Image are the first benchmark candidates; FLUX Kontext and Ideogram are challengers. No provider becomes default until it passes the same map corpus and rubric.

## Consequences

- Geometry remains program-owned.
- Prompts, inputs, provider/model versions, hashes, latency, and cost become reproducible evidence.
- If no provider preserves topology, DiceBox will generate textures/decoration and compose structural layers deterministically.

