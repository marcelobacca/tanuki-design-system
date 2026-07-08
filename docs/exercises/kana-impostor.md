# Exercício impostor (L4 Impostor Grid)

Usa o [L4 Impostor Grid](../layouts/L4-impostor-grid.md): 2×2 de tiles grandes, o usuário toca
o kana que **não pertence** à família.

Código: `src/utils/questions/q12.js`.

---

## Exercício 12 — ache o intruso
- **Prompt:** (implícito no enunciado) — quatro kana grandes, sem prompt separado.
- **Opções:** três kana da **mesma família** + um **intruso** de outra família.
- **Resposta:** tocar o intruso.
- **Após responder:** o romaji de cada tile faz fade-in (mostra o que era cada um).
- **Erro:** shake horizontal.
- **Gate:** só entra quando há **≥ 3 famílias** de kana selecionadas (precisa existir "outra
  família" para tirar o intruso).

> É o exercício com a lógica de geração mais elaborada (`q12.js` é o maior dos factories) —
> escolher famílias, montar o conjunto de irmãos e o intruso plausível.

### Como reproduzir
1. Escolha uma família base (3 membros) + 1 intruso de família diferente mas visualmente próxima.
2. Reutilize o **L4 Impostor Grid**.
3. Garanta o gate de ≥ 3 famílias, senão não há de onde tirar o intruso.
