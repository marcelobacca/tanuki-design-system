# Exercícios de montar (L3 Build Blocks)

Usam o [L3 Build Blocks](../layouts/L3-build-blocks.md) variante **slot-fill**: N slots
(= comprimento da resposta) acima de um banco de kana. Testam a ortografia — montar a palavra
na ordem certa.

Código: `src/utils/questions/q{13,17}.js`.

---

## Exercício 13 — palavra (romaji) → montar em kana
- **Prompt:** o romaji da palavra + tradução como sub-legenda.
- **Resposta:** montar a palavra em **kana** preenchendo os slots.
- **Banco:** os kana da resposta + **distratores** (kana extras que não entram).
  - *easy:* palavras de até 2 moras, banco de 4 peças.
  - *normal/hard:* palavras de até 4 moras, banco de 8 peças.
- **Gate:** `sessionsDone ≥ 2` (easy: 3) + `≥ 3 famílias` selecionadas + `≥ 3` palavras
  montáveis (não-frase, dentro do limite de moras).

## Exercício 17 — ouvir → montar em kana (áudio)
- **Prompt:** um **áudio** da palavra (o kana fica escondido até responder).
- **Resposta:** montar a palavra em **kana** de ouvido.
- **Banco:** igual ao 13 (resposta + distratores; precisa de ≥ 2 distratores).
- **Gate:** áudio habilitado + condições de montar; só palavras que têm arquivo de áudio.

---

## Comportamento (comum)
- Toque num tile → próximo slot vazio; toque num slot preenchido → devolve ao banco.
- Completou os slots → botão **"OK"** na feedbackBar valida. **Shake** ao errar.
- Skip aparece abaixo do banco quando o timer zera.

### Como reproduzir um novo exercício de montar
1. Defina a `answer` (sequência de kana) e o comprimento → nº de slots.
2. Monte o `bank`: os kana da resposta + distratores embaralhados (`{ id, k }`).
3. Reutilize o **L3 Build Blocks** (slot-fill). Para uma mecânica de arrasto livre com decoys
   conceituais, ver a **variante free-flow** dos numerais em [numerals](./numerals.md).
4. Defina o gate (montar exige um pouco de repertório — daí `≥ 3 famílias`).
