# Bug Report — DEF-001: Límite máximo de cantidad (99) no se respeta al agregar al carrito

| Field | Value |
|-------|-------|
| Bug ID | DEF-001 |
| Title | El flujo "Agregar" (listado y detalle) no clampea la cantidad al máximo de 99 |
| Severity | Low |
| Priority | P2 |
| Status | Open |
| Assigned to | Unassigned |
| Module | Catálogo |
| Submodule | LISTADO, DETALLE |
| Environment | QA (`https://unicornt-store.keber.cl`) |
| Browser | Chromium (via `@playwright/cli`) |
| Date reported | 2026-08-26 |
| ADO WI | N/A (ADO deshabilitado en este proyecto) |
| Related TCs | TC-CAT-LISTADO-027, TC-CAT-DETALLE-018, TC-CAT-DETALLE-022 |

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
| TC-CAT-LISTADO-027 | Documentado como negativo con resultado actual ≠ esperado | Automatizar con `test.fixme()` o assertion que documente el valor actual (100) hasta que se decida el fix |
| TC-CAT-DETALLE-018 | Idem | Idem (valor actual 150) |
| TC-CAT-DETALLE-022 | Idem | Idem (valor actual 100) |

**Test skip command sugerido** (a aplicar cuando se escriba la automatización en Stage 5):
```typescript
test.fixme(true,
  'DEF-001: el máximo de 99 no se respeta al agregar al carrito. Reactivar cuando se corrija.'
);
```

---

## Reactivation Instructions

Cuando se corrija:
1. Remover `test.fixme()` de los TCs listados arriba.
2. Ajustar la aserción esperada a `qty` clampeada en 99 en ambos escenarios.
3. Ejecutar los tests al menos 2 veces para confirmar estabilidad.
4. Mover este archivo a `06-defects/resolved/`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-08-26 | Bug reportado durante Stage 1 (module analysis) de CAT/LISTADO y CAT/DETALLE |
