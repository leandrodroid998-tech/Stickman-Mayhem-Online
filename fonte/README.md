# STICK MAYHEM v1.4.0

Jogo de luta de bonecos de palito em HTML5/CSS3/JS puro, com física ragdoll (Verlet). Roda offline, sem dependências.

## Novidades da v1.4.0 — ONLINE
- **Aba ONLINE no menu principal**: CRIAR SALA (gera um código de 6 caracteres, botões COPIAR CÓDIGO e CONVIDAR) e ENTRAR COM CÓDIGO. Também aceita `?sala=CODIGO` na URL para preencher o código.
- **Até 4 jogadores por sala** (host + 3). Lobby com nome, cor e ping de cada um; o host escolhe arena, vidas (1/3/5/10) e armas, e inicia com 2+ jogadores. Modo "todos contra todos" no estilo Chaos Arena, sem bots, com armas do céu, perigos da arena e placar de eliminações.
- **Rejeições tratadas**: sala cheia, código inexistente, partida em andamento, versão incompatível, tempo esgotado, servidor de sinalização inacessível.
- **Durante a partida**: botão de pausa vira menu "sair da sala" (a partida não pausa para os outros); jogador que sai/cai é eliminado; se o host sai, a sala fecha para todos. Ao fim: resultado com tabela e o host pode **VOLTAR À SALA** (revanche) com todos.
- **Como funciona**: WebRTC ponto-a-ponto (RTCDataChannel). A sinalização usa o protocolo do servidor PeerJS por WebSocket — por padrão o **próprio site que hospeda o jogo** (pacote `stick-mayhem-render`, para GitHub + Render, já inclui o servidor); abrindo o arquivo local usa o público `0.peerjs.com`; configurável em ONLINE › "Servidor de sinalização (avançado)" ou por URL (`?peerhost=...&peerport=...&peerpath=/&peersecure=0`). Servidor próprio: `npx peerjs --port 9000` (ver "peer" no npm). O **host é autoritativo**: roda toda a simulação e envia estado ~30×/s; os convidados enviam só os controles (~40×/s). Efeitos e sons são reproduzidos nos convidados por eventos.
- A biblioteca PeerJS **não** é usada (o npm estava bloqueado no ambiente de desenvolvimento): o cliente de sinalização foi escrito do zero (`net.js`), seguindo o protocolo.
- AWAKENING e Fatality não existem no modo online (partida de 3–4 jogadores sem duelo).

## Testes da v1.4.0
Chromium/Playwright com servidor de sinalização local compatível com PeerJS e 4–5 navegadores simultâneos: criar sala, 3 entradas, 5º rejeitado ("Sala cheia"), código errado, opções do host chegando aos convidados, início nos 4 clientes, movimento/ataque do convidado refletido no host, eliminações replicadas, fim de partida e tabela iguais em todos, VOLTAR À SALA, convidado saindo no meio (eliminado, partida termina para o último), host saindo (convidados voltam com aviso), toque em viewport de celular paisagem, 0 erros de console. Regressões: soak/sim headless, fluxo de Fatality automática, personalização.

## Novidades da v1.3.0 — FATALITY & COSMÉTICOS
- **Sistema de FATALITY**: ao vencer a partida inteira (bo3/bo5/bo7 ou partida única) com a opção ativada, a **Fatality roda automaticamente**, sem botão; ao terminar aparece a tela de vitória com *Ver resultado*, *Nova partida* e *Menu*. Não ocorre em partida infinita, quando a CPU vence nem com a opção desligada. Em **Configurações da partida** há *FATALITY [ATIVADO/DESATIVADO]* ("Permite executar uma finalização especial após vencer a partida."), bloqueada em partida infinita e fixa durante a partida. Durante a cena: golpes bloqueados, placar intacto e controles travados.
- **8 Fatalities** (sem gore, estilizadas): IRON FIST (grátis), THUNDER GOD, METEOR CRASH, SHADOW EXECUTION, GRAVITY BREAKER, BLADE STORM, VOID CONSUMPTION (o oponente é engolido e some), GOD OF MAYHEM. Cada uma é uma sequência própria (câmera, câmera lenta, efeitos, som). Compra/equipar por jogador na aba FATALITIES.
- **12 skins novas** (23 no total): Shadow Ninja, Cyber Warrior, Infernal, Frost Knight, Neon Phantom, Golden Champion, Void Walker, **Street Brawler** (nome trocado de propósito para não usar marca registrada), Galactic Ranger, Thunder Lord, Glitch Entity, Mayhem Legend — cada uma com paleta, decoração própria e silhueta legível.
- **Cosméticos novos**: 6 capas (clássica, curta, longa, real, rasgada, cósmica), asas de luz/sombrias, jetpack, chapéus (auréola, capuz, crista, kabuto, capacete espacial), máscaras (caveira, glitch) e 5 efeitos que seguem o personagem (brasas, gelo, estrelas, vazio, eletricidade).
- **Capa corrigida**: segmentos de comprimento rígido aplicados por último a cada passo (antes a colisão com plataformas podia esticar a capa até 500 px); espelhamento ao virar. Verificado sob golpes, ragdoll, todos os AWAKENINGS e todas as Fatalities (esticamento máximo de segmento 11,1 px).
- **12 animações de vitória** (8 novas): Pose de Campeão, Entrada Sombria, Golpe do Trovão, Flutuação Cósmica, Giro de Arma, Explosão de Energia, Vitória Real, Celebração Mayhem — com som sincronizado.
- **6 novos AWAKENINGS** (9 no total): INFERNAL RAGE, VOID ASCENSION, THUNDER SOUL, FROZEN EMPEROR, CELESTIAL BREAKER, MAYHEM OVERDRIVE — cada um com ativação, movimento e efeitos próprios; mesma energia, UI, dano (≤ 43% da vida) e esquiva da CPU.
- **PERSONALIZAR reformulada**: SKINS, CAPAS, ACESSÓRIOS (sub-filtros), AWAKENINGS, FATALITIES e ANIMAÇÕES DE VITÓRIA, com personagem em destaque em tempo real, prévia animada isolada, selo de raridade, indicador de equipado/bloqueado e fundo discreto animado.

## Testes da v1.3.0
Chromium/Playwright: bo3 2–0, bo3 2–1, bo5 3–2, bo7 4–3, partida infinita, Fatality desligada/ligada, vitória da CPU, partida única, duelo local (vencedor P1/P2), equipar cada uma das 8 Fatalities/9 AWAKENINGS/23 skins/7 capas/todos os acessórios/12 vitórias, execução real de cada Fatality e de cada AWAKENING, reinício e menu após Fatality, toque em 844×390; **zero erros de console**. Node: 8 Fatalities × 5 arenas, soak de 5 min por arena, 40 partidas AWAKENING, teste de esticamento de capa.

## Novidades da v1.2.0
- **12 armas novas (agora 32)**: corpo a corpo — Nunchaku, Maça, Tridente, Chicote (maior alcance), Motosserra; projéteis — **Bumerangue** (vai e volta, acerta na ida e na volta, o dono "pega" de volta e só lança outro quando ele retorna), Shuriken (leque de 3), Lança-chamas, Sniper, Lança-granadas (arco + explosão), Raio Tesla (feixe elétrico); especial — Dinamite (explosão grande, pavio 2,4 s). Todas com desenho na mão, no chão, no Arsenal, sons sintetizados próprios e uso pela CPU.
- **Aba SKINS em Personalizar**: pacotes prontos para comprar/equipar (por jogador, P1/P2, compras persistem). **TUNG TUNG TUNG SAHUR** (tronco de madeira com rosto e bastão) e **BLOCK MINER** (explorador cúbico em pixels, inspirado em jogos de blocos; nome próprio por direitos autorais) são **grátis**. Pagas: Festeiro (300), Sombra Ninja (400), Samurai Oni (600), Cavaleiro Real (600), Ciborgue (700), Lorde Magma (800), Rei do Gelo (800), Imperador Dourado (1200). Skin equipada substitui as peças avulsas; AWAKENING e dança de vitória continuam do jogador. Adversários às vezes aparecem com skins prontas.
- **Menus JOGAR e PERSONALIZAR redesenhados**: JOGAR em duas colunas (modos com ícone/descrição e marcador de seleção; arenas com miniaturas grandes; botão LUTAR fixo). PERSONALIZAR com seletor P1/P2 no painel de prévia, abas em "pílulas", cartões com selo de equipado/preço e cartões de skin com miniatura.

## Novidades da v1.1.0
**Correções**
- **Capa**: agora é uma corda de 5 nós (Verlet) com comprimento de segmento fixo, ancorada no peito; golpes só "chicoteiam" a capa (impulso limitado), ela não estica nem some. A animação continua ativa.
- Auditoria: reinício de rodada reseta tudo (vida, posição, energia, projéteis, timers); teclas não ficam presas ao perder foco/pausar; compras só gravam após o gasto das moedas; redimensionamento mantém o fundo em cache (cache de vários tamanhos).

**Poder AWAKENING (nos duelos 1v1 vs CPU e Local, ligado/desligado na configuração da partida; não é mais um modo separado)**
- Com AWAKENING ligado: 300 HP por lutador (`AWK.hp` em `data.js`; todos os valores de balanceamento estão em `AWK`); desligado: 100 HP como antes. Armas têm dano ×1.7 com 300 HP para manter o ritmo.
- **Barra de energia** começa em 0, enche com o dano *efetivamente causado* (anti-farm: acertos em sequência na mesma vítima rendem cada vez menos), máx. 100% com brilho/pulso/partículas e som quando enche.
- Ativação: botão AWAKENING na tela (cada jogador), tecla (R / O) ou botão do controle. A energia é consumida; há trava contra ativação dupla e a animação sempre termina (limite de tempo).
- **3 super ataques** com preparação, execução, impacto e finalização: **VOID BREAKER** (aura escura, distorção, partículas atraídas, investida, onda de choque), **INFERNO OVERDRIVE** (aura incandescente, brilho no chão, calor, combo de 3 golpes, explosão) e **CELESTIAL IMPACT** (luz, partículas orbitais, piscar de luz, pilar, flash, fade). Cada um com SFX sintetizado próprio. Dano padrão ≈ 34–42% da vida máxima do alvo (nunca mata um lutador saudável em um golpe; depende de situação: alvo fora do alcance, borda, etc.). Durante o golpe o lutador tem "super-armadura" parcial.
- A CPU usa AWAKENING e tenta desviar dos ataques dos outros conforme a dificuldade.
- **AWAKENING SKINS** em Personalizar (por jogador, P1/P2): VOID BREAKER (grátis), INFERNO OVERDRIVE (500 moedas), CELESTIAL IMPACT (800). Prévia animada (sem dano e sem gastar energia), comprar/equipar/equipado, compras persistem.

**Configuração da partida 1v1** (antes de qualquer 1v1)
- Placar: sem placar / quadro de vitórias / melhor de 3, 5, 7 / personalizado. Vidas por rodada: 1, 2, 3, 5, 10 ou personalizado. Tempo: sem limite / 2 / 3 / 5 min / personalizado. Rodadas, vidas e tempo são independentes.
- AWAKENING ligado/desligado, carga lenta/normal/rápida, dano reduzido/normal/aumentado; arena, nível da CPU, armas ligadas/desligadas, efeitos visuais (câmera/distorção/tremor/partículas) ligados/desligados.
- Tempo esgotado: vence quem tem mais vidas; empate → maior % de vida; empate total → **rodada extra**.
- Fluxo de rodadas: preparação + contagem, luta, vencedor, placar atualizado, tela de resultado da rodada (avança sozinha em ~4 s; no quadro de vitórias você escolhe continuar ou encerrar), reset completo mantendo as configurações. Resultado final com placar total.

**Teclado (PC)** — Jogador 1: A/D mover, W pular, S descer, F ataque, G especial, R AWAKENING, H largar arma. Jogador 2: setas, K ataque, L especial, O AWAKENING, I largar arma. Esc/P pausa. Teclas reconfiguráveis em Configurações > Teclado. Ao perder o foco a partida pausa e as teclas são soltas. Nos menus: setas/Enter/Esc navegam (não atacam). Ao usar o teclado, os botões de toque somem; tocar na tela os traz de volta (dispositivos híbridos). Vs CPU também aceita setas/K/L/O/Espaço.

**Créditos** (Configurações > CRÉDITOS): Fundador e desenvolvedor LEANDRODROID998 · Direção criativa LEANDRODROID998 & Carlos Eduardo · Equipe MAYHEM GAMES.

**Controle (gamepad)**: AWAKENING = Back/Select ou clique do analógico (L3/R3).

Jogo de luta de bonecos de palito em HTML5/CSS3/JS puro, com física ragdoll (Verlet). Roda offline, sem dependências.

## Como jogar
Abra `stick-mayhem.html` (arquivo único) ou `index.html` (com data.js, sfx.js, engine.js, awakening.js, ai.js, render.js, awkrender.js, ui.js, style.css, logo.png na mesma pasta). No celular, use em paisagem.

## Modos
- **Duelo vs CPU** (Fácil / Normal / Difícil)
- **Duelo Local**: 2 jogadores, dois joysticks e botões independentes (multitouch)
- **Chaos Arena**: você + 3 bots (Caçador, Tático, Caótico); formatos Eliminação e Stock Battle; armas caem do céu.

## Controles
- Toque: joystick + botões Pular / Atacar / Especial (investida) / Largar-descer.
- Teclado: ver "Teclado (PC)" acima.
- **Controle (gamepad)**: plug USB/Bluetooth e aperte um botão. Jogo: analógico esquerdo/direcional move, **analógico direito mira em 360°** (mira mostrada na tela; também vira o boneco para o lado apontado; vale para armas de fogo, arco, laser e granada), A pula, X/R1/RT ataca, B/L1/LT especial, Y larga/desce, Start pausa. Duelo local: 1º controle = P1, 2º = P2. Menus: direcional/analógico navega, A confirma, B volta. Os botões de toque somem enquanto o controle estiver em uso e voltam ao tocar na tela.
- Pular duas vezes no ar (pulo duplo); descer plataformas finas com baixo + pulo.

## Conteúdo
32 armas (13 corpo a corpo, 16 projéteis/feixes, granada, dinamite, mina), 8 arenas com perigos e plataformas móveis/gelo, loja de cosméticos com moedas, desafios, estatísticas, SFX e música sintetizados (WebAudio), pausa, configurações, tela cheia/travar orientação.

## Interface
Botões em estilo vidro/gradiente e todos os ícones são vetoriais (SVG desenhados no próprio jogo, sem emojis nem imagens externas), inclusive no HUD da partida.

## Gráficos
Configurações > Gráficos: **Alto** (resolução total, todos os efeitos) ou **Baixo** (resolução 60%, metade das partículas, sem cenário animado como chuva/nuvens/neve/engrenagens, sem auras, menos anéis e textos). Perigos (lava, raios) continuam visíveis no Baixo.

## Física
Boneco com 11 pontos e restrições de distância (Verlet). Controlado: corpo cinemático + pose procedural; em golpes fortes, quebra de postura ou morte vira ragdoll completo, depois levanta. Passo fixo de 120 Hz.

## Testes realizados
v1.1.0: simulação headless das 3 AWAKENINGS (fases, consumo de energia, dano em 3 níveis, capa válida); 40 partidas CPU vs CPU em modo AWAKENING (todas terminam, sem NaN, 58 ativações); soak de 5 min por arena (sem NaN, nenhum bot parado); Chromium/Playwright: configuração, rodadas melhor-de-3, rodada extra/tempo esgotado, local com os dois teclados, pausa por Esc, compra e persistência após recarregar, abas de Configurações, botão AWAKENING por toque em 844×390, 640×300 e 1920×1080, 12 partidas consecutivas sem erros de console.

Versão anterior: Simulações headless (Node) de 5 min em cada arena com 4 bots: sem NaN, arrays limitados, nenhum bot parado >25 s; teste em Chromium (Playwright) de menus, partidas e erros de console (nenhum).

## Limitações honestas
- **v1.4.0 (online)**: **não foi testado pela internet real** — o ambiente de desenvolvimento só alcançava um servidor de sinalização local; o servidor público 0.peerjs.com é de terceiros (pode ficar fora do ar ou mudar) e o jogo depende dele ou de um servidor seu para o código funcionar. Os servidores STUN/TURN públicos usados também são de terceiros e não garantidos; em algumas redes (NAT restritivo, rede corporativa) a conexão pode falhar. Sem previsão de movimento no convidado: o jogo do convidado responde com o atraso da rede (ping), o host joga sem atraso. Se o host fechar/minimizar a aba (navegadores pausam abas em segundo plano), a partida congela para todos. Se a conexão com o servidor de sinalização cair com a sala aberta, jogadores já conectados continuam, mas ninguém novo consegue entrar. Máx. 4 jogadores, sem espectadores, sem reconexão no meio da partida, sem chat, sem AWAKENING/Fatality online. Não testado em aparelhos físicos.
- **v1.3.0**: não testado em aparelho físico (toque/gamepad só simulados). No duelo local por toque só dá para saber o lado da tela, não quem tocou. A Fatality só ocorre em placar finito ou partida única. As animações de vitória e Fatalities são feitas com desenho procedural (sem modelos 3D); o preview da Fatality é pequeno em telas baixas. Skins/Fatalities foram balanceadas e conferidas só visualmente por capturas em Chromium.
- v1.2.0: as skins "Tung Tung Tung Sahur" e "Block Miner" são desenhos próprios em estilo de stickman, não modelos fiéis dos personagens originais; a skin "Block Miner" tem nome diferente de propósito.
- O Bumerangue é lançado um por vez por lutador; se o dono for eliminado o bumerangue some.
- Armas novas foram balanceadas só por simulação.
- **Não testado em aparelhos físicos** (nem controles reais): toque e gamepad foram verificados só por eventos simulados.
- Os valores de dano/energia do AWAKENING foram calibrados em simulação; o "feeling" pode pedir ajustes (`AWK` em `data.js`).
- Distorção de cenário e zoom só no gráfico **Alto** (no Baixo ficam apenas flash/ondas); o efeito de distorção é por fatias de imagem, não shader.
- Rodada extra por empate pode repetir indefinidamente (sem limite de desempates).
- Rebind de teclas só para teclado; não há rebind de gamepad. Mudança de placar/vidas só vale para a próxima partida.
- Sem opção de HP editável na tela (só no código); campo "sem limite" = sem limite de tempo e/ou quadro de vitórias infinito.
- Gamepad testado só com controle simulado (mapeamento "standard": Xbox/PlayStation/Switch Pro); controles fora do padrão podem ter botões trocados. Sem vibração no controle.
- Não testado em aparelhos físicos; o toque foi testado só via eventos simulados no Chromium.
- Travar orientação depende do navegador (iOS Safari não permite); há aviso de girar o aparelho.
- IA é por máquina de estados, não aprende; ainda pode tomar decisões ruins em situações raras.
- Ragdoll é híbrido (controlado = cinemático) para manter a jogabilidade.
- Áudio só começa após o primeiro toque (regra dos navegadores).
- Progresso fica no localStorage do navegador (limpar dados apaga).
