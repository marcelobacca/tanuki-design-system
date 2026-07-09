# Trilha N5 — mini-curso de japonês do Tanuki

> Estratégia aprovada em 2026-07-08. Complementa `vocab-grammar.md` (§6.7 previu esta trilha)
> e `kanji.md`. A trilha é o **curso transversal** do app: puxa kana, numerais, vocabulário,
> gramática e kanji na ordem certa, quase como um curso de japonês com exercícios práticos.

---

## 1. Princípios

1. **Base didática reconhecida** — a progressão gramatical segue **Minna no Nihongo Shokyū I**
   (padrão das escolas de japonês, inclusive as brasileiras) com validação cruzada no
   **Genki I**. Professores olham a trilha e reconhecem a ordem — argumento central do
   posicionamento "complementa a escola, não compete" (não somos Duolingo).
2. **Enquadramento por situação (estilo Irodori/JF)** — o título de cada capítulo é uma
   *situação prática* ("Se apresentar", "Comer e beber"), nunca um ponto gramatical
   ("Capítulo 3: partícula で"). O ponto gramatical está *dentro* da situação.
3. **Vocabulário em espiral (gotejamento)** — NUNCA 100% de um tema num capítulo só.
   Ninguém aprende 190 países de uma vez: aprende 5 agora, +5 capítulos depois mais 5,
   e assim por diante. Regra: **máx ~40% das palavras novas de um capítulo vêm do mesmo
   tema**, e todo tema grande (países, comidas, família…) goteja por **3+ capítulos**.
   A revisão SRS reapresenta os antigos junto dos novos.
4. **Auto-completa pelo SRS** — a lição não tem "prova de conclusão" própria: ela fecha
   quando os itens dela atingem os critérios de aprendizado do SRS compartilhado
   (vocab-grammar.md §6.4). Quem já domina o conteúdo por fora (módulo de kana, numerais,
   multiselect de vocab) vê a lição fechar sozinha — sem contagem dupla de XP.
5. **Sem trava dura** — a ordem é forte sugestão visual (lição atual destacada, futuras
   esmaecidas), mas o usuário pode entrar em qualquer lição. Essência do app.
6. **Reuso total** — a trilha não inventa exercício novo: ela sequencia os módulos e
   layouts existentes (L1–L7 + numerais + tracing). Trilha = *curadoria*, não *conteúdo novo*.

## 2. Escopo: por que N5 e o que é N5

N5 ≈ **Minna no Nihongo I inteiro** (25 lições) ≈ **Genki I** (12 lições) ≈ 300–400h de
estudo: kana completos, ~107 kanji, ~700–800 palavras, ~70–80 pontos gramaticais. Não é
"básico do básico" — é um curso completo de iniciante, e é exatamente o escopo da v1 da
trilha. Compressão adotada: **12 capítulos** (2 lições MnN ≈ 1 capítulo Tanuki,
aproximadamente; cada capítulo se desdobra em ~8–12 lições pequenas internas, ver §3).

## 3. Anatomia de um capítulo

> Estrutura espelhada nos livros: no MnN cada capítulo tem 文型 (padrões) → Renshū A
> (drill de forma, UM ponto por vez) → Renshū B (substituição, um ponto por vez) →
> Renshū C (mini-diálogos combinando) → Mondai (revisão). Muitos exercícios pequenos
> de um micro-ponto cada; a integração acontece só no fim.

A trilha tem **12 capítulos** (= "lições" dos livros). Cada capítulo tem um **tema
central** e **~8–12 lições pequenas** (~10–15 questões cada), cada uma focada em UM
micro-ponto:

| Tipo de lição | Foco | Layouts | Qtde/capítulo |
|---|---|---|---|
| **Palavras** | UM tema de vocab (ex.: só cumprimentos) | L1, L6 Match | 2–4 |
| **Frases** | UM ponto gramatical (ex.: só は; só です) | **L7**, L1 | 2–4 |
| **Kanji** | os kanji do capítulo, em lote pequeno | L5, L1, L6 | 1–2 |
| **Montar frases** | integração: combina TODOS os pontos do capítulo | L7 | 1–2 |
| **Revisão** | mistura tudo + itens SRS antigos due | todos | 1 (sempre a última) |

### Lição = receita, não prova fixa

Uma lição **não** tem perguntas gravadas: ela declara o *escopo* (itens + tipos de
exercício permitidos + gates) e o montador de sessão gera as ~15–20 questões **na hora
do clique** — mesmo padrão do `buildSession` atual (`src/utils/session.js`): sorteia
tipos, direções (JP→PT/PT→JP), distratores (por regra, nunca colidindo com a resposta)
e ordem; pesos do SRS fazem itens errados aparecerem mais; anti-repetição evita pergunta
repetida em sequência. No L7, o banco de frases-modelo é maior que a sessão (~10–15
modelos, ~6–8 sorteados; lacuna e distratores variam a cada sorteio). **Refazer uma
lição = mesmo escopo, perguntas novas.** Por isso o conteúdo gerado pelo Codex são
*bancos* (palavras, frases-modelo), nunca perguntas prontas.

Regras de sequência dentro do capítulo:
- A lição de **Palavras** de um tema vem ANTES da lição de **Frases** que usa aquelas
  palavras (aprende ねこ antes de montar ねこは…です).
- Um ponto gramatical por lição de Frases — nunca "は e です juntos" na primeira vez.
- **Montar frases** (integração) só nas últimas posições, quando todos os pontos já
  passaram individualmente.
- **Revisão** fecha o capítulo e é o gate natural (via SRS) para o próximo.

### Exemplo concreto — Capítulo 1 "Se apresentar" (9 lições)

1. Palavras · Cumprimentos (8)
2. Frases · です — "X é Y" (わたしは…です)
3. Palavras · Países e nacionalidades (5 + 〜じん)
4. Frases · は — o marcador de tópico
5. Palavras · Profissões (5)
6. Frases · じゃありません — negação
7. Kanji · 人・日・本
8. Montar frases · Se apresentar (integra は+です+じゃありません+todo o vocab)
9. Revisão do capítulo

≈ 9 lições × 12–20 questões ≈ **110–180 questões por capítulo** — volume de curso de
verdade. E é isso que faz o SRS funcionar dentro da trilha: o mesmo item reaparece
várias vezes no capítulo (na lição dele → na integração → na revisão) e de novo nos
capítulos seguintes via revisão SRS — repetição espaçada real, não "viu uma vez e passou".

- **XP**: por lição concluída (tabela vocab-grammar.md §6.5); anti-farm pelo SRS.
- Kana são pré-requisito de entrada da trilha (o app já cobre); o Capítulo 0 implícito é
  "domine hiragana" — a trilha aponta para o módulo de kana se o usuário chegar cru.
- Numerais: os capítulos 3–4 **reusam o módulo de numerais** em vez de reensinar.

## 4. Os 12 capítulos (mapa MnN I / Genki I)

> Cada linha é um CAPÍTULO (~8–12 lições internas, ver §3). Colunas de vocabulário
> mostram o **gotejamento**: `tema (n de ~total)`. Cada item de gramática separado por
> `·` vira uma lição de Frases própria. Kanji: sempre do banco de 107 (`n5Kanji.js`).

| # | Situação | Gramática (MnN/Genki) | Vocabulário (~28 novas/lição) | Kanji |
|---|---|---|---|---|
| 1 | **Se apresentar** | は, です, じゃありません, さん (MnN1/G1) | cumprimentos (8), países (5 de ~20), profissões (5 de ~15), pron. pessoais (4) | 人・日・本 |
| 2 | **O que é isso?** | これ/それ/あれ, の, か (MnN2/G2) | objetos do dia a dia (10 de ~30), família (4 de ~12), idiomas (4) | 何・語 |
| 3 | **Compras e preços** | ここ/そこ/あそこ, いくら (MnN3) | lojas/lugares (8 de ~25), dinheiro (4); **reusa numerais 100–10 000** | 円・百・千・万 |
| 4 | **Meu dia** | 時/分, から/まで, ます/ません, おきます/ねます (MnN4/G3) | rotina (8), dias da semana (7); **reusa numerais (horas)** | 時・分・半・今・曜 |
| 5 | **Ir e vir** | へ, で (transporte), いつ (MnN5/G3) | transporte (6), lugares (+6), países (+5) | 行・来・駅・車・帰 |
| 6 | **Comer e beber** | を, ませんか, ましょう (MnN6/G3) | comidas (10 de ~30), bebidas (5 de ~10) | 食・飲・水 |
| 7 | **Presentes e família** | あげます/もらいます, で (instrumento) (MnN7) | família (+6), objetos (+6), verbos dar/receber (4) | 父・母・友・手 |
| 8 | **Como é?** | adjetivos い/な, とても/あまり (MnN8/G5) | adjetivos (12 de ~30), cores (4 de ~8) | 大・小・高・新・古 |
| 9 | **Gosto!** | が, 好き/上手/わかります, どうして (MnN9/G5) | hobbies (8), comidas (+5), adjetivos (+4) | 見・聞・読・話 |
| 10 | **Onde está?** | います/あります, 上/下/中/前/後 (MnN10/G4) | posições (8), casa/móveis (6), natureza (4 de ~15) | 上・下・中・前・後・外 |
| 11 | **Quantos?** | contadores (つ, 枚, 台…), quanto tempo (MnN11) | contadores (8), tempo/duração (6), objetos (+5) | 年・月・週?→毎・間?→半* |
| 12 | **Ontem e amanhã** | passado ました/でした, comparação (MnN12/G4-5) + **revisão geral** | tempo relativo (8: ontem/amanhã…), clima (4), revisão | 先・生・学・校 |

\* L11: usar apenas kanji existentes no banco (年・月・毎…); contadores que pedem kanji
fora do banco ficam em kana.

**Espiral em ação**: países aparecem em 1→5→(revisão SRS); família em 2→7; comidas em
6→9; adjetivos em 8→9; objetos em 2→7→11. Nenhum tema fecha numa lição só.

## 5. Fatia de validação (v1 construível agora)

Construir de ponta a ponta **apenas os Capítulos 1–2** (~18–20 lições internas, ~250
questões); os capítulos 3–12 aparecem na trilha esmaeçidos ("em breve") para comunicar
a dimensão do curso.

Pré-requisitos da fatia (C1–C2):
- **Vocab**: ~60 palavras com áudio (Codex gera banco + áudio de uma vez).
- **Frases**: ~10–15 frases-modelo por lição de Frases/Montar para o L7 (com distratores).
- **Kanji**: exercícios do MVP kanji (kanji.md §4) filtrados pelos kanji do capítulo.
- **Telas**: trilha (capítulos expandíveis → lista de lições internas) — preview em
  `KanjiPathPreviewScreen` (modo Trilha) até aprovação; depois vira tela real atrás de
  flag (`FLAGS.vocab`).

Critério de validação: usuários completam C1–C2, entendem o formato "curso" (clica no
card → ~15–20 questões → check → próxima lição) e voltam para a revisão SRS. Só então
construímos C3–C12.

## 6. O que a trilha NÃO é

- Não substitui os módulos livres (kana, numerais, multiselect de vocab, kanji por
  categoria) — eles continuam como "modo livre"; a trilha é o caminho guiado.
- Não tem conteúdo próprio: se um item precisa existir só para a trilha, ele entra no
  banco geral e fica disponível no modo livre também.
- Não trava conteúdo nem cobra "corações"/vidas. Sem dark patterns do Duolingo.

## 7. Pendências / decisões futuras

- Nome público da trilha ("Curso N5"? "Trilha"? "Caminho"?) — decidir com Marcelo.
- Partículas como itens SRS próprios vs. só dentro de frases (hoje: só dentro de frases).
- Áudio de frases completas (TTS vs. gravação Codex) — necessário para L7 com áudio.
- Certificado/selo de conclusão N5 (gamificação de fim de curso).
