# DiceBox Campaign Helper Status

## 2026-10-09 accepted map PREPARE rule

- All new map PREPARE packets must include a monospaced top-down text diagram, with route and landmark positions, legend, and location table; see `docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md`.
- This rule is approved independently of the ongoing experimental grayscale/ANALYZE/painterly workflow, which is not promoted to permanent canon by this change.

Status: M0 implementation complete; paused at the M0 review gate.

## 2026-10-08 active operating-contract and Central Lodge continuation

- Project-scoped work has blanket standing authorization under `AGENTS.md`: project files, local tooling, downloads from trustworthy project-relevant sources, browser/terminal/runtime automation, and troubleshooting may proceed without repeated permission prompts.
- The dedicated Assistant Gamemaster developer/automation session is an explicitly authorized Foundry project executor. The older project-local primary-active-GM-only convention is superseded for this designated session; exact target/version/hash/PREVIEW/rollback/reread gates remain mandatory.
- When a blocker materially stalls or repeats, stop repeating the same failed method and research alternate approaches using current official documentation and relevant technical community sources before promoting another attempt.
- Bounded Workers should be routed to the currently recommended model for their task class when available; the Foreman remains the single integration authority.
- Central Lodge live baseline before CL-15 APPLY is 21 Scenes / 202 Regions / 43 RegionBehaviors / 33 canonical Items. CL-14 B1 Waterwheel direction is certified; CL-15 E3 Behavior PREVIEW v002 passed under Playwright and APPLY is the current gate.
- The isolated Playwright/CDP developer harness at `work/foundry-playwright-harness` is a governed developer-only path, not a public/runtime arbitrary-evaluation capability.

## Complete

- Linked Campaign Assistant project overview and five project chats reviewed.
- Existing Campaign Assistant KB, Regionwright, DMF, conversations, trial ledger, audit, and 40-subject pass incorporated.
- DiceBox project charter and Codex contract written.
- SQLite KB schema, seed, FTS5 search, views, and reproducible build script created.
- Database integrity check passed.
- Focused gap research completed for module packaging, document transactions, FTS5 synchronization, Activities/hooks, and package drift.
- Creation plan written through M0-M11.
- M0 implementation checkout created with four package boundaries, canonical types/schemas, readiness-gated bridge, no-op Foundry package, ADR-0002, and 9 passing tests.
- M0 verification recorded as static/deterministic evidence only; no live Foundry or world-mutation claim is made.

## Current database counts

- 173 sources
- 737 normalized facts
- 332 decisions
- 390 open items
- 164 trial records
- 40 research subjects
- 12 milestones

## Current product research

- Dungeon Master's Forge is explicitly backburnered.
- Session Ready was demoted after Preload Tracker 2.2.0, Performance Optimizer,
  and Axon's Performance Monitor closed the proposed readiness/diagnostics gap.
- Tactical Memory / Last-Seen Battlefield remains a conditional control, not a
  selected product:
  an observer-scoped, decaying enemy-position ghost for stealth and pursuit
  encounters. Paid visibility products establish category precedent, but its
  price, exact Foundry runtime, privacy correctness, and cross-VTT parity remain
  unproven. Rights risk is manageable with original procedural/local
  presentation, but portability is only a neutral-ledger hypothesis. The
  first technical slice is private player-local memory, and the wider buyer
  comparison remains open before selecting it.
- TableSpeak / Live Table Translation Bridge remains a conditional control, not
  a selected product:
  per-user typed-chat translation with optional captions for mixed-language
  tables. Small World is a stale direct precedent, while Polyglot and journal
  translators solve adjacent problems. Discord translation apps and desktop
  voice translators are now confirmed strong substitutes, so TableSpeak is a
  conditional challenger only if it preserves VTT-specific semantics. It
  remains unselected until a table-owner price choice, three-session pilot,
  privacy/latency fixture, and second-VTT adapter proof are completed; live
  voice translation is deferred.
  The paid shape must separate a one-time BYOK/local module from any hosted,
  usage-limited service.
- Guided Level-Up Concierge was opened and demoted as a duplicate: current
  D&D5e Character Builder/Hero Mancer and PF2e Level-Up Wizard/Leveler occupy
  the main gap. The broad search remains open.
- Evidence Locker / Session Gallery is the newest conditional challenger:
  automatic, per-player receipts for already-authorized clues, images,
  handouts, and linked documents. Community workarounds show repeated recall
  pain, but LoreBox already sells cross-session handout recall and current
  Foundry tools cover sharing, presentation, and evidence boards. It remains
  unselected until a Foundry-semantic wedge earns a non-zero price and a
  three-session pilot; Dungeon Master's Forge stays backburnered.
- World Clock Automator was tested as another fresh challenger after a direct
  request for system-agnostic torch and world-time timers. Current Light
  Sources, About Time, Expedition Tracker, SessionFlow, Calendaria, and Glyph
  cover the broad behavior, so it is demoted unless a no-code consequence
  workflow earns a price and pilot over those existing tools.
- Game Night Preflight / World Doctor is a conditional comparison arm, not a
  selected product: a read-only, evidence-linked update rehearsal and recovery
  receipt for long-running, module-heavy worlds. Foundry backups, package
  compatibility, Molten/VTT Online testing options, The Forge save points,
  Sephral's document recovery, Asset Auditor, Find the Culprit, FileSmith, and
  Scene Packer close adjacent pieces. Reopen only for a named behavioral
  failure that survives those alternatives and passes a real price, disposable
  pilot, no-live-mutation, and portability test.
- Tactical Sketchbook / Collaborative Map Ink was narrowed and demoted after
  the current-package audit: Gambit's Image Viewer already provides premium
  real-time image annotations, and Gambit's Enhanced Drawing is targeting
  premium canvas drawing. Only a very narrow temporary live-scene annotation
  workflow remains testable, and it is not selected until it beats current
  tools at $10/$20/$30 or no purchase and completes a pilot. Dungeon Master's
  Forge remains backburnered and untouched.
- Adventure Navigator / GM Searchlight is the third empirical gate, not a
  selected product: a local, deterministic session-context lane that uses the active
  scene or selected location to surface exact evidence-linked journal passages,
  actors, maps, clues, and next actions from user-owned adventure content. A
  recent v14 report describes losing about fifteen minutes searching journals,
  but Search and Highlight, Simple SearchBar, Monk's Enhanced Journal, Campaign
  Codex, World & Campaign Builder, and AI copilot tools occupy much of the
  general knowledge/search space. It remains unselected until qualified
  adventure-running GMs prefer the contextual runbook at $15/$25/$39 or no
  purchase, complete a three-session pilot, and pass a local permission,
  reindex, stale-link, and no-content-copy fixture.
  Static Foundry API evidence makes the read-only index plausible through
  JournalEntry scene-note links and permission checks, but does not certify
  ranking, reconnect, legal clearance, or a second-VTT adapter.
- Rapid Encounter Board / Live Scene Staging is the fourth conditional arm:
  a temporary, limited-control workflow for turning a blank grid or reference
  image into a playable scene during an improvised encounter. The community
  pain is clear and the demo is eye-catching, but MapForge, FA Nexus,
  Moulinette, Scene Express, Mass Import, Forgotten Adventures, and external
  map makers occupy the broad map-authoring category. MapForge also provides a
  genuine commercial/payment signal through Patreon access and direct buyer
  feedback, which validates the category but makes it the mandatory
  head-to-head incumbent. It remains unselected unless improvisation-heavy GMs
  choose the narrow staging lane at a non-zero price, complete a three-session
  pilot, and pass scope/promotion, licensing, and portability gates.
- TableStart / Guided Player Session is the fifth conditional arm:
  a GM-authored, per-scene session recipe that guides new or returning players
  from join/claim to the small set of actions relevant now, then falls back to
  the normal sheet. The player-complexity pain is real but mixed, and Hide UI,
  Player Pilot, Claim Your Hero, Character Builder, Hero Mancer, AFK Ready
  Check, and SessionFlow occupy most of the broad category. It remains
  unselected unless a table owner chooses the narrow onboarding/return-to-play
  workflow at a non-zero price and completes a three-session pilot.
- Player Compass is now the first empirical gate, not a selected product:
  an automatic, per-player surface that selects the current context and shows
  only the relevant actions in plain language, while preserving the native
  sheet. A recent PF2e report describes persistent confusion after nine months,
  but Foundry Navigator, Token Action HUD, PF2e HUD, Argon, Stylish Action HUD,
  and Hide UI close much of the broad gap. Premium UX products such as Stylish
  Action HUD, SessionFlow, and Originate provide category payment evidence, but
  not product-specific WTP. Public Stylish Action HUD responses also show that
  incumbent payment and satisfaction cannot be transferred to a new product:
  some buyers want minimal/quiet presentation or reject subscriptions. Player
  Compass must therefore beat the exact HUD stack in minimal mode at
  $10/$20/$30/$39 or no purchase, complete a three-session pilot, and pass
  read-only visibility, accessibility, and portability gates.
- Pass 112 narrowed Player Compass after the current technical and rights audit:
  Foundry Navigator, Token Action HUD D&D5e, and PF2e HUD already cover broad
  action access and substantial accessibility behavior. The only remaining
  testable offer is zero-setup, read-only context explanation with a native-sheet
  escape hatch. It requires separate D&D5e/PF2e capability adapters, synthetic
  permission/accessibility/reconnect fixtures, a package and asset rights audit,
  and a later manifest-only second-VTT experiment. No product is selected.
- Campaign Anchor / Version Harbor is a fresh conditional challenger from Pass
  113: a local-first, campaign-specific Foundry environment lockfile with a
  clone-before-upgrade rehearsal, known-good launch, and deterministic rollback
  receipt. Foundry portable installs, The Forge per-game version management,
  Molten backups, and current compatibility tools close the broad promise, so
  the buyer test must target self-hosting GMs with long-running or paid worlds.
  It is not selected, is Foundry-first with weak portability, and must beat the
  exact manual or managed-host alternative at a non-zero price.
- Pass 114 demoted Campaign Anchor to a conditional comparison arm: Foundry's
  current snapshots, automatic pre-migration backups, package restore, and
  official portable/multiple-version workflow close generic backup, pinning, and
  launcher claims. Retain only the campaign-specific environment receipt and
  clone/rehearse/known-good protocol as reusable assets; reopen it only for a
  named failure that survives those controls and World Doctor.
- Between Sessions / Campaign Projects was tested as a fresh player-facing
  downtime/Bastion challenger in Pass 115 and parked. The official D&D5e DMG,
  Indy Ventures, Downtime Manager, Downtime 5e, Yugen, Universal Downtime
  Engine, and Morelord already occupy the broad category. Retain only the
  player-submission, GM approval-queue, project receipt, and provenance ideas;
  reopen them for a named recurring reconciliation failure and non-zero price.
- Table Pact / Campaign Fit was tested as a fresh session-zero challenger in
  Pass 116 and kept conditional, not selected. The recurring mismatch pain is
  visible, but Safety Tools, Safety and Communication, Consent Form,
  checklists, forms, and direct conversation are strong substitutes. Test only
  new, paid, convention, or organized-play tables with a named mismatch,
  private answers, aggregate conflicts, versioned acknowledgements, and a
  non-zero price; retain those privacy-safe contract patterns as reusable
  Campaign Helper assets. Dungeon Master's Forge remains backburnered and
  untouched.
- Resource Steward / Ammunition and Supply Tension was rejected in Pass 117.
  Ordinary tables often opt out of mundane resource bookkeeping, while Ammo
  Tracker, RC Spent, Weapon Reload, Party Resources, Custom Fields, and Bag o'
  Lists already cover the narrow automation. Retain only neutral resource
  events, thresholds, provenance, and reversible receipts for survival-focused
  buyer tests.
- Character Integrity Ledger was rejected in Pass 118. Character Tracker and
  yugen-tracker already cover player-sheet audit logs, alerts, exports, and
  history on current Foundry versions. Retain immutable change events,
  role-filtered views, retention, and no-accusation UX as reusable assets;
  reopen only for a named incident that current trackers fail to explain.
- Player Pocket / VTT Companion was opened as a conditional empirical
  challenger in Pass 119. Foundry core does not support mobile clients, and
  hybrid tables show clear demand, including current one-time GM payment
  signals from mobile competitors. The broad category is crowded, so test
  only the narrow portable player-action contract—permission-scoped snapshot,
  action request, roll/result, reconnect, and read-only offline cache—against
  the exact installed competitor. It is not selected.
- Pass 120 demoted the broad Player Pocket mobile-client promise to a
  conditional comparison arm. PocketScroll, Swipe, VTT Companion, Diecast,
  and other current Foundry packages cover the obvious demo, while Roll20 and
  D&D Beyond cover important cross-platform substitutes. Reopen only for a
  named cross-VTT failure that survives those surfaces and clears a two-VTT,
  one-time-price pilot.
- Pass 121 opened Encounter Tuner / Party Fit Lab as the only new conditional
  challenger from the latest search. It measures actual combat outcomes and
  proposes explainable, reversible next-encounter adjustments. Encounter Forge,
  Giffyglyph's Monster Maker, D&D Beyond's Encounter Builder, Combat Stats,
  Battle Replay, and Grim Arithmetic are mandatory controls; a generic monster
  builder is explicitly out of scope.
- Pass 122 rejected SceneReady / Map QA as a standalone product. Universal
  Battlemap Importer, Dungeon Alchemist, Dungeondraft, MapForge, Mass Import,
  and current level/splitting tools already cover most of the visual promise.
  Retain readiness receipts, visual diffs, and missing-asset reports as
  reusable BridgeCheck/World Doctor assets.
- Pass 123 opened CanvasBridge / Legacy-Device Player Relay as a fresh,
  conditional challenger. Foundry's current browser/device requirements,
  iPad limitation, and recent blocked-player reports establish a high-urgency
  incident, but Performance Optimizer, Swipe, foundry-mobile-companion,
  Foundry Lightweight Client, and screen-sharing/workaround paths make the
  broad category crowded. Test only a canvasless, permission-scoped fallback
  for a named excluded player; it is not selected, and Dungeon Master's Forge
  remains backburnered and untouched.
- Pass 124 demoted the broad CanvasBridge promise to a negative control after
  the current-package audit. Mobile Companion, Companion Bridge/VTT Companion,
  Foundry Mobile Companion, and Foundry Lightweight Client already cover
  stats, sheets, chat, rolls, two-way updates, or reduced client overhead.
  Reopen only for a named residual device/browser failure that survives those
  exact alternatives and produces a non-zero one-time price choice; retain
  the canvasless permission and neutral player-session contracts as reusable
  assets.
- Pass 124 demoted the broad CanvasBridge promise to a negative control after
  the current-package audit. Mobile Companion, Companion Bridge/VTT Companion,
  Foundry Mobile Companion, and Foundry Lightweight Client already cover
  stats, sheets, chat, rolls, two-way updates, or reduced client overhead.
  Reopen only for a named residual device/browser failure that survives those
  exact alternatives and produces a non-zero one-time price choice; retain
  the canvasless permission and neutral player-session contracts as reusable
  assets.
- Resolve Relay was demoted to a parked negative control after the exact
  package check: PF2e Toolbelt, PF2e Saves Helper, Effective Tray NG, and
  system-specific automation cover most of the proposed handoff. Preserve its
  neutral action-envelope, stale-request, and idempotent-undo ideas as
  reusable assets; reopen only for a named system/table failure that current
  tools cannot solve. Dungeon Master's Forge remains backburnered and
  untouched.
- TableLink / Game Night Gateway was narrowed after the exact competitor pass:
  Foundry Tunnel Manager already provides provider selection, start/stop,
  logs, URL copying, a web/desktop surface, live status, and tunnel death or
  expiry notifications. The broad gateway is therefore saturated. JoinProof /
  Game Night Gatekeeper was briefly opened as a narrower seventh challenger,
  then parked after Foundry's own remote check and generic monitors closed the
  broad verification claim.
- JoinProof / Game Night Gatekeeper is parked as a negative control after the
  external-verification pass. Foundry already provides a remote connectivity
  check, UptimeRobot and Uptime Kuma cover generic HTTP/port/WebSocket
  monitoring, and a player or phone can perform a free external check. Retain
  only the false-green, stale-invite, and minimal health-receipt assets; reopen
  it only for a named failure that those controls cannot diagnose.
- Session Pulse / Campaign Commitment is a conditional ninth challenger in the
  current queue, not a selected product: a Foundry-first recurring-session flow
  that collects availability, shows quorum state, locks the roster, sends a
  deadline/reminder, and makes the run/reschedule/recruit/fallback decision
  explicit. Doodle, Discord Scheduled Events, Warhorn, Foundry's next-session
  field, World & Campaign Builder, and SessionFlow are mandatory controls.
  Test recurring GMs at $10/$20/$39 or no purchase plus $3/$5/month or no
  recurring fee; require three real session cycles, participant privacy,
  deterministic deadlines, no duplicate reminders, and a portable
  event/attendance boundary before implementation. Doodle's paid deadline and
  reminder features establish category payment, not Session Pulse WTP; test
  ordinary groups separately from paid GMs and organized-play coordinators.
- A fresh recurring GM-prep scan found reports of four to five hours of prep
  for a three-hour session and substantial context switching, but SessionFlow,
  World & Campaign Builder, RPGM Forge, current AI/prep tools, and premium
  content occupy the broad category. Generic prep workspace, generic AI prep,
  and generic scheduling remain negative controls. Only safe reuse of
  discarded preparation after a player pivot remains a possible future wedge,
  and it has no product-specific WTP yet.
- Tabletop Bridge / Physical Table Mode is parked as a negative control after
  the current-package audit. Ninjo's In-Person Tools already covers map
  preload suppression, following/pinned displays, player selection,
  touch-friendly sheets, and turn prompts; Digital Tabletops covers current
  large-format/IR-touch support, while Physical Play Dice and other modules
  cover dice and player input. Revive only if a buyer pays for a distinct
  reliability/orchestration failure that this current stack cannot solve.
- VTT BridgeCheck / Campaign Transfer Assurance is now the third empirical
  gate, not a selected product: a post-import disposable-world rehearsal and
  source-to-target receipt for missing assets, broken links,
  schema/geometry/permission drift, and unsupported features. DDB-Importer
  and historical R20Converter use provide stronger category payment evidence
  than the recent feature candidates, but source-specific importers already
  occupy the broad market. It remains unselected until migrating GMs pay for
  assurance beyond their exact importer and manual cleanup, complete two
  campaign pilots, and pass no-mutation, licensing, and portability gates.
- LootFlow / Party Economy was tested as a fresh seventh arm and rejected.
  Item Piles, Quartermaster, Backpack, RPGX, The Stockpile, and hosted tools
  already cover the broad loot, treasury, shop, and group-cart workflow. Keep
  only the neutral party-ledger idea as a reusable asset; revive it only for a
  named repeated transaction failure plus non-zero price and pilot evidence.
- TurnReady / Combat Focus was tested as a fresh eighth arm and rejected.
  Action Keeper, Reaction Tracker, Stylish Action HUD, PF2e Combater, and
  system-native or HUD tools already cover the broad action-budget surface.
  Preserve only a neutral action-ledger schema; revive the idea only for a
  named accessibility or interruption failure that current tools cannot solve.
- Pass 125 tested Loadout Compass / Character Kits as a fresh player-facing
  challenger. Current D&D5e Spell Book and PF2e Prepper already provide the
  exact named spell-loadout workflow, while native and system-specific gear
  controls cover adjacent state. Reject the generic product; retain only an
  explicit, reversible character-kit record for a qualified non-spell failure.
- Pass 126 tested Trusted Table / Delegated Actions after a current request for
  a GM-controlled player damage toggle. Effective Tray NG, Midi-QoL, Damage
  Application, Always HP, and current D&D5e prompts already cover most of the
  D&D5e case. Reject the broad permission product; retain only the neutral
  whitelist, expiry, idempotency, audit, and undo protocol as reusable assets.
- Pass 127 completed a fresh-search reset. A current high-engagement request
  gives stronger payment evidence for an Excalidraw-like live layer, but the
  remaining offer is already the conditional Tactical Sketchbook workflow,
  not a new unvalidated product. No new product was selected. Dungeon Master's
  Forge remains backburnered and untouched.
- Pass 128 performed a fresh current-package reset around player guidance,
  onboarding, mobile access, and weak-client performance. Foundry Navigator now
  covers substantial D&D5e keyboard/screen-reader, combat, GM-mediated damage,
  focus, and low-resolution workflows; Character Builder and Foundry's player
  orientation cover the main onboarding path; Prime Performance, Scene
  Optimizer, and Swipe VTT cover current performance/mobile substitutes. No new
  product was selected. Any surviving Player Compass, Trusted Table, or
  performance offer must beat the exact current stack for a named failure,
  earn product-specific WTP, and complete a real-table pilot. Dungeon Master's
  Forge remains backburnered and untouched.
- Pass 129 tested a fresh hybrid-table/display and GM-scratchpad scan. Monk's
  Common Display, paid Stage Master, Sheet Only, Physical Play Dice, Notebook,
  GM Screen, and Campaign Codex already cover the vivid TV-stage and sidebar
  notes demos. No new product was selected; only a residual cross-VTT hybrid
  handoff contract remains as a conditional Tabletop Bridge asset. Dungeon
  Master's Forge remains backburnered and untouched.
- Pass 130 tested a fresh live-broadcast overlay lead. A strong visual payment
  signal exists among streamers and actual-play creators, but Foundry Stream
  Overlay Free/Pro, OBS Utils, Stream View, and adjacent actor/webcam overlays
  already occupy the category. It is a creator-market negative control, not an
  ordinary-table product; only consent-safe read-only broadcast packets remain
  reusable assets. Dungeon Master's Forge remains backburnered and untouched.
- Pass 131 opened Zero-Prep Session Capsule as a low-priority conditional
  challenger after a current request for minimal-configuration, zero-prep
  modules. Dungeon Flow, Morelord Encounters, Encounter Forge, Mass Import,
  current importer packages, premium adventures, and the existing Adventure
  Navigator/TableStart/Rapid Encounter arms cover much of the promise. The
  only unproven wedge is a reversible, player-safe, time-boxed session capsule
  assembled from user-owned material with a neutral portability manifest. It
  is not selected; it must earn exact-alternative preference, non-zero WTP,
  pilots, runtime safety, rights clearance, and a second-VTT proof. Dungeon
  Master's Forge remains backburnered and untouched.
- Pass 132 demoted the broad Zero-Prep Session Capsule after the current
  incumbent audit. SessionFlow now covers the one-canvas session workspace,
  beats, scenes, quick scenes, player panel, objectives, and recaps; Dungeon
  Flow covers paid Foundry import/re-import. Only a narrow disposable,
  player-safe transaction wrapper remains conditional, and it has no
  product-specific payment evidence.
- Pass 133 opened No-Spoiler Player Return Brief as a fresh conditional
  challenger. Monthly and irregular campaigns show recurring absent-player
  and lore-recall pain, while Archivist Sync, Foundry Familiar, Campaign
  Codex, SessionFlow, LegendKeeper, and Foundry shared fog cover adjacent
  recap/wiki/map workflows. The only plausible wedge is per-player,
  GM-approved, spoiler-scoped re-entry; it is not selected and must earn
  exact-alternative preference, non-zero WTP, two pilots, runtime privacy,
  rights, and second-VTT manifest evidence. Dungeon Master's Forge remains
  backburnered and untouched.
- Pass 134 demoted the broad No-Spoiler Player Return Brief after a direct
  payment/incumbent correction. Archivist sells campaign-memory plans beginning
  at $10/month, LegendKeeper sells a paid owner plan with free player seats and
  secret content, and Tavern Scribe explicitly targets missed-session catch-up
  and player memory. Reopen only for a named Foundry-local failure that
  survives those exact alternatives; retain spoiler/audience/revocation records
  as reusable assets. Dungeon Master's Forge remains backburnered and untouched.
- Pass 135 moved Game Night Preflight / World Doctor to the first empirical
  buyer gate. Update breakage and recovery are high-consequence payer pains,
  but Foundry compatibility/versioning/backups, Find the Culprit, Quick Module
  Enable, Sephral's backup tool, hosting, and duplicate-world practice are exact
  controls. World Doctor is not selected: it must win a $15/$25/$39/no-purchase
  test, two disposable-copy pilots, and the no-live-mutation/runtime,
  rights/privacy, and second-VTT receipt gates.
- Pass 136 demoted World Doctor after the direct incumbent and payer audit.
  Foundry compatibility/versioning/backups, Molten's testing server, VTT
  Online's version choice/backups, and The Forge's save points close much of
  the promise. Only behavioral smoke testing on a disposable clone remains
  distinct, and it has no direct product-specific price evidence yet.
- Pass 137 completed a fresh marketplace and ordinary-buyer scan. Premium
  payment is clearest for ready-made content and professional/organized play;
  current shops, merchants, trading, crafting, and looting packages close the
  broad player-economy gap. Attendance-Resilient Side Session is the only
  remaining bounded ROI test, not a selected product; home tables are a
  negative control and the wide search remains active.
- Pass 138 rejected generic Combat Replay / Combat Debrief as another product.
  Battle Replay, Combat Stats, Damage Log, and PF2e Combater now cover replay,
  visibility-safe timelines, analytics, correction, and tactical review. Keep
  only event-envelope, visibility-filter, timeline, correction, and export
  contracts as reusable assets; reopen only for a named learning failure with
  price and pilot evidence.
- Pass 139 corrected the player-friction lead: current free Player Pilot,
  Foundry Navigator, system HUDs, and character builders close the broad
  cockpit/source-manager claim. Player Compass remains conditional only for a
  named residual failure.
- Pass 140 corrected the adaptive side-session lead: Drop-in Dungeons,
  Prepared! 2, Dragonshorn, Omnipresence, Oronder, SessionFlow, and premium
  adventures occupy the broad content/workspace claims. Attendance-Resilient
  Side Session remains a paid/professional payer gate, not a selection.
- Pass 141 opened Audio Secrets / Scene Sound Director as a fresh lead after a
  current request for per-player audio. Its demo is strong, but current
  recipient macros, Token Audio FX, regions, and audio managers are direct
  alternatives.
- Pass 142 corrected the audio lead: premium audio proves category spending,
  not routing-product WTP. Audio Secrets remains a conditional comparison arm
  for audio-heavy paid/professional or horror/investigation GMs; Dungeon
  Master's Forge remains explicitly backburnered.
- Pass 143 corrected Audio Secrets portability: Soundscape Adventure, Roll20
  Jukebox/Jukebox Plus, and Owlbear's extension model occupy or fragment the
  generic audio surface. Keep only a neutral route manifest as reusable work.
- Pass 144 productized the strongest remaining audio hypothesis as Whisper
  Drop-In: an original 60–120 minute, no-canon scenario with asymmetric
  private clues/audio, clean exit, explicit reward export, and a safe recap.
  It has a clearer premium-content payment path but remains unselected until
  buyer choice, pilots, rights, runtime, and second-VTT packaging pass.
- Pass 145 rejected a generic Resource Steward, torch timer, or expedition
  dashboard. Expedition Tracker, Light Sources, Party Operations, SessionFlow,
  and Flip Timer now cover the broad time/resource surface; retain only
  neutral resource-event and countdown contracts.
- Pass 146 opened Accessible Table Kit as a conditional fresh lead. Community
  accessibility pain is concrete, while Foundry Navigator and older
  Accessibility Enhancements cover important but incomplete slices. The
  payer is likely qualified tables with a named disability/access failure,
  not the average home table.
- Pass 147 corrected the accessibility market and portability claim. A
  current keyboard/screen-reader layer may be high-impact but would carry a
  large support matrix and no shared cross-VTT runtime. It remains unselected
  until qualified buyers choose a non-zero price and complete pilots; Dungeon
  Master's Forge remains backburnered and untouched.
- Pass 148 rejected broad Cognitive Access, Focus Mode, and simpler-Foundry
  products. Player Pilot, Foundry Navigator, Stylish Action HUD, Carolingian
  UI, SessionFlow, and system-specific configuration occupy much of the
  ordinary player-friction surface. Accessible Table Kit remains limited to
  named accessibility incidents.
- Pass 149 reopened Migration Safe Harbor as a narrower VTT BridgeCheck
  hypothesis: a local, read-only, disposable-copy assurance receipt after an
  import. Migration failures are high-cost for active and paid GMs, but the
  product must beat the exact importer plus cleanup rather than become a
  converter or scraper.
- Pass 150 corrected Migration Safe Harbor against current incumbents:
  Foundry Adventure Documents, Scene Packer, Asset Auditor, Lore Reference
  Board, RPGNautas File Manager, and DDB-Importer already cover substantial
  packaging/import/repair behavior. Migration Safe Harbor remains an
  episodic buyer gate, not a selected product; Dungeon Master's Forge remains
  backburnered and untouched.
- Pass 151 found a real migration payment proxy: DDB-Importer gates advanced
  import/support features behind Patreon or a user-run proxy and is actively
  maintained across Foundry/D&D5e versions. This strengthens the migrating-GM
  segment but does not transfer WTP to a separate assurance receipt. Add a
  repeat-value update/regression arm and keep credentials, scraping, and
  source-content retention out of scope.
- Pass 152 found real attendance economics for paid GMs and organized play:
  per-session charging, no-show consequences, refunds, skip windows, and
  event/table payment workflows. This validates a qualified payer segment,
  not a new attendance module.
- Pass 153 rejected generic attendance/booking/roster software because
  StartPlaying, Warhorn, and current Foundry session tooling already occupy
  that job. The residual candidate is content that salvages a valuable session
  when party size changes.
- Pass 154 narrowed that candidate to Table Rescue / Attendance-Resilient Side
  Session: a portable, no-canon 60–120 minute scenario with variable-party
  branches and campaign-safe reward/recap export. It is conditional and
  unselected pending qualified price choices and real pilots. Dungeon Master's
  Forge remains backburnered and untouched.
- Pass 155 found a recurring player-facing reliability problem: connected
  players can lose scene visibility, input, or synchronization. Foundry's own
  troubleshooting guidance separates network, asset, browser/GPU, disk, and
  module-conflict causes, so universal “fix the connection” claims are out.
- Pass 156 rejected generic performance/connection software. Connection
  Monitor, Performance Optimizer, core preload/safe mode, backups, hosting,
  and browser/GPU fixes occupy adjacent controls. The residual hypothesis is
  evidence-linked readiness and safe rejoin, not network repair.
- Pass 157 opened Session Continuity as a conditional recurring-pain gate: a
  per-client health/readiness receipt and explicit rejoin workflow that avoids
  replaying uncertain actions or mutating the world. It remains unselected
  pending qualified price choices and multi-session pilots.
- Pass 158 confirmed a recurring ordinary-table rest bottleneck: player
  downtime, identify/attune/copy-spell requests, food, recovery, and GM
  approvals can consume session time. Generic automation remained unproven.
- Pass 159 corrected the rest market against current incumbents. Rest Recovery
  5e, Ionrift Respite, Stress Points & Rest, and Character Builder occupy the
  broad rest/recovery surface; Ionrift also provides multi-system adapters and
  custom event packs. Community enthusiasm for its free module is need
  evidence, not product WTP.
- Pass 160 demoted rest/downtime as a product and retained activity,
  approval, and event contracts as reusable assets only. Portability is weak
  because recovery semantics and system hooks require adapters. No product was
  selected.
- Pass 161 found a recurring asset-heavy failure: large or unoptimized maps,
  video, and audio can strand players on black screens, stalled loads, or
  screen share. Foundry's own media and troubleshooting guidance makes the
  cost concrete.
- Pass 162 rejected a generic converter. Geano's Scene Optimizer, DF Architect,
  official guidance, external tools, preload, and hosting occupy much of the
  workflow. The residual gap is verified playability for declared clients,
  not byte reduction.
- Pass 163 opened Playability Budget / Media Safe Pack as a conditional new
  candidate: a local, read-only, non-destructive asset-risk receipt with
  confirmed optimized copies and rollback. It remains unselected pending
  qualified price choices and two pilots.
- Pass 164 corrected the asset ranking: the current paid/Patreon-backed Media
  Optimizer is verified for Foundry 14 and already handles common image/audio/
  video conversion and downscaling, while Foundry identifies multiple non-
  asset causes of black/gray scenes. Playability Budget is now a comparison
  arm unless a verified-risk/rollback job earns payment. Table Rescue /
  Attendance-Resilient Side Session is the leading conditional candidate
  because paid-session no-shows have direct economic consequences and premium
  side content has a real purchase path; it remains unselected pending price,
  repeat-value, two-pilot, home-control, rights, runtime, and portability gates.
- Pass 165 evaluated the supplied Dicebox Injector v2 reference. Its
  packaging/transport/reassembly/verification separation, resumable staging,
  duplicate/out-of-order handling, and commit-after-digest contracts are
  reusable. The design should avoid giant macros: use a small receiver,
  compressed textual JSON, Adventure/Compendium import for documents, and
  verified file staging/upload for binary media. The fastest credible
  Playability Budget slice is a read-only audit plus package receiver in about
  2–3 full-time weeks; image variants add 1–2 weeks, and audio/video,
  multi-client, and cross-VTT claims add 3–6 weeks. No implementation or
  product selection has been authorized by this pass.
- Pass 166 opened Star*Tup's Startup Budget / Module Load Profiler slice.
  Foundry lifecycle hooks and browser User Timing/PerformanceObserver data can
  measure world readiness, first interaction, scene activation, resources, and
  main-thread blocking. Generic per-module blame is not reliable, so the
  product must combine phase timing, controlled A/B/bisection runs, confidence
  labels, and exact adapters only where supported. The first slice is a
  read-only profiler plus dependency-aware reversible profiles and rollback;
  generic third-party lazy loading remains out of scope.
- Pass 167 opened the asset-derivative and bounded-preload slice. Existing
  DiceBox media IDs, hashes, dimensions, and variants can support
  content-addressed derivatives, while Foundry already provides scene preload.
  The new value must be target-profile selection, cache identity, fidelity and
  rollback receipts, and explicit budget/failure behavior—not another generic
  converter or preload toggle.
- Pass 168 separated Star*Tup client profiles from GM-controlled world/module
  profiles. Foundry setting scopes, module reload behavior, and backup limits
  require immutable snapshots, explicit diffs, stale-base detection, asset
  manifests, and verified rollback. A Foundry package snapshot alone is not a
  complete media rollback.
- Pass 169 defined the cross-VTT boundary. Star*Tup can share asset manifests,
  profile intents, timing/rollback receipts, capability reports, and
  unsupported-state vocabulary. Foundry, Owlbear, and Roll20 still require
  thin adapters for lifecycle, storage, permissions, and deployment. Foundry
  remains the only initial runtime target; a second VTT is a later read-only
  portability fixture.

## First blockers

- Exact Foundry 14.367 runtime probe.
- Exact Midi/DAE capability inspection.
- StateStore and transaction-ledger prototypes.
- Fresh two-client authority/reconnect test.
- DMF Region Builder settings-open defect and Region schema reconciliation.

## Star*Tup technical research next action

Run the disposable Foundry v14.367 fixture with one GM and one player client.
Capture the four Startup Budget milestones, resource timings, supported
long-task evidence, module/settings snapshot, and an exact-stack baseline.
Then apply one dependency-aware reversible profile, rerun cold and warm loads,
restore the original profile, and verify the receipts. Keep the slice read-only
with respect to live worlds; do not begin arbitrary third-party lazy loading.

## Star*Tup implementation receipt

The standalone Windows-safe project at
`C:\Users\rujie\Documents\ChatGPT\Star_Tup` now contains the first M0–M2
local slice: benchmark receipts, Foundry lifecycle instrumentation, a
deterministic disposable GM/Player3 fixture contract, separate client/world
profile contracts, dependency-aware diffs, stale-base rejection, and pure
rollback receipts. Deterministic verification passed 8/8 tests and syntax
checks. No live Foundry world, database, module, asset, or browser was
mutated. The next gate remains the exact disposable Foundry v14.367 fixture.

## Next action

Run the bounded payer gate with Table Rescue / Attendance-Resilient Side
Session first for paid/professional and high-variance organizers, using home
tables as a negative
control. Keep World Doctor as a conditional comparison arm after its
direct-incumbent correction. Keep Combat Replay/Debrief as a negative control.
Then test Whisper Drop-In with a separate paid/professional and home-control
cohort, followed by Audio Secrets only if the delivery mechanism itself earns
payment, then Player Compass, Campaign Anchor, VTT
BridgeCheck, Adventure Navigator, Rapid Encounter Board, TableStart, and
Session Pulse against their named alternatives and price choices. Keep
Accessible Table Kit as a conditional specialist gate after the broader
content/ROI tests; recruit tables with named screen-reader, keyboard-only,
low-vision, or motor-access failures and compare against Foundry Navigator,
Accessibility Enhancements, native OS tools, custom CSS, and the exact system
sheet. Keep the resource/timer scan rejected unless a qualified buyer names a
failure that survives Expedition Tracker, Light Sources, Party Operations,
SessionFlow, and Flip Timer. Keep
Migration Safe Harbor / VTT BridgeCheck as the next high-urgency GM gate only
for named false-green imports; compare DDB-Importer, R20Exporter/R20Converter,
PDF-to-Foundry, manual cleanup, Adventure Documents, Scene Packer, Asset
Auditor, Lore Reference Board, and RPGNautas before the $10/$25/$50/$75/no-
purchase test. Require two disposable-copy pilots, no credentials or source
scraping, and a read-only second-VTT receipt. Add a matched post-update
regression arm against package warnings, importer support, backups, and manual
clone testing; do not transfer importer/Patreon WTP to the receipt. Keep
No-Spoiler Player Return Brief as a parked comparison arm after its
direct-incumbent correction. Keep Campaign Anchor only as a conditional
comparison arm unless a named failure survives Foundry snapshots, portable
installs, managed hosting, and World Doctor. Keep JoinProof parked unless a named
false-green or stale-session failure survives existing checks. Keep Resolve
Relay parked unless a named system/table failure reopens it.
Keep Between Sessions / Campaign Projects parked unless a named recurring
downtime submission or approval failure survives the current package set and a
shared spreadsheet.
Keep Table Pact / Campaign Fit conditional unless new, paid, convention, or
organized-play tables name a real expectation mismatch, prefer the private
aggregate workflow over their exact checklist/form/conversation, choose a
non-zero price, and complete privacy-safe pilots with a meaningful re-check.
Keep Resource Steward and Character Integrity Ledger rejected as negative
controls unless their narrow qualified buyers name failures that survive the
current module stack and choose a non-zero price. Continue the wide search
for a broader ordinary-table payer problem.
Keep Player Pocket below the current gates unless qualified multi-VTT or
cross-system GMs prefer its portable action contract over the exact mobile
surfaces at a one-time price and complete the two-VTT sync/privacy pilot.
Keep CanvasBridge below the current gates unless a qualified GM names a recent
device-exclusion incident, prefers the exact canvasless fallback over the free
client/performance alternatives at a one-time price, and completes two pilots
with permission, reconnect, hidden-state, and unsupported-action evidence.
Keep Encounter Tuner below the current gates unless recurring combat-heavy GMs
prefer its post-combat debrief and explainable adjustment loop over their exact
Encounter Forge/analytics/system-native alternative at a non-zero price and
complete two three-session pilots.
Keep Audio Secrets below the current gates unless qualified audio-heavy buyers
prefer recipient/scene routing over their exact macro/region/audio-manager
stack, choose a non-zero one-time price, and complete two pilots with no
privacy or rights failure. Do not infer routing WTP from premium music or
jukebox subscriptions.
Keep Tactical Memory and TableSpeak as conditional controls; keep Tabletop Bridge,
LootFlow, and TurnReady parked as negative controls unless product-specific
payment evidence reopens them. Build only the smallest disposable fixture for
the candidate that passes. Keep implementation paused until a qualified buyer
chooses a non-zero price, two three-session pilots are scheduled, and
runtime/licensing/portability gates pass. Do not promote mutation, automation,
or campaign compilation from static evidence.
