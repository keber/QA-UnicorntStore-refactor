# Arquitectura de Unicorn't Store — hallazgos de exploración (2026-08-26)

> ⚠️ **OBSOLETO desde el refactor completo (2026-09-06).** Este archivo describe el stub estático
> pre-refactor (sin login, sin API). El estado actual (Vite multipágina + backend Spring Boot con
> JWT, catálogo por API, checkout real) está en
> **`arquitectura-unicornstore-2026-09-06.md`**. Se conserva como referencia del baseline del
> Sprint 1 y de la versión preservada en `unicornt-store-frontend.keberflores.workers.dev`.
>
> Cargar cuando: se inicie el Stage 1 (module analysis) real, se escriban page objects nuevos, o se dude sobre si la app tiene login/API.

## Contexto

`https://unicornt-store.keber.cl` va a ser refactorizada (cambio de stack de base, posiblemente hacia algo similar en espíritu a `https://neonpulse.keber.dev/`, con o sin framework SPA encima). El propósito de este proyecto de QA es construir una suite E2E que capture el comportamiento **actual** para poder validar que el refactor no lo rompa.

## Stack actual (confirmado vía `curl` + `playwright-cli`, no asumido)

- HTML5 estático, **multi-página** (no SPA): `index.html`, `product.html?id={id}`.
- Bootstrap 5.3.8 (CDN) para layout, navbar, offcanvas del carrito, toasts.
- JavaScript vanilla sin build step, en 3 archivos: `assets/js/products.js` (catálogo estático), `assets/js/cart.js` (lógica del carrito), `assets/js/app.js` (renderizado + wiring de eventos).
- Font Awesome 6 (CDN) para iconos.
- **Sin backend, sin API, sin login, sin credenciales.** Confirmado explícitamente por el dueño del proyecto y verificado en el código: el carrito persiste 100% client-side en `localStorage` bajo la clave `unicornt_cart` (`Array<{id, qty}>`).

## Módulos identificados (viven en `qa/qa-framework.config.json` → `modules`)

### CAT — Catálogo
- **LISTADO** (`index.html#products`): grilla de 49 productos (`<article>` dentro de `ul[aria-label="Catálogo de productos"]`). Cada card: imagen, categoría (badge "Polera"/"Tazón" — solo se observaron poleras hasta ahora), nombre, descripción, precio (formato `$12.990`, CLP), botón "Ver más" (link a detalle) y botón "Agregar" (agrega qty 1 al carrito, feedback inline + toast).
- **DETALLE** (`product.html?id={id}`): imagen grande, nombre, precio, descripción, selector de cantidad (+/-, input manual 1-99), "Agregar al carrito", "Volver". Si el `id` no existe, redirige a `index.html` (falla silenciosa — candidato a TC negativo).

### CARR — Carrito
- Offcanvas de Bootstrap, presente en **todas** las páginas (botón "Carrito" en el navbar, con badge de conteo).
- Operaciones: +/- por ítem, input manual de cantidad, eliminar ítem, "Vaciar carrito", "Finalizar compra".
- **"Finalizar compra" es simulado**: vacía el carrito, cierra el offcanvas, muestra un toast ("¡Gracias por tu compra! Tu pedido está en camino. 🦄"). No hay página de confirmación, no hay número de orden, no hay persistencia de la "compra" en ningún lado — es puramente cosmético. Importante no escribir un TC que asuma que existe una orden real.

## Lo que NO existe (para no perder tiempo buscándolo)

- Login / registro / roles — no hay ningún flujo de autenticación.
- Backend / API — cero llamadas de red más allá de las cargas estáticas de CDN.
- Formulario de contacto — el link "Contacto" del navbar es un ancla (`#contacto`) al pie de página con datos estáticos (dirección, email, teléfono, redes sociales con href="#" placeholder). No hay `<form>`.
- Búsqueda, filtros, paginación — el catálogo se renderiza completo (49 productos) sin ningún control de esos.
- Checkout real, pasarela de pago, envío.

## Implicancias para la automatización (`qa/07-automation/e2e/`)

- No hace falta `setup` project ni `storageState` — cada test parte de un estado limpio.
- `fixtures/pom/page-object-fixture.ts` expone un fixture `clearCart()` (limpia la key de `localStorage`) en vez de un `resetStorageState()` de cookies.
- No hace falta la fixture `apiRequest` ni schemas Zod — se removieron del scaffold original (`Playwright-Scaffold-AI-Assisted-Development`) por no aplicar. Ver la sección "dormant" en `.github/skills/qa-automation/references/type-safety-and-data-strategy.md` si algún día el refactor agrega backend.
- `page-objects/CatalogPage.ts` ya existe como primer POM real, verificado contra el sitio en vivo.
