# Feedback — Banners de Resultado

## Feedback de resposta (bottom panel após responder)
Estrutura: ícone colorido + label · layout flex row · gap 8px

| Estado | bg | border | ícone | label |
|---|---|---|---|---|
| Correto | rgba(61,214,140,0.10) | rgba(61,214,140,0.35) | check `T.ok` | "Correto!" `T.ok` 17px Bold |
| Incorreto | rgba(255,107,107,0.10) | rgba(255,107,107,0.35) | x `T.err` | "Incorreto" `T.err` 17px Bold |
| Quase | rgba(245,197,66,0.08) | rgba(245,197,66,0.35) | info-circle `T.warn` | "Quase!" `T.warn` 17px Bold |

- Radius: 14px · padding: 14px 16px
- **Incorreto** tem flag icon (bandeirinha) à direita: `flag-01` · `T.err` · opacity 0.45 → filled quando reportado
- "A resposta era: **X**" em 14px `T.err` opacity 0.9 · margin-top 2px · margin-left 26px

## Avisos de tentativa (inline, antes de responder — modo digitação)
Mesma estrutura dos banners principais, mas menor:
- Font: 13px Medium 500
- bg/border semitransparentes (mesma lógica mas mais suave)
- Quase: ícone info-circle `T.warn`
- Errado: ícone x `T.err`
