# L1 · Select Grid

Grade **2×2** de quatro opções — o usuário lê o prompt (na zona do [L0](./L0-session-shell.md))
e **toca uma** das quatro. É o layout mais reutilizado do app.

Código: `src/features/exercises/layouts/MultipleChoiceGridLayout.js` (kana) ·
`src/components/numerals/NumeralSelectExercise.js` (numerais).

**Usado por:** kana 1, 2, 7, 8, 9, 10, 15 · numeral *select*.

---

## Anatomia

```
        prompt (no L0)
   ┌──────────┐  ┌──────────┐
   │  opção A │  │  opção B │
   └──────────┘  └──────────┘
   ┌──────────┐  ┌──────────┐
   │  opção C │  │  opção D │
   └──────────┘  └──────────┘
```

- Sempre **4 opções**, uma correta + 3 distratores.
- **Variante kana** (`optKana: true`): opções em fonte japonesa (Noto), tamanho grande (~26) —
  usada quando as opções são caracteres/palavras kana.
- **Variante texto** (`optKana: false`): fonte normal (~18) — usada quando as opções são
  romaji, traduções, ou dígitos.

## Estados (por opção, após responder)

| Estado | Aparência |
|---|---|
| `correct` | Verde (`ok` / `okFaint`) + pequena animação de escala (bounce) |
| `wrong` | Vermelho (`err` / `errFaint`) — só na opção que o usuário tocou errado |
| `other` | Esmaecida (`dim`) — as demais opções não escolhidas |

Toque único, **uma tentativa**. Erro dispara shake + haptic de erro; acerto dispara haptic de
sucesso (regra no [L0](./L0-session-shell.md)).

## Interface (props — variante kana)

```jsx
<MultipleChoiceGridLayout
  question={q}            // { opts | options, answer, optKana }
  ocState={ocState}       // (opt) => 'correct' | 'wrong' | 'other' | null
  onSelect={checkMC}      // (opt) => void
  answered={answered}     // boolean
  correctBtnAnim={anim}   // Animated.Value — bounce no botão correto
  onSkip={() => advance(false)}  // opcional (tipo 15, áudio)
  showSkip={timeLeft <= 0}       // condição do skip
  t={t}                   // tradução
/>
```

## Variante numerais (`NumeralSelectExercise`)
Mesmo padrão 2×2, mas as opções são **números formatados** e a fonte **encolhe conforme a
quantidade de dígitos** (24px até 3 dígitos → 14px para 7 dígitos) para nunca cortar. Mesmos
estados de cor (correct/wrong/other).

## Quando usar
Qualquer questão de **reconhecimento**: "qual romaji corresponde a esta kana?", "qual kana
tem este som?", "qual a tradução desta palavra?", "qual o número correto?". Ver os exercícios
concretos em [../exercises/kana-recognition.md](../exercises/kana-recognition.md) e
[../exercises/numerals.md](../exercises/numerals.md).
