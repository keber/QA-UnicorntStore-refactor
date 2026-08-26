import { type Locator, type Page } from '@playwright/test';

/**
 * @module CARR
 * @submodule CARRITO
 * @spec qa/01-specifications/module-carrito/submodule-carrito/00-inventory.md
 *
 * Page Object for the cart offcanvas (`#cartOffcanvas`), present identically on every
 * page of the site (index.html and product.html). Observed live 2026-08-26 via
 * playwright-cli:
 *   - Empty state: `#cart-items` shows "El carrito está vacío."; `#cart-footer` is
 *     `display:none` until the cart has at least one item.
 *   - Each line (`.cart-item[data-id]`) has its own qty stepper (`.btn-cart-minus`,
 *     `.cart-qty-input`, `.btn-cart-plus`) and "Eliminar" button - unlike the detail
 *     page's selector, "−" at qty=1 removes the line instead of blocking at 1.
 *   - Manual edits to `.cart-qty-input` correctly clamp/sanitize (unlike the
 *     listado/detalle "Agregar" flow, see DEF-001).
 *   - "Finalizar compra" and "Vaciar carrito" reuse the same `#cart-toast` element as the
 *     catalog's "added to cart" toast, with a different message.
 */
export class CartPage {
  constructor(private readonly page: Page) {}

  // ==================== Locators ====================

  get openButton(): Locator {
    // Unscoped, this would also match "Agregar al carrito" (detail page) and "Vaciar carrito"
    // (own footer, once populated) - both contain "carrito" as a case-insensitive substring.
    // The navbar "Carrito" button is present identically on every page (index.html/product.html).
    return this.page.getByRole('banner').getByRole('button', { name: 'Carrito' });
  }

  get badge(): Locator {
    // #cart-badge has no accessible role/label of its own (same as CatalogPage.cartBadge).
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#cart-badge');
  }

  get dialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Tu carrito' });
  }

  get dialogTitle(): Locator {
    return this.dialog.getByRole('heading', { level: 5, name: 'Tu carrito' });
  }

  get backdrop(): Locator {
    // Bootstrap-generated overlay element, no ARIA role of its own.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('.offcanvas-backdrop');
  }

  get closeButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Cerrar' });
  }

  get emptyMessage(): Locator {
    return this.page.getByText('El carrito está vacío.');
  }

  get footer(): Locator {
    // #cart-footer has no ARIA role.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#cart-footer');
  }

  get total(): Locator {
    // #cart-total has no ARIA role.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#cart-total');
  }

  get checkoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Finalizar compra' });
  }

  get clearButton(): Locator {
    return this.page.getByRole('button', { name: 'Vaciar carrito' });
  }

  get toast(): Locator {
    // Shared with CatalogPage's add-to-cart toast; both messages reuse this same element.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#cart-toast');
  }

  /** Line for a given product id, scoping all per-line locators below. */
  itemRow(productId: number): Locator {
    return this.page.locator(`.cart-item[data-id="${productId}"]`);
  }

  qtyInput(productId: number): Locator {
    return this.itemRow(productId).getByRole('spinbutton', { name: 'Cantidad' });
  }

  increaseButton(productId: number): Locator {
    return this.itemRow(productId).getByRole('button', { name: 'Aumentar' });
  }

  decreaseButton(productId: number): Locator {
    return this.itemRow(productId).getByRole('button', { name: 'Reducir' });
  }

  removeButton(productId: number): Locator {
    return this.itemRow(productId).getByRole('button', { name: 'Eliminar' });
  }

  // ==================== Actions ====================

  /**
   * Opens the offcanvas via the navbar "Carrito" button. Does not assert visibility itself
   * (assertions live in the spec, per the POM rules) - Playwright's auto-waiting already makes
   * any subsequent interaction with `dialog`'s content wait for the open transition.
   */
  async open(): Promise<void> {
    await this.openButton.click();
  }

  /** Closes the offcanvas via its "Cerrar" button. */
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /**
   * Seeds `localStorage['unicornt_cart']` directly, bypassing the "Agregar" flow (which
   * has its own known defect, DEF-001) - the page must be reloaded afterwards for the
   * offcanvas to reflect the new state.
   */
  async setCart(items: Array<{ id: number; qty: number }>): Promise<void> {
    await this.page.evaluate((data) => {
      localStorage.setItem('unicornt_cart', JSON.stringify(data));
    }, items);
  }

  /** Reads the current cart contents directly from `localStorage`. */
  async getCart(): Promise<Array<{ id: number; qty: number }>> {
    return this.page.evaluate(() => {
      const raw = localStorage.getItem('unicornt_cart');
      return raw ? (JSON.parse(raw) as Array<{ id: number; qty: number }>) : [];
    });
  }
}
