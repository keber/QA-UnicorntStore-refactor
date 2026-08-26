# Agent Next Steps

> Sprint activo únicamente — ver `qa/README.md → Sprint History` para lo ya completado.

## Estado del proyecto

| Módulo | Submódulo | Specs | Plan | Automatización | Estado |
|---|---|---|---|---|---|
| CAT (Catálogo) | LISTADO | ✅ (50 TC) | ✅ | ⚠️ 10/50 (@P0) | ⚠️ Stage 5 en curso — P0 automatizado |
| CAT (Catálogo) | DETALLE | ✅ (55 TC) | ✅ | ⚠️ 8/55 (@P0) | ⚠️ Stage 5 en curso — P0 automatizado |
| CARR (Carrito) | CARRITO | ✅ (55 TC) | ✅ | ⚠️ 14/55 (@P0) | ⚠️ Stage 5 en curso — P0 automatizado |

Setup del framework y del harness de automatización (`qa/07-automation/e2e/`) completo y verificado — ver `qa/README.md`.

## Checklist del sprint activo

- [x] **Stage 1** (`qa-module-analysis` skill): CAT/LISTADO y CAT/DETALLE analizados con exploración en vivo (playwright-cli) el 2026-08-26. Specs en `qa/01-specifications/module-catalogo/`. Se encontró 1 defecto (`DEF-001`, límite de cantidad no respetado al agregar) — ver `qa/06-defects/open/`.
- [x] Idem para CARR/CARRITO: analizado el 2026-08-26. Specs en `qa/01-specifications/module-carrito/`. Se encontró 1 defecto adicional (`DEF-002`, entrada de carrito con producto inexistente deja la UI inconsistente).
- [x] **Stage 2** (`qa-spec-generation`): revisado los 6 archivos de spec por submódulo (CAT y CARR, los 3 submódulos) el 2026-08-26. Se formalizaron 4 business rules adicionales en CAT (RN-CAT-013 a RN-CAT-016) y 1 workflow de rama de error que faltaba en LISTADO (FL-CAT-005); CARR ya cumplía el rango típico de RN/FL sin cambios. TC count sin cambios (50/55/55).
- [x] **Stage 3** (`qa-test-plan`): Plan de Pruebas Sprint 1 creado el 2026-08-26 para CAT (105 TCs, 7 suites) y CARR (55 TCs, 7 suites) — ver `qa/02-test-plans/sprints/Sprint-001/`. Sin ADO (deshabilitado): columna Confirma = N/A en todas las filas, trazabilidad sustituida por submódulo de origen + defectos.
- [x] **Stage 5** (`qa-automation`), primera pasada — P0 automatizado el 2026-08-26: 32/32 TCs P0 (18 CAT + 14 CARR) con `test/expect` inyectados vía `fixtures/pom/test-options.ts`. Nuevos POM: `page-objects/ProductDetailPage.ts`, `page-objects/CartPage.ts` (+ fixtures registrados en `page-object-fixture.ts`). Specs: `tests/catalogo/listado.spec.ts`, `tests/catalogo/detalle.spec.ts`, `tests/carrito/carrito.spec.ts`. Gates verdes: `tsc --noEmit` (0 errores), `npm run lint` (0 warnings), smoke run 32/32 × 2 corridas consecutivas sin flake. Coverage mapping: `qa/07-automation/e2e/tests/{catalogo,carrito}/COVERAGE-MAPPING.md`.
  - **Hallazgo corregido durante la automatización**: el toast de "Agregar al carrito" en DETALLE no repite el mensaje genérico del listado — interpola el nombre del producto (`"¡{Nombre} agregado al carrito!"`). Stage 1/2 lo había documentado mal (asumido igual sin verificar byte a byte); corregido en `submodule-detalle/01-business-rules.md` (RN-CAT-016), `05-test-scenarios.md` (TC-CAT-DETALLE-038) y la fila correspondiente del Plan de Pruebas CAT. Gotchas técnicos de esta pasada (regex `getByText`, timing de `localStorage`, convención de asserts) documentados en `qa/memory/e2e-automation-patterns.md`.
- [ ] **Stage 5**, segunda pasada — automatizar P1-P3 (82 CAT + 41 CARR). Los 7 TCs ligados a `DEF-001`/`DEF-002` (ver Sección 10 de cada Plan de Pruebas) van con `test.fixme()` referenciando el defecto, no como fallos de la suite. Leer `qa/memory/e2e-automation-patterns.md` primero.
- [ ] Confirmar que `qa-e2e.yml` (CI) pasa en verde con los specs nuevos — todavía solo se corrió en local, nunca en un push/PR real ni `workflow_dispatch`.

## Referencias de contexto

- `qa/memory/INDEX.md` — cargar antes de tocar cualquier archivo de memoria.
- `qa/memory/arquitectura-unicornstore-2026-08-26.md` — stack real, módulos, qué NO existe (sin login, sin API).
- `qa/01-specifications/module-catalogo/README.md` — resumen de hallazgos de Stage 1 para CAT.
- `qa/01-specifications/module-carrito/README.md` — resumen de hallazgos de Stage 1 para CARR.
- `qa/02-test-plans/sprints/Sprint-001/` — Planes de Pruebas Sprint 1 (CAT y CARR), fuente para Stage 5.
- `qa/07-automation/e2e/tests/{catalogo,carrito}/COVERAGE-MAPPING.md` — qué TCs están automatizados vs. pendientes.
- `.github/skills/qa-automation/references/constitution.md` — reglas de código para `qa/07-automation/e2e/` (enforcement mecánico vía `.claude/scripts/enforce_constitution.py` + ESLint).
