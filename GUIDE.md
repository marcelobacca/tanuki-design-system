# Guia do Tanuki Sensei — como o app funciona

Ponto de entrada da documentação. Se você (humano ou modelo — Codex, Claude Design) vai
**criar, alterar ou reproduzir** qualquer tela ou exercício do Tanuki Sensei, comece aqui.

Tanuki Sensei é um app mobile (React Native + Expo) de prática de hiragana, katakana e
numerais japoneses. **Dark mode only** (light mode em estudo).

---

## Os três eixos da documentação

| Eixo | O que é | Onde |
|---|---|---|
| 🎨 **Visual** | Tokens (cores, tipografia, espaçamento) e componentes de UI | [docs/index.md](docs/index.md) |
| 🖼️ **Layouts** | Os padrões de tela reutilizáveis (L0–L5) — a casca | [docs/layouts/index.md](docs/layouts/index.md) |
| 🧩 **Exercícios** | A lógica de cada exercício, que **usa** um layout | [docs/exercises/index.md](docs/exercises/index.md) |

O modelo mental: **um exercício usa um layout, e todo layout é pintado com os tokens visuais.**
Ex.: *"Exercício 7 usa **L1 Select Grid**, direção palavra kana → tradução, pintado com os
tokens do design system."*

## Por onde começar, conforme a tarefa

- **"Criar um exercício novo no padrão do X"** → leia o layout que o X usa em
  [docs/layouts/](docs/layouts/index.md), depois o exercício X em [docs/exercises/](docs/exercises/index.md),
  e replique a estrutura.
- **"Mudar a aparência de um componente"** → [docs/index.md](docs/index.md) (visual) — nunca
  usar valores fixos, sempre tokens.
- **"Entender o fluxo de uma sessão"** (timer, skip, feedback, fim) →
  [docs/layouts/L0-session-shell.md](docs/layouts/L0-session-shell.md).
- **"Como as telas se conectam"** (navegação) → *docs/screens/* (fase 2 — em breve).

## Regras invioláveis (resumo)

- **Tokens sempre** — cor `T.*`, raio `R.*`, fonte `FONTS.*`; nunca literais. Font sizes pares
  (10/12/14/16/18/20/24/26). Detalhes em [docs/index.md](docs/index.md).
- **Ícones** — set Untitled UI (SVG inline), nunca biblioteca de fonte.
- **i18n** — toda string visível usa chave de tradução (`useT()`), nunca texto fixo.
- **Distratores** respeitam tamanho (mesmo nº de moras / bucket) — ver [docs/exercises/index.md](docs/exercises/index.md).
- **Canvas iOS** (`useDrawCanvas.ios.js`) **nunca** é modificado.

## ⚠️ Manter esta documentação viva

Esta documentação é **contrato**, não histórico. Ao mudar o comportamento de uma tela, layout,
exercício ou fluxo de sessão **no código**, atualize o `.md` correspondente **no mesmo trabalho**.
Ver [MAINTENANCE.md](MAINTENANCE.md).

---

### Escopo atual
✅ Fase 1 — Layouts (L0–L5) + Exercícios (kana + numerais).
⏳ Fase 2 — Telas (navegação, Home, Results, Profile, Missions…) — a documentar.
