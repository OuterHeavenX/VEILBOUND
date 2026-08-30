# Asset attribution

Third-party assets currently in the repository, and what is still unresolved about them.

## KayKit — characters, animations, weapon props

- Source: Kay Lousberg, <https://kaylousberg.itch.io/kaykit-character-animations>
- In-repo: `assets/characters/Characters/`, `Animations/`, `Textures/`, the root
  `Rock*.png` set, and the loose `.obj`/`.gltf` weapon props.
- Used as **placeholder art**. See `docs/CANON.md` for the intended visual direction, which
  this pack does not match. Roadmap rule 2.12 requires an original identity for the shipped
  game, so these are staging material, not the final look.

**Unresolved:** no licence file was committed with the upload. Before any public release,
add the pack's own licence text here and confirm the redistribution terms. Do not assume
they permit redistribution inside this repository until that is checked.

## CraftPix — enemies, forest set, roads, menu UI

- Licence files shipped with the upload, all pointing at <https://craftpix.net/file-licenses/>:
  `assets/characters/enemies/goblin/license.txt`, `assets/characters/enemies/slime/License.txt`,
  `assets/places/forest/License.txt`, `assets/path_road/license.txt`,
  `assets/menu_buttons/License.txt`.
- In-repo: `assets/characters/enemies/`, `assets/places/forest/`, `assets/path_road/`,
  `assets/menu_buttons/`.
- Wired into the game: the goblin and slime sheets as the March Husk and Vein Sentry, the
  forest props as Hollow March scenery, road/ground tiles for terrain, and selected menu UI
  PNGs as development framing for the v0.2.1 Character menu.

**Read the licence before this repository is public.** CraftPix terms generally allow using
the art inside a game while restricting redistribution of the asset files themselves, and a
public repository distributes the files to anyone who clones it. That is a different question
from whether the game may ship with them, and it has not been answered here. The `.psd` and
`.aseprite` sources in these folders are editable originals, which raises the same question
more sharply than the exported PNGs do.

The v0.2.1 Character menu treats this UI kit as **placeholder/development art**, not final
VEILBOUND identity. Replacing it with original authored menu art remains part of the public
release gate.

## 2D sprite sheets

- In-repo: `assets/Objects.png`, `assets/Icons.png`, `assets/Funiture.png`,
  `assets/chests.png`, and the duplicate copies under `assets/characters/main_character/`.
- Source not recorded in the upload. `assets/readme.txt` names only a preview font
  (<https://www.dafont.com/digital-disco.font>), which is not the sprite licence.

**Unresolved:** origin and licence unknown. These are not wired into the game.

## Title key art

- In-repo: `assets/title/keyart.jpg` — Kael, Lyra and Mira above a ruined Eidol under an
  eclipse. Supplied by the owner in v0.3.3 and wired in as the title plate.
- Committed as JPEG at quality 0.90 (315 KB) rather than the original 2.9 MB PNG, because it
  loads on the title screen of a mobile-first game. The source PNG is the owner's.

**Unresolved:** origin and licence not recorded. Establish where this image came from, and on
what terms, before the repository or the game is public. It is the only third-party-origin
art the player actually sees at launch, so it is the sharpest version of the question the
rest of this file asks.

## Greyhaven and Hollow March map plates

- In-repo: `assets/maps/`. Supplied by the owner in v0.3.4 as eleven PNGs with opaque
  filenames, renamed here to what they are.
- `greyhaven/town-dormant.png` is the source for `greyhaven-town.jpg`, the plate the game
  loads. Committed at JPEG quality 0.88 (423 KB) beside the 3.3 MB PNG source.
- `greyhaven/town-awake-npcs.png` and `greyhaven/town-ground-only.png` are alternate renders
  kept as reference. Neither is loaded: the awake one has NPCs painted into it that would
  fight the game's own NPC sprites, and the three plates are independent generations whose
  lighting does not match, so they cannot be composited.
- `march-field.png` and the seven `buildings/*.png` elevations are unused so far. See
  `docs/PROGRESS.md` § v0.3.4 for why the march plate is not wired to either Hollow March
  field yet.

**Unresolved:** origin and licence not recorded, as with the title key art. These are now the
second body of owner-supplied art the player sees directly.

## Generated, not third-party

- `assets/sprites/` is produced by `tools/prerender-characters.mjs` from the KayKit models.
  It inherits whatever terms apply to the source pack above.
- The v0.3.3 prerendered title portraits and their `tools/prerender-portraits.mjs` were
  removed when the key art replaced them. Both are in git history if that pass is wanted
  again.
