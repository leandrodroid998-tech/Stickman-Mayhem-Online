'use strict';
/* STICK MAYHEM v1.4.0 — ONLINE: salas com código de convite, até 4 jogadores.
   Transporte: WebRTC (RTCDataChannel) peer-a-peer; a sinalização usa o protocolo do servidor PeerJS
   (WebSocket) — por padrão o servidor público 0.peerjs.com, configurável. O HOST é autoritativo:
   roda a simulação inteira e envia "snapshots"; os convidados enviam apenas os controles. */
const NET_PROTO = 1, NET_MAX = 4, NET_PREFIX = 'smayhem-';
const NET_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#facc15'];
const NET_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';           // sem 0/O/1/I
const NET_ICE = [
  {urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:global.stun.twilio.com:3478']},
  {urls: ['turn:eu-0.turn.peerjs.com:3478', 'turn:us-0.turn.peerjs.com:3478'], username: 'peerjs', credential: 'peerjsp'},
];
const NET_SIG0 = {host: '0.peerjs.com', port: 443, path: '/', secure: true, key: 'peerjs'};

function netCode() { let s = ''; for (let i = 0; i < 6; i++) s += NET_ALPHA[(Math.random() * NET_ALPHA.length) | 0]; return s; }
function netNormCode(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); }
function netRid() { return 'c' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function netClean(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>&"'`\\]/g, '').trim().slice(0, n || 12); }
const NET_HEX = /^#[0-9a-fA-F]{6}$/;
// o que vem da rede nunca é confiado: só chaves conhecidas, com valores válidos
function netSkin(s, slot) {
  s = s && typeof s === 'object' ? s : {};
  const str = (v, d) => (typeof v === 'string' ? netClean(v, 24) : d);
  const o = {color: NET_HEX.test(s.color) ? s.color : NET_COLORS[slot], accent: NET_HEX.test(s.accent) ? s.accent : '#22d3ee',
    hat: str(s.hat, 'none'), mask: str(s.mask, 'none'), glasses: str(s.glasses, 'none'), cape: CAPES[s.cape] ? s.cape : 'none',
    acc: str(s.acc, 'none'), deco: str(s.deco, ''), clothes: str(s.clothes, 'none'), fx: str(s.fx, 'none'),
    win: WIN_IDS.includes(s.win) ? s.win : 'wave', awk: AWK_TYPES[s.awk] ? s.awk : 'void', style: str(s.style, '')};
  for (const k of ['body', 'eyes', 'belt', 'trim', 'hair']) if (NET_HEX.test(s[k])) o[k] = s[k];
  return o;
}

// ---------------------------------------------------------------- sinalização (protocolo PeerJS)
class NetSignal {
  constructor(cfg, id, h) { this.cfg = cfg; this.id = id; this.h = h; this.ws = null; this.open = false; this.hb = 0; this.dead = false; }
  url() {
    const c = this.cfg, tok = Math.random().toString(36).slice(2);
    let p = c.path || '/'; if (p[0] !== '/') p = '/' + p; if (p[p.length - 1] !== '/') p += '/';
    return (c.secure ? 'wss' : 'ws') + '://' + c.host + (c.port ? ':' + c.port : '') + p + 'peerjs?key=' + encodeURIComponent(c.key || 'peerjs') + '&id=' + encodeURIComponent(this.id) + '&token=' + tok;
  }
  connect() {
    let ws;
    try { ws = new WebSocket(this.url()); } catch (e) { this.h.error && this.h.error('socket'); return; }
    this.ws = ws;
    ws.onmessage = ev => {
      let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.type === 'OPEN') { this.open = true; clearInterval(this.hb); this.hb = setInterval(() => this.send({type: 'HEARTBEAT'}), 5000); this.h.open && this.h.open(); }
      else this.h.msg && this.h.msg(m);
    };
    ws.onerror = () => { if (!this.dead) this.h.error && this.h.error('socket'); };
    ws.onclose = () => { clearInterval(this.hb); const was = this.open; this.open = false; if (!this.dead) this.h.close && this.h.close(was); };
  }
  send(o) { if (this.ws && this.ws.readyState === 1) try { this.ws.send(JSON.stringify(o)); } catch (e) {} }
  close() { this.dead = true; clearInterval(this.hb); try { this.ws && this.ws.close(); } catch (e) {} }
}

// ---------------------------------------------------------------- ligação ponto a ponto
class NetLink {
  constructor(sig, remote, initiator, h) {
    this.sig = sig; this.remote = remote; this.h = h; this.initiator = initiator; this.pc = null; this.r = null; this.u = null;
    this.pend = []; this.haveRemote = false; this.closed = false; this.opened = false;
    const pc = this.pc = new RTCPeerConnection({iceServers: NET_ICE});
    pc.onicecandidate = e => { if (e.candidate) this.sig.send({type: 'CANDIDATE', dst: remote, payload: {candidate: e.candidate}}); };
    pc.onconnectionstatechange = () => { const s = pc.connectionState; if (s === 'failed' || s === 'closed') this.fail('ice'); else if (s === 'disconnected') { clearTimeout(this._dc); this._dc = setTimeout(() => { if (pc.connectionState === 'disconnected') this.fail('ice'); }, 5000); } };
    pc.ondatachannel = e => this.attach(e.channel);
    if (initiator) { this.attach(pc.createDataChannel('r', {ordered: true})); this.attach(pc.createDataChannel('u', {ordered: false, maxRetransmits: 0})); }
  }
  attach(ch) {
    if (ch.label === 'r') this.r = ch; else if (ch.label === 'u') this.u = ch; else return;
    ch.onopen = () => this.check();
    ch.onclose = () => { if (ch.label === 'r') this.fail('closed'); };
    ch.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (x) { return; } this.h.msg && this.h.msg(m, this); };
    if (ch.readyState === 'open') this.check();
  }
  check() { if (!this.opened && this.r && this.r.readyState === 'open' && this.u && this.u.readyState === 'open') { this.opened = true; this.h.open && this.h.open(this); } }
  async offer() {
    const o = await this.pc.createOffer(); await this.pc.setLocalDescription(o);
    this.sig.send({type: 'OFFER', dst: this.remote, payload: {sdp: this.pc.localDescription}});
  }
  async onOffer(sdp) {
    await this.pc.setRemoteDescription(sdp); this.haveRemote = true; await this.flush();
    const a = await this.pc.createAnswer(); await this.pc.setLocalDescription(a);
    this.sig.send({type: 'ANSWER', dst: this.remote, payload: {sdp: this.pc.localDescription}});
  }
  async onAnswer(sdp) { await this.pc.setRemoteDescription(sdp); this.haveRemote = true; await this.flush(); }
  async onCand(c) { if (!this.haveRemote) { this.pend.push(c); return; } try { await this.pc.addIceCandidate(c); } catch (e) {} }
  async flush() { for (const c of this.pend.splice(0)) { try { await this.pc.addIceCandidate(c); } catch (e) {} } }
  send(o, unrel) {
    const ch = unrel && this.u && this.u.readyState === 'open' ? this.u : this.r;
    if (!ch || ch.readyState !== 'open') return false;
    if (ch === this.u && ch.bufferedAmount > 300000) return false;
    try { ch.send(JSON.stringify(o)); return true; } catch (e) { return false; }
  }
  fail(why) { if (this.closed) return; this.closed = true; clearTimeout(this._dc); this.h.close && this.h.close(this, why); this.destroy(); }
  destroy() { this.closed = true; try { this.r && this.r.close(); this.u && this.u.close(); this.pc.close(); } catch (e) {} }
}

// ---------------------------------------------------------------- sala
const Net = {
  role: null,            // null | 'host' | 'client'
  code: '', pid: -1, players: [], opts: {arena: 'neon', lives: 3, weapons: true}, phase: 'idle', // idle|connecting|lobby|play|result
  ping: 0, status: '', sig: null, links: {}, hostLink: null, inputs: {}, ev: [], seq: 0, on: {}, inSim: false,
  conf() {
    // padrão: o próprio site que serve o jogo (Render) também faz a sinalização; abrindo o arquivo local (file://) cai no servidor público do PeerJS
    const c = Object.assign({}, NET_SIG0), s = (typeof save !== 'undefined' && save.net) || {}, q = new URLSearchParams(location.search);
    if (/^https?:$/.test(location.protocol)) { const sec = location.protocol === 'https:'; Object.assign(c, {host: location.hostname, port: location.port ? +location.port : (sec ? 443 : 80), path: '/', secure: sec}); }
    const host = q.get('peerhost') || s.host, port = q.get('peerport') || s.port, path = q.get('peerpath') || s.path, sec = q.get('peersecure');
    if (host) { c.host = host.trim(); c.port = port ? +port : (s.secure === false || sec === '0' ? 80 : 443); c.path = path || '/'; c.secure = sec != null ? sec !== '0' : s.secure !== false; }
    return c;
  },
  supported() { return typeof RTCPeerConnection !== 'undefined' && typeof WebSocket !== 'undefined'; },
  emit(n, a, b) { try { this.on[n] && this.on[n](a, b); } catch (e) { console.error(e); } },
  setStatus(t) { this.status = t; this.emit('status', t); },
  reset() {
    if (this.sig) this.sig.close();
    for (const k in this.links) this.links[k].destroy();
    if (this.hostLink) this.hostLink.destroy();
    clearInterval(this._iv); clearTimeout(this._to);
    this.restoreSfx();
    this.role = null; this.code = ''; this.pid = -1; this.players = []; this.phase = 'idle'; this.sig = null; this.links = {}; this.hostLink = null; this.inputs = {}; this.ev = []; this.ping = 0; this.match = null; this.snap = null;
  },
  mePlayer() { return this.players.find(p => p.pid === this.pid); },

  // ---------- HOST
  host(name, skin, tries) {
    this.reset(); this.role = 'host'; this.phase = 'connecting'; this.name = netClean(name, 12) || 'JOGADOR'; this.skin = skin;
    tries = tries || 0; const code = netCode(); this.code = code;
    this.setStatus('Criando sala…');
    let opened = false;
    const sig = this.sig = new NetSignal(this.conf(), NET_PREFIX + code, {
      open: () => {
        opened = true; clearTimeout(this._to);
        this.pid = 0; this.players = [this.mk(0, this.name, skin, 0)]; this.phase = 'lobby'; this.lastSeen = {};
        this.setStatus('Sala criada. Compartilhe o código.'); this.emit('room');
        clearInterval(this._iv); this._iv = setInterval(() => this.hostWatch(), 1000);
      },
      msg: m => this.hostSig(m),
      error: () => { if (!opened) this.fatal('Não foi possível conectar ao servidor de sinalização. Verifique a internet ou o servidor configurado.'); },
      close: was => { if (!opened) this.fatal('Não foi possível conectar ao servidor de sinalização. Verifique a internet ou o servidor configurado.'); else if (this.role === 'host') this.setStatus('Servidor de sinalização desconectado (jogadores já conectados continuam).'); },
    });
    const idTaken = m => { if (m.type === 'ID-TAKEN' && !opened) { sig.close(); if (tries < 6) this.host(name, skin, tries + 1); else this.fatal('Não foi possível reservar um código. Tente de novo.'); return true; } return false; };
    const hs = sig.h.msg; sig.h.msg = m => { if (idTaken(m)) return; if (m.type === 'INVALID-KEY') { this.fatal('Servidor de sinalização recusou a chave.'); return; } hs(m); };
    clearTimeout(this._to); this._to = setTimeout(() => { if (!opened) this.fatal('Tempo esgotado ao conectar ao servidor de sinalização.'); }, 12000);
    sig.connect();
  },
  uniq(name) { let n = name, k = 1; while (this.players.some(p => p.name === n)) { k++; n = name.slice(0, 10) + ' ' + k; } return n; },
  mk(pid, name, skin, now) { return {pid, name: this.uniq(name), skin: netSkin(skin, pid), color: NET_COLORS[pid], ping: 0, seen: now || 0}; },
  hostSig(m) {
    const src = m.src; if (!src) return;
    if (m.type === 'OFFER' && m.payload && m.payload.sdp) {
      if (this.links[src]) return;
      const L = new NetLink(this.sig, src, false, {
        open: l => {}, msg: (x, l) => this.hostMsg(x, l), close: (l, why) => this.hostDrop(l, why),
      });
      L.rid = src; L.pid = -1; this.links[src] = L; L.t0 = performance.now();
      L.onOffer(m.payload.sdp).catch(() => { L.fail('sdp'); });
    } else if (m.type === 'CANDIDATE' && this.links[src] && m.payload && m.payload.candidate) this.links[src].onCand(m.payload.candidate);
  },
  hostWatch() {
    const now = performance.now();
    for (const k in this.links) {
      const L = this.links[k];
      if (L.pid < 0) { if (now - L.t0 > 15000) L.fail('hello'); continue; }
      if (now - L.seen > 7000) L.fail('timeout');
    }
    if (this.phase === 'lobby' || this.phase === 'result') this.sendRoom();
  },
  hostMsg(m, L) {
    L.seen = performance.now();
    switch (m.k) {
      case 'hello': {
        if (L.pid >= 0) return;
        const rej = why => { L.send({k: 'rej', why}); setTimeout(() => L.fail('rejected'), 400); };
        if (m.proto !== NET_PROTO) return rej('Versão incompatível (atualize o jogo).');
        if (this.phase === 'play') return rej('Partida em andamento. Aguarde a próxima.');
        let pid = -1; for (let i = 1; i < NET_MAX; i++) if (!this.players.some(p => p.pid === i)) { pid = i; break; }
        if (pid < 0) return rej('Sala cheia (máx. 4 jogadores).');
        L.pid = pid; const p = this.mk(pid, netClean(m.name, 12) || 'JOGADOR ' + (pid + 1), m.skin, 0); this.players.push(p); this.players.sort((a, b) => a.pid - b.pid);
        L.send({k: 'wel', pid, code: this.code, v: VERSION});
        this.sendRoom(); this.emit('room'); SFX.play('select');
        break;
      }
      case 'pg': L.send({k: 'pn', t: m.t}, true); if (m.p !== undefined) { const p = this.players.find(x => x.pid === L.pid); if (p) p.ping = m.p | 0; } break;
      case 'in': {
        const inp = this.inputs[L.pid]; if (!inp) return;
        inp.mx = +m.mx || 0; inp.my = +m.my || 0; inp.face = +m.face || 0; inp.aimX = +m.aimX || 0; inp.aimY = +m.aimY || 0; inp.jumpH = !!m.jh; inp.atkH = !!m.ah;
        const c = L.cnt || (L.cnt = {j: 0, s: 0, d: 0});
        if (m.j > c.j) { inp.jumpP = true; c.j = m.j; } if (m.s > c.s) { inp.spP = true; c.s = m.s; } if (m.d > c.d) { inp.dropP = true; c.d = m.d; }
        break;
      }
      case 'bye': L.fail('bye'); break;
    }
  },
  hostDrop(L, why) {
    delete this.links[L.rid];
    if (L.pid < 0) return;
    const i = this.players.findIndex(p => p.pid === L.pid); if (i < 0) return;
    const p = this.players[i]; this.players.splice(i, 1);
    if (this.phase === 'play' && this.match) {
      const f = this.match.fighters.find(x => x.netPid === p.pid);
      if (f && !f.out) { f.lives = 0; f.hp = 0; f.out = true; f.alive = false; f.ragdoll = true; f.input = newInput(); this.match.fx.text(f.cx, f.cy - 40, 'SAIU', '#94a3b8'); }
      delete this.inputs[p.pid];
    }
    this.emit('left', p, why); this.sendRoom(); this.emit('room');
  },
  sendRoom() {
    const o = {k: 'room', players: this.players.map(p => ({pid: p.pid, name: p.name, skin: p.skin, color: p.color, ping: p.ping})), opts: this.opts, phase: this.phase, code: this.code};
    for (const k in this.links) if (this.links[k].pid >= 0) this.links[k].send(o);
  },
  setOpts(o) { Object.assign(this.opts, o); if (this.role === 'host') { this.sendRoom(); this.emit('room'); } },
  bcast(o, unrel) { for (const k in this.links) { const L = this.links[k]; if (L.pid >= 0) L.send(o, unrel); } },
  canStart() { return this.role === 'host' && this.phase === 'lobby' && this.players.length >= 2; },
  // monta a configuração da partida a partir da sala
  hostStart() {
    if (!this.canStart()) return false;
    const pl = this.players.map(p => ({pid: p.pid, name: p.name, color: p.color, skin: Object.assign({}, p.skin)}));
    const used = [];
    pl.forEach(p => { while (used.includes(p.skin.color.toLowerCase())) p.skin.color = shadeHex(p.skin.color); used.push(p.skin.color.toLowerCase()); });
    const cfg = {mode: 'online', arena: this.opts.arena, format: 'stock', lives: this.opts.lives, weapons: this.opts.weapons !== false, camFx: true, players: pl, online: true};
    this.phase = 'play'; this.inputs = {};
    for (const p of pl) if (p.pid !== 0) this.inputs[p.pid] = newInput();
    this.bcast({k: 'start', cfg: {arena: cfg.arena, lives: cfg.lives, weapons: cfg.weapons, players: pl}});
    for (const k in this.links) this.links[k].cnt = {j: 0, s: 0, d: 0};
    this.emit('room'); return cfg;
  },
  attach(m) {            // chamado pela interface logo após criar a Match do host
    this.match = m; this.snapAcc = 0; this.seq = 0; this.ev = [];
    const fx = m.fx, ev = this.ev;
    const wrap = (name, code) => { const o = fx[name].bind(fx); fx[name] = (...a) => { if (ev.length < 140) ev.push([code].concat(a)); return o(...a); }; };
    wrap('burst', 'b'); wrap('ring', 'r'); wrap('text', 't'); wrap('beam', 'm'); wrap('addShake', 'k');
    const ok = m.onKill.bind(m); m.onKill = (k, v, w) => { ev.push(['kf', k ? k.id : -1, v.id]); return ok(k, v, w); };
    if (!this._sfx) { this._sfx = SFX.play; const orig = this._sfx; const self = this; SFX.play = function (n) { if (self.inSim && self.ev.length < 140) self.ev.push(['s', n]); return orig.apply(SFX, arguments); }; }
  },
  restoreSfx() { if (this._sfx) { SFX.play = this._sfx; this._sfx = null; } this.inSim = false; },
  r1(v) { return Math.round(v * 10) / 10; },
  packF(f) {
    const r = this.r1, a = [r(f.x), r(f.y), r(f.vx), r(f.vy), f.facing, f.grounded ? 1 : 0, r(f.hp), f.lives, f.alive ? 1 : 0, f.out ? 1 : 0, f.ragdoll ? 1 : 0, r(f.hitstun), r(f.invuln),
      r(f.flash), r(f.atkT), r(f.wAng), r(f.aimA), r(f.charge), r(f.beamT), f.boomN | 0, r(f.specialCd), f.kills, f.wp ? f.wp.id : '', f.wp ? (f.wp.ammo | 0) : 0, f.celebrate ? 1 : 0, f.winAnim | 0, r(f.celeT), r(f.phase), f.deaths | 0, Math.round(f.dmgDealt)];
    for (let i = 0; i < 11; i++) a.push(r(f.pts[i].x), r(f.pts[i].y));
    return a;
  },
  packSnap(m) {
    const r = this.r1, w = m.result ? (m.result.winner ? m.result.winner.id : -2) : -1;
    return {k: 's', n: ++this.seq, T: r(m.time), t: r(m.t), st: m.state, cd: r(m.cdT), g: r(m.goT), e: m.ended ? 1 : 0, tu: m.timeUp ? 1 : 0, w,
      f: m.fighters.map(f => this.packF(f)),
      i: m.items.map(i => [i.id, r(i.x), r(i.y), r(i.vx), r(i.vy), r(i.rot), r(i.life), i.grounded ? 1 : 0]),
      p: m.projs.map(p => [p.kind, r(p.x), r(p.y), r(p.vx), r(p.vy), r(p.rot || 0)]),
      b: m.bombs.map(b => [b.wid || 'grenade', r(b.x), r(b.y), r(b.vx), r(b.vy), r(b.rot), r(b.fuse)]),
      mi: m.mines.map(x => [r(x.x), r(x.y), x.armed ? 1 : 0])};
  },
  // chamado a cada quadro de render durante a partida
  tickHost(m, dt) {
    this.snapAcc += dt;
    if (this.snapAcc >= 1 / 30) {
      this.snapAcc = this.snapAcc % (1 / 30);
      this.bcast(this.packSnap(m), true);
      if (this.ev.length) { this.bcast({k: 'ev', n: this.seq, e: this.ev.splice(0)}); }
    }
  },
  hostEnd(m) {
    const res = m.result || {}, F = m.fighters;
    const rows = F.map(f => ({pid: f.netPid, name: f.name, kills: f.kills, deaths: f.deaths, dmg: Math.round(f.dmgDealt), surv: Math.round(f.surviveT), win: res.winner === f}));
    const out = {rows, winner: res.winner ? res.winner.netPid : -1, draw: !res.winner, timeUp: !!res.timeUp, time: Math.round(m.t)};
    this.phase = 'result'; this.restoreSfx(); this.match = null;
    this.bcast({k: 'end', res: out}); return out;
  },
  backToLobby() {
    if (this.role !== 'host') return;
    this.phase = 'lobby'; this.inputs = {}; this.match = null; this.restoreSfx(); this.sendRoom(); this.emit('room');
  },

  // ---------- CLIENTE
  join(code, name, skin) {
    this.reset(); code = netNormCode(code);
    if (code.length !== 6) { this.emit('error', 'Digite o código de 6 caracteres.'); return; }
    this.role = 'client'; this.phase = 'connecting'; this.code = code; this.name = netClean(name, 12) || 'JOGADOR'; this.skin = skin;
    this.setStatus('Conectando ao servidor…');
    let got = false;
    const fail = t => { if (got) return; this.fatal(t); };
    const sig = this.sig = new NetSignal(this.conf(), netRid(), {
      open: () => {
        this.setStatus('Procurando a sala ' + code + '…');
        const L = this.hostLink = new NetLink(sig, NET_PREFIX + code, true, {
          open: l => { l.send({k: 'hello', proto: NET_PROTO, name: this.name, skin: this.skin}); this.setStatus('Entrando na sala…'); },
          msg: (m, l) => this.clientMsg(m, l, () => { got = true; }),
          close: (l, why) => { if (this.role !== 'client') return; if (!got) fail('Não foi possível conectar à sala (rede bloqueada ou sala fechada).'); else this.lost('Conexão com o host perdida.'); },
        });
        L.seen = performance.now();
        L.offer().catch(() => fail('Falha ao iniciar a conexão.'));
      },
      msg: m => {
        if (m.type === 'EXPIRE') fail('Sala não encontrada. Confira o código.');
        else if (m.type === 'ANSWER' && m.payload && m.payload.sdp && this.hostLink) this.hostLink.onAnswer(m.payload.sdp).catch(() => fail('Falha na conexão.'));
        else if (m.type === 'CANDIDATE' && this.hostLink && m.payload && m.payload.candidate) this.hostLink.onCand(m.payload.candidate);
        else if (m.type === 'ID-TAKEN') fail('Erro de identificação. Tente de novo.');
      },
      error: () => fail('Não foi possível conectar ao servidor de sinalização.'),
      close: was => { if (!was) fail('Não foi possível conectar ao servidor de sinalização.'); },
    });
    clearTimeout(this._to); this._to = setTimeout(() => fail('Tempo esgotado: a sala não respondeu.'), 14000);
    sig.connect();
  },
  clientMsg(m, L, gotCb) {
    L.seen = performance.now();
    switch (m.k) {
      case 'wel': gotCb(); clearTimeout(this._to); this.pid = m.pid; this.phase = 'lobby'; this.setStatus('Conectado à sala ' + this.code); if (this.sig) { /* sinalização não é mais necessária */ this.sig.close(); }
        clearInterval(this._iv); this._iv = setInterval(() => this.clientWatch(), 1000); break;
      case 'rej': gotCb(); this.fatal(m.why || 'Entrada recusada.'); break;
      case 'room': {
        this.players = (m.players || []).map(p => ({pid: p.pid, name: netClean(p.name, 12), skin: netSkin(p.skin, p.pid), color: NET_HEX.test(p.color) ? p.color : NET_COLORS[p.pid & 3], ping: p.ping | 0}));
        this.opts = Object.assign({}, this.opts, m.opts || {});
        if (m.phase === 'lobby' && (this.phase === 'result' || this.phase === 'lobby')) this.phase = 'lobby';
        this.emit('room'); break;
      }
      case 'start': {
        const c = m.cfg || {}; this.phase = 'play';
        const pl = (c.players || []).slice(0, NET_MAX).map(p => ({pid: p.pid | 0, name: netClean(p.name, 12), color: NET_HEX.test(p.color) ? p.color : NET_COLORS[p.pid & 3], skin: netSkin(p.skin, p.pid & 3)}));
        this.snap = null; this.ev = [];
        this.emit('start', {mode: 'online', arena: ARENAS[c.arena] ? c.arena : 'neon', format: 'stock', lives: Math.max(1, Math.min(10, c.lives | 0 || 3)), weapons: c.weapons !== false, camFx: true, players: pl, online: true, client: true});
        break;
      }
      case 's': if (this.phase === 'play' && (!this.snap || m.n > this.snap.n)) { m._at = performance.now(); this.snap = m; this.snapNew = true; } break;
      case 'ev': if (this.phase === 'play') this.evq = (this.evq || []).concat(m.e || []); break;
      case 'end': this.phase = 'result'; this.emit('end', m.res); break;
      case 'pn': this.ping = Math.round(performance.now() - m.t); break;
      case 'closed': this.lost(m.why || 'O host encerrou a sala.'); break;
    }
  },
  clientWatch() {
    if (this.role !== 'client') return;
    if (performance.now() - this.hostLink.seen > 7000) { this.lost('Conexão com o host perdida.'); return; }
    this.hostLink.send({k: 'pg', t: performance.now(), p: this.ping}, true);
  },
  // envia os controles do jogador local (cliente → host)
  tickClient(inp, dt) {
    this.inAcc = (this.inAcc || 0) + dt;
    const c = this.cnt || (this.cnt = {j: 0, s: 0, d: 0});
    if (inp.jumpP) { c.j++; inp.jumpP = false; } if (inp.spP) { c.s++; inp.spP = false; } if (inp.dropP) { c.d++; inp.dropP = false; } inp.awkP = false;
    if (this.inAcc < 0.025) return; this.inAcc = 0;
    this.hostLink.send({k: 'in', mx: inp.mx, my: inp.my, face: inp.face, aimX: inp.aimX, aimY: inp.aimY, jh: inp.jumpH ? 1 : 0, ah: inp.atkH ? 1 : 0, j: c.j, s: c.s, d: c.d}, true);
  },
  // ---------- saída
  leave(silent) {
    if (this.role === 'host') this.bcast({k: 'closed', why: 'O host encerrou a sala.'});
    else if (this.role === 'client' && this.hostLink) this.hostLink.send({k: 'bye'});
    const had = this.role;
    setTimeout(() => {}, 0);
    this.reset(); if (!silent && had) this.emit('left-room');
  },
  fatal(msg) { if (!this.role) return; const r = this.role; this.reset(); this.emit('error', msg, r); },
  lost(msg) { if (!this.role) return; this.reset(); this.emit('lost', msg); },
};
window.addEventListener('pagehide', () => { if (Net.role) { try { Net.leave(true); } catch (e) {} } });

// ---------------------------------------------------------------- cliente: partida espelhada
Match.prototype.updateNetClient = function (dt) {
  const net = Net, s = net.snap, F = this.fighters;
  this.fx.update(dt);
  { const q = net.evq; if (q && q.length) { net.evq = []; for (const e of q) this.applyEv(e); } }
  if (s) {
    if (net.snapNew) { net.snapNew = false; this.applySnap(s); }
    const el = Math.min(0.12, (performance.now() - s._at) / 1000);
    this.time = s.T + el; this.t = s.t + (s.st === 'play' ? el : 0);
  } else this.time += dt;
  const k = 1 - Math.exp(-dt * 24);
  for (const f of F) {
    const g = f._tg; if (g) {
      if (Math.abs(g[0] - f.x) + Math.abs(g[1] - f.y) > 220) { f.x = g[0]; f.y = g[1]; for (let i = 0; i < 11; i++) { f.pts[i].x = g[30 + i * 2]; f.pts[i].y = g[31 + i * 2]; } if (f.capeDef()) f.capeReset(); }
      else {
        f.x += (g[0] - f.x) * k; f.y += (g[1] - f.y) * k;
        for (let i = 0; i < 11; i++) { const p = f.pts[i]; p.x += (g[30 + i * 2] - p.x) * k; p.y += (g[31 + i * 2] - p.y) * k; }
      }
    }
    for (let i = 0; i < 11; i++) { f.pts[i].px = f.pts[i].x; f.pts[i].py = f.pts[i].y; }
    if (f.alive || f.ragdoll) f.capeStep(dt);
  }
  // plataformas móveis e zaps (determinísticos pelo tempo)
  for (const p of this.plats) {
    if (!p.move) continue; const ox = p.x, oy = p.y, mv = p.move;
    p.x = p.bx + Math.sin(this.time * mv.spd + mv.ph) * mv.ax; p.y = p.by + Math.sin(this.time * mv.spd + mv.ph) * mv.ay; p.dx = p.x - ox; p.dy = p.y - oy;
  }
  if (this.arena.zaps) for (const z of this.arena.zaps) { const ph = this.time % z.period, on = ph > z.period - z.on; z.active = on; z.warn = !on && ph > z.period - z.on - 1.0; }
  // extrapolação dos objetos entre snapshots
  for (const a of [this.items, this.projs, this.bombs]) for (const o of a) { o.x += o.vx * dt; o.y += o.vy * dt; if (o.rot !== undefined && o.vr) o.rot += o.vr * dt; }
  for (const b of this.bombs) { b.fuse -= dt; if (Math.random() < 0.3) this.fx.add(b.x, b.y - 8, rnd(-20, 20), -30, 0.25, 2, '#fbbf24', 0, 0); }
  for (const p of this.projs) {
    if (p.kind === 'rocket') { this.fx.add(p.x, p.y, rnd(-30, 30), rnd(-30, 30), 0.4, 5, '#999', 0, 1); this.fx.add(p.x, p.y, 0, 0, 0.15, 4, '#ffb347', 0, 0); }
    else if (p.kind === 'orb') this.fx.add(p.x, p.y, rnd(-20, 20), rnd(-20, 20), 0.3, 5, '#a78bfa', 0, 0);
    else if (p.kind === 'fire') this.fx.add(p.x, p.y, rnd(-30, 30), -60, 0.35, 6, '#ff7a1a', 0, 0);
    else if (p.kind === 'bullet') this.fx.add(p.x, p.y, 0, 0, 0.08, 2, '#fff3b0', 0, 0);
    else if (p.kind === 'boomerang') p.rot += dt * 22;
  }
  if (this.ended) this.endT += dt;
};
Match.prototype.applySnap = function (s) {
  this.state = s.st; this.cdT = s.cd; this.goT = s.g; this.frozen = s.st === 'countdown';
  const wasEnded = this.ended; this.ended = !!s.e; this.timeUp = !!s.tu;
  if (this.ended && !wasEnded) { this.timeScale = 1; }
  if (s.cd !== undefined) { const n = Math.ceil(s.cd); if (s.st === 'countdown' && n !== this.lastN) { this.lastN = n; if (n > 0) SFX.play('count'); } }
  if (this._lastSt === 'countdown' && s.st === 'play') SFX.play('go');
  this._lastSt = s.st;
  const F = this.fighters;
  s.f.forEach((a, i) => {
    const f = F[i]; if (!f) return;
    const first = !f._tg; f._tg = a;
    f.vx = a[2]; f.vy = a[3]; f.facing = a[4]; f.grounded = !!a[5]; f.hp = a[6]; f.lives = a[7]; f.alive = !!a[8]; f.out = !!a[9]; f.ragdoll = !!a[10]; f.hitstun = a[11]; f.invuln = a[12];
    f.flash = a[13]; f.atkT = a[14]; f.wAng = a[15]; f.aimA = a[16]; f.charge = a[17]; f.beamT = a[18]; f.boomN = a[19]; f.specialCd = a[20]; f.kills = a[21];
    f.wp = a[22] ? {id: a[22], ammo: a[23], uses: 0} : null; f.celebrate = !!a[24]; f.winAnim = a[25]; f.celeT = a[26]; f.phase = a[27]; f.deaths = a[28]; f.dmgDealt = a[29];
    f.stun = f.ragdoll ? 1 : 0; f.aimOn = false;
    if (first) { f.x = a[0]; f.y = a[1]; for (let j = 0; j < 11; j++) { f.pts[j].x = f.pts[j].px = a[30 + j * 2]; f.pts[j].y = f.pts[j].py = a[31 + j * 2]; } f.capeReset(); }
  });
  if (s.e) { const w = s.w >= 0 ? F[s.w] : null; this.result = {winner: w || null, time: s.t, draw: s.w === -2, timeUp: !!s.tu}; }
  this.items = s.i.map(a => ({id: a[0], x: a[1], y: a[2], vx: a[3], vy: a[4], rot: a[5], vr: 0, life: a[6], grounded: !!a[7]}));
  this.projs = s.p.map(a => ({kind: a[0], x: a[1], y: a[2], vx: a[3], vy: a[4], rot: a[5]}));
  this.bombs = s.b.map(a => ({wid: a[0], x: a[1], y: a[2], vx: a[3], vy: a[4], rot: a[5], fuse: a[6]}));
  this.mines = s.mi.map(a => ({x: a[0], y: a[1], armed: !!a[2]}));
};
Match.prototype.applyEv = function (e) {
  const fx = this.fx;
  switch (e[0]) {
    case 'b': fx.burst(e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11]); break;
    case 'r': fx.ring(e[1], e[2], e[3], e[4], e[5], e[6]); break;
    case 't': fx.text(e[1], e[2], e[3], e[4]); break;
    case 'm': fx.beam(e[1], e[2], e[3], e[4], e[5], e[6]); break;
    case 'k': fx.addShake(e[1]); break;
    case 's': SFX.play(e[1]); break;
    case 'kf': { const k = this.fighters[e[1]], v = this.fighters[e[2]]; if (v) this.onKill(k || null, v); break; }
  }
};
