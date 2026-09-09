# Test Scenarios — Catálogo: Listado de productos

**Module code**: CAT
**Submodule code**: LISTADO
**Last updated**: 2026-09-06
**version**: 1.1
**change-summary**: Stage 6 "green first" — el listado ahora se carga de `GET /api/v1/products`
(+ `GET /api/v1/categories`), muestra sólo los primeros 20 de 49, y tiene un filtro por categoría
(`select#category-filter` → `?category=<slug>`). TC-039 (sin `<form>` de contacto) y TC-040 (sin
`/api`) → `OBSOLETE-SCENARIO`. Selectores nuevos y reglas de espera en
`qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md` §2. Reescritura completa de specs
de catálogo/filtro/paginación → sprint de re-baseline.

## Summary

| Priority | Count | Automated | Manual |
|----------|-------|-----------|--------|
| P0 | 10 | 0 | 10 |
| P1 | 16 | 0 | 16 |
| P2 | 18 | 0 | 18 |
| P3 | 6 | 0 | 6 |
| **Total** | **50** | **0** | **50** |

---

### TC-CAT-LISTADO-001: La página carga con el título correcto en la pestaña

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar a `{{QA_BASE_URL}}/index.html`.

**Expected result**: El título de la pestaña del navegador es `"Unicorn't Store"`.

**Notes**: —

---

### TC-CAT-LISTADO-002: El header muestra logo, navegación y botón Carrito

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el `<banner>`/navbar.

**Expected result**: Se muestran el enlace "Unicorn't Store" (logo), los enlaces "Inicio" y
"Contacto", y el botón "Carrito".

**Notes**: —

---

### TC-CAT-LISTADO-003: El skip link enfoca el contenido principal

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Cargar el listado y presionar Tab una vez (foco inicial del documento).
2. Activar el enlace "Saltar al contenido principal".

**Expected result**: El foco/scroll se mueve al ancla `#products` (inicio de la sección de
catálogo).

**Notes**: Accesibilidad — elemento confirmado en el DOM (`href="#products"`), interacción de
teclado no ejecutada en esta sesión.

---

### TC-CAT-LISTADO-004: La sección de catálogo muestra el heading "Nuestros productos"

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.

**Expected result**: Existe un `heading` de nivel 2 con el texto "Nuestros productos".

**Notes**: —

---

### TC-CAT-LISTADO-005: El catálogo renderiza exactamente 49 productos

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Contar los elementos `<article>` dentro de la lista `aria-label="Catálogo de productos"`.

**Expected result**: Se cuentan exactamente 49 artículos.

**Notes**: Confirmado por snapshot completo de la página en esta sesión.

---

### TC-CAT-LISTADO-006: Cada tarjeta muestra una imagen con `alt` igual al nombre del producto

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el atributo `alt` de la imagen de varias tarjetas (muestreo: primera, última, una
   intermedia).

**Expected result**: El `alt` de la imagen coincide exactamente con el nombre del producto (ej.
`"Polera 'I Can Explain It To You'"`).

**Notes**: —

---

### TC-CAT-LISTADO-007: Cada tarjeta muestra el badge de categoría "Polera"

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Revisar el badge de categoría de las 49 tarjetas (snapshot completo).

**Expected result**: Las 49 tarjetas muestran el badge `"Polera"`. Ninguna muestra `"Tazón"` u
otra categoría.

**Notes**: Ver RN-CAT-005 — posible desalineación con el copy del footer.

---

### TC-CAT-LISTADO-008: Cada tarjeta muestra nombre, descripción y precio

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar la estructura de una tarjeta cualquiera.

**Expected result**: La tarjeta muestra: nombre (heading h3), un párrafo de descripción y un
párrafo de precio, en ese orden.

**Notes**: —

---

### TC-CAT-LISTADO-009: El precio se muestra en formato CLP `"$XX.990"`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Revisar el precio de varias tarjetas (muestreo).

**Expected result**: Todos los precios siguen el patrón `/^\$\d{1,2}\.\d{3}$/` (ej. `$13.990`).
Rango observado: `$11.990`–`$15.990`.

**Notes**: Ver RN-CAT-006.

---

### TC-CAT-LISTADO-010: Cada tarjeta incluye "Ver más" y "Agregar"

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Verificar que cada una de las 49 tarjetas tiene el enlace "Ver más" y el botón "Agregar".

**Expected result**: Los 49 productos tienen ambos controles presentes y habilitados.

**Notes**: —

---

### TC-CAT-LISTADO-011: El primer producto de la grilla es id=1

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el `href` de "Ver más" de la primera tarjeta.

**Expected result**: `href="product.html?id=1"`, nombre "Polera 'I Can Explain It To You'".

**Notes**: —

---

### TC-CAT-LISTADO-012: El último producto (49°) de la grilla es id=49

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el `href` de "Ver más" de la última tarjeta.

**Expected result**: `href="product.html?id=49"`, nombre "Polera 'Quality Assurance Vol. 2'".

**Notes**: —

---

### TC-CAT-LISTADO-013: No se observa ningún producto de categoría "Tazón"

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | PENDING-CODE |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Revisar el badge de categoría de las 49 tarjetas.

**Expected result**: A confirmar con negocio si debería existir la categoría "Tazón" (mencionada
en el footer). Actualmente 0/49 productos la tienen.

**Notes**: Feature/dato potencialmente incompleto, no un bug de comportamiento. Ver RN-CAT-005.

---

### TC-CAT-LISTADO-014: No existen controles de búsqueda, filtro ni paginación

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Buscar cualquier input de búsqueda, control de filtro o paginador.

**Expected result**: No existe ninguno de estos controles; los 49 productos se muestran en una
sola carga.

**Notes**: Confirma hallazgo de arquitectura.

---

### TC-CAT-LISTADO-015: "Ver más" del primer producto navega a `product.html?id=1`

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en "Ver más" de la primera tarjeta.

**Expected result**: La URL cambia a `product.html?id=1` y se renderiza el detalle de ese
producto.

**Notes**: —

---

### TC-CAT-LISTADO-016: "Ver más" del último producto navega a `product.html?id=49`

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en "Ver más" de la última tarjeta.

**Expected result**: La URL cambia a `product.html?id=49` y se renderiza el detalle de ese
producto.

**Notes**: —

---

### TC-CAT-LISTADO-017: El enlace "Ver más" tiene un ícono decorativo y texto accesible

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el accessible name del enlace "Ver más".

**Expected result**: El accessible name es `"Ver más"` (el ícono decorativo no interfiere con el
texto expuesto a lectores de pantalla).

**Notes**: —

---

### TC-CAT-LISTADO-018: Volver desde el detalle regresa al listado con estado intacto

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en "Ver más" de cualquier producto.
3. Usar el botón "atrás" del navegador.

**Expected result**: Se regresa al listado con las 49 tarjetas renderizadas normalmente.

**Notes**: Navegación estándar del navegador, no ejercitada explícitamente en esta sesión (se
verificó la navegación hacia adelante, no el "atrás").

---

### TC-CAT-LISTADO-019: "Agregar" crea una entrada nueva en `unicornt_cart`

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `localStorage['unicornt_cart']` vacío.

**Steps**:
1. Navegar al listado.
2. Click en "Agregar" de un producto (ej. id=1).
3. Inspeccionar `localStorage['unicornt_cart']`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":1}]`.

**Notes**: Verificado en esta sesión. Ver RN-CAT-002.

---

### TC-CAT-LISTADO-020: "Agregar" muestra el toast de confirmación

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en "Agregar" de cualquier producto.
3. Inspeccionar el DOM del toast `#cart-toast`.

**Expected result**: El toast contiene el texto `"¡Producto agregado al carrito!"`.

**Notes**: Verificado vía `eval` sobre el DOM en esta sesión (el toast se auto-oculta rápido).

---

### TC-CAT-LISTADO-021: El toast usa estilo de éxito

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Click en "Agregar" de cualquier producto.
2. Inspeccionar las clases CSS del toast.

**Expected result**: El toast tiene la clase `text-bg-success` y un ícono de check
(`fa-circle-check`).

**Notes**: —

---

### TC-CAT-LISTADO-022: El toast se puede cerrar manualmente

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Click en "Agregar" de cualquier producto.
2. Click en el botón "Cerrar" del toast antes de que se auto-oculte.

**Expected result**: El toast se oculta inmediatamente.

**Notes**: Botón confirmado en el DOM (`data-bs-dismiss="toast"`), interacción de cierre manual
no ejercitada en esta sesión por la velocidad del auto-hide.

---

### TC-CAT-LISTADO-023: El toast se auto-oculta sin interacción

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Click en "Agregar" de cualquier producto.
2. Esperar unos segundos sin interactuar.

**Expected result**: El toast pasa a tener las clases `fade hide` (oculto) automáticamente.

**Notes**: Observado indirectamente: al hacer `eval` del DOM poco después del click, el toast ya
tenía `class="... fade hide"`.

---

### TC-CAT-LISTADO-024: El badge del botón "Carrito" pasa de sin badge a "1"

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al listado (carrito vacío, botón "Carrito" sin badge numérico).
2. Click en "Agregar" de un producto.
3. Inspeccionar el botón "Carrito".

**Expected result**: El botón pasa a mostrar el accessible name `"Carrito 1"` con un badge `"1"`.

**Notes**: —

---

### TC-CAT-LISTADO-025: El badge acumula la cantidad total de ítems, no solo líneas

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al listado.
2. Click en "Agregar" del producto id=1.
3. Click en "Agregar" del producto id=2.
4. Inspeccionar el badge del botón "Carrito".

**Expected result**: El badge muestra `"2"` (una unidad por cada línea agregada), con
`unicornt_cart` = `[{"id":1,"qty":1},{"id":2,"qty":1}]`.

**Notes**: Verificado en esta sesión.

---

### TC-CAT-LISTADO-026: Click repetido en "Agregar" incrementa qty en vez de duplicar la entrada

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Navegar al listado.
2. Click en "Agregar" del producto id=1, dos veces.
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":2}]` — una sola entrada con `qty` en 2.

**Notes**: Ver RN-CAT-003.

---

### TC-CAT-LISTADO-027: [DEFECTO] "Agregar" sobre un ítem ya en el máximo supera el límite de 99

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` = `[{"id":1,"qty":99}]` (setear directamente vía
`localStorage`, no repitiendo 99 clicks).

**Steps**:
1. Navegar al listado con la precondición anterior.
2. Click en "Agregar" de la tarjeta del producto id=1.
3. Inspeccionar `unicornt_cart`.

**Expected result esperado (según límite declarado)**: `qty` debería permanecer en 99.

**Resultado actual (defecto)**: `unicornt_cart` = `[{"id":1,"qty":100}]`.

**Notes**: Ver DEF-001 y RN-CAT-004.

---

### TC-CAT-LISTADO-028: El carrito persiste tras recargar el listado

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Agregar un producto al carrito.
2. Recargar la página (`F5`).
3. Inspeccionar `localStorage['unicornt_cart']` y el badge del botón "Carrito".

**Expected result**: El contenido de `unicornt_cart` y el badge no cambian tras el reload.

**Notes**: Consistente con persistencia 100% client-side en `localStorage`.

---

### TC-CAT-LISTADO-029: El carrito persiste al navegar listado → detalle → listado

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Agregar un producto al carrito desde el listado.
2. Click en "Ver más" de cualquier producto.
3. Click en "Volver".
4. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` no cambia durante la navegación (es multi-página, no SPA,
pero `localStorage` persiste entre cargas).

**Notes**: —

---

### TC-CAT-LISTADO-030: Sin ítems en el carrito, el botón "Carrito" no muestra badge

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío o inexistente.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el botón "Carrito".

**Expected result**: El accessible name es solo `"Carrito"`, sin número de badge.

**Notes**: —

---

### TC-CAT-LISTADO-031: El botón "Carrito" abre el offcanvas del carrito

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Integration |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en el botón "Carrito".

**Expected result**: Se abre un `dialog` (offcanvas de Bootstrap) con el título "Tu carrito".

**Notes**: El contenido detallado del offcanvas (edición de ítems, vaciar, finalizar compra) está
fuera del alcance de CAT — ver submódulo CARR/CARRITO (pendiente de análisis).

---

### TC-CAT-LISTADO-032: El enlace "Inicio" navega a `index.html`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en "Inicio".

**Expected result**: La URL resultante es `index.html` (o se mantiene, si ya se estaba ahí).

**Notes**: —

---

### TC-CAT-LISTADO-033: El enlace "Contacto" navega al ancla `#contacto`

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Click en "Contacto".

**Expected result**: La página hace scroll a la sección de contacto del footer (`#contacto`); no
existe ningún formulario, solo información estática.

**Notes**: Confirma hallazgo de arquitectura — no hay `<form>` de contacto.

---

### TC-CAT-LISTADO-034: El footer muestra la descripción de la tienda

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado y hacer scroll al footer.

**Expected result**: Se muestra "Unicorn't Store" y la descripción "La tienda geek definitiva.
Poleras y tazones con los memes más épicos del universo digital. 🦄".

**Notes**: —

---

### TC-CAT-LISTADO-035: Los enlaces de "Política de privacidad" y "Términos" son placeholders

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado, hacer scroll al footer.
2. Inspeccionar el `href` de "Política de privacidad" y "Términos y condiciones".

**Expected result**: Ambos enlaces tienen `href="#"` — no llevan a ninguna página real.

**Notes**: Feature no implementada, no un bug — documentar como `PENDING-CODE` si se requiere
contenido legal real en el refactor.

---

### TC-CAT-LISTADO-036: El footer muestra dirección, email y teléfono como texto estático

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado, hacer scroll al footer.
2. Inspeccionar los elementos de contacto.

**Expected result**: Se muestran "Av. Internet 404, Santiago", "hola@unicorntstore.cl" y "+56 9
1234 5678" como texto plano (no son enlaces `mailto:`/`tel:`).

**Notes**: —

---

### TC-CAT-LISTADO-037: Los íconos de redes sociales son placeholders

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado, hacer scroll al footer.
2. Inspeccionar el `href` de los enlaces Instagram, TikTok y Twitter/X.

**Expected result**: Los tres enlaces tienen `href="#"`.

**Notes**: —

---

### TC-CAT-LISTADO-038: El footer muestra el aviso de copyright

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado, hacer scroll al final del footer.

**Expected result**: Se muestra `"© 2026 Unicorn't Store. Hecho con [icono] y muchos memes."`.

**Notes**: —

---

### TC-CAT-LISTADO-039: `OBSOLETE-SCENARIO` — No existe ningún formulario de contacto real

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Stage 6 (2026-09-06) — `OBSOLETE-SCENARIO`**: escenario negativo de la era del stub estático.
"Contacto" sigue siendo un ancla `#contacto` al footer (no hay `<form>` de contacto — la
afirmación de `AGENT-NEXT-STEPS` de que "ya existe uno" es incorrecta), pero `index.html` **sí**
contiene ahora un `<form id="checkout-form">` (checkout) y hay páginas `login.html`/`register.html`
con `<form>`. La aserción "no existe ningún `<form>`" ya no tiene sentido. Archivo conservado;
sin automatización. Cobertura real del formulario de contacto (si algún día existe) → sprint de
re-baseline.

**Expected result** _(histórico, ya no válido)_: No existe ningún `<form>`; "Contacto" es solo un
ancla al footer estático.

---

### TC-CAT-LISTADO-040: `OBSOLETE-SCENARIO` — No se observan llamadas de red a `/api`

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Stage 6 (2026-09-06) — `OBSOLETE-SCENARIO`**: premisa invertida. El listado **ahora depende**
de `GET /api/v1/products` + `GET /api/v1/categories` para renderizar. La cobertura positiva
("el listado se carga desde la API") vive en `carrito`/`catalogo` specs de automatización.
Archivo conservado; sin automatización.

**Expected result** _(histórico, ya no válido)_: 0 llamadas XHR/fetch a ningún endpoint `/api/*`.

---

### TC-CAT-LISTADO-041: No existe ningún control de login/registro en el header

| Field | Value |
|-------|-------|
| Priority | P0 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el navbar completo.

**Expected result**: No hay enlace ni botón de "Iniciar sesión", "Registro" ni similar.

**Notes**: Confirma `project.loginPath: null` en `qa-framework.config.json`.
**Stage 6 (2026-09-06)**: la aserción **sigue siendo válida** — el navbar no expone control de
sesión ni siquiera con el usuario autenticado. Pero el refactor **sí** agregó autenticación:
existen `login.html` y `register.html` (accesibles sólo por URL directa). Que no haya enlace en
el navbar es una brecha de UX observada, no filada como defecto en esta iteración.

---

### TC-CAT-LISTADO-042: El botón "Agregar" es accesible por teclado

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Usar Tab hasta enfocar el botón "Agregar" de una tarjeta.
3. Presionar Enter o Espacio.

**Expected result**: El producto se agrega al carrito igual que con click de mouse.

**Notes**: Elemento es un `<button>` nativo (foco/activación por teclado esperables por defecto),
pero la interacción de teclado no se ejecutó explícitamente en esta sesión.

---

### TC-CAT-LISTADO-043: El heading "Nuestros productos" mantiene jerarquía correcta

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Inspeccionar el árbol de headings de la página.

**Expected result**: "Nuestros productos" es h2; los nombres de producto dentro de cada tarjeta
son h3 (jerarquía correcta para lectores de pantalla).

**Notes**: —

---

### TC-CAT-LISTADO-044: La consola no muestra errores críticos de aplicación al cargar

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado con captura de consola habilitada.
2. Revisar los mensajes de error.

**Expected result**: No hay errores de JavaScript de la aplicación. Se documenta como hallazgo
menor no bloqueante: 1 error `404` de `favicon.ico` en cada carga (no específico de CAT).

**Notes**: —

---

### TC-CAT-LISTADO-045: El grid de productos se renderiza en viewport móvil

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Configurar viewport móvil (ej. 375×812).
2. Navegar al listado.

**Expected result**: Las 49 tarjetas se renderizan en una columna (o el layout responsive de
Bootstrap correspondiente), sin overflow horizontal.

**Notes**: Smoke check de responsive, no ejercitado en esta sesión (exploración se hizo en
viewport desktop por defecto).

---

### TC-CAT-LISTADO-046: La cantidad de tarjetas visibles no cambia con el viewport

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Regression |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado en viewport desktop y contar tarjetas.
2. Repetir en viewport móvil.

**Expected result**: Se cuentan 49 tarjetas en ambos casos (sin lazy-load ni paginación
dependiente del viewport).

**Notes**: —

---

### TC-CAT-LISTADO-047: Agregar el mismo producto desde listado y desde detalle acumula correctamente

| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Integration |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` vacío.

**Steps**:
1. Click en "Agregar" del producto id=1 desde el listado (qty pasa a 1).
2. Navegar al detalle de id=1 y agregar 1 unidad más desde "Agregar al carrito".
3. Inspeccionar `unicornt_cart`.

**Expected result**: `unicornt_cart` = `[{"id":1,"qty":2}]` — una sola entrada, cantidad
acumulada entre ambos puntos de entrada.

**Notes**: Cruza con submodule-detalle RN-CAT-011.

---

### TC-CAT-LISTADO-048: El `id` de "Ver más" coincide con el orden de renderizado (1..49)

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Regression |
| Origin | UI-OBSERVED |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Extraer el `href` de "Ver más" de las 49 tarjetas en orden.

**Expected result**: Los `id` son secuenciales de 1 a 49 sin saltos ni repeticiones.

**Notes**: Confirmado por snapshot completo.

---

### TC-CAT-LISTADO-049: El badge vuelve a "sin conteo" tras vaciar el carrito

| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Integration |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: `unicornt_cart` con al menos un ítem.

**Steps**:
1. Con productos en el carrito, abrir el offcanvas y click en "Vaciar carrito" (ver CARR).
2. Inspeccionar el botón "Carrito" en el listado.

**Expected result**: El botón vuelve a mostrar solo `"Carrito"`, sin badge numérico.

**Notes**: Depende del flujo "Vaciar carrito" de CARR, no ejercitado a fondo en esta sesión de
CAT — incluido aquí porque afecta la UI del listado.

---

### TC-CAT-LISTADO-050: Descripciones largas no rompen el layout de la tarjeta

| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Origin | PENDING-BROWSER |
| Automation | No |
| Playwright | — |

**Preconditions**: Ninguna.

**Steps**:
1. Navegar al listado.
2. Ubicar visualmente una tarjeta con descripción larga (ej. "Enigma Blueprint", ~190
   caracteres).

**Expected result**: El texto se ajusta dentro de la tarjeta sin desbordar ni romper el grid.

**Notes**: Verificación visual, no ejecutada con captura de pantalla en esta sesión.

---

## Mandatory coverage checklist

- [x] Access: unauthenticated user redirected to login — N/A, no hay login (TC-041)
- [x] Access: role without permission receives error or empty page — N/A, no hay roles
- [x] Happy path: primary workflow with valid data succeeds — TC-019, TC-020, TC-024
- [ ] Negative: required field missing → validation error shown — N/A, no hay formularios en
      este submódulo
- [x] Negative: duplicate record → system rejects with error message — TC-026 (agregación, no
      duplica), TC-027 (defecto de límite)
- [ ] Negative: invalid format → format error shown — N/A en este submódulo (ver DETALLE para
      validación de `id` y cantidad)
- [x] State transition: state changes correctly on action — TC-019, TC-024, TC-028
- [ ] Export/download: file is generated — N/A, feature inexistente
- [x] Pagination/search: filtering works correctly (if feature exists) — N/A, confirmado
      inexistente (TC-014)
