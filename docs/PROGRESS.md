# VEILBOUND — Development Progress Log

This is the chronological implementation log for meaningful production milestones.

Use this file together with `ROADMAP.md`, `docs/VERTICAL_SLICE.md`, `docs/CANON.md`, `docs/ARCHITECTURE.md`, `docs/COMBAT.md`, and `AGENTS.md`. Do not mark owner-device acceptance complete until it has actually been tested.

---

## 2026-08-29 — v0.1.0 Foundation
- Initialized repository and `feature/vertical-slice-foundation`.
- Added agent handbook, canon, architecture, vertical-slice definition, and zero-build launch contract.

## 2026-08-29 — v0.1.1 Playable
- Added responsive Canvas 2D runtime, Greyhaven, Hollow March Fields 1–2, movement, collision, transitions, keyboard/touch/controller input, and prototype Kael.
- iPhone static-host launch and touch movement confirmed.

## 2026-08-29 — v0.1.2 Combat
- Added Shardblade melee, enemy/player damage, knockback, i-frames, hit feedback, Save V1, enemy persistence, Forgotten Relic Chamber, and Axiom awakening sequence.
- Owner device exposed portrait cinematic-flash contamination and dormant chamber save-state issue.

## 2026-08-29 — v0.1.3 Resonance — iPhone ACCEPTED
- Fixed portrait letterbox rendering.
- Added dedicated Resonance input/pulse, authored Resonance nodes, persistent discoveries, and page-hide/background autosave.
- Added targeted recovery for incomplete dormant-chamber saves.
- [x] Axiom awakening completes on iPhone.
- [x] Resonance unlock persists after refresh/reopen.
- [x] Chamber core memory response works.
- [x] Hollow March Field 2 buried Vein route discovery works and persists.
- [x] Shardblade and Resonance remain separate controls.
- [ ] Repeat equivalent acceptance on iPad later.

---

## 2026-08-29 — v0.1.4 Vein Sentry

### FORGE / ARCHITECT — ranged combat implementation
- Added data-driven EnemyRegistry consumption to the runtime.
- Added a live Vein Sentry state machine: Observe → Position → Telegraph → Fire → Recover.
- Added phone-readable amber charge ring and dashed aim-line telegraph.
- Added cyan energy projectiles with lifetime, wall collision, player collision, damage, i-frames, and knockback.
- Projectiles are cleared on room transitions and player recovery so attacks cannot leak across rooms.
- Added Resonance combat interaction: a Resonance pulse that reaches a Sentry during Telegraph interrupts the shot and enters a temporary Disrupted state.
- Added visible cyan disruption ring to communicate the successful interrupt window.
- Preserved Shardblade as the damage/finisher tool; Resonance disrupts rather than dealing direct enemy damage.
- Kept the authored mixed encounter in Hollow March Field 2: one March Husk plus one Vein Sentry.

### Owner-device acceptance — PENDING
- [ ] HUD displays `v0.1.4-sentry` after refresh.
- [ ] Vein Sentry visibly cycles into an amber telegraph before firing.
- [ ] Projectile is readable and dodgeable on iPhone landscape.
- [ ] Projectile contact removes one health diamond and applies knockback without repeated instant damage.
- [ ] Resonance during the amber telegraph cancels the shot and visibly disrupts the Sentry.
- [ ] Kael can close in and defeat the disrupted Sentry with the Shardblade.
- [ ] Defeated Sentry remains defeated after room transition/refresh because its stable enemy ID persists.
- [ ] No regression to Axiom/Resonance save state or portrait letterboxing.

---

## 2026-08-29 — Development diagnostics

### FORGE / ARCHITECT — debug overlay, runtime diagnostics, development-mode toggle
- Implemented the `docs/ARCHITECTURE.md` "Development Diagnostics" contract in full.
- Added a DOM diagnostics panel: FPS, average and peak frame time, room id, entry id,
  player position and facing, health/i-frame/attack timers, Resonance state and pulse
  radius, entity counts, current interactable target, per-enemy state with timers and
  distance, and active world flags.
- Added canvas debug shapes in world space: collision rects, exit rects, Resonance node
  radii, enemy hurtboxes, Vein Sentry engage/retreat ranges, projectile hitboxes, the
  player hurtbox, and the Shardblade arc.
- Added a development-mode toggle: `F3` or `` ` `` on keyboard, `?debug` in the URL for
  touch devices. The keyboard toggle persists in `settings.debugOverlay`; `?debug` forces
  the overlay on for one session without writing the setting.
- Extracted the melee reach, arc, active window, and husk aggro range into shared
  constants read by both the simulation and the overlay, so drawn boxes cannot drift.
- Added authored `entry` names to every room exit so the overlay can report a real entry
  id instead of a synthesized one.
- The overlay is off by default, is `pointer-events: none`, and does not run its text
  refresh or shape pass while disabled, so the shipping path is unchanged.
- Runtime version deliberately left at `v0.1.4-sentry`: this is development tooling with
  no gameplay surface, and the pending v0.1.4 owner-device acceptance checklist asserts
  that exact HUD string. ORACLE owns the call on folding it into a numbered build.

### Verification
- Chromium, 900×520: overlay hidden by default; `F3` and `` ` `` toggle it; the setting
  survives reload in both directions; `?debug` enables it without writing the setting.
- Entry id reports `west` after walking Greyhaven → Hollow March Field 1, and `restore`
  on a loaded save.
- Vein Sentry telegraph countdown, husk chase/idle, Resonance cooldown, pulse radius, and
  live attack/i-frame timers all read correctly during play.
- Combat regression: both Field 1 husks still die to the Shardblade and persist as
  defeated after the constant extraction. No console or page errors.

### Owner-device acceptance — PENDING
- [ ] `?debug` shows the diagnostics panel on iPhone without breaking touch controls.
- [ ] Panel stays legible and inside the safe area in landscape and portrait.
- [ ] Reported FPS on device matches perceived smoothness closely enough to be useful.

---

## Current immediate production order
1. Complete v0.1.4 Vein Sentry iPhone acceptance.
2. Build Greyhaven interaction/NPC dialogue layer.
3. Add first save/rest point.
4. Build Sunken Archive entrance revealed through Resonance progression.
5. Build reusable switch, persistent door, and push/manipulation primitives.
6. Build Tether acquisition and teaching sequence.
7. Build Archivist boss framework.
8. Complete vertical-slice presentation and device acceptance pass.
9. Repeat equivalent acceptance on iPad before the vertical-slice release gate.
