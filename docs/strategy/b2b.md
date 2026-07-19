# Estratégia — B2B: Escolas e Professores

> **Status: aprovado — piloto agosto/2026 em execução (2026-07-10).** Evolui a "porta
> aberta" de [vocab-grammar.md §8](./vocab-grammar.md). A validação com professores (§7)
> acontece em paralelo à construção do piloto — o prazo (aulas começam em agosto) exige
> começar já. Backlog do piloto em §9; ritmo ditado por disponibilidade de tokens, sem
> divisão por semanas.
> Decidido em sessão de brainstorm no repo `tanuki-native` (2026-07-10).

---

## 1. North star

O Tanuki como **extensão da aula presencial**: o professor controla o escopo do que a
turma pratica na semana ("famílias A e KA + koko/soko/asoko"), o app gera exercícios
sempre novos dentro desse escopo, e o professor volta para a aula seguinte sabendo
**o que a turma realmente aprendeu e onde está travando**.

A tese em uma frase: **dever de casa que nunca repete questão + relatório que informa a
próxima aula.**

| | Aluno | Professor |
|---|---|---|
| Ganha | Prática guiada alinhada com a aula, gamificada, com SRS | Visibilidade de quem praticou e relatório agregado de erros |
| Unidade | "Lição da semana" (card na home) | Turma → assignments → relatórios |
| Motor | O mesmo runner de receitas da Trilha | Backoffice web sobre o mesmo schema |

## 2. Princípio transversal — motor agnóstico de língua

**O MVP é 100% japonês.** Mas toda decisão de arquitetura daqui em diante assume que o
app é uma **base de templates (layouts + geradores + SRS + receitas) que consome uma
língua**, não um app de japonês:

1. Código novo não importa bancos de conteúdo (`HF`/`KF`, vocab, patterns) diretamente
   quando puder recebê-los por parâmetro/contexto — o conceito de **Course**
   (vocab-grammar §3.3/§6.7) é o encaixe natural.
2. Conteúdo sempre referenciado por **id/query contra bancos** (padrão já vigente na
   Trilha) — nunca inline em código de tela ou gerador.
3. Extensões de schema por língua entram como **campos opcionais** no modelo de
   caractere/palavra (ex.: formas contextuais, tom, decomposição silábica), nunca como
   forks do motor.
4. Cada língua nova exigirá adequações próprias (novos tipos de exercício, RTL, tons) —
   isso é esperado e aceito; o que não se aceita é o motor genérico conhecer o japonês.

Por que isso mora no doc B2B: **línguas × escolas se multiplicam** — cada língua nova
abre um mercado B2B inteiro (escolas de coreano, de russo…) com o mesmo backoffice.

## 3. Insight de arquitetura — assignment = receita da Trilha

O schema da Trilha (`src/data/trilha/schema.js`, TAN-31) **já é o formato de uma lição
de casa**:

- `TrilhaLesson` = escopo (`vocabQuery` / `patternIds` / `kanjiChars` / famílias de
  kana) + `build` (mix de layouts com pesos + faixa de questões). Um assignment do
  professor é exatamente isso, com `source: "teacher"` + prazo + turma.
- `validateChapter()` vira a validação do formulário do backoffice (pool mínimo,
  padrões sem vocab coberto, etc.) — **de graça**.
- O runner gera questões novas a cada tentativa → refazer o dever nunca é decoreba.
- O SRS por item é a fonte de toda métrica que o professor verá — nenhuma métrica nova
  precisa ser inventada (já previsto em vocab-grammar §8).
- A Trilha N5 (`source: "curated"`) é o primeiro Course e **valida o motor do
  backoffice antes de existir backoffice**.

## 4. Fases de produto

### Fase 0 — Turma + visibilidade (MVP B2B)

Reusa 100% do conteúdo e das telas existentes; a única peça nova é vínculo + write-back.

- Professor cria **turma** → gera **código/link de convite** (padrão Kahoot/Classroom).
- Aluno cria conta própria (Firebase Auth atual) e entra com o código. **Nunca**
  pré-cadastro de e-mails pelo professor (fricção + LGPD).
- O professor **instrui** o escopo da semana verbalmente/por mensagem; o aluno
  seleciona as famílias/unidades no app (fluxo que já existe).
- **Write-back**: sessão concluída grava `{alunoId, escopo, data, acurácia}` no
  Firestore (chave/coleção NOVA — isolamento §2.1 de vocab-grammar).
- Professor vê lista simples: quem praticou, o quê, quando. Pode ser uma tela web
  mínima ou até dentro do app num primeiro momento.

### Fase 1 — Assignment estruturado

- **Backoffice web** (React + o mesmo Firebase): o editor de assignment é um formulário
  sobre o schema da Trilha — escolher famílias de kana, padrões, vocab por tag, mix de
  layouts, prazo. Validação = `validateChapter`.
- No app, card **"Lição da semana"** na home roda a receita pelo runner existente.
- Status por aluno: não iniciou / em andamento / concluiu (+ acurácia).

### Fase 2 — Gancho de retenção (o motivo de renovar)

- **Relatório agregado de erros da turma**: "70% da turma confunde は com ほ",
  "koko/soko ok, asoko fraco", ranking de kana/palavras/padrões mais errados.
- Transforma o produto de "checador de dever" em **ferramenta pedagógica que pauta a
  próxima aula** — é o motor de renovação da mensalidade, mais que o tracking binário.
- Fonte de dados: o SRS + histórico de respostas já capturados; é agregação, não
  captura nova.

## 5. Modelo comercial (hipótese a validar)

- **Mensalidade base** (produto/backoffice) **+ R$ 10/aluno/mês**, cobrados da escola
  ou do professor autônomo.
- Posicionamento vs. Duolingo for Schools: lá é grátis, mas o professor só acompanha o
  conteúdo fixo do Duolingo. **O diferencial do Tanuki é o professor controlar o
  escopo** — o app pratica exatamente o que a aula ensinou.
- Quem é o comprador (escola vs. professor autônomo), preço-teto e tamanho médio de
  turma → responder na validação (§7).

## 6. Pontos de atenção

1. **LGPD / menores de idade**: escolas de idioma têm muitos adolescentes. Definir
   escola como controladora, consentimento no onboarding da turma. Não bloqueia MVP com
   turmas de adultos, mas entra no contrato desde o primeiro piloto.
2. **Offline-first**: o write-back de conclusão precisa ser confiável offline→online
   (precedente: `src/features/srs/sync.js`).
3. **Sair da turma / trocar de turma / fim de contrato**: dados do aluno pertencem ao
   aluno; a turma perde acesso ao relatório, o progresso pessoal fica.
4. **Isolamento (obrigatório)**: valem as regras de vocab-grammar §2.1 — código novo em
   arquivos novos, entrada atrás de flag desligada em produção, dados em
   chaves/coleções novas, branch própria. O app consumer fica intacto.

## 7. Validação antes de qualquer ticket

Rodada com professora de japonês + mentora de educação (material de apresentação
preparado junto com este doc). Perguntas que precisam de resposta:

1. Como o professor passa e cobra dever de casa **hoje**? O que é insuportável nisso?
2. O relatório de erros agregado mudaria como ele prepara a aula seguinte?
3. Quem pagaria — a escola ou o professor? Quanto? R$ 10/aluno é viável na mensalidade
   típica de curso de idioma?
4. Tamanho típico de turma e frequência de "dever" (semanal? por aula?).
5. O professor quer MONTAR a lição (Fase 1) ou preferiria liberar lições prontas
   alinhadas com o material didático que já usa?
6. Fase 0 (só visibilidade, sem editor) já teria valor suficiente para um piloto pago?

Critério para abrir tickets: **1–2 turmas reais comprometidas com um piloto** da Fase 0.

## 8. Decisões do piloto (fechadas 2026-07-10)

1. **Modelo de liberação, não editor de lições.** O professor marca checkboxes do que já
   ensinou ("liberar família KA, koko/soko"); o app intersecta com a seleção de treino
   existente. Editor de lições (Fase 1) só depois do piloto, se professores pedirem.
2. **Tempo real, sem atualização de app.** Liberação é dado no Firestore; o app escuta o
   doc da turma via `onSnapshot` — o cadeado abre no celular do aluno no momento do
   check, como receber uma mensagem. OTA (expo-updates, já configurado) serve só para
   entregar a *feature* uma vez, sem loja.
3. **Um app só.** Nada de "Tanuki Aluno" separado (processo de loja mataria o prazo).
   Vínculo por código no perfil + no fim do cadastro. Sem turma = app normal (futuro:
   plano pago consumer).
4. **Entrar é via código; sair só pelo professor.** Aluno não tem botão de sair (evita
   evasão do acompanhamento). Turma errada = professor remove, aluno entra com o código
   certo.
5. **"Lição da semana" derivada, não autorada.** O *delta* da última liberação vira o
   card "Novidades da turma" com sugestão de treino (novidade + revisão do anterior).
6. **Catálogo de liberação gerado dos bancos, nunca mantido à mão.** Granularidade =
   "o que um professor diria em aula" (família de kana, faixa de numerais, unidade
   temática de vocab, padrão gramatical individual). Padrão declara dependência das
   tags de vocab que consome (via `slots.js`) → o checklist avisa, não deixa quebrar.
7. **Trilha em pausa (pin).** O piloto NÃO depende da Trilha N5; vocab e gramática
   crescem como bancos + exercícios livres, sem a lógica de trilha. Integração
   trilha×turma fica para depois.
8. **Fora do piloto:** editor de lições, cobrança automatizada (piloto grátis/manual),
   kanji e verbos conjugados no catálogo, múltiplos professores por turma, analytics
   sofisticado (relatório v0 = query de agregação simples).
9. **Divisão de execução por ferramenta:** Codex = lógica/backend/conteúdo (tickets com
   aceite verificável); Claude/Opus = telas (app + web, seguindo o design system);
   specs e tickets = Fable (semana de 2026-07-10).

### 8b. Revisões (2026-07-19)

1. **Recomendação, não cadeado** (revisa §8.1–8.2). O professor marca o "treino da
   semana"; nada fica bloqueado no app — se ele esquecer de marcar, o aluno só continua
   treinando livre (degradação graciosa). Caem A2 (cadeados) e B6 (interseção); W3 vira
   tela "Treino da semana" (mesmos checkboxes, semântica de recomendação).
2. **Lição do livro = unidade central.** Validado no protótipo `~/tanuki-estudo-prova`
   (PDF do livro → lições → vocab tagueado, 132 palavras L1–L4): o banco de vocabulário
   é GENÉRICO (japonês iniciante/N5, traduções próprias); o agrupamento "lição N" é
   **configuração da turma**, não do banco. Cada turma tem seu mapeamento lição→itens,
   criado no onboarding (manual/concierge no piloto: Marcelo + Claude analisam o
   material do professor).
3. **Nome de livro nunca aparece no produto.** No app é só "Lição 4 · Minha turma".
   Estrutura vem do professor (que usa o livro licitamente no curso), não de fábrica.
   Catálogos futuros legalmente limpos: Irodori/Marugoto (CC BY) e JLPT N5. Sem
   biblioteca de livros por ora.
4. **Área "Minha turma" no app.** Sem turma = app intacto. Com turma: item novo no menu
   com as lições da turma; lição marcada pelo professor ganha destaque (+ card na home);
   lições anteriores sempre acessíveis para revisão. Dentro da lição, **"revisão
   geral"** = trilha curta de exercícios da lição (vocab → partículas → montar frases →
   numerais aplicados), gerada do banco — sempre nova.
5. **Pendência de conteúdo identificada:** exercícios de numerais APLICADOS (andares
   〜かい, idade 〜さい, preços 〜えん, intervalos から〜まで, horas) — a análise do
   livro (P4) especifica o que cada lição exige.

### 8c. Tickets novos decorrentes

- **P4 `[Marcelo+Claude]`** — Análise do livro do curso por lição. **✅ FEITO 2026-07-19**
  — saída em `tanuki-native/docs/b2b/analise-livro/` (index + licao-01..04): vocab,
  gramática, numerais aplicados (idade/andar/preço/horas/minutos/kara-made) e mapa
  treino→layout por lição.
- ~~C5~~ — absorvido pelo plano v2 (§10, ticket B3-rev).

---

## 10. Plano de execução v2 (2026-07-19) — 3 frentes

> **Substitui o §9 como backlog vivo.** Decisões novas do Marcelo: (a) ambiente do
> professor em **shadcn/ui** (tema default preto/branco, sem cores da marca);
> (b) numerais aplicados entram **primeiro no app consumer** (para todos) e são
> reusados no ambiente do aluno; (c) lição = **menu de treinos focados** (partículas /
> verbos / preços / horas / vocabulário / frases…) seguindo a cronologia do livro;
> (d) **romaji = toggle por preferência do aluno** (padrão ligado; apoio nunca entrega
> resposta em produção; katakana sempre com apoio); (e) execução: backend = Claude ou
> Codex (tickets autocontidos), front (web + app) = Opus.
> Mortos do §9: A2 (cadeados), B6 (interseção). B3 (releasables) já executado; a peça
> de conteúdo agora é B3-rev (lições/receitas).

### Track N — Numerais aplicados no app consumer `[independente — começar já]`

- [ ] **N1 — Engine de contadores** `[backend]`
  `src/utils/numerals/counters.js` (novo): leituras para 〜さい (いっさい/はっさい/
  はたち), 〜かい (いっかい/さんがい/ろっかい/はっかい/じゅっかい), 〜えん (compõe com
  centenas/milhares existentes), 〜じ (よじ/しちじ/くじ), 〜ふん/ぷん (いっぷん/さんぷん/
  よんぷん/ろっぷん/はっぷん/じゅっぷん + はん). API: `readCounter(n, counter)` +
  gerador de distratores (leitura regular incorreta — ex. よんじ — como distrator
  principal). *Aceite:* testes unitários cobrindo TODOS os irregulares; zero UI.
- [ ] **N2 — Exercício "numeral aplicado"** `[front/Opus — depende N1]`
  Novo exercício no módulo de numerais existente: enunciado «4じ», 4 opções de leitura
  em kana (Select Grid L1). Seções novas na seleção: Idade, Andares, Preços, Horas,
  Minutos. i18n PT/EN/ES; tokens do DS; **atualizar `docs/exercises/` no
  tanuki-design-system (regra obrigatória)**. Áudio: reusar `num_t4_*` já gerados
  (horas etc.); faltantes = bônus, nunca bloqueador.
- [ ] **N3 — Validação em device + OTA** `[Marcelo]`

### Track B — Backend turma (Firebase) `[backend — Claude ou Codex]`

- [ ] **B1-rev — Modelo de dados + rules + testes de emulador**
  `turmas/{id}` `{codigo, nome, professorUid, semana: {lessonId, treinoIds[]},
  createdAt}` · `turmas/{id}/membros/{uid}` `{displayName, joinedAt}` ·
  `praticas/{autoId}` `{uid, turmaId, lessonId, treinoId, tipo, total, acertos,
  erros: [{itemId, count}], iniciadaEm}`. Rules iguais ao B1 original (aluno cria a
  própria prática/membership; professor gerencia a própria turma; professor =
  doc em `professores/{uid}` manual no piloto). *Aceite:* `firebase emulators:exec`
  cobrindo cada permissão/negação; zero toque em coleções existentes.
- [ ] **B2 — Código de convite + join transacional** — inalterado (§9-B2).
- [ ] **B3-rev — Config de lições + banco do piloto (a peça de conteúdo)**
  (1) Schema `src/data/turma/lessons.js`: lição = `{id, tituloKey, treinos: [{id,
  tipo: vocabQuiz|matchPairs|particleFill|buildSentence|verbForm|numeralApplied,
  escopo: {tags?|patternIds?|counter?|range?}, questoes}]}` + validador (pool mínimo,
  padrão com vocab coberto — reusar validateChapter/slots). (2) Converter as 132
  palavras de `~/tanuki-estudo-prova/data.js` para o banco oficial (genérico, traduções
  próprias, SEM nome de livro; ids/tags estáveis). (3) Gerar lições 1–4 do piloto a
  partir de `tanuki-native/docs/b2b/analise-livro/` (tabela treino→lição do index.md).
  *Aceite:* validador passa; cada treino resolve escopo contra os bancos; teste de
  round-trip do schema.
- [ ] **B4 — Módulo `src/features/turma/`** — igual ao original (join/listener/flag),
  listener agora observa `semana`.
- [ ] **B5 — Write-back de práticas (fila offline)** — igual ao original, granularidade
  por treino (`lessonId`+`treinoId`), hook único em `completeSession.js`.

### Track W — Web do professor `[shadcn/ui · front = Opus, queries = backend]`

- [ ] **W1 — Scaffold** `[Opus]` Vite + React + TS + Tailwind + **shadcn/ui tema
  default (preto/branco, sem cores da marca)**. Firebase Auth e-mail/senha restrito a
  `professores/{uid}`; deploy Vercel. *Aceite:* login funciona, rota protegida.
- [ ] **W2 — Turma** `[Opus — depende B1/B2]` Criar turma, exibir código de convite
  (copiável), lista de alunos, remover aluno.
- [ ] **W3 — Treino da semana** `[Opus — depende B3-rev]` Selecionar lição + treinos
  recomendados (grava `semana` no doc da turma; alunos veem em tempo real). Aviso de
  dependência quando um treino exige vocab de outra lição.
- [ ] **W4 — Relatório da turma** `[queries: backend · UI: Opus — depende B5]`
  (a) Atividade: quem praticou, o quê, quando, aproveitamento; (b) Dificuldades:
  aproveitamento por treino/tópico + top 10 itens mais errados ("70% erram 4じ").
  Agregação client-side v0 sobre `praticas`.
- [ ] **W5 — Relatório por aluno** `[Opus — depende W4]` Drill-down: sessões,
  aproveitamento por treino, últimos erros. Desempenho geral simplificado.

### Track S — App do aluno `[front = Opus · depende B2/B3-rev/B4]`

- [ ] **S1 — Entrar na turma** Fluxo no perfil + passo opcional pós-cadastro; estados
  código inválido/já membro/sucesso; aviso de consentimento (professor vê progresso).
- [ ] **S2 — Área "Minha turma"** Lista de lições (ordem do curso) → **menu de treinos
  da lição** (vocabulário / partículas / verbos / numerais aplicados / montar frases /
  revisão geral — só os que a lição tem, conforme B3-rev) → sessão via runner
  existente. Destaque na lição/treinos marcados na `semana`. **Preferência de romaji**
  (toggle em ajustes, padrão ligado; produção nunca revela resposta; katakana sempre
  com apoio). Zero layout shift.
- [ ] **S3 — Card "Treino da semana" na home** Delta da `semana`; some sem turma.
- [ ] **S4 — OTA + smoke test em device** `[Marcelo + Opus]`

### Track P — Piloto `[Marcelo]` — P1 (compromisso da professora), P2 (ensaio geral),
P3 (rodada de validação §7). P4 ✅ feito.

### Ordem sugerida (execução aos poucos)

1. **N1 → N2** (valor imediato no consumer; nada depende deles)
2. **B1-rev → B2** (destrava tudo de turma)
3. **B3-rev** (conteúdo das lições — destrava W3 e S2)
4. **W1 → W2** (professora já pode criar a turma real)
5. **B4 → B5** (app conectado + dados fluindo)
6. **S1 → S2 → S3** (experiência do aluno completa)
7. **W3 → W4 → W5** (relatórios com dados reais chegando)
8. **P2 ensaio geral → aula 1**

## 9. Backlog do piloto

> **Espelhado no Linear (2026-07-10):** projeto
> [Tanuki B2B Piloto](https://linear.app/tanuki-sensei/project/tanuki-b2b-piloto-8b2169f0b4fb),
> tickets **TAN-75…TAN-94**, etiquetados por executor (`codex`/`claude`/`marcelo`).
> Este doc é a fonte da estratégia; o Linear, a do status. Tickets autocontidos —
> colar direto na ferramenta executora. Ordem = dependência, não calendário. Regras de
> isolamento de vocab-grammar §2.1 valem em todos: arquivos novos, flag desligada em
> produção, chaves/coleções novas, branch própria. (C2 não virou ticket novo — os
> tickets de áudio já existem no projeto Tanuki Vocabulário.)

### Track B — Backend B2B `[Codex — executável já]`

- [ ] **B1 — Modelo de dados + Firestore rules + testes**
  Coleções novas: `turmas/{turmaId}` `{ codigo, nome, professorUid, releases: {kana: [ids
  de família], numerais: [ids de faixa], vocabTags: [], patternIds: []}, createdAt }`;
  `turmas/{turmaId}/membros/{uid}` `{ displayName, joinedAt }`; `praticas/{autoId}`
  `{ uid, turmaId, escopo, iniciadaEm, total, acertos, erros: [{itemId, count}] }`.
  Rules: aluno cria a própria prática e o próprio doc de membro (join); só o professor
  da turma edita `releases` e remove membros; professor lê membros + práticas só da
  própria turma; aluno lê o doc da própria turma (para o listener). Professor
  identificado por doc em `professores/{uid}` (criado manualmente no piloto).
  *Aceite:* testes de rules no emulador (`firebase emulators:exec`) cobrindo cada
  permissão e cada negação; nenhum toque em coleções existentes.

- [ ] **B2 — Código de convite + join transacional**
  Código curto legível (6 chars, sem 0/O/1/I), único por turma. Join: buscar turma pelo
  código + criar doc de membro (transação/batch client-side; rules de B1 garantem).
  Sem saída pelo aluno (decisão §8.4); remoção de membro = só professor.
  *Aceite:* testes — código inválido, turma inexistente, join duplicado (idempotente),
  remoção pelo professor, aluno não consegue se remover nem remover terceiros.

- [ ] **B3 — Catálogo de liberação gerado dos bancos**
  Script `scripts/build-releasables.mjs` → gera `src/data/releasables.js` (header
  "DO NOT EDIT", padrão de `components/Icon.js`). Unidades: famílias de
  `src/data/kana/*` (HF/HY/KF/KY + sokuon + vogais longas, ids existentes), faixas de
  numerais (definir no script: 1–10, 11–99, 100–999, 1000+, conforme
  `src/utils/numerals/`), tags de vocab (do banco novo, quando existir — C1),
  padrões (de `GrammarPatterns`, com `deps: [vocabTags]` extraídas dos slots via
  `src/utils/grammar/slots.js`). Cada item: `{ id, module, labelKey, deps? }` +
  chaves i18n nas 3 línguas.
  *Aceite:* teste valida ids únicos, deps apontando para itens existentes, e que rodar
  o script 2× é idempotente.

- [ ] **B4 — Módulo `src/features/turma/` (lógica, sem UI)**
  Store + API: `joinTurma(codigo)`, `getTurma()`, listener `onSnapshot` do doc da turma
  mantendo `releases` em estado local (com cache AsyncStorage para abrir offline).
  Atrás de flag desligada (criar `FLAGS` se ainda não existir, padrão kanji §8).
  *Aceite:* testes unitários com Firestore mockado; app sem turma se comporta
  exatamente como hoje.

- [ ] **B5 — Write-back de práticas com fila offline**
  `src/features/turma/practiceLog.js`: ao concluir sessão (hook único em
  `completeSession.js`, ponto de orquestração existente), se há turma, enfileira
  `{escopo, total, acertos, erros por item}` e envia; offline → fila persistida em
  AsyncStorage, flush ao reconectar (precedente: `src/features/srs/sync.js`).
  *Aceite:* teste — sessão offline enfileira, reconexão sobe, sem duplicar; sem turma
  = zero writes.

- [ ] **B6 — Interseção liberação × conteúdo**
  Função pura `filterByReleases(releasables, releases)` consumida pela seleção de
  treino: retorna o que está liberado/bloqueado por módulo. Sem turma → tudo liberado.
  *Aceite:* testes puros; nenhuma tela alterada neste ticket.

### Track C — Conteúdo `[Codex — executável já]`

- [ ] **C1 — Banco de vocabulário (schema novo) — unidades do 1º semestre**
  Executar primeiro os tickets já existentes de criação de palavras + áudio; este
  ticket amplia: unidades temáticas cobrindo um 1º semestre típico (saudações, sala de
  aula/objetos, lugares, pessoas, comida básica…), ≥ 8 palavras/unidade (mín. 4 —
  `MIN_VOCAB_POOL`), traduções PT/EN/ES, tags corretas, `isGrammaticalWord` para
  koko/kore/partículas (vocab-grammar §2.12). Áudio é bônus, nunca bloqueador.
  *Aceite:* validadores/testes existentes passam; nenhuma unidade abaixo do pool mínimo;
  sem homófonos/sinônimos como distratores entre si (edge cases vocab-grammar §7).

- [ ] **C2 — Áudio kanji + vocab** — tickets já existentes; mandar executar.

- [ ] **C3 — Padrões de gramática do 1º semestre (sem trilha)**
  `GrammarPatterns`: これ/それ/あれ, ここ/そこ/あそこ (já iniciado), partículas は e か
  (`particleExercise`), です/じゃないです. Slots consumindo tags de C1; validados por
  `validateParticleExercise`/`slots.js`. Nada de lógica de trilha (pin, decisão §8.7).
  *Aceite:* validadores passam; cada padrão tem `fixedExamples` OU tags cobertas por C1.

- [ ] **C4 — Teste de cobertura contra o programa da professora** `[Marcelo]`
  Pegar o plano do semestre dela e mapear semana → unidade do catálogo. Onde faltar:
  ou vira item de C1/C3, ou fica registrado que aquela semana não terá prática no app.

### Track A — App do aluno (telas) `[Claude/Opus — próxima semana; depende de B2/B4/B6]`

- [ ] **A1 — Fluxo "Entrar na turma"**: item no perfil + passo opcional no fim do
  cadastro ("tem código da sua escola?"), com aviso de consentimento (professor passa a
  ver o progresso — LGPD §6.1). Estados: código inválido, já membro, sucesso.
- [ ] **A2 — Cadeados na seleção de treino**: itens não liberados visíveis mas
  bloqueados ("sua turma ainda não chegou aqui"), consumindo B6. Zero layout shift.
- [ ] **A3 — Card "Novidades da turma"** na home: delta da última liberação + botão que
  inicia treino focado (novidade + revisão). Some quando não há turma/novidade.
- [ ] **A4 — Release OTA** do lado do aluno (flag ligada) + smoke test em device.

### Track W — Web do professor `[scaffold/queries: Codex · telas: Claude/Opus; depende de B1/B3]`

- [ ] **W1 — Scaffold**: Vite + React + Firebase JS SDK, deploy Vercel, login
  e-mail/senha restrito a `professores/{uid}`. `[Codex]`
- [ ] **W2 — Tela Turma**: criar turma, exibir código de convite, lista de alunos,
  remover/trocar aluno. `[Claude]`
- [ ] **W3 — Tela Liberação**: catálogo (B3) em checkboxes agrupados por módulo, com
  aviso de dependência ("koko/soko usa vocabulário de Lugares — libere junto").
  Salvar = grava `releases` (alunos veem na hora). `[Claude]`
- [ ] **W4 — Telas Atividade + Dificuldades**: quem praticou o quê/quando/aproveitamento;
  top 10 itens mais errados da turma (agregação client-side v0 sobre `praticas`).
  `[queries: Codex · UI: Claude]`

### Track P — Piloto `[Marcelo]`

- [ ] **P1 — Compromisso da professora** (turma, dia, programa do semestre → C4).
- [ ] **P2 — Ensaio geral**: professora cria a turma real, você entra como aluno fake,
  ciclo completo (liberar → praticar → relatório) antes da primeira aula. Ajustes via OTA.
- [ ] **P3 — Rodada de validação** (§7) com professora + mentora usando o material de
  apresentação — colher respostas e atualizar §5 (modelo comercial).
