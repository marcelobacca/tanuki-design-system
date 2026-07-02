# Tipografia

## Inter — UI (todos os textos)
| Token | Size | Weight | Uso |
|---|---|---|---|
| Display/Hero | 48px | 800 ExtraBold | Auth hero |
| H1/Page | 26px | 700 Bold | Títulos de tela |
| H2 | 20px | 700 Bold | Seções |
| Section | 16px | 700 Bold | Sub-seções |
| Body | 14px | 400 Regular | Texto corrido |
| Body Medium | 14px | 500 Medium | Texto de apoio |
| Caption | 12px | 400 Regular | Metadados |
| Overline | 12px | 700 Bold + tracking 1.5px | Labels em caps |
| Micro | 10px | 700 Bold | Badges, tags |

**Regras:**
- Font sizes pares: 12, 14, 16, 18, 20, 24, 26, 28…
- 15px não existe. Body é 14px.
- 11px não existe. Overline é 12px.
- Title 28px foi removido — usar H1/Page (26px)

## Noto Sans JP — Kana only
| Uso | Size | Weight |
|---|---|---|
| Session prompt | 48px | 400 Regular (`FONTS.noto`) |
| Card kana (chip) | 20px | 400 Regular (`FONTS.noto`) — lineHeight 24 |
| Logo JP "たぬき" | 20px | 500 Medium (`FONTS.notoMedium`) |

**Por que não Inter?** Inter é Latin-only — sem glifos japoneses. Noto garante renderização idêntica em iOS e Android.
