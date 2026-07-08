# L3 · Build Blocks

Uma ou mais **linhas de resposta** acima de um **banco de peças**. O usuário monta a resposta
escolhendo peças do banco. Estilo "monte a frase" do Duolingo.

Código: `src/features/exercises/layouts/BuildWordLayout.js` (kana) ·
`src/components/numerals/NumeralBuildExercise.js` (numerais).

**Usado por:** kana 13, 17 · numeral *build*.

---

Existem **duas variantes** com a mesma ideia (linha de resposta + banco) mas mecânicas diferentes:

## Variante A — Slot-fill (kana: tipos 13, 17)

```
   [ あ ] [ め ] [ __ ]      ← N slots = comprimento da resposta
   ───────────────────
   ┌────┐ ┌────┐ ┌────┐ ┌────┐
   │ め │ │ か │ │ あ │ │ き │   ← banco (grade 4 colunas)
   └────┘ └────┘ └────┘ └────┘
```

- **N slots** = comprimento da resposta (número de kana).
- Toque num **tile do banco** → move para o **próximo slot vazio**.
- Toque num **slot preenchido** → devolve o tile ao banco.
- Ao completar todos os slots, o botão **"OK"** aparece na feedbackBar do [L0](./L0-session-shell.md)
  e valida. **Shake** nos slots ao errar.
- O banco tem os kana da resposta + **distratores** (kana extras que não entram).

**Props:**
```jsx
<BuildWordLayout
  question={q}               // { bank: [{id, k}], answer, slots }
  buildPicked={buildPicked}  // array de tiles escolhidos (null = slot vazio)
  setBuildPicked={fn}
  buildSlotsCount={n}        // = comprimento da resposta
  answered={answered}
  shakeAnim={shakeAnim}
  onSkip={() => advance(false)}
  showSkip={timeLeft <= 0}
  t={t}
/>
```

## Variante B — Free-flow drag (numerais: *build*)

```
   número grande (no L0):  384

   六   百              ← linha de resposta: peças fluem da esquerda,
   ─────────────────      quebram para uma 2ª linha só por espaço
   八   十   四   百      ← banco (peças corretas + ~3 decoys)
   ───────
```

- **Sem slots fixos.** O banco tem os blocos corretos + **~3 decoys** (peças erradas, ex.:
  decomposição ingênua de leituras irregulares como *roppyaku* → *roku* + *hyaku*).
- O usuário **arrasta** (ou toca) um bloco do banco para a **linha de resposta**, que **flui da
  esquerda para a direita** e só quebra para uma **2ª linha** por necessidade de espaço.
- Arrastar/tocar de volta devolve o bloco ao banco.
- Fica "pronto" (habilita o OK) quando **≥ 1** bloco está na resposta; valida a leitura kanji
  concatenada.
- Cada peça mostra **kanji em cima + romaji embaixo**. Peça no banco = borda neutra; peça
  colocada = borda destacada (`pri`).
- Drag-and-drop delegado à lib `@jamsch/react-native-duo-drag-drop` (não reimplementar à mão).

## Quando usar
Exercício **construtivo**: montar a palavra/número na ordem certa a partir de peças. A
variante A testa ortografia de kana; a B testa a leitura composicional de números. Ver
[../exercises/kana-build.md](../exercises/kana-build.md) e
[../exercises/numerals.md](../exercises/numerals.md).
