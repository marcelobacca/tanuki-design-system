# Botões

## Variantes
| Variante | Background | Borda | Uso |
|---|---|---|---|
| Primary | `T.pri` + shadow | none | CTA principal |
| Secondary | `T.surf2` | `T.border` 1.5px | Ação secundária |
| Tertiary | transparent | none | Link/ghost |
| Danger | `T.errFaint` | `T.err` 1.5px | Ação destrutiva |
| Social | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.12)` | Google/Apple |

## Tamanhos
| Size | Height | Padding H | Font | Radius |
|---|---|---|---|---|
| lg | 54px | 24px | 16px 600 | R.md |
| md | 44px | 18px | 14px 600 | R.md |
| sm | 36px | 14px | 12px 500 | R.sm |

## Estados
- Hover: opacity 0.88 (primary) / border → pri (secondary)
- Active: `scale(0.97)`
- Disabled: opacity 0.35, pointer-events none
- Loading: opacity 0.65, spinner 14px
