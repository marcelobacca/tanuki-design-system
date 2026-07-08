# Exercícios de digitação (L2 Text Input)

Todos usam o [L2 Text Input](../layouts/L2-text-input.md): prompt no topo, campo único +
enviar, **até 3 tentativas** com feedback "quase!"/"errado". Testam produção (saber escrever),
não só reconhecimento.

Código: `src/utils/questions/q{5,6,11,16}.js`.

---

## Exercício 5 — kana → digitar romaji
- **Prompt:** um kana isolado. **Resposta:** digitar o **romaji** dele.
- **Gate:** digitação desbloqueia em `sessionsDone ≥ 3`.
- O mais simples da família — um caractere, sem palavra.

## Exercício 6 — palavra kana → digitar romaji
- **Prompt:** uma palavra em kana (≥ 3 moras). **Resposta:** digitar o **romaji** da palavra.
- **Preferência:** palavras que **já apareceram nesta sessão** (reforço do que foi exposto).
- **Gate:** `≥ 3` sessões **e** só da **metade da sessão para frente** (`pos ≥ 0.5`).

## Exercício 11 — palavra/combo → digitar romaji
- **Prompt:** palavra curta (easy) / palavra (normal), com tradução como sub-legenda; se não
  houver palavra, cai para um **combo** gerado (dois kana). **Resposta:** digitar o **romaji**.
- **Gate:** `sessionsDone ≥ 3`.

## Exercício 16 — ouvir → digitar romaji (áudio)
- **Prompt:** um **áudio** da palavra (texto escondido). **Resposta:** digitar o **romaji**.
- **Gate:** áudio habilitado + `sessionsDone ≥ 3`. Usa palavras de 2+ moras.
- **Skip:** este é o único L2 que mostra botão Pular (quando o timer zera), já que não dá para
  "quase acertar" um áudio que você não reconheceu.

---

## Regra de correção (comum a todos)
1. Normaliza: `input.trim().toLowerCase()` comparado com `answer.toLowerCase()`.
2. Errou e **Levenshtein ≤ 1** → **"quase!"** (amarelo). Senão → **"errado"** (vermelho).
3. **3ª tentativa errada** → revela a resposta e marca como errado.

### Como reproduzir um novo exercício de digitação
1. Defina prompt (kana? palavra? áudio?) e a `answer` em romaji.
2. Reutilize o **L2 Text Input** (numérico só para numerais).
3. Herde a correção de 3 tentativas + Levenshtein do [L0](../layouts/L0-session-shell.md).
4. Defina o gate. Digitação só faz sentido depois de o usuário já reconhecer bem (por isso o
   gate padrão de `≥ 3` sessões).
