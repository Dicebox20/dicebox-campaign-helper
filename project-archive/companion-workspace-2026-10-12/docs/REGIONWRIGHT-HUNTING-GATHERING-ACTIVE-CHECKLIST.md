# Regionwright: Hunting & Gathering Active Checklist

## Hunting v0.1
- [x] Lock visible Survival -> Stealth -> Shoot -> Survival harvest flow.
- [x] Lock dedicated Regionwright Hunting Bow requirement; no generic bow-name matching.
- [x] Implement deterministic/testable tracking, distance, ballistics, and harvest engine helpers.
- [x] Implement Hunting Bow world-item installer and exact flag-based inventory gate.
- [x] Implement playable Hunting dialog and H&G HUD launcher/test controls.
- [x] Add tests, build v0.2.0, run full Regionwright regression, and verify source/dist hashes.
- [x] Install H&G v0.2.0 and restart `regionwright-testmap` after explicit user request; served files verified.\r\n- [ ] Enable `regionwright-hunting-gathering` in the test world module configuration, then perform live Hunting feel/certification testing.



## Regionwright UI refresh v0.2.1
- [x] Accept Foundry-like translucent charcoal window styling and removal of nested decorative cards.
- [x] Flatten H&G HUD and Hunting stage layout onto the window surface.
- [x] Preserve borders only for controls and the shooting range.
- [x] Validate, build, deploy v0.2.1, restart exact test world, and verify served CSS/version.


## Native Foundry UI v0.2.2
- [x] Replace custom charcoal imitation with Foundry `standard-form` and native `nav.tabs` conventions.
- [x] Remove custom DialogV2/window-content, button, select, checkbox, hover, and focus skinning.
- [x] Limit Regionwright CSS to layout, native Foundry variables, and the game-specific shooting canvas.
- [x] Pass 262/262 Regionwright tests, build/hash verification, deploy, restart `regionwright-testmap`, and verify served v0.2.2.

## Hunting v0.3.0 live-play corrections
- [x] Accept separate roll and Hunt windows.
- [x] Accept immediate normal-only skill checks without the D&D5e roll configuration dialog.
- [x] Accept always-visible quarry artwork; hitbox control overlays anatomy only.
- [x] Accept sight-zeroed bow trajectory and resize-stable shot markers.
- [x] Implement roll window / shooting window split and harvest handoff.
- [x] Implement configure:false + forced NORMAL D20 skill rolls.
- [x] Implement initial quarry render, 30-yard sight zero, and target-local fired markers.
- [x] Add regression tests, build/deploy v0.3.0, restart exact test world, and verify served runtime.


## Hunting v0.3.2 draw-feel playtest
- [x] Lock playtest target: 1.5s full draw, 0.7s settled full-draw window, continuous strength.
- [x] Add 50/75/100 draw markers with one-shot threshold pulses.
- [x] Add four-stage replaceable bow visual tied to draw progress.
- [x] Preserve continuous release strength and RK4 ballistics.
- [x] Add tests, build/deploy v0.3.2, restart exact test world, and verify served runtime.


## Hunting v0.3.4 heavy-bow resistance playtest
- [x] Accept return of 50/75/100 pulse markers.
- [x] Accept increasing-resistance non-compound draw model rather than arbitrary easing.
- [x] Implement constant-power / increasing-force draw progression at 2.5s full draw.
- [x] Restore marker pulses without restoring four-stage bow art.
- [x] Preserve continuous draw strength and RK4 ballistics.
- [x] Add regression tests, build/deploy v0.3.4, restart exact test world, and verify served runtime.


## Hunting v0.3.5 windage and stable reticle
- [x] Keep wind in RK4 air-relative arrow physics.
- [x] Add prominent in-range wind direction arrow and mph readout.
- [x] Report signed wind drift direction after the shot.
- [x] Remove automatic reticle sway; mouse movement becomes the only reticle movement.
- [x] Preserve v0.3.4 heavy-bow draw and pulse markers.
- [x] Add regression tests, build/deploy v0.3.5, restart exact test world, and verify served runtime.


## Hunting v0.3.6 back-loaded draw gradient
- [x] Accept much faster 0-50%, dramatic slowdown to 75%, and crawl from 75-100%.
- [x] Accept longer total draw to preserve a smooth continuous gradient.
- [x] Implement smooth back-loaded draw curve and inverse mapping.
- [x] Preserve marker pulses, RK4 ballistics, wind HUD, and mouse-only reticle.
- [x] Add regression tests, build/deploy v0.3.6, restart exact test world, and verify served runtime.


## Hunting v0.3.7 moving quarry
- [x] Accept smooth walking + pause-window quarry movement.
- [x] Accept arrow-flight lead against quarry position at impact time.
- [x] Add deterministic movement profile to hunting engine.
- [x] Animate quarry position in the Hunt window and freeze on arrow arrival/result.
- [x] Apply future target displacement to hit classification so moving shots require lead.
- [x] Preserve v0.3.6 draw, windage, and mouse-only reticle.
- [x] Add regression tests, build/deploy v0.3.7, restart exact test world, and verify served runtime.


## Hunting v0.3.8 stamina playtest
- [x] Accept visible stamina gauge with exertion-weighted drain.
- [x] Accept automatic bow-lower at zero stamina, never involuntary firing.
- [x] Implement stamina drain/recovery helpers and live runtime state.
- [x] Add Stamina bar beside Draw bar and exhaustion feedback.
- [x] Preserve moving quarry, lead, windage, stationary reticle, and continuous draw strength.
- [x] Add regression tests, build/deploy v0.3.8, restart exact test world, and verify served runtime.


## Hunting v0.3.9 draw-sensitive arrow speed
- [x] Identify sublinear arrow-speed curve as compressing partial/full-draw timing differences.
- [x] Replace with 5 m/s minimum + quadratic draw-strength velocity curve.
- [x] Add flight-time/lead regression coverage at 50/75/100% draw.
- [x] Preserve RK4, moving quarry, windage, stamina, and draw timing.
- [x] Build/deploy v0.3.9, restart exact test world, and verify served runtime.


## Hunting v0.3.10 force-draw energy model
- [x] Accept stored-energy/kinetic-energy arrow-speed model.
- [x] Preserve accepted draw curve and 74.5 m/s full-draw calibration.
- [ ] Add normalized force and stored-energy helpers derived from the draw curve.
- [ ] Derive launch speed from sqrt(stored-energy fraction) instead of a hand-tuned exponent.
- [ ] Change player-facing launch-speed result to fps while retaining SI internally.
- [ ] Add energy/speed/flight-time regression tests, build/deploy v0.3.10, restart exact test world, and verify served runtime.

## Hunting v0.3.11 realistic warbow draw model
- [x] Accept approximately linear force-draw curve for the heavy self-bow approximation.
- [x] Accept T(s)=s^2 and 2.5s full-draw playtest timing.
- [x] Update draw constants to 2.5s / power 2 with zero linear blend.
- [x] Verify force fraction becomes linear and stored-energy fraction becomes s^2.
- [x] Verify arrow-speed ratio follows draw fraction under the energy model.
- [x] Recalculate stamina behavior under the shorter realistic draw.
- [x] Add regression tests, build/deploy v0.3.11, restart exact test world, and verify served runtime.


## Hunting v0.3.12 synchronized flight + lead cue
- [x] Accept single real flight clock for arrow, deer, and impact.
- [x] Accept movement-only dynamic lead chevron.
- [x] Accept short tracer feedback after the shot.
- [x] Add RK4 trajectory sampling helper and preserve exact final impact/time.
- [x] Remove visual flight-duration cap and animate arrow from sampled trajectory.
- [x] Add dynamic movement lead cue based on current draw strength.
- [x] Add short-lived tracer trail using actual projectile samples.
- [x] Add regression tests, build/deploy v0.3.12, restart exact test world, and verify served runtime.


## Hunting v0.3.13 moving-target aim forgiveness
- [x] Remove failed visible lead chevron from live Hunting.
- [x] Accept subtle hidden moving-target forgiveness rather than predictive UI.
- [x] Add bounded 0.12 m horizontal near-miss correction helper.
- [x] Require moving quarry + correct lead direction + original miss.
- [x] Preserve real RK4 tracer/arrow path and apply forgiveness only to final collision classification.
- [x] Add regression tests, build/deploy v0.3.13, restart exact test world, and verify served runtime.


## Hunting v0.3.14 calm-only drop calibration
- [x] Accept temporary calm-only Hunting mode.
- [ ] Force live projectile wind to 0 mph.
- [ ] Remove wind HUD and wind-compensation instructions/results from live UI.
- [ ] Preserve dormant wind engine code for later reactivation.
- [ ] Add regression tests, build/deploy v0.3.14, restart exact test world, and verify served runtime.

## Hunting v0.3.15 heavy-bow stamina feel
- [x] Re-audit Skyrim draw/projectile math and confirm direct Java translation.
- [x] Keep Regionwright energy/RK4 model rather than adopting Skyrim projectile math.
- [x] Raise full-draw stamina drain to 24/s while preserving effort-weighted gradient.
- [x] Make stamina warning pulse red below 50%, continuously faster toward zero.
- [x] Make draw milestone pulses/reached markers green.
- [x] Preserve prefers-reduced-motion behavior and avoid camera/reticle shake.
- [x] Carry forward calm-only v0.3.14 behavior.
- [x] Add regression tests, build/deploy v0.3.15, restart exact test world, and verify served runtime.


## Hunting v0.3.16 Ballistics Lab
- [x] Accept GM-only deterministic Ballistics Lab scope.
- [x] Add ballistic profiles and canonical simulateArrowShot result.
- [x] Route calculateArrowImpact and trajectory sampling through canonical simulation without changing live results.
- [x] Add Traditional, Pin Sight, and Explicit Zero aiming modes.
- [x] Add stationary physical-scale calibration target and impact marker.
- [x] Report raw fall separately from point-of-aim error and pixel displacement.
- [x] Add Copy Diagnostic Report.
- [x] Expose GM launch path for Ballistics Lab.
- [x] Add regression tests, build/deploy v0.3.16, restart exact test world, and verify served runtime.


## Hunting v0.3.17 Ballistics Lab observer hotfix
- [x] Capture the ResizeObserver type exception.
- [x] Guard the ResizeObserver target with a real Element check.
- [x] Add a regression test.
- [x] Build/deploy v0.3.17 and restart the exact test world.
- [ ] Repeat the same Ballistics Lab action under monitoring.


## Hunting v0.3.18 graph reliability patch
- [x] Confirm the live graph is absent while diagnostics still calculate.
- [x] Audit Foundry/core CSS for an SVG override.
- [x] Replace fragile inline SVG with a post-render programmatic SVG mount.
- [x] Add Show/Hide Graph recovery control.
- [x] Add regression tests for mount creation, recreation, and toggle markup.
- [x] Build/deploy v0.3.18, restart exact test world, and verify served runtime.
- [ ] Re-test Current Hybrid | 65 yd | 100% | Automatic Pin Sight.


## Hunting v0.3.19 canvas renderer
- [x] Capture live DOM diagnostic proving the visible mount contains no SVG.
- [x] Replace SVG plot creation with a canvas surface.
- [x] Draw all six visual calibration elements from existing projection data.
- [x] Preserve Show/Hide recovery behavior.
- [x] Add canvas renderer regression tests.
- [x] Build/deploy v0.3.19 and restart exact test world.
- [ ] Re-test Current Hybrid | 65 yd | 100% | Automatic Pin Sight.


## Hunting v0.3.20 Trained Holdover
- [x] Accept Trained Holdover as lab-only expert compensation mode.
- [x] Add holdover to engine aiming modes and solve against actual shot speed.
- [x] Add Ballistics Lab selector label and diagnostics.
- [x] Add regression tests at 20/35/50/65 yd and partial draw.
- [x] Build/deploy v0.3.20, restart exact test world, and verify served runtime.
- [ ] Run Current Hybrid holdover tests before implementing Dexterity/Constitution scaling.


## Hunting v0.3.21 live holdover calibration
- [x] Approve GM-only live Trained Holdover calibration mode.
- [x] Identify the existing GM test launch path and live elevation calculation.
- [x] Add a bounded calibration flag that is never used by normal Hunting.
- [x] Apply solved holdover using actual range and draw-dependent launch speed.
- [x] Preserve movement, stamina, RK4 trajectory, animation, anatomy, and forgiveness.
- [x] Add regression tests proving normal Hunting remains unchanged.
- [x] Build/deploy v0.3.21 and restart exact test world.
- [ ] Run live 20/35/50/65 yd calibration shots.


## Hunting v0.3.22 test modes and physical movement
- [x] Approve switchable GM Hunting test modes.
- [x] Define initial mode catalog and bounded launcher inputs.
- [x] Convert deer motion from range-scaled screen displacement to physical metres.
- [x] Preserve smooth walk/pause/reversal behavior while making physical speed range-independent.
- [x] Add movement diagnostics to shot results.
- [x] Keep normal Hunt, live holdover, and movement-calibration paths isolated.
- [x] Add regression tests for physical speed consistency across 25/45/65 yd.
- [x] Build/deploy v0.3.22 and restart exact test world.
- [ ] Resume controlled head-center crossing tests by mode.


## Hunting v0.3.23 phase-label cleanup
- [x] Approve diagnostic-only phase-label cleanup.
- [x] Flip walk-left/walk-right phase names when reverse motion is active.
- [x] Add regression test proving labels match physical velocity direction.
- [x] Run full Regionwright suite, build, deploy, and verify exact test world.
- [ ] Begin Live Trained Holdover 20 yd lungs test.


## Hunting v0.3.24 testing-only anatomy target
- [x] Approve testing-only anatomical target pass.
- [x] Define isolated test anatomy zones and outcomes.
- [x] Render labeled test anatomy overlay from the same zone data.
- [x] Route GM test-mode classification and forgiveness through test zones only.
- [x] Prove normal Hunting still uses production zones unchanged.
- [x] Run focused and full Regionwright tests.
- [x] Build/deploy v0.3.24.
- [x] Arm external crash monitor for live v0.3.24 testing.
- [ ] Resume Live Trained Holdover testing against the anatomical target.


## Hunting v0.3.25 impact visual sync
- [x] Approve arrow/tracer/marker synchronization patch.
- [x] Derive the visual endpoint from the resolved impact and impact-time quarry position.
- [x] Make arrow and tracer finish exactly at that endpoint through a shared physical screen projection.
- [x] Keep deer-local marker on the same resolved hit point.
- [x] Add regression tests proving endpoint convergence without changing physics.
- [x] Run full Regionwright suite, build, deploy, and verify exact test world.
- [x] Keep crash monitor active for live retest.

