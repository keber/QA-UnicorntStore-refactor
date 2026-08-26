# MODULE: Catálogo — Submodule: Detalle de producto

| Field | Value |
|-------|-------|
| Module code | CAT |
| Submodule code | DETALLE |
| Primary URL | `{{QA_BASE_URL}}/product.html?id={id}` |
| Status | Active |
| Last updated | 2026-08-26 |

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Header/navbar | composite | N/A | Idéntico al del listado (logo, Inicio, Contacto, botón Carrito) |
| Breadcrumb | navigation | N/A | `"Inicio / {nombre del producto}"`; "Inicio" enlaza a `index.html` |
| Imagen del producto | img | N/A | `alt` = nombre exacto del producto, versión grande de la imagen del listado |
| Badge de categoría | text | N/A | Mismo valor que en el listado ("Polera") |
| Nombre del producto | heading (h1) | N/A | — |
| Precio | text | N/A | Mismo formato que el listado (`"$XX.990"`) |
| Descripción | text | N/A | Texto completo (coincide con el del listado) |
| Selector de cantidad | composite | Sí | Botón "Reducir cantidad" (−), `input[type=number]` `id="qty-input"` `min="1" max="99"` con `aria-label="Cantidad"`, botón "Aumentar cantidad" (+) |
| Botón "Agregar al carrito" | button | N/A | Agrega la cantidad seleccionada del producto a `localStorage['unicornt_cart']` |
| Enlace "Volver" | link | N/A | `href="index.html"` |
| Footer | composite | N/A | Idéntico al del listado |

## API Endpoints

Ninguno. El producto se resuelve leyendo el parámetro `id` de la query string contra el mismo
arreglo estático de `assets/js/products.js` usado por el listado (confirmado: 0 llamadas
XHR/fetch al cargar el detalle).

## Comportamiento de resolución de `id` (resumen, detalle en `01-business-rules.md`)

| Valor de `id` | Resultado observado |
|---|---|
| `1` – `49` (entero exacto) | Renderiza el producto correspondiente |
| `01` (cero a la izquierda) | Renderiza producto `1` (comparación no estricta) |
| `1.5` (decimal) | Renderiza producto `1` (truncamiento) |
| Ausente | Redirige a `index.html` |
| No numérico (`abc`) | Redirige a `index.html` |
| `0` | Redirige a `index.html` |
| Negativo (`-1`) | Redirige a `index.html` |
| Fuera de rango (`50`, `9999`) | Redirige a `index.html` |

## Notas adicionales

- El título de la pestaña es dinámico: `"{Nombre del producto} - Unicorn't Store"`.
- No existe selector de talla/color/variante, sección de reseñas ni "productos relacionados".
- La consola muestra el mismo `404` de `favicon.ico` que en el resto del sitio (no específico de
  este submódulo).
