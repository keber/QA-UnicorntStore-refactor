# Bug Report — DEF-001: Límite máximo de cantidad (99) no se respeta al agregar al carrito

| Field | Value |
|-------|-------|
| Bug ID | DEF-001 |
| Title | "Agregar al carrito" supera el límite de 99 al acumular sobre un ítem ya en el máximo (listado y detalle) |
| Severity | Low |
| Priority | P2 |
| Status | Open (parcial — ver Changelog v1.1) |
| Assigned to | Unassigned |
| Module | Catálogo |
| Submodule | LISTADO, DETALLE |
| Environment | Detectado contra la versión pre-refactor (hoy en `https://unicornt-store-frontend.keberflores.workers.dev`); reconfirmado contra el refactor en `https://unicornt-store.keber.cl` el 2026-08-29 |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-08-26 |
| GitHub Issue | keber/unicornt-store-frontend#19 |
| ADO WI | N/A (ADO deshabilitado en este proyecto) |
| Related TCs | TC-CAT-LISTADO-027, TC-CAT-DETALLE-022 (TC-CAT-DETALLE-018 corregido) |

---

## Description

El selector de cantidad de la página de detalle declara un máximo de 99 (`max="99"` en el input,
y los botones "+/-" respetan ese límite correctamente). Sin embargo, el flujo real de "Agregar al
carrito" — tanto desde el botón "Agregar" del listado como desde "Agregar al carrito" del
detalle — no valida ese máximo antes de persistir en `localStorage['unicornt_cart']`, en dos
escenarios distintos.

---

## Steps to Reproduce

**Escenario A — cantidad editada manualmente por sobre 99 (detalle)**

| Step | Action |
|------|--------|
| 1 | Navigate to `{{QA_BASE_URL}}/product.html?id=1` |
| 2 | Editar el input de cantidad directamente a `150` (ej. pegar el valor) |
| 3 | Click en "Agregar al carrito" |
| 4 | Observe `localStorage['unicornt_cart']` |

**Escenario B — agregar sobre un ítem que ya está en el máximo (listado o detalle)**

| Step | Action |
|------|--------|
| 1 | Establecer `localStorage['unicornt_cart'] = '[{"id":1,"qty":99}]'` |
| 2 | Navigate to `{{QA_BASE_URL}}/index.html` (o al detalle de id=1) |
| 3 | Click en "Agregar" (listado) o "Agregar al carrito" (detalle, cantidad=1) para el producto id=1 |
| 4 | Observe `localStorage['unicornt_cart']` |

---

## Expected Result

Según el límite declarado por el propio selector de cantidad (`max="99"`, y el comportamiento
correcto de los botones +/-, ver RN-CAT-008), `qty` debería quedar clampeada en 99 en ambos
escenarios.

---

## Actual Result

- Escenario A: `unicornt_cart` = `[{"id":1,"qty":150}]` — se persiste el valor tal cual, sin
  clamping.
- Escenario B: `unicornt_cart` = `[{"id":1,"qty":100}]` — la suma supera el máximo sin
  advertencia ni corrección.

---

## Evidence

- Verificado interactivamente con `playwright-cli` (`eval`/`fill` + `localstorage-list`) en esta
  sesión de exploración (2026-08-26). No se capturó screenshot — el estado relevante es el valor
  de `localStorage`, no visual.

---

## Root Cause Analysis

Bajo investigación. Hipótesis: la función de agregar al carrito en `assets/js/cart.js` valida y
sanea cantidades `<= 0` (default a 1, ver RN-CAT-009) pero no aplica el mismo `Math.min(qty, 99)`
al valor final antes de escribir en `localStorage`. Los botones +/- del selector de cantidad, en
cambio, sí tienen su propia lógica de clamping independiente — de ahí la inconsistencia.

---

## Fix Suggestion

Aplicar `Math.min(cantidadFinal, 99)` (o el límite de negocio vigente) en el punto único donde se
escribe `unicornt_cart`, tanto para la ruta de "nueva entrada" como para la de "suma sobre entrada
existente" — no solo en los botones +/- del selector visual.

---

## Impact on Automation

| TC ID | Current test state | Impact |
|-------|-------------------|--------|
| TC-CAT-LISTADO-027 | `test.fail()` — asevera el comportamiento correcto (`qty` = 99) | Cuando se corrija #19, Playwright reporta "expected to fail — passed"; pasar a `test()` normal |
| TC-CAT-DETALLE-022 | `test.fail()` — idem | Idem |
| TC-CAT-DETALLE-018 | `test()` normal — **pasa** (escenario A corregido en el refactor) | Ninguno; guarda de regresión para el fix del clamp por entrada manual |

---

## Reactivation Instructions

Cuando se corrija el escenario B (issue #19):
1. Cambiar `test.fail()` → `test()` en TC-CAT-LISTADO-027 (`tests/catalogo/listado.spec.ts`) y TC-CAT-DETALLE-022 (`tests/catalogo/detalle.spec.ts`).
2. Ejecutar los tests al menos 2 veces para confirmar estabilidad.
3. Mover este archivo a `06-defects/resolved/`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-08-26 | Bug reportado durante Stage 1 (module analysis) de CAT/LISTADO y CAT/DETALLE |
| 1.1 | 2026-08-29 | Reconfirmado contra el refactor (`keber.cl`). **Escenario A corregido**: editar la cantidad del detalle por sobre 99 y agregar ahora clampa a 99 (TC-CAT-DETALLE-018 des-fixme'd, pasa como test normal). **Escenario B persiste**: agregar sobre un ítem ya en `qty:99` sube a 100, tanto en listado (TC-CAT-LISTADO-027) como en detalle (TC-CAT-DETALLE-022) — ambos `test.fail()`. Reportado como issue keber/unicornt-store-frontend#19. |
