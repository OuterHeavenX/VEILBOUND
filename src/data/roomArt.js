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

    // The two Hollow March plates. Which painting goes to which field is an authoring
    // choice, not a structural one: both paint their road through the west and east exit
    // bands, so the pair can be swapped by exchanging these two `file` values.
    //
    // As assigned: the roads-and-walls field is continuous with the Greyhaven plate — same
    // stonework, same boundary walls, same fences — so it reads as the field immediately
    // outside town. The rainswept one carries the Vein crystal shrine, which is what
    // `march.field2.veinMarker` reads, and CANON has the March begin peaceful and grow
    // unsettling as Vein activity returns.
    hollowMarch1: Object.freeze({
      file: 'assets/maps/fields/field-1-roads.jpg',
      fit: 'stretch',
    }),
    hollowMarch2: Object.freeze({
      file: 'assets/maps/fields/field-2-vein.jpg',
      fit: 'stretch',
    }),
  });
})();
