# Test Data — Listado de productos

## Prerequisites

| Item | Description | Source |
|------|-------------|--------|
| Catálogo de 49 productos | Hardcodeado en `assets/js/products.js`, no requiere seed | Estático (app) |
| `localStorage['unicornt_cart']` limpio | Precondición estándar de cada TC | Fixture `clearCart()` en `fixtures/pom/page-object-fixture.ts` |

No existen datos de prueba dinámicos ni entidades que deban crearse antes de un test: el
catálogo es fijo y no hay usuarios, credenciales ni backend. No aplica la sección de "usuarios de
prueba" de este template.

## Data shapes for key scenarios

### Scenario: agregar producto nuevo al carrito
- Producto: cualquiera de los 49 (`id` entero 1–49)
- Precondición: `unicornt_cart` no contiene ese `id`
- Resultado esperado: `unicornt_cart` = `[{"id": {id}, "qty": 1}]`

### Scenario: agregación de cantidad (repetir "Agregar")
- Producto: mismo `id` que ya existe en `unicornt_cart`
- Resultado esperado: `qty` de esa entrada se incrementa en 1 (no nueva entrada)

### Scenario — negativo: límite máximo excedido (defecto conocido)
- Precondición: `unicornt_cart` = `[{"id": {id}, "qty": 99}]` (setear directamente vía
  `localStorage` para no depender de 99 clicks)
- Acción: click en "Agregar" sobre la tarjeta de ese mismo `id`
- Resultado observado (defecto): `qty` pasa a 100. Ver DEF-001.

## Referencia de productos usados en los TCs de este submódulo

| id | Nombre | Precio |
|----|--------|--------|
| 1 | Polera 'I Can Explain It To You' | $13.990 |
| 49 | Polera 'Quality Assurance Vol. 2' | $13.990 |

No se requiere el patrón `EXEC_IDX` en este submódulo: no se crea ningún dato con nombre único
por ejecución (el catálogo es fijo y el carrito no tiene identificadores de negocio, solo
`id`/`qty`).

## Data isolation rules

1. Cada test debe partir de `unicornt_cart` limpio (usar la fixture `clearCart()`, no depender
   del orden de ejecución de otros tests).
2. Los TCs que requieren un estado inicial del carrito (ej. "producto ya en el carrito") deben
   establecerlo directamente vía `localStorage.setItem` en `beforeEach`, no repitiendo clicks de
   UI, para mantener el test rápido y determinístico.
