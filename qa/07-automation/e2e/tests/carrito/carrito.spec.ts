/**
 * @module CARR
 * @submodule CARRITO
 * @spec qa/01-specifications/module-carrito/submodule-carrito/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CARR.md
 * @priority P0-P3
 *
 * P0 (Stage 5 first pass) + P1-P3 (Stage 5 second pass, 2026-08-26). DEF-002 status (reconfirmed
 * 2026-08-29 against the refactor): the original inconsistent offcanvas is fixed - a cart with
 * only an entry whose product id no longer exists now renders the empty state and hides the
 * footer, so TC-CARR-CARRITO-035/036 pass again as normal `test()`s. Residual: the "Carrito"
 * badge still counts that phantom entry's qty - TC-CARR-CARRITO-056, `test.fail()`, tracked as
 * keber/unicornt-store-frontend#20. TC-CARR-CARRITO-055 documents the $0-total symptom directly.
 *
 * TC-CARR-CARRITO-027/028/029/030/031/048 are `test.fixme()`-tagged as OBSOLETE after the
 * frontend refactor (backend-integration prep): "Finalizar compra" is now a real checkout flow,
 * not the old cosmetic no-op, and a real checkout step (shipping address) exists. Behavior is
 * still in flux (backend not wired yet), so these are parked, not rewritten. Stage 6
 * (qa-maintenance) will update specs + memory first, then rewrite/replace these once the flow
 * stabilizes. Tracking: qa/AGENT-NEXT-STEPS.md -> "Mantenimiento pendiente (refactor frontend)".
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

  // [OBSOLETO - refactor frontend, aún en flujo] "Finalizar compra" ya no vacía el carrito
  // client-side; el refactor lo convirtió en un flujo real (prep de integración con backend).
  // Ver el bloque de cabecera del archivo y qa/AGENT-NEXT-STEPS.md -> "Mantenimiento pendiente".
  test.fixme(
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

  // [OBSOLETO - refactor frontend, aún en flujo] El refactor eliminó el toast cosmético
  // "¡Gracias por tu compra!" (checkout ahora es un flujo real, prep de backend). #cart-toast
  // conserva el último mensaje ("Producto agregado al carrito"). Ver cabecera + AGENT-NEXT-STEPS.md.
  test.fixme(
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

  // [OBSOLETO - refactor frontend, aún en flujo] La premisa "sin backend / 0 llamadas /api/" ya
  // no aplica: el refactor introdujo la integración con backend. Además el toast de cierre cambió.
  // Ver cabecera + qa/AGENT-NEXT-STEPS.md -> "Mantenimiento pendiente (refactor frontend)".
  test.fixme(
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

  // ==================== P1-P3 (Stage 5, second pass) ====================

  test(
    '[TC-CARR-CARRITO-002] El offcanvas muestra el título "Tu carrito" con ícono',
    { tag: '@P3' },
    async ({ cartPage }) => {
      await cartPage.open();
      await expect(cartPage.dialogTitle).toBeVisible();
      // Decorative icon, no ARIA role of its own - existence check only.
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(cartPage.dialog.locator('.fa-cart-shopping')).toBeVisible();
    }
  );

  test(
    '[TC-CARR-CARRITO-004] Presionar Escape cierra el offcanvas',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.open();
      // Bootstrap's offcanvas Escape handler only acts once its open transition finishes
      // (`showing` -> `show`) - pressing Escape mid-transition is a no-op.
      await expect(cartPage.dialog).toHaveClass(/\bshow\b/);
      await page.keyboard.press('Escape');
      await expect(cartPage.dialog).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-005] Click en el backdrop cierra el offcanvas',
    { tag: '@P1' },
    async ({ cartPage }) => {
      await cartPage.open();
      // The offcanvas panel is `offcanvas-end` (docked right); (5, 5) is outside it.
      await cartPage.backdrop.click({ position: { x: 5, y: 5 } });
      await expect(cartPage.dialog).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-011] El total se recalcula al cambiar una cantidad',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.total).toHaveText('$13.990');
      await cartPage.increaseButton(1).click();
      await expect(cartPage.total).toHaveText('$27.980');
    }
  );

  test(
    '[TC-CARR-CARRITO-014] El botón "−" en qty=1 elimina la línea completa',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.decreaseButton(2).click();
      await expect(cartPage.itemRow(2)).toHaveCount(0);
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 2 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-015] El botón "+" no incrementa por sobre 99',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 99 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.increaseButton(1).click();
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 99 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-016] Editar manualmente a un valor válido actualiza la cantidad',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.qtyInput(1).fill('25');
      await cartPage.qtyInput(1).press('Tab');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 25 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-017] Editar manualmente a 0 sanea a 1',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 5 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.qtyInput(1).fill('0');
      await cartPage.qtyInput(1).press('Tab');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-018] Editar manualmente a un valor negativo sanea a 1',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 5 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.qtyInput(1).fill('-5');
      await cartPage.qtyInput(1).press('Tab');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-019] Editar manualmente a vacío sanea a 1',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 5 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.qtyInput(1).fill('');
      await cartPage.qtyInput(1).press('Tab');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-020] Editar manualmente a un valor > 99 clampea a 99',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 5 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.qtyInput(1).fill('500');
      await cartPage.qtyInput(1).press('Tab');
      expect(await cartPage.getCart()).toEqual([{ id: 1, qty: 99 }]);
    }
  );

  test(
    '[TC-CARR-CARRITO-022] "Eliminar" no requiere confirmación',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      let dialogShown = false;
      page.on('dialog', (dialog) => {
        dialogShown = true;
        void dialog.dismiss();
      });
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.removeButton(1).click();
      await expect(cartPage.emptyMessage).toBeVisible();
      expect(dialogShown).toBe(false);
    }
  );

  test(
    '[TC-CARR-CARRITO-024] "Vaciar carrito" no requiere confirmación',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      let dialogShown = false;
      page.on('dialog', (dialog) => {
        dialogShown = true;
        void dialog.dismiss();
      });
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.clearButton.click();
      await expect(cartPage.emptyMessage).toBeVisible();
      expect(dialogShown).toBe(false);
    }
  );

  test(
    '[TC-CARR-CARRITO-025] Tras vaciar el carrito, vuelve el estado vacío',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.clearButton.click();
      await expect(cartPage.emptyMessage).toBeVisible();
      await expect(cartPage.footer).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-026] El badge desaparece tras vaciar el carrito',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.clearButton.click();
      await expect(cartPage.badge).toBeHidden();
    }
  );

  // [OBSOLETO - refactor frontend, aún en flujo] Tras el refactor "Finalizar compra" ya no cierra
  // el offcanvas (ahora abre/mantiene el flujo de checkout real). Ver cabecera + AGENT-NEXT-STEPS.md.
  test.fixme(
    '[TC-CARR-CARRITO-028] "Finalizar compra" cierra el offcanvas',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.checkoutButton.click();
      await expect(cartPage.dialog).toBeHidden();
    }
  );

  // [OBSOLETO - refactor frontend, aún en flujo] Depende del toast "¡Gracias por tu compra!" que
  // el refactor eliminó; el checkout real (con backend) puede además generar confirmación/orden.
  // Ver cabecera + qa/AGENT-NEXT-STEPS.md -> "Mantenimiento pendiente (refactor frontend)".
  test.fixme(
    '[TC-CARR-CARRITO-030] "Finalizar compra" no genera número de orden ni confirmación',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.checkoutButton.click();
      await expect(cartPage.toast).toContainText('¡Gracias por tu compra!');
      await expect(page.getByText(/n[uú]mero de orden|order id|pedido n[uú]mero/i)).toHaveCount(0);
    }
  );

  test(
    '[TC-CARR-CARRITO-032] El carrito con múltiples ítems distintos renderiza todas las líneas',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
        { id: 3, qty: 3 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$27.980');
      await expect(cartPage.itemRow(2)).toContainText('$14.990');
      await expect(cartPage.itemRow(3)).toContainText('$41.970');
    }
  );

  test(
    '[TC-CARR-CARRITO-033] El carrito es idéntico entre index.html y product.html',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 2 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$27.980');
      await cartPage.close();
      await page.goto('/product.html?id=5', { waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$27.980');
    }
  );

  test(
    '[TC-CARR-CARRITO-034] El carrito persiste tras recargar la página',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 2 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$27.980');
    }
  );

  test(
    '[TC-CARR-CARRITO-035] Una entrada con producto inexistente muestra el estado vacío y oculta el footer',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 9999, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      // RN-CARR-009: la entrada inválida se trata como inexistente - #cart-items muestra "El
      // carrito está vacío." y #cart-footer queda oculto. Corregido en el refactor (era DEF-002:
      // #cart-items quedaba sin líneas NI mensaje, con el footer visible); reconfirmado como fix
      // el 2026-08-29 - de-fixme'd. El residual del badge (sigue contando "1") se rastrea en
      // TC-CARR-CARRITO-056 / keber/unicornt-store-frontend#20.
      await expect(cartPage.emptyMessage).toBeVisible();
      await expect(cartPage.footer).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-036] "Finalizar compra" no está disponible sobre un carrito solo con entrada inválida',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 9999, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      // RN-CARR-009: sin ítems válidos, el footer y "Finalizar compra" no están disponibles.
      // Corregido en el refactor (era DEF-002: el footer se mostraba y "Finalizar compra" se
      // ejecutaba con éxito); reconfirmado como fix el 2026-08-29 - de-fixme'd.
      await expect(cartPage.checkoutButton).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-037] La imagen de cada línea tiene alt igual al nombre del producto',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1).getByRole('img')).toHaveAttribute(
        'alt',
        "Polera 'I Can Explain It To You'"
      );
    }
  );

  test(
    '[TC-CARR-CARRITO-038] El precio unitario incluye el sufijo "c/u"',
    { tag: '@P3' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$13.990 c/u');
    }
  );

  test(
    '[TC-CARR-CARRITO-039] El formato de precio es consistente con listado/detalle',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.itemRow(1)).toContainText('$13.990');
      await cartPage.close();
      await page.goto('/product.html?id=1', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('$13.990')).toBeVisible();
    }
  );

  test(
    '[TC-CARR-CARRITO-040] El botón "Eliminar" tiene aria-label="Eliminar"',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.removeButton(1)).toHaveAttribute('aria-label', 'Eliminar');
    }
  );

  test(
    '[TC-CARR-CARRITO-041] Los botones +/- tienen aria-label "Reducir"/"Aumentar"',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.decreaseButton(1)).toHaveAttribute('aria-label', 'Reducir');
      await expect(cartPage.increaseButton(1)).toHaveAttribute('aria-label', 'Aumentar');
    }
  );

  test(
    '[TC-CARR-CARRITO-042] El input de cantidad tiene aria-label="Cantidad"',
    { tag: '@P3' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.qtyInput(1)).toHaveAttribute('aria-label', 'Cantidad');
    }
  );

  test(
    '[TC-CARR-CARRITO-043] El offcanvas expone role="dialog" y aria-modal="true"',
    { tag: '@P2' },
    async ({ cartPage }) => {
      await cartPage.open();
      await expect(cartPage.dialog).toHaveAttribute('aria-modal', 'true');
      await expect(cartPage.dialog).toHaveAttribute('aria-labelledby', 'cartOffcanvasLabel');
    }
  );

  test(
    '[TC-CARR-CARRITO-044] El badge se muestra solo cuando hay al menos 1 unidad total',
    { tag: '@P1' },
    async ({ cartPage }) => {
      await expect(cartPage.badge).toBeHidden();
      // See TC-CAT-LISTADO-030: assert no badge digit leaks into the name, not exact whitespace.
      await expect(cartPage.openButton).not.toHaveAccessibleName(/\d/);
    }
  );

  test(
    '[TC-CARR-CARRITO-045] El badge cuenta unidades totales, no líneas distintas',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([
        { id: 1, qty: 2 },
        { id: 2, qty: 5 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(cartPage.badge).toHaveText('7');
    }
  );

  test(
    '[TC-CARR-CARRITO-046] Dos líneas con cantidades 2 y 5 resultan en badge "7"',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([
        { id: 1, qty: 2 },
        { id: 2, qty: 5 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(cartPage.badge).toHaveText('7');
    }
  );

  test(
    '[TC-CARR-CARRITO-047] #cart-items tiene scroll propio cuando hay muchas líneas',
    { tag: '@P3' },
    async ({ cartPage, page }) => {
      await cartPage.setCart(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, qty: 1 })));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      // `#cart-items` has no ARIA role of its own; `.overflow-auto` is the Bootstrap utility
      // class that gives it its own scroll region (assets/js/cart.js renderCart() markup).
      // eslint-disable-next-line playwright/no-raw-locators
      await expect(page.locator('#cart-items.overflow-auto')).toBeVisible();
    }
  );

  // [OBSOLETO - refactor frontend, aún en flujo] El refactor agregó un paso de checkout real
  // (campo de dirección/envío visible). Este TC aseguraba su ausencia y ya no aplica; en Stage 6
  // se reemplaza por cobertura positiva del flujo. Ver cabecera + AGENT-NEXT-STEPS.md.
  test.fixme(
    '[TC-CARR-CARRITO-048] No existe ningún paso de checkout real',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(page.getByRole('textbox', { name: /direcci[oó]n|env[ií]o/i })).toHaveCount(0);
      await expect(page.getByText(/tarjeta|medio de pago|cup[oó]n/i)).toHaveCount(0);
    }
  );

  test(
    '[TC-CARR-CARRITO-049] No hay llamadas de red al abrir/operar el carrito',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      const apiRequests: string[] = [];
      page.on('request', (req) => {
        if (req.url().includes('/api/')) apiRequests.push(req.url());
      });
      await cartPage.setCart([
        { id: 1, qty: 1 },
        { id: 2, qty: 1 },
      ]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.increaseButton(1).click();
      await cartPage.removeButton(2).click();
      expect(apiRequests).toHaveLength(0);
    }
  );

  test(
    '[TC-CARR-CARRITO-050] Abrir el carrito no cambia la URL de la página',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      const urlBefore = page.url();
      await cartPage.open();
      await expect(cartPage.dialog).toBeVisible();
      expect(page.url()).toBe(urlBefore);
    }
  );

  test(
    '[TC-CARR-CARRITO-051] El botón "Carrito" es accesible por teclado',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.openButton.focus();
      await page.keyboard.press('Enter');
      await expect(cartPage.dialog).toBeVisible();
    }
  );

  test(
    '[TC-CARR-CARRITO-052] Los controles de cada línea son accesibles por teclado',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      // Wait for the open transition to finish - Bootstrap's focus trap re-steals focus onto
      // the offcanvas panel once it activates, which can swallow a focus() set mid-transition
      // (same root cause as TC-CARR-CARRITO-004's Escape-key race).
      await expect(cartPage.dialog).toHaveClass(/\bshow\b/);
      await cartPage.increaseButton(1).focus();
      await page.keyboard.press('Enter');
      await expect(cartPage.qtyInput(1)).toHaveValue('2');
    }
  );

  test(
    '[TC-CARR-CARRITO-053] Cerrar y reabrir el offcanvas mantiene el estado actualizado',
    { tag: '@P2' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await cartPage.increaseButton(1).click();
      await expect(cartPage.qtyInput(1)).toHaveValue('2');
      await cartPage.close();
      await cartPage.open();
      await expect(cartPage.qtyInput(1)).toHaveValue('2');
    }
  );

  test(
    '[TC-CARR-CARRITO-054] Vaciar el carrito actualiza el badge en la misma pestaña sin recargar',
    { tag: '@P1' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 1, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(cartPage.badge).toHaveText('1');
      await cartPage.open();
      await cartPage.clearButton.click();
      await expect(cartPage.badge).toBeHidden();
    }
  );

  test(
    '[TC-CARR-CARRITO-055] El total muestra $0 cuando el carrito solo tiene entradas inválidas',
    { tag: '@P3' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 9999, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await cartPage.open();
      await expect(cartPage.total).toHaveText('$0');
    }
  );

  test.fail(
    '[TC-CARR-CARRITO-056] El badge cuenta unidades de un producto inexistente en el catálogo (DEF-002)',
    { tag: '@P3' },
    async ({ cartPage, page }) => {
      await cartPage.setCart([{ id: 9999, qty: 1 }]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      // Expected (RN-CARR-009): con solo entradas inválidas el badge está oculto, consistente
      // con el offcanvas (estado vacío) y el total ($0).
      // Actual (DEF-002 residual, reconfirmado 2026-08-29 contra el refactor): #cart-badge
      // muestra "1" - el cálculo del badge suma sobre unicornt_cart sin filtrar contra el
      // catálogo. Issue: keber/unicornt-store-frontend#20.
      // `test.fail()`: cuando se corrija, pasar a `test()` normal.
      await expect(cartPage.badge).toBeHidden();
    }
  );
});
