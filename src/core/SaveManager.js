(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  const STORAGE_KEY = 'veilbound.save.v1';
  const VERSION = 1;

  function defaultSave() {
    return {
      version: VERSION,
      player: {
        roomId: 'greyhaven',
        x: 470,
        y: 300,
        health: 6,
        maxHealth: 6,
        shardbladeLevel: 1,
        abilities: [],
      },
      world: {
        flags: {},
        defeatedEnemies: {},
      },
      settings: {},
      meta: {
        savedAt: null,
      },
    };
  }

  function normalize(raw) {
    const base = defaultSave();
    if (!raw || typeof raw !== 'object') return base;
    if (raw.version !== VERSION) return base;

    return {
      ...base,
      ...raw,
      player: { ...base.player, ...(raw.player || {}) },
      world: {
        ...base.world,
        ...(raw.world || {}),
        flags: { ...base.world.flags, ...((raw.world && raw.world.flags) || {}) },
        defeatedEnemies: { ...base.world.defeatedEnemies, ...((raw.world && raw.world.defeatedEnemies) || {}) },
      },
      settings: { ...base.settings, ...(raw.settings || {}) },
      meta: { ...base.meta, ...(raw.meta || {}) },
    };
  }

  const SaveManager = {
    VERSION,
    STORAGE_KEY,

    createDefault: defaultSave,

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultSave();
        return normalize(JSON.parse(raw));
      } catch (error) {
        console.warn('[VEILBOUND] Save load failed; using defaults.', error);
        return defaultSave();
      }
    },

    save(state) {
      const data = normalize(state);
      data.meta.savedAt = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (error) {
        console.warn('[VEILBOUND] Save write failed.', error);
        return false;
      }
    },

    reset() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('[VEILBOUND] Save reset failed.', error);
      }
      return defaultSave();
    },
  };

  window.Veilbound.SaveManager = SaveManager;
})();
