import { z } from 'zod';

/**
 * Auth endpoints of the Unicornt Store API (`/api/v1/auth/*`).
 *
 * Derived from `unicornt-store-backend/docs/openapi.json` and cross-checked
 * against live QA responses on 2026-09-06:
 * - `POST /auth/register` -> 201 `RegisterResponse` (no token; auto-login is
 *   a frontend behavior). 400 `VALIDATION_ERROR`, 409 `RESOURCE_CONFLICT`.
 * - `POST /auth/login`    -> 200 `TokenResponse`. 401 on bad credentials.
 * - `GET  /auth/me`       -> 200 `MeResponse`. 401 without a valid token.
 */

export const RegisterRequestSchema = z.strictObject({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});

/** `POST /auth/register` 201 body — same shape as `MeResponse`. */
export const RegisterResponseSchema = z.strictObject({
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
});

export const LoginRequestSchema = z.strictObject({
  email: z.string(),
  password: z.string(),
});

export const TokenResponseSchema = z.strictObject({
  token: z.string(),
  expiresIn: z.number().int(),
});

export const MeResponseSchema = z.strictObject({
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
