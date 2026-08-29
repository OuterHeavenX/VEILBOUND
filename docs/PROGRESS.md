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
- Added studio agent handbook.
- Added canon foundation.
- Added architecture foundation.
- Added first vertical-slice definition.
- Preserved zero-build `index.html` launch requirement.

---

## 2026-08-29 — v0.1.1 Playable

### FORGE / WRAITH / ARCHITECT
- Added responsive Canvas 2D runtime.
- Added Greyhaven prototype.
- Added Hollow March Field 1 and Field 2.
- Added four-direction movement and facing.
- Added authored collision.
- Added room transitions.
- Added keyboard, touch joystick, and controller movement.
- Added prototype Kael silhouette with mask, Shardblade, and Axiom glow.

### Owner-device result
- iPhone static-host launch confirmed.
- Touch movement visibly working.

---

## 2026-08-29 — v0.1.2 Combat

### FORGE
- Added Shardblade attack input.
- Added directional melee overlap.
- Added enemy health and defeat state.
- Added player health, damage, knockback, and invulnerability frames.
- Added bounded particles and hit flashes.
- Added Save Schema V1 runtime integration.
- Added room-transition autosave.
- Added stable enemy IDs and defeated-enemy persistence.

### SCRIBE / SPECTER / WRAITH
- Added Forgotten Relic Chamber.
- Added first Axiom awakening cinematic/dialogue pass.
- Preserved canon beats `RESONANCE DETECTED` and `BOUND USER CONFIRMED`.
- Added persistent Axiom awakening flag.
- Granted and persisted Resonance ability.

### Owner-device result
- iPhone reached Forgotten Relic Chamber successfully.
- Save V1 HUD state visible.
- Axiom chamber rendered.
- Important visual defect found: cyan cinematic flash contaminated portrait letterbox areas above and below the 16:9 world viewport.
- Result: iPhone acceptance remained partial, not complete.

---

## 2026-08-29 — v0.1.3 Resonance

### FORGE — portrait rendering correction
- Full physical canvas is now cleared to void black every frame.
- Gameplay remains contained inside the authored 960×540 world viewport.
- Cinematic cyan flash is clipped to the scaled gameplay viewport.
- Portrait letterbox regions should remain intentionally void-black during Axiom flashes.

### FORGE / ARCHITECT — Resonance v1
- Added dedicated Resonance action separate from Shardblade attack.
- Added touch `◇` Axiom button.
- Added keyboard Resonance mapping: `E`, `R`, or Shift.
- Added controller secondary-face-button Resonance mapping.
- Added expanding Resonance pulse.
- Added cooldown behavior.
- Added authored per-room Resonance nodes.
- Added persistent discovery flags through Save V1 world flags.
- Added first Hollow March Field 2 buried Vein route discovery.
- Added first Forgotten Relic Chamber core-memory response.
- Resonance remains selective rather than becoming a generic detective-vision overlay.

### FORGE — persistence hardening
- Added autosave request on `pagehide`.
- Added autosave request when the document becomes hidden/backgrounded.
- Existing room-transition autosave remains in place.

### Documentation
- Updated `docs/VERTICAL_SLICE.md` for v0.1.3.
- Added this progress log.

### Acceptance required next
- [ ] Confirm portrait cyan contamination is gone on iPhone.
- [ ] Refresh/reopen while standing in the Forgotten Relic Chamber and confirm room/position persists.
- [ ] Confirm Axiom awakening does not replay after successful save.
- [ ] Confirm `◇` Resonance button appears after awakening.
- [ ] Use Resonance in Hollow March Field 2 and confirm buried Vein route becomes visible.
- [ ] Refresh after discovery and confirm the revealed route remains visible.
- [ ] Confirm Shardblade and Resonance can be used independently on touch.
- [ ] Repeat equivalent acceptance on iPad later.

---

## Current immediate production order

1. Owner-device acceptance of `v0.1.3-resonance`.
2. Finish second ranged/area-control enemy behavior and telegraphing.
3. Build Greyhaven interaction/NPC dialogue layer.
4. Add first save/rest point.
5. Build Sunken Archive entrance revealed through Resonance progression.
6. Build reusable switch, persistent door, and push/manipulation primitives.
7. Build Tether acquisition and teaching sequence.
8. Build Archivist boss framework.
9. Complete vertical-slice presentation and device acceptance pass.
