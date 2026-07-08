# L2 · Text Input

Um **campo de texto único + botão enviar** (seta →). O usuário digita a resposta em vez de
escolher. Mais exigente que L1 porque testa recall ativo (saber escrever, não só reconhecer).

Código: `src/features/exercises/layouts/TextInputLayout.js` (kana) ·
`src/components/numerals/NumeralTypeExercise.js` (numerais).

**Usado por:** kana 5, 6, 11, 16 · numeral *type*.

---

## Anatomia

```
        prompt (no L0)

   ┌───────────────────────┐  ┌────┐
   │  campo de digitação   │  │ →  │
   └───────────────────────┘  └────┘
        ↑ banner "quase!" / "errado" aparece aqui em cima nas tentativas erradas
```

- Campo de 52px de altura + botão de envio quadrado (52×52) com ícone `arrow-right`.
- Numerais usam **teclado numérico** (`keyboardType="number-pad"`); kana usa teclado normal
  em romaji.

## Retry (3 tentativas)

Diferente do L1, o L2 **não reprova na primeira**. A cada envio errado:

1. Compara `input.trim().toLowerCase()` com a resposta.
2. Se a **distância de edição (Levenshtein) ≤ 1** → banner **"quase!"** (amarelo `warn`).
3. Senão → banner **"errado"** (vermelho `err`).
4. Incrementa o contador de tentativas; na **3ª tentativa errada**, marca como errado e
   **revela** a resposta.

Por isso o L2 (fora o tipo 16 de áudio) **não mostra botão Pular** — o próprio ciclo de 3
tentativas é a saída.

## Interface (props)

```jsx
<TextInputLayout
  question={q}
  input={input}                 // string — valor atual
  onChangeInput={setInput}      // (text) => void
  tryFeedback={tryFeedback}     // null | 'close' | 'wrong'
  answered={answered}
  onSubmit={checkInput}         // () => void
  onSkip={() => advance(false)} // opcional — só tipo 16 (áudio)
  showSkip={timeLeft <= 0}
  t={t}
/>
```

## Variante numerais (`NumeralTypeExercise`)
Mesmo padrão visual e comportamental, com teclado numérico. Recebe `value`, `onChangeText`,
`onSubmit`, `answered`.

## Quando usar
Exercício de **produção**: o usuário precisa escrever o som/número, não só reconhecê-lo. Ver
[../exercises/kana-typing.md](../exercises/kana-typing.md) e
[../exercises/numerals.md](../exercises/numerals.md).
