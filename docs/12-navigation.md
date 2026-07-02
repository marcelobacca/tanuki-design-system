# Nav Bar (Bottom Navigation)

## Specs
| Propriedade | Valor |
|---|---|
| Altura total | 56px |
| Padding bar | 4px T/B |
| Padding item | 6px T/B · 8px L/R |
| Ícone | 20px |
| Gap ícone→label | 0px |
| bg | `T.surf` |
| border-top | `T.border` |

## Estados do item
- Default: ícone + label `T.muted`
- Active: ícone + label `T.pri`
- Disabled: opacity 0.4, `T.dim`
- Dot (notificação): círculo 6px `T.err`, position absolute top-right do ícone

## Label
- 10px · Regular 400 · letter-spacing 0.2px

## Layouts em uso
- **Atual (2 itens):** Início + Perfil
- **Futuro com Kanji (3 itens):** Início + Kanji (disabled) + Perfil
