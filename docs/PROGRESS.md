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
