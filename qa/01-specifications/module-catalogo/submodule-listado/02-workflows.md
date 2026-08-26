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
