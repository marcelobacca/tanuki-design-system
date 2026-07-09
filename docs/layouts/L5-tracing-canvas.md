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

### Numeração progressiva (decisão 2026-07-08 — padrão para TODO tracing)

Os números de ordem dos traços aparecem **um por vez**: só o número do traço atual é
visível; o próximo aparece quando o traço anterior é concluído. Mostrar todos os números
de uma vez polui visualmente (crítico em kanji de 10+ traços, ex. 曜 com 18) e foi
descartado. Implementado como prop `progressiveHints` no `TracingCanvasNative` (validado
no preview de kanji); **pendente**: ligar por padrão nos exercícios de tracing de kana das
sessões reais — ticket no Linear (time TAN).

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

## ⚠️ Traços "quebrados" (cotocos) = comando SVG não suportado

Sintoma clássico: um traço renderiza só um segmento curto no início e o resto some.
**Não é bug de dados nem do canvas** — é o parser de path SVG.

- Os traços vêm do **KanjiVG** como strings de path (`M…c…s…`). Quem converte em pontos é
  `samplePath()` em `src/tracing/pathSampling.js`, que **para silenciosamente no primeiro
  comando SVG que não conhece** (por design, para nunca desenhar traço errado).
- Comandos suportados hoje: `M m L l C c S s Z z`. O `S/s` (cúbica suave) foi adicionado em
  2026-07 quando 7 kanji N5 (曜 水 長 学 聞 買 道) apareceram com traços quebrados — kana quase
  não usam `S`, kanji usam bastante.
- Ao expandir o banco de kanji, comandos novos (`Q/T/H/V/A`) podem aparecer. Diagnóstico em
  segundos: varrer os paths e listar comandos fora do set suportado (ver memória do projeto ou
  o histórico do fix). A correção é implementar o comando em `samplePath()` e revalidar todos
  os traços (nenhum ponto vazio/NaN, comprimento total cresceu).

## Quando usar
Exercício de **escrita** — o usuário traça o kana com o dedo. Ver
[../exercises/kana-tracing.md](../exercises/kana-tracing.md).
