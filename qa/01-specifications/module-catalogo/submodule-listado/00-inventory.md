# MODULE: Catálogo — Submodule: Listado de productos

| Field | Value |
|-------|-------|
| Module code | CAT |
| Submodule code | LISTADO |
| Primary URL | `{{QA_BASE_URL}}/index.html#products` |
| Status | Active |
| Last updated | 2026-08-26 |

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Skip link "Saltar al contenido principal" | link | N/A | `href="#products"`, primer elemento focoable de la página |
| Logo / enlace "Unicorn't Store" | link | N/A | Navega a `index.html` |
| Enlace "Inicio" (navbar) | link | N/A | Navega a `index.html` |
| Enlace "Contacto" (navbar) | link | N/A | Ancla `#contacto` al footer, no es un `<form>` |
| Botón "Carrito" (navbar) | button | N/A | `data-bs-toggle="offcanvas"` → abre `#cartOffcanvas`. Muestra badge numérico solo cuando hay ítems (sin badge si el carrito está vacío) |
| Heading "Nuestros productos" | heading (h2) | N/A | Encabezado de la sección de catálogo |
| Lista de productos | list | N/A | `<ul aria-label="Catálogo de productos">`, contiene 49 `<article>` |
| Tarjeta de producto (`<article>`) | composite | N/A | Repetida ×49 — ver estructura abajo |
| — Imagen del producto | img | N/A | `alt` = nombre exacto del producto |
| — Badge de categoría | text | N/A | Único valor observado: `"Polera"` (49/49) |
| — Nombre del producto | heading (h3) | N/A | Texto único por producto, algunos con comillas simples anidadas |
| — Descripción del producto | text | N/A | 1 párrafo, humor/meme tech, longitud variable |
| — Precio | text | N/A | Formato `"$XX.990"` (CLP, punto como separador de miles, sin decimales) |
| — Enlace "Ver más" | link | N/A | `href="product.html?id={n}"`, `n` = 1..49 en orden de renderizado |
| — Botón "Agregar" | button | N/A | Agrega qty=1 del producto al carrito (`localStorage['unicornt_cart']`) |
| Toast de confirmación (`#cart-toast`) | toast (Bootstrap) | N/A | Estilo `text-bg-success`, mensaje fijo `"¡Producto agregado al carrito!"`, auto-hide, botón "Cerrar" manual |
| Footer — descripción tienda | text | N/A | Incluye emoji 🦄 |
| Footer — "Links rápidos" | list of links | N/A | Inicio, Contacto (funcionales); Política de privacidad, Términos y condiciones (`href="#"`, placeholders) |
| Footer — Contacto | text | N/A | Dirección, email, teléfono estáticos (no son `mailto:`/`tel:`) |
| Footer — redes sociales | list of links | N/A | Instagram, TikTok, Twitter/X — todos `href="#"` (placeholders) |
| Footer — copyright | text | N/A | `"© 2026 Unicorn't Store..."` |

## API Endpoints

Ninguno. El catálogo está embebido/hardcodeado en `assets/js/products.js` (confirmado vía
`requests` de `playwright-cli`: 0 llamadas XHR/fetch, solo recursos estáticos de CDN). No aplica
tabla de endpoints para este submódulo.

## Notas adicionales

- Console del navegador muestra 1 error no bloqueante en toda carga: `404` de `favicon.ico`. No
  es específico de este submódulo (ocurre en todas las páginas del sitio); se documenta como
  hallazgo menor, no como defecto de CAT.
- No existe ningún control de búsqueda, filtro ni paginación — los 49 productos se renderizan
  completos en una sola carga.
