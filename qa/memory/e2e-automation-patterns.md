# E2E Automation Patterns — Playwright Gotchas (Stage 5)

> Cargar cuando: se escriba o revise cualquier `.spec.ts` o Page Object en
> `qa/07-automation/e2e/`. Hallazgos de la primera pasada de automatización
> (P0, 2026-08-26) que costaron tiempo de debugging — evitar repetir la
> investigación en la pasada de P1-P3.

## 1. `getByText()` con regex compara contra el texto SIN normalizar

Playwright normaliza espacios (trim + colapsa espacios internos) cuando `getByText()` recibe un
**string**, pero cuando recibe una **regex**, la compara contra el `textContent` crudo del nodo
candidato — sin trim ni colapso. Un `<p>` renderizado con indentación tipo:

```html
<p class="card-text fw-bold fs-5 text-accent mt-2">
            $13.990
          </p>
```

tiene `textContent` = `"\n            $13.990\n          "`. Un regex anclado
`/^\$\d{1,2}\.\d{3}$/` **nunca matchea** ese nodo (el `^` no coincide con el salto de línea
inicial), aunque el string plano `'$13.990'` sí matchea (ahí Playwright sí normaliza).

**Regla**: al usar `getByText(regex)`, no anclar con `^`/`$` a menos que se sepa que el nodo no
tiene whitespace circundante en el HTML fuente — usar matching por substring
(`/\$\d{1,2}\.\d{3}/`) en su lugar. Verificado en vivo contra `assets/img` cards del listado y el
toast de "Agregar al carrito" del detalle.

## 2. El toast de "Agregar al carrito" NO es el mismo mensaje en listado vs. detalle

- Listado: mensaje genérico fijo `"¡Producto agregado al carrito!"`.
- Detalle: interpola el nombre del producto — `"¡{Nombre del producto} agregado al carrito!"`
  (ej. `"¡Polera 'I Can Explain It To You' agregado al carrito!"`).

Ambos reutilizan el mismo elemento `#cart-toast` / `#toast-message`, así que **no** asumir el
mismo string fijo entre páginas. `ProductDetailPage.addedToCartToast` usa
`getByText(/agregado al carrito!/)` (substring, sin anclar) precisamente por esto. Esto
corrigió una spec de Stage 1/2 que documentaba (sin verificar) el mismo mensaje en ambas
páginas — ver `qa/01-specifications/module-catalogo/submodule-detalle/01-business-rules.md`
RN-CAT-016.

## 3. `localStorage.setItem` no re-renderiza el DOM — hace falta `page.reload()`

El carrito (offcanvas) y el badge del navbar solo leen `unicornt_cart` al cargar la página; no
hay un listener de `storage` events ni reactividad. El patrón correcto para sembrar estado de
carrito sin pasar por el flujo de "Agregar" (que tiene el defecto DEF-001) es:

```typescript
await cartPage.setCart([{ id: 1, qty: 2 }]);
await page.reload({ waitUntil: 'domcontentloaded' });
await cartPage.open();
```

Sin el `reload()`, el offcanvas sigue mostrando el estado previo (o vacío) aunque
`localStorage` ya tenga el nuevo valor.

## 4. Elementos sin rol ARIA — dónde SÍ es correcto usar un selector CSS

`#cart-badge`, `#cart-footer`, `#cart-total` y `#cart-toast` no tienen ningún rol ARIA propio
(son `<span>`/`<div>` puros) — usar `page.locator('#id')` ahí es la excepción justificada a la
regla de "preferir getByRole", con un comentario explicando por qué y
`// eslint-disable-next-line playwright/no-raw-locators` **en la línea inmediatamente anterior**
al `return`/statement (un comentario multilínea antes del código rompe
`eslint-disable-next-line`, que solo desactiva la línea siguiente literal).

En cambio, `.cart-qty-input`, `.btn-cart-plus`/`.btn-cart-minus` y el botón "Eliminar" de cada
línea del carrito **sí** tienen atributos accesibles (`aria-label="Cantidad"`,
`aria-label="Reducir"`/`"Aumentar"`, `aria-label="Eliminar"`) — no hace falta CSS ahí; alcanza con
`itemRow(productId).getByRole(...)` para desambiguar entre líneas.

## 5. Asserts viven en el spec, no en las acciones del POM (`open()`/`close()`)

`.github/skills/qa-automation/references/pom-template.md` ya documenta esta regla ("Assertions
live in the spec file... not buried inside POM methods, hiding failures"), y
`eslint-plugin-playwright`'s `expect-expect` la hace cumplir en la práctica: un test que solo
llama a `cartPage.open()` sin ningún `expect(...)` propio se marca "Test has no assertions" si
la aserción de visibilidad vive escondida dentro de `open()`. `CartPage.open()`/`close()` por
eso NO assertan internamente — el auto-wait de Playwright ya hace que cualquier interacción
posterior con el contenido del diálogo espere la transición, y el test que específicamente
verifica apertura/cierre (`TC-CARR-CARRITO-001`/`003`) agrega su propio
`expect(cartPage.dialog).toBeVisible()/toBeHidden()`.

`CatalogPage.addToCart()`/`ProductDetailPage.addToCart()` sí assertan el toast internamente
(patrón heredado de una sesión anterior) — inconsistente con la regla anterior, pero no se tocó
por no ser parte del alcance de esta pasada; considerar alinearlo si se refactoriza ese POM.

## 6. No hay diálogos de confirmación nativos en el carrito

"Eliminar" y "Vaciar carrito" ejecutan la acción inmediatamente sin `window.confirm()` ni modal
— no hace falta manejar `page.on('dialog', ...)` en ningún test de CARR.
