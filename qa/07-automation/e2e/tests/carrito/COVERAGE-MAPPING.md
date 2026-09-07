# Coverage Mapping — Carrito (CARR)

**Plan de Pruebas**: `qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CARR.md`

## Summary

| Submódulo | Total | Automated | OBSOLETE (removed) | `test.fail()` guards |
|---|---|---|---|---|
| CARRITO | 56 | 54 | 2 (TC-030, TC-031) | 4 (TC-027/028/029 → DEF-004, TC-056 → DEF-002) |

**Stage 6 "green first" (2026-09-06)** — re-baselined against the QA stack
(`unicornt-qa.keber.cl` + `api-unicornt-qa.keber.cl`). Guest cart ops unchanged. Checkout is a
real `POST /api/v1/orders` flow but broken end-to-end (**DEF-004**): TC-027/028/029 are now
`test.fail()` guards asserting the correct post-checkout state. TC-030/031 removed
(`OBSOLETE-SCENARIO` — premises inverted by the backend). TC-048 rewritten as positive
checkout-form coverage. `tsc --noEmit` + `eslint` clean; live run 54/54.

## CARRITO

| TC ID | Title | Spec file | Playwright spec | Status |
|-------|-------|-----------|----------------|--------|
| TC-CARR-CARRITO-001 | El botón "Carrito" abre el offcanvas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-002 | El offcanvas muestra el título "Tu carrito" con ícono | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P3) |
| TC-CARR-CARRITO-003 | El botón "Cerrar" (X) cierra el offcanvas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-004 | Presionar Escape cierra el offcanvas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-005 | Click en el backdrop cierra el offcanvas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-006 | Con carrito vacío se muestra el mensaje de "carrito vacío" | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-007 | Con carrito vacío el footer (Total + acciones) está oculto | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-008 | Una línea de producto muestra imagen, nombre y precio unitario | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-009 | La línea muestra el subtotal = precio unitario × cantidad | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-010 | El total es la suma de los subtotales de todas las líneas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-011 | El total se recalcula al cambiar una cantidad | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-012 | El botón "+" incrementa la cantidad en 1 | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-013 | El botón "−" decrementa la cantidad en 1 (qty > 1) | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-014 | El botón "−" en qty=1 elimina la línea completa | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-015 | El botón "+" no incrementa por sobre 99 | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-016 | Editar manualmente a un valor válido actualiza la cantidad | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-017 | Editar manualmente a `0` sanea a 1 | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-018 | Editar manualmente a un valor negativo sanea a 1 | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-019 | Editar manualmente a vacío sanea a 1 | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-020 | Editar manualmente a un valor > 99 clampea a 99 | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-021 | "Eliminar" quita la línea completa | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-022 | "Eliminar" no requiere confirmación | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-023 | "Vaciar carrito" elimina todas las líneas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P0) |
| TC-CARR-CARRITO-024 | "Vaciar carrito" no requiere confirmación | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-025 | Tras vaciar el carrito, vuelve el estado vacío | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-026 | El badge desaparece tras vaciar el carrito | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-027 | [DEFECTO] "Finalizar compra" confirma la orden y vacía el carrito | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-004) @P0 |
| TC-CARR-CARRITO-028 | [DEFECTO] "Finalizar compra" no muestra error de submit al confirmar | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-004) @P1 |
| TC-CARR-CARRITO-029 | [DEFECTO] "Finalizar compra" crea una orden real (`GET /orders`) | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-004) @P0 |
| TC-CARR-CARRITO-030 | "Finalizar compra" no genera número de orden ni confirmación | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | — | 🗑️ OBSOLETE-SCENARIO (Stage 6) — premisa invertida por el backend |
| TC-CARR-CARRITO-031 | "Finalizar compra" no persiste ni envía la "compra" a ningún lado | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | — | 🗑️ OBSOLETE-SCENARIO (Stage 6) — premisa "sin backend" muerta |
| TC-CARR-CARRITO-032 | El carrito con múltiples ítems distintos renderiza todas las líneas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-033 | El carrito es idéntico entre `index.html` y `product.html` | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-034 | El carrito persiste tras recargar la página | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-035 | Una entrada con producto inexistente muestra el estado vacío y oculta el footer | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) — era DEF-002, corregido en el refactor |
| TC-CARR-CARRITO-036 | "Finalizar compra" no está disponible sobre un carrito solo con entrada inválida | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) — era DEF-002, corregido en el refactor |
| TC-CARR-CARRITO-037 | La imagen de cada línea tiene `alt` igual al nombre del producto | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-038 | El precio unitario incluye el sufijo "c/u" | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P3) |
| TC-CARR-CARRITO-039 | El formato de precio es consistente con listado/detalle | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-040 | El botón "Eliminar" tiene `aria-label="Eliminar"` | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-041 | Los botones +/- tienen `aria-label` "Reducir"/"Aumentar" | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-042 | El input de cantidad tiene `aria-label="Cantidad"` | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P3) |
| TC-CARR-CARRITO-043 | El offcanvas expone `role="dialog"` y `aria-modal="true"` | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-044 | El badge se muestra solo cuando hay al menos 1 unidad total | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-045 | El badge cuenta unidades totales, no líneas distintas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-046 | Dos líneas con cantidades 2 y 5 resultan en badge "7" | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-047 | `#cart-items` tiene scroll propio cuando hay muchas líneas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P3) |
| TC-CARR-CARRITO-048 | El formulario de checkout renderiza con sus campos de dirección (reescrito; era "no existe checkout real") | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-049 | Operar el carrito de invitado no dispara llamadas a la API | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-050 | Abrir el carrito no cambia la URL de la página | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-051 | El botón "Carrito" es accesible por teclado | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-052 | Los controles de cada línea son accesibles por teclado | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-053 | Cerrar y reabrir el offcanvas mantiene el estado actualizado | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P2) |
| TC-CARR-CARRITO-054 | Vaciar el carrito actualiza el badge en la misma pestaña sin recargar | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P1) |
| TC-CARR-CARRITO-055 | El total muestra `$0` cuando el carrito solo tiene entradas inválidas | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ✅ Automated (@P3) |
| TC-CARR-CARRITO-056 | [DEFECTO] El badge cuenta unidades de un producto inexistente en el catálogo | qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md | tests/carrito/carrito.spec.ts | ⚠️ Automatizado (`test.fail()` - DEF-002 #20) @P3 |
