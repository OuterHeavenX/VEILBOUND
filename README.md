# VEILBOUND

VEILBOUND is an original browser-based action-adventure RPG set in the ruined world of Eidol.

A masked relic hunter named Kael carries a damaged Shardblade and an ancient mechanical
gauntlet known as the Axiom. When the Axiom awakens, long-dormant systems beneath the world
begin responding to him.

## Play it

Open `index.html`. There is no build step, no npm install and no dev server — the game runs
from static hosting or straight off the filesystem, and that is a non-negotiable rule
(`ROADMAP.md` 2.1–2.2), not a convenience.

Landscape only: the world is authored at 960x540, so a phone held upright is asked to turn.

## Current state — `v0.4.6-cast`

Playable end to end from the title through Greyhaven, the Hollow March and the first six
rooms of the Sunken Archive:

- title key art, START / CONTINUE / SETTINGS, and safe save inspection
- a six-scene opening prologue, played through a data-driven cutscene sequencer
- Greyhaven with five reactive NPCs and the Wayfarer's Rest save point
- Shardblade melee, the March Husk and the ranged Vein Sentry
- the Axiom awakening and Resonance
- XP, JP and coins, with a character menu
- the Sunken Archive: floor plates, persistent seals, a push block, routed water and a
  shortcut loop
- procedural per-region audio, keyboard, touch and controller input

Not built yet: Tether, the deeper Archive, The Archivist, and the `WELCOME BACK.` payoff.
`ROADMAP.md` § 3 carries the full checklist and § 3.1 the owner-device acceptance backlog.

## Repository layout

```text
index.html          the launch path
styles.css          all presentation
src/core/           SaveManager, Audio, Sprites, Puzzles, Progression
src/ui/             Orientation, TitleScreen, PauseMenu
src/data/           authored registries: enemies, sprites, terrain, props, interactables
src/main.js         runtime: rooms, combat, movement, rendering
tools/              offline authoring tools, never shipped and never required to run the game
assets/             art, with provenance and open licensing questions in ATTRIBUTION.md
docs/               canon, architecture, combat, progression, dungeon, progress log
```

## Documentation

`ROADMAP.md` is the master plan and names the reading order. `AGENTS.md` is the
responsibility map. `docs/CANON.md` is authoritative for the world and its characters.
`docs/PROGRESS.md` is the chronological log, newest first.

Documentation states what is true of the current build; a claim that has stopped being true
is a defect (`ROADMAP.md` 2.13).

## Before this repository goes public

`assets/ATTRIBUTION.md` records unresolved licensing on every third-party asset pack in the
tree, including the title key art the player sees at launch. That is a release blocker, not a
footnote.

**Status:** Vertical slice in production. Foundation, opening loop and first dungeon wing
complete; Tether and the boss remain.
