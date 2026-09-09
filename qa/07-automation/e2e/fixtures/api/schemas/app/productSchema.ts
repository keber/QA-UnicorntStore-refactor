import { z } from 'zod';

/**
 * Catalog endpoints of the Unicornt Store API.
 *
 * Derived from `unicornt-store-backend/docs/openapi.json` and cross-checked
 * against live QA responses on 2026-09-06:
 * - `GET /api/v1/products?category=<slug>&q=&page=&size=` -> 200
 *   `ProductPageResponse` (Spring-style page wrapper).
 * - `GET /api/v1/products/{id}` -> 200 `ProductResponse` | 404
 *   `RESOURCE_NOT_FOUND`.
 * - `GET /api/v1/categories` -> 200 `CategoryResponse[]` (10 rows in the
 *   seed).
 *
 * Note the filter parameter is `category` (a slug), NOT `categoryId`.
 */

export const ProductResponseSchema = z.strictObject({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  imageBase: z.string(),
  price: z.number().int(),
  categoryId: z.number().int(),
  categoryName: z.string(),
  productTypeId: z.number().int(),
  productTypeName: z.string(),
  stock: z.number().int(),
  active: z.boolean(),
});

export const ProductPageResponseSchema = z.strictObject({
  content: z.array(ProductResponseSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
});

export const CategoryResponseSchema = z.strictObject({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
});

export const CategoryListSchema = z.array(CategoryResponseSchema);

export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductPageResponse = z.infer<typeof ProductPageResponseSchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
