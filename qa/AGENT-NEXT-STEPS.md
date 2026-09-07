# Agent Next Steps

> Sprint activo únicamente — ver `qa/README.md → Sprint History` para lo ya completado.

## Estado del proyecto

| Módulo | Submódulo | Specs | Plan | Automatización (vs QA stack) | Estado |
|---|---|---|---|---|---|
| CAT | LISTADO | ✅ v1.1 | ✅ | ✅ 48 (2 OBSOLETE removed, 1 Bloqueado) · 1 `test.fail` DEF-001 | ✅ Stage 6 re-baselined |
| CAT | DETALLE | ✅ v1.1 | ✅ | ✅ 51 (1 OBSOLETE removed, 3 Bloqueado) · 3 `test.fail` DEF-001/003/007 | ✅ Stage 6 re-baselined |
| CARR | CARRITO | ✅ v1.1 | ✅ | ✅ 54 (2 OBSOLETE removed) · 4 `test.fail` 3×DEF-004/DEF-002 | ✅ Stage 6 re-baselined |

Target: **stack QA** (`unicornt-qa.keber.cl` + `api-unicornt-qa.keber.cl`). Última corrida local
2026-09-06: catalogo 98/98 · carrito 54/54 (0 fallos reales; los `test.fail` reportan como
expected-failure).

**Sprint 1 cerrado 2026-08-26** · **Stage 6 "green first" cerrado 2026-09-06** — ambos en
`qa/README.md → Sprint History`.

## Checklist del sprint activo

_Ningún sprint activo._ Stage 6 "green first" está completo (rama `stage6-green-first`, PR a `main`
pendiente de abrir). Lo que sigue es el **backlog de Sprint 2** — requiere decisión de scope del
dueño antes de arrancar.

## Stage 6 "green first" — completado 2026-09-06

Re-baseline de la suite CAT+CARR contra la app totalmente migrada (Vite + backend Spring/JWT).
Hecho:
- [x] Exploración en vivo del stack QA + lectura del contrato del backend
  (`unicornt-store-backend/docs/openapi.json`). Nueva memoria de arquitectura
  (`arquitectura-unicornstore-2026-09-06.md`); findings en
  `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`.
- [x] Specs alineadas a la verdad de terreno (v1.1): READMEs de módulo, `05-test-scenarios.md` de
  los 3 submódulos, `01-business-rules.md` de LISTADO/CARRITO, `04-test-data.md` de CARRITO.
  Escenarios muertos marcados `OBSOLETE-SCENARIO`.
- [x] Harness: target movido al stack QA (`QA_BASE_URL`/`QA_API_URL` en `.env`, `.env.example`,
  CI). Fixture `apiRequest` + `registerViaApi` + schemas Zod (`fixtures/api/`). `zod` agregado.
  `workers` local = 2. `.gitattributes` (eol=lf).
- [x] Page objects (Catalog/ProductDetail/Cart) y los 3 spec files reescritos para el catálogo
  async (20-de-49 + filtro por categoría), el checkout real y la carga async del detalle.
- [x] Defectos nuevos filados en `qa/06-defects/open/`: **DEF-004** (checkout roto, High),
  **DEF-007** (detalle solo resuelve ids 1–20, High), **DEF-005** (botones auth en inglés),
  **DEF-006** (`badge-tazon`). Guards `test.fail()` para DEF-004 (×3) y DEF-007.
- [x] Coverage report **en pausa**: `mcr.config.ts` / `coverage-fixture.ts` / `global-*.ts`
  desconectados (headers `PARKED`), job de coverage removido de CI, badge quitado del README.
- [x] Dashboards (`qa/README.md`, `README.md` raíz) + ambos `COVERAGE-MAPPING.md` sincronizados.

## Backlog de Sprint 2 (sin iniciar — requiere decisión de scope)

- [ ] **Abrir issues en `keber/unicornt-store-frontend`** para DEF-004 (High), DEF-005, DEF-006,
  DEF-007 (High). Priorizar el fix de DEF-004 y DEF-007 (rompen flujos core). `gh` outward-facing
  está bloqueado por el clasificador de auto-mode acá — el dueño los abre.
- [ ] **Módulo AUTH** (Stage 1→5): `login.html` / `register.html` / sesión JWT / `GET /auth/me`.
  Hoy solo hay un helper `registerViaApi` para los guards de checkout.
- [ ] **API de carrito del servidor** (`/api/v1/cart*`): `POST /cart/items`,
  `PUT/DELETE /cart/items/{id}`, `POST /cart/merge`, `GET /cart`. Funciona a nivel API; sin
  cobertura E2E ni de contrato.
- [ ] **Cobertura de catálogo API-driven**: filtro por las 10 categorías, parámetro `q` (búsqueda
  — existe en la API, sin UI), paginación (`page`/`size`), `GET /products/{id}` directo.
- [ ] **Capa de contract-tests** derivada de `docs/openapi.json` (auth / product / order / cart):
  suite `tests/api/` con los schemas Zod ya creados en `fixtures/api/schemas/`.
- [ ] **Restaurar el reporte de code coverage**: requiere que el build del frontend emita
  sourcemaps y sirva `src/`. Entonces reescribir `sourceFilter` de `mcr.config.ts` contra rutas
  `src/` reales, re-conectar `globalSetup`/`globalTeardown` en `playwright.config.ts` y
  `coverage-fixture` en `test-options.ts`, restaurar el job en `qa-e2e.yml` y el badge.
- [ ] Reescribir formalmente los workflows `FL-CARR-*` de checkout y crear TCs positivos para el
  flujo de orden real (hoy cubierto solo por los guards `test.fail()` de DEF-004).
- [ ] `qa-framework.config.json`: agregar el módulo AUTH a `modules` cuando se inicie ese sprint.
- [ ] Evaluar `qa-test-stabilization` tras acumular corridas de CI reales contra el stack QA.

## Referencias de contexto

- `qa/memory/INDEX.md` — cargar antes de tocar cualquier archivo de memoria.
- `qa/memory/arquitectura-unicornstore-2026-09-06.md` — **stack vigente** (Vite + backend JWT).
- `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md` — selectores, contrato API,
  lista de cambios por TC.
- `C:\Users\Usuario\Proyectos\unicornt-store-backend` — repo del backend; contrato en
  `docs/openapi.json` (idéntico al `/api-docs` en vivo de QA).
- `qa/07-automation/e2e/tests/{catalogo,carrito}/COVERAGE-MAPPING.md` — estado por TC.
- `.github/skills/qa-automation/references/constitution.md` + `type-safety-and-data-strategy.md`.
