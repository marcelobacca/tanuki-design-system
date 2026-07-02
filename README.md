# Tanuki Sensei — Design System

Fonte da verdade visual do app **Tanuki Sensei** (prática de hiragana/katakana em React Native + Expo).
Showcase estático (HTML/CSS/JS puro, sem build) que documenta tokens e componentes.

🔗 **Live:** https://design-system-taupe-gamma.vercel.app/

> **Dark mode only** (hoje). Um modo claro (light mode) está sendo estudado — ver [Light mode](#light-mode-em-estudo).

---

## Rodar localmente

Site 100% estático, mas o `scripts.js` faz `fetch()` das seções — então **precisa de um servidor HTTP** (não abre via `file://`).

```bash
npm install
npm run dev          # serve em http://localhost:4444
# ou, sem instalar nada:
npx serve -l 4444 .
```

## Estrutura

```
index.html              Casca: sidebar de navegação + <div id="sections-root">
styles.css              TODOS os tokens (:root CSS vars) + estilos de todos os componentes
scripts.js              Injeta cada sections/*.html no DOM + interatividade do showcase
sections/*.html         Uma seção por arquivo (cores, tipografia, botões, chips…)
docs/*.md               Spec textual de cada seção — a referência para implementar no app
docs/index.md           Índice + regras globais invioláveis + quick-reference de tokens
```

Para adicionar/editar uma seção: edite `sections/NN-nome.html` (visual) **e** `docs/NN-nome.md` (spec).
`scripts.js` tem a lista de seções carregadas — adicione o nome lá se criar uma nova.

## Tokens — onde ficam

Todos os tokens de cor vivem em **`styles.css` `:root`** como CSS variables (`--pri`, `--surf`, `--star`…).
No app React Native, o espelho desses tokens está em `src/theme.js` (objeto `T`, `R`, `FONTS`) — **fora deste repo**.

### Regra dos 4 lugares (ao criar/alterar um token)
Um token novo ou alterado precisa ser atualizado em **quatro** lugares para manter app e DS em sincronia:

1. `styles.css` → `:root` (aqui)
2. `sections/01-colors.html` → nova `.color-token-row` (aqui)
3. `docs/01-colors.md` → linha na tabela (aqui)
4. `src/theme.js` no repo do app (`tanuki-native`) → objeto `T`

Neste repo standalone você mexe nos 3 primeiros; o 4º é aplicado no app depois.

## Regras globais invioláveis

- **Dark mode only** (até o light mode ser aprovado)
- **Font sizes pares:** 10 / 12 / 14 / 16 / 18 / 20 / 24 / 26 — não existem 11/13/15/17 (13 e 15 → 14; 17 → 16)
- **Cor é token separado da tipografia** (specimens de texto sempre em `--text`)
- Nunca valores hardcoded — sempre a CSS var / o token
- **Ícones:** set Untitled UI (SVG inline), nunca biblioteca de fonte

Detalhes completos em [`docs/index.md`](docs/index.md).

## Paleta atual (dark) — resumo

| Grupo | Tokens |
|---|---|
| Superfícies | `bgDeep` `bg` `surf` `surf2` `surfElevated` `bgMissions` |
| Texto | `text` `textSec` `muted` `dim` |
| Marca | `pri` `priFaint` |
| Semânticas | `ok` `err` `warn` `info` `star` (+ `*Faint`) |
| Bordas/util | `border` `borderFaint` `track` |

Valores hex completos: [`docs/01-colors.md`](docs/01-colors.md).

## Light mode (em estudo)

O objetivo é derivar um **light mode** a partir desta paleta dark, mantendo a identidade de marca
(o roxo `pri` #7B72F0). Estratégia planejada: transformar os tokens em **pares semânticos** (dark/light)
em vez de valores fixos. O prompt para explorar isso com o Claude Design está em
[`PROMPT-CLAUDE-DESIGN.md`](PROMPT-CLAUDE-DESIGN.md).

## Deploy

Site estático — Vercel serve direto da raiz, sem build.
Framework preset: **Other** · Build command: *(vazio)* · Output directory: `./`
