# Memory Index — QA-UnicorntStore-refactor

> The agent reads this file first before loading any memory file.
> Add a row here whenever you create or update a file in this directory.

| File | Topic | When to load |
|---|---|---|
| `arquitectura-unicornstore-2026-09-06.md` | **(vigente)** Stack post-refactor: Vite multipágina + backend Spring Boot/JWT, catálogo por API, filtro por categoría, checkout real (roto, DEF-004), entornos QA/prod, contrato `/api/v1`, módulos CAT/CARR/AUTH(diferido) | Antes de tocar cualquier spec/POM/test; al dudar sobre auth/API; al planificar AUTH o la API de carrito |
| `arquitectura-unicornstore-2026-08-26.md` | **(obsoleto)** Stack pre-refactor (estático, sin login/API). Baseline Sprint 1, preservado en `unicornt-store-frontend.keberflores.workers.dev` | Sólo para contexto histórico del Sprint 1 |
| `e2e-automation-patterns.md` | Gotchas de Playwright encontrados en Stage 5 (P0): matching de texto por regex, timing de localStorage, elementos compartidos sin rol ARIA, convención de asserts en spec vs. POM | Antes de escribir o revisar cualquier `.spec.ts` o Page Object en `qa/07-automation/e2e/` |
