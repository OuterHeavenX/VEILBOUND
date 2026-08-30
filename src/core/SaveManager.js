(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  const STORAGE_KEY = 'veilbound.save.v1';
  const SETTINGS_KEY = 'veilbound.settings.v1';
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
        xp: 0,
        jp: 0,
        coins: 0,
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

    const data = {
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

    data.player.xp = Number.isFinite(data.player.xp) ? Math.max(0, Math.floor(data.player.xp)) : 0;
    data.player.jp = Number.isFinite(data.player.jp) ? Math.max(0, Math.floor(data.player.jp)) : 0;
    data.player.coins = Number.isFinite(data.player.coins) ? Math.max(0, Math.floor(data.player.coins)) : 0;

    const awakened = Boolean(data.world.flags['story.axiomAwakened']);
    const hasResonance = Array.isArray(data.player.abilities) && data.player.abilities.includes('resonance');
    if (data.player.roomId === 'awakeningRuin' && !awakened && !hasResonance) {
      data.player.roomId = 'hollowMarch2';
      data.player.x = 895;
      data.player.y = 270;
      data.meta.recoveredFrom = 'awakeningRuin.dormant.v0.1.3';
    }

    return data;
  }

  function defaultSettings() {
    return { audio: true, debugOverlay: false };
  }

  const SaveManager = {
    VERSION,
    STORAGE_KEY,
    SETTINGS_KEY,
    createDefault: defaultSave,
    createDefaultSettings: defaultSettings,

    inspect() {
      let raw;
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch (error) {
        console.warn('[VEILBOUND] Save storage is unavailable.', error);
        return { status: 'unavailable' };
      }
      if (!raw) return { status: 'empty' };
      let parsed;
      try { parsed = JSON.parse(raw); } catch (error) { return { status: 'unreadable' }; }
      if (!parsed || typeof parsed !== 'object') return { status: 'unreadable' };
      if (parsed.version !== VERSION) return { status: 'incompatible', version: parsed.version };
      return { status: 'ready', data: normalize(parsed) };
    },

    loadSettings() {
      const base = defaultSettings();
      try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return base;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return base;
        return { ...base, ...parsed };
      } catch (error) {
        console.warn('[VEILBOUND] Settings load failed; using defaults.', error);
        return base;
      }
    },

    saveSettings(settings) {
      const data = { ...defaultSettings(), ...(settings || {}) };
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(data)); return true; }
      catch (error) { console.warn('[VEILBOUND] Settings write failed.', error); return false; }
    },

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
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
      catch (error) { console.warn('[VEILBOUND] Save write failed.', error); return false; }
    },

    reset() {
      try { localStorage.removeItem(STORAGE_KEY); }
      catch (error) { console.warn('[VEILBOUND] Save reset failed.', error); }
      return defaultSave();
    },
  };

  window.Veilbound.SaveManager = SaveManager;
})();