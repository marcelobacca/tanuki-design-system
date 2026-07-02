# Tanuki Sensei — Design System Index

> **Stack:** React Native + Expo · Dark mode only · iOS + Android
> **Fontes:** Inter (UI) · Noto Sans JP (kana exclusivamente)
> **Atualizado:** 2026-07-02

## Regras globais invioláveis
- Dark mode only — nunca modo claro (light mode planejado — ver `docs/design-system-tasks.md` Grupo E)
- Font sizes pares: 10, 12, 14, 16, 18, 20, 24, 26 — **13/15 → 14 · 17 → 16 · 11 → 10 ou 12**
- Cor é token separado da tipografia (specimens sempre em `T.text`)
- Toda string visível usa `useT()` — nunca hardcode
- `R.*` para borderRadius, `T.*` para cores, `FONTS.*` para fontes — nunca literais (`'#7A78A3'`, `'Inter_600SemiBold'`, `12`)
- Novo token = atualizar 4 lugares: `src/theme.js` · `design-system/styles.css` · `sections/01-colors.html` · `docs/01-colors.md`

## Arquivos de referência
| Seção | Arquivo | Conteúdo |
|---|---|---|
| Cores | [01-colors.md](./01-colors.md) | Tokens, hex, uso |
| Tipografia | [02-typography.md](./02-typography.md) | Escala, Inter + Noto |
| Espaçamento | [03-spacing.md](./03-spacing.md) | Escala R, spacing |
| Ícones | [04-icons.md](./04-icons.md) | Biblioteca Untitled UI |
| Botões | [05-buttons.md](./05-buttons.md) | Variantes, tamanhos, estados |
| Inputs | [06-inputs.md](./06-inputs.md) | Sizes, estados, dropdown |
| Chips | [07-chips.md](./07-chips.md) | Kana chip, progress bar |
| Cards | [08-cards.md](./08-cards.md) | Card padrão, stat, action row |
| Badges | [09-badges.md](./09-badges.md) | Status badge, count badge |
| Progress | [10-progress.md](./10-progress.md) | Barras, tamanhos, cores |
| Tabs | [11-tabs.md](./11-tabs.md) | Tab padrão, com count badge |
| Nav Bar | [12-navigation.md](./12-navigation.md) | Bottom nav, specs |
| Sessão | [13-session.md](./13-session.md) | Top bar, prompt, tracing |
| Feedback | [15-feedback.md](./15-feedback.md) | Banners correto/errado/quase |
| Bottom Sheet | [16-sheets.md](./16-sheets.md) | Modal sheet, empty state |
| Toast | [19-toast.md](./19-toast.md) | Snackbar, variantes |
| Skeleton | [20-skeleton.md](./20-skeleton.md) | Loading states |
| Tooltip | [21-tooltip.md](./21-tooltip.md) | Dicas contextuais |
| Gaps | [17-gaps.md](./17-gaps.md) | Pendências |

## Quick reference — tokens mais usados
```js
// Cores principais
T.bg         // #0F0E18  fundo base
T.surf       // #1A1929  cards, inputs, header
T.surf2      // #211F32  menus, popovers
T.text       // #E8E6F8  texto principal
T.muted      // #7A78A3  placeholders, labels
T.pri        // #7B72F0  CTAs, seleção, progresso
T.ok / T.err / T.warn / T.info
T.star       // #FACC15  estrelas de avaliação (não é warn)

// Border radius
R.xs=4  R.sm=8  R.md=12  R.lg=16  R.xl=24  R.xl2=32  R.pill=999

// Fontes
FONTS.regular / .medium / .semiBold / .bold / .extraBold
FONTS.noto (kana 400)  /  FONTS.notoMedium (kana 500)
```
