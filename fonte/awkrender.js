'use strict';
/* STICK MAYHEM v1.1.0 — render dos efeitos de AWAKENING (auras, trilhas, ondas, pilar de luz, distorção, zoom) */

function drawAwkBack(ctx, f, t) {
  const a = f.awk, A = f.m.cfg.awk;
  const P = f.pts, x = f.x, y = f.y - 52, low = GFX.low;
  // brilho "pronto" (barra cheia) quando fora da sequência
  if (!a) {
    if (A && A.on && f.energy >= 100 && f.alive && !f.ragdoll) {
      const C = AWK_TYPES[f.awkType] || AWK_TYPES.void, p = 0.55 + 0.45 * Math.sin(t * 6);
      ctx.save(); ctx.globalAlpha = 0.5 * p; ctx.strokeStyle = C.c; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 34 + 4 * p, 8 + p, 0, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 0.18 * p; ctx.fillStyle = C.c; ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 30, 7, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    return;
  }
  const k = a.aura; if (k <= 0.01) return;
  ctx.save();
  if (AWK2R[a.type]) { AWK2R[a.type].back(ctx, f, t, k); ctx.restore(); return; }
  if (a.type === 'void') {
    const R = 66 + 56 * k;
    ctx.globalAlpha = 0.92 * k;
    if (!low) { const g = ctx.createRadialGradient(x, y, 6, x, y, R); g.addColorStop(0, 'rgba(8,0,22,0.96)'); g.addColorStop(0.62, 'rgba(46,12,96,0.62)'); g.addColorStop(1, 'rgba(124,58,237,0)'); ctx.fillStyle = g; }
    else ctx.fillStyle = 'rgba(30,8,70,0.6)';
    ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.75 * k; ctx.beginPath();
    const N = low ? 14 : 28;
    for (let i = 0; i <= N; i++) { const th = i / N * 6.283, r = R * 0.8 + Math.sin(th * 7 + t * 9) * 9 * k + Math.sin(th * 3 - t * 5) * 6, px = x + Math.cos(th) * r * 0.78, py = y + Math.sin(th) * r; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath(); ctx.stroke();
  } else if (a.type === 'inferno') {
    const R = 64 + 50 * k;
    ctx.globalAlpha = 0.85 * k;
    if (!low) { const g = ctx.createRadialGradient(x, y, 6, x, y, R); g.addColorStop(0, 'rgba(255,240,170,0.8)'); g.addColorStop(0.45, 'rgba(251,120,40,0.55)'); g.addColorStop(1, 'rgba(180,30,10,0)'); ctx.fillStyle = g; }
    else ctx.fillStyle = 'rgba(251,120,40,0.45)';
    ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    // línguas de fogo
    ctx.globalAlpha = 0.9 * k; ctx.fillStyle = '#fb923c';
    const T = low ? 6 : 10;
    for (let i = 0; i < T; i++) {
      const bx = x + (i - (T - 1) / 2) * (56 / T) * 1.7, h = (34 + 24 * Math.sin(t * 13 + i * 1.9)) * k + 10;
      ctx.beginPath(); ctx.moveTo(bx - 6, f.y); ctx.quadraticCurveTo(bx + Math.sin(t * 9 + i) * 6, f.y - h * 0.6, bx + Math.sin(t * 11 + i) * 5, f.y - h - 30 * k); ctx.quadraticCurveTo(bx + 4, f.y - h * 0.4, bx + 6, f.y); ctx.fill();
    }
    ctx.fillStyle = '#fde047'; ctx.globalAlpha = 0.7 * k;
    for (let i = 0; i < T; i += 2) { const bx = x + (i - (T - 1) / 2) * (56 / T) * 1.7, h = (20 + 14 * Math.sin(t * 15 + i)) * k; ctx.beginPath(); ctx.moveTo(bx - 3, f.y); ctx.lineTo(bx, f.y - h - 12); ctx.lineTo(bx + 3, f.y); ctx.fill(); }
    // brilho no chão
    const fl = 0.55 + 0.45 * Math.sin(t * 18);
    ctx.globalAlpha = 0.5 * k * fl;
    if (!low) { const g2 = ctx.createRadialGradient(f.x, f.y, 4, f.x, f.y, 140 * k); g2.addColorStop(0, 'rgba(255,200,90,0.9)'); g2.addColorStop(1, 'rgba(255,80,20,0)'); ctx.fillStyle = g2; }
    else ctx.fillStyle = 'rgba(255,130,40,0.5)';
    ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 140 * k, 20 * k, 0, 0, 6.283); ctx.fill();
  } else {
    const R = 74 + 56 * k;
    ctx.globalAlpha = 0.95 * k;
    if (!low) { const g = ctx.createRadialGradient(x, y, 4, x, y, R); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.4, 'rgba(255,240,170,0.6)'); g.addColorStop(1, 'rgba(180,230,255,0)'); ctx.fillStyle = g; }
    else ctx.fillStyle = 'rgba(255,245,190,0.5)';
    ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    // raios giratórios
    ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#fff7d6';
    const rays = low ? 6 : 10;
    for (let i = 0; i < rays; i++) { const th = t * 0.9 + i / rays * 6.283, r1 = R * 1.1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(th - 0.07) * r1, y + Math.sin(th - 0.07) * r1); ctx.lineTo(x + Math.cos(th + 0.07) * r1, y + Math.sin(th + 0.07) * r1); ctx.fill(); }
    ctx.globalAlpha = 0.8 * k; ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y, R * 0.62, R * 0.62, 0, 0, 6.283); ctx.stroke();
  }
  ctx.restore();
}

function drawAwkFront(ctx, f, t) {
  const a = f.awk; if (!a) return;
  const C = AWK_TYPES[a.type], P = f.pts, low = GFX.low, tt = AWK_T[a.type];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // trilhas de movimento (anel de posições recentes, do mais novo para o mais antigo)
  const tr = a.tr, n = tr.length;
  if (a.ph === 'dash' || a.ph === 'blink' || a.ph === 'strike' || a.ph === 'rec') {
    let px = null, py = null;
    for (let j = 1; j <= n; j++) {
      const p = tr[(a.trI - j + n * 2) % n]; if (p.a <= 0.02) { px = null; continue; }
      if (px !== null) {
        const w = 26 * p.a;
        ctx.globalAlpha = 0.55 * p.a; ctx.strokeStyle = C.c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = 0.9 * p.a; ctx.strokeStyle = a.type === 'void' ? C.c3 : '#ffffff'; ctx.lineWidth = w * 0.3; ctx.stroke();
      }
      px = p.x; py = p.y;
    }
  }
  // brilho nas mãos / orbes de concentração
  const u = clamp(a.lt / tt.prep, 0, 1);
  if (a.ph === 'prep' || (a.type === 'celestial' && a.ph === 'blink')) {
    const hR = P[HDR], hL = P[HDL];
    const glow = (x, y, r, c1, c2) => {
      ctx.globalAlpha = 0.9;
      if (!low) { const g = ctx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; } else ctx.fillStyle = c1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    };
    if (a.type === 'void' && u > 0.35) glow(hR.x, hR.y, 8 + 22 * (u - 0.35) / 0.65, 'rgba(240,171,252,0.95)', 'rgba(60,10,120,0)');
    else if (a.type === 'inferno' && u > 0.3) { const r = 7 + 16 * u; glow(hR.x, hR.y, r, 'rgba(255,230,120,0.95)', 'rgba(251,90,30,0)'); glow(hL.x, hL.y, r, 'rgba(255,230,120,0.95)', 'rgba(251,90,30,0)'); }
    else if (a.type === 'celestial' && u > 0.35) { const r = 8 + 20 * u, mx = (hR.x + hL.x) / 2, my = (hR.y + hL.y) / 2; glow(mx, my, r, 'rgba(255,255,255,1)', 'rgba(255,240,170,0)'); }
  }
  // partículas orbitais (celestial)
  if (a.type === 'celestial' && a.aura > 0.2) {
    const cx = f.x, cy = f.y - 55, sp = 3.5 + 6 * (a.ph === 'prep' ? u : 1), N = low ? 6 : 12;
    ctx.fillStyle = '#fff7d6';
    for (let i = 0; i < N; i++) {
      const th = t * sp + i / N * 6.283, R = 50 + 14 * Math.sin(t * 3 + i * 2) + (a.ph === 'prep' ? (1 - u) * 20 : 0);
      ctx.globalAlpha = 0.9 * a.aura; ctx.beginPath(); ctx.arc(cx + Math.cos(th) * R, cy + Math.sin(th) * R * 0.7, 2.6 + (i % 3) * 0.7, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 0.3 * a.aura; ctx.beginPath(); ctx.arc(cx + Math.cos(th - 0.25) * R, cy + Math.sin(th - 0.25) * R * 0.7, 2, 0, 6.283); ctx.fill();
    }
  }
  if (AWK2R[a.type]) AWK2R[a.type].front(ctx, f, t, a, u);
  ctx.restore();
}

// camada sob os lutadores: escurecimento do cenário
function drawCineUnder(ctx, m) {
  const c = m.cine; if (c.dim <= 0.01) return;
  ctx.fillStyle = 'rgba(3,0,16,' + c.dim.toFixed(3) + ')'; ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40);
}
// camada sobre tudo: ondas de choque, pilar de luz, luz geral e flash
function drawCineOver(ctx, m) {
  const c = m.cine;
  for (const b of c.beams) {
    const a = b.l / b.L, e = 1 - a, w = (46 + 120 * easeO(Math.min(1, e * 2.2))) * Math.min(1, a * 2.2);
    ctx.fillStyle = b.c;
    ctx.globalAlpha = 0.25 * a; ctx.fillRect(b.x - w * 1.8, -10, w * 3.6, WORLD_H + 20);
    ctx.globalAlpha = 0.55 * a; ctx.fillRect(b.x - w, -10, w * 2, WORLD_H + 20);
    ctx.globalAlpha = 0.95 * a; ctx.fillRect(b.x - w * 0.42, -10, w * 0.84, WORLD_H + 20);
  }
  for (const s of c.shocks) {
    const a = s.l / s.L, r = s.r0 + (s.r1 - s.r0) * easeO(1 - a);
    ctx.globalAlpha = Math.min(1, a * 1.4); ctx.strokeStyle = s.c; ctx.lineWidth = s.w * a + 1.5;
    ctx.beginPath(); ctx.ellipse(s.x, s.y, r, r * 0.82, 0, 0, 6.283); ctx.stroke();
    ctx.globalAlpha = a * 0.7; ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1, s.w * a * 0.3);
    ctx.beginPath(); ctx.ellipse(s.x, s.y, r * 0.97, r * 0.8, 0, 0, 6.283); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (c.light > 0.01) { ctx.fillStyle = c.lightC; ctx.globalAlpha = Math.min(0.7, c.light * 0.8); ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40); ctx.globalAlpha = 1; }
  if (c.flash > 0.01) { ctx.fillStyle = c.flashC; ctx.globalAlpha = Math.min(1, c.flash); ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40); ctx.globalAlpha = 1; }
}

// distorção do cenário: fatias da própria imagem deslocadas por uma onda (só em qualidade Alto)
function distortPass(ctx, m, t) {
  const c = m.cine;
  if (GFX.low || c.dist < 0.03) return;
  const M = ctx.getTransform(), s = M.a, cvs = ctx.canvas, W = cvs.width, H = cvs.height;
  let x0 = (c.dx - c.dr) * s + M.e, y0 = (c.dy - c.dr) * s + M.f, w = c.dr * 2 * s, h = w;
  if (x0 < 0) { w += x0; x0 = 0; } if (y0 < 0) { h += y0; y0 = 0; }
  if (x0 + w > W) w = W - x0; if (y0 + h > H) h = H - y0;
  if (w < 8 || h < 8) return;
  const step = Math.max(3, Math.round(5 * s)), amp = c.dist * 5.5 * s * (1 + c.kick * 2), n = Math.floor(h / step);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < n; i++) {
    const yy = y0 + i * step, taper = Math.sin(i / n * Math.PI);
    const off = (c.dtype === 0 ? Math.sin(t * 10 + i * 0.55) : Math.sin(t * 15 + i * 0.95) * 0.7) * amp * taper;
    ctx.drawImage(cvs, x0, yy, w, step, x0 + off, yy, w, step);
  }
  ctx.restore();
}

// prévia animada (menu de cosméticos): partida isolada, sem dano real
const AwkPreview = {
  m: null, type: null, t: 0, cycle: 0, key: '',
  ensure(type, skin) {
    const key = type + '|' + skin.color + skin.accent + skin.hat + skin.acc + skin.mask + skin.glasses + skin.clothes;
    if (this.m && this.key === key) return;
    this.key = key; this.type = type; this.t = 0; this.cycle = 0;
    const sk = Object.assign({}, skin, {awk: type});
    this.m = new Match({mode: 'awkprev', arena: 'training', awk: {on: true, charge: 'normal', dmg: 'normal'}, hp: 300, format: 'stock', lives: 99}, {skin: sk, shake: false, fxMax: GFX.low ? 90 : 260});
    this.m.pvHold = true; this.reset();
  },
  reset() {
    const m = this.m, h = m.fighters[0], d = m.fighters[1];
    h.reset({x: 430, y: 600}, true); d.reset({x: 800, y: 600}, true); h.facing = 1; d.facing = -1; h.invuln = d.invuln = 0;
    m.cine.dim = m.cine.light = m.cine.flash = m.cine.dist = 0; m.cine.zoom = 1; m.cine.shocks.length = 0; m.cine.beams.length = 0; m.fx.rings.length = 0;
    m.pvHold = true; this.t = 0;
  },
  step(dt) {
    const m = this.m; if (!m) return;
    this.t += dt;
    const h = m.fighters[0];
    if (this.t > 0.7 && m.pvHold) { m.pvHold = false; h.energy = 100; h.input.awkP = true; }
    if (!m.pvHold && !h.awk && this.t > 5.2) this.reset();
    let n = 0, acc = (this._acc || 0) + dt;
    while (acc >= DT && n < 6) { m.update(DT); acc -= DT; n++; }
    this._acc = n >= 6 ? 0 : acc;
  },
};
