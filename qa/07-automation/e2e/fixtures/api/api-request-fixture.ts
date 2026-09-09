import {
  test as base,
  request as playwrightRequest,
  type APIRequestContext,
} from '@playwright/test';
import { uniqueEmail } from '../test-helpers';
import {
  RegisterResponseSchema,
  TokenResponseSchema,
  type RegisterResponse,
  type TokenResponse,
} from './schemas/app/authSchema';

/**
 * API layer for the E2E suite. The 2026-09-06 refactor added a real backend
 * (`QA_API_URL`, Spring Boot + JWT); this reinstates the `apiRequest`
 * pattern the scaffold kept dormant — see the qa-automation skill's
 * `type-safety-and-data-strategy.md`.
 *
 * - `apiRequest` — one typed call against `QA_API_URL`, for assertions and
 *   `beforeEach`/`afterEach` setup. Never build a per-endpoint helper on top
 *   of it unless the setup is genuinely reused across 3+ files.
 * - `registerViaApi` — the "register a fresh user per run" strategy: create
 *   a unique account and return its credentials + a bearer token, for the
 *   checkout `test.fail()` guards (DEF-004) and any later auth work.
 *
 * Response shapes are validated with the Zod schemas in `schemas/` (derived
 * from `unicornt-store-backend/docs/openapi.json`).
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method: HttpMethod;
  /** Path relative to `QA_API_URL`, e.g. `/api/v1/products`. */
  url: string;
  /** JSON body; serialized automatically. */
  data?: unknown;
  /** Bearer token; sent as `Authorization: Bearer <token>`. */
  token?: string;
  /** Extra headers, merged last. */
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  /** Parsed JSON body, or `undefined` for 204 / empty responses. */
  body: T;
  headers: Record<string, string>;
}

export interface RegisteredUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userId: number;
  token: string;
}

export interface RegisterOverrides {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

const DEFAULT_PASSWORD = 'Passw0rd!qa';

function apiBaseUrl(): string {
  const base = process.env.QA_API_URL;
  if (!base) {
    throw new Error('[qa-framework] QA_API_URL is not set — check your .env file.');
  }
  return base.replace(/\/$/, '');
}

async function readBody<T>(
  // Playwright's APIResponse — kept structural to avoid importing the type name.
  res: { status(): number; headers(): Record<string, string>; text(): Promise<string> }
): Promise<T> {
  const raw = await res.text();
  if (!raw) return undefined as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export type ApiRequestFn = <T = unknown>(options: ApiRequestOptions) => Promise<ApiResponse<T>>;
export type RegisterViaApiFn = (overrides?: RegisterOverrides) => Promise<RegisteredUser>;

interface ApiFixtures {
  /** Live for the test; disposed automatically. */
  apiContext: APIRequestContext;
  apiRequest: ApiRequestFn;
  registerViaApi: RegisterViaApiFn;
}

export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const context = await playwrightRequest.newContext({ baseURL: apiBaseUrl() });
    await use(context);
    await context.dispose();
  },

  apiRequest: async ({ apiContext }, use) => {
    const fn: ApiRequestFn = async <T>(options: ApiRequestOptions): Promise<ApiResponse<T>> => {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.data === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers ?? {}),
      };
      const res = await apiContext.fetch(options.url, {
        method: options.method,
        headers,
        ...(options.data === undefined ? {} : { data: options.data }),
      });
      return {
        status: res.status(),
        ok: res.ok(),
        body: await readBody<T>(res),
        headers: res.headers(),
      };
    };
    await use(fn);
  },

  registerViaApi: async ({ apiRequest }, use) => {
    const fn: RegisterViaApiFn = async (overrides: RegisterOverrides = {}) => {
      const email = overrides.email ?? uniqueEmail();
      const password = overrides.password ?? DEFAULT_PASSWORD;
      const firstName = overrides.firstName ?? 'QA';
      const lastName = overrides.lastName ?? 'Automation';

      const registered = await apiRequest<RegisterResponse>({
        method: 'POST',
        url: '/api/v1/auth/register',
        data: { firstName, lastName, email, password },
      });
      if (registered.status !== 201) {
        throw new Error(
          `[registerViaApi] register failed: ${registered.status} ${JSON.stringify(registered.body)}`
        );
      }
      const account = RegisterResponseSchema.parse(registered.body);

      const loggedIn = await apiRequest<TokenResponse>({
        method: 'POST',
        url: '/api/v1/auth/login',
        data: { email, password },
      });
      if (loggedIn.status !== 200) {
        throw new Error(
          `[registerViaApi] login failed: ${loggedIn.status} ${JSON.stringify(loggedIn.body)}`
        );
      }
      const { token } = TokenResponseSchema.parse(loggedIn.body);

      return { email, password, firstName, lastName, userId: account.id, token };
    };
    await use(fn);
  },
});
