# Workflows — Carrito: Carrito de compras (offcanvas)

### FL-CARR-001: Revisar y ajustar cantidades en el carrito

**Actor**: Visitante
**Trigger**: Click en el botón "Carrito" del navbar
**Precondition**: `unicornt_cart` tiene al menos un ítem

**Flow**:
```
[Start: click en botón "Carrito"]
    │
    ▼
[Offcanvas se abre, muestra las líneas de producto]
    │
    ▼
[Usuario ajusta cantidad de una línea]
    │
    ├─ click "+" ──────────────► [qty +1, clampeado en 99] (RN-CARR-004)
    │
    ├─ click "−" (qty > 1) ────► [qty −1]
    │
    ├─ click "−" (qty == 1) ───► [línea eliminada] (RN-CARR-003)
    │
    └─ edición manual ─────────► [saneado/clampeado a 1–99] (RN-CARR-005)
    │
    ▼
[Total se recalcula] (RN-CARR-002)
    │
    ▼
[End: usuario cierra el offcanvas (X, Escape o backdrop)]
```

**Postcondition**: `unicornt_cart` refleja las cantidades ajustadas; el badge del botón "Carrito"
se actualiza acorde.

---

### FL-CARR-002: Eliminar un ítem del carrito

**Actor**: Visitante
**Trigger**: Click en "Eliminar" de una línea
**Precondition**: `unicornt_cart` tiene al menos un ítem

**Flow**:
```
[Start: offcanvas abierto con ≥1 línea]
    │
    ▼
[Click en "Eliminar" de una línea]
    │
    ▼
[Línea se quita de unicornt_cart inmediatamente, sin confirmación] (RN-CARR-006)
    │
    ▼
[Total se recalcula]
    │
    ├─ quedan más líneas ──────► [Offcanvas sigue mostrando el resto]
    │
    └─ era la última línea ────► [Offcanvas pasa a estado vacío] (RN-CARR-001)
    │
    ▼
[End]
```

**Postcondition**: La línea eliminada ya no existe en `unicornt_cart`.

---

### FL-CARR-003: Vaciar el carrito completo

**Actor**: Visitante
**Trigger**: Click en "Vaciar carrito"
**Precondition**: `unicornt_cart` tiene al menos un ítem

**Flow**:
```
[Start: offcanvas abierto con ≥1 línea]
    │
    ▼
[Click en "Vaciar carrito"]
    │
    ▼
[unicornt_cart pasa a []], sin confirmación (RN-CARR-007)
    │
    ▼
[Offcanvas pasa a estado vacío] (RN-CARR-001)
    │
    ▼
[Badge del botón "Carrito" desaparece]
    │
    ▼
[End]
```

**Postcondition**: El carrito queda completamente vacío.

---

### FL-CARR-004: Finalizar compra (simulado)

**Actor**: Visitante
**Trigger**: Click en "Finalizar compra"
**Precondition**: `unicornt_cart` tiene al menos un ítem (footer visible)

**Flow**:
```
[Start: offcanvas abierto con ≥1 línea]
    │
    ▼
[Click en "Finalizar compra"]
    │
    ▼
[unicornt_cart pasa a []]
    │
    ▼
[Offcanvas se cierra]
    │
    ▼
[Toast "¡Gracias por tu compra! Tu pedido está en camino. 🦄"] (RN-CARR-008)
    │
    ▼
[End: sin número de orden, sin página de confirmación, sin llamada de red]
```

**Postcondition**: El carrito queda vacío, sin ningún registro de la "compra" en ningún lado.

---

### FL-CARR-005: Carrito con referencia a producto inexistente (rama de negativo)

**Actor**: N/A (estado alcanzado por manipulación directa de `localStorage` o por un catálogo que
cambió entre sesiones)
**Trigger**: `unicornt_cart` contiene un `id` que no existe en el catálogo actual
**Precondition**: Ninguna

**Flow**:
```
[Start: unicornt_cart = [{id: N-inexistente, qty: X}]]
    │
    ▼
[Abrir el offcanvas]
    │
    ▼
[DEFECTO: no se muestra ninguna fila NI el mensaje de "vacío";
 footer visible con Total $0; badge cuenta X] (RN-CARR-009)
    │
    ▼
[Click en "Finalizar compra"] ──► [Se "completa" con éxito, mismo toast que una compra real]
    │
    ▼
[End: unicornt_cart = []]
```

**Postcondition**: El defecto no bloquea al usuario, pero deja una experiencia inconsistente y
potencialmente confusa. Ver DEF-002.
