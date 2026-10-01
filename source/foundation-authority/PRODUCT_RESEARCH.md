# Recursive Product Research: Foundry-First Consumer Product

Status: active research; no final product decision yet.

## Research objective

Find a product that ordinary paying D&D players and game masters would buy, with
Foundry VTT as the first implementation target and a credible path to other
VTTs. DiceBox Campaign Helper is treated as a source of reusable implementation
assets, not as the product thesis.

## Pass log

### Pass 1 — market and buyer shape

- Foundry reports D&D5e as its largest system (52.11% of users in its 2026
  review), 5,338 approved add-on modules, and a median user with 19 modules but
  no premium content. The average user has substantial playtime, while premium
  spending is concentrated in a smaller engaged segment.
- The official premium catalog shows where money already flows: ready-to-play
  adventures, rules content, tokens, maps, and immersive assets.
- Implication: the buyer is usually the GM who pays to save session time or make
  a session run better; a player-only utility needs a strong group-level benefit.

Sources:

- https://foundryvtt.com/article/year-in-review-2026/
- https://foundryvtt.com/article/year-in-review-2025/
- https://foundryvtt.com/article/premium-content/

### Pass 104 — fresh challenger: Resolve Relay / GM-safe action handoff

The fresh scan found a narrower, recurring play problem that is distinct from
another action HUD: the player has already targeted a creature and rolled a
valid action, but the GM must manually re-select the target and press the
damage or effect button because the player cannot modify an unowned token.
Recent community discussion describes this as a repeated multi-step mirror of
clear player intent, calls the missing target action shockingly frustrating,
and reports that a one-click GM confirmation is a major improvement. A newer
PF2e report repeats the exact failure in Foundry 13.351 and calls PF2e Toolbelt
the closest current solution. This is credible recurring pain, but it is not
yet product-specific willingness to pay.

The current-package audit shows a fragmented and uneven substitute set. The
old Damage Application module is D&D 5e-only and verified only through Foundry
11. Effective Tray NG is current for D&D 5e v13-v14 and can relay damage or
effects to unowned targets through an active GM client, but it is a broad
permission switch with direct-application settings. PF2e Toolbelt provides a
target-aware button path; PF2e Saves Helper provides current per-target and
bulk apply buttons; and PF2e's own design keeps the GM as the owner of hidden
defenses and final application. Simple Requests is only a hand-raise queue,
Requestor is a general request/roll API, and Movement Approval covers token
movement, not combat resolution. The gap is therefore not “make damage
automation exist.” It is a trustworthy, system-aware handoff that preserves
GM arbitration while removing target hunting and duplicate clicks.

The fresh candidate is **Resolve Relay**: when a player completes a supported
action, the module emits a compact intent envelope containing actor, target,
roll/result, requested operation, and visible explanation. The GM receives one
prominent card with Accept, Adjust, Reject, and Undo; the request expires or
revalidates if the target, round, or actor state changes. The player never gets
write permission, hidden defenses are not disclosed, and the GM remains the
authority. The eye-catching demo is “player clicks Apply; the GM sees the
correct target and confirms without touching the map.” The first slice should
be targeted damage and save outcomes, not a general automation engine.

The payer is the GM/host running combat-heavy D&D 5e or PF2e tables, not an
individual player. The value is repeated seconds and fewer wrong-target or
wrong-token corrections every combat. Test a buy-once offer at $10, $20, $30,
and no purchase, then test whether the table would use it for three sessions.
Do not infer WTP from free modules or from a request thread. The decisive
control is the exact current stack: PF2e Toolbelt or Saves Helper, D&D 5e
Effective Tray NG/Midi-QOL, and the native GM workflow.

Portability is plausible only at the protocol layer. A neutral action envelope
could serve Foundry first and later an Owlbear or Roll20 adapter, but damage,
resistance, conditions, hidden information, and permission models remain
system/VTT-specific. Foundry should be the only implementation target until
the relay passes an unowned-target, stale-request, duplicate-request,
disconnect, hidden-stat, and safe-undo fixture. Cross-VTT marketing must say
“portable handoff concept,” not promise feature parity.

**Decision:** open Resolve Relay as a new conditional challenger below the
current empirical queue. It is more concrete than a generic combat HUD, but it
must beat the exact free stack, earn a non-zero price, and prove that the
approval card saves work without bypassing the rules boundary. Reject it if
current target-aware modules already remove the named pain, if buyers prefer
full automation, or if system adapters make support cost exceed the one-time
price. Keep Dungeon Master's Forge backburnered and untouched.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1c077n0/player_applied_damage_pf2e/
- https://www.reddit.com/r/FoundryVTT/comments/1p4tvhv/pf2e_issues_applying_damage_to_correct_target/
- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/effectivetray-ng
- https://foundryvtt.com/packages/pf2e-toolbelt
- https://foundryvtt.com/packages/pf2e-saves-helper
- https://foundryvtt.com/packages/damage-application
- https://foundryvtt.com/packages/simple-requests
- https://foundryvtt.com/packages/requestor
- https://foundryvtt.com/packages/movement-approval
- https://foundryvtt.com/article/users/
- https://extensions.owlbear.rodeo/forge
- https://wiki.roll20.net/Token_Features

### Pass 105 — Resolve Relay direct-payment correction

The current-package pass weakens Resolve Relay as a standalone paid product.
PF2e Toolbelt is current, free, and already gives the GM a target-aware damage
button; PF2e Saves Helper is current for Foundry v13-v14 and supplies per-target
and bulk damage controls; and Effective Tray NG is current for D&D 5e v13-v14,
using a GM-client socket relay for unowned-target damage and effects. The recent
community praise is therefore evidence that target-aware resolution is useful,
not evidence that a new paid module owns the gap.

The remaining distinction—an intent envelope with expiry, adjustment, and undo—
is technically sensible but economically weak. It adds cross-system support,
security review, and support burden while the buyer can already install a free
target-aware solution. Premium combat automation proves that some GMs pay for
larger automation or presentation suites, but it does not prove payment for a
small confirmation layer. Resolve Relay is therefore demoted to a negative
control and reusable protocol asset. Revive it only if a named system or table
has a repeated resolution failure that its current tools cannot address.

**Decision:** do not run Resolve Relay as the next empirical gate. Retain the
neutral action-envelope, stale-request, and idempotent-undo ideas for reuse, but
continue the fresh search for a payer problem with less saturated substitutes.

Sources:

- https://foundryvtt.com/packages/pf2e-toolbelt
- https://foundryvtt.com/packages/pf2e-saves-helper
- https://foundryvtt.com/packages/effectivetray-ng
- https://www.reddit.com/r/FoundryVTT/comments/1p4tvhv/pf2e_issues_applying_damage_to_correct_target/
- https://www.patreon.com/MJBVTT/posts/automated-npcs-8-158873834

### Pass 106 — fresh challenger: TableLink / Game Night Gateway

The next fresh scan moved outside combat and UI saturation to the first-mile
hosting problem: a GM owns Foundry and the world data, but the players cannot
reach the table because of port forwarding, CGNAT, firewall, changing IPs, or
an unreliable tunnel. Foundry's own current guidance describes port forwarding
as a source of nervousness or frustration, explicitly lists CGNAT and
router-behind-router failures, and points users toward VPNs, cloud hosting, or
premium partners. Recent community posts describe ISPs removing port
forwarding, players abandoning a setup after repeated connection trouble, and
groups paying for Forge or Molten to make hosting “just work.” This is a high
urgency GM/host problem with a direct payment proxy, not merely a feature wish.

The fresh product is **TableLink / Game Night Gateway**: a Windows-first local
companion that detects the running Foundry instance, checks local firewall and
server health, chooses a user-authorized direct or tunnel path, creates a
stable or clearly labeled invite URL, verifies the URL from an external probe,
and shows a live join/latency/heartbeat board. It should make the demo visible:
“Open Table” turns a local world into a tested player link, then warns the GM
before the session if the path, certificate, websocket, or process becomes
unhealthy. The product must preserve local world files and let the GM stop the
gateway at any time.

The wedge is not “another tunnel.” Foundry Tunnel Manager already wraps
providers such as Cloudflare or ngrok, and Cloudflare, ngrok, playit.gg,
Tailscale, ZeroTier, and VPNs can each solve parts of the problem. The wedge
is a game-night reliability layer: provider-neutral preflight, automatic
reconnect, external join verification, an invite that does not go stale,
player-safe diagnostics, and a clear fallback when the local Foundry process or
websocket dies. The gateway should never silently expose a different local
port, require players to install a VPN, or store provider credentials in the
world.

The payer is the self-hosting GM who values local control and wants to avoid a
recurring cloud-hosting bill, plus the GM who already pays for hosting but
wants a portable emergency fallback. Foundry's official partners establish
real category payment: Molten advertises plans starting at $4/month, while
The Forge sells a turn-key high-availability experience. That does not prove
TableLink WTP, but it creates a stronger price anchor than the prior combat
handoff candidate. Test a buy-once Windows utility at $15/$30/$49/no purchase
against Molten/The Forge and a free Cloudflare/Foundry Tunnel Manager setup;
separately test a $3/$5 monthly maintenance option because tunnel providers,
certificates, and compatibility updates create ongoing costs.

Portability is unusually strong at the transport layer. A tested local HTTP/
WebSocket gateway can later serve Roll20-like self-hosted tools, Owlbear
extensions, or other browser VTTs, but provider APIs and authentication remain
adapter-specific. The first implementation must be Foundry-only and must not
promise a universal relay. Licensing and security are central: use
user-mediated provider accounts, do not bundle or resell provider credentials,
do not inspect game payloads, default to short-lived invite tokens, require
explicit local bind/port approval, and publish an auditable local log.

**Decision:** open TableLink as the next fresh conditional challenger and move
it ahead of the demoted Resolve Relay. It has stronger urgency, a clearer payer,
an eye-catching proof moment, and a broader portability boundary. It remains
unselected until real GMs choose it over an exact free tunnel/hosting stack,
pay a non-zero price, complete a multi-session pilot, and the runtime fixture
proves no stale links, hidden exposure, duplicate gateways, silent fallback,
or loss of local data.

Sources:

- https://foundryvtt.com/article/port-forwarding/
- https://foundryvtt.com/article/hosting/
- https://foundryvtt.com/article/requirements/
- https://foundryvtt.com/article/partnerships/
- https://moltenhosting.com/
- https://forge-vtt.com/features
- https://www.reddit.com/r/FoundryVTT/comments/1v2hu69/my_provider_no_longer_supports_port_forwarding/
- https://www.reddit.com/r/FoundryVTT/comments/1swsvrr/easy_portforwarding_software/
- https://www.reddit.com/r/FoundryVTT/comments/1ql4p4e/playitgg_and_ngrok_no_longer_working/

### Pass 107 — TableLink direct-competition correction and JoinProof narrowing

The exact competitor pass closes the broad TableLink claim. Foundry Tunnel
Manager is a current, open-source Windows-capable utility with a CLI, embedded
web dashboard, native desktop release, multiple tunnel providers, start/stop
controls, logs, URL copying, live status over WebSockets, and notifications
when a tunnel dies or is about to expire. It directly addresses the proposed
“another tunnel with a dashboard” product. Cloudflare Tunnel, ngrok, playit,
Tailscale, ZeroTier, and managed hosts remain additional substitutes.

The candidate is therefore narrowed to **JoinProof / Game Night Gatekeeper**:
an optional local-first pre-session verifier that checks the actual user-facing
invite from an independent vantage, confirms that Foundry is serving the
expected setup/join surface, records a safe HTTP/WebSocket/heartbeat receipt,
detects stale or mismatched links, and tells the GM whether to send the invite.
It should not replace tunnel providers, store game payloads, or silently
change a bind, port, provider, or credential. The eye-catching moment becomes
“green: a player can join this exact link” versus “red: do not send this
invite,” not “start a tunnel.”

This correction improves the product boundary but weakens the immediate WTP
case. A same-network check can produce a false green because of NAT loopback;
an independent probe needs either a user-mediated remote player/device or a
small service, which creates recurring infrastructure, abuse, privacy, and
reliability costs. Managed hosting also removes much of the problem for buyers
willing to pay monthly. The payer hypothesis is now narrower: self-hosting
GMs with a recent failed join who still prefer local data/control and do not
want to migrate to a managed host.

Portability is stronger as a health receipt than as a gateway. A neutral
receipt can cover URL, TLS, HTTP status, websocket reachability, latency,
timestamp, and expiry without claiming that Foundry, Roll20, Owlbear, or
another VTT exposes the same session semantics. Foundry is still the first
target; a second VTT is only a read-only URL/protocol adapter after buyer and
runtime proof.

**Decision:** demote generic TableLink gateway management as saturated and
open JoinProof / Game Night Gatekeeper as the next conditional challenger.
Require a direct comparison against Foundry Tunnel Manager, the exact free
tunnel path, and a managed host; test whether a qualified GM pays for a
verified pre-session result rather than a tunnel. Reject it if a phone or
free FTM check is good enough, if buyers prefer hosting at every price, or if
independent probing cannot be delivered without collecting credentials or
game content.

Sources:

- https://github.com/sthbryan/ftm
- https://foundryvtt.com/article/port-forwarding/
- https://foundryvtt.com/article/requirements/
- https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/
- https://ngrok.com/docs/start
- https://playit.gg/
- https://tailscale.com/docs/how-to/quickstart

### Pass 108 — JoinProof external-verification correction

The external-probe pass weakens JoinProof as a standalone product. Foundry's
own tutorial already describes a remote-host yes/no connectivity check from
the invitation flow. UptimeRobot's current free tier covers HTTP, port, ping,
keyword, API, and related monitoring, while Uptime Kuma supports HTTP,
TCP, WebSocket, ping, DNS, and other monitors. A GM can also ask a player or
use a phone on cellular data to test the invite. This means a generic
“is the URL up?” service would be a thin repackaging of existing tools.

The remaining gap would have to be Foundry-semantic and materially safer than
a manual check: identify the expected world/session, distinguish a stale
tunnel from a live but wrong endpoint, exercise the actual login or user-seat
path without collecting credentials, and explain whether the invited players
can use the intended route. That requires an independent vantage, and likely
either a small service or a user-mediated remote device. It introduces
recurring infrastructure, abuse, privacy, and false-green risk without yet
showing product-specific WTP.

**Decision:** demote generic JoinProof to a negative control. Retain the
health-receipt and false-green test as reusable reliability assets, but do not
build a standalone verifier unless qualified GMs report a named failure that
Foundry's check, FTM, UptimeRobot/Uptime Kuma, and a player/phone test cannot
diagnose. Continue the fresh search for a recurring payer problem.

Sources:

- https://foundryvtt.com/article/tutorial-two/
- https://foundryvtt.com/article/tutorial/
- https://uptimerobot.com/pricing/
- https://uptimerobot.com/keyword-monitoring/
- https://github.com/louislam/uptime-kuma

### Pass 109 — fresh challenger: Session Pulse / Campaign Commitment

The next scan moved from session transport to the recurring failure that a
campaign never reaches its next session: availability polls, slow replies,
late cancellations, quorum uncertainty, and no clear decision about whether
to run, reschedule, recruit a substitute, or switch to a side activity. This
is a recurring ordinary-group problem, but it is not inherently a Foundry
problem and the current market is crowded with free or established tools.

The fresh candidate is **Session Pulse / Campaign Commitment**: a
Foundry-first companion that creates a session proposal, collects player
availability and commitment, shows a green/yellow/red quorum state, sends a
deadline/reminder, freezes the final roster, and presents a single GM action:
run, reschedule, recruit a replacement, or launch a prepared fallback scene.
The eye-catching demo is not another calendar; it is a campaign turning an
uncertain session into a clear decision before the GM spends prep time.

Direct competition is substantial. Doodle already provides group polls,
deadlines, reminders, participant tracking, calendar invites, and video-link
integration. Discord Scheduled Events provide RSVP and notifications inside
the communication space many groups already use. Warhorn serves gaming-event
registration and attendance. Foundry exposes a next-session date, while World
& Campaign Builder and SessionFlow cover session planning, live tracking, and
player-facing campaign surfaces. The narrow possible gap is consequence-aware
quorum and fallback workflow, not scheduling itself.

The payer is more likely to be a GM running a recurring campaign, paid GM, or
organized-play coordinator than an individual player. Portability is strong
at the event/attendance contract layer because it can remain outside system
rules, but integrations and notifications are platform-specific. Privacy and
consent matter because attendance data and player contact routes should not be
copied into a world or exposed without explicit participant control.

**Decision:** open Session Pulse as an eighth conditional challenger, not a
selected product. Test it against Doodle, Discord Events, Warhorn, Foundry's
next-session field, and the GM's actual group workflow. Reject it if a free
poll plus Discord is good enough, if buyers only want a calendar, or if the
fallback action requires a large external-service and account-integration
surface without a non-zero price.

Sources:

- https://help.doodle.com/en/articles/9457353-how-do-i-create-a-group-poll
- https://doodle.com/en/product/polls/
- https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events
- https://warhorn.net/

### Pass 165 — Injector v2 and creation-time reduction

The supplied **Dicebox Injector v2** document contributes a reusable transport
pattern rather than a Foundry-specific content model. Its strongest choices are
separating packaging, transport framing, reconstruction/verification, and the
application adapter; using a manifest plus per-frame and whole-object SHA-256;
accepting duplicate and out-of-order frames; persisting incomplete transfers;
and refusing materialization until the complete object is verified. Those
contracts are directly useful for a Playability Budget package and for future
map/content tooling.

The document also makes an important boundary explicit: Base64 is text
encoding, not compression, and expands the payload. Compression belongs before
framing. Current browser primitives provide gzip/deflate streams without a
bundled compression library, while Web Crypto provides SHA-256 but requires the
input to be available to the digest call. Large transfers should therefore run
in a Worker, use bounded staging, and retain frame hashes plus a final digest.
Already-compressed WebP/WebM/OGG/MP4 assets should not be recompressed merely
to reduce the transport envelope.

The fastest architecture is not “paste a larger macro.” It is:

```text
local packer
  -> manifest + compressed JSON/package + frames
  -> small Foundry receiver module or short bootstrap macro
  -> IndexedDB staging and resumable status
  -> frame and whole-package verification
  -> Foundry FilePicker.upload for files
  -> Adventure/Compendium/document import for structured content
  -> read-back receipt and rollback/abort record
```

Foundry's current Adventure Document workflow is a major creation-time
accelerator: Actors, Scenes, Items, Journals, RollTables, Cards, and Playlists
can be bundled with links preserved and imported through a standard interface.
The Adventure Import API exposes a planned `toCreate`/`toUpdate` set, which is
useful for preview and conflict reporting. Media is not embedded in the
Adventure itself, however; it must remain in the module or be uploaded/staged
separately. Re-import can overwrite existing content, so the receiver must use
a package digest, target scope, preview, backup/rollback, and explicit import
approval.

The map-specific optimization is to keep binary maps outside scene JSON. A
scene specification should contain stable asset IDs and paths, while the
packer stores each file once by SHA-256. Identical maps, tokens, and audio can
be deduplicated. Later updates should send a base-digest-checked delta or
typed operation list rather than regenerate the whole scene. A JSON Merge Patch
or a stricter domain patch can reduce repeated authoring payloads, but it must
be rejected when the receiver's base digest differs.

The receiver should remain a small, boring adapter. It should not contain the
compiler, map authoring logic, or arbitrary script execution. The package
format should be transport-agnostic; the Foundry adapter should only stage
files, call supported import/upload APIs, and produce a receipt. Other VTTs can
consume the same manifest and files manually without claiming runtime parity.

**Creation-time recommendations:**

1. Build one deterministic local packer that emits a package directory or
   archive, canonical JSON, stable IDs, a manifest, and frames.
2. Use gzip/deflate only for JSON and textual scene data; bypass compression
   for already-compressed media.
3. Use a Worker for compression, hashing, Base64 framing, and reassembly so the
   Foundry UI does not freeze.
4. Use IndexedDB only as resumable staging; it is not the authoritative source
   because browsers can evict or clear it.
5. Make every operation previewable, idempotent, scope-limited, and keyed to an
   expected base digest.
6. Prefer an Adventure/Compendium import for structured documents and
   `FilePicker.upload` for verified files; do not create thousands of documents
   from an injected macro.
7. Keep the first Playability Budget release read-only. Its output can recommend
   Media Optimizer or other tools rather than duplicating every converter.

**Time impact:** the existing Injector contracts and DiceBox asset/receipt
types reduce the first implementation substantially. A focused Foundry v14
receiver plus read-only playability audit is approximately **2–3 weeks
full-time** (or **4–6 weeks part-time**) if the existing code is reused. Adding
safe image variants is another **1–2 weeks**. Adding audio/video processing,
multi-browser/GPU fixtures, rollback UX, and a second-VTT adapter is another
**3–6 weeks**. The injector bypasses a single macro/text limit, but it does not
bypass server upload limits, browser memory, GPU texture limits, network
bandwidth, or a VTT's own import rules.

**Decision:** adopt Injector v2's core transport/state/verification contracts
as reusable infrastructure, but do not make macro injection the primary
product path. Start with a package receiver plus read-only audit and Adventure/
file staging. Keep full optimization and cross-VTT runtime support as later
gates.

Sources:

- User-provided reference: `Dicebox Injector v2 — How It Works`
- https://foundryvtt.com/article/adventure/
- https://foundryvtt.com/api/v14/interfaces/foundry.documents.types.AdventureImportData.html
- https://foundryvtt.com/api/classes/foundry.applications.apps.FilePicker.html
- https://foundryvtt.com/article/packaging-guide/
- https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
- https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- https://www.rfc-editor.org/info/rfc7396
- https://foundryvtt.com/article/tutorial/
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/packages/sessionflow

### Pass 166 — Startup Budget and map-load profiling architecture

The first Star*Tup technical decomposition separates module startup from map
playability. Foundry's v14 API exposes `init`, `setup`, and `ready` lifecycle
hooks; `ready` runs after `setup`, while `Game.setupGame` initializes Documents,
UI applications, and Canvas. Module activation or deactivation reloads the
world, so a profile must be applied at a controlled reload boundary rather
than by silently changing the live session.

The browser already provides a useful measurement layer. User Timing marks and
measures can label Star*Tup phases; `PerformanceObserver` can consume entries
as they are recorded; resource timings can describe script, image, audio, and
video fetches; and long-task entries can expose main-thread blocking. Long-task
support is not universal, so the receipt must report unsupported metrics rather
than treat missing data as zero. Chrome DevTools can visualize custom timings,
network work, main-thread work, and GPU activity, but Star*Tup should export a
small self-contained receipt instead of requiring the user to operate DevTools.

The four measurements should be explicit:

```text
navigation -> documents/world ready -> first usable UI -> first usable map
```

Each run should record the Foundry version, system, world, active module IDs and
versions, browser/client class, GM/player role, scene ID, asset manifest, cold
or warm state, and an evidence confidence level. A repeated exact-stack run
should compare setup/ready duration, resource transfer, long tasks, scene
activation, first canvas render, and first interactive input. Asset bytes alone
cannot prove that a module hook, document construction, shader compilation, or
GPU limit was the cause.

Per-module attribution is the main technical boundary. A generic observer can
see phases and scripts, but it cannot safely assign every synchronous operation
to a third-party package. Star*Tup should therefore use three evidence levels:
phase-level browser/runtime timings; controlled module-set A/B or bisection
runs; and exact module adapters only for code we own or explicitly support.
The report should call a suspected contributor a correlation, not a proof.

The safest optimization loop is:

1. capture a baseline for the exact GM and player stack;
2. create dependency-aware `Prep`, `GM Session`, `Player Session`, and `Safe`
   profiles;
3. apply one reversible profile at the next reload boundary;
4. rerun the same cold/warm fixture and compare first-interactive and
   first-usable-map timings;
5. preserve the original module/settings snapshot and emit a rollback receipt.

The existing DiceBox media registry and asset-attestation contracts are useful
foundations for asset IDs, byte hashes, dimensions, variant links, and
read-only verification. Hashing, compression, framing, and large manifest work
should run in a Worker so the Star*Tup panel does not compete with Foundry's
main thread. IndexedDB or CacheStorage can stage reusable data, but neither is
the sole authority: browser storage can be cleared, evicted, unavailable in
some contexts, or stale after a module/world update. Cache keys must include a
content hash and the exact target/profile boundary.

The implementation must not rewrite arbitrary third-party modules, inject late
hooks to bypass lifecycle order, edit the world database directly, or claim
that a smaller map file fixes module startup. A public MVP can be a read-only
profiler plus reversible profile suggestions; staged asset variants and
verified package transport come afterward. The smallest credible technical
slice is approximately **5–8 working days** for the profiler/receipt, another
**5–8 working days** for dependency-aware profiles and rollback, and **3–5
working days** for the first asset-budget integration. A practical freeware
alpha remains approximately **3–4 full-time weeks**, assuming reuse of the
existing registry, attestation, fixture, and receipt code.

**Decision:** adopt Startup Budget / Module Load Profiler as Star*Tup's first
technical slice. Measure before optimizing; keep attribution confidence and
unsupported states visible; make profile changes reversible; and defer generic
third-party lazy loading until exact adapters and runtime evidence exist.

Sources:

- https://foundryvtt.com/api/modules/hookEvents.html
- https://foundryvtt.com/api/classes/foundry.Game.html
- https://foundryvtt.com/article/modules/
- https://developer.mozilla.org/en-US/docs/Web/API/Performance_API
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
- https://developer.chrome.com/docs/devtools/performance/reference
- https://developer.chrome.com/docs/devtools/performance/extension

### Pass 169 — cross-VTT protocol and adapter boundary

Portability is practical only if Star*Tup separates portable evidence from
platform actions. Foundry packages use a `module.json` manifest with version,
compatibility, dependencies, scripts, styles, packs, and optional socket
capabilities. Foundry's packaging model is therefore a natural first adapter,
but the module lifecycle and world authority remain Foundry-specific.

Owlbear Rodeo exposes extension metadata on scene items and players, with a
recommendation to namespace keys to avoid collisions. Its assets API lets an
extension upload images into the current user's storage. That makes an
Owlbear adapter plausible for asset manifests, scene-role metadata, and local
receipts, but it does not establish equivalent Foundry module activation,
world-setting, or lifecycle timing.

Roll20's official Mod Scripts surface provides a separate sandboxed API for
scripts, events, objects, chat, and utilities. It is useful as a future
adapter for a bounded readiness receipt or content metadata, but it is not a
drop-in browser worker or local filesystem surface. Star*Tup must not assume
that a Foundry file path, module manifest, socket, or world setting exists on
another VTT.

The portable core should be deliberately boring:

```text
AssetManifest     hashes, dimensions, codecs, roles, variants, paths
ProfileIntent     client budget, scene policy, requested capability
TimingReceipt     stage durations, resource summary, client class, confidence
RollbackReceipt   base identity, diff, restore result, unsupported states
CapabilityReport  adapter/version, supported fields, refused operations
```

Each adapter translates these records into its own supported APIs and declares
what it cannot do. The Foundry adapter can implement module lifecycle marks,
world/client profile handling, FilePicker staging, and Adventure/Compendium
paths. An Owlbear adapter can use namespaced metadata and user asset uploads.
A Roll20 adapter may begin with a read-only script/API receipt and manifest
display. None should claim cross-VTT runtime parity until the same fixture is
run on that platform.

This boundary reduces creation time: one schema package, one hashing/receipt
worker, one fixture generator, and separate small adapters. It also reduces
support risk because unsupported operations are explicit rather than hidden
fallbacks. The first portable artifact should be exportable JSON plus a human
readable report; automatic import or optimization is platform-specific and
later.

**Decision:** keep the Star*Tup core VTT-neutral at the manifest, profile,
receipt, capability, and rollback-contract layers. Implement Foundry first;
then validate one narrow read-only Owlbear or Roll20 adapter. Do not promise
cross-VTT media conversion, module control, or identical profiling behavior.

Sources:

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/article/packaging-guide/
- https://foundryvtt.com/api/interfaces/foundry.packages.types.ModuleManifestData.html
- https://docs.owlbear.rodeo/extensions/reference/metadata/
- https://docs.owlbear.rodeo/extensions/apis/assets/
- https://help.roll20.net/hc/en-us/sections/36128191596439-Mod-Scripts-API

### Pass 170 — Star*Tup M0–M2 implementation slice

The research-backed project was created as a standalone Windows-safe package
at `C:\Users\rujie\Documents\ChatGPT\Star_Tup` so it does not mix new work
into the heavily modified DiceBox implementation checkout. The first slice has
no external runtime dependencies and now implements deterministic benchmark
receipts, Foundry lifecycle timing hooks, separate client/world profile
contracts, dependency-aware diffs, stale-base rejection, and pure rollback
receipts.

The test suite intentionally uses fake hooks and pure snapshots. It proves the
contracts and safety boundary, not live Foundry compatibility. The next
implementation gate is an exact disposable Foundry v14.367 fixture with a GM
and player client; no live-world profile application, arbitrary module loading,
asset upload, or browser control is included yet.

**Decision:** accept the standalone M0–M2 local slice as the project baseline;
keep live integration blocked until the exact disposable fixture produces a
runtime receipt.

Sources:

- `C:\Users\rujie\Documents\ChatGPT\Star_Tup\docs\M0-M2-IMPLEMENTATION-RECEIPT.md`
- `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\docs\STARTUP-TECHNICAL-ROADMAP.md`

### Pass 168 — profile persistence, rollback, and scope separation

The rollback design must respect Foundry's setting scopes. Client settings are
device/browser-specific, User settings are per user in one world, and World
settings apply to every connected client. Module activation is a GM-controlled
world operation and saving module changes reloads the world. Star*Tup should
therefore never represent “performance profile” as one global switch.

Use two related artifacts:

```text
ClientProfile: browser/device + client settings + asset target budget
WorldProfile: world/module activation + world settings + dependency closure
```

The client profile can describe local rendering, cache, preload, and reduced
media choices without changing another player's settings. The world profile
must be GM-owned, dependency-aware, and applied only at a reload or disposable
clone boundary. A player-facing recommendation can request a client profile;
it must not grant permission to disable a world module or change shared data.

Foundry's package backups and snapshots are useful rollback anchors, but the
official backup guidance warns that snapshots do not include media stored
outside the package folders. Moving assets can also leave restored documents
with broken links. Star*Tup should keep a separate asset manifest containing
source/derivative hashes, relative paths, roles, and the profile that selected
each variant. A rollback receipt is incomplete unless it verifies both world
configuration and referenced assets.

The safest profile transaction is declarative and base-checked:

```text
capture base identity
  -> write profile proposal and dependency explanation
  -> create package/world backup or disposable clone
  -> apply only supported settings/module changes
  -> reload and reread authoritative state
  -> benchmark
  -> commit receipt or restore previous profile
```

If the base hash, Foundry version, system version, module versions, or asset
manifest changes, the proposal becomes stale and must stop for review. A failed
reload or unknown result is not permission to retry blindly. The profile store
should retain the before state, requested delta, observed after state, rollback
result, and any unsupported or foreign fields it preserved.

For creation-time reduction, the local companion can generate profile diffs and
compare disposable copies without editing a live world. The in-world module
should expose read-only status and user-scoped controls; it should not copy a
world database while Foundry is running, because Foundry warns that active world
databases change during operation. Cross-VTT portability belongs at the neutral
profile/receipt layer; application of settings and module dependencies remains
adapter-specific.

**Decision:** implement profile persistence as immutable snapshots plus explicit
diffs, with separate client and world scopes, stale-base detection, asset
manifest coverage, and verified rollback. Do not auto-edit live world files or
promise a rollback based only on Foundry's package snapshot.

Sources:

- https://foundryvtt.com/article/settings/
- https://foundryvtt.com/article/modules/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/user-data-backup/
- https://foundryvtt.com/article/game-worlds/
- https://foundryvtt.com/api/classes/foundry.documents.collections.WorldSettings.html

### Pass 167 — asset derivatives, cache identity, and preload strategy

The asset layer has a concrete optimization path, but it must distinguish
network transfer, browser decode, GPU texture pressure, and Foundry's own scene
behavior. Foundry recommends WebP for image quality-to-size tradeoffs, WebM
for many video cases, and OGG for audio; it also notes that compression can
shift work onto the client CPU and that scene media is distributed to connected
users. Foundry already supports preloading a scene's image and video assets in
the background, so Star*Tup should not sell “preload exists” as a new feature.

The reusable technique is a content-addressed derivative manifest:

```text
source hash + byte length + dimensions + codec
  -> approved derivative(s) + quality/settings + target profile
  -> fidelity check + rollback link + cache identity
```

The existing DiceBox media registry already models stable asset IDs, SHA-256,
dimensions, and variants. Star*Tup can add target profiles such as
`map-background`, `tile`, `token`, `thumbnail`, and `low-bandwidth` without
copying or overwriting the source. Derivative selection should be based on
declared client/display budgets and observed asset role, not a universal
“smallest file” rule. WebP or WebM can reduce transfer while increasing client
decode or GPU work, so the receipt must show both byte and decode/render risk.

Preload should be a policy layer over Foundry's existing scene preload path:
preload the next likely scene or a declared session bundle, cap concurrent
work, expose progress and failures, and stop when the client budget is full.
Do not preload every campaign asset or silently pull publisher content. A
player with a weak connection should receive the declared fallback variant or
an explicit unsupported state rather than wait indefinitely.

Browser CacheStorage and IndexedDB can retain staged responses and manifests,
but browser storage is best-effort, quota-bound, and evictable. Every cache
entry therefore needs content hash, Foundry/system/world identity, scene/asset
role, target client profile, and derivative settings. On a hash or profile
mismatch, Star*Tup must treat the entry as a miss. `navigator.storage.estimate`
can inform a budget, but it is only an estimate and cannot certify that a later
scene will fit.

Image analysis and derivative generation can run in a Worker using
`createImageBitmap` with resize options where supported. The worker should
return dimensions, decode errors, output bytes, and a digest; it must not
silently publish a derivative. A fallback path is required for unsupported
formats and for browsers where the desired worker primitive is unavailable.

**Decision:** make content-addressed derivatives, explicit cache identity,
bounded preload policy, and fidelity/rollback receipts the Star*Tup asset
technique. Do not duplicate a generic media converter or preload module. The
first test is a synthetic map pack with one large background, many tiles,
animated media, duplicate files, missing paths, low-bandwidth mode, and a
second client with a smaller GPU budget.

Sources:

- https://foundryvtt.com/article/media/
- https://foundryvtt.com/article/asset-management/
- https://foundryvtt.com/article/scenes/
- https://foundryvtt.com/article/file-picker/
- https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/createImageBitmap
- https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- https://developer.mozilla.org/en-US/docs/Web/API/Storage_API

### Pass 110 — Session Pulse payer and price correction

The payment scan finds a meaningful category anchor but not product-specific
conversion. Doodle has a free plan and sells Professional at roughly $15 per
month in the United States, with deadlines, automatic reminders, participant
tracking, hidden participant details, calendar synchronization, and other
coordination features. This proves that some organizers pay to reduce
coordination friction. It does not prove that an ordinary D&D GM will pay for
Session Pulse, because a free Doodle poll, Discord Scheduled Event, or group
message may be enough.

The offer therefore cannot be “a better scheduling poll.” The only plausible
paid promise is avoiding a costly failure: the GM spends hours preparing, the
session falls below quorum at the last minute, and the product converts that
uncertainty into a documented run, reschedule, recruit, or fallback decision.
The strongest payer segment is a paid GM, organized-play coordinator, or
recurring campaign GM with repeated prep loss; ordinary groups remain the
required control rather than an assumed buyer.

The product boundary should be local-first attendance state plus optional
user-mediated notification adapters. A one-time Foundry utility can retain a
consent-safe roster and decision record without hosting contacts. Reminders or
Discord/calendar integrations introduce ongoing service and API costs, so a
separate $3/$5 maintenance choice is required. The portable artifact remains
an event/attendance contract, not a universal calendar or identity system.

**Decision:** retain Session Pulse as a conditional eighth challenger, but do
not promote it or infer WTP from Doodle's subscription. Require a named
recent prep-loss incident, exact-stack preference, a non-zero price, three
real session cycles, privacy/consent proof, and a reason-coded rejection when
free coordination is sufficient. If ordinary groups do not pay, report the
paid-GM/organized-play segment separately rather than broadening the claim.

Sources:

- https://help.doodle.com/en/articles/9457366-how-much-does-doodle-cost
- https://help.doodle.com/en/articles/10448913-doodle-free-and-doodle-professional-differences-at-a-glance
- https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events
- https://warhorn.net/

### Pass 111 — recurring GM-prep scan and evidence-weighted rerank

The fresh broad scan found a stronger recurring pain signal than ordinary
scheduling: recent community reports describe four to five hours of prep for
a three-hour session, heavy context switching across notes, NPCs, promises,
and Discord, and repeated frustration when players ignore carefully prepared
material. These are useful buyer-recruiting signals, not conversion evidence.

The broad product category is already crowded. SessionFlow is a current
premium GM/player workspace with campaign beats, live widgets, player panels,
quick scenes, and reusable templates. World & Campaign Builder covers session
planning and live tracking, while current AI/prep tools and Foundry's growing
premium catalog cover additional preparation workflows. The remaining gap is
not “another prep canvas” or “generate more content.” A plausible narrow
direction would have to reuse discarded prep safely when the party pivots,
without demanding a new rules engine or publisher-content copy.

That fresh signal changes the ranking but not the product decision. Player
Compass remains the first empirical gate because it combines recurring use
with a visible player-UX payment category. VTT BridgeCheck remains second for
deadline urgency and migration payment proxy. World Doctor remains third for
long-running GM incident value. Adventure Navigator and Rapid Encounter Board
remain conditional. TableStart remains a narrow onboarding gate. Session Pulse
stays eighth and conditional because Doodle payment is real category evidence
but free coordination is a strong ordinary-group control. Generic prep
workspace, generic AI prep, and generic session scheduling remain negative
controls.

**Decision:** do not open a new generic prep product from this scan. Reuse
Campaign Helper preparation, receipt, and fallback concepts only if a named
buyer test identifies a repeated pivot or prep-loss failure that the exact
current stack cannot solve. Keep implementation paused until a candidate
passes price, pilot, runtime, licensing, and portability gates.

Sources:

- https://www.reddit.com/r/DnD/comments/1sszaa3/how_long_does_your_session_prep_actually_take_you/
- https://www.reddit.com/r/DnD/comments/1sk5j4o/why_do_we_spend_so_much_time_prepping_the_things/
- https://www.reddit.com/r/DungeonMasters/comments/1j7ek3w/just_me_who_hates_session_prep/
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/packages/rpgm-forge
- https://foundryvtt.com/article/premium-content/

### Pass 112 — Player Compass technical, licensing, and portability correction

The current-package check narrows Player Compass again. Foundry Navigator is
already a current keyboard-first, screen-reader-friendly D&D 5e module for
Foundry v13-v14. Its published feature surface includes sheet navigation,
attack/use/roll access, target selection, damage and healing flows, GM-mediated
application for unowned hostile tokens, spoken feedback, low-resolution
handling, and focus recovery. Token Action HUD D&D5e already supplies direct
rolls and item use from a repositionable action HUD, and PF2e HUD is current on
Foundry v14 for Pathfinder 2e and Starfinder 2e. The broad promise “make the
right action easy to find” is therefore closed by strong, actively maintained
competitors.

The remaining Player Compass hypothesis is smaller: a read-only, zero-setup
context explanation layer that tells a player what is relevant now, why it is
available, and where the native action lives, while preserving the native sheet
and the exact HUD stack as escape hatches. It must not become another action bar,
rules engine, sheet replacement, or hidden mutation layer. The technical
boundary should be a per-system capability adapter and neutral manifest, not a
universal interpretation of D&D 5e and PF2e. D&D5e and PF2e expose materially
different data, action semantics, permissions, and content/licensing surfaces;
the adapter must ask each system what it can safely describe rather than copy
or infer rules.

The licensing pass is favorable only for a narrow implementation. The D&D5e
system repository identifies its software component as MIT-licensed while
separating SRD and asset terms; PF2e describes Apache-2.0 code alongside
separate content, art, and Foundry platform terms. That does not authorize
copying system data, publisher art, compendium text, or competitor code into a
commercial module. A safe first slice should read user-owned actors and
system-provided APIs at runtime, store only capability IDs and provenance, and
ship no copied rules or art. Exact package and asset audits remain mandatory.

Portability is plausible only at the manifest and intent level. A record such as
capability ID, user-visible label, context, visibility, prerequisite, source,
and user-invoked action can later be mapped to another browser VTT. The actual
action semantics, permission checks, sheet controls, and accessibility behavior
remain Foundry/system adapters. A second VTT is therefore a later read-only
proof point, not a launch promise.

**Decision:** keep Player Compass as the first empirical gate, but narrow the
offer to zero-setup, read-only context clarity and accessibility-safe
orientation. Require a real D&D5e/PF2e fixture covering keyboard, screen
reader, low resolution, focus recovery, reconnect, permissions, and native-sheet
escape. Require an exact current-HUD comparison, package/license audit, and a
second-VTT manifest experiment only after Foundry evidence. Reject the product
if buyers only want direct action access, if the feature needs copied rules or
hidden writes, or if an incumbent plus a short orientation is good enough.

Sources:

- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/token-action-hud-dnd5e
- https://foundryvtt.com/packages/pf2e-hud
- https://github.com/foundryvtt/dnd5e
- https://github.com/foundryvtt/pf2e
- https://github.com/foundryvtt/pf2e/wiki/Creating-a-PF2e-Content-Module

### Pass 113 — fresh challenger: Campaign Anchor / Version Harbor

The next fresh scan found a different consumer problem from Player Compass:
long-running GMs are increasingly treating Foundry upgrades as a campaign
choice rather than a routine update. A recent high-engagement community thread
describes breaking API changes, modules and systems that lag behind, paid
content whose future support is uncertain, users maintaining several Foundry
versions, and players leaving or refusing to buy more content because the
maintenance burden erodes trust. These reports are not conversion data, but
they describe a repeated, high-consequence buyer pain for persistent campaigns.

The fresh product is **Campaign Anchor / Version Harbor**: a local-first
campaign environment manager that records the exact Foundry build, game system,
module versions, settings snapshot, and launch instructions for each world;
creates a disposable copy before an upgrade; runs a smoke test on the copy;
keeps the known-good environment launchable; and makes rollback or “launch
campaign on its pinned version” a visible action. The eye-catching demo is
“Update Foundry without risking tonight’s campaign”: one click creates a
rehearsal copy, shows the changed package set and risk receipt, and leaves the
old campaign runnable. It must never silently migrate the live world or overwrite
the known-good environment.

The buyer is not a module creator. It is the self-hosting GM with a long-running
or paid campaign, expensive premium content, multiple worlds, or a recent
upgrade near-miss. Ordinary one-shot users and GMs happy to use managed hosting
are negative controls. A buy-once Windows utility has a credible price test at
$15/$30/$49; a separate maintenance choice is needed only if the product
promises ongoing compatibility intelligence or package downloads.

The direct-competition correction is substantial. Foundry's official
installation guidance already supports older versions, Windows portable builds,
multiple independent User Data folders, and simultaneous versions with separate
ports. The Forge's Game Manager supports different Foundry versions per game,
and Molten offers managed hosting with automated backups. Find the Culprit,
Quick Module Enable, Module Management+, and Foundry's own compatibility and
locking behavior cover pieces of diagnosis and package control. Campaign Anchor
cannot sell “install another Foundry version” or “show compatibility warnings.”
Its remaining wedge is a local campaign-specific environment lockfile plus
pre-upgrade clone, known-good launch, deterministic rollback receipt, and a
single “what changed / can I play tonight?” answer for self-hosters.

Portability is weak and must be described honestly. The lockfile concept can
later map to other self-hosted VTTs, but the Foundry world format, migration
behavior, package manifests, system data, license terms, and server launch
model are platform-specific. The first product should be Foundry-only; a second
VTT is a later neutral environment-receipt experiment, not a feature-parity
promise. Do not bundle Foundry or third-party package binaries, bypass license
checks, or copy user worlds to a service.

**Decision:** open Campaign Anchor / Version Harbor as a fresh conditional
challenger and run a direct buyer test against manual portable installs, the
exact current world backup routine, The Forge, and Molten. It may outrank
Player Compass if qualified self-hosting GMs choose it at a non-zero price and
complete a multi-session pilot, but it is not selected now. Reject it if a
manual portable setup or managed host is good enough, if the product needs to
maintain a universal compatibility database to seem useful, or if rollback
cannot be proven without live-world mutation.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1wk6be3/foundrys_api_changes_are_strangling_its_own/
- https://foundryvtt.com/article/installation/
- https://foundryvtt.com/article/modules/
- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/packages/find-the-culprit
- https://foundryvtt.com/packages/quick-module-enable
- https://foundryvtt.com/packages/module-credits
- https://blog.forge-vtt.com/the-forges-2025-and-beyond/
- https://moltenhosting.com/

### Pass 114 — Campaign Anchor direct-competition correction

The exact substitute pass closes more of Campaign Anchor than the first scan
suggested. Foundry's current backup system already supports individual package
backups for worlds, systems, and modules; full snapshots; automatic backup before
world migration; restore of a selected package or snapshot; notes and storage
metadata; and compatibility-risk information. Foundry's official installation
guidance also supports older versions, Windows portable builds, separate User
Data folders, and multiple simultaneous installations. A standalone product
cannot charge simply for “make a backup,” “pin a version,” or “run an older
Foundry.”

The remaining distinction is narrower but technically meaningful: Campaign
Anchor could combine the package state, world state, launch path, and actual
pre-upgrade rehearsal into one campaign-specific receipt that answers “will this
world open and can I play tonight?” It could preserve a known-good environment
without requiring the GM to manually coordinate separate portable folders and
package restores. However, this overlaps the existing World Doctor hypothesis,
The Forge's per-game version management, managed-host backups, and the GM's own
manual snapshot routine. The receipt would need to prove a decision or recovery
that those exact controls cannot provide.

The buyer signal also needs correction. The community pain is strong, but core
backups and hosting are already paid or included substitutes. A self-hosting GM
may pay for a bounded one-time workflow, but the category evidence does not show
that they will pay for another backup/launcher. Portability remains weak because
the package/world migration model is Foundry-specific; an environment receipt
could be a reusable protocol asset, not a credible cross-VTT launch promise.

**Decision:** demote Campaign Anchor / Version Harbor from a likely second gate to
a conditional comparison arm and reusable implementation asset. Do not build a
generic version manager, backup browser, or launcher. Reopen only when a
qualified self-hosting GM reports a repeated “known-good world will not launch”
or “upgrade rehearsal cannot answer play-tonight” failure that survives Foundry
snapshots, portable installs, The Forge/Molten, and the existing World Doctor
test. Continue the fresh search for a payer problem with less direct core
coverage.

Sources:

- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/installation/
- https://foundryvtt.com/article/user-data-backup/
- https://foundryvtt.com/packages/sephrals-content-backup-restore
- https://foundryvtt.com/packages/find-the-culprit
- https://blog.forge-vtt.com/the-forges-2025-and-beyond/
- https://moltenhosting.com/

### Pass 115 — fresh challenger: Between Sessions / Campaign Projects

The next fresh scan moved back into ordinary player participation rather than
runtime maintenance. Recent community requests ask for expanded Bastion
mechanics and for a simple way to make the weeks between sessions matter. The
official D&D5e ecosystem gives this category real visibility: the Foundry
Dungeon Master's Guide content describes Bastions as a player-owned shared
storytelling space with orders, research, crafting, facilities, and defenses.
That is category demand and an official content/payment anchor, not proof that a
new management utility will sell.

The fresh product hypothesis is **Between Sessions / Campaign Projects**: a
player-first, asynchronous board where a GM defines stations or projects and
players submit downtime actions, costs, checks, collaborators, and desired
rewards. The GM receives a compact approval/resolution queue, while the next
session opens with a receipt of completed, blocked, or pending projects. The
eye-catching demo is “the party finishes a session, each player starts a
project, and the campaign visibly advances before next week without a Discord
spreadsheet.” The product must remain GM-authorized and must not silently change
actors, inventory, currency, or rules state.

The payer would be a GM running a weekly or biweekly D&D5e 2024 campaign, a
paid GM, or a group that already uses downtime/Bastions. The player benefit is
recurring engagement, but the GM controls the purchase. One-time pricing can be
tested at $10/$20/$39/no purchase; a subscription is not assumed. Ordinary
campaigns that do not use downtime and one-shots are negative controls.

The fresh category is already highly active. Indy Ventures automates shared
Bastions, ventures, profit/loss, boons, and treasury. Downtime 5e provides
progress bars for individual and world downtime. Downtime Manager provides
stations, individual and collaborative projects, costs, checks, progress, and
rewards. Yugen Downtime, Universal Downtime Engine, and Morelord Downtime add
recent project, training, crafting, research, marketplace, and system-adapter
surfaces. This is not an empty “add downtime” gap.

The only plausible wedge is the workflow around the projects: player-first
submission, GM batch approval, clear deadlines, auditable receipts, conflict
resolution, and a portable project-state contract that can be adapted to other
VTTs. Even that overlaps the current modules and official Bastion UI. Licensing
and content boundaries are manageable only if the product stores user-authored
project state and references user-owned items, rather than copying D&D text,
publisher content, or competitor compendia.

**Decision:** keep Between Sessions / Campaign Projects as a parked comparison
arm, not a selected product or current implementation target. Reopen it only if
weekly GMs name a repeated submission/approval/state-reconciliation failure that
Indy Ventures, Downtime Manager, Downtime 5e, Yugen, Universal Downtime Engine,
Morelord, and a shared spreadsheet do not solve, then choose a non-zero price
and complete a multi-session pilot. Retain the project-state, approval-queue,
receipt, and provenance concepts as reusable Campaign Helper assets. Continue
the search for a broader payer problem.

Sources:

- https://foundryvtt.com/packages/dnd-dungeon-masters-guide
- https://foundryvtt.com/packages/indy-ventures
- https://foundryvtt.com/packages/downtime-dnd5e
- https://foundryvtt.com/packages/downtime-manager
- https://foundryvtt.com/packages/yugen-downtime
- https://foundryvtt.com/packages/thefehrs-learning-manager
- https://foundryvtt.com/packages/morelord-downtime
- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_what_module_would_you_like_to_see/

### Pass 116 — fresh challenger: Table Pact / Campaign Fit

The next fresh scan moved upstream from scheduling and continuity to a common
campaign failure: people sit down expecting different games. Recent high-
engagement discussions repeatedly describe session zero as the place to align
tone, campaign premise, boundaries, PvP, house rules, attendance, and what
players are actually expected to do. Separate recent discussions describe
groups collapsing when communication, attendance, and expectations drift. This
is a meaningful ordinary-table problem, but it is not yet a purchase signal.

The fresh product hypothesis is **Table Pact / Campaign Fit**: a private,
player-by-player session-zero flow that collects play-style preferences,
content boundaries, campaign buy-in, communication norms, and practical
commitments, then gives the GM only an aggregate conflict/unanswered view.
The group can acknowledge a versioned pact, revisit it when the campaign
changes, and see the agreed operating rules without exposing another player's
private answers. It is not a personality score, compatibility ranking, or
forced-consensus tool. The eye-catching demo is “five minutes before session
one, the GM sees the two unresolved mismatches that would otherwise derail the
campaign.”

The likely payer is a GM running a new group, a paid/convention/organized-play
table, or a campaign with new and returning players. Established friend groups
that already know their boundaries are an explicit negative control. Test a
one-time $5/$10/$20/no-purchase offer; do not assume a subscription for a
mostly session-zero workflow. A later recurring value proposition would need
versioned re-checks after a player joins, the campaign tone changes, or a
boundary is revised.

The direct competition is fragmented rather than absent. Foundry's current
Safety Tools module covers the standard safety cards; Safety and Communication
adds current X/N/O signals, hand-raising, AFK/Open Door, and an editable
reference drawer; Consent Form covers player-defined acceptable, discuss-first,
and forbidden themes. External session-zero checklists, shared documents,
forms, and a direct conversation are strong substitutes. None of those package
descriptions establishes a privacy-preserving aggregate of expectation
mismatch plus a versioned, acknowledged table agreement, but that absence does
not prove that buyers want it inside Foundry.

The main risks are social and privacy-related, not just technical. Raw answers
must not be visible to the GM or other players unless the player explicitly
shares them; the product must never label a person as a “bad fit”; and a GM
must be able to use it as a lightweight briefing rather than a mandatory
questionnaire. Foundry is a plausible first implementation, with an external
or second-VTT contract limited to consent-safe preference categories, pact
version, acknowledgements, and unresolved aggregate flags.

**Decision:** keep Table Pact as a conditional fresh challenger, not a selected
product. Run it only with new, paid, convention, or organized-play tables that
can name a real mismatch or boundary failure. It advances only if buyers
prefer it over their current checklist/form/conversation, choose a non-zero
price, and complete a pilot without privacy or trust objections. Retain the
versioned pact, private-answer, aggregate-conflict, and acknowledgement
patterns as reusable Campaign Helper assets. Continue the wide search; Dungeon
Master's Forge remains backburnered and untouched.

Sources:

- https://www.reddit.com/r/DnD/comments/1vj6451/session_zero/
- https://www.reddit.com/r/dndnext/comments/1tiogjl/what_does_your_session_zero_checklist_look_like/
- https://www.reddit.com/r/DnD/comments/1ubpd08/whats_the_biggest_reason_a_dnd_group_doesnt_work/
- https://foundryvtt.com/packages/safety-tools
- https://foundryvtt.com/packages/safety-and-communication
- https://foundryvtt.com/packages/consent-form

### Pass 117 — fresh challenger: Resource Steward / Ammunition and Supply Tension

The next scan tested a mundane but recurring player problem: tracking arrows,
bullets, torches, rations, and other expendable resources. The pain is real,
but the buyer signal is inverted. Recent discussions describe ammunition
tracking as cumbersome, easy to hand-wave, or useful only in survival-heavy
campaigns. A fresh product hypothesis would be **Resource Steward**: a
system-neutral resource ledger that consumes supplies from an action, handles
recovery or loss at a configurable boundary, shows a dramatic low-resource
state, and leaves an auditable receipt instead of asking players to maintain
several counters by hand.

The likely payer is not the ordinary D&D table; it is a survival, expedition,
firearms, or resource-management GM who already enforces the rule. Ordinary
high-fantasy tables are a negative control because many simply ignore mundane
ammunition and ration bookkeeping. The eye-catching demo is a visible
“one-shot left” or “last torch” transition, but that is a campaign-style
feature, not broad WTP. Test only a one-time $5/$10/$20/no-purchase choice with
resource-focused GMs.

The direct competition is already enough to close the broad gap. Ammo Tracker
and RC Spent / Recoverable Ammo Tracker automate ammunition use or recovery,
Party Resources and Bag o' Lists cover generic shared counters, Custom Fields
adds item counters, and Weapon Reload provides current D&D5e reload/loadout
automation. The first two are old or version-limited, but that is not itself a
buyer problem; a free macro, native item quantity, or a table decision to
ignore ammunition is a stronger substitute for most groups.

The technical and rights boundary is manageable only as a neutral event
ledger: consume, recover, lose, reserve, and threshold events with system
adapters. Rules-specific recovery, encumbrance, firearms, and survival content
must remain user-authored or adapter-owned. Portability is plausible for the
event contract, but the product's value is too dependent on a narrow campaign
style to justify a broad implementation.

**Decision:** reject Resource Steward as a broad market candidate. Retain the
neutral resource-event, threshold, provenance, and reversible-receipt patterns
as reusable Campaign Helper assets. Reopen only with survival-focused or paid
GMs who name repeated reconciliation failures and choose a non-zero price over
their current sheet, macro, or module. Continue the search for a payer problem
that ordinary tables cannot simply opt out of. Dungeon Master's Forge remains
backburnered and untouched.

Sources:

- https://www.reddit.com/r/DnD/comments/1v7dc5i/tracking_ammunition_with_beads/
- https://www.reddit.com/r/DnD/comments/1guaqvm/why_do_people_not_like_to_track_ammunition/
- https://www.reddit.com/r/dndnext/comments/1qzdvho/tracking_arrows_yes_or_no/
- https://foundryvtt.com/packages/ammo-tracker-fvtt/
- https://foundryvtt.com/packages/rc-spent-ammo
- https://foundryvtt.com/packages/fvtt-weapon-reload
- https://foundryvtt.com/packages/fvtt-party-resources
- https://foundryvtt.com/packages/custom-fields
- https://foundryvtt.com/packages/bag-of-lists

### Pass 118 — fresh challenger: Character Integrity Ledger

The next scan tested a trust and administration problem rather than a gameplay
surface: GMs of long-running, open, paid, or always-on worlds may need to know
what changed on a player character between sessions. A product hypothesis,
**Character Integrity Ledger**, would record actor and embedded-item changes,
show role-filtered before/after receipts, allow a GM to acknowledge or revert a
change, and preserve provenance without treating players as suspects.

There is some visible pain. A recent high-engagement Foundry discussion asks
for a player audit log, and long-running campaigns can make unexplained item,
stat, or spell-slot changes costly to investigate. The strongest payer segment
would be paid GMs, organized/open tables, or campaigns that intentionally leave
the server available between sessions. A normal private friend group is a
negative control. Test only a one-time $10/$20/$39/no-purchase offer after the
buyer names a real incident.

The direct competition closes the general claim. Character Tracker already
tracks player changes to core system data, embedded items, and active effects
on Foundry v13/v14, with chronological and categorical audit views and
exports. Yugen-tracker provides real-time sheet tracking, alerts, history,
optional file output, player visibility, and Discord delivery on current
Foundry versions. Foundry's own role and document permissions are a baseline
control. The remaining wedge—approval workflow, retention policy, or a safe
revert receipt—may be useful, but no product-specific WTP or unmet incident
rate is established.

The privacy and safety risks are material: logs can expose biography changes,
private player behavior, or a GM's own corrections; rollback can conflict with
legitimate play and automation; and a public accusation surface would damage
trust. A portable contract could carry redacted change events, actor/item
identifiers, timestamps, provenance, and acknowledgement state, but raw
character data and person-level suspicion must not leave the world.

**Decision:** reject Character Integrity Ledger as a broad new product because
the core audit value already exists and the remaining wedge is a narrow
administrative feature. Retain immutable change events, role-filtered views,
reversible receipts, retention controls, and no-accusation UX as reusable
assets. Reopen only after a qualified buyer reports a repeated incident that
both current trackers fail to explain and chooses a non-zero price. Continue
the wide search; Dungeon Master's Forge remains backburnered and untouched.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v8gfrr/im_leaving_this_sub_because_of_the_increasing/
- https://foundryvtt.com/packages/character-tracker
- https://foundryvtt.com/packages/yugen-tracker
- https://foundryvtt.com/article/users/

### Pass 119 — fresh challenger: Player Pocket / VTT Companion

The next scan found a stronger ordinary-table pain than resource bookkeeping:
hybrid and in-person groups want the Foundry character and action surface on a
phone or tablet while the GM keeps the map or shared display on the main
screen. Foundry's own FAQ says core Foundry does not support mobile devices,
and recent community posts show groups actively seeking a sheet-only or native
companion because laptops clutter the table. This is a real repeated problem,
not merely a request for a prettier UI.

The product hypothesis is **Player Pocket / VTT Companion**: a small,
self-hosted, player-scoped companion that opens from an invite, shows the
current character and permitted actions, sends rolls or safe action requests,
receives results, supports touch and low-bandwidth use, and keeps a read-only
offline snapshot when the server is unavailable. The deliberately narrow
Foundry first version should not recreate the canvas or copy rulebook text. Its
eye-catching demo is “the map stays on the table display while every player
uses a phone for their sheet, rolls, HP, inventory, and turn.”

The payer is the GM, not each player: hybrid/in-person campaigns, tablet-only
players, convention or classroom tables, and groups that want fewer laptops
are the strongest segments. Online desktop-only groups and systems without a
tested adapter are negative controls. A one-time GM license is a better fit
than a mandatory subscription because the Foundry community repeatedly objects
to recurring access fees; test $15/$30/$45/no purchase and separately record
whether players join free through the GM's license.

The broad category is already active. Foundry Tabletop Helpers, Swipe VTT,
VTT Companion/Companion Bridge, PocketScroll, Diecast, Sheet Only, Mobile
Improvements, and system-specific Mobile-Companion modules cover mobile sheets,
rolls, HP, inventory, combat, maps, or offline views. PocketScroll and VTT
Companion provide unusually strong payment evidence: GM-paid access, free
player invites, and one-time/lifetime options. That validates the buyer
problem, but it also makes a generic Foundry mobile client a poor target.

The only defensible wedge is a **portable player-action contract** rather than
another full mobile client: character snapshot, permitted action request,
roll/result, resource delta, combat notification, and explicit unsupported
state. A Foundry adapter can use the existing permission model and socket
bridge; a second-VTT adapter must map only those primitives. No cloud campaign
database is required, which reduces privacy and licensing risk, but app-store
distribution, device authentication, reconnects, offline conflict handling,
system-specific sheets, and Foundry-version drift are substantial technical
costs.

**Decision:** open Player Pocket as a conditional empirical challenger, not a
selected product. It has the strongest payment proxy in this fresh search, but
the broad category is crowded and incumbents already offer the obvious demo.
Advance it only if qualified hybrid or tablet-only groups prefer the narrow
portable contract over their exact installed competitor, choose a non-zero
one-time price, and complete a multi-session sync/privacy pilot. Retain the
permission-scoped action envelope, snapshot, receipt, reconnect, and adapter
boundary as reusable Campaign Helper assets. Dungeon Master's Forge remains
backburnered and untouched.

Sources:

- https://foundryvtt.com/article/faq/
- https://www.reddit.com/r/FoundryVTT/comments/1qd96qi/swipe_vtt_mobile_character_sheets_and_touch/
- https://www.reddit.com/r/FoundryVTT/comments/1tb3dru/my_partner_and_i_built_a_character_sheet_mobile/
- https://www.reddit.com/r/FoundryVTT/comments/1ttv1bv/vtt_companion_is_officially_out_of_beta/
- https://foundryvtt.com/packages/foundry-tabletop-helpers
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/companion-bridge-free
- https://pocketscroll.app/
- https://foundryvtt.com/packages/pocketscroll-socket
- https://foundryvtt.com/packages/sheet-only
- https://foundryvtt.com/packages/mobile-improvements/
- https://foundryvtt.com/packages/mobile-companion-pf2e

### Pass 120 — Player Pocket direct-competition and portability correction

The exact-package audit closes more of the broad mobile opportunity than the
fresh scan could establish. PocketScroll already provides a current Foundry
v12.343+/v14.359 bridge using Foundry's Socket.IO channel, with D&D5e sheets,
rolls, inventory, rests, combat, maps, chat, journals, GM controls, and live
two-way synchronization. Swipe VTT is current on Foundry v14.367, exposes
system-agnostic touch and performance features, and adds D&D5e/Daggerheart
mobile sheets, combat, inventory, spells, chat, and Midi-QoL integration behind
its support model. VTT Companion separates a free bridge from premium
two-way updates and supports Foundry v13/v14 D&D5e. Foundry Tabletop Helpers,
Sheet Only, Mobile Improvements, and Diecast further reduce the remaining
Foundry-only gap.

The second-VTT check also matters. Roll20 now documents mobile character
sheets through its browser-based Roll20 Characters surface, with D&D 5e
phone/tablet support and sheet-to-VTT synchronization. D&D Beyond provides a
mobile app with character sheets, rolls, inventory, spells, and offline access.
Owlbear's ecosystem deliberately leaves character sheets to external tools,
which is a portability opportunity but not proof that a new bridge is wanted.
The result is not an empty cross-VTT market; it is a set of platform-owned
surfaces with different data models, authentication, and payment relationships.

Payment evidence remains real but incumbent-owned. PocketScroll's GM-funded
model and VTT Companion's one-time/lifetime option show that a GM can pay for
mobile access while players join free. Swipe's Patreon-gated features and
Diecast's GM tier show additional category monetization. None establishes WTP
for a new multi-VTT adapter, and the maintenance cost of a full native client
would be higher than the one-time price hypothesis can safely support.

The only remaining product-shaped wedge is a **portable player-action
contract** implemented through thin, user-installed adapters: snapshot,
permissioned action request, result, resource delta, notification, reconnect,
and explicit unsupported state. It must avoid full sheet replication, cloud
campaign storage, rules text, and platform-specific canvas control. Even this
wedge requires an exact table whose current mobile option fails across more
than one VTT; a single Foundry table is already served by current packages.

**Decision:** demote the broad Player Pocket / VTT Companion concept to a
conditional comparison arm, not a likely implementation target. Retain the
portable action envelope, permission boundary, snapshot, receipt, reconnect,
and adapter patterns as reusable Campaign Helper assets. Reopen only when a
qualified multi-VTT or cross-system buyer names a repeated failure across the
incumbent mobile surfaces, chooses a non-zero one-time price, and completes a
two-VTT pilot. Continue the wide search; Dungeon Master's Forge remains
backburnered and untouched.

Sources:

- https://foundryvtt.com/packages/pocketscroll-socket
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/companion-bridge-free
- https://foundryvtt.com/packages/diecast-companion
- https://foundryvtt.com/packages/foundry-tabletop-helpers
- https://foundryvtt.com/packages/sheet-only
- https://foundryvtt.com/packages/mobile-improvements/
- https://help.roll20.net/hc/en-us/categories/4411213253015-Roll20-Mobile-App
- https://blog.roll20.net/posts/dd-sheet-now-on-phones/
- https://www.dndbeyond.com/en/players
- https://www.dndbeyond.com/posts/965-download-the-all-new-d-d-beyond-app
- https://www.reddit.com/r/FoundryVTT/comments/1ttv1bv/vtt_companion_is_officially_out_of_beta/
- https://www.reddit.com/r/FoundryVTT/comments/1rt8yfv/dnd5e_pocketscroll_foundry_mobile_companion/

### Pass 121 — fresh challenger: Encounter Tuner / Party Fit Lab

The next fresh scan moved to a recurring GM question that ordinary encounter
builders answer only prospectively: did this fight actually fit this party,
and what should change next time? Community discussions still describe fights
that are too easy or too hard for the real roster, and GMs report meaningful
prep time spent trying to make an encounter land. This is a buyer-shaped pain
for recurring combat-heavy GMs, but the existence of the pain is not payment
evidence.

The broad product is already occupied. Encounter Forge is current on Foundry
v12-v14 and calibrates generated creatures to the party's actual HP, AC, saves,
levels, expected DPR, and selected difficulty. Giffyglyph's current Monster
Maker continuation provides level scaling, roles, scaling actions, and
conversion of existing monsters. D&D Beyond's Encounter Builder is a paid
subscriber feature, while Combat Stats, Battle Replay, and the older Encounter
Stats provide increasingly rich post-combat measurements. PF2e also has
simulation and danger-analysis tools such as Grim Arithmetic. A new generator,
CR calculator, or combat dashboard would therefore be a weak product thesis.

The remaining hypothesis is **Encounter Tuner / Party Fit Lab**: after a real
combat, produce a transparent debrief containing rounds, damage/healing,
downed events, resource drain, enemy count, meaningful deviations, and GM
notes; then compare that evidence with the planned encounter and propose a
small, reversible adjustment for the next encounter. The first release would
not rewrite actors, adapt difficulty secretly during combat, or include
proprietary rule text. Its eye-catching demo is “this party spent almost no
resources and finished in two rounds; here are three explainable next-fight
adjustments.”

The payer is the GM running a recurring campaign with enough combat to notice
calibration drift. One-shot-only groups, story-first tables, and groups that
already use Encounter Forge or a system-native difficulty workflow are
negative controls. Test a buy-once offer at $10/$20/$35/no purchase and ask
whether the GM would use the tuner for three sessions. Require 7/10 qualified
GMs to name a recent fit failure, 5/10 to prefer the debrief-plus-adjustment
workflow over their exact tool, 3/10 to choose a non-zero price, and 2 pilots
to complete three sessions without trusting an opaque or punitive “balance”
score.

Portability is plausible only for a neutral combat-event contract: encounter
identity, round, actor role, outcome metrics, resource deltas, and GM-authored
adjustment notes. System-specific damage semantics, hidden stats, automation
hooks, and live mutation remain adapter-specific. A Foundry adapter is the
only sensible first implementation; a second VTT should begin as a
read-only event import/export test.

**Decision:** open Encounter Tuner as a conditional challenger, below the
existing empirical queue. It is a genuinely different product from a monster
builder and has a visible recurring GM outcome, but current party-calibrated
builders and analytics tools may already satisfy the buyer. Promote it only
after exact-alternative preference, non-zero price, three-session use, and
runtime/privacy evidence. Dungeon Master's Forge remains backburnered and
untouched.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1g5olk6/how_do_you_get_everything_prepped_for_a_session/
- https://www.reddit.com/r/Pathfinder2e/comments/1qcnufc/using_an_encounter_builder_but_fights_are_too_easy_or_too_hard/
- https://foundryvtt.com/packages/encounter-forge
- https://foundryvtt.com/packages/giffyglyph-monster-maker-continued/
- https://www.dndbeyond.com//encounter-builder
- https://foundryvtt.com/packages/combat-stats
- https://foundryvtt.com/packages/battle-replay
- https://foundryvtt.com/packages/encounter-stats
- https://foundryvtt.com/packages/grim-arithmetic

### Pass 122 — fresh negative control: SceneReady / Map QA

A separate scan tested the most visually marketable map-prep promise: import a
map and receive a green “ready to run” result with correct grid, walls,
doors, lights, levels, assets, and a safe repair receipt. The buyer would be
the GM who buys maps or moves scenes between VTTs, and the demo would be easy
to understand. Community reports confirm that grid alignment, multi-floor
imports, and manual wall/light correction still create friction.

The direct substitute set is already unusually strong. Universal Battlemap
Importer is current for Foundry v14 and accepts Dungeondraft, DungeonFog, and
Arkenforge exports. Dungeon Alchemist exports walls and lighting for Foundry,
Fantasy Grounds, and Roll20; Dungeondraft exports Universal VTT for Foundry,
Roll20, MapTool, and other clients. Foundry now has MapForge, Mass Import,
Dungeon Alchemist Level Importer, Map Splitter, and other current scene tools.
Paid mapmaking software itself supplies a much stronger payment anchor than a
QA-only add-on: Dungeon Alchemist advertises a $44.99 one-time purchase and
Dungeondraft is also a one-time, no-subscription product.

The only distinct wedge would be post-import validation and repair, not map
creation or another importer: visual grid alignment, wall endpoint and door
sanity checks, active-level consistency, missing-file detection, before/after
scene diff, and a neutral report that can travel with the map. That overlaps
the existing VTT BridgeCheck/World Doctor research and is closer to a creator
or packager tool than a broad ordinary-player product.

**Decision:** reject SceneReady as a standalone new product for now. Retain
the green-readiness receipt, visual diff, missing-asset report, and neutral
scene contract as reusable assets. Reopen only if qualified GMs name a
repeated post-import failure that survives the exact importer and choose a
non-zero price; do not count map software sales as proof that a second QA
utility will sell. Continue the fresh search with Encounter Tuner as the
only newly opened challenger.

Sources:

- https://foundryvtt.com/packages/dd-import
- https://www.dungeonalchemist.com/import-to-foundry
- https://dungeondraft.net/
- https://foundryvtt.com/packages/mapforge
- https://foundryvtt.com/packages/mass-import
- https://foundryvtt.com/packages/da-level-importer
- https://foundryvtt.com/packages/map-splitter
- https://www.reddit.com/r/FoundryVTT/comments/1spgwg4/universal_battlemap_importer_issue/
- https://www.reddit.com/r/FoundryVTT/comments/1bqjtuw/can_one_import_layers_of_levels_with_wall_and_light_data/

### Pass 123 — fresh challenger: CanvasBridge / Legacy-Device Player Relay

The fresh community scan found a different failure from ordinary mobile UX:
one player is excluded because an old Mac, iPad, low-end Chromebook, browser,
or graphics path cannot load the Foundry client at all. Foundry's current
requirements call for a relatively modern operating system and browser,
hardware acceleration, 8 GB of RAM, and a 1366x768 display; the official FAQ
also says that Foundry does not work on iPad because of Safari/WebKit
limitations. A recent player report describes exactly this kind of blocked
participant and groups considering screen sharing or leaving Foundry.

The fresh product hypothesis is **CanvasBridge**: a GM-installed, local-first
fallback client for one or more blocked players. It would avoid loading the
interactive WebGL canvas and expose only a permission-scoped player surface:
character snapshot, chat, roll/action requests, visible results, resource
changes, a lightweight scene image or GM-provided snapshot, reconnect state,
and an explicit unsupported-action message. The eye-catching demo is “the
player on the ten-year-old laptop joins the same adventure without making the
group migrate.” Players would join free; the GM/host would be the payer.

This is not a claim that a normal Foundry module can solve the problem. If the
browser cannot run the Foundry client, the first implementation may need a
small server-side relay or companion application that the GM runs alongside
Foundry. That raises support, authentication, and maintenance cost. The
product must never proxy publisher content, collect a Foundry password, or
silently expose hidden scenes, actors, rolls, or GM notes.

**Decision:** retain CanvasBridge as a conditional challenger below the current
empirical queue, not as a selected product. The pain is high-urgency for the
affected GM but episodic and narrower than the broad player market. It must
beat the exact alternative—Foundry's low-performance settings, Performance
Optimizer, Swipe, foundry-mobile-companion, Foundry Lightweight Client, screen
sharing, or moving the group to another VTT—in a real device-exclusion case.
Test a $15/$25/$39/no-purchase one-time GM offer, require 7/10 qualified GMs
to name a recent blocked-player incident, 5/10 to prefer the relay over their
actual workaround, 3/10 to choose a non-zero price, and two pilots that keep
the same player in two sessions. Keep the portable claim at a neutral
player-session contract until a Foundry adapter and one read-only second-VTT
adapter prove permissions, reconnect, hidden-state, and unsupported-action
behavior.

Sources:

- https://foundryvtt.com/article/requirements/
- https://foundryvtt.com/article/faq/
- https://www.reddit.com/r/FoundryVTT/comments/1w7wd34/one_of_my_players_cant_run_foundry_on_their/
- https://foundryvtt.com/packages/performance-optimizer
- https://foundryvtt.com/packages/swipe-vtt
- https://github.com/LittleRainbowFox/foundry-mobile-companion
- https://github.com/phenomen/flc
- https://www.reddit.com/r/FoundryVTT/comments/1vk8crq/foundry_runs_well_on_lowend_devices/

### Pass 124 — CanvasBridge direct-competition and payer correction

The current-package audit closes much of the CanvasBridge demo. The current
D&D5e Mobile Companion is verified for Foundry 14.365 and already exposes
health, hit dice, exhaustion, inventory, spells, traits, and a trade app; it
explicitly positions itself as a lightweight player aid rather than a full
sheet. Companion Bridge Free is verified for Foundry 13–14.999 and connects
Foundry to the VTT Companion iOS app, while its premium path adds two-way
updates such as HP, item use, and spell use. Foundry Mobile Companion exposes
touch sheets, chat, a mobile dice widget, and supported roll-card actions.

These products do not solve every unsupported-browser or map-rendering case,
and some have Safari/WebKit limitations or system-specific scope. They do
mean that “let a player use a phone or tablet for sheet and rolls” is already
an active paid/free category. Foundry Lightweight Client also reduces browser
overhead for players who can run a current Chromium-based client. The buyer
would therefore be paying only for a rare residual case: a named player who
cannot use the exact companion, lightweight client, performance profile, or
screen-share workaround and would otherwise be excluded or force a VTT move.

**Decision:** demote the broad CanvasBridge promise to a negative control and
retain only a very narrow conditional case. Do not build a mobile client,
character-sheet clone, or general relay. Reopen only when a qualified GM
documents a specific device/browser failure that survives Mobile Companion,
Companion Bridge/VTT Companion, Foundry Mobile Companion, Foundry Lightweight
Client, low-performance settings, and screen sharing, and still chooses a
non-zero one-time price. Preserve the canvasless permission boundary and
neutral player-session contract as reusable assets for that test; no product
is selected.

Sources:

- https://foundryvtt.com/packages/mobile-companion-dnd5e
- https://foundryvtt.com/packages/companion-bridge-free
- https://github.com/LittleRainbowFox/foundry-mobile-companion
- https://github.com/phenomen/flc
- https://foundryvtt.com/article/requirements/
- https://foundryvtt.com/article/faq/

### Pass 125 — fresh challenger: Loadout Compass / Character Kits

The next fresh scan followed a recurring player complaint rather than a GM
authoring request: prepared casters want named spell lists for exploration,
dungeon work, or combat, and players describe the cost of rebuilding those
lists as a reason to avoid using the flexibility of the class. A recent PF2e
module release shows that this is real demand, but it also provides an
important market test: the exact spell-loadout job is being filled quickly.

The product hypothesis was **Loadout Compass / Character Kits**: an explicit,
user-invoked kit that can switch a character's prepared spells, equipped gear,
visible actions, hotbar, and other reversible player-owned state for a named
context. The eye-catching demo would be “Town, Dungeon, and Boss Fight” kits
applied with a preview and a single confirmation. The buyer would likely be
the GM or player who repeatedly maintains a prepared caster or multi-role
character; portability would require a neutral actor-loadout record rather
than copied rules text.

The direct audit closes the broad offer. Current D&D5e **Spell Book** is
verified for Foundry 14 and already includes named per-class spell loadouts,
apply/quick-apply behavior, and support for 2014 and 2024 rules. **PF2e
Prepper** provides the same save/apply workflow for PF2e and integrates with
Dailies. D&D Beyond, Roll20, native D&D5e preparation, and system-specific
equipment controls are additional substitutes. Community discussion also
notes that many players do not swap often enough to justify another utility.

**Decision:** reject the generic Loadout Compass as a new product. Preserve a
neutral, explicit, reversible character-kit record as a reusable Campaign
Helper asset. Reopen only if a qualified buyer names a repeated failure that
survives Spell Book/PF2e Prepper and the exact native or equipment workflow,
and chooses a non-zero price for full non-spell state. Do not recommend spells,
mutate a character without confirmation, or claim cross-VTT parity from a
shared schema alone.

Sources:

- https://foundryvtt.com/packages/spell-book
- https://www.reddit.com/r/Pathfinder2e/comments/1rtsawx/pf2e_prepper_foundry_module_for_prepared/
- https://www.reddit.com/r/3d6/comments/t2y21j/5e_prepared_spell_loadouts_resource/
- https://dndbeyond-support.wizards.com/hc/en-us/articles/7747193946388-Sheet-Sections
- https://roll20.net/compendium/dnd5e/00%20Start%20Here%3AHelp-%20Fifth%20Edition%20Character%20Sheet-%20Inventory%20Tab

### Pass 126 — fresh challenger: Trusted Table / Delegated Actions

The next fresh scan followed a current request for a GM-controlled trust
toggle that lets players apply damage to enemy tokens, removing a repetitive
GM click without granting unrestricted actor ownership. This is a concrete
session-time problem: it occurs during ordinary combat, has a visible demo,
and has a clear payer—the GM who wants to keep attention on running the
encounter. A broader version would let the GM whitelist actions such as
damage, healing, condition application, door control, or resource updates with
expiry, preview, audit, and undo.

The direct package audit prevents a generic “trusted player mode” claim.
Effective Tray NG is current for Foundry 13–14 and already lets players use
damage/effect trays against targets they do not own when the GM enables the
setting; it routes unowned changes through an active GM client. Midi-QoL
automates damage application, Damage Application accelerates D&D5e damage and
healing, Always HP provides a current HP control, and current D&D5e tweaks
provide GM/player damage prompts. These are imperfect and system-specific,
but they close the most obvious D&D5e demo.

**Decision:** reject Trusted Table as a broad product and do not turn a
permission bypass into a paid feature. Retain only the neutral action-envelope
ideas—GM whitelist, target snapshot, explicit confirmation, expiry, idempotent
request ID, audit receipt, and undo—as reusable assets. Reopen only for a
qualified multi-system or accessibility-focused buyer who can name a repeated
failure that survives the exact system tools and chooses a non-zero price.
Any future fixture must prove hidden-state safety, stale-request rejection,
duplicate suppression, reconnect convergence, and GM authority; the product
must never grant general NPC ownership.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/effectivetray-ng
- https://foundryvtt.com/packages/midi-qol/
- https://foundryvtt.com/packages/damage-application
- https://foundryvtt.com/packages/always-hp
- https://foundryvtt.com/packages/niks-dnd5e-tweaks

### Pass 127 — fresh-search reset: no new standalone product clears the audit

The fresh-search reset also rechecked the strongest current visual signal:
players and GMs continue to ask for better text/drawing controls, and a recent
high-engagement thread contains an explicit willingness-to-pay statement for
an Excalidraw-like layer. That is stronger behavioral evidence than the old
feature-request threads, but the exact category is not empty. Foundry core,
Advanced Drawing Tools, Whiteboard Experience, Dungeon Draw, and Gambit's
current or previewed drawing products cover most of the surface. Whiteboard
Experience is still limited to older Foundry versions, which leaves a possible
v14 live-play wedge, but it does not prove that a new product will beat the
current premium and free stack.

**Decision:** do not invent another candidate name or select a product from
the new scan. The only fresh signal strong enough to advance is a refined,
conditional live-play annotation workflow—temporary scene/handout layers,
inline text, touch/pen speed, permission scopes, automatic cleanup, and
reversible promotion—which is already represented by Tactical Sketchbook in
the queue. Keep it conditional and run a direct buyer test rather than
pretending it is a new market. Player Compass remains the first recurring-use
buyer gate. Dungeon Master's Forge remains explicitly backburnered and
untouched.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_what_module/
- https://foundryvtt.com/packages/whiteboard-experience
- https://foundryvtt.com/packages/advanced-drawing-tools
- https://foundryvtt.com/packages/dungeon-draw
- https://www.reddit.com/r/FoundryVTT/comments/1vcsd1g/gambits_enhanced_drawing_module_preview_system/

### Pass 128 — fresh current-package reset: player guidance and session performance

The next fresh search deliberately moved away from Dungeon Master's Forge and
retested two ordinary-customer problems that can look like new products in a
short demo: “what can I do right now?” player confusion and a table becoming
unusable on a weak client. The current package state closes more of both
categories than the earlier audit captured.

[Foundry Navigator](https://foundryvtt.com/packages/foundry-navigator) is now a
substantial v13/v14 D&D5e player workflow, not merely a keyboard shortcut pack.
Its current page describes first-run per-player setup, keyboard and
screen-reader navigation, combat target selection, attack/use/roll flows,
GM-mediated damage and healing against unowned hostile tokens, spoken
announcements, focus recovery, and low-resolution behavior. That materially
reduces the remaining Player Compass and Trusted Table claims. The unresolved
piece—automatic, system-aware plain-language context selection with no GM
recipe—remains a hypothesis, not a new category.

[Character Builder](https://foundryvtt.com/packages/dnd5e-character-builder) now
also includes a player tutorial for assigned characters, level-ups, rests, and
wizard spellbook workflows. Foundry's own
[Player Orientation](https://foundryvtt.com/article/player-orientation/) covers
joining, claiming a character, sheets, and map movement. A paid “teach players
Foundry” or generic onboarding module would therefore have to beat both the
native path and the exact installed sheet/HUD stack.

The performance branch is equally occupied. [Prime
Performance](https://foundryvtt.com/packages/fvtt-perf-optim) is verified for
Foundry 14 and reports token/status-effect rendering optimizations; [Geano's
Scene Optimizer](https://foundryvtt.com/packages/geanos-scene-optimizer) adds
non-destructive image/audio optimization with progress feedback; and [Swipe
VTT](https://foundryvtt.com/packages/swipe-vtt) combines touch controls,
mobile sheets, and performance adjustments. A new FPS dashboard, generic
low-spec mode, or “make Foundry faster” product is not a clean gap. The
remaining diagnostic hypothesis is already represented by the conditional
Session Health Autopsy and CanvasBridge arms, both of which require a named
incident that survives the exact alternatives.

**Decision:** do not select a new player-guidance, onboarding, mobile, or
performance product from this pass. Demote the broad Player Compass and
Trusted Table claims further: any surviving offer must demonstrate a specific
failure that the current Navigator/Character Builder/native/HUD or
performance/mobile stack cannot solve, then earn product-specific non-zero WTP
and a real-table pilot. Keep the search open, keep DMF backburnered, and do not
start implementation from package novelty or a category payment signal.

Sources:

- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/dnd5e-character-builder
- https://foundryvtt.com/article/player-orientation/
- https://foundryvtt.com/packages/fvtt-perf-optim
- https://foundryvtt.com/packages/geanos-scene-optimizer
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/

### Pass 129 — fresh community scan: hybrid display control and GM scratchpad

A new community scan surfaced two ordinary-table jobs with strong visual
demos. A current in-person/hybrid discussion asks how to run Foundry on a
large shared TV while the GM controls a private client, and describes players
sharing a “table” account, using a second player display, or keeping Foundry
only for combat. A separate current request asks for a lightweight, always-
visible GM note surface in the sidebar instead of a clumsy journal window.
These are useful buyer-pain signals, but neither is an unoccupied product.

[Monk's Common Display](https://foundryvtt.com/packages/monks-common-display)
already supports a clean shared TV/player view and GM-controlled focus for
Foundry 14. [Stage Master](https://foundryvtt.com/packages/stage-master) is a
current paid v14 product with spectator display, camera cloning, shared vision,
player UI controls, highlights, media sharing, and a quick curtain. [Sheet
Only](https://foundryvtt.com/packages/sheet-only) and [Physical Play
Dice](https://foundryvtt.com/packages/pp-dice) cover common in-person companion
patterns. The eye-catching “run a digital stage on the TV” demo therefore has
a direct premium incumbent and several free/low-cost alternatives.

The GM scratchpad request is also answered by current [Notebook](https://foundryvtt.com/packages/notebook),
which provides a v14 sidebar tab with text, list, counter, timer, progress
clock, chat, macro, and scribble notes. GM Screen, Campaign Codex, pinned chat,
and map-note workflows provide further substitutes. The recent request was
resolved by the author accepting Notebook, so it is a negative control rather
than new product-specific payment evidence.

**Decision:** reject a generic Hybrid Table Controller and a generic GM
scratchpad. A residual cross-VTT hybrid handoff contract—display-role registry,
private/ shared routing, paired controls, stale-client status, and one-click
remote return—remains a reusable Tabletop Bridge hypothesis, not a selected
product. Continue the wide search with a different payer problem, keep all
buyer tests separate, and keep Dungeon Master's Forge backburnered.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1wgj39t/tips_for_using_foundry_in_an_in_person_session/
- https://www.reddit.com/r/FoundryVTT/comments/1wpuwhu/any_module_for_quick_and_easy_gm_notes_or_gm_tab/
- https://foundryvtt.com/packages/monks-common-display
- https://foundryvtt.com/packages/stage-master
- https://foundryvtt.com/packages/sheet-only
- https://foundryvtt.com/packages/pp-dice
- https://foundryvtt.com/packages/notebook

### Pass 130 — fresh lead: live broadcast overlay / audience mode

The next unrelated scan found a strong visual request: a community member saw a
polished Japanese D&D stream with live character portraits, hit points, spell
slots, and turn-driven scene changes and said they would pay good money for a
module like it. This is an excellent marketing demo, but the buyer is a
streamer or content creator rather than an ordinary player or campaign GM.

The current package audit also closes the obvious implementation gap. [Foundry
Stream Overlay Free](https://foundryvtt.com/packages/foundrystreamoverlay) is
verified for Foundry 12–14, supports multiple systems, live actor data,
customizable layouts, and a premium Pro tier with multiple layouts,
animations, and slideshows. [OBS Utils](https://foundryvtt.com/packages/obs-utils)
is current for v13–14 and already provides spectator browser-source behavior,
automatic token following, viewport tracking, transparent stream mode, custom
overlays, and OBS remote control. Stream Overlay, Stream Utils, Stream View,
Daggerheart Stream Overlay, and newer webcam/actor overlay packages fill more
of the adjacent surface.

The portable contract is technically plausible—read-only actor summaries,
event feeds, portrait assets, and a browser-source renderer—but the valuable
work is system-specific data mapping, OBS integration, layout authoring, and
content-creator support. Those are recurring maintenance costs for a narrow
buyer segment. It also creates rights and privacy boundaries around portraits,
actor data, player consent, and broadcast-hidden information.

**Decision:** reject a generic broadcast-overlay product as the next ordinary-
customer product. Retain a neutral read-only broadcast packet and consent/
visibility policy as reusable assets. Reopen only if qualified streamers or
paid actual-play GMs choose a new one-time offer over Foundry Stream Overlay
Pro and OBS Utils, and if a second-VTT browser-source adapter proves demand.
Continue the wide search for a recurring problem shared by ordinary tables;
Dungeon Master's Forge remains backburnered.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1p7h7xp/does_anyone_know_how_they_did_this_the_jrpg/
- https://foundryvtt.com/packages/foundrystreamoverlay
- https://foundryvtt.com/packages/obs-utils
- https://foundryvtt.com/packages/dh-stream-overlay
- https://foundryvtt.com/packages/wyv-wcamutils-overlay
- https://foundryvtt.com/packages/

### Pass 131 — fresh conditional lead: Zero-Prep Session Capsule

The next scan found a more ordinary GM pain than broadcasting: a current
community request asks for “zero prep” modules with minimal configuration
because Foundry feels complicated and time-consuming. The signal is vivid and
recurring, but it is still a request, not payment evidence.

The new candidate is **Zero-Prep Session Capsule**. It would not be another
map generator, AI adventure writer, importer, or adventure content pack. A GM
would select user-owned scenes, actors, journals, maps, encounters, player
objectives, and a time budget; the capsule would preview the exact bundle,
create a disposable launch plan, show the GM a short runbook, expose only the
intended player-facing material, and provide cleanup/return after the session.
The portable artifact would be a neutral session-capsule manifest, not copied
rules or adventure text.

The direct audit prevents a broad claim. [Dungeon Flow](https://foundryvtt.com/packages/dungeon-flow-foundry)
already generates a complete dungeon and imports maps, walls, doors, journals,
encounters, traps, and notes into Foundry 13/14 through its Pro tier.
[Morelord Encounters](https://foundryvtt.com/packages/morelord-encounters) is
current for v14 and generates a ready-to-review roster from the party,
difficulty, and available monster sources. [Encounter
Forge](https://foundryvtt.com/packages/encounter-forge) builds party-sized
D&D5e NPCs, while [Mass Import](https://foundryvtt.com/packages/mass-import)
batch-imports scenes, journals, decks, and other user files. The current
importer catalog also contains Adventure Import/Export, Dungeon Flow, Quest
Book, Dynamic Adventure Journal Builder, premium content, and system-specific
PDF/import tools.

The only plausible gap is orchestration: turning already-owned material into a
single, reversible “ready for tonight” session surface with player-safe scope,
time-boxed objectives, and a portable receipt. That may still be a convenience
bundle rather than a product. It must beat the GM's normal checklist and the
exact stack above, not merely demonstrate fewer clicks. Technical risk includes
cross-document dependency closure, permission correctness, safe temporary
state, rerunnable launch, and cleanup. Licensing risk is manageable only if the
capsule references user-owned documents and never ships publisher text, art,
or copied competitor data.

**Decision:** open Zero-Prep Session Capsule as a low-priority conditional
challenger, not a selected product. Its buyer is a busy GM running recurring
one-shots, irregular sessions, or imported/homebrew content; player benefit is
less waiting and clearer session entry. Advance it only through the explicit
buyer gate, a Foundry disposable fixture, a rights-safe capsule manifest, and a
second-VTT read-only import/preview experiment. Dungeon Master's Forge remains
backburnered and is not part of this candidate.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7w5j7/im_new_to_foundry_vtt_what_module/
- https://foundryvtt.com/packages/dungeon-flow-foundry
- https://foundryvtt.com/packages/morelord-encounters
- https://foundryvtt.com/packages/encounter-forge
- https://foundryvtt.com/packages/mass-import
- https://foundryvtt.com/packages/tag/importer

### Pass 132 — Zero-Prep Session Capsule direct incumbent correction

The capsule does not survive the current-package audit as a broad session
workspace. [SessionFlow](https://foundryvtt.com/packages/sessionflow) is
verified for Foundry 14, is sold by a premium publisher, and explicitly
positions one canvas as the whole session. Its current surface includes
story beats and scenes, quick scenes, journal links, checklists, live
broadcasts, a player panel, objectives, and a Scribe for session recaps. That
is materially closer to the proposed “ready for tonight” workflow than the
earlier audit captured. [Dungeon Flow](https://dungeonflow.app/foundry)
also sells paid Foundry import and re-import with walls, doors, line of sight,
and room journals. Ready-to-run paid adventures establish that GMs will buy
content, but they do not establish willingness to pay for a new orchestration
layer; [One-shot Dungeons for 5E](https://foundryvtt.com/packages/osd-5e-vol1)
is an example of the content alternative.

The remaining hypothesis is much narrower: a disposable transaction wrapper
that previews dependency closure and player scope, creates a reversible launch
from already-owned material, and emits a cleanup/return receipt. That is a
safety and state-management claim, not a new prep canvas. It has no
product-specific payment evidence and may be a feature SessionFlow or a GM's
existing duplicate-world workflow can absorb.

**Decision:** demote the broad Zero-Prep Session Capsule to a comparison arm.
Do not implement a new session workspace or importer. Reopen only if a
qualified GM names a repeated, costly failure that survives SessionFlow,
Dungeon Flow, the exact importer/content stack, and a disposable duplicate
world, then chooses a non-zero price and completes a pilot. Dungeon Master's
Forge remains backburnered and is not part of this search.

Sources:

- https://foundryvtt.com/packages/sessionflow
- https://dungeonflow.app/foundry
- https://dungeonflow.app/compare/dungeon-flow-vs-donjon
- https://foundryvtt.com/packages/osd-5e-vol1

### Pass 133 — fresh conditional lead: No-Spoiler Player Return Brief

The fresh search moved from GM preparation to a recurring player-retention
problem: long or irregular campaigns lose context when a player misses a
session. A current Foundry discussion says the group plays about once a month
and wants an intuitive way for players to refresh a large homebrew world's
lore. Another group describes cancelling or creating extra one-shots when one
of six players cannot attend, with character health, spell slots, duplicate
actors, and separate worlds becoming manual bookkeeping. Foundry 14's shared
fog-of-war mode helps a returning player recover explored geography, but it
does not reconstruct narrative knowledge, personal consequences, or the
player's next safe action.

The candidate is **No-Spoiler Player Return Brief**: after a GM approves the
session delta, each player receives a compact “you missed last session” card
containing only that player's allowed facts, what changed, current objectives,
character state, unresolved hooks, and a safe re-entry point. The player can
mark a fact as remembered, ask the GM to clarify it, or flag a contradiction;
the GM can redact and regenerate before publication. The front-door demo is
“missed game night? Re-enter the story in 90 seconds,” which is more legible
than another campaign wiki.

The current audit blocks a generic recap or AI campaign assistant claim.
[Archivist Sync](https://foundryvtt.com/packages/archivist-sync) already
provides Foundry 13/14 campaign recaps, linked entities, a campaign chatbot,
and bidirectional synchronization. [Foundry Familiar](https://foundryvtt.com/packages/foundry-familiar)
offers campaign questions and summaries, although its page labels it early
alpha. [Campaign Codex](https://foundryvtt.com/packages/campaign-codex) covers
linked journals, timelines, permissions, and campaign organization, while
[SessionFlow](https://foundryvtt.com/packages/sessionflow) includes a player
Chronicle and Scribe. Outside Foundry, a recent player-wiki request was
answered with LegendKeeper. The only plausible wedge is therefore
permission- and spoiler-scoped re-entry, not search, transcription, a wiki, or
a chatbot.

The likely payer is the GM/host of a monthly, irregular, or paid campaign who
has recently spent meaningful session time catching up an absent player. A
neutral portability artifact can record source references, audience, spoiler
scope, timestamps, confidence, redactions, and acknowledgements; it must not
copy publisher text or claim that a shared event ledger gives Roll20 or
Owlbear runtime parity. Foundry is the first adapter; a second VTT begins as a
read-only preview. Local-first storage and user-authored references keep
licensing and privacy risk bounded.

**Decision:** open No-Spoiler Player Return Brief as a conditional challenger,
not a selected product. It advances only through a direct price choice,
preference over the named recap/wiki/assistant alternatives, two three-session
pilots, a per-player spoiler fixture, and a second-VTT manifest experiment.
If buyers actually want a generic wiki, transcript, or AI chatbot, reject it
and continue the wide search. Dungeon Master's Forge remains backburnered.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1vt5hrz/best_way_to_make_a_wiki_for_the_players/
- https://www.reddit.com/r/FoundryVTT/comments/1fg7r93/my_table_is_thinking_we_run_one_shots_when_a/
- https://foundryvtt.com/releases/14.356
- https://foundryvtt.com/packages/archivist-sync
- https://foundryvtt.com/packages/foundry-familiar
- https://foundryvtt.com/packages/campaign-codex
- https://foundryvtt.com/packages/sessionflow

### Pass 134 — No-Spoiler Player Return Brief direct payment and incumbent correction

The payer scan produced a real category signal but not an open product. Archivist
publishes plans from $10/month for casual tables upward and sells recaps,
campaign memory, player-facing handouts, and private journals. LegendKeeper
charges $9/month (or $90/year), lets the project owner pay while guests and
players participate free, and already provides secret content and controlled
sharing. Tavern Scribe explicitly markets missed-session catch-up, player
memory, “player truth,” and shared campaign history; it offers a free core and
metered or packaged AI processing. These are genuine willingness-to-pay and
retention signals for campaign-memory tools, but they also show that the
proposed Return Brief is entering an active paid category rather than finding a
clean Foundry gap.

Archivist's private journals and viewer-aware retrieval, LegendKeeper's secret
blocks and permissions, and Tavern Scribe's player-facing catch-up surface
cover the strongest differentiators proposed in Pass 133. A Foundry module
could still offer a local, no-recording, system-aware bridge into a user's
existing world, but that is an integration wedge with no direct price evidence,
not a new campaign-memory product.

**Decision:** demote No-Spoiler Player Return Brief from the empirical queue to
a comparison arm. Retain its per-player audience, spoiler-scope,
acknowledgement, contradiction, and revocation records as reusable Campaign
Helper assets. Reopen only if a qualified Foundry GM names a repeated failure
that survives Archivist, Tavern Scribe, LegendKeeper, Campaign Codex,
SessionFlow, and the group's manual recap, then chooses a non-zero price and
completes a pilot. Continue the ordinary-table search; Dungeon Master's Forge
remains backburnered.

Sources:

- https://www.myarchivist.ai/pricing
- https://www.rpgarchivist.io/features
- https://www.legendkeeper.com/pricing/
- https://www.legendkeeper.com/features-collaboration/
- https://tavernscribe.com/session-recap
- https://tavernscribe.com/for-players

### Pass 135 — World Doctor payer-anchor and current-competition correction

The strongest remaining ordinary-GM candidate is now **Game Night Preflight /
World Doctor**: a read-only, disposable-copy rehearsal that answers whether a
specific Foundry world will still run after a planned core, system, or module
change. The buyer is not every Foundry user. It is the GM/host of a long-lived,
module-heavy, paid, or tightly scheduled table who has recently lost time to a
broken update or cannot risk discovering the failure at game time.

The payment signal is indirect but meaningful. Community buyers describe
paying for several modules or Patreon memberships while objecting to recurring
maintenance costs and breakage; users also describe rolling back and locking
modules after updates fail. Foundry itself warns that compatibility may lag a
new generation and recommends separate installations, a different data folder,
and a module-free test when evaluating a release. This indicates an expensive
problem and a payer segment, not product-specific willingness to pay.

The exact competition is now explicit. Foundry's package compatibility badges,
compatibility preview, package backups, and snapshots report metadata and
restore points. Find the Culprit bisects enabled modules after a failure; Quick
Module Enable filters version mismatches; Sephral's Content Backup & Restore
recovers supported documents; managed hosts such as Molten provide automated
backups. None of those, by itself, proves that a real user's selected scene,
actor, journal, macro, player join, roll, and asset paths still work together
on the target stack before the live world is migrated.

The defensible offer is therefore not another backup browser, version picker,
or compatibility dashboard. It is a GM-selected smoke-test plan run against a
clone: launch, player join, scene transition, permissions, representative
system roll, journal/macro access, module hooks, asset resolution, and a
read-back receipt with evidence paths. The live world remains untouched. A
portable artifact contains package versions, test names, asset fingerprints,
observations, unsupported states, and recovery references—not copied campaign
content. A second-VTT adapter can only begin as a read-only health receipt.

**Decision:** move World Doctor to the first empirical buyer gate, ahead of
Player Compass, without selecting it for implementation. Test $15, $25, $39,
and no purchase against the exact core, hosting, backup, culprit, and manual
duplicate-world alternatives. Promote only after exact-alternative preference,
three non-zero price choices, two disposable-copy pilots, a no-live-mutation
fixture, rights/privacy clearance, and a later portability probe. Dungeon
Master's Forge remains backburnered.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1l58s81/when_the_module_update_breaks_everything_again/
- https://www.reddit.com/r/FoundryVTT/comments/1t5n76x/patreon_funded_modules_is_there_a_better_way_or/
- https://foundryvtt.com/article/modules/
- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/releases/14.359
- https://foundryvtt.com/packages/find-the-culprit
- https://foundryvtt.com/packages/quick-module-enable
- https://foundryvtt.com/packages/sephrals-content-backup-restore
- https://moltenhosting.com/

### Pass 136 — World Doctor direct-incumbent and payer correction

The current audit weakens World Doctor as a first product gate. Foundry's
module-management and package-management surfaces already expose compatibility
warnings, update/lock controls, version metadata, and backup/restore guidance.
Foundry also recommends a separate installation or data folder and a module-free
test when evaluating a new release. Molten's paid Elite plan includes a second
server slot for testing, VTT Online offers version choice and automated
backups, and The Forge exposes save points. FileSmith is a paid module, but its
promise is organization and file-like content management, not behavioral
preflight.

That leaves a narrower technical distinction: a user-selected behavioral smoke
suite that exercises a real clone and reports evidence-linked failures. The
payment evidence is still indirect. Hosting, premium modules, and maintenance
subscriptions prove that some GMs spend money around Foundry; they do not prove
that a GM will buy a separate test runner rather than delay the upgrade, use a
backup, rent a second server, or duplicate the world.

**Decision:** demote World Doctor from the first empirical gate to a conditional
comparison arm. Reopen it only for a qualified GM with a named recent failure or
near miss who prefers the behavioral rehearsal over Foundry's exact controls,
chooses a non-zero price, and pilots it on a disposable world. The smoke-suite,
no-live-mutation, recovery-receipt, and neutral diagnostic-manifest assets are
retained. Dungeon Master's Forge remains backburnered.

Sources:

- https://foundryvtt.com/article/modules/
- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/article/installation/
- https://moltenhosting.com/
- https://vtt-online.com/
- https://foundryvtt.com/packages/filesmith
- https://forums.forge-vtt.com/t/save-points/17790

### Pass 137 — fresh marketplace and ordinary-buyer scan

The fresh scan did not reveal a new broad utility category with stronger
evidence. Foundry's package directory currently lists thousands of add-on
modules and a large premium-content catalog; the official premium-content
surface and current adventure listings show that the most legible payment unit
is ready-made content that removes preparation, not another generic utility.
Roll20 permits one-shot and short-adventure listings with a $4.99 minimum, and
current Foundry listings continue to sell prepared adventures, maps, automation,
and presentation as complete purchases.

The player-economy scan is also occupied. Current Foundry listings cover
system-agnostic shops, D&D5e merchant sheets, reusable RPGX shops and traders,
buy/sell/craft workflows, dynamic merchants, post-combat looting, and item
trading. A new “better loot, shops, or inventory” module would be a bundle of
existing solutions rather than a clean gap.

The remaining payment-shaped attendance lead is **Adaptive Drop-In /
Attendance-Resilient Side Session**: a 60–120 minute, no-canon side session
that starts with whoever is present, uses a finished player-visible capsule,
and exits with a safe recap and no hidden state in the main campaign. Paid and
professional GMs have a measurable cost when a booked table collapses, and
current paid games show real per-player session prices. But home tables often
cancel, ghost a character, or run a free one-shot, while Foundry already sells
drop-in adventures and premium interactive content.

**Decision:** do not select a product yet. Run one bounded payer test for
Attendance-Resilient Side Session with paid/professional GMs and high-variance
organizers, while treating home tables as a required negative control. Reject
it if the buyer cannot name saved booking/prep value, prefers a free PDF or
existing adventure, or will not choose a non-zero one-time price. Continue the
fresh search for an ordinary-table problem after this control; do not revive
generic loot/trade, premium content, campaign memory, or World Doctor claims.

Sources:

- https://foundryvtt.com/packages/
- https://foundryvtt.com/article/premium-content/
- https://foundryvtt.com/packages/tag/adventures
- https://roll20partners.zendesk.com/hc/en-us/articles/10844424110999-Who-Can-Sell-on-the-Roll20-Marketplace
- https://foundryvtt.com/packages/shop
- https://foundryvtt.com/packages/merchant-sheet
- https://foundryvtt.com/packages/rpgx-shops-and-traders
- https://foundryvtt.com/packages/simple-shop-craft-5e
- https://foundryvtt.com/packages/yugen-merchant
- https://foundryvtt.com/packages/looter
- https://www.reddit.com/r/FoundryVTT/comments/1ua1vc4/looking_for_module_to_help_with_loot_shops_and/
- https://www.reddit.com/r/startplaying/comments/1v4cjlc/foundryvtt_paid_5session_125session_startplaying/

### Pass 138 — fresh combat replay and learning negative control

The next fresh scan targeted a highly marketable-looking player-facing demo:
replay a fight after it ends so players can understand what happened, see the
decisive moment, and learn from mistakes. The current package audit closes the
broad claim. Battle Replay already records attacks, spells, movement, healing,
saves, conditions, and visibility-safe events; it provides synchronized
player/GM playback, a timeline with rewind and seek, cinematic framing, and
combat analytics. Combat Stats supplies campaign-long damage, healing, kill,
accuracy, and ability comparisons, while Damage Log provides an auditable
damage/healing history with undo and redo. PF2e Combater adds tactical turn
planning and one-click undo.

Community interest in replay and undo is real, but the current workaround is
often screen recording, a system debugger, a damage log, or simply correcting
the mistake. No direct buyer price or recurring ordinary-table payment signal
was found for a second replay/analytics module. A possible residual wedge is a
system-agnostic, player-safe “why did this turn happen?” debrief that explains
visible decisions without exposing hidden GM information, but it has no
product-specific WTP and would inherit difficult system semantics.

**Decision:** reject generic Combat Replay, Combat Analytics, Battle Recorder,
and Undo Assistant as new products. Retain event-envelope, visibility-filter,
timeline, correction, and export contracts as reusable implementation assets.
Only reopen the debrief wedge if a qualified combat-heavy table names a
repeated learning or rules-review cost, rejects Battle Replay/Combat Stats/
Damage Log/native tools, chooses a non-zero price, and completes a pilot.
Dungeon Master's Forge remains backburnered; the ordinary-table search stays
active.

Sources:

- https://foundryvtt.com/packages/battle-replay
- https://foundryvtt.com/packages/combat-stats
- https://foundryvtt.com/packages/damage-log
- https://foundryvtt.com/packages/pf2e-combater
- https://www.reddit.com/r/FoundryVTT/comments/1dmtryd/replay_mod/
- https://foundryvtt.com/packages/df-chat-enhance

### Pass 139 — current player-friction and character-source correction

The fresh community signal is strong: a current PF2e discussion describes
players still finding Foundry character sheets and combat workflows clunky
after many months, and the thread received substantial engagement. The pain is
ordinary-player pain, but the exact current stack is more capable than the
complaint alone suggests. Player Pilot is a free mobile-first control panel;
Foundry Navigator provides keyboard-first, screen-reader-friendly navigation
and player action support; current D&D5e Character Builder and D&D Character
Creator provide guided creation, GM content-source allowlists, house rules,
and progress visibility. Token Action HUD, PF2e HUD, hidden-tab controls, and
tutorial/manual workflows are additional substitutes.

The scan therefore closes several tempting products at once: a generic
player cockpit, another character creator, a source-allowlist manager, and a
mobile control panel. The remaining Player Compass hypothesis is only an
automatic, read-only context explanation that reduces “where do I click?”
without replacing the native sheet. It has no direct price signal and inherits
system-specific semantics, accessibility maintenance, and a crowded free
stack.

**Decision:** keep Player Compass below the attendance payer test and do not
promote it from category frustration. Reopen only for a named repeated player
failure that survives Player Pilot, Foundry Navigator, the exact system HUD,
and current character builders, then earns a non-zero price and pilot.
Retain focus recovery, capability explanation, per-user visibility, and
accessible action-envelope contracts as reusable assets. Dungeon Master's Forge
remains backburnered.

Sources:

- https://www.reddit.com/r/Pathfinder2e/comments/1wobxgg/my_players_hate_using_foundryvtt/
- https://www.reddit.com/r/FoundryVTT/comments/1uj0ssu/dd5e_pf2e_player_pilot_0212/
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/dnd5e-character-builder
- https://foundryvtt.com/packages/foundryvtt-dnd-charecter-creator
- https://foundryvtt.com/packages/token-action-hud
- https://foundryvtt.com/packages/pf2e-hud

### Pass 140 — Adaptive Drop-In current competitor, payer, and portability pass

The attendance-resilient idea survives only as a narrow content-plus-workflow
offer, not as an empty adventure category. Current products already cover
large portions of the job: Drop-in Dungeons sells five minimal-preparation,
pre-walled, lit 5e delves; Prepared! 2 sells twelve short adventures for
off-plan play, although its current Foundry package is only verified through
v12; Dragonshorn's current Dead Mines is a two-to-three-session, fully
prepared, multi-system adventure sold for $12.95; Omnipresence synchronizes
characters, journals, and hotbars across multiple worlds; Oronder handles
Discord access, scheduling, downtime, and rewards for West Marches and normal
campaigns; SessionFlow and other premium adventures occupy the polished
session-workspace and cinematic-content space.

The residual offer is sharper: **Attendance-Resilient Side Session** means a
60–120 minute, no-canon, variable-party capsule that opens with whoever is
present, uses current or temporary characters, records only explicitly
exported rewards/clues, closes with a safe player recap, and never leaves
hidden state in the main campaign. The five-second demo is still legible:
“someone cancels → choose the capsule → everyone is playing → return cleanly.”

The payer is not the average home GM by default. The first test cohort is a
paid/professional GM, organized-play coordinator, or high-variance West
Marches host who can price a lost booked session or preparation block. Home
tables are the negative control. A neutral portable packet can contain the
original story graph, party-size rules, reward export, player-safe recap, and
unsupported mappings; Foundry is first, then Roll20/Owlbear read-only preview.
System-specific stat blocks and art remain separately licensed or original.

**Decision:** keep Attendance-Resilient Side Session as the first empirical
gate, but do not call it market-validated or begin implementation. It must
beat cancellation, a free PDF, an existing premium adventure, a duplicate
world, Omnipresence, Oronder, and the GM's current workflow; produce a real
non-zero price choice; quantify saved booking/prep value; and complete two
pilots. If only professional buyers pay, report it as a viable niche rather
than broad ordinary-table product and continue searching.

Sources:

- https://foundryvtt.com/packages/drop-in-dungeons
- https://foundryvtt.com/packages/kp-prepared2/
- https://foundryvtt.com/packages/drgh-short-story-2
- https://foundryvtt.com/packages/omnipresence
- https://foundryvtt.com/packages/oronder
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/rultmoork
- https://www.reddit.com/r/startplaying/comments/1v4cjlc/foundryvtt_paid_5session_125session_startplaying/

### Pass 2 — campaign memory / recap competitors

Campaign memory is a real pain, but it is not an open category. Quill,
SessionKeeper, RevelWright, Campaign Tracker, Archivist, Daria, RecapVault,
Joe's Real Lore, Edda, and Foundry modules such as Campaign Forge already cover
some combination of recording, transcription, recap, wiki, search, timelines,
and campaign Q&A.

Decision: do not build a generic recap, wiki, or AI campaign-memory product.
Memory can remain an enabling feature, but it is not the lead value proposition.

Representative competitors:

- https://quillgm.com/
- https://www.sessionkeeper.ai/pricing
- https://www.revelwright.com/
- https://campaign-tracker.com/
- https://daria.gg/foundry
- https://recapvault.app/
- https://www.joesrealrolls.com/joes-real-lore/
- https://edda.ink/features/campaign.html
- https://foundryvtt.com/packages/campaign-forge

### Pass 3 — player access, hybrid play, and portability

Players often dislike laptops around a physical table and Foundry core does not
support mobile devices. That creates demand for phone/tablet companions, but
PocketScroll, Swipe VTT, VTT Companion, and other projects already occupy the
basic mobile-sheet space.

Cross-VTT portability is a real user pain, but a universal live campaign format
does not exist. Map portability is becoming practical through Universal VTT
formats; full campaign-state portability remains system- and platform-specific.
This is better as a neutral export/import capability than as the initial product.

Sources:

- https://foundryvtt.com/article/faq/
- https://pocketscroll.app/
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/companion-bridge-free
- https://www.tt-rpg.app/en/features/vtt-export
- https://www.fantasygrounds.com/compare/roll20/

### Pass 4 — improvisation and session-runner competition

The recurring GM complaint is not simply “I need more notes.” Foundry makes
unplanned play expensive because the GM may need a scene, tokens, walls,
lighting, encounter setup, journals, and a safe transition while players are
waiting. Community discussions describe the pressure to prep roughly an hour per
hour played, the difficulty of real-time prep, and the special problem of going
off-script in a VTT.

This category is also populated, but mostly in fragments:

- SessionFlow combines session planning, live widgets, broadcasts, quick scenes,
  and a player panel.
- Quick Scenes creates scenes/handouts from existing files.
- Quick Encounters and Encounter Forge reduce encounter setup.
- RPGM Forge and several AI products help generate content or operate Foundry.
- Forgotten Adventures and asset/map loaders make prebuilt content fast to load.

The remaining gap is a safe, deterministic “rescue the live session” workflow:
take the party's current state and an unexpected player direction, stage one or
more playable options from installed/owned content, preview the changes, and
commit only what the GM approves. Existing products tend to be a planner,
generator, encounter builder, or canvas; they do not obviously own the full
rollback-safe transition from surprise to playable session.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1g6olk5/
- https://www.reddit.com/r/FoundryVTT/comments/107eduix/
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/quick-scenes
- https://foundryvtt.com/packages/quick-encounters
- https://foundryvtt.com/packages/encounter-forge
- https://foundryvtt.com/packages/rpgm-forge

### Pass 5 — campaign resilience / real-life disruption

Scheduling, absences, late arrivals, and forgotten context are recurring
problems across ordinary D&D groups. Existing products handle parts of the
problem: schedulers, recaps, campaign trackers, and cross-world character sync.
The user-facing failure is still visible: a missing player can make the group
cancel, the GM must pilot a character they do not own, or the returning player
rejoins without knowing the current state.

This suggests a narrower, more defensible product than “campaign memory”:

> Keep the campaign playable when the table is incomplete or the party goes off
> plan.

The product would create a session packet for the actual attending roster,
provide a consent-based absence mode for missing characters, prepare a concise
re-entry brief for late/returning players, and preserve explicit state changes
and unresolved hooks. Its differentiator is operational continuity and safe
state transition, not transcription or a wiki.

Sources:

- https://rpg-tracker.com/
- https://dungeonmanager.co/help/campaign-management/session-scheduling
- https://foundryvtt.com/packages/omnipresence
- https://www.reddit.com/r/DnD/comments/1uhxgv6/
- https://www.reddit.com/r/DMAcademy/comments/1r97pv7/
- https://www.reddit.com/r/DMAcademy/comments/1639gm/

### Pass 6 — direct competitor audit of the rescue workflow

The current products are strong, but their boundaries are useful:

| Product | Strong at | Does not obviously own |
| --- | --- | --- |
| SessionFlow | A polished planned/live session canvas, broadcasts, player panel, quick scenes | attendance-aware state branching, absent-PC policy, rollback-safe rescue packet |
| World & Campaign Builder | campaign entities, relationships, prep, live notes, improvised content | committing a safe live recovery transition from party state to playable scene |
| RPGM Forge | fast naming, lore, and improvisation inside Foundry | deterministic campaign-state transition and attendance/re-entry workflow |
| Familiar | AI-operated GM, rules, monsters, NPCs, bookkeeping, fewer-human tables | a GM-controlled, inspectable recovery layer that works without handing the table to an AI GM |
| Quick Scenes | create scenes and handouts quickly from existing media | encounter/state assembly, continuity, approval, and post-session receipt |
| Quick Encounters | instantiate prebuilt encounters quickly | generating the right rescue option from current context or handling absences |
| Encounter Forge | party-calibrated procedural NPC/encounter balance | scene, story, asset, attendance, and rollback integration |
| Campaign Forge | campaign progress, knowledge, player overview, trackers | live session recovery and cross-VTT neutral state packet |
| Omnipresence | sync characters/journals/hotbars across Foundry worlds | incomplete-roster play, re-entry, or off-script session continuation |
| RPG Tracker | scheduling, RSVPs, notes, campaign memory, reminders | direct Foundry world inspection and safe mutation |

This is a narrower and more defensible gap than “AI campaign assistant.” The
product should integrate with these tools where possible rather than reimplement
their strongest features.

### Pass 7 — willingness-to-pay and pricing fit

Foundry customers demonstrably pay, but the strongest fit is a product that feels
like a durable module or content purchase rather than another mandatory cloud
subscription. Foundry itself is a one-time license; user discussions repeatedly
describe paying for adventures, maps, tokens, and selected premium modules while
objecting to accumulating Patreon subscriptions. This does not prove a price
point, but it supports a testable initial offer of roughly $15–35 one-time for a
Foundry module, with optional paid updates or a separate cloud service only if
cross-VTT synchronization proves valuable.

The product must earn that price with a visible session-time outcome. “Better
organization” is weak because free modules already cover it. “Keep tonight's
session running when attendance or player choices change” is a concrete result a
GM can understand before purchase.

Evidence:

- https://foundryvtt.com/article/premium-content/
- https://foundryvtt.com/article/year-in-review-2025/
- https://www.reddit.com/r/FoundryVTT/comments/1g6olk5/
- https://www.reddit.com/r/FoundryVTT/comments/1rt8yfv/
- https://www.reddit.com/r/FoundryVTT/comments/1wl6v4g/

### Pass 8 — recovery and rollback boundary

Foundry has backups and there are old or narrow scene/document backup modules,
but a full live-session undo system is not the same as restoring a world from a
file. The market evidence points to using snapshotting, receipts, and rollback
as trust infrastructure for the resilience product, not selling “backup” as the
headline. The buyer wants to avoid losing a session or making a bad live change;
they do not want to become a database administrator.

Sources:

- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/asset-management/
- https://foundryvtt.com/packages/scene-backup-tool
- https://foundryvtt.com/packages/sephrals-content-backup-restore
- https://www.reddit.com/r/FoundryVTT/comments/1w5ova1/

### Pass 9 — player-side combat friction

Another recurring, ordinary-player problem is combat decision latency. Recent
player and GM discussions describe turns taking five or more minutes because
players stop tracking the board, forget abilities, reread sheets, and ask for
the same facts again. The GM pays in attention and session time even when the
player is the person who needs the help.

The current Foundry ecosystem mostly offers building blocks:

- Action Sheet organizes actions, bonus actions, and reactions.
- HUDs and Foundry Navigator reduce navigation cost.
- Corn's Combat Reminders lets players author trigger-based reminders.
- Action Keeper and similar modules track combat actions.
- A PF2e Third Action Suggester demonstrates demand for contextual suggestions,
  but the concept is not the same as a D&D5e-neutral or D&D5e-first product.

This creates a second finalist:

> Player Turn Coach: show each player the smallest useful set of legal,
> context-aware choices, reminders, and reactions for the current turn, while
> preserving player agency and leaving the GM in control.

The feature must not pretend to know the player's intent or play the character.
It should explain why an option is available, surface forgotten reactions or
conditions, and let the player dismiss or pin reminders. A neutral core can
consume character/action/state facts, with Foundry as the first adapter.

Evidence and competitors:

- https://www.reddit.com/r/DnD/comments/1qibh1j/
- https://www.reddit.com/r/DnD/comments/1k1bwaq/
- https://www.reddit.com/r/DnD/comments/1ozqho7/
- https://foundryvtt.com/packages/sidebar-traits
- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/corns-combat-reminders
- https://foundryvtt.com/packages/action-keeper
- https://www.reddit.com/r/FoundryVTT/comments/1u1621a/

### Pass 10 — adversarial check on the Player Turn Coach

The idea must not be sold as a prettier action bar. Existing modules already
cover that job very well, including a current premium HUD with native D&D5e and
PF2e adapters, free player-authored combat reminders, and a current action
tracker. The differentiated promise has to be contextual decision support:

- infer legal actions from the current actor, turn, resources, targets, range,
  conditions, and triggers;
- surface only a few relevant choices and reaction windows;
- explain the reason without dumping rulebook text;
- learn the player's preferred level of help;
- never roll, spend, move, or speak for the player without an explicit click;
- remain useful in a low-tech/in-person mode where the player uses a phone or
  small second screen.

This makes it a viable finalist, not yet a validated winner. A paid product
must demonstrate a measurable reduction in decision time or “I forgot I could
do that” moments, otherwise free HUDs and reminders are good enough.

Sources:

- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/corns-combat-reminders
- https://foundryvtt.com/packages/action-keeper
- https://foundryvtt.com/packages/sidebar-traits
- https://www.reddit.com/r/DnD/comments/1ozqho7/

### Pass 11 — provisional product decision

The strongest first product is a Foundry-first **Table Momentum Engine**, with
the MVP branded and scoped as **Player Turn Coach**:

> When it is your turn, know what matters now—without asking the GM to pilot
> your character or digging through a sheet.

The first version should target modern D&D5e on Foundry and provide:

1. A compact current-turn panel for action, bonus action, reaction, movement,
   concentration, resources, conditions, and nearby/eligible targets.
2. A short ranked list of relevant options and reaction windows, with reasons and
   links to the player's own installed data rather than bundled rule text.
3. “Teach me” and “quiet mode” controls so the tool supports learning without
   becoming a tactical autopilot.
4. A player phone/second-screen view for hybrid tables, with Foundry as the
   first adapter and a neutral state model underneath.
5. Explicit, player-initiated rolls/actions only; no autonomous combat actions.

The GM-facing value is the measurable outcome: fewer repeated questions, fewer
forgotten reactions/features, and shorter turns. A later paid expansion can add
the session-rescue/attendance workflow, reusing the same live semantic state,
provenance, and safe-transaction infrastructure.

Why this wins the first-product comparison:

- It appears in every combat rather than only during rare campaign disruptions.
- The buyer is clear: the GM buys once for the whole table, while players get
  the benefit without each paying separately.
- It is narrower than an AI GM, campaign wiki, mobile VTT, or cross-VTT importer.
- It can be built deterministically from Foundry actor/combat data, which lowers
  trust and licensing risk compared with generating copyrighted rules text.
- Its neutral core can later accept adapters for Roll20, Fantasy Grounds, and
  other VTTs, but portability is not required to prove the initial product.

This is still a provisional decision pending one empirical test: recruit a few
real Foundry D&D5e GMs, show the same combat with and without the contextual
coach, and ask whether the measured time saved is worth a one-time purchase.

### Pass 12 — licensing, AI-policy, and adapter feasibility

The product is technically and legally cleaner if it is a software module, not
a bundled D&D content pack:

- Foundry permits modules that extend functionality and allows selling package
  content the author has rights to distribute.
- Foundry's licensing guidance warns against republishing book pages, art, or
  other publisher content without rights. The coach should read the user's
  installed actor/item data and link to it rather than ship copied rule text.
- SRD 5.1 and SRD 5.2.1 are available under Creative Commons Attribution 4.0,
  but relying on SRD text is unnecessary for the MVP and would create extra
  attribution/content-maintenance work.
- Foundry's current AI policy permits runtime improvised generation but forbids
  prepared AI-generated user-facing content and automatic collection/injection
  of context from sources the author does not have rights to. A deterministic
  rules/state engine is therefore the safest first release; an optional user-
  initiated assistant can come later.
- Foundry has a supported public API and a normal module packaging path. Other
  VTTs are feasible as separate adapters, but they are not equivalent: Roll20
  automation is tied to its Mod/API capability, while Fantasy Grounds uses
  Lua/XML extensions. The neutral layer should initially export observations and
  suggested actions, not promise universal live mutation.

Sources:

- https://foundryvtt.com/article/licensing-guide/
- https://foundryvtt.com/article/ai-policy/
- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/api/
- https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf
- https://media.dndbeyond.com/compendium-images/srd/5.2/FR_SRD_CC_v5.2.1.pdf
- https://wiki.roll20.net/Mod_Scripts
- https://www.fantasygrounds.com/modguide/extensions.xcp

### Pass 13 — implementation feasibility against current D&D5e data

The current D&D5e system is a better technical substrate than assumed. Its
structured Activities model represents attacks, spells, checks, saves, healing,
summons, teleports, utilities, and other actions, including activation cost,
targeting, range, consumption, visibility constraints, and level/class limits.
The system also now hides activities that are not available under configured
requirements. That means the MVP can begin by ranking and explaining the
system's existing available activities instead of reimplementing all D&D rules.

The hard part is not listing actions; it is contextual ranking and trustworthy
reaction/target inference. The first release should therefore make fewer claims:

- rank activities already visible and usable to the actor;
- show resource/condition context already exposed by the actor and combat state;
- identify obvious reaction windows only where Foundry has a reliable event;
- label uncertain suggestions as reminders, never as guaranteed rules answers;
- capture false suggestions and dismissals for later tuning.

This materially improves feasibility and reduces licensing risk, but it also
means the product's differentiator must be UX and prioritization rather than a
new rules engine.

Sources:

- https://foundryvtt.com/article/content-showcase-2026/
- https://github.com/foundryvtt/dnd5e/wiki/Activities
- https://github.com/foundryvtt/dnd5e/wiki/Active-Effects
- https://github.com/foundryvtt/dnd5e/releases

### Pass 14 — adversarial competitor reconciliation and product selection

The direct competitor audit changes the product decision. A standalone
“Player Turn Coach” is not defensible enough as the first paid product:

- Argon already provides a current D&D5e combat HUD across Foundry 11–14.
- Stylish Action HUD already provides action access, resources, conditions,
  party cards, search, tooltips, and native D&D5e/PF2e adapters.
- Corn's Combat Reminders covers player-authored prompts at combat, roll, HP,
  and rest triggers.
- Action Keeper covers manual action, bonus-action, reaction, and movement
  tracking.
- Average Turn Time shows that timing and combat analytics are also becoming
  available as focused utilities.

That does not disprove the underlying player-friction problem. It does mean a
new product would be competing against several free or patron-supported tools
for a small UX difference, with a GM as the payer and players as the primary
beneficiaries. Contextual ranking and explanations remain valuable, but they
should be a supporting capability inside a larger GM outcome.

The stronger first wedge remains **Campaign Continuity / Session Rescue**:
the GM has a recurring, expensive failure mode when a player is absent, a
session goes off-script, or prepared content no longer fits the actual party.
The product can save a session with an approval-based packet assembled from
the world that already exists. Its value is not “more automation”; it is
avoiding cancellation, dead air, and unsafe improvisational edits. This also
uses more of the DiceBox assets—semantic state, provenance, staging,
read-back, and recovery—while leaving the Player Turn Coach as a later
player-facing enhancement.

The product is still unvalidated. The next gate is behavioral: ask real GMs
about recent disruption events, then measure whether a deterministic
snapshot → rescue packet → approval → read-back workflow materially reduces
recovery time and earns a one-time purchase commitment.

Sources:

- https://foundryvtt.com/packages/enhancedcombathud-dnd5e
- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/corns-combat-reminders
- https://foundryvtt.com/packages/action-keeper
- https://foundryvtt.com/packages/average-turn-time
- https://www.reddit.com/r/DnD/comments/1pqp1h8/players_turns_taking_too_long_needing_advice/

### Pass 15 — semantic session branching and safe-mode gap

The competitor audit found a more precise product boundary. Foundry has native
package backups and snapshots, and current backup modules can restore named
Scenes, Actors, Items, Journals, and other documents. Those are valuable
recovery tools, but they restore stored documents or whole packages; they do
not appear to provide a semantic, session-scoped branch with selective
merge/discard across campaign state.

At the other end of the market, World & Campaign Builder, SessionFlow, Party
Operations, GMhub, and RPG Tracker cover worldbuilding, preparation, session
presentation, logistics, attendance, memory, or recap. Familiar covers
continuation by acting as an AI co-pilot/GM and explicitly supports tables with
different numbers of players, but it is a subscription product with a much
broader automation surface.

The product should therefore narrow from “generate a rescue session” to
**Campaign Safe Mode / Session Savepoints**:

1. Press Start Safe Session and capture a typed, provenance-aware campaign
   checkpoint.
2. Choose the disruption policy: absent character, late player, off-script
   scene, experimental encounter, or correction of a mistaken ruling.
3. Keep canonical campaign state protected while session changes are recorded
   in a temporary semantic branch.
4. Show a readable diff of actor resources, objectives, locations, items,
   combat state, and authored notes.
5. Let the GM approve selected changes, merge them, or discard the branch.
6. Produce a player-safe re-entry brief and a durable receipt.

This is not an AI GM, campaign wiki, scheduler, or whole-world backup. It is a
campaign-state safety layer for the moment when a real table has to keep going
without corrupting continuity. That is a clearer technical gap and a better
fit for DiceBox's semantic IDs, provenance, transaction ledger, read-back, and
recovery assets.

Evidence of pain is strong but not yet monetization proof: community discussions
show groups cancelling, running one-shots, piloting absent characters, or
hand-waving the character away. Existing tools and Foundry's one-time-license
economics support testing a one-time $15–35 GM purchase, but no price should be
treated as validated until buyers choose it in a behavioral test.

Sources:

- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/packages/sephrals-content-backup-restore
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/party-operations
- https://www.gmhub.app/pricing
- https://foundryvtt.com/packages/familiar
- https://familiarvtt.com/
- https://www.reddit.com/r/DnD/comments/1sycmxo/how_do_you_handle_absent_players/
- https://www.reddit.com/r/DnD/comments/1cnn0ea/session_options_with_absent_players/
- https://www.reddit.com/r/FoundryVTT/comments/1fg7r93/

### Pass 16 — exact API feasibility and cross-VTT portability

Foundry is technically viable for the first adapter, but the branch must be
implemented as an application-level semantic ledger rather than assumed to be
a native database transaction. The public API provides useful primitives:

- `Document.toObject()` can extract serializable source data for checkpointing.
- `updateSource()` can apply and validate local changes without committing them,
  which supports dry-run diff generation.
- `validate()` and the Document schema can reject invalid proposals before a
  write.
- `createDocuments`, `updateDocuments`, and embedded-document operations can
  commit approved changes, subject to parent/document ownership and Foundry's
  normal validation rules.
- Flags provide a supported place for module-owned branch metadata, but they do
  not make foreign or runtime-owned state safe to overwrite.

The hard boundary is cross-document atomicity. Actor resources, Items, Scene
embedded tokens, Combat state, Journals, module flags, and external media do
not form one universal merge transaction. The MVP therefore needs a branch
ledger with stable semantic IDs, runtime bindings, preconditions, before/after
hashes, ownership, dependency order, unresolved findings, and compensating
recovery. Exact-stack probes remain mandatory before claiming support for each
document family.

Portability is feasible only as a neutral packet first:

- **Foundry:** full preview/approval/selective-merge adapter is plausible,
  pending the exact runtime fixture.
- **Roll20:** a live adapter would require Mod/API access and is tied to the
  game's creator and Pro subscription; the neutral packet can still be
  exported or consumed by a GM manually.
- **Fantasy Grounds:** campaign data is stored in an XML tree and extensions
  use Lua/XML; a later adapter could produce an import/preview extension, but
  it is not the same live API contract.
- **Other VTTs:** support read-only branch reports or explicit import/export
  before attempting live writes.

This yields a realistic portability promise: “preserve and explain the branch
across VTTs,” not “synchronize any VTT automatically.” Technical feasibility is
moderate-to-high for Foundry and moderate for other VTTs; buyer validation and
exact runtime proof are still open.

Sources:

- https://foundryvtt.com/api/modules/foundry.documents.html
- https://foundryvtt.com/api/classes/foundry.abstract.Document.html
- https://foundryvtt.com/api/modules/foundry.data.html
- https://foundryvtt.com/article/module-development/
- https://help.roll20.net/hc/en-us/articles/29620515876375-Invite-Promote-and-Manage-Players
- https://wiki.roll20.net/Mod_Scripts
- https://www.fantasygrounds.com/modguide/database.xcp
- https://www.fantasygrounds.com/modguide/extensions.xcp

### Pass 17 — willingness-to-pay and monetization stress test

The price evidence supports a paid Foundry product in principle, but not this
product yet:

- Foundry itself is a $50 one-time license, and its publisher guidance
  explicitly supports both one-time module sales and Patreon distribution.
- The official marketplace had more than 500 premium modules from more than
  60 creators within its first months, proving that a paid ecosystem exists,
  but not that a new utility will be purchased.
- Familiar demonstrates willingness to pay for an always-on AI co-pilot at $6
  per month, but it provides a much broader recurring service.
- GMhub is currently free in beta and RPG Tracker is free for hobby tables,
  while community discussions repeatedly describe subscription accumulation as
  a concern. Free alternatives set a high bar for campaign notes, memory, and
  scheduling.

The likely buyer is therefore not “any D&D player.” It is a GM with a weekly
or paid campaign, meaningful persistent state, and a recent cost from
cancellation, absent-player handling, or a bad live edit. Players benefit but
should not need separate licenses.

The product needs a recurring value surface to avoid being an emergency tool
that is purchased once and forgotten. The candidate is a lightweight
checkpoint/session ledger available every session, with Safe Mode branching as
the paid protection layer. This keeps the core promise—protect campaign state—
visible even when no disruption occurs.

Current pricing hypothesis:

- free read-only checkpoint/export;
- $15–25 one-time GM purchase for Safe Mode and selective merge;
- optional $25–35 “major version” upgrade only if maintenance costs justify it;
- no required cloud service or mandatory subscription for the Foundry adapter.

This is a test range, not a forecast. The purchase experiment must compare
$10, $15, $25, $35 one-time, $3/month, and “would not buy,” and must record an
actual commitment choice after the respondent has used the workflow. Stated
interest or a preference poll is insufficient.

Sources:

- https://foundryvtt.com/article/faq/
- https://foundryvtt.com/article/publisher-handbook/
- https://foundryvtt.com/article/premium-content/
- https://foundryvtt.com/article/year-in-review-2025/
- https://familiarvtt.com/
- https://www.gmhub.app/pricing
- https://rpg-tracker.com/
- https://www.reddit.com/r/FoundryVTT/comments/1t5n76x/patreon_funded_modules_is_there_a_better_way_or_am_i_alone_here/
- https://www.reddit.com/r/FoundryVTT/comments/1b7gl0b/monthly_cost/

### Pass 18 — adversarial rejection of the safety moat

The next competitor sweep reduces, but does not eliminate, the gap:

- Foundry's native backups already protect whole worlds and package state.
- Recycle Bin already restores deleted Actors, Scenes, Tokens, Tiles, Items,
  Effects, Journals, and other Documents.
- World CLI already lets an external agent make validated live changes through
  Foundry's Document APIs, without browser automation or direct file edits.
- Campaign Forge covers campaign progress, knowledge, sessions, trackers, and
  rule-driven campaign state.

None of these pages advertises a typed, session-scoped branch with a semantic
diff and selective merge/discard. That is the remaining gap, but “safe” by
itself is no longer a sufficient product promise. The product must demonstrate
that branch/merge solves a real table decision—absent-player continuity,
off-script play, or mistaken-ruling correction—better than a manual backup,
duplicate world, or simple journal entry.

The candidate survives this pass only as a narrow provisional product:

> **Campaign Safe Mode is a temporary campaign branch that lets the group keep
> playing while preserving an auditable choice about what becomes canon.**

It should be rejected if testing shows that users mostly want deletion restore,
whole-world backups, AI continuation, or campaign notes. Those jobs already
have credible alternatives. The buyer test must compare the branch workflow
directly against those alternatives, not against an imagined empty market.

Sources:

- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/packages/recycle-bin
- https://foundryvtt.com/packages/fvtt-world-cli

### Pass 23 — direct rejection of Guardian, Replay, and improvisation suites

The challenger comparison rejects three tempting expansions:

- **Campaign Guardian as a backup product:** Foundry already offers package
  backups, snapshots, automatic pre-migration backups, and restore; The Forge
  offers Save Points, cloning, and autosaves for hosted worlds; compatibility
  warnings and module-management tools are built in or already available.
  Asset closure and a tested launch copy are useful implementation features,
  but not enough of a standalone moat.
- **Campaign Replay as a product:** Battle Replay already records combat,
  reconstructs ghost tokens, supports player-safe playback, and exposes a
  seekable timeline. A generic visual timeline or recap would be a direct
  overlap, not a gap.
- **GM improvisation as a product:** Encounter Forge, RPGM Forge, Escalating
  Encounters, and Perceived Reality already cover generated encounters,
  improvisation, progressive events, and cinematic scene control. “AI rescue
  the GM” is attention-getting but crowded and trust-sensitive.

The defensible remainder is narrower than the marketing surface:

> **Campaign Continuity is a semantic, non-combat session branch that lets a GM
> compare and selectively canonize changes across campaign state, not merely
> restore files, replay combat, generate content, or write a recap.**

The Canon & Branch Board can remain the visible demo, but it is not itself the
moat. The moat hypothesis is the combination of typed branch semantics,
player/GM visibility boundaries, selective merge, provenance, and recovery
receipts across Actors, Items, Scenes, Journals, objectives, and runtime state.

This pass lowers the competition-gap score for the hero surface while
preserving the branch/merge gap as an unverified hypothesis. The buyer test
must now include Battle Replay, Foundry/Forge save points, and the social
fallback of cancelling or running a one-shot as explicit alternatives.

Sources:

- https://foundryvtt.com/article/backups/
- https://forums.forge-vtt.com/t/save-points/17790
- https://foundryvtt.com/packages/mcc
- https://foundryvtt.com/packages/quick-module-enable
- https://foundryvtt.com/packages/battle-replay
- https://foundryvtt.com/packages/encounter-forge
- https://foundryvtt.com/packages/rpgm-forge
- https://foundryvtt.com/packages/escalating-encounters
- https://foundryvtt.com/packages/perceived-reality

### Pass 24 — exact Foundry branch feasibility

The official v14 API supports the primitive operations required for a safe
prototype:

- `toObject`/`toJSON` can produce serializable source data;
- `clone` creates an ephemeral unsaved Document for preview;
- `updateSource` applies and validates local changes and can support dry-run
  diffing;
- `validate` checks complete records;
- `canUserModify` exposes permission checks;
- pre-update and post-update hooks expose change ingress and authoritative
  read-back;
- create/update methods cover world and embedded Documents.

That makes a read-only checkpoint, ephemeral branch, semantic diff, and
GM-authorized selective merge technically plausible. It does not make the
operation transactional. Foundry updates are often differential, arrays may be
fully replaced, dependent Documents may require staged creation, and arbitrary
module-owned or external-media state may not be represented by the same
Document boundary.

The implementation consequence is strict:

1. capture source data plus runtime bindings and ownership metadata;
2. build a branch outside the live world;
3. validate each proposed change locally and against current runtime state;
4. show a semantic diff with hidden-state filtering;
5. commit in dependency order through an active authorized GM;
6. reread every affected Document and write an idempotent receipt;
7. leave unresolved work recoverable when a later operation fails.

This is feasible as a narrow Foundry-first prototype, but the current DiceBox
status explicitly records only static/deterministic M0 evidence. No exact
Foundry 14.367 world, multi-document merge, or two-client authority proof has
been completed. Technical feasibility therefore raises confidence in the
architecture, not in product readiness.

Sources:

- https://foundryvtt.com/api/modules/foundry.documents.html
- https://foundryvtt.com/api/classes/foundry.abstract.Document.html
- https://foundryvtt.com/api/functions/hookEvents.preUpdateDocument.html
- https://foundryvtt.com/api/functions/hookEvents.updateDocument.html
- https://foundryvtt.com/article/users/
- https://foundryvtt.com/packages/campaign-forge
- https://www.reddit.com/r/FoundryVTT/comments/1w6wmqn/how_to_properly_do_backups/
- https://www.reddit.com/r/FoundryVTT/comments/1rvf2o1/

### Pass 19 — player friction, payer identity, and the cross-VTT boundary

The player-side research changes the shape of the opportunity:

- Players do have recurring friction: overloaded character sheets, unintuitive
  rolls, broken or stale sheet state, onboarding difficulty, mobile/second-
  screen needs, and accessibility barriers.
- Those pains are already being attacked by active Foundry packages such as
  Mobile Companion, Swipe, PocketScroll, Foundry Navigator, Party Inventory,
  Quartermaster, and item-trading tools. Foundry also publishes a player
  orientation guide, which confirms the onboarding problem but also makes
  generic onboarding easy to copy or solve with documentation.
- Community evidence is useful for discovering pain, but not for inferring
  willingness to pay. The likely payer remains the GM, host, or paid campaign
  organizer; ordinary players are beneficiaries and adoption constraints, not
  reliable buyers.
- Foundry, Roll20, and Fantasy Grounds do not expose one equivalent live-state
  write boundary. A cross-VTT product should therefore share a neutral,
  read-only session packet and use explicit adapters, not promise one universal
  live companion.

This rejects a standalone “better character sheet/mobile companion” as the
first product. It is a saturated feature category with weak payer clarity. It
does strengthen Campaign Safe Mode if the player-facing output is made useful:
a clean re-entry brief containing only the player's visible state, unresolved
decisions, current objectives, and what changed while they were absent. The
GM still pays for continuity protection; the player experience is the adoption
and retention test.

The candidate remains provisional. If qualified GMs do not pay for the branch
and re-entry workflow after comparing it with backups, duplicate worlds,
journals, and AI continuation, this research must reject it rather than expand
into another generic companion.

Sources:

- https://foundryvtt.com/article/player-orientation/
- https://foundryvtt.com/packages/mobile-companion-dnd5e
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/pocketscroll-socket
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/party-inventory-foundry-v13
- https://foundryvtt.com/packages/quartermaster
- https://www.reddit.com/r/FoundryVTT/comments/1sv9muf/best_module_for_character_sheet_management_for_in-person_sessions/
- https://www.reddit.com/r/FoundryVTT/comments/1jgcbkf/im_afraid_my_players_will_find_foundry_too_complex/
- https://www.reddit.com/r/FoundryVTT/comments/1rhse4s/how_are_you_using_foundry_vtt_for_in-person_sessions/
- https://www.reddit.com/r/FoundryVTT/comments/1rvf2o1/
- https://www.reddit.com/r/Roll20/comments/1sjtyfg/

### Pass 20 — attention, desirability, and go-to-market stress test

Campaign Safe Mode is useful but not naturally attention-grabbing. “Safe Mode”
sounds like infrastructure or insurance: a buyer understands it only after a
failure, while most marketplace browsing rewards a visible outcome. A product
that requires a long explanation is unlikely to win a glance against animated
effects, maps, content packs, and immediate player-facing tools.

The mechanism can become desirable if it is marketed as a dramatic continuity
outcome rather than a safety feature:

- **Headline:** “Keep the campaign moving when the table goes sideways.”
- **Hero moment:** a player misses the session or the party abandons the
  prepared path; the GM presses Continue, plays in a temporary branch, then
  sees a visual canon/branch diff with Keep or Discard choices.
- **Player payoff:** “What did I miss?” becomes a clean, player-safe re-entry
  brief instead of chat archaeology.
- **Emotional promise:** “Take the risky route without breaking the campaign.”
- **Public name:** Campaign Continuity is clearer and more attractive than
  Safe Mode; Safe Mode can remain the internal feature name.

This is not a claim that branding has solved demand. It is a testable
repositioning. Marketing research supports three practical requirements:

1. The first image or clip must make the distinctive branch/merge outcome
   visually salient; attention is a prerequisite to processing the offer, and
   visual packaging elements measurably change attention.
2. A short before/after demo must communicate the use case without narration.
   “Branch, play, compare, keep” is more legible than “transactional campaign
   state protection.”
3. Trust must follow the demo: real GM testimonials, a visible recovery
   receipt, transparent compatibility, and a low-friction free checkpoint or
   export. A meta-analysis of 156 studies found review valence to be the
   strongest measured influence on purchase intention, so social proof cannot
   be postponed until after launch.

The practical go-to-market sequence is: free read-only checkpoint/export;
short visual clips showing disruption-to-continuation; Foundry package listing;
community beta with qualified GMs; real testimonials; then a one-time premium
branch/merge feature. Foundry's own publishing guidance makes self-publishing
easy but says self-published content is not formally announced to its Discord,
so discovery must be designed through the package page, demos, community
channels, and creator partnerships rather than assumed to happen automatically.

The candidate survives the attention test only as **Campaign Continuity**, not
as a generic “Safe Mode” utility. It should be replaced if a five-second
thumbnail/clip test fails: qualified GMs cannot say who it is for, when they
would use it, and why a backup or journal is insufficient. The next research
pass must test the message, not merely ask whether people like the concept.

Sources:

- https://foundryvtt.com/article/publisher-handbook/
- https://foundryvtt.com/article/premium-content/
- https://foundryvtt.com/article/year-in-review-2025/
- https://www.reddit.com/r/FoundryVTT/comments/1ra3i1b/official_marketplace_for_small_creators/
- https://www.reddit.com/r/FoundryVTT/comments/1t5n76x/patreon_funded_modules_is_there_a_better_way_or_am_i_alone_here/
- https://www.sciencedirect.com/science/article/abs/pii/S0148296319300360
- https://www.sciencedirect.com/science/article/pii/S2543925123000323

### Pass 49 — fresh search: World Doctor / Campaign Health

Dungeon Master's Forge remains explicitly backburnered. This pass reopens the
search after the Monster Field Guide was downgraded and looks for a different
job that a Foundry customer could understand in one sentence: **is my world
safe to update and run tonight?**

The new signal is not a request for another player-facing organizer. A recent
Foundry wish-list discussion asks for a cleanup utility that finds empty
macros, duplicate or unconfigured scenes, actors, and items. Other current
reports describe duplicate actors and assets, broken links, orphaned tokens,
and worlds that begin throwing validation errors after a system or module
change. Foundry's own issue tracker documents a concrete example where a
deleted actor left invalid embedded token data that could not be cleanly
removed. These are recurring operational costs, but they are still pain
evidence—not payment evidence.

The category is not empty:

| Existing substitute | What it already covers | Remaining gap |
| --- | --- | --- |
| [Foundry backup guidance](https://foundryvtt.com/article/user-data-backup/) | Full user-data/world backup before updates, with an explicit warning about live database copying | A backup restores yesterday's state; it does not explain whether tonight's world is internally healthy or which repair is safe. |
| [Sephral's Content Backup & Restore](https://foundryvtt.com/packages/sephrals-content-backup-restore) | Named document backups, restore, deleted-document recovery, and a v13–14 interface | Recovery is strong, but it is not a whole-world preflight or compatibility diagnosis. |
| [Lore Reference Board](https://www.foundryvtt-hub.com/package/lore-reference-board/) | Broken UUID/file-path checks and relinking during its own board import/export | It does not audit arbitrary world documents, module dependencies, or load-blocking data-model failures. |
| [Dedupe This!](https://foundryvtt.com/packages/dedupe-this/) | Duplicate entities in a folder | Its listing is only verified for v9 and records development support as ended. That is a maintenance gap, not proof of a buyer market. |
| [fvtt-world-tools](https://github.com/palikhov/fvtt-world-tools) | CLI asset deduplication, renaming, pulling external assets into a world, and trash-based cleanup | It is powerful but technical, file-oriented, and not a guided Foundry-world readiness report. |
| Foundry package/migration system | Package compatibility metadata, migration paths, and version warnings | Metadata and migration are not a smoke test of the user's actual scenes, actors, links, assets, or module-owned behavior. |

The surviving candidate is **World Doctor / Campaign Health**:

> **Before you update or host game night, know what can break—and repair it
> with a reversible plan.**

The first version would be a local, read-only scan with an explicit snapshot
boundary. It would report broken UUIDs and file paths, orphaned scene tokens,
duplicate documents/assets, missing package dependencies, stale compatibility,
invalid document shapes, oversized assets, and links into missing modules. It
would distinguish a confirmed defect from a suspicion, show the affected
document and dependency path, and offer only narrow repairs after a backup,
with an undo/recovery receipt. A disposable-copy rehearsal could later test a
selected world smoke path without opening the live campaign.

This is a stronger buyer hypothesis than a generic player utility, but it is
not a lay-player product. The payer is the GM/host with a valuable or
long-running world, especially one who imports premium content, runs many
modules, or has recently lost time to an upgrade. The eye-catching front door
is “safe to update tonight?” with a red/amber/green preflight and a concrete
repair preview—not “database cleanup.” A one-time $10–$25 price is only an
initial test anchor; no public source found here proves that price will be
accepted.

Portability is credible at the report and evidence layer: a neutral health
record can describe a document reference, asset path, dependency, severity,
confidence, suggested repair, and recovery receipt. Live scans and repairs
remain Foundry-specific first, with later adapters for another VTT only after
their document and backup boundaries are proven. The product must not edit a
campaign in place without an explicit snapshot, and it must never claim that a
green manifest badge equals a tested world.

**Decision:** promote World Doctor / Campaign Health to the newest conditional
candidate and keep Thin Client Player Relay as the other open hypothesis. Do
not implement it yet. It fails the market gate if buyers prefer Foundry's
backup, manual support, or existing point tools; if its scan produces only
generic warnings; or if repair cannot be previewed, reversed, and verified.
The next pass is a buyer-choice test with GMs who have a recent corruption,
broken-link, duplicate-content, or upgrade incident, paired with a synthetic
exact-stack fixture containing known defects. Monster Field Guide remains
conditional and Dungeon Master's Forge remains backburnered.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1jmndmu/
- https://www.reddit.com/r/FoundryVTT/comments/m2h52r/
- https://github.com/foundryvtt/foundryvtt/issues/13498
- https://foundryvtt.com/article/user-data-backup/
- https://foundryvtt.com/packages/sephrals-content-backup-restore
- https://www.foundryvtt-hub.com/package/lore-reference-board/
- https://foundryvtt.com/packages/dedupe-this/
- https://github.com/palikhov/fvtt-world-tools
- https://foundryvtt.com/article/package-management/

### Pass 34 — fresh product search: Foundry Upgrade Guardian

Dungeon Master's Forge is now backburnered as a reusable compiler and
verification engine. This pass reopens the storefront search around a broader,
recurring GM problem: **upgrading Foundry without breaking the campaign that
already works**.

The current public signal is unusually strong for a problem search. A recent
Foundry community discussion about API changes received very high engagement
and describes every major release as a gamble for GMs: modules, systems, and
workflows can break, users may have to relearn procedures, and paid content can
become unusable until its dependencies catch up. One user explicitly says they
pay for modules and that the modules—not base Foundry—are the selling point.
This is not purchase proof, but it is stronger recurring pain evidence than the
episodic Campaign Continuity or basic-item DMF hypotheses. See [Foundry's API
changes are strangling its own ecosystem](https://www.reddit.com/r/FoundryVTT/comments/1wk6be3/foundrys_api_changes_are_strangling_its_own/).

The buyer-facing concept is provisionally **Foundry Upgrade Guardian**:

> **Know what will break before you update.**

The visible workflow would be:

1. scan the actual world, system, modules, versions, declared dependencies,
   settings, and package metadata;
2. show a red/amber/green risk report for the selected world rather than a
   generic compatibility list;
3. create an exact rollback point containing the world and package state;
4. launch a disposable clone on the candidate version;
5. run a small set of GM-defined smoke tests—world load, active scene, party
   sheet, representative item/roll, journal, macro, and critical module flows;
6. compare errors, missing dependencies, settings drift, and changed behavior;
7. issue a plain-language “safe to proceed / hold / restore” receipt.

This is more marketable than “backup” because the hero moment is a decision
before the risky click. It is also more specific than “module manager.” The
product would not claim to prove that every feature works; it would expose
known, observed, and untested areas and let the GM choose which tests matter.

The competitor pass prevents overclaiming:

- Foundry already provides package backups, snapshots, compatibility badges,
  and update controls. Its [Backups and Snapshots](https://foundryvtt.com/article/backups/)
  guidance recommends backing up before system updates, but backup is recovery,
  not behavioral prediction.
- [Module Compatibility Checker](https://foundryvtt.com/packages/mcc) checks
  module compatibility metadata but is verified only through Foundry 10 and
  has not been updated in years.
- [Module Profiles](https://foundryvtt.com/packages/module-profiles),
  [Sephral's Module Loadouts](https://foundryvtt.com/packages/sephrals-module-loadouts),
  and [Settings Vault](https://foundryvtt.com/packages/settings-vault) preserve
  configurations and settings, but do not provide a disposable behavioral
  upgrade test for a specific campaign.
- [Sephral's Content Backup & Restore](https://foundryvtt.com/packages/sephrals-content-backup-restore)
  protects document-level recovery, not package migration or runtime smoke
  testing.

The gap is therefore not “Foundry lacks backups.” It is **world-specific,
evidence-based preflight plus a disposable upgrade rehearsal**. That gap is
plausible but technically demanding: a static scan can miss runtime breakage,
and a clone can still fail to exercise a GM's actual workflow. The product
must make that limitation visible rather than selling a false green check.

Marketability assessment:

| Requirement | Assessment |
| --- | --- |
| Recurring pain | Strong: major core/system/module updates recur, and users may defer them for months |
| Ordinary-GM relevance | Stronger than DMF; the buyer is the GM protecting an active campaign |
| Eye-catching demo | Strong: red/amber/green preflight followed by a failed clone test before the real world is touched |
| Existing alternatives | Strong: backups, snapshots, loadouts, compatibility metadata, “never update” |
| Defensible gap | Moderate: behavioral rehearsal and world-specific critical-path testing |
| Portability | Limited: Foundry-first; the neutral report model can later support other plugin-rich VTTs |
| Willingness to pay | Plausible but not proven; requires a price-choice test after a simulated upgrade |

**Decision:** open Foundry Upgrade Guardian as the new leading product
hypothesis, but do not implement it or call it market-validated yet. The next
pass must test whether GMs choose a preflight/rehearsal tool over “stay on the
old version,” backups, or manual troubleshooting, and whether the result is
worth a one-time $15–30 purchase or a small maintenance plan. DMF remains
backburnered as a possible compiler for the smoke-test and repair layer, not as
the storefront promise.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1wk6be3/foundrys_api_changes_are_strangling_its_own/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/packages/mcc
- https://foundryvtt.com/packages/module-profiles
- https://foundryvtt.com/packages/sephrals-module-loadouts
- https://foundryvtt.com/packages/settings-vault
- https://foundryvtt.com/packages/sephrals-content-backup-restore

### Pass 35 — Upgrade Guardian technical, licensing, and portability adversarial pass

The market hypothesis survives the competitor check only if the product can
perform a useful rehearsal without endangering the user's live world.

Foundry's official package model exposes the right static inputs: package
manifests declare minimum, verified, and maximum core compatibility, required
dependencies, and version-specific release history. Foundry also stores worlds,
systems, modules, and assets in a user data directory and provides setup-time
backups and snapshots. These inputs support a strong preflight report, but a
compatibility badge is still a declaration, not a behavioral test. See
[Package Management](https://foundryvtt.com/article/package-management/),
[User Data](https://foundryvtt.com/article/user-data/), and [Backups and
Snapshots](https://foundryvtt.com/article/backups/).

The live rehearsal changes the implementation boundary. A world-running
module should not copy or migrate its own open database, replace the active
Foundry executable, or claim that its current world is a safe clone of a
future stack. The credible architecture is:

- **Local companion:** discovers the configured Foundry installation and user
  data path, records exact package versions, creates or verifies a rollback
  point, and launches the rehearsal instance after Foundry is closed.
- **Disposable rehearsal world:** a copy or restored snapshot isolated from the
  campaign, with the candidate core/system/module versions selected by the GM.
- **Optional probe module:** registers a small, explicit set of smoke tests and
  emits structured pass/fail/untested receipts from inside the rehearsal.
- **Report viewer:** explains metadata risk, observed runtime errors, selected
  workflow results, settings drift, and the exact limits of the certificate.

This also reduces licensing risk. The product can inspect manifests and
user-owned files, invoke the user's installed Foundry, and store local
reports, while avoiding redistribution of Foundry itself, paid modules,
rulebook text, art, or campaign assets. Foundry's licensing guidance allows
modules designed for Foundry, but package authors remain responsible for rights
to included content; the [licensing guide](https://foundryvtt.com/article/licensing-guide/)
and [Publisher Handbook](https://foundryvtt.com/article/publisher-handbook/)
make that boundary explicit. The companion should therefore be a tool that
operates on the user's installation, not a bundle containing copied premium
packages.

The main technical risks are now visible:

1. a clone may require substantial disk space and a closed Foundry process;
2. a smoke test can miss a workflow the GM did not select;
3. module-owned external state may not live inside the copied world;
4. some packages may refuse to run without an online entitlement or content
   key; and
5. every supported core/system generation multiplies the test matrix.

The product must use evidence labels such as **metadata-compatible**, **probe
passed**, **probe failed**, **not exercised**, and **restore verified**. A green
metadata result alone must never be called safe.

Portability remains secondary. The report schema and package-risk concepts can
be reused for other VTTs, but clone creation, version selection, permissions,
and runtime probes require separate adapters. A cross-VTT promise is not part
of the first product.

**Decision:** Upgrade Guardian remains the leading product hypothesis, but its
first implementation boundary is a Windows/local companion plus an optional
Foundry probe—not a self-modifying module and not a cloud service. The buyer
test must show that this extra setup is worth the confidence and time saved.

Sources:

- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/article/user-data/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/licensing-guide/
- https://foundryvtt.com/article/publisher-handbook/

### Pass 36 — Upgrade Guardian willingness-to-pay and alternative-workaround pass

This pass tests whether the broad Upgrade Guardian promise survives contact with
the alternatives GMs already use.

Foundry itself already added a pre-update compatibility check and built-in
backups in the V11.5 cycle. The current documentation also supports multiple
Windows portable installations, separate User Data folders, and running
different Foundry versions side by side for testing. That is important evidence
against selling a generic compatibility screen: the platform now addresses the
basic “are my packages compatible?” and “can I go back?” jobs directly. See the
[official pre-update/backups announcement](https://www.reddit.com/r/FoundryVTT/comments/14bnijr)
and the current [installation guidance](https://foundryvtt.com/article/installation/).

There is also a paid substitute. The Forge advertises automatic backups and
snapshots in plans from roughly $3.99 to $11.66 per month, while VTT Online
advertises version choice across Foundry 12–14 and automatic backups in plans
from $1 per month. These are not identical to a local rehearsal tool, but they
show that some GMs already pay for reduced operational risk. They also set a
high bar: a local utility must beat “host it somewhere that handles versions
and backups” for self-hosters who specifically want local control. See [The
Forge pricing](https://forge-vtt.com/plans) and [VTT Online features and
pricing](https://vtt-online.com/).

Community workarounds are revealing. GMs commonly wait weeks after a major
release, refuse to update an active campaign, or maintain a separate test
installation and try modules one at a time. That proves the pain is real, but
it also shows a low-cost behavioral workaround. A report alone is unlikely to
earn a purchase.

The product must therefore be reframed, if it survives, as **Campaign Runtime
Locker**:

> **Open each campaign in the version that actually works.**

The paid unit would be a local per-world runtime lockfile containing the Foundry
build, game-system version, module versions, settings snapshot, launch path,
known-good receipt, and optional upgrade rehearsal. The eye-catching result is
not a warning dashboard; it is a one-click “launch campaign safely” action and
an explicit “upgrade candidate failed these tests” comparison.

The direct alternatives for the buyer test are now:

1. stay on the current version and do nothing;
2. manually maintain portable installations and backups;
3. pay for hosting with version switching and snapshots; or
4. buy Campaign Runtime Locker for local control and per-world reproducibility.

**Decision:** do not select the broad Upgrade Guardian as validated. Keep
Campaign Runtime Locker as a conditional, self-hosted product hypothesis. It
must demonstrate a meaningful advantage for self-hosters or multi-world GMs,
and it must win a non-zero price choice against both manual portable installs
and a low-cost hosting plan. If buyers still prefer waiting or hosting, reject
the candidate and continue the product search.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/14bnijr
- https://foundryvtt.com/article/installation/
- https://forge-vtt.com/plans
- https://vtt-online.com/
- https://www.reddit.com/r/FoundryVTT/comments/13xkvjc
- https://www.reddit.com/r/FoundryVTT/comments/1i863nc

### Pass 21 — the visible hero artifact

The current premium catalog makes the competitive problem concrete. Current
products such as Exalted Scenes, Cinematic Cut-ins, Cast & Scene, and Canvas FX
lead with an immediate visual transformation: the table looks different within
seconds. Campaign Continuity cannot compete by making rollback technically
safer while hiding the result in a settings panel.

The strongest productization is a **Canon & Branch Board** generated from the
same semantic branch engine:

- a visible campaign timeline showing the last canonical session;
- a “current branch” lane showing what the group is trying now;
- a readable Keep / Discard comparison of changed scenes, actors, items,
  objectives, and unresolved consequences;
- a player-safe Re-entry Card that can be shown or exported without revealing
  GM-only information;
- a final Canonize action that turns the chosen branch into the campaign record.

This gives the product a real glanceable artifact and a repeatable demo:

> **Branch the session. See the consequences. Canonize what happened.**

It is more desirable than “backup” because it is both operational and
expressive: the GM gets control over disruption, while players get a clear
story of what changed. It remains distinct from a campaign wiki or recap tool
because the board is generated from a typed branch and its merge receipt, not
from free-form notes.

This does not eliminate the go/no-go risk. A pretty timeline would merely move
the product into the crowded campaign-memory category. The hero artifact must
save recovery work and protect hidden state; if users treat it as attractive
notes but still choose a backup or journal, Campaign Continuity should be
rejected. The next test should show the Board without technical explanation
and measure whether a GM can name the action it enables.

Sources:

- https://foundryvtt.com/packages/exalted-scenes
- https://foundryvtt.com/packages/cinematic-cut-ins
- https://foundryvtt.com/packages/cast-and-scene
- https://foundryvtt.com/packages/canvas-fx
- https://foundryvtt.com/packages/premium

### Pass 22 — urgency audit and challenger product

The buyer-pain evidence separates two situations that had been blended
together:

- Missing-player and off-script continuity problems are real, but groups often
  solve them with a one-shot, a “ghost” player character, or cancellation. The
  problem can damage campaign momentum without creating a clear purchase
  moment.
- Foundry update, migration, and data-loss failures create a sharper emergency:
  the GM may have a session scheduled soon and may not know whether the world,
  modules, external assets, and system version can be restored together.
  Community reports repeatedly recommend manual whole-folder backups because
  the built-in or copied backup may not contain everything or may be difficult
  to restore.

The second problem is more marketable but has a stronger obvious competitor:
free backups and manual duplicate worlds. A challenger product therefore
emerges:

> **Campaign Guardian / Save States:** automatically capture a self-contained,
> launchable campaign save state before updates or risky changes; verify module
> and asset closure; let the GM open a disposable safe copy; and provide a
> tested restore or compare path before game night.

Campaign Guardian has a clearer headline—“Don’t let an update kill tonight’s
game”—and a more frequent trigger than absent-player branching. It also shares
DiceBox's identity, provenance, read-back, and recovery assets. It must not be
accepted merely because the fear is vivid: if it is only a nicer backup button,
Foundry's native backup, Recycle Bin, World CLI, and manual zip workflows remain
credible substitutes.

The correct next decision is a head-to-head buyer test:

1. Campaign Continuity: “Continue after disruption; branch, compare, and
   canonize.”
2. Campaign Guardian: “Protect the campaign before updates; verify a restorable
   save state before game night.”

Show both as 30-second visual demos and ask qualified GMs which they would
install, which they would pay for, and which problem they have actually faced
in the last year. Do not merge them into a broad suite before this comparison;
that would hide which outcome earns the purchase.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1fg7r93/
- https://www.reddit.com/r/FoundryVTT/comments/1w6wmqn/how_to_properly_do_backups/
- https://www.reddit.com/r/FoundryVTT/comments/1rvf2o1/
- https://www.reddit.com/r/FoundryVTT/comments/108scq4
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/packages/recycle-bin
- https://foundryvtt.com/packages/fvtt-world-cli

## Candidate scorecard

Qualitative 1–5 scores. These are research hypotheses, not survey results.

| Candidate | Buyer pain | Buyer clarity | Competition gap | DiceBox reuse | Cross-VTT path | Main risk |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Generic campaign memory / recap | 5 | 4 | 1 | 4 | 5 | crowded and subscription-heavy |
| Mobile character companion | 4 | 3 | 2 | 2 | 3 | several active competitors; app/platform cost |
| Full cross-VTT campaign migration | 3 | 3 | 3 | 4 | 2 | platform APIs, legal and data-model limits |
| Rapid improvisational scene builder | 5 | 5 | 3 | 5 | 3 | AI quality and content licensing |
| Campaign resilience / session recovery | 5 | 5 | 3 | 5 | 4 | episodic demand; backups, Recycle Bin, and AI alternatives |
| Campaign Continuity / Canon & Branch Board | 4 | 4 | 3 | 5 | 4 | may collapse into pretty campaign notes; multi-document authority/merge is technically demanding |
| Campaign Guardian / Save States | 5 | 5 | 1 | 5 | 3 | native Foundry and Forge already cover most of the promise; treat as a feature |
| Cross-VTT player dock / mobile companion | 4 | 3 | 1 | 2 | 4 | active competitors; players rarely control the purchase |
| Cross-VTT session-continuity packet | 4 | 4 | 4 | 5 | 5 | read-only adapters and payer proof still required |
| Player Turn Coach / decision support | 5 | 4 | 2 | 4 | 4 | strong existing HUD/reminder competition; keep as a feature |
| New-player onboarding only | 4 | 4 | 2 | 3 | 4 | system-specific UX and many free tutorials |
| Original ready-to-play content line | 4 | 4 | 3 | 4 | 2 | content production and licensing |
| Adaptive Drop-In Capsule | 4 | 5 | 3 | 5 | 3 | attendance wedge is plausible but direct drop-in/one-shot content already exists; buyer choice missing |

## Current leading hypothesis

### Working name: Adaptive Drop-In Capsules

Internal support feature: Campaign Continuity / Campaign Safe Mode

Foundry-first, ready-to-run 60–120 minute side sessions for the GM whose
attendance changed at the last minute. The capsule should let the players who
are present play a complete, player-visible experience and return to the main
campaign without silently changing its canonical state.

Campaign Continuity is no longer the storefront promise. It is a reusable
support layer for no-canon launch, reset, export, provenance, and recovery.
The cross-VTT boundary remains deliberately narrow: Foundry is the first live
adapter, while the portable surface is a neutral capsule packet containing the
story graph, handouts, assets, and player-safe recap. Other VTTs begin as
read-only import/export paths after the Foundry workflow is proven.

### Minimum product promise

1. Let the GM choose a capsule and see its player count, level band, duration,
   system requirements, and campaign-impact boundary immediately.
2. Start from one obvious Foundry action without manually building a second
   world or copying a party by hand.
3. Use current characters or supplied temporary characters while preserving
   the main campaign's state and hidden information.
4. Provide a visible hook, one or two meaningful choices, and a complete
   conclusion within 60–120 minutes.
5. Store progress in a disposable branch with a receipt, reset, and explicit
   export of any reward or consequence; never silently merge into canon.
6. Export the narrative graph, handouts, assets, and player-safe recap as a
   neutral packet, while keeping Foundry-specific Actors, Items, Scenes,
   Journals, and automation in the adapter layer.

### Why DiceBox assets fit

DiceBox already has useful foundations for semantic IDs and relationships,
provenance, compiler/plan generation, safe preview and approval, transaction
ledger, Foundry projection, asset/spatial metadata, evidence/readback, and
repair/recovery. Those assets support the core promise without forcing the
product to become a general campaign wiki.

### Positioning guardrails

- Sell “the session still happens” rather than “AI remembers your campaign.”
- GM buys; players benefit and can optionally contribute attendance/intent.
- Prefer a one-time Foundry product or low-cost major-version updates first;
  current user discussion shows resistance to another mandatory subscription.
- Use installed/owned assets and SRD-compatible scaffolding. Do not ship
  copyrighted adventure text or scrape closed platforms.
- Keep automation approval-based. The product should be safe when an AI or
  heuristic recommendation is wrong.

## Next validation passes before committing

1. Interview/survey target GMs about recent attendance changes, cancellation,
   ghosting, second-world setup, and one-shot preparation; ask what they would
   pay for a no-canon capsule.
2. Compare the candidate against Drop-in Dungeons, Prepared! 2, Dragonshorn,
   Boss Loot, and the GM's existing second-world workflow.
3. Prototype one deterministic Foundry slice: select capsule → launch present
   party → run → reset/export → authoritative read-back.
4. Test the neutral capsule packet against Roll20 and Fantasy Grounds as a
   read-only handoff, not a premature live sync.
5. Check Foundry version/API and SRD/asset licensing constraints before
   producing content. Foundry explicitly recommends public APIs for supported
   module development.

Technical sources:

- https://foundryvtt.com/api/
- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/article/adventure/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/asset-management/

## Decision rule

Do not proceed to product implementation unless at least one narrow promise is
validated by target GMs as a recurring, paid problem and the workflow is shown
to be materially faster/safer than the current combination of modules, notes,
and manual Foundry operations.

### Pass 25 — eye-catching marketability and front-door rejection

This pass treats first-glance desirability as a product constraint. A buyer
does not browse the marketplace looking for a data model; the listing has to
make the user, moment, and payoff legible before a technical explanation.

The current Foundry catalog is a crowded visual market: the package index
currently lists thousands of add-on modules and more than a thousand premium
packages. The strongest current product pages lead with a concrete, player-
visible transformation and support it with screenshots, video, or an
immediately understandable interaction:

- Campaign Codex shows interactive dashboards, timelines, galleries, shops,
  and relationship trackers.
- World & Campaign Builder shows a complete worldbuilding-to-live-play loop,
  including mindmaps, sessions, connected entities, and optional generation.
- Clues Kit shows private clue delivery, animated reveals, player decks, and a
  shared investigation board.
- Click Adventure shows a visual scene graph, player navigation HUD, scene
  transitions, and per-player movement.
- SessionFlow shows an explicit player-facing Chronicle, Fellowship, Compass,
  Scribe, and broadcast-oriented presentation surfaces.
- Phil's Quest Tracker sells a modern player quest log with visible states,
  quest givers, objectives, rewards, and per-player visibility.

These examples do not prove sales volume, but they establish the attention
standard a new listing must meet. Foundry's own publishing guidance also
supports premium modules and ready-to-use content as the normal paid path.

The marketing evidence is directionally consistent. Controlled product-
presentation research finds that richer visual presentation can affect
purchase intention or purchase likelihood, but the effect is product- and
context-dependent; it is not a license to substitute polish for utility. A
large meta-analysis of online-review research found that review valence,
usefulness, credibility, and source similarity all correlate with purchase
intention. The practical implications for this project are: show the outcome
in a short clip, reduce uncertainty with a real workflow and compatibility
proof, and accumulate trustworthy reviews or demonstrations after the first
users use it.

Campaign Continuity fails the front-door test in its current form:

1. **Safe Mode** sounds like invisible infrastructure and makes the buyer
   imagine a failure that may happen only occasionally.
2. **Undo the Session** is more attention-grabbing, but suggests destructive
   reset, retconning, or an unsafe time machine; that creates trust friction.
3. **Continue After a Disruption** is clear but not visually immediate and is
   still weaker than free backups, duplicate worlds, notes, or simply changing
   the night's plan.
4. **Canon & Branch Board** can produce a good screenshot, but existing
   dashboards, timelines, clue boards, and campaign organizers make a board
   alone look like another campaign-information surface. The branch/merge
   operation remains the technical gap, yet it is difficult to understand in a
   five-second browse and only matters during selected edge cases.

The adversarial conclusion is therefore a no-go for Campaign Continuity as
the first marketed product. It should remain a reusable branch, provenance,
visibility, and recovery subsystem rather than the storefront promise. A
future message test can revive it only if qualified GMs choose it over their
actual backup/notes/duplicate-world workflow after a silent demo and a real
purchase choice.

### Candidate reopened after the Continuity no-go: Adventure Capsules

The next candidate is **Adventure Capsules**: short, ready-to-run,
player-visible Foundry experiences sold as a complete evening rather than as
an editor or safety layer. A capsule would combine a small set of prepared
scenes, a clear opening hook, interactive handouts or clues, one-click
reveals/transitions, bounded choices, and a clean end-state. Campaign
Continuity's branch/reset machinery becomes a supporting feature so the GM
can rehearse, reset, or replay a capsule without corrupting the campaign.

Its first-glance promise is stronger: “Open this tonight and the table gets a
finished, cinematic experience.” It also has a recurring purchase pattern
(new capsules), a clear payer (the GM/host), and a portable content boundary:
the narrative packet, handouts, and player-safe exports can travel to another
VTT even if the richer Foundry automation cannot. This is only a candidate,
not a selection. It must still survive a competitor, price, licensing,
runtime, and buyer-choice pass; ready-to-run premium adventures and cinematic
content are a serious comparison set.

The next continuation point is a direct **Adventure Capsules** pass: map the
current premium adventure/content supply, identify a repeatable underserved
format rather than merely “more maps,” compare one-time prices and update
expectations, and test whether a five-second listing makes a qualified GM
want to run one this month.

Sources:

- https://foundryvtt.com/packages/
- https://foundryvtt.com/packages/campaign-codex
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/packages/clue-cards
- https://foundryvtt.com/packages/click-adventure
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/phils-quest-tracker
- https://foundryvtt.com/article/publisher-handbook/
- https://www.sciencedirect.com/science/article/pii/S0969698919310902
- https://www.sciencedirect.com/science/article/pii/S0167923619300752
- https://www.sciencedirect.com/science/article/pii/S2543925123000323

### Pass 43 — fresh-search reset and the live drawing/whiteboard lead

Dungeon Master's Forge is now explicitly backburnered. This pass restarts the
product search from an ordinary Foundry customer's recurring problem rather
than extending the item-compiler thesis.

The first fresh signal was live drawing and collaborative whiteboarding. A
recent Foundry community discussion asks for better drawing tools and says an
Excalidraw-like layer would command real payment. A newer wish-list discussion
repeats the request for better drawing/text controls and collaboration, while
also describing groups that use Miro for collaborative session preparation.
That is a useful demand signal, but it is not yet a product decision or a
measured willingness-to-pay result.

The competitor audit closes the broad version of the idea. Foundry already
has native freehand, shape, text, and permission-aware drawings. Precise
Drawing Tools, Alternative Drawing Tools, Better Text Drawings, Wayfinder Wall
Control, and Dungeon Draw cover precision, text, walls, dungeon sketching,
player mapping, and export. Owlbear Rodeo supplies a polished drawing/fog/text
workflow in another VTT, and Miro is a familiar general-purpose collaborative
whiteboard. Most importantly, [MapForge](https://foundryvtt.com/packages/mapforge)
is now a live paid Foundry v14 map studio with asset libraries, floors,
textures, walls, doors, lighting, atmosphere, prefabs, animation, and flatten/
export workflows. A generic “better drawing layer” would therefore enter an
active paid category with several free substitutes.

The only narrower possibility found is a map-to-playable-geometry and package
completeness audit: detect whether a map's walls, doors, lights, levels, and
player-safe drawing/export are ready for play. That is more likely a creator
or publisher tool than the broad player-facing product requested here, and it
would still need to beat MapForge and manual review. It is retained as a
reusable component idea, not advanced as the product.

**Decision:** reject generic drawing/whiteboard as a standalone product. Keep
the community signal and the geometry/export-audit concept in the research
record, but reopen the search for a player-facing problem with a more visible
payoff.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_development/
- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/precise-drawing-tools
- https://foundryvtt.com/packages/dungeon-draw
- https://foundryvtt.com/packages/wayfinder-wall-control
- https://docs.owlbear.rodeo/docs/drawing/
- https://miro.com/pricing/
- https://foundryvtt.com/packages/mapforge

### Pass 44 — progressive monster knowledge / Creature Field Guide candidate

The next fresh lead targets a recurring ordinary-player problem: a character
may know something about a creature even when the player does not, but the
table has no trustworthy, repeatable way to record, reveal, or revisit that
knowledge without either metagaming or making the GM maintain another set of
notes.

The 2024 D&D rules make this more legible through the **Study** action. The
official rules describe Intelligence checks for studying memory, books, clues,
and knowledge, with Arcana, History, Investigation, Nature, and Religion
providing distinct knowledge domains. The action is not itself a complete
Foundry workflow; it is a standard-rule hook that can make the value visible to
players during play.

There is direct category evidence but not a clean current D&D5e winner.
[ANewFoe](https://foundryvtt.com/packages/anewfoe) hides unknown monsters,
maintains per-player known lists, changes the token picture, reveals stats
after identification, and supports GM approval and DC modifiers. Its listing
targets Foundry 12+ and shows an older v12 verification/update trail, so it is
proof that the job has been implemented—not proof that a current v14/D&D5e
customer has a fully supported solution. [PF2E Bestiary Tracking](https://foundryvtt.com/packages/pf2e-bestiary-tracking)
is current on Foundry v14 and selectively reveals bestiary information, which
validates the category while also showing that system-specific data boundaries
matter.

The candidate product is **Monster Field Guide** (working name **Creature
Codex**), with this player-visible promise:

> Your character knows, even when you don't.

The hero moment is deliberately visual: an unknown silhouette or alias is
targeted; the player uses Study or a GM-approved evidence action; a field-guide
card reveals a tier such as identity/type/behavior, visible traits, a
resistance or weakness, or deeper lore; the result persists in that player's
campaign codex. The record can cite evidence such as “saw it regenerate,” a
successful check, or GM-entered research. Optional uncertainty/rumor states
can preserve mystery instead of turning the feature into a statblock dump.

This is a stronger eye-catching surface than Safe Mode or a generic HUD: the
demo visibly changes what the player can know. It also has a normal-play hook
for D&D5e rather than requiring a rare disaster. The likely payer is still the
GM, especially one running mystery, horror, monster-hunt, or a long campaign
with repeated creature encounters; players are the users and beneficiaries.
No source checked in this pass proves that those GMs will pay, and no price is
being claimed as observed market data.

**Decision:** retain Monster Field Guide / Creature Codex as the new leading
conditional candidate. Do not implement it or treat the category evidence as
market validation until the adversarial buyer, rights, portability, and exact
runtime gates in Pass 45 are completed.

Sources:

- https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary
- https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game
- https://foundryvtt.com/packages/anewfoe
- https://foundryvtt.com/packages/pf2e-bestiary-tracking
- https://www.reddit.com/r/DnD/comments/sm0x4o/how_do_you_present_monster_lore_to_your_players/
- https://www.reddit.com/r/DnDBehindTheScreen/comments/t6wg7sv/a_system_for_knowledge_checks_about_creatures/
- https://www.reddit.com/r/DnDBehindTheScreen/comments/q6t3wg/creature_knowledge_check_rules

### Pass 45 — adversarial buyer, rights, portability, and feasibility gate

This pass tests whether Monster Field Guide is a product or merely an
interesting feature.

**Who would pay:** the decision-maker is a GM who has recently had a
metagaming dispute, repeated monster encounter, mystery/horror investigation,
or long-campaign knowledge problem. A player saying “I would use this” is
adoption evidence only. The payer must be willing to install it for a real
group and choose a non-zero one-time price. The candidate should be compared
against the GM's current notes, a manual secret journal, reveal macros, the
2024 Study action without a module, ANewFoe where usable, and a system-native
tracking tool. If the candidate feels like extra bookkeeping, it fails.

**Product boundary:** the first version should not promise an encyclopedia of
monster lore. It should manage identity, evidence, reveal tiers, player
visibility, GM approval, and a persistent per-player codex using the customer's
installed actors and GM-entered/user-provided notes. It should not ship copied
statblocks, Monster Manual prose, protected art, or a hosted content library.
That keeps the rights boundary closer to a tool operating on customer-owned
data and leaves content quality to the GM or separately licensed publishers.

**Portability:** a neutral knowledge packet can represent a creature identity,
player, evidence event, reveal tier, provenance, uncertainty, and capability
requirements. The Foundry adapter must resolve Actors, permissions, rolls, and
chat/cards; PF2e, Roll20, or another VTT would need separate adapters. A
cross-VTT claim is therefore limited to the packet/export model until a second
runtime proves equivalent authority and privacy behavior.

**Technical gate:** the exact disposable fixture should seed synthetic monsters
and two users, then test unknown-state projection, Study or an equivalent
typed check, GM-approved tiered reveal, per-player persistence, reconnect,
duplicate suppression, permission denial, and authoritative read-back on the
local Foundry 14.367 / D&D5e 5.3.3 target. It must not mutate an existing
campaign world. The target's actual D&D5e Activity and hook surface must be
inspected before any claim that Study is natively automated; a safe fallback
can be a bounded GM action or chat/card workflow.

**Buyer gate:** recruit 10–12 qualified GMs with a recent relevant incident.
Show a silent 20–30 second sequence from unknown creature to Study to a
tiered, player-safe field-guide reveal. Then compare the candidate with the
GM's real workaround and ask for a live choice of $5, $10, $15, $20, or no
purchase plus a scheduled pilot. Do not count a survey-only “interesting” or a
player-only preference as validation.

**Decision:** Monster Field Guide remains conditional, not approved. It is the
fresh lead worth testing next because it combines a visible player payoff, a
newly explicit rules hook, and a defensible data/provenance boundary. It must
be rejected and the search reopened if the buyer trial produces no recurring
incident, no preference over the real workaround, no non-zero price choice, or
no scheduled pilot, or if the exact fixture cannot protect hidden knowledge.

The next continuation point is the buyer protocol plus the disposable runtime
fixture—not a feature build in the DMF or DiceBox repositories.

Sources:

- https://foundryvtt.com/packages/anewfoe
- https://foundryvtt.com/packages/pf2e-bestiary-tracking
- https://foundryvtt.com/article/licensing-guide/
- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/api/
- https://github.com/foundryvtt/dnd5e/wiki/Activities
- https://github.com/foundryvtt/dnd5e/wiki/Hooks

### Pass 46 — fresh sweep of player logistics and campaign-memory substitutes

The search was widened again to recurring table jobs that ordinary players
actually touch: item/currency exchange, shared loot, campaign notes, and
player-accessible memory. These are attractive because they happen every
session, but the substitute audit is decisive.

The recent Foundry wish-list discussion includes a request for a simple player
trade window: drag items and currency into an offer, let the other player
accept, and post a small summary. That is a real usability complaint, but it
is not an open market. [Item Piles](https://foundryvtt.com/packages/item-piles/)
already advertises robust player-to-player trading and merchants on current
Foundry versions. Give Items Between Players, Let's Trade 5e, Shop, and the
paid/free-tier RPGX Loot Crate cover narrower or broader versions of the same
transaction. The requested “simple” version may be better UX, but it would
still compete with mature, familiar, and often free alternatives.

Campaign memory has the same problem at a larger scale. Foundry's core
journals and map notes, Campaign Codex, World & Campaign Builder, external
LegendKeeper/Obsidian workflows, and the current paid Familiar module already
cover linked notes, player-visible lore, search, campaign memory, and AI
assistance. A new general-purpose campaign wiki or AI memory layer would be a
crowded product with high privacy, support, and content-quality obligations.

**Decision:** reject generic trade, treasury, campaign wiki, and campaign-memory
products as fresh wide-market candidates. Preserve transaction receipts,
permission-safe shared state, relationship links, and player-note components as
reusable implementation assets. This pass strengthens the case for testing a
narrow experiential product whose value is not “organize your campaign.”

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/item-piles/
- https://foundryvtt.com/packages/give-item-to-player
- https://foundryvtt.com/packages/lets-trade-5e/
- https://foundryvtt.com/packages/rpgx-loot-crate
- https://foundryvtt.com/packages/shop
- https://foundryvtt.com/packages/campaign-codex
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/packages/familiar
- https://www.reddit.com/r/FoundryVTT/comments/1vt5hrz/best_way_to_make_a_wiki_for_the_players/

### Pass 47 — Monster Field Guide direct-competition re-audit

This pass treats the leading candidate as guilty until it survives a direct
comparison with the closest live alternatives.

ANewFoe is a stronger competitor than the earlier pass conveyed. Its current
listing explicitly advertises hiding unknown monsters, per-player known state,
token-image switching, basic-stat reveals, bulk knowledge upload, GM approval,
and DC modifiers. That is almost the whole baseline product. The same listing
shows the module's latest available release as 1.0.3, Foundry 12+ / Verified
12, with an old update trail, while the official D&D5e system is now actively
maintained and has a current 6.0.x line. This creates a possible maintenance
and modernization gap, but it does not prove abandonment, demand, or a buyer
willing to migrate.

PF2E Bestiary Tracking is a second useful comparator: it is current on Foundry
v14 and provides a GM/player bestiary with selective reveals. Campaign Codex
and Familiar show that current Foundry users will adopt persistent, player-safe
knowledge surfaces, but they also make a broad “codex” pitch less distinctive.
Community discussions still show a strong recurring knowledge problem: tables
use tiered DCs, lore-first reveals, notes, and manual judgment for questions
such as “what would my character know?” The existence of a problem is therefore
better supported than uniqueness or price.

The only defensible wedge left is not “a bestiary” or “monster stats.” It is a
modern **evidence-to-knowledge layer for D&D5e**:

- start from the 2024 Study action or an observed event, not a blank database;
- let the GM define or approve a tiered, rights-safe fact;
- show each player only what that character has earned or observed;
- record provenance and uncertainty, including incorrect rumors if desired;
- persist the result across sessions and exports; and
- make the result visually immediate in play, with a silhouette/alias becoming
  a trustworthy field-guide card.

Even this is only a conditional gap. ANewFoe may be sufficient for a buyer,
the audience may be limited to mystery/horror/monster-hunt tables, and the GM
may prefer a journal or chat macro. The candidate must therefore be tested in a
side-by-side install or mock workflow against ANewFoe where the exact target
can support it, against manual notes, and against a minimal Study-only flow.

**Decision:** keep Monster Field Guide as the leading *research candidate*,
but downgrade confidence after this audit. Do not call it marketable or start
implementation until the comparison produces a real GM price choice and a
scheduled pilot. If the modernisation claim is the only reason it seems new,
reject it and reopen the search again.

Sources:

- https://foundryvtt.com/packages/anewfoe
- https://foundryvtt.com/packages/pf2e-bestiary-tracking
- https://foundryvtt.com/packages/dnd5e
- https://foundryvtt.com/packages/campaign-codex
- https://foundryvtt.com/packages/familiar
- https://www.reddit.com/r/DMAcademy/comments/1kmgwjc/what_do_i_know_about_this_monster_how_do_yall/
- https://www.reddit.com/r/FoundryVTT/comments/1mvo99h/how_do_you_do_your_campaign_tracking/

### Pass 48 — exact disposable runtime probe for the candidate boundary

The local disposable fixture was started with the explicit target
`dbx-test-world` on Foundry 14.367 / D&D5e 5.3.3, using the package-only
fixture path. The supervisor receipt passed the exact data-path, world,
version, process, port, and HTTP-readiness checks. The Foundry setup/join UI
also rendered at the expected target. The probe recorded zero world-document
writes and no access to the Ballad campaign data.

The probe then reached the important blocker rather than hiding it. The
fixture had zero Users, and its join page exposed only free-text credentials;
the synthetic GM did not exist. Foundry's native setup/admin boundary was
required to create that user. The native setup page was reachable after the
disposable admin gate, but the user-specific hidden-state test could not be
completed without performing that separate native user-management operation.
No raw LevelDB/storage edit, direct database insertion, arbitrary script, or
campaign-world fallback was used. The optional Foundry usage-data prompt was
dismissed without enabling sharing.

The fixture was then stopped through its ownership-aware supervisor and
authoritatively reread as `STOPPED` with no listener on port 30002. This is
useful technical evidence, but it is not a Monster Field Guide readiness
claim: exact runtime startup is proven; per-user projection, GM approval,
Study/equivalent action, persistence, reconnect, duplicate suppression, and
hidden-state protection remain untested.

**Decision:** retain the candidate as conditional and keep implementation
blocked. The next technical continuation point is one native setup operation
creating only the synthetic GM and Player3 accounts, followed by a two-client
read/permission fixture. The buyer comparison must still run against ANewFoe,
manual notes, and Study-only before product selection.

Evidence boundary:

- `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\thin-client-foundry-fixture-20260926-01`
- `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\tools\foundry-fixture-supervisor.mjs`
- Foundry 14.367 / D&D5e 5.3.3 supervisor start and stopped-state receipts

### Pass 37 — Session Health Autopsy and player-lag diagnosis pass

This pass reopens the product search with Dungeon Master’s Forge explicitly
backburnered. It starts from a problem ordinary players feel directly: the
table becomes slow, choppy, or unusable for one or more people, while the GM
cannot quickly tell whether the cause is a browser/GPU, client hardware,
network, scene assets, chat growth, server load, or a module interaction.

The pain is current and concrete. Recent community reports describe delayed
chat and sheets, low frame rates, long-session degradation, old or mobile
devices that cannot join, and groups losing confidence in a Foundry setup.
One report specifically says that the available module-bisection workflow is
clumsy when the problem cannot be reproduced reliably. Another describes the
diagnosis as having “a million things” that could be wrong. These are strong
pain signals, but they are not purchase evidence.

The category is already crowded. [Axon’s Performance Monitor](https://foundryvtt.com/packages/axons-performance-monitor)
offers live monitoring, scene/module diagnostics, benchmarks, reports, and
recommendations. [Performance Optimizer](https://foundryvtt.com/packages/performance-optimizer)
offers per-player profiles, GM controls, low-FPS warnings, and a shared
benchmark. [Prime Performance](https://foundryvtt.com/packages/fvtt-perf-optim)
targets token UI rendering, while [Find the Culprit](https://foundryvtt.com/packages/find-the-culprit)
automates repeated-halving of enabled modules. A new FPS chart, optimizer,
or module bisection tool would therefore be an immediate no-go.

The remaining hypothesis is **Session Health Autopsy**:

> **Find who is lagging and why before game night.**

The product would guide a short, consented incident capture rather than leave
the GM with a dashboard. It would identify affected clients, reproduce the
symptom in a disposable or low-risk scene when possible, correlate client
FPS/latency/browser-GPU signals with scene assets and module events, and
produce a ranked action plan. A reversible degraded-session profile could
then lower effects or asset pressure for the affected client without changing
the whole table. The report must label suspicion versus proof and must not
upload raw chat or campaign content.

The buyer is probably the GM or host, not an individual player: that person
controls the stack, receives the complaints, loses session time, and decides
whether to install or buy a tool. The purchase test must therefore recruit
GMs who recently lost meaningful play time or had a player unable to join,
not people who merely agree that lag is annoying. Compare the candidate with
the GM’s current workaround, Axon or Performance Optimizer where applicable,
Find the Culprit, support advice, and simply lowering player settings.

Portability is plausible only at the evidence layer. A neutral session-health
record can describe client capability, asset budget, event timestamps,
latency/FPS samples, suspected cause, confidence, and recommended action.
Collection and remediation remain adapter-specific because each VTT exposes
different client, module, and scene boundaries. The first release should be
Foundry-first and local/privacy-preserving; cross-VTT adapters are a later
option, not a launch promise.

**Decision:** reject generic performance monitoring as a product. Retain
Session Health Autopsy as a conditional candidate only. It advances to a
buyer trial if and only if affected GMs prefer the guided diagnosis and
reversible session profile, choose a real non-zero price, and use it on a
recurring incident. No implementation or pricing conclusion is justified
yet. Dungeon Master’s Forge remains a reusable compiler/probe asset on the
backburner, not this product’s storefront promise.

The next continuation point is a three-way buyer and feasibility test: run a
representative lag incident across at least one affected client and one
healthy client; compare current troubleshooting with the existing point
solutions and the guided workflow; measure minutes lost, time to diagnosis,
false leads, remediation success, recurrence, privacy acceptance, and a real
price choice.

Sources:

- https://foundryvtt.com/packages/axons-performance-monitor
- https://foundryvtt.com/packages/performance-optimizer
- https://foundryvtt.com/packages/fvtt-perf-optim
- https://foundryvtt.com/packages/find-the-culprit
- https://www.reddit.com/r/FoundryVTT/comments/1q78dd8/how_to_troubleshoot_source_of_lag_after_upgrading/
- https://www.reddit.com/r/FoundryVTT/comments/1pomu46/system-agnostic-foundry-slowlaggy-for-some/
- https://www.reddit.com/r/FoundryVTT/comments/1tj3c9m/how_to_increase_performance_for_players_forge/

### Pass 38 — Low-bandwidth player relay and mobile-companion adversarial pass

The next fresh candidate is driven by an even more obvious player problem:
some people cannot comfortably join or play a Foundry game on an old laptop,
phone, or tablet. Foundry’s own [FAQ](https://foundryvtt.com/article/faq/)
still says mobile devices are not supported by the core software. Community
reports describe screen sharing, changing VTTs, or making one player a
spectator as the fallback when the client cannot load or render the game.

This is a real market signal, but it is not an empty category. [Swipe VTT](https://foundryvtt.com/packages/swipe-vtt)
offers touch controls, mobile sheets, chat, and performance adjustments.
[Sheet Only](https://foundryvtt.com/packages/sheet-only) strips a player client
down to character sheets, and [Foundry Tabletop Helpers](https://foundryvtt.com/packages/foundry-tabletop-helpers)
offers touch sheets, live updates, and printable player material. [PocketScroll](https://www.pocketscroll.app/)
goes further with character actions, combat, interactive maps, GM tools, and
free player invite links under a GM subscription. Companion Bridge/VTT
Companion is another active app-and-module route. Meanwhile, [Roll20 is
investing in a browser-first mobile experience](https://blog.roll20.net/posts/were-retiring-the-roll20-mobile-app-to-build-something-better/)
and reports phone-ready D&D sheets with synchronized actions.

Therefore “mobile character sheet,” “touch controls,” “phone app,” and “map
companion” are all rejected as generic products. The only remaining wedge is
a **low-bandwidth browser relay**:

> **Join the game from almost any device without loading the whole VTT.**

The relay would be deliberately narrower than a second Foundry client. A GM
would share a short invite; the player would receive current character
actions, rolls, chat, turn state, and a lightweight scene/position view without
rendering every animated tile, effect, and asset. The value proposition is
device reach, quick first action, and lower resource use—not another full
mobile VTT. That is still only a conditional gap: PocketScroll already has an
invite flow, and existing modules partially solve the same job.

The portability story is reasonable at the protocol layer: character summary,
turn state, dice request, chat, and lightweight scene packets can be neutral.
Rules resolution, permissions, movement, effects, inventory writes, and
system-specific actions remain separate adapters. A cross-VTT promise would
also increase support cost, so Foundry should remain the first and only
implementation target until the weak-device test succeeds.

**Decision:** reject a generic mobile companion. Keep the low-bandwidth relay
as a secondary hypothesis, behind Session Health Autopsy, and test it only
with a real group containing a weak or unsupported client. It must beat the
existing companion products on join success, first useful action, setup
friction, resource use, and a GM’s real price choice. If it does not, close
the candidate and retain only the neutral player-action packet as a reusable
asset.

Sources:

- https://foundryvtt.com/article/faq/
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/sheet-only
- https://foundryvtt.com/packages/foundry-tabletop-helpers
- https://foundryvtt.com/packages/companion-bridge-free
- https://www.pocketscroll.app/
- https://blog.roll20.net/posts/were-retiring-the-roll20-mobile-app-to-build-something-better/
- https://www.reddit.com/r/FoundryVTT/comments/1w7wd34/one_of_my_players_cant_run_foundry_on_their/
- https://www.reddit.com/r/FoundryVTT/comments/1pomu46/system-agnostic-foundry-slowlaggy-for-some/

### Pass 39 — Player-device payer and price-anchor pass

The mobile pass found a crowded category, so this pass asks the sharper
question: is there evidence that a real payer values the player-device
problem enough to buy a solution, and what is the honest price anchor?

A current Foundry companion discussion describes the concrete hybrid-table
problem: the GM projects the game, while laptops for every player crowd the
physical table. The same thread contains explicit self-reported willingness to
pay around €20–€25, a lower one-time-price buyer, and a competitor response
that settled on a €15 Lifetime Link for the premium D&D5e module. This is
useful payer evidence, but it is directional evidence from one product thread,
not conversion data or a representative survey. See the [VTT Companion
discussion](https://www.reddit.com/r/FoundryVTT/comments/1tb3dru/my_partner_and_i_built_a_character_sheet_mobile/).

The discussion also closes the broad product space. VTT Companion advertises a
sub-5MB phone app, real-time synchronization, offline cached sheets, direct
actions, Foundry v13/v14 support, and system-specific modules. PocketScroll
uses a GM subscription with free player invite links and provides character
actions, combat, maps, and GM tools. A new full mobile character app would
therefore be competing on a surface that already has working products,
updates, and established pricing models.

The remaining candidate is **Thin Client Player Relay**:

> **Join the game from almost any device without loading the whole VTT.**

This is intentionally narrower than a mobile companion. The player would use
a browser or installable web shortcut; the relay would render only current
character actions, rolls, chat, turn state, and a lightweight map/position
view. It would avoid full Foundry canvas rendering, app-store installation,
and unnecessary asset transfer. Foundry remains authoritative for permissions,
Activities, Midi-QOL workflows, effects, movement, and inventory. The relay
sends typed requests and displays verified results; it does not duplicate the
rules engine or write directly from an untrusted client.

The first price test should use one-time GM-paid anchors of €15, €20, and €25.
The GM is the likely payer because one purchase can serve the table, while the
players create the adoption pressure. A neutral action/scene packet could
later support Roll20 or another VTT, but every runtime adapter remains
platform-specific. The local-first version must not redistribute D&D books,
protected art, premium content, or a cloud copy of campaign data.

**Decision:** Thin Client Player Relay is now the leading conditional buyer
hypothesis, while Session Health Autopsy remains the alternate. This is not a
product selection. The relay advances only to a device-and-price test that
compares it with VTT Companion, PocketScroll or another available companion,
the group’s current workaround, and a weak client. It must materially improve
join success, first useful action, setup friction, bandwidth/device use, and
automation fidelity while producing a real one-time purchase choice. If it
only recreates a mobile sheet, the category is closed and the candidate is
rejected.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1tb3dru/my_partner_and_i_built_a_character_sheet_mobile/
- https://www.pocketscroll.app/
- https://foundryvtt.com/packages/companion-bridge-free
- https://foundryvtt.com/article/faq/
- https://foundryvtt.com/article/publisher-handbook/
- https://foundryvtt.com/article/year-in-review-2026/

### Pass 40 — Thin-client technical, permissions, licensing, and portability gate

This pass tests whether the remaining relay hypothesis can be implemented
without turning into a second rules engine, a cloud service, or a content
redistribution product.

Foundry's module-development guidance explicitly supports a module-scoped
socket namespace: a module can request `module.{name}`, and Foundry relays
packets between connected clients. The v14 API also documents a supported
public API boundary and a standardized `SocketInterface` for dispatching
requests. That is enough to make a narrow Foundry-first gateway technically
plausible. It is not enough to certify a standalone browser/PWA joining from
outside the loaded Foundry client, because external authentication, session
discovery, reconnect behavior, and the exact serving boundary still need a
runtime fixture. See the [module-development
guide](https://foundryvtt.com/article/module-development/), [v14 API
overview](https://foundryvtt.com/api/), and [SocketInterface
API](https://foundryvtt.com/api/classes/foundry.helpers.SocketInterface.html).

The security shape is also bounded rather than universal. Foundry separates
role permissions from document permissions, and document ownership controls
whether a user can see or edit Actors, Items, Journals, and other documents.
The relay therefore has to authenticate as a real Foundry user, project only
permitted state, and submit typed capability requests that are checked again
by the authoritative Foundry/GM side. It must never accept arbitrary document
patches from an untrusted player device. See the [Users and Permissions
guide](https://foundryvtt.com/article/users/).

The local-first boundary is plausible: the relay can be served through the
customer's running Foundry instance and use Foundry's existing connected
clients, without a separate cloud control plane. That is an architectural
inference, not a proven feature. A hosted account, direct external socket,
or browser-side document write would materially increase authentication,
privacy, support, and security risk, so those are rejected for the first
fixture.

Licensing reinforces the same boundary. Foundry's guidance says package
authors need rights for included rules text, artwork, icons, music, and other
distributed material; code that changes core behavior is generally a safer
module boundary. The relay should transmit only consented live state from the
customer's world and ship no D&D books, protected art, premium content, or
cloud campaign copy. See the [Foundry licensing
guide](https://foundryvtt.com/article/licensing-guide/).

Portability is possible only at the packet and capability layer. A neutral
player-action packet, result receipt, and unsupported-capability report could
be reused by Roll20 or another VTT, but Foundry's module/socket/document
authority is not evidence that another VTT shares the same runtime contract.
Each future adapter needs its own authentication, permission, action,
reconnect, and licensing proof.

**Decision:** Thin Client Player Relay passes the static technical and
licensing screen as a Foundry-first conditional hypothesis. It does not pass
the product-selection gate yet. Build only a disposable exact-stack fixture
that proves read-only state projection and one typed, GM-authoritative action.
Reject the candidate if it needs a cloud control plane, direct player writes,
private API assumptions, bundled protected content, or if it merely recreates
the existing mobile-companion surface. The required buyer test remains the
weak-device comparison with a real GM price choice.

Sources:

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/api/
- https://foundryvtt.com/api/classes/foundry.helpers.SocketInterface.html
- https://foundryvtt.com/article/users/
- https://foundryvtt.com/article/licensing-guide/

### Pass 41 — Player-flow, accessibility, and onboarding pass

The technical relay gate exposed a broader player problem worth testing: many
players do not need another VTT surface; they need fewer choices inside the
surface they already have. A current player-friction discussion reports
confusion around sheet tabs, targeting, icons, multiple action locations, and
basic controls, including players who still struggle after months and players
who prefer a simpler VTT. Other participants reject the complaint or point to
training and existing HUDs, so this is a real pain signal with strong
counterevidence—not a validated market. See the [current player-friction
discussion](https://www.reddit.com/r/Pathfinder2e/comments/1wobxgg/my_players_hate_using_foundryvtt/).

The obvious product category is already occupied in pieces. Foundry Navigator
offers keyboard-first and screen-reader-friendly navigation for D&D5e v13/v14;
Accessibility Enhancements offers drag-and-drop alternatives and audio
feedback; Stylish Action HUD offers party cards and quick actions; and party
inventory tools simplify shared loot. A generic HUD, accessibility patch, or
party sheet would therefore be an incremental feature, not a fresh product.
See [Foundry Navigator](https://foundryvtt.com/packages/foundry-navigator),
[Accessibility Enhancements](https://foundryvtt.com/packages/accessibility-enhancements),
[Stylish Action HUD](https://foundryvtt.com/packages/stylish-action-hud), and
[Party Inventory Foundry v13](https://foundryvtt.com/packages/party-inventory-foundry-v13).

The remaining alternate hypothesis is **Player Flow / Tabletop Ease Mode**:

> **Show each player only what they can do next—and get them back to playing.**

This is a per-player, task-driven cockpit rather than a permanent toolbar. It
would use the actual system and actor state to show the current task, useful
actions, relevant resources, target guidance, and a clear result/next step. It
would hide irrelevant tabs, offer text labels and keyboard/screen-reader paths,
and teach the player in the context of play. Foundry remains authoritative;
the cockpit does not duplicate the rules engine or accept arbitrary document
patches.

Its buyer hypothesis is a GM paying to reduce “where do I click?” interruptions,
shorten onboarding, and make returning or less technical players independent.
Its cross-VTT portability is strongest at a neutral task graph—choose action,
choose target, confirm roll, spend resource, resolve result—while the live UI,
permissions, sheet schema, and action projection remain adapter-specific.

**Decision:** Retain Player Flow / Tabletop Ease Mode as an alternate
conditional product, behind Thin Client Player Relay but ahead of DMF in the
fresh-search queue. Reject generic HUD and generic accessibility as standalone
products. The next valid gate is a direct task trial comparing ordinary
Foundry, the group's existing HUD/training workaround, and the task cockpit,
followed by an actual GM price choice. If the cockpit adds another layer,
fails to reduce interruptions, or users prefer training/simple VTTs, reject it.

Sources:

- https://www.reddit.com/r/Pathfinder2e/comments/1wobxgg/my_players_hate_using_foundryvtt/
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/accessibility-enhancements
- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/party-inventory-foundry-v13

### Pass 42 — Player-flow monetization and substitute-rejection pass

The previous pass found a real pain signal, but this pass asks whether the
pain creates a separate purchase. Foundry already publishes a free [Player
Orientation tutorial](https://foundryvtt.com/article/player-orientation/)
covering joining, claiming a character, learning the interface, opening sheets,
and moving on the map. Its [GM tutorial
series](https://foundryvtt.com/article/tutorial/) and knowledge base cover the
rest of the basic onboarding path.

Community substitutes are also strong. Current advice includes holding a
dedicated player-learning session, running a short tutorial campaign that
introduces modules gradually, screen-sharing the relevant control, simplifying
the sheet, or using an existing HUD. These are often sufficient, and some
players explicitly prefer a simpler VTT. The player-friction discussion
therefore validates a recurring problem but also supplies substantial
counterevidence against a standalone paid cockpit.

There is a monetization clue, but it points toward bundling. The paid
[Pathfinder Beginner Box](https://foundryvtt.com/packages/pf2e-beginner-box)
teaches both the game and Foundry while delivering a complete adventure. That
shows onboarding can increase the value of content; it does not show that a
generic tutorial or accessibility layer is independently worth paying for.

**Decision:** Reject Player Flow / Tabletop Ease Mode as a standalone first
product. Keep its task graph, contextual guidance, text labels, keyboard paths,
and verified result receipts as reusable components for Thin Client Player
Relay or a future content bundle. Reopen it only if a new bundle produces an
actual GM price choice or pilot commitment. This leaves Thin Client Player
Relay as the leading conditional product hypothesis, still gated by exact
runtime and buyer validation.

Sources:

- https://foundryvtt.com/article/player-orientation/
- https://foundryvtt.com/article/tutorial/
- https://foundryvtt.com/packages/pf2e-beginner-box
- https://www.reddit.com/r/FoundryVTT/comments/1jgcbkf/im_afraid_my_players_will_find_foundry_too_complex/

### Pass 30 — Dungeon Master's Forge feature and marketability pass

The local Dungeon Master's Forge repository confirms a distinct candidate:
an end-to-end custom-item compiler, not merely a plain-language item maker and
not a replacement for Midi-QOL.

#### Verified feature surface

The current project targets Foundry v14 and D&D5e 5.3.3. Its flow is:

1. accept a natural-language item request or a batch of requests;
2. compile it through Local Rules, Bring Your Own API, or the tester provider;
3. normalize and deterministically repair known schema/activity/targeting/
   resource/effect/summon errors;
4. show assumptions, warnings, dependencies, unresolved mechanics, and an
   editable specification;
5. require explicit approval; and
6. create native D&D5e Items and, when a proven capability is available,
   attach the corresponding automation route.

The source currently contains factories for extra-damage weapons, passive
equipment, charged saves/healing, multi-activity staffs, native enchantments,
single- and multi-profile summons, shields, wondrous passives, hybrid artifacts,
condition-on-hit weapons, caster equipment, and complex equipment suites.
The automation catalog has eight production templates, four candidate
templates, and one planned template. It includes Midi-QOL plus Item Macro
condition riders, DAE transfer effects, Item Macro utility powers and light
toggles, actor-resource bindings, shared-charge activities, explicit profile
selection, and candidate reaction/aura routes.

The project also contains read-only SRD spell/equipment/actor/feature/table
resolution, provider capability discovery, remote contract validation,
non-destructive diagnostics, a verification harness, provenance flags, and
repair evidence. The AI/service contract is declarative-only: provider output
does not get to emit arbitrary JavaScript, scripts, flags, `eval`, or invented
UUID behavior. That safety boundary is a product strength.

#### Market interpretation

The closest direct competitor is [D&D Item Auto Maker]
(https://foundryvtt.com/packages/DnDItemMaker), whose public package page
promises plain-English item generation and a fully-statted Foundry Item with
JSON export. It does not advertise Midi-QOL/DAE/Item Macro automation. [Item
Creator](https://foundryvtt.com/packages/dnd5e-item-creator) is an adjacent
competitor for guided item editing and materialization, but it is not the same
end-to-end compiler proposition.

This makes the DMF gap more credible than the earlier generic-item framing:

> **Describe the item. DMF creates the item and its automation, identifies the
> required modules, and shows what is still unresolved before creation.**

Community evidence also shows the underlying pain. Recent users with D&D5e
5.3.3, Midi-QOL, and Item Macro report being unable to automate conditional
weapon damage, while other users ask how to combine Midi-QOL, DAE, charges,
damage-type filtering, effects, and timing for one custom item. These are
cross-module wiring problems, not ordinary item-form problems. See the
[conditional weapon thread](https://www.reddit.com/r/FoundryVTT/comments/1u8t84y/help_with_custom_weapon_midiqol_item_macro_5e/)
and [custom magic item thread](https://www.reddit.com/r/FoundryVTT/comments/1tsu3pb/custom_magic_item_help/).

#### Buyer and portability boundary

The strongest payer hypothesis is the automation-heavy D&D5e GM who creates
unusual items repeatedly and loses time debugging Midi-QOL/DAE/Item Macro
behavior. Ordinary GMs are a larger audience, but simple items have cheap
alternatives: native fields, compendium copying, Auto Maker, free macros, and
community help. Creator interest may be valuable, but it must not be mistaken
for the requested broad customer market.

The portable asset is the reviewed item recipe, dependency declaration,
assumption list, and verification receipt. A Foundry native item or Midi-QOL
hook is a platform-specific projection. Cross-VTT support is credible at the
recipe/export layer, not as one automation script that runs unchanged on every
VTT.

**Decision:** retain DMF as a serious competing candidate under the working
name **Custom Item Workshop**, with the promise **“Make the homebrew item work,
not just exist.”** Do not select it yet. It must beat Game Night Rescue in a
buyer test measuring a recent item-authoring incident, time saved, trust in the
preview, actual price choice, and real session use. Reject it as a broad
product if only creators pay, if native tools/Auto Maker/Item Creator win, if
buyers hand-edit every result, or if exact-stack live proof cannot show the
generated item working.

Sources:

- `C:\Users\rujie\Documents\Codex\2026-06-25\can\publish\dungeon-masters-forge-repo\README.md`
- `C:\Users\rujie\Documents\Codex\2026-06-25\can\publish\dungeon-masters-forge-repo\module\README.md`
- `C:\Users\rujie\Documents\Codex\2026-06-25\can\publish\dungeon-masters-forge-repo\module\docs\supported-patterns.md`
- https://foundryvtt.com/packages/DnDItemMaker
- https://foundryvtt.com/packages/dnd5e-item-creator
- https://www.reddit.com/r/FoundryVTT/comments/1u8t84y/help_with_custom_weapon_midiqol_item_macro_5e/
- https://www.reddit.com/r/FoundryVTT/comments/1tsu3pb/custom_magic_item_help/

### Pass 31 — Automaker implementation and monetization comparison

This pass checks the closest direct competitor's real implementation surface,
not only its package description.

The public [D&D Item Auto Maker package page](https://foundryvtt.com/packages/DnDItemMaker)
is optimized for a very clear job: describe a weapon, armor, consumable, tool,
wondrous item, or container; click Generate; receive a fully-statted Foundry
Item. It advertises rarity, charges, activation, properties, history, replay/
refine, and JSON export. The public feature surface does not advertise
Midi-QOL, DAE, Item Macro, hook selection, or automation verification.

The competitor's public source adds important product details. The module
opens a builder from the Items/Compendium sidebar, asks users to sign in with
Patreon, assigns monthly generation uses, keeps generation history with retry,
creates the Item directly in the world, and offers a separate image-generation
action. The source repository has active recent commits, but its public star
count is not adoption evidence and should not be used as a sales estimate.
See the [module entry point](https://raw.githubusercontent.com/JamesCfer/D-Ditemmaker/main/scripts/entry.js)
and [manifest](https://github.com/JamesCfer/D-Ditemmaker/blob/main/module.json).

This establishes two things:

1. **Speed and direct insertion are the market baseline.** DMF cannot make a
   buyer fight through compiler terminology, JSON, or module configuration just
   to create a simple sword.
2. **Automation is still a credible wedge.** The competitor's public promise
   stops at the Item document, while DMF's source includes capability-gated
   automation recipes, Midi-QOL/Item Macro routes, DAE effects, dependency
   warnings, unresolved-mechanics review, and verification receipts.

The product comparison should therefore be framed as:

| Job | Auto Maker | DMF / Custom Item Workshop |
| --- | --- | --- |
| Basic core item | Strong, simple, direct | Must be equally fast or use native fallback |
| Complex native D&D5e item | Likely useful | Stronger review/repair surface, pending live proof |
| Midi-QOL/DAE/Item Macro wiring | Not advertised publicly | Core differentiation, but dependency- and version-sensitive |
| Safety/uncertainty visibility | Not the storefront focus | Explicit assumptions, warnings, unresolved mechanics, approval |
| Portability | JSON export | Recipe, dependency, and receipt export; runtime hooks remain Foundry-specific |
| Monetization signal | Patreon/usage allowance model | Hosted tester/BYO/local lanes exist; willingness to pay is untested |

**Decision:** do not position DMF as a faster Automaker. Position it as the
automation completion layer for items that are easy to describe but hard to
wire. The first comparison experiment should give the same user the same
complex item in three forms: native/Auto Maker, DMF core-only fallback, and DMF
with verified automation. Measure time to first usable item, manual edits,
number of module settings touched, whether the behavior works in a disposable
scene, and the price the GM chooses. Keep product selection open until that
comparison and a real purchase choice are complete.

Sources:

- https://foundryvtt.com/packages/DnDItemMaker
- https://raw.githubusercontent.com/JamesCfer/D-Ditemmaker/main/scripts/entry.js
- https://github.com/JamesCfer/D-Ditemmaker/blob/main/module.json
- https://www.reddit.com/r/FoundryVTT/comments/1u8t84y/help_with_custom_weapon_midiqol_item_macro_5e/

### Pass 32 — DMF cross-VTT portability boundary

This pass checks whether the local Dungeon Master's Forge feature set can be
sold as one product across Foundry VTT, Roll20, and Fantasy Grounds without
promising that incompatible automation runtimes share one output format.

The answer is a qualified yes at the authoring and evidence layer, and no at
the live automation layer. Foundry D&D5e Activities are system-native
documents with Foundry-specific activity types, targeting, effects, and
consumption. Midi-QOL, DAE, and Item Macro are also Foundry-specific runtime
dependencies. A DMF output that contains a Foundry Item, Activity, DAE effect,
or Midi-QOL hook therefore cannot honestly be advertised as a universal VTT
artifact. See the [D&D5e Activities documentation](https://github.com/foundryvtt/dnd5e/wiki/Activities)
and the [D&D5e Item source](https://github.com/foundryvtt/dnd5e/blob/6.0.x/module/documents/item.mjs).

Roll20 has a different boundary: API/Mod scripts are a Pro feature, are
campaign-local, and run inside the campaign rather than providing the same
document model or module dependency graph. Fantasy Grounds has built-in
ruleset automation, but extensions and ruleset customization use a separate
XML/Lua projection. See the [Roll20 Mod Scripts documentation](https://help.roll20.net/hc/en-us/sections/36128191596439-Mod-Scripts-API),
the [Fantasy Grounds automation overview](https://www.fantasygrounds.com/features/automation/),
and the [Fantasy Grounds extension guide](https://fantasygroundsunity.atlassian.net/wiki/spaces/FGCP/pages/996645668/Developer+Guide+-+Extensions+-+Files).

The honest product architecture is therefore:

1. **Neutral recipe:** item intent, rules assumptions, activities, triggers,
   resource consumption, dependencies, unresolved clauses, and test cases.
2. **Neutral receipt:** what was understood, what was omitted, which
   capabilities were required, and what the user approved.
3. **Foundry projection:** native D&D5e Activities first, then explicit
   Midi-QOL/DAE/Item Macro adapters where the exact stack supports them.
4. **Separate future projections:** Roll20 API/Mod and Fantasy Grounds
   XML/Lua outputs, each with its own capability matrix and verification.

This is not a “compile once, run everywhere” promise. It is a portable item
authoring and review product with platform-specific runtime adapters. A
community project such as [DM-VTT-Toolkit](https://github.com/Tonyb29/DM-VTT-Toolkit)
is useful evidence that multi-VTT authoring is technically imaginable, but its
partial target coverage also illustrates the support burden: a neutral item
creator does not automatically make advanced automation portable.

**Decision:** keep DMF Foundry-first. Make the neutral recipe, dependency
report, unresolved-mechanics report, and verification receipt exportable from
the first product boundary. Treat Roll20 and Fantasy Grounds as later adapter
projects, not alternate claims for the initial release. Portability strengthens
DMF only if the exported recipe remains useful when advanced runtime behavior
is unavailable; it must never hide a downgraded or missing automation feature.

The market test should compare three offers: Foundry-only Custom Item
Workshop, Custom Item Workshop plus neutral recipe/receipt export, and a
cross-VTT beta with explicitly limited projections. Measure whether buyers
value the export, whether it creates support questions, and whether the
Foundry automation wedge still pays for itself without portability.

Sources:

- https://github.com/foundryvtt/dnd5e/wiki/Activities
- https://github.com/foundryvtt/dnd5e/blob/6.0.x/module/documents/item.mjs
- https://help.roll20.net/hc/en-us/sections/36128191596439-Mod-Scripts-API
- https://www.fantasygrounds.com/features/automation/
- https://fantasygroundsunity.atlassian.net/wiki/spaces/FGCP/pages/996645668/Developer+Guide+-+Extensions+-+Files
- https://github.com/Tonyb29/DM-VTT-Toolkit

### Pass 29 — real buyer and payer-segment pass

This pass separates “the situation happens” from “someone will pay for a
product that handles it.” The current community evidence supports the first
claim more strongly than the second.

An actual Foundry discussion describes a six-player fortnightly homebrew game
that cancelled after one absence and then switched to one-shots. The group
asked whether to duplicate characters or run a separate world so campaign
health and spell slots would not leak into the one-shot. Replies commonly
recommended duplicating the world, using a shared compendium, or treating the
one-shot as a simple two-hour side activity. This is a direct instance of the
problem and its workaround, but it also shows that many home groups can solve
it with a manual habit.

More recent D&D discussion shows the same segmentation: many tables continue
with one absent player, set a quorum, let another player or the GM operate the
character, or simply leave the character in the background. Groups often
cancel only when multiple players are missing or when the absent character is
structurally important. That makes attendance pain frequent for some tables
but optional and socially manageable for others.

The strongest payer signal comes from organized and paid play. Published
professional-GM pricing shows recurring sessions commonly sold per player and
per session, with examples around $20–30 per player, four-session packages,
and one-off events priced in the hundreds. Some services explicitly bill
late cancellations or treat a missed session as lost booking value. This does
not prove that those GMs will buy a Foundry module, but it gives Game Night
Rescue a measurable economic story: preserving a booked table can protect
revenue, prep time, player retention, and a scheduled event.

The payer segmentation is now:

| Cohort | Pain | Existing workaround | Willingness-to-pay hypothesis |
| --- | --- | --- | --- |
| Home weekly GM | Real but intermittent | Ignore/retire the absent PC, reschedule, or run a one-shot | Low to uncertain; do not assume a mass market |
| Paid/professional GM | A missed session can waste prep and booking revenue | Refund, reschedule, or improvise a backup session | Strongest first payer; test ROI and time saved |
| West Marches/rotating host | High attendance variance and many characters/worlds | Discord scheduling, shared worlds, Oronder, manual procedures | Real need, but existing service/integration competition is strong |
| Player | Wants the group to keep playing and to catch up later | Trusts the GM’s workaround | Usually not the buyer; treat player experience as proof of value |

The competitor pass also rules out broad “session workspace” or “campaign
memory” repositioning. [Oronder](https://foundryvtt.com/packages/oronder) already targets
West Marches and single-party campaigns with Discord access, scheduling, and
cross-world character support. [SessionFlow](https://foundryvtt.com/packages/sessionflow)
already sells a visually rich session surface, and [FoundryAI](https://foundryvtt.com/packages/foundry-ai)
and [Archivist Sync](https://foundryvtt.com/packages/archivist-sync) occupy broad
recap, campaign-memory, and assistant territory.

**Decision:** Game Night Rescue is not currently justified as a broad product
for the average home table. It remains worth one focused buyer test for
paid/professional GMs and high-variance organizers, where the promise becomes:

> **Protect the booked game night when attendance changes.**

That is a narrower market, but it has a clearer payer and measurable return.
The product still must be more than another one-shot: it needs rapid party
selection, a no-canon guarantee, a finished capsule, a safe exit, and a
player-safe recap. If paid/organized GMs do not choose it at a real price or
cannot name the saved economic value, reject Game Night Rescue and reopen the
product search rather than broaden it back into a generic campaign assistant.

The next continuation point is a payer-specific test: recruit paid GMs,
professional campaign organizers, and one West Marches host; ask for a recent
attendance incident, quantify lost prep/booking value, show the same hero
workflow, compare cancellation/reschedule/Oronder/manual options, and record a
real price or scheduled pilot. Home-GM reactions remain useful for usability,
but they cannot establish product-market fit for this cohort.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1fg7r93/
- https://www.reddit.com/r/DnD/comments/1sycmxo/
- https://foundryvtt.com/packages/oronder
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/foundry-ai
- https://foundryvtt.com/packages/archivist-sync
- https://www.gmeric.com/store-page/p/cl8soa1mgtcfu32hkvm5bgwuoykk8p
- https://critfailsandfairytales.com/pricing

### Pass 26 — Adventure Capsules adversarial competitor, rights, and portability pass

The category has real buyer precedent, but the generic candidate is not a
gap. Current Foundry listings already sell the core promise we started with:

| Current product | Visible promise | What it closes off |
| --- | --- | --- |
| [Dragonshorn Tales - The Dead Mines](https://foundryvtt.com/packages/drgh-short-story-2) | $12.95 direct, two to three sessions, prepared scenes, linked journals, handouts, music, monsters, and items | “Ready-to-import, ready-to-run adventure” is already a paid offer. |
| [Drop-in Dungeons](https://foundryvtt.com/packages/drop-in-dungeons) | Five minimal-preparation dungeon delves with maps, dynamic lighting, encounters, bestiary, and items | “Drop-in content for a night when the main plan fails” is already explicit. |
| [Prepared! 2](https://foundryvtt.com/packages/kp-prepared2/) | Twelve short adventures intended to keep a game moving when players go off-plan | A broad emergency-adventure library already exists. |
| [Boss Loot Adventures](https://foundryvtt.com/packages/boss-loot-adventures-vol01) | One-shots with adjustable difficulty, meaningful choices, animated tokens, prepared maps, and macros | Visual polish plus choices is not sufficient differentiation. |
| [Rultmoork](https://foundryvtt.com/packages/rultmoork) | Animated maps, state-changing mechanics, player handouts, scene macros, and premium Foundry presentation | “Interactive cinematic adventure” is an established premium pattern. |
| [UO Scenario Branches](https://foundryvtt.com/packages/uo-vetvi) | Campaign nodes, forks, flags, and endings | A branching campaign-state tool already exists. |
| [Visual Novel Maker](https://foundryvtt.com/packages/visual-novel-maker) | Branching dialogue, choices, point-and-click scenes, runtime flags, and JSON export | The underlying interaction/editor space is also occupied. |

The high-production end is even harder to enter: [Ember](https://foundryvtt.com/packages/ember)
and [A House Divided](https://foundryvtt.com/packages/house-divided) make
non-linear choice, cinematic presentation, and replayability part of the
content itself. Community evidence also shows that groups do run one-shots or
side stories when attendance changes, but they commonly solve it by using a
second world, ghosting a character, cancelling, or asking another player to
run something. That is evidence of a recurring situation, not evidence that
they will buy another generic adventure.

**Decision:** reject “Adventure Capsules” as a generic product category. The
first glance is strong and the paid content market is real, but the feature
bundle is already common and the production cost is high. A new module would
need a narrower reason to exist than “good maps and a ready adventure.”

### Narrowed candidate: Adaptive Drop-In Capsules

The only version that survives this pass is a provisional, more specific
candidate: **Adaptive Drop-In Capsules**.

The promise is not “buy another adventure.” It is:

> **When one or more players cannot make it, open a no-canon side session in
> seconds, use the characters who are present, and return to the main campaign
> without carrying hidden state or prep debt forward.**

The candidate would need all of these constraints to be real rather than
marketing language:

- 60–120 minutes, with a clear beginning and ending;
- supports a variable party size and at least two level bands;
- uses current player characters or supplied temporary characters;
- has no permanent effect on the main campaign unless the GM explicitly
  exports a reward, clue, or consequence;
- contains a player-visible hook, one or two meaningful branches, and a
  satisfying conclusion rather than a generic dungeon crawl;
- starts from one obvious Foundry action and leaves a recovery receipt;
- exports the story graph, handouts, and player-safe recap as a neutral
  packet/PDF/HTML bundle.

This is a much sharper buyer and marketing test: a weekly GM with variable
attendance who wants to keep the scheduled social event instead of cancelling
or improvising. The hero clip should show “player absent → choose capsule →
party is playing → capsule ends cleanly,” not a settings panel or a campaign
database.

### Rights and portability gate

The cleanest rights path is original setting, original art/audio, and rules
references limited to the applicable SRD with attribution. The official
[SRD v5.2.1 guidance](https://www.dndbeyond.com/srd) says the SRD is available
under Creative Commons for commercial compatible content, but that does not
grant rights to protected D&D settings, characters, logos, non-SRD text, or
third-party art. A portable capsule should therefore separate:

1. an original narrative/asset packet that can become a PDF, web handout, or
   another VTT's content;
2. a Foundry adapter that projects scenes, actors, items, journals, and
   automation through supported APIs; and
3. optional system-specific stat blocks, clearly versioned and licensed.

The next continuation point is not implementation. It is a buyer-and-format
test comparing Adaptive Drop-In Capsules against cancelling, ghosting the
absent character, a free PDF one-shot, an existing premium adventure, and the
GM's own second-world workflow. The candidate should be rejected if buyers do
not report this attendance problem recently, cannot name the value without
explanation, or prefer the alternatives at a real one-time purchase choice.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1fg7r93/
- https://www.reddit.com/r/DnD/comments/1sycmxo/
- https://www.dndbeyond.com/srd
- https://foundryvtt.com/article/publisher-handbook/

### Pass 27 — exact target runtime availability and live-evidence boundary

The local machine now provides a stronger technical starting point than the
earlier static-only record. A read-only preflight against the installed
Foundry data path found:

- Foundry 14.367;
- D&D5e 5.3.3;
- a readable `regionwright-testmap` world manifest matching the exact target;
- DiceBox Campaign Helper module 0.1.2 with Foundry 14.367 compatibility;
- Midi-QOL 14.0.11 and DAE 14.0.13 manifests available as optional
  capabilities.

The preflight receipt is explicitly **BLOCKED**, not PASS, because its live
runtime check is `NOT_TESTED`. It reads manifests only, does not launch
Foundry, does not invoke `Hooks.once("ready")`, and does not prove document
serialization, permissions, staged branch operations, player/GM visibility,
failure recovery, or authoritative read-back. No existing campaign world was
modified.

This changes the technical next step from “find the runtime” to “run the
bounded live probe.” The probe must use a disposable fixture or an explicitly
created test world, preserve the current campaign worlds, capture the exact
version/module fingerprint, and stop at the first unsupported or unsafe
operation. A manifest match is valuable evidence, but it cannot upgrade the
Adaptive Drop-In Capsule or Campaign Continuity from hypothesis to shippable
product.

The next continuation point is a read-only/live-readiness fixture probe for
the narrow capsule support surface: load, identify the active GM and world,
read the selected party, create no permanent content, exercise a no-op or
ephemeral branch if the module exposes it, and produce a receipt that clearly
separates supported, unknown, and blocked operations.

Source/evidence:

- `C:\Users\rujie\AppData\Local\FoundryVTT\Data\worlds\regionwright-testmap\world.json`
- `C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\dicebox-campaign-helper\module.json`
- `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\tools\foundry-preflight.mjs`

### Pass 28 — eye-catching front-door packaging and purchase-path pass

This pass asks the question the previous rejection left open: can Campaign
Continuity be made desirable to an ordinary Foundry customer by changing its
front-door presentation, or is the underlying job still too invisible and
episodic?

The storefront is now a meaningful discovery channel, but it is also a hard
attention environment. Foundry reports that the official Marketplace grew to
1,227 products, 107 creators, 60,000 users, and 371 customer reviews in its
first year. It also added filtering by price, rating, publisher, tags, and
verified Foundry version. Those numbers do not prove that any particular
product sells, but they do establish that a new listing must communicate its
outcome quickly and earn trust through compatibility and reviews. The official
premium-content guidance also treats adventures and other ready-made content as
normal sellable products, with Adventure Compendium Packs as the recommended
distribution boundary for complicated content.

The closest newly checked comparison is [Omnipresence](https://foundryvtt.com/packages/omnipresence).
It directly advertises keeping player characters, journals, and hotbars in
sync across multiple Foundry worlds and explicitly names one-shot campaigns as
a use case. That validates that multi-world/one-shot continuity is a real
workflow, but it also closes part of the original Adaptive Drop-In gap. A new
product cannot sell “same characters in another world” alone. Its reason to
exist must be the finished, no-canon game-night experience and the clean return
to the campaign.

Campaign Continuity still fails when shown as Safe Mode, even after the
proposed board treatment:

1. The buyer sees a rare failure mode rather than an enjoyable result.
2. The value is mostly invisible until after something has gone wrong.
3. A board, timeline, or diff can be mistaken for another campaign organizer.
4. Free backups, notes, duplicate worlds, a one-shot, or simply cancelling are
   all understandable alternatives before the buyer learns the branch model.

A rename can make the use case legible, but only by changing the product
   promise rather than hiding the same infrastructure behind a better logo.
   The strongest front-door candidate is **Game Night Rescue** (the internal
   format remains Adaptive Drop-In Capsules):

> **One player canceled. Don’t cancel the game.**

The five-second listing should show a single sequence: choose the players who
arrived → open a 60–120 minute side session → show a visible “NO CANON” badge
while the party plays → end with a player-safe return card. The buyer-facing
product is therefore a finished, original capsule plus the attendance and
safe-exit workflow. Campaign Continuity supplies the branch, provenance,
visibility, reset, and recovery machinery underneath it; it is not the thing
the buyer is asked to want.

The marketing techniques that survive the evidence are concrete and testable:

- lead with a trigger and payoff, not architecture (“player absent → game
  continues”);
- use a silent 10–20 second screen recording that reaches the first playable
  scene quickly;
- show the exact setup time, supported Foundry versions, no-canon boundary,
  and what is or is not written back;
- include a playable/free preview or one capsule sample so the buyer can judge
  the experience before trusting a new publisher;
- make each capsule visibly part of a series so repeat purchase is plausible;
- collect reviews around the saved game night and reduced prep, not around the
  existence of a settings panel; and
- disclose rights, human-made prepared content, and any AI policy boundary.

The visual-presentation and review research supports using a clear product
demonstration and trustworthy social proof, but neither study proves
conversion for this category. Foundry’s current AI policy is also material:
prepared user-facing text, art, audio, and marketing materials for official
listings must originate from human creative work, while runtime improvisation
has a different treatment. That makes a rights-clean, original, visually
strong capsule more practical than an automatically generated content store.

**Decision:** Campaign Continuity / Safe Mode remains a no-go as the first
storefront product. It can be made more understandable only by becoming the
backend of **Game Night Rescue**, a provisional productized Adaptive Drop-In
Capsule. That candidate passes the attention test conceptually, but it does
not yet pass the purchase test. We must not implement a content catalog or
marketplace package until qualified GMs confirm a recent attendance incident,
prefer the workflow over their real alternative, choose a real price, and
schedule a run.

The exact next continuation point is a no-code buyer-choice and message test
with qualified GMs. Compare “Safe Mode,” “Campaign Continuity,” and “Game Night
Rescue” against cancelling, a free PDF, an existing premium one-shot, and
Omnipresence plus a second world. If the new name still produces “another
one-shot” or no real purchase commitment, reject this candidate and reopen the
product search again.

Sources:

- https://foundryvtt.com/article/year-in-review-2026/
- https://foundryvtt.com/article/premium-content/
- https://foundryvtt.com/article/publisher-handbook/
- https://foundryvtt.com/article/ai-policy/
- https://foundryvtt.com/packages/omnipresence
- https://www.sciencedirect.com/science/article/pii/S0167923619300752
- https://www.sciencedirect.com/science/article/pii/S2543925123000323

### Pass 50 — World Doctor payer, price, and alternative pass

This pass tests whether the strongest fresh candidate has a buyer and a
credible purchase shape, rather than treating operational pain as market
validation.

The pain signal is real but directional. A Foundry community incident reports
that a 5e/system update broke sheets and modules, with users relying on an
archived world or backup to roll back; another user described stopping updates
mid-campaign because the upgrade risk was too costly. The [community update
incident](https://www.reddit.com/r/FoundryVTT/comments/108scq4/reminder_back_up_your_game_world_before_using_5e_system_update_2_11)
is old and user-generated, so it is evidence of recurring pain, not current
market size or willingness to pay.

The obvious product is already partly owned by the platform. Foundry has
built-in backups, package backups, snapshots, and rollback, while its own
guidance and hosting support direct users toward compatibility checks,
disabling modules, and restoring an exported backup. See the [Foundry backup
and snapshot release notes](https://foundryvtt.com/releases/11.311) and the
[Forge breakage/support thread](https://forums.forge-vtt.com/t/latest-update-broke-all-of-my-campaigns/142417).
That rejects a backup manager as a new product and means a compatibility badge
alone is unlikely to be worth paying for.

The remaining wedge is narrower: **preflight diagnosis plus evidence-linked,
reversible repair**. The demo must answer “what will break in this world if I
update tonight?” by naming the affected object, showing the evidence path,
previewing a narrow repair, snapshotting before the write, rereading the
authoritative result, and emitting a recovery receipt. Asset paths outside
the package folders, behavioral/module interactions, malformed document shapes,
and orphaned references are the likely gap between a package snapshot and a
healthy playable world. If the tool merely lists warnings, finds duplicates,
or restores a backup, it is not differentiated.

The current price signal is also constrained. Foundry users clearly spend on
modules and content, but a current community price discussion describes
fatigue with $7–10/month creator subscriptions and a preference for a
buy-once or flat support period. See the [Foundry module pricing
discussion](https://www.reddit.com/r/FoundryVTT/comments/1t5n76x/patreon_funded_modules_are_there_a_better_way_or_am_i_alone_here/).
This supports testing a one-time World Doctor utility at **$15, $25, and $39**
as initial anchors; those are research choices, not observed willingness to
pay. Do not assume a subscription until buyers explicitly prefer it.

**Decision:** keep World Doctor as a conditional candidate and test it as a
one-time GM/host utility. The candidate fails if qualified GMs prefer Foundry
backup plus support, if the tool only flags compatibility, or if repairs
cannot be previewed, verified, and reversed. The next buyer pass must recruit
GMs with a concrete recent incident, compare their real workaround with the
candidate, ask for a real price choice, and request a disposable-copy pilot.
The synthetic-defect fixture remains a separate gate; no live campaign world
should be modified.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/108scq4/reminder_back_up_your_game_world_before_using_5e_system_update_2_11
- https://www.reddit.com/r/FoundryVTT/comments/1t5n76x/patreon_funded_modules_are_there_a_better_way_or_am_i_alone_here/
- https://forums.forge-vtt.com/t/latest-update-broke-all-of-my-campaigns/142417
- https://foundryvtt.com/releases/11.311

### Pass 51 — fresh challenger: Battle Director / Adaptive Encounter Audio

The next fresh search moved away from invisible maintenance and toward a
visible, repeated session outcome: **the soundtrack changes itself as the
encounter changes**. The buyer-facing promise is:

> Every boss fight gets a score that reacts to the battle—without the GM
> touching the music panel during a turn.

There is direct community demand for this job, although the strongest thread
is older and self-reported. A GM says they would do setup work if the system
could handle combat start, pre-combat hype, boss/actor changes, turn changes,
combat end, seamless transitions, and probabilistic additions without manual
fiddling. The same thread says existing tools were limited or poorly supported;
that is a useful problem statement, not proof of payment. A newer community
post says an “adaptive audio” module was abandoned and describes the current
combat-start/end alternatives as incomplete. See the [combat-music request and
competitor discussion](https://www.reddit.com/r/FoundryVTT/comments/17yl7o7/what_sorts_of_modules_is_there_an_unfilled_hunger/)
and the [recent adaptive-audio discussion](https://www.reddit.com/r/FoundryVTT/comments/1vbvjcg/simple_dynamic_music_module/).

The current competition is meaningful:

- [Minstrel](https://foundryvtt.com/packages/minstrel) provides a current
  console, crossfade, soundboard, moods, scene music, combat music, actor/turn
  themes, mixer, YouTube, and Syrinscape integration.
- [Combat Music Master](https://foundryvtt.com/packages/combat-music-master)
  provides combat playlists, priority, token/actor themes, per-turn selection,
  and Pathfinder traits.
- [Dynamic Soundscapes](https://foundryvtt.com/packages/dynamic-soundscapes)
  provides active soundscapes and ambient/random/soundboard blocks.
- [Soundscape Adventure](https://foundryvtt.com/packages/soundscape-adventure)
  provides a cross-world sound library, tags, moods, random/sequential or
  intensity groups, and triggers from regions, combats, and scenes.
- [Playlist Plus](https://foundryvtt.com/packages/playlist-plus) addresses
  mixer/ducking/queue usability.

The possible gap is therefore not “play music in Foundry.” It is a **neutral,
declarative encounter event graph**: conditions such as combat phase, round,
boss HP threshold, actor entry/exit, condition, scene/region, or narrative
cue select a state; transitions crossfade or duck safely; weighted choices and
cooldowns prevent repetition; and the GM receives a deterministic preview and
test mode. The checked public descriptions show pieces of this surface, but do
not establish that any one competitor offers the full state-graph, HP/phase,
transition, and no-touch runtime together. This is an unproven gap, not a
claim that the gap is empty.

This candidate has a better storefront demonstration than World Doctor: a
10–20 second clip can show exploration → initiative → pre-combat sting → boss
phase → low-health escalation → victory/recovery, with no GM clicks. It is
eye-catching and useful repeatedly in every session. The buyer is still the
GM; players benefit from atmosphere but are unlikely to control the purchase.

The payment signal is category-level rather than product-level. Current audio
modules and sound libraries use publisher purchases, Patreon access, and
one-time lifetime options, while community discussion shows subscription
fatigue. Test a one-time Foundry-first utility at **$15, $25, and $39** and do
not bundle music. Users provide or import their own audio; this keeps rights
and portability safer and makes the product an automation engine rather than a
content subscription.

Technical and portability boundaries are explicit. A portable rule packet can
be represented as `event → condition → transition → action`, with audio asset
references, cooldowns, weights, and a recovery state. Foundry can be the first
adapter, but combat/actor/HP/condition hooks require system-specific evidence;
Roll20, Fantasy Grounds, and other VTTs need separate adapters. The initial
portable claim is therefore “share the encounter soundtrack recipe and use
customer-owned audio,” not “one module runs unchanged everywhere.”

**Decision:** open Battle Director / Adaptive Encounter Audio as a fresh
challenger ahead of implementation, while keeping World Doctor conditional and
Dungeon Master's Forge backburnered. Do not select either product yet. The
challenger fails if Minstrel plus Combat Music Master or manual playlists are
good enough, if buyers do not prefer no-touch transitions, if system hooks make
the first Foundry slice unreliable, or if a buyer will not choose a non-zero
one-time price and run a real pilot.

The next pass must test the same short encounter with the buyer's current
workflow, the current point modules, and a state-graph prototype. Measure setup
time, manual interventions during combat, transition correctness, repeated or
annoying audio, player reaction, and a real price/pilot choice. No copyrighted
music pack or external service is required for the trial.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/17yl7o7/what_sorts_of_modules_is_there_an_unfilled_hunger/
- https://www.reddit.com/r/FoundryVTT/comments/1vbvjcg/simple_dynamic_music_module/
- https://foundryvtt.com/packages/minstrel
- https://foundryvtt.com/packages/combat-music-master
- https://foundryvtt.com/packages/dynamic-soundscapes
- https://foundryvtt.com/packages/soundscape-adventure
- https://foundryvtt.com/packages/playlist-plus

### Pass 52 — Battle Director technical, portability, and rights adversarial pass

This pass asks whether the candidate is technically plausible without quietly
turning documentation into runtime proof.

The Foundry v14 API exposes the core signal path. `combatStart` fires when an
encounter starts, `combatTurnChange` fires on all clients after the combat
update, and generic document hooks can observe `updateActor`. The D&D5e system
documents current hit points at `system.attributes.hp.value`. Foundry also
exposes Playlist `playAll`, `playNext`, `stopAll`, PlaylistSound fade data, and
Sound `play`, `fade`, and `stop` controls. See the [Combat API](https://foundryvtt.com/api/classes/foundry.documents.Combat.html),
[combat hooks](https://foundryvtt.com/api/modules/hookEvents.html),
[Playlist API](https://foundryvtt.com/api/classes/foundry.documents.Playlist.html),
[Sound API](https://foundryvtt.com/api/classes/foundry.audio.Sound.html), and
[D&D5e HP paths](https://github.com/foundryvtt/dnd5e/wiki/Roll-Formulas).

There is also bounded local feasibility evidence in the disposable fixture:
`boss-engine.js` already observes `updateActor`, `updateCombat`, and D&D5e
activity/roll hooks; it uses active-GM gating, a mutation queue, a sync guard,
and event debouncing while driving a multi-phase HP/state machine. This proves
that the local codebase has reusable event/state patterns, not that Battle
Director audio has been certified. The fixture remains disposable and must not
be treated as a live campaign.

The important reliability distinction is client authority. Foundry documents
that `combatStart` is emitted on the initiating client before the database
update, while `combatTurnChange` is emitted on all clients after the update.
The first implementation must therefore elect one active GM as the transition
authority, assign stable event fingerprints, suppress duplicate hooks, and
send one audio-state result to every client. A direct “every client reacts to
every hook” implementation is rejected because it can double-play or race
transitions.

The bounded first slice is technically plausible:

- Foundry v14 + D&D5e: combat start/end, round/turn, D&D5e HP threshold,
  scene/region, state graph evaluation, and customer-owned playlist playback;
- explicit GM authority, event fingerprint, cooldown, transition receipt,
  emergency stop, and reconnect resynchronization;
- no automatic world-document creation required for the core demo; and
- synthetic audio only in the fixture.

Cross-VTT portability is real but adapter-shaped. Roll20 exposes campaign turn
order, graphic, and attribute change events to Pro Mod Scripts, and its Jukebox
can play, stop, loop, and organize customer-owned tracks. The [Roll20 event
API](https://wiki.roll20.net/API%3AEvents), [Jukebox/API](https://wiki.roll20.net/Jukebox/API),
and [Jukebox documentation](https://wiki.roll20.net/Jukebox) support a future
adapter, but they do not make the Foundry module portable. Owlbear Rodeo has an
extension SDK and broadcast mechanisms, but it does not provide a common D&D
combat/HP event contract. The portable asset is the event graph and audio
mapping; each VTT requires its own event and playback adapter.

Rights risk is manageable if the product ships no music catalog. It should
reference customer-owned/local audio, preserve paths or VTT asset IDs through
an adapter, and make no claim to redistribute third-party tracks. Bundled
music, scraping, or cloud audio would create a separate licensing and service
business and is outside the candidate.

**Decision:** Battle Director passes the static technical-feasibility screen as
a Foundry-first hypothesis, but not the exact-runtime or buyer screen. The
next technical trial must exercise one synthetic combat across two clients,
including start, turn, HP threshold, duplicate hook, reconnect, correction,
crossfade/stop, and active-GM handoff. The next market trial must still prove
that GMs prefer this over current modules and choose a real one-time price.

### Pass 53 — Battle Director direct-competition correction

This pass rechecks the candidate against current direct competitors instead of
assuming that a visible event-graph demo represents an unserved market.

The core wedge is already substantially covered. [Combat Music
Master](https://foundryvtt.com/packages/combat-music-master) explicitly tracks a
resource and can change music at an HP threshold or when an actor dies; its
published feature surface also includes per-token themes, per-turn selection,
priorities, and encounter tracks. [Video Game Music](https://github.com/Sayshal/vgmusic)
adds area and combat music, per-token themes, priorities, fallback modes,
crossfade, playback-position memory, and suppression. [Soundscape
Adventure](https://foundryvtt.com/packages/soundscape-adventure) covers tagged
libraries, moods, random/sequential or intensity groups, and region/combat/scene
triggers. [Minstrel](https://foundryvtt.com/packages/minstrel) covers console,
crossfade, moods, scene/combat cues, actor/turn themes, mixer, YouTube, and
Syrinscape. The [Sound of Silence](https://github.com/GnollStack/The-Sound-of-Silence)
project also covers crossfading, internal loops, silence gaps, and living
ambience.

The community evidence is useful but weaker than a buyer choice. An abandoned
adaptive-audio module and requests for HP-reactive music show maintenance pain
and interest, not willingness to pay. The [abandonment discussion](https://www.reddit.com/r/FoundryVTT/comments/1wjm9w5/simple_dynamic_music_module/)
and [HP-trigger discussion](https://www.reddit.com/r/FoundryVTT/comments/1dxr6b2/is_there_a_module_or_script_that_can_change_the_currently_playing_audio_track_based_on_a_token_or_status_or_attributes/)
must not be counted as product-market proof.

The remaining possible wedge is narrower: a reliable, system-neutral
composition editor that combines trigger graphs, weights, cooldowns, state
previews, portable recipes, and safe recovery. That is an authoring tool for
power users, not yet a broad player-facing product, and the existing direct
competitors mean the burden of proof is now high.

**Decision:** demote Battle Director and do not implement it as the selected
product. Run a buyer-choice trial only if a qualified GM can name a repeated
unmet cost after using the current modules; otherwise continue the fresh
search. World Doctor remains conditional and Dungeon Master's Forge remains
backburnered. The next candidate must be selected from a payer problem that is
not already closed by a current module combination.

Sources:

- https://foundryvtt.com/packages/combat-music-master
- https://github.com/Sayshal/vgmusic
- https://foundryvtt.com/packages/soundscape-adventure
- https://foundryvtt.com/packages/minstrel
- https://github.com/GnollStack/The-Sound-of-Silence
- https://www.reddit.com/r/FoundryVTT/comments/1wjm9w5/simple_dynamic_music_module/
- https://www.reddit.com/r/FoundryVTT/comments/1dxr6b2/is_there_a_module_or_script_that_can_change_the_currently_playing_audio_track_based_on_a_token_or_status_or_attributes/

### Pass 54 — fresh search: scene interaction studio challenger

The fresh scan compared four payer-facing problems rather than immediately
promoting the first attractive idea:

- **Quick encounter map building:** users repeatedly describe Foundry map setup
  and asset search as slow, but MapForge, Moulinette, Dungeon Alchemist,
  Dungeondraft, and quick-import tools already occupy the workflow.
- **Mobile player companion:** hybrid tables have a real need for a phone or
  tablet character sheet, but Swipe, Diecast, VTT Companion, and Sheet Only
  already provide active or paid solutions.
- **NPC autopilot:** reducing repetitive enemy turns is visibly valuable, but
  Smart Combat NPC and Automated NPCs already target the same D&D5e payer.
- **Scene interaction studio:** a GM can make a map behave like an adventure
  with a door, trap, teleport, reveal, prompt, sound, status effect, or puzzle,
  but the current path often exposes Active Tile actions, UUIDs, macros,
  dependencies, and system-specific configuration.

The last option is the fresh challenger. The player-facing promise is
eye-catching: “Click a door, spring a trap, reveal the secret room, and let the
scene react—without writing a macro.” It is not a general authoring suite and
not a replacement for Dungeon Master's Forge. The payer is the GM who wants
repeatable interactive scenes but does not want to learn the module stack.

The demand signal is directional: a recent community request explicitly calls
for Active Tile Triggers to be simpler, while Foundry's own Scene Regions
documentation still describes UUID-linked behaviors and macro execution for
more advanced actions. The capability exists; the possible gap is safe,
discoverable composition and reusable templates, not raw trigger power.

**Decision:** open Scene Interaction Studio as a provisional fresh challenger,
while demoting Quick Map Builder, Mobile Companion, and NPC Autopilot pending no
new wedge beyond their current competitors. Do not implement yet. The next
passes must test whether ordinary GMs will pay for the reduced setup and
whether the product can stay system-neutral enough to port its recipe format to
Roll20 or another VTT.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://www.reddit.com/r/FoundryVTT/comments/1w5ova1/what_modules_do_you_wish_were_integrated/
- https://foundryvtt.com/packages/mapforge
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/smart-combat-npc
- https://foundryvtt.com/packages/monks-active-tiles

### Pass 56 — fresh challenger: Session Ready / mixed-client session reliability

The next search moved away from already-crowded feature categories and toward
a repeated session-loss problem: the GM activates a scene or effect, one
player is still downloading assets or rendering at an unusable frame rate, and
the table waits or continues with a broken view. Community reports describe
scene transitions taking minutes for one player, periodic freezes despite low
latency, and the need to know when all players have finished preloading.

Current point solutions are real but fragmented. [Preload
Tracker](https://foundryvtt.com/packages/preload-tracker) tracks scene and
playlist preloading and can show scene markers. [Performance
Optimizer](https://foundryvtt.com/packages/performance-optimizer) provides
per-player profiles, a GM control panel, low-FPS suggestions, and a benchmark
chart. [Axon's Performance Monitor](https://foundryvtt.com/packages/axons-performance-monitor)
provides live diagnostics and reports. Foundry's own troubleshooting guidance
identifies module conflicts and very large backgrounds as common black-screen
causes.

The possible product is therefore not another FPS widget or preload button. It
is a session-readiness protocol: preflight the next scene and audio, show a
per-player readiness ledger, recommend or apply a safe visual profile, hold
the activation until a configurable quorum is ready, detect a stale client,
and fall back to a lighter scene or controlled message instead of silently
stalling the table. The eye-catching demo is a red/amber/green “everyone is
ready” board followed by a one-click safe scene transition.

The payer is the GM/host running remote or hybrid games with mixed hardware or
large scenes. This is a narrower segment than all Foundry users, but the pain
costs live session time and can recur every week. A one-time $15/$25/$39 price
is a reasonable test; no cloud service or content catalog is needed.

Portability is limited but possible at the protocol level. The portable piece
is the readiness state, quorum rule, asset budget, fallback policy, and redacted
session receipt. Scene preload, client metrics, and quality controls require a
Foundry adapter first; Roll20 or another VTT would need separate observation.

**Decision:** open Session Ready as a provisional challenger. Do not implement
until buyers prefer an end-to-end readiness gate over the current combination
of Preload Tracker, Performance Optimizer, and manual troubleshooting, choose a
non-zero price, and run a disposable mixed-client pilot. Keep Dungeon Master's
Forge backburnered and keep the previous demotions intact.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qju5kz/preload_tracker_update_now_works_with_preloading/
- https://www.reddit.com/r/FoundryVTT/comments/1pvlsxw/all_players_will_lose_connection_for_about_10/
- https://foundryvtt.com/packages/preload-tracker
- https://foundryvtt.com/packages/performance-optimizer
- https://foundryvtt.com/packages/axons-performance-monitor
- https://foundryvtt.com/article/ts-scene-loading/

### Pass 164 — current media correction and party-size recovery comparison

The current-package audit weakens Playability Budget as the leading product.
Foundry now lists TheRipper93's **Media Optimizer** as a publisher-purchased
module verified for Foundry 14. It automatically converts uploaded images,
audio, and video to WebP, WebM, and OGG and can downscale images. That is a
real paid incumbent for the most obvious version of the asset problem. Foundry
also describes black and gray scene failures as a mixed root-cause class that
includes module conflicts, image dimensions, hardware acceleration, bad paths,
disk space, and network conditions. A local asset receipt may still be useful,
but the evidence no longer justifies calling it the strongest candidate.

The attendance lane has stronger payer evidence. StartPlaying charges for
each campaign session and charges signed-up no-shows unless the GM skips,
waives, or refunds the session; Warhorn already owns event registration,
scheduling, and payments. This establishes an economic buyer—paid GMs,
organized-play hosts, and rotating-party organizers—without justifying a new
roster or booking module.

Premium, minimal-preparation side content is a real spending category:
Drop-in Dungeons sells ready-made delves, Side Quest Society Premium sells
standalone side missions on a recurring content model, and other premium
one-shots are available. That also means generic one-shot content is crowded.
SessionFlow occupies the broad live-session workspace, player panel, quick
scenes, broadcast, and recap surface. The remaining product hypothesis is
narrower: a **party-size recovery kit** that lets a paid GM preserve a session
when one or more expected players disappear, without touching the main
campaign.

The candidate remains **Table Rescue / Attendance-Resilient Side Session**:
a 60–120 minute, no-canon scenario with deterministic two-, three-, and
five-player entry branches, late-join/absent-player handling, a clean ending,
and campaign-safe reward/clue/recap export. Its marketing promise is visible:
“A player dropped. The session still runs.” Its product risk is also clear:
the buyer may prefer cancellation, improvisation, a free one-shot, or an
existing premium adventure.

**Decision:** demote Playability Budget / Media Safe Pack to a comparison arm
until it beats Media Optimizer and proves a decision-changing assurance job.
Retain Table Rescue as the leading conditional candidate, not a selected
product. Test $15/$30/$49/no purchase, require 5/8 qualified preference,
3/8 non-zero price choices, two real pilots, a home-table negative control,
and a repeat-value test using a second scenario or season pack. Keep the
portable baseline as PDF plus a neutral scenario/branch/reward/recap manifest;
do not require a hosted account bridge or copy publisher content.

Sources:

- https://foundryvtt.com/packages/media-optimizer
- https://foundryvtt.com/article/ts-scene-loading/
- https://foundryvtt.com/packages/drop-in-dungeons
- https://foundryvtt.com/packages/side-quest-society-premium
- https://foundryvtt.com/packages/sessionflow
- https://intercom.help/startplaying/en/articles/8719173-when-are-players-charged
- https://intercom.help/startplaying/en/articles/14422594-how-do-i-handle-a-no-show-player
- https://warhorn.net/
- https://foundryvtt.com/article/scene-regions/

### Pass 55 — Scene Interaction Studio adversarial competition correction

The direct-competition check found that the proposed wedge is no longer clean.
[Glyph: Active Region Triggers](https://foundryvtt.com/packages/glyph), current
for Foundry v14, provides a visual program editor with sequences, branches,
loops, delays, event values, token/tile/audio/chat actions, dialogs and
journals, system-aware hurt/heal and ability/skill tests, and import from
Monk's Active Tile Triggers. It also adds events that core Regions do not
provide, including hover, clicks, door state, world time, and darkness.

That is materially the same “make the scene interactive without writing a
macro” promise. Foundry's own Scene Regions already provide native shapes,
events, teleportation, behavior toggles, scrolling text, macro/script hooks,
and active effects. MATT remains a broad, established action surface. A new
product would therefore need to solve a specific buyer failure that Glyph,
MATT, and Regions do not solve—not merely offer prettier templates or another
node editor.

**Decision:** demote Scene Interaction Studio and do not implement it as the
selected product. The fresh search remains open. The next candidate must come
from a payer problem outside the now-crowded map, mobile, NPC-autopilot,
audio, and visual-scene-automation categories, or demonstrate a sharply
different advantage with direct buyer evidence.

Sources:

- https://foundryvtt.com/packages/glyph
- https://foundryvtt.com/article/scene-regions/
- https://foundryvtt.com/packages/monks-active-tiles

### Pass 57 — Session Ready adversarial competition correction

The direct source audit closes the main Session Ready gap that was previously
only described from package summaries. Preload Tracker 2.2.0 now reports asset
load times per user, includes scene audio in the preload log, and enables its
Activate control when every connected user has reached 100%; it also marks a
client stuck at 100% with an orange check rather than waiting forever and can
skip scene audio when that is the stall source. That is already a practical
readiness/quorum gate with a recovery path.

The remaining proposed pieces are also occupied. Performance Optimizer already
provides per-player Low/Medium/High profiles, a GM remote control panel,
low-FPS detection/suggestions, and a live chart for connected clients.
Axon's Performance Monitor provides a GM group view, compact client status,
network/canvas loading diagnostics, performance reports, and a crash flight
recorder. A new product that merely combines those modules would be a bundle
or convenience wrapper, not a clean new payer problem.

**Decision:** demote Session Ready and do not implement it as the selected
product. The original community pain remains useful as a recruiting signal for
reliability research, but the buyer trial must now identify a failure that
Preload Tracker plus current performance monitors do not already address.
Dungeon Master's Forge remains explicitly backburnered. The fresh search stays
open outside preload, diagnostics, generic drawing/whiteboard, map building,
mobile companions, NPC autopilot, audio, and visual scene automation.

Sources:

- https://github.com/thejoester/preload-tracker/releases/tag/2.2.0
- https://github.com/thejoester/preload-tracker
- https://github.com/brunocalado/performance-optimizer
- https://github.com/axon-dystro/axons-performance-monitor
- https://foundryvtt.com/packages/preload-tracker

### Pass 58 — fresh challenger: Tactical Memory / Last-Seen Battlefield

The fresh community scan found a different kind of payer signal than a generic
feature wish. In a July 2026 request thread, “Better drawing tools” received
strong support and the request for an Excalidraw layer explicitly said, “I pay
real money for it.” That category is now rejected as a product direction,
because Whiteboard Experience already supplies a real-time collaborative layer
with text, shapes, image paste, alignment, multiplayer sync, and freeze, while
Excalidraw Journals already embeds a synchronized Excalidraw board. However,
the same thread also contains a sharper player-facing request: a “Last Known
Position” ghost so players can remember where an enemy was seen after it leaves
line of sight.

The candidate is **Tactical Memory**: an ephemeral, per-player or party-scoped
overlay that records an enemy's last observed position and fades or marks it as
stale. It must never reveal the current hidden token, actor identity beyond
what was observed, HP, or GM-only information. A GM can choose private-memory,
party-memory, round-based decay, manual correction, and one-click clearing.
The eye-catching demo is a rogue seeing a translucent enemy silhouette dissolve
behind a wall, then the party using the remembered position to plan without
receiving omniscient information.

The payer is a GM who runs stealth, dungeon, pursuit, ambush, or split-party
encounters and repeatedly loses tactical continuity when creatures disappear
behind walls. This is broader than a creator-only tool because the benefit is
seen by players during ordinary play, but it may still be a tactical subsegment
rather than a mass-market Foundry purchase.

The direct substitute check is encouraging but not conclusive. Foundry's core
fog remembers explored map areas, not the last observed position of individual
hostile tokens. Shared Token Visibility reveals currently visible tokens to the
party, not a decaying historical position, and its published package is still
verified only for Foundry 0.7.9. Roll20 Explorer Mode remembers explored map
areas, while Owlbear's Smoke & Spectre provides per-token vision and hidden
token support; neither source describes the full last-seen hostile-token memory
workflow. This is a source-scan gap hypothesis, not proof that no private macro
or unpublished module exists.

The portable artifact is a neutral observation ledger containing token binding,
observer scope, observed position, round/time, uncertainty, and expiry. Foundry
can implement the overlay through its canvas and visibility hooks; Roll20 would
need an API script; Owlbear Rodeo would need an extension. The main risks are
per-player fog correctness, accidental information leaks, visual clutter, and
the possibility that buyers regard it as a free quality-of-life feature.

**Decision:** open Tactical Memory as the provisional fresh challenger, but do
not implement it yet. Run a buyer-choice test against Foundry core fog, Shared
Token Visibility, and a manual “drop a marker” workflow. Ask for $5, $10, $15,
or no purchase and require a disposable stealth encounter pilot. Keep generic
drawing/whiteboard work demoted and keep Dungeon Master's Forge backburnered.

Provisional pass gates:

- 7/10 qualified GMs recognize a recent last-seen/stealth continuity problem;
- 5/10 prefer Tactical Memory over their current marker/visibility workflow;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a disposable-world pilot; and
- the fixture proves per-player scope, no hidden-token leakage, deterministic
  expiry, reconnect recovery, manual correction, and no campaign-world damage.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_what_module_would_you_like_to_see/
- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/whiteboard-experience
- https://foundryvtt.com/packages/excalidraw-journals
- https://foundryvtt.com/article/drawings/
- https://foundryvtt.com/packages/shared-token-visibility
- https://github.com/sfuqua/fvtt-token-visibility
- https://help.roll20.net/hc/en-us/articles/11786989363479-Using-Dynamic-Lighting-As-A-Player
- https://extensions.owlbear.rodeo/smoke

### Pass 59 — Tactical Memory direct-package and runtime-risk correction

The second competitor scan did not find a current v14 package that publishes
the exact live workflow, but it did find adjacent features that constrain the
claim. Battle Replay uses temporary ghost tokens for after-the-fact replay,
not a player's live memory of a hostile token. Group Tokens and Foundry's
movement-history APIs track movement histories for tokens that still exist and
are being controlled, not observer-scoped visibility observations. Movement
Approval displays prospective player paths, not historical enemy positions.
Shared Token Visibility remains the closest visibility point solution, but its
published behavior is current revealed-token sharing and its package is not
verified for modern Foundry.

This keeps Tactical Memory open, but narrows it. The first product slice must
be a live, temporary, player-safe overlay for a dungeon/combat encounter, not a
general fog-of-war replacement, replay engine, or campaign-history database.
The hard technical question is not drawing a ghost; it is capturing the exact
observer's last permitted view without leaking a hidden token's current
position, then converging correctly after movement, visibility changes,
reconnect, expiry, and GM correction. Static API or adjacent-package evidence
does not certify that behavior.

**Decision:** keep Tactical Memory as the provisional challenger, but do not
advance it to implementation or pricing claims yet. The next trial must use at
least two player clients and one GM-controlled hidden enemy, compare current
visibility tools and manual markers, and test a real non-zero price. Reject the
candidate if buyers prefer ordinary markers, if the feature is understood as a
novelty, or if exact per-player observation cannot be made safe and
deterministic. Dungeon Master's Forge remains backburnered.

Sources:

- https://foundryvtt.com/packages/battle-replay
- https://foundryvtt.com/packages/group-tokens
- https://foundryvtt.com/packages/movement-approval
- https://foundryvtt.com/api/interfaces/foundry.documents.types.TokenMovementData.html
- https://foundryvtt.com/packages/shared-token-visibility

### Pass 60 — Tactical Memory buyer/pricing proxy and Foundry feasibility

The buyer and pricing pass separates category precedent from product proof.
Current paid Foundry products already sell visibility and table-control
workflows: Player Perspective is a paid publisher module for v13–v14 that
simulates each player's fog, token visibility, and restricted assets, while
Stage Master is a paid v14 product that sells shared vision, controlled party
views, fog tools, camera control, and player-facing scene direction. This shows
that GMs do pay for visibility/session-control improvements, but it does not
prove they will pay for last-seen ghosts. The community's paid-module and
subscription complaints are mixed evidence, so the Tactical Memory price must
be tested directly rather than inferred from Patreon precedent.

The Foundry v14 technical surface is plausible for a narrow first slice.
Foundry documents a `sightRefresh` hook when the CanvasVisibility layer is
refreshed, `CanvasVisibility.testVisibility` for point/LOS testing, and token
vision/visibility data. A player-local observer can therefore record a token
only after the current client confirms it was visible, then create a temporary
local ghost when that token leaves view. A party-shared mode may transmit only
the already-observed token ID/position/round record; it must never receive a
GM broadcast of current hidden token positions.

The privacy boundary is mandatory: never derive memory from every token
document merely because a client can technically enumerate it, never send raw
GM token positions to players, and never treat API existence as runtime proof.
The fixture must test hidden tokens, walls, multiple observers, token movement,
visibility refresh, reconnect, expiry, and GM correction. Private-memory mode
should be the default because it has the smallest information-sharing surface.

**Decision:** keep Tactical Memory as the provisional challenger and set no
price claim. The next buyer test must include Player Perspective and Stage
Master as paid-category controls and ask for a real $5/$10/$15 one-time choice.
The next technical trial must prove the player-local observation boundary on
Foundry v14 before any party-sharing or cross-VTT work is considered. Reject it
if buyers will only accept it as a free feature, if the paid controls make it
redundant, or if the privacy fixture cannot prove no hidden-position leakage.

Sources:

- https://foundryvtt.com/packages/player-perspective
- https://foundryvtt.com/packages/stage-master
- https://foundryvtt.com/api/functions/hookEvents.sightRefresh.html
- https://foundryvtt.com/api/classes/foundry.canvas.groups.CanvasVisibility.html
- https://foundryvtt.com/api/interfaces/foundry.documents.types.TokenData.html
- https://foundryvtt.com/article/tokens/

### Pass 61 — wide-marketability scorecard and candidate discipline

The broader community scan prevents overvaluing the most visually attractive
idea. The same recent request thread contains demand for zero-prep modules,
mobile access, spreadsheet-like persistent state on a scene, journal/window
organization, Bastion expansion, and a Last Known Position ghost. Several are
real problems, but the current market already contains relevant substitutes:
Stage Master and Player Perspective cover player-view/session presentation,
SessionFlow and Whiteboard Experience cover live shared canvases/state,
current mobile companions cover device access, v14 core popouts address window
organization, and Indy Ventures covers much of the Bastion/enterprise loop.
The community comments are recruiting evidence, not a ranked willingness-to-pay
survey.

The current scorecard is qualitative and deliberately conservative:

| Candidate | Buyer breadth | Direct gap | Demo clarity | Runtime risk | Status |
| --- | --- | --- | --- | --- | --- |
| Tactical Memory | Medium; tactical/stealth GMs and their players | Medium-high; no exact current live package found | High | High; per-player privacy | Provisional leader |
| Player POV / visibility QA | Medium-high | Low; paid Player Perspective and Stage Master | High | Medium | Demote |
| Shared state / scene dashboard | Medium | Low-medium; SessionFlow, WBE, tiles, journals | Medium-high | Medium | Demote |
| Mobile player companion | Medium-high | Low; active companion products | Medium | High; device/runtime matrix | Demote |
| Zero-prep dungeon generator | Medium | Unknown; content and generator category is crowded | High | High; content quality and system scope | Research only |
| Bastion expansion | Narrow; D&D 2024 campaign users | Low-medium; Indy Ventures and native Bastion features | Medium | Medium; system-specific | Demote |

Tactical Memory is therefore still only the **provisional leader**, not the
selected product. It leads because it combines a direct player-facing request,
a simple visible promise, a possible system-neutral event ledger, and fewer
identified exact competitors. Its buyer breadth is still below the requested
wide-market target, and its WTP is zero-evidence until a real price-choice test
is run.

**Decision:** preserve Tactical Memory as the next trial while keeping the
fresh search open. Do not start implementation, infer a market from upvotes, or
use the scorecard as buyer validation. The next authoritative gate remains a
paid four-way buyer test plus a two-player privacy fixture. If either fails,
return to the wide-market scan rather than expanding Tactical Memory into a
generic combat suite. Dungeon Master's Forge remains backburnered.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_what_module_would_you_like_to_see/
- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/stage-master
- https://foundryvtt.com/packages/player-perspective
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/whiteboard-experience
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/indy-ventures

### Pass 62 — zero-prep encounter board adversarial correction

The broader “run an improvised encounter in seconds” problem is real. GMs
describe needing an unexpected library, road, or cave fight without 20–30
minutes of scene preparation, and the eye-catching promise would be a blank
grid that becomes a playable encounter board while the table watches.

The exact implementation gap is already narrower than it first appeared.
Dungeon Draw is current for Foundry v14 and already supports live room, wall,
door, and theme drawing, undo/redo, procedural dungeon generation, export, and
automatic lighting-wall/scene updates. Quickdraw is a paid current module for
temporary live drawings that fade after a timeout. SessionFlow's Cartographer
already provides tactical maps, markers, scale, broadcast, and quick scenes.
Quick Encounters is stale after v12, but its encounter-packaging workflow is
still represented by newer scene/encounter tools and does not create a clean
market gap by itself.

A possible narrow wedge would be an ephemeral, no-world-mutation encounter
board that combines one-click procedural layout, temporary walls, quick hostile
token placement, and automatic cleanup. However, that is close enough to
Dungeon Draw plus Quickdraw and current scene tools that it should not advance
without a buyer naming a repeated failure in those products.

**Decision:** demote Instant Encounter Board as a separate candidate. Keep it as
a control in the Tactical Memory buyer comparison, because a GM who really
wants zero-prep play may prefer it. Do not build another map-drawing product.
The wide-market search remains open and Tactical Memory remains only the
provisional leader.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/srufxi/how_easy_is_to_set_up_a_map_on_the_fly/
- https://www.reddit.com/r/FoundryVTT/comments/1g6olk5/how_do_you_get_everything_prepped_and_session_ready_week_to_week/
- https://foundryvtt.com/packages/dungeon-draw
- https://foundryvtt.com/packages/quickdraw
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/quick-encounters

### Pass 63 — Tactical Memory rights and portability correction

The product boundary can be made unusually clean from a rights perspective.
Foundry's module guidance supports modules that change functionality and its
publisher guidance allows authors to publish or sell Foundry content subject
to licensing. The licensing guide still requires rights for distributed
artwork, icons, music, and other third-party content. Tactical Memory does not
need to ship any of those: the first slice can render a procedural ghost or a
local silhouette using the token appearance already available to the current
client, with no bundled rule text, campaign assets, or cloud service. The
manifest should include an explicit license and the product should avoid
WotC/D&D art, names, and copied rules text.

Portability is possible at the protocol boundary, not by pretending the same
module code will run everywhere. The neutral record is an observation event:
observer scope, scene binding, observed token binding, observed position and
elevation, round/time, uncertainty, and expiry. Foundry can be the first
adapter. Roll20 would require its Pro Mod Script/API surface, and Owlbear
would require an extension using its own visibility, storage, and broadcast
model. Both are separate adapter proofs; neither is evidence of parity today.

**Decision:** rights risk is low and manageable if the product ships only
original code and procedural/local presentation. Portability is medium at the
ledger/protocol level and unproven at the adapter level. This removes a
licensing objection but does not improve the buyer-breadth or willingness-to-
pay evidence. Tactical Memory remains provisional and unselected; the next
research move is a genuinely fresh payer-problem search, not implementation.

Sources:

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/article/licensing-guide/
- https://foundryvtt.com/article/publisher-handbook/
- https://wiki.roll20.net/API%3AEvents
- https://extensions.owlbear.rodeo/smoke

### Pass 64 — fresh search: live multilingual table bridge

The fresh search found a different player-facing problem: international groups
can play together, but the table's actual speech and chat still assume one
language. A Foundry community request explicitly asked for different players
to use different languages, and recent gaming-tool projects are appearing
around live voice translation and on-screen translation. That is a recurring
table problem for mixed-language families, international friend groups, and
online communities; the payer would usually be the GM or table organizer who
wants to keep the group together.

The existing package surface is fragmented rather than empty. Polyglot is
current and valuable, but its purpose is fictional-language obfuscation and
per-character language knowledge. Comprehend Languages and Journal Translator
focus on journals, item descriptions, or selected text. Small World is the
closest historical match for per-user instant chat translation, but its listed
support stops at Foundry v9–10. The result is a plausible v14 gap for live,
per-user table translation, not a claim that translation itself is novel.

**Fresh challenger:** **TableSpeak / Live Table Translation Bridge** — a
Foundry-first, player-scoped chat translation layer with optional caption
output. The first slice should translate typed chat and preserve the original
message on demand; voice transcription/translation is a later gate. A
BYOK/local-provider design is preferable to a mandatory hosted service.

Eye-catching demo: an English-speaking GM sends a message and each player sees
it in their chosen language, while a shared original remains available for
clarity. The feature is immediately understandable and player-visible, but the
buyer segment is still a hypothesis and translation latency/quality could
destroy trust at the table.

**Decision:** open TableSpeak as a fresh challenger and keep Tactical Memory
unselected. Do not build either candidate. The next pass must audit live
translation competitors, manual Discord/voice workarounds, privacy/provider
cost, and a real table-owner price choice.

Sources:

- https://www.reddit.com/r/DnD/comments/11gblpb/can_the_gm_and_player_see_different_languages/
- https://foundryvtt.com/packages/polyglot
- https://foundryvtt.com/packages/comprehend-languages/
- https://foundryvtt.com/packages/journal-translator
- https://foundryvtt.com/packages/small-world
- https://foundryvtt.com/packages/lib-captions
- https://foundryvtt.com/api/functions/hookEvents.chatMessage.html

### Pass 65 — live-translation adversarial competition and scope correction

The direct competition audit prevents an overbroad claim. Small World proves
that per-user instant chat translation has already been attempted in Foundry;
its age is a maintenance gap, not proof of demand. Modern AI packages such as
Cibola 8 also advertise translation, but as a broad content/authoring feature,
not a low-latency per-player chat bridge. External Discord and desktop voice
translation tools are the strongest substitute because many tables already
keep voice outside the VTT.

Voice translation should therefore not be the first product promise. It adds
speaker attribution, latency, consent, audio capture, provider cost, and
failure recovery. The safer first wedge is typed-chat translation with an
optional caption surface backed by the existing caption interface, followed by
voice only after a table proves it would pay and tolerate provider latency.

The corrected scorecard is:

| Candidate | Buyer breadth | Direct gap | Demo clarity | Runtime/provider risk | Status |
| --- | --- | --- | --- | --- | --- |
| TableSpeak typed-chat bridge | Medium; international and bilingual tables | Medium-high in current Foundry; stale/fragmented substitutes | High | Medium-high; translation quality and API cost | Fresh challenger |
| TableSpeak live voice translator | Medium; same buyer group | Medium; external gaming translators exist | Very high | High; audio, consent, latency, cost | Defer |
| Tactical Memory | Medium; stealth/pursuit GMs | Medium-high | High | High; observer privacy | Provisional, unselected |

The buyer is not “anyone who wants a translated UI.” The test must recruit
tables where two people actually struggle to follow the same live session and
ask the organizer whether typed-chat translation would be used every session,
whether Discord/desktop translation is good enough, and whether the group
would pay $5, $10, or $15 one time for a BYOK/local module. A positive reaction
to a translated screenshot is insufficient.

**Decision:** keep TableSpeak as the leading fresh challenger for the next
buyer pass, but cap the first slice at typed chat and optional captions. Reject
it if a table prefers external voice/chat tools, if translation errors create
rules misunderstandings, if provider/privacy requirements force a service, or
if non-zero price and pilot commitments do not appear.

Sources:

- https://foundryvtt.com/packages/small-world
- https://foundryvtt.com/packages/cibola8
- https://foundryvtt.com/packages/comprehend-languages/
- https://foundryvtt.com/packages/journal-translator
- https://foundryvtt.com/packages/lib-captions
- https://foundryvtt.com/api/functions/hookEvents.chatMessage.html
- https://www.reddit.com/r/SideProject/comments/1w8cqxx/i_got_tired_of_not_understanding_my_nonenglish/

### Pass 66 — TableSpeak provider economics and paid-product boundary

The provider audit makes the smallest viable commercial shape clearer. Google
Cloud Translation offers a free monthly character allowance and then metered
text pricing; DeepL offers developer APIs and separate paid plans for API and
voice use. That makes a BYOK module technically and economically plausible for
small tables, but it also means the product cannot honestly promise unlimited
translation under a one-time purchase unless it caps usage or runs a local
model. A hosted service would need a separate subscription/credit product,
privacy policy, provider outage handling, and abuse controls.

Foundry's v14 `chatMessage` hook gives a narrow integration point for typed
messages, while the existing caption library provides a possible display
surface. This is enough to define an M0 proof without claiming that the
provider, translation quality, or VTT adapter is solved.

**Decision:** price-test two separate offers: a one-time BYOK/local TableSpeak
module and a clearly separate hosted plan with usage limits. Do not subsidize
provider usage from a one-time module price. Keep live voice deferred. If
buyers reject BYOK setup or will not pay for either offer, demote TableSpeak
and reopen the fresh search.

Sources:

- https://cloud.google.com/products/translate/pricing
- https://www.deepl.com/en/developers
- https://support.deepl.com/hc/en-us/articles/360019924499-About-DeepL-plans
- https://foundryvtt.com/api/functions/hookEvents.chatMessage.html
- https://foundryvtt.com/packages/lib-captions

### Pass 67 — TableSpeak external-substitute correction

The external substitute audit is stronger than the VTT package audit. Discord's
App Directory already exposes translation apps, and current products such as
BabelBot advertise per-user text translation plus paid image and live-voice
features. Other gaming translation tools sell low-cost time-limited voice
licenses or run as desktop overlays. A mixed-language group can therefore
solve the communication problem without touching Foundry.

TableSpeak only earns a product gap if it preserves VTT-specific semantics that
those tools lose: roll cards and document links remain clickable, whispers stay
scoped, speaker/token identity is preserved, and each player sees a private
translation without duplicating the chat for everyone. That is a useful wedge,
but it is a narrower buyer segment than “international gamers.” It also makes
the implementation more sensitive to Foundry chat rendering and provider
failure.

**Decision:** demote TableSpeak from “leading fresh challenger” to **conditional
challenger**. Keep the typed-chat prototype hypothesis open only for table
organizers who have already tried Discord/desktop translation and still lose
VTT context. Do not claim broad marketability until those organizers choose a
non-zero price and a three-session pilot. Reopen the wider search immediately.

Sources:

- https://support.discord.com/hc/en-us/articles/21334461140375-Using-Apps-on-Discord
- https://discord.com/discovery/applications/1345392991413735434
- https://tradlinker.com/en/
- https://synclingo.app/
- https://discordtranslator.com/

### Pass 68 — fresh challenger: guided character progression

The next fresh search targeted a much broader recurring player problem:
character creation and level-up choices are intimidating, especially for new
players, returning players, and campaigns that use dense systems. Community
questions describe players being unable to find a level-up control or relying
on external builders such as Pathbuilder, while recent Foundry packages show
that the problem is real enough to support dedicated workflows.

The direct-competition check closes most of the apparent gap. Character Builder
is current for Foundry v14 and D&D5e 5.3.3 with guided creation, level-up,
multiclass, validation, and a first-run tutorial. Hero Mancer covers guided
D&D5e creation and level-up, while PF2e Level-Up Wizard and PF2e Leveler cover
the corresponding Pathfinder workflows. A generic “level-up wizard” would be
a duplicate and would inherit system-specific rules and content maintenance.

There may still be a cross-system onboarding opportunity around explaining
what a player can do right now, but that becomes the already-crowded HUD and
player-cockpit category. It is not a clean new product.

**Decision:** demote Level-Up Concierge as a separate product. Keep guided
progression only as a control when comparing TableSpeak or any future
player-facing product, and continue the fresh search for a payer problem that
is recurring, eye-catching, and not already owned by a current v14 package.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1t13p9d/level_up_button_not_appearing/
- https://foundryvtt.com/packages/dnd5e-character-builder
- https://foundryvtt.com/packages/hero-mancer
- https://foundryvtt.com/packages/pf2e-level-up-wizard
- https://foundryvtt.com/packages/pf2e-leveler
- https://www.reddit.com/r/Pathfinder2e/comments/1sj2tti/deciding_between_pf2e_level_up_wizard_and_pf2e_leveler_modules/

### Pass 69 — fresh challenger: automatic party evidence locker

The next fresh search targeted a recurring, player-visible failure that is
smaller than campaign memory but more concrete: a GM shows a clue, portrait,
map, letter, or item image once, and later the party cannot find it. Community
workarounds use player-owned journals, folders, or manually created handouts.
That proves a repeated workflow, but not yet a paid market.

**Fresh challenger:** **Evidence Locker / Session Gallery** — a
Foundry-first, player-scoped gallery that records artifacts already revealed to
each player and lets them reopen the original handout or linked document later.
The first slice should reference existing Foundry documents and shared media,
not silently copy GM-only files or invent a second campaign wiki. Each receipt
needs the artifact identity, permitted recipients, session/time, caption or
context, source link, and a GM revoke/forget action.

Eye-catching demo: the GM reveals a mysterious letter; it visibly lands in
each permitted player's “Evidence Locker” with a session stamp, can be
reopened during a puzzle, and remains absent from players who were not meant to
see it. This is easier to understand than generic campaign memory and gives
players a reason to return to the product during play.

The likely payer is a GM running investigation-heavy, mystery, horror, or
handout-rich campaigns, especially a group with long gaps between sessions or
players who repeatedly ask for previously shown material. A tentative one-time
price is $5–10, but that is only a test range. The product must beat native
journals, manual ownership changes, Discord pins, and separate handout apps.

**Decision:** open Evidence Locker as a conditional fresh challenger. Do not
build it or treat “players want to see old handouts” as willingness-to-pay
evidence. The next pass must audit current Foundry presentation modules and
cross-VTT/external handout products, especially whether automatic capture and
VTT document semantics create a real advantage.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1kg2j4u/foundry_tip_how_to_create_player_handouts/
- https://www.reddit.com/r/FoundryVTT/comments/14w2gq6/player_handouts/
- https://foundryvtt.com/packages/niks-show-and-tell
- https://foundryvtt.com/packages/quick-scenes
- https://foundryvtt.com/packages/investigation-board

### Pass 70 — Evidence Locker external-substitute correction

The external audit prevents an inflated gap claim. LoreBox already markets
real-time handout delivery, an organized campaign library, and a personal
collection of everything shared across past sessions. TableWeaver targets a
clean GM-controlled player display for maps, clues, handouts, and quest state.
Roll20 provides native handouts and archive behavior, while Owlbear's GM Vault
supports organized handouts and selective sharing. These are direct substitutes
for a broad “handout delivery and recall” product.

Foundry's current packages also close much of the presentation side. Nik's
Show & Tell makes ad-hoc image sharing and chat integration easy; Handout Ping
Viewer adds synchronized pan, zoom, and pings; Investigation Board turns
images and linked objects into a collaborative evidence surface. Their public
descriptions do not establish an automatic, per-player receipt history for every
artifact shown, but that absence is not proof that buyers will pay for one.

The only defensible wedge is narrower: automatic capture of already-authorized
revelations, per-player permission and revocation, one-click reopening of the
original Foundry document or roll/item link, and a session receipt that works
without a second service. LoreBox and other external tools make “players keep
handouts” a weak differentiator; Foundry semantics and zero extra app setup
must be the reason to buy.

**Decision:** keep Evidence Locker conditional, not selected. Require a buyer
test against native journals, Discord/pinned files, LoreBox, and a manual
Foundry workflow. Reject it if buyers are satisfied with a separate gallery or
if automatic capture is perceived as clutter, spoiler risk, or duplicate
storage. Reopen the wide search after this gate rather than allowing a pretty
gallery to become the next unvalidated product thesis.

Sources:

- https://lorebox.co.uk/
- https://tableweavergm.com/
- https://tableweaver.app/
- https://wiki.roll20.net/Handouts
- https://extensions.owlbear.rodeo/gm-vault
- https://foundryvtt.com/packages/niks-show-and-tell
- https://foundryvtt.com/packages/handout-ping-viewer
- https://foundryvtt.com/packages/investigation-board

### Pass 71 — fresh challenger: world-clock resource automator

The next fresh search found a direct recurring request from exploration and
survival-oriented tables: timers for torches, random-encounter checks, rituals,
fatigue, and other resources should follow in-game time rather than wall-clock
seconds. A system-agnostic request explicitly asks for named timers, automatic
expiration, and a narrative message when a resource runs out. This is a
stronger pain signal than a generic “more automation” request, but it is still
not payment evidence.

**Fresh challenger:** **World Clock Automator** — a visual, system-agnostic
workflow that binds a resource or effect to Foundry world time, shows remaining
duration to the permitted users, and runs a visible action when the clock
crosses a boundary. The attractive demo is a torch lit from inventory, a
progress ring counting down as the party advances the world clock, and a
whisper/chat cue when it expires. The neutral event record could later support
other VTTs.

The payer would be a GM running dungeon, hexcrawl, survival, horror, or
downtime-heavy campaigns. That segment is narrower than ordinary D&D tables,
and a world-clock product can become “another timer panel” unless it removes
real inventory bookkeeping and presents an obvious player-facing consequence.

**Decision:** open World Clock Automator as a fresh challenger only long enough
to complete the current-package and substitute audit. Do not build it yet.
The next pass must test Light Sources, About Time, SessionFlow, Expedition
Tracker, calendars, and current effect/trigger modules against the exact
workflow rather than comparing feature names.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1oq8qfsm/making_modules_instead_of_actually_playing_them/
- https://www.reddit.com/r/FoundryVTT/comments/1fp5ty8/module_for_timers_keyed_to_the_world_clock/
- https://foundryvtt.com/packages/light-sources
- https://foundryvtt.com/packages/about-time
- https://foundryvtt.com/packages/expedition-tracker

### Pass 72 — World Clock Automator direct-competition correction

The current-package audit closes the broad category. Light Sources now handles
inventory-backed torches and other light sources, consumes items, counts down
using in-game or real time, and removes the light when it expires. About Time
provides programmatic world-time events and reminders. Expedition Tracker adds
expedition turns, timed effects, optional wandering-monster rolls, and light
source behavior. SessionFlow provides travel/supply/fatigue time tracking and
progress clocks, while Calendaria provides condition-based notes and reminders.

The remaining possible wedge is not “timers”: it would be a no-code,
system-neutral authoring surface that connects world-time events to inventory,
effects, chat visibility, and reversible consequences without macros or
system-specific item assumptions. That is a useful design hypothesis, but the
current package set means the buyer must name a repeated workflow that these
tools do not cover and choose a non-zero price.

**Decision:** demote World Clock Automator as a standalone product. Keep its
event-record and consequence-preview mechanics as reusable research assets,
not as a selected product. The broad search remains open; do not turn a
recently requested convenience feature into a product without a price choice,
pilot, and a direct comparison against Light Sources plus existing time and
effect tools.

Sources:

- https://foundryvtt.com/packages/light-sources
- https://foundryvtt.com/packages/about-time
- https://foundryvtt.com/packages/expedition-tracker
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/calendaria
- https://foundryvtt.com/packages/glyph

### Pass 73 — World Doctor current competitor correction

The fresh search did not produce a stronger broad consumer gap than the
existing World Doctor hypothesis, so this pass rechecks that candidate against
the current v14 package surface. The pain signal is unusually concrete: recent
community discussion describes large module stacks becoming hard to maintain,
users stripping worlds back to avoid breakage, and long campaigns being held
on older versions because migration risk is stressful. This is still community
evidence, not a conversion rate.

The direct substitute set is now broader. Foundry itself provides package
backups, snapshots, restore, compatibility metadata, and migration guidance.
Sephral's Content Backup & Restore adds named document backups and recovery;
Asset Auditor finds missing file paths; Find the Culprit isolates a troublesome
module by repeated halving; FileSmith adds verified file/document operations;
Scene Packer repairs links during scene/compendium packaging. These tools are
useful, but their public scopes are recovery, file auditing, isolation, or
packaging—not a pre-session rehearsal that answers which player-visible
behavior will break after a specific update.

**Corrected candidate:** **Game Night Preflight / World Doctor** — a read-only
diagnostic plus disposable-copy rehearsal. It should enumerate the exact core,
system, module, world, asset, and dependency versions; identify evidence-linked
risk; run a small smoke fixture against the active world copy; and produce a
report with safe next actions. Any repair must be previewed, backed up, applied
only by explicit GM action, reread authoritatively, and be reversible. A list of
red warnings or another backup browser is not enough.

**Decision:** keep World Doctor as the leading conditional GM/host candidate,
but do not select or implement it. It has the strongest recurring operational
pain found in the fresh search, while the product boundary is now narrow enough
to test honestly against core backups and current modules.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v5w7j5/im_new_to_foundry_vtt_what_module_would_you_like_to_see/
- https://www.reddit.com/r/FoundryVTT/comments/1ty0rnlu/v14_module_support/
- https://www.reddit.com/r/FoundryVTT/comments/1saezr6/i_deleted_all_of_my_backups_and_then_updated_to/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/packages/sephrals-content-backup-restore
- https://foundryvtt.com/packages/asset-auditor
- https://foundryvtt.com/packages/find-the-culprit
- https://foundryvtt.com/packages/filesmith
- https://foundryvtt.com/packages/scene-packer/

### Pass 74 — World Doctor payer, portability, and product-boundary pass

The buyer is not every Foundry user. The qualified payer is a GM or host with
a persistent or paid campaign, a substantial module/system stack, and a recent
incident or near miss involving an update, migration, broken asset, or module
interaction. A casual one-shot user can rely on a backup or reinstall and is a
negative control. Existing community pricing discussion supports testing a
buy-once utility rather than assuming another subscription, but it does not
prove a price. Test $15, $25, and $39 alongside no purchase.

The product must be marketed as “know before game night” rather than “manage
backups.” The demo is: select an update, see the exact world objects and assets
at risk, run a disposable rehearsal, receive a pass/fail receipt, and either
proceed or return to the known-good state. The eye-catching element is the
before/after risk report and a green “safe to play” receipt, not an admin
dashboard.

Portability is limited but plausible at the evidence boundary. A neutral
diagnostic packet can contain package identity/version, referenced asset
fingerprints, check results, repair proposals, and recovery receipts. Foundry
can be the first adapter. Roll20's hosted/Pro API and Owlbear's extension model
do not expose the same local world migration surface, so a second adapter would
be a separate read-only health probe, not feature parity. Licensing risk is
manageable if the tool ships original code and reports against user-owned
worlds without bundling publisher assets or copied rules text.

**Decision:** keep World Doctor as the leading conditional candidate for the
next actual buyer-price and disposable-copy pilot. Do not call it marketable
until qualified GMs choose it over Foundry backups plus support, a current
auditor/culprit workflow, or simply delaying the update, and until the exact
rehearsal can prove no live-world mutation.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1t5n76x/patreon_funded_modules_are_there_a_better_way_or_am_i_alone_here/
- https://www.reddit.com/r/FoundryVTT/comments/1v3xgpt/system_agnostic_long_term_campaigns_in_fvtt/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/asset-management/
- https://foundryvtt.com/article/package-management/
- https://wiki.roll20.net/API%3AEvents
- https://extensions.owlbear.rodeo/guide

### Pass 75 — fresh search: Tactical Sketchbook / Collaborative Map Ink

The next fresh scan deliberately moved away from authoring, campaign
continuity, world maintenance, and automated item construction. A current
high-engagement request thread contains an unusually direct buyer signal:
people want better drawing tools, one commenter says they would pay real money
for an Excalidraw-like layer, and another asks for Roll20-quality freehand
drawing. The same scan found a simpler player-trade request, but Item Piles
already advertises robust player-to-player trading, so trade is a negative
control rather than a new product direction. Mobile access is also occupied by
Swipe, PocketScroll, and companion modules.

**Fresh challenger:** **Tactical Sketchbook / Collaborative Map Ink** — a
fast, system-agnostic, touch-friendly sketch layer for live play. The first
use case is not “replace map-making software”; it is to let a GM or permitted
player draw, erase, label, measure, and temporarily reveal a route, room,
clue, or battle annotation in seconds, then save or discard it as a scoped
layer. A polished brush preview, one-key palette, player/GM visibility, undo,
snapshot, and “bake to native drawing/tile” action make the demo legible in a
single screen recording.

The likely payer is a GM who improvises maps, runs theatre-of-the-mind or
hexcrawl sessions, uses a touchscreen/table display, or has repeatedly lost
time fighting the native drawing workflow. Players benefit from shared
annotation, but the GM controls the purchase. This is a stronger ordinary-play
signal than a niche compiler, but it is still a request and not payment proof.

**Decision:** open Tactical Sketchbook only as a fresh challenger. Do not
implement the generic promise “better drawings” until the direct package audit
and buyer comparison are complete.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_what_module/
- https://www.reddit.com/r/FoundryVTT/comments/1taih7u/map_drawing_modules/
- https://foundryvtt.com/packages/item-piles/
- https://foundryvtt.com/packages/swipe-vtt
- https://foundryvtt.com/packages/pocketscroll-socket

### Pass 76 — Tactical Sketchbook direct-competition correction

The direct audit prevents an easy false positive. Foundry core already offers
freehand, shapes, polygons, text, and permission-controlled drawings.
Precise Drawing Tools improves sampling, color picking, and conversion to a
tile; Advanced Drawing Tools adds editing and text options; Dungeon Draw is a
current v14 dungeon mapper with undo/redo, doors, themes, and generation;
Quickdraw provides temporary live annotations; and Gambit’s Enhanced Drawing
is being positioned as a premium early-access improvement to the same pain.
Roll20 already provides a mature freehand/shape/text toolbox, so “Foundry
needs drawing tools” is not an unserved category.

The remaining wedge is a **play-speed sketch workflow**, not a larger editor:
a floating, touch/pen-friendly toolbar; private, party, and GM-only layers;
temporary marks with automatic cleanup; saved snapshots and reversible layer
promotion; a journal/handout canvas that can be annotated without changing the
scene; and native Foundry export that does not require an external whiteboard.
It must be faster to use during a live session than opening a general editor,
and it must be visually cleaner than a pile of permanent SVG drawings.

**Decision:** keep Tactical Sketchbook conditional, but reject a generic
Excalidraw clone, map generator, or drawing-settings bundle. The next buyer
test must compare native drawings, Dungeon Draw, Precise Drawing Tools,
Quickdraw, Gambit’s premium direction, and external Miro/Excalidraw/manual
screenshots against the narrow live-play workflow.

Sources:

- https://foundryvtt.com/article/drawings/
- https://foundryvtt.com/packages/precise-drawing-tools
- https://foundryvtt.com/packages/advanced-drawing-tools
- https://foundryvtt.com/packages/dungeon-draw
- https://foundryvtt.com/packages/quickdraw
- https://www.reddit.com/r/FoundryVTT/comments/1vcsd1g/gambits_enhanced_drawing_module_preview_system/
- https://wiki.roll20.net/Drawing_Tools

### Pass 77 — Tactical Sketchbook buyer, portability, and eye-catching test

The paying cohort is narrower than “anyone who likes maps”: GMs who draw or
annotate during at least three sessions per month, run improvisational or
hexcrawl play, use a touchscreen/TV/hybrid table, or have recently abandoned a
map/whiteboard annotation workflow. A GM who only imports finished battlemaps
is a negative control. The marketing test should show a blank scene becoming a
clear dungeon route or tactical plan in under thirty seconds, with the same
strokes switching from player-visible to GM-only and then being discarded or
saved as a clean native layer. Test a one-time $10, $20, and $30 offer against
no purchase; do not infer willingness to pay from a premium competitor’s
existence.

Foundry is a sensible first adapter because its DrawingDocument and scene
layers can preserve native permissions and export behavior. A neutral
`vtt-sketch` record can carry strokes/shapes/text, layer scope, scene or image
anchor, style, author, revision, expiry, and export target. Roll20 has its own
drawing objects and layer permissions; Owlbear has an extension model and
mobile verification requirements. That makes portability plausible at the
document/annotation boundary, but not proof of equivalent brushes, history,
permissions, or performance. The first release should avoid copied art and
external hosted storage.

**Decision:** Tactical Sketchbook is now the newest fresh conditional
challenger, not the selected product. Advance it only if qualified GMs prefer
the live sketch workflow over current modules and external tools, choose a
non-zero price, and complete a three-session pilot. If buyers only want a free
drawing fix or Gambit/Precise/Dungeon Draw is good enough, demote it and resume
the wide search. World Doctor remains a separate conditional GM/host
hypothesis; Dungeon Master’s Forge remains backburnered and untouched.

Sources:

- https://foundryvtt.com/api/classes/foundry.documents.DrawingDocument.html
- https://wiki.roll20.net/Drawing_Tools
- https://extensions.owlbear.rodeo/verified
- https://extensions.owlbear.rodeo/guide

### Pass 78 — Tactical Sketchbook current-package correction

The current package audit is stronger than the earlier early-access signal.
Gambit's Image Viewer is already a current v13+ / v14-verified premium module
with GM-controlled real-time drawing and text annotations on images and
videos, pings, player editing, and optional player saves. Gambit's Enhanced
Drawing is also being positioned as a premium expansion of Foundry's canvas
drawing tools, with vector erasing, lasso selection, stamps, connectors, and
shape recognition. The direct category is therefore actively occupied.

**Correction:** demote the broad Tactical Sketchbook thesis. The only
remaining testable wedge is a very narrow live-scene operation that current
image annotation and drawing editors do not promise together: temporary
route/area marks on the active map, scoped private/party/GM layers, automatic
cleanup, and a reversible “promote this mark to a native scene layer” action.
Even that may be a feature request rather than a business. Do not treat the
premium competitor as proof of our own willingness to pay.

Sources:

- https://foundryvtt.com/packages/gambitsImageViewer
- https://www.reddit.com/r/FoundryVTT/comments/1vcsd1g/gambits_enhanced_drawing_module_preview_system/
- https://foundryvtt.com/article/premium-content/

### Pass 79 — fresh challenger: Adventure Navigator / GM Searchlight

The next fresh scan found a concrete live-play cost in a recent v14 journal
discussion: a GM reported spending about fifteen minutes searching through
journal entries during a session. The problem is not simply that search exists
or that journals look unattractive. It is the loss of play momentum while a GM
tries to locate the right passage, map, NPC, clue, or next procedure inside a
large imported adventure.

**Fresh challenger:** **Adventure Navigator / GM Searchlight** — a local,
read-only session-context lane for user-owned adventure content. It would
index journal text, page headings, linked actors/items/scenes, map notes, and
the current scene/location; then present the most relevant passages and
actions in a compact GM runbook. The first demo is “select the current scene →
see the relevant boxed text, NPCs, map, clue links, and next-step checklist →
open the exact source document.” It must preserve permissions and never send
content to a cloud service by default.

The payer hypothesis is a GM running a purchased or imported adventure path,
large campaign conversion, or journal-heavy homebrew. The buyer is not a
module author and not a worldbuilder who wants a new wiki. A GM who rarely
uses imported content is a negative control. This is a stronger recurring
session-cost signal than a general “organize my lore” request, but it is not
payment evidence.

**Decision:** open Adventure Navigator only for direct capability correction.
Do not build a generic search bar, campaign wiki, AI copilot, or journal skin.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1t44br2/v14_and_searching_journals/
- https://foundryvtt.com/article/journal/
- https://foundryvtt.com/article/compendium/

### Pass 80 — Adventure Navigator direct-competition correction

The gap is narrower than the first description suggests. Search and Highlight
currently searches journal pages, actor names, item names, and can highlight
matching journal text on Foundry v14. Simple SearchBar and Quick Insert offer
global search, keyboard navigation, and direct opening or dragging of results.
Monk's Enhanced Journal adds description search and highlighting, bookmarks,
tabs, and specialized sheets. Campaign Codex adds linked relationships,
tagging, permissions, quest and table-of-contents organization, and active
campaign tools. World & Campaign Builder adds relationship-aware search,
session planning, and live-play tracking as a free module; Simulacrum adds an
AI document search/campaign copilot path.

**Corrected wedge:** a **deterministic session context lane**, not another
search or knowledge base. It must use the active scene, selected map note,
opened adventure, or GM-selected location as context; show ranked evidence
with exact source links; expose a short pre-session “what can happen here?”
runbook; and let the GM dismiss or pin results without rewriting campaign
content. No AI, cloud index, bundled adventure text, or automatic document
mutation belongs in the first claim.

**Decision:** keep Adventure Navigator conditional, with a higher bar than
Tactical Sketchbook. Reject it if Search and Highlight plus Campaign Codex or
World & Campaign Builder solves the same incident after a real fixture, or if
the buyer only wants full-text search that free modules already provide.

Sources:

- https://foundryvtt.com/packages/fullsearch
- https://foundryvtt.com/packages/simple-searchbar
- https://foundryvtt.com/packages/monks-enhanced-journal
- https://foundryvtt.com/packages/campaign-codex
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/packages/simulacrum

### Pass 81 — Adventure Navigator buyer, portability, and product boundary

The qualified buyer is a GM who runs a journal-heavy imported adventure or
large conversion at least monthly and has recently lost session time searching
for a passage, actor, map, clue, or procedure. Test against the GM's current
search module, Campaign Codex or World & Campaign Builder, PDF/book search,
manual bookmarks, and an external note system. The eye-catching demo is a
context switch, not an AI chat: select “House A” or the current scene and
receive the exact evidence-linked runbook in seconds.

Test a one-time $15, $25, and $39 offer against no purchase, plus a
three-session pilot. The fixture must measure time-to-source, false positives,
missing links, permission boundaries, and whether the runbook changes actual
session flow. A search result that is merely faster is not enough if buyers
prefer the free tools.

The portable boundary is a neutral context-index record: source document ID,
page/heading, scene or location anchor, relationship edges, evidence excerpt
hash, visibility scope, rank explanation, and dismissed/pinned state. Foundry
can use JournalEntry, Scene, Note, Actor, Item, and compendium adapters. Roll20
and Owlbear would need independent adapters for journal/handout or extension
surfaces; no cross-VTT content-parity claim is valid until one second adapter
passes. Index only user-owned content, store local hashes rather than copied
publisher text, and link back to the source document to manage licensing risk.

**Decision:** Adventure Navigator is the newest fresh conditional challenger,
not a selected product. It advances only if qualified adventure-running GMs
prefer the contextual runbook over current free tools, choose a non-zero price,
complete a three-session pilot, and the local permission/index fixture passes.
World Doctor remains a separate conditional infrastructure candidate;
Tactical Sketchbook is narrowed and demoted; Dungeon Master's Forge remains
backburnered and untouched.

Sources:

- https://foundryvtt.com/api/v14/classes/foundry.applications.sidebar.tabs.CompendiumDirectory.html
- https://wiki.roll20.net/Handouts
- https://extensions.owlbear.rodeo/guide

### Pass 82 — Adventure Navigator technical, licensing, and portability correction

The Foundry-first implementation boundary is plausible but must remain
read-only. The v14 JournalEntry API exposes scene-note relationships,
permission checks, and user-specific visibility; the journal documentation
also defines None, Limited, Observer, and Owner behavior and supports links to
actors, items, scenes, and other journal entries. A local index can therefore
store identifiers, headings, relationship edges, hashes, and ranking metadata
while opening the authoritative source document only after checking the
current user's permission.

That is not a certificate that the product is safe. The fixture must prove
that a GM-only page never appears in a player-facing result, that a source edit
invalidates or refreshes the index, that a deleted or migrated document is
reported as stale, and that reindexing is deterministic. No copied adventure
text or publisher art should be shipped. Storing a hash and a link to
user-owned content reduces distribution risk but is not legal advice and does
not eliminate every licensing question.

Portability stops at a neutral context-index contract. Roll20 handouts and
Owlbear extensions can support separate adapters, but their storage, search,
permissions, and extension lifecycles are not Foundry's. The first product
claim must be “local Foundry context navigation”; cross-VTT support is a
later read-only adapter experiment.

**Decision:** static technical feasibility is sufficient to justify a
disposable Foundry fixture, not sufficient to select or implement Adventure
Navigator. The candidate still needs direct buyer choice, price, pilot,
permission, stale-link, and second-VTT evidence.

Sources:

- https://foundryvtt.com/api/classes/foundry.documents.JournalEntry.html
- https://foundryvtt.com/article/journal/
- https://foundryvtt.com/api/
- https://wiki.roll20.net/Handouts
- https://extensions.owlbear.rodeo/verified

### Pass 83 — cross-candidate marketability scorecard and next empirical gate

The accumulated evidence now supports prioritization, but not a marketability
claim. Every surviving candidate has a strong signal and an explicit failure
mode:

- **Adventure Navigator:** clear recent session-time loss, strong thirty-second
  demo, moderate buyer breadth, high competition from maintained free tools,
  moderate indexing/privacy risk, and manageable licensing if it stores local
  references rather than adventure text.
- **World Doctor:** high-value update anxiety among module-heavy long-running
  campaigns, a compelling “safe to update” promise, narrower but higher-value
  payer, high disposable-runtime and false-green risk, and limited portability.
- **Tactical Sketchbook:** highly visual demand and category spending, but the
  broad category is now directly occupied by current premium and free drawing
  products; it remains a fallback only for a very narrow temporary scene-layer
  workflow.
- **Dungeon Master’s Forge:** remains explicitly backburnered and is not part
  of the selection test.

No candidate has product-specific willingness-to-pay, a scheduled real-table
pilot, or live runtime evidence. Community requests, package existence, and a
good demo are not substitutes for those gates.

**Next empirical gate:** recruit qualified adventure-running GMs first and run
the Adventure Navigator fixture against their actual current workflow plus
Search and Highlight/Simple SearchBar/Quick Insert and Campaign Codex or World
& Campaign Builder where applicable. Ask for $15/$25/$39/no purchase and a
three-session pilot. Run World Doctor as the second arm with its own qualified
module-heavy GM cohort; do not combine the two offers or let a search result
buyer validate update-safety demand. Keep Tactical Sketchbook dormant unless
the same recruitment produces a drawing-heavy buyer with a failure that the
current Gambit/core tools do not solve.

**Decision:** Adventure Navigator is the next pilot candidate, not the selected
product. The goal remains open until buyer choice, price, pilot, runtime,
licensing boundary, and portability evidence converge on one product.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1t44br2/v14_and_searching_journals/
- https://foundryvtt.com/packages/fullsearch
- https://foundryvtt.com/packages/campaign-codex
- https://foundryvtt.com/packages/campaign-builder
- https://foundryvtt.com/article/backups/

### Pass 84 — fresh challenger: Rapid Encounter Board / Live Scene Staging

A newer community feature discussion contains a recurring GM complaint that
Foundry takes too many clicks for improvised map work: users miss Roll20's
ability to make an encounter map quickly, search for an image, and drag assets
onto the board without thinking about the current layer or object type. The
same discussion mentions a desire for a simple mobile companion, but current
mobile products make that a negative control rather than a fresh gap.

The fresh product hypothesis is not a general map editor. It is a **Rapid
Encounter Board** for a GM who needs a playable scene during a session: choose
a background or blank grid, drop user-owned assets, create a correctly sized
scene, and optionally add a small set of temporary walls, lights, labels, and
tokens. The board should be disposable or promotable to native Foundry data,
with a visible “ready for players” state and no bundled publisher art.

The likely payer is an improvisation-heavy GM who creates at least one
unplanned encounter per session, runs hexcrawls or investigations, or regularly
needs to turn a reference image into a playable scene. A map-making hobbyist
and a GM who only imports finished maps are negative controls. The marketing
demo is a timed before/after: blank image to grid, token placement, and safe
player reveal in thirty seconds. Test one-time $15/$25/$39 against no purchase
and a three-session live-play pilot.

**Decision:** keep Rapid Encounter Board open only for a direct competition and
buyer correction. Generic map-making, asset search, and bulk scene import are
not assumed to be gaps.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/scene-express
- https://foundryvtt.com/packages/mass-import
- https://foundryvtt.com/packages/dragupload/
- https://foundryvtt.com/packages/swipe-vtt

### Pass 85 — Rapid Encounter Board direct-competition correction

The direct audit closes most of the broad candidate. MapForge is already an
in-Foundry alpha that imports Dungeondraft packs, paints floors and paths,
places and edits walls, adds lights, and tests roof/occlusion behavior. FA
Nexus is an in-Foundry map-maker and content hub with asset browsing, path
mode, texture painting, and a building tool, with premium content and features
supporting the creator's subscription model. Moulinette covers local and cloud
asset search/import, while Scene Express and Mass Import remove common scene
creation and folder-import friction. Forgotten Adventures also supplies a
large mapmaking asset library and an in-Foundry maker direction.

The remaining wedge is therefore narrower: a **live encounter staging lane**
that is faster than full map-making and safer than ad-hoc native editing. It
must start from a background, template, or text-free blank board; support
temporary private/party/GM layers; offer only the few controls needed in play;
and promote a chosen result to a native scene without owning or bundling an
asset catalog. If it merely adds another scene editor, image browser, or
import wizard, it should be rejected.

Portability is possible only at the package boundary. A neutral encounter
board can contain a background reference, grid, token references, wall/light
segments, labels, scope, temporary expiry, and promotion state. Foundry is the
first adapter; Roll20 and Owlbear would need separate scene/object/storage
adapters, so a shared JSON shape cannot prove equivalent behavior. The product
must also avoid redistributing creator assets or scraping image search.

**Decision:** Rapid Encounter Board remains a conditional challenger but is
not selected. It advances only if improvisation-heavy GMs choose it over
MapForge/FA Nexus/Moulinette/current import workflows at a non-zero price and
complete a three-session pilot. Otherwise the category is demoted as crowded.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1pslu0f/none_mapforge_alpha_v014_create_battlemaps/
- https://www.reddit.com/r/FoundryVTT/comments/1spey55/system_agnostic_mapforge_build_battlemaps_inside/
- https://foundryvtt.com/packages/mass-import
- https://foundryvtt.com/packages/scene-express
- https://www.forgotten-adventures.net/mapmaking-assets/
- https://assets.moulinette.cloud/docs/creator/secure-distribute/vtt/prepare
- https://extensions.owlbear.rodeo/guide

### Pass 86 — Rapid Encounter Board marketability correction

The competitor evidence is stronger than a simple package-page audit. MapForge
is explicitly presented as a commercial Foundry module, uses Patreon access
while it is in development, and has a visible buyer-feedback loop. A
commenter reports joining the lowest tier after seeing the demo and calls the
workflow phenomenal; other comments ask about subscription access, asset-pack
performance, and whether the tool can be tried before purchase. That is real
category payment and adoption evidence, although it is evidence for MapForge,
not willingness to pay for a new product.

This changes the buyer bar. Rapid Encounter Board cannot be marketed as “a
map maker for Foundry” or “Dungeondraft inside Foundry”; MapForge already owns
that message and visual proof. A new candidate must either beat it for a
repeatable live-session job—faster temporary staging, lower asset/performance
overhead, simpler player-safe promotion, or a credible one-time/no-subscription
offer—or be rejected. The comparison must show MapForge where available, not
use only native Foundry tools as the control.

The category therefore has a stronger payer signal but a weaker competitive
gap. Keep the candidate third in the empirical queue, behind Adventure
Navigator and World Doctor, until a qualified improvisation-heavy GM chooses a
non-zero price after the head-to-head and commits to a three-session pilot.

**Decision:** MapForge's paid adoption is a market signal and a competitor
anchor, not permission to select Rapid Encounter Board. The candidate remains
conditional and must prove a distinct, portable, rights-safe workflow.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1pslu0f/none_mapforge_alpha_v014_create_battlemaps/
- https://www.reddit.com/r/FoundryVTT/comments/1ptb1gm/update_mapforge_alpha_is_now_on_all_tiers_create/
- https://www.reddit.com/r/FoundryVTT/comments/1spey55/system_agnostic_mapforge_build_battlemaps_inside/

### Pass 87 — fresh challenger: TableStart / Guided Player Session

A new-player and player-experience scan found two different signals. Some
groups report that Foundry players are quickly comfortable once the GM limits
the interface, while other groups describe too many tabs, confusing character
sheets, and a real risk that a new or non-technical player disengages. A recent
request also asks for a lightweight player panel usable from a phone or
secondary device. These are useful buyer-recruiting signals, but they do not
prove that players or GMs will pay for another interface.

The fresh product hypothesis is **TableStart**, a GM-authored guided session
mode. It would not be a generic mobile sheet, UI skin, character builder, or
hero gallery. A table owner would prepare a small session recipe that guides a
player through join/claim, the current scene's three or four relevant actions,
the next required roll or decision, a ready/AFK state, and a clear fallback to
the normal sheet. The same recipe could be reused when a player returns after
weeks away or joins a one-shot. Foundry is the first target; D&D5e and PF2e
action adapters are the first feasibility boundary.

The payer is the GM or table owner who repeatedly onboards new, casual,
remote, in-person, or mixed-device players. A technically confident Foundry
GM is a negative control. The eye-catching demo is a new player going from
login to “I know what I can do this turn” in under a minute, with the GM
changing the allowed actions without editing a dozen module settings. Test
one-time $10/$20/$30/no purchase and a three-session pilot; do not treat “my
players would use it” as payment evidence.

**Decision:** keep TableStart open as a fresh player-facing challenger, but do
not call it a product gap until a buyer names a repeated onboarding or return-
to-play failure that current player panels and UI controls do not solve.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1v7wj5k/im_new_to_foundry_vtt_what_module_would_you_like_to_see/
- https://www.reddit.com/r/FoundryVTT/comments/1woc10h/my_players_hate_using_foundryvtt_for_pathfinder2e/
- https://www.reddit.com/r/FoundryVTT/comments/1jgcbkf/im_afraid_my_players_will_find_foundry_too_complex/
- https://foundryvtt.com/article/player-orientation/

### Pass 88 — TableStart direct-competition and payer correction

The current package audit closes the broad promise. Hide UI already gives the
GM per-player and global visibility controls, applies defaults to new players,
and can hide most of the interface. Player Pilot is a free, mobile-first
control panel with actions, spells, movement, targeting, chat, and table-facing
requests across several systems. Claim Your Hero handles the cinematic claim
moment. Character Builder and Hero Mancer guide character creation and level-up,
while AFK Ready Check handles readiness. SessionFlow is a premium player
workspace with chronicle, quest, map, and other play-time widgets.

That means “make Foundry simpler for players,” “make a mobile character sheet,”
“let players claim a hero,” and “add a ready check” are all occupied or free.
The only defensible TableStart wedge is a **session-mode recipe**: a small,
GM-authored, per-scene sequence that combines onboarding, current-beat context,
role-specific permitted actions, completion/ready state, and a safe fallback
without becoming a second campaign workspace. If it needs a large module stack,
system-specific rules engine, or permanent replacement UI, reject it.

The portable record can contain a session recipe, participant role, current
beat, permitted action descriptors, linked actor/scene/document references,
completion state, and fallback target. Foundry, Roll20, and Owlbear expose
different player, sheet, scene, and storage APIs, so a neutral record can guide
adapter design but cannot establish cross-VTT parity. Licensing is manageable
only if the product stores user-authored guidance and references rather than
bundled rulebook text or publisher content.

**Decision:** TableStart is a fourth, conditional empirical arm behind
Adventure Navigator, World Doctor, and Rapid Encounter Board. It advances only
if the buyer comparison beats Hide UI + Player Pilot/current player setup on a
repeated onboarding or return-to-play incident at a non-zero price. The broad
player-experience category is demoted as crowded; no product is selected.

Sources:

- https://foundryvtt.com/packages/hide-ui
- https://foundryvtt-hub.com/package/player-pilot/
- https://foundryvtt.com/packages/claim-your-hero
- https://foundryvtt.com/packages/dnd5e-character-builder
- https://foundryvtt.com/packages/hero-mancer
- https://foundryvtt.com/packages/afk-ready-check
- https://foundryvtt.com/packages/sessionflow

### Pass 89 — fresh challenger: Tabletop Bridge / Physical Table Mode

The next fresh scan moved away from generic player onboarding and examined
in-person and hybrid play. A recent high-engagement discussion describes a
real table using a GM laptop, a TV or table display, player phones/tablets,
physical character sheets, and physical dice. Other recent reports describe
the same setup as useful but pieced together from multiple modules and browser
clients, with recurring concerns about display routing, map performance,
player control, and keeping GM-only information off the shared screen.

The product hypothesis is **Tabletop Bridge**, a Foundry-first physical table
mode rather than another mobile sheet. A GM would select a display role, pair
player input devices, choose physical or digital dice policy, and switch the
world into a table-safe mode. The mode would coordinate a clean shared view,
per-player control surfaces, physical-dice result entry, scene preload or
low-bandwidth behavior, secret-safe routing, and a return-to-remote mode. It
would integrate with existing Foundry APIs and modules where possible rather
than redistribute hardware or publisher content.

The likely payer is a GM who runs in-person or hybrid sessions at least twice
per month and already owns a TV, projector, touchscreen, or player devices.
Fully remote GMs and paper-only tables are negative controls. The eye-catching
demo is one GM screen, one shared map, two phone controls, and a physical d20
whose result is applied to the same automated roll without revealing the GM
view. Test one-time $20/$35/$50 against no purchase and a three-session pilot;
the current community evidence shows use, not conversion.

**Decision:** open Tabletop Bridge as a fresh conditional challenger. Its
marketability depends on selling reliable orchestration and setup reduction,
not bundling the already-existing common-display, mobile, touch, or physical-
dice features.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1rx4dvm/system_agnostic_running_foundry_locally_for/
- https://www.reddit.com/r/FoundryVTT/comments/1rhse4s/anyone_using_foundry_vtt_for_in_person_sessions/
- https://www.reddit.com/r/FoundryVTT/comments/1vznbx6/utilising_foundry_in_person_via_a_host_laptop/
- https://foundryvtt.com/packages/monks-common-display
- https://foundryvtt.com/packages/pp-dice

### Pass 90 — Tabletop Bridge direct-competition and marketability correction

The current package audit shows substantial component coverage. Monk's Common
Display can drive a clean shared TV view and focus it on selected tokens.
Physical Play Dice intercepts public player rolls and lets the GM enter real
dice results while retaining system modifiers, with explicit handling for
secret rolls and NPC rolls. TouchVTT supports touch tables, Mobile Token
Movement and Player Pilot cover phone controls, Gaming Table targets the
paper-sheet/physical-dice table, and Ninjo's In-Person Tools addresses map
preload traffic plus separate following and pinned displays. Lock View and
related display tools address view safety and layout.

This means a “digital tabletop bundle” is not a gap. The only defensible
wedge is **orchestration**: one setup and status surface that registers the
display/input roles, validates secret-safe routing, detects stale or missing
clients, applies a known scene/performance policy, and restores the same
configuration when a weekly table switches between in-person and remote play.
It must reduce setup and failure recovery versus the named module stack. A
feature checklist or a repackage of those modules should be rejected.

The payment signal is still incomplete. High-engagement setup discussions and
recent module adoption establish a real use case, but the relevant components
are mostly free or separately supported. The candidate therefore has a
narrower payer pool than Adventure Navigator or World Doctor and a harder
portability problem: Roll20 and Owlbear expose different display, player,
device, and dice-extension surfaces. A neutral table-session record can guide
adapters, but cannot establish equivalent behavior.

**Decision:** keep Tabletop Bridge as a fifth conditional arm, below the
current four, and do not implement it. It advances only if in-person/hybrid
GMs pay for orchestration after a head-to-head setup/recovery task and commit
to a real-table pilot. Otherwise, the category is demoted as a collection of
already-solved components.

Sources:

- https://foundryvtt.com/packages/touch-vtt/
- https://foundryvtt.com/packages/mobile-token-movement
- https://foundryvtt.com/packages/gaming-table
- https://foundryvtt.com/packages/ninjos-inperson-tools
- https://www.reddit.com/r/FoundryVTT/comments/1umt0kj/display_on_tv_for_in_person/
- https://www.reddit.com/r/FoundryVTT/comments/1f02eod/in-person-shared-display-how-to-give-control-to-players/

### Pass 91 — Tabletop Bridge current-package correction and demotion

The direct audit found a stronger current incumbent than the initial scan
showed. **Ninjo's In-Person Tools** is verified for Foundry 14 and already
combines map-preload suppression, following and pinned display roles, scene
rotation, selective player movement, touch-friendly sheet view, turn prompts,
and time/weather presentation. **Digital Tabletops** is also current for
Foundry 13–14 and connects a large-format display to an external IR-touch
input program. The older **Table Mode** package demonstrates the demand but is
PF2e-only, verified only for Foundry 13, and explicitly has limited planned
scope. Gaming Table is an older personal mash-up and warns that its input
hooks are not a stable Foundry API.

This closes the broad integrated-table feature gap. Tabletop Bridge would need
to sell a materially different job—cross-version orchestration, health and
stale-client recovery, one-click profile switching, and compatibility receipts
across a user's changing module stack. That is closer to a supportable
reliability product than a normal feature module, and the current evidence
does not show that buyers pay for it. Hardware ownership, high-engagement
setup posts, and use of free modules are not product-specific WTP.

**Decision:** demote Tabletop Bridge from the active empirical queue to a
negative control/parking lot. Do not implement or recruit a buyer arm until a
paid alternative, a named failure that Ninjo's current workflow cannot solve,
or direct non-zero price evidence appears. The active queue returns to four
conditional candidates, with no product selected.

Sources:

- https://foundryvtt.com/packages/ninjos-inperson-tools
- https://foundryvtt.com/packages/digital-tabletops
- https://foundryvtt.com/packages/pf2e-table-mode
- https://foundryvtt.com/packages/gaming-table
- https://foundryvtt.com/packages/sheet-only

### Pass 92 — fresh challenger: VTT BridgeCheck / Campaign Transfer Assurance

The migration scan found a stronger payment signal than the recent player and
hybrid-table lanes. DDB-Importer is a current Foundry 14 package that gives all
users basic imports while Patreon supporters receive higher-value monster,
class, species, background, feat, and adventure importing. KaKaRoTo's R20
Converter has a long history of users paying for a month of access to move a
Roll20 campaign into Foundry; community reports describe the result as worth
the fee and saving hours or days. The converter is now public/free, so it is
an adoption and category-payment precedent rather than an open paid product.

The fresh hypothesis is **VTT BridgeCheck**, a post-import assurance tool, not
another importer. Given a user-owned export and a target Foundry world, it
would build a disposable target, produce a source-to-target inventory, and
show a red/yellow/green receipt for missing assets, broken UUID links,
wall/light or tile drift, actor/item schema mismatches, permission changes,
unsupported source features, duplicate files, and content that requires manual
review. It would preview repairs and export a diff/receipt before touching the
real world. Source adapters could start with Roll20 exports, D&D Beyond/Foundry
imports, and Foundry version-to-version checks; no scraping or copyrighted
content redistribution is required.

The payer is a GM with a campaign they are actively moving or rebuilding, a
large sunk content investment, or a system/core-version migration deadline.
This is an episodic high-intent purchase rather than a weekly recurring tool,
so it must be sold as a one-time transfer insurance/verification utility. The
eye-catching demo is a messy imported campaign becoming a searchable receipt:
“184 links checked, 7 assets missing, 2 walls need review, 0 player secrets
exposed,” followed by a disposable repair and rerun. Test one-time $10/$25/$50
/$75/no purchase and two real campaign pilots.

**Decision:** open VTT BridgeCheck as a fresh conditional challenger because
the category has observable payment behavior. Do not infer product WTP from an
importer subscription; the assurance wedge must save a buyer from a named
post-import failure and beat manual cleanup plus the relevant source importer.

Sources:

- https://foundryvtt.com/packages/ddb-importer
- https://www.patreon.com/kakaroto/about?l=it
- https://www.patreon.com/kakaroto/posts/r20converter-0-x-88293565
- https://www.reddit.com/r/FoundryVTT/comments/1tzlbym/roll_20_migration/
- https://www.reddit.com/r/FoundryVTT/comments/1byxjgi/leaving_roll20_to_foundry_questions/

### Pass 93 — VTT BridgeCheck direct-competition, licensing, and portability correction

The broad import promise is already occupied. DDB-Importer and VTTA handle
D&D Beyond integration; R20Converter handles Roll20 export conversion; PDF to
Foundry and official/premium content packages cover other source paths; Phils
Map Migrator handles precise scene-level transfer; Foundry itself validates
package compatibility and exposes migration metadata. Community reports still
describe importer failures, mismatched walls, stale or missing content,
confusing compendiums, and significant manual cleanup, but those reports are
mostly older and source-specific. They justify a buyer fixture, not a claim
that all imports are broken.

The defensible gap is therefore a **source-neutral transfer receipt and
disposable-world rehearsal**: compare what the source promised with what the
target can resolve, identify unsupported features before play, show permission
and secret exposure, and rerun deterministically after correction. It must not
copy publisher text or assets, bypass source access controls, or promise that
Roll20, D&D Beyond, Fantasy Grounds, and Foundry semantics are equivalent.
The neutral record can contain source/target identifiers, document kinds,
asset fingerprints, link edges, schema versions, permission scopes, check
results, repair proposals, and review decisions.

Portability is unusually central but technically hard. Foundry can be the
first target because its documents, package manifests, and migration metadata
are inspectable. Roll20, D&D Beyond, and Owlbear would need separate export or
extension boundaries; a shared receipt format is not a shared converter. The
buyer test must compare VTT BridgeCheck with the exact importer used, manual
cleanup, and a backup/restore workflow, and must separately measure whether a
one-time insurance purchase is acceptable for an episodic migration.

**Decision:** keep VTT BridgeCheck open as a sixth conditional arm, behind the
four active candidates but ahead of parked Tabletop Bridge. It advances only
if migrating GMs choose a non-zero price after a named post-import failure,
complete two real campaign pilots, and the disposable fixture proves no live
mutation, permission safety, deterministic rerun, and explicit unsupported
fields. No product is selected.

Sources:

- https://foundryvtt.com/packages/ddb-importer
- https://foundryvtt.com/packages/vtta-ddb
- https://foundryvtt.com/packages/phils-map-migrator
- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/article/migration/
- https://www.reddit.com/r/FoundryVTT/comments/1nwta0c/ddb_importing/
- https://www.reddit.com/r/FoundryVTT/comments/1eykhlf/moving_from_ddbbeyondroll20/

### Pass 94 — fresh challenger: LootFlow / Party Economy

The next fresh scan moved from campaign migration to an ordinary table
moment: distributing treasure, maintaining a shared party vault, shopping,
selling loot, and splitting a group bill. A current community request asks
for one simple workflow for loot distribution, purchases, and adding items to
player inventories; another recent thread describes creating inventory and
prices as a recurring setup burden. This is a real recruiting signal because
the problem occurs during play and players directly see the result.

The initial hypothesis is **LootFlow**, a player-first party-economy surface:
show the party's current loot and currency, move items from a chest or enemy
to named recipients, approve or reject claims, pool funds, split a cart, sell
unwanted loot, and preserve an auditable transaction history. The eye-catching
demo is a defeated encounter becoming a clean party decision: who takes what,
what remains in the vault, and how much each buyer owes. A neutral ledger could
later support Foundry, Roll20, and Owlbear adapters without claiming identical
system rules.

The payer hypothesis is a GM who regularly runs loot-heavy campaigns, shops,
crafting, or a persistent party treasury, with players benefiting from a
faster and less ambiguous handoff. This is more consumer-facing than a creator
compiler, but it is not yet evidence of willingness to pay. Test a one-time
$10/$20/$35/$50 choice against no purchase, and separate a GM who wants an
immersive shop from a table that only needs a shared chest.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1ua1vc4/looking_for_module_to_help_with_loot_shops_and/
- https://www.reddit.com/r/FoundryVTT/comments/1izoccp/how_do_you_create_loot_items_in_bulk_to_give_to_players/
- https://foundryvtt.com/packages/quartermaster
- https://foundryvtt.com/packages/item-piles

### Pass 95 — LootFlow direct-competition and marketability correction

The current-package audit closes the broad LootFlow promise. **Item Piles** is
current through Foundry 14 and already provides loot piles, containers,
merchants, player trading, and an API. **Quartermaster** is a current v14
shared party inventory/currency/history ledger. **Backpack** supplies a
system-agnostic paid storage workflow, while **RPGX Loot Crate** and **RPGX
Shops & Traders** cover shared economies, shops, selling, and optional paid
features. The premium **Stockpile** is an especially strong visual incumbent:
group carts, pooled funds, bill splitting, selling, negotiation, restocking,
services, and a persistent ledger are already presented as a polished product.
ScryRPG also sells shops, loot, and party features with Foundry integration in
closed beta.

This means “party inventory,” “better loot,” or “a prettier shop” is not a
market gap. The only remaining wedge is a much narrower **cross-VTT,
player-owned, conflict-safe transaction ledger** that preserves claims,
approvals, shared currency, and rollback across disconnected or different VTT
clients. That wedge is technically and economically harder than the demo
suggests, and the current evidence does not show buyers paying for it instead
of using Item Piles, Quartermaster, a free chest, or a hosted campaign tool.
The product would also need careful system adapters and must not duplicate
publisher item text or images.

**Decision:** demote LootFlow to a rejected seventh challenger/negative
control. Do not implement it or fold it into Dungeon Master's Forge. Revive it
only if a qualified GM names a repeated transaction failure that the current
stack cannot solve, chooses a non-zero one-time price, and commits to a
three-session pilot. Preserve only the neutral party-ledger idea as a
reusable asset. No product is selected.

Sources:

- https://foundryvtt.com/packages/item-piles
- https://foundryvtt.com/packages/quartermaster
- https://foundryvtt.com/packages/backpack
- https://foundryvtt.com/packages/the-stockpile
- https://foundryvtt.com/packages/rpgx-loot-crate
- https://foundryvtt.com/packages/rpgx-shops-and-traders
- https://scryrpg.com/pricing/
- https://www.reddit.com/r/FoundryVTT/comments/1ua1vc4/looking_for_module_to_help_with_loot_shops_and/

### Pass 96 — fresh challenger: TurnReady / Combat Focus

The next scan tested a recurring player-facing problem rather than a GM-only
authoring task: during a turn, players and GMs forget whether a main action,
bonus action, reaction, movement budget, recharge, or concentration/resource
has been spent. Community requests explicitly ask for a tracker that resets
actions and reactions at the right time, while newer discussion still points
to confusion around action budgets and movement history. The problem repeats
every combat and can be demonstrated in seconds.

The hypothesis is **TurnReady**, a small per-player combat focus surface. It
would show only the active character's remaining budget, available actions,
reaction and resource reminders, a private “what can I still do?” summary, and
an explicit end-turn/undo trail. A neutral action-ledger record could map to
different VTT systems, with system adapters supplying the actual action rules.
The marketing demo is an overloaded turn becoming a clean, readable decision
card without opening a character sheet.

The likely payer is a GM who repeatedly loses time to forgotten reactions,
new-player hesitation, or combat-table interruptions, or a player who needs a
low-clutter accessibility surface. Test $8/$15/$25/$39/no purchase, and
separate a D&D 5e table from a PF2e table; the action economy is not the same.
The current evidence supports recruitment, not WTP.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/i4y2y4/is_there_a_way_to_track_reactionsactions_used/
- https://www.reddit.com/r/Pathfinder2e/comments/1gqehng/automated_or_semi_automated_action_tracker/
- https://foundryvtt.com/article/combat/
- https://foundryvtt.com/packages/action-keeper

### Pass 97 — TurnReady direct-competition, payment, and portability correction

The current audit closes the broad TurnReady promise. **Action Keeper** is
current for Foundry 14 and already gives every token a manually controlled main
action, bonus action, reaction, and movement panel. **Reaction Tracker** is
current through Foundry 14 for D&D 5e and adds player-visible, resettable
reaction state to the native tracker. **Stylish Action HUD** is a current
paid/patron product with party cards, resources, conditions, quick actions,
rolls, action menus, and generic adapters. **PF2e Combater** is a current
v14 tactical turn planner with action-budget awareness, planning, execution,
and undo. Argon/Token Action HUD, D&D 5e action-sheet work, and system-native
combat tools further reduce the general gap.

The payment signal is real only at the category level: a current paid HUD and
premium combat products show that some tables pay for a better combat surface.
That does not prove they will buy another tracker. The remaining theoretical
wedge is a minimal, client-private, accessibility-first “turn card” that
does not compete with full HUDs or automate rules. Its portability is also
conditional: a neutral action ledger is easy to serialize, but calculating
remaining actions, reactions, movement, spell sustain, MAP, or undo requires
system-specific semantics and safe write permissions.

**Decision:** reject generic TurnReady as an eighth challenger. Do not build
another action tracker, HUD, or rules engine. Reopen only if a qualified table
names a repeated failure that the exact current stack cannot solve and chooses
a non-zero price for the minimal private turn card. Preserve only the neutral
action-ledger schema as a reusable implementation asset; Dungeon Master's
Forge remains backburnered and untouched.

Sources:

- https://foundryvtt.com/packages/action-keeper
- https://foundryvtt.com/packages/reaction-tracker
- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/pf2e-combater
- https://foundryvtt.com/article/combat/
- https://www.reddit.com/r/FoundryVTT/comments/1qp4neh/dd_5e_action_sheet/

### Pass 98 — evidence-weighted candidate sequencing correction

The fresh challenger audit does not select a product, but it does change the
order of the next empirical work. The important distinction is between a
category payment signal and product-specific willingness to pay:

| Candidate | Buyer urgency/frequency | Payment proxy | Gap after competition audit | Demo strength | Main unresolved risk | Next gate |
| --- | --- | --- | --- | --- | --- | --- |
| VTT BridgeCheck | High urgency, episodic migration | Stronger category signal from paid/importer access | Medium; post-import assurance only | High | source adapters, rights, episodic demand | exact-importer head-to-head and one-time price |
| World Doctor | High value, episodic update/recovery | Weak product-specific signal | Medium; rehearsal/receipt only | Medium-high | false green, disposable runtime, portability | module-heavy GM price and rehearsal pilot |
| Adventure Navigator | Recurring session lookup pain | Weak; free search/AI substitutes | Medium-low; contextual lane only | High | stale permissions, content rights, ranking | adventure-GM time/price/pilot test |
| Rapid Encounter Board | Recurring for improvisation-heavy GMs | Category signal from MapForge | Low-medium; narrow live staging | Very high | incumbent map tools, asset rights | staging head-to-head and price |
| TableStart | Intermittent onboarding/return pain | Weak | Low-medium; recipe only | Medium | GM authoring burden, free UI tools | new/returning-player pilot |
| Tactical Memory | Narrow but vivid stealth/pursuit pain | Weak | Medium-high | High | buyer size, privacy, system semantics | qualified stealth-table price test |
| TableSpeak | Real bilingual-table pain | External substitute signal | Low-medium; VTT semantics only | Medium | provider cost, privacy, latency | BYOK/local offer and three-session pilot |

This sequencing is deliberately conservative: VTT BridgeCheck moves to the
front because it has the strongest observed payment category and a deadline-
driven buyer, not because it is already marketable. Its migration use is
episodic, and a successful importer may make the assurance layer unnecessary.
World Doctor remains second because an update incident has high value but no
strong product-specific payment proxy. Adventure Navigator has the best
recurring-use story among the current broad candidates, but its free and AI
alternatives make the price test essential. Rapid Encounter Board retains the
best visual demo but also the clearest commercial incumbent.

**Decision:** run the buyer gates in this order: VTT BridgeCheck, World
Doctor, Adventure Navigator, Rapid Encounter Board, and TableStart. Keep
Tactical Memory and TableSpeak as conditional controls, and keep Tabletop
Bridge, LootFlow, and TurnReady rejected/parked. Do not interpret a non-zero
price for one candidate as validation of another. No product is selected and
implementation remains paused until one candidate clears its exact buyer,
pilot, runtime, licensing, and portability gates.

Sources:

- https://foundryvtt.com/packages/ddb-importer
- https://foundryvtt.com/packages/phils-map-migrator
- https://foundryvtt.com/packages/action-keeper
- https://foundryvtt.com/packages/stylish-action-hud

### Pass 99 — VTT BridgeCheck technical and rights boundary

The first technical audit supports a smaller, safer Foundry-first slice. The
official Foundry model exposes package compatibility and migration metadata,
including document statistics such as system version, core version, modified
time, and last modifier. Foundry also creates package backups and snapshots,
but its own documentation warns that snapshots do not include assets outside
the package directories. That leaves a concrete verification job: reconcile
the world and its asset references in a disposable copy, then report broken
links, missing files, version drift, ownership changes, and unsupported fields
without changing the live world.

DDB-Importer confirms the rights boundary. It uses the user's authenticated
D&D Beyond token to retrieve accessible data; without it, access is restricted
to public information. Some higher-value imports require Patreon support or a
user-run proxy. BridgeCheck must therefore run after an authorized importer or
against user-supplied exports and must never collect, proxy, scrape, or retain
the user's credentials or publisher text. It can retain IDs, hashes,
references, check results, and repair decisions, with temporary extracts
deleted after the receipt is generated.

**Technical decision:** the first fixture is a local Foundry world/backup
rehearsal with synthetic or user-owned documents, actors, scenes, walls,
lights, tiles, journals, assets, links, ownership, package versions, and
unsupported fields. The live world remains read-only. A green result is valid
only when each check has an evidence path and the receipt can be rerun after a
repair.

Sources:

- https://foundryvtt.com/article/package-management/
- https://foundryvtt.com/article/backups/
- https://foundryvtt.com/article/migration/
- https://docs.ddb.mrprimate.co.uk/docs/ddb-importer/initial-setup
- https://docs.ddb.mrprimate.co.uk/docs/faqs/ddb-importer

### Pass 100 — VTT BridgeCheck cross-VTT portability correction

The portability audit rules out a universal live adapter promise. Roll20's
documented transfer surface is primarily intra-Roll20: Character Vault and the
Pro Transmogrifier move characters, maps, tokens, handouts, macros, and other
game objects between Roll20 games. That is useful buyer evidence, but it does
not establish a general external export API or equivalent access to a Foundry
receipt. A Roll20 BridgeCheck adapter must therefore begin as a user-mediated
inventory/receipt import, not automated scraping or account access.

Owlbear is more technically approachable but intentionally bounded. Its
extension SDK lets an extension store namespaced metadata on scenes, items,
and players, download scenes through the asset API, and read room permissions;
room metadata is limited to 16 kB. This supports a compact receipt or review
marker, not a full campaign transfer. It is a plausible second adapter only
after the Foundry slice proves value.

**Portability decision:** make the portable artifact a versioned receipt
contract containing source/target IDs, document kinds, asset fingerprints,
link edges, schema/version metadata, permission scopes, checks, unsupported
fields, repair proposals, and review decisions. Implement Foundry locally
first. A future Roll20 adapter may consume a user-provided copy/inventory;
Owlbear may render a compact receipt through an extension. Neither adapter may
claim full campaign parity, bypass access controls, or copy publisher content.
This lowers the portability score but keeps the product technically honest and
licensing risk manageable.

**Decision:** keep VTT BridgeCheck first in the buyer queue, but narrow the
go/no-go promise to Foundry post-import assurance. Reject it if the Foundry
fixture cannot identify real buyer failures without content copying, or if
active migrating GMs prefer the exact importer plus manual cleanup at every
price tested.

Sources:

- https://wiki.roll20.net/Transfer
- https://wiki.roll20.net/Backup
- https://docs.owlbear.rodeo/extensions/reference/metadata/
- https://docs.owlbear.rodeo/extensions/apis/room/
- https://docs.owlbear.rodeo/extensions/apis/assets/

### Pass 101 — Player Compass fresh recurring-pain and competition correction

The fresh community scan found a more frequent consumer-facing pain than the
episodic migration and update candidates. A recent Pathfinder 2e discussion
describes players still losing time in Foundry after nine months because the
character sheet has too many tabs, ambiguous icons, and controls that are hard
to locate. A separate cross-VTT discussion reports that players want the VTT to
get out of the way, while another comment specifically requests plain-language
labels and a simpler player-facing surface. These are meaningful recurring
session-friction signals, but the threads do not establish willingness to pay.

The fresh challenger is **Player Compass**: an automatic, per-player surface
that reads the current system's supported actions and presents only the next
relevant choices in plain language. It could switch between exploration,
conversation, and combat context; explain why an action is available; preserve
the native sheet as an escape hatch; and adapt to keyboard, low-resolution, and
screen-reader needs. The eye-catching demo is a cluttered sheet becoming one
focused “what can I do now?” card without the GM authoring a recipe for every
scene.

The competition audit prevents a broad “better HUD” claim. Token Action HUD
already gives D&D 5e users direct action access without opening the sheet; PF2e
HUD and Argon provide current Pathfinder action surfaces; Stylish Action HUD
adds a paid, themed party and action overlay with D&D 5e, PF2e, and generic
manual adapters; Foundry Navigator adds keyboard-first and screen-reader-aware
D&D 5e sheet and combat navigation; and Hide UI addresses visual overload.
The remaining gap is therefore not another action bar, combat tracker, or sheet
skin. It is the automatic context selection, plain-language explanation, and
zero-or-near-zero GM configuration across a player's whole session.

Foundry's current usage data makes the audience plausible but not validated:
D&D 5e accounts for 64.28% of installed systems and PF2e 30.52%, the average
user has 37.44 installed modules, and 33% of users own at least one premium
purchase. Those figures indicate reach and category spending, not Player
Compass WTP. The likely buyer is still the GM or host, especially one with
returning, low-confidence, accessibility-needing, or mixed-experience players;
the player is the daily beneficiary.

**Decision:** keep Player Compass as a sixth conditional candidate, behind the
current BridgeCheck/World Doctor/Adventure Navigator/Rapid Encounter Board/
TableStart gates. Reject it if a configured Token Action HUD/PF2e HUD plus a
short orientation session matches the result, if automatic context selection
requires unsafe system-specific writes, or if players prefer the existing sheet
after three sessions. Preserve a neutral capability-manifest idea as a reusable
asset, but do not promise cross-VTT parity until one Foundry adapter and one
read-only second-VTT boundary are proven.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1woc10h/my_players_hate_using_foundryvtt_for_pathfinder2e/
- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/token-action-hud-dnd5e
- https://foundryvtt.com/packages/pf2e-hud
- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/hide-ui
- https://foundryvtt.com/article/year-in-review-2025/

### Pass 102 — recurring-payer scorecard correction

The payer scan changes the evidence weighting. The official Foundry package
pages and creator storefronts show current paid or premium UX products in the
same broad neighborhood: Stylish Action HUD sells a themed action and party
overlay; SessionFlow sells a recurring GM/player workspace with a player panel;
and Originate sells a cinematic, guided D&D 5e character-creation experience.
This is category payment evidence, not proof that Player Compass will convert,
but it is stronger than the earlier assumption that its payer signal was only
theoretical.

The frequency comparison is also material. Player Compass would be used during
ordinary play whenever a player chooses an action, while BridgeCheck is used
around a migration and World Doctor around an update or recovery incident. The
recurring surface therefore has a clearer path to habitual value, even though
its direct alternatives are stronger. BridgeCheck retains the highest urgency
and a strong migration payment proxy, but its episodic use makes “who would
pay?” more sensitive to the buyer's current deadline.

The direct-competition correction remains strict. Stylish Action HUD already
offers a premium D&D 5e/PF2e action and party surface, and Token Action HUD,
PF2e HUD, Argon, and Foundry Navigator provide free or separately monetized
alternatives. Player Compass can advance only if automatic context selection,
plain-language explanations, accessibility behavior, and near-zero GM setup
win against the exact stack; a prettier or more cinematic HUD is not enough.

**Evidence-weighted sequencing decision:** move Player Compass to the first
empirical buyer gate, put VTT BridgeCheck second, then World Doctor, Adventure
Navigator, Rapid Encounter Board, and TableStart. This is a test order, not a
product selection. Player Compass must still produce three non-zero price
choices, two three-session pilots, an exact-alternative preference result, a
safe Foundry fixture, and a portable capability boundary before implementation.

Sources:

- https://foundryvtt.com/packages/stylish-action-hud
- https://www.theglitchsmith.com/modules/stylish-action-hud/
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/originate
- https://foundryvtt.com/article/premium-content/
- https://www.reddit.com/r/FoundryVTT/comments/1qhr1v6/system_agnostic_stylish_action_hud_a_jrpgstyle/

### Pass 103 — public behavioral payment signal and saturation correction

The public response to Stylish Action HUD supplies stronger behavioral evidence
than a package page alone. A commenter says the subscription is worth it; other
players say they and their groups love the module, one says they would become a
patron immediately if another system were supported, and another reports that a
manual setup for a different system was worth the effort. These are observable
payment-intent and retention signals for the incumbent, not a survey of Player
Compass buyers and not a conversion rate.

The same discussion also gives the negative control. Some users dislike
overly-cinematic presentation, want only HP or a minimal surface, or reject
paying for AI-assisted modules. The market is therefore not “make a prettier
HUD.” A new product must sell clarity and reduced player friction, let users
stay minimal, and avoid forcing a visual style or subscription. The incumbent's
visual-only, standard-roll approach also shows a technically safer boundary:
Player Compass should discover and explain capabilities without becoming a new
rules or automation engine.

A broader “content worth paying for” discussion supplies a second category
signal: buyers repeatedly describe ready-to-run maps, prepared scenes, assets,
automation helpers, and reusable effects as worth paying for, often through
Patreon. That supports Foundry's creator economy but does not transfer payment
to a new utility module. It reinforces the need to test Player Compass directly
against the exact HUD stack rather than infer WTP from creators' success.

**Marketability correction:** the Player Compass demo and offer should be
“every player knows what to do next, with no GM-built recipe,” not “a more
cinematic action HUD.” The first buyer gate remains valid, but its control must
include a minimal HUD mode and an explicit no-subscription/one-time-price
choice. BridgeCheck remains second because its urgency is real, but its public
payment evidence is still category-level and episodic.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qhr1v6/system_agnostic_stylish_action_hud_a_jrpgstyle/
- https://foundryvtt.com/packages/stylish-action-hud
- https://www.reddit.com/r/FoundryVTT/comments/1ntri45/system_agnostic_content_that_is_worth_paying_for/
- https://foundryvtt.com/article/premium-content/

### Pass 141 — fresh selective-audio / private-scene-sound lead

A fresh community scan surfaced a different recurring GM problem: the table
can already route a sound to one user through a macro, but the normal playlist
workflow is global. A current request describes wanting a playlist or boombox
heard by one player without forcing it on the party, and explains that
ambient-radius workarounds do not express player identity or level/zone
semantics cleanly. This is a better product-shaped incident than another
general audio player because the demo is immediately legible: two players can
hear different layers of the same scene.

The first candidate is **Audio Secrets / Scene Sound Director**: a
system-agnostic, Foundry-first layer that lets a GM route user-owned sounds or
playlists to named players, party subsets, token owners, or scene/region
conditions; queue or loop them; preview privately; and show who is expected to
hear each active channel. It should use explicit recipients and visibility
receipts, never infer secrecy from token proximity alone, and never bundle
copyrighted music.

The current stack is mixed rather than empty. Foundry playlists are global;
Chris Sound Module exposes a specific-player macro but is only verified
through Foundry 12; Token Audio FX can send a one-shot to the player who owns a
token; Enhanced Region Behavior can trigger sound or music from regions; and
newer audio managers such as Playlist Plus and Narrator's Jukebox improve the
general control surface. The residual wedge is an intuitive, current-version
recipient/scene/queue model, not another jukebox, soundboard, or music pack.

The likely payer is an audio-heavy paid/professional GM, horror or
investigation GM, or organized-play host who values private clues and
location-specific sound. A home weekly group is a required negative control:
macros, Discord/voice, headphones, or simply telling players to play their own
track may be good enough. The eye-catching storefront promise is “the rogue
hears the whisper; the rest of the party hears the room,” with a live
recipient/zone preview rather than a settings screenshot.

Portability is intentionally narrow. Preserve an original/user-owned audio
route manifest containing asset references, recipient scope, trigger/zone,
queue policy, duration, and unsupported fields. Foundry is first; Roll20 or
Owlbear can begin as a read-only preview/export. No account impersonation,
hosted audio, or copyrighted bundled library is part of the first product.

**Decision:** open Audio Secrets only as a fresh conditional buyer gate. It is
not selected: current audio payment proves that GMs pay for audio content and
polished control, not that they will pay for recipient routing. Require a
named repeated private-audio incident, preference over the exact macro/region/
Token Audio FX/Playlist Plus stack, a one-time price choice, two real-table
pilots, current Foundry runtime proof, and a neutral route-manifest boundary.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1wggsoy/wondering_if_its_possible_to_play_a_playlist_to/
- https://foundryvtt.com/packages/chris-sound-module
- https://foundryvtt.com/packages/token-sounds
- https://foundryvtt.com/packages/enhanced-region-behavior
- https://foundryvtt.com/article/playlists/

### Pass 142 — selective-audio direct-incumbent and payer correction

The second pass prevents a category-payment mistake. Foundry's current
premium ecosystem includes paid or Patreon audio content and polished audio
managers: Tabletop RPG Music sells a Patreon-only Foundry package, Narrator's
Jukebox is distributed as premium access with music/ambience/soundboard and
per-card broadcast controls, and Playlist Plus is a current system-agnostic
playlist overhaul. These establish a buyer habit around audio and session
presentation, but they do not prove demand for a new routing product.

The direct alternative audit also weakens the broad claim. A macro can already
call Foundry's recipient-aware audio API; Chris Sound Module packages part of
that path; Token Audio FX provides owner-scoped one-shot playback; regions can
trigger audio; and audio managers own the general “make the GM's sound desk
fast and attractive” promise. Audio Secrets must therefore sell a specific
failure: a GM repeatedly needs private or subset audio tied to scene state and
cannot reliably express it with the current recipient, region, or playlist
controls.

**Decision:** keep Audio Secrets below the first empirical gate as a
conditional comparison arm, not the new selected product. Test audio-heavy
paid/professional and horror/investigation GMs separately from home groups at
**$10, $20, $30, or no purchase**, showing the exact alternatives first. A
viable result requires 5/8 qualified buyers to prefer the recipient/scene
workflow, 3/8 to choose a non-zero one-time price, two pilots over three
sessions, and no privacy or rights failure. If only creator or professional
GMs pay, record a niche product and continue the ordinary-table search rather
than transferring that WTP.

Sources:

- https://foundryvtt.com/packages/tabletop-rpg-music-patreon/
- https://www.patreon.com/WandAndWidgets/posts/narrators-module-145481135?l=en-GB
- https://foundryvtt.com/packages/playlist-plus
- https://foundryvtt.com/packages/chris-sound-module
- https://foundryvtt.com/packages/token-sounds
- https://www.reddit.com/r/FoundryVTT/comments/1vbvjcg/system_agnostic_playlist_plus_overhaul_of/

### Pass 143 — selective-audio cross-VTT portability correction

The cross-VTT audit weakens Audio Secrets as a standalone utility. Foundry's
current Soundscape Adventure already provides a global cross-world sound
library, moods, random and sequential loops, intensity control, and triggers
from regions, combats, and scenes. Roll20 provides a global Jukebox, and the
official Roll20 Jukebox Plus write-up covers the expected playlist, album,
looping, preview, and backup workflow. Owlbear Rodeo is extensible through
manifest-loaded extensions and embedded popovers, but audio is an extension
surface rather than a shared cross-VTT audio runtime.

This means a neutral route manifest can preserve intent—asset reference,
recipient scope, trigger, queue, duration, and unsupported fields—but cannot
promise equivalent playback, account, hosting, or permission behavior across
Foundry, Roll20, and Owlbear. A generic audio manager would therefore be both
crowded and expensive to maintain. The standalone Audio Secrets utility stays
conditional and below implementation.

Sources:

- https://foundryvtt.com/packages/soundscape-adventure
- https://blog.roll20.net/posts/jukebox-plus/
- https://help.roll20.net/hc/en-us/articles/29620515876375-Invite-Promote-and-Manage-Players
- https://docs.owlbear.rodeo/extensions/getting-started/

### Pass 144 — productized content wrapper: Whisper Drop-In

The better market shape is to make private audio the memorable mechanism of a
paid, ready-to-run experience rather than sell another audio control panel.
**Whisper Drop-In** is a provisional name for an original 60–120 minute,
no-canon mystery or side-session: it starts with whoever is present, gives
different players private audio clues or character-specific sound cues, has a
clean resolution, and exports only explicit rewards/clues plus a player-safe
recap. Foundry is the first implementation; a PDF/audio/neutral-manifest pack
can later support Roll20 or Owlbear without claiming runtime parity.

This wrapper has a clearer payment path than the utility. Foundry explicitly
supports premium assets, adventures, and audio packs through its premium
content system and publisher workflow. Current tools still cover important
components: Soundscape Adventure handles ambient organization and triggers,
Whisper As handles recipient and in-character chat selection, and Louder
Whispers makes private messages noticeable. The product must therefore sell a
complete, polished scenario with reliable asymmetric clue delivery—not
“private audio” as an isolated feature.

The first payer is still narrow but concrete: paid/professional GMs,
organized-play hosts, rotating West Marches-style groups, and horror or
investigation GMs who need an attractive fallback when attendance or campaign
continuity changes. Home weekly groups remain a negative control. The visible
promise is “everyone gets a clue, but nobody gets the whole mystery,” which is
more eye-catching than an audio settings panel and more understandable in a
store listing than a neutral event schema.

Compare Whisper Drop-In against cancellation, a free PDF one-shot, a current
premium adventure, Drop-in Dungeons, Oronder, Soundscape Adventure plus
Whisper As, a generic audio pack, and the GM's manual workflow. Ask **$15,
$25, $39, or no purchase** only after the buyer sees the exact content and
alternative. Require 5/8 qualified buyers to prefer it, 3/8 to choose a
non-zero one-time price, two real pilots, and a separate home-table result.
Rights must be original or licensed: no D&D protected text, monsters, art, or
audio bundled without permission.

**Decision:** Whisper Drop-In is the strongest new product hypothesis so far,
but it is not selected. It still needs buyer-choice, content-quality,
runtime, rights, and second-VTT packaging evidence. If buyers pay only for the
adventure and not the asymmetric delivery, treat the audio layer as a reusable
asset; if only professional hosts pay, record a niche product and continue the
ordinary-table search.

Sources:

- https://foundryvtt.com/article/premium-content/
- https://foundryvtt.com/article/publisher-handbook/
- https://foundryvtt.com/packages/soundscape-adventure
- https://foundryvtt.com/packages/whisper-as
- https://foundryvtt.com/packages/louder-whispers
- https://foundryvtt.com/packages/drop-in-dungeons
- https://foundryvtt.com/packages/oronder

### Pass 145 — expedition/resource pressure fresh scan

The new scan confirms that resource pressure is a real player-facing
friction, not an invented feature request. A community request asks for
world-clock timers that can remind the GM about wandering-monster checks and
torch burn-out, and another asks for a system-agnostic Shadowdark-style torch
timer with inventory consumption and a visible burn-down. That is a useful
behavioral signal, but it is not payment evidence.

The direct incumbent audit closes the generic utility claim. Expedition
Tracker already records dungeon and overland turns, can roll wandering
monsters, and includes timed effects/light-source behavior. Light Sources is
current through Foundry 14 and handles inventory-backed one-click lighting,
in-game or real-time burn-down, automatic extinguishing, and chat notices.
Party Operations covers marching order, watch structure, torchlight, supply,
readiness, and campaign pressure, while SessionFlow covers travel watches,
supply/fatigue, progress clocks, and broadcast state. Flip Timer supplies a
simple shared countdown, and its public discussion shows a request for
longer, game-time-aware timers rather than a completely empty surface.

**Decision:** reject a new generic Resource Steward, torch timer, or
expedition dashboard as the next product. The only remaining shape would be
a content-first, original survival scenario that uses resource pressure as a
dramatic ingredient, but that is another paid scenario hypothesis—not a new
ordinary-player utility—and must not be promoted from feature interest.
Retain only the neutral resource-event and countdown contracts as reusable
assets. Continue the wide search.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1fp5ty8/module_for_timers_keyed_to_the_world_clock/
- https://www.reddit.com/r/FoundryVTT/comments/1oq8fsm/making_modules_instead_of_actually_playing_them/
- https://foundryvtt.com/packages/expedition-tracker
- https://foundryvtt.com/packages/light-sources
- https://foundryvtt.com/packages/party-operations
- https://foundryvtt.com/packages/sessionflow
- https://www.reddit.com/r/FoundryVTT/comments/1vwdadd/system_agnostic_flip_timer/

### Pass 146 — accessibility-first player experience lead

The next scan found a different recurring player problem: screen-reader,
keyboard-only, low-vision, and low-resolution users can be blocked by a VTT
that assumes visual mouse navigation. In a large feature discussion, a user
describes Foundry accessibility as poor for screen readers and keyboard-only
play, while another specifically asks for a character-creation flow that
doesn’t require an external builder. This is a stronger human need than a
generic visual polish request, but the broad character-creation gap is already
occupied by current D&D5e Character Builder and PF2e Leveler/Level-Up Wizard.

The fresh candidate is **Accessible Table Kit**: a current-version,
Foundry-first player accessibility layer for keyboard-first and
screen-reader-friendly navigation, readable chat and roll announcements,
focus recovery, low-resolution layout, token/scene lists, and safe escape
hatches to native sheets. It must not become a rules engine or copy system
content. The eye-catching promise is “play the whole table without hunting
for tiny controls,” but its payer is likely narrower: GMs with a blind,
low-vision, motor-impaired, or keyboard-only player; paid GMs who need an
inclusive table; schools, libraries, and organized-play programs; and
accessibility-conscious communities. Ordinary home tables are a required
negative control.

Current alternatives are meaningful. Foundry Navigator is current through
v14 and already supports D&D5e keyboard, screen-reader, combat, token, and
focus workflows, although its own page says support is still evolving and is
primarily D&D5e. Accessibility Enhancements supplies older PF2e/high-contrast,
audio-feedback, and drag/drop alternatives but is verified only through v12.
Native OS accessibility, custom CSS, system-specific sheet support, and
Roll20/Owlbear accessibility rules are additional controls. This leaves a
possible multi-system, supported-client gap, not a blank market.

**Decision:** open Accessible Table Kit only as a conditional buyer gate. It
is not selected and does not displace the paid/professional side-session or
Whisper Drop-In tests. Require a named accessibility failure, exact-alternative
preference, a non-zero one-time price, two real pilots, and a second-VTT
read-only accessibility contract. If only a tiny specialist group values it,
record that honestly as a high-impact niche rather than calling it a broad
Foundry product.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1qb22yq/what_features_do_you_love_hate_or_wish_existed/
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/accessibility-enhancements
- https://foundryvtt.com/article/player-orientation/
- https://foundryvtt.com/packages/dnd5e-character-builder
- https://foundryvtt.com/packages/pf2e-leveler

### Pass 147 — accessibility market and portability correction

Accessibility is the most defensible underserved need from this fresh scan,
but it also demonstrates why an underserved need is not automatically a
marketable product. Foundry’s marketplace currently lists thousands of
modules, and accessibility already has active, free or community-supported
work. The product would need to support many system sheets, browser/screen
reader combinations, third-party modules, and changing Foundry markup; every
unsupported workflow would be a support incident for a small specialist
audience.

Portability is possible only at the contract level. Foundry’s module layer,
Roll20’s client model, and Owlbear’s verified extension model do not share a
common accessibility runtime. A portable artifact can describe keyboard
commands, semantic announcements, focus targets, user preferences, and
unsupported controls, but it cannot claim identical screen-reader behavior
without separate client implementations and user testing.

**Decision:** Accessible Table Kit is the strongest fresh need, not the new
selected product. Test it only with qualified tables that can name a recent
failure and compare it against Foundry Navigator, Accessibility Enhancements,
native OS tools, custom CSS, and the exact system sheet. Ask **$15, $30, $60,
or no purchase** after the buyer sees the supported scope. Require 5/8
qualified buyers to prefer it, 3/8 to choose a non-zero price, two
three-session pilots, no privacy/accessibility regression, and one second-VTT
read-only contract. Continue the broad search if the gate fails or if payment
is sponsorship/support rather than a repeatable product purchase.

Sources:

- https://foundryvtt.com/packages/
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/accessibility-enhancements
- https://docs.owlbear.rodeo/extensions/tutorial-sharing-your-extension/extension-verification/
- https://foundryvtt.com/article/modules/

### Pass 148 — cognitive-load and player-focus correction

The accessibility lead becomes less differentiated when broadened into a
general “make Foundry easier” product. A current PF2e discussion describes
players repeatedly losing time in a complex sheet with too many tabs, but
other users point to tab management, PF2e HUD, and learning the system as
workarounds. Current Player Pilot already provides a simplified player panel
for common actions, Foundry Navigator provides keyboard and screen-reader
flows for D&D5e, Stylish Action HUD provides a configurable party/action HUD,
and Carolingian UI targets clutter reduction. SessionFlow also bundles a
player-facing presentation surface.

**Decision:** reject a broad Cognitive Access, Focus Mode, or “simpler Foundry”
product. The pain is real but the direct alternatives are numerous and the
buyer may be asking for onboarding, a different game system, or a personal
configuration rather than a paid module. Keep Accessible Table Kit limited to
qualified accessibility incidents; do not transfer general UI complaints into
accessibility WTP. Retain only semantic focus, announcement, and player-action
contracts as reusable assets.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1woc10h/my_players_hate_using_foundryvtt_for_pathfinder2e/
- https://www.reddit.com/r/FoundryVTT/comments/1uj0ssu/dd5e_pf2e_player_pilot_0212/
- https://foundryvtt.com/packages/foundry-navigator
- https://foundryvtt.com/packages/stylish-action-hud
- https://foundryvtt.com/packages/crlngn-ui
- https://foundryvtt.com/packages/sessionflow

### Pass 149 — Migration Safe Harbor fresh GM-payer lead

The next scan returned a stronger payer-shaped incident: a GM who has already
paid for or owns content but cannot trust the result of moving it into Foundry.
Community reports describe journal links arriving without references even in a
blank test world, and migration discussions emphasize that D&D Beyond and
Roll20 do not provide a common formal export/import standard. One migration
thread explicitly describes provider terms and changing formats as making
every converter best effort. This is episodic, but the avoided cost can be
high for an active campaign or paid GM with a deadline.

The candidate is **Migration Safe Harbor**, a narrower successor to the
existing VTT BridgeCheck hypothesis: a local, read-only, disposable-copy
assurance pass after an import. It would inspect document/link closure, missing
assets, scene grids/walls/lights, duplicate or overwritten documents,
permissions, system/core/module compatibility, unsupported fields, and
play-tonight smoke checks, then produce a confidence/repair receipt. It would
never scrape D&D Beyond or Roll20, collect credentials, retain publisher
content, mutate the live world, or promise a universal converter.

The buyer is an active migrating GM, long-running campaign owner, paid GM,
or small publisher testing a user-owned package—not the average player. The
eye-catching promise is “imported does not mean playable; know what broke
before game night.” Foundry-first is technically plausible; a second VTT
starts as a receipt consumer, not an adapter that writes into another account.

Compare against DDB-Importer, R20Exporter/R20Converter, PDF-to-Foundry,
manual rebuild, Foundry Adventure Documents, Scene Packer, Asset Auditor,
Lore Reference Board, RPGNautas File Manager, and the buyer’s backup/clone
workflow. Ask **$10, $25, $50, $75, or no purchase** only after the buyer
names a recent migration failure and sees the exact importer plus manual
cleanup. This is a candidate, not a selection.

Sources:

- https://foundryvtt.com/packages/ddb-importer
- https://www.reddit.com/r/FoundryVTT/comments/1s5te16/version_13351_adventure_importing_trouble/
- https://www.reddit.com/r/FoundryVTT/comments/1tzlbym/roll_20_migration/
- https://foundryvtt.com/packages/adventure-import-export
- https://foundryvtt.com/packages/pdf-to-foundry

### Pass 150 — Migration Safe Harbor direct-incumbent and rights correction

The assurance wedge is narrower than the initial migration story. Foundry's
native Adventure Documents preserve internal links for Foundry-to-Foundry
imports, while Scene Packer provides an asset report, Asset Auditor finds and
repairs missing file paths, Lore Reference Board performs import-time link
checks and relink suggestions, and RPGNautas File Manager advertises deep
link repair. DDB-Importer is current through Foundry 14 and already imports
many D&D Beyond adventures with walls, lighting, journals, and monsters.

The residual failure is not “moving content is hard” in the abstract. It is a
named post-import false-green: the importer completes, but links, assets,
permissions, system-dependent behavior, or play-critical scene details still
fail. A repair receipt must prove it found something the exact importer and
current repair tools did not, or buyers will rationally use the free tools or
rebuild manually. Roll20 migration also carries terms and rights uncertainty;
the product must inspect user-owned output only and must not encourage
unsupported scraping or license circumvention.

**Decision:** keep Migration Safe Harbor / VTT BridgeCheck as a high-urgency,
episodic buyer gate, not a selected product. It currently has a clearer GM
payment path than general accessibility or resource timers, but frequency,
exact-alternative preference, rights, and cross-VTT portability remain
unproven. Require 5/8 qualified migrating GMs to prefer the receipt, 3/8 to
choose a non-zero price, two disposable-copy pilots, and a clean credential/
content boundary. If it only saves one migration and buyers will not pay for
assurance, continue the wide search rather than build a converter.

Sources:

- https://foundryvtt.com/article/adventure/
- https://foundryvtt.com/packages/scene-packer/
- https://foundryvtt.com/packages/asset-auditor
- https://foundryvtt.com/packages/lore-reference-board
- https://foundryvtt.com/packages/rpgnautas-file-manager
- https://foundryvtt.com/packages/ddb-importer
- https://www.reddit.com/r/FoundryVTT/comments/1tzlbym/roll_20_migration/

### Pass 151 — migration payment-proxy audit

The payment audit finds a real but indirect signal. DDB-Importer is current
through Foundry 14, actively maintained across Foundry/D&D5e version lines,
and its documentation gates some monster, adventure, sync, and support
features behind Patreon support or a user-run proxy. Its documentation also
warns users about credentials, updates, and version compatibility. Historical
community discussions describe users paying for full importer access and
ongoing maintenance, but those price points are old and must not be reused as
current pricing.

This confirms that active GMs will pay for migration/import capability and
maintenance when the saved time or retained content is concrete. It does not
transfer payment to Migration Safe Harbor: an importer produces content,
while a receipt only reduces uncertainty after the importer runs. The product
would need a named false-green incident, a visible decision-changing result,
or a recurring update/regression check to justify its own price.

**Decision:** strengthen the Migration Safe Harbor payer hypothesis, but keep
it unselected. Add a repeat-value arm—post-import recheck after a Foundry,
system, or module update—only as an experiment against backups, package
warnings, the importer’s support path, and manual clone testing. Do not claim
that Patreon or importer payment proves receipt WTP, and do not collect source
credentials or operate a proxy.

Sources:

- https://foundryvtt.com/packages/ddb-importer
- https://docs.ddb.mrprimate.co.uk/docs/ddb-importer/initial-setup
- https://docs.ddb.mrprimate.co.uk/docs/ddb-importer/adventures
- https://www.patreon.com/MrPrimate/posts/getting-started-45692991
- https://www.reddit.com/r/FoundryVTT/comments/1tzlbym/roll_20_migration/

### Pass 152 — paid-GM attendance economics

The fresh payer scan confirms that attendance is not merely an annoyance for
every table. On StartPlaying, campaign players are charged per session, a
no-show is still chargeable, and a GM cancellation is not charged. The same
platform has explicit 24-hour skip rules, refund handling, and guidance for
removing repeat no-shows. Warhorn positions registration, schedules, table
assignments, and online event payments as a core job for organized play.

This is evidence of a qualified payer segment: paid/professional GMs,
organized-play hosts, and event organizers have revenue, seat utilization, and
reputation attached to a session continuing. It is not evidence that a new
Foundry module should own attendance policy. The platform and event tools
already own booking, payment, skip, refund, and roster decisions.

**Decision:** keep attendance as a buyer-shaped research lane, but target the
cost of a partially empty table rather than scheduling. The negative control
is an ordinary home campaign that can simply cancel or postpone. A useful
product would have to preserve a paid session without corrupting the main
campaign, and it must show value over a refund, a shortened session, a free
one-shot, or the GM's existing prep library.

Sources:

- https://intercom.help/startplaying/en/articles/8719173-when-are-players-charged
- https://intercom.help/startplaying/en/articles/8719194-refund-policy
- https://intercom.help/startplaying/en/articles/14422594-how-do-i-handle-a-no-show-player
- https://intercom.help/startplaying/en/articles/8719207-what-is-startplaying
- https://warhorn.net/

### Pass 153 — attendance incumbent correction

The first candidate, a generic attendance dashboard or session-rescheduling
module, is rejected. StartPlaying already exposes active versus pending games,
per-session charging, skip windows, refunds, player removal, and no-show
handling. Warhorn covers event registration, schedules, payments, and table
planning for organized play. Foundry-side session tooling also moved forward:
SessionFlow now provides beat/scene sequencing, quick scenes, progress clocks,
player widgets, recaps, and a polished player-facing session canvas, while
Scene Packer and existing drop-in content already reduce the cost of preparing
portable encounters.

The residual job is not “track who attended.” It is “keep a paid or high-value
session worthwhile when the expected party changes at the last minute.” That
job may be solved by content rather than infrastructure: a bounded, no-canon
side session that starts with whoever is present, has an explicit exit, and
exports rewards or clues without writing hidden state into the main campaign.

**Decision:** reject a new attendance/booking/roster module. Promote only the
content-shaped **Table Rescue / Attendance-Resilient Side Session** as a
conditional candidate. It must beat the buyer's exact cancellation, refund,
shortened-session, free-adventure, premium-drop-in, and manual-prep options.

Sources:

- https://intercom.help/startplaying/en/articles/8719173-when-are-players-charged
- https://intercom.help/startplaying/en/articles/14422594-how-do-i-handle-a-no-show-player
- https://warhorn.net/
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/scene-packer/
- https://foundryvtt.com/packages/drop-in-dungeons
- https://foundryvtt.com/packages/oronder

### Pass 154 — Table Rescue product gate

The candidate is now deliberately small and market-facing: a 60–120 minute,
original, no-canon rescue scenario with variable player-count entry points,
private or public clues as needed, a clean stopping point, and an explicit
reward/clue/recap export. Foundry is the first presentation and automation
target, but the paid artifact must also work as a PDF plus neutral scenario
manifest so a Roll20, Owlbear, or theater-of-the-mind table can run it without
an account bridge. The eye-catching demo is a GM selecting “two players
absent,” launching a different branch in one click, and ending with a clean
campaign-safe handoff.

The buyer is not the average player. It is a paid/professional GM, organized
play host, or rotating-party organizer who loses money, trust, or a scarce
session slot when attendance changes. Home tables remain a required negative
control. The exact alternatives are cancellation/refund, cut scene, running
short, improvising, a free one-shot, a current premium adventure, Drop-in
Dungeons, Oronder, SessionFlow, and the GM's own emergency folder.

**Decision:** keep Table Rescue as the first bounded payer gate, not a selected
product. Ask **$15, $30, $49, or no purchase** only after showing the actual
scenario and the alternatives. Require 5/8 qualified buyers to prefer it,
3/8 to choose a non-zero price, two real pilots, and a separate home-table
result. Record whether payment is for the scenario, the variable-party
branching, the Foundry presentation, or the clean campaign-safe export. If
buyers only want generic adventure content or prefer cancelling, demote it
and continue the wide search.

The Foundry fixture must use original/licensed synthetic assets and disposable
copies. Test two-, three-, and five-player starts, late join, missing player,
branch selection, hidden/public clue scope, reconnect, duplicate reward
prevention, explicit export, and zero writes to the main campaign. The
portable artifact is PDF/audio plus a neutral scenario/branch/reward/recap
manifest; no publisher-content copying or hosted service is required.

Sources:

- https://intercom.help/startplaying/en/articles/8719194-refund-policy
- https://intercom.help/startplaying/en/articles/14422594-how-do-i-handle-a-no-show-player
- https://startplaying.games/blog/posts/how-does-startplaying-work-for-players
- https://foundryvtt.com/packages/sessionflow
- https://foundryvtt.com/packages/drop-in-dungeons
- https://foundryvtt.com/packages/oronder

### Pass 155 — session reliability as a recurring player problem

The fresh player-facing scan finds a more recurrent failure than migration:
players can be connected but unable to move, see a scene, see tokens, or trust
that their client is current. Community reports describe repeated disconnects,
black or gray scenes, missing actors after scene changes, and refreshes that
restore behavior. The official troubleshooting guide identifies module
conflicts, oversized images, disabled hardware acceleration, missing assets,
disk space, and network conditions as distinct causes; a host may need to
reduce transferred media or use hosting.

This is a real session-cost problem for ordinary players and GMs, especially
tables that meet infrequently or paid GMs who cannot casually restart a game.
It is also a dangerous product category: a Foundry add-on cannot repair a bad
router, a broken browser/GPU, or a module conflict it cannot observe. “Fix your
connection” is therefore an unacceptable promise.

**Decision:** open a narrower **Session Continuity** hypothesis: show the GM
which clients are actually connected, loaded, interactive, and on the intended
scene; preserve a minimal rejoin/checkpoint receipt; and give the player a
safe, explicit recovery path without mutating campaign content. Treat the
client health signal, not universal network repair, as the product promise.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1elkhef/every_couple_of_minutes_my_players_cannot_move_their_tokens_and_have_to_refresh_their_browser_to_get_back_in_the_game/
- https://www.reddit.com/r/FoundryVTT/comments/1j5fjlf/player_unable_to_access_game/
- https://www.reddit.com/r/FoundryVTT/comments/1w50ova1/viewed_scene_vs_active_scene_the_difference/
- https://foundryvtt.com/article/ts-scene-loading/

### Pass 156 — session reliability incumbent correction

The generic reliability pitch is already fragmented across current tools and
platform behavior. Connection Monitor detects disconnect/reconnect state and
visually disables controls while disconnected, but it is a small support-style
module rather than recovery or readiness proof. Performance Optimizer provides
per-player profiles, low-FPS detection, a GM panel, and a benchmark scene for
client rendering. Foundry core provides scene preload, safe configuration,
package backups, and snapshots. Hosting providers and network fixes remain
outside the module layer.

The gap is not another FPS meter or a prettier disconnected banner. It is a
single, evidence-linked answer to “can we safely continue?” that distinguishes
server connection, client responsiveness, scene/media readiness, current
scene identity, and a recoverable player action. The result must also explain
unknown or unsupported causes instead of claiming a false green state.

**Decision:** reject a generic performance, connection, or hosting product.
Keep Session Continuity only as a conditional reliability receipt and recovery
workflow. Compare it directly against Connection Monitor, Performance
Optimizer, core preload/safe mode, backups, hosting support, browser/GPU fixes,
and simply refreshing. A paid buyer must name a recent session loss and prefer
the receipt/recovery workflow over those exact controls.

Sources:

- https://foundryvtt.com/packages/connection-monitor
- https://foundryvtt.com/packages/performance-optimizer
- https://foundryvtt.com/packages/preloader
- https://foundryvtt.com/article/scenes/
- https://foundryvtt.com/article/ts-scene-loading/
- https://foundryvtt.com/article/backups/

### Pass 157 — Session Continuity product gate

The candidate is a local, Foundry-first reliability layer with four bounded
outputs: a per-client connection/interaction heartbeat, scene and required
asset readiness, a clear “safe to continue / waiting / unknown” state, and a
rejoin receipt that restores only player-local view and explicitly staged
actions. It must never replay an uncertain combat action, rewrite a world, or
pretend to diagnose a router or browser it cannot inspect. The eye-catching
demo is a player reconnecting and seeing “you are on Scene B, your last staged
action was not submitted,” while the GM sees exactly which player is safe to
continue.

The qualified buyer is a paid/professional GM, a high-investment campaign
owner, or an organizer whose sessions cannot casually restart. Ordinary home
tables remain a negative control. The cross-VTT artifact is a neutral health
and recovery receipt—client identity, session/scene identity, readiness
signals, last confirmed server event, pending/unknown action, and unsupported
state—not a shared networking runtime. Roll20 or Owlbear begins as a receipt
consumer or manual checklist, not a claim of parity.

**Decision:** retain Session Continuity as a conditional recurring-pain gate,
not a selected product. Ask **$10, $20, $40, or no purchase** after a buyer
sees a real failure fixture and the incumbent controls. Require 5/8 qualified
buyers to prefer it, 3/8 to choose a non-zero price, two multi-session pilots,
and a home-table negative control. Reject it if buyers only want hosting,
performance tuning, a free reconnect banner, or an impossible guarantee of
network repair.

The fixture must use two player clients and a disposable world. Test dropped
connection, delayed reconnect, stale scene identity, missing asset, black/gray
scene, low-FPS client, late join, duplicate input, uncertain action, GM
reload, and recovery without hidden-state leakage. The portable receipt must
be exportable without player content, credentials, or a hosted service.

Sources:

- https://foundryvtt.com/packages/connection-monitor
- https://foundryvtt.com/packages/performance-optimizer
- https://foundryvtt.com/article/ts-scene-loading/
- https://foundryvtt.com/article/backups/
- https://www.reddit.com/r/FoundryVTT/comments/sa99so/how_can_i_make_foundry_refresh_free/

### Pass 158 — rest and downtime as an ordinary-table pain

The fresh ordinary-table scan finds a recurring, player-visible bottleneck:
long rests often become a sequence of GM-mediated requests for identify,
attunement, spell copying, watch, food, equipment, and recovery. A recent
community post describes the bookkeeping as capable of consuming about an
hour and says many tables skip the interesting transactional parts to keep
the session moving. This is a stronger recurring pain than a creator-only
workflow because every D&D5e table encounters rests and players are directly
affected by the lost time or skipped choices.

The product promise cannot simply be “automate long rests.” D&D5e rest rules
are system-specific and tables deliberately choose different levels of
survival, exhaustion, food, downtime, and encounter detail. A useful product
would need player self-service, GM approval where required, clear auditability,
and safe handoff to the system's authoritative rest engine.

**Decision:** open rest/downtime as a high-frequency buyer scan, but treat
generic rest automation as unproven until the current modules are tested. A
portable layer can describe activities, approvals, costs, checks, and results;
it cannot claim identical rule semantics across VTTs or game systems.

Sources:

- https://www.reddit.com/r/FoundryVTT/comments/1sc5zyt/dnd5e_ionrift_respite_long_rests_where_players/
- https://www.reddit.com/r/FoundryVTT/comments/1m1ru25/dnd5e_rest_recovery_for_5e/
- https://www.reddit.com/r/DnD/comments/1uxbt9t/next_session_i_plan_to_ask_the_dm_at_the_start_how_many_spell_slots_other_per_long_rest_resources_they_have_left/

### Pass 159 — rest-management incumbent correction

The direct incumbent scan closes most of the broad gap. Rest Recovery 5e is
current for Foundry 14 and covers short/long recovery, class features, HP,
partial recovery, exhaustion, food, water, and starvation. Ionrift Respite is
current for Foundry 14, describes the rest bottleneck directly, and provides
player-selected activities, GM-reviewed events, comfort, meals, short rests,
and self-service identify/attune/copy-spell workflows across several systems.
Stress Points & Rest occupies the deliberate survival/pressure variant, while
D&D5e Character Builder already coordinates rest gating and compatibility.

The important payment correction is that a clear pain plus enthusiastic
interest is not enough. Ionrift's own community post presents the module as
free/non-commercial while reporting strong appreciation; that is evidence of
need and adoption potential, not a price signal. A new generic rest module
would face an unusually strong free/current alternative and a compatibility
support burden across system sheets and homebrew rules.

**Decision:** reject a broad rest/recovery automation product. Compare any
narrow follow-on against Rest Recovery 5e, Ionrift Respite, Stress Points &
Rest, Character Builder, native system rests, and the table's manual process.
Retain only neutral activity/approval/event contracts as reusable assets.

Sources:

- https://foundryvtt.com/packages/rest-recovery/
- https://foundryvtt.com/packages/ionrift-respite
- https://foundryvtt.com/packages/stresspoints-rest
- https://foundryvtt.com/packages/dnd5e-character-builder
- https://www.reddit.com/r/FoundryVTT/comments/1sc5zyt/dnd5e_ionrift_respite_long_rests_where_players/

### Pass 160 — rest content and portability demotion

A narrower content-shaped idea—premium camp events or a portable rest-scene
pack—also fails to separate cleanly. Ionrift Respite already includes
terrain-specific events, branching outcomes, custom event-pack support, and
multiple-system adapters. Stress Points & Rest already turns supplies,
comfort, and medical resources into a visible player-facing rest loop. The
remaining opportunity is either a ruleset-specific content pack or a custom
event library, not a broad product for ordinary VTT customers.

Portability is weaker than it first appears: an activity manifest can travel,
but rest timing, resource recovery, exhaustion, item hooks, approvals, and
system-specific actions require adapters. That creates a support matrix while
the strongest current alternative is already multi-system within Foundry.

**Decision:** demote rest/downtime as a product candidate and keep it as a
negative control. Do not build a competing rest engine or event pack until a
qualified buyer names an unresolved failure that survives Ionrift Respite and
the exact system-native controls, chooses a non-zero price, and completes a
pilot. Continue the wide search; no product is selected.

Sources:

- https://foundryvtt.com/packages/ionrift-respite
- https://foundryvtt.com/packages/stresspoints-rest
- https://foundryvtt.com/packages/rest-recovery/
- https://foundryvtt.com/packages/dnd5e-character-builder

### Pass 161 — map and media failures as a recurring session pain

The next scan finds a concrete reliability problem with a direct table cost:
oversized maps, animated backgrounds, unoptimized audio, and incompatible
client conditions can leave one or more players staring at a black screen,
waiting through a stalled load, or falling back to a screen share. Foundry's
own media guide says scene media is distributed to connected users, recommends
WebP/OGG-style formats, and suggests keeping video maps near 50 MB when
possible. Its troubleshooting guidance separately identifies large images,
hardware acceleration, disk space, missing files, and network issues.

This is recurring for GMs who buy or create map-heavy content, and it affects
ordinary players directly. The buyer is still usually the GM or host, but the
demo is visible: “the weakest player loads the scene before game night.” The
product must preserve visual quality and provide a rollback path; blind
compression could make a campaign worse.

**Decision:** open **Playability Budget / Media Safe Pack** as a new
conditional candidate. It would scan user-owned scenes and media, estimate
per-client risk, create non-destructive optimized copies, and report what was
actually verified. It is not a hosting service, a universal browser repair,
or a replacement for network troubleshooting.

Sources:

- https://foundryvtt.com/article/media/
- https://foundryvtt.com/article/ts-scene-loading/
- https://www.reddit.com/r/FoundryVTT/comments/1jusug4/foundry_either_loading_endlessly_or_loading_into_an_almost_black_screen/
- https://www.reddit.com/r/FoundryVTT/comments/1ug29lh/horrible_performance_in_firefox/
- https://www.reddit.com/r/FoundryVTT/comments/qp4hbr/experiencing_extreme_load_lag/

### Pass 162 — media optimizer incumbent correction

The generic optimizer claim is already occupied. Geano's Scene Optimizer
scans scenes and audio, converts images to WebP and audio to OGG/Opus, keeps
originals, and shows progress; its package page currently reports Foundry 12+
with Verified 13 rather than Verified 14. DF Architect provides tile flattening
and scene-prep tooling but is verified only through an older Foundry release.
Foundry's official guide is a strong free control, and external tools such as
Audacity, image converters, and ffmpeg can perform the transformations.

The residual job is not “convert PNG to WebP.” It is “will this exact world be
playable for these clients, and can I optimize it without breaking links,
visual fidelity, audio behavior, or rollback?” A result must distinguish
file size, pixel dimensions, codec, browser/GPU risk, missing path, and network
budget; an optimization that merely reduces bytes is not proof of playability.

**Decision:** reject a generic media converter. Keep Playability Budget / Media
Safe Pack only as a conditional assurance-and-optimization gate. Compare it
against Geano's Scene Optimizer, DF Architect, the official guide, external
tools, core preload, hosting/S3, and manual copies. Do not infer WTP from a
GM liking a smaller file.

Sources:

- https://foundryvtt.com/packages/geanos-scene-optimizer
- https://foundryvtt.com/packages/df-architect
- https://foundryvtt.com/article/media/
- https://foundryvtt.com/article/asset-management/
- https://foundryvtt.com/article/requirements/

### Pass 163 — Playability Budget product gate

The candidate is now a read-only, local, non-destructive playability pass for
user-owned content. It reports scene/media budgets, dimensions, codecs,
missing paths, duplicate assets, preload size, and declared client profiles;
creates optimized copies only after confirmation; visual/audio comparison is
explicit; and every output has a rollback link. The eye-catching demo is a
large adventure scene changing from “one player will probably black-screen” to
“verified under the low-bandwidth/low-GPU fixture,” with the original still
available.

The qualified buyer is an asset-heavy GM, paid/professional host, or campaign
owner who has already lost a session to loading or who regularly imports map
packs. Home tables with small static maps are a required negative control. The
portable artifact is an asset manifest containing hashes, dimensions, codecs,
budgets, checks, optimized variants, unsupported states, and rollback paths;
other VTTs can consume the report or use the optimized files manually.

**Decision:** retain Playability Budget / Media Safe Pack as a conditional
candidate, not a selected product. Ask **$10, $25, $50, or no purchase** after
the buyer sees the exact failure fixture and the incumbent controls. Require
5/8 qualified buyers to prefer it, 3/8 to choose a non-zero price, two
multi-session or multi-world pilots, and a home-table negative control. Reject
it if buyers only want a free converter, hosting, or a one-time compression
favor; continue the wide search if the receipt never changes a decision.

The fixture uses synthetic/user-owned maps, audio, video, and two player
clients. Test oversized dimensions, PNG/JPEG/WebP, WebM/MP4, OGG/MP3/WAV,
missing paths, duplicate content, preload, low disk, low bandwidth, low GPU,
Safari/Firefox/Chromium differences, visual fidelity, audio looping, rollback,
and no live-world mutation. No publisher content is retained or redistributed.

Sources:

- https://foundryvtt.com/article/media/
- https://foundryvtt.com/article/asset-management/
- https://foundryvtt.com/packages/geanos-scene-optimizer
- https://foundryvtt.com/packages/df-architect
- https://foundryvtt.com/article/ts-scene-loading/

### Pass 171 — Star*Tup deterministic fixture and compatibility boundary

The M0–M2 audit found that the benchmark and profile contracts were present,
but the project did not yet expose a standalone disposable-fixture contract.
Star*Tup now includes deterministic GM/Player3 fixture plans, redacted staged
observations, explicit incomplete/blocked receipts, exact target identity, and
`noWrite`/`noRawData` guarantees. The fixture contract accepts timing/resource
counts and unsupported-metric labels without accepting raw Foundry IDs,
documents, module payloads, or asset bytes.

The existing DiceBox implementation checkout remains too dirty to import as a
runtime dependency. A compatibility boundary now documents the shared receipt
and fixture vocabulary and reserves the existing media registry,
asset-attestation, and Foundry FilePicker read contracts for the later asset
and preload slice. This preserves provenance without inventing a competing
asset/hash or file-browse contract.

Deterministic verification now passes 8/8 Node tests and syntax checks. The
fixture receipt is still local evidence, not exact-runtime certification. The
next gate remains the disposable Foundry v14.367 GM/player fixture.

Sources:

- `C:\Users\rujie\Documents\ChatGPT\Star_Tup\docs\DICEBOX-COMPATIBILITY.md`
- `C:\Users\rujie\Documents\ChatGPT\Star_Tup\docs\M0-M2-IMPLEMENTATION-RECEIPT.md`
