# Star*Tup Technical Roadmap

Status: research-backed draft; implementation is not authorized by this
document alone.

## Product boundary

Star*Tup is a local-first Foundry VTT startup and map-playability tool. Its
first job is to measure where an exact GM or player client spends time, then
offer reversible, evidence-labeled choices. It is not a generic media
converter, a blind module lazy-loader, a world database editor, a hosting
service, or a promise of identical behavior on every VTT.

## Shared architecture

```text
portable schemas
  ├─ AssetManifest: hashes, bytes, dimensions, codecs, roles, variants
  ├─ Profile: client scope or world/module scope, dependencies, base identity
  ├─ TimingReceipt: stage timings, resources, long tasks, confidence
  ├─ RollbackReceipt: before state, diff, after state, restore result
  └─ CapabilityReport: supported, translated, refused, unknown

shared worker and fixture package
  ├─ hashing, compression, frame transport, manifest validation
  ├─ asset analysis and derivative preparation
  └─ deterministic benchmark and receipt generation

Foundry v14 adapter
  ├─ init/setup/ready marks and first-usable-map observation
  ├─ client/user/world scope handling
  ├─ dependency-aware profile proposal and reload boundary
  ├─ Adventure/Compendium document preview/import
  ├─ verified FilePicker staging/upload
  └─ bounded scene preload policy

later read-only adapters
  ├─ Owlbear namespaced metadata and asset receipt
  └─ Roll20 Mod Script receipt/manifest display
```

## Milestones

### M0 — exact-stack fixture and evidence contract

Timebox: 1–2 working days.

Build a disposable Foundry v14.367 world with one GM client, one player
client, a representative module set, one large map, tiles, animated media,
duplicate assets, and deliberate missing-path cases. Freeze the world/system/
module/browser identity in the fixture receipt. Reuse the DiceBox media
registry, asset-attestation, file-browse, fixture, and receipt contracts.

Exit gate: the fixture can be launched, reset, and reread without changing the
live world; the receipt identifies the exact stack and records unknown states.

### M1 — Startup Budget profiler

Timebox: 5–8 working days.

Add marks for navigation, Documents/world ready, first usable UI, scene
activation, first usable map, and first interactive input. Collect resource
timings and supported main-thread long-task entries. Run cold and warm GM/player
repetitions and produce a ranked report with variance and confidence.

Exit gate: repeated runs produce stable stage names, resource summaries, and
explicit unsupported metrics; no per-module blame is claimed without A/B or
adapter evidence.

### M2 — profiles, authority, and rollback

Timebox: 5–8 working days.

Implement immutable `ClientProfile` and `WorldProfile` snapshots, dependency
closure, stale-base detection, explicit diffs, a reload/disposable-clone
boundary, and verified restore. Keep the first release read-only plus proposed
changes. Pair Foundry backup evidence with the external asset manifest.

Exit gate: clean apply, changed-base rejection, failed-reload recovery, missing
asset, and restore fixtures all stop safely and preserve foreign/unknown state.

### M3 — asset derivatives and bounded preload

Timebox: 5–7 working days after M1.

Add content-addressed source-preserving variants for map backgrounds, tiles,
tokens, thumbnails, and low-bandwidth clients. Use Workers for analysis and
`createImageBitmap` where available. Integrate a bounded policy over Foundry's
existing preload path. Include cache identity, fidelity review, decode/GPU
risk, rollback, and explicit storage failure handling.

Exit gate: the derivative path improves first usable map time for a declared
client profile without unacceptable fidelity, decode, GPU, audio/video, or
rollback regression; stale or evicted cache entries become misses.

### M4 — verified package receiver

Timebox: 7–10 working days after M0, in parallel only when it does not delay
M1/M2.

Implement the Injector-style packer, manifest, frame digests, whole-package
digest, duplicate/out-of-order receive, refresh resume, corrupt-frame reject,
and commit-after-verification state machine. Use Adventure/Compendium preview
for structured documents and verified file staging for binary media. Keep the
bootstrap transport small and bounded.

Exit gate: clean, duplicate, shuffled, refresh, corrupt, wrong-base, failed
upload, and abort cases leave the target unchanged unless a verified commit is
explicitly approved.

### M5 — portable receipt and second-platform probe

Timebox: 3–5 working days after Foundry evidence.

Export the neutral manifest, timing receipt, profile intent, capability report,
and rollback receipt. Build one read-only Owlbear or Roll20 consumer that
preserves unknown fields and clearly refuses unsupported actions.

Exit gate: a second platform can consume the evidence artifact without a false
claim of runtime parity, and a qualified user can name a repeated cross-VTT job
worth the adapter cost.

### M6 — payer and product gate

Do not treat technical success as product validation. Compare Star*Tup with
Foundry controls, existing performance/preload tools, Media Optimizer, free
command-line tools, manual profiles, and the exact client workflow. Recruit
asset-heavy GMs, paid/professional hosts, and ordinary home tables as a
negative control. Test whether buyers pay for verified diagnosis, safe profile
selection, rollback, or weakest-client prevention rather than for smaller files
alone.

Exit gate: named buyer problem, exact-alternative preference, non-zero price,
two multi-session or multi-world pilots, and no material safety or rights
failure.

## Acceptance-test matrix

| Area | Required evidence |
|---|---|
| Startup | Cold/warm GM and player runs; world-ready, UI-ready, scene-active, map-usable, first-input timings |
| Attribution | Phase timing by default; module attribution only from controlled A/B, bisection, or exact adapter evidence |
| Profiles | Client/world scope separation, dependency closure, base hash, explicit diff, reload boundary |
| Rollback | Before/after/restore reread, external asset manifest, missing-link detection, foreign-field preservation |
| Assets | Source hash, dimensions, codec, role, derivative settings, fidelity result, cache identity, rollback link |
| Preload | Bounded concurrency, progress, failure, budget exhaustion, player readiness benefit |
| Transport | Duplicate/out-of-order, refresh resume, corruption, wrong base, abort, commit-after-digest |
| Portability | Stable IDs, unknown/refused field preservation, capability report, no false parity claim |
| Safety | No live-world direct database edits, no arbitrary third-party lazy loading, no silent writes |
| Market | Qualified payer, exact alternatives, price choice, repeat value, negative control |

## Techniques that cut creation time

1. Reuse the existing DiceBox media registry, asset attestation, file-browse,
   receipt, and disposable-fixture contracts.
2. Share one schema/worker package across transport, profiling, and asset work.
3. Use content hashes and stable IDs so unchanged binary assets are not
   repackaged or revalidated unnecessarily.
4. Use standard Foundry Adventure/Compendium and FilePicker paths instead of
   building a document/database writer.
5. Use browser User Timing, PerformanceObserver, Workers, and native
   compression/image primitives before adding dependencies.
6. Keep every operation previewable, idempotent, scoped, and base-checked.
7. Generate deterministic synthetic fixtures before testing user worlds.

## Known non-goals

- Arbitrary late-loading or rewriting of third-party modules.
- Direct edits to Foundry world databases while Foundry is running.
- A generic PNG/WebP/OGG converter.
- A universal browser/GPU/network repair tool.
- Automatic cross-VTT feature parity.
- Hosted accounts, campaign-content collection, or publisher-content scraping.

## Unresolved research questions

- Which exact Foundry v14.367 runtime events best delimit first usable map on
  the installed fixture?
- How much module attribution can controlled A/B/bisection provide without
  making benchmark runs too slow for ordinary GMs?
- Which derivative choices improve first usable map time across low-GPU,
  Chromium, and Firefox clients without visible fidelity loss?
- What cache quota and eviction behavior is observed on the target browsers?
- Which profile changes can be applied through supported Foundry APIs versus a
  disposable clone or user-mediated reload?
- Does a verified diagnosis/rollback receipt earn payment after current tools
  and free workflows are shown?
- Is there a repeated cross-VTT workflow that justifies a second adapter?

## Current recommendation

Implement and validate M0–M2 first. That gives Star*Tup a reliable answer to
“what is slow, what change is proposed, and can I undo it?” before adding
asset conversion, package transport, or cross-VTT support.
