# L4 · Impostor Grid

Grade **2×2 de tiles grandes** com kana (fonte ~52). Um dos quatro **não pertence** à família
apresentada — o usuário toca o intruso. É primo do [L1](./L1-select-grid.md) (também 2×2), mas
com semântica invertida: em vez de "escolha o certo", é "**ache o errado**".

Código: `src/features/exercises/layouts/ImpostorGridLayout.js`.

**Usado por:** kana 12.

---

## Anatomia

```
   ┌────────────┐  ┌────────────┐
   │     か     │  │     き     │      ← tiles grandes (kana ~52)
   └────────────┘  └────────────┘
   ┌────────────┐  ┌────────────┐
   │     く     │  │     め     │  ←── o intruso (outra família)
   └────────────┘  └────────────┘
```

- Três kana da **mesma família** + um **intruso** de outra família.
- Toque **errado** → animação de **shake horizontal**.
- Depois de responder, o **romaji de cada kana** aparece via **fade-in** (`subtitleAnim`) —
  reforço de aprendizado mostrando o que era cada tile.

## Interface (props)

```jsx
<ImpostorGridLayout
  question={q}                 // { options, optRomaji, answer }
  ocState={ocState}            // (opt) => 'correct' | 'wrong' | 'other' | null
  onSelect={checkMC}           // (opt) => void
  shakeAnim={shakeAnim}        // Animated.Value — shake no erro
  subtitleAnim={subtitleAnim}  // Animated.Value — fade-in do romaji
/>
```

## Gate
Só entra na sessão quando o usuário tem **≥ 3 famílias** de kana selecionadas (senão não há
"outras famílias" de onde tirar o intruso). Ver [../exercises/kana-impostor.md](../exercises/kana-impostor.md).

## Quando usar
Exercício de **diferenciação visual** — "qual não pertence?". Mais imersivo que o L1 por usar
tiles grandes e focar na discriminação entre famílias parecidas.
