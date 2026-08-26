import { expect, type Locator, type Page } from '@playwright/test';

/**
 * @module CAT
 * @submodule LISTADO
 * @spec qa/01-specifications/module-catalogo/submodule-listado (pending Stage 2)
 *
 * Page Object for the home page / catalog listing (index.html, `#products`).
 * Observed live 2026-08-26 via playwright-cli:
 *   - Static HTML + Bootstrap 5.3.8 + vanilla JS (products.js/cart.js/app.js), no framework
 *   - No login, no backend/API - cart persists client-side in localStorage
 *   - 49 products rendered as `<article>` cards inside `ul[aria-label="Catálogo de productos"]`
 *   - "Agregar" adds qty 1 to the cart and shows a toast; cart badge updates
 */
export class CatalogPage {
  constructor(private readonly page: Page) {}

  // ==================== Locators ====================

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Nuestros productos' });
  }

  get productCards(): Locator {
    return this.page.getByRole('list', { name: 'Catálogo de productos' }).getByRole('article');
  }

  get cartButton(): Locator {
    return this.page.getByRole('button', { name: 'Carrito' });
  }

  get cartBadge(): Locator {
    // #cart-badge has no accessible role/label of its own (it's a bare count inside the
    // Carrito button); the DOM id is the only stable identifier the app exposes for it,
    // confirmed via live exploration.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#cart-badge');
  }

  // ==================== Feedback Locators ====================

  get addedToCartToast(): Locator {
    return this.page.getByText('¡Producto agregado al carrito!');
  }

  // ==================== Actions ====================

  /** Navigates to the catalog (home page). */
  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  /** Product card at a given 0-based catalog position (not the product id). */
  cardAt(index: number): Locator {
    // Deliberate positional access ("the Nth card in the grid"), not a brittle
    // workaround for an unstable selector.
    // eslint-disable-next-line playwright/no-nth-methods
    return this.productCards.nth(index);
  }

  /**
   * Clicks "Agregar" on the given card and waits for the confirmation toast.
   * @param card - locator for a single product card, e.g. from `cardAt()`.
   */
  async addToCart(card: Locator): Promise<void> {
    await card.getByRole('button', { name: 'Agregar' }).click();
    await expect(this.addedToCartToast).toBeVisible();
  }
}
