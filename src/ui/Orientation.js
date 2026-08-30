(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // VEILBOUND is authored as a 960x540 landscape world, so a phone held upright has nowhere
  // to put it. Two mechanisms, because neither is enough alone:
  //
  //   1. The real orientation lock. Android Chrome grants it, but only to a fullscreen
  //      document, and iOS Safari does not implement it at all. It is attempted, quietly,
  //      on the first user gesture and never depended upon.
  //   2. A blocking overlay whenever the viewport is portrait. This is what actually holds
  //      on iOS, and it also covers the moment before a granted lock takes effect.
  //
  // Only devices that can rotate are held. A desktop window that happens to be tall has a
  // mouse, and telling someone with a mouse to rotate their monitor is nonsense.
  const Orientation = {
    init({ onChange } = {}) {
      const overlay = document.getElementById('rotate-screen');
      let blocked = false;
      let notify = typeof onChange === 'function' ? onChange : null;

      function rotatable() {
        if (!window.matchMedia) return false;
        const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
        // A touchscreen laptop reports coarse touch and a fine pointer both. It is not a
        // device anyone rotates, so the fine pointer is what excuses it.
        return touch && !matchMedia('(any-pointer: fine)').matches;
      }

      function portrait() {
        return window.innerHeight > window.innerWidth;
      }

      function evaluate() {
        const next = rotatable() && portrait();
        if (next === blocked) return;
        blocked = next;
        if (overlay) overlay.hidden = !blocked;
        document.documentElement.classList.toggle('is-rotate-blocked', blocked);
        if (notify) notify(blocked);
      }

      // Best effort, and silent about it: every one of these rejects on some platform, and
      // a refused lock is the normal case rather than an error worth surfacing.
      async function requestLock() {
        if (!rotatable()) return false;
        try {
          const root = document.documentElement;
          if (!document.fullscreenElement && root.requestFullscreen) {
            await root.requestFullscreen({ navigationUI: 'hide' });
          }
        } catch { /* fullscreen refused; the overlay still covers it */ }
        try {
          if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
            await window.screen.orientation.lock('landscape');
            return true;
          }
        } catch { /* iOS and desktop have no lock to grant */ }
        return false;
      }

      addEventListener('resize', evaluate, { passive: true });
      addEventListener('orientationchange', evaluate, { passive: true });
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener('change', evaluate);
      }
      evaluate();

      Orientation.blocked = () => blocked;
      Orientation.requestLock = requestLock;
      Orientation.evaluate = evaluate;
      return { blocked: () => blocked, requestLock };
    },
    blocked() { return false; },
    requestLock() { return Promise.resolve(false); },
    evaluate() {},
  };

  window.Veilbound.Orientation = Orientation;
})();
