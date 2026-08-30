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
- Deep water is visually water and mechanically impassable; collision and art agree through shared authored geometry.
- First entry records `archive.entered` and gives one concise Axiom acknowledgement.
- No required fight in the arrival room.

### 2. Vestibule — TEST

Goal: teach the first reusable dungeon mechanism under light combat pressure.

- Mixed March Husk + Vein Sentry encounter.
- One authored floor switch: `archive.vestibule.floorSwitch`.
- Standing on the switch sets persistent flag `archive.vestibule.sealOpen`.
- The south seal is a real collision body while closed and disappears from collision when opened.
- The south exit also requires the same flag, preventing transition desynchronization.
- Switch state survives room changes and Save V1 reload through the world flag.

This is deliberately simple. The player should immediately understand the visual language of plate → mechanism → opened route before later rooms combine it with movement, enemies, Resonance, push blocks, and Tether.

### 3. Catalog Rotunda — COMBINE / FORESHADOW

Goal: combine existing combat/exploration language with authored Resonance and establish the next missing verb.

- Circular archive machinery dominates the room.
- A Resonance-compatible memory node sits at the central catalog mechanism.
- Discovery flag: `archive.rotunda.resonanceRead`.
- The Axiom identifies deeper manipulation infrastructure but cannot operate it yet.
- The deeper Archive bulkhead remains sealed in this milestone.
- The room points directly toward the later Tether acquisition path without granting Tether early.

Current memory response:

- `CATALOG MEMORY LATTICE RESPONDING.`
- `DEEPER ACCESS REQUIRES MANIPULATION AUTHORITY.`
- `PROTOCOL TRACE: TETHER.`

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

This contract is now live in `src/main.js` and should be extracted into dedicated puzzle modules as the dungeon grows rather than allowing the main runtime to become the permanent home of every dungeon rule.

## Tether boundary

Tether is **not** granted in the v0.3.0 opening pass.

The opening deliberately shows a missing manipulation capability before granting it. The later midpoint acquisition should therefore feel like an answer to a problem the player has already seen.

## Acceptance — opening pass

Implementation:
- [x] Resonance-gated Eastern Descent connects from Hollow March Field 2.
- [x] Deep-water art and collision use matching authored geometry.
- [x] First-entry Axiom acknowledgement is protected by persistent `archive.entered`.
- [x] Vestibule reuses the existing Husk + Vein Sentry combat and progression reward pipeline.
- [x] Floor switch writes the seal-open flag.
- [x] Closed seal participates in collision and disappears when opened.
- [x] Seal/open-exit state is driven by the same persistent flag.
- [x] Catalog Rotunda is wired behind the seal.
- [x] Rotunda Resonance node writes `archive.rotunda.resonanceRead`.
- [x] Deeper bulkhead remains closed and explicitly foreshadows Tether without granting it.
- [x] Return exits remain wired back to Hollow March Field 2.

Owner device:
- [ ] iPhone landscape readability.
- [ ] iPhone portrait readability.
- [ ] Touch movement does not snag on Archive collision.
- [ ] Switch and seal state remain understandable at phone scale.
- [ ] Mixed encounter remains readable with water/circuitry background.
- [ ] XP / JP / coin rewards still work in the Vestibule and Rotunda.
- [ ] Character menu opens correctly from inside the dungeon.
- [ ] Save/reload inside each Archive room restores safely.
- [ ] Opened Vestibule seal remains open after backtracking and refresh.

## Next Archive production pass

1. Owner-device acceptance of the three opening rooms.
2. Extract reusable switch/door handling if the opening proves stable.
3. Add the first push/manipulation block.
4. Add water/energy-routing state.
5. Build the first meaningful shortcut loop.
6. Build the Tether acquisition chamber and safe teaching use.
7. Expand into combined Tether traversal/combat/mechanism rooms.
8. Build the Archivist approach and boss framework.
