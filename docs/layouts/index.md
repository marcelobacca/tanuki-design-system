# Layouts de tela — catálogo

Os **layouts** são os padrões de tela reutilizáveis do Tanuki Sensei. Cada layout é uma
casca visual/interação que serve **vários exercícios** — o exercício define o conteúdo e a
direção; o layout define como a tela se parece e se comporta.

> **Regra de referência:** um exercício sempre aponta para um layout. Ex.: *"Exercício 7 usa
> **L1 Select Grid**, direção palavra kana → tradução"*. Ver [../exercises/index.md](../exercises/index.md).

Todos os layouts vivem dentro do **L0 Session Shell** (o wrapper com timer, prompt e feedback).

| ID | Nome | O que é | Exercícios que usam |
|---|---|---|---|
| **[L0](./L0-session-shell.md)** | Session Shell | Wrapper de toda sessão: header/progresso, timer, prompt grande, cartão de feedback, CTA/skip | todos |
| **[L1](./L1-select-grid.md)** | Select Grid | Grade 2×2 — toca 1 de 4 opções | kana 1, 2, 7, 8, 9, 10, 15 · numeral *select* |
| **[L2](./L2-text-input.md)** | Text Input | Campo único + botão enviar | kana 5, 6, 11, 16 · numeral *type* |
| **[L3](./L3-build-blocks.md)** | Build Blocks | Linha(s) de resposta + banco de peças | kana 13, 17 · numeral *build* |
| **[L4](./L4-impostor-grid.md)** | Impostor Grid | 2×2 de tiles grandes — "qual não pertence" | kana 12 |
| **[L5](./L5-tracing-canvas.md)** | Tracing Canvas | Canvas de traçar o kana com o dedo | kana 14 |

## Anatomia comum (todas as telas de exercício)

Toda tela de exercício, independente do layout, é montada em **zonas** verticais pelo L0:

```
┌─────────────────────────────────────┐
│  [progresso]              [timer 07] │  ← L0: header + timer
│                                      │
│  INSTRUÇÃO (ex: "Selecione o kana")  │  ← L0: zona de instrução
│                                      │
│            あ                        │  ← L0: zona de prompt (grande)
│         (sub-legenda)                │
│                                      │
│   ┌────────┐   ┌────────┐            │
│   │  opt   │   │  opt   │            │  ← L1–L5: zona de resposta
│   └────────┘   └────────┘            │     (é aqui que o layout muda)
│                                      │
│   [ cartão de feedback / CTA / skip ]│  ← L0: feedbackBar
└─────────────────────────────────────┘
```

O que muda entre layouts é **só a zona de resposta**. Timer, prompt, feedback e navegação
são idênticos e documentados uma vez em [L0](./L0-session-shell.md).

## Onde vive no código do app

| Layout | Componente (repo `tanuki-native`) |
|---|---|
| L0 | `src/screens/SessionScreen.js` (kana) · `src/screens/NumeralsSessionScreen.js` (numerais) |
| L1 | `src/features/exercises/layouts/MultipleChoiceGridLayout.js` · `src/components/numerals/NumeralSelectExercise.js` |
| L2 | `src/features/exercises/layouts/TextInputLayout.js` · `src/components/numerals/NumeralTypeExercise.js` |
| L3 | `src/features/exercises/layouts/BuildWordLayout.js` · `src/components/numerals/NumeralBuildExercise.js` |
| L4 | `src/features/exercises/layouts/ImpostorGridLayout.js` |
| L5 | `src/features/exercises/layouts/TracingLayout.js` + `src/tracing/TracingCanvasNative.js` |
