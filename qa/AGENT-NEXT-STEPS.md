# Agent Next Steps

> Sprint activo únicamente — ver `qa/README.md → Sprint History` para lo ya completado.

## Estado del proyecto

| Módulo | Submódulo | Specs | Plan | Automatización | Estado |
|---|---|---|---|---|---|
| CAT (Catálogo) | LISTADO | ✅ (50 TC) | ✅ | ✅ 49/50 (1 Bloqueado, confirmado fuera de alcance) | ✅ Stage 5 P0+P1-P3 automatizado |
| CAT (Catálogo) | DETALLE | ✅ (55 TC) | ✅ | ✅ 52/55 (3 Bloqueado, confirmado fuera de alcance) | ✅ Stage 5 P0+P1-P3 automatizado |
| CARR (Carrito) | CARRITO | ✅ (55 TC) | ✅ | ✅ 55/55 | ✅ Stage 5 P0+P1-P3 automatizado |

Setup del framework y del harness de automatización (`qa/07-automation/e2e/`) completo y verificado — ver `qa/README.md`. CI verificado en verde: [GitHub Actions run](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33004443001) (150 passed, 6 skipped, lint + tsc clean), repo en `keber/QA-UnicorntStore-refactor`.

**Sprint 1 cerrado el 2026-08-26** — checklist completo movido a `qa/README.md → Sprint History`.

## Checklist del sprint activo

_Ningún sprint activo — Sprint 1 (CAT + CARR regression baseline) está completo. Ambos pendientes
que quedaban (verificación de CI en push real, y decisión de negocio sobre los 4 TCs `Bloqueado`)
se resolvieron el 2026-08-26; ver `qa/README.md → Sprint History` para el detalle._

Próximos candidatos para un Sprint 2 (sin iniciar, requieren decisión de scope):
- [ ] Ampliar automatización a otros módulos de la app (fuera de CAT/CARR) si existen.
- [ ] Decidir si `DEF-001`/`DEF-002`/`DEF-003` se priorizan para fix — actualmente abiertos y
  documentados como comportamiento conocido (`test.fixme()` en la suite).
- [ ] Evaluar `qa-test-stabilization` sobre la suite tras acumular corridas de CI reales
  (actualmente 1 sola corrida en `main`, sin historial de flake en CI todavía).

## Referencias de contexto

- `qa/memory/INDEX.md` — cargar antes de tocar cualquier archivo de memoria.
- `qa/memory/arquitectura-unicornstore-2026-08-26.md` — stack real, módulos, qué NO existe (sin login, sin API).
- `qa/01-specifications/module-catalogo/README.md` — resumen de hallazgos de Stage 1 para CAT.
- `qa/01-specifications/module-carrito/README.md` — resumen de hallazgos de Stage 1 para CARR.
- `qa/02-test-plans/sprints/Sprint-001/` — Planes de Pruebas Sprint 1 (CAT y CARR), fuente para Stage 5.
- `qa/07-automation/e2e/tests/{catalogo,carrito}/COVERAGE-MAPPING.md` — qué TCs están automatizados vs. pendientes.
- `.github/skills/qa-automation/references/constitution.md` — reglas de código para `qa/07-automation/e2e/` (enforcement mecánico vía `.claude/scripts/enforce_constitution.py` + ESLint).
