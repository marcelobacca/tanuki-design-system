# L0 · Session Shell

O wrapper que envolve **todos** os exercícios. Define o que é constante entre telas: timer,
prompt, cartão de feedback, botão de avanço/skip, e o fluxo de uma sessão de ponta a ponta.

Código: `src/screens/SessionScreen.js` (kana) e `src/screens/NumeralsSessionScreen.js` (numerais).

---

## Zonas (de cima para baixo)

1. **Header / progresso** — barra de progresso da sessão + botão fechar.
2. **Timer** — contagem regressiva (ver abaixo).
3. **Zona de instrução** (`zoneInst`) — o enunciado traduzido (ex.: "Selecione o kana correto").
4. **Zona de prompt** (`zonePrompt`) — o estímulo grande (kana, palavra, número, ou romaji).
   Pode ter uma **sub-legenda** (`promptSub`) que às vezes só aparece **depois** de responder
   (`revealSub` — ex.: a tradução da palavra).
5. **Zona de resposta** (`zoneAnswers`) — **é aqui que o layout L1–L5 é renderizado**.
6. **feedbackBar** — a área de CTA na base: botão "OK" (montar), botão "Pular", "Não consigo
   ouvir agora" (áudio), ou o **cartão de feedback** depois de responder.

---

## Timer

- Começa em **10 segundos** e decrementa de 1 em 1s.
- Fica **vermelho** quando `≤ 3`.
- **Pisca** (blink) quando chega a `0`.
- **Escondido** no exercício de traçar (L5 / tipo 14) e **depois** que a pergunta é respondida.
- O timer **não reprova** a resposta — ele só libera o botão **Pular** quando chega a 0
  (o usuário nunca é forçado a errar por tempo).

---

## Botão Pular (skip)

Aparece **somente quando `timeLeft ≤ 0`** e a pergunta ainda não foi respondida. Onde ele
aparece depende do layout:

| Layout | Comportamento do skip |
|---|---|
| L1 Select Grid (não-áudio) | Botão "Pular" na feedbackBar quando o timer zera |
| L1/L2 áudio (15, 16) | Skip renderizado dentro do próprio layout (`showSkip={timeLeft<=0}`) |
| L2 Text Input (não-áudio) | **Sem skip** — usa o retry de 3 tentativas (ver abaixo) |
| L3 Build Blocks | Sem skip separado — tem o próprio CTA "OK"; skip aparece quando timer zera |
| L5 Tracing | **Sem timer e sem skip** — conclui por reconhecimento do traço |

Pular chama `advance(false)` → conta como resposta errada e vai para a próxima.

---

## Como a resposta é checada

| Tipo de resposta | Regra |
|---|---|
| **Seleção** (L1, L4) | Toque único. Certo → verde + haptic de sucesso; errado → vermelho + shake + haptic de erro. **Uma tentativa.** |
| **Digitação** (L2) | Compara `input.trim().toLowerCase()` com a resposta. Erro: se distância de edição (Levenshtein) `≤ 1` → feedback **"quase!"** (amarelo); senão **"errado"** (vermelho). **Até 3 tentativas** — na 3ª, revela a resposta. |
| **Montar** (L3) | Valida ao tocar "OK" com a resposta completa. Shake ao errar. |
| **Traçar** (L5) | Conclui via callback de reconhecimento do `TracingCanvasNative`. |

Depois de responder, o **cartão de feedback** sobe com animação de mola (spring) — mais
"saltitante" quando certo, mais suave quando errado.

---

## Avanço e fim da sessão

- `advance(wasOk)` → próxima pergunta, ou, se foi a última, chama `finishSession`.
- `finishSession` → `completeSession(...)` → navega para a tela **Results** (substituindo a
  tela de sessão na pilha).

### `completeSession` (o que roda no fim)
Arquivo: `src/features/exercises/completeSession.js`. É o **único** ponto que coordena os
efeitos colaterais de fim de sessão, para que a lógica de exercício nunca toque na de
gamificação diretamente. Em ordem:

1. **Progresso** — registra acertos/erros por kana (`progress.recordAnswers`) + incrementa contador de sessões.
2. **Sync remoto** de progresso (se logado).
3. **Streak** — registra sessão concluída.
4. **XP** — calcula XP da sessão (novos kana dominados, XP diário).
5. **Missões** — inicializa missões do dia se necessário + atualiza progresso das missões.
6. **Persiste** o estado de gamificação (local + remoto).
7. Deriva `wrongChars` (kana que erraram mais do que acertaram) para a tela de resultados.

Payload devolvido para **Results**: `{ correct, wrong, total, elapsed, wrongChars, xpGained,
xpFromMissions, masteredKana, gamState }`.

---

## Como uma sessão é montada (composição)

Arquivo: `src/utils/session.js` → `buildSession(...)`. Ela gera a lista de perguntas **antes**
da sessão começar. Conceitos-chave:

- **Tamanho** — `getDefaultSessionLength(sessionsDone)` (cresce conforme o usuário avança).
- **Fases** — cada pergunta cai numa fase pela posição relativa: `start` (< 40%), `mid`
  (40–75%), `end` (> 75%). Cada fase tem um **pool de tipos** diferente (aquecimento com
  básicos no início; combos, digitação e variedade no fim).
- **Dificuldade** — `easy` | `normal` | `hard`. Afeta pools, distratores, e tamanho das palavras.
- **Desbloqueios (gates)** — tipos só entram quando as condições existem:
  - Digitação (5, 6, 11, 16): `sessionsDone ≥ 3`.
  - Montar palavra (13): `sessionsDone ≥ 2` (easy: 3) + `≥ 3 famílias` selecionadas + `≥ 3` palavras montáveis.
  - Traçar (14): existe pelo menos 1 kana básico com dados de traçado.
  - Áudio (15, 16, 17): não mudo + som habilitado + `sessionsDone ≥ 2` + kana com áudio.
  - Ouvir palavra (15, 16): `≥ 4` palavras com áudio.
  - Impostor (12): `≥ 3 famílias` selecionadas.
  - Kana→tradução e tradução→kana (7, 8): `sessionsDone ≥ 3`, só na fase `end`, e só palavras
    já vistas `≥ 5` vezes.
- **Tipos garantidos** — pelo menos 1 de cada tipo especial disponível é injetado em posições
  espalhadas; o **traçar (14) é fixado na posição 0** (abre a sessão).
- **SRS / ponderação** — kana mais fracos aparecem mais (`buildWeightedChars`).
- **Anti-repetição** — evita repetir a mesma chave nas últimas 3 perguntas e reusar a mesma palavra.

> Detalhe de cada exercício (prompt, resposta, distratores, gates) em [../exercises/](../exercises/index.md).
