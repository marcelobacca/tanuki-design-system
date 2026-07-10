# Estratégia — Módulos de Vocabulário + Gramática

> **Status: aprovado (2026-07-08).** Source of truth da estratégia e do backlog de execução.
> Decidido em sessão de brainstorm no repo `tanuki-native`. Executar em fases, 1 ticket por vez,
> com modelos mais simples — cada ticket abaixo é autocontido (arquivos + critérios de aceite).

---

## 1. North star

| | **Vocabulário** | **Gramática** |
|---|---|---|
| Metáfora | Biblioteca crescente | Trilha guiada |
| Unidade | Palavra solta | Padrão de frase (estrutura) |
| Navegação | Multiselect de unidades (como os kana) | Ordem recomendada com status (não travada) |
| Progresso | SRS por palavra | Status por lição + SRS por padrão |
| Objetivo | Reconhecer e produzir palavras | Montar frases combinando estrutura + vocab |

**Regra de ouro da arquitetura:** os dois módulos compartilham **um banco de palavras e um
motor de SRS**. Gramática **consome** o vocabulário via *slots tipados* — templates de frase
(`ここは {SLOT_place} です`) preenchidos por queries no banco (tag/POS/lições já vistas).
Toda palavra nova entra automaticamente nas frases compatíveis.

**Navegação:** home nova é lista vertical — hiragana, katakana, numerais (ativos);
kanji, **vocabulário**, **gramática** (pendências). Cada módulo é irmão de primeiro nível,
no padrão estrutural do módulo de Numerais (dados próprios, session builder próprio,
tela própria, exercícios próprios).

## 2. Decisões fechadas

1. **Escopo:** estratégia dos dois módulos junta (este doc); execução fatiada — Vocabulário primeiro.
2. **Progressão vocab (revisada 2026-07-08 v2):** **multiselect de unidades** (padrão da
   seleção de famílias kana) controla a entrada de palavras novas; sessões mistas com
   ritmo adaptativo de 3–5 novas; **revisão global via SRS ignora a seleção**. Sem lições
   dentro da unidade — a sensação de trilha fica na **Trilha N5** (camada transversal
   futura que engloba kana + numerais + vocabulário + gramática; mesmo mecanismo do
   backoffice do professor). Ver seções 6.1–6.7.
3. **Dados:** híbrido — schema novo (`VocabWord`) com seed importado do banco atual
   (`src/data/words/*`), reaproveitando áudios e tokens. Codex grava áudios faltantes depois.
4. **Integração vocab↔gramática:** slots tipados consultando o banco (com fallback para
   frases autorais por id quando um ponto exigir controle fino).
5. **Romaji:** toggle persistente, acessível durante a sessão. Suprimido quando entrega a
   resposta (digitar romaji; prompt de montar kana).
6. **Scripts (default, revisar após beta):** *reconhecimento* pode mostrar palavra de script
   não aprendido com romaji de apoio forçado; *produção* exige `scriptsRequired` ⊆ scripts
   destravados. Kanji (futuro) sempre com furigana.
7. **Trilha de gramática:** ordem recomendada com status por lição (concluída / em andamento /
   pendente) — navegável livre, sem trava dura.
8. **Domínio:** SRS por item (palavra/padrão), estágios reconhecimento→recall. Sem barra 0–100.
9. **Match Pairs é oficial no MVP** → vira layout **L6 Match Pairs**. Sentence Frame (gramática)
   passa a ser **L7**, experimental até polir.
10. **XP/missões:** vocab e gramática entram no MESMO sistema de gamificação/missões do kana
    (exige generalizar a orquestração de fim de sessão).
11. **Primeiro curso de gramática:** demonstrativos — koko/soko/asoko + kore/sore/are.
12. **Separação vocab puro × palavra gramatical:** koko/kore/partículas moram no banco
    (`isGrammaticalWord: true`) para a Gramática usar, mas são **excluídos** de exercícios de
    palavra isolada.

### 2.1 Regras de isolamento e reversibilidade — OBRIGATÓRIAS em todo ticket

> Decisão do Marcelo (2026-07-08): o app atual é preservado; qualquer coisa nova precisa
> ser trivialmente revertível. Vale para vocabulário, gramática E kanji.

1. **Código novo = arquivos/pastas novos.** Nunca editar lógica existente de kana/numerais;
   pontos de contato permitidos (whitelist): `src/navigation/index.js` (adicionar rotas),
   home (adicionar itens atrás de flag), wrapper novo em volta de `completeSession`
   (nunca edição — kana byte-idêntico é critério de aceite).
2. **Feature flags:** `src/config/flags.js` → `FLAGS = { vocab, kanji, grammar }`. Entradas
   na home só renderizam com flag ligada. Default: ligado em `__DEV__`/preview build,
   **desligado em produção**. Lançar = virar a flag; reverter = 1 linha.
3. **Dados locais em chaves novas** (`tnk_srs`, seleção de unidades…). NUNCA migrar ou
   renomear chaves existentes (`tnk_gam`, progresso kana). Escritas em dados existentes
   são só aditivas (ex.: somar XP). Reverter nunca corrompe progresso.
4. **Git:** branch por módulo, main sempre buildável, merge só após validação — rollback
   = revert de um merge limpo.
5. **UI arriscada nasce em preview screen** (precedente: `TracingNativePreviewScreen`)
   antes de entrar na sessão real.
6. **Validação com usuários** via EAS preview build (flags ligadas), sem tocar a produção.

## 3. Modelo de dados

### 3.1 `VocabWord` — `src/data/vocabulary/`

```js
{
  id: "vw_neko",                   // estável, prefixo vw_
  lemma: "ねこ",                   // forma canônica de exibição
  reading: "ねこ",                 // leitura em kana (base p/ furigana futuro)
  romaji: "neko",
  scriptsRequired: ["hiragana"],   // derivado da leitura
  tokens: ["ne","ko"],             // p/ montar-kana e distratores por mora
  translations: { pt:"gato", en:"cat", es:"gato" },
  pos: "noun",                     // noun | verb | adj-i | adj-na | adverb | ...
  category: "animal",              // uma das 22 de src/data/categories.js
  tags: ["animal","concrete"],     // o que os slots de gramática consultam
  lessons: [],                     // 0..N ids de Lesson (vazio no modo livre)
  level: 1,
  audioId: "neko",                 // reaproveita áudio atual; null até Codex gravar
  isGrammaticalWord: false,        // true = koko/sore/partículas → fora de exercícios isolados
  status: "active"
}
```

### 3.2 `GrammarPattern`

```js
{
  id: "gp_koko_wa_x_desu",
  lesson: "grammar_demonstratives_1",
  title: { pt: "...", en: "...", es: "..." },
  explanation: { pt: "...", en: "...", es: "..." },   // nota curta pré-prática
  template: "ここは {SLOT_place} です。",
  slots: {
    SLOT_place: { query: { tags: ["place"], lessonsLearned: true }, min: 3 }
  },
  fixedExamples: [],               // opcional: frases autorais citando vw_ ids
  particleExercise: null,          // opcional: { answer: "は", distractors: ["を","に","で"] }
  requiresVocab: ["vw_koko"],
  requiresGrammar: [],
  level: 1
}
```

> **Implementado (TAN-15 + TAN-29, 2026-07-09):** `src/utils/grammar/slots.js` +
> `src/utils/vocab/distractors.js` (funções puras, banco/SRS por parâmetro).
> Resolução: slot com < `min` candidatos → fallback `fixedExamples` → senão o
> padrão **não entra na sessão** (nunca frase quebrada); `lessonsLearned` = SRS
> stage ≥ 1; palavra gramatical nunca preenche slot (decisão 12).
> **Partículas são curadas no dado** (`particleExercise`), nunca geradas por
> algoritmo — が vs は prova que não há regra segura ("ここはがっこうです" e
> "ここががっこうです" são ambas válidas): o autor do padrão garante que cada
> distrator é errado de verdade naquela frase; o resolvedor apenas valida
> (answer ∉ distractors, ≥ 2 distratores únicos). Anti-ambiguidade de
> distratores (edges #1/#2/#12): sentidos normalizados (sem acento/artigo,
> multi-sentido) comparados sempre nas 3 línguas + homófonos (kana OU romaji
> igual) nunca se distraem + mora exato nunca relaxa; sem candidatos → a
> questão não é gerada (chamador troca o tipo). `SYNONYM_GROUPS` (lista manual
> exportada) cobre equivalências que a normalização não pega.

### 3.3 `Lesson` / `Course`

```js
{
  id: "n5_step_03",
  course: "course_n5",             // Course: { source: "curated" | "teacher" }
  title: { pt: "...", en: "...", es: "..." },
  items: [                         // lições podem MISTURAR módulos (Trilha N5, turmas)
    { kind: "kana",     refs: ["hiragana_basic"] },
    { kind: "numerals", refs: { maxDigits: 3 } },
    { kind: "vocab",    refs: ["vw_ichi", "vw_hyaku"] },
    { kind: "grammar",  refs: ["gp_kore_wa_x_desu"] },
  ],
  order: 3,
  prereqs: []
}
```

No MVP de vocabulário **não há Lessons** — o multiselect de unidades cobre tudo. Lessons
entram com a **Trilha N5** (seção 6.7) e o backoffice do professor; o formato misto de
`items` acima já suporta os dois sem refactor.

### 3.4 `SRSState` — motor compartilhado `src/features/srs/`

> **Implementado (TAN-8, 2026-07-09).** Schema abaixo é o real do app; API documentada
> no header de `src/features/srs/index.js`. Sem `ease`/`interval` (Leitner simplificado:
> intervalos fixos por stage, deriváveis de `stage`); itemType `pattern` virou `grammar`
> e ganhou `kanji`/`kanjiWord` (kanji.md §4).

```js
// AsyncStorage tnk_srs (chave nova — regra §2.1 #3):
// { v: 1, updatedAt: epochMs, items: { [itemId]: SRSState } }
{
  t: "word" | "grammar" | "kanji" | "kanjiWord",
  stage: 0,        // 0 novo · 1 reconhece · 2 produz · 3 domina · 4 consolidado
  maxStage: 0,     // maior stage já atingido — NUNCA decresce (anti double-count de XP)
  recog: 0,        // acertos de reconhecimento acumulados rumo ao stage 1 (precisa 2)
  dueAt: 0,        // epoch ms UTC (0 = due agora) — nunca date local (edge #16)
  lastAt: 0,       // epoch ms da última resposta
  seen: 0, lapses: 0,
  last: null       // 1 acerto · 0 erro · null nunca respondeu
}
```

- **Intervalos Leitner** (tabela inicial, calibrar depois — §10): stage 0 → due já ·
  1 → 1 dia · 2 → 3 dias · 3 → 7 dias · 4 → 21 dias (fixo a cada revisão).
- **Stage 3→4** exige produção + due (simétrico ao 2→3): "consolidado" atestado por recall.
- **Erro**: cai 1 stage (piso 0), zera `recog`, `dueAt = now` (fila prioritária).
- **Merge convidado→login** (edge #15): item a item — maior `stage` vence, `dueAt` mais
  próximo vence, contadores = max. Remoto: doc único `srsStates/{uid}` (formato `gamStates`).
- **Escrita transacional** no fim da sessão (edge #14): `applySession` é o único ponto de
  escrita e retorna events (`stageBefore/After`, `maxStageBefore/After`, `wasDue`,
  `xpWeight`) — bônus de domínio (★/missões) só pagam quando `maxStage` sobe.

Estágios definem exercícios elegíveis: reconhecimento (select/match/ouvir) nos baixos,
recall (digitar/montar) nos altos. Um item novo só entra em recall após ser reconhecido.

## 4. Exercícios oficiais de Vocabulário (MVP)

| Exercício | Direção | Layout | Estágio |
|---|---|---|---|
| Selecionar tradução | kana → tradução | L1 Select Grid | reconhecimento |
| Selecionar japonês | tradução → kana | L1 Select Grid | reconhecimento |
| Match Pairs | parear kana ↔ tradução (4–5 pares) | **L6 Match Pairs** (novo) | reconhecimento |
| Ouvir e selecionar | áudio → palavra/tradução | L1 (+áudio) | reconhecimento |
| Digitar romaji | palavra/tradução → romaji | L2 Text Input | recall |
| Montar kana | tradução → montar em kana | L3 Build Blocks (**slots fixos**) | recall |

Regras:
- Digitar romaji: até 3 tentativas; "quase" se Levenshtein ≤ 1.
- Montar kana: slots fixos (comprimento conhecido, feedback por posição). Free-drag fica nos numerais.
- Distratores: regra de ouro do kana — mesmo nº de moras / mesmo bucket; sem distrator do
  tamanho certo, a questão não é gerada.
- Sessão: 3–5 palavras novas (adaptativo, seção 6.2) + revisão (prioriza `dueAt` vencido e
  erro recente) · cada palavra reaparece em formatos diferentes na mesma sessão.

## 5. Exercícios de Gramática (fase 2)

| Exercício | O que faz | Layout |
|---|---|---|
| Selecionar partícula/palavra | escolhe o que preenche o slot | L1 Select Grid |
| Montar frase | ordena blocos na frase | **L7 Sentence Frame** (novo, experimental) |
| Cloze | frase com lacuna, escolhe/monta o miolo | L7 |
| Digitar | escreve a palavra/frase alvo | L2 Text Input |

Lição = nota curta (explanation) → prática → conclusão por domínio (gate suave, sem trava).

---

## 6. Sistema de progressão (multiselect + SRS + Trilha N5 futura)

### 6.1 Modelo: multiselect + revisão global (revisado 2026-07-08)

```
Vocabulário (prática livre — espelha a seleção de famílias dos kana)
├── Multiselect de unidades (Animais ⬤ · Cores ⬤ · Comida ○ …)   ← persistente
│     └── controla APENAS a entrada de palavras NOVAS
├── Praticar → sessão mista (novas das unidades marcadas + revisão)
└── Revisar (global) → só palavras vencidas no SRS — IGNORA a seleção

Trilha N5/N4… (camada transversal FUTURA — ver 6.7)
└── Course curado que sequencia kana + numerais + vocabulário + gramática
```

> A ideia anterior de lições sequenciais dentro da unidade foi descartada — a sensação
> de "curso" fica na Trilha N5, não na prática livre.

### 6.2 Anatomia de uma sessão de prática (~3–5 min)

1. **Apresentação** — cards SÓ das palavras novas da sessão (kana grande + áudio +
   tradução; romaji conforme toggle). Sem pontuação.
2. **Questões mistas** — composição dirigida pelo stage de cada palavra (`stageAllows`):
   novas → reconhecimento (select · match pairs · ouvir); já reconhecidas → produção
   (digitar · montar); palavras due do pool → revisão embutida.

**Ritmo de novas: 3–5 adaptativo** — fila de revisão grande (≥ 8 due) → 3 novas; fila
vazia → 5. Distribuição **round-robin entre as unidades marcadas**, priorizando as menos
avançadas. Sem checkpoint de lição — o gate é o próprio SRS.

### 6.3 Progresso por unidade

- Unidade mostra **contador `dominadas/total`** (dominada = stage ≥ 3) e ganha **★**
  quando todas as palavras estão dominadas. Sem checkpoints, sem desbloqueio.
- **Domínio decai**: palavras com `dueAt` muito vencido deixam a ★ "apagada" (contorno) —
  sinal de "precisa revisar" (análogo à rachadura do Duolingo).
- Banco cresce (Codex adiciona palavras) → contador/★ recalculam honestamente
  (unidade ★ pode voltar a 12/17).
- Unidade com maioria de palavras de script não destravado → badge "requer katakana"
  (nunca some nem gera sessão vazia).

### 6.4 "Aprendeu ou não?" — critério objetivo via SRS

| Stage | Nome | Como sobe |
|---|---|---|
| 0 | novo | viu na apresentação |
| 1 | reconhece | 2 acertos em reconhecimento |
| 2 | produz | 1 acerto em produção |
| 3 | domina | acerto em produção **com `dueAt` vencido** (retenção espaçada real) |
| 4 | consolidado | 2ª revisão espaçada correta |

- Erro → cai 1 stage + entra na fila prioritária de revisão.
- **Aprendida** = stage ≥ 2 · **Dominada** = stage ≥ 3. São esses números que alimentam
  contadores de unidade ("12/20 dominadas") e o dashboard do professor no futuro.

### 6.5 XP (mesmo gamState/missões do kana)

| Evento | XP |
|---|---|
| Resposta correta 1ª tentativa | +2 |
| "Quase" / 2ª tentativa | +1 |
| Sessão de prática concluída | +10 |
| Unidade dominada ★ (1ª vez) | +20 |
| Revisão global completada | +15 |
| Resposta de palavra já dominada fora de revisão due | XP × 0.25 (anti-farming) |

Missões novas: "complete 1 sessão de vocabulário", "revise N palavras", "domine N palavras novas".

### 6.6 Revisão global

- **Revisar**: só palavras com `dueAt` vencido + lapsos. Banner/CTA na home do módulo
  quando ≥ 5 palavras due. É onde stage 3/4 acontece — a prática ensina, a revisão fixa.
- **Ignora o multiselect** (decisão validada): a seleção controla só a entrada de NOVAS;
  tudo que já entrou no SRS volta na revisão, mesmo com a unidade desmarcada — senão o
  domínio decai invisível.

### 6.7 Trilha N5 — camada transversal (futura)

- Um `Course { source: "curated" }` cujas lições **misturam módulos**: passo 1 hiragana
  básico (kana) → passo 2 saudações (vocab fixo) → passo 3 números 1–100 (numerais) →
  passo 4 これ/それ/あれ + objetos (gramática + vocab) → …
- Cada passo referencia conteúdo dos módulos — mesma sessão, mesmo SRS, mesmo XP.
- **Auto-completa pelo SRS** (decisão validada): a trilha é uma LEITURA do estado — se o
  usuário já domina os itens do passo pela prática livre, o passo marca completo; nada
  conta duas vezes.
- **A turma do professor usa o MESMO mecanismo** (`source: "teacher"`) — a Trilha N5 é o
  primeiro Course curado e valida o motor do backoffice. Planejar em detalhe antes do fim
  da Fase 2 (ticket próprio no Linear).

---

## 7. Edge cases a prevenir (checklist de QA por ticket)

**Dados/conteúdo**
1. **Homófonos** (はし ponte/pauzinhos): nunca distratores entre si; em select-japonês,
   garantir que só UMA opção corresponde à tradução do prompt.
2. **Sinônimos de tradução** (duas palavras → "caminho"): distrator não pode ter tradução
   igual/equivalente à resposta — comparar normalizado nas 3 línguas.
3. **Categoria com < 4 palavras elegíveis**: unidade não ativa (mínimo de pool p/ select).
4. **Distratores insuficientes no bucket de moras**: buscar no banco global antes de
   descartar a questão; se ainda faltar, trocar o tipo de exercício (nunca relaxar tamanho).
5. **Palavra sem áudio**: exercícios de áudio não entram; lição nunca *depende* de áudio.
6. **Palavra aposentada** (`status: "retired"`): SRSState órfão não quebra sessão; lição
   concluída permanece concluída.
7. **Tokens repetidos** (ここ, ちち): banco de peças com duplicatas; validação por posição.
8. **ー e っ como peças** no montar kana (precedente nos words de katakana/sokuon).
9. **Banco cresce depois** (Codex adiciona palavras): contador e ★ da unidade recalculam
   honestamente (★ pode "descompletar"); palavras novas entram no fluxo normal de novas.

**Input/exercício**
10. **Variantes de romaji**: shi/si, chi/ti, tsu/tu, fu/hu, ji/zi, ou/ō/oo, nn/n —
    normalizar ANTES de comparar; Levenshtein só depois da normalização.
11. **"Quase" em palavra curta** (ao/ai): Levenshtein ≤ 1 só vale com input ≥ 4 chars;
    abaixo disso, exige exato.
12. **Match pairs com pares ambíguos** (mesma tradução): validar no gerador de pares.
13. **Áudio sobreposto** em taps rápidos: debounce/stop do som anterior.

**Progresso/estado**
14. **Sessão interrompida** (app morto): SRS/XP só persistem no fim da sessão
    (transacional); perder respostas da sessão corrente é aceitável no MVP.
15. **Guest → login**: merge SRS local × remoto — maior stage vence; `dueAt` mais próximo vence.
16. **Relógio/timezone do device**: `dueAt` em epoch UTC; nunca date local no SRS.
17. **Troca de idioma do app**: progresso é por `wordId` — nada quebra; traduções re-resolvem.
18. **Unidade cheia de katakana p/ usuário só-hiragana** (ex.: Países): elegibilidade
    avaliada no nível da UNIDADE — badge "requer katakana" no multiselect, nunca
    sessão vazia ou quebrada.
19. **XP farming**: respostas de palavras já dominadas fora de revisão due valem × 0.25
    (seção 6.5).

---

## 8. Backoffice do professor — porta aberta, produto NÃO definido

> **Atualização 2026-07-10:** a estratégia B2B (escolas/professores) agora tem doc
> próprio com fases e plano de validação — ver [b2b.md](./b2b.md). Os compromissos de
> arquitetura abaixo continuam valendo e são a fundação daquele doc.

> **Status: hipótese, precisa de muita validação (com professores reais) antes de
> qualquer desenho de produto.** Nada aqui gera ticket. O fluxo de interação
> (turmas, liberação, dashboard etc.) fica deliberadamente em aberto.

O único compromisso da arquitetura atual é **deixar o encaixe pronto**:

- `Course`/`Lesson` com `source: "curated" | "teacher"` (seção 3.3) — conteúdo autorado
  externamente entra pelo mesmo formato de lição mista, sem refactor.
- O SRS por item (seção 6.4) é a fonte de qualquer métrica de progresso que um
  backoffice venha a mostrar — nenhuma métrica nova precisa ser inventada.
- A Trilha N5 (seção 6.7) usa esse mesmo formato de `Course`, então implementar a trilha
  já valida tecnicamente o motor de "cursos externos".

Como o professor interage (se cria lições, se só libera prontas, se tem dashboard, se
existe turma/código) → **decidir depois, com validação de usuário.**

---

## 9. BACKLOG DE EXECUÇÃO

> **Tracker oficial: Linear** — projeto *Tanuki Vocabulário* (team TAN). Os tickets abaixo
> foram espelhados lá com critérios de aceite; executar 1 por sessão com modelos mais
> simples. Este doc permanece a fonte da ESTRATÉGIA; o Linear é a fonte do STATUS.

### FASE 0 — Fundação

- [ ] **T0.1 — Doc do modelo de dados no DS**
  Criar `~/tanuki-design-system/docs/data-model.md` com os 4 schemas da seção 3 deste doc
  (VocabWord, GrammarPattern, Lesson, SRSState) + regras (isGrammaticalWord, scriptsRequired,
  estágios SRS). Linkar de `GUIDE.md` e `docs/index.md`.
  *Aceite:* doc publicado, índices atualizados.

- [ ] **T0.2 — Motor SRS compartilhado**
  Criar `src/features/srs/` no app: funções puras `nextState(state, result)`,
  `isDue(state, now)`, `stageAllows(stage, exerciseKind)` + persistência AsyncStorage
  (chave própria, ex. `tnk_srs`). Leitner simplificado (intervalos fixos por stage).
  Sem UI. Testes unitários das funções puras.
  *Aceite:* testes passando; API pública documentada no header do index.js.

- [ ] **T0.3 — Seed do banco de vocabulário**
  Script/importador que gera `src/data/vocabulary/words.js` a partir de
  `src/data/words/*.js`: mapeia p/ schema VocabWord, deriva `scriptsRequired` da leitura,
  preserva `tokens`/`audioId`/`translations`/`category`, marca `isGrammaticalWord` (lista
  manual inicial: koko/soko/asoko/kore/sore/are/partículas, se presentes). `pos` e `tags`
  iniciais podem ser heurísticos (category→tag) + revisão manual.
  *Aceite:* `src/data/vocabulary/words.js` gerado, sem duplicar ids, app não quebra
  (banco antigo intocado — kana continua usando `src/data/words/*`).

- [ ] **T0.4 — Tags e POS curados**
  Passada manual no seed: `pos` correto por palavra, tags mínimas p/ gramática
  (`place`, `object`, `person`, `animal`, `color`, `food`…).
  *Aceite:* toda palavra ativa tem `pos` e ≥1 tag.

### FASE 1 — Vocabulário MVP

- [ ] **T1.1 — Session builder de vocabulário**
  `src/utils/vocab/session.js` → `buildVocabSession(categoryId, opts)`: microgrupo de 3–6
  palavras (novas por SRS stage 0 + revisão por `dueAt`/erros), mix de tipos de exercício
  respeitando `stageAllows`, anti-repeat (padrão do `utils/numerals/session.js`).
  *Aceite:* função pura testável; nunca gera recall p/ palavra stage 0.

- [ ] **T1.2 — Distratores de vocabulário**
  `src/utils/vocab/distractors.js`: mesmo nº de moras / mesmo bucket; sem distrator
  suficiente → questão não é gerada (nunca relaxar tamanho).
  *Aceite:* testes cobrindo bucket sem distratores.

- [ ] **T1.3 — Questões select (tradução / japonês)**
  `src/utils/vocab/questions.js`: `mkSelectTranslation(word)`, `mkSelectJapanese(word)`
  usando L1 `MultipleChoiceGridLayout`. `inst` = chave i18n.
  *Aceite:* renderiza no L1 existente sem mudanças no layout.

- [ ] **T1.4 — Questão digitar romaji**
  `mkTypeRomaji(word)` usando L2 `TextInputLayout`. Até 3 tentativas; "quase"
  (feedback amarelo) se Levenshtein ≤ 1. Romaji suprimido no prompt.
  *Aceite:* Levenshtein testado; 3ª falha revela resposta.

- [ ] **T1.5 — Questão montar kana (slots fixos)**
  `mkBuildKana(word)` usando L3 `BuildWordLayout` com slots fixos (1 por token).
  Distratores de kana extras no banco de peças.
  *Aceite:* palavras de 2–5 moras funcionam; romaji suprimido no prompt.

- [ ] **T1.6 — Layout L6 Match Pairs**
  Novo `src/features/exercises/layouts/MatchPairsLayout.js`: grade com 4–5 pares
  (kana ↔ tradução), estados selecionado/casado/erro (shake+reset), conclusão quando
  todos casam. Tokens do tema, sem valores literais. Pontuação: erro em par conta como
  erro da palavra no SRS.
  Doc: `docs/layouts/L6-match-pairs.md` + linha em `docs/layouts/index.md`.
  *Aceite:* estados completos, doc publicado.

- [ ] **T1.7 — Questão ouvir e selecionar**
  `mkListenSelect(word)`: prompt = áudio (L1 + botão replay), opções = palavras/traduções.
  Gate: só palavras com `audioId` e ≥4 candidatas com áudio no pool.
  *Aceite:* sem áudio suficiente → tipo não aparece na sessão.

- [ ] **T1.8 — Telas e navegação**
  `VocabHomeScreen` (grade de categorias com contagem dominadas/total) +
  `VocabSessionScreen` (L0 shell, espelho de `NumeralsSessionScreen`) + item
  "Vocabulário" na home nova + rotas em `src/navigation/index.js`.
  Doc: atualizar mapa código→doc em `MAINTENANCE.md`.
  *Aceite:* fluxo home → categoria → sessão → resultados completo.

- [ ] **T1.9 — Toggle romaji persistente**
  Switch acessível na sessão (e em Settings), persistido (AsyncStorage). Aplica em
  reconhecimento; **sempre suprimido** onde entrega resposta (T1.4 prompt, T1.5 prompt).
  *Aceite:* estado sobrevive a restart; supressão verificada nos 2 exercícios de produção.

- [ ] **T1.10 — Elegibilidade por script**
  Filtro no session builder: produção exige `scriptsRequired` ⊆ scripts destravados
  (progresso de kana); reconhecimento permite script não aprendido com romaji forçado.
  *Aceite:* usuário só-hiragana nunca recebe "montar" de palavra katakana.

- [ ] **T1.11 — Fim de sessão unificado (XP/missões)**
  Generalizar orquestração: `completeSession` (ou wrapper novo `completeVocabSession`)
  registra respostas por `itemId` no SRS, soma XP no mesmo `gamState`, atualiza missões.
  Não tocar no scoring por-kana existente.
  *Aceite:* sessão de vocab gera XP + conta em missões; sessão de kana inalterada.

- [ ] **T1.12 — i18n**
  Todas as strings novas (instruções, telas, toggle, feedback "quase") em PT/EN/ES em
  `src/i18n/strings.js`, via `useT()`.
  *Aceite:* zero texto hardcoded nas telas novas.

- [ ] **T1.13 — Docs DS dos exercícios de vocab**
  `docs/exercises/vocab-select.md`, `vocab-match.md`, `vocab-typing.md`, `vocab-build.md`,
  `vocab-listening.md` (padrão dos docs de kana: layout, direção, distratores, gate) +
  tabela nova em `docs/exercises/index.md`.
  *Aceite:* índices atualizados, deploy ok.

### FASE 2 — Gramática

- [ ] **T2.1 — Resolvedor de slots**
  `src/utils/grammar/slots.js`: `resolveSlot(slotDef, srsState, vocabBank)` → candidatos
  que casam query (tags/pos) e já foram vistos (`lessonsLearned`). Fallback: `fixedExamples`.
  *Aceite:* testes com banco mock; slot sem candidatos → padrão não entra na sessão.

- [ ] **T2.2 — Dados do curso 1 (demonstrativos)**
  `src/data/grammar/patterns.js`: koko/soko/asoko + kore/sore/are (`ここは {place} です`,
  `これは {object} です`…), explanations PT/EN/ES, `requiresVocab`.
  *Aceite:* ≥4 padrões, slots resolvem contra o seed real.

- [ ] **T2.3 — Layout L7 Sentence Frame (experimental)**
  Montar/completar frase com blocos: linha da frase com lacunas + banco de blocos.
  Reusar o máximo do L3. **Não documentar no DS até polir.**
  *Aceite:* montar frase e cloze funcionam nos padrões do T2.2.

- [ ] **T2.4 — Trilha de gramática (tela)**
  `GrammarPathScreen`: lista ordenada de lições com status (concluída ✓ / em andamento /
  pendente), navegável livre. Item "Gramática" na home.
  *Aceite:* status deriva do SRS dos padrões da lição.

- [ ] **T2.5 — Sessão de gramática**
  Builder + tela: nota curta (explanation) → prática (select partícula L1, montar frase L7,
  cloze L7, digitar L2) → conclusão por domínio.
  *Aceite:* fluxo completo do curso 1; palavras novas no banco aparecem nos slots sem
  mudança de código.

- [ ] **T2.6 — Docs DS de gramática**
  `docs/layouts/L7-sentence-frame.md` (quando polido) + `docs/exercises/grammar-*.md` +
  índices.
  *Aceite:* só documentar o que estiver polido (regra do DS).

### FASE 3 — Escala

- [ ] **T3.1 — Pipeline de áudio por palavra** (Codex grava; preencher `audioId`, destravar
  T1.7 p/ todo o banco)
- [ ] **T3.2 — Épico backoffice do professor** (Lessons `source:"teacher"`, montagem de
  lições, liberação por turma — quebrar em tickets quando chegar a hora)
- [ ] **T3.3 — Kanji no vocabulário** (lemma com kanji + furigana da `reading`; sempre
  com furigana)

---

## 10. Pendências de decisão (não bloqueiam Fases 0–1)

- Regra de scripts (decisão 6) é default — revisar com feedback de beta.
- Intervalos exatos do Leitner (T0.2 define uma tabela inicial; calibrar depois).
- Se Gramática ganha entrada antes do curso 1 estar completo (soft-launch vs. esperar).
