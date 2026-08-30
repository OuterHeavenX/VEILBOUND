(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Authored grid sheets, as opposed to the generated 8-direction sheets in
  // characterSprites.js. These ship as-is from the upload: 64px cells, four direction
  // rows in the order south, north, west, east, and one row-major sheet per clip.
  //
  // Frame counts are the sheet width divided by the cell, measured from the files.
  // Placeholder casting, see assets/ATTRIBUTION.md.

  const ROWS = { south: 0, north: 1, west: 2, east: 3 };

  const goblin = 'assets/characters/enemies/goblin/';
  const slime = 'assets/characters/enemies/slime/';

  window.Veilbound.EnemySprites = Object.freeze({
    // March Husk — melee pursuit. The spear goblin is the closest fit in the upload.
    husk: Object.freeze({
      cell: 64, rows: ROWS, scale: 1.15,
      clips: Object.freeze({
        idle:   { file: goblin + 'Idle_without_shadow.png', frames: 4, fps: 6 },
        walk:   { file: goblin + 'Walk_without_shadow.png', frames: 6, fps: 9 },
        attack: { file: goblin + 'Attack_without_shadow.png', frames: 5, fps: 12, loop: false },
        hurt:   { file: goblin + 'Hurt_without_shadow.png', frames: 4, fps: 14, loop: false },
        death:  { file: goblin + 'Death_without_shadow.png', frames: 6, fps: 9, loop: false },
      }),
    }),

    // Vein Sentry — ranged area control. Nothing in the upload matches a Vein machine, so
    // the slime stands in. The authored telegraph ring and aim line still draw over it,
    // because those carry the readability the encounter is tuned around.
    sentry: Object.freeze({
      cell: 64, rows: ROWS, scale: 1.15,
      clips: Object.freeze({
        idle:   { file: slime + 'Slime1_Idle_without_shadow.png', frames: 6, fps: 6 },
        walk:   { file: slime + 'Slime1_Walk_without_shadow.png', frames: 8, fps: 9 },
        attack: { file: slime + 'Slime1_Attack_without_shadow.png', frames: 10, fps: 13, loop: false },
        hurt:   { file: slime + 'Slime1_Hurt_without_shadow.png', frames: 5, fps: 14, loop: false },
        death:  { file: slime + 'Slime1_Death_without_shadow.png', frames: 10, fps: 10, loop: false },
      }),
    }),
  });
})();
