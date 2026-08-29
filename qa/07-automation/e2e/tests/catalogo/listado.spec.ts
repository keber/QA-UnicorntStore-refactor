/**
 * @module CAT
 * @submodule LISTADO
 * @spec qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md
 * @priority P0-P3
 *
 * P0 (Stage 5 first pass) + P1-P3 (Stage 5 second pass, 2026-08-26). TC-CAT-LISTADO-013
 * (categoría "Tazón") stays out of scope - `Tipo=Bloqueado` in the Plan de Pruebas (feature
 * absent from the current catalog, pending business confirmation). TC-CAT-LISTADO-027 is
 * `test.fixme()`-tagged for DEF-001 (max qty not clamped on "Agregar").
 *
 * TC-CAT-LISTADO-039 is `test.fixme()`-tagged as OBSOLETE after the frontend refactor
 * (backend-integration prep): a real <form> (contact) now exists, so the "no contact form"
 * assertion no longer holds. Behavior still in flux; Stage 6 (qa-maintenance) will update specs
 * + memory and replace it with positive form coverage. Tracking: qa/AGENT-NEXT-STEPS.md ->
 * "Mantenimiento pendiente (refactor frontend)".
 */
import { test, expect } from '../../fixtures/pom/test-options';

test.describe('catálogo — listado de productos', () => {
  test.beforeEach(async ({ page, clearCart }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await clearCart();
  });

  test.afterEach(async ({ clearCart }) => {
    await clearCart();
  });

  test(
    '[TC-CAT-LISTADO-005] El catálogo renderiza exactamente 49 productos',
    { tag: '@P0' },
    async ({ catalogPage }) => {
      await expect(catalogPage.productCards).toHaveCount(49);
    }
  );

  test(
    '[TC-CAT-LISTADO-008] Cada tarjeta muestra nombre, descripción y precio',
    { tag: '@P0' },
    async ({ catalogPage }) => {
      const card = catalogPage.cardAt(0);
      await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
      // No `^`/`$` anchors: Playwright's regex text matching tests the raw (non-trimmed) text
      // content of candidate nodes, and this price <p> has surrounding whitespace/newlines.
      await expect(card.getByText(/\$\d{1,2}\.\d{3}/)).toBeVisible();
      // name + description + price = at least 2 <p> elements besides the heading; no semantic
      // role distinguishes the description paragraph from the price paragraph.
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(card.locator('p')).toHaveCount(2);
    }
  );

  test(
    '[TC-CAT-LISTADO-010] Cada tarjeta incluye "Ver más" y "Agregar"',
    { tag: '@P0' },
    async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Ver más' })).toHaveCount(49);
      await expect(page.getByRole('button', { name: 'Agregar' })).toHaveCount(49);
    }
  );

  test(
    '[TC-CAT-LISTADO-015] "Ver más" del primer producto navega a product.html?id=1',
    { tag: '@P0' },
    async ({ catalogPage, page }) => {
      await catalogPage.cardAt(0).getByRole('link', { name: 'Ver más' }).click();
      await expect(page).toHaveURL(/product\.html\?id=1$/);
    }
  );

  test(
    '[TC-CAT-LISTADO-019] "Agregar" crea una entrada nueva en unicornt_cart',
    { tag: '@P0' },
    async ({ catalogPage, page }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-020] "Agregar" muestra el toast de confirmación',
    { tag: '@P0' },
    async ({ catalogPage }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await expect(catalogPage.addedToCartToast).toBeVisible();
    }
  );

  test(
    '[TC-CAT-LISTADO-024] El badge del botón "Carrito" pasa de sin badge a "1"',
    { tag: '@P0' },
    async ({ catalogPage }) => {
      await expect(catalogPage.cartBadge).toBeHidden();
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await expect(catalogPage.cartBadge).toHaveText('1');
    }
  );

  test(
    '[TC-CAT-LISTADO-028] El carrito persiste tras recargar el listado',
    { tag: '@P0' },
    async ({ catalogPage, page }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(catalogPage.cartBadge).toHaveText('1');
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-040] No se observan llamadas de red a /api',
    { tag: '@P0' },
    async ({ page }) => {
      const apiRequests: string[] = [];
      page.on('request', (req) => {
        if (req.url().includes('/api/')) apiRequests.push(req.url());
      });
      await page.reload({ waitUntil: 'networkidle' });
      expect(apiRequests).toHaveLength(0);
    }
  );

  test(
    '[TC-CAT-LISTADO-041] No existe ningún control de login/registro en el header',
    { tag: '@P0' },
    async ({ page }) => {
      const loginPattern = /iniciar sesi[oó]n|log ?in|registr(o|arse)/i;
      await expect(page.getByRole('link', { name: loginPattern })).toHaveCount(0);
      await expect(page.getByRole('button', { name: loginPattern })).toHaveCount(0);
    }
  );

  // ==================== P1-P3 (Stage 5, second pass) ====================

  test(
    '[TC-CAT-LISTADO-001] La página carga con el título correcto en la pestaña',
    { tag: '@P2' },
    async ({ page }) => {
      await expect(page).toHaveTitle("Unicorn't Store");
    }
  );

  test(
    '[TC-CAT-LISTADO-002] El header muestra logo, navegación y botón Carrito',
    { tag: '@P1' },
    async ({ catalogPage }) => {
      await expect(catalogPage.logoLink).toBeVisible();
      await expect(catalogPage.homeNavLink).toBeVisible();
      await expect(catalogPage.contactNavLink).toBeVisible();
      await expect(catalogPage.cartButton).toBeVisible();
    }
  );

  test(
    '[TC-CAT-LISTADO-003] El skip link enfoca el contenido principal',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      // `.visually-hidden-focusable` keeps the link off-screen until it receives keyboard
      // focus - a plain .click() fails Playwright's "element in viewport" actionability check.
      await catalogPage.skipLink.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#products$/);
      await expect(catalogPage.heading).toBeInViewport();
    }
  );

  test(
    '[TC-CAT-LISTADO-004] La sección de catálogo muestra el heading "Nuestros productos"',
    { tag: '@P2' },
    async ({ page }) => {
      await expect(
        page.getByRole('heading', { level: 2, name: 'Nuestros productos' })
      ).toBeVisible();
    }
  );

  test(
    '[TC-CAT-LISTADO-006] Cada tarjeta muestra una imagen con alt igual al nombre del producto',
    { tag: '@P2' },
    async ({ catalogPage }) => {
      // Sample: first, last, and one middle card - not all 49, per the Plan de Pruebas sampling note.
      for (const index of [0, 24, 48]) {
        const card = catalogPage.cardAt(index);
        const name = (await card.getByRole('heading', { level: 3 }).textContent()) ?? '';
        await expect(card.getByRole('img')).toHaveAttribute('alt', name.trim());
      }
    }
  );

  test(
    '[TC-CAT-LISTADO-007] Cada tarjeta muestra el badge de categoría "Polera"',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      // The category badge (`<span class="badge">`) has no ARIA role of its own; scoping to
      // `.badge` avoids matching the substring "Polera" inside each card's own <h3> name.
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(catalogPage.productCards.locator('.badge')).toHaveText(Array(49).fill('Polera'));
      await expect(page.getByText('Tazón')).toHaveCount(0);
    }
  );

  test(
    '[TC-CAT-LISTADO-009] El precio se muestra en formato CLP "$XX.990"',
    { tag: '@P1' },
    async ({ catalogPage }) => {
      for (const index of [0, 24, 48]) {
        await expect(catalogPage.cardAt(index).getByText(/\$\d{1,2}\.\d{3}/)).toBeVisible();
      }
    }
  );

  test(
    '[TC-CAT-LISTADO-011] El primer producto de la grilla es id=1',
    { tag: '@P2' },
    async ({ catalogPage }) => {
      const card = catalogPage.cardAt(0);
      await expect(card.getByRole('link', { name: 'Ver más' })).toHaveAttribute(
        'href',
        'product.html?id=1'
      );
      await expect(card.getByRole('heading', { level: 3 })).toHaveText(
        "Polera 'I Can Explain It To You'"
      );
    }
  );

  test(
    '[TC-CAT-LISTADO-012] El último producto (49°) de la grilla es id=49',
    { tag: '@P2' },
    async ({ catalogPage }) => {
      const card = catalogPage.cardAt(48);
      await expect(card.getByRole('link', { name: 'Ver más' })).toHaveAttribute(
        'href',
        'product.html?id=49'
      );
      await expect(card.getByRole('heading', { level: 3 })).toHaveText(
        "Polera 'Quality Assurance Vol. 2'"
      );
    }
  );

  test(
    '[TC-CAT-LISTADO-014] No existen controles de búsqueda, filtro ni paginación',
    { tag: '@P2' },
    async ({ page }) => {
      await expect(page.getByRole('searchbox')).toHaveCount(0);
      await expect(page.getByRole('combobox')).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: /pagina/i })).toHaveCount(0);
    }
  );

  test(
    '[TC-CAT-LISTADO-016] "Ver más" del último producto navega a product.html?id=49',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      await catalogPage.cardAt(48).getByRole('link', { name: 'Ver más' }).click();
      await expect(page).toHaveURL(/product\.html\?id=49$/);
    }
  );

  test(
    '[TC-CAT-LISTADO-017] El enlace "Ver más" tiene un ícono decorativo y texto accesible',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      const link = catalogPage.cardAt(0).getByRole('link', { name: 'Ver más' });
      await expect(link).toBeVisible();
      // The icon is a Font Awesome `::before` pseudo-element, not a DOM text node - textContent
      // reflects only the real text. (Chromium's accessible-name computation for {name: ...,
      // exact: true} does pick up the icon's generated glyph, so that variant is avoided here.)
      await expect(link).toHaveText('Ver más');
    }
  );

  test(
    '[TC-CAT-LISTADO-018] Volver desde el detalle regresa al listado con estado intacto',
    { tag: '@P2' },
    async ({ catalogPage, page }) => {
      await catalogPage.cardAt(0).getByRole('link', { name: 'Ver más' }).click();
      await expect(page).toHaveURL(/product\.html\?id=1$/);
      await page.goBack();
      await expect(catalogPage.productCards).toHaveCount(49);
    }
  );

  test(
    '[TC-CAT-LISTADO-021] El toast usa estilo de éxito',
    { tag: '@P2' },
    async ({ catalogPage }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await expect(catalogPage.toast).toHaveClass(/text-bg-success/);
      // `.fa-circle-check` is a decorative icon with no ARIA role - existence check only.
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(catalogPage.toast.locator('.fa-circle-check')).toHaveCount(1);
    }
  );

  test(
    '[TC-CAT-LISTADO-022] El toast se puede cerrar manualmente',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await catalogPage.toastCloseButton.click();
      await expect(catalogPage.toast).toBeHidden();
    }
  );

  test(
    '[TC-CAT-LISTADO-023] El toast se auto-oculta sin interacción',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      // showCartToast() uses a 2500ms Bootstrap autohide delay (assets/js/cart.js).
      await expect(catalogPage.toast).toBeHidden({ timeout: 6000 });
    }
  );

  test(
    '[TC-CAT-LISTADO-025] El badge acumula la cantidad total de ítems, no solo líneas',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await catalogPage.addToCart(catalogPage.cardAt(1));
      await expect(catalogPage.cartBadge).toHaveText('2');
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([
        { id: 1, qty: 1 },
        { id: 2, qty: 1 },
      ]);
    }
  );

  test(
    '[TC-CAT-LISTADO-026] Click repetido en "Agregar" incrementa qty en vez de duplicar la entrada',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      const card = catalogPage.cardAt(0);
      await catalogPage.addToCart(card);
      await catalogPage.addToCart(card);
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 2 }]);
    }
  );

  test.fixme(
    '[TC-CAT-LISTADO-027] "Agregar" sobre un ítem ya en el máximo supera el límite de 99 (DEF-001)',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      await page.evaluate(() =>
        localStorage.setItem('unicornt_cart', JSON.stringify([{ id: 1, qty: 99 }]))
      );
      await page.reload({ waitUntil: 'domcontentloaded' });
      await catalogPage.addToCart(catalogPage.cardAt(0));
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      // Expected (per RN-CAT-004): qty debería permanecer en 99.
      // Actual (DEF-001): qty sube a 100 - el flujo "Agregar" no clampea el máximo.
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 99 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-029] El carrito persiste al navegar listado → detalle → listado',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await catalogPage.cardAt(0).getByRole('link', { name: 'Ver más' }).click();
      await page.getByRole('link', { name: 'Volver' }).click();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-030] Sin ítems en el carrito, el botón "Carrito" no muestra badge',
    { tag: '@P1' },
    async ({ catalogPage }) => {
      await expect(catalogPage.cartBadge).toBeHidden();
      // The exact accessible name has a leading-space quirk from the icon's generated glyph
      // (Chromium accname, same as TC-CAT-LISTADO-017) - the meaningful assertion here is that
      // no badge count digit leaks into it, not the exact surrounding whitespace.
      await expect(catalogPage.cartButton).not.toHaveAccessibleName(/\d/);
    }
  );

  test(
    '[TC-CAT-LISTADO-031] El botón "Carrito" abre el offcanvas del carrito',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      await catalogPage.cartButton.click();
      await expect(page.getByRole('dialog', { name: 'Tu carrito' })).toBeVisible();
    }
  );

  test(
    '[TC-CAT-LISTADO-032] El enlace "Inicio" navega a index.html',
    { tag: '@P2' },
    async ({ catalogPage, page }) => {
      await catalogPage.homeNavLink.click();
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-LISTADO-033] El enlace "Contacto" navega al ancla #contacto',
    { tag: '@P2' },
    async ({ catalogPage, page }) => {
      await catalogPage.contactNavLink.click();
      await expect(page).toHaveURL(/#contacto$/);
    }
  );

  test(
    '[TC-CAT-LISTADO-034] El footer muestra la descripción de la tienda',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      // The footer also has "Unicorn't Store" in its copyright line (TC-CAT-LISTADO-038) -
      // scope to the brand heading to keep this a single-element match.
      await expect(
        catalogPage.footer.getByRole('heading', { name: "Unicorn't Store" })
      ).toBeVisible();
      await expect(
        catalogPage.footer.getByText(
          'La tienda geek definitiva. Poleras y tazones con los memes más épicos'
        )
      ).toBeVisible();
    }
  );

  test(
    '[TC-CAT-LISTADO-035] Los enlaces de "Política de privacidad" y "Términos" son placeholders',
    { tag: '@P2' },
    async ({ catalogPage }) => {
      await expect(
        catalogPage.footer.getByRole('link', { name: 'Política de privacidad' })
      ).toHaveAttribute('href', '#');
      await expect(
        catalogPage.footer.getByRole('link', { name: 'Términos y condiciones' })
      ).toHaveAttribute('href', '#');
    }
  );

  test(
    '[TC-CAT-LISTADO-036] El footer muestra dirección, email y teléfono como texto estático',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      await expect(catalogPage.footer.getByText('Av. Internet 404, Santiago')).toBeVisible();
      await expect(catalogPage.footer.getByText('hola@unicorntstore.cl')).toBeVisible();
      await expect(catalogPage.footer.getByText('+56 9 1234 5678')).toBeVisible();
      // Confirms they're plain text, not mailto:/tel: links - absence check, not an interaction target.
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
    }
  );

  test(
    '[TC-CAT-LISTADO-037] Los íconos de redes sociales son placeholders',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      for (const name of ['Instagram', 'TikTok', 'Twitter/X']) {
        await expect(catalogPage.footer.getByRole('link', { name })).toHaveAttribute('href', '#');
      }
    }
  );

  test(
    '[TC-CAT-LISTADO-038] El footer muestra el aviso de copyright',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      await expect(
        catalogPage.footer.getByText(/© 2026 Unicorn't Store\. Hecho con/)
      ).toBeVisible();
    }
  );

  // [OBSOLETO - refactor frontend, aún en flujo] El refactor agregó un <form> real (contacto /
  // prep de integración con backend). Este TC aseguraba su ausencia y ya no aplica; en Stage 6
  // (qa-maintenance) se reemplaza por cobertura positiva del formulario. Ver el bloque de
  // cabecera del archivo y qa/AGENT-NEXT-STEPS.md -> "Mantenimiento pendiente (refactor frontend)".
  test.fixme(
    '[TC-CAT-LISTADO-039] No existe ningún formulario de contacto real',
    { tag: '@P2' },
    async ({ page }) => {
      // A bare, unlabeled <form> has no distinguishing ARIA role - existence check only.
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(page.locator('form')).toHaveCount(0);
    }
  );

  test(
    '[TC-CAT-LISTADO-042] El botón "Agregar" es accesible por teclado',
    { tag: '@P2' },
    async ({ catalogPage, page }) => {
      const button = catalogPage.cardAt(0).getByRole('button', { name: 'Agregar' });
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(catalogPage.toast).toBeVisible();
    }
  );

  test(
    '[TC-CAT-LISTADO-043] El heading "Nuestros productos" mantiene jerarquía correcta',
    { tag: '@P3' },
    async ({ page }) => {
      await expect(
        page.getByRole('heading', { level: 2, name: 'Nuestros productos' })
      ).toBeVisible();
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(49);
    }
  );

  test(
    '[TC-CAT-LISTADO-044] La consola no muestra errores críticos de aplicación al cargar',
    { tag: '@P1' },
    async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        // favicon.ico 404 is a known, non-blocking finding common to the whole site.
        if (msg.type() === 'error' && !msg.text().includes('favicon')) errors.push(msg.text());
      });
      await page.reload({ waitUntil: 'networkidle' });
      expect(errors).toEqual([]);
    }
  );

  test(
    '[TC-CAT-LISTADO-045] El grid de productos se renderiza en viewport móvil',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(catalogPage.productCards).toHaveCount(49);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(376);
    }
  );

  test(
    '[TC-CAT-LISTADO-046] La cantidad de tarjetas visibles no cambia con el viewport',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      await expect(catalogPage.productCards).toHaveCount(49);
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(catalogPage.productCards).toHaveCount(49);
    }
  );

  test(
    '[TC-CAT-LISTADO-047] Agregar el mismo producto desde listado y desde detalle acumula correctamente',
    { tag: '@P1' },
    async ({ catalogPage, productDetailPage, page }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await productDetailPage.goto(1);
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 2 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-048] El id de "Ver más" coincide con el orden de renderizado (1..49)',
    { tag: '@P2' },
    async ({ page }) => {
      const hrefs = await page
        .getByRole('link', { name: 'Ver más' })
        .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      const ids = hrefs.map((href) => Number(new URLSearchParams(href?.split('?')[1]).get('id')));
      expect(ids).toEqual(Array.from({ length: 49 }, (_, i) => i + 1));
    }
  );

  test(
    '[TC-CAT-LISTADO-049] El badge vuelve a "sin conteo" tras vaciar el carrito',
    { tag: '@P2' },
    async ({ catalogPage, cartPage }) => {
      await catalogPage.addToCart(catalogPage.cardAt(0));
      await expect(catalogPage.cartBadge).toHaveText('1');
      await cartPage.open();
      await cartPage.clearButton.click();
      await expect(catalogPage.cartBadge).toBeHidden();
    }
  );

  test(
    '[TC-CAT-LISTADO-050] Descripciones largas no rompen el layout de la tarjeta',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      const card = catalogPage.cardAt(8); // id=9, "Enigma Blueprint" - longest description in the catalog
      await expect(card.getByRole('heading', { level: 3 })).toHaveText("Polera 'Enigma Blueprint'");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const viewportWidth = page.viewportSize()?.width ?? 0;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
    }
  );
});
