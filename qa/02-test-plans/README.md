# 02-test-plans/

Planes de Pruebas por sprint y módulo. Cada documento combina contexto de plan (alcance,
estrategia, precondiciones) con la Tabla de Pruebas detallada (pasos numerados, resultado
esperado, trazabilidad) — es el artefacto primario consumido por el track de automatización y,
si algún día se habilita, por la integración con Azure DevOps.

```
02-test-plans/
├── README.md                                                          ← este archivo
└── sprints/
    └── Sprint-{NNN}/
        └── Plan-de-Pruebas-{proyecto}-Sprint-{NNN}-{modulo}.md        ← uno por módulo
```

## Sprint 001

| Documento | Módulo | TCs | Estado |
|---|---|---|---|
| `sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CAT.md` | Catálogo (CAT) | 105 | ✅ Creado 2026-08-26 |
| `sprints/Sprint-001/Plan-de-Pruebas-QA-UnicorntStore-refactor-Sprint-001-CARR.md` | Carrito (CARR) | 55 | ✅ Creado 2026-08-26 |

Este es el primer sprint del proyecto: ambos documentos son la línea base de regresión sobre la
que se validará el futuro refactor de stack. No hay un archivo consolidado
`Plan-de-Pruebas-{proyecto}-Sprint-001.md` — ese artefacto lo genera `@keber/ado-qa
consolidate-sprint`, no se crea manualmente, y no aplica mientras la integración con Azure DevOps
esté deshabilitada (`qa/qa-framework.config.json` → `integrations.azureDevOps.enabled: false`).

Ver también `qa/00-standards/naming-conventions.md` y
`.github/skills/qa-test-plan/references/plan-de-pruebas-template.md` para las convenciones de
formato.
