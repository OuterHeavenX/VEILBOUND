# VEILBOUND — Technical Architecture Foundation

Owner: **FORGE**

This document defines the intended architecture before implementation expands.

## Core Principles

- Modular systems over monolithic files.
- Data-driven rooms, enemies, items, puzzles, and story events.
- Device-independent input abstraction.
- Explicit world-state persistence.
- Deterministic room lifecycle where practical.
- Strong debug visibility for collisions, room state, transitions, and performance.
- Content code should not need to patch engine internals.

## Proposed Source Layout

```text
src/
  core/
    Game.js
    GameLoop.js
    Input.js
    Audio.js
    SaveManager.js
    EventBus.js

  world/
    World.js
    Room.js
    RoomManager.js
    TileMap.js
    Collision.js
    WorldState.js

  entities/
    Entity.js
    Player.js
    NPC.js
    Enemy.js
    Boss.js

  combat/
    CombatSystem.js
    Hitbox.js
    Hurtbox.js
    Projectile.js
    DamageSystem.js

  abilities/
    AxiomSystem.js
    Resonance.js
    Tether.js

  puzzles/
    PuzzleSystem.js
    Switch.js
    PushBlock.js
    Door.js
    Anchor.js

  items/
    ItemRegistry.js
    Inventory.js
    Equipment.js

  story/
    DialogueSystem.js
    CutsceneSystem.js
    QuestSystem.js

  ui/
    HUD.js
    DialogueUI.js
    MapScreen.js
    InventoryScreen.js
    TouchControls.js

  data/
    rooms/
    enemies/
    items/
    quests/
    cutscenes/
```

The exact implementation language/library is not yet canonized by this document. The module boundaries are the important contract.

## Runtime Ownership

### Game
Top-level lifecycle and service composition. It should not become a catch-all gameplay file.

### GameLoop
Owns update cadence and render scheduling. Gameplay systems receive time deltas through explicit update calls.

### Input
Normalizes keyboard, touch, and controller inputs into actions such as:
- moveX / moveY
- attack
- interact
- axiom
- menu
- map
- cancel

Gameplay systems should not directly query raw keyboard/touch/gamepad APIs.

### RoomManager
Loads room definitions, creates runtime entities, manages transitions, and tears down transient room state safely.

### WorldState
Owns persistent flags and room-level persistence. Examples:
- opened chest
- solved puzzle
- defeated boss
- opened shortcut
- activated mechanism

### SaveManager
Serializes versioned player/world state and validates loaded data. Save format must include a schema version from the beginning.

### CombatSystem
Coordinates attacks, hit/hurt overlap, damage, knockback, invulnerability windows, and combat events. Visual/audio feedback should subscribe through events rather than being hard-coded into damage math.

### AxiomSystem
Owns acquired abilities and common Axiom rules. Individual abilities implement their own targeting/execution contracts.

### CutsceneSystem
Runs data/script-driven cinematic sequences while preserving clear control over player input, camera, dialogue, animation, sound/music cues, and skip behavior.

## Data-Driven Room Contract

A room definition should be capable of describing at minimum:
- id
- display name
- environment/theme
- collision/tile data reference
- exits and entry points
- enemy placements
- interactables
- puzzle objects
- persistent object ids
- music/ambience key
- scripted triggers

Conceptual example:

```js
{
  id: 'sunken-archive-03',
  exits: {
    north: { room: 'sunken-archive-04', entry: 'south' },
    south: { room: 'sunken-archive-02', entry: 'north' }
  },
  enemies: [
    { type: 'archive-sentry', x: 8, y: 5 }
  ],
  puzzles: [
    { type: 'tether-anchor', id: 'anchor-a', x: 6, y: 3 }
  ]
}
```

## Persistent IDs

Any object whose state survives room reloads must have a stable authored id. Runtime array index is never an acceptable persistent identity.

Examples:
- `greyhaven.chest.workshop_alley`
- `archive.puzzle.water_ring_01`
- `archive.shortcut.west_gate`
- `boss.archivist.defeated`

## Save Schema V1 — Initial Contract

Conceptual shape:

```js
{
  version: 1,
  player: {
    roomId: 'greyhaven',
    entryId: 'spawn',
    health: 6,
    maxHealth: 6,
    shardbladeLevel: 1,
    abilities: ['resonance'],
    inventory: []
  },
  world: {
    flags: {}
  },
  settings: {}
}
```

Migration functions should be introduced before any breaking save changes are shipped publicly.

## Combat Feel Requirements

Even simple attacks should support presentation hooks for:
- hit pause
- impact particles
- target flash
- camera impulse/shake
- knockback
- weapon trail
- impact audio

These effects must be bounded so stacked effects cannot destabilize performance.

## Cutscene Contract

A cutscene sequence should be declarative enough to express operations such as:
- lock/unlock player control
- camera focus/pan
- move actor
- face actor
- play animation
- show dialogue
- wait
- emit world event
- change lighting
- play/transition music
- play sound
- shake camera
- set persistent flag
- start boss
- fade in/out

Viewed-state should be persistable for major cinematics so retry behavior can shorten or skip repeated sequences.

## Development Diagnostics

Before content scale-up, add optional debug overlays for:
- FPS/frame time
- collision shapes
- attack hitboxes/hurtboxes
- room id and entry id
- player coordinates
- active world flags
- current interactable target
- current enemy state

## Production Gate

Do not dramatically expand room count until the architecture can demonstrate:
1. stable transitions
2. stable save/reload
3. persistent room state
4. device-independent input
5. reusable combat
6. reusable puzzle primitives
7. cutscene skip/replay behavior
8. stable mobile performance
