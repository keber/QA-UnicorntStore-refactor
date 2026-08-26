# MODULE: Catálogo (CAT)

> Stage 1 (module analysis) completado 2026-08-26 vía exploración en vivo con `playwright-cli`
> contra `https://unicornt-store.keber.cl`. Ver `qa/memory/arquitectura-unicornstore-2026-08-26.md`
> para el contexto de arquitectura completo (app front-end puro, sin login/API).

## Submódulos

| Código | Nombre | Ruta | TCs documentados | Estado |
|---|---|---|---|---|
| LISTADO | Listado de productos | `index.html#products` | 50 | ✅ Analizado |
| DETALLE | Detalle de producto | `product.html?id={id}` | 55 | ✅ Analizado |

## Hallazgos clave de esta sesión

- El catálogo es 100% estático: 49 productos, todos de categoría **"Polera"** (no se observó
  ningún producto de categoría "Tazón" pese a que el footer menciona "Poleras y tazones").
- **Defecto encontrado**: el límite máximo de cantidad por ítem (`max="99"` en el input de
  cantidad) no se respeta al usar el flujo de "Agregar" — ni desde el listado ni desde el
  detalle — cuando la cantidad resultante de la suma supera 99. Ver `qa/06-defects/open/DEF-001-limite-maximo-cantidad-no-respetado-al-agregar.md`.
- Navegar a `product.html` con un `id` inválido (ausente, no numérico, 0, negativo o fuera de
  rango 1–49) redirige silenciosamente a `index.html`, sin mensaje de error.
- No hay búsqueda, filtros, paginación, variantes de producto, reseñas ni productos relacionados.

## Flujo E2E de referencia

```
[Listado] ──Ver más──► [Detalle] ──Agregar al carrito──► [Carrito (offcanvas, ver CARR)]
   │                                                              ▲
   └──────────────────────── Agregar ────────────────────────────┘
```

## Próximos pasos

- Submódulo CARR/CARRITO (Carrito de compras) — pendiente, ver `qa/AGENT-NEXT-STEPS.md`.
- Stage 2 (`qa-spec-generation`) puede iniciar sobre estos dos submódulos una vez CARR esté
  también analizado, o en paralelo si el sprint lo permite.
