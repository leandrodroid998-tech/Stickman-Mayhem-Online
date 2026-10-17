/* STICK MAYHEM v1.3.0 — render de cosméticos novos: capas, asas, jetpack, chapéus, máscaras, decorações de skin, efeitos e vitória */
const COS_TAU = 6.283;
function cosDrawCape(ctx, f, t, acc) {
  const sk = f.skin, d = CAPES[sk.cape]; if (!d) return;
  const cn = f.capeN, N = d.n, HW = d.hw, kind = sk.cape;
  const col = kind === 'royal' ? '#b91c1c' : kind === 'cosmic' ? '#1e1b4b' : kind === 'tattered' ? shade(acc, -0.4) : shade(acc, -0.25);
  ctx.fillStyle = f.flash > 0 ? '#fff' : col; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath();
  let mx = 0, my = 0;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < N; i++) {
      const k = pass ? N - 1 - i : i, a = cn[Math.max(0, k - 1)], b = cn[Math.min(N - 1, k + 1)];
      let tx = b.x - a.x, ty = b.y - a.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const sg = pass ? 1 : -1;
      let w = HW[k] + (k === N - 1 ? Math.sin(t * 8 + (pass ? 1 : 0)) * 0.8 : 0);
      if (kind === 'tattered' && k >= N - 3) w *= (((k + pass) & 1) ? 0.55 : 1.05);
      const px = cn[k].x - ty * w * sg, py = cn[k].y + tx * w * sg;
      if (!pass && i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      if (kind === 'tattered' && pass === 0 && k === N - 1) { ctx.lineTo(cn[k].x + tx * 6, cn[k].y + ty * 6); }
    }
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  if (f.flash > 0) return;
  if (kind === 'royal') { // barra dourada e debrum
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.lineCap = 'butt';
    const a = cn[N - 1], b = cn[N - 2]; let tx = a.x - b.x, ty = a.y - b.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const w = HW[N - 1] - 1.5; ctx.beginPath(); ctx.moveTo(a.x + ty * w, a.y - tx * w); ctx.lineTo(a.x - ty * w, a.y + tx * w); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; for (let i = 2; i < N; i += 2) { ctx.beginPath(); ctx.arc(cn[i].x, cn[i].y, 1.7, 0, COS_TAU); ctx.fill(); }
  } else if (kind === 'cosmic') {
    ctx.fillStyle = '#e9d5ff'; for (let i = 1; i < N; i++) { const tw = 0.5 + 0.5 * Math.sin(t * 4 + i * 2.1); ctx.globalAlpha = 0.5 + 0.5 * tw; ctx.beginPath(); ctx.arc(cn[i].x + ((i & 1) ? 2.5 : -2.5), cn[i].y, 1.2 + tw * 0.8, 0, COS_TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  } else if (kind === 'classic' || kind === 'long' || kind === 'short') {
    ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cn[0].x, cn[0].y); for (let i = 1; i < N; i++) ctx.lineTo(cn[i].x, cn[i].y); ctx.stroke();
  }
}
function cosDrawBack(ctx, f, t, acc) {
  const sk = f.skin, P = f.pts, fx = f.facing;
  if (sk.acc === 'wingsA' || sk.acc === 'wingsD') {
    const A = sk.acc === 'wingsA', fl = Math.sin(t * (f.grounded ? 3 : 8)) * 0.16 + (f.grounded ? 0 : 0.3);
    ctx.save(); ctx.translate(P[CHEST].x - fx * 3, P[CHEST].y + 3); ctx.scale(-fx, 1);
    const fe = [[-1.25, 30], [-0.95, 36], [-0.62, 38], [-0.3, 34], [0.0, 28]];
    for (let layer = 0; layer < 2; layer++) {
      ctx.save(); ctx.rotate(layer ? fl * 0.6 : fl); if (layer) ctx.scale(0.8, 0.8);
      for (const [a, l] of fe) {
        ctx.save(); ctx.rotate(a); ctx.beginPath();
        if (A) { ctx.moveTo(0, 0); ctx.quadraticCurveTo(l * 0.5, -7, l, 0); ctx.quadraticCurveTo(l * 0.5, 6, 0, 0); ctx.fillStyle = layer ? '#e2e8f0' : '#ffffff'; }
        else { ctx.moveTo(0, 0); ctx.lineTo(l * 0.55, -6); ctx.lineTo(l, 0); ctx.lineTo(l * 0.5, 3); ctx.closePath(); ctx.fillStyle = layer ? '#2a1646' : '#3b1d6b'; }
        ctx.fill(); ctx.strokeStyle = A ? 'rgba(250,204,21,.9)' : '#a855f7'; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
    if (A && !GFX.low) { const g = ctx.createRadialGradient(P[CHEST].x - fx * 14, P[CHEST].y - 8, 4, P[CHEST].x - fx * 14, P[CHEST].y - 8, 46); g.addColorStop(0, 'rgba(254,240,138,.28)'); g.addColorStop(1, 'rgba(254,240,138,0)'); ctx.fillStyle = g; ctx.fillRect(P[CHEST].x - fx * 14 - 50, P[CHEST].y - 58, 100, 100); }
  } else if (sk.acc === 'jetpack') {
    ctx.save(); const mx = (P[CHEST].x + P[HIP].x) / 2 - fx * 8, my = (P[CHEST].y + P[HIP].y) / 2 - 2;
    ctx.translate(mx, my); ctx.rotate(Math.atan2(P[CHEST].x - P[HIP].x, P[HIP].y - P[CHEST].y));
    const fire = !f.grounded && f.alive;
    for (const ox of [-4.5, 4.5]) {
      if (fire) { ctx.fillStyle = 'rgba(255,170,40,.9)'; ctx.beginPath(); ctx.moveTo(ox - 3, 13); ctx.lineTo(ox, 21 + Math.random() * 9); ctx.lineTo(ox + 3, 13); ctx.fill(); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.moveTo(ox - 1.5, 13); ctx.lineTo(ox, 17 + Math.random() * 4); ctx.lineTo(ox + 1.5, 13); ctx.fill(); }
      ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = OUT; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.rect(ox - 3.6, -13, 7.2, 26); ctx.fill(); ctx.stroke();
      ctx.fillStyle = acc; ctx.fillRect(ox - 3.6, -3, 7.2, 4);
    }
    ctx.restore();
  }
}
// camada "por baixo" do corpo (neon / glitch): contornos deslocados
function cosDrawUnder(ctx, f, t, acc) {
  const d = f.skin.deco; if (d !== 'neonoutline' && d !== 'glitch') return;
  const P = f.pts, ch = [[HIP, CHEST], [HIP, KNL, FTL], [HIP, KNR, FTR], [CHEST, ELL, HDL], [CHEST, ELR, HDR]];
  const stroke = (col, ox, oy, w, al) => {
    ctx.globalAlpha *= al; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const c of ch) { ctx.beginPath(); ctx.moveTo(P[c[0]].x + ox, P[c[0]].y + oy); for (let i = 1; i < c.length; i++) ctx.lineTo(P[c[i]].x + ox, P[c[i]].y + oy); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(P[HEAD].x + ox, P[HEAD].y + oy, 11 + w * 0.3, 0, COS_TAU); ctx.stroke();
    ctx.globalAlpha /= al;
  };
  if (d === 'neonoutline') { stroke(acc, 0, 0, 20, 0.28); stroke(acc, 0, 0, 15, 0.9); }
  else { const j = ((t * 14) | 0) % 5 === 0 ? 5 : 3; stroke('#22d3ee', -j, 0, 12, 0.6); stroke('#f43f5e', j, 1, 12, 0.6); }
}
function cosTorso(ctx, f, fn) {
  const P = f.pts, fx = f.facing; ctx.save();
  ctx.translate((P[HIP].x + P[CHEST].x) / 2, (P[HIP].y + P[CHEST].y) / 2);
  ctx.rotate(Math.atan2(P[CHEST].x - P[HIP].x, -(P[CHEST].y - P[HIP].y))); ctx.scale(fx, 1); fn(); ctx.restore();
}
// decorações do corpo (depois do tronco e roupas)
function cosDrawDeco(ctx, f, t, acc, body) {
  const d = f.skin.deco; if (!d || f.flash > 0) return;
  const P = f.pts, fx = f.facing;
  const seg = (a, b, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const mid = (a, b, k) => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k});
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  switch (d) {
    case 'ninja': cosTorso(ctx, f, () => { ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillRect(-7, 8, 14, 4); ctx.strokeRect(-7, 8, 14, 4); ctx.beginPath(); ctx.moveTo(-6, 11); ctx.lineTo(-15 - Math.abs(f.vx) * 0.03, 16 + Math.sin(t * 7) * 2); ctx.lineTo(-9, 13); ctx.closePath(); ctx.fill(); ctx.stroke(); }); break;
    case 'circuit': {
      ctx.strokeStyle = acc; ctx.lineWidth = 1.6; ctx.globalAlpha *= 0.55 + 0.45 * Math.sin(t * 5) * Math.sin(t * 5);
      cosTorso(ctx, f, () => { ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -4); ctx.lineTo(5, 0); ctx.lineTo(5, 8); ctx.moveTo(0, -4); ctx.lineTo(-5, 1); ctx.lineTo(-5, 10); ctx.stroke(); ctx.fillStyle = acc; for (const [x, y] of [[0, -12], [5, 8], [-5, 10]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, COS_TAU); ctx.fill(); } });
      for (const c of [[HIP, KNL], [HIP, KNR], [CHEST, ELL], [CHEST, ELR]]) seg(mid(P[c[0]], P[c[1]], 0.25), mid(P[c[0]], P[c[1]], 0.8), 1.8, acc);
      ctx.globalAlpha = f.invuln > 0 && f.invuln < 90 && ((t * 12) | 0) & 1 ? 0.45 : (f.awk && f.awk.ph === 'blink' ? 0.3 : 1); break;
    }
    case 'flameveins': {
      const pu = 0.65 + 0.35 * Math.sin(t * 6);
      ctx.strokeStyle = '#fdba74'; ctx.lineWidth = 2; ctx.globalAlpha *= pu;
      cosTorso(ctx, f, () => { ctx.beginPath(); ctx.moveTo(-3, -12); ctx.lineTo(1, -6); ctx.lineTo(-2, 0); ctx.lineTo(3, 6); ctx.lineTo(0, 12); ctx.stroke(); });
      for (const c of [[HIP, KNL, FTL], [HIP, KNR, FTR], [CHEST, ELL, HDL], [CHEST, ELR, HDR]]) { const a = mid(P[c[0]], P[c[1]], 0.2), b = mid(P[c[0]], P[c[1]], 0.85), m = {x: (a.x + b.x) / 2 + 2, y: (a.y + b.y) / 2}; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.x, m.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      ctx.globalAlpha = f.invuln > 0 && f.invuln < 90 && ((t * 12) | 0) & 1 ? 0.45 : (f.awk && f.awk.ph === 'blink' ? 0.3 : 1); break;
    }
    case 'icespikes':
      ctx.fillStyle = '#e0f2fe'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.8;
      for (const [o, ang] of [[0, -0.3], [-1, -0.9], [1, 0.4]]) { const cx = P[CHEST].x + o * 6 - fx * 2, cy = P[CHEST].y - 3; ctx.beginPath(); ctx.moveTo(cx - 3, cy); ctx.lineTo(cx + Math.sin(ang) * 14, cy - 14 + o * 2); ctx.lineTo(cx + 3, cy); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      for (const k of [HDL, HDR]) { ctx.beginPath(); ctx.moveTo(P[k].x - 3, P[k].y - 3); ctx.lineTo(P[k].x, P[k].y - 11); ctx.lineTo(P[k].x + 3, P[k].y - 3); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      break;
    case 'champion':
      cosTorso(ctx, f, () => { ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillRect(-8, 6, 16, 5); ctx.strokeRect(-8, 6, 16, 5); ctx.fillStyle = '#fff7ad'; ctx.beginPath(); ctx.arc(0, 8.5, 4, 0, COS_TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0, 8.5, 1.6, 0, COS_TAU); ctx.fill(); });
      for (const k of [HDL, HDR]) { ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(k === HDL ? P[HDL].x : P[HDR].x, k === HDL ? P[HDL].y : P[HDR].y, 5.6, 0.2, 2.9); ctx.fill(); }
      break;
    case 'voidrift':
      cosTorso(ctx, f, () => { ctx.fillStyle = '#05010d'; ctx.strokeStyle = acc; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(1, -3, 3.4, 11, 0.12, 0, COS_TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f5d0fe'; for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; ctx.fillRect(1 + Math.sin(a) * 1.4 - 0.7, -3 + Math.cos(a * 0.8) * 7, 1.5, 1.5); } });
      break;
    case 'wraps':
      ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 4;
      for (const c of [[ELL, HDL], [ELR, HDR]]) { const a = mid(P[c[0]], P[c[1]], 0.35), b = mid(P[c[0]], P[c[1]], 0.95); seg(a, b, 6.5, '#fff'); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.3; for (let k = 0; k < 4; k++) { const p = mid(a, b, k / 3); ctx.beginPath(); ctx.moveTo(p.x - 3.5, p.y - 2); ctx.lineTo(p.x + 3.5, p.y + 2); ctx.stroke(); } }
      break;
    case 'badge':
      cosTorso(ctx, f, () => { ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 2.4 : 6, a = -1.57 + i * 0.628; ctx.lineTo(3 + Math.cos(a) * r, -6 + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke(); });
      break;
    case 'thunderbolt':
      cosTorso(ctx, f, () => { ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(2, -13); ctx.lineTo(-4, -2); ctx.lineTo(0, -2); ctx.lineTo(-3, 9); ctx.lineTo(5, -4); ctx.lineTo(1, -4); ctx.closePath(); ctx.fill(); ctx.stroke(); });
      if ((((t * 10) | 0) & 3) === 0) { ctx.strokeStyle = acc; ctx.lineWidth = 1.5; for (const k of [HDL, HDR]) { ctx.beginPath(); ctx.moveTo(P[k].x, P[k].y); ctx.lineTo(P[k].x + Math.sin(t * 70) * 9, P[k].y - 8); ctx.lineTo(P[k].x + Math.cos(t * 60) * 6, P[k].y - 15); ctx.stroke(); } }
      break;
    case 'glitch':
      ctx.fillStyle = '#22d3ee'; for (let i = 0; i < 3; i++) { const s = ((t * 9 + i * 7) | 0), y = P[CHEST].y + ((s * 37 + i * 11) % 36) - 6; if (s % 3) ctx.fillRect(P[HIP].x - 10 + ((s * 13) % 8), y, 16 + (s % 5) * 2, 2.2); }
      break;
    case 'mayhemM':
      cosTorso(ctx, f, () => { ctx.fillStyle = '#fde047'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(-6, -9); ctx.lineTo(0, -1); ctx.lineTo(6, -9); ctx.lineTo(6, 6); ctx.lineTo(3, 6); ctx.lineTo(3, -2); ctx.lineTo(0, 3); ctx.lineTo(-3, -2); ctx.lineTo(-3, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); });
      break;
  }
}
// chapéus e máscaras novos (espaço da cabeça: +x = frente)
function cosDrawHat(ctx, sk, acc, t, f) {
  const body = sk.color;
  switch (sk.hat) {
    case 'halo': { const y = -21 + Math.sin(t * 3) * 1.4; ctx.strokeStyle = 'rgba(253,224,71,.35)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, y, 10, 3.4, 0, 0, COS_TAU); ctx.stroke(); ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke(); break; }
    case 'hood': ctx.fillStyle = shade(body, -0.1); ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-1, 0, 13, -1.05, 1.15, true); ctx.quadraticCurveTo(6, 6, 9, -3); ctx.quadraticCurveTo(10, -8, 8.5, -10.5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(-15, -21); ctx.lineTo(-1, -12.5); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
    case 'crest': ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { const x = -9 + i * 4.6, h = 10 + Math.sin(i * 1.7 + t * 6) * 2 + (i === 2 ? 5 : 0); ctx.beginPath(); ctx.moveTo(x - 3, -7); ctx.lineTo(x + 0.5, -7 - h); ctx.lineTo(x + 3.5, -7); ctx.closePath(); ctx.fill(); ctx.stroke(); } break;
    case 'kabuto': ctx.fillStyle = shade(acc, -0.5); ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, -1, 12.6, Math.PI, 0); ctx.lineTo(14, 4); ctx.lineTo(-14, 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(-13, -14, -15, -26); ctx.quadraticCurveTo(-6, -17, 0, -13); ctx.quadraticCurveTo(6, -17, 15, -26); ctx.quadraticCurveTo(13, -14, 0, -12); ctx.fill(); ctx.stroke(); break;
    case 'spacehelm': ctx.fillStyle = 'rgba(186,230,253,.26)'; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 15.2, 0, COS_TAU); ctx.fill(); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 11.5, -2.5, -1.4); ctx.stroke(); ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillRect(-9, 11, 18, 5); ctx.strokeRect(-9, 11, 18, 5); break;
  }
}
function cosDrawMask(ctx, sk, acc, t, flash) {
  if (sk.mask === 'skull') {
    ctx.fillStyle = flash ? '#fff' : '#e5e7eb'; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 11.4, 0, COS_TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(5, -2, 3.2, 3.8, 0, 0, COS_TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-3, -2, 3.2, 3.8, 0, 0, COS_TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1, 2); ctx.lineTo(0, 5); ctx.lineTo(2.2, 5); ctx.fill(); ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4; ctx.beginPath(); for (let x = -6; x <= 8; x += 3.5) { ctx.moveTo(x, 6.5); ctx.lineTo(x, 10); } ctx.stroke();
  } else if (sk.mask === 'glitch') {
    const s = (t * 10) | 0; ctx.fillStyle = '#0b0b12'; ctx.fillRect(-1, -8, 13, 9); ctx.fillStyle = '#22d3ee'; ctx.fillRect(3 + (s % 3), -6, 7, 2); ctx.fillStyle = '#f43f5e'; ctx.fillRect(2 - (s % 2) * 2, -3, 7, 2); ctx.fillStyle = '#fff'; ctx.fillRect(5, -5, 2, 2);
    if (s % 4 === 0) { ctx.fillStyle = '#22d3ee'; ctx.fillRect(-11, 4, 22, 2); }
  }
}
// partículas que seguem o personagem (limitadas, só se qualidade permite)
function cosFollowFx(f, t) {
  const fxn = f.skin.fx; if (GFX.low || !fxn || f.hidden) return;
  const P = f.pts, m = f.m; if (!m || !m.fx || Math.random() > 0.22) return;
  const x = P[CHEST].x + rnd(-8, 8), y = P[HIP].y + rnd(-30, 14);
  if (fxn === 'embers') m.fx.add(x, y, rnd(-15, 15), -rnd(30, 70), 0.9, 3.2, Math.random() < 0.5 ? '#fb923c' : '#fde68a', 0, 0);
  else if (fxn === 'frost') m.fx.add(x, y + 10, rnd(-10, 10), rnd(10, 40), 0.9, 3, Math.random() < 0.5 ? '#e0f2fe' : '#7dd3fc', 0, 0);
  else if (fxn === 'stars') m.fx.add(x, y, rnd(-25, 25), rnd(-25, 25), 0.8, 3.4, Math.random() < 0.5 ? '#fde047' : '#f0abfc', 0, 0);
  else if (fxn === 'void') m.fx.add(x, y, rnd(-12, 12), rnd(-20, 5), 1.0, 5, Math.random() < 0.5 ? '#6d28d9' : '#1e0b3a', 0, 0);
  else if (fxn === 'electric') m.fx.add(x, y, rnd(-70, 70), rnd(-70, 70), 0.14, 2.4, Math.random() < 0.5 ? '#fde047' : '#93c5fd', 0, 0);
}
// efeitos de vitória (desenhados à frente do personagem)
function cosDrawCele(ctx, f, t0) {
  const t = f.celeT;
  const wa = f.winAnim, P = f.pts, hx = P[CHEST].x, hy = P[CHEST].y;
  const m = f.m, rate = GFX.low ? 0.06 : 0.16;
  switch (wa) {
    case 4: if (m && Math.random() < rate) m.fx.add(hx + rnd(-40, 40), hy - 90, rnd(-30, 30), rnd(30, 90), 1.6, 4, Math.random() < 0.5 ? '#fbbf24' : '#fff7ad', 0, 0); break;
    case 5: if (m && Math.random() < rate) m.fx.add(hx + rnd(-16, 16), P[HIP].y + 24, rnd(-18, 18), -rnd(10, 40), 1.1, 6, Math.random() < 0.5 ? '#3b1d6b' : '#a78bfa', 0, 0);
      ctx.globalAlpha = 0.25; ctx.fillStyle = '#a78bfa'; ctx.beginPath(); ctx.ellipse(P[HIP].x, P[HIP].y + 40, 34, 7, 0, 0, COS_TAU); ctx.fill(); ctx.globalAlpha = 1; break;
    case 6: { const ph = (t * 0.9) % 1.6; if (ph < 0.2) { const x = P[HDR].x + Math.sin(t * 50) * 4; ctx.strokeStyle = 'rgba(147,197,253,.55)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x, -20); ctx.lineTo(x + 8, 120); ctx.lineTo(x - 6, 220); ctx.lineTo(x + 2, P[HDR].y - 4); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,' + (0.18 - ph) + ')'; ctx.fillRect(0, 0, 1280, 720); } break; }
    case 7: for (let i = 0; i < 4; i++) { const a = t * 1.8 + i * 1.57; ctx.fillStyle = i & 1 ? '#fde047' : '#c4b5fd'; ctx.beginPath(); ctx.arc(P[HIP].x + Math.cos(a) * 32, P[HIP].y + Math.sin(a) * 9 - 6, 3.6, 0, COS_TAU); ctx.fill(); }
      ctx.globalAlpha = 0.2; ctx.fillStyle = '#c4b5fd'; ctx.beginPath(); ctx.ellipse(P[HIP].x, f.y + 2, 24 - Math.sin(t * 2.4) * 3, 5, 0, 0, COS_TAU); ctx.fill(); ctx.globalAlpha = 1; break;
    case 8: { const hd = P[HDR], wid = f.wp ? f.wp.id : 'sword'; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(hd.x, hd.y, 30, f.wAng - 1.6, f.wAng); ctx.stroke();
      ctx.save(); ctx.translate(hd.x, hd.y); ctx.rotate(f.wAng); wShape(ctx, WEAPONS[wid] && WEAPONS[wid].type === 'melee' ? wid : 'sword', 0); ctx.restore(); break; }
    case 9: { const ph = (t % 2.2); if (ph < 0.9) { const k = ph / 0.9; ctx.strokeStyle = 'rgba(103,232,249,' + (1 - k) + ')'; ctx.lineWidth = 7 * (1 - k) + 1; ctx.beginPath(); ctx.arc(P[CHEST].x, P[CHEST].y, 20 + k * 130, 0, COS_TAU); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,' + (1 - k) + ')'; ctx.lineWidth = 2; ctx.stroke(); }
      if (ph < 0.12 && m) m.fx.burst && m.fx.burst(P[CHEST].x, P[CHEST].y, 8, 220, 0.6, 4, '#67e8f9', 0, 0); break; }
    case 10: if (m && Math.random() < rate) m.fx.add(hx + rnd(-26, 26), hy + rnd(-30, 20), rnd(-8, 8), -rnd(10, 30), 1.0, 3, '#fde68a', 0, 0);
      ctx.globalAlpha = 0.18 + 0.08 * Math.sin(t * 3); ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(P[HIP].x, P[HIP].y - 20, 54, 0, COS_TAU); ctx.fill(); ctx.globalAlpha = 1; break;
    case 11: if (m && Math.random() < rate * 1.5) m.fx.add(hx + rnd(-40, 40), hy - 80, rnd(-40, 40), rnd(20, 90), 1.5, 4, 'hsl(' + ((t * 200 + Math.random() * 120) % 360 | 0) + ',90%,60%)', 0, 0);
      ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.fillStyle = '#fde047'; ctx.strokeText('M', P[HEAD].x, P[HEAD].y - 36 - Math.abs(Math.sin(t * 7)) * 6); ctx.fillText('M', P[HEAD].x, P[HEAD].y - 36 - Math.abs(Math.sin(t * 7)) * 6); break;
  }
}
