# Bug Report — DEF-002: Entrada de carrito con producto inexistente deja la UI inconsistente

| Field | Value |
|-------|-------|
| Bug ID | DEF-002 |
| Title | El badge del carrito cuenta la `qty` de entradas cuyo `id` no existe en el catálogo (residual — ver Changelog v1.1) |
| Severity | Low |
| Priority | P3 |
| Status | Open (residual — defecto original corregido en el refactor) |
| Assigned to | Unassigned |
| Module | Carrito |
| Submodule | CARRITO |
| Environment | Detectado contra la versión pre-refactor (hoy en `https://unicornt-store-frontend.keberflores.workers.dev`); reconfirmado contra el refactor en `https://unicornt-store.keber.cl` el 2026-08-29 |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-08-26 |
| GitHub Issue | keber/unicornt-store-frontend#20 |
| ADO WI | N/A (ADO deshabilitado en este proyecto) |
| Related TCs | TC-CARR-CARRITO-056 (residual); TC-CARR-CARRITO-035, TC-CARR-CARRITO-036, TC-CARR-CARRITO-055 (defecto original, ahora pasan) |

---

## Description

Si `localStorage['unicornt_cart']` contiene una entrada cuyo `id` no corresponde a ningún
producto del catálogo actual (escenario realista si el catálogo cambia entre despliegues mientras
el carrito de un visitante persiste en su navegador), el offcanvas del carrito no renderiza
ninguna fila de producto ni tampoco el mensaje de "carrito vacío" — queda en un estado híbrido
donde el footer (Total + "Finalizar compra"/"Vaciar carrito") se muestra igual, con Total `$0`, y
el badge del botón "Carrito" sigue contando la cantidad de la entrada inválida.

---

## Steps to Reproduce

| Step | Action |
|------|--------|
| 1 | Navigate to `{{QA_BASE_URL}}/index.html` |
| 2 | Establecer `localStorage['unicornt_cart'] = '[{"id":9999,"qty":1}]'` (id inexistente) y recargar |
| 3 | Click en el botón "Carrito" |
| 4 | Observe `#cart-items`, `#cart-footer` y el badge del botón "Carrito" |

---

## Expected Result

El sistema debería, como mínimo, ignorar la entrada inválida y mostrar el estado de "carrito
vacío" (mensaje + footer oculto) si no queda ninguna entrada resoluble, o mostrar algún indicio
de que una línea no pudo cargarse. El badge no debería contar unidades de productos que no
existen.

---

## Actual Result

- `#cart-items` queda completamente vacío (ni filas de producto ni el mensaje "El carrito está
  vacío.").
- `#cart-footer` se muestra igual (no queda en `display:none`), con `#cart-total` = `"$0"`.
- El badge del botón "Carrito" muestra `"1"` (la `qty` de la entrada inválida).
- Click en "Finalizar compra" en este estado se completa "exitosamente": muestra el mismo toast
  `"¡Gracias por tu compra! Tu pedido está en camino. 🦄"` y deja `unicornt_cart = []`.

---

## Evidence

- Verificado interactivamente con `playwright-cli` (`eval`/`localstorage-list`) en esta sesión de
  exploración (2026-08-26). No se capturó screenshot.

---

## Root Cause Analysis

Bajo investigación. Hipótesis: el renderizado de `#cart-items` probablemente usa
`cart.map(item => products.find(p => p.id === item.id))` sin filtrar los `undefined` resultantes
antes de decidir si el carrito está "vacío" (esa decisión probablemente compara
`cart.length === 0`, que es `false` aunque ninguna línea sea renderizable). El total, en cambio,
probablemente sí filtra/ignora las entradas no resueltas al sumar (de ahí el `$0` en vez de
`NaN`).

---

## Fix Suggestion

Antes de decidir si mostrar el estado vacío, filtrar `unicornt_cart` contra el catálogo real y
usar la longitud del resultado filtrado (no la del array crudo). Idealmente, además, limpiar
silenciosamente las entradas huérfanas de `localStorage` al detectarlas.

---

## Impact on Automation

| TC ID | Current test state | Impact |
|-------|-------------------|--------|
| TC-CARR-CARRITO-056 | `test.fail()` — asevera badge oculto con solo entradas inválidas | Cuando se corrija #20, Playwright reporta "expected to fail — passed"; pasar a `test()` normal |
| TC-CARR-CARRITO-035 | `test()` normal — **pasa** (estado vacío + footer oculto) | Guarda de regresión del fix del defecto original |
| TC-CARR-CARRITO-036 | `test()` normal — **pasa** ("Finalizar compra" no disponible) | Idem |
| TC-CARR-CARRITO-055 | `test()` normal — **pasa** (Total `$0`) | Idem |

---

## Reactivation Instructions

Cuando se corrija el residual del badge (issue #20):
1. Cambiar `test.fail()` → `test()` en TC-CARR-CARRITO-056 (`tests/carrito/carrito.spec.ts`).
2. Ejecutar el test al menos 2 veces para confirmar estabilidad.
3. Mover este archivo a `06-defects/resolved/`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-08-26 | Bug reportado durante Stage 1 (module analysis) de CARR/CARRITO |
| 1.1 | 2026-08-29 | Reconfirmado contra el refactor (`keber.cl`). **Defecto original corregido**: el offcanvas con solo una entrada de `id` inexistente ahora muestra "El carrito está vacío.", oculta `#cart-footer` e impide "Finalizar compra" (TC-CARR-CARRITO-035/036 des-fixme'd, pasan como tests normales). **Residual**: `#cart-badge` sigue mostrando la `qty` de la entrada fantasma (`"1"`). Nuevo TC-CARR-CARRITO-056 (`test.fail()`). Reportado como issue keber/unicornt-store-frontend#20. |
