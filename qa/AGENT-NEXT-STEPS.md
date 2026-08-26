# Agent Next Steps

> Sprint activo únicamente — ver `qa/README.md → Sprint History` para lo ya completado.

## Estado del proyecto

| Módulo | Submódulo | Specs | Plan | Automatización | Estado |
|---|---|---|---|---|---|
| CAT (Catálogo) | LISTADO | ✅ (50 TC) | ✅ | ⬜ | ✅ Stage 3 completo (POM base ya existe: `page-objects/CatalogPage.ts`) |
| CAT (Catálogo) | DETALLE | ✅ (55 TC) | ✅ | ⬜ | ✅ Stage 3 completo |
| CARR (Carrito) | CARRITO | ✅ (55 TC) | ✅ | ⬜ | ✅ Stage 3 completo |

Setup del framework y del harness de automatización (`qa/07-automation/e2e/`) completo y verificado — ver `qa/README.md`.

## Checklist del sprint activo

- [x] **Stage 1** (`qa-module-analysis` skill): CAT/LISTADO y CAT/DETALLE analizados con exploración en vivo (playwright-cli) el 2026-08-26. Specs en `qa/01-specifications/module-catalogo/`. Se encontró 1 defecto (`DEF-001`, límite de cantidad no respetado al agregar) — ver `qa/06-defects/open/`.
- [x] Idem para CARR/CARRITO: analizado el 2026-08-26. Specs en `qa/01-specifications/module-carrito/`. Se encontró 1 defecto adicional (`DEF-002`, entrada de carrito con producto inexistente deja la UI inconsistente).
- [x] **Stage 2** (`qa-spec-generation`): revisado los 6 archivos de spec por submódulo (CAT y CARR, los 3 submódulos) el 2026-08-26. Se formalizaron 4 business rules adicionales en CAT (RN-CAT-013 a RN-CAT-016) y 1 workflow de rama de error que faltaba en LISTADO (FL-CAT-005); CARR ya cumplía el rango típico de RN/FL sin cambios. TC count sin cambios (50/55/55).
- [x] **Stage 3** (`qa-test-plan`): Plan de Pruebas Sprint 1 creado el 2026-08-26 para CAT (105 TCs, 7 suites) y CARR (55 TCs, 7 suites) — ver `qa/02-test-plans/sprints/Sprint-001/`. Sin ADO (deshabilitado): columna Confirma = N/A en todas las filas, trazabilidad sustituida por submódulo de origen + defectos.
- [ ] **Stage 5** (`qa-automation`): automatizar P0 primero (18 en CAT, 14 en CARR — ver Sección 4 de cada Plan de Pruebas). Recordar el gate de Step 5 (`tsc --noEmit` + smoke run) antes de cerrar. Los TCs ligados a `DEF-001`/`DEF-002` (7 en total, ver Sección 10 de cada plan) van con `test.fixme()` referenciando el defecto, no como fallos de la suite.

## Referencias de contexto

- `qa/memory/INDEX.md` — cargar antes de tocar cualquier archivo de memoria.
- `qa/memory/arquitectura-unicornstore-2026-08-26.md` — stack real, módulos, qué NO existe (sin login, sin API).
- `qa/01-specifications/module-catalogo/README.md` — resumen de hallazgos de Stage 1 para CAT.
- `qa/01-specifications/module-carrito/README.md` — resumen de hallazgos de Stage 1 para CARR.
- `qa/02-test-plans/sprints/Sprint-001/` — Planes de Pruebas Sprint 1 (CAT y CARR), fuente para Stage 5.
- `.github/skills/qa-automation/references/constitution.md` — reglas de código para `qa/07-automation/e2e/` (enforcement mecánico vía `.claude/scripts/enforce_constitution.py` + ESLint).
