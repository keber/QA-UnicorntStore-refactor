/**
 * @module CAT
 * @submodule DETALLE
 * @spec qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md
 * @priority P0
 *
 * P0 only (Stage 5, first automation pass). P1-P3 follow in a later pass; see the Plan de
 * Pruebas for the full TC list and suite grouping. DEF-001 (max qty not clamped on
 * "Agregar") is tracked separately by P1 tests, not exercised here.
 */
import { test, expect } from '../../fixtures/pom/test-options';

test.describe('catálogo — detalle de producto', () => {
  test.beforeEach(async ({ productDetailPage, clearCart }) => {
    await productDetailPage.goto(1);
    await clearCart();
  });

  test.afterEach(async ({ clearCart }) => {
    await clearCart();
  });

  test(
    '[TC-CAT-DETALLE-001] Navegar a un id válido carga el detalle correcto',
    { tag: '@P0' },
    async ({ productDetailPage, page }) => {
      await expect(productDetailPage.heading).toHaveText("Polera 'I Can Explain It To You'");
      await expect(page).toHaveTitle("Polera 'I Can Explain It To You' - Unicorn't Store");
    }
  );

  test(
    '[TC-CAT-DETALLE-008] El selector de cantidad inicia en 1',
    { tag: '@P0' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.qtyInput).toHaveValue('1');
    }
  );

  test(
    '[TC-CAT-DETALLE-009] "Aumentar cantidad" incrementa el valor en 1',
    { tag: '@P0' },
    async ({ productDetailPage }) => {
      await productDetailPage.increaseButton.click();
      await expect(productDetailPage.qtyInput).toHaveValue('2');
    }
  );

  test(
    '[TC-CAT-DETALLE-010] "Reducir cantidad" decrementa el valor en 1',
    { tag: '@P0' },
    async ({ productDetailPage }) => {
      await productDetailPage.increaseButton.click();
      await productDetailPage.decreaseButton.click();
      await expect(productDetailPage.qtyInput).toHaveValue('1');
    }
  );

  test(
    '[TC-CAT-DETALLE-014] Editar la cantidad a un valor válido y agregar refleja esa cantidad',
    { tag: '@P0' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.qtyInput.fill('25');
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 25 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-020] "Agregar al carrito" crea la entrada en localStorage',
    { tag: '@P0' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-024] id fuera de rango redirige silenciosamente al listado',
    { tag: '@P0' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.goto(9999);
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-037] No se observan llamadas de red a /api al cargar el detalle',
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
});
