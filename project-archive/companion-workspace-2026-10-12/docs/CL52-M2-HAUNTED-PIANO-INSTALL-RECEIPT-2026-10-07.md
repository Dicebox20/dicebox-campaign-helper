# CL-52 M2 Haunted Piano — Installation Receipt (2026-10-07)

**World:** `the-lost-mine-of-phandalin`, Foundry 14.367, dnd5e 5.3.3.

## Governed scope and result
The user approved original CL-52 audio/assets for private Foundry campaign use. M2 PREPARE v001 `Horror pacing` authorizes a short haunted player-piano cue but does not authorize solving the U2 Piano Roll / M2 Silver Family Emblem mechanism.

**Guarded Macro APPLY PASS, separate read-only FINAL VERIFY PASS, CL90 whole-campaign smoke v003 PASS_WITH_KNOWN_BLOCKERS.** No automatic Region trigger, no playback, no token/Actor/light/Region/puzzle edits. Live baseline **21 Scenes / 202 Regions / 116 enabled RegionBehaviors / 116 unique stable IDs / 33 canonical Items / 134 world Macros**. Kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814` unchanged.

**Important newer live state:** The original ledger revision 0 checkpoint was superseded by observed **revision 1** on 2026-10-08T03:40:53.252Z, apparently from E1 recent-use observation. Canonical `puzzles.e1.recentUseObserved=true`, notices include `observation:e1` and `e1`. This state was identified read-only before new work and **preserved exactly** by guarded M2 install. No reversal or reset occurred. Current ledger revision remains 1.

## Original M2 asset
- Project master `assets/cl52/audio/m2-haunted-piano-v001.wav`, manifest `assets/cl52/audio/m2-haunted-piano-v001.manifest.json`.
- Original additive synthesis `work/foundry-playwright-harness/generate-m2-haunted-piano-v001.cjs`: six seconds, 48kHz stereo PCM16 WAV, 1,152,044 bytes. Five isolated uneven slightly dissonant notes and gentle wooden resonance; original, no third-party samples/recognizable melody, peak target 0.30, no harsh impact.
- SHA256: `d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9`.
- Installed Foundry world file `worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m2-haunted-piano-v001.wav`.
- File SHA match independently checked on local disk after copy, plus live Foundry FilePicker exact single match and HTTP HEAD `200 audio/wav`, 1,152,044 bytes.

## GM control
- World Macro **DiceBox CL-52 — M2 Haunted Piano (GM One-Shot)**, ID `VHVC7yVlrNS7mWGJ`, stableId `dbx:central-lodge:cl52:macro:m2-haunted-piano-one-shot`.
- Source `work/foundry-playwright-harness/cl52-m2-piano-macro-v001.txt`, SHA256 `c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b`.
- `ownership.default=0`, explicit Gamemaster and Assistant Gamemaster `3`. Playback routine itself only accepts the primary active GM. It checks GM is viewing M2, at least one active non-GM player is viewing M2, GM confirms a dialog, and only the M2 player audience receives targeted `AudioHelper.play` at 0.32 volume.
- Scene-owned one-shot `flags.world.dicebox.cl52.m2HauntedPianoPlayed` **absent/unconsumed** at independent FINAL VERIFY. On confirmed GM activation, it is recorded before audio broadcast, with uncertain audio outcome left consumed until manual GM review. The one-shot is not automatically replayed after refresh.
- Local offline contract test `cl52-m2-piano-macro-offline-v001.cjs`: **9 scenarios PASS**; tested disabled nonprimary role, wrong GM Scene, no player audience, already consumed, cancel, one targeted success with replay suppression, uncertain socket playback, concurrent triggering.
- Foundry no-write Macro model PREVIEW **PASS**. Guarded `cl52-m2-macro-guarded-apply-v001.page.js` **PASS**, independent `cl52-m2-macro-final-verify-v001.page.js` **PASS** (134 Macros, correct ownership/source/asset/flag, ledger revision 1).
- Generated installer inherited a wrong 21-scene roster with duplicate M2 and omitted M1; **caught before live APPLY**, corrected it in both APPLY and independent final verifier, and pinned a static syntax/roster check. No live mutation occurred before this correction. This is a generation QA trial.

## Rollback recipe — not executed
If the owner decides to uninstall, independently reread Macro ID/stableId and exact SHA before `Macro.deleteDocuments(["VHVC7yVlrNS7mWGJ"])`, then independent verify macro count returns 133. Retain master original audio. Remove the deployed WAV only after confirming no other reference and matching SHA. No Scene cue state should exist before playback; **do not reset one-shot flags after an uncertain broadcast without player-delivery evidence**. No gameplay rollback has been tested; code/asset install is reversible by exact target.

## Deferred work
Primary GM can run the Macro manually while players view M2; controlled client playback/one-shot persistence canary is pending. Full CL50 route topology (T1/T2 and N3→T3), M1 clock literal solution, M2 Founder Portrait/U2 servant-history semantic differences, CL51 global event-night trigger, other CL52 effects, and final CL90/91/92 player QA remain pending.
