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

## Mantenimiento pendiente (refactor frontend) — detectado 2026-08-29

El refactor del frontend incorporó comportamiento nuevo en la UI para preparar la integración con
backend. Eso dejó **7 tests obsoletos** que fallaban en CI. Se aplicó `test.fixme()` a los 7 para
destrabar CI (comportamiento **aún en flujo**, backend no conectado — no se reescriben todavía):

| TC | Aseguraba (comportamiento viejo) | Realidad tras el refactor |
|---|---|---|
| TC-CARR-CARRITO-027 @P0 | "Finalizar compra" vacía el carrito client-side | Ya no lo vacía (flujo real, espera backend) |
| TC-CARR-CARRITO-029 @P0 | Toast "¡Gracias por tu compra!" | Toast eliminado |
| TC-CARR-CARRITO-031 @P0 | Sin backend / 0 llamadas `/api/` | Integración con backend introducida |
| TC-CARR-CARRITO-028 @P1 | "Finalizar compra" cierra el offcanvas | Ya no lo cierra |
| TC-CARR-CARRITO-030 @P1 | Sin nº de orden / confirmación (vía toast viejo) | Toast eliminado; puede haber confirmación real |
| TC-CARR-CARRITO-048 @P1 | No existe paso de checkout real | Existe (campo dirección/envío visible) |
| TC-CAT-LISTADO-039 @P2 | No existe formulario de contacto real | Existe un `<form>` real |

Cuando el comportamiento nuevo estabilice, ejecutar **Stage 6 (`qa-maintenance`)**:
- [ ] Actualizar specs primero (spec = ground truth): `qa/01-specifications/module-carrito/` y
  `module-catalogo/` — hoy afirman "sin checkout real, sin formulario de contacto, sin API".
- [ ] Actualizar `qa/memory/arquitectura-unicornstore-2026-08-26.md` → sección "Lo que NO existe"
  (formulario de contacto y checkout real ya no aplican).
- [ ] Grupo B (resultado esperado cambió, escenario sigue válido): reescribir TC-CARR-CARRITO-027
  /028/029/030 contra el flujo nuevo de "Finalizar compra".
- [ ] Grupo A (escenario obsoleto): marcar TC-CARR-CARRITO-031/048 y TC-CAT-LISTADO-039 como
  `OBSOLETE` en el índice (conservar archivos) y crear TCs positivos nuevos para el formulario de
  contacto y el flujo de checkout con backend.
- [ ] Actualizar Plan de Pruebas Sprint-001 y `COVERAGE-MAPPING.md` de ambos módulos.
- [ ] **Reparar el reporte de code coverage (sale en 0 desde el refactor).** El refactor pasó a
  Vite: el sitio ya no sirve `/assets/js/{app,cart,products}.js` + `/assets/css/main.css` sino
  bundles con hash bajo `/assets/` (`main-*.js`, `cart.view-*.js`, `cart-*.css`). El
  `entryFilter`/`sourceFilter` de `mcr.config.ts` (regex `/\/assets\/(js|css)\//`) ya no matchea
  nada → MCR genera un reporte vacío (todo 0) sin fallar el pipeline. Para arreglarlo:
  (1) habilitar sourcemaps en el build del frontend (`build.sourcemap: true`);
  (2) reescribir `sourceFilter` contra las rutas reales de `src/` del repo del frontend, no
  contra el bundle minificado; (3) confirmar dónde quedó Bootstrap (si se bundleó dentro de
  `main-*.js` hay que excluirlo para no contar código de terceros). El comentario de
  `mcr.config.ts` que dice "unminified, unbundled vanilla JS ... no sourcemap wiring needed"
  quedó obsoleto — actualizarlo. Ver `qa/07-automation/e2e/global-{setup,teardown}.ts` y
  `fixtures/coverage-fixture.ts` para el resto del wiring (no cambian).

Próximos candidatos para un Sprint 2 (sin iniciar, requieren decisión de scope):
- [ ] Ampliar automatización a otros módulos de la app (fuera de CAT/CARR) si existen.
- [x] `DEF-001`/`DEF-002`/`DEF-003` reconfirmados contra el refactor (`keber.cl`) el 2026-08-29 y
  reportados en `keber/unicornt-store-frontend` (#19 DEF-001 escenario B, #20 DEF-002 residual del
  badge, #21 DEF-003). Los TCs que los demuestran pasaron de `test.fixme()` a `test.fail()`;
  TC-CAT-DETALLE-018 y TC-CARR-CARRITO-035/036 des-fixme'd (corregidos en el refactor). Pendiente:
  decidir priorización de fix de los 3 issues abiertos.
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
