# Plan de Pruebas — QA-UnicorntStore-refactor — Sprint 001 — Carrito

**Proyecto:** QA-UnicorntStore-refactor
**Sprint:** 001
**Módulo:** Carrito
**Código módulo:** CARR
**Fecha planificación:** 2026-08-26
**Ventana QA:** 2026-08-26 a 2026-08-28
**ADO Test Plan:** N/A — integración con Azure DevOps deshabilitada en este proyecto
(`qa/qa-framework.config.json` → `integrations.azureDevOps.enabled: false`). La columna
**Confirma** de la Tabla de Pruebas es `N/A` en todas las filas; ver Sección 10 para la
trazabilidad sustituta basada en especificaciones y reglas de negocio.

---

## 1. Objetivo

Establecer la línea base de pruebas de regresión del módulo **Carrito** (submódulo CARRITO,
offcanvas de Bootstrap presente en todas las páginas del sitio) sobre
`https://unicornt-store.keber.cl`, capturando el comportamiento actual —incluyendo el defecto ya
identificado— para poder validar en sprints futuros que el refactor de stack no rompe ninguno de
estos comportamientos.

Este plan complementa a `Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md`: ambos
módulos comparten el mismo sprint inicial de línea base, pero el carrito tiene su propio
documento porque es un submódulo transversal (aparece en todas las páginas) con su propia
especificación completa.

---

## 2. Alcance

### En alcance

- **CARR/CARRITO** (offcanvas `#cartOffcanvas`, presente en `index.html` y `product.html`):
  apertura/cierre, líneas de producto, cálculo de subtotales y total, modificación de cantidad
  (+/-, edición manual, límites), eliminar línea, vaciar carrito, "Finalizar compra" (checkout
  simulado).
- Los 55 TCs documentados en
  `qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md`.
- Verificación del defecto abierto `DEF-002` (entrada de carrito con producto inexistente deja la
  UI inconsistente).
- Verificación cruzada de la corrección del clamping de cantidad dentro del carrito, que
  contrasta con `DEF-001` (documentado en el plan de CAT).

### Fuera de alcance

- **CAT/LISTADO y CAT/DETALLE** — tienen su propio Plan de Pruebas:
  `Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md`.
- Pruebas de backend/API, pasarela de pago o envío real — no existen en la aplicación actual
  (confirmado, ver `qa/memory/arquitectura-unicornstore-2026-08-26.md`).
- Pruebas de roles/permisos — la aplicación no tiene login ni roles.
- Pruebas de carga/performance y de compatibilidad cross-browser más allá de Chromium.
- Integración con Azure DevOps (deshabilitada por configuración del proyecto).
- Corrección de `DEF-002` — este plan documenta y prueba el comportamiento **actual**.

---

## 3. Items del Sprint (normalizados)

No hay backlog de Azure DevOps para este proyecto (integración deshabilitada); los "items del
sprint" se normalizan contra los artefactos de Stage 1/2 ya producidos:

| Item | Fuente | TCs |
|---|---|---|
| Analizar y especificar CARR/CARRITO | `qa/01-specifications/module-carrito/submodule-carrito/` | 55 |
| Documentar defecto DEF-002 (producto inexistente en el carrito) | `qa/06-defects/open/DEF-002-entrada-de-carrito-con-producto-inexistente-deja-ui-inconsistente.md` | 3 (ver Sección 10) |

---

## 4. Priorización (P0–P3 summary)

| Prioridad | TCs | % del total |
|---|---|---|
| P0 | 14 | 25% |
| P1 | 22 | 40% |
| P2 | 14 | 25% |
| P3 | 5 | 9% |
| **Total** | **55** | **100%** |

Por etiqueta de título: **14 [SMOKE]** (happy path end-to-end) y **41 [REGRESION]** (incluye
negativos, boundary, accesibilidad y los 3 casos de `DEF-002` — misma regla de asignación que en
el plan de CAT, ver Sección 11).

Por `Tipo`: **55 Automatizado**, **0 Bloqueado** — a diferencia de CAT, este submódulo no tiene
ninguna feature ausente marcada `PENDING-CODE` en su spec de origen.

---

## 5. TestSuites (agrupación para ADO)

> ADO está deshabilitado en este proyecto; estas suites organizan la ejecución manual/automatizada
> y quedan listas para mapear a ADO Test Suites si la integración se habilita más adelante.

| # | Suite / Área Funcional | TCs | Filas (N) en la tabla |
|---|---|---|---|
| 1 | Apertura y Cierre del Carrito | 8 | 1–8 |
| 2 | Estado Vacío y Líneas de Producto | 8 | 9–16 |
| 3 | Modificación de Cantidad y Totales | 13 | 17–29 |
| 4 | Eliminar y Vaciar el Carrito | 9 | 30–38 |
| 5 | Finalizar Compra (Checkout Simulado) | 7 | 39–45 |
| 6 | Defecto DEF-002 — Producto Inexistente en el Carrito | 3 | 46–48 |
| 7 | Multi-ítem, Persistencia y Regresión Transversal | 7 | 49–55 |

---

## 6. Precondiciones generales

- Ambiente: `{QA_BASE_URL}` = `https://unicornt-store.keber.cl` (sin credenciales).
- Navegador: Chromium vía Playwright (`qa/07-automation/e2e/playwright.config.ts`).
- Antes de cada TC: `localStorage['unicornt_cart']` en el estado exacto que indique la
  precondición del TC en la spec de origen — establecerlo directamente vía
  `localStorage.setItem`, no repitiendo clicks de "Agregar" desde CAT (que tiene `DEF-001`), para
  mantener los tests de CARR desacoplados de ese defecto.
- El offcanvas del carrito se abre igual desde cualquier página (`index.html` o
  `product.html?id={id}`) — los TCs que no especifican página pueden ejecutarse desde cualquiera
  de las dos.

---

## 7. Datos mínimos sugeridos

| Item | Valor | Uso |
|---|---|---|
| `{QA_BASE_URL}` | `https://unicornt-store.keber.cl` | Todos los TCs |
| Producto id=1 | "Polera 'I Can Explain It To You'" — $13.990 | Línea individual, happy path |
| Producto id=2 | "Polera 'Cloud Architect'" — $14.990 | Segunda línea, cálculo de total |
| Cantidades de referencia | `0`, `-5`, `` (vacío), `25`, `99`, `500` | Suite 3 (modificación de cantidad) |
| `id` inexistente de referencia | `9999` | Suite 6 (DEF-002) — confirmar que sigue sin existir en el catálogo antes de cada ejecución |

No se requieren credenciales ni el patrón `EXEC_IDX` (ver
`qa/01-specifications/module-carrito/submodule-carrito/04-test-data.md`).

---

## 8. Supuestos & Faltantes críticos

- **`DEF-002` sigue abierto.** Las filas 46–48 de la Tabla de Pruebas documentan el comportamiento
  *actual* (defectuoso). Al automatizar (Stage 5), las filas 46 y 47 deben marcarse con
  `test.fixme()` referenciando `DEF-002`; la fila 48 (síntoma del Total en `$0`) puede
  automatizarse como assertion del estado actual sin `fixme` si solo se verifica el síntoma.
- **`DEF-001` (documentado en el plan de CAT) también aparece referenciado aquí** en las filas 21
  y 26 — no como defecto de CARR, sino como contraste: el mismo tipo de validación de cantidad
  (clamping a 99, saneo de valores ≤0) que falla en el flujo "Agregar" de CAT funciona
  correctamente dentro del carrito. Esto acota la causa raíz de `DEF-001` al código de "alta al
  agregar", no al de "edición de línea existente" — ver notas de esas filas.
- **TCs de origen `PENDING-BROWSER`** (accesibilidad por teclado, scroll con muchas líneas) no se
  ejercitaron manualmente durante la exploración de Stage 1, pero son deterministas y
  automatizables — se incluyen como `Automatizado`. Un fallo al automatizarlas sería un hallazgo
  nuevo a documentar, no un error de esta especificación.
- Mismo comentario que en el plan de CAT sobre la "Ventana QA": es una fecha de trabajo tentativa,
  no un compromiso de sprint externo.

---

## 9. Tabla de Pruebas

| N | TC-ID | Suite / Área Funcional | Título | Descripción | Steps | Resultado Esperado | Confirma | Tipo | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| 1 | TC-CARR-CARRITO-001 | Apertura y Cierre del Carrito | [SMOKE][P0] El botón "Carrito" abre el offcanvas | El botón "Carrito" abre el offcanvas. | 1) Navegar a cualquier página del sitio.<br>2) Click en el botón "Carrito". | Se abre un `dialog` con `id="cartOffcanvas"` y título "Tu carrito". | N/A | Automatizado | P0 |
| 2 | TC-CARR-CARRITO-002 | Apertura y Cierre del Carrito | [REGRESION][P3] El offcanvas muestra el título "Tu carrito" con ícono | El offcanvas muestra el título "Tu carrito" con ícono. | 1) Abrir el carrito.<br>2) Verificar que el header muestra el ícono `fa-cart-shopping` y el texto "Tu carrito". | El header muestra el ícono `fa-cart-shopping` y el texto "Tu carrito". | N/A | Automatizado | P3 |
| 3 | TC-CARR-CARRITO-003 | Apertura y Cierre del Carrito | [SMOKE][P0] El botón "Cerrar" (X) cierra el offcanvas | El botón "Cerrar" (X) cierra el offcanvas. | 1) Abrir el carrito.<br>2) Click en el botón "Cerrar". | El offcanvas se cierra (pierde la clase `show`). | N/A | Automatizado | P0 |
| 4 | TC-CARR-CARRITO-004 | Apertura y Cierre del Carrito | [REGRESION][P1] Presionar Escape cierra el offcanvas | Presionar Escape cierra el offcanvas. (Verificado en esta sesión inmediatamente después de abrir (con foco recién movido al diálogo).) | 1) Abrir el carrito.<br>2) Presionar Escape. | El offcanvas se cierra. | N/A | Automatizado | P1 |
| 5 | TC-CARR-CARRITO-005 | Apertura y Cierre del Carrito | [REGRESION][P1] Click en el backdrop cierra el offcanvas | Click en el backdrop cierra el offcanvas. | 1) Abrir el carrito.<br>2) Click fuera del panel (`.offcanvas-backdrop`). | El offcanvas se cierra. | N/A | Automatizado | P1 |
| 6 | TC-CARR-CARRITO-043 | Apertura y Cierre del Carrito | [REGRESION][P2] El offcanvas expone `role="dialog"` y `aria-modal="true"` | El offcanvas expone `role="dialog"` y `aria-modal="true"`. | 1) Abrir el carrito.<br>2) Inspeccionar los atributos del elemento `#cartOffcanvas`. | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="cartOffcanvasLabel"`. | N/A | Automatizado | P2 |
| 7 | TC-CARR-CARRITO-050 | Apertura y Cierre del Carrito | [REGRESION][P2] Abrir el carrito no cambia la URL de la página | Abrir el carrito no cambia la URL de la página. | 1) Anotar la URL actual.<br>2) Abrir el carrito.<br>3) Comparar la URL. | La URL no cambia — es un overlay, no una navegación. | N/A | Automatizado | P2 |
| 8 | TC-CARR-CARRITO-051 | Apertura y Cierre del Carrito | [REGRESION][P2] El botón "Carrito" es accesible por teclado | El botón "Carrito" es accesible por teclado. (No ejercitado explícitamente en esta sesión.) | 1) Tab hasta enfocar el botón "Carrito".<br>2) Presionar Enter o Espacio. | El offcanvas se abre igual que con click. | N/A | Automatizado | P2 |
| 9 | TC-CARR-CARRITO-006 | Estado Vacío y Líneas de Producto | [SMOKE][P0] Con carrito vacío se muestra el mensaje de "carrito vacío" | Con carrito vacío se muestra el mensaje de "carrito vacío". (Ver RN-CARR-001.) | 1) Abrir el carrito.<br>2) Verificar que `#cart-items` muestra `"El carrito está vacío."` con el ícono `fa-box-open`. | `#cart-items` muestra `"El carrito está vacío."` con el ícono `fa-box-open`. | N/A | Automatizado | P0 |
| 10 | TC-CARR-CARRITO-007 | Estado Vacío y Líneas de Producto | [SMOKE][P0] Con carrito vacío el footer (Total + acciones) está oculto | Con carrito vacío el footer (Total + acciones) está oculto. (Ver RN-CARR-001.) | 1) Abrir el carrito.<br>2) Inspeccionar `#cart-footer`. | `#cart-footer` tiene `style="display:none"` — Total, "Finalizar compra" y "Vaciar carrito" no son visibles. | N/A | Automatizado | P0 |
| 11 | TC-CARR-CARRITO-008 | Estado Vacío y Líneas de Producto | [SMOKE][P0] Una línea de producto muestra imagen, nombre y precio unitario | Una línea de producto muestra imagen, nombre y precio unitario. | 1) Abrir el carrito.<br>2) Verificar que se muestra una línea con imagen (72×72, `alt` = nombre), nombre del producto y precio `"$13.990 c/u"`. | Se muestra una línea con imagen (72×72, `alt` = nombre), nombre del producto y precio `"$13.990 c/u"`. | N/A | Automatizado | P0 |
| 12 | TC-CARR-CARRITO-009 | Estado Vacío y Líneas de Producto | [SMOKE][P0] La línea muestra el subtotal = precio unitario × cantidad | La línea muestra el subtotal = precio unitario × cantidad. (Ver RN-CARR-002.) | 1) Abrir el carrito.<br>2) Inspeccionar el subtotal de la línea. | Subtotal = `$27.980` (`$13.990 × 2`). | N/A | Automatizado | P0 |
| 13 | TC-CARR-CARRITO-010 | Estado Vacío y Líneas de Producto | [SMOKE][P0] El total es la suma de los subtotales de todas las líneas | El total es la suma de los subtotales de todas las líneas. | 1) Abrir el carrito.<br>2) Inspeccionar `#cart-total`. | Total = `$42.970` (`$27.980 + $14.990`). | N/A | Automatizado | P0 |
| 14 | TC-CARR-CARRITO-037 | Estado Vacío y Líneas de Producto | [REGRESION][P2] La imagen de cada línea tiene `alt` igual al nombre del producto | La imagen de cada línea tiene `alt` igual al nombre del producto. | 1) Abrir el carrito.<br>2) Inspeccionar el `alt` de la imagen de la línea. | Coincide exactamente con el nombre del producto. | N/A | Automatizado | P2 |
| 15 | TC-CARR-CARRITO-038 | Estado Vacío y Líneas de Producto | [REGRESION][P3] El precio unitario incluye el sufijo "c/u" | El precio unitario incluye el sufijo "c/u". | 1) Abrir el carrito.<br>2) Verificar que el precio unitario se muestra como `"$XX.990 c/u"`. | El precio unitario se muestra como `"$XX.990 c/u"`. | N/A | Automatizado | P3 |
| 16 | TC-CARR-CARRITO-039 | Estado Vacío y Líneas de Producto | [REGRESION][P2] El formato de precio es consistente con listado/detalle | El formato de precio es consistente con listado/detalle. | 1) Abrir el carrito y comparar el formato de precio con el del listado/detalle del mismo producto.<br>2) Verificar que mismo formato `"$XX.990"` en las tres vistas. | Mismo formato `"$XX.990"` en las tres vistas. | N/A | Automatizado | P2 |
| 17 | TC-CARR-CARRITO-011 | Modificación de Cantidad y Totales | [REGRESION][P1] El total se recalcula al cambiar una cantidad | El total se recalcula al cambiar una cantidad. | 1) Abrir el carrito.<br>2) Click en "+" de la línea.<br>3) Inspeccionar `#cart-total`. | El total pasa de `$13.990` a `$27.980` inmediatamente, sin recargar la página. | N/A | Automatizado | P1 |
| 18 | TC-CARR-CARRITO-012 | Modificación de Cantidad y Totales | [SMOKE][P0] El botón "+" incrementa la cantidad en 1 | El botón "+" incrementa la cantidad en 1. | 1) Abrir el carrito.<br>2) Click en "Aumentar" de la línea. | `unicornt_cart` = `[{"id":1,"qty":2}]`. | N/A | Automatizado | P0 |
| 19 | TC-CARR-CARRITO-013 | Modificación de Cantidad y Totales | [SMOKE][P0] El botón "−" decrementa la cantidad en 1 (qty > 1) | El botón "−" decrementa la cantidad en 1 (qty > 1). | 1) Abrir el carrito.<br>2) Click en "Reducir" de la línea. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P0 |
| 20 | TC-CARR-CARRITO-014 | Modificación de Cantidad y Totales | [REGRESION][P1] El botón "−" en qty=1 elimina la línea completa | El botón "−" en qty=1 elimina la línea completa. (Ver RN-CARR-003 — comportamiento distinto al selector de cantidad del detalle (bloquea en 1 en vez de eliminar).) | 1) Abrir el carrito.<br>2) Click en "Reducir" de la línea del producto id=2 (qty=1).<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":2}]` — la línea de id=2 desaparece completamente, no queda en `qty:0`. | N/A | Automatizado | P1 |
| 21 | TC-CARR-CARRITO-015 | Modificación de Cantidad y Totales | [REGRESION][P1] El botón "+" no incrementa por sobre 99 | El botón "+" no incrementa por sobre 99. (Ver RN-CARR-004. Contraste positivo con DEF-001 (aquí sí clampea correctamente).) | 1) Abrir el carrito.<br>2) Click en "Aumentar" de la línea. | `unicornt_cart` permanece `[{"id":1,"qty":99}]`. | N/A | Automatizado | P1 |
| 22 | TC-CARR-CARRITO-016 | Modificación de Cantidad y Totales | [REGRESION][P1] Editar manualmente a un valor válido actualiza la cantidad | Editar manualmente a un valor válido actualiza la cantidad. | 1) Abrir el carrito.<br>2) Editar el input de cantidad de la línea a `25`.<br>3) Sacar el foco del input (Tab). | `unicornt_cart` = `[{"id":1,"qty":25}]`. | N/A | Automatizado | P1 |
| 23 | TC-CARR-CARRITO-017 | Modificación de Cantidad y Totales | [REGRESION][P1] Editar manualmente a `0` sanea a 1 | Editar manualmente a `0` sanea a 1. (Ver RN-CARR-005. Verificado en esta sesión.) | 1) Abrir el carrito.<br>2) Editar el input de cantidad a `0`.<br>3) Sacar el foco del input. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P1 |
| 24 | TC-CARR-CARRITO-018 | Modificación de Cantidad y Totales | [REGRESION][P1] Editar manualmente a un valor negativo sanea a 1 | Editar manualmente a un valor negativo sanea a 1. (Ver RN-CARR-005. Verificado en esta sesión.) | 1) Abrir el carrito.<br>2) Editar el input de cantidad a `-5`.<br>3) Sacar el foco del input. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P1 |
| 25 | TC-CARR-CARRITO-019 | Modificación de Cantidad y Totales | [REGRESION][P1] Editar manualmente a vacío sanea a 1 | Editar manualmente a vacío sanea a 1. (Ver RN-CARR-005. Verificado en esta sesión.) | 1) Abrir el carrito.<br>2) Vaciar el input de cantidad.<br>3) Sacar el foco del input. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P1 |
| 26 | TC-CARR-CARRITO-020 | Modificación de Cantidad y Totales | [REGRESION][P1] Editar manualmente a un valor > 99 clampea a 99 | Editar manualmente a un valor > 99 clampea a 99. (Ver RN-CARR-005. Comportamiento correcto — contrasta con DEF-001 (donde un valor análogo `>99` NO se clampea en el flujo de "Agregar"). Verificado en esta sesión.) | 1) Abrir el carrito.<br>2) Editar el input de cantidad a `500`.<br>3) Sacar el foco del input. | `unicornt_cart` = `[{"id":1,"qty":99}]`. | N/A | Automatizado | P1 |
| 27 | TC-CARR-CARRITO-041 | Modificación de Cantidad y Totales | [REGRESION][P2] Los botones +/- tienen `aria-label` "Reducir"/"Aumentar" | Los botones +/- tienen `aria-label` "Reducir"/"Aumentar". (Diferencia de wording documentada, no es un defecto.) | 1) Abrir el carrito.<br>2) Inspeccionar los `aria-label` de ambos botones del stepper. | `"Reducir"` y `"Aumentar"` (nótese: más cortos que los del selector de cantidad del detalle, `"Reducir cantidad"`/`"Aumentar cantidad"`). | N/A | Automatizado | P2 |
| 28 | TC-CARR-CARRITO-042 | Modificación de Cantidad y Totales | [REGRESION][P3] El input de cantidad tiene `aria-label="Cantidad"` | El input de cantidad tiene `aria-label="Cantidad"`. | 1) Abrir el carrito.<br>2) Inspeccionar el `aria-label` del input de cantidad de una línea. | `aria-label="Cantidad"`. | N/A | Automatizado | P3 |
| 29 | TC-CARR-CARRITO-052 | Modificación de Cantidad y Totales | [REGRESION][P2] Los controles de cada línea son accesibles por teclado | Los controles de cada línea son accesibles por teclado. (No ejercitado explícitamente en esta sesión.) | 1) Abrir el carrito.<br>2) Tab a través de los botones +/- y "Eliminar" de una línea.<br>3) Activar cada uno con Enter/Espacio. | Cada control se activa igual que con click de mouse. | N/A | Automatizado | P2 |
| 30 | TC-CARR-CARRITO-021 | Eliminar y Vaciar el Carrito | [SMOKE][P0] "Eliminar" quita la línea completa | "Eliminar" quita la línea completa. (Ver RN-CARR-006.) | 1) Abrir el carrito.<br>2) Click en "Eliminar" de la línea del producto id=2.<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":2}]`. | N/A | Automatizado | P0 |
| 31 | TC-CARR-CARRITO-022 | Eliminar y Vaciar el Carrito | [REGRESION][P2] "Eliminar" no requiere confirmación | "Eliminar" no requiere confirmación. | 1) Abrir el carrito.<br>2) Click en "Eliminar" de cualquier línea. | La línea se elimina de inmediato, sin ningún diálogo de confirmación. | N/A | Automatizado | P2 |
| 32 | TC-CARR-CARRITO-023 | Eliminar y Vaciar el Carrito | [SMOKE][P0] "Vaciar carrito" elimina todas las líneas | "Vaciar carrito" elimina todas las líneas. (Ver RN-CARR-007.) | 1) Abrir el carrito.<br>2) Click en "Vaciar carrito".<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[]`. | N/A | Automatizado | P0 |
| 33 | TC-CARR-CARRITO-024 | Eliminar y Vaciar el Carrito | [REGRESION][P2] "Vaciar carrito" no requiere confirmación | "Vaciar carrito" no requiere confirmación. | 1) Abrir el carrito.<br>2) Click en "Vaciar carrito". | El carrito se vacía de inmediato, sin diálogo de confirmación. | N/A | Automatizado | P2 |
| 34 | TC-CARR-CARRITO-025 | Eliminar y Vaciar el Carrito | [REGRESION][P1] Tras vaciar el carrito, vuelve el estado vacío | Tras vaciar el carrito, vuelve el estado vacío. | 1) Abrir el carrito y click en "Vaciar carrito".<br>2) Inspeccionar `#cart-items` y `#cart-footer`. | Se muestra el mensaje "El carrito está vacío." y `#cart-footer` vuelve a `display:none`. | N/A | Automatizado | P1 |
| 35 | TC-CARR-CARRITO-026 | Eliminar y Vaciar el Carrito | [REGRESION][P1] El badge desaparece tras vaciar el carrito | El badge desaparece tras vaciar el carrito. | 1) Abrir el carrito y click en "Vaciar carrito".<br>2) Inspeccionar el botón "Carrito" del navbar. | El botón vuelve a mostrar solo `"Carrito"`, sin badge numérico. | N/A | Automatizado | P1 |
| 36 | TC-CARR-CARRITO-040 | Eliminar y Vaciar el Carrito | [REGRESION][P2] El botón "Eliminar" tiene `aria-label="Eliminar"` | El botón "Eliminar" tiene `aria-label="Eliminar"`. | 1) Abrir el carrito.<br>2) Inspeccionar el `aria-label` del botón "Eliminar". | `aria-label="Eliminar"`. | N/A | Automatizado | P2 |
| 37 | TC-CARR-CARRITO-053 | Eliminar y Vaciar el Carrito | [REGRESION][P2] Cerrar y reabrir el offcanvas mantiene el estado actualizado | Cerrar y reabrir el offcanvas mantiene el estado actualizado. | 1) Abrir el carrito, modificar una cantidad, cerrar el offcanvas.<br>2) Reabrir el carrito. | El offcanvas muestra el estado actualizado (la cantidad modificada), no el original. | N/A | Automatizado | P2 |
| 38 | TC-CARR-CARRITO-054 | Eliminar y Vaciar el Carrito | [REGRESION][P1] Vaciar el carrito actualiza el badge en la misma pestaña sin recargar | Vaciar el carrito actualiza el badge en la misma pestaña sin recargar. | 1) Abrir el carrito y click en "Vaciar carrito".<br>2) Sin recargar, inspeccionar el botón "Carrito". | El badge desaparece de inmediato, sin necesidad de recargar la página. | N/A | Automatizado | P1 |
| 39 | TC-CARR-CARRITO-027 | Finalizar Compra (Checkout Simulado) | [SMOKE][P0] "Finalizar compra" vacía el carrito | "Finalizar compra" vacía el carrito. (Ver RN-CARR-008.) | 1) Abrir el carrito.<br>2) Click en "Finalizar compra".<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[]`. | N/A | Automatizado | P0 |
| 40 | TC-CARR-CARRITO-028 | Finalizar Compra (Checkout Simulado) | [REGRESION][P1] "Finalizar compra" cierra el offcanvas | "Finalizar compra" cierra el offcanvas. | 1) Abrir el carrito.<br>2) Click en "Finalizar compra". | El offcanvas se cierra (pierde la clase `show`). | N/A | Automatizado | P1 |
| 41 | TC-CARR-CARRITO-029 | Finalizar Compra (Checkout Simulado) | [SMOKE][P0] "Finalizar compra" muestra el toast de agradecimiento | "Finalizar compra" muestra el toast de agradecimiento. (Verificado en esta sesión.) | 1) Abrir el carrito.<br>2) Click en "Finalizar compra".<br>3) Inspeccionar el DOM del toast. | El toast contiene `"¡Gracias por tu compra! Tu pedido está en camino. 🦄"`. | N/A | Automatizado | P0 |
| 42 | TC-CARR-CARRITO-030 | Finalizar Compra (Checkout Simulado) | [REGRESION][P1] "Finalizar compra" no genera número de orden ni confirmación | "Finalizar compra" no genera número de orden ni confirmación. (Confirma hallazgo de arquitectura.) | 1) Abrir el carrito.<br>2) Click en "Finalizar compra".<br>3) Buscar cualquier número de orden o página/sección de confirmación. | No existe ningún número de orden ni página de confirmación — solo el toast y el carrito vacío. | N/A | Automatizado | P1 |
| 43 | TC-CARR-CARRITO-031 | Finalizar Compra (Checkout Simulado) | [SMOKE][P0] "Finalizar compra" no persiste ni envía la "compra" a ningún lado | "Finalizar compra" no persiste ni envía la "compra" a ningún lado. | 1) Abrir el carrito.<br>2) Click en "Finalizar compra".<br>3) Revisar todas las requests de red y las claves de `localStorage`. | 0 llamadas XHR/fetch; ninguna clave nueva de `localStorage` registra la "compra" (solo `unicornt_cart` queda en `[]`). | N/A | Automatizado | P0 |
| 44 | TC-CARR-CARRITO-048 | Finalizar Compra (Checkout Simulado) | [REGRESION][P1] No existe ningún paso de checkout real | No existe ningún paso de checkout real. | 1) Abrir el carrito.<br>2) Buscar cualquier campo de dirección de envío, medio de pago o cupón. | No existe ninguno de esos controles — "Finalizar compra" es un botón único y directo. | N/A | Automatizado | P1 |
| 45 | TC-CARR-CARRITO-049 | Finalizar Compra (Checkout Simulado) | [REGRESION][P1] No hay llamadas de red al abrir/operar el carrito | No hay llamadas de red al abrir/operar el carrito. | 1) Abrir el carrito, modificar cantidades, eliminar un ítem.<br>2) Revisar todas las requests no estáticas. | 0 llamadas XHR/fetch en todo el flujo. | N/A | Automatizado | P1 |
| 46 | TC-CARR-CARRITO-035 | Defecto DEF-002 — Producto Inexistente en el Carrito | [REGRESION][P2] Entrada con producto inexistente deja la UI inconsistente | Entrada con producto inexistente deja la UI inconsistente. (Ver DEF-002 y RN-CARR-009.) | 1) Abrir el carrito.<br>2) Inspeccionar `#cart-items`, `#cart-footer` y el badge del botón "Carrito". | Esperado: El sistema debería tratar la entrada como inválida (ignorarla y mostrar el estado vacío, o señalar el problema). \| Actual (defecto): `#cart-items` queda vacío sin mostrar el mensaje de "carrito vacío"; `#cart-footer` se muestra igual (`display` distinto de `none`) con Total `"$0"`; el badge muestra `"1"`. | N/A | Automatizado | P2 |
| 47 | TC-CARR-CARRITO-036 | Defecto DEF-002 — Producto Inexistente en el Carrito | [REGRESION][P2] "Finalizar compra" se completa sobre un carrito solo con entrada inválida | "Finalizar compra" se completa sobre un carrito solo con entrada inválida. (Ver DEF-002.) | 1) Abrir el carrito (footer visible, Total `$0`, sin filas — ver TC-035).<br>2) Click en "Finalizar compra".<br>3) Inspeccionar el toast y `unicornt_cart`. | Esperado: El sistema debería impedir o advertir sobre "finalizar" una compra sin ítems válidos. \| Actual (defecto): Se muestra el mismo toast de éxito `"¡Gracias por tu compra!..."` y `unicornt_cart` pasa a `[]`, como si hubiera sido una compra real. | N/A | Automatizado | P2 |
| 48 | TC-CARR-CARRITO-055 | Defecto DEF-002 — Producto Inexistente en el Carrito | [REGRESION][P3] El total muestra `$0` cuando el carrito solo tiene entradas inválidas | El total muestra `$0` cuando el carrito solo tiene entradas inválidas. (Ligado al defecto TC-035/DEF-002 — el total en `$0` sin filas visibles es parte del mismo estado inconsistente.) | 1) Abrir el carrito.<br>2) Inspeccionar `#cart-total`. | `#cart-total` muestra `"$0"`. | N/A | Automatizado | P3 |
| 49 | TC-CARR-CARRITO-032 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P1] El carrito con múltiples ítems distintos renderiza todas las líneas | El carrito con múltiples ítems distintos renderiza todas las líneas. | 1) Abrir el carrito.<br>2) Verificar que se muestran exactamente 3 líneas, cada una con su producto, cantidad y subtotal correctos. | Se muestran exactamente 3 líneas, cada una con su producto, cantidad y subtotal correctos. | N/A | Automatizado | P1 |
| 50 | TC-CARR-CARRITO-033 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P1] El carrito es idéntico entre `index.html` y `product.html` | El carrito es idéntico entre `index.html` y `product.html`. (Ver RN-CARR-011.) | 1) Abrir el carrito desde `index.html` y anotar su contenido.<br>2) Navegar a `product.html?id=5`.<br>3) Abrir el carrito nuevamente. | El contenido del carrito es idéntico en ambas páginas. | N/A | Automatizado | P1 |
| 51 | TC-CARR-CARRITO-034 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P1] El carrito persiste tras recargar la página | El carrito persiste tras recargar la página. | 1) Con el carrito poblado, recargar la página (`F5`).<br>2) Abrir el carrito. | El contenido no cambia tras el reload. | N/A | Automatizado | P1 |
| 52 | TC-CARR-CARRITO-044 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P1] El badge se muestra solo cuando hay al menos 1 unidad total | El badge se muestra solo cuando hay al menos 1 unidad total. | 1) Inspeccionar el botón "Carrito" con el carrito vacío.<br>2) Verificar que no hay badge numérico, solo el texto "Carrito". | No hay badge numérico, solo el texto "Carrito". | N/A | Automatizado | P1 |
| 53 | TC-CARR-CARRITO-045 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P1] El badge cuenta unidades totales, no líneas distintas | El badge cuenta unidades totales, no líneas distintas. | 1) Inspeccionar el badge del botón "Carrito".<br>2) Verificar que el badge muestra `"7"` (2+5), no `"2"` (cantidad de líneas). | El badge muestra `"7"` (2+5), no `"2"` (cantidad de líneas). | N/A | Automatizado | P1 |
| 54 | TC-CARR-CARRITO-046 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P2] Dos líneas con cantidades 2 y 5 resultan en badge "7" | Dos líneas con cantidades 2 y 5 resultan en badge "7". (Verificado en esta sesión — duplica TC-045 con pasos explícitos de setup, se mantiene por separado porque documenta el caso de datos concreto usado en la automatización.) | 1) Establecer `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":5}]` y recargar.<br>2) Inspeccionar el badge. | Badge = `"7"`. | N/A | Automatizado | P2 |
| 55 | TC-CARR-CARRITO-047 | Multi-ítem, Persistencia y Regresión Transversal | [REGRESION][P3] `#cart-items` tiene scroll propio cuando hay muchas líneas | `#cart-items` tiene scroll propio cuando hay muchas líneas. (Confirmado por CSS (`overflow-auto` en el contenedor), no se probó visualmente con 10+ líneas en esta sesión.) | 1) Poblar el carrito con 10 o más productos distintos.<br>2) Abrir el carrito. | `#cart-items` muestra scroll interno (`overflow-auto`) sin que el offcanvas completo se desborde de la pantalla. | N/A | Automatizado | P3 |

---

## 10. Matriz de Trazabilidad

> Sin ADO — se sustituye por trazabilidad contra el submódulo de origen y contra los defectos
> abiertos.

### Por submódulo de origen

| Submódulo (spec de origen) | Filas (N) en la tabla | TCs |
|---|---|---|
| `submodule-carrito/05-test-scenarios.md` | 1–55 | 55 |

### Por defecto abierto o referenciado

| Defecto | Filas (N) en la tabla | TCs relacionados | Naturaleza |
|---|---|---|---|
| `DEF-002` | 46–48 | TC-CARR-CARRITO-035, TC-CARR-CARRITO-036, TC-CARR-CARRITO-055 | Defecto propio de CARR |
| `DEF-001` | 21, 26 | TC-CARR-CARRITO-015, TC-CARR-CARRITO-020 | Referencia cruzada — contraste de comportamiento correcto vs. el defecto documentado en el plan de CAT |

---

## 11. Notas de automatización

- **Regla de etiqueta de título**: idéntica a la del plan de CAT — `[SMOKE]` para TCs
  `Type≠Negative` con `Priority=P0`; `[REGRESION]` para todo lo demás (incluye los 3 casos de
  `DEF-002`).
- **Regla de `Tipo`**: `Automatizado` en el 100% de los TCs de este submódulo — no hay ninguna
  feature ausente marcada `PENDING-CODE` en `submodule-carrito/00-inventory.md` (a diferencia de
  CAT, que sí tiene 4).
- **Orden de automatización sugerido (Stage 5)**: Suite 2 y 3 primero (P0 concentrado —
  renderizado de líneas/total y modificación de cantidad), luego Suite 4 y 5 (eliminar/vaciar y
  checkout simulado), y por último Suite 1, 6 y 7.
- Los TCs de la Suite 6 (`DEF-002`) requieren precondición explícita
  `unicornt_cart = [{"id": 9999, "qty": 1}]` — confirmar antes de cada ejecución que `id=9999`
  sigue sin existir en el catálogo (`assets/js/products.js`), ya que el catálogo podría crecer en
  el futuro y volver el `id` de prueba válido por accidente.
- Al igual que en el plan de CAT, los "Steps" con un solo paso en la spec original se expandieron
  aquí a 2 pasos (acción + verificación explícita) para cumplir el gate de "al menos 2 pasos
  numerados" de `qa-test-plan`.

---

## Changelog

| Versión | Fecha | Descripción |
|---------|------|-------------|
| 1.0 | 2026-08-26 | Creación inicial (Stage 3), a partir de la spec de Stage 1/2 de CARR/CARRITO |
