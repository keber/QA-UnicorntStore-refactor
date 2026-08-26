/**
 * @module CAT
 * @submodule LISTADO
 * @spec qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md
 * @priority P0
 *
 * P0 only (Stage 5, first automation pass). P1-P3 follow in a later pass; see the Plan de
 * Pruebas for the full TC list and suite grouping.
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
});
