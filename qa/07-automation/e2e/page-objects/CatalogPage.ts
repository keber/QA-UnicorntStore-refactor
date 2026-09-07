import { expect, type Locator, type Page } from '@playwright/test';

/**
 * @module CAT
 * @submodule LISTADO
 * @spec qa/01-specifications/module-catalogo/submodule-listado/05-test-scenarios.md
 *
 * Page Object for the home page / catalog listing (index.html, `#products`).
 *
 * Re-baselined 2026-09-06 against the refactored app (see
 * `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`):
 *   - Catalog is now loaded async from `GET /api/v1/products` +
 *     `GET /api/v1/categories`; `#product-list` carries `aria-busy` while
 *     loading and drops the attribute when done. Always `awaitLoaded()`.
 *   - The default view renders the API's first page only: **20 of 49**
 *     products. No pagination UI.
 *   - A `#category-filter` <select> (value = category slug) re-queries the
 *     API (`?category=<slug>`) and re-renders a subset.
 *   - Cards are still `<article>` inside `role=list` "Catálogo de productos";
 *     cart still persists in `localStorage['unicornt_cart']` as `[{id,qty}]`.
 */
export class CatalogPage {
  /** API default page size — the storefront shows exactly this many with no filter. */
  static readonly DEFAULT_PAGE_SIZE = 20;
  /** Total seeded products (across all pages / categories). */
  static readonly TOTAL_PRODUCTS = 49;

  constructor(private readonly page: Page) {}

  // ==================== Locators ====================

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Nuestros productos' });
  }

  get productList(): Locator {
    return this.page.getByRole('list', { name: 'Catálogo de productos' });
  }

  get productCards(): Locator {
    return this.productList.getByRole('article');
  }

  /** Category filter `<select>` — added by the refactor. */
  get categoryFilter(): Locator {
    return this.page.getByRole('combobox', { name: 'Filtrar por categoría' });
  }

  get cartButton(): Locator {
    return this.page.getByRole('button', { name: 'Carrito' });
  }

  get cartBadge(): Locator {
    // #cart-badge has no accessible role/label of its own (it's a bare count inside the
    // Carrito button); the DOM id is the only stable identifier the app exposes for it.
    // eslint-disable-next-line playwright/no-raw-locators
    return this.page.locator('#cart-badge');
  }

  get skipLink(): Locator {
    return this.page.getByRole('link', { name: 'Saltar al contenido principal' });
  }

  /** The `<header>` landmark (navbar) - scopes "Inicio"/"Contacto" away from their footer duplicates. */
  get banner(): Locator {
    return this.page.getByRole('banner');
  }

  get logoLink(): Locator {
    return this.banner.getByRole('link', { name: "Unicorn't Store" });
  }

  get homeNavLink(): Locator {
    return this.banner.getByRole('link', { name: 'Inicio' });
  }

  get contactNavLink(): Locator {
    return this.banner.getByRole('link', { name: 'Contacto' });
  }

  /** The `<footer>` landmark. */
  get footer(): Locator {
    return this.page.getByRole('contentinfo');
  }

  // ==================== Feedback Locators ====================

  get addedToCartToast(): Locator {
    return this.page.getByText('¡Producto agregado al carrito!');
  }

  /** `#cart-toast` exposes `role="alert"` - no raw CSS locator needed. */
  get toast(): Locator {
    return this.page.getByRole('alert');
  }

  get toastCloseButton(): Locator {
    return this.toast.getByRole('button', { name: 'Cerrar' });
  }

  // ==================== Actions ====================

  /** Navigates to the catalog (home page) and waits for the async product render. */
  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.awaitLoaded();
  }

  /**
   * Waits out the async catalog load: the spinner skeleton (`aria-busy`) is
   * replaced by real `<article>` cards.
   */
  async awaitLoaded(): Promise<void> {
    await expect(this.productList).not.toHaveAttribute('aria-busy', 'true');
    // "at least one card has rendered" - the skeleton <div> is not an <article>.
    // eslint-disable-next-line playwright/no-nth-methods
    await expect(this.productCards.first()).toBeVisible();
  }

  /**
   * Selects a category by slug (`''` = "Todas las categorías") and waits for
   * the API re-query + re-render to settle. Slugs: pm, cloud, devops,
   * enigma, general, it-crowd, linux, personajes, programador, qa.
   *
   * The re-render toggles `#product-list`'s `aria-busy`; `awaitLoaded()` rides
   * that out. Callers then assert the resulting card count (auto-retrying),
   * which absorbs any brief stale-render window.
   */
  async filterByCategory(slug: string): Promise<void> {
    await this.categoryFilter.selectOption(slug);
    await this.awaitLoaded();
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
