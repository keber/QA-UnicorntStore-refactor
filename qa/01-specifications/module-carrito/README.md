# MODULE: Carrito (CARR)

> Stage 1 (module analysis) completado 2026-08-26 vía exploración en vivo con `playwright-cli`
> contra `https://unicornt-store.keber.cl`. Complementa el análisis de CAT (ver
> `qa/01-specifications/module-catalogo/`) — el carrito es el offcanvas de Bootstrap presente en
> todas las páginas del sitio, disparado desde el mismo botón "Carrito" del navbar ya inventariado
> en CAT. Stage 2 (`qa-spec-generation`) revisado el mismo día: las 11 business rules
> (RN-CARR-001 a RN-CARR-011) y los 5 workflows (FL-CARR-001 a FL-CARR-005) ya cubrían el rango
> típico y las 3 ramas obligatorias (happy path, cancelación, error) sin cambios necesarios.

## Submódulos

| Código | Nombre | Ruta | TCs documentados | Estado |
|---|---|---|---|---|
| CARRITO | Carrito de compras (offcanvas) | presente en todas las páginas | 55 | ✅ Analizado |

## Hallazgos clave de esta sesión

- El carrito es un offcanvas de Bootstrap (`#cartOffcanvas`) idéntico y compartido entre
  `index.html` y `product.html`, persistido 100% en `localStorage['unicornt_cart']`.
- El stepper de cantidad **dentro del carrito** (edición manual del input, no solo los botones
  +/-) sí sanea y clampea correctamente (`≤0`/vacío → 1, `>99` → 99) — a diferencia del flujo de
  "Agregar" del listado/detalle, que tiene el defecto `DEF-001`. Esto acota la causa raíz de
  `DEF-001` al código de "alta/incremento al agregar", no al de "edición de línea existente".
- Al llegar a `qty=1` y presionar "−", la línea se **elimina** en vez de quedar bloqueada en 1
  (comportamiento distinto e intencional respecto al selector de cantidad del detalle, que sí
  bloquea en 1).
- **Nuevo defecto encontrado**: una entrada de `unicornt_cart` cuyo `id` ya no existe en el
  catálogo (ej. tras una actualización del catálogo) deja el offcanvas en un estado inconsistente:
  no muestra ninguna fila de producto, tampoco el mensaje de "carrito vacío", pero sí muestra el
  footer con Total `$0` y permite "Finalizar compra" con éxito aparente. Ver
  `qa/06-defects/open/DEF-002-entrada-de-carrito-con-producto-inexistente-deja-ui-inconsistente.md`.
- "Vaciar carrito" y "Eliminar" (por línea) no piden confirmación. "Finalizar compra" es 100%
  cosmético: vacía el carrito, cierra el offcanvas y muestra un toast, sin número de orden, sin
  página de confirmación ni llamada de red.

## Próximos pasos

- Stage 3 (`qa-test-plan`): Plan de Pruebas Sprint 1 (CAT + CARR).
- Decidir con negocio si `DEF-001` y `DEF-002` se corrigen antes de automatizar los TCs afectados.
