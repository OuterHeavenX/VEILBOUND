# VEILBOUND — Development Progress Log

This is the chronological implementation log for meaningful production milestones.

Use this file together with:
- `ROADMAP.md` for planned direction and phase gates
- `docs/VERTICAL_SLICE.md` for the first complete playable slice
- `docs/CANON.md` for story/world truth
- `docs/ARCHITECTURE.md` for technical contracts
- `AGENTS.md` for ownership

Do not mark work complete here until it exists in the active development branch.

---

## 2026-08-29 — v0.1.0 Foundation

### ORACLE / FORGE
- Initialized `OuterHeavenX/VEILBOUND`.
- Established `feature/vertical-slice-foundation`.
- Added studio agent handbook, canon, architecture, and vertical-slice definition.
- Preserved zero-build `index.html` launch requirement.

---

## 2026-08-29 — v0.1.1 Playable

### FORGE / WRAITH / ARCHITECT
- Added responsive Canvas 2D runtime.
- Added Greyhaven prototype and Hollow March Fields 1–2.
- Added four-direction movement/facing, authored collision, and room transitions.
- Added keyboard, touch joystick, and controller movement.
- Added prototype Kael silhouette with mask, Shardblade, and Axiom glow.

### Owner-device result
- iPhone static-host launch confirmed.
- Touch movement visibly working.

---

## 2026-08-29 — v0.1.2 Combat

### FORGE
- Added Shardblade attack, directional melee overlap, enemy health/defeat, player damage, knockback, i-frames, particles, and hit flashes.
- Added Save Schema V1 runtime integration, transition autosave, stable enemy IDs, and defeated-enemy persistence.

### SCRIBE / SPECTER / WRAITH
- Added Forgotten Relic Chamber and first Axiom awakening sequence.
- Preserved `RESONANCE DETECTED` and `BOUND USER CONFIRMED`.
- Added persistent Axiom awakening flag and Resonance grant.

### Owner-device result
- iPhone reached Forgotten Relic Chamber.
- Visual defect found: cyan cinematic flash contaminated portrait letterbox areas.

---

## 2026-08-29 — v0.1.3 Resonance

### FORGE — portrait rendering correction
- Full physical canvas clears to void black every frame.
- Gameplay remains inside the authored 960×540 world viewport.
- Cinematic cyan flash is clipped to the gameplay viewport.

### FORGE / ARCHITECT — Resonance v1
- Added dedicated Resonance action separate from Shardblade attack.
- Added touch `◇` button, keyboard `E`/`R`/Shift, and controller secondary-face-button mapping.
- Added expanding pulse, cooldown, authored room nodes, and persistent discovery flags.
- Added first Hollow March Field 2 buried Vein route discovery and chamber core-memory response.

### FORGE — persistence hardening
- Added autosave on `pagehide` and when the document becomes hidden/backgrounded.

### Owner-device result
- [x] iPhone portrait cyan contamination confirmed fixed by owner screenshot.
- [x] Forgotten Relic Chamber renders correctly in landscape.
- [x] Axiom awakening sequence successfully completed on iPhone after save-recovery hotfix.
- [x] HUD visibly changes to `AXIOM: RESONANCE ◇`.
- [x] Dedicated `◇` Resonance touch control visibly appears and functions.
- [x] Forgotten Relic Chamber Resonance core responds with `CORE MEMORY FRAGMENT FOUND.` dialogue.
- [x] Hollow March Field 2 buried Vein route is visibly revealed by Resonance as a cyan route trace.
- [ ] Refresh/reopen after awakening and confirm awakened state persists without replaying the sequence.
- [ ] Refresh/reopen after Field 2 route discovery and confirm the route remains revealed.
- [ ] Confirm Shardblade and Resonance remain independently usable after reload.
- [ ] Repeat equivalent acceptance on iPad later.

---

## 2026-08-29 — v0.1.3 Awakening Save-Recovery Hotfix

### FORGE
- Added targeted Save V1 normalization recovery for the exact incomplete state `roomId=awakeningRuin` + no `story.axiomAwakened` flag + no Resonance ability.
- Affected saves are safely moved to the Hollow March Field 2 chamber threshold at `(895, 270)` on load.
- Re-entering the chamber then uses the normal authored room transition, which schedules the Axiom awakening sequence.
- Successfully awakened saves are never moved or altered by this recovery rule.
- Recovery is annotated in save metadata as `awakeningRuin.dormant.v0.1.3` for later migration/audit work.

### Why this approach
- It repairs already-created owner-device saves without deleting progress or granting the story ability silently.
- It preserves the actual SPECTER awakening sequence instead of skipping directly to an unlocked ability.
- It is intentionally narrow and can be removed/replaced when the runtime gains a general trigger-state restoration system.

### Owner-device result
- [x] Recovery path succeeded: owner progressed from dormant chamber state into the authored awakening.
- [x] Resonance was granted rather than silently injected by migration.
- [x] Post-awakening chamber core interaction and Field 2 Resonance discovery both work on iPhone.

---

## Current immediate production order

1. Finish the remaining reload/persistence checks for v0.1.3 on iPhone.
2. Finish second ranged/area-control enemy behavior and telegraphing.
3. Build Greyhaven interaction/NPC dialogue layer.
4. Add first save/rest point.
5. Build Sunken Archive entrance revealed through Resonance progression.
6. Build reusable switch, persistent door, and push/manipulation primitives.
7. Build Tether acquisition and teaching sequence.
8. Build Archivist boss framework.
9. Complete vertical-slice presentation and device acceptance pass.
