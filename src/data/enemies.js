(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  window.Veilbound.EnemyRegistry = Object.freeze({
    husk: Object.freeze({
      id: 'husk',
      displayName: 'March Husk',
      role: 'melee-pursuit',
      maxHp: 2,
      radius: 15,
      moveSpeed: 88,
      contactDamage: 1,
    }),

    sentry: Object.freeze({
      id: 'sentry',
      displayName: 'Vein Sentry',
      role: 'ranged-area-control',
      maxHp: 3,
      radius: 17,
      moveSpeed: 52,
      preferredRange: 190,
      retreatRange: 118,
      engageRange: 330,
      attack: Object.freeze({
        telegraphSeconds: 0.72,
        recoverySeconds: 1.05,
        projectileSpeed: 245,
        projectileRadius: 7,
        projectileLifetime: 2.6,
        damage: 1,
      }),
      resonance: Object.freeze({
        disruptRadius: 230,
        stunSeconds: 1.15,
        interruptTelegraph: true,
      }),
      designIntent: Object.freeze([
        'Teach the player to read a ranged wind-up instead of face-tanking every threat.',
        'Create movement pressure while a March Husk occupies close range.',
        'Give Resonance an immediate combat use without replacing the Shardblade.',
        'Keep every projectile readable on a phone-sized display.',
      ]),
    }),

    // Scene 4's Vein-corrupted creature. It fights like a Husk because that is the pressure
    // the tutorial encounter wants; what makes it a different thing is what it says when it
    // dies. Placeholder art: it borrows the Husk sheet until its own is authored.
    corrupted: Object.freeze({
      id: 'corrupted',
      displayName: 'Vein-Corrupted',
      role: 'melee-pursuit',
      sheet: 'husk',
      maxHp: 3,
      radius: 16,
      moveSpeed: 74,
      contactDamage: 1,
      designIntent: Object.freeze([
        'Teach the attack button against something that closes distance slowly.',
        'Pay off the opening by having the thing Kael kills turn out to have been someone.',
      ]),
    }),
  });
})();
