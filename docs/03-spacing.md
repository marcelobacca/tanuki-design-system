# Espaçamento & Border Radius

## Escala R (border radius) — `src/theme.js`
```js
R.xs   = 4    // checkbox
R.sm   = 8    // chips, kana chip, small btns
R.md   = 12   // btn, input, mc-btn, cards padrão
R.lg   = 16   // card grande
R.xl   = 24   // formCard
R.xl2  = 32   // bottom sheet
R.pill = 999  // progress bar, avatar
```
> Círculos onde `borderRadius = width/2` (ex: avatar 96px → 48px): manter o valor calculado, **não** substituir por R.

## Escala de espaçamento (múltiplos de 4px)
4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 28 · 32 · 40 · 48

## Sombras
| Uso | Valor |
|---|---|
| Primary button | `0 4px 20px rgba(123,114,240,0.45)` |
| Session CTA | `0 6px 24px rgba(123,114,240,0.5)` |
