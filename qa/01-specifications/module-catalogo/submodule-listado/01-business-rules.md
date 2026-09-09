# Business Rules — Catálogo: Listado de productos

> **version**: 1.1 · **last-updated**: 2026-09-06 · **change-summary**: Stage 6 — RN-CAT-001 y
> RN-CAT-005 reescritas para el catálogo por API + filtro por categoría + tope de 20. Detalle:
> `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`.

### RN-CAT-001: El catálogo se carga desde la API y muestra la primera página (20 de 49) con filtro por categoría

- **Type**: State Machine
- **Estado**: reescrita en Stage 6 (2026-09-06). Versión pre-refactor: "49 tarjetas hardcodeadas
  en `assets/js/products.js`, 0 llamadas de red, sin filtros".
- **Trigger**: Carga de `index.html`
- **Behavior**: Al cargar, el frontend hace `GET /api/v1/products` y `GET /api/v1/categories` y
  renderiza en `#product-list` (`role="list"`, `aria-busy` mientras carga, atributo removido al
  terminar). El API pagina (`size` 20 por defecto, `totalElements` 49, `totalPages` 3) y el
  storefront muestra **sólo la página 0 → 20 tarjetas**; no hay UI de paginación ni scroll
  infinito. Un `select#category-filter` (`aria-label="Filtrar por categoría"`, `value` = slug de
  categoría) dispara `GET /api/v1/products?category=<slug>` y re-renderiza el subconjunto.
- **Notes**: La cobertura formal de paginación/filtro (todas las categorías, límites, "sin
  resultados") queda para el sprint de re-baseline.

### RN-CAT-002: Alta de producto nuevo al carrito desde el listado

- **Type**: Calculation
- **Trigger**: Click en el botón "Agregar" de una tarjeta cuyo producto no está presente en
  `localStorage['unicornt_cart']`
- **Behavior**: Se crea la entrada `{id, qty: 1}` en el arreglo `unicornt_cart`; se muestra el
  toast de éxito `#cart-toast`; se actualiza el badge numérico del botón "Carrito" en el navbar.
- **Notes**: Verificado agregando el producto id=1 con el carrito vacío.

### RN-CAT-003: Agregación de cantidad al repetir "Agregar" sobre un producto ya en el carrito

- **Type**: Calculation
- **Trigger**: Click en "Agregar" sobre una tarjeta cuyo producto ya tiene una entrada en
  `unicornt_cart`
- **Behavior**: Se incrementa en +1 el campo `qty` de la entrada existente; no se crea una
  entrada duplicada.
- **Notes**: Verificado: dos clicks consecutivos en "Agregar" sobre el mismo producto (id=1)
  resultan en `[{"id":1,"qty":2}]`, no en dos entradas separadas.

### RN-CAT-004: Límite máximo de cantidad no se respeta al agregar desde el listado (DEFECTO)

- **Type**: Validation
- **Trigger**: Click en "Agregar" sobre una tarjeta cuyo producto ya tiene `qty=99` (el máximo
  declarado en el selector de cantidad del detalle, ver `submodule-detalle/01-business-rules.md`
  RN-CAT-008) en `unicornt_cart`
- **Behavior esperado**: La cantidad debería permanecer clampeada en 99.
- **Behavior observado**: La cantidad se incrementa a 100, superando el máximo declarado por la
  UI. El botón "Agregar" del listado no valida contra ningún límite superior.
- **Error message**: Ninguno — no hay feedback visual de que se excedió un límite.
- **Notes**: Ver defecto formal `qa/06-defects/open/DEF-001-limite-maximo-cantidad-no-respetado-al-agregar.md`.
  Comportamiento gemelo desde el detalle: RN-CAT-012.

### RN-CAT-005: Categoría de producto

- **Type**: State Machine
- **Estado**: reescrita en Stage 6 (2026-09-06). Versión pre-refactor: "el badge siempre muestra
  `Polera`; no hay `Tazón`".
- **Trigger**: Renderizado de cada tarjeta
- **Behavior**: El badge (`.product-card__category`) muestra el `categoryName` del producto
  devuelto por la API. Hay **10 categorías** (slugs: `pm`, `cloud`, `devops`, `enigma`, `general`,
  `it-crowd`, `linux`, `personajes`, `programador`, `qa`). Los 49 productos son todos de
  `productTypeName` `"T-shirt"` (los tipos `Mug`/`Poster` están sembrados pero sin productos).
- **Notes**: El badge lleva una clase CSS residual `badge-tazon` en toda categoría — ver
  **DEF-006** (cosmético). Cobertura formal por categoría → sprint de re-baseline.

### RN-CAT-006: Formato de precio

- **Type**: Calculation
- **Trigger**: Renderizado de cada tarjeta
- **Behavior**: Todos los precios se muestran en formato `"$XX.990"` (CLP, punto como separador
  de miles, sin decimales). Rango observado: `$11.990` a `$15.990`.
- **Notes**: El mismo formato se usa en el total del carrito — ver
  `qa/01-specifications/module-carrito/submodule-carrito/01-business-rules.md` RN-CARR-002.

### RN-CAT-013: Visibilidad del badge de conteo del carrito

- **Type**: State Machine
- **Trigger**: Cualquier cambio en `unicornt_cart` (agregar, y por extensión editar/eliminar
  desde el carrito, ver CARR)
- **Behavior**: El botón "Carrito" del navbar muestra un badge numérico solo cuando la suma total
  de `qty` en `unicornt_cart` es ≥ 1. Con el carrito vacío, el botón muestra únicamente el texto
  "Carrito", sin badge.
- **Notes**: Verificado agregando el primer producto (badge aparece en "1") y también en estado
  inicial con carrito vacío (sin badge).

### RN-CAT-014: Continuidad de los `id` de producto entre el listado y el catálogo fuente

- **Type**: State Machine
- **Trigger**: Renderizado del listado completo
- **Behavior**: El `id` usado en el `href` de "Ver más" de cada tarjeta es secuencial de 1 a 49,
  sin saltos ni repeticiones, en el mismo orden en que se renderizan las tarjetas.
- **Notes**: Relevante para diseñar TCs de boundary sobre `product.html?id=` (ver
  `submodule-detalle/01-business-rules.md` RN-CAT-007) — el rango válido conocido es exactamente
  1–49.
