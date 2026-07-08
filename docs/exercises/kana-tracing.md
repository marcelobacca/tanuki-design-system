# Exercício de traçar (L5 Tracing Canvas)

Usa o [L5 Tracing Canvas](../layouts/L5-tracing-canvas.md): o usuário **traça** o kana com o
dedo. É o único exercício sem timer e sem botão Pular.

Código: `src/utils/questions/q14.js` + `src/tracing/`.

---

## Exercício 14 — romaji → traçar o kana
- **Prompt:** o romaji do kana. **Resposta:** traçar o kana correspondente.
- **Guiado vs blind:**
  - *easy* → guia visível desde o início (`guideInitiallyVisible`).
  - modo blind → guia escondido, recall puro.
- **Repetição guiado → blind:** no modo normal, após o **primeiro acerto guiado** de um kana, o
  mesmo kana é injetado **logo em seguida** em modo blind (consolidação imediata).
- **Abre a sessão:** o traçar é **fixado na posição 0** — sempre a primeira pergunta.
- **SRS de traçado:** um kana só volta para traçar quando está "due"; intervalos de
  `0, 1, 3, 7, 14, 30` dias conforme o nível de domínio (`draw.ok`).
- **Conclusão:** por reconhecimento do traço no `TracingCanvasNative` (callback `onDone`), não
  por toque num botão.

## ⚠️ Regra de plataforma (crítica)
`src/hooks/useDrawCanvas.ios.js` → **NUNCA MODIFICAR**. Bugs de Android: só em
`useDrawCanvas.android.js`. Consertar Android nunca deve afetar iOS.

### Como reproduzir
1. Precisa de **dados de traçado** do caractere (ordem/geometria dos traços) — sem isso, o kana
   é pulado.
2. Reutilize o **L5 Tracing Canvas** e o `TracingCanvasNative`.
3. Respeite o SRS e a regra de plataforma acima.
