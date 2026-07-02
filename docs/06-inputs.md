# Inputs & Formulários

## Input base
- bg: `T.surf` · border: `T.border` 1.5px · radius: `R.md`
- Focus: border → `T.pri` + shadow `rgba(123,114,240,0.12)` 3px
- Error: border → `T.err`
- Disabled: opacity 0.35

## Tamanhos
| Size | Height | Font |
|---|---|---|
| lg | 54px | 16px |
| md | 44px | 14px |
| sm | 36px | 12px · radius R.sm |

## Field labels
```
field-label:  12px SemiBold textSec  (acima do input)
field-hint:   12px Regular muted     (abaixo — normal)
field-error:  12px Regular err       (abaixo — erro)
field-ok:     12px Regular ok        (abaixo — sucesso)
```

## Checkbox
- 20×20px · radius R.xs · border `rgba(255,255,255,0.25)`
- Checked: bg `T.pri` + border `T.pri` + check branco
