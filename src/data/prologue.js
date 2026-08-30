(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // The opening, authored from the owner's production blueprint. Every line of dialogue is
  // reproduced word for word; what is authored here is the staging — how long each beat
  // holds, what the screen does, and which cue sounds.
  //
  // The blueprint specifies generated pixel video and generated audio per beat. VEILBOUND is
  // a zero-build Canvas 2D game with wholly synthesised audio and no video pipeline, so each
  // visual and audio prompt is realised with the effects the runtime actually has. The
  // prompts themselves are preserved in docs/OPENING.md as the art and audio direction.
  const S = (speaker, text) => ({ speaker, text });

  window.Veilbound.Prologue = Object.freeze({

    // SCENE 1 — "Remember My Face"
    memory: Object.freeze({
      id: 'prologue.memory',
      region: 'ruin',
      beats: Object.freeze([
        // Beat 1: The Dark Room
        { fx: { black: 1, letterbox: 1 }, wait: 1.6 },
        { fx: { black: 1, veins: 0.12 }, cue: 'discover', wait: 1.1 },
        { say: [S('ELARA', 'Kael, look at me.')] },

        // Beat 2: The Glitched Memory
        { fx: { black: 1, glitch: 0.5, veins: 0.34 }, cue: 'interact', wait: 0.5 },
        { say: [
          S('YOUNG KAEL', 'I am looking.'),
          S('ELARA', 'No matter what happens, remember my face.'),
        ] },
        { fx: { glitch: 0.78 }, wait: 0.4 },
        { say: [
          S('YOUNG KAEL', 'Why are you crying?'),
          S('ELARA', 'Because I have to ask you to be brave before you should have to be.'),
        ] },

        // Beat 3: The Departure
        { fx: { shake: 1, glitch: 0.6, veins: 0.5 }, cue: 'hit', wait: 0.55 },
        { fx: { shake: 0.9 }, cue: 'hit', wait: 0.45 },
        { say: [
          S('ELARA', 'When the bell rings, follow my voice.'),
          S('YOUNG KAEL', 'Where are you going?'),
          S('ELARA', 'Somewhere quiet.'),
          S('YOUNG KAEL', 'Will you come back?'),
          S('ELARA', 'I will find a way to reach you.'),
        ] },

        // Beat 4: Erased
        { fx: { black: 1, glitch: 1, symbol: 1, flash: 0.8 }, cue: 'resonance', wait: 0.9 },
        { fx: { symbol: 0, glitch: 0.2, static: 0.9, veins: 0 }, wait: 0.7 },
        { fx: { black: 1, glitch: 0, static: 0 }, wait: 0.6 },
        { say: [S('YOUNG KAEL', 'Mother?')] },
        { fx: { black: 1, letterbox: 1 }, wait: 1.2 },
      ]),
    }),

    // SCENE 2 — The Void
    void: Object.freeze({
      id: 'prologue.void',
      region: 'ruin',
      beats: Object.freeze([
        { fx: { black: 1, letterbox: 1, static: 0.85 }, cue: 'menuOpen', wait: 1.4 },
        { say: [
          S('UNKNOWN VOICE', 'Memory removal complete.'),
          S('CALDRIS', 'Not complete. Something remains.'),
          S('SERAC', 'The child?'),
          S('CALDRIS', 'Leave him. Without her face, he will never find the door.'),
        ] },
        { fx: { static: 0.2 }, wait: 0.8 },
        { fx: { black: 1, static: 0, letterbox: 1 }, wait: 1.0 },
      ]),
    }),

    // SCENE 3 — The Forest Path, Beat 2: The Flash Vision.
    // Five images the blueprint specifies as one-frame strobe cuts. The runtime has no video,
    // so each lands as a hard flash with its own line — the vision is read, not watched.
    vision: Object.freeze({
      id: 'prologue.vision',
      region: 'march',
      beats: Object.freeze([
        { fx: { letterbox: 1, flash: 0.85, invert: 0.5 }, cue: 'resonance', wait: 0.32 },
        { fx: { invert: 0, flash: 0.7, veins: 0.5 }, wait: 0.26 },
        { say: [S('VISION', 'A town burning, orange against the rain.')] },
        { fx: { flash: 0.7, invert: 0.35 }, wait: 0.24 },
        { say: [S('VISION', 'A girl standing under a giant silent bell.')] },
        { fx: { flash: 0.7, glitch: 0.5 }, wait: 0.24 },
        { say: [S('VISION', 'A woman locked in a glass cage.')] },
        { fx: { flash: 0.7, glitch: 0.8, veins: 0.85 }, wait: 0.24 },
        { say: [S('VISION', 'A mother wired into a machine beneath the ground.')] },
        { fx: { flash: 0.7, glitch: 0.3, veins: 0.4 }, wait: 0.24 },
        { say: [S('VISION', 'An overgrown headstone in the mud.')] },
        { fx: { flash: 0.9, glitch: 0, veins: 0, invert: 0.6 }, cue: 'hurt', wait: 0.3 },
        { fx: { letterbox: 0, invert: 0 }, wait: 0.35 },
        { say: [S('KAEL', 'Not again.')] },
      ]),
    }),

    // SCENE 4 — post-combat, the corrupted creature.
    creature: Object.freeze({
      id: 'prologue.creature',
      region: 'march',
      beats: Object.freeze([
        { fx: { letterbox: 1, veins: 0.5 }, cue: 'enemyDown', wait: 0.5 },
        { say: [
          S('CREATURE', 'I had a name.'),
          S('KAEL', 'What did you say?'),
        ] },
        { fx: { letterbox: 0, veins: 0 }, wait: 0.5 },
      ]),
    }),

    // SCENE 4, Beat 2 — Title Drop. The overlook shot, with the title card owned by the DOM.
    title: Object.freeze({
      id: 'prologue.title',
      region: 'greyhaven',
      beats: Object.freeze([
        { fx: { letterbox: 1 }, wait: 1.1 },
        { fx: { black: 0.35 }, cue: 'rest', wait: 1.5 },
        { then: () => window.Veilbound.TitleCard && window.Veilbound.TitleCard.show(), wait: 3.4 },
        { then: () => window.Veilbound.TitleCard && window.Veilbound.TitleCard.hide(),
          fx: { black: 0, letterbox: 0 }, wait: 1.0 },
      ]),
    }),

    // SCENE 5 — Hunter Hall
    hall: Object.freeze({
      id: 'prologue.hall',
      region: 'greyhaven',
      beats: Object.freeze([
        { fx: { letterbox: 1 }, cue: 'blip', wait: 0.7 },
        { say: [
          S('KAEL', 'Good to see you too.'),
          S('MIRA', 'You said two weeks.'),
          S('KAEL', 'It became complicated.'),
          S('MIRA', 'Four months is not complicated. Four months is a new season.'),
          S('MIRA', 'You are hurt.'),
          S('KAEL', 'I am fine.'),
          S('MIRA', 'You are a terrible liar.'),
          S('KAEL', 'Only with you.'),
        ] },
        { fx: { letterbox: 0 }, wait: 0.5 },
      ]),
    }),

    // SCENE 6 — The First Toll
    toll: Object.freeze({
      id: 'prologue.toll',
      region: 'greyhaven',
      beats: Object.freeze([
        // Beat 1: The Ring
        { fx: { letterbox: 1, shake: 1, invert: 0.9 }, cue: 'bell', wait: 0.6 },
        { fx: { invert: 0 }, wait: 0.5 },
        { say: [S('ELARA', 'Kael.')] },

        // Beat 2: The Second Toll & Flashback
        { fx: { shake: 0.9, invert: 0.7, glitch: 0.45, black: 0.4 }, cue: 'bell', wait: 0.7 },
        { fx: { invert: 0 }, wait: 0.4 },
        { say: [S('ELARA', 'Do not let them make the world quiet again.')] },
        { fx: { glitch: 0, black: 0 }, wait: 0.4 },

        // Beat 3: The Relic Breaks
        { fx: { shake: 0.7, flash: 0.4 }, cue: 'hit', wait: 0.5 },
        { fx: { symbol: 0.9, veins: 0.4 }, cue: 'discover', wait: 0.8 },
        { say: [
          S('MIRA', 'Please tell me relics normally do that.'),
          S('KAEL', 'They do not.'),
        ] },
        { fx: { symbol: 0.5, black: 0.85 }, wait: 0.6 },

        // Beat 4: The Third Toll & Underground Awakening
        { fx: { shake: 1, black: 0.95, symbol: 0, veins: 1 }, cue: 'bell', wait: 1.5 },
        { fx: { black: 0.7, veins: 1, letterbox: 1 }, wait: 1.0 },
        { fx: { black: 0, veins: 0.3, letterbox: 0 }, wait: 0.8 },
      ]),
    }),
  });
})();
