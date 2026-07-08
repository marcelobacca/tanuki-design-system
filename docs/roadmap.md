# Roadmap — evolução do Design System

Checklist vivo da reforma do DS (visão Geist na doc + shadcn na organização dos componentes).
Fonte da verdade: este repo (`~/tanuki-design-system`). Executamos 1 a 1.

> **Escopo atual: Fases 0 → 2.** Fase 3 em diante fica para depois (tem decisões por componente).

## FASE 0 — Consolidação (fonte única) ✅
- [x] 0.1 `CLAUDE.md` e `design-system-context.md` do app apontando pro repo standalone (URL nova).
- [x] 0.2 Remover o server local `design-system` do `launch.json` (deploy é automático).
- [x] 0.3 Cópia embutida `tanuki-native/design-system/` → README-stub apontando pra cá.
- [x] 0.4 Deletar o deploy antigo `taupe-gamma` no Vercel.

## FASE 1 — Reestrutura da doc (Geist + shadcn)
- [ ] 1.1 Nota de escopo **descritiva** no topo: app nativo RN (iOS/Android), cozy, dark, mobile-first.
      Foundations e componentes são **reaproveitáveis** (inclusive p/ web um dia) — não proibir, só contextualizar.
- [ ] 1.2 Arquitetura em **4 áreas**: Foundations · Components · Mobile Patterns · Approved Screens (remapear seções atuais + sidebar).
- [ ] 1.3 Novo **layout visual** estilo Geist (limpo, espaçoso), identidade Tanuki (dark surf/surf2/pri),
      **já preparado para um toggle light/dark** (CSS vars + `[data-theme]`).
- [ ] 1.4 Componente **mobile frame** (mock de celular) reutilizável para os exemplos.
- [ ] 1.5 **Formato-padrão de página de componente**: exemplo no frame · quando usar · variantes · estados · tokens · regra · "do not" · ref RN.

## FASE 2 — Foundations (absorve limpezas A5/B6/C3)
- [ ] 2.1 Colors — reorganizar + **B6** (grupo decorativo: aurora, flame/streak).
- [ ] 2.2 Typography — **A5** (tirar 15/17px do showcase; escala par) + documentar escala.
- [ ] 2.3 Spacing & Radius — **C3** (nomear raios) + escala de espaçamento.
- [ ] 2.4 Icons (Untitled UI) · 2.5 Shadows/elevation + Motion (documentar ou marcar gap).

## FASE 3+ — depois (não agora)
- Components (shadcn) · Mobile Patterns · Approved Screens · Regras de consistência · Light mode (Claude Design) · Aplicar no app.
