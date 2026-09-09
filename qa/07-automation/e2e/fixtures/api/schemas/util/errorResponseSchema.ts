import { z } from 'zod';

/**
 * Uniform error payload returned by the Unicornt Store API.
 *
 * Derived from `unicornt-store-backend/docs/openapi.json` (`ErrorResponse` /
 * `FieldError`) and cross-checked against live QA responses on 2026-09-06:
 *   { message, code, status, timestamp, path, errors: [{ field, message }] }
 *
 * `errors` is `[]` unless the failure is a bean-validation failure, in which
 * case each entry names a rejected field (dotted paths for nested bodies,
 * e.g. `shippingAddress.region`).
 */
export const FieldErrorSchema = z.strictObject({
  field: z.string(),
  message: z.string(),
});

export const ErrorResponseSchema = z.strictObject({
  message: z.string(),
  code: z.string(),
  status: z.number().int(),
  timestamp: z.string(),
  path: z.string(),
  errors: z.array(FieldErrorSchema),
});

export type FieldError = z.infer<typeof FieldErrorSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
