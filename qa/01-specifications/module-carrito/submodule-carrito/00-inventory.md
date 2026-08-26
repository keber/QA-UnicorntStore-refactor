# MODULE: Carrito — Submodule: Carrito de compras (offcanvas)

| Field | Value |
|-------|-------|
| Module code | CARR |
| Submodule code | CARRITO |
| Primary URL | Presente en todas las páginas (`index.html`, `product.html?id={id}`), disparado por el botón "Carrito" del navbar |
| Status | Active |
| Last updated | 2026-08-26 |

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Botón "Carrito" (navbar) | button | N/A | `data-bs-toggle="offcanvas"` `data-bs-target="#cartOffcanvas"`. Ya inventariado en CAT; abre este submódulo |
| Offcanvas `#cartOffcanvas` | dialog (Bootstrap offcanvas) | N/A | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="cartOffcanvasLabel"` |
| Título "Tu carrito" | heading (h5) | N/A | Incluye ícono `fa-cart-shopping` |
| Botón "Cerrar" (header) | button | N/A | `data-bs-dismiss="offcanvas"`, `aria-label="Cerrar"` |
| Contenedor `#cart-items` | composite | N/A | `overflow-auto`, `flex-grow-1` — lista scrolleable de líneas de producto |
| Mensaje de carrito vacío | text | N/A | `"El carrito está vacío."` + ícono `fa-box-open`, se muestra solo cuando `unicornt_cart` está vacío |
| Línea de producto (`.cart-item`) | composite | N/A | Repetida por cada entrada de `unicornt_cart` — ver estructura abajo |
| — Imagen del producto | img | N/A | Thumbnail 72×72, `alt` = nombre del producto |
| — Nombre del producto | text | N/A | — |
| — Precio unitario | text | N/A | Formato `"$XX.990 c/u"` |
| — Selector de cantidad (`.qty-selector`) | composite | Sí | Botón "Reducir" (`.btn-cart-minus`, aria-label="Reducir"), `input[type=number]` `.cart-qty-input` (`min="1" max="99"`, aria-label="Cantidad"), botón "Aumentar" (`.btn-cart-plus`, aria-label="Aumentar") |
| — Botón "Eliminar" | button | N/A | `.btn-cart-remove`, ícono de tacho, `aria-label="Eliminar"` |
| — Subtotal de línea | text | N/A | `precio unitario × cantidad`, formato `"$XX.XXX"` |
| Footer `#cart-footer` | composite | N/A | Oculto (`style="display:none"`) cuando el carrito está vacío |
| — Total | text | N/A | `#cart-total`, suma de todos los subtotales, formato `"$XX.XXX"` |
| — Botón "Finalizar compra" | button | N/A | `#btn-checkout`, simulado: vacía el carrito, cierra el offcanvas, muestra toast de éxito |
| — Botón "Vaciar carrito" | button | N/A | `#btn-clear-cart`, vacía `unicornt_cart` sin confirmación |
| Toast de confirmación (`#cart-toast`) | toast (Bootstrap) | N/A | Mismo elemento compartido con CAT; mensaje varía según la acción (ver `01-business-rules.md`) |

## API Endpoints

Ninguno. Todo el estado del carrito vive en `localStorage['unicornt_cart']`
(`Array<{id: number, qty: number}>`); "Finalizar compra" no realiza ninguna llamada de red — se
confirmó con `requests` de `playwright-cli` que la acción no genera tráfico no estático.

## Notas adicionales

- El offcanvas y su contenido son idénticos en `index.html` y `product.html` — no hay lógica
  distinta por página.
- No existe ningún paso de checkout real: no hay dirección de envío, medio de pago, ni página de
  confirmación con número de orden.
