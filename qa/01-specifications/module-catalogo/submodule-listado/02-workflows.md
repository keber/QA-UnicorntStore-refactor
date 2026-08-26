# Workflows — Catálogo: Listado de productos

### FL-CAT-001: Explorar catálogo y agregar producto al carrito (happy path)

**Actor**: Visitante (sin login, no aplican roles)
**Trigger**: Carga de `index.html`
**Precondition**: `localStorage['unicornt_cart']` vacío o inexistente

**Flow**:
```
[Start: carga index.html]
    │
    ▼
[Catálogo renderiza 49 tarjetas de producto]
    │
    ▼
[Usuario ubica un producto de interés]
    │
    ▼
[Click en "Agregar"]
    │
    ├─ producto NO estaba en el carrito ──► [Se crea entrada {id, qty:1}] (RN-CAT-002)
    │
    └─ producto YA estaba en el carrito ──► [Se incrementa qty existente] (RN-CAT-003)
    │
    ▼
[Toast "¡Producto agregado al carrito!" aparece]
    │
    ▼
[Badge del botón "Carrito" se actualiza]
    │
    ▼
[End: producto disponible en el carrito, catálogo sigue visible]
```

**Postcondition**: `unicornt_cart` contiene la entrada del producto agregado; el usuario puede
seguir agregando más productos o abrir el carrito (offcanvas, ver CARR).

---

### FL-CAT-002: Explorar catálogo y navegar al detalle de un producto

**Actor**: Visitante
**Trigger**: Click en "Ver más" de una tarjeta
**Precondition**: Ninguna

**Flow**:
```
[Start: usuario en index.html]
    │
    ▼
[Click en "Ver más" de la tarjeta del producto id=N]
    │
    ▼
[Navega a product.html?id=N]
    │
    ▼
[Detalle del producto N se renderiza] (ver submodule-detalle)
    │
    ├─ [Usuario hace click en "Volver"] ──► [Regresa a index.html]
    │
    ▼
[End: usuario en detalle del producto o de vuelta en el listado]
```

**Postcondition**: El estado del carrito (si existía) se mantiene sin cambios; la navegación es
puramente de lectura.

---

### FL-CAT-005: Agregar un producto que ya está en el límite máximo (rama de error/defecto)

**Actor**: Visitante
**Trigger**: Click en "Agregar" sobre un producto cuya entrada en `unicornt_cart` ya tiene
`qty=99`
**Precondition**: `unicornt_cart` = `[{"id": N, "qty": 99}]` para el producto N

**Flow**:
```
[Start: producto N ya en el carrito con qty=99]
    │
    ▼
[Click en "Agregar" de la tarjeta del producto N]
    │
    ▼
[DEFECTO: no se valida el límite máximo antes de incrementar] (RN-CAT-004)
    │
    ▼
[unicornt_cart pasa a {"id": N, "qty": 100}]
    │
    ▼
[Toast de éxito aparece igual que en el happy path — sin ninguna advertencia]
    │
    ▼
[End: el carrito queda con una cantidad por sobre el máximo declarado, sin que el usuario
 reciba ningún indicio del problema]
```

**Postcondition**: Estado inconsistente respecto al límite declarado (`max="99"`) hasta que se
corrija `DEF-001`. Ver también la rama gemela desde el detalle: `submodule-detalle/02-workflows.md`
FL-CAT-004b.
