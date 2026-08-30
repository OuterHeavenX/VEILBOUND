# VEILBOUND — Progression & Character Menu

**Owner:** ORACLE / FORGE  
**Introduced:** `v0.2.1-menu`

## Purpose

This document is the implementation contract for lightweight player progression before the Sunken Archive expands the game further. It deliberately establishes the currencies and character-information surface without prematurely committing VEILBOUND to a giant skill tree, inventory economy, or equipment system.

## Core enemy reward rule

Every ordinary enemy defeat awards exactly:

- **2 XP** immediately.
- **1 JP** immediately.
- **1 Coin** as a physical world drop.

The XP/JP reward is granted once when the enemy enters its death state. The Coin must be collected by moving Kael over the drop. Coin drops are room-local and are cleared on room transitions or recovery; uncollected drops are not persisted.

Ordinary Hollow March enemies currently repopulate on room entry, so these resources are grindable during the prototype phase. Balance may change later, but the `2 XP / 1 JP / 1 Coin` rule is authoritative until ORACLE changes it.

## Persistence

Save Schema V1 remains compatible. The `player` object now normalizes these additive fields:

- `xp` — non-negative integer, default `0`.
- `jp` — non-negative integer, default `0`.
- `coins` — non-negative integer, default `0`.

Existing saves missing these values normalize safely to zero without wiping room, health, Axiom state, flags, or other progress.

## Character menu

The in-game character menu pauses world simulation and exposes the current saved/live state for Kael:

- Name: **KAEL**
- Current location
- Health / max health
- XP
- JP
- Coins
- Shardblade level
- Unlocked Axiom protocols

Controls:

- Touch: dedicated circular menu button.
- Keyboard: `M` or `Tab`; `Escape` closes an open menu.
- Controller: Menu/Start button.

The first menu release intentionally shows Inventory and Equipment as future sections rather than inventing systems that are not designed yet.

## Visual direction

The menu uses the uploaded `assets/menu_buttons/` CraftPix UI art as development/placeholder framing, combined with VEILBOUND's existing dark relic-machine presentation. Gold/amber is reserved for Coins and menu relic-metal accents; Axiom/Resonance remains cyan.

The asset licensing warning in `assets/ATTRIBUTION.md` remains authoritative. The menu art is not treated as final original VEILBOUND identity and must not bypass the repository's public-release licensing gate.

## Runtime boundaries

- `src/core/Progression.js` owns kill rewards, coin drops, coin pickup, progression snapshots, and controller menu polling.
- `src/ui/CharacterMenu.js` owns the menu DOM and pause-facing UI surface.
- `menu.css` owns menu presentation and use of the uploaded menu UI assets.
- `src/core/SaveManager.js` owns normalization/persistence of XP, JP, and Coins.
- `src/main.js` remains authoritative for enemy death, world simulation, room transitions, and rendering integration.

## Acceptance checklist

- [ ] iPhone displays `v0.2.1-menu`.
- [ ] Touch menu button opens the Character menu.
- [ ] World simulation visibly pauses while the menu is open.
- [ ] Character menu reports the correct HP, location, Shardblade level, and Axiom abilities.
- [ ] A fresh enemy defeat shows `+2 XP +1 JP` once.
- [ ] Exactly one gold Coin appears at the defeated enemy's position.
- [ ] Walking over the Coin removes the drop and increments Coins by `1`.
- [ ] Menu values update after rewards/pickup.
- [ ] Defeating multiple enemies accumulates at the exact `2 XP / 1 JP / 1 Coin` rate.
- [ ] Refresh / Continue preserves XP, JP, and collected Coins.
- [ ] Existing pre-v0.2.1 save loads without losing prior progress.
- [ ] Movement, dialogue, Shardblade, Resonance, Sentry combat, title flow, and save/rest behavior remain stable.
