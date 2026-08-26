# Workflows — Catálogo: Detalle de producto

### FL-CAT-003: Ver detalle de producto y agregar cantidad personalizada al carrito

**Actor**: Visitante
**Trigger**: Navegación a `product.html?id={id}` válido
**Precondition**: `id` corresponde a un producto existente (1–49)

**Flow**:
```
[Start: navega a product.html?id=N]
    │
    ▼
[Detalle del producto N se renderiza, cantidad inicial = 1]
    │
    ▼
[Usuario ajusta la cantidad]
    │
    ├─ [+/- dentro de 1-99] ──────────────► [Valor clampeado correctamente] (RN-CAT-008)
    │
    ├─ [edición manual fuera de rango] ───► [Ver FL-CAT-004b más abajo]
    │
    ▼
[Click en "Agregar al carrito"]
    │
    ├─ producto NO estaba en el carrito ──► [Se crea entrada {id, qty: N}]
    │
    └─ producto YA estaba en el carrito ──► [Se suma N a la qty existente] (RN-CAT-011)
    │
    ▼
[Toast "¡Producto agregado al carrito!" + badge actualizado]
    │
    ▼
[End: producto en el carrito con la cantidad elegida]
```

**Postcondition**: `unicornt_cart` refleja la cantidad agregada. El selector de cantidad de la
página de detalle NO persiste su valor entre recargas (siempre reinicia en 1).

---

### FL-CAT-004: Acceso a producto inexistente o `id` inválido

**Actor**: Visitante
**Trigger**: Navegación a `product.html` con un `id` ausente, no numérico, `0`, negativo o fuera
de rango
**Precondition**: Ninguna

**Flow**:
```
[Start: navega a product.html?id={valor inválido}]
    │
    ▼
[La app intenta resolver el producto contra el catálogo estático]
    │
    ▼
[No encuentra coincidencia]
    │
    ▼
[Redirige silenciosamente a index.html] (RN-CAT-007)
    │
    ▼
[End: usuario en el listado, sin ningún mensaje de error]
```

**Postcondition**: El usuario no recibe feedback de que su URL era inválida — queda en el listado
como si hubiera navegado ahí directamente.

---

### FL-CAT-004b: Edición manual de cantidad fuera de rango (rama de negativo)

**Actor**: Visitante
**Trigger**: Edición directa del valor del input de cantidad (no vía botones +/-) a un valor
`≤0`, vacío o `>99`
**Precondition**: Página de detalle cargada

**Flow**:
```
[Input de cantidad editado a valor inválido]
    │
    ├─ valor ≤ 0 o vacío ──► [Click "Agregar al carrito"] ──► [Se agrega qty=1] (RN-CAT-009)
    │
    └─ valor > 99 ─────────► [Click "Agregar al carrito"] ──► [DEFECTO: se agrega el valor
                                                                 tal cual, sin clamping] (RN-CAT-010)
```

**Postcondition**: Rama `≤0`/vacío: comportamiento correcto (fallback a 1). Rama `>99`: defecto
confirmado, ver DEF-001.
