# Bug Report — DEF-004: El checkout ("Finalizar compra") nunca se completa por la UI

| Field | Value |
|-------|-------|
| Bug ID | DEF-004 |
| Title | El carrito del navegador nunca se sincroniza con el carrito del servidor, así que `POST /api/v1/orders` corre siempre contra un carrito vacío y ninguna orden se crea desde la interfaz |
| Severity | High |
| Priority | P1 |
| Status | Open (encontrado durante Stage 6 re-baseline) |
| Assigned to | Unassigned |
| Module | Carrito |
| Submodule | CARRITO |
| Environment | Stack QA: frontend `https://unicornt-qa.keber.cl`, API `https://api-unicornt-qa.keber.cl` (Postgres aislado). Encontrado el 2026-09-06. |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-09-06 |
| GitHub Issue | (pendiente — `keber/unicornt-store-frontend`) |
| ADO WI | N/A (ADO deshabilitado en este proyecto) |
| Related TCs | TC-CARR-CARRITO-027, TC-CARR-CARRITO-028, TC-CARR-CARRITO-029, TC-CARR-CARRITO-030, TC-CARR-CARRITO-048 |

---

## Description

El refactor agregó un backend real con carrito del lado del servidor (`/api/v1/cart*`) y
confirmación de orden (`POST /api/v1/orders`, que **lee el carrito del servidor** — el body sólo
lleva `shippingAddress`, no ítems). El frontend nunca alimenta ese carrito del servidor, así que
la confirmación siempre falla:

1. **Agregar ítems ya autenticado** no dispara ninguna llamada (`POST /cart/items` ni
   `/cart/merge`). El carrito vive sólo en `localStorage['unicornt_cart']` (`[{id,qty}]`). Al
   enviar el checkout, `POST /api/v1/orders` corre contra un carrito de servidor vacío → el
   backend responde `400 {"code":"BAD_REQUEST","message":"The cart is empty"}` y la UI muestra
   `#checkout-submit-error` = "No se pudo procesar tu compra. Intenta de nuevo.". No se crea
   ninguna orden.
2. **Iniciar sesión desde `login.html`** SÍ hace `POST /api/v1/cart/merge` (sube el carrito
   invitado al servidor) y luego **vacía `localStorage['unicornt_cart']`** — pero el offcanvas
   **no se rehidrata desde `GET /api/v1/cart`**. El usuario autenticado ve el carrito **vacío**,
   `#cart-footer` queda oculto y el formulario de checkout es inalcanzable.

Ninguna ruta (registrarse-y-agregar, o agregar-y-loguear) permite completar una compra por la
interfaz.

---

## Steps to Reproduce

**Escenario A — usuario autenticado agrega y confirma**

| Step | Action |
|------|--------|
| 1 | Registrarse o iniciar sesión (queda token en `localStorage['unicornt.auth.token']`) |
| 2 | En `index.html`, click en "Agregar" sobre 1–2 productos |
| 3 | Abrir el offcanvas del carrito, completar el formulario (`#checkout-fullName`, `#checkout-email`, `#checkout-street`, `#checkout-city`, `#checkout-region`) |
| 4 | Click en "Finalizar compra" (`#btn-checkout`) |
| 5 | Observar `#checkout-submit-error`, la red y `GET /api/v1/orders` |

**Escenario B — invitado agrega, luego inicia sesión**

| Step | Action |
|------|--------|
| 1 | Como invitado, agregar 2 productos en `index.html` |
| 2 | Ir a `login.html` e iniciar sesión con una cuenta válida |
| 3 | Volver a `index.html`, abrir el offcanvas del carrito |
| 4 | Observar `#cart-items`, `#cart-footer` |

---

## Expected Result

- **A**: al confirmar, se crea la orden (`POST /api/v1/orders` → `201
  {id,status:"CONFIRMED",total}`), el carrito queda vacío, el offcanvas se cierra y se muestra
  una confirmación (nº de orden / toast de éxito).
- **B**: tras el `cart/merge`, el offcanvas muestra los ítems fusionados y el footer con el total;
  el checkout queda disponible.

---

## Actual Result

- **A**: `POST /api/v1/orders` → `400 "The cart is empty"`. `#checkout-submit-error` visible, el
  carrito no se vacía, el offcanvas sigue abierto, `GET /api/v1/orders` devuelve `[]`.
- **B**: `#cart-items` vacío, `#cart-footer` oculto, checkout inalcanzable. `localStorage['unicornt_cart']` = `[]`.

---

## Evidence

Exploración en vivo con scripts Playwright ad-hoc contra el stack QA el 2026-09-06
(`qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`, §4):

- **El backend funciona** de punta a punta vía llamadas API directas:
  `POST /auth/register` → `POST /auth/login` → `POST /cart/items {productId,quantity}` (201) →
  `POST /cart/merge` (200) → `POST /orders {shippingAddress:{street,city,region,zipCode}}` →
  `201 {"id":1,"status":"CONFIRMED","total":84940}` → `GET /orders` muestra la orden con líneas y
  snapshot de dirección.
- **El frontend no**: al agregar ítems autenticado la pestaña de red no muestra ninguna llamada
  a `/cart*`; al confirmar sólo se ve `POST /api/v1/orders` → error.
- Tras `login.html`: se observa `POST /api/v1/cart/merge → 200` con los ítems, e inmediatamente
  `localStorage['unicornt_cart']` pasa a `[]`; el offcanvas queda con 0 `.cart-item`.

---

## Root Cause Analysis

El frontend trata el carrito como puramente client-side (`localStorage['unicornt_cart']`) salvo
por el `cart/merge` único al iniciar sesión. Falta:
1. Sincronizar cada mutación del carrito con el servidor cuando hay sesión (`POST /cart/items`,
   `PUT/DELETE /cart/items/{productId}`), o bien enviar los ítems en el `POST /orders` si el
   contrato lo permitiera (hoy no: `PlaceOrderRequest` sólo acepta `shippingAddress`).
2. Rehidratar el offcanvas desde `GET /api/v1/cart` después del `cart/merge` y en cada carga de
   página con sesión activa.

---

## Fix Suggestion

En `keber/unicornt-store-frontend`: cuando hay token, enrutar todas las operaciones del carrito
por la API de carrito del servidor y renderizar el offcanvas desde `GET /api/v1/cart`; mantener
`localStorage` sólo como carrito de invitado que se fusiona (`cart/merge`) y se descarta al
iniciar sesión.

---

## Impact on Automation

| TC ID | Test state (Stage 6) | Impact |
|-------|----------------------|--------|
| TC-CARR-CARRITO-027 | `test.fail()` — asevera que al confirmar el carrito queda vacío | Pasa a `test()` cuando se corrija |
| TC-CARR-CARRITO-028 | `test.fail()` — asevera que al confirmar el offcanvas se cierra | idem |
| TC-CARR-CARRITO-029 | `test.fail()` — asevera confirmación de éxito (toast/nº de orden) | idem |
| TC-CARR-CARRITO-030 | `test.fail()` — asevera que se genera una orden (`GET /orders` la lista) | idem |
| TC-CARR-CARRITO-048 | parcial: el form renderiza y valida client-side (pasa); el submit exitoso es `test.fail()` (este defecto) | idem |

---

## Reactivation Instructions

Cuando se corrija:
1. Cambiar `test.fail()` → `test()` en TC-CARR-CARRITO-027/028/029/030 y en la aserción de
   submit-exitoso de TC-CARR-CARRITO-048 (`qa/07-automation/e2e/tests/carrito/carrito.spec.ts`).
2. Ejecutar la suite de carrito al menos 2 veces para confirmar estabilidad.
3. Mover este archivo a `06-defects/resolved/`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-09-06 | Encontrado durante Stage 6 re-baseline contra el stack QA. Backend OK, frontend nunca sincroniza el carrito → `POST /orders` siempre contra carrito vacío. |
