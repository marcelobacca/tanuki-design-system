# L5 · Tracing Canvas

Um **canvas de traçar o kana** com o dedo, em tela cheia (ou painel grande). Testa a escrita,
não só o reconhecimento.

Código: `src/features/exercises/layouts/TracingLayout.js` + `src/tracing/TracingCanvasNative.js`.

**Usado por:** kana 14.

---

## Anatomia

```
        romaji do kana (no L0):  "ka"

   ┌───────────────────────────────┐
   │                               │
   │            か (guia)          │   ← canvas: guia + trilha do dedo
   │                               │
   └───────────────────────────────┘
              [ limpar ]  [ ok ]
```

- **Modo guiado** (`guideInitiallyVisible: true`, dificuldade *easy*) → mostra o kana de guia
  e a ordem de traços.
- **Modo blind** (`tracingBlind: true`) → esconde o guia e testa recall puro.
- Reconhecimento e conclusão são gerenciados pelo `TracingCanvasNative` (dispara `onDone`).

## Particularidades de comportamento

- **Sem timer e sem botão Pular** — a pergunta se conclui pelo reconhecimento do traço.
- **Fixado na posição 0** da sessão — o traçar sempre abre a sessão.
- **Repetição guiado → blind:** no modo normal, após o **primeiro** acerto guiado de um kana, o
  app injeta **imediatamente** o mesmo kana em modo blind logo depois (consolidação).
- **SRS de traçado:** um kana só reaparece para traçar quando está "due" — intervalos de
  `0, 1, 3, 7, 14, 30` dias conforme o nível de domínio.

## Interface (props)

```jsx
<TracingLayout
  question={q}          // { cr, kanaData, guide, guideInitiallyVisible }
  tracingBlind={bool}   // false = guiado, true = blind
  onDone={handleDone}   // callback quando o traço é reconhecido
/>
```

## ⚠️ Regra de plataforma (crítica)
O canvas tem implementações separadas por plataforma:
- `src/hooks/useDrawCanvas.ios.js` → **NUNCA MODIFICAR** (iOS está perfeito).
- `src/hooks/useDrawCanvas.android.js` → editar só este para bugs de Android.

**Consertar Android nunca deve afetar iOS.**

## Quando usar
Exercício de **escrita** — o usuário traça o kana com o dedo. Ver
[../exercises/kana-tracing.md](../exercises/kana-tracing.md).
