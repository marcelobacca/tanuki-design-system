# Exercícios de reconhecimento (L1 Select Grid)

Todos usam o [L1 Select Grid](../layouts/L1-select-grid.md): prompt no topo, 4 opções em grade
2×2, toque único, uma tentativa. O que muda é **o que é o prompt** e **o que são as opções**.

Código: `src/utils/questions/q{1,2,7,8,9,10,15}.js`.

---

## Exercício 1 — kana/palavra → romaji
- **Prompt:** um kana (modo *easy*) ou uma palavra em kana (modo *normal/hard*, com a tradução
  como sub-legenda revelada).
- **Resposta:** o **romaji** correto (opções em texto, `optKana: false`).
- **Distratores:**
  - *easy:* outros kana **do mesmo tipo** (yōon → yōon, básico → básico), preferindo os
    selecionados pelo usuário.
  - *normal/hard:* palavras com o **exato mesmo número de moras** da resposta. Só pergunta
    palavras que tenham ≥ 3 "irmãs" do mesmo tamanho — senão a questão não é gerada.

## Exercício 2 — romaji/som → kana
Espelho do 1, invertido. **Prompt:** romaji. **Resposta:** o **kana** (opções em fonte
japonesa, `optKana: true`). Mesmas regras de distrator (mesmo tipo no easy; mesmo nº de moras
no normal/hard).

## Exercício 7 — palavra kana → tradução
- **Prompt:** palavra em kana. **Resposta:** a **tradução** (texto).
- **Distratores:** traduções de palavras com o **mesmo nº de moras**.
- **Gate:** só a partir da **sessão 3**, na **fase final**, e apenas com palavras que o usuário
  já viu **≥ 5 vezes** (`wordStats`). Precisa de ≥ 4 palavras elegíveis.

## Exercício 8 — tradução → palavra kana
Espelho do 7. **Prompt:** tradução. **Resposta:** a palavra em **kana**. Distratores por
**bucket de tamanho** (`sameBucketDistractors`: mesmo nº de moras, buckets vizinhos como
fallback). Mesmo gate do 7 (≥ 3 sessões, fase final, vista ≥ 5×).

## Exercício 9 — combo/palavra → romaji
- **Prompt:** uma palavra curta (easy) / palavra (normal) **ou** um "combo" gerado (dois kana
  juntos, ex. か+き). **Resposta:** o **romaji**.
- **Distratores:** outras palavras do pool + combos aleatórios para completar 4 opções.

## Exercício 10 — combo/palavra → kana
Espelho do 9. **Prompt:** romaji/som. **Resposta:** a palavra/combo em **kana**. Distratores
por bucket de tamanho (`sameBucketDistractors`) ou combos gerados.

## Exercício 15 — ouvir → selecionar a palavra (áudio)
- **Prompt:** um **áudio** da palavra (o texto fica escondido até responder). **Resposta:** a
  palavra correta em kana entre 4 opções.
- **Distratores:** palavras com o **mesmo nº de moras** (mesmo 1 mora de diferença já
  "entrega" pelo som).
- **Gate:** áudio habilitado + `sessionsDone ≥ 2` + `≥ 4` palavras com áudio (usa só palavras
  de 2+ moras — um kana isolado é difícil demais de distinguir só de ouvido).
- **Skip:** aparece dentro do próprio layout quando o timer zera.

---

### Como reproduzir um novo exercício de reconhecimento
1. Escolha o prompt e a resposta (kana? romaji? tradução? áudio?).
2. Reutilize o **L1 Select Grid** (variante kana ou texto conforme as opções).
3. Gere 3 distratores respeitando a **regra de tamanho** (mesmo nº de moras / mesmo bucket) —
   nunca preencha com opções de tamanho diferente.
4. Defina o gate (a partir de que sessão / fase / exposição aparece) em `session.js`.
5. Registre a linha na [tabela mestra](./index.md) e, se criar layout novo, em [../layouts/](../layouts/index.md).
