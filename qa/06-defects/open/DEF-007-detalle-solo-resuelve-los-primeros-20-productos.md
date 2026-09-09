# Bug Report — DEF-007: `product.html` solo resuelve los primeros 20 productos

| Field | Value |
|-------|-------|
| Bug ID | DEF-007 |
| Title | La página de detalle busca el `id` en la primera página de `GET /api/v1/products` (20 ítems) en vez de llamar `GET /api/v1/products/{id}`, así que los productos 21–49 redirigen a `index.html` pese a existir |
| Severity | High |
| Priority | P1 |
| Status | Open (encontrado durante Stage 6 re-baseline) |
| Assigned to | Unassigned |
| Module | Catálogo |
| Submodule | DETALLE, LISTADO |
| Environment | Stack QA: `https://unicornt-qa.keber.cl` + `https://api-unicornt-qa.keber.cl`. Encontrado el 2026-09-06. |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-09-06 |
| GitHub Issue | (pendiente — `keber/unicornt-store-frontend`) |
| ADO WI | N/A |
| Related TCs | TC-CAT-DETALLE-033, TC-CAT-LISTADO-016 |

---

## Description

`product.html?id={id}` renderiza el detalle a partir de datos obtenidos con `GET
/api/v1/products` (la **lista**, que pagina con `size=20` por defecto) y busca el `id` dentro de
ese arreglo. Como el catálogo tiene 49 productos y sólo llegan los primeros 20, cualquier `id`
entre 21 y 49 no se encuentra y la página cae en la misma rama de "id inválido" → redirige
silenciosamente a `index.html`.

La API expone el endpoint correcto: `GET /api/v1/products/{id}` devuelve `200` para los 49
productos (verificado para id 21, 25, 49). El frontend no lo usa.

Efecto: **28 de 49 productos (57%) no tienen página de detalle funcional.** Desde el listado se
llega a ellos vía el filtro por categoría (el badge/nombre/precio se ven), pero "Ver más"
redirige a la home.

---

## Steps to Reproduce

| Step | Action |
|------|--------|
| 1 | Navigate to `{{QA_BASE_URL}}/product.html?id=25` (o cualquier id 21–49) |
| 2 | Observe la URL final y el `<h1>` |
| 3 | Comparar con `GET {{QA_API_URL}}/api/v1/products/25` (→ 200) |

---

## Expected Result

`product.html?id=25` renderiza el detalle del producto 25 (nombre, precio, descripción, imagen,
selector de cantidad, "Agregar al carrito").

## Actual Result

Redirige a `index.html`. En la red se ve `GET /api/v1/products` (lista, 20 ítems) pero **nunca**
`GET /api/v1/products/25`.

| id | Resultado |
|---|---|
| 1–20 | ✅ renderiza |
| 21, 25, 49 | ❌ redirige a `index.html` |

---

## Root Cause Analysis

El data layer del detalle (`src/services/product.service.ts` / `src/views/product.view.ts` según
los comentarios del HTML) usa la lista paginada y hace lookup por `id` en memoria, en lugar de
`GET /api/v1/products/{id}`. El `size` por defecto (20) recorta el universo consultable.

---

## Fix Suggestion

En `keber/unicornt-store-frontend`: la vista de detalle debe llamar `GET /api/v1/products/{id}`
directamente y tratar el `404` como "id inválido" (redirect a `index.html`). Alternativamente,
pedir la lista con un `size` que cubra el catálogo — pero el endpoint por id es el correcto.

---

## Impact on Automation

| TC ID | Test state (Stage 6) | Impact |
|-------|----------------------|--------|
| TC-CAT-DETALLE-033 | `test.fail()` — asevera que el detalle del id 49 renderiza | Pasa a `test()` cuando se corrija |
| TC-CAT-LISTADO-016 | ajustado — asevera sólo que el `href` de "Ver más" del id 49 es correcto (`product.html?id=49`); el detalle en sí lo cubre TC-CAT-DETALLE-033 | — |
| TC-CAT-DETALLE-029 | sigue en verde (id=50 redirige) pero ahora el redirect no es distintivo — todos los id ≥ 21 redirigen | anotado |

---

## Reactivation Instructions

Cuando se corrija:
1. Cambiar `test.fail()` → `test()` en TC-CAT-DETALLE-033
   (`qa/07-automation/e2e/tests/catalogo/detalle.spec.ts`).
2. Ejecutar 2 veces para confirmar estabilidad.
3. Mover este archivo a `06-defects/resolved/`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-09-06 | Encontrado durante Stage 6 re-baseline: el detalle sólo resuelve los primeros 20 productos. |
