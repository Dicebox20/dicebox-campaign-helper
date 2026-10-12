# Regionwright: Hunting & Gathering Roadmap

## Product boundary
Regionwright: Hunting & Gathering is a standalone Regionwright module for environmental resource gameplay. It will ultimately own Hunting, Fishing, Mining, and Gathering/Foraging. Existing Fishing and Mining modules remain authoritative while the umbrella package is scaffolded; migration happens only after the shared architecture is proven.

## Mini-HUD architecture (2026-10-04)
- Use the Regionwright Puzzle HUD as the reference pattern: active-GM gated, compact DialogV2, fixed safe controls, small public API, and runtime delegation rather than copied subsystem logic.
- Do not copy Studio's launchpad, blueprint compiler, encounter state, macro injection, or other authoring machinery.
- New module ID: `regionwright-hunting-gathering`.
- HUD tabs: Hunting, Fishing, Mining, Gathering.
- Fishing and Mining tabs are functional through their existing public APIs. Hunting and Gathering are visible but explicitly unavailable until their systems exist.
- HUD owns only orchestration: selected Region context, setup controls, clear controls, and GM/player no-write tests. It does not own Fishing or Mining catalogs or gameplay logic yet.
- No new socket layer is needed while actions delegate to subsystem APIs.
- One Region Controls button opens the mini-HUD. Legacy Fishing/Mining controls are not removed during the scaffold phase.

## Hunting v0.1 gameplay (2026-10-04)
- Hunting's player-facing loop is: Roll Survival to track -> Roll Stealth to determine shot distance -> bow-shooting minigame -> Roll Survival to harvest after a lethal shot.
- Survival, Stealth, and harvest rolls are real visible D&D5e skill rolls initiated by buttons in the Hunting UI. No automatic hidden replacement rolls.
- Tracking result determines encounter/quarry quality within the hunting-ground catalogue. Stealth result determines real shot distance and matching target-art scale.
- Shooting is the focal mechanic: mouse aim; hold left mouse to draw; release to fire; right mouse while drawing cancels/lowers the bow.
- Projectile result is driven by draw strength, real distance, gravity, wind, and current aim sway. Player-facing visual and physics use the same distance state.
- Real hunts require the dedicated module-owned `Hunting Bow`. Generic shortbows, longbows, crossbows, magical bows, or name matches do not qualify. The GM tester bypasses the equipment gate.
- First prototype uses one test quarry and focuses on tuning physics before the animal catalogue expands.

## Regionwright UI language (2026-10-04)
- Regionwright dialogs should visually defer to Foundry's own window chrome instead of stacking decorative cards inside the application.
- Default content surface: translucent charcoal gray, with readable neutral text and restrained warm accent color only for active states and important results.
- Section hierarchy should come from typography, spacing, and subtle horizontal dividers. Ordinary text, labels, and results remain directly on the main window surface.
- Avoid bordered/filled card-style containers for headers, Track/Approach/Harvest steps, setup groups, status text, and routine controls.
- Keep explicit borders only where they communicate function, such as a game canvas/range, form controls, tabs, and interactive buttons.
- Prefer Foundry-native CSS variables when available, with charcoal fallbacks so the interface stays coherent across themes.
- Hunting & Gathering v0.2.1 is the first implementation of this UI language; use it as the reference for later Fishing, Mining, Studio, Puzzles, and Traps visual cleanup.

## Native Foundry UI rule (2026-10-04)
- Supersedes the v0.2.1 custom charcoal imitation: Regionwright should inherit Foundry core styling directly wherever a native control or application style exists.
- Regionwright dialogs use Foundry `DialogV2` application chrome and `standard-form` conventions. Do not paint a separate Regionwright window background.
- Buttons, selects, checkboxes, focus rings, disabled states, and text colors should be native Foundry controls/variables without Regionwright-specific restyling.
- Use Foundry application variables (`--background`, `--color-border`, `--color-form-label`, `--color-form-hint`, `--color-text-primary`, `--color-text-accent`, `--color-warm-*`) for the limited structural styling that remains.
- Custom CSS should be limited to layout, spacing, small status/result hierarchy, tab geometry where necessary, and game-specific canvases/visualizations.
- This makes Regionwright follow Foundry theme changes automatically and keeps the interface familiar.

## Hunting v0.3.0 live-play corrections (2026-10-04)
- Separate character-roll UI from the bow-shooting UI. Track/Approach/Harvest checks live in compact Foundry roll windows; the shooting window contains only hunt/ballistics content.
- Hunting roll buttons immediately perform the Actor skill check with no D&D5e configuration popup.
- Hunting Survival and Stealth checks are explicitly normal d20 rolls. Hunting ignores advantage/disadvantage modes for these module-owned checks while retaining the Actor current skill parts/modifiers/proficiency/expertise.
- The quarry artwork must render on initial Hunt-window open. Show Hitboxes only toggles the anatomical overlay and must never be required to make the quarry visible.
- The Hunting Bow is sight-zeroed at a practical baseline range so full-draw ordinary-range shots do not exhibit the raw drop of a perfectly horizontal launch. Gravity, distance, launch angle, draw strength, wind, and sway remain physical shot inputs.
- Fired aim/impact markers must stay registered to the quarry when the Hunt window is resized. Shot-state markers use target-local coordinates rather than stale arena pixels.

## Hunting v0.3.1 source-backed ballistics (2026-10-04)
- Replaced the simplified projectile approximation with fourth-order Runge-Kutta integration.
- Calibration reference: Hans-Otto Meyer, Applications of Physics to Archery. Sample-arrow launch speed 74.5 m/s; velocity-decay constant kappa = 0.00231 m^-1; drag proportional to velocity squared above about 10 m/s; numerical Runge-Kutta sight predictions closely matched shooting-machine measurements.
- Secondary implementation reference: K. Dusling Archery Ballistics Calculator, which solves arrow-flight equations with fourth-order Runge-Kutta.
- The Regionwright Hunting Bow uses 7 cm sight height and practical 20/30/40/50/60-yard sight references. The closest lower pin is selected for the known shot distance.
- Wind is now modeled as moving air inside the relative-velocity drag equation, not as an independent artificial lateral acceleration.
- Expected full-draw calibration at 65 yd using the 60 yd pin: about 0.28 m low in calm air; about 0.31 m lateral drift in a 12 mph crosswind.

## Hunting v0.3.2 draw-feel playtest (2026-10-04)
- This is explicitly a playtest revision. Do not treat the draw timings or placeholder bow visual as permanent until user play feedback accepts them.
- Full draw time increases from 0.8s to 1.5s.
- Draw feedback adds visible 50%, 75%, and 100% milestone markers. Each marker pulses once when crossed; these are feedback only, not discrete shot-quality tiers.
- Draw strength remains continuous and feeds the existing physical ballistics at the exact release percentage.
- Full draw has an approximately 0.7s settled window before fatigue begins increasing sway. The timing target is preparation for a shot opportunity, not selection among weak/good/perfect shot types.
- A temporary four-stage bow visual is added: rest, half draw, heavy draw, full draw. It is a replaceable visual hook for future art assets, not the physics state itself.

## Hunting v0.3.3 tension-curve playtest (2026-10-04)
- v0.3.2 draw milestone pulses, four-stage placeholder bow visual, and settled-window experiment were rejected in live play and are removed.
- Draw returns to a visually simple bar but uses a nonlinear tension curve instead of linear fill.
- Full draw target is 1.3 seconds with quadratic ease-out: about 50% at 0.38s, 75% at 0.65s, 90% at 0.89s, 95% at 1.01s, and 100% at 1.30s.
- The intended feel is a natural initial pull followed by a visibly resistant final portion near full tension.
- Exact continuous draw strength continues feeding the RK4 ballistics; no discrete draw-quality tiers are introduced.

## Hunting v0.3.4 heavy-bow resistance playtest (2026-10-04)
- Bring back the 50%, 75%, and 100% draw markers and their one-shot pulse feedback from v0.3.2. Do not restore the rejected four-stage placeholder bow visual or discrete shot-quality behavior.
- Replace arbitrary ease-out draw timing with a force/work-inspired model: a non-compound hunting bow grows heavier toward full draw, and draw progress is modeled as constant player pulling power against increasing bow force.
- Reference: ATA force-draw terminology defines non-compound bows as usually reaching peak draw force at full draw, while compound bows peak earlier and let off. This playtest intentionally follows the non-compound heavy-bow feel because the desired sensation is increasing resistance near full capacity.
- Playtest parameters: 2.5 seconds to full draw; normalized initial/brace resistance fraction 0.20; linearly increasing normalized draw force to 1.0 at full draw. Expected threshold timing is approximately 50% at 0.83s, 75% at 1.56s, 90% at 2.10s, 95% at 2.30s, 100% at 2.50s.
- Exact continuous draw fraction still feeds RK4 ballistics. Markers are feedback only.

## Hunting v0.3.5 windage and stable-reticle playtest (2026-10-04)
- Keep crosswind inside the RK4 arrow-flight calculation as air-relative velocity. Do not apply a separate invisible accuracy penalty.
- Make wind mechanically legible in the Hunt window with a prominent on-range arrow pointing in the direction the air pushes the projectile and a numeric mph readout. Positive crosswind points/pushes right; negative crosswind points/pushes left; calm renders explicitly.
- Shot results report both wind-drift magnitude and direction.
- Remove automatic reticle sway from live Hunting. The reticle follows mouse position only; no sinusoidal/fatigue motion is added because live play found it visually uncomfortable and it did not improve the game.
- Preserve draw resistance, 50/75/100 pulse markers, sight pins, and RK4 ballistics from v0.3.4.

## Hunting v0.3.6 back-loaded draw gradient playtest (2026-10-04)
- The v0.3.4/0.3.5 heavy-bow draw curve remains too fast through the early and middle draw.
- New target feel: 0-50% should happen very quickly, 50-75% should slow dramatically, and 75-100% should become a crawl while remaining visually smooth with no discrete speed steps.
- Replace the current linear-force work curve with a smooth back-loaded time curve: normalized elapsed time T(s) = a*s + (1-a)*s^p, with a=0.12 and p=4, inverted numerically/analytically for live draw strength.
- Full draw target increases to 4.0 seconds. Expected timing is approximately 50% at 0.46s, 75% at 1.47s, 90% at 2.74s, 95% at 3.32s, 100% at 4.00s.
- Preserve continuous release strength, RK4 ballistics, windage UI, stationary reticle, and 50/75/100 pulse markers.

## Hunting v0.3.7 moving-quarry playtest (2026-10-04)
- Whitetail quarry moves horizontally through the shooting lane instead of remaining static.
- Motion is smooth and deterministic for the hunt seed: walking phases alternate with short stationary shooting windows. The player can anticipate a pause and begin the long heavy-bow draw before the opening.
- Movement is gameplay, not decoration. Arrow impact is evaluated against the quarry position at arrow arrival time, so shooting while the deer is walking requires horizontal lead. Waiting for a pause removes that movement lead requirement.
- Preserve stationary mouse-only reticle, windage, RK4 ballistics, back-loaded 4-second draw, and 50/75/100 pulses.
- The first movement pass remains side-on/broadside. More complex turning/quartering behavior is deferred until basic movement feel is accepted.

## Hunting v0.3.8 stamina playtest (2026-10-04)
- Add a visible Stamina gauge to the Hunt window to create finite hold tension while the quarry moves.
- Stamina starts at 100%. Drawing drains stamina continuously based on current draw strength, so the easy first half costs less, the resistant final portion costs more, and holding at full draw is the most expensive state.
- Releasing a shot stops stamina drain. Lowering/canceling the bow stops drain and begins recovery after a short delay.
- At 0 stamina, the bow automatically lowers instead of firing. The player must recover before drawing again.
- Keep stamina separate from accuracy: no hidden penalty, no automatic reticle sway, and no discrete shot-quality modifier. The cost is lost time/opportunity while the moving quarry continues its behavior cycle.
- Preserve v0.3.7 moving quarry, arrow-arrival lead, v0.3.6 draw curve, windage, RK4 ballistics, and 50/75/100 draw pulses.

## Hunting v0.3.9 draw-sensitive arrow speed (2026-10-04)
- Correct the launch-speed curve so partial draw dramatically reduces arrow velocity, not merely range/drop.
- Preserve the source-backed 74.5 m/s full-draw reference. Replace the current sublinear strength exponent (0.82), which gives partial draws too much speed, with a strongly back-loaded speed curve.
- Playtest curve: minimum launch speed 5 m/s and quadratic strength scaling: v = 5 + (74.5 - 5) * strength^2.
- Expected launch speeds: 50% draw about 22.4 m/s; 75% about 44.1 m/s; 90% about 61.3 m/s; 100% 74.5 m/s.
- RK4 flight time continues to drive moving-quarry lead. Lower draw therefore means longer flight and substantially more target displacement before impact; full draw minimizes the lead window.
- Keep the v0.3.8 draw gradient, stamina, moving quarry, windage, and mouse-only reticle unchanged.

## Hunting v0.3.10 force-draw energy model (2026-10-04)
- Replace the hand-tuned quadratic draw-strength -> arrow-speed rule with an energy-derived model.
- Source basis: World Archery identifies the area under the force-draw curve as stored bow energy and defines bow efficiency as arrow kinetic energy divided by stored bow energy. Bow mechanics literature likewise defines stored energy as the integral of force over draw displacement.
- Reuse the accepted v0.3.6 draw-time curve as the normalized cumulative work curve. Under the existing constant-player-power interpretation, normalized elapsed draw time equals normalized work/energy stored: E(s)/E_full = T(s) = 0.12*s + 0.88*s^4.
- With constant arrow mass and bow efficiency across partial draw, kinetic energy gives v(s)/v_full = sqrt(E(s)/E_full). Therefore arrow speed is derived from stored-energy fraction rather than an independent tuning exponent.
- Preserve the calibrated full-draw launch speed of 74.5 m/s. Engine remains SI internally; player-facing launch speed is reported in feet per second (fps).
- Preserve RK4 trajectory, sight pins, windage, moving-quarry lead, stamina, and the accepted draw gradient.

### Future draw-speed calibration rule (2026-10-04)
- If Hunting draw timing is later changed from the current playtest curve to measured real-world bow timing, do not independently retune arrow speed.
- Replace/calibrate the force-draw/time relationship first, recompute normalized stored energy from that curve, and continue deriving arrow launch velocity from v/v_full = sqrt(E/E_full).
- Preserve the full-draw velocity calibration independently unless better equipment-specific chronograph evidence replaces it.

## Hunting v0.3.11 realistic warbow draw model (2026-10-04)
- Replace the dramatic fourth-power playtest draw curve with a physically motivated medieval/heavy self-bow approximation.
- Model normalized bow draw force as approximately linear with draw fraction: F/F_full = s.
- Stored energy is therefore proportional to the area under the force-draw curve, giving E/E_full = s^2.
- Under the existing constant-player-power assumption, elapsed draw time is proportional to accumulated work, so normalized draw time is T(s)=s^2.
- First realistic playtest uses 2.5 seconds to full draw. Expected timing: 50%=0.625s, 75%=1.406s, 90%=2.025s, 95%=2.256s, 100%=2.500s.
- Because v/v_full=sqrt(E/E_full), the same model naturally gives launch-speed ratio v/v_full=s for this linear-force bow.
- Preserve the current full-draw launch calibration of 74.5 m/s for now. Changing that to a Mary-Rose-style heavy-war-arrow calibration is a separate future decision.
- Preserve windage, moving-quarry lead, stamina, pulse markers, mouse-only reticle, and RK4 trajectory.

## Hunting v0.3.12 synchronized flight + lead cue playtest (2026-10-04)
- Fix the visual/physics desynchronization first. The arrow animation and deer motion must use the same real RK4 flight duration with no 1.1-second visual cap and no fast-forwarded quarry motion.
- Animate the projectile from sampled RK4 trajectory points rather than easing directly to the final impact point.
- Add a subtle movement-only lead chevron ahead of a walking deer. It predicts the deer center at arrow arrival assuming current deterministic movement continues.
- Lead prediction is recalculated continuously from current draw strength because draw strength changes launch velocity and flight time. The cue intentionally excludes wind and vertical drop so the player still combines separate information sources.
- Hide/suppress the lead cue when the quarry is effectively paused or when predicted displacement is negligible.
- Add a short-lived tracer trail after release so players can see the actual arrow path and learn from misses.
- Preserve v0.3.11 warbow draw/energy model, stamina, wind HUD, mouse-only reticle, sight pins, and anatomical hit classification.

## Hunting v0.3.13 conservative moving-target aim forgiveness (2026-10-04)
- Remove the v0.3.12 visible Lead chevron from live Hunting because it did not work well in play.
- Keep synchronized RK4 arrow rendering and tracer feedback.
- Add a small invisible moving-target aim-forgiveness layer inspired by Skyrim-style combat aim correction, without copying Skyrim projectile math.
- Forgiveness is eligible only while the quarry is moving, only when the player has led in the correct horizontal direction, and only when the physical impact is a small horizontal near-miss of the body. Vertical misses and trailing shots receive no assistance.
- Maximum horizontal correction is 0.12 m in deer-relative space. The correction is applied only if it converts a miss into a body/anatomical contact; otherwise the physical result is preserved.
- The visible arrow/tracer path remains the real RK4 path. Aim forgiveness changes only the final collision tolerance, not the rendered trajectory.
- Preserve warbow draw/energy model, stamina, windage, synchronized flight clock, and anatomical classification.

## Hunting v0.3.14 calm-only drop calibration mode (2026-10-04)
- Temporarily remove wind as a live Hunting factor so gravity/drop can be calibrated in isolation.
- All live Hunting projectile calculations use windMph=0 regardless of deterministic wind seed.
- Remove the live wind HUD/arrow and wind-compensation instruction text.
- Remove wind-drift text from the post-shot result while calm-only mode is active.
- Preserve the underlying deterministicWind and RK4 air-relative wind code dormant for later reactivation after drop calibration is accepted.
- Preserve warbow draw/energy model, synchronized flight/tracer, moving quarry, stamina, sight pins, and v0.3.13 bounded moving-target aim forgiveness.

## Hunting v0.3.15 heavy-bow stamina feel + Skyrim math audit (2026-10-04)
- Re-audit Skyrim bow calculations against public reverse-engineered SmoothCam/Archery Behavior Overhaul code. The math is language-agnostic and translates directly to Java: scalar draw-power interpolation, scalar launch-speed multiplication, and sin/cos velocity decomposition. Regionwright remains JavaScript/Foundry, so no runtime port is required now.
- Preserve Regionwright's more physical energy/RK4 model rather than replacing it with Skyrim's simpler projectile math.
- Research-backed feel cues: heavier/slower draw, stamina drain while drawing/holding, strong draw/release/travel/impact audio, escalating fatigue feedback, and optional shake. Do not add camera/reticle shake because user previously reported vertigo; use UI feedback instead.
- Strengthen stamina struggle: keep effort-weighted drain shape but raise full-draw drain from 17/s to 24/s (base 1 + extra 23). With T(s)=s^2, drain rate rises linearly through the 2.5s draw, leaving ~68.75 stamina at full draw and ~2.86s of full-draw hold from fresh.
- Make stamina visually oppose draw: draw rises toward full while stamina depletion accelerates downward as draw effort rises. At <=50% stamina, the stamina meter pulses red; pulse period shortens continuously from ~1100ms at 50% to ~350ms near zero. Reduced-motion preference disables the animation but preserves warning color.
- Change 50/75/100 draw milestone reached/pulse visuals from warm/red-adjacent colors to Foundry success green.
- Carry forward v0.3.14 calm-only drop calibration in this build; no wind HUD/live wind influence until drop is accepted.

### Future ability-score integration: Dexterity + Constitution (accepted 2026-10-04)
- Do not attach character ability scores until neutral-stat bow physics, drop, draw feel, and stamina feel are accepted.
- Dexterity will modify draw handling/timing, not the bow force-draw or stored-energy equations. The same physical bow should store the same energy at the same draw fraction regardless of user.
- Constitution will modify stamina capacity, full-draw holding endurance, and recovery behavior.
- Preserve separation between equipment physics and character capability: bow model determines force/energy/projectile behavior; actor stats determine how efficiently the user reaches and sustains that state.
- Exact D&D5e scaling formula remains intentionally undecided until neutral calibration is complete.

## Hunting v0.3.16 Ballistics Lab + unified projectile simulation (2026-10-04)
- Add a GM-only Regionwright Ballistics Lab for deterministic drop calibration before changing live Hunting constants.
- Refactor toward one canonical projectile simulation result consumed by impact math, tracer/rendering, and the lab so preview and result cannot drift apart.
- Lab profiles: Current Hybrid (live calibration), Meyer Reference (20.62 g, 74.5 m/s, kappa 0.00231), Heavy Warbow Reference (85 g, 55.1 m/s, provisional kappa retained until fitted from downrange data).
- Lab range presets: 18,20,25,30,35,40,45,50,55,60,65 yd. Draw presets: 50,75,90,100 percent.
- Lab aiming modes: Traditional/Unsighted (no automatic pin elevation), Pin Sight (current closest-lower 20/30/40/50/60 yd behavior), Explicit Zero (single user-selected zero distance).
- Lab target is stationary and wind is locked to 0. Moving quarry, aim forgiveness, stamina pressure, and actor stats do not affect lab ballistics.
- Distinguish raw horizontal-launch fall from sight-compensated point-of-aim error. Show launch speed, arrow mass, kinetic energy, flight time, impact speed, launch/elevation angle, raw fall, sighted error, meters-to-pixels scale, and final pixel offset.
- Verify displayed pixel offset is derived from the same physical meters-to-pixels conversion used to place the lab impact marker.
- Provide a Copy Diagnostic Report action for easy playtest feedback.
- Preserve live Hunting calm-only mode, v0.3.15 stamina/draw feedback, moving quarry, synchronized tracer, and bounded moving-target forgiveness.

## Hunting v0.3.17 Ballistics Lab ResizeObserver safety hotfix (2026-10-04)
- Ballistics Lab testing reproduced a client exception because ResizeObserver.observe could receive a missing plot target during render timing.
- Only attach the resize observer when a concrete Element exists. Otherwise continue without resize observation.
- Ballistic calculations and live Hunting behavior stay unchanged.


## Hunting v0.3.18 Ballistics Lab graph reliability patch (2026-10-04)
- Live v0.3.17 testing shows the graph legend and numeric diagnostics, but the trajectory plot itself is absent.
- No Foundry/core CSS override was found for the plot class, so stop relying on an inline SVG surviving DialogV2 content parsing/render timing.
- Create the SVG plot programmatically after render inside a stable HTML mount point.
- Add an explicit Show/Hide Graph control. Showing the graph must recreate the SVG if it is missing and rerender the current shot.
- Keep all ballistic math, profiles, diagnostics, and live Hunting behavior unchanged.


## Hunting v0.3.19 Ballistics Lab canvas renderer (2026-10-04)
- Live v0.3.18 diagnostic proves the graph mount is connected, visible, and 719x330 px, but has zero children and no SVG.
- Replace the trajectory SVG renderer with an HTML canvas renderer while preserving the same RK4 samples, projection math, diagnostics, and Show/Hide recovery control.
- Canvas must draw line of sight, launch axis, RK4 trajectory, target plane, deer-height reference, and impact marker from the existing projection result.
- Keep all ballistic calculations unchanged.


## Hunting v0.3.20 Trained Holdover lab mode (2026-10-04)
- Add a Ballistics Lab-only Trained Holdover aiming mode for elite/fantasy archers.
- Trained Holdover solves the launch elevation required to intersect the point of aim at the selected range using the selected ballistic profile and the shot's actual draw-dependent launch speed.
- This is not a mechanical sight. It represents a skilled archer applying learned range compensation.
- Keep Current Hybrid bow constants, gravity, drag, RK4 integration, live Hunting, and all existing aiming modes unchanged.
- Use the mode to validate Current Hybrid at 20, 35, 50, and 65 yd at 100% draw before attaching Dexterity/Constitution scaling.


## Hunting v0.3.21 Live Trained Holdover calibration (2026-10-04)
- Add a GM-only live Hunt calibration option that applies the Ballistics Lab Trained Holdover elevation to the real shooting window.
- The calibration uses the actual selected range and actual draw-dependent launch speed while preserving the Current Hybrid bow constants, gravity, drag, RK4 flight, stamina, moving quarry, arrow animation, anatomy collision, and existing moving-target forgiveness.
- Normal player Hunting remains unchanged until live calibration is accepted.
- Calibration should make aiming directly at an anatomical point represent the expert archer's learned holdover, without a visible mechanical sight or predictive lead marker.
- Validate fixed 20, 35, 50, and 65 yd full-draw shots before locking bow physics and implementing Dexterity/Constitution scaling.


## Hunting v0.3.22 Test-mode framework and physical quarry movement (2026-10-04)
- Replace one-off Hunting calibration launch controls with a GM-selectable testing mode framework.
- Initial modes: Normal Test Hunt, Live Trained Holdover, and Movement Calibration.
- Live Trained Holdover keeps fixed 20/35/50/65 yd options and exact anatomy-point vertical compensation.
- Movement Calibration uses the real Hunt window but focuses on repeatable moving-target diagnostics; no rewards.
- Refactor quarry movement so physical lateral travel is defined in metres and metres/second independently of rendered deer scale or range.
- Project physical quarry position into screen space only for rendering.
- Expand shot diagnostics with release velocity, movement phase, physical target displacement during flight, aim lead at release, and final horizontal miss relative to quarry.
- Normal player Hunting remains unchanged except for the corrected physical quarry movement model.


## Hunting v0.3.23 movement phase-label cleanup (2026-10-04)
- Correct the diagnostic movement phase label when a movement profile is reversed.
- Do not change quarry position, velocity, lane size, easing, pauses, reversal timing, ballistics, hit resolution, or forgiveness.
- After deployment, proceed to Live Trained Holdover testing at 20 yd, 100% draw, lungs target.


## Hunting v0.3.24 Testing-only anatomical target (2026-10-04)
- Add a testing-only anatomical deer target profile based on the broadside deer anatomy reference supplied during calibration.
- Keep production deer art and normal Hunting hit zones unchanged.
- GM test modes use clearer lungs behind the front shoulder, a small low/front heart zone, a separate abdomen/gut zone, broad body catch-all, and existing head/neck and leg zones.
- The visible test overlay and the test-only hit-classification geometry must use the same zone definitions.
- Preserve validated bow physics, trained holdover, physical quarry movement, stamina, flight timing, and forgiveness.
- Arm the external crash monitor before restarting Foundry after deployment.


## Hunting v0.3.25 impact-visual synchronization (2026-10-04)
- Make the animated arrow tip, tracer endpoint, and deer-local impact marker converge on the same impact-time position.
- Preserve validated projectile physics, physical quarry motion, trained holdover, anatomy, hit classification, forgiveness, and stamina unchanged.
- The fix is presentation synchronization only: the existing resolved hit remains authoritative.
- Keep the external crash monitor armed through deployment and live retest.

