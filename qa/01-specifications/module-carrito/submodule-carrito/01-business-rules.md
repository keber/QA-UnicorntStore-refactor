# Business Rules — Carrito: Carrito de compras (offcanvas)

### RN-CARR-001: Estado vacío del carrito

- **Type**: State Machine
- **Trigger**: Apertura del offcanvas con `unicornt_cart` vacío o inexistente
- **Behavior**: `#cart-items` muestra el mensaje `"El carrito está vacío."` con un ícono; el
  footer completo (`#cart-footer`, que contiene el Total y los botones "Finalizar compra"/"Vaciar
  carrito") se oculta vía `style="display:none"`.
- **Notes**: Verificado inspeccionando el DOM con el carrito recién limpiado.

### RN-CARR-002: Cálculo del subtotal por línea y del total

- **Type**: Calculation
- **Trigger**: Renderizado de cada línea de producto / cualquier cambio de cantidad
- **Behavior**: El subtotal de cada línea es `precio_unitario × qty`. El total (`#cart-total`) es
  la suma de los subtotales de todas las líneas. Ambos se recalculan inmediatamente al agregar,
  quitar o modificar la cantidad de cualquier ítem.
- **Notes**: Verificado con 2 líneas (`qty:2` a $13.990 y `qty:1` a $14.990 → subtotales $27.980 y
  $14.990, total $42.970).

### RN-CARR-003: El stepper "−" en qty=1 elimina la línea

- **Type**: State Machine
- **Trigger**: Click en el botón "Reducir" de una línea cuya cantidad actual es 1
- **Behavior**: La línea se elimina completamente de `unicornt_cart`, en vez de quedar bloqueada
  en 1.
- **Notes**: Comportamiento **distinto** al selector de cantidad del detalle de producto
  (`submodule-detalle` RN-CAT-008), que sí bloquea en 1 sin eliminar nada. Es un comportamiento
  intencional del carrito (equivalente a "quitar el último del carrito"), no un defecto — pero
  debe documentarse porque difiere de DETALLE.

### RN-CARR-004: El stepper "+" no incrementa por sobre 99

- **Type**: Validation
- **Trigger**: Click en el botón "Aumentar" de una línea con `qty=99`
- **Behavior**: La cantidad permanece en 99.
- **Notes**: Consistente con el límite declarado (`max="99"` en el input).

### RN-CARR-005: La edición manual de cantidad en el carrito SÍ sanea y clampea correctamente

- **Type**: Validation
- **Trigger**: Edición directa del input de cantidad de una línea (no vía los botones +/-)
- **Behavior**: Un valor `≤0` o vacío se sanea a `1`; un valor `>99` se clampea a `99`; un valor
  dentro de 1–99 se acepta tal cual.
- **Notes**: **Importante — contraste con DEF-001**: este mismo tipo de edición manual, cuando se
  hace en el flujo de "Agregar" del listado/detalle (`submodule-listado` RN-CAT-004,
  `submodule-detalle` RN-CAT-010/012), NO se sanea correctamente. Esto indica que el código de
  validación de "editar línea existente" (correcto) y el de "agregar/incrementar al agregar"
  (con el defecto) son rutas distintas en la aplicación. Verificado con `500` → `99`, `0` → `1`,
  `-5` → `1`, vacío → `1`.

### RN-CARR-006: "Eliminar" quita la línea completa sin confirmación

- **Type**: State Machine
- **Trigger**: Click en el botón "Eliminar" de cualquier línea
- **Behavior**: La línea se elimina de `unicornt_cart` inmediatamente, sin importar su cantidad y
  sin ningún diálogo de confirmación.
- **Notes**: —

### RN-CARR-007: "Vaciar carrito" elimina todas las líneas sin confirmación

- **Type**: State Machine
- **Trigger**: Click en "Vaciar carrito"
- **Behavior**: `unicornt_cart` pasa a `[]` inmediatamente, sin diálogo de confirmación. El
  offcanvas vuelve al estado vacío (RN-CARR-001).
- **Notes**: —

### RN-CARR-008: "Finalizar compra" confirma una orden real vía la API — `SUPERSEDED` (Stage 6, 2026-09-06)

- **Type**: State Machine
- **Estado**: `SUPERSEDED`. La versión pre-refactor de esta regla ("simulación sin backend, toast
  `¡Gracias por tu compra!…`, sin orden, sin red") **ya no aplica**.
- **Trigger**: Submit del formulario `#checkout-form` ("Finalizar compra")
- **Behavior esperado (post-refactor)**: con una sesión autenticada y un carrito no vacío, el
  submit hace `POST /api/v1/orders` con `{shippingAddress:{street,city,region,zipCode?}}` →
  `201 {id,status:"CONFIRMED",total}`; el carrito queda vacío, el offcanvas se cierra y se muestra
  una confirmación de éxito. La orden queda consultable en `GET /api/v1/orders`.
- **Behavior observado**: roto de punta a punta — ver **DEF-004** (el carrito del navegador nunca
  se sincroniza con el del servidor; `POST /orders` corre contra carrito vacío → error genérico
  "No se pudo procesar tu compra"). El toast literal de agradecimiento fue eliminado.
- **Notes**: La reescritura formal del workflow de checkout (FL-CARR-*) y sus TCs queda para el
  sprint de re-baseline. En Stage 6 los TCs afectados son guards `test.fail()` de DEF-004.

### RN-CARR-009: Entrada de carrito con producto inexistente deja la UI inconsistente (DEFECTO)

- **Type**: Validation
- **Trigger**: `unicornt_cart` contiene una entrada cuyo `id` no corresponde a ningún producto del
  catálogo actual (ej. `{"id":9999,"qty":1}` — escenario realista si el catálogo cambia entre
  despliegues mientras el carrito de un cliente persiste en su navegador)
- **Behavior esperado**: El sistema debería, como mínimo, ignorar la entrada inválida y mostrar el
  estado vacío si no quedan entradas válidas, o mostrar algún indicio de que una línea no pudo
  resolverse.
- **Behavior observado**: `#cart-items` no muestra ninguna fila de producto NI el mensaje de
  "carrito vacío"; `#cart-footer` se muestra igualmente (no está oculto), con Total `"$0"`; el
  badge del botón "Carrito" sigue contando la `qty` de la entrada inválida (ej. muestra "1").
  "Finalizar compra" completa "exitosamente" sobre este estado, mostrando el mismo toast de éxito
  que una compra real.
- **Error message**: Ninguno.
- **Notes**: Ver defecto formal
  `qa/06-defects/open/DEF-002-entrada-de-carrito-con-producto-inexistente-deja-ui-inconsistente.md`.

### RN-CARR-010: Cierre del offcanvas por teclado (Escape) y por click en el backdrop

- **Type**: Access Control
- **Trigger**: Presionar Escape con el offcanvas abierto, o hacer click fuera de él
  (`.offcanvas-backdrop`)
- **Behavior**: El offcanvas se cierra en ambos casos (comportamiento estándar de Bootstrap, sin
  `data-bs-keyboard="false"` ni `data-bs-backdrop="static"` configurados).
- **Notes**: Verificado ambos mecanismos en esta sesión.

### RN-CARR-011: El carrito es compartido entre todas las páginas del sitio

- **Type**: State Machine
- **Trigger**: Abrir el offcanvas desde `index.html` o desde `product.html?id={id}`
- **Behavior**: El contenido, estructura y comportamiento del offcanvas son idénticos en ambas
  páginas, porque ambas leen/escriben el mismo `localStorage['unicornt_cart']`.
- **Notes**: Verificado navegando entre ambas páginas con el mismo carrito poblado.
