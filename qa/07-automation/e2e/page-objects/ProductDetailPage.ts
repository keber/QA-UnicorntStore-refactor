import { expect, type Locator, type Page } from '@playwright/test';

/**
 * @module CAT
 * @submodule DETALLE
 * @spec qa/01-specifications/module-catalogo/submodule-detalle/00-inventory.md
 *
 * Page Object for the product detail page (`product.html?id={id}`).
 * Observed live 2026-08-26 via playwright-cli:
 *   - Quantity selector: `#qty-input` (`min="1" max="99"`), "Reducir cantidad"/"Aumentar
 *     cantidad" buttons clamp correctly at the boundaries.
 *   - Invalid/out-of-range `id` (absent, non-numeric, 0, negative, >49) redirects silently
 *     to `index.html` - no error message, no dedicated 404.
 *   - "Agregar al carrito" reuses the same toast/badge as the catalog listing.
 */
export class ProductDetailPage {
  constructor(private readonly page: Page) {}

  // ==================== Locators ====================

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get breadcrumb(): Locator {
    return this.page.getByRole('navigation', { name: 'breadcrumb' });
  }

  get qtyInput(): Locator {
    return this.page.getByRole('spinbutton', { name: 'Cantidad' });
  }

  get increaseButton(): Locator {
    return this.page.getByRole('button', { name: 'Aumentar cantidad' });
  }

  get decreaseButton(): Locator {
    return this.page.getByRole('button', { name: 'Reducir cantidad' });
  }

  get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Agregar al carrito' });
  }

  get backLink(): Locator {
    return this.page.getByRole('link', { name: 'Volver' });
  }

  // ==================== Feedback Locators ====================

  /**
   * Unlike the catalog listing's generic "¡Producto agregado al carrito!", the detail page's
   * toast interpolates the product name: "¡{Nombre del producto} agregado al carrito!" (see
   * RN-CAT-016) - match on the fixed suffix rather than the full message. No `^`/`$` anchors:
   * Playwright's regex text matching tests the raw (non-trimmed) text content of candidate
   * nodes, and this toast's markup has surrounding whitespace/newlines around the text.
   */
  get addedToCartToast(): Locator {
    return this.page.getByText(/agregado al carrito!/);
  }

  // ==================== Actions ====================

  /** Navigates to the detail page for a given product id (or an arbitrary raw value for boundary TCs). */
  async goto(id: number | string): Promise<void> {
    await this.page.goto(`/product.html?id=${id}`, { waitUntil: 'domcontentloaded' });
  }

  /** Clicks "Agregar al carrito" and waits for the confirmation toast. */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await expect(this.addedToCartToast).toBeVisible();
  }
}
