# Bug Report — DEF-006: La clase CSS `badge-tazon` se emite en toda insignia de categoría

| Field | Value |
|-------|-------|
| Bug ID | DEF-006 |
| Title | El badge de categoría de cada producto (listado y detalle) lleva la clase `badge-tazon` sin importar la categoría real |
| Severity | Low |
| Priority | P3 |
| Status | Open (encontrado durante Stage 6 re-baseline) |
| Assigned to | Unassigned |
| Module | Catálogo |
| Submodule | LISTADO, DETALLE |
| Environment | Stack QA: `https://unicornt-qa.keber.cl`. Encontrado el 2026-09-06. |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-09-06 |
| GitHub Issue | (pendiente — `keber/unicornt-store-frontend`) |
| ADO WI | N/A |
| Related TCs | (ninguno — cosmético) |

---

## Description

En el pre-refactor las categorías eran "Polera" / "Tazón" y el badge alternaba una clase de
estilo por tipo. Tras el refactor las categorías son 10 (`PM`, `Cloud`, `DevOps`, …) pero el
markup del badge quedó con la clase fija `badge-tazon`:

```html
<span class="badge mb-2 align-self-start product-card__category badge-tazon">PM</span>
```

y en el detalle:

```html
<span class="badge product-detail__category mb-2 badge-tazon">PM</span>
```

Es un residuo del diseño anterior. No rompe nada funcional; sólo aplica un color/estilo de badge
pensado para "Tazón" a todas las categorías.

---

## Steps to Reproduce

| Step | Action |
|------|--------|
| 1 | Navigate to `{{QA_BASE_URL}}/index.html` |
| 2 | Inspeccionar la clase de cualquier `.product-card__category` |
| 3 | Repetir en `product.html?id=1` sobre `.product-detail__category` |

---

## Expected Result

El badge no debería llevar una clase con semántica de una categoría concreta; si hay estilo por
categoría, debería derivarse de la categoría real (o no existir).

## Actual Result

`badge-tazon` presente en todos los badges de categoría, en listado y detalle.

---

## Fix Suggestion

Quitar `badge-tazon` del template del badge de categoría, o mapearlo dinámicamente al slug de la
categoría si se quiere color por sección.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-09-06 | Encontrado durante Stage 6 re-baseline. |
