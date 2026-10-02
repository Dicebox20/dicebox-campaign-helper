# ADR-0005: Semantic Scene Commands and Geometry Authority

Status: accepted with geometry-kernel prototype conditions.

## Context

Human editing, AI editing, preview, persistence, and Foundry compilation must agree on one source of truth. A renderer scene graph cannot safely own that truth, and pure relationship resolution on every pointer event is too expensive.

## Decision

Store a versioned renderer-neutral `SceneDocument`. Every edit is a typed `SceneCommand`, regardless of whether it originated from a human or AI. Relationships own semantic intent; committed absolute geometry and dependency fingerprints are cached for deterministic rendering and export. Pixi may show ephemeral drag transforms, but Rust validates and commits geometry in batches. Begin with Rust `geo` and `rstar`; promote alternative polygon kernels only through a failing robustness corpus.

## Evidence

The M184 command spike applied 500 mixed-origin commands to 10,000 entities and 4,000 relationships with no validation errors. Its 566 ms cascading commit also demonstrates why authoritative dependency resolution cannot run synchronously on each pointer event. See `outputs/m184-scene-command-pipeline-benchmark.json`.

## Consequences

- Add shared Scene/Command/Patch/Receipt schemas and golden migrations.
- Keep compiler inputs independent of Pixi.
- Batch IPC and commit once at interaction boundaries.
- Add polygon and relationship robustness fixtures before declaring the kernel production-ready.

