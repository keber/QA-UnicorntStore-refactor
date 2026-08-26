/**
 * @module CAT
 * @submodule DETALLE
 * @spec qa/01-specifications/module-catalogo/submodule-detalle/05-test-scenarios.md
 * @plan qa/02-test-plans/sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md
 * @priority P0-P3
 *
 * P0 (Stage 5 first pass) + P1-P3 (Stage 5 second pass, 2026-08-26). TC-CAT-DETALLE-050/051/052
 * (variantes/reseñas/productos relacionados) stay out of scope - `Tipo=Bloqueado` in the Plan de
 * Pruebas (features absent from the current app, pending business confirmation).
 * TC-CAT-DETALLE-018/022 are `test.fixme()`-tagged for DEF-001 (max qty not clamped on
 * "Agregar"/"Agregar al carrito").
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

  // ==================== P1-P3 (Stage 5, second pass) ====================

  test(
    '[TC-CAT-DETALLE-002] El breadcrumb muestra "Inicio / {nombre del producto}"',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.breadcrumbHomeLink).toBeVisible();
      await expect(productDetailPage.breadcrumbName).toHaveText("Polera 'I Can Explain It To You'");
    }
  );

  test(
    '[TC-CAT-DETALLE-003] El breadcrumb "Inicio" navega a index.html',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.breadcrumbHomeLink.click();
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-004] La imagen del producto tiene alt correcto',
    { tag: '@P2' },
    async ({ page }) => {
      await expect(page.getByRole('img')).toHaveAttribute(
        'alt',
        "Polera 'I Can Explain It To You'"
      );
    }
  );

  test(
    '[TC-CAT-DETALLE-005] El nombre del producto se muestra como heading h1',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.heading).toHaveText("Polera 'I Can Explain It To You'");
    }
  );

  test(
    '[TC-CAT-DETALLE-006] El precio se muestra en formato "$XX.990"',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.price).toHaveText('$13.990');
    }
  );

  test(
    '[TC-CAT-DETALLE-007] La descripción completa del producto se muestra',
    { tag: '@P2' },
    async ({ page }) => {
      await expect(
        page.getByText(
          'Frase favorita de todo Project Manager ante una estimación imposible. Si llevas esta polera en una reunión de planificación, todos sabrán quién eres.'
        )
      ).toBeVisible();
    }
  );

  test(
    '[TC-CAT-DETALLE-011] "Reducir cantidad" no decrementa por debajo de 1',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await productDetailPage.decreaseButton.click();
      await expect(productDetailPage.qtyInput).toHaveValue('1');
    }
  );

  test(
    '[TC-CAT-DETALLE-012] "Aumentar cantidad" no incrementa por sobre 99',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await productDetailPage.qtyInput.fill('99');
      await productDetailPage.increaseButton.click();
      await expect(productDetailPage.qtyInput).toHaveValue('99');
    }
  );

  test(
    '[TC-CAT-DETALLE-013] El input de cantidad expone min="1" y max="99"',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.qtyInput).toHaveAttribute('type', 'number');
      await expect(productDetailPage.qtyInput).toHaveAttribute('min', '1');
      await expect(productDetailPage.qtyInput).toHaveAttribute('max', '99');
    }
  );

  test(
    '[TC-CAT-DETALLE-015] Cantidad 0 al agregar se sanea a 1',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.qtyInput.fill('0');
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-016] Cantidad negativa al agregar se sanea a 1',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.qtyInput.fill('-5');
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-017] Cantidad vacía al agregar se sanea a 1',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.qtyInput.fill('');
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test.fixme(
    '[TC-CAT-DETALLE-018] Cantidad > 99 al agregar no se clampea (DEF-001)',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.qtyInput.fill('150');
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      // Expected (RN-CAT-010): qty debería clampearse a 99.
      // Actual (DEF-001): qty queda en 150 - "Agregar al carrito" no clampea el límite superior.
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 99 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-019] El input de cantidad no acepta letras vía tipeo directo',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      // Playwright's fill() rejects non-numeric input on <input type="number"> at the protocol
      // level - confirmed live during the P0 pass (qa/memory/e2e-automation-patterns.md).
      await expect(productDetailPage.qtyInput.fill('abc')).rejects.toThrow(
        /Cannot type text into input\[type=number\]/
      );
      await expect(productDetailPage.qtyInput).toHaveValue('1');
    }
  );

  test(
    '[TC-CAT-DETALLE-021] Agregar desde el detalle sobre un producto ya en el carrito acumula la cantidad',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.addToCart();
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 2 }]);
    }
  );

  test.fixme(
    '[TC-CAT-DETALLE-022] Agregar desde el detalle que excede 99 no se clampea (DEF-001)',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await page.evaluate(() =>
        localStorage.setItem('unicornt_cart', JSON.stringify([{ id: 1, qty: 99 }]))
      );
      await page.reload({ waitUntil: 'domcontentloaded' });
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      // Expected (RN-CAT-012): qty debería permanecer en 99.
      // Actual (DEF-001): qty sube a 100 - mismo root cause que TC-CAT-DETALLE-018.
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 99 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-023] "Volver" navega a index.html',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.backLink.click();
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-025] id no numérico redirige silenciosamente al listado',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.goto('abc');
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-026] id ausente redirige silenciosamente al listado',
    { tag: '@P1' },
    async ({ page }) => {
      await page.goto('/product.html', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-027] id=0 redirige silenciosamente al listado',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.goto(0);
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-028] id negativo redirige silenciosamente al listado',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.goto(-1);
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-029] id=50 (uno por sobre el último válido) redirige silenciosamente',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.goto(50);
      await expect(page).toHaveURL(/index\.html$/);
    }
  );

  test(
    '[TC-CAT-DETALLE-030] id="01" (cero a la izquierda) resuelve al producto 1',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await productDetailPage.goto('01');
      await expect(productDetailPage.heading).toHaveText("Polera 'I Can Explain It To You'");
    }
  );

  test(
    '[TC-CAT-DETALLE-031] id="1.5" (decimal) resuelve al producto 1',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await productDetailPage.goto('1.5');
      await expect(productDetailPage.heading).toHaveText("Polera 'I Can Explain It To You'");
    }
  );

  test(
    '[TC-CAT-DETALLE-032] id=1 (primer producto válido) renderiza correctamente',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.heading).toHaveText("Polera 'I Can Explain It To You'");
      await expect(productDetailPage.price).toHaveText('$13.990');
    }
  );

  test(
    '[TC-CAT-DETALLE-033] id=49 (último producto válido) renderiza correctamente',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await productDetailPage.goto(49);
      await expect(productDetailPage.heading).toHaveText("Polera 'Quality Assurance Vol. 2'");
      await expect(productDetailPage.price).toHaveText('$13.990');
    }
  );

  test(
    '[TC-CAT-DETALLE-034] El header en detalle mantiene los mismos enlaces que en listado',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.homeNavLink).toBeVisible();
      await expect(productDetailPage.contactNavLink).toBeVisible();
      await expect(productDetailPage.cartButton).toBeVisible();
    }
  );

  test(
    '[TC-CAT-DETALLE-035] "Contacto" en detalle navega a index.html#contacto',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.contactNavLink).toHaveAttribute('href', 'index.html#contacto');
    }
  );

  test(
    '[TC-CAT-DETALLE-036] El footer en detalle es idéntico al del listado',
    { tag: '@P3' },
    async ({ productDetailPage }) => {
      // "Unicorn't Store" also appears in the copyright line below - scope to the brand heading.
      await expect(
        productDetailPage.footer.getByRole('heading', { name: "Unicorn't Store" })
      ).toBeVisible();
      await expect(productDetailPage.footer.getByText(/© 2026 Unicorn't Store/)).toBeVisible();
      await expect(productDetailPage.footer.getByRole('link', { name: 'Instagram' })).toBeVisible();
    }
  );

  test(
    '[TC-CAT-DETALLE-038] El toast de confirmación también aparece al agregar desde el detalle, con el nombre del producto interpolado',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await productDetailPage.addToCart();
      await expect(productDetailPage.toast).toContainText(
        "¡Polera 'I Can Explain It To You' agregado al carrito!"
      );
    }
  );

  test(
    '[TC-CAT-DETALLE-039] El badge del botón "Carrito" se actualiza al agregar desde el detalle',
    { tag: '@P1' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.cartBadge).toBeHidden();
      await productDetailPage.addToCart();
      await expect(productDetailPage.cartBadge).toHaveText('1');
    }
  );

  test(
    '[TC-CAT-DETALLE-040] El carrito persiste tras recargar la página de detalle',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.addToCart();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(productDetailPage.cartBadge).toHaveText('1');
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );

  test(
    '[TC-CAT-DETALLE-041] "Aumentar cantidad" es accesible por teclado',
    { tag: '@P2' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.increaseButton.focus();
      await page.keyboard.press('Enter');
      await expect(productDetailPage.qtyInput).toHaveValue('2');
    }
  );

  test(
    '[TC-CAT-DETALLE-042] El spinbutton de cantidad tiene aria-label="Cantidad"',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.qtyInput).toHaveAttribute('aria-label', 'Cantidad');
    }
  );

  test(
    '[TC-CAT-DETALLE-043] Los botones +/- tienen aria-label descriptivo',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await expect(productDetailPage.decreaseButton).toHaveAttribute(
        'aria-label',
        'Reducir cantidad'
      );
      await expect(productDetailPage.increaseButton).toHaveAttribute(
        'aria-label',
        'Aumentar cantidad'
      );
    }
  );

  test(
    '[TC-CAT-DETALLE-044] Recargar la página reinicia la cantidad seleccionada a 1',
    { tag: '@P2' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.increaseButton.click();
      await expect(productDetailPage.qtyInput).toHaveValue('2');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(productDetailPage.qtyInput).toHaveValue('1');
    }
  );

  test(
    '[TC-CAT-DETALLE-045] Doble click rápido en "Aumentar cantidad" incrementa exactamente 2',
    { tag: '@P3' },
    async ({ productDetailPage }) => {
      await productDetailPage.increaseButton.dblclick();
      await expect(productDetailPage.qtyInput).toHaveValue('3');
    }
  );

  test(
    '[TC-CAT-DETALLE-046] Cambiar el id en la URL actualiza el detalle al nuevo producto',
    { tag: '@P2' },
    async ({ productDetailPage }) => {
      await productDetailPage.goto(2);
      await expect(productDetailPage.heading).toHaveText("Polera 'Cloud Architect'");
    }
  );

  test.fixme(
    '[TC-CAT-DETALLE-047] El detalle en viewport móvil mantiene los controles operables (DEF-003)',
    { tag: '@P3' },
    async ({ productDetailPage, page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(productDetailPage.qtyInput).toBeVisible();
      await expect(productDetailPage.addToCartButton).toBeVisible();
      // Expected: no horizontal overflow at a standard mobile viewport.
      // Actual (DEF-003, found during this automation pass): #product-content's `.row.g-5`
      // overflows the viewport by ~12px (scrollWidth 387 vs. clientWidth 375).
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(376);
    }
  );

  test(
    '[TC-CAT-DETALLE-048] Precio y nombre coinciden entre listado y detalle para el mismo id',
    { tag: '@P1' },
    async ({ catalogPage, productDetailPage }) => {
      await catalogPage.goto();
      const card = catalogPage.cardAt(0);
      const listName = ((await card.getByRole('heading', { level: 3 }).textContent()) ?? '').trim();
      const listPrice = ((await card.getByText(/\$\d{1,2}\.\d{3}/).textContent()) ?? '').trim();
      await productDetailPage.goto(1);
      await expect(productDetailPage.heading).toHaveText(listName);
      await expect(productDetailPage.price).toHaveText(listPrice);
    }
  );

  test(
    '[TC-CAT-DETALLE-049] Descripción coincide entre listado y detalle para el mismo id',
    { tag: '@P2' },
    async ({ catalogPage, productDetailPage, page }) => {
      const description =
        'Frase favorita de todo Project Manager ante una estimación imposible. Si llevas esta polera en una reunión de planificación, todos sabrán quién eres.';
      await catalogPage.goto();
      await expect(catalogPage.cardAt(0).getByText(description)).toBeVisible();
      await productDetailPage.goto(1);
      await expect(page.getByText(description)).toBeVisible();
    }
  );

  test(
    '[TC-CAT-DETALLE-053] La consola no muestra errores críticos de aplicación al cargar el detalle',
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
    '[TC-CAT-DETALLE-054] Agregar productos distintos desde sus detalles crea entradas independientes',
    { tag: '@P1' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.addToCart();
      await productDetailPage.goto(2);
      await productDetailPage.addToCart();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([
        { id: 1, qty: 1 },
        { id: 2, qty: 1 },
      ]);
    }
  );

  test(
    '[TC-CAT-DETALLE-055] El botón "Agregar al carrito" es accesible por teclado',
    { tag: '@P2' },
    async ({ productDetailPage, page }) => {
      await productDetailPage.addToCartButton.focus();
      await page.keyboard.press('Enter');
      await expect(productDetailPage.addedToCartToast).toBeVisible();
      const cart = await page.evaluate(() => localStorage.getItem('unicornt_cart'));
      expect(JSON.parse(cart ?? '[]')).toEqual([{ id: 1, qty: 1 }]);
    }
  );
});
