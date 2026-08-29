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
  });
})();
