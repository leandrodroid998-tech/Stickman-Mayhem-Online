# STICK MAYHEM v1.4.0 — pacote para GitHub + Render

Este repositório já está pronto: o **mesmo servidor** entrega o jogo e faz o "encontro" dos jogadores pelo código de convite (sinalização). A partida em si passa direto entre os jogadores (P2P), não pelo servidor.

```
server.js      servidor Node (site + sinalização WebSocket em /peerjs)
package.json   dependência: ws
render.yaml    configuração do Render (opcional, "Blueprint")
public/index.html   o jogo (arquivo único)
```

## Passo a passo

### 1) GitHub
1. Crie um repositório novo (pode ser privado) em github.com.
2. Envie **todos** os arquivos desta pasta (`server.js`, `package.json`, `render.yaml`, `.gitignore`, `README.md` e a pasta `public/`). Pelo site: *Add file → Upload files* e arraste tudo (mantenha a pasta `public`).

### 2) Render
1. Em render.com: **New → Web Service** → conecte o GitHub e escolha o repositório.
2. Configure:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
   - (Em *Advanced* → **Health Check Path:** `/healthz`)
   Ou use **New → Blueprint** e ele lê o `render.yaml` sozinho.
3. Aguarde o deploy. O link `https://SEU-APP.onrender.com` é o jogo.
4. Abra o link, toque em **ONLINE → CRIAR SALA** e mande o código (ou o botão **CONVIDAR**, que já gera o link com o código) para os amigos. Todos precisam abrir o **mesmo link do Render**.

## Observações
- **Plano gratuito do Render dorme** após ~15 min sem acesso; o primeiro acesso depois disso demora cerca de 30–60 s para acordar. Abra o link antes de chamar os amigos. Se uma sala estiver aberta, os acessos mantêm o servidor acordado.
- Se reiniciar/dormir o servidor com uma sala aberta, quem já estava conectado continua jogando, mas ninguém novo entra com aquele código — crie outra sala.
- O servidor não guarda nada (salas só existem enquanto os jogadores estão conectados).
- Conexão P2P usa servidores STUN/TURN públicos (de terceiros). Em redes muito restritivas (algumas redes de empresa/escola ou 4G com NAT rígido) pode não conectar.
- Testar localmente: `npm install` e `npm start` → http://localhost:3000 (abra em duas abas/aparelhos na mesma rede para testar).
- Atualizar o jogo: troque `public/index.html` e envie ao GitHub; o Render faz o deploy automático.
