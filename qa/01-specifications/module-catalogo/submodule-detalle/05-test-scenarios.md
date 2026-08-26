# Test Scenarios — Catálogo: Detalle de producto

**Module code**: CAT
**Submodule code**: DETALLE
**Last updated**: 2026-08-26

## Summary

| Priority | Count | Automated | Manual |
|----------|-------|-----------|--------|
| P0 | 12 | 0 | 12 |
| P1 | 20 | 0 | 20 |
| P2 | 16 | 0 | 16 |
| P3 | 7 | 0 | 7 |
| **Total** | **55** | **0** | **55** |

---

### TC-CAT-DETALLE-001: Navegar a un `id` válido carga el detalle correcto

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `{{QA_BASE_URL}}/product.html?id=1`.

**Expected result**: Se renderiza el detalle del producto "Polera 'I Can Explain It To You'"; el
título de la pestaña es `"Polera 'I Can Explain It To You' - Unicorn't Store"`.

**Notes**: —

---

### TC-CAT-DETALLE-002: El breadcrumb muestra "Inicio / {nombre del producto}"

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el breadcrumb.

**Expected result**: Se muestra `"Inicio / {nombre exacto del producto}"`.

**Notes**: —

---

### TC-CAT-DETALLE-003: El breadcrumb "Inicio" navega a `index.html`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Click en "Inicio" del breadcrumb.

**Expected result**: Navega a `index.html` con las 49 tarjetas del listado.

**Notes**: —

---

### TC-CAT-DETALLE-004: La imagen del producto tiene `alt` correcto

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el `alt` de la imagen.

**Expected result**: El `alt` coincide exactamente con el nombre del producto.

**Notes**: —

---

### TC-CAT-DETALLE-005: El nombre del producto se muestra como heading h1

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el nivel del heading del nombre.

**Expected result**: Es un `heading` de nivel 1 (jerarquía correcta para una página de detalle).

**Notes**: —

---

### TC-CAT-DETALLE-006: El precio se muestra en formato `"$XX.990"`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el precio.

**Expected result**: El precio sigue el patrón `/^\$\d{1,2}\.\d{3}$/`.

**Notes**: —

---

### TC-CAT-DETALLE-007: La descripción completa del producto se muestra

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.

**Expected result**: Se muestra un párrafo con la descripción completa del producto.

**Notes**: —

---

### TC-CAT-DETALLE-008: El selector de cantidad inicia en 1

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el valor del input de cantidad.

**Expected result**: El valor inicial es `1`.

**Notes**: —

---

### TC-CAT-DETALLE-009: "Aumentar cantidad" incrementa el valor en 1

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Click en "Aumentar cantidad".

**Expected result**: El input pasa de `1` a `2`.

**Notes**: —

---

### TC-CAT-DETALLE-010: "Reducir cantidad" decrementa el valor en 1

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Cantidad en 2 o más.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Click en "Aumentar cantidad" (queda en 2).
3. Click en "Reducir cantidad".

**Expected result**: El input vuelve a `1`.

**Notes**: —

---

### TC-CAT-DETALLE-011: "Reducir cantidad" no decrementa por debajo de 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Cantidad en 1 (valor inicial).

**Steps**:
1. Navegar al detalle de cualquier producto (cantidad = 1).
2. Click en "Reducir cantidad".

**Expected result**: El input permanece en `1`. El botón no se deshabilita visualmente, pero el
click no tiene efecto.

**Notes**: Ver RN-CAT-008.

---

### TC-CAT-DETALLE-012: "Aumentar cantidad" no incrementa por sobre 99

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Cantidad en 99.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Editar el input a `99` (o llegar ahí con clicks).
3. Click en "Aumentar cantidad".

**Expected result**: El input permanece en `99`.

**Notes**: Ver RN-CAT-008. Verificado en esta sesión con `fill("99")` + click en "+".

---

### TC-CAT-DETALLE-013: El input de cantidad expone `min="1"` y `max="99"`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar los atributos HTML del input `#qty-input`.

**Expected result**: `type="number"`, `min="1"`, `max="99"`.

**Notes**: Estos atributos no bloquean por sí solos la edición manual fuera de rango — ver
TC-015 a TC-018.

---

### TC-CAT-DETALLE-014: Editar la cantidad a un valor válido y agregar refleja esa cantidad

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle del producto id=1.
2. Editar el input de cantidad a `25`.
3. Click en "Agregar al carrito".
4. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":25}]`.

**Notes**: —

---

### TC-CAT-DETALLE-015: Cantidad `0` al agregar se sanea a 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle del producto id=1.
2. Editar el input de cantidad directamente a `0`.
3. Click en "Agregar al carrito".
4. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]` (no se agrega `qty:0`).

**Notes**: Ver RN-CAT-009. Verificado en esta sesión.

---

### TC-CAT-DETALLE-016: Cantidad negativa al agregar se sanea a 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle del producto id=1.
2. Editar el input de cantidad directamente a `-5`.
3. Click en "Agregar al carrito".
4. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: Ver RN-CAT-009. Verificado en esta sesión.

---

### TC-CAT-DETALLE-017: Cantidad vacía al agregar se sanea a 1

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle del producto id=1.
2. Vaciar completamente el input de cantidad.
3. Click en "Agregar al carrito".
4. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: Ver RN-CAT-009. Verificado en esta sesión.

---

### TC-CAT-DETALLE-018: [DEFECTO] Cantidad > 99 al agregar no se clampea

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle del producto id=1.
2. Editar el input de cantidad directamente a `150`.
3. Click en "Agregar al carrito".
4. Inspeccionar `unicornt_cart`.

**Expected result esperado**: `qty` debería clampearse a `99`.

**Resultado actual (defecto)**: `unicornt_cart` = `[{"id":1,"qty":150}]`.

**Notes**: Ver DEF-001 y RN-CAT-010.

---

### TC-CAT-DETALLE-019: El input de cantidad no acepta letras vía tipeo directo

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Intentar tipear `"abc"` en el input de cantidad.

**Expected result**: El navegador bloquea la entrada de caracteres no numéricos (comportamiento
nativo de `input[type=number]`); el valor no cambia.

**Notes**: Verificado: el intento de `fill("abc")` fue rechazado por Playwright con el error
"Cannot type text into input[type=number]".

---

### TC-CAT-DETALLE-020: "Agregar al carrito" crea la entrada en `localStorage`

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle del producto id=1 (cantidad = 1 por defecto).
2. Click en "Agregar al carrito".
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: —

---

### TC-CAT-DETALLE-021: Agregar desde el detalle sobre un producto ya en el carrito acumula la cantidad

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Steps**:
1. Navegar al detalle del producto id=1 con la precondición anterior.
2. Agregar 1 unidad más ("Agregar al carrito" con cantidad=1).
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":2}]`.

**Notes**: Ver RN-CAT-011.

---

### TC-CAT-DETALLE-022: [DEFECTO] Agregar desde el detalle que excede 99 no se clampea

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":99}]`.

**Steps**:
1. Navegar al detalle del producto id=1 con la precondición anterior.
2. Agregar 1 unidad más.
3. Inspeccionar `unicornt_cart`.

**Expected result esperado**: `qty` debería permanecer en 99.

**Resultado actual (defecto)**: `unicornt_cart` = `[{"id":1,"qty":100}]`.

**Notes**: Ver DEF-001 y RN-CAT-012.

---

### TC-CAT-DETALLE-023: "Volver" navega a `index.html`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Click en "Volver".

**Expected result**: Navega a `index.html`.

**Notes**: —

---

### TC-CAT-DETALLE-024: `id` fuera de rango redirige silenciosamente al listado

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=9999`.

**Expected result**: Redirige a `index.html`, sin mensaje de error.

**Notes**: Ver RN-CAT-007.

---

### TC-CAT-DETALLE-025: `id` no numérico redirige silenciosamente al listado

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=abc`.

**Expected result**: Redirige a `index.html`.

**Notes**: —

---

### TC-CAT-DETALLE-026: `id` ausente redirige silenciosamente al listado

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html` (sin query string).

**Expected result**: Redirige a `index.html`.

**Notes**: —

---

### TC-CAT-DETALLE-027: `id=0` redirige silenciosamente al listado

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=0`.

**Expected result**: Redirige a `index.html`.

**Notes**: —

---

### TC-CAT-DETALLE-028: `id` negativo redirige silenciosamente al listado

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=-1`.

**Expected result**: Redirige a `index.html`.

**Notes**: —

---

### TC-CAT-DETALLE-029: `id=50` (uno por sobre el último válido) redirige silenciosamente

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=50`.

**Expected result**: Redirige a `index.html`.

**Notes**: Boundary test — confirma que el catálogo tiene exactamente 49 productos.

---

### TC-CAT-DETALLE-030: `id="01"` (cero a la izquierda) resuelve al producto 1

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=01`.

**Expected result**: Se renderiza el producto id=1 (comparación no estricta).

**Notes**: Ver RN-CAT-007. No es un bug — documenta el comportamiento real de parsing.

---

### TC-CAT-DETALLE-031: `id="1.5"` (decimal) resuelve al producto 1

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=1.5`.

**Expected result**: Se renderiza el producto id=1 (truncamiento/`parseInt`).

**Notes**: Ver RN-CAT-007.

---

### TC-CAT-DETALLE-032: `id=1` (primer producto válido) renderiza correctamente

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=1`.

**Expected result**: Se renderiza "Polera 'I Can Explain It To You'" ($13.990).

**Notes**: Boundary inferior.

---

### TC-CAT-DETALLE-033: `id=49` (último producto válido) renderiza correctamente

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=49`.

**Expected result**: Se renderiza "Polera 'Quality Assurance Vol. 2'" ($13.990).

**Notes**: Boundary superior.

---

### TC-CAT-DETALLE-034: El header en detalle mantiene los mismos enlaces que en listado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Comparar el navbar con el del listado.

**Expected result**: Mismos enlaces: "Inicio", "Contacto", botón "Carrito".

**Notes**: —

---

### TC-CAT-DETALLE-035: "Contacto" en detalle navega a `index.html#contacto`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el `href` de "Contacto".

**Expected result**: `href="index.html#contacto"` (ruta absoluta, a diferencia del listado donde
es `#contacto` relativo al propio documento).

**Notes**: Diferencia esperada por tratarse de una página distinta.

---

### TC-CAT-DETALLE-036: El footer en detalle es idéntico al del listado

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto y hacer scroll al footer.
2. Comparar con el footer del listado.

**Expected result**: Mismo contenido (descripción, links rápidos, contacto, redes sociales,
copyright).

**Notes**: —

---

### TC-CAT-DETALLE-037: No se observan llamadas de red a `/api` al cargar el detalle

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto con captura de network habilitada.
2. Revisar todas las requests no estáticas.

**Expected result**: 0 llamadas XHR/fetch a `/api/*`.

**Notes**: —

---

### TC-CAT-DETALLE-038: El toast de confirmación también aparece al agregar desde el detalle, con el nombre del producto interpolado

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | Yes |
| Playwright | `tests/catalogo/detalle.spec.ts` (via `ProductDetailPage.addToCart()`, verificación parcial dentro de los TCs P0; falta un TC P1 dedicado a la interpolación exacta) |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle del producto id=1.
2. Click en "Agregar al carrito".
3. Inspeccionar el DOM del toast.

**Expected result**: El toast contiene `"¡Polera 'I Can Explain It To You' agregado al
carrito!"` — el mismo componente `#cart-toast` que el listado, pero con un mensaje que
interpola el nombre del producto (`"¡{Nombre del producto} agregado al carrito!"`), distinto
del genérico `"¡Producto agregado al carrito!"` del listado.

**Notes**: Corregido 2026-08-26 durante Stage 5 — el texto exacto no se había verificado byte a
byte en Stage 1 (se asumió igual al del listado sin confirmarlo) hasta que un test automatizado
lo hizo fallar. Ver RN-CAT-016.

---

### TC-CAT-DETALLE-039: El badge del botón "Carrito" se actualiza al agregar desde el detalle

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Click en "Agregar al carrito".
3. Inspeccionar el botón "Carrito".

**Expected result**: El badge pasa a mostrar la cantidad agregada.

**Notes**: —

---

### TC-CAT-DETALLE-040: El carrito persiste tras recargar la página de detalle

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Agregar un producto desde el detalle.
2. Recargar la página (`F5`).
3. Inspeccionar `unicornt_cart` y el badge.

**Expected result**: El carrito no cambia tras el reload.

**Notes**: —

---

### TC-CAT-DETALLE-041: "Aumentar cantidad" es accesible por teclado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Tab hasta enfocar "Aumentar cantidad".
3. Presionar Enter o Espacio.

**Expected result**: El valor de cantidad se incrementa igual que con click.

**Notes**: No ejercitado explícitamente en esta sesión.

---

### TC-CAT-DETALLE-042: El spinbutton de cantidad tiene `aria-label="Cantidad"`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el `aria-label` del input de cantidad.

**Expected result**: `aria-label="Cantidad"`.

**Notes**: —

---

### TC-CAT-DETALLE-043: Los botones +/- tienen `aria-label` descriptivo

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Inspeccionar el `aria-label` de ambos botones.

**Expected result**: `"Reducir cantidad"` y `"Aumentar cantidad"` respectivamente.

**Notes**: —

---

### TC-CAT-DETALLE-044: Recargar la página reinicia la cantidad seleccionada a 1

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Incrementar la cantidad a un valor > 1 (sin agregar al carrito).
3. Recargar la página.

**Expected result**: El input de cantidad vuelve a `1` — el selector de cantidad no persiste,
solo el carrito (`unicornt_cart`) persiste.

**Notes**: —

---

### TC-CAT-DETALLE-045: Doble click rápido en "Aumentar cantidad" incrementa exactamente 2

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Hacer doble click rápido en "Aumentar cantidad".

**Expected result**: El input queda en `3` (1 inicial + 2), sin condiciones de carrera que
resulten en un valor distinto.

**Notes**: No ejercitado explícitamente en esta sesión.

---

### TC-CAT-DETALLE-046: Cambiar el `id` en la URL actualiza el detalle al nuevo producto

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `product.html?id=1`.
2. Navegar a `product.html?id=2` (nueva navegación, no es SPA).

**Expected result**: Se renderiza el producto id=2 ("Polera 'Cloud Architect'").

**Notes**: Al ser multi-página (no SPA), cada cambio de `id` implica una carga completa nueva.

---

### TC-CAT-DETALLE-047: El detalle en viewport móvil mantiene los controles operables

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Configurar viewport móvil (ej. 375×812).
2. Navegar al detalle de cualquier producto.

**Expected result**: Imagen, selector de cantidad y botón "Agregar al carrito" son visibles y
operables sin overflow horizontal.

**Notes**: No ejercitado en esta sesión (exploración en viewport desktop).

---

### TC-CAT-DETALLE-048: Precio y nombre coinciden entre listado y detalle para el mismo `id`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Anotar nombre y precio del producto id=1 en el listado.
2. Navegar al detalle de id=1.
3. Comparar.

**Expected result**: Nombre y precio son idénticos en ambas vistas.

**Notes**: —

---

### TC-CAT-DETALLE-049: Descripción coincide entre listado y detalle para el mismo `id`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Anotar la descripción del producto id=1 en el listado.
2. Navegar al detalle de id=1.
3. Comparar.

**Expected result**: La descripción es idéntica en ambas vistas.

**Notes**: —

---

### TC-CAT-DETALLE-050: No existe selector de talla/color/variante

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | PENDING-CODE |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Buscar cualquier control de selección de variante.

**Expected result**: No existe ningún selector de talla, color u otra variante — el producto es
de opción única.

**Notes**: Confirma que el catálogo actual no maneja variantes; relevante si el refactor las
introduce.

---

### TC-CAT-DETALLE-051: No existe sección de reseñas/calificaciones

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | PENDING-CODE |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.

**Expected result**: No existe ninguna sección de reseñas ni calificación por estrellas.

**Notes**: —

---

### TC-CAT-DETALLE-052: No existe sección de "productos relacionados"

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | PENDING-CODE |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.

**Expected result**: No existe ninguna sección de "productos relacionados" o "también te puede
interesar".

**Notes**: —

---

### TC-CAT-DETALLE-053: La consola no muestra errores críticos de aplicación al cargar el detalle

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto con captura de consola habilitada.

**Expected result**: No hay errores de JavaScript de la aplicación (el `404` de `favicon.ico` es
un hallazgo menor no bloqueante, común a todo el sitio).

**Notes**: —

---

### TC-CAT-DETALLE-054: Agregar productos distintos desde sus detalles crea entradas independientes

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al detalle de id=1 y agregar al carrito.
2. Navegar al detalle de id=2 y agregar al carrito.
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` contiene dos entradas independientes: `{"id":1,"qty":1}` y
`{"id":2,"qty":1}`.

**Notes**: —

---

### TC-CAT-DETALLE-055: El botón "Agregar al carrito" es accesible por teclado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al detalle de cualquier producto.
2. Tab hasta enfocar "Agregar al carrito".
3. Presionar Enter o Espacio.

**Expected result**: El producto se agrega al carrito igual que con click de mouse.

**Notes**: No ejercitado explícitamente en esta sesión.

---

## Mandatory coverage checklist

- [x] Access: unauthenticated user redirected to login — N/A, no hay login
- [x] Access: role without permission receives error or empty page — N/A, no hay roles
- [x] Happy path: primary workflow with valid data succeeds — TC-001, TC-014, TC-020
- [ ] Negative: required field missing → validation error shown — N/A, no hay formularios en
      este submódulo (el input de cantidad no es un formulario de envío tradicional)
- [x] Negative: duplicate record → system rejects with error message — TC-021 (agregación), TC-022
      (defecto de límite)
- [x] Negative: invalid format → format error shown — TC-024 a TC-031 (`id` inválido/boundary),
      TC-015 a TC-019 (cantidad inválida) — nota: el sistema no muestra un mensaje de error
      explícito, redirige o sanea silenciosamente; esto está documentado como comportamiento
      observado, no como validación con feedback
- [x] State transition: state changes correctly on action — TC-009, TC-010, TC-020
- [ ] Export/download: file is generated — N/A, feature inexistente
- [ ] Pagination/search: filtering works correctly — N/A, no aplica a esta vista de detalle
