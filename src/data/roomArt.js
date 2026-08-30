(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Authored room backgrounds. A room named here paints its plate instead of the procedural
  // ground/details pass; anything not named here, or whose file fails to load, keeps the
  // procedural art untouched.
  //
  // `fit: 'stretch'` maps the whole image onto the 960x540 world. The Greyhaven plate is
  // 1844x853 (2.16) against the world's 1.78, so it squashes ~18% horizontally — but it was
  // painted from this room's authored layout, and every building lands on the collision box
  // that was already there, which a uniform crop does not do.
  window.Veilbound.RoomArtData = Object.freeze({
    greyhaven: Object.freeze({
      file: 'assets/maps/greyhaven-town.jpg',
      fit: 'stretch',
      // The lift gate reads as dead stone in the plate. Once the Axiom wakes, the town's own
      // Vein machinery answers it, so the glow is painted by the engine rather than shipping
      // a second 3 MB plate: the two supplied plates are independent renders and their
      // lighting does not match, so one cannot be composited over the other.
      awakenGlow: Object.freeze({
        flag: 'story.axiomAwakened',
        x: 506, y: 96, radius: 92, colour: '127, 231, 225',
      }),
    }),
  });
})();
