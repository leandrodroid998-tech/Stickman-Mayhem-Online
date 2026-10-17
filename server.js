'use strict';
/* STICK MAYHEM — servidor para Render: serve o jogo (public/) e faz a sinalização WebRTC (protocolo PeerJS).
   A partida em si NÃO passa por aqui: os jogadores se conectam direto (P2P) depois de se encontrarem pelo código. */
const http = require('http'), fs = require('fs'), path = require('path');
const {WebSocketServer} = require('ws');
const PORT = +process.env.PORT || 3000, PUB = path.join(__dirname, 'public');
const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon', '.svg': 'image/svg+xml'};

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'); let p = decodeURIComponent(u.pathname);
  if (p === '/healthz') { res.writeHead(200, {'Content-Type': 'text/plain'}); return res.end('ok'); }
  if (p === '/') p = '/index.html';
  const f = path.normalize(path.join(PUB, p));
  if (!f.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404, {'Content-Type': 'text/plain'}); return res.end('404'); }
    res.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': p === '/index.html' ? 'no-cache' : 'public, max-age=3600'});
    res.end(d);
  });
});

// ---- sinalização (compatível com o protocolo do servidor PeerJS)
const peers = new Map();                     // id -> ws
const MAX_PEERS = 3000, ID_RE = /^[A-Za-z0-9_-]{4,64}$/;
const wss = new WebSocketServer({noServer: true, maxPayload: 64 * 1024});
server.on('upgrade', (req, sock, head) => {
  const u = new URL(req.url, 'http://x');
  if (!/\/peerjs$/.test(u.pathname)) { sock.destroy(); return; }
  wss.handleUpgrade(req, sock, head, ws => wss.emit('connection', ws, req));
});
const send = (ws, o) => { if (ws.readyState === 1) try { ws.send(JSON.stringify(o)); } catch (e) {} };
wss.on('connection', (ws, req) => {
  const u = new URL(req.url, 'http://x'), id = u.searchParams.get('id') || '';
  if (!ID_RE.test(id) || u.searchParams.get('key') !== 'peerjs') { send(ws, {type: 'ERROR', payload: {msg: 'invalid id/key'}}); return ws.close(); }
  if (peers.has(id)) { send(ws, {type: 'ID-TAKEN', payload: {msg: 'ID is taken'}}); return ws.close(); }
  if (peers.size >= MAX_PEERS) { send(ws, {type: 'ERROR', payload: {msg: 'server full'}}); return ws.close(); }
  peers.set(id, ws); ws.alive = true; send(ws, {type: 'OPEN'});
  ws.on('pong', () => { ws.alive = true; });
  ws.on('message', d => {
    ws.alive = true; let m; try { m = JSON.parse(d); } catch (e) { return; }
    if (!m || !['OFFER', 'ANSWER', 'CANDIDATE', 'LEAVE', 'EXPIRE'].includes(m.type) || typeof m.dst !== 'string') return;
    const t = peers.get(m.dst);
    if (t) send(t, {type: m.type, src: id, dst: m.dst, payload: m.payload}); else send(ws, {type: 'EXPIRE', src: m.dst});
  });
  ws.on('close', () => { if (peers.get(id) === ws) peers.delete(id); });
  ws.on('error', () => {});
});
setInterval(() => { for (const [id, ws] of peers) { if (!ws.alive) { ws.terminate(); peers.delete(id); continue; } ws.alive = false; try { ws.ping(); } catch (e) {} } }, 25000);

server.listen(PORT, () => console.log('STICK MAYHEM server on :' + PORT));
