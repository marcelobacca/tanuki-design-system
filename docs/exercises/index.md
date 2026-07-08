# Exercícios — tabela mestra

Cada exercício **usa um layout** ([../layouts/](../layouts/index.md)) e define a direção
(o que é prompt → o que é resposta), a geração de opções/distratores, e quando aparece na
sessão (gate). O layout diz *como a tela se parece*; o exercício diz *o que ela pergunta*.

> Os números (1, 2, 5…) são os `type` reais no código (`src/utils/session.js` despacha para
> `src/utils/questions/qN.js`). Não há tipos 3 e 4 (removidos historicamente).

## Kana

| # | Layout | Direção (prompt → resposta) | Distratores | Gate (quando aparece) | Detalhe |
|---|---|---|---|---|---|
| 1 | L1 Select Grid | kana/palavra → **romaji** | mesmo nº de moras | sempre (aquece no início) | [recognition](./kana-recognition.md) |
| 2 | L1 Select Grid | romaji/som → **kana** | mesmo tipo (yōon/básico) ou nº de moras | sempre | [recognition](./kana-recognition.md) |
| 5 | L2 Text Input | kana → **digitar romaji** | — | `sessionsDone ≥ 3` | [typing](./kana-typing.md) |
| 6 | L2 Text Input | palavra kana → **digitar romaji** | — | `≥ 3` sessões, 2ª metade da sessão | [typing](./kana-typing.md) |
| 7 | L1 Select Grid | palavra kana → **tradução** | mesmo nº de moras | `≥ 3` sessões, fase *end*, palavra vista `≥ 5×` | [recognition](./kana-recognition.md) |
| 8 | L1 Select Grid | tradução → **palavra kana** | mesmo bucket de tamanho | `≥ 3` sessões, fase *end*, palavra vista `≥ 5×` | [recognition](./kana-recognition.md) |
| 9 | L1 Select Grid | combo/palavra → **romaji** | outros combos/palavras | combos disponíveis | [recognition](./kana-recognition.md) |
| 10 | L1 Select Grid | combo/palavra → **kana** | mesmo bucket | combos disponíveis | [recognition](./kana-recognition.md) |
| 11 | L2 Text Input | palavra/combo → **digitar romaji** | — | `sessionsDone ≥ 3` | [typing](./kana-typing.md) |
| 12 | L4 Impostor Grid | 4 kana → **tocar o intruso** | 3 da mesma família + 1 de outra | `≥ 3 famílias` selecionadas | [impostor](./kana-impostor.md) |
| 13 | L3 Build Blocks | palavra (romaji) → **montar em kana** | kana extras no banco | `≥ 2` sessões + `≥ 3 famílias` + `≥ 3` palavras | [build](./kana-build.md) |
| 14 | L5 Tracing Canvas | romaji → **traçar o kana** | — | kana com dados de traçado; abre a sessão | [tracing](./kana-tracing.md) |
| 15 | L1 Select Grid (+áudio) | **ouvir** → selecionar a palavra | mesmo nº de moras | áudio on + `≥ 2` sessões + `≥ 4` palavras com áudio | [recognition](./kana-recognition.md) |
| 16 | L2 Text Input (+áudio) | **ouvir** → digitar romaji | — | áudio on + `≥ 3` sessões | [typing](./kana-typing.md) |
| 17 | L3 Build Blocks (+áudio) | **ouvir** → montar em kana | kana extras no banco | áudio on + condições de montar | [build](./kana-build.md) |

## Numerais

| Exercício | Layout | Direção | Detalhe |
|---|---|---|---|
| **build** | L3 Build Blocks (free-drag) | dígitos (ex: 384) → **montar a leitura em kanji** | [numerals](./numerals.md) |
| **select** | L1 Select Grid | kanji + romaji → **escolher os dígitos** | [numerals](./numerals.md) |
| **type** | L2 Text Input (numérico) | kanji + romaji → **digitar os dígitos** | [numerals](./numerals.md) |

## Convenções compartilhadas

- **Objeto de questão** (kana): `{ type, inst, prompt, promptSub, revealSub, answer, opts,
  optKana, input, word, ck, cr, ... }`. `inst` é uma **chave de tradução** (i18n), nunca texto fixo.
- **`ck`/`cr`** = kana/romaji canônicos da questão (usados para pontuação por kana).
- **Timer, skip, feedback, avanço, fim de sessão** → tudo no [L0 Session Shell](../layouts/L0-session-shell.md).
- **Regra de ouro de distratores:** opções nunca devem ser "entregáveis" por tamanho — palavras
  distratoras têm o **mesmo número de moras** da resposta (ou o mesmo *bucket* de tamanho). Se
  não houver distratores suficientes do tamanho certo, a questão **não é gerada** (nunca se
  relaxa o tamanho só para preencher).
