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

## 7. Botones con ícono Font Awesome: accessible name "sucio" en Chromium (P1-P3 pass, 2026-08-26)

Los botones/enlaces con un `<i class="fa-solid ...">` adyacente al texto (sin `aria-hidden`)
exponen en Chromium un accessible name con un espacio y/o el glyph del ícono mezclado con el
texto visible (ej. el botón "Carrito" del navbar resuelve como `" Carrito"`, con un espacio
inicial). `textContent` (vía `toHaveText()`) **no** se ve afectado — el ícono es un
`::before`/nodo `<i>` vacío, no aporta texto real al DOM.

**Regla**: nunca usar `{ name: '...', exact: true }` en un botón/enlace con ícono adyacente —
usar match por substring (el default de `getByRole`), o si lo que importa es la ausencia de un
valor (ej. "sin badge numérico en el nombre"), usar `not.toHaveAccessibleName(/\d/)` en vez de
comparar el string completo.

## 8. `getByRole('button', { name: 'Carrito' })` sin `banner` matchea otros botones "...carrito"

`getByRole` con un string hace match por substring case-insensitive por defecto. Un locator de
"Carrito" (el botón del navbar) sin scope también matchea "Agregar al carrito" (detalle) y
"Vaciar carrito" (footer del offcanvas, una vez poblado) — `strict mode violation` en cuanto
ambos coexisten en la página. Todos los page objects de este proyecto (`CatalogPage.cartButton`,
`ProductDetailPage.cartButton`, `CartPage.openButton`) scopean ahora el botón del navbar a
`page.getByRole('banner')` primero.

## 9. El offcanvas de Bootstrap ignora Escape/foco durante su transición de apertura

`open()` solo dispara el click que inicia la transición `showing` → `show` (~300ms); interactuar
inmediatamente después (Escape, o `.focus()` + `Enter` en un control interno) es una race
condition silenciosa - Bootstrap activa su focus-trap recién al terminar la transición, robando
el foco que se haya seteado antes. **Regla**: esperar `await expect(cartPage.dialog).toHaveClass(/\bshow\b/)`
(no `showing`) antes de cualquier interacción de teclado dentro del offcanvas recién abierto. Un
`.click()` normal no sufre esto — el auto-wait de actionability de Playwright ya espera a que el
elemento esté "stable" (sin transición CSS en curso).

## 10. Script de node para ediciones masivas de archivos: evitar regex con `\|` y backticks

Al generar contenido vía un script de Node ejecutado por un LLM (no tipeado directamente por un
humano), las secuencias de escape densas (`\\|`, `` \` ``) sobreviven de forma inconsistente el
pipeline de transporte de la herramienta de shell — algunas se preservan, otras pierden un nivel
de escaping silenciosamente, produciendo un regex roto sin ningún error (falla en ~4 de 124 filas
sin lanzar excepción). **Regla**: para ediciones de archivo masivas y mecánicas (ej. actualizar
una columna en decenas de filas de una tabla Markdown), usar operaciones de string simples
(`split('|')`/`join('|')`, `indexOf`) en vez de regex con pipes/backticks escapados, y construir
caracteres especiales vía `String.fromCharCode`/`String.fromCodePoint` en vez de literales
embebidos. Verificar el conteo de filas cambiadas contra el esperado antes de confiar en el
resultado.

## 11. Code coverage E2E con `monocart-coverage-reports` (2026-08-26)

Se agregó cobertura de código V8 (JS/CSS) del front-end propio de la app, vía el API CDP
`page.coverage` de Playwright (Chromium-only) + [`monocart-coverage-reports`](https://github.com/cenfun/monocart-coverage-reports).
No confundir con el coverage de TCs (`COVERAGE-MAPPING.md`) — este mide qué % del *código*
`assets/js/*.js`/`assets/css/main.css` real ejecuta la suite, no qué % del plan de pruebas está
automatizado.

- **Patrón oficial verificado, no adivinado**: antes de escribir el fixture se trajo el ejemplo
  real `cenfun/playwright-coverage` (repo del propio autor del paquete) vía `gh api` para copiar
  el patrón exacto de `fixtures.ts`/`global-setup.ts`/`global-teardown.ts` — la API del paquete
  (namespace `MCR` con `export =`, tipos `CoverageReportOptions`/`V8CoverageEntry`) no es intuible
  de memoria con confianza suficiente para código que va a CI.
- **`entryFilter`/`sourceFilter` son obligatorios** aquí: la página también carga Bootstrap
  (`cdn.jsdelivr.net`) y Font Awesome (`cdnjs.cloudflare.com`) desde CDN — sin filtrar por
  `/assets/(js|css)/` el reporte mezclaría código vendor minificado irrelevante.
- El JS propio de la app no está minificado ni bundleado (confirmado en
  `arquitectura-unicornstore-2026-08-26.md`), así que no hace falta configurar sourcemaps — las
  líneas del reporte coinciden 1:1 con el código fuente real servido.
- Fixture auto (`fixtures/coverage-fixture.ts`, merged en `test-options.ts` vía `mergeTests()`)
  escucha `context.on('page', ...)` en vez de usar solo el fixture `page` — así un test que abra
  una pestaña nueva también queda cubierto, igual que el ejemplo oficial.
- Resultado real de la primera corrida completa (156 tests, 150 pass + 6 fixme): **93.55%
  statements, 96.18% lines, 100% functions, 71.05% branches** sobre `app.js`/`cart.js`/
  `products.js`. Publicado en CI junto al reporte de tests, ver `README.md` raíz → "Code Coverage".
