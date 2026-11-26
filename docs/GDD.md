# ALQUIMIA DE BOLSO
## Game Design Document (GDD) + Prompt Mestre para Claude Opus 5.5
**Versão:** 1.1 — MVP de 48 horas com orquestração por subagentes  
**Plataforma:** Navegador (HTML5, CSS3, JavaScript ES modules)  
**Formato:** Single-player, desktop-first, responsivo para celular  
**Escopo:** Protótipo completo, offline, sem backend e sem dependências obrigatórias

---

# PARTE I — GAME DESIGN DOCUMENT

## 1. Visão geral
**Pitch:** Administre uma pequena bancada alquímica: misture dois ingredientes para descobrir poções, atenda encomendas, ganhe moedas e compre melhorias para acelerar novas descobertas. Cada receita inédita revela uma combinação e incentiva a próxima tentativa.

**Pilares:** (1) experimentação acessível; (2) feedback visual e sonoro satisfatório; (3) decisões econômicas simples; (4) progressão visível em sessões de 5 a 15 minutos.

**Loop principal:** escolher 2 ingredientes → verificar custo → misturar → revelar poção ou mistura falha → atualizar livro de receitas → entregar pedidos ou vender → receber moedas/XP → comprar ingredientes e melhorias → experimentar novamente.

**Condição de vitória do MVP:** descobrir as 12 poções. O jogo continua depois, permitindo completar pedidos e bater o recorde de moedas.

## 2. Regras e sistemas

### 2.1 Ingredientes e estoque
Existem 8 ingredientes. Cada mistura consome **1 unidade de cada ingrediente** (se o jogador selecionar duas unidades do mesmo ingrediente, consome 2). O jogador pode comprar qualquer ingrediente no mercado, sem espera nem cooldown. Estoque inicial: 3 de cada ingrediente. Saldo inicial: 30 moedas.

| ID | Ingrediente | Custo unitário | Elemento temático |
|---|---|---:|---|
| agua | Gota Lunar | 3 | água |
| fogo | Brasa Rubra | 3 | fogo |
| planta | Folha Viva | 3 | natureza |
| cristal | Pó de Cristal | 4 | mineral |
| sombra | Sombra Engarrafada | 4 | obscuridade |
| luz | Orvalho Solar | 4 | luz |
| cogumelo | Cogumelo Azul | 3 | fungo |
| vento | Pena do Vento | 3 | ar |

**Balanceamento importante:** as misturas incorretas produzem *Lodo Instável*, item vendável por 1 moeda, para evitar punição total. Cada mistura, correta ou incorreta, dá 1 XP; descoberta inédita dá 5 XP adicionais. As receitas são **comutativas**: A+B = B+A.

### 2.2 Receitas oficiais do MVP
Apenas as combinações abaixo dão poções; as demais resultam em Lodo Instável. Não inventar receitas extras nem mudar os IDs sem atualizar testes.

| ID | Mistura | Poção | Venda | Raridade |
|---|---|---|---:|---|
| vapor | agua + fogo | Névoa Fumegante | 10 | comum |
| cura | agua + planta | Elixir de Cura | 10 | comum |
| vigor | fogo + planta | Tônico de Vigor | 10 | comum |
| brilho | cristal + luz | Essência Cintilante | 13 | incomum |
| invisibilidade | sombra + vento | Véu Invisível | 13 | incomum |
| sono | cogumelo + agua | Chá do Sono | 10 | comum |
| chamaazul | fogo + cristal | Chama Azul | 13 | incomum |
| raiz | planta + cristal | Pele de Raiz | 13 | incomum |
| amanhecer | luz + agua | Gotas do Amanhecer | 13 | incomum |
| eclipse | sombra + luz | Eclipse Líquido | 16 | rara |
| esporos | cogumelo + vento | Nuvem de Esporos | 10 | comum |
| tempestade | vento + fogo | Faísca da Tempestade | 10 | comum |

O livro de receitas mostra silhuetas/??? para poções desconhecidas e exibe ingredientes somente após a descoberta. O jogo não revela antecipadamente as combinações, exceto dicas opcionais pagas.

### 2.3 Mistura, inventário e venda
- O usuário seleciona dois ingredientes por clique/toque (ou arrasta e solta como melhoria opcional, **não necessária** no MVP).
- A bancada mostra os dois ingredientes e um botão **Misturar**; o botão fica desabilitado se faltar estoque.
- O resultado surge com animação CSS curta, nome, raridade, preço de venda e indicador **Nova descoberta!** apenas uma vez por receita.
- Cada mistura gera 1 poção física no inventário (ou 1 Lodo). A poção pode ser **vendida** pelo valor tabelado ou **entregue** em um pedido compatível, não ambos.
- Nunca consumir estoque, gerar item, XP ou dinheiro mais de uma vez por clique.

### 2.4 Clientes e pedidos
- Existem **3 espaços de pedidos** simultâneos, gerados a partir das poções já descobertas; assim, nenhum pedido exige uma receita que o jogador ainda não conhece.
- Ao começar, nenhum pedido é exibido até a primeira receita descoberta; pedidos são gerados automaticamente assim que houver receitas conhecidas.
- Cada pedido contém cliente fictício, poção e recompensa: **valor de venda da poção + 5 moedas**.
- Entregar consome 1 poção do inventário, dá recompensa e 3 XP; substitui o pedido imediatamente por outro pedido válido, evitando pedidos duplicados simultâneos quando houver variedade suficiente.
- O botão **Trocar pedido** custa 3 moedas e gera outro pedido válido, quando existir alternativa; se não houver alternativa, permanece inativo.
- Sem limite de tempo, sem pressão artificial e sem punição por recusar um pedido.

### 2.5 Progressão e upgrades
- XP acumulado determina o nível: **nível = 1 + floor(XP / 20)** (modelo deliberadamente simples, sem reiniciar XP).
- Exibir barra rumo ao próximo múltiplo de 20 XP.
- **3 melhorias**, compráveis uma única vez cada:
  1. **Caldeirão Eficiente (30 moedas):** 20% de chance de não consumir ingredientes ao misturar, com verificação por transação (consumo ou não de ambos juntos).
  2. **Marca do Mercador (45 moedas):** +25% no valor de venda das poções e nas recompensas de pedidos, arredondado para baixo; não se aplica ao Lodo.
  3. **Lupa Arcana (25 moedas):** desbloqueia dicas para descobrir receitas; cada dica custa 5 moedas e revela um ingrediente de uma poção ainda não descoberta, sem revelar o par inteiro.
- Melhorias não acumulam além de um nível no MVP.

### 2.6 Pistas opcionais
A Lupa Arcana habilita o botão **Pedir dica**. A dica escolhe uma receita não descoberta, informa seu nome e somente o primeiro ingrediente, cobra 5 moedas e pode ser repetida até obter dicas de outras receitas; não cobrar se não há receitas a descobrir. Guardar dicas recebidas e evitar pistas duplicadas, se houver opção. Dicas são conveniência, não bloqueio.

## 3. Interface e direção de arte
**Estética:** pixel art acolhedora de fantasia, tons quentes, tons de cobre, frascos de vidro, acentos turquesa e violeta. Criar interface com CSS, gradientes, bordas pixeladas e ícones SVG inline simples ou emoji consistentes; **não depender de imagens externas ou gerar dezenas de assets**. Não simular "pixel art" com imagens borradas.

**Layout desktop:** cabeçalho (moedas, nível, progresso, receitas 0/12) → coluna esquerda Mercado/Ingredientes → centro Caldeirão/Resultado/Inventário → direita Pedidos/Melhorias → aba Livro de Receitas. Em telas estreitas, empilhar painéis em uma única coluna.

**Acessibilidade:** controles clicáveis com teclado, foco visível, textos legíveis, `aria-live` para resultados, movimento reduzido via `prefers-reduced-motion`; som desligado por padrão ou habilitado apenas por interação, com chave visível e persistida.

**Áudio:** sons sintéticos curtos com Web Audio API, gerados localmente; não baixar MP3; respeitar política de autoplay.

## 4. Feedback e retenção saudável
- Revelação com brilho e partículas discretas via CSS (sem canvas pesado).
- Animação e mensagem especial para descoberta inédita.
- Objetivo próximo sempre visível: `Receitas descobertas: X/12`.
- Pequenas decisões: vender agora para comprar ingredientes ou guardar uma poção para pedidos mais lucrativos.
- Os pedidos garantem metas de curto prazo; o livro fornece coleção de longo prazo.
- Sem anúncios, loot boxes, energia artificial, login, pagamentos, mecânicas manipulativas ou timers compulsivos.

## 5. Persistência
`localStorage`, chave versionada `alquimia-de-bolso-save-v1`; salvar dinheiro, XP, estoques, inventário, IDs de receitas descobertas, upgrades, pedidos, dicas, som e estatísticas. Validar e sanitizar dados importados do storage. Se dados estiverem corrompidos, preservar funcionamento iniciando um save seguro; oferecer **Novo jogo** com confirmação. Salvar ao fim de cada ação concluída.

## 6. Arquitetura sugerida
```text
alquimia-de-bolso/
├─ index.html
├─ styles.css
├─ src/
│  ├─ data.js       # ingredientes, receitas, melhorias, clientes
│  ├─ engine.js     # estado, regras, economia e ações puras ou testáveis
│  ├─ storage.js    # load, save, validação e reset
│  ├─ ui.js         # renderização, interações, acessibilidade
│  ├─ audio.js      # síntese simples de efeitos
│  └─ main.js       # inicialização e eventos
├─ tests/
│  └─ game.test.mjs # testes com node:test
└─ README.md
```
Sem framework, CDN, backend ou build obrigatório. Usar `<script type="module">`. Como módulos ES podem não funcionar em `file://` em todos os browsers, documentar execução local com `python -m http.server 8000` (ou `npx serve`) e URL `http://localhost:8000`.

## 7. Cronograma de 48 horas
| Janela | Entrega prioritária |
|---|---|
| Sábado 0–3h | Estrutura, dados, estado e regras de mistura |
| Sábado 3–6h | Mercado, estoque, inventário e venda |
| Sábado 6–9h | Livro de receitas, descoberta e feedback |
| Sábado 9–12h | Pedidos, economia e testes iniciais |
| Domingo 0–3h | Melhorias, XP, dicas e persistência |
| Domingo 3–6h | Interface responsiva, efeitos e acessibilidade |
| Domingo 6–9h | Testes, balanceamento e correções |
| Domingo 9–12h | README, empacotamento e versão final jogável |

**Obrigatório para MVP:** 8 ingredientes, 12 receitas, estoque, comprar/misturar/vender, 3 pedidos, upgrades, XP, livro, save, layout responsivo, testes básicos.  
**Fora de escopo:** mapa explorable, personagens animados, multiplayer, loja real, servidor, missões narrativas longas, drag-and-drop obrigatório, dezenas de receitas, crafting em três ingredientes, crafting em tempo real.

## 8. Critérios de aceitação verificáveis
1. As 12 combinações corretas funcionam em qualquer ordem; combinações incorretas geram Lodo.
2. Estoque jamais fica negativo e misturar falha adequadamente sem insumos.
3. A carteira nunca fica negativa; compras e trocas são recusadas sem fundos.
4. Uma poção não pode ser vendida e entregue duas vezes.
5. Pedidos exigem apenas receitas descobertas, e pagar pedido é mais vantajoso que vender.
6. Upgrades só podem ser comprados uma vez e aplicam os efeitos anunciados.
7. O livro marca inéditas somente na primeira descoberta.
8. Recarregar a página preserva progresso e opções.
9. Novo jogo pede confirmação e apaga apenas a chave própria do jogo.
10. Funciona em desktop e celular, sem erro no console, offline após carregar os arquivos locais.
11. `node --test tests/game.test.mjs` verifica o núcleo e passa.
12. O jogo pode ser iniciado por um servidor estático local sem APIs, tokens ou CDN.

---

# PARTE II — PROMPT MESTRE PARA O CLAUDE OPUS 5.5

> Copie todo o texto desta seção e envie ao Claude Opus 5.5 junto com a Parte I (GDD) como especificação canônica.

Você é um **engenheiro sênior de jogos HTML5, game designer de sistemas e especialista em UX acessível**. Sua missão é **implementar integralmente** o jogo **Alquimia de Bolso**, conforme o GDD fornecido, em até um escopo de MVP de 48 horas.

## Objetivo não negociável
Entregar um protótipo **realmente jogável**, agradável, responsivo, offline e com persistência, sem dependências externas. Não entregar apenas mockup, telas inertes, pseudocódigo ou descrições do que faria. Todo botão visível deve executar uma ação real ou estar desabilitado com explicação.

## Contrato de implementação
1. Stack: HTML semântico, CSS3, JavaScript vanilla ES modules. Sem React, Phaser, npm runtime, bibliotecas externas, fontes remotas, CDN, backend, banco remoto ou API.
2. Use a arquitetura e os nomes dos arquivos sugeridos no GDD, ajustando somente se necessário e justificando.
3. Defina os dados em `src/data.js` com IDs estáveis. Centralize fórmulas econômicas e validação de ações em `src/engine.js`.
4. A engine não pode depender do DOM; separe lógica de estado, persistência, UI e áudio.
5. A geração de pedidos depende apenas das receitas descobertas. Não gerar pedidos impossíveis. Evite duplicação de pedidos quando houver opções.
6. Receitas são comutativas: normalize as chaves dos dois IDs antes de comparar. Não use nomes exibidos como identificadores.
7. Uma mistura é uma transação atômica: validar estoque, rolar eficiência uma vez, consumir os ingredientes se aplicável, criar resultado, conceder XP, marcar descoberta e salvar. Não execute parte da transação se a validação falhar.
8. Valores monetários inteiros não negativos. Bônus de 25% arredondado para baixo. Aplique bônus de mercador sobre o valor-base total do pedido, uma vez apenas.
9. Persistência com versão e sanitização robusta de `localStorage`; capturar exceções de storage; resetar somente os dados próprios, com confirmação visível.
10. Controles acessíveis: botões reais, `aria-label` quando necessário, foco visível, `aria-live` para feedback e redução de movimento.
11. Responsivo a partir de 320px, sem rolagem horizontal. Desktop deve permitir entender estoque, caldeirão e pedidos rapidamente.
12. Use Web Audio API para 3–4 sinais curtos com volume baixo, ou deixe som opcional funcional. Não depender de arquivos de áudio externos.
13. Interface em **português brasileiro**, consistente com nomes e números do GDD.
14. Nada de mecânicas fora do escopo antes de todas as regras e testes funcionarem.
15. Não mexa em arquivos do usuário fora da pasta do projeto; não instalar pacotes sem necessidade.

## Orquestração obrigatória por subagentes
Você é o **agente principal/orquestrador**. **Antes de implementar, divida a execução em subagentes especializados**, usando o mecanismo real de subagentes/delegação disponível no ambiente Claude. Não apenas descreva a divisão: delegue efetivamente as tarefas quando a ferramenta existir. Trabalhe em paralelo somente em áreas com arquivos e interfaces independentes; respeite dependências e faça a integração pelo agente principal.

| Subagente | Responsabilidade | Arquivos sob responsabilidade | Entrega verificável |
|---|---|---|---|
| **A — Engine e dados** | Ingredientes, receitas, regras atômicas, dinheiro, XP, inventário, validações e RNG injetável | `src/data.js`, `src/engine.js` | API determinística e testes de unidade dos cálculos |
| **B — Interface e experiência** | HTML acessível, CSS responsivo, componentes visuais e eventos de interface | `index.html`, `styles.css`, `src/ui.js` | Interface conectável à API da engine, sem lógica de economia duplicada |
| **C — Progressão e persistência** | Pedidos, upgrades, dicas, livro e save com versão/sanitização | `src/progression.js`, `src/storage.js` | Funções puras ou adaptadores testáveis, sem acesso direto ao DOM |
| **D — QA e documentação** | Casos de teste, verificação de integração, README e checklist de aceitação | `tests/game.test.mjs`, `README.md` | Testes executáveis e relatório de falhas reais |

**Contrato entre subagentes (definir primeiro):** o orquestrador estabelece os modelos de estado, os nomes e assinaturas das funções exportadas, o formato de retorno de erros e eventos, e as responsabilidades de cada módulo. Registre esse contrato brevemente em `docs/CONTRATOS.md` antes da implementação concorrente. O módulo `src/main.js` e a integração final são de responsabilidade **exclusiva do agente principal**. O módulo `src/audio.js` pode ser feito pelo agente B após estabilizar a UI. Os arquivos `src/progression.js`, `src/storage.js` e `docs/CONTRATOS.md` são adições explícitas à estrutura sugerida pelo GDD.

**Regras de coordenação:**
1. Cada subagente recebe o GDD, seu escopo, os critérios de aceitação aplicáveis e o contrato comum. Não delegue tarefas vagas como “faça o jogo inteiro”.
2. **Não permita edição simultânea do mesmo arquivo**; quando for necessário alterar um arquivo de outro agente, registre a demanda para que o proprietário a implemente ou o orquestrador faça a integração após a entrega.
3. O agente D começa pelos testes/contratos esperados e pode testar entregas parciais; não deve alterar implementação silenciosamente. Cada subagente relata o que concluiu, os arquivos alterados, os testes realmente executados e bloqueios.
4. O agente principal resolve conflitos, conecta módulos, executa o fluxo completo no navegador e roda `node --test tests/game.test.mjs`. É responsável por corrigir as falhas de integração e garantir que todos os botões sejam funcionais.
5. Não passe à fase de polimento enquanto os fluxos centrais não estiverem implementados e testados. Não considere relato de subagente como prova de que a integração funciona.
6. Mantenha um resumo enxuto de progresso por subagente em `docs/STATUS.md`, com **feito / pendente / bloqueado**, para evitar releitura desnecessária de todo o contexto. Atualize o resumo a cada entrega significativa.
7. Se o ambiente **não disponibilizar subagentes reais**, informe essa limitação em uma frase e **execute as mesmas frentes sequencialmente como papéis especializados**, mantendo os mesmos proprietários de arquivos, contratos e critérios. Nunca finja ter criado ou acionado subagentes.
8. Priorize **até quatro subagentes** e evite criar uma cadeia de agentes ou paralelizar tarefas pequenas demais. O objetivo é reduzir conflitos e acelerar a entrega, não aumentar a complexidade.

**Sequência recomendada:** (a) orquestrador define contratos; (b) delega A, B, C e D de forma coordenada; (c) integra e testa os módulos assim que estiverem disponíveis; (d) devolve falhas específicas ao responsável; (e) executa revisão final, empacotamento e entrega. A etapa de integração e validação final nunca é delegada por completo.

## Ordem de execução
**Fase 1 — Núcleo testável:** criar estrutura, dados completos, estado inicial, função de receita comutativa, mistura, mercado, inventário, venda, XP, níveis e cálculo de bônus. Adicionar testes unitários antes de evoluir.

**Fase 2 — Interface jogável:** construir layout e conectar seleção de ingredientes, compra, caldeirão, resultado, inventário, livro de receitas e status. Sem botões fictícios.

**Fase 3 — Metajogo:** implementar geração, troca e entrega de pedidos; upgrades; dicas; salvar/carregar; novo jogo com confirmação.

**Fase 4 — Polimento:** feedback visual, animações suaves, som opcional, responsividade, acessibilidade e microinterações sem sacrificar clareza.

**Fase 5 — QA e entrega:** rodar testes e simular sequências de ações; corrigir falhas; entregar todos os arquivos e `README.md` com instruções de execução e controles.

## Casos de teste mínimos
- `agua + fogo` e `fogo + agua` resultam em `vapor`.
- `agua + agua` só é permitido com 2 unidades de água e, sem receita, vira Lodo.
- Misturar sem itens não altera estado nem premia XP.
- Receita inédita rende XP extra apenas na primeira ocorrência.
- Venda reduz inventário em 1 e paga a quantia correta.
- Pedido só aceita a poção especificada, consome 1 e gera uma nova encomenda.
- Carteira insuficiente impede compra de ingredientes/upgrades/dicas/troca de pedido.
- Caldeirão Eficiente é testável com RNG injetável; pode isentar os **dois** ingredientes, nunca apenas um.
- Marca do Mercador arredonda corretamente.
- Save/restauração mantém descobertas e upgrades; dados inválidos não quebram a inicialização.
- Vitória ao descobrir 12/12 receitas, sem impedir o free play.

## Política de decisões
Se um detalhe do GDD estiver implícito, adote a interpretação mais simples, consistente e documentada. **Não interrompa a implementação para perguntas menores.** Não invente novas funcionalidades, receitas nem dependências sem necessidade. Sempre prefira uma versão simples **realmente funcional** a uma versão visualmente elaborada e incompleta.

## Entregáveis e resposta final esperada
- Arquivos completos do projeto (código-fonte, sem trechos omitidos).
- Comando para rodar em servidor local e a URL para abrir.
- Comando para executar testes e o resultado real obtido; **não alegue testes que não executou**.
- `README.md` com instruções, regras resumidas e limitações conhecidas.
- Se o ambiente permitir, criar `alquimia-de-bolso.zip` com a árvore de arquivos; caso contrário, listar e apresentar os arquivos integralmente para copiar.
- Resumo sucinto com: funcionalidades implementadas, pendências concretas e instruções de verificação manual.

**Comece definindo os contratos e delegando as frentes aos subagentes disponíveis. Depois implemente, integre e valide as Fases 1–5 até entregar o jogo funcional.**
