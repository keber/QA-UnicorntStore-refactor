import { type Locator, type Page } from '@playwright/test';

/**
 * @module CARR
 * @submodule CARRITO
 * @spec qa/01-specifications/module-carrito/submodule-carrito/00-inventory.md
 *
 * Page Object for the cart offcanvas (`#cartOffcanvas`), present identically on every
 * page of the site (index.html and product.html).
 *
 * Re-baselined 2026-09-06 (Stage 6, see
 * `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md` §4):
 *   - Guest cart ops (add / qty / remove / total / clear) still work and are
 *     `localStorage['unicornt_cart']`-driven — selectors UNCHANGED.
 *   - "Finalizar compra" is now a real checkout `<form id="checkout-form">`
 *     (address fields) → `POST /api/v1/orders`. It is **broken end-to-end**
 *     (DEF-004): the browser cart is never synced to the server cart, so the
 *     order always fails. `fillCheckout()` + `submitCheckout()` drive the form;
 *     the success path is covered only by `test.fail()` guards.
 *   - Empty state: `#cart-items` shows "El carrito está vacío."; `#cart-footer`
 *     is hidden until the cart has ≥1 item.
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

  // ---------- Checkout form (added by the refactor) ----------

  get checkoutForm(): Locator {
    // Bare <form>, no accessible name.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#checkout-form');
  }

  get checkoutFullName(): Locator {
    return this.page.getByLabel('Nombre completo');
  }

  get checkoutEmail(): Locator {
    return this.checkoutForm.getByLabel('Email');
  }

  get checkoutStreet(): Locator {
    return this.page.getByLabel('Calle y número');
  }

  get checkoutCity(): Locator {
    return this.page.getByLabel('Ciudad');
  }

  get checkoutRegion(): Locator {
    return this.page.getByLabel('Región');
  }

  get checkoutZip(): Locator {
    return this.page.getByLabel('Código postal (opcional)');
  }

  /** Form-level error banner shown when `POST /api/v1/orders` fails. */
  get checkoutSubmitError(): Locator {
    // #checkout-submit-error shares role="alert" with the toast; the id is the stable handle.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#checkout-submit-error');
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
   * Opens the offcanvas via the navbar "Carrito" button.
   *
   * First waits for the page's product data (`GET /api/v1/products`) to settle: post-refactor
   * the cart lines are rendered from that data at open time and are NOT re-rendered if the fetch
   * lands later, so opening on a `domcontentloaded`-only page yields an empty offcanvas.
   */
  async open(): Promise<void> {
    // Wait for the page's product data to have rendered before opening: post-refactor the cart
    // lines are built from that data at open time and are NOT re-rendered if the fetch lands
    // later. `#product-list` (index) or `#product-detail` (product page) is the DOM signal.
    await this.productDataRendered
      .waitFor({ state: 'attached', timeout: 15_000 })
      .catch(() => undefined);
    await this.openButton.click();
  }

  /** First product element that only exists once the page's catalog fetch has rendered. */
  private get productDataRendered(): Locator {
    const anyProduct = '#product-list article, #product-detail .product-detail__name';
    // eslint-disable-next-line playwright/no-nth-methods
    return this.page.locator(anyProduct).first();
  }

  /** Closes the offcanvas via its "Cerrar" button. */
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /** Fills the checkout address form. `zipCode` is optional (so is the field). */
  async fillCheckout(address: {
    fullName: string;
    email: string;
    street: string;
    city: string;
    region: string;
    zipCode?: string;
  }): Promise<void> {
    await this.checkoutFullName.fill(address.fullName);
    await this.checkoutEmail.fill(address.email);
    await this.checkoutStreet.fill(address.street);
    await this.checkoutCity.fill(address.city);
    await this.checkoutRegion.fill(address.region);
    if (address.zipCode !== undefined) await this.checkoutZip.fill(address.zipCode);
  }

  /** Submits the checkout form via the "Finalizar compra" button. */
  async submitCheckout(): Promise<void> {
    await this.checkoutButton.click();
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
