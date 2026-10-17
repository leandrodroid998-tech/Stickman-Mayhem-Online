'use strict';
/* STICK MAYHEM v1.4.0 — interface ONLINE (sala, lobby, resultado) */
const onlineScreenActive = () => $('#s-online').classList.contains('active');
function onMsg(t, cls) { const e = $('#on-msg'); e.textContent = t || ''; e.className = 'on-msg' + (cls ? ' ' + cls : ''); }
function onBusy(b) { ['#on-create', '#on-join'].forEach(s => { $(s).disabled = b; }); }
function onName() { return ($('#on-name').value || '').replace(/[<>&"'`\\]/g, '').trim().slice(0, 12) || 'JOGADOR'; }
function onlineView(room) { $('#on-home').classList.toggle('hidden', room); $('#on-room').classList.toggle('hidden', !room); }
function onlineOpen() {
  const q = new URLSearchParams(location.search).get('sala');
  $('#on-name').value = save.net.name || '';
  $('#on-h').value = save.net.host || ''; $('#on-p').value = save.net.port || ''; $('#on-path').value = save.net.path || ''; $('#on-sec').checked = save.net.secure !== false;
  if (q && !$('#on-code').value && !Net.role) $('#on-code').value = netNormCode(q);
  if (Net.role && Net.phase !== 'connecting') { onlineView(true); onlineRender(); }
  else { onlineView(false); onBusy(false); if (!Net.supported()) onMsg('Seu navegador não suporta WebRTC — o modo online não funciona aqui.', 'err'); else onMsg(''); }
}
function onSaveAdv() {
  save.net.name = onName(); save.net.host = $('#on-h').value.trim(); save.net.port = $('#on-p').value.trim().replace(/\D/g, ''); save.net.path = $('#on-path').value.trim(); save.net.secure = $('#on-sec').checked; persist();
}
['#on-name', '#on-h', '#on-p', '#on-path', '#on-sec'].forEach(s => $(s).addEventListener('change', onSaveAdv));
$('#on-code').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); });
$('#on-code').addEventListener('keydown', e => { if (e.key === 'Enter') $('#on-join').click(); e.stopPropagation(); });
['#on-name', '#on-h', '#on-p', '#on-path'].forEach(s => $(s).addEventListener('keydown', e => e.stopPropagation()));
$('#on-create').onclick = () => {
  SFX.resume(); SFX.play('click'); onSaveAdv(); if (!Net.supported()) { onMsg('WebRTC indisponível neste navegador.', 'err'); return; }
  onBusy(true); onMsg('Criando sala…'); Net.host(onName(), mySkin(0));
};
$('#on-join').onclick = () => {
  SFX.resume(); SFX.play('click'); onSaveAdv(); if (!Net.supported()) { onMsg('WebRTC indisponível neste navegador.', 'err'); return; }
  const c = netNormCode($('#on-code').value); if (c.length !== 6) { onMsg('Digite o código de 6 caracteres.', 'err'); return; }
  onBusy(true); onMsg('Conectando…'); Net.join(c, onName(), mySkin(0));
};
function onlineLeave() {
  SFX.play('click'); Net.leave(true);
  if (app.state === 'game' || app.state === 'result' || app.state === 'paused') leaveGame('online'); else { go('online'); }
  document.body.classList.remove('netg');
}
$('#on-leave').onclick = onlineLeave;
$('#on-back').onclick = () => { SFX.play('click'); if (Net.role) Net.leave(true); go('menu'); };
$('#or-leave').onclick = onlineLeave;
{ const old = $('#p-menu').onclick; $('#p-menu').onclick = () => { if (Net.role) onlineLeave(); else old(); }; }

function onCopy(txt) {
  const done = () => toast('Copiado!');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => onCopyFb(txt, done)); else onCopyFb(txt, done);
}
function onCopyFb(txt, done) { const t = document.createElement('textarea'); t.value = txt; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Código: ' + txt); } t.remove(); }
$('#on-copy').onclick = () => { SFX.play('click'); onCopy(Net.code); };
$('#on-share').onclick = () => {
  SFX.play('click');
  const link = /^https?:/.test(location.protocol) ? location.origin + location.pathname + '?sala=' + Net.code : '';
  const txt = 'Entre na minha sala do STICK MAYHEM! Código: ' + Net.code + (link ? '\n' + link : '');
  if (navigator.share) navigator.share({title: 'STICK MAYHEM', text: txt}).catch(() => {}); else onCopy(txt);
};

function onlineRender() {
  if (!Net.role) return;
  $('#on-code-big').textContent = Net.code || '------';
  const host = Net.role === 'host', P = Net.players;
  $('#on-count').textContent = P.length + '/4';
  const box = $('#on-players'); box.innerHTML = '';
  for (let i = 0; i < NET_MAX; i++) {
    const p = P.find(x => x.pid === i), d = document.createElement('div');
    if (!p) { d.className = 'on-pl empty'; d.textContent = 'Aguardando jogador…'; }
    else {
      d.className = 'on-pl'; d.style.setProperty('--pc', p.color);
      const me = p.pid === Net.pid, ping = p.pid === 0 ? '' : (me ? (Net.ping ? Net.ping + ' ms' : '') : (p.ping ? p.ping + ' ms' : ''));
      d.innerHTML = '<i class="dot"></i><b></b>' + (p.pid === 0 ? ico('crown') : '') + '<small></small>';
      d.querySelector('b').textContent = p.name + (me ? ' (você)' : ''); d.querySelector('small').textContent = ping || (p.pid === 0 ? 'host' : '');
    }
    box.appendChild(d);
  }
  const o = Net.opts, ob = $('#on-opts'); ob.classList.toggle('ro', !host);
  const set = (id, items, cur, key) => chips($(id), items, cur, v => { if (!host) return; Net.setOpts({[key]: v}); save.net[key] = v; persist(); });
  set('#on-o-arena', ARENA_IDS.filter(a => a !== 'training').map(id => [id, ARENAS[id].name]), o.arena, 'arena');
  set('#on-o-lives', [1, 3, 5, 10].map(n => [n, String(n)]), o.lives, 'lives');
  set('#on-o-weap', [[true, 'LIGADAS'], [false, 'DESLIGADAS']], o.weapons !== false, 'weapons');
  const st = $('#on-start'); st.classList.toggle('hidden', !host); st.disabled = !Net.canStart();
  $('#on-status').textContent = host ? (P.length < 2 ? 'Aguardando pelo menos mais 1 jogador para iniciar…' : 'Pronto! Toque em INICIAR PARTIDA.') : 'Aguardando o host iniciar a partida…';
  const pg = $('#on-ping'); pg.classList.toggle('hidden', host); if (!host) pg.textContent = 'PING ' + (Net.ping || '--') + ' ms';
}
$('#on-start').onclick = () => {
  if (!Net.canStart()) return; SFX.resume(); SFX.play('go');
  const cfg = Net.hostStart(); if (cfg) { app.series = null; startGame(cfg); }
};

// ---- eventos do Net
Net.on.status = t => { if (onlineScreenActive() && !$('#on-home').classList.contains('hidden')) onMsg(t); };
Net.on.room = () => {
  if (app.state === 'result' && Net.phase === 'lobby') { onlineToLobby(); return; }
  if (onlineScreenActive()) { onlineView(true); onlineRender(); }
  else if (Net.phase === 'lobby' && !Net.opened) { /* host/cliente acabou de conectar enquanto a tela estava aberta */ }
};
Net.on.error = (msg) => {
  if (app.state === 'game' || app.state === 'result') { leaveGame('online'); }
  else if (!onlineScreenActive()) go('online');
  onlineView(false); onBusy(false); onMsg(msg, 'err'); toast(msg);
};
Net.on.lost = msg => {
  if (app.state === 'game' || app.state === 'result' || app.state === 'paused') leaveGame('online'); else go('online');
  onlineView(false); onBusy(false); onMsg(msg, 'err'); toast(msg);
};
Net.on.left = (p) => { toast(p.name + ' saiu da sala'); };
Net.on.start = cfg => { app.series = null; startGame(cfg); };
Net.on.end = res => onlineResult(res);
// o convidado entrou com sucesso → mostra a sala
{
  const _room = Net.on.room;
  Net.on.room = function () { if (Net.role && onlineScreenActive()) { onlineView(true); } _room(); };
}

function onlineToLobby() {
  app.state = 'menu'; app.game = null; app.vic = null; Controls.setMode('none'); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden');
  document.body.classList.remove('netg', 'awk-on', 'kb'); newMenuScene(); SFX.duck(false); SFX.music('menu');
  showScreen('online'); app.inCustom = false; onlineView(true); onlineRender();
}
function onlineHostEnd(sc) { const res = Net.hostEnd(sc); onlineResult(res); }
function onlineResult(res) {
  app.state = 'result'; Controls.reset(); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden'); SFX.duck(false);
  const me = Net.pid, row = res.rows.find(r => r.pid === me), win = res.winner === me, host = Net.role === 'host';
  const wname = (res.rows.find(r => r.pid === res.winner) || {}).name;
  const t = $('#or-title'); t.textContent = res.draw ? 'EMPATE!' : win ? 'VITÓRIA!' : (wname || '?') + ' VENCEU'; t.classList.toggle('lose', !win);
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  $('#or-sub').textContent = 'Sala ' + Net.code + ' · Duração ' + Math.floor(res.time / 60) + ':' + String(res.time % 60).padStart(2, '0');
  let tb = '<table><tr><th>Lutador</th><th>Elim.</th><th>Mortes</th><th>Dano</th></tr>';
  res.rows.forEach(r => { tb += `<tr class="${r.win ? 'win' : ''}"><td>${r.win ? ico('crown') + ' ' : ''}${String(r.name).replace(/[<>&]/g, '')}${r.pid === me ? ' (você)' : ''}</td><td>${r.kills}</td><td>${r.deaths}</td><td>${r.dmg}</td></tr>`; });
  $('#or-table').innerHTML = tb + '</table>';
  let coins = 5 + (win ? 20 : 0) + Math.min(30, (row ? row.kills : 0) * 5); coins = Math.min(coins, 45);
  const st = save.stats; st.matches++; if (win) st.wins++; else if (!res.draw) st.losses++; if (row) { st.kills += row.kills; st.deaths += row.deaths; st.dmg += row.dmg; } st.time += res.time;
  save.coins += coins; persist(); updCoins();
  $('#or-coins').innerHTML = ico('coin') + ' +' + coins + ' moedas';
  const b = $('#or-lobby'); b.classList.toggle('hidden', !host);
  showScreen('onres'); $('#s-onres').classList.add('active');
}
$('#or-lobby').onclick = () => { SFX.play('click'); Net.backToLobby(); };

// ---- indicador de ping no HUD + atualização periódica
setInterval(() => {
  const h = $('#net-hud'); if (!h) return;
  const show = !!Net.role && (app.state === 'game' || app.state === 'paused');
  h.classList.toggle('hidden', !show);
  if (show) h.textContent = 'SALA ' + Net.code + ' · ' + (Net.role === 'host' ? 'HOST' : 'PING ' + (Net.ping || '--') + ' ms');
  if (Net.role && onlineScreenActive() && !$('#on-room').classList.contains('hidden')) onlineRender();
}, 700);
window.__NET = Net;
