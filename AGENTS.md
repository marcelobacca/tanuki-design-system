# AGENTS.md — Tanuki Sensei

Instruções para agentes (Codex e afins) que trabalham no app **Tanuki Sensei** (mobile,
React Native + Expo — prática de hiragana/katakana/numerais).

Este repositório é a **fonte da verdade** de como o app se parece e como funciona. **Consulte-o
antes de escrever qualquer código de tela ou exercício.**

## Por onde começar
Leia **`GUIDE.md`** na raiz primeiro — é o índice que liga os quatro eixos:
- `docs/strategy/` → **futuro do produto**: visão e decisões aprovadas (com data) de
  vocabulário+gramática, Trilha N5, kanji e B2B. **Leia antes de qualquer decisão de
  produto ou conteúdo — não re-decidir o que já está registrado lá.**
- `docs/index.md` + `docs/01-colors.md` → **visual**: tokens de cor, tipografia, espaçamento.
- `docs/layouts/` → **padrões de tela reutilizáveis (L0–L5)**, a casca visual/interação:
  - **L0** Session Shell · **L1** Select Grid · **L2** Text Input · **L3** Build Blocks · **L4** Impostor Grid · **L5** Tracing Canvas.
- `docs/exercises/` → **cada exercício** (kana `q1`–`q17` + numerais build/select/type).
  Comece pela tabela mestra `docs/exercises/index.md`.

## Modelo mental
Um **exercício usa um layout**, e todo **layout é pintado com os tokens visuais**.
Ex.: *"Exercício 7 usa **L1 Select Grid**, direção palavra kana → tradução."*

Para reproduzir ou criar um exercício:
1. Ache a linha do exercício (ou o mais parecido) em `docs/exercises/index.md`.
2. Abra o `.md` da família dele em `docs/exercises/` — a lógica: prompt, resposta, distratores, gate.
3. Abra o `.md` do **layout** que ele usa em `docs/layouts/` — anatomia, estados e props da tela.
4. Reproduza seguindo esses dois docs + os tokens visuais.

## Regras invioláveis
- **Tokens sempre**: cor `T.*`, raio `R.*`, fonte `FONTS.*`. Nunca valores literais.
- **Font sizes pares**: 10/12/14/16/18/20/24/26 (não existem 11/13/15/17).
- **Ícones**: set Untitled UI (SVG inline via `Icon.js`), nunca biblioteca de fonte.
- **i18n**: toda string visível usa chave de tradução (`useT()`), nunca texto fixo.
- **Distratores**: opções de múltipla escolha respeitam tamanho (mesmo nº de moras / bucket);
  se não houver distratores suficientes do tamanho certo, a questão não é gerada.
- **Canvas iOS** (`useDrawCanvas.ios.js`) **nunca** é modificado; bugs de canvas só em `useDrawCanvas.android.js`.

## Ao mudar comportamento
Atualize o `.md` correspondente neste repositório **no mesmo trabalho** — ver `MAINTENANCE.md`
(mapa código→doc). Documentação desatualizada é considerada bug.

## Onde o código real vive
O código do app está no repositório `tanuki-native` (separado). Cada doc de layout/exercício
aponta os arquivos correspondentes (`src/screens/*`, `src/features/exercises/*`,
`src/utils/questions/*`, etc.). Este repositório documenta o comportamento; o app o implementa.
