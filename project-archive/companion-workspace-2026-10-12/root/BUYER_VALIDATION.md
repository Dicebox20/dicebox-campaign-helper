# Buyer Validation Protocol: Campaign Safe Mode / Session Savepoints

This protocol is the gate between market research and implementation. It is
designed to test whether Campaign Safe Mode is a paid solution for ordinary
Foundry D&D5e groups, not merely an interesting workflow.

## Target buyers

Primary:

- Dungeon Masters who run D&D5e in Foundry at least monthly.
- GMs who have cancelled, shortened, or improvised a session in the last six
  months because of an absent player, late player, off-script party, or missing
  preparation.
- GMs who use Foundry as more than a map display and maintain a persistent
  campaign world.

Secondary:

- Players who have been affected by a disrupted session and can describe the
  cost of cancellation or dead time.
- GMs running paid games, organized-play-like campaigns, or regular weekly
  groups where continuity has a measurable social or financial cost.

Exclude from the first decision:

- Module creators and professional GMs as the only evidence.
- Users who only want an AI GM.
- Users who have never run or played a real Foundry session.

## Interview questions

Ask about the most recent disruption, not hypothetical interest:

1. Think about the last six sessions. Did a player miss, arrive late, or leave
   early; did the party go somewhere unprepared; or did the session resume with
   uncertain state, or a correction that should not permanently alter the
   campaign?
2. What did you do next? List the actual notes, modules, files, or manual steps
   used, and how many minutes were lost.
3. Did you cancel, shorten, lower the scope, or improvise? What was the cost to
   the players and to you as GM?
4. Which campaign-management, prep, memory, or scene tools do you already use?
   What do they still fail to recover safely?
5. Would you trust a temporary session branch more if it showed its sources,
   required approval, and could be selectively merged or discarded?
6. Who would pay: the GM, each player, or the group together?
7. Which purchase feels reasonable for a Foundry module usable by the whole
   group: $10, $15, $25, $35 one-time, $3/month, or none?
8. What would make you uninstall it immediately? (Wrong state, hidden mutation,
   clutter, AI inventing canon, privacy, subscription, compatibility, etc.)

Do not lead with the product name or promise avoided cancellations before
question 1.

## Behavioral prototype test

Use a recorded or synthetic disruption scenario twice:

1. Baseline: the GM recovers from an absent player or off-script decision using
   normal notes, modules, folders, and Foundry operations.
2. Safe Mode: the GM uses checkpoint → disruption choice → temporary branch →
   typed diff → selective merge/discard → read-back, with sources and proposed
   mutations visible.

Record:

- minutes from disruption recognition to a playable next scene;
- time spent searching notes, compendia, folders, and prior chat logs;
- number of proposed changes rejected, corrected, or left ambiguous;
- whether the branch preserves party, location, objectives, resources, and
  player-owned state;
- whether the GM understands why each proposal was made;
- whether the GM would have cancelled without the workflow;
- whether the player can re-enter with the generated player-safe brief;
- whether the GM prefers branch/discard to a full-world restore or duplicate
  world.

The workflow must never silently mutate the live world. It must show a diff,
require GM approval, write through the supported Foundry API, and reread the
resulting state. A full-world backup restore is the baseline competitor, not a
substitute for semantic selective merge.

## Go / no-go thresholds

Proceed to a Foundry MVP only if all are true:

- At least 6 of 10 qualified GMs report a disruption in the last six months
  without being prompted toward a preferred solution.
- At least 5 of 10 groups reduce recovery time by 30% or more without losing
  state or increasing correction work.
- At least 4 of 10 primary buyers choose a one-time price of $15 or more in a
  blind purchase-choice exercise, and at least 2 say they would buy now.
- No more than 2 of 10 testers distrust the packet because it is opaque,
  over-automated, or too difficult to review.
- The Foundry slice can snapshot, stage, approve, write, reread, and recover
  through supported APIs without bundling restricted rulebook or adventure
  text.

If disruption is common but willingness to pay is weak, test a bundle that
includes the Player Turn Coach as a recurring session benefit. If users prefer
ordinary backups or duplicate worlds, or the branch requires too much manual
correction, reject the product and return to the candidate scorecard.

## Pricing experiment

Do not ask only “would you pay?” After the tester completes the workflow, show
the same product with randomized price choices: $10 one-time, $15 one-time,
$25 one-time, $35 one-time, $3/month, or free/read-only. Record the selected
offer, the rejected alternatives, and whether the tester would buy now for the
current campaign.

Treat a price as credible only when the tester has experienced the checkpoint,
diff, merge/discard, and re-entry flow. Separate hobby campaigns from paid or
high-commitment campaigns so professional-GM willingness does not stand in for
ordinary consumer demand.

The current hypothesis is a free read-only checkpoint/export plus a $15–25
one-time GM purchase for Safe Mode. This must be falsified if buyers prefer
free backups, do not encounter the problem often enough, or demand an ongoing
service before they see value.

## Competitor comparison script

For each tester, show or name only the tools they already use, then compare the
prototype against:

- campaign notes, journals, and manual scene preparation;
- campaign memory or recap tools;
- campaign/session planning tools;
- an AI co-pilot, if they use one;
- the GM's current recovery workflow after an absent player or off-script turn.

The product is not validated if users describe it as “another campaign wiki,”
“an AI GM,” or “just a backup.” The must-have distinction is a fast,
inspectable, reversible, selectively mergeable way to keep tonight's session
playable without corrupting campaign state.

## Portability test after Foundry validation

Export a neutral rescue packet containing only:

- semantic actor, scene, objective, and state identifiers;
- attendance/disruption choice and assumptions;
- proposed scene/encounter/briefing changes;
- provenance, approvals, and unresolved findings;
- player-safe and GM-only views.

Implement a read-only adapter for one other VTT before attempting live writes.
Do not make a universal live-sync claim until the adapter can pass equivalent
state, provenance, and permission tests.

## Technical feasibility gate

Before calling the Foundry product ready for sale, prove the following on the
exact supported Foundry and D&D5e versions:

- checkpoint extraction is serializable and repeatable;
- local dry-run validation rejects invalid document changes;
- branch diffs identify semantic IDs, runtime bindings, preconditions, and
  ownership;
- approved changes execute in dependency order and reread authoritatively;
- a failed or interrupted merge leaves a recoverable receipt and a clear
  unresolved state;
- foreign, runtime-owned, and external-media state is not silently replaced;
- the exported packet remains useful as a read-only report outside Foundry.

Do not claim atomic rollback across arbitrary VTT documents. Use staged
operations and compensating recovery where the platform does not provide a
single transaction boundary.

The prototype must explicitly distinguish “API supports the operation” from
“the product is safe to sell.” Capture exact-runtime evidence for source
serialization, ephemeral cloning, local validation, permission checks,
multi-document staging, failure recovery, hidden-state filtering, and
authoritative read-back on Foundry 14.367 / D&D5e 5.3.3.

## Adversarial comparison requirement

Every test must include the buyer's actual alternative, selected before the
demo:

- Foundry native package/world backup;
- a document backup or recycle-bin module;
- duplicate-world workflow;
- campaign journal/notes;
- AI continuation or GM co-pilot, if already used.

Ask the GM to solve the same disruption with the alternative first, then with
Safe Mode. Safe Mode passes only if it reduces recovery effort or continuity
risk enough that the GM prefers it and chooses a paid offer. A faster demo or
more attractive interface is not sufficient evidence.

## Player-side and cross-VTT validation

Player friction is a discovery signal, not a payment conclusion. Recruit at
least one participant from each buyer cohort when possible:

- a GM running a persistent weekly Foundry campaign;
- a paid GM or campaign organizer whose missed sessions have revenue or
  scheduling cost;
- a West Marches, living-campaign, or rotating-player organizer;
- an in-person GM using Foundry as a projected or second-screen tool.

Include players in usability sessions, but record separately whether the GM or
host would pay. Test the player-safe re-entry brief against the player's real
alternative—chat scrollback, a journal, a GM explanation, or memory—and measure
whether it gets the player back into the session without exposing hidden state.

For portability, test a neutral packet outside Foundry before promising a
second live adapter. A cross-VTT candidate passes only if the packet remains
useful when imported or viewed without Foundry-specific IDs, and the buyer
still prefers the workflow over a normal campaign note or exported backup.

## Attention and desirability validation

Do not explain the product before measuring whether the market notices it.
Run the following message tests with qualified GMs:

1. **Five-second test:** show only a thumbnail or a short silent clip. Ask what
   the product does, who it is for, and what problem it prevents.
2. **Thirty-second test:** show the disruption-to-branch-to-merge sequence with
   no technical vocabulary. Ask whether the GM would install it before the
   next session.
3. **Alternative test:** show the same disruption solved by a backup, journal,
   duplicate world, and Campaign Continuity. Ask which workflow they would use
   in a real session and why.
4. **Message test:** compare “Campaign Continuity,” “Undo the Session,” and
   “Continue After the Disruption.” Record comprehension and purchase choice;
   do not treat stated liking as conversion.
5. **Trust test:** show compatibility, data ownership, the diff/receipt, and
   the free checkpoint/export. Ask what would stop installation or payment.

The product passes the attention gate only when a qualified buyer can identify
the user, moment, and payoff without explanation, then chooses it over a real
alternative. If the branch/merge demo is still described as “a backup,” reject
the positioning and reopen product selection rather than polishing the brand.

## Hero-artifact test

Show the Canon & Branch Board as a single screenshot and as a short silent
interaction. Do not explain the underlying data model. Ask:

- What do you think this is?
- What would you click first?
- What would you show your players?
- Would this replace a backup, a journal, or neither?
- What would make you trust the Keep/Discard result?

The Board is only a valid market surface if it creates a visible “I want that”
reaction while the buyer still understands the operational payoff. If it is
liked only as a prettier recap, keep it out of scope and reopen product
selection.

## Head-to-head product test

Do not ask buyers to evaluate a broad suite. Compare two narrow offers:

### Campaign Continuity

“Continue after a disruption. Branch the session, compare the consequences,
and canonize what happened.”

### Campaign Guardian

“Protect the campaign before an update. Create a self-contained save state,
verify that it launches, and restore safely before game night.”

For each offer, collect:

- whether the GM experienced the problem in the last twelve months;
- the actual workaround used;
- time or campaign value lost;
- unaided comprehension after a 30-second demo;
- install intent and one-time purchase choice;
- the buyer's reason for rejecting the other offer.

The winner must be selected by recent pain plus purchase choice, not by which
demo receives more compliments. Keep the two implementation tracks separate
until this comparison identifies the paid outcome.

Add these explicit alternatives to the comparison set:

- Foundry package backup/snapshot and restore;
- The Forge Save Points or equivalent hosting recovery, when applicable;
- Battle Replay or ordinary combat recap for replay-oriented buyers;
- cancelling, running a one-shot, or ghosting an absent player;
- Encounter Forge/RPGM Forge or existing improvisation tools for off-script
  play.

Reject a candidate if its demo is more attractive but the buyer's actual
alternative solves the same recent problem with less effort and no meaningful
loss of campaign state or hidden-information control.

## Revision after the eye-catching marketability pass

Campaign Continuity / Safe Mode is now a **no-go as the first storefront
product** until it wins an actual buyer-choice test. The reason is not that
the branch engine lacks technical interest; its visible promise is episodic,
hard to understand without explanation, and adjacent to free backups,
duplicate-world workflows, notes, and current dashboard/continuity modules.
Keep the branch, provenance, player-safe filtering, reset, and recovery
receipts as reusable implementation assets. Do not build the Canon & Branch
Board as a marketing surface before it proves it is more than a prettier
recap.

The next candidate screen is **Adventure Capsules**: compact, ready-to-run,
player-visible sessions containing prepared scenes, handouts, reveals,
bounded choices, and a clean reset/replay path. This is not yet approved for
implementation. Its validation must include:

- a five-second listing test with no explanation;
- a thirty-second silent walkthrough from install to player-visible payoff;
- comparison with current premium adventures, map packs, free community
  content, and the GM's normal prep workflow;
- a real purchase-choice test at $10, $15, $25, and $35 one-time prices;
- minutes of prep avoided, time to first playable scene, and whether the GM
  would run another capsule within 30 days;
- a licensing audit for rules, art, maps, music, and adventure text;
- a neutral packet/export test for one non-Foundry destination.

Adventure Capsules pass the attention gate only if the buyer can name the
experience, intended audience, and immediate payoff without explanation and
then chooses it over making or buying a comparable one-shot. “Looks cool” is
not enough; record a purchase commitment, actual installation, or a scheduled
run date.

## Adaptive Drop-In Capsule buyer gate

The generic Adventure Capsule category failed the competitor-gap screen. The
only surviving candidate is a narrower offer for groups with variable
attendance:

> “When someone cannot make it, run a 60–120 minute side session with the
> players who are present, then return to the campaign without contaminating
> canon.”

Recruit GMs who run a persistent campaign at least monthly and ask for recent
events before showing the candidate:

1. In the last twelve months, how many sessions were cancelled, shortened, or
   changed because of attendance?
2. What did the group actually do: ghost a character, use a second world, run
   a one-shot, improvise, or reschedule?
3. How much preparation would the GM have needed to run a side session with
   the players who were present?
4. Would the GM trust a capsule that used current characters but wrote no
   lasting campaign state unless explicitly exported?
5. Which alternative would the GM choose after seeing the same 30-second
   scenario: cancel, free PDF, existing premium adventure, second world, or
   Adaptive Drop-In Capsule?
6. After the workflow, which one-time offer would the GM actually choose:
   $10, $15, $25, $35, or none?

Show the capsule with the main campaign hidden. Measure time from “player
absent” to a playable scene, player comprehension of the no-canon boundary,
number of setup corrections, and whether the GM schedules or commits to a
real run within 30 days. A positive reaction to the art or premise is not a
pass.

Reject the candidate if the recent incident is uncommon, if the GM prefers
ordinary cancellation/ghosting/second-world workflows, if the variable-party
promise requires manual rewriting, or if the product is only another
ready-made one-shot with a prettier launcher.

## Technical evidence boundary update

The exact local target stack is available and manifest-compatible with the
project target: Foundry 14.367, D&D5e 5.3.3, and the installed DiceBox module.
This is not live product evidence. The preflight was filesystem-only and
returned `BLOCKED` because the `ready` runtime probe, authority check,
document exercise, failure recovery, and authoritative read-back were not
run. Buyer tests must not be scheduled around claims that depend on those
operations until the disposable fixture receipt exists.

## Game Night Rescue front-door test

The eye-catching pass rejected Campaign Continuity / Safe Mode as a
storefront promise, but it produced one sharper message to test before
discarding the underlying assets:

> **Game Night Rescue — one player canceled. Don’t cancel the game.**

This is a message and product-format test, not a validated name. Show three
cards without explaining the implementation:

1. **Safe Mode:** “Protect the campaign before something goes wrong.”
2. **Campaign Continuity:** “Branch the session, compare what happened, and
   keep or discard it.”
3. **Game Night Rescue:** “Choose the players who made it, start a 60–120
   minute no-canon side session, and return cleanly to the campaign.”

For each card, show the same silent 10–20 second sequence: attendance change,
one-click launch, player-visible play, explicit no-canon state, and a clean
return card. Do not show settings, database screens, or implementation terms.
Ask before explaining anything:

- What problem does this solve?
- Who would use it, and when?
- What would you do instead tonight?
- Which card would you install before the next session?
- What one-time price would you actually pay: $10, $15, $25, $35, or none?
- Would you schedule a real test run within 30 days?

Use the same buyer cohorts already defined in this protocol. A provisional
pass requires at least 7 of 10 qualified GMs to identify the attendance
problem and payoff unaided, at least 5 to choose Game Night Rescue over their
named real alternative, at least 3 to select a non-zero price, and at least 2
to schedule a test run. These are screening thresholds for deciding whether
to build the next prototype, not evidence of market size or forecast revenue.

The comparison set must include cancelling, ghosting the absent character,
running a free PDF, buying an existing premium one-shot, and using
Omnipresence with a second Foundry world. Record the exact reason for the
choice. Reject the candidate if the product is described as “another
one-shot,” if the no-canon boundary is not trusted, or if buyers prefer their
current alternative at every tested price.

The prototype must also expose the promised proof in the first minute:

- present-player selection;
- supplied or current-character choice;
- clear no-canon status;
- one playable scene or interaction;
- explicit end/return action; and
- a player-safe recap/export that works without Foundry-specific IDs.

The current isolated Foundry fixture is process-ready and exact-stack
compatible, but this does not replace the buyer test or certify the capsule
workflow. The fixture evidence remains a separate technical gate.

## Payer-specific Game Night Rescue test

The current evidence does not support treating Game Night Rescue as a mass-
market home-game purchase. Home GMs often solve one absent player with a
quorum rule, a background character, a backup pilot, a reschedule, or a free
one-shot. The next test must therefore separate usability from willingness to
pay.

Recruit three groups:

- paid or professional GMs who sell recurring sessions;
- campaign organizers responsible for a rotating or West Marches table; and
- home GMs with a documented recent cancellation or changed session.

For every participant, record:

1. the most recent attendance disruption and how many people were affected;
2. prep hours, booking revenue, refunds, or player-retention cost at stake;
3. the actual workaround, including cancellation, rescheduling, Oronder,
   duplicate worlds, or manual character substitution;
4. whether the participant controls the Foundry purchase decision;
5. the price they would actually pay for one capsule, a pack, or a host
   license; and
6. whether they will run a supplied pilot within 30 days.

Use the same “one player canceled” hero sequence, but test two promises:

- home-game version: “Don’t cancel game night.”
- paid-host version: “Protect the booked session when attendance changes.”

Do not count compliments, hypothetical interest, or a request for a free copy
as a pass. The paid-host cohort passes only if at least three participants
describe a recent, financially meaningful disruption, two choose Game Night
Rescue over their real workaround at a stated non-zero price, and one books a
pilot or supplies a purchase commitment. The home-GM cohort can validate
comprehension and usability but cannot substitute for payer evidence.

Reject the candidate if the paid-host cohort prefers refunding or rescheduling,
if the saved value is smaller than the product price and setup cost, or if
existing Discord/world-sync tools already solve the operational problem. If it
passes, price and package it for the payer who benefits; do not dilute the
message into a general campaign assistant.

## Dungeon Master's Forge / Custom Item Workshop test

Test DMF as an end-to-end compiler rather than as a code generator. Use the
buyer-facing promise:

> **Make the homebrew item work, not just exist.**

Recruit ordinary Foundry D&D5e GMs, automation-heavy GMs using Midi-QOL/DAE/
Item Macro, and paid GMs or prep operators. Interview creators separately;
creator demand is supporting evidence only.

For each participant record the last custom item they tried to build, the
mechanic that caused trouble, the actual workaround, time spent, corrections,
module stack, and whether the item was ever used in a live session. Compare
DMF against native D&D5e forms, D&D Item Auto Maker, Item Creator, free
community macros, and asking for help in the Midi-QOL community.

Show a 30-second proof: request → native item preview → automation layer and
dependencies → unresolved-clause review → approval → disposable-scene use →
verification receipt. Do not lead with JSON or JavaScript.

Provisional pass:

- 8 of 12 qualified non-creator participants identify the problem and payoff
  unaided;
- 5 choose it over their named workaround;
- 3 choose a non-zero price;
- 2 install it and use a generated item in a real session within 30 days; and
- 3 automation-heavy participants accept the review/dependency boundary
  instead of requesting unrestricted script generation.

Reject the broad product claim if only creators pay, if simple-item users are
already satisfied by adjacent tools, if buyers hand-edit every result, or if a
supported item cannot produce fresh exact-stack proof. Test portability only at
the neutral recipe and review-receipt layer; a Midi-QOL hook is not cross-VTT
portable.

## DMF side-by-side Automaker test

Automaker establishes the baseline interaction: short description, direct Item
creation, history/retry, and export. Test DMF against that baseline using one
complex item that ordinary forms do not handle cleanly, such as conditional
damage, a failed-save rider, a reaction, or a charge-consuming effect.

Give each participant three paths:

1. native D&D5e or Automaker core item;
2. DMF core-only fallback; and
3. DMF with the verified Midi-QOL/DAE/Item Macro route.

Measure time to first usable Item, manual edits, module settings touched,
whether the behavior passes in a disposable scene, comprehension of warnings,
and the participant's actual non-zero price choice. The test fails to support
DMF as a separate product if the core-only path is sufficient for the target
item or if the automation path saves no meaningful setup time.

The monetization test must compare a one-time module price, a limited hosted
allowance, and a local/BYO option. A request for a free copy, praise for the
AI, or interest in the feature without installing and using the generated item
does not count as willingness to pay.

## DMF cross-VTT portability test

After the Foundry complex-item comparison, export the same item as a neutral
recipe and review receipt. Keep the recipe separate from the Foundry projection
and label every runtime capability as supported, unavailable, or unverified.
Then show a buyer the Foundry result plus a deliberately limited Roll20 or
Fantasy Grounds projection only if that adapter has authoritative support.

Measure:

- whether the buyer understands what transfers and what does not;
- whether the neutral recipe is useful outside Foundry without manual rewrite;
- which advanced behaviors are lost or downgraded;
- support questions caused by platform differences;
- whether portability changes the buyer's non-zero price choice; and
- whether the Foundry automation result remains the reason to buy.

The portability experiment fails if the product implies one universal compiled
item, silently drops a trigger or dependency, or spends more support effort on
secondary VTTs than the Foundry automation problem is worth. The first release
may export a high-quality recipe and receipt without shipping live Roll20 or
Fantasy Grounds writers.

## Foundry Upgrade Guardian buyer test

Treat Upgrade Guardian as a risk-reduction product, not as another backup
utility. Recruit ordinary Foundry GMs who own an active campaign, use at least
one non-core module, and have either postponed an upgrade or recovered from a
breakage incident. Include a smaller cohort of paid-content owners because
their cost of a failed upgrade is easier to quantify.

Run a controlled simulation using the participant's own module list or a safe
fixture. Show four alternatives:

1. do nothing and stay on the current version;
2. take Foundry's normal backup/snapshot and upgrade manually;
3. use an existing loadout/settings/compatibility tool; and
4. use Upgrade Guardian's scan → clone rehearsal → smoke test → receipt flow.

Measure the time to a confident decision, warnings correctly understood,
critical workflows selected, failures caught in the disposable clone, false
alarms, willingness to upgrade afterward, and the participant's real price
choice. The demo must never touch a live campaign.

Provisional pass criteria:

- 8 of 12 qualified GMs report a recent or imminent upgrade decision;
- 6 of 12 prefer the rehearsal report over their current workaround;
- 4 of 12 choose at least $15 in a blinded price test;
- 3 of 12 allow a scheduled pilot on a disposable copy; and
- no more than 2 of 12 interpret a green result as universal certification.

Reject the candidate if most users simply stay on the old version, Foundry's
built-in snapshot is sufficient, the clone cannot catch meaningful failures, or
the trust burden of false reassurance is greater than the saved troubleshooting
time.

## Campaign Runtime Locker alternative-choice test

Do not test a generic compatibility dashboard. Test the concrete local promise:
the GM selects a campaign and launches its known-good Foundry/runtime stack,
with an optional candidate upgrade rehearsal.

Compare four paths using the same multi-module world:

1. stay on the current version;
2. manually maintain portable Foundry installs and backups;
3. use a hosted service with version choice and snapshots; and
4. use Campaign Runtime Locker.

Record setup time, number of manual recovery steps, confidence before launch,
disk cost, failed or missing dependencies, whether the GM runs multiple worlds,
and a real price choice. Test a one-time $15, $25, and $35 offer against a
low-cost monthly hosting alternative; do not treat a request for a free tool as
purchase evidence.

The candidate passes only if self-hosters or multi-world GMs repeatedly choose
the local lock-and-launch workflow over waiting, manual installs, or hosting,
and if the product can restore the exact known-good stack without touching the
live world. Otherwise, retain the report/lockfile ideas as implementation assets
and reopen the search.

The technical prototype used in this test must be a closed-world, disposable
rehearsal. It may use a local companion to launch a second Foundry instance and
an optional probe module inside the rehearsal, but it must never migrate the
participant's live world in place. Record disk space, setup time, package
entitlement failures, external/module-owned state that could not be copied,
and every workflow that was not exercised.

## Session Health Autopsy buyer and feasibility test

Do not test a generic performance dashboard. Recruit GMs who can describe a
recent incident in which at least one player lost meaningful play time, saw
severe lag, could not load a scene, or could not join. Include one healthy
client and one affected or deliberately constrained client when the group can
provide them. Preserve the live campaign and do not disable modules in place.

Compare three paths using the same symptom:

1. the GM's normal troubleshooting and support-search workflow;
2. the existing point tools available for that world, including performance
   monitoring, per-player optimization, or module bisection; and
3. a guided Session Health Autopsy capture that correlates client and world
   signals, produces a ranked hypothesis list, and applies only a reversible
   profile change.

Measure minutes of play lost, time to first useful diagnosis, affected-client
coverage, false leads, whether the suspected cause was reproducible, whether
the remediation helped without harming healthy players, recurrence on a later
scene, privacy comprehension, and the GM's non-zero price choice. A request
for a free FPS meter or praise for a report does not count as willingness to
pay.

The candidate passes the market gate only if affected GMs repeatedly prefer
the guided workflow over their existing workaround, can explain why the
recommendation is trustworthy, use it during a real or scheduled session,
and choose a real price. It fails if the report merely restates FPS, the GM
still has to perform module-halving manually, the profile change is unsafe or
too broad, or the buyer would simply ask each player to lower settings.

The technical fixture must be local and privacy-preserving. Record only
consented metrics and structural identifiers needed for diagnosis; do not
upload raw chat, campaign text, premium content, or player identity beyond
the minimum needed to correlate a session. Every result must distinguish
observed, correlated, suspected, not-tested, and remediated states. A green
receipt is not a compatibility or performance guarantee.

## Low-bandwidth player relay buyer and feasibility test

Do not test another full mobile character sheet or native app. Recruit a real
group with at least one weak, old, mobile, or unsupported client and compare:

1. the group's current workaround, such as screen sharing, changing VTTs, or
   asking the player to spectate;
2. one available companion product such as Sheet Only, Swipe/Tabletop Helpers,
   PocketScroll, or another product the group would realistically use; and
3. a minimal browser relay that avoids full-canvas rendering and exposes only
   the current character actions, rolls, chat, turn state, and lightweight
   position/map information.

Measure successful join rate, time to first useful player action, bandwidth and
device resource use, map/position comprehension, action and permission
errors, setup steps, support burden, and the GM's non-zero price choice. The
relay fails if it needs a native install or account for every player, merely
repackages a full Foundry client, or does not materially improve the weak
device's ability to participate.

Any cross-VTT experiment must keep a neutral player-action packet separate from
runtime adapters. Do not imply that a Foundry action, permission, effect, or
inventory write transfers unchanged to Roll20 or another VTT. The first test
is Foundry-only and may collect only the minimum consented session data.

## Thin Client Player Relay payer and device test

The payer test must use a real hybrid or low-device group, not a feature survey.
Compare:

1. the group's current workaround, such as laptops for everyone, screen
   sharing, spectating, or switching VTTs;
2. an available full companion such as VTT Companion or PocketScroll; and
3. the proposed no-install thin client that avoids full-canvas rendering.

Test a one-time GM-paid offer at €15, €20, and €25. Record the price selected,
the reason for rejection, and whether the GM would schedule another session
using it. Do not count a player saying “I would use this” unless the GM or
table actually installs, connects, and performs a useful action.

The technical fixture must measure successful join, time to first useful action,
bandwidth, battery or CPU pressure, map/position comprehension, roll and
permission fidelity, MIDI-QOL or native Activity behavior where applicable,
and table distraction. The relay fails if it is merely a smaller character
sheet, requires a native app or account for every player, cannot serve a weak
device, or cannot preserve Foundry authority and verified result handling.

## Thin Client Player Relay technical gate

The market test must not be run against a mock that quietly assumes the hard
parts. Before asking buyers for a price choice, use a disposable Foundry
14.367 / D&D5e 5.3.3 fixture to prove the smallest safe loop:

1. a player joins through the proposed no-install browser surface;
2. the module projects only state permitted to that Foundry user;
3. the player submits one typed request rather than an arbitrary document patch;
4. Foundry or the active GM performs the authoritative action;
5. the relay returns a verified result receipt;
6. reconnect, timeout, and duplicate requests fail safely and remain legible.

The fixture must record whether the client is actually served by the local
Foundry instance, whether any cloud account or external control plane is
required, and which documented public APIs are used. It must measure weak
device CPU/battery/bandwidth pressure and test one native Activity plus one
optional Midi-QOL path only when those capabilities are present. An unavailable
or unsupported capability is a valid result; silently falling back to direct
player writes is not.

Do not distribute rules text, premium content, protected art, or a hosted copy
of the campaign. Treat cross-VTT support as a later neutral packet/export
experiment until a separate adapter proves its own permission and action
boundary. Static API documentation is evidence for a prototype shape, not
live readiness or buyer validation.

## Player Flow / Tabletop Ease Mode task and price test

Compare three experiences with the same novice, returning, mature, or
accessibility-constrained player tasks:

1. ordinary Foundry with the group's current configuration;
2. the group's current training/workaround or an existing HUD such as Foundry
   Navigator or Stylish Action HUD; and
3. a minimal per-player cockpit that shows only the current task and the next
   useful action.

Use tasks such as opening the character's useful action, targeting correctly,
rolling an attack or check, spending a resource, handling a condition, and
finding the result. Measure time to first correct action, completion rate,
GM interventions, onboarding time, repeated mistakes, accessibility success,
and whether the player can repeat the task without coaching.

The product fails if it adds another permanent interface, duplicates actions
in confusing places, hides necessary information, or performs no better than
simple training or switching to a simpler VTT. If it passes the task trial,
ask the GM—not only the player—to choose a real non-zero one-time price and
state whether they would install it for the next campaign session. Treat
player enthusiasm without GM purchase authority as adoption evidence, not
payment evidence.

This candidate is currently rejected as a standalone product. Reopen the test
only if the cockpit is bundled with a stronger paid surface, such as a
low-bandwidth relay or a complete tutorial/content experience; then measure
the bundle rather than attributing payment to onboarding alone.

## Monster Field Guide / Creature Codex buyer and feasibility test

This is the fresh-search candidate after Dungeon Master's Forge was
backburnered. Treat it as a hypothesis, not a validated product. The payer is
the GM; the player is the beneficiary. Recruit 10–12 GMs who have recently
run a mystery, horror, monster-hunt, repeated-creature, or metagaming-sensitive
encounter. Exclude people who have only seen a mockup and cannot name a recent
incident.

Compare three workflows using the same synthetic creature and the same short
scenario:

1. the GM's current workaround, such as memory, a secret journal, a reveal
   macro, or a manual player note;
2. the 2024 Study action or an existing system/module feature where the GM
   already has it; and
3. the candidate flow: unknown silhouette or alias, Study/evidence check,
   GM-approved tiered reveal, and a persistent per-player codex entry.

The comparison must include the direct competitor explicitly. Where the
target world can safely load it, test ANewFoe's current available release as a
fourth workflow; otherwise use its documented feature surface as the control
and mark the runtime comparison unavailable. Do not assume that “newer v14
support” is enough to win. Record which concrete job the candidate performs
better: evidence capture, per-player provenance, tiered reveal, persistence,
uncertainty, visual clarity, or Study integration.

The first demonstration must be silent and short—roughly 20–30 seconds—and
must show the player-visible change rather than a settings screen. Measure time
to the first useful fact, GM interventions, incorrect or over-revealed facts,
setup time, whether the player understands why the fact was revealed, whether
the group uses the codex again, and whether the GM would run a scheduled pilot.

After the task, ask the GM to choose one real one-time price: $5, $10, $15,
$20, or no purchase. Record the alternative they would otherwise use and why
the candidate wins or loses. A player preference without GM payment authority
is adoption evidence only. A stated price without a scheduled pilot is weaker
than a real install and session commitment.

Use these provisional pass gates:

- at least 7 of 10 qualified GMs recognize a recent problem and understand the
  payoff without a long explanation;
- at least 5 prefer the candidate over their actual workaround for the test
  scenario;
- at least 3 choose a non-zero price;
- at least 2 schedule or complete a pilot with a real group; and
- the disposable fixture produces no hidden-knowledge leak, duplicate reveal,
  stale per-player state, or unauthorized write.

Fail or reopen the search if the feature is perceived as extra bookkeeping,
the GM still has to maintain parallel notes, the field guide becomes a generic
statblock viewer, the buyer prefers a free journal/macro, or the rights-safe
content boundary makes the demo uninteresting. Do not ship bundled Monster
Manual text, protected art, or an unlicensed lore database. The portable layer
should be a neutral knowledge packet; live permissions, checks, cards, and
document reads require separate VTT/system adapters.

The direct-competition gate is also a failure if ANewFoe or an equivalent
manual workflow is “good enough” and no buyer can name a repeated cost of the
missing evidence/provenance layer. A maintenance gap alone is not a product
market; the candidate must produce a better table outcome for a real GM.

The technical fixture must use synthetic actors and a disposable Foundry
14.367 / D&D5e 5.3.3 world. It should test unknown-state projection, one
Study/equivalent check, GM approval, tiered reveal, per-player persistence,
reconnect, duplicate suppression, permission denial, and authoritative
read-back. If the exact D&D5e Activity or hook surface is not available, record
that as an unavailable capability and test a bounded GM-mediated fallback; do
not silently write directly from the player client.

### World Doctor payer, price, and alternative-choice pass

Treat the World Doctor / Campaign Health idea as a conditional GM/host utility,
not as a validated market. Recruit GMs who can name a recent upgrade, broken
reference, orphaned content, duplicate asset, load, or malformed-document
incident. Exclude respondents who only agree that “large worlds are messy” but
cannot name a concrete cost.

Use the same disposable synthetic world for four comparisons:

1. the GM's current workaround: backup/restore, manual search, Discord help,
   CLI cleanup, or leaving the defect alone;
2. Foundry's built-in backup, snapshot, package, and migration workflow;
3. the relevant current point tool, such as Content Backup & Restore, Lore
   Reference Board, Dedupe This!, or fvtt-world-tools; and
4. World Doctor: read-only scan, evidence-linked finding, repair preview,
   snapshot, narrow fix, authoritative reread, and recovery receipt.

The 20–30 second demo should show “update risk found → affected object
explained → repair preview → verified green result.” Measure diagnosis time,
false positives, whether the finding is actionable, repair and rollback
success, trust, and whether the report is useful before the next session.
Record the buyer's actual alternative, the minutes or cancelled session the
incident cost, and whether the buyer controls the world and update decision.

Ask each qualified GM to choose one real one-time price: **$15, $25, $39, or
no purchase**. The anchors are deliberately narrower than a broad survey's
price ladder and are not evidence until a buyer chooses one and agrees to a
pilot. Also ask whether the buyer would prefer a subscription; current
directional community evidence suggests testing buy-once/flat support first.

Pass gates remain:

- 7/10 recognize a concrete incident and understand the payoff without an
  architecture explanation;
- 5/10 prefer the evidence-linked workflow over their actual workaround;
- 3/10 choose a non-zero price;
- 2/10 schedule or complete a disposable-copy pilot; and
- the fixture produces no false green, hidden write, unauthorized campaign
  mutation, or unrecoverable repair.

Reject or reopen the search if the product is only a prettier backup, generic
compatibility dashboard, duplicate finder, or warning list that leaves the GM
to diagnose the problem manually. Do not infer player willingness to pay: the
buyer is the GM/host, while uninterrupted play is the player benefit.

## World Doctor / Campaign Health buyer and feasibility test

This is the newest fresh-search candidate after Dungeon Master's Forge was
backburnered. The payer is the GM/host, not an individual player. Recruit GMs
who can name a recent broken-link, duplicate/orphaned-content, asset-path,
world-load, or upgrade incident. Do not count agreement that “large Foundry
worlds are messy” without a concrete recent cost.

Compare four workflows against the same synthetic defects:

1. the GM's current workaround: backup/restore, manual search, Discord help,
   CLI cleanup, or simply leaving the defect alone;
2. Foundry's built-in backup and package compatibility/migration guidance;
3. the relevant current point tool, such as Sephral's Content Backup &
   Restore, Lore Reference Board, Dedupe This!, or fvtt-world-tools; and
4. World Doctor: read-only scan, evidence-linked diagnosis, repair preview,
   snapshot, narrow fix, authoritative reread, and recovery receipt.

The silent 20–30 second demo should show “update risk found → affected object
explained → repair preview → verified green result.” Measure time to first
useful diagnosis, false positives, warnings a GM can act on, repair success,
rollback success, time saved, whether the GM trusts the result, and whether the
report is useful before the next scheduled session.

Ask the GM to choose one actual one-time price: $5, $10, $15, $20, $25, or no
purchase. Record whether the buyer controls the world, what the incident cost
in minutes or a cancelled session, which existing substitute they prefer, and
whether they will run the tool on a disposable copy or next campaign update.
The product must not claim broad player willingness to pay; the buyer is the
GM/host and the player benefit is uninterrupted play.

Provisional pass gates:

- at least 7 of 10 qualified GMs recognize a recent incident and understand
  the payoff without architecture explanation;
- at least 5 prefer the evidence-linked workflow over their real workaround;
- at least 3 choose a non-zero price;
- at least 2 schedule or complete a pilot on a disposable copy; and
- no false “green” result, hidden repair, unauthorized campaign write, or
  unrecoverable repair occurs in the fixture.

Reject or reopen the search if World Doctor is only a prettier backup, a
generic compatibility dashboard, a duplicate finder, or a list of warnings the
GM still has to diagnose manually. The fixture must contain synthetic broken
UUIDs/file paths, orphaned token references, duplicate documents/assets, a
missing dependency, and one invalid document shape; it must prove snapshot,
preview, repair, authoritative reread, rollback, and no-write behavior against
the exact Foundry 14.367 / D&D5e 5.3.3 target. Cross-VTT support begins with a
neutral report/receipt format; live repairs require separate adapters.

## Battle Director / Adaptive Encounter Audio buyer and feasibility test

Treat Battle Director as a fresh challenger, not a selected product. The payer
is the GM/host; the player benefit is a more dramatic session without the GM
manually changing audio during combat. Recruit GMs who already use music or
sound effects and can name a recent moment when they stopped narrating or
managing combat to change the soundtrack.

Run one short synthetic encounter in three workflows:

1. the GM's current manual workflow;
2. current point tools such as Minstrel, Combat Music Master, Dynamic
   Soundscapes, Soundscape Adventure, or Playlist Plus, where the GM has them;
3. Battle Director: a declarative event graph with exploration, combat start,
   pre-combat sting, boss phase, HP threshold, actor turn, victory, cooldown,
   weighted selection, crossfade/ducking, and an explicit emergency stop.

Use only synthetic or buyer-owned audio. The 10–20 second demo should make the
result obvious: exploration → initiative → escalation → boss phase → victory,
with the GM's hands staying on the game. Measure setup time, manual clicks,
missed or duplicate triggers, transition latency, audio annoyance, player
reaction, recovery after a manual state correction, and whether the GM would
use the same rule graph again next session.

Ask the GM to choose one actual one-time price: **$15, $25, $39, or no
purchase**, and separately record whether a subscription would be rejected. A
non-zero choice without a scheduled pilot is weak evidence; require a real
install or disposable-world run.

Provisional pass gates:

- 7/10 qualified GMs recognize the no-touch payoff without a technical
  explanation;
- 5/10 prefer the state graph over their real workflow or current point tool;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a pilot; and
- the Foundry fixture produces correct, non-duplicated, bounded transitions,
  survives reconnect/state correction, and never traps the GM in audio they
  cannot stop.

Reject or reopen the search if Minstrel plus a current combat module is good
enough, if the candidate becomes a more complicated playlist editor, if the
GM must babysit it more than the current workflow, if system-specific hooks
make the core unreliable, or if it depends on bundled copyrighted audio. The
portable artifact is a neutral event graph and customer-owned asset mapping;
live combat and actor/HP events require VTT/system adapters.

### Battle Director technical adversarial gate

Static API availability is not runtime certification. The first disposable
fixture must use Foundry 14.367 / D&D5e 5.3.3 and two clients, with synthetic
customer-owned audio only. It must record a redacted receipt for:

- combat start and end;
- round and turn changes;
- one D&D5e `system.attributes.hp.value` threshold;
- one actor/condition or region trigger;
- duplicate delivery of the same hook;
- active-GM authority and handoff;
- reconnect and authoritative state resynchronization;
- crossfade, stop, and emergency stop; and
- one resulting transition per event fingerprint on every client.

The fixture must prove that only the elected GM evaluates and commits the
transition, clients do not double-play, a stale event cannot rewind the state,
and the GM can always stop audio. It must not mutate a real campaign or depend
on a bundled music library.

For portability, compile the same neutral event graph into a Foundry adapter
and a Roll20 adapter design. Mark HP, combat, turn, and playback mappings as
adapter-specific; do not claim parity for Owlbear Rodeo or Fantasy Grounds
until their live extension surfaces are separately observed.

### Battle Director direct-competition correction

The buyer workflow must include the current point tools, not just a manual
playlist baseline: Combat Music Master, Video Game Music, Soundscape Adventure,
and Minstrel. Their published surfaces already cover enough HP/resource,
combat, token, turn, priority, mood, intensity, crossfade, and region/scene
behavior that a new state graph may be an implementation convenience rather
than a paid problem.

Do not count an abandoned module as demand. Maintenance complaints and requests
for adaptive audio are useful recruiting signals, but they do not establish
willingness to pay or a gap that a new product can own.

Only keep this candidate alive if at least 5 of 10 qualified GMs prefer the
state-graph workflow over their current combination, at least 3 choose a
non-zero one-time price, at least 2 agree to a disposable-world pilot, and the
comparison identifies a repeated unmet cost that the current modules do not
solve. Otherwise close Battle Director and continue the fresh search. The
research goal remains broad marketability for ordinary Foundry customers, not
an audio authoring tool for a narrow power-user segment.

### Scene Interaction Studio adversarial correction

Before recruiting buyers for this candidate, include Glyph in the control
workflow. Glyph already presents a visual program editor, event picker, action
picker, system-aware rolls, and MATT import for Foundry v14. Core Scene Regions
and Monk's Active Tile Triggers also cover much of the underlying behavior.

Do not count a GM saying “I want Active Tiles to be simpler” as sufficient
evidence for a new product when a current visual editor may satisfy that need.
Only reopen this candidate if a qualified GM identifies a repeated failure in
Glyph/MATT/Regions, prefers a materially different workflow, chooses a
non-zero price, and agrees to a pilot. Otherwise continue the fresh search
outside visual scene automation.

## Fresh search: Scene Interaction Studio

This is a provisional challenger, not a selected product. The payer is the GM
who wants interactive scenes but does not want to learn macros, UUIDs, Active
Tile action chains, or several dependency modules. The player-facing payoff is
immediate and demonstrable: a door, trap, teleport, reveal, sound, prompt, or
small puzzle reacts correctly when the player enters or clicks the scene.

Compare four workflows with the same disposable encounter:

1. the GM's current manual or macro workflow;
2. Monk's Active Tile Triggers plus the GM's normal dependencies;
3. native Foundry Scene Regions and their configured behaviors; and
4. Scene Interaction Studio using visual templates and a guided test mode.

Measure time to build a door, trap, teleport, reveal, and conditional puzzle;
number of configuration errors; dependency count; ability to preview and undo;
runtime correctness for GM and player; and whether the GM would reuse the
recipe next session. Ask for a one-time price of $10, $20, $30, or no purchase.

Provisional pass gates:

- 7/10 qualified GMs recognize a recent scene-setup frustration;
- 5/10 prefer the guided workflow over their real Active Tile/Region process;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a disposable-world pilot; and
- no hidden macro, unresolved UUID, unsafe world mutation, or untestable
  dependency is required for the core demo.

Reject or reopen the search if buyers only want a handful of free templates,
if experienced MATT users see no setup savings, or if the product becomes a
creator-oriented visual scripting suite. The portable artifact should be a
neutral interaction recipe; live token, door, region, chat, and system actions
remain adapter-specific.

## Fresh challenger: Session Ready

This candidate targets GMs who lose live session time to mixed client hardware,
large scene/audio downloads, black screens, or a player who silently failed to
finish loading. It is not a performance benchmark, preload button, or module
conflict report by itself. The product promise is: “Know who is ready, make the
next scene safe for the weakest client, and never activate into a silent
stall.”

Compare four workflows with the same disposable two- or four-client fixture:

1. Foundry core plus manual preload and troubleshooting;
2. Preload Tracker;
3. Performance Optimizer plus Axon's Performance Monitor; and
4. Session Ready: readiness ledger, scene/audio preflight, quorum gate,
   profile recommendation, stale-client warning, fallback profile, and a
   controlled activation receipt.

Inject a slow client, an oversized scene, a failed preload, a temporary socket
freeze, and a low-FPS client. Measure time lost, false green/false red states,
setup burden, whether players understand the fallback, and whether the GM
would use the gate every session. Ask for $15, $25, $39, or no purchase, plus a
real disposable-world pilot.

Provisional pass gates:

- 7/10 qualified remote or hybrid GMs recognize a recent incident;
- 5/10 prefer the end-to-end readiness workflow over their current tools;
- 3/10 choose a non-zero one-time price;
- 2/10 complete or schedule a mixed-client pilot; and
- the fixture never reports green before the required assets are ready, never
  traps the table behind one client without an override, and records a clear
  fallback/timeout result.

Reject or reopen the search if the point modules already satisfy the need, if
the product cannot reliably observe real client readiness, or if the buyer
sees it as a diagnostic screen used once rather than a repeated session tool.

## Session Ready competition correction

Do not recruit a buyer sample for a generic end-to-end readiness gate until the
comparison includes Preload Tracker 2.2.0's actual load-time report, 100%
activation gate, stuck-at-100% handling, and scene-audio skip option. Include
Performance Optimizer's per-player profiles/low-FPS guidance and Axon's group
diagnostics/crash history as the control workflow. Reopen only if a GM names a
repeated failure that this combination cannot observe or recover from and then
chooses a non-zero price plus a pilot.

## Tactical Memory buyer-choice trial

Recruit GMs who have recently run stealth, pursuit, split-party, or dungeon
encounters in Foundry. Use one disposable encounter with an enemy seen, hidden
behind a wall, moved by the GM, and later revealed. Compare:

1. Foundry core fog with no token memory;
2. Shared Token Visibility or the GM's current visibility module;
3. a manual marker dropped by the GM; and
4. Tactical Memory with per-player or party-shared last-seen ghosts and decay.

Measure whether players understand the ghost as historical rather than current,
whether the GM can correct or clear it, whether any hidden identity/position is
leaked, visual clutter, reconnect behavior, and whether the feature is reused
in the next encounter. Ask each qualified GM to choose **$5, $10, $15, or no
purchase**, and separately ask whether they would schedule a disposable-world
pilot.

Provisional pass gates:

- 7/10 qualified GMs report a recent last-seen continuity problem;
- 5/10 prefer Tactical Memory over core fog, current visibility tools, or manual
  markers;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a pilot; and
- the fixture proves observer scoping, no hidden-token leakage, deterministic
  expiry, reconnect convergence, manual correction, and no persistent campaign
  mutation outside the feature's own reversible overlay state.

Reject or narrow the candidate if buyers call it a novelty, prefer ordinary
markers, only want a free setting, or cannot distinguish a historical ghost
from a currently visible enemy. A later Roll20/Owlbear portability pass must
map only the neutral observation ledger; do not claim cross-VTT parity from a
Foundry-only proof.

### Tactical Memory adversarial control update

Include Battle Replay, Group Tokens/movement history, Movement Approval, and
Shared Token Visibility in the control audit so a buyer is not shown a ghost
that only duplicates replay, path history, prospective movement, or current
party token sharing. The paid test must use live two-player observation of a
hidden enemy and ask whether the historical overlay changes decisions during
play. Treat a positive reaction to the visual effect as insufficient unless
the GM chooses a non-zero price and agrees to a real disposable-world pilot.

### Tactical Memory pricing and technical control update

Include the current paid visibility/session-control products Player Perspective
and Stage Master in the buyer comparison. They establish that some GMs pay for
visibility and presentation control, but they are not proof that a last-seen
ghost is valuable. Show Tactical Memory as a separate option and ask for an
actual one-time price of **$5, $10, $15, or no purchase** rather than using
Patreon or premium-module existence as a proxy.

The technical trial must exercise the player-local boundary before any shared
memory mode. On two player clients and one GM client, record an observation only
after the observing client reports the token visible through its current
visibility test; then move the enemy behind a wall and verify that only the
historical marker remains. Assert that no player receives the enemy's current
hidden position, actor data, or GM-only state. Repeat after visibility refresh,
reconnect, expiry, and GM correction. Party sharing is a later experiment, not
part of the first safety claim.

### Wide-marketability control

Before treating a Tactical Memory result as product-market evidence, keep the
following alternatives visible in the recruiting script: Player Perspective or
Stage Master for player-view control, SessionFlow or Whiteboard Experience for
shared scene state, a current mobile companion, and the GM's existing Bastion
module. Also record whether the GM instead wants a zero-prep generator or a
general state panel. This prevents a visually compelling ghost from winning
only because the controls were omitted.

The scorecard is a prioritization aid, not validation. Tactical Memory may lead
on direct gap and demo clarity, but it is weaker on buyer breadth and has the
highest privacy/runtime risk. A candidate passes only through a real price
choice, a pilot commitment, and a deterministic two-player fixture; upvotes,
feature requests, and category-level premium products do not satisfy those
gates.

### Zero-prep encounter control

Show the buyer a zero-prep encounter-board alternative during recruitment, but
do not pitch it as a new product by default. Dungeon Draw, Quickdraw, and
SessionFlow are the control set. Only reopen this direction if a qualified GM
names a repeated failure that all three leave unresolved—especially a failure
around temporary cleanup, one-click token placement, or safe no-world-mutation
play—and then chooses a non-zero price and pilot.

## Tactical Memory rights and portability gate

Do not treat license cleanliness as market validation. For the first slice,
show only original procedural/local presentation: an observer-scoped ghost or
silhouette rendered from data already visible to that player. Do not bundle
third-party art, music, token packs, publisher text, or cloud infrastructure.
Verify that the module manifest carries an explicit license and that the
release contains no copied D&D/WotC assets or rules text.

For portability, define the neutral observation record as:

- observer scope;
- VTT/scene binding;
- observed token binding;
- observed x/y/elevation;
- round or timestamp;
- uncertainty/status; and
- expiry/correction metadata.

Prove Foundry first. Treat Roll20 and Owlbear as separate adapter studies with
their own event, storage, visibility, and permission tests; do not claim that a
portable ledger means portable runtime behavior. The cross-VTT gate is met
only when one additional VTT can record an already-observed position without
revealing current hidden state and can converge after expiry/reconnect.

## TableSpeak / Live Table Translation buyer gate

Recruit table organizers from mixed-language or bilingual online groups where
at least two people have recently missed or delayed live table communication
because of language. Do not recruit from translation enthusiasts alone. Ask
the organizer to compare:

1. the current VTT and voice/chat setup;
2. Polyglot or fictional-language tools;
3. manual copy/paste or external Discord/desktop translation;
4. TableSpeak typed-chat translation with each player's preferred language;
5. TableSpeak plus optional caption output.

The first fixture should translate short typed messages in both directions,
preserve the source message, keep whispers scoped, show a provider failure or
untranslated fallback clearly, and measure latency, terminology errors, and
whether players still understand rolls, names, links, and rules terms. No
voice capture belongs in the first safety or pricing claim.

Ask the table owner for **$5, $10, $15, or no purchase** for a one-time BYOK
or local module, and separately ask whether they would run it for three real
sessions. Test a hosted-service alternative only as a separate price because
translation usage, provider terms, and privacy are different products.

Provisional pass gates:

- 7/10 qualified tables report a repeated live-language problem;
- 5/10 prefer TableSpeak typed chat over their current workaround;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- no fixture leaks whispers or source text to the wrong user, and every
  provider failure falls back visibly without silently inventing a translation.

Reject or narrow the candidate if the organizer only wants a translated UI,
external tools are good enough, latency interrupts play, rules terminology is
not trusted, or no one will pay for the typed-chat slice. Treat live voice
translation as a later experiment, not part of the initial market claim.

Run the economic test separately for:

- one-time BYOK/local module at $5, $10, $15, or no purchase; and
- hosted translation with an explicit monthly or usage-limited price.

Do not combine those offers in one yes/no question. Record whether the table
owner understands API-key setup, accepts provider data handling, prefers a
local model with lower language coverage, and would tolerate a hard usage cap.

### TableSpeak external-substitute control

Before counting a TableSpeak buyer, show the organizer current Discord
translation apps and desktop voice translators. TableSpeak must preserve
VTT-specific semantics that those tools cannot: roll cards, document links,
whispers, speaker/token identity, and per-user rendering without a noisy copy
of every translation in the shared chat. If the organizer only wants language
conversion and is satisfied with Discord, mark the candidate as no-purchase.

### Guided progression control

When recruiting players who describe Foundry as confusing, include current
D&D5e Character Builder/Hero Mancer and PF2e Level-Up Wizard/Leveler as the
control. A new candidate cannot claim the general problem of “leveling is
hard” unless it identifies a repeated failure those packages do not address
and earns a non-zero price plus a pilot.

### Evidence Locker / Session Gallery buyer gate

Recruit GMs who have recently shown multiple images, letters, maps, portraits,
item cards, or investigation clues and then had players ask to see them again.
Require a recent incident, not a general preference for campaign organization.
Compare:

1. the GM's current native Foundry journal/ownership workflow;
2. a pinned Discord file or external gallery;
3. LoreBox or another separate handout-delivery tool;
4. Foundry's current Show & Tell, Handout Ping Viewer, and Investigation Board
   controls; and
5. Evidence Locker with automatic receipts for only the players who were
   authorized to receive each artifact.

The fixture must include a public reveal, a whisper or player-specific reveal,
an image from a journal, a linked item or roll card, a late-joining player, a
revoked/retracted clue, and a reconnect. Verify that a player cannot discover
the existence or URL of an unauthorized artifact, that a receipt reopens the
current permitted document rather than a stale unsafe copy, and that the GM
can clear an accidental reveal.

Ask the GM to choose **$5, $10, $15, or no purchase** for a one-time module and
separately ask whether they would run it for three real sessions. Do not count
interest in a pretty gallery as payment evidence.

Provisional pass gates:

- 7/10 qualified GMs report a recent repeated “what was that handout?” failure;
- 5/10 prefer automatic Foundry-native receipts over their current workflow or
  a separate gallery;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- the fixture proves per-player scope, revoke behavior, reconnect convergence,
  linked-document safety, and no accidental GM-file exposure.

Reject or narrow the candidate if buyers only want a manual folder, LoreBox is
good enough, the group rarely revisits visual artifacts, automatic capture is
seen as spoiler-prone, or no one will pay for the Foundry-semantic wedge. A
Roll20/Owlbear portability pass must begin only after the Foundry receipt and
permission behavior is proven; a neutral artifact receipt is not runtime
parity.

### Tactical Sketchbook / Collaborative Map Ink buyer gate

Recruit GMs who draw, annotate, or improvise maps during at least three real
sessions per month. Prioritize theatre-of-the-mind, hexcrawl, investigation,
touchscreen, TV-table, and hybrid groups. Exclude GMs who only import finished
battlemaps; they are a useful negative control. Require a recent incident such
as losing time to the native drawing UI, abandoning a live annotation, or
using a separate whiteboard because scene drawings were too slow or cluttered.

Compare the same 30-second task using:

1. Foundry core drawings;
2. Precise Drawing Tools, Advanced Drawing Tools, Dungeon Draw, and Quickdraw;
3. Gambit's premium drawing direction if available to the participant;
4. Miro, Excalidraw, a screenshot editor, or the participant's current manual
   workaround; and
5. Tactical Sketchbook with a floating brush palette, touch/pen input,
   temporary/private/party layers, undo/snapshot, and native export.

The fixture should begin with a blank or imported scene and require the GM to
draw a route, circle an area, place two labels, switch one mark to GM-only,
show a temporary mark to players, undo it, save a clean layer, and reconnect a
second client. Verify that temporary marks do not leak across permissions,
private notes are never visible to players, saved layers survive reload, and
export does not create external-service dependency or alter the source scene
until the GM confirms it.

Ask the GM to choose **$10, $20, $30, or no purchase** for a one-time module
and separately ask whether they would run it in three real sessions. Do not
count “I would like better drawing tools” as a purchase signal.

Provisional pass gates:

- 7/10 qualified GMs report a recent live annotation or drawing-workflow
  failure;
- 5/10 prefer Tactical Sketchbook over their current workaround and the named
  current modules;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- the fixture proves private/party/GM scope, undo and snapshot correctness,
  reconnect convergence, and no unintended source-scene mutation.

Reject or narrow the candidate if participants only want a free core fix,
already prefer Gambit/Precise/Dungeon Draw, rarely draw during play, or find a
second window faster. Start Roll20 and Owlbear adapter work only after the
Foundry workflow passes; test a neutral annotation record, not equivalent
editor behavior.

### Adventure Navigator / GM Searchlight buyer gate

Recruit GMs who run a journal-heavy imported adventure, campaign conversion,
or large homebrew at least monthly and who recently lost session time looking
for a passage, NPC, map, clue, or procedure. Exclude GMs who mostly improvise
without stored adventure content; they are a useful negative control. Ask for
the most recent incident and record minutes lost, what was searched, and which
tool or manual workaround was used.

Compare the same live task using:

1. Foundry core journal/compendium search;
2. Search and Highlight, Simple SearchBar, Quick Insert, or the buyer's
   current search module;
3. Campaign Codex or World & Campaign Builder where applicable;
4. a PDF/book search, manual bookmarks, or an external notes system; and
5. Adventure Navigator with a local index, current-scene/location context,
   evidence-linked results, and a short dismissible runbook.

The fixture should contain an imported-adventure-shaped but synthetic world:
three journal entries with multiple pages, two actors, two scenes, map notes,
cross-links, a player-visible clue, and a GM-only secret. Select a scene or
location and ask the GM to find the relevant read-aloud passage, NPC, map, and
next action. Verify exact source opening, ranked evidence, no player-secret
leak, no copied publisher text in a new document, deterministic reindexing,
stale-link reporting, and behavior after a reconnect or source edit.

Ask the GM to choose **$15, $25, $39, or no purchase** for a one-time local
module and separately ask whether they would run it for three real sessions.
Do not count a preference for faster search as payment evidence if the buyer
would keep the free tool.

Provisional pass gates:

- 7/10 qualified GMs report a recent session-time loss from finding stored
  adventure content;
- 5/10 prefer the contextual runbook over their current free or paid tools;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- the fixture proves source-link accuracy, permission safety, local-only
  indexing, reindex determinism, and stale-link visibility.

Reject or narrow the candidate if buyers only need global text search,
Campaign Codex or World & Campaign Builder is good enough, an AI copilot is
preferred despite its trust/privacy tradeoff, or no one will pay after seeing
the time-saved demonstration. Begin a Roll20 or Owlbear adapter only after the
Foundry fixture and buyer gates pass.

### Rapid Encounter Board / Live Scene Staging buyer gate

Recruit GMs who create an unplanned encounter scene at least monthly, run
hexcrawls or investigations, or regularly turn a reference image into a
playable scene while players are waiting. Exclude map-making hobbyists who
enjoy long prep and GMs who only import finished maps; they are useful
negative controls. Ask for the most recent live staging failure and record
minutes lost, asset friction, layer/object-type confusion, and whether the GM
used a separate map editor or delayed the encounter.

Compare one identical improvised encounter using:

1. the GM's current native Foundry workflow;
2. MapForge, if the buyer can access it;
3. FA Nexus, Moulinette, Mass Import, Scene Express, or the buyer's existing
   Dungeondraft/external workflow where applicable; and
4. Rapid Encounter Board with a background or blank grid, user-owned assets,
   limited temporary walls/lights/labels/tokens, private/party/GM layers,
   player-safe reveal, discard, and promotion to a native scene.

The task is timed from “we need a playable scene” to “players can act.” Record
time-to-ready, number of clicks, asset-load/performance problems, wrong-layer
or wrong-object errors, cleanup time, player-scope correctness, and whether
the GM would use the workflow during a real session. Test discard and promote
separately so a temporary board cannot mutate the wrong native scene.

The MapForge comparison is mandatory because it is already a commercial
Foundry map studio with Patreon access and direct buyer feedback. Do not count
MapForge users as evidence for a new product unless they can name an unresolved
problem that Rapid Encounter Board solves better. Test whether buyers prefer a
one-time utility or no-subscription offer, but do not assume subscription
fatigue alone creates a gap.

Ask the GM to choose **$15, $25, $39, or no purchase** for a one-time module
and separately ask whether they would run it in three real sessions. Do not
count “that looks cool” or “I would try it” as payment evidence.

Provisional pass gates:

- 7/10 qualified GMs report a recent live scene-staging failure;
- 5/10 prefer Rapid Encounter Board over their current workflow and the
  available MapForge/FA Nexus/import alternatives;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- the fixture proves temporary-scope isolation, deterministic discard and
  promotion, asset-reference stability, reconnect convergence, and no bundled
  publisher content.

Reject or narrow the candidate if MapForge is good enough, buyers only want a
full editor, the time saved is too small to justify payment, a second window
is faster, or the product needs to own an asset catalog. Test a neutral
encounter-board package and one Roll20 or Owlbear read-only boundary only after
the Foundry buyer and fixture gates pass.

### TableStart / Guided Player Session buyer gate

Recruit table owners who onboard new or casual players at least monthly, run
mixed-device or in-person games, or have had a player miss a turn because the
Foundry UI or current character sheet was confusing. Exclude technically
confident groups whose players already use the full UI without help; they are a
negative control. Record the most recent onboarding or return-to-play failure,
how long it delayed the table, who intervened, and whether the player avoided
Foundry afterward.

Compare one identical onboarding/return-to-play task using:

1. Foundry core plus the GM's current settings and tutorial;
2. Hide UI or the buyer's existing UI-control configuration;
3. Player Pilot, a current mobile/companion workflow, or the buyer's second
   device if available;
4. Claim Your Hero, Character Builder, Hero Mancer, AFK Ready Check, or
   SessionFlow where the task overlaps; and
5. TableStart with a small GM-authored recipe for join/claim, current-scene
   context, permitted actions, next roll/decision, ready state, and fallback to
   the normal sheet.

Measure time to first correct player action, help requests, wrong-tab or
   wrong-control events, GM interventions, recovery after a missed session,
   mobile/secondary-device usability, and whether the recipe survives a scene
   or actor change. Test a new player, a returning player, and a one-shot
   player separately; a polished first-run demo is not enough.

The competitor comparison is mandatory. Hide UI already controls visibility,
Player Pilot is free and covers common player actions, and premium player
workspaces already sell richer session dashboards. Do not count a buyer who
only wants a cleaner theme, a mobile sheet, character creation, or a ready
check as evidence for TableStart.

Ask the table owner to choose **$10, $20, $30, or no purchase** for a one-time
module and separately ask whether they will run it for three real sessions
with at least one new or returning player. Do not count “my players would like
it” without a price choice and pilot commitment.

Provisional pass gates:

- 7/10 qualified table owners report a recent onboarding or return-to-play
  failure;
- 5/10 prefer the session recipe over their current setup and the named
  alternatives;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- the fixture proves per-player scope, safe fallback, actor/scene changes,
  reconnect convergence, and no copied publisher/rulebook text.

Reject or narrow the candidate if Hide UI plus Player Pilot is good enough,
players adapt after one session, the pain is only cosmetic, the GM must author
too much recipe data, or the product becomes a second campaign workspace.
Test a neutral session-recipe record and one Roll20 or Owlbear read-only
adapter only after Foundry buyer and runtime gates pass.

### Tabletop Bridge / Physical Table Mode buyer gate

Recruit GMs who run in-person or hybrid sessions at least twice per month and
already use a TV, projector, touchscreen, player phones, or multiple browser
clients with Foundry. Exclude fully remote GMs and paper-only groups as
negative controls. Record the last time a shared display, player input device,
physical roll, scene preload, or secret-visibility problem interrupted play;
capture setup time, number of devices/modules, recovery time, and whether the
GM abandoned a digital feature to keep the table moving.

Compare one identical table setup using:

1. the GM's current module/device stack;
2. Monk's Common Display, Physical Play Dice, TouchVTT, Player Pilot, Gaming
   Table, Ninjo's In-Person Tools, and Lock View where applicable; and
3. Tabletop Bridge with a display-role registry, paired player controls,
   physical/digital dice policy, secret-safe routing, scene/performance policy,
   stale-client status, and one-click return-to-remote mode.

Measure time from a cold start to a usable table, number of configuration
steps, wrong-display or secret-leak events, dropped/stale client recovery,
map-load traffic, physical-roll completion time, player control latency, and
the time to switch back to remote play. Test a fresh session, a reconnect, and
one device disappearing mid-session. The product must prove setup and recovery
reduction, not merely show the same features in a new menu.

The competitor comparison is mandatory because current modules already cover
most components. Do not count a buyer who only wants a TV viewer, a mobile
sheet, touch controls, or manual physical dice entry as evidence for Tabletop
Bridge.

Ask the GM to choose **$20, $35, $50, or no purchase** for a one-time Foundry
module and separately ask whether they will use it for three real in-person or
hybrid sessions. Do not count “that would be convenient” without a price
choice and pilot commitment.

Provisional pass gates:

- 7/10 qualified GMs report a recent multi-device/display/dice failure;
- 5/10 prefer the orchestration workflow over their current stack;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete a three-session pilot; and
- the fixture proves secret-safe display routing, stale-client recovery,
  physical-roll correctness, deterministic scene policy, and no hardware or
  publisher-content dependency.

Reject or narrow the candidate if the buyer only needs existing modules, the
setup stack is already stable, the payer pool is too small, or equivalent
orchestration cannot be expressed on a second VTT. Test a neutral table-session
record and one second-VTT read-only boundary only after the Foundry buyer and
runtime gates pass.

### VTT BridgeCheck / Campaign Transfer Assurance buyer gate

Recruit GMs who are actively moving a campaign from Roll20, D&D Beyond,
Fantasy Grounds, another Foundry world/version, or a failed prior import.
Require a real export or a synthetic fixture that resembles the buyer's
campaign. Exclude buyers who are only curious about migration or starting a
new blank world; they are negative controls. Record the named failure, sunk
content investment, manual cleanup time, missing assets/links, permission or
secret risk, and the date by which the campaign must be playable.

Compare one identical transfer using:

1. the buyer's current importer and manual cleanup;
2. the relevant DDB-Importer, VTTA, R20Converter, PDF-to-Foundry, Phils Map
   Migrator, or native Foundry migration path;
3. backup/restore without an assurance layer; and
4. VTT BridgeCheck creating a disposable target, inventorying source and
   target, checking links/assets/schema/permissions, previewing repairs, and
   emitting a rerunnable receipt/diff.

Measure time to a playable target, manual repair minutes, unresolved links,
missing assets, wall/light/tile drift, duplicate data, permission leaks,
unsupported feature discovery, reproducibility after a rerun, and whether the
real world remained untouched. Test a Roll20 export, a D&D Beyond/Foundry
import, and a Foundry core/system-version migration separately; do not blend
them into one success score.

The named importer must remain in the comparison. Existing importers are
valuable and actively maintained; BridgeCheck cannot claim marketability by
finding defects in a deliberately weak control. Do not copy publisher text or
assets into the fixture, and do not use a source adapter that bypasses access
controls or terms.

Ask the migrating GM to choose **$10, $25, $50, $75, or no purchase** for a
one-time transfer-assurance utility and separately ask whether they will run it
on two real campaigns or migration attempts. A historical importer payment or
a statement that conversion is “worth it” is category evidence, not product
WTP for BridgeCheck.

Provisional pass gates:

- 7/10 qualified migrating GMs have a recent or active post-import failure;
- 5/10 prefer BridgeCheck over their exact importer plus manual cleanup;
- 3/10 choose a non-zero one-time price;
- 2/10 schedule or complete two real campaign pilots; and
- the fixture proves disposable isolation, permission/secret safety,
  deterministic rerun, source/target diff accuracy, explicit unsupported
  fields, and no copied publisher content.

Reject or narrow the candidate if migration is a one-time problem buyers solve
with a $5 importer, manual cleanup is faster, the receipt cannot identify real
failures, source terms prevent the needed adapters, or the buyer wants a full
cross-VTT converter. Build one second-VTT read-only receipt adapter only after
the Foundry buyer and runtime gates pass.

### VTT BridgeCheck technical control update

The first fixture must be Foundry-local and must not require D&D Beyond
credentials, a proxy, or direct Roll20 account access. Use synthetic or
user-supplied exports and an isolated copy of a world/backup. Include package
and system versions, `_stats`/last-modified data where available, world
documents, asset paths, scene geometry, links, ownership, missing files,
duplicates, and deliberately unsupported fields. The live world must be
opened read-only and remain unchanged by the rehearsal.

The receipt must distinguish these states rather than collapse them into
“import succeeded”:

- source data was unavailable or unauthorised;
- source reference exists but target document/link is unresolved;
- target resolves but asset/geometry/schema/ownership differs;
- the check is unsupported or cannot be proven; and
- the check passed with an evidence path and rerunnable fingerprint.

The portability trial is intentionally weaker than a converter promise. A
Roll20 control may provide a user-mediated inventory/copy because its official
transfer tools primarily move objects inside Roll20. An Owlbear control may
render a compact namespaced receipt through its extension metadata and scene
download APIs, subject to its small room-metadata limit. Neither control may
scrape, impersonate, or claim full campaign parity. A portable receipt is a
future adapter boundary, not evidence that a second-VTT product is already
marketable.

### LootFlow / Party Economy buyer gate (currently rejected)

Keep this arm as a negative control unless a buyer reopens it. If revived,
recruit GMs who have run at least three recent loot, shop, crafting, or party-
treasury transactions in Foundry and at least one player who actually claims,
trades, sells, or shares currency. Exclude tables that only need a static chest
or a single GM-awarded item. Record the last ambiguous or duplicated transfer,
the time spent fixing inventory and currency, whether players were online at
the same time, and whether the table already uses Item Piles, Quartermaster,
Backpack, RPGX, The Stockpile, Campaign Codex, or a hosted campaign tool.

Compare one identical scenario using:

1. the table's current chest, actor-sheet, Item Piles, or Quartermaster flow;
2. the relevant shop/loot alternative, including RPGX or The Stockpile where
   applicable; and
3. a disposable LootFlow fixture with claim approval, pooled currency, cart
   splitting, sale/return, conflict handling, transaction history, and undo.

Measure time from encounter end to settled loot, duplicate or lost items,
currency discrepancies, GM interventions, player comprehension, rollback
success, reconnect behavior, and setup time. Test a system-agnostic item with
no price, a D&D 5e item, a shared currency transaction, and a shop purchase;
do not infer portability from a shared UI alone.

Ask the GM to choose **$10, $20, $35, $50, or no purchase** for a one-time
module and separately ask whether the table will use it for three real
sessions. The candidate stays rejected unless 7/10 qualified tables report a
recent repeated transaction problem, 5/10 prefer it over their exact current
stack, 3/10 choose a non-zero price, 2/10 complete the three-session pilot,
and the fixture proves idempotent transfers, permission-safe claims,
deterministic conflict handling, undo, and no copied publisher content.

Reject the candidate if Item Piles or Quartermaster solves the named problem,
the visual shop is the only differentiator, a free shared chest is enough, or
the product becomes a system-specific economy simulator. Only after a Foundry
pass should a neutral ledger be rendered through one Roll20 or Owlbear
read-only adapter.

### TurnReady / Combat Focus buyer gate (currently rejected)

Keep this arm as a negative control unless a table reports a repeatable combat
failure that the current HUD/tracker stack does not solve. If revived, recruit
both D&D 5e and Pathfinder 2e tables that have played at least three recent
combat sessions and include a new, returning, accessibility-needing, or
frequently interrupted player. Record forgotten reactions or resources,
hesitation time, incorrect action-budget decisions, GM reminders, movement
confusion, and whether the table already uses Action Keeper, Reaction Tracker,
Stylish Action HUD, Argon/Token Action HUD, PF2e Combater, or system-native
automation.

Compare one identical combat turn using:

1. the native Combat Tracker and character sheet;
2. the table's current action/HUD/automation stack; and
3. a disposable private TurnReady card showing only the active user's
   remaining budget, usable actions, resource/reaction reminders, and undo
   trail.

Measure time to first valid action, wrong or duplicate actions, forgotten
reactions, GM interventions, sheet-opening time, visual clutter, per-user
privacy, reconnect behavior, and whether the card survives a scene/system
change. Do not compare a D&D 5e rules adapter as though it were a PF2e action
adapter.

Ask the table owner to choose **$8, $15, $25, $39, or no purchase** for a
one-time module and separately ask for a three-session pilot. Keep the
candidate rejected unless 7/10 qualified tables report a recent named failure,
5/10 prefer the private card over their exact stack, 3/10 choose a non-zero
price, 2/10 complete the pilot, and the fixture proves per-user privacy,
system-specific rules boundaries, deterministic reset, safe undo, and no
unintended combat mutation.

Reject it if a current HUD or tracker is good enough, the value is only a
prettier overlay, the product must infer every system's rules, or the buyer
actually wants a full automation engine. Test one second-VTT record only after
the Foundry buyer and runtime gates pass.

### Player Compass buyer gate (fresh sixth conditional arm)

Recruit table owners whose players have repeatedly asked where an action, tab,
resource, or sheet control is during the last three sessions. Require at least
one returning, low-confidence, accessibility-needing, or mixed-experience
player; exclude tables that already report a fast, self-sufficient workflow
with their current HUD. Record the system, sheet, HUD, player role, exact
confusion, time lost, repeated GM intervention, and whether the problem occurs
in combat, exploration, or social play.

Compare the same player task using:

1. the native sheet and the table's current orientation;
2. the exact current HUD stack, such as Token Action HUD, PF2e HUD, Argon, or
   Stylish Action HUD; and
3. a disposable Player Compass surface that automatically selects the current
   context, labels actions in plain language, explains availability, keeps the
   native sheet available as an escape hatch, and supports both a minimal mode
   and a richer mode without imposing a visual style.

Measure time to first valid action, wrong or duplicate actions, “where is that?”
questions, GM interventions, sheet openings, setup time, context-switch errors,
keyboard/screen-reader success, low-resolution usability, reconnect behavior,
and whether a player can use the surface without a tutorial after the first
session. Do not count a prettier HUD or a one-time orientation preference as a
product win.

Ask the table owner to choose **$10, $20, $30, $39, or no purchase** for a
one-time, non-subscription module and separately commit to a three-session
pilot. Also ask whether the table would reject a subscription even if the
feature were useful. Keep Player Compass conditional unless 7/10 qualified tables report a repeated problem,
5/10 prefer it over their exact current stack, 3/10 choose a non-zero price,
2/10 complete the pilot, and the fixture proves per-user visibility, safe
read-only capability discovery, deterministic context changes, keyboard and
screen-reader behavior, and no unintended document mutation.

Reject the candidate if current HUDs plus a short orientation solve the named
problem, the GM must manually author every scene recipe, context detection
requires a system-specific write engine, or the player cannot explain the
benefit after using it. Test one neutral capability-manifest record and one
read-only second-VTT boundary only after the Foundry gate passes.

Pass 112 technical/licensing correction: the broad action-access and
accessibility promise is already occupied. Foundry Navigator currently covers
keyboard and screen-reader workflows for D&D 5e sheets, targeting, damage and
healing, low-resolution behavior, and focus recovery; Token Action HUD covers
direct D&D5e rolls and item use; PF2e HUD is current for PF2e and Starfinder 2e.
Player Compass therefore advances only as a smaller read-only orientation layer:
automatic context explanation, visible availability reasons, and a native-sheet
escape hatch with no hidden writes or rules-engine replacement.

The technical fixture must use separate D&D5e and PF2e adapters and synthetic
user-owned actors. It must verify per-user visibility, keyboard and screen-reader
labels, low-resolution layout, focus recovery, reconnect, and deterministic
context transitions. It must record capability IDs and provenance rather than
copying rules text, compendium content, publisher art, or competitor code. The
D&D5e repository separates MIT software from SRD and asset terms, while PF2e
separates Apache-2.0 code from content, art, and Foundry platform terms; treat
those as audit inputs, not blanket commercial permission. A second VTT test is
limited to consuming the neutral capability manifest and must not claim action
parity.

Add a reason-coded rejection if the exact current HUD plus a short orientation
solves the task, if buyers want a rules-aware automation engine instead, if
accessibility behavior cannot be reproduced in a real fixture, or if package and
asset rights cannot be cleared. Do not promote Player Compass from this pass;
the price and three-session buyer gate is still outstanding.

### Campaign Anchor / Version Harbor buyer gate (fresh conditional arm)

Pass 113 opened Campaign Anchor as a consumer-GM candidate, not a developer
maintenance tool. Recruit self-hosting GMs with a long-running or paid campaign,
at least one recent Foundry/system/module upgrade concern, and either multiple
worlds, premium content, or a documented near-miss. Exclude one-shot GMs,
managed-host users who never touch their runtime, and module authors as the
primary sample. Record the exact version stack, world age, module count,
premium-content exposure, last incident, backup routine, time spent recovering,
and whether the GM currently keeps an older install alive.

Compare the same upgrade decision using:

1. the GM's current backup and manual portable-install workflow;
2. the exact managed-host alternative, if relevant, such as The Forge or
   Molten; and
3. a disposable Campaign Anchor flow that snapshots the environment, clones the
   world, rehearses the upgrade, reports package and migration changes, and
   launches the known-good environment without touching the live world.

Measure time to a trustworthy “play tonight” decision, recovery time after a
failed rehearsal, false-green or false-safe reports, world mutation, package
drift, launch correctness, storage cost, backup clarity, and whether the GM
actually keeps the pinned environment for three sessions. Do not count a version
list, compatibility badge, or extra backup as a product win.

Ask the GM to choose **$15, $30, $49, or no purchase** for a Windows-first
buy-once utility. Separately ask whether ongoing compatibility intelligence is
worth **$3/month, $5/month, or no recurring fee**; do not assume a subscription
for a local tool. Require two multi-session pilots and record whether the buyer
would choose Campaign Anchor over the exact manual, Forge, or Molten alternative.
Keep it conditional unless 7/10 qualified GMs report a named upgrade or runtime
failure, 5/10 prefer it over their exact current alternative, 3/10 choose a
non-zero buy-once price, 2/10 complete three sessions, and the fixture proves
clone-before-migrate, deterministic rollback, no live-world mutation, correct
package/system binding, and no bundled or copied licensed content.

Pass 114 direct-competition correction: Foundry itself now covers package
backups, full snapshots, automatic pre-migration backup, package restore, notes,
storage metadata, and compatibility-risk information; its official portable
workflow covers older and multiple simultaneous installations. The Forge and
Molten add managed version/backup alternatives, while Sephral's Content Backup
& Restore covers document-level recovery. Therefore the buyer gate is not a
general backup, version manager, or launcher test.

Keep Campaign Anchor only as a conditional comparison arm. A qualified buyer
must name a repeated failure that survives the exact Foundry snapshot/restore
workflow, portable install, managed-host alternative, and World Doctor control.
The testable slice is a campaign-specific environment receipt that combines
world, core, system, module, launch-path, and rehearsal state and proves that
the known-good world remains runnable. If the receipt merely repeats a backup
or version list, reject it. Do not promote Campaign Anchor from this pass; its
cross-VTT portability remains a protocol hypothesis only.

### Resolve Relay buyer gate (parked negative control)

Pass 105 demoted Resolve Relay after the exact-package check: current free
target-aware tools cover most of the proposed handoff. Keep this gate only as
a controlled reopen path for a named system or table whose current stack still
has a repeatable resolution failure. Do not spend the next empirical slot on
it by default.

Recruit GMs who run D&D 5e or PF2e combat with at least three player-controlled
characters and who currently use the native GM apply workflow, Effective Tray
NG/Midi-QOL, PF2e Toolbelt, or PF2e Saves Helper. Record the exact repeated
failure: target re-selection, wrong-token application, forgotten damage,
duplicate application, AoE cleanup, or a rules/permission disagreement.
Exclude tables that already resolve the named problem in one deliberate click.

Compare the same attack, save, and targeted effect using:

1. the table's current native or module stack;
2. a player-facing intent card with a GM one-click target-aware confirmation;
3. the richer Resolve Relay card with visible source, target, result,
   adjustment, reject, expiration, and undo states.

Measure GM clicks, time from player roll to confirmed state, wrong-target
corrections, duplicate requests, hidden-stat leakage, stale or disconnected
requests, player comprehension, and whether the GM still feels in control of
the rules. Test single-target, multi-target, save-for-half, resistance or
weakness, condition, and rejected-request fixtures. The player must never gain
write permission to an unowned actor; the GM client or server-side authority
must perform the final mutation.

Ask the GM to choose **$10, $20, $30, or no purchase** for a one-time module,
then separately commit to a three-session pilot. Keep Resolve Relay
conditional unless 7/10 qualified GMs report the named repeated failure,
5/10 prefer the relay card over their exact current stack, 3/10 choose a
non-zero price, 2/10 complete the pilot, and the fixture proves target
identity, safe permissions, no hidden-stat leakage, idempotence, reconnect
recovery, and safe undo.

Reject it if PF2e Toolbelt or the table's D&D 5e stack already removes the
pain, if buyers want unattended full automation instead of a handoff, if the
card adds more attention than it saves, or if every supported system needs a
bespoke rules engine. Test one neutral action-envelope record and one
second-VTT adapter only after Foundry evidence passes.

### JoinProof / Game Night Gatekeeper buyer gate (parked negative control)

Pass 107 closes the generic gateway claim because Foundry Tunnel Manager
already manages providers, start/stop, logs, URL copying, live status, and
tunnel-expiry/death notifications. Test this narrower candidate as a verified
pre-session result, not as another tunnel manager.

Pass 108 further demoted it: Foundry itself has a remote connectivity check,
generic monitors cover HTTP/port/WebSocket checks, and a player or phone can
perform a free external test. Keep this gate only to reopen for a named false
green or stale-session failure that those controls cannot diagnose. Do not
spend the next empirical slot on it by default.

Recruit self-hosting GMs who have had a player fail to join because of
port-forwarding, CGNAT, firewall, changing IP, stale tunnel, websocket, or
Foundry-process problems. Include both a DIY host who refuses a recurring
hosting bill and a host who already pays for Molten, The Forge, or another
provider but wants a local emergency path. Record the network shape, the
current provider or tunnel, the last failed session, time to first successful
player join, and whether the GM would have paid to avoid that failure.

Compare one identical cold-start and reconnect scenario using:

1. Foundry's native self-host path and the GM's current router/firewall steps;
2. the exact free alternative available to that GM, such as Foundry Tunnel
   Manager with Cloudflare/ngrok, playit.gg, Tailscale, or ZeroTier;
3. a paid host such as Molten or The Forge; and
4. a disposable JoinProof fixture that performs Foundry-aware preflight, an
   independent external invite check, websocket/heartbeat monitoring, stale
   link detection, and a clear green/red “send this invite” result without
   replacing the existing tunnel or host.

Measure time to first successful join, false-green links, stale invites,
reconnect time, latency visibility, player install requirements, GM
interventions, silent port/provider changes, local-data exposure, and whether
the GM can diagnose the failure without opening a router manual. Compare a
same-network check with an independent device or remote probe so NAT loopback
does not create a false green. Require the fixture to avoid collecting
credentials or game payloads and to preserve local world files.

Ask the GM to choose **$15, $30, $49, or no purchase** for a buy-once Windows
verified pre-session utility, then separately choose **$3/month, $5/month, or
no recurring fee** for the independent probe and compatibility maintenance.
Require a three-session pilot and record whether the buyer would choose
JoinProof over the exact FTM/free stack or paid host. Keep it conditional
unless 7/10 qualified GMs report a named
connection failure, 5/10 prefer it over their exact current stack, 3/10
choose a non-zero price, 2/10 complete the multi-session pilot, and the
fixture proves the independent probe is trustworthy, with no hidden exposure,
stale URL, duplicate gateway, silent fallback, credential capture, or local
data loss.

Reject it if the GM's exact free path is already reliable, a paid host is
clearly preferred at every price, a phone or remote player can perform the
same check for free, the probe needs bundled provider credentials, the
product silently changes the bind/port, or a player must install software for
the common case. Foundry is the first implementation; test a neutral
HTTP/WebSocket health receipt on one other browser VTT only after the Foundry
buyer and runtime gates pass.

### Session Pulse / Campaign Commitment buyer gate (conditional arm)

Pass 110 found Doodle payment for deadlines, reminders, participant tracking,
and privacy controls, but its subscription is category evidence only. The
candidate must sell avoided prep loss and a clear quorum/fallback decision,
not another poll. Report ordinary campaign GMs separately from paid GMs and
organized-play coordinators; do not pool their price choices.

Recruit GMs running recurring weekly or biweekly campaigns who have had at
least one of the last six planned sessions delayed, cancelled, or made
uncertain by attendance. Require a real group using some combination of
Discord, Doodle, Google Calendar, Warhorn, or ad-hoc messages. Record the
number of players, quorum rule, late replies, last-minute cancellations,
prep time wasted, and the actual decision the GM made. Include one paid GM or
organized-play coordinator if available, but do not treat that segment as
the ordinary-group baseline.

Compare the same upcoming-session decision using:

1. the group's current messages/calendar/poll workflow;
2. the exact Doodle, Discord Events, Warhorn, or Foundry workflow already
   available to the group; and
3. a disposable Session Pulse flow with deadline, reminders, green/yellow/red
   quorum state, locked roster, and explicit run/reschedule/recruit/fallback
   actions.

Measure time to a final decision, response rate, late-response count, GM
prep saved, false quorum decisions, player comprehension, reminder fatigue,
privacy/consent, notification delivery, and whether the fallback action was
actually used. Do not count a prettier calendar, a one-time poll, or a player
preference as a product win.

Ask the GM to choose **$10, $20, $39, or no purchase** for a one-time
Foundry-first utility, then separately choose **$3/month, $5/month, or no
recurring fee** for reminders and notification maintenance. Require three
real session cycles and record whether the buyer would replace the exact
current stack. Keep it conditional unless 7/10 qualified GMs report a recent
named quorum failure, 5/10 prefer it over their exact current workflow, 3/10
choose a non-zero price, 2/10 complete three cycles, and the fixture proves
participant privacy, deterministic deadlines, no duplicate reminders, safe
withdrawal, and explicit fallback state.

Reject it if Doodle plus Discord is sufficient, the GM only wants a calendar,
players will not respond to another channel, the service must import contact
lists without consent, or the fallback action requires a large system-specific
rules engine. Keep the portable artifact as an event/attendance contract;
test one second-VTT integration only after the Foundry buyer and privacy
fixture pass.

### Table Pact / Campaign Fit gate (conditional fresh challenger)

Pass 116 found recurring campaign-fit pain: new tables often need to align
tone, boundaries, PvP, house rules, attendance, communication, and campaign
buy-in before those mismatches become a group failure. This is not yet product
WTP. Test only new, paid, convention, or organized-play tables with a named
mismatch or boundary failure; treat established friend groups as a negative
control.

Compare the exact current session-zero checklist, form, safety-module workflow,
or direct conversation against a disposable Table Pact flow with private
player answers, GM-visible aggregate conflicts/unanswered items, a versioned
acknowledged pact, and an explicit re-check after a new player joins or the
campaign changes. Do not expose raw answers, assign a compatibility score, or
label a player as a bad fit.

Ask for a one-time **$5, $10, $20, or no purchase** choice. Do not assume a
subscription for a mostly session-zero workflow. Require 7/10 qualified
tables to report a named mismatch, 5/10 to prefer the exact Table Pact flow
over their current alternative, 3/10 to choose a non-zero price, and 2 pilots
to complete a re-check without privacy or trust objections. Record whether
the product was actually opened, whether the aggregate view changed a table
decision, and whether the group would use it again.

Reject it if a checklist/form/direct conversation is sufficient, players refuse
private answers, the GM wants raw interpersonal judgments, or the workflow is
only a generic safety-card duplicate. Keep the portable artifact limited to
consent-safe preference categories, pact version, acknowledgements, and
aggregate unresolved flags; never export raw sensitive answers or person-level
fit labels. Keep Table Pact conditional and continue the wide search unless
the gate produces product-specific payment evidence.

### Player Pocket / VTT Companion gate (conditional fresh challenger)

Pass 119 found a stronger payer signal for a narrow mobile companion: hybrid
and in-person groups want player sheets and safe actions on phones/tablets
while the GM keeps the map or shared display on the main screen. Test the GM
as payer with hybrid/in-person campaigns, tablet-only players, convention or
classroom tables, and groups that can name laptop clutter or mobile access as
a current failure. Online desktop-only groups and unsupported systems are
negative controls.

Compare the exact installed competitor—Foundry Tabletop Helpers, Swipe VTT,
VTT Companion, PocketScroll, Diecast, Sheet Only, Mobile Improvements, or a
system-specific companion—against a disposable Player Pocket flow with only
permission-scoped character snapshot, action request, roll/result, resource
delta, combat notification, reconnect, and read-only offline cache. Do not
rebuild a full canvas or copy rules content.

Ask the GM to choose **$15, $30, $45, or no purchase** for a one-time license;
record separately whether all players join free. Require 7/10 qualified GMs
to name a current mobile/hybrid failure, 5/10 to prefer the narrow contract
over the exact installed alternative, 3/10 to choose a non-zero price, and 2
pilots to complete three sessions with at least two devices. Measure sync
latency, reconnect success, offline conflict behavior, action correctness,
permission leakage, setup time, and whether the GM keeps using it.

Reject it if the buyer only wants a full mobile VTT, if an incumbent's free or
paid sheet already solves the exact table, if the product requires cloud
storage of campaign data, or if system adapters cannot declare unsupported
actions. Portability is limited to the action contract and snapshot; never
export raw rules text, private actor data, or unreviewed system semantics.
Keep Player Pocket conditional until the exact competitor and price test pass.

### Player Pocket direct-competition correction

Pass 120 closes the broad mobile-client claim. PocketScroll, Swipe VTT, VTT
Companion, Foundry Tabletop Helpers, Sheet Only, Mobile Improvements, and
Diecast already provide current Foundry mobile surfaces; Roll20 Characters and
D&D Beyond provide strong cross-platform mobile-sheet substitutes. Do not
count the existence of a mobile need or an incumbent's paid tier as WTP for a
new adapter.

If reopened, recruit only GMs who run the same campaign or player cohort across
at least two VTTs or systems and can name a repeated failure that the exact
incumbent surfaces cannot solve. Compare a thin portable action contract
(snapshot, permissioned action, result, resource delta, notification,
reconnect, unsupported state) against the exact installed options. Require
7/10 named cross-platform failures, 5/10 preference over the exact surfaces,
3/10 non-zero one-time choices, and 2 pilots spanning two VTTs. Reject a full
mobile sheet clone, cloud campaign store, or VTT-specific canvas client before
that evidence exists.

### Encounter Tuner / Party Fit Lab gate (conditional fresh challenger)

Pass 121 found that generic monster generation and encounter math are already
occupied by Encounter Forge, Giffyglyph's Monster Maker, D&D Beyond's paid
Encounter Builder, and current combat-stat/replay tools. Test only the
post-combat loop: a debrief of actual rounds, damage/healing, downed events,
resource drain, enemy count, planned-versus-observed outcome, and a small set
of explainable next-encounter adjustments. Do not mutate live combat or
silently scale enemies.

Recruit GMs running a recurring, combat-heavy D&D5e or PF2e campaign. One-shot
groups, story-first tables, and GMs already satisfied by Encounter Forge or a
system-native workflow are negative controls. Ask for **$10, $20, $35, or no
purchase** as a one-time GM license. Require 7/10 to name a recent
party-fit failure, 5/10 to prefer the exact debrief-plus-adjustment flow over
their installed alternative, 3/10 to choose a non-zero price, and 2 pilots to
use it for three sessions.

Measure whether the report changes the next encounter, whether the GM can
explain every recommendation, whether the table experiences it as helpful
rather than punitive, and whether the same result can be produced from a
second VTT's read-only event export. Reject it if the buyer only wants another
generator, if the exact current tool already closes the loop, if the product
requires proprietary rule text, or if a balance score encourages hidden live
adaptation. The portable artifact is limited to combat events, outcomes,
resource deltas, and GM-authored notes.

### SceneReady / Map QA control (rejected fresh scan)

Pass 122 found that map import and scene preparation remain visually
compelling, but Universal Battlemap Importer, Dungeon Alchemist, Dungeondraft,
MapForge, Mass Import, Dungeon Alchemist Level Importer, and Map Splitter cover
the main job. Do not infer willingness to pay for a QA utility from sales of
mapmaking software or prepared map packs.

Reopen only if a qualified GM names a repeated post-import failure—grid,
walls, doors, lights, levels, or missing assets—that the exact importer does
not catch. Compare against manual QA and the existing BridgeCheck/World Doctor
workflow, ask **$10, $20, $30, or no purchase**, and require 7/10 named
failures, 5/10 preference, 3/10 non-zero choices, and 2 pilots. Keep only
visual diffs, readiness receipts, missing-asset reports, and neutral scene
contracts as reusable assets.

### Resource Steward / Ammunition control (rejected)

Pass 117 found that ordinary-table pain is often a reason to remove or ignore
mundane resource bookkeeping, not a reason to buy another tracker. Do not test
this with generic D&D groups. Reopen only with survival, expedition, firearms,
or paid GMs who explicitly enforce ammunition, torches, rations, or similar
resources and can name repeated reconciliation errors.

Compare the exact current sheet, macro, Ammo Tracker, RC Spent, Weapon Reload,
Party Resources, Custom Fields, or Bag o' Lists workflow against a disposable
resource-event ledger. Ask **$5, $10, $20, or no purchase** and require 7/10
qualified GMs to report a repeated failure, 5/10 to prefer the exact flow, 3/10
to choose a non-zero price, and 2 pilots to complete three sessions. Reject it
if the table can simply hand-wave the resource, if a native item quantity is
adequate, or if the proposed value depends on copying system-specific rules.

### Character Integrity Ledger control (rejected)

Pass 118 found a narrow trust/admin pain for paid, open, or always-on worlds,
but current Character Tracker and yugen-tracker already provide most audit
value. Reopen only after a qualified GM documents a repeated unexplained
incident that the exact installed tracker cannot answer. A normal private
friend group is a negative control.

Compare the installed tracker against a disposable ledger with before/after
receipts, role-filtered views, retention, acknowledgement, and an explicit
revert preview. Ask **$10, $20, $39, or no purchase**; require 7/10 named
incidents, 5/10 preference over the exact tracker, 3/10 non-zero choices, and
2 pilots. Reject any design that exposes private biography or person-level
suspicion, silently rolls back legitimate play, or exports raw character data.

### Between Sessions / Campaign Projects control (parked)

Pass 115 found an active D&D5e 2024 downtime/Bastion category, but the current
package set is too strong to treat “add projects” as an open gap. Only reopen a
buyer test with weekly or biweekly GMs who already use Bastions, crafting,
research, or downtime and can name a repeated workflow failure: player
submissions scattered across Discord, approvals lost, state reconciled by hand,
or next-session results missing.

Compare the exact current module or spreadsheet workflow against a disposable
player-first board with project submission, GM batch approval, deterministic
resolution, deadlines, and a receipt. Ask **$10, $20, $39, or no purchase** and
require three real cycles. Do not count interest in Bastion content, a prettier
project board, or the official DMG purchase as WTP for this utility. Reject it
if Indy Ventures, Downtime Manager, Downtime 5e, Yugen, Universal Downtime
Engine, Morelord, or a spreadsheet is sufficient. Keep the portable artifact as
a user-authored project-state contract, not shared D&D rules logic.

### CanvasBridge / Legacy-Device Player Relay buyer gate

Treat CanvasBridge as a narrow “do not lose the player” test, not a generic
mobile or performance product. Recruit GMs who have a named player currently
blocked by an unsupported browser, iPad/WebKit limitation, old operating
system, low-end graphics device, or persistent client load failure. Exclude
tables that merely prefer a phone character sheet; Player Pocket already
covers that broader category. Also record whether the GM could solve the case
with Foundry's low-performance settings, Performance Optimizer, Swipe,
foundry-mobile-companion, Foundry Lightweight Client, screen sharing, or a
different VTT.

Show a silent demo with the same synthetic player joining through the fallback
surface, viewing a permitted scene snapshot, making a permitted roll, seeing
the result, reconnecting, and being denied a hidden-GM action. Compare it with
the buyer's actual workaround. Do not use real publisher content or ask for
Foundry credentials.

Ask the GM to choose **$15, $25, $39, or no purchase** for a one-time host
license; players join free. Require all of the following before implementation:

- 7/10 qualified GMs report a recent device-exclusion incident;
- 5/10 prefer the exact fallback flow over their actual workaround and named
  current alternatives;
- 3/10 choose a non-zero price;
- 2 pilots keep the same blocked player in two sessions; and
- the fixture passes permission, hidden-state, reconnect, duplicate-action,
  stale-session, and unsupported-action checks without requiring cloud storage.

The portable artifact is a versioned player-session contract containing visible
scene references or snapshots, permitted action requests, results, resource
deltas, reconnect state, and unsupported capabilities. Do not promise full
sheet, canvas, rules, or live-scene parity across VTTs until a second adapter
proves it.

Reject CanvasBridge if the buyer only wants a normal mobile sheet, if Mobile
Companion, Companion Bridge/VTT Companion, Foundry Mobile Companion, Foundry
Lightweight Client, a performance profile, or screen sharing solves the named
incident, if the relay requires cloud campaign storage or credentials, or if
the one-time price cannot support ongoing VTT/system compatibility work. The
current-package correction means this is a residual-case reopening protocol,
not an implementation authorization.

### Loadout Compass / Character Kits control (rejected)

Pass 125 found genuine demand for named prepared-spell sets and context
loadouts, but the exact spell problem is now occupied. Compare any future
claim against D&D5e Spell Book, PF2e Prepper, the native D&D5e preparation
workflow, and the buyer's equipment/hotbar process. Do not count interest in
“Town,” “Dungeon,” or “Boss” presets as willingness to pay for a new product.

Reopen only with players or GMs who maintain a character with repeated,
non-spell state changes—equipment, actions, hotbar, visibility, and other
reversible player-owned state—that the exact spell-loadout tools cannot handle.
Ask **$5, $10, $20, or no purchase** and require 7/10 to report a repeated
failure, 5/10 to prefer the full-kit preview/apply flow over their exact
stack, 3/10 to choose a non-zero price, and two three-session pilots. Reject
any design that recommends rules choices, silently mutates an actor, or claims
cross-VTT parity from an actor schema alone.

### Trusted Table / Delegated Actions control (rejected)

Pass 126 found a vivid GM-time problem—players applying damage to enemy tokens
under a GM trust toggle—but current D&D5e packages already cover most of the
workflow. Compare Effective Tray NG, Midi-QoL, Damage Application, Always HP,
and the buyer's existing damage-prompt configuration before reopening it.

Only test a narrow system-agnostic or accessibility-focused version if a
qualified multi-system buyer names a repeated failure that survives those
exact controls. Ask **$10, $20, $39, or no purchase**; require 7/10 named
incidents, 5/10 exact-stack preference, 3/10 non-zero choices, and two
three-session pilots. The fixture must include a GM whitelist, target and
permission snapshot, explicit confirmation, expiry, request idempotency,
audit receipt, undo, stale-request rejection, reconnect convergence, and no
general NPC ownership. A socket-based permission bypass is not a product
without buyer evidence.

### Fresh-search reset after Pass 127

The latest search did not produce a new standalone product that survives the
competition audit. The strongest new evidence is an explicit real-money signal
for an Excalidraw-like live layer, but the refined temporary/permissioned
workflow already exists as the conditional Tactical Sketchbook candidate.
Keep that buyer test separate from the Player Compass gate; do not rename or
promote it without a direct price choice and three-session pilot. Dungeon
Master's Forge remains backburnered and is not part of this search.

### Current-package correction after Pass 128

The next fresh scan tested whether player guidance, onboarding, or weak-client
performance could produce a cleaner ordinary-customer product. It did not.
Foundry Navigator now covers a substantial D&D5e v13/v14 player workflow,
including keyboard/screen-reader navigation, combat targeting, GM-mediated
damage/healing, spoken state, focus recovery, and low-resolution behavior.
Character Builder and Foundry's own Player Orientation cover the main player
onboarding path. Prime Performance, Geano's Scene Optimizer, and Swipe VTT
cover current performance, asset optimization, and mobile substitutes.

Do not run a generic “teach players Foundry,” action HUD, FPS dashboard, or
mobile/performance buyer test. Reopen only for a named failure that survives
the exact installed Navigator/Character Builder/native/HUD or
performance/mobile stack. The remaining Player Compass hypothesis is the
smaller read-only, automatic context explanation with no GM-authored recipe;
the remaining diagnostic hypothesis is the incident-specific Session Health
Autopsy. Each still needs 7/10 named incidents, 5/10 exact-stack preference,
3/10 non-zero prices, two three-session pilots, and runtime/rights evidence
before promotion. No product was selected; DMF remains backburnered.

### Hybrid-table and GM-scratchpad negative control after Pass 129

The next fresh community scan surfaced a shared-TV/in-person/remote workflow
and an always-visible GM note request. Do not test a generic Hybrid Table
Controller against a blank slate: Monk's Common Display, paid Stage Master,
Sheet Only, Physical Play Dice, and the group's existing second-screen setup
are the exact comparison set. The vivid demo is not product-specific WTP.

Do not test a generic GM scratchpad either. Notebook is current for v14 and
already includes sidebar notes, lists, counters, timers, progress clocks,
chat, macros, and scribbles; GM Screen, Campaign Codex, pinned chat, and
map-note workflows are additional controls. Reopen only if a qualified
multi-VTT/hybrid GM names a recurring private/shared-routing failure that
survives those exact tools, chooses a non-zero price, and completes two pilots.
Otherwise retain display-role, paired-control, stale-client, and remote-return
contracts as reusable Tabletop Bridge assets. No product was selected; DMF
remains backburnered.

### Live-broadcast overlay negative control after Pass 130

The fresh scan found explicit payment language from a streamer/actual-play
creator for a polished live character/stat overlay. Do not transfer that signal
to ordinary D&D tables. The buyer test, if reopened, must recruit streamers or
paid actual-play GMs and compare Foundry Stream Overlay Free/Pro, OBS Utils,
Stream View, and the creator's current OBS scene/CSS workflow.

The offer must be read-only and consent-safe: no hidden HP, private notes,
unreleased portraits, or player data may leak to the broadcast. Ask **$15,
$30, $50, or no purchase**, require 5/8 qualified creators to prefer the exact
workflow, 3/8 to choose a non-zero price, and two real broadcast pilots. A
second-VTT browser-source adapter is required before claiming portability. If
only creators pay, keep this as a negative control and continue the ordinary-
table search; DMF remains backburnered.

### Zero-Prep Session Capsule buyer gate

Recruit GMs who prep or restart a one-shot, irregular session, imported
adventure, or homebrew session at least monthly and who can name a recent
“Foundry took too long to make playable” incident. Players are beneficiaries,
but the GM/host is the payer and decision-maker.

Compare the same user-owned synthetic material through:

1. the GM's normal checklist and manual scene/actor/journal setup;
2. Dungeon Flow, Morelord Encounters, Encounter Forge, Mass Import, and any
   exact importer or premium adventure the GM already uses;
3. Adventure Navigator, TableStart, or Rapid Encounter Board where the job
   overlaps; and
4. a disposable Zero-Prep Session Capsule that previews the selected material,
   creates a time-boxed GM runbook, scopes player-visible content, launches a
   reversible session surface, and emits a cleanup receipt.

Ask **$15, $30, $49, or no purchase** after the buyer names the workaround and
completes the task. Require 7/10 qualified GMs to report a repeated setup or
restart failure, 5/10 to prefer the capsule over the exact alternative, 3/10
to choose a non-zero price, and two GMs to schedule or complete three real
session pilots. Reject it if the buyer really wants bundled adventure content,
an AI author, a generic importer, or a module bundle; those are different
products and carry separate rights economics.

The Foundry fixture must prove dependency closure, permission-correct player
scope, no live-world mutation before approval, rerunnable launch, deterministic
cleanup, stale-reference reporting, and a clear unsupported state. The capsule
may store IDs, hashes, labels, and user-authored references, but may not ship
publisher text, protected art, or copied competitor data. Only after the
Foundry gate passes should a Roll20 or Owlbear read-only preview consume the
neutral manifest; that experiment must not claim cross-VTT runtime parity.

### Zero-Prep direct-incumbent correction after Pass 132

Do not test a broad session workspace or “one canvas for the whole session”
against a blank slate. SessionFlow is a current premium Foundry 13/14
incumbent with beats, scenes, quick scenes, journal links, player panels,
objectives, broadcasts, and recaps; Dungeon Flow covers paid map/import
orchestration. The remaining test, if any, is a disposable safety wrapper
around user-owned material: dependency preview, player-scope review,
approval, reversible launch, cleanup, and return receipt. Reject it if the
buyer merely wants an importer, an adventure, a prep canvas, or a duplicate
world.

### No-Spoiler Player Return Brief buyer gate

Recruit GMs/hosts of monthly, irregular, open, or paid campaigns who have had
an absent player in the last 90 days and can name a catch-up that consumed
meaningful play time. The GM/host is the initial payer hypothesis; players are
the retention beneficiaries.

Compare the same synthetic session delta through:

1. the group's normal recap, journal, Discord, or shared-wiki routine;
2. Archivist Sync/Archivist, Foundry Familiar, Campaign Codex, SessionFlow's
   Chronicle/Scribe, and any LegendKeeper or equivalent external wiki;
3. native Foundry shared fog and the group's manual character/state update;
4. a Return Brief that is individually scoped, GM-approved, redaction-aware,
   and able to show contradictions or unresolved facts without guessing.

Ask **$10, $20, $39, or no purchase** only after the buyer performs the exact
catch-up task. Require 7/10 qualified GMs to report a repeated re-entry or
catch-up failure, 5/10 to prefer the brief over the exact alternative, 3/10
to choose a non-zero price, and two GMs to schedule or complete three-session
pilots. Reject it if the desired product is a generic wiki, transcript,
search box, or AI chatbot.

The Foundry fixture must include two players with different permissions,
private and public facts, a redacted secret, an absent-player map change, a
character-state delta, a contradictory note, a stale source link, GM approval,
regeneration, revocation, and an acknowledgement receipt. No player may see
another player's private facts; an uncertain or conflicting fact must remain
marked unknown rather than being “helpfully” inferred. Store only user-owned
references, IDs, hashes, labels, and approved text. After Foundry proof, test
only a read-only Roll20 or Owlbear preview from a neutral manifest containing
audience, spoiler scope, source references, timestamps, confidence, and
unsupported mappings.

### No-Spoiler direct-incumbent correction after Pass 134

Do not treat the broad Player Return Brief as an empty market. Archivist now
has paid campaign-memory plans beginning at $10/month, recap and campaign
overview workflows, private viewer-aware notes, and permission-aware answers;
LegendKeeper offers a paid owner plan with free player seats and secret,
controlled content; Tavern Scribe explicitly markets missed-session catch-up,
player memory, and “player truth.” These are direct payment and feature
controls, not merely adjacent category interest.

Demote the broad Return Brief to a comparison arm. Reopen it only if a
qualified Foundry table names a repeated local failure that survives those
incumbents, Campaign Codex, SessionFlow, and the group's manual recap/wiki,
then chooses a non-zero price and completes a pilot. Retain per-player
audience, spoiler-scope, contradiction, acknowledgement, and revocation
records as reusable assets rather than as proof of a new product.

### World Doctor first empirical gate after Pass 135

Recruit GMs/hosts of long-running, module-heavy, paid, or tightly scheduled
tables who can name a recent update breakage, compatibility near miss, or
recovery failure. Compare the normal workflow against Foundry's compatibility
warnings, version pinning, backups/snapshots, Find the Culprit, Quick Module
Enable, Sephral's Content Backup & Restore, managed-host backups, and a manual
duplicate-world rehearsal.

The candidate is a read-only, disposable-copy Game Night Preflight / World
Doctor: launch a GM-selected smoke suite, exercise join/scene transition,
permissions, a representative system roll, journal/macro access, module hooks,
and asset resolution, then emit an evidence-linked receipt. It must not mutate
the live world, silently repair modules, or copy campaign/publisher content.
Ask **$15, $25, $39, or no purchase** only after the buyer names the current
workaround. Require 7/10 qualified GMs to report a repeated incident, 5/10 to
prefer World Doctor over the exact alternative, 3/10 to choose a non-zero
price, and two disposable-copy pilots. A portable artifact may carry package
versions, test names, observations, unsupported states, and recovery
references; a second VTT is a read-only health receipt, not runtime parity.

### World Doctor direct-incumbent correction after Pass 136

Foundry's current compatibility warnings, version pinning, module locks,
backups, and migration guidance cover the metadata and recovery half of the
promise. Molten's paid Elite plan includes a second testing server, VTT Online
offers version choice and automated backups, and The Forge offers save points.
The remaining distinction is behavioral smoke testing on a clone, but there is
no direct product-specific price evidence for that test runner yet.

Demote World Doctor to a conditional comparison arm. Reopen it only for a
qualified GM with a named recent incident or near miss who prefers the clone
rehearsal over the exact core, hosting, backup, culprit, and duplicate-world
workflow, chooses a non-zero price, and completes a disposable-copy pilot.

### Attendance-Resilient Side Session buyer gate after Pass 137

Recruit paid/professional GMs, organized-play coordinators, and high-variance
West Marches hosts who can name a recent cancellation or attendance change
that wasted booked-session revenue, preparation, or player retention. Home
weekly groups are a required negative control, not evidence of this payer.

Compare the same incident through cancellation/rescheduling, ghosting or
retiring the absent character, a free PDF one-shot, an existing premium
adventure, a duplicate Foundry world, Oronder, and a disposable
Attendance-Resilient Side Session.

The candidate must be a 60–120 minute, no-canon, player-visible capsule that
starts with whoever is present, supports variable party size, ends cleanly,
and produces a player-safe recap without writing hidden state into the main
campaign. Ask **$15, $30, $49, or no purchase** only after the buyer quantifies
the saved booking/prep value. Require 5/8 qualified paid or organized GMs to
prefer it over the exact workaround, 3/8 to choose a non-zero price, and two
real pilots. Reject it if the buyer wants merely another adventure, map pack,
campaign workspace, or generic world-branching tool.

The portability artifact is original narrative/assets plus a neutral story,
party, reward, and recap manifest. Foundry is first; Roll20 or Owlbear begins
as a read-only preview. Any D&D5e or other system-specific stat blocks must be
separately licensed or authored from permitted rules material.

### Combat replay/debrief negative control after Pass 138

Do not test a generic replay, combat analytics, battle recorder, or undo
assistant. Battle Replay, Combat Stats, Damage Log, and PF2e Combater now cover
visual replay, player-safe visibility, timelines, analytics, correction, and
tactical turn planning. Reopen only if a combat-heavy table names a repeated
rules-review or learning failure that survives those exact tools and the
native/system workflow, then chooses a non-zero price and completes a pilot.
The reusable assets are the visibility-filtered event envelope, timeline,
correction receipt, and export boundary.

### Player-friction correction after Pass 139

Do not interpret a high-engagement “players hate Foundry” thread as proof of a
new paid player product. Compare against the current free stack first:
Player Pilot, Foundry Navigator, Token Action HUD/PF2e HUD, hidden-tab and
tutorial workflows, D&D5e Character Builder, and D&D Character Creator with
GM source allowlists and progress visibility. Reopen Player Compass only for a
named repeated failure that survives those exact controls, then ask for a
non-zero price and a real-table pilot.

## Current empirical sequencing gate

The research queue is ordered by evidence, not by novelty or implementation
convenience. Run the buyer tests separately in this order:

1. **Attendance-Resilient Side Session** — bounded high-ROI test for paid,
   professional, and high-variance organizers; home tables are a negative
   control and the product must beat free/adventure/duplicate-world options.
2. **Whisper Drop-In** — productized original content plus asymmetric private
   clues/audio; test whether the buyer pays for the complete scenario, the
   delivery mechanism, or neither.
3. **World Doctor** — conditional comparison arm only: test a named incident
   against Foundry, hosting, backups, culprit isolation, and duplicate worlds.
4. **Player Compass** — recurring use plus a visible premium UX category, but
   compare against the exact HUD stack and orientation workflow.
5. **Campaign Anchor / Version Harbor** — strong upgrade anxiety and a direct
   self-hosting payer hypothesis, but compare against portable installs, The
   Forge, Molten, and the GM's exact backup routine.
6. **VTT BridgeCheck** — strongest urgency and migration payment proxy, but
   compare against the exact importer and manual cleanup.
7. **Adventure Navigator** — recurring session lookup pain and a strong demo,
   but free search, campaign tools, and AI substitutes are close controls.
8. **Rapid Encounter Board** — strongest visual demo for improvisation, but
   MapForge and map-authoring tools are mandatory incumbents.
9. **TableStart** — test only with new or returning players; do not count
   general UI dissatisfaction as onboarding demand.
10. **Session Pulse / Campaign Commitment** — test consequence-aware quorum and
   fallback, not another calendar, against Doodle, Discord Events, Warhorn,
   and the group's exact workflow.
11. **JoinProof / Game Night Gatekeeper** — parked unless a named false-green
   or stale-session failure survives Foundry's own check, FTM, generic monitors,
   and a phone/remote-player check.

Tactical Memory and TableSpeak remain conditional comparison arms. Tabletop
Bridge, LootFlow, TurnReady, Resolve Relay, and JoinProof remain
rejected/parked negative controls. A category payment signal, competitor
subscription, or community
request is not product-specific willingness to pay. Each arm must produce its
own non-zero price choice, exact-alternative rejection, real-table pilot,
runtime safety evidence, licensing boundary, and portability result before
implementation.

### Audio Secrets buyer gate after Pass 142

Recruit audio-heavy paid/professional GMs, horror or investigation GMs, and
organized-play hosts who can name a recent private-whisper, player-specific
music, or scene/level audio incident. Home weekly groups are a required
negative control, not evidence of broad willingness to pay.

Show the same incident through Foundry's global playlists, an explicit
recipient-aware macro, Chris Sound Module, Token Audio FX, Enhanced Region
Behavior, Playlist Plus, and the proposed **Audio Secrets / Scene Sound
Director**. The candidate is a current-version, system-agnostic layer for
user-owned audio that routes to named players, party subsets, token owners, or
scene/region conditions; it queues/loops tracks, supports private preview, and
shows an auditable recipient/zone state.

Ask **$10, $20, $30, or no purchase** only after the buyer names the exact
workaround and the value of avoiding a public/private-audio mistake. Require
5/8 qualified buyers to prefer it over the exact alternatives, 3/8 to choose
a non-zero one-time price, and two three-session pilots. Reject a result that
only values bundled music, a prettier jukebox, or a creator subscription.

The runtime fixture must use synthetic/user-owned audio and two player clients:
recipient changes, token ownership changes, region entry/exit, queued tracks,
reconnect, late join, GM-only preview, and hidden/visible route states. It
must prove no unintended recipients, no audio-path disclosure, deterministic
replay after reconnect, and no live-world mutation beyond the intended route
state. The portable artifact is an audio-route manifest with asset references,
recipient scope, trigger/zone, queue policy, duration, and unsupported fields;
Foundry is first and a second VTT starts as a read-only preview.

### Whisper Drop-In buyer gate after Pass 144

Recruit paid/professional GMs, organized-play or rotating-party hosts, and
horror/investigation GMs who can name a recent cancellation, missing-player,
or private-clue problem. Home weekly groups remain a required negative
control. Do not recruit only audio enthusiasts or creators.

Show a concrete, original 60–120 minute no-canon scenario that starts with
whoever is present, gives players asymmetric private audio clues, supports a
variable party, resolves cleanly, exports explicit rewards/clues, and produces
a player-safe recap without writing hidden state into the main campaign. Test
it against cancellation, a free PDF one-shot, a current premium adventure,
Drop-in Dungeons, Oronder, Soundscape Adventure plus Whisper As, a generic
audio pack, and the buyer's manual workflow.

Ask **$15, $25, $39, or no purchase** after the buyer sees the exact scenario
and alternatives. Require 5/8 qualified buyers to prefer Whisper Drop-In, 3/8
to choose a non-zero one-time price, two real pilots, and a coded home-table
result. Record separately whether payment is for the scenario, the private
delivery mechanism, or both.

The Foundry fixture must use only original or licensed synthetic assets and
two player clients. Test late join, missing player, recipient changes,
private-preview versus public playback, reconnect, duplicate clue prevention,
explicit reward export, safe recap, and no hidden-state writes to the main
campaign. The portable package is PDF/audio plus a neutral scenario/route/
reward/recap manifest; Roll20 or Owlbear begins as a read-only or manually
imported package, with unsupported behavior declared.

### Accessible Table Kit buyer gate after Pass 147

Recruit GMs or table owners with a blind, low-vision, motor-impaired,
keyboard-only, screen-reader, or low-resolution player who can name a recent
Foundry failure. Include paid GMs, schools/libraries, organized-play hosts,
and accessibility-conscious communities, but keep ordinary home tables with
no named accessibility incident as a negative control. Do not recruit only
developers or people who merely agree that accessibility matters.

Show the same named task—joining, reading chat/rolls, opening a sheet,
selecting a token, taking a turn, and recovering focus—through the exact
system sheet, Foundry Navigator, Accessibility Enhancements, native OS tools,
custom CSS, and the proposed **Accessible Table Kit**. The candidate is a
current-version, player-local accessibility layer; it must not copy rules,
replace the system, or mutate actors beyond the player’s already-authorized
action.

Ask **$15, $30, $60, or no purchase** only after the supported scope and exact
alternatives are visible. Require 5/8 qualified buyers to prefer it, 3/8 to
choose a non-zero one-time price, two three-session pilots, and a separate
home-table result. Code whether the buyer would pay personally, whether a GM
would pay for a player, or whether a school/organizer would sponsor support.
Reject a result that values only general social benefit, a one-time setup fix,
or a promise to “make Foundry accessible” without a bounded supported matrix.

The fixture must use synthetic users and supported sheets. Test keyboard-only
navigation, screen-reader labels/announcements, chat and roll reread, focus
recovery after dialogs, low resolution, reconnect, hidden information,
permission boundaries, and a safe native-sheet escape. The portable artifact
is a preference and semantic-action contract—commands, announcements,
focus-target IDs, supported controls, and unsupported states—not a claim of
cross-VTT runtime parity. Foundry is first; a second VTT begins as a
read-only accessibility receipt.

### Migration Safe Harbor / VTT BridgeCheck buyer gate after Pass 150

Recruit active migrating GMs, long-running campaign owners, paid GMs, or
small publishers who can name a recent import that looked successful but
left broken links, missing assets, wrong grids/walls/lights, permissions,
duplicates, overwritten changes, or system/module incompatibilities. Do not
count a general desire for portability; the buyer must have a concrete
post-import failure or a high-cost game-night deadline.

Run the same user-owned migration through the exact source importer—such as
DDB-Importer, R20Exporter/R20Converter, PDF-to-Foundry, or the buyer’s real
source path—then through manual cleanup, Foundry Adventure Documents, Scene
Packer/Asset Report, Asset Auditor, Lore Reference Board, and the proposed
**Migration Safe Harbor**. The candidate is a local, read-only, disposable-
copy assurance pass that reports closure, asset, compatibility, permission,
duplicate, and play-tonight smoke results with repair proposals. It is not a
converter, scraper, credential proxy, or live-world repair tool.

Ask **$10, $25, $50, $75, or no purchase** after the buyer sees the exact
receipt and controls. Require 5/8 qualified buyers to prefer the receipt over
their exact importer-plus-cleanup workflow, 3/8 to choose a non-zero price,
two disposable-copy pilots, and a separate reason code for prevention,
diagnosis, repair guidance, or migration confidence. Reject it if buyers only
want the importer, the free repair tools solve every named failure, or the
value is a one-time favor with no defensible one-time purchase.

The fixture must use synthetic or user-owned exports and disposable worlds.
Test broken document links, missing files, scene geometry, permissions,
duplicate imports, overwrites, version drift, module dependencies, unsupported
fields, reruns, and clean rollback. No D&D Beyond/Roll20 credentials,
scraping, publisher-content retention, license circumvention, or live-world
mutation is allowed. The portable artifact is a versioned receipt containing
IDs, document kinds, asset fingerprints, link states, package versions,
permission scopes, check results, repair proposals, and unsupported states;
the second VTT begins as a read-only receipt consumer.

### Migration payment-proxy correction after Pass 151

DDB-Importer’s Patreon/custom-proxy boundary is evidence that active GMs pay
for import capability, feature access, compatibility maintenance, and support.
Treat it only as a payer-recruitment signal. It does not prove payment for a
separate post-import receipt. Add a matched repeat-value arm in which the same
buyer runs the receipt after a Foundry, D&D5e, or module update and compares it
with package warnings, the importer’s support path, backups, and a manual
clone test. Record separately whether the buyer pays to import, to diagnose a
false-green result, or to catch a later regression.

### Paid-GM attendance economics gate after Pass 152

Recruit paid/professional GMs, organized-play hosts, and event organizers who
can name a recent session damaged by a missing player, late cancellation, or
minimum-seat problem. Verify the concrete consequence: lost fee, refund,
empty seat, forced reschedule, reputation cost, or wasted prep. Keep ordinary
home campaigns that can simply postpone as a negative control.

Show the buyer the actual attendance alternatives before asking for a price:
StartPlaying's charge/skip/refund/removal policy, Warhorn-style registration
and table planning, cancellation, a shortened session, a free one-shot, and
the buyer's own emergency prep. Do not count “attendance is annoying” or
interest in a scheduling dashboard as WTP.

### Table Rescue / Attendance-Resilient Side Session gate after Pass 154

Show the same 60–120 minute original, no-canon rescue scenario in three forms:
the proposed Foundry package, a plain PDF/neutral manifest, and the buyer's
current emergency workflow. The scenario must branch for two, three, and five
players, start without hidden campaign state, support late join or an absent
player, end cleanly, and export rewards/clues/recap without mutating the main
campaign.

Recruit paid/professional GMs, organized-play hosts, and rotating-party
organizers first. Home weekly groups are a required negative control. Ask
**$15, $30, $49, or no purchase** only after the buyer sees the exact scenario
and compares it with cancellation/refund, running short, improvising, a free
one-shot, a premium adventure, Drop-in Dungeons, Oronder, SessionFlow, and
their own emergency folder. Code separately whether the buyer pays for the
content, variable-party branch, Foundry presentation, or campaign-safe export.

Require 5/8 qualified buyers to prefer Table Rescue, 3/8 to choose a non-zero
price, two real session pilots, and a recorded home-table control result. The
product fails if the buyer only wants a generic one-shot, prefers cancelling,
or cannot explain a recurring or high-cost attendance failure.

The fixture uses only original/licensed synthetic assets and a disposable
world. Test two/three/five-player starts, late join, missing player,
branch/reward determinism, public/private clue boundaries, reconnect, recap
export, and no writes to the main campaign. A second-VTT test consumes the
neutral manifest manually; it does not require an account bridge.

### Session Continuity buyer gate after Pass 157

Recruit paid/professional GMs, high-investment campaign owners, and organizers
who can name a recent session where a player was connected but could not see,
move, interact, or trust that their client was current. Record the concrete
cost: lost session time, abandoned encounter, refund, player churn, or forced
restart. Keep ordinary home tables that can casually refresh or postpone as a
negative control.

Show the same failure through Connection Monitor, Performance Optimizer, core
preload/safe mode, a backup/restore path, hosting support, browser/GPU fixes,
and a plain refresh before showing **Session Continuity**. The proposed
product is only a per-client readiness/rejoin receipt: connection, interaction,
scene identity, required asset readiness, last confirmed event, and explicit
pending/unknown action. It must not promise to fix routers, ISPs, browsers,
GPU drivers, arbitrary module conflicts, or uncertain world mutations.

Ask **$10, $20, $40, or no purchase** after the buyer sees the recovery flow.
Require 5/8 qualified buyers to prefer it, 3/8 to choose a non-zero price,
two multi-session pilots, and a separate home-table result. Code whether the
buyer pays for diagnosis, safe rejoin, action-loss prevention, or GM
confidence. Reject a positive result that is merely appreciation for a free
connection banner or a request for better hosting.

The fixture uses two player clients and a disposable world. Test dropped
connection, delayed reconnect, stale scene identity, missing asset, black/gray
scene, low FPS, late join, duplicate input, uncertain action, GM reload, and
recovery without hidden-state leakage. The portable artifact is a neutral
health/recovery receipt that a second VTT can consume manually; no credentials,
player-content upload, or hosted service is required.

### Rest/downtime negative-control gate after Pass 160

Recruit ordinary D&D5e tables that can name a recent rest bottleneck: queued
identify/attune/copy-spell requests, food/water bookkeeping, recovery errors,
or skipped downtime because the GM had to process each player. Separate a
real lost-session-time consequence from a preference for more survival rules.

Show the exact workflow against native D&D5e rests, Rest Recovery 5e, Ionrift
Respite, Stress Points & Rest, Character Builder, and the table's manual
process. Ionrift already offers player self-service activities, GM-approved
events, recovery, meals, custom event packs, and multiple system adapters, so
do not treat interest or praise for a free module as payment evidence.

Ask **$10, $20, $40, or no purchase** only if a named failure survives those
alternatives. Require 5/8 qualified tables to prefer a specific unresolved
job, 3/8 to choose a non-zero price, and two pilots. Reject a broad rest
engine, a copied event pack, or a positive result based only on enthusiasm,
survival-rule preference, or creator interest. Keep activity, approval, and
event schemas as reusable assets rather than selecting a product.

### Playability Budget / Media Safe Pack buyer gate after Pass 163

Recruit asset-heavy GMs, paid/professional hosts, and campaign owners who can
name a recent black/gray scene, stalled load, missing media, or player forced
onto a screen share. Record the consequence in minutes lost, abandoned
encounter, refund, player exclusion, or repeated cleanup. Keep home tables
with small static maps as a negative control.

Show the same user-owned fixture through the official Media Optimization Guide,
Geano's Scene Optimizer, DF Architect, external image/audio tools, core
preload, hosting/S3, and manual copies before showing the proposed product.
The candidate is only a local read-only assurance pass plus confirmed,
non-destructive optimized variants: asset budgets, dimensions, codecs, missing
paths, per-client risk, fidelity check, and rollback.

Ask **$10, $25, $50, or no purchase** after the buyer sees the exact failure
and alternatives. Require 5/8 qualified buyers to prefer it, 3/8 to choose a
non-zero price, two multi-session or multi-world pilots, and a home-table
control. Code whether payment is for conversion, diagnosis, player exclusion
prevention, or rollback confidence. Reject a result that is merely gratitude
for a smaller file or a request for hosting.

The fixture uses synthetic or user-owned assets and two player clients. Test
large dimensions, image/audio/video codecs, missing paths, duplicates,
preload, low disk/bandwidth/GPU, browser differences, visual/audio fidelity,
rollback, and no live-world mutation. Export a neutral manifest for a second
VTT; do not retain or redistribute publisher content.

### Market correction after Pass 164

The asset candidate must now be shown against the current paid **Media
Optimizer** as well as the official guide, DF Architect, external tools,
preload, hosting, and manual copies. Do not count a smaller file as a product
win. Only reopen it if a buyer pays for a verified client-risk decision,
fidelity/rollback receipt, or a repeatable post-update assurance job that the
incumbent does not provide.

Run the next payer gate on **Table Rescue / Attendance-Resilient Side
Session**. Recruit paid/professional GMs, organized-play hosts, and
rotating-party organizers who can document a missed-player, cancellation, or
minimum-seat incident and its concrete cost. Keep an ordinary home group that
can simply postpone as a negative control.

Show the same 60–120 minute original scenario as: the proposed Foundry
package, a neutral PDF/manifest, the buyer's emergency workflow, a free
one-shot, and an existing premium side adventure. The package must enter at
two, three, and five players; support a late join or absent character; keep
secrets scoped; end cleanly; and export rewards, clues, and recap without
mutating the main campaign. Ask **$15, $30, $49, or no purchase** only after
the comparison. Code whether payment is for content, party-size branching,
Foundry presentation, or campaign-safe export.

Require 5/8 qualified buyers to prefer it, 3/8 to choose a non-zero price,
two real session pilots, and a second-scenario or season-pack repeat-value
test. Reject it if buyers only want a generic one-shot, prefer cancelling,
cannot name a recurring/high-cost attendance failure, or would buy only one
isolated rescue with no defensible one-time or repeat price. The portable
artifact remains a PDF plus neutral scenario/branch/reward/recap manifest;
use only original or licensed assets and no hosted account bridge.

### Playability Budget implementation-design gate after Pass 165

The Injector v2 transport is reusable infrastructure, not buyer proof. Before
building a public package, verify the smallest useful workflow with a
disposable Foundry v14 world and user-owned/synthetic assets:

- packer emits canonical JSON, a manifest, stable asset IDs, frame digests, and
  a whole-package digest;
- the receiver accepts duplicate/out-of-order frames, resumes after refresh,
  rejects conflicting or corrupt frames, and commits only after verification;
- structured documents use an Adventure/Compendium preview/import path;
- binary files remain external to scene JSON and use verified upload/staging;
- the audit is read-only and emits a risk receipt without claiming universal
  client compatibility;
- a mismatched base digest, missing asset, failed upload, or partial transfer
  stops safely and leaves the original world untouched.

Use a short bootstrap macro only as a transport entry point. Do not paste a
large map or package into a macro, do not create thousands of documents from
injected text, and do not treat Base64 as compression. Test the actual macro,
clipboard, browser, and server limits empirically rather than assuming a
fixed safe frame size.

The first technical timebox is **10 working days** for a read-only audit plus
verified package receiver, using the existing DiceBox media registry,
attestation, file-browse, receipt, and fixture contracts. The next **5–10
working days** are reserved for side-by-side image variants and rollback. Do
not add audio/video conversion or cross-VTT runtime claims until those slices
pass clean-world, refresh, duplicate, corruption, and read-back tests.

### Star*Tup technical gate after Pass 166

Treat startup profiling as an engineering gate, not proof that a product will
sell. Build an exact-stack disposable fixture with one GM client and one player
client. Capture cold and warm runs for navigation, world/document readiness,
first usable UI, scene activation, first usable map, resource transfer, main
thread long tasks, and browser/GPU/network state. Record unsupported metrics as
unknown. Do not infer per-module blame from a single trace.

The first comparison should be baseline versus one dependency-aware reversible
profile, followed by a restore run. Require no live-world writes, no direct
database edits, no hidden module mutation, and a receipt containing the active
module/settings snapshot, profile delta, timing deltas, confidence level, and
rollback result. A profile only counts as useful if it improves first usable
map time or first interaction on the declared client class without breaking a
tested workflow.

The candidate remains technically promising but market-unselected. Compare it
against Foundry's own module controls, existing performance/preload tools,
manual module profiles, browser DevTools, and asset converters. A later payer
test should ask whether buyers pay for a repeatable diagnosis and safe profile
decision, not merely for a faster benchmark or a smaller file.

### Star*Tup asset gate after Pass 167

Use a synthetic or user-owned fixture with one large map background, many tiles,
animated media, duplicate assets, missing paths, and two client profiles. Run
the same scene with source assets, a content-addressed derivative set, and
Foundry's existing preload workflow. Record transfer bytes, decode failures,
first usable map time, first interaction, visual fidelity, audio/video behavior,
cache hit/miss, and rollback. Do not count a smaller file as a win if decode,
GPU pressure, quality, or client usability worsens.

The cache test must clear or deny browser storage, change the source hash, and
change the target profile. Star*Tup must report misses and unsupported states,
not silently reuse stale derivatives. The preload test must cap concurrency,
stop on budget exhaustion, and show whether the player actually became ready
earlier. Compare directly against Foundry preload, Media Optimizer, free command
line tools, and manual copies before considering a paid feature.

### Star*Tup rollback gate after Pass 168

Test client and world profiles separately. A player profile may change only
client-scoped behavior and asset selection; a world/module profile requires GM
authority, dependency explanation, a reload or disposable clone, and an
authoritative reread. Capture the exact Foundry/system/module versions,
settings scopes, world identity, asset manifest, base hash, requested diff,
observed diff, and rollback result.

Run a clean profile, a changed-base profile, a failed-reload profile, a missing
asset profile, and a restored profile. The system must stop on stale or unknown
state, preserve foreign fields, and never claim that a Foundry snapshot alone
restores external media. A buyer-facing profile counts as safe only when the
original world configuration and every referenced asset remain recoverable.

### Star*Tup portability gate after Pass 169

Export one neutral manifest, profile intent, timing receipt, capability report,
and rollback receipt from the Foundry fixture. Then consume it manually in an
Owlbear extension or a Roll20 Mod Script fixture without pretending that the
platforms share module lifecycle, filesystem, or permission behavior.

The second-platform test must show which fields are supported, translated, or
refused. A successful export is not portability proof unless the receiving
adapter preserves stable asset IDs, unknown fields, unsupported states, and
privacy boundaries. Do not add a second runtime optimizer until a user names a
cross-VTT workflow that is worth the additional adapter and support cost.
