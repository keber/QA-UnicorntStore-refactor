# Test Data — Carrito de compras (offcanvas)

## Prerequisites

| Item | Description | Source |
|------|-------------|--------|
| Catálogo de 49 productos | Mismo catálogo estático usado por CAT | Estático (app) |
| `localStorage['unicornt_cart']` con estado conocido | Precondición de cada TC, setear directamente vía `localStorage.setItem` para no depender de flujos de "Agregar" (que tienen el defecto DEF-001) | Fixture / `eval` en `beforeEach` |

## Data shapes for key scenarios

### Scenario: carrito con 1 ítem
- `unicornt_cart` = `[{"id": 1, "qty": 1}]`

### Scenario: carrito con múltiples ítems, cantidades distintas
- `unicornt_cart` = `[{"id": 1, "qty": 2}, {"id": 2, "qty": 5}]`
- Total esperado: `(13.990×2) + (14.990×5) = 27.980 + 74.950 = 102.930` → `$102.930`

### Scenario — negativo: cantidad en el límite superior
- `unicornt_cart` = `[{"id": 1, "qty": 99}]`
- Acción: click en "+" → debe permanecer en 99

### Scenario — negativo: entrada con producto inexistente (defecto DEF-002)
- `unicornt_cart` = `[{"id": 9999, "qty": 1}]`
- Resultado observado: offcanvas sin filas, footer visible, Total `$0`, badge "1"

### Scenario: carrito vacío
- `unicornt_cart` = `[]` o clave inexistente en `localStorage`

## Referencia de productos usados en los TCs de este submódulo

| id | Nombre | Precio |
|----|--------|--------|
| 1 | Polera 'I Can Explain It To You' | $13.990 |
| 2 | Polera 'Cloud Architect' | $14.990 |

No aplica el patrón `EXEC_IDX` — mismo motivo que en CAT (no hay identificadores de negocio
generados por el usuario; el carrito solo tiene `id`/`qty`).

## Data isolation rules

1. Cada test debe establecer el estado inicial de `unicornt_cart` directamente vía
   `localStorage.setItem` en `beforeEach` (no repitiendo clicks de "Agregar" desde CAT), para
   mantener el test rápido, determinístico y desacoplado del defecto DEF-001.
2. Los TCs que verifican el defecto DEF-002 deben usar un `id` que se confirme inexistente en el
   catálogo actual (ej. `9999`) antes de cada ejecución, ya que el catálogo podría crecer en el
   futuro.
