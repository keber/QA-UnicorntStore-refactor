/**
 * @module CARR
 * @submodule CARRITO
 * @spec qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CARR.md
 * @priority P0
 *
 * P0 only (Stage 5, first automation pass). P1-P3 follow in a later pass; see the Plan de
 * Pruebas for the full TC list and suite grouping. DEF-002 (orphaned cart entry leaves the
 * UI inconsistent) is tracked separately by P2 tests, not exercised here.
 *
 * Cart state is seeded directly via `cartPage.setCart()` + reload rather than through the
 * "Agregar" flow on the catalog pages, to keep these tests independent of DEF-001.
 */
import { test, expect } from '../../fixtures/pom/test-options';

test.describe('carrito de compras (offcanvas)', () => {
  test.beforeEach(async ({ page, clearCart }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await clearCart();
  });

  test.afterEach(async ({ clearCart }) => {
    await clearCart();
  });

  test(
    '[TC-CARR-CARRITO-001] El botón "Carrito" abre el offcanvas',
    { tag: '@P0' },
    async ({ cartPage }) => {
      await cartPage.open();
      await expect(cartPage.dialog).toBeVisible();
    }
  );

  test(
    '[TC-CARR-CARRITO-003] El botón "Cerrar" (X) cierra el offcanvas',
    { tag: '@P0' },
    async ({ cartPage }) => {
      await cartPage.open();
      await cartPage.close();
      await expect(cartPage.dialog).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-006] Con carrito vacío se muestra el mensaje de "carrito vacío"',
    { tag: '@P0' },
    async ({ cartPage }) => {
      await cartPage.open();
      await expect(cartPage.emptyMessage).toBeVisible();
    }
  );

  test(
    '[TC-CARR-CARRITO-007] Con carrito vacío el footer (Total + acciones) está oculto',
    { tag: '@P0' },
    async ({ cartPage }) => {
      await cartPage.open();
      await expect(cartPage.footer).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-008] Una línea de producto muestra imagen, nombre y precio unitario',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 2 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      const row = cartPage.itemRow(1);
      await expect(row.getByRole('img')).toBeVisible();
      await expect(row.getByText("Polera 'I Can Explain It To You'")).toBeVisible();
      await expect(row.getByText('$13.990 c/u')).toBeVisible();
    }
  );

  test(
    '[TC-CARR-CARRITO-009] La línea muestra el subtotal = precio unitario × cantidad',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 2 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$27.980');
    }
  );

  test(
    '[TC-CARR-CARRITO-010] El total es la suma de los subtotales de todas las líneas',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.total).toHaveText('$42.970');
    }
  );

  test(
    '[TC-CARR-CARRITO-012] El botón "+" incrementa la cantidad en 1',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.increaseButton(1).click();
      await expect(cartPage.qtyInput(1)).toHaveValue('2');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 2 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-013] El botón "−" decrementa la cantidad en 1 (qty > 1)',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 2 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.decreaseButton(1).click();
      await expect(cartPage.qtyInput(1)).toHaveValue('1');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-021] "Eliminar" quita la línea completa',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.removeButton(2).click();
      await expect(cartPage.itemRow(2)).toHaveCount(0);
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 2 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-023] "Vaciar carrito" elimina todas las líneas',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 2 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.clearButton.click();
      await expect(cartPage.emptyMessage).toBeVisible();
      expect(await cartPage.getCart()).toEqual([]);
    }
  );

  test(
    '[TC-CARR-CARRITO-027] "Finalizar compra" vacía el carrito',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.checkoutButton.click();
      expect(await cartPage.getCart()).toEqual([]);
    }
  );

  test(
    '[TC-CARR-CARRITO-029] "Finalizar compra" muestra el toast de agradecimiento',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.checkoutButton.click();
      await expect(cartPage.toast).toContainText('¡Gracias por tu compra!');
    }
  );

  test(
    '[TC-CARR-CARRITO-031] "Finalizar compra" no persiste ni envía la "compra" a ningún lado',
    { tag: '@P0' },
    async ({ cartPage, page }) => {
      const apiRequests: string[] = [];
      page.on('request', (req) => {
        if (req.url().includes('/api/')) apiRequests.push(req.url());
      });
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.checkoutButton.click();
      await expect(cartPage.toast).toBeVisible();
      expect(apiRequests).toHaveLength(0);
      const storageKeys = await page.evaluate(() => Object.keys(localStorage));
      expect(storageKeys.some((k) => /orden|pedido|compra|order/i.test(k))).toBe(false);
    }
  );
});
