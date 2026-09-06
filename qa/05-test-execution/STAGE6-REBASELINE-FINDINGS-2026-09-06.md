# Stage 6 "green first" — Phase 1 re-baseline findings (2026-09-06)

Live exploration of the **QA stack** (`https://unicornt-qa.keber.cl` +
`https://api-unicornt-qa.keber.cl`, isolated Postgres, Swagger open at `/api-docs`) plus the
backend repo (`C:\Users\Usuario\Proyectos\unicornt-store-backend`, contract at `docs/openapi.json`
— verified identical to the live QA `/api-docs`). This doc is the work list for Phases 2–4.

## 1. Environment

| | Old (pre-refactor baseline) | Now |
|---|---|---|
| Frontend | static HTML, products inlined | Vite multipage, GitHub Pages. `index.html`, `product.html`, `login.html`, `register.html` |
| Catalog data | 49 `<article>` hardcoded in `index.html` | `GET /api/v1/products` (paginated) + `GET /api/v1/categories` on load |
| Backend | none | Spring Boot 4 REST API, `openapi 3.1.0`, JWT (`Authorization: Bearer`) |
| Auth | none | `register` / `login` / `me`; token in `localStorage['unicornt.auth.token']` (raw JWT) |
| Suite target | `unicornt-store.keber.cl` (prod) | **switching to** `unicornt-qa.keber.cl` + `api-unicornt-qa.keber.cl` |

## 2. Catalog / Listado (`index.html`)

- Grid container **`#product-list`** `[role="list"]` `[aria-label="Catálogo de productos"]`.
  `aria-busy="true"` while loading, **attribute removed** (→ `null`, not `"false"`) when done.
  Wait strategy: `#product-list > article` count > 0.
- Card = **`article.col`** → `.card.product-card`. Sub-selectors:
  - `.product-card__category` — badge, text = `categoryName` (e.g. `PM`, `Cloud`). Carries a
    leftover CSS class `badge-tazon` regardless of category (cosmetic; candidate low-sev defect).
  - `.product-card__name` (`h3`), `.product-card__description`, `.product-card__price` (`$13.990`).
  - `.product-card__detail-link` = `a[href="product.html?id=N"]` ("Ver más").
  - `.btn-add-cart[data-id="N"]` ("Agregar").
- **Only the first 20 of 49 products render** with "Todas las categorías" selected. No
  pagination / load-more / infinite-scroll UI. `totalElements: 49`, `size: 20`, `totalPages: 3`
  in the API response but the storefront shows page 0 only.
- **Category filter** `select#category-filter.form-select` `[aria-label="Filtrar por categoría"]`.
  Options: `""` ("Todas las categorías") + 10 slugs (`cloud`, `devops`, `enigma`, `general`,
  `it-crowd`, `linux`, `pm`, `personajes`, `programador`, `qa`). Selecting one →
  `GET /api/v1/products?category=<slug>` and re-renders. e.g. `qa` → 2 products.
- Cart still `localStorage['unicornt_cart']`, shape `[{id,qty}]`, key **unchanged** → the
  `clearCart` fixture still works.
- Catalog is still 49 T-shirts, 10 categories, all active, `stock` 50, price 11990–15990. No
  Mug/Poster products (seed has the types, no rows).

**Impact:** every "expect 49 products" / "iterate all cards" / "last product" assertion in
`listado.spec.ts` breaks — the visible set is 20. Options for each: assert against the visible-20,
or drive via `?category=` to a known small set, or assert the totals via the API. New behavior
(category filter, 20-cap) needs spec coverage — minimal here, fuller in the deferred sprint.

## 3. Detalle (`product.html?id=N`)

- `GET /api/v1/products` (list) on load; renders into `#product-detail` →
  `#product-content.row.g-5` (the **DEF-003** `.row.g-5` element is still here — re-verify the
  375px overflow for the `test.fail()` guard).
- Skeleton: `.loading-skeleton__message` "Cargando producto...".
- Selectors: `.product-detail__category` (badge, same `badge-tazon` leftover),
  `.product-detail__name` (`h1`), `.product-detail__price`, `.product-detail__description`,
  `.product-detail__img`, `#breadcrumb-name`, `#qty-input` + `#qty-minus` / `#qty-plus`
  (min 1 / max 99), `#btn-add-detail` ("Agregar al carrito"), "Volver" = `a[href="index.html"]`.
- **Bad `id` (`999999`, `abc`, `0`, `-1`, empty) → still silently redirects to `index.html`.**
  Behavior UNCHANGED — those detalle scenarios stay valid as-is.
- API: `GET /api/v1/products/{id}` → 200 or **404** `{message:"Product not found: N",
  code:"RESOURCE_NOT_FOUND", status:404, ...}`.

## 4. Carrito + Checkout (offcanvas, all pages) — **core flow is BROKEN**

Guest cart (offcanvas) still works and is localStorage-driven — selectors:
`#cartOffcanvas`, `#cart-items`, `.cart-item[data-id]`, `.cart-item__name`, `.cart-item__price`
("$13.990 c/u"), `.cart-item__subtotal`, `.cart-qty-input`, `.btn-cart-minus/plus/remove`
(`[data-id]`, `aria-label` "Reducir"/"Aumentar"/"Eliminar"), `#cart-total`, `#cart-footer`
(`display` toggled), `#cart-badge`, `#btn-clear-cart` ("Vaciar carrito"), toast `#cart-toast` /
`#toast-message`.

Checkout form (inside `#cart-footer`): `#checkout-form` → `#checkout-fullName`, `#checkout-email`,
`#checkout-street`, `#checkout-city`, `#checkout-region`, `#checkout-zipCode` (optional), submit
`#btn-checkout` ("Finalizar compra"). Per-field error `.invalid-feedback#checkout-<field>-error`;
form-level error `#checkout-submit-error`.

### DEF-004 (new, High) — checkout never succeeds through the UI

The **backend works** end-to-end (verified by direct API calls):
`register` → `login` → `POST /cart/items` or `POST /cart/merge` → `POST /orders` → `201
{id,status:"CONFIRMED",total}` → `GET /orders` shows the order with line items + shipping snapshot.

The **frontend does not**:
- Adding items **while already logged in** issues **no** `POST /cart/items` / `/cart/merge` — the
  cart stays only in `localStorage['unicornt_cart']`, server cart stays empty. `POST /orders`
  then fails ("The cart is empty" server-side; UI shows `#checkout-submit-error` = "No se pudo
  procesar tu compra. Intenta de nuevo."). No order created.
- Logging in via `login.html` **does** `POST /cart/merge` (guest cart → server) and then
  **empties `localStorage['unicornt_cart']`** — but the offcanvas is **not re-hydrated from
  `GET /api/v1/cart`**, so a logged-in user sees an **empty cart**, `#cart-footer` stays hidden,
  and the checkout form is unreachable.

Net: no path (register-then-add, or add-then-login) lets a user place an order via the UI.
Fix belongs in the frontend (`keber/unicornt-store-frontend`): sync the cart to the server on
add while authed, and hydrate the offcanvas from `GET /cart` after login/merge.

**Consequence for this iteration:** the checkout happy-path CANNOT be made green. Per the
`qa-maintenance` rule ("if the app is wrong, file a defect, don't update the spec"):
- File DEF-004 + a GitHub issue in the frontend repo.
- The Group-B carrito tests become `test.fail()` guards asserting the CORRECT behavior (order
  created + cart cleared + confirmation shown), tracked to DEF-004 — same pattern as
  DEF-001/002/003.

## 5. Auth pages

- `login.html`: `#login-form`, `#login-email`, `#login-password`, `#login-submit` (label
  **"Sign in"** — English button in an otherwise-Spanish UI; low-sev i18n defect candidate),
  `#login-error[role=alert][hidden]`.
- `register.html`: `#register-form`, `#register-firstName`, `#register-lastName`,
  `#register-email`, `#register-password`, `#register-submit` ("Create account"),
  `#register-error`. Submit → `POST /register` → auto `POST /login` → stores token → redirects
  to `/`. Register with an existing email surfaces `#register-error`.
- **Deferred**: a dedicated AUTH module (Stage 1→5). This iteration only needs a
  `registerViaApi()` / `loginViaUi()` helper for the checkout `test.fail()` guards.

## 6. API contract facts (from `docs/openapi.json` + live QA)

- Base: `https://api-unicornt-qa.keber.cl`, prefix `/api/v1`. Global security `bearerAuth`;
  public overrides: `GET /products`, `GET /products/{id}`, `GET /categories`, all `/auth/*`.
- `POST /auth/register` → **201** `{id,firstName,lastName,email,roles:["ROLE_USER"]}` (no token) ·
  400 `VALIDATION_ERROR` · 409 `RESOURCE_CONFLICT` ("User already exists with email: …").
- `POST /auth/login` → **200** `{token, expiresIn:3600000}` · 401 `UNAUTHORIZED`
  ("Authentication required") on bad creds.
- `GET /auth/me` → 200 `{id,firstName,lastName,email,roles[]}` · 401.
- `GET /products?category=<slug>&q=&page=&size=` → 200 `ProductPageResponse`
  `{content:[ProductResponse],page,size,totalElements,totalPages}`. **Filter param is `category`
  (slug), not `categoryId`.** `ProductResponse` =
  `{id,name,description,imageBase,price:int,categoryId,categoryName,productTypeId,productTypeName,stock:int,active:bool}`.
- `GET /products/{id}` → 200 `ProductResponse` · 404 `RESOURCE_NOT_FOUND`.
- `GET /categories` → 200 `[{id:int,name,slug}]` (10 rows).
- `POST /orders` (bearer) → **201** `{id,status:"CONFIRMED",total:int}` ·
  400 `BAD_REQUEST` ("The cart is empty") · 400 `VALIDATION_ERROR`
  (`errors:[{field:"shippingAddress.region",message:"region is required"},…]`) · 401.
  Body `{shippingAddress:{street,city,region,zipCode?}}` (street/city/region required).
- `GET /orders` (bearer) → 200 `[{id,status,total,createdAt,shippingAddress{street,city,region,zipCode},items:[{productId,productName,unitPrice,quantity,subtotal}]}]`, newest first.
- Uniform error: `{message,code,status,timestamp,path,errors:[{field,message}]}`.
- Server-side Cart API (`GET/POST /cart`, `POST /cart/items`, `PUT/DELETE /cart/items/{productId}`,
  `POST /cart/merge`) — **works**, but **out of scope** this iteration (deferred sprint).
  `GET /cart` → `{items:[{productId,productName,imageBase,unitPrice,quantity,subtotal}],itemCount,total}`.
- Seed (`V2__seed_reference_data.sql`): products id **1–49**, all `T-shirt`; categories
  pm=1, cloud=2, devops=3, enigma=4, general=5, it-crowd=6, linux=7, personajes=8,
  programador=9, qa=10; every product `stock=50`, `active=true`. No user accounts seeded.

## 7. Existing suite — what changes (work list)

| Test / group | Verdict |
|---|---|
| `listado.spec.ts` grid/card/badge/price locators | update to §2 selectors |
| `listado.spec.ts` "49 products" / iterate-all / last-item | rework to visible-20 or `?category=` subset or API total |
| TC-CAT-LISTADO-040 "no `/api/` calls" | **[OBSOLETE]** — page now must call the API |
| TC-CAT-LISTADO-039 "no real contact form" | **[OBSOLETE]** — still just the `#contacto` footer anchor, but the scenario was written as a negative that no longer means anything; no `<form>` exists (the earlier AGENT-NEXT-STEPS claim of a contact form is **wrong**) |
| `detalle.spec.ts` field locators | update to §3 selectors + skeleton wait |
| `detalle.spec.ts` bad-id redirect scenarios | **unchanged** — still pass |
| TC-CAT-DETALLE-037 "no `/api/` calls" | **[OBSOLETE]** |
| TC-CAT-DETALLE-047 (DEF-003, `test.fail()`) | re-verify 375px overflow; keep guard |
| TC-CAT-LISTADO-027 / TC-CAT-DETALLE-022 (DEF-001, `test.fail()`) | re-verify against QA; keep guard |
| `carrito.spec.ts` guest cart ops (add/qty/remove/total/clear/badge/toast) | update locators (§4); expected to still pass |
| TC-CARR-CARRITO-035/036/055/056 (DEF-002, `test.fail()`) | re-verify against QA; keep/adjust guard |
| TC-CARR-CARRITO-027/028/029/030 (Group B, currently `fixme`) | → `test.fail()` guards for **DEF-004** (order created / cart cleared / offcanvas closed / confirmation) |
| TC-CARR-CARRITO-031 "no backend / 0 `/api/`" (Group A) | **[OBSOLETE]** |
| TC-CARR-CARRITO-048 "real checkout step w/ address" (Group A) | partially real — assert the form renders + client-side validation; submit-success is a DEF-004 `test.fail()` |
| Coverage report (`mcr.config.ts` etc.) | **park** — no sourcemaps on the deployed bundles, frontend build not in this repo |

## 8. New defects to file

- **DEF-004 (High)** — checkout never succeeds through the UI (cart not synced to server / offcanvas not hydrated after merge). Frontend repo issue.
- **DEF-005 (Low, optional)** — auth buttons render English text ("Sign in", "Create account") in a Spanish UI.
- **DEF-006 (Low, optional)** — `badge-tazon` CSS class emitted on every category badge regardless of category.
