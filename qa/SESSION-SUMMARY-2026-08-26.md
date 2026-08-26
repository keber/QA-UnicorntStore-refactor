# Session Summary — 2026-08-26 (Stage 1 + Stage 2 + Stage 3 + Stage 5 (P0): CAT + CARR)

## Modules analyzed

- Catálogo (CAT)
- Carrito (CARR)

## Submodules documented

| Submodule | Code | TC count | Notes |
|-----------|------|----------|-------|
| Listado de productos | CAT/LISTADO | 50 | 1 hallazgo de defecto (DEF-001, límite de cantidad) |
| Detalle de producto | CAT/DETALLE | 55 | Mismo defecto DEF-001 confirmado desde 2 rutas de entrada |
| Carrito de compras (offcanvas) | CARR/CARRITO | 55 | 1 hallazgo de defecto adicional (DEF-002, entrada de carrito con producto inexistente) |

## Files created

- `qa/01-specifications/module-catalogo/README.md` + 2 submódulos (LISTADO, DETALLE), 6 archivos c/u
- `qa/01-specifications/module-carrito/README.md` + submódulo CARRITO, 6 archivos
- `qa/06-defects/open/DEF-001-limite-maximo-cantidad-no-respetado-al-agregar.md`
- `qa/06-defects/open/DEF-002-entrada-de-carrito-con-producto-inexistente-deja-ui-inconsistente.md`
- Actualizados: `qa/00-standards/naming-conventions.md`, `qa/README.md`, `qa/AGENT-NEXT-STEPS.md`

## Blockers

Ninguno bloqueante. Varios TCs quedaron `PENDING-BROWSER` (teclado, responsive, doble-click,
scroll con muchas líneas) por no haberse ejercitado explícitamente en esta sesión — se pueden
confirmar directamente al automatizar (Stage 5). Algunos quedaron `PENDING-CODE` (categoría
"Tazón", variantes de producto, reseñas, productos relacionados) porque esas features no existen
en la app actual.

## Stage 2 review (same session)

Se revisaron los 6 archivos de spec de los 3 submódulos contra las reglas de
`qa-spec-generation`. Cambios aplicados:

- CAT/LISTADO: +2 business rules (RN-CAT-013 visibilidad del badge, RN-CAT-014 continuidad de
  `id` 1–49) y +1 workflow de rama de error (FL-CAT-005, agregar sobre un ítem ya en el máximo).
- CAT/DETALLE: +2 business rules (RN-CAT-015 el selector de cantidad no persiste entre recargas,
  RN-CAT-016 reuso de toast/badge con el listado).
- CARR/CARRITO: revisado, ya cumplía el rango típico de RN (11) y las 3 ramas de workflow
  obligatorias (happy path, cancelación, error) — sin cambios.
- Ningún TC nuevo fue necesario: las reglas agregadas ya estaban cubiertas por TCs existentes de
  Stage 1, solo faltaba formalizarlas como RN/FL.

## Stage 3 (same session)

Se generó el Plan de Pruebas Sprint 1 para ambos módulos, uno por módulo (convención
"Multi-Module Sprint" del skill):

- `qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md`
  — 105 TCs (LISTADO + DETALLE) en 7 suites funcionales.
- `qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CARR.md`
  — 55 TCs en 7 suites funcionales.

Reglas aplicadas: `[SMOKE]` solo para TCs `Type≠Negative` con `Priority=P0`; todo lo demás
`[REGRESION]` (coherente con el propósito del proyecto: capturar línea base para el refactor).
`Tipo=Bloqueado` únicamente para los 4 TCs `PENDING-CODE` de CAT. Sin ADO: columna `Confirma` =
`N/A` en las 160 filas, trazabilidad sustituida por submódulo de origen y por defecto
(`DEF-001`/`DEF-002`). Los pasos que en la spec original tenían un solo paso se expandieron a 2
(acción + verificación explícita) para cumplir el gate de la plantilla. Todas las 160 TCs de
Stage 1/2 quedaron representadas 1:1 en las tablas (verificado programáticamente, sin duplicados
ni faltantes).

## Stage 5 — automatización P0 (same session)

Decisión del usuario: DEF-001 y DEF-002 no se corrigen antes de automatizar. Se automatizaron
las 32 TCs P0 (18 CAT + 14 CARR) tomando las Tablas de Pruebas del Plan de Pruebas Sprint 1 como
fuente, no las specs de Stage 1/2 directamente.

**Archivos nuevos**:
- `page-objects/ProductDetailPage.ts`, `page-objects/CartPage.ts` (+ fixtures en
  `fixtures/pom/page-object-fixture.ts`) — POM por submódulo, inyectados vía DI, sin
  `new PageObject(page)` en los specs (Constitution MUST: Dependency Injection).
- `tests/catalogo/listado.spec.ts` (10 TCs), `tests/catalogo/detalle.spec.ts` (8 TCs),
  `tests/carrito/carrito.spec.ts` (14 TCs) — todas `@P0`, `import { test, expect } from
  '../../fixtures/pom/test-options'`.
- `tests/catalogo/COVERAGE-MAPPING.md`, `tests/carrito/COVERAGE-MAPPING.md` — las 160 TCs con su
  estado (✅ Automated / 🔲 Pending / 🔲 Bloqueado).

**Gates (todos verdes, Step 5 de `qa-automation`)**: `npx tsc --noEmit` (0 errores), `npm run
lint` (0 warnings tras arreglar `no-raw-locators`, `prefer-lowercase-title`, `expect-expect` y
formato Prettier), smoke run `npx playwright test tests/catalogo tests/carrito --project=chromium`
32/32 en 2 corridas consecutivas (0 flake).

**Hallazgo real corregido durante la automatización**: el toast de "Agregar al carrito" en
DETALLE **no** repite el mensaje genérico del listado (`"¡Producto agregado al carrito!"`) —
interpola el nombre del producto (`"¡Polera 'X' agregado al carrito!"`). Stage 1/2 lo había
documentado como idéntico al del listado sin verificarlo byte a byte; el test automatizado lo
hizo fallar y expuso el error. Corregido en:
- `submodule-detalle/01-business-rules.md` (RN-CAT-016)
- `submodule-detalle/05-test-scenarios.md` (TC-CAT-DETALLE-038)
- La fila correspondiente del Plan de Pruebas CAT (fila 46)
- `COVERAGE-MAPPING.md` de catálogo (título de TC-038 actualizado)

Otro ajuste técnico descubierto: Playwright's regex-based `getByText()` matches the *raw*
(non-trimmed) text content of candidate DOM nodes, not the whitespace-normalized version — a
`^...$`-anchored regex against a `<p>` with surrounding newlines/indentation never matches.
Fixed by dropping the anchors (substring match) instead of anchoring.

**Pendiente**: automatizar P1-P3 (82 CAT + 41 CARR) en una pasada siguiente. Los 7 TCs ligados a
DEF-001/DEF-002 (ver Sección 10 de cada Plan de Pruebas) van con `test.fixme()` cuando se
automaticen. CI (`qa-e2e.yml`) corre lint + tsc + `playwright test` en cada push/PR a `main` —
no se ha verificado ahí todavía, solo localmente.
