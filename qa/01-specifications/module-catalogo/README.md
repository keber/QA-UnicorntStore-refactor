# MODULE: Catálogo (CAT)

> ⚠️ **Post-refactor (Stage 6 "green first", 2026-09-06).** El sitio pasó de stub estático a app
> Vite + backend Spring Boot. Para CAT: el catálogo ahora se carga de `GET /api/v1/products` +
> `GET /api/v1/categories`; hay un **filtro por categoría** (`select#category-filter`, value =
> slug → `?category=<slug>`); el storefront muestra **sólo los primeros 20 de 49 productos** (sin
> paginación en la UI). `id` inválido en `product.html` sigue redirigiendo a `index.html` (sin
> cambios). Los escenarios "sin llamadas a `/api`" y "sin formulario de contacto real" quedan
> `OBSOLETE-SCENARIO`. Verdad de terreno autoritativa:
> `qa/memory/arquitectura-unicornstore-2026-09-06.md` +
> `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`. La reescritura completa de
> specs (categorías, filtro, paginación) queda para el sprint de re-baseline (ver
> `qa/AGENT-NEXT-STEPS.md`).

> Stage 1 (module analysis) completado 2026-08-26 vía exploración en vivo con `playwright-cli`
> contra `https://unicornt-store.keber.cl`. Stage 2 (`qa-spec-generation`) revisado el mismo día:
> se formalizaron 4 business rules adicionales (RN-CAT-013 a RN-CAT-016, ver los archivos
> `01-business-rules.md` de cada submódulo) y el workflow de rama de error del límite máximo en
> LISTADO (FL-CAT-005) que faltaba para cumplir la cobertura obligatoria de "error path". Ver
> `qa/memory/arquitectura-unicornstore-2026-08-26.md` para el contexto de arquitectura completo
> (app front-end puro, sin login/API).

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

- Stage 3 (`qa-test-plan`): Plan de Pruebas Sprint 1, junto con CARR/CARRITO (ya analizado, ver
  `qa/01-specifications/module-carrito/`).
