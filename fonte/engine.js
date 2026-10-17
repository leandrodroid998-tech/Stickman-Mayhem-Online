'use strict';
/* STICK MAYHEM — motor: física ragdoll (verlet), lutadores, armas, projéteis, partida */
const DT = 1 / 120;
const HEAD = 0, CHEST = 1, HIP = 2, ELL = 3, HDL = 4, ELR = 5, HDR = 6, KNL = 7, FTL = 8, KNR = 9, FTR = 10;
const PR = [11, 7, 8, 4, 5, 4, 5, 5, 5, 5, 5];
const BW = 22, BH = 104;
const CONS = [
  [HEAD, CHEST, 22, 1], [CHEST, HIP, 30, 1], [CHEST, ELL, 18, 1], [ELL, HDL, 18, 1], [CHEST, ELR, 18, 1], [ELR, HDR, 18, 1],
  [HIP, KNL, 22, 1], [KNL, FTL, 22, 1], [HIP, KNR, 22, 1], [KNR, FTR, 22, 1],
  [HEAD, HIP, 50, 0.16], [CHEST, KNL, 30, 0.5, 1], [CHEST, KNR, 30, 0.5, 1],
];

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const easeO = t => 1 - (1 - t) * (1 - t);
const easeI = t => t * t;
const sgn = v => v < 0 ? -1 : 1;

function segCircle(ax, ay, bx, by, cx, cy, r) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  let t = l2 ? ((cx - ax) * dx + (cy - ay) * dy) / l2 : 0;
  t = clamp(t, 0, 1);
  const px = ax + dx * t - cx, py = ay + dy * t - cy;
  return px * px + py * py <= r * r;
}
// devolve t de entrada (0..1) ou -1
function segRect(ax, ay, bx, by, rx, ry, rw, rh) {
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dy = by - ay;
  const p = [-dx, dx, -dy, dy], q = [ax - rx, rx + rw - ax, ay - ry, ry + rh - ay];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) { if (q[i] < 0) return -1; }
    else {
      const t = q[i] / p[i];
      if (p[i] < 0) { if (t > t1) return -1; if (t > t0) t0 = t; }
      else { if (t < t0) return -1; if (t < t1) t1 = t; }
    }
  }
  return t0;
}
function newInput() { return {mx: 0, my: 0, face: 0, aimX: 0, aimY: 0, jumpP: false, jumpH: false, atkH: false, spP: false, dropP: false, awkP: false}; }

// IK de 2 ossos
const _o = {ex: 0, ey: 0, hx: 0, hy: 0};
function ik(ax, ay, bx, by, l1, l2, side, o) {
  let dx = bx - ax, dy = by - ay, d = Math.sqrt(dx * dx + dy * dy) || 0.001;
  const maxd = l1 + l2 - 0.5;
  if (d > maxd) { bx = ax + dx / d * maxd; by = ay + dy / d * maxd; dx = bx - ax; dy = by - ay; d = maxd; }
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const mx = ax + dx / d * a, my = ay + dy / d * a;
  o.ex = mx - dy / d * h * side; o.ey = my + dx / d * h * side; o.hx = bx; o.hy = by;
}

// ---------- movimento de caixa (lutadores e itens) ----------
function moveBody(m, b, dt, drop) {
  const plats = m.plats, hw = b.w / 2;
  b.grounded = false; b.plat = null; b.wall = 0;
  b.x += b.vx * dt;
  for (let i = 0; i < plats.length; i++) {
    const p = plats[i];
    if (!p.solid) continue;
    if (b.x + hw > p.x && b.x - hw < p.x + p.w && b.y > p.y && b.y - b.h < p.y + p.h) {
      if (b.y - p.y <= 6 && b.vy >= 0) continue;
      const pl = (b.x + hw) - p.x, pr = (p.x + p.w) - (b.x - hw);
      if (pl < pr) { b.x = p.x - hw; b.wall = 1; } else { b.x = p.x + p.w + hw; b.wall = -1; }
      b.vx = b.bounce ? -b.vx * b.bounce : 0;
    }
  }
  const pb = b.y;
  b.y += b.vy * dt;
  for (let i = 0; i < plats.length; i++) {
    const p = plats[i];
    if (!(b.x + hw > p.x && b.x - hw < p.x + p.w)) continue;
    if (p.solid) {
      if (b.y > p.y && b.y - b.h < p.y + p.h) {
        const margin = 6 + Math.max(0, p.dy || 0);
        if (pb <= p.y + margin && b.vy >= 0) {
          b.y = p.y; b.vy = (b.bounce && b.vy > 140) ? -b.vy * b.bounce : 0; b.grounded = true; b.plat = p;
        } else if (b.vy < 0 && pb - b.h >= p.y + p.h - 8) {
          b.y = p.y + p.h + b.h; b.vy = b.bounce ? -b.vy * b.bounce : 0;
        } else if (pb - b.h < p.y + p.h - 8 && pb > p.y + margin) {
          // embutido lateralmente: empurra para o lado mais próximo
          const pl = (b.x + hw) - p.x, pr = (p.x + p.w) - (b.x - hw);
          if (pl < pr) { b.x = p.x - hw; b.wall = 1; } else { b.x = p.x + p.w + hw; b.wall = -1; }
        }
      }
    } else if (!drop && b.vy >= 0 && pb <= p.y + 4 + Math.max(0, p.dy || 0) && b.y >= p.y) {
      b.y = p.y; b.vy = (b.bounce && b.vy > 140) ? -b.vy * b.bounce : 0; b.grounded = true; b.plat = p;
    }
  }
}

// ---------- partículas ----------
class FX {
  constructor() {
    this.max = 420; this.pool = []; this.i = 0;
    for (let k = 0; k < 700; k++) this.pool.push({l: 0, L: 1, x: 0, y: 0, vx: 0, vy: 0, s: 2, c: '#fff', g: 0, k: 0});
    this.rings = []; this.texts = []; this.beams = []; this.shake = 0; this.flash = 0; this.shakeOn = true;
  }
  add(x, y, vx, vy, l, s, c, g, k) {
    if (GFX.low && Math.random() < 0.55) return;
    const p = this.pool[this.i]; this.i = (this.i + 1) % this.max;
    p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.l = p.L = l; p.s = s; p.c = c; p.g = g || 0; p.k = k || 0;
  }
  burst(x, y, n, spd, l, s, c, g, k, ang, spr) {
    if (GFX.low) n = Math.ceil(n * 0.5);
    for (let i = 0; i < n; i++) {
      const a = (ang === undefined ? Math.random() * 6.283 : ang + (Math.random() - 0.5) * (spr || 1));
      const v = spd * (0.35 + Math.random() * 0.65);
      this.add(x, y, Math.cos(a) * v, Math.sin(a) * v, l * (0.6 + Math.random() * 0.4), s * (0.6 + Math.random() * 0.6), c, g, k);
    }
  }
  ring(x, y, R, l, c, w) { if (this.rings.length < (GFX.low ? 6 : 24)) this.rings.push({x, y, R, l, L: l, c, w: w || 4}); }
  text(x, y, s, c) { if (this.texts.length < (GFX.low ? 8 : 16)) this.texts.push({x, y, s, c, l: 0.8}); }
  beam(x1, y1, x2, y2, l, c) { if (this.beams.length < 8) this.beams.push({x1, y1, x2, y2, l, L: l, c}); }
  addShake(v) { if (this.shakeOn) this.shake = Math.min(18, this.shake + v); }
  update(dt) {
    for (let i = 0; i < this.max; i++) {
      const p = this.pool[i];
      if (p.l <= 0) continue;
      p.l -= dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === 1) { p.vx *= 0.97; p.vy *= 0.97; }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) { this.rings[i].l -= dt; if (this.rings[i].l <= 0) this.rings.splice(i, 1); }
    for (let i = this.texts.length - 1; i >= 0; i--) { const t = this.texts[i]; t.l -= dt; t.y -= 40 * dt; if (t.l <= 0) this.texts.splice(i, 1); }
    for (let i = this.beams.length - 1; i >= 0; i--) { this.beams[i].l -= dt; if (this.beams[i].l <= 0) this.beams.splice(i, 1); }
    this.shake *= Math.pow(0.02, dt);
    if (this.flash > 0) this.flash -= dt;
  }
}

// ---------- Lutador ----------
function pelletA(base, i, n, w) {
  // leque regular para armas com vários projéteis de baixa dispersão (shuriken); aleatório nas demais
  if (w.proj === 'shuriken') return base + (i - (n - 1) / 2) * w.spread;
  return base + (Math.random() * 2 - 1) * (w.spread || 0);
}
class Fighter {
  constructor(m, o) {
    this.m = m; this.id = o.id; this.slot = o.slot; this.name = o.name; this.tag = o.tag || '';
    this.tcolor = o.tcolor || '#fff'; this.skin = o.skin; this.human = !!o.human; this.brain = null;
    this.input = o.input || newInput();
    this.maxhp = 100; this.hp = 100; this.lives = o.lives || 1; this.out = false; this.alive = true;
    this.w = BW; this.h = BH; this.bounce = 0;
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; this.facing = 1; this.grounded = false; this.plat = null; this.wall = 0;
    this.pts = []; this.T = [];
    for (let i = 0; i < 11; i++) { this.pts.push({x: 0, y: 0, px: 0, py: 0}); this.T.push({x: 0, y: 0}); }
    this.kills = 0; this.deaths = 0; this.dmgDealt = 0; this.killWeapons = new Set(); this.elimTime = 0; this.surviveT = 0;
    this.phase = 0; this.celebrate = false; this.winAnim = 0; this.hopT = 0; this.celeT = 0;
    this.capeN = []; for (let i = 0; i < 7; i++) this.capeN.push({x: 0, y: 0, px: 0, py: 0});
    this.energy = 0; this.awk = null; this.awkLock = 0; this.chain = 0; this.chainT = -9; this.readyT = 0; this.dmgMul = 1;
    this.awkType = (o.skin && o.skin.awk) || 'void'; this.awkUses = 0;
    this.reset(o.spawn || {x: 640, y: 600}, true);
  }
  reset(sp, first) {
    this.x = sp.x; this.y = sp.y; this.vx = 0; this.vy = 0; this.hp = this.maxhp; this.alive = true;
    this.facing = this.x < WORLD_W / 2 ? 1 : -1;
    this.wp = null; this.ragdoll = false; this.stun = 0; this.hitstun = 0; this.invuln = first ? 0 : 2.2; this.flash = 0; this.poise = 0;
    this.atkT = -1; this.cd = 0; this.specialCd = 0; this.dashT = 0; this.charge = 0; this.beamT = 0; this.beamTick = 0; this.boomN = 0;
    this.emptyT = 0; this.coyote = 0; this.jbuf = 0; this.dropT = 0; this.airJumps = 1; this.landT = 0; this.throwT = 0; this.recoilT = 0;
    this.respawnT = 0; this.getUpT = 0; this.zapCd = 0; this.lastHit = null; this.hitSet = []; this.lunged = false; this.aimA = 0;
    this.wAng = -0.9; this.dashHit = []; this.deadT = 0; this.fell = false;
    this.pose(); for (let i = 0; i < 11; i++) { const p = this.pts[i], t = this.T[i]; p.x = p.px = t.x; p.y = p.py = t.y; }
    this.awk = null; this.awkLock = 0; if (first) { this.energy = 0; this.chain = 0; this.chainT = -9; }
    this.capeReset();
  }
  // ----- capa: tecido simplificado (verlet) com comprimento fixo => nunca estica
  capeReset() {
    const P = this.pts, c = this.capeN, ax = P[CHEST].x - this.facing * 5, ay = P[CHEST].y + 2;
    for (let i = 0; i < c.length; i++) { const n = c[i]; n.x = n.px = ax - this.facing * 1.5 * i; n.y = n.py = ay + i * 11; }
  }
  capeDef() { const d = CAPES[this.skin.cape]; return d || null; }
  capeKick(kx, ky) {
    const d = this.capeDef(); if (!d) return;
    const c = this.capeN, n = d.n;
    for (let i = 1; i < n; i++) { const k = i / n * 0.012; c[i].px -= clamp(kx * k, -3, 3); c[i].py -= clamp(ky * k, -3, 3); }
  }
  capeStep(dt) {
    const cd = this.capeDef(); if (!cd) return;
    const P = this.pts, c = this.capeN, N = cd.n, fx = this.facing, L = 11, rag = this.ragdoll || !this.alive;
    const ax = P[CHEST].x - fx * 5, ay = P[CHEST].y + 2;
    if (!(Math.abs(c[0].x - ax) < 80 && Math.abs(c[0].y - ay) < 80) || !isFinite(c[1].x)) { this.capeReset(); }
    if (this.capeFace !== fx) {                                    // virou: espelha a capa em vez de chicoteá-la por cima do corpo
      if (this.capeFace) for (let i = 1; i < N; i++) { const n = c[i]; n.x = 2 * c[0].x - n.x; n.px = 2 * c[0].x - n.px; }
      this.capeFace = fx;
    }
    c[0].x = c[0].px = ax; c[0].y = c[0].py = ay;
    const g = GRAV * 0.5 * dt * dt, damp = 0.982;
    for (let i = 1; i < N; i++) {
      const n = c[i];
      let vx = (n.x - n.px) * damp, vy = (n.y - n.py) * damp;
      vx = clamp(vx, -6, 6); vy = clamp(vy, -6, 6);
      n.px = n.x; n.py = n.y; n.x += vx; n.y += vy + g;
    }
    const plats = this.m.plats;
    for (let it = 0; it < 4; it++) {
      for (let i = 1; i < N; i++) {                               // não afunda em sólidos
        const n = c[i];
        for (let j = 0; j < plats.length; j++) {
          const p = plats[j]; if (!p.solid) continue;
          if (n.x > p.x && n.x < p.x + p.w && n.y > p.y && n.y < p.y + p.h) { n.y = p.y; }
        }
      }
      for (let i = 1; i < N; i++) {                               // comprimento rígido: sempre a última operação
        const a = c[i - 1], n = c[i];
        let dx = n.x - a.x, dy = n.y - a.y; const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        n.x = a.x + dx / d * L; n.y = a.y + dy / d * L;
        if (!rag && (n.x - ax) * fx > 2) { n.x = ax + fx * 2; const e = n.y - a.y, h = Math.sqrt(Math.max(0, L * L - (n.x - a.x) * (n.x - a.x))); n.y = a.y + (e < 0 ? -h : h); }
      }
    }
  }
  wdef() { return this.wp ? WEAPONS[this.wp.id] : WEAPONS.fist; }
  get cx() { return this.ragdoll ? this.pts[HIP].x : this.x; }
  get cy() { return this.ragdoll ? this.pts[HIP].y : this.y - 50; }

  // ----- pose procedural (alvos dos 11 pontos)
  pose() {
    const T = this.T, fx = this.facing, t = this.m.time, sp = Math.abs(this.vx);
    const run = this.grounded ? clamp(sp / 260, 0, 1) : 0;
    const w = this.wdef();
    let hipY = this.y - 44 + (this.landT > 0 ? this.landT * 40 : 0) - Math.abs(Math.sin(this.phase)) * 3 * run;
    if (!this.grounded) hipY += 3;
    let lean = fx * run * 5;
    if (this.hitstun > 0) lean = -fx * 10;
    const u = this.atkT >= 0 ? this.atkT / w.swing : -1;
    if (u > 0.3 && u < 0.65 && w.type === 'melee') lean += fx * 9;
    const cel = this.celebrate;
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x + (cel && this.winAnim === 2 ? Math.sin(t * 6) * 6 : 0); hip.y = hipY + (cel && this.winAnim === 2 ? Math.sin(t * 12) * 2 : 0);
    if (cel && this.winAnim === 7) hip.y -= 30 + Math.sin(t * 2.4) * 4;      // flutuar cósmico
    ch.x = hip.x + lean; ch.y = hip.y - 30;
    hd.x = ch.x + lean * 0.4 + fx * 2; hd.y = ch.y - 22;
    // pernas
    for (let i = 0; i < 2; i++) {
      const ph = this.phase + i * Math.PI;
      let fxp, fyp;
      if (this.grounded) {
        fxp = this.x + fx * (i ? 7 : -7) + fx * Math.sin(ph) * 20 * run;
        fyp = this.y - Math.max(0, Math.cos(ph)) * 13 * run;
      } else {
        const up = this.vy < 0;
        fxp = this.x + fx * (i ? 13 : -9); fyp = this.y - (i ? (up ? 16 : 4) : (up ? 22 : 10));
      }
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const k = T[i ? KNR : KNL], f = T[i ? FTR : FTL];
      k.x = _o.ex; k.y = _o.ey; f.x = _o.hx; f.y = _o.hy;
    }
    // braço de trás
    let bx = ch.x - fx * 4 - fx * Math.sin(this.phase) * 14 * run, by = ch.y + 30 - (this.grounded ? 0 : 12);
    // braço da frente
    let hx, hy, ang = -0.9;
    const dirx = a => fx * Math.cos(a), diry = a => Math.sin(a);
    if (cel) {
      const wa = this.winAnim;
      if (wa === 0) { hx = ch.x + fx * 12 + Math.sin(t * 10) * 10; hy = ch.y - 36; bx = ch.x - fx * 14; by = ch.y + 20; }
      else if (wa === 1) { hx = ch.x + fx * 20; hy = ch.y - 26 + Math.sin(t * 6) * 3; bx = ch.x - fx * 4; by = ch.y - 30 + Math.sin(t * 6 + 1) * 3; }
      else if (wa === 2) { hx = ch.x + fx * 16; hy = ch.y - 20 - Math.sin(t * 8) * 18; bx = ch.x - fx * 8; by = ch.y - 20 + Math.sin(t * 8) * 18; }
      else if (wa === 4) { hx = ch.x + fx * 14; hy = ch.y - 38 + Math.sin(t * 5) * 2; bx = ch.x - fx * 12; by = ch.y - 38 + Math.sin(t * 5 + 1) * 2; }
      else if (wa === 5) { hx = ch.x + fx * 12; hy = ch.y + 6; bx = ch.x - fx * 2; by = ch.y + 8; }
      else if (wa === 6) { hx = ch.x + fx * 6; hy = ch.y - 44 - Math.sin(t * 14) * 2; bx = ch.x - fx * 10; by = ch.y + 22; }
      else if (wa === 7) { hx = ch.x + fx * 26; hy = ch.y - 6 + Math.sin(t * 2) * 4; bx = ch.x - fx * 24; by = ch.y - 6 - Math.sin(t * 2) * 4; }
      else if (wa === 8) { hx = ch.x + fx * 20; hy = ch.y + 2; bx = ch.x - fx * 8; by = ch.y + 20; }
      else if (wa === 9) { const pu = (t % 2.2) < 0.5 ? 1 : 0; hx = ch.x + fx * (26 + pu * 6); hy = ch.y - 20 - pu * 8; bx = ch.x - fx * (26 + pu * 6); by = ch.y - 20 - pu * 8; }
      else if (wa === 10) { hx = ch.x + fx * 18 + Math.sin(t * 4) * 6; hy = ch.y - 30; bx = ch.x + fx * 4; by = ch.y + 2; }
      else if (wa === 11) { const s7 = Math.sin(t * 7); hx = ch.x + fx * 14; hy = ch.y - 38 + s7 * 8; bx = ch.x - fx * 14; by = ch.y - 38 - s7 * 8; }
      else { hx = ch.x + fx * 10; hy = ch.y - 38; bx = ch.x - fx * 10; by = ch.y - 38; }
      this.wAng = wa === 8 ? t * 14 : -0.9;
    } else if (w.type === 'melee') {
      if (this.atkT >= 0) {
        if (w.style === 'swing') {
          if (u < 0.3) ang = lerp(-0.6, -2.4, easeO(u / 0.3));
          else if (u < 0.62) ang = lerp(-2.4, 1.2, easeI((u - 0.3) / 0.32));
          else ang = lerp(1.2, -0.2, (u - 0.62) / 0.38);
          hx = ch.x + dirx(ang) * 30; hy = ch.y + diry(ang) * 30;
        } else if (w.style === 'thrust') {
          const e = u < 0.35 ? -easeO(u / 0.35) * 0.35 : (u < 0.6 ? lerp(-0.35, 1, (u - 0.35) / 0.25) : lerp(1, 0, (u - 0.6) / 0.4));
          ang = -0.03; hx = ch.x + fx * (14 + e * 24); hy = ch.y + 8;
        } else { // soco
          const e = u < 0.25 ? -(u / 0.25) * 0.3 : (u < 0.6 ? lerp(-0.3, 1, (u - 0.25) / 0.35) : lerp(1, 0, (u - 0.6) / 0.4));
          ang = 0; hx = ch.x + fx * (16 + e * 24); hy = ch.y + 6 - e * 2;
        }
      } else if (this.wp) {
        ang = -1.1 + Math.sin(t * 3) * 0.05 + run * Math.sin(this.phase * 2) * 0.2;
        hx = ch.x + fx * 20; hy = ch.y + 14;
      } else { hx = ch.x + fx * 8; hy = ch.y + 26; ang = 0; }
      this.wAng = ang;
      if (this.atkT >= 0 && w.style === 'swing' && this.wp && w.id === 'daggers') { bx = ch.x + fx * 16; by = ch.y + 12; }
    } else if (w.type === 'throw' || w.type === 'mine') {
      if (this.throwT > 0) { const k = 1 - this.throwT / 0.28; ang = lerp(-2.3, 0.5, k); hx = ch.x + dirx(ang) * 26; hy = ch.y + diry(ang) * 26; }
      else { ang = -0.4; hx = ch.x + fx * 18; hy = ch.y + 16; }
      this.wAng = ang;
    } else { // armas de fogo, arco, laser
      ang = this.aimA;
      const back = this.recoilT > 0 ? this.recoilT * 40 : 0;
      hx = ch.x + dirx(ang) * (28 - back); hy = ch.y + 4 + diry(ang) * (28 - back);
      if (w.charge) { const pull = this.charge * 20; bx = ch.x + dirx(ang) * (30 - pull); by = ch.y + 4 + diry(ang) * (30 - pull); }
      else if (w.id === 'rifle' || w.id === 'rocket' || w.id === 'shotgun' || w.id === 'smg' || w.id === 'crossbow') { bx = ch.x + dirx(ang) * 14; by = ch.y + 8 + diry(ang) * 14; }
      this.wAng = ang;
    }
    ik(ch.x, ch.y, bx, by, 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, hx, hy, 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
  }

  smoothPose(k) {
    const T = this.T, P = this.pts;
    for (let i = 0; i < 11; i++) {
      const rate = (i === HIP) ? 1 : (i === CHEST || i === HEAD) ? 0.42 : (i === HDR || i === ELR) ? 0.55 : 0.34;
      const a = this.getUpT > 0 ? 0.14 : rate * k;
      P[i].x += (T[i].x - P[i].x) * a; P[i].y += (T[i].y - P[i].y) * a;
      P[i].px = P[i].x - this.vx * DT; P[i].py = P[i].y - this.vy * DT;
    }
  }
  addImpulse(kx, ky, only) {
    for (let i = 0; i < 11; i++) {
      const k = (only === undefined || only === i) ? 1 : 0.35;
      this.pts[i].px -= kx * DT * k; this.pts[i].py -= ky * DT * k;
    }
  }
  toRagdoll(kx, ky, stun, hx, hy) {
    if (!this.ragdoll) {
      this.ragdoll = true;
      for (let i = 0; i < 11; i++) { const p = this.pts[i]; p.px = p.x - this.vx * DT; p.py = p.y - this.vy * DT; }
      if (this.atkT >= 0) { this.atkT = -1; }
      this.charge = 0; this.beamT = 0; this.dashT = 0; this.awk = null;
    }
    this.stun = Math.max(this.stun, stun);
    const hip = this.pts[HIP];
    const spin = clamp(kx / 700, -1.6, 1.6) * 90;
    for (let i = 0; i < 11; i++) {
      const p = this.pts[i], rx = p.x - hip.x, ry = p.y - hip.y;
      p.px -= (kx - ry * spin * 0.02) * DT; p.py -= (ky + rx * spin * 0.02) * DT;
    }
    if (hx !== undefined) {
      let bi = 1, bd = 1e9;
      for (let i = 0; i < 11; i++) { const d = (this.pts[i].x - hx) ** 2 + (this.pts[i].y - hy) ** 2; if (d < bd) { bd = d; bi = i; } }
      this.pts[bi].px -= kx * 0.25 * DT; this.pts[bi].py -= ky * 0.25 * DT;
    }
  }
  getUp() {
    const P = this.pts, hip = P[HIP];
    let fy = Math.max(P[FTL].y, P[FTR].y) + 4;
    this.x = hip.x; this.y = fy;
    this.vx = clamp((hip.x - hip.px) / DT, -500, 500); this.vy = clamp((hip.y - hip.py) / DT, -500, 700);
    this.ragdoll = false; this.getUpT = 0.25; this.hitstun = 0.18; this.atkT = -1; this.cd = 0.1; this.poise = 0;
    this.facing = (P[HEAD].x >= hip.x) ? 1 : -1;
    if (Math.abs(P[HEAD].x - hip.x) < 6) this.facing = this.input.mx < 0 ? -1 : 1;
    // desembutir de sólidos
    for (let k = 0; k < 20; k++) {
      let bad = false;
      for (const p of this.m.plats) {
        if (!p.solid) continue;
        if (this.x + 11 > p.x && this.x - 11 < p.x + p.w && this.y > p.y + 4 && this.y - BH < p.y + p.h) { bad = true; break; }
      }
      if (!bad) break;
      this.y -= 6;
    }
  }

  hurt(dmg, kx, ky, by, wid, hx, hy) {
    if (!this.alive || this.invuln > 0) return false;
    const m = this.m;
    if (wid !== 'awk') dmg *= by ? (by.dmgMul || 1) : (m.envMul || 1);
    if (this.awk) { dmg *= 0.5; kx *= 0.15; ky *= 0.15; }   // super armadura durante o AWAKENING
    const hp0 = this.hp;
    this.hp -= dmg; this.flash = 0.12; this.lastHit = {by, t: m.time, wid};
    if (by && by !== this && dmg > 0) by.gainEnergy(Math.min(dmg, Math.max(0, hp0)), this, wid);
    this.capeKick(kx, ky);
    if (by && by !== this) by.dmgDealt += dmg;
    if (hx !== undefined) { m.fx.burst(hx, hy, 6, 380, 0.3, 3, '#fff7c2', 600, 0); m.fx.burst(hx, hy, 3, 220, 0.4, 3, this.skin.color, 700, 2); }
    m.fx.text(this.cx + rnd(-10, 10), this.cy - 60, Math.round(dmg), '#fff');
    SFX.play('hit');
    const kmag = Math.hypot(kx, ky);
    this.poise += kmag * 0.45;
    if (this.hp <= 0) { this.die(kx, ky, by, wid); return true; }
    if (this.ragdoll) { this.toRagdoll(kx, ky, 0.5 + kmag / 2200, hx, hy); }
    else if (kmag > 560 || this.poise > 640 || (!this.grounded && kmag > 380)) {
      this.poise = 0; this.toRagdoll(kx, ky, clamp(0.4 + kmag / 1100, 0.5, 2.0), hx, hy);
    } else {
      this.hitstun = 0.16; this.vx += kx; this.vy += ky * 0.5;
      if (this.atkT >= 0 && kmag > 250) { this.atkT = -1; this.cd = 0.2; }
    }
    if (kmag > 600) { m.fx.addShake(kmag / 150); }
    if (kmag > 800) m.hitstop = Math.max(m.hitstop, 0.05);
    return true;
  }
  die(kx, ky, by, wid, cause) {
    if (!this.alive) return;
    const m = this.m;
    this.alive = false; this.hp = 0; this.lives--; this.deaths++; this.deadT = 0; this.elimTime = m.t; this.awk = null;
    let killer = by;
    if (!killer && this.lastHit && m.time - this.lastHit.t < 5) { killer = this.lastHit.by; wid = this.lastHit.wid; }
    if (killer && killer !== this) { killer.kills++; if (wid) killer.killWeapons.add(wid); m.onKill(killer, this, wid); }
    else m.onKill(null, this, null);
    this.dropWeapon(true);
    if (cause !== 'fall') this.toRagdoll(kx * 1.1, ky - 300, 99);
    else { if (!this.ragdoll) this.toRagdoll(0, 0, 99); }
    m.fx.burst(this.cx, this.cy, 18, 500, 0.7, 4, this.skin.color, 800, 2);
    m.fx.burst(this.cx, this.cy, 10, 420, 0.5, 3, '#fff', 0, 0);
    m.fx.ring(this.cx, this.cy, 90, 0.5, '#fff', 5);
    m.fx.addShake(9); m.hitstop = Math.max(m.hitstop, 0.08);
    SFX.play('die');
    if (this.lives > 0 && (m.cfg.format === 'stock' || m.cfg.mode === 'menu')) this.respawnT = m.cfg.mode === 'menu' ? 1.4 : 2.4;
    else { this.out = true; }
  }
  dropWeapon(toss, vx) {
    if (!this.wp) return;
    const m = this.m;
    m.addItem(this.wp.id, this.x, this.y - 70, (vx !== undefined ? vx : this.facing * 160) + rnd(-40, 40), -380, this.wp.ammo, this.wp.uses, 0.8);
    this.wp = null; this.charge = 0; this.beamT = 0; this.atkT = -1;
  }

  // ----- atualização
  update(dt) {
    const m = this.m, I = this.input;
    this.flash -= dt; this.invuln -= dt; this.hitstun -= dt; this.specialCd -= dt; this.cd -= dt; this.zapCd -= dt;
    this.recoilT -= dt; this.throwT -= dt; this.landT -= dt; this.getUpT -= dt; this.dropT -= dt; this.awkLock -= dt; this.readyT -= dt;
    if (m.fatMode) { this.fatBody(dt); return; }
    if (!this.alive) {
      this.deadT += dt; this.stepRagdoll(dt); this.capeStep(dt);
      if (this.respawnT > 0) { this.respawnT -= dt; if (this.respawnT <= 0) m.respawn(this); }
      this.checkBounds(); I.jumpP = I.spP = I.dropP = I.awkP = false; return;
    }
    this.surviveT += dt;
    if (this.ragdoll) {
      this.stepRagdoll(dt); this.capeStep(dt); this.stun -= dt;
      if (this.stun <= 0) { this.getUp(); }
      this.checkBounds(); I.jumpP = I.spP = I.dropP = I.awkP = false; return;
    }
    const frozen = m.frozen;
    if (I.awkP && this.canAwk()) this.startAwk();
    if (this.awk) { if (AWK2[this.awk.type]) this.updateAwk2(dt); else this.updateAwk(dt); I.jumpP = I.spP = I.dropP = I.awkP = false; return; }
    const mx = frozen ? 0 : I.mx;
    const stunned = this.hitstun > 0 || this.getUpT > 0;
    const w = this.wdef();
    // movimento
    if (this.plat && this.plat.move) { this.x += this.plat.dx; this.y += this.plat.dy; }
    const ice = this.plat && this.plat.ice;
    let maxS = 330 * ((this.atkT >= 0 && w.slow) ? w.slow : 1);
    if (this.wp && w.type === 'melee' && w.slow) maxS *= 0.92;
    if (this.dashT > 0) {
      this.dashT -= dt; this.vx = this.dashDir * 820; this.vy += GRAV * 0.35 * dt;
      this.dashFx(dt);
    } else {
      const target = (stunned || frozen) ? 0 : mx * maxS;
      const acc = this.grounded ? (ice ? 420 : 3000) : 1500;
      const dec = this.grounded ? (ice ? 260 : 3400) : 500;
      const rate = (Math.abs(target) > Math.abs(this.vx) || sgn(target) !== sgn(this.vx)) && target !== 0 ? acc : dec;
      if (this.vx < target) this.vx = Math.min(target, this.vx + rate * dt);
      else if (this.vx > target) this.vx = Math.max(target, this.vx - rate * dt);
      this.vy = Math.min(1500, this.vy + GRAV * dt);
    }
    // direção
    if (!stunned && !frozen && this.atkT < 0) {
      if (I.face) this.facing = I.face; else if ((I.aimX || I.aimY) && Math.abs(I.aimX) > 0.2) this.facing = I.aimX > 0 ? 1 : -1; else if (Math.abs(mx) > 0.25) this.facing = mx > 0 ? 1 : -1;
    }
    // pulo
    if (I.jumpP) this.jbuf = 0.14;
    this.jbuf -= dt; this.coyote -= dt;
    if (this.grounded) { this.coyote = 0.1; this.airJumps = 1; }
    if (!frozen && !stunned && this.dashT <= 0 && this.jbuf > 0) {
      if (I.my > 0.6 && this.plat && !this.plat.solid) { this.dropT = 0.28; this.vy = 120; this.jbuf = 0; this.grounded = false; this.plat = null; }
      else if (this.coyote > 0) { this.vy = -840; this.jbuf = 0; this.coyote = 0; this.grounded = false; this.plat = null; SFX.play('jump'); m.fx.burst(this.x, this.y, 5, 160, 0.3, 3, '#ffffff66', 0, 1, -1.57, 2.2); }
      else if (this.airJumps > 0) { this.vy = -720; this.airJumps--; this.jbuf = 0; SFX.play('jump'); m.fx.ring(this.x, this.y, 30, 0.25, '#fff', 3); }
    }
    if (!I.jumpH && this.vy < -330 && this.dashT <= 0) this.vy += GRAV * 0.9 * dt;
    // especial: investida
    if (I.spP && !frozen && !stunned && this.specialCd <= 0 && this.dashT <= 0) {
      this.dashT = 0.2; this.specialCd = 3.5; this.dashDir = Math.abs(mx) > 0.3 ? sgn(mx) : this.facing; this.facing = this.dashDir; this.dashHit.length = 0; this.atkT = -1;
      SFX.play('dash'); m.fx.ring(this.x, this.y - 50, 50, 0.3, this.skin.accent, 4);
    }
    if (this.dashT > 0) this.dashAttack();
    const wasG = this.grounded, vyb = this.vy;
    moveBody(m, this, dt, this.dropT > 0);
    if (this.grounded && !wasG && vyb > 500) { this.landT = 0.1; SFX.play('land'); m.fx.burst(this.x, this.y, 6, 180, 0.35, 3, '#ffffff66', 0, 1, -1.57, 2.6); }
    if (this.grounded) this.phase += Math.abs(this.vx) * dt * 0.034;
    else this.phase += dt * 4;
    // aim
    this.aimOn = !!(I.aimX || I.aimY);
    this.aimA = this.aimOn ? clamp(Math.atan2(I.aimY, Math.max(0.06, Math.abs(I.aimX))), -1.5, 1.5) : clamp(I.my * 0.75, -0.75, 0.75);
    // armas
    if (!frozen && !stunned) this.weaponLogic(dt, I, w);
    // pegar / largar
    if (!frozen) this.pickupLogic(I);
    // pose + suavização
    this.pose(); this.smoothPose(1);
    const P = this.pts;
    this.capeStep(dt);
    // efeitos de cosméticos
    if (this.skin.fx === 'sparks' && Math.random() < 0.15) m.fx.add(P[HIP].x, P[HIP].y, rnd(-60, 60), rnd(-120, -20), 0.5, 2.5, '#ffe066', 200, 0);
    // celebrar
    if (this.celebrate && (this.winAnim === 3 || this.winAnim === 11) && this.grounded) { this.hopT -= dt; if (this.hopT <= 0) { this.vy = -520; this.hopT = 0.7; if (this.winAnim === 11) SFX.play('winv_mayhem'); } }
    if (this.celebrate) {
      const t0 = this.celeT, t1 = this.celeT += dt, wa = this.winAnim, cr = per => Math.floor(t0 / per) !== Math.floor(t1 / per);
      if (t0 === 0 && wa >= 4) SFX.play('winv_' + WIN_IDS[wa]);
      if (wa === 6 && cr(1.7778)) SFX.play('winv_thunder_hit');
      else if (wa === 9 && cr(2.2)) SFX.play('winv_burst_hit');
      else if (wa === 8 && cr(0.45)) SFX.play('winv_spin_tick');
    } else this.celeT = 0;
    if (this.energy >= 85 && m.cfg.awk.on) this.readyFx();
    this.checkBounds();
    if (this.zapCd < 0) { }
    I.jumpP = I.spP = I.dropP = I.awkP = false;
  }
  dashFx(dt) {
    if (Math.random() < 0.7) this.m.fx.add(this.x - this.dashDir * 10, this.y - rnd(10, 90), -this.dashDir * 80, 0, 0.3, 4, this.skin.accent, 0, 1);
  }
  dashAttack() {
    const m = this.m;
    for (const e of m.fighters) {
      if (e === this || !e.alive || e.invuln > 0 || this.dashHit.indexOf(e) >= 0) continue;
      if (Math.abs(e.cx - this.x) < 34 && Math.abs(e.cy - (this.y - 50)) < 60) {
        this.dashHit.push(e);
        e.hurt(6, this.dashDir * 880, -400, this, 'dash', e.cx, e.cy);
        SFX.play('thud');
      }
    }
  }

  weaponLogic(dt, I, w) {
    const m = this.m, wp = this.wp;
    // ataque corpo a corpo / soco
    if (w.type === 'melee') {
      if (this.atkT < 0 && I.atkH && this.cd <= 0) { this.atkT = 0; this.hitSet.length = 0; this.lunged = false; SFX.play(wp ? w.snd : 'punch'); }
      if (this.atkT >= 0) {
        this.atkT += dt;
        const u = this.atkT / w.swing;
        if (u >= 0.3 && !this.lunged) { this.lunged = true; if (this.grounded) this.vx += this.facing * (w.id === 'spear' ? 160 : 120); }
        if (u >= 0.3 && u <= 0.7) this.meleeHit(w);
        if (this.atkT >= w.swing) { this.atkT = -1; this.cd = w.cd; }
      }
    } else if (w.type === 'gun' && w.charge) {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0) { if (this.charge === 0) SFX.play('click'); this.charge = Math.min(1, this.charge + dt / 0.75); }
      else if (this.charge > 0) { if (this.charge > 0.15 && wp.ammo > 0) this.fireGun(w); this.charge = 0; this.cd = 0.25; }
    } else if (w.type === 'gun') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0 && !(w.proj === 'boomerang' && this.boomN > 0)) { this.fireGun(w); this.cd = w.cd; }
    } else if (w.type === 'beam') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0 && this.beamT <= 0) { this.beamT = w.dur; this.beamTick = 0; wp.ammo--; this.cd = w.cd; SFX.play('laser'); this.recoilT = 0.12; }
      if (this.beamT > 0) { this.beamT -= dt; this.beamTick -= dt; if (this.beamTick <= 0) { this.beamTick = w.tick; this.fireBeam(w); } }
    } else if (w.type === 'throw') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0) {
        wp.ammo--; this.cd = w.cd; this.throwT = 0.28; SFX.play('throw');
        const a = this.aimA - (this.aimOn ? 0.12 : 0.45), sp = 520;
        m.addGrenade(this.x + this.facing * 16, this.y - 85, this.facing * Math.cos(a) * sp + this.vx * 0.5, Math.sin(a) * sp, this, w.id);
      }
    } else if (w.type === 'mine') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0 && this.grounded) {
        wp.ammo--; this.cd = w.cd + 0.4; this.throwT = 0.2; SFX.play('beep');
        m.addMine(this.x + this.facing * 14, this.y, this);
      }
    }
    // arma vazia ou quebrada
    if (this.wp) {
      const ww = WEAPONS[this.wp.id];
      if (ww.type !== 'melee' && this.wp.ammo <= 0 && this.beamT <= 0 && this.atkT < 0) { this.emptyT += dt; if (this.emptyT > 0.5) { this.emptyT = 0; this.wp = null; m.fx.burst(this.x, this.y - 70, 6, 200, 0.4, 3, '#999', 500, 2); SFX.play('break'); } }
      else this.emptyT = 0;
    }
  }
  segOf(w) {
    const P = this.pts, h = P[HDR], fx = this.facing, a = this.wAng;
    let bx = h.x, by = h.y;
    const dx = fx * Math.cos(a), dy = Math.sin(a);
    if (w.id === 'fist') { bx = P[CHEST].x; by = P[CHEST].y + 6; return [bx, by, h.x + fx * 10, h.y]; }
    return [bx, by, bx + dx * w.len, by + dy * w.len];
  }
  meleeHit(w) {
    const m = this.m, sg = this.segOf(w);
    for (const e of m.fighters) {
      if (e === this || !e.alive || e.invuln > 0 || this.hitSet.indexOf(e) >= 0) continue;
      const hit = e.hitBySeg(sg[0], sg[1], sg[2], sg[3]);
      if (!hit) continue;
      this.hitSet.push(e);
      const k = w.knock, up = w.upKnock || 0.3;
      e.hurt(w.dmg * (hit.head ? 1.25 : 1), this.facing * k, -k * up, this, w.id, hit.x, hit.y);
      SFX.play(w.id === 'fist' ? 'punch' : (w.snd === 'thud' ? 'thud' : 'hit'));
      m.fx.burst(hit.x, hit.y, 8, 450, 0.3, 3, '#ffe9a8', 0, 0, this.facing > 0 ? 0 : Math.PI, 2.4);
      if (w.id === 'fist' || !w.heavy) { }
      if (w.dmg >= 20) m.hitstop = Math.max(m.hitstop, 0.06);
      if (this.wp && w.id !== 'fist') { this.wp.uses--; if (this.wp.uses <= 0) { m.fx.burst(this.x, this.y - 70, 10, 300, 0.5, 3, w.color, 500, 2); SFX.play('break'); this.wp = null; this.atkT = -1; return; } }
    }
  }
  hitBySeg(ax, ay, bx, by) {
    const P = this.pts;
    const idx = [HEAD, CHEST, HIP, KNL, KNR, FTL, FTR, ELL, ELR];
    for (const i of idx) {
      const r = i === HEAD ? 14 : (i === CHEST || i === HIP) ? 14 : 9;
      if (segCircle(ax, ay, bx, by, P[i].x, P[i].y, r)) return {x: P[i].x, y: P[i].y, head: i === HEAD};
    }
    const mx = (P[CHEST].x + P[HIP].x) / 2, my = (P[CHEST].y + P[HIP].y) / 2;
    if (segCircle(ax, ay, bx, by, mx, my, 14)) return {x: mx, y: my, head: false};
    return null;
  }
  hitByCircle(px, py, qx, qy, r) {
    const P = this.pts;
    const idx = [HEAD, CHEST, HIP, KNL, KNR, FTL, FTR];
    for (const i of idx) {
      const rr = (i === HEAD ? 13 : (i === CHEST || i === HIP) ? 13 : 8) + r;
      if (segCircle(px, py, qx, qy, P[i].x, P[i].y, rr)) return {x: P[i].x, y: P[i].y, head: i === HEAD};
    }
    return null;
  }
  muzzle(w) {
    const h = this.pts[HDR], dx = this.facing * Math.cos(this.aimA), dy = Math.sin(this.aimA);
    return {x: h.x + dx * (w.muzzle || 30) * 0.7, y: h.y + dy * (w.muzzle || 30) * 0.7, dx, dy};
  }
  fireGun(w) {
    const m = this.m, wp = this.wp, mz = this.muzzle(w);
    const base = Math.atan2(mz.dy, mz.dx);
    const n = w.pellets || 1;
    let dmg = w.dmg, sp = w.speed;
    if (w.charge) { dmg = lerp(w.dmgMin, w.dmgMax, this.charge); sp = lerp(w.speedMin, w.speedMax, this.charge); }
    if (w.proj === 'boomerang') {
      this.boomN++;
      m.addProj({kind: 'boomerang', x: mz.x, y: mz.y, vx: mz.dx * w.speed, vy: mz.dy * w.speed, dx: mz.dx, dy: mz.dy, sp0: w.speed, life: w.life, age: 0, back: false, dmg: w.dmg, knock: w.knock, owner: this, wid: w.id, rot: 0, hit: [], ret: 0});
      wp.ammo--; this.recoilT = 0.1; SFX.play(w.snd); return;
    }
    for (let i = 0; i < n; i++) {
      const a = pelletA(base, i, n, w);
      const s = sp * (n > 1 ? rnd(0.9, 1.1) : 1);
      m.addProj({kind: w.proj, x: mz.x, y: mz.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: w.life || 1, dmg, knock: w.knock, owner: this, wid: w.id,
        grav: w.grav || 0, exp: w.expR ? {r: w.expR, dmg: w.expDmg} : null});
    }
    wp.ammo--;
    this.recoilT = 0.12;
    if (this.grounded) this.vx -= mz.dx * (w.recoil || 0) * 0.5; else this.vx -= mz.dx * (w.recoil || 0) * 0.2;
    if (w.cd > 0.1) m.fx.burst(mz.x, mz.y, 5, 380, 0.15, 3, '#ffe9a8', 0, 0, base, 0.7);
    if (w.proj === 'bullet') m.fx.add(this.x, this.y - 70, -this.facing * 60, -200, 0.5, 3, '#fbbf24', 1200, 2);
    if (w.cd > 0.1 || Math.random() < 0.25) SFX.play(w.snd);
  }
  fireBeam(w) {
    const m = this.m, mz = this.muzzle(w);
    let ex = mz.x + mz.dx * w.len, ey = mz.y + mz.dy * w.len;
    let tmin = 1;
    for (const p of m.plats) { if (!p.solid) continue; const t = segRect(mz.x, mz.y, ex, ey, p.x, p.y, p.w, p.h); if (t >= 0 && t < tmin) tmin = t; }
    ex = mz.x + (ex - mz.x) * tmin; ey = mz.y + (ey - mz.y) * tmin;
    m.fx.beam(mz.x, mz.y, ex, ey, 0.09, w.color);
    m.fx.burst(ex, ey, 2, 250, 0.2, 2, w.color2, 0, 0);
    for (const e of m.fighters) {
      if (e === this || !e.alive || e.invuln > 0) continue;
      const h = e.hitBySeg(mz.x, mz.y, ex, ey);
      if (h) e.hurt(w.dmg, mz.dx * w.knock, -w.knock * 0.4 - 40, this, w.id, h.x, h.y);
    }
  }

  pickupLogic(I) {
    const m = this.m;
    if (I.dropP) {
      let near = null;
      for (const it of m.items) if (it.noPick <= 0 && Math.abs(it.x - this.x) < 44 && it.y > this.y - BH - 10 && it.y < this.y + 20) { near = it; break; }
      if (this.wp && near) { const mine = this.wp; this.wp = null; this.takeItem(near); m.addItem(mine.id, this.x, this.y - 70, -this.facing * 120, -300, mine.ammo, mine.uses, 0.7); }
      else if (this.wp) this.dropWeapon(true);
      else if (near) this.takeItem(near);
      return;
    }
    if (!this.wp) {
      for (const it of m.items) {
        if (it.noPick > 0) continue;
        if (Math.abs(it.x - this.x) < 38 && it.y > this.y - BH - 12 && it.y < this.y + 22) { this.takeItem(it); break; }
      }
    }
  }
  takeItem(it) {
    this.wp = {id: it.id, ammo: it.ammo, uses: it.uses};
    it.dead = true; this.atkT = -1; this.charge = 0;
    SFX.play('pickup');
    this.m.fx.ring(it.x, it.y, 36, 0.3, WEAPONS[it.id].color, 3);
    this.m.fx.burst(it.x, it.y, 8, 260, 0.4, 3, WEAPONS[it.id].color, 0, 0);
  }

  // ----- ragdoll verlet
  stepRagdoll(dt) {
    const P = this.pts, g = GRAV * dt * dt, damp = 0.9985;
    for (let i = 0; i < 11; i++) {
      const p = P[i];
      const vx = (p.x - p.px) * damp, vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + g;
    }
    for (let it = 0; it < 6; it++) {
      for (let c = 0; c < CONS.length; c++) {
        const k = CONS[c], a = P[k[0]], b = P[k[1]];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if (k[4] && d >= k[2]) continue;
        const diff = (d - k[2]) / d * 0.5 * k[3];
        a.x += dx * diff; a.y += dy * diff; b.x -= dx * diff; b.y -= dy * diff;
      }
      this.ragCollide();
    }
  }
  ragCollide() {
    const P = this.pts, plats = this.m.plats;
    for (let i = 0; i < 11; i++) {
      const p = P[i], r = PR[i];
      for (let j = 0; j < plats.length; j++) {
        const pl = plats[j], fr = pl.ice ? 0.995 : 0.82;
        if (pl.solid) {
          const x0 = pl.x - r, x1 = pl.x + pl.w + r, y0 = pl.y - r, y1 = pl.y + pl.h + r;
          if (p.x > x0 && p.x < x1 && p.y > y0 && p.y < y1) {
            const dl = p.x - x0, dr = x1 - p.x, du = p.y - y0, dd = y1 - p.y, mn = Math.min(dl, dr, du, dd);
            if (mn === du) { const v = p.y - p.py; p.y = y0; p.py = p.y + v * 0.12; p.px = p.x - (p.x - p.px) * fr; if (pl.move) { p.x += pl.dx; p.px += pl.dx; p.y += pl.dy; p.py += pl.dy; } }
            else if (mn === dd) { const v = p.y - p.py; p.y = y1; p.py = p.y + v * 0.2; }
            else if (mn === dl) { const v = p.x - p.px; p.x = x0; p.px = p.x + v * 0.3; }
            else { const v = p.x - p.px; p.x = x1; p.px = p.x + v * 0.3; }
          }
        } else if (p.x > pl.x - 2 && p.x < pl.x + pl.w + 2 && p.y > pl.y - r && p.py <= pl.y - r + 4 + Math.max(0, pl.dy || 0)) {
          const v = p.y - p.py; p.y = pl.y - r; p.py = p.y + v * 0.1; p.px = p.x - (p.x - p.px) * fr;
          if (pl.move) { p.x += pl.dx; p.px += pl.dx; p.y += pl.dy; p.py += pl.dy; }
        }
      }
    }
  }
  checkBounds() {
    if (!this.alive) return;
    const m = this.m, a = m.arena, hx = this.cx, hy = this.ragdoll ? this.pts[HIP].y : this.y;
    if (hy > a.killY || hx < -170 || hx > WORLD_W + 170 || hy < -900) {
      const lava = a.lavaY && hy > a.lavaY - 10;
      if (lava) { m.fx.burst(hx, a.lavaY, 24, 500, 0.8, 5, '#ff7a1a', 600, 0, -1.57, 1.6); m.fx.ring(hx, a.lavaY, 90, 0.5, '#ff7a1a', 6); }
      this.fell = true;
      this.die(0, 0, null, null, 'fall');
    }
  }
}

function shadeHex(h) { const n = parseInt(h.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(v * 0.72))); return '#' + ((1 << 24) | (f(r) << 16) | (f(g) << 8) | f(b)).toString(16).slice(1); }
// ---------- Partida ----------
class Match {
  constructor(cfg, env) {
    env = env || {};
    cfg.awk = cfg.awk || {on: false, charge: 'normal', dmg: 'normal'};
    this.cfg = cfg; this.env = env; this.arena = ARENAS[cfg.arena] || ARENAS.neon;
    this.envMul = (cfg.hp || 100) >= 200 ? AWK.weaponMul : 1;
    this.cine = {dim: 0, tDim: 0, flash: 0, flashC: '#fff', zoom: 1, tZoom: 1, zp: 0, zx: 640, zy: 360, cx: 640, cy: 360, light: 0, tLight: 0, lightC: '#fff', dist: 0, tDist: 0, dx: 0, dy: 0, dr: 240, dtype: 0, kick: 0, rot: 0, shocks: [], beams: [], camFx: cfg.camFx !== false};
    this.plats = this.arena.plats.map(p => { const q = Object.assign({}, p); q.bx = p.x; q.by = p.y; q.dx = 0; q.dy = 0; return q; });
    this.fx = new FX(); this.fx.shakeOn = env.shake !== false;
    this.fx.max = env.fxMax || 420;
    this.items = []; this.projs = []; this.fighters = []; this.bombs = []; this.mines = [];
    this.time = 0; this.t = 0; this.hitstop = 0; this.timeScale = 1;
    this.ended = false; this.endT = 0; this.result = null; this.cdT = 3; this.goT = 0; this.lastN = 4; this.frozen = true;
    this.spawnT = 1.2; this.recentX = []; this.fireT = 2; this.killFeed = [];
    this.state = 'countdown';
    this.buildFighters();
    const training = this.arena.training;
    const chaosLike = cfg.mode === 'chaos' || cfg.mode === 'online';
    this.maxItems = cfg.weapons === false ? 0 : (chaosLike ? 6 : 4);
    this.spawnMin = training ? 2 : (chaosLike ? 2.2 : 3.5); this.spawnMax = training ? 4 : (chaosLike ? 4.5 : 6.5);
    if (cfg.mode === 'menu') { this.state = 'play'; this.frozen = false; this.cdT = 0; this.spawnMin = 2; this.spawnMax = 4; }
    this.fatMode = cfg.mode === 'fatality'; this.fat = null;
    if (cfg.mode === 'preview' || cfg.mode === 'awkprev' || this.fatMode) { this.state = 'play'; this.frozen = false; this.cdT = 0; }
    if (env.netClient) this.frozen = true;
    else if (cfg.mode !== 'preview' && cfg.mode !== 'awkprev' && !this.fatMode) for (let i = 0; i < 2; i++) this.spawnWeapon();
  }
  buildFighters() {
    const cfg = this.cfg, env = this.env, sp = this.arena.spawns, inp = env.inputs || [newInput(), newInput()];
    const mkAI = (f, pers, d) => { f.brain = new Brain(f, pers, d); };
    const mine = env.skin || Object.assign({}, ENEMY_SKINS[0], {color: '#3b82f6'});
    const enemySkins = ENEMY_SKINS.map(s => Object.assign({}, s));
    for (const s of enemySkins) if (s.color.toLowerCase() === mine.color.toLowerCase()) s.color = '#e11d48';
    if (cfg.mode !== 'awkprev' && cfg.mode !== 'preview' && cfg.mode !== 'fatality') for (const s of enemySkins) if (Math.random() < 0.45) { // adversários às vezes usam skins prontas
      const ids = SKIN_IDS.filter(x => SKINS[x].preset && SKINS[x].preset.color.toLowerCase() !== mine.color.toLowerCase()), k = ids[(Math.random() * ids.length) | 0];
      Object.assign(s, {style: SKINS[k].style || ''}, SKINS[k].preset);
    }
    const lives = cfg.format === 'stock' ? (cfg.lives || 3) : 1;
    let id = 0;
    const mk = (o) => {
      o.id = id++; const f = new Fighter(this, o);
      if (cfg.hp && cfg.mode !== 'chaos') { f.maxhp = f.hp = cfg.hp; if (cfg.hp >= 200) f.dmgMul = AWK.weaponMul; }
      this.fighters.push(f); return f;
    };
    if (cfg.mode === 'duel_cpu') {
      mk({slot: 0, name: 'JOGADOR', tag: 'P1', tcolor: '#3b82f6', skin: mine, human: true, input: inp[0], spawn: sp[0], lives});
      enemySkins[0].awk = pick(AWK_IDS);
      const c = mk({slot: -1, name: 'CPU', tag: 'CPU', tcolor: '#ef4444', skin: enemySkins[0], spawn: sp[1], lives}); mkAI(c, 'hunter', cfg.diff);
    } else if (cfg.mode === 'duel_local') {
      mk({slot: 0, name: 'JOGADOR 1', tag: 'P1', tcolor: '#3b82f6', skin: mine, human: true, input: inp[0], spawn: sp[0], lives});
      let s2 = enemySkins[0]; s2.color = '#ef4444'; if (mine.color.toLowerCase() === '#ef4444') s2.color = '#e11d48';
      if (env.skin2) { s2 = Object.assign({}, env.skin2); if (s2.color.toLowerCase() === mine.color.toLowerCase()) s2.color = shadeHex(s2.color); }
      mk({slot: 1, name: 'JOGADOR 2', tag: 'P2', tcolor: '#ef4444', skin: s2, human: true, input: inp[1], spawn: sp[1], lives});
    } else if (cfg.mode === 'chaos') {
      const spawns = sp.slice().sort(() => Math.random() - 0.5);
      mk({slot: 0, name: 'JOGADOR', tag: 'P1', tcolor: '#3b82f6', skin: mine, human: true, input: inp[0], spawn: spawns[0], lives});
      const defs = [['HUNTER', 'hunter', '#ef4444'], ['TACTICIAN', 'tactician', '#22c55e'], ['CHAOS', 'chaos', '#facc15']];
      defs.forEach((d, i) => { const f = mk({slot: -1, name: d[0], tag: d[0], tcolor: d[2], skin: enemySkins[i + (i === 2 ? 1 : 0)], spawn: spawns[i + 1], lives}); mkAI(f, d[1], cfg.diff === undefined ? 1 : cfg.diff); });
    } else if (cfg.mode === 'online') {
      const spawns = sp.slice().sort(() => Math.random() - 0.5), me = env.netMe;
      cfg.players.forEach((p, i) => {
        const f = mk({slot: p.pid === me ? 0 : -1, name: p.name, tag: p.name, tcolor: p.color, skin: p.skin, human: true, input: env.netClient ? newInput() : (p.pid === 0 ? inp[0] : (env.netInputs && env.netInputs[p.pid]) || newInput()), spawn: spawns[i % spawns.length], lives});
        f.netPid = p.pid; f.mine = p.pid === me;
      });
    } else if (cfg.mode === 'menu') {
      const a = mk({slot: -1, name: '', skin: enemySkins[0], spawn: sp[0], lives: 999}); mkAI(a, 'hunter', 1);
      const b = mk({slot: -1, name: '', skin: Object.assign({}, enemySkins[2]), spawn: sp[1], lives: 999}); mkAI(b, 'chaos', 1);
      const c = mk({slot: -1, name: '', skin: Object.assign({}, mine, {color: '#3b82f6'}), spawn: sp[2], lives: 999}); mkAI(c, 'tactician', 1);
    } else if (cfg.mode === 'awkprev') {
      const hero = mk({slot: 0, name: '', skin: mine, human: true, input: newInput(), spawn: {x: 430, y: 600}, lives: 1});
      const dummy = mk({slot: -1, name: '', skin: Object.assign({}, ENEMY_SKINS[0]), spawn: {x: 800, y: 600}, lives: 1});
      hero.facing = 1; dummy.facing = -1; hero.maxhp = hero.hp = dummy.maxhp = dummy.hp = 300;
    } else if (cfg.mode === 'fatality') {
      const hero = mk({slot: 0, name: env.heroName || '', skin: mine, human: false, input: newInput(), spawn: {x: 400, y: 600}, lives: 1});
      const vic = mk({slot: 1, name: env.vicName || '', skin: env.skin2 || Object.assign({}, ENEMY_SKINS[0]), human: false, input: newInput(), spawn: {x: 800, y: 600}, lives: 1});
      hero.facing = 1; vic.facing = -1; hero.fatRole = 'hero'; vic.fatRole = 'victim';
    } else if (cfg.mode === 'preview') {
      mk({slot: 0, name: '', skin: mine, human: true, input: newInput(), spawn: {x: 640, y: 600}, lives: 1});
    }
    this.fighters.forEach((f, i) => { f.facing = f.x < WORLD_W / 2 ? 1 : -1; });
  }
  onKill(killer, victim, wid) {
    this.killFeed.push({k: killer, v: victim, t: this.time});
    if (this.killFeed.length > 4) this.killFeed.shift();
  }
  // ---- consultas para IA
  platBelow(x, y, maxDrop) {
    let best = null, by = 1e9;
    for (const p of this.plats) {
      if (x < p.x - 2 || x > p.x + p.w + 2) continue;
      if (p.y >= y - 4 && p.y - y <= maxDrop && p.y < by) { by = p.y; best = p; }
    }
    if (best && this.arena.lavaY && best.y > this.arena.lavaY) return null;
    return best;
  }
  groundAhead(x, y, dir) { return !!this.platBelow(x + dir * 44, y - 10, 340); }
  canCross(x, y, dir) {
    for (const p of this.plats) {
      if (p.y < y - 165 || p.y > y + 340) continue;
      if (this.arena.lavaY && p.y > this.arena.lavaY) continue;
      const near = dir > 0 ? p.x - x : x - (p.x + p.w);
      const far = dir > 0 ? p.x + p.w - x : x - p.x;
      if (far > 8 && near <= 240 && near > -4) return true;
    }
    return false;
  }
  los(x1, y1, x2, y2) {
    for (const p of this.plats) if (p.solid && segRect(x1, y1, x2, y2, p.x, p.y, p.w, p.h) >= 0) { if (p.h <= 140 && p.w <= 400) return false; }
    return true;
  }
  danger(x, y) {
    const a = this.arena;
    if (a.zaps) for (const z of a.zaps) { const ph = this.time % z.period; if (ph > z.period - z.on - 1.0 && x > z.x - 30 && x < z.x + z.w + 30 && y > z.y - 20 && y < z.y + z.h + 40) return true; }
    for (const mi of this.mines) if (mi.armed && Math.abs(mi.x - x) < 80 && Math.abs(mi.y - y) < 60) return true;
    for (const b of this.bombs) if (Math.abs(b.x - x) < 130 && Math.abs(b.y - y) < 130) return true;
    for (const pr of this.projs) if (!pr.owner && Math.abs(pr.x - x) < 70 && pr.y < y + 30 && pr.y > y - 220) return true;
    return false;
  }
  safeCenters() {
    if (this._sc) return this._sc;
    this._sc = this.arena.plats.filter(p => p.w >= 100 && !p.move && p.x > -10 && p.x + p.w < WORLD_W + 10).map(p => ({x: p.x + p.w / 2, y: p.y}));
    return this._sc;
  }
  nearestSafe(x, y) {
    let b = null, bd = 1e9;
    for (const c of this.safeCenters()) { const d = Math.abs(c.x - x) + Math.max(0, c.y - y) * 0.5; if (d < bd) { bd = d; b = c; } }
    return b || {x: WORLD_W / 2, y: 400};
  }

  // ---- itens, projéteis
  addItem(id, x, y, vx, vy, ammo, uses, noPick) {
    if (this.items.length > 14) return null;
    const w = WEAPONS[id];
    const it = {id, x, y, vx, vy, w: 30, h: 14, bounce: 0.35, rot: rnd(-1, 1), vr: rnd(-6, 6), life: 18, noPick: noPick || 0.3, dead: false,
      ammo: ammo !== undefined && ammo !== null ? ammo : (w.ammo || 0), uses: uses !== undefined && uses !== null ? uses : (w.uses || 0), grounded: false, plat: null, wall: 0};
    this.items.push(it); return it;
  }
  pickX() {
    const cands = this.arena.plats.filter(p => p.w >= 90 && p.x > -10 && p.x + p.w < WORLD_W + 10);
    let best = WORLD_W / 2, bs = -1;
    for (let k = 0; k < 8; k++) {
      const tw = cands.reduce((s, p) => s + p.w, 0); let r = Math.random() * tw, pl = cands[0];
      for (const p of cands) { r -= p.w; if (r <= 0) { pl = p; break; } }
      const x = pl.x + 25 + Math.random() * (pl.w - 50);
      let md = 1e9; for (const rx of this.recentX) md = Math.min(md, Math.abs(rx - x));
      if (md > bs) { bs = md; best = x; }
    }
    this.recentX.push(best); if (this.recentX.length > 3) this.recentX.shift();
    return best;
  }
  spawnWeapon() {
    if (this.items.length >= this.maxItems) return;
    let tot = 0; for (const id of WEAPON_IDS) tot += WEAPONS[id].rar;
    let r = Math.random() * tot, id = WEAPON_IDS[0];
    for (const k of WEAPON_IDS) { r -= WEAPONS[k].rar; if (r <= 0) { id = k; break; } }
    const x = this.pickX();
    this.addItem(id, x, -50, rnd(-20, 20), 0, null, null, 0.2);
    this.fx.ring(x, 20, 40, 0.5, WEAPONS[id].color, 3);
    SFX.play('spawn');
  }
  addProj(p) { if (this.projs.length < 80) this.projs.push(p); }
  addGrenade(x, y, vx, vy, owner, wid) {
    wid = wid || 'grenade';
    this.bombs.push({x, y, vx, vy, w: 14, h: 14, bounce: 0.45, wid, fuse: WEAPONS[wid].fuse, owner, grounded: false, plat: null, wall: 0, rot: 0});
  }
  addMine(x, y, owner) {
    if (this.mines.length > 8) this.mines.shift();
    this.mines.push({x, y, vx: 0, vy: 0, w: 18, h: 8, bounce: 0, armT: WEAPONS.mine.arm, armed: false, owner, life: 25, grounded: false, plat: null, wall: 0});
  }
  explode(x, y, R, dmg, knock, owner, wid) {
    const fx = this.fx;
    fx.burst(x, y, 26, 620, 0.7, 6, '#ff9a2e', 300, 0);
    fx.burst(x, y, 16, 420, 0.9, 10, '#444', -100, 1);
    fx.burst(x, y, 12, 700, 0.4, 3, '#fff2a8', 0, 0);
    fx.ring(x, y, R * 1.3, 0.4, '#ffd27a', 7); fx.ring(x, y, R * 0.8, 0.3, '#fff', 4);
    fx.addShake(R / 9); fx.flash = 0.08; this.hitstop = Math.max(this.hitstop, 0.04);
    SFX.play('explosion');
    for (const f of this.fighters) {
      if (!f.alive || f.invuln > 0) continue;
      const dx = f.cx - x, dy = f.cy - y, d = Math.hypot(dx, dy);
      if (d > R + 20) continue;
      const k = clamp(1 - d / (R + 20), 0.1, 1);
      const nx = dx / (d || 1), ny = dy / (d || 1);
      const self = f === owner ? 0.6 : 1;
      f.hurt(dmg * (0.4 + 0.6 * k) * self, nx * knock * (0.5 + k), ny * knock * (0.5 + k) - 260, owner, wid, f.cx, f.cy);
      if (f.alive && !f.ragdoll) f.toRagdoll(nx * knock * (0.5 + k), ny * knock * (0.5 + k) - 260, 0.8 + k * 0.8);
    }
    for (const it of this.items) { const dx = it.x - x, dy = it.y - y, d = Math.hypot(dx, dy); if (d < R * 1.4) { it.vx += dx / (d || 1) * 500; it.vy -= 300; } }
  }

  respawn(f) {
    const sp = this.arena.spawns; let best = sp[0], bd = -1;
    const alive = this.fighters.filter(e => e !== f && e.alive);
    for (const s of sp) {
      let md = 1e9; for (const e of alive) md = Math.min(md, Math.hypot(e.cx - s.x, e.cy - s.y));
      if (this.danger(s.x, s.y - 40)) md = -1;
      for (const pr of this.projs) if (Math.hypot(pr.x - s.x, pr.y - s.y) < 160) md = Math.min(md, 20);
      if (md > bd) { bd = md; best = s; }
    }
    if (bd < 0 && this.cfg.mode !== 'menu') { f.respawnT = 0.25; return; }
    f.reset(best, false); f.facing = best.x < WORLD_W / 2 ? 1 : -1;
    this.fx.ring(best.x, best.y - 50, 70, 0.5, f.tcolor, 5); this.fx.burst(best.x, best.y - 50, 14, 300, 0.6, 3, f.tcolor, 0, 0);
    SFX.play('spawn');
  }

  update(dt) {
    if (this.env.netClient) return this.updateNetClient(dt);
    this.fx.update(dt);
    if (this.hitstop > 0) { this.hitstop -= dt; return; }
    this.time += dt;
    // plataformas móveis
    for (const p of this.plats) {
      if (!p.move) continue;
      const ox = p.x, oy = p.y, mv = p.move;
      p.x = p.bx + Math.sin(this.time * mv.spd + mv.ph) * mv.ax;
      p.y = p.by + Math.sin(this.time * mv.spd + mv.ph) * mv.ay;
      p.dx = p.x - ox; p.dy = p.y - oy;
    }
    if (this.state === 'countdown') {
      this.cdT -= dt;
      const n = Math.ceil(this.cdT);
      if (n !== this.lastN) { this.lastN = n; if (n > 0) SFX.play('count'); else { SFX.play('go'); } }
      if (this.cdT <= 0) { this.state = 'play'; this.frozen = false; this.goT = 0.9; }
    } else {
      this.goT -= dt;
      if (this.state === 'play') this.t += dt;
    }
    if (!this.frozen || this.state === 'countdown') {
      // armas do céu
      if (!this.fatMode && this.state !== 'preview' && this.cfg.mode !== 'preview' && this.cfg.mode !== 'awkprev' && !this.ended) {
        this.spawnT -= dt;
        if (this.spawnT <= 0 && (this.state === 'play')) { this.spawnWeapon(); this.spawnT = rnd(this.spawnMin, this.spawnMax); }
      }
    }
    // perigos
    if (!this.fatMode) this.hazards(dt);
    // IA
    for (const f of this.fighters) if (f.brain) f.brain.update(dt, this);
    const cn = this.cine; cn.tDim = 0; cn.tZoom = 1; cn.tLight = 0; cn.tDist = 0;
    if (this.fatMode) this.fatUpdate(dt);
    for (const f of this.fighters) f.update(dt);
    this.updateCine(dt);
    this.fighterPush();
    this.updateItems(dt);
    this.updateProjs(dt);
    this.updateBombs(dt);
    this.updateMines(dt);
    // checagem de fim
    if (this.cfg.mode === 'awkprev') this.keepPreview();
    else if (!this.fatMode && this.state === 'play' && !this.ended && this.cfg.mode !== 'menu' && this.cfg.mode !== 'preview') this.checkEnd(dt);
    if (this.ended) {
      this.endT += dt / Math.max(0.2, this.timeScale);
      if (this.endT > 0.5) this.timeScale = Math.min(1, this.timeScale + dt * 0.5);
    }
    // intensidade musical
    if (this.cfg.mode !== 'menu' && !this.fatMode) {
      const hpLow = Math.min(...this.fighters.filter(f => f.alive).map(f => f.hp), 100);
      SFX.setIntensity(clamp(this.t / 90 + (100 - hpLow) / 140, 0, 1));
    }
  }
  hazards(dt) {
    const a = this.arena;
    if (a.fire && this.state === 'play') {
      this.fireT -= dt;
      if (this.fireT <= 0) { this.fireT = rnd(2.2, 3.6); this.addProj({kind: 'fire', x: rnd(120, 1160), y: -30, vx: rnd(-90, 90), vy: 420, life: 5, dmg: 14, knock: 520, owner: null, wid: 'fire', grav: 120, exp: null}); }
    }
    if (a.zaps && this.state === 'play') {
      for (const z of a.zaps) {
        const ph = this.time % z.period, on = ph > z.period - z.on;
        z.active = on; z.warn = !on && ph > z.period - z.on - 1.0;
        if (on) for (const f of this.fighters) {
          if (!f.alive || f.invuln > 0 || f.zapCd > 0) continue;
          if (f.cx > z.x && f.cx < z.x + z.w && f.y > z.y && f.y - 20 < z.y + z.h && !f.ragdoll) { f.zapCd = 0.7; f.hurt(10, (f.cx < z.x + z.w / 2 ? -1 : 1) * 500, -650, null, 'zap', f.cx, f.y - 30); SFX.play('zap'); this.fx.burst(f.cx, f.y - 20, 10, 400, 0.3, 3, '#a5f3fc', 300, 0); }
        }
      }
    }
  }
  fighterPush() {
    const F = this.fighters;
    for (let i = 0; i < F.length; i++) {
      const a = F[i]; if (!a.alive || a.ragdoll) continue;
      for (let j = i + 1; j < F.length; j++) {
        const b = F[j]; if (!b.alive || b.ragdoll) continue;
        const dx = b.x - a.x, ox = BW - Math.abs(dx);
        if (ox > 0 && Math.abs(a.y - b.y) < BH - 14) {
          const s = dx === 0 ? (i % 2 ? 1 : -1) : sgn(dx), push = ox * 0.5;
          a.x -= s * push; b.x += s * push;
        }
      }
    }
  }
  updateItems(dt) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.noPick -= dt; it.life -= dt;
      it.vy = Math.min(1400, it.vy + GRAV * 0.8 * dt);
      if (it.plat && it.plat.move) { it.x += it.plat.dx; it.y += it.plat.dy; }
      moveBody(this, it, dt, false);
      if (it.grounded) { it.vx *= Math.max(0, 1 - 7 * dt); it.vr = 0; it.rot *= 0.9; } else it.rot += it.vr * dt;
      if (it.dead || it.life <= 0 || it.y > this.arena.killY + 100 || it.x < -200 || it.x > WORLD_W + 200) {
        if (it.life <= 0 && !it.dead) this.fx.burst(it.x, it.y, 8, 200, 0.4, 3, WEAPONS[it.id].color, 0, 1);
        this.items.splice(i, 1);
      }
    }
  }
  updateProjs(dt) {
    const P = this.projs;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      if (p.kind === 'boomerang') { if (this.updateBoom(p, dt)) { if (p.owner) p.owner.boomN = Math.max(0, p.owner.boomN - 1); P.splice(i, 1); } continue; }
      const ox = p.x, oy = p.y;
      p.vy += (p.grav || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      let dead = p.life <= 0, hitW = false, tW = 2;
      for (const pl of this.plats) {
        if (!pl.solid) continue;
        const t = segRect(ox, oy, p.x, p.y, pl.x, pl.y, pl.w, pl.h);
        if (t >= 0 && t < tW) tW = t;
      }
      if (tW <= 1) { hitW = true; p.x = ox + (p.x - ox) * tW; p.y = oy + (p.y - oy) * tW; }
      // trilhas
      if (p.kind === 'rocket') { this.fx.add(p.x, p.y, rnd(-30, 30), rnd(-30, 30), 0.4, 5, '#999', 0, 1); this.fx.add(p.x, p.y, 0, 0, 0.15, 4, '#ffb347', 0, 0); }
      else if (p.kind === 'orb') this.fx.add(p.x, p.y, rnd(-20, 20), rnd(-20, 20), 0.3, 5, '#a78bfa', 0, 0);
      else if (p.kind === 'fire') { this.fx.add(p.x, p.y, rnd(-30, 30), -60, 0.35, 6, '#ff7a1a', 0, 0); }
      else if (p.kind === 'bullet') this.fx.add(p.x, p.y, 0, 0, 0.08, 2, '#fff3b0', 0, 0);
      // lutadores
      if (!hitW || true) {
        for (const f of this.fighters) {
          if (!f.alive || f.invuln > 0 || f === p.owner) continue;
          const r = p.kind === 'fire' ? 14 : (p.kind === 'orb' ? 8 : 2);
          const h = f.hitByCircle(ox, oy, p.x, p.y, r);
          if (h) {
            if (p.kind === 'rocket' || p.kind === 'orb') { this.explode(h.x, h.y, p.exp.r, p.exp.dmg, p.knock, p.owner, p.wid); dead = true; hitW = false; break; }
            const sp = Math.hypot(p.vx, p.vy) || 1, nx = p.vx / sp, ny = p.vy / sp;
            f.hurt(p.dmg * (h.head ? 1.3 : 1), nx * p.knock, ny * p.knock * 0.5 - 90, p.owner, p.wid, h.x, h.y);
            if (p.kind === 'fire') this.fx.burst(h.x, h.y, 10, 400, 0.4, 4, '#ff7a1a', 300, 0);
            dead = true; hitW = false; break;
          }
        }
      }
      if (hitW && !dead) {
        dead = true;
        if (p.kind === 'rocket' || p.kind === 'orb') this.explode(p.x, p.y, p.exp.r, p.exp.dmg, p.knock, p.owner, p.wid);
        else if (p.kind === 'fire') { this.fx.burst(p.x, p.y, 10, 300, 0.4, 4, '#ff7a1a', 300, 0); this.fx.ring(p.x, p.y, 50, 0.3, '#ff7a1a', 4); }
        else this.fx.burst(p.x, p.y, 5, 300, 0.25, 2.5, '#ffd9a0', 500, 0);
      }
      if (p.y > this.arena.killY + 80 || p.x < -300 || p.x > WORLD_W + 300 || p.y < -800) dead = true;
      if (p.life <= 0 && (p.kind === 'rocket' || p.kind === 'orb') && !hitW && p.exp) this.explode(p.x, p.y, p.exp.r, p.exp.dmg, p.knock, p.owner, p.wid);
      if (dead) P.splice(i, 1);
    }
  }
  // bumerangue: sai desacelerando, volta acelerando até o dono; acerta na ida e na volta
  updateBoom(p, dt) {
    const o = p.owner, ox = p.x, oy = p.y;
    p.age += dt; p.rot += dt * 22;
    if (!o || !o.alive || p.age > p.life) { this.fx.burst(p.x, p.y, 5, 200, 0.3, 3, '#f59e0b', 0, 0); return true; }
    if (!p.back) {
      const k = Math.max(0, 1 - p.age / 0.5), sp = p.sp0 * k;
      p.vx = p.dx * sp; p.vy = p.dy * sp;
      if (p.age >= 0.5) { p.back = true; p.hit.length = 0; p.ret = 0; }
    } else {
      p.ret += dt;
      const tx = o.cx - p.x, ty = (o.cy - 10) - p.y, d = Math.hypot(tx, ty) || 1, sp = Math.min(1250, 250 + p.ret * 1700);
      p.vx = tx / d * sp; p.vy = ty / d * sp;
      if (d < 34) { this.fx.ring(o.cx, o.cy, 28, 0.2, '#fbbf24', 3); SFX.play('click'); return true; }
    }
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (!p.back) { // parede: volta mais cedo
      for (const pl of this.plats) { if (pl.solid && segRect(ox, oy, p.x, p.y, pl.x, pl.y, pl.w, pl.h) >= 0 && segRect(ox, oy, p.x, p.y, pl.x, pl.y, pl.w, pl.h) <= 1) { p.back = true; p.hit.length = 0; p.ret = 0; this.fx.burst(p.x, p.y, 4, 260, 0.2, 2.5, '#ffd9a0', 300, 0); break; } }
    }
    if (((p.age * 30) | 0) % 2 === 0) this.fx.add(p.x, p.y, rnd(-20, 20), rnd(-20, 20), 0.18, 3, '#fbbf24', 0, 0);
    for (const f of this.fighters) {
      if (!f.alive || f.invuln > 0 || f === o || p.hit.includes(f)) continue;
      const h = f.hitByCircle(ox, oy, p.x, p.y, 13);
      if (h) {
        p.hit.push(f);
        const sp = Math.hypot(p.vx, p.vy) || 1;
        f.hurt(p.dmg * (p.back ? 0.8 : 1), p.vx / sp * p.knock, -120, o, p.wid, h.x, h.y);
        this.fx.burst(h.x, h.y, 6, 300, 0.25, 3, '#fbbf24', 200, 0);
      }
    }
    if (p.y > this.arena.killY + 80 || p.x < -300 || p.x > WORLD_W + 300 || p.y < -800) return true;
    return false;
  }
  updateBombs(dt) {
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const b = this.bombs[i];
      b.vy = Math.min(1400, b.vy + GRAV * dt); b.fuse -= dt; b.rot += b.vx * dt * 0.02;
      if (b.plat && b.plat.move) { b.x += b.plat.dx; b.y += b.plat.dy; }
      moveBody(this, b, dt, false);
      if (b.grounded) b.vx *= Math.max(0, 1 - 5 * dt);
      if (b.fuse < 0.6 && Math.random() < 0.3) this.fx.add(b.x, b.y - 10, 0, -20, 0.2, 3, '#ff4d4d', 0, 0);
      if (Math.random() < 0.3) this.fx.add(b.x, b.y - 8, rnd(-20, 20), -30, 0.25, 2, '#fbbf24', 0, 0);
      if (b.fuse <= 0 || b.y > this.arena.killY + 50) {
        if (b.fuse <= 0) { const bw = WEAPONS[b.wid || 'grenade']; this.explode(b.x, b.y - 8, bw.expR, bw.expDmg, bw.knock, b.owner, bw.id); }
        this.bombs.splice(i, 1);
      }
    }
  }
  updateMines(dt) {
    for (let i = this.mines.length - 1; i >= 0; i--) {
      const mi = this.mines[i];
      mi.vy = Math.min(1400, mi.vy + GRAV * dt); mi.life -= dt;
      moveBody(this, mi, dt, false);
      if (!mi.armed) { mi.armT -= dt; if (mi.armT <= 0) { mi.armed = true; SFX.play('beep'); } }
      let trig = false;
      if (mi.armed) for (const f of this.fighters) {
        if (!f.alive || f.invuln > 0) continue;
        if (Math.abs(f.cx - mi.x) < WEAPONS.mine.trig && f.y > mi.y - 8 && f.y - BH < mi.y && !f.ragdoll) { trig = true; break; }
      }
      if (trig) { this.explode(mi.x, mi.y - 6, WEAPONS.mine.expR, WEAPONS.mine.expDmg, WEAPONS.mine.knock, mi.owner, 'mine'); this.mines.splice(i, 1); }
      else if (mi.life <= 0 || mi.y > this.arena.killY + 50) this.mines.splice(i, 1);
    }
  }
  checkEnd(dt) {
    const F = this.fighters;
    const left = F.filter(f => !f.out);
    let timeUp = false;
    if (this.cfg.timeLimit > 0 && this.t >= this.cfg.timeLimit && left.length > 1) timeUp = true;
    if (left.length <= 1 || timeUp) {
      this.ended = true; this.timeScale = 0.35; this.state = 'ending';
      let w = left[0] || null, draw = false;
      if (timeUp) {
        // desempate: mais vidas, depois maior % de vida; empate => rodada extra / empate
        const sc = f => f.lives * 1000 + f.hp / f.maxhp * 100;
        const a = sc(left[0]), b = sc(left[1]);
        if (Math.abs(a - b) < 0.5) { w = null; draw = true; } else w = a > b ? left[0] : left[1];
        this.timeUp = true; this.frozen = true;
      }
      for (const f of F) if (f.awk) f.endAwk();
      if (w) { w.celebrate = true; w.winAnim = Math.max(0, WIN_IDS.indexOf(w.skin.win)); w.invuln = 99; }
      this.result = {winner: w, time: this.t, draw, timeUp};
      F.forEach(f => { if (!f.out) f.elimTime = this.t; });
      SFX.play(w && w.human ? 'win' : 'lose');
      this.endDelay = 2.2;
    }
  }
}
