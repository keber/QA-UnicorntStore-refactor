/**
 * @module CAT
 * @submodule LISTADO
 * @spec qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md
 * @priority P0-P3
 *
 * Re-baselined for the refactored app (Stage 6 "green first", 2026-09-06 — see
 * `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`). The catalog is
 * now loaded async from `GET /api/v1/products` and the default view renders the
 * API's first page only: **20 of 49** products. A `#category-filter` <select>
 * re-queries the API by category slug.
 *
 * - TC-CAT-LISTADO-040 ("no /api calls") — REMOVED, OBSOLETE-SCENARIO (the page now
 *   depends on the API). Tracked in COVERAGE-MAPPING.md.
 * - TC-CAT-LISTADO-039 ("no contact <form>") — REMOVED, OBSOLETE-SCENARIO.
 * - TC-CAT-LISTADO-014 — inverted: a category filter now exists.
 * - TC-CAT-LISTADO-027 stays `test.fail()` for DEF-001 (keber/unicornt-store-frontend#19).
 */
import { test, expect } from '../../fixtures/pom/test-options';
import { CatalogPage } from '../../page-objects/CatalogPage';

const PAGE_SIZE = CatalogPage.DEFAULT_PAGE_SIZE; // 20

test.describe('catálogo — listado de productos', () => {
  test.beforeEach(async ({ catalogPage, clearCart }) => {
    await catalogPage.goto();
    await clearCart();
  });

  test.afterEach(async ({ clearCart }) => {
    await clearCart();
  });

  test(
    '[TC-CAT-LISTADO-005] El catálogo renderiza la primera página (20 de 49 productos)',
    { tag: '@P0' },
    async ({ catalogPage }) => {
      await expect(catalogPage.productCards).toHaveCount(PAGE_SIZE);
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
      await expect(page.getByRole('link', { name: 'Ver más' })).toHaveCount(PAGE_SIZE);
      await expect(page.getByRole('button', { name: 'Agregar' })).toHaveCount(PAGE_SIZE);
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
      await catalogPage.awaitLoaded();
      await expect(catalogPage.cartBadge).toHaveText('1');
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-041] No existe ningún control de login/registro en el header',
    { tag: '@P1' },
    async ({ page }) => {
      // The refactor added login.html / register.html, but they are reachable by direct URL
      // only — the navbar still exposes no session control (even when authenticated).
      const loginPattern = /iniciar sesi[oó]n|log ?in|registr(o|arse)|sign ?in/i;
      await expect(page.getByRole('banner').getByRole('link', { name: loginPattern })).toHaveCount(
        0
      );
      await expect(
        page.getByRole('banner').getByRole('button', { name: loginPattern })
      ).toHaveCount(0);
    }
  );

  // ==================== P1-P3 ====================

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
      for (const index of [0, 10, PAGE_SIZE - 1]) {
        const card = catalogPage.cardAt(index);
        const name = (await card.getByRole('heading', { level: 3 }).textContent()) ?? '';
        await expect(card.getByRole('img')).toHaveAttribute('alt', name.trim());
      }
    }
  );

  test(
    '[TC-CAT-LISTADO-007] Cada tarjeta muestra un badge con el nombre de su categoría',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      // Post-refactor the badge shows the product's real `categoryName` (10 categories), not the
      // old fixed "Polera". Scope to `.badge` — no ARIA role of its own.
      // eslint-disable-next-line playwright/no-raw-locators
      const badges = catalogPage.productCards.locator('.badge');
      await expect(badges).toHaveCount(PAGE_SIZE);
      const known = ['PM', 'Cloud', 'DevOps', 'Enigma', 'General', 'IT Crowd', 'Linux'];
      for (const text of await badges.allInnerTexts()) {
        expect(known).toContain(text.trim());
      }
      await expect(page.getByText('Tazón')).toHaveCount(0);
    }
  );

  test(
    '[TC-CAT-LISTADO-009] El precio se muestra en formato CLP "$XX.990"',
    { tag: '@P1' },
    async ({ catalogPage }) => {
      for (const index of [0, 10, PAGE_SIZE - 1]) {
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
    '[TC-CAT-LISTADO-012] Filtrar por categoría "QA" muestra sus 2 productos (ids 48 y 49)',
    { tag: '@P2' },
    async ({ catalogPage }) => {
      await catalogPage.filterByCategory('qa');
      await expect(catalogPage.productCards).toHaveCount(2);
      await expect(catalogPage.cardAt(0).getByRole('link', { name: 'Ver más' })).toHaveAttribute(
        'href',
        'product.html?id=48'
      );
      await expect(catalogPage.cardAt(1).getByRole('link', { name: 'Ver más' })).toHaveAttribute(
        'href',
        'product.html?id=49'
      );
      await expect(catalogPage.cardAt(1).getByRole('heading', { level: 3 })).toHaveText(
        "Polera 'Quality Assurance Vol. 2'"
      );
    }
  );

  test(
    '[TC-CAT-LISTADO-014] Existe un filtro por categoría (re-consulta la API); no hay buscador ni paginación',
    { tag: '@P2' },
    async ({ catalogPage, page }) => {
      // Inverted from the pre-refactor "no filters at all". The category <select> is the only
      // catalog control; there is still no free-text search box and no pagination nav.
      await expect(catalogPage.categoryFilter).toBeVisible();
      await expect(page.getByRole('searchbox')).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: /pagina/i })).toHaveCount(0);
      // it actually filters: "devops" has 6 seeded products; clearing restores the first page.
      await catalogPage.filterByCategory('devops');
      await expect(catalogPage.productCards).toHaveCount(6);
      await catalogPage.filterByCategory('');
      await expect(catalogPage.productCards).toHaveCount(PAGE_SIZE);
    }
  );

  test(
    '[TC-CAT-LISTADO-016] "Ver más" del último producto (id=49, vía filtro QA) enlaza a product.html?id=49',
    { tag: '@P1' },
    async ({ catalogPage }) => {
      await catalogPage.filterByCategory('qa');
      // Only the href is asserted here: navigating to the detail of id 49 currently redirects to
      // index.html (DEF-007). That the detail itself renders is TC-CAT-DETALLE-033 (test.fail).
      await expect(catalogPage.cardAt(1).getByRole('link', { name: 'Ver más' })).toHaveAttribute(
        'href',
        'product.html?id=49'
      );
    }
  );

  test(
    '[TC-CAT-LISTADO-017] El enlace "Ver más" tiene un ícono decorativo y texto accesible',
    { tag: '@P3' },
    async ({ catalogPage }) => {
      const link = catalogPage.cardAt(0).getByRole('link', { name: 'Ver más' });
      await expect(link).toBeVisible();
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
      await catalogPage.awaitLoaded();
      await expect(catalogPage.productCards).toHaveCount(PAGE_SIZE);
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

  test.fail(
    '[TC-CAT-LISTADO-027] "Agregar" sobre un ítem ya en el máximo supera el límite de 99 (DEF-001)',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      await page.evaluate(() =>
        localStorage.setItem('unicornt_cart', JSON.stringify([{ id: 1, qty: 99 }]))
      );
      await page.reload({ waitUntil: 'domcontentloaded' });
      await catalogPage.awaitLoaded();
      await catalogPage.addToCart(catalogPage.cardAt(0));
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      // Expected (RN-CAT-004): qty stays 99. Actual (DEF-001, keber/unicornt-store-frontend#19):
      // qty goes to 100. `test.fail()` — flip to `test()` when the issue is fixed.
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
      await catalogPage.awaitLoaded();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-LISTADO-030] Sin ítems en el carrito, el botón "Carrito" no muestra badge',
    { tag: '@P1' },
    async ({ catalogPage }) => {
      await expect(catalogPage.cartBadge).toBeHidden();
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
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(PAGE_SIZE);
    }
  );

  test(
    '[TC-CAT-LISTADO-044] La consola no muestra errores críticos de aplicación al cargar',
    { tag: '@P1' },
    async ({ catalogPage, page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) errors.push(msg.text());
      });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await catalogPage.awaitLoaded();
      expect(errors).toEqual([]);
    }
  );

  test(
    '[TC-CAT-LISTADO-045] El grid de productos se renderiza en viewport móvil',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await catalogPage.awaitLoaded();
      await expect(catalogPage.productCards).toHaveCount(PAGE_SIZE);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(376);
    }
  );

  test(
    '[TC-CAT-LISTADO-046] La cantidad de tarjetas visibles no cambia con el viewport',
    { tag: '@P3' },
    async ({ catalogPage, page }) => {
      await expect(catalogPage.productCards).toHaveCount(PAGE_SIZE);
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(catalogPage.productCards).toHaveCount(PAGE_SIZE);
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
    '[TC-CAT-LISTADO-048] El id de "Ver más" coincide con el orden de renderizado (1..20)',
    { tag: '@P2' },
    async ({ page }) => {
      const hrefs = await page
        .getByRole('link', { name: 'Ver más' })
        .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      const ids = hrefs.map((href) => Number(new URLSearchParams(href?.split('?')[1]).get('id')));
      expect(ids).toEqual(Array.from({ length: PAGE_SIZE }, (_, i) => i + 1));
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
      const card = catalogPage.cardAt(8); // id=9, "Enigma Blueprint" - long description
      await expect(card.getByRole('heading', { level: 3 })).toHaveText("Polera 'Enigma Blueprint'");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const viewportWidth = page.viewportSize()?.width ?? 0;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
    }
  );
});
