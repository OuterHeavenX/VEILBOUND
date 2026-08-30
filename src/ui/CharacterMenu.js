(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  let root = null;
  let menuButton = null;
  let getSnapshot = null;
  let onOpenChange = null;
  let open = false;
  let active = false;

  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

  function build() {
    if (root) return;
    menuButton = document.createElement('button');
    menuButton.id = 'character-menu-button';
    menuButton.className = 'character-menu-button';
    menuButton.type = 'button';
    menuButton.setAttribute('aria-label', 'Open character menu');
    menuButton.textContent = '☰';
    menuButton.hidden = true;

    root = document.createElement('section');
    root.id = 'character-menu';
    root.className = 'character-menu';
    root.hidden = true;
    root.setAttribute('aria-label', 'Character menu');
    root.innerHTML = `
      <div class="character-menu-shell">
        <header class="character-menu-header">
          <div>
            <div class="character-menu-kicker">BOUND USER // CHARACTER</div>
            <h2>KAEL</h2>
          </div>
          <button id="character-menu-close" class="character-menu-close" type="button" aria-label="Close character menu">×</button>
        </header>
        <div class="character-menu-body">
          <aside class="character-menu-nav" aria-label="Menu sections">
            <button class="character-menu-tab is-active" type="button" data-tab="character"><span>CHARACTER</span></button>
            <button class="character-menu-tab is-locked" type="button" disabled><span>INVENTORY</span><small>SOON</small></button>
            <button class="character-menu-tab is-locked" type="button" disabled><span>EQUIPMENT</span><small>SOON</small></button>
          </aside>
          <div id="character-menu-content" class="character-menu-content" aria-live="polite"></div>
        </div>
        <footer class="character-menu-footer"><span>M / TAB / ☰</span><span>GAME PAUSED</span></footer>
      </div>`;

    document.getElementById('app').append(menuButton, root);
    menuButton.addEventListener('pointerdown', (event) => { event.preventDefault(); toggle(); });
    root.querySelector('#character-menu-close').addEventListener('click', () => setOpen(false));
    root.addEventListener('pointerdown', (event) => { if (event.target === root) setOpen(false); });
    addEventListener('keydown', (event) => {
      if (!active) return;
      if (event.repeat) return;
      if (event.code === 'KeyM' || event.code === 'Tab' || (open && event.code === 'Escape')) {
        event.preventDefault();
        toggle();
      }
    });
  }

  function render() {
    if (!root || !getSnapshot) return;
    const s = getSnapshot();
    const abilities = Array.isArray(s.abilities) && s.abilities.length ? s.abilities : ['Dormant'];
    const content = root.querySelector('#character-menu-content');
    content.innerHTML = `
      <div class="character-portrait-panel" aria-hidden="true">
        <div class="character-sigil">◇</div>
        <div class="character-silhouette"><span></span></div>
        <div class="character-portrait-name">RELIC HUNTER</div>
      </div>
      <div class="character-stat-panel">
        <div class="character-location">${esc(s.location)}</div>
        <div class="character-stat-grid">
          <div class="character-stat character-stat-wide"><span>VITALITY</span><strong>${s.health} / ${s.maxHealth}</strong><div class="character-meter"><i style="width:${Math.max(0, Math.min(100, s.health / Math.max(1, s.maxHealth) * 100))}%"></i></div></div>
          <div class="character-stat"><span>XP</span><strong>${s.xp}</strong></div>
          <div class="character-stat"><span>JP</span><strong>${s.jp}</strong></div>
          <div class="character-stat"><span>COINS</span><strong class="coin-value">◈ ${s.coins}</strong></div>
          <div class="character-stat"><span>SHARDBLADE</span><strong>LV ${s.shardbladeLevel}</strong></div>
        </div>
        <div class="character-abilities">
          <span>AXIOM PROTOCOLS</span>
          <div>${abilities.map((ability) => `<b>${esc(String(ability).toUpperCase())}</b>`).join('')}</div>
        </div>
        <p class="character-reward-rule">ENEMY DEFEAT // +2 XP · +1 JP · 1 COIN DROP</p>
      </div>`;
  }

  function setOpen(next) {
    if (!active && next) return;
    open = Boolean(next);
    if (root) root.hidden = !open;
    if (menuButton) {
      menuButton.textContent = open ? '×' : '☰';
      menuButton.setAttribute('aria-label', open ? 'Close character menu' : 'Open character menu');
    }
    if (open) render();
    if (onOpenChange) onOpenChange(open);
  }

  function toggle() { setOpen(!open); }

  window.Veilbound.CharacterMenu = {
    init(options) {
      build();
      getSnapshot = options && options.getSnapshot;
      onOpenChange = options && options.onOpenChange;
      render();
    },
    setActive(next) {
      active = Boolean(next);
      if (menuButton) menuButton.hidden = !active;
      if (!active && open) setOpen(false);
    },
    setOpen,
    toggle,
    update() { if (open) render(); },
    isOpen() { return open; },
  };
})();