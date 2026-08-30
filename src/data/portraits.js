(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Speaker portraits for the dialogue box, keyed by the speaker name the line carries.
  // A speaker with no entry simply shows no portrait and the box lays out as it always has,
  // so adding art for one character never requires art for the rest.
  //
  // `expressions` is the blueprint's frame-swapper: a line may name one with
  // `{ speaker, text, mood }`, and an unknown mood falls back to `neutral`.
  //
  // KAEL and YOUNG KAEL are two speakers in the opening script and two supplied figures. The
  // younger wears the green hood and a green-lit Axiom; the adult is dark, masked, and
  // carries the lit Shardblade. Note they are drawn in different registers — the younger in
  // pixel art, the adult painted — which `docs/OPENING.md` records as unresolved.
  window.Veilbound.Portraits = Object.freeze({
    KAEL: Object.freeze({
      expressions: Object.freeze({ neutral: 'assets/characters/kael_adult_bust.png' }),
    }),
    'YOUNG KAEL': Object.freeze({
      expressions: Object.freeze({ neutral: 'assets/characters/kael_bust.png' }),
    }),
  });
})();
