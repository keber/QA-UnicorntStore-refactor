# Coverage Mapping — Catálogo (CAT)

**Plan de Pruebas**: `qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md`

## Summary

| Submódulo | Total | Automated | OBSOLETE (removed) | `test.fail()` guards | Bloqueado |
|---|---|---|---|---|---|
| LISTADO | 50 | 48 | 2 (TC-039, TC-040) | 1 (TC-027 → DEF-001) | 1 |
| DETALLE | 55 | 51 | 1 (TC-037) | 3 (TC-022 → DEF-001, TC-047 → DEF-003, TC-033 → DEF-007) | 3 |
| **Total** | **105** | **99** | **3** | **4** | **4** |

**Stage 6 "green first" (2026-09-06)** — re-baselined against the QA stack
(`unicornt-qa.keber.cl` + `api-unicornt-qa.keber.cl`). The catalog now loads from
`GET /api/v1/products` and the default view renders **20 of 49** products (API page 0, no
pagination UI); a `#category-filter` <select> re-queries by slug. Changes:
- **Removed** (`OBSOLETE-SCENARIO`): TC-CAT-LISTADO-039 (no contact `<form>`),
  TC-CAT-LISTADO-040 / TC-CAT-DETALLE-037 (no `/api` calls).
- **Inverted**: TC-CAT-LISTADO-014 (a category filter now exists). TC-CAT-LISTADO-012/016
  reworked around the filter.
- **New `test.fail()` guard**: TC-CAT-DETALLE-033 → **DEF-007** (`product.html` only resolves
  ids 1–20). Existing guards TC-CAT-LISTADO-027 / TC-CAT-DETALLE-022 (DEF-001) and
  TC-CAT-DETALLE-047 (DEF-003) unchanged, re-verified on QA.
`tsc --noEmit` + `eslint` clean; live run 98/98 (catalogo dir).
The 4 `Bloqueado` TCs (features absent from the app) stay out of scope by business decision
(2026-08-26).

> Note: the first-pass version of this table double-counted `DETALLE`'s `Bloqueado` row (listed
> 4, actually 3: TC-CAT-DETALLE-050/051/052 - TC-CAT-DETALLE-053 is `Automatizado`, not
> `Bloqueado`, per the Plan de Pruebas). Corrected here during the second automation pass.

## LISTADO

| TC ID | Title | Spec file | Playwright spec | Status |
|-------|-------|-----------|----------------|--------|
| TC-CAT-LISTADO-001 | La página carga con el título correcto en la pestaña | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-002 | El header muestra logo, navegación y botón Carrito | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-003 | El skip link enfoca el contenido principal | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-004 | La sección de catálogo muestra el heading "Nuestros productos" | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-005 | El catálogo renderiza exactamente 49 productos | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-006 | Cada tarjeta muestra una imagen con `alt` igual al nombre del producto | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-007 | Cada tarjeta muestra el badge de categoría "Polera" | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-008 | Cada tarjeta muestra nombre, descripción y precio | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-009 | El precio se muestra en formato CLP `"$XX.990"` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-010 | Cada tarjeta incluye "Ver más" y "Agregar" | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-011 | El primer producto de la grilla es id=1 | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-012 | Filtrar por categoría "QA" muestra sus 2 productos (ids 48 y 49) | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) — reworked around the category filter |
| TC-CAT-LISTADO-013 | No se observa ningún producto de categoría "Tazón" | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | — | 🔲 Bloqueado (PENDING-CODE) |
| TC-CAT-LISTADO-014 | Existe un filtro por categoría (re-consulta la API); no hay buscador ni paginación | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) — inverted (filter now exists) |
| TC-CAT-LISTADO-015 | "Ver más" del primer producto navega a `product.html?id=1` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-016 | "Ver más" del producto id=49 (vía filtro QA) enlaza a `product.html?id=49` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) — href only; detalle roto por DEF-007 (TC-CAT-DETALLE-033) |
| TC-CAT-LISTADO-017 | El enlace "Ver más" tiene un ícono decorativo y texto accesible | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-018 | Volver desde el detalle regresa al listado con estado intacto | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-019 | "Agregar" crea una entrada nueva en `unicornt_cart` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-020 | "Agregar" muestra el toast de confirmación | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-021 | El toast usa estilo de éxito | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-022 | El toast se puede cerrar manualmente | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-023 | El toast se auto-oculta sin interacción | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-024 | El badge del botón "Carrito" pasa de sin badge a "1" | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-025 | El badge acumula la cantidad total de ítems, no solo líneas | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-026 | Click repetido en "Agregar" incrementa qty en vez de duplicar la entrada | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-027 | [DEFECTO] "Agregar" sobre un ítem ya en el máximo supera el límite de 99 | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-001 #19) @P1 |
| TC-CAT-LISTADO-028 | El carrito persiste tras recargar el listado | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-029 | El carrito persiste al navegar listado → detalle → listado | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-030 | Sin ítems en el carrito, el botón "Carrito" no muestra badge | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-031 | El botón "Carrito" abre el offcanvas del carrito | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-032 | El enlace "Inicio" navega a `index.html` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-033 | El enlace "Contacto" navega al ancla `#contacto` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-034 | El footer muestra la descripción de la tienda | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-035 | Los enlaces de "Política de privacidad" y "Términos" son placeholders | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-036 | El footer muestra dirección, email y teléfono como texto estático | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-037 | Los íconos de redes sociales son placeholders | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-038 | El footer muestra el aviso de copyright | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-039 | No existe ningún formulario de contacto real | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | — | 🗑️ OBSOLETE-SCENARIO (Stage 6) — removed |
| TC-CAT-LISTADO-040 | No se observan llamadas de red a `/api` | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | — | 🗑️ OBSOLETE-SCENARIO (Stage 6) — el listado ahora depende de la API; removed |
| TC-CAT-LISTADO-041 | No existe ningún control de login/registro en el header | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P0) |
| TC-CAT-LISTADO-042 | El botón "Agregar" es accesible por teclado | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-043 | El heading "Nuestros productos" mantiene jerarquía correcta | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-044 | La consola no muestra errores críticos de aplicación al cargar | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-045 | El grid de productos se renderiza en viewport móvil | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-046 | La cantidad de tarjetas visibles no cambia con el viewport | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |
| TC-CAT-LISTADO-047 | Agregar el mismo producto desde listado y desde detalle acumula correctamente | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P1) |
| TC-CAT-LISTADO-048 | El `id` de "Ver más" coincide con el orden de renderizado (1..49) | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-049 | El badge vuelve a "sin conteo" tras vaciar el carrito | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P2) |
| TC-CAT-LISTADO-050 | Descripciones largas no rompen el layout de la tarjeta | qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md | tests/catalogo/listado.spec.ts | ✅ Automated (@P3) |

## DETALLE

| TC ID | Title | Spec file | Playwright spec | Status |
|-------|-------|-----------|----------------|--------|
| TC-CAT-DETALLE-001 | Navegar a un `id` válido carga el detalle correcto | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-002 | El breadcrumb muestra "Inicio / {nombre del producto}" | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-003 | El breadcrumb "Inicio" navega a `index.html` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-004 | La imagen del producto tiene `alt` correcto | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-005 | El nombre del producto se muestra como heading h1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-006 | El precio se muestra en formato `"$XX.990"` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-007 | La descripción completa del producto se muestra | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-008 | El selector de cantidad inicia en 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-009 | "Aumentar cantidad" incrementa el valor en 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-010 | "Reducir cantidad" decrementa el valor en 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-011 | "Reducir cantidad" no decrementa por debajo de 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-012 | "Aumentar cantidad" no incrementa por sobre 99 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-013 | El input de cantidad expone `min="1"` y `max="99"` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-014 | Editar la cantidad a un valor válido y agregar refleja esa cantidad | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-015 | Cantidad `0` al agregar se sanea a 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-016 | Cantidad negativa al agregar se sanea a 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-017 | Cantidad vacía al agregar se sanea a 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-018 | Cantidad > 99 al agregar se clampea a 99 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) — era DEF-001 esc. A, corregido en el refactor |
| TC-CAT-DETALLE-019 | El input de cantidad no acepta letras vía tipeo directo | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-020 | "Agregar al carrito" crea la entrada en `localStorage` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-021 | Agregar desde el detalle sobre un producto ya en el carrito acumula la cantidad | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-022 | [DEFECTO] Agregar desde el detalle sobre un ítem ya en 99 supera el límite | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-001 #19) @P1 |
| TC-CAT-DETALLE-023 | "Volver" navega a `index.html` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-024 | `id` fuera de rango redirige silenciosamente al listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P0) |
| TC-CAT-DETALLE-025 | `id` no numérico redirige silenciosamente al listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-026 | `id` ausente redirige silenciosamente al listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-027 | `id=0` redirige silenciosamente al listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-028 | `id` negativo redirige silenciosamente al listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-029 | `id=50` (uno por sobre el último válido) redirige silenciosamente | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-030 | `id="01"` (cero a la izquierda) resuelve al producto 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-031 | `id="1.5"` (decimal) resuelve al producto 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-032 | `id=1` (primer producto válido) renderiza correctamente | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-033 | [DEFECTO] `id=49` (último producto válido) renderiza correctamente | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-007) @P1 |
| TC-CAT-DETALLE-034 | El header en detalle mantiene los mismos enlaces que en listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-035 | "Contacto" en detalle navega a `index.html#contacto` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-036 | El footer en detalle es idéntico al del listado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P3) |
| TC-CAT-DETALLE-037 | No se observan llamadas de red a `/api` al cargar el detalle | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | — | 🗑️ OBSOLETE-SCENARIO (Stage 6) — el detalle ahora depende de la API; removed |
| TC-CAT-DETALLE-038 | El toast de confirmación también aparece al agregar desde el detalle, con el nombre del producto interpolado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-039 | El badge del botón "Carrito" se actualiza al agregar desde el detalle | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-040 | El carrito persiste tras recargar la página de detalle | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-041 | "Aumentar cantidad" es accesible por teclado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-042 | El spinbutton de cantidad tiene `aria-label="Cantidad"` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-043 | Los botones +/- tienen `aria-label` descriptivo | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-044 | Recargar la página reinicia la cantidad seleccionada a 1 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-045 | Doble click rápido en "Aumentar cantidad" incrementa exactamente 2 | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P3) |
| TC-CAT-DETALLE-046 | Cambiar el `id` en la URL actualiza el detalle al nuevo producto | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-047 | El detalle en viewport móvil no desborda horizontalmente | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-003 #21) @P3 |
| TC-CAT-DETALLE-048 | Precio y nombre coinciden entre listado y detalle para el mismo `id` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-049 | Descripción coincide entre listado y detalle para el mismo `id` | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
| TC-CAT-DETALLE-050 | No existe selector de talla/color/variante | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | — | 🔲 Bloqueado (PENDING-CODE) |
| TC-CAT-DETALLE-051 | No existe sección de reseñas/calificaciones | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | — | 🔲 Bloqueado (PENDING-CODE) |
| TC-CAT-DETALLE-052 | No existe sección de "productos relacionados" | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | — | 🔲 Bloqueado (PENDING-CODE) |
| TC-CAT-DETALLE-053 | La consola no muestra errores críticos de aplicación al cargar el detalle | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-054 | Agregar productos distintos desde sus detalles crea entradas independientes | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P1) |
| TC-CAT-DETALLE-055 | El botón "Agregar al carrito" es accesible por teclado | qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md | tests/catalogo/detalle.spec.ts | ✅ Automated (@P2) |
