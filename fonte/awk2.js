'use strict';
/* STICK MAYHEM v1.3.0 — 6 novos AWAKENINGS: INFERNAL RAGE, VOID ASCENSION, THUNDER SOUL, FROZEN EMPEROR, CELESTIAL BREAKER, MAYHEM OVERDRIVE.
   Mantêm as fases prep/dash|blink/strike/rec do sistema original (IA, energia, balanceamento e cinemática são os mesmos). */
const AWK2 = {rage: 1, ascension: 1, soul: 1, emperor: 1, breaker: 1, overdrive: 1};
Object.assign(AWK_T, {
  rage:      {prep: 0.85, dash: 0.20, spd: 1900, hold: 0.30, rec: 0.70},
  ascension: {prep: 1.00, dash: 0.45, spd: 1900, hold: 0.35, rec: 0.70},
  soul:      {prep: 0.70, dash: 0.33, spd: 0,    hold: 0.60, rec: 0.80},
  emperor:   {prep: 1.00, dash: 0.55, spd: 1500, hold: 0.55, rec: 0.90},
  breaker:   {prep: 1.10, dash: 0.30, spd: 0,    hold: 0.45, rec: 1.00},
  overdrive: {prep: 0.80, dash: 0.30, spd: 2100, hold: 0.35, rec: 0.80},
});
Object.assign(KF, {
  asc_prep:  [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.5, 0, -4, 10, 16, -26, -14, -26, 10], [1, 0, -6, 10, 18, -34, -18, -34, 14]],
  soul_hit:  [[0, 0, 0, 10, 10, -30, -8, -30, 0], [1, 0, 0, 10, 12, -36, -10, -36, 0]],
  emp_prep:  [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.5, 2, 6, 14, 22, -14, 22, -14, 0], [1, 4, 10, 16, 26, -6, 26, -6, 0]],
  emp_push:  [[0, 6, 8, 16, 28, 2, 24, 2, 0], [1, 8, 8, 16, 32, 4, 28, 4, 0]],
});
const AWKP = {
  rage:      {prep: KF.inf_prep, dash: KF.inf_dash, strike: null, rec: KF.inf_rec},
  ascension: {prep: KF.asc_prep, dash: KF.void_dash, strike: KF.void_hit, rec: KF.void_rec},
  soul:      {prep: KF.cel_prep, blink: KF.inf_dash, strike: KF.soul_hit, rec: KF.cel_rec},
  emperor:   {prep: KF.emp_prep, dash: KF.emp_push, strike: KF.emp_push, rec: KF.cel_rec},
  breaker:   {prep: KF.cel_prep, dash: KF.cel_hit, strike: KF.cel_hit, rec: KF.cel_rec},
  overdrive: {prep: KF.inf_prep, dash: KF.inf_dash, strike: KF.inf_fin, rec: KF.inf_rec},
};
function a2decay(arr, dt) { for (let i = arr.length - 1; i >= 0; i--) { arr[i].l -= dt; if (arr[i].l <= 0) arr.splice(i, 1); } }

Object.assign(Fighter.prototype, {
  awk2Init(a) { a.sl = []; a.pil = []; a.spk = []; a.zz = []; a.n = 0; a.st = 0; a.hitp = false; a.stamp = 0; a.cross = null; a.frz = 0; a.by = this.y; a.crown = 0; a.wing = 0; a.sw = 0; a.bx = 0; a.bolt = 0; },
  awkHit2(e, x, y, rx, ry, share, kx, ky, blast, bshare) {
    if (!e || !e.alive) return false;
    const dir = e.cx >= x ? 1 : -1, dx = (e.cx - x) / rx, dy = (e.cy - y) / ry;
    let sh = 0, K = 1;
    if (dx * dx + dy * dy <= 1) sh = share;
    else if (blast) { const d = Math.hypot(e.cx - x, e.cy - y); if (d < blast) { sh = bshare * (0.5 + 0.5 * (1 - d / blast)); K = 0.5; } }
    if (!sh) return false;
    const k = this.safeK(e, dir, dir * kx * K, ky * K);
    const hit = e.hurt(this.awkDamage(e, sh), k[0], k[1], this, 'awk', e.cx, e.cy);
    if (hit && e.alive && !e.ragdoll && Math.hypot(k[0], k[1]) > 300) e.toRagdoll(k[0], k[1], 0.9 + Math.hypot(k[0], k[1]) / 1800);
    return hit;
  },
  updateAwk2(dt) {
    const a = this.awk, m = this.m, T = AWK_T[a.type], c = m.cine, e = this.foe(), ty = a.type;
    if (!(m.state === 'play') || m.ended || a.t > AWK.maxT || (m.frozen && !m.ended)) { this.endAwk(); return; }
    if (!a.sl) this.awk2Init(a);
    a.t += dt; a.lt += dt;
    for (const p of a.tr) p.a = Math.max(0, p.a - dt * 4);
    a2decay(a.sl, dt); a2decay(a.pil, dt); a2decay(a.spk, dt); a2decay(a.zz, dt);
    if (a.stamp > 0) a.stamp -= dt; if (a.cross) { a.cross.l -= dt; if (a.cross.l <= 0) a.cross = null; }
    a.gv = true; a.ds = false;
    const u = clamp(a.lt / T.prep, 0, 1);
    if (a.ph === 'prep') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 14);
      a.aura = Math.min(1, a.aura + dt * 2.2);
      c.zx = this.x; c.zy = this.y - 55; c.tZoom = Math.max(c.tZoom, 1 + 0.14 * easeO(u));
      if (e && ty !== 'overdrive' || e) this.facing = e ? (e.cx >= this.x ? 1 : -1) : this.facing;
    } else if (a.ph === 'rec') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 10);
      a.aura = Math.max(0, a.aura - dt * 1.6);
      c.tZoom = Math.max(c.tZoom, 1 + 0.1 * (1 - a.lt / T.rec));
      if (a.lt >= T.rec + (a.whiff ? 0.35 : 0)) { this.endAwk(); return; }
    }
    if (a.ph !== 'rec') this['aw_' + ty](a, e, dt, T, c, u);
    if (!this.awk) return;
    if (a.ph !== 'prep' && a.ph !== 'rec') a.aura = Math.min(1, a.aura + dt * 3);
    if (a.gv) this.vy = Math.min(1500, this.vy + GRAV * dt);
    const px = this.x;
    moveBody(m, this, dt, false);
    if (a.ph === 'blink') this.x = px;
    if (!a.ds && this.grounded) this.phase += Math.abs(this.vx) * dt * 0.034;
    this.awkPose2();
    this.smoothPose(a.ds ? 1.4 : 1);
    this.capeStep(dt);
    this.checkBounds();
  },
  awkPose2() {
    const a = this.awk, P = AWKP[a.type], tt = AWK_T[a.type];
    let rows = P[a.ph] || P.prep, u;
    if (a.ph === 'prep') u = a.lt / tt.prep; else if (a.ph === 'rec') u = a.lt / tt.rec; else if (a.ph === 'strike') u = a.lt / (tt.hold || 0.4); else u = a.lt / (tt.dash || 0.2);
    if (a.type === 'rage' && a.ph === 'strike') { rows = (a.n % 2) ? KF.inf_jabR : KF.inf_jabL; u = (a.st % 0.13) / 0.13; if (a.fin) { rows = KF.inf_fin; u = a.ft / 0.3; } }
    this.awkPoseRows(rows, u, a);
  },
  awkPoseRows(rows, u, a) {
    const T = this.T, fx = this.facing, k = _kf, t = this.m.time;
    kfs(rows, u, k);
    const lean = k[1] * fx, crouch = k[2], stance = k[3], shake = (a.ph === 'prep' ? Math.sin(t * 60) * 0.9 * a.aura : 0);
    let hipY = this.y - 44 + crouch; if (!this.grounded) hipY += 3;
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x + shake; hip.y = hipY; ch.x = hip.x + lean; ch.y = hip.y - 30 + crouch * 0.1; hd.x = ch.x + lean * 0.35 + fx * 2; hd.y = ch.y - 22;
    for (let i = 0; i < 2; i++) {
      const front = i === 1, fxp = this.x + fx * (front ? stance : -stance * 0.95), fyp = this.y - (front ? 0 : k[8]);
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const kn = T[front ? KNR : KNL], ft = T[front ? FTR : FTL]; kn.x = _o.ex; kn.y = _o.ey; ft.x = _o.hx; ft.y = _o.hy;
    }
    ik(ch.x, ch.y, ch.x + fx * k[6], ch.y + k[7], 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, ch.x + fx * k[4], ch.y + k[5], 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
    this.wAng = -0.9;
  },
  a2finish(a, hit, hold) { a.hit = hit; a.whiff = !hit; },
  // ---------- INFERNAL RAGE: rugido, 5 garras e pilar de fogo
  aw_rage(a, e, dt, T, c, u) {
    const m = this.m, dir = this.facing, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      c.tDim = 0.3 * u; c.tDist = u > 0.4 ? clamp((u - 0.4) * 1.2, 0, 0.7) : 0; c.dx = cx; c.dy = cy - 20; c.dr = 230; c.dtype = 1;
      a.acc += dt * (50 + 90 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-30, 30), this.y - rnd(0, 20), rnd(-50, 50), -rnd(140, 340) * (0.5 + u), rnd(0.3, 0.6), rnd(2, 4), Math.random() < 0.5 ? '#ef4444' : '#fb923c', -80, 0); }
      if (u > 0.55 && !a.did) { a.did = 1; SFX.play('awk_rage_roar'); m.addShock(cx, cy, 20, 260, 0.55, '#ef4444', 7); m.addShock(cx, cy, 20, 190, 0.4, '#fde047', 4); m.fx.addShake(9);
        for (const o of [-190, -95, 95, 190]) a.pil.push({x: cx + o, l: 0.9, L: 0.9, h: 0.7});
        if (e && Math.abs(e.cx - cx) < 240 && !e.awk) { e.vx += Math.sign(e.cx - cx || 1) * 340; e.vy = Math.min(e.vy, -220); e.hitstun = Math.max(e.hitstun, 0.1); } }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; a.aim = e ? e.cx : cx + dir * 400; SFX.play('awk_rage_dash'); }
    } else if (a.ph === 'dash') {
      a.ds = true; a.gv = false;
      if (e && a.lt < T.dash - 0.05) a.aim = e.cx;
      const d = a.aim - this.x >= 0 ? 1 : -1; this.facing = d; this.vx = d * T.spd; this.vy = 0;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1); c.tDim = 0.2;
      m.fx.add(cx, cy + rnd(-30, 30), -d * rnd(100, 320), rnd(-60, 20), 0.3, rnd(2, 4), Math.random() < 0.5 ? '#ef4444' : '#fde047', -60, 1);
      if ((e && Math.abs(e.cx - this.x) < 46) || a.lt >= T.dash) { this.vx = 0; a.ph = 'strike'; a.lt = 0; a.n = 0; a.st = 0; a.fin = false; a.hit = false; a.ix = this.x + this.facing * 36; a.iy = this.y - 55; }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20);
      let d = this.facing; if (e) this.facing = d = e.cx >= this.x ? 1 : -1;
      c.tZoom = Math.max(c.tZoom, 1.15); c.tDim = 0.14; c.zx = this.x + d * 30; c.zy = this.y - 60;
      a.st += dt; const ix = this.x + d * 40, iy = this.y - 60;
      if (!a.fin && a.n < 5 && a.st >= 0.13 * a.n) {
        a.n++;
        const hit = this.awkHit2(e, ix, iy, 100, 105, 0.1, 230, -60); if (hit) a.hit = true;
        a.sl.push({x: ix, y: iy, ang: (a.n % 2 ? 0.8 : -0.8) * d, l: 0.28, L: 0.28, d});
        SFX.play('awk_rage_claw'); m.fx.burst(ix, iy, 8, 520, 0.3, 3, '#fb923c', 100, 0, d > 0 ? 0 : Math.PI, 2.2); m.addShock(ix, iy, 6, 70, 0.18, '#fca5a5', 4); m.fx.addShake(5);
        if (hit) m.hitstop = Math.max(m.hitstop, 0.03);
      }
      if (!a.fin && a.n >= 5 && a.st >= 0.13 * 5 + 0.2) {
        a.fin = true; a.ft = 0;
        const hit = this.awkHit2(e, ix, iy, 115, 120, 0.5, 700, -1150, 200, 0.3); if (hit) a.hit = true; a.whiff = !a.hit;
        const px = hit && e ? e.cx : ix; a.pil.push({x: px, l: 1.0, L: 1.0, h: 1.0}); a.pil.push({x: ix, l: 0.9, L: 0.9, h: 0.8});
        SFX.play('awk_rage_boom'); m.fx.burst(px, this.y - 20, 40, 800, 0.9, 5, '#fb923c', 400, 0); m.fx.burst(px, this.y - 20, 22, 600, 0.7, 8, '#7f1d1d', -120, 1); m.fx.burst(px, this.y - 20, 14, 1000, 0.4, 3, '#fde047', 0, 0);
        m.addShock(px, this.y - 10, 10, 300, 0.5, '#fde047', 9); m.addShock(px, this.y - 10, 10, 460, 0.8, '#dc2626', 7);
        if (c.camFx) { c.flash = 0.55; c.flashC = '#ffb3a0'; c.zp = 0.18; c.kick = 1; }
        m.fx.addShake(18); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05); a.ix = px; a.iy = iy;
      }
      if (a.fin) { a.ft += dt; c.tZoom = Math.max(c.tZoom, 1.18); if (a.ft >= 0.3) { a.ph = 'rec'; a.lt = 0; } }
    }
  },
  // ---------- VOID ASCENSION: levita, poço gravitacional e mergulho cometa
  aw_ascension(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      a.gv = false; const ty = a.by - 120 * easeO(u); this.vy = clamp((ty - this.y) * 9, -520, 520);
      if (e) { a.gx = e.cx; a.gy = e.cy; if (!e.awk && !e.ragdoll) e.vx += Math.sign(this.x - e.cx || 1) * 110 * u * dt; }
      c.tDim = 0.5 * Math.min(1, u * 2); c.tDist = u > 0.3 ? clamp((u - 0.3) * 1.3, 0, 0.9) : 0; c.dx = a.gx || cx; c.dy = a.gy || cy; c.dr = 230; c.dtype = 0;
      a.acc += dt * (30 + 70 * u); while (a.acc >= 1) { a.acc--; this.fxPull(a.gx || cx, (a.gy || cy), 110 + 60 * (1 - u), 1, Math.random() < 0.3 ? '#f0abfc' : '#a78bfa', 0.4); }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; SFX.play('awk_ascension_dash'); }
    } else if (a.ph === 'dash') {
      a.ds = true; a.gv = false;
      const tx = e ? e.cx : cx + this.facing * 300, ty = e ? e.cy - 10 : this.y;
      if (a.lt < 0.1) { let dx = tx - this.x, dy = ty - (this.y - 50); const L = Math.hypot(dx, dy) || 1; a.dvx = dx / L; a.dvy = dy / L; this.facing = dx >= 0 ? 1 : -1; }
      this.vx = a.dvx * T.spd; this.vy = a.dvy * T.spd;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.12); c.tDim = 0.42; c.tDist = 0.5; c.dx = cx; c.dy = cy; c.dr = 220; c.dtype = 0;
      m.fx.add(cx, cy, -a.dvx * rnd(80, 240), -a.dvy * rnd(80, 240), 0.35, rnd(2, 4), Math.random() < 0.5 ? '#a78bfa' : '#1e0b3a', 0, 1);
      const near = e && Math.hypot(e.cx - this.x, e.cy - (this.y - 50)) < 62;
      if (near || (this.grounded && a.lt > 0.08) || a.lt >= T.dash) {
        this.vx = 0; this.vy = 0; a.ph = 'strike'; a.lt = 0;
        const ix = this.x + this.facing * 30, iy = this.y - 40; a.ix = ix; a.iy = iy;
        const hit = this.awkStrike(e, {rx: 115, ry: 125, share: 1, kx: 1200, ky: -800, blast: 250, blastShare: 0.4}); a.hit = hit; a.whiff = !hit;
        SFX.play('awk_ascension_hit'); m.fx.burst(ix, iy, 36, 780, 0.8, 4, '#a78bfa', 200, 0); m.fx.burst(ix, iy, 20, 520, 0.9, 6, '#1e0b3a', 0, 1); m.fx.burst(ix, iy, 14, 900, 0.4, 3, '#f0abfc', 0, 0);
        m.addShock(ix, iy, 10, 340, 0.55, '#c4b5fd', 8); m.addShock(this.x, this.y - 4, 10, 520, 0.8, '#7c3aed', 6); m.addShock(this.x, this.y - 4, 10, 680, 1.0, '#1e0b3a', 10);
        if (c.camFx) { c.flash = 0.6; c.flashC = '#e9d5ff'; c.zp = 0.16; c.kick = 1; }
        m.fx.addShake(17); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20); c.zx = a.ix; c.zy = a.iy; c.tZoom = Math.max(c.tZoom, 1.16); c.tDim = 0.18;
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
  // ---------- THUNDER SOUL: 3 saltos zigue-zague + raio do céu
  aw_soul(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      c.tDim = 0.28 * u; c.tLight = Math.random() < 0.18 * u ? 0.35 : 0.05; c.lightC = '#fef9c3';
      a.acc += dt * (50 + 90 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-26, 26), this.y - rnd(0, 110), rnd(-160, 160), rnd(-160, 160), 0.16, 2.4, Math.random() < 0.5 ? '#fde047' : '#93c5fd', 0, 1); }
      if (a.lt >= T.prep) { a.ph = 'blink'; a.lt = 0; a.n = 0; a.hopT = 0; a.hitp = false; a.sx = this.x; this.soulHop(a, e); SFX.play('awk_soul_hop'); }
    } else if (a.ph === 'blink') {
      a.ds = true; a.gv = false; a.hopT += dt;
      const k = clamp(a.hopT / 0.11, 0, 1);
      this.x = lerp(a.sx, a.ex, easeO(k)); this.vx = 0; this.vy = 0;
      a.acc += dt; if (a.acc >= 0.008) { a.acc = 0; this.trailPush(a); }
      c.zx = this.x; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1); c.tLight = 0.18; c.lightC = '#fef9c3';
      for (let i = 0; i < 2; i++) m.fx.add(this.x + rnd(-8, 8), this.y - rnd(10, 100), rnd(-90, 90), rnd(-90, 90), 0.25, rnd(2, 3.5), '#fde047', 0, 1);
      if (k >= 1) {
        a.n++; const hit = this.awkHit2(e, this.x + this.facing * 36, this.y - 55, 100, 110, 0.12, 200, -90); if (hit) a.hit = true;
        a.zz.push({x1: a.sx, y1: this.y - 55, x2: this.x, y2: this.y - 55, l: 0.3, L: 0.3});
        SFX.play('awk_soul_slash'); m.addShock(this.x + this.facing * 36, this.y - 55, 6, 90, 0.2, '#fde047', 4); m.fx.addShake(5); if (hit) m.hitstop = Math.max(m.hitstop, 0.03);
        if (a.n >= 3) { a.ph = 'strike'; a.lt = 0; a.bolt = 0; a.bx = e ? e.cx : this.x + this.facing * 200; a.fired = false; }
        else { a.hopT = 0; a.sx = this.x; this.soulHop(a, e); SFX.play('awk_soul_hop'); }
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20);
      c.zx = a.bx; c.zy = this.y - 100; c.tZoom = Math.max(c.tZoom, 1.1); c.tDim = 0.35; c.tLight = 0.1; c.lightC = '#fef9c3';
      if (e && a.lt < 0.15) a.bx = e.cx;
      if (!a.fired && a.lt >= 0.28) {
        a.fired = true; a.bolt = 0.4; const bx = a.bx;
        const hit = this.awkHit2(e, bx, this.y - 120, 120, 420, 0.64, 500, -1100, 260, 0.3); if (hit) a.hit = true; a.whiff = !a.hit;
        SFX.play('awk_soul_bolt'); m.addBeam(bx, 0.7, '#fde047'); m.addShock(bx, this.y - 6, 10, 380, 0.6, '#fde047', 9); m.addShock(bx, this.y - 6, 10, 540, 0.9, '#60a5fa', 6);
        m.fx.burst(bx, this.y - 30, 36, 800, 0.8, 4, '#fde047', 300, 0); m.fx.burst(bx, this.y - 30, 20, 600, 0.7, 4, '#93c5fd', 0, 1);
        if (c.camFx) { c.flash = 0.9; c.flashC = '#fffbe0'; c.zp = 0.14; c.kick = 1; }
        m.fx.addShake(16); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05); a.ix = bx; a.iy = this.y - 60;
      }
      if (a.bolt > 0) a.bolt -= dt;
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
  soulHop(a, e) {
    const side = (a.n % 2 ? 1 : -1), tx = e ? e.cx + side * 72 : this.x + this.facing * 150;
    a.ex = clamp(tx, 30, WORLD_W - 30); this.facing = (e ? e.cx : a.ex) >= a.ex ? 1 : -1;
  },
  // ---------- FROZEN EMPEROR: coroa de gelo, onda de espinhos, congela e estilhaça
  aw_emperor(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      a.crown = u; c.tDim = 0.3 * u; c.tLight = 0.1 * u; c.lightC = '#e0f2fe';
      a.acc += dt * (40 + 60 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-50, 50), this.y - rnd(0, 20), rnd(-20, 20), -rnd(20, 90), rnd(0.5, 0.9), rnd(2, 3.4), Math.random() < 0.5 ? '#e0f2fe' : '#7dd3fc', -20, 1); }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; a.wx = this.x; a.wd = this.facing; a.lastS = this.x; a.hitp = false; SFX.play('awk_emperor_wave'); }
    } else if (a.ph === 'dash') {
      a.crown = 1; a.wx += a.wd * T.spd * dt; c.zx = (cx + a.wx) / 2; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.08); c.tDim = 0.3;
      while ((a.wx - a.lastS) * a.wd > 36) { a.lastS += a.wd * 36; a.spk.push({x: a.lastS, l: 0.9, L: 0.9, h: 0.6 + 0.5 * Math.abs(Math.sin(a.lastS)), g: this.y}); m.fx.add(a.lastS, this.y - 8, rnd(-30, 30), -rnd(60, 160), 0.5, 3, '#e0f2fe', 200, 0); }
      if (e && e.alive && Math.abs(e.cx - a.wx) < 62 && e.y > this.y - 170) {
        const k = this.safeK(e, a.wd, a.wd * 120, -160);
        e.hurt(this.awkDamage(e, 0.4), k[0], k[1], this, 'awk', e.cx, e.cy); e.vx = 0; e.hitstun = Math.max(e.hitstun, 0.2);
        a.frz = T.hold; a.ph = 'strike'; a.lt = 0; a.hit = true; a.whiff = false; a.fe = e; SFX.play('awk_emperor_freeze');
        m.addShock(e.cx, e.cy, 10, 180, 0.4, '#e0f2fe', 6); m.fx.burst(e.cx, e.cy, 22, 400, 0.6, 3, '#bae6fd', 100, 0); m.fx.addShake(8);
      } else if (a.lt >= T.dash) { a.whiff = true; a.hit = false; a.ph = 'rec'; a.lt = 0; }
    } else if (a.ph === 'strike') {
      const f = a.fe; c.zx = f ? f.cx : cx; c.zy = f ? f.cy : cy; c.tZoom = Math.max(c.tZoom, 1.14); c.tDim = 0.28;
      if (f && f.alive && !f.ragdoll) { f.vx = 0; f.hitstun = Math.max(f.hitstun, 0.12); f.atkT = -1; }
      a.frz = Math.max(0, T.hold - a.lt);
      if (a.lt >= T.hold) {
        if (f && f.alive) {
          const dir = a.wd, k = this.safeK(f, dir, dir * 900, -1000), px = f.cx, py = f.cy;
          const hit = f.hurt(this.awkDamage(f, 0.6), k[0], k[1], this, 'awk', px, py); if (hit && f.alive && !f.ragdoll) f.toRagdoll(k[0], k[1], 1.0);
          SFX.play('awk_emperor_shatter'); m.fx.burst(px, py, 44, 820, 0.9, 4, '#e0f2fe', 500, 0); m.fx.burst(px, py, 20, 600, 0.8, 6, '#38bdf8', 300, 1);
          m.addShock(px, py, 10, 320, 0.55, '#ffffff', 9); m.addShock(px, py, 10, 480, 0.8, '#7dd3fc', 6);
          if (c.camFx) { c.flash = 0.6; c.flashC = '#e0f2fe'; c.zp = 0.16; c.kick = 1; }
          m.fx.addShake(15); m.hitstop = Math.max(m.hitstop, 0.1);
        }
        a.frz = 0; a.ph = 'rec'; a.lt = 0;
      }
    }
  },
  // ---------- CELESTIAL BREAKER: asas de luz + espada gigante do céu
  aw_breaker(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      a.wing = easeO(u); a.sw = u; c.tLight = 0.35 * Math.min(1, u * 1.6); c.lightC = '#fff7d6';
      a.acc += dt * (50 + 60 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-60, 60), this.y - rnd(0, 120), rnd(-20, 20), -rnd(60, 200), rnd(0.5, 0.9), rnd(2, 3.5), Math.random() < 0.5 ? '#fde68a' : '#e0f2fe', -30, 1); }
      if (u > 0.5 && !a.did) { a.did = 1; SFX.play('awk_breaker_wings'); m.addShock(cx, cy, 20, 220, 0.5, '#fde68a', 6); }
      if (e) a.bx = e.cx;
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; SFX.play('awk_breaker_drop'); }
    } else if (a.ph === 'dash') {
      a.wing = 1; a.sw = 1; if (e && a.lt < 0.12) a.bx = e.cx; a.by2 = e ? e.y : this.y;
      c.tLight = 0.3; c.lightC = '#fff7d6'; c.zx = a.bx; c.zy = this.y - 100; c.tZoom = Math.max(c.tZoom, 1.1);
      if (a.lt >= T.dash) {
        a.ph = 'strike'; a.lt = 0; const bx = a.bx, by = a.by2;
        const hit = this.awkHit2(e, bx, by - 60, 95, 330, 1.0, 400, -1200, 280, 0.4); a.hit = hit; a.whiff = !hit;
        a.cross = {x: bx, y: by - 20, l: 0.55, L: 0.55}; a.ix = bx; a.iy = by - 50;
        SFX.play('awk_breaker_hit'); m.addBeam(bx, 0.9, '#fff7d6'); m.addShock(bx, by - 4, 10, 280, 0.45, '#ffffff', 10); m.addShock(bx, by - 4, 10, 500, 0.75, '#fde68a', 8); m.addShock(bx, by - 4, 10, 760, 1.1, '#bae6fd', 6);
        m.fx.burst(bx, by - 30, 40, 760, 1.0, 4, '#fde68a', 120, 1); m.fx.burst(bx, by - 30, 24, 900, 0.8, 3, '#ffffff', 0, 0);
        if (c.camFx) { c.flash = 0.95; c.flashC = '#ffffff'; c.zp = 0.15; c.kick = 1; }
        m.fx.addShake(15); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20); c.zx = a.ix; c.zy = a.iy; c.tZoom = Math.max(c.tZoom, 1.14); c.tLight = 0.3; c.lightC = '#fff7d6';
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
  // ---------- MAYHEM OVERDRIVE: 3 investidas arco-íris + carimbo M
  aw_overdrive(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      c.tDim = 0.2 * u; c.tLight = 0.12 * u; c.lightC = '#fdf4ff';
      a.acc += dt * (60 + 90 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-40, 40), this.y - rnd(0, 110), rnd(-40, 40), -rnd(60, 220), rnd(0.4, 0.8), rnd(2, 3.4), 'hsl(' + ((Math.random() * 360) | 0) + ',90%,62%)', -40, 0); }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; a.n = 0; a.hitp = false; SFX.play('awk_overdrive_dash'); }
    } else if (a.ph === 'dash') {
      a.ds = true; a.gv = false;
      const d = e ? (e.cx >= this.x ? 1 : -1) : this.facing;
      if (a.lt < 0.03) { this.facing = a.dd = d; }
      this.vx = a.dd * T.spd; this.vy = 0; this.facing = a.dd;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1); c.tDim = 0.2;
      m.fx.add(cx, cy + rnd(-30, 30), -a.dd * rnd(100, 320), rnd(-60, 60), 0.35, rnd(2, 4), 'hsl(' + (((m.time * 400) + Math.random() * 90) % 360 | 0) + ',95%,62%)', 0, 1);
      if (!a.hitp && e && this.awkRegion(e, 52, 110)) {
        a.hitp = true; const hit = this.awkHit2(e, this.x + a.dd * 30, this.y - 55, 90, 110, 0.14, 240, -110); if (hit) a.hit = true;
        SFX.play('awk_overdrive_hit'); m.fx.burst(e.cx, e.cy, 16, 560, 0.4, 3, '#fde047', 0, 0); m.addShock(e.cx, e.cy, 8, 110, 0.25, '#f0abfc', 5); m.fx.addShake(7); if (hit) m.hitstop = Math.max(m.hitstop, 0.04);
        a.zz.push({x1: this.x - a.dd * 60, y1: this.y - 55, x2: this.x + a.dd * 60, y2: this.y - 55, l: 0.25, L: 0.25, m: 1});
      }
      const passed = e ? (this.x - e.cx) * a.dd > 95 : a.lt > 0.2;
      if (passed || a.lt >= T.dash) {
        a.n++; this.vx = 0;
        if (a.n >= 3) {
          a.ph = 'strike'; a.lt = 0; a.stamp = 0.8; a.ix = this.x; a.iy = this.y - 55;
          const hit = this.awkStrike(e, {rx: 135, ry: 135, share: 0.58, kx: 1100, ky: -950, blast: 300, blastShare: 0.3}); if (hit) a.hit = true; a.whiff = !a.hit;
          SFX.play('awk_overdrive_stamp'); m.addShock(this.x, this.y - 55, 10, 320, 0.5, '#fde047', 10); m.addShock(this.x, this.y - 55, 10, 500, 0.8, '#f0abfc', 8); m.addShock(this.x, this.y - 55, 10, 700, 1.1, '#67e8f9', 6);
          for (let i = 0; i < 5; i++) m.fx.burst(this.x, this.y - 55, 10, 760, 0.9, 4, 'hsl(' + (i * 72) + ',90%,62%)', 100, 0);
          if (c.camFx) { c.flash = 0.7; c.flashC = '#fdf4ff'; c.zp = 0.17; c.kick = 1; }
          m.fx.addShake(17); m.hitstop = Math.max(m.hitstop, a.hit ? 0.1 : 0.05);
        } else { a.lt = 0; a.hitp = false; }
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20); c.zx = a.ix; c.zy = a.iy; c.tZoom = Math.max(c.tZoom, 1.15); c.tDim = 0.15;
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
});

/* ---------- render ---------- */
function a2glow(ctx, x, y, r, c1, c2) { if (GFX.low) { ctx.fillStyle = c1; } else { const g = ctx.createRadialGradient(x, y, 2, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; } ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function a2spike(ctx, x, gy, h, w, col, edge) { ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w, gy); ctx.lineTo(x + w * 0.1, gy - h); ctx.lineTo(x + w, gy); ctx.closePath(); ctx.fill(); ctx.stroke(); }
function a2bolt(ctx, x1, y1, x2, y2, w, col, seed) {
  const n = 8; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1);
  for (let i = 1; i < n; i++) { const k = i / n, o = Math.sin(seed * 12.9 + i * 78.2) * 22; ctx.lineTo(x1 + (x2 - x1) * k + o * (y2 - y1 === 0 ? 0 : 1), y1 + (y2 - y1) * k + (y2 - y1 === 0 ? o : 0)); }
  ctx.lineTo(x2, y2); ctx.stroke();
}
const AWK2R = {
  rage: {
    back(ctx, f, t, k) {
      const x = f.x, y = f.y - 52, R = 64 + 50 * k; ctx.globalAlpha = 0.85 * k;
      a2glow(ctx, x, y, R, 'rgba(255,120,60,0.75)', 'rgba(120,10,10,0)');
      ctx.fillStyle = '#dc2626'; ctx.globalAlpha = 0.9 * k; const T = GFX.low ? 6 : 11;
      for (let i = 0; i < T; i++) { const bx = x + (i - (T - 1) / 2) * 9.5, h = (36 + 26 * Math.sin(t * 13 + i * 1.9)) * k + 10; ctx.beginPath(); ctx.moveTo(bx - 6, f.y); ctx.quadraticCurveTo(bx + Math.sin(t * 9 + i) * 6, f.y - h * 0.6, bx + Math.sin(t * 11 + i) * 5, f.y - h - 30 * k); ctx.quadraticCurveTo(bx + 4, f.y - h * 0.4, bx + 6, f.y); ctx.fill(); }
    },
    front(ctx, f, t, a, u) {
      for (const p of a.pil) { const k = p.l / p.L, h = 360 * p.h * Math.min(1, (1 - k) * 4) * Math.min(1, k * 2.5), w = 26 + 26 * (1 - k); ctx.globalAlpha = 0.85 * Math.min(1, k * 2); ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(p.x - w, f.y); ctx.quadraticCurveTo(p.x - w * 0.4, f.y - h * 0.5, p.x, f.y - h); ctx.quadraticCurveTo(p.x + w * 0.4, f.y - h * 0.5, p.x + w, f.y); ctx.fill(); ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.moveTo(p.x - w * 0.5, f.y); ctx.quadraticCurveTo(p.x, f.y - h * 0.6, p.x + w * 0.5, f.y); ctx.fill(); }
      for (const s of a.sl) { const k = s.l / s.L; ctx.globalAlpha = k; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.ang); for (let i = -1; i <= 1; i++) { ctx.strokeStyle = i ? '#fca5a5' : '#fff'; ctx.lineWidth = 6 * k + 1; ctx.beginPath(); ctx.moveTo(-55 * (1 - k * 0.3), i * 14 - 40); ctx.quadraticCurveTo(10, i * 14, 55, i * 14 + 40); ctx.stroke(); } ctx.restore(); }
      if (a.ph === 'prep' && u > 0.5) { const r = 30 + (u - 0.5) * 360; ctx.globalAlpha = 1 - (u - 0.5) * 2; ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(f.x, f.y - 70, r, 0, 6.283); ctx.stroke(); }
    }},
  ascension: {
    back(ctx, f, t, k) {
      const a = f.awk, wx = a.gx || f.x, wy = a.gy || f.y - 50, R = 70 + 60 * k; ctx.globalAlpha = 0.92 * k;
      a2glow(ctx, wx, wy, R, 'rgba(8,0,22,0.95)', 'rgba(124,58,237,0)');
      ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 2; for (let j = 0; j < 3; j++) { ctx.globalAlpha = (0.7 - j * 0.18) * k; ctx.beginPath(); ctx.ellipse(wx, wy, R * (0.9 - j * 0.22), R * (0.9 - j * 0.22) * 0.38, t * (1.4 + j * 0.5), 0, 6.283); ctx.stroke(); }
      ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#05010d'; ctx.beginPath(); ctx.ellipse(f.x, a.by + 2, 38, 9, 0, 0, 6.283); ctx.fill();
    },
    front(ctx, f, t, a, u) {
      if (a.ph === 'prep' && u > 0.3) a2glow(ctx, f.pts[HDR].x, f.pts[HDR].y - 10, 8 + 22 * (u - 0.3), 'rgba(240,171,252,0.95)', 'rgba(60,10,120,0)');
      if (a.ph === 'dash') { ctx.globalAlpha = 0.9; a2glow(ctx, f.x, f.y - 50, 34, 'rgba(240,171,252,0.9)', 'rgba(88,28,135,0)'); }
    }},
  soul: {
    back(ctx, f, t, k) {
      const x = f.x, y = f.y - 52; ctx.globalAlpha = 0.8 * k; a2glow(ctx, x, y, 70 + 40 * k, 'rgba(253,240,130,0.7)', 'rgba(59,130,246,0)');
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2.2; ctx.globalAlpha = k;
      for (let i = 0; i < 4; i++) { const th = i * 1.57 + Math.floor(t * 18) * 0.7; ctx.beginPath(); ctx.moveTo(x + Math.cos(th) * 18, y + Math.sin(th) * 30); ctx.lineTo(x + Math.cos(th + 0.3) * 46, y + Math.sin(th + 0.3) * 56); ctx.lineTo(x + Math.cos(th - 0.1) * 70, y + Math.sin(th - 0.1) * 70); ctx.stroke(); }
    },
    front(ctx, f, t, a, u) {
      for (const z of a.zz) { const k = z.l / z.L; ctx.globalAlpha = k; a2bolt(ctx, z.x1, z.y1, z.x2, z.y2, 8 * k + 2, '#93c5fd', t); a2bolt(ctx, z.x1, z.y1, z.x2, z.y2, 3 * k + 1, '#fff', t + 1); }
      if (a.ph === 'strike' && a.bx) {
        if (!a.fired) { const w = 10 + 40 * (a.lt / 0.28); ctx.globalAlpha = 0.25 + 0.3 * Math.sin(t * 40) * Math.sin(t * 40); ctx.fillStyle = '#fde047'; ctx.fillRect(a.bx - w * 0.5, 0, w, f.y + 4); ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(a.bx, f.y + 2, w, 8, 0, 0, 6.283); ctx.fill(); }
        else if (a.bolt > 0) { ctx.globalAlpha = Math.min(1, a.bolt * 4); a2bolt(ctx, a.bx, -10, a.bx, f.y, 22, '#fde047', Math.floor(t * 30)); a2bolt(ctx, a.bx, -10, a.bx, f.y, 8, '#fff', Math.floor(t * 30) + 3); }
      }
    }},
  emperor: {
    back(ctx, f, t, k) { const x = f.x, y = f.y - 52; ctx.globalAlpha = 0.8 * k; a2glow(ctx, x, y, 70 + 50 * k, 'rgba(224,242,254,0.75)', 'rgba(56,189,248,0)'); ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#e0f2fe'; ctx.beginPath(); ctx.ellipse(x, f.y + 2, 90 * k, 12 * k, 0, 0, 6.283); ctx.fill(); },
    front(ctx, f, t, a, u) {
      const hp = f.pts[HEAD], cr = a.crown;
      if (cr > 0.02) { ctx.globalAlpha = Math.min(1, cr * 1.5); for (let i = -3; i <= 3; i++) { const h = (i === 0 ? 30 : 20 - Math.abs(i) * 2) * cr, bx = hp.x + i * 5.2; a2spike(ctx, bx, hp.y - 10, h, 3.6, '#e0f2fe', '#0ea5e9'); } ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hp.x - 18, hp.y - 10); ctx.lineTo(hp.x + 18, hp.y - 10); ctx.stroke(); }
      for (const s of a.spk) { const k = s.l / s.L, h = 90 * s.h * Math.min(1, (1 - k) * 5) * Math.min(1, k * 3); ctx.globalAlpha = Math.min(1, k * 2); a2spike(ctx, s.x, s.g, h, 12, '#bae6fd', '#0369a1'); }
      if (a.frz > 0 && a.fe && a.fe.alive) { const e = a.fe, P = e.pts; ctx.globalAlpha = 0.55; ctx.fillStyle = '#bae6fd'; ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P[HEAD].x - 18, P[HEAD].y - 18); ctx.lineTo(P[HEAD].x + 18, P[HEAD].y - 14); ctx.lineTo(e.x + 30, e.y - 40); ctx.lineTo(e.x + 24, e.y + 4); ctx.lineTo(e.x - 24, e.y + 4); ctx.lineTo(e.x - 30, e.y - 44); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 0.7; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(e.x - 10, e.y - 90); ctx.lineTo(e.x + 4, e.y - 40); ctx.lineTo(e.x - 8, e.y - 8); ctx.stroke(); }
    }},
  breaker: {
    back(ctx, f, t, k) {
      const a = f.awk, P = f.pts, fx = f.facing, w = a.wing || 0;
      ctx.globalAlpha = 0.9 * k; a2glow(ctx, f.x, f.y - 55, 80 + 50 * k, 'rgba(255,255,255,0.85)', 'rgba(254,240,138,0)');
      if (w > 0.02) { ctx.save(); ctx.translate(P[CHEST].x - fx * 3, P[CHEST].y + 3); ctx.scale(-fx, 1); for (const s of [1, -0.55]) for (let i = 0; i < 6; i++) { const ang = (-1.5 + i * 0.3) * w * s + Math.sin(t * 4) * 0.05, L = (48 + i * 6 - (i > 3 ? 14 : 0)) * w; ctx.save(); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * 0.5, -9 * w, L, 0); ctx.quadraticCurveTo(L * 0.5, 7 * w, 0, 0); ctx.globalAlpha = 0.92; ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore(); } ctx.restore(); }
    },
    front(ctx, f, t, a, u) {
      if (a.sw > 0.02 && (a.ph === 'prep' || a.ph === 'dash')) {
        const bx = a.ph === 'prep' ? f.x : a.bx, tipY = a.ph === 'dash' ? lerp(-280, (a.by2 || f.y) - 20, easeI(clamp(a.lt / 0.3, 0, 1))) : -60 + 0 * u - (1 - a.sw) * 40 + f.y - 330;
        const ty = a.ph === 'dash' ? tipY : tipY; ctx.globalAlpha = Math.min(1, a.sw * 1.4);
        const L = 260, W = 20; ctx.fillStyle = '#e0f2fe'; ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3;
        const top = ty - L, bot = ty; ctx.beginPath(); ctx.moveTo(bx - W, top + 40); ctx.lineTo(bx - W, top + 20); ctx.lineTo(bx - W * 2, top + 20); ctx.lineTo(bx - W * 2, top + 4); ctx.lineTo(bx + W * 2, top + 4); ctx.lineTo(bx + W * 2, top + 20); ctx.lineTo(bx + W, top + 20); ctx.lineTo(bx + W, bot - 30); ctx.lineTo(bx, bot); ctx.lineTo(bx - W, bot - 30); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(bx - 3, top + 40, 6, L - 80);
        if (a.ph === 'dash') { ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff7d6'; ctx.fillRect(bx - 12, -10, 24, ty); }
      }
      if (a.cross) { const k = a.cross.l / a.cross.L, x = a.cross.x, y = a.cross.y; ctx.globalAlpha = k; ctx.lineCap = 'round'; for (const [dx, dy] of [[1, -0.7], [-1, -0.7], [1, 0.7], [-1, 0.7]]) { ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 22 * k; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * 700, y + dy * 700); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8 * k; ctx.stroke(); } }
    }},
  overdrive: {
    back(ctx, f, t, k) {
      const x = f.x, y = f.y - 52, R = 70 + 56 * k; ctx.globalAlpha = 0.85 * k;
      if (!GFX.low) { const g = ctx.createRadialGradient(x, y, 4, x, y, R); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.3, 'hsla(' + ((t * 160) % 360 | 0) + ',95%,65%,0.6)'); g.addColorStop(0.7, 'hsla(' + ((t * 160 + 120) % 360 | 0) + ',95%,60%,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; } else ctx.fillStyle = 'rgba(240,171,252,0.5)';
      ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    },
    front(ctx, f, t, a, u) {
      const cx = f.x, cy = f.y - 55;
      if (a.aura > 0.15) { ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { const th = t * 2.4 + i / 5 * 6.283, R = 58 + 6 * Math.sin(t * 3 + i); ctx.globalAlpha = 0.9 * a.aura; ctx.strokeStyle = '#1b1030'; ctx.fillStyle = 'hsl(' + ((i * 72 + t * 200) % 360 | 0) + ',95%,65%)'; const px = cx + Math.cos(th) * R, py = cy + Math.sin(th) * R * 0.7; ctx.strokeText('M', px, py); ctx.fillText('M', px, py); } ctx.textBaseline = 'alphabetic'; }
      const tr = a.tr, n = tr.length; if (a.ph === 'dash' || a.ph === 'strike' || a.ph === 'rec') { let px = null, py = null; for (let j = 1; j <= n; j++) { const p = tr[(a.trI - j + n * 2) % n]; if (p.a <= 0.02) { px = null; continue; } if (px !== null) { ctx.globalAlpha = 0.8 * p.a; ctx.strokeStyle = 'hsl(' + ((j * 28 + t * 300) % 360 | 0) + ',95%,62%)'; ctx.lineWidth = 16 * p.a; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke(); } px = p.x; py = p.y; } }
      for (const z of a.zz) { const k = z.l / z.L; ctx.globalAlpha = k; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8 * k; ctx.beginPath(); ctx.moveTo(z.x1, z.y1); ctx.lineTo(z.x2, z.y2); ctx.stroke(); }
      if (a.stamp > 0) { const k = a.stamp / 0.8, s = 1 + (1 - k) * 1.2; ctx.save(); ctx.translate(a.ix, a.iy - 30); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, k * 1.6); ctx.font = 'bold 120px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 10; ctx.strokeStyle = '#1b1030'; ctx.fillStyle = '#fde047'; ctx.strokeText('M', 0, 0); ctx.fillText('M', 0, 0); ctx.restore(); }
    }},
};
