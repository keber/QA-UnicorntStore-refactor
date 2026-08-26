# Test Scenarios — Carrito: Carrito de compras (offcanvas)

**Module code**: CARR
**Submodule code**: CARRITO
**Last updated**: 2026-08-26

## Summary

| Priority | Count | Automated | Manual |
|----------|-------|-----------|--------|
| P0 | 13 | 0 | 13 |
| P1 | 21 | 0 | 21 |
| P2 | 15 | 0 | 15 |
| P3 | 6 | 0 | 6 |
| **Total** | **55** | **0** | **55** |

---

### TC-CARR-CARRITO-001: El botón "Carrito" abre el offcanvas

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a cualquier página del sitio.
2. Click en el botón "Carrito".

**Expected result**: Se abre un `dialog` con `id="cartOffcanvas"` y título "Tu carrito".

**Notes**: —

---

### TC-CARR-CARRITO-002: El offcanvas muestra el título "Tu carrito" con ícono

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Abrir el carrito.

**Expected result**: El header muestra el ícono `fa-cart-shopping` y el texto "Tu carrito".

**Notes**: —

---

### TC-CARR-CARRITO-003: El botón "Cerrar" (X) cierra el offcanvas

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Abrir el carrito.
2. Click en el botón "Cerrar".

**Expected result**: El offcanvas se cierra (pierde la clase `show`).

**Notes**: —

---

### TC-CARR-CARRITO-004: Presionar Escape cierra el offcanvas

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Abrir el carrito.
2. Presionar Escape.

**Expected result**: El offcanvas se cierra.

**Notes**: Verificado en esta sesión inmediatamente después de abrir (con foco recién movido al
diálogo).

---

### TC-CARR-CARRITO-005: Click en el backdrop cierra el offcanvas

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Abrir el carrito.
2. Click fuera del panel (`.offcanvas-backdrop`).

**Expected result**: El offcanvas se cierra.

**Notes**: —

---

### TC-CARR-CARRITO-006: Con carrito vacío se muestra el mensaje de "carrito vacío"

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Abrir el carrito.

**Expected result**: `#cart-items` muestra `"El carrito está vacío."` con el ícono `fa-box-open`.

**Notes**: Ver RN-CARR-001.

---

### TC-CARR-CARRITO-007: Con carrito vacío el footer (Total + acciones) está oculto

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar `#cart-footer`.

**Expected result**: `#cart-footer` tiene `style="display:none"` — Total, "Finalizar compra" y
"Vaciar carrito" no son visibles.

**Notes**: Ver RN-CARR-001.

---

### TC-CARR-CARRITO-008: Una línea de producto muestra imagen, nombre y precio unitario

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.

**Expected result**: Se muestra una línea con imagen (72×72, `alt` = nombre), nombre del producto
y precio `"$13.990 c/u"`.

**Notes**: —

---

### TC-CARR-CARRITO-009: La línea muestra el subtotal = precio unitario × cantidad

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2}]`.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar el subtotal de la línea.

**Expected result**: Subtotal = `$27.980` (`$13.990 × 2`).

**Notes**: Ver RN-CARR-002.

---

### TC-CARR-CARRITO-010: El total es la suma de los subtotales de todas las líneas

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar `#cart-total`.

**Expected result**: Total = `$42.970` (`$27.980 + $14.990`).

**Notes**: —

---

### TC-CARR-CARRITO-011: El total se recalcula al cambiar una cantidad

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Click en "+" de la línea.
3. Inspeccionar `#cart-total`.

**Expected result**: El total pasa de `$13.990` a `$27.980` inmediatamente, sin recargar la
página.

**Notes**: —

---

### TC-CARR-CARRITO-012: El botón "+" incrementa la cantidad en 1

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Click en "Aumentar" de la línea.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":2}]`.

**Notes**: —

---

### TC-CARR-CARRITO-013: El botón "−" decrementa la cantidad en 1 (qty > 1)

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2}]`.

**Steps**:
1. Abrir el carrito.
2. Click en "Reducir" de la línea.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: —

---

### TC-CARR-CARRITO-014: El botón "−" en qty=1 elimina la línea completa

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Click en "Reducir" de la línea del producto id=2 (qty=1).
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":2}]` — la línea de id=2 desaparece
completamente, no queda en `qty:0`.

**Notes**: Ver RN-CARR-003 — comportamiento distinto al selector de cantidad del detalle
(bloquea en 1 en vez de eliminar).

---

### TC-CARR-CARRITO-015: El botón "+" no incrementa por sobre 99

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":99}]`.

**Steps**:
1. Abrir el carrito.
2. Click en "Aumentar" de la línea.

**Expected result**: `unicornt_cart` permanece `[{"id":1,"qty":99}]`.

**Notes**: Ver RN-CARR-004. Contraste positivo con DEF-001 (aquí sí clampea correctamente).

---

### TC-CARR-CARRITO-016: Editar manualmente a un valor válido actualiza la cantidad

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Editar el input de cantidad de la línea a `25`.
3. Sacar el foco del input (Tab).

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":25}]`.

**Notes**: —

---

### TC-CARR-CARRITO-017: Editar manualmente a `0` sanea a 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Editar el input de cantidad a `0`.
3. Sacar el foco del input.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: Ver RN-CARR-005. Verificado en esta sesión.

---

### TC-CARR-CARRITO-018: Editar manualmente a un valor negativo sanea a 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Editar el input de cantidad a `-5`.
3. Sacar el foco del input.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: Ver RN-CARR-005. Verificado en esta sesión.

---

### TC-CARR-CARRITO-019: Editar manualmente a vacío sanea a 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Vaciar el input de cantidad.
3. Sacar el foco del input.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: Ver RN-CARR-005. Verificado en esta sesión.

---

### TC-CARR-CARRITO-020: Editar manualmente a un valor > 99 clampea a 99

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Editar el input de cantidad a `500`.
3. Sacar el foco del input.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":99}]`.

**Notes**: Ver RN-CARR-005. Comportamiento correcto — contrasta con DEF-001 (donde un valor
análogo `>99` NO se clampea en el flujo de "Agregar"). Verificado en esta sesión.

---

### TC-CARR-CARRITO-021: "Eliminar" quita la línea completa

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Click en "Eliminar" de la línea del producto id=2.
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":2}]`.

**Notes**: Ver RN-CARR-006.

---

### TC-CARR-CARRITO-022: "Eliminar" no requiere confirmación

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Click en "Eliminar" de cualquier línea.

**Expected result**: La línea se elimina de inmediato, sin ningún diálogo de confirmación.

**Notes**: —

---

### TC-CARR-CARRITO-023: "Vaciar carrito" elimina todas las líneas

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con 2 o más ítems.

**Steps**:
1. Abrir el carrito.
2. Click en "Vaciar carrito".
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[]`.

**Notes**: Ver RN-CARR-007.

---

### TC-CARR-CARRITO-024: "Vaciar carrito" no requiere confirmación

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Click en "Vaciar carrito".

**Expected result**: El carrito se vacía de inmediato, sin diálogo de confirmación.

**Notes**: —

---

### TC-CARR-CARRITO-025: Tras vaciar el carrito, vuelve el estado vacío

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito y click en "Vaciar carrito".
2. Inspeccionar `#cart-items` y `#cart-footer`.

**Expected result**: Se muestra el mensaje "El carrito está vacío." y `#cart-footer` vuelve a
`display:none`.

**Notes**: —

---

### TC-CARR-CARRITO-026: El badge desaparece tras vaciar el carrito

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito y click en "Vaciar carrito".
2. Inspeccionar el botón "Carrito" del navbar.

**Expected result**: El botón vuelve a mostrar solo `"Carrito"`, sin badge numérico.

**Notes**: —

---

### TC-CARR-CARRITO-027: "Finalizar compra" vacía el carrito

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Click en "Finalizar compra".
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[]`.

**Notes**: Ver RN-CARR-008.

---

### TC-CARR-CARRITO-028: "Finalizar compra" cierra el offcanvas

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Click en "Finalizar compra".

**Expected result**: El offcanvas se cierra (pierde la clase `show`).

**Notes**: —

---

### TC-CARR-CARRITO-029: "Finalizar compra" muestra el toast de agradecimiento

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Click en "Finalizar compra".
3. Inspeccionar el DOM del toast.

**Expected result**: El toast contiene `"¡Gracias por tu compra! Tu pedido está en camino. 🦄"`.

**Notes**: Verificado en esta sesión.

---

### TC-CARR-CARRITO-030: "Finalizar compra" no genera número de orden ni confirmación

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Click en "Finalizar compra".
3. Buscar cualquier número de orden o página/sección de confirmación.

**Expected result**: No existe ningún número de orden ni página de confirmación — solo el toast y
el carrito vacío.

**Notes**: Confirma hallazgo de arquitectura.

---

### TC-CARR-CARRITO-031: "Finalizar compra" no persiste ni envía la "compra" a ningún lado

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem, captura de red habilitada.

**Steps**:
1. Abrir el carrito.
2. Click en "Finalizar compra".
3. Revisar todas las requests de red y las claves de `localStorage`.

**Expected result**: 0 llamadas XHR/fetch; ninguna clave nueva de `localStorage` registra la
"compra" (solo `unicornt_cart` queda en `[]`).

**Notes**: —

---

### TC-CARR-CARRITO-032: El carrito con múltiples ítems distintos renderiza todas las líneas

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":1},{"id":3,"qty":5}]`.

**Steps**:
1. Abrir el carrito.

**Expected result**: Se muestran exactamente 3 líneas, cada una con su producto, cantidad y
subtotal correctos.

**Notes**: —

---

### TC-CARR-CARRITO-033: El carrito es idéntico entre `index.html` y `product.html`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito desde `index.html` y anotar su contenido.
2. Navegar a `product.html?id=5`.
3. Abrir el carrito nuevamente.

**Expected result**: El contenido del carrito es idéntico en ambas páginas.

**Notes**: Ver RN-CARR-011.

---

### TC-CARR-CARRITO-034: El carrito persiste tras recargar la página

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Con el carrito poblado, recargar la página (`F5`).
2. Abrir el carrito.

**Expected result**: El contenido no cambia tras el reload.

**Notes**: —

---

### TC-CARR-CARRITO-035: [DEFECTO] Entrada con producto inexistente deja la UI inconsistente

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":9999,"qty":1}]` (id que no existe en el catálogo).

**Steps**:
1. Abrir el carrito.
2. Inspeccionar `#cart-items`, `#cart-footer` y el badge del botón "Carrito".

**Expected result esperado**: El sistema debería tratar la entrada como inválida (ignorarla y
mostrar el estado vacío, o señalar el problema).

**Resultado actual (defecto)**: `#cart-items` queda vacío sin mostrar el mensaje de "carrito
vacío"; `#cart-footer` se muestra igual (`display` distinto de `none`) con Total `"$0"`; el badge
muestra `"1"`.

**Notes**: Ver DEF-002 y RN-CARR-009.

---

### TC-CARR-CARRITO-036: [DEFECTO derivado] "Finalizar compra" se completa sobre un carrito solo con entrada inválida

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":9999,"qty":1}]`.

**Steps**:
1. Abrir el carrito (footer visible, Total `$0`, sin filas — ver TC-035).
2. Click en "Finalizar compra".
3. Inspeccionar el toast y `unicornt_cart`.

**Expected result esperado**: El sistema debería impedir o advertir sobre "finalizar" una compra
sin ítems válidos.

**Resultado actual (defecto)**: Se muestra el mismo toast de éxito `"¡Gracias por tu compra!..."`
y `unicornt_cart` pasa a `[]`, como si hubiera sido una compra real.

**Notes**: Ver DEF-002.

---

### TC-CARR-CARRITO-037: La imagen de cada línea tiene `alt` igual al nombre del producto

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar el `alt` de la imagen de la línea.

**Expected result**: Coincide exactamente con el nombre del producto.

**Notes**: —

---

### TC-CARR-CARRITO-038: El precio unitario incluye el sufijo "c/u"

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.

**Expected result**: El precio unitario se muestra como `"$XX.990 c/u"`.

**Notes**: —

---

### TC-CARR-CARRITO-039: El formato de precio es consistente con listado/detalle

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito y comparar el formato de precio con el del listado/detalle del mismo
   producto.

**Expected result**: Mismo formato `"$XX.990"` en las tres vistas.

**Notes**: —

---

### TC-CARR-CARRITO-040: El botón "Eliminar" tiene `aria-label="Eliminar"`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar el `aria-label` del botón "Eliminar".

**Expected result**: `aria-label="Eliminar"`.

**Notes**: —

---

### TC-CARR-CARRITO-041: Los botones +/- tienen `aria-label` "Reducir"/"Aumentar"

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar los `aria-label` de ambos botones del stepper.

**Expected result**: `"Reducir"` y `"Aumentar"` (nótese: más cortos que los del selector de
cantidad del detalle, `"Reducir cantidad"`/`"Aumentar cantidad"`).

**Notes**: Diferencia de wording documentada, no es un defecto.

---

### TC-CARR-CARRITO-042: El input de cantidad tiene `aria-label="Cantidad"`

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar el `aria-label` del input de cantidad de una línea.

**Expected result**: `aria-label="Cantidad"`.

**Notes**: —

---

### TC-CARR-CARRITO-043: El offcanvas expone `role="dialog"` y `aria-modal="true"`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar los atributos del elemento `#cartOffcanvas`.

**Expected result**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="cartOffcanvasLabel"`.

**Notes**: —

---

### TC-CARR-CARRITO-044: El badge se muestra solo cuando hay al menos 1 unidad total

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Inspeccionar el botón "Carrito" con el carrito vacío.

**Expected result**: No hay badge numérico, solo el texto "Carrito".

**Notes**: —

---

### TC-CARR-CARRITO-045: El badge cuenta unidades totales, no líneas distintas

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":5}]`.

**Steps**:
1. Inspeccionar el badge del botón "Carrito".

**Expected result**: El badge muestra `"7"` (2+5), no `"2"` (cantidad de líneas).

**Notes**: —

---

### TC-CARR-CARRITO-046: Dos líneas con cantidades 2 y 5 resultan en badge "7"

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Establecer `unicornt_cart` = `[{"id":1,"qty":2},{"id":2,"qty":5}]` y recargar.
2. Inspeccionar el badge.

**Expected result**: Badge = `"7"`.

**Notes**: Verificado en esta sesión — duplica TC-045 con pasos explícitos de setup, se mantiene
por separado porque documenta el caso de datos concreto usado en la automatización.

---

### TC-CARR-CARRITO-047: `#cart-items` tiene scroll propio cuando hay muchas líneas

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con muchas líneas (ej. 10+ productos distintos).

**Steps**:
1. Poblar el carrito con 10 o más productos distintos.
2. Abrir el carrito.

**Expected result**: `#cart-items` muestra scroll interno (`overflow-auto`) sin que el offcanvas
completo se desborde de la pantalla.

**Notes**: Confirmado por CSS (`overflow-auto` en el contenedor), no se probó visualmente con 10+
líneas en esta sesión.

---

### TC-CARR-CARRITO-048: No existe ningún paso de checkout real

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Buscar cualquier campo de dirección de envío, medio de pago o cupón.

**Expected result**: No existe ninguno de esos controles — "Finalizar compra" es un botón único
y directo.

**Notes**: —

---

### TC-CARR-CARRITO-049: No hay llamadas de red al abrir/operar el carrito

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Captura de red habilitada.

**Steps**:
1. Abrir el carrito, modificar cantidades, eliminar un ítem.
2. Revisar todas las requests no estáticas.

**Expected result**: 0 llamadas XHR/fetch en todo el flujo.

**Notes**: —

---

### TC-CARR-CARRITO-050: Abrir el carrito no cambia la URL de la página

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Anotar la URL actual.
2. Abrir el carrito.
3. Comparar la URL.

**Expected result**: La URL no cambia — es un overlay, no una navegación.

**Notes**: —

---

### TC-CARR-CARRITO-051: El botón "Carrito" es accesible por teclado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Tab hasta enfocar el botón "Carrito".
2. Presionar Enter o Espacio.

**Expected result**: El offcanvas se abre igual que con click.

**Notes**: No ejercitado explícitamente en esta sesión.

---

### TC-CARR-CARRITO-052: Los controles de cada línea son accesibles por teclado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito.
2. Tab a través de los botones +/- y "Eliminar" de una línea.
3. Activar cada uno con Enter/Espacio.

**Expected result**: Cada control se activa igual que con click de mouse.

**Notes**: No ejercitado explícitamente en esta sesión.

---

### TC-CARR-CARRITO-053: Cerrar y reabrir el offcanvas mantiene el estado actualizado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Abrir el carrito, modificar una cantidad, cerrar el offcanvas.
2. Reabrir el carrito.

**Expected result**: El offcanvas muestra el estado actualizado (la cantidad modificada), no el
original.

**Notes**: —

---

### TC-CARR-CARRITO-054: Vaciar el carrito actualiza el badge en la misma pestaña sin recargar

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem, badge visible.

**Steps**:
1. Abrir el carrito y click en "Vaciar carrito".
2. Sin recargar, inspeccionar el botón "Carrito".

**Expected result**: El badge desaparece de inmediato, sin necesidad de recargar la página.

**Notes**: —

---

### TC-CARR-CARRITO-055: El total muestra `$0` cuando el carrito solo tiene entradas inválidas

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":9999,"qty":1}]`.

**Steps**:
1. Abrir el carrito.
2. Inspeccionar `#cart-total`.

**Expected result**: `#cart-total` muestra `"$0"`.

**Notes**: Ligado al defecto TC-035/DEF-002 — el total en `$0` sin filas visibles es parte del
mismo estado inconsistente.

---

## Mandatory coverage checklist

- [x] Access: unauthenticated user redirected to login — N/A, no hay login
- [x] Access: role without permission receives error or empty page — N/A, no hay roles
- [x] Happy path: primary workflow with valid data succeeds — TC-008 a TC-013, TC-027 a TC-029
- [ ] Negative: required field missing → validation error shown — N/A, no hay formularios en
      este submódulo
- [x] Negative: duplicate record → system rejects with error message — N/A directo, pero
      TC-014/TC-015/TC-020 cubren los límites equivalentes de cantidad
- [x] Negative: invalid format → format error shown — TC-017 a TC-020 (cantidad inválida,
      saneada correctamente), TC-035/TC-036 (entrada con producto inexistente, defecto)
- [x] State transition: state changes correctly on action — TC-012 a TC-014, TC-021, TC-023,
      TC-027
- [ ] Export/download: file is generated — N/A, feature inexistente
- [ ] Pagination/search: filtering works correctly — N/A, no aplica a este submódulo
