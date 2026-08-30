# VEILBOUND — The Sunken Archive

Owners: **ARCHITECT / WRAITH / SCRIBE / FORGE**  
Status: **ACTIVE VERTICAL-SLICE DUNGEON**

## Purpose

The Sunken Archive is VEILBOUND's first major dungeon and the first place where the player should feel that Eidol's ancient systems are not merely ruins — they are beginning to recognize Kael.

The dungeon must prove the design doctrine:

**Teach → Test → Combine → Twist → Master**

Backtracking should reveal new possibilities rather than create travel tax. Puzzle state that matters after leaving a room must use authored persistent flags.

## Visual identity

- drowned monumental stone rather than a generic cave
- dark teal and blue-green water
- pale stone walkways and archive plinths
- cyan Vein circuitry used sparingly as authored guidance
- submerged glyphs visible beneath water
- roots entering through cracked ceilings and masonry
- inactive bronze/stone mechanisms
- strong silhouettes and generous negative space for phone readability

The opening rooms use procedural Canvas art until final licensed/original Archive assets are selected. Dungeon layout and collision are authoritative even when presentation art changes.

## Opening route — v0.3.0

```text
HOLLOW MARCH — FIELD 2
          |
  Resonance-revealed descent
          |
SUNKEN ARCHIVE — EASTERN DESCENT
          |
SUNKEN ARCHIVE — VESTIBULE
          |
 persistent floor switch
          |
     opened seal
          |
SUNKEN ARCHIVE — CATALOG ROTUNDA
          |
  Resonance memory reading
          |
 [DEEP ARCHIVE — SEALED]
       Tether later
```

### 1. Eastern Descent — TEACH / ARRIVAL

Goal: establish the Archive's identity before asking the player to solve anything.

- Entry is reachable from Hollow March Field 2 only after `march.field2.resonanceRouteRevealed`.
- A long dry central causeway runs between drowned side chambers.
- Deep water is visually water and mechanically impassable; collision and art must agree.
- First entry records `archive.entered` and gives one concise Axiom acknowledgement.
- No required fight in the arrival room.

### 2. Vestibule — TEST

Goal: teach the first reusable dungeon mechanism under light combat pressure.

- Mixed March Husk + Vein Sentry encounter.
- One authored floor switch: `archive.vestibule.floorSwitch`.
- Standing on the switch sets persistent flag `archive.vestibule.sealOpen`.
- The south seal is a real collision body while closed and disappears from collision when opened.
- The room exit also requires the same flag, preventing transition desynchronization.
- Switch state survives room changes and save/reload.

This is deliberately simple. The player should immediately understand the visual language of plate → mechanism → opened route before later rooms combine it with movement, enemies, Resonance, push blocks, and Tether.

### 3. Catalog Rotunda — COMBINE / FORESHADOW

Goal: combine existing combat/exploration language with authored Resonance and establish the next missing verb.

- Circular archive machinery dominates the room.
- A Resonance-compatible memory node sits at the central catalog mechanism.
- Discovery flag: `archive.rotunda.resonanceRead`.
- The Axiom identifies deeper manipulation infrastructure but cannot operate it yet.
- The deeper Archive bulkhead remains sealed in this milestone.
- The room points directly toward the later Tether acquisition path without granting Tether early.

## Reusable puzzle primitive contract

Rooms may define:

```js
switches: [
  { id, x, y, radius, flag }
]

doors: [
  { id, x, y, w, h, flag }
]
```

A switch is inactive while its flag is false. Player overlap activates it once, writes the flag, emits bounded feedback, and saves.

A door is closed while its flag is false. A closed door participates in player, enemy, and projectile collision. When the flag becomes true the door is removed from collision and rendered as an opened mechanism.

Exit definitions may declare `requiresFlag`. A gated exit is neither rendered as available nor transitioned through until its flag is true.

## Tether boundary

Tether is **not** granted in the v0.3.0 opening pass.

The opening must make the player curious about a missing manipulation capability. The later midpoint acquisition will then feel like an answer to a problem the dungeon has already shown rather than an arbitrary new power.

## Acceptance — opening pass

Implementation:
- [ ] Resonance-gated Eastern Descent connects from Hollow March Field 2.
- [ ] Eastern Descent is traversable with water/collision agreement.
- [ ] First-entry Axiom acknowledgement occurs once and persists.
- [ ] Vestibule mixed encounter functions with existing XP/JP/coin rewards.
- [ ] Floor switch opens the seal.
- [ ] Seal state persists across room change and reload.
- [ ] Catalog Rotunda is reachable after the seal.
- [ ] Rotunda Resonance node records its memory flag.
- [ ] Deeper bulkhead clearly foreshadows Tether without granting it.
- [ ] Returning to the Hollow March remains possible.

Owner device:
- [ ] iPhone landscape readability.
- [ ] iPhone portrait readability.
- [ ] Touch movement does not snag on Archive collision.
- [ ] Switch and seal state remain understandable at phone scale.
- [ ] Mixed encounter remains readable with water/circuitry background.
- [ ] Save/reload inside each Archive room restores safely.
