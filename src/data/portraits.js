(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Speaker portraits for the dialogue box, keyed by the speaker name the line carries.
  // A speaker with no entry shows no portrait and the box lays out as it always has, so
  // adding art for one character never requires art for the rest.
  //
  // `expressions` is the blueprint's frame-swapper: a line may name one with
  // `{ speaker, text, mood }`, and an unknown mood falls back to `neutral`.
  //
  // The busts come from the owner's chibi cast, which is one consistent style across every
  // character — which matters here, because these appear beside each other in the same box
  // within a scene. Kael's painted figure is the character menu's portrait instead: alone and
  // large, key art reads better than a conversation bust.
  const bust = name => `assets/characters/chibi/${name}_bust.png`;
  const speaker = file => Object.freeze({ expressions: Object.freeze({ neutral: file }) });

  window.Veilbound.Portraits = Object.freeze({
    KAEL: speaker(bust('kael')),
    ELARA: speaker(bust('elara')),
    MIRA: speaker(bust('mira')),
    CALDRIS: speaker(bust('caldris')),
    SERAC: speaker(bust('serac')),
    // Young Kael has no chibi of his own; the earlier green-hooded figure stands in until one
    // exists. He is a different speaker from KAEL and is drawn as a different person.
    'YOUNG KAEL': speaker('assets/characters/kael_bust.png'),
    // Deliberately absent: UNKNOWN VOICE, VISION and CREATURE. None of them has a face in the
    // script — that is the point of each — so none gets one here.
  });
})();
