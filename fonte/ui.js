'use strict';
/* STICK MAYHEM — aplicação: menus, controles, laço principal, progressão */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
$$('[data-i]').forEach(e => { e.outerHTML = ico(e.dataset.i); });
const SAVE_KEY = 'stickmayhem_v1';

// ---------- salvamento ----------
const RULES0 = {score: 'none', cRounds: 3, lives: 3, cLives: 4, time: 0, cTime: 90, awk: false, charge: 'normal', dmg: 'normal', weapons: true, fx: true, fatality: false};
const KEYS0 = {
  p1: {l: 'KeyA', r: 'KeyD', u: 'KeyW', d: 'KeyS', atk: 'KeyF', sp: 'KeyG', awk: 'KeyR', drop: 'KeyH'},
  p2: {l: 'ArrowLeft', r: 'ArrowRight', u: 'ArrowUp', d: 'ArrowDown', atk: 'KeyK', sp: 'KeyL', awk: 'KeyO', drop: 'KeyI'},
};
const KEY_ACT = [['l', 'Esquerda'], ['r', 'Direita'], ['u', 'Pular'], ['d', 'Baixo / descer'], ['atk', 'Ataque'], ['sp', 'Especial'], ['awk', 'AWAKENING'], ['drop', 'Largar arma']];
function defaults() {
  return {coins: 0, owned: {}, eq: Object.assign({}, COSM_DEFAULT), eq2: Object.assign({}, COSM_DEFAULT_P2),
    rules: {duel: Object.assign({}, RULES0, {awk: true})},
    keys: {p1: Object.assign({}, KEYS0.p1), p2: Object.assign({}, KEYS0.p2)},
    set: {music: 0.6, sfx: 0.8, quality: 1, cs: 1, co: 0.75, shake: true, haptic: true, mirror: false},
    stats: {matches: 0, wins: 0, losses: 0, kills: 0, deaths: 0, dmg: 0, time: 0, duelWins: 0, fatalities: 0, chaosPlayed: 0, bestSurvive: 0, weaponKills: {}},
    ch: {prog: {}, done: {}}, sel: {mode: 'duel_cpu', diff: 1, format: 'elim', arena: 'neon', awkFmt: 'cpu'},
    net: {name: '', host: '', port: '', path: '', secure: true, arena: 'neon', lives: 3, weapons: true}};
}
function merge(a, b) {
  if (!b || typeof b !== 'object') return a;
  for (const k in a) if (k in b) { if (a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) a[k] = merge(a[k], b[k]); else a[k] = b[k]; }
  for (const k in b) if (!(k in a) && (k === 'weaponKills')) a[k] = b[k];
  return a;
}
let save = defaults();
try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); save = merge(defaults(), d); if (d && d.stats && d.stats.weaponKills) save.stats.weaponKills = d.stats.weaponKills; if (d && d.owned) save.owned = d.owned; if (d && d.ch) save.ch = merge(save.ch, d.ch); if (d && d.ch && d.ch.prog) save.ch.prog = d.ch.prog; if (d && d.ch && d.ch.done) save.ch.done = d.ch.done; } catch (e) {}
if (save.set.quality > 1) save.set.quality = 1;
for (const q of [save.eq, save.eq2]) if (q) { if (q.acc === 'cape') { q.acc = 'none'; q.cape = 'classic'; } if (!q.cape) q.cape = 'none'; if (!q.fat || !FATS[q.fat]) q.fat = 'iron'; if (!WIN_IDS.includes(q.win)) q.win = 'wave'; }
if (save.owned && save.owned['acc:cape']) { save.owned['cape:classic'] = true; delete save.owned['acc:cape']; }
if (save.sel.mode === 'awk') save.sel.mode = save.sel.awkFmt === 'local' ? 'duel_local' : 'duel_cpu'; // modo AWAKENING removido: o poder vive nos duelos
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

// ---------- utilidades ----------
let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
function buzz(ms) { if (save.set.haptic && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }
function mySkinBase(p) {
  const e = p ? save.eq2 : save.eq;
  return {color: cosmVal('color', e.color) || (p ? '#ef4444' : '#3b82f6'), accent: cosmVal('accent', e.accent) || '#22d3ee', hat: e.hat, mask: e.mask, glasses: e.glasses, cape: e.cape || 'none', acc: e.acc === 'cape' ? 'none' : e.acc, deco: '', clothes: e.clothes, fx: e.fx, win: e.win, awk: AWK_TYPES[e.awk] ? e.awk : 'void'};
}
// skin final: se uma skin pronta (comprada) está equipada, ela substitui as peças avulsas; AWAKENING e dança de vitória continuam do jogador
function skinPreset(id) { const k = SKINS[id]; return k && k.preset ? Object.assign({style: k.style || '', cape: 'none', deco: ''}, k.preset) : null; }
function mySkin(p) {
  const base = mySkinBase(p), e = p ? save.eq2 : save.eq, pr = e.skin && e.skin !== 'none' && owned('skin', e.skin) ? skinPreset(e.skin) : null;
  return pr ? Object.assign(base, pr) : base;
}
function owned(cat, id) { const it = COSM[cat].list.find(x => x[0] === id); return !it || it[2] === 0 || !!save.owned[cat + ':' + id]; }
function updCoins() { $('#coins-menu').textContent = save.coins; $$('.coins-val').forEach(e => e.textContent = save.coins); }

// ---------- visão / canvas ----------
const cv = $('#cv'), ctx = cv.getContext('2d', {alpha: false});
let view = {scale: 1, ox: 0, oy: 0, q: 1, pxScale: 1};
function qFactor() { return save.set.quality ? 1 : 0.6; }
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), q = qFactor() * dpr;
  const cw = window.innerWidth, ch = window.innerHeight;
  cv.width = Math.max(2, Math.round(cw * q)); cv.height = Math.max(2, Math.round(ch * q));
  const scale = Math.min(cw / WORLD_W, ch / WORLD_H);
  view = {scale, ox: (cw - WORLD_W * scale) / 2, oy: (ch - WORLD_H * scale) / 2, q, pxScale: scale * q};
  checkOrientation();
}
function checkOrientation() {
  const portrait = window.innerHeight > window.innerWidth * 1.05;
  $('#rotate').classList.toggle('hidden', !portrait);
  if (portrait && app.state === 'game') pauseGame();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---------- tela cheia ----------
function isFS() { return document.fullscreenElement || document.webkitFullscreenElement; }
function toggleFS() {
  const el = document.documentElement;
  if (!isFS()) {
    const r = el.requestFullscreen || el.webkitRequestFullscreen;
    if (r) {
      Promise.resolve(r.call(el)).then(lockLandscape).catch(() => toast('Tela cheia não permitida neste navegador. Use o menu do navegador > "Adicionar à tela inicial".'));
    } else toast('Tela cheia indisponível aqui. No iPhone: Compartilhar > Adicionar à Tela de Início.');
  } else { const x = document.exitFullscreen || document.webkitExitFullscreen; if (x) x.call(document); }
}
function lockLandscape() {
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => toast('Gire o aparelho manualmente para paisagem.')); } catch (e) {}
}
$('#btn-fs').onclick = () => { SFX.resume(); toggleFS(); };
$('#rot-fs').onclick = () => { toggleFS(); };
$('#btn-mute').onclick = () => { SFX.resume(); SFX.S.muted = !SFX.S.muted; SFX.apply(); $('#btn-mute').innerHTML = ico(SFX.S.muted ? 'mute' : 'vol'); };

// ---------- controles ----------
const Controls = {
  inputs: [newInput(), newInput()],
  T: [{mx: 0, my: 0, jump: 0, atk: 0, sp: 0, drop: 0, awk: 0}, {mx: 0, my: 0, jump: 0, atk: 0, sp: 0, drop: 0, awk: 0}],
  keys: {}, mode: 'none', maps: [],
  // mapas de teclado montados a partir das teclas configuradas (save.keys)
  buildMaps(m) {
    const a = x => [x];
    const k1 = save.keys.p1, k2 = save.keys.p2;
    const mk = k => ({l: a(k.l), r: a(k.r), u: a(k.u), d: a(k.d), atk: a(k.atk), sp: a(k.sp), awk: a(k.awk), drop: a(k.drop)});
    if (m === 'local') return [mk(k1), mk(k2)];
    if (m === 'single') {
      // um jogador: teclas do P1 + alternativas (setas, K/L/O, espaço) para quem joga só no teclado
      const p = mk(k1), q = mk(k2), add = (x, y) => { y.forEach(c => { if (!x.includes(c)) x.push(c); }); };
      ['l', 'r', 'u', 'd', 'atk', 'sp', 'awk', 'drop'].forEach(n => add(p[n], q[n]));
      add(p.u, ['Space']);
      return [p];
    }
    return [];
  },
  setMode(m) {
    this.mode = m; this.maps = this.buildMaps(m);
    document.body.classList.remove('m-single', 'm-local');
    if (m === 'single') document.body.classList.add('m-single');
    if (m === 'local') document.body.classList.add('m-local');
    this.reset();
  },
  reset() {
    for (let s = 0; s < 2; s++) { const T = this.T[s]; T.mx = T.my = T.jump = T.atk = T.sp = T.drop = T.awk = 0; Object.assign(this.inputs[s], newInput()); }
    $$('.cb.down').forEach(b => b.classList.remove('down'));
    $$('.joyzone').forEach(z => { z.classList.remove('active'); z._pid = null; });
    this.keys = {};
  },
  poll() {
    const G = GP.poll(this);
    const maps = this.maps;
    for (let s = 0; s < 2; s++) {
      const I = this.inputs[s], T = this.T[s], mp = maps[s], K = this.keys;
      let kx = 0, ky = 0, kj = false, ka = false;
      if (mp) {
        const any = a => a.some(c => K[c]);
        kx = (any(mp.r) ? 1 : 0) - (any(mp.l) ? 1 : 0); ky = any(mp.d) ? 1 : 0; kj = any(mp.u); ka = any(mp.atk);
      }
      const g = G[s] || {mx: 0, my: 0, jump: false, atk: false, ax: 0, ay: 0};
      I.aimX = g.ax; I.aimY = g.ay;
      I.mx = T.mx || kx || g.mx; I.my = T.my || ky || g.my; I.jumpH = !!(T.jump || kj || g.jump); I.atkH = !!(T.atk || ka || g.atk);
    }
  },
  keyEdge(code, down) {
    this.maps.forEach((mp, s) => {
      const I = this.inputs[s];
      if (down) { if (mp.u.includes(code)) I.jumpP = true; if (mp.sp.includes(code)) I.spP = true; if (mp.drop.includes(code)) I.dropP = true; if (mp.awk.includes(code)) I.awkP = true; }
    });
  },
  isGameKey(code) { return this.maps.some(mp => Object.keys(mp).some(k => mp[k].includes(code))); },
  init() {
    $$('.joyzone').forEach(z => {
      const s = +z.dataset.s, base = z.querySelector('.joybase'), knob = z.querySelector('.joyknob');
      const R = () => base.offsetWidth / 2 || 60;
      z.addEventListener('pointerdown', e => {
        if (z._pid != null) return; if (e.pointerType !== 'touch' && document.body.classList.contains('kb')) return;
        e.preventDefault(); SFX.resume(); touchUsed();
        z._pid = e.pointerId; try { z.setPointerCapture(e.pointerId); } catch (x) {}
        const r = z.getBoundingClientRect(); z._ox = e.clientX; z._oy = e.clientY;
        const rr = R(); const lx = clamp(e.clientX - r.left, rr, r.width - rr), ly = clamp(e.clientY - r.top, rr, r.height - rr);
        z._ox = r.left + lx; z._oy = r.top + ly;
        base.style.left = lx + 'px'; base.style.top = ly + 'px'; knob.style.transform = 'translate(0,0)'; z.classList.add('active');
      });
      z.addEventListener('pointermove', e => {
        if (e.pointerId !== z._pid) return; e.preventDefault();
        let dx = e.clientX - z._ox, dy = e.clientY - z._oy; const rr = R(), l = Math.hypot(dx, dy);
        if (l > rr) { dx = dx / l * rr; dy = dy / l * rr; }
        knob.style.transform = `translate(${dx}px,${dy}px)`;
        const vx = dx / rr, vy = dy / rr, T = this.T[s];
        T.mx = Math.abs(vx) < 0.16 ? 0 : clamp(vx * 1.25, -1, 1);
        T.my = Math.abs(vy) < 0.3 ? 0 : clamp(vy * 1.15, -1, 1);
      });
      const end = e => { if (e.pointerId !== z._pid) return; z._pid = null; z.classList.remove('active'); this.T[s].mx = 0; this.T[s].my = 0; };
      z.addEventListener('pointerup', end); z.addEventListener('pointercancel', end); z.addEventListener('lostpointercapture', end);
    });
    $$('.cb').forEach(b => {
      const s = +b.dataset.s, a = b.dataset.a;
      b.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'touch' && document.body.classList.contains('kb')) return;
        e.preventDefault(); SFX.resume(); touchUsed(); try { b.setPointerCapture(e.pointerId); } catch (x) {}
        b._pid = e.pointerId; this.T[s][a] = 1; b.classList.add('down'); buzz(a === 'atk' ? 12 : 8);
        const I = this.inputs[s];
        if (a === 'jump') I.jumpP = true; else if (a === 'sp') I.spP = true; else if (a === 'drop') I.dropP = true;
        else if (a === 'awk') { I.awkP = true; const f = app.scene && app.scene.fighters && app.scene.fighters.find(x => x.slot === s); if (f && !f.canAwk()) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); } }
      });
      const up = e => { if (b._pid !== e.pointerId) return; b._pid = null; this.T[s][a] = 0; b.classList.remove('down'); };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    });
    window.addEventListener('keydown', e => {
      if (rebind.active) return;
      const st = app.state;
      if (e.code === 'Escape' || (e.code === 'KeyP' && (st === 'game' || st === 'paused'))) {
        e.preventDefault();
        if (st === 'game') pauseGame(); else if (st === 'paused') resumeGame(); else menuKey(e);
        return;
      }
      if (st === 'fatality') { e.preventDefault(); return; }
      if (st === 'victory' && app.vic && app.vic.local) {          // local: só as teclas do vencedor valem
        const k = save.keys[app.vic.winner.slot === 1 ? 'p2' : 'p1']; e.preventDefault();
        if (e.code === k.atk) startFatality(); else if (e.code === k.sp) skipFatality();
        return;
      }
      if (st !== 'game') { menuKey(e); return; }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      if (this.isGameKey(e.code)) { document.body.classList.add('kb'); this.keys[e.code] = true; this.keyEdge(e.code, true); }
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; if (app.state === 'game') pauseGame(); });
  },
};
function touchUsed() { document.body.classList.remove('kb'); }
document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') touchUsed(); }, true);
// navegação por teclado nos menus (setas, Enter, Esc) — nunca dispara ataques
function menuKey(e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].indexOf(e.code) < 0) return;
  if (e.target && e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
  e.preventDefault();
  GP.on = true;
  const ed = (x, y, a, b) => ({r: {x, y}, press: k => (k === 'a' && a) || (k === 'bb' && b)});
  const dx = e.code === 'ArrowRight' ? 1 : e.code === 'ArrowLeft' ? -1 : 0, dy = e.code === 'ArrowDown' ? 1 : e.code === 'ArrowUp' ? -1 : 0;
  GP.nav([ed(dx, dy, e.code === 'Enter', e.code === 'Escape')]);
  GP.nav([ed(0, 0, false, false)]); // zera a repetição
}
const rebind = {active: null};
Controls.init();

// ---------- gamepad (Gamepad API) ----------
// Jogo: P1 = 1º controle, P2 = 2º controle (duelo local). Menus: direcional/analógico + A confirma, B volta, Start pausa.
const GP = {
  prev: [], on: false, focus: null, last: {x: 0, y: 0}, hold: 0, dirKey: '', screen: null, names: [],
  list() { try { return Array.from(navigator.getGamepads ? navigator.getGamepads() : []).filter(p => p && p.connected); } catch (e) { return []; } },
  read(p) {
    const b = i => !!(p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > 0.5));
    let x = p.axes[0] || 0, y = p.axes[1] || 0;
    if (Math.abs(x) < 0.22) x = 0; if (Math.abs(y) < 0.22) y = 0;
    const dl = b(14), dr = b(15), du = b(12), dd = b(13);
    if (dl || dr) x = dr ? 1 : -1;
    if (du || dd) y = dd ? 1 : -1;
    let rx = p.axes[2] || 0, ry = p.axes[3] || 0; const rm = Math.hypot(rx, ry);
    if (rm < 0.35) { rx = 0; ry = 0; } else { rx /= rm; ry /= rm; }
    return {rx, ry, x, y, up: du, down: dd, a: b(0), bb: b(1), atk: b(2) || b(5) || b(7), sp: b(1) || b(4) || b(6), drop: b(3), jump: b(0) || du, start: b(9), awk: b(8) || b(10) || b(11)};
  },
  // atualiza o estado de cada slot de jogador; devolve true se algum controle foi usado
  poll(ctl) {
    const pads = this.list(); this.names = pads.map(p => p.id); const wasOn = this.on;
    const out = [null, null];
    const gameMode = ctl.mode === 'local' ? 2 : (ctl.mode === 'single' ? 1 : 0);
    const edges = [];
    pads.forEach((p, i) => {
      const r = this.read(p), pv = this.prev[p.index] || {}; this.prev[p.index] = r;
      const press = k => r[k] && !pv[k];
      const used = r.rx || r.ry || r.a || r.bb || r.atk || r.sp || r.drop || r.start || r.awk || Math.abs(r.x) > 0 || Math.abs(r.y) > 0;
      if (used) this.on = true;
      edges.push({r, press, used, i});
    });
    // pausa / menus
    const st = app.state;
    edges.forEach(e => { if (e.press('start') && st === 'game') pauseGame(); else if (e.press('start') && st === 'paused') resumeGame(); });
    if (gameMode && st === 'game') {
      edges.slice(0, gameMode).forEach((e, s) => {
        const I = ctl.inputs[s];
        if (e.used) document.body.classList.add('gp' + s);
        if (e.press('jump')) I.jumpP = true;
        if (e.press('sp')) I.spP = true;
        if (e.press('drop')) I.dropP = true;
        if (e.press('awk')) I.awkP = true;
        out[s] = {mx: e.r.x, my: e.r.y > 0.5 ? 1 : 0, jump: e.r.jump, atk: e.r.atk, ax: e.r.rx, ay: e.r.ry};
      });
    } else if (st === 'fatality') { /* controles travados durante a execução */ }
    else if (st === 'victory' && app.vic && app.vic.local) {
      const e = edges[app.vic.winner.slot]; if (e) { if (e.press('a')) startFatality(); else if (e.press('bb')) skipFatality(); }
    } else if (st !== 'game' && wasOn) {
      this.nav(edges);
    }
    return out;
  },
  cands() {
    const scr = document.querySelector('.screen.active'); if (!scr) return [];
    return Array.from(scr.querySelectorAll('button:not([disabled]), .arena-chip, input[type=range]')).filter(el => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4 && el.offsetParent !== null; });
  },
  setFocus(el) {
    if (this.focus) this.focus.classList.remove('gp-focus');
    this.focus = el;
    if (el) { el.classList.add('gp-focus'); try { el.scrollIntoView({block: 'nearest', inline: 'nearest'}); } catch (e) {} const r = el.getBoundingClientRect(); this.last = {x: r.left + r.width / 2, y: r.top + r.height / 2}; }
  },
  nav(edges) {
    if (!this.on) return;
    const scr = document.querySelector('.screen.active'); if (!scr) return;
    const cs = this.cands(); if (!cs.length) return;
    if (this.screen !== scr || !this.focus || !this.focus.isConnected || !cs.includes(this.focus)) {
      let nf;
      if (this.screen === scr && this.last) { let bd = 1e9; cs.forEach(c => { const r = c.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - this.last.x, r.top + r.height / 2 - this.last.y); if (d < bd) { bd = d; nf = c; } }); }
      else nf = scr.querySelector('.primary') || scr.querySelector('.sel') || cs[0];
      this.screen = scr; this.setFocus(cs.includes(nf) ? nf : cs[0]);
    }
    let dx = 0, dy = 0, pressA = false, pressB = false;
    edges.forEach(e => { if (Math.abs(e.r.x) > 0.5) dx = Math.sign(e.r.x); if (Math.abs(e.r.y) > 0.5) dy = Math.sign(e.r.y); if (e.press('a')) pressA = true; if (e.press('bb')) pressB = true; });
    const key = dx + ',' + dy, now = performance.now();
    let step = false;
    if (key === '0,0') { this.dirKey = ''; } else if (key !== this.dirKey) { this.dirKey = key; this.hold = now + 380; step = true; } else if (now > this.hold) { this.hold = now + 120; step = true; }
    const f = this.focus;
    if (step) {
      if (f.type === 'range' && dx) {
        const st = +f.step || 1, v = Math.min(+f.max, Math.max(+f.min, +f.value + dx * st * (+f.max - +f.min > 5 ? 1 : 2)));
        f.value = v; f.dispatchEvent(new Event('input', {bubbles: true})); f.dispatchEvent(new Event('change', {bubbles: true}));
      } else {
        const fr = f.getBoundingClientRect(), cx = fr.left + fr.width / 2, cy = fr.top + fr.height / 2;
        let best = null, bs = 1e9;
        cs.forEach(c => {
          if (c === f) return; const r = c.getBoundingClientRect(), ox = r.left + r.width / 2 - cx, oy = r.top + r.height / 2 - cy;
          let main, cross;
          if (dx) { main = ox * dx; cross = Math.abs(oy); } else { main = oy * dy; cross = Math.abs(ox); }
          if (!(dx ? Math.abs(oy) <= Math.abs(ox) * 1.6 + 30 : Math.abs(ox) <= Math.abs(oy) * 1.6 + 30)) { if (main <= 4) return; }
          if (main <= 4) return;
          const sc = main + cross * 2.2; if (sc < bs) { bs = sc; best = c; }
        });
        if (best) { this.setFocus(best); SFX.play('select'); }
      }
    }
    if (pressA && f && f.type !== 'range') { SFX.resume(); f.click(); if (!(f.isConnected)) this.last = this.last; }
    if (pressB) {
      const id = scr.id;
      if (id === 's-pause') resumeGame();
      else { const bk = scr.querySelector('.back') || scr.querySelector('#set-back'); if (bk) bk.click(); }
    }
  },
};
window.addEventListener('gamepadconnected', e => { GP.on = true; toast('Controle conectado'); });
window.addEventListener('gamepaddisconnected', () => { document.body.classList.remove('gp0', 'gp1'); toast('Controle desconectado'); if (app.state === 'game') pauseGame(); });
document.addEventListener('pointerdown', e => { GP.on = false; if (GP.focus) { GP.focus.classList.remove('gp-focus'); GP.focus = null; } if (e.pointerType === 'touch') document.body.classList.remove('gp0', 'gp1'); }, true);
['gesturestart', 'gesturechange', 'dblclick', 'contextmenu'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));

// ---------- estado da aplicação ----------
const app = {state: 'menu', scene: null, game: null, last: 0, acc: 0, t: 0, fps: 60, endReal: 0, prev: null, settingsFrom: 'menu'};

function newMenuScene() {
  const pool = ARENA_IDS.filter(a => a !== 'training');
  app.scene = new Match({mode: 'menu', arena: pick(pool), format: 'stock', lives: 999}, {skin: mySkin(), shake: false, fxMax: save.set.quality ? 200 : 80});
}
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  if (id) $('#s-' + id).classList.add('active');
}
function go(id) {
  SFX.resume(); SFX.play('click');
  if (app.state === 'menu' || app.state === 'result') { SFX.music('menu'); }
  showScreen(id);
  if (id === 'play') buildPlay();
  if (id === 'config') buildConfig();
  if (id === 'custom') buildCustom();
  if (id === 'weapons') buildWeapons();
  if (id === 'arenas') buildArenas();
  if (id === 'settings') { app.settingsFrom = 'menu'; setTab = 'geral'; buildSettings(); }
  if (id === 'stats') buildStats();
  if (id === 'online') onlineOpen();
  if (id === 'menu') updCoins();
  updCoins();
  app.inCustom = id === 'custom';
}
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
document.addEventListener('pointerdown', () => { SFX.resume(); if (app.state === 'menu' || app.state === 'result') SFX.music('menu'); }, {once: false, passive: true});

// ---------- tela de seleção de modo ----------
const DIFF_NAMES = ['Fácil', 'Normal', 'Difícil'];
function chips(el, items, cur, cb) {
  el.innerHTML = '';
  items.forEach(it => { const b = document.createElement('button'); b.className = 'chip' + (it[0] === cur ? ' sel' : ''); b.textContent = it[1]; b.onclick = () => { SFX.play('select'); cb(it[0]); }; el.appendChild(b); });
}
function buildPlay() {
  const sel = save.sel;
  $$('.mode-card').forEach(c => { c.classList.toggle('sel', c.dataset.mode === sel.mode); c.onclick = () => { SFX.play('select'); sel.mode = c.dataset.mode; persist(); buildPlay(); }; });
  $('#opt-diff-row').style.display = sel.mode === 'chaos' ? 'flex' : 'none';
  $('#opt-format-row').style.display = sel.mode === 'chaos' ? 'flex' : 'none';
  chips($('#opt-diff'), DIFF_NAMES.map((n, i) => [i, n]), sel.diff, v => { sel.diff = v; persist(); buildPlay(); });
  chips($('#opt-format'), [['elim', 'ELIMINATION'], ['stock', 'STOCK BATTLE (3 vidas)']], sel.format, v => { sel.format = v; persist(); buildPlay(); });
  const ac = $('#opt-arena'); ac.innerHTML = '';
  ARENA_IDS.forEach(id => {
    const d = document.createElement('div'); d.className = 'arena-chip' + (id === sel.arena ? ' sel' : '');
    const c = document.createElement('canvas'); c.width = 160; c.height = 90; drawArenaPreview(c, ARENAS[id]); d.appendChild(c);
    const sp = document.createElement('span'); sp.textContent = ARENAS[id].name; d.appendChild(sp);
    d.onclick = () => { SFX.play('select'); sel.arena = id; persist(); buildPlay(); };
    ac.appendChild(d);
  });
  $('#arena-name').textContent = ARENAS[sel.arena].name;
  const MI = {duel_cpu: 'Depois de LUTAR você ajusta placar, vidas, tempo e o poder AWAKENING.', duel_local: 'Depois de LUTAR você ajusta placar, vidas, tempo e o poder AWAKENING. Cada jogador usa sua skin.', chaos: 'Você contra 3 bots em arena aberta, com armas caindo do céu.'};
  $('#mode-info').textContent = MI[sel.mode] + ' ' + (ARENAS[sel.arena].hazard ? 'Perigo: ' + ARENAS[sel.arena].hazard + '.' : '');
  const selEl = ac.querySelector('.sel'); if (selEl) selEl.scrollIntoView({block: 'nearest', inline: 'center'});
}
$('#btn-start').onclick = () => {
  SFX.resume(); SFX.play('go');
  if (save.sel.mode === 'chaos') startSeries(baseCfg());
  else go('config');
};

// ---------- configuração da partida 1v1 ----------
function rulesKey() { return 'duel'; }
function fmtTime(sec) { return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
function roundTarget(R) { const n = R.score === 'custom' ? R.cRounds : +R.score; return Math.floor(n / 2) + 1; }
function baseCfg() {
  const s = save.sel;
  if (s.mode === 'chaos') return {mode: 'chaos', arena: s.arena, diff: s.diff, format: s.format, lives: 3};
  const R = save.rules[rulesKey()];
  const mode = s.mode, isAwk = !!R.awk;
  const lives = R.lives === 'custom' ? R.cLives : +R.lives;
  const time = R.time === 'custom' ? R.cTime : +R.time;
  return {mode, variant: isAwk ? 'awk' : 'duel', arena: s.arena, diff: s.diff, format: 'stock', lives, hp: isAwk ? AWK.hp : 100,
    awk: {on: !!R.awk, charge: R.charge, dmg: R.dmg}, timeLimit: time, weapons: !!R.weapons, camFx: !!R.fx,
    score: R.score, target: R.score === 'none' || R.score === 'board' ? 0 : roundTarget(R), fatality: !!R.fatality && R.score !== 'board'};
}
function buildConfig() {
  const sel = save.sel, k = rulesKey(), R = save.rules[k], b = $('#cfg-body'); b.innerHTML = '';
  const isAwk = !!R.awk, cpu = sel.mode === 'duel_cpu';
  $('#cfg-title').textContent = 'DUELO · ' + (cpu ? 'vs CPU' : 'LOCAL') + ' — CONFIGURAR';
  const rb = () => { persist(); buildConfig(); };
  const row = (label, items, key, extra, sub) => {
    const r = document.createElement('div'); r.className = 'row' + (sub ? ' sub' : ''); r.innerHTML = `<label>${label}</label><div class="chips"></div>`;
    chips(r.querySelector('.chips'), items, R[key], v => { R[key] = v; rb(); });
    if (extra) r.appendChild(extra);
    b.appendChild(r); return r;
  };
  const stepper = (key, min, max, step, fmt) => {
    const d = document.createElement('span'); d.className = 'stepper';
    d.innerHTML = `<button aria-label="menos">${ico('minus')}</button><b>${fmt(R[key])}</b><button aria-label="mais">${ico('plus')}</button>`;
    const [m, p] = d.querySelectorAll('button');
    m.onclick = () => { R[key] = Math.max(min, R[key] - step); SFX.play('select'); rb(); };
    p.onclick = () => { R[key] = Math.min(max, R[key] + step); SFX.play('select'); rb(); };
    return d;
  };
  row('Placar', [['none', 'SEM PLACAR'], ['board', 'QUADRO DE VITÓRIAS'], [3, 'MELHOR DE 3'], [5, 'MELHOR DE 5'], [7, 'MELHOR DE 7'], ['custom', 'PERSONALIZADO']], 'score', R.score === 'custom' ? stepper('cRounds', 1, 15, 2, v => 'Melhor de ' + v) : null);
  row('Vidas por rodada', [[1, '1'], [2, '2'], [3, '3'], [5, '5'], [10, '10'], ['custom', 'PERSONALIZADO']], 'lives', R.lives === 'custom' ? stepper('cLives', 1, 20, 1, v => v + ' vidas') : null);
  row('AWAKENING', [[true, 'LIGADO'], [false, 'DESLIGADO']], 'awk');
  if (R.awk) {
    row('Carga da barra', [['slow', 'LENTA'], ['normal', 'NORMAL'], ['fast', 'RÁPIDA']], 'charge', null, true);
    row('Dano AWAKENING', [['low', 'REDUZIDO'], ['normal', 'NORMAL'], ['high', 'AUMENTADO']], 'dmg', null, true);
  }
  { // FATALITY: bloqueada em partidas infinitas (quadro de vitórias não tem vencedor definitivo)
    const blocked = R.score === 'board', fr = document.createElement('div'); fr.className = 'row fat-row' + (blocked ? ' locked' : '');
    fr.innerHTML = '<label>FATALITY</label><div class="chips"></div><div class="fat-desc"></div>';
    chips(fr.querySelector('.chips'), [[true, 'ATIVADO'], [false, 'DESATIVADO']], blocked ? false : !!R.fatality, v => { if (blocked) { toast('Fatality indisponível em partidas infinitas.'); SFX.play('hit'); return; } R.fatality = v; rb(); });
    fr.querySelector('.fat-desc').textContent = blocked ? 'Bloqueado: partidas infinitas (QUADRO DE VITÓRIAS) não têm vencedor definitivo.' : 'Permite executar uma finalização especial após vencer a partida. Não pode ser alterado depois que a partida começa.';
    b.appendChild(fr);
  }
  row('Tempo', [[0, 'SEM LIMITE'], [120, '2 MIN'], [180, '3 MIN'], [300, '5 MIN'], ['custom', 'PERSONALIZADO']], 'time', R.time === 'custom' ? stepper('cTime', 30, 900, 15, fmtTime) : null);
  const ar = document.createElement('div'); ar.className = 'row'; ar.innerHTML = '<label>Arena</label><div class="chips"></div>'; b.appendChild(ar);
  chips(ar.querySelector('.chips'), ARENA_IDS.map(id => [id, ARENAS[id].name]), sel.arena, v => { sel.arena = v; rb(); });
  if (cpu) { const d = document.createElement('div'); d.className = 'row'; d.innerHTML = '<label>Nível da CPU</label><div class="chips"></div>'; b.appendChild(d); chips(d.querySelector('.chips'), DIFF_NAMES.map((n, i) => [i, n]), sel.diff, v => { sel.diff = v; rb(); }); }
  row('Armas no mapa', [[true, 'LIGADAS'], [false, 'DESLIGADAS']], 'weapons');
  row('Efeitos visuais', [[true, 'LIGADOS'], [false, 'DESLIGADOS']], 'fx');
  const ch = document.createElement('div'); ch.className = 'row';
  const nm = x => ((COSM.color.list.find(c => c[0] === save[x].color) || [0, ''])[1]) + ' · ' + AWK_TYPES[save[x].awk].short;
  ch.innerHTML = `<label>Personagens</label><span style="flex:1;font-size:.85em;opacity:.85">P1: ${nm('eq')}${cpu ? '' : ' &nbsp;|&nbsp; P2: ' + nm('eq2')}</span><button class="btn">${ico('palette')} <span>PERSONALIZAR</span></button>`;
  ch.querySelector('button').onclick = () => go('custom'); b.appendChild(ch);
  const note = document.createElement('div'); note.className = 'note';
  const hpTxt = isAwk ? 'Com AWAKENING: ' + AWK.hp + ' HP por lutador. ' : '';
  note.textContent = hpTxt + 'Placar, vidas e tempo são independentes. Se o tempo acabar: vence quem tiver mais vidas e, depois, mais vida restante; empate = rodada extra.';
  b.appendChild(note);
}
$('#btn-cfg-start').onclick = () => { SFX.resume(); SFX.play('go'); startSeries(baseCfg()); };

// ---------- personalização (v1.3.0: categorias, cards, prévias) ----------
let custTab = 'skin', custSub = 'hat', prevMatch = null, prevCelebrate = true, custP = 0, custAwk = null, custSkin = null, custFat = null, custWin = null, custFlash = 0;
const eqOf = () => custP ? save.eq2 : save.eq;
const TAB_ICO = {skin: 'crown', awk: 'awk'};
const CUST_GROUPS = [
  {id: 'skin', label: 'SKINS'}, {id: 'cape', label: 'CAPAS'},
  {id: 'acc', label: 'ACESSÓRIOS', subs: [['hat', 'Chapéus'], ['mask', 'Máscaras'], ['glasses', 'Óculos'], ['acc', 'Costas'], ['clothes', 'Roupas'], ['fx', 'Efeitos'], ['color', 'Cor do corpo'], ['accent', 'Detalhes']]},
  {id: 'awk', label: 'AWAKENINGS'}, {id: 'fat', label: 'FATALITIES'}, {id: 'win', label: 'ANIMAÇÕES DE VITÓRIA'},
];
const curCat = () => custTab === 'acc' ? custSub : custTab;
const FAT_ICO = {iron: '✊', thunder: '⚡', meteor: '☄️', shadow: '🌑', gravity: '🌀', blade: '🗡️', void: '🕳️', god: '👁️'};
const WIN_DESC = {wave: 'Um aceno simpático.', flex: 'Mostra os músculos.', dance: 'Dança animada.', hop: 'Pulinhos de alegria.', champion: 'Punhos para o alto, postura de campeão e confete dourado.', shadow: 'Braços cruzados, fumaça sombria.', thunder: 'Aponta o céu e chama raios.', cosmic: 'Flutua com estrelas orbitando.', spin: 'Gira a arma como um mestre.', burst: 'Explosões de energia em anel.', royal: 'Aceno real com brilho dourado.', mayhem: 'Pulos, confete arco-íris e o M da MayhemGames.'};
function rarBadge(price) { const r = rarOf(price || 0), sp = document.createElement('em'); sp.className = 'rar'; sp.textContent = r.toUpperCase(); sp.style.setProperty('--rc', RAR_COL[r]); return sp; }
function drawThumb(c, skinObj) {
  if (!prevMatch) prevMatch = new Match({mode: 'preview', arena: 'training'}, {skin: mySkin(0), shake: false});
  const f = prevMatch.fighters[0], g = c.getContext('2d');
  f.skin = Object.assign({}, skinObj); f.celebrate = false; for (let i = 0; i < 40; i++) prevMatch.update(DT);
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
  const sc = c.height / 150; g.setTransform(sc, 0, 0, sc, c.width / 2 - f.x * sc, c.height - 8 - 603 * sc);
  g.fillStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.ellipse(f.x, 602, 34, 6, 0, 0, 6.283); g.fill();
  drawFighter(g, f, 0, false); g.setTransform(1, 0, 0, 1, 0, 0);
}
// compra/equipa (mesma economia de sempre): devolve true se equipou
function custEquip(cat, id, name, price, after) {
  const eq = eqOf();
  if (!owned(cat, id)) {
    if (save.coins < price) { toast('Moedas insuficientes (' + save.coins + '/' + price + '). Jogue partidas e complete desafios!'); SFX.play('hit'); return false; }
    save.coins -= price; save.owned[cat + ':' + id] = true; SFX.play('buy'); toast('Desbloqueado: ' + name);
  } else SFX.play('select');
  eq[cat] = id; if (cat !== 'win' && cat !== 'awk' && cat !== 'fat' && cat !== 'skin') eq.skin = 'none';
  custFlash = 0.5; persist(); updCoins(); if (after) after(); buildCustom(); return true;
}
function actBtn(cat, id, name, price, eqd, own, word) {
  const act = document.createElement('button'); act.className = 'btn' + (eqd ? '' : own ? ' primary' : '');
  if (eqd) { act.innerHTML = ico('check') + ' <span>EQUIPAD' + word + '</span>'; act.disabled = true; }
  else if (own) act.innerHTML = '<span>EQUIPAR</span>';
  else act.innerHTML = ico('lock') + ico('coin') + ' <span>' + price + '</span>';
  act.onclick = e => { e.stopPropagation(); custEquip(cat, id, name, price); };
  return act;
}
function buildCustom() {
  const eq = eqOf();
  if (!prevMatch) prevMatch = new Match({mode: 'preview', arena: 'training'}, {skin: mySkin(0), shake: false});
  chips($('#cp-tog'), [[0, 'JOGADOR 1'], [1, 'JOGADOR 2']], custP, v => { custP = v; custAwk = custSkin = custFat = custWin = null; buildCustom(); });
  const tabs = $('#cust-tabs'); tabs.innerHTML = '';
  CUST_GROUPS.forEach(G => { const b = document.createElement('button'); b.className = 'tab' + (G.id === custTab ? ' sel' : ''); b.innerHTML = (TAB_ICO[G.id] ? ico(TAB_ICO[G.id]) : '') + '<span>' + G.label + '</span>'; b.onclick = () => { SFX.play('click'); custTab = G.id; buildCustom(); }; tabs.appendChild(b); });
  const selTab = tabs.querySelector('.sel'); if (selTab) try { selTab.scrollIntoView({block: 'nearest', inline: 'center'}); } catch (e) {}
  const subs = $('#cust-subs'); subs.innerHTML = ''; subs.classList.toggle('hidden', custTab !== 'acc');
  if (custTab === 'acc') CUST_GROUPS[2].subs.forEach(([k, l]) => { const b = document.createElement('button'); b.className = 'sub' + (k === custSub ? ' sel' : ''); b.textContent = l; b.onclick = () => { SFX.play('click'); custSub = k; buildCustom(); }; subs.appendChild(b); });
  const g = $('#cust-grid'); g.innerHTML = ''; g.scrollTop = 0;
  const isAwk = custTab === 'awk', isSkin = custTab === 'skin', isFat = custTab === 'fat', isWin = custTab === 'win', wide = isAwk || isFat;
  g.classList.toggle('grid', !wide && !isWin); g.classList.toggle('awk-list', wide || isWin); g.classList.toggle('skin-grid', isSkin);
  $('.prev-wrap').classList.toggle('awk-prev', wide);
  const pc = $('#cust-prev'); const W = wide ? 480 : 360, H = wide ? 270 : 420;
  if (pc.width !== W) { pc.width = W; pc.height = H; pc.style.aspectRatio = W + '/' + H; }
  $('.prev-wrap small').textContent = isAwk ? 'Prévia: não causa dano nem gasta energia' : isFat ? 'Prévia isolada: não altera nenhuma partida' : isWin ? 'Toque no boneco para repetir a animação' : 'Toque no boneco para alternar a pose';
  const cap = $('#prev-cap');
  if (isAwk) {
    if (!custAwk) custAwk = eq.awk;
    cap.textContent = AWK_TYPES[custAwk].name;
    AWK_IDS.forEach(id => {
      const T = AWK_TYPES[id], own = owned('awk', id), equipped = eq.awk === id;
      const d = document.createElement('div'); d.className = 'awk-card' + (custAwk === id ? ' sel' : ''); d.style.setProperty('--c1', T.c);
      const main = document.createElement('button'); main.className = 'awk-main'; main.style.cssText = 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:.25em;flex:1;min-width:0';
      main.innerHTML = `<h3>${ico('awk')} ${T.name}</h3><p>${T.desc}</p><div class="fxs">${T.fx.map(x => '<span>' + x + '</span>').join('')}</div>`;
      main.querySelector('h3').appendChild(rarBadge(T.price));
      main.onclick = () => { SFX.play('select'); custAwk = id; buildCustom(); };
      const act = actBtn('awk', id, T.name, T.price, equipped, own, 'O'); act.style.cssText = 'align-self:center;white-space:nowrap;padding:.6em .9em';
      d.style.flexDirection = 'row'; d.append(main, act); g.appendChild(d);
    });
  } else if (isFat) {
    if (!custFat) custFat = eq.fat || 'iron';
    cap.textContent = FATS[custFat].name;
    FAT_IDS.forEach(id => {
      const T = FATS[id], own = owned('fat', id), equipped = (eq.fat || 'iron') === id;
      const d = document.createElement('div'); d.className = 'awk-card fat-card' + (custFat === id ? ' sel' : '') + (own ? '' : ' locked'); d.style.setProperty('--c1', T.c);
      const main = document.createElement('button'); main.className = 'awk-main'; main.style.cssText = 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:.25em;flex:1;min-width:0';
      main.innerHTML = `<h3><span class="fat-ico">${FAT_ICO[id]}</span> ${T.name}</h3><p>${T.desc}</p><div class="fxs">${T.fx.map(x => '<span>' + x + '</span>').join('')}</div>`;
      main.querySelector('h3').appendChild(rarBadge(T.price));
      main.onclick = () => { SFX.play('select'); custFat = id; FatPreview.restart && (FatPreview.key = ''); buildCustom(); };
      const act = actBtn('fat', id, T.name, T.price, equipped, own, 'A'); act.style.cssText = 'align-self:center;white-space:nowrap;padding:.6em .9em';
      d.style.flexDirection = 'row'; d.append(main, act); g.appendChild(d);
    });
  } else if (isWin) {
    if (!custWin) custWin = eq.win;
    cap.textContent = (COSM.win.list.find(x => x[0] === custWin) || [0, ''])[1];
    COSM.win.list.forEach(([id, name, price]) => {
      const own = owned('win', id), equipped = eq.win === id;
      const d = document.createElement('div'); d.className = 'awk-card win-card' + (custWin === id ? ' sel' : '') + (own ? '' : ' locked'); d.style.setProperty('--c1', RAR_COL[rarOf(price)]);
      const main = document.createElement('button'); main.className = 'awk-main'; main.style.cssText = 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:.25em;flex:1;min-width:0';
      main.innerHTML = `<h3>${name}</h3><p>${WIN_DESC[id] || ''}</p>`; main.querySelector('h3').appendChild(rarBadge(price));
      main.onclick = () => { SFX.play('select'); custWin = id; prevCelebrate = true; prevMatch.fighters[0].celeT = 0; buildCustom(); };
      const act = actBtn('win', id, name, price, equipped, own, 'A'); act.style.cssText = 'align-self:center;white-space:nowrap;padding:.6em .9em';
      d.style.flexDirection = 'row'; d.append(main, act); g.appendChild(d);
    });
  } else if (isSkin) {
    if (!custSkin) custSkin = eq.skin || 'none';
    cap.textContent = SKINS[custSkin].name;
    SKIN_IDS.forEach(id => {
      const K = SKINS[id], own = owned('skin', id), equipped = (eq.skin || 'none') === id;
      const d = document.createElement('div'); d.className = 'skin-card' + (custSkin === id ? ' sel' : '') + (equipped ? ' eqd' : '');
      const th = document.createElement('canvas'); th.className = 'th'; th.width = 150; th.height = 165;
      th.onclick = () => { SFX.play('select'); custSkin = id; buildCustom(); };
      const base = mySkinBase(custP), sk = K.preset ? Object.assign(base, skinPreset(id)) : base;
      drawThumb(th, sk);
      const h = document.createElement('h3'); h.textContent = K.name;
      const tg = document.createElement('div'); tg.className = 'tg';
      (K.tags || (id === 'none' ? ['Livre'] : [])).forEach(t => { const sp = document.createElement('span'); sp.textContent = t; if (t === 'Grátis') sp.className = 'free'; tg.appendChild(sp); });
      if (!K.tags && K.price) { const sp = document.createElement('span'); sp.textContent = 'Pacote completo'; tg.appendChild(sp); }
      if (K.price) tg.appendChild(rarBadge(K.price));
      d.append(th, h, tg, actBtn('skin', id, K.name, K.price, equipped, own, 'A')); g.appendChild(d);
    });
  } else {
    const cat = curCat();
    cap.textContent = eq.skin && eq.skin !== 'none' && SKINS[eq.skin] ? 'Skin ativa: ' + SKINS[eq.skin].name + ' (escolher uma peça avulsa a desativa)' : 'Visual personalizado';
    COSM[cat].list.forEach(it => {
      const [id, name, price, val] = it, own = owned(cat, id);
      const b = document.createElement('button'); b.className = 'item' + (eq[cat] === id ? ' sel' : '') + (own ? '' : ' locked');
      if (val) { const sw = document.createElement('div'); sw.className = 'sw'; sw.style.background = val; b.appendChild(sw); }
      const n = document.createElement('span'); n.textContent = name; b.appendChild(n);
      if (price) b.appendChild(rarBadge(price));
      if (!own) { const p = document.createElement('small'); p.innerHTML = ico('lock') + ico('coin') + ' ' + price; b.appendChild(p); }
      b.onclick = () => custEquip(cat, id, name, price);
      g.appendChild(b);
    });
  }
}
$('#cust-prev').addEventListener('pointerdown', () => {
  if (custTab === 'awk') { AwkPreview.reset(); AwkPreview.t = 0.3; }
  else if (custTab === 'fat') { FatPreview.restart(); }
  else if (custTab === 'win') { prevCelebrate = true; if (prevMatch) prevMatch.fighters[0].celeT = 0; }
  else prevCelebrate = !prevCelebrate;
  SFX.play('click');
});
function previewSkinObj() {
  const base = mySkin(custP);
  if (custTab === 'skin' && custSkin) { const K = SKINS[custSkin]; return K.preset ? Object.assign(mySkinBase(custP), skinPreset(custSkin)) : mySkinBase(custP); }
  return base;
}
let prevAcc = 0;
function renderPreview(t, dt) {
  const c = $('#cust-prev'), g = c.getContext('2d');
  const wide = (sc, m, tt) => { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0b0820'; g.fillRect(0, 0, c.width, c.height); renderFrame(g, c.width, c.height, m, tt, {scale: sc, ox: 0, oy: (c.height - WORLD_H * sc) / 2, q: 1, pxScale: sc}); g.setTransform(1, 0, 0, 1, 0, 0); };
  if (custTab === 'awk') { AwkPreview.ensure(custAwk || eqOf().awk, mySkin(custP)); AwkPreview.step(Math.min(dt || DT, 0.05)); wide(c.width / WORLD_W, AwkPreview.m, t); return; }
  if (custTab === 'fat') { FatPreview.ensure(custFat || eqOf().fat || 'iron', mySkin(custP)); FatPreview.step(Math.min(dt || DT, 0.05)); wide(c.width / WORLD_W, FatPreview.m, t); return; }
  if (!prevMatch) return;
  const f = prevMatch.fighters[0]; f.skin = previewSkinObj();
  const winId = custTab === 'win' ? (custWin || eqOf().win) : eqOf().win;
  f.celebrate = custTab === 'win' ? prevCelebrate : (prevCelebrate && !(custTab === 'cape' || custTab === 'acc')); f.winAnim = Math.max(0, WIN_IDS.indexOf(winId));
  // capas/acessórios: o boneco se move de leve para mostrar o tecido e as asas
  if ((custTab === 'cape' || custTab === 'acc') && !f.celebrate) { const ph = (t % 4); f.input.mx = ph < 1 ? 1 : ph < 2 ? 0 : ph < 3 ? -1 : 0; if (f.x > 720) f.input.mx = -1; if (f.x < 560) f.input.mx = 1; } else { f.input.mx = 0; if (Math.abs(f.x - 640) > 4) { f.x += (640 - f.x) * 0.08; } }
  prevMatch.update(DT);
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
  const s = 2.7; g.setTransform(s, 0, 0, s, c.width / 2 - f.x * s, c.height * 0.88 - 600 * s);
  if (custFlash > 0) { custFlash -= dt || DT; g.fillStyle = 'rgba(250,204,21,' + (custFlash * 0.5).toFixed(2) + ')'; g.beginPath(); g.ellipse(f.x, 540, 90, 110, 0, 0, 6.283); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.ellipse(f.x, 602, 46, 8, 0, 0, 6.283); g.fill();
  drawFighter(g, f, t, false); g.setTransform(1, 0, 0, 1, 0, 0);
}

// ---------- armas ----------
function norm(v, max) { return Math.round(clamp(v / max, 0.04, 1) * 100); }
function buildWeapons() {
  const g = $('#weap-grid'); if (g.children.length) return;
  WEAPON_IDS.forEach(id => {
    const w = WEAPONS[id], d = document.createElement('div'); d.className = 'card';
    const c = document.createElement('canvas'); c.width = 240; c.height = 70; drawWeaponIcon(c, id); d.appendChild(c);
    const h = document.createElement('h3'); h.textContent = w.name; d.appendChild(h);
    const tg = document.createElement('span'); tg.className = 'tag'; tg.style.background = WEAPON_CAT_COLOR[w.cat]; tg.textContent = w.cat; d.appendChild(tg);
    const p = document.createElement('p'); p.textContent = w.desc; d.appendChild(p);
    let dmg = w.type === 'melee' ? w.dmg : w.type === 'gun' ? (w.charge ? w.dmgMax : (w.expDmg || w.dmg * (w.pellets || 1))) : w.type === 'beam' ? w.dmg * (w.dur / w.tick) : w.expDmg;
    const rng = w.type === 'melee' ? w.len / 90 : w.type === 'throw' ? 0.4 : w.type === 'mine' ? 0.08 : (w.rng || 500) / 1100;
    const rate = w.type === 'melee' ? 1 / (w.swing + w.cd) : (1 / (w.cd || 0.3));
    const stats = [['Dano', dmg / 34 * 100], ['Alcance', rng * 100], ['Cadência', Math.log(1 + rate) / Math.log(15) * 100], ['Empurrão', w.knock / 1200 * 100]];
    stats.forEach(s => { const r = document.createElement('div'); r.className = 'stat'; r.innerHTML = `<i>${s[0]}</i><div class="bar"><b style="width:${clamp(s[1], 4, 100)}%"></b></div>`; d.appendChild(r); });
    const ex = document.createElement('p'); ex.textContent = w.type === 'melee' ? `Durabilidade: ${w.uses} golpes` : `Munição: ${w.ammo}` + (w.charge ? ' · carregável' : '') + (w.fuse ? ` · pavio ${w.fuse}s` : ''); d.appendChild(ex);
    g.appendChild(d);
  });
}
// ---------- arenas ----------
function buildArenas() {
  const g = $('#arena-grid'); g.innerHTML = '';
  ARENA_IDS.forEach(id => {
    const a = ARENAS[id], d = document.createElement('div'); d.className = 'card' + (save.sel.arena === id ? ' sel' : ''); d.style.cursor = 'pointer';
    const c = document.createElement('canvas'); c.width = 320; c.height = 180; drawArenaPreview(c, a); d.appendChild(c);
    d.innerHTML += `<h3>${a.name}</h3><p>${a.desc}</p><p class="hz">${ico('warn')} ${a.hazard}</p>`;
    const cc = d.querySelector('canvas'); if (!cc) { /* innerHTML recriou nós; redesenha */ }
    d.onclick = () => { save.sel.arena = id; persist(); SFX.play('select'); toast('Arena selecionada: ' + a.name); buildArenas(); };
    g.appendChild(d);
  });
  // innerHTML += recria o canvas: redesenhar
  $$('#arena-grid .card').forEach((card, i) => { const c = card.querySelector('canvas'); if (c) drawArenaPreview(c, ARENAS[ARENA_IDS[i]]); });
}
// ---------- configurações ----------
function applySettings() {
  const s = save.set;
  SFX.S.music = s.music; SFX.S.sfx = s.sfx; SFX.apply();
  document.documentElement.style.setProperty('--cs', s.cs); document.documentElement.style.setProperty('--co', s.co);
  document.body.classList.toggle('mirror', s.mirror);
  if (app.scene) app.scene.fx.shakeOn = s.shake;
  GFX.low = !s.quality;
  if (app.scene) app.scene.fx.max = s.quality ? 480 : 110;
}
let setTab = 'geral';
function keyName(c) { return !c ? '—' : c.replace('Key', '').replace('Digit', '').replace('Arrow', '').replace('Left', '←').replace('Right', '→').replace('Up', '↑').replace('Down', '↓').replace('Space', 'ESPAÇO').replace('Enter', 'ENTER').replace('Comma', ',').replace('Period', '.').replace('Slash', '/'); }
function buildKeys(b) {
  [['p1', 'JOGADOR 1'], ['p2', 'JOGADOR 2 (local)']].forEach(([pk, label]) => {
    const h = document.createElement('h4'); h.textContent = label; b.appendChild(h);
    const t = document.createElement('table'); t.className = 'kbtbl';
    KEY_ACT.forEach(([a, n]) => {
      const tr = document.createElement('tr'); tr.innerHTML = `<td>${n}</td><td></td>`;
      const bt = document.createElement('button'); bt.textContent = keyName(save.keys[pk][a]); tr.lastChild.appendChild(bt);
      bt.onclick = () => {
        bt.textContent = 'pressione...'; bt.classList.add('wait'); rebind.active = true;
        const h2 = e => {
          e.preventDefault(); e.stopImmediatePropagation(); window.removeEventListener('keydown', h2, true); rebind.active = false;
          if (e.code !== 'Escape') {
            if (e.code === 'KeyP') toast('A tecla P é reservada para pausa.');
            else {
              let used = null; ['p1', 'p2'].forEach(q => KEY_ACT.forEach(([x]) => { if (save.keys[q][x] === e.code && !(q === pk && x === a)) used = q.toUpperCase() + ' · ' + x; }));
              if (used) toast('Tecla já usada em ' + used); else { save.keys[pk][a] = e.code; persist(); }
            }
          }
          buildSettings();
        };
        window.addEventListener('keydown', h2, true);
      };
      t.appendChild(tr);
    });
    b.appendChild(t);
  });
  const r = document.createElement('div'); r.className = 'row'; r.innerHTML = '<label>Padrão</label><button class="btn"><span>RESTAURAR TECLAS</span></button>';
  r.querySelector('button').onclick = () => { save.keys = {p1: Object.assign({}, KEYS0.p1), p2: Object.assign({}, KEYS0.p2)}; persist(); buildSettings(); };
  b.appendChild(r);
  const n = document.createElement('div'); n.className = 'note'; n.textContent = 'Esc / P pausam. Um jogador (vs CPU) também aceita setas, K/L/O e Espaço. Ao usar o teclado os botões de toque somem; tocar na tela os traz de volta.'; b.appendChild(n);
}
function buildCredits(b) {
  const d = document.createElement('div'); d.className = 'credits';
  d.innerHTML = `<img class="cred-logo" src="${$(".logo-img").src}" alt="">
    <div class="cred-blk"><small>FUNDADOR E DESENVOLVEDOR</small><b>LEANDRODROID998</b></div>
    <div class="cred-blk"><small>DIREÇÃO CRIATIVA</small><b>LEANDRODROID998 &amp; Carlos Eduardo</b></div>
    <div class="cred-blk"><small>EQUIPE</small><b>MAYHEM GAMES.</b></div>
    <div class="cred-ver">STICK MAYHEM ${VERSION} — FATALITY & COSMETICS UPDATE</div>`;
  b.appendChild(d);
}
function buildSettings() {
  const b = $('#set-body'); b.innerHTML = '';
  const s = save.set;
  const tb = document.createElement('div'); tb.className = 'tabs'; tb.style.justifyContent = 'center';
  [['geral', 'GERAL'], ['teclado', 'TECLADO'], ['creditos', 'CRÉDITOS']].forEach(([k, n]) => { const t = document.createElement('button'); t.className = 'tab' + (k === setTab ? ' sel' : ''); t.textContent = n; t.onclick = () => { SFX.play('click'); setTab = k; buildSettings(); }; tb.appendChild(t); });
  b.appendChild(tb);
  if (setTab === 'teclado') { buildKeys(b); return; }
  if (setTab === 'creditos') { buildCredits(b); return; }
  const slider = (label, key, min, max, step, fmt) => {
    const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<label>${label}</label><input type="range" min="${min}" max="${max}" step="${step}" value="${s[key]}"><span class="val"></span>`;
    const inp = r.querySelector('input'), v = r.querySelector('.val'); const upd = () => v.textContent = fmt(+inp.value); upd();
    inp.oninput = () => { s[key] = +inp.value; upd(); applySettings(); };
    inp.onchange = () => { persist(); if (key === 'sfx') SFX.play('pickup'); };
    b.appendChild(r);
  };
  const toggle = (label, key, cb) => {
    const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<label>${label}</label><button class="toggle"></button>`;
    const t = r.querySelector('button'); const upd = () => { t.classList.toggle('on', !!s[key]); t.textContent = s[key] ? 'LIGADO' : 'DESLIGADO'; }; upd();
    t.onclick = () => { s[key] = !s[key]; upd(); persist(); applySettings(); if (cb) cb(); SFX.play('click'); };
    b.appendChild(r);
  };
  slider('Música', 'music', 0, 1, 0.05, v => Math.round(v * 100) + '%');
  slider('Efeitos sonoros', 'sfx', 0, 1, 0.05, v => Math.round(v * 100) + '%');
  const q = document.createElement('div'); q.className = 'row'; q.innerHTML = '<label>Gráficos</label><div class="chips"></div>'; b.appendChild(q);
  chips(q.querySelector('.chips'), [[0, 'Baixo (mais FPS)'], [1, 'Alto']], s.quality, v => { s.quality = v; persist(); applySettings(); resize(); buildSettings(); });
  slider('Tamanho dos controles', 'cs', 0.6, 1.5, 0.05, v => Math.round(v * 100) + '%');
  slider('Transparência dos botões', 'co', 0.25, 1, 0.05, v => Math.round(v * 100) + '%');
  toggle('Tremor de câmera', 'shake');
  toggle('Vibração (haptic)', 'haptic');
  toggle('Controles espelhados (canhoto)', 'mirror');
  const gpr = document.createElement('div'); gpr.className = 'row'; gpr.innerHTML = '<label>' + ico('gamepad') + ' Controle</label><span class="val" style="flex:1;text-align:right;font-size:.8em">' + (GP.list().length ? GP.list().length + ' conectado(s). A pula · analógico direito mira 360° · X/R1/RT ataca · B/L1/LT especial · Y larga · Back/clique no analógico = AWAKENING · Start pausa' : 'Conecte um controle (USB/Bluetooth) e aperte um botão.') + '</span>'; b.appendChild(gpr);
  const o = document.createElement('div'); o.className = 'row'; o.innerHTML = '<label>Tela cheia / orientação</label><button class="btn">' + ico('full') + ' <span>TELA CHEIA + PAISAGEM</span></button>'; o.querySelector('button').onclick = () => { toggleFS(); }; b.appendChild(o);
  const r = document.createElement('div'); r.className = 'row'; r.innerHTML = '<label>Dados salvos</label><button class="btn danger">APAGAR PROGRESSO</button>';
  r.querySelector('button').onclick = () => { if (confirm('Apagar moedas, itens, estatísticas e configurações?')) { save = defaults(); persist(); applySettings(); buildSettings(); updCoins(); toast('Progresso apagado.'); } };
  b.appendChild(r);
}
$('#set-back').onclick = () => { SFX.play('click'); if (app.settingsFrom === 'pause') showScreen('pause'); else go('menu'); };

// ---------- estatísticas e desafios ----------
function chalProg(c) { return save.ch.prog[c.id] || 0; }
function buildStats() {
  const s = save.stats, b = $('#stats-body');
  const tile = (v, l) => `<div class="tile"><b>${v}</b><span>${l}</span></div>`;
  const min = Math.floor(s.time / 60);
  b.innerHTML = '<div class="stats-grid">' + tile(s.matches, 'Partidas') + tile(s.wins, 'Vitórias') + tile(s.losses, 'Derrotas') + tile(s.kills, 'Eliminações') + tile(s.deaths, 'Mortes') + tile(Math.round(s.dmg), 'Dano causado') + tile(min + ' min', 'Tempo de luta') + tile(Math.round(s.bestSurvive) + ' s', 'Maior sobrevivência') + '</div><h4>DESAFIOS</h4>';
  CHALLENGES.forEach(c => {
    const p = Math.min(chalProg(c), c.goal), done = !!save.ch.done[c.id];
    b.innerHTML += `<div class="chal ${done ? 'done' : ''}"><b>${done ? ico('check') + ' ' : ''}${c.text}</b> <span style="float:right;color:#fde68a">${ico('coin')} ${c.reward}</span><div class="pb"><b style="width:${p / c.goal * 100}%"></b></div><small>${p}/${c.goal}</small></div>`;
  });
}

// ---------- partida / série de rodadas ----------
let roundTimer = 0;
function startSeries(base) {
  const multi = base.mode !== 'chaos' && (base.score === 'board' || base.target > 0);
  app.series = {base, rounds: multi, board: base.score === 'board', target: base.target || 0, score: [0, 0], round: 1, extra: 0,
    agg: {}, time: 0, names: []};
  launchRound();
}
function launchRound() {
  const sr = app.series, b = sr.base;
  const cfg = Object.assign({}, b, {rounds: sr.rounds ? {target: sr.board ? 0 : sr.target} : null, score: sr.score.slice(), round: sr.round});
  startGame(cfg);
}
function startGame(cfg) {
  SFX.resume(); SFX.duck(false); clearInterval(roundTimer);
  Controls.setMode(cfg.mode === 'duel_local' ? 'local' : 'single');
  const fxMax = cfg.camFx === false ? 70 : (save.set.quality ? 480 : 110);
  app.game = {cfg, start: performance.now()};
  app.scene = new Match(cfg, {inputs: Controls.inputs, skin: mySkin(0), skin2: mySkin(1), shake: save.set.shake, fxMax, netMe: Net.pid, netInputs: Net.inputs, netClient: !!cfg.client});
  document.body.classList.toggle('netg', !!cfg.online); app.netEnded = false;
  if (cfg.online && !cfg.client) Net.attach(app.scene);
  if (cfg.camFx === false) app.scene.fx.shakeOn = false;
  app.state = 'game'; app.endReal = 0; app.acc = 0;
  document.body.classList.toggle('awk-on', !!(cfg.awk && cfg.awk.on));
  document.body.classList.remove('kb');
  [0, 1].forEach(sl => { const f = app.scene.fighters.find(x => x.slot === sl); const c = AWK_TYPES[f ? f.awkType : 'void'].c; const h = c.replace('#', ''); const rgb = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(','); $$('.cb.awk[data-s="' + sl + '"]').forEach(e => { e.style.setProperty('--c', rgb); e.style.setProperty('--p', 0); e.classList.remove('ready'); }); });
  showScreen(null); $('#hud').classList.remove('hidden'); $('#ctrl').classList.remove('hidden');
  SFX.music('battle');
  checkOrientation();
}
function leaveGame(toScreen) {
  clearInterval(roundTimer);
  app.state = 'menu'; app.game = null; app.series = null; app.vic = null;
  Controls.setMode('none'); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden'); document.body.classList.remove('awk-on', 'kb');
  newMenuScene(); applySettings(); SFX.duck(false); SFX.music('menu'); go(toScreen || 'menu');
}
function pauseGame() {
  if (app.state !== 'game') return;
  if (Net.role) { if (!document.hidden) { Controls.reset(); showScreen('pause'); $('#s-pause').classList.add('active'); } return; }
  app.state = 'paused'; Controls.reset(); SFX.duck(true); showScreen('pause'); $('#s-pause').classList.add('active');
}
function resumeGame() {
  if (Net.role && app.state === 'game') { Controls.reset(); showScreen(null); return; }
  if (app.state !== 'paused') return;
  app.state = 'game'; Controls.reset(); SFX.duck(false); showScreen(null); app.last = performance.now();
}
$('#btn-pause').onclick = () => { SFX.play('click'); pauseGame(); };
$('#p-resume').onclick = () => { SFX.play('click'); resumeGame(); };
$('#p-restart').onclick = () => { SFX.play('click'); startSeries(app.series.base); };
$('#p-arena').onclick = () => { SFX.play('click'); leaveGame('play'); };
$('#p-settings').onclick = () => { SFX.play('click'); app.settingsFrom = 'pause'; setTab = 'geral'; showScreen('settings'); buildSettings(); };
$('#p-menu').onclick = () => { SFX.play('click'); leaveGame('menu'); };
$('#r-again').onclick = () => { SFX.play('click'); startSeries(app.series ? app.series.base : baseCfg()); };
$('#r-arena').onclick = () => { SFX.play('click'); leaveGame('play'); };
$('#r-menu').onclick = () => { SFX.play('click'); leaveGame('menu'); };
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
window.addEventListener('pagehide', pauseGame);

// fim de uma partida/rodada: soma estatísticas e decide o próximo passo
function onMatchEnd() {
  const sr = app.series, m = app.scene, res = m.result, F = m.fighters;
  F.forEach((f, i) => { const a = sr.agg[i] || (sr.agg[i] = {name: f.name, kills: 0, deaths: 0, dmg: 0, surv: 0, killW: []}); a.name = f.name; a.kills += f.kills; a.deaths += f.deaths; a.dmg += f.dmgDealt; a.surv += f.surviveT; a.killW = a.killW.concat([...f.killWeapons]); });
  sr.time += m.t;
  const w = res.winner;
  if (sr.base.mode === 'chaos') { finishMatch(); return; }
  if (!w) { sr.extra++; showRound(res.timeUp ? 'EMPATE NO TEMPO' : 'EMPATE', 'RODADA EXTRA para desempatar', false); return; }
  if (sr.rounds) {
    sr.score[w === F[0] ? 0 : 1]++;
    const done = !sr.board && sr.score[0] >= sr.target || !sr.board && sr.score[1] >= sr.target;
    if (done) { endOrFatality(w); return; }
    showRound(w.name + ' VENCEU A RODADA', '', true);
    sr.round++;
  } else endOrFatality(w);
}
function showRound(title, sub, scored) {
  const sr = app.series, m = app.scene;
  app.state = 'round'; Controls.reset(); $('#ctrl').classList.add('hidden');
  $('#rd-n').textContent = sr.rounds ? 'RODADA ' + (scored ? sr.round : sr.round) + (sr.board ? '' : ' · 1º A ' + sr.target + ' VITÓRIAS') : 'DESEMPATE';
  $('#rd-title').textContent = title;
  const sc = $('#rd-score'); sc.textContent = sr.rounds ? sr.score[0] + ' : ' + sr.score[1] : ''; sc.style.animation = 'none'; void sc.offsetWidth; sc.style.animation = '';
  $('#rd-sub').textContent = sub || (sr.board ? 'Quadro de vitórias — continue ou encerre.' : '');
  const next = $('#rd-next-t'), endB = $('#rd-end span');
  endB.textContent = sr.board ? 'ENCERRAR E VER RESULTADO' : 'ABANDONAR';
  $('#rd-end').onclick = () => { SFX.play('click'); if (sr.board && sr.rounds) finishMatch(); else leaveGame('menu'); };
  $('#rd-next').onclick = () => { SFX.play('go'); clearInterval(roundTimer); launchRound(); };
  clearInterval(roundTimer);
  if (!sr.board) {
    let n = 4; next.textContent = 'PRÓXIMA RODADA (' + n + ')';
    roundTimer = setInterval(() => { n--; if (n <= 0) { clearInterval(roundTimer); if (app.state === 'round') launchRound(); } else next.textContent = 'PRÓXIMA RODADA (' + n + ')'; }, 1000);
  } else next.textContent = 'PRÓXIMA RODADA';
  showScreen('round'); SFX.duck(false);
}

// ---------- FATALITY: tela de vitória especial + execução ----------
// só existe quando a PARTIDA inteira foi vencida (série fechada ou partida única decidida), com a opção ligada na configuração
function fatEligible(w) {
  const sr = app.series, cfg = app.game && app.game.cfg;
  if (!cfg || !sr || !w || !cfg.fatality || sr.board) return false;
  if (cfg.mode !== 'duel_cpu' && cfg.mode !== 'duel_local') return false;
  if (cfg.mode === 'duel_cpu' && !w.human) return false;       // contra a CPU: só se o jogador venceu
  return true;
}
function endOrFatality(w) { if (fatEligible(w)) beginFatality(w); else finishMatch(); }
const fatEq = f => f.slot === 1 ? save.eq2 : save.eq;
function fatIdOf(f) { const id = fatEq(f).fat; return FATS[id] && owned('fat', id) ? id : 'iron'; }
// Fatality automática: ao vencer a partida inteira, a finalização roda sozinha (sem botão); depois vem a tela de vitória
function beginFatality(w) {
  const m = app.scene, cfg = app.game.cfg, loser = m.fighters.find(f => f !== w);
  app.vic = {winner: w, loser, match: m, used: false, local: false};
  app.state = 'victory'; Controls.reset(); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden'); clearInterval(roundTimer);
  startFatality();
}
function showVictory() {   // pós-Fatality: tela de vitória com resultado / nova partida / menu
  const V = app.vic, w = V.winner, sr = app.series, cfg = app.game.cfg, local = cfg.mode === 'duel_local', F = FATS[V.fatId];
  V.post = true; V.local = false; app.state = 'victory';
  $('#vic-title').textContent = local ? w.name + ' VENCEU!' : 'VITÓRIA!';
  $('#vic-sub').textContent = 'PARTIDA VENCIDA' + (sr.rounds ? ' · ' + sr.score[0] + ' : ' + sr.score[1] : '');
  $('#vic-fat').classList.add('hidden'); $('#vic-hint').textContent = '';
  $('#vic-eq').innerHTML = ico('skull') + ' <span>Fatality:</span> <b style="color:' + F.c + '">' + F.name + '</b>';
  $('#vic-skip span').textContent = 'VER RESULTADO';
  const box = $('#s-victory'); box.classList.remove('local', 'side-r');
  const t = $('#vic-title'); t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  showScreen('victory'); SFX.duck(false); SFX.play('fat_win');
}
function fatAllowed(e) {   // duelo local: só o vencedor aciona (lado da tela dele, ou as teclas/controle dele)
  const V = app.vic; if (!V) return false; if (!V.local) return true;
  if (e && e.detail > 0) return (e.clientX < window.innerWidth / 2) === (V.winner.slot === 0);
  return false;
}
function startFatality() {
  const V = app.vic; if (!V || V.used || app.state !== 'victory') return;   // trava contra ativação dupla
  V.used = true;
  const win = V.winner, lose = V.loser, id = fatIdOf(win), old = V.match;
  const cfg = {mode: 'fatality', arena: app.game.cfg.arena, weapons: false, camFx: true, hp: 100, format: 'stock', lives: 1};
  const fxMax = save.set.quality ? 480 : 110;
  const m = new Match(cfg, {skin: Object.assign({}, win.skin), skin2: Object.assign({}, lose.skin), shake: save.set.shake, fxMax, heroName: win.name, vicName: lose.name});
  m.fatStart(id);
  V.fatId = id; V.fatMatch = m; app.scene = m; app.state = 'fatality'; app.acc = 0; app.fatWait = 0;
  Controls.reset(); showScreen(null); SFX.duck(true); save.stats.fatalities = (save.stats.fatalities || 0) + 1; persist(); buzz(30);
}
function showFatEnd() { if (!app.vic || app.state !== 'fatality') return; showVictory(); }
function closeVictory() { const V = app.vic; if (V) { app.scene = V.match; V.fatMatch = null; } app.vic = null; }
function skipFatality() { if (app.state !== 'victory' || !app.vic) return; closeVictory(); finishMatch(); }
$('#vic-fat').addEventListener('pointerdown', e => { if (app.state === 'victory') { $('#vic-fat').classList.add('hit'); buzz(25); SFX.resume(); SFX.play('fat_button'); } });
$('#vic-fat').addEventListener('click', e => {
  if (app.state !== 'victory') return;
  if (!fatAllowed(e)) { toast('Somente o vencedor pode executar a Fatality.'); SFX.play('hit'); return; }
  startFatality();
});
$('#vic-skip').onclick = () => { SFX.play('click'); skipFatality(); };
$('#vic-again').onclick = () => { SFX.play('click'); if (app.state !== 'victory') return; const b = app.series.base; closeVictory(); finishMatch(); startSeries(b); };
$('#vic-menu').onclick = () => { SFX.play('click'); if (app.state !== 'victory') return; closeVictory(); finishMatch(); leaveGame('menu'); };
$('#fe-cont').onclick = () => { SFX.play('click'); if (app.state !== 'fatend') return; closeVictory(); finishMatch(); };
$('#fe-again').onclick = () => { SFX.play('click'); if (app.state !== 'fatend') return; const b = app.series.base; closeVictory(); finishMatch(); startSeries(b); };
$('#fe-menu').onclick = () => { SFX.play('click'); if (app.state !== 'fatend') return; closeVictory(); finishMatch(); leaveGame('menu'); };

function finishMatch() {
  const sr = app.series, m = app.scene, cfg = app.game.cfg, F = m.fighters, p = F[0], A = sr.agg;
  clearInterval(roundTimer);
  app.state = 'result'; Controls.reset(); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden');
  let win = m.result.winner, pw;
  if (sr.rounds) { const d = sr.score[0] - sr.score[1]; win = d > 0 ? F[0] : d < 0 ? F[1] : null; }
  pw = win === p;
  const st = save.stats; let coins = 0, lines = [];
  const kills = A[0].kills, surv = A[0].surv;
  if (cfg.mode === 'duel_local') { coins = 10; lines.push('Partida local: +10'); }
  else {
    coins += 5; lines.push('Participação: +5');
    if (pw) { const v = cfg.mode === 'chaos' ? 30 : 22; coins += v; lines.push('Vitória: +' + v); }
    if (kills) { coins += kills * 8; lines.push('Eliminações (' + kills + '): +' + kills * 8); }
    const sv = Math.min(12, Math.floor(surv / 15)); if (sv) { coins += sv; lines.push('Sobrevivência: +' + sv); }
    coins = Math.min(coins, 80);
    if (cfg.diff === 0) coins = Math.ceil(coins * 0.7);
  }
  st.matches++; st.time += sr.time; st.kills += kills; st.deaths += A[0].deaths; st.dmg += A[0].dmg;
  if (pw) st.wins++; else if (win) st.losses++;
  A[0].killW.forEach(w => { st.weaponKills[w] = (st.weaponKills[w] || 0) + 1; });
  const pr = save.ch.prog;
  if (cfg.mode === 'duel_cpu' && pw) { st.duelWins++; pr.duel3 = (pr.duel3 || 0) + 1; if (cfg.variant === 'awk') pr.awk3 = (pr.awk3 || 0) + 1; }
  if (cfg.mode === 'chaos') { st.chaosPlayed++; pr.chaos5 = (pr.chaos5 || 0) + 1; if (kills >= 2) pr.chaos2 = 1; if (p.surviveT >= 90) pr.surv90 = 1; st.bestSurvive = Math.max(st.bestSurvive, p.surviveT); }
  pr.kills50 = st.kills; pr.weap5 = Object.keys(st.weaponKills).length;
  let bonus = 0;
  CHALLENGES.forEach(c => { if (!save.ch.done[c.id] && (pr[c.id] || 0) >= c.goal) { save.ch.done[c.id] = true; bonus += c.reward; toast('Desafio completo! +' + c.reward + ' moedas'); } });
  save.coins += coins + bonus; persist(); updCoins();
  // UI
  const title = $('#res-title'), local = cfg.mode === 'duel_local';
  let t, sub = '';
  if (!win) t = 'EMPATE!';
  else if (local) t = win.name + ' VENCEU!';
  else if (cfg.mode === 'duel_cpu') { t = pw ? 'VITÓRIA!' : 'DERROTA'; sub = pw ? 'Você derrotou a CPU (' + DIFF_NAMES[cfg.diff] + ')' : 'A CPU venceu desta vez.'; }
  else { t = pw ? 'VITÓRIA!' : win.name + ' VENCEU'; sub = 'Último sobrevivente: ' + win.name; }
  if (m.result.timeUp && !sr.rounds) sub = 'Tempo esgotado — ' + (sub || 'decisão por vidas/vida restante');
  title.textContent = t; title.classList.toggle('lose', !win || (!pw && !local));
  title.style.animation = 'none'; void title.offsetWidth; title.style.animation = '';
  if (sr.rounds) sub = 'Placar final ' + sr.score[0] + ' : ' + sr.score[1] + (sub ? ' · ' + sub : '');
  $('#res-sub').textContent = sub + (sub ? ' · ' : '') + 'Tempo total: ' + Math.floor(sr.time / 60) + ':' + String(Math.floor(sr.time % 60)).padStart(2, '0');
  let tb = '<table><tr><th>Lutador</th><th>Elim.</th><th>Dano</th><th>Sobreviveu</th></tr>';
  F.forEach((f, i) => { const a = A[i]; tb += `<tr class="${f === win ? 'win' : ''}"><td>${f === win ? ico('crown') + ' ' : ''}${f.name}</td><td>${a.kills}</td><td>${Math.round(a.dmg)}</td><td>${Math.round(a.surv)} s</td></tr>`; });
  $('#res-table').innerHTML = tb + '</table>';
  $('#res-coins').innerHTML = ico('coin') + ' +' + (coins + bonus) + ' moedas' + (lines.length ? '<br><small style="opacity:.8;font-weight:600">' + lines.join(' · ') + (bonus ? ' · Desafios: +' + bonus : '') + '</small>' : '');
  showScreen('result'); SFX.duck(false);
}

// ---------- laço principal ----------
function frame(ts) {
  requestAnimationFrame(frame);
  if (!app.last) app.last = ts;
  let dt = Math.min(0.1, (ts - app.last) / 1000); app.last = ts;
  if (dt <= 0) return;
  app.fps += (1 / dt - app.fps) * 0.05; app.t += dt;
  // adaptação de desempenho
  if (app.scene && app.fps < 38 && app.t > 3 && app.scene.fx.max > 120) app.scene.fx.max -= 4;
  Controls.poll();
  const sc = app.scene;
  if (app.inCustom) { renderPreview(app.t, dt); }
  if (sc) {
    if (app.state !== 'paused' && app.state !== 'result' && app.state !== 'round') {
      app.acc += dt * (sc.timeScale || 1);
      let n = 0;
      Net.inSim = Net.role === 'host';
      while (app.acc >= DT && n < 8) { sc.update(DT); app.acc -= DT; n++; }
      Net.inSim = false;
      if (n >= 8) app.acc = 0;
      if (app.state === 'game' && Net.role) { if (Net.role === 'host') Net.tickHost(sc, dt); else Net.tickClient(Controls.inputs[0], dt); }
    }
    if (app.state === 'game' && sc.ended) { app.endReal += dt; if (app.endReal > 2.8 && !Net.role) onMatchEnd(); else if (app.endReal > 2.8 && Net.role === 'host' && !app.netEnded) { app.netEnded = true; onlineHostEnd(sc); } }
    if (app.state === 'fatality' && sc.fat && sc.fat.done) { app.fatWait += dt; if (app.fatWait > 1.8) showFatEnd(); }
    if (app.state === 'game') hudAwk(sc);
    renderFrame(ctx, cv.width, cv.height, sc, app.t, view);
  } else { ctx.fillStyle = '#0b0820'; ctx.fillRect(0, 0, cv.width, cv.height); }
}

// ---------- início ----------
$('#ver').textContent = 'STICK MAYHEM ' + VERSION + ' — ONLINE UPDATE';
applySettings(); resize(); newMenuScene(); updCoins();
if (!isFinite(save.coins)) save.coins = 0;
requestAnimationFrame(frame);
function hudAwk(sc) {
  if (!sc.cfg.awk || !sc.cfg.awk.on) return;
  for (let sl = 0; sl < 2; sl++) {
    const f = sc.fighters.find(x => x.slot === sl); if (!f) continue;
    const p = Math.round(clamp(f.energy, 0, 100)), rdy = f.energy >= 100 && !f.awk;
    $$('.cb.awk[data-s="' + sl + '"]').forEach(e => { if (e._p !== p) { e._p = p; e.style.setProperty('--p', p); } if (e._r !== rdy) { e._r = rdy; e.classList.toggle('ready', rdy); } });
  }
}
window.__SM = {app, Net: typeof Net !== 'undefined' ? Net : null, save, Controls, startGame, startSeries, baseCfg};
