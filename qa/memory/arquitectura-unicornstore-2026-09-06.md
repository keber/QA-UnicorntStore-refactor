# Arquitectura de Unicorn't Store — post-refactor completo (2026-09-06)

> Reemplaza a `arquitectura-unicornstore-2026-08-26.md` (que describía el stub estático
> pre-refactor). Cargar cuando: se toque cualquier spec, page object o test; se dude sobre
> auth/API; se planifique el módulo AUTH o la cobertura de la API de carrito del servidor.
>
> Fuente: exploración en vivo del stack **QA** el 2026-09-06 + repo backend
> `C:\Users\Usuario\Proyectos\unicornt-store-backend` (`github.com/keber/unicornt-store-backend`),
> contrato en `docs/openapi.json` (idéntico al `/api-docs` en vivo de QA). Detalle completo con
> selectores y respuestas en `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`.

## Entornos

| Rol | Frontend | API | Notas |
|---|---|---|---|
| **QA** (target de la suite E2E) | `https://unicornt-qa.keber.cl` | `https://api-unicornt-qa.keber.cl` | Postgres aislado (`pgdata_qa`), Swagger/OpenAPI abierto en `/api-docs` y `/swagger-ui.html`. La suite registra usuarios desechables y crea órdenes acá. |
| Prod | `https://unicornt-store.keber.cl` | `https://api-unicornt-store.keber.cl` | Swagger deshabilitado (404). No apuntar la suite acá. |
| Pre-refactor (referencia visual) | `https://unicornt-store-frontend.keberflores.workers.dev` | — | El stub estático que la suite validó al 100% en Sprint 1. |

## Stack actual

- **Frontend**: Vite, multipágina, servido por GitHub Pages. Páginas: `index.html` (catálogo),
  `product.html?id={id}` (detalle), `login.html`, `register.html`. Bootstrap 5 bundleado por Vite
  (ya no CDN); Font Awesome 6 sigue por CDN. Bundles con hash en `/assets/*.js` — **sin
  sourcemaps** (`*.js.map` → 404), y el repo del frontend no está en este workspace.
- **Backend**: Spring Boot 4 + Spring Security + JWT (`io.jsonwebtoken` 0.12.7) + Spring Data
  JPA + Postgres 16 + Flyway. `springdoc-openapi` 3.0.x. `openapi 3.1.0`, título "Unicornt Store
  API v1", prefijo `/api/v1`.
- **Auth**: JWT stateless. Token crudo (JWT) en `localStorage['unicornt.auth.token']`. Se envía
  como `Authorization: Bearer <token>`. `expiresIn` 3600000 ms (1 h). El registro por UI hace
  auto-login y redirige a `/`.
- **Carrito**: híbrido y **roto de punta a punta por la UI** (ver DEF-004). Invitado →
  `localStorage['unicornt_cart']` (`[{id,qty}]`, misma clave que el pre-refactor). Al iniciar
  sesión por `login.html` se hace `POST /api/v1/cart/merge` y se vacía `localStorage`, pero el
  offcanvas **no** se rehidrata desde `GET /api/v1/cart`. Agregar ítems ya autenticado **no**
  sincroniza con el servidor. Resultado: `POST /api/v1/orders` (que confirma el carrito del
  **servidor**) siempre corre contra un carrito vacío.

## Módulos de QA

- **CAT — Catálogo** (`index.html`, `product.html`): catálogo cargado de la API. 49 productos
  (ids 1–49), todos `T-shirt`, 10 categorías. El storefront muestra **sólo los primeros 20** con
  "Todas las categorías"; hay un `select#category-filter` (value = slug) que dispara
  `GET /products?category=<slug>` y re-renderiza. Sin paginación/scroll infinito. `id` inválido
  en `product.html` → redirige silenciosamente a `index.html` (sin cambios vs pre-refactor).
- **CARR — Carrito** (offcanvas en todas las páginas): operaciones de invitado
  (agregar/qty/eliminar/total/vaciar) siguen siendo localStorage y funcionan. El checkout
  (`#checkout-form` → `POST /api/v1/orders`) está roto (DEF-004).
- **AUTH — (diferido)**: `login.html` / `register.html` existen y funcionan a nivel API. Sin
  módulo formal de QA todavía — planificado para el sprint siguiente (Stage 1→5).

## API `/api/v1` — hechos

- Seguridad global `bearerAuth`; públicos: `GET /products`, `GET /products/{id}`,
  `GET /categories`, todo `/auth/*`.
- `POST /auth/register` → 201 `{id,firstName,lastName,email,roles:["ROLE_USER"]}` (sin token) ·
  400 `VALIDATION_ERROR` · 409 `RESOURCE_CONFLICT`.
- `POST /auth/login` → 200 `{token,expiresIn:3600000}` · 401 `UNAUTHORIZED` (credenciales malas).
- `GET /auth/me` → 200 `{id,firstName,lastName,email,roles[]}` · 401.
- `GET /products?category=<slug>&q=&page=&size=` → 200 `{content:[ProductResponse],page,size,totalElements,totalPages}`.
  `ProductResponse` = `{id,name,description,imageBase,price:int,categoryId,categoryName,productTypeId,productTypeName,stock:int,active:bool}`.
- `GET /products/{id}` → 200 `ProductResponse` · 404 `RESOURCE_NOT_FOUND` ("Product not found: N").
- `GET /categories` → 200 `[{id:int,name,slug}]` (10). slugs: pm(1) cloud(2) devops(3) enigma(4)
  general(5) it-crowd(6) linux(7) personajes(8) programador(9) qa(10).
- `POST /orders` (bearer) → 201 `{id,status:"CONFIRMED",total:int}` · 400 `BAD_REQUEST`
  ("The cart is empty") · 400 `VALIDATION_ERROR` (`errors:[{field:"shippingAddress.region",…}]`) ·
  401. Body `{shippingAddress:{street,city,region,zipCode?}}` (street/city/region requeridos).
- `GET /orders` (bearer) → 200 `[{id,status,total,createdAt,shippingAddress{…},items:[{productId,productName,unitPrice,quantity,subtotal}]}]`.
- Error uniforme: `{message,code,status,timestamp,path,errors:[{field,message}]}`.
- API de carrito del servidor (`GET/POST /cart`, `POST /cart/items`,
  `PUT/DELETE /cart/items/{productId}`, `POST /cart/merge`) — funciona; **fuera de alcance** del
  Stage 6 "green first" (sprint siguiente).

## Lo que SÍ existe ahora (vs. el `arquitectura-2026-08-26.md`)

- Login / registro / sesión JWT.
- Backend / API REST con órdenes, categorías, carrito de servidor.
- Filtro por categoría en el listado.
- Formulario de checkout real (dirección de envío) — aunque su submit no funciona (DEF-004).

## Lo que NO existe

- Búsqueda visible (el parámetro `q` existe en la API pero no hay input en la UI), paginación en
  la UI, variantes de producto, reseñas, productos relacionados.
- Productos de tipo Mug/Poster (los `product_types` están sembrados, sin filas de producto).
- Formulario de contacto — "Contacto" sigue siendo un ancla `#contacto` al footer con datos
  estáticos. **La afirmación de `AGENT-NEXT-STEPS` de que "ya existe un `<form>` de contacto" es
  incorrecta.**
- Página de "mis pedidos" / historial de órdenes en la UI (la API `GET /orders` existe).

## Implicancias para la automatización

- **Target**: `QA_BASE_URL=https://unicornt-qa.keber.cl`, `QA_API_URL=https://api-unicornt-qa.keber.cl`.
- Se reactiva la capa API dormida del scaffold: fixture `apiRequest` + schemas Zod
  (`z.strictObject`) derivados de `docs/openapi.json`. Ver `type-safety-and-data-strategy.md`.
- Estrategia de datos: **registro por corrida** (`uniqueEmail()` + `POST /auth/register`),
  cuentas desechables, las órdenes se acumulan en la DB QA aislada (aceptado por el dueño).
- `clearCart` (borra `localStorage['unicornt_cart']`) sigue válido para el carrito de invitado.
- Reporte de code coverage: **en pausa** (bundles minificados sin sourcemap, build del frontend
  fuera de este repo). Ver `AGENT-NEXT-STEPS.md`.
