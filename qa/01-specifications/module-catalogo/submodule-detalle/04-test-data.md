# Test Data — Detalle de producto

## Prerequisites

| Item | Description | Source |
|------|-------------|--------|
| Catálogo de 49 productos | Hardcodeado en `assets/js/products.js` | Estático (app) |
| `localStorage['unicornt_cart']` limpio | Precondición estándar de cada TC | Fixture `clearCart()` |

## Data shapes for key scenarios

### Scenario: happy path — agregar cantidad válida
- `id`: cualquiera entre 1 y 49
- Cantidad: valor dentro de 1–99, ajustado con los botones +/- o edición manual válida
- Resultado esperado: `unicornt_cart` contiene `{"id": {id}, "qty": {cantidad}}`

### Scenario — negativo: `id` inválido
| Valor de `id` a probar | Categoría |
|---|---|
| (ausente) | Parámetro faltante |
| `abc` | No numérico |
| `0` | Límite inferior inválido |
| `-1` | Negativo |
| `50` | Uno por sobre el último id válido |
| `9999` | Muy fuera de rango |
| `01` | Formato con cero a la izquierda (caso "casi válido") |
| `1.5` | Decimal (caso "casi válido") |

- Resultado esperado: los primeros 6 valores redirigen a `index.html`; `01` y `1.5` resuelven al
  producto `1` (ver RN-CAT-007).

### Scenario — negativo: cantidad inválida al agregar
| Valor de cantidad | Resultado esperado |
|---|---|
| `0` | Se agrega qty=1 |
| `-5` | Se agrega qty=1 |
| `` (vacío) | Se agrega qty=1 |
| `150` | **Defecto**: se agrega qty=150 tal cual (no clampea a 99) |

- Estos valores se obtienen editando el input directamente (`fill` o `eval` sobre el DOM), no vía
  los botones +/-, que sí están correctamente clampeados.

### Scenario — negativo: agregación que excede el máximo
- Precondición: `unicornt_cart` = `[{"id": {id}, "qty": 99}]` (setear vía `localStorage`
  directamente)
- Acción: agregar 1 unidad más desde el detalle
- Resultado observado (defecto): `qty` pasa a 100. Ver DEF-001.

## Referencia de productos usados en los TCs de este submódulo

| id | Nombre | Precio |
|----|--------|--------|
| 1 | Polera 'I Can Explain It To You' | $13.990 |
| 49 | Polera 'Quality Assurance Vol. 2' | $13.990 |

No aplica el patrón `EXEC_IDX` — mismo motivo que en LISTADO (catálogo fijo, sin identificadores
de negocio generados por el usuario).

## Data isolation rules

1. Cada test parte de `unicornt_cart` limpio (fixture `clearCart()`).
2. Los TCs de `id` inválido no requieren estado de carrito — son de solo navegación.
3. Los TCs de cantidad inválida deben editar el input directamente (no repetir clicks de +/-, que
   ya están validados por separado en RN-CAT-008).
