# VEILBOUND — Combat Design Contract

This document defines the combat language for the vertical slice. FORGE, WRAITH, ARCHITECT, ECHO, and ORACLE should read it before adding enemies or combat abilities.

## Core combat promise

VEILBOUND combat is readable, deliberate, mobile-friendly action combat. Threats should create decisions rather than visual noise. The Shardblade is the primary direct-damage tool. Axiom abilities alter positioning, timing, defenses, mechanisms, or enemy states rather than simply replacing the sword with stronger attacks.

## Readability rules

- Every damaging ranged attack must have a visible wind-up.
- Telegraphs must remain readable on a phone-sized landscape viewport.
- Projectile silhouettes must contrast with the environment and with Resonance effects.
- Avoid dense bullet-hell patterns in ordinary encounters.
- Contact damage must not combine with unavoidable projectile damage into stun-locks.
- Enemy attack cadence should leave clear punish windows.
- Mixed encounters should combine roles intentionally: pursuit + ranged pressure is useful; duplicate noise is not.

## Enemy 01 — March Husk

Role: melee pursuit.

Purpose:
- teach spacing and facing;
- validate Shardblade hit arcs, knockback, i-frames, and persistent defeat;
- provide close-range pressure when later enemies control space.

## Enemy 02 — Vein Sentry

Role: ranged / area-control.

Visual concept:
- ancient Vein defense construct;
- compact circular/segmented body;
- rotating targeting vanes;
- restrained cyan internal energy;
- attack charge should visually tighten toward the firing axis before release.

### State machine

1. **Observe** — acquire Kael inside engage range.
2. **Position** — maintain a preferred mid-range distance rather than blindly chasing.
3. **Telegraph** — stop movement, rotate/charge, show an unmistakable targeting cue for roughly 0.72 s.
4. **Fire** — launch one readable energy bolt toward Kael's sampled position.
5. **Recover** — remain punishable for roughly 1.05 s before repositioning.
6. **Disrupted** — Resonance can interrupt a telegraph and stun the Sentry for roughly 1.15 s.

### Projectile contract

- Speed target: ~245 world units/s.
- Damage: 1 health unit.
- Radius target: 7 world units.
- Lifetime: ~2.6 s.
- Destroy on authored solid-world collision.
- Destroy on player impact.
- Never persist across room transitions.
- Keep the projectile pool bounded.

### Resonance interaction

If a Resonance wave reaches a Vein Sentry:
- interrupt an active telegraph;
- cancel the pending shot;
- apply a short disruption/stun;
- give clear cyan/white feedback;
- do **not** deal direct damage in Resonance v1.

This establishes the design rule that Resonance exposes, interrupts, reveals, or manipulates ancient systems while the Shardblade remains Kael's primary damage source.

## First authored mixed encounter

Location: Hollow March — Field 2.

Composition:
- one March Husk creates close pursuit pressure;
- one Vein Sentry controls mid-range space;
- nearby terrain gives Kael room to break line pressure and close distance;
- Resonance offers an optional tactical interrupt after the Axiom awakening.

The encounter succeeds when a first-time player can understand why they were hit and can identify at least two responses: move during the telegraph or disrupt the Sentry with Resonance.

## Acceptance gate

Before marking ranged combat complete:

- [ ] Sentry has Observe / Position / Telegraph / Fire / Recover states.
- [ ] Telegraph is readable on iPhone landscape.
- [ ] Projectile collision with Kael works with i-frames.
- [ ] Projectile collision with solid world removes the projectile.
- [ ] Shardblade can defeat the Sentry.
- [ ] Resonance interrupts an active telegraph without dealing damage.
- [ ] Sentry defeat persists through Save V1.
- [ ] Room transitions clear transient projectiles.
- [ ] Mixed Husk + Sentry encounter is playable without unavoidable damage.
- [ ] iPhone owner-device acceptance completed.
