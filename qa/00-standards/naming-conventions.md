# Naming Conventions

> Ver también `qa/qa-framework.config.json` → `conventions` (fuente de verdad de los patrones de
> ID) y `qa/QA-STRUCTURE-GUIDE.md` para las reglas de carpetas.

## Módulos y códigos asignados

| Código | Módulo | Submódulos | Estado |
|---|---|---|---|
| CAT | Catálogo | LISTADO, DETALLE | ✅ Stage 1 completo (2026-08-26) |
| CARR | Carrito | CARRITO | ✅ Stage 1 completo (2026-08-26) |

## Patrones de ID

| Patrón | Ejemplo | Uso |
|---|---|---|
| `TC-{MODULE}-{SUBMODULE}-{NNN}` | `TC-CAT-LISTADO-001` | Test case |
| `RN-{MODULE}-{NNN}` | `RN-CAT-007` | Business rule (numeración compartida entre submódulos del mismo módulo) |
| `FL-{MODULE}-{NNN}` | `FL-CAT-003` | Workflow |
| `DEF-{NNN}` | `DEF-001` | Defecto (numeración global del proyecto, no por módulo) |

## Reglas de carpetas

- Módulo: `01-specifications/module-{kebab-name}` (ej. `module-catalogo`)
- Submódulo: `submodule-{kebab-name}` (ej. `submodule-listado`, `submodule-detalle`)
- Código de módulo: 2–6 letras mayúsculas, único (ver tabla arriba antes de asignar uno nuevo)
