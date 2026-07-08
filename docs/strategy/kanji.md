# Estratégia — Módulo de Kanji (MVP de validação)

> **Status: aprovado (2026-07-08).** Escopo deliberadamente pequeno: validar com usuários
> antes de implementar tudo. Backlog de execução no Linear (projeto *Tanuki Kanji*).
> Irmão de: [vocab-grammar.md](./vocab-grammar.md) — compartilha motor SRS, layouts e padrões.

---

## 1. Por que kanji ≠ kana

| | Kana | Kanji |
|---|---|---|
| Mapeamento | símbolo ↔ som (1:1) | símbolo ↔ significado(s) ↔ várias leituras (on/kun) |
| Leitura | fixa | **depende da palavra** (日 = ひ, にち, じつ…) |
| Confusão típica | sons parecidos | **formas parecidas** (人/入, 日/目, 土/士) |
| Traçado | 1–4 traços, dados prontos | 1–10+ traços, sem dados no repo |

**Princípio pedagógico central:** leitura isolada de kanji não existe no japonês real.
O eixo do kanji isolado é o **significado**; leituras só aparecem **dentro de palavras**.

## 2. Decisões fechadas (2026-07-08)

1. **Leituras só via palavras** — kanji isolado = exercícios de significado; leitura
   aparece apenas em palavras reais (一日 → いちにち). Sem drill de on/kun isolado.
2. **Escopo de validação: 2–3 tags (~25 kanji)** — sugestão: números + tempo + natureza
   (pictográficos, beginner-friendly; números conversam com o módulo de Numerais). O resto
   dos 107 N5 fica no banco, não exposto. Curadoria final é ticket próprio.
3. **Toggle de furigana/leitura** nas palavras — mesmo padrão do toggle de romaji do
   vocabulário: sob demanda, persistente, **suprimido quando entrega a resposta**
   (ex.: exercício palavra → leitura).
4. **Traçado (L5) ENTRA no MVP** (revisado 2026-07-08) — os dados KanjiVG já cobrem 100%
   dos 107 N5 e a infra de canvas já existe (ver §3). É core: escrever é metade de
   aprender kanji. **Impostor visual fica pra v2** (precisa curar pares confundíveis),
   junto com radicais/componentes e o restante dos 107.

## 3. Ativos já existentes (repo tanuki-native)

- `src/data/kanji/n5Kanji.js` — **107 kanji N5**: on/kun, meanings PT/EN/ES, `jlpt`,
  `grade`, `strokes`, `tags`, **convenção de áudio kun/on** (kun = kanji isolado,
  on = compostos; filenames documentados no header).
- `src/tracing/tracingKanjiData.js` — **`TRACING_KANJI_N5`, cobertura 100% dos 107**:
  `{ id, kanji, hex, viewBox, strokes[] }` (paths SVG do KanjiVG, CC BY-SA 3.0).
  Auto-gerado por `scripts/generate-kanji-tracing-data.mjs` (busca direto do GitHub
  KanjiVG) — **nunca editar à mão**. Mesma forma do dado de kana → serve o canvas atual.
- `src/tracing/TracingCanvasNative.js` + `TracingLayout.js` (L5) + `useDrawCanvas.*.js` —
  **infra de traçado compartilhada, já pronta**. ⚠️ **Regra do canvas (CLAUDE.md):**
  `useDrawCanvas.ios.js` NUNCA é modificado — kanji entra alimentando o mesmo `kanaData`
  (renomear prop é opcional), sem tocar na lógica do canvas.
- `src/data/kanji/n5KanjiWords.js` — ~78 palavras (`written`/`reading`/`romaji`/
  `kanjiIds`/`translations`). ⚠️ **Tem erro de sintaxe (não carrega) + IDs possivelmente
  inconsistentes** — precisa de limpeza antes de qualquer exercício de palavra.
- `src/screens/KanjiSelectScreen.js` — multiselect por tag **já construído** (grid 2
  colunas, filtro por tag) — mesmo modelo v2 do vocabulário.
- `src/data/kanji/kanji.js` + `kanjiWords.js` — drafts antigos menores, **aposentar**
  (superseded pelos bancos N5).
- Motor SRS compartilhado (TAN-8) e layouts L1/L2/L5/L6 servem kanji sem mudança.

**Pipeline de expansão (futuro):** escolher kanji no banco pedagógico → gerar traços via
`generate-kanji-tracing-data.mjs` (fonte KanjiVG, `kanji/*.svg`) → adicionar palavras e
áudio. Fonte oficial: kanjivg.tagaini.net · github.com/KanjiVG/kanjivg (CC BY-SA 3.0).

## 4. Exercícios do MVP

| # | Exercício | Layout | Direção | Tipo SRS |
|---|---|---|---|---|
| 1 | Kanji → significado | L1 Select Grid | 山 → "montanha" | reconhecimento |
| 2 | Significado → kanji | L1 Select Grid | "montanha" → 山 | recall |
| 3 | Ouvir → kanji | L1 (+áudio kun) | 🔊 やま → 山 | reconhecimento |
| 4 | Match pairs kanji ↔ significado | L6 Match Pairs | pareamento 4–5 | reconhecimento |
| 5 | Palavra → leitura | L1 (opções em kana) | 一日 → いちにち | aplicação |
| 6 | Palavra → tradução | L1 Select Grid | 千円 → "mil ienes" | aplicação |
| 7 | **Traçar o kanji** | **L5 Tracing Canvas** | significado/kanji → traçar 山 na ordem | forma |

**Traçado (ex. 7):** modo **guiado** no MVP (overlay da ordem de traços — essencial em
kanji de 8+ traços); modo **cego** (blind, sem guia) é stretch/v2. É um eixo **próprio
(forma)**, ortogonal a significado e leitura: aparece quando o kanji é **novo** (aprender
a forma, junto da apresentação) e volta na revisão. Reusa `TracingCanvasNative` via
`tracingKanjiData.js` — **sem tocar em `useDrawCanvas.ios.js`**.

**Gate de palavra:** uma palavra só entra em sessão quando **todos os seus `kanjiIds`
estão em stage ≥ 1** (aprendeu o significado antes de ler em contexto).

**Distratores:**
- Kanji (opções visuais): mesma tag e/ou **contagem de traços próxima** (±2) — confusão
  visual real. Podem vir dos 107 (opção errada não precisa ter sido aprendida).
- Significados: de outros kanji do banco; **nunca colidir com NENHUM significado da
  resposta** nas 3 línguas (日 tem "dia" E "sol" — ambos bloqueiam distratores).
- Leituras (ex. 5): leituras de outras palavras do escopo com comprimento igual/próximo.
- Regra de ouro herdada: sem distrator elegível → questão não é gerada.

**SRS:** mesmo motor (`src/features/srs/`), `itemType: "kanji" | "kanjiWord"`. Stages e
revisão global idênticos ao vocabulário (ver vocab-grammar.md §6.4–6.6). Palavras têm
SRS próprio, separado dos kanji componentes.

**XP/missões:** mesma tabela do vocabulário (vocab-grammar.md §6.5).

## 5. Fluxo do usuário

```
Home → Kanji
└── KanjiSelectScreen (existente): multiselect por tag + contador dominados/total
    ├── Praticar → KanjiSessionScreen (nova, L0 shell, espelho de Numerais)
    │     apresentação (kanji novos: kanji grande + significado + áudio kun + 1º traçado guiado)
    │     → questões mistas por stage (kanji novos → 1/3/4/7 · avançados → 2 · palavras com gate → 5/6)
    └── Revisar → revisão global SRS (mesma mecânica do vocabulário)
```

Ritmo de novos: **3–5 adaptativo** (mesma regra do vocabulário §6.2). Furigana toggle na
sessão. Contador `dominados/total` + ★ por tag no select (mesmo padrão de unidade).

## 6. Edge cases específicos de kanji

1. **Múltiplos significados** (日 = dia/sol): qualquer significado listado é resposta
   correta em digitação futura; em select, distratores não podem colidir com nenhum.
2. **Significados vizinhos** (木/森/林 — árvore/floresta/bosque): comparar significados
   normalizados nas 3 línguas antes de aceitar como distrator (mesma regra do vocab #2).
3. **Palavra→leitura com leitura irregular/rendaku**: a leitura vem do campo `reading`
   da palavra — nunca montar leitura concatenando leituras dos kanji.
4. **Áudio kun vs on**: kanji isolado toca **kun** (convenção do banco); palavras (v2 de
   áudio) tocam a leitura da palavra inteira.
5. **Áudios não gravados**: gate por existência do arquivo (mesma regra do vocab #5) —
   exercício 3 só entra com áudio real.
6. **Escopo pequeno (~25) e distratores**: opções de kanji podem vir dos 107 completos;
   opções de significado idem — o escopo limita o que é *perguntado*, não o que aparece
   como opção errada.
7. **Kanji com tag dupla** (日 é time E nature): dominância conta uma vez só; contador de
   tag conta o kanji em ambas (transparente para o usuário).
8. **Fonte**: render de kanji usa `FONTS.noto` (NotoSansJP) — nunca fonte do sistema.
9. **Traçado — regra do canvas (CLAUDE.md)**: `useDrawCanvas.ios.js` é intocável. Kanji
   reusa o canvas via `tracingKanjiData.js` (mesma forma de `kanaData`). Consertar Android
   nunca deve afetar iOS. Kanji com muitos traços (10+) → checar que o overlay-guia e a
   tolerância de acerto do canvas ainda funcionam em `viewBox` denso (validar visualmente).
10. **`n5KanjiWords.js` quebrado**: tem erro de sintaxe e IDs possivelmente inconsistentes
    com `n5Kanji.js` — validar `kanjiIds` contra o banco na limpeza (senão o gate de
    palavra falha silenciosamente).

## 7. Fora do MVP (v2 — validar antes)

- **Impostor visual** (L4) com pares curados de kanji confundíveis (Codex pode gerar).
- **Traçado cego (blind)** — modo sem overlay, testa recall da forma (o guiado já está no MVP).
- **Radicais/componentes** como camada de mnemônica.
- **Restante dos 107 N5** + N4 (dados de traçado já cobrem os 107; falta expor).
- **Digitar leitura** (L2) — produção de leitura via texto.
- **Áudio on** das palavras (kun isolado é o do MVP).
- Integração com a **Trilha N5** (kind `kanji` no `Lesson.items` — já previsto no schema).

## 8. Isolamento e reversibilidade

Valem as **regras obrigatórias** de [vocab-grammar.md §2.1](./vocab-grammar.md): código
novo em arquivos novos, entrada na home atrás de `FLAGS.kanji` (desligada em produção),
dados em chaves novas, branch própria, e o traçado de kanji nasce validado em preview
screen (precedente `TracingNativePreviewScreen`) antes de entrar na sessão. O app atual
fica intacto até a validação; lançar = virar a flag.

## 9. Backlog

Tracker: Linear, projeto **Tanuki Kanji** (team TAN). Este doc é a fonte da estratégia;
o Linear é a fonte do status.
