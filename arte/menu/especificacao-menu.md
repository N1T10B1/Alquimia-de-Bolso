# Especificação do menu inicial

Aprovado pelo Rafael em 20/11/2026: botões opção A (fita marcadora) e fontes Grenze Gotisch + Grenze.

## Referências

- Protótipo dos botões (opção A): https://claude.ai/artifact/LU232Uev3oxcJCPUDGWd7o (fonte: `arte/menu/botoes-menu.html`)
- Protótipo das fontes: https://claude.ai/artifact/5gb3GT2DX9JpDD2d8mVe1z (fonte: `arte/menu/fontes-menu.html`)
- Fundos: `arte/menu/menu-fundo.png` (1672x941, PC) e `arte/menu/menu-fundo-celular.png` (941x1672). Versões leves em WebP: `pc.webp` e `cel.webp`.

## Estrutura

- Tela inicial antes da bancada. Fundo PC em telas largas, fundo celular em telas em pé (`aspect-ratio` / `orientation`), sempre `cover`.
- Título "Alquimia de Bolso" em duas linhas, Grenze Gotisch, creme `#ecd9ae` com leve brilho de vela; subtítulo "o caderno da boticária" em Grenze, cobre `#b96f2c`.
- No PC, título e botões no terço esquerdo; no celular, centralizados no terço de cima. Nada pode encostar na cena (caderno, vela, prateleira).
- Botões, nesta ordem:
  1. **Continuar**: só aparece se houver jogo salvo; é o principal (um pouco maior e já selecionado ao abrir).
  2. **Novo jogo**: se houver save, pede confirmação numa página de papel (estilo etiqueta, opção B) antes de apagar.
  3. **Livro de receitas**: abre a coleção sem entrar na bancada.
  4. **Opções**: som ligado/desligado, volume, menos animação e tamanho do texto. Também em página de papel.
  5. **Créditos**.
  Sem botão Sair (jogo de navegador). Sem botão desativado: o que não se aplica não aparece.
- Versão do jogo pequena no canto inferior, em cinza `#8c8478`.

## Botão (opção A)

- Texto em Grenze creme direto na parede, sem caixa. Ícone pequeno à esquerda (provisório em traço; depois vira a miniatura da xilogravura do item).
- Selecionado (mouse, teclado ou toque): texto cor de chama `#f7c163` e fita vermelha `#a32219` com ponta em V aparecendo à esquerda (150 a 180 ms). No celular, mesma fita.
- Foco do teclado: além da fita, contorno tracejado cor de chama.
- Navegação por setas para cima e para baixo, Enter ativa. Área de toque mínima de 44 px de altura no celular.
- `prefers-reduced-motion`: sem animação da fita.

## Fontes

- Embutir Grenze Gotisch e Grenze (licença OFL) no `jogar.html` como subset latino com acentos, em base64, para funcionar offline. Fallback: `Georgia, serif`.
- Aplicar no jogo inteiro conforme a seção 5 do `guia-de-arte-grimorio.md`.
