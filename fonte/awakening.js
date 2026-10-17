'use strict';
/* STICK MAYHEM v1.1.0 — AWAKENING: energia, ativação e os 3 superataques (VOID / INFERNO / CELESTIAL)
   Estende Fighter e Match (engine.js). Os valores de balanceamento ficam em AWK (data.js). */

// tempos de cada sequência (segundos)
const AWK_T = {
  void:      {prep: 0.95, dash: 0.27, spd: 2100, hold: 0.30, rec: 0.65},
  inferno:   {prep: 0.85, dash: 0.26, spd: 1750, hold: 0.0,  rec: 0.70},
  celestial: {prep: 1.15, dash: 0.17, spd: 0,    hold: 0.30, rec: 1.00},
};
// keyframes de pose: [u, lean, crouch, stance, rx, ry, lx, ly, lift]  (mãos relativas ao peito, no espaço do "facing")
const KF = {
  void_prep:  [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.35, -4, 8, 14, -18, 0, 22, 4, 0], [0.75, -6, 13, 16, -24, -8, 24, 0, 0], [1, -8, 15, 17, -26, -10, 24, -2, 0]],
  void_dash:  [[0, 14, 10, 14, 30, 2, -14, 6, 12], [1, 18, 10, 16, 33, 0, -18, 8, 14]],
  void_hit:   [[0, 16, 6, 18, 34, -2, -16, 8, 6], [1, 12, 5, 16, 33, -2, -12, 8, 2]],
  void_rec:   [[0, 12, 5, 16, 33, -2, -12, 8, 2], [0.5, 5, 3, 10, 22, 12, -6, 16, 0], [1, 0, 0, 8, 12, 24, -4, 26, 0]],
  inf_prep:   [[0, 0, 0, 8, 18, 10, 10, 6, 0], [0.4, 3, 9, 14, 22, -6, 20, -8, 0], [0.8, 5, 13, 16, 26, -12, 22, -14, 0], [1, 6, 14, 17, 27, -14, 24, -14, 0]],
  inf_dash:   [[0, 15, 10, 15, 30, 0, 24, 4, 12], [1, 18, 10, 16, 32, -2, 26, 2, 14]],
  inf_jabR:   [[0, 14, 7, 16, 14, 0, 28, 0, 4], [0.5, 17, 7, 17, 34, -4, 18, 4, 4], [1, 14, 7, 16, 18, 0, 26, 0, 4]],
  inf_jabL:   [[0, 14, 7, 16, 28, 0, 14, 0, 4], [0.5, 17, 7, 17, 18, 4, 34, -4, 4], [1, 14, 7, 16, 26, 0, 18, 0, 4]],
  inf_fin:    [[0, 4, 12, 17, 20, 8, 20, 2, 0], [0.35, 18, 6, 20, 34, -26, 12, 8, 6], [1, 14, 5, 18, 32, -22, 8, 10, 4]],
  inf_rec:    [[0, 12, 5, 16, 32, -20, 8, 10, 2], [0.5, 5, 3, 10, 22, 8, 6, 18, 0], [1, 0, 0, 8, 12, 24, -4, 26, 0]],
  cel_prep:   [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.3, 0, -3, 10, 10, -22, -8, -22, 0], [0.6, -2, 3, 12, 14, -30, 4, -30, 0], [1, 0, 6, 12, 22, -6, 20, -4, 0]],
  cel_hit:    [[0, 8, 6, 18, 32, -10, 28, -6, 4], [1, 6, 4, 14, 30, -6, 24, -2, 2]],
  cel_rec:    [[0, 6, 4, 14, 30, -6, 24, -2, 2], [0.5, 2, 2, 10, 20, 8, 12, 12, 0], [1, 0, 0, 8, 12, 24, -4, 26, 0]],
};
function kfs(rows, u, o) {
  u = clamp(u, 0, 1);
  let i = 0; while (i < rows.length - 2 && u > rows[i + 1][0]) i++;
  const a = rows[i], b = rows[Math.min(i + 1, rows.length - 1)], span = b[0] - a[0] || 1, k = easeO(clamp((u - a[0]) / span, 0, 1));
  for (let j = 1; j < 9; j++) o[j] = a[j] + (b[j] - a[j]) * k;
  return o;
}
const _kf = new Array(9).fill(0);

Object.assign(Fighter.prototype, {
  readyFx() {
    const full = this.energy >= 100;
    if (Math.random() < (full ? 0.18 : 0.05)) { const C = AWK_TYPES[this.awkType] || AWK_TYPES.void; this.m.fx.add(this.x + rnd(-22, 22), this.y - rnd(0, 100), rnd(-15, 15), -rnd(40, 110), rnd(0.4, 0.8), rnd(1.6, 3), full ? C.c3 : C.c, 0, 2); }
  },
  foe() {
    let b = null, bd = 1e9;
    for (const e of this.m.fighters) { if (e === this || !e.alive) continue; const d = Math.abs(e.cx - this.x); if (d < bd) { bd = d; b = e; } }
    return b;
  },
  gainEnergy(eff, v, wid) {
    const m = this.m, A = m.cfg.awk;
    if (!A || !A.on || this.awk || wid === 'awk' || !this.alive || eff <= 0 || v.invuln > 0) return;
    this.chain = 0;                                              // quem revida zera a "surra" sofrida por si
    const now = m.time;
    if (now - v.chainT > AWK.chainWin) v.chain = 0; else v.chain++;
    v.chainT = now;
    const sc = Math.max(AWK.chainMin, 1 - AWK.chainDecay * v.chain);
    const was = this.energy;
    this.energy = Math.min(100, this.energy + eff * (100 / (AWK.needFrac * v.maxhp)) * (AWK.chargeMul[A.charge] || 1) * sc);
    if (this.energy >= 100 && was < 100) this.onEnergyFull();
  },
  onEnergyFull() {
    this.readyT = 1.2;
    if (this.human) { SFX.play('awk_ready'); this.m.fx.text(this.cx, this.cy - 90, 'AWAKENING!', AWK_TYPES[this.awkType].c); }
    this.m.fx.ring(this.cx, this.cy, 80, 0.5, AWK_TYPES[this.awkType].c, 5);
  },
  canAwk() {
    const m = this.m, A = m.cfg.awk;
    return !!(A && A.on && this.energy >= 100 && this.alive && !this.ragdoll && !this.awk && this.awkLock <= 0 && this.hitstun <= 0 &&
      this.getUpT <= 0 && !m.frozen && m.state === 'play' && !m.ended && !this.celebrate && this.foe());
  },
  startAwk() {
    const m = this.m, e = this.foe(), t = this.awkType in AWK_T ? this.awkType : 'void';
    this.energy = 0; this.readyT = 0;
    this.awk = {type: t, t: 0, lt: 0, ph: 'prep', hits: 0, hit: false, whiff: false, aim: e ? e.cx : this.x + this.facing * 300, tr: [], acc: 0, aura: 0, jab: 0, ex: 0, ey: 0, did: 0};
    for (let i = 0; i < 14; i++) this.awk.tr.push({x: 0, y: 0, a: 0});
    this.awk.trI = 0;
    if (typeof AWK2 !== 'undefined' && AWK2[t]) this.awk2Init(this.awk);
    if (e) this.facing = e.cx >= this.x ? 1 : -1;
    this.atkT = -1; this.charge = 0; this.beamT = 0; this.dashT = 0; this.cd = 0.2; this.hitstun = 0; this.vx *= 0.3;
    this.awkCount = (this.awkCount || 0) + 1;
    SFX.play('awk_' + t + '_charge');
    m.fx.text(this.cx, this.cy - 90, AWK_TYPES[t].name, AWK_TYPES[t].c);
  },
  endAwk() {
    if (!this.awk) return;
    this.awk = null; this.awkLock = AWK.lockT; this.dashT = 0;
    if (!this.ragdoll) { this.vx *= 0.3; }
  },
  // dano total do superataque (fração da vida máxima do alvo, com a configuração de dano e o teto)
  awkDamage(e, share) {
    const A = this.m.cfg.awk, frac = Math.min(AWK.maxFrac, AWK_TYPES[this.awk.type].frac * (AWK.dmgMul[A.dmg] || 1));
    return frac * e.maxhp * share;
  },
  // evita eliminação imediata por queda: perto da borda sem chão, o golpe lança mais para cima/para dentro
  safeK(e, dir, kx, ky) {
    const m = this.m;
    const edge = e.cx + dir * 420;
    if (edge < 40 || edge > WORLD_W - 40) {
      const below = m.platBelow(e.cx + dir * 300, e.cy, 600);
      if (!below) { return [kx * 0.35, ky * 1.1]; }
    }
    return [kx, ky];
  },
  awkRegion(e, rx, ry) { return e && e.alive && Math.abs(e.cx - this.x) < rx && Math.abs(e.cy - (this.y - 50)) < ry; },
  awkStrike(e, o) {
    // o: {rx, ry, share, kx, ky, blast, blastShare, wid}
    const m = this.m, dir = this.facing; let hit = false;
    if (!e || !e.alive) return false;
    const inMain = this.awkRegion(e, o.rx, o.ry);
    const d = Math.hypot(e.cx - this.x, e.cy - (this.y - 50));
    if (inMain) {
      const k = this.safeK(e, dir, dir * o.kx, o.ky);
      hit = e.hurt(this.awkDamage(e, o.share), k[0], k[1], this, 'awk', e.cx, e.cy);
      if (hit && e.alive && !e.ragdoll && Math.hypot(k[0], k[1]) > 300) e.toRagdoll(k[0], k[1], 0.9 + Math.hypot(k[0], k[1]) / 1800);
    } else if (o.blast && d < o.blast) {
      const f = 1 - d / o.blast, k = this.safeK(e, dir, dir * o.kx * 0.5, o.ky * 0.6);
      hit = e.hurt(this.awkDamage(e, o.blastShare * (0.5 + 0.5 * f)), k[0], k[1], this, 'awk', e.cx, e.cy);
      if (hit && e.alive && !e.ragdoll) e.toRagdoll(k[0], k[1], 0.7);
    }
    return hit;
  },
  trailPush(a) {
    const t = a.tr[a.trI]; a.trI = (a.trI + 1) % a.tr.length; t.x = this.x; t.y = this.y - 55; t.a = 1;
  },
  fxPull(x, y, R, n, col, life) {
    const fx = this.m.fx;
    for (let i = 0; i < n; i++) {
      const th = Math.random() * 6.283, r = R * (0.6 + Math.random() * 0.5);
      fx.add(x + Math.cos(th) * r, y + Math.sin(th) * r * 0.8, -Math.cos(th) * r / life, -Math.sin(th) * r * 0.8 / life, life, 2.4, col, 0, 0);
    }
  },
  updateAwk(dt) {
    const a = this.awk, m = this.m, T = AWK_T[a.type], C = AWK_TYPES[a.type], c = m.cine, e = this.foe();
    if (!(m.state === 'play') || m.ended || a.t > AWK.maxT || (m.frozen && !m.ended)) { this.endAwk(); return; }
    a.t += dt; a.lt += dt;
    for (const p of a.tr) p.a = Math.max(0, p.a - dt * 4);
    let grav = true, dashing = false;
    const hx = this.pts[HDR].x, hy = this.pts[HDR].y;
    const cx = this.x, cy = this.y - 55;
    const ph = a.ph;
    if (ph === 'prep') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 14);
      const u = clamp(a.lt / T.prep, 0, 1);
      a.aura = Math.min(1, a.aura + dt * 2.2);
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1 + 0.14 * easeO(u));
      if (e) { this.facing = e.cx >= this.x ? 1 : -1; }
      if (a.type === 'void') {
        c.tDim = 0.58 * Math.min(1, u * 2.2); c.tDist = u > 0.35 ? clamp((u - 0.35) * 1.5, 0, 0.85) : 0; c.dx = cx; c.dy = cy; c.dr = 220; c.dtype = 0;
        a.acc += dt * (30 + 70 * u); while (a.acc >= 1) { a.acc--; this.fxPull(cx, cy, 90 + 70 * (1 - u), 1, Math.random() < 0.3 ? '#f0abfc' : '#a78bfa', 0.34); }
      } else if (a.type === 'inferno') {
        c.tDim = 0.22 * u; c.tDist = u > 0.4 ? clamp((u - 0.4) * 1.2, 0, 0.7) : 0; c.dx = cx; c.dy = cy - 20; c.dr = 230; c.dtype = 1;
        a.acc += dt * (40 + 80 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-26, 26), this.y - rnd(0, 30), rnd(-40, 40), -rnd(120, 300) * (0.5 + u), rnd(0.3, 0.6), rnd(2, 4), Math.random() < 0.5 ? '#fb923c' : '#fde047', -80, 0); }
      } else {
        c.tLight = 0.42 * Math.min(1, u * 1.6); c.lightC = '#fff7d6';
        a.acc += dt * (50 + 60 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-50, 50), this.y - rnd(0, 110), rnd(-20, 20), -rnd(60, 200), rnd(0.5, 0.9), rnd(2, 3.5), Math.random() < 0.5 ? '#fde68a' : '#e0f2fe', -30, 1); }
        if (u > 0.55 && !a.did) { a.did = 1; SFX.play('awk_celestial_ring'); m.addShock(cx, cy, 20, 230, 0.5, '#fde68a', 6); m.addShock(cx, cy, 20, 170, 0.4, '#ffffff', 4);
          if (e && Math.abs(e.cx - cx) < 230 && !e.awk) { e.vx += Math.sign(e.cx - cx || 1) * 380; e.vy = Math.min(e.vy, -260); e.hitstun = Math.max(e.hitstun, 0.12); } }
      }
      if (a.lt >= T.prep) {
        a.ph = a.type === 'celestial' ? 'blink' : 'dash'; a.lt = 0; a.aim = e ? e.cx : this.x + this.facing * 400;
        SFX.play('awk_' + a.type + '_dash');
        if (a.type === 'celestial') { a.sx = this.x; a.sy = this.y; this.awkBlinkTarget(a, e); }
      }
    } else if (ph === 'dash') {
      dashing = true; grav = false;
      if (e && a.lt < T.dash - 0.05) a.aim = e.cx;
      const dx = a.aim - this.x, dir = dx >= 0 ? 1 : -1;
      this.facing = dir; this.vx = dir * T.spd; this.vy = 0;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1);
      if (a.type === 'void') { c.tDim = 0.42; c.tDist = 0.5; c.dx = cx; c.dy = cy; c.dr = 220; c.dtype = 0; m.fx.add(cx, cy + rnd(-30, 30), -dir * rnd(80, 240), rnd(-40, 40), 0.35, rnd(2, 4), Math.random() < 0.5 ? '#a78bfa' : '#1e0b3a', 0, 1); }
      else { c.tDim = 0.18; m.fx.add(cx, cy + rnd(-30, 30), -dir * rnd(100, 320), rnd(-60, 20), 0.3, rnd(2, 4), Math.random() < 0.5 ? '#fb923c' : '#fde047', -60, 1); }
      const contact = e && Math.abs(e.cx - this.x) < 46;
      if (contact || a.lt >= T.dash) {
        this.vx = 0; a.ph = 'strike'; a.lt = 0; a.hits = 0; a.hit = false;
        if (a.type === 'void') this.voidImpact(a, e); else this.infernoStart(a, e);
      }
    } else if (ph === 'blink') {               // celestial: viaja como luz
      dashing = true; grav = false;
      const u = clamp(a.lt / T.dash, 0, 1);
      a.acc += dt; if (a.acc >= 0.008) { a.acc = 0; this.trailPush(a); }
      this.x = lerp(a.sx, a.ex, easeO(u)); this.vx = 0; this.vy = 0;
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.12); c.tLight = 0.5; c.lightC = '#fff7d6';
      for (let i = 0; i < 2; i++) m.fx.add(this.x + rnd(-8, 8), this.y - rnd(10, 100), rnd(-60, 60), rnd(-60, 60), 0.4, rnd(2, 4), '#fff7d6', 0, 1);
      if (u >= 1) { a.ph = 'strike'; a.lt = 0; this.celestialImpact(a, e); }
    } else if (ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20);
      c.zx = a.ix || cx; c.zy = a.iy || cy;
      if (a.type === 'void') { c.tZoom = Math.max(c.tZoom, 1.16); c.tDim = 0.18; if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; } }
      else if (a.type === 'celestial') { c.tZoom = Math.max(c.tZoom, 1.14); c.tLight = 0.3; c.lightC = '#fff7d6'; if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; } }
      else this.infernoCombo(a, e, dt);
    } else if (ph === 'rec') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 10);
      a.aura = Math.max(0, a.aura - dt * 1.6);
      c.tZoom = Math.max(c.tZoom, 1 + 0.1 * (1 - a.lt / T.rec));
      if (a.type === 'celestial') c.tLight = 0.25 * (1 - a.lt / T.rec);
      if (a.lt >= T.rec + (a.whiff ? 0.35 : 0)) { this.endAwk(); return; }
    }
    if (a.ph !== 'prep' && a.ph !== 'rec') a.aura = Math.min(1, a.aura + dt * 3);
    if (grav) this.vy = Math.min(1500, this.vy + GRAV * dt);
    const px = this.x;
    moveBody(m, this, dt, false);
    if (a.ph === 'blink') this.x = px;       // o piscar controla x
    if (!dashing && this.grounded) this.phase += Math.abs(this.vx) * dt * 0.034;
    this.awkPose();
    this.smoothPose(dashing ? 1.4 : 1);
    this.capeStep(dt);
    this.checkBounds();
  },
  awkBlinkTarget(a, e) {
    const dir = e ? (e.cx >= this.x ? 1 : -1) : this.facing;
    let ex = e ? e.cx - dir * 58 : this.x + dir * 300;
    const maxR = 640; ex = clamp(ex, this.x - maxR, this.x + maxR);
    a.ex = clamp(ex, 30, WORLD_W - 30); a.dirB = dir; this.facing = dir;
  },
  // ---------- VOID BREAKER: impacto + onda de choque
  voidImpact(a, e) {
    const m = this.m, c = m.cine, dir = this.facing, ix = this.x + dir * 36, iy = this.y - 55;
    a.ix = ix; a.iy = iy;
    const hit = this.awkStrike(e, {rx: 88, ry: 95, share: 1, kx: 1450, ky: -650, blast: 215, blastShare: 0.4});
    a.hit = hit; a.whiff = !hit;
    SFX.play('awk_void_hit');
    m.fx.burst(ix, iy, 36, 760, 0.8, 4, '#a78bfa', 200, 0); m.fx.burst(ix, iy, 20, 520, 0.9, 6, '#1e0b3a', 0, 1); m.fx.burst(ix, iy, 14, 900, 0.4, 3, '#f0abfc', 0, 0);
    m.addShock(ix, iy, 10, 330, 0.55, '#c4b5fd', 8); m.addShock(ix, iy, 10, 470, 0.7, '#7c3aed', 6); m.addShock(ix, iy, 10, 620, 0.9, '#1e0b3a', 10);
    if (c.camFx) { c.flash = 0.6; c.flashC = '#e9d5ff'; c.zp = 0.16; c.kick = 1; }
    m.fx.addShake(16); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
  },
  // ---------- INFERNO OVERDRIVE: combo de 3 + finalização
  infernoStart(a, e) {
    a.jab = 0; a.jt = 0; a.fin = false; a.whiff = false; a.ix = this.x + this.facing * 36; a.iy = this.y - 55;
  },
  infernoCombo(a, e, dt) {
    const m = this.m, c = m.cine; let dir = this.facing;
    c.tZoom = Math.max(c.tZoom, 1.14); c.tDim = 0.12; c.zx = this.x + dir * 30; c.zy = this.y - 60;
    if (e) { this.facing = dir = e.cx >= this.x ? 1 : -1; }
    a.jt += dt;
    const ix = this.x + dir * 40, iy = this.y - 60;
    if (!a.fin && a.jab < 3 && a.jt >= 0.17 * a.jab) {
      a.jab++; a.cur = a.jab;
      const hit = this.awkStrike(e, {rx: 92, ry: 100, share: 0.12, kx: 220, ky: -60, blast: 0, blastShare: 0});
      if (hit) a.hit = true;
      SFX.play('awk_inferno_jab');
      m.fx.burst(ix, iy, 10, 520, 0.3, 3, '#fde047', 100, 0, dir > 0 ? 0 : Math.PI, 2.2); m.fx.burst(ix, iy, 6, 300, 0.35, 4, '#fb923c', -50, 1);
      m.addShock(ix, iy, 6, 80, 0.2, '#fde047', 4); m.fx.addShake(5);
      if (hit) m.hitstop = Math.max(m.hitstop, 0.03);
    }
    if (!a.fin && a.jab >= 3 && a.jt >= 0.17 * 3 + 0.2) {
      a.fin = true; a.ft = 0;
      const hit = this.awkStrike(e, {rx: 95, ry: 105, share: 0.64, kx: 1250, ky: -1000, blast: 190, blastShare: 0.35});
      if (hit) a.hit = true; a.whiff = !a.hit;
      SFX.play('awk_inferno_boom');
      const fx = ix + dir * 14;
      a.ix = fx; a.iy = iy;
      m.fx.burst(fx, iy, 40, 820, 0.9, 5, '#fb923c', 400, 0); m.fx.burst(fx, iy, 22, 600, 0.7, 8, '#7f1d1d', -120, 1); m.fx.burst(fx, iy, 16, 1000, 0.4, 3, '#fde047', 0, 0);
      m.addShock(fx, iy, 10, 300, 0.5, '#fde047', 9); m.addShock(fx, iy, 10, 430, 0.7, '#fb923c', 7); m.addShock(fx, iy, 10, 560, 0.9, '#7f1d1d', 5);
      if (c.camFx) { c.flash = 0.55; c.flashC = '#ffd9a0'; c.zp = 0.18; c.kick = 1; }
      m.fx.addShake(18); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
    }
    if (a.fin) { a.ft += dt; c.tZoom = Math.max(c.tZoom, 1.18); if (a.ft >= 0.28) { a.ph = 'rec'; a.lt = 0; } }
  },
  // ---------- CELESTIAL IMPACT: pilar de luz
  celestialImpact(a, e) {
    const m = this.m, c = m.cine, dir = this.facing, ix = this.x + dir * 34, iy = this.y - 55;
    a.ix = ix; a.iy = iy;
    const hit = this.awkStrike(e, {rx: 100, ry: 125, share: 0.85, kx: 1050, ky: -1250, blast: 270, blastShare: 0.45});
    a.hit = hit; a.whiff = !hit;
    // onda de energia varrendo a arena (empurra quem estiver no caminho, sem dano)
    if (e && e.alive && !hit) { const d = Math.abs(e.cx - ix); if (d < 700 && !this.awkRegion(e, 270, 300)) { e.vx += Math.sign(e.cx - ix || 1) * 520 * (1 - d / 700); e.vy = Math.min(e.vy, -300 * (1 - d / 700)); } }
    SFX.play('awk_celestial_hit');
    m.fx.burst(ix, iy, 40, 760, 1.0, 4, '#fde68a', 120, 1); m.fx.burst(ix, iy, 24, 900, 0.8, 3, '#ffffff', 0, 0); m.fx.burst(ix, iy, 16, 540, 1.2, 5, '#bae6fd', -80, 1);
    m.addShock(ix, iy, 10, 260, 0.45, '#ffffff', 10); m.addShock(ix, iy, 10, 480, 0.75, '#fde68a', 8); m.addShock(ix, iy, 10, 760, 1.1, '#bae6fd', 6);
    m.addBeam(ix, 0.9, '#fff7d6');
    if (c.camFx) { c.flash = 0.95; c.flashC = '#ffffff'; c.zp = 0.15; c.kick = 1; }
    m.fx.addShake(14); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
  },
  // ---------- pose
  awkPose() {
    const a = this.awk, T = this.T, fx = this.facing, k = _kf, t = this.m.time;
    const tt = AWK_T[a.type];
    let rows, u;
    if (a.type === 'void') {
      if (a.ph === 'prep') { rows = KF.void_prep; u = a.lt / tt.prep; }
      else if (a.ph === 'dash') { rows = KF.void_dash; u = a.lt / tt.dash; }
      else if (a.ph === 'strike') { rows = KF.void_hit; u = a.lt / tt.hold; }
      else { rows = KF.void_rec; u = a.lt / tt.rec; }
    } else if (a.type === 'inferno') {
      if (a.ph === 'prep') { rows = KF.inf_prep; u = a.lt / tt.prep; }
      else if (a.ph === 'dash') { rows = KF.inf_dash; u = a.lt / tt.dash; }
      else if (a.ph === 'strike') {
        if (a.fin) { rows = KF.inf_fin; u = a.ft / 0.28; }
        else { rows = (a.jab % 2) ? KF.inf_jabR : KF.inf_jabL; u = ((a.jt - 0.17 * Math.max(0, a.jab - 1)) / 0.17); }
      } else { rows = KF.inf_rec; u = a.lt / tt.rec; }
    } else {
      if (a.ph === 'prep') { rows = KF.cel_prep; u = a.lt / tt.prep; }
      else if (a.ph === 'blink') { rows = KF.cel_prep; u = 1; }
      else if (a.ph === 'strike') { rows = KF.cel_hit; u = a.lt / tt.hold; }
      else { rows = KF.cel_rec; u = a.lt / tt.rec; }
    }
    kfs(rows, u, k);
    const lean = k[1] * fx, crouch = k[2], stance = k[3], shake = (a.ph === 'prep' ? Math.sin(t * 60) * 0.9 * a.aura : 0);
    let hipY = this.y - 44 + crouch;
    if (!this.grounded) hipY += 3;
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x + shake; hip.y = hipY;
    ch.x = hip.x + lean; ch.y = hip.y - 30 + (crouch * 0.1);
    hd.x = ch.x + lean * 0.35 + fx * 2; hd.y = ch.y - 22;
    // pernas
    for (let i = 0; i < 2; i++) {
      const front = i === 1;
      const fxp = this.x + fx * (front ? stance : -stance * 0.95), fyp = this.y - (front ? 0 : k[8]);
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const kn = T[front ? KNR : KNL], ft = T[front ? FTR : FTL];
      kn.x = _o.ex; kn.y = _o.ey; ft.x = _o.hx; ft.y = _o.hy;
    }
    ik(ch.x, ch.y, ch.x + fx * k[6], ch.y + k[7], 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, ch.x + fx * k[4], ch.y + k[5], 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
    this.wAng = -0.9;
  },
});

Object.assign(Match.prototype, {
  addShock(x, y, r0, r1, life, col, w) { const s = this.cine.shocks; if (s.length < 14) s.push({x, y, r0, r1, l: life, L: life, c: col, w}); },
  addBeam(x, life, col) { const b = this.cine.beams; if (b.length < 3) b.push({x, l: life, L: life, c: col}); },
  updateCine(dt) {
    const c = this.cine;
    if (!c.camFx) { c.tDim = 0; c.tZoom = 1; c.tLight = 0; c.tDist = 0; c.flash = 0; c.zp = 0; c.kick = 0; }
    if (c.zoom < 1.02) { c.cx = c.zx; c.cy = c.zy; } else { const kc = Math.min(1, dt * 10); c.cx += (c.zx - c.cx) * kc; c.cy += (c.zy - c.cy) * kc; }
    const k = Math.min(1, dt * 6);
    c.dim += (c.tDim - c.dim) * k; c.light += (c.tLight - c.light) * k; c.dist += (c.tDist - c.dist) * Math.min(1, dt * 8);
    c.zp *= Math.pow(0.02, dt); c.kick *= Math.pow(0.02, dt);
    c.zoom += ((c.tZoom + c.zp) - c.zoom) * Math.min(1, dt * 9);
    if (c.flash > 0) c.flash = Math.max(0, c.flash - dt * 2.4);
    if (c.dim < 0.004) c.dim = 0; if (c.light < 0.004) c.light = 0; if (c.dist < 0.004) c.dist = 0;
    for (let i = c.shocks.length - 1; i >= 0; i--) { c.shocks[i].l -= dt; if (c.shocks[i].l <= 0) c.shocks.splice(i, 1); }
    for (let i = c.beams.length - 1; i >= 0; i--) { c.beams[i].l -= dt; if (c.beams[i].l <= 0) c.beams.splice(i, 1); }
  },
  // prévia dos cosméticos: ninguém sofre dano real, nada é consumido de partida
  keepPreview() {
    const h = this.fighters[0], d = this.fighters[1];
    h.energy = this.pvHold ? 0 : 100; d.hp = d.maxhp; h.hp = h.maxhp; h.invuln = d.invuln = 0;
    if (!d.alive) { d.reset({x: 800, y: 600}, false); d.invuln = 0; }
    if (d.cy > 760 || d.cx < 20 || d.cx > WORLD_W - 20) { d.reset({x: 800, y: 600}, false); d.invuln = 0; }
    if (!h.alive) { h.reset({x: 430, y: 600}, false); h.invuln = 0; }
  },
});
