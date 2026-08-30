# VEILBOUND — First Playable Vertical Slice

## Current Implementation Status

**Current playable branch:** `feature/vertical-slice-foundation`  
**Current playable version:** `v0.1.6-title`  
**Last updated:** 2026-08-29

Implemented and awaiting owner-device acceptance:

- [x] zero-build `index.html` launch
- [x] Greyhaven prototype
- [x] Hollow March Field 1 and Field 2
- [x] four-direction movement and collision
- [x] Shardblade attack, health, damage, knockback, and i-frames
- [x] Save V1 local persistence and room-transition autosave
- [x] autosave on page hide / app background transition
- [x] defeated-enemy persistence
- [x] Forgotten Relic Chamber
- [x] Axiom awakening sequence
- [x] Resonance ability grant persistence
- [x] Resonance v1 input on touch, keyboard, and controller
- [x] Resonance expanding pulse
- [x] authored Resonance nodes with persistent discovery flags
- [x] first hidden Vein route clue in Hollow March Field 2
- [x] portrait cinematic flash clipping so letterbox remains void-black
- [x] Vein Sentry ranged enemy with telegraph, projectiles, and Resonance disruption
- [x] development diagnostics overlay and development-mode toggle
- [x] Greyhaven authored as six exterior landmarks
- [x] interaction system with world-state-reactive NPC dialogue
- [x] first save/rest point at the Wayfarer's Rest hearth
- [x] dormant Old Lift Station as an authored backtracking hook
- [x] title screen with New Game / Continue / Settings
- [x] safe resume that never silently discards an unreadable save
- [x] device-level settings persistence outside the save

Still required before Phase 1 exits:

- [ ] owner-device acceptance of `v0.1.6-title`, carrying the unconfirmed v0.1.3, v0.1.4, and v0.1.5 items
- [~] second ranged/area-control enemy fully authored; acceptance outstanding
- [x] Greyhaven NPC/dialogue interaction layer
- [x] first save/rest point
- [ ] Sunken Archive entrance
- [ ] reusable switch/door/push puzzle primitives

## Objective

Prove the game's core identity and architecture with a compact, high-quality sequence before expanding production.

The slice should be small enough to understand completely and rich enough to validate the complete gameplay loop.

## Target Flow

1. Greyhaven introduction.
2. Hollow March traversal.
3. Forgotten ruin / Axiom awakening.
4. Return path with altered world state.
5. Entry into the Sunken Archive.
6. Dungeon teaching rooms.
7. Tether acquisition.
8. Tether mastery rooms.
9. Archivist boss encounter.
10. Post-boss recognition reveal and return to the overworld.

## Proposed Room Graph

```text
                 [OPTIONAL SECRET]
                        |
[GREYHAVEN]--[FIELD 1]--[FIELD 2]
                 |          |
              [RUIN]    [ARCHIVE 1]
                            |
                       [ARCHIVE 2]
                            |
                       [PUZZLE HUB]
                       /          \
                [TETHER ROOM]   [COMBAT]
                       \          /
                         [BOSS]
```

Exact physical layout may change after playtesting. The functional sequence should remain intentionally compact.

## Systems the Slice Must Prove

### Player
- responsive four-direction movement
- facing and animation state
- Shardblade basic attack
- damage, knockback, hurt state, invulnerability window
- readable health state

### Input
- keyboard
- touch
- gamepad/controller
- input abstraction so gameplay code does not directly depend on device APIs

### World
- room loading and unloading
- authored entry points
- collision
- exits and transitions
- persistent room/world flags
- return visits reflecting previous actions

### Combat
- melee hitboxes
- enemy hurtboxes
- enemy states
- damage resolution
- hit feedback
- one melee enemy archetype
- one ranged or area-control archetype

### Interaction
- NPC dialogue
- chest/collectible
- switch or mechanism
- locked/gated route
- inspectable relic object

### Axiom
- Resonance
- Tether traversal
- Tether object interaction
- Tether combat use

### Resonance v1 contract

Resonance is a short Axiom pulse, not a permanent detective-vision overlay.

The first implementation must:
- use a dedicated input separate from Shardblade attack
- emit a visible expanding pulse
- react only to authored compatible ancient objects
- persist discovered mechanisms/routes through Save V1 flags
- work on touch, keyboard, and controller
- reveal useful information without solving unrelated puzzles automatically

Current mappings:
- Touch: dedicated `◇` button
- Keyboard: `E`, `R`, or Shift
- Controller: secondary face button / B-style action

### Puzzle
Use the doctrine: Teach -> Test -> Combine -> Twist -> Master.

The slice should include at minimum:
- one simple switch/mechanism puzzle
- one push/manipulation puzzle
- one Resonance-authored discovery
- one Tether teaching room
- one room combining Tether with pressure or enemies

### Boss
The Archivist must include:
- readable telegraphs
- at least two meaningful phase/state changes
- Tether integration
- arena state change
- restart/checkpoint behavior that does not waste the player's time
- skippable/reduced repeated introduction after first view

### Story
- establish Kael's occupation and temperament
- introduce Greyhaven as a place worth returning to
- awaken the Axiom
- establish The Vein as active again
- introduce uncertainty around Kael's relationship to ancient systems
- end on the Archivist's `WELCOME BACK.` reveal

### Presentation
- coherent region palette and visual language
- distinct Greyhaven / Hollow March / Archive identities
- basic cinematic camera language
- location title cards or equivalent introduction treatment
- musical identities or production placeholders with defined intent
- portrait letterbox regions remain intentionally dark and are never contaminated by gameplay/cinematic fullscreen effects

### Persistence
Initial save schema should support:
- current room/checkpoint
- health or recovery state as appropriate
- inventory/key items
- Axiom abilities
- world flags
- opened chests
- solved puzzles
- defeated boss flags
- settings

Current Save V1 additionally persists authored defeated-enemy IDs and Resonance discovery flags. Page hide/background transitions should request an autosave in addition to room-transition autosaves.

Do not overbuild cloud services during this slice. Keep the persistence contract clean enough to support cloud synchronization later.

## Acceptance Criteria

The slice is not considered complete merely because all rooms exist.

It is ready for expansion only when:
- player movement feels responsive on desktop and touch
- room transitions are stable
- save/reload preserves meaningful world state
- no required puzzle can soft-lock progression
- Resonance is understandable without becoming a generic scanning overlay
- Tether is understandable without excessive text instruction
- the Archivist encounter is readable and recoverable
- viewed cinematic sequences do not become irritating on retry
- the game remains usable in phone and tablet layouts
- portrait presentation keeps non-gameplay letterbox regions dark and intentional
- performance remains stable during normal combat and boss effects
- the final reveal lands clearly without requiring lore exposition

## Scope Discipline

Explicitly deferred until the slice proves itself:
- large inventory system
- crafting
- procedural world generation
- online multiplayer
- cloud accounts
- large skill trees
- dozens of enemy types
- final overworld scale
- full soundtrack
- final production art for every future region

Build the smallest version that proves the complete VEILBOUND promise, then expand.
