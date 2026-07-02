# Prompt para o Claude Design — Light mode do Tanuki Sensei

Copie o bloco abaixo para o Claude Design. Anexe/aponte para este repositório
(ou para a versão publicada: https://design-system-taupe-gamma.vercel.app/).

---

## Contexto

Este é o design system do **Tanuki Sensei**, um app mobile (React Native) de prática de
hiragana/katakana. Hoje ele é **dark mode only**. Quero que você me ajude a **criar e testar um
light mode**, explorando 2–4 paletas diferentes para eu escolher a que mais me agrada.

O código-fonte visual está neste repositório: os tokens ficam em `styles.css` (`:root` CSS vars),
os componentes em `sections/*.html`, e as specs em `docs/*.md`. Comece lendo `docs/index.md` e
`docs/01-colors.md`.

## Paleta atual (dark) — não mudar sem eu pedir

Superfícies: `bgDeep` #06050E · `bg` #0F0E18 · `surf` #1A1929 · `surf2` #211F32 · `surfElevated` #271E3C
Texto: `text` #E8E6F8 · `textSec` #A8A6C8 · `muted` #7A78A3 · `dim` #4E4C6A
Marca: `pri` #7B72F0 · `priFaint` rgba(123,114,240,0.12)
Semânticas: `ok` #3DD691 · `err` #FF6B6B · `warn` #F5C542 · `info` #4BA3F5 · `star` #FACC15 (+ variantes `*Faint` com alpha 0.12)
Bordas/util: `border` rgba(122,120,163,0.28) · `borderFaint` rgba(255,255,255,0.08) · `track` #2E2C3F

## O que eu quero que você faça

1. **Reestruture os tokens em pares semânticos** (não valores fixos): cada token vira um par
   `{ dark, light }`. Ex.: `bg → { dark: #0F0E18, light: <novo> }`. Deixe explícito quais tokens
   **não mudam** entre modos (a marca `pri` deve permanecer o roxo #7B72F0 — é a identidade).

2. **Gere 2 a 4 paletas light candidatas.** Variações a explorar:
   - Uma "branco puro / clean" (surfaces quase brancas)
   - Uma "off-white quente" (fundo levemente creme/bege, menos clínico)
   - Uma "cool gray" (cinza-azulado suave)
   - Opcional: uma que puxe um tom lavanda muito sutil do roxo da marca
   Recalcule os `*Faint` (alpha 0.12 sobre branco quase some — provavelmente precisa 0.10–0.16 com a
   cor base mais saturada) e ajuste `border`/`track` para terem contraste sobre fundo claro.

3. **Mostre cada paleta aplicada nos componentes-chave**, lado a lado, para comparação visual:
   botão primário/secundário, card, chip de kana, barra de progresso, o "prompt" da tela de sessão,
   e um banner de feedback (correto/errado). Use os componentes reais de `sections/`.

4. **Garanta acessibilidade:** todo texto sobre superfície deve passar contraste **WCAG AA** (4.5:1
   para corpo, 3:1 para texto grande). Sinalize qualquer par que não passe.

5. Entregue a paleta vencedora como um bloco `[data-theme="light"]` de CSS variables que eu possa
   colar no `styles.css`, mantendo o dark como default no `:root`.

## Restrições

- **Identidade de marca:** o roxo `pri` #7B72F0 é sagrado — pode ajustar levemente a saturação para
  contraste no light, mas não trocar o tom.
- **Font sizes pares** (10/12/14/16/18/20/24/26) e a estrutura de nomes de token **não mudam** — este
  exercício é só sobre cor.
- Não precisa tocar em `src/theme.js` (isso fica no app, faço depois) — foque no `styles.css` e nas
  seções deste repo.

## Como quero interagir

Me mostre as candidatas visualmente primeiro. Vou iterar com você ("escurece o surf da opção 2",
"o fundo creme está amarelo demais"…) até fechar uma. Só então gere o CSS final.
