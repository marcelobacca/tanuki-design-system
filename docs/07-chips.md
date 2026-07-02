# Chips (Kana)

Usado na HomeScreen para seleção de kana.

## Anatomia
- Tamanho: 64×68px · radius R.sm (9px antigo → R.sm)
- Border: `T.border` 1.5px
- Selected: border `T.pri` + bg `rgba(123,114,240,0.1)`
- Mastered: border `T.ok`

## Tipografia interna
```
chipKana:   fontSize 20 · FONTS.noto · color T.text · lineHeight 24
chipRomaji: fontSize 11 · FONTS.regular · color T.muted
```

## Progress bar (bottom do chip)
- Track: height 7px · bg `T.track` (#2E2C3F) · radius 3px
- Fill: bg `T.pri` (normal) ou `T.ok` (mastered: 100%)
- A bar está dentro do chip (position absolute, bottom)
