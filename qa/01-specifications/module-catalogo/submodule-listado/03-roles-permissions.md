# Roles and Permissions — Listado de productos

## Access Matrix

| Feature / Action | Visitante (único "rol") |
|-------------------|:---:|
| Ver listado de productos | ✅ |
| Navegar a detalle ("Ver más") | ✅ |
| Agregar producto al carrito | ✅ |
| Buscar / filtrar productos | N/A (feature inexistente) |

## Test User Reference

No aplica. La aplicación no tiene login, registro ni roles — es confirmado explícitamente por el
dueño del proyecto y verificado en el código (`qa/qa-framework.config.json` → `project.loginPath:
null`, `testUsers: []`). Cualquier TC de este submódulo se ejecuta como visitante anónimo, sin
credenciales.

**Notes**: No reintroducir fixtures de autenticación (`setup` project, `storageState`) a menos
que se confirme que el refactor de la aplicación agrega un backend con login. Ver
`qa/memory/arquitectura-unicornstore-2026-08-26.md`.
