# Bug Report — DEF-005: Los botones de autenticación están en inglés

| Field | Value |
|-------|-------|
| Bug ID | DEF-005 |
| Title | Los botones de envío de `login.html` y `register.html` dicen "Sign in" / "Create account" en una interfaz que por lo demás está en español |
| Severity | Low |
| Priority | P3 |
| Status | Open (encontrado durante Stage 6 re-baseline) |
| Assigned to | Unassigned |
| Module | Auth (aún sin módulo formal de QA) |
| Submodule | — |
| Environment | Stack QA: `https://unicornt-qa.keber.cl`. Encontrado el 2026-09-06. |
| Browser | Chromium 1.62 (Playwright) |
| Date reported | 2026-09-06 |
| GitHub Issue | (pendiente — `keber/unicornt-store-frontend`) |
| ADO WI | N/A |
| Related TCs | (ninguno todavía — el módulo AUTH está diferido) |

---

## Description

`login.html` tiene el `<h1>` "Iniciar sesión", labels "Email" / "Contraseña" y el enlace "¿No
tienes cuenta? Crear una" — todo en español — pero el botón de submit (`#login-submit`) dice
**"Sign in"**. Igual en `register.html`: `<h1>` "Crear cuenta", labels en español, pero
`#register-submit` dice **"Create account"**.

---

## Steps to Reproduce

| Step | Action |
|------|--------|
| 1 | Navigate to `{{QA_BASE_URL}}/login.html` |
| 2 | Leer el texto de `#login-submit` |
| 3 | Navigate to `{{QA_BASE_URL}}/register.html`, leer `#register-submit` |

---

## Expected Result

Textos en español, p. ej. "Iniciar sesión" y "Crear cuenta", consistentes con el resto de la UI.

## Actual Result

`#login-submit` = "Sign in"; `#register-submit` = "Create account".

---

## Fix Suggestion

Traducir los dos textos de botón en las plantillas de `login.html` / `register.html`.

---

## Changelog

| Version | Date | Description |
|---------|------|--------------|
| 1.0 | 2026-09-06 | Encontrado durante Stage 6 re-baseline. |
