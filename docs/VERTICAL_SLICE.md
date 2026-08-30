# VEILBOUND — First Playable Vertical Slice

## Current Implementation Status

**Current playable branch:** `claude/todo-implementation-td5zeq`, merged to `main`  
**Current playable version:** `v0.4.1-prologue`  
**Last updated:** 2026-08-30

The slice has moved from foundation work into the first playable dungeon. The existing title/menu, XP/JP/coin progression, Greyhaven, Hollow March, Axiom awakening, Resonance, combat, saves, sprites, and terrain remain the base for this branch.

### Implemented foundation

- [x] six-scene opening prologue: the memory, the void, the forest path, the title drop, the Hunter Hall and the first toll

- [x] zero-build `index.html` launch
- [x] title key art featuring Kael, Lyra and Mira, with START / CONTINUE / SETTINGS
- [x] landscape enforced by orientation lock where granted and a rotate gate everywhere else
- [x] pause / Character menu with HP, XP, JP, coins, Shardblade level, protocols and journey state
- [x] Greyhaven exterior, NPC interaction and Wayfarer's Rest save/rest point
- [x] Hollow March Field 1 and Field 2
- [x] movement, collision and room transitions
- [x] Shardblade combat, damage, knockback and i-frames
- [x] March Husk and Vein Sentry enemy roles
- [x] Save V1 local persistence and safe resume
- [x] XP +2 and JP +1 on each enemy defeat
- [x] one physical coin drop per enemy defeat and coin pickup persistence
- [x] Forgotten Relic Chamber / Axiom awakening
- [x] Resonance on touch, keyboard and controller
- [x] authored Resonance discoveries and persistent world flags
- [x] enemy repopulation on ordinary room re-entry
- [x] development diagnostics

### Sunken Archive opening — implemented, owner-device acceptance pending

- [x] Resonance-revealed route from Hollow March Field 2 to the Archive
- [x] `SUNKEN ARCHIVE — EASTERN DESCENT`
- [x] persistent `archive.entered` first-entry acknowledgement
- [x] drowned side chambers with matching water/collision geometry
- [x] `SUNKEN ARCHIVE — VESTIBULE`
- [x] mixed Husk + Vein Sentry dungeon encounter
- [x] reusable persistent floor-switch behavior
- [x] reusable persistent door/seal collision behavior
- [x] gated exit tied to the same seal-open flag
- [x] `SUNKEN ARCHIVE — CATALOG ROTUNDA`
- [x] Rotunda Resonance memory node
- [x] explicit Tether foreshadowing
- [x] deeper Archive bulkhead remains intentionally sealed
- [x] full backtrack route to Hollow March remains available

### Cistern wing — implemented, owner-device acceptance pending

- [x] reusable puzzle primitives extracted to `src/core/Puzzles.js`
- [x] `SUNKEN ARCHIVE — CISTERN WALK`, teaching the push block against a weight-only plate
- [x] `SUNKEN ARCHIVE — SLUICE GALLERY`, where Resonance operates a valve rather than reading it
- [x] `SUNKEN ARCHIVE — RELIQUARY SPAN`, combining valve, block and plate under two live enemies
- [x] routed water that is impassable until drained, art and collision from one rectangle
- [x] two-way shortcut from the Span back to the Vestibule, closing the wing into a loop

### Still required for the complete slice

- [ ] owner-device acceptance of `v0.4.1-prologue`
- [ ] Tether acquisition
- [ ] Tether traversal teaching
- [ ] Tether object manipulation
- [ ] Tether combat integration
- [ ] deeper Archive rooms combining learned verbs
- [ ] Archivist boss encounter
- [ ] post-boss `WELCOME BACK.` recognition sequence
- [ ] full iPhone/iPad/desktop/controller acceptance

## Objective

Prove VEILBOUND's complete identity with one compact, high-quality route before expanding world scale.

The player should experience exploration, combat, a returning town, Axiom discovery, authored Resonance, a real multi-room dungeon, Tether progression, a boss, persistent world change, and the first major mystery payoff.

## Target Flow

1. Greyhaven introduction.
2. Hollow March traversal.
3. Forgotten Relic Chamber / Axiom awakening.
4. Return path with altered world state.
5. Resonance reveals the Eastern Descent.
6. Enter the Sunken Archive.
7. Learn the Archive's switch/seal language.
8. Read the Catalog Rotunda and discover the missing Tether protocol.
9. Continue into deeper teaching rooms.
10. Acquire Tether halfway through the dungeon.
11. Master Tether through traversal, puzzles and combat.
12. Fight The Archivist.
13. Receive the `WELCOME BACK.` reveal.
14. Return to an altered Greyhaven / overworld state.

## Current Room Graph

```text
[GREYHAVEN]
     |
[HOLLOW MARCH — FIELD 1]
     |
[HOLLOW MARCH — FIELD 2] ---- [FORGOTTEN RELIC CHAMBER]
     |
     | Resonance-revealed route
     v
[SUNKEN ARCHIVE — EASTERN DESCENT]
     |
[SUNKEN ARCHIVE — VESTIBULE] <--------------+
     |                                     |
     | persistent floor switch / seal      | shortcut
     v                                     |
[SUNKEN ARCHIVE — CATALOG ROTUNDA]         |
     |                    \                |
     |                     \ west          |
     |                      v              |
     |          [SUNKEN ARCHIVE — CISTERN WALK]
     |                      |     push block -> weight plate
     |                      v
     |          [SUNKEN ARCHIVE — SLUICE GALLERY]
     |                      |     Resonance valve -> drained channel
     |                      v
     |          [SUNKEN ARCHIVE — RELIQUARY SPAN]
     |                      |              |
     |                      +--------------+
     v
 [DEEP ARCHIVE — SEALED]
     |
   TETHER
     |
 [FUTURE TEACH / COMBINE ROOMS]
     |
 [THE ARCHIVIST]
```

Exact physical layout can change after playtesting. The functional teaching sequence should remain compact.

## Systems the Slice Must Prove

### Player
- responsive movement
- readable facing/animation
- Shardblade attack
- damage, knockback, hurt state and i-frames
- readable health state

### Input
- keyboard
- touch
- gamepad/controller
- menu input independent from gameplay actions

### World
- authored room entry points
- collision and transitions
- persistent room/world flags
- return visits reflecting prior actions
- visual geometry agreeing with collision

### Combat
- melee hit/hurt overlap
- enemy states and telegraphs
- one melee archetype
- one ranged/area-control archetype
- XP/JP reward and physical coin drop pipeline

### Interaction
- NPC dialogue
- save/rest mechanism
- switch / persistent door
- locked or ability-gated route
- inspectable ancient mechanisms

### Axiom
- Resonance
- Tether traversal
- Tether object interaction
- Tether combat use

### Resonance contract

Resonance is a short Axiom pulse, not a permanent detective-vision overlay. It reacts only to authored compatible ancient structures and may reveal routes, memories, combat disruption windows or mechanisms.

Current mappings:
- Touch: dedicated `◇` button
- Keyboard: `E`, `R`, or Shift
- Controller: secondary face button / B-style action

### Puzzle doctrine

**Teach → Test → Combine → Twist → Master**

Current dungeon implementation:
- Teach: Eastern Descent establishes water, causeway and Archive visual language.
- Test: Vestibule teaches plate → persistent seal under light enemy pressure.
- Combine/foreshadow: Catalog Rotunda combines exploration/combat space with a Resonance memory and establishes Tether as the missing manipulation verb.

- Teach: Cistern Walk teaches the push block against a plate no footstep can hold.
- Teach: Sluice Gallery has Resonance operate a valve rather than only read one.
- Combine: Reliquary Span puts valve, block and plate together under two live enemies, and
  opens the shortcut that closes the wing into a loop.

Still required:
- Tether safe teaching room
- Tether + enemy pressure
- Tether + machinery
- mastery room before boss

### Boss

The Archivist must include readable telegraphs, meaningful phase/state changes, arena change, Tether integration, recoverable restart behavior and a shortened/skippable repeated introduction.

### Story

The slice must establish Kael as a relic hunter, Greyhaven as worth returning to, The Vein waking, the Axiom recognizing Kael, the Archive responding to him, and finally the Archivist's impossible `WELCOME BACK.` recognition.

### Presentation

- distinct Greyhaven / Hollow March / Archive identities
- location presentation with strong silhouette/readability
- coherent Axiom cyan language without flooding the screen
- authored cinematic moments kept concise
- intentional dark letterbox/unused viewport areas
- mobile-scale readability

### Persistence

Save V1 currently carries player state, Axiom abilities, progression counters and authored world flags. Archive puzzle state uses those world flags rather than runtime-only state. Schema-breaking migration remains deferred until a breaking change is actually required.

## Acceptance Criteria

The vertical slice is not complete merely because all rooms exist. It is ready for expansion only when movement feels responsive on touch/desktop, transitions and saves are stable, no required puzzle can soft-lock, Resonance and Tether are understandable, the Archivist is readable/recoverable, retry presentation respects the player, and phone/tablet performance remains stable.

For the current dungeon milestone specifically, see `docs/SUNKEN_ARCHIVE.md` for the owner-device checklist.

## Scope Discipline

Still deliberately deferred until the slice proves itself:
- large inventory/crafting systems
- online multiplayer
- cloud accounts
- large skill trees
- dozens of enemy types
- final overworld scale
- full soundtrack
- final production art for future regions

Build the smallest version that proves the complete VEILBOUND promise, then expand.
