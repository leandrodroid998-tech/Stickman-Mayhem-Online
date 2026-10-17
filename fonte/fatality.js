'use strict';
/* STICK MAYHEM v1.3.0 — FATALITIES: 8 finalizações cinematográficas.
   Rodam em uma cena isolada (Match mode 'fatality'): nada de dano, placar ou vidas — só coreografia + ragdoll.
   Cada sequência tem animação, efeitos, câmera e duração próprios (não são trocas de cor). */

// poses [inclinação, agachar, passada, mão frente x, y, mão trás x, y, pé trás elevado]  (mãos relativas ao peito)
const FP = {
  idle: [0, 0, 8, 12, 24, -4, 26, 0], guard: [4, 6, 12, 22, -4, 14, -2, 0], punR: [14, 7, 16, 38, -2, 8, 6, 4], punL: [14, 7, 16, 10, 4, 38, -2, 4],
  wind: [-6, 8, 14, -10, 4, 20, -4, 0], windBig: [-12, 11, 17, -20, 0, 24, -8, 0], up: [0, -2, 10, 14, -34, -10, -34, 0], upWide: [0, -3, 12, 26, -36, -18, -34, 0],
  point: [8, 4, 14, 36, -8, -6, 10, 0], slam: [14, 12, 18, 26, 28, 14, 26, 0], crouch: [4, 16, 16, 20, 14, 8, 16, 0], lev: [0, 0, 5, 30, -12, -20, -12, 10],
  hurt: [-10, 12, 10, -4, 22, -2, 24, 0], stagger: [-16, 10, 12, -8, 18, -4, 20, 0], slash: [16, 9, 20, 34, -14, -6, 4, 4], slashB: [-14, 9, 20, -30, -20, 6, 0, 4],
  fistUp: [0, 0, 10, 10, -38, -6, 22, 0], flex: [0, 2, 10, 22, -14, -22, -14, 0], shield: [-8, 10, 14, 12, -14, 6, -12, 0], thrustD: [10, 8, 16, 24, 20, 12, 24, 0],
  fist2: [6, 6, 14, 20, -30, -14, -30, 0], spread: [0, 0, 12, 30, -4, -30, -4, 0], cross: [0, 2, 10, 14, -6, -14, -6, 0], skyR: [4, 2, 12, 20, -38, -4, 22, 0],
  limp: [-4, 4, 6, 2, 30, -2, 30, 6], sheath: [-8, 14, 18, 24, 12, -10, 8, 0],
};
const easeIO = u => u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
const ramp = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
function once(S, k) { if (S[k]) return false; S[k] = 1; return true; }
function pz(f, a, b, u) {
  const A = typeof a === 'string' ? FP[a] : a, B = b === undefined ? A : (typeof b === 'string' ? FP[b] : b);
  const o = f.fk || (f.fk = new Array(8).fill(0)); u = clamp(u === undefined ? 1 : u, 0, 1);
  for (let i = 0; i < 8; i++) o[i] = A[i] + (B[i] - A[i]) * u;
}
function fcam(m, x, y, z) { const c = m.cine; c.zx = x; c.zy = y; c.tZoom = z; }
function fflash(m, col, v) { const c = m.cine; c.flash = v; c.flashC = col; }

Object.assign(Fighter.prototype, {
  // pose por script (mesma ideia do awkPose, mas com tabela livre e caminhada opcional)
  scriptPose(k, walk) {
    const T = this.T, fx = this.facing, lean = k[0] * fx, crouch = k[1], stance = k[2];
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x; hip.y = this.y - 44 + crouch;
    ch.x = hip.x + lean; ch.y = hip.y - 30 + crouch * 0.1;
    hd.x = ch.x + lean * 0.35 + fx * 2; hd.y = ch.y - 22;
    for (let i = 0; i < 2; i++) {
      const front = i === 1; let fxp, fyp;
      if (walk !== null && walk !== undefined) { const ph = walk + i * Math.PI; fxp = this.x + fx * (front ? 7 : -7) + fx * Math.sin(ph) * 20; fyp = this.y - Math.max(0, Math.cos(ph)) * 13; }
      else { fxp = this.x + fx * (front ? stance : -stance * 0.95); fyp = this.y - (front ? 0 : k[7]); }
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const kn = T[front ? KNR : KNL], ft = T[front ? FTR : FTL]; kn.x = _o.ex; kn.y = _o.ey; ft.x = _o.hx; ft.y = _o.hy;
    }
    ik(ch.x, ch.y, ch.x + fx * k[5], ch.y + k[6], 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, ch.x + fx * k[3], ch.y + k[4], 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
    this.wAng = -0.9;
  },
  fatBody(dt) {
    if (this.ragdoll) { this.stepRagdoll(dt); this.capeStep(dt); return; }
    if (this.fk) { this.scriptPose(this.fk, this.fw); this.smoothPose(this.fs || 1); }
    this.capeStep(dt);
  },
  fatSnap() {   // encaixa o corpo na pose atual de uma vez (sem suavização)
    this.vx = this.vy = 0; this.ragdoll = false; this.scriptPose(this.fk, this.fw);
    for (let i = 0; i < 11; i++) { const p = this.pts[i], t = this.T[i]; p.x = p.px = t.x; p.y = p.py = t.y; }
    this.capeReset();
  },
});

const FATSEQ = {};
Object.assign(Match.prototype, {
  fatStart(id) {
    const m = this, F = this.fighters, h = F[0], v = F[1];
    m.plats = m.plats.filter(p => !p.pad);                    // reinício (prévia em laço): remove o palco extra anterior
    const cn = m.cine; cn.dim = cn.tDim = cn.light = cn.tLight = cn.flash = cn.dist = cn.tDist = cn.zp = cn.kick = cn.rot = 0; cn.zoom = cn.tZoom = 1; cn.shocks.length = 0; cn.beams.length = 0;
    m.fx.rings.length = 0; m.fx.texts.length = 0; m.fx.beams.length = 0; m.fx.shake = 0; for (const p of m.fx.pool) p.l = 0;
    let best = null;
    for (const arenaPlat of this.arena.plats) { if (!arenaPlat.solid || arenaPlat.move || arenaPlat.w < 300 || arenaPlat.h > 400) continue; if (!best || arenaPlat.w > best.w) best = arenaPlat; }
    const gy = best ? best.y : 560, cx = 640;
    // palco limpo: um piso contínuo (com o visual da arena) e paredes invisíveis, para o ragdoll nunca cair no abismo
    const mk = (x, y, w, h, o) => Object.assign({x, y, w, h, solid: true, bx: x, by: y, dx: 0, dy: 0, pad: true}, o || {});
    m.plats = [mk(-60, gy, 1400, 160, best && best.ice ? {ice: true} : null), mk(-120, -600, 100, 2000, {inv: true}), mk(WORLD_W + 20, -600, 100, 2000, {inv: true})];
    const S = FATSEQ[id]; if (!S) throw new Error('fatality desconhecida: ' + id);
    this.stage = {cx, gy};
    this.fat = {id, t: 0, dur: S.dur, impact: S.impact, done: false, S: {}, bars: 0, name: FATS[id].name};
    this.timeScale = 1; this.cine.rot = 0;
    for (const f of F) { f.hidden = false; f.fScale = 1; f.fw = null; f.fs = 1; f.y = gy; f.vx = f.vy = 0; f.ragdoll = false; f.alive = true; f.hp = f.maxhp; f.invuln = 0; f.celebrate = false; f.wp = null; }
    h.facing = 1; v.facing = -1; h.x = cx - 240; v.x = cx + 90;
    pz(h, 'idle'); pz(v, 'hurt'); h.fatSnap(); v.fatSnap();
    S.init && S.init(m, h, v, this.fat.S, this.stage);
  },
  fatUpdate(dt) {
    const f = this.fat; if (!f) return;
    const h = this.fighters[0], v = this.fighters[1], st = this.stage;
    this.timeScale = 1; this.cine.rot = this.cine.rot || 0;
    f.t += dt; f.bars = Math.min(1, f.t / 0.5);
    FATSEQ[f.id].step(this, h, v, f.t, dt, f.S, st);
    // rede de segurança: oponente que sair do cenário volta ao palco, deitado
    if (v.ragdoll && !v.hidden && (v.pts[HIP].y > st.gy + 260 || v.pts[HIP].x < -120 || v.pts[HIP].x > WORLD_W + 120)) {
      v.ragdoll = false; v.x = st.cx + 160; v.y = st.gy; pz(v, 'limp'); v.fatSnap(); v.toRagdoll(40, 20, 99);
    }
    if (!f.done && f.t >= f.dur) f.done = true;
  },
  fatHit(x, y, col, big) {   // pequeno "pacote" de impacto reutilizável
    const m = this;
    m.fx.burst(x, y, big ? 26 : 12, big ? 760 : 520, big ? 0.7 : 0.4, 4, col, 200, 0);
    m.addShock(x, y, 8, big ? 360 : 140, big ? 0.6 : 0.3, col, big ? 9 : 5);
    m.fx.addShake(big ? 16 : 6);
  },
});

/* ============ 1. IRON FIST ============ */
FATSEQ.iron = {
  dur: 6.2, impact: 3.32,
  init(m, h, v, S) { S.n = 0; S.glow = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, P = [1.5, 1.72, 1.94, 2.16, 2.38], vb = cx + 90;
    const mid = (h.x + v.x) / 2;
    if (t < 1.1) {
      const u = ramp(t, 0, 1.1); h.x = lerp(cx - 240, cx - 36, easeIO(u)); h.fw = t * 15; pz(h, 'idle', 'guard', ramp(t, 0.7, 1.1)); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5));
      fcam(m, mid, gy - 90, 1.2 + 0.15 * u); m.cine.tDim = 0.25 * u;
    } else if (t < P[0]) { h.fw = null; pz(h, 'guard', 'wind', ramp(t, 1.1, 1.5)); pz(v, 'stagger'); fcam(m, mid, gy - 90, 1.4); m.cine.tDim = 0.25; }
    else if (t < 2.62) {
      h.fw = null; let i = 0; while (i < 4 && t >= P[i + 1]) i++;
      const lt = (t - P[i]) / 0.22, pulse = Math.sin(clamp(lt, 0, 1) * Math.PI);
      pz(h, 'guard', i % 2 ? 'punL' : 'punR', pulse);
      if (S.n <= i && lt >= 0.3) {
        S.n = i + 1; const hp = h.pts[i % 2 ? HDL : HDR];
        m.fatHit(hp.x + 8, hp.y, FATS.iron.c, false); SFX.play('fat_punch'); m.fx.text(v.x, gy - 150, ['POW', 'BAM', 'CRACK', 'WHAM', 'BOOM'][i], '#fde047');
        v.x = vb + 7 * S.n; m.cine.zp = 0.06; v.flash = 0.08;
      }
      pz(v, 'stagger', 'hurt', 0.5 + 0.5 * Math.sin(t * 38)); v.fk[0] = -16 - 8 * pulse;
      fcam(m, mid, gy - 90, 1.45);
    } else if (t < 3.3) {
      const u = ramp(t, 2.62, 3.3); pz(h, 'wind', 'windBig', u); S.glow = u; pz(v, 'stagger'); v.x = vb + 35;
      m.timeScale = lerp(1, 0.4, u); fcam(m, mid, gy - 100, 1.5 + 0.35 * u); m.cine.tDim = 0.25 + 0.3 * u;
      if (Math.random() < 0.6) { const hp = h.pts[HDR]; m.fx.add(hp.x + rnd(-10, 10), hp.y + rnd(-10, 10), rnd(-40, 40), -rnd(40, 140), 0.4, 3, Math.random() < 0.5 ? '#fde047' : '#fb923c', 0, 1); }
      if (t > 2.7 && once(S, 'ch')) SFX.play('fat_charge');
    } else {
      const lt = t - 3.3;
      if (once(S, 'hit')) {
        pz(h, 'punR'); h.fk[0] = 20; h.fk[3] = 42;
        const hp = h.pts[HDR]; m.fatHit(hp.x + 20, hp.y, '#ffffff', true); m.addShock(hp.x + 20, hp.y, 10, 560, 0.8, '#fbbf24', 10); m.addShock(hp.x + 20, hp.y, 10, 760, 1.0, '#f97316', 7);
        fflash(m, '#fff3c4', 0.9); SFX.play('fat_mega'); m.cine.zp = 0.2; m.cine.kick = 1;
        v.fScale = 1; v.toRagdoll(2100, -850, 99); S.glow = 0; m.fx.burst(v.pts[HIP].x, v.pts[HIP].y, 20, 600, 0.6, 4, '#fff', 0, 0);
      }
      m.timeScale = lt < 0.8 ? 0.3 : lerp(0.3, 1, ramp(lt, 0.8, 1.3));
      const vx = clamp(v.pts[HIP].x, 200, 1080), vy = clamp(v.pts[HIP].y, 120, gy);
      if (lt < 1.2) fcam(m, lerp(h.x, vx, 0.7), Math.min(gy - 100, vy), 1.25); else fcam(m, (h.x + vx) / 2, gy - 120, 1.1);
      m.cine.tDim = 0.3 * (1 - ramp(lt, 1, 2));
      if (lt < 0.45) pz(h, 'punR'); else pz(h, 'punR', 'fistUp', ramp(lt, 0.45, 1.0));
      if (lt > 2.3) pz(h, 'fistUp', 'flex', 0.5 + 0.5 * Math.sin(t * 6));
    }
  },
};

/* ============ 2. THUNDER GOD ============ */
FATSEQ.thunder = {
  dur: 6.6, impact: 3.6,
  init(m, h, v, S) { S.nf = 1.2; S.bolt = null; S.mini = [{x: 0, t0: -9}, {x: 0, t0: -9}, {x: 0, t0: -9}]; S.mn = 0; S.cl = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, mid = (h.x + v.x) / 2;
    if (t < 1.0) { const u = ramp(t, 0, 1); h.x = lerp(cx - 240, cx - 150, easeIO(u)); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.15); }
    else if (t < 3.0) {
      h.fw = null; const u = ramp(t, 1.0, 3.0); pz(h, 'idle', 'up', ramp(t, 1, 1.5)); h.fk[3] += Math.sin(t * 40) * 1.2; S.cl = ramp(t, 1, 2);
      c.tDim = 0.7 * Math.min(1, u * 2); fcam(m, h.x + 40, gy - 130, 1.25 + 0.1 * u); pz(v, 'stagger');
      if (once(S, 'c0')) SFX.play('fat_charge');
      if (t > S.nf) { S.nf = t + lerp(0.5, 0.12, u); c.flash = 0.35; c.flashC = '#bfdbfe'; m.fx.addShake(4); if (Math.random() < 0.6) SFX.play('fat_rumble'); }
      if (Math.random() < 0.5) m.fx.add(h.x + rnd(-40, 40), h.y - rnd(20, 130), rnd(-120, 120), rnd(-120, 40), 0.25, 2.5, Math.random() < 0.5 ? '#fde047' : '#93c5fd', 0, 0);
    } else if (t < 3.6) {
      pz(h, 'up', 'point', ramp(t, 3.0, 3.3)); S.cl = 1; c.tDim = 0.78; fcam(m, v.x - 40, gy - 110, 1.5); m.timeScale = lerp(1, 0.5, ramp(t, 3.2, 3.6)); pz(v, 'stagger');
      if (once(S, 'tel')) SFX.play('fat_charge');
    } else {
      const lt = t - 3.6; S.cl = 1;
      if (once(S, 'strike')) {
        S.bolt = {x: v.x, t0: t, pts: []}; let x = v.x + rnd(-30, 30); const n = 12;
        for (let i = 0; i <= n; i++) { S.bolt.pts.push(i === n ? v.x : x, -40 + (gy - 120 + 40) * i / n); x += rnd(-46, 46) * (1 - i / n); }
        m.fatHit(v.x, gy - 110, '#fde047', true); m.addShock(v.x, gy, 10, 520, 0.7, '#93c5fd', 8); m.addShock(v.x, gy, 10, 760, 0.9, '#ffffff', 5);
        fflash(m, '#ffffff', 1); c.zp = 0.15; c.kick = 1; SFX.play('fat_thunder'); m.fx.burst(v.x, gy - 100, 40, 800, 0.8, 3, '#fde047', 300, 0);
      }
      c.tDim = 0.78 * (1 - ramp(lt, 1.8, 3.0)) + 0.1;
      m.timeScale = lt < 0.7 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.7, 1.2));
      if (lt < 0.9) { v.x = cx + 90 + Math.sin(t * 90) * 3; pz(v, 'stagger'); v.fk[3] = -22 + Math.sin(t * 70) * 10; v.fk[4] = -20; v.flash = 0.08 + ((t * 20) | 0) % 2 * 0.1; if (Math.random() < 0.7) m.fx.add(v.x + rnd(-24, 24), v.y - rnd(0, 100), rnd(-200, 200), rnd(-200, 100), 0.3, 3, '#fde047', 0, 0); }
      else if (once(S, 'pop')) { v.toRagdoll(260, -900, 99); m.fx.burst(v.x, v.y - 50, 14, 400, 0.5, 3, '#93c5fd', 300, 0); }
      for (let i = 0; i < 3; i++) if (lt > 1.0 + i * 0.35 && !S['m' + i]) { S['m' + i] = 1; S.mini[i].x = rnd(cx - 380, cx + 400); S.mini[i].t0 = t; m.fx.burst(S.mini[i].x, gy, 14, 500, 0.5, 3, '#fde047', 300, 0); SFX.play('fat_zap'); c.flash = 0.4; c.flashC = '#bfdbfe'; }
      if (lt < 1.2) fcam(m, v.x, gy - 100, 1.45); else fcam(m, mid, gy - 120, 1.2);
      if (lt < 1.1) pz(h, 'point'); else pz(h, 'point', 'up', ramp(lt, 1.1, 1.5));
      if (lt > 1.6 && Math.random() < 0.4) m.fx.add(h.x + rnd(-30, 30), h.y - rnd(20, 130), rnd(-100, 100), rnd(-100, 20), 0.25, 2.5, '#fde047', 0, 0);
    }
  },
};

/* ============ 3. METEOR CRASH ============ */
FATSEQ.meteor = {
  dur: 6.9, impact: 3.9,
  init(m, h, v, S, st) { S.m = {on: false, x: 0, y: 0, r: 46}; S.tr = []; for (let i = 0; i < 16; i++) S.tr.push(0, 0); S.tn = 0; S.cr = 0; S.glow = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, mid = (h.x + v.x) / 2, vx0 = cx + 90, M = S.m;
    S.glow = ramp(t, 1.0, 3.9);
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 150, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    else if (t < 3.9) {
      h.fw = null; pz(h, 'idle', 'crouch', ramp(t, 1, 1.4)); if (t > 1.4) pz(h, 'crouch', 'skyR', ramp(t, 1.4, 2.0));
      pz(v, 'stagger'); if (v.fk) v.fk[3] += Math.sin(t * 7) * 2;
      c.tDim = 0.5 * Math.min(1, (t - 1) / 0.8); c.tLight = 0.08 * S.glow; c.lightC = '#fb923c';
      if (once(S, 'c0')) SFX.play('fat_charge');
      if (t >= 2.0) {
        if (!M.on) { M.on = true; SFX.play('fat_meteor'); }
        const u = ramp(t, 2.0, 3.9), k = Math.pow(u, 1.7), sx = cx + 860, sy = -260, tx = vx0, ty = gy - 60;
        M.x = sx + (tx - sx) * k; M.y = sy + (ty - sy) * k; M.r = 30 + 32 * u;
        S.tn = (S.tn + 1) % 16; S.tr[S.tn * 2] = M.x; S.tr[S.tn * 2 + 1] = M.y;
        for (let i = 0; i < 3; i++) m.fx.add(M.x + rnd(-14, 14), M.y + rnd(-14, 14), rnd(60, 260) * (0.5 + u), -rnd(40, 200), rnd(0.3, 0.7), rnd(3, 7), Math.random() < 0.5 ? '#fb923c' : (Math.random() < 0.5 ? '#fde047' : '#7f1d1d'), 50, 1);
        m.timeScale = lerp(1, 0.4, ramp(t, 3.2, 3.9));
        fcam(m, lerp(mid, (M.x + vx0) / 2, 0.4 * u), lerp(gy - 110, (M.y + gy) / 2, 0.45 * u), 1.15 + 0.4 * u);
        m.fx.addShake(u * 3);
      }
    } else {
      const lt = t - 3.9;
      if (once(S, 'hit')) {
        M.on = false; S.cr = 1;
        m.fatHit(vx0, gy - 20, '#fff3c4', true); m.addShock(vx0, gy, 10, 560, 0.7, '#fb923c', 10); m.addShock(vx0, gy, 10, 820, 0.95, '#ef4444', 8); m.addShock(vx0, gy, 10, 1100, 1.2, '#7f1d1d', 6);
        m.fx.burst(vx0, gy - 20, 44, 900, 1.0, 5, '#fb923c', 600, 0); m.fx.burst(vx0, gy - 20, 24, 620, 1.2, 8, '#57534e', 900, 2); m.fx.burst(vx0, gy - 20, 18, 700, 0.8, 7, '#44403c', 900, 2);
        fflash(m, '#fff1c9', 1); c.zp = 0.22; c.kick = 1; SFX.play('fat_boom'); v.toRagdoll(720, -1500, 99);
      }
      m.timeScale = lt < 0.9 ? 0.3 : lerp(0.3, 1, ramp(lt, 0.9, 1.5));
      c.tDim = 0.5 * (1 - ramp(lt, 0.5, 2.2)); c.tLight = 0.08 * (1 - ramp(lt, 0, 0.8));
      const hip = v.pts[HIP]; if (lt < 1.4) fcam(m, lerp(vx0, clamp(hip.x, 200, 1080), 0.6), Math.min(gy - 100, hip.y), 1.3); else fcam(m, mid, gy - 110, 1.15);
      if (lt < 0.45) { pz(h, 'skyR', 'shield', ramp(lt, 0, 0.12)); h.x = lerp(cx - 150, cx - 190, easeO(ramp(lt, 0, 0.4))); } else pz(h, 'shield', 'flex', ramp(lt, 0.5, 1.4));
      if (lt > 2.1) pz(h, 'flex', 'fistUp', 0.5 + 0.5 * Math.sin(t * 5));
      if (lt > 0.2 && lt < 2.6 && Math.random() < 0.7) m.fx.add(rnd(vx0 - 600, vx0 + 500), -20, rnd(-30, 30), rnd(60, 160), 1.6, rnd(2, 4), Math.random() < 0.5 ? '#fb923c' : '#fde047', 60, 1);
      S.cr = 1 - ramp(lt, 2.5, 3.0) * 0.4;
    }
  },
};

/* ============ 4. SHADOW EXECUTION ============ */
FATSEQ.shadow = {
  dur: 6.3, impact: 3.5,
  init(m, h, v, S) {
    S.gh = []; for (let i = 0; i < 6; i++) S.gh.push(new Float32Array(22)); S.ng = 0; S.sl = []; S.smoke = 0;
    S.T = [1.45, 1.75, 2.05, 2.35, 2.65, 2.95]; S.O = [[-95, 0], [105, -70], [-60, -120], [120, 0], [-115, -45], [0, -135]]; S.burst = -9;
  },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    if (t < 0.9) { h.x = lerp(cx - 240, cx - 120, easeIO(ramp(t, 0, 0.9))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.15); c.tDim = 0.2 * ramp(t, 0, 0.9); }
    else if (t < 1.45) {
      h.fw = null; pz(h, 'idle', 'crouch', ramp(t, 0.9, 1.3)); c.tDim = 0.8; pz(v, 'stagger'); fcam(m, mid, gy - 100, 1.3);
      if (t > 1.3 && once(S, 'van')) { h.hidden = true; m.fx.burst(h.x, h.y - 50, 40, 420, 0.9, 6, '#1a0b33', 0, 1); m.fx.burst(h.x, h.y - 50, 20, 300, 0.8, 4, '#a78bfa', 0, 1); SFX.play('fat_vanish'); }
    } else if (t < 3.2) {
      c.tDim = 0.8; pz(v, 'stagger'); fcam(m, vx0, gy - 100, 1.5);
      for (let i = 0; i < 6; i++) {
        const T0 = S.T[i];
        if (t >= T0 && !S['s' + i]) {
          S['s' + i] = 1; const o = S.O[i], px = vx0 + o[0], py = gy + o[1];
          h.hidden = false; h.x = px; h.y = py; h.facing = o[0] < 0 ? 1 : -1; pz(h, 'slash'); h.fatSnap();
          const g = S.gh[S.ng % 6]; S.ng++; for (let k = 0; k < 11; k++) { g[k * 2] = h.pts[k].x; g[k * 2 + 1] = h.pts[k].y; }
          S.sl.push({x1: px, y1: py - 60, x2: vx0 - o[0] * 0.8, y2: gy - 60 - o[1] * 0.6 + rnd(-30, 30), t0: t});
          m.fx.burst(px, py - 55, 14, 420, 0.5, 4, '#a78bfa', 0, 1); m.addShock(vx0, gy - 60, 6, 90, 0.3, '#e9d5ff', 4); SFX.play('fat_slash'); m.fx.addShake(5);
          v.x = vx0 + (i % 2 ? 6 : -6); m.cine.zp = 0.05;
        }
        if (S['s' + i] && t > T0 + 0.13 && !S['h' + i]) { S['h' + i] = 1; h.hidden = true; m.fx.burst(h.x, h.y - 55, 8, 200, 0.5, 4, '#1a0b33', 0, 1); }
      }
      pz(v, 'stagger'); v.fk[0] = -16 + Math.sin(t * 50) * 4;
    } else if (t < 3.5) {
      if (once(S, 'back')) { h.hidden = false; h.y = gy; h.x = vx0 + 85; h.facing = 1; m.fx.burst(h.x, h.y - 55, 24, 360, 0.7, 5, '#a78bfa', 0, 1); SFX.play('fat_vanish'); }
      pz(h, 'sheath'); pz(v, 'stagger'); fcam(m, mid, gy - 90, 1.35); c.tDim = 0.8; m.timeScale = lerp(1, 0.4, ramp(t, 3.2, 3.5));
    } else {
      const lt = t - 3.5;
      if (once(S, 'boom')) {
        S.burst = t; fflash(m, '#e9d5ff', 0.9); m.addShock(vx0, gy - 60, 10, 460, 0.7, '#a78bfa', 9); m.addShock(vx0, gy - 60, 10, 700, 0.9, '#1a0b33', 7);
        m.fx.burst(vx0, gy - 60, 40, 800, 0.8, 4, '#f5f3ff', 100, 0); m.fx.burst(vx0, gy - 60, 24, 500, 1.0, 6, '#1a0b33', 0, 1); SFX.play('fat_slash'); SFX.play('fat_boom'); c.zp = 0.15; c.kick = 1; m.fx.addShake(16);
        v.toRagdoll(-650, -850, 99);
      }
      m.timeScale = lt < 0.6 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.6, 1.1));
      c.tDim = 0.8 * (1 - ramp(lt, 0.8, 2.4));
      if (lt < 0.4) pz(h, 'sheath', 'idle', ramp(lt, 0.1, 0.4)); else { if (lt > 0.4 && once(S, 'turn')) h.facing = -1; pz(h, 'idle', 'fistUp', ramp(lt, 0.5, 1.2)); }
      const hip = v.pts[HIP]; fcam(m, lerp(mid, clamp(hip.x, 200, 1080), 0.5), gy - 100, lt < 1.4 ? 1.3 : 1.15);
    }
  },
};

/* ============ 5. GRAVITY BREAKER ============ */
FATSEQ.gravity = {
  dur: 6.7, impact: 3.75,
  init(m, h, v, S, st) {
    S.r = []; for (let i = 0; i < 10; i++) S.r.push({x: st.cx + rnd(-340, 360), y: st.gy, vy: 0, a: rnd(0, 6), va: rnd(-2, 2), s: rnd(10, 22), hy: rnd(80, 270), ph: rnd(0, 6), mode: 0});
    S.cr = []; for (let i = 0; i < 9; i++) S.cr.push(-3.14 + (i + rnd(0.1, 0.9)) * 3.14 / 9, rnd(110, 260)); S.cx = 0; S.on = 0; S.field = 0;
  },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    S.field = t >= 1.2 && t < 3.75 ? ramp(t, 1.2, 2.0) : 0;
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 190, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    if (t >= 1.0 && t < 3.4) {
      h.fw = null; const u = ramp(t, 1.0, 1.9); h.y = gy - 70 * easeO(u) - Math.sin(t * 3) * 3; pz(h, 'idle', 'lev', u); c.tDim = 0.4 * u;
      if (once(S, 'c0')) SFX.play('fat_grav');
      const vu = easeO(ramp(t, 1.6, 2.7)); v.y = gy - 140 * vu - Math.sin(t * 2.4) * 4; pz(v, 'stagger', 'limp', vu); v.fs = 0.5;
      c.tDist = 0.5 * u; c.dtype = 0; c.dx = vx0; c.dy = v.y - 50; c.dr = 240;
      fcam(m, mid, gy - 140, 1.3);
      for (const r of S.r) {
        if (r.mode === 0 && t > 1.0 + (r.hy - 80) / 190 * 0.8) { r.mode = 1; r.vy = -rnd(220, 420); }
        if (r.mode === 1) { r.y += r.vy * dt; r.vy += (r.y > gy - r.hy ? 0 : 0) ; if (r.y < gy - r.hy) { r.y = gy - r.hy; r.mode = 2; } r.a += r.va * dt; if (Math.random() < 0.2) m.fx.add(r.x, r.y + 10, 0, 40, 0.4, 2, '#cbd5e1', 0, 1); }
        else if (r.mode === 2) { r.a += r.va * dt; r.y = gy - r.hy + Math.sin(t * 2 + r.ph) * 8; }
      }
      if (Math.random() < 0.4) m.fx.add(vx0 + rnd(-120, 120), gy, 0, -rnd(80, 220), 0.9, 2.5, '#7dd3fc', 0, 1);
      if (t > 2.8) { pz(h, 'lev', 'fist2', ramp(t, 2.8, 3.2)); S.pull = ramp(t, 2.8, 3.4); }
    }
    if (t >= 3.4) {
      const lt = t - 3.4;
      if (t < 3.75) {
        const u = ramp(t, 3.4, 3.75); v.y = gy - 140 + 140 * u * u; pz(h, 'fist2', 'thrustD', ramp(t, 3.4, 3.6)); h.y = gy - 70; v.fs = 1;
        for (const r of S.r) { r.x += (vx0 - r.x) * dt * 3 * u; r.y += (gy - 60 - r.y) * dt * 2 * u; }
        m.timeScale = lerp(1, 0.5, u); fcam(m, vx0, gy - 100, 1.4 + 0.2 * u);
      } else {
        const it = t - 3.75;
        if (once(S, 'hit')) {
          v.y = gy; pz(v, 'limp'); v.fatSnap(); v.toRagdoll(80, -420, 99); S.cx = vx0; S.on = 1;
          m.fatHit(vx0, gy - 6, '#bae6fd', true); m.addShock(vx0, gy - 6, 10, 640, 0.8, '#38bdf8', 10); m.addShock(vx0, gy - 6, 10, 960, 1.1, '#818cf8', 7);
          m.fx.burst(vx0, gy - 6, 40, 700, 0.9, 5, '#cbd5e1', 300, 1); m.fx.burst(vx0, gy - 6, 30, 900, 0.6, 3, '#7dd3fc', 400, 0);
          fflash(m, '#dbeafe', 0.8); c.zp = 0.2; c.kick = 1; SFX.play('fat_slam'); S.field = 0;
          for (const r of S.r) { r.mode = 3; r.vy = -rnd(0, 380); r.va = rnd(-5, 5); }
        }
        m.timeScale = it < 0.7 ? 0.35 : lerp(0.35, 1, ramp(it, 0.7, 1.2));
        h.y = lerp(gy - 70, gy, easeO(ramp(it, 0, 0.6))); if (it < 0.5) pz(h, 'thrustD', 'slam', ramp(it, 0, 0.3)); else pz(h, 'slam', 'flex', ramp(it, 0.7, 1.6));
        if (it > 2.2) pz(h, 'flex', 'fistUp', 0.5 + 0.5 * Math.sin(t * 5));
        c.tDim = 0.4 * (1 - ramp(it, 0, 1.6)); c.tDist = 0.6 * (1 - ramp(it, 0, 0.4)); c.dx = vx0; c.dy = gy - 40; c.dr = 300;
        for (const r of S.r) if (r.mode === 3) { r.vy += 1500 * dt; r.y += r.vy * dt; r.x += Math.sin(r.a) * 40 * dt; r.a += r.va * dt; if (r.y > gy - r.s * 0.4) { r.y = gy - r.s * 0.4; r.vy = r.vy > 160 ? -r.vy * 0.3 : 0; r.va *= 0.6; if (r.vy < -60) m.fx.burst(r.x, gy, 4, 220, 0.4, 3, '#94a3b8', 300, 1); } }
        const hip = v.pts[HIP]; fcam(m, lerp(h.x, hip.x, 0.6), gy - 110, 1.3);
      }
    }
  },
};

/* ============ 6. BLADE STORM ============ */
FATSEQ.blade = {
  dur: 6.4, impact: 3.55,
  init(m, h, v, S) { S.b = new Float32Array(18); S.on = 1; S.tr = new Float32Array(24); S.tn = 0; S.xs = 0; S.spin = 0; S.mode = 0; S.fx = -9; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    const oc = {x: h.x, y: h.y - 62}, vc = {x: vx0, y: gy - 62};
    S.spin += dt * (t < 2.2 ? lerp(3, 13, ramp(t, 1, 2.2)) : t < 3.0 ? 14 : 6);
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 130, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); S.mode = 0; }
    else if (t < 3.0) {
      h.fw = null; pz(h, 'idle', 'spread', ramp(t, 1, 1.6)); pz(v, 'stagger'); c.tDim = 0.35 * ramp(t, 1, 1.8); fcam(m, mid, gy - 110, 1.3);
      if (once(S, 'c0')) SFX.play('fat_charge');
      const fly = easeIO(ramp(t, 2.2, 2.9));
      for (let i = 0; i < 6; i++) {
        const a = S.spin + i * 1.0472, r0 = 64, r1 = 78 + 10 * Math.sin(S.spin * 0.7 + i);
        const ox = oc.x + Math.cos(a) * r0, oy = oc.y + Math.sin(a) * r0 * 0.75, ex = vc.x + Math.cos(-a * 1.3) * r1, ey = vc.y + Math.sin(-a * 1.3) * r1 * 0.85;
        S.b[i * 3] = lerp(ox, ex, fly); S.b[i * 3 + 1] = lerp(oy, ey, fly); S.b[i * 3 + 2] = a + fly * 3;
        if (Math.random() < 0.25) m.fx.add(S.b[i * 3], S.b[i * 3 + 1], rnd(-30, 30), rnd(-30, 30), 0.3, 2.5, '#a5f3fc', 0, 1);
      }
      if (t > 2.3) { v.x = vx0 + Math.sin(t * 60) * 2; v.fk[0] = -18; }
      if (t > 2.5) pz(h, 'spread', 'slash', ramp(t, 2.5, 2.95));
    } else if (t < 3.55) {
      const u = ramp(t, 3.0, 3.22), lt = t - 3.0;
      if (once(S, 'dash')) { SFX.play('fat_whoosh'); S.xs = h.x; }
      if (t < 3.22) { h.x = lerp(S.xs, cx + 230, easeIO(u)); pz(h, 'slash'); S.tn = (S.tn + 1) % 12; S.tr[S.tn * 2] = h.x; S.tr[S.tn * 2 + 1] = h.y - 55; c.tDim = 0.35; m.fx.add(h.x, h.y - rnd(20, 90), -rnd(100, 300), 0, 0.3, 4, '#a5f3fc', 0, 1); }
      else { h.facing = 1; pz(h, 'slash', 'sheath', ramp(t, 3.22, 3.4)); }
      if (u > 0.5 && once(S, 'cross')) { m.addShock(vx0, gy - 60, 6, 130, 0.3, '#ffffff', 5); m.fx.burst(vx0, gy - 60, 16, 600, 0.4, 3, '#e0f2fe', 0, 0); m.fx.addShake(6); SFX.play('fat_slash'); }
      for (let i = 0; i < 6; i++) { const a = S.spin + i * 1.0472; S.b[i * 3] = vc.x + Math.cos(-a * 1.3) * 80; S.b[i * 3 + 1] = vc.y + Math.sin(-a * 1.3) * 68; S.b[i * 3 + 2] = a * 1.3; }
      m.timeScale = lerp(1, 0.45, ramp(t, 3.25, 3.55)); fcam(m, vx0, gy - 100, 1.45);
    } else {
      const lt = t - 3.55;
      if (once(S, 'boom')) {
        S.on = 0; S.fx = t; fflash(m, '#e0f2fe', 0.9); m.addShock(vx0, gy - 60, 10, 480, 0.7, '#67e8f9', 9); m.addShock(vx0, gy - 60, 10, 740, 0.9, '#e0f2fe', 6);
        for (let i = 0; i < 6; i++) m.fx.burst(S.b[i * 3], S.b[i * 3 + 1], 8, 600, 0.7, 3, i % 2 ? '#67e8f9' : '#ffffff', 100, 0);
        m.fx.burst(vx0, gy - 60, 30, 900, 0.7, 4, '#a5f3fc', 100, 0); SFX.play('fat_slash'); SFX.play('fat_boom'); c.zp = 0.15; c.kick = 1; m.fx.addShake(15);
        v.toRagdoll(-1300, -900, 99); h.facing = -1;
      }
      m.timeScale = lt < 0.6 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.6, 1.1));
      c.tDim = 0.35 * (1 - ramp(lt, 0.5, 1.6));
      pz(h, 'sheath', 'idle', ramp(lt, 0.0, 0.5)); if (lt > 0.6) pz(h, 'idle', 'fistUp', ramp(lt, 0.6, 1.3));
      const hip = v.pts[HIP]; fcam(m, lerp(h.x, clamp(hip.x, 200, 1080), 0.5), gy - 100, lt < 1.4 ? 1.3 : 1.12);
    }
  },
};

/* ============ 7. VOID CONSUMPTION ============ */
FATSEQ.void = {
  dur: 7.0, impact: 4.3,
  init(m, h, v, S, st) { S.sx = st.cx + 70; S.sy = st.gy - 95; S.r = 0; S.core = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 170, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    else if (t < 3.2) {
      h.fw = null; pz(h, 'idle', 'point', ramp(t, 1, 1.5)); pz(v, 'stagger'); const u = ramp(t, 1.2, 3.2); S.r = 124 * easeI(u) + 8 * Math.sin(t * 9) * u;
      c.tDim = 0.62 * Math.min(1, u * 1.6 + 0.3); c.tDist = 0.9 * u; c.dtype = 0; c.dx = S.sx; c.dy = S.sy; c.dr = 120 + S.r * 1.6; fcam(m, mid, gy - 110, 1.25 + 0.25 * u);
      if (once(S, 'c0')) SFX.play('fat_void');
      h.fxPull(S.sx, S.sy, 120 + S.r * 1.6, 2, Math.random() < 0.3 ? '#f0abfc' : '#a78bfa', 0.4);
      if (u > 0.5) { v.x = vx0 - (u - 0.5) * 20; }
    } else if (t < 4.3) {
      const u = ramp(t, 3.2, 4.3), k = easeI(u);
      S.r = 124 + 14 * Math.sin(t * 20) - 30 * ramp(t, 4.0, 4.3);
      v.x = lerp(vx0 - 10, S.sx, k); v.y = lerp(gy, S.sy + 55, easeO(u)); v.fScale = lerp(1, 0.12, k);
      pz(v, 'stagger', 'limp', 0.5 + 0.5 * Math.sin(t * 24)); v.fk[3] = -20 + Math.sin(t * 30) * 14; v.fk[4] = -26 + Math.cos(t * 27) * 14; v.fs = 1;
      pz(h, 'point'); h.x = lerp(cx - 170, cx - 205, easeO(u)); h.fk[0] = -2 - 8 * u;
      c.tDim = 0.65; c.tDist = 0.95; c.dx = S.sx; c.dy = S.sy; c.dr = 300; fcam(m, S.sx - 30, gy - 105, 1.55 + 0.1 * u); m.timeScale = lerp(1, 0.6, u);
      h.fxPull(S.sx, S.sy, 280, 3, Math.random() < 0.3 ? '#f0abfc' : '#7c3aed', 0.35); m.fx.addShake(4 + 4 * u);
    } else {
      const lt = t - 4.3;
      if (once(S, 'boom')) {
        v.hidden = true; S.r = 0; fflash(m, '#f5e9ff', 1); m.addShock(S.sx, S.sy, 10, 520, 0.7, '#c084fc', 10); m.addShock(S.sx, S.sy, 10, 800, 0.95, '#1e0b3a', 9); m.addShock(S.sx, S.sy, 10, 1100, 1.2, '#f0abfc', 6);
        m.fx.burst(S.sx, S.sy, 50, 900, 1.1, 5, '#c084fc', 0, 1); m.fx.burst(S.sx, S.sy, 30, 700, 1.2, 8, '#1e0b3a', 0, 1); m.fx.burst(S.sx, S.sy, 24, 1100, 0.6, 3, '#ffffff', 0, 0);
        SFX.play('fat_boom'); c.zp = 0.2; c.kick = 1; c.dist = 1; m.fx.addShake(18);
      }
      m.timeScale = lt < 0.7 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.7, 1.3));
      c.tDim = 0.65 * (1 - ramp(lt, 0.4, 2)); c.tDist = 0.7 * (1 - ramp(lt, 0, 0.6)); c.dx = S.sx; c.dy = S.sy; c.dr = 320;
      h.x = lerp(cx - 205, cx - 180, ramp(lt, 0.2, 1)); if (lt < 0.5) pz(h, 'point', 'shield', ramp(lt, 0, 0.12)); else pz(h, 'shield', 'idle', ramp(lt, 0.5, 1.1));
      if (lt > 1.2) pz(h, 'idle', 'fist2', ramp(lt, 1.2, 1.9));
      fcam(m, lerp(S.sx, mid, ramp(lt, 0.8, 1.8)), gy - 110, lerp(1.5, 1.15, ramp(lt, 0.5, 1.8)));
      if (lt < 2.2 && Math.random() < 0.5) m.fx.add(S.sx + rnd(-200, 200), S.sy + rnd(-120, 120), rnd(-30, 30), rnd(-60, 20), 1.0, rnd(2, 4), Math.random() < 0.5 ? '#c084fc' : '#1e0b3a', 0, 1);
    }
  },
};

/* ============ 8. GOD OF MAYHEM ============ */
FATSEQ.god = {
  dur: 9.8, impact: 5.1,
  init(m, h, v, S) { S.aura = 0; S.rune = 0; S.ring = 0; S.rays = 0; S.chain = 0; S.name = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    S.rune += dt * (1 + 3 * ramp(t, 2.6, 5));
    if (t < 1.2) { h.x = lerp(cx - 240, cx - 160, easeIO(ramp(t, 0, 1.2))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    else if (t < 5.1) {
      h.fw = null; const a = ramp(t, 1.2, 2.6); S.ring = ramp(t, 1.4, 2.4); S.aura = ramp(t, 1.4, 3.0);
      if (t < 2.0) pz(h, 'idle', 'cross', ramp(t, 1.2, 1.8)); else if (t < 2.7) pz(h, 'cross', 'upWide', ramp(t, 2.0, 2.7)); else if (t < 4.4) { pz(h, 'upWide'); h.fk[3] += Math.sin(t * 7) * 3; } else pz(h, 'upWide', 'windBig', ramp(t, 4.4, 4.9));
      h.y = gy - 90 * easeO(ramp(t, 1.8, 3.4)) - Math.sin(t * 3) * 3;
      c.tDim = 0.78 * Math.min(1, a * 1.4); c.tLight = 0.05 * S.aura; c.lightC = '#f0abfc';
      c.rot = 0.13 * Math.sin(ramp(t, 1.6, 4.8) * Math.PI) * 1.0; fcam(m, mid, gy - 150, lerp(1.25, 1.65, ramp(t, 1.4, 3.0)));
      if (once(S, 'c0')) SFX.play('fat_god');
      if (t > 3.4) { S.chain = ramp(t, 3.4, 4.4); const vu = easeO(ramp(t, 3.4, 4.6)); v.y = gy - 90 * vu; pz(v, 'stagger', 'limp', vu); v.fs = 0.5; v.x = vx0 + Math.sin(t * 40) * 1.5 * S.chain; }
      else pz(v, 'stagger');
      if (Math.random() < 0.7) { const th = rnd(0, 6.283); m.fx.add(h.x + Math.cos(th) * 150, h.y - 60 + Math.sin(th) * 100, -Math.cos(th) * 140, -Math.sin(th) * 100, 0.7, rnd(2, 4), ['#f0abfc', '#fde047', '#67e8f9'][(Math.random() * 3) | 0], 0, 1); }
      if (t > 4.4) { m.timeScale = lerp(1, 0.4, ramp(t, 4.6, 5.1)); }
      if (t > 4.8 && once(S, 'tel')) SFX.play('fat_charge');
    } else {
      const lt = t - 5.1; S.aura = 1; S.rune = S.rune;
      if (once(S, 'hit')) {
        S.rays = 1; pz(h, 'point'); fflash(m, '#ffffff', 1);
        m.addShock(h.x + 30, h.y - 60, 10, 700, 0.8, '#ffffff', 12); m.addShock(h.x + 30, h.y - 60, 10, 980, 1.0, '#f0abfc', 9); m.addShock(h.x + 30, h.y - 60, 10, 1260, 1.25, '#fde047', 7); m.addShock(h.x + 30, h.y - 60, 10, 1500, 1.5, '#67e8f9', 5);
        m.fx.burst(v.x, v.y - 50, 50, 1000, 1.0, 5, '#f0abfc', 100, 0); m.fx.burst(v.x, v.y - 50, 30, 800, 1.0, 5, '#fde047', 100, 0); m.fx.burst(h.x + 30, h.y - 60, 40, 900, 0.8, 4, '#ffffff', 0, 0);
        SFX.play('fat_boom'); SFX.play('fat_god'); c.zp = 0.25; c.kick = 1; m.fx.addShake(18); S.chain = 0;
        v.fScale = 1; v.toRagdoll(2400, -1200, 99);
      }
      m.timeScale = lt < 1.0 ? 0.25 : lerp(0.25, 1, ramp(lt, 1.0, 1.7));
      const hip = v.pts[HIP]; c.rot = 0.13 * (1 - ramp(lt, 0.6, 2.6)) * Math.cos(lt * 2);
      if (lt < 0.9) fcam(m, lerp(h.x, clamp(hip.x, 200, 1080), 0.7), gy - 120, 1.35); else fcam(m, h.x + 60, gy - 130, lerp(1.35, 1.5, ramp(lt, 1, 2.5)));
      c.tDim = 0.78 - 0.4 * ramp(lt, 1.5, 3.5); c.tLight = 0.05;
      h.y = lerp(gy - 90, gy, easeO(ramp(lt, 0.9, 1.9)));
      if (lt < 0.8) pz(h, 'point'); else if (lt < 2.2) pz(h, 'point', 'fist2', ramp(lt, 0.8, 1.6)); else pz(h, 'fist2', 'fistUp', ramp(lt, 2.2, 2.9));
      S.rays = 1 - ramp(lt, 2.6, 4.2); S.ring = 1 - ramp(lt, 2.8, 4.4); S.aura = lt < 3.0 ? 1 : 1 - 0.4 * ramp(lt, 3, 4); S.name = ramp(lt, 0.9, 2.2);
      if (lt > 2.0 && lt < 4.2 && Math.random() < 0.6) m.fx.add(h.x + rnd(-60, 60), h.y - rnd(0, 130), rnd(-40, 40), -rnd(60, 200), 1.0, rnd(2, 4), ['#f0abfc', '#fde047', '#67e8f9'][(Math.random() * 3) | 0], 0, 1);
    }
  },
};
