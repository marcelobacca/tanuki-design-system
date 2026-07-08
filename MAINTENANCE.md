# Manutenção da documentação — regra viva

> **Comando permanente:** ao mudar algo no comportamento de uma tela, layout, exercício ou
> fluxo de sessão **no código do app** (`tanuki-native`), o `.md` correspondente **neste repo**
> precisa ser atualizado **no mesmo trabalho/PR**. Documentação desatualizada é considerada bug.

Esta documentação é um **contrato** que Codex, Claude Design e humanos usam para reproduzir e
alterar telas com fidelidade. Se ela mentir, os drafts saem errados.

## Mapa código → doc (o que atualizar quando mudar)

| Mudou no código (`tanuki-native`) | Atualize aqui |
|---|---|
| Tokens de cor/tipografia/espaçamento (`src/theme.js`) | `docs/index.md`, `docs/01-colors.md`, `styles.css`, `sections/01-colors.html` (regra dos 4 lugares) |
| Comportamento de sessão: timer, skip, feedback, avanço, `completeSession`, `buildSession` | `docs/layouts/L0-session-shell.md` |
| Um layout de tela (`src/features/exercises/layouts/*`, `src/components/numerals/*`) | `docs/layouts/L{n}-*.md` + a tabela em `docs/layouts/index.md` |
| Lógica de um exercício (`src/utils/questions/qN.js`, `src/utils/numerals/questions.js`) | `docs/exercises/*.md` + a tabela em `docs/exercises/index.md` |
| Gates/dificuldade/composição da sessão (`src/utils/session.js`) | `docs/layouts/L0-session-shell.md` + a coluna "Gate" em `docs/exercises/index.md` |
| Uma tela / navegação (`src/screens/*`, `src/navigation/*`) | `docs/screens/*` (fase 2) |

## Checklist ao criar/alterar um exercício ou tela

- [ ] O `.md` do **layout** usado está correto (anatomia, estados, props)?
- [ ] O exercício está na **tabela mestra** (`docs/exercises/index.md`) com layout, direção,
      distratores e gate?
- [ ] Se criei um **layout novo**, ele tem `docs/layouts/L{n}-*.md` e entrou no índice?
- [ ] Os **tokens** citados ainda existem em `src/theme.js` / `styles.css`?
- [ ] Nenhuma string, cor ou fonte foi hardcoded (i18n + tokens)?

## Automação
Um hook de aviso (configurado no `tanuki-native`) alerta quando arquivos de exercício/tela/tema
mudam sem que nenhum `.md` de documentação tenha sido tocado. O hook **lembra**, não corrige —
a atualização continua sendo responsabilidade de quem faz a mudança.
