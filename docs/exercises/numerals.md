# Exercícios de numerais

Os numerais são um módulo paralelo ao de kana, com sua própria tela de sessão
(`src/screens/NumeralsSessionScreen.js`) mas **reutilizando os mesmos layouts**. São 3 tipos.

Código: `src/utils/numerals/questions.js` + `src/components/numerals/*`.

O prompt (no [L0](../layouts/L0-session-shell.md)) mostra o **número grande no topo**, com a
fonte encolhendo conforme os dígitos (40px até 3 dígitos → 28px para 6). O restante da tela é
o layout do exercício.

---

## build — montar a leitura em kanji  → [L3 Build Blocks](../layouts/L3-build-blocks.md) (free-flow)
- **Prompt:** o número em algarismos (ex.: **384**), grande no topo.
- **Resposta:** montar a **leitura em kanji** arrastando blocos.
- **Banco:** os blocos corretos (tokenização do kanji) + **~3 decoys** — peças erradas plausíveis,
  ex.: decomposição ingênua de leituras irregulares (*roppyaku* → *roku* + *hyaku*).
- **Linha de resposta:** as peças fluem da esquerda e quebram para uma **2ª linha** só por
  espaço; alinhadas à esquerda. Toca/arrasta de volta para devolver ao banco.
- Cada peça: **kanji em cima, romaji embaixo**.
- Fica pronto (habilita OK) com ≥ 1 peça colocada; valida a concatenação dos kanji.
- É o único que mostra **Pular** após 10s.

> Esta é a **variante free-drag** do L3 (lib `@jamsch/react-native-duo-drag-drop`), diferente
> do slot-fill dos exercícios de kana 13/17.

## select — escolher os dígitos  → [L1 Select Grid](../layouts/L1-select-grid.md)
- **Prompt:** o kanji + romaji (leitura) do número.
- **Resposta:** escolher os **algarismos** corretos entre 4 opções (grade 2×2).
- **Distratores:** `generateNumberDistractors` (números plausíveis próximos).
- A fonte das opções encolhe conforme os dígitos para nunca cortar.

## type — digitar os dígitos  → [L2 Text Input](../layouts/L2-text-input.md) (numérico)
- **Prompt:** o kanji + romaji do número.
- **Resposta:** **digitar** os algarismos (teclado numérico).
- Mesmo padrão de input + OK dos exercícios de digitar romaji.

---

### Como reproduzir / criar um draft novo de numerais
1. Comece pela questão: `mkBuildQuestion` / `mkSelectQuestion` / `mkTypeQuestion` em
   `utils/numerals/questions.js` produzem o objeto `{ qtype, value, digits, kanji, romaji, ... }`.
2. Reutilize o layout correspondente (build→L3 free-flow, select→L1, type→L2).
3. Prompt grande no topo é responsabilidade do L0 (número para *build*, kanji+romaji para
   *select*/*type*).
4. Para um exercício **no mesmo padrão do "montar número"**, use a variante free-flow do
   [L3 Build Blocks](../layouts/L3-build-blocks.md) com um banco de blocos corretos + decoys.
