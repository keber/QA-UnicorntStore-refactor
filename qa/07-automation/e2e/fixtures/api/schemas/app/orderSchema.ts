import { z } from 'zod';

/**
 * Order endpoints of the Unicornt Store API (`/api/v1/orders`, bearer-only).
 *
 * Derived from `unicornt-store-backend/docs/openapi.json` and cross-checked
 * against live QA responses on 2026-09-06:
 * - `POST /api/v1/orders` -> 201 `OrderConfirmationResponse`.
 *   400 `BAD_REQUEST` ("The cart is empty") | 400 `VALIDATION_ERROR`
 *   (missing street/city/region) | 401.
 * - `GET  /api/v1/orders` -> 200 `OrderResponse[]`, newest first.
 *
 * The request body carries only the shipping address — the server confirms
 * whatever is in the caller's server-side cart (see DEF-004: the frontend
 * never populates that cart, so the UI checkout always fails).
 */

export const ShippingAddressRequestSchema = z.strictObject({
  street: z.string(),
  city: z.string(),
  region: z.string(),
  zipCode: z.string().optional(),
});

export const PlaceOrderRequestSchema = z.strictObject({
  shippingAddress: ShippingAddressRequestSchema,
});

export const OrderConfirmationResponseSchema = z.strictObject({
  id: z.number().int(),
  status: z.string(),
  total: z.number().int(),
});

export const ShippingAddressResponseSchema = z.strictObject({
  street: z.string(),
  city: z.string(),
  region: z.string(),
  zipCode: z.string().nullable().optional(),
});

export const OrderLineResponseSchema = z.strictObject({
  productId: z.number().int(),
  productName: z.string(),
  unitPrice: z.number().int(),
  quantity: z.number().int(),
  subtotal: z.number().int(),
});

export const OrderResponseSchema = z.strictObject({
  id: z.number().int(),
  status: z.string(),
  total: z.number().int(),
  createdAt: z.string(),
  shippingAddress: ShippingAddressResponseSchema,
  items: z.array(OrderLineResponseSchema),
});

export const OrderListSchema = z.array(OrderResponseSchema);

export type ShippingAddressRequest = z.infer<typeof ShippingAddressRequestSchema>;
export type PlaceOrderRequest = z.infer<typeof PlaceOrderRequestSchema>;
export type OrderConfirmationResponse = z.infer<typeof OrderConfirmationResponseSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
