# Business Rules — Catálogo: Detalle de producto

### RN-CAT-007: Resolución de producto por parámetro `id` en la URL

- **Type**: Validation
- **Trigger**: Carga de `product.html?id={valor}`
- **Behavior**: Si `{valor}` resuelve (vía comparación no estricta, ej. `==` o `parseInt`) a un
  entero entre 1 y 49, se renderiza el producto correspondiente. `"01"` y `"1.5"` resuelven al
  producto `1`. Cualquier otro caso (parámetro ausente, no numérico, `0`, negativo, o entero fuera
  de 1–49) redirige silenciosamente a `index.html`, sin mensaje de error ni página 404 dedicada.
- **Error message**: Ninguno — es una redirección silenciosa, no un mensaje de validación.
- **Notes**: Verificado explícitamente con `id` = ausente, `abc`, `0`, `-1`, `50`, `9999`, `01` y
  `1.5` en esta sesión. Candidato a TC negativo fuerte porque no da feedback al usuario de que su
  URL era inválida.

### RN-CAT-008: Límites del selector de cantidad vía botones +/-

- **Type**: Validation
- **Trigger**: Click en "Reducir cantidad" o "Aumentar cantidad"
- **Behavior**: El valor del input queda siempre clampeado entre 1 y 99 inclusive. En el límite
  inferior (`qty=1`), "Reducir cantidad" no decrementa (el botón permanece habilitado, sin
  atributo `disabled`, pero el click no tiene efecto). En el límite superior (`qty=99`),
  "Aumentar cantidad" no incrementa.
- **Notes**: El input también expone `min="1" max="99"` como atributos HTML nativos, pero estos
  no bloquean la edición manual del valor (ver RN-CAT-009 y RN-CAT-010) — el clamping real para
  los botones +/- lo hace JavaScript de la aplicación, no el atributo HTML.

### RN-CAT-009: Sanitización de cantidad ≤ 0 o vacía al agregar desde el detalle

- **Type**: Validation
- **Trigger**: Click en "Agregar al carrito" con el input de cantidad en `0`, vacío, o un valor
  negativo (obtenido editando el input directamente, ej. pegado o `fill` programático — no vía
  los botones +/-, que ya están clampeados por RN-CAT-008)
- **Behavior**: El sistema agrega `qty: 1` al carrito, ignorando el valor inválido del input.
- **Notes**: Verificado con los valores `"0"`, `"-5"` y `""` (vacío) en esta sesión — los tres
  resultan en `qty: 1` agregado al carrito.

### RN-CAT-010: Cantidad por sobre el máximo no se sanea al agregar desde el detalle (DEFECTO)

- **Type**: Validation
- **Trigger**: Click en "Agregar al carrito" con el input de cantidad en un valor mayor a 99
  (obtenido editando el input directamente, no vía el botón "+", que sí está clampeado por
  RN-CAT-008)
- **Behavior esperado**: El sistema debería clampear a 99, de forma simétrica a RN-CAT-009.
- **Behavior observado**: El sistema agrega el valor tal cual al carrito. Verificado con `"150"`:
  `unicornt_cart` queda `[{"id":1,"qty":150}]`.
- **Error message**: Ninguno.
- **Notes**: Ver defecto formal `qa/06-defects/open/DEF-001-limite-maximo-cantidad-no-respetado-al-agregar.md`.
  Es la misma causa raíz que RN-CAT-004 (listado): el flujo de "Agregar" no valida el máximo, solo
  los botones +/- del selector lo hacen.

### RN-CAT-011: Agregación de cantidad al agregar desde el detalle sobre un producto ya en el carrito

- **Type**: Calculation
- **Trigger**: Click en "Agregar al carrito" para un producto que ya tiene una entrada en
  `unicornt_cart`
- **Behavior**: La cantidad seleccionada en el detalle se suma a la `qty` existente; no se crea
  una entrada duplicada.
- **Notes**: Comparte comportamiento con RN-CAT-003 (listado). Verificado de forma cruzada:
  agregar 1 desde el listado y luego 1 más desde el detalle del mismo producto resulta en
  `qty: 2`.

### RN-CAT-012: No se aplica el límite máx=99 al agregar desde el detalle sobre un ítem ya en el máximo (DEFECTO)

- **Type**: Validation
- **Trigger**: Click en "Agregar al carrito" cuando `qty_existente_en_carrito + qty_seleccionada
  > 99`
- **Behavior observado**: La suma se persiste sin clamping (ej. `99 + 1 = 100`).
- **Notes**: Mismo defecto raíz que RN-CAT-004 (listado) y RN-CAT-010 (detalle, entrada nueva).
  Ver DEF-001.

### RN-CAT-015: El selector de cantidad del detalle no persiste entre recargas

- **Type**: State Machine
- **Trigger**: Recargar `product.html?id={id}` después de haber ajustado la cantidad (sin hacer
  click en "Agregar al carrito")
- **Behavior**: El input de cantidad vuelve a su valor inicial (`1`) tras el reload. Solo el
  contenido de `unicornt_cart` persiste entre cargas — la selección de cantidad en pantalla es
  estado efímero de la página, no se guarda en ningún lado.
- **Notes**: Verificado incrementando la cantidad a un valor >1 y recargando.

### RN-CAT-016: El detalle reutiliza el mismo componente de toast que el listado, con un mensaje distinto

- **Type**: Integration
- **Trigger**: Click en "Agregar al carrito" desde el detalle
- **Behavior**: Se dispara el mismo elemento `#cart-toast` (estilo éxito) y se actualiza el
  mismo badge del botón "Carrito" del navbar que en el listado — mismo componente, misma capa
  de UI. **El texto del mensaje es distinto**: el listado muestra el genérico
  `"¡Producto agregado al carrito!"` (ver `submodule-listado/01-business-rules.md`
  RN-CAT-002), mientras que el detalle interpola el nombre del producto:
  `"¡{Nombre del producto} agregado al carrito!"` (ej. `"¡Polera 'I Can Explain It To You'
  agregado al carrito!"` para id=1).
- **Notes**: Corregido 2026-08-26 durante Stage 5 (automatización) — el texto exacto del
  mensaje del detalle no se había verificado byte a byte en Stage 1 y se documentó
  incorrectamente como idéntico al del listado hasta que un test automatizado lo hizo fallar.
  Confirma que CAT/LISTADO y CAT/DETALLE comparten la misma capa de UI de carrito
  (`assets/js/cart.js`), consistente con `qa/memory/arquitectura-unicornstore-2026-08-26.md`.
