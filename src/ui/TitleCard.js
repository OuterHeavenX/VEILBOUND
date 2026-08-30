(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // The title drop and the objective banner: two in-play overlays the cutscene sequencer
  // raises. Both are DOM rather than canvas so they stay crisp at any device scale and
  // remain readable to a screen reader.
  const el = id => document.getElementById(id);
  let objectiveTimer = 0;

  window.Veilbound.TitleCard = {
    show() {
      const card = el('title-card');
      if (!card) return;
      card.hidden = false;
      // Restart the animation even if the card was shown earlier this session.
      card.classList.remove('is-lit');
      void card.offsetWidth;
      card.classList.add('is-lit');
    },
    hide() {
      const card = el('title-card');
      if (!card) return;
      card.classList.remove('is-lit');
      card.hidden = true;
    },

    // OBJECTIVE UPDATED: ... — holds for a few seconds, then fades on its own.
    objective(text) {
      const banner = el('objective-banner');
      const body = el('objective-text');
      if (!banner || !body) return;
      body.textContent = text;
      banner.hidden = false;
      banner.classList.remove('is-lit');
      void banner.offsetWidth;
      banner.classList.add('is-lit');
      objectiveTimer = 5.2;
    },

    update(dt) {
      if (objectiveTimer <= 0) return;
      objectiveTimer -= dt;
      if (objectiveTimer > 0) return;
      const banner = el('objective-banner');
      if (!banner) return;
      banner.classList.remove('is-lit');
      banner.hidden = true;
    },
  };
})();
