# Estratégia — B2B: Escolas e Professores

> **Status: rascunho para validação (2026-07-10).** Evolui a "porta aberta" de
> [vocab-grammar.md §8](./vocab-grammar.md) para uma estratégia com fases. **Nada aqui
> gera ticket** até a rodada de validação com professores reais (§7) — o material de
> apresentação dessa rodada acompanha este doc.
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

## 8. Backlog

Sem tickets até a validação (§7). Depois: projeto próprio no Linear (team TAN), fatiado
por fase, 1 ticket por sessão, cada um autocontido — mesmo protocolo de
vocab-grammar §9. Este doc permanece a fonte da estratégia; o Linear, a fonte do status.
