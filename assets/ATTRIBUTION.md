# Asset attribution

Third-party assets currently in the repository, and what is still unresolved about them.

## KayKit — characters, animations, weapon props

- Source: Kay Lousberg, <https://kaylousberg.itch.io/kaykit-character-animations>
- In-repo: `assets/characters/Characters/`, `Animations/`, `Textures/`, the root
  `Rock*.png` set, and the loose `.obj`/`.gltf` weapon props.
- Used as **placeholder art**. See `docs/CANON.md` for the intended visual direction, which
  this pack does not match. Roadmap rule 2.9 requires an original identity for the shipped
  game, so these are staging material, not the final look.

**Unresolved:** no licence file was committed with the upload. Before any public release,
add the pack's own licence text here and confirm the redistribution terms. Do not assume
they permit redistribution inside this repository until that is checked.

## 2D sprite sheets

- In-repo: `assets/Objects.png`, `assets/Icons.png`, `assets/Funiture.png`,
  `assets/chests.png`, and the duplicate copies under `assets/characters/main_character/`.
- Source not recorded in the upload. `assets/readme.txt` names only a preview font
  (<https://www.dafont.com/digital-disco.font>), which is not the sprite licence.

**Unresolved:** origin and licence unknown. These are not wired into the game.

## Generated, not third-party

- `assets/sprites/` is produced by `tools/prerender-characters.mjs` from the KayKit models.
  It inherits whatever terms apply to the source pack above.
