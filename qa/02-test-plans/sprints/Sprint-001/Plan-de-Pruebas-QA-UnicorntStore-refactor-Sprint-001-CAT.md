# Plan de Pruebas — QA-UnicorntStore-refactor — Sprint 001 — Catálogo

**Proyecto:** QA-UnicorntStore-refactor
**Sprint:** 001
**Módulo:** Catálogo
**Código módulo:** CAT
**Fecha planificación:** 2026-08-26
**Ventana QA:** 2026-08-26 a 2026-08-28
**ADO Test Plan:** N/A — integración con Azure DevOps deshabilitada en este proyecto
(`qa/qa-framework.config.json` → `integrations.azureDevOps.enabled: false`). La columna
**Confirma** de la Tabla de Pruebas es `N/A` en todas las filas; ver Sección 10 para la
trazabilidad sustituta basada en especificaciones y reglas de negocio.

---

## 1. Objetivo

Establecer la línea base de pruebas de regresión del módulo **Catálogo** (submódulos LISTADO y
DETALLE) sobre `https://unicornt-store.keber.cl`, capturando el comportamiento actual del sitio
—incluyendo los defectos ya identificados— para poder validar en sprints futuros que el refactor
de stack (cambio de base tecnológica, ver `qa/qa-framework.config.json` →
`project.description`) no rompe ninguno de estos comportamientos.

Este plan es el primero del proyecto: no hay ejecuciones previas ni una suite de regresión
existente contra la cual comparar — este documento y su ejecución **son** esa línea base.

---

## 2. Alcance

### En alcance

- **CAT/LISTADO** (`index.html#products`): renderizado del catálogo (49 productos), tarjetas de
  producto, navegación "Ver más", botón "Agregar", toast de confirmación, badge del carrito,
  footer y enlaces secundarios.
- **CAT/DETALLE** (`product.html?id={id}`): contenido del producto, selector de cantidad (+/-,
  edición manual, límites), botón "Agregar al carrito", resolución del parámetro `id` (válido e
  inválido), navegación de regreso.
- Los 105 TCs documentados en `qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md`
  (50 TCs) y `qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md` (55
  TCs).
- Verificación de los defectos abiertos `DEF-001` (límite máximo de cantidad no respetado al
  agregar) en sus 3 puntos de entrada dentro de CAT.

### Fuera de alcance

- **CARR/CARRITO** (offcanvas del carrito) — tiene su propio Plan de Pruebas:
  `Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CARR.md`.
- Pruebas de backend/API — la aplicación no tiene backend (confirmado, ver
  `qa/memory/arquitectura-unicornstore-2026-08-26.md`).
- Pruebas de roles/permisos — la aplicación no tiene login ni roles.
- Pruebas de carga/performance y de compatibilidad cross-browser más allá de Chromium (el
  proyecto solo configura Chromium en `qa/07-automation/e2e/playwright.config.ts`).
- Integración con Azure DevOps (deshabilitada por configuración del proyecto).
- Corrección de `DEF-001` — este plan documenta y prueba el comportamiento **actual**, la
  decisión de arreglarlo o no es de negocio/desarrollo.

---

## 3. Items del Sprint (normalizados)

No hay backlog de Azure DevOps para este proyecto (integración deshabilitada), por lo que los
"items del sprint" se normalizan directamente contra los artefactos de Stage 1/2 ya producidos:

| Item | Fuente | TCs |
|---|---|---|
| Analizar y especificar CAT/LISTADO | `qa/01-specifications/module-catalogo/submodule-listado/` | 50 |
| Analizar y especificar CAT/DETALLE | `qa/01-specifications/module-catalogo/submodule-detalle/` | 55 |
| Documentar defecto DEF-001 (límite de cantidad) | `qa/06-defects/open/DEF-001-limite-maximo-cantidad-no-respetado-al-agregar.md` | 3 (ver Sección 10) |

---

## 4. Priorización (P0–P3 summary)

| Prioridad | TCs | % del total |
|---|---|---|
| P0 | 18 | 17% |
| P1 | 37 | 35% |
| P2 | 31 | 30% |
| P3 | 19 | 18% |
| **Total** | **105** | **100%** |

Por etiqueta de título: **17 [SMOKE]** (happy path end-to-end, sin defectos) y **88 [REGRESION]**
(incluye negativos, boundary, accesibilidad y los 3 casos de `DEF-001` — ver regla de asignación
en la Sección 11).

Por `Tipo`: **101 Automatizado**, **4 Bloqueado** (features ausentes del catálogo actual —
categoría "Tazón" y, en el detalle, variantes/reseñas/productos relacionados — ver Sección 8).

---

## 5. TestSuites (agrupación para ADO)

> ADO está deshabilitado en este proyecto; estas suites organizan la ejecución manual/automatizada
> y quedan listas para mapear a ADO Test Suites si la integración se habilita más adelante.

| # | Suite / Área Funcional | TCs | Filas (N) en la tabla |
|---|---|---|---|
| 1 | Listado — Estructura y Contenido del Catálogo | 18 | 1–18 |
| 2 | Navegación entre Listado y Detalle | 11 | 19–29 |
| 3 | Agregar al Carrito y Persistencia (Listado + Detalle) | 20 | 30–49 |
| 4 | Detalle — Contenido del Producto | 7 | 50–56 |
| 5 | Selector de Cantidad y Límites (incl. DEF-001) | 20 | 57–76 |
| 6 | Resolución de `id` en la URL | 10 | 77–86 |
| 7 | Contenido Estático, Footer y Regresión Transversal | 19 | 87–105 |

---

## 6. Precondiciones generales

- Ambiente: `{QA_BASE_URL}` = `https://unicornt-store.keber.cl` (sin credenciales — la
  aplicación no tiene login).
- Navegador: Chromium vía Playwright (`qa/07-automation/e2e/playwright.config.ts`).
- Antes de cada TC: `localStorage['unicornt_cart']` en estado conocido (vacío por defecto, o el
  valor específico que indique la precondición del TC en la spec de origen) — usar la fixture
  `clearCart()` / `localStorage.setItem` directo, no repetir flujos de UI para armar el estado.
- El catálogo es estático (49 productos hardcodeados) — no requiere seed de datos ni base de
  datos.

---

## 7. Datos mínimos sugeridos

| Item | Valor | Uso |
|---|---|---|
| `{QA_BASE_URL}` | `https://unicornt-store.keber.cl` | Todos los TCs |
| Producto id=1 | "Polera 'I Can Explain It To You'" — $13.990 | Boundary inferior, happy path |
| Producto id=49 | "Polera 'Quality Assurance Vol. 2'" — $13.990 | Boundary superior |
| `id` inválidos de referencia | `abc`, `0`, `-1`, `50`, `9999`, `01`, `1.5` | Suite 6 (resolución de `id`) |
| Cantidades de referencia | `0`, `-5`, `` (vacío), `25`, `99`, `150` | Suite 5 (selector de cantidad) |

No se requieren credenciales ni el patrón `EXEC_IDX` — el catálogo no genera datos únicos por
ejecución (ver `qa/01-specifications/module-catalogo/*/04-test-data.md`).

---

## 8. Supuestos & Faltantes críticos

- **`DEF-001` sigue abierto.** Las filas 67, 69 y 76 de la Tabla de Pruebas documentan el
  comportamiento *actual* (defectuoso). Al automatizar (Stage 5), estas 3 deben marcarse con
  `test.fixme()` referenciando `DEF-001`, no como fallos de la suite.
- **4 TCs `Bloqueado`** (filas de categoría "Tazón" y de variantes/reseñas/relacionados en el
  detalle) documentan la *ausencia* de una feature, no un defecto. Queda pendiente confirmar con
  negocio si son omisiones intencionales o brechas de roadmap antes de decidir si alguna vez se
  automatizan más allá de la aserción de ausencia actual.
- **TCs de origen `PENDING-BROWSER`** (accesibilidad por teclado, viewport móvil, doble-click) no
  se ejercitaron manualmente durante la exploración de Stage 1, pero son deterministas y
  automatizables sin dependencias externas — se incluyen en este plan como `Automatizado`. Si al
  automatizarlas alguna falla, es un hallazgo nuevo a documentar (posible defecto adicional), no
  un error de esta especificación.
- **Sin ventana de sprint externa real**: este proyecto no corre bajo un calendario de sprints de
  un equipo (es la sesión inicial de QA sobre un sitio existente) — la "Ventana QA" de la
  cabecera es una fecha de trabajo tentativa, no un compromiso de un Product Owner.

---

## 9. Tabla de Pruebas

| N | TC-ID | Suite / Área Funcional | Título | Descripción | Steps | Resultado Esperado | Confirma | Tipo | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| 1 | TC-CAT-LISTADO-001 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] La página carga con el título correcto en la pestaña | La página carga con el título correcto en la pestaña. | 1) Navegar a `{QA_BASE_URL}/index.html`.<br>2) Verificar que el título de la pestaña del navegador es `"Unicorn't Store"`. | El título de la pestaña del navegador es `"Unicorn't Store"`. | N/A | Automatizado | P2 |
| 2 | TC-CAT-LISTADO-002 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P1] El header muestra logo, navegación y botón Carrito | El header muestra logo, navegación y botón Carrito. | 1) Navegar al listado.<br>2) Inspeccionar el `<banner>`/navbar. | Se muestran el enlace "Unicorn't Store" (logo), los enlaces "Inicio" y "Contacto", y el botón "Carrito". | N/A | Automatizado | P1 |
| 3 | TC-CAT-LISTADO-003 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P3] El skip link enfoca el contenido principal | El skip link enfoca el contenido principal. (Accesibilidad — elemento confirmado en el DOM (`href="#products"`), interacción de teclado no ejecutada en esta sesión.) | 1) Cargar el listado y presionar Tab una vez (foco inicial del documento).<br>2) Activar el enlace "Saltar al contenido principal". | El foco/scroll se mueve al ancla `#products` (inicio de la sección de catálogo). | N/A | Automatizado | P3 |
| 4 | TC-CAT-LISTADO-004 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] La sección de catálogo muestra el heading "Nuestros productos" | La sección de catálogo muestra el heading "Nuestros productos". | 1) Navegar al listado.<br>2) Verificar que existe un `heading` de nivel 2 con el texto "Nuestros productos". | Existe un `heading` de nivel 2 con el texto "Nuestros productos". | N/A | Automatizado | P2 |
| 5 | TC-CAT-LISTADO-005 | Listado — Estructura y Contenido del Catálogo | [SMOKE][P0] El catálogo renderiza exactamente 49 productos | El catálogo renderiza exactamente 49 productos. (Confirmado por snapshot completo de la página en esta sesión.) | 1) Navegar al listado.<br>2) Contar los elementos `<article>` dentro de la lista `aria-label="Catálogo de productos"`. | Se cuentan exactamente 49 artículos. | N/A | Automatizado | P0 |
| 6 | TC-CAT-LISTADO-006 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] Cada tarjeta muestra una imagen con `alt` igual al nombre del producto | Cada tarjeta muestra una imagen con `alt` igual al nombre del producto. | 1) Navegar al listado.<br>2) Inspeccionar el atributo `alt` de la imagen de varias tarjetas (muestreo: primera, última, una intermedia). | El `alt` de la imagen coincide exactamente con el nombre del producto (ej. `"Polera 'I Can Explain It To You'"`). | N/A | Automatizado | P2 |
| 7 | TC-CAT-LISTADO-007 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P1] Cada tarjeta muestra el badge de categoría "Polera" | Cada tarjeta muestra el badge de categoría "Polera". (Ver RN-CAT-005 — posible desalineación con el copy del footer.) | 1) Navegar al listado.<br>2) Revisar el badge de categoría de las 49 tarjetas (snapshot completo). | Las 49 tarjetas muestran el badge `"Polera"`. Ninguna muestra `"Tazón"` u otra categoría. | N/A | Automatizado | P1 |
| 8 | TC-CAT-LISTADO-008 | Listado — Estructura y Contenido del Catálogo | [SMOKE][P0] Cada tarjeta muestra nombre, descripción y precio | Cada tarjeta muestra nombre, descripción y precio. | 1) Navegar al listado.<br>2) Inspeccionar la estructura de una tarjeta cualquiera. | La tarjeta muestra: nombre (heading h3), un párrafo de descripción y un párrafo de precio, en ese orden. | N/A | Automatizado | P0 |
| 9 | TC-CAT-LISTADO-009 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P1] El precio se muestra en formato CLP `"$XX.990"` | El precio se muestra en formato CLP `"$XX.990"`. (Ver RN-CAT-006.) | 1) Navegar al listado.<br>2) Revisar el precio de varias tarjetas (muestreo). | Todos los precios siguen el patrón `/^\$\d{1,2}\.\d{3}$/` (ej. `$13.990`). Rango observado: `$11.990`–`$15.990`. | N/A | Automatizado | P1 |
| 10 | TC-CAT-LISTADO-010 | Listado — Estructura y Contenido del Catálogo | [SMOKE][P0] Cada tarjeta incluye "Ver más" y "Agregar" | Cada tarjeta incluye "Ver más" y "Agregar". | 1) Navegar al listado.<br>2) Verificar que cada una de las 49 tarjetas tiene el enlace "Ver más" y el botón "Agregar". | Los 49 productos tienen ambos controles presentes y habilitados. | N/A | Automatizado | P0 |
| 11 | TC-CAT-LISTADO-011 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] El primer producto de la grilla es id=1 | El primer producto de la grilla es id=1. | 1) Navegar al listado.<br>2) Inspeccionar el `href` de "Ver más" de la primera tarjeta. | `href="product.html?id=1"`, nombre "Polera 'I Can Explain It To You'". | N/A | Automatizado | P2 |
| 12 | TC-CAT-LISTADO-012 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] El último producto (49°) de la grilla es id=49 | El último producto (49°) de la grilla es id=49. | 1) Navegar al listado.<br>2) Inspeccionar el `href` de "Ver más" de la última tarjeta. | `href="product.html?id=49"`, nombre "Polera 'Quality Assurance Vol. 2'". | N/A | Automatizado | P2 |
| 13 | TC-CAT-LISTADO-013 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P3] No se observa ningún producto de categoría "Tazón" | No se observa ningún producto de categoría "Tazón". (Feature/dato potencialmente incompleto, no un bug de comportamiento. Ver RN-CAT-005.) | 1) Navegar al listado.<br>2) Revisar el badge de categoría de las 49 tarjetas. | A confirmar con negocio si debería existir la categoría "Tazón" (mencionada en el footer). Actualmente 0/49 productos la tienen. | N/A | Bloqueado | P3 |
| 14 | TC-CAT-LISTADO-014 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] No existen controles de búsqueda, filtro ni paginación | No existen controles de búsqueda, filtro ni paginación. (Confirma hallazgo de arquitectura.) | 1) Navegar al listado.<br>2) Buscar cualquier input de búsqueda, control de filtro o paginador. | No existe ninguno de estos controles; los 49 productos se muestran en una sola carga. | N/A | Automatizado | P2 |
| 15 | TC-CAT-LISTADO-017 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P3] El enlace "Ver más" tiene un ícono decorativo y texto accesible | El enlace "Ver más" tiene un ícono decorativo y texto accesible. | 1) Navegar al listado.<br>2) Inspeccionar el accessible name del enlace "Ver más". | El accessible name es `"Ver más"` (el ícono decorativo no interfiere con el texto expuesto a lectores de pantalla). | N/A | Automatizado | P3 |
| 16 | TC-CAT-LISTADO-043 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P3] El heading "Nuestros productos" mantiene jerarquía correcta | El heading "Nuestros productos" mantiene jerarquía correcta. | 1) Navegar al listado.<br>2) Inspeccionar el árbol de headings de la página. | "Nuestros productos" es h2; los nombres de producto dentro de cada tarjeta son h3 (jerarquía correcta para lectores de pantalla). | N/A | Automatizado | P3 |
| 17 | TC-CAT-LISTADO-048 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P2] El `id` de "Ver más" coincide con el orden de renderizado (1..49) | El `id` de "Ver más" coincide con el orden de renderizado (1..49). (Confirmado por snapshot completo.) | 1) Navegar al listado.<br>2) Extraer el `href` de "Ver más" de las 49 tarjetas en orden. | Los `id` son secuenciales de 1 a 49 sin saltos ni repeticiones. | N/A | Automatizado | P2 |
| 18 | TC-CAT-LISTADO-050 | Listado — Estructura y Contenido del Catálogo | [REGRESION][P3] Descripciones largas no rompen el layout de la tarjeta | Descripciones largas no rompen el layout de la tarjeta. (Verificación visual, no ejecutada con captura de pantalla en esta sesión.) | 1) Navegar al listado.<br>2) Ubicar visualmente una tarjeta con descripción larga (ej. "Enigma Blueprint", ~190 caracteres). | El texto se ajusta dentro de la tarjeta sin desbordar ni romper el grid. | N/A | Automatizado | P3 |
| 19 | TC-CAT-LISTADO-015 | Navegación entre Listado y Detalle | [SMOKE][P0] "Ver más" del primer producto navega a `product.html?id=1` | "Ver más" del primer producto navega a `product.html?id=1`. | 1) Navegar al listado.<br>2) Click en "Ver más" de la primera tarjeta. | La URL cambia a `product.html?id=1` y se renderiza el detalle de ese producto. | N/A | Automatizado | P0 |
| 20 | TC-CAT-LISTADO-016 | Navegación entre Listado y Detalle | [REGRESION][P1] "Ver más" del último producto navega a `product.html?id=49` | "Ver más" del último producto navega a `product.html?id=49`. | 1) Navegar al listado.<br>2) Click en "Ver más" de la última tarjeta. | La URL cambia a `product.html?id=49` y se renderiza el detalle de ese producto. | N/A | Automatizado | P1 |
| 21 | TC-CAT-LISTADO-018 | Navegación entre Listado y Detalle | [REGRESION][P2] Volver desde el detalle regresa al listado con estado intacto | Volver desde el detalle regresa al listado con estado intacto. (Navegación estándar del navegador, no ejercitada explícitamente en esta sesión (se verificó la navegación hacia adelante, no el "atrás").) | 1) Navegar al listado.<br>2) Click en "Ver más" de cualquier producto.<br>3) Usar el botón "atrás" del navegador. | Se regresa al listado con las 49 tarjetas renderizadas normalmente. | N/A | Automatizado | P2 |
| 22 | TC-CAT-LISTADO-032 | Navegación entre Listado y Detalle | [REGRESION][P2] El enlace "Inicio" navega a `index.html` | El enlace "Inicio" navega a `index.html`. | 1) Navegar al listado.<br>2) Click en "Inicio". | La URL resultante es `index.html` (o se mantiene, si ya se estaba ahí). | N/A | Automatizado | P2 |
| 23 | TC-CAT-LISTADO-033 | Navegación entre Listado y Detalle | [REGRESION][P2] El enlace "Contacto" navega al ancla `#contacto` | El enlace "Contacto" navega al ancla `#contacto`. (Confirma hallazgo de arquitectura — no hay `<form>` de contacto.) | 1) Navegar al listado.<br>2) Click en "Contacto". | La página hace scroll a la sección de contacto del footer (`#contacto`); no existe ningún formulario, solo información estática. | N/A | Automatizado | P2 |
| 24 | TC-CAT-DETALLE-002 | Navegación entre Listado y Detalle | [REGRESION][P1] El breadcrumb muestra "Inicio / {nombre del producto}" | El breadcrumb muestra "Inicio / {nombre del producto}". | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el breadcrumb. | Se muestra `"Inicio / {nombre exacto del producto}"`. | N/A | Automatizado | P1 |
| 25 | TC-CAT-DETALLE-003 | Navegación entre Listado y Detalle | [REGRESION][P1] El breadcrumb "Inicio" navega a `index.html` | El breadcrumb "Inicio" navega a `index.html`. | 1) Navegar al detalle de cualquier producto.<br>2) Click en "Inicio" del breadcrumb. | Navega a `index.html` con las 49 tarjetas del listado. | N/A | Automatizado | P1 |
| 26 | TC-CAT-DETALLE-023 | Navegación entre Listado y Detalle | [REGRESION][P1] "Volver" navega a `index.html` | "Volver" navega a `index.html`. | 1) Navegar al detalle de cualquier producto.<br>2) Click en "Volver". | Navega a `index.html`. | N/A | Automatizado | P1 |
| 27 | TC-CAT-DETALLE-034 | Navegación entre Listado y Detalle | [REGRESION][P2] El header en detalle mantiene los mismos enlaces que en listado | El header en detalle mantiene los mismos enlaces que en listado. | 1) Navegar al detalle de cualquier producto.<br>2) Comparar el navbar con el del listado. | Mismos enlaces: "Inicio", "Contacto", botón "Carrito". | N/A | Automatizado | P2 |
| 28 | TC-CAT-DETALLE-035 | Navegación entre Listado y Detalle | [REGRESION][P2] "Contacto" en detalle navega a `index.html#contacto` | "Contacto" en detalle navega a `index.html#contacto`. (Diferencia esperada por tratarse de una página distinta.) | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el `href` de "Contacto". | `href="index.html#contacto"` (ruta absoluta, a diferencia del listado donde es `#contacto` relativo al propio documento). | N/A | Automatizado | P2 |
| 29 | TC-CAT-DETALLE-046 | Navegación entre Listado y Detalle | [REGRESION][P2] Cambiar el `id` en la URL actualiza el detalle al nuevo producto | Cambiar el `id` en la URL actualiza el detalle al nuevo producto. (Al ser multi-página (no SPA), cada cambio de `id` implica una carga completa nueva.) | 1) Navegar a `product.html?id=1`.<br>2) Navegar a `product.html?id=2` (nueva navegación, no es SPA). | Se renderiza el producto id=2 ("Polera 'Cloud Architect'"). | N/A | Automatizado | P2 |
| 30 | TC-CAT-LISTADO-019 | Agregar al Carrito y Persistencia (Listado + Detalle) | [SMOKE][P0] "Agregar" crea una entrada nueva en `unicornt_cart` | "Agregar" crea una entrada nueva en `unicornt_cart`. (Verificado en esta sesión. Ver RN-CAT-002.) | 1) Navegar al listado.<br>2) Click en "Agregar" de un producto (ej. id=1).<br>3) Inspeccionar `localStorage['unicornt_cart']`. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P0 |
| 31 | TC-CAT-LISTADO-020 | Agregar al Carrito y Persistencia (Listado + Detalle) | [SMOKE][P0] "Agregar" muestra el toast de confirmación | "Agregar" muestra el toast de confirmación. (Verificado vía `eval` sobre el DOM en esta sesión (el toast se auto-oculta rápido).) | 1) Navegar al listado.<br>2) Click en "Agregar" de cualquier producto.<br>3) Inspeccionar el DOM del toast `#cart-toast`. | El toast contiene el texto `"¡Producto agregado al carrito!"`. | N/A | Automatizado | P0 |
| 32 | TC-CAT-LISTADO-021 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P2] El toast usa estilo de éxito | El toast usa estilo de éxito. | 1) Click en "Agregar" de cualquier producto.<br>2) Inspeccionar las clases CSS del toast. | El toast tiene la clase `text-bg-success` y un ícono de check (`fa-circle-check`). | N/A | Automatizado | P2 |
| 33 | TC-CAT-LISTADO-022 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P3] El toast se puede cerrar manualmente | El toast se puede cerrar manualmente. (Botón confirmado en el DOM (`data-bs-dismiss="toast"`), interacción de cierre manual no ejercitada en esta sesión por la velocidad del auto-hide.) | 1) Click en "Agregar" de cualquier producto.<br>2) Click en el botón "Cerrar" del toast antes de que se auto-oculte. | El toast se oculta inmediatamente. | N/A | Automatizado | P3 |
| 34 | TC-CAT-LISTADO-023 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P3] El toast se auto-oculta sin interacción | El toast se auto-oculta sin interacción. (Observado indirectamente: al hacer `eval` del DOM poco después del click, el toast ya tenía `class="... fade hide"`.) | 1) Click en "Agregar" de cualquier producto.<br>2) Esperar unos segundos sin interactuar. | El toast pasa a tener las clases `fade hide` (oculto) automáticamente. | N/A | Automatizado | P3 |
| 35 | TC-CAT-LISTADO-024 | Agregar al Carrito y Persistencia (Listado + Detalle) | [SMOKE][P0] El badge del botón "Carrito" pasa de sin badge a "1" | El badge del botón "Carrito" pasa de sin badge a "1". | 1) Navegar al listado (carrito vacío, botón "Carrito" sin badge numérico).<br>2) Click en "Agregar" de un producto.<br>3) Inspeccionar el botón "Carrito". | El botón pasa a mostrar el accessible name `"Carrito 1"` con un badge `"1"`. | N/A | Automatizado | P0 |
| 36 | TC-CAT-LISTADO-025 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] El badge acumula la cantidad total de ítems, no solo líneas | El badge acumula la cantidad total de ítems, no solo líneas. (Verificado en esta sesión.) | 1) Navegar al listado.<br>2) Click en "Agregar" del producto id=1.<br>3) Click en "Agregar" del producto id=2.<br>4) Inspeccionar el badge del botón "Carrito". | El badge muestra `"2"` (una unidad por cada línea agregada), con `unicornt_cart` = `[{"id":1,"qty":1},{"id":2,"qty":1}]`. | N/A | Automatizado | P1 |
| 37 | TC-CAT-LISTADO-026 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] Click repetido en "Agregar" incrementa qty en vez de duplicar la entrada | Click repetido en "Agregar" incrementa qty en vez de duplicar la entrada. (Ver RN-CAT-003.) | 1) Navegar al listado.<br>2) Click en "Agregar" del producto id=1, dos veces.<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":2}]` — una sola entrada con `qty` en 2. | N/A | Automatizado | P1 |
| 38 | TC-CAT-LISTADO-028 | Agregar al Carrito y Persistencia (Listado + Detalle) | [SMOKE][P0] El carrito persiste tras recargar el listado | El carrito persiste tras recargar el listado. (Consistente con persistencia 100% client-side en `localStorage`.) | 1) Agregar un producto al carrito.<br>2) Recargar la página (`F5`).<br>3) Inspeccionar `localStorage['unicornt_cart']` y el badge del botón "Carrito". | El contenido de `unicornt_cart` y el badge no cambian tras el reload. | N/A | Automatizado | P0 |
| 39 | TC-CAT-LISTADO-029 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] El carrito persiste al navegar listado → detalle → listado | El carrito persiste al navegar listado → detalle → listado. | 1) Agregar un producto al carrito desde el listado.<br>2) Click en "Ver más" de cualquier producto.<br>3) Click en "Volver".<br>4) Inspeccionar `unicornt_cart`. | `unicornt_cart` no cambia durante la navegación (es multi-página, no SPA, pero `localStorage` persiste entre cargas). | N/A | Automatizado | P1 |
| 40 | TC-CAT-LISTADO-030 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] Sin ítems en el carrito, el botón "Carrito" no muestra badge | Sin ítems en el carrito, el botón "Carrito" no muestra badge. | 1) Navegar al listado.<br>2) Inspeccionar el botón "Carrito". | El accessible name es solo `"Carrito"`, sin número de badge. | N/A | Automatizado | P1 |
| 41 | TC-CAT-LISTADO-031 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] El botón "Carrito" abre el offcanvas del carrito | El botón "Carrito" abre el offcanvas del carrito. (El contenido detallado del offcanvas (edición de ítems, vaciar, finalizar compra) está fuera del alcance de CAT — ver submódulo CARR/CARRITO (pendiente de análisis).) | 1) Navegar al listado.<br>2) Click en el botón "Carrito". | Se abre un `dialog` (offcanvas de Bootstrap) con el título "Tu carrito". | N/A | Automatizado | P1 |
| 42 | TC-CAT-LISTADO-047 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] Agregar el mismo producto desde listado y desde detalle acumula correctamente | Agregar el mismo producto desde listado y desde detalle acumula correctamente. (Cruza con submodule-detalle RN-CAT-011.) | 1) Click en "Agregar" del producto id=1 desde el listado (qty pasa a 1).<br>2) Navegar al detalle de id=1 y agregar 1 unidad más desde "Agregar al carrito".<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":2}]` — una sola entrada, cantidad acumulada entre ambos puntos de entrada. | N/A | Automatizado | P1 |
| 43 | TC-CAT-LISTADO-049 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P2] El badge vuelve a "sin conteo" tras vaciar el carrito | El badge vuelve a "sin conteo" tras vaciar el carrito. (Depende del flujo "Vaciar carrito" de CARR, no ejercitado a fondo en esta sesión de CAT — incluido aquí porque afecta la UI del listado.) | 1) Con productos en el carrito, abrir el offcanvas y click en "Vaciar carrito" (ver CARR).<br>2) Inspeccionar el botón "Carrito" en el listado. | El botón vuelve a mostrar solo `"Carrito"`, sin badge numérico. | N/A | Automatizado | P2 |
| 44 | TC-CAT-DETALLE-020 | Agregar al Carrito y Persistencia (Listado + Detalle) | [SMOKE][P0] "Agregar al carrito" crea la entrada en `localStorage` | "Agregar al carrito" crea la entrada en `localStorage`. | 1) Navegar al detalle del producto id=1 (cantidad = 1 por defecto).<br>2) Click en "Agregar al carrito".<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P0 |
| 45 | TC-CAT-DETALLE-021 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] Agregar desde el detalle sobre un producto ya en el carrito acumula la cantidad | Agregar desde el detalle sobre un producto ya en el carrito acumula la cantidad. (Ver RN-CAT-011.) | 1) Navegar al detalle del producto id=1 con la precondición anterior.<br>2) Agregar 1 unidad más ("Agregar al carrito" con cantidad=1).<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":2}]`. | N/A | Automatizado | P1 |
| 46 | TC-CAT-DETALLE-038 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] El toast de confirmación también aparece al agregar desde el detalle, con el nombre del producto interpolado | El toast de confirmación también aparece al agregar desde el detalle, con el nombre del producto interpolado. (Corregido 2026-08-26 en Stage 5 — ver RN-CAT-016.) | 1) Navegar al detalle del producto id=1.<br>2) Click en "Agregar al carrito".<br>3) Inspeccionar el DOM del toast. | El toast contiene `"¡Polera 'I Can Explain It To You' agregado al carrito!"` — mismo componente `#cart-toast` que el listado, mensaje distinto (interpola el nombre del producto, no es el genérico del listado). | N/A | Automatizado | P1 |
| 47 | TC-CAT-DETALLE-039 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] El badge del botón "Carrito" se actualiza al agregar desde el detalle | El badge del botón "Carrito" se actualiza al agregar desde el detalle. | 1) Navegar al detalle de cualquier producto.<br>2) Click en "Agregar al carrito".<br>3) Inspeccionar el botón "Carrito". | El badge pasa a mostrar la cantidad agregada. | N/A | Automatizado | P1 |
| 48 | TC-CAT-DETALLE-040 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] El carrito persiste tras recargar la página de detalle | El carrito persiste tras recargar la página de detalle. | 1) Agregar un producto desde el detalle.<br>2) Recargar la página (`F5`).<br>3) Inspeccionar `unicornt_cart` y el badge. | El carrito no cambia tras el reload. | N/A | Automatizado | P1 |
| 49 | TC-CAT-DETALLE-054 | Agregar al Carrito y Persistencia (Listado + Detalle) | [REGRESION][P1] Agregar productos distintos desde sus detalles crea entradas independientes | Agregar productos distintos desde sus detalles crea entradas independientes. | 1) Navegar al detalle de id=1 y agregar al carrito.<br>2) Navegar al detalle de id=2 y agregar al carrito.<br>3) Inspeccionar `unicornt_cart`. | `unicornt_cart` contiene dos entradas independientes: `{"id":1,"qty":1}` y `{"id":2,"qty":1}`. | N/A | Automatizado | P1 |
| 50 | TC-CAT-DETALLE-001 | Detalle — Contenido del Producto | [SMOKE][P0] Navegar a un `id` válido carga el detalle correcto | Navegar a un `id` válido carga el detalle correcto. | 1) Navegar a `{QA_BASE_URL}/product.html?id=1`.<br>2) Verificar que se renderiza el detalle del producto "Polera 'I Can Explain It To You'"; el título de la pestaña es `"Polera 'I Can Explain It To You' - Unicorn't Store"`. | Se renderiza el detalle del producto "Polera 'I Can Explain It To You'"; el título de la pestaña es `"Polera 'I Can Explain It To You' - Unicorn't Store"`. | N/A | Automatizado | P0 |
| 51 | TC-CAT-DETALLE-004 | Detalle — Contenido del Producto | [REGRESION][P2] La imagen del producto tiene `alt` correcto | La imagen del producto tiene `alt` correcto. | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el `alt` de la imagen. | El `alt` coincide exactamente con el nombre del producto. | N/A | Automatizado | P2 |
| 52 | TC-CAT-DETALLE-005 | Detalle — Contenido del Producto | [REGRESION][P2] El nombre del producto se muestra como heading h1 | El nombre del producto se muestra como heading h1. | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el nivel del heading del nombre. | Es un `heading` de nivel 1 (jerarquía correcta para una página de detalle). | N/A | Automatizado | P2 |
| 53 | TC-CAT-DETALLE-006 | Detalle — Contenido del Producto | [REGRESION][P1] El precio se muestra en formato `"$XX.990"` | El precio se muestra en formato `"$XX.990"`. | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el precio. | El precio sigue el patrón `/^\$\d{1,2}\.\d{3}$/`. | N/A | Automatizado | P1 |
| 54 | TC-CAT-DETALLE-007 | Detalle — Contenido del Producto | [REGRESION][P2] La descripción completa del producto se muestra | La descripción completa del producto se muestra. | 1) Navegar al detalle de cualquier producto.<br>2) Verificar que se muestra un párrafo con la descripción completa del producto. | Se muestra un párrafo con la descripción completa del producto. | N/A | Automatizado | P2 |
| 55 | TC-CAT-DETALLE-048 | Detalle — Contenido del Producto | [REGRESION][P1] Precio y nombre coinciden entre listado y detalle para el mismo `id` | Precio y nombre coinciden entre listado y detalle para el mismo `id`. | 1) Anotar nombre y precio del producto id=1 en el listado.<br>2) Navegar al detalle de id=1.<br>3) Comparar. | Nombre y precio son idénticos en ambas vistas. | N/A | Automatizado | P1 |
| 56 | TC-CAT-DETALLE-049 | Detalle — Contenido del Producto | [REGRESION][P2] Descripción coincide entre listado y detalle para el mismo `id` | Descripción coincide entre listado y detalle para el mismo `id`. | 1) Anotar la descripción del producto id=1 en el listado.<br>2) Navegar al detalle de id=1.<br>3) Comparar. | La descripción es idéntica en ambas vistas. | N/A | Automatizado | P2 |
| 57 | TC-CAT-DETALLE-008 | Selector de Cantidad y Límites (incl. DEF-001) | [SMOKE][P0] El selector de cantidad inicia en 1 | El selector de cantidad inicia en 1. | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el valor del input de cantidad. | El valor inicial es `1`. | N/A | Automatizado | P0 |
| 58 | TC-CAT-DETALLE-009 | Selector de Cantidad y Límites (incl. DEF-001) | [SMOKE][P0] "Aumentar cantidad" incrementa el valor en 1 | "Aumentar cantidad" incrementa el valor en 1. | 1) Navegar al detalle de cualquier producto.<br>2) Click en "Aumentar cantidad". | El input pasa de `1` a `2`. | N/A | Automatizado | P0 |
| 59 | TC-CAT-DETALLE-010 | Selector de Cantidad y Límites (incl. DEF-001) | [SMOKE][P0] "Reducir cantidad" decrementa el valor en 1 | "Reducir cantidad" decrementa el valor en 1. | 1) Navegar al detalle de cualquier producto.<br>2) Click en "Aumentar cantidad" (queda en 2).<br>3) Click en "Reducir cantidad". | El input vuelve a `1`. | N/A | Automatizado | P0 |
| 60 | TC-CAT-DETALLE-011 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] "Reducir cantidad" no decrementa por debajo de 1 | "Reducir cantidad" no decrementa por debajo de 1. (Ver RN-CAT-008.) | 1) Navegar al detalle de cualquier producto (cantidad = 1).<br>2) Click en "Reducir cantidad". | El input permanece en `1`. El botón no se deshabilita visualmente, pero el click no tiene efecto. | N/A | Automatizado | P1 |
| 61 | TC-CAT-DETALLE-012 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] "Aumentar cantidad" no incrementa por sobre 99 | "Aumentar cantidad" no incrementa por sobre 99. (Ver RN-CAT-008. Verificado en esta sesión con `fill("99")` + click en "+".) | 1) Navegar al detalle de cualquier producto.<br>2) Editar el input a `99` (o llegar ahí con clicks).<br>3) Click en "Aumentar cantidad". | El input permanece en `99`. | N/A | Automatizado | P1 |
| 62 | TC-CAT-DETALLE-013 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] El input de cantidad expone `min="1"` y `max="99"` | El input de cantidad expone `min="1"` y `max="99"`. (Estos atributos no bloquean por sí solos la edición manual fuera de rango — ver TC-015 a TC-018.) | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar los atributos HTML del input `#qty-input`. | `type="number"`, `min="1"`, `max="99"`. | N/A | Automatizado | P2 |
| 63 | TC-CAT-DETALLE-014 | Selector de Cantidad y Límites (incl. DEF-001) | [SMOKE][P0] Editar la cantidad a un valor válido y agregar refleja esa cantidad | Editar la cantidad a un valor válido y agregar refleja esa cantidad. | 1) Navegar al detalle del producto id=1.<br>2) Editar el input de cantidad a `25`.<br>3) Click en "Agregar al carrito".<br>4) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":25}]`. | N/A | Automatizado | P0 |
| 64 | TC-CAT-DETALLE-015 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] Cantidad `0` al agregar se sanea a 1 | Cantidad `0` al agregar se sanea a 1. (Ver RN-CAT-009. Verificado en esta sesión.) | 1) Navegar al detalle del producto id=1.<br>2) Editar el input de cantidad directamente a `0`.<br>3) Click en "Agregar al carrito".<br>4) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":1}]` (no se agrega `qty:0`). | N/A | Automatizado | P1 |
| 65 | TC-CAT-DETALLE-016 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] Cantidad negativa al agregar se sanea a 1 | Cantidad negativa al agregar se sanea a 1. (Ver RN-CAT-009. Verificado en esta sesión.) | 1) Navegar al detalle del producto id=1.<br>2) Editar el input de cantidad directamente a `-5`.<br>3) Click en "Agregar al carrito".<br>4) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P1 |
| 66 | TC-CAT-DETALLE-017 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] Cantidad vacía al agregar se sanea a 1 | Cantidad vacía al agregar se sanea a 1. (Ver RN-CAT-009. Verificado en esta sesión.) | 1) Navegar al detalle del producto id=1.<br>2) Vaciar completamente el input de cantidad.<br>3) Click en "Agregar al carrito".<br>4) Inspeccionar `unicornt_cart`. | `unicornt_cart` = `[{"id":1,"qty":1}]`. | N/A | Automatizado | P1 |
| 67 | TC-CAT-DETALLE-018 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] Cantidad > 99 al agregar no se clampea | Cantidad > 99 al agregar no se clampea. (Ver DEF-001 y RN-CAT-010.) | 1) Navegar al detalle del producto id=1.<br>2) Editar el input de cantidad directamente a `150`.<br>3) Click en "Agregar al carrito".<br>4) Inspeccionar `unicornt_cart`. | Esperado: `qty` debería clampearse a `99`. \| Actual (defecto): `unicornt_cart` = `[{"id":1,"qty":150}]`. | N/A | Automatizado | P1 |
| 68 | TC-CAT-DETALLE-019 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] El input de cantidad no acepta letras vía tipeo directo | El input de cantidad no acepta letras vía tipeo directo. (Verificado: el intento de `fill("abc")` fue rechazado por Playwright con el error "Cannot type text into input[type=number]".) | 1) Navegar al detalle de cualquier producto.<br>2) Intentar tipear `"abc"` en el input de cantidad. | El navegador bloquea la entrada de caracteres no numéricos (comportamiento nativo de `input[type=number]`); el valor no cambia. | N/A | Automatizado | P2 |
| 69 | TC-CAT-DETALLE-022 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] Agregar desde el detalle que excede 99 no se clampea | Agregar desde el detalle que excede 99 no se clampea. (Ver DEF-001 y RN-CAT-012.) | 1) Navegar al detalle del producto id=1 con la precondición anterior.<br>2) Agregar 1 unidad más.<br>3) Inspeccionar `unicornt_cart`. | Esperado: `qty` debería permanecer en 99. \| Actual (defecto): `unicornt_cart` = `[{"id":1,"qty":100}]`. | N/A | Automatizado | P1 |
| 70 | TC-CAT-DETALLE-041 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] "Aumentar cantidad" es accesible por teclado | "Aumentar cantidad" es accesible por teclado. (No ejercitado explícitamente en esta sesión.) | 1) Navegar al detalle de cualquier producto.<br>2) Tab hasta enfocar "Aumentar cantidad".<br>3) Presionar Enter o Espacio. | El valor de cantidad se incrementa igual que con click. | N/A | Automatizado | P2 |
| 71 | TC-CAT-DETALLE-042 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] El spinbutton de cantidad tiene `aria-label="Cantidad"` | El spinbutton de cantidad tiene `aria-label="Cantidad"`. | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el `aria-label` del input de cantidad. | `aria-label="Cantidad"`. | N/A | Automatizado | P2 |
| 72 | TC-CAT-DETALLE-043 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] Los botones +/- tienen `aria-label` descriptivo | Los botones +/- tienen `aria-label` descriptivo. | 1) Navegar al detalle de cualquier producto.<br>2) Inspeccionar el `aria-label` de ambos botones. | `"Reducir cantidad"` y `"Aumentar cantidad"` respectivamente. | N/A | Automatizado | P2 |
| 73 | TC-CAT-DETALLE-044 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] Recargar la página reinicia la cantidad seleccionada a 1 | Recargar la página reinicia la cantidad seleccionada a 1. | 1) Navegar al detalle de cualquier producto.<br>2) Incrementar la cantidad a un valor > 1 (sin agregar al carrito).<br>3) Recargar la página. | El input de cantidad vuelve a `1` — el selector de cantidad no persiste, solo el carrito (`unicornt_cart`) persiste. | N/A | Automatizado | P2 |
| 74 | TC-CAT-DETALLE-045 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P3] Doble click rápido en "Aumentar cantidad" incrementa exactamente 2 | Doble click rápido en "Aumentar cantidad" incrementa exactamente 2. (No ejercitado explícitamente en esta sesión.) | 1) Navegar al detalle de cualquier producto.<br>2) Hacer doble click rápido en "Aumentar cantidad". | El input queda en `3` (1 inicial + 2), sin condiciones de carrera que resulten en un valor distinto. | N/A | Automatizado | P3 |
| 75 | TC-CAT-DETALLE-055 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P2] El botón "Agregar al carrito" es accesible por teclado | El botón "Agregar al carrito" es accesible por teclado. (No ejercitado explícitamente en esta sesión.) | 1) Navegar al detalle de cualquier producto.<br>2) Tab hasta enfocar "Agregar al carrito".<br>3) Presionar Enter o Espacio. | El producto se agrega al carrito igual que con click de mouse. | N/A | Automatizado | P2 |
| 76 | TC-CAT-LISTADO-027 | Selector de Cantidad y Límites (incl. DEF-001) | [REGRESION][P1] "Agregar" sobre un ítem ya en el máximo supera el límite de 99 | "Agregar" sobre un ítem ya en el máximo supera el límite de 99. (Ver DEF-001 y RN-CAT-004.) | 1) Navegar al listado con la precondición anterior.<br>2) Click en "Agregar" de la tarjeta del producto id=1.<br>3) Inspeccionar `unicornt_cart`. | Esperado: `qty` debería permanecer en 99. \| Actual (defecto): `unicornt_cart` = `[{"id":1,"qty":100}]`. | N/A | Automatizado | P1 |
| 77 | TC-CAT-DETALLE-024 | Resolución de `id` en la URL | [REGRESION][P0] `id` fuera de rango redirige silenciosamente al listado | `id` fuera de rango redirige silenciosamente al listado. (Ver RN-CAT-007.) | 1) Navegar a `product.html?id=9999`.<br>2) Verificar que redirige a `index.html`, sin mensaje de error. | Redirige a `index.html`, sin mensaje de error. | N/A | Automatizado | P0 |
| 78 | TC-CAT-DETALLE-025 | Resolución de `id` en la URL | [REGRESION][P1] `id` no numérico redirige silenciosamente al listado | `id` no numérico redirige silenciosamente al listado. | 1) Navegar a `product.html?id=abc`.<br>2) Verificar que redirige a `index.html`. | Redirige a `index.html`. | N/A | Automatizado | P1 |
| 79 | TC-CAT-DETALLE-026 | Resolución de `id` en la URL | [REGRESION][P1] `id` ausente redirige silenciosamente al listado | `id` ausente redirige silenciosamente al listado. | 1) Navegar a `product.html` (sin query string).<br>2) Verificar que redirige a `index.html`. | Redirige a `index.html`. | N/A | Automatizado | P1 |
| 80 | TC-CAT-DETALLE-027 | Resolución de `id` en la URL | [REGRESION][P1] `id=0` redirige silenciosamente al listado | `id=0` redirige silenciosamente al listado. | 1) Navegar a `product.html?id=0`.<br>2) Verificar que redirige a `index.html`. | Redirige a `index.html`. | N/A | Automatizado | P1 |
| 81 | TC-CAT-DETALLE-028 | Resolución de `id` en la URL | [REGRESION][P1] `id` negativo redirige silenciosamente al listado | `id` negativo redirige silenciosamente al listado. | 1) Navegar a `product.html?id=-1`.<br>2) Verificar que redirige a `index.html`. | Redirige a `index.html`. | N/A | Automatizado | P1 |
| 82 | TC-CAT-DETALLE-029 | Resolución de `id` en la URL | [REGRESION][P1] `id=50` (uno por sobre el último válido) redirige silenciosamente | `id=50` (uno por sobre el último válido) redirige silenciosamente. (Boundary test — confirma que el catálogo tiene exactamente 49 productos.) | 1) Navegar a `product.html?id=50`.<br>2) Verificar que redirige a `index.html`. | Redirige a `index.html`. | N/A | Automatizado | P1 |
| 83 | TC-CAT-DETALLE-030 | Resolución de `id` en la URL | [REGRESION][P2] `id="01"` (cero a la izquierda) resuelve al producto 1 | `id="01"` (cero a la izquierda) resuelve al producto 1. (Ver RN-CAT-007. No es un bug — documenta el comportamiento real de parsing.) | 1) Navegar a `product.html?id=01`.<br>2) Verificar que se renderiza el producto id=1 (comparación no estricta). | Se renderiza el producto id=1 (comparación no estricta). | N/A | Automatizado | P2 |
| 84 | TC-CAT-DETALLE-031 | Resolución de `id` en la URL | [REGRESION][P2] `id="1.5"` (decimal) resuelve al producto 1 | `id="1.5"` (decimal) resuelve al producto 1. (Ver RN-CAT-007.) | 1) Navegar a `product.html?id=1.5`.<br>2) Verificar que se renderiza el producto id=1 (truncamiento/`parseInt`). | Se renderiza el producto id=1 (truncamiento/`parseInt`). | N/A | Automatizado | P2 |
| 85 | TC-CAT-DETALLE-032 | Resolución de `id` en la URL | [REGRESION][P1] `id=1` (primer producto válido) renderiza correctamente | `id=1` (primer producto válido) renderiza correctamente. (Boundary inferior.) | 1) Navegar a `product.html?id=1`.<br>2) Verificar que se renderiza "Polera 'I Can Explain It To You'" ($13.990). | Se renderiza "Polera 'I Can Explain It To You'" ($13.990). | N/A | Automatizado | P1 |
| 86 | TC-CAT-DETALLE-033 | Resolución de `id` en la URL | [REGRESION][P1] `id=49` (último producto válido) renderiza correctamente | `id=49` (último producto válido) renderiza correctamente. (Boundary superior.) | 1) Navegar a `product.html?id=49`.<br>2) Verificar que se renderiza "Polera 'Quality Assurance Vol. 2'" ($13.990). | Se renderiza "Polera 'Quality Assurance Vol. 2'" ($13.990). | N/A | Automatizado | P1 |
| 87 | TC-CAT-LISTADO-034 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] El footer muestra la descripción de la tienda | El footer muestra la descripción de la tienda. | 1) Navegar al listado y hacer scroll al footer.<br>2) Verificar que se muestra "Unicorn't Store" y la descripción "La tienda geek definitiva. Poleras y tazones con los memes más épicos del universo digital. 🦄". | Se muestra "Unicorn't Store" y la descripción "La tienda geek definitiva. Poleras y tazones con los memes más épicos del universo digital. 🦄". | N/A | Automatizado | P3 |
| 88 | TC-CAT-LISTADO-035 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P2] Los enlaces de "Política de privacidad" y "Términos" son placeholders | Los enlaces de "Política de privacidad" y "Términos" son placeholders. (Feature no implementada, no un bug — documentar como `PENDING-CODE` si se requiere contenido legal real en el refactor.) | 1) Navegar al listado, hacer scroll al footer.<br>2) Inspeccionar el `href` de "Política de privacidad" y "Términos y condiciones". | Ambos enlaces tienen `href="#"` — no llevan a ninguna página real. | N/A | Automatizado | P2 |
| 89 | TC-CAT-LISTADO-036 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] El footer muestra dirección, email y teléfono como texto estático | El footer muestra dirección, email y teléfono como texto estático. | 1) Navegar al listado, hacer scroll al footer.<br>2) Inspeccionar los elementos de contacto. | Se muestran "Av. Internet 404, Santiago", "hola@unicorntstore.cl" y "+56 9 1234 5678" como texto plano (no son enlaces `mailto:`/`tel:`). | N/A | Automatizado | P3 |
| 90 | TC-CAT-LISTADO-037 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] Los íconos de redes sociales son placeholders | Los íconos de redes sociales son placeholders. | 1) Navegar al listado, hacer scroll al footer.<br>2) Inspeccionar el `href` de los enlaces Instagram, TikTok y Twitter/X. | Los tres enlaces tienen `href="#"`. | N/A | Automatizado | P3 |
| 91 | TC-CAT-LISTADO-038 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] El footer muestra el aviso de copyright | El footer muestra el aviso de copyright. | 1) Navegar al listado, hacer scroll al final del footer.<br>2) Verificar que se muestra `"© 2026 Unicorn't Store. Hecho con [icono] y muchos memes."`. | Se muestra `"© 2026 Unicorn't Store. Hecho con [icono] y muchos memes."`. | N/A | Automatizado | P3 |
| 92 | TC-CAT-LISTADO-039 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P2] No existe ningún formulario de contacto real | No existe ningún formulario de contacto real. (Confirma hallazgo de arquitectura.) | 1) Navegar al listado.<br>2) Buscar cualquier elemento `<form>` en la página. | No existe ningún `<form>`; "Contacto" es solo un ancla al footer estático. | N/A | Automatizado | P2 |
| 93 | TC-CAT-LISTADO-040 | Contenido Estático, Footer y Regresión Transversal | [SMOKE][P0] No se observan llamadas de red a `/api` | No se observan llamadas de red a `/api`. (Verificado con `requests` de `playwright-cli` en esta sesión.) | 1) Navegar al listado con captura de network habilitada.<br>2) Revisar todas las requests no estáticas. | 0 llamadas XHR/fetch a ningún endpoint `/api/*`. Solo recursos estáticos (HTML, CSS, JS, imágenes, CDN). | N/A | Automatizado | P0 |
| 94 | TC-CAT-LISTADO-041 | Contenido Estático, Footer y Regresión Transversal | [SMOKE][P0] No existe ningún control de login/registro en el header | No existe ningún control de login/registro en el header. (Confirma `project.loginPath: null` en `qa-framework.config.json`.) | 1) Navegar al listado.<br>2) Inspeccionar el navbar completo. | No hay enlace ni botón de "Iniciar sesión", "Registro" ni similar. | N/A | Automatizado | P0 |
| 95 | TC-CAT-LISTADO-042 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P2] El botón "Agregar" es accesible por teclado | El botón "Agregar" es accesible por teclado. (Elemento es un `<button>` nativo (foco/activación por teclado esperables por defecto), pero la interacción de teclado no se ejecutó explícitamente en esta sesión.) | 1) Navegar al listado.<br>2) Usar Tab hasta enfocar el botón "Agregar" de una tarjeta.<br>3) Presionar Enter o Espacio. | El producto se agrega al carrito igual que con click de mouse. | N/A | Automatizado | P2 |
| 96 | TC-CAT-LISTADO-044 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P1] La consola no muestra errores críticos de aplicación al cargar | La consola no muestra errores críticos de aplicación al cargar. | 1) Navegar al listado con captura de consola habilitada.<br>2) Revisar los mensajes de error. | No hay errores de JavaScript de la aplicación. Se documenta como hallazgo menor no bloqueante: 1 error `404` de `favicon.ico` en cada carga (no específico de CAT). | N/A | Automatizado | P1 |
| 97 | TC-CAT-LISTADO-045 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] El grid de productos se renderiza en viewport móvil | El grid de productos se renderiza en viewport móvil. (Smoke check de responsive, no ejercitado en esta sesión (exploración se hizo en viewport desktop por defecto).) | 1) Configurar viewport móvil (ej. 375×812).<br>2) Navegar al listado. | Las 49 tarjetas se renderizan en una columna (o el layout responsive de Bootstrap correspondiente), sin overflow horizontal. | N/A | Automatizado | P3 |
| 98 | TC-CAT-LISTADO-046 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] La cantidad de tarjetas visibles no cambia con el viewport | La cantidad de tarjetas visibles no cambia con el viewport. | 1) Navegar al listado en viewport desktop y contar tarjetas.<br>2) Repetir en viewport móvil. | Se cuentan 49 tarjetas en ambos casos (sin lazy-load ni paginación dependiente del viewport). | N/A | Automatizado | P3 |
| 99 | TC-CAT-DETALLE-036 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] El footer en detalle es idéntico al del listado | El footer en detalle es idéntico al del listado. | 1) Navegar al detalle de cualquier producto y hacer scroll al footer.<br>2) Comparar con el footer del listado. | Mismo contenido (descripción, links rápidos, contacto, redes sociales, copyright). | N/A | Automatizado | P3 |
| 100 | TC-CAT-DETALLE-037 | Contenido Estático, Footer y Regresión Transversal | [SMOKE][P0] No se observan llamadas de red a `/api` al cargar el detalle | No se observan llamadas de red a `/api` al cargar el detalle. | 1) Navegar al detalle de cualquier producto con captura de network habilitada.<br>2) Revisar todas las requests no estáticas. | 0 llamadas XHR/fetch a `/api/*`. | N/A | Automatizado | P0 |
| 101 | TC-CAT-DETALLE-047 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] El detalle en viewport móvil mantiene los controles operables | El detalle en viewport móvil mantiene los controles operables. (No ejercitado en esta sesión (exploración en viewport desktop).) | 1) Configurar viewport móvil (ej. 375×812).<br>2) Navegar al detalle de cualquier producto. | Imagen, selector de cantidad y botón "Agregar al carrito" son visibles y operables sin overflow horizontal. | N/A | Automatizado | P3 |
| 102 | TC-CAT-DETALLE-050 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] No existe selector de talla/color/variante | No existe selector de talla/color/variante. (Confirma que el catálogo actual no maneja variantes; relevante si el refactor las introduce.) | 1) Navegar al detalle de cualquier producto.<br>2) Buscar cualquier control de selección de variante. | No existe ningún selector de talla, color u otra variante — el producto es de opción única. | N/A | Bloqueado | P3 |
| 103 | TC-CAT-DETALLE-051 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] No existe sección de reseñas/calificaciones | No existe sección de reseñas/calificaciones. | 1) Navegar al detalle de cualquier producto.<br>2) Verificar que no existe ninguna sección de reseñas ni calificación por estrellas. | No existe ninguna sección de reseñas ni calificación por estrellas. | N/A | Bloqueado | P3 |
| 104 | TC-CAT-DETALLE-052 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P3] No existe sección de "productos relacionados" | No existe sección de "productos relacionados". | 1) Navegar al detalle de cualquier producto.<br>2) Verificar que no existe ninguna sección de "productos relacionados" o "también te puede interesar". | No existe ninguna sección de "productos relacionados" o "también te puede interesar". | N/A | Bloqueado | P3 |
| 105 | TC-CAT-DETALLE-053 | Contenido Estático, Footer y Regresión Transversal | [REGRESION][P1] La consola no muestra errores críticos de aplicación al cargar el detalle | La consola no muestra errores críticos de aplicación al cargar el detalle. | 1) Navegar al detalle de cualquier producto con captura de consola habilitada.<br>2) Verificar que no hay errores de JavaScript de la aplicación (el `404` de `favicon.ico` es un hallazgo menor no bloqueante, común a todo el sitio). | No hay errores de JavaScript de la aplicación (el `404` de `favicon.ico` es un hallazgo menor no bloqueante, común a todo el sitio). | N/A | Automatizado | P1 |

---

## 10. Matriz de Trazabilidad

> Sin ADO — se sustituye por trazabilidad contra el submódulo de origen y contra los defectos
> abiertos (ver Sección 2 de la plantilla de referencia, "Multi-Module Sprint" /
> "si no hay tareas ADO").

### Por submódulo de origen

| Submódulo (spec de origen) | Filas (N) en la tabla | TCs |
|---|---|---|
| `submodule-listado/05-test-scenarios.md` | 1–23, 30–43, 76, 87–98 | 50 |
| `submodule-detalle/05-test-scenarios.md` | 24–29, 44–75, 77–86, 99–105 | 55 |

### Por defecto abierto

| Defecto | Filas (N) en la tabla | TCs relacionados |
|---|---|---|
| `DEF-001` | 67, 69, 76 | TC-CAT-DETALLE-018, TC-CAT-DETALLE-022, TC-CAT-LISTADO-027 |

---

## 11. Notas de automatización

- **Regla de etiqueta de título**: `[SMOKE]` se asignó a los TCs `Type=Functional/Integration` con
  `Priority=P0` (happy path central). Todo TC de `Type=Negative` se etiquetó `[REGRESION]`
  independientemente de su prioridad — el propósito completo de este proyecto es capturar
  comportamiento actual (incluyendo negativos y defectos) como línea base de regresión para el
  refactor, así que `[REGRESION]` es la etiqueta correcta para la gran mayoría de los TCs, no un
  reflejo de baja importancia.
- **Regla de `Tipo`**: `Bloqueado` solo para TCs con `Origin=PENDING-CODE` en la spec de origen
  (feature ausente del entorno actual). Todo lo demás es `Automatizado` — la aplicación es 100%
  front-end, determinista y sin dependencias externas (sin backend, sin login), por lo que no hay
  candidatos genuinos a `Manual` o `Ambos` en este módulo.
- **Orden de automatización sugerido (Stage 5)**: Suite 1 y 3 primero (P0 concentrado — estructura
  del catálogo y flujo de agregar al carrito), luego Suite 5 y 6 (selector de cantidad y
  resolución de `id`, incluye los 3 TCs de `DEF-001`), y por último Suite 2, 4 y 7.
- Los pasos de "Steps" que en la spec original (`05-test-scenarios.md`) tenían un solo paso
  (acción con resultado implícito) se expandieron aquí a 2 pasos (acción + verificación
  explícita) para cumplir el gate de la Sección "Quality gates" de `qa-test-plan` — sin cambiar el
  comportamiento verificado, solo separando acción de verificación.

---

## Changelog

| Versión | Fecha | Descripción |
|---------|------|-------------|
| 1.0 | 2026-08-26 | Creación inicial (Stage 3), a partir de las specs de Stage 1/2 de CAT/LISTADO y CAT/DETALLE |
