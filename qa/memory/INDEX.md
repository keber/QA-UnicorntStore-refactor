# Memory Index — QA-UnicorntStore-refactor

> The agent reads this file first before loading any memory file.
> Add a row here whenever you create or update a file in this directory.

| File | Topic | When to load |
|---|---|---|
| `arquitectura-unicornstore-2026-08-26.md` | Stack real de la app (estático + vanilla JS, sin login/API), módulos identificados (CAT, CARR), qué NO existe | Antes de Stage 1 module analysis; al escribir cualquier page object o spec nuevo |
| `e2e-automation-patterns.md` | Gotchas de Playwright encontrados en Stage 5 (P0): matching de texto por regex, timing de localStorage, elementos compartidos sin rol ARIA, convención de asserts en spec vs. POM | Antes de escribir o revisar cualquier `.spec.ts` o Page Object en `qa/07-automation/e2e/` |
