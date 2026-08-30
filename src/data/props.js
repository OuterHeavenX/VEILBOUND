(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Authored scenery for the Hollow March, drawn from the forest set in the upload.
  //
  // Placement rule: anything that reads as an obstacle sits on top of a collision
  // rectangle that already exists in the room, so the art and the collision agree without
  // retuning traversal that is already accepted. Everything else is decoration only and is
  // kept clear of the walking corridors.
  //
  // `x` and `y` are the prop's ground point. `size` is its drawn width in world units;
  // sprites are square, so height follows.

  const forest = 'assets/places/forest/';
  const prop = (file, x, y, size, sway = 0) => ({ file: forest + file, x, y, size, sway });

  window.Veilbound.Props = Object.freeze({
    hollowMarch1: Object.freeze([
      // Over the wall at (210,118,130,46): a stone-and-scrub hedge.
      prop('Brown_stone_grass1.png', 240, 152, 70),
      prop('Bush1.png', 300, 150, 62, .5),
      prop('Bush11.png', 205, 154, 54, .5),
      // Over the wall at (430,225,90,90): the field's landmark tree.
      prop('Tree1.png', 475, 300, 138, .3),
      // Over the wall at (610,365,145,52): a collapsed structure.
      prop('Ruin_grass1.png', 650, 405, 106),
      prop('Brown_stone_grass2.png', 726, 398, 46),
      // Decoration, clear of the corridors.
      prop('Bush4.png', 120, 430, 40, .6),
      prop('Bush9.png', 862, 138, 40, .6),
      prop('Red_mushroom1.png', 168, 246, 26),
      prop('Red_mushroom3.png', 796, 470, 26),
      prop('Bush6.png', 372, 462, 22, .7),
      prop('Broken_tree4.png', 556, 132, 40),
      prop('Bush10.png', 884, 344, 22, .7),
    ]),

    hollowMarch2: Object.freeze([
      // Over the wall at (175,300,170,42).
      prop('Brown_stone_grass1.png', 210, 334, 70),
      prop('Bush11.png', 280, 332, 58, .5),
      prop('Brown_stone_grass4.png', 330, 336, 40),
      // Over the wall at (480,115,210,52): a longer ruin, closer to the buried Vein route.
      prop('Ruin_grass2.png', 530, 158, 112),
      prop('Ruin_grass4.png', 632, 152, 68),
      // Over the wall at (690,344,95,95): the second landmark tree.
      prop('Tree2.png', 738, 420, 132, .3),
      // Decoration.
      prop('Broken_tree1.png', 128, 168, 92),
      prop('reeds1.png', 402, 452, 30, .8),
      prop('reeds3.png', 438, 466, 30, .8),
      prop('Bush5.png', 866, 452, 38, .6),
      prop('Red_mushroom2.png', 604, 300, 26),
      prop('Bush12.png', 856, 118, 32, .6),
    ]),
  });
})();
