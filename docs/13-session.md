# Sessão — Padrões Visuais

## Top Bar (componente universal — todos os exercícios)
```
[settings-01 ⚙]  [====progress====]  [15]
  36×36px surf       flex:1 h8px       12px Bold
  radius R.sm        track surf2       muted → err ≤3s
                     fill pri          2 dígitos padStart
```
- Gap entre elementos: 12px
- Timer: hidden em type 14 (tracing) e após responder

## Zona Azul — Área de Prompt (`promptArea`)

Regra fundamental: **altura fixa em todos os exercícios** para evitar movimento dos botões de resposta ao trocar de questão.

```
paddingTop:    24   ← FIXO, nunca alterar (garante prompt sempre no mesmo Y)
paddingBottom: 23   ← padrão (simétrico)
height:       140   ← FIXO (garante mesma zona em todos os tipos)
overflow:  hidden
justifyContent: flex-start
```

### Exceções por tipo
| Tipo | Regra | Motivo |
|------|-------|--------|
| 14 (canvas/tracing) | `paddingBottom: 6` | mais espaço para o canvas |
| 14 (canvas/tracing) | `zoneAnswers: paddingTop: 0` | encosta canvas na zona azul |
| 15/16/17 (ouça e selecione) | usa `audioPromptArea` com `height: 140` | mesmo height, botão centralizado |

### `audioPromptArea` (tipos 15–17)
```
height:         140   ← igual ao promptArea
alignItems:   center
justifyContent: center
gap:              12
```

### Conteúdo da zona
- Kana: fontSize 44 · Noto Regular · fontWeight 500
- Romaji/texto: fontSize 32 · Inter Bold
- Legenda: 14px muted · marginTop 8px · sempre renderizada (opacity 0 quando ausente)
- Botão de áudio: `position: absolute, left: 0` · 44×44px · não afeta altura

## Botões de Resposta (MC)

## Botões de Resposta — MC
- height 56px · padding 12px 16px · radius R.md · border `T.border` 1.5px
- Correto: bg `T.okFaint` · border `T.ok` · texto `T.ok`
- Errado: bg `T.errFaint` · border `T.err` · texto `T.err`
- Outro: opacity 0.35

## Input de Digitação
- Input: height 52px · radius R.md · bg `T.surf` · font 17px
- Submit: 52×52px · radius R.md · bg `T.pri` · ícone `arrow-right`

## Tracing Canvas (type 14)
- **Toolbar** (fora do canvas): bg `#151421` · radius 20px top · padding 8px 10px
  - Botão olho: `eye` (guia oculto) / `eye-off` (guia visível) · 44×44px · bg `rgba(47,44,66,0.92)` · radius R.md
  - Botão reset: `refresh-ccw-01` · mesmo estilo
- **Canvas**: radius 20px bottom · flush com toolbar · bg `#151421`
- **Modo guiado**: ghost kana 38% opacidade · pontos numerados `T.pri`
- **Modo blind**: sem ghost kana · validação invisível
- **Regras difficulty**: easy → sempre guiado · normal → guiado 1ª vez, blind depois
- **Status bar**: minHeight 56px · margin-top 18px · radius R.lg

## Tracing — Progresso persistido
```js
// AsyncStorage key: 'tnk_tracing'
// Shape: { [romaji]: { tracingGuidedOk: boolean, tracingBlindOk: number, tracingErrors: number } }
// XP: XP_TRACING_GUIDED=2 (guiado) · XP_TRACING_BLIND=5 (blind)
```
