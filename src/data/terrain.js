(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Ground and path tiling, drawn from the uploaded tile sets.
  //
  // These sheets are 16px autotile sets: mostly edge, corner and junction pieces meant to be
  // assembled in Tiled. Rather than reimplement autotiling, this uses the interior field
  // tiles, chosen by seam analysis over each sheet: a tile is usable here when it is fully
  // opaque and its right edge continues into its own left edge, and likewise top to bottom.
  // Edges are handled by the authored geometry instead, which is why every path rectangle
  // below is verified clear of the room's collision rectangles.

  const FOREST = 'assets/places/forest/Ground_grass.png';
  const ROAD = 'assets/path_road/Road1_ground.png';

  const grass = { file: FOREST, tx: 14, ty: 22 };
  const dirt = { file: FOREST, tx: 13, ty: 1 };
  const cobble = { file: ROAD, tx: 13, ty: 2 };

  const path = (tile, x, y, w, h) => ({ ...tile, x, y, w, h });

  // The tile sets are brighter and more saturated than Eidol. This wash is painted over the
  // tiled terrain only, never over props or characters, so the ground settles into the
  // palette in docs/CANON.md while still being the uploaded art. Set alpha to 0 to see the
  // sheets untouched.
  const WASH = Object.freeze({ colour: '18, 28, 24', alpha: 0.38 });

  window.Veilbound.Terrain = Object.freeze({
    wash: WASH,
    greyhaven: Object.freeze({
      ground: grass,
      paths: Object.freeze([
        // The main east road, and the spur running up to the Old Lift Station.
        path(cobble, 0, 248, 960, 54),
        path(cobble, 468, 200, 66, 180),
      ]),
    }),

    hollowMarch1: Object.freeze({
      ground: grass,
      paths: Object.freeze([
        // The track bends south around the field's landmark tree and rejoins beyond it,
        // which is also the eastward guide the roadmap asked this field for.
        path(dirt, 0, 250, 410, 44),
        path(dirt, 366, 250, 44, 114),
        path(dirt, 366, 320, 228, 44),
        path(dirt, 550, 250, 44, 114),
        path(dirt, 550, 250, 410, 44),
      ]),
    }),

    hollowMarch2: Object.freeze({
      ground: grass,
      paths: Object.freeze([
        path(dirt, 0, 250, 960, 44),
      ]),
    }),
  });
})();
