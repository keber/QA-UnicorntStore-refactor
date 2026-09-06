# Bug Report — DEF-003: El detalle de producto desborda horizontalmente en viewport móvil

| Field | Value |
|-------|-------|
| Bug ID | DEF-003 |
| Title | `product.html` produce ~12px de overflow horizontal a 375px de ancho (el grid `.row.g-5` del detalle es más ancho que el viewport) |
| Severity | Low |
| Priority | P3 |
| Status | Open (reconfirmado sin cambios contra el refactor — ver Changelog v1.1) |
| Assigned to | Unassigned |
| Module | Catálogo |
| Submodule | DETALLE |
| Environment | Detectado contra la versión pre-refactor (hoy en `https://unicornt-store-frontend.keberflores.workers.dev`); reconfirmado contra el refactor en `https://unicornt-store.keber.cl` el 2026-08-29 |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-08-26 |
| GitHub Issue | keber/unicornt-store-frontend#21 |
| ADO WI | N/A (ADO deshabilitado en este proyecto) |
| Related TCs | TC-CAT-DETALLE-047 |

---

## Description

Al automatizar TC-CAT-DETALLE-047 ("El detalle en viewport móvil mantiene los controles
operables", `PENDING-BROWSER` en Stage 1 - nunca ejercitado manualmente) se detectó que
`product.html` desborda horizontalmente en un viewport de 375×812 (ej. iPhone SE/8):
`document.documentElement.scrollWidth` = 387px contra un `clientWidth` de 375px. El listado
(`index.html`, TC-CAT-LISTADO-045) **no** presenta este problema al mismo viewport - es específico
del detalle.

---

## Steps to Reproduce

| Step | Action |
|------|--------|
| 1 | Configurar viewport 375×812 |
| 2 | Navigate to `{{QA_BASE_URL}}/product.html?id=1` |
| 3 | Leer `document.documentElement.scrollWidth` vs. `document.documentElement.clientWidth` |

---

## Expected Result

`scrollWidth` no debería superar `clientWidth` (+1px de tolerancia de redondeo) - la página no
debería requerir scroll horizontal en un viewport móvil estándar.

---

## Actual Result

`scrollWidth` = 387px, `clientWidth` = 375px (~12px de overflow).

---

## Evidence

Inspección en vivo con un script Playwright ad-hoc (`getBoundingClientRect()` sobre todos los
elementos de `body`) durante la automatización de TC-CAT-DETALLE-047, 2026-08-26. El único
elemento en el flujo normal del documento (no transformado fuera de pantalla, a diferencia del
offcanvas del carrito que también aparece en el listado de "offenders" pero no cuenta como
overflow real) cuyo borde derecho excede el viewport es `#product-content` (`class="row g-5
align-items-start"`), con `right: 387px` / `width: 399px`.

---

## Root Cause Analysis

Bajo investigación. Hipótesis: `#product-content` usa la utility de Bootstrap `g-5` (gutter de
`3rem`), que aplica márgenes negativos de `-1.5rem` a `.row` compensados normalmente por el
padding del `.container` padre - pero el padding por defecto del `.container` (basado en
`--bs-gutter-x` global, no en el `g-5` local de esta fila) es menor que el margen negativo que
introduce `g-5`, dejando el `.row` más ancho que su contenedor en viewports angostos donde ya no
hay espacio de sobra para absorber la diferencia.

---

## Fix Suggestion

Reducir el gutter de `#product-content` (ej. `g-4` o `g-3`) o agregar `overflow-x: hidden` al
`.container` padre en breakpoints móviles como salvaguarda.

---

## Impact on Automation

| TC ID | Current test state | Impact |
|-------|-------------------|--------|
| TC-CAT-DETALLE-047 | `test.fail()` — asevera `scrollWidth <= 376` | Cuando se corrija #21, Playwright reporta "expected to fail — passed"; pasar a `test()` normal |

---

## Reactivation Instructions

Cuando se corrija (issue #21):
1. Cambiar `test.fail()` → `test()` en TC-CAT-DETALLE-047 (`qa/07-automation/e2e/tests/catalogo/detalle.spec.ts`).
2. Ejecutar el test al menos 2 veces para confirmar estabilidad.
3. Mover este archivo a `06-defects/resolved/`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-08-26 | Bug encontrado durante Stage 5 (automatización P1-P3) de CAT/DETALLE |
| 1.1 | 2026-08-29 | Reconfirmado contra el refactor (`keber.cl`), **sin cambios**: `scrollWidth` 387 vs `clientWidth` 375; `#product-content` (`.row.g-5`) con `left:-12px / width:399px`. TC-CAT-DETALLE-047 pasa de `test.fixme()` a `test.fail()`. Reportado como issue keber/unicornt-store-frontend#21. |
